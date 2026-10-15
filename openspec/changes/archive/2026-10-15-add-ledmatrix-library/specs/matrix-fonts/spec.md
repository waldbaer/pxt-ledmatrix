# Spec Delta

## Purpose

Renders text-like content on a matrix using small bitmap fonts sized for LED panels. The content is either painted into the drawing layer or shown as shapes that take part in z-order and collisions. The first version handles integers in a 3x5 digit font. Letters, more glyph sets and scrolling text are meant to extend this capability later.

## ADDED Requirements

### Requirement: Draw numbers
`drawNumber(value, x, y, color)` SHALL draw the decimal form of `value` into the drawing layer using the 3x5 digit font, with the top-left of the first character at (x, y). The value SHALL be truncated toward zero to an integer. A negative result SHALL be drawn with a leading minus sign, and zero SHALL be drawn as a single `0`.

#### Scenario: Positive number
- **WHEN** a program calls `drawNumber(42, 0, 0, 0xFFFFFF)` on a 16x16 matrix
- **THEN** the glyph `4` occupies columns 0..2, column 3 is untouched, and the glyph `2` occupies columns 4..6, all in rows 0..4

#### Scenario: Negative number
- **WHEN** a program calls `drawNumber(-7, 0, 0, 0xFF0000)`
- **THEN** the minus glyph occupies columns 0..2 and the glyph `7` occupies columns 4..6

#### Scenario: Non-integer value
- **WHEN** a program calls `drawNumber(3.9, 0, 0, 0xFFFFFF)` and `drawNumber(-0.5, 8, 0, 0xFFFFFF)`
- **THEN** the first call draws `3` and the second draws `0` without a minus sign

### Requirement: Digit font metrics
Every character of the digit font SHALL be 3 pixels wide and 5 pixels high, and adjacent characters SHALL be separated by exactly 1 empty column. A number with n characters (including a minus sign) therefore occupies 4n - 1 columns and 5 rows. Glyphs SHALL NOT be trimmed, so every digit has the same width.

#### Scenario: Width of a four-digit number
- **WHEN** a program draws `2048` at (0, 0)
- **THEN** the drawn characters lie within columns 0..14 and rows 0..4

#### Scenario: Narrow digit keeps its width
- **WHEN** a program draws `11` at (0, 0)
- **THEN** the second `1` starts at column 4, exactly as any other second digit would

### Requirement: Digit glyphs
The digit font SHALL use these glyphs (`#` lit, `.` not painted), in rows from top to bottom:

```
 0    1    2    3    4    5    6    7    8    9    -
###  .#.  ###  ###  #.#  ###  ###  ###  ###  ###  ...
#.#  ##.  ..#  ..#  #.#  #..  #..  ..#  #.#  #.#  ...
#.#  .#.  ###  .##  ###  ###  ###  ..#  ###  ###  ###
#.#  .#.  #..  ..#  ..#  ..#  #.#  ..#  #.#  ..#  ...
###  ###  ###  ###  ..#  ###  ###  ..#  ###  ###  ...
```

#### Scenario: Glyph of 4
- **WHEN** a program draws `4` at (0, 0) in white on a cleared matrix
- **THEN** pixels (0,0), (2,0), (0,1), (2,1), (0,2), (1,2), (2,2), (2,3), (2,4) are white and all other pixels in columns 0..2, rows 0..4 are off

### Requirement: Only lit pixels are painted
Drawing a number SHALL only paint the lit pixels of its glyphs. All other pixels of the drawing layer, including the gaps and the unlit parts of glyphs, SHALL stay unchanged. Pixels outside the matrix SHALL follow the wrap-around setting like all other drawing.

#### Scenario: Background stays
- **WHEN** the drawing layer is filled blue and a program draws `1` in white at (0, 0)
- **THEN** pixel (0, 0) (unlit in the glyph `1`) is still blue

#### Scenario: Updating a counter
- **WHEN** a program draws `10` at (0, 0), then clears the area with a filled black rectangle and draws `9` at (0, 0)
- **THEN** only the glyph `9` is visible in that area

### Requirement: Number shapes
`createNumber(value, x, y, color)` SHALL create a shape (see matrix-shapes) that shows `value` in the digit font with its top-left at (x, y), formatted like `drawNumber`. A number shape SHALL behave like every other shape: it is drawn above the drawing layer in list order, and it can be moved, recolored, hidden, brought to front, stamped and removed. Rotate, flip and set-pattern SHALL do nothing on it.

#### Scenario: Number above the drawing layer
- **WHEN** the drawing layer is filled blue and a white number shape `5` is created at (0, 0) and shown
- **THEN** the lit pixels of the glyph `5` show white and all other pixels show blue

#### Scenario: Z-order with other shapes
- **WHEN** a filled red rectangle shape is created after a white number shape and covers it, then the number shape calls `bringToFront()` and the matrix is shown
- **THEN** the lit glyph pixels show white and the rest of the rectangle shows red

#### Scenario: Stamp a number
- **WHEN** a number shape `7` at (0, 0) is stamped and then removed
- **THEN** the drawing layer contains the glyph `7` at (0, 0)

### Requirement: Update number shapes
`setNumber(value)` SHALL change the value a number shape shows. Its top-left position stays, and its width follows the new number of characters. Pixels of the old value SHALL NOT remain visible. On other shapes `setNumber` SHALL do nothing.

#### Scenario: Value grows
- **WHEN** a number shape showing `9` at (0, 0) gets `setNumber(10)` and the matrix is shown
- **THEN** `10` is shown at (0, 0), `width()` = 7 and `height()` = 5

#### Scenario: Value shrinks
- **WHEN** a number shape showing `10` gets `setNumber(9)` and the matrix is shown
- **THEN** only the glyph `9` is shown and columns 3..6 show the drawing layer underneath

### Requirement: Number shape collisions
Collision queries (`overlaps`, `touchesDrawing`, `canMoveBy`) SHALL treat a number shape pixel-exactly: only lit glyph pixels collide, and gaps and unlit glyph parts do not. Its bounding box for `width()`, `height()`, `isInside()` and `isOnEdge()` SHALL be 4n - 1 columns by 5 rows for n characters.

#### Scenario: Unlit glyph pixel does not collide
- **WHEN** a number shape `42` is at (0, 0) and a dot shape is at (1, 0) (unlit in glyph `4`)
- **THEN** `overlaps` returns false

#### Scenario: Gap does not collide
- **WHEN** the dot shape is moved to (3, 2) (the gap column)
- **THEN** `overlaps` returns false

#### Scenario: Lit glyph pixel collides
- **WHEN** the dot shape is moved to (0, 0)
- **THEN** `overlaps` returns true in both directions
