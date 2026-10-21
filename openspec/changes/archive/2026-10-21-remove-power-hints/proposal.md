# Proposal

## Why

The README, the course and the `setBrightness` tooltip give wiring and power instructions: a schematic, a demand for a 5 V supply and "about 2 A at brightness 32". They are only partly right. Which wiring works depends on the matrix and its chips, which this extension cannot know. Wiring and power hardware are not this extension's concern, so the docs drop them instead of giving semi-correct instructions.

The course overview also says a 16x16 matrix is required. Smaller matrices work too once the programs are adapted.

## What Changes

- README, both languages: remove the "Matrix anschließen" / "Connect the matrix" section with its schematic, pin-header note and power note.
- Worksheets, note for adults: keep the layout and "set wiring" hints, and drop the power supply, the 2 A figure, "keep the brightness at 32 or lower" and the README link for wiring.
- Course README, both languages: drop "with its own 5 V power supply". Say that the solutions are written for a 16x16 matrix, that a smaller matrix needs the setup and program logic adapted, and that some exercises such as Pong make no sense on 8x8.
- `setBrightness` tooltip (`main.ts`, `_locales/de`): drop "Large matrices draw a lot of current, so start low".
- `docs/examples/feature-tour-2.js`: drop the power reason from the dimming comment.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `extension-package`: "Compact README" no longer requires power and pin notes and forbids wiring and power instructions. The scenario keeps its name "Power and pin notes", because a modified requirement cannot drop a scenario. The touch-pin warning, which the README lacks today, is dropped.
- `school-courses`: in "Worksheet setup", the note for adults covers the layout only, not wiring, power or brightness. "Course overview" says which matrix sizes the solutions fit.

## Impact

- Changed: `README.md`, `docs/courses/README.md`, `docs/courses/uebungen.md`, `docs/courses/exercises.md`, `_locales/de/ledmatrix-jsdoc-strings.json`, and comments only in `main.ts` and `docs/examples/feature-tour-2.js`.
- Not changed: program code, the default brightness 32, the tours' limit of 32, the quick-start hardware photo.
- Not included: a `CHANGELOG.md` entry (user decision).
