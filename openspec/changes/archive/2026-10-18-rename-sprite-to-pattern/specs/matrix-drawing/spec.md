## MODIFIED Requirements

### Requirement: Draw patterns
`drawPattern(pattern, x, y, color)` SHALL paint the lit pixels of a pattern (see matrix-shapes) with the pattern's top-left at (x, y). Pixels in the pattern color use `color`, and pixels with a fixed color letter use that color. Off pixels SHALL leave the drawing layer unchanged.

#### Scenario: Multi-color pattern
- **WHEN** a program draws the text pattern `"r.g|.b."` at (0, 18) with color 0 on a 10x20 matrix
- **THEN** `getPixel(0, 18)` = 0xFF0000, `getPixel(2, 18)` = 0x00FF00, `getPixel(1, 19)` = 0x0000FF and `getPixel(1, 18)` is unchanged
