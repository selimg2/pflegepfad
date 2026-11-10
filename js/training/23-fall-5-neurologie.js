/* ===== Fall 5 (Neurologie): Figuren, Bildbefund, Dysphagie-Simulation ===== */
(function () {
  var X = window.PXB, AV = window.PXAV, C = (window.PEX_CASES || []).filter(function (c) { return c.id === "neuro"; })[0];
  if (!X || !C) return;
  var P = C.pat;
  P.A.av = { hair: "PH", hairC: "#cfcfd3", skin: "#f6d2b3", cloth: "#7f9cc9", deco: "shirt", bg: "#e6edf5", glasses: 1, wrinkles: 1, droop: 1 };
  P.B.av = { hair: "WE", hairC: "#ececee", skin: "#f6d2b3", cloth: "#f2b8c6", deco: "gown", dot: "#d47a93", bg: "#fde8e8", wrinkles: 1 };
  P.A.erzaehlerKey = "ilse";
  C.people = {
    anleitung: { name: "Ole Lindqvist", av: { hair: "LN", hairC: "#d9a441", skin: "#f6d2b3", cloth: "#4f46e5", deco: "badge", bg: "#e6efff", beard: 1, beardC: "#c99a5b" } },
    pruefer: { name: "Frau Schäfer", av: { hair: "EN", hairC: "#5a3b28", skin: "#f0c7a5", cloth: "#6d5a8a", deco: "collar", bg: "#efe7fb", glasses: 1 } },
    nacht: { name: "Aylin Kaya", role: "Nachtdienst", av: { hair: "SY", hairC: "#2b2b33", skin: "#c98d64", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3" } },
    ilse: { name: "Ilse Pohl", match: "ilse|ehefrau", av: { hair: "GL", hairC: "#d8d9dc", skin: "#f6d2b3", cloth: "#b7cdb8", bg: "#e7f4e4", wrinkles: 1, glasses: 1 } }
  };

  /* ---------- Bildbefund Frau Albers ---------- */
  var alb = P.B.av, s5 = {};
  function albersScene() {
    return X.bedScene(alb, {
      mood: "worried", legs: "flat", blanket: "#f4e1e8", pose: "semi", feet: { col: "#f6d2b3" },
      prePatient: function (b) { return X.p("M" + (b.hx + 6) + " " + (b.y + 4) + "q14 -6 24 4q12 -6 22 2", "none", 0, ' stroke="#94a3b8" stroke-width="2"'); },
      ns: X.pills(24, 170) + X.glass(46, 170, 0.1),
      post: function (pt) {
        var s = "";
        /* Ferse rechts gerötet */
        if (X._feet) { s += X.e(X._feet[0] - 12, X._feet[1] + 6, 6, 4, "#ef4444", 0, ' opacity=".7"'); s5.heel = [X._feet[0] - 12, X._feet[1] + 6]; }
        /* Falten im Laken */
        s += X.p("M150 206q10-8 18 0q8-8 16 0q8-8 16 0", "none", 0, ' stroke="#64748b" stroke-width="2.2"');
        /* Pulsoxymeterkabel unter dem Körper */
        s += X.p("M" + (X._hand ? X._hand[0] + 6 : 200) + " " + (X._hand ? X._hand[1] : 170) + "C200 196 160 200 148 214", "none", 0, ' stroke="#334155" stroke-width="2.4"') + (X._hand ? X.r(X._hand[0] + 4, X._hand[1] - 5, 12, 9, 3, "#ef4444", 1.4) : "");
        /* Frühstück unberührt auf dem Tisch */
        s += X.overbed(210, 132, 96, X.p("M220 128h40v6h-40z", "#ffffff", 1.6) + X.e(240, 126, 16, 4, "#fde68a", 1.4) + X.cup(286, 132, "#7a4a2a"));
        /* Getränk auf der Fensterbank außer Reichweite */
        s += X.glass(330, 112, 0.7, "#fecaca");
        return s;
      }
    });
  }
  var ab = C.live.filter(function (l) { return l.k === "albersbild"; })[0];
  if (ab) {
    ab.art = albersScene();
    ab.mood = "worried";
    ab.banner = { name: "Renate Albers", sub: "71 J. · Zimmer 602 · Parkinson, akinetische Krise bei Harnwegsinfekt", chips: [["L-Dopa streng nach Uhrzeit", "red"], ["Sturzgefahr", ""]] };
    var old = ab.spots;
    function sp(t) { return old.filter(function (x) { return x.t.indexOf(t) === 0; })[0] || {}; }
    ab.spots = [
      Object.assign({}, sp("Ferse"), { c: [[Math.round((s5.heel || [330, 172])[0]), Math.round((s5.heel || [330, 172])[1]), 14]] }),
      Object.assign({}, sp("Falten"), { c: [[176, 204, 20]] }),
      Object.assign({}, sp("Kabel"), { c: [[160, 208, 12], [196, 192, 12]] }),
      Object.assign({}, sp("Tabletten"), { c: [[24, 160, 14]] }),
      Object.assign({}, sp("Frühstück"), { c: [[244, 124, 22]] }),
      Object.assign({}, sp("Getränk"), { c: [[330, 98, 16]] })
    ];
  }

  /* ---------- Essen anreichen bei Dysphagie ---------- */
  var poh = P.A.av, ME = { hair: "LN", hairC: "#6b4a2f", skin: "#e8b48f", cloth: "#4f7fe0", deco: "scrubs", bg: "#e6efff" };
  function seated(o) {
    o = o || {};
    var s = X.defs() + X.room({ disp: 0, railX: 12, railW: 150, winX: 270 });
    if (o.suction) s += X.r(170, 66, 26, 40, 6, "#ffffff", 1.8) + X.r(174, 74, 18, 22, 4, "#e0f2fe", 1.2) + X.tube("M183 106C184 140 200 150 206 160", "#cbd5e1", 2.5) + X.tag(183, 56, "Absaugung bereit", "ok");
    /* Stuhl */
    s += X.sh(120, 248, 60, 6) + X.r(56, 96, 16, 120, 6, "#94a3b8", 2) + X.r(64, 190, 100, 16, 6, "#94a3b8", 2) + X.l(70, 206, 66, 244, K(), 4) + X.l(156, 206, 160, 244, K(), 4);
    /* Körper sitzend */
    /* Tisch */
    s += X.r(170, 160, 170, 10, 4, "#e9dcc7", 2) + X.l(320, 170, 320, 244, "#94a3b8", 5) + X.l(296, 244, 344, 244, "#64748b", 5);
    if (o.mat) s += X.r(190, 152, 100, 8, 3, "#93c5fd", 1.4);
    s += X.e(230, 150, 24, 7, "#ffffff", 2) + X.e(230, 147, 18, 4, o.empty ? "#f8fafc" : "#fcd9a8", 0);
    s += X.t(230, 138, "IDDSI 4", { s: 7.5, w: 800, c: "#7c2d12" });
    if (o.cup !== false) s += X.p("M272 150l-3-26h22l-3 26z", o.cupNose ? "#e0f2fe" : "#ffffff", 1.8) + (o.cupNose ? X.p("M270 124q10 8 20 0", "none", 0, ' stroke="#1d1d1f" stroke-width="1.6"') : "") + X.t(280, 118, "IDDSI 2", { s: 7, w: 800, c: "#1d4ed8" });
    if (o.alt) s += '<g class="pa-in">' + X.p("M300 150l-3-22h20l-3 22z", "#fef3c7", 1.8) + X.t(307, 122, "Apfel", { s: 7, w: 800 }) + "</g>";
    /* Frau Pohl sitzend: linke Hand auf dem Tisch oder mit Löffel */
    var hand = o.spoon ? [170, 116] : [192, 156];
    s += X.F.sitSide(poh, 90, 192, { sc: 1.15, mood: o.mood || "neutral", pants: "#5b6b8a", feet: "shoes", reach: hand });
    if (o.spoon) s += '<g class="' + (o.spoonAnim ? "pa-wiggle" : "") + '">' + X.l(hand[0] + 2, hand[1], hand[0] - 34, hand[1] - 10, "#94a3b8", 3) + X.e(hand[0] - 37, hand[1] - 11, 6, 4, "#fcd9a8", 1.4) + "</g>";
    /* Gegenüber: Du auf Augenhöhe */
    if (o.me) s += '<g class="' + (o.meNew ? "pa-slide" : "") + '">' + X.r(354, 200, 40, 46, 6, "#94a3b8", 2) + X.F.sitSide(ME, 374, 202, { flip: true, sc: 1.1, mood: o.meMood || "smile", pants: "#3b5fc0", feet: "shoes", arms: "rest" }) + "</g>";
    if (o.gurgle) s += '<g class="pa-glow">' + X.p("M150 96q10-6 0-12M158 100q14-10 0-20M166 104q18-14 0-28", "none", 0, ' stroke="#ef4444" stroke-width="2.4" stroke-linecap="round"') + "</g>";
    return s + X.vignette();
    function K() { return X.K; }
  }
  function mouthCheck() {
    var s = X.blank("#eef3f8") + '<g transform="translate(200,140) scale(2.2)">' + '<g transform="translate(-60,-56)">' + AV.head(poh, "surprised") + "</g></g>";
    s += '<g class="pa-in">' + X.c(250, 166, 22, "none", 0, ' stroke="#f59e0b" stroke-width="3" stroke-dasharray="5 4"') + "</g>" + X.g(X.r(0, 0, 50, 14, 6, "#334155", 1.6) + X.p("M50 7l40-14v28z", "#fef9c3", 0, ' opacity=".7"'), "translate(300,170) rotate(190)");
    return s + X.tag(200, 252, "rechte Wangentasche: Speisereste entfernen", "warn");
  }
  function dyScene(i) {
    if (i === 0) return X.blank() + X.tray(40, 40, 320, 180) + X.e(150, 120, 60, 22, "#ffffff", 2) + X.e(150, 114, 48, 12, "#fcd9a8", 0) + X.t(150, 160, "Brei · IDDSI 4", { s: 11, w: 800 }) + X.p("M262 150l-5-60h46l-5 60z", "#ffffff", 2) + X.t(280, 174, "Getränk · IDDSI 2", { s: 11, w: 800 }) + X.tag(200, 250, "Tablett = Anordnung der Logopädie", "");
    if (i === 1) return X.blank() + X.tray(40, 40, 320, 180) + X.e(150, 120, 60, 22, "#ffffff", 2) + X.e(150, 114, 48, 12, "#fcd9a8", 0) + X.t(150, 160, "Brei · IDDSI 4", { s: 11, w: 800 }) + X.p("M262 150l-5-60h46l-5 60z", "#ffffff", 2) + X.t(280, 174, "Getränk · IDDSI 2", { s: 11, w: 800 }) + X.check(330, 70) + X.tag(200, 250, "Konsistenz stimmt", "ok");
    if (i === 2) return seated({ mood: "neutral" }) + X.tag(250, 40, "wach · Prothese sitzt · Brille auf", "ok");
    if (i === 3) return seated({ mood: "neutral", suction: 1 });
    if (i === 4) return seated({ mood: "smile", suction: 1 }) + X.p("M70 220V120", "none", 0, ' stroke="#22c55e" stroke-width="2.4" stroke-dasharray="4 4"') + X.p("M70 220H150", "none", 0, ' stroke="#22c55e" stroke-width="2.4" stroke-dasharray="4 4"') + X.t(88, 210, "90°", { s: 11, w: 800, c: "#15803d" }) + X.tag(240, 40, "aufrecht · Füße am Boden · Kinn leicht vorn", "ok");
    if (i === 5) return seated({ mood: "smile", suction: 1, me: 1, meNew: 1 }) + X.tag(260, 40, "auf Augenhöhe · von rechts ansprechen", "ok");
    if (i === 6) return seated({ mood: "happy", me: 1, mat: 1, spoon: 1 }) + X.tag(240, 40, "isst selbst mit links · Antirutschmatte", "ok");
    if (i === 7) return seated({ mood: "neutral", me: 1, mat: 1, spoon: 1, spoonAnim: 1 }) + X.tag(240, 40, "teelöffelgroß · nachschlucken lassen", "");
    if (i === 8) return seated({ mood: "pain", me: 1, meMood: "worried", mat: 1, gurgle: 1 }) + X.tag(240, 40, "nasse Stimme → Stopp · räuspern · nachschlucken", "bad");
    if (i === 9) return seated({ mood: "neutral", me: 1, mat: 1, cupNose: 1 }) + X.tag(240, 40, "Nasenbecher · kleine Schlucke · Kinn vorn", "ok");
    if (i === 10) return seated({ mood: "smile", me: 1, mat: 1, cupNose: 1, alt: 1 }) + X.tag(240, 40, "Ja/Nein-Fragen · andere Sorte", "ok");
    if (i === 11) return mouthCheck();
    if (i === 12) return seated({ mood: "smile", empty: 1, cup: false }) + '<g transform="translate(330,70)">' + X.c(0, 0, 26, "#ffffff", 2) + '<circle cx="0" cy="0" r="20" fill="none" stroke="#2563eb" stroke-width="5" stroke-dasharray="126" class="pa-timer" transform="rotate(-90)"/>' + X.t(0, 5, "30 min", { s: 9, w: 800 }) + "</g>" + X.bell(36, 214);
    return X.blank() + X.clipboard(60, 26, 280, 230, "Ess-Protokoll 08:05", ["Kost IDDSI 4, Getränk IDDSI 2", "½ Portion, 150 ml getrunken", "08:12 gurgelnde Stimme, gestoppt,", "  gehustet, danach klar", "Reste re. Wangentasche entfernt", "Logopädie informiert · OL"], { mark: 2 }) + X.check(318, 236);
  }
  var dy = C.live.filter(function (l) { return l.k === "dysphagie"; })[0];
  if (dy) {
    Object.assign(dy, {
      ic: "spoon", mood: "sad", kurz: "Essen anreichen",
      intro: "07:30 Uhr, Frühstück. Herr Pohl sitzt im Stuhl am Bett. Laut Logopädie: Kost IDDSI 4 (püriert), Getränke IDDSI 2 (leicht angedickt), Essen nur unter Aufsicht. Er zeigt auf das Tablett, schüttelt den Kopf und bringt nur ein „Nee … nee“ heraus.",
      steps: [
        { t: "Kostform mit Anordnung vergleichen", ic: "check", ph: "vor", fb: "Brei IDDSI 4 und Getränk IDDSI 2 stimmen mit der Logopädie überein." },
        { t: "Wachheit, Prothese und Brille prüfen", ic: "eye", ph: "vor", fb: "Er ist wach und aufmerksam, die Prothese sitzt, der Mund ist frei, die Brille ist auf." },
        { t: "Absaugung bereit, Hände desinfizieren", ic: "hand", ph: "vor", fb: "Absaugung nach Standard griffbereit, Händehygiene." },
        { t: "Aufrecht 90° hinsetzen, Kinn leicht vorn", ic: "sit", ph: "vor", fb: "Hüfte und Rücken etwa 90°, Füße auf dem Boden, rechter Arm auf dem Tisch, Kinn leicht zur Brust." },
        { t: "Auf Augenhöhe, von rechts sprechen", ic: "talk", ph: "vor", fb: "Ihm zugewandt, er sieht dich und das Essen. Links hört er schlecht." },
        { t: "Selbst essen lassen, Antirutschmatte", ic: "spoon", ph: "durch", fb: "Er isst mit links, du stellst Antirutschmatte und Teller mit Rand bereit und hilfst nur so viel wie nötig.", say: "Mmh … gut." },
        { t: "Teelöffelgroß, nachschlucken lassen", ic: "mouth", ph: "durch", fb: "Kleine Portionen auf die nicht betroffene Seite, abwarten, zum Nachschlucken auffordern, Kehlkopfhebung beobachten." },
        { t: "Bei nasser Stimme stoppen, husten lassen", ic: "stop", ph: "durch", fb: "Sofort stoppen, räuspern und kräftig husten lassen, nachschlucken. Erst weiter, wenn die Stimme klar ist." },
        { t: "Angedicktes Getränk im Nasenbecher", ic: "cup", ph: "durch", fb: "IDDSI 2 im Becher mit Nasenausschnitt, kleine Schlucke, der Kopf bleibt leicht vorn." },
        { t: "Bei Ablehnung Ja/Nein fragen, Alternative", ic: "talk", ph: "durch", fb: "Geschmack? Konsistenz? Temperatur? Eine andere Sorte angeboten und die Ablehnung an die Logopädie weitergegeben.", say: "Ja … Apfel. Danke." },
        { t: "Mund kontrollieren, Wangentasche", ic: "eye", ph: "nach", fb: "Reste in der rechten Wangentasche entfernt, Mundpflege, Prothese gereinigt." },
        { t: "30 Minuten aufrecht sitzen lassen", ic: "clock", ph: "nach", fb: "Aufrecht bleiben, Klingel links erreichbar, Ess- und Trinkmenge erfasst." },
        { t: "Menge und Beobachtung dokumentieren", ic: "doc", ph: "nach", fb: "Kostform, Mengen, Dauer, Hilfebedarf, Aspirationszeichen mit Zeit und Reaktion, Wangentasche, Information an die Logopädie." }
      ],
      wrong: [
        { t: "Schluck Wasser zum Anfeuchten geben", ic: "cup", ko: true, fb: "Kritisch: Dünnflüssiges Wasser ist bei seiner Dysphagie ein Aspirationsrisiko." },
        { t: "Halb liegend im Bett essen lassen", ic: "bed", ko: true, fb: "Kritisch: Im Halbliegen fließt Nahrung leichter in die Luftröhre." },
        { t: "Schnabelbecher geben", ic: "cup", ko: true, fb: "Kritisch: Der Schnabelbecher zwingt den Kopf nach hinten und überstreckt den Hals." },
        { t: "Weiter anreichen, Husten ist gut", ic: "spoon", ko: true, fb: "Kritisch: Gurgelnde Stimme und Husten sind Aspirationszeichen. Stopp." },
        { t: "Getränk mit Wasser verdünnen", ic: "water", ko: true, fb: "Kritisch: Dann stimmt die Konsistenz nicht mehr." },
        { t: "Großer Löffel, damit es schneller geht", ic: "spoon", fb: "Große Portionen überfordern den Schluckakt." }
      ],
      scene: dyScene,
      status: function (i) { return ["Kostform", "Voraussetzungen", "Hygiene", "Sitzposition", "Deine Position", "Selbstständigkeit", "Portion und Tempo", "Aspirationszeichen", "Trinken", "Akzeptanz", "Mundkontrolle", "Nachbereitung", "Dokumentation"][i] || ""; },
      statusEnd: "Sicher gegessen, Logopädie informiert"
    });
    delete dy.art;
  }
})();
