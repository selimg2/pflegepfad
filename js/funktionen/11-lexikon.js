/* Fallpfad Fachlexikon (Training > Lexikon): schnelle Suche über alle Fachbegriffe aus Fachlexikon und Lernkarten.
   - Suche ohne Rücksicht auf Groß-/Kleinschreibung, Umlaute (ä = ae) und Bindestriche; Treffer im Begriff stehen vorn
   - Filter nach Kategorie und Anfangsbuchstabe, „Begriff des Tages“, zufälliger Begriff
   - Es werden immer nur 60 Begriffe auf einmal gezeigt („Weitere anzeigen“), damit die Liste auch auf dem Handy flüssig bleibt
   Die Begriffe kommen aus dem App-Kern (window.FP_LEX_MAP). Die Struktur dl.lex > div > dt/dd bleibt erhalten,
   damit „Meine Sprache“ die Übersetzung neben dem Begriff einblenden kann. */
(function () {
  "use strict";
  var R = window.React;
  if (!R) return;
  var h = R.createElement, useState = R.useState, useMemo = R.useMemo, useEffect = R.useEffect, useRef = R.useRef;
  var SEITE = 60, OHNE = "Aus den Modulen";

  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[₀-₉]/g, function (c) { return String(c.charCodeAt(0) - 8320); })
      .replace(/[-–‐./()]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function buchstabe(t) {
    var c = norm(t).charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : "#";
  }
  function heute() { var d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); }

  function daten() {
    var M = window.FP_LEX_MAP;
    if (!M || !M.forEach) return [];
    var out = [];
    M.forEach(function (v, k) {
      var nt = norm(k);
      out.push({ t: k, d: v.def, src: v.src || "", kat: v.kat || OHNE, nt: nt, nc: nt.replace(/ /g, ""), nd: norm(v.def), b: buchstabe(k) });
    });
    out.sort(function (a, b) { return a.t.localeCompare(b.t, "de", { sensitivity: "base" }); });
    return out;
  }

  function rang(e, q, w) {
    var qc = q.replace(/ /g, "");
    if (e.nt === q || e.nc === qc) return 0;
    if (e.nt.indexOf(q) === 0 || (qc.length >= 2 && e.nc.indexOf(qc) === 0)) return 1;
    if ((" " + e.nt).indexOf(" " + q) >= 0) return 2;
    if (e.nt.indexOf(q) >= 0) return 3;
    if (w.length && w.every(function (x) { return e.nt.indexOf(x) >= 0 || e.nd.indexOf(x) >= 0; })) return 4;
    return -1;
  }

  var CSS = ".lx-top{display:grid;gap:10px;margin-bottom:12px}.lx-search{position:relative}.lx-search input{width:100%;max-width:none;padding-right:40px}" +
    ".lx-clear{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:var(--muted);font-size:18px;line-height:1;padding:8px;cursor:pointer;border-radius:999px}" +
    ".lx-abc{display:flex;flex-wrap:wrap;gap:4px}.lx-abc button{min-width:32px;height:32px;padding:0 6px;border:0;border-radius:9px;background:var(--fill,rgba(120,120,128,.12));color:inherit;font-weight:600;font-size:13px;cursor:pointer}" +
    ".lx-abc button[aria-pressed=true]{background:var(--accent);color:#fff}.lx-abc button:disabled{opacity:.3;cursor:default}" +
    ".lx-tag{border-radius:16px;padding:14px 16px;background:var(--accent-soft,rgba(0,98,255,.08));margin-bottom:14px}.lx-tag .eyebrow{margin-bottom:4px}.lx-tag b{font-size:17px}.lx-tag p{margin:4px 0 0;line-height:1.5}" +
    ".lx-kat{display:inline-block;font-size:11.5px;font-weight:600;color:var(--muted);margin-left:8px;font-weight:500}" +
    ".lx-row{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:4px 0 8px}" +
    "@media (max-width:640px){.lx-scroll{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;margin-left:-4px;margin-right:-4px;padding:0 4px 2px}.lx-scroll::-webkit-scrollbar{display:none}.lx-scroll>button{flex:0 0 auto;white-space:nowrap}}" +
    ".lex mark{background:color-mix(in srgb,var(--accent) 22%,transparent);color:inherit;border-radius:3px;padding:0 1px}";
  function useCss() { useEffect(function () { if (document.getElementById("lx-css")) return; var s = document.createElement("style"); s.id = "lx-css"; s.textContent = CSS; document.head.appendChild(s); }, []); }

  function markiere(text, q) {
    if (!q || q.length < 2) return text;
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text;
    return [text.slice(0, i), h("mark", { key: "m" }, text.slice(i, i + q.length)), text.slice(i + q.length)];
  }

  function Lexikon() {
    useCss();
    var alle = useMemo(daten, []);
    var qs = useState(""), q = qs[0], setQ = qs[1];
    var ks = useState(""), kat = ks[0], setKat = ks[1];
    var bs = useState(""), bu = bs[0], setBu = bs[1];
    var ns = useState(SEITE), n = ns[0], setN = ns[1];
    var zs = useState(null), zufall = zs[0], setZufall = zs[1];
    var inp = useRef(null);

    var kats = useMemo(function () {
      var m = {};
      alle.forEach(function (e) { m[e.kat] = (m[e.kat] || 0) + 1; });
      return Object.keys(m).sort(function (a, b) { return a === OHNE ? 1 : b === OHNE ? -1 : a.localeCompare(b, "de"); }).map(function (k) { return [k, m[k]]; });
    }, [alle]);

    var nq = norm(q), worte = nq ? nq.split(" ").filter(function (x) { return x.length >= 3; }) : [];
    var liste = useMemo(function () {
      var basis = alle.filter(function (e) { return !kat || e.kat === kat; });
      if (nq) {
        var t = [];
        basis.forEach(function (e) { var r = rang(e, nq, worte); if (r >= 0) t.push([r, e]); });
        t.sort(function (a, b) { return a[0] - b[0] || a[1].t.localeCompare(b[1].t, "de", { sensitivity: "base" }); });
        return t.map(function (x) { return x[1]; });
      }
      return bu ? basis.filter(function (e) { return e.b === bu; }) : basis;
    }, [alle, nq, kat, bu]);

    var vorhanden = useMemo(function () { var s = {}; alle.forEach(function (e) { if (!kat || e.kat === kat) s[e.b] = 1; }); return s; }, [alle, kat]);
    var tag = alle.length ? alle[(heute() * 7919) % alle.length] : null;
    useEffect(function () { setN(SEITE); }, [nq, kat, bu]);

    if (!alle.length) return h("div", { className: "card" }, h("h3", null, "Fachlexikon"), h("p", { className: "muted" }, "Das Lexikon wird geladen …"));
    var zeigen = liste.slice(0, n);
    var hervor = zufall || (!nq && !bu && !kat ? tag : null);

    return h("div", { className: "card" },
      h("h3", null, "Fachlexikon"),
      h("p", { className: "muted", style: { marginTop: 4 } }, alle.length + " Fachbegriffe aus Pflege, Medizin und Recht, erklärt in einfachen Worten. Tippe im Text der Module auf unterstrichene Begriffe, um sie direkt nachzuschlagen."),
      h("div", { className: "lx-top" },
        h("div", { className: "lx-search" },
          h("label", { className: "sr", htmlFor: "lexq" }, "Fachbegriff suchen"),
          h("input", { id: "lexq", ref: inp, type: "search", className: "input", autoComplete: "off", spellCheck: false, placeholder: "Begriff oder Abkürzung suchen …", value: q, onChange: function (e) { setQ(e.target.value); setZufall(null); } }),
          q && h("button", { type: "button", className: "lx-clear", "aria-label": "Suche leeren", onClick: function () { setQ(""); if (inp.current) inp.current.focus(); } }, "×")),
        h("div", { className: "fchips lx-scroll", role: "group", "aria-label": "Kategorie" },
          [["", "Alle"]].concat(kats.map(function (k) { return [k[0], k[0] + " · " + k[1]]; })).map(function (k) {
            return h("button", { key: k[0] || "alle", type: "button", className: "chip" + (kat === k[0] ? " blue" : ""), "aria-pressed": kat === k[0], onClick: function () { setKat(k[0]); setBu(""); } }, k[1]);
          })),
        !nq && h("div", { className: "lx-abc lx-scroll", role: "group", "aria-label": "Anfangsbuchstabe" },
          ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"].map(function (c) {
            return h("button", { key: c || "alle", type: "button", "aria-pressed": bu === c, disabled: c && !vorhanden[c], onClick: function () { setBu(c); } }, c || "A–Z");
          }))),
      hervor && h("div", { className: "lx-tag", "aria-live": "polite" },
        h("div", { className: "eyebrow" }, zufall ? "Zufälliger Begriff" : "Begriff des Tages"),
        h("b", null, hervor.t), h("p", null, hervor.d)),
      h("div", { className: "lx-row" },
        h("span", { className: "muted", style: { fontSize: 13 } }, liste.length === 1 ? "1 Begriff" : liste.length + " Begriffe"),
        h("button", { type: "button", className: "btn ghost sm", onClick: function () { setZufall(alle[Math.floor(Math.random() * alle.length)]); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} } }, "Zufälliger Begriff")),
      h("dl", { className: "lex" }, zeigen.map(function (e) {
        return h("div", { key: e.t },
          h("dt", { "data-ls-term": e.t }, nq ? markiere(e.t, q.trim()) : e.t, kat ? null : h("span", { className: "lx-kat" }, e.kat === OHNE ? "" : e.kat)),
          h("dd", null, e.d, h("small", null, e.src)));
      })),
      liste.length > n && h("div", { className: "row", style: { marginTop: 12 } },
        h("button", { type: "button", className: "btn ghost sm", onClick: function () { setN(n + SEITE); } }, "Weitere anzeigen (" + (liste.length - n) + ")")),
      !liste.length && h("p", { className: "muted" }, "Kein Begriff gefunden. Versuche ein kürzeres Stichwort oder eine andere Schreibweise."));
  }
  window.FP_Lexikon = Lexikon;
})();
