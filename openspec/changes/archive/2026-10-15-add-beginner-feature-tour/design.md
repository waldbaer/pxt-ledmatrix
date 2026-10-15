# Design

## Context

See proposal.md for the motivation and the delta spec for the required behavior.

- Examples must be plain JavaScript without helper functions with parameters: MakeCode's TypeScript requires parameter types, plain JavaScript forbids them. The existing tours therefore pass values through global variables and use parameterless helpers (`nextScene()`, `step()`, `frame()`).
- `setPattern` replaces a sprite's pattern, so it also undoes an earlier `flip` or `rotate`.
- A shape at brightness 0 is black but still covers and collides.
- `getPixel` reads the drawing layer only, never shapes.
- The README has 120 of its allowed 120 lines; line 27 links the tours.
- A 16x16 panel at full white needs about 2 A at brightness 32. Children often power panels from weak supplies.

## Goals / Non-Goals

**Goals:**
- Readers of the intermediate and advanced tours get the same programs; only the comments change.
- A child can find the code for what the panel shows, using the scene number.

**Non-Goals:**
- Making the tours adapt to other panel sizes: they are laid out for 16x16; the size variables only make the code clearer.
- Sharing code between tours: each file stays self-contained, so it can be pasted into MakeCode on its own.

## Decisions

### D1: Comment format
```
// EN: Move the ball one step to the right.
// DE: Bewege den Ball einen Schritt nach rechts.
ball.moveBy(1, 0)
```
- Every comment is on its own line; continuation lines start with `//     ` so the text lines up.
- File headers: the whole English text under one `// EN:`, then the whole German text under one `// DE:`, each with its own copy of the scene list.
- German uses "du", real umlauts (UTF-8), and the German block names from `_locales/de` in quotes when it refers to a block (e.g. "Änderungen anzeigen", "in die Zeichnung stempeln"), so the comments match the German editor. Terms: drawing layer = "Zeichnung", shape = "Form", pattern = "Muster", sprite = "Sprite".
- *Alternative:* separate German files. Two copies of every program would drift apart. Rejected.

### D2: Renames keep history and code
`git mv` both files, then change only comment lines. Check: the files without comment lines equal the old files without comment lines.

### D3: Beginner tour structure
- Top: `WIDTH`, `HEIGHT`, `PIN`, and `WAIT = 1000` (milliseconds per step). Animation frames pause `WAIT / 5`, so halving `WAIT` halves everything.
- Helpers without parameters: `nextScene()` (deletes all shapes, wrap off, brightness 32, clears, shows the next scene number for one `WAIT`, clears again), `step()` (show, pause `WAIT`), `frame()` (show, pause `WAIT / 5`).
- Each scene is a function whose first comment is `Scene <n>: <title>`; `basic.forever` calls them in order.
- One idea carries the whole tour: the drawing layer is a drawing on a whiteboard (Zeichnung), shapes are magnets on top (Magnete). `clear` wipes the drawing and leaves the magnets; deleting magnets leaves the drawing.
- Scene 1 sets one pixel and waits *without* `show()`: nothing happens. The next step calls `show()`. This teaches the rule every later step relies on.
- Power: no white fills; `fill` only with a dark color; large areas only in dim colors or small bands.

### D4: Beginner scenes

| # | Title | What the child sees | Blocks |
|---|---|---|---|
| 1 | Hello pixel | a pixel appears only after `show`; one pixel per corner, then the center | `create`, `setPixel`, `show` |
| 2 | Drawing | night sky (dark `fill`), green ground line, house (outline rectangle), door (filled), roof (two lines), moon (circle outline, then filled), stars (one pattern drawn three times), then `clear` | `fill`, `drawLine`, `drawRectangle`, `drawCircle`, `drawPattern`, `grid`, `clear` |
| 3 | Colors | red and green squares, then red + green light = yellow; dark vs. bright red; a rainbow band from `hue` | `colors`, `rgb`, `hue` |
| 4 | Numbers | a drawn number (paint), then a number shape counting down 5 to 0 (a magnet that changes) | `drawNumber`, `createNumber`, `setNumber` |
| 5 | Sliding | a picture slides out and is gone; with wrap on it comes back on the other side | `shift`, `setWrap` |
| 6 | Shapes | a rectangle, circle, line and dot appear over a drawn line; the dot steps right; jumps with `setPosition`; walks while `x()` < 12; the rectangle moves to the bottom right corner using its `width()` and `height()`; `clear` keeps the shapes; deleting all shapes keeps the drawing | `createRectangle`, `createCircle`, `createLine`, `createDot`, `moveBy`, `setPosition`, `x`, `y`, `width`, `height`, `removeAllShapes` |
| 7 | Changing shapes | a ball changes color, blinks, fades like a ghost and back; a square and the ball take turns being in front; the line is deleted | `setColor`, `setVisible`, `setBrightness` (shape), `bringToFront`, `remove` |
| 8 | Sprites | an arrow turns four times; a face winks (two patterns); a fish swims to the wall, mirrors itself, swims back | `createSprite`, `grid`, `pattern`, `rotate`, `setPattern`, `flip` |
| 9 | Bumping | a dot meets a box (both change color); a dot walks until a wall; a dot crosses a drawn band and is red while touching it; a car stops one step before another car; a square goes green (inside), yellow (on edge), red (partly outside); footprints are stamped | `overlaps`, `canMoveBy`, `touchesDrawing`, `wouldOverlap`, `isInside`, `isOnEdge`, `stamp` |
| 10 | Secrets | every LED colored by its chain number shows the snake the chain runs; a frame from `matrix.width()` / `height()`; the whole picture dims to 0 and back to 32; a dot takes the color of the pixel above it | `ledIndex`, `width`, `height` (matrix), `setBrightness` (matrix), `getPixel` |

- `setPattern` (wink) and `flip` (fish) use different sprites, because a new pattern would undo the flip.
- The ghost fades to a low value, not 0, so it never turns into a black blob.
- Drawing comes before Colors: the color steps need rectangles, which the child has then seen. Shapes are split into two scenes so no scene has more than about ten steps.

### D5: Checks
- Coverage of the beginner tour: list the method name after every `//% blockId` in the sources and search the tour for each (one-off script, not committed).
- Code check of the beginner tour: search its code lines for `[`, `%`, `>>`, `<<`, `?`, and bitwise `&`, `|`, `^`.
- Every example is built for the Calliope mini 3 with `examples/build-and-flash.sh` and watched on the 16x16 panel.

## Risks / Trade-offs

- [The beginner tour is long: about 3 minutes per loop] → `WAIT` makes it faster; scene numbers let a teacher skip by commenting out calls in `basic.forever`.
- [Bilingual comments double the comment lines and make the advanced tours longer to read] → accepted; the `EN:` / `DE:` tags let a reader skip the other language.
- [The new file names break links from outside the repo] → accepted: the files are examples, not API.
- [German umlauts in comments] → the build in D5 shows whether the MakeCode compiler accepts them; if not, use ae/oe/ue/ss.
