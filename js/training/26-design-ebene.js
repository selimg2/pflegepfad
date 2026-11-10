/* Fallpfad Design-Ebene: färbt Navigation, Seitenkopf und Karten wie die Trainingskacheln.
   Arbeitet nur über Klassen und CSS-Variablen, ändert keine Inhalte. */
(function () {
  var C = {
    blue: "#0062FF", violet: "#7C3AED", teal: "#0D9488", green: "#059669", orange: "#EA580C", red: "#E11D48",
    pink: "#DB2777", indigo: "#4F46E5", cyan: "#0891B2", sky: "#0284C7", amber: "#D97706", purple: "#9333EA", slate: "#64748B"
  };
  var NAV = {
    "Home": C.blue, "Übersicht": C.blue, "Lernmodule": C.violet, "Module": C.violet, "Training": C.teal, "Praxis": C.green,
    "Aufgaben": C.orange, "Fortschritt": C.pink, "Patientenakte": C.slate, "Kurse & Schüler": C.cyan, "Ausbildungsnachweis": C.green,
    "Feedback": C.pink, "Prüfen": C.indigo, "Nachrichten": C.sky, "Stundenplan": C.amber, "Live": C.red, "Team-Krankenhaus": C.purple,
    "Einstellungen": C.slate, "Schulen": C.indigo, "Mehr": C.slate
  };
  var KW = [
    [/live/i, C.red], [/team/i, C.purple], [/training|praktisches examen|simulation/i, C.teal], [/eigene|reflexion/i, C.orange],
    [/prüf|examen|osce/i, C.indigo], [/feedback|puls/i, C.pink], [/nachweis|einsatz|praxis/i, C.green], [/nachricht/i, C.sky],
    [/stundenplan|unterricht/i, C.amber], [/modul/i, C.blue]
  ];
  var YEAR = { 1: C.blue, 2: C.violet, 3: C.teal };
  var ROT = [C.blue, C.violet, C.teal, C.orange, C.pink, C.indigo, C.green, C.amber];
  function kw(t, def) {
    for (var i = 0; i < KW.length; i++) if (KW[i][0].test(t)) return KW[i][1];
    return def;
  }
  function tile(el, c, extra) {
    if (!el || (el.dataset.fx === c && el.classList.contains("fx-t") && el.style.getPropertyValue("--c"))) return;
    el.dataset.fx = c;
    el.style.setProperty("--c", c);
    el.classList.add("fx-t");
    if (extra) el.classList.add(extra);
  }
  function txt(el, sel) {
    var x = sel ? el.querySelector(sel) : el;
    return x ? x.textContent || "" : "";
  }
  var RULES = [];
  window.FX = { C: C, NAV: NAV, kw: kw, tile: tile, txt: txt, YEAR: YEAR, ROT: ROT, rule: function (sel, fn) { RULES.push([sel, fn]); } };
  function run() {
    var act = null;
    document.querySelectorAll(".tab").forEach(function (t) {
      var name = (t.textContent || "").replace(/\d+$/, "").trim();
      var c = NAV[name];
      if (c && (t.dataset.fxc !== c || !t.classList.contains("fx-nav"))) { t.dataset.fxc = c; t.style.setProperty("--c", c); t.classList.add("fx-nav"); }
      if (c && (t.getAttribute("aria-current") === "page" || t.classList.contains("on") || t.getAttribute("aria-selected") === "true")) act = c;
    });
    if (act && document.documentElement.style.getPropertyValue("--pc") !== act) document.documentElement.style.setProperty("--pc", act);
    RULES.forEach(function (r) {
      document.querySelectorAll(r[0]).forEach(function (el, i) {
        try { var c = r[1](el, i); if (c) tile(el, c); } catch (e) {}
      });
    });
  }
  var q = false;
  function sched() {
    if (q) return;
    q = true;
    requestAnimationFrame(function () { q = false; run(); });
  }
  function start() {
    run();
    new MutationObserver(sched).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-current", "class"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

/* Schüler-App: Farbregeln für Karten */
(function () {
  var X = window.FX, C = X.C;
  function yearOf(t) { var m = /JAHR\s*(\d)|^J(\d)/i.exec((t || "").trim()); return m ? Number(m[1] || m[2]) : 0; }
  X.rule("button.mod", function (el) { return X.YEAR[yearOf(X.txt(el, ".eyebrow") || X.txt(el))] || C.blue; });
  X.rule(".card.resume", function () { return C.blue; });
  X.rule(".card.ateaser", function () { return C.orange; });
  X.rule(".card.bgnote", function () { return C.violet; });
  X.rule(".ttcard", function () { return C.amber; });
  X.rule(".card.today", function () { return C.green; });
  X.rule(".nwkpis > *", function (el, i) { return [C.blue, C.violet, C.amber, C.pink][i % 4]; });
  X.rule(".nwtop", function () { return C.green; });
  X.rule(".nwcards > *", function (el, i) { return [C.green, C.teal, C.cyan, C.blue][i % 4]; });
  X.rule(".card.nwintro", function () { return C.green; });
  X.rule(".card.nwzul", function () { return C.indigo; });
  X.rule("details.card.fr", function () { return C.amber; });
  X.rule(".stats > .stat", function (el, i) { return [C.blue, C.violet, C.teal, C.orange][i % 4]; });
  X.rule(".mp", function (el) { return X.YEAR[yearOf(X.txt(el))] || null; });
  X.rule(".aitem", function (el) { return X.kw(X.txt(el), C.blue); });
  X.rule(".card.account", function () { return C.slate; });
})();
