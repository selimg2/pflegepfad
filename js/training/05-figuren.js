/* ===== Fallpfad Figuren: Ganzkörper in einheitlicher, sauberer Linienführung =====
   Stehen, sitzen (seitlich und frontal), liegen. Gleiche Köpfe wie überall (PXAV), Hals geht weich in die Schultern über.
   Alle Maße in einem lokalen Raster (Füße bzw. Sitzfläche im Ursprung) und dann skaliert. */
(function () {
  var X = window.PXB, AV = window.PXAV;
  if (!X || !AV) return;
  var K = X.K || "#1d1d1f";
  var F = X.F = {};
  function skinOf(sp) { return sp.pale ? AV.mix(sp.skin || "#f6d2b3", "#dfe5ea", 0.45) : (sp.skin || "#f6d2b3"); }
  function dk(c, t) { return AV.mix(c, "#1d1d1f", t == null ? 0.18 : t); }
  function P(d, fill, w, extra) { return '<path d="' + d + '" fill="' + (fill || "none") + '"' + (w ? ' stroke="' + K + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"' : "") + (extra || "") + "/>"; }
  /* Gliedmaße: Kontur und Füllung als runde Linie (wie im übrigen Stil), mit sanfter Verjüngung durch zwei Segmente */
  function limb(pts, w, col) {
    var d = "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L");
    return P(d, "none", 0, ' stroke="' + K + '" stroke-width="' + (w + 3.6) + '" stroke-linecap="round" stroke-linejoin="round"') +
      P(d, "none", 0, ' stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"');
  }
  function hand(x, y, sk, r) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (r || 5.2) + '" ry="' + ((r || 5.2) * 1.15) + '" fill="' + sk + '" stroke="' + K + '" stroke-width="1.8"/>'; }
  /* Hals: weich verjüngt, oben unter dem Kinn versteckt, unten unter dem Kragen */
  function neck(cx, top, base, wTop, wBase, sk) {
    var a = cx - wTop, b = cx + wTop, c = cx - wBase, d = cx + wBase, m = (top + base) / 2;
    return P("M" + a + " " + top + "L" + a + " " + m + "Q" + a + " " + (base - 2) + " " + c + " " + base + "L" + d + " " + base + "Q" + b + " " + (base - 2) + " " + b + " " + m + "L" + b + " " + top + "Z", sk, 0) +
      P("M" + a + " " + top + "L" + a + " " + m + "Q" + a + " " + (base - 2) + " " + c + " " + base + "M" + b + " " + top + "L" + b + " " + m + "Q" + b + " " + (base - 2) + " " + d + " " + base, "none", 1.9) +
      '<ellipse cx="' + cx + '" cy="' + (top + 3) + '" rx="' + (wTop + 0.5) + '" ry="3" fill="' + dk(sk, 0.22) + '" opacity=".35"/>';
  }
  function clothDeco(sp, cx, top) {
    var d = sp.deco, s = "";
    if (d === "scrubs" || d === "badge") s += P("M" + (cx - 7) + " " + (top + 1) + "L" + cx + " " + (top + 10) + "L" + (cx + 7) + " " + (top + 1), "none", 1.8);
    if (d === "badge") s += '<rect x="' + (cx + 10) + '" y="' + (top + 14) + '" width="8" height="10" rx="1.6" fill="#fff" stroke="' + K + '" stroke-width="1.5"/><line x1="' + (cx + 12) + '" y1="' + (top + 18) + '" x2="' + (cx + 16) + '" y2="' + (top + 18) + '" stroke="#0062ff" stroke-width="1.6"/>';
    if (d === "collar") s += P("M" + (cx - 8) + " " + top + "L" + cx + " " + (top + 7) + "L" + (cx + 8) + " " + top, "#ffffff", 1.6);
    if (d === "shirt") s += P("M" + (cx - 6) + " " + top + "L" + cx + " " + (top + 6) + "L" + (cx + 6) + " " + top, "none", 1.6) + '<line x1="' + cx + '" y1="' + (top + 6) + '" x2="' + cx + '" y2="' + (top + 52) + '" stroke="' + K + '" stroke-width="1.3" opacity=".6"/>';
    if (d === "gown" || !d) s += [[-12, 20], [8, 30], [-4, 44], [14, 52], [-16, 50]].map(function (p) { return '<circle cx="' + (cx + p[0]) + '" cy="' + (top + p[1]) + '" r="1.8" fill="' + (sp.dot || dk(sp.cloth || "#9cc3e6", 0.25)) + '"/>'; }).join("");
    return s;
  }
  function wrap(inner, x, y, sc, flip, cls) {
    return '<g' + (cls ? ' class="' + cls + '"' : "") + ' transform="translate(' + x + "," + y + ") scale(" + (flip ? -sc : sc) + "," + sc + ')">' + inner + "</g>";
  }
  /* Kopf passend einsetzen; bei gespiegelter Figur wieder zurückspiegeln, damit das Gesicht nicht seitenverkehrt wirkt */
  function headAt(sp, mood, x, y, size, flip, tilt) {
    var inner = X.head(sp, mood, 0, 0, size, tilt || 0);
    return '<g transform="translate(' + x + "," + y + ")" + (flip ? " scale(-1,1)" : "") + '">' + inner + "</g>";
  }

  /* ---------- Stehen (frontal) ----------
     o: { h: Körpergröße in px (176), mood, pose: "down"|"assist"|"reach"|"support"|"wave"|"hips", pants, shoes, flip, kid, cls, skirt } */
  F.stand = function (sp, x, y, o) {
    o = o || {};
    var kid = !!o.kid, sk = skinOf(sp), cl = sp.cloth || "#9cc3e6", pants = o.pants || (sp.deco === "scrubs" || sp.deco === "badge" ? dk(cl, 0.12) : "#5b6b80"), shoes = o.shoes || (sp.deco === "scrubs" || sp.deco === "badge" ? "#f8fafc" : "#334155");
    var H = kid ? 134 : 184, sc = (o.h || (kid ? 124 : 184)) / H;
    var s = "", hy = kid ? -108 : -160, hs = kid ? 68 : 70, nTop = kid ? -96 : -148, sh = kid ? -86 : -137, hip = kid ? -50 : -79, sw = kid ? 22 : 29;
    /* Beine und Schuhe */
    if (o.skirt) s += P("M" + (-sw + 4) + " " + (hip - 2) + "L" + (-sw - 2) + " " + (hip + 40) + "Q0 " + (hip + 46) + " " + (sw + 2) + " " + (hip + 40) + "L" + (sw - 4) + " " + (hip - 2) + "Z", pants, 2) + limb([[-9, hip + 40], [-9, -8]], 7.5, sk) + limb([[9, hip + 40], [9, -8]], 7.5, sk);
    else s += P("M" + (-sw + 4) + " " + (hip - 1) + "H" + (sw - 4) + "L" + (sw - 6) + " -7Q" + (sw - 6) + " -4 " + (sw - 9) + " -4H4.5Q2 -4 2 -7L1 " + (hip + 18) + "Q0 " + (hip + 16) + " -1 " + (hip + 18) + "L-2 -7Q-2 -4 -4.5 -4H" + (-sw + 9) + "Q" + (-sw + 6) + " -4 " + (-sw + 6) + " -7Z", pants, 2) +
      P("M0 " + (hip + 18) + "V" + (hip + 2), "none", 0, ' stroke="' + dk(pants, 0.25) + '" stroke-width="1.4"');
    s += P("M" + (-sw + 4) + " 0Q" + (-sw + 4) + " -7 " + (-sw + 11) + " -7H-4Q0 -7 0 -3V0Z", shoes, 1.8) + P("M" + (sw - 4) + " 0Q" + (sw - 4) + " -7 " + (sw - 11) + " -7H4Q0 -7 0 -3V0Z", shoes, 1.8);
    /* Hals, Rumpf */
    s += neck(0, nTop, sh + 1, kid ? 5 : 5.6, kid ? 7 : 8.5, sk);
    var torso = "M-8 " + sh + "C" + (-sw + 8) + " " + sh + " " + (-sw + 1) + " " + (sh + 2) + " " + (-sw) + " " + (sh + 8) + "C" + (-sw - 1.5) + " " + (sh + 20) + " " + (-sw + 1) + " " + (hip - 16) + " " + (-sw + 3) + " " + (hip + 2) + "H" + (sw - 3) + "C" + (sw - 1) + " " + (hip - 16) + " " + (sw + 1.5) + " " + (sh + 20) + " " + sw + " " + (sh + 8) + "C" + (sw - 1) + " " + (sh + 2) + " " + (sw - 8) + " " + sh + " 8 " + sh + "Q0 " + (sh + 6) + " -8 " + sh + "Z";
    /* Arme hinter dem Rumpf (bei Posen nach vorn darüber) */
    var la = [[-sw + 2, sh + 8], [-sw - 3, sh + 32], [-sw - 1, hip + 4]], ra = [[sw - 2, sh + 8], [sw + 3, sh + 32], [sw + 1, hip + 4]];
    var pose = o.pose || "down";
    if (pose === "assist") la = [[-sw + 2, sh + 8], [-sw - 12, sh + 28], [-sw - 30, sh + 30]];
    if (pose === "reach") ra = [[sw - 2, sh + 8], [sw + 14, sh + 24], [sw + 34, sh + 22]];
    if (pose === "support") { la = [[-sw + 2, sh + 8], [-sw - 12, sh + 28], [-sw - 30, sh + 30]]; ra = [[sw - 2, sh + 8], [sw + 4, sh + 30], [-sw - 18, sh + 40]]; }
    if (pose === "wave") ra = [[sw - 2, sh + 8], [sw + 14, sh - 4], [sw + 12, sh - 28]];
    if (pose === "hips") { la = [[-sw + 2, sh + 8], [-sw - 12, sh + 28], [-sw + 2, hip - 4]]; ra = [[sw - 2, sh + 8], [sw + 12, sh + 28], [sw - 2, hip - 4]]; }
    if (pose === "hold") { la = [[-sw + 2, sh + 8], [-sw - 4, sh + 30], [-8, sh + 38]]; ra = [[sw - 2, sh + 8], [sw + 4, sh + 30], [8, sh + 38]]; }
    var armW = kid ? 7 : 8.6, sleeve = sp.deco === "scrubs" || sp.deco === "badge" || sp.short ? 0.42 : 0.62;
    function arm(a) {
      var m = [a[0][0] + (a[1][0] - a[0][0]) * sleeve * 1.6, a[0][1] + (a[1][1] - a[0][1]) * sleeve * 1.6];
      if (sleeve * 1.6 > 1) m = [a[1][0] + (a[2][0] - a[1][0]) * (sleeve * 1.6 - 1), a[1][1] + (a[2][1] - a[1][1]) * (sleeve * 1.6 - 1)];
      var skinPart = sleeve * 1.6 > 1 ? [m, a[2]] : [m, a[1], a[2]], clothPart = sleeve * 1.6 > 1 ? [a[0], a[1], m] : [a[0], m];
      return limb(a, armW - 1.4, sk) + limb(clothPart, armW + 0.6, cl) + hand(a[2][0], a[2][1] + 3, sk, kid ? 4.4 : 5);
    }
    var front = pose === "assist" || pose === "reach" || pose === "support" || pose === "hold" || pose === "wave";
    if (!front) s += arm(la) + arm(ra);
    s += P(torso, cl, 2.2) + P("M" + (-sw + 4) + " " + (hip - 6) + "H" + (sw - 4), "none", 0, ' stroke="' + dk(cl, 0.12) + '" stroke-width="1.2" opacity=".7"') + clothDeco(sp, 0, sh);
    if (front) s += arm(la) + arm(ra);
    /* Kopf */
    s += headAt(sp, o.mood || "neutral", 0, hy, hs, o.flip, o.tilt);
    X._fig = { x: x, y: y, sc: sc, head: [x, y + hy * sc], hand: [x + (o.flip ? -1 : 1) * la[2][0] * sc, y + la[2][1] * sc], handR: [x + (o.flip ? -1 : 1) * ra[2][0] * sc, y + ra[2][1] * sc] };
    return wrap(s, x, y, sc, o.flip, o.cls);
  };

  /* ---------- Sitzen, seitlich (Blick nach rechts) ----------
     Ursprung = Gesäß auf der Sitzfläche. o: { mood, lean (0 bis 1), feet: "shoes"|"bare"|"none", pants, legs: "down"|"up" (Beine hochgelegt), arms: "lap"|"rest"|"forward", flip, sc } */
  F.sitSide = function (sp, x, y, o) {
    o = o || {};
    var sk = skinOf(sp), cl = sp.cloth || "#9cc3e6", pants = o.pants || dk(cl, 0.32), sc = o.sc || 1, lean = o.lean || 0;
    var s = "", ang = -lean * 22;
    /* Beine */
    var knee = [44, -4], ank = o.legs === "up" ? [86, -6] : [44, 40];
    s += P("M-6 -12H" + (knee[0] - 2) + "Q" + (knee[0] + 8) + " -12 " + (knee[0] + 8) + " " + (knee[1]) + "Q" + (knee[0] + 8) + " 6 " + (knee[0] - 2) + " 6H-6Z", pants, 2);
    if (o.legs === "up") s += limb([[knee[0], knee[1]], [ank[0] - 6, ank[1]]], 12, pants);
    else s += limb([[knee[0] + 2, knee[1] + 4], [ank[0] + 1, ank[1] - 4]], 12, pants);
    if (o.wrap && o.legs !== "up") s += limb([[knee[0] + 2, knee[1] + 8], [ank[0] + 1, ank[1] - 4]], 13, o.wrap) + [0, 1, 2, 3].map(function (k) { var yy = knee[1] + 12 + k * 7; return P("M" + (knee[0] - 5) + " " + (yy + 3) + "L" + (knee[0] + 8) + " " + yy, "none", 0, ' stroke="' + dk(o.wrap, 0.2) + '" stroke-width="1.4"'); }).join("");
    var ft = o.feet || "shoes", fx = ank[0], fy = ank[1];
    if (o.legs === "up") { if (ft !== "none") s += P("M" + (fx - 6) + " " + (fy - 8) + "Q" + (fx + 6) + " " + (fy - 12) + " " + (fx + 6) + " " + (fy - 2) + "Q" + (fx + 6) + " " + (fy + 6) + " " + (fx - 6) + " " + (fy + 6) + "Z", ft === "bare" ? sk : "#334155", 1.8); }
    else if (ft === "shoes") s += P("M" + (fx - 8) + " " + (fy + 6) + "Q" + (fx - 8) + " " + (fy - 4) + " " + fx + " " + (fy - 4) + "H" + (fx + 8) + "Q" + (fx + 18) + " " + (fy - 2) + " " + (fx + 19) + " " + (fy + 6) + "Z", "#334155", 1.8);
    else if (ft === "bare") s += P("M" + (fx - 7) + " " + (fy + 5) + "Q" + (fx - 7) + " " + (fy - 4) + " " + fx + " " + (fy - 4) + "Q" + (fx + 14) + " " + (fy - 2) + " " + (fx + 16) + " " + (fy + 5) + "Z", sk, 1.8);
    /* Oberkörper um die Hüfte geneigt */
    var up = "";
    up += neck(4, -76, -60, 5.6, 8, sk);
    up += P("M-12 4C-16 -16 -16 -40 -12 -54C-9 -60 -2 -62 4 -61C10 -62 16 -60 18 -53C21 -40 20 -16 16 4Z", cl, 2.2) + clothDeco(sp, 4, -60);
    var arms = o.arms || "lap", a = arms === "rest" ? [[6, -54], [2, -28], [18, -20]] : arms === "forward" ? [[6, -54], [20, -36], [40, -40]] : [[6, -54], [6, -28], [28, -12]];
    if (o.reach) { var rl = [(o.reach[0] - x) / sc * (o.flip ? -1 : 1), (o.reach[1] - y) / sc]; a = [[6, -54], [(6 + rl[0]) / 2 - 2, Math.max(-54, rl[1]) / 2 + Math.max(-54, rl[1]) / 2 + 18], [rl[0] - 2, rl[1]]]; if (a[1][1] < -30) a[1][1] = Math.min(-30, (rl[1] - 54) / 2 + 22); }
    up += limb(a, 7.2, sk) + limb([a[0], [a[0][0] + (a[1][0] - a[0][0]) * 0.75, a[0][1] + (a[1][1] - a[0][1]) * 0.75]], 9.2, cl) + hand(a[2][0] + 2, a[2][1] + 1, sk);
    up += headAt(sp, o.mood || "neutral", 6, -85, 66, o.flip, o.tilt);
    s += '<g transform="rotate(' + ang + ')">' + up + "</g>";
    var hp = [Math.sin(-ang * Math.PI / 180) * 85 + 6, -Math.cos(ang * Math.PI / 180) * 85];
    X._fig = { x: x, y: y, sc: sc, head: [x + (o.flip ? -1 : 1) * hp[0] * sc, y + hp[1] * sc], hand: [x + (o.flip ? -1 : 1) * (a[2][0] + 2) * sc, y + a[2][1] * sc], knee: [x + (o.flip ? -1 : 1) * knee[0] * sc, y + knee[1] * sc], foot: [x + (o.flip ? -1 : 1) * fx * sc, y + fy * sc] };
    return wrap(s, x, y, sc, o.flip, o.cls);
  };

  /* ---------- Sessel, seitlich (passt zu sitSide; Ursprung = Gesäß) ---------- */
  F.armchair = function (x, y, o) {
    o = o || {};
    var c = o.col || "#c08457", c2 = o.col2 || AV.mix(c, "#ffffff", 0.18), s = "", sc = o.sc || 1;
    s += '<ellipse cx="' + 14 + '" cy="' + (o.floor || 48) + '" rx="62" ry="6" fill="#0f172a" opacity=".08"/>';
    s += P("M-30 " + (o.floor || 48) + "V24M50 " + (o.floor || 48) + "V24", "none", 0, ' stroke="' + K + '" stroke-width="4.5" stroke-linecap="round"');
    s += P("M-44 14L-38 -96Q-36 -110 -22 -108L-14 -106Q-4 -104 -6 -90L-14 10Z", c, 2.2);
    s += P("M-40 -2H54Q60 -2 60 6V18Q60 26 52 26H-36Q-44 26 -44 18V6Q-44 -2 -40 -2Z", c, 2.2);
    s += P("M-22 -40H50Q58 -40 58 -32V-26Q58 -20 50 -20H-22Z", c2, 2);
    s += P("M-36 4H52", "none", 0, ' stroke="' + AV.mix(c, "#1d1d1f", 0.2) + '" stroke-width="1.4"');
    return wrap(s, x, y, sc, o.flip);
  };

  /* ---------- Sitzen, frontal (Sessel, Stuhl) ----------
     Ursprung = Mitte der Sitzfläche. o: { mood, feet: "shoes"|"bare", pants, legUp: "right" (rechtes Bein auf Hocker), blanket } */
  F.sitFront = function (sp, x, y, o) {
    o = o || {};
    var sk = skinOf(sp), cl = sp.cloth || "#9cc3e6", pants = o.pants || dk(cl, 0.32), sc = o.sc || 1;
    var s = "";
    /* Unterschenkel und Füße */
    var leg = function (lx, up) {
      if (up) return "";
      return limb([[lx, 10], [lx + (lx < 0 ? -1 : 1), 48]], 11.5, pants) + (o.feet === "bare" ? P("M" + (lx - 8) + " 58Q" + (lx - 8) + " 50 " + lx + " 50Q" + (lx + 8) + " 50 " + (lx + 8) + " 58Z", sk, 1.8) : P("M" + (lx - 9) + " 58Q" + (lx - 9) + " 49 " + lx + " 49Q" + (lx + 9) + " 49 " + (lx + 9) + " 58Z", "#334155", 1.8));
    };
    s += leg(-12, false) + leg(12, o.legUp === "right");
    /* Oberschenkel (verkürzt) */
    s += P("M-26 -8H26Q28 -8 28 -4V12Q28 16 24 16H4Q0 16 0 12Q0 16 -4 16H-24Q-28 16 -28 12V-4Q-28 -8 -26 -8Z", o.blanket || pants, 2);
    /* Hals, Rumpf, Arme */
    s += neck(0, -76, -59, 5.8, 8.5, sk);
    s += P("M-8 -60C-18 -60 -24 -58 -26 -52C-28 -42 -27 -20 -25 -4H25C27 -20 28 -42 26 -52C24 -58 18 -60 8 -60Q0 -54 -8 -60Z", cl, 2.2) + clothDeco(sp, 0, -60);
    s += limb([[-25, -50], [-31, -26], [-20, -8]], 7.2, sk) + limb([[-25, -50], [-29, -34]], 9.4, cl) + hand(-18, -6, sk);
    s += limb([[25, -50], [31, -26], [20, -8]], 7.2, sk) + limb([[25, -50], [29, -34]], 9.4, cl) + hand(18, -6, sk);
    s += headAt(sp, o.mood || "neutral", 0, -85, 66, false, o.tilt);
    X._fig = { x: x, y: y, sc: sc, head: [x, y - 85 * sc], lap: [x, y], footR: [x + 12 * sc, y + 54 * sc], footL: [x - 12 * sc, y + 54 * sc] };
    return wrap(s, x, y, sc, false, o.cls);
  };

  /* ---------- Liegen (flach, Kopf links, unter der Decke) ----------
     x0 = Kopfende der Matratze, y = Oberkante Matratze, len = Länge. o: { mood, blanket, tilt, legs: "flat"|"knee", arm: true } */
  F.lie = function (sp, x0, y, len, o) {
    o = o || {};
    var sk = skinOf(sp), bl = o.blanket || "#e6eef8", s = "";
    /* Kissen */
    s += '<rect x="' + (x0 + 2) + '" y="' + (y - 16) + '" width="58" height="24" rx="11" fill="#ffffff" stroke="' + K + '" stroke-width="2"/>' + P("M" + (x0 + 12) + " " + (y - 2) + "q18 6 36 0", "none", 0, ' stroke="#e2e8f0" stroke-width="2"');
    /* Kopf leicht zur Seite geneigt auf dem Kissen */
    s += headAt(sp, o.mood || "sleepy", x0 + 38, y - 24, 66, false, o.tilt == null ? -12 : o.tilt);
    /* Decke mit Körperkontur */
    var x1 = x0 + len, kn = o.legs === "knee";
    var top = "M" + (x0 + 50) + " " + (y + 6) + "Q" + (x0 + 56) + " " + (y - 18) + " " + (x0 + 84) + " " + (y - 18) + "C" + (x0 + 120) + " " + (y - 20) + " " + (x0 + 140) + " " + (y - 12) + " " + (x0 + len * 0.55) + " " + (y - 12) +
      (kn ? "C" + (x0 + len * 0.66) + " " + (y - 14) + " " + (x0 + len * 0.7) + " " + (y - 36) + " " + (x0 + len * 0.76) + " " + (y - 36) + "C" + (x0 + len * 0.82) + " " + (y - 36) + " " + (x0 + len * 0.84) + " " + (y - 16) + " " + (x1 - 22) + " " + (y - 14)
        : "C" + (x0 + len * 0.7) + " " + (y - 12) + " " + (x0 + len * 0.8) + " " + (y - 10) + " " + (x1 - 26) + " " + (y - 12)) +
      "Q" + (x1 - 10) + " " + (y - 22) + " " + (x1 - 4) + " " + (y - 8) + "L" + (x1 - 4) + " " + (y + 24) + "H" + (x0 + 50) + "Z";
    s += P(top, bl, 2.2);
    s += P("M" + (x0 + 58) + " " + (y - 8) + "Q" + (x0 + 62) + " " + (y - 16) + " " + (x0 + 84) + " " + (y - 16), "none", 0, ' stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".85"');
    s += P("M" + (x0 + 100) + " " + (y - 6) + "q8 14 2 28M" + (x0 + len * 0.62) + " " + (y - 8) + "q10 16 4 30", "none", 0, ' stroke="' + dk(bl, 0.14) + '" stroke-width="1.6"');
    if (o.arm) s += limb([[x0 + 74, y - 8], [x0 + 118, y - 12]], 7.2, sk) + hand(x0 + 122, y - 11, sk);
    X._fig = { head: [x0 + 38, y - 24], chest: [x0 + 92, y - 14], hip: [x0 + len * 0.5, y - 12], feet: [x1 - 14, y - 12], knee: [x0 + len * 0.76, y - (kn ? 36 : 12)] };
    return s;
  };
})();
