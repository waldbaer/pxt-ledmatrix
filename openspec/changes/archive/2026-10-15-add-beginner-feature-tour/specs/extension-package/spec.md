# Spec Delta

## ADDED Requirements

### Requirement: Feature tours
`examples/` SHALL contain three feature tours: `feature-tour-beginner.js`, `feature-tour-intermediate.js` and `feature-tour-advanced.js`. Each runs its scenes in a loop on a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top, and never sets the matrix brightness above the default 32. Each tour's first comment SHALL name the boards it runs on. The README SHALL link all three.

#### Scenario: Tour files
- **WHEN** `examples/` is listed
- **THEN** it contains the three tours and neither `feature-tour.js` nor `feature-tour-2.js`

#### Scenario: Renamed tours unchanged
- **WHEN** the intermediate and the advanced tour run on a panel
- **THEN** they show the same scenes as `feature-tour.js` and `feature-tour-2.js` did before the rename

#### Scenario: Board hint
- **WHEN** a reader opens the beginner or the advanced tour
- **THEN** its first comment says that it needs a Calliope mini 3

#### Scenario: Brightness limit
- **WHEN** any tour runs
- **THEN** the matrix brightness never exceeds 32

#### Scenario: README links
- **WHEN** the README is read
- **THEN** it links each of the three tours

### Requirement: Beginner tour covers every block
The beginner tour SHALL use every block of the extension at least once, except "set wiring" and "set color order": a program cannot read these settings back, so the tour could not restore them.

#### Scenario: Coverage check
- **WHEN** the tour is searched for the function behind every block of the extension
- **THEN** each one is found, except `setLayout` and `setColorOrder`, and both the matrix's and a shape's `width` and `height` are used

### Requirement: Beginner tour pace
The beginner tour SHALL change one thing on the panel per step and then pause, long enough for a child to see the change. One variable at the top SHALL set this pause. Before each scene the tour SHALL show the scene's number, and the code SHALL mark the scene with the same number.

#### Scenario: Watching a step
- **WHEN** a step of the tour runs
- **THEN** one thing on the panel changes, and it stays visible for the pause before the next step starts

#### Scenario: Changing the pace
- **WHEN** a teacher halves the pause variable
- **THEN** the steps run about twice as fast and nothing else changes

#### Scenario: Finding a scene
- **WHEN** the panel shows the number of a scene
- **THEN** the code has a comment that marks the scene with that number

### Requirement: Beginner tour code
The beginner tour SHALL be readable for a 12-year-old with little programming experience: a comment in short, simple sentences before every step, plain names, and only `for`, `while` and `if` for control flow. Its code SHALL use no arrays, no `%`, no bit operators and no `? :`.

#### Scenario: Code check
- **WHEN** the tour's code, without comments and strings, is read
- **THEN** it contains no array, no `%`, no bit operator and no `? :`

#### Scenario: Every step explained
- **WHEN** a reader looks at any step of the tour
- **THEN** a comment directly above it says what the step does

### Requirement: Bilingual example comments
Every comment in the example programs (`examples/*.js`) SHALL be written in English and in German with the same meaning, on lines of its own: the English part starts with `// EN:`, the German part follows directly and starts with `// DE:`. Continuation lines SHALL be indented to line up with the text above.

#### Scenario: Comment pairs
- **WHEN** any example program is read
- **THEN** every comment is an `// EN:` part followed directly by a `// DE:` part

#### Scenario: Comment without translation
- **WHEN** a comment in an example program has no English or no German part
- **THEN** the change is not complete

## MODIFIED Requirements

### Requirement: Wiring-check example
The repository SHALL contain `examples/wiring-check.js`. Its first comment SHALL say what it is for: running it first on a new panel to find the layout and color order settings. It creates a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top. A 2x2 square walks clockwise along the edges from the top-left: red along the top, green down the right, blue along the bottom, yellow up the left. The finished laps are shown centered with `drawNumber`.

#### Scenario: Correct wiring
- **WHEN** the example runs on a panel whose layout matches the settings
- **THEN** the square stays a solid 2x2 block, starts top-left, and goes round clockwise while the lap count in the middle increases

#### Scenario: Purpose
- **WHEN** a reader opens the example
- **THEN** its first comment says to run it first on a new panel, to find the layout and color order settings the panel needs

### Requirement: Example is plain JavaScript
Every example program in `examples/` SHALL be valid both as plain JavaScript and in the MakeCode JavaScript editor. It SHALL contain no type annotations and no helper functions with parameters, and it SHALL compile as a MakeCode program that depends on the extension.

#### Scenario: Compile check
- **WHEN** any example program is copied into a MakeCode project that depends on this extension and built for the Calliope mini 3
- **THEN** the build succeeds without errors
