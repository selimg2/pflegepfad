/* ===== Fall 3: Innere Medizin · Kardiologie/Pneumologie (2 Patienten) ===== */
(function () {
  var A = window.PXA; if (!A) return;

  function arm(extra) {
    return A.table() + A.p("M0 120C80 100 200 104 330 112c30 2 50 10 60 24 4 8-2 18-14 20-40 6-70 4-110 6-90 4-180 14-266 20z", "h-skin") +
      A.p("M30 150C120 140 220 136 320 132", "h-vein") + (extra || "");
  }
  function pvk(x, y, red) {
    return (red ? A.p("M" + (x - 120) + " " + (y + 8) + "C" + (x - 80) + " " + (y + 4) + " " + (x - 40) + " " + y + " " + x + " " + y, "h-streak") + A.e(x, y, 34, 22, "x-redskin") : "") +
      A.r(x - 26, y - 22, 64, 44, 8, "x-film") + A.p("M" + (x - 10) + " " + y + "h40", "h-cath") + A.r(x + 28, y - 9, 22, 18, 4, "x-pvk") + A.r(x + 50, y - 6, 14, 12, 3, "h-port") + A.r(x + 34, y - 20, 10, 10, 2, "h-cap");
  }
  function stand(x, fill, drops) {
    return A.p("M" + x + " 10v240M" + (x - 30) + " 250h60", "x-metall") + A.p("M" + (x - 18) + " 14h36", "x-metall") +
      A.r(x - 22, 18, 44, 70, 10, "x-iv") + A.r(x - 20, 18 + 70 - fill, 40, fill - 2, 8, "x-ivfl") + A.t(x, 50, "NaCl", "x-txt x-s") + A.t(x, 62, "100 ml", "x-txt x-s") +
      A.r(x - 8, 96, 16, 30, 4, "x-iv") + A.r(x - 6, 112, 12, 12, 3, "x-ivfl") + (drops ? A.c(x, 104, 2.5, "x-ivfl") : "") + A.p("M" + x + " 88v8M" + x + " 126v20", "x-tube") + A.r(x - 9, 146, 18, 14, 3, "x-clamp");
  }
  function clip(lines, title, mark) {
    var s = A.table() + A.r(70, 18, 260, 236, 8, "x-board") + A.r(84, 32, 232, 212, 4, "x-paper") + A.t(100, 56, title, "x-txt x-b", "start");
    lines.forEach(function (l, i) { var y = 84 + i * 24; if (mark && mark.indexOf(i) >= 0) s += A.r(94, y - 15, 212, 21, 4, "x-hl"); s += A.t(100, y, l, "x-txt x-s", "start"); });
    return s;
  }
  function person(x, y, cls, hair, lab) { return A.head(x, y, 18, hair) + A.face(x, y + 2) + A.r(x - 22, y + 20, 44, 78, 16, cls) + (lab ? A.tag(x, y + 120, lab, "x-tag") : ""); }

  var inf = {
    ent: A.room() + person(130, 70, "x-scrub", "x-hairb", "Du · Auszubildende") + person(270, 70, "x-shirt", "x-hairy", "Pflegefachperson") +
      A.c(200, 60, 22, "x-tag") + A.t(200, 67, "?", "x-txt x-b") + A.tag(200, 252, "Infusion nur gemeinsam", "x-tag x-tagg"),
    kurve: clip(["Ceftriaxon 2 g i.v. 1× tgl. 08 Uhr", "in 100 ml NaCl 0,9 %, Laufzeit 30 min", "Brinkmann, Theo · *03.02.1953", "Allergie: Pflaster (Zinkoxid)", "O₂ 2 l/min, Ziel-SpO₂ 88–92 %", "AO Dr. Meier, gestern 14:20"], "Kurve · Zi. 512", [3, 4]),
    prep: A.table() + A.r(40, 60, 70, 100, 12, "x-iv") + A.t(75, 100, "NaCl 0,9 %", "x-txt x-s") + A.t(75, 114, "100 ml", "x-txt x-s") +
      A.r(140, 90, 34, 60, 6, "x-white") + A.r(140, 80, 34, 14, 3, "x-metal") + A.t(157, 128, "Ceftri-", "x-txt x-s") + A.t(157, 140, "axon 2 g", "x-txt x-s") +
      A.syringe(200, 110, 70, "x-aqua", "Lösungsmittel") + A.r(300, 60, 80, 56, 6, "x-paper") + A.t(340, 78, "Etikett", "x-txt x-b") + A.t(340, 94, "Name · Wirkstoff", "x-txt x-s") + A.t(340, 106, "Dosis · Zeit · HZ", "x-txt x-s") +
      A.tag(110, 210, "unmittelbar vor Gabe zubereiten", "x-tag") + A.tag(300, 210, "Vier-Augen-Prinzip", "x-tag x-tagg"),
    sys: A.table() + stand(200, 60, true) + A.p("M200 160c0 40 40 60 100 60", "x-tube") + A.tag(90, 120, "Tropfkammer ½ gefüllt", "x-tag") + A.tag(300, 150, "luftfrei entlüftet", "x-tag x-tagg") + A.tag(90, 160, "Rollklemme zu", "x-tag"),
    phleb: arm(pvk(250, 124, true)) + A.tag(120, 230, "gerötet · warm · schmerzhaft · Strang", "x-tag x-tagr"),
    neu: A.table() + A.p("M0 120C80 100 200 104 330 112c30 2 50 10 60 24 4 8-2 18-14 20-40 6-70 4-110 6-90 4-180 14-266 20z", "h-skin") + A.p("M30 150C120 140 220 136 320 132", "h-vein") + pvk(200, 128, false) + A.r(160, 92, 74, 18, 4, "x-label") + A.t(197, 105, "re · 07:55 · Dr. M.", "x-txt x-s") + A.tag(120, 230, "neuer PVK rechts · hypoallergen fixiert", "x-tag x-tagg"),
    scrub: arm(pvk(200, 128, false) + A.c(270, 110, 18, "x-swab") + A.p("M262 104l14 12", "x-swabl")) + A.tag(140, 230, "Konnektor 15 s wischdesinfizieren, trocknen lassen", "x-tag"),
    flush: arm(pvk(200, 128, false) + A.p("M264 128h20", "x-metall") + A.syringe(284, 121, 80, "x-nacl", "NaCl 0,9 % 10 ml")) + A.tag(140, 230, "Push-Pause · kein Druck bei Widerstand", "x-tag x-tagg"),
    run: A.room() + stand(300, 50, true) + A.p("M300 160c0 50-60 50-120 54", "x-tube") + A.p("M20 210C80 196 140 198 200 204l10 14c-60 4-130 8-190 14z", "h-skin") + A.r(176, 200, 30, 16, 4, "x-pvk") +
      A.r(30, 40, 120, 56, 10, "x-white") + A.t(90, 64, "100 ml · 30 min", "x-txt x-s") + A.t(90, 84, "≈ 67 Tropfen/min", "x-txt x-b"),
    run0: A.room() + stand(300, 50, true) + A.p("M300 160c0 50-60 50-120 54", "x-tube") + A.p("M20 210C80 196 140 198 200 204l10 14c-60 4-130 8-190 14z", "h-skin") + A.r(176, 200, 30, 16, 4, "x-pvk") + A.r(30, 40, 120, 56, 10, "x-white") + A.t(90, 64, "100 ml · 30 min", "x-txt x-s") + A.t(90, 84, "? Tropfen/min", "x-txt x-b"),
    ende: arm(pvk(200, 128, false)) + A.tick(320, 90) + A.tag(140, 230, "nachgespült · Verschlusskappe neu", "x-tag x-tagg"),
    doku: clip(["08:10–08:40 Ceftriaxon 2 g i.v. (Ch.-B. 22A41)", "PVK li. Unterarm: VIP 3, entfernt 07:40", "Arzt inf., neuer PVK re. 07:55 (Dr. Meier)", "gespült 10 ml NaCl, durchgängig", "keine Reaktion, Pat. beschwerdefrei", "Azubi + PFK S. Hoffmann · HZ"], "Pflegebericht 08:45", [1])
  };

  function kranzScene() {
    var s = A.room() + A.r(20, 150, 300, 24, 8, "x-mattress") + A.bedSide(14, 172, 312) + A.p("M30 150L60 40h40l-12 110z", "x-mattress");
    s += A.e(64, 70, 26, 14, "h-pill") + A.e(70, 98, 28, 14, "h-pill") + A.e(74, 126, 28, 14, "h-pill");
    s += A.r(80, 92, 52, 66, 18, "x-gown") + A.r(98, 80, 16, 18, 6, "h-skin") + A.p("M104 82c2 5 0 9 3 14", "x-vein") + A.p("M110 84c1 4-1 8 2 12", "x-vein");
    s += A.head(106, 62, 20, "x-hairg") + A.c(112, 58, 1.8, "x-eye") + A.p("M118 70q4 1 6-1", "x-mouth") + A.e(121, 70, 5, 3, "x-lip");
    s += A.r(126, 140, 150, 22, 10, "x-blanket") + A.e(286, 150, 22, 16, "h-skin") + A.e(276, 156, 18, 12, "h-skin") + A.c(280, 152, 4, "x-dent");
    s += A.r(180, 92, 90, 10, 3, "x-chair") + A.p("M226 102v70", "x-metall") + A.p("M190 60h18v32h-18z", "x-bottlew") + A.t(199, 82, "1,5 l", "x-txt x-s") + A.p("M216 80h22l-2 12h-18z", "x-cupb") + A.e(227, 80, 11, 3, "x-food") + A.r(248, 76, 10, 16, 3, "x-white") + A.t(253, 72, "Salz", "x-txt x-s");
    s += A.r(316, 230, 64, 22, 6, "x-scale2") + A.r(330, 234, 36, 12, 3, "x-digit") + A.t(348, 244, "76,1", "x-digitt") + A.r(330, 120, 54, 44, 4, "x-paper") + A.t(357, 136, "Gewicht", "x-txt x-s") + A.t(357, 152, "Mo 73,3", "x-txt x-s");
    return s;
  }

  var C = {
    id: "innere", titel: "Infusion unter Aufsicht und ein Herz im Rückstau", station: "Innere Medizin · Station 5B", haus: "St.-Marien-Hospital", farbe: "#7C3AED",
    icon: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z",
    kurz: "Zwei Menschen mit erhöhtem Pflegebedarf: ein kontrollierender Mathelehrer mit Pneumonie und COPD, dessen Zugang sich entzündet hat, und eine eigensinnige Schneiderin mit dekompensierter Herzinsuffizienz und verdächtigem Gelbsehen.",
    anleitung: "Sabine Hoffmann", pruefer: "Herr Okafor",
    briefing: [
      "Hallo, ich bin Sabine Hoffmann, Praxisanleiterin auf der 5B. Herr Okafor von der Pflegeschule ist morgen dabei. Wir sind eine internistische Station mit Schwerpunkt Herz und Lunge: Herzinsuffizienz, COPD, Pneumonien, Rhythmusstörungen.",
      "Du betreust zwei Menschen, beide mit erhöhtem Pflegebedarf. Herr Brinkmann bekommt jeden Morgen eine Antibiose als Kurzinfusion. Wichtig: Alles, was an Infusionen und Zugängen passiert, machst du als Auszubildende nur gemeinsam mit einer Pflegefachperson. Das zu erkennen und einzufordern, ist Teil der Prüfung.",
      "Frau Kranz kam vorgestern mit Wasser in den Beinen und Luftnot. Bei ihr geht es um Beobachtung: Gewicht, Ödeme, Atmung, Puls. Und um Medikamente, die bei einer Herzinsuffizienz gleichzeitig helfen und schaden können."
    ],
    order: ["A", "B"],
    pat: {
      A: {
        key: "A", name: "Theo Brinkmann", kurz: "Herr Brinkmann", alter: 72, zimmer: "512", modus: "Pflegehandlung", farbe: "#7C3AED",
        typ: "Pensionierter Mathematiklehrer, höflich-ironisch, kontrolliert jede Zahl und jede Tablette, misstraut Ungenauigkeit.",
        diagnose: "Ambulant erworbene Pneumonie rechter Unterlappen bei COPD GOLD 3; Tag 2. PVK linker Unterarm seit gestern 10 Uhr.",
        daten: [
          ["Vorerkrankungen", "COPD GOLD 3, arterielle Hypertonie, Nikotinkonsum (50 Jahre, aktuell 10/Tag)"],
          ["Allergien", "Pflaster mit Zinkoxid (Hautreaktion)"],
          ["Soziales", "Ehefrau mit Demenz im Pflegeheim, besucht sie täglich; Sohn in Kanada"],
          ["Medikation", "Ceftriaxon 2 g i.v. 1× tgl. 08 Uhr (Kurzinfusion 30 min) · Tiotropium/Olodaterol 2 Hübe morgens · Salbutamol bei Bedarf · Prednisolon 40 mg 1-0-0 · Enoxaparin 40 mg s.c. 18 Uhr"],
          ["Vitalwerte Tag 1, 16 Uhr", "RR 142/84 mmHg · HF 96/min · AF 22/min · SpO₂ 90 % unter 2 l O₂ · T 38,1 °C"],
          ["Sauerstoff", "AO: 2 l/min, Ziel-SpO₂ 88–92 % (Hyperkapnie in der Vorgeschichte)"]
        ],
        anamnese: "Sie sind also die neue Kraft. Dann rechnen wir mal: 38 Jahre Mathematik am Gymnasium, ich merke, wenn eine Zahl nicht stimmt. Die Infusion gestern lief 30 Minuten, das hab ich mitgestoppt. Die Nadel hier am Arm brennt seit heute Nacht und ist ganz warm, aber das gehört wohl dazu. Den Sauerstoff hab ich gestern Abend mal auf vier Liter gedreht, dann ging's mit der Luft besser, danach war ich furchtbar müde. Rauchen? Zehn am Tag, früher zwanzig. Mein Spray nehm ich morgens, ehrlich gesagt weiß ich nicht, ob ich das richtig mache, die Hälfte geht in den Hals. Meine Frau ist im Heim, Demenz, ich bin jeden Tag um drei bei ihr. Wer macht das jetzt? Die erkennt mich zwar nicht immer, aber wenn ich nicht komme, ist sie unruhig. Ach ja: Die normalen Pflaster vertrage ich nicht, da krieg ich Blasen.",
        kern: [
          { t: "PVK brennt und ist warm: Verdacht auf Phlebitis", kw: ["phlebitis", "brennt", "warm", "pvk", "zugang", "nadel", "entzünd"] },
          { t: "Hat den Sauerstoff eigenmächtig auf 4 l erhöht, danach müde: Gefahr der Hyperkapnie bei COPD", kw: ["sauerstoff", "4 l", "vier liter", "hyperkap", "müde", "co2", "co₂"] },
          { t: "Inhalationstechnik unsicher („geht in den Hals“): Schulungsbedarf", kw: ["spray", "inhal", "technik", "hals", "schulung"] },
          { t: "Raucht weiter (10/Tag)", kw: ["rauch", "zigarett", "nikotin"] },
          { t: "Pflasterallergie (Zinkoxid): hypoallergene Fixierung für den PVK", kw: ["pflaster", "zinkoxid", "allergi", "blasen"] },
          { t: "Sorge um die demente Ehefrau im Pflegeheim, tägliche Besuche: Belastung, Entlassungsplanung", kw: ["frau", "ehefrau", "demenz", "heim", "besuch", "sorge"] },
          { t: "Kontrolliert genau, misst nach: Transparenz und exakte Information schaffen Vertrauen", kw: ["kontroll", "mathe", "genau", "zahl", "transparenz", "vertrauen"] },
          { t: "Fieber 38,1 °C, Infekt unter Antibiose", kw: ["fieber", "38", "infekt", "pneumonie"] }
        ]
      },
      B: {
        key: "B", name: "Edith Kranz", kurz: "Frau Kranz", alter: 81, zimmer: "514", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#DB2777",
        typ: "Ehemalige Schneidermeisterin, eigensinnig und humorvoll. Hält an ihren Gewohnheiten fest („zwei Liter Wasser für die Nieren“).",
        diagnose: "Kardiale Dekompensation bei Herzinsuffizienz mit reduzierter Pumpfunktion (EF 30 %), Vorhofflimmern, chronische Niereninsuffizienz G3; Tag 3.",
        daten: [
          ["Vorerkrankungen", "Herzinsuffizienz NYHA III, Vorhofflimmern, CKD G3, Diabetes Typ 2 diätetisch"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "lebt allein im 1. Stock, Tochter kommt zweimal pro Woche, kein Pflegegrad"],
          ["Medikation", "Torasemid 20 mg 1-0-0 · Spironolacton 25 mg 1-0-0 · Ramipril 2,5 mg 1-0-0 · Bisoprolol 2,5 mg 1-0-0 · Digitoxin 0,07 mg 1-0-0 · Apixaban 2,5 mg 1-0-1 · Kaliumchlorid retard 1-0-0"],
          ["Ärztliche Vorgaben", "Trinkmenge max. 1,5 l/24 h · tägliches Gewicht morgens nüchtern · natriumarme Kost"],
          ["Labor gestern", "Kalium 3,1 mmol/l (niedrig) · Kreatinin 1,6 mg/dl"]
        ],
        anamnese: "Kindchen, ich hab mein Leben lang Hosen gekürzt, ich weiß, wann was zu eng wird. Und jetzt kriege ich meine eigenen Schuhe nicht mehr zu. Die Füße sind wie Hefeteig. Nachts schlaf ich nur mit drei Kissen, sonst krieg ich keine Luft, ich sitz quasi im Bett. Trinken tu ich meine zwei Liter Mineralwasser, das hat der Hausarzt vor Jahren gesagt, für die Nieren. Und abends mein Tässchen Brühe, das lass ich mir nicht nehmen. Seit gestern ist mir so flau im Magen, ich mag kaum essen. Und komisch: Alles sieht so gelblich aus, als hätte jemand ein Filter draufgelegt. Liegt bestimmt an der Brille. Gewogen werde ich hier jeden Morgen, die Zahlen sagen mir nichts. Meine Tochter will, dass ich ins betreute Wohnen gehe. Ich geh nirgendwohin, wo ich meine Nähmaschine nicht mitnehmen kann.",
        kern: [
          { t: "Ödeme an Füßen (Schuhe gehen nicht zu): Flüssigkeitsüberlastung", kw: ["ödem", "füße", "schuhe", "hefeteig", "wasser in", "schwell"] },
          { t: "Orthopnoe: schläft nur mit drei Kissen sitzend", kw: ["orthopnoe", "kissen", "sitz", "luft", "atemnot", "dyspnoe"] },
          { t: "Trinkt 2 l Mineralwasser trotz ärztlicher Begrenzung auf 1,5 l; abendliche Brühe (Salz)", kw: ["2 liter", "zwei liter", "trink", "1,5", "brühe", "salz", "natrium"] },
          { t: "Übelkeit, Appetitlosigkeit und Gelbsehen: Verdacht auf Digitalis-Überdosierung, verstärkt durch niedriges Kalium", kw: ["gelb", "digitalis", "digitoxin", "übel", "flau", "intox", "kalium"] },
          { t: "Tägliches Gewicht ohne Verständnis für die Bedeutung: Schulungsbedarf Selbstmanagement", kw: ["gewicht", "wiegen", "gewogen", "schulung", "selbstmanagement"] },
          { t: "Lebt allein, Tochter drängt zu betreutem Wohnen, Patientin lehnt ab: Entlassungsmanagement und Selbstbestimmung", kw: ["allein", "tochter", "betreut", "entlass", "selbstbestimm"] },
          { t: "Ressource und Lebenssinn: Nähmaschine, handwerkliche Erfahrung", kw: ["nähmaschine", "schneider", "ressource"] },
          { t: "Hält an Gewohnheiten fest: Beratung muss an ihre Erfahrung anknüpfen", kw: ["gewohnheit", "eigensinn", "beratung", "anknüpf"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Gefahr einer Infektion (00004) b/d peripherem Venenkatheter mit Zeichen einer Phlebitis, a/d Brennen, Wärme und Rötung an der Einstichstelle. Dazu: Beeinträchtigter Gasaustausch (00030) b/d COPD und Pneumonie mit Gefahr der Hyperkapnie, a/d eigenmächtiger O₂-Erhöhung und Müdigkeit; Wissensdefizit Inhalationstechnik.",
        ziel: "Der Venenzugang ist reizlos oder wird bei Phlebitiszeichen ersetzt. Die SpO₂ liegt im angeordneten Zielbereich 88–92 %, Herr Brinkmann verändert die O₂-Menge nicht selbst und kann begründen, warum. Er demonstriert bis zur Entlassung die korrekte Inhalationstechnik.",
        mass: [
          "PVK bei jedem Kontakt inspizieren und mit VIP-Score dokumentieren; bei Phlebitiszeichen Arzt informieren, Zugang nicht mehr benutzen und entfernen lassen",
          "Infusionen nur gemeinsam mit einer Pflegefachperson; Fixierung mit hypoallergenem Pflaster",
          "SpO₂ und Bewusstseinslage engmaschig; O₂ nach Anordnung, Herrn Brinkmann die Zielsättigung erklären",
          "Inhalationstechnik mit seinem Gerät anleiten und Teach-back; Rauchstopp-Beratung",
          "Sozialdienst wegen Besuchen bei der Ehefrau und Entlassungsplanung einbeziehen"
        ],
        chk: [
          { t: "Phlebitis/Infektionsgefahr am PVK als Diagnose", kw: ["phlebitis", "infekt", "pvk", "zugang"] },
          { t: "Gasaustausch / Hyperkapnie bei COPD", kw: ["gasaustausch", "hyperkap", "co2", "copd", "sauerstoff"] },
          { t: "Ziel mit SpO₂-Zielbereich 88–92 %", kw: ["88", "92", "ziel"] },
          { t: "PVK-Inspektion mit VIP-Score, Arzt bei Phlebitis", kw: ["vip", "inspiz", "arzt"] },
          { t: "Infusion nur mit Pflegefachperson", kw: ["pflegefach", "gemeinsam", "aufsicht", "examiniert"] },
          { t: "Inhalationsschulung", kw: ["inhal", "schulung", "anleit"] },
          { t: "Pflasterallergie berücksichtigt", kw: ["pflaster", "hypoallerg", "zinkoxid"] }
        ]
      },
      B: {
        diag: "Flüssigkeitsüberschuss (00026) b/d Herzinsuffizienz und Trinkmenge über der ärztlichen Vorgabe, a/d Beinödemen, Orthopnoe und Gewichtszunahme. Dazu: Gefahr einer Medikamentennebenwirkung (Digitalis) b/d Hypokaliämie, a/d Übelkeit und Gelbsehen; Wissensdefizit Selbstmanagement Herzinsuffizienz.",
        ziel: "Frau Kranz hält die Trinkmenge von 1,5 l/24 h ein und dokumentiert sie mit einem Becher-Plan. Ihr Gewicht sinkt nach ärztlicher Zielvorgabe, sie kann sagen, ab welcher Zunahme sie zu Hause den Hausarzt anruft (z. B. > 1 kg/Tag oder > 2 kg in 3 Tagen).",
        mass: [
          "Tägliches Gewicht morgens nüchtern, gleiche Waage, gleiche Kleidung; Ein- und Ausfuhrbilanz",
          "Vitalzeichen mit Puls über 60 Sekunden (Vorhofflimmern); vor Digitoxin und Bisoprolol Puls und Befinden prüfen",
          "Symptome einer Digitalis-Überdosierung (Übelkeit, Sehstörungen, Bradykardie) sofort ärztlich melden",
          "Oberkörperhochlage/Herzbettlage, Hautpflege der Ödeme, Kompression nur nach Anordnung",
          "Beratung mit ihren eigenen Bildern: Trinkplan mit Messbecher, salzarme Brühe, Gewichtstagebuch; Entlassung gemeinsam mit Tochter und Sozialdienst planen"
        ],
        chk: [
          { t: "Flüssigkeitsüberschuss als Diagnose mit Kennzeichen", kw: ["flüssigkeitsüberschuss", "überschuss", "ödem", "überlast"] },
          { t: "Digitalis-Nebenwirkung / Gelbsehen erkannt", kw: ["digitalis", "digitoxin", "gelb"] },
          { t: "Ziel mit Trinkmenge und Gewicht", kw: ["1,5", "gewicht", "kg"] },
          { t: "Tägliches Gewicht korrekt (nüchtern, gleiche Bedingungen)", kw: ["nüchtern", "waage", "täglich"] },
          { t: "Puls 60 s vor Digitoxin/Bisoprolol", kw: ["puls", "60", "minute"] },
          { t: "Beratung Selbstmanagement / Entlassung", kw: ["beratung", "schulung", "tagebuch", "entlass", "sozialdienst"] }
        ]
      }
    },
    nacht: [
      ["A", "Herr Brinkmann: Hat gestern Abend den Sauerstoff selbst auf 4 l gedreht, um 23 Uhr war er schwer weckbar. Ich hab auf 2 l zurück, der Arzt hat eine BGA gemacht: pCO₂ 58 mmHg. Jetzt wach, SpO₂ 90 %. Die Einstichstelle am PVK fand ich etwas rot, hab's aber nicht dokumentiert. Antibiose um 08 Uhr."],
      ["B", "Frau Kranz: Hat nachts wieder nur sitzend geschlafen, zweimal Atemnot. Puls am Monitor um 04 Uhr 54/min, unregelmäßig. Sie hat erbrochen. Gewicht um 06 Uhr: 76,1 kg, gestern 74,9, Montag 73,3. Labor wird um 07 Uhr abgenommen."],
      ["D", "Zimmer 516, Herr Reuter (63, Abklärung Thoraxschmerz): ruhige Nacht, Troponin-Kontrolle heute früh."]
    ],
    sbar: {
      A: {
        muster: {
          S: "Herr Brinkmann, 72, Zimmer 512, Tag 2 bei Pneumonie und COPD GOLD 3. Nachts nach eigenmächtiger O₂-Erhöhung schwer weckbar, pCO₂ 58 mmHg. PVK-Einstichstelle gerötet, brennt.",
          B: "Raucher, Prednisolon, Ceftriaxon 08 Uhr als Kurzinfusion. Ziel-SpO₂ 88–92 %. Pflasterallergie.",
          A: "Hyperkapniegefahr bei zu viel Sauerstoff; Verdacht auf Phlebitis am PVK. Die Antibiose darf nicht über diesen Zugang laufen.",
          R: "PVK vor der Infusion mit VIP-Score beurteilen und Arzt informieren; Infusion nur gemeinsam mit Pflegefachperson; O₂-Ziel mit ihm besprechen; Inhalationsschulung."
        },
        chk: [
          { t: "S: Hyperkapnie/pCO₂ nach O₂-Erhöhung", kw: ["pco", "hyperkap", "4 l", "sauerstoff", "weckbar"] },
          { t: "S/A: PVK gerötet, Phlebitisverdacht", kw: ["pvk", "phlebitis", "gerötet", "rot"] },
          { t: "B: Ziel-SpO₂ 88–92 %", kw: ["88", "92"] },
          { t: "R: VIP-Score, Arzt vor Infusion", kw: ["vip", "arzt", "vor der infusion"] },
          { t: "R: Infusion nur mit Pflegefachperson", kw: ["pflegefach", "gemeinsam", "aufsicht"] }
        ]
      },
      B: {
        muster: {
          S: "Frau Kranz, 81, Zimmer 514, Tag 3 bei dekompensierter Herzinsuffizienz. Gewicht +2,8 kg seit Montag, nachts Orthopnoe, Puls 54 unregelmäßig, Erbrechen, berichtet Gelbsehen.",
          B: "EF 30 %, Vorhofflimmern, CKD G3. Digitoxin, Bisoprolol, Torasemid, Spironolacton, Apixaban. Kalium gestern 3,1 mmol/l. Trinkmenge laut Arzt max. 1,5 l, sie trinkt 2 l.",
          A: "Zunehmende Stauung und Verdacht auf Digitalis-Überdosierung, begünstigt durch Hypokaliämie. Das ist dringend.",
          R: "Vitalzeichen mit NEWS2 und 60-Sekunden-Puls, Arzt vor der 08-Uhr-Medikation informieren, Digitoxin und Bisoprolol erst nach Rücksprache; Trinkplan."
        },
        chk: [
          { t: "S: Gewichtszunahme mit Zahlen", kw: ["76", "2,8", "kg", "gewicht"] },
          { t: "S/A: Gelbsehen/Übelkeit als Digitalis-Hinweis", kw: ["gelb", "digitalis", "digitoxin"] },
          { t: "B: Kalium niedrig", kw: ["kalium", "3,1"] },
          { t: "A: Dekompensation/Stauung", kw: ["stauung", "dekompens", "ödem", "überlast"] },
          { t: "R: Arzt vor Medikation, Digitoxin/Bisoprolol halten", kw: ["arzt", "rücksprache", "halten", "nicht geben"] }
        ]
      }
    },
    prio: [
      { id: "k1", t: "Frau Kranz: Vitalzeichen mit NEWS2, Puls 60 Sekunden, Befinden und Gelbsehen abklären", zeit: "06:15", warum: "Bradykardie, Erbrechen und Gelbsehen: Verdacht auf Digitalis-Überdosierung. Potenziell lebensbedrohlich." },
      { id: "b1", t: "Herr Brinkmann: Bewusstsein, SpO₂ und O₂-Einstellung kontrollieren", zeit: "06:30", warum: "Nach nächtlicher Hyperkapnie muss die Wachheit früh geprüft werden." },
      { id: "ar", t: "Arzt über Frau Kranz informieren (SBAR) – vor der Medikamentengabe", zeit: "06:40", warum: "Die 08-Uhr-Medikation hängt von der ärztlichen Entscheidung ab." },
      { id: "gw", t: "Frau Kranz: Ein- und Ausfuhr der Nacht bilanzieren, Trinkplan besprechen", zeit: "07:00", warum: "Bilanz und Gewicht sind die Grundlage für die Diuretika-Entscheidung." },
      { id: "pv", t: "Herr Brinkmann: PVK beurteilen (VIP-Score) und Arzt informieren", zeit: "07:30", warum: "Vor der Antibiose um 08 Uhr muss klar sein, ob der Zugang benutzt werden darf." },
      { id: "md", t: "Medikamente 08 Uhr prüfen und verteilen", zeit: "07:50", warum: "Nach ärztlicher Rücksprache, R-Regeln für jedes Arzneimittel." },
      { id: "in", t: "Herr Brinkmann: Kurzinfusion gemeinsam mit der Pflegefachperson", zeit: "08:10", warum: "Fester Zeitpunkt, Vier-Augen-Prinzip." },
      { id: "fr", t: "Frühstück, Unterstützung, Trinkmengen erfassen", zeit: "08:30", warum: "Teil der Bilanz." },
      { id: "sc", t: "Herr Brinkmann: Inhalationstechnik schulen", zeit: "10:30", warum: "Planbar, wichtig für die Entlassung." },
      { id: "do", t: "Dokumentation vervollständigen, Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend dokumentieren, hier ergänzen und strukturieren." }
    ],
    live: [
      {
        k: "kranzbild", typ: "hotspot", pat: "B", t: "Frau Kranz · Bildbefund", kurzname: "Bildbefund Stauungszeichen", clock: "06:15", max: 10,
        titel: "Frau Kranz am Morgen",
        intro: "06:15 Uhr. Frau Kranz sitzt aufrecht im Bett, sie hat wieder kaum geschlafen. Bevor du misst, schaust du genau hin.",
        q: "Welche Zeichen einer kardialen Dekompensation und welche Risikofaktoren findest du?",
        art: kranzScene(),
        spots: [
          { c: [[106, 90, 14]], t: "Gestaute Halsvenen", d: "Sichtbar gefüllte Halsvenen im Sitzen sprechen für einen Rückstau vor dem rechten Herzen." },
          { c: [[121, 70, 10]], t: "Lippenzyanose", d: "Bläuliche Lippen: Sauerstoffmangel durch Lungenstauung und verminderte Pumpleistung." },
          { c: [[68, 98, 30]], t: "Orthopnoe (Schlafen mit drei Kissen)", d: "Im Liegen strömt mehr Blut zur Lunge, die gestaute Lunge verträgt das nicht. Die Zahl der Kissen ist ein einfacher Verlaufsparameter." },
          { c: [[282, 152, 24]], t: "Beinödeme mit Dellenbildung", d: "Eindrückbare Ödeme an Füßen und Unterschenkeln. Dellentiefe und Umfang dokumentieren, Haut pflegen und schützen." },
          { c: [[214, 76, 30]], t: "Trinkmenge und Salz über der Vorgabe", d: "1,5-l-Flasche plus Brühe und Salzstreuer: mehr Flüssigkeit und Natrium als ärztlich vorgegeben. Gemeinsam einen Trinkplan erstellen." },
          { c: [[348, 240, 28], [357, 142, 26]], t: "Gewichtszunahme 2,8 kg in 2 Tagen", d: "Mehr als 2 kg in 3 Tagen bedeutet Wassereinlagerung, nicht Fett. Tägliches Gewicht ist der wichtigste Selbstmanagement-Parameter." }
        ],
        extra: ["Aszites", "Trommelschlegelfinger", "Pleuradrainage", "Dekubitus Sakrum"],
        cap: "Tipp: Hals, Gesicht, Lagerung, Beine, Nachttisch, Waage.",
        merke: "Herzinsuffizienz sieht man: Hals, Lippen, Kissen, Beine, Waage und Wasserflasche erzählen zusammen die Geschichte der Dekompensation."
      },
      {
        k: "kranzvit", typ: "vitmed", pat: "B", t: "Frau Kranz · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Medikamente", clock: "06:25", max: 12, wVit: 0.45,
        titel: "Vitalzeichen erheben und Medikamente für 08 Uhr prüfen",
        banner: { name: "Edith Kranz", sub: "81 J. · Zimmer 514 · dekompensierte Herzinsuffizienz", chips: [["Kalium 3,1 mmol/l", "red"], ["Trinkmenge max. 1,5 l", ""], ["Vorhofflimmern", ""]] },
        intro: "Frau Kranz: „Mir ist so übel, Kindchen. Und gucken Sie mal, Ihr Kittel ist gar nicht weiß, der ist gelb.“",
        uhr: "06:26",
        vit: {
          items: [
            { k: "puls", t: "Puls", kurz: "Puls", val: "52", einheit: "/min, unregelmäßig", farbe: "puls", wie: "tasten", q: { text: "Frau Kranz hat Vorhofflimmern. Wie misst du den Puls?", opts: [
              { t: "Radialispuls eine volle Minute tasten, Rhythmus und Qualität beurteilen", ok: true, fb: "Richtig. Bei absoluter Arrhythmie sind 15 oder 30 Sekunden zu ungenau." },
              { t: "15 Sekunden tasten und mal vier nehmen", fb: "Bei unregelmäßigem Rhythmus führt das zu falschen Werten." },
              { t: "Nur vom Pulsoxymeter ablesen", fb: "Das Pulsoxymeter zählt bei Vorhofflimmern unzuverlässig und erfasst die Qualität nicht." }] } },
            { k: "rr", t: "Blutdruck", kurz: "NIBP", val: "104/62", einheit: "mmHg", farbe: "rr", wie: "Manschette" },
            { k: "af", t: "Atemfrequenz", kurz: "AF", val: "26", einheit: "/min", farbe: "af", wie: "zählen" },
            { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "90", einheit: "% Raumluft", farbe: "spo2", wie: "Clip", q: { text: "Ihre Finger sind kalt. Was beachtest du bei der Pulsoxymetrie?", opts: [
              { t: "Finger anwärmen oder Ohrsensor nutzen, auf gute Pulskurve achten und den Wert erst ablesen, wenn er stabil ist", ok: true, fb: "Richtig. Kalte Finger und schlechte Durchblutung verfälschen die Messung." },
              { t: "Den niedrigsten Wert nehmen, der kurz angezeigt wird", fb: "Ohne gute Pulskurve sind Einzelwerte nicht verwertbar." },
              { t: "Den Clip fester andrücken", fb: "Druck verschlechtert die Durchblutung noch mehr." }] } },
            { k: "temp", t: "Temperatur", kurz: "Temp", val: "36,5", einheit: "°C", farbe: "temp", wie: "Ohr" },
            { k: "gew", t: "Gewicht", kurz: "kg", val: "76,1", einheit: "kg (+2,8)", farbe: "gew", wie: "Waage", q: { text: "Wie wiegst du Frau Kranz richtig?", opts: [
              { t: "Morgens nüchtern nach dem Toilettengang, gleiche Waage, gleiche Kleidung", ok: true, fb: "Richtig. Nur so sind tägliche Werte vergleichbar." },
              { t: "Irgendwann am Tag, Hauptsache täglich", fb: "Nach Mahlzeiten und mit anderer Kleidung schwankt das Gewicht um mehr als ein Kilo." },
              { t: "Einmal pro Woche reicht", fb: "Bei Herzinsuffizienz ist das tägliche Gewicht der wichtigste Verlaufsparameter." }] } },
            { k: "bew", t: "Bewusstsein", kurz: "ACVPU", val: "A", einheit: "wach, orientiert", farbe: "bew", wie: "ansprechen" }
          ],
          befund: "Labor 07:00 Uhr (telefonisch): Kalium 3,0 mmol/l. Frau Kranz hat einmal erbrochen und beschreibt Gelbsehen.",
          news: { wert: 7, tol: 0, frage: "Berechne den NEWS2-Score (Skala 1).", erk: "AF 26 = 3 · SpO₂ 90 % = 3 · Raumluft = 0 · RR syst. 104 = 1 · Puls 52 = 0 · wach = 0 · Temp 36,5 = 0. Summe 7: hohes Risiko, dringende ärztliche Beurteilung." },
          act: { text: "Was tust du jetzt?", opts: [
            { t: "Oberkörper hoch, Beine tief (Herzbettlage), bei ihr bleiben bzw. Klingel geben, Arzt sofort mit SBAR informieren: NEWS2 7, Stauungszeichen, Bradykardie, Gelbsehen, Kalium 3,0", ok: true, fb: "Richtig. Lagerung entlastet das Herz, und der Verdacht auf Digitalis-Überdosierung muss ärztlich sofort bewertet werden." },
            { t: "Sauerstoff hochdrehen und abwarten, ob es besser wird", fb: "Sauerstoff nur nach Anordnung. Und Abwarten ist bei NEWS2 7 keine Option." },
            { t: "Ein Glas Wasser gegen die Übelkeit geben", fb: "Mehr Flüssigkeit verstärkt die Stauung. Und Übelkeit ist hier ein Warnzeichen, kein Durst." },
            { t: "Beine hochlagern gegen die Ödeme", fb: "Beinhochlagerung erhöht den Rückstrom zum überlasteten Herzen und verschlechtert die Atemnot." }] }
        },
        med: {
          zeit: "08:00", allergie: "keine bekannt",
          hinweis: "07:15 Uhr, Dr. Meier: „Digitoxin und Bisoprolol heute pausieren, Digitoxin-Spiegel ist abgenommen. Torasemid geben, Kalium wie angeordnet geben, ich erhöhe es auf 2-0-0. Rest wie gehabt.“ Die Anordnung steht schriftlich in der Kurve.",
          plan: [
            { n: "Torasemid", d: "20 mg", z: "1-0-0", h: "" },
            { n: "Spironolacton", d: "25 mg", z: "1-0-0", h: "" },
            { n: "Ramipril", d: "2,5 mg", z: "1-0-0", h: "halten bei RR syst. < 100 mmHg" },
            { n: "Bisoprolol", d: "2,5 mg", z: "1-0-0", h: "pausiert lt. AO 07:15", aus: true },
            { n: "Digitoxin", d: "0,07 mg", z: "1-0-0", h: "pausiert lt. AO 07:15", aus: true },
            { n: "Apixaban", d: "2,5 mg", z: "1-0-1", h: "Dosis wegen Alter/Niere" },
            { n: "Kaliumchlorid retard", d: "1 Tbl.", z: "2-0-0", h: "neu ab heute (AO 07:15)" }
          ],
          disp: [
            { n: "Torasemid 20 mg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "ok", fb: "Angeordnet. Die Entwässerung ist bei Dekompensation das Ziel." },
            { n: "Ramipril 2,5 mg", sub: "1 Tablette", pill: { c: "#fecaca", s: "oval" }, r: "ok", fb: "RR 104 systolisch liegt über der Grenze von 100: geben und RR weiter beobachten." },
            { n: "Digitoxin 0,07 mg", sub: "1 Tablette", pill: { c: "#fbcfe8", s: "round" }, r: "pause", fb: "Pausiert. Bradykardie, Übelkeit und Gelbsehen bei Hypokaliämie sprechen für eine Überdosierung." },
            { n: "Bisoprolol 2,5 mg", sub: "1 Tablette", pill: { c: "#fde68a", s: "round" }, r: "pause", fb: "Pausiert. Bei HF 52 würde der Betablocker die Bradykardie verstärken." },
            { n: "Apixaban 5 mg", sub: "1 Tablette", pill: { c: "#fdba74", s: "oval" }, r: "dosis", fb: "Angeordnet ist 2,5 mg (dosisreduziert wegen Alter und Nierenfunktion). 5 mg erhöht das Blutungsrisiko. Austauschen." },
            { n: "Kaliumchlorid retard", sub: "1 Kapsel", pill: { c: "#e2e8f0", c2: "#93c5fd", s: "kapsel" }, r: "dosis", fb: "Seit 07:15 sind 2 Kapseln morgens angeordnet. Retardkapseln unzerkaut mit viel Flüssigkeit, bei Übelkeit nach dem Essen." }
          ],
          fehlt: { text: "Welche Medikamente sind angeordnet, aber nicht im Dispenser? (Mehrfachauswahl)", opts: [
            { t: "Spironolacton 25 mg", ok: true, fb: "Fehlt im Dispenser. Nachrichten und prüfen, ob es bewusst weggelassen wurde (Kalium!). Hier: angeordnet, also ergänzen nach Rücksprache." },
            { t: "Furosemid 40 mg i.v.", ok: false, fb: "Ist nicht angeordnet." },
            { t: "Digitoxin", ok: false, fb: "Ist im Dispenser, aber pausiert." }] }
        },
        final: { text: "Frau Kranz will ihre Tabletten heute nicht nehmen: „Mir ist so schlecht, Kindchen.“ Was tust du?", opts: [
          { t: "Ich nehme ihre Ablehnung ernst, erkläre, wofür Torasemid und Kalium heute wichtig sind, biete an, nach dem Frühstück zu nehmen, und informiere den Arzt, wenn sie bei ihrer Ablehnung bleibt; alles dokumentieren", ok: true, fb: "Richtig. Selbstbestimmung mit Aufklärung und ärztlicher Information." },
          { t: "Ich mische die Tabletten unauffällig in den Joghurt", fb: "Heimliche Gabe ist ohne rechtliche Grundlage nicht zulässig und eine Grenzüberschreitung." },
          { t: "Ich lege die Tabletten auf den Nachttisch, sie nimmt sie schon später", fb: "So ist die Einnahme nicht gesichert. Medikamente bleiben unter Aufsicht, bis sie eingenommen sind." }] },
        merke: "Puls vor Digitalis und Betablocker, Kalium im Blick, Gewicht täglich. Bei Herzinsuffizienz entscheiden oft kleine Zahlen über große Gefahren."
      },
      {
        k: "infusion", typ: "steps", pat: "A", t: "Herr Brinkmann · Kurzinfusion", kurzname: "Kurzinfusion über PVK unter Aufsicht", clock: "07:30", max: 18,
        titel: "Antibiotische Kurzinfusion über einen peripheren Venenzugang",
        icon: "M8 2h8v6l-2 3v4h-4v-4l-2-3zM12 15v7",
        banner: { name: "Theo Brinkmann", sub: "72 J. · Zimmer 512 · Pneumonie, COPD GOLD 3", chips: [["Allergie: Pflaster (Zinkoxid)", "red"], ["Ziel-SpO₂ 88–92 %", ""], ["Ceftriaxon 2 g 08 Uhr", ""]] },
        intro: "07:30 Uhr. Um 08 Uhr ist die Antibiose fällig: Ceftriaxon 2 g in 100 ml NaCl 0,9 % über 30 Minuten. Der PVK am linken Unterarm liegt seit gestern 10 Uhr. Deine Praxisanleiterin Sabine Hoffmann steht am Stützpunkt.",
        ko: ["Infusion als Auszubildende ohne Pflegefachperson anhängen", "Infusion über einen Zugang mit Phlebitiszeichen laufen lassen", "Gegen Widerstand spülen", "Konnektor nicht desinfizieren oder Non-Touch verletzen", "Luft im System nicht entfernen"],
        merke: "Erst die Rolle klären, dann den Zugang beurteilen, dann spülen. Ein Zugang, der brennt und warm ist, wird nicht mehr benutzt.",
        steps: [
          { t: "Wer macht was?", ph: "vor", img: "ent", q: "Du sollst die Kurzinfusion vorbereiten. Wie gehst du vor?", opts: [
            { t: "Ich bereite vor und hole Frau Hoffmann als Pflegefachperson dazu; Anhängen und Überwachen machen wir gemeinsam", ok: true, fb: "Richtig. Tätigkeiten an Infusionen führst du als Auszubildende nur unter direkter Aufsicht einer Pflegefachperson durch. Das einzufordern ist professionell, nicht unsicher." },
            { t: "Ich mache es allein, ich habe das schon oft gesehen", ko: true, fb: "Kritisch: Ohne Aufsicht keine Infusion. In der Prüfung wäre das ein Abbruchgrund." },
            { t: "Ich frage den Arzt, ob ich es allein darf", fb: "Die Frage gehört nicht zum Arzt. Die Regelung ist klar: gemeinsam mit einer Pflegefachperson." }
          ] },
          { t: "Anordnung prüfen", ph: "vor", img: "kurve", q: "Was prüfst du in der Kurve?", opts: [
            { t: "Patient, Wirkstoff, Dosis, Trägerlösung, Laufzeit, Zeitpunkt und Applikationsweg; Allergien; O₂-Ziel. Alles stimmt, Unverträglichkeit nur gegen Zinkoxid-Pflaster", ok: true, fb: "Richtig. Die R-Regeln gelten auch für Infusionen. Die Pflasterallergie ist für die Fixierung wichtig." },
            { t: "Nur, ob „Antibiose 08 Uhr“ drinsteht", fb: "Zu wenig. Dosis, Trägerlösung und Laufzeit gehören dazu." },
            { t: "Ich vertraue der Übergabe, die Kollegin hat es ja gesagt", fb: "Mündliche Übergabe ersetzt nicht die Prüfung der schriftlichen Anordnung." }
          ] },
          { t: "Zubereiten", ph: "vor", img: "prep", q: "Wie bereitest du das Antibiotikum zu?", opts: [
            { t: "Arbeitsfläche wischdesinfizieren, Händedesinfektion, Ceftriaxon nach Fachinformation auflösen und in den Beutel geben, unmittelbar vor der Gabe; Etikett mit Name, Wirkstoff, Dosis, Uhrzeit, Handzeichen; Vier-Augen-Kontrolle", ok: true, fb: "Richtig. Zubereitete Infusionen sind nur begrenzt stabil und werden immer beschriftet." },
            { t: "Schon um 06 Uhr vorbereiten, dann ist es fertig", fb: "Zu früh. Stabilität und Keimfreiheit sind nur kurz gesichert." },
            { t: "Ohne Etikett, ich hänge sie ja gleich an", fb: "Unbeschriftete Infusionen sind eine klassische Verwechslungsquelle." }
          ] },
          { t: "Infusionssystem", ph: "vor", img: "sys", q: "Wie bereitest du das Infusionssystem vor?", opts: [
            { t: "Rollklemme schließen, Dorn Non-Touch in den Beutel stechen, Tropfkammer zur Hälfte füllen, System langsam luftfrei befüllen, Schutzkappe aufsetzen", ok: true, fb: "Richtig. Halb gefüllte Tropfkammer: Tropfen sind zählbar, und es gelangt keine Luft ins System." },
            { t: "Tropfkammer ganz füllen, dann läuft es besser", fb: "Dann kannst du keine Tropfen zählen." },
            { t: "Kleine Luftblasen sind egal", ko: true, fb: "Kritisch: Luft wird vollständig entfernt. Sorgfalt beim Entlüften ist Prüfungsstandard." }
          ] },
          { t: "Zugang beurteilen", ph: "durch", img: "phleb", q: "Am Bett: Die Einstichstelle ist auf 2 cm gerötet, warm, schmerzhaft, ein Strang ist tastbar. Herr Brinkmann: „Das brennt seit heute Nacht.“ Was tust du?", opts: [
            { t: "Zugang nicht benutzen: Phlebitis (VIP-Score 3). Mit Frau Hoffmann den PVK entfernen, Einstichstelle beobachten, Arzt informieren, Befund dokumentieren; neuer Zugang an der anderen Seite durch den Arzt", ok: true, fb: "Richtig. Über einen entzündeten Zugang läuft keine Infusion. Erst der neue Zugang, dann die Antibiose." },
            { t: "Kurz spülen; wenn es durchgängig ist, die Infusion anhängen", ko: true, fb: "Kritisch: Eine Phlebitis verschlimmert sich durch weitere Infusionen, Keime können in die Blutbahn gelangen." },
            { t: "Kühlen und die Infusion trotzdem langsamer laufen lassen", fb: "Linderung ersetzt nicht die Entfernung. Der Zugang ist nicht mehr nutzbar." }
          ] },
          { t: "Neuer Zugang", ph: "durch", img: "neu", q: "Dr. Meier legt um 07:55 Uhr einen neuen PVK am rechten Unterarm. Worauf achtest du bei der Fixierung?", opts: [
            { t: "Hypoallergener, transparenter Folienverband ohne Zinkoxid, beschriftet mit Datum und Uhrzeit; Einstichstelle sichtbar", ok: true, fb: "Richtig. Transparenz erlaubt die tägliche Inspektion, das Datum die Liegedauer." },
            { t: "Zur Sicherheit mehrlagig mit dem Stationspflaster umwickeln", fb: "Zinkoxid-Pflaster verträgt er nicht, und die Einstichstelle wäre nicht mehr sichtbar." },
            { t: "Kein Verband nötig, er hält ja", fb: "Unfixierte Zugänge dislozieren leicht und sind ungeschützt." }
          ] },
          { t: "Hände und Handschuhe", ph: "durch", img: "neu", q: "Bevor ihr den Zugang benutzt:", opts: [
            { t: "Hygienische Händedesinfektion, unsterile Handschuhe", ok: true, fb: "Richtig. Kontakt mit Blut ist möglich." },
            { t: "Sterile Handschuhe und Kittel", fb: "Nicht nötig, entscheidend ist das Non-Touch-Prinzip." },
            { t: "Handschuhe ohne Händedesinfektion", fb: "Händedesinfektion vor aseptischen Tätigkeiten ist Pflicht (Moment 2 der 5 Momente)." }
          ] },
          { t: "Konnektor desinfizieren", ph: "durch", img: "scrub", q: "Wie bereitest du den Anschluss vor?", opts: [
            { t: "Konnektor bzw. Zuspritzventil mit alkoholischem Desinfektionstupfer mindestens 15 Sekunden abreiben und vollständig trocknen lassen", ok: true, fb: "Richtig. Scrub the hub: Mechanik plus Einwirkzeit." },
            { t: "Kurz ansprühen und sofort konnektieren", fb: "Ohne Wischen und Trocknen keine ausreichende Wirkung." },
            { t: "Gar nicht, der Zugang ist neu", ko: true, fb: "Kritisch: Jeder Zugriff auf das Gefäßsystem braucht die Desinfektion des Zugangs." }
          ] },
          { t: "Durchgängigkeit prüfen", ph: "durch", img: "flush", q: "Wie prüft ihr, ob der Zugang durchgängig ist?", opts: [
            { t: "Mit 10 ml NaCl 0,9 % aus einer Fertigspritze pulsierend spülen (Push-Pause), dabei auf Widerstand, Schwellung und Schmerz achten und Herrn Brinkmann fragen", ok: true, fb: "Richtig. Pulsierendes Spülen reinigt den Katheter besser als gleichmäßiger Druck." },
            { t: "Bei Widerstand fester drücken, dann löst sich das", ko: true, fb: "Kritisch: Druck kann ein Gerinnsel einschwemmen oder die Vene verletzen. Bei Widerstand stoppen." },
            { t: "Nicht spülen, die Infusion zeigt ja, ob es läuft", fb: "Erst spülen, dann anhängen. So erkennt ihr eine Fehllage, bevor das Medikament ins Gewebe läuft." }
          ] },
          { t: "Anschließen", ph: "durch", img: "flush", imgDone: "run0", q: "Der Zugang ist durchgängig. Wie geht es weiter?", opts: [
            { t: "Infusionssystem mit Luer-Lock konnektieren, Rollklemme öffnen, Verbindung sichern; Frau Hoffmann kontrolliert mit", ok: true, fb: "Richtig. Luer-Lock verhindert unbeabsichtigtes Lösen." },
            { t: "Einfach aufstecken, das hält", fb: "Ohne Sicherung kann sich die Verbindung lösen: Blutverlust und Kontamination." },
            { t: "Erst Rollklemme öffnen, dann anschließen", fb: "So läuft Infusion ins Bett und Luft kann ins System." }
          ] },
          { t: "Laufgeschwindigkeit", ph: "durch", img: "run0", imgDone: "run", q: "100 ml sollen in 30 Minuten laufen, das System gibt 20 Tropfen pro ml. Wie viele Tropfen pro Minute?", opts: [
            { t: "Etwa 67 Tropfen/min (100 ml × 20 Tr ÷ 30 min)", ok: true, fb: "Richtig. Herr Brinkmann wird nachrechnen." },
            { t: "33 Tropfen/min", fb: "Das wäre eine Laufzeit von 60 Minuten." },
            { t: "100 Tropfen/min", fb: "Das wäre eine Laufzeit von 20 Minuten." }
          ] },
          { t: "Überwachen", ph: "durch", img: "run", q: "Die Infusion läuft. Was jetzt?", opts: [
            { t: "In den ersten Minuten bei ihm bleiben und auf Unverträglichkeit achten (Juckreiz, Ausschlag, Atemnot), Einstichstelle kontrollieren, Klingel geben, Verlauf beobachten", ok: true, fb: "Richtig. Allergische Reaktionen treten oft in den ersten Minuten auf." },
            { t: "Gehen und in 30 Minuten wiederkommen", fb: "Zu früh allein gelassen: Eine Reaktion würde zu spät bemerkt." },
            { t: "Die Tropfgeschwindigkeit erhöhen, damit es schneller fertig ist", fb: "Die Laufzeit ist angeordnet und hat pharmakologische Gründe." }
          ] },
          { t: "Abschluss", ph: "nach", img: "ende", q: "Die Infusion ist durchgelaufen. Wie beendet ihr sie?", opts: [
            { t: "Rollklemme schließen, System lösen, Konnektor desinfizieren, mit 10 ml NaCl nachspülen, neue sterile Verschlusskappe, Material entsorgen, Händedesinfektion", ok: true, fb: "Richtig. Nachspülen verhindert Ablagerungen und Verstopfung." },
            { t: "System angehängt lassen bis morgen", fb: "Ein leeres System ist ein Infektionsrisiko und bringt Luft in die Leitung." },
            { t: "Ohne Nachspülen einfach eine Kappe drauf", fb: "Medikamentenreste im Katheter fördern Verschlüsse." }
          ] },
          { t: "Dokumentation", ph: "nach", img: "doku", q: "Was dokumentierst du?", opts: [
            { t: "Beginn und Ende, Wirkstoff, Dosis, Charge, Laufzeit, Verträglichkeit; Phlebitis mit VIP-Score und Entfernung des alten PVK; neuer PVK (Ort, Datum, Durchführende/r); Name der Pflegefachperson, die beaufsichtigt hat", ok: true, fb: "Richtig. Die Aufsicht gehört in die Dokumentation." },
            { t: "„Antibiose gelaufen“", fb: "Zu ungenau, die Phlebitis fehlt ganz." },
            { t: "Die Phlebitis weglassen, der Zugang ist ja jetzt neu", fb: "Komplikationen gehören immer in die Dokumentation, auch für die Qualitätssicherung." }
          ] }
        ],
        art: inf
      }
    ],
    st: {
      clock: "10:20", titel: "Brustschmerz in Zimmer 516",
      situation: "10:20 Uhr. Herr Reuter (63, Zimmer 516, Abklärung Thoraxschmerz, Patient deiner Kollegin) klingelt: Er hat seit fünf Minuten starke Brustschmerzen, die in den linken Arm ziehen, ist kaltschweißig und blass. Im selben Moment ruft das Labor an: „Kritischer Wert für Frau Kranz, Kalium 2,9 mmol/l.“ Und am Stützpunkt wartet die Tochter von Frau Kranz und möchte „jetzt sofort“ über das betreute Wohnen sprechen.",
      order: [
        { id: "a", t: "Zu Herrn Reuter: Oberkörper hoch, beruhigen, Notruf bzw. Hilfe holen, bei ihm bleiben", warum: "Verdacht auf akutes Koronarsyndrom: lebensbedrohlich, zeitkritisch." },
        { id: "b", t: "Arzt sofort informieren: V. a. ACS; 12-Kanal-EKG vorbereiten bzw. sofort schreiben (Ziel: innerhalb von 10 Minuten)", warum: "Ein EKG innerhalb von 10 Minuten entscheidet über die weitere Therapie." },
        { id: "c", t: "Vitalzeichen, SpO₂, Schmerzstärke; Medikamente erst auf ärztliche Anordnung", warum: "Überwachen bis der Arzt übernimmt. Keine Selbstmedikation aus dem Notfallwagen." },
        { id: "d", t: "Kritischen Laborwert wiederholen (Read-back), dokumentieren und sofort an den Arzt weitergeben", warum: "Kalium 2,9 bei Digitoxin ist gefährlich. Der Arzt ist ohnehin gleich bei Herrn Reuter." },
        { id: "e", t: "Tochter von Frau Kranz freundlich vertrösten und einen Termin anbieten", warum: "Wichtig, aber nicht akut. Keine Auskunft über andere Patienten." },
        { id: "f", t: "Ereignis bei Herrn Reuter und Laborwert dokumentieren, Übergabe an die Kollegin", warum: "Nach der Akutversorgung lückenlos dokumentieren." }
      ],
      mc: { text: "Zum telefonisch durchgegebenen kritischen Laborwert: Was ist richtig? (Mehrfachauswahl)", opts: [
        { t: "Wert, Patient und Geburtsdatum wiederholen (Read-back), Name des Anrufers und Uhrzeit notieren", ok: true, fb: "So werden Hör- und Verwechslungsfehler vermieden." },
        { t: "Den Arzt sofort informieren und das in der Dokumentation festhalten", ok: true, fb: "Kritische Werte haben eine Meldekette." },
        { t: "Digitoxin bleibt pausiert, Kaliumgabe nur nach ärztlicher Anordnung anpassen", ok: true, fb: "Pflege ändert keine Dosierungen eigenmächtig." },
        { t: "Bis zur Visite warten, Frau Kranz geht es ja gerade gut", ok: false, fb: "Kritische Werte werden unverzüglich gemeldet." },
        { t: "Ihr gleich eine Extra-Kaliumtablette aus dem Stationsvorrat geben", ok: false, fb: "Eigenmächtige Medikation ist nicht zulässig." }
      ] },
      merke: "Brustschmerz mit Ausstrahlung ist ein Zeitnotfall. Kritische Laborwerte werden sofort und mit Read-back weitergegeben."
    },
    doku: {
      clock: "11:00",
      auftrag: "Schreibe den Pflegebericht zu Herrn Brinkmann für den Zeitraum 07:30 bis 08:45 Uhr (PVK-Befund, neuer Zugang, Infusion).",
      muster: "07:30 PVK li. Unterarm (seit 06.11. 10:00): Einstichstelle auf 2 cm gerötet, überwärmt, druckschmerzhaft, Strang tastbar. Pat. äußert: „Das brennt seit heute Nacht.“ VIP-Score 3. 07:35 Dr. Meier informiert. 07:40 PVK gemeinsam mit S. Hoffmann (PFK) entfernt, Katheter intakt, Einstichstelle mit Kompresse versorgt. 07:55 neuer PVK re. Unterarm (Dr. Meier), hypoallergener Folienverband, beschriftet. 08:10 Ceftriaxon 2 g in 100 ml NaCl 0,9 % (Ch.-B. 22A41) nach Spülung mit 10 ml NaCl (durchgängig, schmerzfrei) unter Aufsicht S. Hoffmann angehängt, 67 Tr/min. Pat. die ersten 5 min beobachtet, keine Unverträglichkeitszeichen. 08:40 Infusion beendet, nachgespült, neue Verschlusskappe. SpO₂ 90 % unter 2 l O₂, wach, orientiert. [Name, Handzeichen; Aufsicht: S. Hoffmann]",
      chk: [
        { t: "Uhrzeiten für Befund, Arzt, Entfernung, Infusion", kw: ["07:", "08:"] },
        { t: "PVK-Befund konkret mit VIP-Score", kw: ["vip", "gerötet", "cm"] },
        { t: "Patientenaussage wörtlich", kw: ["„", "\"", "äußert"] },
        { t: "Arzt mit Name, neuer Zugang", kw: ["dr.", "meier", "neuer pvk", "arzt"] },
        { t: "Infusion: Wirkstoff, Dosis, Charge, Laufzeit", kw: ["ceftriaxon", "2 g", "ch.", "charge", "tr/min", "min"] },
        { t: "Aufsichtsführende Pflegefachperson genannt", kw: ["hoffmann", "aufsicht", "pfk"] },
        { t: "Verträglichkeit/Evaluation", kw: ["keine", "verträg", "reaktion", "beschwerdefrei"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "07:30 PVK li.: Rötung 2 cm, überwärmt, Strang tastbar, VIP 3.", bad: false, fb: "In Ordnung." },
          { t: "Zugang sah etwas komisch aus.", bad: true, fb: "Wertend und unbestimmt. Konkret beschreiben und VIP-Score angeben." },
          { t: "Antibiose angehängt.", bad: true, fb: "Ohne Wirkstoff, Dosis, Uhrzeit, Laufzeit und Aufsicht nicht verwertbar." },
          { t: "08:10 Ceftriaxon 2 g i.v. über neuen PVK re., Laufzeit 30 min, Aufsicht S. Hoffmann.", bad: false, fb: "In Ordnung." },
          { t: "Pat. ist schwierig, weil er alles nachrechnet.", bad: true, fb: "Persönliche Wertung, gehört nicht in den Bericht." },
          { t: "Pat. äußert: „Das brennt seit heute Nacht.“", bad: false, fb: "In Ordnung." },
          { t: "O₂ war bei 4 l, hab auf 2 l gestellt.", bad: true, fb: "Ohne Uhrzeit, Begründung (AO, Zielsättigung), Bewusstseinslage und Handzeichen." },
          { t: "Nachtrag 09:00 zu 07:40: PVK-Spitze intakt. S. H.", bad: false, fb: "In Ordnung, korrekt gekennzeichnet." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib beide Patienten an den Spätdienst (Pflegefachkraft Jonas Weber).",
      muster: "Herr Brinkmann, 512: Pneumonie und COPD GOLD 3. Nachts Hyperkapnie nach eigenmächtiger O₂-Erhöhung auf 4 l, pCO₂ 58. Heute wach, SpO₂ 89–91 % unter 2 l, Ziel 88–92 %. Er kann jetzt erklären, warum mehr Sauerstoff ihm schadet. PVK li. wegen Phlebitis (VIP 3) entfernt, neuer PVK re. seit 07:55, hypoallergen fixiert (Zinkoxid-Allergie). Ceftriaxon 08:10–08:40 ohne Reaktion. Inhalationsschulung begonnen, Technik noch unsicher, bitte morgen wiederholen. Sozialdienst wegen Besuchen bei der Ehefrau angefragt.\n\nFrau Kranz, 514: Dekompensierte Herzinsuffizienz, heute +2,8 kg seit Montag. V. a. Digitalis-Überdosierung (HF 52, Gelbsehen, Übelkeit) bei Kalium 3,0, Labor 10:20 Kalium 2,9 kritisch, Arzt informiert, Kalium wird i.v. ersetzt (ärztlich). Digitoxin und Bisoprolol pausiert, Spiegel ausstehend. Apixaban-Dosis im Dispenser war falsch (5 statt 2,5 mg), ausgetauscht, gemeldet. Trinkplan 1,5 l mit Messbecher, sie hat zugestimmt, die Brühe auf eine halbe Tasse zu reduzieren. Puls immer 60 Sekunden. Tochter möchte über betreutes Wohnen sprechen, Termin morgen 11 Uhr mit Sozialdienst.",
      chk: [
        { t: "Beide Patienten mit Kernproblem und aktuellem Zustand", kw: ["512", "514", "brinkmann", "kranz"] },
        { t: "Offene Aufgaben (Spiegel, Kalium, Schulung, Termin)", kw: ["spiegel", "kalium", "schulung", "termin", "bitte"] },
        { t: "Sicherheitsrelevantes (O₂-Ziel, pausierte Medikamente, Allergie)", kw: ["88", "pausiert", "zinkoxid", "allergi"] }
      ]
    },
    refl: [
      { q: "Warum hast du bei der Kurzinfusion zuerst eine Pflegefachperson dazugeholt, obwohl du die Handgriffe kennst?", muster: "Tätigkeiten an Infusionen und Gefäßzugängen führe ich als Auszubildende nur unter direkter Aufsicht einer Pflegefachperson aus. Das schützt Herrn Brinkmann und mich, weil Fehler direkt in die Blutbahn gehen. In der Situation hat sich das bewährt: Zu zweit haben wir die Phlebitis bewertet, den Zugang entfernt und auf den neuen Zugang gewartet, statt aus Zeitdruck den alten zu benutzen. Hilfe einzufordern zeigt Verantwortungsbewusstsein." },
      { q: "Welche Hinweise hatten dich bei Frau Kranz an eine Digitalis-Überdosierung denken lassen, und was hast du konkret getan?", muster: "Übelkeit und Erbrechen, Gelbsehen, Bradykardie (52/min) und dazu ein niedriges Kalium, das die Digitaliswirkung verstärkt. Ich habe den Puls eine volle Minute getastet, NEWS2 berechnet, sie in Herzbettlage gebracht und den Arzt vor der Medikamentengabe informiert. Digitoxin und Bisoprolol habe ich erst nach Rücksprache zurückgehalten, den Dispenser gegen die neue Anordnung geprüft und die falsche Apixaban-Dosis gefunden." },
      { q: "Herr Brinkmann hatte sich selbst mehr Sauerstoff gegeben. Wie hast du ihn beraten?", muster: "Ich habe an sein Denken als Mathematiker angeknüpft: Sein Atemantrieb reagiert bei COPD auf andere Werte, deshalb ist sein Ziel 88–92 % und nicht 98 %. Zu viel Sauerstoff kann Kohlendioxid ansteigen lassen; das war die Müdigkeit in der Nacht. Ich habe ihm die Zielwerte aufgeschrieben, ihn gebeten, das in eigenen Worten zu erklären, und vereinbart, dass er bei Atemnot klingelt statt am Regler zu drehen." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
