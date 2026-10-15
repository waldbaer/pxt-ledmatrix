# Tasks

`MKC` below means `npx --yes makecode@1.3.6`, the CLI that CI uses. "Build OK" means that `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`. "Sim OK" means that `node .github/scripts/sim-test.js mkc.json` and `node .github/scripts/sim-test.js mkc-microbit.json` both pass. The groups are ordered so that the README never goes over 120 lines in between (design D5).

## 1. One Shapes group (design D4)

- [x] 1.1 Move every block with `group="Sprites"` (`createSprite` in `main.ts`; `grid` and `pattern` in `pattern.ts`; `rotate`, `flip`, `setPattern`, `width` and `height` in `shapes.ts`) to `group="Shapes"`, and set `weight`, `blockGap` and `advanced` for the whole Shapes group as in the D4 table. Remove "Sprites" from `//% groups=` and the `{id:group}Sprites` key from `_locales/de/ledmatrix-strings.json`. Verify that `grep -rn 'group="Sprites"' *.ts` finds nothing, that Build OK, and that the JSON parses (`python3 -m json.tool`).
- [x] 1.2 In `README.md`, merge the Sprites section into Shapes by removing the `## Sprites` heading and the blank line before it, and change the `setVisible(on)` note to "hidden shapes don't collide or stamp". Verify with `wc -l README.md` that it has 117 lines.

## 2. `show` block and toolbox order (design D3)

- [x] 2.1 Change the `show` block text to `%matrix|show changes` and its doc comment to the D3 text in `main.ts`. Set `//% groups=` to `["Setup", "Display", "Draw", "Text", "Shapes", "Collisions", "Colors"]`. Update `ledmatrix.Matrix.show|block` ("Änderungen anzeigen") and `ledmatrix.Matrix.show` (D3 tooltip) in the German files. Verify Build OK and that `grep` finds the new texts in `main.ts` and both locale files.

## 3. `wouldOverlap` (spec: matrix-shapes "Overlap after a move"; design D1)

- [x] 3.1 Implement `Shape.wouldOverlap(other, dx, dy)` in `shapes.ts` as in D1 (shift, `overlaps`, shift back, no `_changed()`), with the D1 annotations and doc comment. In `test.ts`, add the four spec scenarios to the collision tests: the T sprites at (0, 10) and (2, 9) with offsets (0, 0) and (-1, 1) and the position unchanged; a `wouldOverlap` call in the "queries do not send" check; a hidden other shape; and the wrap-around dots on the 8x8 matrix, with wrap on and off. Verify Build OK and Sim OK.
- [x] 3.2 Add the German strings from D1: `ledmatrix.Shape.wouldOverlap|block` in `ledmatrix-strings.json`, and `ledmatrix.Shape.wouldOverlap` plus `|param|other`, `|param|dx` and `|param|dy` in `ledmatrix-jsdoc-strings.json`. Add the D5 `wouldOverlap` line to the README's Collisions section. Verify that both JSON files parse, that `grep` finds all five keys, and that `wc -l README.md` gives 118.

## 4. Hidden shapes don't stamp (spec: matrix-shapes "Stamp shapes"; design D2)

- [x] 4.1 In `shapes.ts`, make `stamp()` return unless `_live()`. In the stamp test block of `test.ts`, add: a hidden shape stamps nothing and stamps after `setVisible(true)`; a red shape that is stamped, then recolored blue and removed leaves red pixels. Verify Build OK and Sim OK.
- [x] 4.2 Replace the `stamp()` doc comment in `shapes.ts` and `ledmatrix.Shape.stamp` in `ledmatrix-jsdoc-strings.json` with the D2 texts. In the README, move `stamp()` to its own Collisions line with the D5 wording. Verify Build OK, that the German JSON parses, and that `wc -l README.md` gives 119.

## 5. Version and changelog (design D6)

- [x] 5.1 Set `"version": "0.2.0"` in `pxt.json`. Add a `[0.2.0]` entry to `CHANGELOG.md` with "Features" (`wouldOverlap`) and "Changes" (hidden shapes no longer stamp, marked as a behavior change; `show` block text and its position in the toolbox; one Shapes group; clearer `show` and `stamp` tooltips). Verify that `pxt.json` parses and that the changelog entry names each of these items.

## 6. Integration checks

- [x] 6.1 German completeness: check that every `//% block=` in the `.ts` files has a `|block` key in `ledmatrix-strings.json`, that every documented function and `@param` has a key in `ledmatrix-jsdoc-strings.json`, and that no key is left for a removed group or block. Verify with a short script that lists missing and stale keys and prints nothing.
- [x] 6.2 Run the full CI equivalent: Build OK and Sim OK, then `wc -l README.md` ≤ 120 (expected 119). Verify that all of these pass.
- [x] 6.3 Flash the test build onto the Calliope mini 3 and read the serial output. Verify that it ends with `ledmatrix tests passed`.
- [x] 6.4 Build `examples/wiring-check.js` for Calliope mini 1 (hardware variant `v1`, as `examples/build-and-flash.sh` does). Verify that it builds and that the hex size has not grown noticeably, so the README memory note still holds.
- [x] 6.5 Manual check by the user in the German Calliope editor with this branch as the extension: groups in the order Einrichten, Anzeige, Zeichnen, Text, Formen, Kollisionen, Farben; Formen in the D4 order with no Sprites group; "Änderungen anzeigen" and "würde … berühren bei Bewegung um" shown; the brightness slider caption shows "Brightness" (extension-package spec, scenario "Slider caption"); and a project saved with 0.1.0 still loads. Verify with the user's confirmation.

## Workflow follow-up

- Fix `examples/demo1.js` (untracked, not part of this change): add `matrix.show()` after `herz.setPosition(spalte, 0)`.
- Archive the change with `/opsx:archive` after review, then tag the release `v0.2.0`.
