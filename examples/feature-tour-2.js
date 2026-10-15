// Feature tour 2, the crazy one: eight scenes in a loop.
//   countdown with an exploding ring, hypnotic tunnel, plasma, digital rain,
//   fireworks, space invaders (a cannon that aims by itself), a bouncing
//   counter that leaves imprints, and a pulsing barber pole.
// Same setup as feature-tour.js: default layout (columns, zig-zag, first LED
// top left); for other panels add matrix.setLayout(...) below create.
// The brightness stays at the default 32 or below.
// It needs a Calliope mini 3: it is too big for the Calliope mini 1 and 2, and
// for the micro:bit, whose builds always include the smaller V1.

let WIDTH = 16
let HEIGHT = 16
let PIN = DigitalPin.P0

let matrix = ledmatrix.create(PIN, WIDTH, HEIGHT)
let cx = Math.floor(WIDTH / 2)
let cy = Math.floor(HEIGHT / 2)
let t = 0

// a sine table with 32 steps per turn and values -16..16, so the effects
// below can work with whole numbers
let SINE = [0]
for (let i = 1; i < 32; i++) {
    SINE.push(Math.round(Math.sin(i * Math.PI / 16) * 16))
}

let invaderA = ledmatrix.pattern(". g g g .|g r g r g|g g g g g|g . . . g")
let invaderB = ledmatrix.pattern(". g g g .|g r g r g|g g g g g|. g . g .")
let boom = ledmatrix.pattern("o . y . o|. y o y .|y o . o y|. y o y .|o . y . o")

function reset() {
    matrix.removeAllShapes()
    matrix.setWrap(false)
    matrix.setBrightness(32)
    matrix.clear()
}

function frame() {
    matrix.show()
    basic.pause(30)
}

function countdownScene() {
    reset()
    for (let n = 3; n > 0; n--) {
        matrix.clear()
        matrix.drawNumber(n, cx - 1, cy - 2, ledmatrix.colors(LedMatrixColors.White))
        matrix.show()
        basic.pause(500)
    }
    for (let r = 0; r < 13; r++) {
        matrix.clear()
        matrix.drawCircle(cx, cy, r, ledmatrix.hue(r * 30), false)
        matrix.drawCircle(cx, cy, r - 1, ledmatrix.hue(r * 30 + 60), false)
        frame()
    }
}

// filled circles from big to small give solid rings; shifting their hues
// makes them run inwards
function tunnelScene() {
    reset()
    for (t = 0; t < 100; t++) {
        for (let r = 12; r >= 0; r--) {
            matrix.drawCircle(cx, cy, r, ledmatrix.hue(r * 25 + t * 15), true)
        }
        frame()
    }
}

// every pixel gets a hue from three overlapping sine waves
function plasmaScene() {
    reset()
    for (t = 0; t < 90; t++) {
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                let v = SINE[(x * 2 + t) % 32] + SINE[(y * 3 + t * 2) % 32] + SINE[(x + y + t * 3) % 32]
                matrix.setPixel(x, y, ledmatrix.hue(v * 5 + t * 4))
            }
        }
        frame()
    }
}

// the drawing layer moves down one row per frame; new streams start in the
// top row with a white head, followed by a green tail that gets darker
function rainScene() {
    reset()
    let streams = []
    for (let x = 0; x < WIDTH; x++) {
        streams.push(0)
    }
    for (t = 0; t < 160; t++) {
        matrix.shift(0, 1)
        for (let x = 0; x < WIDTH; x++) {
            if (streams[x] > 0) {
                streams[x]--
                matrix.setPixel(x, 0, ledmatrix.rgb(0, 40 + streams[x] * 20, 0))
            } else if (Math.randomRange(0, 14) == 0) {
                streams[x] = Math.randomRange(4, 10)
                matrix.setPixel(x, 0, ledmatrix.rgb(200, 255, 200))
            }
        }
        frame()
        basic.pause(30)
    }
}

// rockets fly up and burst into 16 dots; positions and speeds are in
// 1/16 pixels, gravity pulls the dots down, and they leave dim trails
function fireworksScene() {
    reset()
    for (let rocket = 0; rocket < 5; rocket++) {
        let x0 = Math.randomRange(3, WIDTH - 4)
        let y0 = Math.randomRange(3, 6)
        let spark = matrix.createDot(x0, HEIGHT - 1, ledmatrix.rgb(255, 200, 120))
        while (spark.y() > y0) {
            matrix.setPixel(spark.x(), spark.y(), ledmatrix.rgb(60, 30, 0))
            spark.moveBy(0, -1)
            frame()
        }
        matrix.removeAllShapes()
        matrix.clear()
        let color = ledmatrix.hue(Math.randomRange(0, 359))
        let red = (color >> 16) & 255
        let green = (color >> 8) & 255
        let blue = color & 255
        let trail = ledmatrix.rgb(red / 8, green / 8, blue / 8)
        let px = []
        let py = []
        let vx = []
        let vy = []
        let dots = []
        for (let i = 0; i < 16; i++) {
            let speed = Math.randomRange(8, 16)
            px.push(x0 * 16 + 8)
            py.push(y0 * 16 + 8)
            vx.push(Math.floor(SINE[(i * 2 + 8) % 32] * speed / 16))
            vy.push(Math.floor(SINE[i * 2] * speed / 16))
            dots.push(matrix.createDot(x0, y0, color))
        }
        for (let k = 0; k < 28; k++) {
            let level = Math.min(12, 28 - k)
            for (let i = 0; i < 16; i++) {
                matrix.setPixel(dots[i].x(), dots[i].y(), trail)
                vy[i] += 1
                px[i] += vx[i]
                py[i] += vy[i]
                dots[i].setPosition(px[i] >> 4, py[i] >> 4)
                dots[i].setColor(ledmatrix.rgb(red * level / 12, green * level / 12, blue * level / 12))
            }
            frame()
        }
        matrix.removeAllShapes()
    }
}

// two invaders march and descend; the cannon steers below the first one and
// fires; a shot that overlaps an invader turns it into an explosion
function invadersScene() {
    reset()
    let invaders = []
    let alive = []
    let boomAt = []
    for (let i = 0; i < 2; i++) {
        invaders.push(matrix.createSprite(invaderA, 1 + i * 7, 1, 0))
        alive.push(true)
        boomAt.push(-1)
    }
    let cannon = matrix.createSprite(ledmatrix.pattern(". w .|w w w"), cx - 1, HEIGHT - 2, 0)
    let shot = matrix.createDot(0, 0, ledmatrix.colors(LedMatrixColors.Yellow))
    shot.setVisible(false)
    let flying = false
    let dir = 1
    let hits = 0
    for (t = 0; t < 360; t++) {
        // march every 6 frames, switching between the two pictures
        if (t % 6 == 0) {
            let turn = false
            for (let i = 0; i < invaders.length; i++) {
                if (alive[i]) {
                    invaders[i].setPattern(t % 12 == 0 ? invaderA : invaderB)
                    if (!(invaders[i].canMoveBy(dir, 0))) {
                        turn = true
                    }
                }
            }
            for (let i = 0; i < invaders.length; i++) {
                if (alive[i]) {
                    if (turn) {
                        invaders[i].moveBy(0, 1)
                    } else {
                        invaders[i].moveBy(dir, 0)
                    }
                }
            }
            if (turn) {
                dir = -dir
            }
        }
        // the cannon follows the first invader that is still alive and fires
        let target = -1
        for (let i = invaders.length - 1; i >= 0; i--) {
            if (alive[i]) {
                target = i
            }
        }
        if (target >= 0) {
            let aim = invaders[target].x() + 2
            if (cannon.x() + 1 < aim) {
                cannon.moveBy(1, 0)
            } else if (cannon.x() + 1 > aim) {
                cannon.moveBy(-1, 0)
            } else if (!(flying)) {
                shot.setPosition(cannon.x() + 1, HEIGHT - 3)
                shot.setVisible(true)
                flying = true
            }
        }
        if (flying) {
            shot.moveBy(0, -1)
            for (let i = 0; i < invaders.length; i++) {
                if (alive[i] && shot.overlaps(invaders[i])) {
                    alive[i] = false
                    boomAt[i] = t
                    invaders[i].setPattern(boom)
                    hits++
                    flying = false
                    shot.setVisible(false)
                }
            }
            if (shot.y() < 0) {
                flying = false
                shot.setVisible(false)
            }
        }
        // explosions vanish after 8 frames; when all are gone, or an invader
        // reached the cannon, a new wave comes
        let left = 0
        let landed = false
        for (let i = 0; i < invaders.length; i++) {
            if (boomAt[i] >= 0 && t - boomAt[i] == 8) {
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
            for (let i = 0; i < invaders.length; i++) {
                invaders[i].setPattern(invaderA)
                invaders[i].setPosition(1 + i * 7, 1)
                invaders[i].setVisible(true)
                alive[i] = true
                boomAt[i] = -1
            }
        }
        frame()
    }
    reset()
    matrix.drawNumber(hits, cx - 3, cy - 2, ledmatrix.colors(LedMatrixColors.Yellow))
    matrix.show()
    basic.pause(1500)
}

// a number bounces around and stamps a copy of itself at every wall
function bounceScene() {
    reset()
    let counter = matrix.createNumber(0, 2, 3, ledmatrix.hue(0))
    let dx = 1
    let dy = 1
    let n = 0
    for (t = 0; t < 220; t++) {
        let hit = false
        if (dx > 0 && counter.x() + counter.width() >= WIDTH) {
            dx = -1
            hit = true
        }
        if (dx < 0 && counter.x() <= 0) {
            dx = 1
            hit = true
        }
        if (dy > 0 && counter.y() + counter.height() >= HEIGHT) {
            dy = -1
            hit = true
        }
        if (dy < 0 && counter.y() <= 0) {
            dy = 1
            hit = true
        }
        if (hit) {
            counter.stamp()
            n++
            if (n % 12 == 0) {
                matrix.clear()
            }
            counter.setColor(ledmatrix.hue(n * 47))
            counter.setNumber(n)
        }
        counter.moveBy(dx, dy)
        frame()
    }
}

// diagonal rainbow stripes scroll around while the brightness pulses
function barberScene() {
    reset()
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            matrix.setPixel(x, y, ledmatrix.hue(Math.floor((x + y) * 360 / WIDTH)))
        }
    }
    matrix.setWrap(true)
    for (t = 0; t < 100; t++) {
        matrix.shift(1, 0)
        matrix.setBrightness(16 + SINE[(t * 2) % 32])
        frame()
    }
    matrix.setBrightness(32)
}

basic.forever(function () {
    countdownScene()
    tunnelScene()
    plasmaScene()
    rainScene()
    fireworksScene()
    invadersScene()
    bounceScene()
    barberScene()
})
