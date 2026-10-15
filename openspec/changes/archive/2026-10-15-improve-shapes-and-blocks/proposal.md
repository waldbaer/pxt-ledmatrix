# Proposal

## Why

Using the 0.1.0 blocks for first demos and games showed some gaps. A game cannot ask whether a move would run into another, moving shape: it has to move, check `overlaps` and move back, which also makes the next `show()` send for nothing. The block every program needs, `show`, sits second to last in the toolbox, and its tooltip does not say that nothing appears without it. A first demo program fell into exactly this trap: its sprite never moved. The `stamp` tooltip does not say that the shape is flattened into plain pixels for good. Sprites have their own toolbox group although they are shapes. Hidden shapes still stamp, unlike every other shape operation. Finally, the German-blocks requirement promises a translated slider caption, which MakeCode cannot provide.

## What Changes

- New `Shape.wouldOverlap(other, dx, dy)`: true if this shape would overlap `other` pixel-exactly after moving by (dx, dy). Nothing moves and nothing is sent. Programs combine it with `canMoveBy` to block moves into moving obstacles. `canMoveBy` itself does not change.
- **BREAKING** (behavior): `stamp()` on a hidden shape does nothing. Before, it painted the shape into the drawing layer. Hidden shapes now behave as if they were absent everywhere, while keeping their position.
- `show()`: the TypeScript name stays. The block reads "show changes" / "Änderungen anzeigen". The tooltip says that nothing on the LED matrix changes until `show` is called. The Display group moves to second place in the toolbox, right after Setup.
- `stamp()`: the tooltip and the README say that the shape's lit pixels are copied into the drawing as plain pixels, which keep no link to the shape and cannot be undone, and that they act as an obstacle for `canMoveBy` and `touchesDrawing`.
- Toolbox: the Sprites group merges into Shapes ("Formen"), including `width`, `height`, the pattern blocks and the sprite-only blocks. Number shapes stay in Text. German keeps the word "Sprite".
- README: the Sprites section merges into Shapes, `wouldOverlap` is added, and the stamp line is updated. The README stays within its 120-line limit.
- The `extension-package` spec gains an exception for slider captions. MakeCode builds them from the TypeScript parameter name and offers no way to translate them, so the brightness slider keeps showing "Brightness" in the German editor.
- Version 0.2.0 with a changelog entry.
- Not included: removing a stamp again (`erase`), sending frames automatically, translated slider captions, checks against several obstacles at once ("solid" shapes), changes to `canMoveBy`, and a `getPosition()` (`x()` and `y()` already cover it).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `matrix-shapes`: new requirement "Overlap after a move" for `wouldOverlap`. In "Stamp shapes", hidden shapes no longer stamp, and stamped pixels are stated to be plain drawing-layer pixels.
- `extension-package`: "German blocks" makes an exception for the slider caption, which MakeCode does not translate.

## Impact

- Code: `shapes.ts` (`wouldOverlap`, `stamp`, block texts, groups and weights), `main.ts` (group order, `show` block and tooltip, the sprite creation block's group), `pattern.ts` (group of the pattern blocks).
- Translations: `_locales/de/ledmatrix-strings.json` and `_locales/de/ledmatrix-jsdoc-strings.json` (new block, `show`, `stamp`; the "Sprites" group entry is removed).
- `test.ts`, `README.md`, `CHANGELOG.md`, and the version in `pxt.json`.
- Block IDs do not change, so saved projects keep loading. Existing blocks only move in the toolbox, and the `show` block shows its new text.
- Programs that stamp a hidden shape behave differently. None of the examples in this repository does.
- No new dependencies. Flash grows only for programs that use `wouldOverlap`.
