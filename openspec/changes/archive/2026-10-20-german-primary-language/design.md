# Design

## Context

See proposal.md for the motivation and the delta spec for the required behavior.

MakeCode facts, checked in the cached `pxtworker.js` and the pxt sources:

- An English editor skips all API translation. The source `block=` texts and doc comments are the English UI, and `_locales/en` cannot override them.
- `blockSetVariable` and `.defl` are never translated.
- A create block's variable is `blockSetVariable`. If that name is already assigned, the toolbox proposes `name2`, `name3`, and so on (`webapp/src/blocks.tsx`).
- A block that works on an object puts a variable into its object slot. The name comes from `.defl`, or from the slot name if there is no `.defl`, and is never renumbered (`pxtblocks/toolbox.ts`).
- MakeCode search (`api/ghsearch`) shows the GitHub "About" text. The card for a pasted URL (`api/gh/<repo>`) shows the `pxt.json` description. On 2026-10-20, search found no results for this extension in either editor.

Current state:

- Create blocks use `blockSetVariable=shape` (5 times), `number` and `matrix`. 21 shape blocks use `shape.defl=shape`, "set number" uses `number.defl=number`, and the matrix blocks use `matrix.defl=matrix`.
- `_locales/de` names slots (`%shape`), not defaults, so it does not change.
- README: 115 lines, English only. It says that searching for `pxt-ledmatrix` finds the extension.
- Tours: comments are EN, then DE. Tour 1 has 151 lines at HEAD, against a limit of 150. The working tree holds an uncommitted user edit in tour 1, the yellow pixel in the rgb scene, which must be kept.

## Goals / Non-Goals

**Non-Goals:**
- Inline `block.loc.de` or `jsdoc.loc.de` annotations.
- German identifiers in examples, `test.ts` or source comments.
- Translating the CHANGELOG or OpenSpec artifacts.
- Making MakeCode search find the extension.

## Decisions

### D1: German stays in `_locales/de`
The source stays English and `_locales/de` is unchanged.
*Alternative:* inline `block.loc.de` / `jsdoc.loc.de`, placed before the English text. Groups and the category can only be translated in the JSON file, so German would live in two places. Rejected.

### D2: Default variables
| Annotation | Blocks | Value |
|---|---|---|
| `blockSetVariable` | create matrix | `matrix` (unchanged) |
| `blockSetVariable` | `createRectangle`, `createCircle`, `createLine`, `createDot`, `createPattern`, `createNumber` | `rechteck`, `kreis`, `linie`, `punkt`, `muster`, `zahl` |
| `number.defl` | `setNumber` | `zahl` |
| `shape.defl` | `rotate`, `flip`, `setPattern` | `muster` |
| `shape.defl` | the 18 other shape blocks | `rechteck` |
| `matrix.defl` | matrix blocks | `matrix` (unchanged) |

Slot names (`%shape`, `%number`) stay, so no locale key changes. The generic shape blocks get `rechteck` because the rectangle is the first and most-used shape block.
*Alternative:* a neutral name such as `form`. No block creates it, so every drag would add an unused variable. Rejected.
*Alternative:* an `anzeige_` prefix to avoid clashes with pupils' own variables. Rejected by the user.

### D3: README layout
```
# ledmatrix: LED-Matrix für WS2812 / WS2812B (NeoPixel)
<badges, unchanged>
[Deutsch](#deutsch) · [English](#english)
## Deutsch
<intro>, ### Erweiterung hinzufügen, ### Schnellstart, … (each former ## becomes ###)
## English
<intro>, ### Add the extension, ### Quick start, …
## Supported targets
* for PXT/calliopemini
* for PXT/microbit
```
- The title keeps `ledmatrix`, "WS2812", "WS2812B" and "NeoPixel". All links stay absolute or `#` anchors.
- In the German section's code, variables are translated (`border` → `rahmen`, `number` → `zahl`, `shape.stamp()` → `form.stamp()`). `matrix` stays. Function and parameter names stay English. The English section keeps English names.
- The German chain diagram uses the labels of `LedMatrixWiring` in `_locales/de`: "Zeilen, Zickzack", "Zeilen, gleiche Richtung", "Spalten, Zickzack", "Spalten, gleiche Richtung". The columns are widened to fit.
- "Add the extension" only says to paste the URL.
- Each section has about 100 lines, under the limit of 110.

*Alternative:* `README.md` plus `README.en.md`. GitHub and the gallery page show only `README.md`, so English readers would have to follow a link. Rejected by the user.
*Alternative:* `_locales/de/README.md`. MakeCode reads it for tutorials, but it is not known to work for the gallery page. Rejected.

### D4: `pxt.json` description
`LED-Matrix für WS2812 / WS2812B (NeoPixel) jeder Größe und Verdrahtung: Zeichnen, Formen, Muster, Kollisionen, Zahlen | LED matrix for WS2812 / WS2812B (NeoPixel) of any size and wiring: drawing, shapes, patterns, collisions, numbers`

The separator is `|`, because `/` already appears in "WS2812 / WS2812B". The user sets the same text as the GitHub "About" by hand.

### D5: Example comments
Each `// EN:` / `// DE:` pair is swapped as a block. Both prefixes are 7 characters wide, so continuation lines keep their indent. While editing tour 1, one line is saved to meet its limit of 150.

### D6: CHANGELOG
Two lines under `[0.3.0]` "Changes": one for the German default variables (with the names), one for the bilingual README and description and the DE-first comments.

## Risks / Trade-offs

- [A pupil's own number variable `zahl` sits in the slot of "setze Zahl auf", because `.defl` is not renumbered, so the program shows a type error] → The error shows at once, and picking `zahl2` in the dropdown fixes it. Accepted with the names the user chose.
- [The generic shape blocks show `rechteck`, so they look rectangle-only. Dragging one in a project with only a circle adds an unused `rechteck` variable] → The pupil picks the variable in the dropdown. Accepted.
- [English users get German variable names] → Accepted, since the Calliope mini is the main target.
- [Jump links may not work on the gallery page, where this is not verified] → A broken anchor does nothing. Check on the gallery page after the release.
- [The gallery card may shorten the description] → German comes first, so the German part stays visible.
- [The two README sections drift apart] → The "Same content" scenario. Task 2.1 compares the sections part by part.

## Migration Plan

Nothing to migrate. Existing projects keep their variable names, and the new defaults apply only to newly dragged blocks. Rollback: revert the commit.
