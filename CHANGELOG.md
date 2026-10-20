# Changelog

## [1.0.0] - 2026-10-20

First stable version.
- WS2812 / WS2812B (NeoPixel) matrices of any size on Calliope mini and micro:bit, no other extension needed.
- 16 layouts, brightness, GRB/RGB, wrap-around; `show()` skips unchanged frames.
- Drawing: pixels, fill, clear, shift; shapes can be stamped into the drawing.
- Movable shapes: dots, lines, rectangles, circles, patterns and numbers in a 3x5 font; rotate, flip, swap pattern, hide, dim.
- Pixel-exact collisions with shapes and the drawing, also checked before moving (`canMoveBy`, `wouldOverlap`).
- Colors: named, `rgb`, `hue`. Blocks in German and English.
- Examples, wiring check and a school course with ten exercises and solutions in `docs/`.
