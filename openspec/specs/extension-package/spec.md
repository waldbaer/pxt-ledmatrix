# extension-package Specification

## Purpose

Defines how the LED matrix library is delivered as a MakeCode extension: which editors and boards it supports, what it depends on, its languages, and the documentation and example that ship with it.

## Requirements

### Requirement: Supported targets
The extension SHALL declare support for the Calliope mini and micro:bit MakeCode targets. It SHALL compile without errors for the Calliope mini 3 and for the micro:bit, using the official compilers of makecode.calliope.cc and makecode.microbit.org.

#### Scenario: Calliope mini 3 build
- **WHEN** the extension and its test file are built for the Calliope mini 3 with the MakeCode CLI
- **THEN** the build succeeds without errors

#### Scenario: micro:bit build
- **WHEN** the extension and its test file are built for the micro:bit with the MakeCode CLI
- **THEN** the build succeeds without errors

### Requirement: No extra dependencies
The extension SHALL depend only on the target's `core` package. It SHALL drive the LEDs through the WS2812 functions built into the core, so users do not need to add any other extension.

#### Scenario: Adding the extension
- **WHEN** a user adds the extension to a new project
- **THEN** no further extension is added to the project

### Requirement: Search keywords and metadata
The terms "WS2812", "WS2812B" and "NeoPixel" SHALL appear in the `pxt.json` description and in the README's title or first paragraph, so that the extension is found when searching for any of them. The README SHALL end with the MakeCode search metadata lines `for PXT/calliopemini` and `for PXT/microbit`, which use the editors' exact target ids.

#### Scenario: Keywords present
- **WHEN** `pxt.json` and the first paragraph of the README are searched case-insensitively for "ws2812", "ws2812b" and "neopixel"
- **THEN** each term is found in both

#### Scenario: Metadata lines
- **WHEN** the README is checked for search metadata
- **THEN** it contains the lines `* for PXT/calliopemini` and `* for PXT/microbit`

### Requirement: README badges
Directly below its title, the README SHALL show a block of linked badges, one per line: platform MakeCode, Calliope mini, micro:bit (with logo), latest GitHub tag, license, open issues, and the build status of the continuous build workflow.

#### Scenario: Badge block present
- **WHEN** the README source is read
- **THEN** the seven badge lines follow the title directly and link to makecode.com, makecode.calliope.cc, makecode.microbit.org, the repository's tags page, opensource.org/licenses/MIT, the issues page and the workflow page

### Requirement: Continuous build
The repository SHALL contain the GitHub Actions workflow `.github/workflows/test.yml`. On every push to `main` and every pull request into `main` it builds the extension, including its test file, for the Calliope mini and the micro:bit, and runs the tests in both MakeCode simulators. It SHALL fail when a build or a test fails.

#### Scenario: Compile error
- **WHEN** a pushed commit contains a compile error
- **THEN** the workflow fails and the build badge in the README shows failing

#### Scenario: Failing test
- **WHEN** a pull request makes a check in `test.ts` fail in a simulator
- **THEN** the workflow fails and its log shows the message of the failed check

### Requirement: German blocks
Every block, block parameter label, enum value and documentation comment of the extension SHALL have a German translation in `_locales/de`. In an editor set to German, the blocks SHALL appear in German. The one exception is the caption above a number slider: MakeCode builds it from the TypeScript parameter name and offers no way to translate it.

#### Scenario: Editor in German
- **WHEN** the Calliope editor runs in German and the user opens the extension's toolbox category
- **THEN** all blocks and their dropdown values are shown in German

#### Scenario: Slider caption
- **WHEN** the Calliope editor runs in German and the user opens the slider of the brightness block
- **THEN** the block text is German and the slider caption shows the parameter name "Brightness"

#### Scenario: New block without translation
- **WHEN** a block or enum value of the extension has no entry in `_locales/de/ledmatrix-strings.json`, or a documented function or parameter has no entry in `_locales/de/ledmatrix-jsdoc-strings.json`
- **THEN** the change is not complete

### Requirement: Compact README
`README.md` SHALL be at most 120 lines, not counting the MakeCode embed script line. It SHALL cover: adding the extension, a quick start with the default layout, the layout settings with chain diagrams, a wiring troubleshooting table that refers to the example, a one-line-per-function API overview by group, and power and pin notes.

#### Scenario: Adding the extension
- **WHEN** a reader wants to use the extension
- **THEN** the README tells them to open Extensions in MakeCode and paste `https://github.com/waldbaer/pxt-ledmatrix`

#### Scenario: Power and pin notes
- **WHEN** a reader looks for power information
- **THEN** the README says to use an external 5 V supply with GND connected to the board's GND, gives the approximate current of a 16x16 panel at the default brightness and at full brightness, and warns against using the data pin as a touch input

#### Scenario: Troubleshooting
- **WHEN** a reader's panel shows a garbled picture
- **THEN** the README maps each symptom of the wiring-check example (square splits, wrong corner, wrong direction) to the setting to change

### Requirement: Accurate simulator statement
The README SHALL describe the MakeCode simulator's behavior with the extension only as verified during this change. If the simulator does not display the matrix, the README SHALL say so.

#### Scenario: Simulator does not render the matrix
- **WHEN** verification shows that the simulator runs programs but does not display the matrix
- **THEN** the README states that the matrix is not shown in the simulator

### Requirement: Wiring-check example
The repository SHALL contain `examples/wiring-check.js`. Its first comment SHALL say what it is for: running it first on a new panel to find the layout and color order settings. It creates a 16x16 matrix on P0 with the default layout, with size and pin in variables at the top. A 2x2 square walks clockwise along the edges from the top-left: red along the top, green down the right, blue along the bottom, yellow up the left. The finished laps are shown centered by a number shape.

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

### Requirement: README title in the extension gallery
The README title SHALL contain the `pxt.json` name `ledmatrix`, so that the extension gallery's info page shows only its own heading and not the README title a second time.

#### Scenario: Title contains the name
- **WHEN** the first line of the README is read
- **THEN** it is a level-1 heading that contains `ledmatrix`

### Requirement: README links in the extension gallery
Every README link to a file or folder of this repository SHALL be an absolute URL to it on the `main` branch of `https://github.com/waldbaer/pxt-ledmatrix`, so that it works both on GitHub and on the extension gallery's info page.

#### Scenario: No relative links
- **WHEN** the README is searched for link targets that do not start with `https://` or `#`
- **THEN** none is found

#### Scenario: Links open the latest main
- **WHEN** a reader follows the README link to a tour, the wiring check, the examples folder or the CHANGELOG
- **THEN** it opens that file or folder on `main` on GitHub
