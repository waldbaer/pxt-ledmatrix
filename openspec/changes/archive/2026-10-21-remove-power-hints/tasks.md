# Tasks

`MKC` below means `npx --yes makecode@1.3.6`, the CLI that CI uses. "Build OK" means that `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`. No CHANGELOG entry (user decision).

## 1. README (spec: Compact README)

- [x] 1.1 In `README.md`, remove the sections "### Matrix anschließen" and "### Connect the matrix": heading, schematic, pin-header note and power note. Keep the quick-start hardware photo. Verify:
  - `grep -niE "anschließen|connect the matrix|Stiftleiste|pin header|VCC|Netzteil|power supply|Strom|current" README.md` finds nothing.
  - "### Schnellstart" / "### Quick start" follows "### Erweiterung hinzufügen" / "### Add the extension" directly.
  - Each section counts at most 130 lines.

## 2. Course (spec: Worksheet setup, Course overview)

- [x] 2.1 In the note for adults of `docs/courses/uebungen.md` and `docs/courses/exercises.md`, remove the lines about the 5 V supply, the 2 A figure, brightness 32 and the README link for wiring. Keep the layout and "set wiring" hints. Verify:
  - `grep -nE "Netzteil|power supply|2 A|32|blob/main/README.md" docs/courses/uebungen.md docs/courses/exercises.md` finds nothing.
  - Both notes say the same thing in both languages.
- [x] 2.2 In `docs/courses/README.md`, replace the "Ihr braucht …" / "You need …" line:
  - DE: "Ihr braucht einen Calliope mini 1, 2 oder 3 und eine Matrix mit WS2812B-LEDs an Pin P0. Die Lösungen sind für eine 16x16-Matrix geschrieben. Für eine kleinere passt ihr die Einrichtung und die Programmlogik an; manche Übungen wie Pong ergeben auf einer 8x8-Matrix aber keinen Sinn."
  - EN: "You need a Calliope mini 1, 2 or 3 and a matrix of WS2812B LEDs on pin P0. The solutions are written for a 16x16 matrix. For a smaller one, adapt the setup and the program logic; some exercises such as Pong make no sense on an 8x8 matrix."

  Verify that `grep -nE "Netzteil|power supply" docs/courses/README.md` finds nothing and that `git diff docs/courses/README.md` changes only those two lines.

## 3. Tooltip and tour comment

- [x] 3.1 In the `setBrightness` doc comment in `main.ts`, drop "Large matrices draw a lot of current, so start low". In `_locales/de/ledmatrix-jsdoc-strings.json`, drop "Große Matrizen brauchen viel Strom, also niedrig anfangen." from `ledmatrix.Matrix.setBrightness`. Verify:
  - Both texts read "Set the brightness used when showing (0-255). The stored colors do not change." / "Setzt die Helligkeit beim Anzeigen (0-255). Die gespeicherten Farben ändern sich nicht."
  - `python3 -m json.tool _locales/de/ledmatrix-jsdoc-strings.json` succeeds.
  - Build OK.
- [x] 3.2 In `docs/examples/feature-tour-2.js`, cut the dimming comment to "DE: die ganze Matrix dimmen und zurück bis 32" / "EN: dim the whole matrix down and back up to 32". Verify:
  - `git diff docs/examples/feature-tour-2.js` changes only comment lines.
  - `docs/examples/build-and-flash.sh -b docs/examples/feature-tour-2.js` reaches `hex:`.

## 4. Final check

- [x] 4.1 Verify:
  - `git ls-files | grep -v '^openspec/' | xargs grep -niE "Netzteil|power supply|viel Strom|wenig Strom|lot of current|little current|more power|Stiftleiste|pin header"` finds nothing.
  - `openspec validate remove-power-hints --strict` passes.
