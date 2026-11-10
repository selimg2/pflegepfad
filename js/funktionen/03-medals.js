(function () {
  /* Medaillen und Checkpoints: werden aus dem Lernstand berechnet. Neue Erfolge zeigen eine kurze Animation. */
  var IC = {
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
    star: "M12 2l3 6.5 7 .8-5.2 4.8 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.3l7-.8z",
    step: "M5 12l5 5L20 7",
    cal: "M4 5h16v16H4zM8 3v4M16 3v4M4 10h16",
    fire: "M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8 0 4 3 7 7 7z",
    chat: "M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
    swap: "M7 7h13l-3-3M17 17H4l3 3",
    bed: "M3 18V7M3 13h18v5M21 18v-3M7 13v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2",
    exam: "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    cards: "M4 8h12v13H4zM8 5h12v13",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
    leaf: "M5 21c0-9 5-15 15-16-1 10-7 15-15 16zM5 21l7-7",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5",
    trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
    heart: "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"
  };
  var TIER = ["Bronze", "Silber", "Gold"];

  function sess() { try { return JSON.parse(localStorage.getItem("fallpfad-session") || "null") || "gast"; } catch (e) { return "gast"; } }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function stats(S) {
    S = S || {};
    var M = window.FP_MODS || [], done = S.done || {}, res = S.res || {};
    var fin = [], byYear = { 1: [0, 0], 2: [0, 0], 3: [0, 0] }, pages = Object.keys(done).length, pts = 0;
    Object.keys(res).forEach(function (k) { pts += Number(res[k] && res[k].e) || 0; });
    M.forEach(function (m) {
      var ok = m.steps && m.steps.length && m.steps.every(function (st) { return done[st.key]; });
      if (ok) fin.push(m.id);
      var y = byYear[m.year] || (byYear[m.year] = [0, 0]); y[1]++; if (ok) y[0]++;
    });
    var days = Object.keys(S.act || {}).filter(function (d) { return S.act[d] > 0; }).sort(), best = 0, cur = 0, prev = null;
    days.forEach(function (d) { var t = Date.parse(d + "T12:00:00"); cur = prev && t - prev < 1.5 * 864e5 ? cur + 1 : 1; best = Math.max(best, cur); prev = t; });
    var komm = S.komm || {}, kb = komm.best || {}, kvals = Object.keys(kb).map(function (k) { return kb[k]; });
    var sbar = 0; (komm.hist || []).forEach(function (r) { if (r && r.sb) sbar = Math.max(sbar, r.sb); });
    function bestPct(h) { return (h || []).reduce(function (a, r) { return Math.max(a, Number(r && r.pct) || 0); }, 0); }
    var exams = (S.exams || []).map(function (v) { return v.n ? Math.round(100 * v.score / v.n) : 0; });
    var stress = lsGet("fp-stress:" + sess(), {});
    return {
      fin: fin.length, finAll: M.length, byYear: byYear, pages: pages, pts: pts, streak: best, days: days.length,
      komm: kvals.length, kommTop: kvals.reduce(function (a, b) { return Math.max(a, b); }, 0), sbar: sbar,
      schicht: bestPct(S.station && S.station.hist), pex: bestPct(S.pex && S.pex.hist),
      examen: Math.max(bestPct(S.examHist), exams.reduce(function (a, b) { return Math.max(a, b); }, 0)),
      karten: Object.keys(S.leit || {}).filter(function (k) { return S.leit[k] && S.leit[k].b > 0; }).length,
      blitz: (S.blitz && S.blitz.best) || 0, stress: Object.keys(stress.tools || {}).filter(function (k) { return k !== "check"; }).length
    };
  }
  function yearFrac(st, y) { var a = st.byYear[y] || [0, 0]; return a[1] ? a[0] / a[1] : 0; }

  var MEDALS = [
    { id: "module", t: "Fallmodule", ic: "book", c: "#4F46E5", v: function (s) { return s.fin; }, tiers: [1, 10, 25], d: "Fallmodule vollständig bearbeitet", u: "Module" },
    { id: "lj1", t: "1. Ausbildungsjahr", ic: "flag", c: "#0062FF", v: function (s) { return Math.round(100 * yearFrac(s, 1)); }, tiers: [25, 60, 100], d: "Anteil der Module des 1. Jahres abgeschlossen", u: "%" },
    { id: "lj2", t: "2. Ausbildungsjahr", ic: "flag", c: "#7C3AED", v: function (s) { return Math.round(100 * yearFrac(s, 2)); }, tiers: [25, 60, 100], d: "Anteil der Module des 2. Jahres abgeschlossen", u: "%" },
    { id: "lj3", t: "3. Ausbildungsjahr", ic: "flag", c: "#DB2777", v: function (s) { return Math.round(100 * yearFrac(s, 3)); }, tiers: [25, 60, 100], d: "Anteil der Module des 3. Jahres abgeschlossen", u: "%" },
    { id: "punkte", t: "Punktesammler", ic: "star", c: "#CA8A04", v: function (s) { return s.pts; }, tiers: [250, 1000, 3000], d: "Punkte aus Aufgaben und Quizzen", u: "Punkte" },
    { id: "stationen", t: "Stationen", ic: "step", c: "#059669", v: function (s) { return s.pages; }, tiers: [25, 150, 400], d: "Lernseiten abgeschlossen", u: "Seiten" },
    { id: "serie", t: "Dranbleiben", ic: "fire", c: "#EA580C", v: function (s) { return s.streak; }, tiers: [3, 7, 14], d: "Tage am Stück gelernt (längste Serie)", u: "Tage" },
    { id: "tage", t: "Lerntage", ic: "cal", c: "#0891B2", v: function (s) { return s.days; }, tiers: [10, 30, 75], d: "Tage, an denen du gelernt hast", u: "Tage" },
    { id: "gespraeche", t: "Gesprächsprofi", ic: "chat", c: "#0EA5E9", v: function (s) { return s.komm; }, tiers: [1, 5, 15], d: "verschiedene KI-Gespräche geübt", u: "Gespräche" },
    { id: "gespraechtop", t: "Starke Worte", ic: "heart", c: "#E11D48", v: function (s) { return s.kommTop; }, tiers: [60, 75, 90], d: "beste Gesprächsauswertung", u: "Punkte" },
    { id: "sbar", t: "SBAR-Profi", ic: "swap", c: "#D97706", v: function (s) { return s.sbar; }, tiers: [2, 3, 4], d: "SBAR-Bausteine in einer Übergabe vollständig", u: "von 4" },
    { id: "schicht", t: "Stationsalltag", ic: "bed", c: "#0D9488", v: function (s) { return s.schicht; }, tiers: [50, 75, 90], d: "bestes Schichtergebnis", u: "%" },
    { id: "pex", t: "Praktisches Examen", ic: "trophy", c: "#0062FF", v: function (s) { return s.pex; }, tiers: [50, 70, 85], d: "bestes Ergebnis in der Examensübung", u: "%" },
    { id: "examen", t: "Schriftliche Prüfung", ic: "exam", c: "#DC2626", v: function (s) { return s.examen; }, tiers: [50, 70, 85], d: "bestes Ergebnis im Examenssimulator", u: "%" },
    { id: "karten", t: "Kartenprofi", ic: "cards", c: "#CA8A04", v: function (s) { return s.karten; }, tiers: [25, 100, 300], d: "Lernkarten gewusst", u: "Karten" },
    { id: "blitz", t: "Blitzmerker", ic: "bolt", c: "#F59E0B", v: function (s) { return s.blitz; }, tiers: [8, 15, 25], d: "Rekord in der Blitzrunde", u: "richtige" },
    { id: "ruhe", t: "Ruhepol", ic: "leaf", c: "#16A34A", v: function (s) { return s.stress; }, tiers: [1, 4, 8], d: "Werkzeuge aus „Ruhig bleiben“ ausprobiert", u: "Werkzeuge" }
  ];
  var CHECK = [
    { id: "c1", t: "Losgelegt", d: "Erste Lernseite abgeschlossen", ok: function (s) { return s.pages >= 1; }, p: function (s) { return [s.pages, 1]; } },
    { id: "c2", t: "Erstes Modul", d: "Ein Fallmodul komplett", ok: function (s) { return s.fin >= 1; }, p: function (s) { return [s.fin, 1]; } },
    { id: "c3", t: "Ins Gespräch", d: "Erstes KI-Gespräch geübt", ok: function (s) { return s.komm >= 1; }, p: function (s) { return [s.komm, 1]; } },
    { id: "c4", t: "Fünf Module", d: "Fünf Fallmodule komplett", ok: function (s) { return s.fin >= 5; }, p: function (s) { return [s.fin, 5]; } },
    { id: "c5", t: "Eine Woche dran", d: "Sieben Lerntage", ok: function (s) { return s.days >= 7; }, p: function (s) { return [s.days, 7]; } },
    { id: "c6", t: "1000 Punkte", d: "1000 Punkte gesammelt", ok: function (s) { return s.pts >= 1000; }, p: function (s) { return [s.pts, 1000]; } },
    { id: "c7", t: "Erste Schicht", d: "Eine Schicht im Stationsalltag beendet", ok: function (s) { return s.schicht > 0; }, p: function (s) { return [s.schicht > 0 ? 1 : 0, 1]; } },
    { id: "c8", t: "1. Jahr geschafft", d: "Alle Module des 1. Ausbildungsjahres", ok: function (s) { return yearFrac(s, 1) >= 1; }, p: function (s) { var a = s.byYear[1] || [0, 1]; return [a[0], a[1]]; } },
    { id: "c9", t: "15 Module", d: "Fünfzehn Fallmodule komplett", ok: function (s) { return s.fin >= 15; }, p: function (s) { return [s.fin, 15]; } },
    { id: "c10", t: "Prüfungsluft", d: "Examenssimulator oder Praktisches Examen absolviert", ok: function (s) { return s.examen > 0 || s.pex > 0; }, p: function (s) { return [s.examen > 0 || s.pex > 0 ? 1 : 0, 1]; } },
    { id: "c11", t: "2. Jahr geschafft", d: "Alle Module des 2. Ausbildungsjahres", ok: function (s) { return yearFrac(s, 2) >= 1; }, p: function (s) { var a = s.byYear[2] || [0, 1]; return [a[0], a[1]]; } },
    { id: "c12", t: "30 Module", d: "Dreißig Fallmodule komplett", ok: function (s) { return s.fin >= 30; }, p: function (s) { return [s.fin, 30]; } },
    { id: "c13", t: "3. Jahr geschafft", d: "Alle Module des 3. Ausbildungsjahres", ok: function (s) { return yearFrac(s, 3) >= 1; }, p: function (s) { var a = s.byYear[3] || [0, 1]; return [a[0], a[1]]; } },
    { id: "c14", t: "Examensreif", d: "Der ganze Fallpfad ist geschafft", ok: function (s) { return s.finAll > 0 && s.fin >= s.finAll; }, p: function (s) { return [s.fin, s.finAll]; } }
  ];
  function tierOf(m, s) { var v = m.v(s), t = -1; m.tiers.forEach(function (x, i) { if (v >= x) t = i; }); return t; }

  /* ---------- Feier-Animation ---------- */
  var queue = [], showing = false;
  function svgIc(k, sz, sw) { return '<svg viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + IC[k] + '"/></svg>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function next() {
    if (showing || !queue.length) return;
    showing = true;
    var it = queue.shift(), el = document.createElement("div");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var conf = "";
    if (!reduce) for (var i = 0; i < 14; i++) {
      var a = (i / 14) * Math.PI * 2, d = 70 + (i % 2) * 18;
      conf += '<i style="--x:' + Math.round(Math.cos(a) * d) + 'px;--y:' + Math.round(Math.sin(a) * d) + 'px;--d:' + (0.35 + (i % 3) * 0.04).toFixed(2) + 's"></i>';
    }
    el.className = "fpm-ov";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", it.head);
    el.innerHTML = '<div class="fpm-card ' + it.cls + '" style="--mc:' + it.c + '">' +
      '<div class="fpm-conf" aria-hidden="true">' + conf + '</div>' +
      '<div class="fpm-disc" aria-hidden="true"><svg class="fpm-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/></svg>' + svgIc(it.ic, 34, 1.8) + '</div>' +
      (it.tier ? '<div class="fpm-tier">' + esc(it.tier) + '</div>' : "") +
      '<div class="fpm-head">' + esc(it.head) + '</div><h2>' + esc(it.t) + '</h2><p>' + esc(it.d) + '</p>' +
      (queue.length ? '<small>Noch ' + queue.length + ' weitere' + (queue.length === 1 ? 'r Erfolg' : ' Erfolge') + '</small>' : "") +
      '<button type="button" class="btn">Weiter</button></div>';
    function close() { el.classList.add("out"); setTimeout(function () { el.remove(); showing = false; next(); }, 260); document.removeEventListener("keydown", key); }
    function key(e) { if (e.key === "Escape" || e.key === "Enter") close(); }
    el.addEventListener("click", function (e) { if (e.target === el || e.target.tagName === "BUTTON") close(); });
    document.addEventListener("keydown", key);
    document.body.appendChild(el);
    setTimeout(function () { var b = el.querySelector("button"); if (b) b.focus(); }, 50);
  }
  function check(S) {
    var s = stats(S), key = "fp-medals-seen:" + sess(), seen = lsGet(key, null), now = {};
    MEDALS.forEach(function (m) { now[m.id] = tierOf(m, s); });
    CHECK.forEach(function (c) { now[c.id] = c.ok(s) ? 0 : -1; });
    if (!seen) { lsSet(key, now); return; } // beim ersten Mal still übernehmen
    var changed = false;
    CHECK.forEach(function (c) { if (now[c.id] >= 0 && !(seen[c.id] >= 0)) { queue.push({ head: "Checkpoint erreicht!", t: c.t, d: c.d, ic: "flag", c: "#0062FF", cls: "cp" }); changed = true; } });
    MEDALS.forEach(function (m) { var a = now[m.id], b = seen[m.id] == null ? -1 : seen[m.id]; if (a > b) { queue.push({ head: "Medaille erhalten!", t: m.t, tier: TIER[a], d: m.tiers[a] + " " + m.u + ": " + m.d, ic: m.ic, c: m.c, cls: "t" + a }); changed = true; } });
    if (changed) { Object.keys(now).forEach(function (k) { if (now[k] > (seen[k] == null ? -1 : seen[k])) seen[k] = now[k]; }); lsSet(key, seen); setTimeout(next, 600); }
  }
  var tmr = null, lastS = null;
  window.FP_ckTick = function (S) { if (!S || S === lastS) return; lastS = S; clearTimeout(tmr); tmr = setTimeout(function () { try { check(S); } catch (e) {} }, 900); };
  window.FP_medalsDemo = function (cls) { queue.push(cls === "cp" ? { head: "Checkpoint erreicht!", t: "Fünf Module", d: "Fünf Fallmodule komplett", ic: "flag", c: "#0062FF", cls: "cp" } : { head: "Medaille erhalten!", t: "Gesprächsprofi", tier: "Gold", d: "15 Gespräche: verschiedene KI-Gespräche geübt", ic: "chat", c: "#0EA5E9", cls: "t2" }); next(); };

  /* ---------- Ansicht im Fortschritt ---------- */
  window.FP_medals = function (S) {
    var R = window.React; if (!R) return null;
    var h = R.createElement, s = stats(S), cps = CHECK.map(function (c) { return c.ok(s); }), nIdx = cps.indexOf(false);
    var got = MEDALS.reduce(function (a, m) { var t = tierOf(m, s); if (t >= 0) a[t]++; return a; }, [0, 0, 0]);
    var nc = nIdx < 0 ? null : CHECK[nIdx], np = nc ? nc.p(s) : null;
    return h(R.Fragment, null,
      h("div", { className: "sec" }, h("h2", null, "Checkpoints")),
      h("div", { className: "card fpm-path" },
        h("div", { className: "fpm-next" },
          nc ? h(R.Fragment, null, h("span", { className: "eyebrow" }, "Nächster Checkpoint"), h("b", null, nc.t), h("span", { className: "muted" }, nc.d),
            h("div", { className: "fpm-bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": np[1], "aria-valuenow": Math.min(np[0], np[1]) }, h("i", { style: { width: Math.min(100, Math.round(100 * np[0] / Math.max(1, np[1]))) + "%" } })),
            h("small", { className: "muted" }, Math.min(np[0], np[1]) + " von " + np[1]))
            : h(R.Fragment, null, h("span", { className: "eyebrow" }, "Alle Checkpoints"), h("b", null, "Du hast den ganzen Pfad geschafft."))),
        h("ol", { className: "fpm-track" }, CHECK.map(function (c, i) {
          var ok = cps[i], cur = i === nIdx;
          return h("li", { key: c.id, className: (ok ? "ok" : "") + (cur ? " cur" : ""), title: c.d },
            h("span", { className: "fpm-node", dangerouslySetInnerHTML: { __html: ok ? svgIc("step", 16, 3) : String(i + 1) } }),
            h("span", { className: "fpm-lbl" }, c.t));
        }))),
      h("div", { className: "sec" }, h("h2", null, "Medaillen"), h("span", { className: "fpm-sum" }, h("span", { className: "g2" }, h("i"), got[2], " Gold"), h("span", { className: "g1" }, h("i"), got[1] - got[2], " Silber"), h("span", { className: "g0" }, h("i"), got[0] - got[1], " Bronze"))),
      h("div", { className: "fpm-grid" }, MEDALS.map(function (m) {
        var t = tierOf(m, s), v = m.v(s), nx = t < 2 ? m.tiers[t + 1] : null, pct = nx ? Math.min(100, Math.round(100 * v / nx)) : 100;
        return h("div", { key: m.id, className: "fpm-m t" + t, style: { "--mc": m.c } },
          h("div", { className: "fpm-md", dangerouslySetInnerHTML: { __html: svgIc(m.ic, 22, 1.8) } }),
          h("div", { className: "fpm-mt" },
            h("b", null, m.t), h("span", { className: "fpm-tl" }, t >= 0 ? TIER[t] : "Noch offen"),
            h("small", null, nx ? Math.min(v, nx) + " / " + nx + " " + m.u + " bis " + TIER[t + 1] : "Höchste Stufe erreicht"),
            h("div", { className: "fpm-bar sm" }, h("i", { style: { width: pct + "%" } }))));
      })),
      h("p", { className: "muted", style: { fontSize: 13, marginTop: 10 } }, "Jede Medaille hat drei Stufen: Bronze, Silber und Gold. Neue Medaillen und Checkpoints werden gefeiert, sobald du sie erreichst."));
  };
})();
