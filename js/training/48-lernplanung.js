/* Schüler-App: Lernplanung unter „Lernmodule“ – Prüfungstermin und Wiederholen an einem Ort.
   - Prüfung: nutzt den Lernplaner des App-Kerns (window.FP_PLANNER, gespeichert im Konto unter S.plan).
     Auf der Startseite erscheint nur noch der Countdown, wenn ein Termin eingetragen ist.
   - Wiederholen: falsch beantwortete Fragen aus allen Modulen kommen in einen Karteikasten und werden nach
     Abständen wiederholt (1 / 3 / 7 / 30 / 90 Tage). Jede Frage nutzt die Aufgaben-Komponente der Module
     (window.FP_TaskUI), sieht also genauso aus und reagiert beim Ankreuzen genauso.
   - Ein früher nur auf dem Gerät gespeicherter Prüfungstag (fp-exam) wird einmalig in den Lernplan übernommen. */
(function () {
  "use strict";
  var R = window.React;
  if (!R) return;
  var h = R.createElement, useState = R.useState, useMemo = R.useMemo, useEffect = R.useEffect;
  var IVL = [1, 3, 7, 30, 90], MAX_RUNDE = 15;
  var ARTEN = [["", "Prüfung"], ["schriftliche", "Schriftliche Prüfung"], ["praktische", "Praktische Prüfung"], ["mündliche", "Mündliche Prüfung"]];

  /* ---------- Speicher ---------- */
  function stateKey() {
    var best = null, bestD = "";
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf("fallpfad-state:") !== 0) continue;
        try { var st = JSON.parse(localStorage.getItem(k)), d = st && st.act ? Object.keys(st.act).sort().pop() || "" : ""; if (!best || d >= bestD) { best = k; bestD = d; } } catch (e) {}
      }
    } catch (e) {}
    return best;
  }
  function srKey() { return "fp-sr:" + (stateKey() || "lokal").slice(15); }
  function srGet() { try { return JSON.parse(localStorage.getItem(srKey())) || {}; } catch (e) { return {}; } }
  function srSet(v) { try { localStorage.setItem(srKey(), JSON.stringify(v)); } catch (e) {} }
  function heute() { return new Date().toISOString().slice(0, 10); }
  function plus(t) { return new Date(Date.now() + t * 864e5).toISOString().slice(0, 10); }
  function mische(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function kurz(m) { return String(m.navTitle || m.title || "").replace(/^Fallmodul \d+ · /, ""); }
  function portal(el) { return window.ReactDOM && window.ReactDOM.createPortal ? window.ReactDOM.createPortal(el, document.body) : el; }

  /* ---------- Karten aus falschen Antworten ---------- */
  function karten(S) {
    var res = (S && S.res) || {}, mods = (window.FP_DATA && window.FP_DATA.mods) || [], out = [];
    mods.forEach(function (m) {
      (m.chapters || []).forEach(function (ch) {
        (ch.blocks || []).forEach(function (b) {
          if (b.type === "task" && b.kind === "choice" && b.id && b.options) {
            var r = res[m.id + "." + b.id];
            if (r && r.m > 0 && r.e < r.m) out.push({ key: m.id + "." + b.id, fm: m.id, mod: kurz(m), kap: ch.title, q: b.question, opts: b.options.map(function (o) { return { t: o.text, ok: !!o.correct, fb: o.feedback || "" }; }) });
          }
          if (b.type === "quiz" && b.id && b.questions) {
            var rq = res[m.id + "." + b.id];
            if (rq && rq.m > 0 && rq.e < rq.m) b.questions.forEach(function (f, qi) {
              out.push({ key: m.id + "." + b.id + ":" + qi, fm: m.id, mod: kurz(m), kap: ch.title, q: f.q, opts: (f.o || []).map(function (o, oi) { return { t: o, ok: oi === f.a, fb: oi === f.a ? (f.e || "") : "" }; }) });
            });
          }
        });
      });
    });
    return out;
  }
  function faellig(alle, sr) { var d = heute(); return alle.filter(function (c) { var e = sr[c.key]; return !e || e.d <= d; }); }
  function schwaechen(S) {
    var res = (S && S.res) || {}, mods = (window.FP_DATA && window.FP_DATA.mods) || [], agg = {};
    Object.keys(res).forEach(function (k) { var r = res[k], fm = k.split(".")[0]; if (!r || !r.m) return; (agg[fm] = agg[fm] || { e: 0, m: 0 }).e += r.e; agg[fm].m += r.m; });
    return Object.keys(agg).map(function (fm) {
      var a = agg[fm], mod = mods.filter(function (x) { return x.id === fm; })[0];
      return { fm: fm, name: mod ? kurz(mod) : fm, pct: Math.round(100 * a.e / a.m), m: a.m };
    }).filter(function (x) { return x.m >= 6 && x.pct < 80; }).sort(function (a, b) { return a.pct - b.pct; }).slice(0, 3);
  }

  /* ---------- Stile ---------- */
  var CSS = ".lp-sec{margin:14px 0 4px}" +
    ".lp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}" +
    ".lp-grid>.lp-card{display:flex;flex-direction:column;gap:10px;margin:0!important}"+".lp-card{}.lp-head{display:flex;align-items:center;gap:12px}" +
    ".lp-n{min-width:52px;height:52px;border-radius:15px;display:grid;place-items:center;font-size:21px;font-weight:700;line-height:1;background:var(--accent-soft,rgba(0,98,255,.1));color:var(--accent,#0062FF);text-align:center}" +
    ".lp-n small{display:block;font-size:10.5px;font-weight:600;margin-top:2px}" +
    ".lp-n.warn{background:color-mix(in srgb,#EA580C 14%,transparent);color:#EA580C}" +
    ".lp-head b{display:block;font-size:16px}.lp-head span{display:block;color:var(--muted);font-size:13.5px;line-height:1.4}" +
    ".lp-chips{display:flex;flex-wrap:wrap;gap:6px}.lp-chips .chip{border:0;cursor:pointer;min-height:30px}" +
    ".lp-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}" +
    ".lp-sw{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}.lp-sw b{flex:1;min-width:0;font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lp-sw i{font-style:normal;font-weight:700;font-size:13px;color:#EA580C}" +
    ".lp-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media (max-width:520px){.lp-row{gap:8px}}" +
    ".lp-tile{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:var(--surface);border:1px solid var(--line);min-width:0;transition:border-color .2s,transform .15s}" +
    ".lp-tile:hover{border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}.lp-tile:active{transform:scale(.99)}.lp-tile:focus-visible{outline:2px solid var(--accent);outline-offset:2px}" +
    ".lp-ic{flex:0 0 auto;min-width:36px;height:36px;padding:0 6px;border-radius:11px;display:grid;place-items:center;font-weight:700;font-size:15px;background:var(--fill,rgba(120,120,128,.12));color:var(--muted)}" +
    ".lp-ic.on{background:var(--accent-soft,rgba(0,98,255,.1));color:var(--accent)}.lp-ic.warn{background:color-mix(in srgb,#EA580C 14%,transparent);color:#EA580C}" +
    ".lp-tt{display:flex;flex-direction:column;min-width:0;flex:1}.lp-tt b{font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lp-tt small{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".lp-chev{color:var(--muted);font-size:20px;line-height:1}@media (max-width:420px){.lp-chev{display:none}.lp-tile{padding:9px 10px;gap:8px}.lp-ic{min-width:32px;height:32px;font-size:14px}}" +
    ".lp-planbox{margin-top:10px}.lp-planbox>.card{margin-bottom:10px}" +
    ".lp-modal{z-index:1000!important}.lp-sheet{width:min(520px,100%);display:flex;flex-direction:column;gap:12px}.lp-sheet .lp-x{width:34px;height:34px;font-size:19px;margin-left:8px;align-self:flex-start}" +
    ".lp-full{margin-top:12px}.lp-art{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}" +
    ".lp-ov{position:fixed;inset:0;z-index:1000;background:var(--bg,#f5f5f7);overflow:auto;padding:max(16px,env(safe-area-inset-top)) 16px 40px}" +
    ".lp-ovm{max-width:680px;margin:0 auto}.lp-ovtop{display:flex;align-items:center;gap:10px;margin:6px 0 12px}.lp-ovtop b{font-size:17px}.lp-ovtop small{color:var(--muted)}" +
    ".lp-x{margin-left:auto;border:0;background:var(--surface);color:var(--fg);width:38px;height:38px;border-radius:12px;font-size:21px;cursor:pointer;box-shadow:0 0 0 1px var(--line)}" +
    ".lp-bar{height:5px;border-radius:3px;background:var(--fill,rgba(120,120,128,.14));margin:0 0 14px;overflow:hidden}.lp-bar i{display:block;height:100%;background:var(--accent);transition:width .25s}" +
    ".lp-ende{text-align:center;padding:26px 12px}.lp-ende b{display:block;font-size:22px;margin-bottom:6px}";
  function useCss() { useEffect(function () { if (document.getElementById("lp-css")) return; var s = document.createElement("style"); s.id = "lp-css"; s.textContent = CSS; document.head.appendChild(s); }, []); }

  /* ---------- Karteikasten-Runde im Stil der Module ---------- */
  function Runde(p) {
    var Task = window.FP_TaskUI;
    var qs = useState(function () { return mische(p.deck).slice(0, MAX_RUNDE); }), queue = qs[0];
    var is = useState(0), i = is[0], setI = is[1];
    var rs = useState(0), richtig = rs[0], setRichtig = rs[1];
    var ss = useState(null), saved = ss[0], setSaved = ss[1];
    useEffect(function () {
      var esc = function (e) { if (e.key === "Escape") p.close(); };
      document.addEventListener("keydown", esc); document.body.style.overflow = "hidden";
      return function () { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
    }, []);
    var c = queue[i];
    var t = useMemo(function () {
      if (!c) return null;
      var o = mische(c.opts);
      return { kind: "choice", points: 1, question: c.q, options: o.map(function (x) { return { text: x.t, correct: x.ok, feedback: x.fb }; }) };
    }, [i]);
    var finish = function (x) {
      var ok = x.e === x.m, sr = srGet(), e = sr[c.key] || { i: 0 };
      if (ok) { e.i = Math.min((e.i || 0) + 1, IVL.length - 1); e.d = plus(IVL[e.i]); setRichtig(richtig + 1); } else { e.i = 0; e.d = plus(1); }
      sr[c.key] = e; srSet(sr); setSaved(Object.assign({}, x, { naechste: ok ? IVL[e.i] : 1 }));
    };
    var fertig = i >= queue.length;
    return portal(h("div", { className: "lp-ov", role: "dialog", "aria-modal": "true", "aria-label": p.titel },
      h("div", { className: "lp-ovm" },
        h("div", { className: "lp-ovtop" }, h("b", null, p.titel), h("small", null, Math.min(i + 1, queue.length) + " / " + queue.length), h("button", { type: "button", className: "lp-x", "aria-label": "Schließen", onClick: p.close }, "×")),
        h("div", { className: "lp-bar" }, h("i", { style: { width: (fertig ? 100 : Math.round(100 * i / queue.length)) + "%" } })),
        fertig ? h("div", { className: "card lp-ende" },
          h("b", null, richtig + " von " + queue.length + " richtig"),
          h("p", { className: "muted" }, richtig === queue.length ? "Stark. Was sitzt, kommt in größeren Abständen wieder." : "Was nicht saß, kommt morgen noch einmal. So bleibt es hängen."),
          h("button", { type: "button", className: "btn", onClick: p.close }, "Fertig"))
          : h("div", { className: "card", key: i },
            h("div", { className: "eyebrow", style: { marginBottom: 10 } }, c.mod + " · " + c.kap),
            Task && t ? h(Task, { t: t, uid: "sr." + c.key, saved: saved, finish: finish }) : null,
            saved && h("p", { className: "muted", style: { margin: "12px 0 0", fontSize: 14 } }, saved.e === saved.m ? "Kommt in " + saved.naechste + (saved.naechste === 1 ? " Tag" : " Tagen") + " wieder." : "Kommt morgen noch einmal."),
            saved && h("div", { className: "row", style: { marginTop: 14, justifyContent: "flex-end" } },
              h("button", { type: "button", className: "btn", onClick: function () { setSaved(null); setI(i + 1); } }, i + 1 >= queue.length ? "Auswertung" : "Weiter"))))));
  }

  /* ---------- Prüfungs-Karte ---------- */
  function datumDe(d) { var p = String(d).split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function artName(a) { var x = ARTEN.filter(function (y) { return y[0] === a; })[0]; return x ? x[1] : "Prüfung"; }

  function Pruefung(p) {
    var S = p.S, plan = S.plan || {}, st = p.st;
    var r = useMemo(function () { try { return window.FP_PLAN_TO && st ? window.FP_PLAN_TO(S, st) : null; } catch (e) { return null; } }, [S.plan, st, S.year]);
    var setPlan = function (x) { p.setS(function (u) { return Object.assign({}, u, { plan: Object.assign({}, u.plan || {}, x) }); }); };
    var aktiv = r && r.days >= 0;
    var w = aktiv && r.weeks[0];
    return h("div", { className: "card lp-card" },
      h("div", { className: "lp-head" },
        h("div", { className: "lp-n" + (aktiv && r.days <= 14 ? " warn" : "") }, aktiv ? r.days : "–", h("small", null, aktiv ? (r.days === 1 ? "Tag" : "Tage") : "")),
        h("div", { style: { minWidth: 0 } },
          h("b", null, aktiv ? artName(plan.art) + " am " + datumDe(plan.date) : "Meine Prüfung"),
          h("span", null, aktiv ? (r.total ? r.total + " offene Module · " + r.per + " pro Woche" : "Alle Module geschafft, jetzt wiederholen") : plan.date ? "Der eingetragene Termin ist vorbei. Trag den nächsten ein." : "Trag deinen Prüfungstermin ein. Fallpfad verteilt deine offenen Module auf die Wochen bis dahin."))),
      aktiv && w && h("div", null,
        h("small", { className: "eyebrow" }, w.review ? "Diese Woche" : w.from > new Date() ? "Ab Montag" : "Diese Woche"),
        h("div", { className: "lp-chips", style: { marginTop: 6 } }, w.review ? h("span", { className: "muted", style: { fontSize: 14 } }, "Wiederholung und Prüfungssimulation") : w.mods.length ? w.mods.map(function (m) {
          return h("button", { type: "button", key: m.id, className: "chip blue", onClick: function () { p.open(m.mi); } }, kurz(m));
        }) : h("span", { className: "muted", style: { fontSize: 14 } }, "Puffer"))),
      null);
  }
  function PlanVoll(p) {
    var plan = p.S.plan || {};
    var setPlan = function (x) { p.setS(function (u) { return Object.assign({}, u, { plan: Object.assign({}, u.plan || {}, x) }); }); };
    return h("div", { className: "lp-full" },
      h("div", { className: "lp-art", role: "group", "aria-label": "Art der Prüfung" }, h("span", { className: "muted", style: { fontSize: 13.5, alignSelf: "center", marginRight: 4 } }, "Art der Prüfung:"), ARTEN.map(function (a) {
        return h("button", { key: a[0] || "x", type: "button", className: "chip" + ((plan.art || "") === a[0] ? " blue" : ""), "aria-pressed": (plan.art || "") === a[0], style: { border: 0, cursor: "pointer" }, onClick: function () { setPlan({ art: a[0] }); } }, a[1]);
      })),
      window.FP_PLANNER ? h(window.FP_PLANNER, { S: p.S, setS: p.setS, st: p.st, open: p.open }) : null);
  }

  /* ---------- Wiederholen: kleine Kachel, Inhalt erst nach Antippen ---------- */
  function WiederholenBlatt(p) {
    var S = p.S, alle = p.alle, due = p.due, sw = schwaechen(S);
    useEffect(function () {
      var esc = function (e) { if (e.key === "Escape") p.close(); };
      document.addEventListener("keydown", esc);
      return function () { document.removeEventListener("keydown", esc); };
    }, []);
    var openMod = function (fm) { var ye = window.FP_YE || [], mi = ye.findIndex(function (m) { return m.id === fm; }); if (mi >= 0) { p.close(); p.open(mi); } };
    return portal(h("div", { className: "plmodal lp-modal", role: "dialog", "aria-modal": "true", "aria-label": "Wiederholen", onClick: function (e) { if (e.target === e.currentTarget) p.close(); } },
      h("div", { className: "card lp-sheet" },
        h("div", { className: "lp-head" },
          h("div", { className: "lp-n" }, alle.length ? due.length : "✓", h("small", null, alle.length ? "fällig" : "")),
          h("div", { style: { minWidth: 0, flex: 1 } }, h("b", null, "Wiederholen"),
            h("span", null, !alle.length ? "Noch nichts zu wiederholen. Falsch beantwortete Fragen landen automatisch hier." : due.length ? due.length + (due.length === 1 ? " Frage ist" : " Fragen sind") + " heute fällig, aus deinen falschen Antworten." : "Für heute alles wiederholt. " + alle.length + " Fragen im Karteikasten.")),
          h("button", { type: "button", className: "lp-x", "aria-label": "Schließen", onClick: p.close }, "×")),
        alle.length > 0 && h("button", { type: "button", className: "btn", disabled: !due.length, style: { width: "100%", justifyContent: "center" }, onClick: function () { p.start(faellig(karten(S), srGet()), "Wiederholen"); } }, due.length ? "Jetzt " + due.length + (due.length === 1 ? " Frage" : " Fragen") + " wiederholen" : "Heute nichts mehr fällig"),
        sw.length > 0 && h("div", null,
          h("small", { className: "eyebrow" }, "Deine wackeligsten Themen"),
          sw.map(function (x) {
            return h("div", { key: x.fm, className: "lp-sw" }, h("b", null, x.name), h("i", null, x.pct + " %"),
              h("button", { type: "button", className: "btn ghost sm", onClick: function () { var d = karten(S).filter(function (c) { return c.fm === x.fm; }); if (d.length) p.start(d, "Schwerpunkt: " + x.name); else openMod(x.fm); } }, "Üben"));
          })))));
  }
  function WiederholenKachel(p) {
    var S = p.S;
    var ts = useState(0), tick = ts[0], setTick = ts[1];
    var os = useState(false), offen = os[0], setOffen = os[1];
    var ds = useState(null), deck = ds[0], setDeck = ds[1];
    var alle = useMemo(function () { return karten(S); }, [S.res, tick]);
    var due = faellig(alle, srGet());
    return h(R.Fragment, null,
      h("button", { type: "button", className: "lp-tile", onClick: function () { setOffen(true); }, "aria-haspopup": "dialog" },
        h("span", { className: "lp-ic" + (due.length ? " on" : "") }, due.length || "✓"),
        h("span", { className: "lp-tt" }, h("b", null, "Wiederholen"), h("small", null, !alle.length ? "noch nichts offen" : due.length ? due.length + " heute fällig" : "für heute erledigt")),
        h("span", { className: "lp-chev", "aria-hidden": "true" }, "›")),
      offen && h(WiederholenBlatt, { S: S, alle: alle, due: due, open: p.open, close: function () { setOffen(false); }, start: function (d, t) { setOffen(false); setDeck({ d: d, t: t }); } }),
      deck && h(Runde, { deck: deck.d, titel: deck.t, close: function () { setDeck(null); setTick(tick + 1); } }));
  }
  function PruefungKachel(p) {
    var S = p.S, plan = S.plan || {}, st = p.st;
    var r = useMemo(function () { try { return window.FP_PLAN_TO && st ? window.FP_PLAN_TO(S, st) : null; } catch (e) { return null; } }, [S.plan, st, S.year]);
    var aktiv = r && r.days >= 0;
    return h("button", { type: "button", className: "lp-tile", "aria-expanded": !!p.offen, onClick: p.toggle },
      h("span", { className: "lp-ic" + (aktiv ? " on" : "") + (aktiv && r.days <= 14 ? " warn" : "") }, aktiv ? r.days : "+"),
      h("span", { className: "lp-tt", title: aktiv ? artName(plan.art) + " am " + datumDe(plan.date) : "" }, h("b", null, "Prüfung"),
        h("small", null, aktiv ? (r.days === 1 ? "morgen" : r.days === 0 ? "heute" : "in " + r.days + " Tagen") + " · " + datumDe(plan.date).slice(0, 6) : "Termin eintragen")),
      h("span", { className: "lp-chev", "aria-hidden": "true" }, p.offen ? "⌃" : "›"));
  }

  /* ---------- Bereich unter „Lernmodule“ ---------- */
  function Lernplanung(p) {
    useCss();
    var os = useState(false), offen = os[0], setOffen = os[1];
    useEffect(function () { if (/[#&]lernplan/.test(location.hash) || window.FP_LERNPLAN_OFFEN) { window.FP_LERNPLAN_OFFEN = false; setOffen(true); } }, []);
    return h("section", { className: "lp-sec", id: "fp-lernplanung", "aria-label": "Prüfung und Wiederholen" },
      h("div", { className: "lp-row" },
        h(PruefungKachel, { S: p.S, st: p.st, offen: offen, toggle: function () { setOffen(!offen); } }),
        h(WiederholenKachel, { S: p.S, open: p.open })),
      offen && h("div", { className: "lp-planbox" },
        h(PlanVoll, { S: p.S, setS: p.setS, st: p.st, open: p.open })));
  }
  window.FP_Lernplanung = Lernplanung;

  /* Einmalig: alten Prüfungstag (nur auf dem Gerät) in den Lernplan des Kontos übernehmen */
  window.FP_PLAN_MIGRATE = function (S, setS) {
    try {
      var alt = JSON.parse(localStorage.getItem("fp-exam") || "null");
      if (!alt || !alt.datum) return;
      if (!(S.plan && S.plan.date)) {
        var art = alt.art === "schriftlich" ? "schriftliche" : alt.art === "praktisch" ? "praktische" : alt.art === "mündlich" ? "mündliche" : "";
        setS(function (u) { return Object.assign({}, u, { plan: Object.assign({ perWeek: 2 }, u.plan || {}, { date: alt.datum, art: art }) }); });
      }
      localStorage.removeItem("fp-exam");
    } catch (e) {}
  };
})();
