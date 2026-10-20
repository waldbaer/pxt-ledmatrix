# Spec Delta

## ADDED Requirements

### Requirement: Programs build in CI
The continuous build workflow SHALL build every program in `docs/examples/` for the Calliope mini 3 and the micro:bit. A program whose first comment says it runs on the Calliope mini 1 and 2 SHALL also be built for those. Every program in `docs/courses/solutions/` SHALL be built for the Calliope mini 1, 2 and 3. A failed build SHALL fail the workflow.

#### Scenario: Broken example
- **WHEN** a pushed commit makes any program in `docs/examples/` or `docs/courses/solutions/` fail to compile for one of its boards
- **THEN** the workflow fails and its log names the program and the board

#### Scenario: Boards from the first comment
- **WHEN** the workflow builds `feature-tour-1.js`, which says it runs on the Calliope mini 1, 2 and 3 and the micro:bit, and `feature-tour-2.js`, which says it is too big for the mini 1 and 2
- **THEN** it builds tour 1 for all four boards and tour 2 only for the Calliope mini 3 and the micro:bit

#### Scenario: New program
- **WHEN** a new `.js` file is added to `docs/examples/` or `docs/courses/solutions/`
- **THEN** the workflow builds it without any change to the workflow

## MODIFIED Requirements

### Requirement: Example is plain JavaScript
Every example program in `docs/examples/` and every course solution in `docs/courses/solutions/` SHALL be valid both as plain JavaScript and in the MakeCode JavaScript editor. It SHALL contain no type annotations and no helper functions with parameters, and it SHALL compile as a MakeCode program that depends on the extension.

#### Scenario: Compile check
- **WHEN** any example program or course solution is copied into a MakeCode project that depends on this extension and built for the Calliope mini 3
- **THEN** the build succeeds without errors

### Requirement: Bilingual example comments
Every comment in the example programs (`docs/examples/*.js`) and the course solutions (`docs/courses/solutions/*.js`) SHALL be written in German and in English with the same meaning, on lines of its own: the German part starts with `// DE:`, the English part follows directly and starts with `// EN:`. Continuation lines SHALL be indented to line up with the text above. Separator lines, which hold only `//` and dashes, MAY frame parts of a program and need no translation.

#### Scenario: Comment pairs
- **WHEN** any example program or course solution is read
- **THEN** every comment is a `// DE:` part followed directly by an `// EN:` part

#### Scenario: Comment without translation
- **WHEN** a comment in an example program or course solution has no German or no English part
- **THEN** the change is not complete

#### Scenario: Separator line
- **WHEN** a line holds only `//` followed by dashes
- **THEN** it counts as a separator, not as a comment that needs a translation

### Requirement: Compact README
Each of the two language sections of `README.md` SHALL be at most 130 lines, not counting the MakeCode embed script line. Each SHALL cover: adding the extension, a quick start with the default layout, the layout settings with chain diagrams, a wiring troubleshooting table that refers to the example, a one-line-per-function API overview by group, power and pin notes, and a link to the course.

#### Scenario: Adding the extension
- **WHEN** a reader wants to use the extension
- **THEN** each section tells them to open Extensions in MakeCode and paste `https://github.com/waldbaer/pxt-ledmatrix`, and mentions searching for the extension only if MakeCode search was verified to find it

#### Scenario: Power and pin notes
- **WHEN** a reader looks for power information
- **THEN** each section says to use an external 5 V supply with GND connected to the board's GND, gives the approximate current of a 16x16 panel at the default brightness and at full brightness, and warns against using the data pin as a touch input

#### Scenario: Troubleshooting
- **WHEN** a reader's panel shows a garbled picture
- **THEN** each section maps each symptom of the wiring-check example (square splits, wrong corner, wrong direction) to the setting to change

#### Scenario: Course link
- **WHEN** a teacher looks for lessons
- **THEN** each section links `docs/courses/` on GitHub, which holds the worksheets and solutions

#### Scenario: Line count
- **WHEN** the lines from `## Deutsch` to `## English` and from `## English` to the metadata lines are counted
- **THEN** each count is at most 130

### Requirement: Wiring-check example
The repository SHALL contain `docs/examples/wiring-check.js`. Its first comment SHALL say what it is for: running it first on a new panel to find the layout and color order settings. It creates a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top. A 2x2 square walks clockwise along the edges from the top-left: red along the top, green down the right, blue along the bottom, yellow up the left. The finished laps are shown centered by a number shape.

#### Scenario: Correct wiring
- **WHEN** the example runs on a panel whose layout matches the settings
- **THEN** the square stays a solid 2x2 block, starts top-left, and goes round clockwise while the lap count in the middle increases

#### Scenario: Purpose
- **WHEN** a reader opens the example
- **THEN** its first comment says to run it first on a new panel, to find the layout and color order settings the panel needs

### Requirement: Three feature tours
`docs/examples/` SHALL contain three feature tours: `feature-tour-1.js` (beginner), `feature-tour-2.js` (intermediate) and `feature-tour-3.js` (advanced). Each runs its scenes in a loop on a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top, and never sets the matrix brightness above the default 32. Each tour's first comment SHALL name its level and the boards it runs on. The README SHALL link all three.

#### Scenario: Tour files
- **WHEN** `docs/examples/` is listed
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
