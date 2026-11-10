/* ===== Fall 4: Unfallchirurgie und Orthopädie ===== */
(function () {
  var A = window.PXA; if (!A) return;

  function staples(x0, x1, y) { var s = ""; for (var x = x0 + 8; x < x1 - 4; x += 16) s += A.p("M" + x + " " + (y - 7) + "v14", "h-stp"); return s; }
  function hip(extra) {
    return A.table() + A.p("M0 70C90 40 230 40 330 60c40 8 70 30 70 60v160H0z", "h-skin") + A.e(220, 110, 110, 46, "h-soft") + (extra || "");
  }
  var WX0 = 130, WX1 = 290, WY = 120;
  function wound(serous, red) {
    return (red ? A.e(210, WY, 100, 24, "x-redskin") : "") + A.p("M" + WX0 + " " + WY + "H" + WX1, "h-cut") + staples(WX0, WX1, WY) + (serous ? A.e(WX1 - 6, WY + 8, 7, 5, "x-wet") : "");
  }
  function dressing(stain, label) { return A.r(110, 92, 200, 58, 8, "h-gauze") + A.r(124, 102, 172, 38, 4, "x-film") + (stain ? A.e(276, 128, 22, 12, "x-wet") : "") + (label ? A.r(122, 80, 92, 18, 4, "x-label") + A.t(168, 93, label, "x-txt x-s") : ""); }
  function setTray() {
    return A.table() + A.drape(30, 30, 340, 160) + A.p("M70 70l90 20M70 80l90 10", "x-metall") + A.t(116, 112, "2 sterile Pinzetten", "x-txt x-s") +
      A.gauze(190, 56, 46, 36) + A.gauze(246, 56, 46, 36) + A.t(268, 106, "Kompressen", "x-txt x-s") +
      A.r(196, 124, 16, 40, 5, "x-aqua") + A.r(218, 124, 16, 40, 5, "x-aqua") + A.t(216, 178, "NaCl 0,9 %", "x-txt x-s") +
      A.r(270, 124, 80, 50, 6, "x-pack2") + A.t(310, 152, "Wundauflage", "x-txt x-s") + A.tag(120, 230, "kein PVP-Iod (Jodallergie)", "x-tag x-tagr") + A.tag(290, 230, "Non-Touch", "x-tag x-tagg");
  }
  var vw = {
    vorb: A.table() + A.r(60, 30, 280, 200, 8, "x-board") + A.r(74, 44, 252, 176, 4, "x-paper") + A.t(90, 68, "Frau Vogt · Zi. 211", "x-txt x-b", "start") +
      ["Hüft-TEP re. (dorsal) · Tag 3", "Verband durchfeuchtet 06:00", "Allergie: Jod (PVP-Iod)", "Analgesie 07:30 gegeben", "VW nach Standard aseptisch"].map(function (l, i) { return (i === 2 ? A.r(84, 80 + i * 26, 232, 21, 4, "x-hl") : "") + A.t(90, 95 + i * 26, l, "x-txt x-s", "start"); }).join(""),
    lager: A.room() + A.r(30, 140, 340, 24, 8, "x-mattress") + A.bedSide(24, 162, 352) + A.r(30, 118, 70, 26, 12, "h-pill") + A.head(70, 114, 17, "x-hairg") + A.r(86, 120, 120, 26, 12, "x-gown") +
      A.r(204, 118, 150, 14, 7, "x-legs") + A.r(204, 136, 150, 14, 7, "x-legs") + A.p("M220 130l110 0", "x-wrinkle") + A.r(230, 128, 90, 10, 5, "x-ice") + A.tag(270, 96, "Abduktionskissen", "x-tag x-tagg") + A.tag(140, 230, "keine Innenrotation · keine Adduktion", "x-tag"),
    set: setTray(),
    alt: hip(dressing(true, "08.11. 07:00")) + A.glove(300, 40, 0.8, "x-glove") + A.tag(200, 230, "Sekret: serös, gelblich, 4 × 3 cm", "x-tag"),
    wunde: hip(wound(true, false)) + A.tag(200, 230, "Wundränder adaptiert · Klammern reizlos", "x-tag x-tagg"),
    clean: hip(wound(true, false) + A.p("M200 104c30-20 60-20 80-6", "x-arrow") + A.c(286, 98, 12, "x-swab") + A.p("M298 92l50-40", "x-metall")) + A.tag(200, 230, "von innen nach außen · jede Kompresse einmal", "x-tag"),
    fall: A.room() + A.r(30, 140, 340, 24, 8, "x-blanket") + A.c(220, 150, 12, "x-swab") + A.cross(250, 120) + A.tag(200, 230, "unsteril → verwerfen", "x-tag x-tagr"),
    neu: hip(dressing(false, "08.11. 07:50")) + A.tick(340, 70) + A.tag(200, 230, "2–3 cm Überstand · Datum", "x-tag x-tagg"),
    doku: A.table() + A.r(60, 20, 280, 230, 8, "x-board") + A.r(74, 34, 252, 206, 4, "x-paper") + A.t(90, 58, "Wunddokumentation 07:55", "x-txt x-b", "start") +
      ["Hüfte re. lateral, 16 cm, 10 Klammern", "Ränder adaptiert, reizlos, kein Hämatom", "unterer Pol: wenig serös, geruchlos", "NaCl 0,9 %, sterile Wundauflage", "Schmerz bei VW NRS 2 (nach Analgesie)", "nächster VW bei Bedarf · HZ"].map(function (l, i) { return A.t(90, 86 + i * 25, l, "x-txt x-s", "start"); }).join("") + A.tick(300, 226)
  };

  function langeScene() {
    var s = A.room() + A.r(300, 26, 70, 60, 4, "h-win") + A.p("M335 26v60M300 56h70", "h-line");
    s += A.r(20, 150, 290, 24, 8, "x-mattress") + A.bedSide(14, 172, 302) + A.r(20, 128, 70, 26, 12, "h-pill") + A.head(58, 122, 18, "x-hairb") + A.face(58, 124) + A.r(76, 130, 100, 26, 12, "x-shirt");
    s += A.r(170, 140, 120, 14, 7, "x-legs") + A.e(296, 146, 10, 9, "h-skin");
    s += A.e(204, 124, 30, 10, "h-pill") + A.e(208, 110, 30, 10, "h-pill") + A.e(212, 96, 30, 10, "h-pill");
    s += A.p("M168 128l120-62", "x-legsl") + A.p("M176 116l104-54", "x-cast") + A.r(186, 84, 90, 26, 10, "x-bind", ' transform="rotate(-28 230 97)"') + A.p("M180 120l12-6", "x-bindcut");
    s += A.c(300, 58, 15, "x-toes") + A.c(296, 46, 6, "x-toes") + A.c(306, 48, 5, "x-toes") + A.c(312, 54, 5, "x-toes") + A.r(286, 34, 28, 18, 6, "x-ice");
    s += A.r(330, 150, 56, 64, 6, "x-chair") + A.r(338, 136, 26, 14, 3, "x-cig") + A.t(351, 147, "Kippen", "x-txt x-s") + A.r(366, 138, 8, 12, 2, "x-red");
    return s;
  }

  var C = {
    id: "unfall", titel: "Hüfte, Schiene und Krücken", station: "Unfallchirurgie & Orthopädie · Station 2C", haus: "Kreisklinikum Wiesental", farbe: "#D97706",
    icon: "M8 3l3 6-3 6 3 6M16 3l-3 6 3 6-3 6",
    kurz: "Eine resolute Ex-Hebamme mit frischer Hüftprothese, ein cooler Dachdecker, dessen Bein im Gips „wie Beton“ wird, und eine Schulleiterin, die vor der Entlassung alles genau wissen will.",
    anleitung: "Tanja Brückner", pruefer: "Herr Demir",
    briefing: [
      "Willkommen auf der 2C, ich bin Tanja Brückner. Herr Demir aus der Pflegeschule prüft morgen mit. Bei uns liegen Menschen mit Frakturen, Prothesen und Sportverletzungen. Das heißt: Wunden, Schienen und Gipse, Mobilisation, Schmerz, Thromboseprophylaxe und Entlassungsberatung.",
      "Deine drei Menschen: Frau Vogt mit neuer Hüfte, Herr Lange mit operiertem Unterschenkel in der Schiene und Frau Nowak, die morgen nach ihrer Knieprothese nach Hause geht.",
      "Merk dir eins für die ganze Station: Bei jedem Menschen mit Gips oder Schiene prüfst du Durchblutung, Motorik und Sensibilität. Und ein Schmerz, der trotz Opioid nicht besser wird, ist kein Charakterzug, sondern ein Befund."
    ],
    order: ["A", "B", "C"],
    pat: {
      A: {
        key: "A", name: "Marlene Vogt", kurz: "Frau Vogt", alter: 77, zimmer: "211", modus: "Pflegehandlung", farbe: "#D97706",
        typ: "Ehemalige Hebamme, resolut und selbstständig, spielt Schmerzen herunter, erzählt gern von früher.",
        diagnose: "Mediale Schenkelhalsfraktur rechts nach Sturz, Hüft-Totalendoprothese rechts (dorsaler Zugang); Tag 3.",
        daten: [
          ["Vorerkrankungen", "Osteoporose, arterielle Hypertonie, Herzinsuffizienz NYHA I"],
          ["Allergien", "Jod (Povidon-Iod: Kontaktekzem)"],
          ["Soziales", "verwitwet, lebt mit Hund im Erdgeschoss, Nachbarin versorgt den Hund"],
          ["Medikation", "Metamizol 1 g 1-1-1-1 · Tilidin/Naloxon ret. 50/4 mg 1-0-1 · Enoxaparin 40 mg s.c. 18 Uhr · Ramipril 5 mg · Alendronsäure wöchentlich · Calcium/Vitamin D"],
          ["Vitalwerte Tag 1, 15 Uhr", "RR 138/80 mmHg · HF 78/min · T 37,4 °C · Schmerz NRS 3 in Ruhe, 6 bei Bewegung"],
          ["Mobilisation", "Vollbelastung erlaubt; Luxationsprophylaxe: keine Beugung > 90°, keine Innenrotation, keine Adduktion"]
        ],
        anamnese: "Na, Sie sind ja ein junges Ding. Ich hab 42 Jahre Kinder auf die Welt geholt, da war ich nicht zimperlich, und jetzt bin ich es auch nicht. Gestürzt bin ich über meinen eigenen Hund, der Herr Bello lag im Flur. Die Nachbarin füttert ihn jetzt, aber der frisst bei ihr nicht richtig. Der Verband hier an der Hüfte ist heute Nacht nass geworden, gelblich, das sieht aus wie Wundwasser, kenn ich von den Kaiserschnitten. Schmerzen? Nur wenn ich mich drehe, aber das ist normal. Ich will mich nachts auf die Seite legen, ich kann auf dem Rücken nicht schlafen, aber man hat mir was erzählt von Bein überschlagen und so, das hab ich nicht ganz verstanden. Ach, und dieses braune Jod-Zeug, das vertrag ich nicht, da krieg ich Ausschlag. Die Spritze abends in den Bauch kann ich selbst, hab ich ja früher bei anderen gemacht.",
        kern: [
          { t: "Verband durchfeuchtet mit seröser Sekretion: Verbandwechsel nötig, Wunde beurteilen", kw: ["verband", "nass", "wundwasser", "sekret", "serös", "durchfeucht"] },
          { t: "Jodallergie (Povidon-Iod): kein PVP-Iod bei Wundversorgung", kw: ["jod", "iod", "pvp", "allergi", "ausschlag"] },
          { t: "Luxationsprophylaxe nicht verstanden, will auf der Seite schlafen: Luxationsgefahr", kw: ["luxation", "seite", "bein überschlagen", "innenrotation", "adduktion", "verstanden"] },
          { t: "Bagatellisiert Bewegungsschmerz (NRS 6): Analgesie vor Mobilisation und Verbandwechsel", kw: ["schmerz", "bagatell", "nrs", "analges", "bewegung"] },
          { t: "Sturz über den eigenen Hund: Sturzrisiko zu Hause, Wohnumfeld", kw: ["hund", "sturz", "flur", "wohnumfeld"] },
          { t: "Sorge um den Hund, Nachbarin als Ressource", kw: ["hund", "bello", "nachbarin", "sorge"] },
          { t: "Ressource: medizinische Erfahrung, kann Enoxaparin selbst spritzen", kw: ["hebamme", "selbst", "spritze", "ressource", "erfahrung"] },
          { t: "Osteoporose: weitere Frakturgefahr, Medikation (Alendronsäure) beachten", kw: ["osteoporose", "alendron", "fraktur"] }
        ]
      },
      B: {
        key: "B", name: "Mirko Lange", kurz: "Herr Lange", alter: 34, zimmer: "212", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#DC2626",
        typ: "Dachdecker, flapsig und cool, will keine Schwäche zeigen, spielt nachts am Handy, raucht.",
        diagnose: "Geschlossene Tibiaschaftfraktur links nach Sturz vom Gerüst; Plattenosteosynthese gestern 14 Uhr, dorsale Unterschenkelschiene; Tag 1.",
        daten: [
          ["Vorerkrankungen", "Asthma bronchiale seit der Kindheit"],
          ["Allergien", "ASS und andere NSAR (Analgetika-Asthma)"],
          ["Soziales", "lebt mit Freundin, selbstständig, Rauchen 15/Tag"],
          ["Medikation", "Oxycodon/Naloxon ret. 10/5 mg 1-0-1 · Metamizol 1 g 1-1-1-1 · Oxycodon akut 5 mg bei Bedarf (max. 4×) · Pantoprazol 40 mg 1-0-0 · Enoxaparin 40 mg s.c. 18 Uhr · Salbutamol bei Bedarf"],
          ["Vitalwerte gestern, 20 Uhr", "RR 128/76 mmHg · HF 84/min · T 37,3 °C · Schmerz NRS 5"],
          ["Ärztliche Vorgabe", "Bein hochlagern, DMS-Kontrolle 2-stündlich, Kühlung"]
        ],
        anamnese: "Alles easy, Chef. Ich bin vom Gerüst, vier Meter, und hab's überlebt, was soll da so ein Beinchen. Die Schmerzmittel helfen aber null, seit heute Nacht ist das Bein wie Beton, so ein Druck von innen. Die Zehen kribbeln, als wären sie eingeschlafen. Hab die Krankenschwester nicht gerufen, die hat genug zu tun, und ich bin ja kein Weichei. Ich hab mir einfach noch ein Kissen druntergelegt und den Kühlakku direkt drauf, das macht's ein bisschen taub. Rauchen? Logisch, auf'm Balkon, mit Rollstuhl, hat die Freundin mich geschoben. Aspirin darf ich übrigens nicht, da krieg ich Asthma, das steht irgendwo in meinem Pass. Wann kann ich wieder arbeiten? Ich bin selbstständig, wenn ich nicht arbeite, verdien ich nix.",
        kern: [
          { t: "Zunehmender Schmerz trotz Opioid, Druckgefühl „wie Beton“: Leitsymptom Kompartmentsyndrom", kw: ["kompartment", "beton", "druck", "schmerz trotz", "null", "zunehm"] },
          { t: "Kribbeln der Zehen: Sensibilitätsstörung (DMS auffällig)", kw: ["kribbel", "dms", "sensib", "taub", "eingeschlafen"] },
          { t: "Meldet Beschwerden nicht („kein Weichei“): verzögerte Hilfe", kw: ["weichei", "nicht gerufen", "melde", "klingel", "schwäche"] },
          { t: "Bein selbst übermäßig hochgelagert und Kühlakku direkt auf der Haut: Kälteschaden, Verschleierung", kw: ["kissen", "hochgelagert", "kühlakku", "direkt", "kälte", "eis"] },
          { t: "Analgetika-Asthma: keine NSAR (ASS, Ibuprofen, Diclofenac)", kw: ["aspirin", "ass", "nsar", "asthma", "ibuprofen", "allergi"] },
          { t: "Raucht weiter: Knochen- und Wundheilung gefährdet", kw: ["rauch", "zigarett", "nikotin"] },
          { t: "Existenzsorgen als Selbstständiger", kw: ["selbstständig", "arbeit", "geld", "verdien", "existenz"] },
          { t: "Ressource: Freundin unterstützt", kw: ["freundin", "ressource"] }
        ]
      },
      C: {
        key: "C", name: "Petra Nowak", kurz: "Frau Nowak", alter: 62, zimmer: "213", modus: "Beratung", farbe: "#2563EB",
        typ: "Grundschulleiterin, strukturiert, schreibt alles mit, hat Angst vor Spritzen.",
        diagnose: "Knie-Totalendoprothese links bei Gonarthrose; Tag 7, Entlassung morgen nach Hause, ambulante Reha geplant.",
        daten: [
          ["Vorerkrankungen", "Gonarthrose beidseits, Hypothyreose"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "lebt mit Ehemann im 2. Stock ohne Aufzug"],
          ["Medikation", "Enoxaparin 40 mg s.c. 1× tgl. für weitere 4 Wochen (Selbstinjektion) · Metamizol 500 mg bei Bedarf · L-Thyroxin 100 µg"],
          ["Mobilisation", "Unterarmgehstützen, Vollbelastung nach Maßgabe, Treppensteigen mit Physio geübt"],
          ["Wunde", "trocken, Klammern ziehen am Tag 12–14 beim Hausarzt"]
        ],
        anamnese: "Ich hab mir eine Liste gemacht, ich bin Lehrerin, das ist Berufskrankheit. Wir wohnen im zweiten Stock, kein Aufzug, die Physio hat das mit der Treppe mit mir geübt, aber ich krieg die Reihenfolge nicht mehr zusammen. Diese Spritzen soll ich jetzt vier Wochen selbst machen. Ehrlich, vor Spritzen hab ich Panik, mir wird schwarz vor Augen. Mein Mann sagt, er kann das nicht. Wann darf ich duschen? Ich hab gelesen, man darf vier Wochen nicht duschen, stimmt das? Und kühlen soll ich, aber wie lange? Ach, und ich muss ab übernächster Woche wieder in die Schule fahren, 20 Kilometer, das geht doch mit Automatik?",
        kern: [
          { t: "Treppe im 2. Stock ohne Aufzug: Reihenfolge mit Gehstützen unsicher", kw: ["treppe", "stock", "aufzug", "reihenfolge", "gehstütz"] },
          { t: "Angst vor Spritzen, Schwindel: Selbstinjektion Enoxaparin gefährdet, Alternativen klären", kw: ["spritze", "angst", "panik", "schwarz", "selbstinjekt", "enoxaparin"] },
          { t: "Ehemann traut sich die Injektion nicht zu", kw: ["mann", "ehemann"] },
          { t: "Unsicherheit beim Duschen (Wundschutz)", kw: ["duschen", "dusch", "wunde"] },
          { t: "Kühlung: Dauer und Technik unklar", kw: ["kühl"] },
          { t: "Will in zwei Wochen Auto fahren: Fahrtüchtigkeit ärztlich klären", kw: ["auto", "fahren", "fahrtücht"] },
          { t: "Ressource: strukturiert, schreibt mit, hoch motiviert", kw: ["liste", "struktur", "motiv", "ressource", "schreibt"] },
          { t: "Warnzeichen für Thrombose und Infektion noch nicht genannt: Beratungsbedarf", kw: ["warnzeichen", "thrombose", "infekt"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Gefahr einer Infektion der Operationswunde (00266) b/d frischer Endoprothese und durchfeuchtetem Verband, a/d seröser Sekretion; Gefahr einer Luxation b/d fehlendem Verständnis der Bewegungseinschränkungen, a/d Wunsch nach Seitenlage.",
        ziel: "Die Wunde bleibt infektfrei (keine Rötung, Überwärmung, eitrige Sekretion), der Verband ist trocken. Frau Vogt nennt bis morgen die drei Bewegungen, die sie vermeiden muss, und lagert sich nachts mit Abduktionskissen.",
        mass: [
          "Aseptischer Verbandwechsel nach Standard bei Durchfeuchtung, Wundbeurteilung und Dokumentation; kein PVP-Iod",
          "Analgesie ca. 30 Minuten vor Verbandwechsel und Mobilisation, Schmerz in Ruhe und Bewegung erfassen",
          "Luxationsprophylaxe anleiten: keine Beugung über 90°, keine Innenrotation, keine Adduktion; Abduktionskissen in Seitenlage",
          "Sturzprophylaxe für zu Hause (Hund, Flur) mit Sozialdienst und Physio besprechen",
          "Ressourcen nutzen: Enoxaparin-Selbstinjektion unter Beobachtung"
        ],
        chk: [
          { t: "Infektionsgefahr der Wunde als Diagnose", kw: ["infekt", "wunde"] },
          { t: "Luxationsgefahr / Wissensdefizit", kw: ["luxation", "bewegung"] },
          { t: "Ziel überprüfbar (infektfrei, nennt Einschränkungen)", kw: ["infektfrei", "nennt", "ziel", "trocken"] },
          { t: "Aseptischer VW, kein PVP-Iod", kw: ["aseptisch", "jod", "iod", "steril"] },
          { t: "Analgesie vor VW/Mobilisation", kw: ["analges", "schmerzmittel", "vor dem", "30 min"] },
          { t: "Abduktionskissen / Bewegungsregeln", kw: ["abduktion", "90", "innenrotation", "kissen"] }
        ]
      },
      B: {
        diag: "Gefahr einer peripheren neurovaskulären Störung (00086) b/d Fraktur, Operation und Schiene, a/d zunehmendem Schmerz trotz Opioid, Druckgefühl und Kribbeln der Zehen (Verdacht auf Kompartmentsyndrom). Dazu: Akuter Schmerz; Unverträglichkeit von NSAR.",
        ziel: "Veränderungen von Durchblutung, Motorik und Sensibilität werden bei jeder Kontrolle erkannt und sofort ärztlich gemeldet. Herr Lange meldet zunehmenden Schmerz oder Kribbeln sofort und kann sagen, warum das wichtig ist.",
        mass: [
          "DMS-Kontrolle mindestens 2-stündlich und bei jeder Schmerzäußerung; Schmerz trotz Analgesie als Warnzeichen werten",
          "Bei Kompartmentverdacht: Arzt sofort, Bein auf Herzhöhe (nicht darüber), einschnürende Binde lösen nach Standard, Kühlung nicht direkt auf die Haut",
          "Analgesie nach Anordnung ohne NSAR; Wirkung kontrollieren",
          "Edukation: Warnzeichen, Klingeln erlaubt und erwünscht; Rauchstopp anbieten",
          "Sozialdienst wegen Existenzsorgen (Selbstständigkeit)"
        ],
        chk: [
          { t: "Neurovaskuläre Störung / Kompartmentsyndrom als Diagnose", kw: ["kompartment", "neurovask", "dms", "durchblutung"] },
          { t: "Schmerz trotz Opioid als Warnzeichen", kw: ["schmerz", "warnzeichen", "trotz"] },
          { t: "Ziel: Veränderungen werden erkannt und gemeldet", kw: ["erkannt", "meldet", "gemeldet", "ziel"] },
          { t: "DMS 2-stündlich", kw: ["dms", "2-stünd", "zweistünd"] },
          { t: "Bein auf Herzhöhe, nicht darüber", kw: ["herzhöhe", "nicht darüber", "hochlager"] },
          { t: "Keine NSAR (Analgetika-Asthma)", kw: ["nsar", "ass", "ibuprofen", "asthma"] }
        ]
      },
      C: {
        diag: "Bereitschaft für ein verbessertes Gesundheitsmanagement (00162) bei Wissensdefizit zu Treppensteigen, Selbstinjektion, Wundpflege und Warnzeichen, a/d Fragen und eigener Liste; Angst vor Spritzen.",
        ziel: "Frau Nowak demonstriert vor der Entlassung das Treppensteigen mit Gehstützen und erklärt mit eigenen Worten Duschregeln, Kühlung und Warnzeichen. Die Thromboseprophylaxe ist für vier Wochen gesichert (Selbstinjektion oder Alternative).",
        mass: [
          "Treppensteigen wiederholen: hoch mit dem gesunden Bein, runter mit dem operierten Bein und den Stützen zuerst",
          "Selbstinjektion üben, Angst ernst nehmen; bei bleibender Angst ärztlich Alternative oder Pflegedienst klären",
          "Beratung zu Duschen, Kühlen, Warnzeichen für Thrombose, Lungenembolie und Infektion; schriftliches Infoblatt",
          "Fahrtüchtigkeit: an den Operateur verweisen",
          "Teach-back am Ende"
        ],
        chk: [
          { t: "Wissensdefizit / Beratungsbedarf als Diagnose", kw: ["wissen", "beratung", "gesundheitsmanagement"] },
          { t: "Angst vor Spritzen berücksichtigt", kw: ["angst", "spritze"] },
          { t: "Ziel mit Demonstration/Teach-back", kw: ["demonstr", "teach", "eigenen worten"] },
          { t: "Treppenregel korrekt", kw: ["treppe", "gesunde", "operierte"] },
          { t: "Warnzeichen Thrombose/Infektion", kw: ["warnzeichen", "thrombose", "infekt"] },
          { t: "Alternative zur Selbstinjektion / Pflegedienst", kw: ["pflegedienst", "alternative", "üben"] }
        ]
      }
    },
    nacht: [
      ["A", "Frau Vogt: Verband um 06 Uhr durchgefeuchtet, gelblich, ich hab nur eine Kompresse drübergelegt. Sie lag nachts auf der linken Seite ohne Kissen zwischen den Beinen, hat sich selbst gedreht. Analgesie 05:30."],
      ["B", "Herr Lange: Um 03 Uhr Oxycodon akut 5 mg wegen Schmerz NRS 7, um 05 Uhr nochmal gefragt, hab gesagt erst wieder um 07. Er hat sich das Bein auf drei Kissen gelegt. DMS hab ich um 22 Uhr gemacht, war unauffällig."],
      ["C", "Frau Nowak: hat gut geschlafen, Entlassung morgen. Sie hat gefragt, ob jemand ihr die Spritzen noch mal zeigen kann."]
    ],
    sbar: {
      A: {
        muster: {
          S: "Frau Vogt, 77, Zimmer 211, Tag 3 nach Hüft-TEP rechts. Verband seit 06 Uhr serös durchfeuchtet, nur abgedeckt.",
          B: "Dorsaler Zugang, Osteoporose, Jodallergie. Hat nachts auf der Seite ohne Abduktionskissen gelegen.",
          A: "Verbandwechsel ist nötig, die Wunde muss beurteilt werden. Luxationsgefahr, weil die Regeln nicht verstanden sind.",
          R: "Aseptischer VW nach Analgesie, ohne PVP-Iod; Luxationsprophylaxe anleiten, Abduktionskissen."
        },
        chk: [
          { t: "S: durchfeuchteter Verband", kw: ["verband", "durchfeucht", "nass", "serös"] },
          { t: "B: Jodallergie", kw: ["jod", "iod"] },
          { t: "A: Luxationsgefahr", kw: ["luxation"] },
          { t: "R: aseptischer VW", kw: ["aseptisch", "verbandwechsel", "vw"] },
          { t: "R: Abduktionskissen / Anleitung", kw: ["abduktion", "kissen", "anleit"] }
        ]
      },
      B: {
        muster: {
          S: "Herr Lange, 34, Zimmer 212, Tag 1 nach Plattenosteosynthese Unterschenkel links in Schiene. Schmerz NRS 7 und mehr trotz Opioid, Druckgefühl, Kribbeln der Zehen. Letzte DMS-Kontrolle vor 8 Stunden.",
          B: "Analgetika-Asthma (keine NSAR), Raucher. Hat das Bein selbst auf drei Kissen gelagert, Kühlakku direkt auf der Haut.",
          A: "Verdacht auf Kompartmentsyndrom. Das ist ein Notfall, der Schmerz ist das Leitsymptom.",
          R: "Sofort DMS prüfen, Arzt informieren, Bein auf Herzhöhe, Binde lösen nach Standard, keine weitere Hochlagerung."
        },
        chk: [
          { t: "S: Schmerz trotz Opioid, Kribbeln", kw: ["schmerz", "kribbel", "trotz"] },
          { t: "S: letzte DMS lange her", kw: ["dms", "22 uhr", "8 stunden"] },
          { t: "A: Kompartmentsyndrom", kw: ["kompartment"] },
          { t: "R: Arzt sofort", kw: ["arzt", "sofort"] },
          { t: "R: Herzhöhe statt Hochlagerung", kw: ["herzhöhe", "nicht hoch", "kissen weg"] }
        ]
      },
      C: {
        muster: {
          S: "Frau Nowak, 62, Zimmer 213, Tag 7 nach Knie-TEP links, Entlassung morgen.",
          B: "Lebt im 2. Stock ohne Aufzug, Enoxaparin vier Wochen, Angst vor Spritzen, Ehemann traut sich nicht.",
          A: "Hoher Beratungsbedarf; Thromboseprophylaxe zu Hause nicht gesichert.",
          R: "Beratungsgespräch mit Teach-back heute, Selbstinjektion üben, sonst ärztlich Alternative oder Pflegedienst."
        },
        chk: [
          { t: "S: Entlassung morgen", kw: ["entlass", "morgen"] },
          { t: "B: Treppe/2. Stock", kw: ["treppe", "stock"] },
          { t: "B/A: Angst vor Spritzen", kw: ["spritze", "angst"] },
          { t: "R: Beratung mit Teach-back", kw: ["beratung", "teach"] },
          { t: "R: Alternative/Pflegedienst", kw: ["pflegedienst", "alternative", "üben"] }
        ]
      }
    },
    prio: [
      { id: "l1", t: "Herr Lange: DMS-Kontrolle, Schmerz, Vitalzeichen", zeit: "06:15", warum: "Verdacht auf Kompartmentsyndrom: Gliedmaße in Gefahr, zeitkritisch." },
      { id: "l2", t: "Arzt über Herrn Lange informieren (SBAR)", zeit: "06:25", warum: "Kompartmentsyndrom ist ein chirurgischer Notfall." },
      { id: "v1", t: "Frau Vogt: Analgesie nach Anordnung, Lagerung mit Abduktionskissen", zeit: "06:45", warum: "Analgetikum braucht Vorlauf, Luxationsgefahr nach der Nacht in Seitenlage." },
      { id: "bz", t: "Medikamente 08 Uhr prüfen und verteilen", zeit: "07:30", warum: "Fester Zeitpunkt, R-Regeln; NSAR-Unverträglichkeit beachten." },
      { id: "v2", t: "Frau Vogt: aseptischer Verbandwechsel", zeit: "07:40", warum: "Nach Wirkungseintritt des Analgetikums, vor dem Bettenmachen (Staub)." },
      { id: "fr", t: "Frühstück, Unterstützung", zeit: "08:15", warum: "Zeitgebunden." },
      { id: "vi", t: "Visite 09:00 vorbereiten: Wundbefund, DMS-Verlauf, Entlassungsfragen", zeit: "08:45", warum: "Gut vorbereitet in die Visite." },
      { id: "mo", t: "Frau Vogt: Mobilisation mit Physio und Gehwagen", zeit: "10:00", warum: "Nach Analgesie und VW, fester Physiotermin." },
      { id: "n1", t: "Frau Nowak: Entlassungsberatung mit Teach-back, Selbstinjektion üben", zeit: "11:00", warum: "Planbar, aber Voraussetzung für die Entlassung morgen." },
      { id: "do", t: "Dokumentation, Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend dokumentieren, hier ergänzen." }
    ],
    live: [
      {
        k: "langebild", typ: "hotspot", pat: "B", t: "Herr Lange · Bildbefund", kurzname: "Bildbefund Bein in der Schiene", clock: "06:15", max: 8,
        titel: "Herr Lange und sein Bein",
        intro: "06:15 Uhr. Herr Lange spielt am Handy, das Gesicht ist angespannt. „Alles easy“, sagt er.",
        q: "Was fällt dir am Bein und in der Umgebung auf?",
        art: langeScene(),
        spots: [
          { c: [[300, 52, 22]], t: "Zehen blass-livide und geschwollen", d: "Veränderte Hautfarbe und Schwellung der Zehen sind Zeichen einer gestörten Durchblutung. Kapillarfüllung prüfen (über 2 Sekunden auffällig), Seitenvergleich." },
          { c: [[226, 98, 26]], t: "Einschnürende Binde über der Schiene", d: "Eine zu feste Binde wirkt wie ein Tourniquet und verschärft den Druck in den Muskellogen. Nach Standard lösen und neu, locker wickeln." },
          { c: [[300, 40, 14]], t: "Kühlakku direkt auf der Haut", d: "Kälte direkt auf der Haut schädigt Gewebe und betäubt; das verschleiert das Kribbeln. Immer mit Tuch, zeitlich begrenzt." },
          { c: [[208, 110, 26]], t: "Bein deutlich über Herzhöhe gelagert", d: "Bei Verdacht auf Kompartmentsyndrom gehört das Bein auf Herzhöhe: Starke Hochlagerung senkt den arteriellen Zufluss zusätzlich." },
          { c: [[352, 144, 22]], t: "Zigaretten auf dem Nachttisch", d: "Rauchen verengt Gefäße, verschlechtert Knochen- und Wundheilung. Rauchstopp anbieten, nicht moralisieren." },
          { c: [[200, 147, 22]], t: "Unverletztes Bein ohne Thromboseprophylaxe-Strumpf", d: "Das gesunde Bein braucht Bewegung und nach Anordnung Kompression. Bettruhe plus Trauma erhöht das Thromboserisiko." }
        ],
        extra: ["Dekubitus Ferse", "Wundinfektion", "Schwellung des Knies rechts", "Hämatom am Oberschenkel"],
        cap: "Tipp: Zehen, Schiene, Lagerung, Kühlung, Nachttisch, gesundes Bein.",
        merke: "Gips oder Schiene plus Schmerz trotz Opioid heißt: DMS prüfen, Arzt sofort. Kälte und starke Hochlagerung sind hier keine Hilfe."
      },
      {
        k: "langevit", typ: "vitmed", pat: "B", t: "Herr Lange · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen, DMS und Medikamente", clock: "06:20", max: 10, wVit: 0.5,
        titel: "Vitalzeichen und DMS erheben, Medikamente prüfen",
        banner: { name: "Mirko Lange", sub: "34 J. · Zimmer 212 · Tag 1 nach Plattenosteosynthese li.", chips: [["Keine NSAR (Analgetika-Asthma)", "red"], ["Schmerz trotz Opioid", ""], ["DMS zuletzt 22 Uhr", ""]] },
        intro: "Herr Lange: „Ganz ehrlich? Das Bein platzt gleich. Aber schreiben Sie nicht auf, dass ich gejammert hab.“",
        uhr: "06:21",
        vit: {
          items: [
            { k: "schmerz", t: "Schmerz", kurz: "NRS", val: "9", einheit: "/10 trotz Oxycodon", farbe: "schmerz", wie: "erfragen" },
            { k: "dms", t: "DMS", kurz: "DMS", ico: "puls", val: "auffällig", einheit: "kühl · KF 4 s · Kribbeln", farbe: "rr", wie: "prüfen", q: { text: "Wie prüfst du Durchblutung, Motorik und Sensibilität am Fuß in der Schiene?", opts: [
              { t: "Hautfarbe und Temperatur der Zehen, Kapillarfüllung am Zehennagel, Zehen aktiv bewegen lassen, passive Dehnung auf Schmerz prüfen, Berührung und Kribbeln erfragen; Seitenvergleich", ok: true, fb: "Richtig. Dehnungsschmerz der Zehen ist ein frühes Kompartmentzeichen. Der Fußpuls kann trotz Kompartmentsyndrom tastbar sein." },
              { t: "Nur den Fußpuls tasten: Ist er da, ist alles in Ordnung", fb: "Falsch. Beim Kompartmentsyndrom bleibt der Puls oft lange tastbar, weil der arterielle Druck höher ist als der Logendruck." },
              { t: "Fragen, ob alles okay ist", fb: "Herr Lange bagatellisiert. DMS wird geprüft, nicht erfragt." }] } },
            { k: "puls", t: "Puls", kurz: "HF", val: "112", einheit: "/min", farbe: "puls", wie: "tasten" },
            { k: "rr", t: "Blutdruck", kurz: "NIBP", val: "146/88", einheit: "mmHg", farbe: "rr", wie: "Manschette" },
            { k: "af", t: "Atemfrequenz", kurz: "AF", val: "20", einheit: "/min", farbe: "af", wie: "zählen" },
            { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "98", einheit: "% Raumluft", farbe: "spo2", wie: "Clip" },
            { k: "temp", t: "Temperatur", kurz: "Temp", val: "37,9", einheit: "°C", farbe: "temp", wie: "Ohr" }
          ],
          befund: "Zehen links kühl, blass, Kapillarfüllung 4 Sekunden, Kribbeln, passive Streckung der Zehen sehr schmerzhaft. Rechts unauffällig.",
          act: { text: "Die Vitalzeichen sind fast unauffällig. Was tust du?", opts: [
            { t: "Trotzdem sofort Arzt informieren: Verdacht auf Kompartmentsyndrom. Bein auf Herzhöhe, Kühlakku weg, einschnürende Binde nach Standard lösen, DMS engmaschig, nüchtern lassen bis zur ärztlichen Entscheidung", ok: true, fb: "Richtig. Vitalzeichen zeigen die Durchblutung einer Gliedmaße nicht. Das Kompartmentsyndrom ist ein Notfall, oft mit Operation (Fasziotomie)." },
            { t: "Die Vitalzeichen sind fast normal, also nächste Kontrolle in 4 Stunden", fb: "Gefährlich. Hier entscheidet der klinische Befund an der Gliedmaße." },
            { t: "Noch eine Oxycodon-akut-Tablette geben und abwarten", fb: "Mehr Opioid verdeckt das Leitsymptom, ohne die Ursache zu behandeln." },
            { t: "Bein noch höher lagern und mehr kühlen", fb: "Starke Hochlagerung senkt den Zufluss, Kälte schädigt. Beides verschlechtert die Situation." }] }
        },
        med: {
          zeit: "08:00", allergie: "ASS/NSAR (Analgetika-Asthma)",
          hinweis: "06:40 Uhr, Dr. Wiesner: Verdacht bestätigt, Herr Lange kommt um 10 Uhr in den OP. „Nüchtern ab jetzt, morgens nur Pantoprazol mit Schluck Wasser. Retard-Opioid wie angeordnet geben, Metamizol als Tablette lassen, ich gebe es i.v.“",
          plan: [
            { n: "Oxycodon/Naloxon ret.", d: "10/5 mg", z: "1-0-1", h: "mit Schluck Wasser, AO 06:40" },
            { n: "Pantoprazol", d: "40 mg", z: "1-0-0", h: "mit Schluck Wasser" },
            { n: "Metamizol", d: "1 g p.o.", z: "1-1-1-1", h: "heute i.v. durch Arzt", aus: true },
            { n: "Enoxaparin", d: "40 mg s.c.", z: "18 Uhr", h: "" },
            { n: "Oxycodon akut", d: "5 mg", z: "bei Bedarf", h: "max. 4×/24 h" },
            { n: "NSAR (Ibuprofen, ASS …)", d: "–", z: "–", h: "KONTRAINDIZIERT", aus: true }
          ],
          disp: [
            { n: "Oxycodon/Naloxon ret. 10/5 mg", sub: "1 Retardtablette", pill: { c: "#93c5fd", s: "oval" }, r: "ok", fb: "Angeordnet, mit einem Schluck Wasser trotz Nüchternheit. Retardtabletten nicht teilen oder zerkauen." },
            { n: "Pantoprazol 40 mg", sub: "1 Tablette", pill: { c: "#fde68a", s: "oval" }, r: "ok", fb: "Angeordnet, magensaftresistent." },
            { n: "Metamizol 500 mg", sub: "2 Tabletten", pill: { c: "#e9d5ff", s: "round", n: 2 }, r: "pause", fb: "Heute nicht als Tablette, der Arzt gibt es i.v. Herr Lange ist nüchtern." },
            { n: "Ibuprofen 600 mg", sub: "1 Tablette „gegen die Schwellung“", pill: { c: "#fecaca", s: "oval" }, r: "allergie", fb: "NSAR können bei Analgetika-Asthma einen schweren Asthmaanfall auslösen. Entfernen und melden." },
            { n: "Enoxaparin 40 mg", sub: "Fertigspritze", pill: { c: "#bfdbfe", s: "spritze" }, r: "zeit", fb: "Angeordnet für 18 Uhr, nicht für 08 Uhr. Und vor einer OP sowieso ärztlich abstimmen." }
          ]
        },
        final: { text: "Herr Lange: „Kann ich die Retardtablette zerbeißen? Dann wirkt sie schneller.“ Deine Antwort?", opts: [
          { t: "„Nein. Die Tablette gibt den Wirkstoff über 12 Stunden ab. Zerbissen kommt die ganze Dosis auf einmal, das kann gefährlich werden. Wenn der Schmerz stärker wird, klingeln Sie bitte sofort, der Schmerz ist bei Ihnen ein wichtiges Warnzeichen.“", ok: true, fb: "Richtig. Begründet, mit Hinweis auf das Warnsignal." },
          { t: "„Ja, wenn Sie viel Wasser trinken.“", fb: "Falsch, und er ist nüchtern." },
          { t: "„Ist egal, Hauptsache sie ist drin.“", fb: "Gefährliche Fehlinformation bei Opioiden." }] },
        merke: "Unauffällige Vitalzeichen schließen kein Kompartmentsyndrom aus. Bei NSAR-Unverträglichkeit wird jede „harmlose“ Schmerztablette geprüft."
      },
      {
        k: "vw", typ: "steps", pat: "A", t: "Frau Vogt · Verbandwechsel", kurzname: "Aseptischer Verbandwechsel Schritt für Schritt", clock: "07:40", max: 16,
        titel: "Aseptischer Verbandwechsel nach Hüft-TEP",
        icon: "M4 9h16v6H4zM9 9v6M15 9v6",
        banner: { name: "Marlene Vogt", sub: "77 J. · Zimmer 211 · Hüft-TEP rechts, Tag 3", chips: [["Allergie: Jod (PVP-Iod)", "red"], ["Luxationsprophylaxe", ""], ["Analgesie 07:30", ""]] },
        intro: "07:40 Uhr. Das Analgetikum wirkt seit zehn Minuten. Der Verband ist serös durchfeuchtet. Du führst einen aseptischen Verbandwechsel bei einer primär heilenden Wunde durch (Non-Touch-Technik mit Pinzetten).",
        ko: ["PVP-Iod bei bekannter Jodallergie", "Kontaminierte Kompresse oder Pinzette weiterverwenden", "Reinigung von außen nach innen bei aseptischer Wunde", "Wunde mit unsterilen Handschuhen berühren", "Lagerung, die gegen die Luxationsprophylaxe verstößt"],
        merke: "Aseptische Wunden werden von innen nach außen gereinigt, jede Kompresse nur einmal. Und vor jedem Handgriff an der Hüfte steht die Luxationsprophylaxe.",
        steps: [
          { t: "Vorbereitung", ph: "vor", img: "vorb", q: "Was klärst du vor dem Verbandwechsel?", opts: [
            { t: "Standard und Wundverlauf, Analgesie mit Vorlauf, Allergien (Jod!), Zeitpunkt nicht während Bettenmachen oder Raumreinigung", ok: true, fb: "Richtig. Staubaufwirbelung erhöht die Keimbelastung, und die Jodallergie entscheidet über die Spüllösung." },
            { t: "Nichts, ein Verbandwechsel ist Routine", fb: "Gerade Routine führt zu übersehenen Allergien." },
            { t: "Erst die Betten machen, dann ist das Zimmer ordentlich", fb: "Bettenmachen wirbelt Staub und Hautschuppen auf. VW davor oder mit Abstand." }
          ] },
          { t: "Lagerung", ph: "vor", img: "lager", q: "Wie lagerst du Frau Vogt für den Verbandwechsel an der rechten Hüfte?", opts: [
            { t: "Rückenlage, leichte Kippung zur linken Seite mit Abduktionskissen zwischen den Beinen; keine Innenrotation, keine Adduktion des rechten Beins", ok: true, fb: "Richtig. So ist die Wunde zugänglich, ohne die Luxationsregeln zu verletzen." },
            { t: "Linke Seitenlage ohne Kissen, Beine übereinander, dann sieht man die Wunde am besten", ko: true, fb: "Kritisch: Adduktion und Innenrotation nach dorsalem Zugang können die Prothese luxieren." },
            { t: "Sitzend auf der Bettkante", fb: "Beugung über 90° und keine gute Sicht auf die Wunde." }
          ] },
          { t: "Material", ph: "vor", img: "set", q: "Welches Material richtest du?", opts: [
            { t: "Steriles Verbandset mit zwei Pinzetten, sterile Kompressen, NaCl 0,9 % oder Wundspüllösung nach Standard (kein PVP-Iod), sterile Wundauflage passender Größe, unsterile Handschuhe, Abwurf; Arbeitsfläche desinfiziert", ok: true, fb: "Richtig. Für eine primär heilende Wunde reicht eine sterile Spüllösung." },
            { t: "PVP-Iod-Lösung, die desinfiziert am besten", ko: true, fb: "Kritisch: Jodallergie. Auch „nur zum Abtupfen“ nicht." },
            { t: "Ein Pflaster aus der Kitteltasche, geht schneller", fb: "Nicht steril, nicht passend, nicht nachvollziehbar." }
          ] },
          { t: "Alten Verband entfernen", ph: "durch", img: "alt", q: "Wie entfernst du den alten Verband?", opts: [
            { t: "Händedesinfektion, unsterile Handschuhe, Verband von außen zur Wunde hin lösen, Haut gegenhalten; Verband auf Sekret (Menge, Farbe, Geruch) ansehen und abwerfen", ok: true, fb: "Richtig. Das Sekret im Verband ist ein Teil der Wundbeurteilung." },
            { t: "Mit sterilen Handschuhen abziehen und weiterarbeiten", fb: "Nach Kontakt mit dem alten Verband sind die Handschuhe kontaminiert." },
            { t: "Mit einem Ruck quer über die Wunde abziehen", fb: "Zug über die Wunde kann die Wundränder belasten und Schmerzen verursachen." }
          ] },
          { t: "Handschuhwechsel", ph: "durch", img: "alt", q: "Nach dem Entfernen:", opts: [
            { t: "Handschuhe ausziehen, hygienische Händedesinfektion", ok: true, fb: "Richtig. Übergang von unrein zu rein." },
            { t: "Handschuhe anbehalten, die sind ja noch sauber", fb: "Sie hatten Kontakt mit Wundsekret." },
            { t: "Handschuhe wechseln ohne Händedesinfektion", fb: "Händedesinfektion vor aseptischen Tätigkeiten ist Pflicht." }
          ] },
          { t: "Wunde beurteilen", ph: "durch", img: "wunde", q: "Du siehst: 16 cm lange Naht mit Klammern, Wundränder adaptiert, keine Rötung über 1 cm, am unteren Pol wenig klares, gelbliches Sekret, geruchlos. Einschätzung?", opts: [
            { t: "Primär heilende Wunde mit leichter seröser Sekretion am unteren Pol, keine Infektionszeichen: steril versorgen, Sekret beobachten und dokumentieren, bei Zunahme Arzt informieren", ok: true, fb: "Richtig. Seröse Sekretion in den ersten Tagen ist häufig. Warnzeichen wären Rötung, Überwärmung, Eiter oder Geruch." },
            { t: "Wundinfektion: sofort Arzt und Abstrich", fb: "Dafür fehlen die Entzündungszeichen." },
            { t: "Die Klammern am unteren Pol entfernen, damit das Sekret abläuft", fb: "Klammern entfernt man nur nach ärztlicher Anordnung." }
          ] },
          { t: "Steriles Set öffnen", ph: "durch", img: "set", q: "Wie bereitest du das sterile Material vor?", opts: [
            { t: "Set Non-Touch öffnen, Spüllösung auf die Kompressen geben, ohne Inhalt oder Innenseite zu berühren", ok: true, fb: "Richtig. Du berührst nur die Außenseiten." },
            { t: "Kompressen mit der Hand aus dem Set nehmen und zurechtlegen", fb: "Mit unsterilen Händen ist das Material nicht mehr steril." },
            { t: "Die Flasche mit der Spüllösung auf das sterile Feld stellen", fb: "Die Flasche ist außen unsteril." }
          ] },
          { t: "Reinigen", ph: "durch", img: "clean", q: "In welcher Richtung reinigst du?", opts: [
            { t: "Mit Pinzette und getränkter Kompresse von innen nach außen: erst entlang der Naht, dann die Umgebung; jede Kompresse nur einmal", ok: true, fb: "Richtig. Bei einer aseptischen Wunde trägst du so keine Hautkeime in die Wunde." },
            { t: "Von außen nach innen, wie bei einer infizierten Wunde", ko: true, fb: "Kritisch: Bei aseptischer Wunde würdest du Keime der Umgebung in die Wunde wischen." },
            { t: "Mit einer Kompresse hin und her, bis alles sauber ist", ko: true, fb: "Kritisch: Mehrfachwischen verteilt Keime." }
          ] },
          { t: "Ereignis", ph: "durch", img: "fall", q: "Eine getränkte Kompresse rutscht von der Pinzette auf die Bettdecke. Was tust du?", opts: [
            { t: "Kompresse verwerfen und eine neue sterile Kompresse nehmen", ok: true, fb: "Richtig. Was unsteril war, wird nicht mehr steril." },
            { t: "Mit der Pinzette aufheben, sie lag ja nur kurz", ko: true, fb: "Kritisch: Kontaminierte Materialien weiterzuverwenden ist ein Asepsisbruch." },
            { t: "Mit Desinfektionsmittel besprühen und weiterverwenden", fb: "So wird keine Kompresse steril." }
          ] },
          { t: "Abdecken", ph: "durch", img: "neu", q: "Wie legst du die neue Wundauflage auf?", opts: [
            { t: "Wunde trocken tupfen, sterile Wundauflage mit 2–3 cm Überstand auflegen, ohne die Wundseite zu berühren; spannungsfrei fixieren, mit Datum beschriften", ok: true, fb: "Richtig. Ausreichender Überstand verhindert, dass Sekret seitlich austritt." },
            { t: "Knapp passend auflegen, damit es nicht so viel Pflaster braucht", fb: "Zu kleine Auflagen werden schnell durchfeuchtet und lösen sich." },
            { t: "Wundauflage zuschneiden und anpassen", fb: "Zuschneiden kann Fasern in die Wunde bringen und die Sterilität verletzen." }
          ] },
          { t: "Nachbereitung", ph: "nach", img: "lager", q: "Nach dem Verbandwechsel:", opts: [
            { t: "Material entsorgen, Pinzetten zur Aufbereitung, Händedesinfektion, Frau Vogt in Rückenlage mit Abduktionskissen lagern, Luxationsregeln wiederholen, Klingel geben", ok: true, fb: "Richtig. Lagerung und Edukation gehören zum Abschluss." },
            { t: "Kissen weglassen, sie liegt ja wieder auf dem Rücken", fb: "Das Kissen verhindert die Adduktion, besonders im Schlaf." },
            { t: "Pinzetten abspülen und im Zimmer liegen lassen für morgen", fb: "Sterilgut wird aufbereitet, nicht wiederverwendet." }
          ] },
          { t: "Dokumentation", ph: "nach", img: "doku", q: "Was dokumentierst du?", opts: [
            { t: "Lokalisation, Länge, Wundränder, Klammern, Sekret (Menge, Farbe, Geruch), Umgebung, Schmerz, Material, Datum des nächsten Wechsels bzw. Indikation, Handzeichen", ok: true, fb: "Richtig. Nur eine vollständige Wunddokumentation macht den Verlauf vergleichbar." },
            { t: "„VW durchgeführt, Wunde o. B.“", fb: "Zu ungenau; die seröse Sekretion fehlt." },
            { t: "Nur das Datum auf den Verband schreiben", fb: "Das ersetzt die Dokumentation nicht." }
          ] }
        ],
        art: vw
      },
      {
        k: "entlass", typ: "beratung", pat: "C", t: "Frau Nowak · Entlassungsberatung", kurzname: "Entlassungsberatung", clock: "11:00", max: 6,
        titel: "Gut vorbereitet nach Hause",
        banner: { name: "Petra Nowak", sub: "62 J. · Zimmer 213 · Knie-TEP links, Entlassung morgen", chips: [["2. Stock ohne Aufzug", ""], ["Angst vor Spritzen", ""]] },
        intro: "11:00 Uhr. Frau Nowak sitzt mit ihrer Liste am Tisch, der Kugelschreiber ist schon gezückt.",
        person: { name: "Frau Nowak" },
        qs: [
          { q: "„Wie war das jetzt mit der Treppe? Erst die Krücken oder erst das gute Bein?“", re: "„Hoch mit dem Guten, runter mit dem Operierten. Das schreib ich mir an die Haustür.“", opts: [
            { t: "„Hoch: zuerst das gesunde Bein, dann das operierte Bein mit der Stütze nachziehen. Runter: zuerst die Stütze und das operierte Bein, dann das gesunde. Nutzen Sie das Geländer, die zweite Stütze trägt man dann in der anderen Hand.“", ok: true, fb: "Richtig. Eselsbrücke: Das gesunde Bein geht in den Himmel, das operierte in die Hölle." },
            { t: "„Hoch und runter immer zuerst mit dem operierten Bein, damit es trainiert wird.“", fb: "Falsch und sturzgefährlich: Beim Hochsteigen trägt das gesunde Bein die Last." },
            { t: "„Am besten vermeiden Sie Treppen vier Wochen lang.“", fb: "Bei ihr unrealistisch (2. Stock) und nicht nötig." }
          ] },
          { q: "„Bei den Thrombosespritzen ist eine Luftblase drin. Muss ich die vorher rausdrücken?“", re: "„Ach so, die gehört da rein. Gut, dass ich gefragt hab.“", opts: [
            { t: "„Nein, bei diesen Fertigspritzen bleibt die Luftblase drin, so ist die ganze Dosis sicher drin. Hautfalte am Bauch bilden, senkrecht einstechen, langsam spritzen, kurz warten, nicht reiben.“", ok: true, fb: "Richtig. Bei Enoxaparin-Fertigspritzen wird die Luftblase nicht entfernt." },
            { t: "„Ja, unbedingt, sonst spritzen Sie Luft in die Vene.“", fb: "Falsch. s.c. ist nicht i.v., und das Entfernen kann Wirkstoff kosten." },
            { t: "„Spritzen Sie am besten in den Oberarm, da merkt man es weniger.“", fb: "Für Selbstinjektion ist der Bauch die übliche, gut erreichbare Stelle." }
          ] },
          { q: "„Ehrlich gesagt wird mir bei Spritzen schwarz vor Augen. Und mein Mann traut sich auch nicht.“", re: "„Dann probier ich es heute einmal mit Ihnen. Und wenn es nicht geht, ist das kein Versagen.“", opts: [
            { t: "„Das nehme ich ernst. Wir üben heute im Liegen mit mir zusammen. Wenn es trotzdem nicht geht, kläre ich mit dem Arzt eine Alternative oder einen Pflegedienst, damit die Prophylaxe gesichert ist.“", ok: true, fb: "Richtig. Angst ernst nehmen, üben, und die Versorgung absichern." },
            { t: "„Da müssen Sie durch, Sie sind doch erwachsen.“", fb: "Abwertend und keine Lösung. Ausgelassene Spritzen gefährden sie." },
            { t: "„Dann lassen Sie die Spritzen einfach weg, Sie laufen ja schon.“", fb: "Gefährlich: Die Thromboseprophylaxe ist für vier Wochen angeordnet." }
          ] },
          { q: "„Ich hab gelesen, man darf vier Wochen nicht duschen. Stimmt das?“", re: "„Das Internet erzählt einem ja Sachen.“", opts: [
            { t: "„Duschen ist bei trockener Wunde mit einem wasserdichten Duschpflaster erlaubt, so wie es Ihr Arzt freigibt. Baden und Schwimmen erst, wenn die Klammern draußen und die Wunde verheilt ist.“", ok: true, fb: "Richtig. Klar unterschieden zwischen Duschen und Baden." },
            { t: "„Ja, vier Wochen nur Waschlappen.“", fb: "Nicht nötig, wenn die Wunde trocken und geschützt ist." },
            { t: "„Duschen und baden ist kein Problem, Wasser ist ja sauber.“", fb: "Baden vor Wundheilung erhöht das Infektionsrisiko." }
          ] },
          { q: "„Woran merke ich denn, dass etwas nicht stimmt?“", re: "„Und bei Atemnot sofort 112. Notiert.“", opts: [
            { t: "„Zunehmende Rötung, Schwellung, Überwärmung, Sekret aus der Wunde oder Fieber: Hausarzt. Schmerzen und Schwellung in der Wade: Hausarzt am selben Tag. Plötzliche Atemnot oder Brustschmerz: sofort 112.“", ok: true, fb: "Richtig. Infekt, Thrombose und Lungenembolie mit klaren Handlungsschritten." },
            { t: "„Wenn es weh tut, nehmen Sie eine Schmerztablette, das ist normal.“", fb: "Verschleiert mögliche Warnzeichen." },
            { t: "„Das merken Sie schon, keine Sorge.“", fb: "Keine Beratung." }
          ] },
          { q: "„Und Auto fahren? Ich hab Automatik, das linke Bein brauch ich da ja nicht.“", re: "„Dann frag ich bei der Nachuntersuchung. Ist wahrscheinlich besser für die Versicherung.“", opts: [
            { t: "„Das entscheidet Ihr Operateur bei der Nachuntersuchung. Fahren Sie erst, wenn Sie sicher ein- und aussteigen und schmerzfrei reagieren können und keine Medikamente nehmen, die müde machen. Davon hängt auch Ihr Versicherungsschutz ab.“", ok: true, fb: "Richtig. Fahrtauglichkeit ist eine ärztliche Frage. Pflege gibt Kriterien, keine Freigabe." },
            { t: "„Mit Automatik und links operiert dürfen Sie sofort fahren.“", fb: "Eine Freigabe steht dir nicht zu." },
            { t: "„Frühestens nach einem Jahr.“", fb: "Falsch und verunsichernd." }
          ] }
        ],
        merke: "Entlassungsberatung heißt: konkrete Regeln, Ängste ernst nehmen, Versorgung absichern und nur das freigeben, was in deiner Kompetenz liegt."
      }
    ],
    st: {
      clock: "10:15", titel: "Treppenhaus und Telefon",
      situation: "10:15 Uhr. Frau Hamann (88, Zimmer 214, Demenz, Radiusfraktur, Patientin deiner Kollegin) ist allein aufgestanden und läuft im Nachthemd Richtung Treppenhaus: „Ich muss zu meinen Kindern.“ Gleichzeitig klingelt das Telefon: Der OP will Herrn Lange um 10:30 Uhr statt um 11 Uhr abholen. Und der Sohn von Frau Nowak steht am Stützpunkt und will „den Entlassbrief schon mal mitnehmen“.",
      order: [
        { id: "a", t: "Zu Frau Hamann: ruhig ansprechen, begleiten, nicht festhalten oder zerren, vom Treppenhaus weglenken", warum: "Akute Sturzgefahr an der Treppe. Validierende Ansprache statt Konfrontation." },
        { id: "b", t: "Hilfe holen: Kollegin bitten, Frau Hamann zu übernehmen", warum: "Du kannst nicht an zwei Orten sein." },
        { id: "c", t: "Telefon: neue OP-Zeit für Herrn Lange wiederholen (Read-back), dokumentieren", warum: "Gesicherte Information, bevor du handelst." },
        { id: "d", t: "OP-Vorbereitung Herr Lange mit Checkliste abschließen", warum: "Zeitkritisch, aber nach Sicherung von Frau Hamann." },
        { id: "e", t: "Sohn von Frau Nowak: freundlich erklären, dass der Entlassbrief ärztlich erstellt und an seine Mutter ausgehändigt wird", warum: "Schweigepflicht und Zuständigkeit." },
        { id: "f", t: "Ereignis bei Frau Hamann dokumentieren und übergeben, Sturzrisiko neu einschätzen", warum: "Nach der Akutsituation dokumentieren." }
      ],
      mc: { text: "OP-Vorbereitung Herr Lange: Was gehört dazu? (Mehrfachauswahl)", opts: [
        { t: "Nüchternheit seit 06:40 dokumentieren; Pantoprazol und Retard-Opioid mit Schluck Wasser angeben", ok: true, fb: "Anästhesie braucht genaue Zeiten." },
        { t: "NSAR-Unverträglichkeit/Analgetika-Asthma auf der Checkliste vermerken", ok: true, fb: "Wichtig für die Narkose und die Schmerztherapie danach." },
        { t: "Piercings und Schmuck entfernen, Patientenarmband prüfen", ok: true, fb: "Standard." },
        { t: "Letzten DMS-Befund und Schmerzwert mitgeben", ok: true, fb: "Ausgangsbefund für die Fasziotomie." },
        { t: "Ihm schnell noch eine Zigarette auf dem Balkon erlauben, damit er ruhiger ist", ok: false, fb: "Nein: nüchtern heißt auch nicht rauchen, und er ist nicht mobil." },
        { t: "Die OP-Einwilligung selbst unterschreiben lassen", ok: false, fb: "Ärztliche Aufgabe." }
      ] },
      merke: "Weglauftendenz an der Treppe ist ein Sturznotfall. Ruhig begleiten, nicht zerren. Und Informationen am Telefon immer wiederholen."
    },
    doku: {
      clock: "11:30",
      auftrag: "Schreibe den Pflegebericht zu Herrn Lange für den Zeitraum 06:15 bis 07:00 Uhr.",
      muster: "06:15 Pat. wach, angespannt. Äußert: „Das Bein platzt gleich.“ Schmerz NRS 9 trotz Oxycodon akut 5 mg um 03:00. DMS li.: Zehen kühl, blass, Kapillarfüllung 4 s, Kribbeln, passive Zehenstreckung stark schmerzhaft; re. unauffällig. Bein auf drei Kissen über Herzhöhe, Kühlakku direkt auf der Haut, Binde der Schiene einschnürend. HF 112/min, RR 146/88 mmHg, AF 20/min, SpO₂ 98 %, T 37,9 °C. 06:20 Kühlakku entfernt, Bein auf Herzhöhe gelagert, Binde nach Standard gelockert. 06:25 Dr. Wiesner telefonisch (SBAR), 06:35 am Bett: V. a. Kompartmentsyndrom, OP heute, nüchtern ab 06:40. 06:50 DMS-Kontrolle: unverändert, Schmerz NRS 8. [Name, Handzeichen]",
      chk: [
        { t: "Uhrzeiten für Befund, Maßnahmen, Arzt", kw: ["06:"] },
        { t: "DMS konkret beschrieben (Farbe, Temperatur, Kapillarfüllung, Sensibilität, Motorik)", kw: ["dms", "kapillar", "kribbel", "blass"] },
        { t: "Schmerz mit NRS und letzte Analgesie", kw: ["nrs", "oxycodon"] },
        { t: "Patientenaussage wörtlich", kw: ["„", "\"", "äußert"] },
        { t: "Maßnahmen (Lagerung, Kühlung weg, Binde)", kw: ["herzhöhe", "kühlakku", "binde"] },
        { t: "Arzt mit Name, Anordnung (OP, nüchtern)", kw: ["dr.", "wiesner", "nüchtern", "op"] },
        { t: "Re-Evaluation", kw: ["kontrolle", "unverändert", "06:50"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "06:15 DMS li.: Zehen kühl, blass, KF 4 s, Kribbeln.", bad: false, fb: "In Ordnung." },
          { t: "Pat. jammert über Schmerzen.", bad: true, fb: "Wertend. Richtig: Schmerz NRS 9, wörtliche Aussage." },
          { t: "DMS o. B.", bad: true, fb: "Falsch und unbestimmt: Der Befund war auffällig." },
          { t: "06:25 Dr. Wiesner informiert (SBAR), 06:35 am Bett.", bad: false, fb: "In Ordnung." },
          { t: "Bein hochgelagert wie immer.", bad: true, fb: "Unklar und fachlich falsch bei Kompartmentverdacht." },
          { t: "Pat. äußert: „Das Bein platzt gleich.“", bad: false, fb: "In Ordnung." },
          { t: "Hat geraucht, typisch.", bad: true, fb: "Persönliche Wertung." },
          { t: "Nachtrag 07:20 zu 06:20: Kühlakku entfernt. T. B.", bad: false, fb: "In Ordnung, korrekt gekennzeichnet." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst (Pflegefachkraft Nils Hartmann).",
      muster: "Frau Vogt, 211: Hüft-TEP re. Tag 3, VW 07:40: Wunde reizlos, wenig serös am unteren Pol, sterile Auflage. Jodallergie! Luxationsregeln heute erklärt, nennt zwei von drei, bitte heute Abend wiederholen. Abduktionskissen nachts. Mobilisation mit Physio 10 Uhr: 20 m mit Gehwagen.\n\nHerr Lange, 212: V. a. Kompartmentsyndrom, Fasziotomie 10:30–11:45, zurück seit 12:30. Wunde offen mit Vakuumverband (ärztlich angelegt), DMS 12:45: Zehen warm, KF 2 s, kein Kribbeln mehr. DMS weiter 2-stündlich. Analgetika-Asthma: keine NSAR, heute früh war Ibuprofen im Dispenser, entfernt, gemeldet. Enoxaparin 18 Uhr nach ärztlicher Rücksprache.\n\nFrau Nowak, 213: Entlassung morgen. Beratung mit Teach-back: Treppe sicher, Duschregeln, Warnzeichen. Selbstinjektion heute im Liegen einmal geschafft, sehr angespannt; Sozialdienst prüft Pflegedienst als Rückfallebene. Autofahren an Operateur verwiesen.",
      chk: [
        { t: "Alle Patienten mit aktuellem Zustand", kw: ["211", "212", "213", "vogt", "lange", "nowak"] },
        { t: "Offene Aufgaben (DMS, Enoxaparin, Luxationsregeln, Pflegedienst)", kw: ["dms", "enoxaparin", "wiederholen", "pflegedienst", "bitte"] },
        { t: "Sicherheitsrelevantes (Allergien, NSAR)", kw: ["jod", "nsar", "allergi"] }
      ]
    },
    refl: [
      { q: "Herrn Langes Vitalzeichen waren fast unauffällig. Warum hast du trotzdem sofort den Arzt gerufen?", muster: "Vitalzeichen zeigen die Vitalfunktionen, nicht die Durchblutung einer Gliedmaße. Die Leitsymptome des Kompartmentsyndroms waren da: Schmerz trotz Opioid, Druckgefühl, Kribbeln, Dehnungsschmerz, verlängerte Kapillarfüllung. Dazu Risikofaktoren: frische Fraktur, einschnürende Binde, Hochlagerung über Herzhöhe. Messwerte unterstützen meine Einschätzung, sie ersetzen sie nicht. Bei Herrn Lange war die klinische Beobachtung entscheidend." },
      { q: "Wie hast du beim Verbandwechsel bei Frau Vogt Asepsis und Luxationsprophylaxe gleichzeitig sichergestellt?", muster: "Vorher: Analgesie mit Vorlauf, Jodallergie geprüft, kein Bettenmachen. Lagerung in Rückenlage mit leichter Kippung und Abduktionskissen, keine Adduktion oder Innenrotation. Dann Non-Touch: Hände desinfizieren, alten Verband mit unsterilen Handschuhen ab, Handschuhwechsel, steriles Set, von innen nach außen, jede Kompresse einmal. Als eine Kompresse auf die Decke fiel, habe ich sie verworfen. Zum Schluss habe ich die Luxationsregeln mit ihr wiederholt." },
      { q: "Frau Nowak hat große Angst vor den Spritzen. Wie hast du Selbstbestimmung und Sicherheit abgewogen?", muster: "Ich habe ihre Angst nicht kleingeredet, sondern als Teil der Versorgung ernst genommen. Wir haben im Liegen geübt, ich habe jeden Schritt erklärt. Gleichzeitig darf die Thromboseprophylaxe nicht ausfallen. Deshalb habe ich parallel mit Arzt und Sozialdienst eine Alternative vorbereitet. So kann sie selbst entscheiden, ohne dass ein Risiko entsteht." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
