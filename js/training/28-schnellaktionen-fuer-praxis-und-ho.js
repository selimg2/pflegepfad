/* Schüler-App: Schnellaktionen für Praxis und Home. Nutzt die vorhandenen Knöpfe der App,
   damit alle Prüfungen, Formulare und Unterschriften genau wie bisher laufen. */
(function () {
  var X = window.FX, C = X.C;
  var I = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    cap: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3V11"/>',
    pen: '<path d="M4 20c2.5-.2 3.8-1.3 5-3.4M14.5 5.5l4 4L9 19l-5 1 1-5z"/>',
    pdf: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M9.5 13h5M9.5 16.5h5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    band: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M10.5 10.5h.01M13.5 13.5h.01M13.5 10.5h.01M10.5 13.5h.01"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    spark: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    kit: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5h6v2M12 11v5M9.5 13.5h5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[k] + "</svg>"; }
  function btnByText(re, root) {
    var list = (root || document).querySelectorAll("main button, main a");
    for (var i = 0; i < list.length; i++) if (re.test((list[i].textContent || "").trim())) return list[i];
    return null;
  }
  function waitFor(fn, ms) {
    return new Promise(function (res) {
      var t0 = Date.now();
      (function loop() {
        var r = fn();
        if (r || Date.now() - t0 > (ms || 2500)) return res(r);
        setTimeout(loop, 60);
      })();
    });
  }
  function goTab(name) {
    var t = Array.prototype.find.call(document.querySelectorAll(".tab"), function (x) {
      return x.offsetParent !== null && (x.textContent || "").replace(/\d+$/, "").trim() === name;
    });
    if (t) t.click();
    return t;
  }
  function curCard() {
    var cards = document.querySelectorAll(".nwcards > *");
    for (var i = 0; i < cards.length; i++) if (/läuft/.test(cards[i].textContent)) return cards[i];
    return null;
  }
  async function inEinsatz(label) {
    if (!document.querySelector(".nwcards")) { goTab("Praxis"); await waitFor(function () { return document.querySelector(".nwcards"); }); }
    var c = curCard();
    if (!c) { var add = btnByText(/^\+ Einsatz$|^Einsatz anlegen$/); if (add) add.click(); return; }
    c.click();
    /* Erst warten, bis die Einsatz-Ansicht da ist; sonst wird die Kachel auf der Übersicht erneut getroffen. */
    var b = await waitFor(function () { var d = document.querySelector(".nwdetail"); return d ? btnByText(label, d) : null; }, 4000);
    if (b) { b.click(); setTimeout(function () { var f = document.querySelector("[role=dialog], .modal"); if (!f && b.scrollIntoView) b.scrollIntoView({ block: "center", behavior: "smooth" }); }, 300); }
  }
  async function sign() {
    var b = btnByText(/^Jetzt bestätigen lassen$/);
    if (b) return b.click();
    await inEinsatz(/^Alle bestätigen lassen$/);
  }
  function row(id, title, items) {
    var d = document.createElement("div");
    d.className = "fx-qa";
    d.id = id;
    d.innerHTML = (title ? "<h3>" + title + "</h3>" : "") + items.map(function (x, i) {
      return '<button type="button" class="fx-t" data-i="' + i + '" style="--c:' + x.c + '"><span class="fx-row"><span class="fx-ic">' + svg(x.ic) + "</span>" + (x.n ? '<span class="fx-n">' + x.n + "</span>" : "") + "</span><b>" + x.t + "</b><small>" + x.s + "</small></button>";
    }).join("");
    d.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); items[Number(b.dataset.i)].go(); });
    });
    return d;
  }
  function sig(items) { return items.map(function (x) { return x.t + (x.n || ""); }).join("|"); }
  function place(id, anchor, items, title, before) {
    var old = document.getElementById(id), s = sig(items);
    if (old && old.dataset.sig === s && old.isConnected && (before ? old.nextElementSibling === anchor : old.previousElementSibling === anchor)) return;
    if (old) old.remove();
    var d = row(id, title, items);
    d.dataset.sig = s;
    if (before) anchor.parentNode.insertBefore(d, anchor); else anchor.parentNode.insertBefore(d, anchor.nextSibling);
  }
  function praxis() {
    var top = document.querySelector(".nwtop");
    if (!top || document.querySelector(".nwback")) { var o = document.getElementById("fx-qa-praxis"); if (o && !top) o.remove(); return; }
    var cur = curCard();
    var offen = /(\d+)\s+Einträge? warte/.exec(top.textContent || ""), n = offen ? offen[1] : "";
    var items = cur ? [
      { t: "Arbeitstag eintragen", s: "Dienst von heute oder gestern", c: C.blue, ic: "clock", go: function () { inEinsatz(/Arbeitstag/); } },
      { t: "Praxisanleitung eintragen", s: "Thema und Stunden der Anleitung", c: C.violet, ic: "cap", go: function () { inEinsatz(/Praxisanleitung/); } },
      { t: "Unterschrift holen", s: n ? n + " Einträge offen" : "Alles ist bestätigt", c: C.green, ic: "pen", n: n, go: sign },
      { t: "Gespräch festhalten", s: "Erst-, Zwischen- oder Abschlussgespräch", c: C.teal, ic: "chat", go: function () { inEinsatz(/Gespräch/); } },
      { t: "Fehlzeit melden", s: "Krank oder abwesend", c: C.amber, ic: "band", go: function () { inEinsatz(/Fehlzeit/); } },
      { t: "Nachweis als PDF", s: "Zum Ausdrucken oder Abgeben", c: C.slate, ic: "pdf", go: function () { var b = btnByText(/^Ausbildungsnachweis als PDF$/); if (b) b.click(); } },
      { t: "Kitteltasche", s: "Normwerte, Scores, Rechnen", c: C.red, ic: "kit", go: kittel }
    ] : [
      { t: "Einsatz anlegen", s: "Damit fängt dein Nachweis an", c: C.green, ic: "plus", go: function () { var b = btnByText(/^\+ Einsatz$|^Einsatz anlegen$/); if (b) b.click(); } },
      { t: "Nachweis als PDF", s: "Zum Ausdrucken oder Abgeben", c: C.slate, ic: "pdf", go: function () { var b = btnByText(/^Ausbildungsnachweis als PDF$/); if (b) b.click(); } },
      { t: "Kitteltasche", s: "Normwerte, Scores, Rechnen", c: C.red, ic: "kit", go: kittel }
    ];
    place("fx-qa-praxis", top, items, "Was möchtest du eintragen?", true);
  }
  async function kittel() {
    goTab("Praxis");
    var pb = await waitFor(function () { return btnByText(/^Praxisbegleiter$/); }); if (pb) pb.click();
    var k = await waitFor(function () { return btnByText(/^Kitteltasche$/); }); if (k) { k.click(); setTimeout(function () { k.scrollIntoView({ block: "start", behavior: "smooth" }); }, 120); }
  }
  /* Lernmodule: Sprungleiste zu den Ausbildungsjahren */
  function yearJump() {
    var heads = Array.prototype.filter.call(document.querySelectorAll("main h2"), function (h) { return /^\d\. Ausbildungsjahr/.test((h.textContent || "").trim()); });
    var old = document.getElementById("fx-yjump");
    if (heads.length < 2) { if (old) old.remove(); return; }
    if (old && old.isConnected && old.nextElementSibling && old.nextElementSibling.contains(heads[0])) return;
    if (old) old.remove();
    var bar = document.createElement("div"); bar.id = "fx-yjump"; bar.className = "fx-yjump";
    bar.innerHTML = "<span>Springe zu</span>" + heads.map(function (h, i) { var n = (h.textContent || "").trim().charAt(0); return '<button type="button" data-i="' + i + '" style="--c:' + (X.YEAR && X.YEAR[n] || C.blue) + '">' + n + '. Jahr</button>'; }).join("");
    bar.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; var h = heads[Number(b.dataset.i)]; var y = h.getBoundingClientRect().top + scrollY - 76; scrollTo({ top: y, behavior: "smooth" }); });
    var host = heads[0].closest("section, .sec, div") || heads[0];
    host.parentNode.insertBefore(bar, host);
  }
  function einsatzInfo() {
    var m = /noch\s+(\d+)\s+Tage/i.exec((document.querySelector("main") || {}).textContent || "");
    return m ? "Im Einsatz \u00b7 noch " + m[1] + " Tage" : "Nachweis, Anleitung, Unterschriften";
  }
  function home() {
    var hero = document.querySelector(".card.resume");
    var hello = document.querySelector("main .hello");
    if (!hero || !hello) { var o = document.getElementById("fx-qa-home"); if (o && !hero) o.remove(); return; }
    var aufg = Array.prototype.find.call(document.querySelectorAll(".side .tab, .tab"), function (x) { return /^Aufgaben/.test((x.textContent || "").trim()); });
    var na = aufg ? ((aufg.textContent || "").match(/(\d+)\s*$/) || [])[1] : "";
    var title = (hero.querySelector("h2, h3, b") || {}).textContent || "dein Modul";
    var items = [
      { t: "Weiterlernen", s: title.length > 42 ? title.slice(0, 40) + "…" : title, c: C.blue, ic: "play", go: function () { var b = hero.querySelector(".btn"); if (b) b.click(); } },
      { t: "Mein Praxiseinsatz", s: einsatzInfo(), c: C.green, ic: "pen", go: function () { goTab("Praxis"); } },
      { t: "Aufgaben", s: na ? na + " offen von deiner Lehrkraft" : "Von deiner Lehrkraft", c: C.orange, ic: "list", n: na, go: function () { goTab("Aufgaben"); } },
      { t: "Training", s: "Examen, Simulationen, Karteikarten", c: C.teal, ic: "spark", go: function () { goTab("Training"); } }
    ];
    place("fx-qa-home", hello, items, "", false);
  }
  var ADD = { "Arbeitstag": C.blue, "Praxisanleitung": C.violet, "Gespräch": C.teal, "Aufgabe": C.orange, "Fehlzeit": C.amber, "Einsatznachweis": C.green, "Leistungseinschätzung": C.pink };
  X.rule(".nwadd > button", function (el) { var t = (el.textContent || "").replace(/[^\wäöüÄÖÜß]/g, ""); for (var k in ADD) if (t.indexOf(k.replace(/[^\wäöüÄÖÜß]/g, "")) >= 0) return ADD[k]; return C.blue; });
  X.rule(".nwaufg > *", function () { return C.orange; });
  /* Gesperrte Module (Freischaltung durch die Lehrkraft) */
  function lockTitles() { return (window.FP_LOCKED || []).map(function (t) { return String(t).replace(/^Fallmodul \d+ \u00b7 /, "").trim(); }).filter(Boolean); }
  function locks() {
    var L = lockTitles();
    if (!L.length) return;
    document.querySelectorAll("button.mod, .card.resume, .modnav button").forEach(function (el) {
      var t = el.textContent || "", hit = L.some(function (x) { return t.indexOf(x) >= 0; });
      if (hit && !el.classList.contains("fx-locked")) el.classList.add("fx-locked");
      if (!hit && el.classList.contains("fx-locked")) el.classList.remove("fx-locked");
    });
  }
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest && e.target.closest(".fx-locked");
    if (!el) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var d = document.createElement("div"); d.className = "fx-toast"; d.textContent = "Dieses Modul schaltet deine Lehrkraft frei, sobald ihr im Unterricht so weit seid.";
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3500);
  }, true);
  var q = false;
  function tick() { if (q) return; q = true; requestAnimationFrame(function () { q = false; try { praxis(); home(); locks(); yearJump(); } catch (e) {} }); }
  function start() { tick(); new MutationObserver(tick).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  /* Demo: Hinweis "Vorschau ohne Server" ausblenden */
  if (window.FP_DEMO_ACC) {
    var st = document.createElement("style");
    st.textContent = ".nwdemo{display:none!important}";
    document.head.appendChild(st);
  }
})();
