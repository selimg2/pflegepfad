(function () {
  window.FP_MODKOMM = {"fm1": ["auf-knie"], "fm2": ["ueb-op", "pat-angst"], "fm3": ["ueb-arzt"], "fm4": ["pat-schmerz"], "fm5": ["ueb-hueft"], "fm6": ["ber-sturz"], "fm7": ["ber-wunde"], "fm8": ["ber-spritze"], "fm9": ["ueb-rea"], "fm10": ["ber-hi"], "fm11": ["ber-inhalation"], "fm12": ["ber-insulin", "ueb-hypo", "kon-gehen"], "fm13": ["ang-schlaganfall"], "fm14": ["pat-demenz"], "fm15": ["pat-depression"], "fm16": ["ang-mutter"], "fm17": ["ang-palliativ", "ueb-palliativ"], "fm18": ["ang-telefon", "kon-klingel"], "fm19": ["pat-scham"], "fm20": ["ber-medplan"], "fm21": ["ueb-sepsis"], "fm22": ["pat-chemo"], "fm23": ["auf-sprache"], "fm24": ["ang-pflegend"], "fm25": ["ber-dialyse"], "fm26": ["ber-stillen"], "fm27": ["pat-jugend"], "fm28": ["pat-entzug"], "fm29": ["pat-gewalt"], "fm30": ["kon-team"], "fm31": ["pat-essen"], "fm32": ["pat-psychose"], "fm33": ["ber-stoma"], "fm34": ["ang-teilhabe"], "fm35": ["auf-heim"], "fm36": ["pat-infarkt"], "fm37": ["ang-saeugling"], "fm38": ["pat-mrsa"], "fm39": ["pat-intim"], "fm40": ["ang-delir"], "fm41": ["kon-leitung"], "fm42": ["ang-bettgitter"], "fm43": ["ber-dekubitus"], "fm44": ["ueb-delir"], "fm45": ["pat-hoeren"], "fm46": ["pat-schuettelfrost"], "fm47": ["kon-parkinson"], "fm48": ["ber-rauchen"], "fm49": ["ber-leber"], "fm50": ["auf-alkohol"], "fm51": ["kon-sohn"], "fm52": ["ang-intensiv"], "fm53": ["pat-suizid"], "fm54": ["ueb-drei"], "fm55": ["ang-verfuegung"], "fm56": ["kon-notaufnahme"]};
  var R = window.React;
  function sz(id) { var d = window.FP_KOMM_DATA; return d && d.szenarien.filter(function (x) { return x.id === id; })[0]; }
  function kat(id) { var d = window.FP_KOMM_DATA; return d && d.kategorien.filter(function (x) { return x.id === id; })[0]; }
  window.FP_kommForMod = function (mid) { return (window.FP_MODKOMM[mid] || []).map(sz).filter(Boolean); };
  window.FP_modForKomm = function (sid) { var out = []; var M = window.FP_MODS || []; Object.keys(window.FP_MODKOMM).forEach(function (k) { if (window.FP_MODKOMM[k].indexOf(sid) >= 0) { var m = M.filter(function (x) { return x.id === k; })[0]; if (m) out.push(m); } }); return out; };
  function open(sid) { window.FP_KOMM_OPEN = sid; if (window.FP_openTraining) window.FP_openTraining({ tab: "kommunikation", komm: sid }); }
  window.FP_modEndKomm = function (m) {
    if (!R || !m) return null;
    var list = window.FP_kommForMod(m.id); if (!list.length) return null;
    var h = R.createElement;
    return h("div", { className: "card block fp-mk" },
      h("div", { className: "fp-mk-h" },
        h("span", { className: "fp-mk-ic", "aria-hidden": "true" }, h("svg", { viewBox: "0 0 24 24", width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-3.5-3H12" }))),
        h("div", null, h("div", { className: "eyebrow" }, "Training zum Modul"), h("h3", { style: { margin: "2px 0 0" } }, list.length > 1 ? "Passende Gespräche üben" : "Passendes Gespräch üben"))),
      h("p", { className: "muted", style: { margin: "8px 0 12px" } }, "Wende an, was du gelernt hast: Sprich mit einer KI-Gesprächsperson, die zu diesem Modul passt. Danach bekommst du eine Rückmeldung."),
      h("div", { className: "fp-mk-list" }, list.map(function (x) {
        var k = kat(x.kat) || { c: "#0EA5E9", t: "" };
        return h("button", { key: x.id, type: "button", className: "fp-mk-it", style: { "--c": k.c }, onClick: function (e) { e.preventDefault(); open(x.id); } },
          h("span", { className: "fp-mk-k" }, k.t),
          h("b", null, x.titel),
          h("span", { className: "fp-mk-p" }, x.person.name + " · " + x.dauer + " Min. · " + x.stufe),
          h("span", { className: "fp-mk-go" }, "Training starten", h("svg", { viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" }, h("path", { d: "M9 6l6 6-6 6" }))));
      })));
  };
})();
