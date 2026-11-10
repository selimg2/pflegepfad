/* ===== Fall 1 (Akutgeriatrie): Figuren, Bildbefund statt EKG, Katheter-Simulation ===== */
(function () {
  var X = window.PXB, C = (window.PEX_CASES || []).filter(function (c) { return c.id === "geriatrie"; })[0];
  if (!X || !C) return;
  var P = C.pat;
  P.A.av = { hair: "HK", hairC: "#c9ccd1", skin: "#f6d2b3", cloth: "#9cc3e6", deco: "gown", bg: "#ddeeff", wrinkles: 1 };
  P.B.av = { hair: "GH", hairC: "#e9eaec", skin: "#f6d2b3", cloth: "#d9b8e8", deco: "gown", dot: "#a77bc4", bg: "#efe7fb", wrinkles: 1, glasses: 1 };
  P.C.av = { hair: "MK", hairC: "#b8bcc2", skin: "#f0c7a5", cloth: "#b7cdb8", deco: "gown", dot: "#6f9a72", bg: "#e7f4e4", wrinkles: 1 };
  P.A.modus = "Bildbefund · Vitalzeichen · Medikamente";
  C.people = {
    anleitung: { name: "Jana Kemper", av: { hair: "LE", hairC: "#d9a441", skin: "#f6d2b3", cloth: "#2f4f7a", deco: "badge", bg: "#fff1d6" } },
    pruefer: { name: "Herr Hollmann", av: { hair: "HS", hairC: "#9a8f86", skin: "#f0c7a5", cloth: "#5b6b7a", deco: "collar", bg: "#e6edf5", glasses: 1 } },
    nacht: { name: "Timo Berger", role: "Nachtdienst", av: { hair: "TI", hairC: "#6b4a2f", skin: "#e3ab84", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3", stubble: true } },
    tochter: { name: "Sabine Sommer", match: "tochter|sabine", av: { hair: "ZT", hairC: "#6b4a2f", skin: "#f6d2b3", cloth: "#e8b4a6", bg: "#fde8e8" } },
    brandt: { name: "Herr Brandt", match: "brandt", av: { hair: "WO", hairC: "#d6d9dd", skin: "#f6d2b3", cloth: "#9cc3e6", deco: "gown", bg: "#ddeeff", wrinkles: 1 } }
  };
  C.st.who = "brandt";

  /* ---------- Bildbefund Herr Kowalski, 06:16 Uhr ---------- */
  var kow = Object.assign({}, P.A.av, { pale: 1, sweat: 1 });
  function kowScene() {
    var s = X.defs() + X.room({ disp: 198, railX: 12, railW: 150, winX: 262 });
    s += X.monitor(168, 30, { hf: "128", spo2: "92", rr: "108/64" }, { alarm: 1 });
    s += X.t(209, 108, "ARRHYTHMIE", { s: 7.5, w: 800, c: "#ef4444", extra: ' class="pa-alarm"' });
    s += X.bed({ pose: "semi", x: 72, len: 270 });
    s += X.patient(kow, { mood: "worried", legs: "knee", blanket: "#d3e4f7" });
    /* Urinflasche am Bett, dunkler Urin */
    s += X.g(X.p("M-12 -30h20q8 0 8 8v30q0 8-8 8h-20q-8 0-8-8v-30q0-8 8-8z", "#fbfdff", 2) + X.p("M-18 -2h32v10q0 6-6 6h-20q-6 0-6-6z", "#d97706", 0) + X.p("M8 -24q10-6 12 6", "none", 2) + X.l(-12, -18, 2, -18, "#cbd5e1", 1.6), "translate(300,214)");
    /* Nachttisch: Flasche voll, Glas leer, Hörgerät */
    s += X.nightstand(6, { y: 176 });
    s += X.bottle(22, 170, "#cdeaff", 0.95) + X.glass(44, 170, 0);
    s += X.p("M30 98q-6 0-6 6t6 6", "none", 0) + "";
    s += X.g(X.p("M0 0q-8 0-8 8q0 7 7 8l3 0", "#f1d3b5", 2) + X.c(1, 16, 2.5, "#94a3b8", 1.2), "translate(56,160) rotate(15)");
    /* Klingel am Boden */
    s += X.cable(148, 200, 132, 262, "#64748b") + X.g(X.bell(0, 0), "translate(128,266) rotate(70)");
    /* Schlappen ohne Fersenhalt */
    s += X.g(X.p("M0 0q0-8 10-9h16q6 1 6 6v3z", "#64748b", 1.8) + X.p("M4 -6h18", "none", 0, ' stroke="#94a3b8" stroke-width="3"'), "translate(206,262)") + X.g(X.p("M0 0q0-8 10-9h16q6 1 6 6v3z", "#64748b", 1.8) + X.p("M4 -6h18", "none", 0, ' stroke="#94a3b8" stroke-width="3"'), "translate(240,266) rotate(8)");
    s += X.vignette();
    return s;
  }
  var kowbild = {
    k: "kowbild", typ: "hotspot", pat: "A", t: "Herr Kowalski · Bildbefund", kurzname: "Bildbefund am Bett", clock: "06:16", max: 8,
    titel: "Herr Kowalski nach dem Monitoralarm",
    banner: { name: "Werner Kowalski", sub: "82 J. · Zimmer 412 · Pneumonie, Exsikkose, Synkope in der Vorgeschichte", chips: [["Telemetrie-Alarm 06:12", "red"], ["schwerhörig re.", ""]] },
    intro: "06:16 Uhr. Die Monitorzentrale hat „Arrhythmie“ gemeldet, der Nachtdienst hält es für Artefakte. Du gehst sofort ans Bett. Herr Kowalski sagt: „Mir ist so schwummrig, und das Flattern ist wieder da.“ Bevor du misst, schaust du genau hin.",
    q: "Was fällt dir an Herrn Kowalski und in seiner Umgebung auf?",
    mood: "worried",
    art: kowScene(),
    spots: [
      { c: [[0, 0, 22]], t: "Blass und kaltschweißig", d: "Blässe und kalter Schweiß sind Zeichen einer Kreislaufbelastung. Zusammen mit Schwindel und „Flattern“ ist das ein Grund, sofort Vitalzeichen zu messen und ärztlich informieren zu lassen." },
      { c: [[209, 62, 34]], t: "Monitor: Herzfrequenz 128/min mit Alarm", d: "Den Alarm prüfst du am Menschen, nicht am Stationsstützpunkt. Wer Alarme als Artefakt abtut, ohne den Patienten gesehen zu haben, riskiert eine übersehene Verschlechterung (Alarmmüdigkeit). Die Deutung des EKGs ist ärztliche Aufgabe, deine Aufgabe ist Beobachten, Messen und Melden." },
      { c: [[58, 166, 12]], t: "Hörgerät liegt auf dem Nachttisch", d: "Ohne Hörgerät versteht er Fragen schlecht, nickt eher und kann Beschwerden nicht verlässlich mitteilen. Batterie prüfen und einsetzen, bevor du ihn befragst." },
      { c: [[130, 262, 16]], t: "Klingel liegt außer Reichweite auf dem Boden", d: "Bei Schwindel und Synkope in der Vorgeschichte muss die Klingel in Griffweite sein. Sonst steht er allein auf: Sturzgefahr." },
      { c: [[22, 150, 14], [44, 158, 10]], t: "Trinkflasche voll, Glas leer", d: "Er trinkt kaum, obwohl er mit Exsikkose aufgenommen wurde. Trinkmenge erfassen, Getränke anreichen, Vorlieben erfragen, Bilanz führen." },
      { c: [[300, 204, 16]], t: "Urinflasche mit dunklem, konzentriertem Urin", d: "Dunkler Urin passt zur Exsikkose. Menge messen, in die Bilanz übernehmen, beobachten." },
      { c: [[222, 258, 18], [256, 262, 16]], t: "Schlappen ohne Fersenhalt vor dem Bett", d: "Offene Hausschuhe sind eine Sturzfalle. Festes, geschlossenes Schuhwerk bereitstellen, beim Aufstehen begleiten." }
    ],
    extra: ["Bettgitter ohne Anordnung hochgezogen", "Sauerstoffbrille verrutscht", "Dekubitus an der Ferse", "Infusion paravasal"],
    cap: "Tipp: Gesicht, Monitor, Nachttisch, Boden, Bettseite.",
    folge: {
      text: "Die Ärztin vermutet eine neue Herzrhythmusstörung. Welche Beobachtung ergänzt du für die nächsten Stunden besonders?",
      opts: [
        { t: "Neurologische Beobachtung (z. B. BE-FAST): Gesicht, Arme, Sprache, Sehen, Gleichgewicht", ok: true, fb: "Richtig. Bei einer Rhythmusstörung können sich Gerinnsel bilden, das Schlaganfallrisiko steigt. Neue Ausfälle meldest du sofort." },
        { t: "Stündliche Temperaturmessung wegen der Pneumonie", ok: false, fb: "Fieber bleibt wichtig, erklärt aber nicht die neue Gefahr." },
        { t: "Blutzucker alle 30 Minuten", ok: false, fb: "Nicht begründet. Der Blutzucker wird nach Schema gemessen." },
        { t: "Bis zur Visite keine weitere Beobachtung, die Ärztin ist ja informiert", ok: false, fb: "Die Beobachtung bleibt Aufgabe der Pflege, auch nach der Meldung." }
      ]
    },
    merke: "Ein Alarm ist ein Grund, zum Menschen zu gehen. Deine Aufgabe ist beobachten, messen, einschätzen und strukturiert melden."
  };
  /* Kopf-Position des Patienten nach dem Zeichnen übernehmen */
  if (X._pt) kowbild.spots[0].c = [[Math.round(X._pt.hx), Math.round(X._pt.hy), 24]];

  var kowvit = {
    k: "kowvit", typ: "vitmed", pat: "A", t: "Herr Kowalski · Vitalzeichen", kurzname: "Vitalzeichen und Einschätzung", clock: "06:20", max: 8, wVit: 1,
    titel: "Vitalzeichen erheben und einschätzen",
    banner: { name: "Werner Kowalski", sub: "82 J. · Zimmer 412 · Pneumonie, Exsikkose", chips: [["Synkope in der Vorgeschichte", "red"], ["schwerhörig re.", ""]] },
    intro: "Du hast das Hörgerät eingesetzt und die Klingel in seine Hand gelegt. Jetzt misst du die Vitalzeichen selbst, mit Blick auf den Menschen und nicht nur auf den Monitor.",
    vit: {
      auftrag: "Erhebe alle Vitalzeichen. Tippe auf ein Messgerät und wähle die richtige Technik.",
      items: [
        { k: "rr", t: "Blutdruck", kurz: "RR", val: "108/64", einheit: "mmHg", wie: "messen", q: { text: "Wie misst du den Blutdruck bei Herrn Kowalski?", opts: [
          { t: "Manschette passend zum Oberarmumfang, Arm auf Herzhöhe, im Liegen messen und mit dem Vorwert vergleichen", ok: true, fb: "Richtig. Eine falsche Manschettengröße oder ein hängender Arm verfälschen den Wert." },
          { t: "Am Arm mit dem Monitorkabel, egal wie er liegt, Hauptsache schnell", fb: "Die Lage des Arms beeinflusst den Wert deutlich." },
          { t: "Im Stehen, um gleich den Kreislauf zu testen", fb: "Bei Schwindel und Synkope in der Vorgeschichte nicht: Sturzgefahr." }] } },
        { k: "puls", t: "Puls", kurz: "Puls", val: "104", einheit: "/min, unregelmäßig", farbe: "puls", wie: "tasten", q: { text: "Der Monitor zeigt 128/min. Wie erhebst du den Puls?", opts: [
          { t: "Radialispuls eine volle Minute tasten, Rhythmus und Qualität beurteilen und mit der Monitorfrequenz vergleichen", ok: true, fb: "Richtig. Bei unregelmäßigem Puls sind 15 oder 30 Sekunden zu ungenau. Du tastest 104/min, der Monitor zählt 128/min: Ein Pulsdefizit ist ein wichtiger Befund, den du meldest." },
          { t: "15 Sekunden tasten und mal vier nehmen", fb: "Bei unregelmäßigem Rhythmus führt das zu falschen Werten." },
          { t: "Den Monitorwert übernehmen, der ist genauer", fb: "Der Monitor zählt elektrische Aktionen, du tastest die wirksamen Pulswellen. Beides gehört in die Beobachtung." }] } },
        { k: "af", t: "Atmung", kurz: "AF", val: "22", einheit: "/min", ico: "af", wie: "zählen", q: { text: "Wie zählst du die Atemfrequenz?", opts: [
          { t: "Unauffällig eine Minute zählen, z. B. während du noch den Puls tastest, und Atemtiefe und Geräusche beobachten", ok: true, fb: "Richtig. Wer merkt, dass seine Atmung gezählt wird, atmet anders." },
          { t: "Ihn bitten, normal zu atmen, und 10 Sekunden zählen", fb: "Zu kurz und nicht unauffällig." },
          { t: "Vom Monitor ablesen", fb: "Die Impedanz-Atemfrequenz ist bei Bewegung unzuverlässig." }] } },
        { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "92", einheit: "%", wie: "Clip" },
        { k: "temp", t: "Temperatur", kurz: "Temp", val: "37,6", einheit: "°C", wie: "messen" },
        { k: "bew", t: "Bewusstsein", kurz: "ACVPU", val: "wach", einheit: "orientiert", ico: "bew", wie: "ansprechen" }
      ],
      befund: "06:22 Uhr: RR 108/64 mmHg (gestern 124/72) · Puls 104/min unregelmäßig, Monitor 128/min · AF 22/min · SpO₂ 92 % bei Raumluft · Temp 37,6 °C · wach, orientiert, „schwummrig“, kein Brustschmerz, keine Atemnot in Ruhe.",
      news: { wert: 7, tol: 1, frage: "Berechne den NEWS2-Score (für die Herzfrequenz zählt die höhere gemessene Frequenz von 128/min).", erk: "AF 22 = 2, SpO₂ 92 % = 2, RR 108 = 1, HF 128 = 2, Temperatur und Bewusstsein = 0. Gesamt 7: hohes Risiko, sofortige ärztliche Beurteilung." },
      act: {
        text: "NEWS2 7, Schwindel, unregelmäßiger Puls mit Pulsdefizit. Was tust du jetzt?",
        opts: [
          { t: "Bei ihm bleiben, Bettruhe sichern, über die Klingel Hilfe holen und die Ärztin sofort nach SBAR informieren lassen; Vitalzeichen engmaschig weiter", ok: true, fb: "Richtig. Ein Score ab 7 heißt: sofortige ärztliche Beurteilung, die Pflegefachperson ist eingebunden und du bleibst am Patienten." },
          { t: "Die Elektroden neu kleben und den Alarm bis zur Visite leiser stellen", fb: "Kritisch: Alarme stumm schalten und Befunde ignorieren gefährdet ihn." },
          { t: "Die Bisoprolol-Dosis von 08 Uhr jetzt schon geben, weil der Puls hoch ist", fb: "Das ist eine ärztliche Entscheidung und bei RR 108 zusätzlich riskant." },
          { t: "Ihn zum Kreislauftraining an die Bettkante setzen", fb: "Bei Schwindel und Rhythmusstörung erhöht das die Sturzgefahr." }
        ]
      }
    },
    merke: "Puls bei Unregelmäßigkeit immer eine volle Minute tasten. Ein Unterschied zwischen getastetem Puls und Monitorfrequenz ist ein Befund."
  };

  /* ---------- Blasenkatheter bei Frau Wiese ---------- */
  var wie = P.C.av;
  function handsRub(drops) { return X.handsRub(drops); }
  function trayItems(n, an) {
    var s = X.tray(24, 46, 352, 176, "#e2e8f0");
    var items = [
      function () { return X.r(44, 64, 120, 44, 6, "#ffffff", 1.8) + X.r(44, 64, 120, 12, 6, "#22c55e", 0) + X.t(104, 96, "Katheterset steril", { s: 9.5 }); },
      function () { return X.p("M52 140c30-24 60 20 90 0s50-18 70 0", "none", 0, ' stroke="#1d1d1f" stroke-width="7" stroke-linecap="round"') + X.p("M52 140c30-24 60 20 90 0s50-18 70 0", "none", 0, ' stroke="#e0f2fe" stroke-width="4" stroke-linecap="round"') + X.t(132, 170, "Vollsilikon Ch 12 · latexfrei", { s: 9.5, c: "#15803d" }); },
      function () { return X.r(184, 66, 70, 46, 6, "#ffffff", 1.8) + X.t(219, 86, "sterile", { s: 9 }) + X.t(219, 99, "Handschuhe", { s: 9 }) + X.t(219, 108, "latexfrei", { s: 7.5, c: "#15803d" }); },
      function () { return X.syringe(268, 94, 66, 0, 0.8, "Aqua 10 ml"); },
      function () { return X.r(268, 130, 26, 44, 6, "#fef3c7", 1.8) + X.r(274, 122, 14, 10, 2, "#94a3b8", 1.4) + X.t(281, 188, "Antiseptikum", { s: 8 }); },
      function () { return X.urineBag(340, 168, "#f1f5f9", 0) + X.t(340, 196, "geschl. System", { s: 8 }); }
    ];
    for (var i = 0; i < Math.min(n, items.length); i++) s += an && i === n - 1 ? '<g class="pa-in">' + items[i]() + "</g>" : items[i]();
    return s;
  }
  function field(o) {
    o = o || {};
    var s = '<rect width="400" height="280" fill="#dbe8f3"/>' + X.r(-10, 0, 420, 280, 0, "#eaf2f9", 0);
    for (var i = 0; i < 8; i++) s += X.l(0, 20 + i * 36, 400, 20 + i * 36, "#dde8f2", 1.2);
    /* Lochtuch */
    var skinA = X.p("M40 250C40 170 70 120 130 112C190 120 220 170 220 250", "#f0c7a5", 2) + X.p("M130 112v6", "none", 0) + X.e(130, 146, 26, 18, "#e9b996", 0) + X.p("M114 140q16-10 32 0M114 152q16 10 32 0", "none", 0, ' stroke="#c98f6b" stroke-width="2"') + X.c(130, 144, 2, "#b45f4a", 0);
    s += X.r(20, 20, 250, 70, 12, "#dbe7f3", 2) + X.p("M30 56q110 24 230 0", "none", 0, ' stroke="#b8c9dc" stroke-width="2"');
    s += (o.drape ? skinA + '<g class="' + (o.drapeNew ? "pa-down" : "") + '">' + '<path d="M20 40H270V240H20Z M130 112a48 34 0 1 0 0.1 0Z" fill="#7fd1bf" fill-rule="evenodd" stroke="#1d1d1f" stroke-width="2"/>' + X.e(130, 146, 48, 34, "none", 2) + X.p("M20 60h250M20 220h250", "none", 0, ' stroke="#62bfa9" stroke-width="1.4"') + "</g>" : skinA);
    if (o.wash) s += X.e(232, 120, 30, 14, "#e2e8f0", 2) + X.e(232, 116, 24, 8, "#bae6fd", 0) + X.r(214, 150, 36, 22, 4, "#ffffff", 1.6);
    /* steriles Tablett */
    s += X.r(282, 34, 108, 214, 8, "#7fd1bf", 2) + X.r(290, 42, 92, 198, 6, "#a5e3d6", 0);
    if (!o.swabsUsed) s += [0, 1, 2, 3, 4].map(function (j) { return X.swab(304 + (j % 3) * 22, 64 + Math.floor(j / 3) * 18, "#fff7d6"); }).join("");
    else s += [0, 1].map(function (j) { return X.swab(304 + j * 22, 64, "#fff7d6"); }).join("");
    if (!o.cathIn) s += X.p("M300 140c20-30 40 30 62 0s20 40-10 60", "none", 0, ' stroke="#1d1d1f" stroke-width="7" stroke-linecap="round"') + X.p("M300 140c20-30 40 30 62 0s20 40-10 60", "none", 0, ' stroke="#e0f2fe" stroke-width="4" stroke-linecap="round"');
    s += X.r(300, 96, 70, 16, 4, "#ffffff", 1.6) + X.t(335, 108, "Gleitmittel", { s: 8 });
    if (!o.blocked) s += X.syringe(306, 222, 52, 0, 0.8, "Aqua");
    /* Katheter eingeführt + Urinfluss */
    if (o.cathIn) {
      var d = "M134 146C170 156 210 176 250 204S300 250 330 266";
      s += '<g class="' + (o.cathNew ? "pa-fade" : "") + '">' + X.tube(d, "#e0f2fe", 4) + (o.urine ? X.p(d, "none", 0, ' class="pa-flow" stroke="#facc15" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"') : "") + "</g>";
      if (o.urine) s += X.tag(214, 120, "Urin fließt", "ok");
    }
    if (o.blocked) s += '<g class="pa-in">' + X.syringe(212, 196, 46, 34, 0.1, "Aqua") + X.c(132, 146, 9, "none", 0, ' stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="3 3"') + "</g>" + X.tag(150, 104, "Block 10 ml", "");
    /* Hände */
    if (o.hands) s += X.glove(o.hx || 190, o.hy || 196, o.hr || -30, o.sterile ? "#e9f5ff" : "#bfdbfe", 1);
    if (o.hands2) s += X.glove(80, 196, 30, o.sterile ? "#e9f5ff" : "#bfdbfe", 1);
    return s;
  }
  function wieBed(o) {
    o = o || {};
    var s = X.defs() + X.room({ disp: 196, railX: 12, railW: 150, winX: 262 }) + X.bed({ pose: "semi", x: 72, len: 270 }) + X.patient(wie, { mood: o.mood || "worried", legs: o.knee ? "knee" : "flat", blanket: o.knee ? "#e9eef5" : "#d6ecdc" });
    /* Arm in der Schlinge (Gilchrist) */
    s += X.r(X._pt.nx + 8, X._pt.ny + 26, 30, 18, 8, "#ffffff", 2) + X.l(X._pt.nx + 4, X._pt.ny + 4, X._pt.nx + 30, X._pt.ny + 30, "#94a3b8", 3);
    if (o.screen) s += '<g class="' + (o.screenNew ? "pa-slide" : "") + '">' + X.p("M346 40v204M346 40h40v204", "none", 0, ' stroke="#94a3b8" stroke-width="3"') + X.p("M350 44q18 10 34 0v196q-18 8-34 0z", "#cfe0f2", 1.8) + "</g>";
    if (o.knee) s += X.r(170, 228, 150, 6, 3, "#ffffff", 1.6) + X.tag(250, 62, "Rückenlage · Beine angewinkelt", "");
    return s + X.vignette();
  }
  function kurve(n) {
    var s = X.defs() + '<rect width="400" height="280" fill="#eef3f8"/>' + X.clipboard(36, 34, 186, 220, "Kurve · Frau Wiese", ["*12.05.1947 · Zimmer 415", "AO 05:45 Dr. Özdemir:", "transurethraler DK", "Bladder-Scan 640 ml", "Allergien: keine bekannt"], { mark: n >= 2 ? 4 : n >= 1 ? 2 : null });
    s += X.g(X.r(0, 0, 130, 30, 15, "#ffffff", 2) + X.c(16, 15, 7, "#0062ff", 0) + X.t(74, 19, "Wiese, Hannelore", { s: 9.5 }), "translate(246,70)");
    if (n >= 1) s += X.check(372, 84);
    if (n >= 2) s += '<g class="pa-pop">' + X.r(240, 128, 146, 44, 12, "#fee2e2", 2) + X.t(313, 147, "Latexallergie!", { s: 12, w: 800, c: "#b91c1c" }) + X.t(313, 162, "Quaddeln · in Akte ergänzen", { s: 8.5, c: "#b91c1c" }) + "</g>";
    return s;
  }
  function doku() {
    return X.defs() + '<rect width="400" height="280" fill="#eef3f8"/>' + X.clipboard(70, 26, 260, 230, "Pflegebericht 06:58", ["DK Vollsilikon Ch 12, Charge notiert", "Block 10 ml Aqua dest. lt. Hersteller", "Urin 640 ml klar, hellgelb", "Pat. beschwerdefrei, Druck weg", "Latexallergie in Akte ergänzt", "Durchführung: Name, Handzeichen"], { mark: 4 }) + X.check(312, 236);
  }
  var steps = [
    { t: "Identität und Anordnung prüfen", ic: "id", ph: "vor", fb: "Name und Geburtsdatum aktiv erfragt, mit Armband und Anordnung verglichen: transurethraler DK, Dr. Özdemir 05:45 Uhr." },
    { t: "Nach Allergien fragen", ic: "help", ph: "vor", fb: "Gut gefragt: Latexallergie, die nicht in der Akte steht. Du nimmst nur latexfreies Material und ergänzt die Akte.", say: "Gummi vertrage ich gar nicht, da bekomme ich Quaddeln. Haben die das nicht aufgeschrieben?" },
    { t: "Ablauf erklären, Einverständnis einholen", ic: "talk", ph: "vor", fb: "Sie weiß, was passiert, und hat zugestimmt. Ihr Schamgefühl nimmst du ernst.", say: "Wenn der Druck dann weg ist, bin ich einverstanden. Machen Sie es bitte vorsichtig." },
    { t: "Sichtschutz, Tür schließen", ic: "screen", ph: "vor", fb: "Intimsphäre geschützt, bevor die Decke zurückgeschlagen wird." },
    { t: "Material latexfrei richten", ic: "tray", ph: "vor", fb: "Steriles Set, Vollsilikon-Katheter Ch 12, latexfreie sterile Handschuhe, Aqua dest. 10 ml, Schleimhautantiseptikum, geschlossenes Ableitungssystem." },
    { t: "Lagern: Rückenlage, Beine angewinkelt", ic: "bed", ph: "vor", fb: "Rückenlage, Beine angewinkelt und leicht gespreizt, wasserdichte Unterlage, der verletzte Arm mit Kissen gestützt." },
    { t: "Hände desinfizieren", ic: "hand", ph: "durch", fb: "Hygienische Händedesinfektion, 30 Sekunden, alle Flächen benetzt." },
    { t: "Intimpflege mit unsterilen Handschuhen", ic: "glove", ph: "durch", fb: "Grobe Reinigung vor der Desinfektion, danach Handschuhe ab." },
    { t: "Steriles Set öffnen, sterile Handschuhe anziehen", ic: "sterile", ph: "durch", fb: "Set auf der desinfizierten Fläche geöffnet, Handschuhe ohne Berührung der Außenseite angezogen." },
    { t: "Lochtuch auflegen", ic: "drape", ph: "durch", fb: "Das Lochtuch schafft ein steriles Arbeitsfeld." },
    { t: "Schleimhaut desinfizieren: von vorn nach hinten", ic: "swab", ph: "durch", fb: "Mit der nicht dominanten Hand die Labien spreizen, die bleibt unsteril. Je Tupfer ein Wisch von der Symphyse Richtung Anus, Einwirkzeit beachten." },
    { t: "Katheter einführen, bis Urin fließt", ic: "cath", ph: "durch", fb: "Mit sterilem Gleitmittel, ohne Kraft. Sobald Urin fließt, noch 2 bis 3 cm weiter." },
    { t: "Ballon mit 10 ml Aqua dest. blocken", ic: "syringe", ph: "durch", fb: "Erst blocken, wenn Urin fließt, und nur mit sterilem Aqua dest. in der Menge des Herstellers." },
    { t: "Ableitungsbeutel unter Blasenniveau anbringen", ic: "bag", ph: "nach", fb: "Ohne Bodenkontakt, ohne Knick, unter Blasenniveau: So kann nichts zurücklaufen." },
    { t: "Material entsorgen, Hände desinfizieren", ic: "trash", ph: "nach", fb: "Abwurf, Handschuhe aus, Händedesinfektion." },
    { t: "Dokumentieren mit Charge und Urinmenge", ic: "doc", ph: "nach", fb: "Katheterart und Größe, Charge, Blockung, Urinmenge und Aussehen, Befinden, Latexallergie in der Akte ergänzt." }
  ];
  var dkSim = {
    k: "c", typ: "steps", pat: "C", t: "Frau Wiese · Blasenkatheter", kurzname: "Blasenkatheter als Simulation", clock: "06:50", max: 14, kurz: "Blasenkatheter",
    titel: "Transurethraler Dauerkatheter bei Frau Wiese", ic: "cath", mood: "worried",
    banner: { name: "Hannelore Wiese", sub: "79 J. · Zimmer 415 · Harnverhalt, Bladder-Scan 640 ml", chips: [["Allergie erfragen", "red"], ["Diabetes Typ 2", ""], ["Arm li. im Gilchrist", ""]] },
    intro: "06:50 Uhr. Dr. Özdemir hat den Dauerkatheter angeordnet, Jana Kemper begleitet dich. Frau Wiese hält sich den Unterbauch: „Es drückt so, und es kommt einfach nichts.“",
    ko: ["Latexhaltiges Material bei bekannter Latexallergie", "Desinfektion von hinten nach vorn oder Berühren der sterilen Katheterspitze", "Blocken, bevor Urin fließt (Gefahr der Harnröhrenverletzung)", "Einen Katheter nach Fehllage oder Kontamination weiterverwenden"],
    steps: steps,
    wrong: [
      { t: "Latexkatheter aus dem Notfallfach nehmen", ic: "cath", ko: true, fb: "Kritisch: Bei Latexallergie droht eine allergische Reaktion bis zum Schock. Nur latexfreies Material." },
      { t: "Desinfektion von hinten nach vorn", ic: "swab", ko: true, fb: "Kritisch: So werden Darmkeime zur Harnröhre gewischt. Immer von vorn nach hinten." },
      { t: "Ballon schon vor dem Urinfluss blocken", ic: "syringe", ko: true, fb: "Kritisch: Liegt die Spitze noch in der Harnröhre, verletzt der Ballon die Schleimhaut." },
      { t: "Katheter nach Fehllage erneut verwenden", ic: "cath", ko: true, fb: "Kritisch: Der Katheter ist kontaminiert. Er bleibt als Orientierung liegen, du nimmst einen neuen." },
      { t: "Ballon mit Kochsalzlösung blocken", ic: "syringe", fb: "Kochsalz kann auskristallisieren, der Ballon lässt sich dann nicht mehr entblocken. Aqua dest. nach Herstellerangabe." },
      { t: "Beutel am Bettgitter über Blasenniveau", ic: "bag", fb: "Dann läuft Urin zurück in die Blase: Infektionsgefahr." },
      { t: "Ohne Sichtschutz beginnen, geht ja schnell", ic: "screen", fb: "Intimsphäre ist kein Zeitfaktor. Sichtschutz immer vorher." }
    ],
    scene: function (i) {
      if (i <= 2) return kurve(i);
      if (i === 3) return wieBed({ mood: "smile" });
      if (i === 4) return wieBed({ mood: "neutral", screen: 1, screenNew: 1 });
      if (i === 5) return X.defs() + '<rect width="400" height="280" fill="#eef3f8"/>' + trayItems(6, false) + X.tag(200, 252, "latexfrei · steril · geschlossenes System", "ok");
      if (i === 6) return wieBed({ mood: "neutral", screen: 1, knee: 1 });
      if (i === 7) return X.defs() + '<rect width="400" height="280" fill="#eef6fb"/>' + X.dispenser(184, 20) + handsRub(true) + X.tag(200, 262, "30 Sekunden · alle Flächen", "");
      if (i === 8) return X.defs() + field({ hands: 1, wash: 1 }) + X.tag(130, 24, "Intimpflege · unsterile Handschuhe", "");
      if (i === 9) return X.defs() + field({ hands: 1, hands2: 1, sterile: 1 }) + X.tag(140, 24, "steril angezogen", "ok");
      if (i === 10) return X.defs() + field({ drape: 1, drapeNew: 1, hands: 1, sterile: 1 });
      if (i === 11) return X.defs() + field({ drape: 1, swabsUsed: 1, hands: 1, hx: 150, hy: 176, hr: -10, sterile: 1 }) + X.arrow("M130 112v50") + X.tag(200, 24, "je Tupfer ein Wisch · vorn → hinten", "");
      if (i === 12) return X.defs() + field({ drape: 1, swabsUsed: 1, cathIn: 1, cathNew: 1, urine: 1, sterile: 1 });
      if (i === 13) return X.defs() + field({ drape: 1, swabsUsed: 1, cathIn: 1, urine: 1, blocked: 1, sterile: 1 });
      if (i === 14) return wieBed({ mood: "happy", screen: 1 }) + '<g class="pa-in">' + X.tube("M300 200C310 220 312 236 318 242", "#fef9c3", 3) + X.urineBag(330, 262, "#fde68a", 0.6) + "</g>" + X.tag(250, 56, "unter Blasenniveau · kein Bodenkontakt", "ok");
      if (i === 15) return wieBed({ mood: "happy" }) + X.urineBag(330, 262, "#fde68a", 0.8) + X.trash(40, 262) + X.tag(200, 56, "Abwurf · Hände desinfizieren", "");
      return doku();
    },
    status: function (i) { return ["Anordnung prüfen", "Allergien klären", "Information", "Intimsphäre", "Material", "Lagerung", "Händedesinfektion", "Intimpflege", "steril vorbereiten", "Lochtuch", "Desinfektion", "Katheter einführen", "Blocken", "Ableitung", "Nachbereitung", "Dokumentation"][i] || ""; },
    statusEnd: "640 ml Urin, beschwerdefrei",
    merke: "Asepsis beginnt bei der Allergiefrage. Ein kontaminierter Katheter wird nie weiterverwendet, geblockt wird erst bei Urinfluss."
  };

  /* ---------- Live-Abschnitte neu ordnen ---------- */
  var old = C.live, med = old.filter(function (l) { return l.k === "am"; })[0], tree = old.filter(function (l) { return l.k === "b"; })[0];
  if (med) { med.t = "Herr Kowalski · Medikamente"; med.clock = "07:45"; try { med.med.fehlt.opts[0].fb = "Die Kurzinfusion hängt die Pflegefachperson an. Du denkst daran, dass sie pünktlich um 08 Uhr läuft, und beobachtest Herrn Kowalski danach."; } catch (e) {} }
  C.live = [kowbild, kowvit, dkSim, med, tree].filter(Boolean);
  C.kurz = "Ein Monitoralarm, der als Artefakt abgetan wird, eine Patientin, die nicht mehr aufstehen will, und ein akuter Harnverhalt bei Latexallergie. Dazu ein Sturz im Nachbarzimmer.";
  C.prio = C.prio.map(function (x) { return x.id === "ab" ? Object.assign({}, x, { t: "Herr Kowalski: Medikamente prüfen und verteilen, Antibiose 08 Uhr durch die Pflegefachperson vorbereiten lassen", warum: "Fester Zeitpunkt. Die Kurzinfusion verabreicht die Pflegefachperson; du prüfst die Tabletten und beobachtest." }) : x; });
})();
