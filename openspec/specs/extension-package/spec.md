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
Every block, block parameter label, enum value and documentation comment of the extension SHALL have a German translation in `_locales/de`. In an editor set to German, the blocks SHALL appear in German.

#### Scenario: Editor in German
- **WHEN** the Calliope editor runs in German and the user opens the extension's toolbox category
- **THEN** all blocks and their dropdown values are shown in German

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
The repository SHALL contain `examples/wiring-check.js`. It creates a 16x16 matrix on P0 with the default layout, with size and pin set in variables at the top. A 2x2 square walks clockwise along the edges from the top-left: red along the top, green down the right, blue along the bottom, yellow up the left. The number of finished laps is shown centered with `drawNumber`.

#### Scenario: Correct wiring
- **WHEN** the example runs on a panel whose layout matches the settings
- **THEN** the square stays a solid 2x2 block, starts top-left, and goes round clockwise while the lap count in the middle increases

### Requirement: Example is plain JavaScript
The example SHALL be valid both as plain JavaScript and in the MakeCode JavaScript editor. It SHALL contain no type annotations and no helper functions with parameters, and it SHALL compile as a MakeCode program that depends on the extension.

#### Scenario: Compile check
- **WHEN** the example is copied into a MakeCode project that depends on this extension and built for the Calliope mini 3
- **THEN** the build succeeds without errors
