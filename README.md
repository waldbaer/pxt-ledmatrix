# ledmatrix: LED-Matrix für WS2812 / WS2812B (NeoPixel)

[![Platform](https://img.shields.io/badge/platform-MakeCode-blue)](https://makecode.com)
[![Calliope mini](https://img.shields.io/badge/Calliope_mini-supported-brightgreen)](https://makecode.calliope.cc)
[![micro:bit](https://img.shields.io/badge/micro%3Abit-supported-brightgreen?logo=microbit)](https://makecode.microbit.org)
[![GitHub Tag](https://img.shields.io/github/v/tag/waldbaer/pxt-ledmatrix?style=flat-square)](https://github.com/waldbaer/pxt-ledmatrix/tags)
[![MIT License](https://img.shields.io/github/license/waldbaer/pxt-ledmatrix?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub issues open](https://img.shields.io/github/issues/waldbaer/pxt-ledmatrix?style=flat-square)](https://github.com/waldbaer/pxt-ledmatrix/issues)
[![GitHub Actions](https://github.com/waldbaer/pxt-ledmatrix/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/waldbaer/pxt-ledmatrix/actions/workflows/test.yml)

[Deutsch](#deutsch) · [English](#english)

## Deutsch

MakeCode-Blöcke für WS2812- / WS2812B-LED-Matrizen („NeoPixel“) jeder Größe und Verdrahtung auf Calliope mini und micro:bit.

### Erweiterung hinzufügen

In MakeCode für Calliope mini oder micro:bit **Erweiterungen** öffnen und `https://github.com/waldbaer/pxt-ledmatrix` einfügen.

### Schnellstart

```blocks
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let rahmen = matrix.createRectangle(0, 0, 16, 16, ledmatrix.colors(LedMatrixColors.Blue), false)
let zahl = matrix.createNumber(42, 5, 5, ledmatrix.colors(LedMatrixColors.Yellow))
matrix.show()
```

Die Koordinaten beginnen oben links (x nach rechts, y nach unten), egal wie verdrahtet. Die LEDs ändern sich erst bei `show()`.
Rundgänge in [examples/](https://github.com/waldbaer/pxt-ledmatrix/tree/main/examples): [Einsteiger](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-1.js), [Fortgeschrittene](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-2.js), [Profis](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-3.js).

### Einrichten

`create(pin, width, height)` erwartet die erste LED **oben links** und die Kette spaltenweise im **Zickzack**. Für andere
Panels legt `setLayout(wiring, corner)` die Kette und die Ecke der ersten LED (von vorne gesehen) fest:

```
Zeilen, Zickzack               Zeilen, gleiche Richtung
 0  1  2  3                     0  1  2  3
 7  6  5  4                     4  5  6  7
 8  9 10 11                     8  9 10 11
15 14 13 12                    12 13 14 15

Spalten, Zickzack (Standard)   Spalten, gleiche Richtung
 0  7  8 15                     0  4  8 12
 1  6  9 14                     1  5  9 13
 2  5 10 13                     2  6 10 14
 3  4 11 12                     3  7 11 15
```

* `setBrightness(b)` — 0..255, Standard 32; die gespeicherten Farben ändern sich nicht
* `setColorOrder(order)` — `RGB`, wenn Rot und Grün vertauscht sind (Standard `GRB`)
* `setWrap(on)` — Zeichnen, Verschieben, Formen und Kollisionen laufen über die Ränder auf die andere Seite
* `ledIndex(x, y)` — die LED-Nummer an einer Position (-1 außerhalb); `width()`, `height()`
* `show()` — schickt Zeichnung + Formen an die LEDs; unveränderte Bilder werden übersprungen

### Verdrahtungstest

[examples/wiring-check.js](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/wiring-check.js) mit deiner Größe und deinem Pin (oben in der Datei) starten. Ein
2x2-Quadrat sollte im Uhrzeigersinn von oben links um eine Rundenzahl laufen (oben rot, rechts grün, unten blau, links gelb).

| Was du siehst | Was du änderst |
|---|---|
| Das Quadrat zerfällt in Stücke an gegenüberliegenden Enden | die Größe in `create` oder Zickzack / gleiche Richtung in `setLayout` |
| Das Quadrat beginnt in einer anderen Ecke | die Ecke der ersten LED in `setLayout` |
| Es läuft zuerst nach unten und gegen den Uhrzeigersinn (wie um 90° gedreht) | Zeilen / Spalten in `setLayout` |
| Rot und Grün sind vertauscht | `setColorOrder(LedMatrixColorOrder.RGB)` |

### Zeichnen, Text und Farben

* `setPixel(x, y, color)`, `getPixel(x, y)` — `getPixel` liest nur die Zeichnung
* `form.stamp()` — stempelt eine Form (Linie, Rechteck, Kreis, Muster, Zahl) als einfache Pixel in die Zeichnung; lässt sich nicht rückgängig machen
* `fill(color)`, `clear()` — Formen bleiben
* `shift(dx, dy)` — verschiebt die ganze Zeichnung, z. B. zum Scrollen
* `createNumber(value, x, y, color)`, `setNumber(value)` — eine ganze Zahl in einer 3x5-Ziffernschrift, als Form
* `ledmatrix.colors(LedMatrixColors.Red)`, `ledmatrix.rgb(red, green, blue)`, `ledmatrix.hue(angle)` (0 = Rot)

### Formen (bei jedem `show()` über die Zeichnung gemalt, spätere obenauf)

* `createRectangle(x, y, width, height, color, filled)` — Position ist die linke obere Ecke
* `createCircle(x, y, radius, color, filled)` — Position ist der Mittelpunkt
* `createLine(x0, y0, x1, y1, color)` — Position ist der Startpunkt; `createDot(x, y, color)`
* `moveBy(dx, dy)`, `setPosition(x, y)`, `x()`, `y()`, `width()`, `height()`
* `setColor(color)`, `setBrightness(b)` — 0..255, Standard 255; dimmt alle ihre Farben, zusätzlich zur Helligkeit der Matrix
* `setVisible(on)` — versteckte Formen kollidieren nicht und werden nicht gestempelt; `bringToFront()`
* `remove()`, `matrix.removeAllShapes()` — die Zeichnung bleibt

Formen gibt es auch aus Mustern. Das Muster im 5x5-Block `Muster` (`ledmatrix.grid(...)`) anklicken oder
`ledmatrix.pattern(".#.|###")` schreiben: Zeilen getrennt durch Zeilenumbrüche oder `|`, `.` aus, `#` die Musterfarbe,
`r o y g c b p w` feste Farben. Leere Zeilen und Spalten am Rand werden entfernt.

* `createPattern(pattern, x, y, color)` — Position ist die linke obere Ecke
* `rotate(direction)` (Vierteldrehung), `flip(axis)` (spiegeln), `setPattern(pattern)` (z. B. für Animationen)

### Kollisionen (pixelgenau: überlappende Begrenzungsrahmen kollidieren nur, wenn leuchtende Pixel es tun)

* `overlaps(other)`, `touchesDrawing()` — ein leuchtendes Pixel auf einem leuchtenden Pixel der anderen Form / der Zeichnung
* `canMoveBy(dx, dy)` — bliebe innerhalb und würde die Zeichnung nicht berühren (bewegt nichts)
* `wouldOverlap(other, dx, dy)` — würde `other` nach einer Bewegung um dx, dy überlappen (bewegt nichts)
* `isInside()`, `isOnEdge()` — Begrenzungsrahmen innerhalb / berührt den Rand

### Strom und Pins

* Das Panel über ein eigenes 5-V-Netzteil versorgen und sein GND mit dem GND des Boards verbinden. Ein 16x16-Panel
  braucht ganz weiß etwa 2 A bei der Standardhelligkeit 32 und etwa 15 A bei 255.
* Den Daten-Pin nicht als Touch-Eingang benutzen: Die Touch-Erkennung stört das LED-Signal.
* `show()` sendet mit abgeschalteten Interrupts (8 ms für 256 LEDs), das kann Funk, serielle Schnittstelle und Ton stören: mit `basic.pause` takten.

### Hinweise

* Der MakeCode-Simulator führt Programme mit dieser Erweiterung aus, zeigt die Matrix aber nicht an (geprüft für Calliope mini 3 und micro:bit).
* Speicher: etwa 8 Byte RAM pro LED (+1, sobald Kollisionen benutzt werden); höchstens 16x16 auf Calliope mini 1/2 und
  micro:bit V1. Nur benutzte Blöcke belegen Flash: Der Verdrahtungstest braucht etwa 15 KB, ein Fallende-Blöcke-Spiel 19 KB
  der 22 KB, die Calliope mini 1/2 für Programme haben (micro:bit V1: 26 KB). Alle Blöcke zusammen brauchen einen mini 3 oder micro:bit V2.
* Die Blöcke gibt es auf Deutsch und Englisch. Lizenz: MIT.

### Änderungen

Die Änderungen stehen [hier](https://github.com/waldbaer/pxt-ledmatrix/blob/main/CHANGELOG.md).

## English

MakeCode blocks for WS2812 / WS2812B ("NeoPixel") LED matrices of any size and wiring on Calliope mini and micro:bit.

### Add the extension

In MakeCode for Calliope mini or micro:bit, open **Extensions** and paste `https://github.com/waldbaer/pxt-ledmatrix`.

### Quick start

```blocks
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
let border = matrix.createRectangle(0, 0, 16, 16, ledmatrix.colors(LedMatrixColors.Blue), false)
let number = matrix.createNumber(42, 5, 5, ledmatrix.colors(LedMatrixColors.Yellow))
matrix.show()
```

Coordinates start top left (x to the right, y down), whatever the wiring. LEDs change only on `show()`.
Feature tours in [examples/](https://github.com/waldbaer/pxt-ledmatrix/tree/main/examples): [beginner](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-1.js), [intermediate](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-2.js), [advanced](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-3.js).

### Setup

`create(pin, width, height)` assumes the first LED **top left** and the chain running down the columns in
**zig-zag**. For other panels, `setLayout(wiring, corner)` sets the chain and the first LED's corner (from the front):

```
rows, zig-zag   rows, same dir.   columns, zig-zag (default)   columns, same dir.
 0  1  2  3      0  1  2  3        0  7  8 15                   0  4  8 12
 7  6  5  4      4  5  6  7        1  6  9 14                   1  5  9 13
 8  9 10 11      8  9 10 11        2  5 10 13                   2  6 10 14
15 14 13 12     12 13 14 15        3  4 11 12                   3  7 11 15
```

* `setBrightness(b)` — 0..255, default 32; the stored colors don't change
* `setColorOrder(order)` — `RGB` if red and green appear swapped (default `GRB`)
* `setWrap(on)` — drawing, shifting, shapes and collisions wrap around the edges
* `ledIndex(x, y)` — the LED number at a position (-1 outside); `width()`, `height()`
* `show()` — send drawing layer + shapes to the LEDs; frames that did not change are skipped

### Wiring check

Run [examples/wiring-check.js](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/wiring-check.js) with your size and pin set at its top. A 2x2 square
should walk clockwise from the top left (red top, green right, blue bottom, yellow left) around a lap count.

| What you see | What to change |
|---|---|
| The square splits into pieces at opposite ends | the size in `create`, or zig-zag / same direction in `setLayout` |
| The square starts in another corner | the first LED corner in `setLayout` |
| It goes down first and runs counter-clockwise (looks turned by 90°) | rows / columns in `setLayout` |
| Red and green are swapped | `setColorOrder(LedMatrixColorOrder.RGB)` |

### Draw, text and colors

* `setPixel(x, y, color)`, `getPixel(x, y)` — `getPixel` reads the drawing layer only
* `shape.stamp()` — paint a shape (line, rectangle, circle, pattern, number) into the drawing as plain pixels; can't be undone
* `fill(color)`, `clear()` — shapes stay
* `shift(dx, dy)` — move the whole drawing layer, e.g. for scrolling
* `createNumber(value, x, y, color)`, `setNumber(value)` — a whole number in a 3x5 digit font, as a shape
* `ledmatrix.colors(LedMatrixColors.Red)`, `ledmatrix.rgb(red, green, blue)`, `ledmatrix.hue(angle)` (0 = red)

### Shapes (drawn over the drawing layer on every `show()`, later ones on top)

* `createRectangle(x, y, width, height, color, filled)` — positioned at its top left
* `createCircle(x, y, radius, color, filled)` — positioned at its center
* `createLine(x0, y0, x1, y1, color)` — positioned at its start point; `createDot(x, y, color)`
* `moveBy(dx, dy)`, `setPosition(x, y)`, `x()`, `y()`, `width()`, `height()`
* `setColor(color)`, `setBrightness(b)` — 0..255, default 255; dims all its colors on top of the matrix brightness
* `setVisible(on)` — hidden shapes don't collide or stamp; `bringToFront()`
* `remove()`, `matrix.removeAllShapes()` — the drawing layer stays

A pattern shape is a shape made from a pattern: click it in the 5x5 `pattern` block (`ledmatrix.grid(...)`), or
write `ledmatrix.pattern(".#.|###")`: rows split by line breaks or `|`, `.` off, `#` the pattern color,
`r o y g c b p w` fixed colors. Empty rows and columns at the edges are removed.

* `createPattern(pattern, x, y, color)` — positioned at its top left
* `rotate(direction)` (quarter turn), `flip(axis)` (mirror), `setPattern(pattern)` (e.g. for animation)

### Collisions (pixel exact: boxes that overlap don't collide unless lit pixels do)

* `overlaps(other)`, `touchesDrawing()` — a lit pixel on a lit pixel of the other shape / the drawing layer
* `canMoveBy(dx, dy)` — would stay inside and not touch the drawing layer (doesn't move)
* `wouldOverlap(other, dx, dy)` — would overlap `other` after moving by dx, dy (doesn't move)
* `isInside()`, `isOnEdge()` — box inside / touching the border

### Power and pins

* Power the panel from its own 5 V supply and connect its GND to the board's GND. A 16x16 panel at full
  white needs about 2 A at the default brightness 32 and about 15 A at 255.
* Don't use the data pin as a touch input: touch sensing disturbs the LED signal.
* `show()` sends with interrupts off (8 ms for 256 LEDs), which can disturb radio, serial and sound: pace it with `basic.pause`.

### Notes

* The MakeCode simulator runs programs that use this extension but doesn't show the matrix (checked for Calliope mini 3 and micro:bit).
* Memory: about 8 bytes of RAM per LED (+1 once collisions are used); at most 16x16 on Calliope mini 1/2 and
  micro:bit V1. Only used blocks take flash: the wiring check needs about 15 KB, a falling-blocks game 19 KB of the
  22 KB Calliope mini 1/2 have for programs (micro:bit V1: 26 KB). Every block at once needs a mini 3 or micro:bit V2.
* Blocks are available in English and German. License: MIT.

### Changelog

Changes can be followed [here](https://github.com/waldbaer/pxt-ledmatrix/blob/main/CHANGELOG.md).

## Supported targets

* for PXT/calliopemini
* for PXT/microbit
