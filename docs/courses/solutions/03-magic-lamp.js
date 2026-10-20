// DE: Übung 3, Zauberlampe: Lösung. Knopf A gibt der ganzen Matrix die nächste
//     Farbe, Knopf B schaltet sie aus. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 3, Magic lamp: solution. Button A gives the whole matrix the next
//     color, button B turns it off. Runs on the Calliope mini 1, 2 and 3.
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
