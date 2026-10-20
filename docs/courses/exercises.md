# LED matrix exercises for the Calliope mini

Ten exercises with the **LED Matrix** extension, sorted from easy to hard.
Exercises 1–5 are pictures and effects, exercises 6–10 are games.
Each exercise has a solution and a solution with the Extra.
[Deutsche Fassung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md) ·
[Course overview](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/README.md)

## Before you start

1. Open [MakeCode for the Calliope mini](https://makecode.calliope.cc/) and a new project. Click
   **Extensions** and paste this address: `https://github.com/waldbaer/pxt-ledmatrix`.
   Don't search for the name: other extensions have similar names.
2. Set up the matrix right at the beginning, in the `on start` block:

   **set matrix to** `LED matrix at pin P0 width 16 height 16`

3. Important: what you draw appears only when you use the `show changes` block.
4. The simulator doesn't show the matrix. Load your programs onto the Calliope (**Download**) and test them there.
5. Blocks for shapes, for example `move by` or `set brightness`, first show the variable `rechteck`.
   Choose your own shape in the block's dropdown, for example `herz` or `korb`.

> **For adults:** The exercises expect a 16x16 matrix whose LED chain starts at the top
> left and runs down the columns in zig-zag. If it is wired differently, add the
> `set wiring` block right after the setup (category LED Matrix, under "more").
> The matrix needs its own 5 V power supply with its GND connected to the Calliope's GND:
> all white, it draws about 2 A even at brightness 32. So keep the brightness at 32 or
> lower. Wiring and power: see the [README](https://github.com/waldbaer/pxt-ledmatrix/blob/main/README.md).

---

## 1. My first picture ⭐

**Task:** Light up the four corners of the matrix in four different colors.
Then paint a purple square in the middle.

**Blocks you need:** `LED matrix at pin` (see above), `set pixel`, `rectangle` (from "Shapes"),
`show changes`

**Tip:** The top left corner is x 0, y 0. The bottom right corner is x 15, y 15.

**Extra:** Instead of the square, paint your initial letter with pixels.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture-extra.js)

---

## 2. Rainbow ⭐

**Task:** Paint 16 vertical lines next to each other, each in a different color.

**Blocks you need:** `for index from 0 to 15`, `line` (from "Shapes"), `hue`

**Tip:** Use `index × 20` as the hue. That gives each line a new color.

**Extra:** Make the lines horizontal. Or let the rainbow move: stamp each line
with `stamp into drawing`, and after the loop take the lines away with
`delete all shapes`. Then the rainbow moves with
`shift drawing by` and `wrap around edges`.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow-extra.js)

---

## 3. Magic lamp ⭐ · buttons A and B

**Task:** Button A gives the whole matrix the next color.
Button B turns the lamp off.

**Blocks you need:** `on button A clicked`, a variable `farbe`,
`fill with`, `hue`, `clear`

**Tip:** Every time A is pressed, count the variable `farbe` up by 30 (`change farbe by 30`).
Also use `show changes` once in the `on start` block, so the lamp starts off.

**Extra:** A+B together makes a disco: change the color five times, very fast.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp-extra.js)

---

## 4. Beating heart ⭐⭐ · buttons A and B

**Task:** A heart beats: bright red, dark red, bright red …
With A it beats faster, with B slower.

**Blocks you need:** `pattern … at x … y …` (from "Shapes", click the heart
into the grid), `set brightness` (from "Shapes"), `forever`, `pause`, `if … then`,
a variable `tempo`

**Tip:** With `set brightness` 40 the heart turns dark, with 255 bright again.
`tempo` is the pause after each beat: start with 600 and change it by 100.

**Extra:** When the heart beats very fast, it turns purple (`set color`).

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart-extra.js)

---

## 5. Running arrow ⭐⭐ · buttons A and B

**Task:** A green arrow keeps running round the matrix.
A sends it to the left, B to the right.

**Blocks you need:** `pattern … at x … y …` (from "Shapes"),
`wrap around edges`, `move by`, a variable `richtung`

**Tip:** `richtung` is 1 for right and -1 for left. Always move the arrow by x `richtung`.

**Extra:** Draw a car or a fish instead of the arrow.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow-extra.js)

---

## 6. Game: Reaction duel ⭐⭐ · for two, A against B

**Task:** The matrix is dark and suddenly turns green after a random time.
Whoever presses first wins: A colors the left half red, B the right half blue.

**Blocks you need:** `pick random … to …`, `on button A pressed down`,
`if … then`, `while`, a variable `los` (true or false), `rectangle`, `fill with`,
`delete all shapes`

**Tip:** A button only counts when `los` is true. Whoever wins sets `los` to false.
The halves are rectangles, 8 wide and 16 high. `clear` only takes away the drawing,
the rectangles only disappear with `delete all shapes`.

**Extra:** Whoever presses too early loses the round.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel-extra.js)

---

## 7. Game: Apple catcher ⭐⭐⭐ · buttons A and B

**Task:** Red apples fall from the top. Move the blue basket with A and B and
catch them. When an apple is missed, the Calliope shows your points.

**Blocks you need:** `rectangle` and `dot` (from "Shapes"), `move by`,
`can move by …`, `overlaps`, `set position`, `y`,
`pick random … to …`, `show number`

**Tip:** The basket is a rectangle of width 4 and height 1 in the bottom row (y 15).
When `apfel y` is greater than 15, the apple has fallen out at the bottom.

**Extra:** With every point the apples fall a little faster.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher-extra.js)

---

## 8. Game: Jump game ⭐⭐⭐ · button A

**Task:** Your yellow figure stands on green ground, and red obstacles come
from the right. With A you jump over them. Each obstacle you clear gives a point.

**Blocks you need:** `line` (the ground), `rectangle` (the figure), `dot` (the obstacle),
`move by`, `set position`, `x`, `overlaps`, `show number`, variables `punkte` and `luft`

**Tip:** `luft` counts how long you are still in the air. Set it to 3 when jumping,
make it 1 smaller in each round. At 0 you land again.

**Extra:** Sometimes two obstacles come close together, 5 pixels apart:
then you jump twice.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game-extra.js)

---

## 9. Game: Pong for one ⭐⭐⭐⭐ · buttons A and B

**Task:** A ball bounces off the walls. Keep it in play with your paddle
at the bottom. Each hit is a point.

**Blocks you need:** `rectangle`, `dot`, `move by`, `can move by …`,
`overlaps`, `x`, `y`, `or`, `set position`, `show number`, variables `dx` and `dy`

**Tip:** `dx` and `dy` are the direction of the ball (1 or -1). When it hits a wall,
`dx` becomes the opposite: `dx = 0 - dx`. Let the ball take a step every 300 ms.

**Extra:** When the ball hits the edge of the paddle, it flies off at a steeper angle.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo-extra.js)

---

## 10. Game: Pong for two ⭐⭐⭐⭐ · buttons A and B, pins P1 and P2

**Task:** Person 1 moves the red paddle at the bottom with A and B.
Person 2 moves the blue paddle at the top with the touch pins P1 and P2.
Whoever lets the ball through loses: the matrix then lights up in the color of the side that won.

**Blocks you need:** everything from exercise 9, plus `on pin P1 pressed down` and `fill with`

**Tip:** When touching a touch pin, touch the minus pin with another finger at the same time.

**Extra:** Count the points. The first to 5 wins.

**Links:** [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo.js) ·
[Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo-extra.js)

---

## Tips for guiding the class

- **Looking at solutions:** open a solution, copy the code, paste it into MakeCode under **JavaScript**
  and switch to **Blocks**. How to load a solution straight onto the Calliope is in the
  [course overview](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/README.md).
- **Games 7–10** work well in two steps: first build only the controls
  (move the basket or paddle), then add the ball or the apples.
- **Scores** appear on the Calliope's built-in 5x5 LEDs.
