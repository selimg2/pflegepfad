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
