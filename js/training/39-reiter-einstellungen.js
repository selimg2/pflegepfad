/* Fallpfad Schüler-App: Reiter "Einstellungen".
   Nutzt die vorhandenen Bausteine der Fortschrittsseite (Konto, Darstellung, Kurs, Bezugslehrkraft, Zurücksetzen)
   und ergänzt Farbe, Meine Sprache, Tutorial, Kontakt und Rechtliches. Reihenfolge wie in iOS-Einstellungen. */
(function () {
  var R = window.React;
  if (!R) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect;

  /* Kontakt und Rechtstexte, die der Admin im Lehrer-Portal pflegt (Tabelle fp_einstellungen) */
  var site = null, waiting = [];
  function loadSite(cb) {
    if (site) return cb(site);
    waiting.push(cb);
    if (waiting.length > 1) return;
    var done = function (v) { site = v || {}; window.FP_SITE = site; var w = waiting; waiting = []; w.forEach(function (f) { f(site); }); };
    var local = {}; try { local = JSON.parse(localStorage.getItem("fp-site") || "{}") || {}; } catch (e) {}
    var c = window.FALLPFAD_CONFIG || {};
    if (!c.supabaseUrl || !c.supabaseAnonKey || window.FP_DEMO_ACC) return done(local);
    fetch(c.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/fp_einstellungen?select=key,value", { headers: { apikey: c.supabaseAnonKey, Authorization: "Bearer " + c.supabaseAnonKey } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) { var o = Object.assign({}, local); (rows || []).forEach(function (x) { o[x.key] = x.value; }); done(o); }, function () { done(local); });
  }
  window.FP_SITE_LOAD = loadSite;

  function Ico(p) { return h("svg", { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: p.d } }); }
  var D = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    pin: '<path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>'
  };
  function Row(p) {
    var inner = [h("span", { key: "i", className: "fps-ic", style: { "--ic": p.c || "var(--accent)" } }, h(Ico, { d: D[p.ic] })),
      h("span", { key: "t", className: "fps-t" }, h("b", null, p.t), p.sub ? h("small", null, p.sub) : null),
      p.val ? h("em", { key: "v", className: "fps-v" }, p.val) : null,
      p.chev !== false ? h("span", { key: "c", className: "fps-ch" }, h(Ico, { d: D.chev })) : null];
    if (p.href) return h("a", { className: "fps-row" + (p.bad ? " bad" : ""), href: p.href, target: p.ext ? "_blank" : null, rel: p.ext ? "noopener" : null }, inner);
    return h("button", { type: "button", className: "fps-row" + (p.bad ? " bad" : ""), onClick: p.onClick }, inner);
  }
  function useTick(ev) { var s = uS(0); uE(function () { function f() { s[1](function (x) { return x + 1; }); } window.addEventListener(ev, f); return function () { window.removeEventListener(ev, f); }; }, []); }

  function order() {
    var w = document.querySelector(".fp-only-settings > .wrap");
    if (!w) return;
    Array.prototype.forEach.call(w.children, function (el) {
      var o = 5, t = el.textContent || "";
      if (el.classList.contains("hello")) o = -1;
      else if (el.classList.contains("fp-setmark")) o = -1;
      else if (el.classList.contains("account")) o = 1;
      else if (el.querySelector && el.querySelector(".seg3")) o = 3;
      else if (el.id === "kurs") o = 4;
      else if (/zurücksetzen/i.test(t) || el.querySelector(".resetbox")) o = 9;
      el.style.order = o;
    });
  }

  function Top() {
    useTick("fp-lang");
    var T = (window.FP_THEMES && window.FP_THEMES.list) || [], cs = uS(window.FP_THEMES ? window.FP_THEMES.current() : "blau"), cur = cs[0];
    uE(function () { order(); var t = setTimeout(order, 300); var mo = new MutationObserver(order); var w = document.querySelector(".fp-only-settings"); if (w) mo.observe(w, { childList: true, subtree: false }); return function () { clearTimeout(t); mo.disconnect(); }; }, []);
    return h(R.Fragment, null,
      h("div", { className: "hello fps-head", style: { order: 0 } }, h("h1", null, "Einstellungen"), h("p", null, "Profil, Darstellung, Kurs und Datenschutz.")),
      h("section", { className: "fps-card", style: { order: 2 } },
        h("h3", { className: "fps-h" }, "Farbe und Sprache"),
        h("div", { className: "fps-sws", role: "radiogroup", "aria-label": "Farbprofil" }, T.map(function (t) {
          return h("button", { key: t.id, type: "button", role: "radio", "aria-checked": cur === t.id, className: "fps-sw" + (cur === t.id ? " on" : ""), style: { "--a": t.dot }, onClick: function () { window.FP_THEMES.apply(t.id); cs[1](t.id); } }, h("i", null), h("span", null, t.n));
        })),
        window.FP_LS ? h(Row, { ic: "globe", c: "#0A84FF", t: "Meine Sprache", sub: "Übersetzung, einfaches Deutsch, Vorlesen", val: window.FP_LS.label(), onClick: function () { window.FP_LS.open(); } }) : null));
  }
  function Bottom() {
    var ss = uS(window.FP_SITE || null), s = ss[0];
    uE(function () { loadSite(function (v) { ss[1](Object.assign({}, v)); }); }, []);
    var k = (s && s.kontakt) || {}, c = window.FALLPFAD_CONFIG || {};
    var links = [["Datenschutz", c.datenschutzUrl || "datenschutz.html", "shield"], ["Nutzungsbedingungen", c.nutzungUrl || "nutzungsbedingungen.html", "doc"], ["Impressum", c.impressumUrl || "impressum.html", "info"]];
    return h(R.Fragment, null,
      h("section", { className: "fps-card", style: { order: 6 } },
        h("h3", { className: "fps-h" }, "Hilfe und Kontakt"),
        h(Row, { ic: "play", c: "#34C759", t: "Tutorial wiederholen", sub: "Die Einführung in zwei Minuten", onClick: function () { window.scrollTo(0, 0); if (window.FP_TOUR) window.FP_TOUR.start(); } }),
        k.email ? h(Row, { ic: "mail", c: "#0A84FF", t: k.name || "E-Mail an Fallpfad", sub: k.email, href: "mailto:" + k.email }) : h(Row, { ic: "mail", c: "#8E8E93", t: "Kontakt", sub: "Bei Fragen zur App hilft dir deine Lehrkraft.", chev: false, onClick: function () {} }),
        k.tel ? h(Row, { ic: "phone", c: "#34C759", t: "Telefon", sub: k.tel, href: "tel:" + String(k.tel).replace(/[^+\d]/g, "") }) : null,
        k.adresse ? h(Row, { ic: "pin", c: "#FF9500", t: "Anschrift", sub: k.adresse, chev: false, onClick: function () {} }) : null),
      h("section", { className: "fps-card", style: { order: 7 } },
        h("h3", { className: "fps-h" }, "Rechtliches"),
        links.map(function (l) { return h(Row, { key: l[0], ic: l[2], c: "#8E8E93", t: l[0], href: l[1] }); }),
        h(Row, { ic: "doc", c: "#0A84FF", t: "Meine Daten herunterladen", sub: "Alles, was zu deinem Konto gespeichert ist, als Datei", chev: false, onClick: function () { if (window.FP_AUSKUNFT) window.FP_AUSKUNFT.herunterladen(); } })),
      window.FP_KONTO ? h("section", { className: "fps-card", style: { order: 10 } }, h(Row, { ic: "trash", c: "#FF3B30", t: "Konto löschen", sub: "Konto und alle Daten endgültig entfernen", bad: true, onClick: function () { window.FP_KONTO.open(); } })) : null);
  }
  /* Kurze Beschriftungen in der unteren Leiste auf dem Handy */
  var SHORT = { "Lernmodule": "Module", "Einstellungen": "Optionen", "Fortschritt": "Fortschritt" };
  function shortTabs() {
    document.querySelectorAll(".tabbar .tab").forEach(function (t) {
      var sp = t.querySelector("span:not(.tbadge):not([data-short])") || null;
      if (!sp) return;
      var txt = (sp.textContent || "").trim();
      if (SHORT[txt] && SHORT[txt] !== txt) sp.setAttribute("data-short", SHORT[txt]);
    });
  }
  (function () { var q = 0; function go() { if (q) return; q = 1; requestAnimationFrame(function () { q = 0; shortTabs(); }); } if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { new MutationObserver(go).observe(document.body, { childList: true, subtree: true }); go(); }); else { new MutationObserver(go).observe(document.body, { childList: true, subtree: true }); go(); } })();
  window.FP_SETTINGS = function (p) { return p.part === "bottom" ? h(Bottom) : h(Top); };
})();
