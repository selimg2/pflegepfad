/* ===== Fallpfad Szenensystem =====
   Ein Baukasten für neue Szenen im Stil der Patientengesichter (siehe DESIGN_SYSTEM.md).
   - Gleiche Kontur (#1d1d1f), gleiche Proportionen, gleiche Farbwelt wie PXAV (Gesichter), PXB (Objekte), PXB.F (Figuren).
   - Szenen sind reine SVG-Strings, deterministisch (gleiche Eingabe = gleiches Bild), ohne Zufall.
   - Bewegung über Klassen: fp-breathe (Atmen), .pa-eyes (Blinzeln), fp-call (Rufanlage). Alles aus bei "Bewegung reduzieren".
   Öffentlich: window.FP_SCENE = { ward, pal, people, frame } */
(function () {
  var X = window.PXB, AV = window.PXAV;
  if (!X || !AV || !X.F) return;
  var K = X.K || "#1d1d1f";

  /* Farbwelt der Szenen (Tokens, identisch mit css/08-system.css --ill-*) */
  var PAL = { ink: K, wall: "#eef3f8", wall2: "#e4ecf5", floor: "#dbe5ef", floorLine: "#c6d4e3", linen: "#e6eef8", gown: "#9cc3e6", scrubs: "#2f4f7a", metal: "#b6c3d3", wood: "#e9dcc7", wood2: "#d9c7a8", glass: "#d7ebfb", call: "#f2b33d" };

  /* Besetzung: wiederverwendbare Personen (synthetisch), gleiche Merkmale wie in den Fällen */
  var PEOPLE = {
    pflege: { hair: "LE", hairC: "#d9a441", skin: "#f6d2b3", cloth: PAL.scrubs, deco: "badge", bg: "#fff1d6" },
    pflege2: { hair: "TI", hairC: "#3b2a1e", skin: "#c98e66", cloth: "#0e7490", deco: "scrubs", bg: "#e6f6f3" },
    patient: { hair: "HK", hairC: "#c9ccd1", skin: "#f6d2b3", cloth: PAL.gown, deco: "gown", bg: "#ddeeff", wrinkles: 1 }
  };

  function frame(inner, vb, label) {
    return '<svg viewBox="' + (vb || "0 0 400 220") + '" role="img" aria-label="' + (label || "") + '" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto">' + inner + "</svg>";
  }
  function door(x, y, nr, o) {
    o = o || {};
    var w = 58, hgt = 108, s = "";
    s += X.r(x - 4, y - 4, w + 8, hgt + 4, 5, PAL.wood2, 1.8);                  /* Zarge */
    s += X.r(x, y, w, hgt, 3, o.open ? "#c9d7e6" : PAL.wood, 1.8);               /* Türblatt */
    if (!o.open) {
      s += X.r(x + 12, y + 14, w - 24, 30, 3, PAL.glass, 1.4);                  /* Sichtfenster */
      s += X.p("M" + (x + 16) + " " + (y + 38) + "l10-10", "none", 0, ' stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"');
      s += X.r(x + w - 12, y + 58, 5, 14, 2.5, PAL.metal, 1.4);                  /* Griff */
    } else {
      /* offene Tür: Blick ins Zimmer, Fußende eines Bettes */
      s += X.r(x + 6, y + 70, w - 12, 18, 6, "#ffffff", 1.6) + X.r(x + 6, y + 64, 6, 30, 3, "#dfe8f2", 1.4);
      s += X.p("M" + (x + w) + " " + y + "l12 6v" + (hgt - 6) + "l-12 0z", PAL.wood, 1.8);
    }
    /* Zimmerschild */
    s += X.r(x + w / 2 - 15, y - 26, 30, 15, 4, "#ffffff", 1.5) + X.t(x + w / 2, y - 15, nr, { s: 9, w: 750, c: "#334155" });
    /* Rufanlage über der Tür */
    if (o.call) s += '<g class="fp-call">' + X.c(x + w / 2, y - 38, 8, PAL.call, 0, ' opacity=".28"') + "</g>" + X.r(x + w / 2 - 7, y - 42, 14, 7, 3.5, PAL.call, 1.4);
    else s += X.r(x + w / 2 - 7, y - 42, 14, 7, 3.5, "#e2e8f0", 1.4);
    return s;
  }
  function clock(x, y, hh, mm) {
    var ah = ((hh % 12) + mm / 60) * 30 - 90, am = mm * 6 - 90, rad = Math.PI / 180;
    return X.c(x, y, 15, "#ffffff", 1.8) + X.c(x, y, 1.6, K, 0) +
      X.l(x, y, x + Math.cos(ah * rad) * 7, y + Math.sin(ah * rad) * 7, K, 2.2) +
      X.l(x, y, x + Math.cos(am * rad) * 11, y + Math.sin(am * rad) * 11, K, 1.6);
  }
  function counter(x, y, w) {
    var s = "";
    s += X.r(x, y, w, 52, 6, "#f4f7fb", 1.8);                                      /* Theke */
    s += X.r(x - 4, y - 7, w + 8, 9, 4, PAL.wood, 1.8);                            /* Abdeckung */
    s += X.l(x + 10, y + 18, x + w - 10, y + 18, "#dbe4ee", 2);
    s += X.r(x + 14, y - 30, 34, 24, 3, "#1e293b", 1.6) + X.r(x + 17, y - 27, 28, 18, 2, "#93c5fd", 0) + X.l(x + 31, y - 6, x + 31, y - 1, K, 2); /* Bildschirm */
    s += X.r(x + w - 40, y - 15, 26, 9, 2, "#ffffff", 1.4) + X.r(x + w - 38, y - 22, 22, 8, 2, "#fde68a", 1.2); /* Akten */
    s += X.t(x + w / 2 + 4, y + 38, "Stützpunkt", { s: 9.5, w: 650, c: "#64748b" });
    return s;
  }

  /* Referenzszene: Stationsflur zu Schichtbeginn.
     Erzählt den Kern der Simulation: Zimmer, Rufanlage, Pflegekraft mit Übergabebogen, Stützpunkt, Uhrzeit. */
  function ward(o) {
    o = o || {};
    var fl = 176, s = "";
    s += '<rect width="400" height="220" fill="' + PAL.wall + '"/>';
    s += '<rect y="0" width="400" height="22" fill="' + PAL.wall2 + '"/>';                                   /* Deckenkante */
    [70, 200, 330].forEach(function (lx) { s += X.r(lx - 24, 8, 48, 6, 3, "#ffffff", 1.4); });                /* Deckenleuchten */
    s += '<rect y="' + fl + '" width="400" height="' + (220 - fl) + '" fill="' + PAL.floor + '"/>';
    s += X.l(0, fl, 400, fl, "#b3c3d6", 1.6);
    s += '<rect y="' + (fl - 6) + '" width="400" height="6" fill="#dfe8f2"/>';
    s += X.r(-4, 120, 408, 6, 3, PAL.wood, 1.6);                                                             /* Handlauf */
    s += door(18, 68, o.r1 || "510") + door(140, 68, o.r2 || "511", { call: o.call !== false }) + door(226, 68, o.r3 || "512", { open: true });
    s += clock(318, 52, o.hh == null ? 6 : o.hh, o.mm == null ? 30 : o.mm);
    /* Pflegekraft am Stützpunkt (hinter der Theke, nur Oberkörper sichtbar) */
    s += '<g class="fp-breathe">' + X.F.stand(PEOPLE.pflege2, 352, 176, { h: 150, mood: "smile", pose: "down" }) + "</g>";
    s += counter(296, 124, 104);
    /* Pflegekraft im Vordergrund mit Übergabebogen */
    s += X.sh(108, 207, 24, 4, 0.12);
    s += '<g class="fp-breathe">' + X.F.stand(PEOPLE.pflege, 108, 206, { h: 168, mood: "smile", pose: "chart" }) + "</g>";
    return frame('<g class="fp-scene">' + s + "</g>", "0 0 400 220", o.label || "Stationsflur zu Schichtbeginn: drei Zimmertüren, über Zimmer 511 leuchtet die Rufanlage, eine Pflegekraft mit Übergabebogen, eine Kollegin am Stützpunkt, die Uhr zeigt 6:30.");
  }

  /* Bewegung der Szenen (einmalig eingefügt) */
  var css = ".fp-scene .pa-eyes{animation:fp-blink 5.6s linear infinite;transform-box:fill-box;transform-origin:50% 50%}" +
    ".fp-scene .fp-breathe{transform-box:fill-box;transform-origin:50% 100%;animation:fp-breathe 4.8s cubic-bezier(.2,0,0,1) infinite}" +
    ".fp-scene .fp-breathe+.fp-breathe,.fp-scene .fp-breathe:nth-of-type(2){animation-delay:-2.1s}" +
    ".fp-scene .fp-call{animation:fp-call 2.4s ease-in-out infinite}" +
    "@keyframes fp-call{0%,100%{opacity:.25}50%{opacity:1}}" +
    ".st-ward{margin:-22px -22px 14px;border-bottom:1px solid var(--line);background:#eef3f8;overflow:hidden;border-radius:22px 22px 0 0}" +
    ".st-ward svg{display:block;width:auto;max-width:100%;height:auto;max-height:260px;margin:0 auto}" +
    "@media (prefers-reduced-motion:reduce){.fp-scene *{animation:none!important}}";
  var st = document.createElement("style"); st.id = "fp-scene-css"; st.textContent = css; (document.head || document.documentElement).appendChild(st);

  window.FP_SCENE = { ward: ward, pal: PAL, people: PEOPLE, frame: frame, door: door, clock: clock, counter: counter };
})();
