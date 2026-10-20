# Design

## Context

See proposal.md for the motivation and the delta specs for the required behavior.

MakeCode facts, checked on 2026-10-20:

- `makecode search ledmatrix` on makecode.calliope.cc finds nothing. "LED-Matrix" finds other extensions (ColorBit, pxt-luma-matrix).
- Labels in the German Calliope editor:
  - From the cached target's `core-strings.json`: `wenn Knopf A geklickt`, `zeige Nummer`, `wähle eine zufällige Zahl von … bis …`, `wenn Pin P1 gedrückt` and `Button A ist gedrückt`.
  - From the editor strings (`api/translations?lang=de&filename=strings.json`): `während`, `für index von 0 bis …`, `wenn … dann`, `oder`, `beim Start`, and the toolbox subcategory `mehr`.
  - The English labels come from the block annotations, for example `pick random … to …` and the events `clicked` and `pressed down`.

State of the draft (untracked `courses/Matrix-Uebungen-Aufgaben.md` and `courses/Matrix-Uebungen-Loesungen.md`):

- All 10 solutions compile for the Calliope mini 1, 2 and 3 and convert to Blocks without grey blocks.
- Headless runs confirmed the task text for every solution except Ü3, whose lamp starts red.
- Measured with bot players (see D7):
  - Ü9 at 200 ms per ball step: 7 to 10 misses per minute when pressing 4 times a second. At 300 ms: 0 to 1.
  - Ü10 at 250 ms: 0 to 4 goals per minute, which is fine for a duel.

Repository:

- README sections have 126 (DE) and 120 (EN) lines since commits `505c8bd` and `05ee5bb`.
- Commit `7d3e702` added `docs/images/` with the photo the README shows.
- `examples/build-and-flash.sh` accepts any file path. It builds into `<its folder>/built/<name>/` and then always tries to flash. It takes the repo as its folder's parent. A build takes about 1.2 s once the target is cached.
- CI builds the extension and runs `test.ts` in both simulators. It builds no example.

## Goals / Non-Goals

**Non-Goals:**
- MakeCode tutorials. The user dropped them during implementation.
- Blocks conversion checks and behavior tests in CI. They run during implementation (D7) and could become a later change.
- Claiming the course runs on the micro:bit.
- Languages other than German and English.
- Getting the extension into MakeCode search.

## Decisions

### D1: Everything for readers in `docs/`
```
docs/
  images/                           photos for the README (exists)
  examples/                         moved from examples/: tours, wiring check,
                                    build-and-flash.sh, build-all.sh
  courses/
    README.md                       overview, DE then EN
    uebungen.md                     worksheet DE
    exercises.md                    worksheet EN
    solutions/NN-name.js            main solution  (10)
    solutions/NN-name-extra.js      Extra solution (10)
```
The user chose `docs/` once it held the README images. The examples (for makers) and the course (for teachers and pupils) stay apart as siblings.

*Alternatives:*
- A top-level `courses/`, the earlier plan. It was replaced by the user's choice.
- `examples/courses/`. Rejected: it mixes the examples' rules (three tours, tours cover every block) with the course's rules.

### D2: Exercises and names
| NN-name | Deutsch | English | Stars | Controls |
|---|---|---|---|---|
| 01-first-picture | Mein erstes Bild | My first picture | 1 | – |
| 02-rainbow | Regenbogen | Rainbow | 1 | – |
| 03-magic-lamp | Zauberlampe | Magic lamp | 1 | A, B |
| 04-beating-heart | Klopfendes Herz | Beating heart | 2 | A, B |
| 05-running-arrow | Laufband | Running arrow | 2 | A, B |
| 06-reaction-duel | Reaktions-Duell | Reaction duel | 2 | A against B |
| 07-apple-catcher | Apfelfänger | Apple catcher | 3 | A, B |
| 08-jump-game | Hüpf-Spiel | Jump game | 3 | A |
| 09-pong-solo | Pong für eine Person | Pong for one | 4 | A, B |
| 10-pong-duo | Pong zu zweit | Pong for two | 4 | A, B, P1, P2 |

File names are English, like the examples.

### D3: One solution file for both languages
Comments come in `// DE:` / `// EN:` pairs, and the variables are German: `farbe`, `herz`, `korb`, `figur`, `schlaeger`. The extension proposes German variables in every editor language anyway.

A shape created in an event handler is declared at the top as `let haelfte = null`. This is plain JavaScript, compiles, and converts to Blocks; all three were tested. Each comment becomes a block comment, so a program has its first comment and only a few others.

*Alternative:* separate English solutions with English variables. Rejected: twice the files for the same programs.

### D4: Worksheet changes against the draft
| Where | Change |
|---|---|
| Setup | The extension is added by URL. A shape block's dropdown: pick your shape. "set wiring" is under "mehr" / "more". |
| Ü2 | The loop variable is `index`, as the tip says. |
| Ü3 | The lamp starts off: no `fill` on start. |
| Ü6 | `während` and `wähle eine zufällige Zahl von … bis …`. The heading says "zu zweit". The variable `sieger` becomes `haelfte`. |
| Ü7–Ü9 | Block lists follow the spec rule. Missing so far: `x`/`y`, `setze Position`, `bewege um`, `kann sich um … bewegen`, `zeige Nummer`, `wähle eine zufällige Zahl` and `oder`. |
| Ü8 | `spieler` becomes `figur`. New Extra: "sometimes two obstacles come close together: jump twice", about 5 pixels apart. With `luft` = 3 the figure is in the air for two steps, so two neighboring obstacles need one exact press, and a one-pixel gap can never be cleared. |
| Ü9 | The ball takes one step every 300 ms (measured, see Context). |
| Ü10 | "Person 1 / Person 2", and "in der Farbe der Seite, die gewonnen hat". The ball still restarts towards the side that lost. |
| Every exercise | Links to its main solution and Extra solution. |

The draft worksheet becomes `uebungen.md`. `exercises.md` is translated from it. The draft solutions file is dropped once its code is in `solutions/`.

### D5: Extra solutions
| NN | Extra solution |
|---|---|
| 01 | an initial letter from `setPixel` |
| 02 | a moving rainbow: stamp the lines, delete the shapes, turn on wrap-around, shift every 100 ms (tested) |
| 03 | A+B: five quick color changes |
| 04 | the heart turns purple when `tempo` ≤ 200, and red again above that |
| 05 | a car pattern instead of the arrow |
| 06 | a state variable (waiting / go / over); pressing during "waiting" gives the round to the other side |
| 07 | the pause shrinks with the score: 200 − 10 × points, at least 60 ms |
| 08 | sometimes a second obstacle follows 5 pixels behind |
| 09 | a hit on the paddle's outer pixel sets `dx` to ±2, a hit in the middle sets ±1 |
| 10 | points for each side, shown after each goal; the first to 5 wins, then the game restarts |

### D6: Links
- All course links are absolute `https://github.com/waldbaer/pxt-ledmatrix/blob/main/...` URLs. The overview links worksheet sections by GitHub's heading anchors.
- The main README adds its course link to the existing feature-tours line in each section, so it gains no lines.
- The README's four links to `examples/` (folder, tours, wiring check, in both sections) point to `docs/examples/`.

### D7: Build in CI, checks during implementation
- `build-and-flash.sh` gets `-b` / `--build-only`, which stops after the `hex:` line. Existing calls stay the same.
- Both scripts take the repo as two folders above their own, since they now live in `docs/examples/`.
- New `docs/examples/build-all.sh` builds with `-b`:
  - every `docs/examples/*.js` for `v3` and `microbit`, plus `v1` and `v2` when its first comment contains "Runs on the Calliope mini 1, 2 and 3";
  - every `docs/courses/solutions/*.js` for `v1`, `v2` and `v3`.
- `build-all.sh` prints each program with its boards, collects failures as `FAIL <program> <board>`, and exits non-zero if there are any.
- `test.yml` gets a job `programs` that runs it, with the same Node and `MAKECODE_CLI` as the other jobs. About 70 builds take a few minutes.
- *Alternative:* a loop written in the YAML. Rejected: it could not be run locally.
- *Alternative:* only the Calliope mini 3. Rejected: it would not check the course's mini 1 and 2 claim.

The checks during implementation use scripts in the session scratchpad (`/tmp/claude-1000/-home-seb-Projects-calliope-pxt-ledmatrix/47e1c5b0-4414-4027-9671-4b635111d649/scratchpad/scripts/`):

- **Blocks check** (`blocks-check.sh`, `decompile.js`): calls the Calliope worker's `decompile` operation through `makecode-core` and counts `typescript_statement` and `typescript_expression` blocks. A negative control proved that it detects grey blocks.
- **Behavior check** (`sim.js`, `check-main.js`, `check-extra.js`): the real extension sources, transpiled with TypeScript, run with stubbed `basic` and `input`, a virtual clock, scripted presses and bot players. Frames from `_sendHook` print as ASCII.
- **Comment pairs** (`check-comments.py`).
- **Worksheets** (`labels.py`, `check-worksheet.py`):
  - Block names are checked against the labels. German labels come from the target's `core-strings.json`, the editor strings API and `_locales/de/ledmatrix-strings.json`; English labels from the block annotations.
  - The block-list rule, stars, links and the word check are checked too.
  - Negative tests proved that it finds wrong labels, missing blocks and gendered words.

If the scratchpad is gone, rebuild the scripts as described, or check by hand in the editor and on the board.

## Risks / Trade-offs

- [The harness models the runtime, not the device] → The user runs a final check on the board.
- [Board detection depends on a phrase in the first comment] → `build-all.sh` documents the phrase and prints the boards of each program. Tour 1 is a scenario in the spec.
- [The overview's links to worksheet sections depend on GitHub's heading anchors] → The anchors are computed with GitHub's rule, and a heading change needs a matching link change.
