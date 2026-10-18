## ADDED Requirements

### Requirement: Number formatting
A number shape SHALL show its value truncated toward zero to an integer. A negative result SHALL be shown with a leading minus sign, and zero as a single `0`.

#### Scenario: Positive number
- **WHEN** a white number shape `42` at (0, 0) is stamped on a 16x16 matrix
- **THEN** the glyph `4` occupies columns 0..2, column 3 is untouched, and the glyph `2` occupies columns 4..6, all in rows 0..4

#### Scenario: Negative number
- **WHEN** a red number shape `-7` at (0, 0) is stamped
- **THEN** the minus glyph occupies columns 0..2 and the glyph `7` occupies columns 4..6

#### Scenario: Non-integer value
- **WHEN** a number shape `3.9` at (0, 0) and a number shape `-0.5` at (8, 0) are stamped
- **THEN** the first shows `3` and the second shows `0` without a minus sign

## MODIFIED Requirements

### Requirement: Digit font metrics
Every character of the digit font SHALL be 3 pixels wide and 5 pixels high, and adjacent characters SHALL be separated by exactly 1 empty column. A number with n characters (including a minus sign) therefore occupies 4n - 1 columns and 5 rows. Glyphs SHALL NOT be trimmed, so every digit has the same width.

#### Scenario: Width of a four-digit number
- **WHEN** a number shape `2048` at (0, 0) is stamped
- **THEN** the stamped pixels lie within columns 0..14 and rows 0..4

#### Scenario: Narrow digit keeps its width
- **WHEN** a number shape `11` at (0, 0) is stamped
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
- **WHEN** a white number shape `4` at (0, 0) is stamped on a cleared matrix
- **THEN** pixels (0,0), (2,0), (0,1), (2,1), (0,2), (1,2), (2,2), (2,3), (2,4) are white and all other pixels in columns 0..2, rows 0..4 are off

### Requirement: Only lit pixels are painted
A number shape SHALL paint only the lit pixels of its glyphs, when shown and when stamped. Its gaps and the unlit parts of its glyphs SHALL leave what is below unchanged. Pixels outside the matrix SHALL follow the wrap-around setting like all other drawing.

#### Scenario: Background stays
- **WHEN** the drawing layer is filled blue and a white number shape `1` at (0, 0) is stamped
- **THEN** pixel (0, 0) (unlit in the glyph `1`) is still blue

#### Scenario: Updating a counter
- **WHEN** number shape `10` at (0, 0) is stamped, then a filled black 7x5 rectangle shape at (0, 0), then number shape `9` at (0, 0)
- **THEN** only the glyph `9` is lit in that area

#### Scenario: Number wraps
- **WHEN** wrap-around is on and a number shape `7` at (14, 0) is stamped on a 16x16 matrix
- **THEN** the right column of the glyph `7` lands in column 0, rows 0..4

### Requirement: Number shapes
`createNumber(value, x, y, color)` SHALL create a shape (see matrix-shapes) that shows `value` in the digit font with its top-left at (x, y). A number shape SHALL behave like every other shape: it is drawn above the drawing layer in list order, and it can be moved, recolored, hidden, brought to front, stamped and removed. Rotate, flip and set-pattern SHALL do nothing on it.

#### Scenario: Number above the drawing layer
- **WHEN** the drawing layer is filled blue and a white number shape `5` is created at (0, 0) and shown
- **THEN** the lit pixels of the glyph `5` show white and all other pixels show blue

#### Scenario: Z-order with other shapes
- **WHEN** a filled red rectangle shape is created after a white number shape and covers it, then the number shape calls `bringToFront()` and the matrix is shown
- **THEN** the lit glyph pixels show white and the rest of the rectangle shows red

#### Scenario: Stamp a number
- **WHEN** a number shape `7` at (0, 0) is stamped and then removed
- **THEN** the drawing layer contains the glyph `7` at (0, 0)

## REMOVED Requirements

### Requirement: Draw numbers
**Reason**: `drawNumber` duplicates the number shape; its formatting rules move to "Number formatting".
**Migration**: `createNumber(value, x, y, color)` and `setNumber(value)` for a changing value; `stamp()` and `remove()` to paint it into the drawing.
