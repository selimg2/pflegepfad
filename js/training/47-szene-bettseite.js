/* ===== Referenzszene: Puls tasten am Krankenbett =====
   Ein Patient liegt im Bett (Rückenteil 40°), eine Pflegekraft steht am Bett, legt zwei Finger an sein Handgelenk und hält kurz inne.
   Zeigt das ganze System: Raum, Bett, Patient, Figur, Gelenkmodell (X.ik2), Ebenenreihenfolge, Zeitleiste (FP_SCENE.timeline).
   Nutzung: FP_SCENE.bedside(containerElement, { mood: "smile" }) liefert eine Steuerung { play, pause, replay, seek, destroy }.
   Rein synthetische Personen. Keine fachliche Logik. */
(function () {
  var X = window.PXB, S = window.FP_SCENE, F = X && X.F;
  if (!X || !S || !F) return;

  /* Feste Geometrie der Szene (Ansicht 400 x 280) */
  var NURSE = { x: 292, y: 262, h: 188 };     /* Standpunkt der Füße, Körperhöhe */
  var DUR = 9;                                  /* Schleife in Sekunden */

  /* Ebenenreihenfolge (hinten nach vorn):
     1 Wand, Fenster, Wandversorgung  2 Nachttisch  3 Bett  4 Patient (Kissen, Hals, Rumpf, Kopf, Decke, Arm)
     5 Pflegekraft: ruhender Arm, Beine/Rumpf/Kopf, tätiger Arm  6 Randabdunklung */
  function build(o) {
    o = o || {};
    var pat = Object.assign({}, S.people.patient, o.patient || {}), nur = Object.assign({}, S.people.pflege, o.nurse || {});
    /* Pflegekraft: Körper ohne Arme, Arme kommen aus dem Gelenkmodell */
    var body = F.stand(nur, NURSE.x, NURSE.y, { h: NURSE.h, mood: o.nurseMood || "smile", pose: "down", arms: "none", tilt: -5 });
    var fig = X._fig; fig.shL = [fig.shL[0] + 5 * fig.sc, fig.shL[1] + 2]; fig.shR = [fig.shR[0] - 5 * fig.sc, fig.shR[1] + 2];
    var restFar = X.ik2(fig.shR, [fig.shR[0] + 5, fig.shR[1] + 66 * fig.sc], 38 * fig.sc, 36 * fig.sc, -1);
    var farArm = X.armSVG(restFar, { sleeve: nur.cloth, skin: nur.skin, sleeveFrac: 0.62, w1: 11, w2: 8, r: 5.2, side: "r", cls: "fp-arm-rest" });
    var nurseStr = farArm + body + '<g class="fp-arm-act"></g>' + '<g class="fp-pulse-at"></g>';
    var s = X.bedScene(pat, { pose: "semi", mood: o.mood || "smile", post: nurseStr, ns: X.glass(30, 172, 0.7), x: 72, len: 270 });
    return { svg: S.frame('<g class="fp-scene">' + s + "</g>", "0 0 400 280", o.label || "Eine Pflegekraft steht am Bett und tastet den Puls am Handgelenk eines Patienten, der im Bett mit erhöhtem Oberkörper liegt und lächelt."), shL: fig.shL, sc: fig.sc, cloth: nur.cloth, skin: nur.skin };
  }

  /* Zeitleiste "Puls tasten" (Sekunden):
     0,0 bis 1,4  Ruhe, beide atmen
     1,4 bis 2,8  Arm hebt sich vom Körper zum Handgelenk (sanft ein und aus)
     2,8 bis 3,1  Fingerspitzen setzen auf (kleines Nachgeben, 2 px)
     3,1 bis 6,6  Halten, Puls-Ring am Handgelenk
     6,6 bis 8,0  Arm löst sich und kehrt zurück
     8,0 bis 9,0  Ruhe, Schleife schließt ohne Sprung */
  function rig(host, parts, o) {
    var svg = host.querySelector("svg"), act = svg.querySelector(".fp-arm-act"), ring = svg.querySelector(".fp-pulse-at");
    var wrist = (function () {
      var a = X._arm, dx = a.h[0] - a.e[0], dy = a.h[1] - a.e[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
      return [a.h[0] - dx / l * 9, a.h[1] - dy / l * 9];
    })();
    var rest = [parts.shL[0] - 4, parts.shL[1] + 66 * parts.sc];
    var touch = [wrist[0] + 4, wrist[1] - 4];
    var K = {
      hand: [[0, rest], [1.4, rest, "hold"], [2.8, touch, "io"], [3.1, [touch[0], touch[1] + 2], "out"], [6.6, [touch[0], touch[1] + 2], "hold"], [8, rest, "io"], [9, rest, "hold"]],
      ring: [[0, 0], [3.1, 0, "hold"], [3.4, 1, "out"], [6.4, 1, "hold"], [6.7, 0, "out"], [9, 0, "hold"]]
    };
    var l1 = 38 * parts.sc, l2 = 36 * parts.sc;
    var ringOn = null;
    function draw(t) {
      var h = S.track(K.hand, t);
      var arm = X.ik2(parts.shL, h, l1, l2, 1);
      act.innerHTML = X.armSVG(arm, { sleeve: parts.cloth, skin: parts.skin, sleeveFrac: 0.62, w1: 11, w2: 8, r: 5.2, side: "l", cls: "fp-arm-live" });
      var on = S.track(K.ring, t) > 0.5;
      if (on !== ringOn) { ringOn = on; ring.innerHTML = on ? '<circle class="fp-pulse" cx="' + wrist[0] + '" cy="' + (wrist[1] + 1) + '" r="9" fill="none" stroke="#ef4444" stroke-width="2"/>' : ""; }
    }
    return S.timeline(host, { duration: DUR, draw: draw, stillAt: 4.5 });
  }

  /* Öffentlich: Szene in ein Element zeichnen und die Zeitleiste starten */
  S.bedside = function (host, o) {
    var b = build(o);
    host.innerHTML = b.svg;
    return rig(host, b, o);
  };
  S.bedsideSVG = function (o) { return build(o).svg; };
})();
