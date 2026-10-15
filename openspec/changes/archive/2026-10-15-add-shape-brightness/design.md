# Design

## Context

See proposal.md for the motivation and the delta specs for the required behavior.

Relevant current state:

- The matrix brightness is not applied in TypeScript. `show()` builds the frame `_out` at full intensity, and `_send` hands it to the core's `light.sendWS2812BufferWithBrightness` with `brightness + 1` (`driver.ts`). The test hook receives the same buffer and brightness.
- Every pixel goes through `Matrix._plot(target, x, y, color)` (`main.ts`). Two targets write colors: `_BG` (drawing layer) and `_OUT` (frame). The other three are collision targets: `_MASK` stores `color` as a mark (1 = set, 0 = clear), and `_HIT_BG` and `_HIT_MK` only probe.
- `Shape._render(target, color)` is the one render routine for all shape kinds. `show()` calls it with `_OUT`, `stamp()` with `_BG`, and the collision queries with `_MASK`, `_HIT_BG` and `_HIT_MK`.
- Sprite letter colors are not known to `_render`: `Pattern._drawAt` picks them per pixel and passes them to `_plot` for `_BG` and `_OUT`.
- The README has 119 of its allowed 120 lines.

## Goals / Non-Goals

**Goals:**
- One place applies the shape brightness, so all six shape kinds and the sprite letter colors are covered, and `show()` and `stamp()` agree.
- Collisions and drawing functions behave exactly as before.

**Non-Goals:**
- Changes to `driver.ts`, to how the matrix brightness is applied, or to the send hook.
- New parameters on the drawing primitives (`_line`, `_rect`, `_circle`, `_drawAt`, `_renderText`).

## Decisions

### D1: Shape brightness multiplies, the matrix brightness stays in the driver
A shape's colors are scaled in TypeScript while they are written into the frame. The driver then applies the matrix brightness to the whole frame as before. The matrix brightness therefore remains the overall limit, which matters for power (see the README's current figures).

The two levels multiply: a shape appears at about (matrix / 255) × (shape / 255) of full strength. Both use the 0..255 scale, not percent: 127 and 127 give about a quarter, while 50 and 50 give about 4 %.
*Alternative:* absolute shape brightness, so that a shape at 255 is at full strength while the matrix is at 32. That needs the matrix brightness applied in software for every pixel of every frame and the frame sent at 256. A single block could then bypass the power limit the user set. Rejected.
*Alternative:* scale the color that `show()` passes to `_render`. This misses the sprite letter colors, which `_drawAt` chooses later. Rejected.

### D2: `_plot` scales color targets by a level that `_render` sets
- `Matrix` gets a field `_level` (0..255, 255 = unchanged), initialized to 255.
- `_plot` scales `color` by `_level` only for `_BG` and `_OUT`, and only when `_level < 255`. Each channel becomes `(v * (_level + 1)) >> 8`, the formula the spec already uses for the matrix brightness.
- `Shape._render` sets `m._level = this._brightness` before its `switch` and sets it back to 255 after it.

```
_render(target, color):
    m._level = this._brightness
    switch kind: ... (unchanged)
    m._level = 255
```

Why this works:
- `show()` and `stamp()` both go through `_render`, so stamping the shown colors (spec "Stamp shapes") needs no extra code.
- The collision targets ignore `_level`. Scaling the mask value 1 would turn it into 0 and silently break `overlaps` and `wouldOverlap`, so this restriction is essential.
- The drawing functions of `Matrix` never call `_render`, so they always see `_level = 255`.
- Nothing inside the `switch` can throw or yield to another fiber, so the level is always reset before any other code runs.

*Alternative:* pass the level as a parameter through `_render` to every primitive and to `_drawAt` and `_renderText`. That touches six signatures and every caller. Rejected.
*Alternative:* scale the frame region after `_render`. Shapes may overlap, so the region would include pixels of other shapes. Rejected.

### D3: `setBrightness` on `Shape`
```
setBrightness(brightness):
    this._brightness = Math.clamp(0, 255, brightness | 0)
    this._m._changed()
```
The constructor sets `_brightness = 255`. Like every other setter, it marks the frame as changed even when the value stays the same. No other method touches `_brightness`, so moving, recoloring, hiding and showing, rotating, flipping and the other changes keep it (spec "The shape keeps its brightness"). `setVisible` only flips `_visible`, so a shape that is shown again has its old brightness.

### D4: Block, texts and toolbox position

| | EN | DE |
|---|---|---|
| block | `%shape\|set brightness %brightness` | `%shape\|setze Helligkeit %brightness` |
| tooltip | Set the brightness of the shape (0-255), on top of the matrix brightness. 255 shows its colors unchanged and lower values dim them, also the color letters of a sprite. Stamping copies the dimmed colors. At 0 the shape is black but still covers what is below it and still collides: use "visible" to hide it. | Setzt die Helligkeit der Form (0-255), zusätzlich zur Helligkeit der Matrix. Bei 255 erscheinen ihre Farben unverändert, kleinere Werte dimmen sie, auch die Farbbuchstaben eines Sprites. Stempeln übernimmt die gedimmten Farben. Bei 0 ist die Form schwarz, verdeckt aber weiter, was darunter liegt, und kollidiert weiter: Zum Verstecken "sichtbar" verwenden. |
| `brightness` | brightness from 0 to 255, eg: 128 | Helligkeit von 0 bis 255 |

- `blockId=ledmatrix_shape_set_brightness`, `shape.defl=shape brightness.min=0 brightness.max=255`, group "Shapes", `weight=58 blockGap=8`, not advanced. It sits between "set color" (60) and "visible" (55) in the appearance cluster of the Shapes group.
- The parameter is named `brightness`, as in `Matrix.setBrightness`, so both sliders show the same caption. MakeCode does not translate it, which the extension-package spec already allows.
- The block default is 128, not 255, so a block that was just dropped in shows a visible effect. The TypeScript default stays 255.
- The German tooltip uses no dashes, matching the existing strings.

### D5: README stays within 120 lines
Replace the Shapes line ``* `setColor(color)`, `setVisible(on)` — hidden shapes don't collide or stamp; `bringToFront()` `` with two lines:

```
* `setColor(color)`, `setBrightness(b)` — 0..255, default 255; dims all its colors on top of the matrix brightness
* `setVisible(on)` — hidden shapes don't collide or stamp; `bringToFront()`
```

That gives 119 + 1 = 120 lines, the limit.

### D6: Version and changelog
The version in `pxt.json` stays `0.2.0`. That release is not out yet (only `0.1.0` is tagged), and more features may be added before it. `CHANGELOG.md` gets a bullet under "Features" in the `[0.2.0]` entry that names `setBrightness` for shapes and sprites, that it works on top of the matrix brightness, and that stamping keeps the dimmed colors. Tagging stays a manual step at the release.

### D7: Verification
- `test.ts`: a new test group `shapeBrightness` with every scenario of the two delta specs. It uses `received()` for the LED values after the matrix brightness and `shown()` for the frame bytes. It also checks that drawing after a dimmed shape was shown or stamped stores full colors (`_level` was reset) and that the collision mask is clear after queries on a shape at brightness 0. The brightness setter is added to the "every shape change makes the next show send" check in `testShapes`.
- Build both configs with the MakeCode CLI and run `.github/scripts/sim-test.js` for both, as CI does.
- Run the test build on the Calliope mini 3.
- Build `examples/wiring-check.js` for Calliope mini 1 (`v1`). The `_plot` change is in every program, so check that the hex has not grown noticeably and the README memory note still holds.
- Check the block manually in the German Calliope editor, and look at a dimmed sprite on a real panel.

## Risks / Trade-offs

- [Dim shapes round to black at low matrix brightness: at the default 32, a full channel disappears below shape brightness 8, and darker colors sooner] → This is the same integer scaling the matrix brightness already uses. The tooltip says that the matrix brightness applies on top. Fades use the whole range.
- [`_level` is not reset and later drawing comes out dimmed] → It is set and reset only in `_render`, with no code in between that can throw. A test draws after showing and after stamping a dimmed shape.
- [The collision mask is scaled and collisions break] → `_level` applies only to `_BG` and `_OUT` (D2). The brightness 0 collision scenarios and the mask check cover it.
- [`_plot` is the hot path] → One comparison per color write when nothing is dimmed, three multiplications per pixel of a dimmed shape. Collision queries are unaffected.
- [The README reaches its 120-line limit] → The next change that adds README lines has to make room first.
- [A shape at brightness 0 surprises users because it still covers and collides] → The tooltip says so and points to "visible". It matches how a shape with color black already behaves.

## Migration Plan

None. Every shape starts at brightness 255, and frames of existing programs stay byte for byte the same.
