/* ===== Figuren im Stil der Module (gleiche Bauteile, gleiche Linien) ===== */
(function () {
  var L = window.PXAVL || {}, K = "#1d1d1f";
  var ST = ' stroke="' + K + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  var n = 0;
  function sub(t, sp) { return String(t || "").replace(/\{H\}/g, sp.hairC || "#6b4a2f").replace(/\{S\}/g, sp.skin || "#f6d2b3"); }
  function eyes() { return '<ellipse cx="50" cy="53" rx="2.6" ry="3" fill="' + K + '"/><ellipse cx="70" cy="53" rx="2.6" ry="3" fill="' + K + '"/>'; }
  function line(x1, y1, x2, y2, w) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + K + '" stroke-width="' + (w || 2.5) + '" stroke-linecap="round"/>'; }
  function path(d, fill, w) { return '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + K + '" stroke-width="' + (w || 2.5) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  var FACE = {
    neutral: function () { return '<g class="pa-eyes">' + eyes() + '</g>' + line(44, 45, 54, 45) + line(66, 45, 76, 45) + line(54, 70, 66, 70); },
    happy: function () { return path("M46,54 q4,-5 8,0") + path("M66,54 q4,-5 8,0") + path("M44,45 q5,-3 10,0") + path("M66,45 q5,-3 10,0") + path("M50,67 q10,10 20,0", "#ffffff"); },
    smile: function () { return '<g class="pa-eyes">' + eyes() + '</g>' + path("M44,45 q5,-3 10,0") + path("M66,45 q5,-3 10,0") + path("M52,68 q8,6 16,0"); },
    worried: function () { return '<g class="pa-eyes">' + eyes() + '</g>' + line(44, 47, 54, 43) + line(66, 43, 76, 47) + path("M53,72 q7,-5 14,0"); },
    sad: function () { return '<g class="pa-eyes">' + eyes() + '</g>' + line(44, 47, 54, 43) + line(66, 43, 76, 47) + path("M52,73 q8,-6 16,0") + '<path d="M75,58 q-2,5 0,7 q2,-2 0,-7z" fill="#7cc4ff" stroke="#3b82c4" stroke-width="1"/>'; },
    pain: function () { return path("M45,51 l9,3 l-9,3") + path("M75,51 l-9,3 l9,3") + line(44, 46, 54, 42) + line(66, 42, 76, 46) + path("M51,70 q9,-5 18,0 q-9,4 -18,0z", "#ffffff"); },
    sleepy: function () { return path("M46,53 q4,3 8,0") + path("M66,53 q4,3 8,0") + line(44, 46, 54, 46) + line(66, 46, 76, 46) + path("M56,70 q4,2 8,0"); },
    talk: function () { return '<g class="pa-eyes">' + eyes() + '</g>' + path("M44,45 q5,-3 10,0") + path("M66,45 q5,-3 10,0") + '<ellipse cx="60" cy="70" rx="5" ry="4" fill="#7a3b3b" stroke="' + K + '" stroke-width="2.5"/>'; },
    angry: function () { return '<g class="pa-eyes">' + eyes() + '</g>' + line(44, 43, 54, 47) + line(66, 47, 76, 43) + path("M53,72 q7,-4 14,0"); },
    tired: function () { return path("M46,54 h8") + path("M66,54 h8") + path("M46,51 q4,-2 8,0", "none", 1.6) + path("M66,51 q4,-2 8,0", "none", 1.6) + line(44, 46, 54, 45) + line(66, 45, 76, 46) + line(55, 70, 65, 70); },
    surprised: function () { return '<ellipse cx="50" cy="53" rx="3" ry="3.6" fill="' + K + '"/><ellipse cx="70" cy="53" rx="3" ry="3.6" fill="' + K + '"/>' + path("M44,43 q5,-4 10,0") + path("M66,43 q5,-4 10,0") + '<ellipse cx="60" cy="71" rx="3.5" ry="4.5" fill="#7a3b3b" stroke="' + K + '" stroke-width="2.5"/>'; }
  };
  var DECO = {
    gown: function (sp) { var c = sp.dot || "#5f8fbf"; return [[34, 108], [50, 116], [72, 112], [88, 106], [60, 104]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="' + c + '"/>'; }).join(""); },
    scrubs: function () { return '<path d="M50,92 l10,12 l10,-12" fill="none"' + ST + ' />'; },
    coat: function () { return '<path d="M48,92 l12,22 l12,-22" fill="none"' + ST + ' /><path d="M44,96 q-6,16 6,22 M76,96 q6,16 -6,22" fill="none" stroke="#3d4d5c" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="118" r="4" fill="#9aa8b5"' + ' stroke="' + K + '" stroke-width="3"/>'; },
    collar: function () { return '<path d="M48,90 l12,10 l12,-10" fill="#ffffff"' + ST + ' />'; },
    badge: function () { return '<path d="M50,92 l10,12 l10,-12" fill="none"' + ST + ' /><rect x="74" y="104" width="12" height="14" rx="2" fill="#ffffff" stroke="' + K + '" stroke-width="2.5"/><line x1="77" y1="110" x2="83" y2="110" stroke="#0062ff" stroke-width="2.5" stroke-linecap="round"/>'; },
    shirt: function () { return '<path d="M52,92 l8,8 l8,-8" fill="none"' + ST + ' /><line x1="60" y1="100" x2="60" y2="124" stroke="' + K + '" stroke-width="2"/>'; },
    jersey: function (sp) { return '<path d="M44,100 h32" stroke="' + (sp.dot || "#ffffff") + '" stroke-width="5"/><text x="60" y="120" text-anchor="middle" font-size="14" font-weight="800" fill="' + (sp.dot || "#ffffff") + '" font-family="system-ui,sans-serif">10</text>'; },
    none: function () { return ""; }
  };
  function extras(sp, mood) {
    var s = "";
    if (sp.wrinkles) s += path("M40,56 l-3,2", "none", 1.6) + path("M80,56 l3,2", "none", 1.6) + path("M47,62 q-2,4 0,8", "none", 1.4) + path("M73,62 q2,4 0,8", "none", 1.4);
    if (sp.blush) s += '<ellipse cx="44" cy="63" rx="5" ry="3" fill="#f3a5a5" opacity=".7"/><ellipse cx="76" cy="63" rx="5" ry="3" fill="#f3a5a5" opacity=".7"/>';
    if (sp.freckles) s += [[44, 61], [47, 64], [41, 64], [76, 61], [73, 64], [79, 64]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1" fill="#b4693e"/>'; }).join("");
    return s;
  }
  function after(sp, mood) {
    var s = "";
    if (sp.glasses) s += '<circle cx="50" cy="53" r="7.5" fill="none" stroke="' + K + '" stroke-width="2.5"/><circle cx="70" cy="53" r="7.5" fill="none" stroke="' + K + '" stroke-width="2.5"/><line x1="57.5" y1="53" x2="62.5" y2="53" stroke="' + K + '" stroke-width="2.5"/>';
    if (sp.beard) s += '<path d="M36,62 q2,22 24,24 q22,-2 24,-24 q-6,8 -14,8 q-10,-4 -20,0 q-8,0 -14,-8z" fill="' + (sp.beardC || sp.hairC) + '"' + ST + '/>' + line(54, 72, 66, 72);
    if (sp.mustache) s += '<path d="M50,66 q10,-6 20,0 q-10,3 -20,0z" fill="' + (sp.beardC || sp.hairC) + '" stroke="' + K + '" stroke-width="2"/>';
    if (sp.o2) s += '<path d="M34,60 q6,6 18,4 q8,-2 16,0 q12,2 18,-4" fill="none" stroke="#7fb7e6" stroke-width="2.4" stroke-linecap="round"/><circle cx="56" cy="64" r="1.6" fill="#7fb7e6"/><circle cx="64" cy="64" r="1.6" fill="#7fb7e6"/>';
    if (sp.hearing) s += '<path d="M86,50 q6,0 6,6 q0,6 -5,7" fill="#e8c9a8" stroke="' + K + '" stroke-width="2"/>';
    if (sp.earrings) s += '<circle cx="34" cy="64" r="2.2" fill="#f2c94c" stroke="' + K + '" stroke-width="1.4"/><circle cx="86" cy="64" r="2.2" fill="#f2c94c" stroke="' + K + '" stroke-width="1.4"/>';
    if (sp.sweat) s += '<path d="M78,40 q-2,5 0,7 q2,-2 0,-7z" fill="#bfe3ff" stroke="#3b82c4" stroke-width="1"/><path d="M41,46 q-2,4 0,6 q2,-2 0,-6z" fill="#bfe3ff" stroke="#3b82c4" stroke-width="1"/>';
    if (sp.cap) s += '<path d="M33,44 q0,-26 27,-26 q27,0 27,26 z" fill="' + sp.cap + '"' + ST + '/><line x1="35" y1="42" x2="85" y2="42" stroke="' + K + '" stroke-width="2.5"/>';
    if (sp.headband) s += '<path d="M35,40 q25,-12 50,0" fill="none" stroke="' + sp.headband + '" stroke-width="5" stroke-linecap="round"/>';
    if (sp.droop) s += path("M58,70 l8,3", "none", 2.5);
    if (sp.cyan) s += '<path d="M53,70 q7,3 14,0" fill="none" stroke="#5b7fd6" stroke-width="3.2" stroke-linecap="round"/>';
    if (sp.flush) s += '<ellipse cx="44" cy="63" rx="6" ry="3.5" fill="#f87171" opacity=".55"/><ellipse cx="76" cy="63" rx="6" ry="3.5" fill="#f87171" opacity=".55"/>';
    return s;
  }
  function skinOf(sp) { return sp.pale ? mix(sp.skin || "#f6d2b3", "#dfe5ea", 0.45) : (sp.skin || "#f6d2b3"); }
  function mix(a, b, t) {
    function p(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
    var x = p(a), y = p(b); return "#" + x.map(function (v, i) { return ("0" + Math.round(v + (y[i] - v) * t).toString(16)).slice(-2); }).join("");
  }
  /* Kopf ohne Körper (für Szenen) */
  function head(sp, mood, noBack) {
    var b = L[sp.hair] || L.JW, s2 = Object.assign({}, sp, { skin: skinOf(sp) });
    var sk = s2.skin;
    var o = noBack ? "" : sub(b.back, s2);
    o += '<circle cx="34" cy="56" r="6" fill="' + sk + '"' + ' stroke="' + K + '" stroke-width="3"/><circle cx="86" cy="56" r="6" fill="' + sk + '" stroke="' + K + '" stroke-width="3"/>';
    o += '<ellipse cx="60" cy="54" rx="25" ry="29" fill="' + sk + '" stroke="' + K + '" stroke-width="3"/>';
    if (sp.stubble || (b.stub && sp.stubble !== false)) o += [[48, 74], [54, 77], [60, 78], [66, 77], [72, 74], [45, 68], [75, 68]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.1" fill="#7b828a"/>'; }).join("");
    o += extras(sp, mood);
    if (!sp.bald) o += sub(b.hair, s2);
    o += (FACE[mood] || FACE.neutral)(sp);
    o += after(sp, mood);
    return o;
  }
  function bust(sp, mood) {
    var sk = skinOf(sp), d = sp.deco;
    var decoS = typeof d === "string" && DECO[d] ? DECO[d](sp) : (sp.decoFrom && L[sp.decoFrom] ? sub(L[sp.decoFrom].deco, sp) : "");
    var b = L[sp.hair] || L.JW;
    /* Hals zuerst: verjüngt, läuft unter den Kragen, damit Kopf und Körper sauber verbunden sind */
    return sub(b.back, Object.assign({}, sp, { skin: sk })) +
      '<path d="M51,70 L51,83 Q51,91 42,95 L78,95 Q69,91 69,83 L69,70 Z" fill="' + sk + '"/>' +
      '<path d="M51,70 L51,83 Q51,91 42,95 M69,70 L69,83 Q69,91 78,95" fill="none" stroke="' + K + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M51,82 Q60,90 69,82 L69,86 Q60,93 51,86 Z" fill="' + mix(sk, K, 0.22) + '" opacity=".35"/>' +
      '<path d="M14,124 q2,-30 30,-34 q16,8 32,0 q28,4 30,34 z" fill="' + (sp.cloth || "#9cc3e6") + '"' + ST + ' />' + decoS +
      head(sp, mood, true);
  }
  function svg(sp, mood, label) {
    var key = JSON.stringify(sp) + "|" + (mood || "") + "|" + (label || ""), hsh = 0; for (var i = 0; i < key.length; i++) hsh = (hsh * 31 + key.charCodeAt(i)) | 0; var id = "pxav" + (hsh >>> 0).toString(36); /* stabil: gleiche Person = gleiches SVG, damit React beim Antippen nichts neu zeichnet */
    return '<svg class="avatar-svg pxav" viewBox="0 0 120 120" role="img" aria-label="' + (label || sp.name || "Person") + '" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="56" fill="' + (sp.bg || "#ddeeff") + '"/><clipPath id="' + id + '"><circle cx="60" cy="60" r="54.5"/></clipPath><g clip-path="url(#' + id + ')">' + bust(sp, mood || "neutral") + '</g></svg>';
  }
  window.PXAV = { svg: svg, head: head, bust: bust, mix: mix, K: K };
})();
