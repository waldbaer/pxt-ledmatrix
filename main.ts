/**
 * How the LED chain runs through the matrix.
 */
enum LedMatrixWiring {
    //% block="rows, zig-zag"
    RowsZigZag = 0,
    //% block="rows, same direction"
    Rows = 1,
    //% block="columns, zig-zag"
    ColumnsZigZag = 2,
    //% block="columns, same direction"
    Columns = 3
}

/**
 * Corner of the first LED (where the data cable goes in), seen from the front.
 */
enum LedMatrixCorner {
    //% block="top left"
    TopLeft = 0,
    //% block="top right"
    TopRight = 1,
    //% block="bottom left"
    BottomLeft = 2,
    //% block="bottom right"
    BottomRight = 3
}

/**
 * Byte order the LEDs expect.
 */
enum LedMatrixColorOrder {
    //% block="GRB (most WS2812B)"
    GRB = 0,
    //% block="RGB"
    RGB = 1
}

/**
 * Direction to rotate a pattern shape.
 */
enum LedMatrixRotation {
    //% block="right"
    Right = 0,
    //% block="left"
    Left = 1
}

/**
 * Axis to mirror a pattern shape.
 */
enum LedMatrixFlip {
    //% block="horizontally"
    Horizontal = 0,
    //% block="vertically"
    Vertical = 1
}

/**
 * Well known colors.
 */
enum LedMatrixColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=cyan
    Cyan = 0x00FFFF,
    //% block=blue
    Blue = 0x0000FF,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

/**
 * Draw on WS2812B LED matrices of any size and wiring.
 */
//% color="#E0662B" icon="\uf00a" weight=80 block="LED Matrix"
//% groups='["Setup", "Display", "Draw", "Text", "Shapes", "Collisions", "Colors"]'
namespace ledmatrix {

    // Targets of Matrix._plot: every shape and drawing function renders through it.
    export const _BG = 0        // drawing layer
    export const _OUT = 1       // output frame (chain order, color order applied)
    export const _MASK = 2      // collision scratch mask: stores color (1 = mark, 0 = clear)
    export const _HIT_BG = 3    // probe: hit if the drawing layer is lit there
    export const _HIT_MK = 4    // probe: hit if the scratch mask is marked there

    /**
     * A WS2812B LED matrix. Coordinates start at the top left (x to the right, y down),
     * whatever the physical wiring is.
     */
    export class Matrix {
        _pin: DigitalPin
        _w: number
        _h: number
        _wiring: LedMatrixWiring
        _corner: LedMatrixCorner
        _order: LedMatrixColorOrder
        _brightness: number
        _wrap: boolean
        _bg: Buffer        // drawing layer: RGB, row-major from top left
        _out: Buffer       // chain order, color order applied, full intensity
        _map: Buffer       // logical pixel -> LED number (UInt16LE)
        _shapes: Shape[]   // drawn on top of the drawing layer, in list order
        _dirty: boolean    // something changed since the last send
        _scratch: Buffer   // collision mask, 1 byte per pixel, allocated on first use
        _hit: boolean      // result of the probe targets
        _level: number     // brightness of the shape being rendered (255 = full), set by Shape._render

        constructor(pin: DigitalPin, width: number, height: number) {
            this._pin = pin
            this._w = Math.max(1, width | 0)
            this._h = Math.max(1, height | 0)
            this._wiring = LedMatrixWiring.ColumnsZigZag
            this._corner = LedMatrixCorner.TopLeft
            this._order = LedMatrixColorOrder.GRB
            this._brightness = 32
            this._wrap = false
            const n = this._w * this._h
            this._bg = pins.createBuffer(n * 3)
            this._out = pins.createBuffer(n * 3)
            this._map = pins.createBuffer(n * 2)
            this._shapes = []
            this._dirty = true
            this._scratch = null
            this._hit = false
            this._level = 255
            this._buildMap()
            pins.digitalWritePin(pin, 0)
        }

        // ---------------------------------------------------------------- setup

        /**
         * Set the brightness used when showing (0-255). Large matrices draw a lot of
         * current, so start low. The stored colors do not change.
         * @param brightness brightness from 0 to 255, eg: 32
         */
        //% blockId=ledmatrix_set_brightness block="%matrix|set brightness %brightness"
        //% matrix.defl=matrix brightness.min=0 brightness.max=255
        //% group="Setup" weight=90 blockGap=8
        setBrightness(brightness: number): void {
            this._brightness = Math.clamp(0, 255, brightness | 0)
            this._changed()
        }

        /**
         * Change the wiring layout: how the LED chain runs and where the first LED is.
         * @param wiring how the LED chain runs through the matrix
         * @param corner where the first LED sits, seen from the front
         */
        //% blockId=ledmatrix_set_layout block="%matrix|set wiring %wiring|first LED %corner"
        //% matrix.defl=matrix
        //% group="Setup" weight=80 blockGap=8 advanced=true
        setLayout(wiring: LedMatrixWiring, corner: LedMatrixCorner): void {
            this._wiring = wiring
            this._corner = corner
            this._buildMap()
            this._changed()
        }

        /**
         * Set the byte order of the LEDs. Use RGB if red and green appear swapped.
         * @param order byte order the LEDs expect
         */
        //% blockId=ledmatrix_set_color_order block="%matrix|set color order %order"
        //% matrix.defl=matrix
        //% group="Setup" weight=75 blockGap=8 advanced=true
        setColorOrder(order: LedMatrixColorOrder): void {
            this._order = order
            this._changed()
        }

        /**
         * Width of the matrix in pixels.
         */
        //% blockId=ledmatrix_width block="%matrix|width"
        //% matrix.defl=matrix
        //% group="Setup" weight=70 blockGap=8
        width(): number {
            return this._w
        }

        /**
         * Height of the matrix in pixels.
         */
        //% blockId=ledmatrix_height block="%matrix|height"
        //% matrix.defl=matrix
        //% group="Setup" weight=69
        height(): number {
            return this._h
        }

        /**
         * Number of the LED in the chain at a position (0 = first LED), or -1 if outside.
         * Handy for checking the wiring settings.
         * @param x column, eg: 0
         * @param y row, eg: 0
         */
        //% blockId=ledmatrix_led_index block="%matrix|LED number at x %x|y %y"
        //% matrix.defl=matrix
        //% group="Setup" weight=60 advanced=true
        ledIndex(x: number, y: number): number {
            x = x | 0
            y = y | 0
            const w = this._w
            const h = this._h
            if (x < 0 || y < 0 || x >= w || y >= h) return -1
            const c = this._corner
            if (c == LedMatrixCorner.TopRight || c == LedMatrixCorner.BottomRight) x = w - 1 - x
            if (c == LedMatrixCorner.BottomLeft || c == LedMatrixCorner.BottomRight) y = h - 1 - y
            switch (this._wiring) {
                case LedMatrixWiring.RowsZigZag:
                    return y * w + ((y & 1) ? w - 1 - x : x)
                case LedMatrixWiring.Rows:
                    return y * w + x
                case LedMatrixWiring.ColumnsZigZag:
                    return x * h + ((x & 1) ? h - 1 - y : y)
                default:
                    return x * h + y
            }
        }

        /**
         * Wrap drawing, shifting, shapes and collisions around the edges instead of
         * cutting them off.
         * @param on wrap around if true
         */
        //% blockId=ledmatrix_set_wrap block="%matrix|wrap around edges %on"
        //% matrix.defl=matrix on.shadow=toggleOnOff
        //% group="Setup" weight=85 blockGap=8
        setWrap(on: boolean): void {
            this._wrap = on
            this._changed()
        }

        // ----------------------------------------------------------------- draw

        /**
         * Set one pixel of the drawing layer. Call "show" to make changes visible.
         * @param x column, eg: 0
         * @param y row, eg: 0
         */
        //% blockId=ledmatrix_set_pixel block="%matrix|set pixel x %x|y %y|to %color=ledmatrix_colors"
        //% matrix.defl=matrix
        //% group="Draw" weight=100 blockGap=8
        setPixel(x: number, y: number, color: number): void {
            this._plot(_BG, x | 0, y | 0, color)
            this._changed()
        }

        /**
         * Color of a pixel in the drawing layer (shapes are not included), or 0 if
         * outside.
         * @param x column, eg: 0
         * @param y row, eg: 0
         */
        //% blockId=ledmatrix_get_pixel block="%matrix|pixel color at x %x|y %y"
        //% matrix.defl=matrix
        //% group="Draw" weight=95 advanced=true
        getPixel(x: number, y: number): number {
            x = x | 0
            y = y | 0
            const w = this._w
            const h = this._h
            if (this._wrap) {
                x = ((x % w) + w) % w
                y = ((y % h) + h) % h
            } else if (x < 0 || y < 0 || x >= w || y >= h) {
                return 0
            }
            const o = (y * w + x) * 3
            return (this._bg[o] << 16) | (this._bg[o + 1] << 8) | this._bg[o + 2]
        }

        /**
         * Fill the whole drawing layer with one color.
         */
        //% blockId=ledmatrix_fill block="%matrix|fill with %color=ledmatrix_colors"
        //% matrix.defl=matrix
        //% group="Draw" weight=75 blockGap=8
        fill(color: number): void {
            const bg = this._bg
            const r = (color >> 16) & 0xff
            const g = (color >> 8) & 0xff
            const b = color & 0xff
            for (let o = 0; o < bg.length; o += 3) {
                bg[o] = r
                bg[o + 1] = g
                bg[o + 2] = b
            }
            this._changed()
        }

        /**
         * Turn off all pixels of the drawing layer (shapes stay).
         */
        //% blockId=ledmatrix_clear block="%matrix|clear"
        //% matrix.defl=matrix
        //% group="Draw" weight=70 blockGap=8
        clear(): void {
            this._bg.fill(0)
            this._changed()
        }

        /**
         * Move everything in the drawing layer. Pixels moved out are lost,
         * or come back on the other side if "wrap around edges" is on.
         * @param dx pixels to the right (negative = left), eg: 1
         * @param dy pixels down (negative = up), eg: 0
         */
        //% blockId=ledmatrix_shift block="%matrix|shift drawing by x %dx|y %dy"
        //% matrix.defl=matrix
        //% group="Draw" weight=65
        shift(dx: number, dy: number): void {
            dx = dx | 0
            dy = dy | 0
            const w = this._w
            const h = this._h
            const bg = this._bg
            const row = w * 3
            // Buffer.shift / rotate move bytes towards the start for positive
            // offsets, so the offsets are negated to move right / down.
            if (this._wrap) {
                if (dy) bg.rotate(-dy * row)
                if (dx) for (let y = 0; y < h; y++) bg.rotate(-dx * 3, y * row, row)
            } else if (dx >= w || dx <= -w || dy >= h || dy <= -h) {
                bg.fill(0)
            } else {
                if (dy) bg.shift(-dy * row)
                if (dx) for (let y = 0; y < h; y++) bg.shift(-dx * 3, y * row, row)
            }
            this._changed()
        }

        // --------------------------------------------------------------- shapes

        /**
         * Create a rectangle you can move around. It is drawn on top of the drawing layer.
         * @param x left column, eg: 0
         * @param y top row, eg: 0
         * @param width width in pixels, eg: 2
         * @param height height in pixels, eg: 2
         * @param filled fill the inside
         */
        //% blockId=ledmatrix_create_rect block="%matrix|rectangle at x %x|y %y|width %width|height %height|color %color=ledmatrix_colors|filled %filled"
        //% matrix.defl=matrix filled.shadow=toggleOnOff inlineInputMode=inline
        //% blockSetVariable=rechteck
        //% group="Shapes" weight=100 blockGap=8
        createRectangle(x: number, y: number, width: number, height: number, color: number, filled: boolean): Shape {
            return this._addShape(new Shape(this, _SHAPE_RECT, x, y, width, height, color, filled))
        }

        /**
         * Create a circle you can move around. Its position is the center.
         * @param x center column, eg: 3
         * @param y center row, eg: 3
         * @param radius radius in pixels, eg: 2
         * @param filled fill the inside
         */
        //% blockId=ledmatrix_create_circle block="%matrix|circle at x %x|y %y|radius %radius|color %color=ledmatrix_colors|filled %filled"
        //% matrix.defl=matrix filled.shadow=toggleOnOff inlineInputMode=inline
        //% blockSetVariable=kreis
        //% group="Shapes" weight=98 blockGap=8
        createCircle(x: number, y: number, radius: number, color: number, filled: boolean): Shape {
            return this._addShape(new Shape(this, _SHAPE_CIRCLE, x, y, radius, 0, color, filled))
        }

        /**
         * Create a line you can move around. Its position is the start point.
         * @param x0 start column, eg: 0
         * @param y0 start row, eg: 0
         * @param x1 end column, eg: 3
         * @param y1 end row, eg: 0
         */
        //% blockId=ledmatrix_create_line block="%matrix|line from x %x0|y %y0|to x %x1|y %y1|color %color=ledmatrix_colors"
        //% matrix.defl=matrix inlineInputMode=inline
        //% blockSetVariable=linie
        //% group="Shapes" weight=96 blockGap=8
        createLine(x0: number, y0: number, x1: number, y1: number, color: number): Shape {
            x0 = x0 | 0
            y0 = y0 | 0
            return this._addShape(new Shape(this, _SHAPE_LINE, x0, y0, (x1 | 0) - x0, (y1 | 0) - y0, color, false))
        }

        /**
         * Create a single pixel you can move around.
         * @param x column, eg: 0
         * @param y row, eg: 0
         */
        //% blockId=ledmatrix_create_dot block="%matrix|dot at x %x|y %y|color %color=ledmatrix_colors"
        //% matrix.defl=matrix
        //% blockSetVariable=punkt
        //% group="Shapes" weight=94 blockGap=8
        createDot(x: number, y: number, color: number): Shape {
            return this._addShape(new Shape(this, _SHAPE_DOT, x, y, 0, 0, color, false))
        }

        /**
         * Create a shape from a pattern, e.g. a Tetris piece. Its position is the
         * top left corner of the pattern.
         * @param x left column, eg: 0
         * @param y top row, eg: 0
         */
        //% blockId=ledmatrix_create_pattern block="%matrix|%pattern=ledmatrix_grid|at x %x|y %y|color %color=ledmatrix_colors"
        //% matrix.defl=matrix inlineInputMode=inline
        //% blockSetVariable=muster
        //% group="Shapes" weight=92 blockGap=8
        createPattern(pattern: Pattern, x: number, y: number, color: number): Shape {
            const s = new Shape(this, _SHAPE_PATTERN, x, y, 0, 0, color, false)
            s._pat = pattern || new Pattern(1, 1)
            return this._addShape(s)
        }

        /**
         * Create a number you can move around and change, in a 3x5 digit font. Its
         * position is the top left of the first digit. Decimals are cut off.
         * @param value the number to show, eg: 0
         * @param x left column, eg: 0
         * @param y top row, eg: 0
         */
        //% blockId=ledmatrix_create_number block="%matrix|number %value|at x %x|y %y|color %color=ledmatrix_colors"
        //% matrix.defl=matrix inlineInputMode=inline
        //% blockSetVariable=zahl
        //% group="Text" weight=90 blockGap=8
        createNumber(value: number, x: number, y: number, color: number): Shape {
            const s = new Shape(this, _SHAPE_NUMBER, x, y, 0, 0, color, false)
            s._text = _numberText(value)
            return this._addShape(s)
        }

        /**
         * Delete all shapes from this matrix. The drawing layer stays.
         */
        //% blockId=ledmatrix_remove_shapes block="%matrix|delete all shapes"
        //% matrix.defl=matrix
        //% group="Shapes" weight=10
        removeAllShapes(): void {
            for (const sh of this._shapes) sh._removed = true
            this._shapes = []
            this._changed()
        }

        // -------------------------------------------------------------- display

        /**
         * Show everything drawn or moved since the last show on the LED matrix. Until
         * then the LED matrix doesn't change, so call it e.g. at the end of each loop.
         */
        //% blockId=ledmatrix_show block="%matrix|show changes"
        //% matrix.defl=matrix
        //% group="Display" weight=100
        show(): void {
            if (!this._dirty) return
            const n = this._w * this._h
            const bg = this._bg
            const out = this._out
            const map = this._map
            const grb = this._order == LedMatrixColorOrder.GRB
            for (let i = 0; i < n; i++) {
                const s = i * 3
                const d = map.getNumber(NumberFormat.UInt16LE, i * 2) * 3
                if (grb) {
                    out[d] = bg[s + 1]
                    out[d + 1] = bg[s]
                } else {
                    out[d] = bg[s]
                    out[d + 1] = bg[s + 1]
                }
                out[d + 2] = bg[s + 2]
            }
            for (const sh of this._shapes) {
                if (sh._visible) sh._render(_OUT, sh._color)
            }
            _send(out, this._pin, this._brightness + 1)
            this._dirty = false
        }

        // ------------------------------------------------------------ internals

        // Marks the frame as changed, so the next show() sends it.
        _changed(): void {
            this._dirty = true
        }

        _addShape(s: Shape): Shape {
            this._shapes.push(s)
            this._changed()
            return s
        }

        // Writes one pixel to a target, after wrap-around or clipping.
        _plot(target: number, x: number, y: number, color: number): void {
            const w = this._w
            const h = this._h
            if (this._wrap) {
                x = ((x % w) + w) % w
                y = ((y % h) + h) % h
            } else if (x < 0 || y < 0 || x >= w || y >= h) {
                return
            }
            const i = y * w + x
            // A dimmed shape scales the colors it writes, like the matrix brightness
            // does. The collision targets keep their marks.
            if (this._level < 255 && (target == _BG || target == _OUT)) {
                const k = this._level + 1
                color = ((((color >> 16) & 0xff) * k) >> 8) << 16
                    | ((((color >> 8) & 0xff) * k) >> 8) << 8
                    | (((color & 0xff) * k) >> 8)
            }
            if (target == _BG) {
                const bg = this._bg
                const o = i * 3
                bg[o] = (color >> 16) & 0xff
                bg[o + 1] = (color >> 8) & 0xff
                bg[o + 2] = color & 0xff
            } else if (target == _OUT) {
                const out = this._out
                const o = this._map.getNumber(NumberFormat.UInt16LE, i * 2) * 3
                if (this._order == LedMatrixColorOrder.GRB) {
                    out[o] = (color >> 8) & 0xff
                    out[o + 1] = (color >> 16) & 0xff
                } else {
                    out[o] = (color >> 16) & 0xff
                    out[o + 1] = (color >> 8) & 0xff
                }
                out[o + 2] = color & 0xff
            } else if (target == _MASK) {
                this._scratch[i] = color
            } else if (target == _HIT_BG) {
                const o = i * 3
                if (this._bg[o] || this._bg[o + 1] || this._bg[o + 2]) this._hit = true
            } else if (target == _HIT_MK) {
                if (this._scratch[i]) this._hit = true
            }
        }

        // The collision mask, allocated on the first collision query.
        _mask(): Buffer {
            if (!this._scratch) this._scratch = pins.createBuffer(this._w * this._h)
            return this._scratch
        }

        _hline(target: number, x: number, y: number, len: number, color: number): void {
            for (let i = 0; i < len; i++) this._plot(target, x + i, y, color)
        }

        _vline(target: number, x: number, y: number, len: number, color: number): void {
            for (let i = 0; i < len; i++) this._plot(target, x, y + i, color)
        }

        // Bresenham
        _line(target: number, x0: number, y0: number, x1: number, y1: number, color: number): void {
            const dx = Math.abs(x1 - x0)
            const sx = x0 < x1 ? 1 : -1
            const dy = -Math.abs(y1 - y0)
            const sy = y0 < y1 ? 1 : -1
            let err = dx + dy
            while (true) {
                this._plot(target, x0, y0, color)
                if (x0 == x1 && y0 == y1) break
                const e2 = 2 * err
                if (e2 >= dy) { err += dy; x0 += sx }
                if (e2 <= dx) { err += dx; y0 += sy }
            }
        }

        _rect(target: number, x: number, y: number, w: number, h: number, color: number, filled: boolean): void {
            if (w <= 0 || h <= 0) return
            if (filled) {
                for (let j = 0; j < h; j++) this._hline(target, x, y + j, w, color)
                return
            }
            this._hline(target, x, y, w, color)
            if (h > 1) this._hline(target, x, y + h - 1, w, color)
            if (h > 2) {
                this._vline(target, x, y + 1, h - 2, color)
                if (w > 1) this._vline(target, x + w - 1, y + 1, h - 2, color)
            }
        }

        // Midpoint circle; filled = horizontal spans plus the outline
        _circle(target: number, cx: number, cy: number, r: number, color: number, filled: boolean): void {
            if (r < 0) return
            let x = r
            let y = 0
            let err = 1 - r
            while (x >= y) {
                if (filled) {
                    this._hline(target, cx - x, cy + y, 2 * x + 1, color)
                    this._hline(target, cx - x, cy - y, 2 * x + 1, color)
                    this._hline(target, cx - y, cy + x, 2 * y + 1, color)
                    this._hline(target, cx - y, cy - x, 2 * y + 1, color)
                } else {
                    this._plot(target, cx + x, cy + y, color)
                    this._plot(target, cx - x, cy + y, color)
                    this._plot(target, cx + x, cy - y, color)
                    this._plot(target, cx - x, cy - y, color)
                    this._plot(target, cx + y, cy + x, color)
                    this._plot(target, cx - y, cy + x, color)
                    this._plot(target, cx + y, cy - x, color)
                    this._plot(target, cx - y, cy - x, color)
                }
                y++
                if (err < 0) {
                    err += 2 * y + 1
                } else {
                    x--
                    err += 2 * (y - x) + 1
                }
            }
        }

        // Fills the map: logical pixel (row-major) -> LED number in the chain.
        _buildMap(): void {
            const w = this._w
            for (let y = 0; y < this._h; y++)
                for (let x = 0; x < w; x++)
                    this._map.setNumber(NumberFormat.UInt16LE, (y * w + x) * 2, this.ledIndex(x, y))
        }
    }

    /**
     * Create an LED matrix. The LED chain starts at the top left and runs down
     * the columns in zig-zag; change it with "set wiring" if your panel differs.
     * @param pin pin the data cable is connected to
     * @param width number of LEDs per row, eg: 16
     * @param height number of LEDs per column, eg: 16
     */
    //% blockId=ledmatrix_create block="LED matrix at pin %pin|width %width|height %height"
    //% width.min=1 height.min=1
    //% blockSetVariable=matrix
    //% group="Setup" weight=100 blockGap=8
    export function create(pin: DigitalPin, width: number, height: number): Matrix {
        return new Matrix(pin, width, height)
    }

    // ------------------------------------------------------------------ colors

    /**
     * A well known color.
     */
    //% blockId=ledmatrix_colors block="%color"
    //% group="Colors" weight=100 blockGap=8
    export function colors(color: LedMatrixColors): number {
        return color
    }

    /**
     * Mix a color from red, green and blue (0-255 each).
     * @param red eg: 255
     * @param green eg: 255
     * @param blue eg: 255
     */
    //% blockId=ledmatrix_rgb block="red %red|green %green|blue %blue"
    //% red.min=0 red.max=255 green.min=0 green.max=255 blue.min=0 blue.max=255
    //% group="Colors" weight=90 blockGap=8
    export function rgb(red: number, green: number, blue: number): number {
        red = Math.clamp(0, 255, red | 0)
        green = Math.clamp(0, 255, green | 0)
        blue = Math.clamp(0, 255, blue | 0)
        return (red << 16) | (green << 8) | blue
    }

    /**
     * A fully saturated color from the color wheel (0 = red, 120 = green, 240 = blue).
     * @param angle angle on the color wheel, eg: 0
     */
    //% blockId=ledmatrix_hue block="hue %angle"
    //% angle.min=0 angle.max=360
    //% group="Colors" weight=80
    export function hue(angle: number): number {
        const h = (((angle | 0) % 360) + 360) % 360
        const region = Math.idiv(h, 60)
        const f = Math.idiv((h - region * 60) * 255, 60)
        const q = 255 - f
        switch (region) {
            case 0: return rgb(255, f, 0)
            case 1: return rgb(q, 255, 0)
            case 2: return rgb(0, 255, f)
            case 3: return rgb(0, q, 255)
            case 4: return rgb(f, 0, 255)
            default: return rgb(255, 0, q)
        }
    }
}
