# LED-Matrix-Übungen für den Calliope mini

Zehn Übungen mit der Erweiterung **LED-Matrix**, von leicht nach schwer sortiert.
Die Übungen 1–5 sind Bilder und Effekte, die Übungen 6–10 sind Spiele.
Zu jeder Übung gibt es eine Lösung und eine Lösung mit Extra.
[English version](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/exercises.md) ·
[Kursübersicht](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/README.md)

## Bevor du anfängst

1. Öffne [MakeCode für den Calliope mini](https://makecode.calliope.cc/) und ein neues Projekt. Klicke auf
   **Erweiterungen** und füge diese Adresse ein: `https://github.com/waldbaer/pxt-ledmatrix`.
   Suche nicht nach dem Namen: Andere Erweiterungen heißen ähnlich.
2. Richte ganz am Anfang, im Block `beim Start`, die Matrix ein:

   **setze matrix auf** `LED-Matrix an Pin P0 Breite 16 Höhe 16`

3. Wichtig: Was du zeichnest, erscheint erst, wenn du den Block `Änderungen anzeigen` benutzt.
4. Der Simulator zeigt die Matrix nicht. Lade deine Programme auf den Calliope (**Herunterladen**) und teste sie dort.
5. Blöcke für Formen, zum Beispiel `bewege um` oder `setze Helligkeit`, zeigen zuerst die Variable `rechteck`.
   Wähle im Dropdown des Blocks deine eigene Form aus, zum Beispiel `herz` oder `korb`.

> **Für Erwachsene:** Die Übungen erwarten eine 16x16-Matrix, deren LED-Kette oben links
> beginnt und in Spalten im Zickzack läuft. Ist sie anders verdrahtet, direkt nach dem
> Einrichten den Block `setze Verdrahtung` einfügen (Kategorie LED-Matrix, unter „mehr“).
> Die Matrix braucht ein eigenes 5-V-Netzteil, dessen GND mit dem GND des Calliope verbunden ist:
> Ganz weiß zieht sie schon bei der Helligkeit 32 etwa 2 A. Die Helligkeit deshalb bei 32 oder
> niedriger lassen. Anschluss und Strom: siehe [README](https://github.com/waldbaer/pxt-ledmatrix/blob/main/README.md).

---

## 1. Mein erstes Bild ⭐

**Aufgabe:** Lass die vier Ecken der Matrix in vier verschiedenen Farben leuchten.
Male dann ein lila Quadrat in die Mitte.

**Diese Blöcke brauchst du:** `LED-Matrix an Pin` (siehe oben), `setze Pixel`, `Rechteck` (aus „Formen“),
`Änderungen anzeigen`

**Tipp:** Die Ecke oben links ist x 0, y 0. Die Ecke unten rechts ist x 15, y 15.

**Extra:** Male statt des Quadrats deinen Anfangsbuchstaben mit Pixeln.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/01-first-picture-extra.js)

---

## 2. Regenbogen ⭐

**Aufgabe:** Male 16 senkrechte Linien nebeneinander, jede in einer anderen Farbe.

**Diese Blöcke brauchst du:** `für index von 0 bis 15`, `Linie` (aus „Formen“), `Farbton`

**Tipp:** Nimm als Farbton `index × 20`. So bekommt jede Linie eine neue Farbe.

**Extra:** Mach die Linien waagerecht. Oder lass den Regenbogen wandern: Stemple jede
Linie mit `in die Zeichnung stempeln` ein und nimm nach der Schleife mit
`alle Formen löschen` die Linien weg. Dann wandert der Regenbogen mit
`verschiebe Zeichnung` und `an den Rändern umbrechen`.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/02-rainbow-extra.js)

---

## 3. Zauberlampe ⭐ · Knöpfe A und B

**Aufgabe:** Knopf A gibt der ganzen Matrix die nächste Farbe.
Knopf B schaltet die Lampe aus.

**Diese Blöcke brauchst du:** `wenn Knopf A geklickt`, eine Variable `farbe`,
`fülle mit`, `Farbton`, `löschen`

**Tipp:** Zähle bei jedem Druck auf A die Variable `farbe` um 30 hoch (`ändere farbe um 30`).
Benutze auch im Block `beim Start` einmal `Änderungen anzeigen`, dann ist die Lampe am Anfang aus.

**Extra:** A+B zusammen macht eine Disco: fünfmal ganz schnell die Farbe wechseln.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/03-magic-lamp-extra.js)

---

## 4. Klopfendes Herz ⭐⭐ · Knöpfe A und B

**Aufgabe:** Ein Herz schlägt: hell rot, dunkel rot, hell rot …
Mit A schlägt es schneller, mit B langsamer.

**Diese Blöcke brauchst du:** `Muster … bei x … y …` (aus „Formen“, klicke das Herz
in das Raster), `setze Helligkeit` (aus „Formen“), `dauerhaft`, `pausiere`, `wenn … dann`,
eine Variable `tempo`

**Tipp:** Mit `setze Helligkeit` 40 wird das Herz dunkel, mit 255 wieder hell.
`tempo` ist die Pause nach jedem Schlag: Fang mit 600 an und ändere sie um 100.

**Extra:** Bei sehr schnellem Herzschlag wird das Herz lila (`setze Farbe`).

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/04-beating-heart-extra.js)

---

## 5. Laufband ⭐⭐ · Knöpfe A und B

**Aufgabe:** Ein grüner Pfeil läuft immer rundherum über die Matrix.
A schickt ihn nach links, B nach rechts.

**Diese Blöcke brauchst du:** `Muster … bei x … y …` (aus „Formen“),
`an den Rändern umbrechen`, `bewege um`, eine Variable `richtung`

**Tipp:** `richtung` ist 1 für rechts und -1 für links. Bewege den Pfeil immer um x `richtung`.

**Extra:** Zeichne statt des Pfeils ein Auto oder einen Fisch.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/05-running-arrow-extra.js)

---

## 6. Spiel: Reaktions-Duell ⭐⭐ · zu zweit, A gegen B

**Aufgabe:** Die Matrix ist dunkel und wird nach einer zufälligen Zeit plötzlich grün.
Wer zuerst drückt, gewinnt: A färbt die linke Hälfte rot, B die rechte Hälfte blau.

**Diese Blöcke brauchst du:** `wähle eine zufällige Zahl von … bis …`, `wenn Knopf A gedrückt`,
`wenn … dann`, `während`, eine Variable `los` (wahr oder falsch), `Rechteck`, `fülle mit`,
`alle Formen löschen`

**Tipp:** Ein Knopf zählt nur, wenn `los` wahr ist. Wer gewinnt, setzt `los` auf falsch.
Die Hälften sind Rechtecke, 8 breit und 16 hoch. `löschen` nimmt nur die Zeichnung weg,
die Rechtecke verschwinden erst mit `alle Formen löschen`.

**Extra:** Wer zu früh drückt, verliert die Runde.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/06-reaction-duel-extra.js)

---

## 7. Spiel: Apfelfänger ⭐⭐⭐ · Knöpfe A und B

**Aufgabe:** Rote Äpfel fallen von oben. Bewege den blauen Korb mit A und B und
fang sie. Fällt ein Apfel daneben, zeigt der Calliope deine Punkte.

**Diese Blöcke brauchst du:** `Rechteck` und `Punkt` (aus „Formen“), `bewege um`,
`kann sich um … bewegen`, `berührt`, `setze Position`, `y`,
`wähle eine zufällige Zahl von … bis …`, `zeige Nummer`

**Tipp:** Der Korb ist ein Rechteck mit Breite 4 und Höhe 1 in der untersten Zeile (y 15).
Ist `apfel y` größer als 15, ist der Apfel unten heraus gefallen.

**Extra:** Mit jedem Punkt fallen die Äpfel ein bisschen schneller.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/07-apple-catcher-extra.js)

---

## 8. Spiel: Hüpf-Spiel ⭐⭐⭐ · Knopf A

**Aufgabe:** Deine gelbe Figur steht auf grünem Boden, und von rechts kommen rote
Hindernisse. Mit A springst du darüber. Jedes übersprungene Hindernis gibt einen Punkt.

**Diese Blöcke brauchst du:** `Linie` (der Boden), `Rechteck` (die Figur), `Punkt` (das Hindernis),
`bewege um`, `setze Position`, `x`, `berührt`, `zeige Nummer`, Variablen `punkte` und `luft`

**Tipp:** `luft` zählt, wie lange du noch in der Luft bist. Beim Springen auf 3 setzen,
in jeder Runde um 1 verkleinern. Bei 0 landest du wieder.

**Extra:** Manchmal kommen zwei Hindernisse kurz hintereinander, 5 Pixel auseinander:
Dann springst du zweimal.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/08-jump-game-extra.js)

---

## 9. Spiel: Pong für eine Person ⭐⭐⭐⭐ · Knöpfe A und B

**Aufgabe:** Ein Ball prallt an den Wänden ab. Halte ihn mit deinem Schläger unten
im Spiel. Jeder Treffer ist ein Punkt.

**Diese Blöcke brauchst du:** `Rechteck`, `Punkt`, `bewege um`, `kann sich um … bewegen`,
`berührt`, `x`, `y`, `oder`, `setze Position`, `zeige Nummer`, Variablen `dx` und `dy`

**Tipp:** `dx` und `dy` sind die Richtung des Balls (1 oder -1). Trifft er eine Wand,
wird aus `dx` das Gegenteil: `dx = 0 - dx`. Lass den Ball alle 300 ms einen Schritt machen.

**Extra:** Wird der Ball am Schlägerrand getroffen, fliegt er schräger.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/09-pong-solo-extra.js)

---

## 10. Spiel: Pong zu zweit ⭐⭐⭐⭐ · Knöpfe A und B, Pins P1 und P2

**Aufgabe:** Person 1 steuert den roten Schläger unten mit A und B.
Person 2 steuert den blauen Schläger oben mit den Touch-Pins P1 und P2.
Wer den Ball durchlässt, verliert: Die Matrix leuchtet dann in der Farbe der Seite, die gewonnen hat.

**Diese Blöcke brauchst du:** alles aus Übung 9, dazu `wenn Pin P1 gedrückt` und `fülle mit`

**Tipp:** Beim Touch-Pin mit dem anderen Finger gleichzeitig den Minus-Pin berühren.

**Extra:** Zähle die Punkte. Wer zuerst 5 hat, gewinnt.

**Links:** [Lösung](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo.js) ·
[Lösung mit Extra](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/solutions/10-pong-duo-extra.js)

---

## Tipps für die Begleitung

- **Lösungen ansehen:** Lösung öffnen, den Code kopieren, in MakeCode unter **JavaScript** einfügen
  und auf **Blöcke** umschalten. Wie man eine Lösung direkt auf den Calliope lädt, steht in der
  [Kursübersicht](https://github.com/waldbaer/pxt-ledmatrix/blob/main/docs/courses/README.md).
- **Spiele 7–10** gehen gut in zwei Schritten: zuerst nur die Steuerung bauen
  (Korb oder Schläger bewegen), dann den Ball oder die Äpfel dazu.
- **Punktestände** erscheinen auf den eingebauten 5x5-LEDs des Calliope.
