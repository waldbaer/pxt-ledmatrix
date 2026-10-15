# Changelog

All notable changes to this project will be documented in this file.

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
