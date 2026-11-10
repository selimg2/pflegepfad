/* ===== Fall 6: Pädiatrie ===== */
(function () {
  var A = window.PXA; if (!A) return;

  function kid(x, y, hair, mood, sc) {
    sc = sc || 1;
    return A.g("translate(" + x + " " + y + ") scale(" + sc + ")", A.r(-26, 24, 52, 62, 18, "x-kidshirt") + A.head(0, 0, 24, hair || "x-hairb") + A.face(0, 2, mood) + A.p("M-20-12c6-10 34-10 40 0", hair || "x-hairb"));
  }
  function spacer(x, y, puff) {
    return A.p("M" + x + " " + (y - 14) + "h96a14 14 0 0 1 0 28H" + x + "z", "x-spacer") + A.r(x - 18, y - 6, 20, 12, 4, "x-spacer") +
      A.r(x + 104, y - 30, 24, 42, 6, "x-inh") + A.r(x + 98, y - 8, 14, 16, 3, "x-inh") + (puff ? A.e(x + 52, y, 34, 10, "x-mist") : "");
  }
  function nurse(x, y) { return A.head(x, y, 18, "x-hairy") + A.face(x, y + 2) + A.r(x - 22, y + 20, 44, 70, 16, "x-scrub"); }
  function clip(lines, title, mark) {
    var s = A.table() + A.r(60, 18, 280, 236, 8, "x-board") + A.r(74, 32, 252, 212, 4, "x-paper") + A.t(90, 56, title, "x-txt x-b", "start");
    lines.forEach(function (l, i) { var y = 84 + i * 25; if (mark && mark.indexOf(i) >= 0) s += A.r(84, y - 15, 232, 21, 4, "x-hl"); s += A.t(90, y, l, "x-txt x-s", "start"); });
    return s;
  }
  var inh = {
    plan: clip(["Lena Krüger · *14.03.2019 · 24 kg", "Salbutamol DA 100 µg: 2 Hübe via Spacer", "danach Budesonid DA 200 µg: 2 Hübe", "Allergie: Hausstaubmilbe, Erdnuss", "Ziel-SpO₂ ≥ 94 %", "AO Dr. Aksoy, 06:30"], "Kurve · Zi. K2-04", [1, 2]),
    erkl: A.room() + kid(140, 100, "x-hairy", "", 1.1) + nurse(270, 70) + A.e(96, 196, 18, 22, "x-teddy") + A.c(86, 172, 7, "x-teddy") + A.c(106, 172, 7, "x-teddy") + A.tag(200, 26, "„Wir pusten den Drachen in die Röhre“", "x-tag x-tagg"),
    mat: A.table() + spacer(80, 110, false) + A.t(140, 150, "Spacer mit Mundstück", "x-txt x-s") + A.t(220, 72, "Dosieraerosol", "x-txt x-s") + A.tag(200, 220, "sauber, trocken, passend zum Alter", "x-tag x-tagg"),
    sitz: A.room() + A.r(90, 140, 120, 80, 12, "x-chair") + kid(150, 92, "x-hairy", "", 1.1) + A.tag(260, 120, "aufrecht sitzen", "x-tag x-tagg"),
    shake: A.table() + A.r(170, 70, 36, 70, 8, "x-inh") + A.r(150, 130, 40, 24, 5, "x-inh") + A.p("M150 80c-14 10-14 30 0 40M226 80c14 10 14 30 0 40", "x-arrow") + A.tag(200, 210, "Kappe ab · kräftig schütteln", "x-tag"),
    hub: A.room() + kid(110, 96, "x-hairy", "flat", 1.1) + A.g("translate(16 0)", spacer(130, 120, true)) + A.tag(220, 40, "ausatmen · Lippen dicht · 1 Hub", "x-tag x-tagg"),
    atem: A.room() + kid(110, 96, "x-hairy", "flat", 1.1) + A.g("translate(16 0)", spacer(130, 120, false)) + [0, 1, 2, 3, 4].map(function (i) { return A.c(180 + i * 26, 200, 9, i < 3 ? "x-ok" : "x-tag"); }).join("") + A.tag(230, 40, "4–5 ruhige Atemzüge", "x-tag x-tagg"),
    warn: A.room() + kid(140, 100, "x-hairy", "sad", 1.1) + A.p("M110 92q-12-6-14-16M170 92q12-6 14-16", "x-arrow") + A.r(250, 60, 110, 70, 10, "x-digit") + A.t(305, 92, "SpO₂ 90 %", "x-digitt") + A.t(305, 114, "AF 42", "x-digitt") + A.tag(140, 236, "spricht nur in Ein-Wort-Sätzen", "x-tag x-tagr"),
    spuel: A.room() + kid(150, 100, "x-hairy", "", 1.1) + A.p("M210 130h30l-4 40h-22z", "x-cupb") + A.p("M212 142h26l-3 26h-20z", "x-aqua") + A.tag(200, 30, "nach Kortison: Mund ausspülen oder trinken", "x-tag x-tagg"),
    clean: A.table() + A.e(200, 140, 120, 34, "x-aqua") + A.g("translate(0 -20)", spacer(120, 150, false)) + A.tag(200, 220, "Spülwasser · lufttrocknen · nicht abreiben", "x-tag"),
    doku: clip(["07:40 Salbutamol 2 Hübe via Spacer", "07:50 Verschlechterung: SpO₂ 90 %, AF 42", "Dr. Aksoy 07:51, O₂ 2 l, Prednisolon (AO)", "08:20 Budesonid 2 Hübe, Mund gespült", "08:30 SpO₂ 95 %, ganze Sätze", "Mutter angeleitet, Teach-back · HZ"], "Pflegebericht Lena 08:35", [1])
  };

  function emilScene() {
    var s = A.room() + A.r(20, 130, 230, 80, 10, "x-cot") + A.p("M20 130v80M250 130v80M40 130v80M60 130v80M80 130v80M100 130v80", "x-rail2");
    var k = "";
    k += A.r(70, 120, 120, 70, 24, "x-kidshirt") + A.p("M118 124l12 14 12-14", "x-retr") + A.p("M96 152q14 4 28 0M96 166q14 4 28 0M136 152q14 4 28 0M136 166q14 4 28 0", "x-retr");
    k += A.head(130, 86, 32, "x-hairb") + A.e(118, 84, 7, 5, "x-socket") + A.e(142, 84, 7, 5, "x-socket") + A.c(118, 84, 2, "x-eye") + A.c(142, 84, 2, "x-eye");
    k += A.p("M124 96q6 4 12 0", "x-mouth") + A.p("M122 96l-4 2M138 96l4 2", "x-retr") + A.p("M122 108q8 4 16 0", "x-lipd") + A.p("M126 108l2 3M132 108l1 3", "x-lipc");
    k += A.r(86, 186, 34, 40, 10, "h-skin") + A.r(140, 186, 34, 40, 10, "h-skin") + [[94, 196], [104, 206], [112, 194], [150, 200], [160, 212], [166, 196]].map(function (p) { return A.e(p[0], p[1], 6, 4, "x-mottle"); }).join("");
    s += A.g("translate(130 150) scale(1.35) translate(-130 -150)", k);
    s += A.r(280, 120, 100, 10, 3, "x-chair") + A.p("M330 130v90", "x-metall") + A.p("M296 80h20v6l4 4v28h-28V90l4-4z", "x-amber") + A.r(298, 96, 18, 12, 2, "x-label") + A.t(307, 106, "PCM", "x-txt x-s") + A.e(350, 116, 16, 4, "x-spoon") + A.t(330, 150, "von zu Hause", "x-txt x-s");
    return s;
  }

  var C = {
    id: "paediatrie", titel: "Atemnot, Fieber, Unterzucker", station: "Pädiatrie · Kinderstation K2", haus: "Kinderklinik am Rosengarten", farbe: "#DB2777",
    icon: "M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM7 21v-5a5 5 0 0 1 10 0v5",
    kurz: "Eine freche Siebenjährige mit Asthmaanfall, ein fiebernder Dreijähriger, der nicht mehr trinkt, und ein Fußballer mit frischem Typ-1-Diabetes, der vor allem eins nicht will: peinlich auffallen.",
    anleitung: "Miriam Schulz", pruefer: "Herr Brandt",
    briefing: [
      "Hallo, ich bin Miriam Schulz, Praxisanleiterin auf der K2. Herr Brandt aus der Pflegeschule ist morgen dabei. Auf einer Kinderstation pflegst du nie nur ein Kind: Eltern gehören dazu, und Kinder sind keine kleinen Erwachsenen. Normwerte, Dosierungen und Warnzeichen sind andere.",
      "Deine drei Kinder: Lena hat einen Asthmaanfall und braucht Inhalationen. Emil ist drei und hat eine Lungenentzündung mit hohem Fieber. Ben ist elf und hat vor fünf Tagen erfahren, dass er Typ-1-Diabetes hat.",
      "Merk dir: Jede Kinderdosis wird über das Gewicht nachgerechnet, immer. Und wenn ein Kind still wird, ist das selten ein gutes Zeichen."
    ],
    order: ["A", "B", "C"],
    pat: {
      A: {
        key: "A", name: "Lena Krüger", kurz: "Lena", alter: 7, zimmer: "K2-04", modus: "Pflegehandlung", farbe: "#DB2777",
        typ: "Frech und neugierig, liebt Drachen und Einhörner, wird bei Atemnot sehr still.",
        diagnose: "Akute Exazerbation eines allergischen Asthma bronchiale bei Infekt der oberen Atemwege; Tag 1.",
        daten: [
          ["Vorerkrankungen", "Asthma bronchiale seit dem 4. Lebensjahr, Neurodermitis"],
          ["Allergien", "Hausstaubmilbe, Erdnuss (Anaphylaxie 2023, Notfallset)"],
          ["Soziales", "lebt mit Mutter und kleinem Bruder; Mutter rooming-in"],
          ["Medikation", "Salbutamol-Dosieraerosol 100 µg via Spacer: 2 Hübe alle 4 h und bei Bedarf · Budesonid-Dosieraerosol 200 µg 2 Hübe 1-0-1 · Prednisolon nach AO"],
          ["Vitalwerte Aufnahme, 22 Uhr", "AF 34/min · HF 128/min · SpO₂ 93 % · T 37,8 °C · Gewicht 24 kg"],
          ["Zu Hause", "Inhaliert „irgendwie mit dem Röhrchen“, Spacer seit einem Jahr nicht gereinigt"]
        ],
        erzaehler: "Mutter Sandra Krüger",
        anamnese: "Lena hat seit drei Tagen Schnupfen und seit gestern pfeift es beim Atmen. Das blaue Spray haben wir zu Hause dauernd gegeben, bestimmt zehnmal gestern, das hilft immer nur kurz. Das orangene, das Kortison, das hat sie die letzten Wochen nicht genommen, sie hat Angst, dass sie davon dick wird, das hat ein Kind in der Schule gesagt. Mit dem Röhrchen klappt das bei uns nicht so richtig, sie pustet immer rein statt raus, und meistens drück ich zweimal hintereinander, dann ist es schneller vorbei. Wenn es richtig schlimm ist, wird sie ganz still, das macht mir am meisten Angst. Ach, und Erdnüsse, um Gottes willen, da hatte sie letztes Jahr einen Schock, das Notfallset ist in meiner Tasche.",
        kern: [
          { t: "Übermäßiger Gebrauch von Salbutamol (ca. 10× am Tag) mit nur kurzer Wirkung: Zeichen eines schweren, schlecht kontrollierten Anfalls", kw: ["zehnmal", "10", "blaue", "salbutamol", "kurz", "übermäß"] },
          { t: "Inhalatives Kortison eigenmächtig abgesetzt (Angst, dick zu werden): Adhärenz und Fehlinformation", kw: ["kortison", "abgesetzt", "dick", "nicht genommen", "budesonid", "adhärenz"] },
          { t: "Fehlerhafte Inhalationstechnik (pustet hinein, zwei Hübe gleichzeitig): Schulungsbedarf für Kind und Mutter", kw: ["technik", "pustet", "zweimal", "hintereinander", "röhrchen", "schulung"] },
          { t: "„Wird ganz still“: Stille ist ein Warnzeichen für Erschöpfung beim Asthmaanfall", kw: ["still", "erschöpf", "warnzeichen"] },
          { t: "Erdnussallergie mit Anaphylaxie, Notfallset vorhanden", kw: ["erdnuss", "anaphyla", "notfallset", "schock"] },
          { t: "Spacer seit einem Jahr nicht gereinigt", kw: ["spacer", "gereinigt", "reinig"] },
          { t: "Mutter als Ressource, aber verunsichert und ängstlich", kw: ["mutter", "angst", "ressource", "rooming"] },
          { t: "Infekt der oberen Atemwege als Auslöser", kw: ["infekt", "schnupfen", "auslöser"] }
        ]
      },
      B: {
        key: "B", name: "Emil Hartwig", kurz: "Emil", alter: 3, zimmer: "K2-05", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#EA580C",
        typ: "Sonst fröhlich und laut, jetzt quengelig und schlapp, lässt sich nur von Mama halten.",
        diagnose: "Ambulant erworbene Pneumonie rechts mit Fieber; leichte bis mittelschwere Dehydratation; Tag 1.",
        daten: [
          ["Vorerkrankungen", "keine, Impfungen vollständig"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "Mutter alleinerziehend (Pflegehelferin im Altenheim), rooming-in, sehr erschöpft"],
          ["Medikation", "Amoxicillin-Saft 250 mg/5 ml: 4,7 ml (233 mg) 3× tgl. 08-16-24 · Paracetamol Supp. 250 mg bei Fieber > 38,5 °C, mind. 6 h Abstand, max. 4×/24 h · Ibuprofen pausiert (AO, Dehydratation) · NaCl-0,9-%-Inhalation 3 ml 3× tgl."],
          ["Gewicht", "Kinderarzt vor 2 Wochen: 14,0 kg · heute 06 Uhr: 13,2 kg"],
          ["Ausscheidung", "Windel seit gestern 22 Uhr trocken"]
        ],
        erzaehler: "Mutter Jessica Hartwig",
        anamnese: "Er trinkt seit gestern fast nichts mehr, alles, was ich ihm gebe, spuckt er wieder aus oder dreht den Kopf weg. Die Windel war heute Nacht trocken, das hatte er noch nie. Er ist so schlapp, sonst rennt er die ganze Zeit rum. Er atmet so schnell, und die Nase geht dabei so auf und zu. Ich hab ihm heute früh um halb sieben von unserem Fiebersaft gegeben, fünf Milliliter, der steht da auf dem Tisch, das hab ich der Nachtschwester aber nicht gesagt, die war so beschäftigt. Ich arbeite selbst in der Pflege, ich weiß ja, wie das ist. Ich hab seit zwei Nächten nicht geschlafen, und morgen muss ich eigentlich zur Arbeit, sonst krieg ich Ärger.",
        kern: [
          { t: "Trinkverweigerung, Erbrechen, trockene Windel seit über 8 Stunden: Dehydratation", kw: ["trink", "windel", "trocken", "dehydr", "spuckt"] },
          { t: "Gewichtsverlust 0,8 kg (ca. 6 %): mittelschwere Dehydratation", kw: ["gewicht", "13,2", "0,8", "6 %", "verlust"] },
          { t: "Schnelle Atmung mit Nasenflügeln: erhöhte Atemarbeit", kw: ["schnell", "nase", "nasenflügel", "atemarbeit", "tachypnoe"] },
          { t: "Mutter hat um 06:30 eigenen Paracetamol-Saft gegeben, nicht gemeldet: Gefahr der Doppelgabe", kw: ["fiebersaft", "paracetamol", "06:30", "halb sieben", "doppel", "nicht gesagt"] },
          { t: "Schlappheit, Lethargie: Warnzeichen beim Kleinkind", kw: ["schlapp", "lethar", "müde", "rennt"] },
          { t: "Mutter erschöpft, Schlafmangel, Arbeitsdruck: Entlastung, Sozialdienst", kw: ["erschöpf", "schlaf", "arbeit", "entlast", "sozialdienst", "mutter"] },
          { t: "Mutter mit Pflegeerfahrung: Ressource, aber auch Rollenkonflikt", kw: ["pflege", "ressource", "erfahrung", "altenheim"] },
          { t: "Pneumonie unter Antibiose, Fieber", kw: ["pneumonie", "fieber", "amoxicillin"] }
        ]
      },
      C: {
        key: "C", name: "Ben Schröder", kurz: "Ben", alter: 11, zimmer: "K2-06", modus: "Beratung", farbe: "#2563EB",
        typ: "Fußballverrückt, cool, will auf keinen Fall auffallen. Sein Vater ist Taxifahrer, freundlich und sehr nervös.",
        diagnose: "Diabetes mellitus Typ 1, Erstmanifestation mit leichter Ketoazidose vor 5 Tagen; intensivierte Insulintherapie mit Pen, CGM-Sensor; Tag 5.",
        daten: [
          ["Vorerkrankungen", "keine"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "lebt beim Vater (Taxifahrer, Schichtdienst), Mutter in Hamburg; Fußball 3× pro Woche"],
          ["Therapie", "Basalinsulin abends, Bolus zu den Mahlzeiten nach Schema, CGM mit Alarm < 70 mg/dl"],
          ["Schulungsplan", "Hypo-Behandlung: 12 g schnelle Kohlenhydrate (z. B. 4 Traubenzucker-Plättchen à 3 g), nach 15 min messen; Glukagon-Nasenspray im Notfall"],
          ["Gewicht", "38 kg"]
        ],
        anamnese: "Echt jetzt, ich soll mir jeden Tag in den Bauch stechen? Okay, die Pens sind eigentlich easy. Gestern Nachmittag war mir beim Tischkicker plötzlich voll zittrig, und ich hatte so krassen Hunger, der Sensor hat gepiept, 58. Die Schwester hat mir Traubenzucker gegeben. In der Schule soll das keiner wissen, sonst bin ich der Zuckerjunge. Und Fußball, darf ich da überhaupt noch spielen? Wir haben am Samstag ein Spiel. Papa hat total Angst, der hat gestern Nacht dreimal auf mein Handy geguckt, ob der Sensor was sagt.",
        kern: [
          { t: "Erste Hypoglykämie erlebt (58 mg/dl) mit Zittern und Heißhunger: Symptome kennt er schon", kw: ["zitter", "hunger", "58", "hypo", "unterzucker"] },
          { t: "Will nicht, dass es in der Schule bekannt wird: Scham, Sicherheitsrisiko", kw: ["schule", "keiner wissen", "peinlich", "scham", "zuckerjunge"] },
          { t: "Fußball 3× pro Woche, Spiel am Samstag: Sport und Hypoglykämierisiko", kw: ["fußball", "sport", "spiel", "samstag"] },
          { t: "Vater sehr ängstlich, kontrolliert nachts: Belastung, Beratung des Vaters", kw: ["vater", "papa", "angst", "nachts", "nacht"] },
          { t: "Vater im Schichtdienst: Versorgung und Notfallmanagement organisieren", kw: ["schicht", "taxi", "organis", "versorg"] },
          { t: "Pen-Handhabung „easy“: Ressource", kw: ["pen", "easy", "ressource", "selbst"] },
          { t: "CGM-Sensor mit Alarm als Sicherheitsressource", kw: ["sensor", "cgm", "alarm"] },
          { t: "Beratungsbedarf zu Glukagon-Notfall und Schulungsplan", kw: ["glukagon", "notfall", "schulungsplan"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Unwirksamer Atemvorgang (00032) b/d akuter Bronchialobstruktion bei Asthmaexazerbation, a/d Tachypnoe, Giemen, SpO₂ 93 %. Dazu: Unwirksames Gesundheitsmanagement (00078) b/d fehlerhafter Inhalationstechnik und abgesetztem Kortison, a/d Aussagen der Mutter.",
        ziel: "Lenas SpO₂ liegt bei mindestens 94 %, sie spricht in ganzen Sätzen. Lena und ihre Mutter demonstrieren bis zur Entlassung die Inhalation mit Spacer korrekt und nennen den Unterschied zwischen Notfall- und Dauerspray.",
        mass: [
          "Vitalzeichen mit Atemfrequenz, SpO₂, Sprechdyspnoe und Einziehungen vor und nach jeder Inhalation",
          "Inhalation mit Dosieraerosol und Spacer korrekt durchführen: ein Hub pro Füllung, ruhige Atemzüge; Kortison nach dem Bronchodilatator, danach Mund spülen",
          "Warnzeichen (Stille, Erschöpfung, SpO₂ < 92 %, Ein-Wort-Sätze) sofort ärztlich melden",
          "Schulung von Lena und Mutter mit kindgerechten Bildern und Teach-back; Kortison-Mythos aufklären",
          "Erdnussallergie sichtbar dokumentieren, Notfallset-Handhabung mit der Mutter prüfen"
        ],
        chk: [
          { t: "Atemproblem als Diagnose mit Kennzeichen", kw: ["atem", "obstrukt", "atemvorgang"] },
          { t: "Selbstmanagement/Inhalationstechnik als Problem", kw: ["technik", "selbstmanag", "gesundheitsmanag", "schulung"] },
          { t: "Ziel mit SpO₂ oder Sprechfähigkeit und Demonstration", kw: ["94", "sätzen", "demonstr", "ziel"] },
          { t: "Korrekte Inhalation mit Spacer", kw: ["spacer", "hub", "atemzüge"] },
          { t: "Kortison nach Salbutamol, Mund spülen", kw: ["kortison", "mund", "spül"] },
          { t: "Warnzeichen / Stille", kw: ["warnzeichen", "still", "92"] },
          { t: "Erdnussallergie/Notfallset", kw: ["erdnuss", "notfallset", "anaphyla"] }
        ]
      },
      B: {
        diag: "Flüssigkeitsdefizit (00027) b/d Fieber, Tachypnoe und Trinkverweigerung, a/d Gewichtsverlust 6 %, trockener Windel seit über 8 Stunden und trockenen Schleimhäuten. Dazu: Gefahr eines Medikationsfehlers b/d nicht gemeldeter Paracetamolgabe durch die Mutter.",
        ziel: "Emil nimmt die ärztlich festgelegte Flüssigkeitsmenge auf (oral oder i.v.), die Windel ist innerhalb von 4 Stunden nass. Die Mutter gibt keine Medikamente ohne Absprache und meldet jede Gabe.",
        mass: [
          "Vitalzeichen mit Altersnormen, Rekapillarisierung, Bewusstsein; Gewicht täglich gleiche Waage",
          "Orale Rehydratation in kleinen Mengen (Löffel/Spritze alle 1–2 Minuten) nach Anordnung; Windeln wiegen, Bilanz",
          "Fiebersenkung nur nach Anordnung, Abstand zur letzten Gabe prüfen",
          "Mit der Mutter vereinbaren, dass alle Medikamente über die Station laufen; eigene Medikamente sicher verwahren",
          "Mutter entlasten (Pausen, Essen, Schlaf), Sozialdienst wegen Arbeitgeber"
        ],
        chk: [
          { t: "Flüssigkeitsdefizit/Dehydratation als Diagnose", kw: ["flüssigkeit", "dehydr"] },
          { t: "Medikationsrisiko durch Paracetamol der Mutter", kw: ["paracetamol", "mutter", "doppel", "fiebersaft"] },
          { t: "Ziel mit Trinkmenge/Windel", kw: ["windel", "trinkmenge", "ml", "ziel"] },
          { t: "Altersnormen beachtet", kw: ["altersnorm", "norm", "kind"] },
          { t: "Orale Rehydratation in kleinen Mengen, Windeln wiegen", kw: ["rehydr", "kleine", "löffel", "windel", "wiegen"] },
          { t: "Mutter einbeziehen und entlasten", kw: ["mutter", "entlast", "sozialdienst"] }
        ]
      },
      C: {
        diag: "Bereitschaft für ein verbessertes Gesundheitsmanagement bei neu diagnostiziertem Diabetes Typ 1; Gefahr eines instabilen Blutzuckerspiegels (00179) b/d Sport und neuer Insulintherapie; Angst des Vaters.",
        ziel: "Ben nennt drei Hypoglykämiezeichen und demonstriert die Behandlung nach Schulungsplan (Teach-back). Der Vater beschreibt das Vorgehen bei Bewusstlosigkeit inklusive Glukagon. Ben entscheidet mit, wer in der Schule informiert wird.",
        mass: [
          "Beratung zu Hypo-Zeichen und Behandlung nach Schulungsplan (12 g schnelle KH, 15-Minuten-Regel)",
          "Notfall: Glukagon-Nasenspray üben, stabile Seitenlage, 112",
          "Sport: vor, während und nach dem Training messen, Anpassung mit dem Diabetesteam",
          "Schule: Notfallplan, Klassen- und Sportlehrkraft informieren, Bens Wünsche einbeziehen",
          "Vater entlasten: CGM-Alarme, Ansprechpartner, Schulungsangebot"
        ],
        chk: [
          { t: "Gesundheitsmanagement/Wissensbedarf als Diagnose", kw: ["gesundheitsmanag", "wissen", "beratung", "schulung"] },
          { t: "Gefahr instabiler Blutzucker", kw: ["blutzucker", "hypo", "instabil"] },
          { t: "Ziel mit Teach-back", kw: ["teach", "nennt", "demonstr"] },
          { t: "15-Minuten-Regel / schnelle KH", kw: ["15", "traubenzucker", "kohlenhydrat"] },
          { t: "Glukagon-Notfall", kw: ["glukagon"] },
          { t: "Schule/Sport einbezogen", kw: ["schule", "sport", "fußball"] }
        ]
      }
    },
    nacht: [
      ["A", "Lena: Um 03 Uhr Salbutamol 2 Hübe, danach besser. Seit 05 Uhr wieder Giemen, AF 36. Die Mutter hat ihr in der Nacht zweimal „ihr eigenes Spray“ gegeben, ich weiß nicht genau, welches. Kinderärztin hat um 06:30 neu angeordnet."],
      ["B", "Emil: Fieber 39,6 °C um 02 Uhr, Paracetamol Supp. 250 mg um 02:00 gegeben. Trinkt kaum, hat einmal erbrochen. Windel seit 22 Uhr trocken. Gewicht 06 Uhr 13,2 kg."],
      ["C", "Ben: BZ nachts stabil zwischen 110 und 160, Sensor ohne Alarm. Vater hat neben ihm geschlafen und ist nervös. Schulung mit Diabetesberatung heute 11 Uhr."]
    ],
    sbar: {
      A: {
        muster: {
          S: "Lena, 7, Zimmer K2-04, Asthmaexazerbation, Tag 1. Seit 05 Uhr erneut Giemen, AF 36; die Mutter hat nachts zweimal ein eigenes Spray gegeben.",
          B: "Zu Hause etwa 10 Salbutamol-Gaben pro Tag, Kortison abgesetzt, Inhalationstechnik fehlerhaft. Erdnussallergie mit Anaphylaxie.",
          A: "Schlecht kontrolliertes Asthma mit Verschlechterungsgefahr; unklare Zusatzgaben durch die Mutter.",
          R: "Vitalzeichen vor und nach Inhalation, Inhalation korrekt mit Spacer nach neuer AO, Warnzeichen beobachten, mit der Mutter klären, was sie gegeben hat."
        },
        chk: [
          { t: "S: aktuelle Verschlechterung mit AF/Giemen", kw: ["giemen", "36", "verschlecht"] },
          { t: "S/B: eigenes Spray der Mutter", kw: ["eigenes spray", "mutter"] },
          { t: "B: Kortison abgesetzt, Technik", kw: ["kortison", "technik"] },
          { t: "B: Erdnussallergie", kw: ["erdnuss"] },
          { t: "R: Inhalation korrekt, Warnzeichen", kw: ["spacer", "warnzeichen", "inhalation"] }
        ]
      },
      B: {
        muster: {
          S: "Emil, 3, Zimmer K2-05, Pneumonie, Tag 1. Fieber 39,6 °C um 02 Uhr, trinkt kaum, Windel seit 22 Uhr trocken, Gewicht 13,2 kg (vorher 14,0).",
          B: "Amoxicillin 3× tgl., Paracetamol Supp. um 02 Uhr, Ibuprofen pausiert. Mutter erschöpft.",
          A: "Mittelschwere Dehydratation (ca. 6 % Gewichtsverlust) bei Fieber und Tachypnoe.",
          R: "Vitalzeichen mit Altersnormen, Arzt informieren, Rehydratation nach Anordnung, Medikamentengaben genau abgleichen."
        },
        chk: [
          { t: "S: Trinkmenge, trockene Windel, Gewicht", kw: ["windel", "13,2", "trink"] },
          { t: "B: letzte Paracetamolgabe 02 Uhr", kw: ["02", "paracetamol"] },
          { t: "A: Dehydratation mit Prozent", kw: ["dehydr", "6 %", "prozent"] },
          { t: "R: Arzt, Rehydratation", kw: ["arzt", "rehydr", "infusion"] },
          { t: "Mutter erwähnt", kw: ["mutter"] }
        ]
      },
      C: {
        muster: {
          S: "Ben, 11, Zimmer K2-06, Typ-1-Diabetes Erstmanifestation, Tag 5. Nachts stabil.",
          B: "Gestern erste Hypoglykämie (58 mg/dl) beim Spielen, CGM mit Alarm, Pen-Therapie. Fußballspieler, Spiel am Samstag.",
          A: "Großer Beratungsbedarf bei Ben und seinem ängstlichen Vater; Ben will in der Schule nicht auffallen.",
          R: "Nach der Diabetesberatung um 11 Uhr ein Beratungsgespräch zu Hypoglykämie, Sport, Schule und Notfall mit Teach-back."
        },
        chk: [
          { t: "S: Diagnose, stabile Nacht", kw: ["typ 1", "stabil"] },
          { t: "B: erste Hypo", kw: ["58", "hypo"] },
          { t: "B: Fußball", kw: ["fußball", "sport"] },
          { t: "A: Beratungsbedarf, Vater ängstlich", kw: ["beratung", "vater", "angst"] },
          { t: "R: Beratung mit Teach-back", kw: ["teach", "beratung"] }
        ]
      }
    },
    prio: [
      { id: "l1", t: "Lena: Atemfrequenz, SpO₂, Sprechdyspnoe; klären, welches Spray die Mutter nachts gegeben hat", zeit: "06:15", warum: "Akute Atemnot hat Vorrang; unklare Zusatzgaben müssen sofort geklärt werden." },
      { id: "e1", t: "Emil: Vitalzeichen mit Altersnormen, Hydratationszustand, Gewicht", zeit: "06:30", warum: "Dehydratation beim Kleinkind kann schnell kippen." },
      { id: "ar", t: "Ärztin über Emil informieren (Dehydratation)", zeit: "06:45", warum: "Rehydratationsplan ist ärztlich anzuordnen." },
      { id: "l2", t: "Lena: Inhalation mit Spacer nach neuer Anordnung", zeit: "07:40", warum: "Angeordnet für 07:40, Wirkung vor dem Frühstück." },
      { id: "md", t: "Medikamente 08 Uhr prüfen, Kinderdosen über das Gewicht nachrechnen", zeit: "07:55", warum: "Gewichtsbasierte Dosierung, Vier-Augen-Prinzip." },
      { id: "fr", t: "Frühstück, Bens BZ vor dem Essen, Bolus nach Schema mit Ben", zeit: "08:00", warum: "Zeitgebunden an die Mahlzeit, Ben spritzt selbst unter Aufsicht." },
      { id: "e2", t: "Emil: orale Rehydratation in kleinen Mengen beginnen, Windeln wiegen", zeit: "08:15", warum: "Kontinuierlich, nicht auf einmal." },
      { id: "be", t: "Ben: Beratungsgespräch nach der Diabetesschulung", zeit: "11:30", warum: "Nach der Schulung gezielt vertiefen." },
      { id: "mu", t: "Emils Mutter: Pause organisieren, Sozialdienst wegen Arbeitgeber", zeit: "12:00", warum: "Entlastung der Bezugsperson ist Pflegeaufgabe." },
      { id: "do", t: "Dokumentation, Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend dokumentieren, hier ergänzen." }
    ],
    live: [
      {
        k: "emilbild", typ: "hotspot", pat: "B", t: "Emil · Bildbefund", kurzname: "Bildbefund kleines Kind", clock: "06:30", max: 8,
        titel: "Emil im Gitterbett",
        intro: "06:30 Uhr. Emil liegt im Gitterbett, die Mutter sitzt daneben und döst. Er weint nicht, er wimmert nur leise.",
        q: "Welche Zeichen und Risiken erkennst du bei Emil?",
        art: emilScene(),
        spots: [
          { c: [[130, 76, 12]], t: "Nasenflügeln", d: "Bei Kleinkindern ein frühes Zeichen erhöhter Atemarbeit." },
          { c: [[130, 123, 14], [130, 161, 27]], t: "Juguläre und interkostale Einziehungen", d: "Einziehungen am Hals und zwischen den Rippen zeigen, wie viel Kraft das Atmen kostet. Atemfrequenz im Liegen und in Ruhe über eine Minute zählen." },
          { c: [[130, 95, 11]], t: "Trockene, rissige Lippen", d: "Trockene Schleimhäute sind ein Zeichen der Dehydratation." },
          { c: [[114, 61, 12], [146, 61, 12]], t: "Eingesunkene Augen mit Schatten", d: "Halonierte, eingesunkene Augen deuten auf eine mittelschwere Dehydratation." },
          { c: [[94, 224, 22], [166, 224, 22]], t: "Marmorierte Haut an den Beinen", d: "Marmorierung zeigt eine gestörte Mikrozirkulation (Zentralisation): Rekapillarisierungszeit prüfen, ärztlich melden." },
          { c: [[306, 96, 18]], t: "Eigener Paracetamol-Saft auf dem Tisch", d: "Die Mutter hat um 06:30 Paracetamol gegeben, ohne es zu melden. Bei Kindern führen Doppelgaben schnell zu Überdosierungen. Freundlich klären und sicher verwahren." }
        ],
        extra: ["Exanthem am Bauch", "Nackensteifigkeit", "Ödeme an den Füßen", "Petechien im Gesicht"],
        cap: "Tipp: Nase, Hals und Brust, Mund, Augen, Beine, Nachttisch.",
        merke: "Kleine Kinder zeigen Not leise: Nasenflügeln, Einziehungen, trockene Lippen, eingesunkene Augen, Marmorierung. Und alles, was Eltern geben, gehört in die Kurve."
      },
      {
        k: "emilvit", typ: "vitmed", pat: "B", t: "Emil · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Kinderdosierung", clock: "06:35", max: 10, wVit: 0.45,
        titel: "Vitalzeichen mit Altersnormen und gewichtsbasierte Medikamente",
        banner: { name: "Emil Hartwig", sub: "3 J. · Zimmer K2-05 · Pneumonie · 13,2 kg (vorher 14,0)", chips: [["Paracetamol: Mutter 06:30!", "red"], ["Ibuprofen pausiert", ""], ["Windel seit 22 Uhr trocken", ""]] },
        intro: "Die Mutter wird wach: „Er ist so ruhig. Ist das gut, dass er endlich schläft?“",
        uhr: "06:36",
        vit: {
          auftrag: "Altersnormen bei 3 Jahren (Orientierung): HF etwa 90–140/min, AF etwa 20–30/min. Tippe auf die Messgeräte.",
          items: [
            { k: "af", t: "Atemfrequenz", kurz: "AF", val: "44", einheit: "/min", farbe: "af", wie: "zählen", q: { text: "Wie zählst du Emils Atemfrequenz?", opts: [
              { t: "Eine volle Minute in Ruhe, am besten durch Beobachten der Bauch- und Brustbewegung, bevor ich ihn anfasse", ok: true, fb: "Richtig. Weinen und Berührung verfälschen die Atemfrequenz bei Kleinkindern stark." },
              { t: "Nach dem Fiebermessen, wenn er wach ist", fb: "Dann weint er wahrscheinlich, die Atemfrequenz ist nicht verwertbar." },
              { t: "15 Sekunden zählen und mal vier", fb: "Bei Kindern atmet man unregelmäßig. Eine volle Minute." }] } },
            { k: "puls", t: "Herzfrequenz", kurz: "HF", val: "156", einheit: "/min", farbe: "puls", wie: "tasten" },
            { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "93", einheit: "% Raumluft", farbe: "spo2", wie: "Sensor" },
            { k: "temp", t: "Temperatur", kurz: "Temp", val: "39,4", einheit: "°C", farbe: "temp", wie: "Ohr", q: { text: "Wie misst du bei Emil (3 Jahre) die Temperatur?", opts: [
              { t: "Im Ohr nach Hausstandard: Ohrmuschel leicht nach hinten oben ziehen, Sonde abdichten; bei Zweifel rektal", ok: true, fb: "Richtig. Ab etwa 2 Jahren ist die Ohrmessung zuverlässig, wenn die Technik stimmt." },
              { t: "Unter der Achsel, das ist am genauesten", fb: "Axillär misst ungenau und zu niedrig." },
              { t: "Mit der Hand auf der Stirn, er ist ja eindeutig heiß", fb: "Kein Messwert, nicht dokumentierbar." }] } },
            { k: "rr", t: "Blutdruck", kurz: "NIBP", val: "92/56", einheit: "mmHg", farbe: "rr", wie: "Kindermanschette" },
            { k: "bew", t: "Bewusstsein", kurz: "AVPU", val: "V", einheit: "reagiert erst auf Ansprache", farbe: "bew", wie: "ansprechen" },
            { k: "gew", t: "Rekapillarisierung", kurz: "Rekap.", ico: "puls", val: "3", einheit: "Sekunden", farbe: "gew", wie: "Brustbein" }
          ],
          befund: "Schleimhäute trocken, keine Tränen beim Wimmern, Haut an den Beinen marmoriert, Gewichtsverlust 0,8 kg (ca. 6 %).",
          act: { text: "Was ist deine Einschätzung, und was tust du?", opts: [
            { t: "AF, HF und Temperatur deutlich über der Altersnorm, SpO₂ erniedrigt, schläfrig und mittelschwer dehydriert: Ärztin sofort informieren, O₂ nach Anordnung, bei ihm bleiben bzw. engmaschig überwachen, Rehydratation nach Anordnung vorbereiten, Paracetamol-Gabe der Mutter melden", ok: true, fb: "Richtig. Ein schläfriges, dehydriertes Kleinkind mit Tachypnoe ist ein dringender Fall." },
            { t: "Er schläft endlich, also schlafen lassen und in zwei Stunden wieder messen", fb: "Gefährlich: Reaktion erst auf Ansprache ist bei diesem Befund ein Alarmzeichen, kein erholsamer Schlaf." },
            { t: "Sofort Paracetamol-Zäpfchen gegen das Fieber geben", fb: "Die Mutter hat um 06:30 Paracetamol gegeben. Jetzt wäre es eine Doppelgabe." },
            { t: "Ihm schnell eine große Flasche Tee geben", fb: "Große Mengen erbricht er. Rehydratation in kleinen Portionen und nach ärztlichem Plan." }] }
        },
        med: {
          zeit: "08:00", allergie: "keine bekannt",
          hinweis: "07:00 Uhr, Dr. Aksoy: „Rehydratation über eine Infusion, die lege ich gleich an. Amoxicillin weiter wie angeordnet. Paracetamol frühestens 12:30 Uhr wieder, die Gabe der Mutter um 06:30 zählt. Ibuprofen bleibt pausiert. Inhalation NaCl wie angeordnet.“",
          plan: [
            { n: "Amoxicillin-Saft 250 mg/5 ml", d: "4,7 ml (233 mg)", z: "08-16-24", h: "50 mg/kg/Tag in 3 ED" },
            { n: "Paracetamol Supp.", d: "250 mg", z: "bei Fieber > 38,5 °C", h: "mind. 6 h Abstand · nächste ab 12:30" },
            { n: "Ibuprofen-Saft", d: "–", z: "–", h: "pausiert (Dehydratation)", aus: true },
            { n: "NaCl 0,9 % Inhalation", d: "3 ml", z: "08-14-20", h: "Vernebler mit Maske" }
          ],
          disp: [
            { n: "Amoxicillin-Saft", sub: "Oralspritze mit 9,4 ml", pill: { c: "#fbcfe8", s: "saft" }, r: "dosis", fb: "Doppelte Dosis: 50 mg/kg/Tag × 14 kg = 700 mg ÷ 3 = 233 mg = 4,7 ml. Neu aufziehen, Vier-Augen-Kontrolle." },
            { n: "Paracetamol Supp. 250 mg", sub: "1 Zäpfchen", pill: { c: "#fef3c7", s: "supp" }, r: "zeit", fb: "Die Mutter hat um 06:30 Paracetamol gegeben. Die nächste Gabe ist frühestens 12:30 Uhr möglich." },
            { n: "Ibuprofen-Saft 2 %", sub: "Messbecher 7 ml", pill: { c: "#fed7aa", s: "saft" }, r: "pause", fb: "Pausiert: Bei Dehydratation steigt das Risiko einer Nierenschädigung durch NSAR." },
            { n: "NaCl 0,9 % 3 ml", sub: "Inhalationsampulle", pill: { c: "#e0f2fe", s: "saft" }, r: "ok", fb: "Angeordnet für 08 Uhr über den Vernebler mit Maske." }
          ]
        },
        final: { text: "Rechne nach: Amoxicillin 50 mg/kg/Tag in 3 Einzeldosen, Emil wiegt 14 kg (Ausgangsgewicht), Saft 250 mg/5 ml. Wie viele ml pro Gabe?", opts: [
          { t: "4,7 ml", ok: true, fb: "Richtig: 700 mg/Tag, 233 mg pro Gabe, 50 mg pro ml → 4,7 ml." },
          { t: "9,3 ml", fb: "Das wäre die doppelte Dosis, genau der Fehler im Dispenser." },
          { t: "14 ml", fb: "Das wäre die Tagesdosis in ml, nicht die Einzeldosis." },
          { t: "2,3 ml", fb: "Das wäre die halbe Dosis." }] },
        merke: "Kinderdosen werden immer über das Gewicht nachgerechnet, und Gaben durch Eltern zählen mit."
      },
      {
        k: "inhalation", typ: "steps", pat: "A", t: "Lena · Inhalation", kurzname: "Inhalation mit Spacer Schritt für Schritt", clock: "07:40", max: 16,
        titel: "Inhalation mit Dosieraerosol und Spacer bei einem Kind",
        icon: "M4 10h12a3 3 0 0 1 0 6H4zM16 6v4M19 8h2",
        banner: { name: "Lena Krüger", sub: "7 J. · Zimmer K2-04 · 24 kg · Asthmaexazerbation", chips: [["Allergie: Erdnuss (Anaphylaxie)", "red"], ["Hausstaubmilbe", ""], ["Mutter rooming-in", ""]] },
        intro: "07:40 Uhr. Neue Anordnung von 06:30 Uhr: Salbutamol-Dosieraerosol 100 µg, 2 Hübe über Spacer; danach Budesonid-Dosieraerosol 200 µg, 2 Hübe. Lena sitzt mit ihrem Plüschdrachen im Bett, die Mutter daneben. AF 36/min, SpO₂ 93 %.",
        ko: ["Kein Erkennen bzw. Melden einer Verschlechterung (Ein-Wort-Sätze, SpO₂ unter 92 %)", "Medikament eines anderen Kindes verwenden oder Identität nicht prüfen", "Kortison vor dem Bronchodilatator bei akuter Atemnot"],
        merke: "Ein Hub, eine Spacer-Füllung, ruhig atmen. Erst weit stellen (Salbutamol), dann entzünden lassen (Kortison) und danach Mund spülen.",
        steps: [
          { t: "Anordnung und Identität", ph: "vor", img: "plan", q: "Womit beginnst du?", opts: [
            { t: "Anordnung prüfen (Wirkstoffe, Dosis, Reihenfolge, Applikation), Identität über Armband und Mutter, Allergien; klären, was die Mutter nachts gegeben hat", ok: true, fb: "Richtig. Die nächtlichen Zusatzgaben verändern die Einschätzung." },
            { t: "Ich nehme das Spray, das auf dem Nachttisch liegt", ko: true, fb: "Kritisch: Es könnte das Spray der Familie oder eines anderen Kindes sein." },
            { t: "Ich frage Lena, ob sie Lena ist", fb: "Bei Kindern Identität über Armband und Bezugsperson sichern." }
          ] },
          { t: "Kindgerecht erklären", ph: "vor", img: "erkl", q: "Wie erklärst du Lena die Inhalation?", opts: [
            { t: "Mit einem Bild, das zu ihr passt: „Wir pusten erst den Drachen raus und atmen dann ganz ruhig die Medizin aus der Röhre ein.“ Die Mutter darf zuschauen und lernt mit", ok: true, fb: "Richtig. Kinder kooperieren, wenn sie verstehen und mitspielen dürfen." },
            { t: "„Das muss jetzt sein, sonst kommst du auf die Intensivstation.“", fb: "Angst verschlechtert die Atmung." },
            { t: "Ich erkläre nur der Mutter, Lena ist zu klein", fb: "Mit sieben Jahren versteht Lena viel und muss es selbst lernen." }
          ] },
          { t: "Material", ph: "vor", img: "mat", q: "Welches Material?", opts: [
            { t: "Dosieraerosole laut Anordnung, Spacer mit Mundstück (passend für Kinder ab etwa 4–6 Jahren), sauber und trocken; Händedesinfektion", ok: true, fb: "Richtig. Mit sieben Jahren kann Lena ein Mundstück dicht umschließen, eine Maske ist nicht mehr nötig." },
            { t: "Spacer mit Maske für Säuglinge", fb: "Für Lena zu klein und bei ihr nicht nötig." },
            { t: "Ohne Spacer direkt in den Mund sprühen, geht schneller", fb: "Ohne Spacer landet ein Großteil im Rachen. Bei Kindern ist der Spacer Standard." }
          ] },
          { t: "Position", ph: "vor", img: "sitz", q: "Wie sitzt Lena?", opts: [
            { t: "Aufrecht sitzend, Kopf leicht angehoben, Schultern locker", ok: true, fb: "Richtig. Aufrecht entfaltet sich die Lunge besser." },
            { t: "Liegend, damit sie sich entspannt", fb: "Im Liegen ist die Atemmechanik schlechter, gerade bei Atemnot." },
            { t: "Wie sie möchte, Hauptsache sie macht mit", fb: "Mitmachen ja, aber aufrecht." }
          ] },
          { t: "Vorbereiten", ph: "durch", img: "shake", q: "Wie bereitest du das Salbutamol-Dosieraerosol vor?", opts: [
            { t: "Kappe abnehmen, kräftig schütteln, senkrecht in die Öffnung des Spacers stecken", ok: true, fb: "Richtig. Die Suspension muss vor jedem Hub gemischt werden." },
            { t: "Nicht schütteln, das bildet Schaum", fb: "Ohne Schütteln stimmt die Dosis nicht." },
            { t: "Schräg einstecken, Hauptsache es hält", fb: "Senkrecht, sonst gelangt weniger Wirkstoff in die Kammer." }
          ] },
          { t: "Hub auslösen", ph: "durch", img: "hub", q: "Wie geht es weiter?", opts: [
            { t: "Lena atmet aus (nicht in den Spacer), umschließt das Mundstück dicht mit den Lippen, dann löst du einen Hub aus", ok: true, fb: "Richtig. Ausatmen vorher schafft Platz für die Medizin." },
            { t: "Lena pustet in den Spacer, dann ein Hub", fb: "Genau der Fehler von zu Hause: Pusten bläst das Medikament hinaus." },
            { t: "Zwei Hübe gleichzeitig in den Spacer, das spart Zeit", fb: "Mehrere Hübe auf einmal verklumpen und haften an der Wand. Ein Hub pro Füllung." }
          ] },
          { t: "Einatmen", ph: "durch", img: "atem", q: "Wie atmet Lena das Medikament ein?", opts: [
            { t: "4–5 ruhige Atemzüge durch das Mundstück (oder langsam tief einatmen und kurz anhalten), du zählst mit", ok: true, fb: "Richtig. Ruhige Atemzüge leeren die Kammer zuverlässig." },
            { t: "Einmal ganz schnell und kräftig einatmen", fb: "Schnelles Einatmen lässt das Medikament im Rachen hängen." },
            { t: "Sofort danach sprechen lassen, wie es war", fb: "Erst die Atemzüge, dann sprechen." }
          ] },
          { t: "Zweiter Hub", ph: "durch", img: "shake", q: "Der zweite Salbutamol-Hub:", opts: [
            { t: "Etwa 30–60 Sekunden warten, erneut schütteln und genauso wiederholen", ok: true, fb: "Richtig. Jeder Hub einzeln mit Schütteln." },
            { t: "Sofort ohne Schütteln hinterher", fb: "Ohne Schütteln stimmt die Dosis nicht." },
            { t: "Gleich das Kortison hinterher, das zählt als zweiter Hub", fb: "Zwei verschiedene Medikamente, zwei Hübe Salbutamol sind angeordnet." }
          ] },
          { t: "Wirkung prüfen", ph: "durch", img: "warn", q: "Zehn Minuten später: Lena spricht nur noch in einzelnen Worten, SpO₂ 90 %, AF 42/min, sichtbare Einziehungen, sie wird still. Was tust du?", opts: [
            { t: "Bei ihr bleiben, Notruf bzw. Ärztin sofort, Oberkörper hoch (Kutschersitz), Sauerstoff nach Standard, Mutter beruhigen und einbeziehen", ok: true, fb: "Richtig. Stille und Ein-Wort-Sätze sind Zeichen eines schweren Anfalls." },
            { t: "Noch zwei Hübe Salbutamol hinterher und abwarten", ko: true, fb: "Kritisch: Selbstständige Dosiserhöhung ohne ärztliche Beurteilung und Zeitverlust bei einem schweren Anfall." },
            { t: "Sie wird ruhiger, die Inhalation wirkt also", ko: true, fb: "Kritisch: Stille ist hier Erschöpfung, kein Erfolg." }
          ] },
          { t: "Kortison", ph: "durch", img: "spuel", q: "Nach der ärztlichen Behandlung ist Lena stabiler (SpO₂ 95 %). Jetzt das Budesonid. Was ist wichtig?", opts: [
            { t: "Gleiche Technik mit dem Spacer; danach Mund ausspülen oder etwas trinken bzw. essen, um Pilzbefall im Mund vorzubeugen", ok: true, fb: "Richtig. Kortison nach dem Bronchodilatator, dann Mundpflege." },
            { t: "Kortison zuerst, damit es besser wirkt", fb: "Bei akuter Atemnot zuerst erweitern (Salbutamol), dann Kortison." },
            { t: "Kortison weglassen, die Mutter will es sowieso nicht", fb: "Ist angeordnet. Die Sorge der Mutter wird im Gespräch geklärt." }
          ] },
          { t: "Spacer reinigen", ph: "nach", img: "clean", q: "Wie wird der Spacer gepflegt?", opts: [
            { t: "Nach Herstellerangabe regelmäßig zerlegen, in Wasser mit etwas Spülmittel einlegen, nicht nachspülen bzw. nach Hersteller, an der Luft trocknen lassen, nicht abreiben", ok: true, fb: "Richtig. Abreiben lädt die Kammer statisch auf, dann haftet das Medikament an der Wand." },
            { t: "Mit einem Tuch trocken reiben, damit er schneller fertig ist", fb: "Statische Aufladung: Das Medikament bleibt an der Wand." },
            { t: "Nie reinigen, das Medikament ist ja keimfrei", fb: "Ablagerungen und Keime sammeln sich an." }
          ] },
          { t: "Schulung und Dokumentation", ph: "nach", img: "doku", q: "Zum Abschluss:", opts: [
            { t: "Lena und Mutter erklären lassen, was sie gemacht haben (Teach-back), Unterschied blaues Notfallspray und Kortison-Dauerspray, Kortison-Mythos aufklären; Dokumentation mit Uhrzeiten, Werten vorher und nachher, Verschlechterung und Maßnahmen", ok: true, fb: "Richtig. Ohne Schulung beginnt der nächste Anfall zu Hause wieder mit falscher Technik." },
            { t: "„Inhalation gemacht“ eintragen", fb: "Ohne Werte und Verlauf nicht verwertbar." },
            { t: "Die Mutter auf eine Asthmaschulung in drei Monaten verweisen", fb: "Schulung beginnt jetzt, nicht irgendwann." }
          ] }
        ],
        art: inh
      },
      {
        k: "hypo", typ: "beratung", pat: "C", t: "Ben · Beratung Unterzuckerung", kurzname: "Beratung Hypoglykämie", clock: "11:30", max: 6,
        titel: "Was tun bei Unterzucker?",
        banner: { name: "Ben Schröder", sub: "11 J. · Zimmer K2-06 · Typ-1-Diabetes, Tag 5 · 38 kg", chips: [["Schulungsplan: 12 g schnelle KH", ""], ["CGM mit Alarm", ""], ["Fußball Samstag", ""]] },
        intro: "11:30 Uhr. Ben kommt mit seinem Vater aus der Diabetesschulung. Ben hat die Kapuze auf, der Vater hält einen dicken Ordner.",
        person: { name: "Ben und sein Vater" },
        qs: [
          { q: "Ben: „Woran merk ich eigentlich, dass ich unterzuckert bin? Gestern hab ich's ja nur gemerkt, weil der Sensor gepiept hat.“", re: "Ben: „Zittern und Hunger, das war gestern. Okay.“", opts: [
            { t: "„Typisch sind Zittern, Schwitzen, Heißhunger, Herzklopfen, Blässe, Kopfweh, schlechte Konzentration oder komische Laune. Wenn du unsicher bist: messen. Und manche merken lange gar nichts, deshalb ist der Sensor so wichtig.“", ok: true, fb: "Richtig. Konkrete Zeichen und die Regel „im Zweifel messen“." },
            { t: "„Das merkst du schon, wenn du umkippst.“", fb: "Gefährlich: Bewusstlosigkeit ist das späte Stadium." },
            { t: "„Vor allem an starkem Durst.“", fb: "Durst passt eher zu hohem Blutzucker." }
          ] },
          { q: "Ben: „Und was mach ich dann beim Fußball? Ich will nicht vom Platz.“", re: "Ben: „Na gut. Dann ist der Traubenzucker eben im Stutzen.“", opts: [
            { t: "„Sofort raus und Pause, auch im Spiel. 12 Gramm schnelle Kohlenhydrate, wie in deinem Plan, nach 15 Minuten messen. Erst wieder spielen, wenn der Wert wieder im Zielbereich ist. Dein Trainer sollte Bescheid wissen.“", ok: true, fb: "Richtig. Sicherheit vor Spiel, mit klarer Regel." },
            { t: "„Spiel zu Ende und iss danach was.“", fb: "Gefährlich: Bewegung senkt den Blutzucker weiter." },
            { t: "„Fußball ist mit Typ-1-Diabetes zu gefährlich, das lässt du besser.“", fb: "Falsch. Sport ist erwünscht, er braucht nur einen Plan." }
          ] },
          { q: "Vater: „Und wenn er bewusstlos ist? Dann kann er ja nichts mehr essen.“", re: "Vater: „Das Nasenspray hab ich im Handschuhfach. Und eins kommt in seinen Schulranzen.“", opts: [
            { t: "„Dann nichts in den Mund geben, er könnte sich verschlucken. Stabile Seitenlage, Glukagon-Nasenspray in ein Nasenloch geben, so wie Sie es geübt haben, und 112 anrufen.“", ok: true, fb: "Richtig. Glukagon, Seitenlage, Notruf." },
            { t: "„Traubenzucker zwischen die Zähne schieben.“", fb: "Gefährlich: Aspirationsgefahr bei Bewusstlosigkeit." },
            { t: "„Insulin spritzen, dann wird er wach.“", fb: "Lebensgefährlich: Insulin senkt den Zucker weiter." }
          ] },
          { q: "Ben: „Muss das in der Schule echt jemand wissen? Ist voll peinlich.“", re: "Ben: „Okay. Die Klassenlehrerin und der Sportlehrer. Aber nicht die ganze Klasse.“", opts: [
            { t: "„Deine Klassenlehrerin und dein Sportlehrer sollten es wissen, damit sie dir im Notfall helfen können. Wem du es sonst erzählst, entscheidest du. Messen und Traubenzucker im Unterricht sind erlaubt, das klären wir mit einem Notfallplan.“", ok: true, fb: "Richtig. Sicherheit plus Selbstbestimmung." },
            { t: "„Nein, das ist deine Privatsache.“", fb: "Im Notfall braucht es Erwachsene, die Bescheid wissen." },
            { t: "„Am besten erzählst du es gleich der ganzen Klasse, dann ist es raus.“", fb: "Das ist seine Entscheidung, nicht deine." }
          ] },
          { q: "Vater: „Nachts schlaf ich kaum. Muss ich ihn jede Nacht wecken und messen?“", re: "Vater: „Also auf den Alarm vertrauen und nach dem Training einmal mehr gucken. Das krieg ich hin.“", opts: [
            { t: "„Der Sensor hat einen Alarm, der Sie weckt. Vor dem Schlafengehen messen, besonders nach Sport, und die Spätmahlzeit nach Plan. Wann zusätzliche Kontrollen nötig sind, besprechen Sie mit dem Diabetesteam. Sie müssen das nicht allein schaffen.“", ok: true, fb: "Richtig. Entlastung und klare Struktur." },
            { t: "„Ja, jede Nacht um 2 Uhr, sonst ist es zu gefährlich.“", fb: "Pauschal und belastend. Die Vorgaben macht das Diabetesteam individuell." },
            { t: "„Nachts passiert nichts, schlafen Sie ruhig durch.“", fb: "Falsch: Nächtliche Hypoglykämien sind möglich, besonders nach Sport." }
          ] }
        ],
        merke: "Hypo-Beratung bei Kindern heißt: konkrete Regeln, Notfall üben, die Schule einbinden und dabei die Würde des Kindes schützen."
      }
    ],
    st: {
      clock: "10:15", titel: "Sättigungsalarm Zimmer K2-07",
      situation: "10:15 Uhr. Der Monitor in Zimmer K2-07 alarmiert: Mila (6 Monate, Bronchiolitis, Patientin deiner Kollegin) SpO₂ 84 %, Atempause. Die Eltern rufen im Flur. Gleichzeitig klingelt das Telefon: Dr. Aksoy ordnet mündlich an: „Lena bekommt jetzt Prednisolon-Saft 2 mg pro Kilo.“ Und Bens Vater steht am Stützpunkt mit drei neuen Fragen.",
      order: [
        { id: "a", t: "Zu Mila: ansprechen, sanft stimulieren, Atemwege freimachen (Nase absaugen nach Standard), Notruf auslösen", warum: "Atempause beim Säugling: Atemwege und Atmung haben absoluten Vorrang." },
        { id: "b", t: "Sauerstoff nach Standard, Ärztin informieren, Monitorwerte beobachten", warum: "Ärztliche Beurteilung, bis dahin sichern." },
        { id: "c", t: "Eltern beruhigen und bei Mila lassen, kurz erklären, was passiert", warum: "Eltern sind Teil der Versorgung und brauchen Orientierung." },
        { id: "d", t: "Telefonische Anordnung für Lena: wiederholen, Gewicht und Dosis nachrechnen, Zweitkontrolle", warum: "Mündliche Anordnungen und Kinderdosen sind fehleranfällig." },
        { id: "e", t: "Bens Vater freundlich um einen Moment Geduld bitten, Zeit für das Gespräch zusagen", warum: "Wichtig, aber nicht akut." },
        { id: "f", t: "Ereignis bei Mila dokumentieren und an die Kollegin übergeben", warum: "Nach der Akutversorgung lückenlos dokumentieren." }
      ],
      mc: { text: "Zur telefonischen Prednisolon-Anordnung: Was ist richtig? (Mehrfachauswahl)", opts: [
        { t: "Anordnung mit Name, Gewicht, Dosis in mg und ml wiederholen (Read-back)", ok: true, fb: "Bei Kinderdosen wird immer auch das Gewicht genannt." },
        { t: "Selbst nachrechnen: 24 kg × 2 mg = 48 mg und mit der Maximaldosis im Hausstandard abgleichen; bei Abweichung Rückfrage", ok: true, fb: "Die Pflege rechnet nach und hinterfragt." },
        { t: "Zweite Pflegefachperson kontrolliert Dosis und aufgezogene Menge", ok: true, fb: "Vier-Augen-Prinzip in der Pädiatrie." },
        { t: "Uhrzeit, Arztname und Wortlaut dokumentieren, Gegenzeichnung zeitnah", ok: true, fb: "Telefonische Anordnungen müssen nachvollziehbar sein." },
        { t: "Gleich 2 ml geben, das passt schon ungefähr", ok: false, fb: "Ohne Berechnung und Konzentration keine Gabe." },
        { t: "Die Mutter soll es geben, wenn sie Zeit hat", ok: false, fb: "Die Gabe erfolgt kontrolliert durch die Pflege." }
      ] },
      merke: "Säugling mit Atempause: sofort hin. Kinderdosen: Gewicht nennen, nachrechnen, zweite Person kontrolliert."
    },
    doku: {
      clock: "11:00",
      auftrag: "Schreibe den Pflegebericht zu Emil für den Zeitraum 06:30 bis 08:15 Uhr.",
      muster: "06:30 Emil im Gitterbett, schläfrig, reagiert erst auf Ansprache. Nasenflügeln, juguläre und interkostale Einziehungen, Lippen trocken, Augen eingesunken, Beine marmoriert. AF 44/min, HF 156/min, SpO₂ 93 % (Raumluft), T 39,4 °C (Ohr), RR 92/56 mmHg, Rekapillarisierung 3 s. Gewicht 13,2 kg (14,0 kg vor 2 Wochen, ca. 6 % Verlust). Windel seit 22:00 trocken. Mutter berichtet: „Ich hab ihm um halb sieben 5 ml von unserem Fiebersaft gegeben.“ (Paracetamol-Saft, eigene Flasche, an Station übergeben und verwahrt.) 06:45 Dr. Aksoy informiert (SBAR), 07:00 am Bett. AO: Infusion zur Rehydratation (ärztlich angelegt 07:20), O₂ 1 l bei SpO₂ < 94 %, Paracetamol frühestens 12:30. 08:00 Amoxicillin 4,7 ml p.o. (Dispenser enthielt 9,4 ml, verworfen, neu aufgezogen, Kontrolle M. Schulz, CIRS). 08:15 AF 38/min, SpO₂ 95 % unter 1 l O₂, wacher. [Name, Handzeichen]",
      chk: [
        { t: "Uhrzeiten", kw: ["06:", "07:", "08:"] },
        { t: "Werte mit Altersbezug/Einheit", kw: ["/min", "°c", "mmhg", "%"] },
        { t: "Klinische Zeichen (Einziehungen, Schleimhäute, Marmorierung)", kw: ["einziehung", "marmor", "lippen", "nasenflügel"] },
        { t: "Gewicht und Ausscheidung", kw: ["kg", "windel"] },
        { t: "Paracetamol der Mutter mit Uhrzeit und Menge", kw: ["paracetamol", "06:30", "halb sieben", "5 ml"] },
        { t: "Arzt mit Name, Anordnung", kw: ["dr.", "aksoy", "ao"] },
        { t: "Dosisfehler Amoxicillin und Korrektur", kw: ["9,4", "amoxicillin", "cirs"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "06:30 AF 44/min, HF 156/min, SpO₂ 93 %, T 39,4 °C.", bad: false, fb: "In Ordnung." },
          { t: "Kind wirkt krank.", bad: true, fb: "Unbestimmt. Beobachtungen beschreiben." },
          { t: "Mutter hat irgendwas gegeben.", bad: true, fb: "Ohne Wirkstoff, Menge und Uhrzeit nicht verwertbar und gefährlich." },
          { t: "Mutter berichtet: „Ich hab ihm um halb sieben 5 ml Fiebersaft gegeben.“", bad: false, fb: "In Ordnung: wörtlich." },
          { t: "Mutter überfordert und unzuverlässig.", bad: true, fb: "Wertend. Richtig: konkrete Beobachtungen und Unterstützungsangebote." },
          { t: "07:00 Dr. Aksoy am Bett, AO: Rehydratation i.v.", bad: false, fb: "In Ordnung." },
          { t: "Amoxicillin gegeben.", bad: true, fb: "Ohne Dosis, Uhrzeit und die Korrektur des Dosierfehlers." },
          { t: "Nachtrag 09:00 zu 08:00: Zweitkontrolle Amoxicillin M. S.", bad: false, fb: "In Ordnung, korrekt gekennzeichnet." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib alle drei Kinder an den Spätdienst (Gesundheits- und Kinderkrankenpfleger Tim Becker).",
      muster: "Lena, K2-04: Asthmaexazerbation. 07:50 nach Salbutamol Verschlechterung (SpO₂ 90 %, Ein-Wort-Sätze), Ärztin sofort da, O₂ 2 l, Prednisolon nach AO (48 mg, nachgerechnet, Zweitkontrolle). Seit 08:30 SpO₂ 95 %, ganze Sätze, O₂ aus seit 11 Uhr. Nächste Inhalation Salbutamol 11:40 erledigt, 15:40 fällig, Budesonid 20 Uhr. Mutter beherrscht die Spacer-Technik jetzt (Teach-back). Kortison-Angst besprochen. Erdnussallergie, Notfallset in der Tasche der Mutter geprüft.\n\nEmil, K2-05: Pneumonie, mittelschwere Dehydratation (6 %). Infusion seit 07:20 nach AO, Windel 10:30 und 12:45 nass (Gewicht notiert). AF 34, SpO₂ 95 % unter 1 l. Paracetamol frühestens 12:30, um 12:40 gegeben (T 39,0). Amoxicillin-Dosisfehler im Dispenser um 08 Uhr korrigiert, gemeldet. Eigene Medikamente der Mutter verwahrt. Mutter hat 2 Stunden geschlafen, Sozialdienst kommt 14 Uhr.\n\nBen, K2-06: Typ 1, Tag 5. Beratung Hypo/Sport/Schule mit Teach-back; Vater übt morgen Glukagon-Nasenspray mit der Diabetesberatung. BZ vor dem Mittag 132, Bolus selbst unter Aufsicht.",
      chk: [
        { t: "Alle drei Kinder mit aktuellem Zustand", kw: ["k2-04", "k2-05", "k2-06", "lena", "emil", "ben"] },
        { t: "Offene Aufgaben mit Uhrzeit (Inhalation, Paracetamol, Sozialdienst)", kw: ["15:40", "20 uhr", "14 uhr", "fällig"] },
        { t: "Sicherheitsrelevantes (Allergie, Dosisfehler, Medikamente der Mutter)", kw: ["erdnuss", "dosis", "verwahrt", "allergi"] }
      ]
    },
    refl: [
      { q: "Emil hat geschlafen, und die Mutter war froh darüber. Warum hast du trotzdem sofort die Ärztin gerufen?", muster: "Er reagierte erst auf Ansprache (AVPU: V), dazu AF 44 und HF 156 weit über der Altersnorm, SpO₂ 93 %, Fieber, Marmorierung, trockene Windel und 6 % Gewichtsverlust. Bei einem Kleinkind ist Schläfrigkeit in dieser Kombination ein Alarmzeichen, kein Erholungsschlaf. Kinder kompensieren lange und kippen dann schnell. Deshalb habe ich nicht gewartet." },
      { q: "Wie hast du bei Lena die Verschlechterung nach der Inhalation erkannt und warum keine weiteren Hübe gegeben?", muster: "Sie wurde still, sprach nur noch in Ein-Wort-Sätzen, SpO₂ 90 %, AF 42 und Einziehungen. Das sind Zeichen eines schweren Anfalls und der Erschöpfung. Mehr Salbutamol ohne ärztliche Beurteilung hätte Zeit gekostet und die Dosis eigenmächtig erhöht. Ich bin bei ihr geblieben, habe die Ärztin gerufen, sie aufrecht gesetzt und Sauerstoff nach Standard gegeben." },
      { q: "Die Mutter von Emil hatte selbst Paracetamol gegeben. Wie bist du mit ihr umgegangen?", muster: "Ich habe ihr keinen Vorwurf gemacht: Sie ist erschöpft und wollte ihrem Kind helfen. Ich habe erklärt, warum jede Gabe in die Kurve muss (Abstand, Tageshöchstdosis bei Kindern), die Flasche mit ihrem Einverständnis an der Station verwahrt und die Gabe dokumentiert. Dann habe ich ihr Entlastung angeboten, damit sie schlafen kann." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
