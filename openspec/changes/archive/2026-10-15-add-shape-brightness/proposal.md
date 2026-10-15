# Proposal

## Why

Brightness can only be set for the whole matrix today. Programs cannot fade a sprite in or out, dim a "ghost" piece that shows where a falling block will land, or make the background less bright than the player. The workaround is to compute darker colors by hand with `rgb()`, which does not work for the fixed color letters of a sprite pattern (`r o y g c b p w`): they always show at full strength.

## What Changes

- New `Shape.setBrightness(brightness)` for every shape kind: rectangles, circles, lines, dots, sprites and number shapes. The value is clamped to 0..255, and the default is 255, so existing programs look the same.
- A shape's brightness scales all of its colors, including the fixed color letters of a sprite, with the same formula as the matrix brightness. The matrix brightness then applies on top, so it stays the overall limit for power: a shape is never brighter than the matrix allows.
- The brightness belongs to the shape. It stays when the shape is moved, recolored, rotated, flipped, gets a new pattern or a new number.
- `stamp()` paints the colors the shape is shown in, so a dimmed shape stamps dimmed pixels.
- A shape at brightness 0 is drawn black, like a shape with color black: it still covers what is below it and still collides. To make a shape disappear, programs keep using `setVisible(false)`.
- Changing a shape's brightness makes the next `show()` send.
- New block "set brightness" in the Shapes group with a 0..255 slider, in English and German. README, and a changelog entry in the unreleased 0.2.0: the version stays 0.2.0, because more features may follow before the release.
- Not included: a getter for the shape brightness, brightness for the drawing layer or for single pixels, blending or transparency between overlapping shapes, and fading over time.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `matrix-shapes`: new requirement "Shape brightness". "Stamp shapes" states that stamped pixels take the shape's brightness into account.
- `matrix-display`: "Skip unchanged frames" lists the shape brightness among the changes that make the next `show()` send.

## Impact

- Code: `shapes.ts` (new field and `setBrightness`, brightness applied in `_render`), `main.ts` (`_plot` scales colors written to the drawing layer and the output frame).
- Translations: `_locales/de/ledmatrix-strings.json` and `_locales/de/ledmatrix-jsdoc-strings.json`.
- `test.ts`, `README.md` and `CHANGELOG.md`.
- No change for existing programs: every shape starts at brightness 255, and drawing functions are not affected. No block IDs change, so saved projects keep loading.
- One more number per shape in RAM. `_plot` gets one extra comparison for color targets; flash grows slightly for every program.
- No new dependencies.
