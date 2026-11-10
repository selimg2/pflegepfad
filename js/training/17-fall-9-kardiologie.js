/* ===== Fall 9: Kardiologie (12-Kanal-EKG, Nachblutung nach Herzkatheter) ===== */
(function () {
  var X = window.PXB, L = X && X.L9;
  if (!X || !L) return;
  var AKS = { hair: "KA", hairC: "#2b2b33", skin: "#d9a07a", cloth: "#9cc3e6", deco: "gown", bg: "#ddeeff", stubble: true };
  var WOL = { hair: "GH", hairC: "#e4e5e8", skin: "#f6d2b3", cloth: "#f2c9d6", deco: "gown", dot: "#d9849f", bg: "#fde8e8", wrinkles: 1, glasses: 1 };

  /* ---------- 12-Kanal-EKG bei Herrn Aksoy ---------- */
  function ekgScene(i) {
    if (i === 0) return L.bg() + X.clipboard(40, 34, 210, 200, "Kurve · Herr Aksoy", ["*03.02.1966 · Zimmer 412", "06:31 AO Dr. Lindner:", "12-Kanal-EKG sofort", "Brustschmerz NRS 6 seit 06:25", "Allergien: keine bekannt"], { mark: 2 }) +
      '<g class="pa-in">' + X.r(272, 92, 108, 34, 17, "#ffffff", 1.8) + X.c(292, 109, 7, "#2563eb", 0) + X.t(330, 113, "Aksoy, Kemal", { s: 9, w: 750 }) + "</g>" + X.check(372, 92);
    if (i === 1) return X.bedScene(AKS, { pose: "semi", mood: "worried", screen: true, screenNew: true, legs: "flat", tag: [200, 28, "Ablauf erklären · Sichtschutz", "ok"] });
    if (i === 2) return X.bedScene(AKS, { pose: "flat", mood: "neutral", screen: true, legs: "flat", post: X.r(10, 156, 20, 32, 4, "#1e293b", 1.6) + X.r(13, 160, 14, 22, 2, "#38bdf8", 0, ' opacity=".6"'), tag: [210, 28, "flach liegen · Handy und Uhr ablegen", "ok"] });
    if (i === 3) return L.torso({}) + '<g class="pa-wiggle">' + X.r(220, 120, 64, 38, 10, "#e0f2fe", 2) + X.p("M228 132h48M228 144h40", "none", 0, ' stroke="#bae6fd" stroke-width="2"') + "</g>" + X.tag(200, 252, "Haut trocken, fettfrei, keine Creme", "ok");
    if (i === 4) return L.limbs({ arms: true, n: 2 }) + X.tag(200, 162, "rot rechts · gelb links", "ok");
    if (i === 5) return L.limbs({ n: 2 }) + X.tag(200, 162, "schwarz rechts · grün links", "ok");
    if (i === 6) return L.torso({ guide: true }) + L.chestLeads(2, true) + X.tag(110, 250, "V1/V2: 4. ICR am Sternum", "ok");
    if (i === 7) return L.torso({ guide: true }) + L.chestLeads(4, true) + X.tag(110, 250, "V4: 5. ICR · V3 dazwischen", "ok");
    if (i === 8) return L.torso({}) + L.chestLeads(6, true) + X.tag(120, 250, "V5, V6 auf Höhe von V4", "ok");
    if (i === 9) return L.bg() + L.ekgMachine(110, 40, { btn: "rec", anim: true }) + X.tag(200, 222, "„Bitte ruhig atmen und nicht sprechen.“", "ok");
    if (i === 10) return L.bg() + L.ekgMachine(110, 40, { st: true, paper: true }) + X.tag(200, 222, "Nulllinie ruhig · alle 12 Ableitungen", "ok") + X.check(300, 50);
    if (i === 11) return L.bg() + L.ekgStrip(30, 60, 220, { lab: "V2 · 06:38" }) + L.ekgStrip(30, 118, 220, { lab: "V3" }) + X.bust({ hair: "HS", hairC: "#6b6b6b", skin: "#f0c7a5", cloth: "#ffffff", deco: "collar", bg: "#eef6ff", glasses: 1 }, "worried", 320, 150, 110) + X.tag(200, 230, "sofort der Ärztin zeigen · Uhrzeit notiert", "ok");
    if (i === 12) return X.bedScene(AKS, { pose: "semi", mood: "neutral", legs: "flat", tag: [200, 28, "Elektroden ab · Klingel in Reichweite", "ok"] });
    return L.bg() + X.clipboard(60, 26, 280, 230, "Pflegebericht 06:42", ["06:31 AO 12-Kanal-EKG (Dr. Lindner)", "06:38 EKG abgeleitet, artefaktfrei", "06:39 Dr. Lindner sofort vorgelegt", "Brustschmerz NRS 6, kaltschweißig", "RR 152/88, P 96, SpO₂ 96 %", "Klingel in Reichweite, HZ"], { mark: 2 }) + X.check(318, 236);
  }
  var ekg = {
    k: "ekg12", typ: "steps", pat: "A", t: "Herr Aksoy · 12-Kanal-EKG", kurzname: "12-Kanal-EKG als Simulation", clock: "06:32", max: 14, kurz: "12-Kanal-EKG",
    titel: "12-Kanal-EKG bei akutem Brustschmerz", ic: "pulse", mood: "worried",
    banner: { name: "Kemal Aksoy", sub: "58 J. · Zimmer 412 · Aufnahme nachts mit Brustschmerz, Troponin ausstehend", chips: [["Brustschmerz NRS 6 seit 06:25", "red"], ["Allergie: keine bekannt", ""]] },
    intro: "06:32 Uhr. Herr Aksoy hat geklingelt: „Es drückt wieder auf der Brust, wie heute Nacht.“ Die Ärztin Dr. Lindner hat sofort ein 12-Kanal-EKG angeordnet und ist in zehn Minuten da. Du leitest das EKG ab.",
    ko: ["Extremitätenelektroden vertauscht (rot links)", "Brustwandelektroden ohne Orientierung an den Rippen (V1 zu hoch)", "EKG bei Brustschmerz liegen lassen statt sofort vorzulegen", "Herrn Aksoy während des Brustschmerzes allein aufstehen lassen"],
    steps: [
      { t: "Anordnung und Identität prüfen", ic: "id", ph: "vor", fb: "Anordnung von 06:31 liegt vor, Name und Geburtsdatum stimmen mit dem Armband überein." },
      { t: "Ablauf erklären, Sichtschutz", ic: "talk", ph: "vor", fb: "Du sagst ihm in zwei Sätzen, was passiert. Sichtschutz, weil der Oberkörper frei ist.", say: "Tut das weh? Ich hab Angst, dass es wieder das Herz ist." },
      { t: "Flach lagern, Uhr und Handy ablegen", ic: "bed", ph: "vor", fb: "Entspannte Rückenlage, Arme neben dem Körper. Metall und Handy weg, damit keine Störungen entstehen." },
      { t: "Haut vorbereiten: trocken, fettfrei", ic: "swab", ph: "vor", fb: "Schweiß abgetrocknet, keine Creme. Bei starker Behaarung wird nur an den Klebestellen gekürzt, nicht rasiert." },
      { t: "Armelektroden: rot rechts, gelb links", ic: "hand", ph: "durch", fb: "An den Innenseiten der Unterarme, symmetrisch und auf Muskeln, nicht auf Knochen." },
      { t: "Beinelektroden: schwarz rechts, grün links", ic: "shoe", ph: "durch", fb: "Oberhalb der Knöchel an der Innenseite. Merkhilfe im Uhrzeigersinn ab rechtem Arm: rot, gelb, grün, schwarz (Ampel)." },
      { t: "V1 und V2 im 4. ICR am Brustbein", ic: "ruler", ph: "durch", fb: "Vom Angulus sterni zur 2. Rippe tasten, dann abwärts zählen. V1 rechts, V2 links neben dem Sternum." },
      { t: "V4 im 5. ICR, dann V3 dazwischen", ic: "ruler", ph: "durch", fb: "V4 in der Medioklavikularlinie im 5. ICR. V3 liegt genau zwischen V2 und V4." },
      { t: "V5 und V6 auf Höhe von V4", ic: "ruler", ph: "durch", fb: "V5 in der vorderen, V6 in der mittleren Axillarlinie, auf derselben Höhe wie V4." },
      { t: "Ruhig atmen lassen und ableiten", ic: "clock", ph: "durch", fb: "Er liegt ruhig, spricht nicht, die Kabel hängen frei. Papiervorschub 25 mm/s, Eichzacke sichtbar.", say: "Okay. Ich bin ganz still." },
      { t: "Qualität prüfen", ic: "eye", ph: "nach", fb: "Alle 12 Ableitungen, ruhige Nulllinie, keine Wackler. Bei Artefakten: Elektroden andrücken, Kabel entlasten, neu ableiten." },
      { t: "EKG sofort der Ärztin vorlegen", ic: "help", ph: "nach", fb: "Bei Brustschmerz soll das EKG innerhalb von 10 Minuten ärztlich beurteilt werden. Name, Datum, Uhrzeit und Schmerz stehen darauf." },
      { t: "Elektroden entfernen, Klingel, Dokumentation", ic: "doc", ph: "nach", fb: "Bei angeordneter Monitorüberwachung bleiben die Monitor-Elektroden. Er bleibt im Bett, Klingel in der Hand, Vitalzeichen dokumentiert." }
    ],
    wrong: [
      { t: "Rot an den linken Arm, gelb an den rechten", ic: "hand", ko: true, fb: "Kritisch: Vertauschte Extremitätenelektroden verändern das ganze EKG und können einen Infarkt vortäuschen oder verdecken." },
      { t: "V1 und V2 auf Höhe der Brustwarzen, ohne zu zählen", ic: "ruler", ko: true, fb: "Kritisch: Die Höhe der Brustwarzen ist kein Maß. Falsch platzierte Brustwandelektroden verfälschen die ST-Strecken." },
      { t: "EKG ins Fach legen, die Ärztin sieht es zur Visite", ic: "doc", ko: true, fb: "Kritisch: Bei Brustschmerz zählt jede Minute. Das EKG gehört sofort zur Ärztin." },
      { t: "Brust vorher eincremen, damit die Elektroden besser kleben", ic: "swab", fb: "Creme verhindert den Kontakt, die Kurve wird unruhig." },
      { t: "Ableiten, während er sich unterhält", ic: "talk", fb: "Sprechen und Muskelzittern erzeugen Artefakte." },
      { t: "Zur Toilette gehen lassen, bevor du anfängst", ic: "stand", fb: "Bei akutem Brustschmerz Bettruhe bis zur ärztlichen Beurteilung." }
    ],
    scene: ekgScene,
    status: function (i) { return ["Anordnung", "Aufklärung", "Lagerung", "Haut", "Arme", "Beine", "V1/V2", "V3/V4", "V5/V6", "Ableitung", "Qualität", "Ärztin", "Nachbereitung"][i] || ""; },
    statusEnd: "EKG vorgelegt, Herr Aksoy liegt sicher",
    merke: "Ampel an den Extremitäten (rot, gelb, grün, schwarz ab rechtem Arm), Rippen zählen ab Angulus sterni, bei Brustschmerz in 10 Minuten zur Ärztin."
  };

  /* ---------- Bildbefund Frau Wolters nach Herzkatheter ---------- */
  var wol = Object.assign({}, WOL, { pale: 1, sweat: 1 });
  function wolScene() {
    var s = X.defs() + X.room({ disp: 198, railX: 12, railW: 150, winX: 262 });
    s += X.monitor(168, 30, { hf: "108", spo2: "96", rr: "98/60" }, { alarm: 1 });
    s += X.bed({ pose: "high", x: 72, len: 270 });
    s += X.patient(wol, { mood: "worried", legs: "knee", blanket: "#e7dcf2" });
    /* Blutfleck auf der Decke in Höhe der rechten Leiste */
    var bx = X._pt ? Math.round((X._pt.belly[0] + X._pt.knee[0]) / 2 + 6) : 230, by = X._pt ? Math.round((X._pt.belly[1] + X._pt.knee[1]) / 2 + 8) : 170;
    X._wolBlood = [bx, by];
    s += '<g class="pa-glow">' + X.e(bx, by, 15, 9, "#dc2626", 0, ' opacity=".78"') + X.e(bx + 6, by + 3, 7, 4, "#b91c1c", 0, ' opacity=".7"') + "</g>";
    /* blasser Fuß schaut unter der Decke hervor */
    var fx = X._pt ? X._pt.feet[0] + 14 : 316, fy = X._pt ? X._pt.feet[1] - 4 : 170;
    s += X.p("M" + fx + " " + (fy + 6) + "q4-16 16-14q8 2 6 14z", "#eef0f2", 1.8) + X.p("M" + (fx + 6) + " " + (fy - 4) + "q4 2 8 0", "none", 0, ' stroke="#94a3b8" stroke-width="1.2"');
    /* Nachttisch: Nitrospray und Tablettenschachtel von zu Hause */
    s += X.nightstand(6, { y: 176 });
    s += X.r(20, 146, 10, 24, 3, "#ef4444", 1.6) + X.r(22, 140, 6, 7, 2, "#e2e8f0", 1.2) + X.r(36, 154, 28, 16, 3, "#dbeafe", 1.6) + X.t(50, 165, "Sildenafil", { s: 5.4, w: 800, c: "#1e3a8a" });
    /* Urinflasche leer am Bett */
    s += X.g(X.p("M-12 -30h20q8 0 8 8v30q0 8-8 8h-20q-8 0-8-8v-30q0-8 8-8z", "#fbfdff", 2) + X.p("M8 -24q10-6 12 6", "none", 2), "translate(354,214)");
    /* volle Trinkflasche */
    s += X.bottle(78, 186, "#cdeaff", 0.95);
    s += X.vignette();
    return s;
  }
  var wolBild = {
    k: "wolbild", typ: "hotspot", pat: "B", t: "Frau Wolters · Bildbefund", kurzname: "Bildbefund nach Herzkatheter", clock: "06:15", max: 8,
    titel: "Frau Wolters am Morgen nach dem Herzkatheter",
    banner: { name: "Ingrid Wolters", sub: "71 J. · Zimmer 414 · gestern 16 Uhr Koronarangiografie mit Stent, Zugang A. femoralis rechts", chips: [["Druckverband rechte Leiste bis 10 Uhr", "warn"], ["ASS + Ticagrelor", "warn"]] },
    intro: "06:15 Uhr. Frau Wolters sitzt aufrecht im Bett und hat die Beine angezogen. „Ich konnte so nicht liegen, mir tut der Rücken weh. Und mir ist ein bisschen komisch.“ Bevor du misst, schaust du genau hin.",
    q: "Was fällt dir an Frau Wolters und in ihrer Umgebung auf?",
    mood: "worried",
    art: wolScene(),
    spots: [
      { c: [[0, 0, 24]], t: "Blass und kaltschweißig, „komisch“", d: "Blässe, Schweiß und Unwohlsein nach einem Katheter über die Leiste können auf eine Blutung hinweisen. Sofort Vitalzeichen und Punktionsstelle kontrollieren." },
      { c: [[0, 0, 20]], t: "Blutfleck auf der Decke über der rechten Leiste", d: "Der Druckverband ist durchgeblutet: Nachblutung. Decke zurückschlagen, Verband und Leiste ansehen, oberhalb der Punktionsstelle manuell komprimieren und über die Klingel Hilfe holen." },
      { c: [[0, 0, 26]], t: "Oberkörper hoch, Bein in der Hüfte gebeugt", d: "Bis zur Entfernung des Druckverbands soll das punktierte Bein gestreckt bleiben, der Oberkörper flach bis höchstens 30°. Beugen löst den Verschluss der Arterie." },
      { c: [[0, 0, 14]], t: "Fuß rechts blass", d: "Nach Punktion der Leistenarterie gehören Fußpulse, Hautfarbe, Temperatur und Gefühl zur Kontrolle. Ein blasser Fuß kann auf eine Durchblutungsstörung oder einen zu festen Verband hinweisen." },
      { c: [[42, 156, 22]], t: "Nitrospray und Sildenafil auf dem Nachttisch", d: "Nitrate zusammen mit Sildenafil können einen gefährlichen Blutdruckabfall auslösen. Eigene Medikamente erfassen, ärztlich klären lassen und Frau Wolters aufklären." },
      { c: [[350, 202, 18]], t: "Urinflasche leer, Trinkflasche voll", d: "Seit dem Katheter wenig getrunken und kein Urin: Das Kontrastmittel soll ausgeschieden werden, und eine Blutung kann die Urinmenge senken. Ausscheidung und Bilanz prüfen, bei leerer Blase ggf. Harnverhalt ausschließen." },
      { c: [[209, 62, 34]], t: "Monitor: Puls 108/min, RR 98/60", d: "Gestern lag der Blutdruck bei 138/80. Puls steigt, Druck fällt: Das passt zu Volumenverlust. Ärztin sofort informieren." }
    ],
    extra: ["Sauerstoffbrille verrutscht", "Infusion paravasal", "Bettgitter ohne Anordnung", "Hörgerät fehlt"],
    cap: "Tipp: Gesicht, Decke, Beine, Fuß, Nachttisch, Monitor, Boden.",
    folge: {
      text: "Unter der Decke ist der Druckverband durchgeblutet, die Leiste ist geschwollen. Was tust du zuerst?",
      opts: [
        { t: "Sofort mit zwei Fingern oberhalb der Punktionsstelle fest komprimieren, über die Klingel Hilfe holen, Ärztin sofort informieren lassen, Oberkörper flach, Bein gestreckt", ok: true, fb: "Richtig. Druck stoppt die Blutung, du bleibst bei ihr, andere holen die Ärztin." },
        { t: "Verband abnehmen und eine neue Kompresse auflegen", ok: false, fb: "Dabei blutet es weiter. Erst komprimieren, der neue Verband ist ärztliche Entscheidung." },
        { t: "Zum Stationszimmer gehen und die Ärztin anrufen", ok: false, fb: "Du verlässt eine blutende Patientin. Hilfe über die Klingel holen und drücken." },
        { t: "Kühlpack auflegen und in einer Stunde nachsehen", ok: false, fb: "Bei aktiver Blutung zu wenig und zu spät." }
      ]
    },
    merke: "Nach Leistenpunktion: Verband, Leiste, Fuß und Kreislauf gehören zusammen. Durchgeblutet heißt drücken, klingeln, nicht weggehen."
  };
  if (X._pt) {
    wolBild.spots[0].c = [[Math.round(X._pt.hx), Math.round(X._pt.hy), 24]];
    if (X._wolBlood) wolBild.spots[1].c = [[X._wolBlood[0], X._wolBlood[1], 18]];
    wolBild.spots[2].c = [[Math.round(X._pt.knee[0] + 4), Math.round(X._pt.knee[1] - 8), 20]];
    wolBild.spots[3].c = [[Math.round(X._pt.feet[0] + 22), Math.round(X._pt.feet[1] - 4), 15]];
  }

  var wolVit = {
    k: "wolvit", typ: "vitmed", pat: "B", t: "Frau Wolters · Vitalzeichen & Medikamente", kurzname: "Vitalzeichen und Morgenmedikation", clock: "06:20", max: 10, wVit: 0.5,
    titel: "Vitalzeichen erheben und Morgenmedikation prüfen",
    banner: { name: "Ingrid Wolters", sub: "71 J. · Zimmer 414 · Stent RIVA gestern, Diabetes Typ 2", chips: [["Allergie: Jodhaltige Desinfektion (Juckreiz)", "red"], ["Kontrastmittel gestern 180 ml", ""]] },
    intro: "Eine Kollegin drückt jetzt auf die Leiste, die Ärztin ist unterwegs. Du misst die Vitalzeichen. Danach, als die Blutung steht, prüfst du die Tabletten für 08:00 Uhr.",
    uhr: "06:20",
    vit: {
      auftrag: "Tippe auf jedes Messgerät und wähle die richtige Technik.",
      items: [
        { k: "rr", t: "Blutdruck", kurz: "RR", val: "98/60", einheit: "mmHg (gestern 138/80)", wie: "messen", q: { text: "Wo misst du den Blutdruck bei Frau Wolters?", opts: [
          { t: "Am Oberarm mit passender Manschette, im Liegen, Wert mit dem Vorwert vergleichen", ok: true, fb: "Richtig. Der Verlauf ist hier aussagekräftiger als der einzelne Wert." },
          { t: "Am rechten Bein, damit der Arm frei bleibt", fb: "Am punktierten Bein auf keinen Fall." },
          { t: "Im Sitzen an der Bettkante", fb: "Sie soll flach liegen, und im Sitzen kann sie kollabieren." }] } },
        { k: "puls", t: "Puls", kurz: "Puls", val: "108", einheit: "/min, regelmäßig, flach", farbe: "puls", wie: "tasten" },
        { k: "af", t: "Atmung", kurz: "AF", val: "20", einheit: "/min", ico: "af", wie: "zählen" },
        { k: "spo2", t: "Sauerstoffsättigung", kurz: "SpO₂", val: "96", einheit: "%", wie: "Clip" },
        { k: "temp", t: "Temperatur", kurz: "Temp", val: "36,4", einheit: "°C", wie: "messen" },
        { k: "bew", t: "Bewusstsein", kurz: "ACVPU", val: "wach", einheit: "unruhig", ico: "bew", wie: "ansprechen" }
      ],
      befund: "06:22 Uhr: RR 98/60 mmHg (gestern 138/80) · Puls 108/min, flach · AF 20/min · SpO₂ 96 % · Temp 36,4 °C · wach, unruhig, blass, kaltschweißig · Druckverband re. Leiste durchgeblutet, Leiste geschwollen, Fußpuls re. schwach tastbar.",
      news: { wert: 3, tol: 0, frage: "Berechne den NEWS2-Score (Raumluft).", erk: "AF 20 = 0, SpO₂ 96 % = 0, Raumluft = 0, RR 98 = 2, Puls 108 = 1, wach = 0, Temp 36,4 °C = 0. Gesamt 3. Der Score ist niedrig, aber eine sichtbare Blutung mit fallendem Blutdruck ist unabhängig vom Score ein Notfall: Der Verlauf und das klinische Bild zählen." },
      act: {
        text: "Blutung, Puls steigt, Blutdruck fällt. Was ist jetzt richtig?",
        opts: [
          { t: "Kompression fortsetzen, flach lagern, Ärztin sofort (SBAR), Vitalzeichen alle 5 bis 15 Minuten, venösen Zugang prüfen, nüchtern lassen bis zur Entscheidung", ok: true, fb: "Richtig. Das sind Zeichen eines beginnenden Volumenmangels." },
          { t: "Beine hochlegen und das rechte Bein beugen, damit der Kreislauf besser wird", fb: "Beugen gefährdet die Punktionsstelle." },
          { t: "Ticagrelor heute weglassen, damit sie nicht mehr blutet", fb: "Eigenmächtiges Absetzen ist gefährlich: Stentthrombose. Das entscheidet die Ärztin." },
          { t: "Abwarten, der Blutdruck ist ja noch über 90", fb: "Der Verlauf zählt: 40 mmHg weniger und Puls über 100 sind ein Alarmzeichen." }
        ]
      }
    },
    med: {
      zeit: "08:00", allergie: "jodhaltige Hautdesinfektion",
      hinweis: "Ärztliche Anordnung von gestern 18 Uhr: Metformin wegen Kontrastmittel für 48 Stunden pausieren. Bisoprolol auf 2,5 mg reduziert.",
      plan: [
        { n: "ASS", d: "100 mg", z: "1-0-0", h: "dauerhaft" },
        { n: "Ticagrelor", d: "90 mg", z: "1-0-1", h: "12 Monate nach Stent" },
        { n: "Bisoprolol", d: "2,5 mg", z: "1-0-0", h: "seit gestern reduziert" },
        { n: "Atorvastatin", d: "80 mg", z: "0-0-1", h: "abends" },
        { n: "Metformin", d: "1000 mg", z: "1-0-1", h: "pausiert bis morgen 16 Uhr" },
        { n: "Pantoprazol", d: "20 mg", z: "1-0-0", h: "vor dem Frühstück" }
      ],
      disp: [
        { n: "ASS 100 mg", sub: "1 Tablette", pill: { c: "#ffffff", s: "round" }, r: "ok", fb: "Passt zur Anordnung." },
        { n: "Ticagrelor 90 mg", sub: "1 Tablette", pill: { c: "#fde68a", s: "round" }, r: "ok", fb: "Passt. Nicht eigenmächtig weglassen, Blutung der Ärztin melden." },
        { n: "Bisoprolol 5 mg", sub: "1 Tablette", pill: { c: "#fef3c7", s: "oval" }, r: "dosis", fb: "Seit gestern sind 2,5 mg angeordnet. Dazu Puls und Blutdruck heute zuerst ärztlich bewerten lassen." },
        { n: "Atorvastatin 80 mg", sub: "1 Tablette im Morgenfach", pill: { c: "#ffffff", s: "oval" }, r: "zeit", fb: "Angeordnet ist abends." },
        { n: "Metformin 1000 mg", sub: "1 Tablette", pill: { c: "#e2e8f0", s: "oval" }, r: "pause", fb: "Für 48 Stunden nach dem Kontrastmittel pausiert." },
        { n: "Pantoprazol 20 mg", sub: "1 Tablette", pill: { c: "#fde68a", s: "oval" }, r: "ok", fb: "Passt, vor dem Frühstück." }
      ],
      fehlt: {
        text: "Was besprichst du mit der Ärztin und mit Frau Wolters? (Mehrfachauswahl)",
        opts: [
          { t: "Sildenafil von zu Hause: Wechselwirkung mit Nitrospray", ok: true, fb: "Gefährlicher Blutdruckabfall. Muss ärztlich geklärt werden." },
          { t: "Blutungszeichen melden: Leiste, Zahnfleisch, Urin, Stuhl, Kreislauf", ok: true, fb: "Unter zwei Gerinnungshemmern wichtig." },
          { t: "Ticagrelor auf keinen Fall selbst absetzen", ok: true, fb: "Sonst droht ein Verschluss des Stents." },
          { t: "Metformin heute doppelt nehmen, weil gestern ausgefallen", ok: false, fb: "Nein, es bleibt pausiert." }
        ]
      }
    },
    merke: "Pausiert heißt pausiert, auch wenn die Tablette im Dispenser liegt. Und zwei Gerinnungshemmer heißen: auf Blutungen achten, nicht absetzen."
  };

  var C = {
    id: "kardio", titel: "Brustschmerz, Stent und ein roter Fleck", station: "Kardiologie · Station 4K", haus: "Universitätsklinikum Am Ring", farbe: "#DC2626",
    icon: "M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6C19 16.4 12 21 12 21z",
    kurz: "Ein Mann mit Brustschmerz, der ein EKG braucht, sofort. Und eine Frau nach dem Herzkatheter, die blasser wird.",
    anleitung: "Carla Reimann", pruefer: "Herr Dr. Hoffmeister",
    nachtLabel: "Tag 2 · 06:00 Uhr · Übergabe aus dem Nachtdienst",
    people: {
      anleitung: { name: "Carla Reimann", av: { hair: "AN", hairC: "#3a2a22", skin: "#e3ab84", cloth: "#dc2626", deco: "badge", bg: "#fde8e8" } },
      pruefer: { name: "Herr Dr. Hoffmeister", av: { hair: "HS", hairC: "#8a8178", skin: "#f0c7a5", cloth: "#475569", deco: "collar", bg: "#e6edf5", glasses: 1 } },
      nacht: { name: "Pascal Wenzel", role: "Nachtdienst", av: { hair: "JO", hairC: "#3a2a22", skin: "#f6d2b3", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3", stubble: true } },
      ehefrau: { name: "Leyla Aksoy", match: "ehefrau|leyla|frau aksoy", av: { hair: "SY", hairC: "#2b2b33", skin: "#d9a07a", cloth: "#7c3aed", bg: "#efe7fb" } },
      tochter: { name: "Andrea Wolters", match: "tochter|andrea", av: { hair: "CB", hairC: "#a8743f", skin: "#f6d2b3", cloth: "#0ea5e9", bg: "#e0f2fe" } }
    },
    briefing: [
      "Willkommen auf der 4K! Ich bin Carla Reimann, Praxisanleiterin. Herr Dr. Hoffmeister von der Pflegeschule ist morgen mit dabei. Kardiologie heißt: Brustschmerz ist immer ernst, und nach jedem Herzkatheter schauen wir auf die Punktionsstelle.",
      "Deine zwei Menschen: Herr Aksoy kam heute Nacht mit Brustschmerz, das Troponin ist noch offen. Frau Wolters hat gestern einen Stent bekommen, der Katheter ging über die rechte Leiste, sie trägt bis 10 Uhr einen Druckverband.",
      "Merk dir zwei Regeln: Bei Brustschmerz liegt das EKG innerhalb von 10 Minuten bei der Ärztin. Und nach einer Leistenpunktion kontrollierst du Verband, Leiste, Fuß und Kreislauf zusammen."
    ],
    order: ["A", "B"],
    pat: {
      A: {
        key: "A", name: "Kemal Aksoy", kurz: "Herr Aksoy", alter: 58, zimmer: "412", modus: "Pflegehandlung", farbe: "#DC2626", av: AKS,
        typ: "Busfahrer, ruhig und höflich, will „keinen Aufstand machen“, raucht seit 40 Jahren, seine Frau ist besorgt und ruft oft an.",
        diagnose: "Verdacht auf akutes Koronarsyndrom (instabile Angina pectoris bzw. NSTEMI), erstes Troponin grenzwertig, Kontrolle 07:00 Uhr.",
        daten: [
          ["Vorerkrankungen", "Arterielle Hypertonie, Hypercholesterinämie, Nikotinabusus (40 Packungsjahre), Adipositas"],
          ["Allergien", "keine bekannt"],
          ["Aufnahme", "01:40 Uhr mit retrosternalem Druck, Ausstrahlung in den linken Arm, kaltschweißig"],
          ["Medikation", "ASS 250 mg i. v. durch Notarzt, Heparin nach Schema, Nitrospray bei Bedarf, Amlodipin 5 mg 1-0-0"],
          ["Anordnung", "Bettruhe bis Troponin-Kontrolle, Monitor, nüchtern für mögliche Koronarangiografie"],
          ["Angehörige", "Ehefrau Leyla Aksoy, Telefon im Stammblatt"]
        ],
        anamnese: "Ich wollte gar nicht kommen, ehrlich. Seit zwei Wochen zieht es manchmal in der Brust, wenn ich die Treppe hochgehe, dann bleib ich kurz stehen, dann geht's wieder. Heute Nacht war's anders, es hat nicht aufgehört, und der linke Arm war so schwer. Geschwitzt hab ich wie verrückt. Ich rauch ja, eine Schachtel am Tag, ich weiß, ich weiß. Mein Vater ist mit 60 am Herz gestorben. Muss ich jetzt operiert werden? Meine Frau macht sich solche Sorgen, und die Arbeit, ich kann den Bus doch nicht stehen lassen.",
        kern: [
          { t: "Brustschmerz mit Ausstrahlung, Kaltschweiß: Verdacht auf akutes Koronarsyndrom", kw: ["brust", "schmerz", "arm", "schweiß", "infarkt", "koronar"] },
          { t: "Belastungsabhängige Beschwerden seit zwei Wochen", kw: ["treppe", "zwei wochen", "belast"] },
          { t: "Rauchen als Risikofaktor", kw: ["rauch", "nikotin", "zigarett", "schachtel"] },
          { t: "Familiäre Vorbelastung", kw: ["vater", "famil"] },
          { t: "Angst vor Operation und Zukunft", kw: ["angst", "operiert", "sorge"] },
          { t: "Sorge um Arbeit und Familie", kw: ["arbeit", "bus", "frau"] },
          { t: "Bettruhe, nüchtern, Monitor", kw: ["bettruhe", "nüchtern", "monitor"] }
        ]
      },
      B: {
        key: "B", name: "Ingrid Wolters", kurz: "Frau Wolters", alter: 71, zimmer: "414", modus: "Bildbefund · Vitalzeichen · Medikamente", farbe: "#7C3AED", av: WOL,
        typ: "Pensionierte Grundschullehrerin, aufmerksam und freundlich, möchte niemandem Umstände machen, liest viel.",
        diagnose: "Koronare Herzkrankheit; gestern Koronarangiografie mit Stent im RIVA über die A. femoralis rechts, Druckverband bis heute 10 Uhr; Diabetes mellitus Typ 2.",
        daten: [
          ["Vorerkrankungen", "KHK, Diabetes Typ 2 (oral), Hypertonie, Arthrose der Knie"],
          ["Allergien", "jodhaltige Hautdesinfektion (Juckreiz, Rötung)"],
          ["Eingriff", "gestern 16:00 Uhr, Schleuse entfernt 16:40 Uhr, Druckverband bis 10:00 Uhr, Bettruhe bis dahin"],
          ["Medikation", "ASS 100 mg 1-0-0 · Ticagrelor 90 mg 1-0-1 · Bisoprolol 2,5 mg 1-0-0 · Atorvastatin 80 mg 0-0-1 · Metformin pausiert · Pantoprazol 20 mg 1-0-0"],
          ["Werte gestern", "RR 138/80 mmHg, Puls 72/min, Kreatinin 1,1 mg/dl"],
          ["Angehörige", "Tochter Andrea, kommt nachmittags"]
        ],
        anamnese: "Ach, Sie sind lieb. Nein, mir geht's eigentlich gut. Ich soll ja liegen, aber der Rücken, so flach halte ich das nicht aus. Ich hab mich ein bisschen hochgesetzt, das darf man doch? Getrunken hab ich nicht so viel, ich wollte nicht dauernd klingeln wegen der Flasche. Die Tabletten von zu Hause hab ich hier im Nachttisch, auch die blauen, die mein Mann ... na ja, die sind eigentlich von ihm, aber ich nehme ab und zu was gegen Kopfweh. Mir ist gerade ein bisschen schwummrig. Wird schon.",
        kern: [
          { t: "Lagerung nach Leistenpunktion nicht eingehalten: Oberkörper hoch, Bein gebeugt", kw: ["hochgesetzt", "liegen", "rücken", "bein", "flach"] },
          { t: "Schwindel, Unwohlsein: Warnzeichen für Blutung", kw: ["schwumm", "komisch", "schwindel"] },
          { t: "Wenig getrunken: Kontrastmittel, Ausscheidung", kw: ["getrunken", "trink", "flasche", "kontrastmittel"] },
          { t: "Eigene Medikamente im Nachttisch: unklare Einnahme, Wechselwirkungen", kw: ["tabletten", "nachttisch", "eigene", "blauen"] },
          { t: "Klingelt ungern: Hilfe einfordern fällt ihr schwer", kw: ["klingeln", "umstände"] },
          { t: "Zwei Gerinnungshemmer: Blutungsgefahr", kw: ["ticagrelor", "ass", "blutung", "gerinnung"] },
          { t: "Jodallergie bei Hautdesinfektion", kw: ["jod", "allerg"] }
        ]
      }
    },
    plan: {
      A: {
        diag: "Akuter Schmerz (NANDA-I 00132) b/d verminderter Durchblutung des Herzmuskels, a/d retrosternalem Druck NRS 6 mit Ausstrahlung; Angst (00146) b/d unklarer Diagnose, a/d Fragen nach Operation und Arbeit.",
        ziel: "Herr Aksoy meldet jeden erneuten Brustschmerz sofort. Der Schmerz liegt nach ärztlicher Therapie innerhalb von 30 Minuten bei NRS 3 oder weniger. Er kann den weiteren Ablauf in eigenen Worten wiedergeben.",
        mass: [
          "Bettruhe sichern, Klingel in Reichweite, Monitor nach Anordnung",
          "Bei Brustschmerz: 12-Kanal-EKG nach Anordnung, sofort ärztlich vorlegen, Vitalzeichen",
          "Schmerz regelmäßig mit NRS erfassen, Bedarfsmedikation nach Anordnung",
          "Nüchternheit für mögliche Koronarangiografie, informieren warum",
          "Ängste ansprechen, Ehefrau einbeziehen, später Raucherentwöhnung anbieten"
        ],
        chk: [
          { t: "Schmerz als Diagnose", kw: ["schmerz"] },
          { t: "Angst als Diagnose", kw: ["angst", "sorge"] },
          { t: "Überprüfbares Ziel (NRS, Zeit)", kw: ["nrs", "minuten"] },
          { t: "EKG / ärztlich vorlegen", kw: ["ekg"] },
          { t: "Bettruhe / Klingel", kw: ["bettruhe", "klingel"] },
          { t: "Raucherentwöhnung / Risikofaktoren", kw: ["rauch", "nikotin", "risiko"] }
        ]
      },
      B: {
        diag: "Gefahr einer Blutung (00206) b/d Punktion der A. femoralis und zwei Thrombozytenaggregationshemmern; Gefahr einer Volumenmangel-Situation durch geringe Trinkmenge nach Kontrastmittel.",
        ziel: "Die Punktionsstelle bleibt bis zur Entfernung des Druckverbands trocken, Kreislauf stabil (RR systolisch über 110 mmHg, Puls unter 100/min). Frau Wolters trinkt heute mindestens 1,5 l nach Anordnung und meldet Schwindel sofort.",
        mass: [
          "Verband, Leiste, Fußpulse, Hautfarbe und Kreislauf nach Schema kontrollieren",
          "Lagerung: Bein gestreckt, Oberkörper höchstens 30°, Bettruhe bis Verbandentfernung, Rücken mit Kissen entlasten",
          "Bei Nachblutung: manuell komprimieren, Hilfe rufen, Ärztin sofort",
          "Trinken anbieten, Ein- und Ausfuhr bilanzieren",
          "Eigene Medikamente erfassen, Wechselwirkungen ärztlich klären, über Blutungszeichen aufklären"
        ],
        chk: [
          { t: "Blutungsgefahr als Diagnose", kw: ["blutung"] },
          { t: "Kontrolle Leiste / Fuß / Kreislauf", kw: ["leiste", "fuß", "puls", "kreislauf"] },
          { t: "Lagerung Bein gestreckt", kw: ["gestreckt", "bein", "30"] },
          { t: "Trinken / Bilanz", kw: ["trink", "bilanz"] },
          { t: "Überprüfbares Ziel", kw: ["mmhg", "liter", " l ", "1,5"] },
          { t: "Eigene Medikamente / Wechselwirkung", kw: ["eigene", "sildenafil", "wechselwirk"] }
        ]
      }
    },
    nacht: [
      ["A", "Herr Aksoy: Um 01:40 Uhr mit Brustschmerz aufgenommen, nach ASS und Nitro schmerzfrei bis 05:00 Uhr. Erstes Troponin grenzwertig, Kontrolle um 07:00 Uhr. Er ist nüchtern. Seine Frau hat zweimal angerufen."],
      ["B", "Frau Wolters: Druckverband gestern 22 Uhr und 02 Uhr trocken, Fußpuls tastbar. Sie hat über Rückenschmerzen geklagt und wenig getrunken. Ich hab ihr ein Kissen unter den Rücken gelegt."]
    ],
    sbar: {
      A: { muster: { S: "Herr Aksoy, 58, Zimmer 412, seit 06:25 Uhr erneut Brustschmerz NRS 6, kaltschweißig, 12-Kanal-EKG liegt vor.", B: "Aufnahme heute Nacht mit Verdacht auf ACS, erstes Troponin grenzwertig, Raucher, Hypertonie, ASS und Heparin erhalten.", A: "Ich halte das für ein erneutes Koronarereignis und mache mir Sorgen.", R: "Bitte jetzt das EKG beurteilen und zu ihm kommen. Soll ich Nitrospray geben oder den Herzkatheter informieren?" },
        chk: [{ t: "S: erneuter Brustschmerz, EKG", kw: ["brust", "schmerz", "ekg"] }, { t: "B: Verdacht ACS, Troponin", kw: ["troponin", "acs", "koronar"] }, { t: "A: Einschätzung", kw: ["sorge", "einschätz", "halte"] }, { t: "R: konkrete Bitte", kw: ["bitte", "kommen"] }, { t: "Vitalzeichen", kw: ["rr", "puls", "mmhg"] }] },
      B: { muster: { S: "Frau Wolters, 71, Zimmer 414, Druckverband rechte Leiste durchgeblutet, Leiste geschwollen, ich komprimiere gerade.", B: "Gestern Stent über die rechte Leiste, ASS und Ticagrelor, Oberkörper war hochgestellt.", A: "RR 98/60 statt 138/80, Puls 108, blass und kaltschweißig: Ich vermute eine Nachblutung mit beginnendem Volumenmangel.", R: "Bitte sofort kommen. Soll ich Volumen vorbereiten und Blut abnehmen lassen?" },
        chk: [{ t: "S: Nachblutung, Kompression", kw: ["blut", "kompri", "verband"] }, { t: "B: Stent, Gerinnungshemmer", kw: ["stent", "ticagrelor", "ass"] }, { t: "A: Werte und Verdacht", kw: ["98", "108", "volumen", "nachblut"] }, { t: "R: sofort kommen", kw: ["sofort", "kommen"] }, { t: "Lagerung", kw: ["hoch", "flach", "bein"] }] }
    },
    prio: [
      { id: "w1", t: "Frau Wolters: Blick ins Zimmer, Verband, Leiste, Kreislauf", zeit: "06:15", warum: "Nach Leistenpunktion hat die Kontrolle Vorrang, sie klagte über Schwindel." },
      { id: "w2", t: "Frau Wolters: Vitalzeichen, Ärztin informieren", zeit: "06:20", warum: "Verdacht auf Nachblutung." },
      { id: "a1", t: "Herr Aksoy: 12-Kanal-EKG bei erneutem Brustschmerz", zeit: "06:32", warum: "Innerhalb von 10 Minuten ärztlich vorlegen." },
      { id: "a2", t: "Herr Aksoy: Troponin-Kontrolle abnehmen lassen bzw. vorbereiten", zeit: "07:00", warum: "Zeitkritisch für die Diagnose." },
      { id: "w3", t: "Frau Wolters: Morgenmedikation prüfen, eigene Medikamente klären", zeit: "08:00", warum: "Nach Stabilisierung, Rücksprache zur Medikation." },
      { id: "do", t: "Dokumentation und Übergabe vorbereiten", zeit: "13:00", warum: "Fortlaufend dokumentieren." }
    ],
    live: [ekg, wolBild, wolVit],
    st: {
      clock: "07:10", titel: "Drei Dinge gleichzeitig", who: "ehefrau",
      situation: "07:10 Uhr. Du bereitest die Morgenmedikation vor. Herr Aksoy klingelt: „Es kommt wieder, stärker als vorhin.“ Gleichzeitig steht der Transportdienst in der Tür, um ihn zum Herzecho zu bringen, und im Stationszimmer klingelt das Telefon: Frau Aksoy möchte wissen, „ob ihr Mann einen Herzinfarkt hat“.",
      order: [
        { id: "a", t: "Zu Herrn Aksoy: bei ihm bleiben, Bettruhe, Kollegin bzw. Ärztin über die Klingel rufen", warum: "Erneuter Brustschmerz ist ein Notfall." },
        { id: "b", t: "Vitalzeichen, Schmerz (NRS), 12-Kanal-EKG nach Anordnung vorbereiten", warum: "Grundlage für die ärztliche Entscheidung." },
        { id: "c", t: "Transportdienst bitten zu warten bzw. den Termin verschieben lassen", warum: "Kein Transport bei akutem Brustschmerz ohne ärztliche Freigabe." },
        { id: "d", t: "Frau Aksoy zurückrufen lassen: keine Diagnose am Telefon, ärztliches Gespräch anbieten", warum: "Schweigepflicht und Zuständigkeit." },
        { id: "e", t: "Dokumentieren: Uhrzeit, Schmerz, Werte, Maßnahmen", warum: "Nachvollziehbarkeit." }
      ],
      mc: { text: "Welche Beobachtungen sprechen für ein akutes Koronarsyndrom? (Mehrfachauswahl)", opts: [
        { t: "Druck oder Enge hinter dem Brustbein länger als 20 Minuten", ok: true, fb: "Typisch." },
        { t: "Ausstrahlung in Arm, Hals, Kiefer oder Oberbauch, Kaltschweiß, Übelkeit", ok: true, fb: "Typische Begleitzeichen." },
        { t: "Bei Frauen, Älteren und Menschen mit Diabetes oft nur Atemnot, Übelkeit oder Schwäche", ok: true, fb: "Atypische Zeichen kennen." },
        { t: "Schmerz, der sich durch Druck auf eine Rippe genau auslösen lässt", ok: false, fb: "Spricht eher für eine Ursache in Brustwand oder Muskulatur, schließt aber nichts sicher aus." }
      ] },
      merke: "Brustschmerz geht vor Transport, Telefon und Tabletten. Und Diagnosen gibt es nicht am Telefon."
    },
    doku: {
      clock: "07:30",
      auftrag: "Schreibe den Pflegebericht zu Frau Wolters (06:15 bis 06:50 Uhr). Ergänzend: Dr. Lindner kam 06:26 Uhr, neuer Druckverband 06:40 Uhr, Blutentnahme Blutbild, NaCl 0,9 % 500 ml i. v., Bettruhe bis 14 Uhr, Kontrolle alle 15 Minuten für 1 Stunde.",
      muster: "06:15 Pat. sitzt mit hochgestelltem Oberkörper, re. Bein gebeugt, äußert: „Mir ist ein bisschen komisch.“ Blass, kaltschweißig. Blutfleck auf der Bettdecke über der re. Leiste, Druckverband durchgeblutet, Leiste geschwollen, Fußpuls re. schwach tastbar, Fuß blass. Manuelle Kompression oberhalb der Punktionsstelle ab 06:17, Hilfe über Klingel. 06:22 RR 98/60 mmHg (gestern 138/80), P 108/min, AF 20/min, SpO₂ 96 %, Temp 36,4 °C, wach, unruhig. Oberkörper flach, Bein gestreckt. 06:26 Dr. Lindner am Bett, 06:40 neuer Druckverband durch Ärztin, Blutentnahme, NaCl 0,9 % 500 ml i. v. nach AO. 06:50 RR 112/68 mmHg, P 96/min, Verband trocken. Eigene Medikamente im Nachttisch (u. a. Sildenafil, Nitrospray), Ärztin informiert, Medikamente nach Absprache verwahrt. [Name, HZ]",
      chk: [
        { t: "Uhrzeiten", kw: ["06:"] },
        { t: "Werte mit Einheiten und Vorwert", kw: ["mmhg", "/min", "138"] },
        { t: "Wörtliche Aussage", kw: ["„", "äußert"] },
        { t: "Befund Leiste und Fuß", kw: ["leiste", "fuß", "verband"] },
        { t: "Kompression und Hilfe", kw: ["kompress", "klingel", "hilfe"] },
        { t: "Ärztliche Maßnahmen", kw: ["dr.", "lindner", "nacl"] },
        { t: "Verlauf danach", kw: ["06:50", "trocken"] }
      ],
      fehler: {
        text: "Fehlersuche: Welche Einträge sind NICHT rechtssicher?",
        items: [
          { t: "06:22 RR 98/60 mmHg, P 108/min, Pat. blass, kaltschweißig.", bad: false, fb: "In Ordnung." },
          { t: "Pat. hat sich nicht an die Lagerung gehalten, uneinsichtig.", bad: true, fb: "Wertend. Beschreiben, wie sie lag und was sie gesagt hat." },
          { t: "Leiste blutet etwas.", bad: true, fb: "Ungenau: Ausmaß, Verband, Schwellung, Maßnahmen fehlen." },
          { t: "06:17 manuelle Kompression oberhalb der Punktionsstelle re., Hilfe über Klingel angefordert.", bad: false, fb: "In Ordnung." },
          { t: "Kreislauf instabil, Arzt da.", bad: true, fb: "Ohne Werte, Uhrzeit und Namen nicht nachvollziehbar." },
          { t: "06:50 Druckverband trocken, Fußpuls re. tastbar, RR 112/68 mmHg.", bad: false, fb: "In Ordnung." }
        ]
      }
    },
    ueb: {
      auftrag: "13:30 Uhr. Übergib an den Spätdienst (Pascal Wenzel hat getauscht, heute Spätdienst).",
      muster: "Herr Aksoy, 412: Verdacht auf ACS. 06:32 und 07:12 erneuter Brustschmerz, EKG jeweils sofort Dr. Lindner vorgelegt. Troponin-Kontrolle 07:00 deutlich gestiegen, Koronarangiografie heute 15 Uhr geplant. Nüchtern, Bettruhe, Monitor. Ehefrau kommt um 14 Uhr zum Arztgespräch. Bitte bei Schmerz sofort EKG und Ärztin.\n\nFrau Wolters, 414: Heute 06:15 Nachblutung rechte Leiste nach Stent, manuell komprimiert, neuer Druckverband 06:40 durch Dr. Lindner, NaCl 500 ml, Bettruhe bis 14 Uhr. Seit 07:00 stabil, RR um 115/70, Puls um 90, Verband trocken, Fußpuls tastbar. Blutbild abgenommen, Ergebnis offen. Metformin pausiert bis morgen 16 Uhr, Bisoprolol 2,5 mg. Eigene Medikamente (Sildenafil) verwahrt, Ärztin klärt. Bitte Leiste, Fuß und Kreislauf weiter nach Schema, Trinkmenge bilanzieren.",
      chk: [
        { t: "Beide mit Kernproblem", kw: ["aksoy", "wolters"] },
        { t: "Offene Punkte", kw: ["bitte", "geplant", "offen"] },
        { t: "Sicherheitsrelevantes", kw: ["nüchtern", "blut", "verband", "ekg"] }
      ]
    },
    refl: [
      { q: "Warum zählt beim EKG jede Elektrode, und woran hast du dich orientiert?", muster: "Vertauschte oder falsch platzierte Elektroden verändern die Kurve so, dass ein Infarkt übersehen oder vorgetäuscht werden kann. Ich habe die Extremitäten nach der Ampel geklebt (rot, gelb, grün, schwarz ab rechtem Arm) und die Rippen ab dem Angulus sterni gezählt: V1 und V2 im 4. ICR, V4 im 5. ICR in der Medioklavikularlinie, V3 dazwischen, V5 und V6 auf gleicher Höhe." },
      { q: "Was hat dich bei Frau Wolters an eine Nachblutung denken lassen?", muster: "Mehrere Zeichen zusammen: Blutfleck auf der Decke, gebeugtes Bein und hochgestellter Oberkörper, Blässe, Schweiß, Schwindel, Puls 108 und ein um 40 mmHg gefallener Blutdruck. Ich habe sofort komprimiert und Hilfe geholt, statt zu gehen." },
      { q: "Wie hast du in der Störung um 07:10 Uhr Prioritäten gesetzt?", muster: "Der erneute Brustschmerz von Herrn Aksoy hatte Vorrang vor Transport und Telefon. Ich bin bei ihm geblieben, habe die Ärztin rufen lassen und das EKG vorbereitet. Den Transport habe ich verschoben, und Frau Aksoy wird von der Ärztin zurückgerufen, weil am Telefon keine Diagnose mitgeteilt wird." }
    ]
  };
  (window.PEX_CASES = window.PEX_CASES || []).push(C);
})();
