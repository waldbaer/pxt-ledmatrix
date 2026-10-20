// Tests for the ledmatrix extension: the spec scenarios as control.assert checks.
// A failed check shows a panic code on the board. Each group runs in its own
// function so its matrices can be garbage collected afterwards.

// ---- progress on serial (115200 baud), so a run on the board can be followed from a PC;
// a failed check prints "ASSERTION FAILED" and its message there, then shows panic code 098
function run(name: string, test: () => void) {
    serial.writeLine("ledmatrix test: " + name)
    test()
}

// ---- send hook: count frames and keep a copy of the last one
let sends = 0
let lastFrame: Buffer = null
let lastBrightness = -1
ledmatrix._sendHook = function (buf: Buffer, brightness: number) {
    sends++
    lastFrame = buf.slice()
    lastBrightness = brightness
}

// ---- matrix-display: create
function testCreate() {
    sends = 0
    const m = ledmatrix.create(DigitalPin.P0, 16, 16)
    control.assert(m.width() == 16 && m.height() == 16, "create 16x16")
    control.assert(sends == 0, "create sends nothing")

    const s = ledmatrix.create(DigitalPin.P0, 0, -3)
    control.assert(s.width() == 1 && s.height() == 1, "invalid size")

    const t = ledmatrix.create(DigitalPin.P0, 7.9, 2.5)
    control.assert(t.width() == 7 && t.height() == 2, "size truncated")
}

// ---- matrix-display: layouts
function testLayouts() {
    // default: columns, zig-zag, first LED top left
    const m = ledmatrix.create(DigitalPin.P0, 16, 16)
    control.assert(m.ledIndex(0, 0) == 0, "default (0,0)")
    control.assert(m.ledIndex(0, 15) == 15, "default (0,15)")
    control.assert(m.ledIndex(1, 15) == 16, "default (1,15)")
    control.assert(m.ledIndex(1, 0) == 31, "default (1,0)")
    control.assert(m.ledIndex(15, 0) == 255, "default (15,0)")
    control.assert(m.ledIndex(15, 15) == 240, "default (15,15)")

    const a = ledmatrix.create(DigitalPin.P0, 8, 8)
    a.setLayout(LedMatrixWiring.RowsZigZag, LedMatrixCorner.TopLeft)
    control.assert(a.ledIndex(0, 0) == 0, "rows zz (0,0)")
    control.assert(a.ledIndex(7, 0) == 7, "rows zz (7,0)")
    control.assert(a.ledIndex(7, 1) == 8, "rows zz (7,1)")
    control.assert(a.ledIndex(0, 1) == 15, "rows zz (0,1)")
    control.assert(a.ledIndex(8, 0) == -1, "outside -> -1")
    control.assert(a.ledIndex(0, -1) == -1, "outside top -> -1")

    const b = ledmatrix.create(DigitalPin.P0, 32, 8)
    b.setLayout(LedMatrixWiring.ColumnsZigZag, LedMatrixCorner.BottomLeft)
    control.assert(b.ledIndex(0, 7) == 0, "cols zz bl (0,7)")
    control.assert(b.ledIndex(0, 0) == 7, "cols zz bl (0,0)")
    control.assert(b.ledIndex(1, 0) == 8, "cols zz bl (1,0)")
    control.assert(b.ledIndex(31, 7) == 255, "cols zz bl (31,7)")

    const c = ledmatrix.create(DigitalPin.P0, 8, 16)
    c.setLayout(LedMatrixWiring.Rows, LedMatrixCorner.BottomRight)
    control.assert(c.ledIndex(7, 15) == 0, "rows br (7,15)")
    control.assert(c.ledIndex(0, 15) == 7, "rows br (0,15)")
    control.assert(c.ledIndex(7, 14) == 8, "rows br (7,14)")

    const d = ledmatrix.create(DigitalPin.P0, 4, 4)
    d.setLayout(LedMatrixWiring.Columns, LedMatrixCorner.TopRight)
    control.assert(d.ledIndex(3, 0) == 0, "cols tr (3,0)")
    control.assert(d.ledIndex(3, 3) == 3, "cols tr (3,3)")
    control.assert(d.ledIndex(2, 0) == 4, "cols tr (2,0)")

    // the map used by show() agrees with ledIndex for all 16 layouts
    const e = ledmatrix.create(DigitalPin.P0, 5, 3)
    for (let wiring = 0; wiring < 4; wiring++) {
        for (let corner = 0; corner < 4; corner++) {
            e.setLayout(wiring, corner)
            for (let y = 0; y < 3; y++)
                for (let x = 0; x < 5; x++)
                    control.assert(e._map.getNumber(NumberFormat.UInt16LE, (y * 5 + x) * 2) == e.ledIndex(x, y), "map")
        }
    }
}

// the color an LED receives: stored bytes scaled like the native driver does
function received(m: ledmatrix.Matrix, x: number, y: number, rgb: boolean): number {
    const o = m.ledIndex(x, y) * 3
    const a = (lastFrame[o] * lastBrightness) >> 8
    const b = (lastFrame[o + 1] * lastBrightness) >> 8
    const c = (lastFrame[o + 2] * lastBrightness) >> 8
    return rgb ? (a << 16) | (b << 8) | c : (b << 16) | (a << 8) | c
}

// the color shown at a pixel in the last frame (GRB order, before brightness)
function shown(m: ledmatrix.Matrix, x: number, y: number): number {
    const o = m.ledIndex(x, y) * 3
    return (lastFrame[o + 1] << 16) | (lastFrame[o] << 8) | lastFrame[o + 2]
}

// ---- matrix-display: show, brightness, color order, skipping unchanged frames
function testShow() {
    sends = 0
    const m = ledmatrix.create(DigitalPin.P0, 16, 16)
    m.show()
    control.assert(sends == 1, "first show sends")
    control.assert(lastFrame.length == 768, "frame size 768")
    control.assert(lastBrightness == 33, "default brightness 32 -> 33")
    m.show()
    control.assert(sends == 1, "repeated show skipped")

    // default brightness: 0xFF0000 arrives as red 32
    m.setPixel(0, 0, 0xFF0000)
    m.show()
    control.assert(sends == 2, "change sends")
    control.assert(received(m, 0, 0, false) == 0x200000, "default brightness red 32")

    // clamping: 300 -> 255, sent unchanged
    m.setBrightness(300)
    m.setPixel(0, 0, 0xFF8000)
    m.show()
    control.assert(lastBrightness == 256, "brightness 300 -> 256")
    control.assert(received(m, 0, 0, false) == 0xFF8000, "full brightness unchanged")
    m.setBrightness(-5)
    m.show()
    control.assert(lastBrightness == 1, "brightness -5 -> 0 -> 1")
    control.assert(received(m, 0, 0, false) == 0, "brightness 0 sends 0")

    // GRB by default, RGB on request
    m.setBrightness(255)
    m.setPixel(0, 0, 0x112233)
    m.show()
    control.assert(lastFrame[0] == 0x22 && lastFrame[1] == 0x11 && lastFrame[2] == 0x33, "GRB order")
    m.setColorOrder(LedMatrixColorOrder.RGB)
    m.show()
    control.assert(lastFrame[0] == 0x11 && lastFrame[1] == 0x22 && lastFrame[2] == 0x33, "RGB order")
    m.setColorOrder(LedMatrixColorOrder.GRB)
    m.show()
    control.assert(lastFrame[0] == 0x22 && lastFrame[1] == 0x11, "back to GRB")

    // calling any setter forces a resend, even with the same value
    const before = sends
    m.setBrightness(255)
    m.show()
    m.setColorOrder(LedMatrixColorOrder.GRB)
    m.show()
    m.setLayout(LedMatrixWiring.ColumnsZigZag, LedMatrixCorner.TopLeft)
    m.show()
    control.assert(sends == before + 3, "setters force resend")
    m.show()
    control.assert(sends == before + 3, "no resend without change")

    // layout change keeps the picture and is used from the next show on
    m.setPixel(0, 0, 0)
    m.setPixel(1, 0, 0x0000FF)
    m.show()
    control.assert(lastFrame[31 * 3 + 2] == 0xFF, "(1,0) is LED 31 by default")
    m.setLayout(LedMatrixWiring.RowsZigZag, LedMatrixCorner.TopLeft)
    control.assert(m.getPixel(1, 0) == 0x0000FF, "layout change keeps drawing layer")
    m.show()
    control.assert(lastFrame[1 * 3 + 2] == 0xFF && lastFrame[31 * 3 + 2] == 0, "(1,0) is LED 1 after change")
}

// number of lit pixels in the drawing layer
function litCount(m: ledmatrix.Matrix): number {
    let n = 0
    for (let y = 0; y < m.height(); y++)
        for (let x = 0; x < m.width(); x++)
            if (m.getPixel(x, y) != 0) n++
    return n
}

// ---- matrix-drawing: pixels and wrap-around
function testPixels() {
    const m = ledmatrix.create(DigitalPin.P0, 8, 8)
    m.setPixel(2, 3, 0x123456)
    control.assert(m.getPixel(2, 3) == 0x123456, "round trip")
    m.setPixel(4.7, 5.2, 0xFF0000)
    control.assert(m.getPixel(4, 5) == 0xFF0000, "coordinates truncated")
    m.setBrightness(10)
    control.assert(m.getPixel(2, 3) == 0x123456, "brightness keeps stored colors")
    m.setPixel(2, 3, 0)
    m.setPixel(4, 5, 0)

    m.setPixel(-1, 0, 0xFF0000)
    m.setPixel(8, 0, 0xFF0000)
    m.setPixel(0, 8, 0xFF0000)
    control.assert(litCount(m) == 0, "outside is ignored")
    control.assert(m.getPixel(-1, 0) == 0, "outside reads 0")

    m.setWrap(true)
    m.setPixel(8, -1, 0xFF0000)
    control.assert(m.getPixel(0, 7) == 0xFF0000, "drawing wraps")
    control.assert(m.getPixel(8, -1) == 0xFF0000, "reading wraps")
    control.assert(litCount(m) == 1, "wrap sets one pixel")

    // nothing is sent until show; the drawing persists across frames
    sends = 0
    m.setWrap(false)
    m.setPixel(1, 1, 0x00FF00)
    control.assert(sends == 0, "drawing without show sends nothing")
    m.show()
    m.setPixel(2, 2, 0x0000FF)
    m.show()
    control.assert(sends == 2, "two frames")
    control.assert(lastFrame[m.ledIndex(1, 1) * 3] == 0xFF, "pixel persists across frames")

    // same program, different wiring: the top-left LED lights up on both panels
    const a = ledmatrix.create(DigitalPin.P0, 8, 8)
    const b = ledmatrix.create(DigitalPin.P0, 8, 8)
    b.setLayout(LedMatrixWiring.RowsZigZag, LedMatrixCorner.BottomRight)
    a.setPixel(0, 0, 0xFFFFFF)
    a.show()
    control.assert(lastFrame[0] == 0xFF, "a: top left is LED 0")
    b.setPixel(0, 0, 0xFFFFFF)
    b.show()
    control.assert(b.ledIndex(0, 0) == 56 && lastFrame[56 * 3] == 0xFF && lastFrame[0] == 0, "b: top left is LED 56")
}

// stamps a shape into the drawing layer and deletes it: how a program paints a figure
function paint(s: ledmatrix.Shape) {
    s.stamp()
    s.remove()
}

// ---- matrix-shapes: shape geometry; matrix-drawing: drawing layer, fill, clear
function testShapeGeometry() {
    const m = ledmatrix.create(DigitalPin.P0, 8, 8)
    paint(m.createRectangle(1, 1, 2, 2, 0xFF0000, true))
    control.assert(m.getPixel(1, 1) == 0xFF0000 && m.getPixel(2, 1) == 0xFF0000 && m.getPixel(1, 2) == 0xFF0000
        && m.getPixel(2, 2) == 0xFF0000 && m._shapes.length == 0, "a figure is painted by stamping")
    m.clear()

    paint(m.createLine(0, 0, 7, 7, 0xFF0000))
    for (let i = 0; i < 8; i++) control.assert(m.getPixel(i, i) == 0xFF0000, "diagonal")
    control.assert(litCount(m) == 8, "diagonal only")
    m.clear()
    control.assert(litCount(m) == 0, "clear")

    paint(m.createLine(3, 3, 3, 3, 0xFF0000))
    control.assert(m.getPixel(3, 3) == 0xFF0000 && litCount(m) == 1, "single point")
    m.clear()
    paint(m.createLine(6, 1, 0, 3, 0xFF0000))
    control.assert(m.getPixel(6, 1) == 0xFF0000 && m.getPixel(0, 3) == 0xFF0000 && litCount(m) == 7, "line end points")
    m.clear()

    paint(m.createRectangle(0, 0, 8, 8, 0x0000FF, false))
    control.assert(m.getPixel(0, 7) == 0x0000FF && m.getPixel(3, 3) == 0, "outline")
    control.assert(litCount(m) == 28, "outline pixels")
    m.clear()
    paint(m.createRectangle(1, 1, 2, 3, 0x00FF00, true))
    control.assert(litCount(m) == 6, "filled 2x3: 6 pixels")
    for (let y = 1; y <= 3; y++)
        for (let x = 1; x <= 2; x++) control.assert(m.getPixel(x, y) == 0x00FF00, "filled 2x3")
    m.clear()
    paint(m.createRectangle(1, 1, 0, 3, 0x00FF00, true))
    paint(m.createRectangle(1, 1, 3, -1, 0x00FF00, false))
    control.assert(litCount(m) == 0, "empty rectangles draw nothing")

    paint(m.createCircle(3, 3, 2, 0x00FF00, true))
    control.assert(m.getPixel(3, 3) != 0 && m.getPixel(1, 3) != 0 && m.getPixel(5, 3) != 0
        && m.getPixel(3, 1) != 0 && m.getPixel(3, 5) != 0, "filled circle")
    control.assert(m.getPixel(1, 1) == 0, "filled circle corner")
    m.clear()
    paint(m.createCircle(3, 3, 2, 0x00FF00, false))
    control.assert(m.getPixel(3, 3) == 0 && m.getPixel(1, 3) != 0 && m.getPixel(3, 5) != 0, "circle outline")
    m.clear()
    paint(m.createCircle(4, 4, 0, 0x00FF00, false))
    control.assert(m.getPixel(4, 4) == 0x00FF00 && litCount(m) == 1, "radius 0")
    m.clear()
    paint(m.createCircle(4, 4, -1, 0x00FF00, true))
    control.assert(litCount(m) == 0, "negative radius")

    m.fill(0x102030)
    control.assert(m.getPixel(0, 0) == 0x102030 && m.getPixel(7, 7) == 0x102030 && litCount(m) == 64, "fill")
    m.clear()
    control.assert(litCount(m) == 0, "clear after fill")

    // clear keeps shapes
    const dot = m.createDot(2, 2, 0xFFFF00)
    m.fill(0x0000FF)
    m.show()
    m.clear()
    m.show()
    control.assert(litCount(m) == 0 && shown(m, 2, 2) == 0xFFFF00 && shown(m, 3, 3) == 0, "clear keeps shapes")
}

// fills every pixel with a color made from its position (never 0)
function numberPixels(m: ledmatrix.Matrix) {
    for (let y = 0; y < m.height(); y++)
        for (let x = 0; x < m.width(); x++) m.setPixel(x, y, (x + 1) * 256 + y + 1)
}

// checks that numberPixels() content moved by dx, dy
function checkShifted(m: ledmatrix.Matrix, dx: number, dy: number, wrap: boolean, msg: string) {
    const w = m.width()
    const h = m.height()
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let sx = x - dx
            let sy = y - dy
            let want = 0
            if (wrap) {
                sx = ((sx % w) + w) % w
                sy = ((sy % h) + h) % h
            }
            if (sx >= 0 && sy >= 0 && sx < w && sy < h) want = (sx + 1) * 256 + sy + 1
            control.assert(m.getPixel(x, y) == want, msg)
        }
    }
}

// ---- matrix-drawing: shift
function testShift() {
    const m = ledmatrix.create(DigitalPin.P0, 8, 8)
    m.setPixel(0, 0, 0xFF0000)
    m.shift(1, 0)
    control.assert(m.getPixel(1, 0) == 0xFF0000 && m.getPixel(0, 0) == 0, "shift without wrap")
    m.clear()
    m.setWrap(true)
    m.setPixel(7, 0, 0xFF0000)
    m.shift(1, 0)
    control.assert(m.getPixel(0, 0) == 0xFF0000 && litCount(m) == 1, "shift with wrap")

    // a non-square matrix with every pixel different, both axes, both signs
    const r = ledmatrix.create(DigitalPin.P0, 5, 4)
    const moves = [[1, 0], [-2, 0], [0, 1], [0, -3], [2, -1], [-1, 2], [4, 3], [-4, -3]]
    for (let wrap = 0; wrap < 2; wrap++) {
        r.setWrap(wrap == 1)
        for (const mv of moves) {
            numberPixels(r)
            r.shift(mv[0], mv[1])
            checkShifted(r, mv[0], mv[1], wrap == 1, "shift by " + mv[0] + "," + mv[1] + " wrap " + wrap)
        }
    }
    // moving everything out clears without wrap; a full turn changes nothing with wrap
    r.setWrap(false)
    for (const mv of [[5, 0], [-5, 0], [0, 4], [0, -9]]) {
        numberPixels(r)
        r.shift(mv[0], mv[1])
        control.assert(litCount(r) == 0, "shift out clears")
    }
    r.setWrap(true)
    numberPixels(r)
    r.shift(10, -8)
    checkShifted(r, 0, 0, true, "full turn")
    r.shift(13, 9)
    checkShifted(r, 3, 1, true, "more than a turn")

    sends = 0
    r.show()
    r.shift(1, 0)
    r.show()
    control.assert(sends == 2, "shift sends")
}

// ---- matrix-drawing: colors
function testColors() {
    control.assert(ledmatrix.colors(LedMatrixColors.Orange) == 0xFFA500, "orange")
    control.assert(ledmatrix.colors(LedMatrixColors.Purple) == 0xFF00FF, "purple")
    control.assert(ledmatrix.colors(LedMatrixColors.Black) == 0, "black")
    control.assert(ledmatrix.rgb(255, 128, 0) == 0xFF8000, "mixing")
    control.assert(ledmatrix.rgb(300, -5, 0) == 0xFF0000, "out of range")
    control.assert(ledmatrix.rgb(12.9, 0.5, 255.9) == 0x0C00FF, "truncated")
    control.assert(ledmatrix.hue(0) == 0xFF0000, "hue 0")
    control.assert(ledmatrix.hue(60) == 0xFFFF00, "hue 60")
    control.assert(ledmatrix.hue(120) == 0x00FF00, "hue 120")
    control.assert(ledmatrix.hue(240) == 0x0000FF, "hue 240")
    control.assert(ledmatrix.hue(360) == 0xFF0000, "hue 360")
    control.assert(ledmatrix.hue(-120) == 0x0000FF, "hue -120")
    control.assert(ledmatrix.hue(120.7) == 0x00FF00, "hue truncated")
}

// a pattern as text: "#" pattern color, letters for fixed colors, "." off, rows joined by "|"
function patternText(p: ledmatrix.Pattern): string {
    let t = ""
    for (let y = 0; y < p.height(); y++) {
        if (y > 0) t += "|"
        for (let x = 0; x < p.width(); x++) {
            const code = p._get(x, y)
            t += code == 0 ? "." : code == 1 ? "#" : "roygcbpw".charAt(code - 2)
        }
    }
    return t
}

// ---- matrix-shapes: patterns, stamped pattern shapes
function testPatterns() {
    const t = ledmatrix.grid(`
        . . . . .
        . . # . .
        . # # # .
        . . . . .
        . . . . .
        `)
    control.assert(t.width() == 3 && t.height() == 2 && patternText(t) == ".#.|###", "T trimmed")
    const none = ledmatrix.grid(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    control.assert(none.width() == 1 && none.height() == 1 && patternText(none) == ".", "empty grid")

    control.assert(patternText(ledmatrix.pattern(".#.|###")) == ".#.|###", "rows with separator")
    control.assert(patternText(ledmatrix.pattern("#|###")) == "#..|###", "short rows padded")
    control.assert(patternText(ledmatrix.pattern("..|.#|..")) == "#", "trimmed")
    control.assert(patternText(ledmatrix.pattern("R_G|0B0")) == "r.g|.b.", "off chars and upper case")
    control.assert(patternText(ledmatrix.pattern("o y\tc|p\rw*")) == "oyc|pw#", "whitespace ignored, other chars")
    control.assert(patternText(ledmatrix.pattern("...|...")) == ".", "nothing lit")
    control.assert(patternText(ledmatrix.pattern("")) == ".", "empty text")
    const heart = ledmatrix.pattern(`
        . r r . r r .
        r r r r r r r

        . . . r . . .
    `)
    control.assert(patternText(heart) == ".rr.rr.|rrrrrrr|...r...", "multi-line template")

    // multi-color pattern shape stamped into the drawing layer; off pixels stay
    const m = ledmatrix.create(DigitalPin.P0, 10, 20)
    m.setPixel(1, 18, 0x123456)
    paint(m.createPattern(ledmatrix.pattern("r.g|.b."), 0, 18, 0))
    control.assert(m.getPixel(0, 18) == 0xFF0000 && m.getPixel(2, 18) == 0x00FF00
        && m.getPixel(1, 19) == 0x0000FF, "multi-color pattern")
    control.assert(m.getPixel(1, 18) == 0x123456, "off pixel leaves drawing unchanged")
    paint(m.createPattern(ledmatrix.pattern("#y"), 8, 0, 0x00FFFF))
    control.assert(m.getPixel(8, 0) == 0x00FFFF && m.getPixel(9, 0) == 0xFFFF00, "pattern color and letter")
}

// ---- matrix-shapes: shapes on top of the drawing layer
function testShapes() {
    const m = ledmatrix.create(DigitalPin.P0, 8, 8)

    // moving a shape never erases drawn pixels
    m.setPixel(2, 2, 0xFF0000)
    const box = m.createRectangle(1, 1, 3, 3, 0xFFFFFF, true)
    m.show()
    control.assert(shown(m, 2, 2) == 0xFFFFFF, "shape covers drawing")
    box.moveBy(4, 0)
    m.show()
    control.assert(shown(m, 2, 2) == 0xFF0000 && shown(m, 5, 2) == 0xFFFFFF, "moving does not erase")
    control.assert(m.getPixel(5, 2) == 0, "shapes don't change the drawing layer")
    box.remove()
    m.clear()

    // rectangle shape at its top left
    const paddle = m.createRectangle(7, 2, 1, 3, 0xFFFFFF, true)
    m.show()
    control.assert(shown(m, 7, 2) == 0xFFFFFF && shown(m, 7, 3) == 0xFFFFFF && shown(m, 7, 4) == 0xFFFFFF
        && shown(m, 7, 1) == 0 && shown(m, 7, 5) == 0, "rectangle shape")
    control.assert(litCount(m) == 0, "rectangle shape leaves drawing layer")
    control.assert(paddle.width() == 1 && paddle.height() == 3, "rectangle size")
    paddle.remove()

    // later shapes cover earlier ones; bring to front changes that
    const a = m.createDot(4, 4, 0xFF0000)
    const b = m.createCircle(4, 4, 1, 0x00FF00, true)
    m.show()
    control.assert(shown(m, 4, 4) == 0x00FF00, "later shape on top")
    a.bringToFront()
    m.show()
    control.assert(shown(m, 4, 4) == 0xFF0000 && shown(m, 4, 3) == 0x00FF00, "bring to front")
    control.assert(b.width() == 3 && b.height() == 3, "circle r=1 size")

    // hidden and removed shapes are not shown
    a.setVisible(false)
    b.setVisible(false)
    m.show()
    control.assert(shown(m, 4, 4) == 0, "hidden shapes not shown")
    a.setVisible(true)
    m.show()
    control.assert(shown(m, 4, 4) == 0xFF0000, "shown again")
    a.remove()
    m.show()
    control.assert(shown(m, 4, 4) == 0, "removed shape not shown")
    b.remove()

    // line keeps its direction when moved
    const line = m.createLine(0, 0, 3, 1, 0xFFFFFF)
    control.assert(line.width() == 4 && line.height() == 2, "line size")
    line.moveBy(2, 2)
    m.show()
    control.assert(line.x() == 2 && line.y() == 2, "line start moved")
    control.assert(shown(m, 2, 2) == 0xFFFFFF && shown(m, 5, 3) == 0xFFFFFF && shown(m, 0, 0) == 0, "line moved")
    const back = m.createLine(3.9, 1, 0, 0, 0xFFFFFF)
    control.assert(back.x() == 3 && back.y() == 1 && back.width() == 4 && back.height() == 2, "line backwards")
    m.removeAllShapes()
    m.show()
    control.assert(shown(m, 2, 2) == 0, "all shapes removed")

    // positions and sizes
    const c = m.createCircle(1, 3, 2, 0x0000FF, false)
    c.moveBy(2, -1)
    control.assert(c.x() == 3 && c.y() == 2, "move and read back")
    control.assert(c.width() == 5 && c.height() == 5, "circle size")
    c.setPosition(-5.5, 20.2)
    control.assert(c.x() == -5 && c.y() == 20, "set position truncated, outside allowed")
    m.show()
    const d = m.createDot(1, 1, 0xFFFFFF)
    control.assert(d.width() == 1 && d.height() == 1, "dot size")
    const t = m.createPattern(ledmatrix.pattern(".#.|###"), 3, 0, 0xFF00FF)
    control.assert(t.x() == 3 && t.y() == 0 && t.width() == 3 && t.height() == 2, "pattern shape position")

    // pattern letters keep their color
    const s = m.createPattern(ledmatrix.pattern("r#"), 0, 7, 0x0000FF)
    s.setColor(0x00FF00)
    m.show()
    control.assert(shown(m, 0, 7) == 0xFF0000 && shown(m, 1, 7) == 0x00FF00, "set color keeps letters")
    m.removeAllShapes()

    // every shape change makes the next show send; reading does not
    const e = m.createRectangle(0, 0, 2, 2, 0xFFFFFF, true)
    const f = m.createDot(5, 5, 0xFFFFFF)
    m.show()
    let n = sends
    m.show()
    control.assert(e.x() + e.y() + e.width() + e.height() == 4, "getters")
    m.show()
    control.assert(sends == n, "reading does not send")
    e.moveBy(1, 0)
    m.show()
    control.assert(sends == n + 1, "move sends")
    e.setPosition(1, 0)
    m.show()
    control.assert(sends == n + 2, "set position sends")
    e.setColor(0xFF0000)
    m.show()
    control.assert(sends == n + 3, "set color sends")
    e.setBrightness(100)
    m.show()
    control.assert(sends == n + 4, "set brightness sends")
    e.setVisible(true)
    m.show()
    control.assert(sends == n + 5, "set visible sends")
    e.bringToFront()
    m.show()
    control.assert(sends == n + 6, "bring to front sends")
    f.remove()
    m.show()
    control.assert(sends == n + 7, "remove sends")
    m.createDot(0, 0, 0xFFFFFF)
    m.show()
    control.assert(sends == n + 8, "create sends")
    m.removeAllShapes()
    m.show()
    control.assert(sends == n + 9, "remove all sends")
}

// ---- matrix-shapes: shape brightness
function testShapeBrightness() {
    const m = ledmatrix.create(DigitalPin.P0, 8, 8)
    m.setBrightness(255)

    // new shapes are at full brightness
    const d = m.createDot(0, 0, 0xFF8000)
    m.show()
    control.assert(received(m, 0, 0, false) == 0xFF8000, "shape brightness default 255")

    // dimmed shape
    d.setBrightness(127)
    m.show()
    control.assert(received(m, 0, 0, false) == 0x7F4000, "dimmed shape")

    // clamping and truncation
    d.setBrightness(300)
    m.show()
    control.assert(received(m, 0, 0, false) == 0xFF8000, "shape brightness 300 -> 255")
    d.setBrightness(127.9)
    m.show()
    control.assert(received(m, 0, 0, false) == 0x7F4000, "shape brightness 127.9 -> 127")
    d.setBrightness(-5)
    m.show()
    control.assert(received(m, 0, 0, false) == 0, "shape brightness -5 -> 0")
    d.remove()

    // pattern letters are dimmed too
    const s = m.createPattern(ledmatrix.pattern("r#"), 0, 1, 0x0000FF)
    s.setBrightness(127)
    m.show()
    control.assert(received(m, 0, 1, false) == 0x7F0000 && received(m, 1, 1, false) == 0x00007F, "pattern letters dimmed")
    s.remove()

    // the levels multiply: about half and about half give about a quarter
    m.setBrightness(127)
    const w = m.createDot(2, 2, 0xFFFFFF)
    w.setBrightness(127)
    m.show()
    control.assert(received(m, 2, 2, false) == 0x3F3F3F, "brightness levels multiply")
    w.remove()

    // the default matrix brightness 32 applies on top
    const g = ledmatrix.create(DigitalPin.P0, 8, 8)
    const r = g.createDot(0, 0, 0xFF0000)
    r.setBrightness(127)
    g.show()
    control.assert(shown(g, 0, 0) == 0x7F0000 && received(g, 0, 0, false) == 0x100000, "matrix brightness on top")

    // brightness 0 covers the drawing and still collides like at 255
    m.setBrightness(255)
    m.setPixel(2, 2, 0xFF0000)
    const z = m.createDot(2, 2, 0xFFFFFF)
    z.setBrightness(0)
    m.show()
    control.assert(received(m, 2, 2, false) == 0, "brightness 0 covers the drawing")
    const o = m.createDot(2, 2, 0x00FF00)
    control.assert(z.touchesDrawing() && z.overlaps(o) && o.overlaps(z), "brightness 0 still collides")
    control.assert(z.wouldOverlap(o, 0, 0) && !z.canMoveBy(0, 0), "brightness 0 still blocks")
    control.assert(maskClear(m), "mask clear after brightness 0 queries")
    m.removeAllShapes()
    m.clear()

    // the brightness stays with the shape
    const k = m.createDot(0, 0, 0xFF0000)
    k.setBrightness(127)
    k.setColor(0x00FF00)
    k.moveBy(1, 0)
    m.show()
    control.assert(received(m, 1, 0, false) == 0x007F00, "recolor and move keep the brightness")
    const v = m.createDot(0, 6, 0xFF0000)
    v.setBrightness(127)
    v.setVisible(false)
    v.setVisible(true)
    m.show()
    control.assert(received(m, 0, 6, false) == 0x7F0000, "hide and show keep the brightness")
    const sp = m.createPattern(ledmatrix.pattern("##"), 0, 4, 0xFF0000)
    sp.setBrightness(127)
    sp.rotate(LedMatrixRotation.Right)
    sp.flip(LedMatrixFlip.Vertical)
    sp.setPattern(ledmatrix.pattern("#"))
    sp.bringToFront()
    const nu = m.createNumber(1, 4, 0, 0xFF0000)
    nu.setBrightness(127)
    nu.setNumber(7)
    m.show()
    control.assert(received(m, sp.x(), sp.y(), false) == 0x7F0000 && received(m, 4, 0, false) == 0x7F0000,
        "rotate, flip, set pattern, bring to front and set number keep the brightness")
    const b = m.createDot(3, 3, 0xFF8000)
    b.setBrightness(0)
    m.show()
    b.setBrightness(255)
    m.show()
    control.assert(received(m, 3, 3, false) == 0xFF8000, "back to full brightness")
    control.assert(b.x() == 3 && b.y() == 3 && m.getPixel(3, 3) == 0, "brightness changes nothing else")
    m.removeAllShapes()

    // drawing after a dimmed shape was shown is not dimmed
    const dim = m.createDot(7, 7, 0xFFFFFF)
    dim.setBrightness(10)
    m.show()
    m.setPixel(5, 5, 0xFF8000)
    m.setPixel(6, 6, 0x00FF00)
    control.assert(m.getPixel(5, 5) == 0xFF8000 && m.getPixel(6, 6) == 0x00FF00, "drawing after a dimmed shape")
    m.createDot(4, 4, 0x0000FF)
    m.show()
    control.assert(received(m, 4, 4, false) == 0x0000FF, "full shape after a dimmed one")
    m.removeAllShapes()
    m.clear()

    // stamping copies the dimmed colors, without the matrix brightness (g is at the default 32)
    g.removeAllShapes()
    const st = g.createDot(1, 1, 0xFF0000)
    st.setBrightness(127)
    st.stamp()
    control.assert(g.getPixel(1, 1) == 0x7F0000, "dimmed shape stamps dimmed pixels")
    g.setPixel(2, 2, 0xFF0000)
    const er = g.createDot(2, 2, 0xFFFFFF)
    er.setBrightness(0)
    er.stamp()
    control.assert(g.getPixel(2, 2) == 0, "stamping at brightness 0 turns pixels off")
    g.setPixel(3, 3, 0xFF8000)
    control.assert(g.getPixel(3, 3) == 0xFF8000, "drawing after a dimmed stamp")
}

// ---- matrix-shapes: rotate, flip, set pattern
function testPatternShapes() {
    const m = ledmatrix.create(DigitalPin.P0, 10, 20)
    const t = m.createPattern(ledmatrix.pattern(".#.|###"), 3, 0, 0xFF00FF)
    t.rotate(LedMatrixRotation.Right)
    control.assert(patternText(t._pat) == "#.|##|#." && t.width() == 2 && t.height() == 3, "T turns right")
    t.rotate(LedMatrixRotation.Left)
    control.assert(patternText(t._pat) == ".#.|###" && t.x() == 3 && t.y() == 0, "T turns back")
    t.rotate(LedMatrixRotation.Left)
    control.assert(patternText(t._pat) == ".#|##|.#", "T turns left")

    const bar = m.createPattern(ledmatrix.pattern("####"), 3, 5, 0x00FFFF)
    bar.rotate(LedMatrixRotation.Right)
    control.assert(bar.x() == 4 && bar.y() == 4 && bar.width() == 1 && bar.height() == 4, "bar after right")
    bar.rotate(LedMatrixRotation.Left)
    control.assert(bar.x() == 3 && bar.y() == 5 && bar.width() == 4 && bar.height() == 1, "bar round trip")

    const l = m.createPattern(ledmatrix.pattern("#..|###"), 2, 2, 0xFFFFFF)
    l.flip(LedMatrixFlip.Horizontal)
    control.assert(patternText(l._pat) == "..#|###" && l.x() == 2 && l.y() == 2, "horizontal flip")
    l.flip(LedMatrixFlip.Vertical)
    control.assert(patternText(l._pat) == "###|..#" && l.x() == 2 && l.y() == 2, "vertical flip")
    l.setPattern(ledmatrix.pattern("##|##"))
    control.assert(patternText(l._pat) == "##|##" && l.x() == 2 && l.y() == 2, "set pattern keeps position")
    l.setPattern(null)
    control.assert(patternText(l._pat) == "##|##", "set pattern null ignored")

    // pattern shape changes send; on other shapes these do nothing
    m.show()
    let n = sends
    l.rotate(LedMatrixRotation.Right)
    m.show()
    l.flip(LedMatrixFlip.Horizontal)
    m.show()
    l.setPattern(ledmatrix.pattern("#"))
    m.show()
    control.assert(sends == n + 3, "pattern shape changes send")
    const r = m.createRectangle(0, 0, 3, 2, 0xFFFFFF, true)
    m.show()
    n = sends
    r.rotate(LedMatrixRotation.Right)
    r.flip(LedMatrixFlip.Vertical)
    r.setPattern(ledmatrix.pattern("#"))
    m.show()
    control.assert(sends == n && r.width() == 3 && r.height() == 2 && r.x() == 0, "no-ops on other shapes")
}

// true if the collision mask is all clear
function maskClear(m: ledmatrix.Matrix): boolean {
    for (let i = 0; i < m._scratch.length; i++) if (m._scratch[i]) return false
    return true
}

// ---- matrix-shapes: collisions
function testCollisions() {
    const g = ledmatrix.create(DigitalPin.P0, 10, 20)
    control.assert(g._scratch == null, "mask not allocated before use")

    // pixel exact: boxes overlap, pixels don't
    const a = g.createPattern(ledmatrix.pattern(".#.|###"), 0, 10, 0xFF0000)
    const b = g.createPattern(ledmatrix.pattern("###|.#."), 2, 9, 0x0000FF)
    control.assert(!a.overlaps(b) && !b.overlaps(a), "pixel exact: no touch")
    control.assert(g._scratch != null && maskClear(g), "mask allocated and cleared")
    control.assert(!b.wouldOverlap(a, 0, 0) && b.wouldOverlap(a, -1, 1), "would overlap after the move")
    control.assert(b.x() == 2 && b.y() == 9 && maskClear(g), "would overlap does not move")
    control.assert(!b.wouldOverlap(null, -1, 1) && !b.wouldOverlap(b, 0, 0), "would overlap: null and self")
    b.moveBy(-1, 1)
    control.assert(a.overlaps(b) && b.overlaps(a), "pixel exact: touch")
    control.assert(maskClear(g), "mask cleared after hit")
    control.assert(!a.overlaps(null) && !a.overlaps(a), "null and self")

    // hidden and removed shapes don't collide
    b.setVisible(false)
    control.assert(!a.overlaps(b) && !b.overlaps(a), "hidden no collide")
    control.assert(!a.wouldOverlap(b, 0, 0) && !b.wouldOverlap(a, 0, 0), "hidden never blocks")
    b.setVisible(true)
    control.assert(a.overlaps(b), "visible again")
    b.remove()
    control.assert(!a.overlaps(b) && !b.overlaps(a), "removed no collide")
    a.remove()

    // falling piece lands on the floor, then on the stamped piece
    const t = g.createPattern(ledmatrix.pattern(".#.|###"), 3, 0, 0xFF00FF)
    while (t.canMoveBy(0, 1)) t.moveBy(0, 1)
    control.assert(t.y() == 18, "landed at bottom")
    t.stamp()
    control.assert(g.getPixel(4, 18) == 0xFF00FF && g.getPixel(3, 19) == 0xFF00FF && g.getPixel(3, 18) == 0, "stamped")
    control.assert(t.touchesDrawing(), "touches its stamp")
    t.setPosition(3, 0)
    control.assert(!t.touchesDrawing(), "free at the top")
    while (t.canMoveBy(0, 1)) t.moveBy(0, 1)
    control.assert(t.y() == 16, "landed on stamped piece")
    control.assert(!t.canMoveBy(-4, 0) && t.canMoveBy(-3, 0), "wall")
    t.moveBy(0, 2)
    control.assert(t.touchesDrawing(), "landed on stamped piece: touches")
    t.setVisible(false)
    control.assert(!t.touchesDrawing(), "hidden does not touch")

    // canMoveBy and wouldOverlap neither move nor send
    t.setVisible(true)
    t.setPosition(3, 0)
    const o = g.createDot(4, 2, 0xFFFFFF)
    g.show()
    const n = sends
    control.assert(t.canMoveBy(0, 1) && t.x() == 3 && t.y() == 0, "can move does not move")
    control.assert(t.wouldOverlap(o, 0, 1) && t.x() == 3 && t.y() == 0, "would overlap does not move")
    t.overlaps(t)
    t.touchesDrawing()
    g.show()
    control.assert(sends == n, "queries do not send")
    o.remove()

    // stamped pixels stay after remove and after moving away; removed shapes don't stamp
    g.clear()
    const s = g.createPattern(ledmatrix.pattern("r#"), 0, 0, 0x00FF00)
    s.stamp()
    s.moveBy(5, 5)
    control.assert(g.getPixel(0, 0) == 0xFF0000 && g.getPixel(1, 0) == 0x00FF00, "stamp then move")
    s.remove()
    control.assert(g.getPixel(0, 0) == 0xFF0000, "stamped pixels stay after remove")
    s.stamp()
    control.assert(g.getPixel(5, 5) == 0, "removed shape does not stamp")
    control.assert(!s.touchesDrawing(), "removed does not touch")

    // hidden shapes don't stamp; stamped pixels keep no link to the shape
    g.clear()
    const h = g.createRectangle(2, 2, 2, 1, 0xFF0000, true)
    h.setVisible(false)
    h.stamp()
    control.assert(litCount(g) == 0, "hidden shape does not stamp")
    h.setVisible(true)
    h.stamp()
    control.assert(g.getPixel(2, 2) == 0xFF0000 && g.getPixel(3, 2) == 0xFF0000, "stamps when visible again")
    h.setColor(0x0000FF)
    h.remove()
    control.assert(g.getPixel(2, 2) == 0xFF0000 && g.getPixel(3, 2) == 0xFF0000, "stamp keeps no link to the shape")

    // inside and edge tests
    const m = ledmatrix.create(DigitalPin.P0, 8, 8)
    const c = m.createCircle(5, 1, 1, 0xFFFFFF, true)
    control.assert(c.isInside() && c.isOnEdge(), "on the edge")
    c.setPosition(4, 4)
    control.assert(c.isInside() && !c.isOnEdge(), "inside, not on edge")
    c.setPosition(7, 4)
    control.assert(!c.isInside() && c.isOnEdge(), "crossing the edge")
    c.setPosition(20, 20)
    control.assert(!c.isInside() && c.isOnEdge(), "fully outside")

    // other kinds are pixel exact too: ring vs dot in its middle
    const ring = m.createCircle(3, 3, 2, 0xFFFFFF, false)
    const dot = m.createDot(3, 3, 0xFF0000)
    control.assert(!ring.overlaps(dot) && !dot.overlaps(ring), "ring vs center dot")
    dot.setPosition(1, 3)
    control.assert(ring.overlaps(dot) && dot.overlaps(ring), "ring vs dot on ring")
    const frame = m.createRectangle(0, 0, 8, 8, 0xFFFFFF, false)
    control.assert(!frame.overlaps(ring), "frame vs ring")
    const diag = m.createLine(0, 0, 7, 7, 0xFFFFFF)
    control.assert(diag.overlaps(frame) && !diag.overlaps(ring), "line hits the frame, passes between ring pixels")

    // wrap-around: wrapped pixels count
    const w1 = m.createDot(8, 0, 0xFFFFFF)
    const w2 = m.createDot(0, 0, 0xFFFFFF)
    const w3 = m.createDot(7, 0, 0xFFFFFF)
    control.assert(!w1.overlaps(w2), "no wrap: apart")
    control.assert(!w3.wouldOverlap(w2, 1, 0), "no wrap: would not overlap")
    m.setWrap(true)
    control.assert(w1.overlaps(w2) && w2.overlaps(w1), "wrap: same pixel")
    control.assert(w3.wouldOverlap(w2, 1, 0) && w3.x() == 7, "wrap: would overlap")
    control.assert(w1.canMoveBy(5, 0), "wrap: can leave the matrix")
    control.assert(maskClear(m), "mask clear with wrap")

    // shapes of different matrices never overlap
    control.assert(!w2.overlaps(g.createDot(0, 0, 0xFFFFFF)), "different matrices")
}

// part of the drawing layer as text: "#" lit, "." off, rows joined by "|"
function region(m: ledmatrix.Matrix, x: number, y: number, w: number, h: number): string {
    let t = ""
    for (let r = 0; r < h; r++) {
        if (r > 0) t += "|"
        for (let c = 0; c < w; c++) t += m.getPixel(x + c, y + r) ? "#" : "."
    }
    return t
}

// ---- matrix-fonts: number formatting, metrics, glyphs, lit pixels (stamped number shapes)
function testNumbers() {
    const m = ledmatrix.create(DigitalPin.P0, 16, 16)
    paint(m.createNumber(4, 0, 0, 0xFFFFFF))
    control.assert(region(m, 0, 0, 3, 5) == "#.#|#.#|###|..#|..#", "glyph 4")
    control.assert(m.getPixel(0, 0) == 0xFFFFFF && m.getPixel(2, 4) == 0xFFFFFF && litCount(m) == 9, "glyph 4 pixels")
    m.clear()

    // every glyph of the font, as in the spec
    const glyphs = ["###|#.#|#.#|#.#|###", ".#.|##.|.#.|.#.|###", "###|..#|###|#..|###", "###|..#|.##|..#|###",
        "#.#|#.#|###|..#|..#", "###|#..|###|..#|###", "###|#..|###|#.#|###", "###|..#|..#|..#|..#",
        "###|#.#|###|#.#|###", "###|#.#|###|..#|###"]
    for (let d = 0; d < 10; d++) {
        m.clear()
        paint(m.createNumber(d, 5, 5, 0xFFFFFF))
        control.assert(region(m, 5, 5, 3, 5) == glyphs[d], "glyph " + d)
    }
    m.clear()

    paint(m.createNumber(42, 0, 0, 0xFFFFFF))
    control.assert(region(m, 0, 0, 8, 6) == "#.#.###.|#.#...#.|###.###.|..#.#...|..#.###.|........", "42")
    m.clear()
    paint(m.createNumber(-7, 0, 0, 0xFF0000))
    control.assert(region(m, 0, 0, 8, 5) == "....###.|......#.|###...#.|......#.|......#.", "-7")
    m.clear()
    paint(m.createNumber(3.9, 0, 0, 0xFFFFFF))
    paint(m.createNumber(-0.5, 8, 0, 0xFFFFFF))
    control.assert(region(m, 0, 0, 4, 5) == "###.|..#.|.##.|..#.|###.", "3.9 shows 3")
    control.assert(region(m, 8, 0, 4, 5) == "###.|#.#.|#.#.|#.#.|###.", "-0.5 shows 0 without minus")
    control.assert(litCount(m) == 10 + 12, "3.9 and -0.5 pixel count")
    m.clear()

    paint(m.createNumber(2048, 0, 0, 0xFFFFFF))
    control.assert(region(m, 0, 0, 15, 5) == "###.###.#.#.###|..#.#.#.#.#.#.#|###.#.#.###.###|#...#.#...#.#.#|###.###...#.###", "2048")
    control.assert(litCount(m) == 11 + 12 + 9 + 13, "2048 within columns 0..14")
    m.clear()
    paint(m.createNumber(11, 0, 0, 0xFFFFFF))
    control.assert(region(m, 4, 0, 3, 5) == glyphs[1] && region(m, 3, 0, 1, 5) == ".|.|.|.|.", "11: second digit at column 4")
    m.clear()

    // only lit pixels are painted
    m.fill(0x0000FF)
    paint(m.createNumber(1, 0, 0, 0xFFFFFF))
    control.assert(m.getPixel(0, 0) == 0x0000FF && m.getPixel(1, 0) == 0xFFFFFF && m.getPixel(3, 0) == 0x0000FF, "background stays")
    m.clear()

    // updating a counter: stamp a black rectangle over the area, then the new value
    paint(m.createNumber(10, 0, 0, 0xFFFFFF))
    paint(m.createRectangle(0, 0, 7, 5, 0, true))
    paint(m.createNumber(9, 0, 0, 0xFFFFFF))
    control.assert(region(m, 0, 0, 7, 5) == "###....|#.#....|###....|..#....|###....", "updating a counter")
    m.clear()

    // clipping and wrap-around like all drawing
    paint(m.createNumber(7, 14, 0, 0xFFFFFF))
    control.assert(litCount(m) == 2 && region(m, 14, 0, 2, 2) == "##|..", "clipped at the edge")
    m.clear()
    m.setWrap(true)
    paint(m.createNumber(7, 14, 0, 0xFFFFFF))
    control.assert(region(m, 0, 0, 1, 5) == "#|#|#|#|#", "number wraps")
}

// shown colors of part of the last frame: w white, r red, b blue, . off, ? other
function shownRegion(m: ledmatrix.Matrix, x: number, y: number, w: number, h: number): string {
    let t = ""
    for (let r = 0; r < h; r++) {
        if (r > 0) t += "|"
        for (let c = 0; c < w; c++) {
            const v = shown(m, x + c, y + r)
            t += v == 0xFFFFFF ? "w" : v == 0xFF0000 ? "r" : v == 0x0000FF ? "b" : v == 0 ? "." : "?"
        }
    }
    return t
}

// ---- matrix-fonts: number shapes
function testNumberShapes() {
    const m = ledmatrix.create(DigitalPin.P0, 16, 16)

    // above the drawing layer
    m.fill(0x0000FF)
    // "zahl" is the variable name the block creates (blockSetVariable=zahl)
    const zahl = m.createNumber(5, 0, 0, 0xFFFFFF)
    m.show()
    control.assert(shownRegion(m, 0, 0, 4, 6) == "wwwb|wbbb|wwwb|bbwb|wwwb|bbbb", "number above the drawing layer")
    control.assert(zahl.x() == 0 && zahl.y() == 0 && zahl.width() == 3 && zahl.height() == 5, "number size")
    m.clear()

    // z-order: a later rectangle covers it until the number comes to the front
    const cover = m.createRectangle(0, 0, 3, 5, 0xFF0000, true)
    m.show()
    control.assert(shownRegion(m, 0, 0, 3, 5) == "rrr|rrr|rrr|rrr|rrr", "covered by later rectangle")
    zahl.bringToFront()
    m.show()
    control.assert(shownRegion(m, 0, 0, 3, 5) == "www|wrr|www|rrw|www", "number brought to front")
    cover.remove()

    // grow and shrink; old pixels don't stay
    zahl.setNumber(9)
    zahl.setNumber(10)
    m.fill(0x0000FF)
    m.show()
    control.assert(zahl.width() == 7 && zahl.height() == 5 && zahl.x() == 0, "value grows")
    control.assert(shownRegion(m, 0, 0, 8, 5) == "bwbbwwwb|wwbbwbwb|bwbbwbwb|bwbbwbwb|wwwbwwwb", "10 shown")
    zahl.setNumber(-3.7)
    control.assert(zahl.width() == 7, "-3")
    zahl.setNumber(9)
    m.show()
    control.assert(zahl.width() == 3, "value shrinks")
    control.assert(shownRegion(m, 0, 0, 7, 5) == "wwwbbbb|wbwbbbb|wwwbbbb|bbwbbbb|wwwbbbb", "only 9 shown")
    m.clear()

    // stamp a number
    const seven = m.createNumber(7, 0, 0, 0xFFFFFF)
    seven.stamp()
    seven.remove()
    control.assert(region(m, 0, 0, 3, 5) == "###|..#|..#|..#|..#", "stamped number")
    m.clear()

    // collisions are pixel exact; the box is 4n - 1 by 5
    zahl.setNumber(42)
    const dot = m.createDot(1, 0, 0xFF0000)
    control.assert(!zahl.overlaps(dot) && !dot.overlaps(zahl), "unlit glyph pixel does not collide")
    dot.setPosition(3, 2)
    control.assert(!zahl.overlaps(dot) && !dot.overlaps(zahl), "gap does not collide")
    dot.setPosition(0, 0)
    control.assert(zahl.overlaps(dot) && dot.overlaps(zahl), "lit glyph pixel collides")
    m.setPixel(1, 0, 0xFFFFFF)
    control.assert(!zahl.touchesDrawing(), "touches drawing: unlit pixel")
    m.setPixel(5, 0, 0xFFFFFF)
    control.assert(zahl.touchesDrawing() && !zahl.canMoveBy(0, 0), "touches drawing: lit pixel")
    m.clear()
    zahl.setPosition(9, 11)
    control.assert(zahl.isInside() && zahl.isOnEdge() && !zahl.canMoveBy(1, 0), "box 7x5 at the corner")
    zahl.setPosition(8, 10)
    control.assert(zahl.isInside() && !zahl.isOnEdge(), "box inside")

    // number-only and pattern-only changes do nothing on the other kinds
    m.show()
    const n = sends
    dot.setNumber(5)
    zahl.rotate(LedMatrixRotation.Right)
    zahl.flip(LedMatrixFlip.Horizontal)
    zahl.setPattern(ledmatrix.pattern("#"))
    m.show()
    control.assert(sends == n && zahl.width() == 7 && dot.width() == 1, "no-ops")
    zahl.setNumber(42)
    m.show()
    control.assert(sends == n + 1, "set number sends")
}

run("create", testCreate)
run("layouts", testLayouts)
run("show", testShow)
run("pixels", testPixels)
run("shapeGeometry", testShapeGeometry)
run("shift", testShift)
run("colors", testColors)
run("patterns", testPatterns)
run("shapes", testShapes)
run("shapeBrightness", testShapeBrightness)
run("patternShapes", testPatternShapes)
run("collisions", testCollisions)
run("numbers", testNumbers)
run("numberShapes", testNumberShapes)

// all checks passed: report on serial and show a tick on the board's own LED display
console.log("ledmatrix tests passed")
basic.showIcon(IconNames.Yes)
