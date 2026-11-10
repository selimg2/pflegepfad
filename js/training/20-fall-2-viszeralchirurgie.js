/* ===== Fall 2 (Viszeralchirurgie): Figuren, Bildbefund, Stoma-Simulation ===== */
(function () {
  var X = window.PXB, C = (window.PEX_CASES || []).filter(function (c) { return c.id === "viszeral"; })[0];
  if (!X || !C) return;
  var P = C.pat;
  P.A.av = { hair: "RO", hairC: "#7a7066", skin: "#f0c7a5", cloth: "#9cc3e6", deco: "gown", bg: "#e6f6f3", mustache: 1, beardC: "#6b625a" };
  P.B.av = { hair: "IA", hairC: "#e2e3e6", skin: "#f6d2b3", cloth: "#f2b8c6", deco: "gown", dot: "#d47a93", bg: "#fde8e8", wrinkles: 1, glasses: 1 };
  P.C.av = { hair: "JW", hairC: "#6b4a2f", skin: "#e3ab84", cloth: "#f5a35b", deco: "shirt", bg: "#fff1d6", stubble: true };
  C.people = {
    anleitung: { name: "Mehmet Kaya", av: { hair: "KA", hairC: "#2b2b33", skin: "#c98d64", cloth: "#0e7490", deco: "badge", bg: "#d9f2ee", beard: 1, beardC: "#2b2b33" } },
    pruefer: { name: "Frau Lindner", av: { hair: "SE", hairC: "#cfcfd3", skin: "#f6d2b3", cloth: "#6d5a8a", deco: "collar", bg: "#efe7fb", glasses: 1 } },
    nacht: { name: "Katrin Wolff", role: "Nachtdienst", av: { hair: "BR", hairC: "#7a5233", skin: "#f6d2b3", cloth: "#2f4f7a", deco: "scrubs", bg: "#e6edf5" } }
  };

  /* ---------- Bildbefund Frau Hollweg ---------- */
  var hol = Object.assign({}, P.B.av, { pale: 1, sweat: 1 });
  var spotsHead = [0, 0];
  function hollScene() {
    return X.bedScene(hol, {
      mood: "tired", legs: "flat", blanket: "#f6e3ea",
      ns: X.glass(22, 170, 0.8) + X.tissue(46, 170),
      post: function (pt) {
        spotsHead = [pt.hx, pt.hy];
        var s = "";
        /* Verband an der Trokarstelle, durchgeblutet */
        s += X.r(pt.belly[0] - 26, pt.belly[1] - 32, 26, 18, 3, "#ffffff", 1.8) + X.e(pt.belly[0] - 12, pt.belly[1] - 23, 8, 5.5, "#dc2626", 0) + X.e(pt.belly[0] - 14, pt.belly[1] - 24, 3.5, 2.5, "#f87171", 0);
        /* Drainage mit hellrotem Blut am Bett */
        s += X.tube("M" + (pt.belly[0] + 8) + " " + (pt.belly[1] + 10) + "C" + (pt.belly[0] + 16) + " 230 186 214 190 226", "#fecaca", 3);
        s += X.drainBag(196, 252, "#ef4444", 0.6) + X.r(186, 218, 20, 4, 2, "#94a3b8", 0);
        /* Urinbeutel auf dem Boden */
        s += X.tube("M232 206C236 236 236 250 246 262", "#fef9c3", 3) + X.g(X.urineBag(0, 0, "#fde68a", 0.25), "translate(262,262) rotate(-80)");
        /* Bein mit eingerolltem Kompressionsstrumpf am Fußende */
        s += X.p("M300 170q14-2 34 2l8 18q-20 6-40 0z", "#f6d2b3", 2) + X.p("M300 170q14-2 34 2l2 6q-18 -2-36 0z", "#f1f5f9", 0) + X.r(298, 168, 12, 22, 6, "#e7e1d6", 2) + X.l(304, 170, 304, 188, "#c7bba6", 1.6);
        /* Klingel hängt weit weg am Wandpanel */
        s += X.cable(318, 104, 330, 132, "#64748b") + X.bell(330, 146);
        return s;
      }
    });
  }
  var hz = C.live.filter(function (l) { return l.k === "hzimmer"; })[0];
  if (hz) {
    hz.art = hollScene();
    hz.banner = { name: "Ingrid Hollweg", sub: "71 J. · Zimmer 306 · Sigmaresektion, Tag 1", chips: [["Puls nachts 88 → 104", "red"], ["Allergie: Metamizol", "red"]] };
    var pt = X._pt;
    hz.spots = [
      { c: [[Math.round(spotsHead[0]), Math.round(spotsHead[1]), 24]], t: "Blasses, schweißiges Gesicht", d: "Blässe und kalter Schweiß sind Zeichen einer Zentralisation: Der Körper drosselt die Hautdurchblutung, um Herz und Hirn zu versorgen. Zusammen mit dem Pulsanstieg ein Alarmsignal." },
      { c: [[Math.round(pt.belly[0] - 13), Math.round(pt.belly[1] - 23), 16]], t: "Verband an der Trokarstelle durchgeblutet", d: "Frisches Blut am Verband. Nicht einfach überkleben: Ausmaß markieren, Uhrzeit notieren, ärztlich beurteilen lassen." },
      { c: [[196, 238, 22]], t: "Drainage fördert hellrotes Blut", d: "Hellrotes, frisches Blut in der Drainage spricht für eine aktive Blutung. Menge mit Uhrzeit messen und sofort melden." },
      { c: [[256, 258, 22]], t: "Urinbeutel liegt auf dem Boden", d: "Bodenkontakt kontaminiert das Ablasssystem. Der Beutel hängt frei unter Blasenniveau. Außerdem: Die geringe Urinmenge ist ein weiteres Schockzeichen." },
      { c: [[306, 180, 16]], t: "Kompressionsstrumpf heruntergerollt", d: "Ein eingerollter Strumpf wirkt wie eine Staubinde und erhöht das Thromboserisiko. Strumpf glatt hochziehen oder ablegen und Alternative klären." },
      { c: [[330, 140, 16]], t: "Klingel außer Reichweite", d: "Gerade eine Patientin, die nicht stören will, braucht die Klingel griffbereit und die ausdrückliche Erlaubnis, sie zu benutzen." }
    ];
    hz.mood = "tired";
  }

  /* ---------- Stomaversorgung Herr Petersen ---------- */
  var pet = P.A.av;
  var SX = 150, SY = 160;
  function torso(o) {
    o = o || {};
    var s = X.blank("#dde9f4");
    for (var i = 0; i < 8; i++) s += X.l(0, 18 + i * 36, 400, 18 + i * 36, "#d2e1ef", 1.2);
    /* Bauch von oben */
    s += X.p("M40 300C30 200 40 70 80 20H330C370 70 380 200 370 300Z", "#f0c7a5", 2.2);
    s += X.p("M80 20C120 46 290 46 330 20", "none", 0, ' stroke="#d9a483" stroke-width="2"');
    s += X.c(214, 170, 4, "#c98f6b", 1.4);
    /* Laparotomienaht mit Folie */
    s += X.r(204, 52, 20, 92, 5, "#e0f2fe", 1.6, ' opacity=".9"') + X.l(214, 58, 214, 138, "#b4473f", 2.2);
    for (var j = 0; j < 6; j++) s += X.l(209, 64 + j * 13, 219, 64 + j * 13, "#94a3b8", 1.4);
    /* Hemd oben */
    s += X.p("M60 0H350V34C300 52 110 52 60 34Z", "#9cc3e6", 2.2);
    if (o.red) s += X.p("M" + (SX - 34) + " " + (SY + 10) + "A36 36 0 0 0 " + (SX + 10) + " " + (SY + 34) + "L" + SX + " " + SY + "Z", "#f87171", 0, ' opacity=".55"');
    if (o.stoma !== false) s += X.e(SX, SY, 19, 17, "#e25c5c", 2) + X.e(SX - 5, SY - 5, 7, 5, "#f59e9e", 0) + X.p("M" + (SX - 4) + " " + (SY + 3) + "a4 3 0 1 0 8 0", "none", 0, ' stroke="#9f2b2b" stroke-width="1.6"');
    return s;
  }
  function plate(x, y, hole, an) { return '<g class="' + (an || "") + '">' + X.c(x, y, 46, "#f5e6c8", 2) + X.c(x, y, 34, "#fbf3e2", 1.4) + X.c(x, y, hole || 0.1, "#f0c7a5", 1.6) + "</g>"; }
  function pouch(x, y, fill, an) {
    var s = '<g class="' + (an || "") + '">' + X.p("M" + (x - 40) + " " + (y - 36) + "h80v92a30 30 0 0 1-30 30h-20a30 30 0 0 1-30-30z", "#f3f6fa", 2);
    if (fill) s += X.p("M" + (x - 38) + " " + (y + 30) + "h76v26a28 28 0 0 1-28 28h-20a28 28 0 0 1-28-28z", "#c08a3e", 0, ' opacity=".85"');
    s += X.c(x, y, 26, "#e7eef6", 2) + X.r(x - 18, y + 82, 36, 12, 5, "#94a3b8", 1.8) + "</g>";
    return s;
  }
  function stomaScene(i) {
    if (i === 0) return X.blank() + '<g transform="translate(200,130)">' + X.c(0, 0, 70, "#ffffff", 2.4) + X.l(0, 0, 0, -48, "#1d1d1f", 4) + X.l(0, 0, 34, 16, "#1d1d1f", 4) + X.c(0, 0, 5, "#1d1d1f", 0) + "</g>" + X.tag(200, 238, "07:15 · vor dem Frühstück ist das Ileostoma ruhiger", "");
    if (i === 1) return X.blank() + X.tray(24, 40, 352, 180) + X.c(84, 92, 34, "#f5e6c8", 2) + X.c(84, 92, 12, "#fbf3e2", 1.4) + X.t(84, 140, "Basisplatte", { s: 9 }) + X.p("M140 62h56v66a18 18 0 0 1-18 18h-20a18 18 0 0 1-18-18z", "#f3f6fa", 2) + X.t(168, 160, "Ausstreifbeutel", { s: 9 }) + X.r(214, 60, 72, 50, 6, "#ffffff", 1.8) + X.c(232, 78, 6, "none", 1.4) + X.c(250, 78, 9, "none", 1.4) + X.c(270, 78, 12, "none", 1.4) + X.t(250, 124, "Schablone", { s: 9 }) + X.g(X.p("M0 0l34 34M34 0L0 34", "none", 0, ' stroke="#64748b" stroke-width="3"') + X.c(-4, -4, 6, "#ffffff", 1.6) + X.c(38, -4, 6, "#ffffff", 1.6), "translate(306,66)") + X.t(324, 124, "Schere", { s: 9 }) + X.e(76, 186, 32, 13, "#bae6fd", 2) + X.t(76, 210, "warmes Wasser", { s: 9 }) + X.gauze(130, 172, 40, 26) + X.c(212, 186, 16, "#f5e6c8", 1.8) + X.c(212, 186, 7, "#fbf3e2", 1.2) + X.t(212, 212, "Hautschutzring", { s: 9 }) + X.r(262, 166, 22, 36, 6, "#e9d5ff", 1.8) + X.t(274, 212, "Haftentferner", { s: 9 }) + X.r(316, 166, 44, 36, 4, "#cbd5e1", 1.8) + X.t(338, 212, "Abwurf", { s: 9 }) + X.tag(200, 254, "kein Alkohol · keine rückfettende Pflege", "warn");
    if (i === 2) return X.bedScene(pet, { mood: "angry", legs: "flat", blanket: "#cfe0f5", post: function (pt) { return '<g class="pa-in">' + X.r(250, 120, 44, 60, 8, "#e2e8f0", 2) + X.r(255, 125, 34, 50, 5, "#bfdbfe", 0) + X.p("M258 130l12-6M262 150l20-12", "none", 0, ' stroke="#ffffff" stroke-width="2.4"') + "</g>" + X.tag(272, 196, "Spiegel angeboten", ""); } });
    if (i === 3) return X.bedScene(pet, { mood: "neutral", legs: "flat", blanket: "#cfe0f5", screen: 1, screenNew: 1 });
    if (i === 4) return X.blank("#eef6fb") + X.handsRub(true) + X.g(X.glove(0, 0, -20, "#bfdbfe"), "translate(70,190)") + X.g(X.glove(0, 0, 20, "#bfdbfe"), "translate(330,190)");
    if (i === 5) return torso() + pouch(SX, SY, true) + X.tag(290, 230, "Beutel zu einem Drittel gefüllt", "");
    if (i === 6) return torso() + pouch(SX, SY, false, "pa-fade") + X.e(SX, 268, 50, 10, "#c08a3e", 0, ' opacity=".5"') + X.tag(290, 230, "ausgestrichen · 350 ml flüssig", "ok");
    if (i === 7) return torso({ red: 1 }) + '<g class="pa-up">' + X.p("M" + (SX - 46) + " " + (SY - 4) + "a46 46 0 0 1 80 -30l-12 12a32 32 0 0 0-56 18z", "#f5e6c8", 2) + "</g>" + X.glove(SX + 70, SY - 60, -30, "#bfdbfe") + X.tag(290, 236, "von oben nach unten · Haut gegenhalten", "");
    if (i === 8) return torso({ red: 1 }) + '<g class="pa-in">' + X.r(SX + 34, SY - 64, 34, 26, 4, "#ffffff", 1.8) + "</g>" + X.arrow("M" + (SX + 50) + " " + (SY - 36) + "q-14 10-22 22") + X.tag(290, 236, "Wasser · außen → innen · trocken tupfen", "");
    if (i === 9) return torso({ red: 1 }) + '<g class="pa-in">' + X.c(SX - 18, SY + 22, 28, "none", 0, ' stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4"') + "</g>" + X.tag(282, 214, "Schleimhaut rosig-rot, feucht", "ok") + X.tag(282, 244, "Haut 4–7 Uhr gerötet, nässend", "bad");
    if (i === 10) return torso({ red: 1 }) + '<g class="pa-down">' + X.r(SX - 60, SY - 44, 120, 88, 8, "#e0f2fe", 1.8, ' opacity=".85"') + X.c(SX, SY, 16, "none", 1.6) + X.c(SX, SY, 21, "none", 0, ' stroke="#16a34a" stroke-width="2.4"') + X.c(SX, SY, 26, "none", 1.6) + "</g>" + X.tag(290, 236, "Ø 32 mm · Öffnung 1–2 mm größer", "ok");
    if (i === 11) return X.blank("#eef3f8") + plate(170, 140, 19) + X.g('<g class="pa-wiggle">' + X.p("M0 0l60 60M60 0L0 60", "none", 0, ' stroke="#64748b" stroke-width="4"') + X.c(-6, -6, 9, "#ffffff", 2) + X.c(66, -6, 9, "#ffffff", 2) + "</g>", "translate(210,70)") + X.tag(170, 240, "Öffnung 34 mm · Kanten glatt", "ok");
    if (i === 12) return torso({ red: 0 }) + X.c(SX, SY, 24, "#f5e6c8", 1.6) + plate(SX, SY, 19, "pa-up") + X.e(SX, SY, 19, 17, "#e25c5c", 2) + X.arrow("M" + (SX - 40) + " " + (SY + 66) + "q40 20 80 0") + X.tag(290, 236, "Ring + Platte von unten anlegen", "");
    if (i === 13) return torso({ red: 0 }) + plate(SX, SY, 19) + pouch(SX, SY, false, "pa-down") + X.tag(290, 236, "eingerastet · Auslass zu", "ok");
    if (i === 14) return torso({ red: 0 }) + pouch(SX, SY, false) + X.trash(330, 120) + X.tag(290, 236, "Abwurf · Hände desinfizieren", "");
    if (i === 15) return X.bedScene(pet, { mood: "smile", legs: "flat", blanket: "#cfe0f5" });
    return X.blank() + X.clipboard(70, 26, 260, 230, "Stomaprotokoll 07:35", ["Ileostoma re., rosig-rot, Ø 32 mm", "Schleimhaut intakt, prominent 1 cm", "Haut: Rötung nässend 4–7 Uhr", "Ausfuhr Nacht 850 ml, flüssig", "Ring + Platte 34 mm", "Pat. hat Spiegel genutzt · HZ"], { mark: 2 }) + X.check(312, 236);
  }
  var stoma = C.live.filter(function (l) { return l.k === "stoma"; })[0];
  if (stoma) {
    Object.assign(stoma, {
      ic: "plate", mood: "angry", kurz: "Stomaversorgung",
      intro: "07:15 Uhr, vor dem Frühstück. Die Versorgung ist seit der Nacht mit Pflaster abgeklebt und unterwandert. Herr Petersen sagt: „Machen Sie mal, ich guck an die Decke.“ Du wechselst die zweiteilige Versorgung und beziehst ihn ein.",
      steps: [
        { t: "Zeitpunkt: vor dem Frühstück wechseln", ic: "clock", ph: "vor", fb: "Ein Ileostoma fördert nach Mahlzeiten mehr. Vor dem Frühstück bleibt die Haut beim Wechsel eher trocken." },
        { t: "Material vollständig richten", ic: "tray", ph: "vor", fb: "Basisplatte, Ausstreifbeutel, Schablone, gebogene Schere, Hautschutzring, warmes Wasser, Kompressen, Haftentferner, Abwurf. So musst du nicht mit offenem Stoma etwas holen." },
        { t: "Ablauf erklären, Spiegel anbieten", ic: "talk", ph: "vor", fb: "Du akzeptierst sein Wegschauen und bietest trotzdem eine Wahl an. Kleine, selbst gewählte Schritte bauen Selbstwirksamkeit auf.", say: "Stellen Sie den Spiegel mal hin. Vielleicht guck ich. Vielleicht." },
        { t: "Sichtschutz, Bett auf Arbeitshöhe", ic: "screen", ph: "vor", fb: "Intimsphäre schützen und rückenschonend arbeiten." },
        { t: "Hände desinfizieren, Handschuhe anziehen", ic: "glove", ph: "vor", fb: "Stomaversorgung ist sauber, nicht steril: unsterile Handschuhe reichen." },
        { t: "Beutel entleeren, Inhalt beurteilen", ic: "pouch", ph: "durch", fb: "Menge in die Bilanz, Aussehen in den Bericht. Erst entleeren, dann wechseln." },
        { t: "Basisplatte von oben nach unten lösen", ic: "plate", ph: "durch", fb: "Mit Haftentferner, die Haut mit der anderen Hand gegenhalten. So läuft nachfließende Ausscheidung in die Platte." },
        { t: "Mit warmem Wasser reinigen, trocken tupfen", ic: "water", ph: "durch", fb: "Wasser und weiche Kompressen reichen, von außen zum Stoma hin. Trockene Haut ist Voraussetzung für die Haftung." },
        { t: "Stoma und Haut beurteilen", ic: "eye", ph: "durch", fb: "Schleimhaut rosig-rot und feucht: gesund. Rötung 4 bis 7 Uhr: Schaden durch Unterwanderung. Ursache beheben und Stomatherapie informieren." },
        { t: "Stoma mit Schablone ausmessen", ic: "measure", ph: "durch", fb: "32 mm an der Basis. In den ersten Wochen schwillt das Stoma ab, deshalb bei jedem Wechsel neu messen." },
        { t: "Platte auf 34 mm zuschneiden", ic: "scissors", ph: "durch", fb: "1 bis 2 mm größer als das Stoma, mit gebogener Schere, Kanten glatt." },
        { t: "Hautschutzring, Platte von unten anlegen", ic: "plate", ph: "durch", fb: "Der Ring gleicht Unebenheiten aus. Von unten nach oben anlegen und 1 bis 2 Minuten mit der warmen Hand andrücken." },
        { t: "Beutel aufsetzen, Sitz prüfen", ic: "pouch", ph: "durch", fb: "Hörbar eingerastet, mit leichtem Zug geprüft, Auslass verschlossen." },
        { t: "Entsorgen, Hände desinfizieren", ic: "trash", ph: "nach", fb: "Abwurfbeutel verschließen, Handschuhe aus, Händedesinfektion, lüften." },
        { t: "Fragen, wie es für ihn war", ic: "talk", ph: "nach", fb: "Die Frage nach dem Erleben öffnet das Gespräch über Geruch, Ekel und seine Ziele.", say: "Ging schneller als gedacht. Und riechen tut's ja gar nicht so schlimm. Kann ich damit wieder Motorrad fahren?" },
        { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Stomaart und Lage, Schleimhaut, Größe in mm, Hautbefund nach Uhrzeigerprinzip, Ausfuhr, Material, Beteiligung des Patienten." }
      ],
      wrong: [
        { t: "Mit Hautdesinfektionsmittel reinigen", ic: "swab", ko: true, fb: "Kritisch: Alkohol brennt auf der Schleimhaut und schädigt die Haut. Stomaversorgung ist nicht steril." },
        { t: "Öffnung genau auf Stomagröße schneiden", ic: "scissors", ko: true, fb: "Kritisch: Eine zu enge Öffnung schnürt das Stoma ein und gefährdet die Durchblutung." },
        { t: "Undichte Platte mit Pflaster abkleben", ic: "bandage", ko: true, fb: "Kritisch: Abkleben verdeckt das Problem, die Haut wird weiter geschädigt." },
        { t: "Platte mit einem Ruck abziehen", ic: "plate", fb: "Ein Ruck reißt die obersten Hautschichten ab, besonders bei gereizter Haut." },
        { t: "Haut mit Körperlotion eincremen", ic: "gel", fb: "Rückfettende Produkte verhindern, dass die neue Platte haftet." },
        { t: "Vorgestanzte 40-mm-Platte nehmen", ic: "plate", fb: "Dann liegen 8 mm Haut frei und werden von der dünnflüssigen Ausscheidung angegriffen." },
        { t: "Raumspray versprühen", ic: "warm", fb: "Das betont den Geruch eher. Lüften und ein geruchsdichter Beutel helfen mehr." }
      ],
      scene: stomaScene,
      status: function (i) { return ["Zeitpunkt", "Material", "Information", "Intimsphäre", "Hygiene", "Entleeren", "Platte lösen", "Reinigen", "Beurteilen", "Ausmessen", "Zuschneiden", "Anlegen", "Beutel", "Nachbereitung", "Gespräch", "Dokumentation"][i] || ""; },
      statusEnd: "Versorgung dicht, Haut geschützt"
    });
    delete stoma.art;
  }
})();
