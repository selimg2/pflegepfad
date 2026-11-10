(function () {
  /* Training „Ruhig bleiben“: Stress und Prüfungsangst verstehen und bewältigen */
  var R = window.React; if (!R) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect, uR = R.useRef;
  function sess() { try { return JSON.parse(localStorage.getItem("fallpfad-session") || "null") || "gast"; } catch (e) { return "gast"; } }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var KEY = function () { return "fp-stress:" + sess(); };
  function used(tool) { var d = lsGet(KEY(), {}); d.tools = d.tools || {}; d.tools[tool] = (d.tools[tool] || 0) + 1; d.last = Date.now(); lsSet(KEY(), d); }
  function top() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} }
  function reduce() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  var IC = {
    lung: "M12 3v8M12 11c-2 0-3 2-3 4v4c0 1-1 2-2 2s-3-1-3-4c0-4 2-9 5-10M12 11c2 0 3 2 3 4v4c0 1 1 2 2 2s3-1 3-4c0-4-2-9-5-10",
    brain: "M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V3zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V3z",
    pen: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    muscle: "M4 15c2-6 6-9 9-9 2 0 3 1 3 3s-2 2-3 2M4 15c3 3 9 4 14 1 2-1 3-4 1-6",
    map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
    sos: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 7v6M12 17h.01",
    sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
    left: "M15 18l-6-6 6-6", right: "M9 6l6 6-6 6", check: "M5 12l5 5L20 7", play: "M7 4l13 8-13 8z", pause: "M7 4h4v16H7zM13 4h4v16h-4z", redo: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5", x: "M6 6l12 12M18 6L6 18"
  };
  function Ic(p) { return h("svg", { viewBox: "0 0 24 24", width: p.s || 20, height: p.s || 20, fill: "none", stroke: "currentColor", strokeWidth: p.w || 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("path", { d: IC[p.k] })); }
  function Src(p) { return h("p", { className: "rh-src" }, "Quellen: " + p.t); }

  /* ---------------- Inhalte ---------------- */
  var TOOLS = [
    { id: "atem", t: "Atem-Coach", d: "Zwei Atemmuster, die den Körper messbar herunterfahren. Mit Taktgeber.", ic: "lung", c: "#0EA5E9", z: "1 bis 5 Min.", wann: ["akut", "vorher"] },
    { id: "gedanken", t: "Gedanken-Check", d: "Katastrophengedanken prüfen und in hilfreiche Sätze umbauen.", ic: "brain", c: "#7C3AED", z: "5 Min.", wann: ["vorher", "alltag"] },
    { id: "schreiben", t: "Sorgen-Parkplatz", d: "Zehn Minuten Sorgen aufschreiben, bevor es losgeht. Wird nirgends gespeichert.", ic: "pen", c: "#DB2777", z: "10 Min.", wann: ["vorher"] },
    { id: "umdeuten", t: "Aufregung umdeuten", d: "Herzklopfen als Energie nutzen statt dagegen zu kämpfen.", ic: "sun", c: "#F59E0B", z: "2 Min.", wann: ["akut", "vorher"] },
    { id: "erden", t: "5-4-3-2-1 Erden", d: "Mit den Sinnen zurück ins Hier und Jetzt, wenn das Gedankenkarussell dreht.", ic: "eye", c: "#059669", z: "2 Min.", wann: ["akut", "alltag"] },
    { id: "pmr", t: "Muskeln lockern", d: "Kurzform der Progressiven Muskelentspannung, auch im Stationszimmer möglich.", ic: "muscle", c: "#EA580C", z: "4 Min.", wann: ["alltag", "vorher"] },
    { id: "plan", t: "Wenn-dann-Plan", d: "Deinen persönlichen Plan für Prüfungstag und Blackout erstellen.", ic: "map", c: "#0062FF", z: "8 Min.", wann: ["vorher"] },
    { id: "abschalten", t: "Feierabend-Schalter", d: "Nach dem Dienst wirklich abschalten: vier Wege, die Erholung belegen.", ic: "shield", c: "#0D9488", z: "5 Min.", wann: ["alltag"] }
  ];

  /* ---------------- Atem-Coach ---------------- */
  var MUSTER = {
    seufzer: { t: "Zyklisches Seufzen", d: "Durch die Nase einatmen, kurz ein zweites Mal nachatmen, dann lange durch den Mund ausatmen.", ph: [["Einatmen", 2, 1], ["Nachatmen", 1, 1.12], ["Lang ausatmen", 6, 0]] },
    ruhig: { t: "Ruhiges Atmen 4–6", d: "Vier Sekunden ein, sechs Sekunden aus. Das längere Ausatmen aktiviert den Parasympathikus.", ph: [["Einatmen", 4, 1], ["Ausatmen", 6, 0]] }
  };
  function Atem() {
    var mu = uS("seufzer"), dur = uS(180), run = uS(false), left = uS(180), ph = uS(0), tick = uS(0), done = uS(false);
    var M = MUSTER[mu[0]];
    uE(function () {
      if (!run[0]) return;
      var t = setInterval(function () { tick[1](function (x) { return x + 1; }); left[1](function (x) { if (x <= 1) { run[1](false); done[1](true); used("atem"); return 0; } return x - 1; }); }, 1000);
      return function () { clearInterval(t); };
    }, [run[0]]);
    // Phase aus vergangener Zeit berechnen
    var cyc = M.ph.reduce(function (a, p) { return a + p[1]; }, 0), el = (dur[0] - left[0]) % cyc, acc = 0, cur = M.ph[0], rest = 0;
    for (var i = 0; i < M.ph.length; i++) { if (el < acc + M.ph[i][1]) { cur = M.ph[i]; rest = acc + M.ph[i][1] - el; break; } acc += M.ph[i][1]; }
    var scale = run[0] ? (cur[2] === 0 ? 0.62 : cur[2] === 1 ? 0.94 : 1) : 0.7;
    var trans = run[0] ? cur[1] + "s" : ".6s";
    return h("div", { className: "rh-tool" },
      h("div", { className: "rh-seg", role: "group", "aria-label": "Atemmuster" }, Object.keys(MUSTER).map(function (k) {
        return h("button", { key: k, type: "button", "aria-pressed": mu[0] === k, disabled: run[0], onClick: function () { mu[1](k); } }, MUSTER[k].t);
      })),
      h("p", { className: "muted" }, M.d),
      h("div", { className: "rh-breath", "aria-live": "polite" },
        h("svg", { className: "rh-arc", viewBox: "0 0 200 200", "aria-hidden": "true" }, h("circle", { cx: 100, cy: 100, r: 94, className: "trk" }), h("circle", { cx: 100, cy: 100, r: 94, className: "val", style: { strokeDashoffset: 590.6 * (1 - (dur[0] - left[0]) / dur[0]) } })),
        h("div", { className: "rh-orb", style: { transform: "scale(" + scale + ")", transitionDuration: trans } }),
        h("div", { className: "rh-orb-t" }, run[0] ? h(R.Fragment, null, h("b", null, cur[0]), h("span", null, Math.ceil(rest) + " s")) : done[0] ? h("b", null, "Gut gemacht") : h("b", null, "Bereit?"))),
      h("div", { className: "rh-row" },
        h("div", { className: "rh-seg sm", role: "group", "aria-label": "Dauer" }, [60, 180, 300].map(function (s) {
          return h("button", { key: s, type: "button", "aria-pressed": dur[0] === s, disabled: run[0], onClick: function () { dur[1](s); left[1](s); done[1](false); } }, s / 60 + " Min.");
        })),
        h("span", { className: "rh-time" }, Math.floor(left[0] / 60) + ":" + ("0" + left[0] % 60).slice(-2)),
        h("button", { type: "button", className: "btn", onClick: function () { if (!run[0] && left[0] === 0) left[1](dur[0]); done[1](false); run[1](!run[0]); } }, h(Ic, { k: run[0] ? "pause" : "play", s: 16 }), run[0] ? "Pause" : left[0] === 0 ? "Noch einmal" : "Start")),
      h("div", { className: "rh-know" },
        h("b", null, "Warum das wirkt"),
        h("p", null, "Beim Ausatmen sinkt die Herzfrequenz leicht, beim Einatmen steigt sie. Wer länger aus- als einatmet, verschiebt das vegetative Nervensystem Richtung Ruhe. In einer randomisierten Studie verbesserte tägliches zyklisches Seufzen über fünf Minuten die Stimmung und senkte die Atemfrequenz in Ruhe stärker als eine Achtsamkeitsmeditation gleicher Dauer."),
        h("p", null, "Tipp für die Prüfung: Zwei bis drei Seufzer reichen oft schon, wenn du merkst, dass dein Herz rast. Niemand bemerkt es."),
        h(Src, { t: "Balban, M. Y. et al. (2023). Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine 4(1), 100895; Zaccaro, A. et al. (2018). How breath-control can change your life. Frontiers in Human Neuroscience 12, 353." })));
  }

  /* ---------------- Gedanken-Check ---------------- */
  var GED = [
    { g: "Ich falle sowieso durch.", f: "Katastrophisieren", fr: ["Was spricht dafür, was dagegen? Welche Prüfungen hast du schon bestanden?", "Was würdest du einer Freundin mit diesem Gedanken sagen?", "Was wäre das Schlimmste, das Wahrscheinlichste, das Beste?"], a: "Ich habe mich vorbereitet und schon schwierige Situationen gemeistert. Auch wenn ich nicht alles weiß, kann ich viele Punkte holen." },
    { g: "Wenn ich mich verhaspele, halten mich alle für unfähig.", f: "Gedankenlesen", fr: ["Woher weißt du, was andere denken?", "Wie bewertest du selbst andere, die sich kurz verhaspeln?", "Was sagen Prüferinnen und Prüfer typischerweise, wenn jemand neu ansetzt?"], a: "Verhaspeln ist normal. Prüfende achten auf Inhalt und Begründung. Ich darf neu ansetzen: ‚Ich formuliere das noch einmal.‘" },
    { g: "Ich habe einen Fehler bei Frau K. gemacht. Ich bin keine gute Pflegekraft.", f: "Verallgemeinern", fr: ["Ist ein einzelner Fehler ein Beweis für ‚immer‘ oder ‚nie‘?", "Was hast du richtig gemacht, nachdem du den Fehler bemerkt hast?", "Was lernst du daraus für das nächste Mal?"], a: "Ich habe einen Fehler gemacht, ihn bemerkt und gemeldet. Das ist professionell. Ich lerne daraus, und das macht mich sicherer." },
    { g: "Ich muss alles perfekt können, sonst reicht es nicht.", f: "Alles-oder-nichts", fr: ["Wie viel Prozent brauchst du wirklich zum Bestehen?", "Kennst du jemanden, der alles perfekt kann?", "Was passiert, wenn du dir 80 % statt 100 % als Ziel setzt?"], a: "Ich muss nicht alles wissen. Ich konzentriere mich auf das Wichtige und gebe mein Bestes. Gut ist gut genug." },
    { g: "Alle anderen sind viel weiter als ich.", f: "Vergleichen", fr: ["Siehst du bei den anderen ihr Lernen oder nur ihr Reden darüber?", "Womit vergleichst du dich: mit deinem Stand von vor drei Monaten?", "Was hast du in dieser Zeit dazugelernt?"], a: "Jede und jeder lernt anders. Ich vergleiche mich mit meinem eigenen Stand von gestern, und da bin ich weiter." }
  ];
  function Gedanken() {
    var sel = uS(null), step = uS(0), eig = uS(""), neu = uS("");
    if (sel[0] == null) return h("div", { className: "rh-tool" },
      h("p", null, "Prüfungsangst hat zwei Seiten: die Aufregung im Körper und die Besorgnis im Kopf. Vor allem die Sorgengedanken kosten Leistung, weil sie Arbeitsgedächtnis belegen, das du für die Aufgaben brauchst. Wähle einen Gedanken, der dir bekannt vorkommt, oder schreib deinen eigenen."),
      h("div", { className: "rh-chips" }, GED.map(function (x, i) { return h("button", { key: i, type: "button", className: "rh-chip", onClick: function () { sel[1](i); step[1](0); } }, "„" + x.g + "“"); })),
      h("form", { className: "rh-own", onSubmit: function (e) { e.preventDefault(); if (eig[0].trim()) { sel[1](-1); step[1](0); } } },
        h("input", { className: "input", value: eig[0], onChange: function (e) { eig[1](e.target.value); }, placeholder: "Mein eigener Gedanke …", "aria-label": "Eigener Gedanke" }),
        h("button", { type: "submit", className: "btn ghost", disabled: !eig[0].trim() }, "Prüfen")),
      h(Src, { t: "Liebert, R. M. & Morris, L. W. (1967). Psychological Reports 20, 975–978; Eysenck, M. W. et al. (2007). Anxiety and cognitive performance: Attentional control theory. Emotion 7, 336–353; Beck, J. S. (2021). Cognitive Behavior Therapy. 3rd ed., Guilford." }));
    var x = sel[0] >= 0 ? GED[sel[0]] : { g: eig[0], f: null, fr: ["Was spricht dafür, was dagegen?", "Was würdest du einer guten Freundin sagen, die so denkt?", "Was ist realistisch das Wahrscheinlichste, und was kannst du jetzt tun?"], a: null };
    return h("div", { className: "rh-tool" },
      h("button", { type: "button", className: "skip back", onClick: function () { sel[1](null); neu[1](""); } }, h(Ic, { k: "left", s: 16 }), "Anderer Gedanke"),
      h("div", { className: "rh-thought" }, h("span", null, "Gedanke"), h("q", null, x.g)),
      x.f ? h("p", null, h("b", null, "Denkfalle: "), x.f) : null,
      h("ol", { className: "rh-steps" }, x.fr.map(function (q, i) {
        return h("li", { key: i, className: i <= step[0] ? "on" : "" }, i <= step[0] ? q : "…");
      })),
      step[0] < x.fr.length - 1 ? h("button", { type: "button", className: "btn ghost", onClick: function () { step[1](step[0] + 1); } }, "Nächste Frage") :
        h("div", { className: "rh-alt" },
          h("label", null, h("b", null, "Dein hilfreicher Satz"), h("textarea", { className: "input", rows: 3, value: neu[0], onChange: function (e) { neu[1](e.target.value); }, placeholder: "Formuliere einen realistischen, freundlichen Satz für dich …" })),
          x.a ? h("details", null, h("summary", null, "Beispiel ansehen"), h("p", null, "„" + x.a + "“")) : null,
          h("button", { type: "button", className: "btn", disabled: !neu[0].trim(), onClick: function () { var d = lsGet(KEY(), {}); d.saetze = [neu[0].trim()].concat(d.saetze || []).slice(0, 8); lsSet(KEY(), d); used("gedanken"); sel[1](null); neu[1](""); } }, "In meine Sätze übernehmen")),
      h(Saetze));
  }
  function Saetze() {
    var d = lsGet(KEY(), {}), s = d.saetze || [];
    if (!s.length) return null;
    return h("div", { className: "rh-know" }, h("b", null, "Deine Sätze für schwierige Momente"), h("ul", null, s.map(function (t, i) { return h("li", { key: i }, t); })), h("p", { className: "muted", style: { fontSize: 13 } }, "Nur auf diesem Gerät gespeichert. Tipp: Schreib einen davon auf einen Zettel für die Federmappe."));
  }

  /* ---------------- Sorgen-Parkplatz ---------------- */
  function Schreiben() {
    var txt = uS(""), run = uS(false), left = uS(600), shred = uS(false), fin = uS(false);
    uE(function () { if (!run[0]) return; var t = setInterval(function () { left[1](function (x) { if (x <= 1) { run[1](false); fin[1](true); return 0; } return x - 1; }); }, 1000); return function () { clearInterval(t); }; }, [run[0]]);
    function weg() { shred[1](true); used("schreiben"); setTimeout(function () { txt[1](""); shred[1](false); fin[1](false); left[1](600); }, reduce() ? 50 : 1100); }
    return h("div", { className: "rh-tool" },
      h("p", null, "Schreib zehn Minuten lang ohne Pause auf, was dich an der Prüfung beunruhigt: Gedanken, Gefühle, Befürchtungen. Rechtschreibung egal. In einer Studie im Fachjournal Science schnitten ängstliche Lernende, die das direkt vor einer Prüfung taten, deutlich besser ab als Lernende, die still saßen. Die Sorgen belegen danach weniger Arbeitsgedächtnis."),
      h("div", { className: "rh-row" }, h("span", { className: "rh-time" }, Math.floor(left[0] / 60) + ":" + ("0" + left[0] % 60).slice(-2)),
        h("button", { type: "button", className: "btn ghost sm", onClick: function () { run[1](!run[0]); } }, h(Ic, { k: run[0] ? "pause" : "play", s: 14 }), run[0] ? "Pause" : "Timer starten")),
      h("div", { className: "rh-paper" + (shred[0] ? " shred" : "") },
        h("textarea", { value: txt[0], rows: 9, onChange: function (e) { txt[1](e.target.value); if (!run[0] && left[0] === 600 && e.target.value.length === 1) run[1](true); }, placeholder: "Was mir gerade durch den Kopf geht …", "aria-label": "Sorgen aufschreiben" })),
      h("div", { className: "rh-row" },
        h("span", { className: "muted", style: { fontSize: 13 } }, "Dein Text wird nicht gespeichert und nicht übertragen."),
        h("button", { type: "button", className: "btn", disabled: !txt[0].trim(), onClick: weg }, fin[0] ? "Fertig, Zettel zerreißen" : "Zettel zerreißen")),
      h(Src, { t: "Ramirez, G. & Beilock, S. L. (2011). Writing about testing worries boosts exam performance in the classroom. Science 331, 211–213; Pennebaker, J. W. & Smyth, J. M. (2016). Opening Up by Writing It Down. Guilford." }));
  }

  /* ---------------- Aufregung umdeuten ---------------- */
  function Umdeuten() {
    var st = uS(0);
    var S = [
      ["Spür hin", "Wo merkst du die Aufregung gerade? Herzklopfen, flauer Magen, feuchte Hände, schnelle Atmung?"],
      ["Benennen", "Sag dir innerlich: ‚Das ist mein Körper, der Energie bereitstellt.‘ Das Herz pumpt mehr Blut ins Gehirn, die Sinne werden schärfer."],
      ["Umdeuten", "Sag dir, am besten halblaut: ‚Ich bin aufgeregt, und das ist gut. Mein Körper macht sich bereit.‘ Nicht: ‚Ich muss ruhig bleiben.‘"],
      ["Mit Abstand sprechen", "Sprich dich mit deinem Namen oder mit ‚du‘ an: ‚Du schaffst das, Lea. Du hast das geübt.‘ Das schafft innere Distanz zur Angst."]
    ];
    return h("div", { className: "rh-tool" },
      h("p", null, "Wer versucht, sich vor einer Prüfung zwanghaft zu beruhigen, kämpft gegen den eigenen Körper. Erfolgreicher ist oft, die Erregung als Energie zu deuten. In Experimenten schnitten Menschen, die sich sagten ‚Ich bin aufgeregt‘ statt ‚Ich bin ruhig‘, bei Reden, Mathetests und Gesang besser ab."),
      h("div", { className: "rh-cards4" }, S.map(function (x, i) {
        return h("button", { key: i, type: "button", className: "rh-c4" + (i <= st[0] ? " on" : ""), onClick: function () { st[1](i); if (i === S.length - 1) used("umdeuten"); } }, h("i", null, i + 1), h("b", null, x[0]), i <= st[0] ? h("span", null, x[1]) : h("span", { className: "muted" }, "Antippen"));
      })),
      h("div", { className: "rh-know" }, h("b", null, "Grenze"), h("p", null, "Umdeuten hilft bei normaler Aufregung. Bei Panikattacken oder Angst, die dich über Wochen lähmt, ist professionelle Unterstützung der richtige Weg (siehe ‚Wann Hilfe holen‘).")),
      h(Src, { t: "Jamieson, J. P. et al. (2010). Turning the knots in your stomach into bows. Journal of Experimental Social Psychology 46, 208–212; Brooks, A. W. (2014). Get excited: Reappraising pre-performance anxiety as excitement. Journal of Experimental Psychology: General 143, 1144–1158; Kross, E. et al. (2014). Self-talk as a regulatory mechanism. Journal of Personality and Social Psychology 106, 304–324." }));
  }

  /* ---------------- 5-4-3-2-1 ---------------- */
  function Erden() {
    var S = [[5, "Dinge, die du siehst", "zum Beispiel das Fensterkreuz, deinen Stift, eine Farbe an der Wand"], [4, "Dinge, die du spürst", "die Füße auf dem Boden, den Stuhl im Rücken, den Stoff der Kleidung"], [3, "Dinge, die du hörst", "das Summen der Lüftung, Schritte im Flur, deinen Atem"], [2, "Dinge, die du riechst", "Kaffee, Desinfektionsmittel, deine Handcreme"], [1, "Ding, das du schmeckst", "oder einen tiefen, langsamen Atemzug"]];
    var st = uS(0), cnt = uS(0);
    var x = S[Math.min(st[0], 4)], fin = st[0] >= 5;
    return h("div", { className: "rh-tool" },
      h("p", null, "Wenn das Gedankenkarussell dreht, holt diese Übung die Aufmerksamkeit über die Sinne zurück in den Moment. Sie ist eine verbreitete Erdungstechnik aus der Angstbewältigung und funktioniert überall, auch im Prüfungsraum oder auf dem Stationsflur."),
      fin ? h("div", { className: "rh-big" }, h(Ic, { k: "check", s: 40 }), h("b", null, "Du bist wieder hier."), h("button", { type: "button", className: "btn ghost", onClick: function () { st[1](0); cnt[1](0); } }, "Noch einmal")) :
        h("div", { className: "rh-big" },
          h("div", { className: "rh-num" }, x[0]), h("b", null, x[1]), h("span", { className: "muted" }, x[2]),
          h("div", { className: "rh-dots" }, Array.apply(null, Array(x[0])).map(function (_, i) { return h("button", { key: i, type: "button", className: i < cnt[0] ? "on" : "", "aria-label": "Gefunden " + (i + 1), onClick: function () { var n = cnt[0] + 1; if (n >= x[0]) { cnt[1](0); st[1](st[0] + 1); if (st[0] + 1 >= 5) used("erden"); } else cnt[1](n); } }); })),
          h("small", { className: "muted" }, "Tippe für jedes Ding, das du gefunden hast, auf einen Punkt.")));
  }

  /* ---------------- PMR ---------------- */
  var PMR = [["Hände und Unterarme", "Mach Fäuste und spanne die Unterarme an."], ["Oberarme", "Drück die Ellenbogen fest an den Körper."], ["Schultern und Nacken", "Zieh die Schultern Richtung Ohren."], ["Gesicht", "Kneif die Augen zusammen und press die Lippen aufeinander."], ["Bauch", "Spann den Bauch an, als würde gleich jemand dagegen drücken."], ["Beine und Füße", "Drück die Fersen in den Boden und zieh die Zehen hoch."]];
  function Pmr() {
    var i = uS(-1), ph = uS("an"), sec = uS(0);
    uE(function () {
      if (i[0] < 0 || i[0] >= PMR.length) return;
      var t = setInterval(function () {
        sec[1](function (s) {
          var lim = ph[0] === "an" ? 7 : 25;
          if (s + 1 >= lim) {
            if (ph[0] === "an") { ph[1]("los"); } else { ph[1]("an"); i[1](function (x) { if (x + 1 >= PMR.length) used("pmr"); return x + 1; }); }
            return 0;
          }
          return s + 1;
        });
      }, 1000);
      return function () { clearInterval(t); };
    }, [i[0], ph[0]]);
    var on = i[0] >= 0 && i[0] < PMR.length, x = on ? PMR[i[0]] : null;
    return h("div", { className: "rh-tool" },
      h("p", null, "Bei der Progressiven Muskelentspannung nach Jacobson spannst du eine Muskelgruppe etwa sieben Sekunden an und lässt dann bewusst los. Den Unterschied zu spüren, entspannt den ganzen Körper. Regelmäßig geübt, wirkt sie nachweislich gegen Stress und Angst. Die Kurzform dauert gut drei Minuten."),
      on ? h("div", { className: "rh-big pmr " + ph[0] },
        h("small", { className: "muted" }, (i[0] + 1) + " von " + PMR.length),
        h("b", null, x[0]),
        h("div", { className: "rh-pmr" },
          h("svg", { className: "rh-arc", viewBox: "0 0 200 200", "aria-hidden": "true" }, h("circle", { cx: 100, cy: 100, r: 94, className: "trk" }), h("circle", { cx: 100, cy: 100, r: 94, className: "val", style: { strokeDashoffset: 590.6 * (sec[0] / (ph[0] === "an" ? 7 : 25)) } })),
          h("div", { className: "rh-pmr-t" }, h("span", null, ph[0] === "an" ? "Anspannen" : "Loslassen"), h("i", null, (ph[0] === "an" ? 7 : 25) - sec[0]))),
        h("span", null, ph[0] === "an" ? x[1] : "Lass los und spür nach, wie die Muskeln weich und warm werden. Atme ruhig weiter."),
        h("button", { type: "button", className: "btn ghost sm", onClick: function () { i[1](-1); ph[1]("an"); sec[1](0); } }, "Abbrechen")) :
        h("div", { className: "rh-big" }, i[0] >= PMR.length ? h(R.Fragment, null, h(Ic, { k: "check", s: 40 }), h("b", null, "Fertig. Spür noch einen Moment nach.")) : null,
          h("button", { type: "button", className: "btn", onClick: function () { i[1](0); ph[1]("an"); sec[1](0); } }, h(Ic, { k: "play", s: 16 }), i[0] >= PMR.length ? "Noch einmal" : "Anleitung starten")),
      h("p", { className: "muted", style: { fontSize: 13 } }, "Bei Schmerzen oder Verletzungen eine Muskelgruppe auslassen oder nur sanft anspannen."),
      h(Src, { t: "Jacobson, E. (1938). Progressive Relaxation. University of Chicago Press; Manzoni, G. M. et al. (2008). Relaxation training for anxiety: a ten-years systematic review with meta-analysis. BMC Psychiatry 8, 41." }));
  }

  /* ---------------- Wenn-dann-Plan ---------------- */
  var WENN = [
    ["Ich wache am Prüfungstag mit Herzklopfen auf", ["mache ich drei zyklische Seufzer und sage mir: ‚Mein Körper macht sich bereit.‘", "stehe ich sofort auf und mache meine Morgenroutine wie immer."]],
    ["Ich habe einen Blackout bei einer Frage", ["lege ich den Stift ab, atme zweimal lang aus und gehe zur nächsten Frage. Ich komme später zurück.", "schreibe ich Stichworte auf, die mir zum Thema einfallen, auch wenn sie unsortiert sind."]],
    ["In der mündlichen Prüfung fällt mir ein Begriff nicht ein", ["sage ich: ‚Mir fällt der Fachbegriff gerade nicht ein. Ich beschreibe es.‘ und erkläre es in eigenen Worten.", "bitte ich um einen Moment Bedenkzeit und strukturiere meine Antwort laut."]],
    ["Vor dem Prüfungsraum reden andere über Themen, die ich nicht kann", ["setze ich Kopfhörer auf oder gehe ein paar Schritte weg.", "lese ich meinen hilfreichen Satz auf meinem Zettel."]],
    ["Ich merke im praktischen Examen, dass ich einen Fehler gemacht habe", ["benenne ich ihn ruhig, korrigiere ihn und begründe mein weiteres Vorgehen. Fehler zu erkennen ist eine Kompetenz.", "atme ich einmal lang aus und sage mir: ‚Weiter, Schritt für Schritt.‘"]],
    ["Am Abend vorher kann ich nicht einschlafen", ["stehe ich nach 20 Minuten auf, lese etwas Leichtes bei gedimmtem Licht und lege mich wieder hin.", "sage ich mir: ‚Auch mit weniger Schlaf kann ich gut abschneiden. Ruhen ist schon Erholung.‘"]]
  ];
  function Plan() {
    var d = lsGet(KEY(), {}), init = d.plan || {}, pl = uS(init), cp = uS("");
    function set(i, v) { var n = Object.assign({}, pl[0]); n[i] = v; pl[1](n); var dd = lsGet(KEY(), {}); dd.plan = n; lsSet(KEY(), dd); }
    var txt = WENN.map(function (w, i) { return pl[0][i] ? "Wenn " + w[0].charAt(0).toLowerCase() + w[0].slice(1) + ", dann " + pl[0][i] : null; }).filter(Boolean);
    return h("div", { className: "rh-tool" },
      h("p", null, "Wenn-dann-Pläne verknüpfen eine schwierige Situation fest mit einer Reaktion. Dein Gehirn muss im Stress nicht mehr entscheiden, es führt den Plan einfach aus. Eine Metaanalyse mit über 8000 Teilnehmenden zeigte einen mittleren bis großen Effekt auf das Erreichen von Zielen."),
      h("div", { className: "rh-plan" }, WENN.map(function (w, i) {
        return h("div", { key: i, className: "rh-pl" },
          h("b", null, "Wenn ", w[0].charAt(0).toLowerCase() + w[0].slice(1), " …"),
          h("div", { className: "rh-plo" }, w[1].map(function (o, j) { return h("button", { key: j, type: "button", "aria-pressed": pl[0][i] === o, onClick: function () { set(i, pl[0][i] === o ? null : o); } }, "… dann ", o); })),
          h("input", { className: "input", placeholder: "… oder dann mache ich (eigene Idee)", value: pl[0][i] && w[1].indexOf(pl[0][i]) < 0 ? pl[0][i] : "", onChange: function (e) { set(i, e.target.value || null); } }));
      })),
      txt.length ? h("div", { className: "rh-know" }, h("b", null, "Mein Plan"), h("ul", null, txt.map(function (t, i) { return h("li", { key: i }, t); })),
        h("button", { type: "button", className: "btn ghost sm", onClick: function () { var s = "Mein Wenn-dann-Plan für die Prüfung\n\n" + txt.join("\n"); try { navigator.clipboard.writeText(s).then(function () { cp[1]("Kopiert."); used("plan"); }); } catch (e) { cp[1]("Kopieren nicht möglich."); } } }, "Plan kopieren"), cp[0] ? h("span", { className: "muted", style: { marginLeft: 8 } }, cp[0]) : null) : null,
      h(Src, { t: "Gollwitzer, P. M. & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology 38, 69–119; Oettingen, G. (2014). Rethinking Positive Thinking. Current." }));
  }

  /* ---------------- Feierabend-Schalter ---------------- */
  function Abschalten() {
    var W = [
      ["Abstand", "Gedanklich wirklich weg von der Arbeit. Hilft: ein festes Ritual beim Umziehen oder auf dem Heimweg, zum Beispiel ‚Drei Dinge, die heute gut waren, eins, das ich morgen kläre, dann Tür zu‘."],
      ["Entspannung", "Etwas, das den Körper herunterfährt: Musik, Baden, langsames Gehen, Atemübung."],
      ["Neues meistern", "Etwas, das nichts mit Pflege zu tun hat und kleine Erfolgserlebnisse bringt: Instrument, Sport, Kochen, Sprache."],
      ["Selbstbestimmung", "Bewusst selbst entscheiden, was du mit der freien Zeit machst, statt nur zu reagieren."]
    ];
    var ch = uS(lsGet(KEY(), {}).fa || {});
    function tog(i) { var n = Object.assign({}, ch[0]); n[i] = !n[i]; ch[1](n); var d = lsGet(KEY(), {}); d.fa = n; lsSet(KEY(), d); if (n[i]) used("abschalten"); }
    return h("div", { className: "rh-tool" },
      h("p", null, "Erholung entsteht nicht automatisch, sobald der Dienst vorbei ist. Die Arbeitspsychologie unterscheidet vier Erholungserfahrungen. Wer sie regelmäßig erlebt, ist am nächsten Tag weniger erschöpft. Hake ab, was du diese Woche einbauen willst."),
      h("div", { className: "rh-cards4" }, W.map(function (x, i) { return h("button", { key: i, type: "button", className: "rh-c4 on" + (ch[0][i] ? " sel" : ""), "aria-pressed": !!ch[0][i], onClick: function () { tog(i); } }, h("i", null, ch[0][i] ? h(Ic, { k: "check", s: 14, w: 3 }) : i + 1), h("b", null, x[0]), h("span", null, x[1])); })),
      h("div", { className: "rh-know" }, h("b", null, "Nach belastenden Diensten"),
        h("p", null, "Nach einem Notfall, einem Todesfall oder Gewalt ist es normal, die Bilder noch Tage im Kopf zu haben. Sprich mit der Praxisanleitung oder Kolleginnen und Kollegen. Viele Häuser bieten kollegiale Erstbetreuung oder Supervision an. Halten Schlafprobleme, Bilder oder Anspannung länger als etwa vier Wochen an, hol dir professionelle Hilfe.")),
      h(Src, { t: "Sonnentag, S. & Fritz, C. (2007). The Recovery Experience Questionnaire. Journal of Occupational Health Psychology 12, 204–221; Neff, K. D. (2003). Self-compassion. Self and Identity 2, 85–101; Bundesamt für Bevölkerungsschutz und Katastrophenhilfe (2012). Psychosoziale Notfallversorgung: Qualitätsstandards und Leitlinien." }));
  }

  var VIEWS = { atem: Atem, gedanken: Gedanken, schreiben: Schreiben, umdeuten: Umdeuten, erden: Erden, pmr: Pmr, plan: Plan, abschalten: Abschalten };

  /* ---------------- Stress-Check ---------------- */
  var CHECKQ = [
    ["koerper", "Ich spüre Herzklopfen, Anspannung oder einen flauen Magen."],
    ["kopf", "Meine Gedanken kreisen um das, was schiefgehen könnte."],
    ["schlaf", "Ich schlafe schlechter als sonst."],
    ["aufschieben", "Ich schiebe das Lernen vor mir her."],
    ["abschalten", "Ich kann nach dem Dienst schlecht abschalten."]
  ];
  var REC = { koerper: ["atem", "umdeuten", "pmr"], kopf: ["gedanken", "schreiben", "erden"], schlaf: ["pmr", "abschalten"], aufschieben: ["plan"], abschalten: ["abschalten", "atem"] };
  function Check(p) {
    var v = uS({}), shown = uS(false);
    var n = Object.keys(v[0]).length, rec = {};
    Object.keys(v[0]).forEach(function (k) { if (v[0][k] >= 2) REC[k].forEach(function (t, i) { rec[t] = (rec[t] || 0) + v[0][k] * (3 - i); }); });
    var top3 = Object.keys(rec).sort(function (a, b) { return rec[b] - rec[a]; }).slice(0, 3);
    var sum = Object.keys(v[0]).reduce(function (a, k) { return a + v[0][k]; }, 0);
    return h("div", { className: "card rh-check" },
      h("div", { className: "rh-hd" }, h("span", { className: "eyebrow" }, "Stress-Check · 1 Minute"), h("h3", null, "Wie geht es dir gerade?")),
      CHECKQ.map(function (q) {
        return h("div", { key: q[0], className: "rh-q" }, h("span", null, q[1]),
          h("div", { className: "rh-scale", role: "radiogroup", "aria-label": q[1] }, ["nie", "selten", "oft", "fast immer"].map(function (l, i) {
            return h("button", { key: i, type: "button", role: "radio", "aria-checked": v[0][q[0]] === i, onClick: function () { var o = Object.assign({}, v[0]); o[q[0]] = i; v[1](o); } }, l);
          })));
      }),
      n === CHECKQ.length && !shown[0] ? h("button", { type: "button", className: "btn", onClick: function () { shown[1](true); used("check"); } }, "Empfehlung zeigen") : null,
      shown[0] ? h("div", { className: "rh-rec" },
        h("p", null, sum >= 11 ? "Bei dir ist gerade viel los. Die Werkzeuge unten helfen, aber sprich auch mit jemandem, dem du vertraust. Wenn die Belastung über Wochen anhält, schau in ‚Wann Hilfe holen‘." : sum >= 6 ? "Spürbarer Stress, wie ihn viele vor Prüfungen erleben. Diese Werkzeuge passen zu dir:" : "Du wirkst gerade recht ausgeglichen. Gut, um Werkzeuge in Ruhe zu üben, bevor es stressig wird:"),
        h("div", { className: "rh-recl" }, (top3.length ? top3 : ["atem", "plan", "abschalten"]).map(function (id) { var t = TOOLS.filter(function (x) { return x.id === id; })[0]; return h("button", { key: id, type: "button", style: { "--c": t.c }, onClick: function () { p.open(id); } }, h(Ic, { k: t.ic, s: 18 }), t.t); })),
        h("p", { className: "muted", style: { fontSize: 12.5, margin: "8px 0 0" } }, "Kein Test und keine Diagnose. Die Antworten werden nicht gespeichert.")) : null);
  }

  /* ---------------- Wissen ---------------- */
  function Wissen() {
    var my = uS({});
    var MY = [
      ["Ein bisschen Stress ist gut für die Leistung.", true, "Mäßige Aktivierung schärft Aufmerksamkeit. Entscheidend ist, wie du sie bewertest: als Bedrohung oder als Herausforderung."],
      ["Die Nacht vor der Prüfung durchlernen bringt die letzten Punkte.", false, "Im Schlaf werden Gelerntes gefestigt und Abrufwege gestärkt. Schlafmangel verschlechtert Konzentration und Gedächtnis deutlich."],
      ["Eine ‚Power Pose‘ vor der Prüfung senkt Stresshormone.", false, "Die bekannte Studie dazu ließ sich nicht wiederholen. Hormonveränderungen wurden nicht bestätigt. Atmen und Umdeuten sind besser belegt."],
      ["Sich selbst abfragen ist wirksamer als noch einmal lesen.", true, "Der Testeffekt gehört zu den am besten belegten Lernstrategien. Und: Wer mit Abfragen gelernt hat, ruft Wissen auch unter Stress besser ab."],
      ["Wer Prüfungsangst hat, ist schlechter vorbereitet.", false, "Prüfungsangst trifft auch sehr gut Vorbereitete. Sie ist häufig und gut behandelbar."],
      ["Bewegung hilft gegen Angst.", true, "Regelmäßige Bewegung senkt nachweislich Angst- und Stresssymptome. Schon ein zügiger Spaziergang vor dem Lernen hilft."]
    ];
    return h(R.Fragment, null,
      h("div", { className: "card rh-learn" },
        h("h3", null, "Was in deinem Körper passiert"),
        h("p", null, "Stress entsteht nicht durch eine Situation allein, sondern durch ihre Bewertung: Ist das bedrohlich? Reichen meine Kräfte? So beschreibt es das transaktionale Stressmodell nach Lazarus. Fällt die Bewertung bedrohlich aus, schaltet der Körper in wenigen Sekunden um: Der Sympathikus schüttet Adrenalin aus, Herz und Atmung beschleunigen sich, Muskeln spannen sich an. Etwas später folgt Cortisol."),
        h("p", null, "Für eine Prüfung ist das zunächst nützlich. Problematisch wird es, wenn Sorgengedanken dazukommen: Sie belegen Arbeitsgedächtnis, das dann für die Aufgabe fehlt. Deshalb setzen die Werkzeuge hier an zwei Stellen an: am Körper (Atmung, Muskeln) und an den Gedanken (Bewertung, Schreiben, Pläne)."),
        h("div", { className: "rh-two" },
          h("div", null, h("b", null, "Kurzfristig: Akuthilfe"), h("ul", null, h("li", null, "Atmung verlangsamen, länger ausatmen"), h("li", null, "Aufregung als Energie deuten"), h("li", null, "Sinne nutzen: 5-4-3-2-1"), h("li", null, "Mit ‚du‘ zu dir selbst sprechen"))),
          h("div", null, h("b", null, "Langfristig: Vorbeugen"), h("ul", null, h("li", null, "Verteilt lernen und dich selbst abfragen"), h("li", null, "Prüfungssituationen üben, etwa im Examenssimulator"), h("li", null, "Schlaf, Bewegung, feste Pausen"), h("li", null, "Wenn-dann-Pläne und Unterstützung im Kurs")))),
        h(Src, { t: "Lazarus, R. S. & Folkman, S. (1984). Stress, Appraisal, and Coping. Springer; von der Embse, N. et al. (2018). Test anxiety effects, predictors, and correlates: A 30-year meta-analytic review. Journal of Affective Disorders 227, 483–493; Roediger, H. L. & Karpicke, J. D. (2006). Psychological Science 17, 249–255; Smith, A. M. et al. (2016). Retrieval practice protects memory against acute stress. Science 354, 1046–1048; Cepeda, N. J. et al. (2006). Psychological Bulletin 132, 354–380; Ranehill, E. et al. (2015). Psychological Science 26, 653–656; Singh, B. et al. (2023). British Journal of Sports Medicine 57, 1203–1209." })),
      h("div", { className: "card rh-learn" },
        h("h3", null, "Mythos oder Fakt?"),
        h("div", { className: "rh-myth" }, MY.map(function (m, i) {
          var a = my[0][i];
          return h("div", { key: i, className: "rh-my" + (a != null ? (a === m[1] ? " ok" : " no") : "") },
            h("p", null, m[0]),
            a == null ? h("div", { className: "rh-row" }, h("button", { type: "button", className: "btn ghost sm", onClick: function () { var o = Object.assign({}, my[0]); o[i] = true; my[1](o); } }, "Fakt"), h("button", { type: "button", className: "btn ghost sm", onClick: function () { var o = Object.assign({}, my[0]); o[i] = false; my[1](o); } }, "Mythos")) :
              h("p", { className: "rh-ans" }, h("b", null, (m[1] ? "Fakt. " : "Mythos. ")), m[2]));
        }))),
      h("div", { className: "card rh-learn" },
        h("h3", null, "Countdown bis zur Prüfung"),
        h("div", { className: "rh-cd" },
          [["6 bis 4 Wochen", "Lernplan mit festen Zeiten. Themen auf mehrere Wochen verteilen, jedes Thema mehrmals wiederholen. Jede Lerneinheit mit Selbstabfrage beenden, etwa mit Lernkarten oder Quiz."],
            ["3 bis 2 Wochen", "Prüfungssituation simulieren: Examenssimulator unter Zeitdruck, mündliche Fälle laut beantworten, Praktisches Examen durchspielen. So kennt dein Gehirn die Situation schon."],
            ["Letzte Woche", "Wiederholen statt Neues. Schlafrhythmus stabil halten. Wenn-dann-Plan schreiben. Anfahrt, Unterlagen und Kleidung klären."],
            ["Der Abend vorher", "Nur noch leichte Wiederholung. Etwas Schönes vornehmen, Bewegung, normale Schlafenszeit. Sorgen aufschreiben, dann Zettel weg."],
            ["Prüfungstag", "Normales Frühstück, Wasser dabei. Nicht mit anderen ‚Was kommt dran?‘ durchgehen. Zwei Seufzer vor dem Start. Erst die Aufgaben überfliegen, mit Bekanntem beginnen."]].map(function (x, i) { return h("div", { key: i, className: "rh-cdi" }, h("i", null), h("b", null, x[0]), h("p", null, x[1])); }))));
  }

  /* ---------------- Hilfe ---------------- */
  function Hilfe() {
    return h("div", { className: "card rh-help" },
      h("div", { className: "rh-hd" }, h(Ic, { k: "sos", s: 22 }), h("h3", null, "Wann Hilfe holen")),
      h("p", null, "Prüfungsangst und Stress sind häufig und gut behandelbar. Hol dir Unterstützung, wenn du über mehrere Wochen kaum schläfst, keine Freude mehr spürst, Panikattacken hast, Prüfungen vermeidest oder Alkohol, Medikamente oder andere Mittel zum Runterkommen brauchst."),
      h("ul", null,
        h("li", null, h("b", null, "Erste Ansprechpersonen: "), "Praxisanleitung, Klassenleitung oder Vertrauenslehrkraft an der Pflegeschule, Jugend- und Auszubildendenvertretung, betriebsärztlicher Dienst."),
        h("li", null, h("b", null, "Medizinisch: "), "deine Hausarztpraxis. Psychotherapeutische Sprechstunde über den Patientenservice ", h("a", { href: "tel:116117" }, "116 117"), " oder 116117.de."),
        h("li", null, h("b", null, "Rund um die Uhr, anonym und kostenlos: "), "TelefonSeelsorge ", h("a", { href: "tel:08001110111" }, "0800 111 0 111"), " oder ", h("a", { href: "tel:08001110222" }, "0800 111 0 222"), ", auch per Chat auf telefonseelsorge.de."),
        h("li", null, h("b", null, "Unter 25: "), "krisenchat.de, rund um die Uhr per Chat."),
        h("li", null, h("b", null, "Akute Gefahr für dich oder andere: "), "Notruf ", h("a", { href: "tel:112" }, "112"), ".")),
      h("p", { className: "muted", style: { fontSize: 13 } }, "Fallpfad ersetzt keine Beratung oder Behandlung. Die Übungen hier sind Selbsthilfe für normalen Alltags- und Prüfungsstress."));
  }

  /* ---------------- Hauptansicht ---------------- */
  function Ruhe(p) {
    var v = uS(function () { var o = window.FP_RUHE_OPEN; window.FP_RUHE_OPEN = null; return o || null; }), f = uS("alle");
    var d = lsGet(KEY(), {}), tools = d.tools || {};
    if (v[0] && VIEWS[v[0]]) {
      var t = TOOLS.filter(function (x) { return x.id === v[0]; })[0];
      return h("div", { className: "rh", style: { "--c": t.c } },
        h("button", { type: "button", className: "skip back", onClick: function () { v[1](null); top(); } }, h(Ic, { k: "left", s: 16 }), "Alle Werkzeuge"),
        h("div", { className: "card rh-view" },
          h("div", { className: "rh-vh" }, h("span", { className: "rh-ic" }, h(Ic, { k: t.ic, s: 22, w: 1.8 })), h("div", null, h("div", { className: "eyebrow" }, t.z), h("h2", null, t.t))),
          h(VIEWS[v[0]], { key: v[0] })));
    }
    var open = function (id) { v[1](id); top(); };
    var list = TOOLS.filter(function (x) { return f[0] === "alle" || x.wann.indexOf(f[0]) >= 0; });
    return h("div", { className: "rh" },
      h("div", { className: "rh-hero" },
        h("span", { className: "rh-hero-ic", "aria-hidden": "true" }, h(Ic, { k: "lung", s: 28, w: 1.7 })),
        h("div", { className: "rh-hero-t" },
          h("span", { className: "eyebrow" }, "Stress und Prüfungsangst bewältigen"),
          h("h2", null, "Aufregung gehört dazu. Du kannst lernen, sie zu steuern."),
          h("p", null, "Wissenschaftlich geprüfte Werkzeuge für drei Situationen: akut im Moment, in der Zeit vor Prüfungen und im stressigen Pflegealltag."),
          h("div", { className: "rh-row" },
            h("button", { type: "button", className: "btn", onClick: function () { open("atem"); } }, h(Ic, { k: "lung", s: 16 }), "Sofort runterkommen"),
            h("a", { className: "btn ghost", href: "#rh-hilfe", onClick: function (e) { e.preventDefault(); var el = document.getElementById("rh-hilfe"); if (el) el.scrollIntoView({ behavior: "smooth" }); } }, "Wann Hilfe holen")))),
      h(Check, { open: open }),
      h("div", { className: "sec" }, h("h2", null, "Werkzeuge"),
        h("div", { className: "rh-seg sm", role: "group", "aria-label": "Filter" }, [["alle", "Alle"], ["akut", "Akut"], ["vorher", "Vor der Prüfung"], ["alltag", "Pflegealltag"]].map(function (x) { return h("button", { key: x[0], type: "button", "aria-pressed": f[0] === x[0], onClick: function () { f[1](x[0]); } }, x[1]); }))),
      h("div", { className: "rh-grid" }, list.map(function (t) {
        return h("button", { key: t.id, type: "button", className: "rh-tile", style: { "--c": t.c }, onClick: function () { open(t.id); } },
          h("span", { className: "rh-ic" }, h(Ic, { k: t.ic, s: 20, w: 1.8 })),
          h("b", null, t.t), h("span", null, t.d),
          h("span", { className: "rh-meta" }, t.z, tools[t.id] ? h("em", null, h(Ic, { k: "check", s: 12, w: 3 }), " ausprobiert") : null));
      })),
      h("div", { className: "sec" }, h("h2", null, "Verstehen")),
      h(Wissen),
      h("div", { id: "rh-hilfe", className: "sec" }, h("h2", null, "Unterstützung")),
      h(Hilfe));
  }
  window.FP_Ruhe = Ruhe;
})();
