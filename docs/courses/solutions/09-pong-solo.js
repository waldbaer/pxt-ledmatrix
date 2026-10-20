// DE: Übung 9, Pong für eine Person: Lösung. Ein Ball prallt an den Wänden ab,
//     der Schläger unten hält ihn im Spiel. Jeder Treffer ist ein Punkt.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 9, Pong for one: solution. A ball bounces off the walls, the
//     paddle at the bottom keeps it in play. Each hit is a point.
//     Runs on the Calliope mini 1, 2 and 3.
let punkte = 0
let dx = 1
let dy = 1
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let schlaeger = matrix.createRectangle(6, 15, 4, 1, ledmatrix.colors(LedMatrixColors.Blue), true)
let ball = matrix.createDot(0, 0, ledmatrix.colors(LedMatrixColors.Yellow))
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (schlaeger.canMoveBy(-1, 0)) {
        schlaeger.moveBy(-1, 0)
        matrix.show()
    }
})
input.onButtonEvent(Button.B, input.buttonEventDown(), function () {
    if (schlaeger.canMoveBy(1, 0)) {
        schlaeger.moveBy(1, 0)
        matrix.show()
    }
})
basic.forever(function () {
    if (ball.x() + dx < 0 || ball.x() + dx > 15) {
        dx = 0 - dx
    }
    if (ball.y() + dy < 0) {
        dy = 0 - dy
    }
    ball.moveBy(dx, dy)
    if (ball.overlaps(schlaeger)) {
        ball.moveBy(0, -2)
        dy = -1
        punkte += 1
    }
    if (ball.y() > 15) {
        basic.showNumber(punkte)
        punkte = 0
        ball.setPosition(randint(0, 15), 0)
        dy = 1
    }
    matrix.show()
    basic.pause(300)
})
