// EN: Feature tour 3, advanced: the advanced blocks and two small games made
//     from shapes and collision queries, in a loop. The games paint no pixel
//     by hand.
//     Runs on the Calliope mini 3 and the micro:bit; too big for the mini 1 and 2.
//       1 secrets of the matrix: the LED chain, and reading the drawing
//       2 invaders: two invaders march and descend; a cannon aims by itself
//         and shoots them
//       3 pong: two paddles steer themselves, the ball bounces off them and
//         off stamped walls, and number shapes count the points
// DE: Rundgang 3, für Profis: die Blöcke unter "mehr" und zwei kleine Spiele
//     aus Formen und Kollisionsabfragen, in einer Schleife. Die Spiele malen
//     kein Pixel von Hand.
//     Läuft auf dem Calliope mini 3 und dem micro:bit; für mini 1 und 2 zu groß.
//       1 Geheimnisse der Matrix: die LED-Kette und die Zeichnung lesen
//       2 Invaders: zwei Invaders marschieren und sinken ab; eine Kanone
//         zielt von selbst und schießt sie ab
//       3 Pong: zwei Schläger steuern sich selbst, der Ball prallt von ihnen
//         und von gestempelten Wänden ab, und Zahl-Formen zählen die Punkte

let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0

let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let scene = 0
let t = 0

let invaderA = ledmatrix.pattern(". g g g .|g r g r g|g g g g g|g . . . g")
let invaderB = ledmatrix.pattern(". g g g .|g r g r g|g g g g g|. g . g .")
let boom = ledmatrix.pattern("o . y . o|. y o y .|y o . o y|. y o y .|o . y . o")

// EN: starts the next scene: takes everything away and shows the scene number
// DE: startet die nächste Szene: räumt alles weg und zeigt die Nummer der Szene
function nextScene() {
    scene++
    matrix.removeAllShapes()
    matrix.setWrap(false)
    matrix.setBrightness(32)
    matrix.clear()
    let label = matrix.createNumber(scene, Math.floor((WIDTH - 3) / 2), Math.floor((HEIGHT - 5) / 2), ledmatrix.colors(LedMatrixColors.White))
    matrix.show()
    basic.pause(800)
    label.remove()
}

function step() {
    matrix.show()
    basic.pause(1000)
}

function frame() {
    matrix.show()
    basic.pause(40)
}

// EN: Scene 1: secrets of the matrix
// DE: Szene 1: Geheimnisse der Matrix
function secretsScene() {
    nextScene()
    // EN: each LED gets a color from its number in the chain, from blue (first)
    //     to red (last), so the colors follow the wiring: down the first
    //     column, up the next one, ...
    // DE: jede LED bekommt eine Farbe aus ihrer Nummer in der Kette, von blau
    //     (erste) bis rot (letzte), also folgen die Farben der Verdrahtung: die
    //     erste Spalte hinunter, die nächste hinauf, ...
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            matrix.setPixel(x, y, ledmatrix.rgb(matrix.ledIndex(x, y), 0, 255 - matrix.ledIndex(x, y)))
        }
        frame()
    }
    step()
    matrix.clear()
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 4; y < 7; y++) {
            matrix.setPixel(x, y, ledmatrix.rgb(255 - x * 16, x * 16, 0))
        }
    }
    let chameleon = matrix.createDot(0, 8, ledmatrix.colors(LedMatrixColors.White))
    step()
    // EN: the chameleon takes the color of the drawing above it; getPixel
    //     reads only the drawing, not the shapes
    // DE: das Chamäleon nimmt die Farbe der Zeichnung über ihm an; getPixel
    //     liest nur die Zeichnung, nicht die Formen
    while (chameleon.x() < WIDTH) {
        chameleon.setColor(matrix.getPixel(chameleon.x(), 6))
        frame()
        basic.pause(150)
        chameleon.moveBy(1, 0)
    }
}

// EN: Scene 2: invaders
// DE: Szene 2: Invaders
function invadersScene() {
    nextScene()
    let invaders = [matrix.createPattern(invaderA, 1, 1, 0), matrix.createPattern(invaderA, 8, 1, 0)]
    let alive = [true, true]
    let boomAt = [-1, -1]
    let cannon = matrix.createPattern(ledmatrix.pattern(". w .|w w w"), 6, HEIGHT - 2, 0)
    let shot = matrix.createDot(0, 0, ledmatrix.colors(LedMatrixColors.Yellow))
    shot.setVisible(false)
    let flying = false
    let dir = 1
    for (t = 0; t < 300; t++) {
        // EN: march every 6 frames, switching between the two pictures; at
        //     the side, all turn and step down
        // DE: alle 6 Bilder ein Schritt, im Wechsel zwischen den zwei Bildern;
        //     am Rand drehen alle um und gehen eine Zeile tiefer
        if (t % 6 == 0) {
            let turn = false
            for (let i = 0; i < 2; i++) {
                if (alive[i]) {
                    invaders[i].setPattern(t % 12 == 0 ? invaderA : invaderB)
                    if (!invaders[i].canMoveBy(dir, 0)) {
                        turn = true
                    }
                }
            }
            for (let i = 0; i < 2; i++) {
                if (alive[i]) {
                    invaders[i].moveBy(turn ? 0 : dir, turn ? 1 : 0)
                }
            }
            if (turn) {
                dir = -dir
            }
        }
        // EN: the cannon steers below the first invader that is alive and
        //     fires when it is there
        // DE: die Kanone fährt unter den ersten Invader, der noch lebt, und
        //     schießt, wenn sie dort ist
        let target = alive[0] ? 0 : 1
        if (alive[target]) {
            let aim = invaders[target].x() + Math.idiv(invaders[target].width(), 2)
            if (cannon.x() + 1 < aim) {
                cannon.moveBy(1, 0)
            } else if (cannon.x() + 1 > aim) {
                cannon.moveBy(-1, 0)
            } else if (!flying) {
                shot.setPosition(cannon.x() + 1, HEIGHT - 3)
                flying = true
            }
        }
        if (flying) {
            shot.moveBy(0, -1)
            for (let i = 0; i < 2; i++) {
                if (alive[i] && shot.overlaps(invaders[i])) {
                    alive[i] = false
                    boomAt[i] = t
                    invaders[i].setPattern(boom)
                    flying = false
                }
            }
            // EN: a shot that left the matrix is gone
            // DE: ein Schuss, der die Matrix verlassen hat, ist weg
            if (!shot.isInside()) {
                flying = false
            }
        }
        shot.setVisible(flying)
        // EN: explosions vanish after 8 frames; a new wave comes when both are
        //     gone or one has reached the cannon
        // DE: Explosionen verschwinden nach 8 Bildern; eine neue Welle kommt,
        //     wenn beide weg sind oder einer die Kanone erreicht hat
        let left = 0
        let landed = false
        for (let i = 0; i < 2; i++) {
            if (!alive[i] && t - boomAt[i] == 8) {
                invaders[i].setVisible(false)
            }
            if (alive[i] || t - boomAt[i] < 8) {
                left++
            }
            if (alive[i] && invaders[i].y() > HEIGHT - 7) {
                landed = true
            }
        }
        if (left == 0 || landed) {
            for (let i = 0; i < 2; i++) {
                invaders[i].setPattern(invaderA)
                invaders[i].setPosition(1 + i * 7, 1)
                invaders[i].setVisible(true)
                alive[i] = true
            }
            dir = 1
        }
        frame()
    }
}

// EN: Scene 3: pong
// DE: Szene 3: Pong
function pongScene() {
    nextScene()
    // EN: walls at the top and the bottom: a line shape stamped twice into the
    //     drawing, so canMoveBy sees them
    // DE: Wände oben und unten: eine Linien-Form, zweimal in die Zeichnung
    //     gestempelt, damit canMoveBy sie sieht
    let wall = matrix.createLine(0, 0, WIDTH - 1, 0, ledmatrix.colors(LedMatrixColors.Blue))
    wall.stamp()
    wall.setPosition(0, HEIGHT - 1)
    wall.stamp()
    wall.remove()
    let leftPaddle = matrix.createRectangle(1, 6, 1, 4, ledmatrix.colors(LedMatrixColors.Red), true)
    let rightPaddle = matrix.createRectangle(WIDTH - 2, 6, 1, 4, ledmatrix.colors(LedMatrixColors.Green), true)
    let ball = matrix.createDot(Math.floor(WIDTH / 2), 4, ledmatrix.colors(LedMatrixColors.White))
    let leftPoints = 0
    let rightPoints = 0
    let leftScore = matrix.createNumber(0, 3, 2, ledmatrix.rgb(80, 0, 0))
    let rightScore = matrix.createNumber(0, WIDTH - 6, 2, ledmatrix.rgb(0, 80, 0))
    // EN: the scores came later and would cover the ball: bring it to the front
    // DE: die Punkte kamen später und würden den Ball verdecken: hol ihn nach vorne
    ball.bringToFront()
    let dx = 1
    let dy = 1
    for (t = 0; t < 900 && leftPoints < 5 && rightPoints < 5; t++) {
        // EN: the paddle the ball flies towards follows it, but misses a move
        //     now and then (1 frame in 10), so it does not catch every ball
        // DE: der Schläger, auf den der Ball zufliegt, folgt ihm, setzt aber ab
        //     und zu aus (1 von 10 Bildern) und fängt deshalb nicht jeden Ball
        let paddle = dx < 0 ? leftPaddle : rightPaddle
        let middle = paddle.y() + Math.idiv(paddle.height(), 2)
        if (Math.randomRange(0, 9) > 0) {
            if (ball.y() > middle && paddle.canMoveBy(0, 1)) {
                paddle.moveBy(0, 1)
            } else if (ball.y() < middle - 1 && paddle.canMoveBy(0, -1)) {
                paddle.moveBy(0, -1)
            }
        }
        // EN: bounce off the walls in the drawing and off the paddle shapes
        // DE: an den Wänden in der Zeichnung und an den Schläger-Formen abprallen
        if (!ball.canMoveBy(0, dy)) {
            dy = -dy
        }
        if (ball.wouldOverlap(leftPaddle, dx, dy) || ball.wouldOverlap(rightPaddle, dx, dy)) {
            dx = -dx
        }
        ball.moveBy(dx, dy)
        // EN: the walls keep the ball off the top and bottom edge, so on an
        //     edge it got past a paddle: a point for the other side
        // DE: die Wände halten den Ball vom oberen und unteren Rand fern; an
        //     einem Rand ist er also an einem Schläger vorbei: ein Punkt für
        //     die andere Seite
        if (ball.isOnEdge()) {
            if (ball.x() <= 0) {
                rightPoints++
                rightScore.setNumber(rightPoints)
            } else {
                leftPoints++
                leftScore.setNumber(leftPoints)
            }
            step()
            ball.setPosition(Math.floor(WIDTH / 2), Math.randomRange(3, HEIGHT - 4))
        }
        frame()
    }
    step()
}

basic.forever(function () {
    scene = 0
    secretsScene()
    invadersScene()
    pongScene()
})
