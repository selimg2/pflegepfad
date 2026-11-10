/* ===== Fall 8: Ambulante Pflege (Pflegedienst, Hausbesuche) ===== */
(function () {
  var X = window.PXB;
  if (!X) return;
  var MART = { hair: "RL", hairC: "#dcdcde", skin: "#f6d2b3", cloth: "#9fd4c7", bg: "#e6f6f3", wrinkles: 1, glasses: 1, earrings: 1 };
  var RITT = { hair: "WO", hairC: "#9aa3ab", skin: "#f0c7a5", cloth: "#c7a26b", deco: "shirt", bg: "#fff1d6", wrinkles: 1, stubble: true };
  var ME = { hair: "LN", hairC: "#6b4a2f", skin: "#e8b48f", cloth: "#4f7fe0", deco: "scrubs", bg: "#e6efff" };

  /* ---------- Kompressionsverband nach Pütter ---------- */
  function leg(o) {
    o = o || {};
    var s = X.blank("#eef3f8") + '<rect y="190" width="400" height="90" fill="#e2d6c4"/>' + X.l(0, 190, 400, 190, "#cdbda5", 2);
    /* Hocker */
    s += X.r(250, 150, 140, 20, 8, "#a3b3c7", 2) + X.l(270, 170, 266, 250, X.K, 5) + X.l(370, 170, 374, 250, X.K, 5);
    /* Unterschenkel liegend: Knie links, Fuß rechts */
    var sk = MART.skin;
    s += X.p("M20 104C80 96 160 104 236 116L300 124Q318 126 320 140L322 150H230C160 150 80 158 20 162Z", sk, 2.2);
    s += X.p("M300 124q30-6 52 2q14 6 10 18l-10 6h-30z", sk, 2.2);
    s += X.p("M350 126q8 0 10 6", "none", 0, ' stroke="#d9a483" stroke-width="1.6"');
    /* Krampfadern und Ulkus-Verband */
    if (!o.bandage || o.bandage < 1) s += X.p("M60 120q20 10 40 0t40 4", "none", 0, ' stroke="#7c9fd6" stroke-width="2.2" opacity=".8"');
    if (o.wound) s += X.r(196, 116, 38, 28, 6, "#ffffff", 1.8) + X.e(214, 130, 10, 6, "#fde68a", 0, ' opacity=".8"') + X.t(214, 154, "Wundauflage", { s: 8, w: 700 });
    if (o.ankle) s += X.c(300, 140, 6, "#f59e0b", 0, ' opacity=".55"');
    if (o.foot90) s += X.p("M330 112v30", "none", 0, ' stroke="#22c55e" stroke-width="2.4" stroke-dasharray="4 4"') + X.t(352, 108, "90°", { s: 10, w: 800, c: "#15803d" });
    /* Binden in Lagen */
    var n = o.bandage || 0;
    var col = "#f5deb3", col2 = "#e9c98c";
    if (n >= 1) s += '<g class="' + (n === 1 && o.anim ? "pa-fade" : "") + '">' + X.p("M300 124q30-6 52 2l2 22h-34q-20 2-20-24z", col, 2) + X.p("M306 126l40 18M312 124l34 4", "none", 0, ' stroke="' + col2 + '" stroke-width="1.6"') + "</g>";
    if (n >= 2) s += '<g class="' + (n === 2 && o.anim ? "pa-fade" : "") + '">' + X.p("M276 120L304 124L310 150H280Z", col, 2) + X.l(282, 122, 304, 150, col2, 2) + X.l(300, 124, 282, 150, col2, 2) + "</g>";
    if (n >= 3) s += '<g class="' + (n === 3 && o.anim ? "pa-fade" : "") + '">' + X.p("M160 106C200 108 240 114 280 120L282 150C240 148 200 148 160 150Z", col, 2) + [0, 1, 2, 3, 4].map(function (k) { return X.l(170 + k * 22, 108 + k * 2, 186 + k * 22, 150, col2, 2); }).join("") + "</g>";
    if (n >= 4) s += '<g class="' + (n === 4 && o.anim ? "pa-fade" : "") + '">' + X.p("M30 104C80 98 120 102 162 106L164 150C120 152 80 156 30 160Z", col, 2) + [0, 1, 2, 3, 4, 5].map(function (k) { return X.l(40 + k * 21, 102 + k, 58 + k * 21, 158 - k * 1.2, col2, 2); }).join("") + "</g>";
    if (n >= 5) s += '<g class="' + (n === 5 && o.anim ? "pa-fade" : "") + '">' + X.p("M30 104C80 98 160 104 236 116L300 124L310 150H230C160 150 80 158 30 160Z", "#d9c19a", 2, ' opacity=".55"') + [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return X.l(52 + k * 30, 158 - k, 34 + k * 30, 102 + k * 2, "#c9a96f", 2); }).join("") + "</g>";
    if (o.roll) s += '<g class="pa-wiggle">' + X.c(o.roll[0], o.roll[1], 16, col, 2) + X.c(o.roll[0], o.roll[1], 6, "#ffffff", 1.6) + "</g>";
    if (o.toes) s += X.p("M354 132l6 4M354 140l6 2", "none", 0, ' stroke="#22c55e" stroke-width="3" stroke-linecap="round"');
    return s;
  }
  function kzScene(i) {
    var home = function (mood, extra, wrapped) {
      var s = X.defs() + '<rect width="400" height="280" fill="#f6efe4"/>' + '<rect y="200" width="400" height="80" fill="#e2d6c4"/>' + X.l(0, 200, 400, 200, "#cdbda5", 2);
      s += X.g(X.r(0, 0, 90, 64, 4, "#ffffff", 2) + X.r(6, 6, 78, 52, 2, "#bfdbfe", 0) + X.l(45, 6, 45, 58, X.K, 1.6), "translate(280,30)");
      s += X.F.armchair(100, 152, { col: "#c08457", floor: 46, sc: 1.2 });
      s += X.F.sitSide(MART, 100, 152, { sc: 1.2, mood: mood, pants: "#6b7f99", feet: "bare", arms: "lap", wrap: wrapped ? "#f5deb3" : null });
      return s + (extra || "");
    };
    if (i === 0) return home("smile") + X.tag(240, 230, "Wundexpertin hat das Ulkus versorgt", "");
    if (i === 1) return home("talk") + '<g class="pa-in">' + X.F.stand(ME, 300, 252, { h: 196, mood: "smile", pose: "down" }) + "</g>" + X.tag(250, 30, "Ablauf erklären · Einverständnis", "ok");
    if (i === 2) return home("neutral") + '<g class="pa-in">' + X.g(X.r(0, 0, 70, 54, 6, "#ffffff", 2) + X.t(35, 22, "ABI 0,9", { s: 11, w: 800, c: "#15803d" }) + X.t(35, 40, "Anordnung", { s: 9 }), "translate(250,110)") + "</g>" + X.tag(270, 196, "Verordnung · ABI · Schmerz", "ok");
    if (i === 3) return leg({ wound: 1 }) + X.tag(200, 30, "Bein liegt hoch · Haut eingecremt, trocken", "ok");
    if (i === 4) return leg({ wound: 1, foot90: 1, ankle: 1 }) + X.tag(200, 30, "Fuß 90° · Knöchel und Schienbein polstern", "ok");
    if (i === 5) return leg({ wound: 1, bandage: 1, anim: 1, roll: [334, 112] }) + X.tag(200, 30, "an den Zehengrundgelenken beginnen", "ok");
    if (i === 6) return leg({ wound: 1, bandage: 2, anim: 1, roll: [300, 106] }) + X.tag(200, 30, "Ferse mit einschließen", "ok");
    if (i === 7) return leg({ wound: 1, bandage: 3, anim: 1, roll: [226, 98] }) + X.tag(200, 30, "Binde abrollen lassen, am Bein entlang", "ok");
    if (i === 8) return leg({ bandage: 4, anim: 1, roll: [100, 90] }) + X.tag(200, 30, "bis unter das Knie · Fibulaköpfchen frei", "ok");
    if (i === 9) return leg({ bandage: 5, anim: 1, roll: [200, 96] }) + X.tag(200, 30, "zweite Binde gegenläufig", "ok");
    if (i === 10) return leg({ bandage: 5, toes: 1 }) + X.tag(200, 30, "Zehen rosig · keine Taubheit · keine Falten", "ok");
    if (i === 11) return home("happy", X.tag(270, 130, "„Gehen Sie heute 3 × um den Block“", "ok"), true);
    return X.blank() + X.clipboard(60, 26, 280, 230, "Leistungsnachweis 08:10", ["KV re. nach Pütter, 2 Kurzzugbinden", "Fuß 90°, Polsterung Knöchel", "Zehen rosig, warm, keine Schmerzen", "Pat. informiert: bei Taubheit melden", "Ulkus: Wundexpertin 07:40", "HZ"], { mark: 2 }) + X.check(318, 236);
  }
  var kompr = {
    k: "kompression", typ: "steps", pat: "A", t: "Frau Martens · Kompressionsverband", kurzname: "Kompressionsverband als Simulation", clock: "07:50", max: 14, kurz: "Kompressionsverband",
    titel: "Kompressionsverband nach Pütter am Unterschenkel", ic: "wrap", mood: "smile",
    banner: { name: "Gisela Martens", sub: "81 J. · Hausbesuch · Ulcus cruris venosum rechts", chips: [["ABI 0,9 (Kompression erlaubt)", "warn"], ["Wunde versorgt durch Wundexpertin", ""]] },
    intro: "07:50 Uhr, Wohnzimmer. Die Wundexpertin hat das Ulkus am rechten Unterschenkel gerade versorgt. Jetzt legst du den Kompressionsverband an. Frau Martens sagt: „Beim letzten Mal hat der Verband so geschnürt, ich hab ihn nachts abgemacht.“",
    ko: ["Kompression ohne ärztliche Verordnung oder bei ABI unter 0,5", "Verband mit Zug am Knöchel lockerer als an der Wade (umgekehrter Druckgradient)", "Abschnürende Falten oder freiliegende Ferse", "Zehen kalt, blau oder taub ignorieren"],
    steps: [
      { t: "Ablauf erklären, nach dem Schnüren fragen", ic: "talk", ph: "vor", fb: "Du nimmst ihre Erfahrung ernst: Ein schnürender Verband sitzt falsch. Heute achtet ihr gemeinsam auf das Gefühl.", say: "Wenn's diesmal nicht so drückt, behalt ich ihn auch an." },
      { t: "Verordnung, ABI und Schmerzen prüfen", ic: "doc", ph: "vor", fb: "Ärztliche Verordnung liegt vor, ABI 0,9: Kompression ist erlaubt. Kein Ruheschmerz, keine akute Thrombose bekannt." },
      { t: "Bein hochlagern, Haut pflegen", ic: "pillow", ph: "vor", fb: "Morgens vor dem Aufstehen bzw. nach Hochlagerung ist das Bein abgeschwollen. Haut gepflegt und trocken." },
      { t: "Fuß im 90°-Winkel, Knöchel polstern", ic: "ruler", ph: "durch", fb: "Fuß rechtwinklig, Knochenvorsprünge und Mulden hinter dem Knöchel gepolstert, damit der Druck gleichmäßig ist." },
      { t: "An den Zehengrundgelenken beginnen", ic: "wrap", ph: "durch", fb: "Erste Tour um den Vorfuß, Zehen bleiben frei." },
      { t: "Ferse mit einschließen", ic: "wrap", ph: "durch", fb: "Die Ferse wird eingeschlossen, sonst entsteht dort ein Fenster mit Ödem." },
      { t: "Binde am Bein entlang abrollen", ic: "wrap", ph: "durch", fb: "Die Rolle bleibt nah am Bein, Druck von distal nach proximal abnehmend." },
      { t: "Bis unter das Knie wickeln", ic: "wrap", ph: "durch", fb: "Bis zwei Querfinger unter die Kniekehle, das Fibulaköpfchen bleibt frei (Nerv)." },
      { t: "Zweite Binde gegenläufig", ic: "wrap", ph: "durch", fb: "Gegenläufig gewickelt verteilt sich der Druck gleichmäßig, der Verband hält besser." },
      { t: "Zehen und Sitz kontrollieren", ic: "eye", ph: "nach", fb: "Zehen rosig und warm, keine Taubheit, keine Falten, kein Schnüren. Bei Schmerz oder blauen Zehen: abnehmen und melden." },
      { t: "Zum Gehen ermutigen", ic: "shoe", ph: "nach", fb: "Kompression wirkt mit Bewegung über die Muskelpumpe. Feste Schuhe, Spaziergang, Beine nicht lange hängen lassen.", say: "Dreimal um den Block? Na gut, mit dem Hund von nebenan." },
      { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Art des Verbands, Material, Hautzustand, Durchblutung, Information der Patientin." }
    ],
    wrong: [
      { t: "Ohne Verordnung einfach wickeln", ic: "wrap", ko: true, fb: "Kritisch: Kompression braucht eine ärztliche Verordnung und einen ABI-Wert." },
      { t: "Am Knöchel locker, an der Wade fest", ic: "wrap", ko: true, fb: "Kritisch: Umgekehrter Druckgradient staut das Blut." },
      { t: "Ferse frei lassen", ic: "wrap", ko: true, fb: "Kritisch: Dort entsteht ein Fenster mit Ödem und Druckstellen." },
      { t: "Bis über das Knie wickeln", ic: "wrap", fb: "Das Fibulaköpfchen und die Kniekehle bleiben frei." },
      { t: "Bein vorher hängen lassen", ic: "stand", fb: "Dann wird das Ödem eingewickelt." },
      { t: "Mit Spitzfuß wickeln", ic: "ruler", fb: "Der Fuß gehört in 90°, sonst schnürt der Verband beim Gehen." }
    ],
    scene: kzScene,
    status: function (i) { return ["Gespräch", "Verordnung", "Lagerung", "Polsterung", "Start", "Ferse", "Abrollen", "Knie", "Zweite Binde", "Kontrolle", "Bewegung", "Dokumentation"][i] || ""; },
    statusEnd: "Verband sitzt, Zehen rosig",
    merke: "Fuß 90°, Ferse drin, Druck nimmt nach oben ab, Zehen frei und rosig. Kompression wirkt nur mit Bewegung."
  };

  /* ---------- Bildbefund Herr Ritter zu Hause ---------- */
  var sp8 = {};
  function ritterScene() {
    var s = X.defs() + '<rect width="400" height="280" fill="#f6efe4"/>' + '<rect y="206" width="400" height="74" fill="#d9c7ae"/>' + X.l(0, 206, 400, 206, "#c2ad8f", 2);
    /* Fenster mit Fensterbank, Insulinpen in der Sonne */
    s += X.g(X.r(0, 0, 110, 84, 4, "#ffffff", 2) + X.r(6, 6, 98, 72, 2, "#bfdbfe", 0) + X.c(80, 22, 12, "#fde047", 0) + X.l(55, 6, 55, 78, X.K, 1.6), "translate(260,24)") + X.r(254, 108, 122, 8, 2, "#e7e5e4", 2);
    s += '<g class="pa-glow">' + X.c(320, 30, 18, "#fde047", 0, ' opacity=".5"') + "</g>" + X.r(296, 98, 46, 9, 4, "#e5e7eb", 1.6) + X.r(296, 98, 12, 9, 3, "#f97316", 1.2);
    sp8.pen = [318, 102];
    /* Tisch mit schimmeligem Brot und Medikamentenkorb */
    s += X.r(170, 150, 150, 10, 4, "#c08457", 2) + X.l(184, 160, 184, 240, X.K, 5) + X.l(306, 160, 306, 240, X.K, 5);
    s += X.p("M186 146q0-16 20-16h12q20 0 20 16z", "#e7c08a", 1.8) + X.c(204, 138, 4, "#86a96b", 0) + X.c(214, 134, 3, "#6f9a5b", 0) + X.c(222, 140, 3.5, "#86a96b", 0);
    sp8.brot = [212, 138];
    s += X.r(250, 126, 56, 24, 4, "#d6a46b", 2) + X.r(256, 116, 14, 14, 2, "#ffffff", 1.4) + X.r(272, 112, 14, 18, 2, "#fef3c7", 1.4) + X.r(288, 118, 12, 12, 2, "#e0e7ff", 1.4) + X.t(278, 144, "2019", { s: 7, w: 800, c: "#b91c1c" });
    sp8.korb = [278, 130];
    /* Herr Ritter im Sessel, barfuß, Verletzung am Fuß */
    s += X.F.armchair(84, 166, { col: "#7c8b6a", floor: 46, sc: 1.2 });
    s += X.F.sitSide(RITT, 84, 166, { sc: 1.2, mood: "tired", pants: "#55657a", feet: "bare", arms: "rest" });
    var ft8 = X._fig.foot;
    s += X.e(ft8[0] + 9, ft8[1] + 1, 4, 2.5, "#dc2626", 0);
    sp8.fuss = [ft8[0] + 6, ft8[1]];
    /* Läufer mit Falte */
    s += X.p("M40 262L80 236H230L210 262Z", "#ef8a8a", 2, ' opacity=".6"') + X.p("M150 250q14-14 28 0", "#e37272", 2);
    sp8.teppich = [164, 248];
    /* Flur dunkel, Lampe kaputt */
    s += X.r(340, 140, 60, 70, 0, "#475569", 0, ' opacity=".55"') + X.l(370, 120, 370, 136, X.K, 2) + X.p("M360 136h20l-4 10h-12z", "#94a3b8", 1.8);
    sp8.flur = [370, 160];
    return s + X.vignette();
  }
  var ritterBild = {
    k: "ritterbild", typ: "hotspot", pat: "B", t: "Herr Ritter · Bildbefund", kurzname: "Bildbefund in der Wohnung", clock: "08:40", max: 8,
    titel: "Hausbesuch bei Herrn Ritter",
    banner: { name: "Hans-Peter Ritter", sub: "74 J. · lebt allein · Diabetes Typ 2 mit Insulin, Herzinsuffizienz", chips: [["BZ gestern Abend 312 mg/dl", "red"], ["Pflegegrad 2", ""]] },
    intro: "08:40 Uhr. Herr Ritter öffnet barfuß und lässt dich in die Wohnung. „Kommen Se rein. Der Zucker spinnt seit Tagen, ich spritz doch wie immer.“ Du schaust dich im Wohnzimmer um.",
    q: "Was fällt dir an Herrn Ritter und in seiner Wohnung auf?",
    mood: "tired",
    art: ritterScene(),
    spots: [
      { c: [[sp8.pen[0], sp8.pen[1], 16]], t: "Insulinpen liegt in der Sonne auf der Fensterbank", d: "Wärme und Sonne zerstören Insulin. Das erklärt die hohen Werte trotz Spritzen. Angebrochenen Pen bei Raumtemperatur geschützt lagern, Vorrat im Kühlschrank; neuen Pen verwenden und Hausarzt informieren." },
      { c: [[sp8.fuss[0], sp8.fuss[1], 14]], t: "Barfuß, kleine blutige Stelle am Fuß", d: "Bei Diabetes kann jede kleine Verletzung zum Ulkus werden. Fuß inspizieren, versorgen nach Standard, Hausarzt informieren, Schuhe empfehlen." },
      { c: [[sp8.brot[0], sp8.brot[1], 16]], t: "Schimmeliges Brot auf dem Tisch", d: "Hinweis auf eingeschränkte Versorgung oder Sehen. Ernährung und Einkauf klären, z. B. Essen auf Rädern, Angehörige." },
      { c: [[sp8.korb[0], sp8.korb[1], 18]], t: "Korb mit alten, abgelaufenen Medikamenten", d: "Gefahr von Verwechslung und Doppeleinnahme. Mit ihm sortieren, Altes über die Apotheke entsorgen, aktuellen Medikationsplan als Grundlage." },
      { c: [[sp8.teppich[0], sp8.teppich[1], 16]], t: "Läufer mit Falte", d: "Stolperfalle. Mit Einverständnis entfernen oder rutschfest sichern." },
      { c: [[sp8.flur[0], sp8.flur[1], 22]], t: "Dunkler Flur, Lampe defekt", d: "Nachts auf dem Weg zur Toilette steigt die Sturzgefahr. Leuchtmittel tauschen lassen, Nachtlicht vorschlagen." }
    ],
    extra: ["Rauchmelder fehlt", "Katzenklo verschmutzt", "Gasgeruch in der Küche", "Haustür ohne Schloss"],
    cap: "Tipp: Fensterbank, Füße, Tisch, Boden, Flur.",
    merke: "Im Hausbesuch ist die Wohnung Teil des Assessments. Insulin in der Sonne erklärt oft mehr als jede Laborkurve."
  };

  var ritterVit = {
    k: "rittervit", typ: "vitmed", pat: "B", t: "Herr Ritter · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Wochendosett", clock: "08:50", max: 10, wVit: 0.45,
    titel: "Vitalzeichen erheben und Wochendosett prüfen",
    banner: { name: "Hans-Peter Ritter", sub: "74 J. · Hausbesuch · Diabetes Typ 2, Herzinsuffizienz NYHA II", chips: [["Allergie: keine bekannt", ""], ["Dosett stellt der Pflegedienst", ""]] },
    intro: "Du misst die Vitalzeichen und den Blutzucker. Danach prüfst du das Wochendosett für heute Mittag, das deine Kollegin am Montag gestellt hat.",
    uhr: "08:52",
    vit: {
      auftrag: "Tippe auf jedes Messgerät.",
      items: [
        { k: "rr", t: "Blutdruck", kurz: "RR", val: "158/92", einheit: "mmHg", wie: "messen" },
        { k: "puls", t: "Puls", kurz: "Puls", val: "84", einheit: "/min", farbe: "puls", wie: "tasten" },
        { k: "af", t: "Atmung", kurz: "AF", val: "18", einheit: "/min", ico: "af", wie: "zählen" },
        { k: "bz", t: "Blutzucker", kurz: "BZ", val: "298", einheit: "mg/dl", ico: "bz", wie: "messen", q: { text: "Wie misst du den Blutzucker bei Herrn Ritter?", opts: [
          { t: "Hände waschen lassen (Zuckerreste), seitlich an der Fingerkuppe stechen, ersten Tropfen nach Gerätevorgabe verwenden, Wert mit Uhrzeit dokumentieren", ok: true, fb: "Richtig. Zuckerreste an den Fingern verfälschen den Wert." },
          { t: "Mitten in die Fingerkuppe stechen und kräftig drücken", fb: "Schmerzhaft, und Quetschen verdünnt mit Gewebsflüssigkeit." },
          { t: "Desinfizieren und sofort stechen", fb: "Alkohol muss trocknen, sonst verfälscht er den Wert." }] } },
        { k: "temp", t: "Temperatur", kurz: "Temp", val: "36,9", einheit: "°C", wie: "messen" },
        { k: "gew", t: "Gewicht", kurz: "kg", val: "92,1", einheit: "kg (Vorwoche 91,8)", ico: "gew", wie: "wiegen" }
      ],
      befund: "08:54 Uhr: RR 158/92 mmHg · Puls 84/min · AF 18/min · BZ 298 mg/dl · Temp 36,9 °C · Gewicht 92,1 kg · keine Ketonzeichen (kein Erbrechen, kein Azetongeruch), wach, orientiert, Durst.",
      act: {
        text: "BZ 298 mg/dl, Insulin lag in der Sonne. Was tust du?",
        opts: [
          { t: "Hausarzt informieren (SBAR), neuen Insulinpen aus dem Kühlschrankvorrat verwenden lassen, Spritzschema laut Anordnung, BZ-Kontrolle vereinbaren, Lagerung erklären", ok: true, fb: "Richtig. Ursache beheben, Arzt entscheidet über eine Korrektur, du schulst die Lagerung." },
          { t: "Selbst 10 Einheiten extra spritzen, damit der Wert runtergeht", fb: "Eigenmächtige Dosisänderung ist keine Pflegeentscheidung." },
          { t: "Den Pen einfach weiterverwenden, der ist ja noch voll", fb: "Hitzegeschädigtes Insulin wirkt nicht zuverlässig." },
          { t: "Sofort den Notarzt rufen", fb: "Wach, orientiert, keine Ketoazidose-Zeichen: Hausarzt zeitnah reicht." }
        ]
      }
    },
    med: {
      zeit: "12:00", allergie: "keine bekannt",
      hinweis: "Aktueller Medikationsplan vom Hausarzt (Stand 28.10.). Torasemid wurde damals von 10 auf 5 mg reduziert.",
      plan: [
        { n: "Torasemid", d: "5 mg", z: "1-0-0", h: "seit 28.10. reduziert" },
        { n: "Metformin", d: "1000 mg", z: "1-0-1", h: "nicht mittags" },
        { n: "Ramipril", d: "5 mg", z: "1-0-0", h: "" },
        { n: "Simvastatin", d: "20 mg", z: "0-0-1", h: "abends" }
      ],
      disp: [
        { n: "Torasemid 10 mg", sub: "1 Tablette im Morgenfach", pill: { c: "#ffffff", s: "round" }, r: "dosis", fb: "Seit 28.10. sind 5 mg angeordnet. Die alte Dosis wurde weitergestellt: Kollegin und Hausarzt informieren, Dosett korrigieren." },
        { n: "Metformin 1000 mg", sub: "1 Tablette im Mittagsfach", pill: { c: "#e2e8f0", s: "oval" }, r: "zeit", fb: "Metformin ist morgens und abends angeordnet, nicht mittags." },
        { n: "Ramipril 5 mg", sub: "1 Tablette im Morgenfach", pill: { c: "#fecaca", s: "oval" }, r: "ok", fb: "Passt zur Anordnung." },
        { n: "Simvastatin 20 mg", sub: "1 Tablette im Abendfach", pill: { c: "#fbcfe8", s: "round" }, r: "ok", fb: "Passt zur Anordnung." }
      ],
      fehlt: {
        text: "Was besprichst du mit Herrn Ritter zur Medikation? (Mehrfachauswahl)",
        opts: [
          { t: "Lagerung von Insulin: angebrochen bei Raumtemperatur ohne Sonne, Vorrat im Kühlschrank", ok: true, fb: "Ursache der hohen Werte." },
          { t: "Alte Medikamente gemeinsam aussortieren und über die Apotheke entsorgen", ok: true, fb: "Vermeidet Verwechslungen." },
          { t: "Dass das Dosett nur der Pflegedienst ändert und er selbst nichts dazulegt", ok: true, fb: "Klare Zuständigkeit." },
          { t: "Dass er die Wassertablette bei Bedarf weglassen kann", ok: false, fb: "Nur nach ärztlicher Absprache." }
        ]
      }
    },
    merke: "Ein Dosett aus der eigenen Hand ist trotzdem jedes Mal zu prüfen. Und ein entgleister Zucker hat oft eine einfache Ursache in der Wohnung."
  };

  var C = {
    id: "ambulant", titel: "Unterwegs: zwei Hausbesuche am Morgen", station: "Ambulante Pflege · Tour Nord", haus: "Pflegedienst Mittendrin", farbe: "#EA580C",
    icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    kurz: "Eine Seniorin mit offenem Bein, die den Verband nachts abmacht, und ein Herr allein zu Hause, dessen Zucker verrücktspielt.",
    anleitung: "Nina Köhler", pruefer: "Frau Yıldız",
    nachtLabel: "Tag 2 · 06:30 Uhr · Tourbesprechung mit Infos aus dem Spätdienst",
    people: {
      anleitung: { name: "Nina Köhler", av: { hair: "SA", hairC: "#1d1d22", skin: "#c98d64", cloth: "#ea580c", deco: "badge", bg: "#fff1d6" } },
      pruefer: { name: "Frau Yıldız", av: { hair: "FH", hairC: "#5b6b8a", skin: "#e3ab84", cloth: "#475569", deco: "collar", bg: "#e6edf5" } },
      nacht: { name: "Tom Becker", role: "Spätdienst Tour Nord", av: { hair: "TI", hairC: "#b5651d", skin: "#f6d2b3", cloth: "#ea580c", deco: "badge", bg: "#fff1d6", freckles: 1 } },
      sohn: { name: "Jörg Martens", match: "sohn|jörg", av: { hair: "JW", hairC: "#7a5a3a", skin: "#f6d2b3", cloth: "#5b6b7a", deco: "shirt", bg: "#e6edf5", glasses: 1 } },
      nachbarin: { name: "Frau Lorenz", match: "lorenz|nachbarin", av: { hair: "UF", hairC: "#d3d5d8", skin: "#f6d2b3", cloth: "#f2b8c6", bg: "#fde8e8", wrinkles: 1 } }
    },
    briefing: [
      "Hallo und willkommen bei Mittendrin! Ich bin Nina Köhler, Praxisanleiterin. Frau Yıldız aus der Pflegeschule fährt morgen mit. Ambulant heißt: Du bist allein in der Wohnung, die Ärztin ist nur telefonisch erreichbar, und du siehst, wie die Menschen wirklich leben.",
      "Deine zwei Menschen auf der Tour: Frau Martens hat ein offenes Bein, ein venöses Ulkus. Die Wundexpertin versorgt die Wunde, wir legen den Kompressionsverband an. Herr Ritter lebt allein, hat Diabetes mit Insulin und eine Herzinsuffizienz, wir stellen sein Wochendosett und schauen, wie er zurechtkommt.",
      "Im Hausbesuch gilt: Die Wohnung ist Teil der Beobachtung. Was liegt wo, was fehlt, wie riecht es? Und du prüfst jedes Medikament gegen den aktuellen Plan, auch wenn wir das Dosett selbst gestellt haben."
    ],
    order: ["A", "B"],
    pat: {
      A: {
        key: "A", name: "Gisela Martens", kurz: "Frau Martens", alter: 81, zimmer: "Hausbesuch 1", modus: "Pflegehandlung", farbe: "#0D9488", av: MART,
        typ: "Ehemalige Verkäuferin, gesprächig und herzlich, geht gern mit dem Hund der Nachbarin spazieren, ungeduldig mit „dem ganzen Gewickel“.",
        diagnose: "Ulcus cruris venosum rechts seit 4 Monaten bei chronischer venöser Insuffizienz; ABI rechts 0,9.",
        daten: [
          ["Vorerkrankungen", "Chronische venöse Insuffizienz, Z. n. tiefer Beinvenenthrombose rechts 2015, Adipositas, Hypertonie"],
          ["Allergien", "Pflaster mit Kolophonium"],
          ["Pflegegrad", "Pflegegrad 1 · Verordnung häusliche Krankenpflege: Kompressionsverband täglich"],
          ["Medikation", "Ramipril 5 mg 1-0-0 · Paracetamol 500 mg bei Bedarf"],
          ["Wunde", "Ulkus 3 × 2 cm medial oberhalb des Knöchels, Versorgung durch Wundexpertin 2× pro Woche"],
          ["Sohn", "Jörg Martens, kommt sonntags"]
        ],
        anamnese: "Kommen Se rein, Kindchen, Kaffee? Das Bein, ach, das ist halt so. Der Verband drückt immer so, beim letzten Mal hab ich ihn nachts abgemacht, da konnte ich nicht schlafen. Morgens sitz ich gern am Fenster und hab die Beine unten. Spazieren geh ich nur, wenn die Frau Lorenz mir den Hund gibt, allein mag ich nicht mehr so weit. Das Pflaster, das braune, das verträgt meine Haut nicht, da wird's ganz rot. Mein Sohn sagt immer, ich soll mehr laufen. Der hat gut reden.",
        kern: [
          { t: "Nimmt den Verband nachts ab, weil er drückt: Verband sitzt falsch, Wirkung fehlt", kw: ["nachts", "abgemacht", "drückt", "schnürt"] },
          { t: "Sitzt mit herabhängenden Beinen: Ödemförderung", kw: ["beine unten", "hängen", "sitz", "fenster"] },
          { t: "Wenig Bewegung: Muskelpumpe fehlt", kw: ["spazier", "laufen", "bewegung", "muskelpumpe", "hund"] },
          { t: "Pflasterallergie (Kolophonium)", kw: ["pflaster", "allerg", "rot", "kolophon"] },
          { t: "Ressource: Hund der Nachbarin, gesellig", kw: ["hund", "lorenz", "ressource"] },
          { t: "Schmerz durch Verband / Ulkus", kw: ["schmerz", "drückt"] },
          { t: "Sohn als Unterstützung", kw: ["sohn", "jörg"] },
          { t: "Verordnung häusliche Krankenpflege, ABI 0,9", kw: ["verordnung", "abi", "0,9"] }
        ]
      },
      B: {
        key: "B", name: "Hans-Peter Ritter", kurz: "Herr Ritter", alter: 74, zimmer: "Hausbesuch 2", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#EA580C", av: RITT,
        typ: "Ehemaliger Elektriker, wortkarg und stolz, lebt seit dem Tod seiner Frau allein, will „niemandem zur Last fallen“.",
        diagnose: "Diabetes mellitus Typ 2 mit Basalinsulin, Herzinsuffizienz NYHA II, beginnende Retinopathie; Pflegegrad 2.",
        daten: [
          ["Vorerkrankungen", "Diabetes Typ 2 seit 15 Jahren, Herzinsuffizienz, Retinopathie, Hypertonie"],
          ["Allergien", "keine bekannt"],
          ["Leistungen", "Pflegedienst: Medikamente stellen 1× pro Woche, Insulin-Kontrolle, Hausbesuch 3× pro Woche"],
          ["Medikation", "Insulin glargin 20 IE morgens (spritzt selbst) · Metformin 1000 mg 1-0-1 · Torasemid 5 mg 1-0-0 (seit 28.10.) · Ramipril 5 mg 1-0-0 · Simvastatin 20 mg 0-0-1"],
          ["BZ-Protokoll", "Mo 248 · Di 276 · Mi 312 mg/dl (abends)"],
          ["Soziales", "Tochter in Kanada, Nachbar Herr Brandt hilft beim Einkauf"]
        ],
        anamnese: "Ja, kommen Se. Ich spritz jeden Morgen, wie immer, aber der Zucker geht trotzdem hoch. Vielleicht ist das Zeug nicht mehr gut. Ich leg den Pen immer da ans Fenster, dann seh ich ihn gleich. Einkaufen macht der Brandt von nebenan, aber der war krank. Ich ess halt, was da ist. Sehen tu ich auch schlechter, das Kleingedruckte geht gar nicht mehr. Im Flur ist die Birne kaputt, die krieg ich nicht mehr raus. Barfuß lauf ich zu Hause immer, Socken sind mir zu warm. Und die vielen Tabletten da im Korb, keine Ahnung mehr, welche von wann sind.",
        kern: [
          { t: "Insulinpen liegt am Fenster in der Sonne: Wirkverlust", kw: ["fenster", "sonne", "pen", "lager", "wärme"] },
          { t: "Steigende BZ-Werte trotz Insulin", kw: ["zucker", "bz", "steig", "312", "hyperglyk"] },
          { t: "Barfuß bei Diabetes: Verletzungsgefahr", kw: ["barfuß", "fuß", "socken"] },
          { t: "Versorgungslücke beim Einkauf: Ernährung unsicher", kw: ["einkauf", "brandt", "ess", "ernähr"] },
          { t: "Sehverschlechterung (Retinopathie): Medikamente und Insulin schwer ablesbar", kw: ["seh", "retino", "kleingedruckt"] },
          { t: "Alte Medikamente im Korb: Verwechslungsgefahr", kw: ["korb", "alte", "tabletten", "verwechsl"] },
          { t: "Dunkler Flur: Sturzgefahr", kw: ["flur", "birne", "dunkel", "sturz"] },
          { t: "Lebt allein, Tochter weit weg", kw: ["allein", "tochter", "kanada"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Beeinträchtigte Gewebeintegrität (NANDA-I 00044) b/d chronischer venöser Insuffizienz, a/d Ulkus 3 × 2 cm; Unwirksames Gesundheitsverhalten (00099) a/d nächtlichem Abnehmen des Verbands und wenig Bewegung.",
        ziel: "Frau Martens behält den Kompressionsverband bis zum nächsten Morgen an. Sie geht täglich mindestens 15 Minuten und legt die Beine im Sitzen hoch. Die Wunde verkleinert sich bis zur nächsten Messung.",
        mass: [
          "Kompressionsverband täglich korrekt nach Pütter, Druckgradient, Ferse eingeschlossen, Polsterung",
          "Durchblutung der Zehen kontrollieren, bei Schmerz Anruf beim Pflegedienst ermöglichen",
          "Bewegung fördern (Spaziergang mit Hund, Fußgymnastik), Beine hochlegen",
          "Hautpflege, kolophoniumfreie Fixierung, Zusammenarbeit mit der Wundexpertin",
          "Sohn einbeziehen, Ziele gemeinsam vereinbaren"
        ],
        chk: [
          { t: "Gewebeintegrität / Ulkus als Diagnose", kw: ["gewebe", "ulkus", "wunde", "haut"] },
          { t: "Verhalten: Verband abnehmen, wenig Bewegung", kw: ["abnehm", "abgemacht", "bewegung"] },
          { t: "Überprüfbares Ziel", kw: ["minuten", "behält", "verkleiner"] },
          { t: "Kompression korrekt", kw: ["pütter", "kompression", "druck"] },
          { t: "Bewegung / Muskelpumpe", kw: ["bewegung", "muskelpumpe", "spazier", "gymnastik"] },
          { t: "Pflasterallergie", kw: ["kolophon", "pflaster", "allerg"] }
        ]
      },
      B: {
        diag: "Gefahr eines instabilen Blutzuckerspiegels (00179) b/d unsachgemäßer Insulinlagerung und unsicherer Ernährung, a/d BZ bis 312 mg/dl. Dazu: Sturzgefahr (00155) a/d dunklem Flur, Sehminderung.",
        ziel: "Die BZ-Werte liegen nach Anpassung durch den Hausarzt innerhalb einer Woche im Zielbereich. Herr Ritter lagert sein Insulin richtig und kann das erklären.",
        mass: [
          "Insulinlagerung schulen, neuen Pen, Kühlschrankvorrat",
          "BZ-Kontrollen, Hausarzt über Werte informieren",
          "Medikamente sortieren, alte entsorgen, Dosett nach aktuellem Plan",
          "Einkauf und Ernährung organisieren (Essen auf Rädern, Nachbar)",
          "Wohnung: Licht im Flur, Läufer, Schuhe statt barfuß; Fußinspektion"
        ],
        chk: [
          { t: "Instabiler Blutzucker als Diagnose", kw: ["blutzucker", "bz", "glyk"] },
          { t: "Ursache Insulinlagerung", kw: ["lager", "sonne", "fenster", "pen"] },
          { t: "Sturzgefahr / Wohnumfeld", kw: ["sturz", "flur", "licht", "läufer"] },
          { t: "Hausarzt informieren", kw: ["hausarzt", "arzt"] },
          { t: "Medikamente sortieren", kw: ["sortier", "korb", "dosett"] },
          { t: "Ernährung / Einkauf", kw: ["einkauf", "ernähr", "essen auf rädern"] }
        ]
      }
    },
    nacht: [
      ["A", "Frau Martens: Gestern Abend um 19 Uhr hatte sie den Verband schon wieder ab, er habe gedrückt. Bein war geschwollen. Sie hat gefragt, ob es auch „was Bequemeres“ gibt."],
      ["B", "Herr Ritter: BZ gestern Abend 312 mg/dl. Er sagt, er spritzt wie immer. In der Wohnung roch es etwas muffig, der Kühlschrank war fast leer. Die Hausärztin war nicht mehr erreichbar."]
    ],
    sbar: {
      A: { muster: { S: "Frau Martens, 81, Hausbesuch, Ulcus cruris venosum rechts. Nimmt den Kompressionsverband abends ab, weil er drückt, Bein dann geschwollen.", B: "Venöse Insuffizienz, Z. n. Thrombose, ABI 0,9, Kolophonium-Allergie, Wundexpertin 2× pro Woche.", A: "Der Verband sitzt vermutlich falsch (Druckgradient, Falten), dadurch fehlt die Wirkung.", R: "Verband heute sorgfältig nach Pütter anlegen, Sitz mit ihr prüfen, Bewegung besprechen, Rückmeldung an die Wundexpertin." },
        chk: [{ t: "S: Verband abgenommen, Schwellung", kw: ["abgenommen", "abgemacht", "drückt", "schwell"] }, { t: "B: ABI, Allergie", kw: ["abi", "0,9", "kolophon", "allerg"] }, { t: "A: falscher Sitz", kw: ["sitz", "falsch", "druck"] }, { t: "R: Pütter, Kontrolle, Bewegung", kw: ["pütter", "bewegung", "kontroll"] }, { t: "Wundexpertin", kw: ["wundexpert"] }] },
      B: { muster: { S: "Herr Ritter, 74, Hausbesuch, Diabetes mit Insulin. BZ seit Tagen steigend, gestern 312 mg/dl.", B: "Herzinsuffizienz, Retinopathie, lebt allein, Einkaufshilfe ausgefallen.", A: "Verdacht auf Ursache in der Insulinanwendung oder -lagerung und Ernährung; Sturzgefahr in der Wohnung.", R: "Heute BZ, Insulin und Lagerung ansehen, Wohnung einschätzen, Dosett prüfen, Hausärztin informieren." },
        chk: [{ t: "S: BZ steigend, 312", kw: ["312", "bz", "zucker"] }, { t: "B: allein, Retinopathie", kw: ["allein", "retino", "seh"] }, { t: "A: Ursache Insulin/Ernährung", kw: ["insulin", "lager", "ernähr"] }, { t: "R: Hausärztin, Dosett, Wohnung", kw: ["hausärzt", "hausarzt", "dosett", "wohnung"] }, { t: "Sturzgefahr", kw: ["sturz"] }] }
    },
    prio: [
      { id: "t1", t: "Tour planen: Reihenfolge, Material (Kurzzugbinden, Polster, BZ-Gerät), Ankunftszeiten", zeit: "06:45", warum: "Ohne Material keine Versorgung, und die Menschen warten." },
      { id: "m1", t: "Frau Martens: Gespräch über das Drücken, Verordnung und ABI prüfen", zeit: "07:40", warum: "Verstehen, warum der Verband abgenommen wurde." },
      { id: "m2", t: "Frau Martens: Kompressionsverband nach der Wundversorgung", zeit: "07:50", warum: "Die Wundexpertin ist fertig, Bein ist abgeschwollen." },
      { id: "r1", t: "Herr Ritter: Wohnung, Fuß und Insulin ansehen", zeit: "08:40", warum: "Ursache für den hohen BZ finden." },
      { id: "r2", t: "Herr Ritter: Vitalzeichen, BZ, Dosett prüfen", zeit: "08:50", warum: "Grundlage für das Telefonat mit der Hausärztin." },
      { id: "r3", t: "Hausärztin anrufen (SBAR) und Anordnungen zurücklesen", zeit: "09:15", warum: "Ärztliche Entscheidung über Insulin und Torasemid." },
      { id: "do", t: "Leistungsnachweise und Pflegebericht in der App dokumentieren", zeit: "09:40", warum: "Abrechnung und Nachvollziehbarkeit." }
    ],
    live: [kompr, ritterBild, ritterVit],
    st: {
      clock: "09:20", titel: "Anruf auf der Tour", who: "nachbarin",
      situation: "09:20 Uhr. Du sitzt bei Herrn Ritter am Telefon mit der Hausärztin, da ruft die Pflegedienstleitung an: Frau Lorenz, die Nachbarin von Frau Martens, hat gemeldet: „Die Frau Martens sitzt im Flur auf dem Boden und kommt nicht hoch. Sie sagt, ihr ist schwindelig.“ Dein nächster Patient wartet um 09:30 Uhr auf seine Insulinkontrolle.",
      order: [
        { id: "a", t: "Telefonat mit der Hausärztin kurz und sicher beenden, Anordnungen zurücklesen und notieren", warum: "Eine halbe Anordnung ist gefährlich." },
        { id: "b", t: "Frau Lorenz bitten, bei Frau Martens zu bleiben, sie nicht hochzuziehen; bei Bewusstseinsstörung, Atemnot oder Brustschmerz 112", warum: "Hilfe vor Ort, Notruf nach Zustand." },
        { id: "c", t: "Pflegedienstleitung bitten, den nächsten Patienten umzuplanen", warum: "Du kannst nicht an zwei Orten sein." },
        { id: "d", t: "Zu Frau Martens fahren: Ersteinschätzung, Vitalzeichen, BZ, Verletzungen, sicheres Aufhelfen", warum: "Akute Situation." },
        { id: "e", t: "Hausärztin informieren, Sturzprotokoll, Dokumentation", warum: "Ärztliche Beurteilung und Nachvollziehbarkeit." }
      ],
      mc: { text: "Was prüfst du bei Frau Martens nach dem Sturz? (Mehrfachauswahl)", opts: [
        { t: "Bewusstsein, Vitalzeichen, Blutzucker", ok: true, fb: "Ursachen für Schwindel." },
        { t: "Schmerzen, Fehlstellung, Prellungen an Hüfte und Handgelenk", ok: true, fb: "Typische Sturzverletzungen." },
        { t: "Ob der Kompressionsverband noch richtig sitzt", ok: true, fb: "Schnürt er? Zehen?" },
        { t: "Sofort unter den Armen hochziehen", ok: false, fb: "Gefährlich. Erst einschätzen, dann mit Hilfsmittel aufhelfen." }
      ] },
      merke: "Im ambulanten Dienst ist Organisation Teil der Pflege: Anordnungen sauber abschließen, Hilfe vor Ort organisieren, umplanen."
    },
    doku: {
      clock: "09:40",
      auftrag: "Schreibe den Pflegebericht zu Herrn Ritter (08:40 bis 09:20 Uhr). Ergänzend: Hausärztin Dr. Franke hat um 09:18 Uhr telefonisch angeordnet: neuer Insulinpen, glargin 22 IE ab morgen, BZ morgens und abends, Torasemid 5 mg bleibt, Metformin nicht mittags. Rückmeldung Freitag.",
      muster: "08:40 Pat. öffnet barfuß, äußert: „Der Zucker spinnt seit Tagen.“ Insulinpen auf der Fensterbank in direkter Sonne. Kleine blutige Stelle an der Fußsohle re., gereinigt, steril abgedeckt. Schimmeliges Brot, Kühlschrank fast leer, Flurbeleuchtung defekt, Läufer mit Falte. 08:54 RR 158/92 mmHg, P 84/min, AF 18/min, BZ 298 mg/dl, Temp 36,9 °C, Gewicht 92,1 kg, wach, orientiert, keine Ketonzeichen. Dosett: Torasemid 10 mg statt 5 mg, Metformin im Mittagsfach, korrigiert. 09:18 telefonische AO Dr. Franke (zurückgelesen): neuer Pen, Insulin glargin 22 IE ab morgen, BZ 2× tgl., Rückmeldung Fr. Pat. zur Insulinlagerung beraten (Teach-back), alter Pen entsorgt, Läufer entfernt mit Einverständnis, PDL informiert wegen Einkauf. [Name, HZ]",
      chk: [
        { t: "Uhrzeiten", kw: ["08:", "09:"] },
        { t: "Werte mit Einheiten", kw: ["mmhg", "mg/dl", "/min"] },
        { t: "Wörtliche Aussage", kw: ["„", "äußert"] },
        { t: "Insulinlagerung als Ursache", kw: ["sonne", "fenster", "lager"] },
        { t: "Dosettfehler", kw: ["torasemid", "metformin", "dosett"] },
        { t: "Telefonische AO mit Read-back", kw: ["zurückgelesen", "ao", "dr.", "franke"] },
        { t: "Wohnung / Fuß", kw: ["fuß", "läufer", "flur"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "08:54 BZ 298 mg/dl, keine Ketonzeichen.", bad: false, fb: "In Ordnung." },
          { t: "Wohnung verwahrlost.", bad: true, fb: "Wertend. Konkret beschreiben, was du gesehen hast." },
          { t: "Insulin falsch gelagert, Pat. ist uneinsichtig.", bad: true, fb: "Wertend und unbelegt. Beratung und Reaktion beschreiben." },
          { t: "09:18 telefonische AO Dr. Franke, zurückgelesen: Insulin glargin 22 IE ab morgen.", bad: false, fb: "In Ordnung." },
          { t: "Dosett ok.", bad: true, fb: "Falsch, und ohne Inhalt nicht nachvollziehbar." },
          { t: "Fuß re.: blutige Stelle Fußsohle 3 mm, gereinigt, steril abgedeckt, HÄ informiert.", bad: false, fb: "In Ordnung." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst der Tour Nord (Tom Becker).",
      muster: "Frau Martens: Kompressionsverband rechts heute 07:50 nach Pütter neu angelegt, Zehen rosig. Sie hatte ihn wegen Drücken abgenommen, heute sitzt er gut. 09:20 Sturz im Flur mit Schwindel, BZ 104, RR 132/78, keine Verletzung, Hausärztin informiert, kommt heute Nachmittag. Bitte abends Verband und Befinden kontrollieren.\n\nHerr Ritter: BZ 298, Ursache wahrscheinlich Insulinpen in der Sonne. Neuer Pen, ab morgen glargin 22 IE, BZ morgens und abends, Rückmeldung an Dr. Franke am Freitag. Dosett korrigiert (Torasemid 5 mg, Metformin nicht mittags). Kleine Wunde Fußsohle rechts, abgedeckt. Einkauf: PDL klärt Essen auf Rädern. Bitte Flurlampe beim nächsten Besuch ansprechen.",
      chk: [
        { t: "Beide mit Kernproblem", kw: ["martens", "ritter"] },
        { t: "Offene Aufgaben", kw: ["bitte", "freitag", "abends", "morgen"] },
        { t: "Sicherheitsrelevantes", kw: ["sturz", "insulin", "dosett", "wunde"] }
      ]
    },
    refl: [
      { q: "Warum hatte Frau Martens ihren Verband abgenommen, und was hast du heute anders gemacht?", muster: "Ein Verband, der drückt, sitzt meist falsch: zu viel Druck oben, Falten, Spitzfuß oder die Ferse frei. Ich habe den Fuß im 90°-Winkel gelagert, die Knöchel gepolstert, an den Zehengrundgelenken begonnen, die Ferse eingeschlossen und die Binde am Bein abrollen lassen, damit der Druck nach oben abnimmt. Danach haben wir gemeinsam den Sitz geprüft, und ich habe ihr erklärt, wann sie anrufen soll." },
      { q: "Was hat dir die Wohnung von Herrn Ritter über seinen Blutzucker verraten?", muster: "Der Pen lag in der Sonne, das Insulin war vermutlich unwirksam. Dazu fehlende Lebensmittel, alte Medikamente, schlechtes Sehen. Ich habe nicht nur den Wert gemessen, sondern die Ursache im Alltag gesucht und mit ihm eine Lösung besprochen." },
      { q: "Wie hast du in der Störung durch den Anruf Prioritäten gesetzt?", muster: "Erst das Telefonat mit der Hausärztin sauber abgeschlossen (Read-back), dann Hilfe vor Ort durch die Nachbarin organisiert, die Pflegedienstleitung umplanen lassen und bin zu Frau Martens gefahren. Ambulant ist Organisation ein Teil der Sicherheit." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
