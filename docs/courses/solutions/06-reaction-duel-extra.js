// DE: Übung 6, Reaktions-Duell: Lösung mit Extra. Wer zuerst drückt, wenn die
//     Matrix grün ist, gewinnt. Wer zu früh drückt, verliert die Runde.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 6, Reaction duel: solution with the Extra. Whoever presses first
//     once the matrix is green wins. Whoever presses too early loses the round.
//     Runs on the Calliope mini 1, 2 and 3.
let haelfte = null
// DE: Extra: phase ist 0 beim Warten, 1 wenn die Matrix grün ist, 2 wenn die
//     Runde vorbei ist.
// EN: Extra: phase is 0 while waiting, 1 when the matrix is green, 2 when the
//     round is over.
let phase = 0
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (phase == 1) {
        phase = 2
        matrix.clear()
        haelfte = matrix.createRectangle(0, 0, 8, 16, ledmatrix.colors(LedMatrixColors.Red), true)
        matrix.show()
    } else if (phase == 0) {
        phase = 2
        haelfte = matrix.createRectangle(8, 0, 8, 16, ledmatrix.colors(LedMatrixColors.Blue), true)
        matrix.show()
    }
})
input.onButtonEvent(Button.B, input.buttonEventDown(), function () {
    if (phase == 1) {
        phase = 2
        matrix.clear()
        haelfte = matrix.createRectangle(8, 0, 8, 16, ledmatrix.colors(LedMatrixColors.Blue), true)
        matrix.show()
    } else if (phase == 0) {
        phase = 2
        haelfte = matrix.createRectangle(0, 0, 8, 16, ledmatrix.colors(LedMatrixColors.Red), true)
        matrix.show()
    }
})
basic.forever(function () {
    matrix.removeAllShapes()
    matrix.clear()
    matrix.show()
    phase = 0
    basic.pause(randint(2000, 5000))
    if (phase == 0) {
        matrix.fill(ledmatrix.colors(LedMatrixColors.Green))
        matrix.show()
        phase = 1
        while (phase == 1) {
            basic.pause(10)
        }
    }
    basic.pause(2000)
})
