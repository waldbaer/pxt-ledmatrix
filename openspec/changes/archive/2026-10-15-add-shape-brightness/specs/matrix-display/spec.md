# Spec Delta

## MODIFIED Requirements

### Requirement: Skip unchanged frames
`show()` SHALL NOT send when nothing visible has changed since the last send. The first `show()` on a matrix SHALL always send. Any change to the drawing layer, any change to a shape (position, color, brightness, visibility, pattern, z-order, creation, removal), and any change of brightness, color order or layout SHALL make the next `show()` send.

#### Scenario: Repeated show
- **WHEN** a program calls `show()` twice with no change in between
- **THEN** only the first call sends data to the LEDs

#### Scenario: Shape move triggers send
- **WHEN** a shape is moved between two `show()` calls
- **THEN** the second `show()` sends a new frame

#### Scenario: Shape brightness triggers send
- **WHEN** a shape calls `setBrightness` between two `show()` calls
- **THEN** the second `show()` sends a new frame
