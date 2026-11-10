/* Fallpfad "Meine Sprache": ganze Seiten übersetzen.
   - Ist unter Meine Sprache eine Sprache gewählt, erscheint oben ein Knopf mit Weltkugel: Er übersetzt alles, was gerade
     zu sehen ist (Navigation, Texte, Lernmodule, Trainings), und alles, was danach erscheint. Noch einmal tippen zeigt das Original.
   - Einstellung „Ganze App übersetzen“ (Meine Sprache, Einstellungen): Die Übersetzung ist dann immer eingeschaltet.
   - Übersetzt wird absatzweise über die vorhandene Edge Function "uebersetzen" (mit Cache auf dem Gerät und auf dem Server).
     Eingabefelder, eigene Texte im Chat und der eigene Name werden nicht gesendet. Nur Text wird verändert, keine Elemente.
   - Außerdem: die Knöpfe oben rechts (Übersetzen, Assistent auf dem Handy, QR-Code scannen) als window.FP_TOPX. */
(function () {
  var R = window.React;
  function get(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { if (!v) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function lang() { return get("fp-lang", ""); }
  function auto() { return get("fp-ls-app", "") === "1"; }
  function setAuto(v) { put("fp-ls-app", v ? "1" : ""); window.dispatchEvent(new Event("fp-lang")); }
  var on = false;                       // Übersetzung gerade aktiv?
  try { on = !!lang() && (auto() || sessionStorage.getItem("fp-ls-on") === "1"); } catch (e) { on = !!lang() && auto(); }

  /* ---------- Was wird übersetzt? ---------- */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1, PRE: 1, KBD: 1, SVG: 1, svg: 1, CANVAS: 1, VIDEO: 1, IFRAME: 1 };
  var SKIP_SEL = ".fp-trbtn b,[data-notr],.notranslate,[contenteditable=true],.ls-pickbg,.ls-pop,.ls-bar,.ls-tr,.ls-toast,.qr-bg,.ast-bub,.avatar,.avbtn,.logo,.fp-tr-pill,.st-clock,kbd,code,pre,svg";
  var BRAND = /^(Fallpfad|PharmakoLab|ISBAR|SBAR|ABCDE|qSOFA|ACVPU|GCS|NRS|BESD|BE-FAST|DNQP|PflBG|PflAPrV|OK|SpO₂|SpO2|RR|AF|HF|BZ|O₂|Demo-Konto)$/i;
  var disp = new WeakMap();
  function isBlock(el) {
    if (disp.has(el)) return disp.get(el);
    var d = "inline";
    try { d = getComputedStyle(el).display; } catch (e) {}
    var b = d !== "inline" && d !== "contents";
    disp.set(el, b); return b;
  }
  function skipped(el) {
    for (var x = el; x && x !== document.body; x = x.parentElement) {
      if (SKIP_TAGS[x.tagName]) return true;
      if (x.nodeType === 1 && x.matches && x.matches(SKIP_SEL)) return true;
    }
    return false;
  }
  function wanted(t) {
    var s = t.trim();
    if (s.length < 2 || !/[A-Za-zÄÖÜäöüß]{2}/.test(s)) return false;
    if (BRAND.test(s)) return false;
    if (/^[\d\s.,:;/%°+\-–()×·]+[a-zA-Z/%°]{0,6}$/.test(s)) return false; // Zahlen mit Einheit
    if (/@|https?:\/\//.test(s)) return false;
    if (lang() === "einfach" && s.length < 60) return false;             // Einfaches Deutsch: nur ganze Sätze
    return true;
  }

  /* Zustand je Textknoten: Original und gesetzter Wert */
  var NS = new WeakMap(), units = new Map(), active = new Set();
  function origOf(n) { var st = NS.get(n); if (st && n.nodeValue === st.set) return st.orig; if (st) NS.delete(n); return n.nodeValue; }
  function blockOf(n) { var x = n.parentElement; while (x && x !== document.body && !isBlock(x)) x = x.parentElement; return x || document.body; }
  function collect(root) {
    var map = new Map();
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement; if (!p || skipped(p)) continue;
      var o = origOf(n); if (!o || !o.trim()) continue;
      var b = blockOf(n);
      if (!map.has(b)) map.set(b, []);
      map.get(b).push(n);
    }
    return map;
  }
  /* Eigenen Namen nicht senden */
  function maskName(t) {
    var nm = window.FP_PROF && window.FP_PROF.name ? String(window.FP_PROF.name).trim() : "";
    if (nm.length > 2 && t.indexOf(nm) >= 0) return { t: t.split(nm).join("⟦N⟧"), nm: nm };
    return { t: t, nm: "" };
  }

  var queue = new Map(), timer = null, inflight = 0, fehlerGemeldet = false, pending = 0;
  function schedule() { if (!timer) timer = setTimeout(flush, 220); }
  function scan(root) {
    if (!on) return;
    var l = lang(); if (!l) return;
    collect(root || document.body).forEach(function (nodes, block) {
      var text = nodes.map(origOf).join("").replace(/\s+/g, " ").trim();
      if (!wanted(text)) return;
      var u = units.get(block);
      if (u && u.text === text && u.l === l && u.applied && u.tr != null) {
        var same = u.nodes.length === nodes.length && u.nodes.every(function (x, i) { var st = NS.get(x); return x === nodes[i] && st && x.nodeValue === st.set; });
        if (!same) { u.nodes = nodes; apply(u, u.tr); }
        return;
      }
      if (u && u.text === text && u.l === l && u.nodes.length === nodes.length && u.nodes.every(function (x, i) { return x === nodes[i]; }) && u.wait) return;
      if (u && u.text === text && u.l === l && u.wait) { u.nodes = nodes; return; }
      u = { block: block, nodes: nodes, text: text, l: l, applied: false, wait: true };
      units.set(block, u);
      var m = maskName(text);
      if (!queue.has(m.t)) queue.set(m.t, []);
      queue.get(m.t).push({ u: u, nm: m.nm });
    });
    if (queue.size) schedule();
  }
  function apply(u, tr) {
    u.wait = false;
    var cur = units.get(u.block);
    if (cur && cur !== u && cur.text === u.text) { cur.wait = false; u = cur; }
    if (!on || units.get(u.block) !== u || !u.nodes.length) return;
    var origs = u.nodes.map(origOf), fi = -1;
    for (var i = 0; i < origs.length; i++) if (origs[i].trim()) { fi = i; break; }
    if (fi < 0) return;
    u.nodes.forEach(function (n, i) {
      if (!n.isConnected) return;
      var o = origs[i], v;
      if (i === fi) v = (o.match(/^\s*/) || [""])[0] + tr + (origs[origs.length - 1].match(/\s*$/) || [""])[0];
      else v = o.trim() ? "" : o;
      NS.set(n, { orig: o, set: v });
      if (n.nodeValue !== v) n.nodeValue = v;
      active.add(n);
    });
    u.applied = true; u.tr = tr;
    var rtl = ["ar", "fa"].indexOf(lang()) >= 0;
    if (rtl && u.block && u.block.setAttribute && !u.block.hasAttribute("dir")) { u.block.setAttribute("dir", "auto"); u.block.setAttribute("data-fp-dir", "1"); }
  }
  function flush() {
    timer = null;
    if (!on || !window.FP_LS || !window.FP_LS.translate) return;
    if (inflight >= 4) { schedule(); return; }
    var keys = Array.from(queue.keys()).slice(0, 25);
    if (!keys.length) return;
    var items = keys.map(function (k) { var v = queue.get(k); queue.delete(k); return [k, v]; });
    inflight++; pending += items.length; pill();
    var l = lang();
    window.FP_LS.translate(keys, l).then(function (out) {
      items.forEach(function (it, i) {
        var tr = out[i]; if (!tr) return;
        it[1].forEach(function (x) { apply(x.u, x.nm ? tr.split("⟦N⟧").join(x.nm) : tr); });
      });
    }, function (e) {
      if (!fehlerGemeldet) { fehlerGemeldet = true; toast((e && e.message) || "Die Übersetzung ist gerade nicht verfügbar."); }
    }).then(function () { inflight--; pending -= items.length; pill(); if (queue.size) schedule(); });
    if (queue.size) schedule();
  }
  function restore() {
    active.forEach(function (n) { var st = NS.get(n); if (st && n.isConnected && n.nodeValue === st.set) n.nodeValue = st.orig; NS.delete(n); });
    active.clear(); units.clear(); queue.clear();
    document.querySelectorAll("[data-fp-dir]").forEach(function (e) { e.removeAttribute("dir"); e.removeAttribute("data-fp-dir"); });
    pill();
  }

  /* Beobachten, was neu erscheint */
  var mo = null, rq = false, dirty = [];
  function observe() {
    if (mo) return;
    mo = new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === "characterData") { var st = NS.get(m.target); if (st && m.target.nodeValue === st.set) return; dirty.push(m.target.parentElement); }
        else if (m.addedNodes && m.addedNodes.length) {
          var own = true;
          for (var k = 0; k < m.addedNodes.length; k++) { var a = m.addedNodes[k]; if (!(a.nodeType === 1 && a.matches && a.matches(".fp-tr-pill,.ls-toast,.qr-bg,style"))) { own = false; break; } }
          if (!own) dirty.push(m.target);
        }
      });
      if (!rq) { rq = true; setTimeout(function () { rq = false; var d = dirty; dirty = []; if (!on) return; var seen = new Set(); d.forEach(function (el) { if (!el || !el.isConnected || seen.has(el)) return; seen.add(el); scan(isBlock(el) ? el : blockOf({ parentElement: el })); }); }, 120); }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function stopObs() { if (mo) { mo.disconnect(); mo = null; } }

  function setOn(v) {
    on = !!v && !!lang();
    try { sessionStorage.setItem("fp-ls-on", on ? "1" : "0"); } catch (e) {}
    fehlerGemeldet = false;
    if (on) { disp = new WeakMap(); observe(); scan(document.body); } else { stopObs(); restore(); }
    window.dispatchEvent(new Event("fp-tr"));
  }
  window.addEventListener("fp-lang", function () {
    var l = lang();
    if (!l) { if (on) setOn(false); return; }
    if (on) { restore(); disp = new WeakMap(); scan(document.body); }
    else if (auto()) setOn(true);
    window.dispatchEvent(new Event("fp-tr"));
  });
  function start() { if (on) { observe(); setTimeout(function () { scan(document.body); }, 400); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  /* ---------- Kleine Anzeige während der Übersetzung ---------- */
  var pillEl = null;
  function pill() {
    var show = on && pending > 0;
    if (show && !pillEl) { pillEl = document.createElement("div"); pillEl.className = "fp-tr-pill"; pillEl.setAttribute("role", "status"); document.body.appendChild(pillEl); }
    if (pillEl) { if (show) pillEl.innerHTML = '<i></i>Übersetze …'; else { pillEl.remove(); pillEl = null; } }
  }
  function toast(t) { var d = document.createElement("div"); d.className = "ls-toast"; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.classList.add("out"); setTimeout(function () { d.remove(); }, 300); }, 3800); }
  var st = document.createElement("style"); st.id = "fp-tr-css";
  st.textContent = ".fp-tr-pill{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:10050;background:var(--fg,#111);color:var(--bg,#fff);padding:7px 14px;border-radius:999px;font-size:13px;font-weight:600;display:flex;gap:8px;align-items:center;box-shadow:0 10px 30px -10px rgba(0,0,0,.4)}" +
    "@media (min-width:960px){.fp-tr-pill{bottom:24px}}" +
    ".fp-tr-pill i{width:12px;height:12px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:fptrspin .8s linear infinite}@keyframes fptrspin{to{transform:rotate(360deg)}}" +
    ".iconbtn.fp-trbtn[aria-pressed=true]{background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent)}" +
    ".iconbtn.fp-trbtn{position:relative}.iconbtn.fp-trbtn b{position:absolute;right:1px;bottom:1px;font-size:8.5px;line-height:1;padding:2px 3px;border-radius:5px;background:var(--accent);color:#fff;font-weight:800;letter-spacing:.02em;text-transform:uppercase}" +
    ".ls-pick-app{align-items:flex-start!important}.ls-pick-app input{margin-top:3px}.ls-pick-app b{display:block;font-weight:650}.ls-pick-app small{display:block;font-weight:400;color:var(--muted);font-size:12.5px;line-height:1.4;margin-top:2px}" +
    "@media (max-width:420px){.topbar .t{min-width:0;overflow:hidden}.topbar .t,.topbar .t small{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}}";
  (document.head || document.documentElement).appendChild(st);

  window.FP_TR = { isOn: function () { return on; }, setOn: setOn, auto: auto, setAuto: function (v) { setAuto(v); if (v && lang()) setOn(true); }, scan: function () { scan(document.body); } };

  /* ---------- Knöpfe oben rechts ---------- */
  if (!R) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect;
  var P = {
    qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 18.5V20h1.5M18.5 14H20v1.5",
    globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
  };
  function I(p) { return h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("path", { d: P[p.n] })); }
  function TopX() {
    var s = uS(0);
    uE(function () { function f() { s[1](function (x) { return x + 1; }); } window.addEventListener("fp-lang", f); window.addEventListener("fp-tr", f); return function () { window.removeEventListener("fp-lang", f); window.removeEventListener("fp-tr", f); }; }, []);
    var l = lang(), L = window.FP_LS && window.FP_LS.LANGS ? window.FP_LS.LANGS.filter(function (x) { return x.id === l; })[0] : null;
    var kurz = l === "einfach" ? "B1" : l.toUpperCase();
    return h(R.Fragment, null,
      l ? h("button", { type: "button", className: "iconbtn fp-trbtn", "aria-pressed": on, "aria-label": on ? "Original anzeigen" : "Seite übersetzen" + (L ? " (" + (l === "einfach" ? "Einfaches Deutsch" : L.nn) + ")" : ""), title: on ? "Original anzeigen" : "Seite übersetzen", onClick: function (e) { e.preventDefault(); setOn(!on); } }, h(I, { n: "globe" }), h("b", null, kurz)) : null,
      window.FP_Assistent && window.FP_PROF && window.FP_PROF.go ? h("button", { type: "button", className: "iconbtn fp-ast-top", "aria-label": "Assistent öffnen", title: "Assistent", onClick: function (e) { e.preventDefault(); window.FP_PROF.go("assistent"); } }, h(I, { n: "spark" })) : null,
      h("button", { type: "button", className: "iconbtn fp-qrbtn", "aria-label": "QR-Code scannen", title: "QR-Code scannen", onClick: function (e) { e.preventDefault(); if (window.FP_QR) window.FP_QR.open(); } }, h(I, { n: "qr" })));
  }
  window.FP_TOPX = TopX;
})();
