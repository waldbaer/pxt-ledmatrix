# Tasks

`MKC` below means `npx --yes makecode@1.3.6`, the CLI that CI uses. "Build OK" means that `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`. "Sim OK" means that `node .github/scripts/sim-test.js mkc.json` and `node .github/scripts/sim-test.js mkc-microbit.json` both pass. "Tour build" means `examples/build-and-flash.sh <file>` (Calliope mini 3) reaches `hex:`.

## 1. Library, tests and docs (specs: matrix-shapes, matrix-drawing; design D1 to D6)

- [x] 1.1 Rename in code and tests. `main.ts`: `createSprite` → `createPattern` with the D2 block text, the D3 block ID and `blockSetVariable=shape`, and a doc comment for a pattern shape; the `LedMatrixRotation` and `LedMatrixFlip` docs say "pattern shape". `shapes.ts`: `_SHAPE_SPRITE` → `_SHAPE_PATTERN` (D4), the `_pat` comment, and for `rotate`, `flip`, `setPattern` the D3 block IDs, `%shape` and `shape.defl=shape`; the doc comments of `setPosition`, `setColor`, `setBrightness`, `rotate`, `flip` and `setPattern` use the D1 terms. `pattern.ts`: the `_OWN` comment and the `pattern()` doc say "pattern color". `test.ts`: all calls, `testSprites` → `testPatternShapes` with run name `patternShapes` (D4), and every check message and comment. Verify Build OK, Sim OK, and that `git grep -i sprite -- '*.ts'` finds nothing.
- [x] 1.2 German strings (D1, D2, D5). In `_locales/de/ledmatrix-strings.json`, rename `ledmatrix.Matrix.createSprite|block` to `createPattern` with the D2 text, and use `%shape` in the rotate, flip and set-pattern block strings. In `_locales/de/ledmatrix-jsdoc-strings.json`, rename the `createSprite` keys and reword every "Sprite" with the D1 terms. Verify that both files parse with `python3 -m json.tool`, that `grep -i sprite _locales -r` finds nothing, and that a short script comparing the `.ts` blocks, documented functions and `@param`s with the keys lists no missing or stale key.
- [x] 1.3 README, `pxt.json` and CHANGELOG. README Shapes section: the paragraph introduces pattern shapes with `#` as the pattern color, and the list names `createPattern`. Edit in place, adding no lines. `pxt.json` description: "sprites" → "patterns". CHANGELOG (D6): the `[0.2.0]` lines use the new terms, and "Changes" gets the plain line "`createSprite` is now `createPattern`; sprites are called pattern shapes." Verify that `wc -l README.md` gives 120, that `pxt.json` parses and still contains "WS2812", "WS2812B" and "NeoPixel", that `git diff CHANGELOG.md` touches only the `[0.2.0]` entry, and that `grep -i sprite README.md pxt.json` finds nothing.

## 2. Feature tours (design D1, D4)

- [x] 2.1 Advanced tour: the two `createSprite` calls. Intermediate tour: the two calls and the EN/DE header lines about sprites ("Herz-Sprite" → "Herz aus einem Muster" or similar). Beginner tour: the four calls, scene 8 as "Pattern shapes" / "Formen aus Mustern" in both header lists and in the scene comment, `spritesScene` → `patternShapesScene` and its call, and the EN/DE step comments. Every comment stays an `// EN:` / `// DE:` pair with aligned continuation lines, and the beginner code keeps its rules (no arrays, `%`, bit operators or `? :`). Verify a Tour build for each of the three tours, and that `grep -i sprite examples/*.js` finds nothing.

## 3. Integration checks

- [x] 3.1 Run `git grep -i sprite`. Verify that it finds only lines under `openspec/changes/`, in the CHANGELOG's `[0.1.0]` entry and its `[0.2.0]` line about the rename, and in `openspec/specs/`, which only archiving updates: archiving a copy of `openspec/` and applying the Migration Plan must leave no "sprite" in its specs and pass `openspec validate --specs --strict`.
  Result: as expected. The trial archive applied 14 modified and 3 renamed requirements, and the copy's specs have no "sprite" and validate.
- [x] 3.2 Run the full CI equivalent: Build OK and Sim OK. Verify that both pass.
- [x] 3.3 Flash the test build onto the Calliope mini 3 and read the serial output. Verify that it shows `ledmatrix test: patternShapes` and ends with `ledmatrix tests passed`.
  Result: after a reset by serial break, all 14 groups ran, `patternShapes` included, and the output ended with `ledmatrix tests passed`.
- [x] 3.4 Manual check by the user in the German Calliope editor, with this branch as the extension. The create block reads "Matrix [Muster] bei x … y … Farbe …"; if it looks cramped, switch to the D2 fallback from the design's risks and repeat 1.1 and 1.2. The rotate, flip and set-pattern blocks use the `shape` variable. No "Sprite" appears in the toolbox or the tooltips. Verify with the user's confirmation.
  Result: confirmed by the user.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review.
- After archiving, apply the design's Migration Plan to `openspec/specs/matrix-shapes/spec.md` (Purpose and two scenario titles), then run `openspec validate --specs --strict`.
