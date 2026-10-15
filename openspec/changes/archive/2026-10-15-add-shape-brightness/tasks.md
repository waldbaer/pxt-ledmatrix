# Tasks

`MKC` below means `npx --yes makecode@1.3.6`, the CLI that CI uses. "Build OK" means that `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`. "Sim OK" means that `node .github/scripts/sim-test.js mkc.json` and `node .github/scripts/sim-test.js mkc-microbit.json` both pass. "V1 build" means `examples/build-and-flash.sh wiring-check.js v1` up to the hex (flashing is not needed).

## 1. Baseline

- [x] 1.1 Before changing any code, run the V1 build of `examples/wiring-check.js` and note the size of `examples/built/wiring-check/built/v1/binary.hex` in this task. Verify that the hex exists and its size is noted.
  Baseline (main at c31796e): hex file 679242 bytes, 241456 data bytes.

## 2. `setBrightness` on shapes (specs: matrix-shapes "Shape brightness", matrix-display "Skip unchanged frames"; design D1 to D5)

- [x] 2.1 In `main.ts`, add `Matrix._level` (initialized to 255) and scale `color` in `_plot` for `_BG` and `_OUT` only, when `_level < 255`, with `(v * (_level + 1)) >> 8` per channel (D2). In `shapes.ts`, add `Shape._brightness` (initialized to 255), set and reset `m._level` around the `switch` in `_render` (D2), and add `setBrightness` (D3) with the D4 annotations and English doc comment. In `test.ts`, add `testShapeBrightness` with `run("shapeBrightness", testShapeBrightness)` after `run("shapes", ...)`, covering every "Shape brightness" scenario: default, dimmed, matrix brightness on top, levels multiply (127 and 127 give 63), sprite letters, and clamping and truncation. Add a `setBrightness` call to the "every shape change makes the next show send" check in `testShapes`. Verify Build OK and Sim OK.
- [x] 2.2 Add the German strings from D4: `ledmatrix.Shape.setBrightness|block` in `_locales/de/ledmatrix-strings.json`, and `ledmatrix.Shape.setBrightness` plus `ledmatrix.Shape.setBrightness|param|brightness` in `_locales/de/ledmatrix-jsdoc-strings.json`. Verify that both files parse with `python3 -m json.tool` and that `grep` finds all three keys.
- [x] 2.3 Replace the `setColor` / `setVisible` line in the README's Shapes section with the two D5 lines. Verify that `wc -l README.md` gives 120.

## 3. Dimmed shapes stay solid and keep their brightness (specs: matrix-shapes "Dimmed shapes stay solid", "The shape keeps its brightness"; design D2, D3)

- [x] 3.1 In `testShapeBrightness`, add the scenarios of both requirements: brightness 0 covers a red drawing pixel; a dot at brightness 0 still `touchesDrawing()` and `overlaps` another shape, and `maskClear(m)` is true afterwards; recolor and move keep the brightness; hide and show keep the brightness; back to 255 restores the full color. Also check that `_level` is reset: after showing a dimmed shape, `setPixel` and `drawRectangle` store full colors (`getPixel`) and a new shape at brightness 255 shows its full color. Fix `_plot` or `_render` if a check fails. Verify Sim OK.

## 4. Stamping dimmed shapes (spec: matrix-shapes "Stamp shapes"; design D2)

- [x] 4.1 Add the two new stamp scenarios to `testShapeBrightness`: at the default matrix brightness 32, a red dot at (1, 1) with brightness 127 stamps `getPixel(1, 1) == 0x7F0000`; a white dot at brightness 0 stamped on a red pixel turns it off. Then draw a pixel and check that it is stored at full color. No code change is expected, because stamping already goes through `_render`. Verify Sim OK and that the existing stamp tests in `testCollisions` still pass.

## 5. Version and changelog (design D6)

- [x] 5.1 Keep `"version": "0.2.0"` in `pxt.json` (not released yet, design D6). Add a bullet to the "Features" of the `[0.2.0]` entry in `CHANGELOG.md`: `setBrightness` for shapes and sprites (0..255, default 255), multiplied with the matrix brightness, dims sprite letters too, and stamping keeps the dimmed colors. Verify that `pxt.json` parses and that the entry names each of these points.

## 6. Integration checks

- [x] 6.1 German completeness: check that every `//% block=` in the `.ts` files has a `|block` key in `ledmatrix-strings.json`, that every documented function and `@param` has a key in `ledmatrix-jsdoc-strings.json`, and that no key is stale. Verify with a short script that lists missing and stale keys and prints nothing.
- [x] 6.2 Run the full CI equivalent: Build OK and Sim OK, then `wc -l README.md` ≤ 120 (expected 120). Verify that all of these pass.
- [x] 6.3 Flash the test build onto the Calliope mini 3 and read the serial output. Verify that it shows `ledmatrix test: shapeBrightness` and ends with `ledmatrix tests passed`.
  Result: three runs (reset by serial break) each went through every group, shapeBrightness included, to the final line, with no assertion. The serial link dropped bytes in every line (known issue, e.g. `ldatrxtsspsd`), so the lines are garbled but complete.
- [x] 6.4 Run the V1 build of `examples/wiring-check.js` again and compare the hex size with the baseline from 1.1. Verify that it builds and that the growth is small (a few hundred bytes at most), so the README memory note still holds. If it grew more, update the note with the measured size.
  Result: 241936 data bytes, +480 over the baseline. The README note ("about 15 KB") still holds.
- [x] 6.5 Manual check by the user. In the German Calliope editor with this branch as the extension: "setze Helligkeit" appears in Formen between "setze Farbe" and "sichtbar", with a 0..255 slider that starts at 128 and the D4 German tooltip, and a project saved before this change still loads. On the panel, with a throwaway program that is not committed: a multi-color sprite (e.g. `r#b`) fades from 255 to 0 at matrix brightness 32 with its letter colors dimming too, and a sprite and a dot at brightness 127 at matrix brightness 127 look about a quarter as bright as at full. Verify with the user's confirmation.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review. Tag `0.2.0` when the release is complete (more features may come first).
