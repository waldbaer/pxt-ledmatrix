// EN: Feature tour 1, for beginners: your first steps with the LED matrix.
//     Runs on the Calliope mini 1, 2 and 3 and on the micro:bit.
//     Each scene starts with its number: search here for "Scene" and the number.
// DE: Rundgang 1, für Einsteiger: deine ersten Schritte mit der LED-Matrix.
//     Läuft auf dem Calliope mini 1, 2 und 3 und auf dem micro:bit.
//     Jede Szene beginnt mit ihrer Nummer: Suche hier nach "Szene" und der Nummer.

// ---------------------------------------------------------------------------
// EN: Setup: the size of the matrix, its pin, and how long you see each step
//     (1000 = 1 second).
// DE: Einrichtung: die Größe der Matrix, ihr Pin und wie lange du jeden Schritt
//     siehst (1000 = 1 Sekunde).
// ---------------------------------------------------------------------------
let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0
let WAIT = 1000

// EN: Create the matrix. x counts from the left, y from the top, both from 0.
// DE: Erstelle die Matrix. x zählt von links, y von oben, beide ab 0.
let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let scene = 0

// ---------------------------------------------------------------------------
// EN: Helpers
// DE: Hilfsfunktionen
// ---------------------------------------------------------------------------

// EN: Starts the next scene: takes everything away and shows its number.
// DE: Startet die nächste Szene: räumt alles weg und zeigt ihre Nummer.
function nextScene() {
    scene = scene + 1
    matrix.removeAllShapes()
    matrix.clear()
    let label = matrix.createNumber(scene, 6, 5, ledmatrix.colors(LedMatrixColors.White))
    step()
    matrix.removeAllShapes()
    step()
}

// EN: Shows all changes on the matrix and waits, so you can look at them.
// DE: Zeigt alle Änderungen auf der Matrix und wartet, damit du sie ansiehst.
function step() {
    matrix.show()
    basic.pause(WAIT)
}

// ---------------------------------------------------------------------------
// EN: The scenes, played again and again.
// DE: Die Szenen, immer wieder abgespielt.
// ---------------------------------------------------------------------------
basic.forever(function () {
    scene = 0

    // -----------------------------------------------------------------------
    // EN: Scene 1: Hello pixel
    // DE: Szene 1: Hallo Pixel
    // -----------------------------------------------------------------------
    nextScene()
    // EN: Turn on the top left pixel (x 0, y 0). Nothing happens yet!
    // DE: Schalte das Pixel oben links ein (x 0, y 0). Noch passiert nichts!
    matrix.setPixel(0, 0, ledmatrix.colors(LedMatrixColors.Red))
    basic.pause(WAIT)
    // EN: The matrix only changes when you call show. Now you see the pixel.
    // DE: Die Matrix ändert sich erst mit show. Jetzt siehst du das Pixel.
    matrix.show()
    basic.pause(WAIT)

    // EN: The bottom right pixel: x is 15 and y is 15.
    // DE: Das Pixel unten rechts: x ist 15 und y ist 15.
    matrix.setPixel(15, 15, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: The top right pixel: x is 15 and y is 0.
    // DE: Das Pixel oben rechts: x ist 15 und y ist 0.
    matrix.setPixel(15, 0, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: The bottom left pixel: x is 0 and y is 15.
    // DE: Das Pixel unten links: x ist 0 und y ist 15.
    matrix.setPixel(0, 15, ledmatrix.colors(LedMatrixColors.Green))
    step()

    // -----------------------------------------------------------------------
    // EN: Scene 2: Colors
    // DE: Szene 2: Farben
    // -----------------------------------------------------------------------
    nextScene()
    // EN: rgb mixes red, green and blue (0 to 255 each). Fill all with dark blue.
    // DE: rgb mischt rot, grün und blau (je 0 bis 255). Füll alles mit Dunkelblau.
    matrix.fill(ledmatrix.rgb(0, 0, 40))
    step()
    // EN: Red and blue light make purple: one pixel in the middle.
    // DE: Rotes und blaues Licht ergeben lila: ein Pixel in der Mitte.
    matrix.setPixel(7, 7, ledmatrix.rgb(255, 0, 255))
    step()
    // EN: clear turns all pixels off again.
    // DE: clear ("löschen") schaltet alle Pixel wieder aus.
    matrix.clear()
    step()

    // -----------------------------------------------------------------------
    // EN: Scene 3: Lines
    // DE: Szene 3: Linien
    // -----------------------------------------------------------------------
    nextScene()
    // EN: A line shape from the top left corner to the bottom right corner.
    // DE: Eine Linien-Form von der Ecke oben links bis zur Ecke unten rechts.
    let line1 = matrix.createLine(0, 0, 15, 15, ledmatrix.colors(LedMatrixColors.Red))
    step()
    // EN: A second line from the top right to the bottom left: an X.
    // DE: Eine zweite Linie von oben rechts bis unten links: ein X.
    let line2 = matrix.createLine(15, 0, 0, 15, ledmatrix.colors(LedMatrixColors.Blue))
    step()
    // EN: A third line straight across the middle, from x 0 to x 15.
    // DE: Eine dritte Linie quer durch die Mitte, von x 0 bis x 15.
    let line3 = matrix.createLine(0, 7, 15, 7, ledmatrix.colors(LedMatrixColors.Green))
    step()

    // -----------------------------------------------------------------------
    // EN: Scene 4: A moving box
    // DE: Szene 4: Eine Kiste fährt
    // -----------------------------------------------------------------------
    nextScene()
    // EN: A box: a filled rectangle shape at x 0, y 6, 4 wide and 4 high.
    // DE: Eine Kiste: eine gefüllte Rechteck-Form bei x 0, y 6, 4 breit, 4 hoch.
    let box = matrix.createRectangle(0, 6, 4, 4, ledmatrix.colors(LedMatrixColors.Yellow), true)
    step()
    // EN: The box moves right, 1 pixel at a time.
    // DE: Die Kiste fährt nach rechts, 1 Pixel nach dem anderen.
    for (let i = 0; i < 12; i++) {
        box.moveBy(1, 0)
        matrix.show()
        basic.pause(WAIT / 5)
    }
    basic.pause(WAIT)

    // -----------------------------------------------------------------------
    // EN: Scene 5: Counting
    // DE: Szene 5: Zählen
    // -----------------------------------------------------------------------
    nextScene()
    // EN: A number shape shows a number, here 0.
    // DE: Eine Zahl-Form zeigt eine Zahl, hier 0.
    let counter = matrix.createNumber(0, 6, 5, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: Count up to 5: the shape changes its number.
    // DE: Zähl bis 5: Die Form ändert ihre Zahl.
    for (let n = 1; n <= 5; n++) {
        counter.setNumber(n)
        step()
    }
})
