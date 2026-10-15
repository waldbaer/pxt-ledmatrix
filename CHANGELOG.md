# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-10-15

### Features
- `wouldOverlap(other, dx, dy)`: true if a shape would overlap another shape after moving by dx, dy. Nothing moves and nothing is sent. Combine it with `canMoveBy` to stop shapes at moving obstacles.

### Changes
- **Behavior change:** hidden shapes are no longer stamped. Before, `stamp()` painted a hidden shape into the drawing.
- The `show` block reads "show changes" ("Änderungen anzeigen"), and its group now comes right after Setup in the toolbox.
- One Shapes group: the sprite blocks, the pattern blocks, `width` and `height` moved there from the separate Sprites group.
- Clearer tooltips: `show` says that nothing changes on the LED matrix until it is called, and `stamp` says that the shape becomes plain pixels in the drawing and cannot be removed again.

## [0.1.0] - 2026-10-15

Initial version of the LED matrix extension!

### Features
- WS2812 / WS2812B (NeoPixel) matrices of any size on Calliope mini and micro:bit, no other extension needed.
- 16 layouts (rows/columns, zig-zag, first LED corner); brightness, GRB/RGB, `show()` skips unchanged frames.
- Drawing: pixels, lines, rectangles, circles, patterns, fill, clear, shift, wrap-around.
- Numbers in a 3x5 digit font.
- Movable shapes and sprites (rotate, flip, swap pattern) with pixel-exact collisions and stamping.
- Colors: named, `rgb`, `hue`.
- Blocks in English and German.
- Examples (wiring check, two feature tours) and `examples/build-and-flash.sh`.
