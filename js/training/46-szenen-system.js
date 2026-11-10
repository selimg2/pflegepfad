/* ===== Fallpfad Szenensystem =====
   Baukasten für Szenen im Stil der Patientengesichter (Regeln: DESIGN_SYSTEM.md).
   - Gleiche Kontur, gleiche Proportionen, gleiche Farbwelt wie PXAV (Gesichter), PXB (Raum, Bett, Objekte), PXB.F (Figuren).
   - Gelenkmodell: PXB.headNeck (Kopf sitzt mit dem Kinn auf dem Hals), PXB.ik2 (Zwei-Knochen-Arm), PXB.armSVG.
   - Szenen sind reine SVG-Strings. Bewegung kommt aus einer Zeitleiste (FP_SCENE.timeline): gleiche Zeit = gleiches Bild.
   - "Bewegung reduzieren": Szene zeigt ein ruhiges Standbild der Schlüsselpose, nichts läuft.
   Öffentlich: window.FP_SCENE = { pal, people, frame, ease, track, timeline } */
(function () {
  var X = window.PXB;
  if (!X || !X.F) return;
  var K = X.K || "#1d1d1f";

  /* Farbwelt der Szenen (Tokens, identisch mit css/08-system.css --ill-*) */
  var PAL = { ink: K, wall: "#eef3f8", floor: "#dbe5ef", linen: "#e6eef8", gown: "#9cc3e6", scrubs: "#2f4f7a", metal: "#b6c3d3", wood: "#e9dcc7", glass: "#d7ebfb" };

  /* Besetzung: wiederverwendbare synthetische Personen */
  var PEOPLE = {
    pflege: { hair: "LE", hairC: "#d9a441", skin: "#f6d2b3", cloth: PAL.scrubs, deco: "badge", bg: "#fff1d6" },
    pflege2: { hair: "TI", hairC: "#3b2a1e", skin: "#c98e66", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3" },
    patient: { hair: "HK", hairC: "#c9ccd1", skin: "#f6d2b3", cloth: PAL.gown, deco: "gown", bg: "#ddeeff", wrinkles: 1 }
  };

  function frame(inner, vb, label) {
    return '<svg viewBox="' + (vb || "0 0 400 280") + '" role="img" aria-label="' + (label || "") + '" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto">' + inner + "</svg>";
  }

  /* ---------- Zeitleiste ----------
     Ein Track ist eine Liste von Schlüsselbildern [zeit, wert, kurve?]. Werte sind Zahlen oder Zahlenlisten (Punkte).
     Kurven: "io" (sanft ein und aus, Standard), "out" (bremst am Ende), "hold" (springt nicht, hält den Wert). */
  var EASE = {
    io: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    lin: function (t) { return t; },
    hold: function () { return 0; }
  };
  function lerp(a, b, t) { if (typeof a === "number") return a + (b - a) * t; return a.map(function (v, i) { return v + (b[i] - v) * t; }); }
  function track(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (var i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        var k0 = keys[i - 1], k1 = keys[i], f = (t - k0[0]) / (k1[0] - k0[0] || 1);
        return lerp(k0[1], k1[1], (EASE[k1[2] || "io"] || EASE.io)(f));
      }
    }
    return keys[keys.length - 1][1];
  }

  /* Zeitleiste an ein Element binden: Schleife, nur sichtbar aktiv, Standbild bei "Bewegung reduzieren".
     draw(t) zeichnet den Zustand für Zeit t (Sekunden). stillAt = Zeitpunkt des Standbilds. */
  function timeline(el, o) {
    var dur = o.duration, raf = 0, t0 = 0, vis = true, paused = false, mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null, io = null, t = o.stillAt || 0;
    function reduced() { return !!(mq && mq.matches); }
    function frameFn(now) {
      raf = 0;
      if (!el.isConnected) return stop();
      if (!t0) t0 = now;
      t = ((now - t0) / 1000) % dur;
      o.draw(t);
      if (vis && !paused && !reduced() && !document.hidden) raf = requestAnimationFrame(frameFn);
    }
    function start() { if (raf || reduced() || paused) return; t0 = performance.now() - t * 1000; raf = requestAnimationFrame(frameFn); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    function sync() { if (reduced()) { stop(); o.draw(o.stillAt || 0); } else if (vis && !paused && !document.hidden) start(); else stop(); }
    if (window.IntersectionObserver) { io = new IntersectionObserver(function (e) { vis = e[0].isIntersecting; sync(); }, { threshold: 0.1 }); io.observe(el); }
    if (mq && mq.addEventListener) mq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    o.draw(o.stillAt || 0);
    sync();
    return {
      play: function () { paused = false; sync(); },
      pause: function () { paused = true; stop(); },
      seek: function (s) { t = s; o.draw(s); },
      replay: function () { t = 0; paused = false; t0 = 0; sync(); },
      destroy: function () { stop(); if (io) io.disconnect(); document.removeEventListener("visibilitychange", sync); }
    };
  }

  /* Bewegung der Szenen (einmalig eingefügt): Blinzeln und Atmen laufen als CSS, alles andere über die Zeitleiste */
  var css = ".fp-scene .pa-eyes{animation:fp-blink 5.6s linear infinite;transform-box:fill-box;transform-origin:50% 50%}" +
    ".fp-scene .pa-breathe{animation:fp-breathe 4.8s cubic-bezier(.2,0,0,1) infinite}" +
    ".fp-scene .fp-pulse{transform-box:fill-box;transform-origin:50% 50%;animation:fp-pulse 1.1s cubic-bezier(.2,0,0,1) infinite}" +
    "@keyframes fp-pulse{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.7);opacity:0}}" +
    "@media (prefers-reduced-motion:reduce){.fp-scene *{animation:none!important}}";
  var st = document.createElement("style"); st.id = "fp-scene-css"; st.textContent = css; (document.head || document.documentElement).appendChild(st);

  window.FP_SCENE = { pal: PAL, people: PEOPLE, frame: frame, ease: EASE, lerp: lerp, track: track, timeline: timeline };
})();
