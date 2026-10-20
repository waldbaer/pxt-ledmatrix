// DE: Übung 10, Pong zu zweit: Lösung. Person 1 steuert den roten Schläger unten
//     mit A und B, Person 2 den blauen oben mit den Pins P1 und P2. Wer den Ball
//     durchlässt, verliert. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 10, Pong for two: solution. Person 1 moves the red paddle at the
//     bottom with A and B, person 2 the blue one at the top with pins P1 and P2.
//     Whoever lets the ball through loses. Runs on the Calliope mini 1, 2 and 3.
let dx = 1
let dy = 1
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let unten = matrix.createRectangle(6, 15, 4, 1, ledmatrix.colors(LedMatrixColors.Red), true)
let oben = matrix.createRectangle(6, 0, 4, 1, ledmatrix.colors(LedMatrixColors.Blue), true)
let ball = matrix.createDot(8, 7, ledmatrix.colors(LedMatrixColors.Yellow))
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (unten.canMoveBy(-1, 0)) {
        unten.moveBy(-1, 0)
        matrix.show()
    }
})
input.onButtonEvent(Button.B, input.buttonEventDown(), function () {
    if (unten.canMoveBy(1, 0)) {
        unten.moveBy(1, 0)
        matrix.show()
    }
})
input.onPinTouchEvent(TouchPin.P1, input.buttonEventDown(), function () {
    if (oben.canMoveBy(-1, 0)) {
        oben.moveBy(-1, 0)
        matrix.show()
    }
})
input.onPinTouchEvent(TouchPin.P2, input.buttonEventDown(), function () {
    if (oben.canMoveBy(1, 0)) {
        oben.moveBy(1, 0)
        matrix.show()
    }
})
basic.forever(function () {
    if (ball.x() + dx < 0 || ball.x() + dx > 15) {
        dx = 0 - dx
    }
    ball.moveBy(dx, dy)
    if (ball.overlaps(unten)) {
        ball.moveBy(0, -2)
        dy = -1
    }
    if (ball.overlaps(oben)) {
        ball.moveBy(0, 2)
        dy = 1
    }
    if (ball.y() > 15) {
        matrix.fill(ledmatrix.colors(LedMatrixColors.Blue))
        matrix.show()
        basic.pause(1000)
        matrix.clear()
        ball.setPosition(8, 7)
    }
    if (ball.y() < 0) {
        matrix.fill(ledmatrix.colors(LedMatrixColors.Red))
        matrix.show()
        basic.pause(1000)
        matrix.clear()
        ball.setPosition(8, 7)
    }
    matrix.show()
    basic.pause(250)
})
