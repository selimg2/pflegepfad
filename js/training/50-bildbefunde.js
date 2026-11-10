/* Fallpfad Training „Bildbefunde“: Befunde sehen, benennen und richtig handeln.
   Alle Bilder sind gezeichnete Schemata (SVG), keine Fotos echter Personen.
   Bereiche: EKG-Rhythmen, Wunden, Dekubitus, Haut, Pupillen, Urin, Stuhl, Drainagen, Atemmuster, Kurven.
   Modi: Lernen (alle Befunde durchblättern) und Quiz (zufällige Auswahl mit Punkten). Fortschritt nur auf dem Gerät. */
(function () {
  "use strict";
  var R = window.React;
  if (!R) return;
  var h = R.createElement, useState = R.useState, useMemo = R.useMemo;

  /* ================= Zeichen-Helfer (geben SVG-Strings zurück) ================= */
  var W = 600, H = 200;
  function frame(inner, bg) { return '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="14" fill="' + (bg || "#f8fafc") + '"/>' + inner; }
  function rnd(seed) { var s = seed || 7; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

  /* ---- EKG ---- */
  function grid() {
    var g = '<rect x="0" y="0" width="600" height="200" rx="14" fill="#fff5f5"/>';
    for (var x = 0; x <= 600; x += 20) g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="200" stroke="#fecaca" stroke-width="' + (x % 100 ? 0.6 : 1.4) + '"/>';
    for (var y = 0; y <= 200; y += 20) g += '<line x1="0" y1="' + y + '" x2="600" y2="' + y + '" stroke="#fecaca" stroke-width="' + (y % 100 ? 0.6 : 1.4) + '"/>';
    return g;
  }
  function beat(x, o) {
    o = o || {}; var b = 110, p = o.p === false ? "" : "l 6 -8 l 6 8 ", st = o.st || 0, w = o.wide ? 3 : 1;
    var q = "l 4 0 l " + 3 * w + " 6 l " + 4 * w + " -62 l " + 4 * w + " 76 l " + 3 * w + " -20 ";
    return "M " + x + " " + b + " " + (o.p === false ? "l 12 0 " : p) + "l 8 0 " + q + "l 6 " + (-st) + " l 10 0 l 8 -14 l 8 14 l " + 0 + " " + st + " ";
  }
  function line(d, col) { return '<path d="' + d + '" fill="none" stroke="' + (col || "#111827") + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'; }
  function ekgRegular(rr, o) {
    var d = "M 0 110 ", x = 10;
    while (x < 560) { d += "L " + x + " 110 " + beat(x, o).replace(/^M [\d.]+ [\d.]+ /, ""); x += rr; }
    d += "L 600 110";
    return grid() + line(d);
  }
  var EKG = {
    sinus: function () { return ekgRegular(110); },
    tachy: function () { return ekgRegular(64); },
    brady: function () { return ekgRegular(190); },
    vhf: function () {
      var r = rnd(3), d = "M 0 110 ", x = 0, next = 30;
      while (x < 600) {
        if (x >= next) { d += beat(x, { p: false }).replace(/^M [\d.]+ [\d.]+ /, "L " + x + " 110 "); x += 60; next = x + 20 + r() * 90; continue; }
        x += 6; d += "L " + x + " " + (110 + (r() - 0.5) * 7);
      }
      return grid() + line(d);
    },
    flattern: function () {
      var d = "M 0 110 ", x = 0, k = 0;
      while (x < 600) {
        if (k % 4 === 3) { d += "L " + x + " 110 l 4 6 l 4 -62 l 4 76 l 3 -20 "; x += 15; }
        else { d += "L " + (x + 14) + " 118 L " + (x + 20) + " 104 "; x += 20; }
        k++;
      }
      return grid() + line(d);
    },
    kf: function () {
      var r = rnd(11), d = "M 0 110 ";
      for (var x = 0; x <= 600; x += 7) d += "L " + x + " " + (110 + Math.sin(x / 9) * (14 + r() * 26) + (r() - 0.5) * 16);
      return grid() + line(d);
    },
    vt: function () {
      var d = "M 0 110 ";
      for (var x = 0; x < 600; x += 50) d += "L " + x + " 110 C " + (x + 10) + " 30, " + (x + 22) + " 30, " + (x + 28) + " 110 C " + (x + 34) + " 180, " + (x + 44) + " 170, " + (x + 50) + " 110 ";
      return grid() + line(d);
    },
    asystolie: function () { var r = rnd(5), d = "M 0 110 "; for (var x = 0; x <= 600; x += 12) d += "L " + x + " " + (110 + (r() - 0.5) * 3); return grid() + line(d); },
    avb3: function () {
      var g = grid(), d = "M 0 110 ", px = [20, 95, 170, 245, 320, 395, 470, 545], qx = [60, 270, 480];
      var ev = px.map(function (x) { return [x, "p"]; }).concat(qx.map(function (x) { return [x, "q"]; })).sort(function (a, b) { return a[0] - b[0]; });
      ev.forEach(function (e) { d += "L " + e[0] + " 110 "; d += e[1] === "p" ? "l 6 -8 l 6 8 " : "l 4 8 l 6 -58 l 8 82 l 6 -32 l 14 0 l 10 -16 l 10 16 "; });
      return g + line(d + "L 600 110");
    },
    stemi: function () { return ekgRegular(120, { st: 26 }); },
    ves: function () {
      var d = "M 0 110 ", xs = [10, 120, 230, 300, 450];
      xs.forEach(function (x, i) {
        d += "L " + x + " 110 ";
        if (i === 3) d += "C " + (x + 8) + " 20, " + (x + 22) + " 20, " + (x + 30) + " 110 C " + (x + 38) + " 190, " + (x + 50) + " 175, " + (x + 60) + " 110 ";
        else d += beat(x).replace(/^M [\d.]+ [\d.]+ /, "");
      });
      return grid() + line(d + "L 600 110");
    }
  };

  /* ---- Wunden ---- */
  function wunde(o) {
    var r = rnd(o.seed || 9), dots = "";
    for (var i = 0; i < (o.dots || 0); i++) { var a = r() * 6.28, rr = r() * 70; dots += '<circle cx="' + (300 + Math.cos(a) * rr * 1.5) + '" cy="' + (100 + Math.sin(a) * rr * 0.75) + '" r="' + (3 + r() * 4) + '" fill="' + o.dotCol + '" opacity=".85"/>'; }
    return frame(
      '<ellipse cx="300" cy="100" rx="200" ry="88" fill="#f1c6a8"/>' +
      (o.halo ? '<ellipse cx="300" cy="100" rx="175" ry="80" fill="' + o.halo + '" opacity=".75"/>' : "") +
      (o.rand ? '<ellipse cx="300" cy="100" rx="138" ry="64" fill="none" stroke="' + o.rand + '" stroke-width="' + (o.randW || 12) + '"/>' : "") +
      '<ellipse cx="300" cy="100" rx="125" ry="57" fill="' + o.bett + '"/>' + dots +
      (o.inner || "") +
      (o.pus ? '<path d="M 330 120 q 30 10 60 -6 q -18 26 -60 6 z" fill="#facc15" opacity=".95"/><ellipse cx="350" cy="118" rx="26" ry="9" fill="#fde68a"/>' : ""),
      "#fdf2e9");
  }
  var WUNDE = {
    granulation: function () { return wunde({ bett: "#dc2626", dots: 70, dotCol: "#991b1b", seed: 4, rand: "#f9a8b4", randW: 8 }); },
    fibrin: function () { return wunde({ bett: "#f5d76e", dots: 30, dotCol: "#dc2626", seed: 6 }); },
    nekrose: function () { return wunde({ bett: "#1f1f1f", dots: 14, dotCol: "#3f2a14", seed: 8, rand: "#7f1d1d", randW: 6 }); },
    epithel: function () { return wunde({ bett: "#ef4444", dots: 20, dotCol: "#b91c1c", rand: "#fbcfe8", randW: 22, seed: 3 }); },
    mazeration: function () { return wunde({ bett: "#dc2626", dots: 30, dotCol: "#991b1b", rand: "#f8fafc", randW: 26, seed: 5 }); },
    infekt: function () { return wunde({ bett: "#b91c1c", dots: 30, dotCol: "#7f1d1d", halo: "#f87171", pus: true, seed: 2 }); }
  };

  /* ---- Dekubitus (Querschnitt der Haut) ---- */
  function schichten(tiefe, extra) {
    var s = '<rect x="20" y="40" width="560" height="22" fill="#f6c9a8"/><rect x="20" y="62" width="560" height="38" fill="#eaa98a"/><rect x="20" y="100" width="560" height="44" fill="#fde68a"/><rect x="20" y="144" width="560" height="26" fill="#e07a6b"/><rect x="20" y="170" width="560" height="22" fill="#e5e7eb"/>';
    s += '<text x="586" y="56" font-size="11" fill="#475569" text-anchor="end">Oberhaut</text><text x="586" y="86" font-size="11" fill="#475569" text-anchor="end">Lederhaut</text><text x="586" y="126" font-size="11" fill="#475569" text-anchor="end">Unterhaut</text><text x="586" y="162" font-size="11" fill="#475569" text-anchor="end">Muskel</text><text x="586" y="186" font-size="11" fill="#475569" text-anchor="end">Knochen</text>';
    if (tiefe > 0) { var ys = [0, 62, 100, 144, 196][tiefe]; s += '<path d="M 230 40 L 250 ' + ys + ' L 350 ' + ys + ' L 370 40 Z" fill="' + (tiefe >= 3 ? "#991b1b" : "#dc2626") + '"/>'; }
    return frame(s + (extra || ""), "#fff");
  }
  var DEKU = {
    k1: function () { return schichten(0, '<ellipse cx="300" cy="44" rx="90" ry="8" fill="#dc2626" opacity=".55"/><text x="300" y="28" font-size="13" fill="#7f1d1d" text-anchor="middle">nicht wegdrückbare Rötung, Haut intakt</text>'); },
    k2: function () { return schichten(1, '<text x="300" y="28" font-size="13" fill="#7f1d1d" text-anchor="middle">flache, offene Wunde bis in die Lederhaut</text>'); },
    k3: function () { return schichten(3, '<text x="300" y="28" font-size="13" fill="#7f1d1d" text-anchor="middle">Verlust aller Hautschichten bis ins Fettgewebe</text>'); },
    k4: function () { return schichten(4, '<text x="300" y="28" font-size="13" fill="#7f1d1d" text-anchor="middle">bis auf Muskel oder Knochen</text>'); }
  };

  /* ---- Haut und Gesicht ---- */
  function gesicht(o) {
    return frame('<circle cx="300" cy="100" r="78" fill="' + (o.haut || "#f2c6a0") + '"/>' +
      '<ellipse cx="270" cy="88" rx="13" ry="9" fill="' + (o.sklera || "#fff") + '"/><ellipse cx="330" cy="88" rx="13" ry="9" fill="' + (o.sklera || "#fff") + '"/><circle cx="270" cy="88" r="5" fill="#3b2f2f"/><circle cx="330" cy="88" r="5" fill="#3b2f2f"/>' +
      '<path d="M 280 140 q 20 ' + (o.mund || 8) + ' 40 0" stroke="' + (o.lippe || "#c2410c") + '" stroke-width="7" fill="none" stroke-linecap="round"/>' + (o.extra || ""), "#f1f5f9");
  }
  var HAUT = {
    zyanose: function () { return gesicht({ haut: "#d9c3c8", lippe: "#4f46e5", extra: '<circle cx="250" cy="118" r="10" fill="#a5b4fc" opacity=".4"/><circle cx="350" cy="118" r="10" fill="#a5b4fc" opacity=".4"/>' }); },
    ikterus: function () { return gesicht({ haut: "#e9c46a", sklera: "#fde047" }); },
    blass: function () { return gesicht({ haut: "#f3e6dc", lippe: "#e7b4a8" }); },
    petechien: function () {
      var r = rnd(13), d = "";
      for (var i = 0; i < 90; i++) d += '<circle cx="' + (80 + r() * 440) + '" cy="' + (30 + r() * 140) + '" r="' + (1.5 + r() * 1.6) + '" fill="#b91c1c"/>';
      return frame('<rect x="60" y="20" width="480" height="160" rx="60" fill="#f2c6a0"/>' + d, "#f1f5f9");
    },
    oedem: function () { return frame('<path d="M 120 30 L 480 30 L 500 170 L 100 170 Z" fill="#f2c6a0"/><ellipse cx="300" cy="105" rx="28" ry="15" fill="#d9a77f"/><path d="M 272 105 q 28 18 56 0" stroke="#b07a52" stroke-width="2" fill="none"/><text x="300" y="196" font-size="12" text-anchor="middle" fill="#475569">Unterschenkel: Fingerdruck hinterlässt eine Delle</text>', "#f1f5f9"); },
    marmoriert: function () {
      var r = rnd(17), d = "";
      for (var i = 0; i < 26; i++) { var x = 90 + r() * 420, y = 40 + r() * 120; d += '<path d="M ' + x + " " + y + " q " + (20 + r() * 30) + " " + (-20 + r() * 40) + " " + (40 + r() * 40) + " " + (-10 + r() * 20) + '" stroke="#8b5cf6" stroke-width="3" fill="none" opacity=".6"/>'; }
      return frame('<rect x="60" y="20" width="480" height="160" rx="40" fill="#efd6d0"/>' + d, "#f1f5f9");
    }
  };

  /* ---- Pupillen ---- */
  function augen(l, r, licht) {
    function auge(cx, p) { return '<ellipse cx="' + cx + '" cy="100" rx="70" ry="42" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><circle cx="' + cx + '" cy="100" r="34" fill="#4b7a9b"/><circle cx="' + cx + '" cy="100" r="' + p + '" fill="#111"/><circle cx="' + (cx + 10) + '" cy="90" r="5" fill="#fff" opacity=".8"/>'; }
    return frame(auge(190, l) + auge(410, r) + (licht ? '<text x="300" y="185" font-size="12" text-anchor="middle" fill="#475569">' + licht + "</text>" : ""), "#f1f5f9");
  }
  var PUP = {
    normal: function () { return augen(12, 12, "Raumlicht"); },
    miosis: function () { return augen(4, 4, "Raumlicht"); },
    mydriasis: function () { return augen(28, 28, "Raumlicht"); },
    aniso: function () { return augen(12, 28, "Raumlicht, bewusstseinsgetrübte Person"); }
  };

  /* ---- Urin ---- */
  function becher(farbe, o) {
    o = o || {};
    var flocken = "";
    if (o.trueb) { var r = rnd(21); for (var i = 0; i < 40; i++) flocken += '<circle cx="' + (250 + r() * 100) + '" cy="' + (80 + r() * 90) + '" r="' + (1 + r() * 2) + '" fill="#fff" opacity=".7"/>'; }
    return frame('<path d="M 240 40 L 360 40 L 350 180 L 250 180 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><path d="M 244 70 L 356 70 L 350 178 L 250 178 Z" fill="' + farbe + '" opacity="' + (o.trueb ? 0.85 : 0.95) + '"/>' + flocken + (o.schaum ? '<ellipse cx="300" cy="70" rx="56" ry="7" fill="#fff" opacity=".9"/>' : ""), "#f8fafc");
  }
  var URIN = {
    normal: function () { return becher("#fde68a"); },
    konzentriert: function () { return becher("#d97706"); },
    haematurie: function () { return becher("#dc2626"); },
    bierbraun: function () { return becher("#7c2d12", { schaum: true }); },
    trueb: function () { return becher("#fcd34d", { trueb: true }); }
  };

  /* ---- Stuhl ---- */
  function stuhl(inner) { return frame('<ellipse cx="300" cy="110" rx="230" ry="70" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>' + inner, "#fff"); }
  var STUHL = {
    b1: function () { var s = ""; [[220, 100], [260, 120], [300, 96], [340, 118], [380, 102], [250, 140], [350, 140]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="#5b3a1e"/>'; }); return stuhl(s); },
    b4: function () { return stuhl('<path d="M 150 110 q 150 -50 300 0" stroke="#7a4a24" stroke-width="30" fill="none" stroke-linecap="round"/>'); },
    b7: function () { return stuhl('<ellipse cx="300" cy="112" rx="170" ry="46" fill="#a16207" opacity=".85"/>'); },
    teer: function () { return stuhl('<path d="M 170 112 q 130 -40 260 0 q -130 40 -260 0 z" fill="#111" /><ellipse cx="290" cy="104" rx="60" ry="8" fill="#555" opacity=".6"/>'); },
    blut: function () { return stuhl('<path d="M 150 110 q 150 -50 300 0" stroke="#7a4a24" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M 210 92 q 40 -14 90 -8" stroke="#dc2626" stroke-width="8" fill="none" stroke-linecap="round"/>'); },
    acholisch: function () { return stuhl('<path d="M 150 110 q 150 -50 300 0" stroke="#e7dcc4" stroke-width="30" fill="none" stroke-linecap="round"/>'); }
  };

  /* ---- Drainage ---- */
  function beutel(farbe, o) {
    o = o || {};
    return frame('<path d="M 300 10 L 300 40" stroke="#94a3b8" stroke-width="5"/><rect x="230" y="40" width="140" height="150" rx="18" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><rect x="236" y="' + (o.hoch ? 70 : 110) + '" width="128" height="' + (o.hoch ? 114 : 74) + '" rx="12" fill="' + farbe + '"/>' + (o.label ? '<text x="300" y="34" font-size="12" text-anchor="middle" fill="#475569">' + o.label + "</text>" : ""), "#f8fafc");
  }
  var DRAIN = {
    seroes: function () { return beutel("#fde68a", { label: "Redon, 2. Tag" }); },
    serosang: function () { return beutel("#f9a8a0", { label: "Redon, 1. Tag" }); },
    blutig: function () { return beutel("#991b1b", { hoch: true, label: "Redon, 1 Stunde nach OP: 400 ml" }); },
    eitrig: function () { return beutel("#d9c26a", { label: "Drainage, 5. Tag, trüb, riecht" }); },
    gallig: function () { return beutel("#4d7c0f", { label: "Drainage nach Gallen-OP" }); }
  };

  /* ---- Atemmuster ---- */
  function welle(fn, label) {
    var d = "M 20 100 ";
    for (var x = 20; x <= 580; x += 3) d += "L " + x + " " + (100 - fn(x));
    return frame('<line x1="20" y1="100" x2="580" y2="100" stroke="#e2e8f0"/>' + line(d, "#0ea5e9") + '<text x="20" y="190" font-size="12" fill="#475569">' + label + "</text>", "#f8fafc");
  }
  var ATEM = {
    normal: function () { return welle(function (x) { return Math.sin(x / 22) * 30; }, "Atemkurve über 30 Sekunden"); },
    kussmaul: function () { return welle(function (x) { return Math.sin(x / 26) * 75; }, "Atemkurve über 30 Sekunden"); },
    cheyne: function () { return welle(function (x) { var p = (x % 280) / 280; var a = p < 0.75 ? Math.sin(p / 0.75 * Math.PI) * 75 : 0; return Math.sin(x / 10) * a; }, "Atemkurve über 60 Sekunden"); },
    schnapp: function () { return welle(function (x) { var p = x % 160; return p < 18 ? Math.sin(p / 18 * Math.PI) * 60 : 0; }, "Atemkurve über 60 Sekunden"); },
    tachypnoe: function () { return welle(function (x) { return Math.sin(x / 7) * 18; }, "Atemkurve über 30 Sekunden"); }
  };

  /* ---- Kurven ---- */
  function kurve(werte, o) {
    var n = werte.length, sx = 520 / (n - 1), min = o.min, max = o.max, pts = werte.map(function (v, i) { return [40 + i * sx, 170 - (v - min) / (max - min) * 140]; });
    var g = ""; for (var y = 0; y <= 4; y++) g += '<line x1="40" y1="' + (30 + y * 35) + '" x2="560" y2="' + (30 + y * 35) + '" stroke="#e2e8f0"/><text x="34" y="' + (34 + y * 35) + '" font-size="10" text-anchor="end" fill="#64748b">' + Math.round(max - y * (max - min) / 4) + "</text>";
    var d = "M " + pts.map(function (p) { return p.join(" "); }).join(" L ");
    var z = ""; if (o.zweite) { var p2 = o.zweite.map(function (v, i) { return [40 + i * sx, 170 - (v - min) / (max - min) * 140]; }); z = line("M " + p2.map(function (p) { return p.join(" "); }).join(" L "), "#dc2626"); }
    return frame(g + line(d, o.col || "#2563eb") + z + pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + (o.col || "#2563eb") + '"/>'; }).join("") + '<text x="300" y="194" font-size="11" text-anchor="middle" fill="#475569">' + o.label + "</text>", "#fff");
  }
  var KURVE = {
    continua: function () { return kurve([39.4, 39.6, 39.3, 39.7, 39.5, 39.8, 39.4, 39.6], { min: 36, max: 40, label: "Temperatur in °C, alle 6 Stunden über 2 Tage" }); },
    intermittens: function () { return kurve([36.8, 40.1, 37.0, 39.8, 36.9, 40.2, 37.1, 39.9], { min: 36, max: 41, label: "Temperatur in °C, alle 6 Stunden über 2 Tage" }); },
    schock: function () { return kurve([82, 90, 98, 108, 118, 128], { min: 60, max: 140, label: "blau: Puls/min · rot: systolischer Blutdruck mmHg, stündlich", zweite: [128, 122, 114, 106, 96, 88] }); },
    hypo: function () { return kurve([142, 128, 110, 92, 70, 52], { min: 40, max: 160, col: "#7c3aed", label: "Blutzucker mg/dl nach Insulin und ausgelassenem Mittagessen, halbstündlich" }); }
  };

  /* ================= Befunde ================= */
  var KATS = [
    ["ekg", "EKG-Rhythmen", "#dc2626"], ["wunde", "Wunden", "#ea580c"], ["deku", "Dekubitus", "#a16207"], ["haut", "Haut & Gesicht", "#db2777"],
    ["pupille", "Pupillen", "#2563eb"], ["urin", "Urin", "#ca8a04"], ["stuhl", "Stuhl", "#78350f"], ["drain", "Drainagen", "#0d9488"],
    ["atem", "Atemmuster", "#0284c7"], ["kurve", "Verlaufskurven", "#7c3aed"]
  ];
  function B(kat, id, svg, titel, frage, opts, a, erkl, handeln) { return { kat: kat, id: kat + ":" + id, svg: svg, titel: titel, frage: frage, opts: opts, a: a, erkl: erkl, handeln: handeln }; }
  var RHY = ["Sinusrhythmus", "Vorhofflimmern", "Kammerflimmern", "Asystolie", "AV-Block III. Grades", "Vorhofflattern", "Ventrikuläre Tachykardie", "Sinustachykardie", "Sinusbradykardie", "ST-Hebung", "Ventrikuläre Extrasystole"];
  function rh(r) { var o = [r]; RHY.forEach(function (x) { if (o.length < 4 && x !== r) o.push(x); }); return o; }
  var BEF = [
    B("ekg", "sinus", EKG.sinus, "Sinusrhythmus", "Welcher Rhythmus liegt vor? (Papiervorschub 25 mm/s, ein großes Kästchen = 0,2 s)", rh("Sinusrhythmus"), 0, "Vor jedem schmalen QRS-Komplex steht eine P-Welle, die Abstände sind regelmäßig, die Frequenz liegt bei etwa 70/min.", "Normalbefund. Trotzdem immer die Person ansehen: Ein Monitor ersetzt nicht den Blick auf Atmung, Hautfarbe und Bewusstsein."),
    B("ekg", "vhf", EKG.vhf, "Vorhofflimmern", "Welcher Rhythmus liegt vor?", ["Sinusrhythmus", "Vorhofflimmern", "Asystolie", "Kammerflimmern"], 1, "Die Abstände zwischen den QRS-Komplexen sind völlig unregelmäßig, P-Wellen fehlen, die Grundlinie zittert leicht (Flimmerwellen).", "Puls eine volle Minute zählen (Pulsdefizit möglich), Kreislauf und Befinden einschätzen, neu aufgetretenes Vorhofflimmern ärztlich melden. Langfristig steht der Schlaganfallschutz durch Antikoagulation im Vordergrund."),
    B("ekg", "kf", EKG.kf, "Kammerflimmern", "Die Person ist plötzlich nicht mehr ansprechbar. Welcher Rhythmus liegt vor?", ["Kammerflimmern", "Vorhofflimmern", "Sinustachykardie", "Artefakt durch Zittern"], 0, "Chaotische, unregelmäßige Wellen ohne erkennbare QRS-Komplexe: Kammerflimmern. Das Herz pumpt nicht, es besteht ein Kreislaufstillstand.", "Ansprechen, Atmung prüfen, Notruf/Reanimationsteam, sofort Herzdruckmassage, Defibrillator holen lassen und schnellstmöglich defibrillieren."),
    B("ekg", "asys", EKG.asystolie, "Asystolie", "Was zeigt dieser Streifen bei einer bewusstlosen Person ohne Atmung?", ["Asystolie", "Sinusbradykardie", "Kammerflimmern", "Normalbefund im Schlaf"], 0, "Eine nahezu flache Linie ohne Aktivität. Vorher Elektroden und Ableitung prüfen, denn auch eine abgefallene Elektrode erzeugt eine Nulllinie.", "Reanimation mit Herzdruckmassage und Adrenalin nach Algorithmus. Asystolie wird nicht defibrilliert."),
    B("ekg", "avb3", EKG.avb3, "AV-Block III. Grades", "Die Person ist schwindelig, der Puls liegt bei 32/min. Welcher Rhythmus passt?", ["AV-Block III. Grades", "Sinusrhythmus", "Vorhofflattern", "Ventrikuläre Tachykardie"], 0, "P-Wellen kommen regelmäßig, die breiten QRS-Komplexe folgen in einem eigenen, sehr langsamen Takt ohne Bezug dazu: totaler AV-Block.", "Liegen lassen, Vitalzeichen engmaschig, sofort ärztlich melden, Notfallwagen bereitstellen. Oft ist ein (vorübergehender) Schrittmacher nötig."),
    B("ekg", "flattern", EKG.flattern, "Vorhofflattern", "Welcher Rhythmus liegt vor?", ["Vorhofflattern", "Vorhofflimmern", "Kammerflimmern", "Sinusrhythmus"], 0, "Typisch sind regelmäßige Sägezahnwellen zwischen den QRS-Komplexen; hier wird jede vierte Flatterwelle übergeleitet.", "Puls, Blutdruck und Befinden einschätzen und ärztlich melden. Behandlung ähnlich wie bei Vorhofflimmern."),
    B("ekg", "vt", EKG.vt, "Ventrikuläre Tachykardie", "Welcher Rhythmus liegt vor?", ["Ventrikuläre Tachykardie", "Sinustachykardie", "Vorhofflimmern", "Asystolie"], 0, "Schnelle, regelmäßige, breite und gleichförmige Kammerkomplexe ohne P-Wellen. Kann jederzeit in Kammerflimmern übergehen.", "Sofort prüfen, ob die Person ansprechbar ist und einen Puls hat. Ohne Puls: Reanimation und Defibrillation. Mit Puls: Notfallteam rufen, Monitor, Zugang, Defibrillator bereit."),
    B("ekg", "tachy", EKG.tachy, "Sinustachykardie", "Welcher Rhythmus liegt vor?", ["Sinustachykardie", "Ventrikuläre Tachykardie", "Vorhofflimmern", "Sinusbradykardie"], 0, "Regelmäßig, P-Wellen vor jedem schmalen QRS, Frequenz etwa 120/min. Die Ursache liegt meist außerhalb des Herzens.", "Nach der Ursache suchen: Schmerz, Fieber, Angst, Volumenmangel, Blutung, Sepsis, Hypoxie. Die Tachykardie ist ein Warnzeichen, keine Diagnose."),
    B("ekg", "brady", EKG.brady, "Sinusbradykardie", "Eine Person erhält seit gestern einen Betablocker. Was zeigt der Streifen?", ["Sinusbradykardie", "AV-Block III. Grades", "Asystolie", "Sinusrhythmus"], 0, "Regelmäßig, P vor jedem QRS, Frequenz etwa 45/min.", "Befinden, Blutdruck und Schwindel prüfen. Vor der nächsten Betablocker-Gabe ärztlich Rücksprache halten."),
    B("ekg", "stemi", EKG.stemi, "ST-Hebung", "Eine Person klagt seit 20 Minuten über Druck auf der Brust. Was fällt im EKG auf?", ["ST-Hebung", "Normaler Befund", "Vorhofflimmern", "Asystolie"], 0, "Die Strecke nach dem QRS-Komplex verläuft deutlich erhöht: Hinweis auf einen akuten Herzinfarkt mit ST-Hebung (STEMI).", "Notfall: ärztlich sofort informieren, 12-Kanal-EKG, Oberkörper hoch, nicht aufstehen lassen, Vitalzeichen, Zugang. Zeit ist Herzmuskel."),
    B("ekg", "ves", EKG.ves, "Ventrikuläre Extrasystole", "Was ist das breite, vorzeitige Ereignis im Streifen?", ["Ventrikuläre Extrasystole", "Kammerflimmern", "Artefakt", "P-Welle"], 0, "Ein vorzeitiger, breiter, deformierter Komplex ohne P-Welle mit anschließender Pause. Einzelne Extrasystolen sind häufig und oft harmlos.", "Häufung, Paare oder Salven melden. Kalium und Magnesium werden oft kontrolliert."),

    B("wunde", "gran", WUNDE.granulation, "Granulationsgewebe", "Wie beschreibst du den Wundgrund?", ["Granulationsgewebe", "Nekrose", "Fibrinbelag", "Mazeration"], 0, "Feuchtes, hellrotes, körniges Gewebe: gut durchblutetes Granulationsgewebe, die Wunde heilt.", "Schützen statt reinigen: feuchtes Wundmilieu erhalten, nicht austrocknen lassen, beim Verbandwechsel nicht verletzen."),
    B("wunde", "fib", WUNDE.fibrin, "Fibrinbelag", "Welcher Belag liegt auf dem Wundgrund?", ["Fibrinbelag", "Granulationsgewebe", "Epithelgewebe", "Eiter"], 0, "Gelblicher, fest haftender Belag. Fibrin behindert die Heilung und muss nach Anordnung gelöst werden.", "Wundreinigung (Debridement) nach Wundkonzept, etwa durch Spülung oder Auflagen; Belag nicht mit Eiter verwechseln: Eiter ist trüb, flüssig, riecht."),
    B("wunde", "nek", WUNDE.nekrose, "Nekrose", "Was ist das schwarze Gewebe?", ["Nekrose", "Schorf einer heilenden Wunde", "Blutkruste ohne Bedeutung", "Granulation"], 0, "Schwarzes, trockenes abgestorbenes Gewebe. Es muss in der Regel entfernt werden, beim pAVK-Fuß jedoch erst nach Gefäßabklärung.", "Ärztlich bzw. vom Wundexperten beurteilen lassen. Trockene Nekrosen bei Durchblutungsstörung nicht eigenmächtig aufweichen."),
    B("wunde", "epi", WUNDE.epithel, "Epithelisierung", "Was zeigt der rosige Saum am Wundrand?", ["Epithelisierung", "Mazeration", "Infektion", "Nekrose"], 0, "Vom Rand wächst zartes, rosa Epithel ein: letzte Phase der Wundheilung.", "Den Saum schonen: nicht kleben, nicht reiben, Feuchtigkeit ausgewogen halten."),
    B("wunde", "maz", WUNDE.mazeration, "Mazeration des Wundrands", "Was fällt am Wundrand auf?", ["Mazeration", "Epithelisierung", "Fibrin", "Nekrose"], 0, "Weißlich aufgequollene Haut durch zu viel Feuchtigkeit. Sie reißt leicht ein und vergrößert die Wunde.", "Wundrand mit Hautschutz versorgen, saugfähigere Auflage wählen, Verbandwechselintervall anpassen."),
    B("wunde", "inf", WUNDE.infekt, "Wundinfektion", "Welche Beurteilung passt?", ["Zeichen einer Wundinfektion", "normale Entzündungsphase am 1. Tag", "Mazeration", "Epithelisierung"], 0, "Ausgedehnte Rötung über den Wundrand hinaus, gelbliches Sekret: Zeichen einer Infektion (Rötung, Schwellung, Wärme, Schmerz, Funktionseinschränkung, Eiter).", "Ausdehnung markieren und dokumentieren, Temperatur messen, ärztlich melden, Abstrich nur nach Anordnung."),

    B("deku", "k1", DEKU.k1, "Dekubitus Kategorie 1", "Die Rötung über dem Kreuzbein bleibt beim Fingertest rot. Welche Kategorie?", ["Kategorie 1", "Kategorie 2", "Kategorie 3", "kein Dekubitus"], 0, "Nicht wegdrückbare Rötung bei intakter Haut über einem Knochenvorsprung: Dekubitus Kategorie 1.", "Sofort vollständig druckentlasten, Bewegungsplan anpassen, Haut täglich beurteilen und dokumentieren."),
    B("deku", "k2", DEKU.k2, "Dekubitus Kategorie 2", "Welche Kategorie zeigt der Querschnitt?", ["Kategorie 2", "Kategorie 1", "Kategorie 3", "Kategorie 4"], 0, "Teilverlust der Haut bis in die Lederhaut, flache offene Wunde oder Blase.", "Druckentlastung, Wundversorgung nach Wundkonzept, Ursachen (Feuchtigkeit, Scherkräfte) mitbehandeln."),
    B("deku", "k3", DEKU.k3, "Dekubitus Kategorie 3", "Welche Kategorie zeigt der Querschnitt?", ["Kategorie 3", "Kategorie 2", "Kategorie 4", "Kategorie 1"], 0, "Vollständiger Hautverlust bis ins Unterhautfettgewebe, Muskel und Knochen liegen nicht frei.", "Ärztliche und wundexpertliche Versorgung, Ernährung prüfen, konsequente Entlastung."),
    B("deku", "k4", DEKU.k4, "Dekubitus Kategorie 4", "Welche Kategorie zeigt der Querschnitt?", ["Kategorie 4", "Kategorie 3", "Kategorie 2", "Kategorie 1"], 0, "Gewebeverlust bis auf Muskel, Sehne oder Knochen. Hohes Infektionsrisiko bis zur Knochenentzündung.", "Interprofessionelle Behandlung, häufig chirurgisch; Schmerz und Ernährung besonders beachten."),

    B("haut", "zya", HAUT.zyanose, "Zentrale Zyanose", "Was fällt an Lippen und Gesicht auf?", ["Zyanose", "Ikterus", "Normalbefund", "Anämie"], 0, "Bläuliche Verfärbung von Lippen und Schleimhäuten: Hinweis auf Sauerstoffmangel im Blut.", "Atmung, Sättigung und Bewusstsein prüfen, Oberkörper hoch, Sauerstoff nach Anordnung, ärztlich melden."),
    B("haut", "ikt", HAUT.ikterus, "Ikterus", "Welche Veränderung siehst du?", ["Ikterus", "Zyanose", "Sonnenbräune", "Exanthem"], 0, "Gelbe Haut und vor allem gelbe Skleren: Bilirubinerhöhung, etwa bei Leber- oder Gallenwegserkrankung.", "Neu aufgetretenen Ikterus melden, auf dunklen Urin, hellen Stuhl und Juckreiz achten."),
    B("haut", "bla", HAUT.blass, "Blässe", "Welche Ursache kommt bei dieser Blässe vor allem in Frage, wenn Puls 118/min und RR 92/55 mmHg sind?", ["Blutung oder Volumenmangel", "Sonnenmangel", "Gelbsucht", "Allergie"], 0, "Blasse Haut mit schnellem Puls und niedrigem Blutdruck: Schockzeichen, etwa durch Blutung.", "Flach lagern, Beine hoch, Vitalzeichen engmaschig, nach Blutungsquelle suchen, sofort ärztlich melden."),
    B("haut", "pet", HAUT.petechien, "Petechien", "Was sind die stecknadelkopfgroßen roten Punkte, die sich nicht wegdrücken lassen?", ["Petechien", "Mückenstiche", "Akne", "Sommersprossen"], 0, "Punktförmige Einblutungen in die Haut, etwa bei Thrombozytenmangel. Mit Fieber und schlechtem Allgemeinzustand Verdacht auf Meningokokkensepsis.", "Glasprobe: Punkte verschwinden nicht. Ärztlich melden, bei Fieber sofort. Blutungszeichen beobachten."),
    B("haut", "oed", HAUT.oedem, "Eindrückbares Ödem", "Was zeigt der Befund am Unterschenkel?", ["Eindrückbares Ödem", "Thrombose sicher", "Dekubitus", "Normalbefund"], 0, "Nach Fingerdruck bleibt eine Delle: Wassereinlagerung im Gewebe, etwa bei Herzinsuffizienz.", "Beidseitig oder einseitig? Einseitiges, warmes, schmerzhaftes Ödem kann eine Thrombose sein. Gewicht und Bilanz kontrollieren."),
    B("haut", "mar", HAUT.marmoriert, "Marmorierte Haut", "Ein septischer Patient hat diese Hautzeichnung an den Knien. Was bedeutet sie?", ["Mikrozirkulationsstörung", "harmlose Kältereaktion", "Allergie", "Venenentzündung"], 0, "Netzartige bläulich-violette Zeichnung: Zeichen schlechter Durchblutung der kleinen Gefäße, bei Sepsis ein Alarmzeichen.", "Vitalzeichen, Bewusstsein, Urinmenge, Rekapillarisierung prüfen, sofort ärztlich melden."),

    B("pupille", "norm", PUP.normal, "Normale Pupillen", "Wie beschreibst du die Pupillen?", ["mittelweit, seitengleich", "eng", "weit", "seitenungleich"], 0, "Mittelweite, runde, seitengleiche Pupillen.", "Lichtreaktion prüfen: Beide Pupillen sollten sich bei Licht verengen (direkt und indirekt)."),
    B("pupille", "mio", PUP.miosis, "Miosis", "Eine schläfrige Person erhielt Morphin. Welcher Pupillenbefund passt?", ["Miosis (stecknadelkopfeng)", "Mydriasis", "Anisokorie", "Normalbefund"], 0, "Sehr enge Pupillen: typisch für Opioide. Zusammen mit flacher, langsamer Atmung ein Alarmzeichen.", "Atemfrequenz und Sättigung messen, wecken, ansprechen. Bei Atemdepression Notfall: Naloxon nach Anordnung, beatmen."),
    B("pupille", "myd", PUP.mydriasis, "Mydriasis", "Welche Ursache passt zu weiten Pupillen?", ["Angst, Sympathikusaktivierung oder bestimmte Medikamente", "Opioide", "tiefer Schlaf", "Ikterus"], 0, "Weite Pupillen, etwa durch Angst, Schmerz, Atropin, Drogen oder schwere Hirnschädigung (dann meist lichtstarr).", "Immer im Zusammenhang beurteilen: Bewusstsein, Lichtreaktion, Medikamente."),
    B("pupille", "aniso", PUP.aniso, "Anisokorie", "Eine Person nach Sturz unter Antikoagulation wird zunehmend schläfrig. Die rechte Pupille ist weit. Was bedeutet das?", ["Notfall: Hinweis auf steigenden Hirndruck", "harmlos, kommt oft vor", "Opioidwirkung", "Augentropfen"], 0, "Neu aufgetretene einseitig weite Pupille bei Bewusstseinsstörung: Verdacht auf Hirnblutung mit Einklemmung.", "Sofort ärztlich alarmieren, GCS und Vitalzeichen, Oberkörper 30 Grad, CT wird meist sofort veranlasst."),

    B("urin", "norm", URIN.normal, "Normaler Urin", "Wie beurteilst du diesen Urin?", ["hellgelb und klar, unauffällig", "konzentriert", "Hämaturie", "trüb"], 0, "Hellgelb und klar: ausreichende Trinkmenge.", "Menge und Häufigkeit gehören ebenfalls zur Beobachtung."),
    B("urin", "konz", URIN.konzentriert, "Konzentrierter Urin", "Ein 86-jähriger Bewohner trinkt kaum. Was zeigt der Urin?", ["Konzentrierter Urin bei zu wenig Flüssigkeit", "Blut im Urin", "Bilirubin", "Normalbefund"], 0, "Dunkelgelb bis bernsteinfarben: konzentrierter Urin, Hinweis auf Flüssigkeitsmangel.", "Trinkmenge erfassen und aktiv anbieten, auf Verwirrtheit und Kreislauf achten, Ein- und Ausfuhr dokumentieren."),
    B("urin", "haem", URIN.haematurie, "Hämaturie", "Was zeigt der Urin nach Blasenkatheter-Wechsel bei einer Person unter Antikoagulation?", ["Hämaturie", "Rote-Bete-Verfärbung sicher", "Bilirubinurie", "Normalbefund"], 0, "Rote Verfärbung durch Blut. Ursachen: Verletzung, Infektion, Steine, Tumor, Antikoagulation.", "Menge, Gerinnsel und Kreislauf beobachten, ärztlich melden. Nahrungsmittel wie Rote Bete können ähnlich färben, darum nachfragen."),
    B("urin", "braun", URIN.bierbraun, "Bierbrauner Urin", "Welche Ursache passt zu bierbraunem, schäumendem Urin mit gelben Skleren?", ["Bilirubin im Urin bei Gallestau oder Leberschaden", "zu viel getrunken", "Blasenentzündung", "Vitamin C"], 0, "Bierbraun mit gelbem Schaum: Bilirubin wird über die Niere ausgeschieden.", "Mit Stuhlfarbe (hell?) und Hautfarbe gemeinsam beobachten und melden."),
    B("urin", "trueb", URIN.trueb, "Trüber Urin", "Eine Person mit Dauerkatheter hat trüben, flockigen Urin und Fieber. Woran denkst du?", ["Harnwegsinfektion", "normale Ernährung", "Hämaturie", "Bilirubinurie"], 0, "Trüb und flockig, oft übelriechend: Hinweis auf Harnwegsinfektion; mit Fieber Gefahr einer Urosepsis.", "Vitalzeichen, Sepsis-Zeichen prüfen, ärztlich melden, Urinprobe nur aus der Entnahmestelle des Systems nach Anordnung."),

    B("stuhl", "b1", STUHL.b1, "Bristol Typ 1", "Welcher Bristol-Typ liegt vor?", ["Typ 1: harte Kügelchen", "Typ 4: weich, wurstförmig", "Typ 7: flüssig", "Teerstuhl"], 0, "Einzelne harte Klumpen, schwer auszuscheiden: Obstipation.", "Trinkmenge, Bewegung, Ballaststoffe, Medikamente (Opioide) prüfen, Laxans nach Anordnung."),
    B("stuhl", "b4", STUHL.b4, "Bristol Typ 4", "Welcher Bristol-Typ liegt vor?", ["Typ 4: glatt, weich, wurstförmig", "Typ 1", "Typ 7", "acholischer Stuhl"], 0, "Ideale Konsistenz.", "Normalbefund."),
    B("stuhl", "b7", STUHL.b7, "Bristol Typ 7", "Was liegt vor?", ["Typ 7: wässriger Durchfall", "Typ 4", "Teerstuhl", "Typ 1"], 0, "Flüssiger Stuhl ohne feste Bestandteile: Durchfall.", "Häufigkeit dokumentieren, Flüssigkeitsverlust ausgleichen, Haut schützen, bei Verdacht auf Noro- oder Clostridioides-Infektion Kontaktisolierung und Händewaschen."),
    B("stuhl", "teer", STUHL.teer, "Teerstuhl", "Schwarzer, glänzender, klebriger Stuhl bei einer Person, die Ibuprofen und ASS einnimmt. Was bedeutet das?", ["Hinweis auf obere Magen-Darm-Blutung", "Eisentabletten, immer harmlos", "Verstopfung", "normale Farbe"], 0, "Teerstuhl entsteht, wenn Blut aus Magen oder Zwölffingerdarm verdaut wird. Eisen färbt Stuhl auch schwarz, aber nicht klebrig glänzend.", "Kreislauf prüfen (Puls, RR, Blässe), ärztlich sofort melden, Probe aufheben, nüchtern lassen bis zur Klärung."),
    B("stuhl", "blut", STUHL.blut, "Frisches Blut am Stuhl", "Was zeigt der Befund?", ["Frische Blutauflagerung, Blutung aus dem unteren Darmabschnitt", "Teerstuhl", "acholischer Stuhl", "Normalbefund"], 0, "Hellrotes Blut, etwa bei Hämorrhoiden, Fissuren, Divertikeln oder Tumoren.", "Menge und Häufigkeit dokumentieren, Kreislauf prüfen, ärztlich abklären lassen."),
    B("stuhl", "ach", STUHL.acholisch, "Acholischer Stuhl", "Ein lehmfarbener Stuhl fällt auf. Woran denkst du?", ["Gallestau: keine Galle im Darm", "zu viel Milch", "Darmblutung", "Durchfall"], 0, "Fehlt Gallenfarbstoff im Darm, wird der Stuhl hell bis lehmfarben, oft zusammen mit dunklem Urin und Ikterus.", "Mit Urinfarbe und Haut beobachten und melden."),

    B("drain", "seroes", DRAIN.seroes, "Seröses Sekret", "Wie beurteilst du das Sekret am 2. Tag nach OP?", ["serös, unauffällig", "frische Blutung", "eitrig", "gallig"], 0, "Klare, hellgelbe Flüssigkeit: normale Wundsekretion.", "Menge dokumentieren; wenn sie stark abnimmt, wird die Drainage oft entfernt."),
    B("drain", "serosang", DRAIN.serosang, "Serös-sanguinöses Sekret", "Wie beurteilst du das Sekret am 1. Tag nach OP?", ["serös-sanguinös, erwartbar", "eitrig", "gallig", "Notfall"], 0, "Rötlich-wässrig: Mischung aus Wundsekret und wenig Blut, am ersten Tag normal.", "Menge und Farbverlauf dokumentieren."),
    B("drain", "blutig", DRAIN.blutig, "Nachblutung", "Eine Stunde nach OP sind 400 ml dunkelrotes Blut in der Drainage, der Puls steigt. Was tust du?", ["Nachblutung: sofort ärztlich melden, Vitalzeichen engmaschig", "abwarten bis zur nächsten Runde", "Drainage abklemmen und gehen", "Beutel leeren und nicht dokumentieren"], 0, "Große Mengen rein blutigen Sekrets in kurzer Zeit sprechen für eine Nachblutung.", "Sofort melden, Puls, RR, Bewusstsein, Verband prüfen, Zugang, Kreuzblut nach Anordnung, nüchtern lassen."),
    B("drain", "eitrig", DRAIN.eitrig, "Eitriges Sekret", "Am 5. Tag ist das Sekret trüb und riecht. Was bedeutet das?", ["Hinweis auf Infektion", "normale Wundheilung", "Galle", "frische Blutung"], 0, "Trübes, gelblich-grünliches, übelriechendes Sekret spricht für eine Infektion oder einen Abszess.", "Temperatur, Entzündungszeichen, Schmerzen erfassen und melden."),
    B("drain", "gallig", DRAIN.gallig, "Galliges Sekret", "Grünliches Sekret aus einer Drainage im Oberbauch. Woran denkst du?", ["Gallenleck", "normale Wundsekretion", "Blutung", "Urin"], 0, "Grün-braunes Sekret deutet auf Galle hin, etwa durch ein Leck nach Gallen- oder Leberoperation.", "Menge und Farbe dokumentieren und ärztlich melden."),

    B("atem", "normal", ATEM.normal, "Normale Atmung", "Wie beschreibst du das Atemmuster?", ["regelmäßig, normale Tiefe (Eupnoe)", "Kußmaul-Atmung", "Cheyne-Stokes-Atmung", "Schnappatmung"], 0, "Gleichmäßige, ruhige Atmung mit etwa 12 bis 18 Zügen pro Minute.", "Normalbefund."),
    B("atem", "kuss", ATEM.kussmaul, "Kußmaul-Atmung", "Ein Jugendlicher mit Typ-1-Diabetes atmet so, der Atem riecht obstartig. Was liegt vor?", ["Kußmaul-Atmung bei Ketoazidose", "Cheyne-Stokes-Atmung", "Hyperventilation bei Angst sicher", "Schnappatmung"], 0, "Sehr tiefe, regelmäßige Atemzüge: Der Körper atmet Säure als CO₂ ab, typisch bei diabetischer Ketoazidose.", "Blutzucker und Ketone messen, Bewusstsein prüfen, sofort ärztlich melden."),
    B("atem", "cheyne", ATEM.cheyne, "Cheyne-Stokes-Atmung", "Welches Atemmuster zeigt die Kurve?", ["Cheyne-Stokes-Atmung", "Kußmaul-Atmung", "Biot-Atmung", "Eupnoe"], 0, "Die Atemtiefe nimmt periodisch zu und ab, dazwischen Pausen. Vorkommen bei schwerer Herzinsuffizienz, Hirnschädigung und in der Sterbephase.", "Im Kontext beurteilen; am Lebensende Angehörige vorbereiten und erklären, dass dies zum Sterbeprozess gehören kann."),
    B("atem", "schnapp", ATEM.schnapp, "Schnappatmung", "Eine bewusstlose Person macht nur noch vereinzelte, schnappende Atemzüge. Was bedeutet das?", ["Kreislaufstillstand: keine normale Atmung, Reanimation beginnen", "Schlaf mit Atempausen", "Hyperventilation", "Normalbefund"], 0, "Schnappatmung ist keine normale Atmung und ein Zeichen des Kreislaufstillstands.", "Hilfe rufen, sofort Herzdruckmassage, AED holen lassen."),
    B("atem", "tachy", ATEM.tachypnoe, "Tachypnoe", "Die Atemfrequenz liegt bei 32/min, die Atmung ist flach. Was beschreibt der Befund?", ["Tachypnoe", "Bradypnoe", "Kußmaul-Atmung", "Eupnoe"], 0, "Beschleunigte Atmung über 20/min. Oft das früheste Zeichen einer Verschlechterung, etwa bei Pneumonie oder Sepsis.", "Sättigung, Puls, Blutdruck, Temperatur und Bewusstsein erfassen, Oberkörper hoch, ärztlich melden."),

    B("kurve", "cont", KURVE.continua, "Febris continua", "Welcher Fiebertyp liegt vor?", ["Kontinuierliches Fieber (Schwankung unter 1 °C)", "Intermittierendes Fieber", "Rekurrierendes Fieber", "Normaltemperatur"], 0, "Gleichbleibend hohes Fieber mit Tagesschwankungen unter 1 °C, etwa bei Pneumonie.", "Flüssigkeit, Wärmeregulation je nach Fieberphase, Ursache abklären lassen."),
    B("kurve", "inter", KURVE.intermittens, "Intermittierendes Fieber", "Welcher Fiebertyp liegt vor?", ["Intermittierendes (septisches) Fieber", "Kontinuierliches Fieber", "Untertemperatur", "Messfehler"], 0, "Hohe Fieberspitzen mit Abfall auf Normalwerte innerhalb eines Tages, oft mit Schüttelfrost, etwa bei Sepsis oder Abszess.", "Im Fieberanstieg Blutkulturen nach Anordnung, Sepsiszeichen beobachten."),
    B("kurve", "schock", KURVE.schock, "Kreuzende Kurven", "Puls steigt, Blutdruck fällt, die Kurven kreuzen sich. Was bedeutet das?", ["Schockindex über 1: drohender Schock", "normaler Tagesverlauf", "Messfehler", "Fieberabfall"], 0, "Wenn der Puls den systolischen Blutdruck übersteigt, liegt der Schockindex über 1.", "Sofort ärztlich melden, Ursache suchen (Blutung, Sepsis, Volumenmangel), Schocklage nach Anordnung, engmaschig messen."),
    B("kurve", "hypo", KURVE.hypo, "Fallender Blutzucker", "Was ist die richtige Einschätzung des letzten Werts?", ["Hypoglykämie: sofort handeln", "erwünscht, Ziel erreicht", "Messfehler, nichts tun", "Hyperglykämie"], 0, "Ein Wert von 52 mg/dl ist eine Unterzuckerung, auch wenn die Person noch keine Beschwerden hat.", "Bei wacher Person schnell wirksame Kohlenhydrate geben (z. B. Traubenzucker), nach 15 Minuten nachmessen, ärztlich informieren, Ursache (ausgelassene Mahlzeit) dokumentieren.")
  ];
  window.FP_BEFUNDE = BEF;

  /* ================= Oberfläche ================= */
  var LS = "fp-befunde";
  function ladeStand() { try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { return {}; } }
  function speichere(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} }
  function mische(a) { var b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function Bild(p) { return h("div", { className: "bf-img", role: "img", "aria-label": p.alt, dangerouslySetInnerHTML: { __html: '<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">' + p.b.svg() + "</svg>" } }); }

  var CSS = ".bf-kats{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin:12px 0}.bf-kat{all:unset;cursor:pointer;box-sizing:border-box;padding:14px;border-radius:16px;background:var(--surface,#fff);box-shadow:0 0 0 1px var(--line,#e5e7eb);border-left:5px solid var(--c)}.bf-kat b{display:block}.bf-kat small{color:var(--muted,#64748b)}" +
    ".bf-img{border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px var(--line,#e5e7eb)}.bf-img svg{display:block;width:100%;height:auto}" +
    ".bf-opts{display:grid;gap:8px;margin:14px 0}.bf-opt{all:unset;cursor:pointer;box-sizing:border-box;padding:12px 14px;border-radius:12px;background:var(--fill,#f1f5f9);font-weight:500}.bf-opt.ok{background:#dcfce7;color:#14532d}.bf-opt.no{background:#fee2e2;color:#7f1d1d}" +
    ".bf-erk{border-radius:14px;padding:14px;background:var(--surface,#fff);box-shadow:0 0 0 1px var(--line,#e5e7eb);line-height:1.55}.bf-erk h4{margin:0 0 6px}.bf-erk .hd{margin-top:10px;padding:10px 12px;border-radius:10px;background:rgba(0,98,255,.07)}" +
    ".bf-top{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px}.bf-prog{height:6px;border-radius:6px;background:var(--fill,#eef2f7);overflow:hidden;margin-bottom:12px}.bf-prog i{display:block;height:100%;background:var(--accent,#0062FF)}";
  function useCss() { R.useEffect(function () { if (document.getElementById("bf-css")) return; var s = document.createElement("style"); s.id = "bf-css"; s.textContent = CSS; document.head.appendChild(s); }, []); }

  function Frage(p) {
    var b = p.b, w = useState(null), wahl = w[0], setWahl = w[1];
    var ord = useMemo(function () { return mische(b.opts.map(function (t, i) { return { t: t, i: i }; })); }, [b.id]);
    var fertig = wahl !== null;
    return h("div", null,
      h(Bild, { b: b, alt: "Bildbefund" }),
      h("h3", { style: { margin: "14px 0 0" } }, b.frage),
      h("div", { className: "bf-opts" }, ord.map(function (o) {
        var cls = fertig ? (o.i === b.a ? "ok" : o.i === wahl ? "no" : "") : "";
        return h("button", { key: o.i, type: "button", className: "bf-opt " + cls, disabled: fertig, onClick: function () { setWahl(o.i); if (p.onAnswer) p.onAnswer(o.i === b.a); } }, o.t);
      })),
      fertig && h("div", { className: "bf-erk" }, h("h4", null, (wahl === b.a ? "Richtig: " : "Lösung: ") + b.titel), h("div", null, b.erkl), h("div", { className: "hd" }, h("b", null, "So handelst du: "), b.handeln)),
      fertig && p.weiter && h("div", { style: { marginTop: 12, display: "flex", justifyContent: "flex-end" } }, h("button", { type: "button", className: "btn", onClick: function () { setWahl(null); p.weiter(); } }, p.letzte ? "Auswertung" : "Weiter")));
  }

  function Befunde() {
    useCss();
    var m = useState(null), modus = m[0], setModus = m[1];
    var st = useState(ladeStand), stand = st[0], setStand = st[1];
    var q = useState(null), quiz = q[0], setQuiz = q[1];
    var antwort = function (b, ok) {
      var s = Object.assign({}, stand); s[b.id] = ok ? 1 : 0; speichere(s); setStand(s);
      try { if (window.FP_ZAEHLE) window.FP_ZAEHLE("bildbefund", b.kat); } catch (e) {}
    };
    var start = function (kat) {
      var pool = BEF.filter(function (b) { return !kat || b.kat === kat; });
      var falsch = pool.filter(function (b) { return stand[b.id] === 0; });
      var liste = mische(falsch).concat(mische(pool.filter(function (b) { return stand[b.id] !== 0; }))).slice(0, kat ? pool.length : 12);
      setQuiz({ kat: kat, liste: mische(liste), i: 0, ok: 0 });
      setModus("quiz");
    };
    if (modus === "quiz" && quiz) {
      var b = quiz.liste[quiz.i];
      if (!b) {
        var pct = Math.round(100 * quiz.ok / quiz.liste.length);
        return h("div", { className: "card" }, h("h2", null, "Auswertung"), h("p", null, quiz.ok + " von " + quiz.liste.length + " Befunden richtig (" + pct + " %)."),
          h("p", { className: "muted" }, pct >= 80 ? "Stark. Du erkennst die Befunde sicher und weißt, was zu tun ist." : "Schau dir die Erklärungen zu den falschen Befunden noch einmal an. Beim nächsten Quiz kommen sie zuerst."),
          h("div", { className: "row", style: { gap: 8 } }, h("button", { type: "button", className: "btn", onClick: function () { start(quiz.kat); } }, "Noch einmal"), h("button", { type: "button", className: "btn ghost", onClick: function () { setModus(null); } }, "Zur Übersicht")));
      }
      return h("div", null,
        h("div", { className: "bf-top" }, h("button", { type: "button", className: "skip", onClick: function () { setModus(null); } }, "← Übersicht"), h("span", { className: "muted" }, "Befund " + (quiz.i + 1) + " von " + quiz.liste.length + " · " + quiz.ok + " richtig")),
        h("div", { className: "bf-prog" }, h("i", { style: { width: (100 * quiz.i / quiz.liste.length) + "%" } })),
        h("div", { className: "card", key: b.id }, h(Frage, { b: b, onAnswer: function (ok) { antwort(b, ok); if (ok) setQuiz(Object.assign({}, quiz, { ok: quiz.ok + 1 })); }, weiter: function () { setQuiz(function (x) { return Object.assign({}, x, { i: x.i + 1 }); }); }, letzte: quiz.i + 1 === quiz.liste.length })));
    }
    if (modus && modus.indexOf("lern:") === 0) {
      var kat = modus.slice(5), K = KATS.filter(function (k) { return k[0] === kat; })[0];
      return h("div", null,
        h("div", { className: "bf-top" }, h("button", { type: "button", className: "skip", onClick: function () { setModus(null); } }, "← Übersicht"), h("button", { type: "button", className: "btn sm", onClick: function () { start(kat); } }, "Diesen Bereich als Quiz")),
        h("h2", null, K ? K[1] : "Befunde"),
        BEF.filter(function (b) { return b.kat === kat; }).map(function (b) {
          return h("div", { key: b.id, className: "card", style: { marginBottom: 12 } }, h(Bild, { b: b, alt: b.titel }), h("h3", { style: { margin: "12px 0 4px" } }, b.titel), h("p", { style: { margin: "0 0 6px" } }, b.erkl), h("p", { className: "muted", style: { margin: 0 } }, h("b", null, "Handeln: "), b.handeln));
        }));
    }
    var gesamt = BEF.length, richtig = BEF.filter(function (b) { return stand[b.id] === 1; }).length;
    return h("div", null,
      h("div", { className: "card" },
        h("h2", { style: { marginTop: 0 } }, "Bildbefunde trainieren"),
        h("p", { className: "muted" }, gesamt + " gezeichnete Befunde aus " + KATS.length + " Bereichen: erkennen, benennen und wissen, was zu tun ist. Die Bilder sind Schemata zum Lernen, keine echten Patientenbilder."),
        h("div", { className: "bf-prog" }, h("i", { style: { width: (100 * richtig / gesamt) + "%" } })),
        h("p", { className: "muted", style: { marginTop: -4 } }, richtig + " von " + gesamt + " zuletzt richtig erkannt"),
        h("button", { type: "button", className: "btn", onClick: function () { start(null); } }, "Gemischtes Quiz (12 Befunde)")),
      h("div", { className: "bf-kats" }, KATS.map(function (k) {
        var n = BEF.filter(function (b) { return b.kat === k[0]; }), ok = n.filter(function (b) { return stand[b.id] === 1; }).length;
        return h("button", { key: k[0], type: "button", className: "bf-kat", style: { "--c": k[2] }, onClick: function () { setModus("lern:" + k[0]); } }, h("b", null, k[1]), h("small", null, n.length + " Befunde · " + ok + " sicher"));
      })));
  }
  window.FP_TRAINING_VIEWS = window.FP_TRAINING_VIEWS || {};
  window.FP_TRAINING_VIEWS.befunde = Befunde;
})();
