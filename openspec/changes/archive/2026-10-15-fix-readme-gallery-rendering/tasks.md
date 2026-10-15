# Tasks

## 1. README and CHANGELOG (spec: "README title in the extension gallery", "README links in the extension gallery")

- [x] 1.1 Change the README title to `# ledmatrix: LED Matrix for WS2812 / WS2812B (NeoPixel)`. Verify that line 1 contains `ledmatrix` and "WS2812", "WS2812B" and "NeoPixel", and the seven badge lines still follow directly.
- [x] 1.2 Replace the six relative links (lines 27, 50, 115): the examples folder with `https://github.com/waldbaer/pxt-ledmatrix/tree/main/examples`, the three tours, `wiring-check.js` and `CHANGELOG.md` with `https://github.com/waldbaer/pxt-ledmatrix/blob/main/<path>`. Verify that `grep -oP '\]\(\K[^)]+' README.md | grep -v -e '^https://' -e '^#'` prints nothing and every new URL returns HTTP 200.
- [x] 1.3 Add one "Changes" bullet to the CHANGELOG `[0.2.0]` entry: README links and title work in the extension gallery. Verify that `[0.2.0]` is still the top entry.

## 2. Integration checks

- [x] 2.1 Run `openspec validate fix-readme-gallery-rendering --strict` and `wc -l README.md`. Verify that validation passes and the README has at most 120 lines.

## Workflow follow-up

- Archive the change.
- Tag and release `0.2.0`, then request Calliope approval.
