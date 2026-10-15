// Feature tour for a WS2812B LED matrix: five scenes in a loop, each one
// announced by its number.
//   1 lines, rectangles, circles and pixels in the drawing layer
//   2 a rainbow from the color wheel, scrolled with wrap-around
//   3 a ball shape bouncing off a drawn frame, with a number shape counting bounces
//   4 falling pieces (sprites) that stop on the pile and are stamped into the drawing
//   5 a multi-color heart sprite wrapping around the edges
// Uses the default layout (columns, zig-zag, first LED top left); for other
// panels add matrix.setLayout(...) below create, see the README.
// It uses nearly every block, so it needs a Calliope mini 3 or a micro:bit;
// it is too big for the Calliope mini 1 and 2.

let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0

let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let centerX = Math.floor(WIDTH / 2)
let centerY = Math.floor(HEIGHT / 2)
let scene = 0

// starts the next scene: shows its number, then an empty matrix without shapes
function nextScene() {
    scene++
    matrix.removeAllShapes()
    matrix.setWrap(false)
    matrix.clear()
    matrix.drawNumber(scene, centerX - 1, centerY - 2, ledmatrix.colors(LedMatrixColors.White))
    matrix.show()
    basic.pause(800)
    matrix.clear()
}

function step() {
    matrix.show()
    basic.pause(500)
}

function drawingScene() {
    nextScene()
    matrix.drawRectangle(0, 0, WIDTH, HEIGHT, ledmatrix.colors(LedMatrixColors.Blue), false)
    step()
    matrix.drawLine(0, 0, WIDTH - 1, HEIGHT - 1, ledmatrix.colors(LedMatrixColors.Red))
    matrix.drawLine(WIDTH - 1, 0, 0, HEIGHT - 1, ledmatrix.colors(LedMatrixColors.Red))
    step()
    matrix.drawCircle(centerX, centerY, 5, ledmatrix.colors(LedMatrixColors.Green), false)
    step()
    matrix.drawCircle(centerX, centerY, 2, ledmatrix.colors(LedMatrixColors.Yellow), true)
    step()
    matrix.drawRectangle(2, 2, 3, 3, ledmatrix.colors(LedMatrixColors.Purple), true)
    matrix.drawRectangle(WIDTH - 5, HEIGHT - 5, 3, 3, ledmatrix.rgb(255, 128, 0), true)
    step()
    matrix.setPixel(centerX, 1, ledmatrix.colors(LedMatrixColors.White))
    matrix.setPixel(centerX, HEIGHT - 2, ledmatrix.colors(LedMatrixColors.White))
    matrix.show()
    basic.pause(2000)
}

function rainbowScene() {
    nextScene()
    for (let x = 0; x < WIDTH; x++) {
        matrix.drawLine(x, 0, x, HEIGHT - 1, ledmatrix.hue(Math.floor(x * 360 / WIDTH)))
    }
    matrix.setWrap(true)
    for (let i = 0; i < WIDTH * 2; i++) {
        matrix.shift(1, 0)
        matrix.show()
        basic.pause(80)
    }
}

function ballScene() {
    nextScene()
    matrix.drawRectangle(0, 0, WIDTH, HEIGHT, ledmatrix.colors(LedMatrixColors.Blue), false)
    let bounces = matrix.createNumber(0, centerX - 3, centerY - 2, ledmatrix.rgb(80, 80, 80))
    let ball = matrix.createCircle(3, 5, 1, ledmatrix.colors(LedMatrixColors.Yellow), true)
    let dx = 1
    let dy = 1
    let hits = 0
    for (let i = 0; i < 150; i++) {
        // the frame is in the drawing layer, so canMoveBy() sees it
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
        matrix.show()
        basic.pause(50)
    }
}

function piecesScene() {
    nextScene()
    let piece = matrix.createSprite(ledmatrix.grid(`
        . . . . .
        . . # . .
        . # # # .
        . . . . .
        . . . . .
        `), 0, 0, ledmatrix.colors(LedMatrixColors.Purple))
    for (let n = 0; n < 10; n++) {
        piece.rotate(LedMatrixRotation.Right)
        piece.setColor(ledmatrix.hue(n * 36))
        piece.setPosition((n * 5) % (WIDTH - piece.width() + 1), 0)
        while (piece.canMoveBy(0, 1)) {
            piece.moveBy(0, 1)
            matrix.show()
            basic.pause(40)
        }
        piece.stamp()
    }
    basic.pause(1500)
}

function heartScene() {
    nextScene()
    matrix.setWrap(true)
    let heart = matrix.createSprite(ledmatrix.pattern(`
        . w r . r r .
        w r r r r r r
        r r r r r r r
        . r r r r r .
        . . r r r . .
        . . . r . . .
    `), 0, centerY - 3, 0)
    for (let i = 0; i < WIDTH * 2; i++) {
        heart.moveBy(1, 0)
        matrix.show()
        basic.pause(100)
    }
}

basic.forever(function () {
    scene = 0
    drawingScene()
    rainbowScene()
    ballScene()
    piecesScene()
    heartScene()
})
