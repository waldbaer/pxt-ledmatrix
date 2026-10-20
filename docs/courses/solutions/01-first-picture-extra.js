// DE: Übung 1, Mein erstes Bild: Lösung mit Extra. Vier Ecken in vier Farben
//     und in der Mitte ein Anfangsbuchstabe aus Pixeln, hier ein C.
//     Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 1, My first picture: solution with the Extra. Four corners in four
//     colors and an initial letter made of pixels in the middle, here a C.
//     Runs on the Calliope mini 1, 2 and 3.
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
matrix.setPixel(0, 0, ledmatrix.colors(LedMatrixColors.Red))
matrix.setPixel(15, 0, ledmatrix.colors(LedMatrixColors.Green))
matrix.setPixel(0, 15, ledmatrix.colors(LedMatrixColors.Blue))
matrix.setPixel(15, 15, ledmatrix.colors(LedMatrixColors.Yellow))
// DE: Extra: der linke Strich des C, dann der obere und der untere.
// EN: Extra: the left stroke of the C, then the top and the bottom one.
for (let index = 0; index <= 7; index++) {
    matrix.setPixel(5, 4 + index, ledmatrix.colors(LedMatrixColors.Purple))
}
for (let index = 0; index <= 4; index++) {
    matrix.setPixel(6 + index, 4, ledmatrix.colors(LedMatrixColors.Purple))
    matrix.setPixel(6 + index, 11, ledmatrix.colors(LedMatrixColors.Purple))
}
matrix.show()
