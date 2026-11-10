/* Fallpfad: QR-Code scannen (Knopf links neben der Suche).
   - Kamera nur nach Tippen, nur solange das Fenster offen ist; kein Bild verlässt das Gerät.
   - Erkennung mit BarcodeDetector (wo vorhanden), sonst mit jsQR aus vendor/ (wird erst beim ersten Scan geladen).
   - Fallpfad-Links (Live-Unterricht, Kurs, Modul, Team-Krankenhaus, Praxisanleitung) öffnen sich direkt in der App,
     ein Live-Code (z. B. „K7QX2“) kann auch von Hand eingegeben werden. Fremde Links werden erst nach Bestätigung geöffnet. */
(function () {
  var ICO = {
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 18.5V20h1.5M18.5 14H20v1.5M7 7h.01M17 7h.01M7 17h.01"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    flash: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    kb: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7 14h10"/>'
  };
  function ic(k, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[k] + "</svg>"; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var CSS = [
    ".qr-bg{position:fixed;inset:0;z-index:10060;background:rgba(0,0,0,.72);display:grid;place-items:center;animation:fxfade .2s ease both;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}",
    ".qr{width:min(440px,calc(100vw - 32px));background:var(--surface,#fff);color:var(--fg,#111);border-radius:24px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);display:flex;flex-direction:column}",
    ".qr-h{display:flex;align-items:center;gap:12px;padding:14px 14px 12px 18px}",
    ".qr-h b{flex:1;font-size:17px;letter-spacing:-.01em}.qr-h small{display:block;font-weight:400;color:var(--muted,#6b7280);font-size:13px;margin-top:2px}",
    ".qr-x{width:36px;height:36px;border-radius:50%;border:0;background:var(--surface2,#f2f2f7);color:var(--fg);display:grid;place-items:center;cursor:pointer;flex:0 0 36px}",
    ".qr-cam{position:relative;aspect-ratio:1/1;background:#000;overflow:hidden}",
    ".qr-cam video{width:100%;height:100%;object-fit:cover;display:block}",
    ".qr-frame{position:absolute;inset:16%;border-radius:22px;box-shadow:0 0 0 999px rgba(0,0,0,.38);pointer-events:none}",
    ".qr-frame i{position:absolute;width:34px;height:34px;border:4px solid #fff;border-radius:4px}",
    ".qr-frame i:nth-child(1){top:-2px;left:-2px;border-right:0;border-bottom:0;border-top-left-radius:20px}.qr-frame i:nth-child(2){top:-2px;right:-2px;border-left:0;border-bottom:0;border-top-right-radius:20px}",
    ".qr-frame i:nth-child(3){bottom:-2px;left:-2px;border-right:0;border-top:0;border-bottom-left-radius:20px}.qr-frame i:nth-child(4){bottom:-2px;right:-2px;border-left:0;border-top:0;border-bottom-right-radius:20px}",
    ".qr-scan{position:absolute;left:18%;right:18%;height:2px;top:20%;background:linear-gradient(90deg,transparent,var(--accent,#0062FF),transparent);box-shadow:0 0 12px var(--accent,#0062FF);animation:qrscan 2.2s ease-in-out infinite alternate}",
    "@keyframes qrscan{to{top:80%}}@media (prefers-reduced-motion:reduce){.qr-scan{animation:none;top:50%}}",
    ".qr-cam.hit .qr-frame i{border-color:#34C759}",
    ".qr-msg{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:28px;color:#fff;font-size:15px;line-height:1.5;background:rgba(0,0,0,.55)}",
    ".qr-torch{position:absolute;right:12px;bottom:12px;width:42px;height:42px;border-radius:50%;border:0;background:rgba(0,0,0,.5);color:#fff;display:grid;place-items:center;cursor:pointer}",
    ".qr-torch[aria-pressed=true]{background:#fff;color:#111}",
    ".qr-b{padding:14px 16px 18px;display:flex;flex-direction:column;gap:10px}",
    ".qr-hint{margin:0;color:var(--muted,#6b7280);font-size:13.5px;line-height:1.45}",
    ".qr-code{display:flex;gap:8px}.qr-code input{flex:1;min-width:0;height:44px;border-radius:12px;border:1px solid var(--line,#e5e7eb);background:var(--surface2,#f6f7f9);color:var(--fg);padding:0 14px;font:inherit;font-size:17px;letter-spacing:.12em;text-transform:uppercase}",
    ".qr-res{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:14px;background:var(--surface2,#f2f2f7)}",
    ".qr-res .qr-ri{width:36px;height:36px;border-radius:10px;background:var(--accent,#0062FF);color:#fff;display:grid;place-items:center;flex:0 0 36px}",
    ".qr-res b{display:block;font-size:15px}.qr-res span{display:block;color:var(--muted);font-size:13.5px;word-break:break-all;margin-top:2px}",
    ".qr-row{display:flex;gap:8px;flex-wrap:wrap}.qr-row .btn{flex:1}",
    "@media (max-width:560px){.qr-bg{place-items:end stretch}.qr{width:100%;border-radius:24px 24px 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}",
    ".iconbtn.fp-qrbtn svg{width:22px;height:22px}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "fp-qr-css"; st.textContent = CSS; (document.head || document.documentElement).appendChild(st);

  var lib = null;
  function loadJsQR() {
    if (window.jsQR) return Promise.resolve(window.jsQR);
    if (lib) return lib;
    lib = new Promise(function (ok, no) {
      var s = document.createElement("script"); s.src = "vendor/jsqr.min.js"; s.async = true;
      s.onload = function () { window.jsQR ? ok(window.jsQR) : no(new Error("QR-Erkennung nicht verfügbar")); };
      s.onerror = function () { lib = null; no(new Error("QR-Erkennung konnte nicht geladen werden.")); };
      document.head.appendChild(s);
    });
    return lib;
  }

  /* Was bedeutet der gescannte Inhalt? */
  var APP_HOSTS = ["pflegepfad.vercel.app"];
  function deuten(raw) {
    var t = String(raw || "").trim();
    if (/^[A-Za-z0-9]{4,8}$/.test(t)) return { art: "live", code: t.toUpperCase() };
    var u = null; try { u = new URL(t); } catch (e) {}
    if (u && /^https?:$/.test(u.protocol)) {
      var cfg = window.FALLPFAD_CONFIG || {}, hosts = APP_HOSTS.concat([location.host]);
      try { if (cfg.webUrl) hosts.push(new URL(cfg.webUrl).host); } catch (e) {}
      var params = u.search + u.hash;
      if (hosts.indexOf(u.host) >= 0 && /[?&#](live|kurs|modul|station|team|bestaetigen|pa)=/.test(params)) return { art: "app", url: location.origin + location.pathname + u.search + u.hash, u: u };
      if (hosts.indexOf(u.host) >= 0) return { art: "app", url: location.origin + location.pathname, u: u };
      return { art: "extern", url: u.href, host: u.host };
    }
    return { art: "text", text: t };
  }
  function beschreibung(d) {
    if (d.art === "live") return ["Live-Unterricht", "Code " + d.code];
    if (d.art === "app") {
      var q = d.u.searchParams, hq = new URLSearchParams((d.u.hash || "").replace(/^#/, ""));
      var g = function (k) { return q.get(k) || hq.get(k); };
      if (g("live")) return ["Live-Unterricht", "Du trittst mit Code " + g("live").toUpperCase() + " bei"];
      if (g("kurs")) return ["Kurs beitreten", "Fallpfad öffnet die Kurswahl"];
      if (g("modul")) { var m = (window.FP_DATA && window.FP_DATA.mods || []).filter(function (x) { return x.id === g("modul"); })[0]; return ["Lernmodul öffnen", m ? m.title.replace(/^Fallmodul \d+ · /, "") + (g("station") ? " · Station " + g("station") : "") : "Modul " + g("modul")]; }
      if (g("team")) return ["Team-Krankenhaus", "Gruppenraum öffnen"];
      if (g("bestaetigen") || g("pa")) return ["Praxisanleitung", "Bestätigung öffnen"];
      return ["Fallpfad", "Startseite öffnen"];
    }
    if (d.art === "extern") return ["Link zu einer anderen Website", d.host];
    return ["Text erkannt", d.text.slice(0, 300)];
  }

  var cur = null;
  function close() {
    if (!cur) return;
    var c = cur; cur = null;
    c.stop = true;
    try { if (c.stream) c.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    c.bg.remove();
    document.removeEventListener("keydown", c.key);
    if (c.prevFocus && c.prevFocus.focus) try { c.prevFocus.focus(); } catch (e) {}
  }

  function open() {
    if (cur) return;
    var bg = document.createElement("div");
    bg.className = "qr-bg";
    bg.innerHTML =
      '<div class="qr" role="dialog" aria-modal="true" aria-labelledby="qr-t">' +
      '<div class="qr-h"><b id="qr-t">QR-Code scannen<small>Live-Unterricht, Kurs, Modul oder Praxisanleitung</small></b><button type="button" class="qr-x" aria-label="Schließen">' + ic("x", 18) + "</button></div>" +
      '<div class="qr-cam"><video playsinline muted autoplay></video><div class="qr-frame"><i></i><i></i><i></i><i></i></div><div class="qr-scan"></div>' +
      '<div class="qr-msg">Kamera wird gestartet …</div><button type="button" class="qr-torch" aria-label="Taschenlampe" aria-pressed="false" hidden>' + ic("flash", 20) + "</button></div>" +
      '<div class="qr-b"><p class="qr-hint">Halte den Code in den Rahmen. Das Kamerabild bleibt auf deinem Gerät.</p>' +
      '<form class="qr-code"><input aria-label="Live-Code eingeben" placeholder="Live-Code eingeben" maxlength="8" autocomplete="off" autocapitalize="characters" spellcheck="false"><button class="btn" type="submit">Beitreten</button></form>' +
      '<div class="qr-out" aria-live="polite"></div></div></div>';
    document.body.appendChild(bg);
    var c = cur = { bg: bg, stop: false, prevFocus: document.activeElement };
    var video = bg.querySelector("video"), msg = bg.querySelector(".qr-msg"), cam = bg.querySelector(".qr-cam"), out = bg.querySelector(".qr-out"), torch = bg.querySelector(".qr-torch");
    bg.querySelector(".qr-x").addEventListener("click", close);
    bg.addEventListener("click", function (e) { if (e.target === bg) close(); });
    c.key = function (e) { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", c.key);
    bg.querySelector(".qr-x").focus();
    bg.querySelector(".qr-code").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = bg.querySelector(".qr-code input").value.replace(/[^A-Za-z0-9]/g, "");
      if (v.length < 4) { bg.querySelector(".qr-code input").focus(); return; }
      zeige(deuten(v), true);
    });

    function zeige(d, sofort) {
      var b = beschreibung(d);
      if ((d.art === "live" || d.art === "app") && sofort) return weiter(d);
      cam.classList.add("hit");
      c.stop = true;
      var btns = d.art === "live" || d.art === "app" ? '<button type="button" class="btn" data-a="go">Öffnen</button>'
        : d.art === "extern" ? '<button type="button" class="btn ghost" data-a="again">Weiter scannen</button><button type="button" class="btn" data-a="ext">Link öffnen</button>'
        : '<button type="button" class="btn ghost" data-a="again">Weiter scannen</button><button type="button" class="btn" data-a="copy">Kopieren</button>';
      out.innerHTML = '<div class="qr-res"><span class="qr-ri">' + ic(d.art === "text" ? "copy" : "link", 18) + "</span><div><b>" + esc(b[0]) + "</b><span>" + esc(b[1]) + "</span></div></div>" + '<div class="qr-row" style="margin-top:10px">' + btns + "</div>";
      out.querySelectorAll("[data-a]").forEach(function (x) {
        x.addEventListener("click", function () {
          var a = x.getAttribute("data-a");
          if (a === "go") weiter(d);
          else if (a === "ext") { window.open(d.url, "_blank", "noopener"); close(); }
          else if (a === "copy") { try { navigator.clipboard.writeText(d.text); x.textContent = "Kopiert"; } catch (e) {} }
          else { out.innerHTML = ""; cam.classList.remove("hit"); c.stop = false; loop(); }
        });
      });
      var f = out.querySelector(".btn:last-child"); if (f) f.focus();
    }
    function weiter(d) {
      var url = d.art === "live" ? location.origin + location.pathname + "?live=" + encodeURIComponent(d.code) : d.url;
      close();
      try { sessionStorage.setItem("fp-qr-last", String(Date.now())); } catch (e) {}
      location.assign(url);
    }
    var detector = null, canvas = null, ctx = null, decode = null;
    function frame() {
      if (c.stop || cur !== c) return Promise.resolve(null);
      if (video.readyState < 2) return Promise.resolve(null);
      if (detector) return detector.detect(video).then(function (r) { return r && r[0] ? r[0].rawValue : null; }, function () { return null; });
      if (!decode) return Promise.resolve(null);
      var w = video.videoWidth, hh = video.videoHeight; if (!w || !hh) return Promise.resolve(null);
      var s = Math.min(1, 720 / Math.max(w, hh)); canvas.width = Math.round(w * s); canvas.height = Math.round(hh * s);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var r = decode(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
      return Promise.resolve(r ? r.data : null);
    }
    function loop() {
      if (c.stop || cur !== c) return;
      frame().then(function (v) {
        if (v && !c.stop) { if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {} var d = deuten(v); zeige(d, false); return; }
        setTimeout(function () { requestAnimationFrame(loop); }, detector ? 120 : 160);
      });
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      msg.textContent = "Dieses Gerät oder dieser Browser erlaubt hier keinen Kamerazugriff. Gib den Live-Code unten ein.";
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false }).then(function (stream) {
      if (cur !== c) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
      c.stream = stream; video.srcObject = stream;
      var p = video.play(); if (p && p.catch) p.catch(function () {});
      var track = stream.getVideoTracks()[0];
      try {
        var caps = track.getCapabilities ? track.getCapabilities() : {};
        if (caps.torch) { torch.hidden = false; torch.addEventListener("click", function () { var on = torch.getAttribute("aria-pressed") !== "true"; track.applyConstraints({ advanced: [{ torch: on }] }).then(function () { torch.setAttribute("aria-pressed", on ? "true" : "false"); }, function () {}); }); }
      } catch (e) {}
      var useNative = "BarcodeDetector" in window && window.BarcodeDetector.getSupportedFormats;
      var ready = useNative ? window.BarcodeDetector.getSupportedFormats().then(function (f) { if (f.indexOf("qr_code") >= 0) detector = new window.BarcodeDetector({ formats: ["qr_code"] }); else throw 0; }) : Promise.reject(0);
      ready.catch(function () { return loadJsQR().then(function (j) { decode = j; canvas = document.createElement("canvas"); ctx = canvas.getContext("2d", { willReadFrequently: true }); }); })
        .then(function () { msg.remove(); loop(); }, function (e) { msg.textContent = (e && e.message) || "Die QR-Erkennung ist gerade nicht verfügbar. Gib den Live-Code unten ein."; });
    }, function (e) {
      msg.textContent = e && (e.name === "NotAllowedError" || e.name === "SecurityError")
        ? "Fallpfad darf die Kamera nicht nutzen. Erlaube den Kamerazugriff in den Einstellungen deines Browsers oder gib den Live-Code unten ein."
        : "Keine Kamera gefunden. Gib den Live-Code unten ein.";
    });
  }
  window.FP_QR = { open: open, close: close, deuten: deuten };
})();
