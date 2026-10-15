# Design

## Context

See proposal.md for the motivation and the delta specs for the required behavior. Most of this change is block text, tooltips and toolbox layout, and none of that is in a spec. This document fixes those details so the implementation does not have to guess.

Relevant current state:

- `Shape.canMoveBy` already shifts `_x`/`_y`, queries, and shifts back without calling `_changed()` (`shapes.ts`). `overlaps` never sets the dirty flag either. The archived design (D8) requires that queries never make `show()` send.
- `stamp()` only checks `_removed`, while every collision query checks `_live()` (visible and not removed).
- The toolbox order comes from `//% groups=` on the namespace (`main.ts`), and the order inside a group from `weight`. Blocks are identified by `blockId`, so changing block text, group or weight does not break saved projects.
- The README has 119 of its allowed 120 lines.

## Goals / Non-Goals

**Goals:**
- `wouldOverlap` reuses `overlaps` unchanged, so both always agree.
- The texts below are final. The implementation copies them without rewording.

**Non-Goals:**
- Any change to the render or collision internals (`_render`, `_plot`, the probe targets).
- New block IDs or renamed TypeScript APIs.

## Decisions

### D1: `wouldOverlap` shifts, asks `overlaps`, shifts back
```
wouldOverlap(other, dx, dy):
    if other is missing: return false
    _x += dx | 0; _y += dy | 0
    r = overlaps(other)
    _x -= dx | 0; _y -= dy | 0
    return r
```
This is the pattern `canMoveBy` already uses. All rules of `overlaps` apply automatically: the self, hidden, removed and other-matrix checks, the bounding-box shortcut, wrap-around, and the scratch mask. Nothing in between can throw, so the position is always restored.
*Alternative:* pass an offset through `_render` to every shape kind. That would touch six render paths and `_plot` callers for no gain.

Block and documentation:

| | EN | DE |
|---|---|---|
| block | `%shape\|would overlap %other\|if moved by x %dx\|y %dy` | `%shape\|würde %other berühren\|bei Bewegung um x %dx\|y %dy` |
| tooltip | True if a lit pixel of this shape would be on the same LED as a lit pixel of the other shape after moving by dx, dy. The shape does not move. Hidden and deleted shapes never overlap. | Wahr, wenn ein leuchtendes Pixel dieser Form nach einer Bewegung um dx, dy auf derselben LED läge wie ein leuchtendes Pixel der anderen Form. Die Form bewegt sich dabei nicht. Versteckte und gelöschte Formen überlappen nie. |
| `other` | the shape to check against | die Form, mit der verglichen wird |
| `dx` | pixels to the right (negative = left), eg: 0 | Pixel nach rechts (negativ = links) |
| `dy` | pixels down (negative = up), eg: 1 | Pixel nach unten (negativ = oben) |

`blockId=ledmatrix_shape_would_overlap`, `shape.defl=shape`, group Collisions, `weight=89`, so it sits directly below `can move by` (90). The defaults (0, 1) match `canMoveBy`, because the two are used together.

### D2: Hidden shapes do not stamp
`stamp()` returns early unless `_live()`, the same check the collision queries use. A hidden shape therefore behaves as absent everywhere, while keeping its position.
*Alternative:* keep stamping hidden shapes as an "invisible brush". Rejected: the draw blocks already cover that, and the inconsistency surprises users.

New tooltip:

- **EN:** Copy the shape's lit pixels into the drawing where it is now, e.g. for a landed Tetris piece. This flattens the shape into plain pixels: the drawing does not remember the shape or what was underneath, so a stamp cannot be undone. Only clearing or painting over the drawing removes it. The copy stays when the shape moves and is an obstacle for "can move by" and "touches drawing". Hidden shapes are not stamped.
- **DE:** Kopiert die leuchtenden Pixel der Form an ihrer jetzigen Stelle in die Zeichnung, z. B. bei einem gelandeten Tetris-Stein. Die Form wird dabei zu einfachen Pixeln: Die Zeichnung merkt sich weder die Form noch, was darunter war. Ein Stempel lässt sich deshalb nicht rückgängig machen. Nur Löschen oder Übermalen der Zeichnung entfernt ihn. Die Kopie bleibt liegen, wenn die Form sich bewegt, und ist ein Hindernis für "kann sich bewegen" und "berührt Zeichnung". Versteckte Formen werden nicht gestempelt.

The block text stays as it is ("stamp into drawing" / "in die Zeichnung stempeln"). The German tooltips use no dashes, matching the existing strings.

### D3: `show` block, tooltip and toolbox position
The TypeScript name `show()` stays, because it is the NeoPixel convention (`strip.show()`).

| | EN | DE |
|---|---|---|
| block | `%matrix\|show changes` | `%matrix\|Änderungen anzeigen` |
| tooltip | Show everything drawn or moved since the last show on the LED matrix. Until then the LED matrix doesn't change, so call it e.g. at the end of each loop. | Zeigt alles, was seit dem letzten Mal gezeichnet oder bewegt wurde, auf der LED-Matrix an. Vorher ändert sich die LED-Matrix nicht. Rufe es z. B. am Ende jeder Schleife auf. |

Group order: `["Setup", "Display", "Draw", "Text", "Shapes", "Collisions", "Colors"]`. "Sprites" disappears from the list (D4).
The other tooltips that say "the LEDs" (color byte order, `create` sizes) are about the LED chain and stay as they are.

### D4: One "Shapes" group
Every block in group "Sprites" moves to "Shapes". Weights are renumbered so the group reads create, then move, then sprite actions, then appearance, then delete. `blockGap=8` inside each cluster, and the default gap after the last block of a cluster:

| weight | block | basic / advanced |
|---|---|---|
| 100 | rectangle | basic |
| 98 | circle | basic |
| 96 | line | basic |
| 94 | dot | basic |
| 92 | sprite | basic |
| 90 | pattern (5x5 grid) | basic, end of the create cluster |
| 88 | pattern from text | advanced |
| 80 | move by | basic |
| 75 | set position | basic |
| 70 / 69 | x / y | basic, end of the position cluster |
| 68 / 67 | width / height | advanced |
| 66 | rotate | basic |
| 65 | flip | basic, end of the sprite cluster |
| 64 | set pattern | advanced |
| 60 | set color | basic |
| 55 | visible | basic, end of the appearance cluster |
| 50 | delete | basic |
| 40 | bring to front | advanced |
| 10 | delete all shapes | basic |

Sprite-only blocks keep their `%sprite` parameter and `sprite.defl=sprite`, and `createSprite` keeps `blockSetVariable=sprite`. The number shape blocks stay in "Text". The German `{id:group}Sprites` entry is removed. German keeps the word "Sprite".

### D5: README within 120 lines
- Merge "## Sprites" into the Shapes section by removing its heading and the blank line before it (2 lines saved). Its paragraph and bullets stay.
- Collisions: add the line ``* `wouldOverlap(other, dx, dy)` — would overlap `other` after moving by dx, dy (doesn't move)``.
- Move `stamp()` to its own line: ``* `stamp()` — copy into the drawing layer as plain pixels; can't be undone, hidden shapes don't stamp``.
- Shapes: `setVisible(on)` says "hidden shapes don't collide or stamp".

That gives 119 − 2 + 2 = 119 lines.

### D6: Version and changelog
`pxt.json` goes to `0.2.0`, because the change adds an API and changes one behavior. `CHANGELOG.md` gets a `[0.2.0]` entry with "Features" (`wouldOverlap`) and "Changes" (hidden shapes don't stamp, marked as a behavior change; `show` block text and position; one Shapes group; tooltips). Tagging the release stays a manual step after merging.

### D7: Verification
- `test.ts`: the new matrix-shapes scenarios go into the existing collision tests, reusing the T sprites, the send counter, and the 8x8 wrap matrix. Add `wouldOverlap` to the "queries do not send" check. The hidden-stamp and recolor-then-remove scenarios go into the stamp block.
- Build both configs with the MakeCode CLI and run `.github/scripts/sim-test.js` for both, as CI does.
- Run the test build on the Calliope mini 3.
- Build `examples/wiring-check.js` for Calliope mini 1 (`v1`) to confirm it still fits. Unused methods are not compiled in, so the size should not change noticeably.
- Check the toolbox manually in the German Calliope editor: order, the merged group, the new and changed texts, and that a 0.1.0 project still loads.

## Risks / Trade-offs

- [Programs that stamp hidden shapes change behavior] → marked as a behavior change in the changelog. No example in this repository does it.
- [The merged Shapes group is long: 14 basic blocks] → the weight clusters with gaps keep it scannable, and sprite-only blocks keep "sprite" in their parameter.
- [The block text "show changes" might suggest that the first call shows nothing] → the tooltip says "everything drawn or moved since the last show", and the first show sends everything anyway.
- [The README goes over 120 lines] → D5 counts the budget. Check with `wc -l` before finishing.
- [German strings drift from the code] → the existing completeness check (every `//% block=` and documented parameter has a German key) runs again before finishing.
