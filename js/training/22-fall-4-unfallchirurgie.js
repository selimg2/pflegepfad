/* ===== Fall 4 (Unfallchirurgie): Figuren, Bildbefund, Verbandwechsel-Simulation ===== */
(function () {
  var X = window.PXB, C = (window.PEX_CASES || []).filter(function (c) { return c.id === "unfall"; })[0];
  if (!X || !C) return;
  var P = C.pat;
  P.A.av = { hair: "UF", hairC: "#d3d5d8", skin: "#f6d2b3", cloth: "#b7cdb8", deco: "gown", dot: "#6f9a72", bg: "#e7f4e4", wrinkles: 1, glasses: 1 };
  P.B.av = { hair: "JW", hairC: "#3a2a22", skin: "#e8b48f", cloth: "#9cc3e6", deco: "gown", bg: "#ddeeff", stubble: true };
  P.C.av = { hair: "SN", hairC: "#a8743f", skin: "#f6d2b3", cloth: "#f2b8c6", deco: "shirt", bg: "#fde8e8", glasses: 1 };
  C.people = {
    anleitung: { name: "Tanja Brückner", av: { hair: "AN", hairC: "#3a2a22", skin: "#f6d2b3", cloth: "#0e7490", deco: "badge", bg: "#d9f2ee" } },
    pruefer: { name: "Herr Demir", av: { hair: "DY", hairC: "#2b2b33", skin: "#d39a6f", cloth: "#475569", deco: "collar", bg: "#e6edf5", beard: 1, beardC: "#2b2b33" } },
    nacht: { name: "Svenja Albrecht", role: "Nachtdienst", av: { hair: "LI", hairC: "#7a5233", skin: "#f6d2b3", cloth: "#2f4f7a", deco: "scrubs", bg: "#e6edf5" } }
  };

  /* ---------- Bildbefund Herr Lange ---------- */
  var lan = P.B.av, sp4 = {};
  function langeScene() {
    return X.bedScene(lan, {
      mood: "worried", legs: "flat", blanket: "#d6e4f4", pose: "semi",
      ns: X.cigs(22, 170) + X.phone(46, 170),
      post: function (pt) {
        var s = "";
        /* Kissenstapel am Fußende, Bein hoch gelagert */
        s += X.r(250, 140, 80, 22, 10, "#ffffff", 2) + X.r(256, 122, 74, 22, 10, "#f8fafc", 2) + X.r(262, 104, 66, 22, 10, "#ffffff", 2);
        var leg = "M200 170C230 150 260 116 300 92L318 100C282 128 250 160 214 184Z";
        s += X.p(leg, "#e8b48f", 2.2);
        /* dorsale Schiene und Binde */
        s += X.p("M214 182C248 158 280 124 316 100L322 108C288 132 256 166 222 190Z", "#e2e8f0", 2);
        s += X.p("M226 162C252 142 276 118 300 100", "none", 0, ' stroke="#f1f5f9" stroke-width="16" stroke-linecap="round"');
        for (var k = 0; k < 6; k++) { var t = k / 5, x = 230 + t * 66, y = 160 - t * 56; s += X.l(x - 6, y - 8, x + 8, y + 8, "#cbd5e1", 2); }
        s += X.l(292, 108, 306, 124, "#b91c1c", 2.6) + X.l(298, 102, 312, 118, "#b91c1c", 2.6);
        /* Fuß mit blass-lividen, geschwollenen Zehen */
        s += X.p("M300 92q18-18 30-12q8 6 2 16l-12 10z", "#c8b8d8", 2) + X.c(328, 82, 4, "#b3a1cc", 1.4) + X.c(322, 76, 3.6, "#b3a1cc", 1.4) + X.c(316, 72, 3.2, "#b3a1cc", 1.4);
        sp4.toes = [322, 82];
        /* Kühlakku direkt auf der Haut */
        s += X.r(232, 140, 30, 18, 4, "#7dd3fc", 2, ' transform="rotate(-38 247 149)"');
        sp4.cool = [247, 149];
        /* gesundes Bein: nackter Fuß ohne Strumpf am Fußende */
        s += X.p("M332 196q14-6 26-2q8 4 4 12q-14 6-30 2z", "#e8b48f", 2);
        /* Handy in der Hand */
        if (X._hand) s += X.phone(X._hand[0] + 4, X._hand[1] - 4);
        return s;
      }
    });
  }
  var lb = C.live.filter(function (l) { return l.k === "langebild"; })[0];
  if (lb) {
    lb.art = langeScene();
    lb.mood = "worried";
    lb.banner = { name: "Mirko Lange", sub: "34 J. · Zimmer 212 · Tag 1 nach Plattenosteosynthese li.", chips: [["Schmerz trotz Opioid", "red"], ["DMS zuletzt 22 Uhr", ""]] };
    var old = lb.spots;
    function sp(t) { return old.filter(function (x) { return x.t.indexOf(t) === 0; })[0] || {}; }
    lb.spots = [
      Object.assign({}, sp("Zehen"), { c: [[sp4.toes[0], sp4.toes[1], 16]] }),
      Object.assign({}, sp("Einschnürende"), { c: [[302, 113, 13]] }),
      Object.assign({}, sp("Kühlakku"), { c: [[sp4.cool[0], sp4.cool[1], 14]] }),
      Object.assign({}, sp("Bein deutlich"), { c: [[300, 152, 20], [272, 136, 14]] }),
      Object.assign({}, sp("Zigaretten"), { c: [[22, 160, 14]] }),
      Object.assign({}, sp("Unverletztes"), { c: [[346, 200, 16]] })
    ];
  }

  /* ---------- Verbandwechsel nach Hüft-TEP ---------- */
  var vog = P.A.av;
  function hip(o) {
    o = o || {};
    var s = X.blank("#dde9f4");
    for (var i = 0; i < 8; i++) s += X.l(0, 18 + i * 36, 400, 18 + i * 36, "#d2e1ef", 1.2);
    s += X.p("M-10 40C40 30 120 40 200 64C280 86 360 100 420 104V250C360 246 280 240 200 236C120 232 40 238 -10 250Z", "#f6d2b3", 2.2);
    s += X.p("M-10 40C10 36 40 34 70 36V250C40 246 10 248 -10 250Z", "#b7cdb8", 2.2);
    s += X.p("M120 200q60-8 120 6", "none", 0, ' stroke="#e3b48f" stroke-width="2"');
    var wound = "M130 132C170 126 220 130 290 144";
    if (o.wound !== false) {
      s += X.p(wound, "none", 0, ' stroke="#b4473f" stroke-width="2.6" stroke-linecap="round"');
      for (var k = 0; k < 9; k++) { var x = 138 + k * 18, y = 131 + k * 1.6 + (k > 5 ? (k - 5) * 1.6 : 0); s += X.r(x - 2, y - 6, 4, 12, 1, "#cbd5e1", 1.2); }
      if (o.sekret) s += X.e(286, 148, 8, 5, "#fde68a", 0, ' opacity=".8"');
    }
    if (o.old) s += '<g class="' + (o.oldOff ? "pa-up" : "") + '">' + X.r(112, 104, 196, 64, 8, "#ffffff", 2) + X.e(270, 146, 22, 12, "#fde68a", 0, ' opacity=".9"') + X.r(112, 104, 196, 64, 8, "none", 0, ' stroke="#cbd5e1" stroke-width="6" stroke-dasharray="2 6"') + "</g>";
    if (o.neu) s += '<g class="' + (o.neuNew ? "pa-down" : "") + '">' + X.r(108, 100, 204, 72, 8, "#f8fafc", 2) + X.r(128, 114, 164, 44, 6, "#ffffff", 1.6) + X.t(210, 140, "Mi 07:58 · TB", { s: 9, w: 750, c: "#334155" }) + "</g>";
    if (o.pillow) s += X.r(60, 236, 300, 40, 18, "#fde68a", 2) + X.t(210, 262, "Abduktionskissen", { s: 10, w: 750 });
    if (o.forceps) s += '<g class="pa-slide">' + X.g(X.p("M0 0L70 -8M0 0L70 6", "none", 0, ' stroke="#64748b" stroke-width="3" stroke-linecap="round"') + X.c(76, -1, 9, "#ffffff", 1.8), "translate(" + (o.fx || 170) + "," + (o.fy || 118) + ") rotate(-20)") + "</g>";
    if (o.arrowsOut) s += X.arrow("M170 132q0-24-20-36") + X.arrow("M240 136q4 26 26 34");
    return s;
  }
  function vwScene(i) {
    if (i === 0) return X.bedScene(vog, { mood: "neutral", legs: "flat", blanket: "#e1efe2", tag: [250, 60, "Analgetikum wirkt seit 10 Minuten", ""] });
    if (i === 1) return X.blank() + '<g class="pa-pop">' + X.r(110, 70, 180, 110, 18, "#fee2e2", 2.2) + X.t(200, 112, "Jodallergie!", { s: 20, w: 800, c: "#b91c1c" }) + X.t(200, 140, "kein PVP-Iod · NaCl 0,9 %", { s: 12, w: 700, c: "#b91c1c" }) + "</g>" + X.tag(200, 220, "Standard · Wundverlauf · Analgesie · Allergien", "");
    if (i === 2) return hip({ old: 1, pillow: 1 }) + X.tag(270, 40, "keine Innenrotation · keine Adduktion", "ok");
    if (i === 3) return X.blank() + X.tray(30, 50, 340, 170) + X.r(60, 76, 130, 54, 6, "#ffffff", 1.8) + X.r(60, 76, 130, 12, 6, "#22c55e", 0) + X.t(125, 112, "Verbandset · 2 Pinzetten", { s: 9.5 }) + X.r(214, 72, 40, 64, 8, "#e0f2fe", 1.8) + X.t(234, 152, "NaCl 0,9 %", { s: 9 }) + X.gauze(276, 84, 70, 44) + X.t(311, 152, "Wundauflage", { s: 9 }) + X.g('<g class="pa-pop">' + X.r(0, 0, 76, 40, 6, "#fee2e2", 1.8) + X.t(38, 18, "PVP-Iod", { s: 9 }) + X.l(6, 34, 70, 6, "#b91c1c", 3) + "</g>", "translate(80,160)") + X.tag(250, 190, "kein Jod", "bad");
    if (i === 4) return X.blank("#eef6fb") + X.handsRub(true) + X.g(X.glove(0, 0, -20, "#bfdbfe"), "translate(70,190)") + X.g(X.glove(0, 0, 20, "#bfdbfe"), "translate(330,190)");
    if (i === 5) return hip({ old: 1, oldOff: 1, pillow: 1 }) + X.glove(330, 70, -40, "#bfdbfe") + X.tag(210, 40, "von außen zur Wunde · Haut gegenhalten", "");
    if (i === 6) return X.blank("#eef6fb") + X.handsRub(true) + X.tag(200, 262, "Handschuhe aus · Hände desinfizieren", "");
    if (i === 7) return hip({ sekret: 1, pillow: 1 }) + X.tag(130, 70, "Ränder adaptiert · keine Rötung", "ok") + X.tag(300, 190, "unterer Pol: wenig klares Sekret", "warn");
    if (i === 8) return X.blank() + X.r(40, 40, 320, 200, 10, "#7fd1bf", 2) + X.r(60, 60, 280, 160, 8, "#a5e3d6", 0) + X.g(X.p("M0 0L80 -8M0 0L80 6", "none", 0, ' stroke="#64748b" stroke-width="3"'), "translate(80,90)") + X.g(X.p("M0 0L80 -8M0 0L80 6", "none", 0, ' stroke="#64748b" stroke-width="3"'), "translate(80,120)") + [0, 1, 2, 3, 4, 5].map(function (j) { return X.gauze(200 + (j % 3) * 40, 80 + Math.floor(j / 3) * 40, 32, 26); }).join("") + X.tag(200, 210, "Non-Touch geöffnet · NaCl auf die Kompressen", "ok");
    if (i === 9) return hip({ sekret: 1, pillow: 1, forceps: 1, fx: 150, fy: 128, arrowsOut: 1 }) + X.tag(210, 40, "innen → außen · jede Kompresse einmal", "ok");
    if (i === 10) return hip({ neu: 1, neuNew: 1, pillow: 1 }) + X.tag(210, 40, "2–3 cm Überstand · beschriftet", "ok");
    if (i === 11) return hip({ neu: 1, pillow: 1 }) + X.trash(360, 200) + X.tag(210, 40, "Pinzetten zur Aufbereitung · Hände desinfizieren", "");
    if (i === 12) return X.bedScene(vog, { mood: "smile", legs: "flat", blanket: "#e1efe2", post: X.r(220, 186, 100, 14, 7, "#fde68a", 1.8) + X.tag(260, 60, "Rückenlage mit Abduktionskissen", "ok") });
    return X.blank() + X.clipboard(60, 26, 280, 230, "Wunddokumentation 08:05", ["Hüfte re. lateral, Naht 16 cm, Klammern", "Ränder adaptiert, keine Rötung > 1 cm", "unterer Pol wenig seröses Sekret", "NaCl 0,9 % (Jodallergie!)", "sterile Wundauflage, nächster VW Fr", "Schmerz NRS 2 · TB"], { mark: 3 }) + X.check(318, 236);
  }
  var vw = C.live.filter(function (l) { return l.k === "vw"; })[0];
  if (vw) {
    Object.assign(vw, {
      ic: "bandage", mood: "neutral", kurz: "Verbandwechsel",
      intro: "07:40 Uhr. Das Analgetikum wirkt seit zehn Minuten, der Verband ist serös durchfeuchtet. Frau Vogt sagt: „Ich war 40 Jahre Hebamme, Kindchen. Ich merk sofort, wenn jemand unsauber arbeitet.“",
      steps: [
        { t: "Analgesie-Vorlauf und Allergien klären", ic: "help", ph: "vor", fb: "Standard und Wundverlauf gelesen, Analgetikum wirkt, Allergien erfragt: Jod. Kein PVP-Iod.", say: "Jod? Davon bekomme ich Blasen. Steht das nicht in der Akte?" },
        { t: "Lagern mit Abduktionskissen", ic: "pillow", ph: "vor", fb: "Rückenlage, leichte Kippung nach links, Abduktionskissen zwischen den Beinen. Keine Innenrotation, keine Adduktion." },
        { t: "Material richten: NaCl statt Jod", ic: "tray", ph: "vor", fb: "Steriles Set mit zwei Pinzetten, sterile Kompressen, NaCl 0,9 % oder Wundspüllösung nach Standard, sterile Wundauflage, Abwurf." },
        { t: "Hände desinfizieren, Handschuhe anziehen", ic: "glove", ph: "vor", fb: "Händedesinfektion, unsterile Handschuhe für den alten Verband." },
        { t: "Alten Verband von außen lösen, ansehen", ic: "bandage", ph: "durch", fb: "Von außen zur Wunde hin lösen, Haut gegenhalten, Sekret am Verband nach Menge, Farbe und Geruch beurteilen." },
        { t: "Handschuhe aus, Hände desinfizieren", ic: "hand", ph: "durch", fb: "Nach dem Kontakt mit dem alten Verband: Handschuhe aus, Händedesinfektion." },
        { t: "Wunde beurteilen", ic: "eye", ph: "durch", fb: "Primär heilend, Ränder adaptiert, keine Infektionszeichen, am unteren Pol wenig seröses Sekret: steril versorgen und beobachten." },
        { t: "Steriles Set Non-Touch öffnen", ic: "sterile", ph: "durch", fb: "Nur die Außenseite berühren, Spüllösung auf die Kompressen geben." },
        { t: "Von innen nach außen reinigen", ic: "swab", ph: "durch", fb: "Mit Pinzette und getränkter Kompresse: erst entlang der Naht, dann die Umgebung. Jede Kompresse nur einmal." },
        { t: "Trocken tupfen, Wundauflage auflegen", ic: "bandage", ph: "durch", fb: "Sterile Auflage mit 2 bis 3 cm Überstand, Wundseite nicht berühren, spannungsfrei fixieren, beschriften." },
        { t: "Entsorgen, Hände desinfizieren", ic: "trash", ph: "nach", fb: "Material in den Abwurf, Pinzetten zur Aufbereitung, Händedesinfektion." },
        { t: "Rückenlage, Luxationsregeln wiederholen", ic: "bed", ph: "nach", fb: "Abduktionskissen, Klingel in Reichweite, Luxationsregeln kurz wiederholt.", say: "Sauber gearbeitet. Das hätte ich früher auch nicht besser gemacht." },
        { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Lokalisation, Länge, Wundränder, Klammern, Sekret, Umgebung, Schmerz, Material, nächster Wechsel, Handzeichen." }
      ],
      wrong: [
        { t: "PVP-Iod zur Desinfektion nehmen", ic: "swab", ko: true, fb: "Kritisch: Frau Vogt hat eine Jodallergie." },
        { t: "Linke Seitenlage ohne Kissen", ic: "bed", ko: true, fb: "Kritisch: Adduktion und Innenrotation gefährden die frische Hüftprothese (Luxation)." },
        { t: "Von außen nach innen reinigen", ic: "swab", ko: true, fb: "Kritisch: Bei aseptischen Wunden wird von innen nach außen gereinigt, sonst trägst du Keime in die Wunde." },
        { t: "Heruntergefallene Kompresse aufheben", ic: "swab", ko: true, fb: "Kritisch: Was die Bettdecke berührt hat, ist unsteril und wird verworfen." },
        { t: "Wunde mit Handschuhen abtupfen", ic: "glove", ko: true, fb: "Kritisch: Unsterile Handschuhe gehören nicht an eine aseptische Wunde. Non-Touch mit Pinzetten." },
        { t: "Mit einer Kompresse hin und her wischen", ic: "swab", fb: "So verteilst du Keime. Jede Kompresse nur einmal, eine Richtung." },
        { t: "Während der Raumreinigung wechseln", ic: "clock", fb: "Aufgewirbelter Staub erhöht das Infektionsrisiko. Zeitpunkt abstimmen." }
      ],
      scene: vwScene,
      status: function (i) { return ["Vorbereitung", "Lagerung", "Material", "Hygiene", "Verband lösen", "Handschuhwechsel", "Beurteilen", "Steriles Set", "Reinigen", "Abdecken", "Entsorgen", "Lagern", "Dokumentation"][i] || ""; },
      statusEnd: "Wunde steril versorgt"
    });
    delete vw.art;
  }
})();
