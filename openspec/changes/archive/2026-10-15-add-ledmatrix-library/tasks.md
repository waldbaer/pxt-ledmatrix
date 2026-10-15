# Tasks

`MKC` below means the MakeCode CLI: `../experiments/test/makecode_check/node_modules/.bin/mkc` (v1.3.6), or `npx --yes makecode@1.3.6`. "Build OK" means `$MKC build` in the repo root ends with `Build OK`.

## 1. Scaffold and build pipeline

- [x] 1.1 Create `pxt.json` (name `ledmatrix`, version `0.1.0`, description containing "WS2812", "WS2812B" and "NeoPixel", e.g. "LED matrix for WS2812 / WS2812B (NeoPixel) panels of any size and wiring: drawing, shapes, sprites, collisions, numbers", dependency `core` only, `files`, `testFiles: ["test.ts"]`, `supportedTargets: ["microbit", "calliopemini"]`, `public: true`, `preferredEditor: "blocksprj"`), `tsconfig.json`, `.gitignore`, and `LICENSE.txt` (MIT) and `icon.png` copied from the prototype. Verify that `pxt.json` parses with `python3 -m json.tool` and all listed files exist.
- [x] 1.2 Add `mkc.json` (`targetWebsite: https://makecode.calliope.cc/`), `driver.ts` with `_send(buf, pin, brightness)` calling `light.sendWS2812BufferWithBrightness`, the test hook `_sendHook` (design D12), and an empty `ledmatrix` namespace in `main.ts`. Verify Build OK.
- [x] 1.3 Add `mkc-microbit.json` (`targetWebsite: https://makecode.microbit.org/`) and build with `$MKC build -c mkc-microbit.json`. If `light.sendWS2812BufferWithBrightness` is missing, implement the TypeScript scaling fallback in `driver.ts` (design D7). Verify Build OK for both configs.
- [x] 1.4 Find out whether `mkc build` compiles `test.ts`: add a temporary type error to it and check that the build fails, then remove the error. If the test file is not compiled, add a throwaway test project in the scratch directory that depends on the repo via `file:`. Verify that a deliberate failure is reported and a clean run gives Build OK.

- [x] 1.5 Add `.github/workflows/build.yml` (design D12b): on push and pull request, Node LTS, `npx --yes makecode@1.3.6 build` and `npx --yes makecode@1.3.6 build -c mkc-microbit.json`. Verify that both commands give Build OK when run locally exactly as written in the workflow, and that the YAML parses (`python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" .github/workflows/build.yml`, or `npx --yes js-yaml` if PyYAML is missing).

## 2. Display core (spec: matrix-display)

- [x] 2.1 Implement the enums `LedMatrixWiring`, `LedMatrixCorner`, `LedMatrixColorOrder`, the class `Matrix`, and `create(pin, width, height)`: size clamped to ≥ 1, pin driven low, defaults columns zig-zag / top left / brightness 32 / GRB / wrap off, plus `width()` and `height()`. Add the "Create a matrix" scenarios to `test.ts`. Verify Build OK.
- [x] 2.2 Implement the layout map (design D2): `ledIndex`, map building, `setLayout(wiring, corner)`. Add every layout scenario of the spec to `test.ts` (default 16x16, 8x8 rows zig-zag, 32x8 columns zig-zag bottom left, 8x16 rows bottom right, 4x4 columns top right, outside → -1). Verify Build OK.
- [x] 2.3 Implement `show()` (bg → `_out` through map and color order, then send with `brightness + 1`), `setBrightness` (clamped), `setColorOrder`, and the dirty flag with `_changed()` (design D4, D7, D8). In `test.ts`, use `_sendHook` to check: a 16x16 frame is 768 bytes, GRB/RGB byte order, brightness argument 33 by default and 256 after `setBrightness(300)`, repeated `show()` sends once, and calling a setter forces a resend. Verify Build OK.
- [x] 2.4 Add block annotations (group "Setup"/"Display"; `setLayout` and `setColorOrder` advanced), the German strings for all blocks and enums of this group in `_locales/de/`, and the README "Setup" section with the layout diagrams. Verify Build OK and that every block of this group has German keys.

## 3. Drawing layer (spec: matrix-drawing)

- [x] 3.1 Implement `_plot` with the targets `BG` and `OUT` (design D5), wrap-around and clipping, `setPixel`, `getPixel` and `setWrap`. Add the set/read, outside-ignored and drawing-wraps scenarios to `test.ts`. Verify Build OK.
- [x] 3.2 Implement `drawLine`, `drawRectangle`, `drawCircle`, `fill` and `clear` (prototype algorithms). Add the spec scenarios to `test.ts` (diagonal, single point, outline, filled 2x3, filled circle r=2, radius 0, clear keeps shapes once shapes exist — mark that one TODO for group 4). Verify Build OK.
- [x] 3.3 Implement `shift(dx, dy)` with `Buffer.shift` / `Buffer.rotate` and no allocation (design D9). Test both axes, negative values, and with and without wrap-around in `test.ts`. Verify Build OK.
- [x] 3.4 Implement `LedMatrixColors`, `colors`, `rgb` (truncate and clamp) and `hue`. Add the color scenarios to `test.ts` (orange, mixing, out of range, primary hues, angle wrap). Verify Build OK.
- [x] 3.5 Add block annotations (groups "Draw", "Colors"), the German strings for this group, and the README "Draw" and "Colors" lines. Verify Build OK and German keys complete for this group.

## 4. Patterns, shapes and collisions (spec: matrix-shapes)

- [x] 4.1 Port `pattern.ts`: `Pattern`, `grid`, `pattern(text)` (separators, ignored whitespace, off characters, color letters, padding, trimming), rotation and flip helpers, and `Matrix.drawPattern`. Add to `test.ts`: T trimmed to 3x2, `.#.|###`, multi-color `r.g|.b.` on 10x20, multi-line template. Verify Build OK.
- [x] 4.2 Implement `Shape` with the kinds dot/line/rect/circle/sprite, one render routine per kind through `_plot` (design D5), `createRectangle/Circle/Line/Dot/Sprite`, and rendering of visible shapes into `OUT` in list order in `show()`. Also `moveBy`, `setPosition`, `x`, `y`, `width`, `height`, `setColor`, `setVisible`, `bringToFront`, `remove`, `removeAllShapes`, each calling `_changed()`. In `test.ts`, check via `_sendHook`: moving doesn't erase, later shape on top, bring to front, line keeps direction, circle size, every setter triggers a send, and the TODO from 3.2. Verify Build OK.
- [x] 4.3 Implement `rotate` (position shift truncated toward zero), `flip` and `setPattern`, doing nothing on non-sprites. Add to `test.ts`: T turns right to `#.|##|#.`, `####` round trip (4,4) → (3,5), horizontal flip `#..|###` → `..#|###`. Verify Build OK.
- [x] 4.4 Implement collisions (design D6): lazily allocated scratch mask, targets `MASK`/`HIT_BG`/`HIT_MK`, `overlaps`, `touchesDrawing`, `canMoveBy` (no move, no dirty), `isInside`, `isOnEdge`, `stamp`. Add to `test.ts`: pixel-exact T pieces (no touch, then touch), falling piece stops at 18 and then at 16 on a 10x20 matrix, wall check, hidden and removed shapes don't collide, stamped pixels stay after remove, `canMoveBy` alone causes no send. Verify Build OK.
- [x] 4.5 Add block annotations (groups "Shapes", "Sprites", "Collisions"), the German strings for this group, and the README "Shapes", "Sprites" and "Collisions" lines. Verify Build OK and German keys complete for this group.

## 5. Fonts and number shapes (spec: matrix-fonts)

- [x] 5.1 Create `font.ts` (design D10): font structure, digit glyphs `0123456789-`, `_renderText` with a 1-column gap, number formatting (truncate toward zero, minus sign, single `0`), and `Matrix.drawNumber`. Add to `test.ts`: glyph `4` pixel check, `42` columns, `-7`, `3.9` / `-0.5`, `2048` within columns 0..14, `11` second digit at column 4, background stays, updating a counter. Verify Build OK.
- [x] 5.2 Add the shape kind `NUMBER` that renders through `_renderText`, plus `createNumber(value, x, y, color)` and `Shape.setNumber(value)` (does nothing on other kinds). Add to `test.ts`: number above the drawing layer, z-order with `bringToFront`, stamp a number, grow 9 → 10 (width 7, height 5), shrink 10 → 9, collisions at (1,0) false, (3,2) false, (0,0) true in both directions. Verify Build OK.
- [x] 5.3 Add block annotations (group "Text"), the German strings for `drawNumber`, `createNumber` and `setNumber`, and the README "Text" lines. Verify Build OK and German keys complete for this group.

## 6. Example and package (spec: extension-package)

- [x] 6.1 Write `examples/wiring-check.js`: size and pin variables at the top, default layout, a 2x2 rectangle shape walking clockwise (red top, green right, blue bottom, yellow left), the lap count centered with `drawNumber` after `clear()`, one `basic.forever`, no type annotations, no helper functions with parameters. Verify: grep finds no `: number`/`: boolean`-style annotations, and a throwaway project in the scratch directory (pxt.json depending on this repo via `file:`, the example as `main.ts`) gives Build OK for the Calliope mini 3.
- [x] 6.2 Check the simulator: run the example with `$MKC serve` (or in makecode.calliope.cc with the extension imported) and note whether the matrix is displayed. Write the README's simulator sentence accordingly (spec "Accurate simulator statement"). Verify that the README sentence matches what was seen.
- [x] 6.3 Finish `README.md`: title, the seven-line badge block from design D12b directly below it (spec "README badges"), a one-line summary naming WS2812, WS2812B and NeoPixel, the metadata lines `* for PXT/calliopemini` and `* for PXT/microbit` before the embed line (spec "Search keywords and metadata"; the prototype's `for PXT/calliope` is wrong), adding the extension (paste `https://github.com/waldbaer/pxt-ledmatrix` under Extensions), quick start with `create(DigitalPin.P0, 16, 16)`, the troubleshooting table (square splits → size or zig-zag; wrong corner → first LED; goes down first / counter-clockwise → rows/columns), power and pin notes (external 5 V, common GND, about 2 A at brightness 32 and about 15 A at 255 for 16x16, data pin not as touch input, pace `show()`), targets, license, and the MakeCode embed line. Verify `wc -l` ≤ 120 not counting the embed line, that every API function has a line, and that `grep -i` finds ws2812, ws2812b and neopixel in `pxt.json` and in the README's first paragraph.
- [x] 6.4 Check German completeness across the whole extension: compare every `//% block=` (functions, methods, enum members) and every documented function and parameter in the sources with the keys in `_locales/de/ledmatrix-strings.json` and `ledmatrix-jsdoc-strings.json` (script in the scratch directory, not committed). Verify zero missing keys.

## 7. Integration checks

- [x] 7.1 Build the test project and the example for every hardware variant: Calliope mini 1/2 and mini 3, micro:bit V1 and V2 (find the variant ids with `$MKC build -h` / the target's info, and use `-c mkc-microbit.json` for micro:bit). Record the binary sizes and update the README memory note with the measured numbers. Verify Build OK for each variant.
- [x] 7.2 On a Calliope mini 3 with the 16x16 panel on P0: flash the test build and check that no panic code appears. Then flash the example and check that the square stays solid, starts top-left, goes round clockwise and the lap count increases. Then set the layout to "rows, zig-zag" in a copy and check that the symptom matches the README troubleshooting table.
- [x] 7.3 Run `openspec validate add-ledmatrix-library --strict` and confirm that every spec scenario has a matching check in `test.ts` or in task 7.2. Verify the command reports the change as valid.

## Workflow follow-up

- On GitHub, set the repository description (with WS2812, WS2812B and NeoPixel) and topics such as `makecode`, `pxt`, `calliope-mini`, `microbit`, `ws2812`, `ws2812b`, `neopixel` and `led-matrix`.
- To appear in the editors' keyword search, request approval: for makecode.calliope.cc from the Calliope team, and for makecode.microbit.org through https://makecode.com/extensions/approval. Until then, users add the extension by pasting its URL.
- After the first push, check that the `build.yml` run is green.
- Tag the first release `v0.1.0` (for example with `mkc bump`), so that the tag badge shows it and MakeCode can pin the version.
- Archive the change with `/opsx:archive` after the hardware verification in 7.2.
