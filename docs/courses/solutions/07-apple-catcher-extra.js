// DE: Übung 7, Apfelfänger: Lösung mit Extra. Mit jedem Punkt fallen die Äpfel
//     ein bisschen schneller. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 7, Apple catcher: solution with the Extra. With every point the
//     apples fall a little faster. Runs on the Calliope mini 1, 2 and 3.
let punkte = 0
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let korb = matrix.createRectangle(6, 15, 4, 1, ledmatrix.colors(LedMatrixColors.Blue), true)
let apfel = matrix.createDot(randint(0, 15), 0, ledmatrix.colors(LedMatrixColors.Red))
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (korb.canMoveBy(-1, 0)) {
        korb.moveBy(-1, 0)
        matrix.show()
    }
})
input.onButtonEvent(Button.B, input.buttonEventDown(), function () {
    if (korb.canMoveBy(1, 0)) {
        korb.moveBy(1, 0)
        matrix.show()
    }
})
basic.forever(function () {
    apfel.moveBy(0, 1)
    if (apfel.overlaps(korb)) {
        punkte += 1
        apfel.setPosition(randint(0, 15), 0)
    }
    if (apfel.y() > 15) {
        basic.showNumber(punkte)
        punkte = 0
        apfel.setPosition(randint(0, 15), 0)
    }
    matrix.show()
    // DE: Extra: jeder Punkt macht die Pause 10 ms kürzer, aber nie kürzer als 60 ms.
    // EN: Extra: every point makes the pause 10 ms shorter, but never shorter than 60 ms.
    basic.pause(Math.max(60, 200 - punkte * 10))
})
