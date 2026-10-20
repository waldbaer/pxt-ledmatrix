# Changelog

## [0.4.0] - 2026-10-20

### Features
- School course in `docs/courses/`: ten exercises in German and English, each with a solution and an Extra solution.
- `build-and-flash.sh -b` builds without flashing; CI builds every example and solution.

### Changes
- German first: blocks propose German variables (`rechteck`, `kreis`, …); README, `pxt.json` description and example comments in German and English.
- README add wiring schematic / photo of the hardware.
- Examples moved to `docs/examples/`.

## [0.3.0] - 2026-10-18

### Changes
- **Breaking:** `drawLine`, `drawRectangle`, `drawCircle`, `drawPattern` and `drawNumber` are removed. Create the shape instead, `stamp()` it into the drawing and `remove()` it.
- The `stamp` block moved from Collisions to the Draw group.
- The feature tours are rewritten, shorter, and renamed `feature-tour-1.js` (beginner), `feature-tour-2.js` (intermediate) and `feature-tour-3.js` (advanced).

## [0.2.0] - 2026-10-15

### Features
- `wouldOverlap(other, dx, dy)`: would a shape overlap another one after moving? Nothing moves or is sent.
- `setBrightness(b)` for shapes: 0..255 (default 255), multiplied with the matrix brightness; dims pattern color letters too, and stamps keep the dimmed colors.

### Changes
- **Behavior change:** hidden shapes no longer stamp.
- `createSprite` is now `createPattern`; sprites are called pattern shapes.
- The `show` block reads "show changes" and comes right after Setup.
- Pattern, `width` and `height` blocks moved into the Shapes group.
- Clearer `show` and `stamp` tooltips.
- Improve examples.
- README links and title work in the MakeCode extension gallery.

## [0.1.0] - 2026-10-15

Initial version.
- WS2812 / WS2812B (NeoPixel) matrices of any size on Calliope mini and micro:bit, no other extension needed.
- 16 layouts, brightness, GRB/RGB; `show()` skips unchanged frames.
- Drawing: pixels, lines, rectangles, circles, patterns, fill, clear, shift, wrap-around; numbers in a 3x5 font.
- Movable shapes and sprites (rotate, flip, swap pattern) with pixel-exact collisions and stamping.
- Colors: named, `rgb`, `hue`. Blocks in English and German.
- Examples and `examples/build-and-flash.sh`.
