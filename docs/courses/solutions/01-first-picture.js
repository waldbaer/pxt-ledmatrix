// DE: Übung 1, Mein erstes Bild: Lösung. Vier Ecken in vier Farben und ein
//     lila Quadrat in der Mitte. Läuft auf dem Calliope mini 1, 2 und 3.
// EN: Exercise 1, My first picture: solution. Four corners in four colors and a
//     purple square in the middle. Runs on the Calliope mini 1, 2 and 3.
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
matrix.setPixel(0, 0, ledmatrix.colors(LedMatrixColors.Red))
matrix.setPixel(15, 0, ledmatrix.colors(LedMatrixColors.Green))
matrix.setPixel(0, 15, ledmatrix.colors(LedMatrixColors.Blue))
matrix.setPixel(15, 15, ledmatrix.colors(LedMatrixColors.Yellow))
let rechteck = matrix.createRectangle(4, 4, 8, 8, ledmatrix.colors(LedMatrixColors.Purple), true)
matrix.show()
