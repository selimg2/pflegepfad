# Inhaltsredaktion Pflegepfad – Befunde und offene Fragen

Stand 24.11.2026. Technisch geprüft heißt nicht fachlich freigegeben. Alle Änderungen aus P0-01 sind Entwürfe bis zur Durchsicht durch eine fachkundige Person (Pflegepädagogik/Notfallmedizin). Keine produktive Bereitstellung erfolgt.

## P0-01 Reanimation und Notfallkarten (umgesetzt)

| Nr. | Ort | Befund | Schwere | Änderung |
|---|---|---|---|---|
| 1 | Kitteltasche `kinder-rea` | „2-Finger- oder Zwei-Daumen-Technik“ beim Säugling. ERC/GRC 2025: Zwei-Daumen-Technik. | P0 | Korrigiert; 15:2 nur für PBLS-Geschulte, sonst 30:2; Tiefe mind. 1/3, nie > 6 cm; allein ohne Telefon 1 min CPR |
| 2 | fm5 Kap. 4, fm9 Kap. 2, Kitteltasche `rea`, Lehrer-Livestunde | Ablauf nach ERC 2021: Hilfe erst nach Atemkontrolle. ERC 2025: Hilfe bei jeder nicht reagierenden Person, Atmung während der Alarmierung prüfen. | P0 | Reihenfolge, Texte, Merke, Reihenfolgeaufgaben `c5_order`, `n9c_p1` angepasst (Itemzahl und IDs erhalten) |
| 3 | fm9 Kap. 2 | „feste Unterlage … Reanimationsbrett“. ERC 2025: CPR-Modus nutzen, nicht auf den Boden umlagern, kein Backboard. | P1 | Ersetzt |
| 4 | fm5, fm9 Quellen | ERC 2021 zitiert, 2025 gültig | P1 | Smyth et al. 2025 und GRC-Kurzfassung 2025 |
| 5 | fm3, Kitteltasche `vit` | SpO₂-Ziel 94–98 % (BTS) widerspricht fm11/fm40 (92–96 %, deutsche S3) | P1 | Auf S3-Zielbereich mit „nach Anordnung“ angeglichen; Hinweis, dass auch Werte über dem Ziel gemeldet werden |
| 6 | fm11 Quiz | Distraktor 94–98 % durch fachlich nahe 92–96 % ersetzt, Erklärung je Wert | P2 | Umgesetzt, Schlüssel `a: 0` unverändert |
| 7 | Kitteltasche `qsofa`, Lernkarte fm21, fm21 Kap. 2 | „unter 100 mmHg“, „ab 2 Kriterien … informieren“ suggeriert Entwarnung bei < 2 Punkten | P0 | ≤ 100 mmHg; Hinweis, dass ein unauffälliger qSOFA Sepsis nicht ausschließt (SSC 2021) |
| 8 | Kitteltasche `befast` | „sofort 112“ ohne Klinikbezug; „nichts essen“ ohne Bezug zum Schluckscreening | P1 | Hausinterner Notruf bzw. 112; bis zum Schluckscreening nüchtern |

## Offene fachliche Fragen

- **S3-Leitlinie Sauerstoff (AWMF 020-021)** ist laut Register abgelaufen (gültig bis 30.06.2024). Prüfen, ob eine Aktualisierung erschienen oder angemeldet ist.
- **S3-Leitlinie Sepsis (AWMF 079-001)**: aktuelle deutsche Fassung prüfen; Module zitieren SSC 2021.
- **fm9 Quellen [2]** (ERC 2021 Education) und **Abbildung „Atmung prüfen → Hilfe rufen“** in `daten/abbildungen.js` zeigen noch die Reihenfolge von 2021. Die Abbildung ist Medienbestand und wurde nicht verändert → separate Medienaufgabe (Textzeilen in der SVG tauschen).
- Kinder-Vitalwerte in der Kitteltasche `kids` gegen eine pädiatrische Referenz prüfen (Quelle bislang nicht genannt).
- Perspiratio insensibilis „500–800 ml“ (Kitteltasche `bilanz`) – Lehrbuchangaben variieren; Quelle benennen.
- Rauchtest `pruefen.mjs` versucht beim Start einen lesenden Supabase-Abruf (`/rest/v1/modules`). Er schlug im Testnetz fehl; für künftige Läufe Netzwerk zu `*.supabase.co` blockieren (wie `rauchtest.mjs`).

## Rechtliche Hinweise

- Alle Leitlinien nur bibliografisch genannt, Inhalte eigenständig formuliert, keine Tabellen, Algorithmen oder Textpassagen übernommen (`citation_only`).
- Keine DNQP-, NANDA-I- oder Fachbuchinhalte in diesem Paket berührt.
- Der Assistent erhält nur App-eigene Auszüge; geschützte Leitlinientexte werden nicht an den KI-Dienst übermittelt.

## P0-02 Kinder und Familie (umgesetzt, Entwurf bis Fachprüfung)

| Modul | Wichtigste Befunde | Änderung |
|---|---|---|
| fm73 Kindernotfälle | Kühle Luft als wirksame Krupp-Maßnahme (nicht belegt); Notfallmedikation „ab 3–5 Minuten“ vs. „über 5 Minuten“ widersprüchlich; Fieberdefinition und Messort pauschal; Paracetamol „meist 15 mg/kg“; Quelle „S2k-Krupp 2020“ nicht auffindbar | Nach S3 Fiebermanagement 2025, Cochrane, GRC 2025 korrigiert; nicht verifizierbare Quelle ersetzt |
| fm16 Gastroenteritis | Desinfektionsmittel unscharf („viruzid“); Rotavirus-Impfung der 5 Monate alten Schwester als nachholbar dargestellt; widersprüchliche Gewichte in der Fallwerkstatt | „begrenzt viruzid PLUS“ oder „viruzid“; STIKO-Zeitfenster; Fall konsistent |
| fm37 Bronchiolitis | Sättigungsgrenze ohne Kontext | NICE-NG9-Schwellen (90/92 %) erläutert |
| fm72 Frühgeborene | Akte 12 × 22 ml vs. Fall/Aufgabe 8 × 28 ml | vereinheitlicht |
| fm26 Wochenbett | normaler Gewichtsverlust 7 % vs. 7–10 %; HF 120–160 vs. 110–160; Rechenaufgabe mit falschem Geburtsgewicht | vereinheitlicht, Aufgabe als anderes Kind markiert |
| fm27 Typ-1-Diabetes | Basketball (Akte) vs. Fußball (Fallwerkstatt) | vereinheitlicht |

## P0-03 Arzneimittel I (umgesetzt, Entwurf bis Fachprüfung)

| Modul | Wichtigste Befunde | Änderung |
|---|---|---|
| fm64 Injektionen | i. m. „kontraindiziert bei Schock“ ohne Ausnahme – widerspricht Adrenalin i. m. bei Anaphylaxie; Hautfalte bei 4-mm-Nadeln; Pen-Test und Haltezeit als feste Zahl; Merke „mit Beschwerden“ widerspricht Kap. 0 | Ausnahme ergänzt, herstellerabhängig formuliert, vereinheitlicht |
| fm20 Arzneimittelmanagement | Zahl abgesetzter Medikamente widersprüchlich | angeglichen |

Weitere Querschnittskorrekturen: Kitteltasche „Isolierung“ (Noro/Rota-Desinfektion), Fachlexikon „Wadenwickel“ (körperwarm), Normwert Herzfrequenz Kleinkind in fm73 an fm37/Kitteltasche angeglichen.

## Stand und ehrliche Einordnung

8 von 75 Modulen sind vollständig gelesen und redigiert, 5 weitere teilweise (nur Notfallkapitel aus P0-01). Damit sind 67 Module noch nicht vollständig redigiert, 62 davon noch gar nicht. Liste: `.pflegepfad-review/status.json` → `fortschritt`. Pro Modul: `.pflegepfad-review/module.json`.

## P0-04 Arzneimittel II und Notfälle (umgesetzt, Entwurf bis Fachprüfung)

| Modul | Wichtigste Befunde | Änderung |
|---|---|---|
| fm67 Dokumentation | Nächtliche Hypoglykämie (58 mg/dl) bei reiner, pausierter Metformin-Therapie fachlich kaum erklärbar | Basalinsulin am Vorabend in Akte, Kurve, SBAR und Übergabe ergänzt |
| fm74 Polypharmazie | Musterdoku nannte Zopiclon, das der Patient nie hatte | Diphenhydramin |
| fm12 Typ-2-Diabetes | Lipohypertrophie als „Verhärtung“ (fm64: weich, gummiartig); Messstelle „Fingerkuppe“ | vereinheitlicht inkl. Zusatz-Lernkarte |
| fm56 Notaufnahme | Adrenalin-Wiederholung „nach 5–10 min“ | ERC/GRC 2025: erneut, wenn nach etwa 5 min keine Besserung |
| fm9, fm5, fm3 | Offenkundig absurde Distraktoren („Lieblingsfernsehsendung“, „Fußball schauen“, „Körpergröße“); ERC-2021-ALS-Quelle; „Exploration“ statt Exposure | plausible Distraktoren mit Erklärung, Quellen aktualisiert |
| fm36, fm21, fm11 | ohne fachlichen Fehler | geprüft, unverändert |
| PharmakoLab | Textangaben (Tramadol 400 mg/Tag, Metamizol-Agranulozytose, MCP-Begrenzung, Naloxon-Wirkdauer, Urapidil-Senkungsziel) plausibel; Simulationsparameter nicht validiert | keine Änderung |

**Stand nach P0-04:** 18 von 75 Modulen vollständig redigiert, 57 offen (Liste in `status.json` → `fortschritt`).


## Q-01 Quellen nur im Admin-Bereich (umgesetzt)

- **Lerninhalte ohne Literaturangaben:** In allen 75 Modulen wurden Quellenverzeichnisse geleert und 82 Klammerzitate (z. B. „(KRINKO, 2016)“, „Inouye et al. (1990)“) aus dem Fließtext genommen. Erklärende Klammern wie „(NRS 2002)“ oder „(CAM)“ bleiben. Fachliche Nennungen im Satz („nach dem Expertenstandard“, „die S3-Leitlinie empfiehlt“) bleiben ebenfalls, weil sie Lerninhalt sind. Ebenso entfernt: Quellenzeilen der Kitteltasche, Literaturblöcke im Training „Ruhig bleiben“, „Quelle/Literaturnachweis“ im Glossar-Popup, Zitat im Delir-Training.
- **Admin-Quellenregister:** `pflegepfadlehrer-main/daten/quellen-register.json`, sichtbar nur in der Admin-Zentrale (Rolle admin) im Reiter „Quellen“. Je Modul ein Quellenverzeichnis und je Textstelle die Belege mit Textauszug, entferntem Zitat, APA-7-Angabe, DOI- bzw. Registerlink, PubMed-Link und Prüfstatus. Suche, Filter und CSV-Export.
- **APA 7 (Stand 24.11.2026):** 174 Zeitschriftenartikel mit PubMed abgeglichen. Dabei wurden DOI, vollständige Autorenlisten, Heft und Seiten ergänzt und Titel in Satzschreibung gebracht. 18 Quellen sind inhaltlich verifiziert (Prüfprotokoll mit Belegstelle). 44 Rechtsquellen sind mit gesetze-im-internet.de bzw. EUR-Lex verlinkt. 229 Bücher, Leitlinien und Berichte sind formal nach APA 7 aufbereitet (Verlagsort entfernt, Komma vor &, Leitlinien mit AWMF-Registerlink); die Angaben sind aber noch nicht am Original geprüft. 31 Kurzformen verweisen auf die vollständige Angabe. 87 Einträge bleiben offen (Webseiten ohne URL, Broschüren, Fachinformationen).
- **Fehler in Quellenangaben gefunden:** O’Driscoll et al. (2017) Seiten ii1–ii90 statt i1–i90; Konstantinides et al. 2020 statt 2019, Aboyans et al. 2018 statt 2017 (Heftjahr); Teasdale & Jennett (1974) Band 304(7872); PubMed führt bei ERC BLS 2025 „Wolfgang, K.“, korrekt ist Keck, W. Zwei Modulzitate (Strametz 2021, Richardson 2019) passten zu keinem PubMed-Datensatz: Sie bleiben ungeprüft und sind im Register markiert.
- **Absicherung:** Regel Q-01 im Strukturtest verhindert neue Quellenlisten, Autor-Jahr-Zitate, DOIs und Registerverweise in Lerninhalten. `quellen_auslagern.py` überschreibt das angereicherte Register nicht mehr.
- **Offen:** Das Register ist eine statische Datei und über ihre URL abrufbar (enthält keine Personendaten). Echter Zugriffsschutz bräuchte eine Supabase-Tabelle mit Admin-RLS und damit eine Änderung an der Produktivdatenbank, die deine Freigabe braucht.


## P0-05 Hygiene (fm38, fm71, fm58, fm19, fm33)

- **Nadelstichverletzung:** Statt „bluten lassen“ heißt es jetzt: Blutfluss fördern, mit Antiseptikum desinfizieren, sofort melden und ohne Verzögerung zum D-Arzt, weil eine HIV-PEP zeitkritisch ist. Geändert in fm38 und im Fachlexikon.
- **Abwurfbehälter:** „Höchstens zu zwei Dritteln“ ist keine Norm. Neu: nur bis zur markierten Füllgrenze, nicht nachdrücken. Geändert in fm38 und im Fachlexikon.
- **Paravasat (fm58):** Bei Zytostatika und anderen gewebeschädigenden Mitteln bleibt die Kanüle zunächst liegen, damit aspiriert werden kann. Ob gekühlt oder gewärmt wird, hängt von der Substanz ab. Vorher hieß es pauschal „Zugang entfernen“.
- **Fallkonsistenz:** In fm33 stand in der Musterlösung „erniedrigtes Kalium“, obwohl im Fall kein Kaliumwert angegeben ist. In fm19 widersprachen sich die Angaben zur Urinmenge, und es fehlte der Hinweis auf die ärztlich festgelegte Trinkmenge bei der herzinsuffizienten Patientin.
- **C. difficile (fm71):** Handschuhe werden jetzt als Sporenbarriere betont. Im Quiz wird klargestellt, dass Sporen keine erworbene Resistenz sind.
- 15 schwache Distraktoren wurden durch plausible ersetzt.


## A-01 Admin-Zentrale übersichtlicher (Lehrerportal)

- Kopf, Abschnittsüberschriften, Kacheln und farbige Kennzahlenkarten folgen jetzt der Startseite des Portals (Kurskarten, Schnellzugriff). Die Reiterleiste hat Icons, bleibt beim Scrollen oben und zeigt auf dem Handy nur die Icons.
- Die Übersicht beginnt mit „Braucht deine Aufmerksamkeit“: Zugangsanfragen, neues Feedback, unbestätigte E-Mail-Adressen, Schulen ohne Aktivität und ungeprüfte Quellen. Jede Kachel führt direkt in den passenden Bereich. Die 14 gleich großen Zahlenkacheln sind in drei Karten zusammengefasst (Schulen und Konten, Lernaktivität, Feedback und KI).
- Quellen: Prüfstand als Balken mit Filter je Status. Ansichten „Nach Modul“ (nach Ausbildungsjahr), „Alle Quellen“ (alphabetisch mit „verwendet in“), „Weitere“ und „Prüfprotokoll“. Quellen, die schon bei einer Textstelle stehen, werden im Modul nicht noch einmal aufgelistet. 16 doppelte Registereinträge mit gleicher DOI wurden zusammengeführt.
- Funktionen, Datenabfragen und Rollenprüfung sind unverändert.
