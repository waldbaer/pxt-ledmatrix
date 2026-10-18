# Design

## Context

See proposal.md for the motivation and the delta specs for the required behavior.

Relevant current state:

- "Sprite" names: `createSprite` and the enum docs of `LedMatrixRotation` and `LedMatrixFlip` (`main.ts`); `_SHAPE_SPRITE`, the `_pat` comment and the three sprite-only methods `rotate`, `flip`, `setPattern` (`shapes.ts`); `_OWN` and the `pattern()` doc (`pattern.ts`); both German locale files; `test.ts`; the three tours; README; CHANGELOG; the `pxt.json` description.
- The three sprite-only methods use the block IDs `ledmatrix_sprite_*` and a `%sprite` slot. Every other `Shape` block uses `ledmatrix_shape_*`, a `%shape` slot and `shape.defl=shape`, including the number-only `ledmatrix_shape_set_number`.
- The grid block's label is "pattern" / "Muster". `drawPattern` relies on it: "matrix draw [pattern] at x …".
- German locale keys are named after functions and block `%names`. A key that no longer matches falls back to English without an error.
- `test.ts` already has `testPatterns` (run name "patterns").
- The README has 120 of its allowed 120 lines.
- A delta spec cannot rename a scenario or change a Purpose.

## Goals / Non-Goals

**Goals:**
- `git grep -i sprite` finds nothing outside `openspec/changes/`, the CHANGELOG's 0.1.0 entry and its 0.2.0 line about the rename.

**Non-Goals:**
- Compatibility with 0.1.0: no `createSprite` alias, no old block IDs.
- Renaming `Pattern`, `drawPattern`, `setPattern`, `ledmatrix.pattern` or `ledmatrix.grid`.

## Decisions

### D1: Terms
| | EN | DE |
|---|---|---|
| shape made from a pattern | pattern shape | Form aus einem Muster |
| color of `#` pixels | pattern color | Musterfarbe |

This follows "number shape" for `createNumber`.
*Alternative:* plain "pattern" for both data and shape. That gives "Create a pattern from a pattern". Rejected.

### D2: Create block = `drawPattern` block without "draw"
- EN: `%matrix|%pattern=ledmatrix_grid|at x %x|y %y|color %color=ledmatrix_colors`
- DE: `%matrix|%pattern=ledmatrix_grid|bei x %x|y %y|Farbe %color=ledmatrix_colors`

*Alternative:* `%matrix|pattern %pattern=…` like "rectangle at". The grid block's own label makes it read "pattern pattern". Rejected.

### D3: Block IDs, slots and variables follow the other shape blocks
- `createPattern`: block ID `ledmatrix_create_pattern`, `blockSetVariable=shape`.
- `rotate`, `flip`, `setPattern`: block IDs `ledmatrix_shape_rotate`, `ledmatrix_shape_flip`, `ledmatrix_shape_set_pattern`, slot `%shape`, `shape.defl=shape`.

*Alternative:* IDs `ledmatrix_pattern_*`. Every other `Shape` method uses `ledmatrix_shape_*`. Rejected.
*Alternative:* slot and variable `pattern`. That slot name clashes with `setPattern`'s `pattern` parameter, and `pattern.setPattern(invaderA)` mixes a shape variable with pattern variables. Rejected.

### D4: Internal and example names
- `_SHAPE_SPRITE` → `_SHAPE_PATTERN`.
- `testSprites` → `testPatternShapes`, run name `patternShapes` (like `numberShapes`). The name `testPatterns` is taken.
- Beginner tour: `spritesScene` → `patternShapesScene`. Scene 8 is "Pattern shapes" / "Formen aus Mustern", next to 6 "Shapes" / "Formen" and 7 "Changing shapes" / "Formen verändern".

### D5: German locale keys move with the names
Rename the `ledmatrix.Matrix.createSprite…` keys to `createPattern…`, and write `%shape` instead of `%sprite` in the rotate, flip and set-pattern block strings. Each key is checked against its function, because a stale key is never reported.

### D6: CHANGELOG
0.2.0 is not tagged yet: its lines use the new terms, and one plain line under "Changes" says that `createSprite` is now `createPattern`. 0.1.0 stays as released.

## Risks / Trade-offs

- [The create block starts with two inputs in a row (matrix variable, then grid), which may look cramped] → Check it in the Calliope editor. If it reads badly, use "%matrix|shape %pattern=…" ("matrix shape [pattern] at x …") instead.
- [Projects saved with 0.1.0 break] → Accepted. 0.1.0 is the only release, and the extension is in early development.
- [A "sprite" survives somewhere] → A final `git grep -i sprite`, with the exceptions from Goals.
- [The README is at its line limit] → Rename in place; add no lines.

## Migration Plan

After archiving, edit `openspec/specs/matrix-shapes/spec.md` directly: the Purpose says "movable shapes, also made from patterns, that" instead of "movable shapes and pattern-based sprites that", and the scenarios "Sprite position" and "Sprite letters are dimmed too" become "Pattern shape position" and "Pattern letters are dimmed too".
