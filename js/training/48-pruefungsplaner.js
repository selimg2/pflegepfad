/* Schüler-App: Prüfungsplaner – Countdown bis zur Prüfung auf der Startseite.
   Der Prüfungstag wird lokal auf dem Gerät gespeichert (localStorage), nichts wird übertragen.
   Der Assistent kann daraus auf Wunsch einen Lernplan machen (Werkzeug „Prüfungsplan erstellen“). */
(function () {
  var KEY = "fp-exam";
  function lsGet() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function lsSet(v) { try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function tage(d) { var a = new Date(); a.setHours(0, 0, 0, 0); return Math.round((new Date(d + "T00:00:00") - a) / 864e5); }
  function fmt(d) { var p = d.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function minDate() { var d = new Date(Date.now() + 864e5); return d.toISOString().slice(0, 10); }

  /* Wochenziel: offene Module des eigenen Ausbildungsjahres, gleichmäßig auf die Wochen bis zur Prüfung verteilt */
  function lernstand() {
    var best=null,bestD="";
    for (var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("fallpfad-state:")!==0)continue;
      try{var st=JSON.parse(localStorage.getItem(k)),d=st&&st.act?Object.keys(st.act).sort().pop()||"":"";if(!best||d>=bestD){best=st;bestD=d;}}catch(e){}}
    return best;
  }
  function wochenziel(t) {
    var st = lernstand(), mods = (window.FP_DATA && window.FP_DATA.mods) || [];
    if (!st || t <= 0 || !mods.length) return "";
    var jahr = st.year || 1;
    var offen = mods.filter(function (m) {
      if (m.year !== jahr) return false;
      var e = 0, mx = 0;
      Object.keys(st.res || {}).forEach(function (k) { if (k.indexOf(m.id + ".") === 0) { e += st.res[k].e; mx += st.res[k].m; } });
      return !mx || e / mx < (m.passPercent || 70) / 100;
    }).sort(function (a, b) { return (a.seq || 0) - (b.seq || 0); });
    if (!offen.length) return "Alle Module deines Jahres sind geschafft – wiederholen lohnt trotzdem.";
    var wochen = Math.max(1, Math.ceil(t / 7)), proWoche = Math.max(1, Math.ceil(offen.length / wochen));
    var diese = offen.slice(0, Math.min(proWoche, 3)).map(function (m) { return (m.navTitle || m.title).replace(/^Fallmodul \d+ · /, "").split(":")[0]; });
    var mehr = proWoche > 3 ? " +" + (proWoche - 3) + " weitere" : "";
    return "Noch " + offen.length + (offen.length === 1 ? " offenes Modul" : " offene Module") + " · Pensum: " + proWoche + " pro Woche · als Nächstes: " + diese.join(", ") + mehr;
  }

  var CSS = ".fpx-card{margin:14px 0 4px;border-radius:16px;padding:14px 16px;background:var(--surface,#fff);box-shadow:var(--elev-1,0 1px 2px rgba(15,23,42,.06),0 0 0 1px rgba(15,23,42,.05))}" +
    ".fpx-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}" +
    ".fpx-n{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1;min-width:58px;text-align:center;color:var(--accent,#0062FF)}" +
    ".fpx-n small{display:block;font-size:12px;font-weight:600;color:var(--muted,#64748b);letter-spacing:0;margin-top:2px}" +
    ".fpx-t b{display:block;font-size:15.5px}.fpx-t small{color:var(--muted,#64748b);font-size:13px}" +
    ".fpx-b{font:inherit;font-size:13.5px;font-weight:600;border:0;border-radius:10px;padding:8px 12px;cursor:pointer;background:color-mix(in srgb,var(--accent,#0062FF) 10%,transparent);color:var(--accent,#0062FF)}" +
    ".fpx-b.q{background:none;color:var(--muted,#64748b)}" +
    ".fpx-form{display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-top:10px}" +
    ".fpx-form label{display:flex;flex-direction:column;gap:4px;font-size:12.5px;color:var(--muted,#64748b);font-weight:600}" +
    ".fpx-form input,.fpx-form select{font:inherit;font-size:14px;padding:8px 10px;border-radius:10px;border:1px solid var(--line,#e2e8f0);background:var(--surface,#fff);color:var(--fg,#0f172a)}" +
    ".fpx-spacer{flex:1}" +
    ".fpx-warn .fpx-n{color:#EA580C}";

  function card() {
    var d = document.createElement("div");
    d.id = "fpx-exam"; d.className = "fpx-card";
    render(d);
    return d;
  }
  function render(d) {
    var ex = lsGet();
    if (!ex) {
      d.innerHTML = '<div class="fpx-row"><div class="fpx-t" style="flex:1 1 220px"><b>Wann ist deine Prüfung?</b><small>Trag den Tag ein – die App zählt für dich mit. Bleibt auf diesem Gerät.</small></div><button type="button" class="fpx-b" data-a="neu">Prüfungstag eintragen</button></div>';
    } else {
      var t = tage(ex.datum);
      var txt = t > 1 ? "Noch <b>" + t + " Tage</b>" : t === 1 ? "<b>Morgen</b> ist es so weit" : t === 0 ? "<b>Heute</b> ist dein Tag" : "Die Prüfung war am " + fmt(ex.datum);
      var wochen = t > 13 ? " · gut " + Math.floor(t / 7) + " Wochen" : "";
      d.className = "fpx-card" + (t >= 0 && t <= 14 ? " fpx-warn" : "");
      d.innerHTML = '<div class="fpx-row">' +
        '<div class="fpx-n">' + (t >= 0 ? t : "✓") + "<small>" + (t >= 0 ? "Tage" : "vorbei") + "</small></div>" +
        '<div class="fpx-t" style="flex:1 1 220px"><b>' + (ex.art ? ex.art.charAt(0).toUpperCase() + ex.art.slice(1) + "e Prüfung" : "Prüfung") + " am " + fmt(ex.datum) + '</b><small>' + txt.replace(/<\/?b>/g, "") + wochen + (t > 0 && wochenziel(t) ? "<br>" + esc(wochenziel(t)) : t > 0 ? " · der Assistent macht dir daraus einen Lernplan" : "") + "</small></div>" +
        '<button type="button" class="fpx-b q" data-a="neu">Ändern</button>' +
        (t < 0 ? '<button type="button" class="fpx-b q" data-a="weg">Entfernen</button>' : "") +
        "</div>";
    }
    var form = d.querySelector(".fpx-form");
    d.querySelectorAll("[data-a]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.a === "weg") { lsSet(null); render(d); return; }
        if (d.querySelector(".fpx-form")) { d.querySelector(".fpx-form").remove(); return; }
        var ex2 = lsGet() || {};
        var f = document.createElement("form"); f.className = "fpx-form";
        f.innerHTML = '<label>Prüfungstag<input type="date" required min="' + minDate() + '" value="' + esc(ex2.datum || "") + '"></label>' +
          '<label>Art<select>' + ["praktisch", "schriftlich", "mündlich"].map(function (x) { return '<option value="' + x + '"' + (ex2.art === x ? " selected" : "") + ">" + x.charAt(0).toUpperCase() + x.slice(1) + "</option>"; }).join("") + "</select></label>" +
          '<button type="submit" class="fpx-b">Speichern</button>';
        f.addEventListener("submit", function (e) {
          e.preventDefault();
          var v = f.querySelector("input").value;
          if (!v) return;
          lsSet({ datum: v, art: f.querySelector("select").value });
          render(d);
        });
        d.appendChild(f);
        f.querySelector("input").focus();
      });
    });
  }

  function mount() {
    var hello = document.querySelector("main .hello");
    var hero = document.querySelector(".trgrid, .trsec, .fx-qa");
    var old = document.getElementById("fpx-exam");
    if (!hello || !hero) { if (old) old.remove(); return; }
    if (old && old.isConnected && old.parentNode === hello.parentNode) {
      if (old.dataset.day !== new Date().toDateString()) { old.dataset.day = new Date().toDateString(); if (!old.querySelector(".fpx-form")) render(old); }
      return;
    }
    if (old) old.remove();
    var d = card(); d.dataset.day = new Date().toDateString();
    hello.parentNode.insertBefore(d, hello.nextSibling);
  }

  function start() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var q = false;
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; mount(); }); })
      .observe(document.body, { childList: true, subtree: true });
    mount();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
