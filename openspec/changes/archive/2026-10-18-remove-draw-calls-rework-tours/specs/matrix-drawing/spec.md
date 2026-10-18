## MODIFIED Requirements

### Requirement: Drawing layer
Each matrix SHALL have one drawing layer that stores a 24-bit color (0xRRGGBB) per pixel. It starts all off (0x000000) and keeps its content until a program changes it. Only `setPixel`, `fill`, `clear`, `shift` and stamping a shape SHALL change it. A pixel counts as lit when its color is not 0x000000. Writing color 0x000000 turns pixels off.

#### Scenario: Content persists across frames
- **WHEN** a program draws a pixel, calls `show()`, and calls `show()` again later
- **THEN** the pixel is still part of the frame

#### Scenario: A figure is painted by stamping
- **WHEN** a program creates a filled red 2x2 rectangle shape at (1, 1), stamps it and removes it
- **THEN** `getPixel` returns 0xFF0000 for (1, 1), (2, 1), (1, 2) and (2, 2), and the matrix has no shape

## REMOVED Requirements

### Requirement: Lines
**Reason**: `drawLine` duplicates the line shape; its rules move to "Shape geometry" in matrix-shapes.
**Migration**: `createLine(x0, y0, x1, y1, color)`, then `stamp()` and `remove()`.

### Requirement: Rectangles
**Reason**: `drawRectangle` duplicates the rectangle shape; its rules move to "Shape geometry" in matrix-shapes.
**Migration**: `createRectangle(x, y, width, height, color, filled)`, then `stamp()` and `remove()`.

### Requirement: Circles
**Reason**: `drawCircle` duplicates the circle shape; its rules move to "Shape geometry" in matrix-shapes.
**Migration**: `createCircle(x, y, radius, color, filled)`, then `stamp()` and `remove()`.

### Requirement: Draw patterns
**Reason**: `drawPattern` duplicates the pattern shape; its rules move to "Pattern shapes" in matrix-shapes.
**Migration**: `createPattern(pattern, x, y, color)`, then `stamp()` and `remove()`.
