// DE: Übung 3, Zauberlampe: Lösung mit Extra. Knopf A gibt der Matrix die
//     nächste Farbe, B schaltet sie aus, A+B macht eine kurze Disco.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 3, Magic lamp: solution with the Extra. Button A gives the matrix
//     the next color, B turns it off, A+B makes a short disco.
//     Runs on the Calliope mini 1, 2 and 3.
let farbe = 0
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
matrix.show()
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    farbe += 30
    matrix.fill(ledmatrix.hue(farbe))
    matrix.show()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    matrix.clear()
    matrix.show()
})
// DE: Extra: fünfmal ganz schnell die Farbe wechseln.
// EN: Extra: change the color five times, very fast.
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    for (let index = 0; index < 5; index++) {
        farbe += 60
        matrix.fill(ledmatrix.hue(farbe))
        matrix.show()
        basic.pause(100)
    }
})
