/* Fallpfad Training "Stationsalltag": interaktive Stationsübersicht mit Simulationsuhr, Zimmern, Patientinnen und Patienten,
   Aufgaben und Ereignissen. Vollständig regelbasiert (ohne KI). Inhalte stehen in fx-station-data.js.
   Aufbau:
   - ENGINE: reine Funktionen auf einem serialisierbaren Zustand (Uhr, erledigte Aufgaben, Flags, Ereignisse, Messungen, Protokoll).
   - QUELLEN: verbindet Patientinnen und Patienten mit Lernmodulen (Patientenakte), der Praktischen Examen Übung (Akte, Bildbefunde,
     Simulationen) oder eigenen Akten.
   - OBERFLÄCHE: Start, Übergabe, Stationsplan, Zimmer, Aufgaben, Ereignisse, Aufgaben-Durchführung, Auswertung. */
(function () {
  var R = window.React, DATA = window.FP_STATION_DATA;
  if (!R || !DATA) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect, uR = R.useRef, uM = R.useMemo, Fr = R.Fragment, RD = window.ReactDOM;
  function portal(el) { return RD && RD.createPortal ? RD.createPortal(el, document.body) : el; }
  var MS_PER_MIN = 2000; /* 1× = eine Simulationsminute alle zwei Sekunden */

  /* ================= Hilfen ================= */
  function tm(s) { if (typeof s === "number") return s; var p = String(s || "0:0").split(":"); return (+p[0]) * 60 + (+p[1] || 0); }
  function ft(m) { m = Math.floor(m); var hh = Math.floor(m / 60) % 24, mm = m % 60; return ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2); }
  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function num(x) { var n = parseFloat(String(x).replace(",", ".")); return isNaN(n) ? null : n; }
  function de(n, d) { return n == null ? "–" : String(d != null ? Number(n).toFixed(d) : n).replace(".", ","); }
  function hash(s) { var x = 2166136261; for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function shuffle(a, seed) { a = a.slice(); var r = seed || 1; for (var i = a.length - 1; i > 0; i--) { r = (Math.imul(r, 1103515245) + 12345) >>> 0; var j = r % (i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function top() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); } }


  var BW = { A: "wach, orientiert", C: "neu verwirrt", V: "reagiert auf Ansprache", P: "reagiert auf Schmerz", U: "reagiert nicht" };

  /* ================= ENGINE ================= */
  var E = {};
  E.init = function (sc) {
    return { v: 1, sid: sc.id, seed: sc._seed == null ? null : sc._seed, clock: tm(sc.start), started: false, speed: 1, done: {}, flags: {}, fired: {}, skipped: {}, seen: {}, seenTasks: {}, mess: {}, log: [], malus: [], ended: false };
  };
  E.cond = function (sc, st, c) {
    if (!c) return true;
    if (Array.isArray(c)) return c.every(function (x) { return E.cond(sc, st, x); });
    if (c.alle) return c.alle.every(function (x) { return E.cond(sc, st, x); });
    if (c.eine) return c.eine.some(function (x) { return E.cond(sc, st, x); });
    if (c.zeit && st.clock < tm(c.zeit)) return false;
    if (c.erledigt && !st.done[c.erledigt]) return false;
    if (c.nichtErledigt && st.done[c.nichtErledigt]) return false;
    if (c.flag && !arr(c.flag).every(function (f) { return st.flags[f] != null; })) return false;
    if (c.nichtFlag && arr(c.nichtFlag).some(function (f) { return st.flags[f] != null; })) return false;
    if (c.gefeuert && !st.fired[c.gefeuert]) return false;
    if (c.status && E.pat(sc, st, c.pat).status !== c.status) return false;
    if (c.nichtStatus && E.pat(sc, st, c.pat).status === c.nichtStatus) return false;
    return true;
  };
  E.flagTime = function (st, f) { var t = -1; for (var i = 0, a = arr(f); i < a.length; i++) { if (st.flags[a[i]] == null) return null; t = Math.max(t, st.flags[a[i]]); } return t; };
  E.present = function (sc, st, pid) { var p = sc.patienten[pid]; return !!p && (!p.kommt || st.clock >= tm(p.kommt)); };
  E.pat = function (sc, st, pid) {
    var p = sc.patienten[pid]; if (!p) return { status: "stabil", v: null };
    var cur = null;
    (p.verlauf || []).forEach(function (x) {
      var okT = true;
      if (x.ab != null) okT = st.clock >= tm(x.ab);
      if (x.flag) { var ft0 = E.flagTime(st, x.flag); okT = okT && ft0 != null && st.clock >= ft0 + (x.nach || 0); }
      if (okT && E.cond(sc, st, x.wenn)) cur = x;
    });
    return cur || { status: "stabil", v: null };
  };
  E.due = function (sc, st, t) {
    if (t.faelligNach) { var f = E.flagTime(st, t.faelligNach.flag); return f == null ? null : f + (t.faelligNach.min || 0); }
    return t.faellig ? tm(t.faellig) : null;
  };
  E.visible = function (sc, st, t) {
    if (st.done[t.id]) return true;
    if (t.ab && st.clock < tm(t.ab)) return false;
    if (t.pat && !E.present(sc, st, t.pat)) return false;
    return E.cond(sc, st, t.wenn);
  };
  E.tasks = function (sc, st) { return sc.aufgaben.filter(function (t) { return E.visible(sc, st, t); }); };
  E.copy = function (st) { return JSON.parse(JSON.stringify(st)); };
  E.logAdd = function (st, x) { st.log.push(Object.assign({ at: Math.floor(st.clock) }, x)); };
  /* Uhr vorstellen und dabei Ereignisse in zeitlicher Reihenfolge auslösen. Gibt neue Ereignisse zurück. */
  E.advance = function (sc, st, to) {
    var neu = [], guard = 0;
    to = Math.min(to, tm(sc.ende));
    var timed = sc.ereignisse.filter(function (e) { return e.um && !st.fired[e.id] && !st.skipped[e.id] && tm(e.um) <= to; }).sort(function (a, b) { return tm(a.um) - tm(b.um); });
    function fire(e) {
      st.fired[e.id] = Math.floor(st.clock);
      arr(e.setzt).forEach(function (f) { if (st.flags[f] == null) st.flags[f] = Math.floor(st.clock); });
      if (e.malus) st.malus.push({ id: e.id, at: Math.floor(st.clock), kat: e.malus.kat, pts: e.malus.pts, t: e.malus.t });
      E.logAdd(st, { kind: "ereignis", id: e.id, pat: e.pat || null, t: e.titel, d: e.text, art: e.art });
      neu.push(e);
    }
    function untimed() {
      var any = true;
      while (any && guard++ < 50) {
        any = false;
        sc.ereignisse.forEach(function (e) { if (!e.um && !st.fired[e.id] && E.cond(sc, st, e.wenn) && (!e.pat || E.present(sc, st, e.pat))) { fire(e); any = true; } });
      }
    }
    untimed();
    timed.forEach(function (e) {
      st.clock = Math.max(st.clock, tm(e.um));
      if (E.cond(sc, st, e.wenn)) fire(e); else st.skipped[e.id] = 1;
      untimed();
    });
    st.clock = Math.max(st.clock, to);
    untimed();
    E.tasks(sc, st).forEach(function (t) { st.seenTasks[t.id] = 1; });
    if (st.clock >= tm(sc.ende)) st.ended = true;
    st.clockTxt = ft(st.clock);
    return neu;
  };
  /* Aufgabe abschließen: Ergebnis speichern, Flags setzen, Zeit verbrauchen. */
  E.complete = function (sc, st, t, res, startedAt) {
    var due = E.due(sc, st, t), late = due != null ? Math.max(0, startedAt - due) : 0;
    var factor = late > 30 ? 0.6 : late > 10 ? 0.8 : 1;
    var pts = Math.round((t.punkte || 10) * Math.max(0, Math.min(1, res.score)) * factor * 10) / 10;
    st.clock = Math.max(st.clock, startedAt);
    var end = startedAt + (t.dauer || 5);
    st.done[t.id] = { at: Math.floor(startedAt), pts: pts, max: t.punkte || 10, score: res.score, late: Math.round(late), factor: factor };
    arr(t.setzt).concat(res.flags || []).forEach(function (f) { if (st.flags[f] == null) st.flags[f] = end; });
    if (res.mess && t.pat) { (st.mess[t.pat] = st.mess[t.pat] || []).push({ at: Math.floor(startedAt), v: res.mess }); }
    E.logAdd(st, { kind: "aufgabe", id: t.id, pat: t.pat || null, t: t.t, d: String(pts).replace(".", ",") + " von " + (t.punkte || 10) + " Punkten" + (late > 10 ? " · " + Math.round(late) + " Min. nach Fälligkeit" : "") });
    var evs = E.advance(sc, st, end);
    return evs;
  };
  E.score = function (sc, st) {
    var kats = {}, total = 0, max = 0, onTime = 0, counted = 0;
    sc.aufgaben.forEach(function (t) {
      if (!st.seenTasks[t.id] && !st.done[t.id]) return;
      var k = t.kat === "doku" ? "kommunikation" : t.kat || "fachlich";
      kats[k] = kats[k] || { pts: 0, max: 0 };
      kats[k].max += t.punkte || 10; max += t.punkte || 10;
      var d = st.done[t.id];
      if (d) { kats[k].pts += d.pts; total += d.pts; counted++; if (d.late <= 10) onTime++; }
    });
    var mal = st.malus.reduce(function (n, m) { kats[m.kat] = kats[m.kat] || { pts: 0, max: 0 }; kats[m.kat].pts -= m.pts; return n + m.pts; }, 0);
    var seen = Object.keys(st.seenTasks).length;
    var pct = max ? Math.max(0, Math.round((total - mal) / max * 100)) : 0;
    return { pct: pct, total: Math.round((total - mal) * 10) / 10, max: max, kats: kats, puenktlich: seen ? Math.round(onTime / seen * 100) : 0, erledigt: counted, offen: seen - counted };
  };

  /* ================= QUELLEN ================= */
  var PXC = {};
  function pexCase(id) { if (PXC[id]) return PXC[id]; var c = (window.PEX_CASES || []).filter(function (x) { return x.id === id; })[0]; PXC[id] = c; return c; }
  function pexLive(fall, k) { var c = pexCase(fall); return c ? c.live.filter(function (l) { return l.k === k; })[0] : null; }
  function modOf(id) { var M = window.FP_MODS || []; for (var i = 0; i < M.length; i++) if (M[i].id === id) return { m: M[i], mi: i }; return null; }
  function avHtml(sp, mood) { return window.PXAV ? window.PXAV.svg(sp, mood || "neutral") : ""; }
  var INFO = {};
  function info(sc, pid) {
    var key = (sc._key || sc.id) + ":" + pid; if (INFO[key]) return INFO[key];
    var p = sc.patienten[pid], q = p.quelle || { typ: "neu" }, o = { id: pid, typ: q.typ, flags: p.flags || [], uebergabe: p.uebergabe };
    if (q.typ === "modul") {
      var mo = modOf(q.id);
      if (mo) {
        var m = mo.m, ch = m.chapters || [], ci = Math.min(q.ci == null ? 99 : q.ci, ch.length - 1);
        var chars = window.FP_CHARS || {};
        o.name = m.patient.name; o.alter = parseInt(m.patient.born, 10) || ""; o.diagnose = m.patient.diagnosis;
        o.svg = chars[m.patient.char] ? chars[m.patient.char].svg : avHtml({ hair: m.patient.char });
        o.mi = mo.mi; o.ci = ci; o.modTitel = m.title; o.modId = m.id;
        var facts = [], allerg = "";
        (m.akteBase || []).forEach(function (r) { facts.push(r); });
        for (var i = 0; i <= ci; i++) { var a = ch[i] && ch[i].akte; if (a && a.facts) a.facts.forEach(function (r) { facts.push(r); }); }
        facts.forEach(function (r) { if (/allerg/i.test(r[0])) allerg = r[1]; });
        o.allergie = allerg; o.facts = facts;
      } else { o.name = pid; o.diagnose = ""; o.svg = avHtml({ hair: "JW" }); }
    } else if (q.typ === "pex") {
      var c = pexCase(q.fall), x = c && c.pat[q.key];
      if (x) {
        o.name = x.name; o.alter = x.alter; o.diagnose = x.diagnose; o.svg = avHtml(x.av); o.sp = x.av;
        o.daten = x.daten || []; o.anamnese = x.anamnese; o.typText = x.typ; o.fallTitel = c.station;
        (x.daten || []).forEach(function (r) { if (/allerg/i.test(r[0])) o.allergie = r[1]; });
      } else { o.name = pid; o.svg = avHtml({ hair: "JW" }); }
    } else {
      o.name = p.name; o.alter = p.alter; o.diagnose = p.diagnose; o.svg = avHtml(p.av); o.sp = p.av; o.akte = p.akte;
      (p.akte && p.akte.stamm || []).forEach(function (r) { if (/allerg/i.test(r[0])) o.allergie = r[1]; });
    }
    o.kurz = p.kurz || (o.name ? o.name.split(" ").slice(-1)[0] : pid);
    o.anrede = p.kurz || o.name;
    INFO[key] = o; return o;
  }
  function shortName(n) { var a = String(n || "").split(" "); return a.length > 1 ? a[0].charAt(0) + ". " + a.slice(1).join(" ") : n; }
  function roomOf(sc, pid) { for (var i = 0; i < sc.zimmer.length; i++) { var z = sc.zimmer[i], b = z.betten.indexOf(pid); if (b >= 0) return { nr: z.nr, bett: "AB"[b] }; } return { nr: "", bett: "" }; }

  /* ================= Stil ================= */
  var css = [
    ".st{display:flex;flex-direction:column;gap:14px;--c:#0D9488}",
    ".st-card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px}",
    ".st-h3{margin:0 0 10px;font-size:12.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:8px}",
    ".st-muted{color:var(--muted)}",
    ".st-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}",
    /* Start */
    ".st-hero{position:relative;overflow:hidden;border-radius:22px;padding:22px;background:var(--surface);border:1px solid var(--line)}",
    ".st-hero h2{margin:6px 0 6px;font-size:23px;letter-spacing:-.02em}.st-hero p{margin:0;line-height:1.55;font-size:15px;max-width:62ch}",
    ".st-mini{position:absolute;right:-10px;top:-10px;width:230px;opacity:.9;pointer-events:none}",
    ".st-facts{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.st-fact{font-size:12.5px;font-weight:600;padding:5px 10px;border-radius:999px;background:var(--fill,var(--surface2));color:var(--fg)}",
    ".st-how{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}",
    ".st-how div{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45}.st-how i{flex-shrink:0;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 13%,transparent);color:var(--c)}",
    /* Kopfzeile */
    ".st-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 14px}",
    ".st-clock{display:flex;align-items:baseline;gap:8px;min-width:0}.st-clock b{font-size:32px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1}",
    ".st-clock b span{display:inline-block;animation:stcolon 2s steps(1) infinite}.st-clock.paused b span{animation:none;opacity:.35}",
    "@keyframes stcolon{50%{opacity:.25}}",
    ".st-clock small{font-size:12.5px;color:var(--muted)}",
    ".st-sname{flex:1;min-width:150px}.st-sname b{display:block;font-size:15px;letter-spacing:-.01em}.st-sname span{font-size:12.5px;color:var(--muted)}",
    ".st-prog{height:4px;border-radius:99px;background:var(--fill,var(--surface2));overflow:hidden;margin-top:6px;max-width:220px}.st-prog i{display:block;height:100%;background:var(--c);border-radius:99px;transition:width .6s cubic-bezier(.22,1,.36,1)}",
    ".st-seg{display:inline-flex;padding:3px;border-radius:12px;background:var(--fill,var(--surface2));gap:2px}.st-seg button{all:unset;cursor:pointer;min-width:34px;height:30px;padding:0 8px;border-radius:9px;font-size:13.5px;font-weight:600;color:var(--muted);display:inline-flex;align-items:center;justify-content:center;gap:4px}",
    ".st-seg button[aria-pressed=true]{background:var(--surface);color:var(--fg);box-shadow:0 1px 3px rgba(0,0,0,.12)}",
    ".st-seg button:focus-visible,.st-room:focus-visible,.st-bed:focus-visible,.st-task:focus-visible,.st-ev:focus-visible{outline:3px solid color-mix(in srgb,var(--c) 50%,transparent);outline-offset:2px}",
    /* Layout */
    ".st-main{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:14px;align-items:start}",
    "@media (max-width:1080px){.st-main{grid-template-columns:minmax(0,1fr)}}",
    /* Stationsplan */
    ".st-plan{display:flex;flex-direction:column;gap:10px}",
    ".st-rooms{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}",
    ".st-corr{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:12px;background:repeating-linear-gradient(90deg,transparent 0 14px,color-mix(in srgb,var(--fg) 5%,transparent) 14px 15px);font-size:12px;color:var(--muted);font-weight:600;letter-spacing:.04em;text-transform:uppercase}",
    ".st-corr b{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:var(--surface);border:1px solid var(--line);color:var(--fg);letter-spacing:0;text-transform:none;font-size:12.5px}",
    ".st-room{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:16px;background:var(--surface);border:1px solid var(--line);transition:border-color .2s,transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s;min-width:0}",
    ".st-room:hover{border-color:color-mix(in srgb,var(--c) 45%,var(--line));box-shadow:0 8px 24px -16px color-mix(in srgb,var(--c) 60%,transparent)}",
    ".st-room.ghost{cursor:default;opacity:.55;background:transparent;border-style:dashed}",
    ".st-room.pulse::after{content:'';position:absolute;inset:-1px;border-radius:16px;pointer-events:none;animation:stpulse 2.8s cubic-bezier(.4,0,.2,1) infinite;box-shadow:0 0 0 0 color-mix(in srgb,var(--pc,var(--accent)) 40%,transparent)}",
    "@keyframes stpulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--pc,var(--accent)) 38%,transparent)}70%,100%{box-shadow:0 0 0 9px transparent}}",
    ".st-rh{display:flex;justify-content:space-between;align-items:center;gap:6px}.st-rh b{font-size:15px;letter-spacing:-.01em}",
    ".st-badge{min-width:20px;height:20px;padding:0 6px;border-radius:999px;font-size:11.5px;font-weight:700;display:inline-grid;place-items:center;background:var(--fill,var(--surface2));color:var(--fg)}",
    ".st-badge.due{background:color-mix(in srgb,var(--warn,#ff9500) 18%,transparent);color:var(--warn-ink,#b25e00)}.st-badge.late{background:color-mix(in srgb,var(--bad,#ff3b30) 15%,transparent);color:var(--bad-ink,#d70015)}",
    ".st-beds{display:flex;flex-direction:column;gap:6px}",
    ".st-bed{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:12px;background:var(--fill,var(--surface2));min-width:0;position:relative}",
    ".st-bed .pxavw{width:34px;height:34px;flex-shrink:0}.st-bed .pxavw svg{width:100%;height:100%;display:block;border-radius:50%}",
    ".st-bn{min-width:0;display:flex;flex-direction:column}.st-bed b{font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.st-bed small{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".st-bed.free{background:transparent;border:1px dashed var(--line);color:var(--muted);font-size:12.5px;justify-content:center;min-height:50px}",
    ".st-bl{flex-shrink:0;width:16px;font-size:11px;font-weight:700;color:var(--muted)}",
    ".st-dot{flex-shrink:0;margin-left:auto;width:8px;height:8px;border-radius:50%}",
    ".st-dot.beobachten{background:var(--warn,#ff9500)}.st-dot.kritisch{background:var(--bad,#ff3b30)}",
    ".st-legend{display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:var(--muted)}.st-legend span{display:inline-flex;align-items:center;gap:6px}.st-legend i{width:8px;height:8px;border-radius:50%;display:inline-block}",
    /* Seitenleiste */
    ".st-side{display:flex;flex-direction:column;gap:14px}",
    ".st-tabs{display:none}",
    "@media (max-width:1080px){.st-tabs{display:flex}.st-side .st-card.hidden-m{display:none}}",
    ".st-list{display:flex;flex-direction:column;gap:6px}",
    ".st-task{all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:center;padding:10px;border-radius:12px;transition:background .15s}",
    ".st-task:hover{background:var(--fill,var(--surface2))}",
    ".st-time{flex-shrink:0;width:52px;font-variant-numeric:tabular-nums;font-weight:700;font-size:13.5px}.st-time small{display:block;font-weight:600;font-size:11px;color:var(--muted)}",
    ".st-time.due{color:var(--warn-ink,#b25e00)}.st-time.late{color:var(--bad-ink,#d70015)}",
    ".st-tt{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}.st-tt b{font-size:14px;font-weight:600;line-height:1.3}.st-tt span{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".st-ic{flex-shrink:0;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 12%,transparent);color:var(--c)}",
    ".st-ic.new{background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}",
    ".st-ic.alarm{background:color-mix(in srgb,var(--bad,#ff3b30) 13%,transparent);color:var(--bad-ink,#d70015)}",
    ".st-donebox summary{cursor:pointer;font-size:13.5px;color:var(--muted);padding:6px 2px;font-weight:600}",
    ".st-donei{display:flex;gap:10px;align-items:center;padding:6px 10px;font-size:13.5px;color:var(--muted)}.st-donei b{color:var(--fg);font-weight:600;flex:1;min-width:0}",
    ".st-ev{all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:12px;transition:background .15s;animation:stin .45s cubic-bezier(.22,1,.36,1) both}",
    ".st-ev:hover{background:var(--fill,var(--surface2))}.st-ev p{margin:2px 0 0;font-size:13px;line-height:1.45;color:var(--muted)}.st-ev b{font-size:14px;font-weight:600}",
    ".st-ev.unseen b::after{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-left:6px;vertical-align:middle}",
    "@keyframes stin{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}",
    ".st-empty{font-size:13.5px;color:var(--muted);padding:6px 2px}",
    /* Paneel, Modal, Toast */
    ".st-scrim{position:fixed;inset:0;z-index:2147482000;background:rgba(0,0,0,.36);animation:stfade .25s both}",
    "@keyframes stfade{from{opacity:0}to{opacity:1}}",
    ".st-panel{position:fixed;z-index:2147482100;top:0;right:0;bottom:0;width:min(460px,100vw);background:var(--bg);color:var(--fg);overflow-y:auto;padding:calc(16px + env(safe-area-inset-top)) 16px calc(28px + env(safe-area-inset-bottom));box-shadow:-20px 0 60px -20px rgba(0,0,0,.35);animation:stslide .4s cubic-bezier(.22,1,.36,1) both}",
    "@keyframes stslide{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}",
    "@media (max-width:640px){.st-panel{top:auto;height:90vh;width:100%;border-radius:22px 22px 0 0;animation:stup .4s cubic-bezier(.22,1,.36,1) both}@keyframes stup{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}}",
    ".st-ph{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.st-ph h2{margin:0;font-size:21px;letter-spacing:-.02em}",
    ".st-x{all:unset;cursor:pointer;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--fill,var(--surface2));color:var(--fg)}",
    ".st-pat{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:14px;margin-top:10px}",
    ".st-pat-h{display:flex;gap:12px;align-items:center}.st-pat-h .pxavw{width:56px;height:56px;flex-shrink:0}.st-pat-h .pxavw svg{width:100%;height:100%;border-radius:50%;display:block}",
    ".st-pat-h b{font-size:17px;letter-spacing:-.01em;display:block}.st-pat-h span{font-size:13px;color:var(--muted);display:block;line-height:1.4}",
    ".st-flags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.st-flag{font-size:11.5px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--fill,var(--surface2));color:var(--fg);display:inline-flex;align-items:center;gap:4px}",
    ".st-flag.warn{background:color-mix(in srgb,var(--bad,#ff3b30) 12%,transparent);color:var(--bad-ink,#d70015)}",
    ".st-vmini{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;margin-top:10px}",
    ".st-vmini div{background:var(--fill,var(--surface2));border-radius:12px;padding:7px 9px}.st-vmini small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.st-vmini b{font-size:15px;font-variant-numeric:tabular-nums}",
    ".st-sub{font-size:12.5px;color:var(--muted);margin:10px 0 0}",
    ".st-modal-bg{position:fixed;inset:0;z-index:2147482500;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;padding:20px;animation:stfade .2s both}",
    ".st-modal{background:var(--bg);color:var(--fg);width:100%;max-width:680px;max-height:92vh;overflow-y:auto;border-radius:22px;box-shadow:0 30px 80px -20px rgba(0,0,0,.45);animation:stpop .35s cubic-bezier(.22,1,.36,1) both}",
    "@keyframes stpop{from{transform:translateY(12px) scale(.98);opacity:0}to{transform:none;opacity:1}}",
    "@media (max-width:640px){.st-modal-bg{padding:0;align-items:stretch}.st-modal{max-height:none;height:100%;border-radius:0;padding-top:env(safe-area-inset-top)}}",
    ".st-mh{position:sticky;top:0;z-index:2;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;gap:12px;align-items:center;padding:14px 18px;border-bottom:1px solid var(--line)}",
    ".st-mh .pxavw{width:42px;height:42px;flex-shrink:0}.st-mh .pxavw svg{width:100%;height:100%;border-radius:50%;display:block}",
    ".st-mh div{flex:1;min-width:0}.st-mh b{display:block;font-size:16px;letter-spacing:-.01em}.st-mh span{font-size:12.5px;color:var(--muted)}",
    ".st-mb{padding:18px;display:flex;flex-direction:column;gap:14px}",
    ".st-q{font-size:16px;line-height:1.5;margin:0;font-weight:600;letter-spacing:-.01em}",
    ".st-opts{display:flex;flex-direction:column;gap:8px}",
    ".st-opt{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;background:var(--surface);border:1px solid var(--line);font-size:15px;line-height:1.45;transition:border-color .15s,background .15s}",
    ".st-opt:hover{border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}",
    ".st-opt[aria-pressed=true]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,var(--surface))}",
    ".st-opt i{flex-shrink:0;width:20px;height:20px;border-radius:50%;border:2px solid var(--line);margin-top:1px;display:grid;place-items:center;font-style:normal;font-size:12px;font-weight:700;color:#fff}",
    ".st-opt.multi i{border-radius:6px}.st-opt[aria-pressed=true] i{background:var(--accent);border-color:var(--accent)}",
    ".st-opt.ok{border-color:var(--ok,#34c759);background:var(--ok-soft)}.st-opt.ok i{background:var(--ok,#34c759);border-color:var(--ok,#34c759)}",
    ".st-opt.no{border-color:var(--bad,#ff3b30);background:var(--bad-soft)}.st-opt.no i{background:var(--bad,#ff3b30);border-color:var(--bad,#ff3b30)}",
    ".st-opt.miss{border-style:dashed;border-color:var(--ok,#34c759)}",
    ".st-opt[disabled]{cursor:default}",
    ".st-fb{font-size:14px;line-height:1.5;padding:10px 12px;border-radius:12px;background:var(--fill,var(--surface2))}",
    ".st-fb.ok{background:var(--ok-soft)}.st-fb.no{background:var(--bad-soft)}.st-fb.mid{background:var(--warn-soft)}",
    ".st-fbs{font-size:13.5px;color:var(--muted);margin:4px 0 0 30px;line-height:1.45}",
    ".st-mf{position:sticky;bottom:0;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:12px 18px calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--line);display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}",
    ".st-vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}",
    ".st-vt{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:10px 12px;animation:stvt .5s cubic-bezier(.22,1,.36,1) both}",
    "@keyframes stvt{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".st-vt small{display:block;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.st-vt b{font-size:20px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.st-vt i{font-style:normal;font-size:12px;color:var(--muted);margin-left:3px}",
    ".st-vt.warn{border-color:color-mix(in srgb,var(--bad,#ff3b30) 45%,var(--line))}.st-vt.warn b{color:var(--bad-ink,#d70015)}",
    ".st-measure{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:14px;padding:10px 0}",
    ".st-spin{width:22px;height:22px;border-radius:50%;border:3px solid color-mix(in srgb,var(--c) 20%,transparent);border-top-color:var(--c);animation:stspin .8s linear infinite}",
    "@keyframes stspin{to{transform:rotate(360deg)}}",
    ".st-input{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.st-input input{width:120px;height:44px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--fg);padding:0 12px;font-size:17px;font-variant-numeric:tabular-nums}",
    ".st-order{display:flex;flex-direction:column;gap:8px}.st-ord{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:12px;background:var(--surface);border:1px solid var(--line);font-size:14.5px;line-height:1.45}",
    ".st-ord b{flex-shrink:0;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--on-accent,#fff);font-size:12.5px}",
    ".st-ord.ok{border-color:var(--ok,#34c759);background:var(--ok-soft)}.st-ord.no{border-color:var(--bad,#ff3b30);background:var(--bad-soft)}",
    ".st-art{position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--surface);touch-action:manipulation}",
    ".st-art svg{display:block;width:100%;height:auto}",
    ".st-hit{position:absolute;border-radius:50%;border:2.5px solid var(--ok,#34c759);background:color-mix(in srgb,var(--ok,#34c759) 16%,transparent);transform:translate(-50%,-50%);pointer-events:none;animation:sthit .45s cubic-bezier(.22,1,.36,1) both}",
    ".st-hit.miss{border-color:var(--warn,#ff9500);background:color-mix(in srgb,var(--warn,#ff9500) 14%,transparent);border-style:dashed}",
    ".st-hit.x{border-color:var(--muted);background:transparent;width:22px!important;height:22px!important;animation:stx .7s ease both}",
    "@keyframes sthit{from{transform:translate(-50%,-50%) scale(.4);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}",
    "@keyframes stx{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.2)}}",
    ".st-found{display:flex;flex-direction:column;gap:6px}.st-found div{font-size:14px;line-height:1.45;padding:8px 10px;border-radius:12px;background:var(--fill,var(--surface2))}.st-found div b{display:block}",
    ".st-step{font-size:13px;color:var(--muted);display:flex;justify-content:space-between;gap:8px}",
    ".st-res{display:flex;gap:14px;align-items:center;padding:14px;border-radius:16px;background:var(--surface);border:1px solid var(--line)}",
    ".st-res b{font-size:26px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.st-res span{font-size:13.5px;color:var(--muted);line-height:1.45}",
    ".st-toasts{position:fixed;z-index:2147482400;right:16px;bottom:76px;display:flex;flex-direction:column;gap:8px;width:min(360px,calc(100vw - 32px));pointer-events:none}",
    "@media (max-width:640px){.st-toasts{bottom:calc(132px + env(safe-area-inset-bottom));right:16px}}",
    ".st-toast{pointer-events:auto;all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:flex-start;padding:12px;border-radius:16px;background:var(--surface);border:1px solid var(--line);box-shadow:0 14px 40px -14px rgba(0,0,0,.35);animation:sttoast .45s cubic-bezier(.22,1,.36,1) both}",
    ".st-toast b{display:block;font-size:14px}.st-toast p{margin:2px 0 0;font-size:13px;color:var(--muted);line-height:1.4}",
    "@keyframes sttoast{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}",
    ".st-alert{background:var(--bg);color:var(--fg);max-width:460px;width:100%;border-radius:22px;padding:22px;box-shadow:0 30px 80px -20px rgba(0,0,0,.45);animation:stpop .35s cubic-bezier(.22,1,.36,1) both}",
    ".st-alert h3{margin:10px 0 6px;font-size:19px}.st-alert p{margin:0;line-height:1.55;font-size:15px}",
    /* Auswertung */
    ".st-big{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.st-ring{position:relative;width:112px;height:112px;flex-shrink:0}.st-ring svg{width:112px;height:112px;transform:rotate(-90deg)}.st-ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:30px;font-weight:700;letter-spacing:-.03em}",
    ".st-kats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.st-kat{padding:12px;border-radius:14px;background:var(--fill,var(--surface2))}.st-kat b{font-size:14px;display:flex;justify-content:space-between}.st-kat .st-prog{max-width:none}",
    ".st-tl{display:flex;flex-direction:column}.st-tl div{display:flex;gap:12px;padding:8px 0;border-top:1px solid var(--line);font-size:14px;line-height:1.45}.st-tl div:first-child{border-top:0}.st-tl time{flex-shrink:0;width:44px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--muted)}",
    ".st-akte .scrim{z-index:2147483000!important}.st-akte .drawer{z-index:2147483100!important}",
    "@media (prefers-reduced-motion:reduce){.st-room.pulse::after,.st-clock b span,.st-spin{animation:none}.st-ev,.st-vt,.st-toast{animation:none}}",
    "@media (max-width:760px){.st-rooms{grid-template-columns:minmax(0,1fr)}.st-beds{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.st-bed .st-bl{display:none}.st-bed{padding:7px 8px 7px 7px;gap:8px}.st-room.ghost{display:none}.st-corr{display:none}.st-clock b{font-size:28px}.st-mini{display:none}.st-toast p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}"
  ].join("\n");
  var stEl = document.createElement("style"); stEl.id = "fx-station-css"; stEl.textContent = css; (document.head || document.documentElement).appendChild(stEl);

  /* ================= Symbole ================= */
  var ICO = {
    bed: '<path d="M3 18V7M3 13h18v5M21 18v-3M7 13v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/>',
    walk: '<circle cx="13" cy="4.5" r="2"/><path d="M10 21l2-6 3 3v3M9 12l2-4 4 1 2 3 3 1M11 8l-3 2-1 3"/>',
    box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
    scale: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9a4 4 0 0 1 6 0l-2 3"/>',
    drop: '<path d="M12 3c4 4.5 6.5 8 6.5 11a6.5 6.5 0 0 1-13 0C5.5 11 8 7.5 12 3z"/>',
    drip: '<path d="M9 3h6v6l-1 1v3h-4v-3l-1-1z"/><path d="M12 13v4a3 3 0 0 0 3 3h2"/>',
    pill: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M9.5 8.5l5 7"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/>',
    lung: '<path d="M12 4v8M12 10c-2-1-3 0-4 2-1.5 3-3 6-3 8 0 1 1 1.5 2 1 2-1 4-3 5-5M12 10c2-1 3 0 4 2 1.5 3 3 6 3 8 0 1-1 1.5-2 1-2-1-4-3-5-5"/>',
    steth: '<path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v3a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="12" r="2"/>',
    band: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M10 11h.01M14 13h.01M12 12h.01"/>',
    alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    tube: '<path d="M9 3h6M10 3v14a2 2 0 0 0 4 0V3M10 10h4"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20.5a2 2 0 0 0 4 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chk: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/>'
  };
  function Ic(p) { return h("svg", { viewBox: "0 0 24 24", width: p.s || 18, height: p.s || 18, fill: "none", stroke: "currentColor", strokeWidth: p.w || 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ICO[p.k] || ICO.info } }); }
  function Av(p) { return h("span", { className: "pxavw", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: p.svg || "" } }); }
  var ART_IC = { klingel: "bell", telefon: "phone", alarm: "alert", visite: "steth", aufnahme: "plus", info: "info", labor: "lab" };
  var KAT = { sicherheit: "Sicherheit", fachlich: "Fachliches Handeln", kommunikation: "Kommunikation und Dokumentation", organisation: "Organisation", doku: "Dokumentation" };
  var FLAG = { o2: "Sauerstoff", diabetes: "Diabetes", wunde: "Wunde", sturz: "Sturzrisiko", demenz: "Demenz", allergie: "Allergie", isolation: "Isolation" };

  /* ================= Mini-Grafik für den Start ================= */
  var MINI = '<svg viewBox="0 0 240 150" fill="none"><rect x="10" y="12" width="66" height="54" rx="10" fill="var(--fill,#eef2f6)"/><rect x="86" y="12" width="66" height="54" rx="10" fill="var(--fill,#eef2f6)"/><rect x="162" y="12" width="66" height="54" rx="10" fill="var(--fill,#eef2f6)"/><rect x="10" y="88" width="66" height="54" rx="10" fill="var(--fill,#eef2f6)"/><rect x="86" y="88" width="66" height="54" rx="10" fill="var(--fill,#eef2f6)"/><rect x="162" y="88" width="66" height="54" rx="10" fill="none" stroke="var(--line,#dde3ea)" stroke-dasharray="4 4"/><rect x="18" y="22" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="18" y="42" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="94" y="22" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="94" y="42" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="170" y="22" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="170" y="42" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="18" y="98" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><rect x="94" y="98" width="50" height="14" rx="5" fill="var(--surface,#fff)"/><circle cx="166" cy="16" r="5" fill="#0D9488" opacity=".9"><animate attributeName="r" values="5;8;5" dur="2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;.2;.9" dur="2.8s" repeatCount="indefinite"/></circle><rect x="10" y="72" width="218" height="10" rx="5" fill="var(--fill,#eef2f6)" opacity=".6"/></svg>';

  /* ================= Akte ================= */
  function Akte(p) {
    var sc = p.sc, st = p.st, pid = p.pid, I = info(sc, pid), ps = E.pat(sc, st, pid);
    var tab = uS("vitals");
    if (I.typ === "modul" && window.FP_AKTE_C && I.mi != null) {
      return portal(h("div", { className: "st-akte" }, h(window.FP_AKTE_C, { ctx: { mod: I.mi, ci: I.ci }, S: p.S || {}, close: p.close, addNote: function (k, v) { if (p.setS) p.setS(function (s) { var n = Object.assign({}, s.notes || {}); n[k] = (n[k] || []).concat([v]); return Object.assign({}, s, { notes: n }); }); } })));
    }
    var mess = (st.mess[pid] || []).slice().reverse();
    var lastV = mess[0] ? Object.assign({ label: ft(mess[0].at) + " Uhr" }, mess[0].v) : I.akte && I.akte.nacht ? I.akte.nacht : null;
    var stamm = [], anord = [], verl = [];
    if (I.typ === "pex") (I.daten || []).forEach(function (r) { if (/Medikation|Vorgaben|Sauerstoff|Anordnung|Labor/i.test(r[0])) anord.push(r); else if (/Vitalwerte/i.test(r[0])) verl.push(r); else stamm.push(r); });
    else if (I.akte) { stamm = I.akte.stamm || []; anord = I.akte.anordnungen || []; verl = (I.akte.verlauf || []).slice(); }
    else if (I.facts) stamm = I.facts;
    st.log.filter(function (x) { return x.pat === pid; }).forEach(function (x) { verl.push([ft(x.at) + " heute", x.t + (x.kind === "ereignis" ? ": " + x.d : "")]); });
    var g = lastV ? [["RR", lastV.rr, "mmHg"], ["Puls", lastV.hf, "/min"], ["AF", lastV.af, "/min"], ["SpO₂", lastV.spo2 != null ? lastV.spo2 + " %" + (lastV.o2 ? " · " + lastV.o2 + " O₂" : "") : null, ""], ["Temp.", lastV.t != null ? de(lastV.t, 1) : null, "°C"], ["BZ", lastV.bz, "mg/dl"]].filter(function (x) { return x[1] != null; }) : [];
    return portal(h("div", { className: "st-akte" },
      h("div", { className: "scrim", onClick: p.close }),
      h("aside", { className: "drawer", "aria-label": "Patientenakte", role: "dialog" },
        h("div", { className: "dh" },
          h("div", { className: "av", dangerouslySetInnerHTML: { __html: I.svg } }),
          h("div", { style: { flex: 1, minWidth: 0 } }, h("h2", null, I.name), h("p", null, I.alter + " Jahre · " + I.diagnose)),
          h("button", { type: "button", className: "iconbtn", "aria-label": "Akte schließen", onClick: p.close }, h(Ic, { k: "x" }))),
        h("div", { className: "row", style: { marginBottom: 4 } }, [["vitals", "Vitalwerte"], ["stamm", "Stammdaten"], ["anord", "Anordnungen"], ["verl", "Verlauf"]].map(function (x) {
          return h("button", { type: "button", key: x[0], className: "chip" + (tab[0] === x[0] ? " blue" : ""), "aria-pressed": tab[0] === x[0], style: { border: 0, minHeight: 34 }, onClick: function () { tab[1](x[0]); } }, x[1]);
        })),
        tab[0] === "vitals" ? h("div", { className: "dcard" },
          h("div", { className: "row", style: { justifyContent: "space-between", marginBottom: 10 } }, h("h3", { style: { margin: 0 } }, "Vitalwerte"), h("span", { className: "live" }, h("i"), lastV ? lastV.label : "keine Messung")),
          lastV ? h("div", { className: "vit" }, g.map(function (x) { return h("div", { key: x[0], className: "vt" }, h("small", null, x[0]), h("b", null, String(x[1])), x[2] && /^\d/.test(String(x[1])) ? h("i", null, x[2]) : null); })) : h("p", { className: "muted", style: { margin: 0 } }, "Heute noch nicht gemessen."),
          mess.length > 1 ? h("dl", { className: "dl", style: { marginTop: 12 } }, mess.slice(1).map(function (m, i) { return h("div", { key: i }, h("dt", null, ft(m.at)), h("dd", null, "RR " + m.v.rr + " · HF " + m.v.hf + " · AF " + m.v.af + " · SpO₂ " + m.v.spo2 + " % · T " + de(m.v.t, 1))); })) : null) : null,
        tab[0] === "stamm" ? h("div", { className: "dcard" }, h("h3", null, "Stammdaten"), h("dl", { className: "dl" }, stamm.map(function (r, i) { return h("div", { key: i }, h("dt", null, r[0]), h("dd", null, r[1])); })), I.typText ? h("p", { className: "muted", style: { fontSize: 13.5, margin: "10px 0 0" } }, I.typText) : null) : null,
        tab[0] === "anord" ? h("div", { className: "dcard" }, h("h3", null, "Anordnungen und Medikation"), anord.length ? h("dl", { className: "dl" }, anord.map(function (r, i) { return h("div", { key: i }, h("dt", null, r[0]), h("dd", null, r[1])); })) : h("p", { className: "muted", style: { margin: 0 } }, "Keine Anordnungen hinterlegt.")) : null,
        tab[0] === "verl" ? h("div", { className: "dcard" }, h("h3", null, "Verlauf und Befunde"), verl.length ? h("dl", { className: "dl" }, verl.slice().reverse().map(function (r, i) { return h("div", { key: i }, h("dt", null, r[0]), h("dd", null, r[1])); })) : h("p", { className: "muted", style: { margin: 0 } }, "Noch keine Einträge."), I.anamnese ? h("p", { className: "muted", style: { fontSize: 13.5, margin: "12px 0 0", fontStyle: "italic", lineHeight: 1.5 } }, "„" + I.anamnese.slice(0, 420) + (I.anamnese.length > 420 ? " …" : "") + "“") : null) : null,
        h("p", { className: "muted", style: { fontSize: 12.5, marginTop: 16 } }, "Fiktive Person. " + (I.typ === "pex" ? "Aus der Praktischen Examen Übung (" + I.fallTitel + ")." : "Neuer Fall im Stationsalltag.")))));
  }

  /* ================= Aufgaben-Durchführung ================= */
  function okOf(sc, st, o) { return typeof o.ok === "object" && o.ok ? E.cond(sc, st, o.ok) : !!o.ok; }
  function Quiz(p) {
    var c = p.c, multi = !!c.multi, sel = uS([]), done = uS(false), order = uM(function () { return c.mischen === false ? c.opts.map(function (_, i) { return i; }) : shuffle(c.opts.map(function (_, i) { return i; }), hash(p.seed || c.q)); }, [c.q]);
    var s = sel[0];
    function toggle(i) { if (done[0]) return; if (multi) sel[1](s.indexOf(i) >= 0 ? s.filter(function (x) { return x !== i; }) : s.concat([i])); else sel[1]([i]); }
    function check() {
      done[1](true);
      var oks = c.opts.map(function (o) { return okOf(p.sc, p.st, o); }), score, flags = [];
      if (multi) { var good = oks.filter(Boolean).length, hit = s.filter(function (i) { return oks[i]; }).length, bad = s.filter(function (i) { return !oks[i]; }).length; score = Math.max(0, (hit - bad) / Math.max(1, good)); }
      else { var o = c.opts[s[0]]; score = oks[s[0]] ? 1 : o && o.teil ? 0.5 : 0; }
      s.forEach(function (i) { (c.opts[i].setzt || []).forEach(function (f) { flags.push(f); }); });
      p.onResult({ score: score, flags: flags });
    }
    var oks = done[0] ? c.opts.map(function (o) { return okOf(p.sc, p.st, o); }) : [];
    return h(Fr, null,
      c.q ? h("p", { className: "st-q" }, c.q) : null,
      multi && !done[0] ? h("p", { className: "st-muted", style: { margin: "-6px 0 0", fontSize: 13.5 } }, "Mehrere Antworten sind richtig.") : null,
      h("div", { className: "st-opts", role: multi ? "group" : "radiogroup" }, order.map(function (i) {
        var o = c.opts[i], on = s.indexOf(i) >= 0, cls = "st-opt" + (multi ? " multi" : "");
        if (done[0]) cls += oks[i] && on ? " ok" : !oks[i] && on ? " no" : oks[i] && multi ? " miss" : "";
        return h("div", { key: i },
          h("button", { type: "button", className: cls, "aria-pressed": on, disabled: done[0], role: multi ? "checkbox" : "radio", "aria-checked": on, onClick: function () { toggle(i); } }, h("i", null, done[0] && on ? (oks[i] ? "✓" : "✕") : on ? "✓" : ""), h("span", null, o.t)),
          done[0] && o.fb && (on || (!multi && oks[i])) ? h("p", { className: "st-fbs" }, o.fb) : null);
      })),
      !done[0] ? h("div", { className: "st-row" }, h("button", { type: "button", className: "btn", disabled: !s.length, onClick: check }, "Prüfen")) : null);
  }
  function Reihe(p) {
    var c = p.c, pool = uM(function () { return shuffle(c.items.map(function (_, i) { return i; }), hash(c.q)); }, [c.q]), pick = uS([]), done = uS(false);
    var pk = pick[0];
    function check() { done[1](true); var right = pk.filter(function (x, i) { return x === i; }).length; p.onResult({ score: right / c.items.length }); }
    return h(Fr, null,
      h("p", { className: "st-q" }, c.q),
      h("div", { className: "st-order" }, (done[0] ? pk : pk).map(function (x, i) {
        return h("div", { key: x, className: "st-ord" + (done[0] ? (x === i ? " ok" : " no") : "") }, h("b", null, i + 1), h("span", null, c.items[x]));
      })),
      !done[0] ? h(Fr, null,
        pk.length < c.items.length ? h("p", { className: "st-muted", style: { margin: 0, fontSize: 13.5 } }, "Tippe die Punkte in der richtigen Reihenfolge an.") : null,
        h("div", { className: "st-opts" }, pool.filter(function (x) { return pk.indexOf(x) < 0; }).map(function (x) {
          return h("button", { key: x, type: "button", className: "st-opt", onClick: function () { pick[1](pk.concat([x])); } }, h("i"), h("span", null, c.items[x]));
        })),
        h("div", { className: "st-row" },
          h("button", { type: "button", className: "btn", disabled: pk.length < c.items.length, onClick: check }, "Prüfen"),
          pk.length ? h("button", { type: "button", className: "btn ghost", onClick: function () { pick[1]([]); } }, "Zurücksetzen") : null)) :
        pk.some(function (x, i) { return x !== i; }) ? h("div", { className: "st-fb" }, h("b", null, "Richtige Reihenfolge:"), h("ol", { style: { margin: "6px 0 0", paddingLeft: 20 } }, c.items.map(function (t, i) { return h("li", { key: i }, t); }))) : h("div", { className: "st-fb ok" }, "Alles in der richtigen Reihenfolge."));
  }
  function Zahl(p) {
    var c = p.c, val = uS(""), done = uS(null);
    function check() { var n = num(val[0]); if (n == null) return; var ok = Math.abs(n - c.wert) <= (c.tol || 0); done[1]({ ok: ok, n: n }); p.onResult({ score: ok ? 1 : 0 }); }
    return h(Fr, null,
      h("p", { className: "st-q" }, c.q),
      h("div", { className: "st-input" },
        h("input", { type: "text", inputMode: "decimal", value: val[0], disabled: !!done[0], "aria-label": "Antwort in " + c.einheit, onChange: function (e) { val[1](e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") check(); } }),
        h("span", null, c.einheit),
        !done[0] ? h("button", { type: "button", className: "btn", disabled: num(val[0]) == null, onClick: check }, "Prüfen") : null),
      done[0] ? h("div", { className: "st-fb " + (done[0].ok ? "ok" : "no") }, h("b", null, done[0].ok ? "Richtig. " : "Nicht ganz. Richtig ist " + (c.vorzeichen && c.wert > 0 ? "+" : "") + String(c.wert).replace(".", ",") + " " + c.einheit + ". "), c.erkl) : null);
  }
  /* Auffällige Messwerte farbig markieren (Orientierung, kein Score) */
  function auff(v, copd) {
    var af = num(v.af), sp = num(v.spo2), rr = num(String(v.rr || "").split("/")[0]), hf = num(v.hf), t = num(v.t);
    return { rr: rr != null && (rr <= 100 || rr >= 200), hf: hf != null && (hf <= 50 || hf >= 111), af: af != null && (af <= 11 || af >= 21), spo2: sp != null && (copd ? sp < 88 : sp <= 93), t: t != null && (t <= 35 || t >= 39.1) };
  }
  function Messen(p) {
    var c = p.c, sc = p.sc, st = p.st, ps = uM(function () { return E.pat(sc, st, p.t.pat); }, []), v = ps.v || {}, phase = uS("mess"), copd = !!ps.copd;
    var w = auff(v, copd);
    uE(function () { var t = setTimeout(function () { phase[1]("werte"); }, 1100); return function () { clearTimeout(t); }; }, []);
    var nur = c.nur;
    var all = [["RR", v.rr, "mmHg", "rr", w.rr], ["Puls", v.hf, "/min", "hf", w.hf], ["AF", v.af, "/min", "af", w.af], ["SpO₂", v.spo2, "%", "spo2", w.spo2], ["O₂", v.o2 || "keiner", "", "o2", false], ["Temp.", v.t != null ? de(v.t, 1) : null, "°C", "t", w.t], ["Bewusstsein", v.bw ? BW[v.bw] : null, "", "bw", v.bw && v.bw !== "A"], ["BZ", v.bz, "mg/dl", "bz", v.bz != null && (v.bz < 70 || v.bz > 200)]];
    var show = all.filter(function (x) { return x[1] != null && (!nur || nur.indexOf(x[3]) >= 0); });
    return h(Fr, null,
      phase[0] === "mess" ? h("div", { className: "st-measure" }, h("span", { className: "st-spin" }), "Du misst bei " + info(sc, p.t.pat).anrede + " …") :
        h(Fr, null,
          h("div", { className: "st-vgrid" }, show.map(function (x, i) { return h("div", { key: x[0], className: "st-vt" + (x[4] ? " warn" : ""), style: { animationDelay: i * 90 + "ms" } }, h("small", null, x[0]), h("b", { style: x[3] === "bw" || x[3] === "o2" ? { fontSize: 15 } : null }, String(x[1])), x[2] && /^\d/.test(String(x[1])) ? h("i", null, x[2]) : null); })),
          ps.hinweis && !nur ? h("div", { className: "st-fb" }, h("b", null, "Du beobachtest: "), ps.hinweis) : null,
          c.frage ? h(Quiz, { c: c.frage, sc: sc, st: st, seed: p.t.id, onResult: function (r) { p.onResult({ score: r.score, flags: r.flags, mess: v }); } }) : null,
          !c.frage ? h("div", { className: "st-row" }, h("button", { type: "button", className: "btn", onClick: function () { p.onResult({ score: 1, mess: v }); } }, "Messung dokumentieren")) : null));
  }
  function Befund(p) {
    var L = pexLive(p.c.fall, p.c.k);
    var hits = uS([]), miss = uS([]), done = uS(false), ref = uR(null);
    if (!L) return h("p", { className: "st-muted" }, "Dieser Bildbefund ist nicht verfügbar.");
    var art = typeof L.art === "function" ? L.art() : L.art, spots = L.spots || [];
    function tap(e) {
      if (done[0]) return;
      var r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 400, y = (e.clientY - r.top) / r.height * 280;
      var idx = -1; spots.forEach(function (s, i) { if (hits[0].indexOf(i) >= 0) return; s.c.forEach(function (c) { var dx = x - c[0], dy = y - c[1]; if (dx * dx + dy * dy <= Math.pow(c[2] + 8, 2)) idx = i; }); });
      if (idx >= 0) hits[1](hits[0].concat([idx])); else { var m = { x: x, y: y, k: Date.now() }; miss[1](miss[0].concat([m]).slice(-4)); }
    }
    function finish() { done[1](true); p.onResult({ score: hits[0].length / Math.max(1, spots.length) }); }
    var pct = function (v, d) { return v / d * 100 + "%"; };
    return h(Fr, null,
      h("p", { className: "st-q" }, L.q || "Was fällt dir auf?"),
      L.intro ? h("p", { className: "st-muted", style: { margin: "-6px 0 0", fontSize: 14, lineHeight: 1.5 } }, L.intro) : null,
      h("div", { className: "st-art", ref: ref, onClick: tap, role: "img", "aria-label": "Bildbefund: tippe auf Auffälligkeiten" },
        h("svg", { viewBox: "0 0 400 280", className: String(art || "").indexOf("<defs>") === 0 ? "pxart2" : "hart pxart", dangerouslySetInnerHTML: { __html: art } }),
        spots.map(function (s, i) { var on = hits[0].indexOf(i) >= 0; if (!on && !done[0]) return null; var c = s.c[0]; return h("span", { key: i, className: "st-hit" + (on ? "" : " miss"), style: { left: pct(c[0], 400), top: pct(c[1], 280), width: pct(c[2] * 2, 400), height: pct(c[2] * 2, 280) } }); }),
        miss[0].map(function (m) { return h("span", { key: m.k, className: "st-hit x", style: { left: pct(m.x, 400), top: pct(m.y, 280) } }); })),
      h("div", { className: "st-step" }, h("span", null, hits[0].length + " von " + spots.length + " gefunden"), !done[0] ? h("span", null, L.cap || "Tippe auf alles, was dir auffällt.") : null),
      h("div", { className: "st-found" }, spots.map(function (s, i) { var on = hits[0].indexOf(i) >= 0; if (!on && !done[0]) return null; return h("div", { key: i, style: on ? null : { opacity: .75 } }, h("b", null, (on ? "✓ " : "Übersehen: ") + s.t), s.d); })),
      !done[0] ? h("div", { className: "st-row" }, h("button", { type: "button", className: "btn", onClick: finish }, hits[0].length === spots.length ? "Fertig" : "Fertig, auflösen")) : null,
      done[0] && L.merke ? h("div", { className: "st-fb" }, h("b", null, "Merke: "), L.merke) : null);
  }
  function Pflege(p) {
    var L = pexLive(p.c.fall, p.c.k);
    var i = uS(0), err = uS(0), ko = uS(0), msg = uS(null), done = uS(false);
    if (!L || !L.steps) return h("p", { className: "st-muted" }, "Diese Simulation ist nicht verfügbar.");
    var steps = L.steps, n = steps.length, cur = i[0];
    var opts = uM(function () {
      if (cur >= n) return [];
      var wrong = (L.wrong || []).map(function (w) { return { t: w.t, ok: false, fb: w.fb, ko: w.ko }; });
      var later = steps.slice(cur + 2).map(function (s) { return { t: s.t, ok: false, fb: "Das kommt später. Was ist jetzt dran?" }; });
      var pool = shuffle(wrong.concat(later), hash(L.k + cur)).slice(0, 2);
      return shuffle([{ t: steps[cur].t, ok: true, fb: steps[cur].fb }].concat(pool), hash(L.k + "o" + cur));
    }, [cur]);
    function choose(o) {
      if (done[0]) return;
      if (o.ok) {
        msg[1]({ ok: true, t: o.fb, say: steps[cur].say });
        if (cur + 1 >= n) { done[1](true); i[1](n); var sc0 = Math.max(0, 1 - err[0] * 0.1 - ko[0] * 0.25); p.onResult({ score: sc0 }); }
        else i[1](cur + 1);
      } else { err[1](err[0] + 1); if (o.ko) ko[1](ko[0] + 1); msg[1]({ ok: false, ko: o.ko, t: o.fb || "Das passt hier nicht." }); }
    }
    var svg = L.scene ? L.scene(Math.min(cur, n)) : "";
    return h(Fr, null,
      cur === 0 && !msg[0] ? h("p", { className: "st-muted", style: { margin: 0, fontSize: 14, lineHeight: 1.5 } }, L.intro) : null,
      h("div", { className: "st-art" }, h("svg", { key: "sc" + cur, viewBox: "0 0 400 280", className: "pxart2", dangerouslySetInnerHTML: { __html: svg } })),
      h("div", { className: "st-step" }, h("span", null, done[0] ? "Alle " + n + " Schritte geschafft" : "Schritt " + (cur + 1) + " von " + n), h("span", null, err[0] ? err[0] + " Fehler" + (ko[0] ? ", davon " + ko[0] + " kritisch" : "") : "")),
      msg[0] ? h("div", { className: "st-fb " + (msg[0].ok ? "ok" : msg[0].ko ? "no" : "mid"), "aria-live": "polite" }, h("b", null, msg[0].ok ? "Richtig. " : msg[0].ko ? "Kritischer Fehler. " : "Nicht jetzt. "), msg[0].t, msg[0].say ? h("div", { style: { marginTop: 6, fontStyle: "italic" } }, "„" + msg[0].say + "“") : null) : null,
      !done[0] ? h(Fr, null, h("p", { className: "st-q", style: { fontSize: 15 } }, "Was machst du als Nächstes?"), h("div", { className: "st-opts" }, opts.map(function (o, k) { return h("button", { key: cur + "-" + k, type: "button", className: "st-opt", onClick: function () { choose(o); } }, h("i"), h("span", null, o.t)); }))) :
        L.merke ? h("div", { className: "st-fb" }, h("b", null, "Merke: "), L.merke) : null);
  }
  function Runner(p) {
    var sc = p.sc, st = p.st, t = p.t, I = t.pat ? info(sc, t.pat) : null, rm = t.pat ? roomOf(sc, t.pat) : { nr: t.zimmer };
    var res = uS(null), startedAt = uR(st.clock), akte = uS(false);
    var due = E.due(sc, st, t), late = due != null ? Math.max(0, st.clock - due) : 0;
    var c = t.inhalt, body;
    function onResult(r) { res[1](r); }
    if (c.typ === "quiz") body = h(Quiz, { c: c, sc: sc, st: st, seed: t.id, onResult: onResult });
    else if (c.typ === "reihe") body = h(Reihe, { c: c, onResult: onResult });
    else if (c.typ === "zahl") body = h(Zahl, { c: c, onResult: onResult });
    else if (c.typ === "messen") body = h(Messen, { c: c, sc: sc, st: st, t: t, onResult: onResult });
    else if (c.typ === "befund") body = h(Befund, { c: c, onResult: onResult });
    else if (c.typ === "pflege") body = h(Pflege, { c: c, onResult: onResult });
    var r = res[0], factor = late > 30 ? 0.6 : late > 10 ? 0.8 : 1, pts = r ? Math.round((t.punkte || 10) * Math.max(0, Math.min(1, r.score)) * factor * 10) / 10 : 0;
    uE(function () { function k(e) { if (e.key === "Escape" && !r) p.cancel(); } document.addEventListener("keydown", k); return function () { document.removeEventListener("keydown", k); }; }, [r]);
    return portal(h("div", { className: "st-modal-bg", onClick: function (e) { if (e.target === e.currentTarget && !r) p.cancel(); } },
      h("div", { className: "st-modal", role: "dialog", "aria-modal": "true", "aria-label": t.t },
        h("div", { className: "st-mh" },
          I ? h(Av, { svg: I.svg }) : h("span", { className: "st-ic" }, h(Ic, { k: t.icon || "bed" })),
          h("div", null, h("b", null, t.t), h("span", null, (I ? I.anrede + " · " : "") + (rm.nr ? "Zimmer " + rm.nr : "Stützpunkt") + (due != null ? " · fällig " + ft(due) : "") + " · ca. " + (t.dauer || 5) + " Min.")),
          !r ? h("button", { type: "button", className: "st-x", "aria-label": "Später erledigen", onClick: p.cancel }, h(Ic, { k: "x" })) : null),
        h("div", { className: "st-mb" },
          late > 10 && !r ? h("div", { className: "st-fb mid" }, "Diese Aufgabe ist seit " + Math.round(late) + " Minuten überfällig.") : null,
          t.akte && t.pat ? h("div", { className: "st-row" }, h("button", { type: "button", className: "btn ghost sm", onClick: function () { akte[1](true); } }, h(Ic, { k: "file", s: 16 }), "Patientenakte öffnen")) : null,
          body,
          r ? h("div", { className: "st-res", "aria-live": "polite" },
            h("b", null, de(pts) + " / " + (t.punkte || 10)),
            h("span", null, (r.score >= 0.99 ? "Sehr gut gemacht." : r.score >= 0.6 ? "Gut, mit kleinen Lücken." : "Das solltest du noch einmal üben.") + (factor < 1 ? " Wegen der Verspätung zählen nur " + Math.round(factor * 100) + " % der Punkte." : "") + " Die Aufgabe kostet " + (t.dauer || 5) + " Minuten Stationszeit.")) : null,
          r && t.link && window.FP_openTraining ? h("p", { className: "st-muted", style: { margin: 0, fontSize: 13.5 } }, "Vertiefen: ", h("a", { href: "#", onClick: function (e) { e.preventDefault(); p.finish(r, startedAt.current, t.link); } }, t.link.t), " (die Schicht wird pausiert und gespeichert).") : null),
        r ? h("div", { className: "st-mf" }, h("button", { type: "button", className: "btn", onClick: function () { p.finish(r, startedAt.current); } }, "Zurück zur Station", h(Ic, { k: "right", s: 18 }))) : null),
      akte[0] ? h(Akte, { sc: sc, st: st, pid: t.pat, S: p.S, setS: p.setS, close: function () { akte[1](false); } }) : null));
  }

  /* ================= Stationsansicht ================= */
  function taskState(sc, st, t) {
    if (st.done[t.id]) return "done";
    var d = E.due(sc, st, t); if (d == null) return "open";
    return st.clock > d ? "late" : d - st.clock <= 15 ? "due" : "open";
  }
  function Bed(p) {
    var sc = p.sc, st = p.st, pid = p.pid, letter = p.letter;
    if (!pid || !E.present(sc, st, pid)) {
      var pp = pid ? sc.patienten[pid] : null;
      return h("div", { className: "st-bed free" }, pp && pp.kommt ? "frei · Aufnahme " + pp.kommt : "frei");
    }
    var I = info(sc, pid), ps = E.pat(sc, st, pid);
    return h("div", { className: "st-bed" },
      h("span", { className: "st-bl" }, letter),
      h(Av, { svg: I.svg }),
      h("span", { className: "st-bn" }, h("b", null, shortName(I.name)), h("small", null, I.alter + " J. · " + String(I.diagnose || "").split(/[,;·(]/)[0])),
      ps.status !== "stabil" ? h("i", { className: "st-dot " + ps.status, title: ps.status === "kritisch" ? "kritisch" : "beobachten", "aria-label": ps.status }) : null);
  }
  function Room(p) {
    var sc = p.sc, st = p.st, z = p.z;
    var pids = z.betten.filter(function (x) { return x && E.present(sc, st, x); });
    var tasks = E.tasks(sc, st).filter(function (t) { return !st.done[t.id] && (pids.indexOf(t.pat) >= 0 || t.zimmer === z.nr); });
    var late = tasks.filter(function (t) { return taskState(sc, st, t) === "late"; }).length, due = tasks.filter(function (t) { return taskState(sc, st, t) === "due"; }).length;
    var unseen = st.log.some(function (x) { return x.kind === "ereignis" && x.pat && pids.indexOf(x.pat) >= 0 && !st.seen[x.id]; });
    var crit = pids.some(function (x) { return E.pat(sc, st, x).status === "kritisch"; });
    var pulse = unseen || late > 0 || (crit && tasks.length > 0);
    var pc = crit || late ? "var(--bad,#ff3b30)" : "var(--accent)";
    return h("button", { type: "button", className: "st-room" + (pulse ? " pulse" : ""), style: { "--pc": pc }, onClick: function () { p.open(z.nr); }, "aria-label": "Zimmer " + z.nr + ", " + tasks.length + " offene Aufgaben" },
      h("span", { className: "st-rh" }, h("b", null, "Zimmer " + z.nr),
        tasks.length ? h("span", { className: "st-badge" + (late ? " late" : due ? " due" : ""), title: tasks.length + " offen" }, tasks.length) : h("span", { className: "st-badge", style: { background: "transparent", color: "var(--ok-ink,#1e8e3e)" } }, h(Ic, { k: "chk", s: 14 }))),
      h("span", { className: "st-beds" }, z.betten.map(function (pid, i) { return h(Bed, { key: i, sc: sc, st: st, pid: pid, letter: "AB"[i] }); })));
  }
  function TaskRow(p) {
    var sc = p.sc, st = p.st, t = p.t, s = taskState(sc, st, t), d = E.due(sc, st, t), I = t.pat ? info(sc, t.pat) : null, rm = t.pat ? roomOf(sc, t.pat).nr : t.zimmer;
    var lbl = d == null ? "" : s === "late" ? Math.round(st.clock - d) + " Min. drüber" : s === "due" ? "in " + Math.max(0, Math.round(d - st.clock)) + " Min." : "";
    return h("button", { type: "button", className: "st-task", onClick: function () { p.start(t); } },
      h("span", { className: "st-time " + (s === "late" ? "late" : s === "due" ? "due" : "") }, d != null ? ft(d) : "jetzt", lbl ? h("small", null, lbl) : null),
      h("span", { className: "st-tt" }, h("b", null, t.t), h("span", null, (rm ? "Zi. " + rm : "Stützpunkt") + (I ? " · " + I.anrede : ""))),
      h("span", { className: "st-ic" + (t.fall ? " new" : "") }, h(Ic, { k: t.icon || "clip", s: 16 })));
  }
  function EvRow(p) {
    var x = p.x, a = x.art;
    return h("button", { type: "button", className: "st-ev" + (p.unseen ? " unseen" : ""), onClick: p.onClick },
      h("span", { className: "st-ic" + (a === "alarm" ? " alarm" : " new") }, h(Ic, { k: ART_IC[a] || "info", s: 16 })),
      h("span", { style: { minWidth: 0 } }, h("b", null, ft(x.at) + " · " + x.t), h("p", null, x.d)));
  }
  function RoomPanel(p) {
    var sc = p.sc, st = p.st, z = sc.zimmer.filter(function (x) { return x.nr === p.nr; })[0], akte = uS(null);
    uE(function () { function k(e) { if (e.key === "Escape" && !akte[0]) p.close(); } document.addEventListener("keydown", k); return function () { document.removeEventListener("keydown", k); }; }, [akte[0]]);
    if (!z) return null;
    var pids = z.betten.filter(function (x) { return x && E.present(sc, st, x); });
    var roomTasks = E.tasks(sc, st).filter(function (t) { return t.zimmer === z.nr && !t.pat; });
    function vm(pid) {
      var m = (st.mess[pid] || []); m = m[m.length - 1]; if (!m) return null;
      var v = m.v, rows = [["RR", v.rr], ["Puls", v.hf], ["AF", v.af], ["SpO₂", v.spo2 != null ? v.spo2 + " %" : null], ["Temp.", v.t != null ? de(v.t, 1) : null], ["BZ", v.bz]].filter(function (x) { return x[1] != null; });
      return h(Fr, null, h("p", { className: "st-sub" }, "Zuletzt gemessen " + ft(m.at) + " Uhr"), h("div", { className: "st-vmini" }, rows.map(function (r) { return h("div", { key: r[0] }, h("small", null, r[0]), h("b", null, String(r[1]))); })));
    }
    function list(ts) {
      if (!ts.length) return h("p", { className: "st-empty" }, "Gerade keine Aufgaben.");
      return h("div", { className: "st-list", style: { marginTop: 6 } }, ts.map(function (t) {
        var d = st.done[t.id];
        if (d) return h("div", { key: t.id, className: "st-donei" }, h(Ic, { k: "chk", s: 16 }), h("b", null, t.t), h("span", null, de(d.pts) + "/" + d.max));
        return h(TaskRow, { key: t.id, sc: sc, st: st, t: t, start: p.start });
      }));
    }
    return portal(h(Fr, null,
      h("div", { className: "st-scrim", onClick: p.close }),
      h("aside", { className: "st-panel", role: "dialog", "aria-modal": "true", "aria-label": "Zimmer " + z.nr },
        h("div", { className: "st-ph" }, h("div", null, h("div", { className: "eyebrow" }, sc.station), h("h2", null, "Zimmer " + z.nr)), h("button", { type: "button", className: "st-x", "aria-label": "Schließen", onClick: p.close }, h(Ic, { k: "x" }))),
        pids.length ? null : h("p", { className: "st-empty" }, "Zurzeit niemand im Zimmer."),
        pids.map(function (pid) {
          var I = info(sc, pid), ps = E.pat(sc, st, pid), rm = roomOf(sc, pid);
          var ts = E.tasks(sc, st).filter(function (t) { return t.pat === pid; }).sort(function (a, b) { return (st.done[a.id] ? 1 : 0) - (st.done[b.id] ? 1 : 0) || (E.due(sc, st, a) || 0) - (E.due(sc, st, b) || 0); });
          var evs = st.log.filter(function (x) { return x.kind === "ereignis" && x.pat === pid; }).slice(-2).reverse();
          return h("section", { key: pid, className: "st-pat" },
            h("div", { className: "st-pat-h" }, h(Av, { svg: I.svg }), h("div", { style: { minWidth: 0 } }, h("b", null, I.name + ", " + I.alter), h("span", null, "Bett " + rm.bett + " · " + I.diagnose))),
            h("div", { className: "st-flags" },
              ps.status !== "stabil" ? h("span", { className: "st-flag" + (ps.status === "kritisch" ? " warn" : "") }, ps.status === "kritisch" ? "kritisch" : "beobachten") : null,
              (I.flags || []).map(function (f) { return h("span", { key: f, className: "st-flag" + (f === "allergie" ? " warn" : "") }, f === "allergie" && I.allergie ? "Allergie: " + String(I.allergie).split(/[(,]/)[0].trim() : FLAG[f] || f); })),
            I.uebergabe ? h("p", { className: "st-sub", style: { lineHeight: 1.5 } }, h("b", { style: { color: "var(--fg)" } }, "Übergabe: "), I.uebergabe) : null,
            vm(pid),
            evs.map(function (x) { return h("div", { key: x.id, className: "st-fb", style: { marginTop: 10, fontSize: 13.5 } }, h("b", null, ft(x.at) + " " + x.t + ": "), x.d); }),
            h("div", { className: "st-row", style: { marginTop: 12 } },
              h("button", { type: "button", className: "btn ghost sm", onClick: function () { akte[1](pid); } }, h(Ic, { k: "file", s: 16 }), "Patientenakte"),
              I.typ === "modul" && window.FP_openModule ? h("button", { type: "button", className: "btn ghost sm", onClick: function () { p.leave(function () { window.FP_openModule(I.mi); }); } }, h(Ic, { k: "book", s: 16 }), "Fallmodul") : null),
            h("h4", { className: "st-h3", style: { marginTop: 14, marginBottom: 0 } }, "Aufgaben"),
            list(ts));
        }),
        roomTasks.length ? h("section", { className: "st-pat" }, h("h4", { className: "st-h3", style: { marginBottom: 0 } }, "Zimmer"), list(roomTasks)) : null),
      akte[0] ? h(Akte, { sc: sc, st: st, pid: akte[0], S: p.S, setS: p.setS, close: function () { akte[1](null); } }) : null));
  }
  function Ring(p) {
    var r = 50, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, p.v || 0)), sv = uS(0);
    uE(function () { var t = setTimeout(function () { sv[1](v); }, 60); return function () { clearTimeout(t); }; }, [v]);
    return h("div", { className: "st-ring", role: "img", "aria-label": v + " Prozent" },
      h("svg", { viewBox: "0 0 112 112" }, h("circle", { cx: 56, cy: 56, r: r, fill: "none", stroke: "var(--fill,var(--surface2))", strokeWidth: 10 }), h("circle", { cx: 56, cy: 56, r: r, fill: "none", stroke: "var(--c)", strokeWidth: 10, strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c * (1 - sv[0] / 100), style: { transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" } })),
      h("b", null, v + " %"));
  }
  function stufe(p) { return p >= 90 ? "Sehr gut" : p >= 75 ? "Gut" : p >= 60 ? "Solide" : p >= 40 ? "Ausbaufähig" : "Noch am Anfang"; }
  function Ende(p) {
    var sc = p.sc, st = p.st, s = E.score(sc, st);
    var kats = ["sicherheit", "fachlich", "kommunikation", "organisation"].filter(function (k) { return s.kats[k]; });
    var open = sc.aufgaben.filter(function (t) { return (st.seenTasks[t.id]) && !st.done[t.id]; });
    var fall = sc.aufgaben.filter(function (t) { return t.fall && st.seenTasks[t.id]; });
    return h("div", { className: "st" },
      h("div", { className: "st-card" },
        h("div", { className: "st-big" }, h(Ring, { v: s.pct }),
          h("div", { style: { flex: "1 1 240px" } },
            h("div", { className: "eyebrow" }, sc.schicht + " · " + sc.station),
            h("h2", { style: { margin: "6px 0", fontSize: 22, letterSpacing: "-.02em" } }, stufe(s.pct)),
            h("p", { style: { margin: 0, lineHeight: 1.55 } }, (st.clock < tm(sc.ende) ? "Vorzeitig beendet um " + ft(st.clock) + " Uhr. " : "") + s.erledigt + " Aufgaben erledigt, " + s.offen + " offen geblieben. " + s.puenktlich + " % rechtzeitig. " + (st.malus.length ? st.malus.length + " kritische Situation" + (st.malus.length > 1 ? "en" : "") + " sind entstanden." : "Keine kritische Situation ist entstanden."))))),
      h("div", { className: "st-kats" }, kats.map(function (k) {
        var x = s.kats[k], pc = x.max ? Math.max(0, Math.round(x.pts / x.max * 100)) : 0;
        return h("div", { key: k, className: "st-kat" }, h("b", null, h("span", null, KAT[k] || k), h("span", null, pc + " %")), h("div", { className: "st-prog" }, h("i", { style: { width: pc + "%" } })));
      }).concat([h("div", { key: "p", className: "st-kat" }, h("b", null, h("span", null, "Pünktlichkeit"), h("span", null, s.puenktlich + " %")), h("div", { className: "st-prog" }, h("i", { style: { width: s.puenktlich + "%" } })))])),
      st.malus.length ? h("div", { className: "st-card" }, h("h3", { className: "st-h3" }, "Kritische Situationen"), st.malus.map(function (m) { return h("div", { key: m.id, className: "st-fb no", style: { marginTop: 6 } }, h("b", null, ft(m.at) + " · −" + m.pts + " Punkte: "), m.t); })) : null,
      fall.length ? h("div", { className: "st-card" }, h("h3", { className: "st-h3" }, sc.neuerFall && sc.patienten[sc.neuerFall] ? "Neuer Fall: " + info(sc, sc.neuerFall).name : "Die kritischen Verläufe dieser Schicht"),
        sc._var && sc._var.dramen.length ? h("p", { className: "st-muted", style: { margin: "0 0 8px", fontSize: 13.5 } }, sc._var.dramen.join(" · ")) : null,
        h("div", { className: "st-list" }, fall.map(function (t) { var d = st.done[t.id]; return h("div", { key: t.id, className: "st-donei" }, h(Ic, { k: d ? "chk" : "clock", s: 16 }), h("b", null, t.t), h("span", null, d ? de(d.pts) + "/" + d.max + (d.late > 10 ? " · " + d.late + " Min. spät" : "") : "offen")); }))) : null,
      open.length ? h("div", { className: "st-card" }, h("h3", { className: "st-h3" }, "Offen geblieben (zur Übergabe)"), h("div", { className: "st-list" }, open.map(function (t) { var I = t.pat ? info(sc, t.pat) : null; return h("div", { key: t.id, className: "st-donei" }, h(Ic, { k: "flag", s: 16 }), h("b", null, t.t), h("span", null, I ? I.anrede : "Zi. " + t.zimmer)); }))) : null,
      h("div", { className: "st-card" }, h("h3", { className: "st-h3" }, "Deine Schicht im Rückblick"), h("div", { className: "st-tl" }, st.log.map(function (x, i) { return h("div", { key: i }, h("time", null, ft(x.at)), h("span", null, h("b", null, x.t), " · ", h("span", { className: "st-muted" }, x.d))); }))),
      h("div", { className: "st-row" },
        h("button", { type: "button", className: "btn", onClick: p.restart }, h(Ic, { k: "redo", s: 18 }), "Neue Schicht starten"),
        h("button", { type: "button", className: "btn ghost", onClick: p.home }, "Zur Übersicht")),
      h("p", { className: "st-muted", style: { fontSize: 12.5, margin: 0 } }, "Alle Personen sind erfunden. Jede neue Schicht verläuft etwas anders. Die Bewertung ist eine Lernhilfe und keine Prüfungsnote."));
  }

  /* ================= Hauptkomponente ================= */
  function Station(p) {
    var sc0 = DATA.szenarien[0], VAR = window.FP_STATION_VAR;
    function baseOf(id) { return DATA.szenarien.filter(function (x) { return x.id === id; })[0] || sc0; }
    /* Zufalls-Engine: aus Szenario und gespeicherter Zufallszahl entsteht die konkrete, einmalige Schicht */
    function concrete(id, seed) { var b = baseOf(id); return VAR && seed != null ? VAR.build(b, seed, info) : b; }
    var saved = p.S && p.S.station && p.S.station.cur;
    var stS = uS(function () { return saved && saved.sid && !saved.ended ? saved : null; });
    var st = stS[0], sc = st ? concrete(st.sid, st.seed) : sc0;
    var view = uS(st ? (st.started ? "plan" : "uebergabe") : "start");
    var panel = uS(null), task = uS(null), toasts = uS([]), alert = uS(null), side = uS("aufgaben"), running = uS(false), ask = uS(false);
    var acc = uR(0), stRef = uR(st), lastSave = uR(0);
    stRef.current = st;

    function persist(ns, force) {
      if (!p.setS) return;
      var now = Date.now();
      if (!force && now - lastSave.current < 4000) return;
      lastSave.current = now;
      p.setS(function (s) { var o = Object.assign({ hist: [] }, s.station || {}); return Object.assign({}, s, { station: { cur: ns, hist: o.hist || [] } }); });
    }
    function notify(evs, ns) {
      if (!evs.length) return;
      var tt = evs.map(function (e) { return { k: e.id + Date.now(), e: e }; });
      toasts[1](function (a) { return a.concat(tt).slice(-3); });
      tt.forEach(function (x) { setTimeout(function () { toasts[1](function (a) { return a.filter(function (y) { return y.k !== x.k; }); }); }, 6500); });
      var crit = evs.filter(function (e) { return e.pause; })[0];
      if (crit) { running[1](false); alert[1](crit); }
      persist(ns, true);
    }
    function apply(fn) {
      var ns = E.copy(stRef.current), evs = fn(ns) || [];
      stRef.current = ns; stS[1](ns); notify(evs, ns);
      if (ns.ended) { running[1](false); persist(ns, true); view[1]("ende"); }
      return ns;
    }
    /* Uhr */
    uE(function () {
      if (!running[0] || task[0] || alert[0] || view[0] !== "plan") return;
      var last = Date.now();
      var iv = setInterval(function () {
        var now = Date.now(), dt = now - last; last = now;
        var cur = stRef.current; if (!cur || cur.ended) return;
        acc.current += dt * (cur.speed || 1);
        if (acc.current >= MS_PER_MIN) {
          var mins = Math.floor(acc.current / MS_PER_MIN); acc.current -= mins * MS_PER_MIN;
          apply(function (ns) { return E.advance(sc, ns, Math.floor(ns.clock) + mins); });
          persist(stRef.current, false);
        }
      }, 250);
      return function () { clearInterval(iv); };
    }, [running[0], task[0], alert[0], view[0]]);
    uE(function () { function vis() { if (document.hidden) running[1](false); } document.addEventListener("visibilitychange", vis); return function () { document.removeEventListener("visibilitychange", vis); }; }, []);
    uE(function () { return function () { if (stRef.current && p.setS) { var ns = stRef.current; p.setS(function (s) { var o = Object.assign({ hist: [] }, s.station || {}); return Object.assign({}, s, { station: { cur: ns, hist: o.hist || [] } }); }); } }; }, []);

    function start(scn) { var ns = E.init(concrete(scn.id, VAR ? VAR.seed() : null)); stRef.current = ns; stS[1](ns); view[1]("uebergabe"); persist(ns, true); top(); }
    function begin() { apply(function (ns) { ns.started = true; return E.advance(sc, ns, ns.clock); }); view[1]("plan"); running[1](true); top(); }
    function setSpeed(v) { if (v === 0) { running[1](false); persist(stRef.current, true); return; } apply(function (ns) { ns.speed = v; }); running[1](true); }
    function openRoom(nr) {
      panel[1](nr);
      var z = sc.zimmer.filter(function (x) { return x.nr === nr; })[0];
      apply(function (ns) { ns.log.forEach(function (x) { if (x.kind === "ereignis" && x.pat && z.betten.indexOf(x.pat) >= 0) ns.seen[x.id] = 1; }); });
    }
    function finishTask(t, r, startedAt, link) {
      task[1](null);
      apply(function (ns) { return E.complete(sc, ns, t, r, Math.max(ns.clock, startedAt)); });
      if (link && window.FP_openTraining) { running[1](false); persist(stRef.current, true); window.FP_openTraining({ tab: link.tab, id: link.id }); }
    }
    function endShift() { running[1](false); ask[1](true); }
    uE(function () {
      if (view[0] !== "ende" || !st || !p.setS) return;
      var s = E.score(sc, st);
      p.setS(function (S) { var o = Object.assign({ hist: [] }, S.station || {}); var hist = [{ sid: sc.id, at: Date.now(), pct: s.pct }].concat(o.hist || []).slice(0, 20); return Object.assign({}, S, { station: { cur: null, hist: hist } }); });
    }, [view[0]]);

    /* ---------- Ansichten ---------- */
    if (view[0] === "start" || !st) {
      var hist = (p.S && p.S.station && p.S.station.hist) || [];
      return h("div", { className: "st" },
        h("div", { className: "st-hero" },
          h("div", { className: "st-mini", dangerouslySetInnerHTML: { __html: MINI } }),
          h("div", { className: "eyebrow" }, "Simulation · ohne Vorbereitung"),
          h("h2", null, "Eine Schicht auf Station"),
          h("p", null, "Du übernimmst Zimmer, Patientinnen und Patienten und eine Liste von Aufgaben. Die Uhr läuft im Zeitraffer, es klingelt, das Labor ruft an, und nicht alles läuft nach Plan. Du entscheidest, was zuerst dran ist.")),
        DATA.szenarien.map(function (scn) {
          var n = Object.keys(scn.patienten).length;
          return h("div", { key: scn.id, className: "st-card" },
            h("div", { className: "eyebrow" }, scn.schicht + " · " + scn.station),
            h("h3", { style: { margin: "6px 0 6px", fontSize: 19, letterSpacing: "-.02em" } }, scn.titel),
            h("p", { style: { margin: 0, lineHeight: 1.55 } }, scn.kurz),
            h("div", { className: "st-facts" }, h("span", { className: "st-fact" }, scn.start + " bis " + scn.ende + " Uhr"), h("span", { className: "st-fact" }, scn.zimmer.length + " Zimmer · " + n + " Personen"), h("span", { className: "st-fact" }, scn.aufgaben.length + " mögliche Aufgaben"), h("span", { className: "st-fact" }, "ca. 20 bis 30 Minuten"), VAR ? h("span", { className: "st-fact" }, "jede Schicht anders") : null),
            h("div", { className: "st-row" }, h("button", { type: "button", className: "btn", onClick: function () { start(scn); } }, h(Ic, { k: "play", s: 16 }), "Schicht beginnen")));
        }),
        h("div", { className: "st-card" }, h("h3", { className: "st-h3" }, "So funktioniert es"),
          h("div", { className: "st-how" },
            h("div", null, h("i", null, h(Ic, { k: "clock", s: 16 })), h("span", null, "Die Uhr läuft. Mit 1×, 2× und 4× bestimmst du das Tempo, jede Aufgabe kostet Stationszeit.")),
            h("div", null, h("i", null, h(Ic, { k: "bed", s: 16 })), h("span", null, "Tippe auf ein Zimmer: Dort siehst du Patientinnen und Patienten, ihre Akte und ihre Aufgaben.")),
            h("div", null, h("i", null, h(Ic, { k: "bell", s: 16 })), h("span", null, "Ereignisse verändern die Lage. Zimmer mit Neuigkeiten pulsieren dezent.")),
            h("div", null, h("i", null, h(Ic, { k: "flag", s: 16 })), h("span", null, "Am Ende siehst du, was gut lief, was offen blieb und welche Situationen kritisch wurden.")))),
        hist.length ? h("p", { className: "st-muted", style: { fontSize: 13.5, margin: 0 } }, "Deine letzten Schichten: " + hist.slice(0, 5).map(function (x) { return x.pct + " %"; }).join(" · ")) : null);
    }
    if (view[0] === "uebergabe") {
      return h("div", { className: "st" },
        h("div", { className: "st-card" },
          h("div", { className: "eyebrow" }, sc.schicht + " · " + sc.station + " · " + sc.start + " Uhr" + (sc._seed != null ? " · Schicht " + String(sc._seed % 9000 + 1000) : "")),
          h("h2", { style: { margin: "6px 0 8px", fontSize: 22, letterSpacing: "-.02em" } }, "Übergabe vom " + (sc.uebergabeVon || ({ "Frühdienst": "Nachtdienst", "Spätdienst": "Frühdienst", "Nachtdienst": "Spätdienst" })[sc.schicht] || "Vordienst")),
          h("p", { style: { margin: 0, lineHeight: 1.55 } }, sc.rolle)),
        h("div", { className: "st-card" }, h("div", { className: "st-list" }, sc.zimmer.map(function (z) {
          return z.betten.map(function (pid, i) {
            if (!pid) return null; var I = info(sc, pid), pp = sc.patienten[pid];
            return h("div", { key: pid, className: "st-task", style: { cursor: "default", alignItems: "flex-start" } },
              h("span", { className: "st-time" }, z.nr + "AB"[i], pp.kommt ? h("small", null, "ab " + pp.kommt) : null),
              h(Av, { svg: I.svg }),
              h("span", { className: "st-tt" }, h("b", null, I.name + ", " + I.alter), h("span", { style: { whiteSpace: "normal", lineHeight: 1.45 } }, I.uebergabe)));
          });
        }))),
        h("div", { className: "st-row" }, h("button", { type: "button", className: "btn", onClick: begin }, "Übernehmen und Schicht starten", h(Ic, { k: "right", s: 18 })), h("button", { type: "button", className: "btn ghost", onClick: function () { view[1]("start"); } }, "Zurück")));
    }
    if (view[0] === "ende") return h(Ende, { sc: sc, st: st, restart: function () { start(sc); }, home: function () { stRef.current = null; stS[1](null); view[1]("start"); } });

    /* Stationsplan */
    var tasks = E.tasks(sc, st), open = tasks.filter(function (t) { return !st.done[t.id]; }).sort(function (a, b) { var da = E.due(sc, st, a), db = E.due(sc, st, b); return (da == null ? 1e9 : da) - (db == null ? 1e9 : db); });
    var doneT = tasks.filter(function (t) { return st.done[t.id]; });
    var evs = st.log.filter(function (x) { return x.kind === "ereignis"; }).slice().reverse();
    var rows = [sc.zimmer.slice(0, 3), sc.zimmer.slice(3)];
    var spd = running[0] ? st.speed || 1 : 0;
    var prog = tasks.length ? doneT.length / tasks.length * 100 : 0;
    return h("div", { className: "st" },
      h("div", { className: "st-card st-bar" },
        h("div", { className: "st-clock" + (running[0] ? "" : " paused"), "aria-live": "off" }, h("b", null, ft(st.clock).slice(0, 2), h("span", null, ":"), ft(st.clock).slice(3)), h("small", null, "bis " + sc.ende)),
        h("div", { className: "st-sname" }, h("b", null, sc.schicht + " · " + sc.station), h("span", null, doneT.length + " von " + tasks.length + " Aufgaben erledigt"), h("div", { className: "st-prog" }, h("i", { style: { width: prog + "%" } }))),
        h("div", { className: "st-seg", role: "group", "aria-label": "Tempo der Simulationsuhr" },
          h("button", { type: "button", "aria-pressed": spd === 0, "aria-label": "Pause", onClick: function () { setSpeed(0); } }, h(Ic, { k: "pause", s: 14 })),
          [1, 2, 4].map(function (v) { return h("button", { key: v, type: "button", "aria-pressed": spd === v, onClick: function () { setSpeed(v); } }, v + "×"); })),
        h("button", { type: "button", className: "btn ghost sm", onClick: endShift }, "Schicht beenden")),
      !running[0] && !alert[0] ? h("div", { className: "st-fb", style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, h(Ic, { k: "pause", s: 16 }), h("span", { style: { flex: 1, minWidth: 180 } }, "Die Uhr ist angehalten."), h("button", { type: "button", className: "btn sm", onClick: function () { setSpeed(st.speed || 1); } }, h(Ic, { k: "play", s: 14 }), "Weiter")) : null,
      h("div", { className: "st-main" },
        h("div", { className: "st-card st-plan" },
          h("h3", { className: "st-h3" }, h("span", null, "Stationsplan"), h("span", { className: "st-legend" }, h("span", null, h("i", { style: { background: "var(--warn,#ff9500)" } }), "beobachten"), h("span", null, h("i", { style: { background: "var(--bad,#ff3b30)" } }), "kritisch"))),
          h("div", { className: "st-rooms" }, rows[0].map(function (z) { return h(Room, { key: z.nr, sc: sc, st: st, z: z, open: openRoom }); })),
          h("div", { className: "st-corr" }, h("span", null, "Flur"), h("b", null, h(Ic, { k: "steth", s: 14 }), "Stützpunkt · " + (sc.stuetzpunkt || "Sabine Hoffmann")), h("span", null, "Arbeitsraum")),
          h("div", { className: "st-rooms" }, rows[1].map(function (z) { return h(Room, { key: z.nr, sc: sc, st: st, z: z, open: openRoom }); }).concat(rows[1].length < 3 ? [h("div", { key: "g", className: "st-room ghost", "aria-hidden": "true" }, h("span", { className: "st-rh" }, h("b", null, "Dienstzimmer")), h("span", { className: "st-muted", style: { fontSize: 12.5 } }, "Übergabe, Kurven, Telefon"))] : []))),
        h("div", { className: "st-side" },
          h("div", { className: "st-seg st-tabs", role: "tablist", "aria-label": "Ansicht" },
            h("button", { type: "button", role: "tab", "aria-pressed": side[0] === "aufgaben", onClick: function () { side[1]("aufgaben"); } }, "Aufgaben " + open.length),
            h("button", { type: "button", role: "tab", "aria-pressed": side[0] === "ereignisse", onClick: function () { side[1]("ereignisse"); } }, "Ereignisse " + evs.length)),
          h("div", { className: "st-card" + (side[0] === "aufgaben" ? "" : " hidden-m") },
            h("h3", { className: "st-h3" }, h("span", null, "Anstehende Aufgaben"), h("span", null, open.length)),
            open.length ? h("div", { className: "st-list" }, open.map(function (t) { return h(TaskRow, { key: t.id, sc: sc, st: st, t: t, start: function (x) { task[1](x); } }); })) : h("p", { className: "st-empty" }, "Gerade ist alles erledigt. Die Uhr läuft weiter."),
            doneT.length ? h("details", { className: "st-donebox", style: { marginTop: 8 } }, h("summary", null, "Erledigt (" + doneT.length + ")"), doneT.map(function (t) { var d = st.done[t.id]; return h("div", { key: t.id, className: "st-donei" }, h(Ic, { k: "chk", s: 16 }), h("b", null, t.t), h("span", null, de(d.pts) + "/" + d.max)); })) : null),
          h("div", { className: "st-card" + (side[0] === "ereignisse" ? "" : " hidden-m") },
            h("h3", { className: "st-h3" }, h("span", null, "Aktuelle Ereignisse"), h("span", null, evs.length)),
            evs.length ? h("div", { className: "st-list" }, evs.map(function (x) { return h(EvRow, { key: x.id + "@" + x.at, x: x, unseen: !st.seen[x.id] && !!x.pat, onClick: function () { if (x.pat) openRoom(roomOf(sc, x.pat).nr); else apply(function (ns) { ns.seen[x.id] = 1; }); } }); })) : h("p", { className: "st-empty" }, "Noch ruhig.")))),
      toasts[0].length ? portal(h("div", { className: "st-toasts", "aria-live": "polite" }, toasts[0].map(function (x) {
        var e = x.e;
        return h("button", { key: x.k, type: "button", className: "st-toast", onClick: function () { toasts[1](function (a) { return a.filter(function (y) { return y.k !== x.k; }); }); if (e.pat) openRoom(roomOf(sc, e.pat).nr); } },
          h("span", { className: "st-ic" + (e.art === "alarm" ? " alarm" : " new") }, h(Ic, { k: ART_IC[e.art] || "info", s: 16 })),
          h("span", { style: { minWidth: 0 } }, h("b", null, e.titel), h("p", null, e.text)));
      }))) : null,
      alert[0] ? portal(h("div", { className: "st-modal-bg" }, h("div", { className: "st-alert", role: "alertdialog", "aria-modal": "true" },
        h("span", { className: "st-ic alarm", style: { width: 44, height: 44, borderRadius: 14 } }, h(Ic, { k: ART_IC[alert[0].art] || "alert", s: 22 })),
        h("h3", null, alert[0].titel), h("p", null, alert[0].text),
        alert[0].malus ? h("p", { className: "st-muted", style: { fontSize: 13.5, marginTop: 10 } }, alert[0].malus.t) : null,
        h("div", { className: "st-row", style: { marginTop: 16 } },
          h("button", { type: "button", className: "btn", autoFocus: true, onClick: function () { var a = alert[0]; alert[1](null); if (a.pat) openRoom(roomOf(sc, a.pat).nr); running[1](true); } }, "Verstanden"),
          alert[0].link && window.FP_openTraining ? h("button", { type: "button", className: "btn ghost", onClick: function () { var l = alert[0].link; alert[1](null); persist(stRef.current, true); window.FP_openTraining({ tab: l.tab, id: l.id }); } }, l0(alert[0].link)) : null)))) : null,
      ask[0] ? portal(h("div", { className: "st-modal-bg", onClick: function (e) { if (e.target === e.currentTarget) ask[1](false); } }, h("div", { className: "st-alert", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "st-ask-h" },
        h("span", { className: "st-ic", style: { width: 44, height: 44, borderRadius: 14 } }, h(Ic, { k: "flag", s: 22 })),
        h("h3", { id: "st-ask-h" }, "Schicht beenden?"), h("p", null, "Du bekommst sofort deine Auswertung. Offene Aufgaben zählen dann als nicht erledigt."),
        h("div", { className: "st-row", style: { marginTop: 16 } },
          h("button", { type: "button", className: "btn", autoFocus: true, onClick: function () { ask[1](false); apply(function (ns) { ns.ended = true; }); } }, "Beenden und auswerten"),
          h("button", { type: "button", className: "btn ghost", onClick: function () { ask[1](false); } }, "Weiterarbeiten"))))) : null,
      panel[0] && !task[0] ? h(RoomPanel, { sc: sc, st: st, nr: panel[0], S: p.S, setS: p.setS, close: function () { panel[1](null); }, start: function (t) { task[1](t); }, leave: function (fn) { running[1](false); persist(stRef.current, true); panel[1](null); fn(); } }) : null,
      task[0] ? h(Runner, { key: task[0].id, sc: sc, st: st, t: task[0], S: p.S, setS: p.setS, cancel: function () { task[1](null); }, finish: function (r, at, link) { finishTask(task[0], r, at, link); } }) : null);
    function l0(l) { return l.t || "Vertiefen"; }
  }
  window.FP_Station = Station;
  window.FP_STATION_ENGINE = E;
})();
