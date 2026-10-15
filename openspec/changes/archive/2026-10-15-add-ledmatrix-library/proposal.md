# Proposal

## Why

There is no MakeCode extension that drives a WS2812B LED matrix on the Calliope mini or micro:bit as a 2D display. With the existing NeoPixel extensions, users have to map x/y to the LED chain themselves, and the wiring differs from panel to panel. A prototype in `experiments/pxt-ledmatrix` showed the approach works (layout mapping, drawing, sprites, collisions). It also showed gaps: memory churn in game loops, no way to draw numbers, a long README, and the claim of simulator support was never checked. This change turns the prototype into a maintained extension in this repository. The defaults match the real hardware: a 16x16 panel on a Calliope mini 3, wired in columns, zig-zag, first LED top left.

## What Changes

- New MakeCode extension `ledmatrix` (namespace `ledmatrix`) for WS2812B matrices driven by a single LED strip, using the core's built-in WS2812 driver (`light.sendWS2812Buffer…`). No other extension is needed.
- Layout mapping: rows or columns × zig-zag or same direction × first-LED corner, giving 16 layouts that cover every single-strip panel. `create(pin, width, height)` defaults to **columns, zig-zag, first LED top left**. The layout can be changed with an advanced block.
- Display: brightness (default 32), color byte order (GRB/RGB), and `show()`, which sends drawing layer plus shapes. `show()` skips sending when nothing changed.
- Drawing layer: pixels, lines, rectangles, circles, patterns, fill, clear, shift, optional wrap-around.
- Fonts (**new** compared to the prototype): integers in a built-in 3x5 digit font. `drawNumber` paints them into the drawing layer. `createNumber` makes a number shape that can be moved and updated, takes part in z-order, and collides pixel-exactly like any other shape. It is designed so that letters and other fonts can be added later.
- Shapes and sprites: movable dots, lines, rectangles, circles, and sprites from patterns (5x5 grid block or multi-color text). Sprites can rotate, flip and swap their pattern.
- Pixel-exact collisions: shape vs. shape, shape vs. drawing layer, can-move checks, inside/edge tests, stamping shapes into the drawing layer.
- Colors: named colors, `rgb`, `hue`.
- Blocks in English and German.
- Targets: Calliope mini and micro:bit.
- Compact README (badges, setup, layouts, wiring troubleshooting, power; findable by "WS2812", "WS2812B", "NeoPixel") and one example program, `examples/wiring-check.js`.
- GitHub Actions workflow that builds the extension for both targets on every push and pull request; its status is one of the README badges.
- Not included: chained or tiled multi-panel layouts, custom mapping tables, and scrolling text. The API leaves room to add them later without breaking changes.

## Capabilities

### New Capabilities

- `matrix-display`: creating a matrix, mapping logical x/y coordinates to the physical LED chain (layouts, default layout, LED index lookup), brightness, color byte order, and sending frames with `show()`.
- `matrix-drawing`: the persistent drawing layer and the graphics primitives that paint into it (pixels, lines, rectangles, circles, patterns, fill/clear/shift, wrap-around) plus color helpers.
- `matrix-fonts`: rendering text-like content with bitmap fonts, both painted into the drawing layer and as number shapes that take part in z-order and collisions. v1 has integers in a 3x5 digit font. Letters, other glyph sets and scrolling text belong here later.
- `matrix-shapes`: retained shapes and sprites drawn on top of the drawing layer, patterns, rotation/flip, z-order, removal, and pixel-exact collision queries.
- `extension-package`: how the extension is delivered: supported targets, dependencies, German block translations, README, and the example program.

### Modified Capabilities

None (no existing specs).

## Impact

- New files in this repository: `pxt.json`, TypeScript sources (`main.ts`, `shapes.ts`, `pattern.ts`, `font.ts`, `driver.ts`), `test.ts`, `_locales/de/*`, `README.md`, `examples/wiring-check.js`, `icon.png`, `LICENSE.txt`, `tsconfig.json`, `.gitignore`, `mkc.json`, `mkc-microbit.json`, `.github/workflows/build.yml`.
- Depends only on the target `core` package (`light` namespace). The prototype's API is the starting point. `create` changes from 5 to 3 parameters, and the prototype's `setLayout` block takes over layout selection.
- Verification uses the MakeCode CLI (`mkc build`) against makecode.calliope.cc, which is already cached locally, and against makecode.microbit.org, which needs a download. Also a manual run on a Calliope mini 3 with the 16x16 panel.
