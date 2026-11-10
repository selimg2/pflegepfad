/* Schüler-App: Live-Unterricht. Zeigt immer nur den Schritt, den die Lehrkraft vorne freigibt.
   Lernende können antworten, aber nicht selbst weiterblättern. */
(function () {
  var R = window.React;
  if (!R) return;
  var h = R.createElement, useState = R.useState, useEffect = R.useEffect;
  var esc = function (t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  function rich(t) {
    var s = String(t || "");
    if (/<(p|ul|ol|b|em|br|table)\b/i.test(s)) return s.replace(/<\s*(script|style|iframe)[\s\S]*?<\/\s*\1\s*>/gi, "").replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    var lines = s.split(/\n/), out = [], list = [];
    lines.forEach(function (l) {
      var m = /^\s*[•\-\*]\s+(.*)$/.exec(l);
      if (m) { list.push("<li>" + esc(m[1]) + "</li>"); return; }
      if (list.length) { out.push("<ul>" + list.join("") + "</ul>"); list = []; }
      if (l.trim()) out.push("<p>" + esc(l) + "</p>");
    });
    if (list.length) out.push("<ul>" + list.join("") + "</ul>");
    return out.join("");
  }
  var COL = ["#0062FF", "#7C3AED", "#0D9488", "#EA580C", "#DB2777", "#4F46E5", "#059669", "#D97706"];
  function LiveStudent(p) {
    var st = p.st || {}, k = st.pub || {}, ph = st.phase, step = st.step;
    var s1 = useState([]), sel = s1[0], setSel = s1[1];
    var s2 = useState(""), txt = s2[0], setTxt = s2[1];
    var s3 = useState(null), sent = s3[0], setSent = s3[1];
    var s4 = useState(false), busy = s4[0], setBusy = s4[1];
    var s5 = useState(null), err = s5[0], setErr = s5[1];
    var s6 = useState(null), lastStep = s6[0], setLast = s6[1];
    var s7 = useState(null), conf = s7[0], setConf = s7[1];
    var s8 = useState([]), taps = s8[0], setTaps = s8[1];
    var s9 = useState(0), role = s9[0], setRole = s9[1];
    var B = window.FP_BODY;
    useEffect(function () {
      if (step === lastStep) return;
      setLast(step); setErr(null);
      var mine = st.mine || null, mt = st.mytxt || null, kd = (st.pub || {}).kind;
      setSel(mine && !mt ? mine.slice() : []);
      setTxt(mt || "");
      setSent(mine || mt ? (mt || mine.join(",")) : null);
      setConf(null); setTaps([]);
      if (kd === "conf" || kd === "clue") { setSel(mine && !mt ? [mine[0]] : []); if (kd === "conf" && mine) setConf(mine[1]); if (mine) setSent(kd === "conf" ? mine[0] + "/" + mine[1] : String(mine[0])); }
      if (kd === "body") { var tp = mine && B ? B.dec(mine) : []; setTaps(tp); if (mine) setSent(tp.map(function (t) { return t.join(":"); }).join(",")); }
      if (kd === "role") {
        var n = ((st.pub || {}).roles || []).length || 1, key = "fp-live-role-" + p.code + "-" + step, r = null;
        var m = /^\[(\d)\]\s*([\s\S]*)$/.exec(mt || "");
        if (m) { r = Number(m[1]); setTxt(m[2]); setSent(m[2]); }
        if (r == null) { try { r = sessionStorage.getItem(key); } catch (e) {} r = r == null ? Math.floor(Math.random() * n) : Number(r); }
        try { sessionStorage.setItem(key, String(r)); } catch (e) {}
        setRole(r % n);
      }
    }, [step]);
    var open = ph === "question", rev = ph === "reveal" ? k.rev : null, kind = k.kind;
    function toggle(i) {
      if (!open) return;
      setSel(function (a) {
        if (kind === "order") return a.indexOf(i) >= 0 ? a.filter(function (x) { return x !== i; }) : a.concat([i]);
        if (kind === "conf" || kind === "clue") return [i];
        if (k.multi || kind === "lines") return a.indexOf(i) >= 0 ? a.filter(function (x) { return x !== i; }) : a.concat([i]).sort();
        return [i];
      });
    }
    async function send() {
      setBusy(true); setErr(null);
      try {
        var ok;
        var sig = sigNow();
        if (kind === "word" || kind === "estimate") ok = await p.answer(step, String(txt).trim());
        else if (kind === "role") ok = await p.answer(step, "[" + role + "] " + String(txt).trim());
        else if (kind === "conf") ok = await p.vote(step, [sel[0], conf]);
        else if (kind === "clue") ok = await p.vote(step, [sel[0], 5 + Math.min(4, k.clue || 0)]);
        else if (kind === "body") ok = await p.vote(step, B.enc(taps));
        else ok = await p.vote(step, sel);
        if (ok) setSent(sig); else setErr("Die Abstimmung ist gerade geschlossen.");
      } catch (e) { setErr(e.message || String(e)); }
      setBusy(false);
    }
    function sigNow() {
      if (kind === "word" || kind === "estimate" || kind === "role") return String(txt).trim();
      if (kind === "conf") return sel.join(",") + "/" + conf;
      if (kind === "clue") return sel.join(",");
      if (kind === "body") return taps.map(function (t) { return t.join(":"); }).join(",");
      return sel.join(",");
    }
    function tapBody(e) {
      if (!open || !B) return;
      var sv = e.currentTarget.querySelector("svg"), r = (sv || e.currentTarget).getBoundingClientRect(), x = Math.round((e.clientX - r.left) / r.width * 99), y = Math.round((e.clientY - r.top) / r.height * 99);
      x = Math.max(0, Math.min(99, x)); y = Math.max(0, Math.min(99, y));
      setTaps(function (a) { var n = a.concat([[x, y]]); return n.slice(-Math.max(1, k.taps || 1)); });
    }
    var head = h("header", { className: "lvhead" }, h("div", null, h("b", null, "Fallpfad Live"), h("small", null, "Code " + p.code)), h("button", { type: "button", className: "btn ghost sm", onClick: p.leave }, "Verlassen"));
    var title = h("div", { className: "lvtitle" }, h("span", { className: "eyebrow" }, k.title || "Live-Unterricht"), k.total ? h("span", { className: "lvstep" }, "Schritt " + (Math.max(0, step) + 1) + " von " + k.total) : null);
    if (ph === "lobby") return h("div", { className: "lv fxl-s" }, head, title, h("div", { className: "lvbox" }, h("div", { className: "lvpulse" }), h("h2", null, "Du bist dabei"), h("p", null, "Gleich geht es los. Deine Lehrkraft schaltet die Schritte vorne weiter, diese Seite folgt automatisch.")));
    if (ph === "end") return h("div", { className: "lv fxl-s" }, head, title, h("div", { className: "lvbox" }, h("h2", null, "Geschafft"), h("p", null, k.summary || "Danke fürs Mitmachen!"), h("button", { type: "button", className: "btn", onClick: p.leave }, "Zur Fallpfad-App")));
    var body = [], answered = sent != null;
    if (k.person) body.push(h("div", { key: "per", className: "fxl-person" }, h("b", null, k.person.name), k.person.info ? h("span", null, k.person.info) : null));
    if (k.titel && kind !== "info") body.push(h("div", { key: "tt", className: "fxl-kicker" }, k.titel));
    if (kind === "info") {
      body.push(h("section", { key: "info", className: "fxl-info" }, k.titel && h("h2", null, k.titel), k.html && h("div", { className: "fxl-rich", dangerouslySetInnerHTML: { __html: rich(k.html) } }), k.img && h("img", { src: k.img, alt: k.alt || "" }), k.rows && h("table", { className: "fxl-rows" }, h("tbody", null, k.rows.map(function (r, i) { return h("tr", { key: i }, h("td", null, r[0]), h("td", null, h("b", null, r[1]))); }))), h("p", { className: "fxl-look" }, "Schau nach vorne. Deine Lehrkraft erklärt gerade.")));
    } else {
      if (k.sit) body.push(h("div", { key: "sit", className: "fxl-rich lvsit", dangerouslySetInnerHTML: { __html: rich(k.sit) } }));
      if (k.rows && k.rows.length) body.push(h("table", { key: "rows", className: "fxl-rows" }, h("tbody", null, k.rows.map(function (r, i) { return h("tr", { key: i }, h("td", null, r[0]), h("td", null, h("b", null, r[1]))); }))));
      body.push(h("h2", { key: "q", className: "fxl-q" }, k.q));
      if (kind === "choice" || kind === "scale" || kind === "lines") {
        if (k.multi || kind === "lines") body.push(h("p", { key: "hint", className: "lvhint" }, kind === "lines" ? "Tippe alle Sätze an, die einen Fehler enthalten." : "Mehrere Antworten möglich"));
        body.push(h("div", { key: "opts", className: "lvopts fxl-opts" + (kind === "scale" ? " scale" : "") + (kind === "lines" ? " lines" : "") }, (k.opts || []).map(function (o, i) {
          var on = sel.indexOf(i) >= 0, ok = rev && rev.ok && rev.ok.indexOf(i) >= 0;
          var c = kind === "scale" && k.colors ? k.colors[i] : null;
          return h("button", { key: i, type: "button", className: "lvopt" + (on ? " on" : "") + (rev && rev.ok ? (ok ? " ok" : on ? " bad" : " dim") : ""), style: c ? { "--sc": c } : null, onClick: function () { toggle(i); }, disabled: !open, "aria-pressed": on }, kind !== "scale" && kind !== "lines" ? h("i", null, "ABCDEFGHIJ"[i]) : null, h("span", null, o));
        })));
      } else if (kind === "order") {
        var left = (k.items || []).map(function (t, i) { return i; }).filter(function (i) { return sel.indexOf(i) < 0; });
        body.push(h("p", { key: "hint", className: "lvhint" }, "Tippe die Schritte in der richtigen Reihenfolge an. Nochmal tippen nimmt einen Schritt heraus."));
        body.push(h("ol", { key: "ord", className: "fxl-order" }, sel.map(function (i, n) { var okp = rev && rev.order && rev.order[n] === i; return h("li", { key: i, className: rev && rev.order ? (okp ? "ok" : "bad") : "" }, h("button", { type: "button", disabled: !open, onClick: function () { toggle(i); } }, h("b", null, n + 1), h("span", null, k.items[i]))); })));
        if (left.length) body.push(h("div", { key: "left", className: "fxl-pool" }, left.map(function (i) { return h("button", { key: i, type: "button", disabled: !open, onClick: function () { toggle(i); } }, k.items[i]); })));
        if (rev && rev.order) body.push(h("div", { key: "sol", className: "fxl-sol" }, h("b", null, "Richtige Reihenfolge"), h("ol", null, rev.order.map(function (i) { return h("li", { key: i }, k.items[i]); }))));
      } else if (kind === "estimate") {
        body.push(h("div", { key: "est", className: "fxl-est" }, h("input", { type: "number", inputMode: "decimal", className: "input", value: txt, disabled: !open, step: k.step || "any", min: k.min, max: k.max, onChange: function (e) { setTxt(e.target.value); }, placeholder: "Deine Schätzung" }), k.unit ? h("span", null, k.unit) : null));
        if (rev && rev.ans != null) body.push(h("div", { key: "sol", className: "fxl-sol" }, h("b", null, "Richtig: " + String(rev.ans).replace(".", ",") + (k.unit ? " " + k.unit : ""))));
      } else if (kind === "word") {
        body.push(h("div", { key: "w", className: "fxl-word" }, h("input", { className: "input", maxLength: 60, value: txt, disabled: !open, onChange: function (e) { setTxt(e.target.value); }, placeholder: k.hint || "Ein bis drei Stichworte, mit Komma getrennt" })));
      }
      if (kind === "conf" || kind === "clue") {
        if (kind === "clue") body.splice(body.length - 1, 0, h("ol", { key: "clues", className: "fxl-clues" }, (k.clues || []).map(function (c, i) { return h("li", { key: i, className: i === (k.clues || []).length - 1 && open ? "new" : "" }, h("b", null, "Hinweis " + (i + 1)), h("span", null, c)); })));
        if (kind === "clue" && open) body.push(h("p", { key: "hint", className: "lvhint" }, "Leg dich jetzt fest. Bei jedem neuen Hinweis darfst du umdenken."));
        body.push(h("div", { key: "opts", className: "lvopts fxl-opts" }, (k.opts || []).map(function (o, i) {
          var on = sel.indexOf(i) >= 0, ok = rev && rev.ok && rev.ok.indexOf(i) >= 0;
          return h("button", { key: i, type: "button", className: "lvopt" + (on ? " on" : "") + (rev && rev.ok ? (ok ? " ok" : on ? " bad" : " dim") : ""), onClick: function () { toggle(i); }, disabled: !open, "aria-pressed": on }, h("i", null, "ABCDEF"[i]), h("span", null, o));
        })));
        if (kind === "conf") body.push(h("div", { key: "conf", className: "fxl-conf" }, h("p", null, "Wie sicher bist du?"), h("div", null, [[8, "Ich bin mir sicher"], [9, "Eher geraten"]].map(function (c) { return h("button", { key: c[0], type: "button", className: conf === c[0] ? "on" + (c[0] === 9 ? " u" : "") : "", disabled: !open, onClick: function () { setConf(c[0]); } }, c[1]); }))));
        if (kind === "conf" && rev && rev.ok && sel.length) { var good = rev.ok.indexOf(sel[0]) >= 0, sure = conf !== 9; body.push(h("div", { key: "me", className: "fxl-me " + (good ? "ok" : "bad") }, good ? (sure ? "Sicher und richtig. Gefestigt!" : "Richtig, obwohl du geraten hast. Schau dir die Erklärung noch einmal an.") : (sure ? "Du warst sicher, aber das stimmt nicht. Genau das lohnt sich zu klären." : "Geraten und falsch. Gut, dass du es jetzt weißt."))); }
      } else if (kind === "body" && B) {
        var dots = taps.map(function (t) { return '<circle cx="' + (t[0] + 0.5) + '" cy="' + (t[1] * 2 + 1) + '" r="3.2" fill="#BE185D" stroke="#fff" stroke-width="1"/>'; }).join("");
        body.push(h("p", { key: "hint", className: "lvhint" }, open ? (k.taps > 1 ? "Tippe bis zu " + k.taps + " Stellen an. Ein neuer Tipp ersetzt den ältesten." : "Tippe eine Stelle an.") : ""));
        body.push(h("div", { key: "body", className: "fxl-body" + (open ? " live" : ""), onClick: tapBody, dangerouslySetInnerHTML: { __html: B.svg(k.fig, (rev && rev.zones ? B.zonesSvg(k.fig, rev.zones, true) : "") + dots) } }));
        if (open && taps.length) body.push(h("button", { key: "rs", type: "button", className: "btn ghost sm fxl-reset", onClick: function () { setTaps([]); } }, "Zurücksetzen"));
      } else if (kind === "sort") {
        var asg = sel.length === (k.items || []).length ? sel : (k.items || []).map(function (_, i) { return sel[i] == null ? -1 : sel[i]; });
        body.push(h("div", { key: "sort", className: "fxl-sort" }, (k.items || []).map(function (it, ii) {
          var a = rev && rev.ans ? rev.ans[ii] : null;
          return h("div", { key: ii, className: "fxl-si" + (a != null ? (asg[ii] === a ? " ok" : " bad") : "") }, h("b", null, it), h("div", null, (k.cats || []).map(function (c, ci) { return h("button", { key: ci, type: "button", disabled: !open, className: asg[ii] === ci ? "on" : "", style: { "--sc": (k.colors || [])[ci] }, onClick: function () { var n = asg.slice(); n[ii] = ci; setSel(n); } }, c); })), a != null && asg[ii] !== a ? h("small", null, "Richtig: " + k.cats[a]) : null);
        })));
      } else if (kind === "role") {
        var RC = ["#2563EB", "#DB2777", "#0D9488", "#EA580C"];
        body.splice(body.length - 1, 0, h("div", { key: "role", className: "fxl-rolecard", style: { "--rc": RC[role % 4] } }, h("small", null, "Deine Rolle"), h("b", null, (k.roles || [])[role] || "")));
        body.push(h("div", { key: "w", className: "fxl-word" }, h("textarea", { className: "input", maxLength: 160, rows: 3, value: txt, disabled: !open, onChange: function (e) { setTxt(e.target.value); }, placeholder: "Ein Satz in der Ich-Form aus der Sicht deiner Rolle" })));
      }
      if (rev && rev.pick != null) body.push(h("div", { key: "pick", className: "fxl-exp" }, h("b", null, "Die Klasse hat entschieden: " + "ABCDE"[rev.pick]), rev.cons ? h("p", null, rev.cons) : null));
      if (open) {
        var can = kind === "word" || kind === "estimate" || kind === "role" ? String(txt).trim().length > 0 : kind === "conf" ? sel.length > 0 && conf != null : kind === "body" ? taps.length > 0 : kind === "sort" ? sel.length === (k.items || []).length && sel.every(function (x) { return x >= 0; }) : sel.length > 0 && (kind !== "order" || sel.length === (k.items || []).length);
        var same = answered && sigNow() === sent;
        body.push(h("div", { key: "send", className: "fxl-send" }, h("button", { type: "button", className: "btn", disabled: !can || busy || same, onClick: send }, same ? "Abgegeben ✓" : answered ? "Antwort ändern" : "Antwort abgeben"), answered && h("small", null, "Du kannst deine Antwort ändern, bis die Lehrkraft auflöst.")));
      } else if (ph === "question" || !rev) {
        body.push(h("p", { key: "wait", className: "fxl-look" }, answered ? "Danke! Warte auf die Auflösung." : "Die Abstimmung ist geschlossen."));
      }
      if (rev && rev.exp) body.push(h("div", { key: "exp", className: "fxl-exp" }, h("b", null, "Erklärung"), h("p", null, rev.exp)));
      if (rev && rev.lines) body.push(h("div", { key: "lex", className: "fxl-exp" }, rev.lines.map(function (l, i) { return l ? h("p", { key: i }, h("b", null, (k.opts[i] || "").slice(0, 60) + " … "), l) : null; })));
    }
    return h("div", { className: "lv fxl-s" }, head, title, h("div", { className: "fxl-card" }, body), (err || p.err) && h("p", { className: "lverr" }, err || p.err));
  }
  window.FP_LiveStudent = LiveStudent;
})();
