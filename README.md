# ledmatrix: LED Matrix for WS2812 / WS2812B (NeoPixel)

[![Platform](https://img.shields.io/badge/platform-MakeCode-blue)](https://makecode.com)
[![Calliope mini](https://img.shields.io/badge/Calliope_mini-supported-brightgreen)](https://makecode.calliope.cc)
[![micro:bit](https://img.shields.io/badge/micro%3Abit-supported-brightgreen?logo=microbit)](https://makecode.microbit.org)
[![GitHub Tag](https://img.shields.io/github/v/tag/waldbaer/pxt-ledmatrix?style=flat-square)](https://github.com/waldbaer/pxt-ledmatrix/tags)
[![MIT License](https://img.shields.io/github/license/waldbaer/pxt-ledmatrix?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub issues open](https://img.shields.io/github/issues/waldbaer/pxt-ledmatrix?style=flat-square)](https://github.com/waldbaer/pxt-ledmatrix/issues)
[![GitHub Actions](https://github.com/waldbaer/pxt-ledmatrix/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/waldbaer/pxt-ledmatrix/actions/workflows/test.yml)

MakeCode blocks for WS2812 / WS2812B ("NeoPixel") LED matrices of any size and wiring on Calliope mini and micro:bit.

## Add the extension

In MakeCode for Calliope mini or micro:bit, open **Extensions** and paste `https://github.com/waldbaer/pxt-ledmatrix` or search for `pxt-ledmatrix`.

## Quick start

```blocks
let matrix = ledmatrix.create(DigitalPin.P0, 16, 16)
matrix.drawRectangle(0, 0, 16, 16, ledmatrix.colors(LedMatrixColors.Blue), false)
matrix.drawNumber(42, 5, 5, ledmatrix.colors(LedMatrixColors.Yellow))
matrix.show()
```

Coordinates start top left (x to the right, y down), whatever the wiring. LEDs change only on `show()`.
Feature tours in [examples/](https://github.com/waldbaer/pxt-ledmatrix/tree/main/examples): [beginner](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-beginner.js), [intermediate](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-intermediate.js), [advanced](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/feature-tour-advanced.js).

## Setup

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

## Wiring check

Run [examples/wiring-check.js](https://github.com/waldbaer/pxt-ledmatrix/blob/main/examples/wiring-check.js) with your size and pin set at its top. A 2x2 square
should walk clockwise from the top left (red top, green right, blue bottom, yellow left) around a lap count.

| What you see | What to change |
|---|---|
| The square splits into pieces at opposite ends | the size in `create`, or zig-zag / same direction in `setLayout` |
| The square starts in another corner | the first LED corner in `setLayout` |
| It goes down first and runs counter-clockwise (looks turned by 90°) | rows / columns in `setLayout` |
| Red and green are swapped | `setColorOrder(LedMatrixColorOrder.RGB)` |

## Draw, text and colors

* `setPixel(x, y, color)`, `getPixel(x, y)` — `getPixel` reads the drawing layer only
* `drawLine(x0, y0, x1, y1, color)`
* `drawRectangle(x, y, width, height, color, filled)` — `x, y` is the top left corner
* `drawCircle(x, y, radius, color, filled)` — `x, y` is the center
* `drawPattern(pattern, x, y, color)` — off pixels of the pattern leave the drawing as it is
* `fill(color)`, `clear()` — shapes stay
* `shift(dx, dy)` — move the whole drawing layer, e.g. for scrolling
* `drawNumber(value, x, y, color)` — a whole number in a 3x5 digit font; only lit pixels change
* `createNumber(value, x, y, color)`, `setNumber(value)` — a number shape (moves and collides like others)
* `ledmatrix.colors(LedMatrixColors.Red)`, `ledmatrix.rgb(red, green, blue)`, `ledmatrix.hue(angle)` (0 = red)

## Shapes (drawn over the drawing layer on every `show()`, later ones on top)

* `createRectangle(x, y, width, height, color, filled)` — positioned at its top left
* `createCircle(x, y, radius, color, filled)` — positioned at its center
* `createLine(x0, y0, x1, y1, color)` — positioned at its start point; `createDot(x, y, color)`
* `moveBy(dx, dy)`, `setPosition(x, y)`, `x()`, `y()`, `width()`, `height()`
* `setColor(color)`, `setBrightness(b)` — 0..255, default 255; dims all its colors on top of the matrix brightness
* `setVisible(on)` — hidden shapes don't collide or stamp; `bringToFront()`
* `remove()`, `matrix.removeAllShapes()` — the drawing layer stays

A sprite is a shape made from a pattern: click it in the 5x5 `pattern` block (`ledmatrix.grid(...)`), or
write `ledmatrix.pattern(".#.|###")`: rows split by line breaks or `|`, `.` off, `#` the sprite's color,
`r o y g c b p w` fixed colors. Empty rows and columns at the edges are removed.

* `createSprite(pattern, x, y, color)` — positioned at its top left
* `rotate(direction)` (quarter turn), `flip(axis)` (mirror), `setPattern(pattern)` (e.g. for animation)

## Collisions (pixel exact: boxes that overlap don't collide unless lit pixels do)

* `overlaps(other)`, `touchesDrawing()` — a lit pixel on a lit pixel of the other shape / the drawing layer
* `canMoveBy(dx, dy)` — would stay inside and not touch the drawing layer (doesn't move)
* `wouldOverlap(other, dx, dy)` — would overlap `other` after moving by dx, dy (doesn't move)
* `isInside()`, `isOnEdge()` — box inside / touching the border
* `stamp()` — copy into the drawing layer as plain pixels; can't be undone, hidden shapes don't stamp

## Power and pins

* Power the panel from its own 5 V supply and connect its GND to the board's GND. A 16x16 panel at full
  white needs about 2 A at the default brightness 32 and about 15 A at 255.
* Don't use the data pin as a touch input: touch sensing disturbs the LED signal.
* `show()` sends with interrupts off (8 ms for 256 LEDs), which can disturb radio, serial and sound: pace it with `basic.pause`.

## Notes

* The MakeCode simulator runs programs that use this extension but doesn't show the matrix (checked for Calliope mini 3 and micro:bit).
* Memory: about 8 bytes of RAM per LED (+1 once collisions are used); at most 16x16 on Calliope mini 1/2 and
  micro:bit V1. Only used blocks take flash: the wiring check needs about 15 KB, a falling-blocks game 19 KB of the
  22 KB Calliope mini 1/2 have for programs (micro:bit V1: 26 KB). Every block at once needs a mini 3 or micro:bit V2.
* Blocks are available in English and German. License: MIT.

## Changelog

Changes can be followed [here](https://github.com/waldbaer/pxt-ledmatrix/blob/main/CHANGELOG.md).

## Supported targets

* for PXT/calliopemini
* for PXT/microbit
