# Feedback aus der Pflegeschule: Analyse und Umsetzung

Quelle: Kommentar von Marc Hachmöller (Pflegelehrer) zu Handbuch und App, Stand 16.11.2026.
Stand dieser Datei: 20.11.2026. Gilt für Lernenden-App (`pflegepfad`) und Lehrer-Portal (`pflegepfadlehrer`).

## Übersicht

| # | Rückmeldung | Einordnung | Umsetzung |
|---|---|---|---|
| 1 | „Schüler“ wird nur noch inoffiziell genutzt | Berechtigt. Die Lernenden-App sagte schon „Lernende“, das Portal nicht. | Portal: „Kurse & Auszubildende“, „Stundenplan Auszubildende“, „Auszubildendenakte“. „Schüler-App“ heißt jetzt „Lernenden-App“. Bewusst unverändert: Datenbankrollen (`student`), Dateinamen, „Schülerstation“ (Fachbegriff in Modul 54). |
| 2 | PESR-Schema einheitlich benennen | Berechtigt. Im Pflegeplanungs-Training stand PESR, im Praktischen Examen PES mit „b/d“ und „a/d“, im Portal „PES-Format“ und „PES-Schema“. | Überall „PESR“ (Problem, Ursache, Symptome, Ressourcen). Im Praktischen Examen erklärt der Text, dass b/d die Ursache und a/d die Symptome meint. |
| 3 | „Bildbefunde“ ist ein ärztlicher Begriff | Berechtigt. Befundauswertung ist keine Pflegeaufgabe. | „Bildbefund“ wurde zu „Beobachtung“, „Bildbefunde“ zu „Beobachtungsbilder“, Antwortoptionen „Normalbefund“ zu „Unauffällig“, Fragen „Was zeigt der Befund?“ zu „Was zeigt die Beobachtung?“. Interne Namen (Dateien, Zählerschlüssel) blieben, damit nichts bricht. |
| 4 | Themen nicht starr auf Ausbildungsjahre verteilen, lieber Baukasten nach Theoriephase | Berechtigt und der wichtigste Punkt für die Akzeptanz an Schulen. | Neu: Lehrkräfte markieren je Kurs die Module der aktuellen Theoriephase (Stern im Fenster „Module, Theoriephase und Lerncoach“). Lernende sehen sie ganz oben unter „Lernmodule“ und auf der Startseite. Das Ausbildungsjahr ist nur noch eine Empfehlung („Empfohlen für das 1. Ausbildungsjahr“). Ohne Markierung bleibt alles wie bisher. |
| 5 | Schulverwaltung (Noten, Reminder), Konkurrenz zu EasySoft | Strategische Entscheidung, bewusst **nicht umgesetzt**. | Siehe unten. |
| 6 | Guter Transfer in die Praxis, Lerntransfer mit Reflexion und Anleitung | Berechtigt. Der Praxisauftrag hatte Checkliste und eine Reflexionsfrage, aber keinen Bezug zur Anleitung. | Der Praxisauftrag ist jetzt eine Transferaufgabe mit drei Phasen: vorab mit der Praxisanleitung klären, unter Anleitung durchführen, strukturiert reflektieren (Frage des Moduls, Gelungenes und Schwieriges, Rückbezug zum Unterricht, Rückmeldung der Praxisanleitung). Abschluss erst mit Reflexion. Hinweis, dass nur unter Anleitung geübt wird. Gilt für alle 75 Module. |
| 7 | Optionale Verlinkung, z. B. Lerncoach bei Lernschwierigkeiten | Berechtigt. | Neu: Der Kurs kann im Portal eine Ansprechperson hinterlegen. Die Lernenden sehen sie unter „Wiederholen“ („Wenn dir das Lernen schwerfällt“) mit E-Mail und Telefon. Abruf nur für angemeldete Lernende des eigenen Kurses (`fp_kurs_hilfe`). |
| 8 | Examenssimulator mit 120 Fragen in 120 Minuten weckt falsche Erwartungen | Berechtigt. Die echte schriftliche Prüfung hat nach § 14 PflAPrV drei fallbezogene Aufsichtsarbeiten zu je 120 Minuten. Zusätzlich stand „im Stil der IMPP-Prüfungen“ da, das betrifft die ärztliche Prüfung. | Umbenannt in „Prüfungswissen-Training“. Umfang 60/30/15 Fragen. Kein „Echtbedingungen“ und kein IMPP mehr. Ein Hinweis erklärt den echten Aufbau und verweist für die Fallklausur auf Module, Pflegeplanung und Fallgespräche. 60 % gelten nur als Richtwert im Training. |
| 9 | KI-Bilder oft misslungen (z. B. Vitalzeichen) | Teilweise. Die Bilder sind selbst gezeichnete SVG-Grafiken, keine KI-Bilder, aber vier waren tatsächlich fehlerhaft. | Überarbeitet: Fieberphasen (Kurve lief durch den Text), Schock-Diagramm (Beschriftungen auf den Linien), Pulsorte (Linien kreuzten sich), Blutdruck-Haltung (Person anatomisch unsauber). Weitere Bilder prüfen, siehe offene Punkte. |
| 10 | Mehr Variation, nicht immer Text, Frage, Antwort | Teilweise. Jedes Modul nutzt mindestens 7 verschiedene Bausteintypen (Fälle, Zuordnen, Reihenfolge, Lückentext, Entscheidungsbaum, Simulation, Fehlersuche, Verlauf, Schätzen, Reflexion, Dokumentation). Die Lernblöcke selbst bestehen aber meist aus Text: nur 64 von 599 haben eine Abbildung. | Keine Massenerzeugung neuer Grafiken, weil Qualität hier der Kritikpunkt war. Siehe offene Punkte. |
| 11 | Zielsetzung unklar (Fall? Prüfung? Lernhilfe? Schulorganisation?) | Berechtigt. | Leitbild geschärft: Kern sind die Fallmodule. Training ergänzt (Üben, Prüfungsvorbereitung, Nachschlagen), Praxis und Aufgaben begleiten. Die Training-Seite sagt das jetzt und die Gruppe heißt „Prüfungsvorbereitung“. |

## Bewusst nicht umgesetzt: Schulverwaltung

Noten (mündlich, schriftlich, praktisch) mit Remindern würden Fallpfad zu Schulverwaltungssoftware machen. Dagegen sprechen drei Gründe. Erstens widerspricht es dem Punkt 11 desselben Feedbacks: Eine unklare Zielsetzung würde breiter, nicht klarer. Zweitens sind Noten besonders schutzbedürftige Schuldaten mit eigener Rechtsgrundlage, Aufbewahrungsfristen und Rechtekonzept. Das braucht Datenschutzfolgenabschätzung und Auftragsverarbeitungsvertrag mit jeder Schule, bevor eine Zeile Code entsteht. Drittens bindet es Entwicklung an ein Feld, in dem ein etablierter Anbieter steht. Empfehlung: erst Zielbild entscheiden, dann mit zwei bis drei Pilotschulen klären, ob sie überhaupt wechseln würden.

## Offene Punkte

1. **Bilder:** Nur 11 % der Lernblöcke haben eine Abbildung. Sinnvoll wäre eine Liste der 30 Lernblöcke mit dem größten Visualisierungsgewinn (Vorgänge, Verläufe, Anatomie) und je eine fachlich geprüfte Grafik. Jede neue Grafik sollte vor Aufnahme von einer Lehrkraft gegengelesen werden.
2. **„Lerntypen“:** Das Feedback spricht davon, verschiedene Lerntypen zu berücksichtigen. Die Forschung stützt die Idee, Lernende nach Typ zu bedienen, nicht. Abwechslung der Zugänge und das Abrufen von Wissen wirken dagegen belegt. Empfehlung: Abwechslung als Ziel formulieren, nicht Typen.
3. **Kompatibilität mit Schulcurricula:** Die Theoriephase ist ein erster Schritt. Mit einer Pilotschule lässt sich prüfen, ob eine Vorlage „Curriculum importieren“ (Lernfeld oder Themenübersicht zu Modulen) gebraucht wird.
4. **Handbuch:** Das Handbuch liegt nicht in den Repos. Dort sollten „Bildbefunde“ (S. 2), „PES“/„PESR“, „Schüler“ und „Examenssimulator“ ebenfalls angepasst werden.
5. **Fachliche Durchsicht:** Die neuen Texte (Transferaufgabe, Prüfungshinweis) bitte von einer Lehrkraft gegenlesen lassen.

## Einrichtung

1. `supabase/theoriephase_lerncoach.sql` im SQL Editor ausführen (beide Repos enthalten dieselbe Datei). Sie erweitert `course_settings` um `focus` und `phase` und legt `fp_kurs_hilfe()` an. Ohne die Datei läuft alles wie vorher; Theoriephase und Lerncoach erscheinen dann nur nicht.
2. Lehrer-Portal und Lernenden-App neu hochladen. Der Offline-Cache steht auf `fallpfad-v55`.
