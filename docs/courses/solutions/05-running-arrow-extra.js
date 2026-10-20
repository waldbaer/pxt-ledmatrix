// DE: Übung 5, Laufband: Lösung mit Extra. Statt des Pfeils fährt ein rotes Auto
//     immer rundherum, mit A nach links, mit B nach rechts.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 5, Running arrow: solution with the Extra. Instead of the arrow, a
//     red car keeps driving round, to the left with A, to the right with B.
//     Runs on the Calliope mini 1, 2 and 3.
let richtung = 1
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
matrix.setWrap(true)
// DE: Extra: ein Auto mit Dach und zwei Rädern.
// EN: Extra: a car with a roof and two wheels.
let auto = matrix.createPattern(ledmatrix.grid(`
    . . . . .
    . # # . .
    # # # # #
    # # # # #
    . # . # .
    `), 1, 5, ledmatrix.colors(LedMatrixColors.Red))
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    richtung = -1
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    richtung = 1
})
basic.forever(function () {
    auto.moveBy(richtung, 0)
    matrix.show()
    basic.pause(150)
})
