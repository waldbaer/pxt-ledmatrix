# Spec Delta

## ADDED Requirements

### Requirement: Overlap after a move
`a.wouldOverlap(b, dx, dy)` SHALL be true exactly when `a.overlaps(b)` would be true with `a` moved by (dx, dy), truncated to integers, and `b` where it is. The rules of `overlaps` apply: pixel-exact, wrapped pixels count with wrap-around on, and false for a missing `b`, for `b` being `a`, for shapes of different matrices, and when either shape is hidden or removed. `a` SHALL NOT move, and the check alone SHALL NOT make the next `show()` send.

#### Scenario: Boxes overlap now, pixels would after the move
- **WHEN** sprite `.#.|###` is at (0, 10) and sprite `###|.#.` is at (2, 9)
- **THEN** the second sprite's `wouldOverlap(first, 0, 0)` is false, its `wouldOverlap(first, -1, 1)` is true, and it is still at (2, 9)

#### Scenario: Check does not send
- **WHEN** a matrix has just been shown and a shape calls `wouldOverlap` with a non-zero offset
- **THEN** its `x()` and `y()` are unchanged and the next `show()` sends nothing

#### Scenario: Hidden shapes never block
- **WHEN** the other shape is hidden
- **THEN** `wouldOverlap` returns false, also for an offset that puts lit pixels of both shapes on the same LED

#### Scenario: Wrap-around
- **WHEN** on an 8x8 matrix with wrap-around on, a dot is at (7, 0) and another dot is at (0, 0)
- **THEN** the first dot's `wouldOverlap(second, 1, 0)` is true, and it is false with wrap-around off

## MODIFIED Requirements

### Requirement: Stamp shapes
`stamp()` SHALL paint the shape's lit pixels in their colors into the drawing layer at its current position, following the wrap-around setting. The stamped pixels SHALL be plain drawing-layer pixels that keep no link to the shape. The shape itself SHALL stay. Stamping a hidden or removed shape SHALL do nothing.

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
