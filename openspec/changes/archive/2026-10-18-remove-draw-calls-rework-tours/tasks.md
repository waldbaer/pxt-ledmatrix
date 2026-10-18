# Tasks

`MKC` below means `npx --yes makecode@1.3.6`, the CLI that CI uses. "Build OK" means that `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`. "Sim OK" means that `node .github/scripts/sim-test.js mkc.json` and `node .github/scripts/sim-test.js mkc-microbit.json` both pass. "Tour build" means `examples/build-and-flash.sh <file> [hw]` reaches `hex:`; for `v1` and `microbit` unplug the board first, so the script stops after `hex:` instead of flashing.

## 1. Library, tests and docs (specs: matrix-drawing, matrix-shapes, matrix-fonts; design D1 to D4, D10)

- [x] 1.1 Port the tests first, while the `draw*` calls still exist (D4). Every `drawLine`, `drawRectangle`, `drawCircle`, `drawPattern` and `drawNumber` check becomes create, `stamp()`, `getPixel`, `remove()` with the same coordinates and expected pixels. `testShapesDrawn` → `testShapeGeometry`, run name `shapeGeometry`. `testNumbers` checks stamped number shapes, including the new "Number wraps" and the reworded "Updating a counter" scenarios. The `drawRectangle` in `testShapeBrightness` becomes `setPixel`. Verify Build OK, Sim OK, and that `grep -nE 'draw(Line|Rectangle|Circle|Pattern|Number)' test.ts` finds nothing.
- [x] 1.2 Remove the calls (D1, D2). `main.ts`: delete `drawLine`, `drawRectangle`, `drawCircle`, `drawPattern`, `drawNumber`. `shapes.ts`: `stamp` gets `group="Draw"`, weight 90, and the tooltip sentence from D2. Verify Build OK, Sim OK, and that `git grep -nE 'draw(Line|Rectangle|Circle|Pattern|Number)' -- '*.ts'` finds nothing.
- [x] 1.3 German strings. Delete the 5 block keys and 23 jsdoc keys of the removed calls; translate the new `stamp` tooltip sentence. Verify that both files parse with `python3 -m json.tool`, and that a script comparing the `.ts` blocks, documented functions and `@param`s with the keys lists no missing or stale key.
- [x] 1.4 README and CHANGELOG (D10). README: quick start with a rectangle shape and a number shape; the Draw and Text lists drop the `draw*` lines and say that `stamp()` paints shapes into the drawing. CHANGELOG: a new `## [0.3.0]` entry with one **Breaking** line listing the removed calls and their replacement (create, `stamp()`, `remove()`) and one line about `stamp` moving to the Draw group. Verify `wc -l README.md` ≤ 120 and that `grep -nE 'draw(Line|Rectangle|Circle|Pattern|Number)' README.md` finds nothing.

## 2. Wiring check (spec: extension-package "Wiring-check example"; design D9)

- [x] 2.1 `examples/wiring-check.js`: one number shape created before the loop, `setNumber(laps)` after each lap, centered as before; its EN/DE comments follow. Verify a Tour build for `v3`, `v1` and `microbit`; compare the `v1` flash size with the README's "about 15 KB" and update that figure if it changed.

## 3. Feature tours (specs: extension-package "Three feature tours", "Short feature tours", "Tours cover every block", "Beginner tour shows the basics", "Advanced tour shows games", and the unchanged pace, code, comment and plain-JavaScript rules; design D5 to D8)

- [x] 3.1 Write `examples/feature-tour-1.js` with the D5 skeleton, separator lines and the five D6 tour-1 scenes; `feature-tour-beginner.js` stays deleted. Verify a `v3` Tour build; `wc -l` ≤ 150; a script finds only the thirteen D6 tour-1 block functions; the code without comments and strings has no array, `%`, bit operator or `? :`; every scene starts with its number; every step has a comment; every comment is an `// EN:` / `// DE:` pair, apart from separator lines.
- [x] 3.2 Write `examples/feature-tour-2.js` per D5 and D6; `feature-tour-intermediate.js` stays deleted. Verify a `v3` Tour build, `wc -l` ≤ 250, no advanced block, EN/DE comment pairs, and no matrix brightness above 32.
- [x] 3.3 Write `examples/feature-tour-3.js` (secrets of the matrix, invaders and pong, D6); `feature-tour-advanced.js` stays deleted. Verify a `v3` Tour build, `wc -l` ≤ 300, EN/DE comment pairs, no matrix brightness above 32, and that the game scenes call none of `setPixel`, `getPixel`, `.fill(` and `.shift(`.
- [x] 3.4 Coverage and boards (D6, D8). A script collects the function behind every `blockId` in the `.ts` files and checks that each appears in at least one tour, except `setLayout` and `setColorOrder`, and that the matrix's and a shape's `width` and `height` are both used. Then Tour build each tour for `v1` and `microbit`, and write its level and the boards that build into its first comment (EN and DE). Verify that the script reports no missing block and that each first comment names level and boards.
- [x] 3.5 Links and docs. README: the three tour links point to `feature-tour-1.js`, `-2.js`, `-3.js` as absolute `main` URLs. `build-and-flash.sh`: the usage comment names `feature-tour-2.js`. CHANGELOG `[0.3.0]`: one line saying the tours were rewritten and renamed. Verify `wc -l README.md` ≤ 120 and that `git grep -nE 'feature-tour-(beginner|intermediate|advanced)'` finds only lines under `openspec/` and in older CHANGELOG entries.

## 4. Integration checks

- [x] 4.1 Run `git grep -nE 'draw(Line|Rectangle|Circle|Pattern|Number)'`. Verify that it finds only lines under `openspec/` and in the CHANGELOG, and that archiving a copy of `openspec/` and applying the design's Migration Plan passes `openspec validate --specs --strict`.
- [x] 4.2 Run the full CI equivalent. Verify Build OK and Sim OK.
- [x] 4.3 Flash the test build onto the Calliope mini 3 and read the serial output. Verify that it shows `ledmatrix test: shapeGeometry` and ends with `ledmatrix tests passed`.
  Result: one run went through all 14 groups, `shapeGeometry` included, to the final line, with no assertion. The serial link dropped bytes in every line (known issue, e.g. `sapGemetr`, `ledmari tst pssed`), so the lines are garbled but complete.
- [x] 4.4 Manual check by the user: the wiring check and the three tours run on the panel as described in D6 and D9, and in the German Calliope editor the Draw group shows "stamp" with a German tooltip and no `draw*` block remains. Verify with the user's confirmation.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review.
- After archiving, apply the design's Migration Plan to the Purpose of `openspec/specs/matrix-drawing/spec.md`, then run `openspec validate --specs --strict`.
- At release: date the `[0.3.0]` entry, bump `pxt.json` to 0.3.0 and tag.
