// DE: Übung 4, Klopfendes Herz: Lösung. Ein Herz schlägt hell und dunkel rot,
//     mit A schneller, mit B langsamer. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 4, Beating heart: solution. A heart beats in bright and dark red,
//     faster with A, slower with B. Runs on the Calliope mini 1, 2 and 3.
let tempo = 600
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let herz = matrix.createPattern(ledmatrix.grid(`
    . # . # .
    # # # # #
    # # # # #
    . # # # .
    . . # . .
    `), 5, 5, ledmatrix.colors(LedMatrixColors.Red))
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (tempo > 100) {
        tempo += -100
    }
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    tempo += 100
})
basic.forever(function () {
    herz.setBrightness(255)
    matrix.show()
    basic.pause(150)
    herz.setBrightness(40)
    matrix.show()
    basic.pause(tempo)
})
