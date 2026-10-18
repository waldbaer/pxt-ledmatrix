## RENAMED Requirements

- FROM: `### Requirement: Sprites`
- TO: `### Requirement: Pattern shapes`

- FROM: `### Requirement: Rotate sprites`
- TO: `### Requirement: Rotate pattern shapes`

- FROM: `### Requirement: Flip sprites and swap patterns`
- TO: `### Requirement: Flip pattern shapes and swap patterns`

## MODIFIED Requirements

### Requirement: Shape size
`width()` and `height()` SHALL return the size of a shape's bounding box in pixels: a rectangle's own size, 2r + 1 for a circle, |dx| + 1 by |dy| + 1 for a line, 1 by 1 for a dot, the current pattern size for a pattern shape, and 4n - 1 by 5 for a number shape with n characters (see matrix-fonts).

#### Scenario: Circle size
- **WHEN** a circle shape has radius 2
- **THEN** `width()` = 5 and `height()` = 5

### Requirement: Shape appearance
`setColor(color)` SHALL change a shape's color. Pixels of a pattern shape with a fixed color letter keep their color. `setVisible(false)` SHALL hide a shape: it is not drawn and takes part in no collision until `setVisible(true)`. `bringToFront()` SHALL move a shape to the end of the list so it is drawn above all others.

#### Scenario: Hidden shape
- **WHEN** a shape is hidden
- **THEN** it is not shown and `overlaps` with any other shape returns false

#### Scenario: Bring to front
- **WHEN** the earlier of two overlapping shapes calls `bringToFront()` and the matrix is shown
- **THEN** the shared pixels show that shape's color

### Requirement: Patterns from the grid block
`ledmatrix.grid(...)` SHALL turn a 5x5 grid literal, clicked in the block editor, into a pattern whose lit cells use the pattern color: the `color` given to `drawPattern`, or the color of the pattern shape. Empty rows and columns at the edges SHALL be removed. A grid with no lit cell SHALL become a 1x1 pattern with no lit pixel.

#### Scenario: T piece is trimmed
- **WHEN** a grid has lit cells at (2, 1), (1, 2), (2, 2), (3, 2)
- **THEN** the pattern is 3 wide and 2 high

### Requirement: Patterns from text
`ledmatrix.pattern(text)` SHALL build a pattern of any size. Rows are separated by line breaks or `|`, and spaces, tabs and carriage returns are ignored. `.`, `0` and `_` are off. The letters `r o y g c b p w` (any case) are red, orange, yellow, green, cyan, blue, purple and white. Any other character uses the pattern color. Short rows are padded with off pixels, and the result is trimmed like grid patterns.

#### Scenario: Rows with separator
- **WHEN** a program calls `ledmatrix.pattern(".#.|###")`
- **THEN** the pattern is 3 wide and 2 high with 4 pixels in the pattern color

#### Scenario: Multi-line text
- **WHEN** a program passes a multi-line template string with indented rows
- **THEN** indentation and empty lines are ignored and each non-empty line becomes one row

### Requirement: Pattern shapes
`createPattern(pattern, x, y, color)` SHALL create a pattern shape: a shape that draws the pattern with its top-left at (x, y). Pattern pixels use `color` or their fixed letter color.

#### Scenario: Sprite position
- **WHEN** a 3x2 T pattern becomes a pattern shape at (3, 0)
- **THEN** `x()` = 3, `y()` = 0, `width()` = 3 and `height()` = 2

### Requirement: Rotate pattern shapes
`rotate(direction)` SHALL turn a pattern shape's pattern a quarter turn clockwise ("right") or counter-clockwise ("left") around its center. The position SHALL shift by (old width - new width) / 2 and (old height - new height) / 2, each truncated toward zero, so turning right then left restores the original position. On other shapes it SHALL do nothing.

#### Scenario: T turns right
- **WHEN** a pattern shape with pattern `.#.|###` is rotated right
- **THEN** its pattern is `#.|##|#.` (2 wide, 3 high)

#### Scenario: Round trip keeps position
- **WHEN** a pattern shape with pattern `####` at (3, 5) is rotated right and then left
- **THEN** it is at (4, 4) after the first turn and back at (3, 5), 4 wide and 1 high, after the second

### Requirement: Flip pattern shapes and swap patterns
`flip(axis)` SHALL mirror a pattern shape's pattern horizontally or vertically, keeping its position. `setPattern(pattern)` SHALL replace a pattern shape's pattern, keeping its position. On other shapes both SHALL do nothing.

#### Scenario: Horizontal flip
- **WHEN** a pattern shape with pattern `#..|###` is flipped horizontally
- **THEN** its pattern is `..#|###` and its position is unchanged

### Requirement: Shape overlap
`a.overlaps(b)` SHALL be true exactly when at least one pixel is lit by both shapes at their current positions (pixel-exact, not bounding boxes). With wrap-around on, wrapped pixels count. It SHALL be false if `b` is missing, if `a` and `b` are the same shape, or if either is hidden or removed.

#### Scenario: Boxes overlap, pixels do not
- **WHEN** pattern shape `.#.|###` is at (0, 10) and pattern shape `###|.#.` is at (2, 9)
- **THEN** `overlaps` returns false

#### Scenario: Pixels overlap
- **WHEN** the second pattern shape is then moved by (-1, 1)
- **THEN** `overlaps` returns true

### Requirement: Touching the drawing layer
`touchesDrawing()` SHALL be true exactly when at least one lit pixel of the shape lies inside the matrix on a lit pixel of the drawing layer. Hidden and removed shapes SHALL return false.

#### Scenario: Landed on stamped piece
- **WHEN** a pattern shape lies on pixels that an earlier pattern shape stamped into the drawing layer
- **THEN** `touchesDrawing()` returns true

### Requirement: Can move check
`canMoveBy(dx, dy)` SHALL be true exactly when, after moving by (dx, dy), the shape would be fully inside the matrix (not required with wrap-around on) and would not touch the drawing layer. The shape SHALL NOT move, and the check alone SHALL NOT make the next `show()` send.

#### Scenario: Falling piece lands
- **WHEN** on a 10x20 matrix a 3x2 pattern shape at (3, 0) moves down while `canMoveBy(0, 1)` is true
- **THEN** it stops at y = 18

#### Scenario: Lands on a stamped piece
- **WHEN** that pattern shape is stamped, placed back at (3, 0), and moved down the same way
- **THEN** it stops at y = 16

### Requirement: Overlap after a move
`a.wouldOverlap(b, dx, dy)` SHALL be true exactly when `a.overlaps(b)` would be true with `a` moved by (dx, dy), truncated to integers, and `b` where it is. The rules of `overlaps` apply: pixel-exact, wrapped pixels count with wrap-around on, and false for a missing `b`, for `b` being `a`, for shapes of different matrices, and when either shape is hidden or removed. `a` SHALL NOT move, and the check alone SHALL NOT make the next `show()` send.

#### Scenario: Boxes overlap now, pixels would after the move
- **WHEN** pattern shape `.#.|###` is at (0, 10) and pattern shape `###|.#.` is at (2, 9)
- **THEN** the second pattern shape's `wouldOverlap(first, 0, 0)` is false, its `wouldOverlap(first, -1, 1)` is true, and it is still at (2, 9)

#### Scenario: Check does not send
- **WHEN** a matrix has just been shown and a shape calls `wouldOverlap` with a non-zero offset
- **THEN** its `x()` and `y()` are unchanged and the next `show()` sends nothing

#### Scenario: Hidden shapes never block
- **WHEN** the other shape is hidden
- **THEN** `wouldOverlap` returns false, also for an offset that puts lit pixels of both shapes on the same LED

#### Scenario: Wrap-around
- **WHEN** on an 8x8 matrix with wrap-around on, a dot is at (7, 0) and another dot is at (0, 0)
- **THEN** the first dot's `wouldOverlap(second, 1, 0)` is true, and it is false with wrap-around off

### Requirement: Stamp shapes
`stamp()` SHALL paint the shape's lit pixels into the drawing layer at its current position, following the wrap-around setting. Each pixel SHALL get the color the shape shows it in, with the shape's brightness applied and the matrix brightness not applied. The stamped pixels SHALL be plain drawing-layer pixels that keep no link to the shape. The shape itself SHALL stay. Stamping a hidden or removed shape SHALL do nothing.

#### Scenario: Stamp then move
- **WHEN** a pattern shape is stamped and then moved away
- **THEN** its old pixels remain lit in the drawing layer

#### Scenario: Stamped pixels keep no link to the shape
- **WHEN** a red shape is stamped, then recolored blue and removed
- **THEN** the stamped pixels in the drawing layer are still red

#### Scenario: Hidden shape does not stamp
- **WHEN** a hidden shape is stamped
- **THEN** the drawing layer is unchanged
- **AND** after `setVisible(true)` the next `stamp()` paints its pixels

#### Scenario: Dimmed shape stamps dimmed pixels
- **WHEN** at the default matrix brightness 32 a red dot at (1, 1) calls `setBrightness(127)` and is stamped
- **THEN** `getPixel(1, 1)` returns 0x7F0000

#### Scenario: Stamping at brightness 0 turns pixels off
- **WHEN** pixel (2, 2) is drawn red and a white dot at (2, 2) with brightness 0 is stamped
- **THEN** `getPixel(2, 2)` returns 0

### Requirement: Shape brightness
`setBrightness(b)` SHALL set the brightness of a shape of any kind. `b` is truncated to an integer and clamped to 0..255. New shapes start at 255. When a shape is shown, each color channel v of every pixel it draws, including the fixed color letters of a pattern shape, SHALL be `(v * (b + 1)) >> 8`, so 255 shows the colors unchanged. The matrix brightness SHALL then apply on top, as it does for the drawing layer.

#### Scenario: Default is full brightness
- **WHEN** at matrix brightness 255 a new dot with color 0xFF8000 is shown
- **THEN** its LED receives red = 255, green = 128, blue = 0

#### Scenario: Dimmed shape
- **WHEN** at matrix brightness 255 a dot with color 0xFF8000 calls `setBrightness(127)` and is shown
- **THEN** its LED receives red = 127, green = 64, blue = 0

#### Scenario: Matrix brightness on top
- **WHEN** at the default matrix brightness 32 a dot with color 0xFF0000 calls `setBrightness(127)` and is shown
- **THEN** its LED receives red = 16, green = 0, blue = 0

#### Scenario: Brightness levels multiply
- **WHEN** the matrix brightness is 127 (about half) and a white dot calls `setBrightness(127)` (about half) and is shown
- **THEN** each channel of its LED receives 63, about a quarter of full strength

#### Scenario: Sprite letters are dimmed too
- **WHEN** at matrix brightness 255 a pattern shape with pattern `r#` and color 0x0000FF calls `setBrightness(127)` and is shown
- **THEN** the LED of its left pixel receives 0x7F0000 and the LED of its right pixel receives 0x00007F

#### Scenario: Clamping and truncation
- **WHEN** at matrix brightness 255 a dot with color 0xFF8000 calls `setBrightness(300)`, `setBrightness(127.9)` or `setBrightness(-5)` and is shown
- **THEN** its LED receives 0xFF8000, 0x7F4000 or 0x000000 respectively
