/* ===== Fall 5: Neurologie / Stroke Unit (2 Patienten) ===== */
(function () {
  var A = window.PXA; if (!A) return;

  function seated(extra, mood) {
    var s = A.room() + A.r(60, 120, 120, 90, 14, "x-chair") + A.r(56, 60, 20, 150, 8, "x-chair") + A.p("M70 210v40M170 210v40", "x-metall");
    s += A.r(84, 100, 74, 90, 22, "x-gown") + A.head(124, 70, 22, "x-hairg") + A.c(132, 66, 1.8, "x-eye") + A.p("M136 82q5 1 8-1", "x-mouth");
    s += A.r(170, 140, 150, 12, 4, "x-chair") + A.p("M300 152v90", "x-metall") + A.r(140, 124, 60, 16, 8, "x-gown") + A.e(204, 132, 10, 7, "h-skin");
    return s + (extra || "");
  }
  function plate(x, y) { return A.e(x, y, 34, 10, "x-plateb") + A.e(x - 10, y - 3, 10, 5, "x-food") + A.e(x + 10, y - 2, 9, 5, "x-thick") + A.e(x + 2, y + 3, 8, 4, "x-gpur"); }
  function cupNose(x, y) { return A.p("M" + x + " " + y + "h28l-3 34h-22z", "x-cupb") + A.p("M" + (x + 18) + " " + y + "q5 8 10 0", "x-bg2") + A.p("M" + (x + 2) + " " + (y + 12) + "h24l-2 20h-20z", "x-thick"); }
  function nurse(x, y) { return A.head(x, y, 18, "x-hairy") + A.face(x, y + 2) + A.r(x - 22, y + 20, 44, 70, 16, "x-scrub"); }
  function faceFront(extra) {
    return A.table() + A.c(200, 130, 86, "h-skin") + A.p("M114 110c0-60 40-88 86-88s86 28 86 88c-10-30-40-46-86-46s-76 16-86 46z", "x-hairg") +
      A.c(168, 116, 5, "x-eye") + A.c(232, 116, 5, "x-eye") + A.p("M160 180q40 18 80 4", "x-mouth") + A.p("M160 180q-6 4-8 10", "x-mouth") + (extra || "");
  }
  var dys = {
    kost: A.table() + A.tray(30, 40, 340, 150) + plate(130, 110) + A.t(130, 150, "Kost: IDDSI 4 (püriert)", "x-txt x-s") + cupNose(240, 80) + A.t(254, 140, "Getränk: IDDSI 2", "x-txt x-s") +
      A.r(300, 70, 40, 56, 6, "x-white") + A.t(320, 102, "Andickung", "x-txt x-s") + A.tag(200, 230, "Kostform laut Logopädie prüfen", "x-tag"),
    vorb: faceFront(A.tag(200, 250, "wach? Prothese sitzt? Mund frei? Absaugung bereit", "x-tag")),
    sitz: seated(plate(250, 136)) + A.tag(120, 26, "90° aufrecht · Kinn leicht zur Brust", "x-tag x-tagg") + A.tag(250, 186, "re. Arm auf dem Tisch abgelegt", "x-tag"),
    nah: seated(plate(250, 136) + nurse(250, 78)) + A.p("M228 104l-90-24", "x-arrow") + A.tag(250, 186, "Augenhöhe · Löffel von vorn unten", "x-tag x-tagg"),
    loeffel: seated(plate(250, 136) + nurse(250, 78) + A.p("M232 110l-80-26", "x-metall") + A.e(150, 84, 6, 3, "x-thick")) + A.tag(250, 186, "Teelöffel · linke Zungenseite", "x-tag x-tagg"),
    nass: seated(nurse(250, 78)) + A.p("M150 74q10-6 18 0M152 66q12-8 22 0", "x-arrow") + A.tag(120, 26, "„Ä-äh“ klingt nass, Hüsteln", "x-tag x-tagr") + A.cross(212, 60),
    becher: A.table() + cupNose(110, 80) + A.tick(130, 60) + A.t(124, 140, "Nasenausschnitt", "x-txt x-s") + A.p("M250 84h40l-4 40h-32zM290 96l30-14", "x-cupb") + A.cross(286, 60) + A.t(282, 140, "Schnabelbecher", "x-txt x-s") + A.tag(200, 220, "Kopf bleibt vorn · nichts Dünnflüssiges", "x-tag"),
    wange: faceFront(A.e(146, 172, 16, 12, "x-food") + A.p("M140 196l-40 30", "x-arrow")) + A.tag(110, 250, "Reste in der re. Wangentasche", "x-tag x-tagr"),
    nach: seated(A.r(290, 40, 70, 70, 35, "x-white") + A.p("M325 52v24l14 8", "x-metall")) + A.tag(250, 186, "30 Minuten aufrecht", "x-tag x-tagg") + A.tag(120, 26, "Mundpflege · Klingel links", "x-tag"),
    doku: A.table() + A.r(60, 20, 280, 230, 8, "x-board") + A.r(74, 34, 252, 206, 4, "x-paper") + A.t(90, 58, "Ess- und Trinkprotokoll 08:10", "x-txt x-b", "start") +
      ["Kost IDDSI 4: ½ Portion (Tellerprotokoll)", "Getränk IDDSI 2: 150 ml", "4. Löffel: Stimme nass, Hüsteln → Pause", "Reste re. Wangentasche entfernt", "Logopädie informiert · 30 min aufrecht", "Dauer 35 min · HZ"].map(function (l, i) { return A.t(90, 86 + i * 25, l, "x-txt x-s", "start"); }).join("") + A.tick(300, 226)
  };

  function albersScene() {
    var s = A.room() + A.r(290, 26, 80, 60, 4, "h-win") + A.p("M330 26v60M290 56h80", "h-line") + A.r(300, 86, 60, 8, 2, "x-chair") + A.p("M316 62h14v24h-14z", "x-bottlew");
    s += A.r(20, 150, 300, 26, 8, "x-mattress") + A.bedSide(14, 174, 312) + A.r(22, 128, 70, 26, 12, "h-pill") + A.head(60, 124, 18, "x-hairy") + A.face(60, 126, "flat");
    s += A.r(78, 132, 120, 26, 12, "x-gown") + A.r(196, 136, 104, 18, 9, "x-legs") + A.e(304, 150, 10, 8, "h-skin") + A.e(300, 156, 7, 4, "x-redskin");
    s += A.p("M110 162c10-6 18 6 28 0s18 6 28 0", "x-wrinkle") + A.p("M100 140c20 10 40-2 60 22", "x-cable") + A.r(150, 148, 16, 10, 3, "x-metal");
    s += A.r(4, 96, 44, 8, 2, "x-chair") + A.p("M12 96l4-20h18l4 20z", "x-cupb") + A.c(21, 86, 3.5, "x-pillw") + A.c(29, 88, 3.5, "x-pilly");
    s += A.r(200, 102, 110, 10, 3, "x-chair") + A.p("M250 112v60", "x-metall") + A.e(236, 96, 22, 6, "x-plateb") + A.e(232, 92, 8, 4, "x-food") + A.p("M266 82h14l-2 14h-10z", "x-cupb") + A.r(286, 86, 16, 10, 3, "x-white");
    return s;
  }

  var C = {
    id: "neuro", titel: "Schlucken, Zittern, Zeitfenster", station: "Neurologie · Stroke Unit 6N", haus: "Klinikum Nordheide", farbe: "#4F46E5",
    icon: "M12 3c-3 0-5 2-5 4-2 0-3 2-3 4s1 3 2 3c0 2 2 4 4 4h4c2 0 4-2 4-4 1 0 2-1 2-3s-1-4-3-4c0-2-2-4-5-4zM12 7v10",
    kurz: "Ein stolzer Organist nach Schlaganfall, der nicht mehr sprechen und kaum schlucken kann, und eine leise Buchhändlerin mit Parkinson, bei der jede Viertelstunde Verspätung der Tablette zählt.",
    anleitung: "Ole Lindqvist", pruefer: "Frau Schäfer",
    briefing: [
      "Hej, ich bin Ole Lindqvist, Praxisanleiter auf der Stroke Unit. Frau Schäfer aus der Pflegeschule prüft morgen mit. Bei uns liegen Menschen mit Schlaganfall, Parkinson, Epilepsie und MS. Vieles, was du hier tust, ist Beobachtung: Bewusstsein, Sprache, Schlucken, Bewegung.",
      "Du betreust zwei Menschen mit erhöhtem Pflegebedarf. Herr Pohl hat vor vier Tagen einen Schlaganfall gehabt, er kann rechts wenig bewegen, kaum sprechen und schluckt schlecht. Frau Albers hat seit neun Jahren Parkinson und ist mit einem Harnwegsinfekt gekommen; seitdem ist sie viel steifer.",
      "Zwei Regeln für morgen: Auf dieser Station isst niemand, bevor du weißt, was er schlucken kann. Und Parkinson-Medikamente kommen auf die Minute, nicht „irgendwann in der Medikamentenrunde“."
    ],
    order: ["A", "B"],
    pat: {
      A: {
        key: "A", name: "Gerhard Pohl", kurz: "Herr Pohl", alter: 79, zimmer: "604", modus: "Pflegehandlung", farbe: "#4F46E5",
        typ: "Ehemaliger Kirchenorganist, stolz und musikalisch, frustriert über seine Sprachlosigkeit, weint schnell, verständigt sich mit Gesten und der linken Hand.",
        diagnose: "Ischämischer Hirninfarkt im Mediastromgebiet links vor 4 Tagen; Hemiparese rechts, motorische Aphasie, Dysphagie.",
        daten: [
          ["Vorerkrankungen", "Vorhofflimmern, arterielle Hypertonie, Hörminderung links"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "verheiratet (Ehefrau Ilse kommt täglich mittags), Organist bis 75"],
          ["Logopädie", "Schluckscreening auffällig, Kost IDDSI 4 (püriert), Getränke IDDSI 2 (leicht angedickt), nur unter Aufsicht; Tabletten gemörsert nach Rücksprache"],
          ["Medikation", "Apixaban 5 mg 1-0-1 · Atorvastatin 40 mg 0-0-1 · Ramipril 5 mg 1-0-0"],
          ["Vitalwerte heute, 06 Uhr", "RR 152/86 mmHg · HF 84/min, unregelmäßig · SpO₂ 95 % · T 37,4 °C · wach, NIHSS stabil"]
        ],
        erzaehler: "Ehefrau Ilse Pohl",
        anamnese: "Er sagt ja nichts, also erzähl ich. Gerhard war 40 Jahre Organist in St. Johannes, jeden Sonntag. Jetzt kann er nicht mal mehr „Ilse“ sagen, da weint er dann. Er versteht aber alles, glaub ich, er nickt und zeigt mit der linken Hand. Gestern beim Mittag hat er gehustet wie verrückt, die Schwester hat dann aufgehört. Ich hab ihm heimlich ein bisschen Wasser gegeben, er hatte so Durst, und die angedickten Sachen mag er nicht, das sei wie Tapetenkleister, zeigt er mir. Abends findet man bei ihm im Mund noch Essen, rechts in der Backe, er merkt das nicht. Morgen bring ich ihm seine Hühnersuppe mit, die mag er. Ach, und mit links hört er schlecht, man muss rechts sprechen. Wenn ihn jemand von oben anspricht, regt er sich auf.",
        kern: [
          { t: "Husten beim Essen gestern: Aspirationszeichen", kw: ["husten", "aspir", "verschluck"] },
          { t: "Ehefrau gibt heimlich dünnflüssiges Wasser: Aspirationsgefahr, Angehörige anleiten", kw: ["wasser", "heimlich", "dünnflüssig", "ehefrau", "angehörig"] },
          { t: "Lehnt angedickte Getränke ab („Tapetenkleister“): Trinkmenge und Dehydratationsgefahr", kw: ["angedickt", "kleister", "trink", "durst", "dehydr", "ablehn"] },
          { t: "Essensreste in der rechten Wangentasche: Sensibilitätsstörung, Aspirations- und Infektionsgefahr", kw: ["wange", "backe", "reste", "mund"] },
          { t: "Ehefrau will Hühnersuppe mitbringen: dünnflüssig, nur angedickt nach Logopädie", kw: ["suppe", "hühnersuppe", "mitbring"] },
          { t: "Motorische Aphasie bei erhaltenem Sprachverständnis: Kommunikation mit Ja/Nein-Fragen, Gesten, Zeit", kw: ["aphasie", "versteht", "gesten", "kommunikation", "nickt", "sprechen"] },
          { t: "Hört links schlecht, Ansprechen von oben führt zu Unruhe: auf Augenhöhe, von rechts sprechen", kw: ["hört", "links", "augenhöhe", "von oben"] },
          { t: "Ressource: Musik/Orgel als Lebensinhalt, Ehefrau täglich da", kw: ["musik", "orgel", "organist", "ressource", "singen"] }
        ]
      },
      B: {
        key: "B", name: "Renate Albers", kurz: "Frau Albers", alter: 71, zimmer: "606", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#0D9488",
        typ: "Ehemalige Buchhändlerin, leise und höflich, sehr pünktlich mit ihren Tabletten, Angst davor, „einzufrieren“.",
        diagnose: "Idiopathisches Parkinson-Syndrom seit 9 Jahren, akinetische Verschlechterung bei Harnwegsinfekt; Tag 2.",
        daten: [
          ["Vorerkrankungen", "Obstipation, Osteoporose, orthostatische Hypotonie"],
          ["Allergien", "Sulfonamide (Exanthem)"],
          ["Soziales", "lebt mit Ehemann, Tochter Lehrerin in der Nähe"],
          ["Medikation", "L-Dopa/Benserazid 100/25 mg 06-10-14-18 Uhr · L-Dopa/Benserazid ret. 200/50 mg 22 Uhr · Pramipexol 0,18 mg 08-13-18 Uhr · Macrogol 1 Btl 1-0-0 · Pivmecillinam 400 mg 1-1-1 (neu) · Domperidon 10 mg bei Übelkeit"],
          ["Vitalwerte gestern, 18 Uhr", "RR 132/78 mmHg (liegend), 104/64 (stehend) · HF 80/min · T 38,0 °C"],
          ["Mobilität", "Sturz zu Hause vor Aufnahme, Pflegegrad 2, Rollator"]
        ],
        anamnese: "Entschuldigen Sie, dass ich so leise bin, das kommt von der Krankheit. Zu Hause nehme ich meine Tabletten auf die Minute, ich hab einen Wecker. Hier kamen sie gestern um halb elf statt um zehn, da war ich schon wie eingefroren, ich kam nicht mal an die Klingel. Seit dem Infekt bin ich so steif. Frühstück ist schwierig, mit Eiweiß soll ich ja aufpassen wegen der Tabletten, und der Arm will nicht. Nachts liegt mir die Ferse so heiß auf, ich kann mich nicht selbst drehen. Gegen die Übelkeit wollte mir gestern jemand MCP geben, das darf ich nicht, das hat mein Neurologe gesagt. Und wenn ich schnell aufstehe, wird mir schwarz. Lesen geht nicht mehr, das Zittern, aber Hörbücher, die liebe ich.",
        kern: [
          { t: "Verspätete L-Dopa-Gabe führt zum „Einfrieren“ (Off-Phase): zeitkritische Medikation", kw: ["minute", "pünktlich", "verspät", "einfrieren", "off", "zeitkrit", "l-dopa"] },
          { t: "Kann sich im Off nicht bewegen und die Klingel nicht erreichen: Sicherheit", kw: ["klingel", "erreich", "bewegen"] },
          { t: "Eiweiß und L-Dopa: Einnahme mit Abstand zu eiweißreichen Mahlzeiten", kw: ["eiweiß", "protein", "frühstück", "abstand"] },
          { t: "Ferse liegt heiß auf, kann sich nicht selbst drehen: Dekubitusgefahr", kw: ["ferse", "dekubitus", "drehen", "lagerung", "druck"] },
          { t: "Metoclopramid (MCP) kontraindiziert bei Parkinson", kw: ["mcp", "metoclopramid", "kontraind"] },
          { t: "Orthostatische Hypotonie und Sturz in der Vorgeschichte: Sturzgefahr beim Aufstehen", kw: ["schwarz", "orthostat", "aufstehen", "sturz", "schellong"] },
          { t: "Sulfonamid-Allergie: bei Antibiotika beachten", kw: ["sulfonamid", "allergi", "cotrim"] },
          { t: "Ressource: Hörbücher; sehr selbstständig mit Medikamenten", kw: ["hörbuch", "ressource", "selbstständig", "wecker"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Beeinträchtigtes Schlucken (00103) b/d Hirninfarkt links, a/d Husten beim Essen, Speiseresten in der rechten Wangentasche und auffälligem Screening; Aspirationsgefahr (00039). Dazu: Beeinträchtigte verbale Kommunikation (00051) b/d motorischer Aphasie.",
        ziel: "Herr Pohl nimmt die angeordnete Kost und mindestens die ärztlich festgelegte Trinkmenge in angedickter Form ohne Aspirationszeichen auf. Er kann sich mit Ja/Nein-Zeichen und einer Bildtafel verständigen. Die Ehefrau kennt die Kostform und gibt nichts Dünnflüssiges.",
        mass: [
          "Mahlzeiten nur unter Aufsicht, aufrechte Sitzposition 90°, Kinn leicht gesenkt, kleine Portionen, Nachschlucken; Aspirationszeichen (nasse Stimme, Husten) beachten",
          "Getränke angedickt nach Logopädie, Becher mit Nasenausschnitt; Ein- und Ausfuhr, Trinkprotokoll",
          "Mundinspektion nach jeder Mahlzeit (rechte Wangentasche), Mundpflege, 30 Minuten aufrecht",
          "Kommunikation: auf Augenhöhe, von rechts, Ja/Nein-Fragen, Zeit lassen, Bildtafel",
          "Angehörigenanleitung zur Kostform gemeinsam mit Logopädie; Musik als Ressource"
        ],
        chk: [
          { t: "Schluckstörung/Aspirationsgefahr als Diagnose", kw: ["schluck", "aspir", "dysphag"] },
          { t: "Kommunikationsstörung (Aphasie)", kw: ["kommunikation", "aphasie"] },
          { t: "Ziel mit Kostform/Trinkmenge ohne Aspirationszeichen", kw: ["ohne aspiration", "trinkmenge", "kost", "ziel"] },
          { t: "Aufrechte Position, kleine Portionen, Aspirationszeichen", kw: ["aufrecht", "90", "kleine", "nass", "husten"] },
          { t: "Angedickte Getränke, Becher mit Nasenausschnitt", kw: ["angedickt", "iddsi", "becher", "nasen"] },
          { t: "Mundinspektion/Wangentasche, Mundpflege", kw: ["wange", "mundinspektion", "mundpflege"] },
          { t: "Ehefrau anleiten", kw: ["ehefrau", "angehörig", "anleit"] }
        ]
      },
      B: {
        diag: "Beeinträchtigte körperliche Mobilität (00085) b/d Parkinson-Syndrom und Infekt, a/d Rigor, Akinese und Unfähigkeit, sich selbst zu drehen; Dekubitusgefahr (00249) an der Ferse; Gefahr von Off-Phasen b/d verspäteter Medikation; Sturzgefahr b/d orthostatischer Hypotonie.",
        ziel: "Frau Albers erhält L-Dopa innerhalb von 15 Minuten nach den angeordneten Zeiten. Die Haut an den Fersen bleibt intakt. Sie steht nur mit Begleitung auf und kann sagen, warum.",
        mass: [
          "Medikamentenzeiten individuell nach ihrem Plan, nicht nach Stationsrunde; Wecker/Erinnerung, L-Dopa mit Abstand zu eiweißreicher Mahlzeit",
          "Lagerung mit Freilagerung der Fersen, Positionswechsel nach Bewegungsplan, Hautinspektion (Fingertest)",
          "Schellong-Test bzw. RR liegend/stehend, langsames Aufstehen in Etappen, Begleitung",
          "Keine Dopaminantagonisten (MCP, Haloperidol); bei Übelkeit Domperidon nach Anordnung",
          "Klingel in der Hand, bei Off-Phasen engmaschig nach ihr sehen; Hörbücher als Ressource"
        ],
        chk: [
          { t: "Mobilitätseinschränkung / Off-Phasen als Diagnose", kw: ["mobil", "off", "akinese", "rigor"] },
          { t: "Dekubitusgefahr Ferse", kw: ["dekubitus", "ferse"] },
          { t: "Ziel mit Medikamentenzeit (± 15 min) oder Hautbefund", kw: ["15", "pünktlich", "haut", "intakt"] },
          { t: "Zeitkritische Medikation nach individuellem Plan", kw: ["zeit", "pünktlich", "individuell"] },
          { t: "Fersenfreilagerung, Bewegungsplan", kw: ["ferse", "freilager", "bewegungsplan", "lagerung"] },
          { t: "MCP/Dopaminantagonisten vermeiden", kw: ["mcp", "metoclopramid", "haloperidol", "dopaminantag"] },
          { t: "Sturzprophylaxe/Orthostase", kw: ["sturz", "orthostat", "schellong"] }
        ]
      }
    },
    nacht: [
      ["A", "Herr Pohl: Nachts unruhig, hat zweimal versucht aufzustehen. Mundpflege um 22 Uhr: Essensreste rechts in der Wange. Trinkmenge gestern nur 700 ml, er schiebt den angedickten Becher weg. Die Ehefrau kommt heute mit Suppe, hat sie gestern angekündigt."],
      ["B", "Frau Albers: Temperatur um 04 Uhr 38,3 °C. Sie war um 05 Uhr etwas verwirrt, wusste nicht, wo sie ist. Die 06-Uhr-Tablette hab ich ihr in den Becher auf den Nachttisch gestellt, sie hat geschlafen. Ferse rechts rot, hab nicht gelagert, sie wollte Ruhe."],
      ["D", "Zimmer 608, Frau Kessler (34, Epilepsie, Einstellung der Medikation): Nacht ohne Anfall."]
    ],
    sbar: {
      A: {
        muster: {
          S: "Herr Pohl, 79, Zimmer 604, Tag 4 nach Mediainfarkt links mit Hemiparese rechts, Aphasie und Dysphagie. Gestern Husten beim Essen, heute Essensreste in der rechten Wange, Trinkmenge 700 ml.",
          B: "Kost IDDSI 4, Getränke IDDSI 2, Tabletten gemörsert nach Rücksprache. Ehefrau hat heimlich Wasser gegeben und bringt heute Suppe. Hört links schlecht.",
          A: "Hohe Aspirationsgefahr und drohende Dehydratation, weil er die angedickten Getränke ablehnt.",
          R: "Mahlzeiten nur unter Aufsicht mit korrekter Technik, Trinkprotokoll, Logopädie wegen Akzeptanz einbeziehen, Ehefrau heute anleiten."
        },
        chk: [
          { t: "S: Husten beim Essen / Wangentasche", kw: ["husten", "wange"] },
          { t: "S/A: geringe Trinkmenge, Dehydratation", kw: ["700", "trink", "dehydr"] },
          { t: "B: Kostform IDDSI", kw: ["iddsi", "angedickt", "püriert"] },
          { t: "B: Ehefrau gibt Wasser/Suppe", kw: ["ehefrau", "wasser", "suppe"] },
          { t: "R: Logopädie, Anleitung Angehörige", kw: ["logopäd", "anleit"] }
        ]
      },
      B: {
        muster: {
          S: "Frau Albers, 71, Zimmer 606, Parkinson mit akinetischer Verschlechterung bei HWI. Fieber 38,3 °C, um 05 Uhr verwirrt. Die 06-Uhr-L-Dopa-Tablette steht noch auf dem Nachttisch, nicht eingenommen.",
          B: "Neun Jahre Parkinson, Sulfonamid-Allergie, MCP verboten, orthostatische Hypotonie, Sturz vor Aufnahme. Ferse rechts gerötet.",
          A: "Off-Phase durch versäumte Dosis, mögliches Delir bei Infekt, Dekubitusgefahr Ferse.",
          R: "Sofort zu ihr: Vitalzeichen, Bewusstsein, Tablette mit Arzt klären und geben, Ferse freilagern, Arzt wegen Fieber und Verwirrtheit informieren."
        },
        chk: [
          { t: "S: 06-Uhr-Dosis nicht eingenommen", kw: ["06", "nachttisch", "nicht eingenommen", "tablette"] },
          { t: "S: Fieber und Verwirrtheit", kw: ["fieber", "38", "verwirr", "delir"] },
          { t: "B: MCP-Verbot / Sulfonamid-Allergie", kw: ["mcp", "sulfonamid"] },
          { t: "A: Off-Phase", kw: ["off", "einfrier", "akinese"] },
          { t: "R: Ferse freilagern, Arzt informieren", kw: ["ferse", "arzt"] }
        ]
      }
    },
    prio: [
      { id: "a1", t: "Frau Albers: zu ihr, Vitalzeichen, Bewusstsein, nicht eingenommene 06-Uhr-Dosis klären", zeit: "06:15", warum: "Off-Phase und möglicher Delir bei Infekt; die L-Dopa-Dosis ist zeitkritisch." },
      { id: "a2", t: "Arzt informieren: Fieber, Verwirrtheit, versäumte L-Dopa-Dosis", zeit: "06:25", warum: "Ärztliche Entscheidung über Nachgabe und Infektbehandlung." },
      { id: "a3", t: "Frau Albers: Ferse freilagern, Positionswechsel, Klingel in die Hand", zeit: "06:35", warum: "Kategorie-1-Rötung darf nicht weiter belastet werden." },
      { id: "p1", t: "Herr Pohl: Mundinspektion, Vitalzeichen, Wachheit, Trinkmenge der Nacht", zeit: "06:50", warum: "Grundlage für die Mahlzeiten und die Bilanz." },
      { id: "fr", t: "Frühstück Herr Pohl anreichen bzw. begleiten (unter Aufsicht)", zeit: "07:30", warum: "Aspirationsgefahr: nur mit Aufsicht und korrekter Technik." },
      { id: "md", t: "Medikamente 08 Uhr prüfen und verteilen (Pramipexol pünktlich)", zeit: "07:50", warum: "Feste Zeitpunkte nach individuellem Plan." },
      { id: "l2", t: "Frau Albers: L-Dopa 10 Uhr pünktlich, mit Abstand zum Eiweiß", zeit: "10:00", warum: "Zeitkritisch." },
      { id: "lo", t: "Logopädie wegen Akzeptanz der Andickung und Anleitung der Ehefrau ansprechen", zeit: "10:30", warum: "Vor dem Besuch der Ehefrau zum Mittag." },
      { id: "mi", t: "Mittagessen Herr Pohl gemeinsam mit der Ehefrau (Anleitung)", zeit: "12:00", warum: "Angehörige lernen am besten in der echten Situation." },
      { id: "do", t: "Dokumentation, Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend, hier ergänzen." }
    ],
    live: [
      {
        k: "albersbild", typ: "hotspot", pat: "B", t: "Frau Albers · Bildbefund", kurzname: "Bildbefund Haut und Umgebung", clock: "06:15", max: 10,
        titel: "Frau Albers am frühen Morgen",
        intro: "06:15 Uhr. Frau Albers liegt steif auf dem Rücken, die Augen offen, die Stimme kaum hörbar: „Bitte … die Tablette.“",
        q: "Was fällt dir an Frau Albers und an ihrer Umgebung auf?",
        art: albersScene(),
        spots: [
          { c: [[302, 154, 16]], t: "Ferse rechts gerötet und aufliegend", d: "Rötung an der Ferse bei immobiler Patientin: Fingertest durchführen. Bleibt die Rötung, ist es ein Dekubitus Kategorie 1. Ferse sofort freilagern." },
          { c: [[138, 162, 22]], t: "Falten im Laken unter dem Rücken", d: "Falten erhöhen Druck und Scherkräfte. Laken glatt ziehen." },
          { c: [[150, 150, 18]], t: "Kabel des Pulsoxymeters unter dem Körper", d: "Kabel und Schläuche unter dem Körper verursachen Druckstellen, besonders bei Menschen, die sich nicht selbst bewegen können." },
          { c: [[24, 86, 20]], t: "Tabletten im Becher auf dem Nachttisch nicht eingenommen", d: "Die 06-Uhr-L-Dopa-Dosis steht unberührt da. Bei Parkinson ist das ein Medikationsfehler mit Folgen: Off-Phase. Medikamente werden unter Aufsicht eingenommen." },
          { c: [[236, 94, 26]], t: "Frühstück unberührt", d: "Im Off kann sie nicht essen. Ernährungszustand beobachten, Hilfe beim Essen, Eiweiß zeitlich von L-Dopa trennen." },
          { c: [[322, 74, 20]], t: "Getränk außer Reichweite", d: "Auf dem Fensterbrett erreicht sie das Glas nicht. Bei Fieber und Infekt ist eine ausreichende Trinkmenge besonders wichtig." }
        ],
        extra: ["Blasenkatheter abgeklemmt", "Bettgitter hochgestellt", "Hautausschlag am Arm", "Ödeme an den Beinen"],
        cap: "Tipp: Füße, Laken, Kabel, Nachttisch, Tablett, Fensterbrett.",
        merke: "Bei Menschen, die sich nicht bewegen können, entscheidet die Umgebung: Ferse, Laken, Kabel, Tablette, Becher. Alles muss zu ihr, nicht sie zu allem."
      },
      {
        k: "albersvit", typ: "vitmed", pat: "B", t: "Frau Albers · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Parkinson-Medikation", clock: "06:25", max: 12, wVit: 0.4,
        titel: "Vitalzeichen erheben und Medikamente prüfen",
        banner: { name: "Renate Albers", sub: "71 J. · Zimmer 606 · Parkinson, HWI", chips: [["Allergie: Sulfonamide", "red"], ["MCP kontraindiziert", "red"], ["L-Dopa 06-10-14-18", ""]] },
        intro: "Frau Albers flüstert: „Wo bin ich hier eigentlich? Ist das die Buchhandlung?“",
        uhr: "06:26",
        vit: {
          items: [
            { k: "bew", t: "Bewusstsein", kurz: "ACVPU", val: "C", einheit: "neu verwirrt", farbe: "bew", wie: "ansprechen", q: { text: "Sie wirkt verwirrt. Wie schätzt du das Bewusstsein ein?", opts: [
              { t: "Nach ACVPU: Sie ist wach, aber neu verwirrt („Confusion“). Das zählt im NEWS2 3 Punkte und ist bei Infekt ein Delir-Warnzeichen", ok: true, fb: "Richtig. Neue Verwirrtheit ist ein eigenständiger Alarmparameter." },
              { t: "Sie ist wach, also „A“", fb: "Nein: Neue Verwirrtheit wird als „C“ gewertet, auch wenn die Augen offen sind." },
              { t: "Bei Parkinson ist Verwirrtheit normal, das werte ich nicht", fb: "Gefährlich. Gestern war sie orientiert: neu ist neu." }] } },
            { k: "temp", t: "Temperatur", kurz: "Temp", val: "38,3", einheit: "°C", farbe: "temp", wie: "Ohr" },
            { k: "puls", t: "Puls", kurz: "HF", val: "96", einheit: "/min", farbe: "puls", wie: "tasten" },
            { k: "rr", t: "Blutdruck", kurz: "NIBP", val: "128/76", einheit: "mmHg liegend", farbe: "rr", wie: "Manschette", q: { text: "Wegen der orthostatischen Hypotonie: Wie misst du heute?", opts: [
              { t: "Zuerst liegend nach einigen Minuten Ruhe; vor der ersten Mobilisation zusätzlich im Sitzen bzw. Stehen nach 1 und 3 Minuten (Schellong nach Standard)", ok: true, fb: "Richtig. So erkennst du einen Abfall, bevor sie stürzt." },
              { t: "Nur im Stehen, dann sieht man das Problem", fb: "Ohne liegenden Ausgangswert kein Vergleich, und im Off kann sie nicht stehen." },
              { t: "Messung ist egal, sie bleibt ja liegen", fb: "Orthostase zeigt sich bei der Mobilisation, die heute ansteht." }] } },
            { k: "af", t: "Atemfrequenz", kurz: "AF", val: "18", einheit: "/min", farbe: "af", wie: "zählen" },
            { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "95", einheit: "% Raumluft", farbe: "spo2", wie: "Clip" }
          ],
          befund: "Rigor ausgeprägt, Sprache sehr leise, kann die Hand nicht zur Klingel führen. Urin trüb, übelriechend.",
          news: { wert: 6, tol: 0, frage: "Berechne den NEWS2-Score (Skala 1).", erk: "AF 18 = 0 · SpO₂ 95 % = 1 · Raumluft = 0 · RR syst. 128 = 0 · Puls 96 = 1 · neue Verwirrtheit (C) = 3 · Temp 38,3 = 1. Summe 6: dringende ärztliche Beurteilung. Schon die neue Verwirrtheit allein (3 Punkte in einem Parameter) verlangt eine zeitnahe Reaktion." },
          act: { text: "Was tust du jetzt?", opts: [
            { t: "Arzt dringend informieren (NEWS2 erhöht, neue Verwirrtheit, Fieber, versäumte L-Dopa-Dosis), engmaschig überwachen, Klingel in die Hand, Getränk erreichbar, Ferse freilagern", ok: true, fb: "Richtig. Ab NEWS2 5 ist eine dringende ärztliche Beurteilung nötig, und mehrere Probleme werden zugleich gelöst." },
            { t: "Die 06-Uhr-Tablette jetzt einfach mit der 10-Uhr-Dosis zusammen geben", fb: "Doppelte Dosis ohne Rücksprache ist eigenmächtig und kann Überbewegungen und Verwirrtheit auslösen." },
            { t: "Ihr Ruhe lassen, die Verwirrtheit kommt vom Schlaf", fb: "Neue Verwirrtheit bei Fieber ist ein Delir-Warnzeichen." },
            { t: "MCP gegen die Übelkeit geben, damit sie die Tablette behält", fb: "MCP ist bei Parkinson kontraindiziert (Dopaminantagonist)." }] }
        },
        med: {
          zeit: "08:00", allergie: "Sulfonamide",
          hinweis: "06:40 Uhr, Dr. Brandt: „06-Uhr-L-Dopa jetzt sofort nachgeben, 10 Uhr dann regulär. Gegen den Infekt Pivmecillinam wie angeordnet. Bei Übelkeit Domperidon, auf keinen Fall MCP.“ Die Anordnung steht schriftlich in der Kurve.",
          plan: [
            { n: "L-Dopa/Benserazid", d: "100/25 mg", z: "06-10-14-18", h: "zeitkritisch, Abstand zu Eiweiß" },
            { n: "L-Dopa/Benserazid ret.", d: "200/50 mg", z: "22 Uhr", h: "nicht teilen" },
            { n: "Pramipexol", d: "0,18 mg", z: "08-13-18", h: "" },
            { n: "Macrogol", d: "1 Beutel", z: "1-0-0", h: "in 125 ml Wasser" },
            { n: "Pivmecillinam", d: "400 mg", z: "08-14-22", h: "neu seit gestern" },
            { n: "Domperidon", d: "10 mg", z: "bei Bedarf", h: "max. 3×/Tag" },
            { n: "Metoclopramid (MCP)", d: "–", z: "–", h: "KONTRAINDIZIERT", aus: true }
          ],
          disp: [
            { n: "Pramipexol 0,18 mg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "ok", fb: "Angeordnet für 08 Uhr." },
            { n: "Macrogol", sub: "1 Beutel", pill: { c: "#f1f5f9", s: "saft" }, r: "ok", fb: "Angeordnet, in ausreichend Wasser auflösen." },
            { n: "Metoclopramid 10 mg", sub: "1 Tablette „gegen Übelkeit“", pill: { c: "#fef3c7", s: "round" }, r: "ki", fb: "MCP blockiert Dopamin im Gehirn und kann eine schwere akinetische Krise auslösen. Kontraindiziert, entfernen, Domperidon nach Anordnung." },
            { n: "L-Dopa/Benserazid ret. 200/50 mg", sub: "1 Retardkapsel", pill: { c: "#93c5fd", c2: "#bfdbfe", s: "kapsel" }, r: "zeit", fb: "Die Retardform ist für 22 Uhr angeordnet. Morgens wirkt sie zu langsam, und die Gesamtdosis würde überschritten." },
            { n: "Cotrimoxazol 960 mg", sub: "1 Tablette „Antibiose HWI“", pill: { c: "#ffffff", s: "oval" }, r: "allergie", fb: "Cotrimoxazol enthält ein Sulfonamid. Angeordnet ist Pivmecillinam. Entfernen, melden." }
          ],
          fehlt: { text: "Was fehlt im 08-Uhr-Dispenser? (Mehrfachauswahl)", opts: [
            { t: "Pivmecillinam 400 mg", ok: true, fb: "Das angeordnete Antibiotikum fehlt, stattdessen lag Cotrimoxazol im Fach." },
            { t: "L-Dopa/Benserazid 100/25 mg (nachzugebende 06-Uhr-Dosis)", ok: true, fb: "Wurde um 06:40 sofort gegeben; gehört nicht ins 08-Uhr-Fach, aber du prüfst, dass sie tatsächlich eingenommen wurde." },
            { t: "Domperidon 10 mg", ok: false, fb: "Bedarfsmedikation, nur bei Übelkeit." }] }
        },
        final: { text: "Die 06-Uhr-Tablette stand unbeaufsichtigt auf dem Nachttisch. Was folgt daraus für dich?", opts: [
          { t: "Medikamente gebe ich direkt und schaue zu, bis sie eingenommen sind. Kann sie nicht schlucken oder schläft, kläre ich das ärztlich. Den Vorfall dokumentiere ich und spreche ihn im Team an", ok: true, fb: "Richtig. „Gerichtet und hingestellt“ ist nicht „gegeben“." },
          { t: "Nichts, das ist Aufgabe des Nachtdienstes", fb: "Sicherheitslücken sind Teamthema, und du übernimmst ab jetzt." },
          { t: "Künftig alle Tabletten für den Tag morgens hinstellen, dann kann sie selbst einnehmen", fb: "Im Off kann sie gerade das nicht." }] },
        merke: "Parkinson-Medikamente sind zeitkritisch. MCP und Haloperidol sind tabu. Und eine Tablette auf dem Nachttisch ist keine gegebene Tablette."
      },
      {
        k: "dysphagie", typ: "steps", pat: "A", t: "Herr Pohl · Essen anreichen", kurzname: "Essen anreichen bei Dysphagie", clock: "07:30", max: 18,
        titel: "Unterstützung bei der Nahrungsaufnahme bei Dysphagie",
        icon: "M7 3v8a3 3 0 0 0 6 0V3M10 3v18M17 3c-2 0-3 3-3 7s1 4 3 4v7",
        banner: { name: "Gerhard Pohl", sub: "79 J. · Zimmer 604 · Mediainfarkt li., Hemiparese re., Aphasie", chips: [["Dysphagie: IDDSI 4 / Getränke IDDSI 2", "red"], ["hört links schlecht", ""], ["nur unter Aufsicht", ""]] },
        intro: "07:30 Uhr, Frühstück. Herr Pohl sitzt im Stuhl am Bett. Laut Logopädie: Kost IDDSI 4 (püriert), Getränke IDDSI 2 (leicht angedickt), Essen nur unter Aufsicht. Er zeigt auf das Tablett und schüttelt den Kopf.",
        ko: ["Dünnflüssige Getränke geben", "Weiter anreichen trotz Aspirationszeichen (nasse Stimme, Husten)", "Anreichen im Liegen oder mit nach hinten geneigtem Kopf (Schnabelbecher)", "Anreichen bei schläfrigem, nicht wachem Patienten"],
        merke: "Wach, aufrecht, Kinn leicht vorn, kleine Portionen, nachschlucken. Bei nasser Stimme: Stopp. Und nach dem Essen schaut die Pflege in den Mund.",
        steps: [
          { t: "Kostform prüfen", ph: "vor", img: "kost", q: "Womit beginnst du?", opts: [
            { t: "Kostform und Konsistenz auf dem Tablett mit der Anordnung der Logopädie vergleichen: Brei IDDSI 4, Getränk IDDSI 2", ok: true, fb: "Richtig. Ein falsches Tablett ist der häufigste Weg zur Aspiration." },
            { t: "Das Tablett nehmen, das die Küche geschickt hat; die wissen das ja", fb: "Küche und Station können sich irren. Du prüfst." },
            { t: "Ihm erst mal einen Schluck Wasser geben, damit der Mund feucht ist", ko: true, fb: "Kritisch: Dünnflüssiges Wasser ist bei seiner Dysphagie das größte Aspirationsrisiko." }
          ] },
          { t: "Voraussetzungen", ph: "vor", img: "vorb", q: "Was prüfst du, bevor er isst?", opts: [
            { t: "Er ist wach und aufmerksam, Zahnprothese sitzt, Mund ist frei, Hörgerät/Brille da; Absaugung ist nach Standard griffbereit; Händehygiene", ok: true, fb: "Richtig. Schläfrigkeit verdoppelt das Aspirationsrisiko." },
            { t: "Ob er Hunger hat, mehr nicht", fb: "Hunger ist schön, Wachheit ist Voraussetzung." },
            { t: "Ich gebe ihm Essen auch im Halbschlaf, Hauptsache er isst etwas", ko: true, fb: "Kritisch: Wer nicht wach ist, schluckt nicht sicher." }
          ] },
          { t: "Sitzposition", ph: "vor", img: "sitz", q: "Wie positionierst du Herrn Pohl?", opts: [
            { t: "Aufrecht im Stuhl, Hüfte und Rücken bei etwa 90°, Füße auf dem Boden, rechter Arm auf dem Tisch abgelegt, Kinn leicht in Richtung Brust", ok: true, fb: "Richtig. Die leichte Kopfbeugung schützt die Atemwege beim Schlucken." },
            { t: "Halb liegend im Bett mit 30° Oberkörperhochlage", ko: true, fb: "Kritisch: In halb liegender Position läuft Nahrung leichter in die Atemwege." },
            { t: "Kopf leicht nach hinten, dann rutscht es besser", fb: "Reklination öffnet den Atemweg und erhöht die Aspirationsgefahr." }
          ] },
          { t: "Deine Position", ph: "vor", img: "nah", q: "Wo setzt du dich hin?", opts: [
            { t: "Auf Augenhöhe, ihm zugewandt, sodass er dich und das Essen sieht; ich spreche von rechts, weil er links schlecht hört", ok: true, fb: "Richtig. Von oben anreichen zwingt den Kopf nach hinten, und Augenhöhe ist auch Respekt." },
            { t: "Ich stehe neben ihm, dann bin ich schneller", fb: "Von oben neigt er den Kopf nach hinten. Und es wirkt wie Abfertigung." },
            { t: "Ich stelle mich hinter ihn und führe den Löffel über die Schulter", fb: "Er sieht nicht, was kommt, und kann sich nicht vorbereiten." }
          ] },
          { t: "Selbstständigkeit", ph: "durch", img: "nah", q: "Herr Pohl zeigt mit der linken Hand auf den Löffel. Wie gehst du vor?", opts: [
            { t: "Er isst selbst mit links, ich stelle Antirutschmatte und Teller mit Rand bereit und unterstütze nur so viel wie nötig", ok: true, fb: "Richtig. Selbst essen gibt Kontrolle über Tempo und Menge und fördert die Wahrnehmung." },
            { t: "Ich reiche alles an, das geht schneller und sauberer", fb: "Übernimmt Ressourcen, die er hat, und nimmt ihm Würde." },
            { t: "Er soll mit der rechten Hand üben, damit sie wieder wird", fb: "Beim Essen geht Sicherheit vor Training. Die Hand wird in der Therapie geübt." }
          ] },
          { t: "Portion und Tempo", ph: "durch", img: "loeffel", q: "Wie viel und wie schnell?", opts: [
            { t: "Teelöffelgroße Portionen eher auf die linke, nicht betroffene Zungenseite; abwarten, bis geschluckt ist, zum Nachschlucken auffordern, Kehlkopfhebung beobachten; nicht sprechen lassen, während er schluckt", ok: true, fb: "Richtig. Kleine Mengen, Zeit, Kontrolle." },
            { t: "Esslöffelgroße Portionen, dann ist er schneller satt", fb: "Große Bissen überfordern die gestörte Schluckfunktion." },
            { t: "Zwischendurch Fragen stellen, damit er sich nicht langweilt", fb: "Sprechen beim Schlucken öffnet den Kehlkopf. Gespräch in den Pausen." }
          ] },
          { t: "Ereignis", ph: "durch", img: "nass", q: "Nach dem vierten Löffel klingt seine Stimme beim „Mhm“ gurgelnd, er hüstelt. Was tust du?", opts: [
            { t: "Sofort stoppen, ihn auffordern zu räuspern bzw. kräftig zu husten und nachzuschlucken; erst weiter, wenn die Stimme wieder klar ist; Beobachtung dokumentieren und Logopädie informieren", ok: true, fb: "Richtig. Nasse Stimme heißt: Es liegt etwas auf den Stimmlippen." },
            { t: "Weiter anreichen, Husten ist doch gut", ko: true, fb: "Kritisch: Husten zeigt, dass etwas in die Atemwege gelangt ist. Weiterreichen erhöht das Aspirationsrisiko." },
            { t: "Ihm schnell ein Glas Wasser zum Nachspülen geben", ko: true, fb: "Kritisch: Dünnflüssiges Wasser verschärft die Aspiration." },
            { t: "Auf den Rücken klopfen", fb: "Hilft nicht beim Abhusten und kann Nahrung tiefer befördern." }
          ] },
          { t: "Trinken", ph: "durch", img: "becher", q: "Herr Pohl will trinken. Womit?", opts: [
            { t: "Leicht angedicktes Getränk (IDDSI 2) im Becher mit Nasenausschnitt, kleine Schlucke, Kopf bleibt leicht nach vorn", ok: true, fb: "Richtig. Der Nasenausschnitt verhindert, dass er den Kopf nach hinten neigen muss." },
            { t: "Schnabelbecher, da läuft nichts daneben", ko: true, fb: "Kritisch: Beim Schnabelbecher legt man den Kopf in den Nacken, und die Flüssigkeit schießt unkontrolliert nach hinten." },
            { t: "Mit dem Strohhalm, das fördert die Mundmotorik", fb: "Mit dem Strohhalm sind die Mengen schwer zu steuern. Nur nach Logopädie." }
          ] },
          { t: "Akzeptanz", ph: "durch", img: "becher", q: "Er schiebt das angedickte Getränk weg und macht eine angeekelte Geste.", opts: [
            { t: "Ich frage mit Ja/Nein-Fragen nach dem Grund (Geschmack? Konsistenz? Temperatur?), biete eine andere Geschmacksrichtung an und gebe die Ablehnung an die Logopädie weiter", ok: true, fb: "Richtig. Ja/Nein-Fragen passen zur motorischen Aphasie." },
            { t: "Ich verdünne es ein bisschen mit Wasser, dann schmeckt es besser", ko: true, fb: "Kritisch: Damit ist die angeordnete Konsistenz nicht mehr sicher." },
            { t: "Ich erkläre ihm streng, dass er sonst eine Lungenentzündung bekommt", fb: "Druck ersetzt keine Ursachensuche. Erklärungen ja, Drohungen nein." }
          ] },
          { t: "Nach dem Essen", ph: "nach", img: "wange", q: "Er hat eine halbe Portion gegessen. Was kontrollierst du jetzt?", opts: [
            { t: "Mundinspektion, besonders die rechte Wangentasche: Reste entfernen, Mundpflege, Prothese reinigen", ok: true, fb: "Richtig. Auf der gelähmten Seite spürt er Reste nicht, sie können später aspiriert werden." },
            { t: "Nichts, er hat ja geschluckt", fb: "Reste in der Wange werden oft erst später verschluckt oder aspiriert." },
            { t: "Ihn direkt hinlegen, damit er sich ausruhen kann", fb: "Zu früh. Nach dem Essen 30 Minuten aufrecht." }
          ] },
          { t: "Nachbereitung", ph: "nach", img: "nach", q: "Und dann?", opts: [
            { t: "30 Minuten aufrecht sitzen lassen, Klingel auf der linken Seite erreichbar, Ess- und Trinkmenge erfassen", ok: true, fb: "Richtig. Die nicht betroffene Seite für die Klingel." },
            { t: "Klingel rechts hinlegen, damit er die rechte Hand benutzt", fb: "Rechts kann er sie nicht sicher bedienen. Sicherheit vor Training." },
            { t: "Hinlegen und Fenster öffnen", fb: "Aufrecht bleiben schützt vor Rückfluss und Aspiration." }
          ] },
          { t: "Dokumentation", ph: "nach", img: "doku", q: "Was dokumentierst du?", opts: [
            { t: "Kostform, gegessene und getrunkene Menge, Dauer, Hilfebedarf, Aspirationszeichen mit Zeitpunkt und Reaktion, Wangentasche, Information an Logopädie", ok: true, fb: "Richtig. So kann die Logopädie die Kostform anpassen." },
            { t: "„Hat gegessen.“", fb: "Ohne Menge und Auffälligkeiten nicht verwertbar." },
            { t: "Den Husten weglassen, sonst bekommt er noch strengere Kost", fb: "Verschweigen gefährdet ihn." }
          ] }
        ],
        art: dys
      }
    ],
    st: {
      clock: "10:30", titel: "Krampfanfall in Zimmer 608",
      situation: "10:30 Uhr. Aus Zimmer 608 hörst du einen Schrei und ein Poltern. Frau Kessler (34, Epilepsie, Patientin deiner Kollegin) liegt neben dem Bett und krampft am ganzen Körper. Gleichzeitig kommt Frau Pohl mit einer Thermoskanne Hühnersuppe den Flur entlang: „Ich geb ihm schnell was Warmes, ja?“",
      order: [
        { id: "a", t: "Zu Frau Kessler: Uhrzeit merken, Verletzungen verhindern (Gegenstände weg, Kopf polstern), nicht festhalten, nichts in den Mund, Notruf auslösen", warum: "Schutz vor Verletzung und Dauer des Anfalls sind entscheidend." },
        { id: "b", t: "Arzt sofort informieren; bei über 5 Minuten Anfallsdauer Notfallmedikation durch den Arzt", warum: "Ein Anfall über 5 Minuten gilt als Status epilepticus." },
        { id: "c", t: "Nach dem Anfall: stabile Seitenlage, Atemwege frei, Vitalzeichen, SpO₂, bei ihr bleiben", warum: "Nachphase mit Bewusstseinsstörung: Aspirationsgefahr." },
        { id: "d", t: "Kollegin oder Praxisanleitung bitten, Frau Pohl freundlich aufzuhalten: Suppe erst nach Rücksprache und angedickt", warum: "Aspirationsgefahr bei Herrn Pohl, aber nicht vor dem Krampfanfall." },
        { id: "e", t: "Frau Pohl erklären, warum Suppe angedickt werden muss, und das Mittagessen gemeinsam planen", warum: "Angehörige gewinnen statt verbieten." },
        { id: "f", t: "Anfall genau dokumentieren (Beginn, Dauer, Ablauf, Bewusstsein, Einnässen, Zungenbiss, Nachphase)", warum: "Die Anfallsbeobachtung ist für Diagnostik und Therapie zentral." }
      ],
      mc: { text: "Was gehört in die Anfallsbeobachtung? (Mehrfachauswahl)", opts: [
        { t: "Uhrzeit Beginn und Ende, Dauer", ok: true, fb: "Zentral für die Einschätzung eines Status." },
        { t: "Ablauf: Wo begann es, Seitenbetonung, Augen- und Kopfwendung", ok: true, fb: "Hinweis auf den Ursprung im Gehirn." },
        { t: "Bewusstsein, Einnässen, Zungenbiss, Verletzungen", ok: true, fb: "Begleitzeichen." },
        { t: "Nachphase: Orientierung, Lähmungen, Dauer bis zur Erholung", ok: true, fb: "Wichtig für die Beurteilung." },
        { t: "Gummikeil zwischen die Zähne schieben, um einen Zungenbiss zu verhindern", ok: false, fb: "Gefährlich: Verletzung von Zähnen und Fingern, Aspiration." },
        { t: "Arme und Beine festhalten, damit sie sich nicht verletzt", ok: false, fb: "Festhalten kann zu Frakturen und Luxationen führen." }
      ] },
      merke: "Beim Krampfanfall: Zeit, Schutz, nicht festhalten, nichts in den Mund. Und Angehörige gewinnt man durch Erklären, nicht durch Verbieten."
    },
    doku: {
      clock: "11:15",
      auftrag: "Schreibe den Pflegebericht zu Herrn Pohl für das Frühstück 07:30 bis 08:10 Uhr.",
      muster: "07:30 Pat. wach, aufmerksam, im Stuhl 90° sitzend, Kinn leicht gesenkt. Kostform kontrolliert: IDDSI 4, Getränk IDDSI 2. Isst selbst mit links (Antirutschmatte), Unterstützung beim Führen des Löffels. 07:38 nach 4. Löffel Stimme gurgelnd, Hüsteln; Pause, zum Räuspern und Nachschlucken aufgefordert, Stimme danach klar. Weiter in kleinen Portionen ohne erneute Aspirationszeichen. Angedicktes Getränk abgelehnt (Ekel-Geste); über Ja/Nein-Fragen: Geschmack. Andere Sorte angeboten, 150 ml getrunken. Gesamt ½ Portion. 08:05 Mundinspektion: Reste in der re. Wangentasche entfernt, Mundpflege, Prothese gereinigt. Bleibt bis 08:40 aufrecht, Klingel links. Logopädie informiert (Aspirationszeichen, Ablehnung Andickung). [Name, Handzeichen]",
      chk: [
        { t: "Uhrzeiten", kw: ["07:", "08:"] },
        { t: "Position und Kostform", kw: ["90", "iddsi", "aufrecht"] },
        { t: "Aspirationszeichen mit Reaktion", kw: ["gurgel", "nass", "hüstel", "husten", "pause"] },
        { t: "Mengen (Essen/Trinken)", kw: ["ml", "portion"] },
        { t: "Wangentasche/Mundpflege", kw: ["wange", "mundpflege", "mundinspektion"] },
        { t: "Information an Logopädie", kw: ["logopäd"] },
        { t: "Objektiv, Name/Handzeichen", kw: ["handzeichen", "hz"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "07:38 nach 4. Löffel Stimme gurgelnd, Pause, Stimme danach klar.", bad: false, fb: "In Ordnung." },
          { t: "Pat. stur, will nicht trinken.", bad: true, fb: "Wertend. Richtig: Ablehnung beschreiben und den Grund erfragen." },
          { t: "Hat gut gegessen.", bad: true, fb: "Unbestimmt. Menge angeben." },
          { t: "Kostform IDDSI 4, Getränk IDDSI 2 kontrolliert.", bad: false, fb: "In Ordnung." },
          { t: "Ehefrau gibt ihm wieder Wasser, nervig.", bad: true, fb: "Wertend und ohne Konsequenz. Richtig: Beobachtung, Gespräch, Anleitung dokumentieren." },
          { t: "08:05 Reste re. Wangentasche entfernt, Mundpflege.", bad: false, fb: "In Ordnung." },
          { t: "Aspiration eher unwahrscheinlich.", bad: true, fb: "Vermutung ohne Grundlage. Beobachtungen beschreiben, nicht bewerten." },
          { t: "Nachtrag 09:00 zu 08:10: Logopädie informiert. O. L.", bad: false, fb: "In Ordnung, korrekt gekennzeichnet." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst (Pflegefachkraft Aylin Kaya).",
      muster: "Herr Pohl, 604: Mediainfarkt li. Tag 4, Dysphagie. Frühstück mit einmaligen Aspirationszeichen (Stimme nass), danach ohne. Mittag zusammen mit Ehefrau: Sie hat das Andicken der Suppe mit der Logopädin gelernt und gibt kein Wasser mehr. Trinkmenge bis 13 Uhr 650 ml angedickt, neue Geschmacksrichtung akzeptiert. Nach jeder Mahlzeit rechte Wangentasche kontrollieren. Kommunikation über Ja/Nein und Bildtafel, von rechts ansprechen.\n\nFrau Albers, 606: Parkinson, HWI, Fieber 38,3. Neu verwirrt, NEWS2 6, Arzt informiert, Delir-Screening angeordnet. 06-Uhr-L-Dopa war nicht eingenommen, um 06:40 nachgegeben, 10 Uhr pünktlich. Im Dispenser waren MCP (kontraindiziert), Cotrimoxazol (Sulfonamid-Allergie) und die Retardform statt der 08-Uhr-Medikation, alles entfernt und gemeldet. Pivmecillinam 08 Uhr gegeben. Ferse re. Kategorie 1, freigelagert, Bewegungsplan 2-stündlich. Nächste L-Dopa 14 Uhr und 18 Uhr pünktlich, nur unter Aufsicht einnehmen lassen.",
      chk: [
        { t: "Beide Patienten mit aktuellem Zustand", kw: ["604", "606", "pohl", "albers"] },
        { t: "Offene Aufgaben mit Uhrzeit (L-Dopa 14/18 Uhr, Wangentasche, Bewegungsplan)", kw: ["14", "18", "wange", "bewegungsplan"] },
        { t: "Sicherheitsrelevantes (MCP, Allergie, Aspiration)", kw: ["mcp", "sulfonamid", "aspir", "allergi"] }
      ]
    },
    refl: [
      { q: "Warum hast du Herrn Pohl nach dem Hüsteln nicht einfach weiter Essen angereicht?", muster: "Eine gurgelnde, nasse Stimme und Husten sind Aspirationszeichen: Es liegt Nahrung im Kehlkopfbereich. Weiteranreichen hätte das Risiko einer Aspirationspneumonie erhöht. Ich habe gestoppt, ihn räuspern und nachschlucken lassen und erst bei klarer Stimme in kleineren Portionen weitergemacht. Weil er stille Aspirationen haben kann, habe ich die Logopädie informiert und den Mund kontrolliert." },
      { q: "Was machte die Medikation bei Frau Albers so fehleranfällig, und wie hast du das abgesichert?", muster: "Parkinson-Medikamente sind zeitkritisch, Retard- und Schnellformen sehen ähnlich aus, und viele übliche Medikamente wie MCP sind kontraindiziert. Dazu kommt die Sulfonamid-Allergie beim Antibiotikum. Ich habe jedes Arzneimittel gegen die aktuelle Anordnung und die Allergien geprüft, die versäumte Dosis ärztlich geklärt und darauf geachtet, dass sie die Tabletten unter Aufsicht einnimmt." },
      { q: "Wie hast du die Kommunikation mit Herrn Pohl gestaltet, obwohl er nicht sprechen kann?", muster: "Er versteht, kann aber nicht sprechen. Deshalb habe ich auf Augenhöhe und von rechts gesprochen, kurze Sätze und Ja/Nein-Fragen genutzt und ihm Zeit gelassen. Beim Getränk habe ich über Ja/Nein herausgefunden, dass es am Geschmack lag. Sein Stolz war mir wichtig: Er hat selbst mit links gegessen, ich habe nur unterstützt." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
