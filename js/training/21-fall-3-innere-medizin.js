/* ===== Fall 3 (Innere Medizin): Figuren, Bildbefund, Infusions-Simulation ===== */
(function () {
  var X = window.PXB, C = (window.PEX_CASES || []).filter(function (c) { return c.id === "innere"; })[0];
  if (!X || !C) return;
  var P = C.pat;
  P.A.av = { hair: "HS", hairC: "#d6d9dd", skin: "#f6d2b3", cloth: "#9fd4c7", deco: "gown", dot: "#4f9e8c", bg: "#e6f6f3", glasses: 1, wrinkles: 1 };
  P.B.av = { hair: "HM", hairC: "#cfd2d6", skin: "#f6d2b3", cloth: "#c9b6e4", deco: "gown", dot: "#8b6bb8", bg: "#efe7fb", wrinkles: 1 };
  C.people = {
    anleitung: { name: "Sabine Hoffmann", av: { hair: "PA", hairC: "#7a5233", skin: "#f6d2b3", cloth: "#4f46e5", deco: "badge", bg: "#efe7fb" } },
    pruefer: { name: "Herr Okafor", av: { hair: "JO", hairC: "#1d1d22", skin: "#8d5a3b", cloth: "#334155", deco: "collar", bg: "#e6edf5", glasses: 1 } },
    nacht: { name: "Lukas Brandl", role: "Nachtdienst", av: { hair: "LN", hairC: "#b5651d", skin: "#f6d2b3", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3", freckles: 1 } },
    arzt: { name: "Dr. Meier", match: "dr\\.? meier|ärzt", av: { hair: "TI", hairC: "#3a2a22", skin: "#f0c7a5", cloth: "#ffffff", deco: "coat", bg: "#ddeeff" } }
  };

  /* ---------- Bildbefund Frau Kranz ---------- */
  var kr = Object.assign({}, P.B.av, { cyan: 1 });
  var spotP = {};
  function kranzScene() {
    return X.bedScene(kr, {
      pose: "high", mood: "tired", legs: "flat", blanket: "#e9e1f5", veins: 1,
      prePatient: function (b) { var s = ""; for (var k = 2; k >= 0; k--) s += X.g(X.r(-30, -15, 60, 30, 14, k ? "#f1f5f9" : "#ffffff", 2), "translate(" + (b.tx + 14 + k * 7) + "," + (b.ty + 18 - k * 9) + ") rotate(-28)"); spotP.pill = [b.tx + 4, b.ty - 2]; return s; },

      ns: X.glass(22, 170, 0.5),
      post: function (pt) {
        spotP.head = [pt.hx, pt.hy]; spotP.neck = [pt.nx, pt.ny - 6];
        var s = "";
        /* Füße mit Ödemen */
        s += X.g(X.p("M0 0q16-8 30-2q10 6 4 16q-18 8-36 2z", "#f3cdb0", 2) + X.c(16, 4, 3, "#d9a483", 0) + X.p("M8 -2q6 4 0 8", "none", 0, ' stroke="#d9a483" stroke-width="1.4"'), "translate(330,150) scale(1.15)") + X.g(X.p("M0 0q16-8 30-2q10 6 4 16q-18 8-36 2z", "#f3cdb0", 2), "translate(326,168) scale(1.15)");
        /* Nachttisch-Tablett: Wasser 1,5 l, Brühe, Salz */
        s += X.overbed(200, 136, 92, X.bottle(220, 134, "#cdeaff", 0.35) + X.p("M238 130q14 10 28 0z", "#ffffff", 1.8) + X.e(252, 128, 14, 3, "#f59e0b", 0) + '<g class="pa-steam">' + X.p("M248 120q-3-5 0-9M256 120q-3-5 0-9", "none", 0, ' stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"') + "</g>" + X.r(272, 118, 12, 16, 4, "#ffffff", 1.6) + X.c(278, 120, 1.2, "#1d1d1f", 0) + X.c(275, 122, 1.2, "#1d1d1f", 0) + X.c(281, 122, 1.2, "#1d1d1f", 0));
        /* Gewichtsprotokoll am Fußteil */
        s += X.g(X.r(0, 0, 54, 64, 6, "#c9a77c", 2) + X.r(5, 8, 44, 52, 3, "#ffffff", 1.4) + X.t(27, 20, "Gewicht", { s: 7.5, w: 800 }) + X.t(27, 34, "Mo 71,2", { s: 7.5, w: 600 }) + X.t(27, 46, "Mi 74,0", { s: 7.5, w: 800, c: "#b91c1c" }) + X.t(27, 56, "+2,8 kg", { s: 7, w: 800, c: "#b91c1c" }), "translate(336,186)");
        return s;
      }
    });
  }
  var kb = C.live.filter(function (l) { return l.k === "kranzbild"; })[0];
  if (kb) {
    kb.art = kranzScene();
    kb.mood = "tired";
    kb.banner = { name: "Edith Kranz", sub: "81 J. · Zimmer 514 · dekompensierte Herzinsuffizienz", chips: [["Trinkmenge max. 1,5 l", "warn"], ["Kalium 3,1 mmol/l", "red"]] };
    var old = kb.spots;
    function sp(t) { return old.filter(function (x) { return x.t.indexOf(t) === 0; })[0] || {}; }
    kb.spots = [
      Object.assign({}, sp("Gestaute"), { c: [[Math.round(spotP.neck[0]), Math.round(spotP.neck[1]), 13]] }),
      Object.assign({}, sp("Lippen"), { c: [[Math.round(spotP.head[0]), Math.round(spotP.head[1] + 14), 11]] }),
      Object.assign({}, sp("Orthopnoe"), { c: [[Math.round(spotP.pill[0]), Math.round(spotP.pill[1]), 26]] }),
      Object.assign({}, sp("Beinödeme"), { c: [[352, 160, 26]] }),
      Object.assign({}, sp("Trinkmenge"), { c: [[250, 122, 36]] }),
      Object.assign({}, sp("Gewichts"), { c: [[363, 218, 30]] })
    ];
  }

  /* ---------- Kurzinfusion Herr Brinkmann (nur mit Pflegefachperson) ---------- */
  var bri = P.A.av, hoff = C.people.anleitung.av;
  function arm(o) {
    o = o || {};
    var s = X.blank("#dde9f4");
    for (var i = 0; i < 8; i++) s += X.l(0, 18 + i * 36, 400, 18 + i * 36, "#d2e1ef", 1.2);
    s += X.r(0, 70, 120, 150, 30, "#9fd4c7", 2.2);
    s += X.p("M100 112C180 104 260 112 316 122L316 178C260 188 180 196 100 188Z", "#f6d2b3", 2.2);
    s += X.g(X.p("M0 -30q30-6 46 0l26-4q8 0 8 6t-8 7l-20 3h28q8 0 8 7t-8 7h-26h24q8 0 8 7t-8 7h-26h18q7 0 7 6t-7 6h-30q-26 8-50-4z", "#f6d2b3", 2.2) + X.p("M8 -30q-6-16 6-22q10-2 12 8l2 12", "#f6d2b3", 2.2), "translate(312,150)");
    s += X.p("M140 150C200 144 260 148 320 152", "none", 0, ' stroke="#8fb3e6" stroke-width="2.4" opacity=".6"');
    if (o.phleb) s += '<g class="pa-glow">' + X.p("M170 150C200 144 240 146 268 150", "none", 0, ' stroke="#ef4444" stroke-width="16" stroke-linecap="round" opacity=".35"') + "</g>" + X.e(244, 150, 30, 20, "#f87171", 0, ' opacity=".35"');
    if (o.old) s += X.r(226, 132, 44, 34, 6, "#e0f2fe", 1.6, ' opacity=".9"') + X.p("M232 150h34", "none", 0, ' stroke="#ec4899" stroke-width="5" stroke-linecap="round"') + X.r(262, 142, 16, 16, 3, "#ec4899", 1.8);
    if (o.removed) s += X.gauze(232, 138, 26, 22) + X.tag(250, 116, "PVK entfernt", "ok");
    if (o.neu) {
      s += '<g class="' + (o.neuNew ? "pa-in" : "") + '">' + X.r(156, 130, 56, 40, 6, "#eef7ff", 1.8, ' opacity=".95"') + X.p("M162 150h40", "none", 0, ' stroke="#2563eb" stroke-width="5" stroke-linecap="round"') + X.r(198, 141, 18, 18, 3, "#2563eb", 1.8) + X.t(184, 166, "Fr 07:58", { s: 7, w: 800, c: "#334155" }) + "</g>";
      s += X.r(214, 144, 16, 12, 3, o.cap === false ? "#e2e8f0" : "#f8fafc", 1.6);
    }
    if (o.swab) s += '<g class="pa-wiggle">' + X.r(214, 126, 24, 20, 4, "#ffffff", 1.6) + "</g>" + X.tag(226, 96, "15 s reiben · trocknen lassen", "");
    if (o.flush) s += '<g class="pa-in">' + X.syringe(232, 150, 76, 0, o.flushDone ? 0.1 : 0.8, "nacl") + "</g>" + (o.flushAnim ? X.p("M230 150H160", "none", 0, ' class="pa-flow" stroke="#38bdf8" stroke-width="3" stroke-dasharray="5 7"') : "");
    if (o.line) s += X.tube("M230 150C280 150 300 90 330 40L340 0", "#f8fafc", 3) + (o.flow ? X.p("M230 150C280 150 300 90 330 40L340 0", "none", 0, ' class="pa-flow" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 8"') : "") + X.r(300, 70, 20, 12, 3, o.flow ? "#22c55e" : "#f97316", 1.6);
    if (o.gloves) s += X.glove(110, 250, 20, "#bfdbfe") + X.glove(300, 250, -20, "#bfdbfe");
    return s;
  }
  function infScene(i) {
    var bed = function (mood, post, iv) { return X.bedScene(bri, { mood: mood, legs: "flat", blanket: "#d6efe9", iv: iv, post: post }); };
    if (i === 0) return bed("neutral", function () { return X.tag(250, 60, "07:30 · Ceftriaxon 2 g um 08 Uhr", ""); });
    if (i === 1) return X.blank("#eef3f8") + '<g class="pa-in">' + X.bust(hoff, "happy", 120, 140, 150) + "</g>" + X.bust(window.PXAV ? { hair: "LN", hairC: "#6b4a2f", skin: "#e8b48f", cloth: "#4f7fe0", deco: "scrubs", bg: "#e6efff" } : {}, "smile", 290, 140, 150) + X.tag(200, 244, "Sabine Hoffmann kommt dazu: ihr arbeitet gemeinsam", "ok");
    if (i === 2) return X.blank() + X.clipboard(60, 30, 280, 220, "Anordnung · Herr Brinkmann", ["Ceftriaxon 2 g i.v. 08:00", "in 100 ml NaCl 0,9 %", "Laufzeit 30 min", "Allergie: Pflaster mit Zinkoxid", "Ziel-SpO₂ 88–92 %"], { mark: 3 }) + X.check(318, 236);
    if (i === 3) return X.blank() + X.tray(30, 50, 340, 170) + X.r(70, 80, 30, 50, 6, "#ffffff", 1.8) + X.r(74, 70, 22, 12, 3, "#f97316", 1.6) + X.t(85, 150, "Ceftriaxon", { s: 9 }) + '<g class="pa-slide">' + X.syringe(110, 100, 70, 10, 0.7) + "</g>" + X.p("M240 70h70v100q0 14-14 14h-42q-14 0-14-14z", "#f0f9ff", 2) + X.r(250, 96, 50, 22, 3, "#ffffff", 1.4) + X.t(275, 111, "NaCl 100 ml", { s: 8 }) + X.r(250, 126, 50, 16, 3, "#fef3c7", 1.4) + X.t(275, 138, "+ Ceftriaxon 2 g", { s: 7.5, w: 800 }) + X.tag(200, 244, "unmittelbar vor der Gabe · beschriftet", "");
    if (i === 4) return X.blank() + X.ivpole(200, { lvl: 0.9, label: 1, clamp: "closed" }) + X.tube("M200 120C200 170 240 200 290 220", "#f8fafc", 3) + '<g class="pa-in">' + X.r(194, 108, 12, 8, 2, "#7dd3fc", 0) + "</g>" + X.tag(300, 70, "Tropfkammer halb · luftfrei", "ok");
    if (i === 5) return arm({ old: 1, phleb: 1 }) + X.tag(250, 90, "gerötet · warm · Strang tastbar: VIP 3", "bad");
    if (i === 6) return arm({ removed: 1, phleb: 1 }) + X.tag(140, 236, "Arzt informiert · Befund dokumentiert", "");
    if (i === 7) return arm({ neu: 1, neuNew: 1 }) + X.tag(190, 96, "rechter Unterarm · Folienverband ohne Zinkoxid", "ok");
    if (i === 8) return arm({ neu: 1, gloves: 1 });
    if (i === 9) return arm({ neu: 1, swab: 1 });
    if (i === 10) return arm({ neu: 1, flush: 1, flushAnim: 1 }) + X.tag(270, 236, "10 ml NaCl · Push-Pause · kein Widerstand", "ok");
    if (i === 11) return arm({ neu: 1, line: 1, flow: 1 }) + X.tag(150, 236, "Luer-Lock · Klemme offen · Kollegin kontrolliert", "ok");
    if (i === 12) return X.blank() + '<g transform="translate(150,30) scale(2)">' + X.r(-5, 0, 10, 20, 4, "#f1f5f9", 1.4) + X.r(-4, 10, 8, 9, 3, "#bae6fd", 0) + '<circle class="pa-drip" cx="0" cy="4" r="1.6" fill="#38bdf8"/>' + X.l(0, 20, 0, 90, "#94a3b8", 1.4) + "</g>" + '<g transform="translate(280,130)">' + X.c(0, 0, 54, "#ffffff", 2) + X.t(0, -4, "67", { s: 30, w: 800 }) + X.t(0, 18, "Tropfen/min", { s: 10 }) + "</g>" + X.tag(280, 220, "100 ml × 20 Tr ÷ 30 min", "");
    if (i === 13) return bed("smile", function () { return X.tag(250, 60, "bei ihm bleiben · Juckreiz? Atemnot?", ""); }, { lvl: 0.6, label: 1, flow: 1, clamp: "open" });
    if (i === 14) return arm({ neu: 1, flush: 1, flushDone: 1 }) + X.tag(140, 236, "nachgespült · neue sterile Kappe", "ok");
    return X.blank() + X.clipboard(60, 26, 280, 230, "Pflegebericht 08:40", ["08:05–08:35 Ceftriaxon 2 g, Ch.-B. notiert", "gut vertragen, kein Exanthem", "alter PVK li.: Phlebitis VIP 3, entfernt", "neuer PVK re. Unterarm 07:58, 20 G", "Folienverband ohne Zinkoxid", "gemeinsam mit S. Hoffmann (PFP)"], { mark: 2 }) + X.check(318, 236);
  }
  var inf = C.live.filter(function (l) { return l.k === "infusion"; })[0];
  if (inf) {
    Object.assign(inf, {
      ic: "bag", mood: "neutral", kurz: "Kurzinfusion",
      intro: "07:30 Uhr. Um 08 Uhr ist die Antibiose fällig: Ceftriaxon 2 g in 100 ml NaCl 0,9 % über 30 Minuten. Der PVK am linken Unterarm liegt seit gestern 10 Uhr. Herr Brinkmann sagt: „Der Arm brennt seit heute Nacht. Ist das normal?“ Sabine Hoffmann steht am Stützpunkt.",
      steps: [
        { t: "Pflegefachperson dazuholen", ic: "person", ph: "vor", fb: "Eine Infusion an einen PVK anschließen darfst du als Auszubildende nur gemeinsam mit einer Pflegefachperson. Ihr arbeitet ab jetzt zusammen." },
        { t: "Anordnung in der Kurve prüfen", ic: "doc", ph: "vor", fb: "Patient, Wirkstoff, Dosis, Trägerlösung, Laufzeit, Zeitpunkt, Applikationsweg und Allergien: Zinkoxid-Pflaster verträgt er nicht." },
        { t: "Fläche desinfizieren, Antibiotikum zubereiten", ic: "tray", ph: "vor", fb: "Nach Fachinformation auflösen, unmittelbar vor der Gabe in den Beutel geben, beschriften." },
        { t: "Infusionssystem luftfrei befüllen", ic: "bag", ph: "vor", fb: "Rollklemme zu, Dorn Non-Touch einstechen, Tropfkammer halb füllen, System langsam luftfrei befüllen." },
        { t: "Zugang ansehen und tasten", ic: "eye", ph: "durch", fb: "Rötung 2 cm, warm, schmerzhaft, tastbarer Strang: Phlebitis, VIP-Score 3. Dieser Zugang wird nicht mehr benutzt.", say: "Sehen Sie? Da brennt's. Ich hab nichts gesagt, ich wollte nicht stören." },
        { t: "PVK entfernen lassen, Arzt informieren", ic: "stop", ph: "durch", fb: "Mit Sabine Hoffmann entfernt, Einstichstelle beobachtet, Arzt informiert, Befund dokumentiert." },
        { t: "Neuen PVK mit Folienverband fixieren", ic: "bandage", ph: "durch", fb: "Dr. Meier hat den neuen Zugang gelegt. Ihr fixiert mit transparentem Folienverband ohne Zinkoxid, beschriftet mit Datum und Uhrzeit." },
        { t: "Hände desinfizieren, Handschuhe anziehen", ic: "glove", ph: "durch", fb: "Händedesinfektion und unsterile Handschuhe vor jedem Kontakt mit dem Zugang." },
        { t: "Konnektor 15 Sekunden desinfizieren", ic: "swab", ph: "durch", fb: "Mit alkoholischem Tupfer mindestens 15 Sekunden reiben und vollständig trocknen lassen." },
        { t: "Mit 10 ml NaCl pulsierend spülen", ic: "flush", ph: "durch", fb: "Push-Pause aus der Fertigspritze, dabei auf Widerstand, Schwellung und Schmerz achten und Herrn Brinkmann fragen." },
        { t: "System anschließen, Klemme öffnen", ic: "clamp", ph: "durch", fb: "Luer-Lock fest, Rollklemme auf, Verbindung gesichert. Sabine Hoffmann kontrolliert mit." },
        { t: "67 Tropfen pro Minute einstellen", ic: "clock", ph: "durch", fb: "100 ml × 20 Tropfen ÷ 30 Minuten ≈ 67 Tropfen pro Minute." },
        { t: "Bei ihm bleiben und beobachten", ic: "eye", ph: "durch", fb: "In den ersten Minuten auf Unverträglichkeit achten: Juckreiz, Ausschlag, Atemnot. Einstichstelle kontrollieren, Klingel in Reichweite.", say: "Das brennt jetzt gar nicht mehr. Danke, dass Sie so genau hingeschaut haben." },
        { t: "Abschließen: nachspülen, neue Kappe", ic: "flush", ph: "nach", fb: "Klemme zu, System lösen, Konnektor desinfizieren, mit 10 ml NaCl nachspülen, neue sterile Verschlusskappe." },
        { t: "Dokumentieren", ic: "doc", ph: "nach", fb: "Beginn und Ende, Wirkstoff, Dosis, Charge, Verträglichkeit; Phlebitis mit VIP-Score; neuer PVK mit Ort, Größe, Datum; wer beteiligt war." }
      ],
      wrong: [
        { t: "Allein anhängen, ist ja Routine", ic: "bag", ko: true, fb: "Kritisch: Als Auszubildende hängst du keine Infusion ohne Pflegefachperson an." },
        { t: "Über den geröteten Zugang laufen lassen", ic: "bag", ko: true, fb: "Kritisch: Bei Phlebitis wird der Zugang nicht mehr benutzt." },
        { t: "Bei Widerstand fester spülen", ic: "flush", ko: true, fb: "Kritisch: Druck kann einen Thrombus lösen oder die Vene platzen lassen. Bei Widerstand stoppen." },
        { t: "Kleine Luftblasen im System lassen", ic: "bag", ko: true, fb: "Kritisch: Luft im System wird nicht toleriert. Luftfrei befüllen." },
        { t: "Mit normalem Pflaster fixieren", ic: "bandage", fb: "Er verträgt Zinkoxid-Pflaster nicht. Folienverband ohne Zinkoxid." },
        { t: "Tropfen nach Gefühl einstellen", ic: "clock", fb: "Die Laufgeschwindigkeit wird berechnet und kontrolliert." }
      ],
      scene: infScene,
      status: function (i) { return ["Wer macht was?", "Anordnung", "Zubereiten", "System", "Zugang beurteilen", "Phlebitis", "Neuer Zugang", "Hygiene", "Konnektor", "Spülen", "Anschließen", "Tropfgeschwindigkeit", "Überwachen", "Abschluss", "Dokumentation"][i] || ""; },
      statusEnd: "Antibiose gut vertragen"
    });
    delete inf.art;
  }
})();
