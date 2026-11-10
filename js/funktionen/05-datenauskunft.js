/* Fallpfad: Datenauskunft. Lädt alle zum eigenen Konto gespeicherten Daten als JSON-Datei herunter
   (Auskunft nach Art. 15 DSGVO, Datenübertragbarkeit nach Art. 20 DSGVO).
   Server: Funktion public.fp_meine_daten() aus supabase/sicherheit_haertung.sql. Sie läuft mit den Rechten
   der angemeldeten Person, es gelten also alle Zugriffsregeln der Datenbank. */
(function () {
  function meldung(t) {
    var el = document.createElement("div");
    el.setAttribute("role", "status");
    el.className = "fp-hinweis";
    el.textContent = t;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add("weg"); }, 4200);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 4700);
  }
  function lokal() {
    var out = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (/^(fp-|fallpfad)/.test(k) && !/auth-token/.test(k)) out[k] = localStorage.getItem(k);
      }
    } catch (e) {}
    return out;
  }
  function speichern(obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fallpfad-meine-daten-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); if (a.parentNode) a.parentNode.removeChild(a); }, 1000);
  }
  var laeuft = false;
  function herunterladen() {
    if (laeuft) return;
    laeuft = true;
    var geraet = { hinweis: "Auf diesem Gerät gespeicherte Einstellungen und Lernstände (verlassen das Gerät nicht).", daten: lokal() };
    function fertig(konto) { laeuft = false; speichern({ konto: konto, geraet: geraet }); meldung("Deine Daten wurden heruntergeladen."); }
    if (!window.FP_SBC || window.FP_DEMO_ACC) return fertig({ hinweis: "Ohne Schulkonto liegen keine Daten auf dem Server." });
    Promise.resolve().then(function () { return window.FP_SBC(); }).then(function (sb) {
      if (!sb || !sb.rpc) return fertig({ hinweis: "Ohne Schulkonto liegen keine Daten auf dem Server." });
      return sb.rpc("fp_meine_daten").then(function (r) {
        if (r.error) throw r.error;
        fertig(r.data);
      });
    }).catch(function () {
      laeuft = false;
      meldung("Die Auskunft ist gerade nicht verfügbar. Bitte wende dich an deine Schule.");
    });
  }
  window.FP_AUSKUNFT = { herunterladen: herunterladen };
})();
