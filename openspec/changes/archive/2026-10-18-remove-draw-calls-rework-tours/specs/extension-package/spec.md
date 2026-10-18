## ADDED Requirements

### Requirement: Three feature tours
`examples/` SHALL contain three feature tours: `feature-tour-1.js` (beginner), `feature-tour-2.js` (intermediate) and `feature-tour-3.js` (advanced). Each runs its scenes in a loop on a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top, and never sets the matrix brightness above the default 32. Each tour's first comment SHALL name its level and the boards it runs on. The README SHALL link all three.

#### Scenario: Tour files
- **WHEN** `examples/` is listed
- **THEN** it contains `feature-tour-1.js`, `feature-tour-2.js` and `feature-tour-3.js`, and none of `feature-tour-beginner.js`, `feature-tour-intermediate.js` and `feature-tour-advanced.js`

#### Scenario: Level and board hint
- **WHEN** a reader opens any tour
- **THEN** its first comment names its level and the boards it runs on

#### Scenario: Brightness limit
- **WHEN** any tour runs
- **THEN** the matrix brightness never exceeds 32

#### Scenario: README links
- **WHEN** the README is read
- **THEN** it links each of the three tours

### Requirement: Short feature tours
`feature-tour-1.js` SHALL have at most 150 lines, `feature-tour-2.js` at most 250 and `feature-tour-3.js` at most 300, comments included.

#### Scenario: Line count
- **WHEN** the lines of the three tours are counted
- **THEN** tour 1 has at most 150, tour 2 at most 250 and tour 3 at most 300

### Requirement: Tours cover every block
Every block of the extension SHALL be used in at least one tour, except "set wiring" and "set color order": a program cannot read these settings back, so a tour could not restore them.

#### Scenario: Coverage check
- **WHEN** the three tours are searched for the function behind every block of the extension
- **THEN** each one is found in at least one tour, except `setLayout` and `setColorOrder`, and both the matrix's and a shape's `width` and `height` are used

### Requirement: Beginner tour shows the basics
The beginner tour is for pupils of 10 to 12. It SHALL use only these blocks: `create`, `show`, `setPixel`, `colors`, `rgb`, `fill`, `clear`, `createLine`, `createRectangle`, `moveBy`, `removeAllShapes`, `createNumber` and `setNumber`.

#### Scenario: Only the basic blocks
- **WHEN** the beginner tour is searched for the function behind every block of the extension
- **THEN** only the thirteen functions above are found

### Requirement: Advanced tour shows games
The advanced tour SHALL show small games made from shapes and collision queries, such as invaders and pong, and the advanced blocks. Its game scenes SHALL NOT call `setPixel`, `getPixel`, `fill` or `shift`.

#### Scenario: No pixel effects in games
- **WHEN** the game scenes of the advanced tour are searched for `setPixel`, `getPixel`, `fill` and `shift`
- **THEN** none is found

#### Scenario: Games
- **WHEN** the advanced tour runs
- **THEN** it shows at least two games in which shapes move and react to collisions

## MODIFIED Requirements

### Requirement: Wiring-check example
The repository SHALL contain `examples/wiring-check.js`. Its first comment SHALL say what it is for: running it first on a new panel to find the layout and color order settings. It creates a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top. A 2x2 square walks clockwise along the edges from the top-left: red along the top, green down the right, blue along the bottom, yellow up the left. The finished laps are shown centered by a number shape.

#### Scenario: Correct wiring
- **WHEN** the example runs on a panel whose layout matches the settings
- **THEN** the square stays a solid 2x2 block, starts top-left, and goes round clockwise while the lap count in the middle increases

#### Scenario: Purpose
- **WHEN** a reader opens the example
- **THEN** its first comment says to run it first on a new panel, to find the layout and color order settings the panel needs

### Requirement: Bilingual example comments
Every comment in the example programs (`examples/*.js`) SHALL be written in English and in German with the same meaning, on lines of its own: the English part starts with `// EN:`, the German part follows directly and starts with `// DE:`. Continuation lines SHALL be indented to line up with the text above. Separator lines, which hold only `//` and dashes, MAY frame parts of a program and need no translation.

#### Scenario: Comment pairs
- **WHEN** any example program is read
- **THEN** every comment is an `// EN:` part followed directly by a `// DE:` part

#### Scenario: Comment without translation
- **WHEN** a comment in an example program has no English or no German part
- **THEN** the change is not complete

#### Scenario: Separator line
- **WHEN** a line holds only `//` followed by dashes
- **THEN** it counts as a separator, not as a comment that needs a translation

## REMOVED Requirements

### Requirement: Feature tours
**Reason**: The tours are rewritten and renamed; the old names and the "renamed tours unchanged" rule no longer apply.
**Migration**: See "Three feature tours".

### Requirement: Beginner tour covers every block
**Reason**: Using every block kept the beginner tour long. Coverage moves to all tours together, and the beginner tour shows only the basics.
**Migration**: See "Tours cover every block" and "Beginner tour shows the basics".
