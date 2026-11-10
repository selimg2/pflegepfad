/* Fallpfad Bewegungssystem (ersetzt die früheren Mikro-Effekte)
   Regeln (DESIGN_SYSTEM.md, Abschnitt Bewegung):
   - Bewegung antwortet auf eine Handlung oder erklärt eine Veränderung. Keine Dekoration.
   - Drei Dauern (140/220/360 ms), drei Kurven (standard, enter, exit), kein Überschwingen.
   - Kein Ring bei jedem Antippen, kein Anheben von Karten, kein Einblenden bei jeder DOM-Änderung.
   - "Bewegung reduzieren" schaltet alles ab, die Bedienung bleibt gleich.
   Öffentlich: window.FP_MOTION = { reduced, token, enter(el) } */
(function () {
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var T = { fast: 140, base: 220, slow: 360, scene: 600, standard: "cubic-bezier(.2,0,0,1)", enter: "cubic-bezier(.05,.7,.1,1)", exit: "cubic-bezier(.3,0,.8,.15)" };
  window.FP_MOTION = {
    reduced: function () { return !!mq.matches; },
    token: T,
    /* ein Element einmalig einblenden (z. B. neues Ergebnis, neue Szene) */
    enter: function (el) { if (!el || mq.matches) return; el.classList.remove("fp-enter"); void el.offsetWidth; el.classList.add("fp-enter"); setTimeout(function () { el.classList.remove("fp-enter"); }, T.scene + 50); }
  };
  if (mq.matches) return;
  var css =
    /* Druck-Rückmeldung: kurz und klein, auf allen Bedienelementen gleich */
    "button,.btn,.tab,.chip,a.card,.lvopt,.iconbtn{transition:transform var(--m-fast,140ms) var(--e-standard,ease),background-color var(--m-base,220ms) var(--e-standard,ease),border-color var(--m-base,220ms) var(--e-standard,ease),color var(--m-base,220ms) var(--e-standard,ease),box-shadow var(--m-base,220ms) var(--e-standard,ease)}" +
    "button:not(:disabled):active,.btn:active,.chip:active,.lvopt:not(:disabled):active,.iconbtn:active{transform:scale(.97)}" +
    ".tab:active{transform:none}" +
    ".fx-t:active,button.mod:active,.trtile:active{transform:scale(.985)!important}" +
    /* Seitenwechsel: nur beim Wechsel des Bereichs, nur Deckkraft und 6 px */
    "@keyframes fxm-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}" +
    ".fxm-page{animation:fxm-in var(--m-slow,360ms) var(--e-enter,ease) both}" +
    /* Auswahl bestätigen: Farbe und Häkchen tragen die Information, kein Hüpfen */
    ".switch i{transition:transform var(--m-base,220ms) var(--e-standard,ease)!important}" +
    ".card,.fx-t{transition:box-shadow var(--m-base,220ms) var(--e-standard,ease),border-color var(--m-base,220ms) var(--e-standard,ease)}" +
    "@media (hover:hover){a.card:hover,.card.click:hover,.acard:hover,.fx-t:hover,.trtile:hover{box-shadow:var(--elev-2)!important}}";
  var st = document.createElement("style"); st.id = "fx-motion-css"; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* Seitenwechsel erkennen: nur wenn sich Bereich (aktiver Reiter) oder Hauptüberschrift ändert */
  var last = null;
  function page() {
    var m = document.querySelector("main.main, main");
    if (!m) return;
    var key = ((document.querySelector(".tab[aria-current=page], .tab.on") || {}).textContent || "") + "|" + ((m.querySelector("h1") || {}).textContent || "").slice(0, 40);
    if (key === last) return;
    var first = last === null;
    last = key;
    if (first) return;
    var kids = Array.prototype.filter.call(m.children, function (k) { return !k.classList.contains("topbar"); });
    kids.forEach(function (k) { k.classList.remove("fxm-page"); void k.offsetWidth; k.classList.add("fxm-page"); setTimeout(function () { k.classList.remove("fxm-page"); }, T.slow + 60); });
  }
  function start() { var q = 0; new MutationObserver(function () { if (q) return; q = 1; requestAnimationFrame(function () { q = 0; page(); }); }).observe(document.body, { childList: true, subtree: true }); page(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
