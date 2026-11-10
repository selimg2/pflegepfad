/* ===== Fallpfad · Illustrations-Bausteine für die Examensfälle (SVG-Strings, viewBox 400×280) ===== */
window.PXA = (function () {
  function a(o) { var s = ""; for (var k in o) if (o[k] != null) s += " " + k + '="' + o[k] + '"'; return s; }
  var A = {
    r: function (x, y, w, hh, rx, cls, ex) { return "<rect" + a({ x: x, y: y, width: w, height: hh, rx: rx || 0, "class": cls }) + (ex || "") + "/>"; },
    c: function (x, y, r, cls, ex) { return "<circle" + a({ cx: x, cy: y, r: r, "class": cls }) + (ex || "") + "/>"; },
    e: function (x, y, rx, ry, cls, ex) { return "<ellipse" + a({ cx: x, cy: y, rx: rx, ry: ry, "class": cls }) + (ex || "") + "/>"; },
    p: function (d, cls, ex) { return "<path" + a({ d: d, "class": cls }) + (ex || "") + "/>"; },
    t: function (x, y, s, cls, anchor) { return "<text" + a({ x: x, y: y, "class": cls || "x-txt", "text-anchor": anchor || "middle" }) + ">" + s + "</text>"; },
    g: function (tr, inner) { return '<g transform="' + tr + '">' + inner + "</g>"; },
    /* Hintergrund */
    room: function () { return A.r(0, 0, 400, 214, 0, "h-wall") + A.r(0, 214, 400, 66, 0, "h-floor"); },
    table: function () { return A.r(0, 0, 400, 280, 0, "x-bgt") + A.p("M0 200H400", "x-edge"); },
    /* Material */
    tray: function (x, y, w, hh) { return A.r(x, y, w, hh, 10, "x-tray") + A.r(x + 6, y + 6, w - 12, hh - 12, 7, "x-tray2"); },
    drape: function (x, y, w, hh, hole) { return A.r(x, y, w, hh, 6, "x-drape") + (hole ? A.e(x + w / 2, y + hh / 2, hole[0], hole[1], "x-hole") : "") + A.p("M" + (x + 8) + " " + (y + 10) + "h" + (w - 16) + "M" + (x + 8) + " " + (y + hh - 10) + "h" + (w - 16), "x-drapel"); },
    swab: function (x, y, n) { var s = ""; for (var i = 0; i < (n || 1); i++) s += A.c(x + i * 15, y, 7, "x-swab") + A.p("M" + (x + i * 15 - 4) + " " + y + "h8M" + (x + i * 15) + " " + (y - 4) + "v8", "x-swabl"); return s; },
    gauze: function (x, y, w, hh) { return A.r(x, y, w, hh, 3, "h-gauze") + A.p("M" + (x + 5) + " " + (y + hh / 3) + "h" + (w - 10) + "M" + (x + 5) + " " + (y + 2 * hh / 3) + "h" + (w - 10), "h-gl"); },
    syringe: function (x, y, len, fillCls, lab) { len = len || 70; return A.r(x, y, len, 14, 3, "x-white") + A.r(x + 3, y + 3, len * 0.55, 8, 2, fillCls || "x-nacl") + A.p("M" + (x + len) + " " + (y + 7) + "h14M" + (x - 10) + " " + y + "v14M" + x + " " + (y + 7) + "h-10", "x-metall") + (lab ? A.t(x + len / 2, y - 5, lab, "x-txt x-s") : ""); },
    bottle: function (x, y, cls, lab) { return A.p("M" + (x + 8) + " " + y + "h14v8l6 8v42a4 4 0 0 1-4 4H" + (x + 6) + "a4 4 0 0 1-4-4V" + (y + 16) + "l6-8z", cls || "x-bottle") + A.r(x + 6, y + 30, 18, 16, 2, "x-label") + (lab ? A.t(x + 15, y + 82, lab, "x-txt x-s") : ""); },
    glove: function (x, y, s, cls) { s = s || 1; return A.g("translate(" + x + " " + y + ") scale(" + s + ")", A.p("M10 60V26c0-3 5-3 5 0v18V10c0-3 5-3 5 0v32V6c0-3 5-3 5 0v36V10c0-3 5-3 5 0v38l4-10c2-3 6-1 5 2l-7 22c-2 6-6 10-12 10h-6c-5 0-9-4-9-9z", cls || "x-glove")); },
    bag: function (x, y, fill) { return A.p("M" + x + " " + y + "h50v74a8 8 0 0 1-8 8H" + (x + 8) + "a8 8 0 0 1-8-8z", "x-bag") + (fill ? A.p("M" + (x + 2) + " " + (y + 82 - fill) + "h46v" + (fill - 8) + "a6 6 0 0 1-6 6H" + (x + 8) + "a6 6 0 0 1-6-6z", "x-urine") : "") + A.p("M" + (x + 8) + " " + (y + 18) + "h34M" + (x + 8) + " " + (y + 34) + "h34M" + (x + 8) + " " + (y + 50) + "h34", "x-scale") + A.p("M" + (x + 25) + " " + (y + 82) + "v12", "x-tube2"); },
    clip: function (x, y) { return A.r(x - 9, y - 5, 18, 10, 3, "x-clamp"); },
    pillcup: function (x, y) { return A.p("M" + x + " " + y + "h30l-4 26h-22z", "x-cup"); },
    tick: function (x, y) { return A.c(x, y, 11, "x-ok") + A.p("M" + (x - 5) + " " + y + "l3.5 3.5 7-7", "x-tickl"); },
    cross: function (x, y) { return A.c(x, y, 11, "x-no") + A.p("M" + (x - 4.5) + " " + (y - 4.5) + "l9 9m0-9l-9 9", "x-tickl"); },
    tag: function (x, y, s, cls) { var w = s.length * 6.4 + 16; return A.r(x - w / 2, y - 11, w, 22, 11, cls || "x-tag") + A.t(x, y + 4, s, "x-tagt"); },
    /* Menschen */
    head: function (x, y, r, hair) { return A.c(x, y, r, "h-skin") + (hair ? A.p("M" + (x - r) + " " + (y - 2) + "a" + r + " " + r + " 0 0 1 " + 2 * r + " 0c-6-6-12-8-" + r + "-8s-" + (r - 6) + " 2-" + r + " 8z", hair) : ""); },
    face: function (x, y, mood) { return A.c(x - 5, y - 2, 1.6, "x-eye") + A.c(x + 5, y - 2, 1.6, "x-eye") + A.p(mood === "sad" ? "M" + (x - 5) + " " + (y + 8) + "q5-4 10 0" : mood === "flat" ? "M" + (x - 5) + " " + (y + 7) + "h10" : "M" + (x - 5) + " " + (y + 6) + "q5 4 10 0", "x-mouth"); },
    bedSide: function (x, y, w) { w = w || 300; return A.r(x, y, w, 18, 6, "h-bed") + A.p("M" + (x + 10) + " " + (y + 18) + "v62M" + (x + w - 10) + " " + (y + 18) + "v62", "h-leg") + A.c(x + 10, y + 84, 5, "x-wheel") + A.c(x + w - 10, y + 84, 5, "x-wheel"); }
  };
  return A;
})();
