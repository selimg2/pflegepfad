/* Fallpfad "Stationsalltag": Szenarien.
   Ein Szenario beschreibt Station, Zimmer, Patientinnen und Patienten, Aufgaben, Ereignisse und Verläufe.
   Alles ist vorgefertigt und regelbasiert, ohne KI. Neue Szenarien werden einfach an FP_STATION_DATA.szenarien angehängt.

   Bausteine (Kurzreferenz):
   - Zeiten als "HH:MM".
   - Bedingungen (wenn): { zeit: "07:20" } (ab dann), { erledigt: "id" }, { nichtErledigt: "id" }, { flag: "x" }, { nichtFlag: "x" },
     { gefeuert: "ereignisId" }, { status: "kritisch", pat: "id" }, { alle: [..] }, { eine: [..] }.
   - Patient.quelle: { typ: "modul", id: "fm10", ci: 3 } nutzt die Patientenakte aus dem Lernmodul (ci = bis zu welchem Kapitel),
     { typ: "pex", fall: "innere", key: "A" } nutzt Akte, Bild und Simulationen aus der Praktischen Examen Übung, { typ: "neu" } eigene Akte.
   - Patient.verlauf: Liste von Zuständen { ab | flag+nach, wenn, v: Vitalwerte, status }. Es gilt der letzte passende Eintrag.
   - Aufgabe.inhalt.typ: messen | quiz | reihe | zahl | befund (PEX-Bildbefund) | pflege (PEX-Simulation).
   - Antwortoptionen: { t, ok: true | false | Bedingung, teil: true (halbe Punkte), fb, setzt: [flags] }.
   - Ereignis: { um | wenn, art: klingel | telefon | alarm | visite | aufnahme | info | labor, setzt, malus: { kat, pts, t }, pause }. */
window.FP_STATION_DATA = {
  version: 1,
  szenarien: [
    {
      id: "innere-5b-frueh",
      titel: "Frühdienst auf der Inneren",
      station: "Innere Medizin · Station 5B",
      schicht: "Frühdienst",
      start: "06:30", ende: "11:00",
      kurz: "Acht Patientinnen und Patienten, eine Neuaufnahme und ein Mann, dem es von Stunde zu Stunde schlechter geht.",
      rolle: "Du bist im 3. Ausbildungsjahr und betreust heute mit Pflegefachfrau Sabine Hoffmann die Zimmer 510 bis 514. Sie ist am Stützpunkt erreichbar.",
      neuerFall: "brueckner",
      zimmer: [
        { nr: "510", betten: ["seifert", "engel"] },
        { nr: "511", betten: ["neumann", "berger"] },
        { nr: "512", betten: ["brinkmann", "brueckner"] },
        { nr: "513", betten: ["schulte", null] },
        { nr: "514", betten: ["kranz", null] }
      ],
      patienten: {
        seifert: {
          quelle: { typ: "modul", id: "fm40", ci: 99 }, flags: ["o2", "diabetes"],
          uebergabe: "Pneumonie rechts, Tag 3. Nachts ruhig, O₂ 2 l über Nasenbrille, Ziel-SpO₂ 92 bis 96 %. Diabetes, BZ vor dem Frühstück.",
          verlauf: [{ ab: "06:30", status: "beobachten", v: { rr: "132/78", hf: 92, af: 20, spo2: 93, o2: "2 l/min", t: 37.8, bw: "A", bz: 248 } },
            { ab: "09:30", status: "stabil", v: { rr: "128/74", hf: 86, af: 18, spo2: 97, o2: "3 l/min", t: 37.4, bw: "A" } }]
        },
        engel: {
          quelle: { typ: "modul", id: "fm20", ci: 0 }, flags: ["sturz"], kommt: "09:15",
          uebergabe: "Neuaufnahme aus der Notaufnahme gegen 09:15 Uhr: Schwindel und Durchfall seit drei Tagen.",
          verlauf: [{ ab: "09:15", status: "beobachten", v: { rr: "102/60", hf: 58, af: 16, spo2: 96, t: 36.7, bw: "A" } }]
        },
        neumann: {
          quelle: { typ: "modul", id: "fm12", ci: 3 }, flags: ["diabetes", "wunde"],
          uebergabe: "Diabetes mit Insulin, Ulkus am rechten Großzehenballen. Vorgestern Hypoglykämie, als das Frühstück ausfiel. Verbandwechsel heute.",
          verlauf: [{ ab: "06:30", status: "stabil", v: { rr: "146/86", hf: 84, af: 16, spo2: 97, t: 36.9, bw: "A", bz: 186 } }]
        },
        berger: {
          quelle: { typ: "modul", id: "fm39", ci: 99 }, flags: ["sturz", "demenz"],
          uebergabe: "Exsikkose und Harnwegsinfekt, beginnende Demenz. Nachts zweimal allein aufgestanden. Trinkt schlecht.",
          verlauf: [{ ab: "06:30", status: "beobachten", v: { rr: "118/64", hf: 88, af: 18, spo2: 95, t: 37.4, bw: "A" } }]
        },
        brinkmann: {
          quelle: { typ: "pex", fall: "innere", key: "A" }, flags: ["o2", "allergie"],
          uebergabe: "Pneumonie bei COPD, Tag 2. Ceftriaxon um 08 Uhr. Der Zugang am linken Arm brennt seit der Nacht. Hat den Sauerstoff selbst hochgedreht.",
          verlauf: [{ ab: "06:30", status: "beobachten", copd: true, v: { rr: "138/82", hf: 94, af: 22, spo2: 90, o2: "2 l/min", t: 37.9, bw: "A" } }]
        },
        brueckner: {
          quelle: { typ: "neu" },
          name: "Ewald Brückner", kurz: "Herr Brückner", alter: 79, geschlecht: "m",
          diagnose: "Harnwegsinfekt, seit gestern auf Station; Diabetes Typ 2, benigne Prostatahyperplasie",
          av: { hair: "HE", hairC: "#d9dbde", skin: "#f0c7a5", cloth: "#9cc3e6", deco: "gown", wrinkles: 1, glasses: 1, bg: "#ddeeff" },
          flags: ["allergie", "diabetes"],
          uebergabe: "Harnwegsinfekt, gestern aufgenommen, Ciprofloxacin oral. Nachts unruhig, einmal 38,1 °C. Hat wenig getrunken.",
          akte: {
            stamm: [
              ["Person", "Ewald Brückner, 79 Jahre, früher Busfahrer, verheiratet, Ehefrau Helga (77) kommt täglich am Nachmittag"],
              ["Aufnahmegrund", "Brennen beim Wasserlassen, häufiger Harndrang, Fieber bis 38,4 °C seit zwei Tagen"],
              ["Vorerkrankungen", "Diabetes Typ 2 (Metformin), benigne Prostatahyperplasie, arterielle Hypertonie"],
              ["Allergien", "Penicillin (Ganzkörperausschlag und Atemnot 2019)"],
              ["Mobilität", "geht selbstständig mit Gehstock, Brille"],
              ["Kommunikation", "orientiert, etwas schwerhörig links"]
            ],
            anordnungen: [
              ["Medikation", "Ciprofloxacin 500 mg 1-0-1 p. o. · Metformin 1000 mg 1-0-1 · Ramipril 5 mg 1-0-0 · Tamsulosin 0,4 mg 0-0-1"],
              ["Vitalzeichen", "2× täglich, bei Fieber zusätzlich"],
              ["Trinkmenge", "mindestens 2 l, Trinkprotokoll"],
              ["Labor gestern", "CRP 86 mg/l · Leukozyten 13,8 /nl · Kreatinin 1,2 mg/dl · Urinkultur abgenommen, Ergebnis ausstehend"]
            ],
            verlauf: [
              ["Gestern 15:00", "Aufnahme über den Hausarzt, Urinstix: Leukozyten +++, Nitrit positiv"],
              ["Nacht 02:30", "unruhig, will nach Hause, T 38,1 °C, nach Zuwendung wieder eingeschlafen"],
              ["Nacht 05:00", "Trinkprotokoll seit gestern 15 Uhr: 600 ml; Urin dunkel, Menge nicht erfasst"]
            ],
            nacht: { label: "Nacht 05:00", rr: "128/76", hf: 92, af: 18, spo2: 95, t: 38.1, bw: "A" }
          },
          verlauf: [
            { ab: "06:30", status: "beobachten", v: { rr: "124/72", hf: 96, af: 20, spo2: 95, t: 38.3, bw: "A", bz: 168 } },
            { ab: "07:20", status: "kritisch", v: { rr: "104/62", hf: 114, af: 24, spo2: 93, t: 39.4, bw: "C", bz: 196 }, hinweis: "zittert, ist zeitweise nicht orientiert, Haut marmoriert an den Knien" },
            { ab: "08:45", wenn: { nichtFlag: "antibiose" }, status: "kritisch", v: { rr: "84/50", hf: 128, af: 28, spo2: 91, t: 39.6, bw: "V", bz: 210 }, hinweis: "somnolent, reagiert nur auf Ansprache" },
            { flag: ["antibiose", "volumen"], nach: 35, status: "beobachten", v: { rr: "112/66", hf: 98, af: 20, spo2: 95, t: 38.4, bw: "A", bz: 174 }, hinweis: "wacher, orientiert, Urin 150 ml seit Infusionsbeginn" }
          ]
        },
        schulte: {
          quelle: { typ: "modul", id: "fm10", ci: 3 }, flags: ["sturz"],
          uebergabe: "Herzinsuffizienz, Tag 4. Tägliches Wiegen, Bilanz. Furosemid i. v. um 08 Uhr. Nachts unsicher beim Toilettengang.",
          verlauf: [{ ab: "06:30", status: "stabil", v: { rr: "132/80", hf: "88 arrhythmisch", af: 18, spo2: 94, t: 36.6, bw: "A" } }]
        },
        kranz: {
          quelle: { typ: "pex", fall: "innere", key: "B" }, flags: ["sturz"],
          uebergabe: "Kardiale Dekompensation, Tag 3. Hat kaum geschlafen, sitzt aufrecht. Trinkmenge max. 1,5 l.",
          verlauf: [{ ab: "06:30", status: "beobachten", v: { rr: "152/94", hf: "104 arrhythmisch", af: 24, spo2: 91, t: 36.8, bw: "A" } }]
        }
      },

      aufgaben: [
        /* ---------- Routine und vorhandene Inhalte ---------- */
        { id: "kranz-blick", pat: "kranz", t: "Morgenrunde: genau hinschauen", kat: "fachlich", ab: "06:30", faellig: "06:50", dauer: 6, punkte: 12, icon: "eye",
          inhalt: { typ: "befund", fall: "innere", k: "kranzbild" } },
        { id: "schulte-gewicht", pat: "schulte", t: "Tägliches Gewicht", kat: "fachlich", ab: "06:30", faellig: "07:00", dauer: 5, punkte: 8, icon: "scale",
          inhalt: { typ: "quiz", q: "Herr Schulte wiegt heute 84,0 kg. Laut Akte waren es an Tag 2 noch 83,1 kg. Er sagt: „Ich hab gestern Abend zwei große Gläser Wasser getrunken, das zählt doch nicht.“ Was ist richtig?",
            opts: [
              { t: "Gewicht dokumentieren und die Zunahme von 0,9 kg an die Pflegefachkraft bzw. die Ärztin weitergeben, Bilanz und Ödeme prüfen", ok: true, fb: "Richtig. Schon 1 kg über Nacht kann Wassereinlagerung bedeuten. Wiegen immer morgens, nüchtern, nach dem Wasserlassen, gleiche Waage, gleiche Kleidung." },
              { t: "Morgen noch einmal wiegen, ein Tag ist nicht aussagekräftig", ok: false, fb: "Bei Herzinsuffizienz ist eine Zunahme von mehr als 1 kg in einem Tag oder 2 kg in drei Tagen ein Warnzeichen. Das gibst du heute weiter." },
              { t: "Nach dem Frühstück noch einmal wiegen, dann ist es genauer", ok: false, fb: "Gewogen wird immer unter gleichen Bedingungen: morgens nüchtern nach dem Wasserlassen." },
              { t: "Ihm erklären, dass Wasser kein Gewicht macht", ok: false, fb: "Doch: Getrunkenes Wasser wiegt, und bei Herzinsuffizienz zählt jede Zunahme. Trinkmenge und Gewicht gehören zusammen." }
            ] } },
        { id: "seifert-bz", pat: "seifert", t: "Blutzucker vor dem Frühstück", kat: "fachlich", ab: "06:45", faellig: "07:15", dauer: 5, punkte: 10, icon: "drop",
          inhalt: { typ: "messen", nur: ["bz"], frage: { q: "BZ 248 mg/dl. Laut Anordnung gibt es ein Korrekturschema mit Normalinsulin vor den Mahlzeiten. Was machst du?",
            opts: [
              { t: "Korrekturschema in der Kurve nachsehen, Dosis mit der Pflegefachkraft prüfen, spritzen und dokumentieren, Frühstück sicherstellen", ok: true, fb: "Genau. Hoher BZ bei Infekt ist häufig. Insulin nur nach schriftlicher Anordnung, zweite Person prüft." },
              { t: "8 IE Normalinsulin spritzen, das passt meistens", ok: false, fb: "Nie nach Gefühl: Die Dosis steht im Korrekturschema und wird vor der Gabe geprüft." },
              { t: "Kein Insulin, sondern das Frühstück streichen", ok: false, fb: "Bei Infekt braucht er Energie. Mahlzeiten nicht streichen, sondern nach Schema korrigieren." }
            ] } } },
        { id: "neumann-bz", pat: "neumann", t: "Blutzucker und Mischinsulin", kat: "sicherheit", ab: "06:45", faellig: "07:15", dauer: 6, punkte: 10, icon: "drop", link: { tab: "sims", id: "insulin", t: "Simulation Subkutane Injektion und Insulin" },
          inhalt: { typ: "messen", nur: ["bz"], frage: { q: "BZ 186 mg/dl. Frau Neumann bekommt morgens Mischinsulin. Sie sagt: „Ich hab keinen Hunger, ich ess nachher was.“ Was ist jetzt am wichtigsten?",
            opts: [
              { t: "Mischinsulin erst geben, wenn klar ist, dass sie frühstückt; sonst Rücksprache mit der Ärztin", ok: true, fb: "Richtig. Vorgestern hatte sie eine Hypoglykämie, weil nach dem Mischinsulin das Frühstück ausfiel." },
              { t: "Insulin wie immer um 07:15 Uhr geben, sie isst schon noch", ok: false, fb: "Gefährlich: Mischinsulin ohne Mahlzeit führt zur Unterzuckerung. Genau das ist vorgestern passiert." },
              { t: "Die halbe Dosis geben", ok: false, fb: "Dosisänderungen ordnet die Ärztin an, nicht die Pflege." }
            ] } } },
        { id: "brinkmann-ab", pat: "brinkmann", t: "Antibiotische Kurzinfusion 08 Uhr", kat: "fachlich", ab: "07:15", faellig: "08:00", dauer: 20, punkte: 20, icon: "drip", link: { tab: "sims", id: "infusion", t: "Simulation Infusionsmanagement" },
          inhalt: { typ: "pflege", fall: "innere", k: "infusion" } },
        { id: "schulte-furo", pat: "schulte", t: "Furosemid i. v. um 08 Uhr", kat: "sicherheit", ab: "07:30", faellig: "08:00", dauer: 8, punkte: 12, icon: "pill", akte: true, link: { tab: "sims", id: "med6r", t: "Simulation 6-R-Check" },
          inhalt: { typ: "quiz", q: "Furosemid 40 mg i. v. ist für 08 Uhr angeordnet. Du prüfst die 6 R. Schau in die Patientenakte: Was fällt auf und was tust du?",
            opts: [
              { t: "Kalium lag an Tag 3 bei 3,3 mmol/l. Vor der Gabe mit der Ärztin Rücksprache halten, ob gegeben und Kalium ersetzt werden soll", ok: true, fb: "Richtig. Furosemid senkt das Kalium weiter, niedriges Kalium begünstigt Herzrhythmusstörungen, gerade bei Vorhofflimmern." },
              { t: "Alles passt, Furosemid langsam spritzen und dokumentieren", ok: false, fb: "Ein R fehlt: Der richtige Zeitpunkt schließt aktuelle Werte ein. Das niedrige Kalium musst du ansprechen." },
              { t: "Furosemid weglassen, weil er schon genug ausgeschieden hat", ok: false, fb: "Weglassen entscheidet nicht die Pflege. Rücksprache halten, dann dokumentieren." }
            ] } },
        { id: "bett-510", pat: null, zimmer: "510", t: "Bett 510 B für die Neuaufnahme richten", kat: "organisation", ab: "08:30", faellig: "09:10", dauer: 6, punkte: 6, icon: "bed",
          inhalt: { typ: "quiz", multi: true, q: "Herr Engel kommt gleich aus der Notaufnahme. Was gehört zur Vorbereitung des Bettplatzes?",
            opts: [
              { t: "Bett frisch bezogen, auf niedrige Stufe, Bremsen fest", ok: true },
              { t: "Klingel in Reichweite und getestet", ok: true },
              { t: "Aufnahmebogen, Waage und Messgeräte bereitlegen", ok: true },
              { t: "Bettgitter vorsorglich hochziehen", ok: false, fb: "Bettgitter sind eine freiheitsentziehende Maßnahme und brauchen eine Anordnung bzw. Einwilligung." },
              { t: "Die Tür zum Flur schließen, damit es ruhig ist", ok: false, fb: "Ruhe ja, aber neue Patientinnen und Patienten sollen gut erreichbar und beobachtbar sein." }
            ] } },
        { id: "kranz-trink", pat: "kranz", t: "Gespräch über die Trinkmenge", kat: "kommunikation", ab: "08:30", faellig: "09:30", dauer: 8, punkte: 10, icon: "chat",
          inhalt: { typ: "quiz", q: "Frau Kranz sagt: „Zwei Liter Wasser am Tag, das war schon immer gut für meine Nieren. Das lass ich mir nicht nehmen.“ Laut Anordnung darf sie höchstens 1,5 Liter trinken. Wie reagierst du?",
            opts: [
              { t: "„Sie achten gut auf sich. Bei Ihrem Herzen ist das gerade anders: zu viel Flüssigkeit staut sich in Beinen und Lunge. Wollen wir zusammen planen, wie Sie die 1,5 Liter über den Tag verteilen?“", ok: true, fb: "Sehr gut: Wertschätzung, kurze verständliche Begründung, gemeinsamer Plan. Hilfreich sind kleine Gläser und ein Trinkplan." },
              { t: "„Das ist ärztlich angeordnet, da gibt es keine Diskussion.“", ok: false, fb: "Inhaltlich richtig, aber sie fühlt sich bevormundet und trinkt heimlich weiter. Erklären und einbeziehen wirkt besser." },
              { t: "„Na gut, dann trinken Sie eben zwei Liter, Sie kennen sich ja am besten.“", ok: false, fb: "Das gefährdet sie. Die Begrenzung ist bei kardialer Dekompensation wichtig. Gib die Info außerdem an die Pflegefachkraft weiter." }
            ] } },
        { id: "berger-mund", pat: "berger", t: "Mundpflege und Trinken", kat: "fachlich", ab: "08:30", faellig: "09:30", dauer: 10, punkte: 10, icon: "drop",
          inhalt: { typ: "quiz", multi: true, q: "Frau Berger hat eine belegte Zunge, rissige Lippen und trinkt kaum. Welche Maßnahmen passen?",
            opts: [
              { t: "Lieblingsgetränk erfragen und regelmäßig, sichtbar in Reichweite anbieten", ok: true },
              { t: "Teilprothese herausnehmen, reinigen, Mundhöhle inspizieren", ok: true },
              { t: "Lippen pflegen, Zunge vorsichtig reinigen", ok: true },
              { t: "Trinkprotokoll führen und Einfuhr bilanzieren", ok: true },
              { t: "Zitronenstäbchen zur Anregung des Speichelflusses", ok: false, fb: "Zitrone trocknet die Schleimhaut auf Dauer aus und greift den Zahnschmelz an." },
              { t: "Getränke erst zu den Mahlzeiten geben, damit sie nachts nicht muss", ok: false, fb: "Bei Exsikkose zählt jede Menge über den Tag verteilt. Für die Nacht lieber die Toilettengänge begleiten." }
            ] } },
        { id: "engel-aufnahme", pat: "engel", t: "Aufnahme: Medikamente erfragen", kat: "sicherheit", ab: "09:15", faellig: "09:45", dauer: 12, punkte: 14, icon: "clip", akte: true,
          inhalt: { typ: "quiz", q: "Herr Engel erzählt: „Und für das Knie nehm ich seit ein paar Wochen Ibuprofen, jeden Tag zwei, das hat mir die Apothekerin gegeben.“ Er hat laut Plan einen ACE-Hemmer und Spironolacton. Was tust du?",
            opts: [
              { t: "Im Aufnahmebogen als Selbstmedikation dokumentieren und sofort der Ärztin melden: Kombination kann Kalium und Nierenwerte gefährlich erhöhen", ok: true, fb: "Richtig. ACE-Hemmer, Spironolacton und Ibuprofen zusammen sind ein typisches Risiko für Hyperkaliämie und Nierenversagen. Das Aufnahmelabor zeigt Kalium 5,6 mmol/l." },
              { t: "Notieren, das bespricht die Ärztin bei der Visite morgen", ok: false, fb: "Das ist zu spät. Er hat Schwindel und einen langsamen Puls, die Kombination ist akut relevant." },
              { t: "Ihm sagen, er soll Ibuprofen ab sofort weglassen, und nichts weiter tun", ok: false, fb: "Der Hinweis allein reicht nicht: Ärztin informieren und dokumentieren." }
            ] } },
        { id: "seifert-atem", pat: "seifert", t: "Sauerstoff und Atemtherapie", kat: "fachlich", ab: "09:30", faellig: "10:15", dauer: 8, punkte: 10, icon: "lung",
          inhalt: { typ: "messen", nur: ["spo2", "af", "o2"], frage: { q: "SpO₂ 97 % unter 3 l/min. Laut Anordnung soll die Sättigung zwischen 92 und 96 % liegen. Jemand hat den Sauerstoff hochgedreht. Was ist richtig?",
            opts: [
              { t: "Sauerstoff nach Anordnung auf 2 l/min zurückregeln, nachmessen, Atemübungen und Mobilisation in den Sessel anleiten", ok: true, fb: "Richtig. Sauerstoff ist ein Medikament: so viel wie nötig, so wenig wie möglich. Bewegung und tiefes Atmen beugen weiterer Belüftungsstörung vor." },
              { t: "So lassen, mehr Sauerstoff schadet nicht", ok: false, fb: "Doch: Zu viel Sauerstoff kann schaden. Das Ziel ist ein Bereich, kein Maximum." },
              { t: "Sauerstoff ganz abstellen, die Sättigung ist ja gut", ok: false, fb: "Ohne Rücksprache nicht abstellen. Erst auf die angeordnete Menge regeln und beobachten." }
            ] } } },
        { id: "visite", pat: null, t: "Visite: Was meldest du zuerst?", kat: "fachlich", ab: "09:45", faellig: "10:00", dauer: 10, punkte: 12, icon: "steth", wenn: { gefeuert: "visite" },
          inhalt: { typ: "reihe", q: "Dr. Sommerfeld fragt: „Was ist heute bei Ihnen wichtig?“ Bring die Punkte in die Reihenfolge, in der du sie meldest (wichtigstes zuerst).",
            items: ["Herr Brückner: Verdacht auf Sepsis, Verlauf seit der Antibiose", "Herr Engel: Ibuprofen bei ACE-Hemmer und Spironolacton, Kalium 5,6", "Herr Schulte: Kalium 3,3 vor Furosemid, Gewicht +0,9 kg", "Frau Berger: trinkt wenig, nachts allein aufgestanden"] } },
        { id: "neumann-vw", pat: "neumann", t: "Verbandwechsel am Fuß", kat: "fachlich", ab: "09:30", faellig: "10:30", dauer: 15, punkte: 12, icon: "band", link: { tab: "sims", id: "asepsis", t: "Simulation Aseptischer Verbandwechsel" },
          inhalt: { typ: "quiz", multi: true, q: "Ulkus 1,2 × 0,8 cm am rechten Großzehenballen bei diabetischem Fußsyndrom. Was gehört zu einem guten Verbandwechsel?",
            opts: [
              { t: "Hände desinfizieren, Non-Touch-Technik, sterile Materialien", ok: true },
              { t: "Wunde beurteilen: Größe, Wundgrund, Exsudat, Rand, Geruch", ok: true },
              { t: "Druckentlastung ansprechen: Verbandschuh bzw. geeignetes Schuhwerk", ok: true },
              { t: "Befund mit Datum dokumentieren, Veränderungen melden", ok: true },
              { t: "Fuß vorher in warmem Wasser einweichen", ok: false, fb: "Fußbäder weichen die Haut auf und erhöhen das Infektionsrisiko, bei Neuropathie drohen zudem Verbrühungen." },
              { t: "Hornhaut rund um die Wunde selbst mit der Schere abtragen", ok: false, fb: "Abtragen gehört in ärztliche bzw. podologische Hände." }
            ] } },
        { id: "berger-sturz", pat: "berger", t: "Frau Berger steht allein auf", kat: "sicherheit", ab: "10:20", faellig: "10:25", dauer: 6, punkte: 12, icon: "alert", wenn: { gefeuert: "berger-klingel" }, link: { tab: "sims", id: "sturz", t: "Simulation Sturz" },
          inhalt: { typ: "quiz", q: "Frau Berger steht schwankend neben dem Bett, barfuß, und sagt: „Ich muss mal, ganz dringend.“ Was tust du?",
            opts: [
              { t: "Ruhig ansprechen, stützen, Schuhe bzw. rutschfeste Socken anziehen und sie zur Toilette begleiten; danach Toilettengänge regelmäßig anbieten", ok: true, fb: "Richtig. Sie hat einen echten Grund (Harnwegsinfekt, mehr Trinken). Begleiten und regelmäßige Toilettenangebote beugen dem nächsten Sturz vor." },
              { t: "Sie bitten, sich wieder hinzulegen, und eine Bettpfanne bringen", ok: false, fb: "Das nimmt ihr Selbstständigkeit und Würde. Besser begleiten." },
              { t: "Bettgitter hochziehen, damit sie liegen bleibt", ok: false, fb: "Bettgitter sind freiheitsentziehend und erhöhen bei Menschen mit Demenz das Sturzrisiko (Übersteigen)." }
            ] } },

        /* ---------- Neuer Fall: Herr Brückner ---------- */
        { id: "br-vit", pat: "brueckner", t: "Vitalzeichen Herr Brückner", kat: "sicherheit", ab: "06:30", faellig: "07:00", dauer: 8, punkte: 16, icon: "pulse", fall: true,
          inhalt: { typ: "messen", frage: { q: "Wie gehst du mit diesen Werten um?",
            opts: [
              { t: "Sofort die Ärztin informieren (SBAR): Verdacht auf Sepsis", ok: { status: "kritisch", pat: "brueckner" }, teil: true, setzt: ["br-auffaellig"], fb: "Bei diesen Werten richtig: Fieber, schneller Puls, schnelle Atmung, fallender Blutdruck und neue Verwirrtheit sind Warnzeichen einer Sepsis. Bei leicht auffälligen Werten ist frühes Melden nicht falsch, aber engmaschige Kontrolle hätte gereicht." },
              { t: "Pflegefachkraft informieren, Temperatur- und Trinkverlauf beobachten, spätestens in einer Stunde erneut messen", ok: { nichtStatus: "kritisch", pat: "brueckner" }, setzt: ["br-beob"], fb: "Bei leicht auffälligen Werten passend. Sind die Werte schon kritisch, reicht das nicht: Dann sofort die Ärztin." },
              { t: "Im Rahmen bei einem Infekt, nächste Messung zur Mittagsrunde", ok: false, fb: "Zu spät. Fieber mit Tachykardie bei Harnwegsinfekt im Alter muss engmaschig verfolgt werden." },
              { t: "Erst einmal ein fiebersenkendes Mittel geben", ok: false, fb: "Medikamente nur nach Anordnung. Fiebersenken verschleiert außerdem den Verlauf." }
            ] } } },
        { id: "br-vit2", pat: "brueckner", t: "Herr Brückner erneut messen", kat: "sicherheit", ab: "07:25", faellig: "07:35", dauer: 6, punkte: 14, icon: "pulse", fall: true,
          wenn: { alle: [{ gefeuert: "br-klingel" }, { erledigt: "br-vit" }, { nichtFlag: "br-auffaellig" }] },
          inhalt: { typ: "messen", frage: { q: "Herr Brückner zittert stark. Was jetzt?",
            opts: [
              { t: "Sofort die Ärztin informieren (SBAR) und bei ihm bleiben bzw. die Pflegefachkraft dazuholen", ok: true, setzt: ["br-auffaellig"], fb: "Richtig. Schüttelfrost, Tachykardie, Hypotonie und neue Verwirrtheit: Verdacht auf Sepsis. Jede Stunde zählt." },
              { t: "Zudecken, Tee bringen, in 30 Minuten nachmessen", ok: false, setzt: [], fb: "Wärme ist angenehm, aber diese Werte brauchen sofort die Ärztin." }
            ] } } },
        { id: "br-sbar", pat: "brueckner", t: "Ärztin anrufen (SBAR)", kat: "kommunikation", faelligNach: { flag: "br-auffaellig", min: 10 }, dauer: 6, punkte: 14, icon: "phone", fall: true, wenn: { flag: "br-auffaellig" }, setzt: ["arzt-br"], link: { tab: "sims", id: "sbar", t: "Simulation SBAR-Arztruf" },
          inhalt: { typ: "reihe", q: "Bring deinen Anruf bei Dr. Sommerfeld in die SBAR-Reihenfolge.",
            items: [
              "S: „Hier ist … von Station 5B, Zimmer 512. Ich rufe an wegen Herrn Brückner, 79 Jahre. Ich mache mir Sorgen um eine Sepsis.“",
              "B: „Er ist seit gestern mit Harnwegsinfekt da, Ciprofloxacin oral, Diabetes. Allergie gegen Penicillin.“",
              "A: „Jetzt Temperatur 39,4, Puls 114, Atmung 24, Blutdruck 104/62, neu verwirrt.“",
              "R: „Bitte kommen Sie sofort zur Beurteilung. Soll ich Blutkulturen und Zugang vorbereiten?“"
            ] } },
        { id: "br-bk", pat: "brueckner", t: "Blutkulturen vorbereiten", kat: "fachlich", faelligNach: { flag: "arzt-br", min: 15 }, dauer: 10, punkte: 12, icon: "tube", fall: true, wenn: { flag: "arzt-br" }, setzt: ["bk"],
          inhalt: { typ: "quiz", multi: true, q: "Die Ärztin nimmt gleich zwei Blutkultur-Sets ab, du assistierst. Was stimmt?",
            opts: [
              { t: "Vor der ersten Antibiotikagabe abnehmen", ok: true },
              { t: "Je Set eine aerobe und eine anaerobe Flasche", ok: true },
              { t: "Haut und Septum der Flaschen desinfizieren, Einwirkzeit abwarten", ok: true },
              { t: "Mit Name, Datum, Uhrzeit und Entnahmeort beschriften", ok: true },
              { t: "Aus dem liegenden peripheren Zugang abnehmen, das spart einen Stich", ok: false, fb: "Aus liegenden Zugängen steigt das Risiko verunreinigter Kulturen. Frisch punktieren." },
              { t: "Flaschen bis zum Abend im Kühlschrank sammeln", ok: false, fb: "Blutkulturen sofort ins Labor bzw. in den Brutschrank, nicht kühlen." }
            ] } },
        { id: "br-ab", pat: "brueckner", t: "Antibiose vorbereiten", kat: "sicherheit", faelligNach: { flag: "arzt-br", min: 20 }, dauer: 8, punkte: 16, icon: "pill", fall: true, akte: true, wenn: { flag: "arzt-br" },
          inhalt: { typ: "quiz", q: "Angeordnet: Piperacillin/Tazobactam 4,5 g i. v. sofort nach den Blutkulturen. Du prüfst die 6 R und schaust in die Akte. Was tust du?",
            opts: [
              { t: "Nicht anhängen: In der Akte steht eine Penicillinallergie mit Atemnot. Sofort die Ärztin darauf hinweisen", ok: true, setzt: ["ab-umstellen"], fb: "Sehr gut. Piperacillin ist ein Penicillin. Bei einer Allergie mit Atemnot droht eine Anaphylaxie." },
              { t: "Anhängen, die Ärztin wird das schon wissen", ok: false, setzt: ["ab-falsch"], fb: "Gefährlich: Die Pflege prüft jede Gabe selbst. Piperacillin ist ein Penicillin, Herr Brückner hat eine Penicillinallergie mit Atemnot." },
              { t: "Erst eine kleine Testmenge laufen lassen", ok: false, setzt: ["ab-falsch"], fb: "Bei bekannter Allergie mit Atemnot gibt es keine Testmenge auf Station. Ärztin informieren." }
            ] } },
        { id: "br-ab2", pat: "brueckner", t: "Antibiose anhängen", kat: "fachlich", faelligNach: { flag: "ab-neu", min: 10 }, dauer: 8, punkte: 10, icon: "drip", fall: true, wenn: { flag: "ab-neu" }, setzt: ["antibiose"],
          inhalt: { typ: "quiz", multi: true, q: "Dr. Sommerfeld hat auf Meropenem 1 g i. v. umgestellt. Was gehört jetzt dazu?",
            opts: [
              { t: "Blutkulturen sind abgenommen, erst dann anhängen", ok: true },
              { t: "6 R mit der Pflegefachkraft prüfen, Patientenarmband abgleichen", ok: true },
              { t: "In den ersten Minuten bei ihm bleiben und auf Reaktionen achten", ok: true },
              { t: "Uhrzeit des Beginns dokumentieren", ok: true },
              { t: "Infusion möglichst schnell laufen lassen, auch wenn nichts angeordnet ist", ok: false, fb: "Laufzeit und Dosis stehen in der Anordnung bzw. Fachinformation." }
            ] } },
        { id: "br-inf", pat: "brueckner", t: "Infusion an der Pumpe einstellen", kat: "fachlich", faelligNach: { flag: "arzt-br", min: 20 }, dauer: 6, punkte: 10, icon: "drip", fall: true, wenn: { flag: "arzt-br" }, setzt: ["volumen"], link: { tab: "sims", id: "infusion", t: "Simulation Infusionsmanagement" },
          inhalt: { typ: "zahl", q: "Angeordnet: 1 000 ml Vollelektrolytlösung über 60 Minuten. Welche Laufrate stellst du an der Infusionspumpe ein?", wert: 1000, tol: 0, einheit: "ml/h", erkl: "1 000 ml in 60 Minuten sind 1 000 ml pro Stunde. Danach Blutdruck, Atmung und Lunge (Rasseln?) im Blick behalten." } },
        { id: "br-kontrolle", pat: "brueckner", t: "Kontrolle 30 Minuten nach Therapiebeginn", kat: "sicherheit", faelligNach: { flag: ["antibiose", "volumen"], min: 35 }, ab0: true, dauer: 6, punkte: 12, icon: "pulse", fall: true, wenn: { alle: [{ flag: "antibiose" }, { flag: "volumen" }] },
          inhalt: { typ: "messen", frage: { q: "Wie geht es weiter?",
            opts: [
              { t: "Werte dokumentieren und melden, weiter alle 30 Minuten kontrollieren, Bilanz führen", ok: true, fb: "Richtig. Er spricht auf die Therapie an, bleibt aber engmaschig überwacht." },
              { t: "Er ist über den Berg, nächste Messung am Nachmittag", ok: false, fb: "Zu früh. In den ersten Stunden kann sich der Zustand wieder verschlechtern." }
            ] } } },
        { id: "br-bilanz", pat: "brueckner", t: "Flüssigkeitsbilanz", kat: "fachlich", faelligNach: { flag: ["antibiose", "volumen"], min: 50 }, dauer: 5, punkte: 8, icon: "scale", fall: true, wenn: { alle: [{ flag: "antibiose" }, { flag: "volumen" }] },
          inhalt: { typ: "zahl", q: "Seit 06 Uhr: Infusion 1 000 ml, Antibiose 100 ml, Tee 250 ml. Ausfuhr: Urin 350 ml. Wie hoch ist die Bilanz?", wert: 1000, tol: 0, einheit: "ml", vorzeichen: true, erkl: "Einfuhr 1 350 ml minus Ausfuhr 350 ml ergibt +1 000 ml. Die Urinmenge ist bei Sepsis ein wichtiges Zeichen für die Durchblutung der Nieren." } },
        { id: "br-doku", pat: "brueckner", t: "Pflegebericht schreiben", kat: "doku", ab: "10:00", faellig: "10:50", dauer: 6, punkte: 10, icon: "doc", fall: true, wenn: { flag: "arzt-br" },
          inhalt: { typ: "quiz", q: "Welcher Eintrag ist fachlich und rechtlich am besten?",
            opts: [
              { t: "„07:25 Schüttelfrost, T 39,4 °C, HF 114, AF 24, RR 104/62, neu verwirrt. 07:30 Dr. Sommerfeld per SBAR informiert. Blutkulturen 2×2, Penicillinallergie gemeldet, Meropenem umgestellt, VEL 1 000 ml. Kontrolle: siehe Verlauf.“", ok: true, fb: "Genau: Uhrzeiten, Messwerte, Maßnahmen, wer informiert wurde. Nachvollziehbar und ohne Wertung." },
              { t: "„Pat. ging es heute morgen schlecht, Arzt informiert, jetzt besser.“", ok: false, fb: "Zu ungenau: keine Uhrzeiten, keine Werte, keine Maßnahmen." },
              { t: "„Pat. hat nachts zu wenig getrunken, daher Verschlechterung. Nachtdienst informiert.“", ok: false, fb: "Wertend und spekulativ. Dokumentiert werden Beobachtungen und Maßnahmen." }
            ] } }
      ],

      ereignisse: [
        { id: "uebergabe", um: "06:30", art: "info", titel: "Schichtbeginn", text: "Übergabe ist gelaufen. Sabine Hoffmann: „Schau zuerst bei Herrn Brückner und Frau Kranz rein, die hatten eine unruhige Nacht.“" },
        { id: "kranz-klingel", um: "06:52", art: "klingel", pat: "kranz", titel: "Klingel Zimmer 514", text: "Frau Kranz: „Ich krieg so schlecht Luft im Liegen. Können Sie das Kopfteil höher stellen?“", wichtig: 1 },
        { id: "br-klingel", um: "07:25", art: "klingel", pat: "brueckner", titel: "Klingel Zimmer 512", text: "Herr Brinkmann ruft: „Kommen Sie mal, mein Nachbar zittert am ganzen Körper!“ Herr Brückner hat Schüttelfrost.", wichtig: 3 },
        { id: "labor-schulte", um: "07:40", art: "labor", pat: "schulte", titel: "Laborwert Herr Schulte", text: "Das Labor meldet für Herrn Schulte Kalium 3,2 mmol/l von heute früh.", wichtig: 2 },
        { id: "br-spaet", um: "08:00", art: "klingel", pat: "brueckner", wenn: { nichtFlag: "br-auffaellig" }, setzt: ["br-auffaellig"], titel: "Herr Brückner wirkt verwirrt", text: "Herr Brückners Frau ruft auf Station an: Ihr Mann habe am Telefon wirres Zeug geredet. Bei ihm: zittert, Puls über 110.", wichtig: 3, malus: { kat: "sicherheit", pts: 10, t: "Die Verschlechterung von Herrn Brückner wurde erst durch einen Anruf der Ehefrau bemerkt." } },
        { id: "br-anordnung", wenn: { flag: "arzt-br" }, art: "telefon", pat: "brueckner", titel: "Ärztliche Anordnung", text: "Dr. Sommerfeld: „Ich komme. Bitte Blutkulturen zwei Sets, Laktat, 1 000 ml Vollelektrolyt über eine Stunde, danach Piperacillin/Tazobactam 4,5 g, Vitalzeichen alle 30 Minuten, Bilanz.“ Du wiederholst die Anordnung zur Sicherheit.", wichtig: 2 },
        { id: "br-ab-neu", wenn: { flag: "ab-umstellen" }, art: "telefon", pat: "brueckner", setzt: ["ab-neu"], titel: "Antibiose umgestellt", text: "Dr. Sommerfeld: „Danke, gut aufgepasst. Wir nehmen Meropenem 1 g i. v., ich trage es ein.“", wichtig: 1 },
        { id: "br-reaktion", wenn: { flag: "ab-falsch" }, art: "alarm", pat: "brueckner", setzt: ["ab-umstellen"], titel: "Allergische Reaktion", text: "Wenige Minuten nach Start der Infusion: Juckreiz, Quaddeln am Hals, Herr Brückner hustet. Die Infusion wird sofort gestoppt, die Ärztin ist da und behandelt die Reaktion. Penicillinallergie stand in der Akte.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 15, t: "Penicillin trotz dokumentierter Penicillinallergie angehängt." }, link: { tab: "sims", id: "anaphylaxie", t: "Simulation Anaphylaxie" } },
        { id: "br-notfall", um: "08:45", wenn: { nichtFlag: "antibiose" }, art: "alarm", pat: "brueckner", titel: "Herr Brückner reagiert kaum", text: "RR 84/50, Puls 128, somnolent. Sabine Hoffmann alarmiert das Notfallteam. Jede Stunde ohne Antibiose verschlechtert die Prognose bei Sepsis.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 12, t: "Bis 08:45 Uhr lief bei Verdacht auf Sepsis keine Antibiose." } },
        { id: "engel-kommt", um: "09:15", art: "aufnahme", pat: "engel", titel: "Neuaufnahme Zimmer 510", text: "Herr Engel kommt aus der Notaufnahme: Schwindel und Durchfall seit drei Tagen, Kalium 5,6 mmol/l.", wichtig: 2 },
        { id: "bett-fehlt", um: "09:15", wenn: { nichtErledigt: "bett-510" }, art: "info", pat: "engel", titel: "Bett nicht vorbereitet", text: "Herr Engel wartet auf dem Flur, weil der Bettplatz noch nicht gerichtet ist.", wichtig: 1, malus: { kat: "organisation", pts: 4, t: "Der Bettplatz für die Neuaufnahme war nicht vorbereitet." } },
        { id: "visite", um: "09:45", art: "visite", titel: "Visite beginnt", text: "Dr. Sommerfeld kommt zur Visite und möchte von dir das Wichtigste hören.", wichtig: 2 },
        { id: "berger-klingel", um: "10:20", art: "alarm", pat: "berger", titel: "Bettalarm Zimmer 511", text: "Der Sensor an Frau Bergers Bett meldet: Sie ist aufgestanden.", wichtig: 3 },
        { id: "angehoerige", um: "10:35", art: "telefon", pat: "brueckner", titel: "Anruf von Frau Brückner", text: "Frau Brückner fragt, wie es ihrem Mann geht. Telefonisch darfst du ohne Einverständnis keine Auskünfte geben. Du bietest an, dass die Ärztin zurückruft, und sagst, dass sie gern vorbeikommen kann.", wichtig: 1 }
      ]
    }
  ]
};
