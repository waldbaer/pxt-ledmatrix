// Wiring check for a WS2812B LED matrix.
// A 2x2 square walks clockwise along the edges, starting top left:
// red along the top, green down the right, blue along the bottom, yellow up the left.
// The number in the middle counts the finished laps.
// If the square splits, starts in another corner or goes the wrong way,
// see the troubleshooting table in the README.

let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0
let STEP_MS = 100

let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let square = matrix.createRectangle(0, 0, 2, 2, ledmatrix.colors(LedMatrixColors.Red), true)
let maxX = WIDTH - 2
let maxY = HEIGHT - 2
let laps = 0

// shows the lap count in the middle (each digit is 3 wide plus 1 gap, 5 high)
function showLaps() {
    let numberWidth = ("" + laps).length * 4 - 1
    matrix.clear()
    matrix.drawNumber(laps, Math.floor((WIDTH - numberWidth) / 2), Math.floor((HEIGHT - 5) / 2), ledmatrix.colors(LedMatrixColors.White))
}

function step() {
    matrix.show()
    basic.pause(STEP_MS)
}

showLaps()
basic.forever(function () {
    square.setColor(ledmatrix.colors(LedMatrixColors.Red))
    for (let x = 0; x < maxX; x++) {
        square.setPosition(x, 0)
        step()
    }
    square.setColor(ledmatrix.colors(LedMatrixColors.Green))
    for (let y = 0; y < maxY; y++) {
        square.setPosition(maxX, y)
        step()
    }
    square.setColor(ledmatrix.colors(LedMatrixColors.Blue))
    for (let x = maxX; x > 0; x--) {
        square.setPosition(x, maxY)
        step()
    }
    square.setColor(ledmatrix.colors(LedMatrixColors.Yellow))
    for (let y = maxY; y > 0; y--) {
        square.setPosition(0, y)
        step()
    }
    laps++
    showLaps()
})
