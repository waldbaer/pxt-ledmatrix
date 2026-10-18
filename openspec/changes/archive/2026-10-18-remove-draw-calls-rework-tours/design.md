# Design

## Context

See proposal.md for the motivation and the delta specs for the required behavior.

Relevant current state:

- The five `draw*` methods (`main.ts`, groups Draw and Text) call `_line`, `_rect`, `_circle`, `Pattern._drawAt` and `_renderText` with target `_BG`. `Shape._render` calls the same routines, and `stamp()` renders to `_BG`. New shapes have brightness 255, so create, stamp and remove paint exactly what the `draw*` call painted.
- The `stamp` block is in the Collisions group (weight 75).
- Uses of the five calls: `test.ts` 28 (in `testShapesDrawn`, `testPatterns`, `testShapeBrightness`, `testNumbers`), the tours 47, `wiring-check.js` 1, the README quick start and 5 list lines, and in `_locales/de` 5 block and 23 jsdoc strings.
- Advanced blocks (shown under "more"): `setLayout`, `setColorOrder`, `ledIndex`, `getPixel`, `pattern`, `bringToFront`, `setPattern`, a shape's `width` and `height`.
- Tours: beginner 723, intermediate 166, advanced 369 lines. The beginner and advanced tours need a Calliope mini 3.
- The README has 120 of its allowed 120 lines. 0.2.0 is tagged.
- A delta spec cannot change a Purpose.

## Goals / Non-Goals

**Goals:**
- `git grep -E 'draw(Line|Rectangle|Circle|Pattern|Number)'` finds nothing outside `openspec/` and the CHANGELOG.

**Non-Goals:**
- Compatibility with 0.2.0 projects: no alias, no hidden deprecated blocks.
- Resize setters for shapes.
- Changing the rendering routines or any pixel a shape paints.

## Decisions

### D1: Delete the calls
Delete the five methods with their blocks, doc comments and German strings. The internal routines stay unchanged; shapes and `stamp()` still use them.
*Alternative:* `//% deprecated=true` hides the blocks but keeps old projects compiling. It keeps five functions with their specs, tests and translations alive, the opposite of the goal. Rejected.

### D2: `stamp` moves to the Draw group
`group="Draw"`, weight 90 (right after "set pixel"). The tooltip gets one sentence: this is how lines, rectangles, circles, patterns and numbers get into the drawing. A child looking for "draw a rectangle" opens Draw and finds the block that paints a shape.
*Alternative:* keep it in Collisions, where it was the tool for landed pieces. Draw would then show only pixel blocks. Rejected.

### D3: The Text group stays
It keeps `createNumber` and `setNumber`. matrix-fonts plans letters and scrolling text.
*Alternative:* merge into Shapes. Rejected: the group would be split again when text arrives.

### D4: Tests port each scenario one to one
Each former `draw*` check becomes create, `stamp()`, `getPixel`, `remove()`, with the same coordinates and expected pixels. `testShapesDrawn` becomes `testShapeGeometry` with run name `shapeGeometry`, after the new requirement. `testNumbers` keeps its name and checks stamped number shapes. The one `drawRectangle` in `testShapeBrightness` becomes `setPixel`.

### D5: Shared tour skeleton
All three tours start the same way: `WIDTH`, `HEIGHT`, `PIN` at the top, `create`, then `nextScene()` (remove all shapes, clear, show the scene number as a number shape; tours 2 and 3 also turn wrap off and set brightness 32), `step()` and, in tours 2 and 3, `frame()`. Tour 1 writes its scenes directly in the loop, each marked with its number, and frames its setup, helpers and scenes with separator lines (`//` and dashes). Comments are `// EN:` / `// DE:` pairs. Tour 1 has a comment before every step; tours 2 and 3 have one per scene and one per non-obvious line.

### D6: What each tour shows
Complexity grows from tour to tour: tour 1 uses only its thirteen blocks, tour 2 no advanced block, tour 3 all advanced blocks. Each block appears in at least one tour. Basic blocks may move between tours 2 and 3 during implementation if coverage holds.

| Tour | Scenes | Blocks it is the main user of |
|---|---|---|
| 1 beginner (pupils 10 to 12) | hello pixel, colors, lines, a moving box, counting | `create`, `show`, `setPixel`, `colors`, `rgb`, `fill`, `clear`, `createLine`, `createRectangle`, `moveBy`, `removeAllShapes`, `createNumber`, `setNumber`, and no other |
| 2 intermediate | picture from shapes (house at night), moving and changing shapes, pattern shapes, scrolling rainbow, ball in a stamped frame, bumping | `hue`, `createCircle`, `createLine`, `createDot`, `setPosition`, `x`, `y`, matrix `width`/`height`, `setColor`, `setVisible`, shape `setBrightness`, `remove`, `grid`, `createPattern`, `rotate`, `flip`, `setWrap`, `shift`, matrix `setBrightness`, `overlaps`, `touchesDrawing`, `canMoveBy`, `stamp` |
| 3 advanced | secrets of the matrix, invaders, pong | `ledIndex`, `getPixel`, `pattern`, `setPattern`, `bringToFront`, shape `width`/`height`, `wouldOverlap`, `isInside`, `isOnEdge` |

Tour 3's first scene shows the advanced pixel blocks: the LED chain with `ledIndex` and a chameleon dot with `getPixel`. Its games use only shapes and stamping. It keeps today's invaders game, shortened. Pong has two paddles that steer themselves, a ball that bounces off them with `wouldOverlap`, and a score per side as number shapes.

### D7: Line limits
150 / 250 / 300 lines. Tour 1 explains every step in two languages, so it has five short scenes. Tours 2 and 3 explain per scene. Each scene shows one idea; scenes that only repeated an idea are dropped.

### D8: Boards
After the tours are written, each is built for the Calliope mini 3, mini 1 (`v1`) and the micro:bit. The first comment names the boards whose build fits.

### D9: Wiring check
One number shape is created before the loop and gets `setNumber(laps)` after each lap, centered as before. It must still build for the Calliope mini 1 and the micro:bit. If its flash size changes, the README's "about 15 KB" changes with it.

### D10: README and CHANGELOG
- README: the quick start uses a rectangle shape and a number shape. The Draw list drops the four `draw*` lines and says that `stamp()` paints shapes into the drawing. The Text list drops `drawNumber`. The tour links point to the new files. It stays at 120 lines or fewer.
- CHANGELOG: a new `## [0.3.0]` entry without a date. The release adds the date, bumps `pxt.json` and tags. Under "Changes", one **Breaking** line lists the removed calls with their replacement, and one says that the tours were rewritten and renamed.
- `build-and-flash.sh`: the usage comment names `feature-tour-2.js`.

## Risks / Trade-offs

- [Projects using the removed blocks break when updated] → MakeCode pins the extension version per project. The CHANGELOG gives the replacement for each call.
- [Programs that paint figures every frame now create, stamp and remove a shape each time] → The tours animate by moving and changing shapes instead, as the library intends.
- [A stale German key falls back to English without an error] → Compare the `.ts` blocks, documented functions and `@param`s with the keys by script, as in the previous change.
- [Tours 2 and 3 may not fit the Calliope mini 1] → D8 measures each tour, and the first comment says what fits.

## Migration Plan

After archiving, edit the Purpose of `openspec/specs/matrix-drawing/spec.md` directly: "Provides a persistent drawing layer per matrix, the pixel operations that change it, and the color helpers. Shapes are drawn on top of it and can be stamped into it." Then run `openspec validate --specs --strict`.

## Open Questions

- The exact steps of each scene, within D6 and the line limits.
