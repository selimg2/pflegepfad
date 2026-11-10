/* ===== Fall 1: Akutgeriatrie (aus der ersten Fassung übernommen und erweitert) ===== */
(function () {
  var P = window.PEX, A = window.PXA;
  if (!P || !A) return;

  /* ---------- gemeinsame Szenen ---------- */
  function clipboard(x, y, w, hh, title, lines, mark) {
    var s = A.r(x, y, w, hh, 8, "x-board") + A.r(x + w / 2 - 22, y - 8, 44, 16, 4, "x-metal") + A.r(x + 10, y + 14, w - 20, hh - 24, 4, "x-paper") + A.t(x + 20, y + 34, title, "x-txt x-b", "start");
    lines.forEach(function (l, i) {
      var yy = y + 56 + i * 20;
      if (mark === i) s += A.r(x + 16, yy - 13, w - 32, 19, 4, "x-hl");
      s += A.t(x + 22, yy, l, "x-txt x-s", "start");
    });
    return s;
  }
  function bedPatient(opts) {
    opts = opts || {};
    var s = A.room() + A.r(36, 140, 330, 26, 8, "x-mattress") + A.bedSide(30, 164, 342) + A.r(36, 118, 70, 26, 12, "h-pill");
    s += A.head(78, 116, 17, "x-hair");
    s += A.r(92, 122, 120, 26, 12, "x-shirt");
    if (opts.knees) s += A.p("M206 138l46-34 44 34", "x-legs") + A.p("M206 138l46-34 44 34", "x-legsl");
    else s += A.r(206, 124, 130, 20, 10, "x-legs");
    if (opts.blanket) s += A.p("M200 146c40-12 120-12 160 0v4H200z", "x-blanket");
    if (opts.arm) s += A.r(120, 104, 60, 16, 8, "x-sling") + A.r(110, 100, 70, 10, 5, "h-pill");
    return s;
  }
  var dk = {
    ident: A.table() + clipboard(40, 40, 170, 196, "Kurve · Frau Wiese", ["*12.05.1947 · Zi. 415", "AO 05:45 Dr. Özdemir:", "Transurethraler DK", "Vollsilikon Ch 12, Block 10 ml", "Allergie: keine bekannt"], 4) +
      A.r(240, 70, 130, 40, 20, "x-band") + A.t(305, 95, "Wiese, Hannelore", "x-txt x-s") + A.t(305, 140, "Allergie erfragen!", "x-txt x-b") + A.tag(305, 175, "Latex: Quaddeln", "x-tag x-tagr") + A.p("M210 214c30-10 50-50 70-56", "x-arrow"),
    info: A.room() + A.r(250, 30, 12, 184, 4, "x-metal") + A.p("M262 34c30 10 60 10 90 0v170c-30 10-60 10-90 0z", "x-screen") + bedPatient({ arm: true, blanket: true }) +
      A.head(300, 70, 15, "x-hair") + A.r(285, 86, 30, 60, 12, "x-scrub") + A.tag(140, 60, "Ablauf erklären · Einwilligung", "x-tag") + A.tag(322, 24, "Sichtschutz", "x-tag x-tagg"),
    mat: A.table() + A.tray(26, 40, 348, 150) +
      A.r(44, 58, 140, 38, 6, "x-pack") + A.t(114, 82, "Katheterset steril", "x-txt x-s") +
      A.p("M52 118c40-10 80 10 120 0", "x-cath") + A.t(112, 142, "Vollsilikon Ch 12", "x-txt x-s") +
      A.r(200, 58, 74, 52, 6, "x-pack2") + A.t(237, 80, "sterile", "x-txt x-s") + A.t(237, 94, "Handschuhe", "x-txt x-s") +
      A.syringe(206, 136, 60, "x-aqua", "Aqua dest. 10 ml") +
      A.bottle(300, 54, "x-bottle", "Antiseptikum") +
      A.bag(296, 196, 0) + A.tag(118, 228, "latexfrei", "x-tag x-tagg") + A.tag(230, 228, "geschlossenes System", "x-tag"),
    lager: bedPatient({ knees: true, arm: true }) + A.tag(170, 60, "Rückenlage · Beine angewinkelt", "x-tag") + A.tag(150, 92, "Arm mit Kissen gestützt", "x-tag x-tagg") + A.r(30, 186, 342, 4, 2, "x-pad"),
    hyg: A.room() + A.r(170, 24, 60, 90, 10, "x-disp") + A.r(190, 114, 20, 10, 3, "x-metal") + A.c(200, 60, 12, "x-dispw") +
      A.glove(156, 150, 1.1, "h-skin") + A.g("translate(246 150) scale(-1.1 1.1)", A.p("M10 60V26c0-3 5-3 5 0v18V10c0-3 5-3 5 0v32V6c0-3 5-3 5 0v36V10c0-3 5-3 5 0v38l4-10c2-3 6-1 5 2l-7 22c-2 6-6 10-12 10h-6c-5 0-9-4-9-9z", "h-skin")) +
      A.p("M200 128v14", "x-drop") + A.tag(200, 250, "30 s · alle Flächen benetzen", "x-tag"),
    steril: A.table() + A.drape(30, 30, 340, 170, null) + A.r(56, 52, 120, 70, 8, "x-tray3") + A.swab(76, 78, 5) + A.r(80, 92, 70, 14, 4, "x-iod") + A.t(116, 140, "Tupfer mit Antiseptikum", "x-txt x-s") +
      A.p("M200 70c40-10 80 10 140 0", "x-cath") + A.r(196, 92, 130, 30, 6, "x-pack2") + A.t(260, 112, "Gleitmittel steril", "x-txt x-s") +
      A.glove(200, 136, 0.9, "x-gs") + A.glove(270, 136, 0.9, "x-gs") + A.tag(200, 230, "Non-Touch · nur Außenseiten berühren", "x-tag"),
    kath: A.table() + A.p("M40 120c60-20 120 20 180 0", "x-cath") + A.c(42, 120, 6, "x-balloon") + A.p("M220 120c20 0 40 4 60 10", "x-tube") + A.bag(280, 100, 0) +
      A.p("M150 116l18-30", "x-tube") + A.syringe(140, 66, 46, "x-aqua", "Block 10 ml") + A.tag(120, 170, "vorkonnektiert", "x-tag x-tagg") + A.tag(250, 236, "Rücklaufsperre · Probenentnahmestelle", "x-tag"),
    beutel: bedPatient({ blanket: true, arm: true }) + A.p("M300 150c10 20 4 40 10 58", "x-tube") + A.bag(296, 196, 30) + A.p("M296 196h50", "x-hook") +
      A.tick(370, 214) + A.tag(186, 256, "unter Blasenniveau · kein Bodenkontakt · kein Knick", "x-tag"),
    doku: A.table() + clipboard(70, 26, 260, 220, "Pflegebericht 06:58", ["DK Vollsilikon Ch 12, Ch.-B. 2408-17", "Block 10 ml Aqua dest. lt. Hersteller", "1. Versuch Fehllage Vagina → neuer DK", "Urin 640 ml klar, gelb", "Latexallergie in Akte ergänzt", "Durchführung: Name, HZ"], 2) + A.tick(306, 228)
  };
  var c = P.c;
  var imgs = ["ident", "info", "mat", "mat", "lager", "hyg", "hyg", "steril", "steril", "kath", "steril", "steril", "kath", "kath", "beutel", "beutel", "doku"];
  var phs = ["vor", "vor", "vor", "vor", "vor", "durch", "durch", "durch", "durch", "durch", "durch", "durch", "durch", "durch", "nach", "nach", "nach"];
  c.steps.forEach(function (s, i) { s.img = imgs[i]; s.ph = phs[i]; });
  c.steps[10].cap = "Desinfektion: je Tupfer ein Wisch, Symphyse → Anus";
  c.steps[11].cap = "Kein Urin, kein Druckgefühl: Fehllage?";
  c.art = dk;
  c.titel = "Transurethraler Dauerkatheter bei Frau Wiese";
  c.banner = { name: "Hannelore Wiese", sub: "79 J. · Zimmer 415 · Harnverhalt, Bladder-Scan 640 ml", chips: [["Allergie: Latex (in Akte fehlt)", "red"], ["Diabetes Typ 2", ""], ["Arm li. im Gilchrist", ""]] };
  c.merke = "Asepsis beginnt bei der Allergiefrage. Ein kontaminierter Katheter wird nie weiterverwendet, geblockt wird erst bei Urinfluss.";
  c.icon = "M12 2v6M8 8h8l-1 6H9zM12 14v8";

  var a = P.a; a.titel = "Monitor-EKG bei Herrn Kowalski";
  var b = P.b; b.titel = "Frau Sommer will nicht aufstehen";

  var med = {
    titel: "Medikamente 08 Uhr für Herrn Kowalski",
    intro: "07:45 Uhr. Die Nachtschicht hat die Tabletten gerichtet. Du prüfst den Dispenser von Herrn Kowalski gegen die aktuelle Anordnung, bevor du die Medikamente verteilst. Seit 06:35 Uhr gilt: Bettruhe, Vitalzeichen stündlich, Bisoprolol wie gewohnt.",
    banner: { name: "Werner Kowalski", sub: "82 J. · Zimmer 412 · Pneumonie, neu Vorhofflimmern", chips: [["RR 07:40: 104/62 mmHg", "red"], ["HF 116/min", ""], ["schwerhörig re.", ""]] },
    med: {
      zeit: "08:00", allergie: "keine bekannt",
      hinweis: "Letzte Werte 07:40 Uhr: RR 104/62 mmHg, HF 116/min unregelmäßig, SpO₂ 94 %, T 37,6 °C.",
      plan: [
        { n: "Bisoprolol", d: "2,5 mg", z: "1-0-0", h: "AO 06:35: wie gewohnt geben" },
        { n: "Ramipril", d: "5 mg", z: "1-0-0", h: "halten bei RR syst. < 110 mmHg" },
        { n: "Torasemid", d: "10 mg", z: "1-0-0", h: "pausiert seit Aufnahme", aus: true },
        { n: "Metformin", d: "1000 mg", z: "1-0-1", h: "pausiert", aus: true },
        { n: "Ampicillin/Sulbactam", d: "3 g i.v.", z: "08-16-24", h: "Kurzinfusion" },
        { n: "Insulin normal", d: "nach Schema", z: "zu den Mahlzeiten", h: "BZ vorher" },
        { n: "Enoxaparin", d: "40 mg s.c.", z: "18 Uhr", h: "" }
      ],
      disp: [
        { n: "Bisoprolol 2,5 mg", sub: "1 Tablette", pill: { c: "#fde68a", s: "round" }, r: "ok", fb: "Passt zur Anordnung und wurde um 06:35 Uhr ärztlich bestätigt. Vor der Gabe Puls und RR kennen: Das tust du." },
        { n: "Ramipril 5 mg", sub: "1 Tablette", pill: { c: "#fecaca", s: "oval" }, r: "ki", fb: "Laut Kurve halten bei RR systolisch unter 110 mmHg. Mit 104/62 mmHg bleibt Ramipril heute zurück, und du informierst den Arzt." },
        { n: "Torasemid 10 mg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "pause", fb: "Seit Aufnahme wegen Exsikkose pausiert. Gerichtet ist es trotzdem: ein klassischer Übertragungsfehler aus dem Hausplan." },
        { n: "Digitoxin 0,07 mg", sub: "1 Tablette", pill: { c: "#fbcfe8", s: "round" }, r: "praep", fb: "Steht nicht in Herrn Kowalskis Anordnung. Vermutlich aus dem Dispenser des Zimmernachbarn. Nie „ergänzen“, sondern entfernen und die Verwechslung melden (CIRS)." }
      ],
      fehlt: {
        text: "Welche angeordnete Medikation für 08 Uhr ist NICHT im Dispenser und muss trotzdem bedacht werden? (Mehrfachauswahl)",
        opts: [
          { t: "Ampicillin/Sulbactam 3 g i.v. um 08 Uhr", ok: true, fb: "Die Kurzinfusion bereitest du vor und verabreichst sie gemeinsam mit einer Pflegefachperson; allein darfst du sie im Examen nicht anhängen." },
          { t: "Insulin nach Schema zum Frühstück", ok: true, fb: "Erst BZ messen, dann nach Schema. Das ist kein Dispenser-Medikament." },
          { t: "Enoxaparin 40 mg s.c.", ok: false, fb: "Ist für 18 Uhr angeordnet." },
          { t: "Paracetamol 1 g", ok: false, fb: "Bedarfsmedikation bei Fieber über 38,5 °C. Bei 37,6 °C ist keine Indikation da." }
        ]
      }
    },
    final: {
      text: "Herr Kowalski ist schläfrig, und das rechte Hörgerät war heute Nacht leer. Wie stellst du vor der Gabe die Identität sicher?",
      opts: [
        { t: "Ich wecke ihn, setze das Hörgerät ein, lasse ihn Namen und Geburtsdatum nennen und vergleiche mit Armband und Kurve", ok: true, fb: "Aktive Identifikation mit zwei Merkmalen plus Armband. Das Hörgerät macht die Antwort verlässlich." },
        { t: "Ich frage „Sind Sie Herr Kowalski?“ und warte auf ein Nicken", ok: false, fb: "Geschlossene Frage: Ein schwerhöriger, schläfriger Patient nickt oft einfach." },
        { t: "Zimmer 412, Fensterbett: Das reicht", ok: false, fb: "Zimmer und Bett sind keine Identifikationsmerkmale. Patienten werden verlegt." }
      ]
    },
    merke: "Ein gerichteter Dispenser ist eine Vorarbeit, keine Freigabe. Du prüfst jede Tablette gegen die aktuelle Anordnung und die aktuellen Werte."
  };

  var caseObj = {
    id: "geriatrie", titel: "Drei Menschen nach Stürzen", station: P.station, haus: P.haus, farbe: "#0062FF",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    kurz: "Ein Monitor-Alarm, der als Artefakt abgetan wird, eine Patientin, die nicht mehr aufstehen will, und ein akuter Harnverhalt bei Latexallergie. Dazu ein Sturz im Nachbarzimmer.",
    anleitung: P.anleitung, pruefer: P.pruefer, briefing: P.briefing, pat: P.pat, order: ["A", "B", "C"],
    plan: P.plan, nacht: P.nacht, sbar: P.sbar, prio: P.prio,
    live: [
      Object.assign({ k: "a", typ: "ekg", pat: "A", t: "Herr Kowalski · EKG-Befund", kurzname: "EKG-Befund", clock: "06:12", max: 10 }, a),
      Object.assign({ k: "c", typ: "steps", pat: "C", t: "Frau Wiese · Blasenkatheter", kurzname: "Blasenkatheter Schritt für Schritt", clock: "06:50", max: 14 }, c),
      Object.assign({ k: "am", typ: "vitmed", pat: "A", t: "Herr Kowalski · Medikamente", kurzname: "Medikamentenkontrolle", clock: "07:45", max: 6 }, med),
      Object.assign({ k: "b", typ: "tree", pat: "B", t: "Frau Sommer · Gespräch", kurzname: "Gespräch mit Entscheidungsbaum", clock: "09:20", max: 10 }, b)
    ],
    st: Object.assign({ clock: "10:05", titel: "Notrufklingel Zimmer 416" }, P.st),
    doku: Object.assign({ clock: "11:00" }, P.doku), ueb: P.ueb, refl: P.refl
  };
  caseObj.prio = caseObj.prio.map(function (x) { return x.id === "ab" ? Object.assign({}, x, { t: "Herr Kowalski: Medikamente prüfen und verteilen; Antibiose i.v. 08 Uhr gemeinsam mit einer Pflegefachperson", warum: "Fester Zeitpunkt. Kurzinfusionen hängst du als Auszubildende nur gemeinsam mit einer Pflegefachperson an." }) : x; });
  (window.PEX_CASES = window.PEX_CASES || []).push(caseObj);
})();
