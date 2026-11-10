/* ===== Fall 6 (Pädiatrie): Figuren, Bildbefund, Inhalations-Simulation ===== */
(function () {
  var X = window.PXB, AV = window.PXAV, C = (window.PEX_CASES || []).filter(function (c) { return c.id === "paediatrie"; })[0];
  if (!X || !C) return;
  var P = C.pat;
  P.A.av = { hair: "LE", hairC: "#d9a441", skin: "#f6d2b3", cloth: "#f5a3c7", deco: "none", bg: "#fde8e8", blush: 1, freckles: 1 };
  P.B.av = { hair: "NO", hairC: "#e0b25a", skin: "#f6d2b3", cloth: "#f5c26b", deco: "none", bg: "#fff1d6", blush: 1 };
  P.C.av = { hair: "TF", hairC: "#3a2a22", skin: "#c98d64", cloth: "#1e40af", deco: "jersey", dot: "#ffffff", bg: "#ddeeff" };
  P.A.erzaehlerKey = "krueger"; P.B.erzaehlerKey = "hartwig";
  C.people = {
    anleitung: { name: "Miriam Schulz", av: { hair: "KL", hairC: "#a8743f", skin: "#f6d2b3", cloth: "#db2777", deco: "badge", bg: "#fde8e8" } },
    pruefer: { name: "Herr Brandt", av: { hair: "TI", hairC: "#6b4a2f", skin: "#f6d2b3", cloth: "#475569", deco: "collar", bg: "#e6edf5", glasses: 1, beard: 1, beardC: "#6b4a2f" } },
    nacht: { name: "Jonas Peters", role: "Nachtdienst", av: { hair: "JO", hairC: "#2b2b33", skin: "#e3ab84", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3" } },
    krueger: { name: "Sandra Krüger", match: "krüger|lenas? mutter", av: { hair: "LE", hairC: "#c99a5b", skin: "#f6d2b3", cloth: "#9fd4c7", bg: "#e6f6f3" } },
    hartwig: { name: "Jessica Hartwig", match: "hartwig|emils? mutter|mama", av: { hair: "SN", hairC: "#3a2a22", skin: "#f6d2b3", cloth: "#c9b6e4", bg: "#efe7fb" } },
    vater: { name: "Herr Schröder", match: "vater|schröder", av: { hair: "KA", hairC: "#2b2b33", skin: "#c98d64", cloth: "#5b6b7a", deco: "shirt", bg: "#e6edf5", mustache: 1, beardC: "#2b2b33" } }
  };

  /* ---------- Bildbefund Emil (frontal, groß) ---------- */
  var em = Object.assign({}, P.B.av, { blush: 0 });
  var HX = 136, HY = 70, HS = 168, sc = HS / 120;
  function F(fx, fy) { return [Math.round(HX + (fx - 60) * sc), Math.round(HY + (fy - 56) * sc)]; }
  function emilScene() {
    var s = X.defs() + '<rect width="400" height="280" fill="' + X.ref("w") + '"/>';
    /* Gitterbett */
    s += X.r(10, 120, 270, 150, 10, "#ffffff", 2) + X.r(10, 196, 270, 74, 0, "#dbeafe", 0);
    for (var i = 0; i < 12; i++) s += X.l(22 + i * 22, 120, 22 + i * 22, 270, "#cbd5e1", 3);
    /* Körper frontal: Oberkörper frei, Windel, Beine */
    var sk = em.skin;
    /* Arme hängen aus den Schultern, Rumpf mit runden Schultern, Hals verbindet Kopf und Rumpf */
    var arm6 = function (d) { return X.p(d, "none", 0, ' stroke="#1d1d1f" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"') + X.p(d, "none", 0, ' stroke="' + sk + '" stroke-width="20.5" stroke-linecap="round" stroke-linejoin="round"'); };
    s += arm6("M96 136Q70 142 64 172L64 200") + arm6("M176 136Q202 142 208 172L208 200") + X.e(64, 204, 10, 8, sk, 2) + X.e(208, 204, 10, 8, sk, 2);
    s += X.p("M84 206L86 150C86 134 94 126 108 124Q122 120 136 120Q150 120 164 124C178 126 186 134 186 150L188 206Z", sk, 2.4);
    s += X.p("M122 92V110Q122 120 110 125H162Q150 120 150 110V92Z", sk, 0) + X.p("M122 92V110Q122 120 110 125M150 92V110Q150 120 162 125", "none", 2.4) + X.e(136, 106, 14, 4, AV.mix(sk, "#1d1d1f", 0.2), 0, ' opacity=".3"');
    /* Einziehungen: Drosselgrube, Rippen */
    s += '<g class="pa-breathe" style="animation-duration:1.4s">' + X.p("M126 128q10 8 20 0", "none", 0, ' stroke="#b4693e" stroke-width="2.4" stroke-linecap="round"') + [0, 1, 2, 3].map(function (k) { return X.p("M" + (100 + k * 2) + " " + (150 + k * 12) + "q14 6 28 0M" + (144 - k * 2) + " " + (150 + k * 12) + "q14 6 28 0", "none", 0, ' stroke="#c98f6b" stroke-width="2" stroke-linecap="round"'); }).join("") + "</g>";
    s += X.p("M80 204H192Q196 222 180 230H92Q76 222 80 204Z", "#ffffff", 2.2) + X.l(136, 206, 136, 228, "#cbd5e1", 1.6);
    /* Beine mit Marmorierung */
    var mar = function (x) { return X.r(x, 226, 34, 54, 14, "#e8c9b8", 2.2) + [[8, 12], [20, 24], [12, 36], [24, 44]].map(function (q) { return X.p("M" + (x + q[0]) + " " + (226 + q[1]) + "q6-4 10 2", "none", 0, ' stroke="#b9a3c9" stroke-width="2"'); }).join(""); };
    s += mar(94) + mar(146);
    /* Arme */

    /* Kopf groß, müde */
    s += X.head(em, "tired", HX, HY, HS);
    /* eingesunkene Augen: Schatten */
    var e1 = F(50, 57), e2 = F(70, 57);
    s += X.e(e1[0], e1[1] + 3, 9, 4, "#8b7aa8", 0, ' opacity=".45"') + X.e(e2[0], e2[1] + 3, 9, 4, "#8b7aa8", 0, ' opacity=".45"');
    /* Nasenflügeln */
    var n = F(60, 63);
    s += '<g class="pa-glow">' + X.p("M" + (n[0] - 7) + " " + n[1] + "q-5-3-3-7M" + (n[0] + 7) + " " + n[1] + "q5-3 3-7", "none", 0, ' stroke="#b4693e" stroke-width="2.2" stroke-linecap="round"') + "</g>";
    /* rissige Lippen */
    var m = F(60, 70);
    s += X.p("M" + (m[0] - 6) + " " + (m[1] - 1) + "l3 3 3-3 3 3 3-3", "none", 0, ' stroke="#b45f4a" stroke-width="1.6" stroke-linecap="round"');
    /* Tisch mit eigenem Paracetamol-Saft */
    s += X.r(290, 120, 100, 10, 4, "#e9dcc7", 2) + X.l(340, 130, 340, 270, "#94a3b8", 5);
    s += X.p("M300 116v-26l6-8h14l6 8v26z", "#fff7ed", 2) + X.r(300, 96, 26, 16, 2, "#fb923c", 1.4) + X.t(313, 107, "Saft", { s: 7, w: 800, c: "#ffffff" }) + X.r(304, 74, 18, 8, 2, "#94a3b8", 1.4);
    s += X.r(336, 98, 30, 18, 3, "#e0e7ff", 1.6) + X.t(351, 110, "Teddy", { s: 7 });
    return s + X.vignette();
  }
  var eb = C.live.filter(function (l) { return l.k === "emilbild"; })[0];
  if (eb) {
    eb.art = emilScene();
    delete eb.vb;
    eb.mood = "tired";
    eb.banner = { name: "Emil Hartwig", sub: "3 J. · Zimmer K2-06 · 14 kg · Pneumonie, Dehydratation", chips: [["Fieber 39,4 °C", "red"], ["Mutter rooming-in", ""]] };
    var old = eb.spots;
    function sp(t) { return old.filter(function (x) { return x.t.indexOf(t) === 0; })[0] || {}; }
    var nn = F(60, 61), mm = F(60, 70), a1 = F(50, 56), a2 = F(70, 56);
    eb.spots = [
      Object.assign({}, sp("Nasenflügeln"), { c: [[nn[0], nn[1], 12]] }),
      Object.assign({}, sp("Juguläre"), { c: [[136, 130, 14], [136, 166, 30]] }),
      Object.assign({}, sp("Trockene"), { c: [[mm[0], mm[1], 11]] }),
      Object.assign({}, sp("Eingesunkene"), { c: [[a1[0], a1[1] + 2, 12], [a2[0], a2[1] + 2, 12]] }),
      Object.assign({}, sp("Marmorierte"), { c: [[111, 252, 22], [163, 252, 22]] }),
      Object.assign({}, sp("Eigener"), { c: [[313, 100, 18]] })
    ];
  }

  /* ---------- Inhalation mit Spacer bei Lena ---------- */
  var lena = P.A.av, mom = C.people.krueger.av;
  function close(o) {
    o = o || {};
    var s = X.blank("#eef6fb") + '<rect y="200" width="400" height="80" fill="#dbeafe"/>';
    s += X.bust(lena, o.mood || "neutral", 110, 150, 210);
    if (o.dragon) s += X.g(X.p("M0 0q10-24 30-18q14 4 10 22q-4 18-22 18q-20-2-18-22z", "#86efac", 2) + X.c(18, -6, 2.5, "#1d1d1f", 0) + X.p("M30 -14l8-10 2 12", "#4ade80", 1.6), "translate(20,214)");
    if (o.spacer) {
      var mx = 116, my = 166;
      s += '<g class="' + (o.spNew ? "pa-slide" : "") + '">' + X.p("M" + mx + " " + (my - 7) + "h20l16-16h120q14 0 14 14v38q0 14-14 14h-120l-16-16h-20z", "#e0f2fe", 2, ' opacity=".95"') + X.l(mx + 36, my - 23, mx + 36, my + 37, "#bae6fd", 1.4);
      if (o.mdi) s += X.r(mx + 152, my - 62, 26, 50, 7, "#2563eb", 2) + X.r(mx + 158, my - 14, 14, 10, 2, "#1e3a8a", 1.4);
      if (o.mdi === "kortison") s += X.r(mx + 152, my - 62, 26, 50, 7, "#b45309", 2) + X.r(mx + 158, my - 14, 14, 10, 2, "#78350f", 1.4);
      if (o.puff) s += '<g class="pa-puff">' + X.e(mx + 120, my + 8, 40, 18, "#ffffff", 0, ' opacity=".85"') + "</g>";
      if (o.breaths) s += [1, 2, 3, 4, 5].map(function (k) { return '<g class="pa-pop" style="animation-delay:' + k * 0.35 + 's">' + X.c(mx + 40 + k * 28, my + 66, 11, k <= o.breaths ? "#22c55e" : "#e2e8f0", 1.6) + X.t(mx + 40 + k * 28, my + 70, String(k), { s: 9, w: 800, c: k <= o.breaths ? "#ffffff" : "#64748b" }) + "</g>"; }).join("");
      s += "</g>";
    }
    if (o.mom) s += '<g class="pa-in">' + X.bust(mom, "smile", 340, 120, 110) + "</g>";
    return s;
  }
  function inhScene(i) {
    if (i === 0) return X.blank() + X.clipboard(40, 30, 200, 220, "Anordnung 06:30", ["Salbutamol DA 100 µg", "2 Hübe über Spacer", "danach Budesonid 200 µg", "2 Hübe, Mund spülen", "Allergie: Erdnuss"], { mark: 2 }) + X.g(X.r(0, 0, 130, 30, 15, "#ffffff", 2) + X.c(16, 15, 7, "#db2777", 0) + X.t(74, 19, "Krüger, Lena", { s: 9.5 }), "translate(256,70)");
    if (i === 1) return X.blank() + X.clipboard(40, 30, 200, 220, "Anordnung 06:30", ["Salbutamol DA 100 µg", "2 Hübe über Spacer", "danach Budesonid 200 µg", "2 Hübe, Mund spülen", "Allergie: Erdnuss"], { mark: 2 }) + X.g(X.r(0, 0, 130, 30, 15, "#ffffff", 2) + X.c(16, 15, 7, "#db2777", 0) + X.t(74, 19, "Krüger, Lena", { s: 9.5 }), "translate(256,70)") + X.check(372, 84) + X.tag(320, 140, "Spray vom Nachttisch? Nein.", "warn");
    if (i === 2) return close({ mood: "happy", dragon: 1, mom: 1 }) + X.tag(250, 40, "„Erst den Drachen rauspusten …“", "");
    if (i === 3) return X.blank() + X.tray(40, 60, 320, 150) + X.p("M80 130h20l16-16h120q14 0 14 14v38q0 14-14 14h-120l-16-16h-20z", "#e0f2fe", 2) + X.r(290, 90, 26, 50, 7, "#2563eb", 2) + X.r(326, 90, 26, 50, 7, "#b45309", 2) + X.t(303, 156, "Salbutamol", { s: 8 }) + X.t(339, 168, "Budesonid", { s: 8 }) + X.tag(200, 240, "Spacer mit Mundstück · sauber, trocken", "ok");
    if (i === 4) return close({ mood: "neutral", dragon: 1 }) + X.tag(260, 40, "aufrecht · Kopf leicht angehoben", "ok");
    if (i === 5) return close({ mood: "neutral", spacer: 1, spNew: 1, mdi: 1, dragon: 1 }) + X.tag(270, 40, "Kappe ab · schütteln · senkrecht einstecken", "ok");
    if (i === 6) return close({ mood: "neutral", spacer: 1, mdi: 1, puff: 1 }) + X.tag(270, 40, "ausatmen · Lippen dicht · ein Hub", "ok");
    if (i === 7) return close({ mood: "smile", spacer: 1, mdi: 1, breaths: 5 }) + X.tag(270, 40, "4–5 ruhige Atemzüge, du zählst mit", "ok");
    if (i === 8) return close({ mood: "smile", spacer: 1, mdi: 1, puff: 1 }) + '<g transform="translate(330,70)">' + X.c(0, 0, 26, "#ffffff", 2) + '<circle cx="0" cy="0" r="20" fill="none" stroke="#2563eb" stroke-width="5" stroke-dasharray="126" class="pa-timer" transform="rotate(-90)"/>' + X.t(0, 5, "45 s", { s: 10, w: 800 }) + "</g>";
    if (i === 9) return close({ mood: "worried" }) + X.tag(270, 40, "Ein-Wort-Sätze · SpO₂ 90 % · Einziehungen", "bad");
    if (i === 10) return close({ mood: "worried", mom: 1 }) + '<g class="pa-alarm">' + X.c(330, 220, 18, "#ef4444", 2) + "</g>" + X.tag(250, 40, "Ärztin sofort · Kutschersitz · O₂ nach Standard", "ok");
    if (i === 11) return close({ mood: "smile", spacer: 1, mdi: "kortison" }) + X.cup(330, 230, "#bae6fd") + X.tag(260, 40, "Kortison · danach Mund spülen", "ok");
    if (i === 12) return X.blank() + X.e(200, 180, 120, 40, "#bae6fd", 2) + X.p("M120 160h20l16-16h80q14 0 14 14v20q0 14-14 14h-80l-16-16h-20z", "#e0f2fe", 2, ' opacity=".8"') + [0, 1, 2].map(function (k) { return '<circle class="pa-drip" style="animation-delay:' + k * 0.3 + 's" cx="' + (170 + k * 30) + '" cy="120" r="3" fill="#38bdf8"/>'; }).join("") + X.tag(200, 250, "zerlegen · Spülwasser · an der Luft trocknen", "ok");
    if (i === 13) return close({ mood: "happy", mom: 1, dragon: 1 }) + X.tag(230, 40, "Teach-back: „Blau ist für den Notfall!“", "ok");
    return X.blank() + X.clipboard(60, 26, 280, 230, "Pflegebericht 08:20", ["07:45 Salbutamol 2 Hübe via Spacer", "07:56 Verschlechterung, Ärztin sofort", "nach Therapie SpO₂ 95 %, AF 28", "08:10 Budesonid 2 Hübe, Mund gespült", "Teach-back mit Lena und Mutter", "MS"], { mark: 1 }) + X.check(318, 236);
  }
  var inh = C.live.filter(function (l) { return l.k === "inhalation"; })[0];
  if (inh) {
    Object.assign(inh, {
      ic: "spacer", mood: "worried", kurz: "Inhalation",
      intro: "07:40 Uhr. Neue Anordnung: Salbutamol-Dosieraerosol 100 µg, 2 Hübe über Spacer, danach Budesonid 200 µg, 2 Hübe. Lena sitzt mit ihrem Plüschdrachen im Bett, AF 36/min, SpO₂ 93 %. Sie flüstert: „Ich krieg so schlecht Luft.“",
      steps: [
        { t: "Anordnung und Identität prüfen", ic: "id", ph: "vor", fb: "Wirkstoffe, Dosis, Reihenfolge, Applikation geprüft. Identität über Armband und Mutter, Allergien erfragt, nachgefragt, was nachts gegeben wurde." },
        { t: "Kindgerecht mit dem Drachen erklären", ic: "talk", ph: "vor", fb: "Ein Bild, das zu ihr passt. Die Mutter schaut zu und lernt mit.", say: "Okay. Der Drache pustet zuerst!" },
        { t: "Spacer und Spray richten, Hände desinfizieren", ic: "spacer", ph: "vor", fb: "Dosieraerosole laut Anordnung, Spacer mit Mundstück, sauber und trocken." },
        { t: "Aufrecht hinsetzen lassen", ic: "sit", ph: "vor", fb: "Aufrecht, Kopf leicht angehoben, Schultern locker." },
        { t: "Kappe ab, schütteln, in den Spacer", ic: "inhal", ph: "durch", fb: "Kräftig schütteln und senkrecht in die Öffnung stecken." },
        { t: "Ausatmen, Mundstück dicht, ein Hub", ic: "spacer", ph: "durch", fb: "Lena atmet aus, nicht in den Spacer, umschließt das Mundstück dicht, dann ein Hub." },
        { t: "4–5 ruhige Atemzüge mitzählen", ic: "clock", ph: "durch", fb: "Ruhige Atemzüge durch das Mundstück, du zählst mit." },
        { t: "30–60 Sekunden warten, zweiter Hub", ic: "clock", ph: "durch", fb: "Erneut schütteln und genauso wiederholen." },
        { t: "Atmung und Sprechen beobachten", ic: "eye", ph: "durch", fb: "Zehn Minuten später: Ein-Wort-Sätze, SpO₂ 90 %, AF 42/min, Einziehungen. Das ist eine Verschlechterung." },
        { t: "Ärztin sofort rufen, Kutschersitz", ic: "phone", ph: "durch", fb: "Bei ihr bleiben, Notruf bzw. Ärztin sofort, Kutschersitz, Sauerstoff nach Standard, Mutter einbeziehen." },
        { t: "Kortison inhalieren, danach Mund spülen", ic: "cup", ph: "durch", fb: "Nach der ärztlichen Behandlung: gleiche Technik, danach Mund ausspülen oder trinken gegen Pilzbefall." },
        { t: "Spacer reinigen und trocknen", ic: "water", ph: "nach", fb: "Nach Herstellerangabe zerlegen, in Spülwasser legen, an der Luft trocknen lassen." },
        { t: "Teach-back mit Lena und Mutter", ic: "talk", ph: "nach", fb: "Beide erklären, was sie gemacht haben. Unterschied blaues Notfallspray und Kortison-Dauerspray.", say: "Blau ist für den Notfall, das braune jeden Tag. Und danach Mund ausspülen!" },
        { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Zeit, Wirkstoffe und Hübe, Technik, Wirkung, Verschlechterung und Maßnahmen, Schulung." }
      ],
      wrong: [
        { t: "Spray vom Nachttisch nehmen", ic: "inhal", ko: true, fb: "Kritisch: Wem gehört es, was ist drin? Nur das angeordnete, eindeutig zugeordnete Präparat." },
        { t: "Kortison zuerst geben", ic: "inhal", ko: true, fb: "Kritisch: Bei akuter Atemnot erst erweitern (Salbutamol), dann Kortison." },
        { t: "Noch zwei Hübe und abwarten", ic: "clock", ko: true, fb: "Kritisch: Eine Verschlechterung muss sofort gemeldet werden." },
        { t: "Beide Hübe gleichzeitig sprühen", ic: "spacer", fb: "Ein Hub pro Spacer-Füllung, sonst lagert sich das Medikament an der Wand ab." },
        { t: "Im Liegen inhalieren lassen", ic: "bed", fb: "Aufrecht sitzend gelangt mehr Medikament in die Lunge." }
      ],
      scene: inhScene,
      status: function (i) { return ["Anordnung", "Erklären", "Material", "Position", "Vorbereiten", "Hub", "Einatmen", "Zweiter Hub", "Wirkung", "Verschlechterung", "Kortison", "Spacer", "Schulung", "Dokumentation"][i] || ""; },
      statusEnd: "Lena atmet ruhiger, Mutter geschult"
    });
    delete inh.art;
  }
})();
