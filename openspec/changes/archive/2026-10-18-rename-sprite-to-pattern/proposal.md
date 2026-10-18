# Proposal

## Why

"Sprite" is the only name that breaks the draw/create pairing of the API: `drawPattern` paints a pattern, `createSprite` makes a shape from one, while every other `create*` is its `draw*` without "draw". It also clashes with the core Game category, whose `game.createSprite` ("create sprite" / "erzeuge Sprite") makes a single LED on the board's 5x5 display. And it leaks where no sprite exists: `#` in a pattern is the "sprite color" even for `drawPattern`. The extension is in early development, so the name can still change.

## What Changes

- **BREAKING**: `createSprite(pattern, x, y, color)` becomes `createPattern(pattern, x, y, color)`. No alias.
- **BREAKING**: block IDs `ledmatrix_create_sprite` → `ledmatrix_create_pattern` and `ledmatrix_sprite_rotate`, `_flip`, `_set_pattern` → `ledmatrix_shape_rotate`, `_flip`, `_set_pattern`.
- The shape made from a pattern is a "pattern shape" (DE: "Form aus einem Muster"). `#` is the "pattern color" (DE: "Musterfarbe"). "Sprite" is removed from the API, blocks, tooltips, German strings, README, specs, examples, tests and internal names.
- The create block reads "matrix [pattern] at x … y … color …" (DE: "Matrix [Muster] bei x …"): the `drawPattern` block without "draw", as for every other shape. Its default variable, and the one of the rotate, flip and set-pattern blocks, is `shape`, as for all other shape blocks.
- CHANGELOG: a plain line under 0.2.0 "Changes", and the other 0.2.0 lines use the new terms. The 0.1.0 entry stays.
- Not included: any behavior change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `matrix-shapes`: "Sprites", "Rotate sprites" and "Flip sprites and swap patterns" are renamed for pattern shapes and `createPattern`. Requirements and scenarios that say "sprite" or "sprite color" say "pattern shape" and "pattern color". Behavior does not change.
- `matrix-drawing`: "Draw patterns" says "pattern color".

## Impact

- Code: `main.ts`, `shapes.ts`, `pattern.ts`.
- Translations: `_locales/de/ledmatrix-strings.json`, `_locales/de/ledmatrix-jsdoc-strings.json`.
- `test.ts`, the three feature tours, `README.md`, `CHANGELOG.md`, the `pxt.json` description.
- Projects saved with 0.1.0 that call `createSprite` or use the renamed blocks must be fixed by hand.
- No change to behavior, dependencies or flash size.
