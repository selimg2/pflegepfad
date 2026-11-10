/* Fallpfad "Stationsalltag": zwei weitere Stationen.
   1. Unfallchirurgie, Station 3A, Spätdienst (13:30 bis 18:00 Uhr)
   2. Stationäre Langzeitpflege, Seniorenzentrum Lindenhof, Wohnbereich 2, Frühdienst (06:00 bis 10:30 Uhr)
   Aufbau wie in 42-stationsalltag-szenarien.js. Zusätzlich für die Zufalls-Engine (45-stationsalltag-zufall.js):
   - dramen: kritische Verläufe, von denen je Schicht einer oder zwei gezogen werden
   - varianten, chance: unterschiedliche Fassungen und gelegentliche Ereignisse
   - zufall: stationstypische Alltagsereignisse (zusätzlich zum allgemeinen Pool)
   Alle Personen sind erfunden. Fachliche Inhalte vor dem Einsatz bitte durch die Schule prüfen lassen. */
(function () {
  var D = window.FP_STATION_DATA;
  if (!D) return;

  /* =====================================================================
     1. UNFALLCHIRURGIE · STATION 3A · SPÄTDIENST
     ===================================================================== */
  D.szenarien.push({
    id: "unfall-3a-spaet",
    titel: "Spätdienst in der Unfallchirurgie",
    station: "Unfallchirurgie · Station 3A",
    schicht: "Spätdienst",
    start: "13:30", ende: "18:00",
    setting: "krankenhaus", stuetzpunkt: "Jonas Petersen",
    kurz: "Frisch Operierte, eine Neuaufnahme aus dem Pflegeheim und eine OP-Vorbereitung für morgen. Wer genau hinschaut, erkennt rechtzeitig, wenn ein Verlauf kippt.",
    rolle: "Du bist im 2. Ausbildungsjahr und betreust heute mit Pflegefachmann Jonas Petersen die Zimmer 301 bis 304. Er ist am Stützpunkt, begleitet aber auch Transporte in den OP. Stationsärztin ist Dr. Kaya.",
    variation: { streu: 8, dramen: [1, 2], zufall: [2, 4] },
    zimmer: [
      { nr: "301", betten: ["lohmann", "krueger"] },
      { nr: "302", betten: ["brandt", "yildiz"] },
      { nr: "303", betten: ["schuster", null] },
      { nr: "304", betten: ["albers", null] }
    ],
    patienten: {
      lohmann: {
        quelle: { typ: "neu" }, name: "Irmgard Lohmann", kurz: "Frau Lohmann", alter: 84, geschlecht: "w",
        diagnose: "Mediale Schenkelhalsfraktur rechts, gestern Duokopfprothese; Vorhofflimmern, Osteoporose",
        av: { hair: "GL", hairC: "#d6d9dd", skin: "#f6d2b3", cloth: "#e8b4a6", bg: "#fde8e8", wrinkles: 1, glasses: 1 },
        flags: ["sturz", "op", "schmerz"], zflags: ["mobil", "seh", "med"],
        uebergabe: "Tag 1 nach Duokopfprothese rechts. Heute früh mit Physio an der Bettkante. Redon hat bis 12 Uhr 180 ml gefördert. Nachts kurz unruhig, hat nach ihrem verstorbenen Mann gerufen. Hörgerät rechts.",
        akte: {
          stamm: [
            ["Person", "Irmgard Lohmann, 84 Jahre, verwitwet, lebt allein mit Hausnotruf. Sohn Thomas wohnt in der Nähe"],
            ["Aufnahmegrund", "Sturz im Badezimmer vor zwei Tagen, mediale Schenkelhalsfraktur rechts"],
            ["Operation", "Gestern Duokopfprothese rechts (Hemiarthroplastik), dorsaler Zugang"],
            ["Vorerkrankungen", "Vorhofflimmern (Apixaban pausiert), arterielle Hypertonie, Osteoporose, leichte kognitive Einschränkung"],
            ["Allergien", "keine bekannt"],
            ["Mobilität", "vor dem Sturz mit Rollator selbstständig, jetzt Vollbelastung erlaubt"],
            ["Kommunikation", "schwerhörig, Hörgerät rechts, Brille"]
          ],
          anordnungen: [
            ["Medikation", "Metamizol 1 g 1-1-1-1 p. o. · Oxycodon/Naloxon 10/5 mg 1-0-1 · Bedarf: Oxycodon 5 mg akut, höchstens 4× täglich · Enoxaparin 40 mg s. c. 18 Uhr · Bisoprolol 2,5 mg 1-0-0 · Pantoprazol 20 mg 1-0-0"],
            ["Drainage", "Redon rechte Hüfte mit Sog, Menge je Schicht dokumentieren, ab 400 ml je Schicht ärztlich informieren"],
            ["Mobilisation", "Vollbelastung, Luxationsprophylaxe nach dorsalem Zugang (keine Beugung über 90°, kein Überschlagen der Beine, keine Innendrehung)"],
            ["Labor heute früh", "Hb 10,2 g/dl (vor der OP 12,4 g/dl) · Kreatinin 1,0 mg/dl"],
            ["Vitalzeichen", "3× täglich, bei Auffälligkeiten engmaschig"]
          ],
          verlauf: [
            ["Gestern", "OP komplikationslos, 2 EK vorbereitet, nicht benötigt"],
            ["Nacht", "Unruhig gegen 03 Uhr, nach Orientierungshilfe wieder eingeschlafen. Redon 120 ml"],
            ["Heute früh", "Bettkante mit Physio, Kreislauf stabil, Schmerz NRS 3 in Ruhe, 5 bei Bewegung"]
          ]
        },
        verlauf: [{ ab: "13:30", status: "beobachten", v: { rr: "128/72", hf: "86 arrhythmisch", af: 16, spo2: 95, t: 37.3, bw: "A" } }]
      },
      krueger: {
        quelle: { typ: "neu" }, name: "Hannelore Krüger", kurz: "Frau Krüger", alter: 88, geschlecht: "w", kommt: "15:20",
        diagnose: "Sturz im Pflegeheim, Verdacht auf pertrochantäre Femurfraktur links; Alzheimer-Demenz, Vorhofflimmern unter Phenprocoumon",
        av: { hair: "HK", hairC: "#e2e4e7", skin: "#f6d2b3", cloth: "#9cc3e6", bg: "#ddeeff", wrinkles: 1 },
        flags: ["sturz", "demenz", "schmerz", "nuechtern"], zflags: ["seh"],
        uebergabe: "Kommt gegen 15:20 Uhr aus der Notaufnahme: im Pflegeheim gestürzt, linkes Bein verkürzt und außenrotiert. Demenz, nimmt Marcumar. Nüchtern lassen, OP ist noch nicht geplant.",
        akte: {
          stamm: [
            ["Person", "Hannelore Krüger, 88 Jahre, lebt seit drei Jahren im Pflegeheim Haus Abendsonne. Gesetzliche Betreuerin: Tochter Sabine Krüger"],
            ["Aufnahmegrund", "Heute Mittag Sturz im Zimmer, Schmerzen linke Hüfte, Bein verkürzt und außenrotiert"],
            ["Vorerkrankungen", "Alzheimer-Demenz (mittelgradig), Vorhofflimmern, Herzinsuffizienz, Schwerhörigkeit"],
            ["Allergien", "keine bekannt"],
            ["Patientenverfügung", "vorhanden, liegt in Kopie bei"],
            ["Kommunikation", "zu Ort und Zeit nicht orientiert, kurze Sätze, reagiert gut auf ruhige Ansprache und Berührung an der Hand"]
          ],
          anordnungen: [
            ["Medikation laut Heimplan", "Phenprocoumon nach INR (letzte Gabe gestern) · Bisoprolol 5 mg 1-0-0 · Torasemid 10 mg 1-0-0 · Donepezil 5 mg 0-0-1"],
            ["Notaufnahme", "Röntgen: pertrochantäre Femurfraktur links. INR 2,8. Metamizol 1 g i. v. um 14:30 Uhr erhalten"],
            ["Vorgaben", "nüchtern bis zur OP-Planung, Infusion Vollelektrolyt 500 ml, Schmerzeinschätzung mit BESD"]
          ],
          verlauf: [["Notaufnahme", "Unruhig, ruft nach ihrer Mutter, wehrt Berührung am linken Bein ab"]]
        },
        verlauf: [{ ab: "15:20", status: "beobachten", v: { rr: "158/90", hf: "96 arrhythmisch", af: 20, spo2: 94, t: 36.4 }, hinweis: "bekannte Demenz, desorientiert, stöhnt bei Bewegung" }]
      },
      brandt: {
        quelle: { typ: "neu" }, name: "Kevin Brandt", kurz: "Herr Brandt", alter: 34, geschlecht: "m",
        diagnose: "Unterschenkelschaftfraktur links nach Motorradunfall, heute 09 Uhr Marknagelung",
        av: { hair: "JO", hairC: "#3a2a22", skin: "#f6d2b3", cloth: "#0e7490", bg: "#e6f6f3", stubble: true },
        flags: ["op", "schmerz", "infusion"], zflags: ["mobil"],
        uebergabe: "Heute früh Marknagel links. Schmerzen um 12 Uhr NRS 5, hat Piritramid bekommen. pDMS bisher unauffällig. Hat seit der OP noch kein Wasser gelassen. Raucht, will dauernd raus.",
        akte: {
          stamm: [
            ["Person", "Kevin Brandt, 34 Jahre, Kfz-Mechatroniker, lebt mit seiner Partnerin Laura"],
            ["Aufnahmegrund", "Gestern Abend Motorradunfall, geschlossene Unterschenkelschaftfraktur links"],
            ["Operation", "Heute 09 Uhr Marknagelung Tibia links in Spinalanästhesie"],
            ["Vorerkrankungen", "keine; Raucher (15 Zigaretten am Tag)"],
            ["Allergien", "keine bekannt"]
          ],
          anordnungen: [
            ["Medikation", "Metamizol 1 g i. v. als Kurzinfusion 4× täglich · Bedarf: Piritramid 3,75 mg i. v. bei NRS über 4, frühestens nach 4 Stunden wiederholen · Enoxaparin 40 mg s. c. 18 Uhr"],
            ["Infusion", "Vollelektrolyt 1 000 ml über 24 Stunden"],
            ["Überwachung", "pDMS (Puls, Durchblutung, Motorik, Sensibilität) am linken Fuß stündlich in den ersten 24 Stunden"],
            ["Lagerung", "Bein auf Herzhöhe lagern, Kühlung nach Bedarf, Teilbelastung 20 kg ab morgen mit Physiotherapie"]
          ],
          verlauf: [["OP", "Marknagelung ohne Komplikationen, Blutverlust gering"], ["Aufwachraum", "Spinalanästhesie abgeklungen 12:15 Uhr"]]
        },
        verlauf: [{ ab: "13:30", status: "beobachten", v: { rr: "134/80", hf: 92, af: 16, spo2: 98, t: 37.5, bw: "A" } }]
      },
      yildiz: {
        quelle: { typ: "neu" }, name: "Mehmet Yıldız", kurz: "Herr Yıldız", alter: 52, geschlecht: "m",
        diagnose: "Bimalleoläre Sprunggelenksfraktur rechts, OP morgen früh geplant; Diabetes Typ 2",
        av: { hair: "TI", hairC: "#1d1d22", skin: "#d9a07a", cloth: "#475569", deco: "collar", bg: "#e6edf5", beard: 1, beardC: "#2b2b33" },
        flags: ["diabetes", "schmerz"], zflags: ["med", "mobil"],
        uebergabe: "Sprunggelenk rechts gebrochen, liegt in einer Unterschenkelschiene. OP morgen 07:30 Uhr, wenn die Schwellung es zulässt. Spricht gut Deutsch, bei schwierigen Themen hätte er gern seine Tochter Elif dabei. Diabetes mit Metformin.",
        akte: {
          stamm: [
            ["Person", "Mehmet Yıldız, 52 Jahre, Busfahrer, verheiratet, Tochter Elif (24) studiert Pharmazie"],
            ["Aufnahmegrund", "Gestern auf einer Treppe umgeknickt, bimalleoläre Sprunggelenksfraktur rechts"],
            ["Vorerkrankungen", "Diabetes Typ 2 (Metformin), Hypertonie (Ramipril)"],
            ["Allergien", "keine bekannt"],
            ["Sprache", "Muttersprache Türkisch, spricht gut Deutsch; Dolmetschdienst des Hauses möglich"]
          ],
          anordnungen: [
            ["Medikation", "Metformin 1 000 mg 1-0-1 (ab heute Abend pausieren wegen OP) · Ramipril 5 mg 1-0-0 · Ibuprofen 400 mg 1-1-1 · Pantoprazol 20 mg 1-0-0 · Enoxaparin 40 mg s. c. 18 Uhr"],
            ["Vorbereitung OP", "OP morgen 07:30 Uhr, ärztliche Aufklärung heute 16:30 Uhr, Narkoseaufklärung erfolgt. Nüchtern: feste Nahrung bis 6 Stunden, klare Flüssigkeit bis 2 Stunden vor Narkosebeginn"],
            ["Lagerung", "Bein hochlagern, Kühlung, Schwellung täglich beurteilen"],
            ["Blutzucker", "vor den Mahlzeiten und um 22 Uhr"]
          ],
          verlauf: [["Gestern", "Reposition in der Notaufnahme, Schiene angelegt"], ["Heute früh", "Schwellung rückläufig, Hautfältelung beginnt"]]
        },
        verlauf: [{ ab: "13:30", status: "stabil", v: { rr: "142/88", hf: 78, af: 14, spo2: 98, t: 36.8, bw: "A", bz: 168 } }]
      },
      schuster: {
        quelle: { typ: "neu" }, name: "Petra Schuster", kurz: "Frau Schuster", alter: 61, geschlecht: "w",
        diagnose: "Knie-Totalendoprothese links, Tag 2; Adipositas, Hypothyreose",
        av: { hair: "EN", hairC: "#7a5233", skin: "#f6d2b3", cloth: "#f2b8c6", bg: "#fde8e8", glasses: 1 },
        flags: ["op", "schmerz"], zflags: ["mobil", "med"],
        uebergabe: "Knie-TEP links, Tag 2. Läuft mit Unterarmgehstützen auf dem Flur. Möchte möglichst bald nach Hause. Motorschiene steht heute Nachmittag noch an, Thrombosespritze um 18 Uhr.",
        akte: {
          stamm: [
            ["Person", "Petra Schuster, 61 Jahre, Grundschullehrerin, verheiratet"],
            ["Operation", "Vorgestern Knie-TEP links (elektiv) bei Gonarthrose"],
            ["Vorerkrankungen", "Adipositas (BMI 34), Hypothyreose (L-Thyroxin)"],
            ["Allergien", "Pflaster (Rötung)"]
          ],
          anordnungen: [
            ["Medikation", "Metamizol 1 g 1-1-1-1 · Ibuprofen 400 mg 1-1-1 · Pantoprazol 20 mg · L-Thyroxin 100 µg nüchtern · Enoxaparin 40 mg s. c. 18 Uhr"],
            ["Motorschiene", "2× täglich 30 Minuten, heute 0 bis 70°"],
            ["Mobilisation", "Vollbelastung mit Unterarmgehstützen, Physiotherapie täglich"],
            ["Wunde", "Verbandwechsel morgen, Klammern am 12. Tag"]
          ],
          verlauf: [["Tag 1", "Redon gezogen, mobil im Zimmer"]]
        },
        verlauf: [{ ab: "13:30", status: "stabil", v: { rr: "136/84", hf: 80, af: 14, spo2: 97, t: 37.1, bw: "A" } }]
      },
      albers: {
        quelle: { typ: "neu" }, name: "Günter Albers", kurz: "Herr Albers", alter: 77, geschlecht: "m",
        diagnose: "Osteoporotische Fraktur des 1. Lendenwirbelkörpers nach Sturz, konservative Therapie; Herzinsuffizienz",
        av: { hair: "WB", hairC: "#9aa3ab", skin: "#f0c7a5", cloth: "#475569", deco: "collar", bg: "#e6edf5", glasses: 1 },
        flags: ["sturz", "schmerz", "mobil"], zflags: ["med", "seh", "herz"],
        uebergabe: "LWK-1-Fraktur, Tag 3, konservativ. Läuft mit Rollator und Drei-Punkt-Orthese. Seit der Aufnahme kein Stuhlgang. Ist abends schon zweimal allein aufgestanden, ohne Orthese.",
        akte: {
          stamm: [
            ["Person", "Günter Albers, 77 Jahre, Rentner (Schreiner), lebt mit seiner Frau im Erdgeschoss"],
            ["Aufnahmegrund", "Beim Aufstehen aus dem Sessel gestürzt, Rückenschmerzen, LWK-1-Fraktur ohne Hinterkantenbeteiligung"],
            ["Vorerkrankungen", "Herzinsuffizienz (NYHA II), benigne Prostatahyperplasie, Osteoporose (neu diagnostiziert)"],
            ["Allergien", "keine bekannt"]
          ],
          anordnungen: [
            ["Medikation", "Tilidin/Naloxon ret. 50/4 mg 1-0-1 · Metamizol 1 g 1-1-1-1 · Macrogol 1 Beutel 1-0-0 · Torasemid 10 mg 1-0-0 · Tamsulosin 0,4 mg 0-0-1"],
            ["Mobilisation", "mit Drei-Punkt-Orthese, im Liegen anlegen, Rollator"],
            ["Prophylaxen", "Sturzprophylaxe, Obstipationsprophylaxe, Gewicht täglich"]
          ],
          verlauf: [["Tag 2", "Schmerz NRS 4 bei Bewegung, mobil mit Rollator über den Flur"]]
        },
        verlauf: [{ ab: "13:30", status: "stabil", v: { rr: "122/74", hf: 72, af: 16, spo2: 96, t: 36.7, bw: "A" } }]
      }
    },

    aufgaben: [
      { id: "lo-redon", pat: "lohmann", t: "Redon-Drainage kontrollieren", kat: "fachlich", ab: "13:30", faellig: "14:00", dauer: 5, punkte: 10, icon: "tube",
        inhalt: { typ: "quiz", multi: true, q: "Du kontrollierst die Redon-Drainage an Frau Lohmanns Hüfte. Was gehört dazu?",
          opts: [
            { t: "Vakuum prüfen: Die Anzeige an der Flasche zeigt, ob noch Sog besteht", ok: true },
            { t: "Menge und Aussehen des Sekrets ablesen und mit der Menge bei Übergabe vergleichen", ok: true },
            { t: "Verlauf des Schlauchs prüfen: nicht abgeknickt, Flasche unter Wundniveau, Klemmen offen", ok: true },
            { t: "Verband auf Durchbluten und die Wundumgebung kontrollieren", ok: true },
            { t: "Die Flasche bei jeder Kontrolle leeren, damit die Menge leichter ablesbar ist", ok: false, fb: "Redonflaschen sind geschlossene Systeme. Öffnen bedeutet Infektionsrisiko und Sogverlust. Gewechselt wird nur bei vollem oder sogfreiem System und aseptisch." },
            { t: "Bei Blut in der Flasche sofort die Ärztin rufen", ok: false, fb: "Am ersten Tag nach Hüft-OP ist blutiges Sekret normal. Entscheidend sind Menge pro Zeit und der Kreislauf der Patientin." }
          ] } },
      { id: "br-pdms", pat: "brandt", t: "pDMS am linken Fuß", kat: "sicherheit", ab: "13:30", faellig: "14:00", dauer: 5, punkte: 12, icon: "eye",
        inhalt: { typ: "quiz", multi: true, q: "Stündliche pDMS-Kontrolle nach Marknagelung. Was prüfst du?",
          opts: [
            { t: "Puls: Fußrückenpuls (A. dorsalis pedis) tasten, mit der Gegenseite vergleichen", ok: true },
            { t: "Durchblutung: Hautfarbe, Temperatur, Rekapillarisierung am Zehennagel unter 2 Sekunden", ok: true },
            { t: "Motorik: Zehen und Fuß aktiv heben und senken lassen", ok: true },
            { t: "Sensibilität: Berührung an Zehen und Fußrücken spürbar, Kribbeln oder Taubheit erfragen", ok: true },
            { t: "Ist der Puls tastbar, ist ein Kompartmentsyndrom ausgeschlossen", ok: false, fb: "Falsch. Der Puls verschwindet erst sehr spät. Frühe Zeichen sind unverhältnismäßiger Schmerz, Schmerz bei passiver Dehnung, pralle Muskulatur und Kribbeln." }
          ] } },
      { id: "br-urin", pat: "brandt", t: "Seit der OP kein Wasser gelassen", kat: "fachlich", ab: "13:45", faellig: "14:30", dauer: 8, punkte: 12, icon: "drop",
        varianten: [{ ab: "14:00", faellig: "14:45" }],
        inhalt: { typ: "quiz", q: "Herr Brandt hat seit über fünf Stunden kein Wasser gelassen. Er sagt, er müsse dringend, aber es gehe nicht. Der Unterbauch ist vorgewölbt. Was tust du?",
          opts: [
            { t: "Blasenvolumen mit dem Ultraschallgerät (Bladderscan) messen, Wasserlassen im Stehen bzw. mit Urinflasche ermöglichen, bei großer Restmenge die Ärztin wegen Einmalkatheter informieren", ok: true, fb: "Richtig. Nach Spinalanästhesie und mit Opioiden kommt ein Harnverhalt häufig vor. Eine überdehnte Blase schadet dem Blasenmuskel." },
            { t: "Ihm viel zu trinken geben, damit es in Gang kommt", ok: false, fb: "Bei einem Harnverhalt füllt sich die Blase dadurch nur weiter. Erst die Blase entlasten." },
            { t: "Abwarten bis zum Nachtdienst, das kommt meistens von selbst", ok: false, fb: "Bei vorgewölbtem Unterbauch und Drang ohne Entleerung musst du jetzt handeln." }
          ] } },
      { id: "sch-cpm", pat: "schuster", t: "Motorschiene anlegen", kat: "fachlich", ab: "14:00", faellig: "15:00", dauer: 8, punkte: 10, icon: "bed",
        inhalt: { typ: "quiz", multi: true, q: "Angeordnet: Motorschiene 30 Minuten, heute 0 bis 70°. Was ist richtig?",
          opts: [
            { t: "Kniegelenk genau über dem Drehpunkt der Schiene ausrichten, Beinlänge einstellen", ok: true },
            { t: "Winkel nach Anordnung einstellen, langsam beginnen", ok: true },
            { t: "Frau Schuster erklären, wie sie die Schiene mit dem Handschalter stoppt", ok: true },
            { t: "Während der Behandlung auf Schmerzen, Wunde und Durchblutung achten", ok: true },
            { t: "Gleich auf 90° stellen, dann ist sie schneller fit", ok: false, fb: "Die Steigerung ist ärztlich bzw. physiotherapeutisch angeordnet. Zu viel Beugung belastet Wunde und Kapsel." }
          ] } },
      { id: "lo-luxation", pat: "lohmann", t: "Mobilisation in den Stuhl", kat: "fachlich", ab: "14:30", faellig: "15:30", dauer: 12, punkte: 12, icon: "bed",
        inhalt: { typ: "quiz", multi: true, q: "Frau Lohmann soll nach dem Mittagsschlaf in den Stuhl. Duokopfprothese mit dorsalem Zugang. Was beachtest du zur Luxationsprophylaxe?",
          opts: [
            { t: "Hüfte nicht über 90° beugen: hoher Stuhl mit Armlehnen, nicht tief einsinken", ok: true },
            { t: "Beine nicht übereinanderschlagen, beim Drehen ein Kissen zwischen die Beine", ok: true },
            { t: "Über die operierte Seite aus dem Bett, Fußspitze nicht nach innen drehen", ok: true },
            { t: "Hilfsmittel bereitstellen: Rollator, rutschfeste Schuhe, Hörgerät und Brille", ok: true },
            { t: "Zum Schuhe-Anziehen soll sie sich weit nach vorne beugen, das trainiert die Hüfte", ok: false, fb: "Tiefes Vorbeugen bedeutet Hüftbeugung über 90° und begünstigt die Luxation. Schuhe mit Schuhlöffel oder Hilfe anziehen." },
            { t: "In den niedrigen Sessel am Fenster setzen, dort ist es gemütlicher", ok: false, fb: "Im tiefen Sessel ist die Hüfte stark gebeugt, Luxationsgefahr. Sitzfläche muss hoch genug sein." }
          ] } },
      { id: "yi-aufkl", pat: "yildiz", t: "Fragen zur OP-Aufklärung", kat: "kommunikation", ab: "14:30", faellig: "16:30", dauer: 8, punkte: 12, icon: "chat",
        inhalt: { typ: "quiz", q: "Herr Yıldız fragt dich: „Können Sie mir schon mal erklären, was morgen genau gemacht wird und was alles schiefgehen kann? Meine Tochter kommt erst später.“ Was antwortest du?",
          opts: [
            { t: "Allgemein erklären, was du weißt (Ablauf auf Station, Nüchternheit), die medizinische Aufklärung aber der Ärztin überlassen, seine Fragen notieren und ihm sagen, dass er um 16:30 Uhr mit Dr. Kaya und seiner Tochter in Ruhe alles besprechen kann. Bei Bedarf den Dolmetschdienst anbieten", ok: true, fb: "Genau. Die Aufklärung über Eingriff und Risiken ist ärztliche Aufgabe (§ 630e BGB). Pflege unterstützt, beantwortet Fragen zum Ablauf und gibt offene Fragen weiter." },
            { t: "Die Risiken selbst erklären, damit er gut vorbereitet ist", ok: false, fb: "Die Risikoaufklärung darf nicht an die Pflege übertragen werden. Unvollständige Aufklärung kann die Einwilligung unwirksam machen." },
            { t: "„Darüber reden Sie besser mit Ihrer Tochter, die ist ja Pharmazeutin.“", ok: false, fb: "Angehörige ersetzen keine ärztliche Aufklärung. Und er hat dich etwas gefragt: Er verdient eine Antwort und einen Weg zu seinen Informationen." }
          ] } },
      { id: "al-orthese", pat: "albers", t: "Mobilisation mit Orthese", kat: "fachlich", ab: "15:00", faellig: "16:00", dauer: 10, punkte: 10, icon: "bed",
        inhalt: { typ: "reihe", q: "Herr Albers möchte auf den Flur. Bring die Schritte in die richtige Reihenfolge.",
          items: [
            "Schmerz erfragen, ggf. Bedarfsmedikation 30 Minuten vorher anbieten",
            "Im Liegen die Drei-Punkt-Orthese anlegen",
            "En bloc auf die Seite drehen und über die Seite an die Bettkante aufsetzen",
            "Kurz sitzen lassen, Kreislauf und Schwindel prüfen, rutschfeste Schuhe anziehen",
            "Mit Rollator aufstehen und begleiten"
          ] } },
      { id: "kr-aufnahme", pat: "krueger", t: "Aufnahme: Marcumar und Nüchternheit", kat: "sicherheit", ab: "15:20", faellig: "15:50", dauer: 12, punkte: 16, icon: "clip", akte: true,
        inhalt: { typ: "quiz", multi: true, q: "Frau Krüger ist da. Schau in die Akte. Was gehört jetzt dazu?",
          opts: [
            { t: "Dr. Kaya auf den INR von 2,8 unter Phenprocoumon hinweisen, weil vor der OP die Gerinnung normalisiert werden muss", ok: true },
            { t: "Nüchtern lassen, Schild am Bett, Infusion nach Anordnung", ok: true },
            { t: "Schmerz mit BESD einschätzen, weil sie Schmerzen wegen der Demenz nicht sicher benennen kann", ok: true },
            { t: "Die Betreuerin (Tochter) informieren bzw. die Ärztin daran erinnern, dass sie in die OP-Einwilligung eingebunden werden muss", ok: true },
            { t: "Marcumar heute Abend wie im Heimplan geben, damit der Rhythmus nicht durcheinanderkommt", ok: false, fb: "Vor einer Operation wird Phenprocoumon pausiert und ggf. ärztlich antagonisiert (Vitamin K, PPSB). Auf keinen Fall weitergeben." },
            { t: "Das Bein gerade ziehen und mit Sandsäcken fixieren, damit die Fraktur ruhig liegt", ok: false, fb: "Nicht am verletzten Bein ziehen. Schmerzarm lagern, wie es für sie erträglich ist, z. B. mit einem Kissen unter dem Knie." }
          ] } },
      { id: "kr-besd", pat: "krueger", t: "Schmerz einschätzen (BESD)", kat: "fachlich", ab: "15:30", faellig: "16:10", dauer: 8, punkte: 12, icon: "pulse",
        inhalt: { typ: "quiz", q: "Frau Krüger stöhnt bei jeder Bewegung, verzieht das Gesicht, hält den linken Oberschenkel fest und lässt sich kaum beruhigen. Sie sagt „Nein, nein“. Wie gehst du vor?",
          opts: [
            { t: "Mit der BESD die fünf Bereiche beobachten (Atmung, Lautäußerung, Gesichtsausdruck, Körpersprache, Trost), Wert dokumentieren, die Ärztin um eine Schmerzanordnung bitten und die Wirkung danach erneut mit BESD prüfen", ok: true, fb: "Richtig. Bei Demenz ist die Fremdeinschätzung mit BESD Standard (DNQP Schmerzmanagement). Die Wiederholung zeigt, ob die Behandlung wirkt." },
            { t: "Nach der NRS fragen: „Wie stark von 0 bis 10?“", ok: false, fb: "Mit mittelgradiger Demenz kann sie eine Zahlenskala meist nicht sicher nutzen. Versuchen schadet nicht, aber du brauchst die Fremdeinschätzung." },
            { t: "Sie ist dement, das Stöhnen gehört zur Unruhe", ok: false, fb: "Schmerzen werden bei Menschen mit Demenz häufig übersehen und als Unruhe fehlgedeutet. Mit einer frischen Fraktur hat sie mit Sicherheit Schmerzen." }
          ] } },
      { id: "yi-bz", pat: "yildiz", t: "Blutzucker vor dem Abendessen", kat: "fachlich", ab: "16:45", faellig: "17:15", dauer: 5, punkte: 10, icon: "drop", akte: true,
        inhalt: { typ: "messen", nur: ["bz"], frage: { q: "BZ 168 mg/dl. Laut Anordnung soll Metformin vor der OP pausiert werden. Was machst du mit der Abenddosis?",
          opts: [
            { t: "Metformin heute Abend nicht geben, wie angeordnet, in der Kurve als pausiert vermerken und ihm den Grund erklären. BZ heute 22 Uhr und morgen früh weiter messen", ok: true, fb: "Richtig. Metformin wird vor Operationen mit Narkose meist pausiert. Ohne Tablette steigt der BZ etwas, deshalb weiter kontrollieren." },
            { t: "Metformin geben, der BZ ist ja zu hoch", ok: false, fb: "Die Anordnung lautet: pausieren. Ein BZ von 168 mg/dl ist kein Notfall." },
            { t: "Statt Metformin 6 IE Insulin spritzen", ok: false, fb: "Insulin nur nach ärztlicher Anordnung. Ohne Schema keine Gabe." }
          ] } } },
      { id: "yi-opvorb", pat: "yildiz", t: "OP-Vorbereitung für morgen", kat: "organisation", ab: "17:00", faellig: "17:50", dauer: 10, punkte: 12, icon: "clip",
        inhalt: { typ: "quiz", multi: true, q: "Was gehört heute Abend zur OP-Vorbereitung von Herrn Yıldız?",
          opts: [
            { t: "Erklären: feste Nahrung bis 6 Stunden, klare Flüssigkeit wie Wasser oder Tee ohne Milch bis 2 Stunden vor der Narkose", ok: true },
            { t: "Prüfen, ob ärztliche und Narkoseaufklärung unterschrieben in der Akte liegen", ok: true },
            { t: "Ihn bitten, Schmuck, Ehering und ggf. Zahnersatz morgen früh abzulegen", ok: true },
            { t: "Prüfen, ob die OP-Seite ärztlich markiert ist", ok: true },
            { t: "Am Vorabend die Haut am Unterschenkel mit einem Einmalrasierer rasieren", ok: false, fb: "Rasieren verursacht kleine Hautverletzungen und erhöht das Wundinfektionsrisiko. Wenn Haare entfernt werden müssen, dann mit dem Clipper kurz vor der OP." },
            { t: "„Ab Mitternacht dürfen Sie gar nichts mehr trinken, auch kein Wasser.“", ok: false, fb: "Veraltet. Klare Flüssigkeit ist bis 2 Stunden vor der Narkose erlaubt und tut dem Kreislauf gut." }
          ] } },
      { id: "sch-enox", pat: "schuster", t: "Thromboseprophylaxe 18 Uhr", kat: "sicherheit", ab: "17:20", faellig: "18:00", dauer: 6, punkte: 12, icon: "pill",
        inhalt: { typ: "zahl", q: "Angeordnet sind 40 mg Enoxaparin s. c. Auf Station gibt es heute nur Fertigspritzen mit 60 mg in 0,6 ml. Wie viel ml verabreichst du? (Den Rest verwirfst du vorher.)", wert: 0.4, tol: 0.01, einheit: "ml",
          erkl: "60 mg in 0,6 ml ergibt 100 mg je ml. 40 mg sind 0,4 ml. Vorher den Überschuss verwerfen und die Dosis mit einer zweiten Person prüfen. Die Luftblase in Fertigspritzen nicht entfernen." } },
      { id: "nacht-uebergabe", pat: null, zimmer: "301", t: "Übergabe an den Nachtdienst", kat: "doku", ab: "17:30", faellig: "18:00", dauer: 8, punkte: 10, icon: "doc",
        inhalt: { typ: "quiz", multi: true, q: "Was gehört in eine gute Übergabe an den Nachtdienst?",
          opts: [
            { t: "Je Person: aktueller Zustand, Veränderungen in der Schicht, offene Aufgaben (z. B. pDMS stündlich, BZ 22 Uhr)", ok: true },
            { t: "Wer nüchtern ist und ab wann, wer morgen in den OP geht", ok: true },
            { t: "Kritische Ereignisse und was daraufhin angeordnet wurde", ok: true },
            { t: "Wenn möglich am Bett und gemeinsam mit der Person übergeben", ok: true },
            { t: "Persönliche Einschätzungen wie „Die ist schwierig“", ok: false, fb: "Wertungen gehören nicht in die Übergabe. Beschreibe beobachtbares Verhalten: „lehnt die Mobilisation ab, wirkt ängstlich“." }
          ] } }
    ],

    ereignisse: [
      { id: "uebergabe", um: "13:30", art: "info", titel: "Schichtbeginn", text: "Übergabe vom Frühdienst ist gelaufen. Jonas Petersen: „Ich muss gleich mit einer Patientin in den OP. Herr Brandt hat noch nicht gepinkelt, und um 15:20 Uhr kommt eine Neuaufnahme.“" },
      { id: "physio", um: "14:10", art: "info", pat: "schuster", titel: "Physiotherapie", text: "Die Physiotherapeutin war bei Frau Schuster: Treppensteigen klappt. Sie bittet, die Motorschiene nicht direkt nach der Physio anzulegen, sondern eine halbe Stunde Pause zu lassen.", wichtig: 1, chance: 0.8 },
      { id: "roentgen", um: "14:40", art: "telefon", pat: "brandt", titel: "Röntgen ruft an", text: "Röntgen: Herr Brandt soll um 15 Uhr zur Kontrollaufnahme, Transport im Bett. Der Hol- und Bringdienst kommt in 20 Minuten.", wichtig: 1, chance: 0.7,
        varianten: [{ um: "16:20", text: "Röntgen: Die Kontrollaufnahme von Herrn Brandts Unterschenkel ist heute erst um 16:40 Uhr möglich. Der Hol- und Bringdienst kommt." }] },
      { id: "kr-kommt", um: "15:20", art: "aufnahme", pat: "krueger", titel: "Neuaufnahme Zimmer 301", text: "Frau Krüger kommt aus der Notaufnahme in Bett 301 B. Begleitet wird sie von einer Pflegekraft aus dem Heim, die den Überleitungsbogen und die Medikamentenliste mitbringt.", wichtig: 2 },
      { id: "kr-tochter", um: "16:00", art: "telefon", pat: "krueger", titel: "Anruf der Betreuerin", text: "Sabine Krüger, die Tochter und gesetzliche Betreuerin, ruft an. Sie ist auf dem Weg und möchte mit der Ärztin über die OP sprechen. Sie ist berechtigt, Auskunft zu bekommen. Du verbindest sie mit Dr. Kaya.", wichtig: 1, chance: 0.75 },
      { id: "yi-tochter", um: "16:25", art: "info", pat: "yildiz", titel: "Besuch für Herrn Yıldız", text: "Elif Yıldız ist da. Dr. Kaya kommt gleich zur Aufklärung.", wichtig: 1 },
      { id: "essen", um: "17:00", art: "info", titel: "Abendessen", text: "Der Essenwagen ist da. Frau Krüger bleibt nüchtern, Herr Yıldız darf heute Abend noch normal essen.", wichtig: 1 },
      { id: "al-allein", um: "17:15", art: "alarm", pat: "albers", wenn: { nichtErledigt: "al-orthese" }, titel: "Herr Albers steht allein auf", text: "Herr Albers steht ohne Orthese und ohne Rollator am Waschbecken und hält sich am Rand fest. Er wollte sich „nur kurz frisch machen“.", wichtig: 2, malus: { kat: "organisation", pts: 4, t: "Herr Albers wurde nicht mobilisiert und ist allein ohne Orthese aufgestanden." } }
    ],

    zufall: [
      { id: "raucher", braucht: ["op"], art: "info", titel: "{anrede} will rauchen", text: "{anrede} sitzt im Rollstuhl am Aufzug: „Ich geh nur kurz eine rauchen, bin gleich zurück.“", wichtig: 1,
        aufgabe: { t: "Rauchen nach der OP ansprechen", kat: "kommunikation", dauer: 5, punkte: 8, icon: "chat",
          inhalt: { typ: "quiz", q: "Was ist eine gute Reaktion?",
            opts: [
              { t: "Verständnis zeigen, über das erhöhte Risiko für Wundheilungsstörung und Thrombose informieren, auf Nikotinersatz hinweisen (Ärztin fragen) und vereinbaren, dass er sich auf Station abmeldet", ok: true, fb: "Gut. Du kannst nicht verbieten, aber informieren, Alternativen anbieten und die Sicherheit regeln (Abmelden, Begleitung, Infusion)." },
              { t: "„Rauchen ist im Krankenhaus verboten, Sie bleiben hier.“", ok: false, fb: "Er ist einwilligungsfähig und darf die Station verlassen. Verbote ohne Erklärung führen eher zum heimlichen Weggehen." },
              { t: "Ihn einfach fahren lassen und nichts dokumentieren", ok: false, fb: "Wenn er die Station verlässt, muss das Team wissen, wo er ist, gerade frisch operiert und mit Infusion." }
            ] } } },
      { id: "kuehlung", braucht: ["op"], art: "klingel", titel: "Klingel Zimmer {zimmer}", text: "{anrede}: „Das Kühlpack ist ganz warm. Kann ich ein neues haben? Und kann ich es direkt auf die Haut legen, dann kühlt es besser?“", wichtig: 1,
        aufgabe: { t: "Kühlung erneuern", kat: "fachlich", dauer: 4, punkte: 6, icon: "drop",
          inhalt: { typ: "quiz", q: "Wie kühlst du richtig?",
            opts: [
              { t: "Kühlpack immer in ein Tuch einschlagen, nicht direkt auf die Haut, 15 bis 20 Minuten, Pausen machen und die Haut kontrollieren", ok: true, fb: "Richtig. Direkter Kontakt kann Kälteschäden verursachen, besonders bei verminderter Sensibilität." },
              { t: "Direkt auf die Haut, solange es angenehm ist", ok: false, fb: "Kühlpacks aus dem Gefrierfach können Erfrierungen verursachen." },
              { t: "Eis aus dem Gefrierfach in einen Handschuh füllen", ok: false, fb: "Nicht hygienisch und zu kalt. Nur zugelassene Kühlelemente mit Schutzbezug." }
            ] } } }
    ],

    dramen: [
      /* ---------- Nachblutung bei Frau Lohmann ---------- */
      { id: "nachblutung", titel: "Nachblutung nach Hüft-OP", gewicht: 2, schliesstAus: ["delir"],
        patienten: { lohmann: { verlauf: [
          { ab: "13:30", status: "beobachten", v: { rr: "128/72", hf: "86 arrhythmisch", af: 16, spo2: 95, t: 37.3, bw: "A" } },
          { ab: "15:05", status: "beobachten", v: { rr: "108/64", hf: "104 arrhythmisch", af: 20, spo2: 94, t: 37.1, bw: "A" }, hinweis: "blass, schwindelig, Redon seit Mittag deutlich mehr" },
          { ab: "16:10", wenn: { nichtFlag: "lo-arzt" }, status: "kritisch", v: { rr: "90/54", hf: "122 arrhythmisch", af: 24, spo2: 93, t: 36.8, bw: "C" }, hinweis: "kaltschweißig, unruhig, Redon voll" },
          { flag: "lo-volumen", nach: 30, status: "beobachten", v: { rr: "114/68", hf: "98 arrhythmisch", af: 18, spo2: 96, t: 36.9, bw: "A" }, hinweis: "wacher, Transfusion läuft ohne Reaktion" }
        ] } },
        ereignisse: [
          { id: "lo-klingel", um: "15:05", art: "klingel", pat: "lohmann", setzt: ["lo-auffaellig"], titel: "Klingel Zimmer 301", text: "Frau Lohmann: „Mir ist so schwindelig, und mir ist kalt.“ Die Redonflasche ist deutlich voller als bei der Übergabe.", wichtig: 3,
            varianten: [{ titel: "Hinweis der Physiotherapie", art: "info", text: "Die Physiotherapeutin hat die Mobilisation von Frau Lohmann abgebrochen: Beim Aufsetzen wurde ihr schwarz vor Augen. Die Redonflasche ist auffällig voll." }] },
          { id: "lo-labor", um: "15:35", art: "labor", pat: "lohmann", titel: "Labor: Frau Lohmann", text: "Hb 8,3 g/dl (heute früh 10,2 g/dl). Das Labor bittet um ärztliche Kenntnisnahme.", wichtig: 2 },
          { id: "lo-spaet", um: "16:10", art: "alarm", pat: "lohmann", wenn: { nichtFlag: "lo-arzt" }, setzt: ["lo-auffaellig"], titel: "Frau Lohmann kaltschweißig", text: "Frau Lohmann ist kaltschweißig und unruhig, RR 90/54, Puls 122. Jonas Petersen ruft sofort die Ärztin.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 12, t: "Die Nachblutung bei Frau Lohmann wurde erst im Kreislaufversagen ärztlich gemeldet." } },
          { id: "lo-anordnung", wenn: { flag: "lo-arzt" }, art: "telefon", pat: "lohmann", titel: "Ärztliche Anordnung", text: "Dr. Kaya: „Ich komme. 500 ml Vollelektrolyt jetzt, Blutgruppe und Kreuzblut ab, zwei Erythrozytenkonzentrate bestellen, Vitalzeichen alle 15 Minuten, Redonmenge stündlich.“ Du wiederholst die Anordnung.", wichtig: 2 }
        ],
        aufgaben: [
          { id: "lo-vit", pat: "lohmann", t: "Vitalzeichen bei Schwindel", kat: "sicherheit", faelligNach: { flag: "lo-auffaellig", min: 10 }, dauer: 5, punkte: 12, icon: "pulse", fall: true, wenn: { flag: "lo-auffaellig" },
            inhalt: { typ: "messen", frage: { q: "Vergleiche mit den Werten bei Schichtbeginn (RR 128/72, Puls 86). Wie schätzt du die Lage ein?",
              opts: [
                { t: "Blutdruck fällt, Puls steigt, dazu mehr Drainagesekret: Verdacht auf Nachblutung, die Ärztin jetzt informieren", ok: true, fb: "Richtig. Der Schockindex (Puls geteilt durch systolischen Blutdruck) liegt schon nahe 1. Das ist ein Warnzeichen." },
                { t: "Sie ist alt und war heute schon viel unterwegs, erst einmal hinlegen und in einer Stunde nachmessen", ok: false, fb: "Bei steigendem Puls, sinkendem Druck und mehr Sekret wartest du nicht. Eine Stunde ist zu lang." },
                { t: "Den Sog der Redon abklemmen, damit sie nicht weiter blutet", ok: false, fb: "Abklemmen ohne Anordnung verdeckt nur die Blutung (Hämatom im Gewebe). Das entscheidet die Ärztin." }
              ] } } },
          { id: "lo-sbar", pat: "lohmann", t: "Dr. Kaya anrufen (SBAR)", kat: "kommunikation", faelligNach: { flag: "lo-auffaellig", min: 15 }, dauer: 5, punkte: 14, icon: "phone", fall: true, wenn: { flag: "lo-auffaellig" }, setzt: ["lo-arzt"], link: { tab: "sims", id: "sbar", t: "Simulation SBAR-Arztruf" },
            inhalt: { typ: "reihe", q: "Bring deinen Anruf in die SBAR-Reihenfolge.",
              items: [
                "S: „Station 3A, Zimmer 301. Ich rufe wegen Frau Lohmann an, 84 Jahre, Tag 1 nach Duokopf rechts. Ich habe den Verdacht auf eine Nachblutung.“",
                "B: „Sie hat Vorhofflimmern, Apixaban ist pausiert, sie bekommt Enoxaparin. Hb heute früh 10,2.“",
                "A: „Jetzt RR 108/64, Puls 104, schwindelig, blass. Die Redon hat seit Mittag deutlich mehr gefördert.“",
                "R: „Bitte kommen Sie zur Beurteilung. Soll ich Blut für Blutbild und Kreuzprobe vorbereiten und eine Infusion anhängen?“"
              ] } },
          { id: "lo-ek", pat: "lohmann", t: "Transfusion vorbereiten", kat: "sicherheit", faelligNach: { flag: "lo-arzt", min: 40 }, dauer: 10, punkte: 14, icon: "drip", fall: true, wenn: { flag: "lo-arzt" }, setzt: ["lo-volumen"],
            inhalt: { typ: "quiz", multi: true, q: "Die Erythrozytenkonzentrate sind da. Was ist richtig?",
              opts: [
                { t: "Den Bedside-Test führt die Ärztin unmittelbar am Bett durch und dokumentiert ihn", ok: true },
                { t: "Identität der Patientin mit Konserve und Begleitschein vergleichen (Name, Geburtsdatum, Blutgruppe, Konservennummer, Verfallsdatum)", ok: true },
                { t: "Vitalzeichen vor Beginn messen und die Patientin in den ersten 15 Minuten engmaschig beobachten", ok: true },
                { t: "Bei Fieber, Schüttelfrost, Atemnot oder Rückenschmerzen die Transfusion sofort stoppen und die Ärztin rufen", ok: true },
                { t: "Die Konserve zum Anwärmen kurz in die Mikrowelle legen", ok: false, fb: "Niemals. Erwärmen nur mit zugelassenen Wärmegeräten, wenn es angeordnet ist." },
                { t: "Über denselben Zugang gleichzeitig eine Glukoselösung laufen lassen", ok: false, fb: "Blutprodukte nicht mit Glukose oder Medikamenten mischen, Glukose kann zur Hämolyse führen." }
              ] } }
        ] },

      /* ---------- Kompartmentsyndrom bei Herrn Brandt ---------- */
      { id: "kompartment", titel: "Kompartmentsyndrom am Unterschenkel", gewicht: 2,
        patienten: { brandt: { verlauf: [
          { ab: "13:30", status: "beobachten", v: { rr: "134/80", hf: 92, af: 16, spo2: 98, t: 37.5, bw: "A" } },
          { ab: "15:40", status: "beobachten", v: { rr: "146/88", hf: 108, af: 20, spo2: 98, t: 37.6, bw: "A" }, hinweis: "Schmerz NRS 8 trotz Piritramid, Unterschenkel prall gespannt" },
          { ab: "16:35", wenn: { nichtFlag: "kb-arzt" }, status: "kritisch", v: { rr: "152/90", hf: 116, af: 22, spo2: 98, t: 37.6, bw: "A" }, hinweis: "Zehen kühl, Kribbeln am Fußrücken, kann die Zehen kaum anheben" },
          { flag: "kb-op", nach: 20, status: "beobachten", v: { rr: "128/76", hf: 94, af: 16, spo2: 98, t: 37.4, bw: "A" }, hinweis: "auf dem Weg in den OP zur Fasziotomie" }
        ] } },
        ereignisse: [
          { id: "kb-schmerz", um: "15:40", art: "klingel", pat: "brandt", setzt: ["kb-auffaellig"], titel: "Klingel Zimmer 302", text: "Herr Brandt: „Das wird immer schlimmer, obwohl ich vorhin was bekommen habe. Das Bein fühlt sich an, als würde es platzen.“", wichtig: 3,
            varianten: [{ text: "Herr Brandt schwitzt und atmet schnell: „Wenn ich die Zehen bewege, zieht es furchtbar in der Wade. Das ist anders als heute Mittag.“" }] },
          { id: "kb-spaet", um: "16:35", art: "alarm", pat: "brandt", wenn: { nichtFlag: "kb-arzt" }, titel: "Taubheit im Fuß", text: "Herr Brandt spürt seine Zehen kaum noch. Jonas Petersen alarmiert Dr. Kaya. Beim Kompartmentsyndrom zählt jede Minute für Muskeln und Nerven.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 12, t: "Die Warnzeichen eines Kompartmentsyndroms wurden nicht rechtzeitig gemeldet." } },
          { id: "kb-anordnung", wenn: { flag: "kb-arzt" }, art: "telefon", pat: "brandt", titel: "Dr. Kaya entscheidet", text: "Dr. Kaya hat Herrn Brandt untersucht und den Druck in der Muskelloge gemessen: deutlich erhöht. „Wir machen jetzt eine Fasziotomie. Er bleibt nüchtern, bitte für den OP vorbereiten, die Anästhesie ist informiert.“", wichtig: 2 }
        ],
        aufgaben: [
          { id: "kb-check", pat: "brandt", t: "Warnzeichen erkennen", kat: "fachlich", faelligNach: { flag: "kb-auffaellig", min: 10 }, dauer: 5, punkte: 12, icon: "eye", fall: true, wenn: { flag: "kb-auffaellig" },
            inhalt: { typ: "quiz", multi: true, q: "Welche Befunde sprechen für ein beginnendes Kompartmentsyndrom?",
              opts: [
                { t: "Schmerz, der trotz Schmerzmittel stärker wird und nicht zur Verletzung passt", ok: true },
                { t: "Starker Schmerz in der Wade, wenn du die Zehen passiv streckst", ok: true },
                { t: "Prall gespannte, harte Muskulatur", ok: true },
                { t: "Kribbeln oder Taubheit am Fußrücken", ok: true },
                { t: "Ein kräftig tastbarer Fußpuls schließt es aus", ok: false, fb: "Der Puls bleibt lange tastbar. Pulslosigkeit ist ein Spätzeichen." },
                { t: "Rötung und Überwärmung an der Narbe", ok: false, fb: "Das passt eher zu einer Wundinfektion, die sich meist erst nach Tagen zeigt." }
              ] } },
          { id: "kb-sbar", pat: "brandt", t: "Dr. Kaya anrufen (SBAR)", kat: "kommunikation", faelligNach: { flag: "kb-auffaellig", min: 15 }, dauer: 5, punkte: 14, icon: "phone", fall: true, wenn: { flag: "kb-auffaellig" }, setzt: ["kb-arzt"],
            inhalt: { typ: "reihe", q: "Bring deinen Anruf in die SBAR-Reihenfolge.",
              items: [
                "S: „Station 3A, Zimmer 302, Herr Brandt, 34 Jahre, heute Marknagel links. Ich habe den Verdacht auf ein Kompartmentsyndrom.“",
                "B: „Unterschenkelschaftfraktur nach Motorradunfall, OP heute um 9 Uhr, Piritramid zuletzt um 12 Uhr.“",
                "A: „Schmerz NRS 8 trotz Analgetika, Schmerz bei passiver Dehnung der Zehen, Wade prall, Puls tastbar, HF 108.“",
                "R: „Bitte kommen Sie sofort. Ich lasse ihn nüchtern und lege das Bein auf Herzhöhe.“"
              ] } },
          { id: "kb-lagerung", pat: "brandt", t: "Bein richtig lagern", kat: "sicherheit", faelligNach: { flag: "kb-auffaellig", min: 20 }, dauer: 4, punkte: 10, icon: "bed", fall: true, wenn: { flag: "kb-auffaellig" },
            inhalt: { typ: "quiz", q: "Was machst du mit dem Bein, bis Dr. Kaya kommt?",
              opts: [
                { t: "Auf Herzhöhe lagern, zirkuläre Verbände lockern bzw. öffnen, nicht mehr kühlen, nüchtern lassen", ok: true, fb: "Richtig. Hochlagern senkt den Durchblutungsdruck im Muskel weiter, Kühlung verengt die Gefäße. Einengende Verbände verschlimmern den Druck." },
                { t: "Noch höher lagern und kräftig kühlen, damit die Schwellung zurückgeht", ok: false, fb: "Beim Kompartmentsyndrom verschlechtert starke Hochlagerung die Durchblutung des Muskels." },
                { t: "Den Verband fester wickeln, damit sich nicht mehr Flüssigkeit sammelt", ok: false, fb: "Kompression erhöht den Logendruck zusätzlich. Gefährlich." }
              ] } },
          { id: "kb-opvorb", pat: "brandt", t: "Notfall-OP vorbereiten", kat: "organisation", faelligNach: { flag: "kb-arzt", min: 25 }, dauer: 8, punkte: 10, icon: "clip", fall: true, wenn: { flag: "kb-arzt" }, setzt: ["kb-op"],
            inhalt: { typ: "quiz", multi: true, q: "Herr Brandt geht gleich in den OP. Was erledigst du?",
              opts: [
                { t: "Letzte Nahrungs- und Flüssigkeitsaufnahme erfragen und dokumentieren", ok: true },
                { t: "Aktuelle Vitalzeichen, pDMS und Schmerzwert dokumentieren", ok: true },
                { t: "Patientenarmband prüfen, Schmuck ablegen lassen, OP-Hemd", ok: true },
                { t: "Seine Partnerin informieren, wenn er das möchte", ok: true },
                { t: "Vor dem Transport noch schnell duschen lassen", ok: false, fb: "Das kostet Zeit, die der Muskel nicht hat." }
              ] } }
        ] },

      /* ---------- Postoperatives Delir bei Frau Lohmann ---------- */
      { id: "delir", titel: "Postoperatives Delir", gewicht: 1, schliesstAus: ["nachblutung"],
        patienten: { lohmann: { verlauf: [
          { ab: "13:30", status: "beobachten", v: { rr: "128/72", hf: "86 arrhythmisch", af: 16, spo2: 95, t: 37.3, bw: "A" } },
          { ab: "16:05", status: "beobachten", v: { rr: "146/84", hf: "98 arrhythmisch", af: 18, spo2: 94, t: 37.2, bw: "C" }, hinweis: "neu verwirrt, nestelt an der Drainage, will nach Hause" }
        ] } },
        ereignisse: [
          { id: "dl-unruhe", um: "16:05", art: "klingel", pat: "lohmann", setzt: ["dl-auffaellig"], titel: "Unruhe in Zimmer 301", text: "Frau Lohmann sitzt auf der Bettkante, zieht am Schlauch der Redon und sagt: „Ich muss nach Hause, mein Mann wartet mit dem Essen.“ Ihr Mann ist vor sechs Jahren gestorben.", wichtig: 3,
            varianten: [{ text: "Frau Lohmann ruft laut nach ihrem Mann, hat sich das Nachthemd ausgezogen und erkennt dich nicht. Heute früh war sie noch orientiert." }] },
          { id: "dl-spaet", um: "17:05", art: "alarm", pat: "lohmann", wenn: { nichtErledigt: "dl-massnahmen" }, titel: "Redon gezogen", text: "Frau Lohmann hat sich die Redon-Drainage herausgezogen und ist aufgestanden. Jonas Petersen kann einen Sturz gerade noch verhindern.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 10, t: "Auf das Delir von Frau Lohmann wurde nicht rechtzeitig reagiert." } }
        ],
        aufgaben: [
          { id: "dl-screen", pat: "lohmann", t: "Delir einschätzen", kat: "fachlich", faelligNach: { flag: "dl-auffaellig", min: 10 }, dauer: 6, punkte: 12, icon: "eye", fall: true, wenn: { flag: "dl-auffaellig" }, link: { tab: "sims", id: "delir", t: "Simulation Delir-Erkennung" },
            inhalt: { typ: "quiz", q: "Heute früh war Frau Lohmann orientiert, jetzt ist sie plötzlich verwirrt und unruhig. Was ist richtig?",
              opts: [
                { t: "Akuter Beginn, schwankender Verlauf und Aufmerksamkeitsstörung sprechen für ein Delir. Mit einem Screening (z. B. 4AT oder CAM) einschätzen und die Ärztin informieren, weil ein Delir auf Komplikationen hinweisen kann (Schmerz, Infekt, Blutverlust, Sauerstoffmangel, Harnverhalt)", ok: true, fb: "Richtig. Ein Delir ist ein Notfall, kein Charakterzug des Alters. Nach Hüftfraktur betrifft es viele ältere Menschen." },
                { t: "Das ist ihre beginnende Demenz, das war nachts ja auch schon so", ok: false, fb: "Eine Demenz entwickelt sich langsam. Ein plötzlicher Wechsel innerhalb von Stunden spricht für ein Delir." },
                { t: "Abwarten, bis sie sich von allein beruhigt", ok: false, fb: "Ein unbehandeltes Delir erhöht das Risiko für Stürze, Komplikationen und bleibende Einschränkungen." }
              ] } },
          { id: "dl-massnahmen", pat: "lohmann", t: "Delir: Orientierung und Sicherheit", kat: "sicherheit", faelligNach: { flag: "dl-auffaellig", min: 20 }, dauer: 10, punkte: 14, icon: "chat", fall: true, wenn: { flag: "dl-auffaellig" },
            inhalt: { typ: "quiz", multi: true, q: "Welche Maßnahmen helfen Frau Lohmann jetzt?",
              opts: [
                { t: "Ruhig ansprechen, sich vorstellen, Ort und Uhrzeit einflechten, nicht widersprechen oder diskutieren", ok: true },
                { t: "Hörgerät einsetzen und Brille aufsetzen", ok: true },
                { t: "Sohn Thomas anrufen, ob er kommen kann, vertraute Gegenstände ins Zimmer", ok: true },
                { t: "Schmerz, Blasenfüllung und Stuhlgang prüfen", ok: true },
                { t: "Bettgitter hoch und Handgelenke fixieren, damit sie die Drainage nicht zieht", ok: false, fb: "Fixierung ist eine freiheitsentziehende Maßnahme mit richterlicher Genehmigung bzw. nur im akuten Notstand. Sie verschlimmert ein Delir und erhöht die Verletzungsgefahr." },
                { t: "Ihr aus dem Bedarf ein Beruhigungsmittel geben, das hilft am schnellsten", ok: false, fb: "Ohne Anordnung keine Gabe. Medikamente sind beim Delir zweite Wahl, zuerst Ursachen suchen und nichtmedikamentös handeln." }
              ] } }
        ] }
    ]
  });

  /* =====================================================================
     2. STATIONÄRE LANGZEITPFLEGE · WOHNBEREICH 2 · FRÜHDIENST
     ===================================================================== */
  D.szenarien.push({
    id: "lindenhof-wb2-frueh",
    titel: "Frühdienst im Pflegeheim",
    station: "Seniorenzentrum Lindenhof · Wohnbereich 2",
    schicht: "Frühdienst",
    start: "06:00", ende: "10:30",
    setting: "langzeit", stuetzpunkt: "Aylin Demir",
    kurz: "Sechs Bewohnerinnen und Bewohner, ein Einzug zur Kurzzeitpflege und eine Hausärztin, die nur telefonisch erreichbar ist. Hier zählen Beobachtung, Zeit für den Menschen und gute Absprachen.",
    rolle: "Du bist im Pflichteinsatz stationäre Langzeitpflege und arbeitest mit Pflegefachfrau Aylin Demir im Wohnbereich 2, Zimmer 21 bis 26. Eine Pflegehelferin übernimmt das Frühstück im Speiseraum. Hausärztin Dr. Brandes ist telefonisch erreichbar und kommt um 09:30 Uhr zur Visite.",
    variation: { streu: 8, dramen: [1, 2], zufall: [2, 3] },
    zimmer: [
      { nr: "21", betten: ["sommer", null] },
      { nr: "22", betten: ["voss", null] },
      { nr: "23", betten: ["ilic", null] },
      { nr: "24", betten: ["kuehn", null] },
      { nr: "25", betten: ["lindner", null] },
      { nr: "26", betten: ["becker", null] }
    ],
    patienten: {
      sommer: {
        quelle: { typ: "neu" }, name: "Elfriede Sommer", kurz: "Frau Sommer", alter: 91, geschlecht: "w",
        diagnose: "Alzheimer-Demenz (mittelgradig), Schluckstörung, Pflegegrad 4",
        av: { hair: "UF", hairC: "#e6e7ea", skin: "#f6d2b3", cloth: "#f2b8c6", bg: "#fde8e8", wrinkles: 1 },
        flags: ["demenz", "sturz"], zflags: ["seh", "mobil"],
        uebergabe: "Hat nachts wenig geschlafen, war zweimal auf dem Flur unterwegs. Getränke leicht angedickt, sitzt beim Essen aufrecht. Erzählt gern von ihrem Garten.",
        akte: {
          stamm: [
            ["Person", "Elfriede Sommer, 91 Jahre, früher Gärtnerin, seit vier Jahren im Lindenhof. Sohn Peter ist Bevollmächtigter"],
            ["Diagnosen", "Alzheimer-Demenz (mittelgradig), Schluckstörung (Dysphagie), Arthrose"],
            ["Biografie", "steht seit jeher um 6 Uhr auf, liebt Kaffee mit Milch, mag keine Haferflocken, beruhigt sich bei Volksliedern"],
            ["Allergien", "keine bekannt"],
            ["Kommunikation", "kurze, klare Sätze, Blickkontakt, nicht von hinten ansprechen"]
          ],
          anordnungen: [
            ["Ernährung", "Kost weich, Getränke leicht angedickt nach logopädischer Empfehlung, aufrecht sitzend essen, 30 Minuten danach aufrecht bleiben"],
            ["Medikation", "Memantin 10 mg 1-0-0 · Calcium/Vitamin D 1-0-0 · Metamizol 500 mg bei Bedarf"],
            ["Prophylaxen", "Sturzprophylaxe, Trinkprotokoll (Ziel 1 300 ml)"]
          ],
          verlauf: [["Gestern", "Trinkmenge 900 ml, isst gut mit Begleitung"]]
        },
        verlauf: [{ ab: "06:00", status: "stabil", v: { rr: "118/70", hf: 80, af: 16, spo2: 95, t: 36.8 } }]
      },
      voss: {
        quelle: { typ: "neu" }, name: "Heinrich Voss", kurz: "Herr Voss", alter: 86, geschlecht: "m",
        diagnose: "Morbus Parkinson seit zwölf Jahren, orthostatische Hypotonie, Vorhofflimmern unter Apixaban",
        av: { hair: "HS", hairC: "#c9c4be", skin: "#f0c7a5", cloth: "#475569", deco: "collar", bg: "#e6edf5", glasses: 1, wrinkles: 1 },
        flags: ["sturz", "med"], zflags: ["mobil"],
        uebergabe: "Parkinson-Medikamente sind zeitkritisch, erste Gabe um 06:30 Uhr. Morgens sehr steif und langsam, nach den Tabletten deutlich beweglicher. Beim Aufstehen schwindelig.",
        akte: {
          stamm: [
            ["Person", "Heinrich Voss, 86 Jahre, früher Lehrer für Mathematik, seit zwei Jahren im Lindenhof. Frau verstorben, Neffe kommt sonntags"],
            ["Diagnosen", "Morbus Parkinson, orthostatische Hypotonie, Vorhofflimmern, Prostatahyperplasie"],
            ["Allergien", "keine bekannt"],
            ["Mobilität", "Rollator, „Freezing“ an Türschwellen, rhythmisches Zählen hilft"]
          ],
          anordnungen: [
            ["Medikation", "Levodopa/Benserazid 100/25 mg 06:30 · 10:30 · 14:30 · 18:30 Uhr, jeweils 30 Minuten vor dem Essen · Apixaban 5 mg 1-0-1 · Midodrin 2,5 mg 1-1-0 · Movicol 1 Beutel"],
            ["Prophylaxen", "Sturzprophylaxe, Blutdruck im Liegen und Stehen 1× wöchentlich"]
          ],
          verlauf: [["Letzte Woche", "RR im Liegen 142/80, im Stehen 108/66 mit Schwindel"]]
        },
        verlauf: [{ ab: "06:00", status: "stabil", v: { rr: "138/82", hf: "76 arrhythmisch", af: 16, spo2: 96, t: 36.6, bw: "A" } }]
      },
      ilic: {
        quelle: { typ: "neu" }, name: "Margarete Ilić", kurz: "Frau Ilić", alter: 79, geschlecht: "w",
        diagnose: "Diabetes Typ 2 mit Insulin, diabetische Polyneuropathie, Zustand nach Amputation der 2. Zehe rechts",
        av: { hair: "CB", hairC: "#a8743f", skin: "#f6d2b3", cloth: "#0ea5e9", bg: "#e0f2fe", glasses: 1 },
        flags: ["diabetes", "wunde"], zflags: ["med", "seh"],
        uebergabe: "BZ vor dem Frühstück, Mischinsulin nach Plan. Spürt an den Füßen wenig. Selbstständig, braucht Hilfe beim Waschen der Füße und beim Strümpfe-Anziehen.",
        akte: {
          stamm: [
            ["Person", "Margarete Ilić, 79 Jahre, früher Schneiderin, kam aus Kroatien nach Deutschland, seit einem Jahr im Lindenhof"],
            ["Diagnosen", "Diabetes Typ 2 (seit 25 Jahren), Polyneuropathie, Amputation 2. Zehe rechts (2024), Hypertonie"],
            ["Allergien", "keine bekannt"]
          ],
          anordnungen: [
            ["Insulin", "Mischinsulin 30/70: 22 IE vor dem Frühstück, 14 IE vor dem Abendessen, Spritz-Ess-Abstand 15 bis 20 Minuten"],
            ["Blutzucker", "vor den Hauptmahlzeiten"],
            ["Füße", "tägliche Fußinspektion, Nagelpflege nur durch Podologie"],
            ["Medikation", "Metformin 500 mg 1-0-1 · Ramipril 5 mg 1-0-0"]
          ],
          verlauf: [["Gestern", "BZ 128 / 164 / 188 mg/dl"]]
        },
        verlauf: [{ ab: "06:00", status: "stabil", v: { rr: "136/78", hf: 74, af: 14, spo2: 97, t: 36.5, bw: "A", bz: 142 } }]
      },
      kuehn: {
        quelle: { typ: "neu" }, name: "Walter Kühn", kurz: "Herr Kühn", alter: 83, geschlecht: "m",
        diagnose: "Zustand nach Schlaganfall rechts mit Hemiparese links und Neglect, PEG-Sonde, Dekubitus Kategorie 2 am Kreuzbein",
        av: { hair: "WB", hairC: "#b8bcc2", skin: "#f0c7a5", cloth: "#9cc3e6", bg: "#ddeeff", wrinkles: 1 },
        flags: ["wunde", "mobil"], zflags: ["med"],
        uebergabe: "Um 4 Uhr auf die rechte Seite gedreht. Dekubitus am Kreuzbein, Kategorie 2, heute Verbandwechsel. Sondenkost läuft ab 7 Uhr. Achtet nicht auf die linke Seite.",
        akte: {
          stamm: [
            ["Person", "Walter Kühn, 83 Jahre, früher Busfahrer, verheiratet, Ehefrau Ingrid besucht ihn täglich am Vormittag"],
            ["Diagnosen", "Schlaganfall rechts (vor zwei Jahren), Hemiparese links, Neglect links, Dysphagie mit PEG, Dekubitus Kategorie 2 sakral (seit 10 Tagen)"],
            ["Allergien", "keine bekannt"],
            ["Kommunikation", "versteht gut, spricht verwaschen, von rechts ansprechen"]
          ],
          anordnungen: [
            ["Ernährung", "Sondenkost 1 000 ml über Pumpe 07 bis 19 Uhr, 1 500 ml Wasser über den Tag, Oberkörper mindestens 30° hoch"],
            ["Medikation über PEG", "ASS 100 mg 1-0-0 · Atorvastatin 20 mg 0-0-1 · Metoprolol ret. 47,5 mg 1-0-0 (Retardtablette, darf nicht zermörsert werden: ärztlich auf schnell freisetzende Form umstellen lassen)"],
            ["Wunde", "Dekubitus sakral: Hydrokolloidverband, Wechsel alle 3 Tage und bei Bedarf, Wunddokumentation mit Foto"],
            ["Bewegungsplan", "Positionswechsel mindestens alle 2 bis 3 Stunden, 30°-Seitenlage, Kreuzbein frei"]
          ],
          verlauf: [["Vor 3 Tagen", "Wunde 2 × 1,5 cm, Wundgrund rosig, keine Infektzeichen"]]
        },
        verlauf: [{ ab: "06:00", status: "stabil", v: { rr: "128/76", hf: 68, af: 16, spo2: 96, t: 36.9, bw: "A" } }]
      },
      lindner: {
        quelle: { typ: "neu" }, name: "Josef Lindner", kurz: "Herr Lindner", alter: 94, geschlecht: "m",
        diagnose: "Fortgeschrittenes Prostatakarzinom mit Knochenmetastasen, palliative Versorgung",
        av: { hair: "GH", hairC: "#dfe1e4", skin: "#f0c7a5", cloth: "#9cc3e6", bg: "#ddeeff", wrinkles: 1 },
        flags: ["palliativ", "schmerz"], keinZufall: false,
        uebergabe: "Schläft viel, isst kaum noch, trinkt schluckweise. Schmerzpflaster Fentanyl wird heute gewechselt. Patientenverfügung: keine Krankenhauseinweisung, keine Reanimation. Tochter Monika ist Bevollmächtigte.",
        akte: {
          stamm: [
            ["Person", "Josef Lindner, 94 Jahre, früher Landwirt, katholisch, Tochter Monika (Vorsorgevollmacht) wohnt 20 Minuten entfernt"],
            ["Diagnosen", "Prostatakarzinom mit Knochenmetastasen (Wirbelsäule, Becken), Herzinsuffizienz"],
            ["Patientenverfügung", "keine Krankenhauseinweisung, keine Reanimation, keine künstliche Ernährung, Wunsch nach Seelsorge in der letzten Phase"],
            ["Allergien", "keine bekannt"],
            ["SAPV", "Palliativteam eingebunden, Bedarfsplan liegt vor"]
          ],
          anordnungen: [
            ["Schmerz", "Fentanyl-Pflaster 25 µg/h, Wechsel alle 72 Stunden (heute 08 Uhr) · Bedarf: Morphin 2,5 mg s. c., höchstens stündlich"],
            ["Bedarfsplan Palliativ", "bei Atemnot Morphin s. c. wie oben · bei Rasselatmung Butylscopolamin 20 mg s. c. · bei Unruhe Midazolam 2,5 mg s. c."],
            ["Pflege", "Mundpflege nach Wunsch, Positionswechsel nach Wohlbefinden, keine Routine-Vitalzeichen"]
          ],
          verlauf: [["Gestern", "Viel geschlafen, freut sich über Besuch der Tochter, Schmerz in Ruhe gering"]]
        },
        verlauf: [{ ab: "06:00", status: "beobachten", v: { rr: "104/62", hf: 96, af: 20, spo2: 91, t: 37.2 }, hinweis: "schläft viel, reagiert auf Ansprache" }]
      },
      becker: {
        quelle: { typ: "neu" }, name: "Ruth Becker", kurz: "Frau Becker", alter: 81, geschlecht: "w", kommt: "09:00",
        diagnose: "Einzug zur Kurzzeitpflege nach Krankenhausaufenthalt wegen Pneumonie; Herzinsuffizienz, Gangunsicherheit",
        av: { hair: "EN", hairC: "#a9a9ad", skin: "#f6d2b3", cloth: "#7c3aed", bg: "#efe7fb", glasses: 1, wrinkles: 1 },
        flags: ["sturz", "herz"], zflags: ["med", "seh"],
        uebergabe: "Zieht heute gegen 9 Uhr für drei Wochen zur Kurzzeitpflege ein, kommt direkt aus dem Krankenhaus. Arztbrief und Medikamente bringt der Sohn mit.",
        akte: {
          stamm: [
            ["Person", "Ruth Becker, 81 Jahre, verwitwet, früher Bankkauffrau, lebt allein in einer Wohnung im 2. Stock ohne Aufzug. Sohn Markus"],
            ["Grund", "Kurzzeitpflege nach Pneumonie, Ziel: Rückkehr nach Hause"],
            ["Diagnosen", "Pneumonie (abgeheilt), Herzinsuffizienz, Gonarthrose beidseits"],
            ["Allergien", "Sulfonamide"]
          ],
          anordnungen: [
            ["Entlassbrief Krankenhaus", "Furosemid 20 mg 1-0-0 · Bisoprolol 2,5 mg 1-0-0 · Ramipril 2,5 mg 1-0-0 · Pantoprazol 20 mg 1-0-0"],
            ["Mitgebrachte Tabletten (alter Hausarztplan)", "Furosemid 40 mg 1-0-0 · Bisoprolol 2,5 mg · Ramipril 5 mg"],
            ["Vorgaben", "Gewicht täglich, Mobilisation mit Rollator, Physiotherapie verordnet"]
          ],
          verlauf: []
        },
        verlauf: [{ ab: "09:00", status: "stabil", v: { rr: "128/76", hf: 78, af: 18, spo2: 95, t: 36.7, bw: "A" } }]
      }
    },

    aufgaben: [
      { id: "vo-ldopa", pat: "voss", t: "Parkinson-Medikament 06:30 Uhr", kat: "sicherheit", ab: "06:00", faellig: "06:30", dauer: 4, punkte: 12, icon: "pill",
        inhalt: { typ: "quiz", q: "Herr Voss schläft noch tief. Levodopa ist für 06:30 Uhr angeordnet, das Frühstück kommt um 07:30 Uhr. Was tust du?",
          opts: [
            { t: "Ihn sanft wecken und das Medikament pünktlich mit Wasser geben, 30 Minuten vor dem Frühstück", ok: true, fb: "Richtig. Parkinson-Medikamente sind zeitkritisch: Schon kurze Verspätungen führen zu Steifigkeit, Freezing und Sturzgefahr. Eiweißreiche Mahlzeiten stören die Aufnahme, daher Abstand zum Essen." },
            { t: "Ausschlafen lassen und das Medikament zum Frühstück geben, dann schont es den Magen", ok: false, fb: "Mit eiweißreichem Essen wirkt Levodopa schlechter, und die Verspätung verstärkt die Morgensteifigkeit." },
            { t: "Die Tablette auf den Nachttisch legen, er nimmt sie, wenn er aufwacht", ok: false, fb: "Unbeaufsichtigte Medikamente sind unsicher. Bei Parkinson kommt es auf die Uhrzeit an." }
          ] } },
      { id: "ku-lagern", pat: "kuehn", t: "Positionswechsel und Haut", kat: "fachlich", ab: "06:00", faellig: "06:45", dauer: 8, punkte: 10, icon: "bed",
        inhalt: { typ: "quiz", multi: true, q: "Herr Kühn liegt seit 4 Uhr auf der rechten Seite. Was gehört zum Positionswechsel?",
          opts: [
            { t: "In die 30°-Seitenlage links bzw. Rückenlage mit freiem Kreuzbein, dabei den gelähmten Arm sicher lagern", ok: true },
            { t: "Haut an Kreuzbein, Fersen, Hüften kontrollieren (Fingertest bei Rötung)", ok: true },
            { t: "Zeit und Position im Bewegungsplan dokumentieren", ok: true },
            { t: "Mit Gleittuch arbeiten, nicht über die Haut ziehen (Scherkräfte)", ok: true },
            { t: "Einen Gummiring unter das Kreuzbein legen", ok: false, fb: "Ringe erzeugen am Rand neuen Druck und stören die Durchblutung. Sie sind nach Expertenstandard ungeeignet." },
            { t: "Gerötete Stellen kräftig einmassieren", ok: false, fb: "Massage schädigt vorgeschädigtes Gewebe zusätzlich." }
          ] } },
      { id: "il-bz", pat: "ilic", t: "Blutzucker und Mischinsulin", kat: "sicherheit", ab: "06:45", faellig: "07:15", dauer: 6, punkte: 12, icon: "drop", akte: true,
        inhalt: { typ: "messen", nur: ["bz"], frage: { q: "BZ 142 mg/dl. Frau Ilić geht um 07:30 Uhr in den Speiseraum. Wann und wie gibst du das Mischinsulin?",
          opts: [
            { t: "22 IE Mischinsulin nach Plan, etwa 15 bis 20 Minuten vor dem Frühstück, und sicherstellen, dass sie danach wirklich isst", ok: true, fb: "Richtig. Bei Mischinsulin ist der Spritz-Ess-Abstand einzuhalten, und die Mahlzeit muss sicher folgen, sonst droht eine Unterzuckerung." },
            { t: "Jetzt sofort spritzen, dann ist es erledigt", ok: false, fb: "45 Minuten vor dem Essen ist zu früh. Mit Mischinsulin droht vor dem Frühstück eine Unterzuckerung." },
            { t: "Weniger Insulin geben, weil der Wert gut ist", ok: false, fb: "Dosisänderungen ordnet die Hausärztin an. 142 mg/dl vor dem Frühstück ist ein guter Wert, der Plan passt." }
          ] } } },
      { id: "ku-peg", pat: "kuehn", t: "Medikamente über die PEG", kat: "sicherheit", ab: "07:00", faellig: "08:00", dauer: 10, punkte: 14, icon: "tube", akte: true,
        inhalt: { typ: "quiz", multi: true, q: "Du gibst Herrn Kühn seine Morgenmedikamente über die PEG. Schau in die Anordnung. Was ist richtig?",
          opts: [
            { t: "Oberkörper mindestens 30° hochlagern", ok: true },
            { t: "Vor und nach jedem Medikament mit etwa 20 ml Wasser spülen", ok: true },
            { t: "Jedes Medikament einzeln auflösen und einzeln geben", ok: true },
            { t: "Die Retardtablette Metoprolol nicht mörsern, sondern Aylin Demir informieren, damit die Hausärztin umstellt", ok: true },
            { t: "Alle Tabletten zusammen mörsern und in die Sondenkost geben", ok: false, fb: "Mischungen können verstopfen und Wechselwirkungen verursachen. In die Sondenkost gehört kein Medikament." },
            { t: "Die Retardtablette mörsern, die Wirkung ist ja dieselbe", ok: false, fb: "Gemörsert wird der ganze Wirkstoff auf einmal frei. Das kann bei Metoprolol einen gefährlichen Blutdruck- und Pulsabfall auslösen." }
          ] } },
      { id: "so-essen", pat: "sommer", t: "Frühstück anreichen", kat: "fachlich", ab: "07:30", faellig: "08:15", dauer: 15, punkte: 12, icon: "drop",
        inhalt: { typ: "quiz", multi: true, q: "Frau Sommer hat eine Schluckstörung. Was ist beim Anreichen richtig?",
          opts: [
            { t: "Sie sitzt aufrecht, Kopf leicht nach vorn geneigt, du sitzt auf Augenhöhe", ok: true },
            { t: "Kleine Löffel, warten, bis der Mund leer ist und sie geschluckt hat", ok: true },
            { t: "Getränke nach Plan leicht andicken", ok: true },
            { t: "Nach dem Essen 30 Minuten aufrecht sitzen lassen, Mund auf Reste kontrollieren", ok: true },
            { t: "Mit einem Strohhalm trinken lassen, dann verschluckt sie sich weniger", ok: false, fb: "Mit dem Strohhalm ist die Schluckmenge schwer zu steuern, viele Menschen mit Dysphagie verschlucken sich dabei eher. Nur auf logopädische Empfehlung." },
            { t: "Im Stehen von oben anreichen, das geht schneller", ok: false, fb: "Dann legt sie den Kopf in den Nacken, die Atemwege sind weniger geschützt. Immer auf Augenhöhe." }
          ] } },
      { id: "li-pflaster", pat: "lindner", t: "Fentanyl-Pflaster wechseln", kat: "sicherheit", ab: "07:45", faellig: "08:15", dauer: 8, punkte: 12, icon: "band",
        inhalt: { typ: "quiz", multi: true, q: "Heute wird das Fentanyl-Pflaster gewechselt. Was ist richtig?",
          opts: [
            { t: "Altes Pflaster entfernen, Klebeflächen nach innen falten und nach BtM-Vorgaben entsorgen und dokumentieren", ok: true },
            { t: "Neue Stelle wählen: intakte, unbehaarte Haut am Oberkörper oder Oberarm", ok: true },
            { t: "Datum und Uhrzeit auf dem Pflaster und in der Dokumentation vermerken", ok: true },
            { t: "Keine Wärmflasche auf das Pflaster, Fieber beobachten (Wärme erhöht die Aufnahme)", ok: true },
            { t: "Das neue Pflaster halbieren, er schläft ja viel", ok: false, fb: "Fentanyl-Pflaster dürfen nicht zerschnitten werden. Dosisänderungen nur ärztlich." },
            { t: "Das neue Pflaster genau auf die alte Stelle kleben, damit nichts verrutscht", ok: false, fb: "Klebestellen wechseln, sonst wird die Haut gereizt und die Aufnahme verändert sich." }
          ] } },
      { id: "li-mund", pat: "lindner", t: "Mundpflege in der Palliativsituation", kat: "fachlich", ab: "08:00", faellig: "09:00", dauer: 8, punkte: 10, icon: "drop",
        inhalt: { typ: "quiz", multi: true, q: "Herr Lindner trinkt kaum noch, die Lippen sind trocken. Was ist gute Mundpflege?",
          opts: [
            { t: "Mund mit Getränken befeuchten, die er mag (z. B. Bier oder Kaffee), mit Tupfer oder Sprühflasche", ok: true },
            { t: "Lippen mit Pflegebalsam schützen", ok: true },
            { t: "Mundpflege nach seinem Wohlbefinden, nicht nach Zeitplan", ok: true },
            { t: "Ihn zum Trinken drängen, damit die Trinkmenge stimmt", ok: false, fb: "In der Sterbephase ist weniger Trinken normal. Durstgefühl entsteht vor allem durch einen trockenen Mund, also Mundpflege statt Trinkziel." },
            { t: "Zitronen-Glycerin-Stäbchen verwenden", ok: false, fb: "Sie trocknen die Schleimhaut aus und brennen." }
          ] } },
      { id: "vo-mobil", pat: "voss", t: "Aufstehen bei Kreislaufproblemen", kat: "fachlich", ab: "08:15", faellig: "09:00", dauer: 10, punkte: 10, icon: "bed",
        inhalt: { typ: "reihe", q: "Herr Voss wird beim Aufstehen schnell schwindelig. Bring die Schritte in eine sichere Reihenfolge.",
          items: [
            "Im Liegen Füße kreisen und die Beine bewegen lassen",
            "Langsam über die Seite aufsetzen und an der Bettkante ein bis zwei Minuten sitzen bleiben",
            "Nach Schwindel fragen, Schuhe anziehen, Rollator vor ihn stellen",
            "Aufstehen, kurz stehen bleiben, dann losgehen; bei Freezing rhythmisch mitzählen"
          ] } },
      { id: "be-medi", pat: "becker", t: "Einzug: Medikamente abgleichen", kat: "sicherheit", ab: "09:00", faellig: "09:40", dauer: 12, punkte: 16, icon: "clip", akte: true,
        inhalt: { typ: "quiz", q: "Der Sohn bringt die Tabletten aus der Wohnung mit und den Entlassbrief. Schau in die Akte. Was fällt auf und was tust du?",
          opts: [
            { t: "Furosemid und Ramipril sind im Entlassbrief niedriger dosiert als im alten Plan. Nicht nach dem alten Plan stellen, sondern Aylin Demir informieren und die Hausärztin um einen gültigen Medikationsplan bitten", ok: true, fb: "Richtig. Beim Übergang vom Krankenhaus kommen Medikationsfehler besonders häufig vor. Gültig ist nur, was die behandelnde Ärztin festlegt." },
            { t: "Die mitgebrachten Tabletten nach dem alten Hausarztplan stellen, die kennt sie ja", ok: false, fb: "Die Dosis wurde im Krankenhaus bewusst geändert. Mit dem alten Plan bekommt sie die doppelte Furosemid-Dosis." },
            { t: "Einfach den Entlassbrief übernehmen, der ist am neuesten", ok: false, fb: "Ein Entlassbrief ist eine Empfehlung an die weiterbehandelnde Ärztin. Die Hausärztin muss den Plan bestätigen." }
          ] } },
      { id: "be-sturz", pat: "becker", t: "Sturzrisiko beim Einzug", kat: "fachlich", ab: "09:10", faellig: "10:15", dauer: 10, punkte: 12, icon: "eye",
        inhalt: { typ: "quiz", multi: true, q: "Was ist nach dem Expertenstandard Sturzprophylaxe beim Einzug von Frau Becker sinnvoll?",
          opts: [
            { t: "Ihre persönlichen Risikofaktoren erfassen: Gangunsicherheit, Herzmedikamente, Sehen, nächtlicher Harndrang", ok: true },
            { t: "Zimmer gemeinsam einrichten: Nachtlicht, Klingel in Reichweite, Wege frei, Rollator am Bett", ok: true },
            { t: "Sie über ihr Risiko informieren und gemeinsam Maßnahmen vereinbaren, z. B. Hüftprotektoren anbieten", ok: true },
            { t: "Physiotherapie für Kraft- und Gleichgewichtstraining einplanen", ok: true },
            { t: "Vorsorglich nachts das Bettgitter hochziehen", ok: false, fb: "Bettgitter gegen den Willen sind freiheitsentziehend und brauchen Einwilligung bzw. richterliche Genehmigung. Sie erhöhen außerdem die Verletzungsgefahr beim Übersteigen." },
            { t: "Eine Sturzrisikoskala ausfüllen, das reicht als Einschätzung", ok: false, fb: "Der Expertenstandard empfiehlt keine Skalen allein, sondern die Einschätzung individueller Risikofaktoren." }
          ] } },
      { id: "ku-wunde", pat: "kuehn", t: "Dekubitus: Verband und Doku", kat: "fachlich", ab: "09:00", faellig: "10:00", dauer: 12, punkte: 12, icon: "band",
        varianten: [{ inhalt: { typ: "quiz", q: "Beim Verbandwechsel siehst du: Wunde 2,5 × 2 cm (vor drei Tagen 2 × 1,5 cm), Wundrand gerötet, riecht leicht. Was tust du?",
          opts: [
            { t: "Wunde nach Standard dokumentieren (Größe, Wundgrund, Exsudat, Geruch, Rand, Foto), Verschlechterung an Aylin Demir und die Hausärztin melden, Bewegungsplan überprüfen", ok: true, fb: "Richtig. Größer und gerötet heißt: Verschlechterung und möglicher Infekt. Das muss ärztlich beurteilt werden, und die Druckentlastung reicht offenbar nicht." },
            { t: "Wie geplant den Hydrokolloidverband erneuern und in drei Tagen wieder schauen", ok: false, fb: "Bei Infektzeichen ist ein Hydrokolloidverband ungeeignet, und die Verschlechterung muss heute gemeldet werden." },
            { t: "Desinfektionsmittel großzügig in die Wunde sprühen", ok: false, fb: "Wundantiseptik nur nach Wundkonzept und Anordnung, Hautdesinfektionsmittel gehören nicht in Wunden." }
          ] } }],
        inhalt: { typ: "quiz", multi: true, q: "Die Wunde ist 2 × 1,5 cm, Wundgrund rosig, kaum Exsudat. Was gehört zur Wunddokumentation?",
          opts: [
            { t: "Größe (Länge × Breite, ggf. Tiefe) und Lage", ok: true },
            { t: "Wundgrund, Exsudat, Geruch, Wundrand und Umgebung", ok: true },
            { t: "Schmerz beim Verbandwechsel", ok: true },
            { t: "Foto mit Maßstab nach Hausstandard", ok: true },
            { t: "„Wunde unverändert“ reicht, wenn sie gleich aussieht", ok: false, fb: "Ohne Messwerte lässt sich der Verlauf nicht beurteilen." }
          ] } },
      { id: "doku-wb", pat: null, zimmer: "21", t: "Pflegebericht schreiben", kat: "doku", ab: "10:00", faellig: "10:30", dauer: 8, punkte: 10, icon: "doc",
        inhalt: { typ: "quiz", q: "Der Wohnbereich dokumentiert nach dem Strukturmodell (SIS). Was schreibst du heute in den Pflegebericht?",
          opts: [
            { t: "Abweichungen vom geplanten Ablauf und besondere Ereignisse, z. B. Verschlechterungen, Gespräche mit Ärztin oder Angehörigen und neue Beobachtungen", ok: true, fb: "Richtig. Im Strukturmodell steht die geplante Routine im Maßnahmenplan. Im Bericht stehen nur Abweichungen und Ereignisse." },
            { t: "Bei allen Bewohnern jede Leistung der Grundpflege mit Uhrzeit", ok: false, fb: "Das wird im Strukturmodell nicht mehr einzeln dokumentiert, der Maßnahmenplan reicht dafür." },
            { t: "Nur „Alles in Ordnung“, wenn nichts Besonderes war", ok: false, fb: "Wenn nichts abweicht, musst du nichts schreiben. „Alles in Ordnung“ ohne Inhalt hilft niemandem." }
          ] } }
    ],

    ereignisse: [
      { id: "uebergabe", um: "06:00", art: "info", titel: "Dienstbeginn", text: "Übergabe vom Nachtdienst ist gelaufen. Aylin Demir: „Fang bei Herrn Voss an, seine Tabletten um halb sieben sind wichtig. Ich mache die Grundpflege in 21 und 23.“" },
      { id: "li-tochter", um: "07:20", art: "telefon", pat: "lindner", titel: "Anruf von Monika Lindner", text: "Herrn Lindners Tochter fragt, wie die Nacht war und ob sie heute kommen soll. Sie hat die Vorsorgevollmacht, du darfst ihr Auskunft geben.", wichtig: 2,
        varianten: [{ um: "08:30", text: "Monika Lindner ruft an. Ihre Stimme ist belegt: „Der Papa hat gestern kaum noch etwas gesagt. Muss ich mir Sorgen machen?“" }] },
      { id: "fruehstueck", um: "07:30", art: "info", titel: "Frühstück", text: "Das Frühstück ist im Speiseraum angerichtet. Frau Sommer frühstückt im Zimmer, Herr Kühn bekommt Sondenkost.", wichtig: 1 },
      { id: "ku-ehefrau", um: "08:50", art: "info", pat: "kuehn", titel: "Besuch für Herrn Kühn", text: "Ingrid Kühn ist da. Sie fragt, ob sie ihrem Mann einen Löffel Joghurt geben darf, „nur zum Schmecken“.", wichtig: 1, chance: 0.7 },
      { id: "be-kommt", um: "09:00", art: "aufnahme", pat: "becker", titel: "Einzug in Zimmer 26", text: "Frau Becker kommt mit dem Krankentransport, ihr Sohn bringt eine Tasche mit Tabletten und den Entlassbrief.", wichtig: 2 },
      { id: "visite", um: "09:30", art: "visite", titel: "Hausärztin Dr. Brandes", text: "Dr. Brandes kommt zur Visite in den Wohnbereich. Sie hat 20 Minuten Zeit und möchte die wichtigsten Punkte hören.", wichtig: 2,
        varianten: [{ um: "09:50", art: "telefon", titel: "Dr. Brandes ruft an", text: "Dr. Brandes kann heute nicht kommen. Sie ruft an und bittet um die wichtigsten Punkte am Telefon." }] },
      { id: "friseur", um: "10:05", art: "info", pat: "sommer", titel: "Friseurin", text: "Die Friseurin fragt, ob Frau Sommer heute Haare geschnitten bekommen möchte. Frau Sommer strahlt.", wichtig: 0, chance: 0.4 }
    ],

    zufall: [
      { id: "joghurt", braucht: ["demenz"], art: "info", setting: "langzeit", titel: "Pflegehelferin fragt", text: "Die Pflegehelferin fragt: „{anrede} will unbedingt ein normales Glas Wasser, nicht das angedickte. Darf ich ihr eins geben?“", wichtig: 1,
        aufgabe: { t: "Getränk trotz Schluckstörung?", kat: "sicherheit", dauer: 4, punkte: 8, icon: "drop",
          inhalt: { typ: "quiz", q: "Was antwortest du?",
            opts: [
              { t: "„Bitte nur angedickt, das steht so im Plan, weil sie sich sonst leicht verschluckt. Biete ihr ihr Lieblingsgetränk angedickt an. Ich spreche mit Aylin, ob die Logopädie neu schauen soll.“", ok: true, fb: "Richtig. Dünne Flüssigkeit kann bei Dysphagie in die Lunge gelangen. Wünsche ernst nehmen und die Empfehlung ggf. neu überprüfen lassen." },
              { t: "„Ein Glas schadet nicht.“", ok: false, fb: "Ein Glas reicht für eine Aspirationspneumonie." },
              { t: "„Dann bekommt sie heute eben gar nichts mehr.“", ok: false, fb: "Das gefährdet die Flüssigkeitsversorgung. Andicken statt verbieten." }
            ] } } },
      { id: "nachtstuhl", setting: "langzeit", ohnePat: true, art: "info", titel: "Rollator im Flur", text: "Im Flur zwischen Zimmer 22 und 23 stehen ein Wäschewagen und zwei Rollatoren. Es ist kaum Platz zum Durchgehen.", wichtig: 1,
        aufgabe: { t: "Flur freiräumen", kat: "organisation", dauer: 3, punkte: 4, icon: "walk",
          inhalt: { typ: "quiz", q: "Warum lohnt sich das jetzt?",
            opts: [
              { t: "Freie Wege sind Sturzprophylaxe und Brandschutz. Rollatoren zu den Bewohnern, Wagen in die Nische", ok: true, fb: "Genau. Hindernisse im Flur gehören zu den häufigsten Umgebungsrisiken für Stürze." },
              { t: "Lohnt sich nicht, die Bewohner kennen den Flur", ok: false, fb: "Gerade Menschen mit Demenz oder Sehstörung erkennen Hindernisse schlecht." }
            ] } } }
    ],

    dramen: [
      /* ---------- Sturz mit Kopfanprall unter Antikoagulation ---------- */
      { id: "sturz-voss", titel: "Sturz unter Blutverdünnung", gewicht: 2,
        patienten: { voss: { verlauf: [
          { ab: "06:00", status: "stabil", v: { rr: "138/82", hf: "76 arrhythmisch", af: 16, spo2: 96, t: 36.6, bw: "A" } },
          { ab: "08:05", status: "beobachten", v: { rr: "112/68", hf: "92 arrhythmisch", af: 18, spo2: 96, t: 36.6, bw: "A" }, hinweis: "Platzwunde an der Stirn, klagt über Kopfschmerz" },
          { ab: "08:55", wenn: { nichtFlag: "vs-arzt" }, status: "kritisch", v: { rr: "164/92", hf: "64 arrhythmisch", af: 14, spo2: 95, t: 36.7, bw: "V" }, hinweis: "zunehmend schläfrig, Pupille rechts weiter als links" },
          { flag: "vs-arzt", nach: 30, status: "beobachten", v: { rr: "136/80", hf: "80 arrhythmisch", af: 16, spo2: 96, t: 36.6, bw: "A" }, hinweis: "wartet auf den Rettungswagen zur Abklärung im Krankenhaus" }
        ] } },
        ereignisse: [
          { id: "vs-sturz", um: "08:05", art: "alarm", pat: "voss", setzt: ["vs-sturz"], titel: "Herr Voss liegt am Boden", text: "Herr Voss liegt neben seinem Bett auf dem Boden. An der Stirn eine blutende Platzwunde. „Ich wollte nur schnell zur Toilette.“", wichtig: 3, pause: true,
            varianten: [{ text: "Aus Zimmer 22 hörst du einen dumpfen Schlag. Herr Voss sitzt am Boden an den Schrank gelehnt, hält sich die Stirn und blutet. „Die Beine wollten auf einmal nicht mehr.“" }] },
          { id: "vs-spaet", um: "08:55", art: "alarm", pat: "voss", wenn: { nichtFlag: "vs-arzt" }, titel: "Herr Voss wird schläfrig", text: "Herr Voss ist kaum noch wach zu halten, die rechte Pupille ist weiter als die linke. Aylin Demir ruft den Notruf 112.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 14, t: "Nach Kopfanprall unter Apixaban wurde die Hausärztin nicht rechtzeitig informiert." } },
          { id: "vs-anordnung", wenn: { flag: "vs-arzt" }, art: "telefon", pat: "voss", titel: "Dr. Brandes am Telefon", text: "Dr. Brandes: „Mit Apixaban und Kopfanprall muss er ins Krankenhaus zum CT, auch wenn er gerade wach ist. Ich bestelle den Krankentransport. Bis dahin Bewusstsein und Pupillen alle 15 Minuten.“", wichtig: 2 }
        ],
        aufgaben: [
          { id: "vs-erst", pat: "voss", t: "Nach dem Sturz: Erstversorgung", kat: "sicherheit", faelligNach: { flag: "vs-sturz", min: 5 }, dauer: 8, punkte: 14, icon: "alert", fall: true, wenn: { flag: "vs-sturz" },
            inhalt: { typ: "reihe", q: "Bring dein Vorgehen in die richtige Reihenfolge.",
              items: [
                "Ansprechen, Bewusstsein und Atmung prüfen, Hilfe rufen",
                "Nach Schmerzen fragen und auf Verletzungen untersuchen (Kopf, Hüfte, Handgelenke), nicht sofort hochziehen",
                "Vitalzeichen messen, Wunde steril abdecken",
                "Mit einer zweiten Person bzw. Hilfsmittel aufhelfen, wenn keine Fraktur anzunehmen ist",
                "Hausärztin informieren, Sturzereignisprotokoll schreiben, engmaschig beobachten"
              ] } },
          { id: "vs-antikoag", pat: "voss", t: "Blutverdünner und Kopfanprall", kat: "sicherheit", faelligNach: { flag: "vs-sturz", min: 15 }, dauer: 6, punkte: 14, icon: "pill", fall: true, akte: true, wenn: { flag: "vs-sturz" }, setzt: ["vs-arzt"],
            inhalt: { typ: "quiz", q: "Herr Voss ist wach und orientiert, die Platzwunde blutet kaum noch. Er möchte „keinen Aufstand“. Schau in die Akte. Was ist richtig?",
              opts: [
                { t: "Er nimmt Apixaban: Nach einem Kopfanprall besteht das Risiko einer Hirnblutung, die erst Stunden später auffällt. Jetzt die Hausärztin informieren und bis dahin Bewusstsein und Pupillen engmaschig kontrollieren", ok: true, fb: "Richtig. Unter Antikoagulation wird nach Kopfanprall in der Regel eine CT-Abklärung empfohlen, auch wenn es der Person zunächst gut geht." },
                { t: "Wunde versorgen und abwarten, er ist ja wach und orientiert", ok: false, fb: "Eine Hirnblutung unter Blutverdünnung kann sich langsam entwickeln. Wach sein schließt sie nicht aus." },
                { t: "Das Apixaban heute weglassen, dann blutet es nicht", ok: false, fb: "Absetzen entscheidet die Ärztin. Es hilft auch nicht gegen eine bereits laufende Blutung." }
              ] } },
          { id: "vs-protokoll", pat: "voss", t: "Sturzereignis dokumentieren", kat: "doku", faelligNach: { flag: "vs-sturz", min: 60 }, dauer: 6, punkte: 8, icon: "doc", fall: true, wenn: { flag: "vs-sturz" },
            inhalt: { typ: "quiz", multi: true, q: "Was gehört ins Sturzereignisprotokoll?",
              opts: [
                { t: "Zeitpunkt, Ort und Situation (was wollte er tun?)", ok: true },
                { t: "Folgen: Verletzungen, Vitalzeichen, Maßnahmen, wer informiert wurde", ok: true },
                { t: "Mögliche Ursachen: Uhrzeit der Parkinson-Medikamente, Kreislauf, Schuhe, Licht, Harndrang", ok: true },
                { t: "Wer schuld ist", ok: false, fb: "Das Protokoll dient der Analyse und Prävention, nicht der Schuldfrage." }
              ] } }
        ] },

      /* ---------- Exsikkose mit Harnwegsinfekt bei Frau Sommer ---------- */
      { id: "infekt-sommer", titel: "Fieber und Verwirrtheit", gewicht: 2,
        patienten: { sommer: { uebergabe: "Nachts sehr unruhig, hat kaum getrunken (seit gestern Abend etwa 300 ml). Urin riecht stark. Getränke leicht angedickt.", verlauf: [
          { ab: "06:00", status: "beobachten", v: { rr: "108/62", hf: 98, af: 20, spo2: 94, t: 38.3 }, hinweis: "unruhiger als sonst, trockene Zunge" },
          { ab: "08:40", wenn: { nichtFlag: "sm-arzt" }, status: "kritisch", v: { rr: "96/54", hf: 112, af: 24, spo2: 93, t: 38.9 }, hinweis: "schläfrig, reagiert verlangsamt, kaum Urin" },
          { flag: "sm-arzt", nach: 40, status: "beobachten", v: { rr: "112/64", hf: 96, af: 20, spo2: 95, t: 38.1 }, hinweis: "trinkt mit Begleitung schluckweise" }
        ] } },
        ereignisse: [
          { id: "sm-nacht", um: "06:20", art: "info", pat: "sommer", setzt: ["sm-auffaellig"], titel: "Notiz aus dem Nachtdienst", text: "Im Bericht steht: „Fr. Sommer sehr unruhig, ruft, wenig getrunken, Inkontinenzvorlage stark riechend.“", wichtig: 2,
            varianten: [{ um: "07:10", art: "klingel", titel: "Frau Sommer ist anders als sonst", text: "Die Pflegehelferin sagt: „Frau Sommer erkennt mich heute gar nicht und ist ganz heiß.“" }] },
          { id: "sm-spaet", um: "08:40", art: "alarm", pat: "sommer", wenn: { nichtFlag: "sm-arzt" }, titel: "Frau Sommer kaum ansprechbar", text: "Frau Sommer ist schläfrig, der Blutdruck sinkt. Aylin Demir ruft die Hausärztin und denkt an den Notruf.", wichtig: 3, pause: true, malus: { kat: "sicherheit", pts: 12, t: "Fieber und Flüssigkeitsmangel bei Frau Sommer wurden nicht rechtzeitig an die Hausärztin weitergegeben." } },
          { id: "sm-anordnung", wenn: { flag: "sm-arzt" }, art: "telefon", pat: "sommer", titel: "Dr. Brandes am Telefon", text: "Dr. Brandes: „Ich komme zur Visite vorbei und nehme Urin und Blut ab. Bis dahin Trinken fördern, Bilanz, Fieber und Blutdruck zweistündlich. Sohn Peter bitte informieren, wir sprechen über eine mögliche Einweisung.“", wichtig: 2 }
        ],
        aufgaben: [
          { id: "sm-vit", pat: "sommer", t: "Vitalzeichen bei Frau Sommer", kat: "sicherheit", faelligNach: { flag: "sm-auffaellig", min: 15 }, dauer: 6, punkte: 12, icon: "pulse", fall: true, wenn: { flag: "sm-auffaellig" },
            inhalt: { typ: "messen", frage: { q: "Wie ordnest du die Werte ein?",
              opts: [
                { t: "Fieber, schneller Puls, niedriger Blutdruck und neue Verwirrtheit: Hinweis auf eine Infektion mit Flüssigkeitsmangel. Hausärztin jetzt informieren", ok: true, fb: "Richtig. Bei alten Menschen zeigt sich eine Infektion oft zuerst als Verwirrtheit. Fieber plus Kreislaufzeichen müssen ärztlich beurteilt werden." },
                { t: "Das ist ihre Demenz, nachmittags noch einmal messen", ok: false, fb: "Die Verwirrtheit ist neu und kommt mit Fieber. Das ist kein Demenzverlauf." },
                { t: "Fiebersenkendes Mittel aus dem Vorrat geben, dann ist es erledigt", ok: false, fb: "Fieber senken ohne Ursache zu klären verschleiert den Verlauf. Und es braucht eine Anordnung." }
              ] } } },
          { id: "sm-sbar", pat: "sommer", t: "Hausärztin anrufen (SBAR)", kat: "kommunikation", faelligNach: { flag: "sm-auffaellig", min: 25 }, dauer: 5, punkte: 14, icon: "phone", fall: true, wenn: { flag: "sm-auffaellig" }, setzt: ["sm-arzt"],
            inhalt: { typ: "reihe", q: "Bring den Anruf bei Dr. Brandes in die SBAR-Reihenfolge.",
              items: [
                "S: „Hier ist … aus dem Lindenhof, Wohnbereich 2. Ich rufe wegen Frau Sommer an, 91 Jahre. Sie hat Fieber und ist verwirrter als sonst.“",
                "B: „Mittelgradige Demenz, Schluckstörung mit angedickten Getränken. Seit gestern Abend nur etwa 300 ml getrunken.“",
                "A: „Temperatur 38,3, Puls 98, Blutdruck 108/62. Der Urin riecht stark. Ich vermute einen Harnwegsinfekt mit Flüssigkeitsmangel.“",
                "R: „Können Sie heute vorbeikommen? Was soll ich bis dahin tun? Sollen wir den Sohn informieren?“"
              ] } },
          { id: "sm-trinken", pat: "sommer", t: "Trinken fördern", kat: "fachlich", faelligNach: { flag: "sm-auffaellig", min: 45 }, dauer: 10, punkte: 10, icon: "drop", fall: true, wenn: { flag: "sm-auffaellig" },
            inhalt: { typ: "quiz", multi: true, q: "Wie bringst du Frau Sommer zum Trinken?",
              opts: [
                { t: "Lieblingsgetränk (Kaffee mit Milch) leicht angedickt anbieten", ok: true },
                { t: "Oft kleine Mengen, sichtbar und in Reichweite, gemeinsam trinken", ok: true },
                { t: "Flüssigkeitsreiche Speisen anbieten (z. B. Suppe, Joghurt, angedickt)", ok: true },
                { t: "Jede Menge im Trinkprotokoll erfassen", ok: true },
                { t: "Wenn sie nicht trinkt, ein großes Glas auf einmal geben", ok: false, fb: "Große Mengen auf einmal erhöhen bei Dysphagie das Aspirationsrisiko." }
              ] } }
        ] },

      /* ---------- Finalphase bei Herrn Lindner ---------- */
      { id: "final-lindner", titel: "Letzte Lebensphase", gewicht: 1,
        patienten: { lindner: { verlauf: [
          { ab: "06:00", status: "beobachten", v: { rr: "104/62", hf: 96, af: 20, spo2: 91, t: 37.2 }, hinweis: "schläft viel, reagiert auf Ansprache" },
          { ab: "08:35", status: "kritisch", v: { rr: "86/50", hf: 112, af: "26, Pausen", spo2: 86, t: 37.6 }, hinweis: "brodelnde Atmung, Hände kühl, Haut marmoriert" }
        ] } },
        ereignisse: [
          { id: "lf-atem", um: "08:35", art: "klingel", pat: "lindner", setzt: ["lf-start"], titel: "Veränderte Atmung", text: "Bei Herrn Lindner hörst du eine laute, brodelnde Atmung mit kurzen Pausen. Seine Hände sind kühl, die Haut an den Knien marmoriert. Er wirkt ruhig.", wichtig: 3 },
          { id: "lf-tochter", wenn: { flag: "lf-angerufen" }, art: "info", pat: "lindner", titel: "Monika Lindner ist da", text: "Monika Lindner sitzt am Bett ihres Vaters und hält seine Hand. Sie fragt, ob er Schmerzen hat und ob er erstickt.", wichtig: 2 }
        ],
        aufgaben: [
          { id: "lf-rassel", pat: "lindner", t: "Rasselatmung lindern", kat: "fachlich", faelligNach: { flag: "lf-start", min: 15 }, dauer: 8, punkte: 12, icon: "lung", fall: true, wenn: { flag: "lf-start" }, akte: true,
            inhalt: { typ: "quiz", multi: true, q: "Was ist jetzt angemessen? Schau in den Bedarfsplan.",
              opts: [
                { t: "Oberkörper leicht erhöht oder Seitenlage, damit das Sekret abfließen kann", ok: true },
                { t: "Butylscopolamin nach Bedarfsplan geben und Aylin Demir informieren", ok: true },
                { t: "Mundpflege und ruhige Umgebung", ok: true },
                { t: "Regelmäßig tief absaugen, damit die Atemwege frei sind", ok: false, fb: "Absaugen ist in der Sterbephase meist belastend und bringt das Rasseln oft nicht zum Verschwinden. Nur im Einzelfall bei gut erreichbarem Sekret im Mund." },
                { t: "Den Notarzt rufen und ins Krankenhaus bringen lassen", ok: false, fb: "Die Patientenverfügung schließt eine Krankenhauseinweisung aus. Palliativteam und Hausärztin sind die richtigen Ansprechpartner." }
              ] } },
          { id: "lf-anruf", pat: "lindner", t: "Tochter anrufen", kat: "kommunikation", faelligNach: { flag: "lf-start", min: 20 }, dauer: 5, punkte: 12, icon: "phone", fall: true, wenn: { flag: "lf-start" }, setzt: ["lf-angerufen"],
            inhalt: { typ: "quiz", q: "Wie rufst du Monika Lindner an?",
              opts: [
                { t: "„Hier ist … vom Lindenhof. Ihr Vater hat sich in der letzten halben Stunde verändert: Er atmet anders und ist kaum noch wach. Wir glauben, dass er in die letzte Phase kommt. Möchten Sie kommen? Sie können sich Zeit lassen, wir sind bei ihm.“", ok: true, fb: "Ehrlich, klar und ohne Panik. Sie bekommt die Information, die sie für ihre Entscheidung braucht." },
                { t: "„Sie sollten sofort kommen, es geht zu Ende!“", ok: false, fb: "Inhaltlich ehrlich, aber Hektik am Telefon führt zu gefährlichen Autofahrten. Ruhig informieren." },
                { t: "„Es geht ihm gut, kommen Sie gern am Nachmittag.“", ok: false, fb: "Das ist nicht wahr und nimmt ihr vielleicht die Chance, sich zu verabschieden." }
              ] } },
          { id: "lf-begleiten", pat: "lindner", t: "Tochter begleiten", kat: "kommunikation", faelligNach: { flag: "lf-angerufen", min: 30 }, dauer: 10, punkte: 12, icon: "chat", fall: true, wenn: { gefeuert: "lf-tochter" },
            inhalt: { typ: "quiz", q: "„Erstickt er? Hat er Schmerzen?“, fragt die Tochter. Was sagst du?",
              opts: [
                { t: "„Das Geräusch entsteht durch Speichel im Rachen, den er nicht mehr schluckt. Für ihn ist das nach allem, was wir wissen, meist nicht quälend. Er hat ein Schmerzpflaster und bekommt bei Bedarf sofort mehr. Sie können seine Hand halten und mit ihm sprechen, Hören bleibt oft lange erhalten.“", ok: true, fb: "Gut: ehrlich erklären, entlasten, Möglichkeiten zum Dasein aufzeigen. Frag auch nach dem Wunsch nach Seelsorge, er steht in der Verfügung." },
                { t: "„Da kann man nichts machen.“", ok: false, fb: "Das stimmt nicht, und es lässt die Tochter allein. Es gibt viel, was Pflege und Familie jetzt tun können." },
                { t: "„Das kann ich Ihnen nicht sagen, fragen Sie die Ärztin.“", ok: false, fb: "Als Pflegende darfst und sollst du Beobachtungen erklären. Für ärztliche Fragen bietest du zusätzlich ein Gespräch an." }
              ] } }
        ] }
    ]
  });
})();
