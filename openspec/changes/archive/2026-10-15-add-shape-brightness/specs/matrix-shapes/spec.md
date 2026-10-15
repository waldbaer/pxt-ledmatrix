# Spec Delta

## ADDED Requirements

### Requirement: Shape brightness
`setBrightness(b)` SHALL set the brightness of a shape of any kind. `b` is truncated to an integer and clamped to 0..255. New shapes start at 255. When a shape is shown, each color channel v of every pixel it draws, including the fixed color letters of a sprite, SHALL be `(v * (b + 1)) >> 8`, so 255 shows the colors unchanged. The matrix brightness SHALL then apply on top, as it does for the drawing layer.

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
- **WHEN** at matrix brightness 255 a sprite with pattern `r#` and color 0x0000FF calls `setBrightness(127)` and is shown
- **THEN** the LED of its left pixel receives 0x7F0000 and the LED of its right pixel receives 0x00007F

#### Scenario: Clamping and truncation
- **WHEN** at matrix brightness 255 a dot with color 0xFF8000 calls `setBrightness(300)`, `setBrightness(127.9)` or `setBrightness(-5)` and is shown
- **THEN** its LED receives 0xFF8000, 0x7F4000 or 0x000000 respectively

### Requirement: Dimmed shapes stay solid
A shape's brightness SHALL NOT change which pixels it covers or collides with. A dimmed shape, also at brightness 0, SHALL replace the pixels below it with its dimmed colors, without blending. It SHALL take part in `overlaps`, `wouldOverlap`, `touchesDrawing` and `canMoveBy` exactly as at brightness 255. To make a shape disappear, programs hide it.

#### Scenario: Brightness 0 covers the drawing
- **WHEN** pixel (2, 2) is drawn red, a white dot at (2, 2) calls `setBrightness(0)`, and the matrix is shown
- **THEN** the LED of (2, 2) receives 0x000000

#### Scenario: Brightness 0 still collides
- **WHEN** a dot at brightness 0 lies on a lit pixel of the drawing layer and on a lit pixel of another shape
- **THEN** its `touchesDrawing()` and its `overlaps` with the other shape both return true

### Requirement: The shape keeps its brightness
A shape's brightness SHALL stay until `setBrightness` is called again. Moving, recoloring, hiding and showing, bringing to front, rotating, flipping, setting a pattern and setting a number SHALL NOT change it. Changing the brightness SHALL NOT change the shape's color, position, pattern or number, nor the drawing layer.

#### Scenario: Recolor and move keep the brightness
- **WHEN** at matrix brightness 255 a dot calls `setBrightness(127)`, then `setColor(0x00FF00)` and `moveBy(1, 0)`, and is shown
- **THEN** the LED at its new position receives 0x007F00

#### Scenario: Hide and show keep the brightness
- **WHEN** at matrix brightness 255 a dot with color 0xFF0000 calls `setBrightness(127)`, then `setVisible(false)` and `setVisible(true)`, and is shown
- **THEN** its LED receives 0x7F0000

#### Scenario: Back to full brightness
- **WHEN** at matrix brightness 255 a dot with color 0xFF8000 calls `setBrightness(0)`, is shown, then calls `setBrightness(255)` and is shown again
- **THEN** its LED receives 0xFF8000

## MODIFIED Requirements

### Requirement: Stamp shapes
`stamp()` SHALL paint the shape's lit pixels into the drawing layer at its current position, following the wrap-around setting. Each pixel SHALL get the color the shape shows it in, with the shape's brightness applied and the matrix brightness not applied. The stamped pixels SHALL be plain drawing-layer pixels that keep no link to the shape. The shape itself SHALL stay. Stamping a hidden or removed shape SHALL do nothing.

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

#### Scenario: Dimmed shape stamps dimmed pixels
- **WHEN** at the default matrix brightness 32 a red dot at (1, 1) calls `setBrightness(127)` and is stamped
- **THEN** `getPixel(1, 1)` returns 0x7F0000

#### Scenario: Stamping at brightness 0 turns pixels off
- **WHEN** pixel (2, 2) is drawn red and a white dot at (2, 2) with brightness 0 is stamped
- **THEN** `getPixel(2, 2)` returns 0
