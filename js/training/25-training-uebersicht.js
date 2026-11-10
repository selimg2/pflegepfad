/* ===== Fallpfad · Training-Übersicht (Kacheln) und Praktisches Examen Übung ===== */
(function () {
  "use strict";
  var R = window.React;
  if (!R) return;
  var h = R.createElement, Fr = R.Fragment, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef;

  /* ---------- Helfer ---------- */
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function pd(fn) { return function (e) { if (e && e.preventDefault) e.preventDefault(); if (fn) fn(e); }; }
  function low(s) { return String(s || "").toLowerCase(); }
  function hit(text, kw) { var t = low(text); return (kw || []).some(function (k) { return t.indexOf(k) >= 0; }); }
  function r1(x) { return String(Math.round(x * 10) / 10).replace(".", ","); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function shuf(arr, seed) {
    var a = arr.map(function (x, i) { return { x: x, i: i }; }), s = seed || 1;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor((s / 233280) * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function mkSet(up, key, def) { return function (patch) { up(function (r) { var o = {}; o[key] = Object.assign({}, r[key] || def, patch); return o; }); }; }
  function top() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); } }
  function Ico(p) { return h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: p.w || 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: p.className }, h("path", { d: p.d })); }
  var I = {
    left: "M15 18l-6-6 6-6", right: "M9 18l6-6-6-6", check: "M20 6L9 17l-5-5", x: "M18 6L6 18M6 6l12 12", up: "M18 15l-6-6-6 6", down: "M6 9l6 6 6-6",
    clock: "M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", alert: "M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
    pulse: "M3 12h4l2-6 4 12 2-6h6", chat: "M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", restart: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
    praxexamen: "M9 3h6v3H9zM7 4.5H5V21h14V4.5h-2M7 13h2.2l1.5-3 2.2 6 1.5-3H17",
    sims: "M3 4h18v12H3zM8 20h8M12 16v4M10 7.5l4.5 2.5-4.5 2.5z",
    examen: "M12 9v4l2.5 1.5M9.5 2h5M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
    team: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
    pharmako: "M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7",
    vorbereitung: "M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12.5h18M11 12.5v2h2v-2",
    interaktiv: "M5 3l6.5 16 2.4-6.6L20.5 10z",
    muendlich: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8",
    karten: "M4 8h12v13H4zM8 5h12v13",
    blitz: "M13 2L4 14h7l-1 8 9-12h-7z",
    fehler: "M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
    pruefung: "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    lexikon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
    portfolio: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    merk: "M6 3h12v18l-6-4-6 4z",
    deutsch: "M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5",
    station: "M3 18V7M3 13h18v5M21 18v-3M7 13v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M5.5 10.5h.01",
    ruhe: "M5 21c0-9 5-15 15-16-1 10-7 15-15 16zM5 21l7-7",
    kommunikation: "M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-3.5-3H12"
  };

  /* ================================================================
     TRAINING-ÜBERSICHT
     ================================================================ */
  var TILES = [
    { k: "praxexamen", t: "Praktisches Examen Übung", d: "Komplette Prüfungstage auf Station: Planung, Übergabe, Pflegehandlung, Bildbefund, Medikamente, Beratung.", c: "#0062FF", g: 1 },
    { k: "examen", t: "Examenssimulator", d: "Schriftliche Prüfung unter Zeitdruck mit Auswertung.", c: "#DC2626", g: 1 },
    { k: "muendlich", t: "Mündliche Prüfung", d: "Fallgespräche und Prüferfragen zum Laut-Antworten.", c: "#EA580C", g: 1 },
    { k: "pruefung", t: "Prüfung", d: "Prüfungsbögen deiner Schule und Selbsttests.", c: "#4F46E5", g: 1 },
    { k: "ruhe", t: "Ruhig bleiben: Stress & Prüfungsangst", d: "Was bei Stress und Prüfungsangst wirklich hilft: Atem-Coach, Gedanken-Check, Notfallplan für den Prüfungstag und Abschalten nach dem Dienst.", c: "#16A34A", g: 1 },
    { k: "station", t: "Stationsalltag", d: "Eine Schicht auf Station: Zimmer, Patientinnen und Patienten, Aufgaben und Ereignisse im Zeitraffer.", c: "#0D9488", g: 2, big: 1 },
    { k: "kommunikation", t: "Kommunikation", d: "Gespräche mit KI-Gesprächspersonen üben: sprechen, zuhören, Rückmeldung bekommen.", c: "#0EA5E9", g: 2, big: 1 },
    { k: "sims", t: "Simulationen", d: "Realitätsnahe Abläufe aus dem Stationsalltag, beliebig oft.", c: "#7C3AED", g: 2 },
    { k: "team", t: "Team-Krankenhaus", d: "Gemeinsam mit deinem Kurs einen Fall lösen.", c: "#0891B2", g: 2 },
    { k: "pharmako", t: "PharmakoLab", d: "Medikamente richten, rechnen, Wechselwirkungen erkennen.", c: "#DB2777", g: 2 },
    { k: "vorbereitung", t: "Praxisvorbereitung", d: "Was dich im nächsten Einsatz erwartet.", c: "#059669", g: 2 },
    { k: "interaktiv", t: "Interaktives Üben", d: "Bildbefunde, Zuordnen, Reihenfolgen und mehr.", c: "#2563EB", g: 3 },
    { k: "karten", t: "Lernkarten", d: "Wiederholen mit Karteikarten.", c: "#CA8A04", g: 3 },
    { k: "blitz", t: "Blitzrunde", d: "Schnelle Fragen gegen die Uhr.", c: "#F59E0B", g: 3 },
    { k: "fehler", t: "Fehlertraining", d: "Was du falsch hattest, kommt wieder.", c: "#E11D48", g: 3 },
    { k: "lexikon", t: "Lexikon", d: "Fachbegriffe kurz erklärt.", c: "#0D9488", g: 4 },
    { k: "deutsch", t: "Fachsprache Deutsch", d: "Wichtige Wörter mit Artikel, Aussprache und Sätze für den Dienst, auf Wunsch mit deiner Sprache.", c: "#0284C7", g: 4 },
    { k: "portfolio", t: "Portfolio", d: "Deine Arbeiten und Reflexionen.", c: "#64748B", g: 4 },
    { k: "merk", t: "Merkliste", d: "Was du dir gemerkt hast.", c: "#9333EA", g: 4 }
  ];
  var GROUPS = [[2, "Simulieren & Handeln"], [1, "Prüfung & Examen"], [3, "Üben & Wiederholen"], [4, "Nachschlagen & Sammeln"]];

  function tileMeta(k, S) {
    try {
      if (k === "praxexamen") {
        var px = S && S.pex;
        if (px && px.cur && px.cur.sec > 0) return "Ein Fall ist offen · weiter bei Schritt " + (px.cur.sec + 1);
        if (px && px.hist && px.hist[0]) return "Zuletzt: Note " + px.hist[0].note + " · " + px.hist[0].pct + " %";
        return (window.PEX_CASES || []).length + " Prüfungsfälle";
      }
      if (k === "deutsch" && window.FP_LS) { var kn = 0; try { kn = Object.keys(JSON.parse(localStorage.getItem("fp-ls-known") || "{}")).length; } catch (e2) {} var lb = window.FP_LS.lang() ? window.FP_LS.label() : ""; return [kn ? kn + " Wörter sitzen" : "", lb].filter(Boolean).join(" · "); }
      if (k === "station") { var sc = S && S.station; if (sc && sc.cur && !sc.cur.ended) return "Schicht läuft · " + (sc.cur.clockTxt || ""); if (sc && sc.hist && sc.hist[0]) return "Zuletzt " + sc.hist[0].pct + " %"; return "Frühdienst Innere 5B"; }
      if (k === "kommunikation") { var kb = S && S.komm && S.komm.best, kn2 = kb ? Object.keys(kb).length : 0, tot = window.FP_KOMM_DATA ? window.FP_KOMM_DATA.szenarien.length : 15; return kn2 ? kn2 + " von " + tot + " Gesprächen geübt" : (window.FP_KOMM_DATA ? window.FP_KOMM_DATA.kategorien.length : 6) + " Bereiche · " + tot + " Gespräche"; }
      if (k === "ruhe") { try { var rd = JSON.parse(localStorage.getItem("fp-stress:" + JSON.parse(localStorage.getItem("fallpfad-session") || '"gast"')) || "{}"), rn = Object.keys(rd.tools || {}).filter(function (x) { return x !== "check"; }).length; return rn ? rn + " von 8 Werkzeugen ausprobiert" : "8 Werkzeuge · Stress-Check"; } catch (e3) { return "8 Werkzeuge · Stress-Check"; } }
      if (k === "sims" && S && S.sims) { var n = Object.keys(S.sims).length; return n ? n + " absolviert" : ""; }
      if (k === "examen" && S && S.examHist && S.examHist[0]) return "Zuletzt " + S.examHist[0].pct + " %";
    } catch (e) {}
    return "";
  }

  function Tile(p) {
    var x = p.x, meta = tileMeta(x.k, p.S);
    return h("button", { type: "button", className: cx("trtile", x.feat && "feat", x.big && "big"), style: { "--c": x.c }, onClick: pd(function () { p.go(x.k); }) },
      h("span", { className: "trico" }, h(Ico, { d: I[x.k], w: 1.8 })),
      h("span", { className: "trtxt" },
        h("b", null, x.t),
        h("span", null, x.d)),
      x.feat && h("svg", { className: "trecg", viewBox: "0 0 300 60", "aria-hidden": "true", preserveAspectRatio: "none" },
        h("path", { d: "M0 34h70l8-4 6 4h18l6 8 9-36 9 46 6-18h20l10-8 10 8h40l8-4 6 4h18l6 8 9-36 9 46 6-18h12" })),
      h("span", { className: "trfoot" },
        meta ? h("span", { className: "trmeta" }, meta) : h("span"),
        h("span", { className: "trgo" }, x.feat ? "Starten" : "", h(Ico, { d: I.right, w: 2.2 }))));
  }

  function TrainingHub(p) {
    var view = p.view, S = p.S || {};
    var go = function (k) { p.setView(k); top(); };
    if (view) {
      var t = TILES.filter(function (x) { return x.k === view; })[0] || { t: "Training", c: "#0062FF" };
      return h("div", { className: "wrap" },
        h("div", { className: "trhead", style: { "--c": t.c } },
          h("button", { type: "button", className: "skip back", onClick: pd(function () { p.setView(null); top(); }) }, h(Ico, { d: I.left }), "Alle Trainings"),
          h("div", { className: "trhrow" },
            h("span", { className: "trico sm" }, h(Ico, { d: I[t.k] || I.sims, w: 1.8 })),
            h("div", { style: { minWidth: 0 } }, h("div", { className: "eyebrow" }, "Training"), h("h1", null, t.t)))),
        h("div", { className: "page-in", key: view, style: { marginTop: 16 } }, p.render(view)));
    }
    var feat = TILES.filter(function (x) { return x.feat; });
    return h("div", { className: "wrap" },
      h("div", { className: "hello" },
        h("div", { className: "eyebrow" }, "Wiederholen und vertiefen"),
        h("h1", { style: { marginTop: 8 } }, "Training"),
        h("p", null, "Wähle aus, was du heute üben willst.")),
      GROUPS.map(function (g) {
        return h("section", { key: g[0], className: "trsec" },
          h("h2", { className: "trsech" }, g[1]),
          h("div", { className: "trgrid" }, TILES.filter(function (x) { return x.g === g[0]; }).map(function (x) { return h(Tile, { key: x.k, x: x, S: S, go: go }); })));
      }));
  }

  /* ================================================================
     PRAKTISCHES EXAMEN ÜBUNG · Engine für mehrere Fälle
     ================================================================ */
  var CASES = window.PEX_CASES || [];
  var D = CASES[0] || null;
  var REGELN = [
    ["Rahmen nach § 16 PflAPrV", "Pflege von mindestens zwei Menschen, davon einer mit erhöhtem Pflegebedarf. Fallvorstellung höchstens 20 Minuten, Reflexionsgespräch höchstens 20 Minuten, Prüfung ohne Vorbereitungsteil höchstens 240 Minuten."],
    ["Vorbehaltene Tätigkeiten (§ 4 PflBG)", "Pflegebedarf erheben, Pflegeprozess steuern, Qualität sichern. Genau darauf schauen die Fachprüfenden in jeder Phase."],
    ["Was du als Auszubildende allein darfst", "Alles, was du sicher beherrschst und was zu deinem Ausbildungsstand passt. Tätigkeiten an Infusionen und Zugängen nur gemeinsam mit einer Pflegefachperson. Medikamente prüfst du immer selbst nach den R-Regeln, bevor du sie gibst."],
    ["Freitext und Selbsteinschätzung", "Du schreibst zuerst frei. Danach deckst du den Erwartungshorizont auf und hakst ehrlich ab, was du wirklich hattest. Begriffe aus deinem Text sind schon vorgemerkt, prüfe sie trotzdem."]
  ];
  var PHASES = ["Vorbereitungstag", "Schichtbeginn", "Live-Handlungen", "Schichtende & Reflexion"];
  var TYPNAME = { ekg: "Bildbefund", hotspot: "Bildbefund", steps: "Pflegehandlung", tree: "Gespräch", beratung: "Beratung", vitmed: "Vitalzeichen & Medikamente", med: "Medikamente" };
  var KBMAP = { akten: "I", plan: "I", prio: "I", sbar: "III", st: "III", doku: "IV", ueb: "II", refl: "V" };
  var KBT = [
    ["I", "Pflegeprozess verantwortlich planen, organisieren, gestalten, durchführen, steuern und bewerten"],
    ["II", "Kommunikation und Beratung personen- und situationsorientiert gestalten"],
    ["III", "Intra- und interprofessionelles Handeln verantwortlich gestalten"],
    ["IV", "Das eigene Handeln auf Grundlage von Gesetzen, Verordnungen und ethischen Leitlinien reflektieren und begründen"],
    ["V", "Das eigene Handeln auf Grundlage wissenschaftlicher Erkenntnisse und berufsethischer Werthaltungen reflektieren und begründen"]
  ];
  var NOTEN = [[92, 1, "sehr gut"], [81, 2, "gut"], [67, 3, "befriedigend"], [50, 4, "ausreichend"], [30, 5, "mangelhaft"], [0, 6, "ungenügend"]];

  function caseById(id) { return CASES.filter(function (c) { return c.id === id; })[0] || CASES[0]; }
  function secsOf(c) {
    var s = [
      { k: "brief", ph: 1, t: "Briefing", clock: "Tag 1 · 13:00" },
      { k: "akten", ph: 1, t: "Patientenakten", clock: "Tag 1 · 13:15", max: 8 },
      { k: "plan", ph: 1, t: "Pflegeplanung", clock: "Tag 1 · 14:30", max: 12 },
      { k: "sbar", ph: 2, t: "Übergabe & SBAR", clock: "Tag 2 · 06:00", max: 8 },
      { k: "prio", ph: 2, t: "Prioritätenplan", clock: "Tag 2 · 06:10", max: 8 }
    ];
    c.live.forEach(function (l) { s.push({ k: l.k, ph: 3, t: l.t, clock: "Tag 2 · " + l.clock, max: l.max, typ: l.typ, live: l, pat: l.pat }); });
    s.push({ k: "st", ph: 3, t: "Störfall", clock: "Tag 2 · " + (c.st.clock || "10:05"), max: 10 });
    s.push({ k: "doku", ph: 3, t: "Dokumentation", clock: "Tag 2 · " + (c.doku.clock || "11:00"), max: 8 });
    s.push({ k: "ueb", ph: 4, t: "Übergabe Spätdienst", clock: "Tag 2 · 13:30", max: 3 });
    s.push({ k: "refl", ph: 4, t: "Reflexionsgespräch", clock: "Tag 2 · 14:00", max: 3 });
    s.push({ k: "end", ph: 4, t: "Auswertung", clock: "Tag 2 · 14:20" });
    return s;
  }
  function kbOf(s) { if (KBMAP[s.k]) return KBMAP[s.k]; return s.typ === "tree" || s.typ === "beratung" ? "II" : "I"; }
  function newRun(cid) { return { v: 2, cs: cid, sec: 0, at: Date.now(), day2: null, done: {}, pts: {}, ko: [] }; }
  function noteFor(pct, ko) {
    var n = NOTEN.filter(function (x) { return pct >= x[0]; })[0] || NOTEN[NOTEN.length - 1];
    if (ko && n[1] < 5) n = NOTEN[4];
    return n;
  }
  function order() { return D.order || Object.keys(D.pat); }
  function ini(n) { return String(n || "").split(/\s+/).filter(Boolean).map(function (x) { return x[0]; }).join("").slice(0, 2).toUpperCase(); }
  /* ---------- Figuren und Sprechblasen im Stil der Module ---------- */
  var ME = { name: "Du", hair: "LN", hairC: "#6b4a2f", skin: "#e8b48f", cloth: "#4f7fe0", deco: "scrubs", bg: "#e6efff" };
  var HAIR_M = ["JW", "TI", "JO", "DY", "KA", "LN", "HE", "RO"], HAIR_F = ["AN", "EN", "PA", "LI", "SN", "VO", "BR", "LE", "MI", "KL"], HAIR_OM = ["HK", "HS", "WB", "KF", "WO", "PH"], HAIR_OF = ["MK", "HM", "IA", "GH", "SE", "UF", "WE"];
  var CLOTH = ["#9cc3e6", "#c9b6e4", "#b7cdb8", "#e8b4a6", "#f5c26b", "#b9c6cf", "#9fd4c7", "#f2b8c6"], BGS = ["#ddeeff", "#efe7fb", "#e7f4e4", "#fde8e8", "#fff1d6", "#e6f6f3"];
  var SKINS = ["#f6d2b3", "#f6d2b3", "#e3ab84", "#f0c7a5", "#b9805a"];
  function hsh(s) { var n = 7; s = String(s || ""); for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0; return Math.abs(n); }
  function autoAv(name, age, role) {
    var n = String(name || ""), x = hsh(n), f = /^(Frau|Fr\.)\s/.test(n) || /(a|e|ine|ie|th|rud|id)$/.test(n.split(/[\s,]+/)[0] || "") && !/^Herr/.test(n);
    var old = (age || 40) >= 65, pool = old ? (f ? HAIR_OF : HAIR_OM) : (f ? HAIR_F : HAIR_M);
    var hair = pool[x % pool.length], grey = ["#c9ccd1", "#d6d9dd", "#e2e3e6", "#b8bcc2"];
    var sp = { name: n, hair: hair, hairC: old ? grey[x % 4] : (window.PXAVL && PXAVL[hair] ? PXAVL[hair].h : "#6b4a2f"), skin: SKINS[(x >> 3) % SKINS.length], cloth: CLOTH[(x >> 2) % CLOTH.length], bg: BGS[(x >> 4) % BGS.length], wrinkles: old, glasses: old && x % 3 === 0 };
    if (role === "staff") { sp.cloth = ["#2f4f7a", "#0e7490", "#4f46e5"][x % 3]; sp.deco = "badge"; }
    if (role === "pat") sp.deco = "gown";
    return sp;
  }
  function staffName(key) { return key === "anleitung" ? D.anleitung : key === "pruefer" ? (D.pruefer || "Fachprüferin") : key === "nacht" ? ((D.people && D.people.nacht && D.people.nacht.name) || "Nachtdienst") : key; }
  function personOf(key) {
    if (key === "me") return { name: "Du", av: ME };
    if (String(key).indexOf("auto:") === 0) { var nm = key.slice(5); return { name: nm, av: autoAv(nm, /Oma|Opa|Vater|Mutter|Ehe/.test(nm) ? 60 : 45) }; }
    var pt = D.pat && D.pat[key];
    if (pt) return { name: pt.name, kurz: pt.kurz, av: pt.av || autoAv(pt.kurz || pt.name, pt.alter, "pat"), role: "Patient" };
    var pp = (D.people || {})[key];
    if (pp) return { name: pp.name || staffName(key), av: pp.av || autoAv(pp.name || staffName(key), 40, "staff"), role: pp.role };
    var role = key === "anleitung" ? "Praxisanleitung" : key === "pruefer" ? "Fachprüfende" : key === "nacht" ? "Nachtdienst" : "";
    return { name: staffName(key), av: autoAv(staffName(key), 45, "staff"), role: role };
  }
  function AvImg(p) {
    var sp = p.sp || personOf(p.who).av;
    return h("span", { className: cx("pxavw", p.className), style: p.size ? { width: p.size, height: p.size } : null, "aria-hidden": "true", dangerouslySetInnerHTML: { __html: window.PXAV ? PXAV.svg(sp, p.mood || "neutral") : "" } });
  }
  /* Sprechblase wie in den Modulen: Figur links, Blase mit Name */
  function Say(p) {
    var per = p.who ? personOf(p.who) : { name: p.name, av: p.sp };
    var nm = p.name != null ? p.name : (per.name + (p.role ? " · " + p.role : per.role && p.showRole ? " · " + per.role : ""));
    return h("div", { className: cx(p.bare ? "scene pxsay" : "card block scene pxsay", p.me && "me", p.small && "sm", p.tone), style: p.delay ? { "--d": p.delay + "ms" } : null },
      h("div", { className: "av", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: window.PXAV ? PXAV.svg(p.sp || per.av, p.mood || "neutral") : "" } }),
      h("div", { className: "bubble" }, nm && h("div", { className: "who" }, nm), typeof p.text === "string" ? h("p", null, p.text) : p.text, p.children));
  }
  /* Zitate aus einem Text herauslösen: „…“ */
  function splitQuote(t) {
    var m = String(t || "").match(/^([\s\S]*?)„([\s\S]+?)“([\s\S]*)$/);
    if (!m) return null;
    return { pre: m[1].replace(/\s*(sagt|fragt|ruft|meint|flüstert)?[^.!?]*:\s*$/, "").trim(), q: m[2].trim(), post: m[3].replace(/^\s*,?\s*(sagt|fragt|ruft|meint|flüstert)\s+(er|sie|[A-ZÄÖÜ][\wäöüß.]*(\s[A-ZÄÖÜ][\wäöüß]+)?)\s*\.?/, "").trim() };
  }
  function whoKey(name, def) {
    var n = String(name || "").toLowerCase();
    var ks = Object.keys(D.pat || {});
    for (var i = 0; i < ks.length; i++) { var pt = D.pat[ks[i]]; if (n && (n.indexOf(String(pt.kurz || "").toLowerCase()) >= 0 || n.indexOf(String(pt.name || "").toLowerCase()) >= 0)) return ks[i]; }
    var pp = D.people || {};
    for (var k in pp) if (pp[k].match && new RegExp(pp[k].match, "i").test(n)) return k;
    return n ? "auto:" + name : def;
  }
  function moodOf(t) {
    t = String(t || "");
    if (/(weh|Schmerz|tut so|aua|brennt)/i.test(t)) return "pain";
    if (/(Angst|Sorge|schlimm|nicht mehr|allein|traurig|weinen|tot)/i.test(t)) return "sad";
    if (/(\?|wirklich|ehrlich)/.test(t)) return "worried";
    if (/(haha|super|danke|toll|gut so)/i.test(t)) return "happy";
    return "talk";
  }
  function Narr(p) {
    var sq = splitQuote(p.text);
    if (!sq || !p.who) return h("p", { style: { marginTop: 12 } }, p.text);
    return h(Fr, null,
      sq.pre && h("p", { style: { marginTop: 12 } }, sq.pre),
      h(Say, { who: p.who, mood: p.mood, text: sq.q, bare: true }),
      sq.post && h("p", { style: { marginTop: 10 } }, sq.post));
  }

  /* ---------- Bausteine ---------- */
  function Tag(p) { return h("span", { className: cx("pxtag", p.c) }, p.children); }

  function TextArea(p) {
    return h("div", { className: "field", style: { marginTop: p.mt == null ? 12 : p.mt } },
      p.label && h("label", null, p.label),
      h("textarea", { className: "input", rows: p.rows || 5, value: p.value || "", placeholder: p.ph || "", disabled: !!p.locked, onChange: function (e) { p.onChange(e.target.value); }, style: p.small ? { minHeight: 84 } : null }));
  }

  function SelfCheck(p) {
    var v = p.val || {}, items = p.items, text = p.text || "";
    var auto = items.map(function (it) { return hit(text, it.kw); });
    var chk = v.chk || auto;
    var n = chk.filter(Boolean).length;
    if (!v.open) {
      return h("div", { className: "row", style: { marginTop: 14 } },
        h("button", { type: "button", className: "btn", disabled: (p.minLen || 0) > text.trim().length, onClick: pd(function () { p.set({ open: true, chk: auto, done: false }); }) }, h(Ico, { d: I.eye }), p.label || "Erwartungshorizont aufdecken"),
        (p.minLen || 0) > text.trim().length && h("span", { className: "muted", style: { fontSize: 13.5 } }, "Schreib zuerst etwas, mindestens " + p.minLen + " Zeichen."));
    }
    return h("div", { className: "pxeh" },
      p.title && h("div", { className: "eyebrow", style: { marginBottom: 6 } }, p.title),
      p.muster && h("div", { className: "pxmuster" }, p.muster),
      h("div", { className: "pxchk" }, items.map(function (it, i) {
        return h("button", { type: "button", key: i, className: cx("opt multi", v.done && (chk[i] ? "ok" : "")), "aria-pressed": !!chk[i], disabled: v.done, onClick: pd(function () { var c = chk.slice(); c[i] = !c[i]; p.set(Object.assign({}, v, { chk: c })); }) },
          h("span", { className: "dot" }, h(Ico, { d: I.check, w: 3 })),
          h("span", { style: { minWidth: 0 } }, it.t, auto[i] && h("span", { className: "chip blue", style: { marginLeft: 8 } }, "im Text erkannt")));
      })),
      v.done
        ? h("p", { className: "pxscore" }, "Selbsteinschätzung: " + n + " von " + items.length + " Punkten erfüllt → " + r1(p.max * n / items.length) + " / " + r1(p.max) + " P.")
        : h("div", { className: "row", style: { marginTop: 12 } },
          h("button", { type: "button", className: "btn", onClick: pd(function () { p.set(Object.assign({}, v, { chk: chk, done: true })); p.onScore(p.max * n / items.length); }) }, h(Ico, { d: I.check }), "Selbsteinschätzung übernehmen"),
          h("span", { className: "muted", style: { fontSize: 13.5 } }, "Hake nur ab, was wirklich in deinem Text steht.")));
  }

  function Single(p) {
    var q = p.q, val = p.val, done = val != null;
    var ord = useMemo(function () { return shuf(q.opts, p.seed || 7); }, [q]);
    return h("div", { className: "pxq" },
      q.text && h("p", { className: "pxqt" }, q.text),
      h("div", { className: "opts" }, ord.map(function (o) {
        var i = o.i, op = o.x, sel = val === i;
        var cls = done ? (op.ok ? "ok" : sel ? "bad" : "") : "";
        return h("button", { type: "button", key: i, className: cx("opt", cls), disabled: done, "aria-pressed": sel, onClick: pd(function () { p.onAnswer(i, !!op.ok); }) },
          h("span", { className: "dot" }, h(Ico, { d: op.ok || !done ? I.check : I.x, w: 3 })),
          h("span", { style: { minWidth: 0 } }, op.t, done && (sel || op.ok) && op.fb && h("div", { className: "fb" }, op.fb)));
      })));
  }

  function Multi(p) {
    var q = p.q, v = p.val || { sel: [] }, sel = v.sel || [], done = v.done;
    var ord = useMemo(function () { return shuf(q.opts, p.seed || 11); }, [q]);
    return h("div", { className: "pxq" },
      q.text && h("p", { className: "pxqt" }, q.text),
      h("div", { className: "opts" }, ord.map(function (o) {
        var i = o.i, op = o.x, on = sel.indexOf(i) >= 0;
        var cls = done ? (op.ok && on ? "ok" : !op.ok && on ? "bad" : op.ok ? "miss" : "") : "";
        return h("button", { type: "button", key: i, className: cx("opt multi", cls), disabled: done, "aria-pressed": on, onClick: pd(function () { p.set({ sel: on ? sel.filter(function (x) { return x !== i; }) : sel.concat([i]) }); }) },
          h("span", { className: "dot" }, h(Ico, { d: done && !op.ok && on ? I.x : I.check, w: 3 })),
          h("span", { style: { minWidth: 0 } }, op.t,
            done && op.ok && !on && h("span", { className: "chip", style: { marginLeft: 8 } }, "fehlte"),
            done && (on || op.ok) && op.fb && h("div", { className: "fb" }, op.fb)));
      })),
      !done && h("div", { className: "row", style: { marginTop: 12 } },
        h("button", { type: "button", className: "btn", disabled: !sel.length, onClick: pd(function () {
          var tot = q.opts.filter(function (o) { return o.ok; }).length, good = 0, bad = 0;
          sel.forEach(function (i) { if (q.opts[i].ok) good++; else bad++; });
          var frac = clamp((good - bad) / tot, 0, 1);
          p.set({ sel: sel, done: true, frac: frac });
          if (p.onDone) p.onDone(frac);
        }) }, "Auswahl prüfen")));
  }

  function Sorter(p) {
    var items = p.items, v = p.val, ord = v.order;
    var byId = {}; items.forEach(function (x, i) { byId[x.id] = { x: x, pos: i }; });
    function mv(i, d) { var o = ord.slice(), j = i + d; if (j < 0 || j >= o.length) return; var t = o[i]; o[i] = o[j]; o[j] = t; p.set(Object.assign({}, v, { order: o })); }
    return h("div", null,
      h("ol", { className: "pxsort" }, ord.map(function (id, i) {
        var it = byId[id], diff = Math.abs(it.pos - i);
        var cls = v.done ? (diff === 0 ? "ok" : diff === 1 ? "near" : "bad") : "";
        return h("li", { key: id, className: cls },
          h("span", { className: "pxnum" }, i + 1),
          h("div", { className: "pxsortt" },
            h("span", null, it.x.zeit && v.done ? h("b", null, it.x.zeit + " · ") : null, it.x.t),
            v.done && h("div", { className: "fb" }, diff === 0 ? "Richtige Position. " : "Richtig wäre Position " + (it.pos + 1) + ". ", it.x.warum)),
          !v.done && h("span", { className: "pxarrows" },
            h("button", { type: "button", className: "iconbtn", "aria-label": "nach oben", disabled: i === 0, onClick: pd(function () { mv(i, -1); }) }, h(Ico, { d: I.up })),
            h("button", { type: "button", className: "iconbtn", "aria-label": "nach unten", disabled: i === ord.length - 1, onClick: pd(function () { mv(i, 1); }) }, h(Ico, { d: I.down }))));
      })),
      !v.done && h("div", { className: "row", style: { marginTop: 12 } },
        h("button", { type: "button", className: "btn", onClick: pd(function () {
          var s = 0; ord.forEach(function (id, i) { var d = Math.abs(byId[id].pos - i); s += d === 0 ? 1 : d === 1 ? 0.5 : 0; });
          var frac = s / ord.length; p.set(Object.assign({}, v, { done: true, frac: frac })); p.onDone(frac);
        }) }, "Reihenfolge prüfen")));
  }

  function Art(p) { return h("svg", { viewBox: p.vb || "0 0 400 280", className: String(p.svg || "").indexOf("<defs>") === 0 ? "pxart2" : "hart pxart", role: "img", "aria-label": p.label || "Abbildung", dangerouslySetInnerHTML: { __html: p.svg || "" } }); }

  function PatBanner(p) {
    var pt = p.pt || {}, sp = p.sp || (p.who ? personOf(p.who).av : null);
    return h("div", { className: "pxpb", style: { "--c": p.c || D.farbe } },
      sp ? h(AvImg, { sp: sp, mood: p.mood, className: "pxpbimg" }) : h("span", { className: "pxpbav" }, ini(pt.name)),
      h("div", { className: "pxpbt" }, h("b", null, pt.name), h("span", null, pt.sub)),
      h("div", { className: "pxpbc" }, (pt.chips || []).map(function (c, i) { return h("span", { key: i, className: "pxpbchip " + (c[1] || "") }, c[0]); })));
  }

  function SimHead(p) {
    return h("div", { className: "pxsimh", style: { "--c": p.c || D.farbe } },
      h("span", { className: "pxsimic" }, h(Ico, { d: p.icon || I.sims, w: 1.9 })),
      h("div", { style: { minWidth: 0 } }, h("div", { className: "eyebrow" }, p.eyebrow), h("h3", null, p.title)));
  }

  /* ---------- EKG-Streifen ---------- */
  function ecgPath(kind) {
    var secs = 6, pps = 100, ppm = 40, y0 = 104, beats = [], t;
    if (kind === "sinus") { for (t = 0.42; t < secs; t += 0.83) beats.push(t); }
    else if (kind === "brady") { for (t = 0.5; t < secs; t += 1.15) beats.push(t); }
    else { var rr = [0.42, 0.55, 0.38, 0.61, 0.47, 0.36, 0.52, 0.44, 0.66, 0.39, 0.49, 0.41, 0.58, 0.37, 0.5]; var i = 0; for (t = 0.12; t < secs; t += rr[i++ % rr.length]) beats.push(t); }
    function g(x, mu, sd, a) { return a * Math.exp(-((x - mu) * (x - mu)) / (2 * sd * sd)); }
    function v(t) {
      var s = 0;
      for (var k = 0; k < beats.length; k++) {
        var d = t - beats[k]; if (d < -0.3 || d > 0.6) continue;
        if (kind !== "af") s += g(d, -0.16, 0.022, 0.15);
        s += g(d, -0.022, 0.008, -0.12) + g(d, 0, 0.0105, 1.25) + g(d, 0.026, 0.0095, -0.32);
        s += kind !== "af" ? g(d, 0.29, 0.048, 0.3) : g(d, 0.23, 0.042, 0.2);
      }
      if (kind === "af") s += 0.055 * Math.sin(2 * Math.PI * 6.3 * t) + 0.035 * Math.sin(2 * Math.PI * 8.9 * t + 1.3) + 0.03 * Math.sin(2 * Math.PI * 4.6 * t + 0.4) + 0.015 * Math.sin(2 * Math.PI * 11.7 * t + 2);
      return s;
    }
    var off = 28, d = "M0 " + y0 + "H6V" + (y0 - ppm) + "H18V" + y0 + "H" + off;
    for (var x = 0; x <= secs * pps; x += 1) d += "L" + (x + off) + " " + (y0 - v(x / pps) * ppm).toFixed(1);
    return d;
  }
  function Strip(p) {
    var W = 628, H = 160, small = [], big = [];
    for (var x = 0; x <= W; x += 4) (x % 20 ? small : big).push("M" + x + " 0V" + H);
    for (var y = 0; y <= H; y += 4) (y % 20 ? small : big).push("M0 " + y + "H" + W);
    var d = useMemo(function () { return ecgPath(p.kind); }, [p.kind]);
    return h("figure", { className: "pxecg" },
      h("figcaption", null, h("b", null, p.title), h("span", null, p.sub)),
      h("div", { className: "pxecgsc" },
        h("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": p.title, style: { width: "100%", minWidth: 560, height: "auto", display: "block" } },
          h("rect", { width: W, height: H, className: "eg-bg" }),
          h("path", { d: small.join(""), className: "eg-s" }),
          h("path", { d: big.join(""), className: "eg-b" }),
          h("path", { d: d, className: "eg-t" }),
          h("text", { x: W - 6, y: 14, textAnchor: "end", className: "eg-l" }, "II · 25 mm/s · 10 mm/mV"))));
  }

  /* ================================================================
     ABSCHNITTE PHASE 1 + 2
     ================================================================ */
  function SecBrief() {
    return h(Fr, null,
      D.briefing.map(function (t, i) { return h(Say, { key: i, who: "anleitung", mood: i === 0 ? "happy" : "neutral", text: t, delay: i * 180, name: i === 0 ? D.anleitung + " · Praxisanleitung" : D.anleitung }); }),
      h("div", { className: "card" },
        h("h3", null, "Spielregeln"),
        h("dl", { className: "pxrules" }, (D.regeln || REGELN).map(function (r, i) { return h("div", { key: i }, h("dt", null, r[0]), h("dd", null, r[1])); }))),
      h("div", { className: "card" },
        h("h3", null, order().length === 2 ? "Deine zwei Menschen" : "Deine drei Menschen"),
        h(PatGrid, null)));
  }
  function PatGrid() {
    return h("div", { className: "pxpats" }, order().map(function (k) {
      var pt = D.pat[k];
      return h("div", { key: k, className: "pxpat", style: { "--c": pt.farbe } },
        h("div", { className: "pxpatav" }, h(AvImg, { who: k }), h("span", { className: "pxbadge" }, k)),
        h("b", null, pt.name + ", " + pt.alter),
        h("span", { className: "muted" }, "Zimmer " + pt.zimmer + (pt.typ ? " · " + pt.typ : "")),
        h(Tag, { c: "blue" }, "Schwerpunkt: " + pt.modus));
    }));
  }

  function PatTabs(p) {
    var o = order();
    return h("div", { className: "seg2 pxseg3", role: "tablist", style: { gridTemplateColumns: "repeat(" + o.length + ",1fr)" } }, o.map(function (k) {
      return h("button", { type: "button", key: k, role: "tab", "aria-selected": p.cur === k, onClick: pd(function () { p.set(k); }) },
        D.pat[k].kurz, p.mark && p.mark(k) ? " ✓" : "");
    }));
  }

  function SecAkten(p) {
    var run = p.run, up = p.up, PK = order();
    var st = run.akten || { tab: PK[0], notes: {}, eh: {} };
    var set = mkSet(up, "akten", st);
    var tab = st.tab || PK[0], pt = D.pat[tab], notes = st.notes || {}, eh = st.eh || {};
    var allDone = PK.every(function (k) { return eh[k] && eh[k].done; });
    var pts = st.pts || {};
    useEffect(function () { if (allDone && !run.done.akten) p.finish("akten", PK.reduce(function (a, k) { return a + (pts[k] || 0); }, 0)); }, [allDone]);
    return h(Fr, null,
      h("div", { className: "card" },
        h("h3", null, "[PATIENTENAKTEN] " + PK.length + " Akten, " + PK.length + " Geschichten"),
        h("p", { className: "muted" }, "Lies die Akte und das, was die Person dir erzählt. Notiere alle pflegerisch relevanten Informationen, vor allem die, die NICHT in der Akte stehen. Danach deckst du die versteckten Kern-Infos auf."),
        h(PatTabs, { cur: tab, set: function (k) { set({ tab: k }); }, mark: function (k) { return eh[k] && eh[k].done; } })),
      h("div", { className: "card pxakte", style: { "--c": pt.farbe } },
        h("div", { className: "pxaktehead" },
          h(AvImg, { who: tab, className: "pxheadav" }),
          h("div", null, h("h3", null, pt.name + ", " + pt.alter + " J."), h("span", { className: "muted" }, "Zimmer " + pt.zimmer + " · " + D.station))),
        pt.typ && h("p", { className: "pxcharakter" }, h("b", null, "Wesen: "), pt.typ),
        h("p", { style: { marginTop: 12 } }, h("b", null, "Aufnahmediagnose: "), pt.diagnose),
        h("dl", { className: "pxdl" }, pt.daten.map(function (r, i) { return h("div", { key: i }, h("dt", null, r[0]), h("dd", null, r[1])); })),
        h("div", { className: "eyebrow", style: { marginTop: 18 } }, "[ANAMNESE] " + (pt.erzaehler ? pt.erzaehler + " erzählt" : "Im Gespräch erzählt")),
        h(Say, { who: pt.erzaehlerKey || tab, sp: pt.erzaehlerAv, name: pt.erzaehler || pt.name, mood: pt.mood || "talk", text: pt.anamnese, bare: true, key: tab }),
        h(TextArea, { label: "Deine Notizen zu " + pt.kurz, value: notes[tab], locked: eh[tab] && eh[tab].open, ph: "Was ist pflegerisch wichtig? Was steht nicht in der Akte?", onChange: function (t) { var n = Object.assign({}, notes); n[tab] = t; set({ notes: n }); } }),
        h(SelfCheck, {
          items: pt.kern, text: notes[tab], val: eh[tab], max: 8 / PK.length, minLen: 40, label: "Kern-Infos aufdecken", title: "[KERN-INFOS] Das solltest du herausgefiltert haben",
          set: function (v) { var e = Object.assign({}, eh); e[tab] = v; set({ eh: e }); },
          onScore: function (s) { var q = Object.assign({}, pts); q[tab] = s; set({ pts: q }); }
        })));
  }

  function SecPlan(p) {
    var run = p.run, up = p.up, PK = order();
    var st = run.plan || { tab: PK[0], txt: {}, eh: {}, pts: {} };
    var set = mkSet(up, "plan", st);
    var tab = st.tab || PK[0], pt = D.pat[tab], ex = D.plan[tab], tx = (st.txt || {})[tab] || {}, eh = st.eh || {}, pts = st.pts || {};
    var all = [tx.d, tx.z, tx.m].join(" \n ");
    var allDone = PK.every(function (k) { return eh[k] && eh[k].done; });
    useEffect(function () { if (allDone && !run.done.plan) p.finish("plan", PK.reduce(function (a, k) { return a + (pts[k] || 0); }, 0)); }, [allDone]);
    var setTx = function (f, v) { var a = Object.assign({}, st.txt || {}); a[tab] = Object.assign({}, tx); a[tab][f] = v; set({ txt: a }); };
    var locked = eh[tab] && eh[tab].open;
    var notes = ((run.akten || {}).notes || {})[tab];
    return h(Fr, null,
      h("div", { className: "card" },
        h("h3", null, "[PFLEGEPLANUNG] Vorbereitungsteil"),
        h("p", { className: "muted" }, "Formuliere je Person eine Pflegediagnose im PES-Format (Problem, Ursache b/d, Kennzeichen a/d) nach NANDA-I, ENP oder POP, ein überprüfbares Ziel und die geplanten Maßnahmen. Denke an die Expertenstandards des DNQP."),
        h(PatTabs, { cur: tab, set: function (k) { set({ tab: k }); }, mark: function (k) { return eh[k] && eh[k].done; } })),
      h("div", { className: "card", style: { "--c": pt.farbe } },
        h("div", { className: "pxaktehead" }, h(AvImg, { who: tab, className: "pxheadav" }), h("div", null, h("h3", null, pt.name), h("span", { className: "muted" }, pt.diagnose))),
        notes && h("details", { className: "pxdet" }, h("summary", null, "Deine Notizen aus der Akte"), h("p", { style: { whiteSpace: "pre-wrap", marginTop: 8 } }, notes)),
        h(TextArea, { label: "Pflegediagnose (PES)", value: tx.d, locked: locked, small: true, onChange: function (v) { setTx("d", v); } }),
        h(TextArea, { label: "Pflegeziel (überprüfbar)", value: tx.z, locked: locked, small: true, onChange: function (v) { setTx("z", v); } }),
        h(TextArea, { label: "Geplante Maßnahmen", value: tx.m, locked: locked, onChange: function (v) { setTx("m", v); } }),
        h(SelfCheck, {
          items: ex.chk, text: all, val: eh[tab], max: 12 / PK.length, minLen: 60, title: "[ERWARTUNGSHORIZONT] " + pt.kurz,
          muster: h(Fr, null, h("p", null, h("b", null, "Pflegediagnose: "), ex.diag), h("p", null, h("b", null, "Ziel: "), ex.ziel), h("b", null, "Maßnahmen:"), h("ul", null, ex.mass.map(function (m, i) { return h("li", { key: i }, m); }))),
          set: function (v) { var e = Object.assign({}, eh); e[tab] = v; set({ eh: e }); },
          onScore: function (s) { var q = Object.assign({}, pts); q[tab] = s; set({ pts: q }); }
        })));
  }

  function SecSbar(p) {
    var run = p.run, up = p.up, PK = order();
    var st = run.sbar || { tab: PK[0], txt: {}, eh: {}, pts: {} };
    var set = mkSet(up, "sbar", st);
    var tab = st.tab || PK[0], pt = D.pat[tab], ex = D.sbar[tab], tx = (st.txt || {})[tab] || {}, eh = st.eh || {}, pts = st.pts || {};
    var allDone = PK.every(function (k) { return eh[k] && eh[k].done; });
    useEffect(function () { if (allDone && !run.done.sbar) p.finish("sbar", PK.reduce(function (a, k) { return a + (pts[k] || 0); }, 0)); }, [allDone]);
    var setTx = function (f, v) { var a = Object.assign({}, st.txt || {}); a[tab] = Object.assign({}, tx); a[tab][f] = v; set({ txt: a }); };
    var locked = eh[tab] && eh[tab].open;
    var F = [["S", "Situation", "Wer, wo, was ist jetzt das Problem?"], ["B", "Background", "Relevante Vorgeschichte, Diagnosen, Medikation"], ["A", "Assessment", "Deine pflegerische Einschätzung"], ["R", "Recommendation", "Was tust du / was empfiehlst du?"]];
    return h(Fr, null,
      h("div", { className: "eyebrow", style: { margin: "4px 0 -4px" } }, D.nachtLabel || "Tag 2 · 06:00 Uhr · Übergabe vom Nachtdienst"),
      h(Say, { who: "nacht", mood: "tired", showRole: true, text: h("ul", { className: "pxnightl" }, D.nacht.map(function (n) { return h("li", { key: n[0] }, D.pat[n[0]] ? h(AvImg, { who: n[0], className: "pxmini" }) : h("span", { className: "pxbadge sm" }, n[0]), h("span", null, n[1])); })) }),
      h("div", { className: "card" },
        h("h3", null, "[SBAR] Fallvorstellung vor den Fachprüfenden"),
        h(Say, { who: "pruefer", bare: true, showRole: true, text: "Bitte stellen Sie uns Ihre Patientinnen und Patienten nacheinander im SBAR-Schema vor. Sie haben für alle zusammen etwa 20 Minuten. Beziehen Sie die Informationen aus der Nacht mit ein." }),
        h(PatTabs, { cur: tab, set: function (k) { set({ tab: k }); }, mark: function (k) { return eh[k] && eh[k].done; } })),
      h("div", { className: "card" },
        h("div", { className: "pxaktehead" }, h(AvImg, { who: tab, className: "pxheadav" }), h("div", null, h("h3", null, pt.name), h("span", { className: "muted" }, "Zimmer " + pt.zimmer))),
        F.map(function (f) { return h(TextArea, { key: f[0], label: f[0] + " · " + f[1], ph: f[2], value: tx[f[0]], locked: locked, small: true, onChange: function (v) { setTx(f[0], v); } }); }),
        h(SelfCheck, {
          items: ex.chk, text: [tx.S, tx.B, tx.A, tx.R].join(" \n "), val: eh[tab], max: 8 / PK.length, minLen: 60, title: "[ERWARTUNGSHORIZONT SBAR] " + pt.kurz,
          muster: h("dl", { className: "pxdl" }, F.map(function (f) { return h("div", { key: f[0] }, h("dt", null, f[0] + " · " + f[1]), h("dd", null, ex.muster[f[0]])); })),
          set: function (v) { var e = Object.assign({}, eh); e[tab] = v; set({ eh: e }); },
          onScore: function (s) { var q = Object.assign({}, pts); q[tab] = s; set({ pts: q }); }
        })));
  }

  function SecPrio(p) {
    var run = p.run, up = p.up;
    var st = run.prio || { order: shuf(D.prio, 42).map(function (o) { return o.x.id; }), done: false };
    useEffect(function () { if (!run.prio) up({ prio: st }); }, []);
    return h("div", { className: "card" },
      h("h3", null, "[TAGESPLAN] Prioritäten setzen"),
      h("p", { className: "muted" }, "Bring die Aufgaben deines Frühdienstes nach der Übergabe in die richtige zeitliche und fachliche Reihenfolge. Kriterien: Lebensgefahr vor Schmerz vor zeitgebundenen Aufgaben vor planbaren Aufgaben."),
      h(Sorter, { items: D.prio, val: st, set: function (v) { up({ prio: v }); }, onDone: function (f) { p.finish("prio", 8 * f); } }),
      st.done && h("p", { className: "pxscore" }, "Ergebnis: " + r1(8 * st.frac) + " / 8 P. (volle Punkte für die exakte Position, halbe bei einer Position Abweichung)"));
  }

  /* ================================================================
     PHASE 3: LIVE-BAUSTEINE
     ================================================================ */

  /* --- EKG-Befund (Fall Geriatrie) --- */
  function SecEkg(p) {
    var run = p.run, up = p.up, L = p.sec.live, k = p.sec.k;
    var st = run[k] || {};
    var set = mkSet(up, k, st);
    var pts = function (key, v) { var q = Object.assign({}, st.p || {}); q[key] = v; return q; };
    var fq = st.fq != null, fqOk = fq && Number(st.fq) >= 115 && Number(st.fq) <= 145;
    var pdOk = st.pdDone && Math.abs(Number(st.pdv) - L.pd) <= 2;
    var fin = st.q5 != null;
    useEffect(function () { if (fin && !run.done[k]) { var q = st.p || {}; p.finish(k, p.sec.max * ((q.q1 || 0) + (q.q2 || 0) + (q.fq || 0) + (q.pd || 0) + (q.q3 || 0) + (q.q5 || 0)) / 12); } }, [fin]);
    return h(Fr, null,
      h("div", { className: "card" },
        h(SimHead, { icon: I.pulse, eyebrow: "Bildbefund · Monitor-EKG", title: L.titel }),
        h("p", { style: { marginTop: 12 } }, L.situation),
        h(Strip, { kind: "sinus", title: "Streifen 1 · Aufnahmetag, 14:10 Uhr", sub: "zum Vergleich" }),
        h(Strip, { kind: "af", title: "Streifen 2 · Heute, 06:12 Uhr", sub: "Telemetrie-Alarm „ARRHYTHMIE“" }),
        h("p", { className: "muted", style: { fontSize: 13.5 } }, "Ein großes Kästchen = 5 mm = 0,2 s. Der Streifen zeigt 6 Sekunden. Auf dem Handy kannst du ihn seitlich verschieben."),
        h(Single, { q: L.q1, val: st.q1, seed: 3, onAnswer: function (i, ok) { set({ q1: i, p: pts("q1", ok ? 3 : 0) }); } })),
      st.q1 != null && h("div", { className: "card" },
        h(Multi, { q: L.q2, val: st.q2, seed: 5, set: function (v) { set({ q2: v, p: v.done ? pts("q2", 2 * v.frac) : st.p }); } })),
      st.q2 && st.q2.done && h("div", { className: "card" },
        h("p", { className: "pxqt" }, "Schätze die Kammerfrequenz aus Streifen 2 (6-Sekunden-Methode: QRS-Komplexe im 6-s-Streifen × 10)."),
        h("div", { className: "row" },
          h("input", { className: "input", type: "number", inputMode: "numeric", style: { maxWidth: 140 }, value: st.fqv || "", disabled: fq, onChange: function (e) { set({ fqv: e.target.value }); } }),
          h("span", { className: "muted" }, "/min"),
          !fq && h("button", { type: "button", className: "btn sm", disabled: !st.fqv, onClick: pd(function () { var ok = Number(st.fqv) >= 115 && Number(st.fqv) <= 145; set({ fq: st.fqv, p: pts("fq", ok ? 1 : 0) }); }) }, "Prüfen")),
        fq && h("p", { className: cx("fb", fqOk ? "okt" : "badt") }, fqOk ? "Passt. Im Streifen liegen 13 QRS-Komplexe, also etwa 130/min." : "Nicht ganz. Zähle die QRS-Komplexe in den 6 Sekunden (13) und nimm sie mal 10: etwa 130/min."),
        fq && h(Fr, null,
          h("div", { className: "pxvitals" }, h(Ico, { d: I.clock }), h("span", null, L.vitals)),
          h("p", { className: "pxqt", style: { marginTop: 14 } }, "Wie groß ist das Pulsdefizit?"),
          h("div", { className: "row" },
            h("input", { className: "input", type: "number", inputMode: "numeric", style: { maxWidth: 140 }, value: st.pdv || "", disabled: st.pdDone, onChange: function (e) { set({ pdv: e.target.value }); } }),
            h("span", { className: "muted" }, "/min"),
            !st.pdDone && h("button", { type: "button", className: "btn sm", disabled: !st.pdv, onClick: pd(function () { var ok = Math.abs(Number(st.pdv) - L.pd) <= 2; set({ pdDone: true, p: pts("pd", ok ? 1 : 0) }); }) }, "Prüfen")),
          st.pdDone && h("p", { className: cx("fb", pdOk ? "okt" : "badt") }, (pdOk ? "Richtig: " : "Richtig wäre: ") + "132 − 104 = 28/min. Das Pulsdefizit zeigt, dass nicht jede Kammeraktion eine tastbare Pulswelle erzeugt; typisch für tachykardes Vorhofflimmern."))),
      st.pdDone && h("div", { className: "card" },
        h(Multi, { q: L.q3, val: st.q3, seed: 9, set: function (v) { set({ q3: v, p: v.done ? pts("q3", 4 * v.frac) : st.p }); } })),
      st.q3 && st.q3.done && h("div", { className: "card" },
        h(Single, { q: L.q5, val: st.q5, seed: 13, onAnswer: function (i, ok) { set({ q5: i, p: pts("q5", ok ? 1 : 0) }); } })),
      fin && h(DoneCard, { k: k, run: run, max: p.sec.max, merke: "Ein Alarm wird am Menschen abgeklärt. Beim Vorhofflimmern zählt der Puls über 60 Sekunden, und der Arzt wird sofort und strukturiert informiert." }));
  }

  function DoneCard(p) {
    return h("div", { className: "card pxdone" },
      h("b", null, "Abschnitt abgeschlossen: " + r1(p.run.pts[p.k] || 0) + " / " + p.max + " P."),
      p.merke && h("p", { className: "muted", style: { margin: "6px 0 0" } }, h("b", null, "Merke: "), p.merke),
      p.children);
  }

  /* --- Bildbefund mit Anklicken (Hotspots) --- */
  function SecHot(p) {
    var run = p.run, up = p.up, L = p.sec.live, k = p.sec.k;
    var st = run[k] || { pins: [], miss: 0, done: false };
    var set = mkSet(up, k, st);
    var ref = useRef(null);
    var flash = useState(null), fl = flash[0], setFl = flash[1];
    var N = L.spots.length;
    var names = useMemo(function () { return shuf(L.spots.map(function (s) { return s.t; }).concat(L.extra || []), 29).map(function (o) { return o.x; }); }, [k]);
    function inSpot(s, x, y) { return s.c.some(function (c) { var dx = x - c[0], dy = y - c[1]; return dx * dx + dy * dy <= c[2] * c[2]; }); }
    function click(e) {
      if (st.done) return;
      var svg = ref.current; if (!svg) return;
      var r = svg.getBoundingClientRect(), vb = (L.vb || "0 0 400 280").split(" ").map(Number);
      var x = (e.clientX - r.left) / r.width * vb[2], y = (e.clientY - r.top) / r.height * vb[3];
      var hitI = -1;
      var hits = []; L.spots.forEach(function (s, i) { if (inSpot(s, x, y)) hits.push(i); });
      var free = hits.filter(function (i) { return !st.pins.some(function (pn) { return pn.s === i; }); });
      hitI = free.length ? free[0] : hits.length ? hits[0] : -1;
      if (hitI >= 0) {
        if (!free.length) { setFl({ x: x, y: y, t: "schon markiert", k: Date.now() }); return; }
        set({ pins: st.pins.concat([{ s: hitI, x: x, y: y, n: "" }]) });
        setFl({ x: x, y: y, t: "gefunden", ok: true, k: Date.now() });
      } else { set({ miss: st.miss + 1 }); setFl({ x: x, y: y, t: "hier nichts Auffälliges", k: Date.now() }); }
    }
    useEffect(function () { if (!fl) return; var t = setTimeout(function () { setFl(null); }, 1100); return function () { clearTimeout(t); }; }, [fl && fl.k]);
    var found = st.pins.length, named = st.pins.filter(function (pn) { return pn.n === L.spots[pn.s].t; }).length;
    function finish() {
      var sc = p.sec.max * (0.5 * found / N + 0.5 * named / N) - Math.min(p.sec.max * 0.2, p.sec.max * 0.04 * st.miss);
      set({ done: true }); p.finish(k, Math.max(0, sc));
    }
    return h(Fr, null,
      h("div", { className: "card" },
        h(SimHead, { icon: I.eye, eyebrow: "Bildbefund · Antippen und benennen", title: L.titel }),
        L.banner && h(PatBanner, { pt: L.banner, who: p.sec.pat, c: (D.pat[p.sec.pat] || {}).farbe }),
        h(Narr, { text: L.intro, who: p.sec.pat, mood: L.mood }),
        h("div", { className: "pxhotq" }, h("b", null, L.q), h("span", null, "Tippe auf jede Auffälligkeit im Bild. Danach benennst du sie unten. Gesucht: ", h("b", null, N), " Befunde.")),
        h("div", { className: "pxhot" + (st.done ? " done" : "") },
          h(Art, { svg: L.art, vb: L.vb, label: L.titel }),
          h("svg", { ref: ref, viewBox: L.vb || "0 0 400 280", className: "pxhotlay", onClick: click, role: "application", "aria-label": "Bild antippen" },
            st.done && L.spots.map(function (s, i) {
              var f = st.pins.some(function (pn) { return pn.s === i; });
              return s.c.map(function (c, j) { return h("circle", { key: i + "-" + j, cx: c[0], cy: c[1], r: c[2], className: f ? "pxring ok" : "pxring miss" }); });
            }),
            st.pins.map(function (pn, i) { return h("g", { key: i, className: "pxpin" }, h("circle", { cx: pn.x, cy: pn.y, r: 11 }), h("text", { x: pn.x, y: pn.y + 4, textAnchor: "middle" }, i + 1)); }),
            st.done && L.spots.map(function (s, i) { if (st.pins.some(function (pn) { return pn.s === i; })) return null; var c = s.c[0]; return h("g", { key: "m" + i, className: "pxpin miss" }, h("circle", { cx: c[0], cy: c[1], r: 10 }), h("text", { x: c[0], y: c[1] + 4, textAnchor: "middle" }, "!")); }),
            fl && h("g", { key: fl.k, className: "pxflash" + (fl.ok ? " ok" : "") }, h("circle", { cx: fl.x, cy: fl.y, r: 16 }), h("text", { x: fl.x, y: fl.y - 22, textAnchor: "middle" }, fl.t)))),
        h("div", { className: "pxhotbar" },
          h("span", { className: "chip " + (found === N ? "okc" : "blue") }, found + " / " + N + " gefunden"),
          st.miss > 0 && h("span", { className: "chip" }, st.miss + " Fehlklick" + (st.miss > 1 ? "s" : "")),
          L.cap && h("span", { className: "muted", style: { fontSize: 13 } }, L.cap))),
      st.pins.length > 0 && h("div", { className: "card" },
        h("h3", null, "Benenne deine Befunde"),
        h("div", { className: "pxnames" }, st.pins.map(function (pn, i) {
          var sp = L.spots[pn.s], ok = pn.n === sp.t;
          return h("div", { key: i, className: cx("pxname", st.done && (ok ? "ok" : "bad")) },
            h("span", { className: "pxnum" }, i + 1),
            h("div", { style: { flex: 1, minWidth: 0 } },
              h("select", { className: "input", value: pn.n, disabled: st.done, onChange: function (e) { var pins = st.pins.slice(); pins[i] = Object.assign({}, pn, { n: e.target.value }); set({ pins: pins }); } },
                h("option", { value: "" }, "Befund auswählen …"), names.map(function (n) { return h("option", { key: n, value: n }, n); })),
              st.done && h("div", { className: "fb" }, h("b", null, (ok ? "Richtig: " : "Richtig wäre: ") + sp.t + ". "), sp.d)));
        })),
        !st.done && h("div", { className: "row", style: { marginTop: 14 } },
          h("button", { type: "button", className: "btn", disabled: st.pins.some(function (pn) { return !pn.n; }), onClick: pd(finish) }, h(Ico, { d: I.check }), "Befund auswerten"),
          found < N && h("span", { className: "muted", style: { fontSize: 13.5 } }, "Du kannst auch auswerten, bevor du alle gefunden hast. Fehlende werden dann gezeigt."))),
      st.done && L.spots.some(function (s, i) { return !st.pins.some(function (pn) { return pn.s === i; }); }) && h("div", { className: "card" },
        h("h3", null, "Übersehen"),
        h("ul", { className: "pxmissl" }, L.spots.map(function (s, i) { return st.pins.some(function (pn) { return pn.s === i; }) ? null : h("li", { key: i }, h("b", null, s.t + ": "), s.d); }))),
      st.done && L.folge && h("div", { className: "card" }, h(Single, { q: L.folge, val: st.fq, seed: 19, onAnswer: function (i) { set({ fq: i }); } })),
      st.done && (!L.folge || st.fq != null) && h(DoneCard, { k: k, run: run, max: p.sec.max, merke: L.merke }));
  }

  /* --- Vitalzeichen erheben und Medikamente kontrollieren --- */
  var GRUENDE = [
    ["ok", "Korrekt – kann gegeben werden"],
    ["praep", "Falsches Präparat (Verwechslung)"],
    ["dosis", "Falsche Dosis oder Stärke"],
    ["zeit", "Falscher Zeitpunkt"],
    ["pause", "Pausiert oder abgesetzt – nicht geben"],
    ["ki", "Aktuell kontraindiziert (Vitalwert/Labor) – zurückhalten, Rücksprache"],
    ["allergie", "Allergie oder Unverträglichkeit"],
    ["form", "Darreichungsform passt nicht zur Person"]
  ];
  var VI = {
    rr: "M3 12h4l2-5 3 10 2-5h7", puls: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z",
    af: "M4 8c3-3 6 3 9 0s5-3 7 0M4 14c3-3 6 3 9 0s5-3 7 0", spo2: "M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z", temp: "M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z",
    bew: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 10h.01M15 10h.01M8.5 15c2 1.5 5 1.5 7 0", bz: "M12 2.5c3 4.5 6 7.4 6 11a6 6 0 0 1-12 0c0-3.6 3-6.5 6-11z", schmerz: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 10h.01M15 10h.01M8.5 16c2-1.5 5-1.5 7 0",
    gew: "M4 20h16l-2-12H6zM9 8a3 3 0 0 1 6 0", def: "M12 5v14M5 12h14"
  };

  function Monitor(p) {
    var items = p.items, got = p.got || {};
    return h("div", { className: "pxmon" },
      h("div", { className: "pxmonh" }, h("span", null, h("i", { className: "pxmondot" }), " Bettplatz " + p.bett), h("span", null, p.uhr)),
      h("div", { className: "pxmong" }, items.map(function (it) {
        var v = got[it.k];
        return h("div", { key: it.k, className: "pxmonv c-" + (it.farbe || it.k) },
          h("small", null, it.kurz || it.t), h("b", null, v ? it.val : "– –"), h("span", null, v ? it.einheit || "" : ""));
      })));
  }

  function SecVitMed(p) {
    var run = p.run, up = p.up, L = p.sec.live, k = p.sec.k, V = L.vit, M = L.med;
    var st = run[k] || { got: {}, tq: {}, med: {}, step: V ? "vit" : "med" };
    var set = mkSet(up, k, st);
    var pt = D.pat[p.sec.pat];
    var cur = st.open != null && V ? V.items.filter(function (x) { return x.k === st.open; })[0] : null;
    var allGot = V ? V.items.every(function (x) { return st.got[x.k]; }) : true;
    var dispOrd = useMemo(function () { return M ? shuf(M.disp, 23).map(function (o) { return o.i; }) : []; }, [k]);
    var fin = (!V || st.actDone != null) && (!M || st.medDone) && (!M || !M.fehlt || (st.fehlt && st.fehlt.done)) && (!L.final || st.fin != null);
    useEffect(function () {
      if (!fin || run.done[k]) return;
      var vs = 0, vm = 0;
      if (V) {
        V.items.forEach(function (it) { if (it.q) { vm++; if (st.tq[it.k] != null && it.q.opts[st.tq[it.k]].ok) vs++; } });
        if (V.news) { vm++; if (st.newsOk) vs++; }
        vm++; if (st.actOk) vs++;
      }
      var ms = 0, mm = 0;
      if (M) {
        M.disp.forEach(function (d, i) { mm++; if (st.med[i] === d.r) ms++; });
        if (M.fehlt) { mm++; ms += (st.fehlt && st.fehlt.frac) || 0; }
      }
      if (L.final) { mm++; if (st.finOk) ms++; }
      var wV = V ? (L.wVit || 0.4) : 0, wM = 1 - wV;
      p.finish(k, p.sec.max * ((vm ? wV * vs / vm : 0) + (mm ? wM * ms / mm : 0)));
    }, [fin]);
    return h(Fr, null,
      h("div", { className: "card" },
        h(SimHead, { icon: VI.rr, eyebrow: "Simulation · " + (V ? "Vitalzeichen & Medikamente" : "Medikamente"), title: L.titel, c: pt.farbe }),
        h(PatBanner, { pt: L.banner || { name: pt.name, sub: pt.alter + " J. · Zimmer " + pt.zimmer }, who: p.sec.pat, c: pt.farbe }),
        h(Narr, { text: L.intro, who: p.sec.pat, mood: L.mood }),
        h("div", { className: "pxsteps2" },
          V && h("span", { className: cx(st.step === "vit" && "on", st.actDone != null && "done") }, h("i", null, "1"), "Vitalzeichen"),
          M && h("span", { className: cx(st.step === "med" && "on", st.medDone && "done") }, h("i", null, V ? "2" : "1"), "Medikamente prüfen"))),
      V && h("div", { className: "card pxvitcard" },
        h("div", { className: "pxvitgrid" },
          h("div", null,
            h("p", { className: "pxqt" }, V.auftrag || "Erhebe die Vitalzeichen. Tippe auf ein Messgerät."),
            h("div", { className: "pxdev" }, V.items.map(function (it) {
              var g = st.got[it.k];
              return h("button", { type: "button", key: it.k, className: cx("pxdevb", g && "got", st.open === it.k && "on"), disabled: !!g || st.actDone != null, onClick: pd(function () { if (it.q) set({ open: it.k }); else { var gg = Object.assign({}, st.got); gg[it.k] = true; set({ got: gg, open: null }); } }) },
                h("span", { className: "pxdevi" }, h(Ico, { d: VI[it.ico || it.k] || VI.def, w: 1.9 })),
                h("b", null, it.t), h("small", null, g ? it.val + " " + (it.einheit || "") : it.wie || "messen"));
            }))),
          h(Monitor, { items: V.items, got: st.got, bett: pt.zimmer, uhr: L.uhr || p.sec.clock.split("· ")[1] })),
        cur && h("div", { className: "pxdevq", key: cur.k },
          h(Single, { q: cur.q, val: st.tq[cur.k], seed: 31, onAnswer: function (i) { var t = Object.assign({}, st.tq); t[cur.k] = i; set({ tq: t }); } }),
          st.tq[cur.k] != null && h("div", { className: "row", style: { marginTop: 10 } }, h("button", { type: "button", className: "btn sm", onClick: pd(function () { var gg = Object.assign({}, st.got); gg[cur.k] = true; set({ got: gg, open: null }); }) }, "Messwert ablesen", h(Ico, { d: I.right })))),
        allGot && V.befund && h("div", { className: "pxvitals", style: { marginTop: 14 } }, h(Ico, { d: I.clock }), h("span", null, V.befund)),
        allGot && V.news && h("div", { style: { marginTop: 14 } },
          h("p", { className: "pxqt" }, V.news.frage || "Berechne den NEWS2-Score."),
          h("div", { className: "row" },
            h("input", { className: "input", type: "number", inputMode: "numeric", style: { maxWidth: 120 }, value: st.newsv || "", disabled: st.newsDone, onChange: function (e) { set({ newsv: e.target.value }); } }),
            h("span", { className: "muted" }, "Punkte"),
            !st.newsDone && h("button", { type: "button", className: "btn sm", disabled: st.newsv === "" || st.newsv == null, onClick: pd(function () { set({ newsDone: true, newsOk: Math.abs(Number(st.newsv) - V.news.wert) <= (V.news.tol || 1) }); }) }, "Prüfen")),
          st.newsDone && h("div", { className: cx("fb", st.newsOk ? "okt" : "badt") }, (st.newsOk ? "Passt. " : "Richtig wäre " + V.news.wert + " Punkte. "), V.news.erk)),
        allGot && (!V.news || st.newsDone) && h("div", { style: { marginTop: 16 } },
          h(Single, { q: V.act, val: st.act, seed: 37, onAnswer: function (i, ok) { set({ act: i, actOk: ok, actDone: true }); } })),
        st.actDone != null && M && st.step === "vit" && h("div", { className: "row", style: { marginTop: 14 } }, h("button", { type: "button", className: "btn", onClick: pd(function () { set({ step: "med" }); }) }, "Weiter zu den Medikamenten", h(Ico, { d: I.right })))),
      M && (st.step === "med" || !V) && h("div", { className: "card" },
        h("div", { className: "tag" }, h("span", null, "Medikamente " + M.zeit + " Uhr"), h("span", null, "R-Regeln: Patient, Arzneimittel, Dosis, Applikation, Zeitpunkt, Dokumentation")),
        M.hinweis && h("div", { className: "pxvitals", style: { marginTop: 0, marginBottom: 12 } }, h(Ico, { d: I.alert }), h("span", null, M.hinweis)),
        h("div", { className: "pxmedgrid" },
          h("div", { className: "pxkurve" },
            h("div", { className: "pxkurveh" }, h("b", null, "Ärztliche Anordnung"), h("span", null, pt.name + " · Allergien: " + (M.allergie || "keine bekannt"))),
            h("table", null, h("thead", null, h("tr", null, h("th", null, "Arzneimittel"), h("th", null, "Dosis"), h("th", null, "Zeit"), h("th", null, "Hinweis"))),
              h("tbody", null, M.plan.map(function (r, i) { return h("tr", { key: i, className: r.aus ? "aus" : "" }, h("td", null, h("b", null, r.n)), h("td", null, r.d), h("td", null, r.z), h("td", null, r.h || ""));
              })))),
          h("div", { className: "pxdisp" },
            h("div", { className: "pxkurveh" }, h("b", null, "Gerichteter Dispenser · " + M.zeit), h("span", null, "von der Nachtschicht gestellt")),
            dispOrd.map(function (i) {
              var d = M.disp[i], v = st.med[i], ok = st.medDone && v === d.r;
              return h("div", { key: i, className: cx("pxpillrow", st.medDone && (ok ? "ok" : "bad")) },
                h(Pill, { f: d.pill }),
                h("div", { className: "pxpillt" },
                  h("b", null, d.n), d.sub && h("small", null, d.sub),
                  h("select", { className: "input", value: v || "", disabled: st.medDone, onChange: function (e) { var m = Object.assign({}, st.med); m[i] = e.target.value; set({ med: m }); } },
                    h("option", { value: "" }, "Prüfergebnis wählen …"), GRUENDE.map(function (g) { return h("option", { key: g[0], value: g[0] }, g[1]); })),
                  st.medDone && h("div", { className: "fb" }, h("b", null, ok ? "Richtig. " : "Richtig wäre: " + GRUENDE.filter(function (g) { return g[0] === d.r; })[0][1] + ". "), d.fb)));
            }))),
        !st.medDone && h("div", { className: "row", style: { marginTop: 14 } },
          h("button", { type: "button", className: "btn", disabled: M.disp.some(function (_, i) { return !st.med[i]; }), onClick: pd(function () { set({ medDone: true }); }) }, h(Ico, { d: I.check }), "Dispenser prüfen"),
          h("span", { className: "muted", style: { fontSize: 13.5 } }, "Vergleiche jedes Arzneimittel mit der Anordnung und den aktuellen Werten."))),
      M && st.medDone && M.fehlt && h("div", { className: "card" },
        h(Multi, { q: M.fehlt, val: st.fehlt, seed: 41, set: function (v) { set({ fehlt: v }); } })),
      M && st.medDone && (!M.fehlt || (st.fehlt && st.fehlt.done)) && L.final && h("div", { className: "card" },
        h(Single, { q: L.final, val: st.fin, seed: 43, onAnswer: function (i, ok) { set({ fin: i, finOk: ok }); } })),
      fin && h(DoneCard, { k: k, run: run, max: p.sec.max, merke: L.merke }));
  }

  function Pill(p) {
    var f = p.f || {}, c = f.c || "#e2e8f0", c2 = f.c2 || c;
    var body = f.s === "kapsel" ? '<rect x="6" y="15" width="36" height="18" rx="9" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><path d="M24 15h9a9 9 0 0 1 0 18h-9z" fill="' + c2 + '"/>'
      : f.s === "oval" ? '<ellipse cx="24" cy="24" rx="17" ry="11" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><path d="M12 24h24" stroke="rgba(0,0,0,.15)"/>'
      : f.s === "spritze" ? '<rect x="8" y="19" width="26" height="10" rx="2" fill="#f8fafc" stroke="#94a3b8"/><rect x="10" y="21" width="14" height="6" fill="' + c + '"/><path d="M34 24h8M4 19v10M8 24H4" stroke="#64748b" stroke-width="2"/>'
      : f.s === "saft" ? '<path d="M17 10h14v5l3 4v21a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V19l3-4z" fill="#fff" stroke="#94a3b8"/><path d="M14 26h20v14a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="' + c + '"/>'
      : f.s === "supp" ? '<path d="M14 30c0-10 5-17 10-17s10 7 10 17z" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><rect x="14" y="30" width="20" height="5" rx="2" fill="' + c + '" stroke="rgba(0,0,0,.18)"/>'
      : f.s === "spray" ? '<rect x="16" y="8" width="16" height="22" rx="4" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><path d="M18 30h12v10H18z" fill="#e2e8f0" stroke="#94a3b8"/>'
      : '<circle cx="24" cy="24" r="14" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><path d="M14 24h20" stroke="rgba(0,0,0,.15)"/>';
    var n = f.n || 1, out = "";
    for (var i = 0; i < n; i++) out += '<g transform="translate(' + (i * 14) + ',0)">' + body + "</g>";
    return h("span", { className: "pxpill", dangerouslySetInnerHTML: { __html: '<svg viewBox="0 0 ' + (48 + (n - 1) * 14) + ' 48" aria-hidden="true">' + out + "</svg>" } });
  }

  /* --- Pflegehandlung Schritt für Schritt mit Illustration --- */
  /* --- Pflegehandlung als Simulation im Stil der App-Simulationen: Arbeitsschritte antippen, Szene läuft mit --- */
  var TI = {
    hand: "M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 14.5a1.5 1.5 0 0 1 2.5-1.6L7 14V11",
    glove: "M8 21v-9L6 9V5a1 1 0 0 1 2 0v4M8 9V3.5a1 1 0 0 1 2 0V9M10 9V3a1 1 0 0 1 2 0v6M12 9V3.5a1 1 0 0 1 2 0V12l2-2a1.5 1.5 0 0 1 2 2l-4 5v4",
    sterile: "M8 21v-9L6 9V5a1 1 0 0 1 2 0v4M8 9V3.5a1 1 0 0 1 2 0V9M10 9V3a1 1 0 0 1 2 0v6M12 9V3.5a1 1 0 0 1 2 0V12l2-2a1.5 1.5 0 0 1 2 2l-4 5v4M18 3v4M16 5h4",
    talk: "M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5", id: "M3 6h18v12H3zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 15c1-2 5-2 6 0M14 9h4M14 12h4",
    tray: "M3 8h18v10H3zM3 8l3-4h12l3 4M9 12h6", screen: "M4 4v16M20 4v16M4 6h16M8 6v12M12 6v12M16 6v12",
    bed: "M3 18V8M21 18v-5H3M7 13V9h5a3 3 0 0 1 3 3v1", light: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
    drape: "M3 4h18v16H3zM9 10h6v4H9z", swab: "M12 3a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4zM12 13v8",
    cath: "M4 20c4-4 4-8 8-8s4-4 8-8M18 4l2 2M5 19l-1 1", syringe: "M18 3l3 3M16 5l3 3-9 9-3 1 1-3zM13 8l3 3M5 19l-2 2",
    flush: "M18 3l3 3M16 5l3 3-9 9-3 1 1-3zM4 14c-1 2 0 4 2 4", bag: "M7 3h10v10a5 5 0 0 1-10 0zM12 18v3M9 7h6",
    clamp: "M5 12h14M9 8l-4 4 4 4M15 8l4 4-4 4", scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12",
    measure: "M3 7h18v10H3zM7 7v4M11 7v6M15 7v4M19 7v6", plate: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    pouch: "M7 4h10v9a5 5 0 0 1-10 0zM9 20h6", water: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
    trash: "M5 7h14l-1.5 13h-11zM9 7V4h6v3M3 7h18", doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5", eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    check: "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11", clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    person: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1", help: "M9 7a4 4 0 1 1 6 3.5c-1.2.7-2 1.5-2 3M12 18h.01M4 21v-1a5 5 0 0 1 3-4.6",
    spoon: "M14 3a4 6 0 1 0 0 12M12 14l-6 7", cup: "M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h1a3 3 0 0 1 0 6h-1M8 3v3M12 3v3",
    sit: "M7 20v-6h9l2 6M7 14V6M16 14V9a2 2 0 0 0-2-2h-2", mouth: "M4 12c4 5 12 5 16 0M4 12c4-3 12-3 16 0",
    inhal: "M8 3h5v7H8zM10 10v4h8v5H6v-9M18 14h3", spacer: "M3 9h4v6H3zM7 8h10l3 4-3 4H7zM20 10v4",
    mask: "M5 9c0-3 3-5 7-5s7 2 7 5v3c0 4-3 8-7 8s-7-4-7-8zM9 12h6", wheel: "M10 18a6 6 0 1 0 0-12M7 4h3l2 8h6l2 6M10 12h6",
    brake: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12h8", shoe: "M3 17h18v-3l-6-2-3-5H6l-3 4z", stand: "M12 4v16M8 8l4-4 4 4M6 20h12",
    pillow: "M4 9c0-2 2-3 4-3h8c2 0 4 1 4 3v6c0 2-2 3-4 3H8c-2 0-4-1-4-3z", wrap: "M4 6h16M4 10h16M4 14h16M4 18h16M8 4v16",
    bandage: "M3 14l7-7a3 3 0 0 1 4 0l3 3a3 3 0 0 1 0 4l-7 7a3 3 0 0 1-4 0l-3-3a3 3 0 0 1 0-4zM11 11h.01M13 13h.01",
    thermo: "M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z", pulse: "M3 12h4l2-5 3 10 2-5h7", stop: "M8 3h8l5 5v8l-5 5H8l-5-5V8zM12 8v5M12 16h.01",
    phone: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2", lift: "M12 3v10M8 9l4 4 4-4M5 21h14",
    gel: "M9 3h6v4l2 3v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10l2-3zM9 14h6", warm: "M8 21c0-4 8-4 8-8M12 3c-3 3 3 5 0 8M16 4c-2 2 2 3 0 5",
    ruler: "M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2", label: "M3 12V4h8l10 10-8 8zM7 8h.01"
  };
  function TIco(p) { return h("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, h("path", { d: TI[p.n] || TI.check })); }
  function SecSteps(p) {
    var run = p.run, up = p.up, L = p.sec.live, k = p.sec.k, steps = L.steps, wrong = L.wrong || [];
    var st = run[k] || { i: 0, hints: 0, abbr: 0, kos: [], log: [] };
    var set = mkSet(up, k, st);
    var i = st.i, N = steps.length, done = i >= N, pt = D.pat[p.sec.pat] || {};
    var tools = useMemo(function () {
      var m = {}, list = [];
      steps.forEach(function (s) { if (!m[s.t]) { m[s.t] = 1; list.push({ t: s.t, ic: s.ic }); } });
      wrong.forEach(function (w) { if (!m[w.t]) { m[w.t] = 1; list.push({ t: w.t, ic: w.ic, w: w }); } });
      return shuf(list, 13 + k.length * 7).map(function (o) { return o.x; });
    }, [k]);
    var fl = useState(null), flash = fl[0], setFlash = fl[1];
    useEffect(function () {
      if (done && !run.done[k]) {
        var pen = st.hints * 0.5 + st.abbr * 1.5;
        p.finish(k, p.sec.max * clamp((N - pen) / N, 0, 1), st.kos.length ? st.kos : null);
      }
    }, [done]);
    function tap(tl) {
      if (done) return;
      var nx = steps[i];
      if (tl.t === nx.t) {
        set({ i: i + 1, last: { ok: true, t: nx.t, fb: nx.fb, say: nx.say, i: i } });
        setFlash({ t: tl.t, ok: true, n: Date.now() });
        return;
      }
      var later = steps.slice(i + 1).some(function (s) { return s.t === tl.t; });
      var w = tl.w;
      if (w) {
        var kos = w.ko ? st.kos.concat([(L.kurz || L.titel) + ": " + w.t]) : st.kos;
        set({ hints: st.hints + (w.ko ? 0 : 1), abbr: st.abbr + (w.ko ? 1 : 0), kos: kos, last: { ok: false, ko: !!w.ko, t: w.t, fb: w.fb, i: i } });
      } else if (later) {
        set({ hints: st.hints + 1, last: { ok: false, t: tl.t, fb: "Das kommt später. Was ist jetzt der nächste Schritt?" + (nx.tip ? " Tipp: " + nx.tip : ""), i: i } });
      } else {
        set({ last: { ok: false, soft: true, t: tl.t, fb: "Das hast du schon erledigt.", i: i } });
      }
      setFlash({ t: tl.t, ok: false, n: Date.now() });
    }
    useEffect(function () { if (!flash) return; var t = setTimeout(function () { setFlash(null); }, 700); return function () { clearTimeout(t); }; }, [flash && flash.n]);
    var phs = L.phases || [["vor", "Vorbereiten"], ["durch", "Durchführen"], ["nach", "Nachbereiten"]];
    var curPh = done ? "zz" : (steps[i].ph || "durch"), phIdx = phs.map(function (x) { return x[0]; }).indexOf(curPh);
    var svg = L.scene ? L.scene(Math.min(i, N), st.last) : (L.art && (L.art[(steps[Math.min(i, N - 1)] || {}).img] || "")) || "";
    var status = done ? (L.statusEnd || "Fertig") : (L.status ? L.status(i) : steps[i].cap || "");
    var last = st.last;
    return h(Fr, null,
      h("div", { className: "card" },
        h("div", { className: "simx" },
          h("div", { className: "simhead" },
            h("span", { className: "simic", style: { background: "color-mix(in srgb," + (pt.farbe || "#0062ff") + " 14%,transparent)", color: pt.farbe } }, h(TIco, { n: L.ic || "hand" })),
            h("div", { style: { minWidth: 0 } }, h("div", { className: "eyebrow" }, "Simulation · Pflegehandlung · " + N + " Schritte"), h("h3", null, L.titel))),
          h("ol", { className: "ssteps", "aria-label": "Phase" }, phs.map(function (x, n) {
            var isDone = done || n < phIdx, isCur = !done && n === phIdx;
            return h("li", { key: x[0], className: isDone ? "done" : isCur ? "cur" : "" }, h("i", null, isDone ? h(Ico, { d: I.check, w: 3 }) : n + 1), h("span", null, x[1]));
          })),
          h("div", { className: "phead", style: { marginTop: 12 } },
            h(AvImg, { who: p.sec.pat, className: "pxpavimg", mood: L.mood }),
            h("div", { style: { minWidth: 0, flex: "1 1 170px" } }, h("b", null, (L.banner || {}).name || pt.name), h("span", null, (L.banner || {}).sub || "")),
            h("div", { className: "pbadges" }, ((L.banner || {}).chips || []).map(function (c, n) { return h("span", { key: n, className: "pb " + (c[1] === "red" ? "crit" : c[1] === "warn" ? "warn" : "info") }, c[0]); }))),
          h(Narr, { text: L.intro, who: p.sec.pat, mood: L.mood }),
          h("details", { className: "pxdet" }, h("summary", null, "K.o.-Kriterien: Diese Fehler führen in der echten Prüfung zum Abbruch"), h("ul", null, (L.ko || []).map(function (x, n) { return h("li", { key: n }, x); }))))),
      h("div", { className: "card pxsimcard2" },
        h("div", { className: cx("ortable", last && last.ko && last.i === i && "crash") },
          h("div", { className: "pxstage" },
            h("svg", { key: "sc" + i, viewBox: "0 0 400 280", className: "pxart2", role: "img", "aria-label": status || L.titel, dangerouslySetInnerHTML: { __html: svg } }),
            h("div", { className: "pxstagehud" }, h("span", null, done ? "Fertig" : "Schritt " + (i + 1) + " von " + N), h("span", null, status)),
            last && last.i === i - 1 && last.ok && last.say && h("div", { className: "pxstagesay", key: "s" + i }, h(Say, { bare: true, who: p.sec.pat, mood: "smile", text: last.say }))),
          h("div", { className: "pxstat" },
            h("div", { className: "pxprog2" }, steps.map(function (s, n) { return h("i", { key: n, className: n < i ? "on" : n === i ? "cur" : "" }); })),
            h("span", null, i + " von " + N + " Schritten · " + st.hints + " Hinweis" + (st.hints === 1 ? "" : "e") + " · " + st.abbr + " Abbr" + (st.abbr === 1 ? "uch" : "üche"))),
          !done && h("p", { className: "phint" }, L.hint || "Tippe die Arbeitsschritte in der richtigen Reihenfolge an. Manche Schritte wie die Händedesinfektion brauchst du mehrmals."),
          !done && h("div", { className: "tools" }, tools.map(function (tl) {
            var f = flash && flash.t === tl.t;
            return h("button", { type: "button", key: tl.t, className: cx("tool", f && (flash.ok ? "hit" : "pxmisst")), onClick: pd(function () { tap(tl); }) }, h(TIco, { n: tl.ic }), h("span", null, tl.t));
          })),
          last && h("div", { key: "fb" + (st.log ? st.log.length : 0) + "-" + i + "-" + last.t, className: cx("pxfbx", last.ok ? "ok" : last.ko ? "ko" : last.soft ? "soft" : "bad") },
            h("b", null, last.ok ? "✓ " + last.t : last.ko ? "K.o.-Kriterium: " + last.t : last.t),
            h("span", null, last.fb)),
          i > 0 && h("ol", { className: "trail" }, steps.slice(0, i).map(function (s, n) { return h("li", { key: n }, s.t); }))),
        done && h("div", { className: "pxstep", style: { marginTop: 14 } },
          h("b", null, "Pflegehandlung abgeschlossen: " + r1(run.pts[k] || 0) + " / " + p.sec.max + " P."),
          h("p", { className: "muted", style: { margin: "6px 0 0" } }, st.hints || st.abbr ? st.hints + " Hinweis(e), " + st.abbr + " Abbruch/Abbrüche. Jeder Hinweis kostet einen halben Schritt, jeder Abbruch anderthalb." : "Alle Schritte ohne Hinweis in der richtigen Reihenfolge."),
          st.kos.length > 0 && h("div", { className: "pxloop ko" }, h(Ico, { d: I.alert }), h("span", null, "Ausgelöste K.o.-Kriterien: " + st.kos.join(" · "))),
          L.merke && h("p", { style: { marginTop: 10 } }, h("b", null, "Merke: "), L.merke))));
  }

  /* --- Gespräch mit Entscheidungsbaum (Fall Geriatrie) --- */
  function SecTree(p) {
    var run = p.run, up = p.up, B = p.sec.live, k = p.sec.k;
    var st = run[k] || { node: B.start, path: [], infos: [], score: 0, maxs: 0, kos: [] };
    var set = mkSet(up, k, st);
    var node = B.nodes[st.node];
    var fin = st.diag != null;
    useEffect(function () { if (fin && !run.done[k]) { var raw = st.score + (st.diagOk ? 3 : 0), mx = st.maxs + 3; p.finish(k, p.sec.max * raw / mx, st.kos.length ? st.kos : null); } }, [fin]);
    function choose(o) {
      var mx = Math.max.apply(null, node.opts.map(function (x) { return x.p; }));
      var infos = st.infos.slice();
      [node.info, o.info].forEach(function (x) { if (x && infos.indexOf(x) < 0) infos.push(x); });
      var nextInfo = o.next !== "end" && B.nodes[o.next] && B.nodes[o.next].info;
      if (nextInfo && infos.indexOf(nextInfo) < 0) infos.push(nextInfo);
      set({ path: st.path.concat([{ node: st.node, who: node.who, say: node.say, t: o.t, re: o.re, fb: o.fb, p: o.p, mx: mx, typ: o.typ, warn: o.warn || o.ko }]), node: o.next, infos: infos, score: st.score + o.p, maxs: st.maxs + mx, kos: o.ko ? st.kos.concat(["Gespräch: " + o.typ]) : st.kos });
    }
    var ord = useMemo(function () { return node ? shuf(node.opts, st.path.length * 5 + 3) : []; }, [st.node]);
    var pt = D.pat[p.sec.pat];
    return h(Fr, null,
      h("div", { className: "card" },
        h(SimHead, { icon: I.chat, eyebrow: "Gespräch · Entscheidungsbaum", title: B.titel, c: pt.farbe }),
        h(PatBanner, { pt: B.banner || { name: pt.name, sub: pt.alter + " J. · Zimmer " + pt.zimmer }, who: p.sec.pat, c: pt.farbe }),
        h("p", { style: { marginTop: 12 } }, B.intro),
        h("div", { className: "pxinfos" },
          h("div", { className: "eyebrow" }, "Erschlossene Informationen"),
          Object.keys(B.infos).map(function (x) { var on = st.infos.indexOf(x) >= 0; return h("span", { key: x, className: cx("chip", on && "okc") }, on ? "✓ " + B.infos[x] : "? noch unbekannt"); }))),
      st.path.map(function (s, x) {
        return h("div", { key: x, className: "card pxturn" },
          h(Say, { bare: true, who: whoKey(s.who, p.sec.pat), name: s.who, mood: moodOf(s.say), text: s.say }),
          h(Say, { bare: true, me: true, who: "me", text: s.t }),
          s.re && h(Say, { bare: true, who: whoKey(s.who, p.sec.pat), name: s.who, mood: s.p === s.mx ? "smile" : s.warn ? "angry" : "worried", text: s.re }),
          h("div", { className: cx("pxfb", s.p === s.mx ? "good" : s.warn ? "bad" : "mid") }, h("b", null, "[" + s.typ + "] " + s.p + "/" + s.mx + " · "), s.fb));
      }),
      node && h("div", { className: "card pxturn", key: st.node },
        h(Say, { bare: true, who: whoKey(node.who, p.sec.pat), name: node.who, mood: moodOf(node.say), text: node.say }),
        h("p", { className: "pxqt", style: { marginTop: 14 } }, "Wie reagierst du?"),
        h("div", { className: "opts" }, ord.map(function (o, x) {
          return h("button", { type: "button", key: o.i, className: "opt", onClick: pd(function () { choose(o.x); }) },
            h("span", { className: "dot pxopt" }, "ABCD"[x]), h("span", { style: { minWidth: 0 } }, o.x.t));
        }))),
      !node && h("div", { className: "card" },
        h("p", { className: "muted" }, "Das Gespräch ist beendet. Du hast " + st.infos.length + " von " + Object.keys(B.infos).length + " wichtigen Informationen erschlossen."),
        h(Single, { q: B.diag, val: st.diag, seed: 21, onAnswer: function (i, ok) { set({ diag: i, diagOk: ok }); } }),
        fin && h("p", { className: "pxscore" }, "Gesprächsführung: " + r1(run.pts[k] || 0) + " / " + p.sec.max + " P.")));
  }

  /* --- Beratungsgespräch (eine richtige Antwort je Frage) --- */
  function SecBeratung(p) {
    var run = p.run, up = p.up, L = p.sec.live, k = p.sec.k;
    var st = run[k] || { i: 0, tries: {}, tried: [] };
    var set = mkSet(up, k, st);
    var qs = L.qs, i = st.i, done = i >= qs.length, cur = qs[Math.min(i, qs.length - 1)];
    var ord = useMemo(function () { return shuf(cur.opts, 53 + i * 7); }, [i]);
    var solved = st.solved === i;
    var pt = D.pat[p.sec.pat], who = L.person || { name: pt.name };
    useEffect(function () {
      if (done && !run.done[k]) { var s = 0; qs.forEach(function (_, j) { var t = st.tries[j] || 1; s += t === 1 ? 1 : t === 2 ? 0.4 : 0; }); p.finish(k, p.sec.max * s / qs.length); }
    }, [done]);
    function pick(j) {
      var tries = Object.assign({}, st.tries); tries[i] = (tries[i] || 0) + 1;
      if (cur.opts[j].ok) set({ tries: tries, solved: i, pickedOk: j });
      else set({ tries: tries, tried: (st.tried || []).concat([j]) });
    }
    return h(Fr, null,
      h("div", { className: "card" },
        h(SimHead, { icon: I.chat, eyebrow: "Beratungsgespräch · " + qs.length + " Fragen", title: L.titel, c: pt.farbe }),
        h(PatBanner, { pt: L.banner || { name: who.name, sub: who.rolle || "" }, who: p.sec.pat, c: pt.farbe }),
        h(Narr, { text: L.intro, who: p.sec.pat })),
      qs.slice(0, i).map(function (q, j) {
        var ok = q.opts.filter(function (o) { return o.ok; })[0];
        return h("div", { key: j, className: "card pxturn" },
          h(Say, { bare: true, who: p.sec.pat, name: who.name, mood: moodOf(q.q), text: q.q }),
          h(Say, { bare: true, me: true, who: "me", text: ok.t }),
          q.re && h(Say, { bare: true, who: p.sec.pat, name: who.name, mood: "smile", text: q.re }),
          h("div", { className: cx("pxfb", (st.tries[j] || 1) === 1 ? "good" : "mid") }, h("b", null, (st.tries[j] || 1) === 1 ? "Im ersten Versuch richtig · " : "Nach Korrektur · "), ok.fb));
      }),
      !done && h("div", { className: "card pxturn", key: "q" + i },
        h("div", { className: "tag" }, h("span", null, "Frage " + (i + 1) + " von " + qs.length), h("span", null, who.name)),
        h(Say, { bare: true, who: p.sec.pat, name: who.name, mood: moodOf(cur.q), text: cur.q, key: "q" + i }),
        h("p", { className: "pxqt", style: { marginTop: 14 } }, "Was antwortest du?"),
        h("div", { className: "opts" }, ord.map(function (o, x) {
          var j = o.i, wrong = (st.tried || []).indexOf(j) >= 0 && st.solved !== i, right = solved && o.x.ok;
          return h("button", { type: "button", key: j, className: cx("opt", wrong && "bad", right && "ok"), disabled: wrong || solved, onClick: pd(function () { pick(j); }) },
            h("span", { className: "dot pxopt" }, "ABCD"[x]),
            h("span", { style: { minWidth: 0 } }, o.x.t, (wrong || right) && h("div", { className: "fb" }, o.x.fb)));
        })),
        !solved && (st.tried || []).length > 0 && h("div", { className: "pxloop" }, h(Ico, { d: I.alert }), h("span", null, "Diese Antwort wäre fachlich falsch oder missverständlich. Versuche es noch einmal.")),
        solved && h("div", { className: "row", style: { marginTop: 14 } },
          h("button", { type: "button", className: "btn", onClick: pd(function () { set({ i: i + 1, tried: [], solved: null }); }) }, i + 1 < qs.length ? "Nächste Frage" : "Gespräch abschließen", h(Ico, { d: I.right })))),
      done && h(DoneCard, { k: k, run: run, max: p.sec.max, merke: L.merke }));
  }

  /* ================================================================
     STÖRFALL, DOKU, ÜBERGABE, REFLEXION, AUSWERTUNG
     ================================================================ */
  function SecSt(p) {
    var run = p.run, up = p.up;
    var st = run.st || { sort: { order: shuf(D.st.order, 77).map(function (o) { return o.x.id; }), done: false }, mc: null };
    useEffect(function () { if (!run.st) up({ st: st }); }, []);
    var set = mkSet(up, "st", st);
    var fin = st.sort.done && st.mc && st.mc.done;
    useEffect(function () { if (fin && !run.done.st) p.finish("st", 6 * st.sort.frac + 4 * st.mc.frac); }, [fin]);
    return h(Fr, null,
      h("div", { className: "card pxalarm" },
        h("div", { className: "pxalarmh" }, h(Ico, { d: I.alert }), h("b", null, "[STÖRFALL] " + (D.st.titel || "Unvorhergesehenes Ereignis"))),
        h(Narr, { text: D.st.situation, who: D.st.who || null, mood: "worried" })),
      h("div", { className: "card" },
        h("h3", null, "Ordne deine Prioritäten neu"),
        h("p", { className: "muted" }, "In welcher Reihenfolge handelst du jetzt?"),
        h(Sorter, { items: D.st.order, val: st.sort, set: function (v) { set({ sort: v }); }, onDone: function () {} })),
      st.sort.done && h("div", { className: "card" },
        h(Multi, { q: D.st.mc, val: st.mc, seed: 31, set: function (v) { set({ mc: v }); } })),
      fin && h(DoneCard, { k: "st", run: run, max: 10, merke: D.st.merke || "Akute Gefährdung vor Organisation. Hilfe holen, informieren, sichern, dann dokumentieren." }));
  }

  function SecDoku(p) {
    var run = p.run, up = p.up, Dk = D.doku;
    var st = run.doku || { text: "", eh: null, marks: [], fdone: false };
    var set = mkSet(up, "doku", st);
    var fin = st.eh && st.eh.done && st.fdone;
    useEffect(function () {
      if (fin && !run.done.doku) {
        var good = 0; Dk.fehler.items.forEach(function (it, i) { var m = st.marks.indexOf(i) >= 0; if (m === it.bad) good++; });
        p.finish("doku", (st.ehp || 0) + 4 * good / Dk.fehler.items.length);
      }
    }, [fin]);
    return h(Fr, null,
      h("div", { className: "card" },
        h("h3", null, "[PFLEGEBERICHT] Rechtssicher dokumentieren"),
        h("p", null, Dk.auftrag),
        h(TextArea, { label: "Dein Pflegebericht", rows: 8, value: st.text, locked: st.eh && st.eh.open, onChange: function (v) { set({ text: v }); }, ph: "Uhrzeit, Beobachtung, Maßnahme, Wirkung …" }),
        h(SelfCheck, { items: Dk.chk, text: st.text, val: st.eh, max: 4, minLen: 120, title: "[ERWARTUNGSHORIZONT] Musterbericht", muster: Dk.muster, set: function (v) { set({ eh: v }); }, onScore: function (s) { set({ ehp: s }); } })),
      st.eh && st.eh.done && h("div", { className: "card" },
        h("p", { className: "pxqt" }, Dk.fehler.text),
        h("div", { className: "opts" }, Dk.fehler.items.map(function (it, i) {
          var m = st.marks.indexOf(i) >= 0, cls = st.fdone ? (m === it.bad ? "ok" : "bad") : "";
          return h("button", { type: "button", key: i, className: cx("opt multi", cls), "aria-pressed": m, disabled: st.fdone, onClick: pd(function () { set({ marks: m ? st.marks.filter(function (x) { return x !== i; }) : st.marks.concat([i]) }); }) },
            h("span", { className: "dot" }, h(Ico, { d: I.check, w: 3 })),
            h("span", { style: { minWidth: 0 } }, h("span", { className: "pxmono" }, it.t), st.fdone && h("div", { className: "fb" }, h("b", null, it.bad ? "Nicht rechtssicher. " : "Rechtssicher. "), it.fb)));
        })),
        !st.fdone && h("div", { className: "row", style: { marginTop: 12 } }, h("button", { type: "button", className: "btn", onClick: pd(function () { set({ fdone: true }); }) }, "Markierung prüfen")),
        fin && h("p", { className: "pxscore" }, "Dokumentation: " + r1(run.pts.doku || 0) + " / 8 P.")));
  }

  function SecUeb(p) {
    var run = p.run, up = p.up, U = D.ueb;
    var st = run.ueb || { text: "", eh: null };
    var set = mkSet(up, "ueb", st);
    return h("div", { className: "card" },
      h("h3", null, "[ÜBERGABE] An den Spätdienst"),
      h("p", null, U.auftrag),
      h(TextArea, { label: "Deine Übergabe", rows: 9, value: st.text, locked: st.eh && st.eh.open, onChange: function (v) { set({ text: v }); } }),
      h(SelfCheck, { items: U.chk, text: st.text, val: st.eh, max: 3, minLen: 120, title: "[MUSTER-ÜBERGABE]", muster: h("div", { style: { whiteSpace: "pre-wrap" } }, U.muster), set: function (v) { set({ eh: v }); }, onScore: function (s) { p.finish("ueb", s); } }));
  }

  function SecRefl(p) {
    var run = p.run, up = p.up;
    var st = run.refl || { a: {}, open: {}, rate: {} };
    var set = mkSet(up, "refl", st);
    var all = D.refl.every(function (_, i) { return st.rate[i] != null; });
    useEffect(function () { if (all && !run.done.refl) p.finish("refl", D.refl.reduce(function (a, _, i) { return a + st.rate[i]; }, 0)); }, [all]);
    var RATES = [[1, "vollständig"], [0.5, "teilweise"], [0, "kaum"]];
    return h(Fr, null,
      h("div", { className: "card" },
        h("h3", null, "[REFLEXIONSGESPRÄCH] " + (D.pruefer || "Die Fachprüfenden") + " und " + D.anleitung + " fragen nach"),
        h("div", { className: "pxduo" }, h(AvImg, { who: "pruefer" }), h(AvImg, { who: "anleitung" })),
        h("p", { className: "muted" }, "Antworte zuerst frei, wie du es mündlich tun würdest. Dann vergleichst du mit der Musterantwort und schätzt dich ein.")),
      D.refl.map(function (r, i) {
        var o = st.open[i];
        return h("div", { className: "card", key: i },
          h("div", { className: "eyebrow" }, "Frage " + (i + 1)),
          h(Say, { bare: true, who: i % 2 ? "anleitung" : "pruefer", text: r.q, mood: "neutral" }),
          h(TextArea, { value: st.a[i], locked: o, small: true, onChange: function (v) { var a = Object.assign({}, st.a); a[i] = v; set({ a: a }); } }),
          !o ? h("div", { className: "row", style: { marginTop: 12 } }, h("button", { type: "button", className: "btn ghost", disabled: (st.a[i] || "").trim().length < 40, onClick: pd(function () { var x = Object.assign({}, st.open); x[i] = true; set({ open: x }); }) }, h(Ico, { d: I.eye }), "Musterantwort zeigen"))
            : h(Fr, null,
              h("div", { className: "pxmuster" }, r.muster),
              h("div", { className: "row", style: { marginTop: 10 } }, h("span", { className: "muted", style: { fontSize: 14 } }, "Meine Antwort deckt das ab:"),
                RATES.map(function (x) { return h("button", { key: x[1], type: "button", className: cx("btn sm", st.rate[i] === x[0] ? "" : "ghost"), "data-rate": x[1], onClick: pd(function () { var q = Object.assign({}, st.rate); q[i] = x[0]; set({ rate: q }); }) }, x[1]); }))));
      }));
  }

  function sumRun(run, SECS) { var max = 0, sum = 0; SECS.forEach(function (s) { if (s.max) { max += s.max; sum += run.pts[s.k] || 0; } }); return { max: max, sum: sum, pct: Math.round(100 * sum / max) }; }

  function SecEnd(p) {
    var run = p.run, SECS = p.SECS, R = sumRun(run, SECS), ko = run.ko || [], n = noteFor(R.pct, ko.length > 0);
    return h(Fr, null,
      h("div", { className: "card pxresult", style: { "--c": D.farbe } },
        h("div", { className: "pxgrade" }, h("b", null, n[1]), h("span", null, n[2])),
        h("div", null,
          h("div", { className: "eyebrow" }, "Auswertung · " + D.station),
          h("h2", { style: { margin: "4px 0 6px" } }, r1(R.sum) + " von " + R.max + " Punkten · " + R.pct + " %"),
          h("p", { className: "muted", style: { margin: 0 } }, ko.length ? "K.o.-Kriterium ausgelöst: Die Note ist höchstens 5. In der echten Prüfung führt eine Patientengefährdung in der Regel zum Abbruch." : "Keine K.o.-Kriterien ausgelöst."))),
      ko.length > 0 && h("div", { className: "card" }, h("h3", null, "[K.O.-KRITERIEN] ausgelöst"), h("ul", null, ko.map(function (x, i) { return h("li", { key: i }, x); }))),
      h("div", { className: "card" },
        h("h3", null, "Punkte je Abschnitt"),
        h("table", { className: "pxtable" },
          h("thead", null, h("tr", null, h("th", null, "Abschnitt"), h("th", null, "Punkte"), h("th", null, ""))),
          h("tbody", null, SECS.filter(function (s) { return s.max; }).map(function (s) {
            var v = run.pts[s.k] || 0, f = v / s.max;
            return h("tr", { key: s.k }, h("td", null, s.t), h("td", null, r1(v) + " / " + s.max), h("td", null, h("span", { className: "pxbar" }, h("i", { style: { width: Math.round(100 * f) + "%", background: f >= 0.8 ? "var(--ok)" : f >= 0.5 ? "var(--warn)" : "var(--bad)" } }))));
          })))),
      h("div", { className: "card" },
        h("h3", null, "Kompetenzbereiche nach Anlage 2 PflAPrV"),
        h("div", { className: "pxkb" }, KBT.map(function (kb) {
          var m = 0, s = 0; SECS.forEach(function (x) { if (x.max && kbOf(x) === kb[0]) { m += x.max; s += run.pts[x.k] || 0; } });
          var f = m ? s / m : 0;
          return h("div", { key: kb[0], className: "pxkbi" }, h("b", null, kb[0]), h("span", null, kb[1]), h("span", { className: "pxbar" }, h("i", { style: { width: Math.round(100 * f) + "%" } })), h("small", { className: "muted" }, Math.round(100 * f) + " %"));
        }))),
      h("div", { className: "card" },
        h("h3", null, "Notenschlüssel"),
        h("table", { className: "pxtable" }, h("tbody", null, NOTEN.map(function (x, i) {
          var hi = i === 0 ? 100 : NOTEN[i - 1][0] - 1;
          return h("tr", { key: x[1], className: x[1] === n[1] ? "on" : "" }, h("td", null, x[0] + "–" + hi + " %"), h("td", null, x[1] + " · " + x[2]));
        }))),
        h("p", { className: "muted", style: { fontSize: 13.5, marginTop: 10 } }, "Orientierungsschlüssel für die Übung. Deine Pflegeschule kann andere Grenzen festlegen. Die Freitextteile beruhen auf deiner Selbsteinschätzung.")),
      h("div", { className: "row" },
        h("button", { type: "button", className: "btn", onClick: pd(p.save) }, h(Ico, { d: I.check }), "Ergebnis speichern und beenden")));
  }

  /* ---------- Rahmen ---------- */
  function useTick(on) {
    var s = useState(0); useEffect(function () { if (!on) return; var t = setInterval(function () { s[1](function (x) { return x + 1; }); }, 20000); return function () { clearInterval(t); }; }, [on]);
  }
  function mins(ms) { var m = Math.floor(ms / 60000); return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0"); }

  function Runner(p) {
    var run = p.run, up = p.up, SECS = p.SECS, sec = SECS[Math.min(run.sec, SECS.length - 1)], k = sec.k;
    useTick(true);
    var finish = function (key, pts, ko) {
      p.setRun(function (r) {
        var d = Object.assign({}, r.done); d[key] = true;
        var q = Object.assign({}, r.pts); q[key] = Math.round(pts * 10) / 10;
        return Object.assign({}, r, { done: d, pts: q, ko: ko ? (r.ko || []).concat(ko.filter(function (x) { return (r.ko || []).indexOf(x) < 0; })) : r.ko });
      });
    };
    var canNext = k === "brief" || run.done[k];
    var go = function (i) {
      p.setRun(function (r) { var x = Object.assign({}, r, { sec: i }); if (SECS[i].ph >= 2 && !r.day2) x.day2 = Date.now(); return x; });
      top();
    };
    var props = { run: run, up: up, finish: finish, sec: sec, key: k };
    var C = { brief: SecBrief, akten: SecAkten, plan: SecPlan, sbar: SecSbar, prio: SecPrio, st: SecSt, doku: SecDoku, ueb: SecUeb, refl: SecRefl };
    var T = { ekg: SecEkg, hotspot: SecHot, vitmed: SecVitMed, steps: SecSteps, tree: SecTree, beratung: SecBeratung };
    var el = k === "end" ? h(SecEnd, { run: run, SECS: SECS, save: p.save }) : h(C[k] || T[sec.typ], props);
    var el2 = run.day2 ? Date.now() - run.day2 : 0, over = el2 > 240 * 60000;
    var pt = sec.pat && D.pat[sec.pat];
    return h("div", { className: "pex", style: { "--cc": D.farbe } },
      h("div", { className: "pxbar2" },
        h("div", { className: "pxphase" }, PHASES.map(function (t, i) { return h("span", { key: i, className: cx(sec.ph === i + 1 && "on", sec.ph > i + 1 && "past") }, h("b", null, "Phase " + (i + 1)), h("span", null, t)); })),
        h("div", { className: "seg" }, SECS.map(function (s, i) { return h("i", { key: s.k, className: i < run.sec ? "on" : i === run.sec ? "cur" : "" }); })),
        h("div", { className: "pxmeta" },
          h("span", { className: "chip blue" }, h(Ico, { d: I.clock, w: 2.2 }), sec.clock),
          run.day2 && h("span", { className: cx("chip", over && "warnc") }, "Prüfungszeit " + mins(el2) + " h / 4:00 h"),
          h("span", { className: "chip" }, "Schritt " + (run.sec + 1) + " / " + SECS.length),
          h("span", { className: "chip pxstchip" }, D.station))),
      h("div", { className: "pxtitlerow" },
        pt && h("span", { className: "pxbadge", style: { "--c": pt.farbe } }, sec.pat),
        h("h2", { className: "pxtitle" }, sec.t),
        sec.typ && h("span", { className: "pxtyp" }, sec.typ === "vitmed" && !sec.live.vit ? "Medikamente" : TYPNAME[sec.typ])),
      h("div", { className: "stack", key: k }, el),
      k !== "end" && h("div", { className: "pxnav" },
        h("button", { type: "button", className: "btn ghost", disabled: run.sec === 0, onClick: pd(function () { go(run.sec - 1); }) }, h(Ico, { d: I.left }), "Zurück"),
        h("button", { type: "button", className: "btn", disabled: !canNext, onClick: pd(function () { go(run.sec + 1); }) }, k === "brief" ? "Akten öffnen" : "Weiter", h(Ico, { d: I.right }))),
      k !== "end" && !canNext && h("p", { className: "muted", style: { fontSize: 13.5, textAlign: "right", marginTop: 6 } }, "Schließe den Abschnitt ab, um weiterzugehen."),
      h("div", { style: { marginTop: 22, textAlign: "center" } },
        h("button", { type: "button", className: "skip", onClick: pd(p.quit) }, "Übung unterbrechen")));
  }

  function CaseLanding(p) {
    var hist = (p.hist || []).filter(function (x) { return (x.cs || "geriatrie") === D.id; }), cur = p.cur, other = p.other;
    var SECS = secsOf(D);
    return h(Fr, null,
      h("button", { type: "button", className: "skip back", onClick: pd(p.back) }, h(Ico, { d: I.left }), "Alle Prüfungsfälle"),
      h("div", { className: "card pxland", style: { "--c": D.farbe } },
        h("div", { className: "pxlandh" },
          h("span", { className: "pxlandic" }, h(Ico, { d: D.icon || I.praxexamen, w: 1.8 })),
          h("div", null, h("div", { className: "eyebrow" }, D.haus + " · " + D.station), h("h2", { style: { margin: "4px 0 0" } }, D.titel))),
        h("p", { className: "muted", style: { marginTop: 12 } }, D.kurz),
        h("ol", { className: "pxsteps" },
          h("li", null, h("b", null, "Vorbereitungstag"), h("span", null, "Briefing, " + order().length + " Akten mit ungeordneter Anamnese, Pflegeplanung")),
          h("li", null, h("b", null, "Schichtbeginn"), h("span", null, "Übergabe vom Nachtdienst, SBAR-Fallvorstellung, Prioritätenplan")),
          h("li", null, h("b", null, "Live-Handlungen"), h("span", null, D.live.map(function (l) { return l.kurzname || l.t; }).join(", ") + ", Störfall, Pflegebericht")),
          h("li", null, h("b", null, "Schichtende"), h("span", null, "Übergabe an den Spätdienst, Reflexionsgespräch, Note"))),
        h(PatGrid, null),
        other && h("div", { className: "notice", style: { marginTop: 14 } }, "Du hast noch einen anderen Prüfungsfall offen (" + other + "). Wenn du hier neu beginnst, wird er verworfen."),
        h("div", { className: "row", style: { marginTop: 18 } },
          cur ? h(Fr, null,
            h("button", { type: "button", className: "btn", onClick: pd(p.resume) }, "Fortsetzen bei: " + (SECS[cur.sec] || SECS[0]).t, h(Ico, { d: I.right })),
            h("button", { type: "button", className: "btn ghost", onClick: pd(p.start) }, h(Ico, { d: I.restart }), "Neu beginnen"))
            : h("button", { type: "button", className: "btn", onClick: pd(p.start) }, "Simulation starten", h(Ico, { d: I.right })),
          h("span", { className: "muted", style: { fontSize: 13.5 } }, "Dauer etwa 90–150 Minuten, jederzeit unterbrechbar."))),
      hist.length > 0 && h("div", { className: "card" },
        h("h3", null, "Deine Durchläufe"),
        h("ul", { className: "exlist" }, hist.map(function (x, i) {
          return h("li", { key: i }, h("span", null, new Date(x.at).toLocaleDateString("de-DE")), h("b", null, "Note " + x.note), h("span", null, x.pct + " %"), x.ko ? h("span", { className: "pill crit" }, "K.o.") : null);
        }))));
  }

  function CasePicker(p) {
    var hist = p.hist || [], cur = p.cur;
    return h(Fr, null,
      h("div", { className: "card pxpickhead" },
        h("h3", null, "Wähle deinen Prüfungsfall"),
        h("p", { className: "muted", style: { margin: "6px 0 0" } }, "Jeder Fall spielt auf einer Station mit zwei oder drei Menschen, die dort typischerweise liegen. Immer dabei: eine Pflegehandlung als Simulation, ein Bildbefund zum Anklicken, Vitalzeichen und Medikamente zum Prüfen und bei drei Personen ein Beratungsgespräch.")),
      h("div", { className: "pxcases" }, CASES.map(function (c) {
        var last = hist.filter(function (x) { return (x.cs || "geriatrie") === c.id; })[0];
        var open = cur && (cur.cs || "geriatrie") === c.id;
        var pats = c.order || Object.keys(c.pat);
        return h("button", { type: "button", key: c.id, className: "pxcase", style: { "--c": c.farbe }, onClick: pd(function () { p.pick(c.id); }) },
          h("span", { className: "pxcasetop" }, h("span", { className: "pxcaseic" }, h(Ico, { d: c.icon || I.praxexamen, w: 1.8 })), h("span", { className: "cast pxcast" }, pats.map(function (k) { var pt = c.pat[k]; return h("span", { key: k, dangerouslySetInnerHTML: { __html: window.PXAV ? PXAV.svg(pt.av || autoAv(pt.kurz || pt.name, pt.alter, "pat"), "neutral") : "" } }); }))),
          h("span", { className: "pxcaset" }, h("small", null, c.station), h("b", null, c.titel)),
          h("span", { className: "pxcasep" }, pats.map(function (k) { var pt = c.pat[k]; return h("span", { key: k }, h("i", { style: { background: pt.farbe } }, k), pt.kurz + " · " + pt.modus); })),
          h("span", { className: "pxcasef" },
            open ? h("span", { className: "trmeta new" }, "Offen · weiter") : last ? h("span", { className: "trmeta" }, "Zuletzt Note " + last.note) : h("span", { className: "trmeta" }, pats.length + " Patienten"),
            h("span", { className: "trgo" }, h(Ico, { d: I.right, w: 2.2 }))));
      })));
  }

  function PraxExamen(p) {
    var S = p.S || {}, setS = p.setS;
    var px = S.pex || {};
    var st = useState(null), run = st[0], setRunRaw = st[1];
    var sl = useState(p.init || null), sel = sl[0], setSel = sl[1];
    var timer = useRef(null), latest = useRef(null);
    var LS = "fallpfad-pex-cur";
    var stored = px.cur || (function () { try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { return null; } })();
    if (stored && !stored.cs) stored = Object.assign({}, stored, { cs: "geriatrie", v: 2 });

    function persist(r) {
      latest.current = r;
      try { if (r) localStorage.setItem(LS, JSON.stringify(r)); else localStorage.removeItem(LS); } catch (e) {}
      clearTimeout(timer.current);
      timer.current = setTimeout(function () {
        if (setS) setS(function (d) { return Object.assign({}, d, { pex: Object.assign({}, d.pex || {}, { cur: latest.current }) }); });
      }, 900);
    }
    function flush() { clearTimeout(timer.current); if (setS && latest.current !== null) { var r = latest.current; setS(function (d) { return Object.assign({}, d, { pex: Object.assign({}, d.pex || {}, { cur: r }) }); }); } }
    useEffect(function () { return function () { flush(); }; }, []);
    function setRun(fn) { setRunRaw(function (r) { var n = typeof fn === "function" ? fn(r) : fn; persist(n); return n; }); }
    function up(patch) { setRun(function (r) { return Object.assign({}, r, typeof patch === "function" ? patch(r) : patch); }); }

    if (!CASES.length) return h("div", { className: "card" }, h("p", null, "Die Prüfungsfälle konnten nicht geladen werden."));
    if (run) {
      D = caseById(run.cs);
      var SECS = secsOf(D);
      return h(Runner, {
        run: run, setRun: setRun, up: up, SECS: SECS,
        quit: function () { flush(); setRunRaw(null); setSel(run.cs); top(); },
        save: function () {
          var R = sumRun(run, SECS), n = noteFor(R.pct, (run.ko || []).length > 0);
          var rec = { at: Date.now(), cs: run.cs, pct: R.pct, note: n[1], ko: (run.ko || []).length, pts: run.pts };
          clearTimeout(timer.current); latest.current = null;
          try { localStorage.removeItem(LS); } catch (e) {}
          if (setS) setS(function (d) { var o = d.pex || {}; return Object.assign({}, d, { pex: { cur: null, hist: [rec].concat(o.hist || []).slice(0, 30) } }); });
          setRunRaw(null); setSel(run.cs); top();
        }
      });
    }
    if (sel) {
      D = caseById(sel);
      var mine = stored && stored.cs === D.id ? stored : null;
      var other = stored && stored.cs !== D.id ? caseById(stored.cs).titel : null;
      return h(CaseLanding, {
        cur: mine, other: other, hist: px.hist,
        back: function () { setSel(null); top(); },
        resume: function () { setRunRaw(mine); latest.current = mine; top(); },
        start: function () { setRun(newRun(D.id)); top(); }
      });
    }
    return h(CasePicker, { hist: px.hist, cur: stored, pick: function (id) { setSel(id); top(); } });
  }


  /* ================================================================
     AUFGABEN: Training, Team-Krankenhaus, Live-Fall
     ================================================================ */
  function LiveSolo(p) {
    var a = p.a, C = p.data, key = a.id;
    var all = (p.S && p.S.liveSolo) || {}, st = all[key] || { i: 0, sel: [], checked: false, score: 0 };
    function set(patch) { if (!p.setS) return; p.setS(function (d) { var o = Object.assign({}, (d.liveSolo || {})); o[key] = Object.assign({}, (o[key] || st), patch); return Object.assign({}, d, { liveSolo: o }); }); }
    var steps = (C && C.steps) || [], done = st.i >= steps.length, step = steps[Math.min(st.i, steps.length - 1)] || {};
    var v = Object.assign({}, C.v || {}); steps.slice(0, Math.min(st.i, steps.length - 1) + 1).forEach(function (s) { if (s.v) Object.assign(v, s.v); });
    var VL = [["hf", "HF", "/min"], ["rrs", "RR", ""], ["af", "AF", "/min"], ["spo2", "SpO₂", "%"], ["temp", "Temp", "°C"], ["bz", "BZ", "mg/dl"], ["schmerz", "NRS", ""]];
    var opts = step.opts || [];
    function check() {
      var good = true; opts.forEach(function (o, j) { var on = st.sel.indexOf(j) >= 0; if (!!o[1] !== on) good = false; });
      set({ checked: true, score: st.score + (good ? 1 : 0), last: good });
    }
    return h("div", { className: "card pxlive" },
      h("div", { className: "eyebrow" }, "Live-Fall zum Selbstspielen"),
      h("h3", { style: { margin: "4px 0 8px" } }, C.t || a.title),
      C.p && h(PatBanner, { pt: { name: C.p.name + (C.p.alter ? ", " + C.p.alter : ""), sub: [C.p.station, C.p.diag].filter(Boolean).join(" · "), chips: C.p.allergie ? [["Allergie: " + C.p.allergie, /keine/i.test(C.p.allergie) ? "" : "red"]] : [] }, c: "#0062FF" }),
      !done ? h(Fr, null,
        h("div", { className: "pxlivev" }, VL.filter(function (x) { return v[x[0]] != null; }).map(function (x) { return h("span", { key: x[0] }, h("small", null, x[1]), h("b", null, x[0] === "rrs" ? v.rrs + "/" + v.rrd : String(v[x[0]]).replace(".", ",")), x[2]); })),
        h("div", { className: "tag", style: { marginTop: 12 } }, h("span", null, "Schritt " + (st.i + 1) + " von " + steps.length), h("span", null, step.t ? step.t + " Uhr" : "")),
        step.sit && h("p", null, step.sit),
        h("p", { className: "pxqt" }, step.q, step.multi ? " (Mehrfachauswahl)" : ""),
        h("div", { className: "opts" }, opts.map(function (o, j) {
          var on = st.sel.indexOf(j) >= 0, cls = st.checked ? (o[1] && on ? "ok" : !o[1] && on ? "bad" : o[1] ? "miss" : "") : "";
          return h("button", { type: "button", key: j, className: cx("opt", step.multi && "multi", cls), disabled: st.checked, "aria-pressed": on, onClick: pd(function () { set({ sel: step.multi ? (on ? st.sel.filter(function (x) { return x !== j; }) : st.sel.concat([j])) : [j] }); }) },
            h("span", { className: "dot" }, h(Ico, { d: I.check, w: 3 })), h("span", { style: { minWidth: 0 } }, o[0], st.checked && (on || o[1]) && o[2] && h("div", { className: "fb" }, o[2])));
        })),
        st.checked && step.exp && h("div", { className: "pxmuster", style: { marginTop: 12 } }, h("b", null, "Erklärung: "), step.exp),
        h("div", { className: "row", style: { marginTop: 12 } },
          !st.checked ? h("button", { type: "button", className: "btn", disabled: !st.sel.length, onClick: pd(check) }, "Prüfen")
            : h("button", { type: "button", className: "btn", onClick: pd(function () { set({ i: st.i + 1, sel: [], checked: false }); }) }, st.i + 1 < steps.length ? "Weiter" : "Fall abschließen", h(Ico, { d: I.right }))))
        : h("div", { className: "pxdone", style: { padding: 14, borderRadius: 14, marginTop: 10 } }, h("b", null, "Fall abgeschlossen: " + st.score + " von " + steps.length + " Entscheidungen richtig."), h("p", { className: "muted", style: { margin: "6px 0 0" } }, "Schreib unten kurz, was du mitnimmst, und gib die Aufgabe ab."),
          h("button", { type: "button", className: "skip", onClick: pd(function () { set({ i: 0, sel: [], checked: false, score: 0 }); }) }, "Noch einmal spielen")));
  }

  function AssignExtra(p) {
    var a = p.a, k = a.kind, id = String(a.module_id || "");
    if (k === "live") {
      var q = Array.isArray(a.questions) && a.questions[0] && a.questions[0].live;
      if (!q) return h("div", { className: "notice", style: { marginTop: 12 } }, "Der Live-Fall wird im Unterricht gemeinsam gespielt. Deine Lehrkraft startet ihn, du trittst mit dem Code bei.");
      return h("div", { style: { marginTop: 14 } }, h(LiveSolo, { a: a, data: q, S: p.S, setS: p.setS }));
    }
    var intent = null, title = "", sub = "", c = "#0062FF", ic = I.sims;
    if (k === "training") {
      if (id.indexOf("kommunikation:") === 0) {
        var kd = window.FP_KOMM_DATA, ksid = id.split(":")[1], ks = kd && kd.szenarien.filter(function (x) { return x.id === ksid; })[0], kk = ks && kd.kategorien.filter(function (x) { return x.id === ks.kat; })[0];
        intent = { tab: "kommunikation", komm: ksid }; title = "Kommunikation" + (kk ? ": " + kk.t : ""); sub = ks ? ks.titel + " · " + ks.person.name : ""; c = kk ? kk.c : "#0EA5E9"; ic = I.kommunikation || ic;
      }
      else if (id.indexOf("praxexamen:") === 0) { var cs = caseById(id.split(":")[1]); intent = { tab: "praxexamen", pex: cs && cs.id }; title = "Praktisches Examen Übung"; sub = cs ? cs.station + " · " + cs.titel : ""; c = cs ? cs.farbe : c; ic = I.praxexamen; }
      else { var t = TILES.filter(function (x) { return x.k === id; })[0]; intent = { tab: id }; title = t ? t.t : "Training"; sub = t ? t.d : ""; c = t ? t.c : c; ic = I[id] || ic; }
    } else if (k === "team") { intent = { tab: "team" }; title = "Team-Krankenhaus"; sub = "Öffne das Team-Krankenhaus, wählt dort gemeinsam den Fall aus der Aufgabe und erstellt einen Raum für eure Gruppe."; c = "#0891B2"; ic = I.team; }
    return h("div", { className: "pxassign", style: { "--c": c } },
      h("span", { className: "pxcaseic" }, h(Ico, { d: ic, w: 1.8 })),
      h("div", { style: { flex: 1, minWidth: 0 } }, h("div", { className: "eyebrow" }, k === "team" ? "Gruppenarbeit" : "Training"), h("b", null, title), sub && h("p", { className: "muted", style: { margin: "2px 0 0", fontSize: 14 } }, sub)),
      h("button", { type: "button", className: "btn", onClick: pd(function () { if (intent && intent.komm) window.FP_KOMM_OPEN = intent.komm; if (window.FP_openTraining) window.FP_openTraining(intent); }) }, k === "team" ? "Team-Krankenhaus öffnen" : "Training öffnen", h(Ico, { d: I.right })));
  }
  window.FP_AssignExtra = AssignExtra;

  /* Wochenfeedback als Pop-up (nur freitags, einmal pro Woche ausblendbar) */
  function PulsPop(p) {
    var key = "fp-puls-later-" + p.wk;
    var st = useState(function () { try { return localStorage.getItem(key) === "1"; } catch (e) { return false; } }), hid = st[0], setHid = st[1];
    var o = useState(false), open = o[0], setOpen = o[1];
    useEffect(function () { var t = setTimeout(function () { setOpen(true); }, 700); return function () { clearTimeout(t); }; }, []);
    if (hid || !open) return null;
    function close() { try { localStorage.setItem(key, "1"); } catch (e) {} setHid(true); }
    return h("div", { className: "pxpop", role: "dialog", "aria-modal": "true", "aria-label": "Unterrichtsfeedback" },
      h("div", { className: "pxpop-bg", onClick: close }),
      h("div", { className: "pxpop-box" },
        h("button", { type: "button", className: "iconbtn pxpop-x", "aria-label": p.done ? "Schließen" : "Später", onClick: pd(close) }, h(Ico, { d: I.x })),
        p.children,
        !p.done && h("button", { type: "button", className: "skip", style: { display: "block", margin: "8px auto 0" }, onClick: pd(close) }, "Später")));
  }
  window.FP_PulsPop = PulsPop;
  window.FP_TrainingHub = TrainingHub;
  window.FP_PraxExamen = PraxExamen;
})();
