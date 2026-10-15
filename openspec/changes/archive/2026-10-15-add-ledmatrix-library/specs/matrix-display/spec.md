# Spec Delta

## Purpose

Turns one WS2812B LED strip that snakes through a panel into a 2D display. Programs use x/y coordinates, and the extension takes care of the physical wiring, brightness, color byte order and sending frames.

## ADDED Requirements

### Requirement: Create a matrix
The extension SHALL provide `ledmatrix.create(pin, width, height)`, which returns a matrix of `width` x `height` pixels driven through `pin`. Width and height are truncated to integers, and values below 1 SHALL become 1. Creating a matrix SHALL drive the pin low and SHALL NOT send any data to the LEDs.

#### Scenario: Create the reference panel
- **WHEN** a program calls `ledmatrix.create(DigitalPin.P0, 16, 16)`
- **THEN** the matrix reports `width()` = 16 and `height()` = 16
- **AND** no LED changes until `show()` is called

#### Scenario: Invalid size
- **WHEN** a program calls `ledmatrix.create(DigitalPin.P0, 0, -3)`
- **THEN** the matrix reports `width()` = 1 and `height()` = 1

### Requirement: Logical coordinates
Every drawing, shape and collision function SHALL use logical coordinates: (0, 0) is the top-left pixel as seen from the front, x grows to the right and y grows downwards, whatever the physical layout.

#### Scenario: Same picture on differently wired panels
- **WHEN** the same program sets pixel (0, 0) on two matrices of equal size with different layouts
- **THEN** on both panels the top-left LED (seen from the front) lights up

### Requirement: Default layout
A new matrix SHALL use the layout "columns, zig-zag" with the first LED in the top-left corner. The chain runs down column 0, up column 1, down column 2, and so on.

#### Scenario: Default layout on 16x16
- **WHEN** a 16x16 matrix is created without changing the layout
- **THEN** `ledIndex(0, 0)` = 0, `ledIndex(0, 15)` = 15, `ledIndex(1, 15)` = 16, `ledIndex(1, 0)` = 31, `ledIndex(15, 0)` = 255 and `ledIndex(15, 15)` = 240

### Requirement: Selectable layout
The extension SHALL let programs select the layout with `setLayout(wiring, corner)`. Wiring is one of "rows, zig-zag", "rows, same direction", "columns, zig-zag", "columns, same direction". Corner is the corner of the first LED: top left, top right, bottom left or bottom right. That gives 16 layouts. The new layout SHALL apply from the next `show()` on and SHALL NOT change the drawing layer or the shapes.

#### Scenario: Rows, zig-zag, top left
- **WHEN** an 8x8 matrix uses "rows, zig-zag" with the first LED top left
- **THEN** `ledIndex(0, 0)` = 0, `ledIndex(7, 0)` = 7, `ledIndex(7, 1)` = 8 and `ledIndex(0, 1)` = 15

#### Scenario: Columns, zig-zag, bottom left
- **WHEN** a 32x8 matrix uses "columns, zig-zag" with the first LED bottom left
- **THEN** `ledIndex(0, 7)` = 0, `ledIndex(0, 0)` = 7, `ledIndex(1, 0)` = 8 and `ledIndex(31, 7)` = 255

#### Scenario: Rows, same direction, bottom right
- **WHEN** an 8x16 matrix uses "rows, same direction" with the first LED bottom right
- **THEN** `ledIndex(7, 15)` = 0, `ledIndex(0, 15)` = 7 and `ledIndex(7, 14)` = 8

#### Scenario: Columns, same direction, top right
- **WHEN** a 4x4 matrix uses "columns, same direction" with the first LED top right
- **THEN** `ledIndex(3, 0)` = 0, `ledIndex(3, 3)` = 3 and `ledIndex(2, 0)` = 4

#### Scenario: Layout change keeps the picture
- **WHEN** a program draws on a matrix, changes the layout and calls `show()`
- **THEN** the drawing layer and the shapes are unchanged and are sent using the new layout

### Requirement: LED index lookup
`ledIndex(x, y)` SHALL return the position of the LED in the chain (0 = first LED) that shows logical pixel (x, y) under the current layout, or -1 if (x, y) is outside the matrix.

#### Scenario: Outside the matrix
- **WHEN** a program calls `ledIndex(8, 0)` on an 8x8 matrix
- **THEN** the result is -1

### Requirement: Brightness
`setBrightness(b)` SHALL set the brightness used when sending, clamped to 0..255. The default SHALL be 32. Each color channel value v SHALL be sent as `(v * (b + 1)) >> 8`, so 255 sends the stored values unchanged and 0 sends all channels as 0. Brightness SHALL NOT change the stored colors.

#### Scenario: Default brightness
- **WHEN** a new matrix shows a pixel with color 0xFF0000
- **THEN** that LED receives red = 32, green = 0, blue = 0

#### Scenario: Clamping
- **WHEN** a program calls `setBrightness(300)` and then shows a pixel with color 0xFF8000
- **THEN** that LED receives red = 255, green = 128, blue = 0

#### Scenario: Stored colors unaffected
- **WHEN** a program sets a pixel to 0x123456 and then changes the brightness
- **THEN** `getPixel` still returns 0x123456

### Requirement: Color byte order
The matrix SHALL send 3 bytes per LED in GRB order by default. `setColorOrder(RGB)` SHALL switch to RGB order, and `setColorOrder(GRB)` back.

#### Scenario: GRB by default
- **WHEN** a new matrix at brightness 255 shows color 0x112233 on LED 0
- **THEN** the first three bytes sent are 0x22, 0x11, 0x33

#### Scenario: RGB order
- **WHEN** the color order is RGB and LED 0 shows 0x112233 at brightness 255
- **THEN** the first three bytes sent are 0x11, 0x22, 0x33

### Requirement: Show
Nothing on the LEDs SHALL change until `show()` is called. `show()` SHALL compose the drawing layer with all visible shapes. It SHALL then send the result as one WS2812 transmission of `width * height * 3` bytes on the matrix pin, in chain order, applying layout, color order and brightness.

#### Scenario: Drawing without show
- **WHEN** a program draws pixels but does not call `show()`
- **THEN** the LEDs keep showing the previous frame

#### Scenario: Frame size
- **WHEN** `show()` sends a frame for a 16x16 matrix
- **THEN** exactly 768 bytes are sent

### Requirement: Skip unchanged frames
`show()` SHALL NOT send when nothing visible has changed since the last send. The first `show()` on a matrix SHALL always send. Any change to the drawing layer, any change to a shape (position, color, visibility, pattern, z-order, creation, removal), and any change of brightness, color order or layout SHALL make the next `show()` send.

#### Scenario: Repeated show
- **WHEN** a program calls `show()` twice with no change in between
- **THEN** only the first call sends data to the LEDs

#### Scenario: Shape move triggers send
- **WHEN** a shape is moved between two `show()` calls
- **THEN** the second `show()` sends a new frame
