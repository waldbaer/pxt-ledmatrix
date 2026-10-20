// DE: Übung 10, Pong zu zweit: Lösung mit Extra. Jede Seite sammelt Punkte, die
//     nach jedem Tor erscheinen. Wer zuerst 5 hat, gewinnt, dann geht es von vorn
//     los. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 10, Pong for two: solution with the Extra. Each side collects
//     points, shown after every goal. The first to 5 wins, then the game starts
//     again. Runs on the Calliope mini 1, 2 and 3.
let punkteRot = 0
let punkteBlau = 0
let dx = 1
let dy = 1
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let unten = matrix.createRectangle(6, 15, 4, 1, ledmatrix.colors(LedMatrixColors.Red), true)
let oben = matrix.createRectangle(6, 0, 4, 1, ledmatrix.colors(LedMatrixColors.Blue), true)
let ball = matrix.createDot(8, 7, ledmatrix.colors(LedMatrixColors.Yellow))
// DE: Extra: die Punkte beider Seiten, versteckt bis zum nächsten Tor.
// EN: Extra: the points of both sides, hidden until the next goal.
let zahlRot = matrix.createNumber(0, 3, 5, ledmatrix.colors(LedMatrixColors.Red))
let zahlBlau = matrix.createNumber(0, 10, 5, ledmatrix.colors(LedMatrixColors.Blue))
zahlRot.setVisible(false)
zahlBlau.setVisible(false)
// DE: Zeigt die Punkte. Hat eine Seite 5, blinkt ihre Farbe und es geht von vorn los.
// EN: Shows the points. If a side has 5, its color blinks and the game starts again.
function punkteZeigen() {
    zahlRot.setNumber(punkteRot)
    zahlBlau.setNumber(punkteBlau)
    zahlRot.setVisible(true)
    zahlBlau.setVisible(true)
    matrix.show()
    basic.pause(1500)
    zahlRot.setVisible(false)
    zahlBlau.setVisible(false)
    if (punkteRot == 5 || punkteBlau == 5) {
        for (let index = 0; index < 3; index++) {
            if (punkteRot == 5) {
                matrix.fill(ledmatrix.colors(LedMatrixColors.Red))
            } else {
                matrix.fill(ledmatrix.colors(LedMatrixColors.Blue))
            }
            matrix.show()
            basic.pause(300)
            matrix.clear()
            matrix.show()
            basic.pause(300)
        }
        punkteRot = 0
        punkteBlau = 0
    }
}
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
        punkteBlau += 1
        matrix.fill(ledmatrix.colors(LedMatrixColors.Blue))
        matrix.show()
        basic.pause(1000)
        matrix.clear()
        punkteZeigen()
        ball.setPosition(8, 7)
    }
    if (ball.y() < 0) {
        punkteRot += 1
        matrix.fill(ledmatrix.colors(LedMatrixColors.Red))
        matrix.show()
        basic.pause(1000)
        matrix.clear()
        punkteZeigen()
        ball.setPosition(8, 7)
    }
    matrix.show()
    basic.pause(250)
})
