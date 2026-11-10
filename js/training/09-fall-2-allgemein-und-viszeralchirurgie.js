/* ===== Fall 2: Allgemein- und Viszeralchirurgie ===== */
(function () {
  var A = window.PXA; if (!A) return;

  /* ---------- Illustrationen ---------- */
  function torso(extra) {
    return A.table() + A.p("M90 20C70 90 74 200 96 280H304C326 200 330 90 310 20Z", "h-skin") + A.e(200, 120, 70, 50, "h-soft") +
      A.p("M196 128a4 4 0 1 0 8 0 4 4 0 1 0-8 0", "h-navel") + A.r(193, 40, 14, 74, 4, "x-film") + A.p("M200 46v62", "h-cut") + (extra || "");
  }
  var STX = 136, STY = 186;
  function stoma(x, y, red) { return (red ? A.c(x, y, 36, "x-redskin") : "") + A.e(x, y, 17, 15, "x-stoma") + A.e(x - 4, y - 4, 7, 5, "x-stomah") + A.p("M" + (x - 3) + " " + (y + 2) + "a3 3 0 1 0 6 0", "h-navel"); }
  function plate(x, y, hole) { return A.c(x, y, 40, "x-plate") + A.c(x, y, 30, "x-platec") + (hole ? A.c(x, y, hole, "x-hole") : ""); }
  function pouch(x, y, fill) { return A.p("M" + (x - 34) + " " + (y - 30) + "h68v78a24 24 0 0 1-24 24h-20a24 24 0 0 1-24-24z", "x-bag") + (fill ? A.p("M" + (x - 32) + " " + (y + 30) + "h64v18a22 22 0 0 1-22 22h-20a22 22 0 0 1-22-22z", "x-wet") : "") + A.c(x, y, 22, "x-plate") + A.r(x - 14, y + 70, 28, 10, 4, "x-clamp"); }
  var st = {
    mat: A.table() + A.tray(20, 30, 360, 170) +
      A.c(76, 80, 32, "x-plate") + A.c(76, 80, 10, "x-platec") + A.t(76, 128, "Basisplatte", "x-txt x-s") +
      A.p("M130 52h56v66a18 18 0 0 1-18 18h-20a18 18 0 0 1-18-18z", "x-bag") + A.t(158, 152, "Ausstreifbeutel", "x-txt x-s") +
      A.r(208, 50, 70, 50, 6, "x-white") + A.c(226, 68, 6, "x-platec") + A.c(244, 68, 9, "x-platec") + A.c(264, 68, 12, "x-platec") + A.t(243, 114, "Messschablone", "x-txt x-s") +
      A.p("M300 54l40 40M340 54l-40 40", "x-metall") + A.c(298, 52, 7, "x-white") + A.c(342, 52, 7, "x-white") + A.t(320, 112, "gebogene Schere", "x-txt x-s") +
      A.e(70, 162, 34, 14, "x-aqua") + A.t(70, 192, "warmes Wasser", "x-txt x-s") + A.gauze(118, 146, 50, 30) + A.t(143, 192, "Kompressen", "x-txt x-s") + A.c(206, 160, 16, "x-plate") + A.c(206, 160, 8, "x-platec") + A.t(206, 192, "Hautschutzring", "x-txt x-s") +
      A.r(262, 140, 24, 40, 6, "x-bottle") + A.t(274, 192, "Haftentferner", "x-txt x-s") + A.r(316, 140, 46, 40, 4, "x-pack") + A.t(339, 192, "Abwurf", "x-txt x-s") +
      A.tag(110, 238, "kein Alkohol, kein Benzin", "x-tag x-tagr") + A.tag(276, 238, "unparfümierte Pflege", "x-tag x-tagg"),
    bag: torso(pouch(STX, STY, true)) + A.tag(270, 250, "Beutel zu einem Drittel gefüllt", "x-tag"),
    leer: torso(pouch(STX, STY, false)) + A.p("M136 266v12", "x-tube") + A.e(136, 276, 30, 6, "x-wet") + A.tag(270, 250, "erst entleeren, dann wechseln", "x-tag x-tagg"),
    ab: torso(stoma(STX, STY, true) + A.p("M" + (STX - 40) + " " + (STY - 6) + "a40 40 0 0 1 64-30l-8 8a30 30 0 0 0-46 22z", "x-plate") + A.glove(170, 120, 0.8, "x-glove")) + A.tag(270, 250, "von oben nach unten, Haut gegenhalten", "x-tag"),
    clean: torso(stoma(STX, STY, true) + A.c(STX + 40, STY - 34, 13, "x-swab") + A.p("M" + (STX + 30) + " " + (STY - 24) + "q-16 4-22 16", "x-arrow")) + A.tag(270, 250, "Wasser, weiche Kompressen, außen → innen", "x-tag"),
    rot: torso(stoma(STX, STY, true)) + A.tag(250, 236, "Rötung, nässend, juckt", "x-tag x-tagr") + A.p("M196 226l-34-22", "x-arrow"),
    mess: torso(stoma(STX, STY, true) + A.r(STX - 46, STY - 40, 92, 80, 8, "x-film") + A.c(STX, STY, 18, "x-platec") + A.c(STX, STY, 24, "x-platec")) + A.tag(260, 250, "Ø 32 mm messen · Öffnung 1–2 mm größer", "x-tag x-tagg"),
    cut: A.table() + plate(200, 130, 17) + A.p("M250 70l-40 50M290 80l-60 40", "x-metall") + A.c(258, 64, 9, "x-white") + A.c(298, 78, 9, "x-white") + A.tag(200, 214, "Öffnung 34 mm · Kanten glatt", "x-tag x-tagg"),
    platte: torso(A.c(STX, STY, 40, "x-plate") + A.c(STX, STY, 22, "x-plate") + stoma(STX, STY, false) + A.p("M" + (STX - 30) + " " + (STY + 34) + "q30 16 60 0", "x-arrow")) + A.tag(270, 250, "von unten nach oben anmodellieren", "x-tag"),
    fertig: torso(pouch(STX, STY, false)) + A.tick(250, 160) + A.tag(270, 250, "Rastring geschlossen · Auslass zu", "x-tag x-tagg"),
    edu: A.room() + A.r(60, 120, 140, 70, 10, "x-chair") + A.head(130, 76, 20, "x-hairg") + A.face(130, 78, "flat") + A.r(100, 98, 60, 70, 14, "x-gown") +
      A.r(214, 70, 46, 64, 8, "x-white") + A.r(219, 75, 36, 54, 6, "x-film") + A.p("M160 120l54-20", "x-arrow") + A.head(300, 78, 16, "x-hairb") + A.r(284, 96, 32, 64, 12, "x-scrub") +
      A.tag(200, 230, "Spiegel · Schritte selbst benennen", "x-tag x-tagg"),
    doku: A.table() + A.r(70, 20, 260, 230, 8, "x-board") + A.r(84, 34, 232, 206, 4, "x-paper") + A.t(100, 58, "Stomaprotokoll 07:35", "x-txt x-b", "start") +
      ["Ileostoma re., rosig-rot, Ø 32 mm", "Schleimhaut intakt, prominent 1 cm", "Haut: Rötung nässend 4–7 Uhr", "Ausfuhr Nacht 850 ml, flüssig", "Ring + Platte 34 mm", "Pat. streift selbst aus · HZ"].map(function (l, i) { return A.t(100, 84 + i * 24, l, "x-txt x-s", "start"); }).join("") + A.tick(300, 226)
  };

  function hollwegScene() {
    var s = A.room() + A.r(250, 26, 70, 60, 4, "h-win") + A.p("M285 26v60M250 56h70", "h-line");
    s += A.r(30, 138, 330, 26, 8, "x-mattress") + A.bedSide(24, 162, 342) + A.r(30, 116, 70, 26, 12, "h-pill");
    s += A.head(70, 112, 18, "x-hairg") + A.c(70, 113, 16, "x-pale") + A.face(70, 114, "flat") + A.c(58, 104, 2, "x-sweat") + A.c(82, 102, 2, "x-sweat") + A.c(76, 124, 1.8, "x-sweat");
    s += A.p("M54 116c4 6 28 6 32 0", "x-o2") + A.p("M86 114c20 10 30 40 30 60", "x-o2");
    s += A.r(88, 120, 130, 26, 12, "x-gown") + A.r(150, 124, 26, 16, 3, "h-gauze") + A.e(163, 132, 9, 6, "x-blood") + A.e(158, 129, 4, 3, "x-bloodl");
    s += A.r(214, 124, 136, 20, 10, "x-legs") + A.r(214, 132, 136, 10, 5, "x-stock") + A.p("M300 126v18", "x-rollo") + A.r(296, 124, 12, 20, 5, "x-rolled");
    s += A.p("M176 140c4 30 2 50 6 64", "x-tube") + A.p("M160 204h50v40a8 8 0 0 1-8 8h-34a8 8 0 0 1-8-8z", "x-bag") + A.p("M162 222h46v20a6 6 0 0 1-6 6h-34a6 6 0 0 1-6-6z", "x-bloodl") + A.p("M162 234h46v8a6 6 0 0 1-6 6h-34a6 6 0 0 1-6-6z", "x-blood");
    s += A.p("M226 146c8 40 10 80 -6 108", "x-tube") + A.p("M190 254h52v22H190z", "x-bag") + A.p("M192 262h48v12h-48z", "x-urine");
    s += A.p("M366 150c8 10 8 30 4 50", "x-cable") + A.c(370, 204, 8, "h-bell");
    return s;
  }

  /* ---------- Fall ---------- */
  var C = {
    id: "viszeral", titel: "Stoma, Nachblutung und eine Pizza", station: "Viszeralchirurgie · Station 3A", haus: "Klinikum Am Schlossgarten", farbe: "#0891B2",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    kurz: "Ein Mann, der sein neues Stoma nicht ansehen will, eine stille Patientin am ersten Tag nach der Darm-OP, die nicht klingelt, und ein nervöser Sportlehrer vor seiner Gallen-OP.",
    anleitung: "Mehmet Kaya", pruefer: "Frau Lindner",
    briefing: [
      "Moin und willkommen auf der 3A. Ich bin Mehmet Kaya, Praxisanleiter hier. Frau Lindner von der Pflegeschule prüft morgen mit. Auf unserer Station liegen Menschen vor und nach Operationen am Bauch: Darm, Galle, Magen, Hernien. Das heißt für dich: Wunden, Drainagen, Stomata, Schmerzen, Nüchternheit und viel Beratung.",
      "Deine drei Menschen: Herr Petersen hat seit sechs Tagen ein Ileostoma, Frau Hollweg ist gestern am Sigma operiert worden, und Herr Wendt kommt morgen früh als Erster in den OP. Heute sammelst du Informationen und planst. Morgen versorgst du alle drei im Frühdienst.",
      "Eine Regel, die ich jedem sage: Auf einer chirurgischen Station verändern sich Menschen schnell. Ein Puls, der in der Nacht von 88 auf 104 klettert, ist ein Befund, auch wenn er noch „im Rahmen“ wirkt. Und Medikamente prüfst du immer selbst, egal wer sie gerichtet hat."
    ],
    order: ["A", "B", "C"],
    pat: {
      A: {
        key: "A", name: "Ralf Petersen", kurz: "Herr Petersen", alter: 58, zimmer: "305", modus: "Pflegehandlung", farbe: "#0891B2",
        typ: "Brummig und sarkastisch, ehemaliger Fernfahrer. Versteckt Scham hinter Sprüchen, schaut sein Stoma nicht an.",
        diagnose: "Tiefe anteriore Rektumresektion bei Rektumkarzinom, protektives doppelläufiges Ileostoma rechts; Tag 6.",
        daten: [
          ["Vorerkrankungen", "Adipositas (BMI 32), arterielle Hypertonie, Nikotinkonsum seit 40 Jahren"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "verheiratet (Ehefrau Birgit), eigene Werkstatt, kein Pflegegrad"],
          ["Medikation", "Metamizol 1 g 1-1-1-1 · Pantoprazol 40 mg 1-0-0 · Enoxaparin 40 mg s.c. 18 Uhr · Amlodipin 5 mg 1-0-0 · Loperamid 2 mg bei Bedarf nach ärztlicher Rücksprache"],
          ["Vitalwerte Tag 1, 15 Uhr", "RR 132/84 mmHg · HF 84/min · T 37,1 °C · SpO₂ 96 % · Schmerz NRS 2"],
          ["Ausscheidung", "Ileostoma 1.350 ml/24 h, dünnflüssig · Urin 900 ml/24 h · Stomatherapie-Termin übermorgen"]
        ],
        anamnese: "Wissen Se, ich bin 35 Jahre LKW gefahren, da hat man keine Zeit, krank zu sein. Und jetzt hab ich das Ding da am Bauch. Den Beutel guck ich nicht an, das soll meine Frau machen, hat der Doktor gesagt. Die ekelt sich aber, die schläft jetzt im Gästezimmer, sagt was vom Geruch. Gestern hab ich den Beutel dreimal ausgeleert, da kommt nur so braunes Wasser. Trinken? Kaffee, drei, vier Tassen. Wasser schmeckt ja nach nix. Pinkeln muss ich wenig, ist ziemlich dunkel. Unter der Platte juckt's und brennt, da hab ich heute Nacht mal drunter gekratzt. Rauchen soll ich ja nicht, hab ich aber trotzdem, zwei Stück unten vorm Haupteingang. Ich will nach Hause, ich hab ne Werkstatt, ich schraub an alten Motorrädern. Kann ich mit so 'nem Beutel überhaupt wieder fahren? Und schwimmen geh ich dann wohl auch nicht mehr.",
        kern: [
          { t: "Schaut das Stoma nicht an, will Versorgung abgeben: Hinweis auf Körperbildstörung, Selbstversorgung noch nicht angebahnt", kw: ["körperbild", "nicht an", "guck", "schaut", "akzeptanz", "ablehn", "selbstversorg"] },
          { t: "Hohe, dünnflüssige Ileostoma-Ausfuhr bei geringer Trinkmenge und dunklem Urin: Gefahr von Dehydratation und Elektrolytverlust", kw: ["dehydr", "ausfuhr", "trink", "dunkel", "flüssigkeit", "elektrolyt", "bilanz", "high output"] },
          { t: "Juckreiz und Brennen unter der Basisplatte, hat gekratzt: Verdacht auf peristomale Hautschädigung durch Unterwanderung", kw: ["juck", "brenn", "haut", "kratz", "unterwander", "peristomal", "leckage"] },
          { t: "Raucht trotz frischer OP: Wundheilungs- und Anastomosenrisiko", kw: ["rauch", "nikotin", "zigarett"] },
          { t: "Ehefrau soll die Versorgung übernehmen, ekelt sich und zieht sich zurück: Belastung der Partnerschaft", kw: ["frau", "ekel", "gästezimmer", "partner", "angehörig"] },
          { t: "Angst vor Geruch und sozialem Rückzug", kw: ["geruch", "rückzug", "scham"] },
          { t: "Trinkt vor allem Kaffee, kaum elektrolythaltige Getränke", kw: ["kaffee"] },
          { t: "Ressourcen und Ziele: Werkstatt, Motorradfahren, Schwimmen – Lebensqualität als Motivation", kw: ["werkstatt", "motorrad", "schwimm", "ressource", "ziel"] }
        ]
      },
      B: {
        key: "B", name: "Ingrid Hollweg", kurz: "Frau Hollweg", alter: 71, zimmer: "306", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#DB2777",
        typ: "Freundlich, bescheiden, ehemalige Bankkauffrau. Will niemandem zur Last fallen und klingelt deshalb kaum.",
        diagnose: "Laparoskopische Sigmaresektion bei rezidivierender Divertikulitis; Tag 1. Easyflow-Drainage links, Blasenkatheter.",
        daten: [
          ["Vorerkrankungen", "Hypothyreose, arterielle Hypertonie, Varikosis beidseits"],
          ["Allergien", "Metamizol (Agranulozytose 2019)"],
          ["Soziales", "verwitwet, lebt allein, Sohn in München"],
          ["Medikation", "Levothyroxin 75 µg 1-0-0 (nüchtern) · Ramipril 5 mg 1-0-0 · Pantoprazol 40 mg 1-0-0 · Enoxaparin 40 mg s.c. 08 Uhr · Paracetamol 1 g i.v. 1-1-1-1 · Piritramid i.v. bei Bedarf durch Pflegefachperson"],
          ["Vitalwerte Tag 1, 16 Uhr", "RR 128/76 mmHg · HF 88/min · T 37,2 °C · SpO₂ 96 % (Raumluft) · AF 16/min · Schmerz NRS 3"],
          ["Drainage", "Easyflow links: OP-Ende bis 16 Uhr 60 ml serös-blutig"]
        ],
        anamnese: "Ach, das ist ja nett, dass Sie fragen. Mir geht's gut, wirklich, ich will gar nicht klagen. Die Ärzte haben gesagt, es ist alles gut gelaufen. Ich hatte ja schon dreimal diese Entzündung im Darm, jetzt ist das Stück raus. Zu Hause bin ich allein, mein Mann ist vor vier Jahren gestorben, und der Junge wohnt in München, der hat genug um die Ohren. Ich hab so Strümpfe an, die drücken ein bisschen an der Wade, ich hab sie mal ein Stück runtergerollt. Mir ist nur manchmal so kalt, und ein bisschen flau. Die Klingel? Die hängt da hinten irgendwo, ich brauch die ja nicht. Wissen Sie, im Krankenhaus will man ja niemanden aufhalten, die haben alle so viel zu tun. Ach, und Novalgin darf ich nicht, da war mal was mit dem Blut, das stand im Brief vom Hausarzt. Zuhause nehme ich noch meine Schilddrüsentablette, immer eine halbe Stunde vor dem Frühstück.",
        kern: [
          { t: "Bagatellisiert, will nicht zur Last fallen, klingelt nicht: Symptome werden spät gemeldet", kw: ["klingel", "last", "bagatell", "melde", "nicht klagen", "zurückhalt"] },
          { t: "Frieren und „flau“: unspezifische, aber mögliche Frühzeichen einer Kreislaufverschlechterung (Nachblutung, Sepsis)", kw: ["kalt", "flau", "fröstel", "kreislauf", "nachblut", "schock"] },
          { t: "Kompressionsstrümpfe heruntergerollt: Schnürfurche, Thromboserisiko bei Varikosis", kw: ["strümpf", "strumpf", "kompression", "thrombo", "gerollt"] },
          { t: "Klingel nicht in Reichweite", kw: ["klingel", "reichweite"] },
          { t: "Unverträglichkeit Metamizol (Agranulozytose): bei jeder Analgesie beachten", kw: ["metamizol", "novalgin", "agranulo", "allergi"] },
          { t: "Levothyroxin 30 Minuten vor dem Frühstück: Einnahmezeitpunkt", kw: ["levothyrox", "schilddrüse", "nüchtern", "halbe stunde"] },
          { t: "Lebt allein, Sohn weit weg: Entlassungsmanagement früh planen", kw: ["allein", "sohn", "münchen", "entlass", "witwe"] },
          { t: "Drainage und Katheter: Ausscheidung und Sekret engmaschig beobachten", kw: ["drainage", "sekret", "katheter", "ausscheid"] }
        ]
      },
      C: {
        key: "C", name: "Tobias Wendt", kurz: "Herr Wendt", alter: 44, zimmer: "307", modus: "Beratung", farbe: "#EA580C",
        typ: "Sportlehrer, redet schnell und viel, googelt alles und ist dabei ziemlich nervös.",
        diagnose: "Symptomatische Cholezystolithiasis; elektive laparoskopische Cholezystektomie morgen 08:00 Uhr (erster Saal).",
        daten: [
          ["Vorerkrankungen", "Diabetes mellitus Typ 2 (oral), Adipositas Grad I"],
          ["Allergien", "keine bekannt"],
          ["Soziales", "verheiratet, zwei Kinder, Ehefrau Svenja"],
          ["Medikation", "Metformin 1000 mg 1-0-1 · Ramipril 2,5 mg 1-0-0"],
          ["Vitalwerte heute, 10 Uhr", "RR 138/86 mmHg · HF 92/min · T 36,8 °C · BZ 142 mg/dl"],
          ["Termine", "Anästhesie-Aufklärung heute 11:00 Uhr · Labor abgenommen"]
        ],
        anamnese: "Hallo! Also, ich hab mich schon ein bisschen eingelesen, man findet ja alles im Netz. Die Gallensteine hab ich seit dem Sommer, immer wenn ich fettig esse, kriege ich diese Krämpfe hier rechts. Letzte Woche nach dem Grillen musste ich nachts in die Notaufnahme. Ich bin Sportlehrer, ich muss schnell wieder fit sein, die Klassenfahrt ist in drei Wochen. Ehrlich gesagt hab ich Schiss vor der Narkose, mein Vater ist nach einer OP mal schwer wach geworden. Heute Abend wollte ich mir noch eine Pizza bestellen, quasi Henkersmahlzeit, haha. Und ohne meinen Kaffee mit Milch morgens geht bei mir gar nichts. Meine Diabetes-Tabletten nehme ich morgens und abends. Ach ja, meinen Ehering krieg ich seit zwei Jahren nicht mehr ab. Und ich trage Kontaktlinsen.",
        kern: [
          { t: "Ausgeprägte Angst vor der Narkose (Erfahrung des Vaters)", kw: ["angst", "schiss", "narkose", "vater", "sorge"] },
          { t: "Plant fettreiche Mahlzeit am Vorabend: Risiko für Gallenkolik und Unklarheit über Nüchternheit", kw: ["pizza", "fett", "kolik", "nüchtern", "essen"] },
          { t: "Gewohnheit Kaffee mit Milch am Morgen: Milch gilt nicht als klare Flüssigkeit", kw: ["kaffee", "milch", "klare"] },
          { t: "Diabetes Typ 2 mit Metformin: Umgang mit Medikation und BZ am OP-Tag klären", kw: ["metformin", "diabet", "bz", "blutzucker"] },
          { t: "Ehering lässt sich nicht abnehmen", kw: ["ring", "ehering", "schmuck"] },
          { t: "Kontaktlinsen", kw: ["kontaktlinse", "linse"] },
          { t: "Informiert sich im Internet: Fehlinformationen möglich, Bedarf an verlässlicher Beratung", kw: ["internet", "google", "netz", "eingelesen", "information"] },
          { t: "Ziel: schnell wieder belastbar (Klassenfahrt): realistische Erwartungen besprechen", kw: ["klassenfahrt", "fit", "sport", "belast"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Gefahr eines Flüssigkeitsdefizits (NANDA-I 00028) b/d hoher Ileostoma-Ausfuhr bei geringer Trinkmenge, a/d dunklem Urin und 900 ml Urin in 24 h. Dazu: Beeinträchtigte Hautintegrität peristomal (00046) b/d Unterwanderung der Basisplatte, a/d Juckreiz und Brennen; Körperbildstörung (00118) a/d Weigerung, das Stoma anzusehen.",
        ziel: "Herr Petersen trinkt mindestens die ärztlich festgelegte Menge, davon ein Teil elektrolythaltig; Urin mindestens 1.000 ml/24 h und hell. Die peristomale Haut ist bis zum Termin bei der Stomatherapie reizfrei. Er schaut beim nächsten Wechsel hin und führt bis zur Entlassung drei Schritte selbst aus.",
        mass: [
          "Ein- und Ausfuhrbilanz mit Stoma-Ausfuhr, tägliches Gewicht; bei Ausfuhr über 1.500 ml/24 h Arzt informieren (Loperamid nur nach Rücksprache)",
          "Trinkplan mit elektrolythaltigen Getränken (z. B. Brühe, isotonische Getränke nach Absprache), Kaffee nicht als Hauptgetränk",
          "Stomaversorgung: Basisplatte exakt 1–2 mm größer als das Stoma zuschneiden, Hautschutzring, regelmäßige Wechsel, Haut beurteilen und dokumentieren",
          "Edukation in kleinen Schritten mit Spiegel; Stomatherapie einbinden; Ehefrau nur mit seinem Einverständnis und ohne Zwang beteiligen",
          "Gespräch über Ängste (Geruch, Motorrad, Schwimmen), Selbsthilfe (z. B. ILCO) anbieten; Rauchstopp-Beratung"
        ],
        chk: [
          { t: "Flüssigkeitsdefizit/Dehydratation als Pflegediagnose mit Ausfuhr und Urin", kw: ["flüssigkeit", "dehydr", "volumen"] },
          { t: "Peristomale Hautschädigung erkannt", kw: ["haut", "peristomal", "juck"] },
          { t: "Körperbild / Selbstversorgung als Problem", kw: ["körperbild", "selbstversorg", "akzeptanz", "edukation", "anleitung"] },
          { t: "Ziel mit Urinmenge, Hautbefund oder Selbstversorgungsschritten", kw: ["ml", "schritte", "selbst", "reizfrei"] },
          { t: "Bilanz und Arztinformation bei hoher Ausfuhr", kw: ["bilanz", "1.500", "1500", "arzt", "loperamid"] },
          { t: "Korrekte Versorgungstechnik (Öffnung anpassen, Hautschutz)", kw: ["zuschneid", "schablone", "hautschutz", "1–2", "1-2", "öffnung"] },
          { t: "Stomatherapie, Selbsthilfe, Rauchstopp oder Angehörige einbinden", kw: ["stomatherap", "ilco", "selbsthilfe", "rauch", "ehefrau"] }
        ]
      },
      B: {
        diag: "Gefahr einer Blutung bzw. eines Volumenmangels (00206) b/d frischer Darmanastomose und postoperativer Antikoagulation; Gefahr eines verzögerten Erkennens b/d Zurückhaltung, a/d „will niemanden aufhalten“, Klingel außer Reichweite. Dazu: Thrombosegefahr (Varikosis, Strümpfe heruntergerollt).",
        ziel: "Veränderungen von Kreislauf, Drainage und Wunde werden innerhalb einer Stunde erkannt und gemeldet. Frau Hollweg klingelt bei Frieren, Schwindel oder Schmerz und kann das selbst benennen.",
        mass: [
          "Vitalzeichen mindestens alle 4 Stunden und bei Bedarf, mit NEWS2 und Verlauf; Drainage- und Wundkontrolle bei jedem Kontakt",
          "Klingel in Reichweite, Frau Hollweg ausdrücklich auffordern zu klingeln, Warnzeichen erklären",
          "Kompressionsstrümpfe korrekt sitzend ohne Falten, Frühmobilisation nach Anordnung",
          "Metamizol-Unverträglichkeit sichtbar dokumentieren; Analgesie nach Anordnung ohne Metamizol",
          "Levothyroxin nüchtern 30 Minuten vor dem Frühstück; Entlassung früh planen (lebt allein)"
        ],
        chk: [
          { t: "Blutungs-/Volumenmangel- oder Infektionsgefahr als Diagnose", kw: ["blutung", "volumen", "nachblut", "schock", "infekt"] },
          { t: "Zurückhaltendes Verhalten und Klingel als Risiko benannt", kw: ["klingel", "zurückhalt", "melde"] },
          { t: "Überprüfbares Ziel (z. B. Veränderungen werden erkannt, sie klingelt)", kw: ["ziel", "erkannt", "klingelt"] },
          { t: "Vitalzeichen mit Trend/NEWS2, Drainage und Wunde", kw: ["news", "vital", "drainage", "wunde", "verlauf"] },
          { t: "Kompressionsstrümpfe / Thromboseprophylaxe", kw: ["strumpf", "strümpf", "thrombo", "kompression"] },
          { t: "Metamizol-Unverträglichkeit berücksichtigt", kw: ["metamizol", "novalgin"] }
        ]
      },
      C: {
        diag: "Angst (00146) b/d bevorstehender Narkose und Erfahrung des Vaters, a/d Aussage „Schiss vor der Narkose“, schnellem Sprechen. Dazu: Wissensdefizit (00126) zu Nüchternheit, Medikation und OP-Vorbereitung, a/d geplanter Pizza und Kaffee mit Milch.",
        ziel: "Herr Wendt nennt nach dem Gespräch in eigenen Worten (Teach-back), bis wann er essen und was er trinken darf, welche Tablette morgen früh entfällt und was er ablegt. Er benennt, was ihm gegen die Angst hilft.",
        mass: [
          "Beratung zu Nüchternheit nach Hausstandard: feste Nahrung bis 6 Stunden, klare Flüssigkeit bis 2 Stunden vor der Narkose",
          "Medikamente am OP-Morgen nur nach Anordnung der Anästhesie; BZ-Messung am OP-Morgen",
          "OP-Vorbereitung erklären: Schmuck, Kontaktlinsen, Körperpflege, OP-Hemd, Prämedikation",
          "Ängste ernst nehmen, Fragen an die Anästhesie sammeln, Entspannung anbieten",
          "Teach-back am Ende; schriftliches Infoblatt mitgeben"
        ],
        chk: [
          { t: "Angst als Pflegediagnose mit Ursache", kw: ["angst"] },
          { t: "Wissensdefizit / Beratungsbedarf", kw: ["wissen", "beratung", "information"] },
          { t: "Ziel mit Teach-back oder eigenen Worten", kw: ["teach", "eigenen worten", "benennt", "nennt"] },
          { t: "Nüchternzeiten korrekt (6 h fest, 2 h klar)", kw: ["6 stunden", "6 h", "2 stunden", "2 h", "klare"] },
          { t: "Metformin/BZ am OP-Tag", kw: ["metformin", "bz", "blutzucker"] },
          { t: "Schmuck/Ring/Kontaktlinsen", kw: ["ring", "schmuck", "kontaktlinse"] }
        ]
      }
    },
    nacht: [
      ["A", "Herr Petersen: Stoma-Ausfuhr in der Nacht 850 ml, sehr flüssig. Er hat zweimal geklingelt, weil der Beutel undicht war, ich hab's abgeklebt. Trinkmenge Nacht nur 200 ml. Urin seit 22 Uhr 150 ml, dunkel."],
      ["B", "Frau Hollweg: Puls ist von 88 um 22 Uhr auf 104 um 04 Uhr gestiegen, RR 112/70. Sie sagt, alles gut. Drainage um 04 Uhr 120 ml, eher blutig. Ich hab 2 l Sauerstoff gegeben, weil die Sättigung bei 93 % war. Arzt noch nicht informiert, sie wirkte ja stabil."],
      ["C", "Herr Wendt: hat schlecht geschlafen, war um 02 Uhr am Stützpunkt und wollte wissen, ob er morgen wirklich sterben kann. BZ um 22 Uhr 168 mg/dl. OP morgen 08 Uhr, Aufklärung Anästhesie heute 11 Uhr."]
    ],
    sbar: {
      A: {
        muster: {
          S: "Herr Petersen, 58, Zimmer 305, Tag 6 nach Rektumresektion mit Ileostoma. Hohe, dünnflüssige Ausfuhr (Nacht 850 ml) bei nur 200 ml Trinkmenge, Urin 150 ml dunkel. Beutel nachts zweimal undicht.",
          B: "Raucht weiter, lehnt das Stoma ab, Ehefrau soll übernehmen, ekelt sich aber. Juckreiz und Brennen unter der Platte.",
          A: "Drohende Dehydratation durch High-Output und peristomale Hautschädigung durch Unterwanderung. Abkleben ist keine Lösung, die Platte muss neu angepasst werden.",
          R: "Bilanz auswerten und Arzt wegen Ausfuhr informieren, Trinkplan, Versorgung vor dem Frühstück neu mit Hautschutz und angepasster Öffnung, dabei Herrn Petersen einbeziehen."
        },
        chk: [
          { t: "S: Ausfuhr, Trinkmenge, Urinmenge benannt", kw: ["850", "ausfuhr", "urin", "200"] },
          { t: "B: Ablehnung des Stomas / Rauchen", kw: ["ablehn", "rauch", "nicht an"] },
          { t: "A: Dehydratation und Hautschädigung", kw: ["dehydr", "flüssigkeit", "haut"] },
          { t: "R: Arzt informieren, Bilanz, Versorgung neu", kw: ["arzt", "bilanz", "versorgung", "wechsel"] },
          { t: "Abkleben als ungeeignete Lösung erkannt", kw: ["abkleb", "undicht", "leckage", "unterwander"] }
        ]
      },
      B: {
        muster: {
          S: "Frau Hollweg, 71, Zimmer 306, Tag 1 nach laparoskopischer Sigmaresektion. Puls steigt seit 22 Uhr von 88 auf 104, Drainage 120 ml blutig, Sauerstoffbedarf neu.",
          B: "Rezidivierende Divertikulitis, Hypothyreose, Hypertonie, Enoxaparin um 08 Uhr. Unverträglichkeit Metamizol. Sie bagatellisiert und klingelt kaum.",
          A: "Der Trend spricht für eine beginnende Kreislaufverschlechterung, am ehesten eine Nachblutung. Dass sie „stabil wirkt“, schließt das nicht aus.",
          R: "Als Erstes zu ihr: Vitalzeichen mit NEWS2, Drainage, Wunde, Haut. Arzt sofort informieren. Enoxaparin um 08 Uhr erst nach ärztlicher Rücksprache."
        },
        chk: [
          { t: "S: Pulsanstieg, blutige Drainage, neuer Sauerstoffbedarf", kw: ["104", "puls", "drainage", "sauerstoff"] },
          { t: "B: Antikoagulation, Metamizol-Unverträglichkeit", kw: ["enoxaparin", "metamizol"] },
          { t: "A: Verdacht auf Nachblutung / Volumenmangel", kw: ["nachblut", "blutung", "volumen", "schock"] },
          { t: "R: zuerst zu ihr, NEWS2, Arzt sofort", kw: ["zuerst", "news", "arzt"] },
          { t: "Enoxaparin vor Gabe mit Arzt klären", kw: ["enoxaparin", "rücksprache", "nicht geben"] }
        ]
      },
      C: {
        muster: {
          S: "Herr Wendt, 44, Zimmer 307, morgen 08 Uhr laparoskopische Cholezystektomie. Hat nachts aus Angst vor der Narkose den Stützpunkt aufgesucht.",
          B: "Diabetes Typ 2 mit Metformin, Gallenkoliken nach fettem Essen, Vater hatte eine schwere Narkose-Erfahrung.",
          A: "Ausgeprägte Angst und Wissenslücken: plant Pizza heute Abend und Milchkaffee morgen früh. Ring geht nicht ab, Kontaktlinsen.",
          R: "Nach der Anästhesie-Aufklärung um 11 Uhr ein Beratungsgespräch mit Teach-back; Fragen an die Anästhesie weitergeben."
        },
        chk: [
          { t: "S: OP morgen, Angst", kw: ["angst", "morgen", "op"] },
          { t: "B: Diabetes/Metformin", kw: ["diabet", "metformin"] },
          { t: "A: Wissenslücken zu Nüchternheit", kw: ["nüchtern", "pizza", "milch", "kaffee"] },
          { t: "R: Beratungsgespräch mit Teach-back", kw: ["beratung", "teach", "gespräch"] },
          { t: "Ring / Kontaktlinsen erwähnt", kw: ["ring", "kontaktlinse"] }
        ]
      }
    },
    prio: [
      { id: "h1", t: "Frau Hollweg: Vitalzeichen mit NEWS2, Drainage und Wunde kontrollieren (Trend aus der Nacht)", zeit: "06:15", warum: "Steigender Puls, blutige Drainage und neuer Sauerstoffbedarf: Das ist die potenziell lebensbedrohliche Situation." },
      { id: "p1", t: "Herr Petersen: Ein-/Ausfuhrbilanz der Nacht auswerten, Arzt informieren, Trinkplan", zeit: "06:40", warum: "Drohende Dehydratation. Die Bilanz muss vor der Visite beim Arzt sein." },
      { id: "bz", t: "BZ-Messung bei Herrn Wendt vor dem Frühstück", zeit: "07:00", warum: "Zeitgebunden an die Mahlzeit." },
      { id: "p2", t: "Herr Petersen: Stomaversorgung vor dem Frühstück wechseln, mit Anleitung", zeit: "07:15", warum: "Vor dem Essen ist das Ileostoma weniger aktiv; die undichte, abgeklebte Versorgung schädigt die Haut weiter." },
      { id: "md", t: "Medikamente 08 Uhr prüfen und verteilen", zeit: "07:45", warum: "Fester Zeitpunkt, R-Regeln für jedes Arzneimittel; Enoxaparin bei Frau Hollweg vorher klären." },
      { id: "fr", t: "Frühstück, Unterstützung, Trinkmengen erfassen", zeit: "08:15", warum: "Teil der Bilanz bei Herrn Petersen." },
      { id: "vi", t: "Visite 09:30 vorbereiten: Bilanz, Drainage, Hautbefund, Fragen zu Herrn Wendts OP-Vorbereitung", zeit: "09:15", warum: "Wer gut vorbereitet in die Visite geht, steuert den Pflegeprozess." },
      { id: "mo", t: "Frau Hollweg: Mobilisation an die Bettkante nach Anordnung und Kreislaufkontrolle", zeit: "10:30", warum: "Frühmobilisation nur, wenn der Kreislauf stabil ist." },
      { id: "be", t: "Herr Wendt: Beratungsgespräch nach der Anästhesie-Aufklärung", zeit: "11:30", warum: "Nach der Aufklärung kennst du die Anordnungen der Anästhesie und kannst gezielt beraten." },
      { id: "do", t: "Dokumentation vervollständigen, Übergabe an den Spätdienst vorbereiten", zeit: "13:00", warum: "Dokumentiert wird fortlaufend; hier wird ergänzt und strukturiert." }
    ],
    live: [
      {
        k: "stoma", typ: "steps", pat: "A", t: "Herr Petersen · Stomaversorgung", kurzname: "Stomaversorgung Schritt für Schritt", clock: "07:15", max: 16,
        titel: "Wechsel einer zweiteiligen Ileostomaversorgung mit Anleitung",
        icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
        banner: { name: "Ralf Petersen", sub: "58 J. · Zimmer 305 · Ileostoma rechts, Tag 6", chips: [["Ausfuhr Nacht 850 ml", "red"], ["Beutel nachts undicht", ""], ["schaut nicht hin", ""]] },
        intro: "07:15 Uhr, vor dem Frühstück. Die Versorgung ist seit der Nacht mit Pflaster abgeklebt und unterwandert. Herr Petersen sagt: „Machen Sie mal, ich guck an die Decke.“ Du wechselst die zweiteilige Versorgung (Basisplatte und Ausstreifbeutel) und beziehst ihn ein.",
        ko: ["Reinigung mit Alkohol, Benzin oder Desinfektionsmittel auf der Stomaschleimhaut", "Öffnung der Basisplatte kleiner als das Stoma (Abschnürung) oder ohne Ausmessen zugeschnitten", "Livide oder schwarze Stomaschleimhaut nicht sofort ärztlich melden", "Versorgung über geschädigter Haut einfach abkleben statt neu anzupassen"],
        merke: "Das Stoma wird ausgemessen, nicht geschätzt. Wasser reicht zur Reinigung. Und jeder Wechsel ist auch eine Lerneinheit für den Menschen mit Stoma.",
        steps: [
          { t: "Zeitpunkt und Vorbereitung", ph: "vor", img: "mat", q: "Wann und womit bereitest du den Wechsel vor?", opts: [
            { t: "Vor dem Frühstück, wenn das Ileostoma weniger aktiv ist; Material vollständig richten: Basisplatte, Ausstreifbeutel, Messschablone, Schere, Hautschutzring, warmes Wasser, Kompressen, Haftentferner, Abwurfbeutel", ok: true, fb: "Richtig. Ein Ileostoma fördert nach Mahlzeiten mehr. Vollständiges Material verhindert, dass du mit offenem Stoma etwas holen musst." },
            { t: "Direkt nach dem Frühstück, dann ist er satt und entspannt", fb: "Nach dem Essen ist die Ausscheidung am stärksten, die Haut wird beim Wechsel sofort wieder nass." },
            { t: "Nur einen neuen Beutel holen, die Platte hält ja noch mit dem Pflaster", ko: true, fb: "Kritisch: Eine unterwanderte Platte schädigt die Haut weiter. Abkleben verdeckt das Problem und ist keine Versorgung." }
          ] },
          { t: "Information und Einbeziehung", ph: "vor", img: "edu", q: "Herr Petersen will an die Decke schauen. Wie gehst du vor?", opts: [
            { t: "Ich erkläre jeden Schritt, akzeptiere heute das Wegschauen, biete aber einen Spiegel an und frage, welchen kleinen Schritt er selbst übernehmen möchte", ok: true, fb: "Richtig. Edukation in kleinen, selbst gewählten Schritten respektiert sein Tempo und baut Selbstwirksamkeit auf." },
            { t: "Ich bestehe darauf, dass er heute alles selbst macht, sonst lernt er es nie", fb: "Zwang verstärkt die Abwehr. Akzeptanz braucht Zeit und Wahlmöglichkeiten." },
            { t: "Ich rufe die Ehefrau an, damit sie zuschaut und es lernt", fb: "Ohne sein Einverständnis nicht. Und die Ehefrau hat Ekel geäußert; das braucht ein eigenes Gespräch." }
          ] },
          { t: "Intimsphäre und Hygiene", ph: "vor", img: "mat", q: "Bevor du die Versorgung berührst:", opts: [
            { t: "Tür schließen, Sichtschutz, Bett auf Arbeitshöhe, Unterlage einlegen, hygienische Händedesinfektion, unsterile Handschuhe", ok: true, fb: "Richtig. Stomaversorgung ist eine saubere, keine sterile Tätigkeit." },
            { t: "Sterile Handschuhe und steriles Abdecktuch, wie bei einer Wunde", fb: "Nicht nötig: Der Darm ist nicht steril. Saubere Arbeitsweise mit Handschuhen reicht." },
            { t: "Ohne Handschuhe, damit er sich nicht ekelt", fb: "Personalschutz geht vor. Handschuhe sind Standard beim Umgang mit Ausscheidungen." }
          ] },
          { t: "Beutel entleeren", ph: "durch", img: "bag", imgDone: "leer", q: "Der Beutel ist zu einem Drittel gefüllt. Was zuerst?", opts: [
            { t: "Beutel über der Toilette oder einem Gefäß ausstreifen und den Inhalt nach Menge und Aussehen beurteilen", ok: true, fb: "Richtig. Die Menge gehört in die Bilanz, das Aussehen in den Bericht." },
            { t: "Den vollen Beutel samt Platte abziehen, das geht schneller", fb: "So läuft der Inhalt über Haut, Bett und Wunde." },
            { t: "Beutel abschneiden und in den Müll", fb: "Kontaminationsgefahr und keine Mengenerfassung." }
          ] },
          { t: "Basisplatte lösen", ph: "durch", img: "ab", q: "Wie entfernst du die Basisplatte?", opts: [
            { t: "Mit Haftentferner von oben nach unten lösen, die Haut dabei mit der anderen Hand gegenhalten", ok: true, fb: "Richtig. Von oben nach unten, damit nachlaufende Ausscheidung in die Platte fließt; Gegenhalten schont die vorgeschädigte Haut." },
            { t: "Mit einem Ruck abziehen, das tut am wenigsten weh", fb: "Ein Ruck reißt die obersten Hautschichten ab, besonders bei schon gereizter Haut (MARSI)." },
            { t: "Von unten nach oben abziehen", fb: "Dann läuft Ausscheidung auf die freigelegte Haut." }
          ] },
          { t: "Reinigen", ph: "durch", img: "clean", q: "Womit reinigst du Stoma und Haut?", opts: [
            { t: "Mit warmem Wasser und weichen Kompressen, kreisend von außen zum Stoma hin; Haut gut trocken tupfen", ok: true, fb: "Richtig. Wasser reicht. Keine Seifen mit Rückfettung, keine Öle: Sonst haftet die Platte nicht." },
            { t: "Mit einem alkoholischen Hautdesinfektionsmittel, damit es keimarm ist", ko: true, fb: "Kritisch: Alkohol brennt auf der Schleimhaut, trocknet die Haut aus und schädigt sie. Stomaversorgung ist nicht steril." },
            { t: "Mit einer pflegenden Körperlotion, damit die Haut geschmeidig bleibt", fb: "Rückfettende Produkte verhindern, dass die neue Platte haftet. Folge: erneute Unterwanderung." }
          ] },
          { t: "Ereignis beim Reinigen", ph: "durch", img: "clean", q: "Beim Abtupfen blutet die Stomaschleimhaut punktförmig. Was tust du?", opts: [
            { t: "Leichtes Kontaktbluten ist bei der gut durchbluteten Schleimhaut normal: sanft mit feuchter Kompresse andrücken, beobachten, dokumentieren", ok: true, fb: "Richtig. Anders wäre es bei anhaltender Blutung oder Blut aus dem Darminneren: dann Arzt." },
            { t: "Sofort den Notruf auslösen", fb: "Überreaktion. Punktförmiges Kontaktbluten ist häufig und harmlos." },
            { t: "Die Stelle mit einem Antiseptikum desinfizieren", fb: "Unnötig und reizend für die Schleimhaut." }
          ] },
          { t: "Stoma und Haut beurteilen", ph: "durch", img: "rot", q: "Die Schleimhaut ist rosig-rot und feucht. Um das Stoma herum ist die Haut zwischen 4 und 7 Uhr gerötet, nässend und juckt. Deine Einschätzung?", opts: [
            { t: "Gesunde Stomaschleimhaut; peristomale Hautschädigung durch Ausscheidung unter der Platte (Unterwanderung). Ursache beheben: Öffnung exakt anpassen, Hautschutzring, Befund dokumentieren und Stomatherapie informieren", ok: true, fb: "Richtig. Die Rötung liegt genau dort, wo die Ausscheidung unter die Platte läuft. Pflege behandelt die Ursache, nicht nur die Haut." },
            { t: "Livide Schleimhaut: Arzt sofort informieren", fb: "Livide oder schwarze Schleimhaut wäre ein Notfall (Durchblutungsstörung). Rosig-rot ist normal." },
            { t: "Kortisoncreme auf die gerötete Haut auftragen", fb: "Nur nach ärztlicher Anordnung. Cremes verhindern außerdem die Haftung der Platte." }
          ] },
          { t: "Ausmessen", ph: "durch", img: "mess", q: "Wie bestimmst du die Größe der Öffnung?", opts: [
            { t: "Stoma mit der Messschablone an der Basis ausmessen (hier 32 mm) und die Öffnung 1–2 mm größer wählen", ok: true, fb: "Richtig. In den ersten Wochen schwillt das Stoma ab, deshalb wird bei jedem Wechsel neu gemessen." },
            { t: "Die Öffnung genau so groß schneiden wie das Stoma, damit nichts unter die Platte läuft", ko: true, fb: "Kritisch: Eine zu enge Öffnung schnürt das Stoma ein und gefährdet die Durchblutung der Schleimhaut." },
            { t: "Großzügig 5–10 mm größer schneiden, damit es sicher nicht drückt", fb: "Dann liegt freie Haut in der Öffnung und wird von dünnflüssiger Ausscheidung angegriffen. Genau das ist hier passiert." }
          ] },
          { t: "Zuschneiden", ph: "durch", img: "cut", q: "Du schneidest die Basisplatte zu. Worauf achtest du?", opts: [
            { t: "Mit der gebogenen Schere auf 34 mm zuschneiden, Kanten glätten, Schutzfolie erst kurz vor dem Aufkleben abziehen; Platte mit der Hand anwärmen", ok: true, fb: "Richtig. Glatte Kanten verhindern Druckstellen an der Schleimhaut, Wärme verbessert die Haftung." },
            { t: "Vorgestanzte Platte mit 40 mm nehmen, die passt schon", fb: "Passt nicht: 8 mm freie Haut rund um das Stoma." },
            { t: "Zuschneiden, während die Platte schon am Bauch klebt", fb: "Verletzungsgefahr für Stoma und Haut." }
          ] },
          { t: "Hautschutz und Aufkleben", ph: "durch", img: "platte", q: "Wie bringst du die neue Basisplatte auf?", opts: [
            { t: "Haut trocken, Hautschutzring um das Stoma modellieren, Platte von unten nach oben anlegen und 1–2 Minuten mit der warmen Hand andrücken; Herr Petersen liegt dabei flach", ok: true, fb: "Richtig. Der Ring gleicht Unebenheiten aus, Wärme und Druck aktivieren den Hydrokolloid-Kleber." },
            { t: "Platte über die noch feuchte Haut kleben, das spart Zeit", fb: "Auf feuchter Haut haftet keine Platte. Die nächste Unterwanderung ist vorprogrammiert." },
            { t: "Zusätzlich ringsum mit Fixierpflaster abkleben", fb: "Unnötig bei korrekter Anpassung und belastet die Haut zusätzlich." }
          ] },
          { t: "Beutel aufsetzen", ph: "durch", img: "platte", imgDone: "fertig", q: "Und der Beutel?", opts: [
            { t: "Ausstreifbeutel auf den Rastring setzen, bis er hörbar einrastet, Sitz durch leichten Zug prüfen, Auslass verschließen; Ausrichtung zur Seite, solange er überwiegend liegt", ok: true, fb: "Richtig. Ein Ausstreifbeutel ist bei dünnflüssiger Ileostoma-Ausscheidung Standard." },
            { t: "Einen geschlossenen Beutel nehmen, der wird dann einfach dreimal am Tag gewechselt", fb: "Bei 1.300 ml dünnflüssiger Ausfuhr ungeeignet: zu viele Wechsel und Überlaufgefahr." },
            { t: "Den Auslass offen lassen und in eine Flasche ableiten", fb: "Nicht vorgesehen, Leckagegefahr." }
          ] },
          { t: "Nachbereitung", ph: "nach", img: "fertig", q: "Nach dem Wechsel:", opts: [
            { t: "Material im Abwurfbeutel entsorgen, Handschuhe aus, Händedesinfektion, lüften, Herrn Petersen bequem lagern und fragen, wie es für ihn war", ok: true, fb: "Richtig. Die Frage nach dem Erleben öffnet das Gespräch über Geruch und Ekel." },
            { t: "Raumspray großzügig versprühen, damit es nicht mehr riecht", fb: "Das betont den Geruch eher. Lüften und moderne geruchsdichte Beutel helfen mehr." },
            { t: "Sofort gehen, er wollte ja nicht hinschauen", fb: "Damit verpasst du die wichtigste Chance für die Edukation." }
          ] },
          { t: "Edukation", ph: "nach", img: "edu", q: "Herr Petersen fragt: „Kann ich mit dem Ding je wieder Motorrad fahren?“", opts: [
            { t: "„Viele Menschen mit Stoma fahren Motorrad, schwimmen und arbeiten. Wir schauen gemeinsam mit der Stomatherapeutin, welche Versorgung und welcher Schutz für Sie passen. Und Ihr Stoma ist ja als Schutz geplant und wird später zurückverlegt.“", ok: true, fb: "Richtig. Realistische Hoffnung, Hinweis auf die geplante Rückverlegung und Weiterleitung an die Expertin." },
            { t: "„Das müssen Sie den Arzt fragen.“", fb: "Abwimmeln. Lebensalltag mit Stoma ist ein klassisches Pflegethema." },
            { t: "„Darüber sollten Sie sich jetzt keine Gedanken machen.“", fb: "Das übergeht genau das, was ihn motiviert." }
          ] },
          { t: "Dokumentation", ph: "nach", img: "doku", q: "Was dokumentierst du?", opts: [
            { t: "Stomaart und Lage, Farbe und Feuchtigkeit der Schleimhaut, Größe in mm, Hautbefund mit Lokalisation (Uhrzeigerprinzip), Ausfuhr Menge/Konsistenz, verwendetes Material, Beteiligung des Patienten", ok: true, fb: "Richtig. Nur so ist der Verlauf vergleichbar und die Stomatherapie kann gezielt beraten." },
            { t: "„Stoma versorgt, o. B.“", fb: "Nicht nachvollziehbar und sachlich falsch: Die Haut ist nicht ohne Befund." },
            { t: "Nur die Ausfuhrmenge in die Bilanz", fb: "Die Bilanz ist wichtig, ersetzt aber nicht die Beschreibung von Stoma und Haut." }
          ] }
        ],
        art: st
      },
      {
        k: "hzimmer", typ: "hotspot", pat: "B", t: "Frau Hollweg · Bildbefund", kurzname: "Bildbefund Patientenzimmer", clock: "07:40", max: 8,
        titel: "Erster Blick ins Zimmer 306",
        intro: "07:40 Uhr. Frau Hollweg hat nicht geklingelt. Du betrittst das Zimmer für die Vitalzeichenkontrolle. Bevor du misst, nimmst du die Situation mit einem Blick auf.",
        q: "Was fällt dir an Frau Hollweg und an ihrer Umgebung auf?",
        art: hollwegScene(),
        spots: [
          { c: [[72, 112, 22]], t: "Blasses, schweißiges Gesicht", d: "Blässe und kalter Schweiß sind Zeichen einer Zentralisation: Der Körper drosselt die Hautdurchblutung, um Herz und Hirn zu versorgen. Zusammen mit dem Pulsanstieg ein Alarmsignal." },
          { c: [[162, 132, 16]], t: "Verband an der Trokarstelle durchgeblutet", d: "Frisches Blut am Verband. Nicht einfach überkleben: Ausmaß markieren, Uhrzeit notieren, ärztlich beurteilen lassen." },
          { c: [[185, 228, 26]], t: "Drainage fördert hellrotes Blut", d: "Hellrotes, frisches Blut in der Drainage spricht für eine aktive Blutung. Menge mit Uhrzeit messen und sofort melden." },
          { c: [[216, 264, 24]], t: "Urinbeutel liegt auf dem Boden", d: "Bodenkontakt kontaminiert das Ablasssystem. Der Beutel hängt frei unter Blasenniveau. Außerdem: Die geringe Urinmenge ist ein weiteres Schockzeichen." },
          { c: [[302, 134, 16]], t: "Kompressionsstrumpf heruntergerollt", d: "Ein eingerollter Strumpf wirkt wie eine Staubinde und erhöht das Thromboserisiko. Strumpf glatt hochziehen oder ablegen und Alternative klären." },
          { c: [[370, 196, 18]], t: "Klingel außer Reichweite", d: "Gerade eine Patientin, die nicht stören will, braucht die Klingel griffbereit und die ausdrückliche Erlaubnis, sie zu benutzen." }
        ],
        extra: ["Sauerstoffbrille nicht angeschlossen", "Dekubitus an der Ferse", "Hämatom am Venenzugang", "Stuhlverschmutzung im Bett"],
        cap: "Tipp: Schau auf Gesicht, Verband, Drainage, Katheter, Beine und Umgebung.",
        merke: "Der erste Blick ins Zimmer ist ein Assessment. Blässe, Schweiß, frisches Blut und ein stiller Mensch: Das ist eine Nachblutung, bis das Gegenteil bewiesen ist."
      },
      {
        k: "hvit", typ: "vitmed", pat: "B", t: "Frau Hollweg · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Medikamente", clock: "07:45", max: 10, wVit: 0.5,
        titel: "Vitalzeichen erheben und 08-Uhr-Medikamente prüfen",
        intro: "Frau Hollweg sagt leise: „Mir ist so kalt, und irgendwie ist alles weit weg.“ Du misst die Vitalzeichen. Danach stehen die Medikamente für 08 Uhr an.",
        banner: { name: "Ingrid Hollweg", sub: "71 J. · Zimmer 306 · Tag 1 nach Sigmaresektion", chips: [["Unverträglichkeit: Metamizol", "red"], ["2 l O₂ seit 04 Uhr", ""], ["Enoxaparin 08 Uhr", ""]] },
        uhr: "07:46",
        vit: {
          auftrag: "Tippe auf jedes Messgerät. Bei manchen wirst du vorher gefragt, wie du richtig misst.",
          items: [
            { k: "rr", t: "Blutdruck", kurz: "NIBP", val: "94/56", einheit: "mmHg", farbe: "rr", wie: "Manschette", q: { text: "Frau Hollweg ist sehr schlank, der Arm misst 22 cm. Welche Manschette?", opts: [
              { t: "Kleine Erwachsenenmanschette passend zum Armumfang", ok: true, fb: "Richtig. Eine zu große Manschette misst zu niedrige Werte, eine zu kleine zu hohe." },
              { t: "Die Standardmanschette, die am Gerät hängt", fb: "Bei 22 cm Armumfang ist die Standardmanschette meist zu groß: falsch niedrige Werte." },
              { t: "Egal, Hauptsache am Oberarm", fb: "Die Manschettenbreite entscheidet über die Genauigkeit." }] } },
            { k: "puls", t: "Puls", kurz: "HF", val: "118", einheit: "/min", farbe: "puls", wie: "tasten" },
            { k: "af", t: "Atemfrequenz", kurz: "AF", val: "22", einheit: "/min", farbe: "af", wie: "zählen", q: { text: "Wie zählst du die Atemfrequenz am zuverlässigsten?", opts: [
              { t: "Eine volle Minute unbemerkt zählen, zum Beispiel während ich scheinbar weiter den Puls taste", ok: true, fb: "Richtig. Wer weiß, dass seine Atmung gezählt wird, atmet anders." },
              { t: "15 Sekunden zählen und mal vier rechnen", fb: "Zu ungenau, die Atemfrequenz ist der empfindlichste Frühwarnparameter." },
              { t: "Frau Hollweg bitten, normal zu atmen, und dann zählen", fb: "Dann atmet sie bewusst und eben nicht normal." }] } },
            { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "95", einheit: "% unter 2 l O₂", farbe: "spo2", wie: "Clip" },
            { k: "temp", t: "Temperatur", kurz: "Temp", val: "36,4", einheit: "°C", farbe: "temp", wie: "Ohr" },
            { k: "bew", t: "Bewusstsein", kurz: "ACVPU", val: "A", einheit: "wach, orientiert", farbe: "bew", wie: "ansprechen" }
          ],
          befund: "Haut kalt, blass und feucht, Rekapillarisierungszeit 4 Sekunden. Drainage seit 04 Uhr weitere 230 ml hellrot. Urin seit 04 Uhr 40 ml.",
          news: { wert: 9, tol: 0, frage: "Berechne den NEWS2-Score (Skala 1 für SpO₂).", erk: "AF 22 = 2 · SpO₂ 95 % = 1 · Sauerstoff = 2 · RR syst. 94 = 2 · Puls 118 = 2 · wach = 0 · Temp 36,4 = 0. Summe 9: hohes Risiko, sofortige ärztliche Notfallbeurteilung." },
          act: { text: "NEWS2 9, frisches Blut in der Drainage, Schockzeichen. Was tust du jetzt?", opts: [
            { t: "Bei ihr bleiben, über Notruf Hilfe holen und das Notfallteam bzw. den Arzt sofort per SBAR alarmieren; flach lagern, Sauerstoff nach Standard weiter, Werte engmaschig, Drainage messen", ok: true, fb: "Richtig. NEWS2 ab 7 bedeutet Notfallteam. Du bleibst bei ihr und holst Hilfe in den Raum." },
            { t: "Arzt informieren und in einer Stunde nachmessen", fb: "Zu langsam. Bei NEWS2 9 ist sofortige Notfallbeurteilung nötig, nicht eine Kontrolle in einer Stunde." },
            { t: "Erst die 08-Uhr-Medikamente verteilen, dann den Arzt anrufen", fb: "Gefährlich. Die akute Kreislaufverschlechterung hat absoluten Vorrang." },
            { t: "Oberkörper hoch und mobilisieren, damit der Kreislauf in Schwung kommt", fb: "Bei Schockzeichen verschlechtert Aufsetzen die Hirndurchblutung. Flach lagern." }] }
        },
        med: {
          zeit: "08:00", allergie: "Metamizol (Agranulozytose)",
          hinweis: "08:05 Uhr, Dr. Neumann am Bett: „Verdacht auf Nachblutung. Sie bleibt ab sofort nüchtern für eine mögliche Re-Laparoskopie. Enoxaparin und Ramipril pausieren. Levothyroxin und Pantoprazol mit einem Schluck Wasser geben, ist mit der Anästhesie abgesprochen. Gegen die Schmerzen gebe ich ihr selbst etwas i.v.“ Die Anordnung steht schriftlich in der Kurve.",
          plan: [
            { n: "Levothyroxin", d: "75 µg", z: "1-0-0", h: "mit Schluck Wasser, AO 08:05" },
            { n: "Pantoprazol", d: "40 mg", z: "1-0-0", h: "mit Schluck Wasser, AO 08:05" },
            { n: "Ramipril", d: "5 mg", z: "1-0-0", h: "pausiert ab 08:05", aus: true },
            { n: "Enoxaparin", d: "40 mg s.c.", z: "08 Uhr", h: "pausiert ab 08:05", aus: true },
            { n: "Paracetamol", d: "1 g i.v.", z: "1-1-1-1", h: "Kurzinfusion" },
            { n: "Metamizol", d: "–", z: "–", h: "UNVERTRÄGLICHKEIT", aus: true }
          ],
          disp: [
            { n: "Levothyroxin 75 µg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "ok", fb: "Ausdrücklich angeordnet, mit einem Schluck Wasser. Nüchtern heißt nicht automatisch: keine Medikamente." },
            { n: "Pantoprazol 40 mg", sub: "1 Tablette, magensaftresistent", pill: { c: "#fde68a", s: "oval" }, r: "ok", fb: "Angeordnet. Nicht teilen oder mörsern, magensaftresistent." },
            { n: "Ramipril 5 mg", sub: "1 Tablette", pill: { c: "#fecaca", s: "oval" }, r: "pause", fb: "Pausiert. Bei RR 94/56 und möglichem Volumenmangel ohnehin gefährlich." },
            { n: "Novaminsulfon 500 mg", sub: "1 Tablette, „gegen Schmerzen“", pill: { c: "#e9d5ff", s: "round" }, r: "allergie", fb: "Novaminsulfon ist Metamizol: anderer Name, gleicher Wirkstoff. Bei Agranulozytose in der Vorgeschichte lebensgefährlich. Entfernen und melden." },
            { n: "Enoxaparin 40 mg", sub: "Fertigspritze s.c.", pill: { c: "#bfdbfe", s: "spritze" }, r: "pause", fb: "Pausiert wegen Nachblutung. Eine Antikoagulation würde die Blutung verstärken." }
          ]
        },
        final: { text: "Wie dokumentierst du die Medikamente, die du nicht gegeben hast?", opts: [
          { t: "In der Kurve als „nicht gegeben“ mit Grund (pausiert lt. AO Dr. Neumann 08:05 / Unverträglichkeit, Verwechslung entfernt) und Handzeichen; die Verwechslung mit Novaminsulfon zusätzlich melden", ok: true, fb: "Richtig. Lücken in der Kurve sind nicht nachvollziehbar. Die Verwechslung ist ein Fall fürs Fehlermeldesystem." },
          { t: "Gar nicht, sie wurden ja nicht gegeben", fb: "Dann weiß niemand, ob sie vergessen oder bewusst weggelassen wurden." },
          { t: "Ich hake sie ab, damit die Kurve vollständig aussieht", fb: "Das wäre eine falsche Dokumentation." }] },
        merke: "Erst der Mensch, dann der Dispenser: Bei Schockzeichen alarmierst du sofort. Und Wirkstoffnamen schlagen Handelsnamen: Novaminsulfon ist Metamizol."
      },
      {
        k: "nuechtern", typ: "beratung", pat: "C", t: "Herr Wendt · Beratung Nüchternheit", kurzname: "Beratung zur Nüchternheit", clock: "11:30", max: 6,
        titel: "Was darf ich vor der Gallen-OP?",
        banner: { name: "Tobias Wendt", sub: "44 J. · Zimmer 307 · OP morgen 08:00 Uhr", chips: [["Diabetes Typ 2 · Metformin", ""], ["ängstlich", ""]] },
        intro: "11:30 Uhr. Herr Wendt kommt aus der Anästhesie-Aufklärung. Laut Anästhesiebogen: nüchtern nach Hausstandard (6 Stunden feste Nahrung, 2 Stunden klare Flüssigkeit), Metformin morgen früh pausieren, Ramipril morgen früh pausieren, Prämedikation 07:00 Uhr. Er hat einen Zettel voller Fragen.",
        person: { name: "Herr Wendt" },
        qs: [
          { q: "„Bis wann darf ich heute eigentlich noch essen? Ich wollte mir heute Abend noch eine Pizza bestellen, so als Henkersmahlzeit.“", re: "„Okay, dann eher Suppe. Henkersmahlzeit war eh ein blöder Witz.“", opts: [
            { t: "„Eine leichte Mahlzeit ist bis 6 Stunden vor der Narkose erlaubt, bei Ihnen also bis 2 Uhr nachts. Ich rate Ihnen heute Abend zu etwas Leichtem: Fettes Essen löst bei Ihnen ja gerade die Koliken aus.“", ok: true, fb: "Richtig. Konkrete Uhrzeit aus der Regel abgeleitet und mit seiner Erkrankung verknüpft." },
            { t: "„Ab jetzt nichts mehr, sicher ist sicher.“", fb: "Unnötig lange Nüchternheit erhöht Durst, Unwohlsein und bei Diabetes das Hypoglykämierisiko." },
            { t: "„Pizza ist okay, solange Sie vor Mitternacht fertig sind.“", fb: "Formal möglich, aber fachlich schlecht: Fettreiches Essen kann eine Gallenkolik auslösen." }
          ] },
          { q: "„Und morgen früh? Ohne meinen Kaffee mit Milch bin ich kein Mensch.“", re: "„Schwarz. Na gut. Das überleb ich.“", opts: [
            { t: "„Klare Flüssigkeiten dürfen Sie bis 2 Stunden vorher trinken: Wasser, Tee, auch schwarzen Kaffee ohne Milch und Zucker. Milch zählt als Nahrung.“", ok: true, fb: "Richtig. Milch und Milchprodukte sind keine klaren Flüssigkeiten." },
            { t: "„Kaffee mit Milch geht bis 2 Stunden vorher, das ist ja flüssig.“", fb: "Falsch. Milch verlängert die Magenentleerung wie eine Mahlzeit." },
            { t: "„Morgen früh dürfen Sie gar nichts mehr trinken.“", fb: "Zu streng und nicht leitliniengerecht. Klare Flüssigkeit bis 2 Stunden vorher ist erlaubt und angenehmer." }
          ] },
          { q: "„Meine Diabetes-Tablette und die Blutdrucktablette nehme ich morgen früh dann ganz normal, oder?“", re: "„Gut, dass ich gefragt hab. Ich hätte die einfach genommen.“", opts: [
            { t: "„Nein, beide bleiben morgen früh weg, so hat es die Narkoseärztin festgelegt. Wir messen morgens Ihren Blutzucker. Andere Tabletten nehmen Sie nur, wenn wir sie Ihnen bringen.“", ok: true, fb: "Richtig. Die Anordnung der Anästhesie gilt, und der Blutzucker wird kontrolliert." },
            { t: "„Ja, mit einem kleinen Schluck Wasser ist alles erlaubt.“", fb: "Falsch: Metformin und Ramipril sind morgen früh pausiert." },
            { t: "„Nehmen Sie die Hälfte, dann ist es nicht so viel.“", fb: "Eigenmächtige Dosisänderung. Pflege berät auf Grundlage der Anordnung." }
          ] },
          { q: "„Darf ich mir morgen früh die Zähne putzen? Das Internet sagt nein.“", re: "„Das Internet ist echt nicht mein Freund.“", opts: [
            { t: "„Ja, Zähneputzen ist erlaubt. Spülen Sie danach gut aus und schlucken Sie das Wasser nicht bewusst hinunter.“", ok: true, fb: "Richtig. Mundhygiene ist erwünscht, es gelangt dabei keine relevante Menge in den Magen." },
            { t: "„Nein, das bricht die Nüchternheit.“", fb: "Falsch. Ungepflegter Mund ist eher ein Risiko (Keime, Mundgeruch, Wohlbefinden)." },
            { t: "„Nur mit Mundwasser, nicht mit Zahnpasta.“", fb: "Keine fachliche Grundlage." }
          ] },
          { q: "„Und was ist, wenn ich nachts aus Versehen doch was esse? Ich bin nachts manchmal am Kühlschrank.“", re: "„Ehrlich gesagt beruhigt mich das. Dann muss ich nicht lügen.“", opts: [
            { t: "„Dann sagen Sie es bitte sofort und ehrlich. Die Narkoseärztin entscheidet dann, ob die OP verschoben wird. Mit vollem Magen kann bei der Narkose Mageninhalt in die Lunge gelangen, das ist gefährlich.“", ok: true, fb: "Richtig. Ehrlichkeit wird ausdrücklich erlaubt und begründet." },
            { t: "„Dann behalten Sie es lieber für sich, sonst wird die OP abgesagt.“", fb: "Gefährlich: Aspirationsgefahr wird verschwiegen." },
            { t: "„Das darf auf keinen Fall passieren, sonst operieren wir Sie nie wieder.“", fb: "Drohung statt Beratung, verstärkt die Angst." }
          ] },
          { q: "„Meinen Ehering krieg ich nicht ab. Und muss ich die Kontaktlinsen raus nehmen?“", re: "„Okay. Dann probier ich heute Abend mal das mit der Seife.“", opts: [
            { t: "„Kontaktlinsen bitte vorher herausnehmen und Schmuck ablegen. Beim Ring versuchen wir es mit Seife und Hochhalten der Hand. Klappt es nicht, wird er nach Hausstandard abgeklebt und das wird in der OP-Checkliste vermerkt.“", ok: true, fb: "Richtig. Kontaktlinsen können die Hornhaut schädigen, Metall kann Druckstellen und Verbrennungen durch Elektrochirurgie verursachen." },
            { t: "„Der Ring kann dranbleiben, ist ja nur Gold.“", fb: "Auch Gold leitet Strom und kann bei Schwellung abschnüren. Ohne Absprache nicht." },
            { t: "„Kontaktlinsen können drin bleiben, Sie schlafen ja nur.“", fb: "Falsch. Unter Narkose fehlt der Lidschlag, die Hornhaut kann austrocknen und verletzt werden." }
          ] }
        ],
        merke: "Gute Beratung ist konkret (Uhrzeiten), begründet (warum) und überprüft (Teach-back). Und sie erlaubt Ehrlichkeit."
      }
    ],
    st: {
      clock: "10:10", titel: "Erbrechen in Zimmer 308",
      situation: "10:10 Uhr. Aus Zimmer 308 ruft ein Mitpatient laut um Hilfe: Herr Albrecht (66, Tag 2 nach Hemikolektomie, Patient deiner Kollegin) hat im Liegen schwallartig erbrochen, hustet und röchelt. SpO₂ am Fingerclip 89 %. Gleichzeitig klingelt das Telefon: Der OP will Frau Hollweg in 15 Minuten zur Re-Laparoskopie abholen. Am Stützpunkt wartet die Ehefrau von Herrn Wendt und möchte wissen, „wie es so aussieht“ mit ihrem Mann und ob Zimmer 306 „auch so ein Notfall“ ist.",
      order: [
        { id: "a", t: "Zu Herrn Albrecht: Oberkörper hoch bzw. Seitenlage, Mund frei machen, Erbrochenes entfernen, Notruf auslösen", warum: "Aspirationsgefahr: Die Atemwege haben absoluten Vorrang." },
        { id: "b", t: "Arzt sofort informieren: Erbrechen mit Verdacht auf Aspiration, SpO₂ 89 %", warum: "Ärztliche Beurteilung (z. B. Magensonde, Röntgen) nötig." },
        { id: "c", t: "Vitalzeichen, Sauerstoff nach Notfallstandard, Absaugung bereitlegen, bei ihm bleiben, bis Hilfe da ist", warum: "Überwachen und sichern, bis Arzt und Kollegin übernehmen." },
        { id: "d", t: "OP-Vorbereitung Frau Hollweg an Praxisanleitung oder Kollegin übergeben bzw. gemeinsam mit OP-Checkliste abschließen", warum: "Zeitkritisch, aber delegierbar. Du kannst nicht an zwei Orten sein." },
        { id: "e", t: "Frau Wendt freundlich informieren, dass gleich jemand Zeit hat; keine Auskünfte über andere Patienten", warum: "Schweigepflicht: Über Zimmer 306 gibt es keine Auskunft, über ihren Mann nur mit seinem Einverständnis." },
        { id: "f", t: "Ereignis bei Herrn Albrecht dokumentieren und an die zuständige Kollegin übergeben", warum: "Nach der Akutversorgung lückenlos dokumentieren." }
      ],
      mc: { text: "Frau Hollweg wird gleich abgeholt. Was gehört zur OP-Vorbereitung durch die Pflege? (Mehrfachauswahl)", opts: [
        { t: "Identität und Patientenarmband prüfen, Nüchternheit seit 08:05 Uhr dokumentieren", ok: true, fb: "Teil der OP-Checkliste." },
        { t: "Unverträglichkeit Metamizol und die Verwechslung von heute früh auf der Checkliste vermerken", ok: true, fb: "Allergien und Unverträglichkeiten gehören prominent auf die Checkliste." },
        { t: "Schmuck, Zahnprothese und Brille entfernen bzw. dokumentieren, OP-Hemd", ok: true, fb: "Standard der OP-Vorbereitung." },
        { t: "Aktuelle Vitalzeichen, Drainagemenge und letzte Medikamentengaben mitgeben", ok: true, fb: "Übergabe an das OP-Team." },
        { t: "Die Einwilligung zur Re-OP selbst von Frau Hollweg unterschreiben lassen", ok: false, fb: "Die Aufklärung und Einwilligung ist ärztliche Aufgabe." },
        { t: "Ihr noch einen Tee gegen das Frieren geben", ok: false, fb: "Sie ist nüchtern. Gegen Kälte helfen Decken und Wärme." }
      ] },
      merke: "Atemwege vor allem anderen. Was delegierbar ist, wird delegiert. Und am Stützpunkt gilt die Schweigepflicht auch im Stress."
    },
    doku: {
      clock: "12:00",
      auftrag: "Schreibe den Pflegebericht zu Frau Hollweg für den Zeitraum 07:40 bis 08:30 Uhr. Ergänzend: Dr. Neumann war um 07:52 Uhr am Bett, Notfallteam ab 07:50 Uhr. Hb 7,9 g/dl. 08:30 Uhr Abholung in den OP.",
      muster: "07:40 Pat. im Bett, blass, kaltschweißig. Äußert: „Mir ist so kalt, und irgendwie ist alles weit weg.“ Verband Trokarstelle li. durchgeblutet (ca. 3 × 2 cm, Rand markiert). Drainage seit 04:00 weitere 230 ml hellrot. Urin seit 04:00 40 ml. Urinbeutel vom Boden aufgehängt. RR 94/56 mmHg, HF 118/min, AF 22/min, SpO₂ 95 % unter 2 l O₂, T 36,4 °C, wach, orientiert. NEWS2 9. 07:48 Notruf, flache Lagerung, Sauerstoff weiter nach Standard. 07:50 Notfallteam, 07:52 Dr. Neumann am Bett (SBAR). AO: nüchtern, Enoxaparin und Ramipril pausiert. 08:05 Levothyroxin und Pantoprazol mit Schluck Wasser lt. AO gegeben. Novaminsulfon im Dispenser (Unverträglichkeit Metamizol) entfernt, nicht gegeben, Meldung CIRS. 08:30 Übergabe an OP-Team mit Checkliste. [Name, Handzeichen]",
      chk: [
        { t: "Uhrzeiten für Beobachtung, Notruf, Arzt, Maßnahmen", kw: ["07:", "08:"] },
        { t: "Objektive Werte mit Einheit inkl. NEWS2", kw: ["mmhg", "/min", "news"] },
        { t: "Drainage und Urin mit Menge und Aussehen", kw: ["drainage", "ml", "urin"] },
        { t: "Patientenaussage wörtlich", kw: ["„", "\"", "äußert"] },
        { t: "Arzt und Notfallteam mit Name/Uhrzeit, Anordnung", kw: ["dr.", "neumann", "notfallteam", "ao", "anordnung"] },
        { t: "Nicht gegebene Medikamente und Verwechslung", kw: ["nicht gegeben", "novaminsulfon", "pausiert", "cirs"] },
        { t: "Übergabe an OP, Name/Handzeichen", kw: ["op", "handzeichen", "hz"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge im Bericht einer Kollegin sind NICHT rechtssicher?",
        items: [
          { t: "07:40 Pat. blass, kaltschweißig, RR 94/56 mmHg, HF 118/min, AF 22/min, SpO₂ 95 % unter 2 l O₂.", bad: false, fb: "In Ordnung: konkret und messbar." },
          { t: "Pat. wirkte etwas komisch, aber eigentlich stabil.", bad: true, fb: "Unbestimmt und widersprüchlich. Was heißt „komisch“? Beobachtungen beschreiben." },
          { t: "Drainage blutig.", bad: true, fb: "Ohne Menge, Zeitraum und Farbe nicht verwertbar." },
          { t: "07:52 Dr. Neumann am Bett, AO: nüchtern, Enoxaparin pausiert.", bad: false, fb: "In Ordnung." },
          { t: "Novalgin weggelassen, war eh falsch.", bad: true, fb: "Umgangssprachlich und ohne Grund. Richtig: „Novaminsulfon (Metamizol) nicht gegeben, Unverträglichkeit, entfernt, CIRS-Meldung.“" },
          { t: "Pat. äußert: „Mir ist so kalt.“", bad: false, fb: "In Ordnung: wörtliches Zitat." },
          { t: "Verband überklebt, damit es sauber aussieht.", bad: true, fb: "Überkleben verschleiert den Verlauf. Durchgeblutete Verbände werden markiert und ärztlich beurteilt." },
          { t: "Nachtrag 09:10 zu 08:30: Übergabe an OP mit Checkliste. M. K.", bad: false, fb: "In Ordnung: korrekt gekennzeichneter Nachtrag." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst (Pflegefachkraft Lea Brandt).",
      muster: "Herr Petersen, 305: Ileostoma Tag 6, High-Output (Nacht 850 ml), Urin wenig und dunkel. Arzt informiert, Loperamid 2 mg 3× tgl. angeordnet, Trinkplan 2.000 ml mit Brühe und Elektrolytgetränk. Versorgung 07:15 neu: Ø 32 mm, Öffnung 34 mm, Hautschutzring; peristomale Rötung 4–7 Uhr, Stomatherapie kommt morgen. Er hat heute erstmals in den Spiegel geschaut und den Beutel selbst ausgestreift. Bitte Bilanz weiterführen.\n\nFrau Hollweg, 306: Nachblutung, Re-Laparoskopie 08:45 Uhr, zurück seit 12:40 Uhr. Blutung an einem Trokargefäß gestillt, 2 Erythrozytenkonzentrate im OP. Aktuell RR 118/70 mmHg, HF 92/min, NEWS2 2. Drainage seit Rückkehr 20 ml serös. Unverträglichkeit Metamizol: Heute früh war Novaminsulfon im Dispenser, entfernt, CIRS gemeldet. Enoxaparin bis auf Weiteres pausiert, Arzt entscheidet heute Abend. Klingel liegt in ihrer Hand, sie soll bei Frieren oder Schwindel klingeln.\n\nHerr Wendt, 307: OP morgen 08 Uhr. Beraten mit Teach-back: feste Nahrung bis 02 Uhr, klare Flüssigkeit bis 06 Uhr, Metformin und Ramipril morgen früh pausiert, BZ morgens messen. Ring: heute Abend mit Seife versuchen. Er ist ängstlich, Fragen an die Anästhesie sind weitergegeben.",
      chk: [
        { t: "Alle Patienten mit Kernproblem und aktuellem Zustand", kw: ["305", "306", "307", "petersen", "hollweg", "wendt"] },
        { t: "Offene Aufgaben (Bilanz, Enoxaparin-Entscheidung, Nüchternheit)", kw: ["bilanz", "enoxaparin", "nüchtern", "bitte"] },
        { t: "Sicherheitsrelevantes (Unverträglichkeit, NEWS2, Ausfuhr)", kw: ["metamizol", "news", "ausfuhr", "unverträglich"] }
      ]
    },
    refl: [
      { q: "Der Nachtdienst hielt Frau Hollweg für „stabil“. Woran hast du erkannt, dass sie es nicht war, und was hat dir NEWS2 dabei gebracht?", muster: "Einzelwerte wirkten in der Nacht noch grenzwertig, der Trend nicht: Puls 88 → 104 → 118, neuer Sauerstoffbedarf, blutige Drainage. Dazu klinische Zeichen: Blässe, kalter Schweiß, Frieren, wenig Urin, verlängerte Rekapillarisierung. NEWS2 fasst die Werte zusammen und gibt eine klare Handlungsschwelle vor (ab 7 Notfallteam). Das schützt auch vor dem Satz „sie wirkt ja stabil“. Eine Patientin, die nicht klagt, beobachte ich besonders genau." },
      { q: "Warum hast du bei Herrn Petersen die Öffnung der Basisplatte neu ausgemessen, und wie hast du ihn einbezogen?", muster: "Ein frisches Stoma schwillt in den ersten Wochen ab. Die alte Öffnung war zu groß, dünnflüssige Ausscheidung lief auf die Haut, daher Rötung, Juckreiz und Undichtigkeit. Gemessen 32 mm, Öffnung 34 mm, Hautschutzring. Einbezogen habe ich ihn, ohne ihn zu zwingen: Er durfte wegschauen, bekam einen Spiegel angeboten und hat das Ausstreifen selbst übernommen. Sein Ziel Motorradfahren war der Türöffner. Nächstes Mal würde ich die Stomatherapie früher einbinden." },
      { q: "Wie hast du sichergestellt, dass Herr Wendt die Beratung zur Nüchternheit wirklich verstanden hat?", muster: "Ich habe konkret beraten: Uhrzeiten statt „ab Mitternacht“, Beispiele für klare Flüssigkeiten, die Begründung (Aspirationsgefahr, Gallenkolik). Am Ende habe ich ihn gebeten, mir in eigenen Worten zu sagen, bis wann er isst, was er morgens trinkt und welche Tabletten wegbleiben (Teach-back). Ich habe ihm ausdrücklich erlaubt, ehrlich zu sein, wenn er doch etwas isst, und ihm ein Infoblatt mitgegeben." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
