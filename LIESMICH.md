# Fallpfad Schüler-App

Dieser Ordner ist die Website für die Lernenden (zum Beispiel https://pflegepfad.vercel.app).

| Datei | Wofür |
|---|---|
| `index.html` | die komplette App |
| `config.BEISPIEL.js` | Vorlage für die Datenbank-Verbindung. Nur nötig, wenn du noch keine `config.js` hast |
| `favicon.svg`, `icon-*.png`, `apple-touch-icon.png` | App-Symbole für Browser und Handy-Startbildschirm |
| `manifest.webmanifest` | macht die App auf dem Handy installierbar |
| `sw.js` | hält die App offline verfügbar |
| `vercel.json` | Einstellung für Vercel |
| `netlify.toml` | Einstellung für Netlify (nur falls du Netlify nutzt) |
| `supabase/*.sql` | Datenbank-Erweiterungen, siehe unten |

**Wichtig:** Deine bestehende `config.js` mit deinen Supabase-Werten behältst du. Überschreibe sie nicht.

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
| 9 | `supabase/begleitung.sql` | Bezugslehrkraft, wichtige Nachricht aus dem Einsatz, Einsatz-Feedback, Unterrichtspuls, Prüfungsbögen (Prüfen), Teilen unter Lehrkräften, automatisches Ablaufen von Nachrichten |

Fehlermeldungen zur Konfiguration (zum Beispiel ein falscher Schlüssel in `config.js`) erscheinen nur in der Browser-Konsole (Entwicklertools > Konsole), beginnend mit „[Fallpfad]“.

## Ausbildungsnachweis

Lernende führen den Nachweis im Tab Praxis. Beim Anlegen eines Einsatzes wählen sie, ob sie Arbeitstage selbst eintragen oder ob die Einrichtung stempelt (automatische Zeiterfassung); im zweiten Fall entfallen Arbeitstage und Fehlzeiten, und die Stunden kommen über den Einsatznachweis.

Bestätigt wird standardmäßig direkt auf dem Gerät der Lernenden: Die Person tippt ihren Namen ein, wählt ihre Funktion (Praxisanleitung, Pflegefachperson oder Stations-/Wohnbereichsleitung bzw. Vertretung) und unterschreibt mit dem Finger. Es gibt keinen Code und keine Registrierung. Die Datenbank setzt den Zeitstempel, bildet die SHA-256-Prüfsumme und sperrt den Eintrag. QR-Code (30 Minuten) und Einmal-Link (72 Stunden, `?bestaetigen=TOKEN`) bleiben als freiwillige Alternative, etwa aus Hygienegründen; dort kann sich die Person ihr Handy merken lassen.

Den Einsatznachweis nach BIBB-Muster unterschreibt die Einrichtung, standardmäßig die Stations- oder Wohnbereichsleitung bzw. ihre Vertretung, danach die Lernenden zur Kenntnis. Wer unterschreiben darf und welche zusätzlichen Nachweise verlangt werden, stellt die Schule im Lehrer-Portal unter Ausbildungsnachweis > Vorlagen ein.

Je Einsatz können mehrere Praxisanleitende bestätigen; Abschlussgespräch und Leistungseinschätzung bestätigt die Haupt-Praxisanleitung. Unter Ausbildungsnachweis > Prüfungsaudit prüft ein Klick einen Kurs auf die Zulassungsvoraussetzungen und rechnet alle Prüfsummen nach.

Wer `nachweis.sql` schon ausgeführt hat, führt die neue Fassung einfach erneut aus; vorhandene Daten bleiben erhalten.

## Begleitung im Einsatz, Feedback und Prüfen

Schüler-App: Eine Woche vor Einsatzbeginn und während des Einsatzes zeigt die Startseite die passende Praxisvorbereitung aus dem Training. Zu Beginn, zur Mitte und zum Ende erinnert sie an Erst-, Zwischen- und Abschlussgespräch, an Einsatznachweis und Leistungseinschätzung und an Rückstände bei der Praxisanleitung (gemessen am zeitlichen Fortschritt). Drei Wochen vor Einsatzende öffnet das Einsatz-Feedback (sieben Kriterien mit 1 bis 5 Sternen, Weiterempfehlung, zwei kurze Texte); die Erinnerung bleibt auf der Startseite, bis es erledigt ist. Unter Praxis > Feedback & Kontakt können Lernende während eines Einsatzes eine wichtige Nachricht an ihre Bezugslehrkraft senden; die Bezugslehrkraft wählen sie unter Fortschritt > Einstellungen. Ohne Wahl sehen alle Lehrkräfte die Nachricht. In Unterrichtsphasen erscheint jede Woche ein kurzer Unterrichtspuls (Verständnis, Zufriedenheit, Stichworte).

Lehrer-Portal: Kurse & Schüler bündelt Kursblöcke mit Live-Status (im Einsatz oder im Unterricht mit Stimmungsbalken), Schülerübersichten mit Stunden, Praxisanleitung, Nachtdienst, fehlenden Voraussetzungen, Dokumenten zum Herunterladen und einem ZIP-Export aller Nachweise (ein Unterordner je Person, HTML-Dokumente plus Übersicht.csv). Benachrichtigungen entstehen automatisch: offene Pflichtpunkte im Nachweis, fehlende Unterlagen nach einem Einsatz, Nachtdienst unter dem Soll, Frühwarnung aus dem Unterrichtspuls (zwei von drei Rückmeldungen mit wenig Verständnis oder Unsicherheit), ungelesene Nachrichten aus dem Einsatz, fehlendes Feedback und Einrichtungen, in denen die Praxisanleitung auffällig oft unter 10 % liegt. Der Reiter Feedback wertet Einsatz-Feedback nach Träger und Station und den Unterrichtspuls je Kurs aus. Unter Prüfen entsteht aus einem Erwartungshorizont ein Prüfungsbogen nach dem OSCE-Prinzip; er lässt sich mit Lehrkräften und, ab einem gewählten Zeitpunkt, mit Kursen teilen. Hinweise für Prüfende sehen Lernende nie.

Die Benachrichtigungen erscheinen im Portal, nicht per E-Mail oder Push.

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
