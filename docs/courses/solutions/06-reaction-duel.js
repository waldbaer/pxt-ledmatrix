// DE: Übung 6, Reaktions-Duell: Lösung. Die Matrix wird nach einer zufälligen
//     Zeit grün. Wer zuerst drückt, gewinnt: A färbt die linke Hälfte rot, B die
//     rechte blau. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 6, Reaction duel: solution. The matrix turns green after a random
//     time. Whoever presses first wins: A colors the left half red, B the right
//     half blue. Runs on the Calliope mini 1, 2 and 3.
let haelfte = null
let los = false
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (los) {
        los = false
        matrix.clear()
        haelfte = matrix.createRectangle(0, 0, 8, 16, ledmatrix.colors(LedMatrixColors.Red), true)
        matrix.show()
    }
})
input.onButtonEvent(Button.B, input.buttonEventDown(), function () {
    if (los) {
        los = false
        matrix.clear()
        haelfte = matrix.createRectangle(8, 0, 8, 16, ledmatrix.colors(LedMatrixColors.Blue), true)
        matrix.show()
    }
})
basic.forever(function () {
    matrix.removeAllShapes()
    matrix.clear()
    matrix.show()
    basic.pause(randint(2000, 5000))
    matrix.fill(ledmatrix.colors(LedMatrixColors.Green))
    matrix.show()
    los = true
    while (los) {
        basic.pause(10)
    }
    basic.pause(2000)
})
