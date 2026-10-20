// DE: Übung 2, Regenbogen: Lösung. 16 senkrechte Linien, jede in einer anderen
//     Farbe. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 2, Rainbow: solution. 16 vertical lines, each in a different
//     color. Runs on the Calliope mini 1, 2 and 3.
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
for (let index = 0; index <= 15; index++) {
    let linie = matrix.createLine(index, 0, index, 15, ledmatrix.hue(index * 20))
}
matrix.show()
