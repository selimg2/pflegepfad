# Quellenwerkzeuge (Admin-Quellenregister)

Lerninhalte enthalten keine Literaturangaben (Regel Q-01 in `werkzeuge/inhalt_pruefen.py`).
Alle Belege stehen in `pflegepfadlehrer-main/daten/quellen-register.json` und werden im
Lehrerportal nur für die Rolle *admin* angezeigt (Admin-Zentrale → Reiter „Quellen“).

| Werkzeug | Zweck |
|---|---|
| `../quellen_auslagern.py` | einmalig: Quellen und Klammerzitate aus Modulen ins Register verschieben (überschreibt ein angereichertes Register nicht) |
| `pm_parse.py` | PubMed-Metadaten (gespeicherte Antworten von get_article_metadata) in eine kompakte Tabelle überführen |
| `apa_pubmed.py`, `apa_runde.py` | Zeitschriftenartikel mit PubMed-Datensatz abgleichen: DOI, alle Autorinnen und Autoren (APA 7: bis 20, sonst 19 … letzte), Heft, Seiten/Artikelnummer → Status `apa7_geprueft` |
| `apa_regeln.py` | Rechtsquellen mit gesetze-im-internet.de/EUR-Lex verlinken, AWMF-Leitlinien mit Registerlink, Verlagsort entfernen, Komma vor & → Status `rechtsquelle` bzw. `apa7_formal` |
| `register_alias.py` | Kurzformen („DNQP (2020), Expertenstandard …“) auf die vollständige Angabe zurückführen → Status `alias` |
| `register_weitere.py` | Fundstellen außerhalb der Module (Kitteltasche, Trainings) und Prüfprotokoll übernehmen |

Statusstufen: `formal_ungeprueft` → `apa7_formal` (formatiert, Angaben nicht am Original geprüft) →
`apa7_geprueft` (mit PubMed abgeglichen) → `inhalt_verifiziert` (Aussage an der Belegstelle gelesen, siehe Prüfprotokoll).
PubMed-Cache: `.pflegepfad-review/pubmed-cache/`.
