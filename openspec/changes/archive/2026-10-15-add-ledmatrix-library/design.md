# Design

## Context

See proposal.md for motivation and the specs for the required behavior. The starting point is the prototype in `../experiments/pxt-ledmatrix` (`main.ts`, `shapes.ts`, `pattern.ts`, `driver.ts`, `test.ts`, `_locales/de`). Its API and algorithms (layout formula, Bresenham, midpoint circle, pattern parsing, rotation) are reused. Its buffer handling is reworked.

Constraints that shape the design:

- **MakeCode static TypeScript**: classes, closures, `Buffer` and enums work. There is no reflection and no `any`-based tricks. Every public function with `//% block` annotations becomes a block, and Python names are derived automatically.
- **RAM**: Calliope mini 1/2 and micro:bit V1 have 16 KB in total. A 16x16 panel has 256 LEDs. Per-call allocations in a game loop cause garbage-collection pauses.
- **Driver**: `light.sendWS2812Buffer` / `light.sendWS2812BufferWithBrightness` are built into the core (`pxt_modules/core/light.cpp`). Each send pulls the pin low for 300 µs and then sends with **interrupts disabled**, which takes about 7.7 ms for 768 bytes. Both native routines (nRF52 `sendbuffernrf52.s`, nRF51 `sendbufferbrightness.s`) scale each byte as `(v * br) >> 8`, and the nRF52 one caps `br` at 256.
- **Tooling**: the MakeCode CLI `mkc` (in `../experiments/test/makecode_check/node_modules`, v1.3.6) builds against the real target compiler. The Calliope compiler is cached in `~/.pxt/mkc-cache`. `-c <file>` selects a config (target website), and `-h <hw>` selects a hardware variant.

## Goals / Non-Goals

**Goals:**
- At most 8 bytes of RAM per LED for a matrix, plus 1 byte per LED only once collision queries are used.
- No allocation proportional to the matrix size in `show()`, `shift()` or collision queries.
- A single rendering path for every shape kind, so drawing, stamping and collisions automatically agree for dots, lines, rectangles, circles, sprites and number shapes.
- Seams for later extensions: chained panels (via the index map) and letters/text (via the font table and the text-shape kind).

**Non-Goals:**
- A simulator part that displays the matrix in the editor (only verified and documented).
- Gamma correction, animations or effects, double buffering.
- Custom mapping tables, chained panels, letters and scrolling text (only the seams above).

## Decisions

### D1: File layout
`main.ts` holds the enums, `Matrix`, `create` and the color helpers. `shapes.ts` holds `Shape`. `pattern.ts` holds `Pattern`, `grid` and `pattern`. `font.ts` holds the digit font and glyph rendering. `driver.ts` is the only file that calls `light.*`. `test.ts` is listed as `testFiles`. This follows the prototype's split, so diffs against it stay readable.

### D2: Layout as a precomputed index map
The prototype's `ledIndex(x, y)` formula (mirror x/y by corner, then the rows/columns × zig-zag/straight formula) fills a `UInt16LE` map buffer (logical pixel → LED index). The map is rebuilt in `create` and `setLayout`. `show()` only reads the map.
*Alternatives:* computing the formula per pixel on every `show()` (slower, and every future layout makes the hot path more complex), or a `Layout` class hierarchy (more code now for no v1 benefit). The map is the seam for later layouts: chained panels would simply fill it differently.

### D3: Create signature and defaults
`create(pin, width, height)` with "columns, zig-zag", first LED top left, brightness 32, GRB and wrap off. `setLayout(wiring, corner)` and `setColorOrder` are `advanced=true` blocks. The enums `LedMatrixWiring` and `LedMatrixCorner` are kept from the prototype (4 × 4 = 16 layouts).
*Alternative:* optional parameters on `create`. Blocks would still show them, which makes the most common block longer for nothing.

### D4: Two pixel buffers, with shapes rendered straight into the output
Buffers per matrix: `_bg` (3 B/px, RGB, row-major logical, the drawing layer), `_out` (3 B/LED, chain order, color order applied, **full intensity**) and `_map` (2 B/px). That makes 8 B/LED, against 11 in the prototype, because the separate composed-frame buffer is gone. `show()` copies `_bg` into `_out` through the map and color order, then renders each visible shape directly into `_out`.
*Alternative:* keep a composed logical frame (simpler code, but +768 B on 16x16).

### D5: One render function, several plot targets
All drawing goes through one `_plot(target, x, y, color)`, which applies wrap-around or clipping and then writes according to `target`:

```
 BG     -> _bg[x,y] = color                    (draw*, stamp)
 OUT    -> _out[map[x,y]] = color, ordered     (show)
 MASK   -> _scratch[x,y] = 1                    (collision prep)
 HIT_BG -> hit |= _bg[x,y] is lit               (touchesDrawing)
 HIT_MK -> hit |= _scratch[x,y] != 0            (overlaps)
```

Each shape kind (dot, line, rect, circle, sprite, number) has exactly one render routine that calls `_plot`. Drawing, stamping and all collision queries reuse it, so number shapes collide pixel-exactly with no extra code. The probe targets must not set the dirty flag.
*Alternative:* the prototype's approach of rendering every query into fresh full-frame RGB buffers. It is simple but allocates 768 B per mask on 16x16.

### D6: Collision scratch mask
`overlaps(a, b)` renders `a` into a 1 B/px scratch mask that belongs to the matrix (allocated lazily on the first collision query), probes `b` against it, then renders `a` again with 0 to clear only the touched pixels. With wrap-around off, it first rejects shapes whose bounding boxes don't intersect. `canMoveBy` temporarily offsets the shape's position, evaluates, restores it, and leaves the dirty flag untouched.
*Alternatives:* per-call masks sized to the intersection box. They need less memory, but allocate on every call and get complicated with wrap-around.

### D7: Brightness in the native driver
`show()` calls `light.sendWS2812BufferWithBrightness(_out, pin, brightness + 1)`. Both native routines compute `(v * br) >> 8`, which matches the spec formula `(v * (b + 1)) >> 8`. A brightness change therefore needs no recompose, only a send. If the micro:bit core lacks the function, or the build fails, `driver.ts` falls back to scaling in TypeScript into a reused buffer. The spec's behavior stays the same.
*Alternative:* scaling in TypeScript as the prototype does. It is portable and its bytes can be checked in tests, but costs a loop per frame.

### D8: Skip unchanged frames with a dirty flag
The matrix has `_dirty`, which starts true. Every mutation sets it through one helper `_changed()`: all `_bg` writes, all shape setters (`moveBy`, `setPosition`, `setColor`, `setVisible`, `bringToFront`, `remove`, `rotate`, `flip`, `setPattern`, `setNumber`, shape creation) and every setter call (`setBrightness`, `setColorOrder`, `setLayout`, `setWrap`), even when the value is the same. `show()` returns early when the flag is clear and clears it after sending. Calling any setter again is therefore also the documented way to force a resend, for example after the panel's power was switched off and on.
*Alternative:* comparing against a copy of the last frame (+3 B/LED and a full compare each frame).

### D9: In-place shift
`shift(dx, dy)` uses the core's native `Buffer.shift` (zero fill) or, with wrap-around on, `Buffer.rotate`. A vertical move shifts the whole `_bg` by `dy * width * 3` bytes. A horizontal move does the same per row on `width * 3` bytes, with offset `dx * 3`. Negative offsets move right or down, following the core's convention. No allocation.

### D10: Font table and text shapes
`font.ts` defines a font as width, height, a character string and a glyph `Buffer` (one byte per row, bit `w-1-col` = column `col`, 3x5 → 5 bytes per glyph). The v1 digit font covers `0123456789-` with the glyphs from the matrix-fonts spec, which are the ones in `bouncing_ball.py`. An internal `_renderText(target, text, x, y, color, font)` draws characters with 1 empty column between them. `drawNumber` formats the value (truncated toward zero, `-` for negatives) and renders it into `BG`. `createNumber` creates a shape of kind `NUMBER` that stores the formatted text and renders it through the same function. `setNumber` reformats it. Later, letters come from adding a font or extending the character string, and `createText` would reuse the same shape kind.

### D11: Blocks and toolbox
Toolbox groups: Setup, Draw, Text, Shapes, Sprites, Collisions, Display, Colors. `drawNumber` and `createNumber` go in "Text". Number shapes use `blockSetVariable=number` like other shapes. Block and parameter wording, weights and `blockGap` follow the prototype. New blocks get German strings in `_locales/de/ledmatrix-strings.json` (`<qualified name>|block`) and `ledmatrix-jsdoc-strings.json` (`<qualified name>` and `<qualified name>|param|<name>`), in the same format as the prototype.

### D12a: Discoverability
The editors' extension search (`githubAsync.searchAsync` in pxtapp.js) asks a server-side GitHub search (`ghsearch/<target>/<platform>`). It then keeps **only approved** repositories, unless the target config sets `packages.allowUnapproved`, and neither makecode.calliope.cc nor makecode.microbit.org sets it (checked on 2026-10-15). So keywords alone don't make the extension appear in MakeCode search. They prepare it for approval, and they help GitHub and web search. Keywords therefore go where GitHub search looks (README, repository description, topics) and onto the extension card (`pxt.json` description). The README carries the template's metadata lines with the exact target ids `calliopemini` and `microbit`.

### D12b: Badges and continuous build
The README follows the badge style of the author's `waldbaer/node-red-persistent-values`: one linked badge per line directly below the H1, platform badge in default style, GitHub badges with `style=flat-square`. NPM version, downloads and coverage have no MakeCode equivalent. The version badge uses the git tag instead, because MakeCode resolves extension versions from tags.

```
[![Platform](https://img.shields.io/badge/platform-MakeCode-blue)](https://makecode.com)
[![Calliope mini](https://img.shields.io/badge/Calliope_mini-supported-brightgreen)](https://makecode.calliope.cc)
[![micro:bit](https://img.shields.io/badge/micro%3Abit-supported-brightgreen?logo=microbit)](https://makecode.microbit.org)
[![GitHub Tag](https://img.shields.io/github/v/tag/waldbaer/pxt-ledmatrix?style=flat-square)](https://github.com/waldbaer/pxt-ledmatrix/tags)
[![MIT License](https://img.shields.io/github/license/waldbaer/pxt-ledmatrix?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub issues open](https://img.shields.io/github/issues/waldbaer/pxt-ledmatrix?style=flat-square)](https://github.com/waldbaer/pxt-ledmatrix/issues)
[![GitHub Actions](https://github.com/waldbaer/pxt-ledmatrix/actions/workflows/build.yml/badge.svg)](https://github.com/waldbaer/pxt-ledmatrix/actions/workflows/build.yml)
```

The workflow `build.yml` runs on `push` and `pull_request` on `ubuntu-latest` with Node LTS. It runs `npx --yes makecode@1.3.6 build` (the same CLI version as local checks) and then the same command with `-c mkc-microbit.json`. The status badge omits `?branch=` so that it shows the default branch, whether that ends up being `master` (the local branch) or `main`.
*Alternatives:* a static "build" badge (says nothing), or the build only on release tags (finds breakage too late).

### D12: Verification
- `test.ts` turns the spec scenarios into `control.assert` checks: layouts, drawing, fonts, shapes, collisions. A test-only hook in `driver.ts` (`_sendHook`, underscore-prefixed so it doesn't appear in the editor) counts sends and captures `(buffer, brightness)`. That covers the dirty-flag, byte-order and frame-size scenarios without hardware.
- A compile check runs `mkc build` in the repo root with `mkc.json` (`targetWebsite: https://makecode.calliope.cc/`), plus a second config `mkc-microbit.json` for makecode.microbit.org, selected with `-c`. The example is compiled in a throwaway project (scratch directory) that depends on this extension through a `file:` path.
- On hardware: the test build and the example on the Calliope mini 3 with the 16x16 panel. `control.assert` failures show up as a panic code on the board.

## Risks / Trade-offs

- [Interrupts are off for about 8 ms per send, which can disturb radio, serial and sound] → D8 skips unchanged frames. The README advises pacing `show()` (`basic.pause` in loops).
- [A mutation path forgets `_changed()`, so the display goes stale] → one helper for all writes, plus a test that every shape setter triggers a send (send-counter hook).
- [`sendWS2812BufferWithBrightness` missing or different on micro:bit] → compile check against makecode.microbit.org early in the tasks. Fallback as in D7.
- [Flash on Calliope mini 1/2 and micro:bit V1: the prototype README quotes about 18 KB free for programs] → measure binary sizes of the example and the test build for those hardware variants (`-h`). Record the result in the README's memory note. MakeCode removes unused functions.
- [RAM for big panels on 16 KB boards: 16x16 ≈ 2.3 KB including scratch, 32x32 ≈ 9 KB] → README recommends at most 16x16 on Calliope mini 1/2 and micro:bit V1.
- [Simulator shows nothing because its LED part is bound to `neopixel.create`] → verify in the editor and state the result in the README (extension-package spec). No simulator part in v1.
- [German strings drift from the code when blocks change] → a completeness check task compares every `//% block=` and enum `//% block=` against the German keys before finishing.
- [`mkc build` might not compile `testFiles` of the root package] → verify on the first build. If it doesn't, build `test.ts` through a throwaway project like the example.

## Migration Plan

The extension is published at `https://github.com/waldbaer/pxt-ledmatrix`. Users add it in MakeCode by pasting that URL under Extensions. There is no existing release, so nothing to migrate. The prototype stays untouched in `../experiments/pxt-ledmatrix`. API differences from the prototype (`create` takes 3 parameters, the default layout is columns zig-zag, plus `drawNumber`, `createNumber` and `setNumber`) are only noted in the README where they matter to users.

## Open Questions

- The first version number in `pxt.json` (suggested: `0.1.0`).
