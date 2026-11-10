/* ===== Illustrationen für die Praktische Examen Übung (Stil der Modul-Figuren) ===== */
(function () {
  var AV = window.PXAV, K = "#1d1d1f";
  var uid = 0;
  function a(attrs) { var s = ""; for (var k in attrs) if (attrs[k] != null) s += " " + k + '="' + attrs[k] + '"'; return s; }
  function st(w) { return ' stroke="' + K + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"'; }
  var X = {
    K: K,
    r: function (x, y, w, h, rx, fill, w2, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + (fill || "none") + '"' + (w2 === 0 ? "" : st(w2)) + (extra || "") + "/>"; },
    c: function (x, y, r, fill, w2, extra) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (fill || "none") + '"' + (w2 === 0 ? "" : st(w2)) + (extra || "") + "/>"; },
    e: function (x, y, rx, ry, fill, w2, extra) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + (fill || "none") + '"' + (w2 === 0 ? "" : st(w2)) + (extra || "") + "/>"; },
    p: function (d, fill, w2, extra) { return '<path d="' + d + '" fill="' + (fill || "none") + '"' + (w2 === 0 ? "" : st(w2)) + (extra || "") + "/>"; },
    l: function (x1, y1, x2, y2, col, w2, extra) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (col || K) + '" stroke-width="' + (w2 || 2) + '" stroke-linecap="round"' + (extra || "") + "/>"; },
    t: function (x, y, txt, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-family="Inter,system-ui,-apple-system,Segoe UI,sans-serif" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 650) + '" fill="' + (o.c || K) + '" text-anchor="' + (o.a || "middle") + '"' + (o.extra || "") + ">" + txt + "</text>"; },
    g: function (inner, tr, cls) { return "<g" + (tr ? ' transform="' + tr + '"' : "") + (cls ? ' class="' + cls + '"' : "") + ">" + inner + "</g>"; },
    sh: function (x, y, rx, ry, op) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#0b1b33" opacity="' + (op || 0.1) + '"/>'; },
    /* Kopf einer Figur in eine Szene setzen: Mittelpunkt (x,y), Größe in px */
    head: function (sp, mood, x, y, size, rot) {
      var s = size / 120;
      return '<g transform="translate(' + (x - 60 * s) + "," + (y - 56 * s) + ")" + (rot ? " rotate(" + rot + " " + 60 * s + " " + 56 * s + ")" : "") + " scale(" + s + ')">' + AV.head(sp, mood || "neutral") + "</g>";
    },
    bust: function (sp, mood, x, y, size) { var s = size / 120; return '<g transform="translate(' + (x - 60 * s) + "," + (y - 60 * s) + ") scale(" + s + ')">' + AV.bust(sp, mood || "neutral") + "</g>"; },
    defs: function () {
      var id = "g" + (++uid);
      X._id = id;
      return "<defs>" +
        '<linearGradient id="' + id + 'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#e3ecf6"/></linearGradient>' +
        '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3dfec"/><stop offset="1" stop-color="#c3d2e3"/></linearGradient>' +
        '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0ff"/><stop offset="1" stop-color="#eef7ff"/></linearGradient>' +
        '<linearGradient id="' + id + 'm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fb1c5"/><stop offset=".5" stop-color="#dce4ee"/><stop offset="1" stop-color="#9fb1c5"/></linearGradient>' +
        '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="' + id + 'v" cx=".5" cy=".4" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0b1b33" stop-opacity=".10"/></radialGradient>' +
        '<marker id="' + id + 'ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2563eb"/></marker>' +
        "</defs>";
    },
    ref: function (k) { return "url(#" + X._id + k + ")"; },
    vignette: function (w, h) { return '<rect width="' + (w || 400) + '" height="' + (h || 280) + '" fill="' + X.ref("v") + '" pointer-events="none"/>'; }
  };

  /* ---------- Raum ---------- */
  X.room = function (o) {
    o = o || {};
    var s = '<rect width="400" height="280" fill="' + X.ref("w") + '"/>';
    s += '<rect y="' + (o.floor || 214) + '" width="400" height="' + (280 - (o.floor || 214)) + '" fill="' + X.ref("f") + '"/>';
    s += X.l(0, o.floor || 214, 400, o.floor || 214, "#b3c3d6", 2);
    for (var i = 0; i < 6; i++) s += X.l(i * 80 - 20, 280, i * 80 + 30, o.floor || 214, "#c0cfe0", 1.2);
    s += '<rect y="' + ((o.floor || 214) - 16) + '" width="400" height="10" fill="#d6e2ef"/>';
    if (o.win !== false) {
      var wx = o.winX != null ? o.winX : 250, wy = 26;
      s += X.r(wx - 6, wy - 6, 112, 96, 6, "#ffffff", 2);
      s += X.r(wx, wy, 100, 84, 3, X.ref("s"), 1.6);
      s += X.c(wx + 76, wy + 64, 22, "#b9dcb0", 0) + X.c(wx + 58, wy + 72, 16, "#a6d19b", 0) + X.r(wx + 72, wy + 70, 5, 14, 1, "#9b7a5a", 0);
      s += X.e(wx + 26, wy + 22, 16, 6, "#ffffff", 0, ' opacity=".9"') + X.e(wx + 38, wy + 18, 12, 6, "#ffffff", 0, ' opacity=".9"');
      s += X.l(wx + 50, wy, wx + 50, wy + 84, K, 1.6) + X.l(wx, wy + 42, wx + 100, wy + 42, K, 1.6);
      s += X.p("M" + (wx + 4) + " " + (wy + 80) + "l26-26M" + (wx + 60) + " " + (wy + 30) + "l20-20", "none", 0, ' stroke="#ffffff" stroke-width="3" opacity=".7"');
      if (o.curtain !== false) s += '<g class="pa-sway">' + X.p("M" + (wx - 14) + " 16h22v" + 108 + "q-6 4-11 0q-6 4-11 0z", "#b8d0ea", 1.8) + X.l(wx - 7, 22, wx - 7, 120, "#9ab9dc", 1.4) + "</g>";
      s += X.r(wx - 20, 12, 140, 5, 2, "#c8d4e2", 1.4);
    }
    if (o.rail !== false) {
      var rx = o.railX != null ? o.railX : 14;
      s += X.r(rx, 70, o.railW || 150, 22, 5, "#ffffff", 1.8);
      s += X.c(rx + 18, 81, 5, "#22c55e", 1.6) + X.c(rx + 34, 81, 5, "#facc15", 1.6) + X.c(rx + 50, 81, 5, "#94a3b8", 1.6);
      s += X.r(rx + 70, 76, 30, 10, 3, "#e2e8f0", 1.4) + X.c(rx + 120, 81, 4, "#ef4444", 1.4);
    }
    if (o.disp) s += X.dispenser(o.disp, 112);
    return s;
  };
  X.dispenser = function (x, y) { return X.r(x, y, 18, 30, 4, "#ffffff", 1.8) + X.r(x + 4, y + 6, 10, 12, 2, "#cde7ff", 1.2) + X.p("M" + (x + 9) + " " + (y + 30) + "v6h-6", "none", 1.6); };

  /* ---------- Bett mit Person ---------- */
  /* Feste Geometrie: Bett ab x0, Matratzenoberkante y=178; Rückenteil hochgestellt (pose "semi" ca. 40°, "high" ca. 65°) */
  X.bed = function (o) {
    o = o || {};
    var x0 = o.x || 40, y = 178, x1 = x0 + (o.len || 300), hi = o.pose === "high";
    var hx = x0 + 78;                                  /* Gelenk Rückenteil */
    var ang = hi ? 62 : o.pose === "flat" ? 4 : 40, L = 86, rad = ang * Math.PI / 180;
    var tx = hx - Math.cos(rad) * L, ty = y - Math.sin(rad) * L;
    var s = X.sh((x0 + x1) / 2, 248, (x1 - x0) / 2 + 8, 8, 0.13);
    /* Fahrgestell */
    s += X.r(x0 + 18, y + 34, x1 - x0 - 30, 11, 4, X.ref("m"), 1.8);
    s += X.p("M" + (x0 + 40) + " " + (y + 45) + "l-8 20M" + (x1 - 40) + " " + (y + 45) + "l8 20", "none", 0, ' stroke="#64748b" stroke-width="5" stroke-linecap="round"');
    [x0 + 30, x1 - 30].forEach(function (wx) { s += X.c(wx, 240, 8, "#334155", 1.8) + X.c(wx, 240, 3, "#cbd5e1", 0); });
    /* Kopf- und Fußteil */
    s += X.r(x0 - 4, y - 70, 14, 116, 7, "#dfe8f2", 2) + X.l(x0 + 3, y - 60, x0 + 3, y + 36, "#c4d2e2", 1.6);
    s += X.r(x1 - 6, y - 24, 14, 70, 7, "#dfe8f2", 2) + X.l(x1 + 1, y - 16, x1 + 1, y + 36, "#c4d2e2", 1.6);
    /* Matratze liegender Teil */
    s += X.r(hx - 4, y, x1 - hx - 2, 30, 8, "#ffffff", 2);
    s += X.l(hx + 4, y + 22, x1 - 12, y + 22, "#e5ecf4", 3);
    /* Rückenteil */
    s += X.g(X.r(-L, 0, L + 10, 30, 8, "#ffffff", 2) + X.l(-L + 8, 22, 2, 22, "#e5ecf4", 3), "translate(" + hx + "," + y + ") rotate(" + ang + ")");
    s += X.p("M" + (hx - 2) + " " + (y + 30) + "L" + (tx + 8) + " " + (y + 30), "none", 0, ' stroke="#b6c3d3" stroke-width="5" stroke-linecap="round"');
    X._bed = { x0: x0, x1: x1, y: y, hx: hx, ang: ang, tx: tx, ty: ty, L: L };
    return s;
  };
  X.rails = function (o) {
    var b = X._bed; if (!b) return "";
    var x = (o && o.x) || b.hx + 70, w = (o && o.w) || 110;
    return X.r(x, b.y - 26, w, 26, 8, "none", 2.4) + [1, 2, 3].map(function (i) { return X.l(x + i * w / 4, b.y - 26, x + i * w / 4, b.y, K, 1.6); }).join("");
  };
  /* Person im Bett */
  X.patient = function (sp, o) {
    o = o || {}; var b = X._bed;
    var y = b.y, rad = b.ang * Math.PI / 180, cs = Math.cos(rad), sn = Math.sin(rad);
    var bl = o.blanket || "#cfe0f5", gown = o.gown || sp.cloth || "#9cc3e6";
    var skin = AV.mix(sp.skin || "#f6d2b3", "#dfe5ea", sp.pale ? 0.45 : 0);
    /* Punkte entlang des Rückenteils: Abstand d vom Gelenk, h über der Fläche */
    function P(d, hgt) { return [b.hx - cs * d + sn * hgt * -1 * -1 * 0 + (-sn) * 0 + sn * 0 - sn * hgt * 0 + (sn * -hgt) * 0 + 0 + (-(-sn) * 0) + (sn * 0) + (hgt * Math.sin(rad) * 0) - hgt * Math.sin(rad) * 0 + (hgt * -Math.sin(rad)) * -0 + hgt * Math.cos(rad) * 0 + (hgt * sn) * 0, 0]; }
    var hk = b.ang < 15 ? 0.66 : 1;
    var px = function (d, hgt) { return b.hx - cs * d + sn * hgt * hk; }, py = function (d, hgt) { return y - sn * d - cs * hgt * hk; };
    var s = "";
    /* Kissen */
    var flat = b.ang < 15;
    if (flat) s += X.g(X.r(-32, -13, 64, 26, 12, "#ffffff", 2) + X.p("M-22 2q22 7 44 0", "none", 0, ' stroke="#e2e8f0" stroke-width="2"'), "translate(" + px(84, 8) + "," + py(84, 8) + ")");
    else s += X.g(X.r(-26, -17, 52, 34, 16, "#ffffff", 2) + X.p("M-18 -4q18 8 36 0", "none", 0, ' stroke="#e2e8f0" stroke-width="2"'), "translate(" + px(70, 20) + "," + py(70, 20) + ") rotate(" + (b.ang - 8) + ")");
    /* Oberkörper */
    var sh1 = [px(52, 6), py(52, 6)], sh2 = [px(48, 46), py(48, 46)], hip1 = [px(-6, 4), py(-6, 4)], hip2 = [px(-14, 40), py(-14, 40)];
    s += X.p("M" + hip1[0] + " " + hip1[1] + "L" + sh1[0] + " " + sh1[1] + "Q" + px(60, 26) + " " + py(60, 26) + " " + sh2[0] + " " + sh2[1] + "L" + hip2[0] + " " + hip2[1] + "Z", gown, 2.2);
    if (sp.deco === "gown" || !sp.deco) s += [[30, 20], [20, 32], [8, 18], [36, 38], [0, 30]].map(function (q) { return X.c(px(q[0], q[1]), py(q[0], q[1]), 2.2, sp.dot || "#5f8fbf", 0); }).join("");
    /* Hals und Kopf */
    var nx = px(58, 26), ny = py(58, 26);
    /* Hals: kommt aus dem runden Ausschnitt des Hemdes, oben unter dem Kinn verdeckt */
    var Q = function (d, h) { return px(d, h) + " " + py(d, h); };
    s += X.p("M" + Q(76, 20) + "L" + Q(57, 19.5) + "Q" + Q(47, 20) + " " + Q(47, 26) + "Q" + Q(47, 32) + " " + Q(57, 32.5) + "L" + Q(76, 32) + "Z", skin, 0);
    s += X.p("M" + Q(76, 20) + "L" + Q(57, 19.5) + "M" + Q(76, 32) + "L" + Q(57, 32.5), "none", 2);
    s += X.p("M" + Q(57, 18) + "Q" + Q(46, 19) + " " + Q(46, 26) + "Q" + Q(46, 33) + " " + Q(57, 34), "none", 2);
    if (o.veins) s += X.p("M" + (nx - 3) + " " + (ny - 12) + "q-3 6 0 12M" + (nx + 3) + " " + (ny - 12) + "q3 6 0 12", "none", 0, ' stroke="#5b7fd6" stroke-width="2.2" stroke-linecap="round"');
    var hsz = o.size || 74, hX = nx + (o.hdx || 2), hY = ny - hsz * 0.36;
    if (flat) { hX = px(88, 40) + (o.hdx || 0); hY = py(88, 40); }
    s += X.head(sp, o.mood, hX, hY, hsz, o.tilt != null ? o.tilt : flat ? -14 : 0);
    /* Decke */
    var bx0 = px(-2, 2), by0 = py(-2, 2) - 6, kx = b.x1 - 78, legs = o.legs || "flat";
    var topc = legs === "knee" ? "C" + (kx - 40) + " " + (y - 4) + " " + (kx - 20) + " " + (y - 30) + " " + kx + " " + (y - 30) + "C" + (kx + 24) + " " + (y - 30) + " " + (kx + 30) + " " + (y - 10) + " " + (b.x1 - 14) + " " + (y - 12)
      : "C" + (kx - 30) + " " + (y - 12) + " " + (kx + 20) + " " + (y - 14) + " " + (b.x1 - 14) + " " + (y - 14);
    s += X.p("M" + (bx0 - 16) + " " + (by0 + 6) + "Q" + (bx0 + 6) + " " + (by0 - 14) + " " + (bx0 + 40) + " " + (y - 14) + topc + "Q" + (b.x1 - 2) + " " + (y - 8) + " " + (b.x1 - 4) + " " + (y + 8) + "L" + (b.x1 - 8) + " " + (y + 40) + "Q" + ((bx0 + b.x1) / 2) + " " + (y + 46) + " " + (bx0 + 4) + " " + (y + 40) + "Z", bl, 2.2);
    s += X.p("M" + (bx0 + 70) + " " + (y - 10) + "q10 22 2 48M" + (kx + 8) + " " + (y - 24) + "q14 28 6 60", "none", 0, ' stroke="' + AV.mix(bl, "#1d1d1f", 0.16) + '" stroke-width="1.6" stroke-linecap="round"');
    s += X.p("M" + (bx0 - 8) + " " + (by0 + 2) + "Q" + (bx0 + 10) + " " + (by0 - 12) + " " + (bx0 + 40) + " " + (y - 14), "none", 0, ' stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".9"');
    /* Arm */
    if (o.arm !== "none") {
      var a0 = [px(44, 40), py(44, 40)], el = [hip2[0] + 6, y - 22], hd = [el[0] + 46, y - 20];
      var d = "M" + a0[0] + " " + a0[1] + "L" + el[0] + " " + el[1] + "L" + hd[0] + " " + hd[1];
      s += X.p(d, "none", 0, ' stroke="' + K + '" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"') + X.p(d, "none", 0, ' stroke="' + gown + '" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"');
      s += X.p("M" + (el[0] + 22) + " " + (el[1] + 2) + "L" + hd[0] + " " + hd[1], "none", 0, ' stroke="' + K + '" stroke-width="13" stroke-linecap="round"') + X.p("M" + (el[0] + 22) + " " + (el[1] + 2) + "L" + hd[0] + " " + hd[1], "none", 0, ' stroke="' + skin + '" stroke-width="9.5" stroke-linecap="round"');
      s += X.e(hd[0] + 6, hd[1] + 1, 9, 6.5, skin, 2);
      X._hand = [hd[0] + 6, hd[1]]; X._fore = [el[0] + 30, el[1] + 3];
    }
    if (o.feet) {
      var fx = b.x1 - 4, fy = y - 18, fs = o.feet.swollen ? 1.25 : 1, fc = o.feet.col || skin;
      s += X.g(X.p("M0 0q14-6 26 -2q8 4 4 12q-14 6-30 2z", fc, 2) + (o.feet.swollen ? X.c(14, 2, 2.4, AV.mix(fc, "#1d1d1f", 0.25), 0) : ""), "translate(" + fx + "," + fy + ") scale(" + fs + ")") + X.g(X.p("M0 0q14-6 26 -2q8 4 4 12q-14 6-30 2z", fc, 2), "translate(" + (fx - 4) + "," + (fy + 14) + ") scale(" + fs + ")");
      X._feet = [fx + 14, fy + 8];
    }
    X._pt = { nx: nx, ny: ny, hx: hX, hy: hY, chest: [px(30, 24), py(30, 24)], belly: [bx0 + 30, y - 10], knee: [kx, y - 26], feet: [b.x1 - 30, y - 8] };
    return s;
  };

  /* ---------- Möbel und Geräte ---------- */
  X.nightstand = function (x, o) {
    o = o || {}; var y = o.y || 168;
    var s = X.sh(x + 26, 246, 34, 5, 0.12) + X.r(x, y, 52, 74, 6, "#efe3cf", 2) + X.r(x + 6, y + 10, 40, 22, 4, "#f7efe2", 1.6) + X.l(x + 20, y + 21, x + 32, y + 21, K, 2) + X.r(x + 6, y + 38, 40, 28, 4, "#f7efe2", 1.6);
    s += X.r(x - 4, y - 6, 60, 8, 3, "#e2d2b8", 2);
    return s;
  };
  X.glass = function (x, y, lvl, col) { lvl = lvl == null ? 0.6 : lvl; var h = 26, f = h * lvl; return X.p("M" + (x - 8) + " " + (y - h) + "l2 " + h + "h12l2-" + h, "#f5fbff", 1.8) + (f > 0 ? X.p("M" + (x - 7 + (1 - lvl) * 0.6) + " " + (y - f) + "l1.4 " + (f - 1) + "h11.2l1.4-" + (f - 1) + "z", col || "#bfe3ff", 0) : "") + X.l(x - 7, y - h + 3, x - 6, y - 4, "#ffffff", 1.6); };
  X.bottle = function (x, y, col, lvl) { return X.r(x - 9, y - 40, 18, 40, 6, "#eaf6ff", 1.8) + X.r(x - 8, y - 40 * (lvl == null ? 0.7 : lvl), 16, 40 * (lvl == null ? 0.7 : lvl) - 1, 5, col || "#cdeaff", 0) + X.r(x - 5, y - 48, 10, 9, 2, "#2563eb", 1.6); };
  X.cup = function (x, y, col) { return X.p("M" + (x - 10) + " " + (y - 16) + "h20l-2 16h-16z", "#ffffff", 1.8) + X.p("M" + (x + 10) + " " + (y - 13) + "q7 0 6 6q-1 4-7 4", "none", 1.6) + X.e(x, y - 15, 9, 2.2, col || "#7a4a2a", 0) + '<g class="pa-steam">' + X.p("M" + (x - 3) + " " + (y - 22) + "q-4-6 0-10M" + (x + 4) + " " + (y - 22) + "q-4-6 0-10", "none", 0, ' stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" opacity=".7"') + "</g>"; };
  X.bell = function (x, y) { return X.r(x - 7, y - 16, 14, 22, 5, "#e2e8f0", 1.8) + X.c(x, y - 7, 4, "#ef4444", 1.4); };
  X.phone = function (x, y) { return X.r(x - 7, y - 13, 14, 24, 3, "#1e293b", 1.6) + X.r(x - 5, y - 10, 10, 17, 1.5, "#60a5fa", 0); };
  X.cigs = function (x, y) { return X.r(x - 9, y - 16, 18, 16, 2, "#f8fafc", 1.8) + X.r(x - 9, y - 16, 18, 6, 2, "#dc2626", 1.4) + X.r(x - 5, y - 21, 3, 6, 1, "#f59e0b", 1) + X.r(x, y - 22, 3, 7, 1, "#f59e0b", 1); };
  X.pills = function (x, y, col) { return X.p("M" + (x - 9) + " " + (y - 10) + "h18l-2 10h-14z", "#ffffff", 1.6) + X.c(x - 3, y - 11, 2.4, col || "#f8fafc", 1.2) + X.c(x + 3, y - 12, 2.4, "#fde68a", 1.2); };
  X.tissue = function (x, y) { return X.r(x - 12, y - 12, 24, 12, 3, "#c7d2fe", 1.6) + X.p("M" + (x - 4) + " " + (y - 12) + "q4-8 8 0", "#ffffff", 1.4); };
  X.ivpole = function (x, o) {
    o = o || {};
    var s = X.l(x, 30, x, 236, "#94a3b8", 3) + X.l(x - 16, 240, x + 16, 240, "#64748b", 3) + X.c(x - 16, 242, 3, "#475569", 0) + X.c(x + 16, 242, 3, "#475569", 0);
    s += X.p("M" + (x - 10) + " 34h20", "none", 2);
    if (o.bag !== false) {
      var bx = x, lvl = o.lvl == null ? 0.7 : o.lvl, col = o.col || "#e0f2fe";
      s += X.p("M" + (bx - 14) + " 40h28v44q0 8-8 8h-12q-8 0-8-8z", "#f8fbff", 2);
      s += X.p("M" + (bx - 12) + " " + (44 + 40 * (1 - lvl)) + "h24v" + (40 * lvl - 2) + "q0 6-6 6h-12q-6 0-6-6z", col, 0);
      if (o.label) s += X.r(bx - 9, 50, 18, 12, 2, "#ffffff", 1.2) + X.l(bx - 6, 55, bx + 6, 55, "#2563eb", 1.6) + X.l(bx - 6, 59, bx + 3, 59, "#94a3b8", 1.4);
      s += X.r(bx - 3, 92, 6, 8, 1.5, "#cbd5e1", 1.4);
      s += X.r(bx - 5, 100, 10, 20, 4, "#f1f5f9", 1.8) + X.r(bx - 4, 110, 8, 9, 3, col === "#f8fbff" ? "#e0f2fe" : col, 0);
      if (o.drip !== false) s += '<circle class="pa-drip" cx="' + bx + '" cy="104" r="1.8" fill="#38bdf8"/>';
      if (o.to) s += X.p("M" + bx + " 120C" + bx + " 170 " + (o.to[0] + 30) + " " + (o.to[1] - 30) + " " + o.to[0] + " " + o.to[1], "none", 0, ' stroke="#94a3b8" stroke-width="2" opacity=".9"') + (o.flow ? X.p("M" + bx + " 120C" + bx + " 170 " + (o.to[0] + 30) + " " + (o.to[1] - 30) + " " + o.to[0] + " " + o.to[1], "none", 0, ' class="pa-flow" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 8"') : "");
      if (o.clamp) s += X.r(bx - 7, 136, 14, 9, 2, o.clamp === "open" ? "#22c55e" : "#f97316", 1.6);
    }
    return s;
  };
  X.monitor = function (x, y, v, o) {
    o = o || {}; v = v || {};
    var s = X.l(x + 40, y + 62, x + 40, y + 80, "#94a3b8", 3) + X.r(x, y, 82, 62, 8, "#0f172a", 2) + X.r(x + 5, y + 5, 72, 52, 4, "#0b1222", 0);
    s += '<path class="pa-ecg" d="M' + (x + 8) + " " + (y + 20) + "h10l3-3 3 3h4l2 4 3-14 3 16 2-6h8l3-3 3 3h4l2 4 3-14 3 16 2-6h6" + '" fill="none" stroke="#4ade80" stroke-width="1.4" stroke-linejoin="round"/>';
    s += X.t(x + 10, y + 42, v.hf || "88", { s: 13, w: 800, c: "#4ade80", a: "start" }) + X.t(x + 44, y + 42, v.spo2 || "95", { s: 13, w: 800, c: "#38bdf8", a: "start" }) + X.t(x + 10, y + 53, v.rr || "128/76", { s: 8.5, w: 700, c: "#fca5a5", a: "start" }) + X.t(x + 66, y + 42, "%", { s: 7, c: "#38bdf8", a: "start" });
    if (o.alarm) s += '<circle class="pa-alarm" cx="' + (x + 74) + '" cy="' + (y + 9) + '" r="4" fill="#ef4444"/>';
    return s;
  };
  X.chair = function (x, y, col) { return X.sh(x + 24, 246, 30, 5) + X.r(x, y, 10, 70, 4, col || "#94a3b8", 2) + X.r(x, y + 44, 50, 12, 4, col || "#94a3b8", 2) + X.l(x + 6, y + 56, x + 4, 244, K, 3) + X.l(x + 44, y + 56, x + 46, 244, K, 3); };
  X.walker = function (x, y) { return X.p("M" + x + " " + (y + 70) + "l8-64h40l8 64M" + (x + 8) + " " + (y + 6) + "h40M" + (x + 4) + " " + (y + 40) + "h48", "none", 0, ' stroke="#64748b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"') + X.c(x, y + 72, 4, "#334155", 0) + X.c(x + 56, y + 72, 4, "#334155", 0); };
  X.trash = function (x, y) { return X.r(x - 14, y - 34, 28, 34, 4, "#cbd5e1", 2) + X.r(x - 16, y - 38, 32, 6, 2, "#94a3b8", 1.8); };
  X.sign = function (x, y, txt, col) { var w = txt.length * 6.2 + 16; return X.r(x - w / 2, y - 12, w, 20, 6, col || "#ffffff", 1.6) + X.t(x, y + 2, txt, { s: 9.5, w: 750, c: col && col !== "#ffffff" ? "#ffffff" : K }); };
  X.cable = function (x1, y1, x2, y2, col) { return X.p("M" + x1 + " " + y1 + "C" + x1 + " " + (y1 + 40) + " " + x2 + " " + (y2 - 40) + " " + x2 + " " + y2, "none", 0, ' stroke="' + (col || "#64748b") + '" stroke-width="2"'); };
  X.puddle = function (x, y, w) { return '<ellipse class="pa-shine" cx="' + x + '" cy="' + y + '" rx="' + (w || 30) + '" ry="6" fill="#bae6fd" stroke="#7dd3fc" stroke-width="1.4" opacity=".9"/>'; };
  X.shoes = function (x, y, col) { return X.p("M" + x + " " + y + "q0-10 10-10h4q6 0 6 8v2z", col || "#7c3aed", 1.8) + X.p("M" + (x + 22) + " " + y + "q0-10 10-10h4q6 0 6 8v2z", col || "#7c3aed", 1.8); };
  X.urineBag = function (x, y, col, lvl) { lvl = lvl == null ? 0.5 : lvl; return X.p("M" + (x - 16) + " " + (y - 30) + "h32v32q0 6-6 6h-20q-6 0-6-6z", "#f8fafc", 1.8) + X.p("M" + (x - 14) + " " + (y + 2 - 32 * lvl) + "h28v" + (32 * lvl - 2) + "q0 4-4 4h-20q-4 0-4-4z", col || "#fde68a", 0) + X.l(x - 10, y - 20, x + 10, y - 20, "#94a3b8", 1) + X.l(x - 10, y - 10, x + 10, y - 10, "#94a3b8", 1); };
  X.drainBag = function (x, y, col, lvl) { return X.urineBag(x, y, col || "#fca5a5", lvl); };

  /* ---------- Hände und Material (Nahaufnahmen) ---------- */
  X.glove = function (x, y, rot, col, sc) {
    col = col || "#bfdbfe";
    return X.g(X.p("M-10 30v-26l-6-14q-2-6 3-7q4-1 6 4l3 8v-22q0-5 4-5t4 5v18v-24q0-5 4-5t4 5v24v-20q0-5 4-5t4 5v22v-14q0-5 4-5t4 5v26q0 18-14 22h-12q-12-4-12-22z", col, 2) + X.r(-12, 30, 30, 10, 3, AV.mix(col, "#1d1d1f", 0.08), 2), "translate(" + x + "," + y + ") rotate(" + (rot || 0) + ") scale(" + (sc || 1) + ")");
  };
  X.hand = function (x, y, rot, skin, sc) { return X.glove(x, y, rot, skin || "#f6d2b3", sc); };
  X.tray = function (x, y, w, h, col) { return X.sh(x + w / 2, y + h + 4, w / 2, 5) + X.r(x, y, w, h, 8, col || "#e2e8f0", 2) + X.r(x + 5, y + 5, w - 10, h - 10, 5, "#f1f5f9", 0); };
  X.drape = function (x, y, w, h, hole) { return X.r(x, y, w, h, 4, "#7dd3c0", 2) + X.p("M" + x + " " + (y + 10) + "h" + w + "M" + x + " " + (y + h - 10) + "h" + w, "none", 0, ' stroke="#5fbfa8" stroke-width="1.4"') + (hole ? X.e(x + w / 2, y + h / 2, hole[0], hole[1], "#f6d2b3", 2) : ""); };
  X.gauze = function (x, y, w, h) { return X.r(x, y, w || 24, h || 18, 2, "#ffffff", 1.6) + X.p("M" + (x + 4) + " " + (y + 4) + "l" + ((w || 24) - 8) + " " + ((h || 18) - 8) + "M" + (x + (w || 24) - 4) + " " + (y + 4) + "l-" + ((w || 24) - 8) + " " + ((h || 18) - 8), "none", 0, ' stroke="#e2e8f0" stroke-width="1.2"'); };
  X.swab = function (x, y, col) { return X.c(x, y, 6, col || "#ffffff", 1.6) + X.p("M" + (x - 3) + " " + (y - 1) + "q3-3 6 0", "none", 0, ' stroke="#cbd5e1" stroke-width="1"'); };
  X.syringe = function (x, y, len, rot, fill, label) {
    len = len || 70; var f = fill == null ? 0.6 : fill;
    var s = X.r(0, -7, len, 14, 3, "#f8fafc", 1.8) + X.r(2, -5, (len - 6) * f, 10, 2, label === "nacl" ? "#e0f2fe" : "#dbeafe", 0) + X.r(len, -3, 10, 6, 1, "#e2e8f0", 1.4) + X.l(len + 10, 0, len + 26, 0, "#94a3b8", 1.4);
    s += X.r(-16, -4, 16, 8, 1, "#cbd5e1", 1.4) + X.r(-22, -9, 6, 18, 2, "#e2e8f0", 1.6);
    for (var i = 1; i < 6; i++) s += X.l(i * len / 6, -7, i * len / 6, -3, "#94a3b8", 1);
    if (label) s += X.r(len * 0.3, -6, len * 0.4, 12, 2, label === "nacl" ? "#ffffff" : "#fef3c7", 1) + X.t(len * 0.5, 3, label === "nacl" ? "NaCl" : label, { s: 6.5, w: 800 });
    return X.g(s, "translate(" + x + "," + y + ") rotate(" + (rot || 0) + ")");
  };
  X.tube = function (d, col, w) { return X.p(d, "none", 0, ' stroke="' + K + '" stroke-width="' + ((w || 4) + 3) + '" stroke-linecap="round" stroke-linejoin="round"') + X.p(d, "none", 0, ' stroke="' + (col || "#f8fafc") + '" stroke-width="' + (w || 4) + '" stroke-linecap="round" stroke-linejoin="round"'); };
  X.tag = function (x, y, txt, kind) {
    var w = Math.max(40, txt.length * 5.9 + 20), c = kind === "ok" ? ["#dcfce7", "#15803d"] : kind === "bad" ? ["#fee2e2", "#b91c1c"] : kind === "warn" ? ["#fef3c7", "#a16207"] : ["#ffffff", "#334155"];
    return '<g class="pa-in">' + X.r(x - w / 2, y - 12, w, 22, 11, c[0], 1.6) + X.t(x, y + 3, txt, { s: 9.5, w: 750, c: c[1] }) + "</g>";
  };
  X.check = function (x, y) { return '<g class="pa-pop">' + X.c(x, y, 14, "#22c55e", 2) + X.p("M" + (x - 6) + " " + y + "l4 4 8-9", "none", 0, ' stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"') + "</g>"; };
  X.cross = function (x, y) { return '<g class="pa-pop">' + X.c(x, y, 14, "#ef4444", 2) + X.p("M" + (x - 5) + " " + (y - 5) + "l10 10M" + (x + 5) + " " + (y - 5) + "l-10 10", "none", 0, ' stroke="#ffffff" stroke-width="3" stroke-linecap="round"') + "</g>"; };
  X.arrow = function (d) { return X.p(d, "none", 0, ' class="pa-dash" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 5" marker-end="url(#' + X._id + 'ar)"'); };
  X.clipboard = function (x, y, w, h, title, lines, o) {
    o = o || {};
    var s = X.sh(x + w / 2, y + h + 4, w / 2, 5) + X.r(x, y, w, h, 8, "#c9a77c", 2) + X.r(x + 8, y + 12, w - 16, h - 20, 4, "#ffffff", 1.6) + X.r(x + w / 2 - 20, y - 6, 40, 14, 4, "#94a3b8", 1.8);
    s += X.t(x + 16, y + 30, title, { s: 10.5, w: 800, a: "start" });
    (lines || []).forEach(function (l, i) {
      var yy = y + 50 + i * 17;
      if (o.mark === i) s += X.r(x + 12, yy - 11, w - 24, 15, 3, "#fef08a", 0);
      s += X.t(x + 16, yy, l, { s: 9, w: 560, a: "start", c: "#334155" });
    });
    return s;
  };
  /* zwei Hände beim Einreiben, von vorn */
  X.handOpen = function (x, y, rot, skin, flip) {
    skin = skin || "#f6d2b3";
    var d = "M-20 40v-34q0-6 6-6v-26q0-6 6-6t6 6v20v-30q0-6 6-6t6 6v30v-26q0-6 6-6t6 6v28v-18q0-6 6-6t6 6v40q0 24-26 28h-8q-20-2-20-26z";
    return X.g(X.p(d, skin, 2.2) + X.p("M-14 8q4 6 0 14", "none", 0, ' stroke="' + AV.mix(skin, "#1d1d1f", 0.25) + '" stroke-width="1.4"'), "translate(" + x + "," + y + ") rotate(" + (rot || 0) + ")" + (flip ? " scale(-1,1)" : ""));
  };
  X.handsRub = function (drops) {
    var s = '<g class="pa-wiggle">' + X.handOpen(176, 150, -18, "#f6d2b3") + "</g>" + '<g class="pa-wiggle" style="animation-delay:.3s">' + X.handOpen(224, 150, 18, "#f1c9a7", true) + "</g>";
    s += X.r(150, 216, 100, 40, 14, "#9cc3e6", 2) + X.l(200, 220, 200, 256, "#7aa7d6", 1.4);
    if (drops) s += '<g class="pa-drip">' + X.c(200, 100, 4, "#bae6fd", 1.4) + "</g>" + [[170, 126], [236, 132], [204, 158], [184, 176], [222, 170]].map(function (q, i) { return '<circle class="pa-glow" style="animation-delay:' + i * 0.2 + 's" cx="' + q[0] + '" cy="' + q[1] + '" r="4" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="1.2"/>'; }).join("");
    s += '<g transform="translate(330,72)">' + X.c(0, 0, 26, "#ffffff", 2) + '<circle cx="0" cy="0" r="20" fill="none" stroke="#22c55e" stroke-width="5" stroke-dasharray="126" class="pa-timer" transform="rotate(-90)"/>' + X.t(0, 5, "30 s", { s: 12, w: 800 }) + "</g>";
    return s;
  };
  /* komplette Bettszene: Raum, Bett, Person, Nachttisch, optional Infusion, Monitor, Sichtschutz */
  X.bedScene = function (sp, o) {
    o = o || {};
    var s = X.defs() + X.room({ disp: o.disp == null ? 198 : o.disp, railX: 12, railW: 150, winX: o.winX || 262, win: o.win });
    if (o.monitor) s += X.monitor(o.monitor.x || 168, 30, o.monitor.v, o.monitor);
    if (o.pre) s += o.pre;
    s += X.bed({ pose: o.pose || "semi", x: o.x || 72, len: o.len || 270 });
    if (o.prePatient) s += typeof o.prePatient === "function" ? o.prePatient(X._bed) : o.prePatient;
    s += X.patient(sp, o);
    if (o.rails) s += X.rails();
    if (o.ns !== false) s += X.nightstand(6, { y: 176 }) + (o.ns || "");
    if (o.iv) s += X.ivpole(o.iv.x || 374, Object.assign({ to: X._hand }, o.iv));
    if (o.screen) s += '<g class="' + (o.screenNew ? "pa-slide" : "") + '">' + X.p("M346 40v204M346 40h40v204", "none", 0, ' stroke="#94a3b8" stroke-width="3"') + X.p("M350 44q18 10 34 0v196q-18 8-34 0z", "#cfe0f2", 1.8) + "</g>";
    if (o.post) s += typeof o.post === "function" ? o.post(X._pt) : o.post;
    if (o.tag) s += X.tag(o.tag[0], o.tag[1], o.tag[2], o.tag[3]);
    return s + X.vignette();
  };
  X.overbed = function (x, y, w, items) { return X.r(x, y, w, 8, 3, "#e9dcc7", 2) + X.l(x + w - 14, y + 8, x + w - 14, 244, "#94a3b8", 4) + X.l(x + w - 34, 244, x + w + 6, 244, "#64748b", 4) + (items || ""); };
  X.blank = function (col) { return X.defs() + '<rect width="400" height="280" fill="' + (col || "#eef3f8") + '"/>'; };
  X.svg = function (inner, vb) { return inner; };
  window.PXB = X;
})();
