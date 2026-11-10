/* Befüllt styleguide.html mit den echten Bausteinen der App (keine Kopien). */
(function () {
  var X = window.PXB, AV = window.PXAV, F = X && X.F, S = window.FP_SCENE, L = window.PXAVL || {};
  function $(id) { return document.getElementById(id); }
  function card(inner, cap) { return '<div class="card"><div class="scene">' + inner + "</div><small>" + cap + "</small></div>"; }
  function svg(inner, vb) { return '<svg viewBox="' + (vb || "0 0 400 280") + '" xmlns="http://www.w3.org/2000/svg">' + inner + "</svg>"; }

  var ui = [["#0062FF", "Akzent (wählbar)", "Bedienung, aktive Auswahl"], ["#0f172a", "Text", "Fließtext, Überschriften"], ["#5b6b82", "Gedämpft", "Nebentext, Überzeilen"], ["#f7f9fc", "Hintergrund", "Seitenfläche"], ["#10B981", "Erfolg", "nur Status"], ["#F59E0B", "Achtung", "nur Status"], ["#EF4444", "Kritisch", "nur Status"]];
  $("ui-colors").innerHTML = ui.map(function (c) { return '<div class="card"><div class="sw" style="background:' + c[0] + '"></div><small><b style="color:var(--fg)">' + c[1] + "</b> " + c[0] + "<br>" + c[2] + "</small></div>"; }).join("");
  var P = S ? S.pal : {};
  var ill = [["ink", "Kontur"], ["wall", "Wand"], ["floor", "Boden"], ["linen", "Bettwäsche"], ["gown", "Patientenhemd"], ["scrubs", "Pflegekleidung"], ["metal", "Metall"], ["wood", "Holz"]];
  $("ill-colors").innerHTML = ill.map(function (c) { return '<div class="card"><div class="sw" style="background:' + P[c[0]] + '"></div><small><b style="color:var(--fg)">' + c[1] + "</b> " + P[c[0]] + "</small></div>"; }).join("");

  var moods = ["neutral", "smile", "happy", "worried", "sad", "pain", "sleepy", "tired", "talk", "surprised", "angry"];
  var keys = Object.keys(L);
  $("faces").innerHTML = moods.map(function (m, i) {
    var k = keys[i % keys.length], e = L[k] || {};
    return "<figure>" + AV.svg({ hair: k, hairC: e.h, skin: e.s, cloth: e.c, bg: e.bg, wrinkles: i % 4 === 0 ? 1 : 0, glasses: i === 3 ? 1 : 0 }, m, m) + "<figcaption>" + m + "</figcaption></figure>";
  }).join("");

  var nurse = S.people.pflege, nurse2 = S.people.pflege2, pat = S.people.patient;
  function room() { return X.defs() + X.room({}); }
  var poses = [
    [room() + F.stand(nurse, 130, 250, { mood: "smile", pose: "down" }) + F.stand(nurse2, 280, 250, { mood: "neutral", pose: "down" }), "Stehen, entspannt (pose: down)"],
    [room() + F.stand(nurse, 130, 250, { mood: "smile", pose: "chart" }) + F.stand(nurse2, 280, 250, { mood: "talk", pose: "talk" }), "Übergabebogen (chart) und erklärende Geste (talk)"],
    [room() + F.stand(nurse, 140, 250, { mood: "smile", pose: "assist" }) + F.stand(nurse2, 280, 250, { mood: "neutral", pose: "reach" }), "Unterstützen (assist) und Hinreichen (reach)"],
    [room() + F.armchair(120, 210, { col: "#8fa7b8" }) + F.sitSide(pat, 120, 210, { mood: "worried", feet: "shoes" }) + F.sitFront(pat, 290, 200, { mood: "smile" }), "Sitzen seitlich und frontal"]
  ];
  $("poses").innerHTML = poses.map(function (p) { return card(svg(p[0]), p[1]); }).join("");

  var beds = [["semi", "worried", "Rückenteil 40° (semi)"], ["high", "smile", "Oberkörper hoch (high)"], ["flat", "sleepy", "Flach (flat)"]];
  $("beds").innerHTML = beds.map(function (b) { return card(svg(X.bedScene(pat, { pose: b[0], mood: b[1], monitor: b[0] === "semi" ? { v: {} } : null, iv: b[0] === "high" ? { x: 360 } : null })), b[2]); }).join("");

  var objs = ["ivpole", "walker", "trash", "nightstand", "chair", "monitor"], s = X.defs() + '<rect width="400" height="280" fill="#eef3f8"/><rect y="214" width="400" height="66" fill="#dbe5ef"/>';
  s += X.ivpole(40, {}) + X.walker(70, 170) + X.trash(160, 244) + X.nightstand(190, { y: 170 }) + X.chair(260, 174) + X.monitor(312, 40, {}, {});
  s += X.cup(208, 162) + X.glass(232, 162, 0.5) + X.bell(330, 236) + X.syringe(110, 40, 60, 0, 0.6, "nacl") + X.pills(150, 90) + X.clipboard(300, 140, 80, 70, "Plan", []);
  $("objects").innerHTML = svg(s);
  $("ward").innerHTML = S.ward();

  Array.prototype.forEach.call(document.querySelectorAll("[data-ball]"), function (b) { b.addEventListener("click", function () { $(b.getAttribute("data-ball")).classList.toggle("go"); }); });
})();
