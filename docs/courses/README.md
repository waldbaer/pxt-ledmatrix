# LED-Matrix-Kurs · LED matrix course

[Deutsch](#deutsch) · [English](#english)

## Deutsch

Zehn Übungen für den Calliope mini mit der Erweiterung **LED-Matrix**, von bunten Bildern bis zu Spielen,
auf dem [Übungsblatt](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md), mit einer Lösung und einer Lösung mit Extra für jede Übung.
Ihr braucht einen Calliope mini 1, 2 oder 3 und eine Matrix mit WS2812B-LEDs an Pin P0. Die Lösungen sind für eine 16x16-Matrix geschrieben. Für eine kleinere passt ihr die Einrichtung und die Programmlogik an; manche Übungen wie Pong ergeben auf einer 8x8-Matrix aber keinen Sinn.

| Nr. | Übung | Stufe | Steuerung | Lösungen |
|---|---|---|---|---|
| 1 | [Mein erstes Bild](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#1-mein-erstes-bild-) | ⭐ | – | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture-extra.js) |
| 2 | [Regenbogen](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#2-regenbogen-) | ⭐ | – | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow-extra.js) |
| 3 | [Zauberlampe](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#3-zauberlampe---knöpfe-a-und-b) | ⭐ | Knöpfe A und B | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp-extra.js) |
| 4 | [Klopfendes Herz](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#4-klopfendes-herz---knöpfe-a-und-b) | ⭐⭐ | Knöpfe A und B | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart-extra.js) |
| 5 | [Laufband](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#5-laufband---knöpfe-a-und-b) | ⭐⭐ | Knöpfe A und B | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow-extra.js) |
| 6 | [Reaktions-Duell](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#6-spiel-reaktions-duell---zu-zweit-a-gegen-b) | ⭐⭐ | zu zweit, A gegen B | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel-extra.js) |
| 7 | [Apfelfänger](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#7-spiel-apfelfänger---knöpfe-a-und-b) | ⭐⭐⭐ | Knöpfe A und B | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher-extra.js) |
| 8 | [Hüpf-Spiel](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#8-spiel-hüpf-spiel---knopf-a) | ⭐⭐⭐ | Knopf A | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game-extra.js) |
| 9 | [Pong für eine Person](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#9-spiel-pong-für-eine-person---knöpfe-a-und-b) | ⭐⭐⭐⭐ | Knöpfe A und B | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo-extra.js) |
| 10 | [Pong zu zweit](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/uebungen.md#10-spiel-pong-zu-zweit---knöpfe-a-und-b-pins-p1-und-p2) | ⭐⭐⭐⭐ | Knöpfe A und B, Pins P1 und P2 | [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo.js) · [Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo-extra.js) |

### Lösungen benutzen

1. **In MakeCode:** neues Projekt, die Erweiterung hinzufügen, oben auf **JavaScript** umschalten, den Code der Lösung
   einfügen und zurück auf **Blöcke** schalten.
2. **Direkt auf den Calliope:** Mit einer Kopie dieses Repositorys und Node.js baut und lädt
   [build-and-flash.sh](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/examples/build-and-flash.sh) eine Lösung:

   ```
   cd docs/examples
   ./build-and-flash.sh ../courses/solutions/03-magic-lamp.js        # Calliope mini 3
   ./build-and-flash.sh ../courses/solutions/03-magic-lamp.js v1     # Calliope mini 1 (v2: mini 2)
   ```

## English

Ten exercises for the Calliope mini with the **LED Matrix** extension, from colorful pictures to games,
on the [worksheet](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md), with a solution and a solution with the Extra for each exercise.
You need a Calliope mini 1, 2 or 3 and a matrix of WS2812B LEDs on pin P0. The solutions are written for a 16x16 matrix. For a smaller one, adapt the setup and the program logic; some exercises such as Pong make no sense on an 8x8 matrix.

| No. | Exercise | Level | Controls | Solutions |
|---|---|---|---|---|
| 1 | [My first picture](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#1-my-first-picture-) | ⭐ | – | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture-extra.js) |
| 2 | [Rainbow](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#2-rainbow-) | ⭐ | – | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow-extra.js) |
| 3 | [Magic lamp](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#3-magic-lamp---buttons-a-and-b) | ⭐ | buttons A and B | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp-extra.js) |
| 4 | [Beating heart](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#4-beating-heart---buttons-a-and-b) | ⭐⭐ | buttons A and B | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart-extra.js) |
| 5 | [Running arrow](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#5-running-arrow---buttons-a-and-b) | ⭐⭐ | buttons A and B | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow-extra.js) |
| 6 | [Reaction duel](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#6-game-reaction-duel---for-two-a-against-b) | ⭐⭐ | for two, A against B | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel-extra.js) |
| 7 | [Apple catcher](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#7-game-apple-catcher---buttons-a-and-b) | ⭐⭐⭐ | buttons A and B | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher-extra.js) |
| 8 | [Jump game](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#8-game-jump-game---button-a) | ⭐⭐⭐ | button A | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game-extra.js) |
| 9 | [Pong for one](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#9-game-pong-for-one---buttons-a-and-b) | ⭐⭐⭐⭐ | buttons A and B | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo-extra.js) |
| 10 | [Pong for two](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md#10-game-pong-for-two---buttons-a-and-b-pins-p1-and-p2) | ⭐⭐⭐⭐ | buttons A and B, pins P1 and P2 | [Solution](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo.js) · [Solution with Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo-extra.js) |

### Using a solution

1. **In MakeCode:** new project, add the extension, switch to **JavaScript** at the top, paste the solution's code
   and switch back to **Blocks**.
2. **Straight onto the Calliope:** with a copy of this repository and Node.js,
   [build-and-flash.sh](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/examples/build-and-flash.sh) builds and loads a solution:

   ```
   cd docs/examples
   ./build-and-flash.sh ../courses/solutions/03-magic-lamp.js        # Calliope mini 3
   ./build-and-flash.sh ../courses/solutions/03-magic-lamp.js v1     # Calliope mini 1 (v2: mini 2)
   ```
