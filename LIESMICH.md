# Fallpfad Schüler-App

Dieser Ordner ist die Website für die Lernenden (zum Beispiel https://pflegepfad.vercel.app).

## Aufbau (modular)

Die App besteht nicht mehr aus einer einzigen `index.html`, sondern aus einzelnen Modulen. `index.html` lädt sie nur noch in der richtigen Reihenfolge.

| Ordner / Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst: lädt Stylesheets, Daten und Skripte der Reihe nach |
| `css/` | Gestaltung in Ebenen: `01-basis`, `02-training`, `03-apple`, `04-pro`, `05-v5`, `06-feinschliff` (Bewegung, Fokus, Bedienungshilfen) |
| `daten/basis.js`, `daten/abbildungen.js`, `daten/figuren.js` | Grunddaten und Zeichnungen |
| `daten/module/jahr-1` bis `jahr-3` | je Lernmodul eine Datei (`fm1.js` bis `fm60.js`) |
| `js/kern/` | Start: Konfiguration, Demo-Konto, Farbprofile, Modul-Loader, Offline-Anmeldung |
| `js/training/` | je Training bzw. Prüfungsfall eine Datei (Examen, Kommunikation, Stationsalltag, Meine Sprache …) |
| `js/app/01-app.bundle.js` | der gebaute Kern der App (Module, Praxis, Aufgaben, Fortschritt) |
| `js/funktionen/` | Zusatzfunktionen: PharmakoLab, Training zum Modul, Medaillen, Ruhig bleiben, Datenauskunft, QR-Scanner (`06`), Assistent (`07`), App übersetzen (`08`) |
| `vendor/` | Bibliotheken, liegen auf dem eigenen Server |
| `sw.js` | Offline-Cache. Bei jeder Änderung an Dateien die Versionsnummer `fallpfad-v…` erhöhen |
| `vercel.json`, `netlify.toml` | Sicherheits-Header (siehe unten) |

Wichtig: Die Reihenfolge der `<script>`-Zeilen in `index.html` nicht ändern. Kommt eine neue Datei dazu, auch in die Liste `MODULE` in `sw.js` eintragen.

## Neu in dieser Version (10.11.2026)

- **Profilmenü im Stil der iOS-Einstellungen:** gruppierte Listen, farbige Symbol-Kacheln, flache Farbkreise mit Häkchen und Namen. Die Farbkreise bleiben auf dem Handy rund (vorher wurden sie durch die 44-px-Regel für Touch-Ziele oval). Gilt identisch im Lehrer-Portal.
- **Symbole:** neues, sauberes Zahnrad für Einstellungen/Optionen (Seitenleiste, Tab-Leiste, Menü), Logo wieder hell auf Akzentfarbe (`css/07-politur.css`).
- **App übersetzen repariert:** Die Edge Function `uebersetzen` nutzt jetzt strukturierte Ausgabe (JSON-Schema) und die gleichen Modell-Einstellungen wie die übrigen KI-Funktionen, mit automatischem Ausweichen bei einem Fehler 400. Größere Pakete (25 Texte je Anfrage), Tageslimit 250 000 Zeichen (Cache-Treffer zählen nicht).
- **Neues Training „Pflegeplanung“** (`js/funktionen/09-pflegeplanung.js`, Fälle in `daten/pflegeplanung-faelle.js`): sieben Patientenbeispiele (Innere, Chirurgie, Langzeitpflege, Pädiatrie, ambulant, Psychiatrie, Stroke Unit). Pflegeplanung nach PESR mit Ressourcen, SMART-Zielen, Maßnahmen und Evaluation, Prioritäten per Pfeil. Die KI (Edge Function `pflegeplanung`) vergleicht mit dem Erwartungshorizont, der nur auf dem Server liegt, und gibt Punkte je Kriterium, Rückmeldung je Problem mit Formulierungsbeispiel, Denkanstöße und Sicherheitshinweise. Planung bleibt nur auf dem Gerät. Fälle ändern: `werkzeuge/pflegeplanung_faelle.py` im Lehrer-Portal-Paket, nicht die erzeugten Dateien.
- **Assistent:** großzügiges Tageslimit (40 Nachrichten für Lernende, 80 für Lehrkräfte; Secrets `FALLPFAD_ASSISTENT_LIMIT`, `FALLPFAD_ASSISTENT_LIMIT_LEHRER`). Die App zeigt keine Zahl mehr an.
- **Stationsalltag: zwei neue Stationen und eine Zufalls-Engine.**
  - *Spätdienst Unfallchirurgie, Station 3A* (13:30 bis 18:00): Duokopfprothese, Marknagel, OP-Vorbereitung mit Sprachbarriere, Knie-TEP, LWK-Fraktur, Neuaufnahme aus dem Pflegeheim mit Marcumar und Demenz. Kritische Verläufe: Nachblutung, Kompartmentsyndrom, postoperatives Delir.
  - *Frühdienst Seniorenzentrum Lindenhof, Wohnbereich 2* (06:00 bis 10:30): Parkinson-Medikamente, PEG, Dekubitus, Dysphagie, Fentanylpflaster, Einzug zur Kurzzeitpflege mit Medikationsabgleich. Kritische Verläufe: Sturz unter Apixaban, Fieber und Exsikkose, letzte Lebensphase.
  - *Zufalls-Engine* (`js/training/45-stationsalltag-zufall.js`, gilt für alle Stationen inkl. Innere): je Schicht andere kritische Verläufe, andere Fassungen von Ereignissen, gestreute Uhrzeiten und 2 bis 4 zusätzliche Alltagsereignisse aus einem Pool (Schweigepflicht am Telefon, Apothekenlieferung, Nadelstich, Klingel, Pumpenalarm, Angehörigenbeschwerde, Hypoglykämie …), meist mit kleiner Aufgabe. Eine unterbrochene Schicht läuft mit derselben Zufallszahl genau so weiter.
- **Datenschutz und Sicherheit:** Datenschutzerklärung ergänzt (Pflegeplanung, Stationsalltag, Zähler). Datenbank: Funktionen, die nur angemeldete Konten brauchen, sind nicht mehr ohne Anmeldung aufrufbar; Zähler-Tabellen ausdrücklich ohne App-Zugriff; automatische Löschfristen laufen jetzt über pg_cron (`supabase/pflegeplanung_sicherheit.sql` im Lehrer-Portal-Paket).

## Aus der vorigen Version

- **Assistent** (Reiter links, mobil oben über das Funkeln-Symbol): plant Prüfungen, erstellt Testklausuren, erklärt und wiederholt. Er sucht die passenden Stellen zuerst auf dem Gerät in den Fallpfad-Modulen, Lernkarten und der Kitteltasche und schickt nur diese Auszüge an den Server. Die KI antwortet ausschließlich daraus, mit Quellenangabe. Fragen ohne passende Stelle beantwortet er nicht. 3 Nachrichten pro Tag (Secret `FALLPFAD_ASSISTENT_TAG`). Antwortet in der eingestellten Sprache.
- **QR-Code scannen** (Knopf links neben der Suche): Live-Codes, Kurs-, Modul- und Stationslinks öffnen direkt. Fremde Links erst nach Rückfrage. Nutzt die Kamera des Geräts, Bilder werden nicht gespeichert. Bibliothek `vendor/jsqr.min.js` (jsQR, Apache-2.0) wird nur bei Bedarf geladen.
- **App übersetzen:** Ist unter „Meine Sprache“ eine Sprache gewählt, erscheint oben ein Globus. Damit lassen sich alle Texte der aktuellen Seite übersetzen. In der Sprachauswahl und unter Einstellungen gibt es den Schalter „Ganze App übersetzen“. Bei „Einfaches Deutsch“ werden nur längere Texte vereinfacht. Übersetzt wird über die vorhandene Funktion `uebersetzen`, das Tageslimit `FALLPFAD_LS_ZEICHEN_TAG` (Standard 60 000 Zeichen) gilt auch hier.
- **Albanisch** unter „Meine Sprache“, inklusive Grundwortschatz Pflege.
- **Neue Module:** fm57 Delir (Jahr 2), fm58 Venenzugang und Infusion (Jahr 1), fm59 Multiple Sklerose (Jahr 3), fm60 Ulcus cruris (Jahr 2).
- **NEWS2 entfernt:** Module, Simulationen, Prüfungsfälle, Lernkarten und Kitteltasche arbeiten jetzt mit dem Verlauf der Vitalwerte und klinischer Einschätzung statt mit einem Punktwert.

Neue Module, die albanischen Übersetzungen im Grundwortschatz und die umgeschriebenen Stellen bitte vor dem Einsatz fachlich prüfen lassen.

## Sicherheit

- **Content-Security-Policy:** Die Seite führt nur Skripte vom eigenen Server aus (kein Inline-Code mehr). Verbindungen sind nur zu Supabase und zu OpenAI (Sprachsimulation) erlaubt. Steht als `<meta>` in `index.html` und als Header in `vercel.json`.
- **Weitere Header:** HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (Kamera und Mikrofon nur für die eigene Seite).
- **Meine Daten herunterladen:** Einstellungen > Rechtliches. Lädt alles zum Konto Gespeicherte als Datei (Art. 15 und 20 DSGVO). Braucht `supabase/sicherheit_haertung.sql` aus dem Lehrer-Portal-Paket.
- **Einwilligung zur Sprachsimulation** wird auf dem Server mit Zeitpunkt protokolliert, der Widerruf ebenso.
- Das Backend (Datenbank, Edge Functions) ist im Lehrer-Portal-Paket unter `supabase/BACKEND.md` beschrieben.

Prüfen nach Änderungen: `node werkzeuge/pruefen.mjs .` lädt die App in Chrome und meldet Konsolenfehler, fehlende Dateien und CSP-Verstöße.

## Neu in dieser Version: Training „Stationsalltag“

- **Neue Simulation unter Training > Stationsalltag:** ein Frühdienst auf der Inneren Medizin, Station 5B, 06:30 bis 11:00 Uhr. Fünf Zimmer mit Betten, acht Patientinnen und Patienten und eine Neuaufnahme. Eine Simulationsuhr läuft im Zeitraffer (Pause, 1×, 2×, 4×), jede Aufgabe kostet Stationszeit.
- **Stationsplan:** Zimmer mit Betten, Patientinnen und Patienten, Status (beobachten, kritisch) und offenen Aufgaben. Zimmer mit neuen Ereignissen oder überfälligen Aufgaben pulsieren dezent. Daneben stehen die anstehenden Aufgaben nach Fälligkeit und die aktuellen Ereignisse (Klingel, Labor, Telefon, Visite, Aufnahme, Alarm).
- **Zimmer und Patienten:** Ein Tipp auf ein Zimmer zeigt die Personen mit Übergabe, letzten Messwerten, Hinweisen, Patientenakte und Aufgaben. Für Personen aus den Lernmodulen öffnet sich die vorhandene Patientenakte des Moduls (Herr Schulte, Frau Neumann, Frau Berger, Herr Seifert, Herr Engel), dazu der Sprung ins Fallmodul. Herr Brinkmann und Frau Kranz kommen aus der Praktischen Examen Übung mit Akte, Bildbefund und der Simulation Kurzinfusion.
- **Neuer Fall Herr Brückner:** Harnwegsinfekt, der sich im Lauf der Schicht zur Sepsis entwickelt. Mit eigener Akte, Vitalverlauf, SBAR-Anruf, Blutkulturen, Penicillinallergie in der Akte, Antibiose, Infusion, Kontrolle, Bilanz und Pflegebericht. Wer zu spät reagiert oder die Allergie übersieht, erlebt die Folgen.
- **Aufgabentypen:** Messen mit Einordnung auffälliger Werte, Entscheidungen, Mehrfachauswahl, Reihenfolgen, Rechenaufgaben, Bildbefunde und schrittweise Pflegehandlungen aus der Praktischen Examen Übung. Wo es passt, verlinkt die Aufgabe die passende Übung unter Simulationen.
- **Auswertung:** Gesamtergebnis, Sicherheit, fachliches Handeln, Kommunikation und Dokumentation, Organisation, Pünktlichkeit, kritische Situationen, offene Aufgaben zur Übergabe und die ganze Schicht im Rückblick. Eine laufende Schicht wird gespeichert und lässt sich fortsetzen.
- **Ohne KI:** Alles läuft nach festen Abläufen und Regeln. Neue Szenarien, Ereignisse und Aufgaben werden nur als Daten ergänzt (Datei `fx-station-data.js` im Quellpaket). Für den Stationsalltag ist nichts in Supabase einzurichten.

## Training „Kommunikation“ (letzte Version)

- **Neuer Bereich unter Training > Kommunikation** mit fünf Kategorien: Patientengespräch, Angehörigengespräch, Konflikt- und Beschwerdegespräch, Aufnahmegespräch und Beratungsgespräch. Je Kategorie drei Gespräche (insgesamt 15), alle Personen erfunden.
- **Sprachsimulation in Echtzeit:** Die lernende Person spricht über das Mikrofon mit einer KI, die die Gesprächsperson spielt und mit natürlicher Stimme antwortet. Die Person fragt nach, versteht manchmal etwas nicht, reagiert auf Fachwörter, Tempo und Ton und gibt Wichtiges erst preis, wenn gut nachgefragt wird. Die Stimmung verändert sich je nach Gesprächsführung. Live-Untertitel sind zuschaltbar, statt zu sprechen kann man auch schreiben. Höchstens 10 Minuten je Gespräch, bei Verbindungsabbruch geht das Gespräch nahtlos weiter.
- **Auswertung nach jedem Gespräch:** Gesamtergebnis und je 0 bis 100 Punkte für Gesprächsführung, Verständlichkeit, Empathie und fachliche Kommunikation, mit Stärken, Verbesserungen, Status jedes Lernziels, Schlüsselmomenten mit wörtlichem Zitat und besserer Formulierung, Messwerten (Redeanteil, Sprechtempo, offene Fragen, Unterbrechungen) und einem Übungstipp.
- **Datenschutz:** Vor dem ersten Gespräch willigt die Person ein (widerrufbar unter Training > Kommunikation). Ton und Mitschrift speichert Fallpfad nicht auf dem Server, im Konto landen nur die Punktzahlen. Die Rollenanweisungen liegen auf dem Server, Lernende können keine eigenen Anweisungen einschleusen. Tageslimit je Konto. Die Datenschutzerklärung (Abschnitt 2.7) ist angepasst.
- **Demo-Konto:** Dort ist das Live-Gespräch nicht möglich (kein Server). Stattdessen gibt es eine Beispielauswertung.
- **Abbildungen im Praktischen Examen** überarbeitet: Figuren mit sauber angesetztem Hals, neu gezeichnete Szenen, Patientenbilder pulsieren nicht mehr beim Antippen.

### Einrichtung für die Kommunikation

| Schritt | Was |
|---|---|
| 1 | `supabase/gespraech_nutzung.sql` im SQL Editor ausführen (Tageszähler, nur Zahlen) |
| 2 | Die Edge Functions `gespraech-sitzung` und `gespraech-auswertung` bereitstellen, mit dem Ordner `supabase/functions/_shared` (Lehrer-Portal-Paket). Am einfachsten mit der Supabase-CLI: `supabase functions deploy gespraech-sitzung` und `supabase functions deploy gespraech-auswertung`. Beide nutzen den vorhandenen Secret `OPENAI_API_KEY` |
| 3 | Optional als Secrets: `OPENAI_MODEL_GESPRAECH` (Standard `gpt-realtime-2.1`, günstiger: `gpt-realtime-2.1-mini`), `OPENAI_MODEL_AUSWERTUNG`, `OPENAI_MODEL_TRANSKRIPTION` (Standard `gpt-4o-mini-transcribe`), `FALLPFAD_GESPRAECHE_TAG` (Standard 8 Gespräche je Person und Tag), `FALLPFAD_GESPRAECH_MAX_SEKUNDEN` (Standard 600) |
| 4 | Empfohlen: Bei OpenAI die europäische Datenresidenz beantragen (über den OpenAI-Vertrieb, neues Projekt mit Region Europa, Zero Data Retention) und dann `OPENAI_BASE_URL=https://eu.api.openai.com/v1` setzen. Ohne das läuft die Verarbeitung in den USA; so steht es auch in der Datenschutzerklärung |
| 5 | Im OpenAI-Projekt ein monatliches Ausgabenlimit setzen. Sprachgespräche sind deutlich teurer als Text; die Kosten hängen vom Modell und der Gesprächslänge ab (aktuelle Preise auf der Preisseite von OpenAI). Mit `gpt-realtime-2.1-mini` wird es erheblich günstiger, das Tageslimit begrenzt die Kosten je Person |

Wer die Funktion nicht anbieten möchte, stellt die beiden Funktionen einfach nicht bereit. Die App meldet dann „noch nicht eingerichtet“.

## Aus der letzten Version

**Beim Hochladen unbedingt mitnehmen:** den neuen Ordner `vendor/` (alle Bibliotheken liegen jetzt auf deinem eigenen Server, die App lädt nichts mehr von fremden Servern) und die Seiten `datenschutz.html`, `nutzungsbedingungen.html`, `impressum.html`, `konto-loeschen.html`. In diesen vier Seiten vorher die Platzhalter in eckigen Klammern ausfüllen.

- **Neues Design im Stil von Apple (Erinnerungen):** ruhige graue Flächen, weiße Karten ohne Schatten, große Titel, Seitenleiste mit farbigen Kreis-Symbolen, untere Leiste auf dem Handy wie die iOS-Tab-Bar, iOS-Schalter und Segmente. Gilt für Schüler-App und Lehrer-Portal.
- **Fünf neu abgestimmte Farbprofile:** Blau (Standard, das Fallpfad-Blau), Grün, Lila-Pink, Orange und Graphit. Jedes Profil hat eine eigene, passende Symbolpalette, keine bunte Mischung mehr. Der Dunkelmodus ist je Profil eigens abgestimmt: echtes Schwarz, erhöhte graue Flächen, aufgehellte Akzente.
- **Logo flach** wie das App-Symbol.
- **Neuer Reiter „Einstellungen“** (auf dem Handy „Optionen“): Konto und Profilbild, Farbe und Meine Sprache, Hell/Dunkel und Schriftgröße, Kurs beitreten, Bezugslehrkraft, Tutorial wiederholen, Kontakt, Datenschutz, Nutzungsbedingungen, Impressum, Konto löschen, Lernfortschritt zurücksetzen. Fortschritt zeigt nur noch den Fortschritt.
- **Tutorial:** Der Knopf unten links ist weg. Das Tutorial startet über das Profilmenü („Tutorial ansehen“) und unter Einstellungen.
- **Zwei neue Fälle in der Praktischen Examen Übung** (jetzt 10): Kardiologie mit 12-Kanal-EKG als Simulation und Nachblutung nach Herzkatheter als Bildbefund, Pneumologie mit endotrachealem Absaugen über die Trachealkanüle und COPD mit zu viel Sauerstoff als Bildbefund. Jeweils mit Vitalzeichen, Medikamentencheck, Störfall, Pflegebericht, Übergabe und Reflexion.
- **Meine Sprache:** Für alle, denen Fachdeutsch schwerfällt. Im Profil eine von über 20 Sprachen oder „Einfaches Deutsch“ wählen. Dann gibt es neben „Vorlesen“ in jedem Lernblock einen Knopf mit Weltkugel: Er zeigt den Text übersetzt bzw. vereinfacht und darunter die wichtigen Wörter mit Artikel (der/die/das farbig), Übersetzung und Aussprache. Text markieren (in Fällen, Aufgaben, Live) blendet eine kleine Leiste zum Vorlesen und Übersetzen ein. Fachbegriffe im Lexikon und in den Begriffs-Fenstern zeigen die Übersetzung direkt. Wörterbuch und Vorlesen laufen ohne Server auf dem Gerät; ganze Texte übersetzt die neue Edge Function `uebersetzen`. Die Sprachwahl bleibt nur auf dem Gerät.
- **Training „Fachsprache Deutsch“:** 177 Grundwörter der Pflege in 9 Themenfeldern mit Artikel und Aussprache (übersetzt in Englisch, Türkisch, Arabisch, Ukrainisch, Russisch, Vietnamesisch), 27 Sätze für den Dienst (Patientengespräch, Übergabe, Notfall) und drei Übungen: Bedeutung, Hören und erkennen, der/die/das.
- **Konto löschen in der App:** Profil > Konto löschen (Pflicht für App Store und Google Play, Recht auf Löschung). Braucht die Edge Function `konto-loeschen`.
- **Rechtliches in der App:** Links zu Datenschutz, Nutzungsbedingungen und Impressum auf der Anmeldeseite und im Profilmenü.
- **Vorlesen datenschutzfreundlicher:** Die App wählt bevorzugt Stimmen, die auf dem Gerät laufen. Mit „Langsamer vorlesen“ (unter Meine Sprache) wird langsamer gesprochen.

### Einrichtung für diese Version

| Schritt | Was |
|---|---|
| 1 | `supabase/meine_sprache.sql` ausführen (Übersetzungs-Zwischenspeicher, Tageszähler) |
| 2 | `supabase/datenschutz_aufraeumen.sql` ausführen (automatische Löschfristen; vorher unter Database > Extensions `pg_cron` aktivieren) |
| 3 | Edge Functions `uebersetzen` und `konto-loeschen` bereitstellen (Ordner `supabase/functions` im Lehrer-Portal-Paket). `uebersetzen` nutzt denselben Secret `OPENAI_API_KEY` wie der Folien-Import. Optional: `OPENAI_MODEL_UEBERSETZEN`, `FALLPFAD_LS_ZEICHEN_TAG` (Standard 60000 Zeichen je Person und Tag) |
| 4 | Optional in `config.js` ergänzen: `webUrl` (Adresse der Web-App), `datenschutzUrl`, `nutzungUrl`, `impressumUrl`, falls die Rechtstexte woanders liegen (siehe `config.BEISPIEL.js`) |

## Aus früheren Versionen (großer Ausbau)

- **Profilmenü mit 5 Farbprofilen:** Ein Klick auf dein Profil (oben rechts oder unten links) öffnet ein Menü mit Profilbild, fünf Farben (jeweils hell und dunkel), Hell/Dunkel/Automatisch, Einstellungen und Abmelden. Die Schrift bleibt immer gleich.
- **Einführung nur nach der Registrierung:** Neue Konten sehen die Tour automatisch beim ersten Anmelden. Eine Stunde lang gibt es danach unten links den kleinen Knopf „Tutorial“ zum erneuten Ansehen. Lehrer- und Schüler-Tour erklären jetzt Schritt für Schritt, wie man etwas erledigt.
- **Mini-Effekte und Handy-Feinschliff:** kurze Rückmeldung beim Antippen, sanfte Seitenwechsel, kompakte untere Leiste im Lehrer-Portal, Sprungleiste zu den Ausbildungsjahren, Kitteltasche als Schnellaktion unter Praxis.
- **Live im Unterricht ohne Vitalzeichen:** Die Lehrkraft zeigt eine Live-Stunde, ein Fallbeispiel oder ein ganzes Modul an der Tafel. Ihr scannt den QR-Code, seht auf dem Handy genau den Schritt, der vorne gezeigt wird, und antwortet anonym: ankreuzen, schätzen, einordnen, Stichworte für die Wortwolke. Weiterklicken kann nur die Lehrkraft. Neu dabei: Sicherheit angeben („sicher“ oder „geraten“), Stellen auf einer Körperkarte antippen, Begriffe zuordnen, Fälle Hinweis für Hinweis lösen, aus einer zugelosten Rolle antworten und im Klassenentscheid abstimmen.
- **Vier neue Fallmodule nach Curriculum:** Hygiene und Infektionsschutz (Jahr 1), Körperpflege, Haut und Mund (Jahr 1), Atmung unterstützen: Pneumonie und Sauerstoff (Jahr 2), Gesund bleiben im Beruf (Jahr 3). Damit sind es 41 Module.
- **Viel mehr Lernkarten:** zu jedem Modul zehn zusätzliche Karten (rund 370 neue), auch für „Nach Hause: Entlassung“, das bisher keine hatte. Alle Begriffe stehen automatisch auch im Fachlexikon.
- **Kitteltasche erweitert:** 15 neue Spickzettel, u. a. qSOFA, BE-FAST, Hypoglykämie, Flüssigkeitsbilanz, BMI, Elektrolyte, Infusions- und Dosisrechnung, Dekubitus-Kategorien, Vorgehen nach Sturz, Isolierung, Kinder-Reanimation, Pupillenkontrolle und das Telefonat mit der Ärztin.
- **Freischalten durch die Lehrkraft:** Module, die noch nicht dran sind, zeigen ein Schloss „Noch gesperrt“. Ausgeblendete Module erscheinen gar nicht.
- **Home:** Die Kachel „Arbeitstag eintragen“ heißt jetzt **„Mein Praxiseinsatz“**. Sie zeigt, wie lange der Einsatz noch läuft, und führt direkt zu Nachweis, Anleitung und Unterschriften.
- **Ruhigeres, moderneres Design:** feinere Schatten, klarere Kacheln, schlanke Scrollleisten.

## Ältere Neuerungen

- **Demo-Konten zum Vorstellen:** In der Schüler-App mit `schueler@demo.fallpfad.de` und Passwort `Demo2026` anmelden. Es öffnet sich Mila Krause im 2. Ausbildungsjahr mit Lernfortschritt, drei Praxiseinsätzen im Ausbildungsnachweis, Aufgaben und Nachrichten. Die Daten bleiben nur in diesem Browser. „Beenden“ (unten rechts) oder Abmelden setzt die Demo zurück. Das Konto gibt es nicht in der Datenbank, es wird nur in der App erkannt.
- **Einführung beim ersten Start:** Eine kurze Tour zeigt Home, Lernmodule, Training, Praxis, Aufgaben, Fortschritt und die Suche. 
- **Farben je Bereich:** Jede Rubrik hat ihre Farbe (Navigation, Seitenkopf, Karten). Modulkarten sind nach Ausbildungsjahr eingefärbt, alle Karten haben den Stil der Trainingskacheln.
- **Praxis einfacher:** Oben stehen Schnellaktionen „Arbeitstag eintragen“, „Praxisanleitung eintragen“, „Unterschrift holen“, „Gespräch festhalten“, „Fehlzeit melden“ und „Nachweis als PDF“. Sie öffnen direkt das passende Formular im laufenden Einsatz.
- **Home:** Vier Schnellstart-Kacheln (Weiterlernen, Mein Praxiseinsatz, Aufgaben, Training).
- **Mehrere Schulen:** Nach `schulen.sql` lädt die App eigene Module nur noch für angemeldete Lernende der eigenen Schule.

## Datenbank einrichten

Die Website zeigt keine technischen Einrichtungshinweise an. Wenn eine Funktion „gerade nicht verfügbar“ meldet, fehlt meist eine der folgenden Dateien in Supabase. Jede Datei im Supabase-Dashboard unter SQL Editor > New query einfügen und auf Run klicken. Alle Dateien sind wiederholbar.

| Reihenfolge | Datei | Wofür |
|---|---|---|
| 1 | `supabase/schema.sql` | Lernfortschritt |
| 2 | `lehrer_schema.sql` (im Lehrer-Portal) | Kurse, Profile, Lehrkräfte |
| 3 | `supabase/aufgaben.sql` | Aufgaben |
| 4 | `supabase/live.sql` | Live-Klassenfall |
| 5 | `supabase/kurse_examen.sql` | Kurs-Einstellungen und Examenssimulator |
| 6 | `supabase/team.sql` | Team-Krankenhaus |
| 7 | `supabase/kommunikation.sql` | Eigene Gruppenarbeiten, Nachrichten an Kurse und Lernende, Stundenplan |
| 8 | `supabase/nachweis.sql` | Digitaler Ausbildungsnachweis: Einsätze, Stunden, Praxisanleitung, Fehlzeiten, Gespräche, Unterschriften, Praxisanleitende, Praxisaufgaben |
| 9 | `supabase/begleitung.sql` | Bezugslehrkraft, wichtige Nachricht aus dem Einsatz, Einsatz-Feedback, Unterrichtspuls, Prüfungsbögen (Prüfen), Teilen unter Lehrkräften, automatisches Ablaufen von Nachrichten, Prüfungsdurchläufe mit Bewertung |
| 10 | `lehrer_erweiterung.sql` (im Lehrer-Portal) | Lehrer-Stundenplan, Aufgabenarten Training, Team, Live |
| 11 | `supabase/schulen.sql` | Mehrere Schulen in einer Datenbank: jede Schule sieht nur ihre Daten, Schulverwaltung für die Administration, Folien-Import-Protokoll. Danach Schritt 12. |
| 12 | `supabase/live_unterricht.sql` | Live im Unterricht: Freitext-Antworten (Wortwolke), gesperrte Module für die Freischaltung. Nach `schulen.sql` ausführen. |

Fehlermeldungen zur Konfiguration (zum Beispiel ein falscher Schlüssel in `config.js`) erscheinen nur in der Browser-Konsole (Entwicklertools > Konsole), beginnend mit „[Fallpfad]“.

## Ausbildungsnachweis

Lernende führen den Nachweis im Tab Praxis. Beim Anlegen eines Einsatzes wählen sie, ob sie Arbeitstage selbst eintragen oder ob die Einrichtung stempelt (automatische Zeiterfassung); im zweiten Fall entfallen Arbeitstage und Fehlzeiten, und die Stunden kommen über den Einsatznachweis.

Bestätigt wird standardmäßig direkt auf dem Gerät der Lernenden: Die Person tippt ihren Namen ein, wählt ihre Funktion (Praxisanleitung, Pflegefachperson oder Stations-/Wohnbereichsleitung bzw. Vertretung) und unterschreibt mit dem Finger. Es gibt keinen Code und keine Registrierung. Die Datenbank setzt den Zeitstempel, bildet die SHA-256-Prüfsumme und sperrt den Eintrag. QR-Code (30 Minuten) und Einmal-Link (72 Stunden, `?bestaetigen=TOKEN`) bleiben als freiwillige Alternative, etwa aus Hygienegründen; dort kann sich die Person ihr Handy merken lassen.

Den Einsatznachweis nach BIBB-Muster unterschreibt die Einrichtung, standardmäßig die Stations- oder Wohnbereichsleitung bzw. ihre Vertretung, danach die Lernenden zur Kenntnis. Wer unterschreiben darf und welche zusätzlichen Nachweise verlangt werden, stellt die Schule im Lehrer-Portal unter Ausbildungsnachweis > Vorlagen ein.

Je Einsatz können mehrere Praxisanleitende bestätigen; Abschlussgespräch und Leistungseinschätzung bestätigt die Haupt-Praxisanleitung. Unter Ausbildungsnachweis > Prüfungsaudit prüft ein Klick einen Kurs auf die Zulassungsvoraussetzungen und rechnet alle Prüfsummen nach.

Wer `nachweis.sql` schon ausgeführt hat, führt die neue Fassung einfach erneut aus; vorhandene Daten bleiben erhalten.

## Begleitung im Einsatz, Feedback und Prüfen

Schüler-App: Eine Woche vor Einsatzbeginn und während des Einsatzes zeigt die Startseite die passende Praxisvorbereitung aus dem Training. Zu Beginn, zur Mitte und zum Ende erinnert sie an Erst-, Zwischen- und Abschlussgespräch, an Einsatznachweis und Leistungseinschätzung und an Rückstände bei der Praxisanleitung (gemessen am zeitlichen Fortschritt). Drei Wochen vor Einsatzende öffnet das Einsatz-Feedback (sieben Kriterien mit 1 bis 5 Sternen, Weiterempfehlung, zwei kurze Texte); die Erinnerung bleibt auf der Startseite, bis es erledigt ist. Unter Praxis > Feedback & Kontakt können Lernende während eines Einsatzes eine wichtige Nachricht an ihre Bezugslehrkraft senden; die Bezugslehrkraft wählen sie unter Fortschritt > Einstellungen. Ohne Wahl sehen alle Lehrkräfte die Nachricht. In Unterrichtsphasen erscheint jede Woche ein kurzes Unterrichtsfeedback (Verständnis, wie gut der Unterricht der Woche insgesamt war mit 1 bis 5 Sternen, Stichworte).

Lehrer-Portal: Kurse & Schüler bündelt Kursblöcke mit Live-Status (im Einsatz oder im Unterricht mit Stimmungsbalken), Schülerübersichten mit Stunden, Praxisanleitung, Nachtdienst, fehlenden Voraussetzungen, Dokumenten zum Herunterladen und einem ZIP-Export aller Nachweise (ein Unterordner je Person, HTML-Dokumente plus Übersicht.csv). Benachrichtigungen entstehen automatisch: offene Pflichtpunkte im Nachweis, fehlende Unterlagen nach einem Einsatz, Nachtdienst unter dem Soll, Frühwarnung aus dem Unterrichtspuls (zwei von drei Rückmeldungen mit wenig Verständnis oder Unsicherheit), ungelesene Nachrichten aus dem Einsatz, fehlendes Feedback und Einrichtungen, in denen die Praxisanleitung auffällig oft unter 10 % liegt. Der Reiter Feedback wertet Einsatz-Feedback nach Träger und Station und den Unterrichtspuls je Kurs aus. Unter Prüfen entsteht aus einem Erwartungshorizont ein Prüfungsbogen nach dem OSCE-Prinzip; er lässt sich mit Lehrkräften und, ab einem gewählten Zeitpunkt, mit Kursen teilen. Hinweise für Prüfende sehen Lernende nie.

Die Benachrichtigungen erscheinen im Portal, nicht per E-Mail oder Push.

## Prüfungen durchführen und bewerten

Unter Prüfen legt die Lehrkraft je Prüfung fest, wie stark jeder Bereich zählt (Summe 100 %). Mit „Prüfung starten“ tippt sie den Namen der zu prüfenden Person, bewertet jedes Kriterium auf der Skala 1 (vollständig erfüllt) bis 6 (nicht erfüllt) oder „nicht beobachtet“ und schreibt bei Bedarf einen Kommentar je Bereich. „Analysieren“ zeigt eine Tabelle mit Mittelwerten je Bereich, gewichtetem Gesamtwert, Anteil erfüllt und Punkten; das ist eine rein mathematische Auswertung und keine Note. Mit „Nächste zu prüfende Person“ geht es weiter, „Prüfung beenden“ zeigt alle Geprüften. Ein Klick öffnet den ausgefüllten Bogen; alles lässt sich einzeln als PDF oder gesammelt als ZIP (Übersicht als PDF und CSV, ein Bewertungsbogen je Person) herunterladen. Durchläufe sieht nur die prüfende Lehrkraft. Sie werden drei Tage nach dem Beenden automatisch gelöscht, laufende drei Tage nach der letzten Änderung. Der leere Prüfungsbogen lässt sich weiterhin zum Ausdrucken herunterladen.

## Dokumente als PDF

Alle Dokumente entstehen als echte PDF-Dateien direkt im Browser (pdfmake, geladen von cdnjs; eine Internetverbindung ist nötig). Es gibt drei Wege: jedes Dokument einzeln (zum Beispiel nur das Erstgespräch des Orientierungseinsatzes), den Ausbildungsnachweis vollständig in einer PDF und ein ZIP mit Ordnerstruktur. Im ZIP liegt je Person ein Ordner Nachname_Vorname mit dem Gesamtnachweis und einem Unterordner je Einsatz (zum Beispiel 01_Orientierungseinsatz_Klinikum_Nord) mit Einsatzprotokoll, Gesprächen, Einsatznachweis, Leistungseinschätzung und Feedback einzeln. Im Lehrer-Portal gibt es das ZIP auch je Kurs (Kurs/Nachname_Vorname/Einsatz/…) und für alle Kurse. Dateinamen: Nachname_Vorname_Einsatzart_Dokumentart_Datum.pdf. Die Namen kommen aus dem Profil; damit Vor- und Nachname im Dateinamen stehen, sollten Lernende ihren vollen Namen eintragen.

Jedes unterschriebene Dokument ist sofort einzeln als PDF verfügbar, in der App direkt am Eintrag („PDF“) und unter „Dokumente dieses Einsatzes“. Die PDF wird bei jedem Download aus den gesperrten, mit Prüfsumme gesicherten Daten neu erzeugt und enthält Unterschriften, Zeitstempel und Prüfsumme.

## Teilen, eigene Bilder und Nachrichten

Module, Live-Fälle und eigene Gruppenarbeiten gehören der Lehrkraft, die sie erstellt. Neue Inhalte sind zunächst nur für sie sichtbar. Über „Teilen“ gibt sie den Inhalt an ausgewählte Lehrkräfte oder per Knopfdruck an die ganze Schule frei. Andere Lehrkräfte nutzen geteilte Inhalte und legen bei Bedarf eine eigene Kopie an; ändern kann nur die Erstellerin. Bearbeitete Fallpfad-Originale und angepasste Arbeitsaufträge fertiger Team-Fälle gelten immer schulweit. Was vor dieser Version angelegt wurde, bleibt für alle Lehrkräfte sichtbar. Lernende betrifft das nicht: Sie sehen weiterhin, was für ihren Kurs veröffentlicht ist.

Im Modul-Baukasten gibt es den Baustein „Eigenes Bild“, im Team-Krankenhaus die Bausteine „Bild“, „Material“ und „Checkliste“. Bilder (JPG oder PNG) werden im Browser auf höchstens 1.400 Pixel und etwa 450 KB verkleinert und mit dem Inhalt gespeichert. Fertige Team-Fälle lassen sich über „Mit Bausteinen bearbeiten“ als eigene Fassung umbauen, die das Original für Lernende ersetzen kann.

Nachrichten der Schule haben immer ein Ablaufdatum (Standard zwei Wochen, höchstens 180 Tage) und werden 30 Tage nach Ablauf gelöscht. Gelesene Nachrichten blenden sich bei den Lernenden nach einer Woche aus. Dauerhaft bleiben der Ausbildungsnachweis, die Nachrichten aus dem Einsatz und das Einsatz-Feedback in der Akte der Person.

## Datenschutz im Pilotbetrieb

Im Lehrer-Portal unter Ausbildungsnachweis > Datenschutz steht eine Verarbeitungsübersicht (welche Daten in welcher Supabase-Tabelle liegen, wer sie sehen darf, Schutzmaßnahmen, Checkliste für den Auftragsverarbeitungsvertrag), die sich als PDF exportieren lässt. Je Person gibt es in der Detailansicht eine Auskunft als JSON und, nach Ablauf der Aufbewahrungsfrist, eine Löschfunktion mit Namensbestätigung.

Die Datenbank erzwingt: Fehlzeiten speichern nur Art und Stunden (jeder weitere Inhalt wird entfernt), kein Datum in der Zukunft, Einträge nur innerhalb des eigenen Einsatzes, plausible Stunden, Einsatzdaten nach der ersten Bestätigung gesperrt, Einmal-Links nach Nutzung ohne Inhalt. Jede Schule bekommt ein eigenes Supabase-Projekt; darüber sind die Daten der Schulen getrennt.

Vor dem Echtbetrieb: Supabase-Projekt in einer EU-Region, Auftragsverarbeitungsvertrag mit Supabase abschließen, Datenschutzbeauftragte einbinden, Aufbewahrungsfristen nach Landesrecht festlegen und bei der zuständigen Landesbehörde schriftlich bestätigen lassen, dass der elektronisch geführte Nachweis und der PDF-Export für die Prüfungszulassung anerkannt werden.

Nach diesen Dateien sind keine weiteren Änderungen in Supabase nötig. Gruppenarbeiten, Nachrichten und Stundenpläne legen Lehrkräfte vollständig im Lehrer-Portal an.

## Training: Kachel-Übersicht und Praktisches Examen Übung

Der Reiter Training zeigt alle Trainings als farbige Kacheln, gruppiert nach Prüfung & Examen, Simulieren & Handeln, Üben & Wiederholen sowie Nachschlagen & Sammeln. Ein Tipp auf eine Kachel öffnet das Training, „Alle Trainings“ führt zurück.

„Praktisches Examen Übung“ ist eine normale Kachel unter Prüfung & Examen und enthält acht komplette Prüfungstage nach § 16 PflAPrV, jeweils mit zwei oder drei Patientinnen und Patienten:

| Fall | Ort | Pflegehandlung als Simulation | Bildbefund, Vitalzeichen und Medikamente | Beratung |
|---|---|---|---|---|
| Akutgeriatrie | Station 4B | Blasenkatheter legen | Herr Kowalski: Zimmerbild, Puls 60 s mit Pulsdefizit | Entscheidungsbaum |
| Viszeralchirurgie | Station 3A | Stomaversorgung | Frau Hollweg (Vitalverlauf) | Nüchternheit vor der OP |
| Innere Medizin | Station 5B | Infusion an Venenverweilkanüle mit Pflegefachperson | Frau Kranz (Herzinsuffizienz) | – |
| Unfallchirurgie | Station 2C | Verbandswechsel Hüft-TEP | Herr Lange (Kompartment) | Entlassung |
| Neurologie | Stroke Unit 6N | Dysphagie, Essen anreichen | Frau Albers | – |
| Pädiatrie | K2 | Inhalation mit Spacer | Emil | Hypoglykämie |
| **Neu:** Stationäre Langzeitpflege | Seniorenzentrum, Wohnbereich 2 | Transfer Bett > Rollstuhl | Herr Stenzel: Zimmer, Gewicht, BZ, Dosett | Diabetische Fußpflege |
| **Neu:** Ambulante Pflege | Pflegedienst, Tour Nord | Kompressionsverband nach Pütter | Herr Ritter: Wohnung, BZ, Dosett | – |

Jeder Fall hat Vorbereitungstag, Schichtbeginn (Übergabe, SBAR, Prioritätenplan), Live-Handlungen, Störfall, Dokumentation, Übergabe, Reflexion und Note nach Punkteschlüssel und Kompetenzbereichen I–V.

- **Menschen und Sprechblasen wie in den Modulen:** Alle Patientinnen und Patienten, Angehörigen, Praxisanleitende und Prüfende haben ein eigenes Bild. Wer spricht, spricht in einer kleinen Sprechblase.
- **Pflegehandlung als Animation:** Die Lernenden wählen jeden Handgriff aus einer Werkzeugleiste. Die Szene zeigt jeden Schritt animiert, mit Hinweisen, Fehlgriffen und K.-o.-Fehlern.
- **Bildbefunde** sind gezeichnete Szenen, auf die man tippt, um Auffälligkeiten zu finden.
- **Nur pflegerische Tätigkeiten:** EKG-Auswertung und andere ärztliche Aufgaben sind entfernt. Tätigkeiten, die Auszubildende nicht übernehmen dürfen, kommen nicht vor.
- Durchgänge liegen im normalen Lernfortschritt (Feld `pex`).

## Unterrichtsfeedback nur freitags

Die Frage „Wie lief der Unterricht diese Woche?“ erscheint nur noch freitags, als kleines Fenster beim Öffnen von Home. „Später“ blendet sie für diese Woche aus. Auf Home steht das aktuelle Modul wieder ganz oben unter „Weiterlernen“.

## App-Symbol

Das App-Symbol in der Seitenleiste ist im hellen Modus ein blauer Verlauf passend zum Design und im Dunkelmodus ein helleres, leuchtendes Blau.

## Aufgaben: Training, Team-Krankenhaus und Live-Fall

Lehrkräfte können jetzt neben Modulen und eigenen Aufgaben auch ein Training (z. B. einen Fall der Praktischen Examen Übung), einen Team-Fall oder einen Live-Fall als Aufgabe stellen. In der App öffnet die Aufgabe das Training bzw. das Team-Krankenhaus mit einem Tipp; einen Live-Fall spielen die Lernenden allein durch. Abgegeben wird jeweils eine kurze Reflexion. Dafür einmal `supabase/lehrer_erweiterung.sql` im SQL-Editor ausführen (erweitert die erlaubten Aufgabenarten und legt den Lehrer-Stundenplan an).

## Ausbau November 2026

- **12 neue Fallmodule** (je 4 pro Ausbildungsjahr):
  - Jahr 1: fm64 Injektionen und Blutzucker, fm65 Trinken im Alter, fm66 Sterben und Versorgung Verstorbener, fm67 Dokumentation und Übergabe mit SBAR.
  - Jahr 2: fm68 Vorhofflimmern, fm69 Bluthochdruck, fm70 obere GI-Blutung, fm71 multiresistente Erreger.
  - Jahr 3: fm72 Frühgeborene, fm73 Pseudokrupp und Fieberkrampf, fm74 Polypharmazie, fm75 Beraten und Anleiten bei Asthma.
- **Fachlexikon** `daten/fachlexikon.js`: rund 430 zusätzliche Begriffe mit Kategorie. Sie erscheinen im Lexikon (mit Filter nach Kategorie), als Erklärung beim Antippen im Text und stehen dem Assistenten zur Verfügung.
- **Training „Akutsituationen“** (`js/training/51-akutsimulationen.js`): 8 Notfälle mit Live-Monitor, bei denen sich die Vitalwerte je nach Entscheidung verändern. Am Ende gibt es Punkte und eine Musterlösung.
- **Training „Bildbefunde“** (`js/training/50-bildbefunde.js`): 56 gezeichnete Befunde in 10 Kategorien, darunter Wunden, Dekubitus, Haut, Pupillen, Urin, Stuhl, Drainagen, Atemmuster, Kurven und EKG-Rhythmen zur Beobachtung. Es gibt einen Lernmodus und ein Quiz.
- **Feedback geben** im Profilmenü.
- **Anonyme Nutzungszählung** (`js/funktionen/10-feedback-nutzung.js`): nur Tageszähler pro Schule, ohne Personenbezug. Dafür muss `supabase/admin_statistik.sql` im Lehrer-Repo ausgeführt sein.
