/* Fallpfad: Konto löschen direkt in der App (Pflicht im App Store, Recht auf Löschung nach Art. 17 DSGVO).
   Ablauf: Hinweis, Ausbildungsnachweis vorher sichern, Bestätigung durch Eintippen von LÖSCHEN,
   dann Edge Function "konto-loeschen" (löscht Konto und alle zugehörigen Daten), Abmelden, Gerätedaten leeren. */
(function () {
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function wipeLocal() {
    try { Object.keys(localStorage).forEach(function (k) { if (/^(fp|fallpfad|sb-)/i.test(k)) localStorage.removeItem(k); }); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
  }
  function open() {
    var demo = !!window.FP_DEMO_ACC;
    var bg = document.createElement("div"); bg.className = "fxpm-bg sheet ls-pickbg";
    if (window.innerWidth > 640) { bg.classList.remove("sheet"); bg.classList.add("ls-center"); }
    bg.innerHTML = '<div class="fxpm ls-pick fpk" role="dialog" aria-modal="true" aria-label="Konto löschen">' +
      '<div class="ls-pick-h"><b>Konto löschen</b><small>Dein Konto und alle dazugehörigen Daten werden endgültig gelöscht: Profil, Lernfortschritt, Ergebnisse, Abgaben, Einträge im Ausbildungsnachweis, Feedback und Nachrichtenstatus. Das lässt sich nicht rückgängig machen.</small></div>' +
      '<div class="fpk-box"><b>Vorher sichern?</b><p>Deinen Ausbildungsnachweis kannst du unter <b>Praxis</b> als PDF exportieren. Frag am besten deine Schule, ob sie eine Kopie braucht, bevor du löschst.</p></div>' +
      '<label class="fpk-l"><span>Zum Bestätigen <b>LÖSCHEN</b> eintippen</span><input class="input" autocomplete="off" autocapitalize="characters" spellcheck="false"></label>' +
      '<p class="fpk-msg" role="status"></p>' +
      '<div class="fpk-row"><button type="button" class="btn ghost" data-a="x">Abbrechen</button><button type="button" class="btn fpk-del" data-a="del" disabled>Endgültig löschen</button></div></div>';
    document.body.appendChild(bg);
    var inp = bg.querySelector("input"), del = bg.querySelector("[data-a=del]"), msg = bg.querySelector(".fpk-msg");
    inp.addEventListener("input", function () { del.disabled = inp.value.trim().toUpperCase() !== "LÖSCHEN"; });
    function close() { bg.remove(); }
    bg.addEventListener("click", function (e) {
      if (e.target === bg || e.target.closest("[data-a=x]")) return close();
      if (!e.target.closest("[data-a=del]") || del.disabled) return;
      if (demo) { msg.textContent = "Im Demo-Konto wird nichts gelöscht. In deinem echten Konto wäre es jetzt weg."; return; }
      del.disabled = true; msg.textContent = "Wird gelöscht …";
      var sb = null;
      Promise.resolve().then(function () { return window.FP_SBC ? window.FP_SBC() : null; }).catch(function () { return null; }).then(function (c) {
        sb = c;
        if (!sb || !sb.functions) { wipeLocal(); return { local: true }; }
        return sb.functions.invoke("konto-loeschen", { body: { bestaetigt: true } });
      }).then(function (r) {
        if (r && r.local) return;
        if (r.error) {
          var c = r.error.context;
          return (c && c.json ? c.json() : Promise.resolve({})).then(function (j) { throw new Error((j && j.error) || "Das Löschen hat nicht geklappt. Bitte später erneut versuchen."); }, function () { throw new Error("Das Löschen hat nicht geklappt. Bitte später erneut versuchen."); });
        }
        return sb.auth.signOut().catch(function () {});
      }).then(function () {
        wipeLocal();
        bg.querySelector(".fpk").innerHTML = '<div class="ls-pick-h"><b>Dein Konto ist gelöscht.</b><small>Danke, dass du mit Fallpfad gelernt hast.</small></div>';
        setTimeout(function () { location.replace(location.pathname); }, 1800);
      }, function (er) { msg.textContent = er.message; del.disabled = false; });
    });
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 200);
  }
  /* Rechtliches: Datenschutz, Nutzungsbedingungen, Impressum (eigene Seiten, auch offline in der App) */
  function urls() {
    var c = window.FALLPFAD_CONFIG || {};
    return [["Datenschutz", c.datenschutzUrl || "datenschutz.html"], ["Nutzungsbedingungen", c.nutzungUrl || "nutzungsbedingungen.html"], ["Impressum", c.impressumUrl || "impressum.html"]];
  }
  function legalHtml() { return urls().map(function (u) { return '<a href="' + esc(u[1]) + '">' + esc(u[0]) + "</a>"; }).join("<span>·</span>"); }
  function placeLegal() {
    var f = document.querySelector("form.loginform");
    if (f && !f.parentNode.querySelector(".fp-legal")) {
      var d = document.createElement("nav"); d.className = "fp-legal"; d.setAttribute("aria-label", "Rechtliches"); d.innerHTML = legalHtml();
      f.parentNode.insertBefore(d, f.nextSibling);
    }
  }
  function start() { placeLegal(); var q = 0; new MutationObserver(function () { if (q) return; q = 1; requestAnimationFrame(function () { q = 0; placeLegal(); }); }).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.FP_KONTO = { open: open, legal: legalHtml };
})();
