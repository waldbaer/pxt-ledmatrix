// DE: Verdrahtungstest für eine WS2812B-LED-Matrix. Lass ihn zuerst auf
//     einem neuen Panel laufen: Er zeigt, welche Verdrahtung (setLayout) und
//     welche Farbreihenfolge (setColorOrder) dein Panel braucht. Trage unten
//     deine Größe und deinen Pin ein.
//     Ein 2x2-Quadrat läuft im Uhrzeigersinn am Rand entlang, beginnend oben
//     links: rot oben, grün rechts hinunter, blau unten, gelb links hinauf.
//     Die Zahl in der Mitte zählt die fertigen Runden.
//     Wenn das Quadrat zerfällt, in einer anderen Ecke beginnt, falsch herum
//     läuft oder rot und grün vertauscht sind, hilft die Tabelle zur
//     Fehlersuche im README.
// EN: Wiring check for a WS2812B LED matrix. Run it first on a new panel:
//     it shows which layout (setLayout) and color order (setColorOrder)
//     your panel needs. Set your size and pin below.
//     A 2x2 square walks clockwise along the edges, starting top left: red
//     along the top, green down the right, blue along the bottom, yellow up
//     the left. The number in the middle counts the finished laps.
//     If the square splits, starts in another corner, goes the wrong way, or
//     red and green are swapped, see the troubleshooting table in the README.

let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0
let STEP_MS = 100

let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let square = matrix.createRectangle(0, 0, 2, 2, ledmatrix.colors(LedMatrixColors.Red), true)
let maxX = WIDTH - 2
let maxY = HEIGHT - 2
let laps = 0
let lapNumber = matrix.createNumber(laps, 0, 0, ledmatrix.colors(LedMatrixColors.White))

// DE: zeigt die Rundenzahl in der Mitte (jede Ziffer ist 3 breit plus 1
//     Lücke, 5 hoch)
// EN: shows the lap count in the middle (each digit is 3 wide plus 1 gap,
//     5 high)
function showLaps() {
    let numberWidth = ("" + laps).length * 4 - 1
    lapNumber.setNumber(laps)
    lapNumber.setPosition(Math.floor((WIDTH - numberWidth) / 2), Math.floor((HEIGHT - 5) / 2))
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
