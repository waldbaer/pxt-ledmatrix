// DE: Übung 8, Hüpf-Spiel: Lösung mit Extra. Manchmal kommen zwei Hindernisse
//     kurz hintereinander, 5 Pixel auseinander: Dann springst du zweimal.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 8, Jump game: solution with the Extra. Sometimes two obstacles
//     come close together, 5 pixels apart: then you jump twice.
//     Runs on the Calliope mini 1, 2 and 3.
let punkte = 0
let luft = 0
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let boden = matrix.createLine(0, 15, 15, 15, ledmatrix.colors(LedMatrixColors.Green))
let figur = matrix.createRectangle(1, 13, 1, 2, ledmatrix.colors(LedMatrixColors.Yellow), true)
let hindernis = matrix.createDot(15, 14, ledmatrix.colors(LedMatrixColors.Red))
// DE: Extra: das zweite Hindernis ist versteckt, bis es gebraucht wird.
//     zweites sagt, ob es gerade unterwegs ist.
// EN: Extra: the second obstacle is hidden until it is needed.
//     zweites says whether it is on its way.
let zweites = false
let hindernis2 = matrix.createDot(15, 14, ledmatrix.colors(LedMatrixColors.Red))
hindernis2.setVisible(false)
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (luft == 0) {
        figur.setPosition(1, 10)
        luft = 3
        matrix.show()
    }
})
basic.forever(function () {
    hindernis.moveBy(-1, 0)
    hindernis2.moveBy(-1, 0)
    if (hindernis.x() < 0) {
        hindernis.setPosition(15, 14)
        punkte += 1
        if (randint(0, 2) == 0) {
            hindernis2.setPosition(20, 14)
            hindernis2.setVisible(true)
            zweites = true
        }
    }
    if (zweites && hindernis2.x() < 0) {
        hindernis2.setVisible(false)
        zweites = false
        punkte += 1
    }
    if (luft > 0) {
        luft += -1
        if (luft == 0) {
            figur.setPosition(1, 13)
        }
    }
    if (figur.overlaps(hindernis) || figur.overlaps(hindernis2)) {
        basic.showNumber(punkte)
        punkte = 0
        hindernis.setPosition(15, 14)
        hindernis2.setVisible(false)
        zweites = false
    }
    matrix.show()
    basic.pause(200)
})
