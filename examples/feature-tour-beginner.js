// EN: Feature tour for beginners: a slow tour through everything the LED
//     matrix can do, one small step at a time.
//     It needs a Calliope mini 3: it is too big for the Calliope mini 1 and
//     2 and for the micro:bit.
//     Before each scene, the matrix shows the number of the scene. Search
//     this file for "Scene" and the number to find its code. Every step has
//     a comment that tells you what happens.
//        1 Hello pixel      6 Shapes
//        2 Drawing          7 Changing shapes
//        3 Colors           8 Sprites
//        4 Numbers          9 Bumping into things
//        5 Sliding         10 Secrets of the matrix
//     The matrix works like a whiteboard with magnets on it. The drawing is
//     what you paint on the board. Shapes are magnets: you can move them
//     around on top of the drawing.
//     Make WAIT smaller to make the tour faster.
// DE: Rundgang für Einsteiger: eine langsame Tour durch alles, was die
//     LED-Matrix kann, in kleinen Schritten.
//     Er braucht einen Calliope mini 3: Für den Calliope mini 1 und 2 und
//     den micro:bit ist er zu groß.
//     Vor jeder Szene zeigt die Matrix die Nummer der Szene. Suche in dieser
//     Datei nach "Szene" und der Nummer, dann findest du ihren Code. Über
//     jedem Schritt steht, was passiert.
//        1 Hallo Pixel      6 Formen
//        2 Zeichnen         7 Formen verändern
//        3 Farben           8 Sprites
//        4 Zahlen           9 Zusammenstoßen
//        5 Verschieben     10 Geheimnisse der Matrix
//     Die Matrix ist wie eine Tafel mit Magneten. Die Zeichnung ist das, was
//     du auf die Tafel malst. Formen sind Magnete: Du kannst sie auf der
//     Zeichnung herumschieben.
//     Mach WAIT kleiner, dann läuft die Tour schneller.

// EN: The size of the matrix and the pin it is connected to.
// DE: Die Größe der Matrix und der Pin, an dem sie hängt.
let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0

// EN: How long you see each step, in milliseconds (1000 = 1 second).
// DE: Wie lange du jeden Schritt siehst, in Millisekunden (1000 = 1 Sekunde).
let WAIT = 1000

// EN: Create the matrix. x counts the pixels from the left, y from the top.
//     Both start at 0, so the last pixel is number 15.
// DE: Erstelle die Matrix. x zählt die Pixel von links, y von oben. Beide
//     fangen bei 0 an, also hat das letzte Pixel die Nummer 15.
let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let scene = 0

// EN: Starts the next scene: takes everything away and shows the number of
//     the scene.
// DE: Startet die nächste Szene: räumt alles weg und zeigt die Nummer der
//     Szene.
function nextScene() {
    scene = scene + 1
    matrix.removeAllShapes()
    matrix.setWrap(false)
    matrix.setBrightness(32)
    matrix.clear()
    if (scene < 10) {
        matrix.drawNumber(scene, 6, 5, ledmatrix.colors(LedMatrixColors.White))
    } else {
        matrix.drawNumber(scene, 4, 5, ledmatrix.colors(LedMatrixColors.White))
    }
    matrix.show()
    basic.pause(WAIT)
    matrix.clear()
    matrix.show()
    basic.pause(WAIT / 2)
}

// EN: Shows all changes on the matrix and waits, so you can look at them.
// DE: Zeigt alle Änderungen auf der Matrix und wartet, damit du sie dir
//     ansehen kannst.
function step() {
    matrix.show()
    basic.pause(WAIT)
}

// EN: Like step, but shorter: for things that move.
// DE: Wie step, nur kürzer: für Dinge, die sich bewegen.
function frame() {
    matrix.show()
    basic.pause(WAIT / 5)
}

// EN: Scene 1: Hello pixel
// DE: Szene 1: Hallo Pixel
function helloPixelScene() {
    nextScene()
    // EN: Turn on the pixel in the top left corner (x 0, y 0).
    //     Nothing happens yet!
    // DE: Schalte das Pixel oben links ein (x 0, y 0).
    //     Noch passiert nichts!
    matrix.setPixel(0, 0, ledmatrix.colors(LedMatrixColors.Red))
    basic.pause(WAIT)
    // EN: The matrix only changes when you call show. Now you see the pixel.
    // DE: Die Matrix ändert sich erst, wenn du show ("Änderungen anzeigen")
    //     aufrufst. Jetzt siehst du das Pixel.
    matrix.show()
    basic.pause(WAIT)
    // EN: Top right corner: x is 15.
    // DE: Ecke oben rechts: x ist 15.
    matrix.setPixel(15, 0, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: Bottom right corner: x is 15 and y is 15.
    // DE: Ecke unten rechts: x ist 15 und y ist 15.
    matrix.setPixel(15, 15, ledmatrix.colors(LedMatrixColors.Blue))
    step()
    // EN: Bottom left corner: x is 0 and y is 15.
    // DE: Ecke unten links: x ist 0 und y ist 15.
    matrix.setPixel(0, 15, ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: And one pixel in the middle.
    // DE: Und ein Pixel in der Mitte.
    matrix.setPixel(7, 7, ledmatrix.colors(LedMatrixColors.White))
    step()
}

// EN: Scene 2: Drawing. We paint a house at night.
// DE: Szene 2: Zeichnen. Wir malen ein Haus bei Nacht.
function drawingScene() {
    nextScene()
    // EN: Fill the whole drawing with a very dark blue: the night sky.
    //     (You will learn how rgb mixes colors in scene 3.)
    // DE: Fülle die ganze Zeichnung mit sehr dunklem Blau: der Nachthimmel.
    //     (Wie rgb Farben mischt, lernst du in Szene 3.)
    matrix.fill(ledmatrix.rgb(0, 0, 40))
    step()
    // EN: A green line along the bottom: the grass.
    // DE: Eine grüne Linie ganz unten: das Gras.
    matrix.drawLine(0, 15, 15, 15, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: A rectangle for the walls: 8 wide and 5 high. x and y are its top
    //     left corner. "false" means: only the outline.
    // DE: Ein Rechteck für die Wände: 8 breit und 5 hoch. x und y sind seine
    //     Ecke oben links. "false" heißt: nur der Rand.
    matrix.drawRectangle(2, 10, 8, 5, ledmatrix.colors(LedMatrixColors.Orange), false)
    step()
    // EN: A filled rectangle for the door: "true" fills it.
    // DE: Ein gefülltes Rechteck für die Tür: "true" füllt es aus.
    matrix.drawRectangle(5, 12, 2, 3, ledmatrix.colors(LedMatrixColors.Yellow), true)
    step()
    // EN: Two lines for the roof.
    // DE: Zwei Linien für das Dach.
    matrix.drawLine(1, 10, 5, 6, ledmatrix.colors(LedMatrixColors.Red))
    matrix.drawLine(6, 6, 10, 10, ledmatrix.colors(LedMatrixColors.Red))
    step()
    // EN: A circle for the moon. x and y are its center, 2 is its radius.
    // DE: Ein Kreis für den Mond. x und y sind sein Mittelpunkt, 2 ist sein
    //     Radius.
    matrix.drawCircle(13, 3, 2, ledmatrix.colors(LedMatrixColors.Yellow), false)
    step()
    // EN: The same circle, filled: a full moon.
    // DE: Derselbe Kreis, gefüllt: Vollmond.
    matrix.drawCircle(13, 3, 2, ledmatrix.colors(LedMatrixColors.Yellow), true)
    step()
    // EN: A pattern is a small picture. This one is a star.
    // DE: Ein Muster ist ein kleines Bild. Dieses ist ein Stern.
    let star = ledmatrix.grid(`
        . . . . .
        . . # . .
        . # # # .
        . . # . .
        . . . . .
        `)
    // EN: Draw the star at three places in the sky.
    // DE: Zeichne den Stern an drei Stellen in den Himmel.
    matrix.drawPattern(star, 0, 0, ledmatrix.colors(LedMatrixColors.White))
    step()
    matrix.drawPattern(star, 4, 2, ledmatrix.colors(LedMatrixColors.White))
    step()
    matrix.drawPattern(star, 7, 0, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: Clear wipes the whole drawing.
    // DE: clear ("löschen") wischt die ganze Zeichnung weg.
    matrix.clear()
    step()
}

// EN: Scene 3: Colors
// DE: Szene 3: Farben
function colorsScene() {
    nextScene()
    // EN: A color by its name: red.
    // DE: Eine Farbe mit ihrem Namen: rot.
    matrix.drawRectangle(1, 1, 4, 4, ledmatrix.colors(LedMatrixColors.Red), true)
    step()
    // EN: rgb mixes light from red, green and blue. Each one goes from 0
    //     (off) to 255 (full). This is only green.
    // DE: rgb mischt Licht aus rot, grün und blau. Jedes geht von 0 (aus)
    //     bis 255 (voll). Das hier ist nur grün.
    matrix.drawRectangle(6, 1, 4, 4, ledmatrix.rgb(0, 255, 0), true)
    step()
    // EN: Red and green light together make yellow!
    // DE: Rotes und grünes Licht zusammen ergeben gelb!
    matrix.drawRectangle(11, 1, 4, 4, ledmatrix.rgb(255, 255, 0), true)
    step()
    // EN: Only blue.
    // DE: Nur blau.
    matrix.drawRectangle(1, 6, 4, 4, ledmatrix.rgb(0, 0, 255), true)
    step()
    // EN: Red and blue make purple.
    // DE: Rot und blau ergeben lila.
    matrix.drawRectangle(6, 6, 4, 4, ledmatrix.rgb(255, 0, 255), true)
    step()
    // EN: All three together make white.
    // DE: Alle drei zusammen ergeben weiß.
    matrix.drawRectangle(11, 6, 4, 4, ledmatrix.rgb(255, 255, 255), true)
    step()
    // EN: Small numbers give dark colors: a dark red ...
    // DE: Kleine Zahlen ergeben dunkle Farben: ein dunkles Rot ...
    matrix.drawRectangle(1, 11, 6, 4, ledmatrix.rgb(40, 0, 0), true)
    step()
    // EN: ... and a bright red.
    // DE: ... und ein helles Rot.
    matrix.drawRectangle(9, 11, 6, 4, ledmatrix.rgb(255, 0, 0), true)
    step()
    // EN: Start again with an empty drawing.
    // DE: Fang wieder mit einer leeren Zeichnung an.
    matrix.clear()
    step()
    // EN: hue picks a color from the color circle: 0 is red, 120 green,
    //     240 blue, and at 360 you are back at red. Each column gets the
    //     next color: a rainbow!
    // DE: hue ("Farbton") nimmt eine Farbe aus dem Farbkreis: 0 ist rot,
    //     120 grün, 240 blau, und bei 360 bist du wieder bei rot. Jede
    //     Spalte bekommt die nächste Farbe: ein Regenbogen!
    for (let x = 0; x < WIDTH; x++) {
        matrix.drawLine(x, 5, x, 10, ledmatrix.hue(x * 22))
        frame()
    }
    basic.pause(WAIT)
}

// EN: Scene 4: Numbers
// DE: Szene 4: Zahlen
function numbersScene() {
    nextScene()
    // EN: Draw the number 42. Its top left corner is at x 4, y 1.
    //     A drawn number is paint on the board.
    // DE: Zeichne die Zahl 42. Ihre Ecke oben links ist bei x 4, y 1.
    //     Eine gezeichnete Zahl ist Farbe auf der Tafel.
    matrix.drawNumber(42, 4, 1, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: A number shape is a magnet that shows a number.
    // DE: Eine Zahl-Form ist ein Magnet, der eine Zahl zeigt.
    let counter = matrix.createNumber(5, 6, 9, ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: Count down: the magnet changes its number.
    // DE: Countdown: Der Magnet ändert seine Zahl.
    for (let n = 4; n >= 0; n--) {
        counter.setNumber(n)
        step()
    }
    // EN: Clear wipes the paint, but the magnet stays.
    // DE: clear wischt die Farbe weg, aber der Magnet bleibt.
    matrix.clear()
    step()
}

// EN: Scene 5: Sliding
// DE: Szene 5: Verschieben
function slidingScene() {
    nextScene()
    // EN: Draw a smiley: a circle, two eyes and a mouth.
    // DE: Zeichne einen Smiley: einen Kreis, zwei Augen und einen Mund.
    matrix.drawCircle(7, 7, 5, ledmatrix.colors(LedMatrixColors.Yellow), false)
    matrix.setPixel(5, 5, ledmatrix.colors(LedMatrixColors.Cyan))
    matrix.setPixel(9, 5, ledmatrix.colors(LedMatrixColors.Cyan))
    matrix.drawLine(5, 9, 9, 9, ledmatrix.colors(LedMatrixColors.Red))
    step()
    // EN: Shift moves the whole drawing. Move it to the right, one pixel at a
    //     time: it slides out and is gone.
    // DE: shift ("verschiebe Zeichnung") bewegt die ganze Zeichnung. Schieb
    //     sie nach rechts, ein Pixel nach dem anderen: Sie rutscht hinaus und
    //     ist weg.
    for (let i = 0; i < WIDTH; i++) {
        matrix.shift(1, 0)
        frame()
    }
    basic.pause(WAIT)
    // EN: Draw the smiley again.
    // DE: Zeichne den Smiley noch einmal.
    matrix.drawCircle(7, 7, 5, ledmatrix.colors(LedMatrixColors.Yellow), false)
    matrix.setPixel(5, 5, ledmatrix.colors(LedMatrixColors.Cyan))
    matrix.setPixel(9, 5, ledmatrix.colors(LedMatrixColors.Cyan))
    matrix.drawLine(5, 9, 9, 9, ledmatrix.colors(LedMatrixColors.Red))
    step()
    // EN: Turn on "wrap around": what slides out on one side comes back on
    //     the other side.
    // DE: Schalte "an den Rändern umbrechen" ein: Was auf einer Seite
    //     hinausrutscht, kommt auf der anderen Seite wieder herein.
    matrix.setWrap(true)
    for (let i = 0; i < WIDTH; i++) {
        matrix.shift(1, 0)
        frame()
    }
    // EN: The same downwards.
    // DE: Dasselbe nach unten.
    for (let i = 0; i < HEIGHT; i++) {
        matrix.shift(0, 1)
        frame()
    }
    basic.pause(WAIT)
}

// EN: Scene 6: Shapes. Shapes are the magnets on top of the drawing.
// DE: Szene 6: Formen. Formen sind die Magnete auf der Zeichnung.
function shapesScene() {
    nextScene()
    // EN: First some paint: a blue line across the middle.
    // DE: Zuerst etwas Farbe: eine blaue Linie quer durch die Mitte.
    matrix.drawLine(0, 7, 15, 7, ledmatrix.colors(LedMatrixColors.Blue))
    step()
    // EN: A rectangle shape.
    // DE: Eine Rechteck-Form.
    let box = matrix.createRectangle(1, 1, 4, 3, ledmatrix.colors(LedMatrixColors.Red), true)
    step()
    // EN: A circle shape.
    // DE: Eine Kreis-Form.
    let ball = matrix.createCircle(12, 3, 2, ledmatrix.colors(LedMatrixColors.Green), true)
    step()
    // EN: A line shape.
    // DE: Eine Linien-Form.
    let stick = matrix.createLine(1, 12, 6, 12, ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: A dot shape: just one pixel.
    // DE: Eine Punkt-Form: nur ein Pixel.
    let dot = matrix.createDot(1, 10, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: Move the dot to the right, one pixel at a time.
    // DE: Bewege den Punkt nach rechts, ein Pixel nach dem anderen.
    for (let i = 0; i < 5; i++) {
        dot.moveBy(1, 0)
        frame()
    }
    basic.pause(WAIT)
    // EN: Jump: put the dot at a new place.
    // DE: Spring: Setze den Punkt an eine neue Stelle.
    dot.setPosition(1, 14)
    step()
    // EN: x() tells you where the dot is. Walk right while x is less than 12.
    // DE: x() sagt dir, wo der Punkt ist. Geh nach rechts, solange x kleiner
    //     als 12 ist.
    while (dot.x() < 12) {
        dot.moveBy(1, 0)
        frame()
    }
    // EN: y() works the same way. Walk up while y is more than 9.
    // DE: y() funktioniert genauso. Geh nach oben, solange y größer als 9 ist.
    while (dot.y() > 9) {
        dot.moveBy(0, -1)
        frame()
    }
    basic.pause(WAIT)
    // EN: A shape knows its width() and height(). With them, the rectangle
    //     can move into the bottom right corner.
    // DE: Eine Form kennt ihre Breite width() und Höhe height(). Damit kann
    //     das Rechteck in die Ecke unten rechts gehen.
    box.setPosition(WIDTH - box.width(), HEIGHT - box.height())
    step()
    // EN: Clear wipes the drawing: the blue line is gone, the magnets stay.
    // DE: clear wischt die Zeichnung weg: Die blaue Linie ist weg, die
    //     Magnete bleiben.
    matrix.clear()
    step()
    // EN: Paint a new blue line.
    // DE: Male eine neue blaue Linie.
    matrix.drawLine(0, 7, 15, 7, ledmatrix.colors(LedMatrixColors.Blue))
    step()
    // EN: Take all magnets off: the shapes are gone, the drawing stays.
    // DE: Nimm alle Magnete ab ("alle Formen löschen"): Die Formen sind weg,
    //     die Zeichnung bleibt.
    matrix.removeAllShapes()
    step()
}

// EN: Scene 7: Changing shapes
// DE: Szene 7: Formen verändern
function changingShapesScene() {
    nextScene()
    // EN: A blue box.
    // DE: Eine blaue Kiste.
    let box = matrix.createRectangle(7, 3, 6, 6, ledmatrix.colors(LedMatrixColors.Blue), true)
    step()
    // EN: A red ball. It came later, so it lies on top of the box.
    // DE: Ein roter Ball. Er kam später, deshalb liegt er auf der Kiste.
    let ball = matrix.createCircle(5, 7, 3, ledmatrix.colors(LedMatrixColors.Red), true)
    step()
    // EN: A yellow line.
    // DE: Eine gelbe Linie.
    let stick = matrix.createLine(0, 14, 15, 14, ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: Give the ball a new color.
    // DE: Gib dem Ball eine neue Farbe.
    ball.setColor(ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: Make the ball blink: hide it, show it, three times.
    // DE: Lass den Ball blinken: verstecken, zeigen, dreimal.
    for (let i = 0; i < 3; i++) {
        ball.setVisible(false)
        frame()
        ball.setVisible(true)
        frame()
    }
    basic.pause(WAIT)
    // EN: Fade the ball out like a ghost: its brightness goes from 255
    //     (full) down to 30.
    // DE: Lass den Ball wie ein Geist verblassen: Seine Helligkeit geht von
    //     255 (voll) hinunter bis 30.
    for (let level = 255; level >= 30; level = level - 25) {
        ball.setBrightness(level)
        frame()
    }
    // EN: And back to full brightness.
    // DE: Und zurück zur vollen Helligkeit.
    for (let level = 30; level <= 255; level = level + 25) {
        ball.setBrightness(level)
        frame()
    }
    basic.pause(WAIT)
    // EN: Bring the box to the front: now it covers the ball.
    // DE: Hol die Kiste nach vorne: Jetzt verdeckt sie den Ball.
    box.bringToFront()
    step()
    // EN: And the ball to the front again.
    // DE: Und den Ball wieder nach vorne.
    ball.bringToFront()
    step()
    // EN: Delete the line: it is gone for good.
    // DE: Lösche die Linie: Sie ist für immer weg.
    stick.remove()
    step()
}

// EN: Scene 8: Sprites. A sprite is a shape made from a pattern.
// DE: Szene 8: Sprites. Ein Sprite ist eine Form aus einem Muster.
function spritesScene() {
    nextScene()
    // EN: An arrow made from a pattern that you can click together.
    // DE: Ein Pfeil aus einem Muster, das du zusammenklicken kannst.
    let arrow = matrix.createSprite(ledmatrix.grid(`
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
        `), 5, 5, ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: Turn the arrow to the right, four times: once around.
    // DE: Dreh den Pfeil nach rechts, viermal: einmal rundherum.
    for (let i = 0; i < 4; i++) {
        arrow.rotate(LedMatrixRotation.Right)
        step()
    }
    // EN: A pattern can also be written as text. Each letter is a color:
    //     y yellow, b blue, r red, "." is off.
    // DE: Ein Muster kann man auch als Text schreiben. Jeder Buchstabe ist
    //     eine Farbe: y gelb, b blau, r rot, "." ist aus.
    let happy = ledmatrix.pattern(`
        . y y y y y .
        y y b y b y y
        y y y y y y y
        y r y y y r y
        y y r r r y y
        . y y y y y .
    `)
    // EN: The same face with one eye closed.
    // DE: Dasselbe Gesicht mit einem geschlossenen Auge.
    let wink = ledmatrix.pattern(`
        . y y y y y .
        y y y y b y y
        y y y y y y y
        y r y y y r y
        y y r r r y y
        . y y y y y .
    `)
    // EN: Delete the arrow and make a sprite with the face.
    // DE: Lösche den Pfeil und mach ein Sprite mit dem Gesicht.
    arrow.remove()
    let face = matrix.createSprite(happy, 4, 5, ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: Swap the pattern: the face winks.
    // DE: Tausche das Muster: Das Gesicht zwinkert.
    face.setPattern(wink)
    step()
    // EN: And open the eye again.
    // DE: Und das Auge wieder auf.
    face.setPattern(happy)
    step()
    // EN: Delete the face and make a fish: o is orange, w is white.
    // DE: Lösche das Gesicht und mach einen Fisch: o ist orange, w ist weiß.
    face.remove()
    let fish = matrix.createSprite(ledmatrix.pattern(`
        . . . o o . .
        o . o o o o .
        o o o o o w o
        o . o o o o .
        . . . o o . .
    `), 0, 6, ledmatrix.colors(LedMatrixColors.Orange))
    step()
    // EN: The fish swims right until it reaches the edge.
    // DE: Der Fisch schwimmt nach rechts, bis er den Rand erreicht.
    while (fish.x() + fish.width() < WIDTH) {
        fish.moveBy(1, 0)
        frame()
    }
    basic.pause(WAIT)
    // EN: Flip the fish: left and right swap, so it looks the other way.
    // DE: Spiegle den Fisch: Links und rechts tauschen, also schaut er in die
    //     andere Richtung.
    fish.flip(LedMatrixFlip.Horizontal)
    step()
    // EN: Now it swims back.
    // DE: Jetzt schwimmt er zurück.
    while (fish.x() > 0) {
        fish.moveBy(-1, 0)
        frame()
    }
    basic.pause(WAIT)
}

// EN: Scene 9: Bumping into things
// DE: Szene 9: Zusammenstoßen
function bumpingScene() {
    nextScene()
    // EN: A box and a dot.
    // DE: Eine Kiste und ein Punkt.
    let box = matrix.createRectangle(10, 1, 4, 4, ledmatrix.colors(LedMatrixColors.Blue), true)
    let dot = matrix.createDot(0, 2, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: The dot flies towards the box until they overlap.
    // DE: Der Punkt fliegt auf die Kiste zu, bis sie sich berühren.
    while (dot.overlaps(box) == false) {
        dot.moveBy(1, 0)
        frame()
    }
    // EN: They overlap: both turn yellow.
    // DE: Sie berühren sich: Beide werden gelb.
    box.setColor(ledmatrix.colors(LedMatrixColors.Yellow))
    dot.setColor(ledmatrix.colors(LedMatrixColors.Yellow))
    step()
    // EN: Take the shapes away. Paint a red wall and put a green dot left of
    //     it.
    // DE: Nimm die Formen weg. Male eine rote Wand und setze links davon
    //     einen grünen Punkt.
    matrix.removeAllShapes()
    matrix.drawLine(12, 0, 12, 4, ledmatrix.colors(LedMatrixColors.Red))
    let walker = matrix.createDot(2, 2, ledmatrix.colors(LedMatrixColors.Green))
    step()
    // EN: The dot walks right as long as it can. canMoveBy asks: can I take
    //     this step without bumping into the drawing or leaving the matrix?
    // DE: Der Punkt geht nach rechts, solange er kann. canMoveBy fragt: Kann
    //     ich diesen Schritt machen, ohne an die Zeichnung zu stoßen oder die
    //     Matrix zu verlassen?
    while (walker.canMoveBy(1, 0)) {
        walker.moveBy(1, 0)
        frame()
    }
    basic.pause(WAIT)
    // EN: Paint a purple band and put a white dot left of it.
    // DE: Male ein lila Band und setze links davon einen weißen Punkt.
    matrix.drawRectangle(6, 5, 3, 5, ledmatrix.colors(LedMatrixColors.Purple), true)
    let runner = matrix.createDot(3, 7, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: The dot walks across the band: while it touches the drawing, it is
    //     red, otherwise white.
    // DE: Der Punkt läuft über das Band: Solange er die Zeichnung berührt,
    //     ist er rot, sonst weiß.
    for (let i = 0; i < 8; i++) {
        runner.moveBy(1, 0)
        if (runner.touchesDrawing()) {
            runner.setColor(ledmatrix.colors(LedMatrixColors.Red))
        } else {
            runner.setColor(ledmatrix.colors(LedMatrixColors.White))
        }
        frame()
    }
    basic.pause(WAIT)
    // EN: Two cars: a yellow one and a parked blue one.
    // DE: Zwei Autos: ein gelbes und ein geparktes blaues.
    let car = matrix.createRectangle(0, 12, 3, 2, ledmatrix.colors(LedMatrixColors.Yellow), true)
    let parked = matrix.createRectangle(11, 12, 3, 2, ledmatrix.colors(LedMatrixColors.Blue), true)
    step()
    // EN: Before every step, the yellow car checks: would I hit the blue car?
    //     If yes, it stops.
    // DE: Vor jedem Schritt prüft das gelbe Auto: Würde ich das blaue Auto
    //     berühren? Wenn ja, hält es an.
    while (car.wouldOverlap(parked, 1, 0) == false) {
        car.moveBy(1, 0)
        frame()
    }
    basic.pause(WAIT)
    // EN: Take everything away and make a green square.
    // DE: Räum alles weg und mach ein grünes Quadrat.
    matrix.removeAllShapes()
    matrix.clear()
    let square = matrix.createRectangle(9, 6, 3, 3, ledmatrix.colors(LedMatrixColors.Green), true)
    step()
    // EN: The square moves out of the matrix to the right. It is green while
    //     it is inside, yellow when it is on the edge, and red when part of
    //     it is outside.
    // DE: Das Quadrat fährt rechts aus der Matrix hinaus. Es ist grün,
    //     solange es innen ist, gelb am Rand und rot, wenn ein Teil draußen
    //     ist.
    while (square.x() < WIDTH) {
        if (square.isInside() == false) {
            square.setColor(ledmatrix.colors(LedMatrixColors.Red))
        } else if (square.isOnEdge()) {
            square.setColor(ledmatrix.colors(LedMatrixColors.Yellow))
        } else {
            square.setColor(ledmatrix.colors(LedMatrixColors.Green))
        }
        step()
        square.moveBy(1, 0)
    }
    step()
    // EN: Stamp copies a shape into the drawing, like a stamp on paper.
    //     A foot walks and leaves footprints.
    // DE: stamp ("in die Zeichnung stempeln") kopiert eine Form in die
    //     Zeichnung, wie ein Stempel auf Papier. Ein Fuß läuft und hinterlässt
    //     Fußabdrücke.
    let foot = matrix.createSprite(ledmatrix.pattern(".#.|###|###|.#."), 0, 4, ledmatrix.rgb(150, 75, 0))
    let footY = 4
    for (let x = 0; x < 14; x = x + 3) {
        foot.setPosition(x, footY)
        foot.stamp()
        step()
        if (footY == 4) {
            footY = 9
        } else {
            footY = 4
        }
    }
    // EN: The foot is deleted, but its footprints stay in the drawing.
    // DE: Der Fuß wird gelöscht, aber seine Abdrücke bleiben in der Zeichnung.
    foot.remove()
    step()
}

// EN: Scene 10: Secrets of the matrix
// DE: Szene 10: Geheimnisse der Matrix
function secretsScene() {
    nextScene()
    // EN: The LEDs are connected like one long snake, and each LED has a
    //     number in it. ledIndex tells you the number at x and y. Each LED
    //     gets a color from its number, so the rainbow runs along the snake:
    //     down the first column, up the next one, and so on.
    // DE: Die LEDs hängen hintereinander wie eine lange Schlange, und jede
    //     LED hat darin eine Nummer. ledIndex ("LED-Nummer") sagt dir die
    //     Nummer bei x und y. Jede LED bekommt eine Farbe aus ihrer Nummer,
    //     also läuft der Regenbogen an der Schlange entlang: die erste Spalte
    //     hinunter, die nächste hinauf und so weiter.
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            matrix.setPixel(x, y, ledmatrix.hue(matrix.ledIndex(x, y) * 22))
        }
        frame()
    }
    basic.pause(WAIT)
    // EN: setBrightness dims the whole matrix: down to 0 ...
    // DE: setBrightness ("setze Helligkeit") dimmt die ganze Matrix: bis 0 ...
    for (let level = 32; level >= 0; level = level - 2) {
        matrix.setBrightness(level)
        frame()
    }
    // EN: ... and back up to 32. Stay at 32 or below: a bright matrix needs
    //     more power than your board can give.
    // DE: ... und zurück bis 32. Bleib bei 32 oder darunter: Eine helle
    //     Matrix braucht mehr Strom, als dein Board liefern kann.
    for (let level = 0; level <= 32; level = level + 2) {
        matrix.setBrightness(level)
        frame()
    }
    basic.pause(WAIT)
    // EN: The matrix knows its own size: width() and height(). Clear it and
    //     use them to draw a frame around the whole matrix.
    // DE: Die Matrix kennt ihre eigene Größe: width() und height(). Lösche
    //     sie und zeichne damit einen Rahmen um die ganze Matrix.
    matrix.clear()
    matrix.drawRectangle(0, 0, matrix.width(), matrix.height(), ledmatrix.colors(LedMatrixColors.Cyan), false)
    step()
    // EN: Paint a rainbow band.
    // DE: Male ein Regenbogen-Band.
    for (let x = 1; x < WIDTH - 1; x++) {
        matrix.drawLine(x, 5, x, 7, ledmatrix.hue(x * 25))
    }
    step()
    // EN: Put a white dot right below the band.
    // DE: Setze einen weißen Punkt direkt unter das Band.
    let chameleon = matrix.createDot(1, 8, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: The dot walks along the band. getPixel reads the color of the pixel
    //     above the dot, and the dot takes that color, like a chameleon.
    // DE: Der Punkt läuft am Band entlang. getPixel ("Pixelfarbe") liest die
    //     Farbe des Pixels über dem Punkt, und der Punkt nimmt diese Farbe
    //     an, wie ein Chamäleon.
    while (chameleon.x() < WIDTH - 2) {
        chameleon.setColor(matrix.getPixel(chameleon.x(), 7))
        frame()
        chameleon.moveBy(1, 0)
    }
    chameleon.setColor(matrix.getPixel(chameleon.x(), 7))
    step()
}

// EN: Play all scenes, again and again.
// DE: Spiele alle Szenen ab, immer wieder.
basic.forever(function () {
    scene = 0
    helloPixelScene()
    drawingScene()
    colorsScene()
    numbersScene()
    slidingScene()
    shapesScene()
    changingShapesScene()
    spritesScene()
    bumpingScene()
    secretsScene()
})
