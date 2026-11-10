/* ===== Zeichenbausteine für die Fälle 9 bis 12 (Kardiologie, Pneumologie, Nephrologie, Onkologie) =====
   Gleiche Bildsprache wie die übrigen Fälle (PXB), aber ruhigere Nahaufnahmen: weiche Flächen, wenige Linien, klare Beschriftung. */
(function () {
  var X = window.PXB;
  if (!X) return;
  var K = X.K;
  var L = X.L9 = {};
  var SKIN = "#f3cfb3", SKIN_D = "#e2b493", SKIN_L = "#f8dcc6";
  L.SKIN = SKIN;

  /* weicher Hintergrund für Nahaufnahmen */
  L.bg = function (col) {
    return X.defs() + '<rect width="400" height="280" fill="' + (col || "#eaf1f8") + '"/>' +
      '<rect width="400" height="280" fill="url(#' + X._id + 'b)" opacity=".45"/>';
  };
  L.sheet = function (y) {
    y = y == null ? 214 : y;
    return X.p("M0 " + y + "C80 " + (y - 8) + " 150 " + (y + 6) + " 210 " + (y - 2) + "S330 " + (y - 10) + " 400 " + (y + 2) + "V280H0Z", "#dbe8f6", 2) +
      X.p("M40 " + (y + 22) + "q50-8 100 2M230 " + (y + 30) + "q60-10 130 0", "none", 0, ' stroke="#c4d6ea" stroke-width="2" stroke-linecap="round"');
  };
  L.label = function (x, y, txt, o) {
    o = o || {};
    var w = txt.length * (o.s ? o.s * 0.56 : 5.4) + 14;
    return X.r(x - (o.a === "start" ? 0 : w / 2), y - 10, w, 18, 9, o.bg || "#ffffff", 1.4) + X.t(o.a === "start" ? x + 7 : x, y + 3, txt, { s: o.s || 9, w: 700, c: o.c || "#334155", a: o.a === "start" ? "start" : "middle" });
  };
  L.callout = function (x1, y1, x2, y2, txt, o) {
    return X.l(x1, y1, x2, y2, "#64748b", 1.2, ' stroke-dasharray="3 3"') + X.c(x1, y1, 2.6, "#64748b", 0) + L.label(x2, y2, txt, o);
  };

  /* ---------- Oberkörper frontal (Kardiologie: EKG, Onkologie: Port) ---------- */
  /* Feste Punkte für EKG-Elektroden; Blick von vorn, rechte Körperseite der Person = linke Bildseite */
  L.EKG = {
    V1: [187, 148], V2: [213, 148], V3: [236, 160], V4: [260, 172], V5: [292, 176], V6: [322, 180]
  };
  L.torso = function (o) {
    o = o || {};
    var s = L.bg("#e9f0f7");
    /* Kissen und Laken */
    s += X.p("M40 -10H360V22Q200 40 40 22Z", "#ffffff", 0) + X.p("M40 22Q200 40 360 22", "none", 0, ' stroke="#d5e1ee" stroke-width="2"');
    /* Hals */
    /* Rumpf mit Schultern und Oberarmen */
    s += X.p("M64 280C58 220 52 160 58 118Q64 72 120 60L170 44Q200 56 230 44L280 60Q336 72 342 118C348 160 342 220 336 280Z", SKIN, 2.2);
    /* Hals: weich in die Schultern auslaufend, ohne harte Kante */
    s += X.p("M173 -6V24Q173 42 150 52Q200 60 250 52Q227 42 227 24V-6Z", SKIN, 0) + X.p("M173 -6V24Q173 42 150 52M227 -6V24Q227 42 250 52", "none", 2.2) + X.p("M181 -6V20Q200 30 219 20V-6Z", SKIN_D, 0, ' opacity=".22"') + X.p("M190 56q10 6 20 0", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.8" stroke-linecap="round"');
    s += X.p("M66 278C60 220 56 160 62 120Q66 96 84 82Q72 120 76 180Q80 240 86 278Z", SKIN_D, 0, ' opacity=".28"') + X.p("M334 278C340 220 344 160 338 120Q334 96 316 82Q328 120 324 180Q320 240 314 278Z", SKIN_D, 0, ' opacity=".28"');
    /* Arme (Achsel angedeutet) */
    s += X.p("M98 118C96 170 98 220 104 280", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="2" stroke-linecap="round"');
    s += X.p("M302 118C304 170 302 220 296 280", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="2" stroke-linecap="round"');
    /* Schlüsselbeine, Brustbein, Brustkontur, Bauchnabel */
    s += X.p("M178 54Q150 62 116 66M222 54Q250 62 284 66", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="2.2" stroke-linecap="round"');
    s += X.p("M200 62V178", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.6" stroke-linecap="round" opacity=".7"');
    s += X.p("M124 168Q150 184 184 172M216 172Q250 184 276 168", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="2" stroke-linecap="round" opacity=".8"');
    s += X.c(160, 160, 2.6, "#c98f6b", 0) + X.c(240, 160, 2.6, "#c98f6b", 0);
    if (o.belly !== false) s += X.p("M198 246q2 4 4 0", "none", 0, ' stroke="#c98f6b" stroke-width="2" stroke-linecap="round"');
    /* Rippen und Zwischenrippenräume als Orientierung */
    if (o.guide) {
      var g = '<g class="pa-fade" opacity=".9">';
      [110, 126, 142, 158, 174].forEach(function (y, i) {
        g += X.p("M196 " + y + "Q160 " + (y - 4) + " 126 " + (y + 10 + i * 2) + "M204 " + y + "Q240 " + (y - 4) + " 280 " + (y + 10 + i * 2), "none", 0, ' stroke="#93c5fd" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round"');
      });
      g += X.p("M200 92h0", "none", 0) + X.c(200, 92, 3.4, "#2563eb", 0) + L.label(200, 80, "Angulus sterni → 2. Rippe", { c: "#1d4ed8", bg: "#eff6ff" });
      g += X.l(260, 70, 260, 214, "#94a3b8", 1.2, ' stroke-dasharray="2 4"') + L.label(276, 222, "Medioklavikularlinie", { s: 8 });
      g += X.l(292, 96, 292, 208, "#cbd5e1", 1.2, ' stroke-dasharray="2 4"') + X.l(322, 104, 322, 208, "#cbd5e1", 1.2, ' stroke-dasharray="2 4"');
      g += "</g>";
      s += g;
    }
    /* Port unter dem rechten Schlüsselbein */
    if (o.port) {
      s += X.e(140, 96, 18, 13, SKIN_L, 0) + X.e(140, 96, 18, 13, "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.8"') + X.e(140, 96, 9, 6, "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.4" opacity=".8"');
      s += X.p("M152 88Q168 70 182 46", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.6" stroke-dasharray="3 4" opacity=".75"');
    }
    if (o.sheet !== false) s += L.sheet(o.sheetY || 232);
    return s;
  };
  L.electrode = function (x, y, col, o) {
    o = o || {};
    var s = (o.cable ? X.p("M" + x + " " + y + "C" + x + " " + (y + 40) + " " + (o.cable[0]) + " " + (o.cable[1] - 40) + " " + o.cable[0] + " " + o.cable[1], "none", 0, ' stroke="' + (col || "#64748b") + '" stroke-width="2.2" stroke-linecap="round" opacity=".85"') : "");
    s += X.c(x, y, 8.5, "#ffffff", 1.6) + X.c(x, y, 4.2, "#e5e7eb", 1.2) + X.c(x, y, 1.8, "#94a3b8", 0);
    if (col) s += X.r(x - 3, y + 3, 6, 9, 2, col, 1.4);
    if (o.lab) s += X.t(x, y - 13, o.lab, { s: 8.5, w: 800, c: "#0f172a" });
    return '<g class="' + (o.anim ? "pa-pop" : "") + '">' + s + "</g>";
  };
  /* Farben nach IEC: rot rechter Arm, gelb linker Arm, grün linkes Bein, schwarz rechtes Bein; Brustwand C1 bis C6 */
  L.EKGC = { V1: "#ef4444", V2: "#eab308", V3: "#22c55e", V4: "#a16207", V5: "#111827", V6: "#a855f7", R: "#ef4444", L: "#eab308", F: "#22c55e", N: "#111827" };
  L.chestLeads = function (n, anim) {
    var keys = ["V1", "V2", "V4", "V3", "V5", "V6"], s = "";
    for (var i = 0; i < Math.min(n, keys.length); i++) {
      var k = keys[i], p = L.EKG[k];
      s += L.electrode(p[0], p[1], L.EKGC[k], { lab: k, anim: anim && i === n - 1 });
    }
    return s;
  };
  /* Unterarme oder Unterschenkel von oben (Extremitätenelektroden) */
  L.limbs = function (o) {
    o = o || {};
    var arms = o.arms, s = L.bg("#e9f0f7") + X.r(-10, 150, 420, 140, 0, "#dbe8f6", 0);
    var limb = function (y) {
      return X.p("M-10 " + (y - 22) + "C100 " + (y - 30) + " 200 " + (y - 26) + " 290 " + (y - 18) + "L" + (arms ? 336 : 350) + " " + (y - 16) + "Q" + (arms ? 384 : 380) + " " + (y - 10) + " " + (arms ? 384 : 382) + " " + y + "Q" + (arms ? 384 : 380) + " " + (y + 12) + " " + (arms ? 336 : 350) + " " + (y + 18) + "L290 " + (y + 20) + "C200 " + (y + 28) + " 100 " + (y + 30) + " -10 " + (y + 26) + "Z", SKIN, 2.2) +
        X.p("M-10 " + (y + 14) + "C100 " + (y + 18) + " 200 " + (y + 16) + " 290 " + (y + 10), "none", 0, ' stroke="' + SKIN_D + '" stroke-width="10" stroke-linecap="round" opacity=".18"') +
        (arms ? X.p("M330 " + (y - 17) + "Q350 " + (y - 26) + " 378 " + (y - 20) + "Q396 " + (y - 14) + " 396 " + (y - 4) + "Q394 " + (y + 6) + " 376 " + (y + 6) + "L370 " + (y + 8) + "Q392 " + (y + 14) + " 384 " + (y + 24) + "Q360 " + (y + 30) + " 330 " + (y + 19) + "Z", SKIN, 2) + X.p("M350 " + (y - 8) + "h30M350 " + (y + 1) + "h28", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.4" stroke-linecap="round"')
          : X.p("M350 " + (y - 16) + "Q372 " + (y - 30) + " 390 " + (y - 22) + "Q402 " + (y - 10) + " 402 " + y + "Q402 " + (y + 12) + " 390 " + (y + 22) + "Q372 " + (y + 32) + " 350 " + (y + 18) + "Z", SKIN, 2) + [-14, -5, 4, 13].map(function (d) { return X.c(400, y + d, 3.4, SKIN_L, 1.2); }).join(""));
    };
    s += arms ? limb(118) + limb(206) : X.g(limb(118) + limb(206), "translate(-40,0)");
    s += L.label(16, 84, arms ? "rechter Arm" : "rechtes Bein", { a: "start" }) + L.label(16, 252, arms ? "linker Arm" : "linkes Bein", { a: "start" });
    var k1 = arms ? "R" : "N", k2 = arms ? "L" : "F", x = arms ? 296 : 300;
    if (o.n >= 1) s += L.electrode(x, 118, L.EKGC[k1], { lab: k1, anim: o.n === 1 });
    if (o.n >= 2) s += L.electrode(x, 206, L.EKGC[k2], { lab: k2, anim: o.n === 2 });
    return s;
  };
  L.legs = function (o) { return L.limbs(o); };
  /* EKG-Gerät mit 12 Ableitungen */
  L.ekgMachine = function (x, y, o) {
    o = o || {};
    var s = X.sh(x + 90, y + 150, 90, 6, 0.12) + X.r(x, y, 180, 140, 14, "#f8fafc", 2) + X.r(x + 10, y + 10, 160, 92, 8, "#0b1222", 1.6);
    var names = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
    for (var i = 0; i < 12; i++) {
      var col = i < 6 ? 0 : 1, row = i % 6, bx = x + 18 + col * 78, by = y + 22 + row * 13.5;
      var noisy = o.noise && (names[i] === "V5" || names[i] === "II");
      var d = "M" + bx + " " + by;
      for (var k = 0; k < 3; k++) {
        var ox = bx + k * 22;
        d += noisy ? " l3 -2 l2 3 l2 -3 l2 2 l2 -2 l2 3 l2 -2 l2 1 l3 0" : " h6 l2 -1.5 l2 1.5 h2 l1.5 2 l2 -9 l2 11 l1.5 -4 h4";
      }
      s += X.t(bx - 4, by + 3, names[i], { s: 5.5, w: 700, c: "#64748b", a: "end" }) + '<path d="' + d + '" fill="none" stroke="' + (noisy ? "#f59e0b" : "#4ade80") + '" stroke-width="1.1" stroke-linejoin="round"' + (o.anim ? ' class="pa-ecg"' : "") + "/>";
      if (o.st && (names[i] === "V2" || names[i] === "V3" || names[i] === "V4")) s += X.l(bx + 12, by - 5, bx + 66, by - 5, "#f87171", 0.8, ' stroke-dasharray="2 2" opacity=".7"');
    }
    s += X.r(x + 12, y + 110, 46, 20, 6, o.btn === "rec" ? "#22c55e" : "#e2e8f0", 1.4) + X.t(x + 35, y + 124, "Start", { s: 8, w: 800, c: o.btn === "rec" ? "#ffffff" : "#334155" });
    s += X.r(x + 64, y + 110, 46, 20, 6, "#e2e8f0", 1.4) + X.t(x + 87, y + 124, "Filter", { s: 8, w: 800 });
    s += X.r(x + 116, y + 110, 52, 20, 6, o.paper ? "#ffffff" : "#e2e8f0", 1.4) + X.t(x + 142, y + 124, o.paper ? "25 mm/s" : "Drucken", { s: 7.5, w: 800 });
    return s;
  };
  L.ekgStrip = function (x, y, w, o) {
    o = o || {};
    var s = X.r(x, y, w, 46, 3, "#fff7f7", 1.4);
    for (var i = 1; i < w / 10; i++) s += X.l(x + i * 10, y, x + i * 10, y + 46, "#fecaca", 0.6);
    for (var j = 1; j < 5; j++) s += X.l(x, y + j * 9.2, x + w, y + j * 9.2, "#fecaca", 0.6);
    var d = "M" + (x + 4) + " " + (y + 28);
    for (var k = 0; k < Math.floor((w - 8) / 40); k++) d += " h10 l3 -3 l3 3 h4 l2 3 l3 -18 l3 21 l2 -6 h4 q4 -6 8 0 h-2";
    s += '<path d="' + d + '" fill="none" stroke="#111827" stroke-width="1.2" stroke-linejoin="round"/>';
    if (o.lab) s += X.t(x + 6, y + 10, o.lab, { s: 7, w: 800, a: "start", c: "#b91c1c" });
    return s;
  };

  /* ---------- Hals mit Trachealkanüle (Pneumologie) ---------- */
  L.neck = function (o) {
    o = o || {};
    var s = L.bg("#e9f0f7");
    /* Kissen */
    s += X.p("M-10 -10H410V30Q200 50 -10 30Z", "#ffffff", 0) + X.p("M-10 30Q200 50 410 30", "none", 0, ' stroke="#d5e1ee" stroke-width="2"');
    /* Kinn und Hals, Schultern */
    s += X.p("M146 -10Q150 34 172 46Q200 54 228 46Q250 34 254 -10Z", SKIN, 2.2) + X.p("M160 -10Q164 26 180 36Q200 42 220 36Q236 26 240 -10Z", SKIN_D, 0, ' opacity=".22"');
    s += X.p("M156 42Q154 100 140 130L30 160Q0 172 -10 200V280H410V200Q400 172 370 160L260 130Q246 100 244 42Q200 62 156 42Z", SKIN, 2.2);
    s += X.p("M178 70q22 8 44 0", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.6"');
    s += X.p("M150 142Q110 150 60 156M250 142Q290 150 340 156", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="2" stroke-linecap="round"');
    /* Hemd */
    s += X.p("M-10 214Q60 186 140 180L200 230L260 180Q340 186 410 214V280H-10Z", o.gown || "#c7dbef", 2.2) + X.p("M200 230V280", "none", 0, ' stroke="#9fbad6" stroke-width="2"');
    [196, 214, 232].forEach(function (yy, i) { s += X.c(70 + i * 120, yy + 30, 3, "#8fb0d3", 0); });
    /* Kanülenband */
    s += X.p("M152 112Q120 110 92 120M248 112Q280 110 308 120", "none", 0, ' stroke="#ffffff" stroke-width="7" stroke-linecap="round"') + X.p("M152 112Q120 110 92 120M248 112Q280 110 308 120", "none", 0, ' stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="3 3"');
    /* Schlitzkompresse */
    s += X.r(166, 100, 68, 34, 4, o.dirty ? "#fff7d6" : "#ffffff", 1.6) + X.l(200, 118, 200, 134, "#cbd5e1", 1.4);
    if (o.dirty) s += X.e(214, 126, 10, 5, "#e7d27a", 0, ' opacity=".8"');
    /* Kanülenschild und Kanüle */
    s += X.p("M154 104Q200 96 246 104Q250 112 246 120Q200 128 154 120Q150 112 154 104Z", "#eef6ff", 2) + X.c(160, 112, 3, "#ffffff", 1.4) + X.c(240, 112, 3, "#ffffff", 1.4);
    s += X.c(200, 112, 13, "#e2e8f0", 2) + X.c(200, 112, 7.5, "#0f172a", 1.6);
    if (o.cuff) s += X.p("M240 120Q262 140 276 170", "none", 0, ' stroke="#94a3b8" stroke-width="2"') + X.c(278, 176, 6, "#bfdbfe", 1.6) + L.label(306, 176, "Cuff", { s: 8 });
    if (o.sputum) s += '<g class="pa-breathe">' + X.c(200, 112, 4.5, "#e5e7b5", 0, ' opacity=".9"') + "</g>";
    if (o.hme) s += '<g class="pa-in">' + X.r(186, 80, 28, 22, 6, "#a7f3d0", 1.8) + X.r(190, 74, 20, 8, 3, "#e5e7eb", 1.4) + "</g>";
    return s;
  };
  L.catheter = function (d, o) {
    o = o || {};
    return X.p(d, "none", 0, ' stroke="#1d1d1f" stroke-width="6" stroke-linecap="round" fill="none"') + X.p(d, "none", 0, ' stroke="' + (o.col || "#f1f5f9") + '" stroke-width="3.6" stroke-linecap="round" fill="none"') + (o.flow ? X.p(d, "none", 0, ' class="pa-flow" stroke="#e5e7b5" stroke-width="2.4" stroke-dasharray="5 6" stroke-linecap="round"') : "");
  };
  /* Wandabsaugung mit Manometer und Sekretbehälter */
  L.suction = function (x, y, o) {
    o = o || {};
    var s = X.r(x, y, 70, 22, 6, "#e2e8f0", 1.8) + X.c(x + 20, y + 44, 18, "#ffffff", 1.8);
    for (var i = 0; i < 7; i++) { var a = (-200 + i * 36) * Math.PI / 180; s += X.l(x + 20 + Math.cos(a) * 13, y + 44 + Math.sin(a) * 13, x + 20 + Math.cos(a) * 16, y + 44 + Math.sin(a) * 16, "#94a3b8", 1.2); }
    var ang = (o.on ? -110 : -200) * Math.PI / 180;
    s += X.l(x + 20, y + 44, x + 20 + Math.cos(ang) * 12, y + 44 + Math.sin(ang) * 12, o.on ? "#16a34a" : "#64748b", 2);
    s += X.t(x + 20, y + 70, o.on ? "−0,2 bar" : "aus", { s: 7.5, w: 800, c: o.on ? "#15803d" : "#64748b" });
    s += X.r(x + 44, y + 28, 30, 58, 8, "#f8fafc", 1.8) + X.r(x + 46, y + 70 - (o.lvl || 0) * 30, 26, 14 + (o.lvl || 0) * 30, 6, "#eef2c4", 0) + X.r(x + 52, y + 22, 14, 8, 3, "#cbd5e1", 1.4);
    return s;
  };

  /* ---------- Bauch (Nephrologie: s. c. Injektion) ---------- */
  L.belly = function (o) {
    o = o || {};
    var s = L.bg("#e9f0f7");
    s += X.p("M40 -10C30 60 26 140 40 210Q60 270 120 290H280Q340 270 360 210C374 140 370 60 360 -10Z", SKIN, 2.2);
    /* Hemd hochgeschoben, Hose */
    s += X.p("M30 -10H370V30Q300 46 200 44Q100 46 30 30Z", o.gown || "#c7dbef", 2);
    s += X.p("M36 236Q200 214 364 236V290H36Z", "#9fb4cc", 2) + X.p("M120 250q80-10 160 0", "none", 0, ' stroke="#8299b4" stroke-width="2"');
    /* Bauchnabel und Konturen */
    s += X.e(200, 132, 6, 8, "#e6b896", 1.6) + X.p("M197 128q3 4 6 0", "none", 0, ' stroke="#c98f6b" stroke-width="1.4"');
    s += X.p("M90 70Q110 140 96 210M310 70Q290 140 304 210", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.6" opacity=".6"');
    /* alte Einstichstellen und Hämatom */
    (o.marks || []).forEach(function (m) {
      if (m[2] === "h") s += X.e(m[0], m[1], 12, 8, "#c4b5fd", 0, ' opacity=".55"') + X.e(m[0] + 2, m[1], 7, 5, "#a78bfa", 0, ' opacity=".55"');
      else s += X.c(m[0], m[1], 1.8, "#b45309", 0);
    });
    /* 5-cm-Abstand zum Nabel */
    if (o.zone) {
      s += '<g class="pa-fade">' + X.c(200, 132, 44, "none", 0, ' stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 4"') + L.label(200, 78, "5 cm Abstand zum Nabel", { c: "#b91c1c", bg: "#fef2f2" });
      s += X.p("M84 120h52v60h-52z", "#22c55e", 0, ' opacity=".14"') + X.p("M264 120h52v60h-52z", "#22c55e", 0, ' opacity=".14"');
      s += L.label(110, 196, "geeignet", { c: "#15803d", bg: "#f0fdf4" }) + L.label(290, 196, "geeignet", { c: "#15803d", bg: "#f0fdf4" }) + "</g>";
    }
    if (o.site) s += X.c(o.site[0], o.site[1], 5, "none", 0, ' stroke="#2563eb" stroke-width="2"' + (o.siteAnim ? ' class="pa-pop"' : ""));
    if (o.wet) s += '<g class="pa-glow">' + X.e(o.wet[0], o.wet[1], 22, 16, "#bae6fd", 0, ' opacity=".55"') + "</g>";
    /* Hautfalte mit Daumen und Zeigefinger */
    if (o.fold) {
      var fx = o.fold[0], fy = o.fold[1];
      s += X.p("M" + (fx - 34) + " " + (fy + 6) + "Q" + fx + " " + (fy - 22) + " " + (fx + 34) + " " + (fy + 6), SKIN_L, 2) + X.p("M" + (fx - 22) + " " + (fy + 2) + "Q" + fx + " " + (fy - 12) + " " + (fx + 22) + " " + (fy + 2), "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.4"');
      s += X.e(fx, fy + 10, 40, 8, SKIN_D, 0, ' opacity=".35"');
      s += X.glove(fx - 2, fy + 50, 0, "#dbe4ff", 0.95) + L.label(fx + 70, fy - 18, "Hautfalte halten", { s: 8.5 });
    }
    return s;
  };
  /* Fertigspritze mit Luftpolster (nicht entfernen) */
  L.prefilled = function (x, y, rot, o) {
    o = o || {};
    var len = 92, f = o.fill == null ? 1 : o.fill;
    var s = X.r(0, -8, len, 16, 4, "#f8fafc", 1.8);
    s += X.r(2, -6, (len - 26) * f, 12, 3, "#f1f5f9", 0) + (f > 0 ? X.r(2 + (len - 26) * f, -6, 22, 12, 3, "#ffffff", 0, ' opacity=".9"') : "");
    if (f > 0) s += X.c(2 + (len - 26) * f + 11, 0, 4, "none", 0, ' stroke="#bae6fd" stroke-width="1.4"') + X.t(2 + (len - 26) * f + 11, -12, "Luft", { s: 6.5, w: 800, c: "#0369a1" });
    s += X.r(len, -4, 10, 8, 2, "#e2e8f0", 1.4) + (o.cap ? X.r(len + 10, -4, 30, 8, 3, "#94a3b8", 1.4) : X.l(len + 10, 0, len + 36, 0, "#94a3b8", 1.2));
    s += X.r(-12 + (1 - f) * (len - 26), -5, 14, 10, 2, "#cbd5e1", 1.4) + X.l(-12 + (1 - f) * (len - 26), 0, -30, 0, "#cbd5e1", 4) + X.r(-36, -10, 8, 20, 3, "#e2e8f0", 1.6);
    s += X.r(16, -6, 40, 12, 2, "#fef3c7", 1) + X.t(36, 3, o.lab || "40 mg", { s: 7, w: 800 });
    return X.g(s, "translate(" + x + "," + y + ") rotate(" + (rot || 0) + ")");
  };
  L.sharps = function (x, y) {
    return X.sh(x, y + 4, 26, 4) + X.p("M" + (x - 22) + " " + (y - 44) + "h44l-4 44h-36z", "#facc15", 2) + X.r(x - 26, y - 54, 52, 12, 4, "#ef4444", 2) + X.r(x - 10, y - 52, 20, 6, 2, "#7f1d1d", 0) + X.t(x, y - 20, "♲", { s: 13, w: 800, c: "#854d0e" });
  };

  /* ---------- Arm mit Shunt (Nephrologie) ---------- */
  L.armShunt = function (o) {
    o = o || {};
    var s = L.bg("#e9f0f7") + X.r(-10, 170, 420, 120, 0, "#dbe8f6", 0);
    s += X.p("M-10 92C80 84 180 90 270 104L330 112Q368 118 372 140Q370 162 334 166L270 168C180 176 80 180 -10 176Z", SKIN, 2.2);
    s += X.p("M330 112q20 8 20 30t-20 24", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.6"');
    /* Shuntvene geschlängelt */
    s += X.p("M60 132C100 118 140 140 180 126S250 120 290 138", "none", 0, ' stroke="#8b9fd8" stroke-width="7" stroke-linecap="round" opacity=".55"');
    s += X.p("M268 150q10 6 22 2", "none", 0, ' stroke="#c98f6b" stroke-width="1.6"') + X.t(282, 186, "Shunt", { s: 8, w: 800, c: "#475569" });
    if (o.cuff) s += '<g>' + X.r(60, 80, 90, 104, 12, "#334155", 2) + X.r(66, 86, 78, 92, 8, "#475569", 0) + X.p("M150 120C190 120 200 60 230 40", "none", 0, ' stroke="#1d1d1f" stroke-width="3"') + "</g>";
    if (o.watch) s += X.r(312, 108, 16, 62, 5, "#1e293b", 2) + X.r(306, 124, 28, 30, 7, "#0f172a", 2) + X.r(310, 128, 20, 22, 4, "#38bdf8", 0, ' opacity=".7"');
    if (o.thrill) s += '<g class="pa-pulse">' + [0, 1, 2].map(function (i) { return X.p("M" + (176 + i * 8) + " 108q6-8 0-16", "none", 0, ' stroke="#2563eb" stroke-width="1.6" opacity="' + (0.9 - i * 0.25) + '"'); }).join("") + "</g>" + X.glove(176, 128, 160, "#c7d2fe", 0.8);
    return s;
  };

  /* ---------- Stationsszene Kardiologie: Leiste nach Katheter ---------- */
  L.groin = function (o) {
    o = o || {};
    var s = L.bg("#e9f0f7") + X.r(-10, 0, 420, 280, 0, "#e3edf7", 0);
    s += X.p("M-10 40C80 32 170 40 240 60L300 76Q360 92 410 96V230Q360 228 300 214L240 200C170 186 80 186 -10 190Z", SKIN, 2.2);
    s += X.p("M-10 40C40 70 70 110 80 190", "none", 0, ' stroke="' + SKIN_D + '" stroke-width="1.6" opacity=".7"');
    s += X.p("M-10 20H120Q150 60 120 120Q90 170 -10 196Z", o.gown || "#c7dbef", 2.2);
    /* Druckverband */
    s += X.p("M92 104L222 86L226 112L96 130Z", "#f1f5f9", 1.6) + X.p("M96 140L226 122L230 148L100 166Z", "#f1f5f9", 1.6);
    s += X.r(124, 96, 72, 52, 12, "#ffffff", 2) + X.r(134, 104, 52, 36, 8, "none", 0, ' stroke="#e2e8f0" stroke-width="1.4"');
    if (o.blood) s += '<g class="' + (o.bloodAnim ? "pa-glow" : "") + '">' + X.e(158, 120, 10 + o.blood * 7, 7 + o.blood * 5, "#dc2626", 0, ' opacity=".75"') + "</g>";
    if (o.hematoma) s += X.e(222, 136, 24, 16, "#a78bfa", 0, ' opacity=".35"');
    return s;
  };
})();
