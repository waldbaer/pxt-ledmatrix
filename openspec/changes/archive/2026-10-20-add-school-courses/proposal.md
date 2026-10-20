# Proposal

## Why

Teachers need ready-to-use lessons for the LED matrix on the Calliope mini. A first draft of ten exercises exists in `courses/` (not committed). A review found errors: a solution that contradicts its task, block names that the German editor does not have, and a setup step that cannot work because MakeCode search does not find the extension. The draft is German only, its solutions are only in markdown, and nothing builds or checks them.

## What Changes

- `docs/courses/` becomes the course. It holds a German worksheet `uebungen.md`, an English worksheet `exercises.md` and a `README.md`, German and then English, with the overview and all links.
- The same ten exercises, ordered from pictures to games. The review fixes go in: correct block names, complete block lists, the extension URL, a slower ball in Ü9, and a lamp that starts off in Ü3. The wording is gender-neutral.
- The solutions move into plain JavaScript programs in `docs/courses/solutions/`: a main solution and an Extra solution for each exercise, 20 files in all. `docs/examples/build-and-flash.sh` builds and flashes them.
- The examples move from `examples/` to `docs/examples/`, next to `docs/images/`, so that all documentation is in `docs/`. The README links follow.
- CI builds every program in `docs/examples/` and `docs/courses/solutions/` for the boards it claims to run on. `build-and-flash.sh` gets a build-only mode for this.
- README: a link to the course in each language section. The line limit rises from 110 to 130. The wiring schematic, added after the last change, already brought the sections to 126 and 120 lines.
- CHANGELOG: one line for the course and one for the move.

## Capabilities

### New Capabilities

- `school-courses`: the course material, which is the worksheets and solutions, in German and English, and how they are linked.

### Modified Capabilities

- `extension-package`:
  - A new requirement, "Programs build in CI", builds every example and course program.
  - "Example is plain JavaScript" and "Bilingual example comments" also cover `docs/courses/solutions/`.
  - These two, "Wiring-check example" and "Three feature tours" use the new path `docs/examples/`.
  - "Compact README" allows 130 lines per section and requires the course link.

## Impact

- New: `docs/courses/` with a README, two worksheets and 20 programs. Also `docs/examples/build-all.sh`.
- Changed: `.github/workflows/test.yml`, `README.md`, `CHANGELOG.md`.
- Moved: `examples/` to `docs/examples/`, with `build-and-flash.sh` changed. Links to the old example URLs from outside the repo stop working.
- Not included: MakeCode tutorials. The user dropped them during implementation.
- Removed: the draft files `courses/Matrix-Uebungen-Aufgaben.md` and `courses/Matrix-Uebungen-Loesungen.md`.
