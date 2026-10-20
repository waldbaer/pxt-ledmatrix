// DE: Übung 9, Pong für eine Person: Lösung mit Extra. Trifft der Ball den Rand
//     des Schlägers, fliegt er schräger weg. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 9, Pong for one: solution with the Extra. When the ball hits the
//     edge of the paddle, it flies off at a steeper angle.
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
        // DE: Extra: am linken oder rechten Pixel des Schlägers zwei Schritte zur
        //     Seite, in der Mitte wieder einer.
        // EN: Extra: on the left or right pixel of the paddle two steps sideways,
        //     in the middle one step again.
        if (ball.x() == schlaeger.x()) {
            dx = -2
        } else if (ball.x() == schlaeger.x() + 3) {
            dx = 2
        } else if (dx > 0) {
            dx = 1
        } else {
            dx = -1
        }
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
