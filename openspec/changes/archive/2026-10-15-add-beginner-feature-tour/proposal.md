# Proposal

## Why

The two feature tours are written for programmers: several operations per step, sine tables, bit shifts and fixed-point math. Children and beginners cannot follow them, and 17 of the public blocks appear in neither tour (e.g. `fill`, `flip`, `bringToFront`, `wouldOverlap`, `isOnEdge`). The examples' comments are English only, while the Calliope mini is used mostly in German schools.

## What Changes

- New `examples/feature-tour-beginner.js`: a slow tour, readable by a 12-year-old, that shows every public block except `setLayout` and `setColorOrder`, one operation per step.
- Renames: `examples/feature-tour.js` -> `feature-tour-intermediate.js`, `examples/feature-tour-2.js` -> `feature-tour-advanced.js`. Their code and scenes stay the same.
- The first comment of each tour names the boards it runs on; the beginner and advanced tours need a Calliope mini 3.
- Every comment in all four examples (three tours and `wiring-check.js`) in English and German, as `// EN:` / `// DE:` line pairs.
- `wiring-check.js` gets a header that says what it is for: run it first on a new panel to find the right layout and color order.
- README links the three tours; `build-and-flash.sh` usage and CHANGELOG (unreleased 0.2.0) updated.
- Not included: German translations of README or CHANGELOG, Blocks versions of the tours, a beginner tour for the Calliope mini 1/2 or the micro:bit.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `extension-package`: new requirements "Feature tours", "Beginner tour covers every block", "Beginner tour pace", "Beginner tour code" and "Bilingual example comments". "Wiring-check example" adds the purpose header. "Example is plain JavaScript" covers every example, not only the wiring check.

## Impact

- `examples/`: one new file, two renamed, all four with new comments. Programs that copied the old file names are not affected; only links to them break.
- `README.md` (one line, stays at 120 lines), `CHANGELOG.md`, `examples/build-and-flash.sh` (usage comment).
- No change to the library, its blocks, flash size or tests.
