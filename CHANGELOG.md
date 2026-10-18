# Changelog

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
