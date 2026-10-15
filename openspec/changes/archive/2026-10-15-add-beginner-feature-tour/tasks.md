# Tasks

"Build" means `examples/build-and-flash.sh <file>` (Calliope mini 3) reaches `hex:`; "on the panel" means it also flashes and the program is watched on the 16x16 panel. "Code diff" means `diff <(git show HEAD:<old> | grep -v -e '^\s*//' -e '^\s*$') <(grep -v -e '^\s*//' -e '^\s*$' <new>)`.

## 1. Existing examples: renames and bilingual comments (spec: "Feature tours", "Bilingual example comments", "Wiring-check example"; design D1, D2)

- [x] 1.1 `git mv examples/feature-tour.js examples/feature-tour-intermediate.js` and rewrite its comments in the D1 format, keeping the board hint (Calliope mini 3 or micro:bit). Verify that `git status` shows a rename, the code diff is empty, and it builds.
- [x] 1.2 `git mv examples/feature-tour-2.js examples/feature-tour-advanced.js` and rewrite its comments in the D1 format; "Same setup as feature-tour.js" names the intermediate tour. Verify that `git status` shows a rename, the code diff is empty, and it builds.
- [x] 1.3 In `examples/wiring-check.js`, start the header with what it is for (run it first on a new panel to find the layout and color order settings), then rewrite all comments in the D1 format. Verify that the code diff is empty and on the panel the square walks clockwise as before.
- [x] 1.4 README line 27 links the intermediate and advanced tours under their new names; the usage example in `examples/build-and-flash.sh` names `feature-tour-intermediate.js`; the CHANGELOG `[0.2.0]` entry gets a "Changes" bullet for the renames and the bilingual comments. Verify that `grep -rn "feature-tour\.js\|feature-tour-2" README.md CHANGELOG.md examples/*.js examples/*.sh` finds only the CHANGELOG bullet and `wc -l README.md` gives 120.

## 2. Beginner tour (spec: "Feature tours", "Beginner tour covers every block", "Beginner tour pace", "Beginner tour code"; design D3, D4)

- [x] 2.1 Create `examples/feature-tour-beginner.js` with the D3 header (board hint, what the tour shows, the scene list, how `WAIT` works, the whiteboard-and-magnets idea), the setup variables, the helpers and scenes 1 and 2 from D4. Verify on the panel: the pixel of scene 1 appears only after `show`, and scene 2 builds the house picture step by step and clears it.
  2.1 to 2.4 were verified from the frames the tour sends: run in the simulator with `ledmatrix._sendHook` recording every frame, rendered as images (scratch tooling, not committed). The tour was also flashed onto the board; the eye check on the panel is part of 3.3.
- [x] 2.2 Add scenes 3 to 5. Verify on the panel: red + green gives yellow, the rainbow band, the countdown 5 to 0, and the picture that slides out and then wraps around.
- [x] 2.3 Add scenes 6 and 7. Verify on the panel: `clear` keeps the shapes, deleting all shapes keeps the drawing, the ghost fades without turning black, and the square and the ball take turns being in front.
- [x] 2.4 Add scenes 8 to 10. Verify on the panel: the fish mirrors at the wall and stays mirrored, the face winks, the car stops one step before the other, the square goes green, yellow, red, the rainbow snake shows the zig-zag columns, the dimming stays at or below 32, and the dot takes the color above it.
- [x] 2.5 Run the two D5 checks (coverage, code). Verify that coverage reports only `setLayout` and `setColorOrder` as missing and the code check finds nothing.
  Result: 53 blocks, missing only `setLayout` and `setColorOrder`; code check found nothing.
- [x] 2.6 Set `WAIT` to 500 and watch one loop, then set it back to 1000. Verify on the panel that every step and animation runs about twice as fast and every scene number matches a `Scene <n>` comment.
  Result (recorded frames): one loop is 162 s at 1000 and 81 s at 500, with the same 333 frames and every pause halved; scenes 1 to 10 match their comments.
- [x] 2.7 Add the beginner tour to README line 27 and a "Features" bullet to the CHANGELOG `[0.2.0]` entry. Verify that the link resolves and `wc -l README.md` gives 120.
  The user replaced the CHANGELOG bullets of this change with "Improve examples.", which covers the new tour, so no further bullet is added.

## 3. Integration checks

- [x] 3.1 Check the comments of all four examples with a short script: every comment line starts with `// EN:`, `// DE:` or a continuation `//     `, and every `EN:` part is followed directly by a `DE:` part. Verify that the script prints nothing.
- [x] 3.2 Build all four examples, run `openspec validate add-beginner-feature-tour --strict`, and check `wc -l README.md` ≤ 120. Verify that all of these pass.
- [x] 3.3 Manual check by the user: read the beginner tour (both languages) and watch one loop of every tour on the panel. Verify with the user's confirmation.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review.
