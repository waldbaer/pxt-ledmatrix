# Spec Delta

## ADDED Requirements

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
