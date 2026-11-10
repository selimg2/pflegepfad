/* ===== Fall 7: Stationäre Langzeitpflege (Seniorenzentrum, Wohnbereich 2) ===== */
(function () {
  var X = window.PXB;
  if (!X) return;
  var AV = window.PXAV;

  /* ---------- Figuren ---------- */
  var BUSCH = { hair: "MZ", hairC: "#e4e4e8", skin: "#f6d2b3", cloth: "#c9b6e4", bg: "#efe7fb", wrinkles: 1, glasses: 1 };
  var STENZ = { hair: "KF", hairC: "#bfc3c8", skin: "#f0c7a5", cloth: "#8fae8b", deco: "shirt", bg: "#e7f4e4", wrinkles: 1, stubble: true };
  var DIETR = { hair: "HE", hairC: "#d9dbde", skin: "#e3ab84", cloth: "#9cc3e6", deco: "shirt", bg: "#ddeeff", wrinkles: 1, mustache: 1, beardC: "#b8bcc2" };
  var ME = { hair: "LN", hairC: "#6b4a2f", skin: "#e8b48f", cloth: "#4f7fe0", deco: "scrubs", bg: "#e6efff" };

  /* ---------- Szenen: Transfer Bett → Rollstuhl ---------- */
  function room() { return X.defs() + X.room({ disp: 0, railX: 12, railW: 0, rail: false, winX: 250 }) + X.g(X.r(0, 0, 70, 50, 4, "#fef3c7", 2) + X.p("M8 40l18-20 14 12 10-8 12 16z", "#a7d3a0", 0) + X.c(52, 14, 6, "#fde047", 0), "translate(40,40)"); }
  function lowBed(o) {
    o = o || {};
    var s = X.sh(140, 248, 120, 7) + X.r(30, 186, 220, 10, 3, X.ref("m"), 1.8) + X.c(48, 240, 7, "#334155", 1.6) + X.c(232, 240, 7, "#334155", 1.6) + X.l(50, 196, 48, 234, "#64748b", 4) + X.l(230, 196, 232, 234, "#64748b", 4);
    s += X.r(22, 126, 12, 80, 6, "#dfe8f2", 2) + X.r(38, 160, 214, 28, 8, "#ffffff", 2);
    if (o.high) s += X.r(30, 150, 220, 10, 3, "#dbeafe", 0);
    return s;
  }
  function wheelchair(x, o) {
    o = o || {};
    var y = 160, s = X.sh(x + 40, 250, 54, 6);
    s += X.c(x + 22, 214, 34, "none", 0, ' stroke="#1d1d1f" stroke-width="5"') + X.c(x + 22, 214, 34, "none", 0, ' stroke="#64748b" stroke-width="3"') + X.c(x + 22, 214, 4, "#334155", 0);
    s += X.c(x + 82, 240, 9, "#334155", 1.6);
    s += X.p("M" + (x + 4) + " " + (y - 60) + "V" + (y + 30) + "H" + (x + 70) + "L" + (x + 82) + " " + (y + 72), "none", 0, ' stroke="#334155" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"');
    s += X.r(x + 4, y + 22, 66, 10, 4, "#1e293b", 1.6) + X.r(x, y - 54, 8, 76, 3, "#1e293b", 1.4);
    if (o.foot !== false) s += X.p("M" + (x + 72) + " " + (y + 40) + "l10 34h14", "none", 0, ' stroke="#334155" stroke-width="4" stroke-linecap="round"');
    if (o.brake) s += '<g class="' + (o.brakeNew ? "pa-pop" : "") + '">' + X.r(x + 44, y + 40, 10, 22, 3, "#ef4444", 1.6) + "</g>";
    return s;
  }
  var F = X.F;
  function personLying(mood) {
    return F.lie(BUSCH, 38, 162, 212, { mood: mood || "sleepy", blanket: "#e9e1f5" });
  }
  function personSitEdge(mood, shoes, feet) {
    return F.sitSide(BUSCH, 170, 196, { sc: 1.15, mood: mood || "worried", pants: "#7c6aa6", feet: shoes ? "shoes" : feet ? "bare" : "none", arms: "lap" });
  }
  function personStand(mood) {
    return F.stand(BUSCH, 214, 250, { h: 188, mood: mood || "worried", pants: "#7c6aa6", shoes: "#334155", pose: "hold" });
  }
  function nurse(x, pose, mood) {
    return F.stand(ME, x, 250, { h: 192, mood: mood || "smile", pose: pose === "assist" ? "assist" : "down" });
  }
  function seatedChair(x, mood) {
    return F.sitSide(BUSCH, x + 24, 184, { sc: 1.1, mood: mood || "smile", pants: "#7c6aa6", feet: "shoes", arms: "rest" });
  }
  function trScene(i) {
    if (i === 0) return room() + lowBed() + personLying("sleepy") + wheelchair(290) + X.tag(200, 30, "Frau Busch möchte zum Frühstück", "");
    if (i === 1) return room() + lowBed() + personLying("worried") + wheelchair(290) + '<g class="pa-in">' + nurse(260, "", "smile") + "</g>" + X.tag(150, 30, "Ankündigen · Blickkontakt · kurze Sätze", "ok");
    if (i === 2) return room() + lowBed() + personLying("neutral") + '<g class="pa-slide">' + wheelchair(258) + "</g>" + X.tag(200, 30, "Rollstuhl im 30°-Winkel am Bett", "ok");
    if (i === 3) return room() + lowBed() + personLying("neutral") + wheelchair(258, { brake: 1, brakeNew: 1 }) + X.tag(200, 30, "Bremsen fest", "ok");
    if (i === 4) return room() + lowBed() + personLying("neutral") + wheelchair(258, { brake: 1, foot: false }) + X.tag(200, 30, "Fußstützen weggeklappt", "ok");
    if (i === 5) return room() + lowBed() + personLying("neutral") + wheelchair(258, { brake: 1, foot: false }) + X.arrow("M140 210v-20") + X.tag(200, 30, "Bett auf Kniehöhe", "ok");
    if (i === 6) return room() + lowBed() + '<g class="pa-fade">' + personSitEdge("worried", false, true) + "</g>" + wheelchair(258, { brake: 1, foot: false }) + X.tag(200, 30, "über die Seite an die Bettkante", "ok");
    if (i === 7) return room() + lowBed() + personSitEdge("neutral", false, true) + wheelchair(258, { brake: 1, foot: false }) + '<g class="pa-in">' + X.c(177, 96, 42, "none", 0, ' stroke="#22c55e" stroke-width="2.4" stroke-dasharray="5 5"') + "</g>" + X.tag(200, 30, "kurz sitzen · Schwindel? Puls?", "ok");
    if (i === 8) return room() + lowBed() + personSitEdge("smile", true) + wheelchair(258, { brake: 1, foot: false }) + X.tag(200, 30, "feste Schuhe · Füße flach am Boden", "ok");
    if (i === 9) return room() + lowBed() + '<g class="pa-up">' + personStand("worried") + "</g>" + wheelchair(258, { brake: 1, foot: false }) + nurse(300, "assist", "smile") + X.tag(200, 24, "nach vorn neigen · Gewicht auf die Füße", "ok");
    if (i === 10) return room() + lowBed() + '<g class="pa-slide">' + seatedChair(258, "smile") + "</g>" + wheelchair(258, { brake: 1, foot: false }) + X.tag(200, 30, "drehen · langsam hinsetzen", "ok");
    if (i === 11) return room() + lowBed() + wheelchair(258, { brake: 1 }) + seatedChair(258, "happy") + X.tag(200, 30, "Fußstützen dran · Füße drauf · aufrecht", "ok");
    if (i === 12) return room() + lowBed() + wheelchair(258) + seatedChair(258, "happy") + X.tag(200, 30, "Bremsen lösen · Brille, Klingel, Getränk", "ok");
    return X.blank() + X.clipboard(60, 26, 280, 230, "Bericht 07:45", ["Transfer Bett → Rollstuhl mit 1 PFK", "Pat. stand ca. 10 s, kein Schwindel", "Ressource: stützt sich mit li. Hand", "Bewegungsplan: Sitzen in 2 h", "Hüftprotektor getragen", "HZ"], { mark: 2 }) + X.check(318, 236);
  }
  var transfer = {
    k: "transfer", typ: "steps", pat: "A", t: "Frau Busch · Transfer in den Rollstuhl", kurzname: "Transfer Bett → Rollstuhl als Simulation", clock: "07:30", max: 14, kurz: "Transfer",
    titel: "Transfer vom Bett in den Rollstuhl mit Ressourcenförderung", ic: "wheel", mood: "worried",
    banner: { name: "Elfriede Busch", sub: "88 J. · Zimmer 214 · Pflegegrad 4, Demenz, Z. n. Schenkelhalsfraktur", chips: [["Sturz vor 3 Wochen", "red"], ["Hüftprotektor", ""], ["versteht kurze Sätze", ""]] },
    intro: "07:30 Uhr. Frau Busch ist wach und möchte zum Frühstück in den Gemeinschaftsraum. Sie sagt: „Wo ist denn mein Mann? Der wartet doch.“ Du begleitest sie vom Bett in den Rollstuhl und förderst dabei, was sie selbst kann.",
    ko: ["Transfer ohne festgestellte Bremsen", "Unter den Achseln hochziehen", "Aufstehen lassen trotz Schwindel oder ohne Schuhe", "Transfer allein, wenn laut Bewegungsplan zwei Personen nötig sind"],
    steps: [
      { t: "Ankündigen, Blickkontakt, kurze Sätze", ic: "talk", ph: "vor", fb: "Du nennst deinen Namen, gehst auf ihre Frage ein, ohne zu korrigieren, und kündigst jeden Schritt in einem kurzen Satz an.", say: "Frühstück? Ach ja, Frühstück ist schön." },
      { t: "Rollstuhl im 30°-Winkel ans Bett", ic: "wheel", ph: "vor", fb: "Auf der Seite, zu der sie sich gut drehen kann, im spitzen Winkel nah am Bett." },
      { t: "Bremsen feststellen", ic: "brake", ph: "vor", fb: "Beide Bremsen fest. Ohne das rollt der Stuhl weg, während sie sich setzt." },
      { t: "Fußstützen wegklappen", ic: "shoe", ph: "vor", fb: "Damit sie mit den Füßen nicht hängen bleibt." },
      { t: "Bett auf Kniehöhe stellen", ic: "bed", ph: "vor", fb: "Dann kann sie die Füße flach aufstellen und besser aufstehen." },
      { t: "Über die Seite an die Bettkante", ic: "sit", ph: "durch", fb: "Beine anwinkeln, auf die Seite drehen, mit dem Arm abstützen: Sie macht so viel selbst wie möglich, du führst über Becken und Schulter." },
      { t: "Kurz sitzen lassen, Kreislauf prüfen", ic: "pulse", ph: "durch", fb: "Einen Moment sitzen lassen, nach Schwindel fragen, Gesicht beobachten, Puls tasten." },
      { t: "Feste Schuhe anziehen", ic: "shoe", ph: "durch", fb: "Geschlossene Schuhe mit rutschfester Sohle. Füße flach am Boden, hüftbreit." },
      { t: "Nach vorn neigen, Gewicht auf die Füße", ic: "stand", ph: "durch", fb: "Oberkörper nach vorn, Hände auf die Oberschenkel oder Armlehne. Du stabilisierst am Becken, ziehst nicht an den Armen." },
      { t: "Drehen und langsam hinsetzen", ic: "lift", ph: "durch", fb: "Kleine Schritte zur Seite drehen, bis sie die Sitzfläche in den Kniekehlen spürt, dann langsam setzen." },
      { t: "Positionieren, Fußstützen dran", ic: "check", ph: "nach", fb: "Aufrecht und tief im Stuhl, Füße auf die Stützen, Kleidung glatt." },
      { t: "Brille, Klingel und Getränk geben", ic: "cup", ph: "nach", fb: "Brille auf, Getränk in Reichweite, Bremsen erst zum Losfahren lösen.", say: "So, jetzt sitz ich wie eine Königin." },
      { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Wie viel sie selbst konnte, Hilfsmittel, Kreislauf, Besonderheiten. So entwickelt sich der Bewegungsplan weiter." }
    ],
    wrong: [
      { t: "Unter den Achseln hochziehen", ic: "lift", ko: true, fb: "Kritisch: Das verletzt Schultergelenke und Haut und nimmt ihr jede Eigenbewegung." },
      { t: "Ohne Bremsen umsetzen", ic: "brake", ko: true, fb: "Kritisch: Der Rollstuhl rollt weg, Sturzgefahr." },
      { t: "Sofort aufstehen lassen", ic: "stand", ko: true, fb: "Kritisch: Ohne Pause im Sitzen drohen Schwindel und Sturz." },
      { t: "In Socken aufstehen lassen", ic: "shoe", ko: true, fb: "Kritisch: Socken rutschen auf dem Boden." },
      { t: "Sagen, dass ihr Mann tot ist", ic: "talk", fb: "Das ist für sie jedes Mal wie eine neue Todesnachricht. Validieren statt korrigieren." },
      { t: "Bett ganz hochfahren", ic: "bed", fb: "Dann erreichen ihre Füße den Boden nicht." }
    ],
    scene: trScene,
    status: function (i) { return ["Kontakt", "Rollstuhl", "Bremsen", "Fußstützen", "Betthöhe", "Bettkante", "Kreislauf", "Schuhe", "Aufstehen", "Hinsetzen", "Positionieren", "Umgebung", "Dokumentation"][i] || ""; },
    statusEnd: "Sicher im Rollstuhl, viel selbst gemacht",
    merke: "Bremsen, Winkel, Schuhe, Pause im Sitzen. Und: Hilf über Becken und Schulter, nie unter den Achseln."
  };

  /* ---------- Bildbefund Herr Stenzel im Sessel ---------- */
  var sp7 = {};
  function stenzScene() {
    var s = X.defs() + X.room({ disp: 0, rail: false, winX: 260 });
    s += X.g(X.r(0, 0, 80, 54, 4, "#fde68a", 2) + X.p("M10 44l20-24 16 14 10-8 14 18z", "#a7d3a0", 0), "translate(40,34)");
    /* Teppich mit umgeschlagener Kante */
    s += X.p("M60 250L120 214H330L300 250Z", "#c084fc", 2, ' opacity=".55"') + X.p("M300 250l14-22 16 4-10 18z", "#a855f7", 2);
    sp7.rug = [312, 240];
    /* Sessel */
    s += X.sh(150, 250, 80, 7) + X.r(78, 100, 30, 132, 14, "#94a3b8", 2) + X.r(86, 176, 130, 40, 12, "#a3b3c7", 2) + X.r(196, 156, 26, 64, 12, "#94a3b8", 2) + X.l(96, 216, 94, 244, X.K, 5) + X.l(206, 216, 208, 244, X.K, 5);
    /* Herr Stenzel sitzend */
    s += X.F.sitSide(STENZ, 140, 184, { sc: 1.1, mood: "tired", pants: "#6b7f99", feet: "none", arms: "rest" });
    /* geschwollene Füße in zu engen Pantoffeln */
    s += X.p("M180 246q0-16 16-16h12q12 2 12 12v6z", "#f3cdb0", 2) + X.p("M182 246q4-8 14-8h18v8z", "#b45309", 1.8);
    sp7.feet = [202, 238];
    /* Tisch: leerer Becher, volle Thermoskanne, Dosett mit Vortags-Tabletten */
    s += X.r(232, 150, 100, 10, 4, "#e9dcc7", 2) + X.l(282, 160, 282, 244, "#94a3b8", 5);
    s += X.p("M244 146l-2-18h18l-2 18z", "#ffffff", 1.8) + X.r(266, 112, 18, 36, 6, "#0ea5e9", 2) + X.r(270, 104, 10, 10, 2, "#0369a1", 1.4);
    s += X.r(292, 134, 36, 14, 3, "#ffffff", 1.6) + [0, 1, 2, 3].map(function (k) { return X.r(294 + k * 8, 136, 7, 10, 1.5, k === 1 ? "#fde68a" : "#f1f5f9", 0.8); }).join("") + X.c(306, 140, 2, "#ef4444", 0) + X.c(308, 143, 2, "#fde68a", 0);
    sp7.dosett = [310, 140];
    /* Rollator hinter dem Sessel außer Reichweite */
    s += X.g(X.walker(0, 0), "translate(22,170) scale(.9)");
    /* Brille auf der Fensterbank */
    s += X.g(X.c(0, 0, 7, "none", 1.8) + X.c(18, 0, 7, "none", 1.8) + X.l(7, 0, 11, 0, X.K, 1.8), "translate(286,112)");
    return s + X.vignette();
  }
  var stenzBild = {
    k: "stenzbild", typ: "hotspot", pat: "B", t: "Herr Stenzel · Bildbefund", kurzname: "Bildbefund im Zimmer", clock: "08:30", max: 8,
    titel: "Herr Stenzel nach dem Frühstück",
    banner: { name: "Friedrich Stenzel", sub: "84 J. · Zimmer 217 · Herzinsuffizienz, Diabetes Typ 2", chips: [["Gewicht +1,9 kg seit Montag", "red"], ["Sturz im Juni", ""]] },
    intro: "08:30 Uhr. Herr Stenzel sitzt im Sessel. Er brummt: „Lassen Sie mich, mir geht's prima. Nur die Füße drücken so.“ Bevor du die Vitalzeichen misst, schaust du dich um.",
    q: "Was fällt dir an Herrn Stenzel und in seinem Zimmer auf?",
    mood: "tired",
    art: stenzScene(),
    spots: [
      { c: [[sp7.feet[0], sp7.feet[1], 18]], t: "Geschwollene Füße in zu engen Hausschuhen", d: "Ödeme passen zur Gewichtszunahme bei Herzinsuffizienz. Enge Schuhe drücken: Gefahr von Druckstellen, besonders bei Diabetes. Füße ansehen, Gewicht und Bilanz kontrollieren, Hausarzt informieren." },
      { c: [[250, 136, 12], [275, 128, 14]], t: "Becher leer, Thermoskanne unberührt", d: "Trinkmenge erfassen und mit der ärztlich festgelegten Menge bei Herzinsuffizienz abgleichen. Nicht pauschal „mehr trinken“, sondern nach Plan." },
      { c: [[sp7.dosett[0], sp7.dosett[1], 16]], t: "Tabletten vom Vortag noch im Dosett", d: "Gestern Abend nicht eingenommen. Welche? Mit dem Plan abgleichen, Hausarzt bzw. Pflegefachperson informieren, Einnahme künftig beobachten." },
      { c: [[48, 206, 26]], t: "Rollator steht außer Reichweite", d: "Mit Sturz in der Vorgeschichte gehört der Rollator in Griffweite, bevor du gehst." },
      { c: [[sp7.rug[0], sp7.rug[1], 16]], t: "Umgeschlagene Teppichkante", d: "Klassische Stolperfalle. Glätten, sichern oder mit Einverständnis entfernen." },
      { c: [[295, 112, 16]], t: "Brille liegt auf der Fensterbank", d: "Ohne Brille sieht er Stolperfallen und seine Tabletten schlecht. Brille griffbereit legen." }
    ],
    extra: ["Dekubitus am Steiß", "Inkontinenzmaterial liegt offen", "Notrufknopf fehlt", "Zimmer zu warm"],
    cap: "Tipp: Füße, Tisch, Boden, hinter dem Sessel, Fensterbank.",
    merke: "Im Pflegeheim ist das Zimmer ein Zuhause. Du schaust trotzdem wie bei einer Visite: Was gefährdet ihn, was fehlt ihm?"
  };

  var stenzVit = {
    k: "stenzvit", typ: "vitmed", pat: "B", t: "Herr Stenzel · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Medikamente", clock: "08:40", max: 10, wVit: 0.45,
    titel: "Vitalzeichen erheben und Wochendosett prüfen",
    banner: { name: "Friedrich Stenzel", sub: "84 J. · Zimmer 217 · Herzinsuffizienz NYHA III, Diabetes Typ 2", chips: [["Trinkmenge max. 1,5 l", "warn"], ["Allergie: Penicillin", "red"]] },
    intro: "Du misst die Vitalzeichen. Danach prüfst du das Wochendosett für die Mittagsgabe, das die Apotheke geliefert hat.",
    uhr: "08:42",
    vit: {
      auftrag: "Tippe auf jedes Messgerät und wähle die richtige Technik.",
      items: [
        { k: "rr", t: "Blutdruck", kurz: "RR", val: "142/88", einheit: "mmHg", wie: "messen" },
        { k: "puls", t: "Puls", kurz: "Puls", val: "92", einheit: "/min, regelmäßig", farbe: "puls", wie: "tasten" },
        { k: "af", t: "Atmung", kurz: "AF", val: "22", einheit: "/min, Sprechdyspnoe", ico: "af", wie: "zählen", q: { text: "Er spricht in kurzen Sätzen und macht Pausen. Wie zählst du die Atemfrequenz?", opts: [
          { t: "Unauffällig eine Minute zählen und dabei Atemtiefe, Geräusche und Sprechpausen beobachten", ok: true, fb: "Richtig. Die Sprechdyspnoe ist ein wichtiger Befund zusätzlich zur Zahl." },
          { t: "Ihn bitten, tief durchzuatmen, und 15 Sekunden zählen", fb: "Zu kurz und nicht unauffällig." },
          { t: "Gar nicht, der Puls reicht", fb: "Die Atemfrequenz ist ein früher Warnparameter." }] } },
        { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "93", einheit: "%", wie: "Clip" },
        { k: "gew", t: "Gewicht", kurz: "kg", val: "81,4", einheit: "kg (Mo 79,5)", ico: "gew", wie: "wiegen", q: { text: "Wie wiegst du Herrn Stenzel für den Verlauf?", opts: [
          { t: "Morgens nach dem Toilettengang, vor dem Frühstück, gleiche Waage, gleiche Kleidung", ok: true, fb: "Richtig. Nur so sind die Werte vergleichbar. 1,9 kg in vier Tagen sprechen für Wassereinlagerung." },
          { t: "Irgendwann am Tag, Hauptsache täglich", fb: "Dann schwanken die Werte um die Mahlzeiten." },
          { t: "Schätzen, er sieht ja gleich aus", fb: "Gewicht ist bei Herzinsuffizienz der wichtigste Selbstkontrollwert." }] } },
        { k: "bz", t: "Blutzucker", kurz: "BZ", val: "164", einheit: "mg/dl", ico: "bz", wie: "messen" }
      ],
      befund: "08:44 Uhr: RR 142/88 mmHg · Puls 92/min regelmäßig · AF 22/min mit Sprechdyspnoe · SpO₂ 93 % · Gewicht 81,4 kg (+1,9 kg seit Montag) · BZ 164 mg/dl · Unterschenkel und Füße eindrückbar geschwollen.",
      act: {
        text: "Gewicht +1,9 kg, Ödeme, Sprechdyspnoe. Was tust du?",
        opts: [
          { t: "Hausarzt noch heute informieren (SBAR), Oberkörper hoch lagern, Beine nicht hochlegen ohne Rücksprache, Trinkmenge und Ausscheidung bilanzieren, Atmung engmaschig beobachten", ok: true, fb: "Richtig. Das sind Zeichen einer Verschlechterung der Herzinsuffizienz, die ärztlich beurteilt werden muss." },
          { t: "Ihm sagen, er soll mehr trinken, damit die Füße abschwellen", fb: "Falsch. Bei Herzinsuffizienz verschlechtert zusätzliche Flüssigkeit die Lage." },
          { t: "Die Wassertablette verdoppeln, die steht ja im Dosett", fb: "Eigenmächtige Dosisänderung ist keine Pflegeentscheidung." },
          { t: "Bis zur nächsten Woche beobachten", fb: "Zu spät. Die Gewichtszunahme ist ein Alarmzeichen." }
        ]
      }
    },
    med: {
      zeit: "12:00", allergie: "Penicillin (Exanthem)",
      hinweis: "Medikationsplan des Hausarztes vom 02.11., gestellt von der Apotheke im Wochendosett.",
      plan: [
        { n: "Torasemid", d: "10 mg", z: "1-1-0", h: "mittags letzte Gabe vor 14 Uhr" },
        { n: "Metformin", d: "500 mg", z: "1-1-1", h: "zu den Mahlzeiten" },
        { n: "Ramipril", d: "5 mg", z: "1-0-0", h: "nur morgens" },
        { n: "Bisoprolol", d: "2,5 mg", z: "1-0-0", h: "morgens" },
        { n: "Amoxicillin", d: "–", z: "–", h: "ALLERGIE Penicillin", aus: true }
      ],
      disp: [
        { n: "Torasemid 10 mg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "ok", fb: "Mittags angeordnet, passt." },
        { n: "Metformin 500 mg", sub: "1 Tablette", pill: { c: "#e2e8f0", s: "oval" }, r: "ok", fb: "Zur Mahlzeit, passt." },
        { n: "Ramipril 5 mg", sub: "1 Tablette", pill: { c: "#fecaca", s: "oval" }, r: "zeit", fb: "Nur morgens angeordnet. Im Mittagsfach ist es falsch eingeordnet: Apotheke informieren, Fach korrigieren lassen." },
        { n: "Amoxicillin 1000 mg", sub: "1 Tablette „vom Bereitschaftsarzt“", pill: { c: "#fef3c7", s: "kapsel", c2: "#f59e0b" }, r: "allergie", fb: "Amoxicillin ist ein Penicillin. Bei bekannter Allergie nicht geben, Arzt sofort informieren, Allergie prominent vermerken." }
      ],
      fehlt: {
        text: "Was klärst du zusätzlich mit dem Hausarzt? (Mehrfachauswahl)",
        opts: [
          { t: "Gewichtszunahme und Ödeme: Anpassung der Diuretika", ok: true, fb: "Die Dosis legt der Arzt fest, du lieferst Gewicht, Bilanz und Befund." },
          { t: "Woher die Amoxicillin-Verordnung kommt, und Alternative bei Penicillinallergie", ok: true, fb: "Die Verordnung muss geklärt werden." },
          { t: "Die nicht eingenommenen Tabletten von gestern Abend", ok: true, fb: "Welche, warum, Konsequenz." },
          { t: "Ob er Kaffee trinken darf", ok: false, fb: "Nicht vorrangig." }
        ]
      }
    },
    merke: "Gewicht ist bei Herzinsuffizienz der wichtigste Wert. Und ein gestelltes Dosett ist eine Vorarbeit, keine Freigabe."
  };

  var beratung = {
    k: "fuss", typ: "beratung", pat: "C", t: "Herr Dietrich · Beratung Fußpflege", kurzname: "Beratung diabetischer Fuß", clock: "11:00", max: 6,
    titel: "Was darf ich an meinen Füßen selbst machen?",
    banner: { name: "Klaus Dietrich", sub: "76 J. · Zimmer 220 · Diabetes Typ 2 mit Polyneuropathie, seit 2 Wochen im Haus", chips: [["Gefühl in den Füßen vermindert", "red"], ["selbstständig", ""]] },
    intro: "11:00 Uhr. Herr Dietrich ist neu eingezogen, früher war er Schreiner. Er sitzt auf der Bettkante, die Socken in der Hand, und hat eine Hornhautraspel dabei.",
    person: { name: "Herr Dietrich" },
    qs: [
      { q: "„Die Hornhaut an der Ferse, die raspel ich immer selbst weg. Und die eingewachsene Ecke am großen Zeh schneid ich mit der Nagelschere raus. Passt doch?“", re: "„Hm. Na gut, dann mach ich nur noch das mit der Feile.“", opts: [
        { t: "„Mit der Polyneuropathie spüren Sie kleine Verletzungen nicht. Bitte keine scharfen Werkzeuge: Nägel gerade feilen, Hornhaut und eingewachsene Nägel macht die medizinische Fußpflege (Podologie), die kann der Hausarzt verordnen.“", ok: true, fb: "Richtig. Kleine Verletzungen werden bei Neuropathie zum Ulkus. Podologie ist bei diabetischem Fußsyndrom verordnungsfähig." },
        { t: "„Ja, wenn Sie vorsichtig sind.“", fb: "Gefährlich: Er spürt Verletzungen nicht." },
        { t: "„Das macht ab jetzt immer die Pflege, Sie fassen Ihre Füße nicht mehr an.“", fb: "Nimmt ihm Selbstständigkeit. Er darf feilen und täglich kontrollieren." }
      ] },
      { q: "„Abends stell ich die Füße ins heiße Wasser, so 15 Minuten, das tut gut.“", re: "„Mit dem Thermometer? Das hab ich noch vom Enkel.“", opts: [
        { t: "„Fußbäder höchstens 3 bis 5 Minuten und lauwarm, unter 37 °C, mit dem Thermometer gemessen. Sie spüren Hitze schlecht, und lange Bäder weichen die Haut auf. Danach gut abtrocknen, auch zwischen den Zehen.“", ok: true, fb: "Richtig. Verbrühungen und aufgeweichte Haut sind typische Ursachen für Wunden." },
        { t: "„Ja, heiß regt die Durchblutung an.“", fb: "Falsch. Verbrühungsgefahr." },
        { t: "„Fußbäder sind ganz verboten.“", fb: "Zu pauschal. Kurz und lauwarm ist in Ordnung." }
      ] },
      { q: "„Wie soll ich denn merken, wenn da was ist? Ich seh ja schlecht da unten hin.“", re: "„Mit dem Spiegel? Das ist ja pfiffig.“", opts: [
        { t: "„Jeden Abend die Füße mit einem Handspiegel ansehen, auch Sohle und Zehenzwischenräume. Rötung, Blasen, Risse oder Wunden zeigen Sie bitte sofort uns.“", ok: true, fb: "Richtig. Tägliche Selbstkontrolle mit Hilfsmittel, und er weiß, wann er sich meldet." },
        { t: "„Wenn's weh tut, merken Sie es schon.“", fb: "Genau das funktioniert bei Polyneuropathie nicht." },
        { t: "„Das brauchen Sie nicht, wir schauen einmal im Monat.“", fb: "Zu selten." }
      ] },
      { q: "„Und Schuhe? Ich lauf im Zimmer gern barfuß, ist doch gesund.“", re: "„Na gut. Dann die Hausschuhe mit dem Klett.“", opts: [
        { t: "„Bitte nie barfuß, auch nicht im Zimmer. Gut sitzende, geschlossene Schuhe, vor dem Anziehen mit der Hand innen nach Steinchen tasten. Den Hausarzt fragen wir nach einer Verordnung für passende Schuhe.“", ok: true, fb: "Richtig. Barfußlaufen ist bei Neuropathie ein hohes Verletzungsrisiko." },
        { t: "„Im Zimmer ist barfuß okay, da liegt ja nichts.“", fb: "Auch im Zimmer können Gegenstände oder Bettkanten verletzen." },
        { t: "„Am besten die alten, ausgetretenen Hausschuhe, die drücken nicht.“", fb: "Ausgetretene Schuhe geben keinen Halt und reiben." }
      ] },
      { q: "„Die Haut ist so rissig an der Ferse. Soll ich da Babyöl drauf und auch zwischen die Zehen?“", re: "„Harnstoff, aha. Schreiben Sie mir das auf?“", opts: [
        { t: "„Für die Ferse eignet sich eine Fußcreme mit Harnstoff (Urea), aber nicht zwischen die Zehen, da bleibt es feucht und es können sich Pilze bilden.“", ok: true, fb: "Richtig. Harnstoffhaltige Pflege bei trockener Haut, Zehenzwischenräume trocken halten." },
        { t: "„Ja, Babyöl überall, auch zwischen die Zehen.“", fb: "Feuchte Zehenzwischenräume begünstigen Pilzinfektionen." },
        { t: "„Gar nichts eincremen, das macht die Haut faul.“", fb: "Trockene, rissige Haut ist eine Eintrittspforte." }
      ] },
      { q: "„Und wenn ich mir doch mal was einreiße, mach ich ein Pflaster drauf und gut ist, oder?“", re: "„Lieber einmal zu viel. Verstanden.“", opts: [
        { t: "„Bitte jede noch so kleine Wunde sofort zeigen. Bei Diabetes heilen Wunden schlecht, wir informieren den Hausarzt. Keine Hühneraugenpflaster, keine scharfen Desinfektionsmittel.“", ok: true, fb: "Richtig. Jede Wunde am diabetischen Fuß ist ein Fall für die ärztliche Beurteilung." },
        { t: "„Ja, Pflaster reicht.“", fb: "Kleine Wunden können sich unbemerkt infizieren." },
        { t: "„Am besten ein Hühneraugenpflaster, das löst die Haut.“", fb: "Salicylsäure-Pflaster verursachen bei Neuropathie Wunden." }
      ] }
    ],
    merke: "Füße täglich ansehen, nie barfuß, nichts Scharfes, lauwarm, Harnstoff an die Ferse, nichts zwischen die Zehen. Und jede Wunde zeigen."
  };

  var C = {
    id: "langzeit", titel: "Zuhause auf Zeit: drei Menschen im Wohnbereich", station: "Stationäre Langzeitpflege · Wohnbereich 2", haus: "Seniorenzentrum Lindenhof", farbe: "#059669",
    icon: "M3 21V9l9-6 9 6v12M9 21v-6h6v6",
    kurz: "Eine Bewohnerin mit Demenz, die zum Frühstück will, ein brummiger Herr mit Herzinsuffizienz, der zu viel wiegt, und ein neuer Bewohner, der seine Füße mit der Raspel bearbeitet.",
    anleitung: "Birgit Hansen", pruefer: "Herr Kaiser",
    nachtLabel: "Tag 2 · 06:00 Uhr · Übergabe vom Nachtdienst",
    people: {
      anleitung: { name: "Birgit Hansen", av: { hair: "GH", hairC: "#cfd2d6", skin: "#f6d2b3", cloth: "#059669", deco: "badge", bg: "#e7f4e4", glasses: 1 } },
      pruefer: { name: "Herr Kaiser", av: { hair: "WB", hairC: "#9aa3ab", skin: "#f6d2b3", cloth: "#475569", deco: "collar", bg: "#e6edf5" } },
      nacht: { name: "Marek Nowak", role: "Nachtdienst", av: { hair: "JW", hairC: "#6b4a2f", skin: "#f6d2b3", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3", beard: 1, beardC: "#6b4a2f" } },
      tochter: { name: "Renate Busch", match: "tochter|renate", av: { hair: "EN", hairC: "#7a5233", skin: "#f6d2b3", cloth: "#f2b8c6", bg: "#fde8e8" } },
      bewohner: { name: "Herr Pohlmann", match: "pohlmann", av: { hair: "HK", hairC: "#d6d9dd", skin: "#f6d2b3", cloth: "#9cc3e6", bg: "#ddeeff", wrinkles: 1 } }
    },
    briefing: [
      "Herzlich willkommen im Lindenhof, Wohnbereich 2. Ich bin Birgit Hansen, Praxisanleiterin hier. Herr Kaiser von der Pflegeschule ist morgen als Fachprüfer dabei. Bei uns wohnen 28 Menschen, viele mit Demenz, fast alle mit mehreren Erkrankungen. Das hier ist ihr Zuhause, wir sind Gäste in ihrem Alltag.",
      "Deine drei Menschen: Frau Busch hat eine mittelgradige Demenz und vor drei Wochen einen Sturz mit Schenkelhalsfraktur gehabt. Herr Stenzel hat eine Herzinsuffizienz und Diabetes, er ist ein Brummbär mit Herz. Und Herr Dietrich ist vor zwei Wochen neu eingezogen, Diabetes mit Polyneuropathie.",
      "Was ich jedem sage: In der Langzeitpflege siehst du Verschlechterungen oft zuerst an Kleinigkeiten. Ein Kilo mehr auf der Waage, ein unberührter Becher, ein Mensch, der plötzlich nicht mehr zum Frühstück will. Und die Medikamente aus dem Wochendosett prüfst du jedes Mal selbst, auch wenn die Apotheke sie gestellt hat."
    ],
    order: ["A", "B", "C"],
    pat: {
      A: {
        key: "A", name: "Elfriede Busch", kurz: "Frau Busch", alter: 88, zimmer: "214", modus: "Pflegehandlung", farbe: "#7C3AED", av: BUSCH,
        typ: "Ehemalige Schneiderin, freundlich und gesellig, sucht oft nach ihrem verstorbenen Mann, singt gern Volkslieder.",
        diagnose: "Alzheimer-Demenz, mittelgradig (MMST 14); Zustand nach Schenkelhalsfraktur links vor 3 Wochen, Hemiendoprothese; Osteoporose.",
        daten: [
          ["Vorerkrankungen", "Alzheimer-Demenz, Osteoporose, arterielle Hypertonie, Harninkontinenz"],
          ["Allergien", "keine bekannt"],
          ["Pflegegrad / Betreuung", "Pflegegrad 4 · rechtliche Betreuerin für Gesundheitssorge: Tochter Renate Busch"],
          ["Medikation", "Donepezil 10 mg 0-0-1 · Amlodipin 5 mg 1-0-0 · Colecalciferol 1.000 IE 1-0-0 · Alendronsäure 70 mg montags · Paracetamol 500 mg bei Bedarf"],
          ["Mobilität", "Transfer mit 1 Person und Rollator; Gehen kurze Strecken mit Begleitung; Hüftprotektor; Bewegungsplan"],
          ["Ernährung", "BMI 19,8, Gewicht leicht abnehmend; isst gern Süßes, braucht Erinnerung zum Trinken"]
        ],
        anamnese: "Ach, Sie sind ja eine Nette. Ich muss gleich los, mein Mann wartet doch mit dem Frühstück. Der Konrad, der kann ja nicht mal ein Ei kochen. Ich war Schneiderin, wissen Sie, ich hab Brautkleider genäht, die schönsten. Hier tut mir das Bein weh, das linke, da war was. Ich weiß gar nicht mehr, wie ich hierhergekommen bin. Nachts ist es so dunkel, da such ich das Klo. Einmal bin ich hingefallen, glaub ich. Trinken? Ich hab doch keinen Durst. Kuchen ess ich gern. Singen wir was? Am Brunnen vor dem Tore …",
        kern: [
          { t: "Sucht ihren verstorbenen Mann: Validation statt Korrektur", kw: ["mann", "konrad", "valid", "verstorb", "sucht"] },
          { t: "Sturz mit Schenkelhalsfraktur, nachts desorientiert auf dem Weg zur Toilette: hohe Sturzgefahr", kw: ["sturz", "nachts", "toilette", "dunkel", "klo", "gefallen"] },
          { t: "Schmerzen im linken Bein, äußert sie nur nebenbei: Schmerzerfassung mit Fremdeinschätzung (z. B. BESD)", kw: ["schmerz", "bein", "besd", "weh"] },
          { t: "Kein Durstgefühl: Exsikkosegefahr", kw: ["trink", "durst", "flüssigkeit", "exsikk"] },
          { t: "Gewichtsabnahme, isst gern Süßes: Ernährung beobachten", kw: ["gewicht", "ernähr", "kuchen", "süß", "bmi"] },
          { t: "Ressourcen: Singen, Erinnerungen an den Beruf, gesellig", kw: ["sing", "schneider", "lied", "ressource", "biografie"] },
          { t: "Inkontinenz und nächtliche Unruhe", kw: ["inkontin", "unruh", "nacht"] },
          { t: "Rechtliche Betreuung durch die Tochter", kw: ["tochter", "betreu"] }
        ]
      },
      B: {
        key: "B", name: "Friedrich Stenzel", kurz: "Herr Stenzel", alter: 84, zimmer: "217", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#0891B2", av: STENZ,
        typ: "Ehemaliger Busfahrer, brummig und wortkarg, hasst es, bevormundet zu werden, liebt seinen Schrebergarten.",
        diagnose: "Chronische Herzinsuffizienz NYHA III (HFrEF), Diabetes mellitus Typ 2, chronische Niereninsuffizienz G3a; im Wohnbereich seit 2 Jahren.",
        daten: [
          ["Vorerkrankungen", "Herzinsuffizienz, Diabetes Typ 2, CKD G3a, Gonarthrose, Sturz im Juni"],
          ["Allergien", "Penicillin (Exanthem)"],
          ["Pflegegrad", "Pflegegrad 3 · selbstständig im Zimmer mit Rollator"],
          ["Medikation", "Torasemid 10 mg 1-1-0 · Ramipril 5 mg 1-0-0 · Bisoprolol 2,5 mg 1-0-0 · Metformin 500 mg 1-1-1"],
          ["Ärztliche Vorgaben", "Trinkmenge max. 1,5 l/Tag · tägliches Gewicht, bei mehr als 2 kg in 3 Tagen Hausarzt informieren"],
          ["Gewicht", "Mo 79,5 kg · Di 80,1 kg · Mi 80,8 kg"]
        ],
        anamnese: "Was wollen Se? Mir geht's gut. Ich bin 40 Jahre Bus gefahren, da wird man nicht wehleidig. Die Füße, ja, die drücken ein bisschen, die Schuhe sind wohl eingelaufen. Nachts schlaf ich jetzt im Sessel, im Bett krieg ich keine Luft, wenn ich flach liege. Die Tabletten da im Kasten, die nehm ich, wenn ich dran denk. Gestern Abend war Fußball, da hab ich's vergessen. Trinken soll ich ja nicht so viel, aber der Kaffee ist das Einzige, was mir hier schmeckt. Im Garten war ich schon ewig nicht mehr, zu weit.",
        kern: [
          { t: "Schläft im Sessel, weil er im Liegen keine Luft bekommt: Orthopnoe", kw: ["sessel", "orthopnoe", "luft", "flach", "liegen"] },
          { t: "Füße drücken: Ödeme bei Herzinsuffizienz", kw: ["ödem", "füße", "schuh", "geschwoll", "drück"] },
          { t: "Gewicht steigt täglich: Wassereinlagerung", kw: ["gewicht", "kilo", "kg", "zunahme", "wasser"] },
          { t: "Tabletten werden vergessen (Adhärenz)", kw: ["tablette", "vergess", "dosett", "adhärenz", "einnahme"] },
          { t: "Trinkmenge begrenzt, trinkt viel Kaffee", kw: ["trink", "kaffee", "1,5", "flüssigkeit"] },
          { t: "Penicillinallergie", kw: ["penicillin", "allerg"] },
          { t: "Sturzgefahr (Sturz im Juni, Rollator)", kw: ["sturz", "rollator"] },
          { t: "Ressource und Ziel: Schrebergarten", kw: ["garten", "schreber", "ziel", "ressource"] }
        ]
      },
      C: {
        key: "C", name: "Klaus Dietrich", kurz: "Herr Dietrich", alter: 76, zimmer: "220", modus: "Beratung", farbe: "#D97706", av: DIETR,
        typ: "Ehemaliger Schreiner, handwerklich geschickt, will alles selbst machen, misstraut „Pillen und Papierkram“.",
        diagnose: "Diabetes mellitus Typ 2 seit 20 Jahren mit sensibler Polyneuropathie beider Füße; Zustand nach Hirninfarkt vor 6 Monaten ohne bleibende Lähmung; Einzug vor 2 Wochen.",
        daten: [
          ["Vorerkrankungen", "Diabetes Typ 2 mit Polyneuropathie, Z. n. Hirninfarkt, Hypertonie, Katarakt beidseits"],
          ["Allergien", "keine bekannt"],
          ["Pflegegrad", "Pflegegrad 2 · weitgehend selbstständig"],
          ["Medikation", "Insulin glargin 16 IE 22 Uhr (verabreicht die Pflege) · Metformin 1000 mg 1-0-1 · ASS 100 mg 1-0-0 · Atorvastatin 20 mg 0-0-1"],
          ["Fußbefund bei Einzug", "Hornhaut Ferse beidseits, Nagel D1 rechts eingewachsen, Monofilament-Test vermindert"],
          ["HbA1c", "7,9 %"]
        ],
        anamnese: "Ich hab mein Leben lang mit den Händen gearbeitet, da lass ich mir nicht von jedem was erzählen. Die Füße mach ich selbst, Hornhaut raspeln, Nägel schneiden, das kann ich besser als jeder Fußpfleger. Spüren tu ich da unten eh nicht mehr viel, das ist wie Watte. Im Zimmer lauf ich barfuß, das ist gesund. Abends ein heißes Fußbad, so wie früher. Neulich hatte ich eine Blase, hab ich aufgestochen und Pflaster drauf. Sehen tu ich auch nicht mehr so gut, grauer Star. Aber das wird schon.",
        kern: [
          { t: "Polyneuropathie: spürt Verletzungen nicht („wie Watte“)", kw: ["watte", "spür", "neuropath", "gefühl"] },
          { t: "Bearbeitet Hornhaut und Nägel selbst mit Raspel und Schere: Verletzungsgefahr", kw: ["raspel", "schere", "nägel", "hornhaut", "selbst"] },
          { t: "Läuft barfuß", kw: ["barfuß", "schuh"] },
          { t: "Heiße Fußbäder: Verbrühungsgefahr", kw: ["fußbad", "heiß", "verbrüh"] },
          { t: "Blase aufgestochen: Infektionsgefahr, Wunde nicht gemeldet", kw: ["blase", "aufgestoch", "wunde", "pflaster"] },
          { t: "Sehschwäche (Katarakt): Selbstkontrolle der Füße erschwert", kw: ["star", "katarakt", "seh"] },
          { t: "Misstrauen, will selbstständig bleiben: Beratung auf Augenhöhe", kw: ["selbst", "misstrau", "augenhöhe"] },
          { t: "Ressource: handwerklich geschickt", kw: ["handwerk", "schreiner", "ressource"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Sturzgefahr (NANDA-I 00155) b/d Demenz, nächtlicher Desorientierung, Z. n. Schenkelhalsfraktur und Osteoporose, a/d Sturz vor drei Wochen. Dazu: Gefahr eines Flüssigkeitsdefizits (00028) a/d fehlendem Durstgefühl; Schmerzen (00133) a/d Äußerungen zum linken Bein.",
        ziel: "Frau Busch stürzt im Wohnbereich nicht. Sie trinkt mit Erinnerung mindestens 1.300 ml am Tag. Ihre Schmerzen werden mit BESD erfasst und liegen unter 4 Punkten.",
        mass: [
          "Sturzprophylaxe nach Expertenstandard: Bewegungsplan, Hüftprotektor, Nachtlicht und Toilettengang nach Plan, Bett niedrig, feste Schuhe",
          "Transfer und Gehen mit Ressourcenförderung, Physiotherapie einbinden",
          "Trinkplan mit Vorlieben, Becher in Sicht- und Greifweite, Trinkprotokoll",
          "Schmerzerfassung mit BESD, Bedarfsmedikation nach Anordnung, Wirkung beobachten",
          "Validation, Biografiearbeit (Schneiderin, Lieder), Tochter einbeziehen"
        ],
        chk: [
          { t: "Sturzgefahr als Diagnose mit Ursachen", kw: ["sturz"] },
          { t: "Flüssigkeit oder Schmerz als weiteres Problem", kw: ["flüssig", "trink", "schmerz"] },
          { t: "Überprüfbares Ziel (Trinkmenge, kein Sturz, BESD)", kw: ["ml", "besd", "kein sturz", "stürzt nicht"] },
          { t: "Expertenstandard Sturzprophylaxe / Hilfsmittel", kw: ["expertenstandard", "protektor", "nachtlicht", "bewegungsplan"] },
          { t: "Schmerzerfassung bei Demenz (BESD)", kw: ["besd", "fremdeinsch"] },
          { t: "Validation oder Biografie", kw: ["valid", "biograf", "lied", "sing"] }
        ]
      },
      B: {
        diag: "Flüssigkeitsüberschuss (00026) b/d Herzinsuffizienz und unregelmäßiger Medikamenteneinnahme, a/d Gewichtszunahme 1,3 kg in 2 Tagen, Ödeme, Orthopnoe. Dazu: Unwirksames Gesundheitsverhalten (00099) a/d vergessenen Tabletten.",
        ziel: "Herr Stenzel wiegt sich täglich mit Hilfe und kennt seine Grenze (2 kg in 3 Tagen). Die Trinkmenge liegt bei maximal 1,5 l. Er nimmt seine Tabletten unter Beobachtung ein.",
        mass: [
          "Tägliches Gewicht unter gleichen Bedingungen, Trend dokumentieren, Hausarzt bei Überschreitung informieren",
          "Trinkmenge bilanzieren, Kaffee in die Menge einrechnen, Becher nach Plan",
          "Oberkörperhochlage, Atmung beobachten, Füße und Haut kontrollieren (Diabetes)",
          "Medikamente stellen und Einnahme beobachten, Gründe für Vergessen besprechen",
          "Ressource Garten nutzen: Ziel gemeinsam vereinbaren (z. B. Hochbeet im Innenhof)"
        ],
        chk: [
          { t: "Flüssigkeitsüberschuss / Herzinsuffizienz als Diagnose", kw: ["überschuss", "ödem", "herzinsuff", "wasser"] },
          { t: "Gewicht als Kennzeichen und Ziel", kw: ["gewicht", "kg"] },
          { t: "Trinkmenge 1,5 l", kw: ["1,5", "trink"] },
          { t: "Tägliches Wiegen unter gleichen Bedingungen", kw: ["täglich", "wiegen", "waage"] },
          { t: "Medikamenteneinnahme / Adhärenz", kw: ["tablette", "einnahme", "adhärenz", "dosett"] },
          { t: "Ressource Garten", kw: ["garten"] }
        ]
      },
      C: {
        diag: "Gefahr einer Verletzung der Füße / Gefahr eines diabetischen Fußulkus (00248) b/d Polyneuropathie und Sehminderung, a/d Selbstbehandlung mit Raspel und Schere, Barfußlaufen, heißen Fußbädern. Dazu: Wissensdefizit (00126) zur Fußpflege bei Diabetes.",
        ziel: "Herr Dietrich nennt nach der Beratung drei Regeln zur Fußpflege und zeigt die tägliche Fußkontrolle mit Spiegel. Er nimmt ab nächster Woche einen Termin bei der Podologie wahr.",
        mass: [
          "Beratung zur Fußpflege bei Diabetes mit Teach-back, schriftliche Merkkarte in großer Schrift",
          "Tägliche Fußinspektion (mit ihm, Handspiegel), Befund dokumentieren",
          "Hausarzt: Verordnung Podologie und angepasstes Schuhwerk",
          "Schuhe kontrollieren, nie barfuß, lauwarme kurze Fußbäder",
          "Augenarzt-Termin wegen Katarakt anregen"
        ],
        chk: [
          { t: "Verletzungs- oder Ulkusgefahr mit Neuropathie", kw: ["verletz", "ulkus", "neuropath", "fuß"] },
          { t: "Wissensdefizit / Beratungsbedarf", kw: ["wissen", "beratung"] },
          { t: "Ziel mit Teach-back oder Demonstration", kw: ["teach", "zeigt", "nennt"] },
          { t: "Podologie / Hausarzt", kw: ["podolog", "fußpfleg", "hausarzt"] },
          { t: "Tägliche Inspektion", kw: ["täglich", "spiegel", "inspektion", "kontroll"] },
          { t: "Schuhe / barfuß / Fußbad", kw: ["schuh", "barfuß", "fußbad"] }
        ]
      }
    },
    nacht: [
      ["A", "Frau Busch: Um 02:30 Uhr stand sie im Flur und hat ihren Mann gesucht, ich hab sie zurückbegleitet, Toilettengang, dann hat sie geschlafen. Inkontinenzmaterial nass, Haut intakt. Sie hat gestern nur 900 ml getrunken."],
      ["B", "Herr Stenzel: Hat die Nacht im Sessel geschlafen, sagt, im Bett kriegt er keine Luft. Hat zweimal geklingelt, wollte das Fenster auf. Die Abendtabletten lagen heute früh noch im Dosett."],
      ["C", "Herr Dietrich: Insulin 22 Uhr gegeben, BZ 186. Er lief barfuß über den Flur zum Getränkewagen. An der rechten Ferse klebt ein Pflaster, er sagt, das ist nichts."]
    ],
    sbar: {
      A: { muster: { S: "Frau Busch, 88, Zimmer 214, Demenz, Z. n. Schenkelhalsfraktur vor 3 Wochen. Heute Nacht desorientiert im Flur, Trinkmenge gestern nur 900 ml.", B: "Alzheimer-Demenz, Osteoporose, Inkontinenz, Hüftprotektor, Transfer mit einer Person.", A: "Hohe Sturzgefahr nachts und Exsikkosegefahr. Schmerzen im linken Bein werden nur nebenbei geäußert.", R: "Bewegungsplan und Nachtlicht prüfen, Trinkplan mit Vorlieben, BESD vor dem Transfer, Transfer mit Ressourcenförderung." },
        chk: [{ t: "S: nächtliche Unruhe und geringe Trinkmenge", kw: ["nacht", "900", "trink", "flur"] }, { t: "B: Demenz, Fraktur, Osteoporose", kw: ["demenz", "fraktur", "osteopor"] }, { t: "A: Sturz- und Exsikkosegefahr", kw: ["sturz", "exsikk", "flüssig"] }, { t: "R: Trinkplan, BESD, Transfer", kw: ["trinkplan", "besd", "transfer"] }, { t: "Schmerz erwähnt", kw: ["schmerz", "bein"] }] },
      B: { muster: { S: "Herr Stenzel, 84, Zimmer 217, Herzinsuffizienz. Schläft im Sessel wegen Atemnot im Liegen, Gewicht steigt seit Montag, Abendtabletten nicht genommen.", B: "Herzinsuffizienz NYHA III, Diabetes Typ 2, CKD, Penicillinallergie, Trinkmenge max. 1,5 l.", A: "Verdacht auf Verschlechterung der Herzinsuffizienz mit Wassereinlagerung.", R: "Heute wiegen, Vitalzeichen mit Atmung, Ödeme ansehen, Hausarzt informieren, Bilanz." },
        chk: [{ t: "S: Orthopnoe, Gewicht, Tabletten", kw: ["sessel", "luft", "gewicht", "tablette"] }, { t: "B: Herzinsuffizienz, Allergie, Trinkmenge", kw: ["herzinsuff", "penicillin", "1,5"] }, { t: "A: Wassereinlagerung / Verschlechterung", kw: ["wasser", "verschlecht", "dekompens", "ödem"] }, { t: "R: wiegen, Hausarzt", kw: ["wieg", "hausarzt", "arzt"] }, { t: "Bilanz", kw: ["bilanz", "trinkmenge"] }] },
      C: { muster: { S: "Herr Dietrich, 76, Zimmer 220, Diabetes mit Polyneuropathie, seit 2 Wochen im Haus. Pflaster an der rechten Ferse, läuft barfuß.", B: "Diabetes Typ 2 seit 20 Jahren, Neuropathie, Katarakt, Insulin abends.", A: "Hohe Gefahr für ein diabetisches Fußulkus, Wunde unter dem Pflaster unklar.", R: "Fuß heute ansehen, Befund dem Hausarzt melden, Beratung zur Fußpflege um 11 Uhr." },
        chk: [{ t: "S: Pflaster Ferse, barfuß", kw: ["pflaster", "ferse", "barfuß"] }, { t: "B: Neuropathie", kw: ["neuropath", "polyneur"] }, { t: "A: Ulkusgefahr", kw: ["ulkus", "wunde", "fuß"] }, { t: "R: Fuß ansehen, Hausarzt, Beratung", kw: ["ansehen", "hausarzt", "beratung"] }, { t: "Sehschwäche berücksichtigt", kw: ["star", "katarakt", "seh"] }] }
    },
    prio: [
      { id: "s1", t: "Herr Stenzel: Atmung, Vitalzeichen und Gewicht nach der Nacht im Sessel", zeit: "06:20", warum: "Atemnot im Liegen und steigendes Gewicht sind Zeichen einer Verschlechterung." },
      { id: "b1", t: "Frau Busch: Toilettengang, Inkontinenzversorgung, Getränk anbieten", zeit: "06:45", warum: "Nach unruhiger Nacht, Haut schützen, Trinkmenge starten." },
      { id: "d1", t: "Herr Dietrich: BZ vor dem Frühstück und Fuß unter dem Pflaster ansehen", zeit: "07:00", warum: "BZ zeitgebunden an die Mahlzeit, mögliche Wunde bei Neuropathie." },
      { id: "b2", t: "Frau Busch: Schmerzeinschätzung (BESD), dann Transfer in den Rollstuhl zum Frühstück", zeit: "07:30", warum: "Erst Schmerz, dann Bewegung; Frühstück in Gemeinschaft." },
      { id: "md", t: "Medikamente prüfen und verabreichen, Einnahme beobachten", zeit: "08:00", warum: "R-Regeln, Wochendosett jedes Mal selbst prüfen." },
      { id: "s2", t: "Herr Stenzel: Hausarzt informieren (SBAR), Bilanz anlegen", zeit: "09:00", warum: "Ärztliche Entscheidung über Diuretika." },
      { id: "c1", t: "Herr Dietrich: Beratung zur Fußpflege", zeit: "11:00", warum: "Geplantes Gespräch mit Ruhe und Zeit." },
      { id: "do", t: "Dokumentation, Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend dokumentieren, hier vervollständigen." }
    ],
    live: [transfer, stenzBild, stenzVit, beratung],
    st: {
      clock: "10:10", titel: "Sturz im Gemeinschaftsraum", who: "bewohner",
      situation: "10:10 Uhr. Im Gemeinschaftsraum ist Herr Pohlmann (91, Bewohner deiner Kollegin) beim Aufstehen vom Stuhl gestürzt. Er liegt auf der Seite und sagt: „Mein Kopf, ich hab mir den Kopf gestoßen.“ Er nimmt Apixaban. Gleichzeitig ruft die Tochter von Frau Busch an und will wissen, warum ihre Mutter „schon wieder“ im Rollstuhl sitzt.",
      order: [
        { id: "a", t: "Zu Herrn Pohlmann: ansprechen, nicht hochziehen, Ersteinschätzung (Bewusstsein, Atmung, Blutung, Schmerzen, Fehlstellung), Hilfe rufen", warum: "Akute Gefährdung vor allem anderen." },
        { id: "b", t: "Bei Kopfanprall unter Antikoagulation: Hausarzt bzw. Notarzt nach Hausstandard informieren", warum: "Gefahr einer Hirnblutung." },
        { id: "c", t: "Erst nach Ausschluss von Verletzungen mit Hilfsmittel und zweiter Person aufhelfen, Vitalzeichen, neurologische Beobachtung", warum: "Sicheres Aufhelfen, engmaschige Kontrolle." },
        { id: "d", t: "Die Tochter von Frau Busch zurückrufen, sobald die Lage gesichert ist", warum: "Angehörige informieren, aber nicht vor der akuten Versorgung." },
        { id: "e", t: "Sturzprotokoll und Dokumentation, Übergabe an die Kollegin", warum: "Lückenlose Dokumentation, Sturzanalyse." }
      ],
      mc: { text: "Was gehört zur Beobachtung nach einem Sturz mit Kopfanprall? (Mehrfachauswahl)", opts: [
        { t: "Bewusstsein, Pupillen, Orientierung in festen Abständen", ok: true, fb: "Neurologische Kontrolle." },
        { t: "Übelkeit, Erbrechen, Kopfschmerz zunehmend", ok: true, fb: "Hinweise auf Hirndruck." },
        { t: "Vitalzeichen und Schmerzen, auch an Hüfte und Handgelenk", ok: true, fb: "Typische Frakturstellen." },
        { t: "Ihn zur Beruhigung schlafen lassen und erst morgen nachsehen", ok: false, fb: "Gefährlich: Bewusstseinsänderung würde übersehen." }
      ] },
      merke: "Nach einem Sturz: nicht hochziehen, erst einschätzen. Kopfanprall unter Antikoagulation ist immer ein ärztlicher Fall."
    },
    doku: {
      clock: "12:00",
      auftrag: "Schreibe den Pflegebericht zu Herrn Stenzel für 08:30 bis 09:15 Uhr. Ergänzend: Hausarzt Dr. Weller hat um 09:10 Uhr telefonisch angeordnet: Torasemid 20 mg 1-1-0 ab heute, Gewicht täglich, Rückmeldung morgen; Amoxicillin abgesetzt, stattdessen Doxycyclin.",
      muster: "08:30 Pat. im Sessel, äußert: „Nur die Füße drücken so.“ Unterschenkel und Füße beidseits eindrückbar geschwollen, Hausschuhe zu eng, gegen Klettschuhe getauscht. 08:44 RR 142/88 mmHg, P 92/min regelmäßig, AF 22/min mit Sprechdyspnoe, SpO₂ 93 %, Gewicht 81,4 kg (Mo 79,5 kg), BZ 164 mg/dl. Abendtabletten vom Vortag im Dosett, nicht eingenommen. Im Mittagsfach Ramipril (nur morgens angeordnet) und Amoxicillin bei Penicillinallergie gefunden, entfernt, Apotheke informiert. 09:10 Telefonat Dr. Weller (SBAR), AO: Torasemid 20 mg 1-1-0 ab heute, Gewicht täglich, Rückmeldung morgen; Amoxicillin abgesetzt, Doxycyclin. Pat. informiert, Oberkörper hoch, Rollator und Brille in Reichweite, Teppich gesichert. [Name, HZ]",
      chk: [
        { t: "Uhrzeiten", kw: ["08:", "09:"] },
        { t: "Werte mit Einheiten inkl. Gewicht und Verlauf", kw: ["mmhg", "kg", "/min"] },
        { t: "Wörtliche Aussage", kw: ["„", "äußert"] },
        { t: "Ödeme beschrieben", kw: ["ödem", "geschwollen", "eindrück"] },
        { t: "Medikationsfehler im Dosett", kw: ["ramipril", "amoxicillin", "dosett", "entfernt"] },
        { t: "Telefonische Anordnung mit Name und Uhrzeit", kw: ["dr.", "weller", "ao", "telefon"] },
        { t: "Maßnahmen zur Sicherheit", kw: ["rollator", "teppich", "brille"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "08:44 Gewicht 81,4 kg (Mo 79,5 kg), RR 142/88 mmHg.", bad: false, fb: "In Ordnung." },
          { t: "Bew. war wieder schlecht drauf und unkooperativ.", bad: true, fb: "Wertend und unbestimmt. Beobachtungen beschreiben." },
          { t: "Füße dick.", bad: true, fb: "Ohne Ausmaß, Seite und Art nicht verwertbar." },
          { t: "09:10 telefonische AO Dr. Weller: Torasemid 20 mg 1-1-0, zurückgelesen.", bad: false, fb: "In Ordnung, mit Read-back." },
          { t: "Tabletten gegeben.", bad: true, fb: "Welche, wann, von wem?" },
          { t: "Nachtrag 11:30 zu 08:45: Amoxicillin aus Dosett entfernt (Penicillinallergie), Apotheke informiert. BH", bad: false, fb: "Korrekt gekennzeichneter Nachtrag." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst (Pflegefachkraft Jens Möller).",
      muster: "Frau Busch, 214: Demenz, nachts im Flur gesucht. Heute Transfer mit einer Person gut, stützt sich mit der linken Hand. BESD 2 vor dem Transfer. Trinkmenge bis 13 Uhr 650 ml, bitte weiter anbieten (mag Apfelschorle). Tochter hat angerufen, Rückruf ist erfolgt.\n\nHerr Stenzel, 217: Herzinsuffizienz mit Gewichtszunahme 1,9 kg seit Montag, Ödeme, Sprechdyspnoe. Hausarzt hat Torasemid auf 20 mg 1-1-0 erhöht, morgen früh wiegen und Rückmeldung an Dr. Weller. Im Dosett waren Ramipril im Mittagsfach und Amoxicillin trotz Penicillinallergie, beides entfernt, Apotheke informiert. Trinkmenge max. 1,5 l, Bilanz läuft.\n\nHerr Dietrich, 220: Fußberatung gemacht, Teach-back gut. Ferse rechts: kleine Blase, nicht offen, Hausarzt informiert, Podologie wird verordnet. Er trägt jetzt Hausschuhe.",
      chk: [
        { t: "Alle drei mit Kernproblem", kw: ["busch", "stenzel", "dietrich", "214", "217", "220"] },
        { t: "Offene Aufgaben (wiegen, Rückmeldung, Trinken)", kw: ["morgen", "wiegen", "bitte", "trink"] },
        { t: "Sicherheitsrelevantes (Allergie, Dosett, Ödeme)", kw: ["penicillin", "dosett", "allergie", "ödem"] }
      ]
    },
    refl: [
      { q: "Frau Busch hat nach ihrem Mann gefragt. Wie bist du damit umgegangen und warum?", muster: "Ich habe sie nicht korrigiert, weil die Nachricht vom Tod ihres Mannes für sie jedes Mal neu wäre. Ich habe das Gefühl dahinter aufgegriffen (sie will versorgen, sie hat Hunger) und das Frühstück als gemeinsames Ziel genutzt. Beim Transfer habe ich kurze Sätze und einen Schritt nach dem anderen gewählt und sie so viel wie möglich selbst machen lassen." },
      { q: "Woran hast du bei Herrn Stenzel die Verschlechterung erkannt, obwohl er sagte, es gehe ihm prima?", muster: "Am Gewichtsverlauf (+1,9 kg seit Montag), an den Ödemen, der Sprechdyspnoe und daran, dass er im Sessel schläft, weil er im Liegen keine Luft bekommt. Dazu die nicht genommenen Tabletten. Ich habe gemessen statt mich auf seine Aussage zu verlassen und den Hausarzt strukturiert informiert." },
      { q: "Was hast du bei der Prüfung des Wochendosetts gefunden, und was lernst du daraus?", muster: "Ramipril im Mittagsfach, obwohl es nur morgens angeordnet ist, und Amoxicillin trotz Penicillinallergie. Ein gestelltes Dosett ersetzt nicht die eigene Kontrolle gegen den aktuellen Plan und die Allergien. Ich melde solche Fehler an die Apotheke und im Fehlermeldesystem, damit sie nicht wieder passieren." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
