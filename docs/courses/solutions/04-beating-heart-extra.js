// DE: Übung 4, Klopfendes Herz: Lösung mit Extra. Das Herz schlägt, mit A
//     schneller, mit B langsamer, und bei sehr schnellem Herzschlag wird es lila.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 4, Beating heart: solution with the Extra. The heart beats, faster
//     with A, slower with B, and it turns purple when it beats very fast.
//     Runs on the Calliope mini 1, 2 and 3.
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
    // DE: Extra: bei einer Pause von 200 ms oder weniger ist das Herz lila.
    // EN: Extra: with a pause of 200 ms or less, the heart is purple.
    if (tempo <= 200) {
        herz.setColor(ledmatrix.colors(LedMatrixColors.Purple))
    } else {
        herz.setColor(ledmatrix.colors(LedMatrixColors.Red))
    }
    herz.setBrightness(255)
    matrix.show()
    basic.pause(150)
    herz.setBrightness(40)
    matrix.show()
    basic.pause(tempo)
})
