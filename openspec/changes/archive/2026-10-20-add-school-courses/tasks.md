# Tasks

Terms used below:

- **MKC** is `npx --yes makecode@1.3.6`, the CLI that CI uses.
- **Build OK**: `$MKC build` and `$MKC build -c mkc-microbit.json` in the repo root both end with `Build OK`.
- **Sim OK**: `node .github/scripts/sim-test.js mkc.json` and `node .github/scripts/sim-test.js mkc-microbit.json` both pass.
- **Programs OK**: `docs/examples/build-all.sh` exits with 0.
- **Blocks OK**: the Blocks check of design D7 reports 0 grey blocks for every program it is given.
- **Harness**: the behavior check of design D7.

## 1. Build tooling and CI (spec: Programs build in CI; design D7)

- [x] 1.1 Add `-b` / `--build-only` to `docs/examples/build-and-flash.sh`. It stops after printing `hex:`. Update the usage comment at the top. Verify:
  - With a board connected, `docs/examples/build-and-flash.sh -b feature-tour-1.js v1` prints `hex:` and does not flash.
  - A call without `-b` behaves as before: it still flashes, or reports that no board was found.
- [x] 1.2 Add `docs/examples/build-all.sh` as in D7. Its header comment explains the boards rule and the phrase "Runs on the Calliope mini 1, 2 and 3". Verify:
  - It prints `feature-tour-1.js` with `v1 v2 v3 microbit`, `feature-tour-2.js`, `feature-tour-3.js` and `wiring-check.js` with `v3 microbit`, and it exits with 0.
  - With a temporary broken copy of an example in `docs/examples/`, it prints `FAIL <file> <board>` and exits non-zero. Remove the copy afterwards.
- [x] 1.3 Add the job `programs` to `.github/workflows/test.yml`, running `docs/examples/build-all.sh` with the workflow's Node and `MAKECODE_CLI`. Update the comment at the top of the workflow. Verify that `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/test.yml'))"` succeeds, and that the job's command, run locally, is Programs OK.
- [x] 1.4 Move `examples/` to `docs/examples/` with `git mv`, and the untracked `courses/` to `docs/courses/` (design D1). In both scripts, take the repo as two folders above their own. Point the CI job and the workflow comment to `docs/examples/build-all.sh`, and the README's four `examples/` links to `docs/examples/` (D6). Verify:
  - `examples/` and `courses/` no longer exist, and `git status` shows the examples as renamed.
  - Programs OK from the repo root, with the boards as in 1.2.
  - `docs/examples/build-and-flash.sh -b wiring-check.js` reaches `hex:`, also when called from `docs/examples/`.
  - The CI YAML check of 1.3 passes.
  - `grep -n "examples/" README.md | grep -v "docs/examples/"` finds nothing, and every `docs/examples/` link in the README maps to an existing file or folder.

## 2. Solution programs (spec: Solution programs, Solutions for every Calliope mini, Solutions convert to Blocks, Solutions do what the task says, Example is plain JavaScript, Bilingual example comments; design D2, D3, D4, D5)

- [x] 2.1 Write the 10 main solutions `docs/courses/solutions/NN-name.js` from the draft's solutions file, with the D4 changes: Ü2 `index`, Ü3 no `fill` on start, Ü6 `let haelfte = null`, Ü8 `figur`, Ü9 `basic.pause(300)`. Each first comment is a DE/EN pair naming the exercise's number and title. Verify:
  - Programs OK.
  - Blocks OK for all 10.
  - `node --check` passes for each file.
  - A script finds that every comment is a `// DE:` / `// EN:` pair.
  - `grep -n "setBrightness" docs/courses/solutions/*.js` shows no matrix brightness above 32.
  - The Harness shows:
    - Ü1: four corner colors and a purple 8x8 square in the middle.
    - Ü2: 16 colored columns.
    - Ü3: off at start, lit after A, off after B.
    - Ü4: the beat gets shorter with A and longer with B.
    - Ü5: wraps around, and A reverses the direction.
    - Ü6: the faster button colors its half, and the next round starts dark.
    - Ü7: a bot that follows the apple misses nothing; with nobody playing, the score shows.
    - Ü8: jumping at x 2 or 3 clears the obstacle, x 4 hits it.
    - Ü9: one ball step every 300 ms, and a bot pressing 4 times a second misses at most 1 ball a minute.
    - Ü10: the side that lets the ball through loses, and the matrix shows the winner's color.
- [x] 2.2 Write the 10 Extra solutions `docs/courses/solutions/NN-name-extra.js` as in D5, each a complete program whose first comment says it is the Extra. Verify Programs OK, Blocks OK, `node --check`, the comment-pair script, and the Harness for each D5 row:
  - Ü2: the rainbow shifts by one column every 100 ms.
  - Ü3: A+B makes 5 color changes.
  - Ü4: the heart is purple at `tempo` ≤ 200.
  - Ü6: an early press gives the round to the other side.
  - Ü7: the pause shrinks with the score, down to 60 ms.
  - Ü8: a second obstacle comes 5 pixels behind, and two jumps clear both.
  - Ü9: an edge hit makes `dx` ±2.
  - Ü10: the first side to 5 points wins, then the game restarts.
  - For Ü1 and Ü5, the frame shows the letter or the car.

## 3. Worksheets (spec: Ten exercises, Worksheet exercises, Block names as in the editor, Worksheet setup, German and English, Gender-neutral wording, Absolute course links; design D2, D4, D6)

- [x] 3.1 Write `docs/courses/uebungen.md` from the draft worksheet with the D4 changes. Each exercise links its main solution and Extra solution, using absolute URLs. Then delete `docs/courses/Matrix-Uebungen-Aufgaben.md` and `docs/courses/Matrix-Uebungen-Loesungen.md`. Verify:
  - Every block name in backticks is a German label from D7's sources.
  - A script maps the functions of each main solution to labels and finds each one in its exercise's list or an earlier one. Exempt are "on start", variable blocks, numbers and arithmetic.
  - The stars never decrease from one exercise to the next.
  - The setup section has the URL, the "show changes" note, the simulator note, the dropdown note and the note for adults.
  - The word check of the spec finds nothing.
  - No link target is relative.
- [x] 3.2 Write `docs/courses/exercises.md`, the English worksheet with the same content. Verify:
  - It has the same headings in the same order, with the same number of bullets and links per exercise as `uebungen.md`.
  - Every block name in backticks is an English label.
  - No link target is relative.

## 4. Overview, README and CHANGELOG (spec: Course overview, Compact README, Absolute course links; design D6)

- [x] 4.1 Write `docs/courses/README.md`, German then English. It holds the exercise table with stars, controls and links to the worksheet sections and solutions, and the two ways to use a solution, including `cd docs/examples && ./build-and-flash.sh ../courses/solutions/03-magic-lamp.js`. Verify:
  - Both sections have the same rows and links.
  - Every `https://github.com/waldbaer/pxt-ledmatrix/blob/main/...` link maps to an existing local file.
  - Every link to a worksheet section matches a heading anchor of that worksheet.
  - The documented command builds and flashes, or reports that no board was found.
- [x] 4.2 In `README.md`, add the course link to the feature-tours line of both sections. Verify:
  - Both line counts of the "Compact README" scenario are at most 130.
  - `git diff README.md` shows only the link changes of 1.4 and these two lines.
  - `grep -o '](\S*)' README.md | grep -v '](https://\|](#'` finds nothing.
- [x] 4.3 CHANGELOG: 0.3.0 is released (tag `0.3.0` on `f920827`), so add a section `[0.4.0]` above it. Under Features, one line for the course, its solutions and `build-and-flash.sh -b`. Under Changes, one line saying that the examples moved to `docs/examples/`, and move the entries for later commits there from `[0.3.0]`: German variables and bilingual README (`7838ed3`) and the user's photo line. Verify that `[0.3.0]` keeps only entries for commits up to its tag, and that `git diff CHANGELOG.md` loses no line.

## 5. Integration checks

- [x] 5.1 Run the full CI equivalent and `openspec validate add-school-courses --strict`. Verify that Build OK, Sim OK and Programs OK all hold, and that the change is valid.
- [x] 5.2 Board check by the user on the Calliope mini 3 with the 16x16 panel. Flash Ü3, Ü6 and Ü9 and the Ü8 Extra with `build-and-flash.sh`, and play them. Verify that each does what its worksheet text says, and that Ü9 can be played.

## Workflow follow-up

- Archive the change after the checks in group 5.
