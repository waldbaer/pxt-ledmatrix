## ADDED Requirements

### Requirement: Shape geometry
A line shape SHALL be drawn with Bresenham's algorithm, both end points included. A rectangle shape SHALL have its top-left pixel at its position: filled, all pixels inside are set; not filled, only the one-pixel border. A width or height of 0 or less SHALL draw nothing. A circle shape SHALL be drawn around its center with the midpoint circle algorithm, filled with its inside. Radius 0 SHALL draw only the center, and a negative radius nothing.

#### Scenario: Diagonal line
- **WHEN** a red line shape from (0, 0) to (7, 7) is stamped on an 8x8 matrix
- **THEN** the drawing layer pixels (i, i) for i = 0..7 are red and no other pixel changes

#### Scenario: Line of one point
- **WHEN** a line shape from (3, 3) to (3, 3) is stamped
- **THEN** only pixel (3, 3) changes

#### Scenario: Rectangle outline
- **WHEN** an unfilled blue 8x8 rectangle shape at (0, 0) is stamped on an 8x8 matrix
- **THEN** `getPixel(0, 7)` is blue and `getPixel(3, 3)` is 0

#### Scenario: Filled rectangle
- **WHEN** a filled 2x3 rectangle shape at (1, 1) is stamped
- **THEN** exactly the 6 pixels with x in 1..2 and y in 1..3 are set

#### Scenario: Empty rectangle
- **WHEN** a rectangle shape with width 0 and one with height -1 are stamped
- **THEN** no pixel changes

#### Scenario: Filled circle
- **WHEN** a filled circle shape at (3, 3) with radius 2 is stamped
- **THEN** (3, 3), (1, 3), (5, 3), (3, 1) and (3, 5) are set and (1, 1) is not set

#### Scenario: Circle of radius 0
- **WHEN** a circle shape at (4, 4) with radius 0 is stamped
- **THEN** only pixel (4, 4) changes

#### Scenario: Negative radius
- **WHEN** a filled circle shape with radius -1 is stamped
- **THEN** no pixel changes

## MODIFIED Requirements

### Requirement: Create shapes
A matrix SHALL create these shapes and return a handle to each: a rectangle `createRectangle(x, y, width, height, color, filled)` positioned at its top-left, a circle `createCircle(x, y, radius, color, filled)` positioned at its center, a line `createLine(x0, y0, x1, y1, color)` positioned at its start point, and a dot `createDot(x, y, color)`.

#### Scenario: Rectangle shape
- **WHEN** a program creates a filled 1x3 white rectangle shape at (7, 2) and calls `show()`
- **THEN** pixels (7, 2), (7, 3), (7, 4) are shown white and the drawing layer is unchanged

#### Scenario: Line keeps its direction
- **WHEN** a line shape from (0, 0) to (3, 1) is moved by (2, 2)
- **THEN** it is drawn from (2, 2) to (5, 3)

### Requirement: Patterns from the grid block
`ledmatrix.grid(...)` SHALL turn a 5x5 grid literal, clicked in the block editor, into a pattern whose lit cells use the pattern color, the color of the pattern shape. Empty rows and columns at the edges SHALL be removed. A grid with no lit cell SHALL become a 1x1 pattern with no lit pixel.

#### Scenario: T piece is trimmed
- **WHEN** a grid has lit cells at (2, 1), (1, 2), (2, 2), (3, 2)
- **THEN** the pattern is 3 wide and 2 high

### Requirement: Pattern shapes
`createPattern(pattern, x, y, color)` SHALL create a pattern shape: a shape that draws the pattern with its top-left at (x, y). Pattern pixels use `color` or their fixed letter color. Off pixels SHALL leave what is below unchanged.

#### Scenario: Pattern shape position
- **WHEN** a 3x2 T pattern becomes a pattern shape at (3, 0)
- **THEN** `x()` = 3, `y()` = 0, `width()` = 3 and `height()` = 2

#### Scenario: Multi-color pattern
- **WHEN** the text pattern `"r.g|.b."` becomes a pattern shape at (0, 18) with color 0 on a 10x20 matrix and is stamped
- **THEN** `getPixel(0, 18)` = 0xFF0000, `getPixel(2, 18)` = 0x00FF00, `getPixel(1, 19)` = 0x0000FF and `getPixel(1, 18)` is unchanged
