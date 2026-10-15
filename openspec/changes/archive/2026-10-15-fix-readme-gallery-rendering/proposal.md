# Proposal

## Why

MakeCode's extension gallery shows the README on the extension's info page, and two things break there. Its renderer adjusts only links that start with `/` or `#`, so the README's six relative links (examples folder, three tours, wiring check, CHANGELOG) resolve against makecode.calliope.cc and lead nowhere. And the title appears twice: according to MakeCode's naming conventions, the gallery drops the README title only if it contains the `pxt.json` name `ledmatrix`. Fix both before 0.2.0 is released and submitted for Calliope approval.

## What Changes

- README title: `# ledmatrix: LED Matrix for WS2812 / WS2812B (NeoPixel)`.
- The six relative links become absolute GitHub URLs on `main`: the `examples/` folder as `tree/main/examples`, the three tours, `wiring-check.js` and `CHANGELOG.md` as `blob/main/<path>`.
- CHANGELOG: one line under the unreleased 0.2.0.
- Not included: links pinned to a release tag, other README content.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `extension-package`: new requirement "README in the extension gallery".

## Impact

- `README.md` (4 lines, stays at 120 lines), `CHANGELOG.md`.
- Links always open the latest `main`, also from the README of an older release.
- No change to the library, its blocks, the examples or the tests.
