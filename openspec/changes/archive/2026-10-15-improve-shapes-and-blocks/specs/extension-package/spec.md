# Spec Delta

## MODIFIED Requirements

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
