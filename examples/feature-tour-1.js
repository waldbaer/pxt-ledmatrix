// DE: Rundgang 1, für Einsteiger: deine ersten Schritte mit der LED-Matrix.
//     Läuft auf dem Calliope mini 1, 2 und 3 und auf dem micro:bit.
//     Jede Szene beginnt mit ihrer Nummer: Suche hier nach "Szene" und der Nummer.
// EN: Feature tour 1, for beginners: your first steps with the LED matrix.
//     Runs on the Calliope mini 1, 2 and 3 and on the micro:bit.
//     Each scene starts with its number: search here for "Scene" and the number.

// ---------------------------------------------------------------------------
// DE: Einrichtung: die Größe der Matrix, ihr Pin und wie lange du jeden Schritt
//     siehst (1000 = 1 Sekunde).
// EN: Setup: the size of the matrix, its pin, and how long you see each step (1000 = 1 second).
// ---------------------------------------------------------------------------
let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0
let WAIT = 1000

// DE: Erstelle die Matrix. x zählt von links, y von oben, beide ab 0.
// EN: Create the matrix. x counts from the left, y from the top, both from 0.
let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let scene = 0

// ---------------------------------------------------------------------------
// DE: Hilfsfunktionen
// EN: Helpers
// ---------------------------------------------------------------------------

// DE: Startet die nächste Szene: räumt alles weg und zeigt ihre Nummer.
// EN: Starts the next scene: takes everything away and shows its number.
function nextScene() {
    scene = scene + 1
    matrix.removeAllShapes()
    matrix.clear()
    let label = matrix.createNumber(scene, 6, 5, ledmatrix.colors(LedMatrixColors.White))
    step()
    matrix.removeAllShapes()
    step()
}

// DE: Zeigt alle Änderungen auf der Matrix und wartet, damit du sie ansiehst.
// EN: Shows all changes on the matrix and waits, so you can look at them.
function step() {
    matrix.show()
    basic.pause(WAIT)
}

// ---------------------------------------------------------------------------
// DE: Die Szenen, immer wieder abgespielt.
// EN: The scenes, played again and again.
// ---------------------------------------------------------------------------
basic.forever(function () {
    scene = 0

    // -----------------------------------------------------------------------
    // DE: Szene 1: Hallo Pixel
    // EN: Scene 1: Hello pixel
    // -----------------------------------------------------------------------
    nextScene()
    // DE: Schalte das Pixel oben links ein (x 0, y 0). Noch passiert nichts!
    // EN: Turn on the top left pixel (x 0, y 0). Nothing happens yet!
    matrix.setPixel(0, 0, ledmatrix.colors(LedMatrixColors.Red))
    basic.pause(WAIT)
    // DE: Die Matrix ändert sich erst mit show. Jetzt siehst du das Pixel.
    // EN: The matrix only changes when you call show. Now you see the pixel.
    matrix.show()
    basic.pause(WAIT)

    // DE: Das Pixel unten rechts: x ist 15 und y ist 15.
    // EN: The bottom right pixel: x is 15 and y is 15.
    matrix.setPixel(15, 15, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // DE: Das Pixel oben rechts: x ist 15 und y ist 0.
    // EN: The top right pixel: x is 15 and y is 0.
    matrix.setPixel(15, 0, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // DE: Das Pixel unten links: x ist 0 und y ist 15.
    // EN: The bottom left pixel: x is 0 and y is 15.
    matrix.setPixel(0, 15, ledmatrix.colors(LedMatrixColors.Green))
    step()

    // -----------------------------------------------------------------------
    // DE: Szene 2: Farben
    // EN: Scene 2: Colors
    // -----------------------------------------------------------------------
    nextScene()
    // DE: rgb mischt rot, grün und blau (je 0 bis 255). Füll alles mit Dunkelblau.
    // EN: rgb mixes red, green and blue (0 to 255 each). Fill all with dark blue.
    matrix.fill(ledmatrix.rgb(0, 0, 40))
    step()
    // DE: Rotes und grünes Licht ergeben gelb: ein Pixel in der Mitte.
    // EN: Red and Green light make yellow: one pixel in the middle.
    matrix.setPixel(7, 7, ledmatrix.rgb(255, 255, 0))
    step()
    // DE: clear ("löschen") schaltet alle Pixel wieder aus.
    // EN: clear turns all pixels off again.
    matrix.clear()
    step()

    // -----------------------------------------------------------------------
    // DE: Szene 3: Linien
    // EN: Scene 3: Lines
    // -----------------------------------------------------------------------
    nextScene()
    // DE: Eine Linien-Form von der Ecke oben links bis zur Ecke unten rechts.
    // EN: A line shape from the top left corner to the bottom right corner.
    let line1 = matrix.createLine(0, 0, 15, 15, ledmatrix.colors(LedMatrixColors.Red))
    step()
    // DE: Eine zweite Linie von oben rechts bis unten links: ein X.
    // EN: A second line from the top right to the bottom left: an X.
    let line2 = matrix.createLine(15, 0, 0, 15, ledmatrix.colors(LedMatrixColors.Blue))
    step()
    // DE: Eine dritte Linie quer durch die Mitte, von x 0 bis x 15.
    // EN: A third line straight across the middle, from x 0 to x 15.
    let line3 = matrix.createLine(0, 7, 15, 7, ledmatrix.colors(LedMatrixColors.Green))
    step()

    // -----------------------------------------------------------------------
    // DE: Szene 4: Eine Kiste fährt
    // EN: Scene 4: A moving box
    // -----------------------------------------------------------------------
    nextScene()
    // DE: Eine Kiste: eine gefüllte Rechteck-Form bei x 0, y 6, 4 breit, 4 hoch.
    // EN: A box: a filled rectangle shape at x 0, y 6, 4 wide and 4 high.
    let box = matrix.createRectangle(0, 6, 4, 4, ledmatrix.colors(LedMatrixColors.Yellow), true)
    step()
    // DE: Die Kiste fährt nach rechts, 1 Pixel nach dem anderen.
    // EN: The box moves right, 1 pixel at a time.
    for (let i = 0; i < 12; i++) {
        box.moveBy(1, 0)
        matrix.show()
        basic.pause(WAIT / 5)
    }
    basic.pause(WAIT)

    // -----------------------------------------------------------------------
    // DE: Szene 5: Zählen
    // EN: Scene 5: Counting
    // -----------------------------------------------------------------------
    nextScene()
    // DE: Eine Zahl-Form zeigt eine Zahl, hier 0.
    // EN: A number shape shows a number, here 0.
    let counter = matrix.createNumber(0, 6, 5, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // DE: Zähl bis 5: Die Form ändert ihre Zahl.
    // EN: Count up to 5: the shape changes its number.
    for (let n = 1; n <= 5; n++) {
        counter.setNumber(n)
        step()
    }
})
