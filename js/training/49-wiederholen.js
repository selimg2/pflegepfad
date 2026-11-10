/* Schüler-App: Wiederholen (Karteikasten) und Schwächen-Ansicht.
   Falsch oder unvollständig beantwortete Aufgaben aus allen Modulen kommen in einen Karteikasten
   und werden nach Abständen wiederholt (1 / 3 / 7 / 30 / 90 Tage – Spaced Repetition).
   Die Schwächen-Ansicht zeigt die wackeligsten Themen nach den eigenen Antworten.
   Alles läuft lokal aus dem vorhandenen Lernstand (localStorage), nichts wird übertragen. */
(function () {
  var IVL = [1, 3, 7, 30, 90], MAX_RUNDE = 20;

  /* ---------- Lernstand finden (Konto mit der jüngsten Aktivität) ---------- */
  function stateKey() {
    var best = null, bestD = "";
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf("fallpfad-state:") !== 0) continue;
      try {
        var st = JSON.parse(localStorage.getItem(k)), d = st && st.act ? Object.keys(st.act).sort().pop() || "" : "";
        if (!best || d >= bestD) { best = k; bestD = d; }
      } catch (e) {}
    }
    return best;
  }
  function state() { try { return JSON.parse(localStorage.getItem(stateKey())) || null; } catch (e) { return null; } }
  function srKey() { return "fp-sr:" + (stateKey() || "lokal").slice(15); }
  function srGet() { try { return JSON.parse(localStorage.getItem(srKey())) || {}; } catch (e) { return {}; } }
  function srSet(v) { try { localStorage.setItem(srKey(), JSON.stringify(v)); } catch (e) {} }
  function heute() { return new Date().toISOString().slice(0, 10); }
  function plus(tage) { return new Date(Date.now() + tage * 864e5).toISOString().slice(0, 10); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  /* ---------- Karten aus falschen Antworten bauen ---------- */
  function karten() {
    var st = state(), mods = (window.FP_DATA && window.FP_DATA.mods) || [];
    if (!st || !st.res) return [];
    var out = [];
    mods.forEach(function (m) {
      (m.chapters || []).forEach(function (ch) {
        (ch.blocks || []).forEach(function (b) {
          if (b.type === "task" && b.kind === "choice" && b.id && b.options) {
            var r = st.res[m.id + "." + b.id];
            if (r && r.m > 0 && r.e < r.m) out.push({
              key: m.id + "." + b.id, fm: m.id, mod: m.navTitle || m.title, kap: ch.title,
              q: b.question, opts: b.options.map(function (o) { return { t: o.text, ok: !!o.correct, fb: o.feedback || "" }; })
            });
          }
          if (b.type === "quiz" && b.id && b.questions) {
            var rq = st.res[m.id + "." + b.id];
            if (rq && rq.m > 0 && rq.e < rq.m) b.questions.forEach(function (f, qi) {
              out.push({
                key: m.id + "." + b.id + ":" + qi, fm: m.id, mod: m.navTitle || m.title, kap: ch.title,
                q: f.q, opts: (f.o || []).map(function (o, oi) { return { t: o, ok: oi === f.a, fb: oi === f.a ? (f.e || "") : "" }; })
              });
            });
          }
        });
      });
    });
    return out;
  }
  function faellig(alle, sr) {
    var h = heute();
    return alle.filter(function (c) { var e = sr[c.key]; return !e || e.d <= h; });
  }

  /* ---------- Schwächen je Modul ---------- */
  function schwaechen() {
    var st = state(), mods = (window.FP_DATA && window.FP_DATA.mods) || [];
    if (!st || !st.res) return [];
    var agg = {};
    Object.keys(st.res).forEach(function (k) {
      var r = st.res[k], fm = k.split(".")[0];
      if (!r || !r.m) return;
      (agg[fm] = agg[fm] || { e: 0, m: 0 }).e += r.e; agg[fm].m += r.m;
    });
    return Object.keys(agg).map(function (fm) {
      var a = agg[fm], mod = null;
      for (var i = 0; i < mods.length; i++) if (mods[i].id === fm) mod = mods[i];
      return { fm: fm, name: mod ? (mod.navTitle || mod.title) : fm, pct: Math.round(100 * a.e / a.m), m: a.m };
    }).filter(function (x) { return x.m >= 6 && x.pct < 80; }).sort(function (a, b) { return a.pct - b.pct; }).slice(0, 3);
  }

  /* ---------- Übungs-Oberfläche ---------- */
  var CSS = ".fpw-card{margin:14px 0 4px;border-radius:16px;padding:14px 16px;background:var(--surface,#fff);box-shadow:var(--elev-1,0 1px 2px rgba(15,23,42,.06),0 0 0 1px rgba(15,23,42,.05))}" +
    ".fpw-row{display:flex;align-items:center;gap:12px}.fpw-row b{display:block;font-size:15.5px}.fpw-row small{color:var(--muted,#64748b);font-size:13px}" +
    ".fpw-n{min-width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-size:19px;font-weight:700;background:color-mix(in srgb,var(--accent,#0062FF) 11%,transparent);color:var(--accent,#0062FF)}" +
    ".fpw-b{font:inherit;font-size:13.5px;font-weight:600;border:0;border-radius:10px;padding:9px 13px;cursor:pointer;background:var(--accent,#0062FF);color:#fff;margin-left:auto}" +
    ".fpw-b[disabled]{opacity:.5;cursor:default}" +
    ".fpw-sw{margin-top:10px;border-top:1px solid var(--line,#e2e8f0);padding-top:10px}" +
    ".fpw-sw>small{color:var(--muted,#64748b);font-weight:600;font-size:12.5px}" +
    ".fpw-sw-r{display:flex;align-items:center;gap:10px;padding:7px 0}" +
    ".fpw-sw-r b{flex:1;font-size:13.5px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".fpw-pct{font-size:12.5px;font-weight:700;color:#EA580C}.fpw-sw-r .fpw-b{padding:6px 11px;font-size:12.5px;background:color-mix(in srgb,var(--accent,#0062FF) 10%,transparent);color:var(--accent,#0062FF)}" +
    ".fpw-ov{position:fixed;inset:0;background:var(--bg,#f5f7fa);z-index:240;overflow:auto;padding:max(16px,env(safe-area-inset-top)) 16px 32px}" +
    ".fpw-m{max-width:620px;margin:0 auto}" +
    ".fpw-top{display:flex;align-items:center;gap:10px;margin:6px 0 14px}.fpw-top b{font-size:17px}.fpw-top small{color:var(--muted,#64748b)}" +
    ".fpw-x{margin-left:auto;border:0;background:var(--surface,#fff);color:var(--fg,#0f172a);width:36px;height:36px;border-radius:12px;font-size:20px;cursor:pointer;box-shadow:var(--elev-1,0 1px 2px rgba(15,23,42,.08))}" +
    ".fpw-bar{height:5px;border-radius:3px;background:color-mix(in srgb,var(--fg,#0f172a) 8%,transparent);margin:0 0 16px;overflow:hidden}.fpw-bar i{display:block;height:100%;background:var(--accent,#0062FF);transition:width .25s}" +
    ".fpw-q{background:var(--surface,#fff);border-radius:18px;padding:18px;box-shadow:var(--elev-1,0 1px 2px rgba(15,23,42,.06),0 0 0 1px rgba(15,23,42,.05))}" +
    ".fpw-q>small{display:block;color:var(--muted,#64748b);font-size:12.5px;margin-bottom:6px}" +
    ".fpw-q h3{margin:0 0 14px;font-size:16.5px;line-height:1.45}" +
    ".fpw-o{display:block;width:100%;text-align:left;font:inherit;font-size:14.5px;line-height:1.45;padding:12px 14px;margin:0 0 8px;border-radius:13px;border:1.5px solid var(--line,#e2e8f0);background:var(--surface,#fff);color:var(--fg,#0f172a);cursor:pointer}" +
    ".fpw-o.ok{border-color:#10B981;background:color-mix(in srgb,#10B981 10%,var(--surface,#fff))}" +
    ".fpw-o.falsch{border-color:#EF4444;background:color-mix(in srgb,#EF4444 8%,var(--surface,#fff))}" +
    ".fpw-fb{margin:10px 0 0;padding:12px 14px;border-radius:13px;font-size:13.5px;line-height:1.5;background:color-mix(in srgb,var(--accent,#0062FF) 8%,var(--surface,#fff))}" +
    ".fpw-fb b{display:block;margin-bottom:2px}" +
    ".fpw-weiter{display:block;width:100%;font:inherit;font-weight:650;font-size:15px;border:0;border-radius:14px;padding:13px;margin-top:14px;background:var(--accent,#0062FF);color:#fff;cursor:pointer}" +
    ".fpw-ende{text-align:center;padding:30px 16px}.fpw-ende b{font-size:22px;display:block;margin-bottom:6px}.fpw-ende p{color:var(--muted,#64748b);margin:0 0 18px}";

  function mische(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function trainer(deck, titel) {
    var ov = document.createElement("div"); ov.className = "fpw-ov";
    var m = document.createElement("div"); m.className = "fpw-m"; ov.appendChild(m);
    var queue = mische(deck).slice(0, MAX_RUNDE), i = 0, richtig = 0;
    function close() { ov.remove(); document.removeEventListener("keydown", esck); refreshCard(); }
    function esck(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", esck);
    function kopf() {
      return '<div class="fpw-top"><b>' + esc(titel) + '</b><small>' + Math.min(i + 1, queue.length) + " / " + queue.length + '</small><button type="button" class="fpw-x" aria-label="Schließen">×</button></div>' +
        '<div class="fpw-bar"><i style="width:' + Math.round(100 * i / queue.length) + '%"></i></div>';
    }
    function frage() {
      if (i >= queue.length) { return ende(); }
      var c = queue[i], opts = mische(c.opts);
      m.innerHTML = kopf() + '<div class="fpw-q"><small>' + esc(c.mod) + " · " + esc(c.kap) + "</small><h3>" + esc(c.q) + "</h3>" +
        opts.map(function (o, k) { return '<button type="button" class="fpw-o" data-k="' + k + '">' + esc(o.t) + "</button>"; }).join("") + "</div>";
      m.querySelector(".fpw-x").addEventListener("click", close);
      m.querySelectorAll(".fpw-o").forEach(function (b) {
        b.addEventListener("click", function () {
          var o = opts[+b.dataset.k], ok = o.ok;
          var sr = srGet(), e = sr[c.key] || { i: 0 };
          if (ok) { richtig++; e.i = Math.min((e.i || 0) + 1, IVL.length - 1); e.d = plus(IVL[e.i]); }
          else { e.i = 0; e.d = plus(1); }
          sr[c.key] = e; srSet(sr);
          m.querySelectorAll(".fpw-o").forEach(function (x, xi) {
            x.disabled = true;
            if (opts[xi].ok) x.classList.add("ok");
            else if (x === b) x.classList.add("falsch");
          });
          var fb = ok ? (o.fb || "Richtig.") : (c.opts.filter(function (x) { return x.ok; })[0] || {}).fb || "";
          var div = document.createElement("div"); div.className = "fpw-fb";
          div.innerHTML = "<b>" + (ok ? "Richtig – kommt in " + IVL[sr[c.key].i] + (IVL[sr[c.key].i] === 1 ? " Tag" : " Tagen") + " wieder." : "Nicht ganz – kommt morgen wieder.") + "</b>" + esc(fb);
          m.querySelector(".fpw-q").appendChild(div);
          var w = document.createElement("button"); w.type = "button"; w.className = "fpw-weiter"; w.textContent = i + 1 >= queue.length ? "Fertig" : "Weiter";
          w.addEventListener("click", function () { i++; frage(); });
          m.querySelector(".fpw-q").appendChild(w);
          w.focus();
        });
      });
    }
    function ende() {
      m.innerHTML = kopf().replace(/width:\d+%/, "width:100%") +
        '<div class="fpw-q fpw-ende"><b>' + richtig + " von " + queue.length + " richtig</b><p>" +
        (richtig === queue.length ? "Stark. Was sitzt, kommt in größeren Abständen wieder." : "Was nicht saß, kommt morgen noch einmal – so bleibt es hängen.") +
        '</p><button type="button" class="fpw-weiter" style="max-width:280px;margin:0 auto">Schließen</button></div>';
      m.querySelector(".fpw-x").addEventListener("click", close);
      m.querySelector(".fpw-weiter").addEventListener("click", close);
    }
    frage();
    document.body.appendChild(ov);
  }

  /* ---------- Karte auf der Startseite ---------- */
  function bau() {
    var d = document.createElement("div");
    d.id = "fpw-home"; d.className = "fpw-card";
    fuelle(d);
    return d;
  }
  function fuelle(d) {
    var alle = karten(), sr = srGet(), due = faellig(alle, sr), sw = schwaechen();
    if (!alle.length && !sw.length) {
      d.innerHTML = '<div class="fpw-row"><div class="fpw-n">✓</div><div><b>Karteikasten</b><small>Noch nichts zu wiederholen – falsch beantwortete Fragen landen automatisch hier.</small></div></div>';
      return;
    }
    d.innerHTML = '<div class="fpw-row"><div class="fpw-n">' + due.length + '</div><div style="flex:1;min-width:0"><b>Wiederholen</b><small>' +
      (due.length ? due.length + (due.length === 1 ? " Karte ist" : " Karten sind") + " heute fällig · aus deinen falschen Antworten" : "Alles wiederholt – " + alle.length + " Karten im Kasten") +
      '</small></div><button type="button" class="fpw-b" data-a="start"' + (due.length ? "" : " disabled") + ">Üben</button></div>" +
      (sw.length ? '<div class="fpw-sw"><small>Deine wackeligsten Themen</small>' + sw.map(function (s, i) {
        return '<div class="fpw-sw-r"><b>' + esc(s.name) + '</b><span class="fpw-pct">' + s.pct + ' %</span><button type="button" class="fpw-b" data-fm="' + s.fm + '">Üben</button></div>';
      }).join("") + "</div>" : "");
    var st = d.querySelector('[data-a="start"]');
    if (st) st.addEventListener("click", function () { var dq = faellig(karten(), srGet()); if (dq.length) trainer(dq, "Wiederholen"); });
    d.querySelectorAll("[data-fm]").forEach(function (b) {
      b.addEventListener("click", function () {
        var deck = karten().filter(function (c) { return c.fm === b.dataset.fm; });
        if (deck.length) trainer(deck, "Schwerpunkt üben");
        else fuelle(d);
      });
    });
  }
  function refreshCard() { var d = document.getElementById("fpw-home"); if (d) fuelle(d); }

  function mount() {
    var hello = document.querySelector("main .hello");
    var hero = document.querySelector(".trgrid, .trsec, .fx-qa");
    var old = document.getElementById("fpw-home");
    if (!hello || !hero) { if (old) old.remove(); return; }
    var anker = document.getElementById("fpx-exam") || hello;
    if (old && old.isConnected && old.parentNode === anker.parentNode) return;
    if (old) old.remove();
    anker.parentNode.insertBefore(bau(), anker.nextSibling);
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
