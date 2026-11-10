/* Fallpfad als App (iPhone, iPad, Mac mit Apple-Chip, Android): native Ergänzungen über Capacitor.
   Läuft nur in der App. Im Browser passiert hier nichts.
   - Vorlesen auf Android (WebView hat keine Sprachausgabe) über das Text-to-Speech-Plugin
   - Statusleiste passend zu Hell/Dunkel, Splash ausblenden, sanftes haptisches Feedback
   - PDF- und Datei-Export über das Teilen-Menü (Dateien, Mail, AirDrop, Drucken)
   - Android-Zurück-Taste, Deep Links (fallpfad://live/CODE und Links mit ?live=)
   - Live-Unterricht: QR-Code direkt in der App scannen oder Code eingeben
   - Lokale Erinnerungen: Abgaben am Vortag und auf Wunsch tägliche Lernerinnerung (alles auf dem Gerät) */
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var plat = C.getPlatform ? C.getPlatform() : "";
  var reg = function (n) { try { return C.registerPlugin(n); } catch (e) { return null; } };
  var StatusBar = reg("StatusBar"), Splash = reg("SplashScreen"), Haptics = reg("Haptics"), FS = reg("Filesystem"), Share = reg("Share"),
    App = reg("App"), LN = reg("LocalNotifications"), TTS = reg("TextToSpeech"), Scan = reg("CapacitorBarcodeScanner"), SysBars = reg("SystemBars");
  var de = document.documentElement;
  de.classList.add("fp-native", "fp-" + plat);
  window.FP_NATIVE = { platform: plat };

  /* ---------- Sprachausgabe auf Android ergänzen (muss vor der App laufen) ---------- */
  if (TTS && (!("speechSynthesis" in window) || plat === "android")) {
    var langs = ["de-DE", "en-GB", "tr-TR", "ar-SA", "uk-UA", "ru-RU", "vi-VN", "pl-PL", "ro-RO", "fa-IR", "hi-IN", "es-ES", "fr-FR", "it-IT", "pt-BR", "el-GR", "sq-AL", "sr-RS", "hr-HR", "bs-BA", "ml-IN", "ta-IN", "fil-PH"];
    var voices = langs.map(function (l) { return { lang: l, name: l, localService: true, default: l === "de-DE", voiceURI: l }; });
    var synth = {
      speaking: false, pending: false, paused: false, onvoiceschanged: null,
      getVoices: function () { return voices; },
      speak: function (u) {
        synth.speaking = true;
        TTS.speak({ text: u.text || "", lang: u.lang || "de-DE", rate: u.rate || 1, pitch: 1, volume: 1, category: "playback" })
          .then(function () { synth.speaking = false; u.onend && u.onend({}); }, function (e) { synth.speaking = false; u.onerror && u.onerror(e); });
      },
      cancel: function () { synth.speaking = false; try { TTS.stop(); } catch (e) {} },
      pause: function () {}, resume: function () {}
    };
    try { Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true }); } catch (e) { window.speechSynthesis = synth; }
    if (typeof window.SpeechSynthesisUtterance !== "function" || plat === "android") {
      window.SpeechSynthesisUtterance = function (t) { this.text = t || ""; this.lang = "de-DE"; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; this.onend = null; this.onerror = null; };
    }
  }

  function ready(f) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", f); else f(); }

  /* ---------- Statusleiste und Splash ---------- */
  function isDark() {
    var t = de.getAttribute("data-theme");
    return t === "dark" || (t !== "light" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function bar() {
    if (SysBars) try { SysBars.setStyle({ style: isDark() ? "DARK" : "LIGHT" }); } catch (e) {}
    if (!StatusBar) return;
    try {
      StatusBar.setStyle({ style: isDark() ? "DARK" : "LIGHT" });
      if (plat === "android" && !SysBars) {
        var bg = getComputedStyle(document.body || de).backgroundColor || (isDark() ? "#0b1220" : "#ffffff");
        var m = bg.match(/\d+/g); if (m) bg = "#" + m.slice(0, 3).map(function (x) { return (+x).toString(16).padStart(2, "0"); }).join("");
        StatusBar.setBackgroundColor({ color: bg });
      }
    } catch (e) {}
  }
  new MutationObserver(bar).observe(de, { attributes: true, attributeFilter: ["data-theme", "data-fp"] });
  if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", bar);

  /* ---------- Haptik (dezent) ---------- */
  function tap(style) { if (Haptics) try { Haptics.impact({ style: style || "LIGHT" }); } catch (e) {} }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest(".tab, .btn, .lvopt, .opt, .ls-q-o, .fxpm-sw, .fxl-si button");
    if (el && !el.disabled) tap(el.classList.contains("btn") ? "MEDIUM" : "LIGHT");
  }, true);

  /* ---------- Dateien exportieren: Teilen-Menü statt Download ---------- */
  function blobToB64(b) { return new Promise(function (ok, no) { var r = new FileReader(); r.onload = function () { ok(String(r.result).split(",")[1] || ""); }; r.onerror = no; r.readAsDataURL(b); }); }
  function shareUrl(href, name) {
    if (!FS || !Share) return false;
    name = String(name || "Fallpfad-Export").replace(/[\\/:*?"<>|]+/g, "-");
    fetch(href).then(function (r) { return r.blob(); }).then(function (b) {
      if (!/\.\w{2,5}$/.test(name)) name += b.type === "application/pdf" ? ".pdf" : b.type.indexOf("sheet") >= 0 ? ".xlsx" : "";
      return blobToB64(b).then(function (d) { return FS.writeFile({ path: name, data: d, directory: "CACHE" }); });
    }).then(function (w) { return Share.share({ title: name, url: w.uri, dialogTitle: "Speichern oder teilen" }); })
      .catch(function (e) { if (!/cancel/i.test(String(e && e.message))) alertLite("Die Datei konnte nicht geöffnet werden."); });
    return true;
  }
  var aClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    var href = this.href || "";
    if ((this.hasAttribute("download") || /^blob:|^data:/.test(href)) && /^(blob:|data:)/.test(href) && shareUrl(href, this.getAttribute("download"))) return;
    return aClick.apply(this, arguments);
  };
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[download], a[href^='blob:']");
    if (a && /^(blob:|data:)/.test(a.href) && shareUrl(a.href, a.getAttribute("download"))) e.preventDefault();
  }, true);
  var wOpen = window.open;
  window.open = function (u) { if (typeof u === "string" && /^(blob:|data:)/.test(u) && shareUrl(u, "Fallpfad.pdf")) return null; return wOpen.apply(window, arguments); };

  function alertLite(t) {
    var d = document.createElement("div"); d.className = "ls-toast"; d.textContent = t; document.body.appendChild(d);
    setTimeout(function () { d.classList.add("out"); }, 2200); setTimeout(function () { d.remove(); }, 2600);
  }

  /* ---------- Android: Zurück-Taste ---------- */
  if (App) App.addListener("backButton", function (ev) {
    var open = document.querySelector(".fxpm-bg, .ls-pickbg, .pxpop, .fxn-sheet, [role=dialog][aria-modal=true]");
    if (open) { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); var bg = document.querySelector(".fxpm-bg, .ls-pickbg"); if (bg) bg.click(); return; }
    var back = document.querySelector(".skip.back, .topbar button[aria-label^='Zur'], .topbar .back");
    if (back) { back.click(); return; }
    if (ev && ev.canGoBack) history.back(); else App.minimizeApp();
  });

  /* ---------- Live beitreten: Deep Links, QR-Scan, Code ---------- */
  function joinLive(code) {
    code = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (code.length < 4) return alertLite("Der Code ist nicht gültig.");
    try { sessionStorage.setItem("fp-live", code); } catch (e) {}
    location.replace(location.pathname);
  }
  function codeFrom(s) {
    s = String(s || "");
    var m = s.match(/[?&#]live=([A-Za-z0-9]+)/) || s.match(/live\/([A-Za-z0-9]+)/i);
    return m ? m[1] : /^[A-Za-z0-9]{4,6}$/.test(s.trim()) ? s.trim() : "";
  }
  if (App) App.addListener("appUrlOpen", function (e) { var c = codeFrom(e && e.url); if (c) joinLive(c); });
  function liveSheet() {
    var bg = document.createElement("div"); bg.className = "fxpm-bg sheet ls-pickbg";
    if (window.innerWidth > 640) { bg.classList.remove("sheet"); bg.classList.add("ls-center"); }
    bg.innerHTML = '<div class="fxpm ls-pick fpn-live" role="dialog" aria-label="Live beitreten"><div class="ls-pick-h"><b>Live im Unterricht</b><small>Scanne den QR-Code an der Leinwand oder gib den Code ein. Du antwortest anonym.</small></div>' +
      (Scan ? '<button type="button" class="btn fpn-scan" data-a="scan">QR-Code scannen</button>' : "") +
      '<form class="fpn-code"><input class="input" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="Code, z. B. K7M2Q" aria-label="Live-Code"><button class="btn ghost" type="submit">Beitreten</button></form></div>';
    document.body.appendChild(bg);
    function close() { bg.remove(); }
    bg.addEventListener("click", function (e) {
      if (e.target === bg) return close();
      if (e.target.closest("[data-a=scan]")) {
        Scan.scanBarcode({ hint: 0, scanInstructions: "QR-Code an der Leinwand ins Bild halten", scanButton: false, cameraDirection: 1 })
          .then(function (r) { var c = codeFrom(r && (r.ScanResult || r.scanResult)); close(); if (c) joinLive(c); else alertLite("Das ist kein Fallpfad-Live-Code."); }, function () {});
      }
    });
    bg.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); var v = bg.querySelector("input").value; close(); joinLive(v); });
  }
  window.FP_NATIVE.live = liveSheet;
  function placeLive() {
    var tb = document.querySelector(".topbar"); if (!tb || tb.querySelector(".fpn-livebtn")) return;
    var search = tb.querySelector('.iconbtn[aria-label="Suche öffnen"]'); if (!search) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "iconbtn fpn-livebtn"; b.setAttribute("aria-label", "Live beitreten");
    b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2"/></svg>';
    b.addEventListener("click", liveSheet);
    search.parentNode.insertBefore(b, search);
  }

  /* ---------- Lokale Erinnerungen ---------- */
  function idOf(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return 100000 + Math.abs(x % 800000); }
  function remindAssignments() {
    if (!LN || !window.FP_SBC || window.FP_DEMO_ACC) return;
    var sb = null;
    Promise.resolve().then(function () { return window.FP_SBC(); }).then(function (c) { sb = c; return sb && sb.from ? LN.checkPermissions() : { display: "no" }; }).then(function (p) { if (p.display !== "granted") return;
      return sb.from("assignments").select("id,title,due_at").gt("due_at", new Date().toISOString()).limit(40).then(function (r) {
        var rows = (r && r.data) || [];
        return LN.getPending().then(function (pend) {
          var old = (pend.notifications || []).filter(function (n) { return n.extra && n.extra.k === "abgabe"; }).map(function (n) { return { id: n.id }; });
          var next = rows.map(function (a) {
            var due = new Date(a.due_at), at = new Date(due.getTime() - 864e5); at.setHours(17, 0, 0, 0);
            if (at < new Date()) return null;
            return { id: idOf(a.id), title: "Abgabe morgen", body: String(a.title || "Aufgabe").slice(0, 90), schedule: { at: at, allowWhileIdle: true }, extra: { k: "abgabe" } };
          }).filter(Boolean);
          return (old.length ? LN.cancel({ notifications: old }) : Promise.resolve()).then(function () { if (next.length) return LN.schedule({ notifications: next }); });
        });
      }, function () {});
    }).catch(function () {});
  }
  function setDaily(on, hh, mm) {
    if (!LN) return Promise.resolve(false);
    return LN.cancel({ notifications: [{ id: 42 }] }).catch(function () {}).then(function () {
      if (!on) { try { localStorage.removeItem("fp-remind"); } catch (e) {} return false; }
      return LN.requestPermissions().then(function (p) {
        if (p.display !== "granted") { alertLite("Mitteilungen sind in den Einstellungen deines Geräts ausgeschaltet."); return false; }
        try { localStorage.setItem("fp-remind", hh + ":" + mm); } catch (e) {}
        return LN.schedule({ notifications: [{ id: 42, title: "Zehn Minuten Fallpfad?", body: "Ein paar Lernkarten am Tag bringen mehr als ein langer Abend vor der Prüfung.", schedule: { on: { hour: hh, minute: mm }, allowWhileIdle: true }, extra: { k: "lernen" } }] }).then(function () { remindAssignments(); return true; });
      });
    });
  }
  window.FP_NATIVE.reminder = {
    get: function () { try { return localStorage.getItem("fp-remind") || ""; } catch (e) { return ""; } },
    set: setDaily
  };
  if (LN) LN.addListener("localNotificationActionPerformed", function (a) {
    var k = a && a.notification && a.notification.extra && a.notification.extra.k;
    var p = window.FP_PROF || {};
    if (k === "abgabe" && p.go) p.go("aufgaben"); else if (k === "lernen" && p.go) p.go("training");
  });

  ready(function () {
    bar();
    var shown = false, q = 0;
    new MutationObserver(function () {
      if (q) return; q = 1;
      requestAnimationFrame(function () {
        q = 0; placeLive();
        if (!shown && document.querySelector(".shell, .auth, main, form")) { shown = true; if (Splash) setTimeout(function () { Splash.hide({ fadeOutDuration: 250 }); }, 150); bar(); setTimeout(remindAssignments, 4000); }
      });
    }).observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { if (!shown && Splash) Splash.hide(); }, 4000);
    if (App) App.addListener("resume", function () { remindAssignments(); });
  });
})();
