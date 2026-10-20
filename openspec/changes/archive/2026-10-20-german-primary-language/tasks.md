# Tasks

`MKC` below means `npx --yes makecode@1.3.6`, the CLI that CI uses. "Build OK" means that `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`. "Sim OK" means that `node .github/scripts/sim-test.js mkc.json` and `node .github/scripts/sim-test.js mkc-microbit.json` both pass. "Tour build" means `examples/build-and-flash.sh <file>` (Calliope mini 3) reaches `hex:`.

## 1. Default variables (spec: German default variables; design D2, D6)

- [x] 1.1 Set the D2 names. `main.ts`: `blockSetVariable` of the rectangle, circle, line, dot, pattern and number blocks. `shapes.ts`: `shape.defl=muster` on `rotate`, `flip` and `setPattern`, `shape.defl=rechteck` on the 18 other shape blocks, and `number.defl=zahl` on `setNumber`. Change no slot name, block text or locale file. Verify:
  - `grep -o "blockSetVariable=[a-z]*" main.ts` lists `rechteck kreis linie punkt muster zahl matrix`.
  - `grep -c "shape.defl=rechteck" shapes.ts` gives 18, `grep -c "shape.defl=muster" shapes.ts` gives 3, and `grep -c "number.defl=zahl" shapes.ts` gives 1.
  - `grep -n "defl=shape\|defl=number\|blockSetVariable=shape\|blockSetVariable=number" *.ts` finds nothing.
  - `git diff --stat` shows no `_locales` file, and Build OK and Sim OK both hold.
- [x] 1.2 CHANGELOG (D6): under `[0.3.0]` "Changes", add one line saying that blocks propose German variables (`rechteck`, `kreis`, `linie`, `punkt`, `muster`, `zahl`) in every editor language. Verify that `git diff CHANGELOG.md` touches only `[0.3.0]`.

## 2. README and description (spec: README in German and English, Compact README, Description in German and English; design D3, D4, D6)

- [x] 2.1 Rebuild `README.md` as in D3. The English section is the current text with every `##` turned into `###`, and "or search for `pxt-ledmatrix`" removed. The German section says the same in German and comes first. Its code uses German variables (D3), its chain diagram uses the German wiring labels, and its notes say the blocks exist in German and English. Verify:
  - A script counts the lines from `## Deutsch` to `## English` and from `## English` to `## Supported targets`, and each is at most 110.
  - Both sections have the same `###` headings in the same order (translated), and each `###` part has the same number of bullets, table rows and code blocks in both.
  - Line 1 is a level-1 heading with `ledmatrix`, "WS2812", "WS2812B" and "NeoPixel", and the seven badge lines follow it unchanged.
  - The jump-link line comes right after the badges.
  - `grep -o '](\S*)' README.md | grep -v '](https://\|](#'` finds nothing.
  - The file ends with `* for PXT/calliopemini` and `* for PXT/microbit`.
  - `grep -in "search for\|suche nach" README.md` finds no claim that MakeCode search finds the extension.
  - The German section contains no `border`, `number` or `shape.` in code. The English section's code is unchanged.
- [x] 2.2 Set the `pxt.json` description to the D4 text. Verify that `python3 -m json.tool pxt.json` succeeds, and that splitting the description at ` | ` gives exactly two parts, each containing "WS2812", "WS2812B" and "NeoPixel".
- [x] 2.3 CHANGELOG (D6): under `[0.3.0]` "Changes", add one line saying that the README and the `pxt.json` description are German and English and that example comments come German first. Verify that `git diff CHANGELOG.md` touches only `[0.3.0]`.

## 3. Example comments (spec: Bilingual example comments; design D5)

- [x] 3.1 In `feature-tour-1.js`, `feature-tour-2.js`, `feature-tour-3.js` and `wiring-check.js`, swap every `// EN:` / `// DE:` pair to `// DE:` / `// EN:`. Keep the indent of continuation lines and all identifiers. Keep the uncommitted yellow-pixel edit in tour 1. Shorten tour 1 by one line without dropping a step comment. Verify:
  - A script finds that every comment is a `// DE:` part directly followed by an `// EN:` part, ignoring separator lines.
  - `wc -l` gives at most 150, 250 and 300 lines for tours 1, 2 and 3.
  - `git diff -U0 HEAD -- examples/` changes no code line except the yellow-pixel `setPixel` line and the line saved in tour 1.
  - A Tour build passes for each of the three tours and for `wiring-check.js`.

## 4. Integration checks

- [x] 4.1 Run the full CI equivalent, and run `openspec validate german-primary-language --strict`. Verify that Build OK and Sim OK hold and the change is valid.
- [x] 4.2 Manual check by the user, with this branch pushed and added as the extension in the Calliope editor. The user does the push.
  - German editor: the first rectangle sits in "setze rechteck auf" and a second one proposes `rechteck2`. "bewege um", "setze Zahl auf" and "drehe" hold `rechteck`, `zahl` and `muster`. All blocks are still German.
  - English editor: the circle block sits in "set kreis to".
  - GitHub: the README shows German first, and the "English" jump link scrolls to the English section.

  Verify with the user's confirmation.
  Result: confirmed by the user.

## Workflow follow-up

- The user sets the GitHub "About" text to the D4 description in the repository settings.
- After the release, open the extension's gallery page and check that the jump links work there. If they don't, they do nothing and can stay.
- Archive the change with `/opsx:archive` after review.
