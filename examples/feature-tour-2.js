// EN: Feature tour 2, intermediate: six scenes in a loop, each one announced
//     by its number. It shows the basic blocks that tour 1 leaves out.
//     Runs on the Calliope mini 3 and the micro:bit; too big for the mini 1 and 2.
//       1 a house of shapes   3 a pattern shape      5 a ball in a stamped frame
//       2 changing shapes     4 a scrolling rainbow  6 bumping into things
// DE: Rundgang 2, für Fortgeschrittene: sechs Szenen in einer Schleife, jede mit
//     ihrer Nummer angekündigt. Er zeigt die einfachen Blöcke, die Rundgang 1 auslässt.
//     Läuft auf dem Calliope mini 3 und dem micro:bit; für mini 1 und 2 zu groß.
//       1 ein Haus aus Formen  3 eine Muster-Form          5 ein Ball im Stempelrahmen
//       2 Formen verändern     4 ein laufender Regenbogen  6 Zusammenstoßen

let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0

let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let scene = 0

// EN: starts the next scene: takes everything away and shows the scene number
// DE: startet die nächste Szene: räumt alles weg und zeigt die Nummer der Szene
function nextScene() {
    scene++
    matrix.removeAllShapes()
    matrix.setWrap(false)
    matrix.setBrightness(32)
    matrix.clear()
    let label = matrix.createNumber(scene, Math.floor((WIDTH - 3) / 2), Math.floor((HEIGHT - 5) / 2), ledmatrix.colors(LedMatrixColors.White))
    matrix.show()
    basic.pause(800)
    label.remove()
}

function step() {
    matrix.show()
    basic.pause(700)
}

function frame() {
    matrix.show()
    basic.pause(60)
}

// EN: Scene 1: a house at night: shapes on top of a sky in the drawing
// DE: Szene 1: ein Haus bei Nacht: Formen über einem Himmel in der Zeichnung
function houseScene() {
    nextScene()
    matrix.fill(ledmatrix.rgb(0, 0, 40))
    step()
    let grass = matrix.createLine(0, HEIGHT - 1, WIDTH - 1, HEIGHT - 1, ledmatrix.colors(LedMatrixColors.Green))
    // EN: an outline rectangle for the walls, a filled one for the door
    // DE: ein Rechteck nur mit Rand für die Wände, ein gefülltes für die Tür
    let walls = matrix.createRectangle(2, 10, 8, 5, ledmatrix.colors(LedMatrixColors.Orange), false)
    let door = matrix.createRectangle(5, 12, 2, 3, ledmatrix.colors(LedMatrixColors.Yellow), true)
    step()
    let roofLeft = matrix.createLine(1, 10, 5, 6, ledmatrix.colors(LedMatrixColors.Red))
    let roofRight = matrix.createLine(6, 6, 10, 10, ledmatrix.colors(LedMatrixColors.Red))
    step()
    let moon = matrix.createCircle(13, 3, 2, ledmatrix.colors(LedMatrixColors.Yellow), true)
    let star1 = matrix.createDot(1, 1, ledmatrix.colors(LedMatrixColors.White))
    let star2 = matrix.createDot(5, 3, ledmatrix.colors(LedMatrixColors.White))
    let star3 = matrix.createDot(9, 1, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: clear wipes the drawing: the sky is gone, the shapes stay
    // DE: clear wischt die Zeichnung weg: Der Himmel ist weg, die Formen bleiben
    matrix.clear()
    step()
}

// EN: Scene 2: moving and changing shapes
// DE: Szene 2: Formen bewegen und verändern
function changingScene() {
    nextScene()
    let dot = matrix.createDot(0, 2, ledmatrix.colors(LedMatrixColors.White))
    // EN: x() and y() tell where a shape is
    // DE: x() und y() sagen, wo eine Form ist
    while (dot.x() < 12) {
        dot.moveBy(1, 0)
        frame()
    }
    while (dot.y() < 12) {
        dot.moveBy(0, 1)
        frame()
    }
    // EN: with the size of the matrix, the box jumps into the bottom right corner
    // DE: mit der Größe der Matrix springt die Kiste in die Ecke unten rechts
    let box = matrix.createRectangle(0, 0, 4, 3, ledmatrix.colors(LedMatrixColors.Blue), true)
    step()
    box.setPosition(matrix.width() - 4, matrix.height() - 3)
    step()
    let ball = matrix.createCircle(7, 7, 3, ledmatrix.colors(LedMatrixColors.Red), true)
    step()
    // EN: hue picks colors from the color wheel (0 red, 120 green, 240 blue)
    // DE: hue nimmt Farben aus dem Farbkreis (0 rot, 120 grün, 240 blau)
    for (let angle = 0; angle <= 360; angle += 30) {
        ball.setColor(ledmatrix.hue(angle))
        frame()
    }
    // EN: the ball's own brightness fades it out; the matrix brightness stays
    // DE: die eigene Helligkeit des Balls blendet ihn aus; die der Matrix bleibt
    for (let level = 255; level >= 0; level -= 15) {
        ball.setBrightness(level)
        frame()
    }
    ball.remove()
    step()
}

// EN: Scene 3: a pattern shape, clicked together in a grid
// DE: Szene 3: eine Form aus einem Muster, in einem Raster zusammengeklickt
function patternScene() {
    nextScene()
    // EN: empty rows of the grid are cut off: the fish is 5 wide and 3 high
    // DE: leere Zeilen des Rasters fallen weg: Der Fisch ist 5 breit und 3 hoch
    let fish = matrix.createPattern(ledmatrix.grid(`
        . . . . .
        # . # # .
        # # # # #
        # . # # .
        . . . . .
        `), 0, 6, ledmatrix.colors(LedMatrixColors.Orange))
    step()
    while (fish.x() < WIDTH - 5) {
        fish.moveBy(1, 0)
        frame()
    }
    fish.flip(LedMatrixFlip.Horizontal)
    step()
    while (fish.x() > 0) {
        fish.moveBy(-1, 0)
        frame()
    }
    // EN: four quarter turns: once around
    // DE: vier Vierteldrehungen: einmal rundherum
    for (let i = 0; i < 4; i++) {
        fish.rotate(LedMatrixRotation.Right)
        step()
    }
}

// EN: Scene 4: diagonal rainbow stripes, painted pixel by pixel and shifted
// DE: Szene 4: schräge Regenbogenstreifen, Pixel für Pixel gemalt und verschoben
function rainbowScene() {
    nextScene()
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            matrix.setPixel(x, y, ledmatrix.hue(Math.floor((x + y) * 360 / WIDTH)))
        }
    }
    step()
    // EN: with wrap-around on, what is shifted out comes back on the other side
    // DE: mit Umbrechen kommt Herausgeschobenes auf der anderen Seite wieder
    matrix.setWrap(true)
    for (let i = 0; i < WIDTH * 2; i++) {
        matrix.shift(1, 0)
        frame()
    }
    // EN: dim the whole matrix down and back up to 32. Stay at 32 or below:
    //     a bright panel needs more power than the board can give
    // DE: die ganze Matrix dimmen und zurück bis 32. Bleib bei 32 oder darunter:
    //     Ein helles Panel braucht mehr Strom, als das Board liefern kann
    for (let level = 32; level >= 0; level -= 2) {
        matrix.setBrightness(level)
        frame()
    }
    for (let level = 0; level <= 32; level += 2) {
        matrix.setBrightness(level)
        frame()
    }
}

// EN: Scene 5: a ball bouncing inside a stamped frame
// DE: Szene 5: ein Ball prallt in einem gestempelten Rahmen ab
function ballScene() {
    nextScene()
    // EN: a rectangle shape stamped into the drawing and deleted: the frame
    //     is now plain pixels, so canMoveBy sees it
    // DE: eine Rechteck-Form, in die Zeichnung gestempelt und gelöscht: Der
    //     Rahmen ist jetzt einfache Pixel, deshalb sieht canMoveBy ihn
    let border = matrix.createRectangle(0, 0, WIDTH, HEIGHT, ledmatrix.colors(LedMatrixColors.Blue), false)
    border.stamp()
    border.remove()
    let bounces = matrix.createNumber(0, Math.floor((WIDTH - 7) / 2), Math.floor((HEIGHT - 5) / 2), ledmatrix.rgb(80, 80, 80))
    let ball = matrix.createCircle(3, 5, 1, ledmatrix.colors(LedMatrixColors.Yellow), true)
    let dx = 1
    let dy = 1
    let hits = 0
    for (let i = 0; i < 150; i++) {
        if (!ball.canMoveBy(dx, 0)) {
            dx = -dx
            hits++
        }
        if (!ball.canMoveBy(0, dy)) {
            dy = -dy
            hits++
        }
        ball.moveBy(dx, dy)
        bounces.setNumber(hits)
        frame()
    }
}

// EN: Scene 6: shapes that bump into each other or into the drawing
// DE: Szene 6: Formen, die aneinander oder an die Zeichnung stoßen
function bumpingScene() {
    nextScene()
    let box = matrix.createRectangle(10, 1, 4, 4, ledmatrix.colors(LedMatrixColors.Blue), true)
    let dot = matrix.createDot(0, 2, ledmatrix.colors(LedMatrixColors.White))
    // EN: overlaps compares the lit pixels of two shapes
    // DE: overlaps vergleicht die leuchtenden Pixel zweier Formen
    while (!dot.overlaps(box)) {
        dot.moveBy(1, 0)
        frame()
    }
    box.setColor(ledmatrix.colors(LedMatrixColors.Yellow))
    dot.setColor(ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: a purple band stamped into the drawing; the runner turns red while
    //     it touches the drawing
    // DE: ein lila Band, in die Zeichnung gestempelt; der Läufer wird rot,
    //     solange er die Zeichnung berührt
    let band = matrix.createRectangle(6, 8, 3, 5, ledmatrix.colors(LedMatrixColors.Purple), true)
    band.stamp()
    band.remove()
    let runner = matrix.createDot(2, 10, ledmatrix.colors(LedMatrixColors.White))
    step()
    for (let i = 0; i < 10; i++) {
        runner.moveBy(1, 0)
        if (runner.touchesDrawing()) {
            runner.setColor(ledmatrix.colors(LedMatrixColors.Red))
        } else {
            runner.setColor(ledmatrix.colors(LedMatrixColors.White))
        }
        frame()
        basic.pause(200)
    }
    step()
}

basic.forever(function () {
    scene = 0
    houseScene()
    changingScene()
    patternScene()
    rainbowScene()
    ballScene()
    bumpingScene()
})
