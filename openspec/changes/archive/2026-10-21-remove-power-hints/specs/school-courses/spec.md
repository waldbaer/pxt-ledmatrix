# Spec Delta

## MODIFIED Requirements

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

### Requirement: Course overview
`docs/courses/README.md` SHALL list the exercises with their level and buttons, and link each one's worksheet section, main solution and Extra solution. It SHALL explain the two ways to use a solution: paste it into the editor's JavaScript view and switch to Blocks, or build and flash it with `docs/examples/build-and-flash.sh`. It SHALL say that the solutions are written for a 16x16 matrix and that a smaller matrix needs the setup and program logic adapted.

#### Scenario: Using a solution
- **WHEN** a teacher wants to run a solution on a board
- **THEN** the overview gives both ways, including the `build-and-flash.sh` command line for a solution file

#### Scenario: Smaller matrix
- **WHEN** a teacher has a matrix smaller than 16x16
- **THEN** the overview says that the solutions are written for 16x16, that the setup and program logic must be adapted, and that some exercises, such as Pong, make no sense on an 8x8 matrix
