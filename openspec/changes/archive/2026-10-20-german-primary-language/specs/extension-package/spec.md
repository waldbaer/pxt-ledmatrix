# Spec Delta

## ADDED Requirements

### Requirement: German default variables
A block that creates something SHALL propose a German variable when it is dragged from the toolbox: `matrix` for the matrix, and `rechteck`, `kreis`, `linie`, `punkt`, `muster` and `zahl` for a rectangle, circle, line, dot, pattern shape and number. A block that works on a shape SHALL offer `zahl` for "set number", `muster` for rotate, flip and set pattern, and `rechteck` for all others. Blocks that work on the matrix SHALL offer `matrix`.

#### Scenario: Create a rectangle
- **WHEN** a user drags the rectangle block into a project that has no variable `rechteck`
- **THEN** the block sits in "setze rechteck auf"

#### Scenario: Name already taken
- **WHEN** a user drags the rectangle block into a project that already assigns `rechteck`
- **THEN** the block proposes `rechteck2`

#### Scenario: Shape blocks
- **WHEN** a user drags "bewege um", "setze Zahl auf" and "drehe" from the toolbox
- **THEN** their shape inputs hold the variables `rechteck`, `zahl` and `muster`

#### Scenario: English editor
- **WHEN** the editor runs in English and a user drags the circle block from the toolbox
- **THEN** the block sits in "set kreis to"

### Requirement: README in German and English
`README.md` SHALL start with its title and badges, followed by one line with jump links to the German and the English section. The German section SHALL come first, then the English section with the same content. Function and parameter names stay English in both. Variables in the German code examples SHALL be German. The README SHALL end with the MakeCode search metadata lines, which belong to neither section.

#### Scenario: Order
- **WHEN** the README is read from top to bottom
- **THEN** it shows the title, the badges, the jump links, the section `## Deutsch`, the section `## English` and the metadata lines

#### Scenario: Same content
- **WHEN** the two sections are compared
- **THEN** each part of one has a part with the same meaning in the other

#### Scenario: German code examples
- **WHEN** the code examples of the German section are read
- **THEN** their variables are German, such as `rahmen` and `zahl`, and their function and parameter names are English

#### Scenario: Jump link
- **WHEN** a reader on GitHub clicks "English" in the jump links
- **THEN** the page scrolls to the English section

#### Scenario: German chain diagram
- **WHEN** the chain diagram of the German section is read
- **THEN** its labels are the German names of the wiring options in the blocks

### Requirement: Description in German and English
The `pxt.json` description SHALL be German, followed by ` | ` and the same text in English.

#### Scenario: Both languages
- **WHEN** the `pxt.json` description is split at ` | `
- **THEN** it gives a German and then an English part with the same meaning, and each contains "WS2812", "WS2812B" and "NeoPixel"

## MODIFIED Requirements

### Requirement: Compact README
Each of the two language sections of `README.md` SHALL be at most 110 lines, not counting the MakeCode embed script line. Each SHALL cover: adding the extension, a quick start with the default layout, the layout settings with chain diagrams, a wiring troubleshooting table that refers to the example, a one-line-per-function API overview by group, and power and pin notes.

#### Scenario: Adding the extension
- **WHEN** a reader wants to use the extension
- **THEN** each section tells them to open Extensions in MakeCode and paste `https://github.com/waldbaer/pxt-ledmatrix`, and mentions searching for the extension only if MakeCode search was verified to find it

#### Scenario: Power and pin notes
- **WHEN** a reader looks for power information
- **THEN** each section says to use an external 5 V supply with GND connected to the board's GND, gives the approximate current of a 16x16 panel at the default brightness and at full brightness, and warns against using the data pin as a touch input

#### Scenario: Troubleshooting
- **WHEN** a reader's panel shows a garbled picture
- **THEN** each section maps each symptom of the wiring-check example (square splits, wrong corner, wrong direction) to the setting to change

#### Scenario: Line count
- **WHEN** the lines from `## Deutsch` to `## English` and from `## English` to the metadata lines are counted
- **THEN** each count is at most 110

### Requirement: Bilingual example comments
Every comment in the example programs (`examples/*.js`) SHALL be written in German and in English with the same meaning, on lines of its own: the German part starts with `// DE:`, the English part follows directly and starts with `// EN:`. Continuation lines SHALL be indented to line up with the text above. Separator lines, which hold only `//` and dashes, MAY frame parts of a program and need no translation.

#### Scenario: Comment pairs
- **WHEN** any example program is read
- **THEN** every comment is a `// DE:` part followed directly by an `// EN:` part

#### Scenario: Comment without translation
- **WHEN** a comment in an example program has no German or no English part
- **THEN** the change is not complete

#### Scenario: Separator line
- **WHEN** a line holds only `//` followed by dashes
- **THEN** it counts as a separator, not as a comment that needs a translation
