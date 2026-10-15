# matrix-shapes Specification

## Purpose

Provides retained, movable shapes and pattern-based sprites that are drawn on top of the drawing layer, together with pixel-exact collision queries. This makes simple games (pong, falling blocks) possible without redrawing everything every frame.

## Requirements

### Requirement: Shapes are drawn on top of the drawing layer
A matrix SHALL keep a list of shapes that `show()` draws on top of the drawing layer every time, in list order, so that later shapes cover earlier ones. New shapes SHALL be added at the end of the list. Shapes SHALL NOT change the drawing layer, so moving a shape never erases drawn pixels.

#### Scenario: Moving does not erase
- **WHEN** pixel (2, 2) is drawn red, a shape covering (2, 2) is moved away, and `show()` is called
- **THEN** pixel (2, 2) shows red again

#### Scenario: Later shape on top
- **WHEN** two shapes of different colors cover the same pixel
- **THEN** the pixel shows the color of the shape created later

### Requirement: Create shapes
A matrix SHALL create these shapes and return a handle to each: a rectangle `createRectangle(x, y, width, height, color, filled)` positioned at its top-left, a circle `createCircle(x, y, radius, color, filled)` positioned at its center, a line `createLine(x0, y0, x1, y1, color)` positioned at its start point, and a dot `createDot(x, y, color)`. Shapes are drawn with the same rules as the drawing primitives.

#### Scenario: Rectangle shape
- **WHEN** a program creates a filled 1x3 white rectangle shape at (7, 2) and calls `show()`
- **THEN** pixels (7, 2), (7, 3), (7, 4) are shown white and the drawing layer is unchanged

#### Scenario: Line keeps its direction
- **WHEN** a line shape from (0, 0) to (3, 1) is moved by (2, 2)
- **THEN** it is drawn from (2, 2) to (5, 3)

### Requirement: Move shapes
`moveBy(dx, dy)` SHALL move a shape relative to its position, and `setPosition(x, y)` SHALL place its reference point (top-left, center, start point or the dot itself) at (x, y). `x()` and `y()` SHALL return the reference point. Coordinates are truncated to integers. Shapes SHALL be allowed to lie partly or fully outside the matrix.

#### Scenario: Move and read back
- **WHEN** a circle shape at (1, 3) is moved by (2, -1)
- **THEN** `x()` = 3 and `y()` = 2

### Requirement: Shape size
`width()` and `height()` SHALL return the size of a shape's bounding box in pixels: a rectangle's own size, 2r + 1 for a circle, |dx| + 1 by |dy| + 1 for a line, 1 by 1 for a dot, the current pattern size for a sprite, and 4n - 1 by 5 for a number shape with n characters (see matrix-fonts).

#### Scenario: Circle size
- **WHEN** a circle shape has radius 2
- **THEN** `width()` = 5 and `height()` = 5

### Requirement: Shape appearance
`setColor(color)` SHALL change a shape's color. Sprite pixels with a fixed color letter keep their color. `setVisible(false)` SHALL hide a shape: it is not drawn and takes part in no collision until `setVisible(true)`. `bringToFront()` SHALL move a shape to the end of the list so it is drawn above all others.

#### Scenario: Hidden shape
- **WHEN** a shape is hidden
- **THEN** it is not shown and `overlaps` with any other shape returns false

#### Scenario: Bring to front
- **WHEN** the earlier of two overlapping shapes calls `bringToFront()` and the matrix is shown
- **THEN** the shared pixels show that shape's color

### Requirement: Remove shapes
`remove()` SHALL delete a shape from its matrix: from the next `show()` on it is not drawn, and it takes part in no collision. `removeAllShapes()` SHALL delete every shape of the matrix. Neither SHALL change the drawing layer, so pixels stamped earlier stay.

#### Scenario: Removed shapes do not collide
- **WHEN** two overlapping shapes exist and one of them is removed
- **THEN** `overlaps` returns false in both directions

#### Scenario: Stamped pixels stay
- **WHEN** a shape is stamped and then removed
- **THEN** its stamped pixels remain in the drawing layer

### Requirement: Patterns from the grid block
`ledmatrix.grid(...)` SHALL turn a 5x5 grid literal, clicked in the block editor, into a pattern whose lit cells use the sprite color. Empty rows and columns at the edges SHALL be removed. A grid with no lit cell SHALL become a 1x1 pattern with no lit pixel.

#### Scenario: T piece is trimmed
- **WHEN** a grid has lit cells at (2, 1), (1, 2), (2, 2), (3, 2)
- **THEN** the pattern is 3 wide and 2 high

### Requirement: Patterns from text
`ledmatrix.pattern(text)` SHALL build a pattern of any size. Rows are separated by line breaks or `|`, and spaces, tabs and carriage returns are ignored. `.`, `0` and `_` are off. The letters `r o y g c b p w` (any case) are red, orange, yellow, green, cyan, blue, purple and white. Any other character uses the sprite color. Short rows are padded with off pixels, and the result is trimmed like grid patterns.

#### Scenario: Rows with separator
- **WHEN** a program calls `ledmatrix.pattern(".#.|###")`
- **THEN** the pattern is 3 wide and 2 high with 4 pixels in the sprite color

#### Scenario: Multi-line text
- **WHEN** a program passes a multi-line template string with indented rows
- **THEN** indentation and empty lines are ignored and each non-empty line becomes one row

### Requirement: Sprites
`createSprite(pattern, x, y, color)` SHALL create a shape that draws the pattern with its top-left at (x, y). Pattern pixels use `color` or their fixed letter color.

#### Scenario: Sprite position
- **WHEN** a 3x2 T pattern becomes a sprite at (3, 0)
- **THEN** `x()` = 3, `y()` = 0, `width()` = 3 and `height()` = 2

### Requirement: Rotate sprites
`rotate(direction)` SHALL turn a sprite's pattern a quarter turn clockwise ("right") or counter-clockwise ("left") around its center. The position SHALL shift by (old width - new width) / 2 and (old height - new height) / 2, each truncated toward zero, so turning right then left restores the original position. On other shapes it SHALL do nothing.

#### Scenario: T turns right
- **WHEN** a sprite with pattern `.#.|###` is rotated right
- **THEN** its pattern is `#.|##|#.` (2 wide, 3 high)

#### Scenario: Round trip keeps position
- **WHEN** a sprite with pattern `####` at (3, 5) is rotated right and then left
- **THEN** it is at (4, 4) after the first turn and back at (3, 5), 4 wide and 1 high, after the second

### Requirement: Flip sprites and swap patterns
`flip(axis)` SHALL mirror a sprite's pattern horizontally or vertically, keeping its position. `setPattern(pattern)` SHALL replace a sprite's pattern, keeping its position. On other shapes both SHALL do nothing.

#### Scenario: Horizontal flip
- **WHEN** a sprite with pattern `#..|###` is flipped horizontally
- **THEN** its pattern is `..#|###` and its position is unchanged

### Requirement: Shape overlap
`a.overlaps(b)` SHALL be true exactly when at least one pixel is lit by both shapes at their current positions (pixel-exact, not bounding boxes). With wrap-around on, wrapped pixels count. It SHALL be false if `b` is missing, if `a` and `b` are the same shape, or if either is hidden or removed.

#### Scenario: Boxes overlap, pixels do not
- **WHEN** sprite `.#.|###` is at (0, 10) and sprite `###|.#.` is at (2, 9)
- **THEN** `overlaps` returns false

#### Scenario: Pixels overlap
- **WHEN** the second sprite is then moved by (-1, 1)
- **THEN** `overlaps` returns true

### Requirement: Touching the drawing layer
`touchesDrawing()` SHALL be true exactly when at least one lit pixel of the shape lies inside the matrix on a lit pixel of the drawing layer. Hidden and removed shapes SHALL return false.

#### Scenario: Landed on stamped piece
- **WHEN** a sprite lies on pixels that an earlier sprite stamped into the drawing layer
- **THEN** `touchesDrawing()` returns true

### Requirement: Can move check
`canMoveBy(dx, dy)` SHALL be true exactly when, after moving by (dx, dy), the shape would be fully inside the matrix (not required with wrap-around on) and would not touch the drawing layer. The shape SHALL NOT move, and the check alone SHALL NOT make the next `show()` send.

#### Scenario: Falling piece lands
- **WHEN** on a 10x20 matrix a 3x2 sprite at (3, 0) moves down while `canMoveBy(0, 1)` is true
- **THEN** it stops at y = 18

#### Scenario: Lands on a stamped piece
- **WHEN** that sprite is stamped, placed back at (3, 0), and moved down the same way
- **THEN** it stops at y = 16

### Requirement: Overlap after a move
`a.wouldOverlap(b, dx, dy)` SHALL be true exactly when `a.overlaps(b)` would be true with `a` moved by (dx, dy), truncated to integers, and `b` where it is. The rules of `overlaps` apply: pixel-exact, wrapped pixels count with wrap-around on, and false for a missing `b`, for `b` being `a`, for shapes of different matrices, and when either shape is hidden or removed. `a` SHALL NOT move, and the check alone SHALL NOT make the next `show()` send.

#### Scenario: Boxes overlap now, pixels would after the move
- **WHEN** sprite `.#.|###` is at (0, 10) and sprite `###|.#.` is at (2, 9)
- **THEN** the second sprite's `wouldOverlap(first, 0, 0)` is false, its `wouldOverlap(first, -1, 1)` is true, and it is still at (2, 9)

#### Scenario: Check does not send
- **WHEN** a matrix has just been shown and a shape calls `wouldOverlap` with a non-zero offset
- **THEN** its `x()` and `y()` are unchanged and the next `show()` sends nothing

#### Scenario: Hidden shapes never block
- **WHEN** the other shape is hidden
- **THEN** `wouldOverlap` returns false, also for an offset that puts lit pixels of both shapes on the same LED

#### Scenario: Wrap-around
- **WHEN** on an 8x8 matrix with wrap-around on, a dot is at (7, 0) and another dot is at (0, 0)
- **THEN** the first dot's `wouldOverlap(second, 1, 0)` is true, and it is false with wrap-around off

### Requirement: Inside and edge tests
`isInside()` SHALL be true when the shape's whole bounding box is within the matrix. `isOnEdge()` SHALL be true when the bounding box touches or crosses any border of the matrix.

#### Scenario: On the edge
- **WHEN** a circle shape with radius 1 is at (5, 1) on an 8x8 matrix
- **THEN** `isInside()` is true and `isOnEdge()` is true

### Requirement: Stamp shapes
`stamp()` SHALL paint the shape's lit pixels in their colors into the drawing layer at its current position, following the wrap-around setting. The stamped pixels SHALL be plain drawing-layer pixels that keep no link to the shape. The shape itself SHALL stay. Stamping a hidden or removed shape SHALL do nothing.

#### Scenario: Stamp then move
- **WHEN** a sprite is stamped and then moved away
- **THEN** its old pixels remain lit in the drawing layer

#### Scenario: Stamped pixels keep no link to the shape
- **WHEN** a red shape is stamped, then recolored blue and removed
- **THEN** the stamped pixels in the drawing layer are still red

#### Scenario: Hidden shape does not stamp
- **WHEN** a hidden shape is stamped
- **THEN** the drawing layer is unchanged
- **AND** after `setVisible(true)` the next `stamp()` paints its pixels
