# Fallpfad Designsystem

Stand: November 2026. Lebende Übersicht mit allen Bausteinen: `styleguide.html` (im Browser öffnen).
Technische Quellen: `css/08-system.css` (Tokens und Regeln), `js/training/30-mikro-effekte.js` (Bewegung),
`js/training/03-figuren-im-stil-der-module.js` (Gesichter), `js/training/04-illustrationen-fuer-die-praktische.js` (Räume, Bett, Objekte),
`js/training/05-figuren.js` (Ganzkörperfiguren), `js/training/46-szenen-system.js` (Szenen-Baukasten).

## 1. Leitidee

**Ruhig, klinisch klar, menschlich warm.** Die Persönlichkeit der App liegt in ihren Menschen, nicht im Rahmen.
Die Patientengesichter sind der Qualitätsanker. Alles andere tritt hinter sie zurück:
Navigation, Karten und Knöpfe sind leise und vertraut (iOS-nah), damit Gesichter, Szenen und Inhalte wirken.

| Prinzip | Prüffrage |
|---|---|
| Die Gesichter führen | Ist dieses Element ruhiger als die Gesichter daneben? |
| Eine Farbe, eine Bedeutung | Kann ich sagen, was diese Farbe hier bedeutet? |
| Bewegung erklärt | Antwortet die Bewegung auf eine Handlung oder zeigt sie eine Veränderung? |
| Ruhig vor laut | Lässt sich ein Element entfernen, ohne dass Information fehlt? |
| Fachlich korrekt | Stimmt die Darstellung pflegerisch (Lagerung, Material, Ablauf)? |

## 2. Farbe

| Rolle | Wert | Verwendung |
|---|---|---|
| Akzent | `--accent` (Standard `#0062FF`, in den Einstellungen wählbar) | Bedienung, aktive Auswahl, Links |
| Text | `--fg` `#0f172a` | Fließtext, Überschriften |
| Gedämpft | `--muted` `#5b6b82` | Nebentext, Überzeilen |
| Fläche | `--surface` `#ffffff`, Hintergrund `--bg` `#f7f9fc` | Karten, Seite |
| Status | `--ok` `#10B981`, `--warn` `#F59E0B`, `--bad` `#EF4444` | **nur** für Status (richtig, Achtung, kritisch) |

Regeln:
- Navigation (Seitenleiste, Tab-Leiste) ist einfarbig. Aktiver Bereich: Akzent.
- Bereichsfarben (`--c` an Kacheln) erscheinen nur als Tönung im Symbolfeld (12 % Fläche, Symbol in der Bereichsfarbe), nie als gesättigter Kreis.
- Keine dekorativen Verläufe, Kreise oder Blasen auf Karten.
- Dunkler Modus: alle Werte haben dunkle Entsprechungen (`css/01-basis.css`, `css/08-system.css`). Illustrationen behalten ihre Farbwelt und werden nur leicht gedämpft.

## 3. Typografie

Systemschrift (SF Pro auf Apple-Geräten, sonst Inter/Segoe/Roboto). Hierarchie über Größe und Gewicht.

| Stil | Größe | Gewicht |
|---|---|---|
| Large Title | 34 | 700 |
| Title 1 | 28 | 700 |
| Title 2 | 22 | 700 |
| Headline | 17 | 600 |
| Body | 17 (Lesetext 15–17) | 400, Zeilenhöhe 1,5 |
| Subhead | 15 | 400, gedämpft |
| Überzeile | 13 | 600, gedämpft |

Regeln:
- **Keine Versalien mit Sperrung** für Überzeilen oder Abschnittstitel. Normale Schreibweise.
- Statusmarken (z. B. „Wichtig“) kurz und in normaler Schreibweise.
- Zeilenlänge im Fließtext höchstens etwa 70 Zeichen.

## 4. Flächen, Radien, Abstände

- Radius nach Ebene: 6 Marke · 10 Eingabe · 12 Knopf/Symbolfeld · 16 Karte · 22 Blatt/Hero.
- Erhebung: `--elev-1` für alle Karten; `--elev-2` nur für schwebende Ebenen (Menüs, Hinweise, Hover am Desktop).
- Abstände im 4er-Raster: 4, 8, 12, 16, 20, 24, 32, 40. Seitenrand am Handy 16.
- Tippflächen mindestens 44 × 44 pt (Minimum 24 px nach WCAG 2.2).
- Fixe Overlays dürfen keine Inhalte verdecken. Der Demo-Hinweis ist deshalb Teil der Bedienleiste.

## 5. Bewegung

| Token | Wert | Wofür |
|---|---|---|
| `--m-fast` | 140 ms | Druck, Farbwechsel |
| `--m-base` | 220 ms | Zustandswechsel (Auswahl, Schalter) |
| `--m-slow` | 360 ms | Erscheinen von Inhalten, Seitenwechsel |
| `--m-scene` | 600 ms | Schritte in Szenen/Simulationen |
| `--e-standard` | `cubic-bezier(.2,0,0,1)` | Standard |
| `--e-enter` | `cubic-bezier(.05,.7,.1,1)` | Hereinkommen |
| `--e-exit` | `cubic-bezier(.3,0,.8,.15)` | Hinausgehen |

Regeln:
- Bewegung antwortet auf eine Handlung oder zeigt eine Veränderung. Keine Dauer-Effekte auf Bedienelementen.
- **Kein Überschwingen** (keine Skalierung über 100 %, keine „Bounce“-Kurven).
- Druck: `scale(.97)`, 140 ms. Kein Ring bei jedem Antippen, kein Anheben von Karten.
- Seitenwechsel: nur wenn sich Bereich oder Hauptüberschrift ändert, Deckkraft + 6 px.
- Szenen-Umgebung (Atmen, Blinzeln, Tropfen, Rufanlage) ist leise: Atmen 4,8 s mit 1,8 % Höhe, Blinzeln alle 5,6 s, Rufanlage 2,4 s. Nie mehr als drei Hell-Dunkel-Wechsel pro Sekunde (WCAG 2.3.1).
- „Bewegung reduzieren“ schaltet jede Animation ab; Inhalte und Bedienung bleiben gleich.
- Neue Animationen nutzen die Tokens, keine eigenen Dauern oder Kurven.

## 6. Gesichter (Stil-Anker)

Aufbau (`PXAV.head`, Raster 120 × 120):
- ovaler Kopf `rx 25 / ry 29`, Ohren als Kreise `r 6`, Kontur `#1d1d1f`, Strichstärke 3 (2,5 % der Kopfgröße);
- Punktaugen, Brauen und Mund als einfache, runde Linien;
- Stimmung nur über Brauen, Augen und Mund (`neutral, smile, happy, worried, sad, pain, sleepy, tired, talk, surprised, angry`);
- Merkmale über Optionen: `wrinkles, glasses, beard, o2, hearing, pale, cyan, flush, sweat` usw.;
- Haare aus der Bibliothek `PXAVL` (Kürzel wie `HK`, `LE`, `TI`).

Diese Gesichter werden nicht verändert. Jede neue Figur nutzt sie.

## 7. Figuren und Posen

Ganzkörperfiguren (`PXB.F`):

| Funktion | Ursprung | Posen/Optionen |
|---|---|---|
| `F.stand(sp, x, y, o)` | Füße | `pose: down, chart, talk, assist, reach, support, hold, wave, hips`; `h` Gesamthöhe |
| `F.sitSide(sp, x, y, o)` | Gesäß | `arms: lap, rest, forward`, `legs: down, up`, `feet`, `reach`, `flip` |
| `F.sitFront(sp, x, y, o)` | Sitzmitte | `feet`, `legUp`, `blanket` |
| `F.lie(sp, x0, y, len, o)` | Kopfende Matratze | `legs: flat, knee`, `arm` |
| `F.armchair(x, y, o)` | Gesäß | passt zu `sitSide` |

Proportionen und Formen:
- Kopf etwa ein Fünftel der Körperhöhe, damit die Mimik in Szenen lesbar bleibt.
- Hände als Fäustling mit Daumen, entlang des Unterarms ausgerichtet; Hände reichen bis zur Oberschenkelmitte.
- Gliedmaßen als runde Linien mit Kontur (Kontur 3,6 breiter als Füllung).
- Hals verjüngt, unten unter dem Kragen versteckt.
- Kleidung: Patientenhemd mit Punkten (`gown`), Pflegekleidung mit V-Ausschnitt (`scrubs`), mit Namensschild (`badge`).
- Spiegeln (`flip`) spiegelt den Körper, das Gesicht bleibt seitenrichtig.

Posenregeln:
- Jede Pose hat einen Zweck (zuhören, zeigen, reichen, unterstützen). Keine Posen „zur Belebung“.
- Gewicht und Kontakt stimmen: Füße stehen auf dem Boden, Hände berühren, was sie halten.
- Unterstützen am Bett: Pflegekraft steht an der Bettseite, nicht vor dem Fußende.

## 8. Räume, Bett, Objekte

- Raum (`X.room`): Wand `#eef3f8`, Boden `#dbe5ef`, Fugen parallel zur Bodenkante, Sockelleiste, Fenster, Wandversorgung mit kleinen Signalpunkten.
- Bett (`X.bed`, `X.patient`, `X.bedScene`): feste Geometrie, Matratzenoberkante y = 178; Rückenteil `flat` (4°), `semi` (40°), `high` (62°).
  Der Arm liegt auf der Decke, die Hand ist eine echte Hand. Bei `flat` reicht die Decke bis zur Brust.
  Ankerpunkte für weitere Elemente: `X._bed`, `X._pt`, `X._hand`, `X._fore`, `X._feet`.
- Objekte: Kontur 1,6–2,2, gleiche Ecken (Radius 2–8), Signalfarben nur für Bedeutung (Klemme offen/zu, Alarm).
- Vignette nur sehr schwach (4,5 %).

## 9. Szenen

Baukasten `window.FP_SCENE` (`js/training/46-szenen-system.js`): `ward()`, `door()`, `clock()`, `counter()`, `frame()`, `pal`, `people`.

Regeln:
- ViewBox 400 × 280 (Bettszenen) oder 400 × 220 (Breitformat). Boden bei y = 214 bzw. 176.
- Eine Aussage pro Szene. Was die Lernenden tun sollen, steht im Bild im Vordergrund.
- Höchstens drei Personen. Die handelnde Person steht vorn, Nebenpersonen hinten oder angeschnitten.
- Keine Texte im Bild außer Zimmernummern, Beschriftungen und Messwerten.
- Jede Szene hat ein `aria-label`, das beschreibt, was zu sehen ist.
- Szenen sind deterministisch (kein Zufall beim Zeichnen), damit Vorher-nachher-Tests stabil sind.

## 10. Neues Modul oder neue Szene bauen

1. Zweck festlegen: Was soll die Szene zeigen, was sollen Lernende erkennen?
2. Personen aus `FP_SCENE.people` oder im gleichen Format (`hair, hairC, skin, cloth, deco, bg`) anlegen. Nur synthetische Personen.
3. Raum mit `X.defs() + X.room(...)` oder `X.bedScene(...)`; Figuren mit `F.stand/sitSide/...` und einer passenden Pose.
4. Objekte aus `PXB` verwenden; neue Objekte im gleichen Stil (Kontur `#1d1d1f`, 1,6–2,2) in `04-…` oder `46-…` ergänzen.
5. Bewegung nur über Klassen: `fp-breathe`, `.pa-eyes` (Blinzeln), `fp-call`, `pa-drip`, `pa-flow`. Keine eigenen Keyframes ohne Not; wenn doch, mit den Tokens aus Abschnitt 5.
6. In `styleguide.html` einen Eintrag ergänzen, Screenshot hell/dunkel, Handy/Desktop prüfen.
7. Tests laufen lassen (Abschnitt 11).
8. Fachliche Aussagen in Szenen nicht ändern, ohne sie zu kennzeichnen und fachlich prüfen zu lassen.

## 11. Qualitätsprüfung

- `node werkzeuge/tests/rauchtest.mjs .` (alle Bereiche, hell/dunkel, drei Größen, keine JS-Fehler, keine Überbreite)
- `node werkzeuge/tests/ringe-test.mjs . test` (Fortschrittskreise nicht abgeschnitten)
- `node werkzeuge/tests/stationsalltag-test.js` (Simulation)
- `styleguide.html` im Browser: keine Fehler in der Konsole
- Sichtprüfung: Gesicht lesbar? Hände an der richtigen Stelle? Steht jemand in der Luft? Überdeckt etwas Text?
- „Bewegung reduzieren“ einschalten: nichts bewegt sich, alles bleibt bedienbar.

## 12. Änderungsprotokoll 11/2026 (Design-Überarbeitung)

| Datei | Änderung |
|---|---|
| `css/08-system.css` | neu: Tokens (Illustration, Abstände, Radien, Erhebung, Bewegung, Typo), Überzeilen ohne Versalien, einfarbige Navigation, getönte Symbolfelder, Trainingskacheln ohne Deko-Kreise, Demo-Hinweis als Leiste über der Tab-Leiste, Patientenliste ohne Überlappung, Fokusring, Szenen-Animationen, Keyframes ohne Überschwingen, „Bewegung reduzieren“ |
| `js/training/30-mikro-effekte.js` | Bewegungssystem: kein Ring bei jedem Antippen, kein Kartenanheben, kein Hüpfen, Seitenwechsel nur bei Bereichswechsel, `window.FP_MOTION` |
| `js/training/05-figuren.js` | größere Köpfe, Hände mit Daumen entlang des Unterarms, Hände bis Oberschenkelmitte, neue Posen `chart` und `talk` |
| `js/training/04-illustrationen-fuer-die-praktische.js` | ruhiger Boden mit Sockelleiste, leise Wandversorgung, schwächere Vignette, `X.handShape`, Arm liegt auf der Decke, flache Lage mit Decke bis zur Brust, Kopf im Bett größer (82), Atmen am Oberkörper, Händedesinfektion als Gegenbewegung |
| `js/training/46-szenen-system.js` | neu: Szenen-Baukasten `FP_SCENE` mit Referenzszene Stationsflur |
| `js/training/43-training-stationsalltag-interaktive-stations.js` | Stationsalltag zeigt die Stationsflur-Szene statt eines abstrakten Rasters |
| `styleguide.html`, `js/styleguide.js` | neu: lebende Übersicht aller Bausteine |
| `index.html`, `sw.js` | neue Dateien eingebunden, Cache `fallpfad-v42` |
| `werkzeuge/tests/nachweis/design-vorher-nachher.png`, `styleguide.png` | Nachweise |
