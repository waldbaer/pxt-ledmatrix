// DE: Übung 2, Regenbogen: Lösung mit Extra. Der Regenbogen wandert nach rechts
//     und kommt links wieder herein. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 2, Rainbow: solution with the Extra. The rainbow moves to the
//     right and comes back in on the left. Runs on the Calliope mini 1, 2 and 3.
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
matrix.setWrap(true)
for (let index = 0; index <= 15; index++) {
    let linie = matrix.createLine(index, 0, index, 15, ledmatrix.hue(index * 20))
    // DE: Extra: jede Linie in die Zeichnung stempeln, denn nur die Zeichnung
    //     lässt sich verschieben.
    // EN: Extra: stamp each line into the drawing, because only the drawing
    //     can be shifted.
    linie.stamp()
}
matrix.removeAllShapes()
basic.forever(function () {
    matrix.shift(1, 0)
    matrix.show()
    basic.pause(100)
})
