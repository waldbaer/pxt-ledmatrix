# school-courses Specification

## Purpose

Ready-to-use lessons for the LED matrix on the Calliope mini: worksheets and solution programs, in German and English, for pupils and the adults who guide them.

## Requirements

### Requirement: Course files
`docs/courses/` SHALL contain `README.md`, the German worksheet `uebungen.md`, the English worksheet `exercises.md`, and the programs in `solutions/`. Each exercise has a two-digit number and a short English name, used together as `NN-name` in all of its file names.

#### Scenario: Files of an exercise
- **WHEN** the files of the exercise `03-magic-lamp` are looked up
- **THEN** `docs/courses/solutions/03-magic-lamp.js` and `docs/courses/solutions/03-magic-lamp-extra.js` exist

### Requirement: Ten exercises
The course SHALL have ten exercises, ordered from easy to hard: exercises 1 to 5 are pictures and effects, 6 to 10 are games. Each exercise SHALL show a level of one to four stars and the buttons or pins it uses. The worksheets and the course overview SHALL use the same exercises in the same order.

#### Scenario: Order
- **WHEN** the exercise titles of both worksheets and the course overview are listed
- **THEN** they are the same ten exercises in the same order, and the stars never decrease from one exercise to the next

### Requirement: Worksheet exercises
For each exercise, a worksheet SHALL give the task, the blocks needed, a tip, an Extra and links to the exercise's main solution and Extra solution. The list of blocks needed SHALL contain at least every block of the main solution that no earlier exercise lists.

#### Scenario: New blocks are listed
- **WHEN** the blocks used by a main solution are compared with the block lists of its exercise and all earlier exercises
- **THEN** each block appears in at least one of these lists, apart from the program's top-level "on start" container, variable get and set blocks, number values and arithmetic

#### Scenario: Links
- **WHEN** a pupil reads an exercise on a worksheet
- **THEN** it links its main solution and its Extra solution

### Requirement: Block names as in the editor
Every block name in a worksheet SHALL be the label of that block in the Calliope editor set to the document's language, so that a pupil can find it in the toolbox.

#### Scenario: German loop block
- **WHEN** the German worksheet names the while loop
- **THEN** it calls it `während`, the label of the German editor

#### Scenario: Random number
- **WHEN** a worksheet names the random number block
- **THEN** it uses the block's label: `wähle eine zufällige Zahl von … bis …` in German, `pick random … to …` in English

### Requirement: Worksheet setup
Each worksheet SHALL start with a setup section. It says to add the extension by pasting `https://github.com/waldbaer/pxt-ledmatrix`, which matrix block to put into "on start", that the matrix changes only on "show changes", that the simulator does not show the matrix, and that the pupil picks their shape in the dropdown of a shape block. A note for adults SHALL cover the layout that the exercises expect.

#### Scenario: Adding the extension
- **WHEN** a pupil follows the setup section
- **THEN** they add the extension by pasting its URL, not by searching for its name

#### Scenario: Shape dropdown
- **WHEN** a pupil drags a block such as "set brightness" for a shape from the toolbox, and it shows the variable `rechteck`
- **THEN** the setup section has told them to choose their own shape in that block's dropdown

#### Scenario: Note for adults
- **WHEN** an adult reads the note
- **THEN** it names the layout that the exercises expect and the "set wiring" block, and says where that block is in the toolbox. It gives no instructions for wiring or powering the matrix, no current figures and no brightness limit

### Requirement: German and English
The two worksheets SHALL have the same content, in German and in English. `docs/courses/README.md` SHALL have a German section followed by an English section with the same content.

#### Scenario: Same worksheets
- **WHEN** the two worksheets are compared section by section
- **THEN** each part of one has a part with the same meaning in the other

### Requirement: Gender-neutral wording
The course texts SHALL refer to people in gender-neutral words, such as "zu zweit", "Person 1" or "wer gewinnt". Words like Spieler, Spielerin, Gewinner, Gewinnerin, Sieger, Schüler or Lehrer SHALL NOT appear in German texts, in any form, or in variable names.

#### Scenario: Word check
- **WHEN** `docs/courses/` is searched case-insensitively for `spieler`, `gewinner`, `sieger`, `schüler` and `lehrer`
- **THEN** nothing is found

### Requirement: Solution programs
Each exercise SHALL have a main solution `NN-name.js` and an Extra solution `NN-name-extra.js`. The Extra solution is a complete program that solves the Extra; the main solution does not contain it. Both use a 16x16 matrix on P0 with the default layout and German variable names, and never set the matrix brightness above 32. Their first comment names the exercise's number and title, and says whether the program is the Extra.

#### Scenario: Main solution without Extra
- **WHEN** the main solution of an exercise runs
- **THEN** it does what the task asks and nothing that only the Extra asks

#### Scenario: First comment
- **WHEN** a pupil opens `07-apple-catcher-extra.js`
- **THEN** its first comment says that it is the Extra of exercise 7, "Apfelfänger" / "Apple catcher"

### Requirement: Solutions for every Calliope mini
Every solution SHALL compile for the Calliope mini 1, 2 and 3, and SHALL build and flash with `docs/examples/build-and-flash.sh`.

#### Scenario: Build for the Calliope mini 1
- **WHEN** `docs/examples/build-and-flash.sh` is run with a solution and `v1`
- **THEN** the build succeeds and produces a hex file

### Requirement: Solutions convert to Blocks
Every solution, pasted into the JavaScript view of the Calliope editor, SHALL convert to Blocks without any grey JavaScript-only block.

#### Scenario: Switch to Blocks
- **WHEN** a solution is pasted into a new project with the extension, and the editor is switched to Blocks
- **THEN** every statement becomes a regular block

### Requirement: Solutions do what the task says
Each solution SHALL do what its exercise asks, as seen on the matrix and on the Calliope's own LEDs, and the games SHALL be playable by a pupil who presses about four times a second.

#### Scenario: Magic lamp
- **WHEN** the main solution of exercise 3 starts, then A is clicked, then B is clicked
- **THEN** the matrix is first off, then lit in one color, then off again

#### Scenario: Pong for one
- **WHEN** the main solution of exercise 9 runs
- **THEN** the ball moves one step every 300 ms

#### Scenario: Two obstacles
- **WHEN** the Extra solution of exercise 8 sends two obstacles in a row
- **THEN** they are about 5 pixels apart, so the figure can clear both by jumping twice

### Requirement: Course overview
`docs/courses/README.md` SHALL list the exercises with their level and buttons, and link each one's worksheet section, main solution and Extra solution. It SHALL explain the two ways to use a solution: paste it into the editor's JavaScript view and switch to Blocks, or build and flash it with `docs/examples/build-and-flash.sh`. It SHALL say that the solutions are written for a 16x16 matrix and that a smaller matrix needs the setup and program logic adapted.

#### Scenario: Using a solution
- **WHEN** a teacher wants to run a solution on a board
- **THEN** the overview gives both ways, including the `build-and-flash.sh` command line for a solution file

#### Scenario: Smaller matrix
- **WHEN** a teacher has a matrix smaller than 16x16
- **THEN** the overview says that the solutions are written for 16x16, that the setup and program logic must be adapted, and that some exercises, such as Pong, make no sense on an 8x8 matrix

### Requirement: Absolute course links
Every link in the course's markdown files to a file or folder of this repository SHALL be an absolute URL on the `main` branch of `https://github.com/waldbaer/pxt-ledmatrix`, so that it works on GitHub and on paper.

#### Scenario: No relative links
- **WHEN** the markdown files in `docs/courses/` are searched for link targets that do not start with `https://` or `#`
- **THEN** none is found
