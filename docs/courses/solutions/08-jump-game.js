// DE: Übung 8, Hüpf-Spiel: Lösung. Von rechts kommen Hindernisse, mit A springt
//     die gelbe Figur darüber. Jedes übersprungene Hindernis gibt einen Punkt.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 8, Jump game: solution. Obstacles come from the right, A makes the
//     yellow figure jump over them. Each obstacle cleared gives a point.
//     Runs on the Calliope mini 1, 2 and 3.
let punkte = 0
let luft = 0
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let boden = matrix.createLine(0, 15, 15, 15, ledmatrix.colors(LedMatrixColors.Green))
let figur = matrix.createRectangle(1, 13, 1, 2, ledmatrix.colors(LedMatrixColors.Yellow), true)
let hindernis = matrix.createDot(15, 14, ledmatrix.colors(LedMatrixColors.Red))
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (luft == 0) {
        figur.setPosition(1, 10)
        luft = 3
        matrix.show()
    }
})
basic.forever(function () {
    hindernis.moveBy(-1, 0)
    if (hindernis.x() < 0) {
        hindernis.setPosition(15, 14)
        punkte += 1
    }
    if (luft > 0) {
        luft += -1
        if (luft == 0) {
            figur.setPosition(1, 13)
        }
    }
    if (figur.overlaps(hindernis)) {
        basic.showNumber(punkte)
        punkte = 0
        hindernis.setPosition(15, 14)
    }
    matrix.show()
    basic.pause(200)
})
