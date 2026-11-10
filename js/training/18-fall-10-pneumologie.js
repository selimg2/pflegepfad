/* ===== Fall 10: Pneumologie (Absaugen über Trachealkanüle, COPD-Exazerbation) ===== */
(function () {
  var X = window.PXB, L = X && X.L9;
  if (!X || !L) return;
  var KRA = { hair: "HL", hairC: "#a9adb3", skin: "#f0c7a5", cloth: "#b7cdb8", deco: "gown", dot: "#6f9a72", bg: "#e7f4e4", wrinkles: 1, stubble: true };
  var WIN = { hair: "UF", hairC: "#d3d5d8", skin: "#eed3c0", cloth: "#bcd3ec", deco: "gown", dot: "#7ea6d3", bg: "#ddeeff", wrinkles: 1 };

  /* ---------- Absaugen bei Herrn Krause ---------- */
  function cannula(pt) { return pt ? X.g(X.r(-12, -4, 24, 8, 4, "#eef6ff", 1.6) + X.c(0, 0, 3.4, "#0f172a", 1.2), "translate(" + Math.round(pt.nx) + "," + Math.round(pt.ny + 16) + ")") : ""; }
  function psa(n) {
    var s = X.tray(40, 70, 320, 150, "#e2e8f0");
    var it = [
      function () { return X.p("M72 100h56l10 30-12 4v62H74v-62l-12-4z", "#fde68a", 1.8) + X.t(100, 214, "Schutzkittel", { s: 8.5 }); },
      function () { return X.r(160, 118, 64, 36, 10, "#bfdbfe", 1.8) + X.p("M160 126q-14 4-14 14t14 10M224 126q14 4 14 14t-14 10", "none", 1.6) + X.p("M168 130h48M168 140h48", "none", 0, ' stroke="#93c5fd" stroke-width="1.6"') + X.t(192, 214, "Mund-Nasen-Schutz", { s: 8.5 }); },
      function () { return X.p("M256 128q0-12 14-12h44q14 0 14 12v8q0 14-14 14h-12l-8-8-8 8h-16q-14 0-14-14z", "#e0f2fe", 1.8) + X.p("M262 124h60", "none", 0, ' stroke="#ffffff" stroke-width="3" opacity=".8"') + X.t(292, 214, "Schutzbrille", { s: 8.5 }); }
    ];
    for (var i = 0; i < Math.min(n, 3); i++) s += '<g class="' + (i === n - 1 ? "pa-in" : "") + '">' + it[i]() + "</g>";
    return s;
  }
  function suckScene(i) {
    if (i === 0) return L.bg() + X.clipboard(40, 34, 210, 200, "Kurve · Herr Krause", ["Trachealkanüle Gr. 8, Cuff entblockt", "AO: endotracheal absaugen b. Bed.", "06:40 SpO₂ 88 %, rasselnd", "Husten ineffektiv", "Allergien: keine bekannt"], { mark: 2 }) + L.label(318, 110, "Rasseln hörbar", { c: "#a16207", bg: "#fef3c7" });
    if (i === 1) return X.bedScene(KRA, { pose: "semi", mood: "worried", legs: "flat", post: cannula, tag: [210, 28, "Ablauf erklären · Ja/Nein-Zeichen", "ok"] });
    if (i === 2) return L.bg() + psa(3) + X.tag(200, 40, "Kittel · Mundschutz · Schutzbrille", "ok");
    if (i === 3) return L.bg() + L.suction(110, 60, { on: true, lvl: 0.1 }) + X.r(230, 92, 40, 72, 8, "#f0f9ff", 1.8) + X.r(238, 84, 24, 10, 3, "#cbd5e1", 1.4) + X.t(250, 132, "Aqua", { s: 8, w: 800, c: "#0369a1" }) + X.r(290, 104, 70, 46, 6, "#ffffff", 1.6) + X.t(325, 124, "Katheter", { s: 8.5 }) + X.t(325, 138, "CH 12 steril", { s: 7.5, c: "#15803d" }) + X.tag(200, 220, "Sog −0,2 bar · Spülwasser · steriler Katheter", "ok");
    if (i === 4) return X.bedScene(KRA, { pose: "high", mood: "neutral", legs: "flat", post: cannula, monitor: { x: 168, v: { hf: "102", spo2: "88", rr: "142/84" } }, tag: [200, 196, "Oberkörper hoch · Sättigung im Blick", "ok"] });
    if (i === 5) return L.neck({ dirty: true }) + L.suction(304, 22, { on: true, lvl: 0.1 }) + '<g class="pa-in">' + L.catheter("M278 70C300 60 320 50 330 46") + X.glove(276, 80, -30, "#e0e7ff", 0.8) + "</g>" + X.tag(110, 250, "steriler Handschuh · Katheter steril lassen", "ok");
    if (i === 6) return L.neck({ dirty: true }) + L.suction(304, 22, { on: false, lvl: 0.1 }) + '<g class="pa-down">' + L.catheter("M200 112C206 80 260 56 330 46") + "</g>" + X.tag(110, 250, "ohne Sog einführen", "ok");
    if (i === 7) return L.neck({ dirty: true, sputum: true }) + L.suction(304, 22, { on: true, lvl: 0.35 }) + L.catheter("M200 112C206 80 260 56 330 46", { flow: true }) + '<g transform="translate(64,62)">' + X.c(0, 0, 24, "#ffffff", 2) + '<circle cx="0" cy="0" r="18" fill="none" stroke="#f59e0b" stroke-width="5" stroke-dasharray="113" class="pa-timer" transform="rotate(-90)"/>' + X.t(0, 4, "10 s", { s: 11, w: 800 }) + "</g>" + X.tag(130, 250, "unter Sog drehend zurückziehen", "ok");
    if (i === 8) return X.bedScene(KRA, { pose: "high", mood: "neutral", legs: "flat", post: cannula, monitor: { x: 168, v: { hf: "94", spo2: "94", rr: "138/82" } }, tag: [200, 196, "SpO₂ 94 % · Atmung ruhiger · Pause", "ok"] });
    if (i === 9) return L.bg() + L.suction(110, 60, { on: true, lvl: 0.4 }) + X.r(230, 92, 40, 72, 8, "#f0f9ff", 1.8) + X.r(232, 120, 36, 42, 6, "#e0f2fe", 0) + '<g class="pa-flow">' + L.catheter("M250 100C250 70 200 60 180 66") + "</g>" + L.sharps(330, 220) + X.tag(200, 248, "Katheter verwerfen · Schlauch mit Aqua spülen", "ok");
    if (i === 10) return L.neck({ hme: true }) + X.tag(200, 250, "Feuchte Nase aufgesetzt · Kanüle frei", "ok");
    return L.bg() + X.clipboard(60, 26, 280, 230, "Pflegebericht 06:58", ["06:44 endotracheal abgesaugt (2 Gänge)", "Sekret: reichlich, zäh, gelblich", "SpO₂ vorher 88 %, nachher 94 %", "HF 102 → 94/min, kein Blut", "Feuchte Nase neu, Kanüle o. B.", "Pat. erschöpft, Lagerung OK 45°, HZ"], { mark: 1 }) + X.check(318, 236);
  }
  var absaug = {
    k: "absaugen", typ: "steps", pat: "A", t: "Herr Krause · Absaugen", kurzname: "Endotracheales Absaugen als Simulation", clock: "06:42", max: 13, kurz: "Absaugen",
    titel: "Endotracheales Absaugen über die Trachealkanüle", ic: "af", mood: "worried",
    banner: { name: "Bernd Krause", sub: "66 J. · Zimmer 820 · Trachealkanüle nach Langzeitbeatmung, Cuff entblockt", chips: [["SpO₂ 88 %, rasselnd", "red"], ["spricht nur mit Sprechventil", ""]] },
    intro: "06:42 Uhr. Herr Krause klopft an das Bettgitter. Du hörst ein lautes Rasseln, er hustet, bekommt das Sekret aber nicht heraus. SpO₂ 88 %. Absaugen bei Bedarf ist angeordnet, du hast es mit deiner Praxisanleiterin schon oft gemacht.",
    ko: ["Unter Sog einführen", "Länger als 15 Sekunden am Stück absaugen", "Einen Katheter erneut verwenden oder erst Mund, dann Kanüle absaugen", "Ohne Schutzbrille und Mundschutz absaugen"],
    steps: [
      { t: "Indikation und Anordnung prüfen", ic: "doc", ph: "vor", fb: "Rasseln, ineffektiver Husten, SpO₂ 88 %: Absaugen ist angezeigt. Abgesaugt wird bei Bedarf, nicht nach der Uhr." },
      { t: "Ablauf erklären, Zeichen vereinbaren", ic: "talk", ph: "vor", fb: "Er kann nicht sprechen. Ihr vereinbart: Hand heben heißt Pause.", say: "(nickt und hebt zur Probe die Hand)" },
      { t: "Schutzkleidung anlegen", ic: "glove", ph: "vor", fb: "Beim Husten wird Sekret verspritzt: Kittel, Mund-Nasen-Schutz und Schutzbrille schützen dich." },
      { t: "Absauggerät prüfen, Material richten", ic: "tray", ph: "vor", fb: "Sog etwa −0,2 bar, Spülwasser, steriler Absaugkatheter passender Größe (höchstens halber Innendurchmesser der Kanüle)." },
      { t: "Oberkörper hoch, Sättigung im Blick", ic: "bed", ph: "vor", fb: "Erhöhter Oberkörper erleichtert das Abhusten. Bei niedriger Sättigung vorher Sauerstoff nach Anordnung erhöhen." },
      { t: "Steriler Handschuh, Katheter steril anschließen", ic: "sterile", ph: "durch", fb: "Händedesinfektion, steriler Handschuh an der führenden Hand. Der Katheter berührt nichts außer der Kanüle." },
      { t: "Ohne Sog einführen", ic: "cath", ph: "durch", fb: "Fingertipp offen, damit kein Sog wirkt. Einführen bis zu leichtem Widerstand oder Hustenreiz, dann etwa 1 cm zurück." },
      { t: "Unter Sog drehend zurückziehen", ic: "clock", ph: "durch", fb: "Fingertipp verschließen und den Katheter drehend herausziehen. Höchstens 10 bis 15 Sekunden, sonst sinkt die Sättigung." },
      { t: "Beobachten, Pause, ggf. wiederholen", ic: "eye", ph: "nach", fb: "Sättigung, Herzfrequenz, Hautfarbe, Sekret. Vor einem zweiten Gang erholen lassen, frischer Katheter.", say: "(zeigt den Daumen hoch, atmet ruhiger)" },
      { t: "Katheter verwerfen, System spülen", ic: "trash", ph: "nach", fb: "Katheter mit dem Handschuh umschlossen abwerfen, Schlauch mit Wasser durchspülen, Gerät aus." },
      { t: "Kanüle kontrollieren, feuchte Nase aufsetzen", ic: "check", ph: "nach", fb: "Kanüle sitzt, Band nicht zu eng (ein Finger passt darunter), Schlitzkompresse trocken, Feuchte Nase aufgesetzt. Notfallset am Bett vollständig." },
      { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Uhrzeit, Anzahl der Gänge, Menge, Farbe und Konsistenz des Sekrets, Werte vorher und nachher, Reaktion." }
    ],
    wrong: [
      { t: "Mit eingeschaltetem Sog einführen", ic: "cath", ko: true, fb: "Kritisch: Der Sog verletzt die Schleimhaut und saugt Luft ab." },
      { t: "So lange absaugen, bis alles draußen ist", ic: "clock", ko: true, fb: "Kritisch: Mehr als 15 Sekunden führen zu Sauerstoffmangel und Herzrhythmusstörungen." },
      { t: "Erst den Mund absaugen, dann mit demselben Katheter die Kanüle", ic: "swab", ko: true, fb: "Kritisch: Keime aus dem Mund kommen so in die Lunge." },
      { t: "Sog auf −0,6 bar stellen, damit es schneller geht", ic: "af", fb: "Zu hoher Sog schädigt die Schleimhaut." },
      { t: "Schutzbrille weglassen, er hustet ja nicht stark", ic: "glove", fb: "Hustenstöße kommen plötzlich." },
      { t: "Kanülenband straff ziehen, damit nichts verrutscht", ic: "bandage", fb: "Ein Finger muss darunter passen, sonst drückt es auf Haut und Gefäße." }
    ],
    scene: suckScene,
    status: function (i) { return ["Indikation", "Aufklärung", "Schutz", "Material", "Lagerung", "Steril", "Einführen", "Absaugen", "Beobachten", "Spülen", "Kanüle", "Doku"][i] || ""; },
    statusEnd: "Atemwege frei, SpO₂ 94 %",
    merke: "Ohne Sog rein, mit Sog drehend raus, höchstens 15 Sekunden. Jeder Gang mit neuem sterilen Katheter, Schutzbrille immer."
  };

  /* ---------- Bildbefund Frau Winkler, COPD ---------- */
  var win = Object.assign({}, WIN, { pale: 1 });
  function winScene() {
    var s = X.defs() + X.room({ disp: 198, railX: 12, railW: 170, winX: 262 });
    /* Sauerstoff-Flowmeter an der Wand mit 6 l/min */
    s += X.r(190, 70, 18, 10, 3, "#cbd5e1", 1.4) + X.r(186, 80, 26, 50, 8, "#f8fafc", 1.8) + X.r(191, 86, 16, 34, 5, "#e0f2fe", 1.2) + X.c(199, 94, 4.5, "#22c55e", 1.2) + L.label(240, 100, "6 l/min", { c: "#b91c1c", bg: "#fef2f2" });
    s += X.bed({ pose: "high", x: 72, len: 270 });
    s += X.patient(win, { mood: "tired", legs: "flat", blanket: "#d6e6f5" });
    /* Sauerstoffbrille und Schlauch zum Flowmeter */
    var nx = X._pt ? X._pt.nx : 130, ny = X._pt ? X._pt.ny : 120;
    s += X.p("M" + (nx - 6) + " " + (ny - 6) + "q10 4 18 0", "none", 0, ' stroke="#7dd3fc" stroke-width="2.4" stroke-linecap="round"') + X.p("M" + (nx + 10) + " " + (ny - 4) + "C" + (nx + 20) + " " + (ny + 30) + " 200 150 199 130", "none", 0, ' stroke="#bae6fd" stroke-width="2.4"');
    /* bläuliche Lippen */
    s += X.e(nx + 1, ny + 2, 3.6, 1.6, "#8ea5d8", 0, ' opacity=".85"');
    /* Nachttisch: Zigaretten und Feuerzeug, Spucknapf mit grünlichem Sputum */
    s += X.nightstand(6, { y: 176 });
    s += X.cigs(22, 166) + X.r(42, 160, 8, 14, 2, "#ef4444", 1.4) + X.r(43, 156, 6, 5, 1, "#94a3b8", 1);
    s += X.g(X.p("M-12 0h24l-3 14h-18z", "#ffffff", 1.8) + X.e(0, 2, 10, 3, "#a3b86a", 0), "translate(66,168)");
    /* Überbetttisch mit Dosieraerosol ohne Spacer, Spacer noch verpackt */
    s += X.overbed(228, 160, 96, X.r(244, 146, 12, 14, 3, "#3b82f6", 1.6) + X.r(246, 140, 8, 7, 2, "#e2e8f0", 1.2) + X.r(270, 140, 42, 20, 4, "#f1f5f9", 1.6, ' stroke-dasharray="3 2"') + X.t(291, 153, "Spacer", { s: 6.5, w: 800, c: "#64748b" }));
    /* leerer Becher */
    s += X.cup(306, 152, "#ffffff");
    s += X.vignette();
    return s;
  }
  var winBild = {
    k: "winbild", typ: "hotspot", pat: "B", t: "Frau Winkler · Bildbefund", kurzname: "Bildbefund bei COPD", clock: "07:20", max: 8,
    titel: "Frau Winkler wirkt müde",
    banner: { name: "Renate Winkler", sub: "74 J. · Zimmer 822 · akute Verschlechterung einer COPD, Pneumonie", chips: [["Zielsättigung laut AO 88 bis 92 %", "warn"], ["Allergie: Penicillin", "red"]] },
    intro: "07:20 Uhr. Frau Winkler war in der Nacht unruhig. Jetzt schläft sie halb, sie reagiert erst, als du sie laut ansprichst. „Ach, Sie sind's. Ich bin so müde, der Kopf brummt.“",
    q: "Was fällt dir an Frau Winkler und in ihrer Umgebung auf?",
    mood: "tired",
    art: winScene(),
    spots: [
      { c: [[0, 0, 24]], t: "Schläfrig, Kopfschmerz, bläuliche Lippen", d: "Neue Schläfrigkeit und Kopfschmerz bei COPD unter Sauerstoff können Zeichen einer CO₂-Anreicherung sein (Hyperkapnie). Ärztin sofort informieren, Blutgasanalyse wird meist veranlasst." },
      { c: [[212, 100, 30]], t: "Sauerstoff läuft mit 6 l/min", d: "Angeordnet ist eine Zielsättigung von 88 bis 92 %. Zu viel Sauerstoff kann bei COPD den Atemantrieb dämpfen. Flussrate nach Anordnung anpassen, nicht eigenmächtig hochdrehen." },
      { c: [[30, 166, 18]], t: "Zigaretten und Feuerzeug neben dem Sauerstoff", d: "Brandgefahr: Sauerstoff fördert jede Flamme. Nicht rauchen mit Sauerstoff, Feuerzeug mit ihrem Einverständnis wegnehmen, Rauchstopp-Hilfe anbieten." },
      { c: [[262, 150, 26]], t: "Dosieraerosol ohne Spacer, Spacer noch verpackt", d: "Ohne Spacer landet bei schwacher Atmung viel Wirkstoff im Mund. Inhalationstechnik mit Spacer zeigen und üben lassen (Teach-back)." },
      { c: [[66, 170, 14]], t: "Grünlich-gelbes Sputum im Becher", d: "Hinweis auf bakterielle Infektion. Menge, Farbe und Konsistenz dokumentieren, ggf. Sputumprobe nach Anordnung." },
      { c: [[306, 148, 12]], t: "Becher leer, kaum getrunken", d: "Fieber und schnelle Atmung erhöhen den Flüssigkeitsbedarf, zähes Sekret wird dann noch zäher. Trinken anbieten, Bilanz nach Anordnung." }
    ],
    extra: ["Bettgitter ohne Anordnung", "Infusion läuft paravasal", "Dekubitus am Steiß sichtbar", "Klingel fehlt"],
    cap: "Tipp: Gesicht, Wand, Nachttisch, Tisch.",
    folge: {
      text: "SpO₂ 97 % mit 6 l/min, Frau Winkler ist schläfrig. Was ist jetzt richtig?",
      opts: [
        { t: "Ärztin sofort informieren (SBAR), Sauerstoff nach Anordnung auf die Zielsättigung 88 bis 92 % anpassen, Oberkörper hoch, bei ihr bleiben, Bewusstsein und Atmung engmaschig beobachten", ok: true, fb: "Richtig. Ziel ist die angeordnete Sättigung, nicht 100 %." },
        { t: "Sauerstoff ganz abstellen, damit sie wieder atmet", ok: false, fb: "Gefährlich: Ohne Sauerstoff kann die Sättigung abstürzen. Anpassen, nicht abstellen." },
        { t: "Sie schlafen lassen, sie war ja die ganze Nacht wach", ok: false, fb: "Neue Schläfrigkeit ist hier ein Warnzeichen." },
        { t: "Ein Beruhigungsmittel geben, damit sie die Nacht nachholt", ok: false, fb: "Beruhigungsmittel dämpfen die Atmung zusätzlich." }
      ]
    },
    merke: "Bei COPD gilt die angeordnete Zielsättigung. Neue Schläfrigkeit unter Sauerstoff ist ein Notfallzeichen, kein Erholungsschlaf."
  };
  if (X._pt) winBild.spots[0].c = [[Math.round(X._pt.hx), Math.round(X._pt.hy + 6), 24]];

  var winVit = {
    k: "winvit", typ: "vitmed", pat: "B", t: "Frau Winkler · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Medikamente", clock: "07:25", max: 10, wVit: 0.5,
    titel: "Vitalzeichen erheben und Morgenmedikation prüfen",
    banner: { name: "Renate Winkler", sub: "74 J. · Zimmer 822 · COPD GOLD 3, Pneumonie", chips: [["Allergie: Penicillin (Atemnot, Ausschlag)", "red"], ["Zielsättigung 88 bis 92 %", "warn"]] },
    intro: "Du misst die Vitalzeichen. Danach prüfst du die Medikamente für 08:00 Uhr, die eine Kollegin im Nachtdienst gerichtet hat.",
    uhr: "07:25",
    vit: {
      auftrag: "Tippe auf jedes Messgerät.",
      items: [
        { k: "af", t: "Atmung", kurz: "AF", val: "26", einheit: "/min, Lippenbremse", ico: "af", wie: "zählen" },
        { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "97", einheit: "% unter 6 l/min", wie: "Clip" },
        { k: "rr", t: "Blutdruck", kurz: "RR", val: "148/86", einheit: "mmHg", wie: "messen" },
        { k: "puls", t: "Puls", kurz: "Puls", val: "104", einheit: "/min", farbe: "puls", wie: "tasten" },
        { k: "temp", t: "Temperatur", kurz: "Temp", val: "38,1", einheit: "°C", wie: "messen" },
        { k: "bew", t: "Bewusstsein", kurz: "ACVPU", val: "V", einheit: "reagiert auf Ansprache", ico: "bew", wie: "ansprechen", q: { text: "Wie beurteilst du das Bewusstsein?", opts: [
          { t: "Nach ACVPU: Sie öffnet die Augen erst auf laute Ansprache, also V. Das ist neu und wird sofort gemeldet.", ok: true, fb: "Richtig. Gestern war sie wach und orientiert." },
          { t: "Sie schläft, das ist normal, also A", fb: "A heißt wach und spontan ansprechbar." },
          { t: "Schmerzreiz setzen, um sicher zu sein", fb: "Nicht nötig, sie reagiert auf Ansprache." }] } }
      ],
      befund: "07:27 Uhr: AF 26/min mit Lippenbremse · SpO₂ 97 % unter 6 l/min O₂ (Ziel 88 bis 92 %) · RR 148/86 mmHg · Puls 104/min · Temp 38,1 °C · reagiert auf Ansprache (V), Kopfschmerz, Lippen leicht zyanotisch.",
      act: {
        text: "Neu schläfrig unter 6 l/min Sauerstoff, Atemfrequenz 26/min. Was tust du?",
        opts: [
          { t: "Ärztin sofort an das Bett holen lassen, bei ihr bleiben, Oberkörper hoch, Sauerstoff nach Anordnung auf die Zielsättigung anpassen, Werte engmaschig", ok: true, fb: "Richtig. Ab 7 Punkten sofortige ärztliche Beurteilung." },
          { t: "Paracetamol gegen das Fieber geben und in einer Stunde nachmessen", fb: "Behebt nicht das Problem und verzögert die Meldung." },
          { t: "Sauerstoff auf 10 l/min erhöhen, weil sie schnell atmet", fb: "Verstärkt die CO₂-Anreicherung." },
          { t: "Die Ärztin zur Visite um 9 Uhr informieren", fb: "Zu spät bei diesem Score." }
        ]
      }
    },
    med: {
      zeit: "08:00", allergie: "Penicillin",
      hinweis: "Antibiose wurde gestern Abend wegen der Penicillin-Allergie auf Doxycyclin umgestellt. Lorazepam nur bei Bedarf und nach ärztlicher Rücksprache.",
      plan: [
        { n: "Prednisolon", d: "40 mg", z: "1-0-0", h: "Tag 3 von 5, zum Frühstück" },
        { n: "Tiotropium", d: "2 Hübe", z: "1-0-0", h: "Inhalation" },
        { n: "Doxycyclin", d: "100 mg", z: "1-0-0", h: "seit gestern statt Amoxicillin" },
        { n: "Pantoprazol", d: "20 mg", z: "1-0-0", h: "unter Prednisolon" },
        { n: "Lorazepam", d: "0,5 mg", z: "bei Bedarf", h: "nur nach Rücksprache" }
      ],
      disp: [
        { n: "Prednisolon 40 mg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "ok", fb: "Passt, zum Frühstück. Blutzucker im Blick behalten." },
        { n: "Amoxicillin/Clavulansäure 875 mg", sub: "1 Tablette", pill: { c: "#fef3c7", s: "oval" }, r: "allergie", fb: "Penicillin-Allergie, und die Antibiose ist auf Doxycyclin umgestellt. Nicht geben, Fehler melden." },
        { n: "Pantoprazol 20 mg", sub: "1 Tablette", pill: { c: "#fde68a", s: "oval" }, r: "ok", fb: "Passt." },
        { n: "Lorazepam 0,5 mg", sub: "1 Tablette „gegen die Unruhe“", pill: { c: "#e0e7ff", s: "round" }, r: "ki", fb: "Bei Verdacht auf CO₂-Anreicherung und neuer Schläfrigkeit dämpft es die Atmung zusätzlich. Nicht geben, Ärztin informieren." },
        { n: "Tiotropium Inhalator", sub: "Inhalation 2 Hübe", pill: { c: "#93c5fd", s: "oval" }, r: "ok", fb: "Passt. Technik mit ihr üben, sobald sie wach ist." }
      ],
      fehlt: {
        text: "Was fehlt im Dispenser bzw. was besprichst du? (Mehrfachauswahl)",
        opts: [
          { t: "Doxycyclin 100 mg fehlt: aus dem Vorrat richten bzw. in der Apotheke anfordern", ok: true, fb: "Die neue Antibiose muss gegeben werden." },
          { t: "Inhalation mit Spacer üben, sobald sie wacher ist", ok: true, fb: "Verbessert die Wirkung deutlich." },
          { t: "Rauchen und Sauerstoff: Brandgefahr erklären, Rauchstopp-Hilfe anbieten", ok: true, fb: "Sicherheit und Gesundheit." },
          { t: "Bei Luftnot selbst den Sauerstoff hochdrehen", ok: false, fb: "Nein: klingeln, die Pflege passt nach Anordnung an." }
        ]
      }
    },
    merke: "Eine umgestellte Antibiose ist ein Klassiker für Verwechslungen. Bei Allergie und Atemdämpfung zählt jede Tablette."
  };

  var C = {
    id: "pneumo", titel: "Rasseln, Sauerstoff und eine Zigarette", station: "Pneumologie · Station 8P", haus: "Universitätsklinikum Am Ring", farbe: "#0891B2",
    icon: "M12 3v9M12 12c-2 0-3 2-4 4s-2 5-4 5-2-6 0-11 4-6 8-6M12 12c2 0 3 2 4 4s2 5 4 5 2-6 0-11-4-6-8-6",
    kurz: "Ein Mann mit Trachealkanüle, dem das Sekret die Luft nimmt. Und eine Frau mit COPD, die unter Sauerstoff immer müder wird.",
    anleitung: "Sven Albers", pruefer: "Frau Okoye",
    nachtLabel: "Tag 2 · 06:00 Uhr · Übergabe aus dem Nachtdienst",
    people: {
      anleitung: { name: "Sven Albers", av: { hair: "TI", hairC: "#6b4a2f", skin: "#f6d2b3", cloth: "#0891b2", deco: "badge", bg: "#e0f2fe", beard: 1, beardC: "#6b4a2f" } },
      pruefer: { name: "Frau Okoye", av: { hair: "SA", hairC: "#1d1d22", skin: "#8d5a3b", cloth: "#475569", deco: "collar", bg: "#e6edf5" } },
      nacht: { name: "Mira Lehmann", role: "Nachtdienst", av: { hair: "LE", hairC: "#a8743f", skin: "#f6d2b3", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3" } },
      ehefrau: { name: "Monika Krause", match: "monika|ehefrau|frau krause", av: { hair: "GL", hairC: "#cfd2d6", skin: "#f6d2b3", cloth: "#e8b4a6", bg: "#fde8e8", wrinkles: 1 } },
      sohn: { name: "Jan Winkler", match: "sohn|jan", av: { hair: "JW", hairC: "#7a5a3a", skin: "#f6d2b3", cloth: "#5b6b7a", deco: "shirt", bg: "#e6edf5" } }
    },
    briefing: [
      "Hallo, ich bin Sven Albers, Praxisanleiter auf der 8P. Frau Okoye aus der Pflegeschule kommt morgen zur Prüfung. Bei uns geht es um Atmung: Wir hören hin, zählen, beobachten die Lippen und die Wachheit.",
      "Herr Krause kam vor drei Tagen von der Intensivstation. Er hat eine Trachealkanüle nach langer Beatmung, der Cuff ist entblockt, sprechen kann er nur mit Sprechventil. Er muss bei Bedarf abgesaugt werden. Frau Winkler hat eine COPD mit Lungenentzündung und bekommt Sauerstoff nach Zielsättigung.",
      "Zwei Regeln: Beim Absaugen zählt Sterilität und Zeit, höchstens 15 Sekunden. Und bei COPD gilt die angeordnete Zielsättigung, mehr Sauerstoff ist nicht automatisch besser."
    ],
    order: ["A", "B"],
    pat: {
      A: {
        key: "A", name: "Bernd Krause", kurz: "Herr Krause", alter: 66, zimmer: "820", modus: "Pflegehandlung", farbe: "#0891B2", av: KRA,
        typ: "Früher Tischler, humorvoll, schreibt viel auf seine Tafel, wird ungeduldig, wenn man ihn nicht versteht.",
        diagnose: "Z. n. schwerer Pneumonie mit Langzeitbeatmung, Tracheotomie, Trachealkanüle Gr. 8 mit Cuff (entblockt), Weaning abgeschlossen.",
        daten: [
          ["Vorerkrankungen", "COPD GOLD 2, Diabetes Typ 2, Z. n. Nikotinabusus (seit 5 Jahren rauchfrei)"],
          ["Allergien", "keine bekannt"],
          ["Atemweg", "Trachealkanüle Gr. 8 mit Innenkanüle, Cuff entblockt, Sprechventil stundenweise, Feuchte Nase"],
          ["Anordnung", "Absaugen bei Bedarf, Inhalation NaCl 0,9 % 3×/Tag, Zielsättigung über 92 %, Kanülenwechsel durch HNO"],
          ["Ernährung", "Schluckdiagnostik heute 11 Uhr, bis dahin Sondenkost"],
          ["Ehefrau", "Monika Krause, kommt mittags"]
        ],
        anamnese: "(schreibt auf seine Tafel) Morgen. Nacht schlecht. Brodelt dauernd. Husten geht, aber nix kommt raus. Absaugen ist blöd, aber danach Luft besser. Bitte langsam. Wenn ich Hand hebe: Pause! Hab Angst, dass das Ding rausfällt. Wann darf ich wieder richtig sprechen? Und essen? Hunger auf Brot. Frau kommt mittags.",
        kern: [
          { t: "Sekretverhalt, ineffektiver Husten, Rasseln", kw: ["sekret", "brodel", "rassel", "husten"] },
          { t: "Kommunikation eingeschränkt: Tafel, Zeichen vereinbaren", kw: ["tafel", "sprech", "zeichen", "hand"] },
          { t: "Angst vor Herausrutschen der Kanüle", kw: ["angst", "rausfällt", "kanüle"] },
          { t: "Schlafmangel", kw: ["nacht", "schlaf"] },
          { t: "Ernährung noch über Sonde, Wunsch zu essen", kw: ["essen", "brot", "sonde", "schluck"] },
          { t: "Ressource: Humor, Ehefrau, schreibt gern", kw: ["frau", "humor", "ressource"] },
          { t: "Absaugen wird toleriert, wenn Pausen möglich sind", kw: ["pause", "langsam", "absaug"] }
        ]
      },
      B: {
        key: "B", name: "Renate Winkler", kurz: "Frau Winkler", alter: 74, zimmer: "822", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#0D9488", av: WIN,
        typ: "Ehemalige Busfahrerin, direkt und humorvoll, raucht seit 55 Jahren, lebt allein mit ihrer Katze, Sohn wohnt in der Nähe.",
        diagnose: "Akute Exazerbation einer COPD GOLD 3 bei Pneumonie rechts; Sauerstoffgabe nach Zielsättigung 88 bis 92 %.",
        daten: [
          ["Vorerkrankungen", "COPD GOLD 3, Herzinsuffizienz NYHA II, Osteoporose"],
          ["Allergien", "Penicillin (Atemnot, Ausschlag)"],
          ["Sauerstoff", "laut Anordnung 1 bis 2 l/min, Zielsättigung 88 bis 92 %"],
          ["Medikation", "Prednisolon 40 mg 1-0-0 · Tiotropium 1-0-0 · Doxycyclin 100 mg 1-0-0 · Salbutamol DA bei Bedarf · Pantoprazol 20 mg 1-0-0"],
          ["Gestern", "BGA 18 Uhr: pCO₂ 54 mmHg, pH 7,36; wach und orientiert"],
          ["Soziales", "lebt allein, Sohn Jan kommt abends"]
        ],
        anamnese: "Ach Kindchen, ich krieg so schlecht Luft, schon seit einer Woche. Das Spray nehm ich, aber das hilft nicht so recht, ich atme da halt rein. Den Spacer? Den hat mir mal einer gegeben, liegt noch in der Packung. Heute Nacht war's so eng, da hab ich am Rädchen gedreht, mehr Luft ist doch gut. Rauchen? Ja, eine geht noch, wenn ich auf den Balkon darf. Jetzt bin ich nur so müde, und der Kopf brummt. Meine Katze, wer füttert die? Der Jan, hoffentlich.",
        kern: [
          { t: "Atemnot, erschwerte Atmung bei COPD-Exazerbation", kw: ["luft", "atem", "eng", "copd"] },
          { t: "Sauerstoff eigenmächtig hochgedreht: Gefahr der CO₂-Anreicherung", kw: ["rädchen", "gedreht", "sauerstoff", "co2", "co₂"] },
          { t: "Neue Müdigkeit und Kopfschmerz: Warnzeichen", kw: ["müde", "kopf", "brummt", "schläfrig"] },
          { t: "Inhalationstechnik unsicher, Spacer ungenutzt", kw: ["spray", "spacer", "inhal"] },
          { t: "Rauchen trotz Sauerstoff: Brandgefahr", kw: ["rauch", "zigarett", "brand", "feuer"] },
          { t: "Sorge um die Katze, lebt allein", kw: ["katze", "allein", "jan"] },
          { t: "Penicillin-Allergie", kw: ["penicillin", "allerg"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Unwirksame Atemwegsclearance (NANDA-I 00031) b/d zähem Sekret und ineffektivem Husten bei Trachealkanüle, a/d Rasseln und SpO₂ 88 %; Beeinträchtigte verbale Kommunikation (00051) a/d Trachealkanüle.",
        ziel: "Die Atemwege von Herrn Krause sind frei, die Sättigung liegt über 92 %. Er kann Pausen beim Absaugen mit dem vereinbarten Zeichen einfordern und seine Bedürfnisse mit Tafel und Zeichen mitteilen.",
        mass: [
          "Absaugen bei Bedarf steril und schonend, höchstens 15 Sekunden je Gang",
          "Sekretlösung: Inhalation NaCl 0,9 % nach Anordnung, Trinken bzw. Flüssigkeit über Sonde, Oberkörperhochlage",
          "Kanülenpflege, Schlitzkompresse, Band, Notfallset am Bett prüfen",
          "Kommunikation: Tafel, Ja/Nein-Zeichen, Zeit lassen, Sprechventil nach Plan",
          "Ehefrau einbeziehen, über Schluckdiagnostik informieren"
        ],
        chk: [
          { t: "Atemwegsclearance als Diagnose", kw: ["atemweg", "sekret", "clearance"] },
          { t: "Kommunikation als Diagnose", kw: ["kommunikat", "sprech"] },
          { t: "Überprüfbares Ziel (Sättigung)", kw: ["92", "sättigung", "spo"] },
          { t: "Absaugen steril, Zeitgrenze", kw: ["absaug", "15", "steril"] },
          { t: "Notfallset / Kanülenpflege", kw: ["notfall", "kanüle", "kompresse"] },
          { t: "Sekretlösung", kw: ["inhal", "flüssig", "trink"] }
        ]
      },
      B: {
        diag: "Beeinträchtigter Gasaustausch (00030) b/d COPD-Exazerbation und unangepasster Sauerstoffgabe, a/d Schläfrigkeit, Kopfschmerz, AF 26/min; Unwirksames Gesundheitsverhalten (00099) a/d Rauchen und fehlerhafter Inhalation.",
        ziel: "Die Sättigung liegt im Zielbereich 88 bis 92 %, Frau Winkler ist wach und orientiert. Bis zur Entlassung inhaliert sie mit Spacer richtig und kann es zeigen.",
        mass: [
          "Sauerstoff nach Anordnung auf Zielsättigung titrieren, Flowmeter regelmäßig prüfen",
          "Bewusstsein, Atmung, Sättigung engmaschig, Veränderungen sofort melden",
          "Atemerleichternde Positionen (Kutschersitz, Oberkörper hoch), Lippenbremse",
          "Inhalationstechnik mit Spacer schulen, Teach-back",
          "Rauchstopp-Beratung, Brandschutz bei Sauerstoff, Sohn wegen Katze einbeziehen"
        ],
        chk: [
          { t: "Gasaustausch als Diagnose", kw: ["gasaustausch", "atmung"] },
          { t: "Zielsättigung 88 bis 92", kw: ["88", "92", "ziel"] },
          { t: "Sauerstoff nach Anordnung", kw: ["sauerstoff", "anordnung", "titr"] },
          { t: "Beobachtung Bewusstsein", kw: ["bewusst", "wach", "schläfr"] },
          { t: "Inhalationsschulung", kw: ["inhal", "spacer"] },
          { t: "Rauchen / Brandgefahr", kw: ["rauch", "brand"] }
        ]
      }
    },
    nacht: [
      ["A", "Herr Krause: Zweimal abgesaugt, um 01 und 04 Uhr, viel zähes gelbes Sekret. Er hat schlecht geschlafen. Sondenkost läuft, Schluckdiagnostik heute um 11."],
      ["B", "Frau Winkler: Sehr unruhig, hat über Luftnot geklagt. Sie hat um 3 Uhr selbst am Sauerstoff gedreht, ich hab's erst um 5 gemerkt und war dann im anderen Zimmer gebunden. Sie wollte auf den Balkon rauchen, hab ich nicht erlaubt."]
    ],
    sbar: {
      A: { muster: { S: "Herr Krause, 66, Zimmer 820, Trachealkanüle, rasselnde Atmung, SpO₂ 88 %, habe zweimal abgesaugt, jetzt 94 %.", B: "Z. n. Langzeitbeatmung und Pneumonie, Cuff entblockt, nachts zweimal abgesaugt, Sekret zäh gelblich.", A: "Das Sekret nimmt zu und ist zäh, ich vermute eine erneute Infektion.", R: "Bitte heute ansehen. Soll ich eine Sekretprobe abnehmen und die Inhalation häufiger geben?" },
        chk: [{ t: "S: Rasseln, Sättigung", kw: ["rassel", "88", "sättig", "spo"] }, { t: "B: Kanüle, Vorgeschichte", kw: ["kanüle", "beatm", "pneumon"] }, { t: "A: Einschätzung", kw: ["vermute", "infekt", "sekret"] }, { t: "R: Vorschlag", kw: ["bitte", "probe", "inhal"] }, { t: "Werte vorher und nachher", kw: ["94"] }] },
      B: { muster: { S: "Frau Winkler, 74, Zimmer 822, seit heute früh schläfrig, reagiert nur auf Ansprache, Kopfschmerz, SpO₂ 97 % unter 6 l/min.", B: "COPD-Exazerbation mit Pneumonie, Zielsättigung 88 bis 92 %, sie hat nachts selbst den Sauerstoff hochgedreht. Gestern pCO₂ 54.", A: "Ich vermute eine CO₂-Anreicherung, sie ist neu schläfrig.", R: "Bitte sofort kommen. Soll ich eine Blutgasanalyse vorbereiten? Den Sauerstoff passe ich nach Anordnung auf die Zielsättigung an." },
        chk: [{ t: "S: schläfrig, SpO₂ unter 6 l", kw: ["schläfr", "6 l", "97"] }, { t: "B: COPD, Zielsättigung", kw: ["copd", "88", "92"] }, { t: "A: CO₂-Verdacht, neu schläfrig", kw: ["co2", "co₂", "schläfr"] }, { t: "R: sofort, BGA", kw: ["sofort", "bga", "blutgas"] }, { t: "Sauerstoff hochgedreht", kw: ["gedreht", "hochgedreht"] }] }
    },
    prio: [
      { id: "k1", t: "Herr Krause: Absaugen bei Rasseln und SpO₂ 88 %", zeit: "06:42", warum: "Freie Atemwege haben Vorrang." },
      { id: "w1", t: "Frau Winkler: Blick ins Zimmer, Sauerstoff und Bewusstsein", zeit: "07:20", warum: "Nachts Sauerstoff hochgedreht, Gefahr einer CO₂-Anreicherung." },
      { id: "w2", t: "Frau Winkler: Vitalzeichen und Bewusstsein, Ärztin informieren", zeit: "07:25", warum: "Verschlechterung früh erkennen." },
      { id: "w3", t: "Frau Winkler: Morgenmedikation prüfen", zeit: "08:00", warum: "Umstellung der Antibiose, Allergie." },
      { id: "k2", t: "Herr Krause: Inhalation, Kanülenpflege, Vorbereitung Schluckdiagnostik", zeit: "09:00", warum: "Sekret lösen, Termin um 11 Uhr." },
      { id: "do", t: "Dokumentation, Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend dokumentieren." }
    ],
    live: [absaug, winBild, winVit],
    st: {
      clock: "09:40", titel: "Die Kanüle ist draußen", who: "ehefrau",
      situation: "09:40 Uhr. Frau Krause ist früher gekommen und ruft aus Zimmer 820: „Hilfe! Mein Mann hat gehustet, und das Ding ist rausgerutscht!“ Herr Krause sitzt aufrecht, die Kanüle liegt auf der Bettdecke, er atmet schnell. Am Bett hängt das Notfallset.",
      order: [
        { id: "a", t: "Hilfe rufen (Klingel/Notruf), bei ihm bleiben, ruhig sprechen", warum: "Atemwegsnotfall, du bleibst am Patienten." },
        { id: "b", t: "Oberkörper hoch, Sauerstoff über das Tracheostoma geben, Sättigung messen", warum: "Sauerstoffversorgung sichern." },
        { id: "c", t: "Tracheostoma mit dem Spreizer aus dem Notfallset offen halten", warum: "Ein frisches Tracheostoma kann schnell zufallen." },
        { id: "d", t: "Ersatzkanüle bereitlegen; Einsetzen durch Ärztin bzw. geschulte Pflegefachperson nach Standard", warum: "Wiederherstellung des Atemwegs durch erfahrene Hände." },
        { id: "e", t: "Frau Krause betreuen, danach Dokumentation und Ursache klären (Band zu locker?)", warum: "Angehörige stehen unter Schock, Wiederholung vermeiden." }
      ],
      mc: { text: "Was gehört ins Notfallset am Bett eines Menschen mit Trachealkanüle? (Mehrfachauswahl)", opts: [
        { t: "Ersatzkanüle gleicher Größe und eine Größe kleiner", ok: true, fb: "Falls die gleiche Größe nicht passt." },
        { t: "Tracheospreizer, Gleitgel, Blockerspritze, Kanülenband", ok: true, fb: "Für das schnelle, sichere Einsetzen." },
        { t: "Absaugkatheter und funktionsbereite Absaugung, Sauerstoff", ok: true, fb: "Atemweg frei halten, Sauerstoff geben." },
        { t: "Ein Beruhigungsmittel zur sofortigen Gabe", ok: false, fb: "Gehört nicht ins Set und dämpft die Atmung." }
      ] },
      merke: "Notfallset vollständig am Bett, Band ein Finger breit locker. Bei Dislokation: Hilfe, Sauerstoff, Stoma offen halten, nicht allein lassen."
    },
    doku: {
      clock: "10:20",
      auftrag: "Schreibe den Pflegebericht zu Frau Winkler (07:20 bis 08:10 Uhr). Ergänzend: Dr. Seifert kam 07:32 Uhr, BGA 07:40 Uhr: pCO₂ 68 mmHg, pH 7,29. AO: Sauerstoff 1 l/min, Zielsättigung 88 bis 92 %, nicht-invasive Beatmung (NIV) über Maske ab 08:00 Uhr, Lorazepam abgesetzt.",
      muster: "07:20 Pat. schläfrig, öffnet die Augen erst auf laute Ansprache, äußert: „Ich bin so müde, der Kopf brummt.“ Lippen leicht zyanotisch. O₂ lief mit 6 l/min (AO 1 bis 2 l/min, Ziel 88 bis 92 %), Pat. hat nachts selbst erhöht. Zigaretten und Feuerzeug auf dem Nachttisch, nach Rücksprache mit Pat. verwahrt. 07:27 AF 26/min mit Lippenbremse, SpO₂ 97 % unter 6 l/min, RR 148/86 mmHg, P 104/min, Temp 38,1 °C, ACVPU V. 07:28 Dr. Seifert informiert (SBAR), O₂ nach AO reduziert. 07:40 BGA durch Ärztin: pCO₂ 68 mmHg, pH 7,29. 08:00 NIV-Maske nach AO, Pat. toleriert die Maske nach Erklärung. 08:10 SpO₂ 90 %, Pat. reagiert auf Ansprache, orientiert. Lorazepam abgesetzt, Amoxicillin/Clavulansäure im Dispenser trotz Allergie gefunden, nicht gegeben, Kollegin und Ärztin informiert, CIRS-Meldung. [Name, HZ]",
      chk: [
        { t: "Uhrzeiten", kw: ["07:", "08:"] },
        { t: "Werte mit Einheiten", kw: ["/min", "mmhg", "%"] },
        { t: "Wörtliche Aussage", kw: ["„", "äußert"] },
        { t: "Sauerstoff Ist und Soll", kw: ["6 l", "88", "92"] },
        { t: "Bewusstsein (ACVPU)", kw: ["acvpu", "ansprache", "schläfr"] },
        { t: "Ärztliche Info und Anordnung", kw: ["dr.", "seifert", "niv", "bga"] },
        { t: "Medikationsfehler gemeldet", kw: ["amoxi", "allerg", "cirs"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "07:27 SpO₂ 97 % unter 6 l/min O₂, AF 26/min.", bad: false, fb: "In Ordnung." },
          { t: "Pat. hat am Sauerstoff rumgespielt.", bad: true, fb: "Wertend und ungenau. Was wurde wann wie verändert?" },
          { t: "Pat. wirkt schläfrig.", bad: true, fb: "Beschreiben: Worauf reagiert sie? ACVPU angeben." },
          { t: "07:28 Dr. Seifert telefonisch informiert, kommt sofort.", bad: false, fb: "In Ordnung." },
          { t: "Medikamente gegeben.", bad: true, fb: "Welche, wann, welche Dosis? Und Lorazepam und das Penicillin wurden gerade nicht gegeben." },
          { t: "08:10 SpO₂ 90 % unter NIV, Pat. orientiert, reagiert auf Ansprache.", bad: false, fb: "In Ordnung." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst.",
      muster: "Herr Krause, 820: Trachealkanüle, heute dreimal abgesaugt, Sekret zäh gelblich, Probe ins Labor. 09:40 Dislokation der Kanüle beim Husten: Stoma offen gehalten, Sauerstoff, Dr. Seifert hat 09:48 neue Kanüle Gr. 8 eingesetzt, Band neu, jetzt stabil, SpO₂ 95 %. Schluckdiagnostik verschoben auf morgen 11 Uhr. Notfallset ist wieder vollständig. Bitte Band und Sitz kontrollieren, Ehefrau ist noch sehr aufgeregt.\n\nFrau Winkler, 822: Heute früh Hyperkapnie, pCO₂ 68. Hatte nachts den Sauerstoff selbst auf 6 l erhöht. Jetzt NIV nach Plan, dazwischen 1 l/min, Ziel 88 bis 92 %, wach und orientiert. Lorazepam abgesetzt. Amoxicillin lag trotz Penicillin-Allergie im Dispenser, nicht gegeben, CIRS gemeldet. Doxycyclin gegeben. Zigaretten verwahrt. Bitte Bewusstsein und Sättigung engmaschig, NIV-Zeiten einhalten, Sohn wegen der Katze anrufen.",
      chk: [
        { t: "Beide mit Kernproblem", kw: ["krause", "winkler"] },
        { t: "Offene Aufgaben", kw: ["bitte", "morgen", "einhalten"] },
        { t: "Sicherheitsrelevantes", kw: ["kanüle", "notfallset", "niv", "allerg"] }
      ]
    },
    refl: [
      { q: "Was ist beim Absaugen für Herrn Krause am wichtigsten, und wie hast du ihn einbezogen?", muster: "Steril arbeiten, ohne Sog einführen, unter Sog drehend herausziehen, höchstens 15 Sekunden, und zwischen den Gängen Pausen. Weil er nicht sprechen kann, haben wir ein Handzeichen für Pause vereinbart. So konnte er mitbestimmen, und die Sättigung stieg von 88 auf 94 %." },
      { q: "Warum war Frau Winkler so müde, und warum hilft mehr Sauerstoff hier nicht?", muster: "Sie hatte den Sauerstoff nachts selbst auf 6 l/min erhöht. Bei COPD kann zu viel Sauerstoff den Atemantrieb dämpfen, CO₂ steigt, man wird schläfrig. Deshalb gilt die angeordnete Zielsättigung von 88 bis 92 %. Ich habe die Ärztin sofort informiert und den Sauerstoff nach Anordnung angepasst." },
      { q: "Wie hast du in der Notfallsituation mit der Kanüle gehandelt?", muster: "Ich habe Hilfe gerufen und bin geblieben, Oberkörper hoch, Sauerstoff über das Stoma, mit dem Spreizer offen gehalten und die Ersatzkanüle bereitgelegt. Eingesetzt hat sie die Ärztin. Danach haben wir das Band neu angelegt, das Notfallset aufgefüllt und mit Frau Krause gesprochen." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
