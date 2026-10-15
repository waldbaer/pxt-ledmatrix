# matrix-drawing Specification

## Purpose

Provides a persistent drawing layer per matrix and the graphics primitives and color helpers that paint into it. This is the "canvas" that shapes are drawn on top of.

## Requirements

### Requirement: Drawing layer
Each matrix SHALL have one drawing layer that stores a 24-bit color (0xRRGGBB) per pixel. It starts all off (0x000000) and keeps its content until a program changes it. A pixel counts as lit when its color is not 0x000000. Drawing with color 0x000000 turns pixels off. Shapes SHALL NOT change the drawing layer, except through stamping.

#### Scenario: Content persists across frames
- **WHEN** a program draws a pixel, calls `show()`, and calls `show()` again later
- **THEN** the pixel is still part of the frame

### Requirement: Set and read pixels
`setPixel(x, y, color)` SHALL store the color at (x, y). `getPixel(x, y)` SHALL return the stored color of the drawing layer (shapes are not included). Coordinates are truncated to integers. With wrap-around off, writing outside the matrix SHALL be ignored and reading outside SHALL return 0.

#### Scenario: Round trip
- **WHEN** a program calls `setPixel(2, 3, 0x123456)`
- **THEN** `getPixel(2, 3)` returns 0x123456

#### Scenario: Outside is ignored
- **WHEN** wrap-around is off and a program calls `setPixel(-1, 0, 0xFF0000)` on an 8x8 matrix
- **THEN** no pixel changes and `getPixel(-1, 0)` returns 0

### Requirement: Lines
`drawLine(x0, y0, x1, y1, color)` SHALL draw a straight line using Bresenham's algorithm. Both end points are included.

#### Scenario: Diagonal
- **WHEN** a program draws a line from (0, 0) to (7, 7) in red on an 8x8 matrix
- **THEN** the pixels (i, i) for i = 0..7 are red and no other pixel changes

#### Scenario: Single point
- **WHEN** a program draws a line from (3, 3) to (3, 3)
- **THEN** only pixel (3, 3) changes

### Requirement: Rectangles
`drawRectangle(x, y, width, height, color, filled)` SHALL draw a rectangle whose top-left pixel is (x, y). Filled, all pixels inside are set. Not filled, only the one-pixel border is set. A width or height of 0 or less SHALL draw nothing.

#### Scenario: Outline
- **WHEN** a program draws an unfilled 8x8 blue rectangle at (0, 0) on an 8x8 matrix
- **THEN** `getPixel(0, 7)` is blue and `getPixel(3, 3)` is 0

#### Scenario: Filled
- **WHEN** a program draws a filled 2x3 rectangle at (1, 1)
- **THEN** exactly the 6 pixels with x in 1..2 and y in 1..3 are set

### Requirement: Circles
`drawCircle(x, y, radius, color, filled)` SHALL draw a circle centered at (x, y) using the midpoint circle algorithm. Filled, the inside is set as well. Radius 0 SHALL set only the center pixel, and a negative radius SHALL draw nothing.

#### Scenario: Filled circle
- **WHEN** a program draws a filled circle at (3, 3) with radius 2
- **THEN** (3, 3), (1, 3), (5, 3), (3, 1) and (3, 5) are set and (1, 1) is not set

#### Scenario: Radius 0
- **WHEN** a program draws a circle at (4, 4) with radius 0
- **THEN** only pixel (4, 4) changes

### Requirement: Draw patterns
`drawPattern(pattern, x, y, color)` SHALL paint the lit pixels of a pattern (see matrix-shapes) with the pattern's top-left at (x, y). Pixels in the sprite color use `color`, and pixels with a fixed color letter use that color. Off pixels SHALL leave the drawing layer unchanged.

#### Scenario: Multi-color pattern
- **WHEN** a program draws the text pattern `"r.g|.b."` at (0, 18) with color 0 on a 10x20 matrix
- **THEN** `getPixel(0, 18)` = 0xFF0000, `getPixel(2, 18)` = 0x00FF00, `getPixel(1, 19)` = 0x0000FF and `getPixel(1, 18)` is unchanged

### Requirement: Fill and clear
`fill(color)` SHALL set every pixel of the drawing layer to `color`. `clear()` SHALL turn every pixel of the drawing layer off. Neither SHALL change shapes.

#### Scenario: Clear keeps shapes
- **WHEN** a matrix has a visible shape and the program calls `clear()` and `show()`
- **THEN** the drawing layer is all off and the shape is still shown

### Requirement: Shift
`shift(dx, dy)` SHALL move the whole drawing layer by dx pixels to the right and dy pixels down (negative values move left/up). With wrap-around off, pixels moved out are lost and the vacated pixels are off. With wrap-around on, pixels moved out SHALL come back on the opposite side.

#### Scenario: Shift without wrap
- **WHEN** wrap-around is off, pixel (0, 0) is red, and the program calls `shift(1, 0)`
- **THEN** `getPixel(1, 0)` is red and `getPixel(0, 0)` is 0

#### Scenario: Shift with wrap
- **WHEN** wrap-around is on, pixel (7, 0) of an 8x8 matrix is red, and the program calls `shift(1, 0)`
- **THEN** `getPixel(0, 0)` is red

### Requirement: Wrap-around
`setWrap(on)` SHALL switch wrap-around for drawing, shifting, shapes and collisions. It is off by default. When it is on, a coordinate outside the matrix SHALL be taken modulo width or height, so it lands on the opposite side.

#### Scenario: Drawing wraps
- **WHEN** wrap-around is on and a program calls `setPixel(8, -1, 0xFF0000)` on an 8x8 matrix
- **THEN** `getPixel(0, 7)` is 0xFF0000

### Requirement: Named colors
`ledmatrix.colors(c)` SHALL return the 0xRRGGBB value of a named color: red 0xFF0000, orange 0xFFA500, yellow 0xFFFF00, green 0x00FF00, cyan 0x00FFFF, blue 0x0000FF, purple 0xFF00FF, white 0xFFFFFF, black 0x000000.

#### Scenario: Named color
- **WHEN** a program calls `ledmatrix.colors(LedMatrixColors.Orange)`
- **THEN** the result is 0xFFA500

### Requirement: RGB colors
`ledmatrix.rgb(red, green, blue)` SHALL return the color 0xRRGGBB. Each component is truncated to an integer and clamped to 0..255.

#### Scenario: Mixing
- **WHEN** a program calls `ledmatrix.rgb(255, 128, 0)`
- **THEN** the result is 0xFF8000

#### Scenario: Out of range
- **WHEN** a program calls `ledmatrix.rgb(300, -5, 0)`
- **THEN** the result is 0xFF0000

### Requirement: Hue colors
`ledmatrix.hue(angle)` SHALL return a fully saturated color from the color wheel: 0 = red, 60 = yellow, 120 = green, 240 = blue. The angle is truncated to an integer and taken modulo 360, and negative angles count backwards.

#### Scenario: Primary hues
- **WHEN** a program calls `hue(0)`, `hue(120)` and `hue(240)`
- **THEN** the results are 0xFF0000, 0x00FF00 and 0x0000FF

#### Scenario: Wrap of the angle
- **WHEN** a program calls `hue(360)` and `hue(-120)`
- **THEN** the results are 0xFF0000 and 0x0000FF
