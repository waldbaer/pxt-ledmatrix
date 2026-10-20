# Proposal

## Why

The extension is made for the Calliope mini, used mainly in German schools. Its blocks are already German in a German editor, but everything else a pupil or teacher meets first is English: the README, the `pxt.json` description, the variables the blocks create (`shape`, `number`) and the order of the example comments. German becomes the primary language. English stays as the second language, and the API stays English.

## What Changes

- Default variables of the blocks are German. Create blocks: `rechteck`, `kreis`, `linie`, `punkt`, `muster`, `zahl`; `matrix` stays. Shape blocks: `zahl` for "set number", `muster` for rotate, flip and set pattern, `rechteck` for all others. MakeCode cannot translate these names, so English editors show them too. Existing projects keep their names.
- `README.md`: a German section, then an English section with the same content, and jump links to both at the top. The line limit applies per section. The false claim that MakeCode search finds the extension is removed.
- `pxt.json` description: German, then ` | `, then English.
- Example comments: `// DE:` first, then `// EN:`. Identifiers in the examples stay English.
- CHANGELOG (English): two lines under `[0.3.0]`.
- Not included: German API names, German block texts in the source (they stay in `_locales/de`), and why MakeCode search does not find the extension.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `extension-package`: new requirements for German default variables, the bilingual README and the bilingual `pxt.json` description. "Compact README" counts lines per language section. "Bilingual example comments" puts German first.

## Impact

- Code: `blockSetVariable` and `.defl` annotations in `main.ts` and `shapes.ts`. No API, behavior or flash size change.
- Docs: `README.md`, `pxt.json`, `CHANGELOG.md`, the comments in `examples/*.js`.
- Outside the repo: the GitHub "About" text, which MakeCode search shows, is set by hand to the new `pxt.json` description.
