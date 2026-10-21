# Spec Delta

## MODIFIED Requirements

### Requirement: Compact README
Each of the two language sections of `README.md` SHALL be at most 130 lines, not counting the MakeCode embed script line. Each SHALL cover: adding the extension, a quick start with the default layout, the layout settings with chain diagrams, a wiring troubleshooting table that refers to the example, a one-line-per-function API overview by group, and a link to the course. It SHALL NOT give instructions for wiring or powering the matrix.

#### Scenario: Adding the extension
- **WHEN** a reader wants to use the extension
- **THEN** each section tells them to open Extensions in MakeCode and paste `https://github.com/waldbaer/pxt-ledmatrix`, and mentions searching for the extension only if MakeCode search was verified to find it

#### Scenario: Power and pin notes
- **WHEN** the README is read
- **THEN** neither section has a wiring schematic, says which board pins to connect to the matrix, recommends a power supply or level shifter, gives current figures or sets a brightness limit

#### Scenario: Troubleshooting
- **WHEN** a reader's panel shows a garbled picture
- **THEN** each section maps each symptom of the wiring-check example (square splits, wrong corner, wrong direction) to the setting to change

#### Scenario: Course link
- **WHEN** a teacher looks for lessons
- **THEN** each section links `docs/courses/` on GitHub, which holds the worksheets and solutions

#### Scenario: Line count
- **WHEN** the lines from `## Deutsch` to `## English` and from `## English` to the metadata lines are counted
- **THEN** each count is at most 130
