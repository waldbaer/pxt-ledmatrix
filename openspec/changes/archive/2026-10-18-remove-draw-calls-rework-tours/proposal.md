# Proposal

## Why

Each of `drawLine`, `drawRectangle`, `drawCircle`, `drawPattern` and `drawNumber` has a `create*` twin whose block differs by the word "draw", so the toolbox shows two near-identical sets of blocks. A shape that is created, stamped and removed already paints exactly the same pixels, so one way to make each figure is enough: shapes for figures, the drawing layer for pixels. The feature tours must be rewritten for this anyway. They are long (723, 166 and 369 lines), and the advanced one is mostly per-pixel effects, which is not what the library is for.

## What Changes

- **BREAKING**: remove `drawLine`, `drawRectangle`, `drawCircle`, `drawPattern`, `drawNumber` and their blocks. No alias, no hidden deprecated blocks. Replacement: create the shape, `stamp()` it, `remove()` it.
- The drawing layer changes only through `setPixel`, `fill`, `clear`, `shift` and `stamp()`.
- The `stamp` block moves from the Collisions group to the Draw group.
- The rules for lines, rectangles, circles and number formatting move from the removed requirements to the shape requirements. Pixels stay the same.
- **BREAKING** (examples): the tours are rewritten and renamed `feature-tour-1.js` (beginner), `feature-tour-2.js` (intermediate) and `feature-tour-3.js` (advanced), at most 150, 250 and 300 lines, each more complex than the one before. Tour 1 shows only the basics, for pupils of 10 to 12; tour 2 the other basic blocks; tour 3 the advanced blocks and small games made from shapes instead of per-pixel effects. All tours together use every block.
- The wiring check shows its lap count with a number shape.
- README, CHANGELOG (new 0.3.0 entry), German strings and tests follow.
- Not included: resize setters for shapes (`setSize`, `setRadius`, `setEnd`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `matrix-drawing`: "Lines", "Rectangles", "Circles" and "Draw patterns" are removed. "Drawing layer" names the operations that change it.
- `matrix-shapes`: "Create shapes" no longer refers to drawing primitives. A new "Shape geometry" requirement holds the line, rectangle and circle rules. "Patterns from the grid block" and "Pattern shapes" no longer refer to `drawPattern`.
- `matrix-fonts`: "Draw numbers" is removed and its formatting rules move to "Number shapes". The metrics, glyph and lit-pixel requirements use number shapes.
- `extension-package`: "Feature tours" and "Beginner tour covers every block" are replaced by "Three feature tours", "Short feature tours", "Tours cover every block", "Beginner tour shows the basics" and "Advanced tour shows games". "Wiring-check example" uses a number shape. "Bilingual example comments" allows separator lines.

## Impact

- Code: `main.ts` (five methods removed), `shapes.ts` (`stamp` block group and tooltip).
- Translations: both files in `_locales/de`.
- `test.ts`: the drawing checks use shapes and `stamp()`.
- `examples/`: three new tours replace the old ones; `wiring-check.js`; the usage comment of `build-and-flash.sh`.
- `README.md` (quick start, Draw and Text lists, tour links), `CHANGELOG.md`.
- Projects that use the removed blocks must be fixed by hand. RAM and dependencies do not change; flash does not grow.
