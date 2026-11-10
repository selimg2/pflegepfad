/* Fallpfad "Meine Sprache": Lernen mit einer zweiten Sprache an der Seite.
   - Sprache wählen im Profilmenü (gespeichert nur auf dem Gerät, localStorage "fp-lang")
   - Lernblöcke: Knopf neben "Vorlesen" zeigt Übersetzung bzw. einfaches Deutsch plus wichtige Wörter mit Artikel
   - Fachlexikon und Begriffs-Popover: Übersetzung, Aussprache, Erklärung übersetzen
   - Text markieren (Fälle, Aufgaben, Live): kleine Leiste zum Vorlesen und Übersetzen
   - Training "Fachsprache Deutsch": Wörter mit Artikel, Sätze für den Dienst, Übungen mit Hören
   Wörterbuch und Vorlesen laufen offline auf dem Gerät. Ganze Texte übersetzt die Edge Function "uebersetzen"
   (nur Lerninhalt, keine Eingabefelder, keine Personendaten). */
(function () {
  var R = window.React;
  if (!R) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect, uM = R.useMemo, Fr = R.Fragment;
  var DL = ["en", "tr", "ar", "uk", "ru", "vi"];
  var LANGS = [
    { id: "einfach", n: "Einfaches Deutsch", nn: "Kurze Sätze, Fachwörter erklärt" },
    { id: "en", n: "Englisch", nn: "English", v: "en-GB" },
    { id: "tr", n: "Türkisch", nn: "Türkçe", v: "tr-TR" },
    { id: "ar", n: "Arabisch", nn: "العربية", rtl: 1, v: "ar-SA" },
    { id: "uk", n: "Ukrainisch", nn: "Українська", v: "uk-UA" },
    { id: "ru", n: "Russisch", nn: "Русский", v: "ru-RU" },
    { id: "vi", n: "Vietnamesisch", nn: "Tiếng Việt", v: "vi-VN" },
    { id: "pl", n: "Polnisch", nn: "Polski", v: "pl-PL" },
    { id: "ro", n: "Rumänisch", nn: "Română", v: "ro-RO" },
    { id: "fa", n: "Persisch", nn: "فارسی", rtl: 1, v: "fa-IR" },
    { id: "hi", n: "Hindi", nn: "हिन्दी", v: "hi-IN" },
    { id: "ml", n: "Malayalam", nn: "മലയാളം", v: "ml-IN" },
    { id: "ta", n: "Tamil", nn: "தமிழ்", v: "ta-IN" },
    { id: "tl", n: "Filipino", nn: "Filipino", v: "fil-PH" },
    { id: "es", n: "Spanisch", nn: "Español", v: "es-ES" },
    { id: "pt", n: "Portugiesisch", nn: "Português", v: "pt-BR" },
    { id: "fr", n: "Französisch", nn: "Français", v: "fr-FR" },
    { id: "it", n: "Italienisch", nn: "Italiano", v: "it-IT" },
    { id: "el", n: "Griechisch", nn: "Ελληνικά", v: "el-GR" },
    { id: "sq", n: "Albanisch", nn: "Shqip", v: "sq-AL" },
    { id: "sr", n: "Serbisch", nn: "Srpski", v: "sr-RS" },
    { id: "bs", n: "Bosnisch", nn: "Bosanski", v: "bs-BA" },
    { id: "hr", n: "Kroatisch", nn: "Hrvatski", v: "hr-HR" },
    { id: "ku", n: "Kurdisch", nn: "Kurdî (Kurmancî)" }
  ];
  function L(id) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].id === id) return LANGS[i]; return null; }

  /* ---------- Einstellungen (nur auf dem Gerät) ---------- */
  function get(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { if (v == null || v === "") localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function lang() { return get("fp-lang", ""); }
  function slow() { return get("fp-ls-slow", "") === "1"; }
  function setLang(v) { put("fp-lang", v || ""); document.documentElement.setAttribute("data-ls", v || ""); window.dispatchEvent(new Event("fp-lang")); }
  function setSlow(v) { put("fp-ls-slow", v ? "1" : ""); window.dispatchEvent(new Event("fp-lang")); }
  document.documentElement.setAttribute("data-ls", lang());
  function useLang() {
    var s = uS(lang()), v = s[0], set = s[1];
    uE(function () { function f() { set(lang()); } window.addEventListener("fp-lang", f); return function () { window.removeEventListener("fp-lang", f); }; }, []);
    return v;
  }
  function hasDict(l) { return DL.indexOf(l) >= 0; }

  /* ---------- Wörterbuch ---------- */
  var W = [], P = [], KEY = {}, CATS = [], PCATS = [];
  (function parse() {
    var D = window.FP_LS_DATA || { words: "", phrases: "" }, cat = "";
    D.words.split("\n").forEach(function (l) {
      l = l.trim(); if (!l) return;
      if (l[0] === "#") { cat = l.slice(1); CATS.push(cat); return; }
      var a = l.split(";"), de = a[0], m = de.match(/^(der|die|das)\s+(.+)$/), w = { de: de, art: m ? m[1] : "", base: m ? m[2] : de, cat: cat, t: {} };
      DL.forEach(function (x, i) { w.t[x] = a[i + 1] || ""; });
      W.push(w);
      de.split(",").forEach(function (part) {
        var k = norm(part); if (k && !KEY[k]) KEY[k] = w;
      });
    });
    cat = "";
    D.phrases.split("\n").forEach(function (l) {
      l = l.trim(); if (!l) return;
      if (l[0] === "#") { cat = l.slice(1); PCATS.push(cat); return; }
      var a = l.split(";"), p = { de: a[0], cat: cat, t: {} };
      DL.forEach(function (x, i) { p.t[x] = a[i + 1] || ""; });
      P.push(p);
    });
  })();
  function norm(s) { return String(s || "").toLowerCase().replace(/[„“"'’.,;:!?()\[\]]/g, " ").replace(/^\s*(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/, "").replace(/\s+/g, " ").trim(); }
  function lookup(term) {
    var k = norm(term); if (!k) return null;
    if (KEY[k]) return { w: KEY[k] };
    var ends = ["en", "n", "e", "es", "s", "er"];
    for (var i = 0; i < ends.length; i++) if (k.length > 4 && k.slice(-ends[i].length) === ends[i] && KEY[k.slice(0, -ends[i].length)]) return { w: KEY[k.slice(0, -ends[i].length)] };
    for (var j = 0; j < ends.length; j++) if (KEY[k + ends[j]]) return { w: KEY[k + ends[j]] };
    /* Zusammengesetzte Wörter: letzter Wortteil (Dekubitusprophylaxe -> Prophylaxe) */
    var best = null;
    Object.keys(KEY).forEach(function (key) { if (key.length >= 4 && key.indexOf(" ") < 0 && k.length > key.length && k.slice(-key.length) === key && (!best || key.length > best.length)) best = key; });
    if (best) return { w: KEY[best], part: true };
    return null;
  }
  /* Wichtige Wörter in einem Text finden (für die Liste unter der Übersetzung) */
  function wordsIn(text) {
    var t = " " + String(text || "").toLowerCase().replace(/<[^>]+>/g, " ").replace(/[^a-zäöüß\- ]/g, " ") + " ", out = [], seen = {};
    W.forEach(function (w) {
      var b = w.base.split(",")[0].toLowerCase().trim();
      if (b.length < 4 || seen[w.de]) return;
      var re = new RegExp("[ \\-]" + b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(en|n|e|s|es)?[ \\-]");
      if (re.test(t)) { seen[w.de] = 1; out.push(w); }
    });
    return out.slice(0, 12);
  }

  /* ---------- Vorlesen (auf dem Gerät, ohne Server) ---------- */
  var canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  function speak(text, l, onEnd) {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    var code = !l || l === "de" || l === "einfach" ? "de-DE" : (L(l) && L(l).v) || l;
    u.lang = code; u.rate = slow() ? 0.78 : 0.95;
    var vs = window.speechSynthesis.getVoices(), pre = code.slice(0, 2).toLowerCase();
    var vm = vs.filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf(pre) === 0; }), v = vm.filter(function (x) { return x.localService; })[0] || vm[0];
    if (v) u.voice = v;
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
    window.speechSynthesis.speak(u);
  }
  function stop() { if (canSpeak) window.speechSynthesis.cancel(); }
  function canSpeakLang(l) {
    if (!canSpeak || !l || l === "einfach") return canSpeak;
    var code = ((L(l) && L(l).v) || l).slice(0, 2).toLowerCase();
    return window.speechSynthesis.getVoices().some(function (x) { return x.lang && x.lang.toLowerCase().indexOf(code) === 0; });
  }
  if (canSpeak) try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = function () { window.dispatchEvent(new Event("fp-lang")); }; } catch (e) {}

  /* ---------- Übersetzen ganzer Texte (Server, mit Cache auf dem Gerät) ---------- */
  function hash(s) { var x = 5381; for (var i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return (x >>> 0).toString(36) + s.length; }
  function plain(html) { var d = document.createElement("div"); d.innerHTML = String(html || "").replace(/<\/(p|li|h\d|div|tr|td|th)>/gi, "$& ").replace(/<br\s*\/?>/gi, " "); d.querySelectorAll(".src,sup,script,style").forEach(function (n) { n.remove(); }); return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function translate(texts, l) {
    texts = texts.map(function (t) { return String(t || "").slice(0, 3000); });
    var keys = texts.map(function (t) { return "fp-ls-c:" + l + ":" + hash(t); }), res = keys.map(function (k) { return get(k, null); });
    var miss = []; res.forEach(function (r, i) { if (r == null) miss.push(i); });
    window.FP_LS_LAST = texts;
    if (!miss.length) return Promise.resolve(res);
    if (window.FP_DEMO_ACC && window.FP_LS_DEMO) {
      var dm = miss.map(function (i) { var e = window.FP_LS_DEMO[texts[i].slice(0, 60)]; return e && e[l]; });
      if (dm.every(Boolean)) { miss.forEach(function (i, k) { res[i] = dm[k]; }); return new Promise(function (ok) { setTimeout(function () { ok(res); }, 700); }); }
    }
    if (window.FP_DEMO_ACC) return Promise.reject(new Error("In der Demo ohne Schulserver übersetzt Fallpfad nur die ersten Lernblöcke des ersten Moduls (Englisch, Türkisch, Arabisch, Ukrainisch, einfaches Deutsch). Wörterbuch, Aussprache und Vorlesen funktionieren trotzdem."));
    if (navigator.onLine === false) return Promise.reject(new Error("Du bist offline. Wörterbuch und Vorlesen funktionieren trotzdem."));
    if (!window.FP_SBC) return Promise.reject(new Error("Die Übersetzung ist hier nicht verfügbar."));
    return Promise.resolve().then(function () { return window.FP_SBC(); }).then(function (sb) {
      if (!sb || !sb.functions) throw new Error("Die Übersetzung ist ohne Schulkonto nicht verfügbar. Wörterbuch und Vorlesen funktionieren trotzdem.");
      return sb.functions.invoke("uebersetzen", { body: { lang: l, texts: miss.map(function (i) { return texts[i]; }) } }).then(function (r) {
      if (r.error) {
        var ctx = r.error.context;
        if (ctx && ctx.json) return ctx.json().then(function (j) { throw new Error((j && j.error) || "Die Übersetzung hat nicht geklappt."); }, function () { throw new Error("Die Übersetzung hat nicht geklappt."); });
        throw new Error("Die Übersetzung hat nicht geklappt.");
      }
      var out = (r.data && r.data.out) || [];
      miss.forEach(function (i, k) { res[i] = out[k] || ""; if (out[k]) put(keys[i], out[k]); });
      return res;
    }); }, function (e) { throw new Error(e && /Übersetzung|Wörterbuch/.test(e.message) ? e.message : "Die Übersetzung ist ohne Schulkonto nicht verfügbar. Wörterbuch und Vorlesen funktionieren trotzdem."); });
  }

  /* ---------- Kleine Bausteine ---------- */
  var ICO = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    spk: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chk: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    turtle: '<path d="M4 15c0-4 3.5-7 8-7s8 3 8 7z"/><path d="M6 15v3M18 15v3M20 13h2"/>'
  };
  function Ic(p) { return h("svg", { viewBox: "0 0 24 24", width: p.s || 16, height: p.s || 16, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ICO[p.k] } }); }
  function icHtml(k, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 16) + '" height="' + (s || 16) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[k] + "</svg>"; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function Art(p) { return p.a ? h("span", { className: "ls-art ls-" + p.a }, p.a) : null; }
  function SpeakBtn(p) {
    if (!canSpeak) return null;
    return h("button", { type: "button", className: "ls-ib", "aria-label": p.label || "Aussprechen", title: p.label || "Aussprechen", onClick: function (e) { e.preventDefault(); e.stopPropagation(); speak(p.text, p.lang); } }, h(Ic, { k: "spk", s: p.s || 15 }));
  }
  function trOf(w, l) { return w && hasDict(l) ? w.t[l] : ""; }

  /* ---------- Sprachauswahl (Blatt) ---------- */
  var pickEl = null;
  function closePicker() { if (pickEl) { var e = pickEl; pickEl = null; e.classList.add("out"); setTimeout(function () { e.remove(); }, 160); } }
  function openPicker(after) {
    closePicker();
    var cur = lang(), bg = document.createElement("div");
    bg.className = "fxpm-bg sheet ls-pickbg";
    bg.innerHTML = '<div class="fxpm ls-pick" role="dialog" aria-label="Meine Sprache">' +
      '<div class="ls-pick-h"><b>Meine Sprache</b><small>Fallpfad zeigt dir Übersetzungen, Aussprache und wichtige Wörter. Deine Wahl bleibt nur auf diesem Gerät.</small></div>' +
      '<div class="ls-pick-l">' +
      '<button type="button" data-l="" class="' + (!cur ? "on" : "") + '"><span>Nur Deutsch</span><small>Keine Hilfen anzeigen</small></button>' +
      LANGS.map(function (x) { return '<button type="button" data-l="' + x.id + '" class="' + (cur === x.id ? "on" : "") + '"' + (x.rtl ? ' dir="auto"' : "") + "><span>" + esc(x.id === "einfach" ? x.n : x.nn) + "</span><small>" + esc(x.id === "einfach" ? x.nn : x.n) + (hasDict(x.id) ? " · mit Wörterbuch" : "") + "</small></button>"; }).join("") +
      "</div>" +
      (canSpeak ? '<label class="ls-pick-slow"><input type="checkbox"' + (slow() ? " checked" : "") + '> <span>Langsamer vorlesen</span></label>' : "") +
      "</div>";
    document.body.appendChild(bg); pickEl = bg;
    if (window.innerWidth > 640) { bg.classList.remove("sheet"); bg.classList.add("ls-center"); }
    bg.addEventListener("click", function (e) {
      if (e.target === bg) return closePicker();
      var b = e.target.closest("[data-l]");
      if (b) { setLang(b.getAttribute("data-l")); closePicker(); if (after) after(); toast(b.getAttribute("data-l") ? "Meine Sprache: " + (L(b.getAttribute("data-l")) || {}).n : "Nur Deutsch"); }
    });
    var cb = bg.querySelector(".ls-pick-slow input"); if (cb) cb.addEventListener("change", function () { setSlow(cb.checked); });
  }
  function toast(t) {
    var d = document.createElement("div"); d.className = "ls-toast"; d.textContent = t; document.body.appendChild(d);
    setTimeout(function () { d.classList.add("out"); }, 1600); setTimeout(function () { d.remove(); }, 1900);
  }

  /* ---------- Übersetzungs-Panel (für Lernblöcke) ---------- */
  function panelHtml(l, state, text, words) {
    var Lx = L(l) || {}, head = l === "einfach" ? "Einfaches Deutsch" : Lx.n;
    var body = state === "load" ? '<p class="ls-load"><span></span><span></span><span></span> ' + (l === "einfach" ? "Wird vereinfacht …" : "Wird übersetzt …") + "</p>"
      : state === "err" ? '<p class="ls-err">' + esc(text) + "</p>"
      : '<div class="ls-out"' + (Lx.rtl ? ' dir="rtl"' : "") + ' lang="' + (l === "einfach" ? "de" : l) + '">' + esc(text).replace(/\n/g, "<br>") + "</div>";
    var wl = words && words.length ? '<div class="ls-words"><small>Wichtige Wörter</small><ul>' + words.map(function (w) {
      return '<li><button type="button" class="ls-ib" data-say="' + esc(w.de) + '" aria-label="' + esc(w.de) + ' aussprechen">' + icHtml("spk", 14) + "</button>" + (w.art ? '<span class="ls-art ls-' + w.art + '">' + w.art + "</span>" : "") + "<b>" + esc(w.base) + "</b>" + (hasDict(l) ? '<span class="ls-tr"' + (Lx.rtl ? ' dir="rtl"' : "") + ">" + esc(w.t[l]) + "</span>" : "") + "</li>";
    }).join("") + "</ul></div>" : "";
    return '<div class="ls-ph"><span>' + icHtml("globe", 15) + " " + esc(head) + "</span>" +
      (state === "ok" && canSpeakLang(l) ? '<button type="button" class="ls-ib" data-sayout aria-label="Übersetzung vorlesen">' + icHtml("spk", 15) + "</button>" : "") +
      '<button type="button" class="ls-ib" data-x aria-label="Schließen">' + icHtml("x", 15) + "</button></div>" + body + wl;
  }
  function showPanel(card, html) {
    var l = lang(); if (!card) return;
    var old = card.querySelector(":scope > .ls-panel"); if (old) { old.remove(); return; }
    var p = document.createElement("div"); p.className = "ls-panel"; card.appendChild(p);
    var src = plain(html), words = wordsIn(src), out = "";
    function draw(st, t) { out = t; p.innerHTML = panelHtml(l, st, t, words); }
    draw("load");
    p.addEventListener("click", function (e) {
      if (e.target.closest("[data-x]")) { stop(); p.remove(); return; }
      var s = e.target.closest("[data-say]"); if (s) { speak(s.getAttribute("data-say"), "de"); return; }
      if (e.target.closest("[data-sayout]")) speak(out, l);
    });
    translate([src], l).then(function (r) { draw("ok", r[0] || ""); }, function (e) { draw("err", (e && e.message) || "Die Übersetzung hat nicht geklappt."); });
    setTimeout(function () { try { p.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {} }, 60);
  }

  /* Knopf neben "Vorlesen" in Lernblöcken */
  function Btn(p) {
    var l = useLang(), ref = R.useRef(null);
    var Lx = L(l);
    return h("button", {
      type: "button", ref: ref, className: "readbtn ls-btn" + (l ? " set" : ""), "aria-label": l ? (l === "einfach" ? "In einfachem Deutsch anzeigen" : "In " + Lx.n + " anzeigen") : "Meine Sprache wählen",
      title: l ? (l === "einfach" ? "Einfaches Deutsch" : Lx.n) : "Meine Sprache",
      onClick: function (e) {
        e.preventDefault(); e.stopPropagation();
        var card = ref.current && ref.current.closest(".card");
        if (!lang()) return openPicker(function () { showPanel(card, p.html); });
        showPanel(card, p.html);
      }
    }, h(Ic, { k: "globe", s: 14 }), l ? h("span", { className: "ls-btn-t" }, l === "einfach" ? "Einfach" : l.toUpperCase()) : null);
  }

  /* Im Begriffs-Popover: Übersetzung, Aussprache, Erklärung übersetzen */
  function Pop(p) {
    var l = useLang(), m = uM(function () { return lookup(p.term); }, [p.term]);
    var st = uS(null), tr = st[0], setTr = st[1];
    var Lx = L(l) || {};
    var direct = m && hasDict(l) ? m.w.t[l] : "";
    return h("div", { className: "ls-pop" },
      h("div", { className: "ls-pop-r" },
        h(SpeakBtn, { text: p.term, lang: "de", label: p.term + " aussprechen" }),
        m && m.w.art && !m.part ? h(Art, { a: m.w.art }) : null,
        direct ? h("span", { className: "ls-tr", dir: Lx.rtl ? "rtl" : null }, (m.part ? m.w.base + ": " : "") + direct) : null,
        l ? h("button", { type: "button", className: "ls-link", onClick: function (e) {
          e.preventDefault(); e.stopPropagation(); setTr({ s: "load" });
          translate([p.term + ": " + plain(p.def || "")], l).then(function (r) { setTr({ s: "ok", t: r[0] }); }, function (er) { setTr({ s: "err", t: er.message }); });
        } }, l === "einfach" ? "Einfacher erklären" : "Erklärung übersetzen")
          : h("button", { type: "button", className: "ls-link", onClick: function (e) { e.preventDefault(); e.stopPropagation(); openPicker(); } }, "Meine Sprache")),
      tr ? h("div", { className: tr.s === "err" ? "ls-err" : "ls-out", dir: tr.s === "ok" && Lx.rtl ? "rtl" : null }, tr.s === "load" ? "Einen Moment …" : tr.t) : null);
  }

  /* ---------- Markieren und Übersetzen (überall im Lerninhalt) ---------- */
  var bar = null, selTimer = 0;
  function hideBar() { if (bar) { bar.remove(); bar = null; } }
  function selText() {
    var s = window.getSelection && window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) return null;
    var t = String(s).replace(/\s+/g, " ").trim();
    if (t.length < 2 || t.length > 700) return null;
    var n = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
    if (!n || !n.closest || n.closest("input,textarea,[contenteditable=true],.ls-panel,.ls-bar,.ls-pick,.fxpm,nav,.topbar")) return null;
    if (!n.closest("main, .fxl-stu, .fxls, .pop, .card")) return null;
    return { t: t, r: s.getRangeAt(0).getBoundingClientRect() };
  }
  function showBar() {
    var l = lang(); if (!l) return hideBar();
    var s = selText(); if (!s) return hideBar();
    hideBar();
    var Lx = L(l) || {}, m = s.t.split(" ").length <= 3 ? lookup(s.t) : null;
    bar = document.createElement("div"); bar.className = "ls-bar"; bar.setAttribute("role", "toolbar");
    bar.innerHTML = (canSpeak ? '<button type="button" data-a="say" aria-label="Vorlesen">' + icHtml("spk", 16) + "</button>" : "") +
      (m && hasDict(l) ? '<span class="ls-bar-w">' + (m.w.art && !m.part ? '<span class="ls-art ls-' + m.w.art + '">' + m.w.art + "</span>" : "") + '<span' + (Lx.rtl ? ' dir="rtl"' : "") + ">" + esc((m.part ? m.w.base + ": " : "") + m.w.t[l]) + "</span></span>" : "") +
      '<button type="button" data-a="tr">' + icHtml("globe", 15) + "<span>" + (l === "einfach" ? "Einfacher" : "Übersetzen") + "</span></button>";
    document.body.appendChild(bar);
    var bw = bar.offsetWidth, top = s.r.bottom + 10, left = Math.max(10, Math.min(window.innerWidth - bw - 10, s.r.left + s.r.width / 2 - bw / 2));
    if (top + 50 > window.innerHeight) top = Math.max(10, s.r.top - 54);
    bar.style.top = top + "px"; bar.style.left = left + "px";
    var text = s.t;
    bar.addEventListener("mousedown", function (e) { e.preventDefault(); });
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a]"); if (!b) return;
      if (b.getAttribute("data-a") === "say") return speak(text, "de");
      var box = bar.querySelector(".ls-bar-out");
      if (!box) { box = document.createElement("div"); box.className = "ls-bar-out"; bar.appendChild(box); }
      box.className = "ls-bar-out"; box.textContent = "Einen Moment …"; if (Lx.rtl) box.dir = "rtl";
      translate([text], l).then(function (r) { box.textContent = r[0] || ""; reposition(); }, function (er) { box.className = "ls-bar-out ls-err"; box.textContent = er.message; reposition(); });
    });
    function reposition() { if (!bar) return; var r = bar.getBoundingClientRect(); if (r.bottom > window.innerHeight - 8) bar.style.top = Math.max(8, window.innerHeight - r.height - 8) + "px"; }
  }
  document.addEventListener("selectionchange", function () { clearTimeout(selTimer); selTimer = setTimeout(function () { if (bar && bar.contains(document.activeElement)) return; showBar(); }, 380); });
  document.addEventListener("scroll", function () { if (bar && !bar.querySelector(".ls-bar-out")) hideBar(); }, { passive: true, capture: true });

  /* ---------- Fachlexikon: Übersetzung neben dem Begriff ---------- */
  function decorateLex() {
    var l = lang(), dts = document.querySelectorAll("dl.lex dt");
    for (var i = 0; i < dts.length; i++) {
      var dt = dts[i], term = dt.getAttribute("data-ls-term") || dt.firstChild && dt.firstChild.nodeValue || dt.textContent;
      if (!dt.getAttribute("data-ls-term")) dt.setAttribute("data-ls-term", term);
      var cur = dt.querySelector(".ls-lx"), m = hasDict(l) ? lookup(term) : null, want = m ? (m.part ? m.w.base + ": " : "") + m.w.t[l] : "";
      if (!want) { if (cur) cur.remove(); continue; }
      if (cur && cur.textContent === want) continue;
      if (!cur) { cur = document.createElement("span"); cur.className = "ls-lx"; dt.appendChild(cur); }
      cur.textContent = want; cur.dir = L(l).rtl ? "rtl" : "auto";
    }
  }
  var q = 0;
  function tick() { if (q) return; q = 1; requestAnimationFrame(function () { q = 0; decorateLex(); }); }
  function start() { new MutationObserver(tick).observe(document.body, { childList: true, subtree: true }); window.addEventListener("fp-lang", tick); tick(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  /* ---------- Training "Fachsprache Deutsch" ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function known() { try { return JSON.parse(get("fp-ls-known", "{}")) || {}; } catch (e) { return {}; } }
  function setKnown(o) { put("fp-ls-known", JSON.stringify(o)); }

  function Trainer() {
    var l = useLang(), Lx = L(l) || {}, dict = hasDict(l);
    var t = uS("woerter"), tab = t[0], setTab = t[1];
    var c = uS(CATS[0]), cat = c[0], setCat = c[1];
    var k = uS(known()), kn = k[0], setKn = k[1];
    function toggle(de) { var o = Object.assign({}, kn); if (o[de]) delete o[de]; else o[de] = 1; setKn(o); setKnown(o); }
    var nKnown = Object.keys(kn).length;
    var TABS = [["woerter", "Wörter"], ["saetze", "Sätze für den Dienst"], ["ueben", "Üben"]];
    return h("div", { className: "ls-tr-wrap" },
      h("div", { className: "card ls-hero" },
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { className: "eyebrow" }, "Wörter für Station und Prüfung"),
          h("p", { style: { margin: "6px 0 0" } }, "Die wichtigsten Fachwörter mit Artikel und Aussprache. ", dict ? "Mit Übersetzung ins " + Lx.n + "." : l && l !== "einfach" ? "Für " + Lx.n + " gibt es die Wortliste ohne Übersetzung; Lernblöcke übersetzt Fallpfad trotzdem." : "Wähle eine Sprache, dann siehst du die Übersetzung daneben."),
          h("div", { className: "ls-prog" }, h("span", { style: { width: Math.round(100 * nKnown / W.length) + "%" } })),
          h("small", { className: "muted" }, nKnown + " von " + W.length + " Wörtern sitzen")),
        h("button", { type: "button", className: "btn ghost ls-langbtn", onClick: function () { openPicker(); } }, h(Ic, { k: "globe", s: 16 }), l ? (l === "einfach" ? "Einfaches Deutsch" : Lx.nn) : "Sprache wählen")),
      h("div", { className: "ls-tabs", role: "tablist" }, TABS.map(function (x) { return h("button", { key: x[0], type: "button", role: "tab", "aria-selected": tab === x[0], className: tab === x[0] ? "on" : "", onClick: function () { stop(); setTab(x[0]); } }, x[1]); })),
      tab === "woerter" ? h(Fr, null,
        h("div", { className: "ls-cats" }, CATS.map(function (x) { return h("button", { key: x, type: "button", className: "chip" + (cat === x ? " on" : ""), onClick: function () { setCat(x); } }, x); })),
        h("ul", { className: "ls-list" }, W.filter(function (w) { return w.cat === cat; }).map(function (w) {
          return h("li", { key: w.de, className: kn[w.de] ? "ok" : "" },
            h(SpeakBtn, { text: w.de, lang: "de" }),
            h("div", { className: "ls-de" }, h(Art, { a: w.art }), h("b", null, w.base)),
            dict ? h("div", { className: "ls-tr", dir: Lx.rtl ? "rtl" : null }, w.t[l]) : null,
            h("button", { type: "button", className: "ls-ib ls-kn" + (kn[w.de] ? " on" : ""), "aria-pressed": !!kn[w.de], "aria-label": kn[w.de] ? "Kann ich, zurücksetzen" : "Als gelernt markieren", title: "Kann ich", onClick: function () { toggle(w.de); } }, h(Ic, { k: "chk", s: 15 })));
        })),
        h("p", { className: "muted", style: { fontSize: 13 } }, "Farben der Artikel: ", h(Art, { a: "der" }), " ", h(Art, { a: "die" }), " ", h(Art, { a: "das" }), " · Tippe auf den Lautsprecher, um das Wort zu hören."))
      : tab === "saetze" ? h("div", null, PCATS.map(function (pc) {
        return h("section", { key: pc, className: "ls-psec" }, h("h3", null, pc),
          P.filter(function (x) { return x.cat === pc; }).map(function (x, i) {
            return h("div", { key: i, className: "card ls-phr" },
              h("div", { className: "ls-phr-de" }, h(SpeakBtn, { text: x.de, lang: "de", label: "Satz vorlesen" }), h("b", null, x.de)),
              dict ? h("div", { className: "ls-phr-tr", dir: Lx.rtl ? "rtl" : null }, x.t[l], canSpeakLang(l) ? h(SpeakBtn, { text: x.t[l], lang: l, label: "Übersetzung vorlesen" }) : null) : null);
          }));
      }))
      : h(Quiz, { l: l, dict: dict, Lx: Lx, kn: kn, onKnow: function (de) { if (!kn[de]) toggle(de); } }));
  }

  function makeQ(mode, l, kn) {
    var pool = W.filter(function (w) { return !kn[w.de]; }); if (pool.length < 8) pool = W;
    if (mode === "artikel") pool = pool.filter(function (w) { return w.art && w.base.indexOf(",") < 0; });
    var w = pool[Math.floor(Math.random() * pool.length)];
    if (mode === "artikel") return { w: w, mode: mode, opts: ["der", "die", "das"], ans: w.art };
    var others = shuffle(W.filter(function (x) { return x !== w && x.cat === w.cat; })).slice(0, 3);
    if (others.length < 3) others = others.concat(shuffle(W.filter(function (x) { return x !== w && others.indexOf(x) < 0; })).slice(0, 3 - others.length));
    var opts = shuffle([w].concat(others));
    return { w: w, mode: mode, opts: opts.map(function (x) { return x.de; }), ans: w.de };
  }
  function Quiz(p) {
    var modes = (p.dict ? [["bedeutung", "Was heißt das auf Deutsch?"]] : []).concat(canSpeak ? [["hoeren", "Hören und erkennen"]] : []).concat([["artikel", "der, die oder das?"]]);
    var m = uS(modes[0][0]), mode = m[0], setMode = m[1];
    var qs = uS(function () { return makeQ(modes[0][0], p.l, p.kn); }), Q = qs[0], setQ = qs[1];
    var pk = uS(null), pick = pk[0], setPick = pk[1];
    var sc = uS({ r: 0, n: 0 }), score = sc[0], setScore = sc[1];
    uE(function () { if (Q.mode === "hoeren") setTimeout(function () { speak(Q.w.de, "de"); }, 250); }, [Q]);
    function next(md) { setPick(null); setQ(makeQ(md || mode, p.l, p.kn)); }
    function choose(o) {
      if (pick) return; setPick(o);
      var ok = o === Q.ans; setScore({ r: score.r + (ok ? 1 : 0), n: score.n + 1 });
      if (ok && Q.mode !== "artikel") p.onKnow(Q.w.de);
      if (canSpeak) speak(Q.w.de, "de");
    }
    var prompt = Q.mode === "bedeutung" ? h("div", { className: "ls-q-big", dir: p.Lx.rtl ? "rtl" : null }, Q.w.t[p.l])
      : Q.mode === "hoeren" ? h("button", { type: "button", className: "btn ls-q-play", onClick: function () { speak(Q.w.de, "de"); } }, h(Ic, { k: "spk", s: 22 }), "Nochmal hören")
      : h("div", { className: "ls-q-big" }, "… ", Q.w.base);
    return h("div", { className: "card ls-quiz" },
      h("div", { className: "ls-cats" }, modes.map(function (x) { return h("button", { key: x[0], type: "button", className: "chip" + (mode === x[0] ? " on" : ""), onClick: function () { setMode(x[0]); next(x[0]); } }, x[1]); })),
      h("div", { className: "ls-q-score muted" }, score.n ? score.r + " von " + score.n + " richtig" : "Los geht’s"),
      prompt,
      h("div", { className: "ls-q-opts" + (Q.mode === "artikel" ? " art" : "") }, Q.opts.map(function (o) {
        var cls = pick ? (o === Q.ans ? "ok" : o === pick ? "bad" : "") : "";
        return h("button", { key: o, type: "button", className: "ls-q-o " + cls + (Q.mode === "artikel" ? " ls-" + o : ""), disabled: !!pick, onClick: function () { choose(o); } }, o);
      })),
      pick ? h("div", { className: "ls-q-fb" },
        h("div", null, h(Art, { a: Q.w.art }), h("b", null, " " + Q.w.base), p.dict ? h("span", { className: "ls-tr", dir: p.Lx.rtl ? "rtl" : null }, " · " + Q.w.t[p.l]) : null),
        h("button", { type: "button", className: "btn", onClick: function () { next(); } }, "Weiter")) : null);
  }

  window.FP_LS = { LANGS: LANGS, lang: lang, setLang: setLang, open: openPicker, lookup: lookup, speak: speak, translate: translate, Btn: Btn, Pop: Pop, Trainer: Trainer, rate: function () { return slow() ? 0.78 : 1; }, label: function () { var l = lang(); return !l ? "Nur Deutsch" : l === "einfach" ? "Einfaches Deutsch" : (L(l) || {}).nn; } };
})();
