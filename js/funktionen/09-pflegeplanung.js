/* Fallpfad Training "Pflegeplanung": Pflegeplanung zu Patientenbeispielen schreiben und von einer KI prüfen lassen.
   - Fälle: daten/pflegeplanung-faelle.js (erfundene Personen). Den Erwartungshorizont kennt nur der Server.
   - Aufbau nach dem Pflegeprozess: Informationssammlung, Pflegeprobleme (PESR) mit Ressourcen, Zielen (SMART),
     Maßnahmen und Evaluation, in der Reihenfolge der Priorität.
   - Die Planung bleibt nur auf diesem Gerät (localStorage je Konto). Zur Prüfung geht sie ohne Namen an die
     Edge Function "pflegeplanung", die die Rückmeldung über OpenAI erstellt und nichts speichert.
   - Rückmeldung ist eine Übungshilfe, keine Note. */
(function () {
  var R = window.React;
  if (!R) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect, uR = R.useRef, Fr = R.Fragment;

  function ukey() { var e = window.FP_PROF && window.FP_PROF.email; return e ? String(e).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40) : "lokal"; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function faelle() { return window.FP_PP_FAELLE || []; }
  function leerProblem(art) { return { art: art || "aktuell", problem: "", ursache: "", symptome: "", ressource: "", ziel: "", massnahmen: "", evaluation: "" }; }
  function leerPlan() { return { info: "", probleme: [leerProblem()], at: 0 }; }
  function avatar(av) { return window.PXAV ? window.PXAV.svg(av, "neutral") : ""; }

  var ICO = {
    left: '<path d="M15 18l-6-6 6-6"/>', right: '<path d="M9 6l6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 3v4M17 5h4"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    chk: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'
  };
  function Ic(p) { return h("svg", { viewBox: "0 0 24 24", width: p.s || 18, height: p.s || 18, fill: "none", stroke: "currentColor", strokeWidth: p.w || 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ICO[p.k] || ICO.info } }); }

  var css = [
    ".pp{display:flex;flex-direction:column;gap:16px;--c:#5856D6}",
    ".pp-intro{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;background:var(--surface);border-radius:20px;padding:20px 22px}",
    ".pp-intro h2{margin:0 0 6px;font-size:22px;letter-spacing:-.02em}.pp-intro p{margin:0;color:var(--muted);line-height:1.55;font-size:15px}",
    ".pp-steps{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.pp-steps span{font-size:12.5px;font-weight:600;padding:5px 10px;border-radius:999px;background:var(--surface2);color:var(--muted)}",
    ".pp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px}",
    ".pp-card{all:unset;box-sizing:border-box;cursor:pointer;background:var(--surface);border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:10px;transition:transform .15s,box-shadow .15s;box-shadow:inset 0 0 0 1px var(--line)}",
    ".pp-card:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--cc) 45%,var(--line)),0 10px 30px -18px rgba(0,0,0,.35)}.pp-card:focus-visible{outline:3px solid var(--accent);outline-offset:2px}",
    ".pp-card .pp-who{display:flex;gap:12px;align-items:center}.pp-av{width:48px;height:48px;flex:0 0 48px;border-radius:50%;overflow:hidden;background:var(--surface2)}.pp-av svg{width:100%;height:100%;display:block}",
    ".pp-card b{font-size:16px;letter-spacing:-.01em;display:block}.pp-card small{color:var(--muted);font-size:13px}",
    ".pp-chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:650;color:var(--cc);background:color-mix(in srgb,var(--cc) 12%,transparent);padding:4px 9px;border-radius:999px;align-self:flex-start}",
    ".pp-card p{margin:0;font-size:14px;line-height:1.5;color:var(--fg)}.pp-meta{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--muted);margin-top:auto}",
    ".pp-score-mini{font-weight:700;color:var(--fg)}",
    ".pp-back{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:4px;color:var(--accent);font-weight:600;font-size:15px}",
    ".pp-layout{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:16px;align-items:start}",
    "@media (max-width:980px){.pp-layout{grid-template-columns:1fr}}",
    ".pp-akte{position:sticky;top:76px;background:var(--surface);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:12px;max-height:calc(100vh - 96px);overflow:auto}",
    "@media (max-width:980px){.pp-akte{position:static;max-height:none}}",
    ".pp-akte h3,.pp-sec h3{margin:0;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:700}",
    ".pp-sit{margin:0;font-size:15px;line-height:1.6}",
    ".pp-dl{margin:0;display:flex;flex-direction:column;border-radius:14px;background:var(--surface2);overflow:hidden}",
    ".pp-dl div{padding:10px 12px;border-bottom:1px solid var(--line)}.pp-dl div:last-child{border-bottom:0}.pp-dl dt{font-size:12.5px;font-weight:700;color:var(--muted);margin-bottom:2px}.pp-dl dd{margin:0;font-size:14px;line-height:1.5}",
    ".pp-main{display:flex;flex-direction:column;gap:14px;min-width:0}",
    ".pp-sec{background:var(--surface);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:12px}",
    ".pp-auftrag{display:flex;gap:10px;align-items:flex-start;background:color-mix(in srgb,var(--c) 9%,var(--surface));border-radius:14px;padding:12px 14px;font-size:14.5px;line-height:1.5}.pp-auftrag svg{color:var(--c);flex:0 0 auto;margin-top:2px}",
    ".pp-field{display:flex;flex-direction:column;gap:5px}.pp-field>span{font-size:13px;font-weight:650}.pp-field>span em{font-style:normal;font-weight:500;color:var(--muted);margin-left:6px}",
    ".pp textarea,.pp input[type=text]{font:inherit;font-size:15px;line-height:1.5;color:var(--fg);background:var(--surface2);border:1px solid transparent;border-radius:12px;padding:10px 12px;resize:vertical;min-height:44px;transition:border-color .15s,background .15s;width:100%;box-sizing:border-box}",
    ".pp textarea:focus,.pp input[type=text]:focus{outline:none;border-color:var(--accent);background:var(--surface)}",
    ".pp-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media (max-width:640px){.pp-two{grid-template-columns:1fr}}",
    ".pp-prob{border-radius:18px;box-shadow:inset 0 0 0 1px var(--line);padding:14px;display:flex;flex-direction:column;gap:12px;background:var(--surface)}",
    ".pp-prob.gut{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--ok) 70%,transparent)}.pp-prob.teilweise{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--warn) 70%,transparent)}.pp-prob.ueberarbeiten{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--bad) 65%,transparent)}",
    ".pp-ph{display:flex;align-items:center;gap:10px}.pp-nr{width:28px;height:28px;flex:0 0 28px;border-radius:9px;display:grid;place-items:center;background:var(--c);color:#fff;font-weight:700;font-size:14px}",
    ".pp-ph b{flex:1;min-width:0;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".pp-ib{all:unset;cursor:pointer;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:var(--muted)}.pp-ib:hover{background:var(--surface2);color:var(--fg)}.pp-ib:disabled{opacity:.3;cursor:default}",
    ".pp-seg{display:inline-grid;grid-auto-flow:column;padding:3px;border-radius:11px;background:var(--surface2);gap:2px;align-self:flex-start}",
    ".pp-seg button{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:6px 12px;border-radius:8px;color:var(--muted)}.pp-seg button[aria-pressed=true]{background:var(--surface);color:var(--fg);box-shadow:0 1px 3px rgba(0,0,0,.14)}",
    ".pp-add{all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:16px;border:1.5px dashed var(--line);color:var(--accent);font-weight:600;font-size:15px}.pp-add:hover{background:var(--surface2)}",
    ".pp-help summary{cursor:pointer;font-weight:650;font-size:14.5px;list-style:none;display:flex;align-items:center;gap:8px;color:var(--accent)}.pp-help summary::-webkit-details-marker{display:none}",
    ".pp-help ul{margin:10px 0 0;padding-left:18px;font-size:14px;line-height:1.6}.pp-help li{margin-bottom:4px}",
    ".pp-bar{position:sticky;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:5;display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:var(--glass,var(--surface));backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-radius:18px;padding:10px;box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -20px rgba(0,0,0,.4)}",
    "@media (max-width:700px){.pp-bar{bottom:calc(env(safe-area-inset-bottom,0px) + 86px)}}",
    ".pp-bar .btn{display:inline-flex;align-items:center;gap:8px}.pp-saved{font-size:12.5px;color:var(--muted);margin-left:auto;padding-right:6px}",
    ".pp-fb{background:var(--surface);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:16px;animation:pp-in .35s cubic-bezier(.22,1,.36,1) both}",
    "@keyframes pp-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    ".pp-top{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.pp-top h3{margin:0 0 4px;font-size:20px;letter-spacing:-.02em;text-transform:none;color:var(--fg)}.pp-top p{margin:0;line-height:1.55;font-size:15px}",
    ".pp-ring{width:86px;height:86px;flex:0 0 86px;position:relative}.pp-ring svg{width:100%;height:100%;transform:rotate(-90deg)}.pp-ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:24px;letter-spacing:-.02em}",
    ".pp-krit{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}",
    ".pp-k{background:var(--surface2);border-radius:14px;padding:11px 12px;display:flex;flex-direction:column;gap:6px}.pp-k div{display:flex;justify-content:space-between;font-size:13.5px;font-weight:650}.pp-k small{color:var(--muted);font-size:12.5px;line-height:1.45}",
    ".pp-prog{height:6px;border-radius:6px;background:color-mix(in srgb,var(--fg) 8%,transparent);overflow:hidden}.pp-prog i{display:block;height:100%;border-radius:6px;background:var(--c);transition:width .6s}",
    ".pp-list{display:flex;flex-direction:column;gap:8px}.pp-li{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.5}.pp-li>span{width:26px;height:26px;flex:0 0 26px;border-radius:8px;display:grid;place-items:center;background:color-mix(in srgb,var(--lc) 14%,transparent);color:var(--lc)}",
    ".pp-safe{background:var(--bad-soft);border-radius:14px;padding:12px 14px}.pp-safe b{color:var(--bad-ink)}",
    ".pp-pfb{border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.5;background:var(--surface2)}.pp-pfb .pp-badge{display:inline-block;font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;margin-right:6px}",
    ".pp-badge.gut{background:var(--ok-soft);color:var(--ok-ink)}.pp-badge.teilweise{background:var(--warn-soft);color:var(--warn-ink)}.pp-badge.ueberarbeiten{background:var(--bad-soft);color:var(--bad-ink)}",
    ".pp-pfb i{display:block;font-style:normal;margin-top:6px;padding-left:10px;border-left:3px solid var(--c);color:var(--fg)}",
    ".pp-note{font-size:12.5px;color:var(--muted);line-height:1.5;margin:0}",
    ".pp-err{background:var(--bad-soft);color:var(--bad-ink);border-radius:12px;padding:10px 12px;font-size:14px}",
    ".pp-busy{display:flex;align-items:center;gap:12px;font-size:14.5px;color:var(--muted)}.pp-dots{display:inline-flex;gap:4px}.pp-dots i{width:7px;height:7px;border-radius:50%;background:var(--c);animation:pp-b 1s infinite ease-in-out}.pp-dots i:nth-child(2){animation-delay:.15s}.pp-dots i:nth-child(3){animation-delay:.3s}",
    "@keyframes pp-b{0%,80%,100%{transform:scale(.6);opacity:.5}40%{transform:scale(1);opacity:1}}",
    ".pp-hist{display:flex;gap:6px;flex-wrap:wrap}.pp-hist span{font-size:12.5px;font-weight:650;padding:4px 9px;border-radius:999px;background:var(--surface2);color:var(--muted)}",
    "@media (prefers-reduced-motion:reduce){.pp-fb,.pp-dots i{animation:none}.pp-card{transition:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "fp-pp-css"; st.textContent = css; document.head.appendChild(st);

  function stufe(p) { return p >= 90 ? "Sehr stark ausgearbeitet" : p >= 75 ? "Gut gemacht, kleine Lücken" : p >= 55 ? "Solide Basis, da geht noch was" : p >= 35 ? "Wichtige Teile fehlen noch" : "Fang noch einmal in Ruhe an"; }
  function Ring(p) {
    var r = 36, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, p.v || 0));
    return h("div", { className: "pp-ring", role: "img", "aria-label": v + " von 100 Punkten" },
      h("svg", { viewBox: "0 0 86 86" }, h("circle", { cx: 43, cy: 43, r: r, fill: "none", stroke: "color-mix(in srgb,var(--fg) 8%,transparent)", strokeWidth: 8 }),
        h("circle", { cx: 43, cy: 43, r: r, fill: "none", stroke: "var(--c)", strokeWidth: 8, strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c * (1 - v / 100), style: { transition: "stroke-dashoffset .8s" } })),
      h("b", null, v));
  }

  /* Rückmeldung im Demo-Konto (ohne Server): einfache Prüfung der Vollständigkeit, klar als Beispiel gekennzeichnet */
  function demoFeedback(plan) {
    var P = plan.probleme, n = P.length;
    var fill = function (x) { return ["problem", "ursache", "symptome", "ressource", "ziel", "massnahmen", "evaluation"].filter(function (k) { return String(x[k] || "").trim().length > 8; }).length / 7; };
    var smart = function (z) { return /\d/.test(z) && /(bis|nach|innerhalb|täglich|tag|stunde|woche|schicht)/i.test(z); };
    var avg = n ? P.reduce(function (s, x) { return s + fill(x); }, 0) / n : 0;
    var zielOk = n ? P.filter(function (x) { return smart(x.ziel || ""); }).length / n : 0;
    var g = Math.round(Math.min(100, avg * 40 + zielOk * 15 + Math.min(n, 4) / 4 * 45));
    return {
      demo: true, gesamt: g,
      zusammenfassung: "Beispielrückmeldung im Demo-Konto: Hier wird nur geprüft, ob deine Planung vollständig ausgefüllt ist und die Ziele messbar sind. Mit einem Schulkonto bewertet die KI auch den Inhalt.",
      kriterien: [
        { name: "Probleme erkannt und priorisiert", punkte: Math.round(Math.min(n, 4) / 4 * 100), kommentar: n + " Problem" + (n === 1 ? "" : "e") + " angelegt." },
        { name: "Probleme formuliert (PESR)", punkte: Math.round(n ? P.reduce(function (s, x) { return s + (x.problem && x.ursache && x.symptome ? 1 : 0); }, 0) / n * 100 : 0), kommentar: "Problem, Ursache und Symptome ausgefüllt?" },
        { name: "Ziele", punkte: Math.round(zielOk * 100), kommentar: "Messbar mit Zeitangabe?" },
        { name: "Maßnahmen", punkte: Math.round(n ? P.reduce(function (s, x) { return s + Math.min(1, String(x.massnahmen || "").length / 160); }, 0) / n * 100 : 0), kommentar: "Wer, was, wann, wie oft, womit?" },
        { name: "Ressourcen und Evaluation", punkte: Math.round(n ? P.reduce(function (s, x) { return s + (x.ressource ? .5 : 0) + (x.evaluation ? .5 : 0); }, 0) / n * 100 : 0), kommentar: "Ressourcen und Evaluationszeitpunkt eingetragen?" }
      ],
      probleme: P.map(function (x, i) { var f = fill(x); return { nr: i + 1, bewertung: f > .85 && smart(x.ziel || "") ? "gut" : f > .5 ? "teilweise" : "ueberarbeiten", rueckmeldung: f > .85 ? "Vollständig ausgefüllt." : "Noch nicht alle Felder ausgefüllt.", besser: smart(x.ziel || "") ? "" : "Ziel mit Zeitangabe und Messgröße, z. B. „… bis zum Ende der Schicht …“" }; }),
      fehlende_aspekte: [], sicherheitshinweise: [], staerken: n ? ["Du hast eine Struktur nach dem Pflegeprozess angelegt."] : [], naechster_schritt: zielOk < 1 ? "Formuliere deine Ziele messbar und mit Zeitangabe." : "Prüfe, ob deine Maßnahmen zu den Ursachen passen."
    };
  }

  function invoke(fall, plan) {
    var lang = ""; try { lang = localStorage.getItem("fp-lang") || ""; } catch (e) {}
    if (window.FP_DEMO_ACC || !window.FP_SBC) return new Promise(function (ok) { setTimeout(function () { ok({ rueckmeldung: demoFeedback(plan) }); }, 900); });
    if (navigator.onLine === false) return Promise.reject(new Error("Du bist offline. Deine Planung ist gespeichert, prüfen lassen kannst du sie, sobald du wieder online bist."));
    return Promise.resolve().then(function () { return window.FP_SBC(); }).then(function (sb) {
      if (!sb || !sb.functions) return { rueckmeldung: demoFeedback(plan) };
      var body = { fall: fall.id, lang: lang === "einfach" ? "einfach" : "de", plan: { info: plan.info, probleme: plan.probleme } };
      return sb.functions.invoke("pflegeplanung", { body: body }).then(function (r) {
        if (r.error) {
          var ctx = r.error.context;
          if (ctx && ctx.json) return ctx.json().then(function (j) { throw new Error((j && j.error) || "Die Rückmeldung hat gerade nicht geklappt."); }, function () { throw new Error("Die Rückmeldung hat gerade nicht geklappt."); });
          throw new Error("Die Rückmeldung hat gerade nicht geklappt.");
        }
        return r.data;
      });
    });
  }

  function planAlsText(fall, plan) {
    var t = "Pflegeplanung: " + fall.person.name + " (" + fall.titel + ")\n\nInformationssammlung und Ressourcen:\n" + (plan.info || "–") + "\n";
    plan.probleme.forEach(function (x, i) {
      t += "\n" + (i + 1) + ". Pflegeproblem (" + x.art + "): " + (x.problem || "–") + "\n   Ursache: " + (x.ursache || "–") + "\n   Symptome: " + (x.symptome || "–") +
        "\n   Ressourcen: " + (x.ressource || "–") + "\n   Ziel: " + (x.ziel || "–") + "\n   Maßnahmen: " + (x.massnahmen || "–") + "\n   Evaluation: " + (x.evaluation || "–") + "\n";
    });
    return t;
  }

  function Feld(p) {
    return h("label", { className: "pp-field" }, h("span", null, p.label, p.tip ? h("em", null, p.tip) : null),
      h("textarea", { rows: p.rows || 2, value: p.value || "", placeholder: p.ph || "", maxLength: p.max || 2500, "data-notr": "1", onChange: function (e) { p.onChange(e.target.value); } }));
  }

  function Problem(p) {
    var x = p.x, set = function (k, v) { var o = Object.assign({}, x); o[k] = v; p.onChange(o); }, fb = p.fb;
    return h("div", { className: "pp-prob" + (fb ? " " + fb.bewertung : "") },
      h("div", { className: "pp-ph" }, h("span", { className: "pp-nr", "aria-hidden": "true" }, p.i + 1), h("b", null, x.problem ? x.problem.split(/[.\n]/)[0] : "Neues Pflegeproblem"),
        h("button", { type: "button", className: "pp-ib", "aria-label": "Priorität höher", disabled: p.i === 0, onClick: p.up }, h(Ic, { k: "up" })),
        h("button", { type: "button", className: "pp-ib", "aria-label": "Priorität niedriger", disabled: p.last, onClick: p.down }, h(Ic, { k: "down" })),
        h("button", { type: "button", className: "pp-ib", "aria-label": "Problem löschen", onClick: p.del }, h(Ic, { k: "trash", s: 17 }))),
      h("div", { className: "pp-seg", role: "group", "aria-label": "Art des Problems" }, [["aktuell", "Aktuell"], ["potenziell", "Potenziell"], ["verdeckt", "Verdeckt"]].map(function (a) {
        return h("button", { key: a[0], type: "button", "aria-pressed": x.art === a[0], onClick: function () { set("art", a[0]); } }, a[1]);
      })),
      h(Feld, { label: "Pflegeproblem (P)", tip: "Was ist das Problem der Person?", value: x.problem, ph: "z. B. Frau M. hat Atemnot bei Belastung …", onChange: function (v) { set("problem", v); } }),
      h("div", { className: "pp-two" },
        h(Feld, { label: "Ursache (E)", tip: "Einflussfaktoren", value: x.ursache, ph: "… durch …", onChange: function (v) { set("ursache", v); } }),
        h(Feld, { label: "Symptome (S)", tip: "Woran erkennbar?", value: x.symptome, ph: "… erkennbar an …", onChange: function (v) { set("symptome", v); } })),
      h(Feld, { label: "Ressourcen (R)", tip: "Was kann die Person selbst?", value: x.ressource, onChange: function (v) { set("ressource", v); } }),
      h(Feld, { label: "Pflegeziel", tip: "messbar, mit Zeitangabe", value: x.ziel, ph: "Nahziel: … bis … Fernziel: …", onChange: function (v) { set("ziel", v); } }),
      h(Feld, { label: "Maßnahmen", tip: "Wer? Was? Wann? Wie oft? Womit?", rows: 4, value: x.massnahmen, ph: "- …\n- …", onChange: function (v) { set("massnahmen", v); } }),
      h(Feld, { label: "Evaluation", tip: "Wann und woran überprüfen?", rows: 1, value: x.evaluation, onChange: function (v) { set("evaluation", v); } }),
      fb ? h("div", { className: "pp-pfb" }, h("span", { className: "pp-badge " + fb.bewertung }, fb.bewertung === "gut" ? "Gut" : fb.bewertung === "teilweise" ? "Teilweise" : "Überarbeiten"), fb.rueckmeldung, fb.besser ? h("i", null, "Beispiel: " + fb.besser) : null) : null);
  }

  function Feedback(p) {
    var r = p.r;
    return h("section", { className: "pp-fb", "aria-live": "polite", ref: p.refEl },
      h("div", { className: "pp-top" }, h(Ring, { v: r.gesamt }),
        h("div", { style: { flex: "1 1 260px" } }, h("h3", null, stufe(r.gesamt)), h("p", null, r.zusammenfassung))),
      r.sicherheitshinweise && r.sicherheitshinweise.length ? h("div", { className: "pp-safe" }, h("b", null, "Achtung, fachlich kritisch"), h("div", { className: "pp-list", style: { marginTop: 8 } }, r.sicherheitshinweise.map(function (s, i) { return h("div", { key: i, className: "pp-li", style: { "--lc": "var(--bad)" } }, h("span", null, h(Ic, { k: "alert", s: 15 })), h("div", null, s)); }))) : null,
      h("div", { className: "pp-krit" }, r.kriterien.map(function (k) {
        return h("div", { key: k.name, className: "pp-k" }, h("div", null, h("span", null, k.name), h("span", null, k.punkte)), h("div", { className: "pp-prog" }, h("i", { style: { width: k.punkte + "%" } })), k.kommentar ? h("small", null, k.kommentar) : null);
      })),
      r.staerken && r.staerken.length ? h("div", null, h("h3", { style: { marginBottom: 8 } }, "Das ist dir gelungen"), h("div", { className: "pp-list" }, r.staerken.map(function (s, i) { return h("div", { key: i, className: "pp-li", style: { "--lc": "var(--ok)" } }, h("span", null, h(Ic, { k: "chk", s: 15 })), h("div", null, s)); }))) : null,
      r.fehlende_aspekte && r.fehlende_aspekte.length ? h("div", null, h("h3", { style: { marginBottom: 8 } }, "Denkanstöße"), h("div", { className: "pp-list" }, r.fehlende_aspekte.map(function (s, i) { return h("div", { key: i, className: "pp-li", style: { "--lc": "var(--warn)" } }, h("span", null, h(Ic, { k: "bulb", s: 15 })), h("div", null, s)); }))) : null,
      r.naechster_schritt ? h("div", { className: "pp-auftrag" }, h(Ic, { k: "right", s: 18 }), h("div", null, h("b", null, "Dein nächster Schritt: "), r.naechster_schritt)) : null,
      h("p", { className: "pp-note" }, r.demo ? "Beispielrückmeldung ohne KI (Demo-Konto)." : "Rückmeldung einer KI (OpenAI) zu deiner Übung. Sie ist keine Note und kann Fehler enthalten. Sprich offene Fragen mit deiner Lehrkraft oder Praxisanleitung durch."));
  }

  function Editor(p) {
    var fall = p.fall, uk = ukey(), KEY = "fp-pp-" + uk + "-" + fall.id;
    var st = uS(function () { return lsGet(KEY, null) || { plan: leerPlan(), fb: null, hist: [] }; }), S = st[0];
    var busy = uS(false), err = uS(null), saved = uS(false), copied = uS(false), fbRef = uR(null), timer = uR(null);
    uE(function () { clearTimeout(timer.current); timer.current = setTimeout(function () { lsSet(KEY, S); saved[1](true); }, 400); return function () { clearTimeout(timer.current); }; }, [S]);
    function setPlan(fn) { saved[1](false); st[1](function (s) { return Object.assign({}, s, { plan: Object.assign({}, fn(s.plan), { at: Date.now() }) }); }); }
    function setProb(i, v) { setPlan(function (pl) { var a = pl.probleme.slice(); a[i] = v; return Object.assign({}, pl, { probleme: a }); }); }
    function move(i, d) { setPlan(function (pl) { var a = pl.probleme.slice(), j = i + d; if (j < 0 || j >= a.length) return pl; var t = a[i]; a[i] = a[j]; a[j] = t; return Object.assign({}, pl, { probleme: a }); }); st[1](function (s) { return Object.assign({}, s, { fb: null }); }); }
    function del(i) {
      var x = S.plan.probleme[i]; if ((x.problem || x.massnahmen || x.ziel) && !window.confirm("Dieses Pflegeproblem löschen?")) return;
      setPlan(function (pl) { var a = pl.probleme.filter(function (_, k) { return k !== i; }); return Object.assign({}, pl, { probleme: a.length ? a : [leerProblem()] }); });
      st[1](function (s) { return Object.assign({}, s, { fb: null }); });
    }
    function add() { setPlan(function (pl) { return Object.assign({}, pl, { probleme: pl.probleme.concat([leerProblem(pl.probleme.length >= 2 ? "potenziell" : "aktuell")]) }); }); }
    function pruefen() {
      if (busy[0]) return;
      err[1](null); busy[1](true);
      invoke(fall, S.plan).then(function (d) {
        var r = d && d.rueckmeldung; if (!r) throw new Error("Die Rückmeldung war leer.");
        st[1](function (s) { return Object.assign({}, s, { fb: r, hist: [{ at: Date.now(), g: r.gesamt }].concat(s.hist || []).slice(0, 8) }); });
        setTimeout(function () { if (fbRef.current) fbRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
      }, function (e) { err[1](e.message || "Die Rückmeldung hat gerade nicht geklappt."); }).then(function () { busy[1](false); });
    }
    function kopieren() { try { navigator.clipboard.writeText(planAlsText(fall, S.plan)).then(function () { copied[1](true); setTimeout(function () { copied[1](false); }, 1800); }); } catch (e) {} }
    var fbFor = function (i) { return S.fb && (S.fb.probleme || []).filter(function (x) { return x.nr === i + 1; })[0]; };
    var ok = S.plan.probleme.some(function (x) { return (x.problem || "").trim().length > 5; });

    return h("div", { className: "pp", style: { "--c": fall.farbe || "#5856D6" } },
      h("button", { type: "button", className: "pp-back", onClick: p.back }, h(Ic, { k: "left" }), "Alle Patientenbeispiele"),
      h("div", { className: "pp-layout" },
        h("aside", { className: "pp-akte", "aria-label": "Fallakte" },
          h("div", { className: "pp-who", style: { display: "flex", gap: 12, alignItems: "center" } }, h("span", { className: "pp-av", dangerouslySetInnerHTML: { __html: avatar(fall.person.av) } }),
            h("div", null, h("b", { style: { fontSize: 18, letterSpacing: "-.01em", display: "block" } }, fall.person.name + ", " + fall.person.alter), h("small", { style: { color: "var(--muted)" } }, fall.setting))),
          h("h3", null, "Situation"), h("p", { className: "pp-sit" }, fall.situation),
          h("h3", null, "Pflegeanamnese und Befunde"),
          h("dl", { className: "pp-dl" }, fall.daten.map(function (d, i) { return h("div", { key: i }, h("dt", null, d[0]), h("dd", null, d[1])); })),
          h("p", { className: "pp-note" }, "Erfundene Person. Trage in Fallpfad nie Daten echter Patientinnen und Patienten ein.")),
        h("div", { className: "pp-main" },
          h("div", { className: "pp-auftrag" }, h(Ic, { k: "file", s: 18 }), h("div", null, h("b", null, "Dein Auftrag: "), fall.auftrag)),
          h("details", { className: "pp-sec pp-help" }, h("summary", null, h(Ic, { k: "bulb", s: 17 }), "So formulierst du eine gute Pflegeplanung"),
            h("ul", null,
              h("li", null, h("b", null, "PESR: "), "Problem, Ursache (E), Symptome und Ressourcen. Beispiel: „Herr K. kann sich nicht selbst waschen (P) durch Atemnot bei Belastung (E), erkennbar an Abbruch nach zwei Minuten und SpO₂-Abfall (S). Er kann Gesicht und Oberkörper im Sitzen selbst waschen (R).“"),
              h("li", null, h("b", null, "Ziele SMART: "), "aus Sicht der Person, beobachtbar, realistisch, mit Zeitangabe. Nicht „Atmung bessert sich“, sondern „Herr K. wendet bis morgen Abend bei Atemnot selbstständig die Lippenbremse an“."),
              h("li", null, h("b", null, "Maßnahmen: "), "wer, was, wann, wie oft, wie und womit. Sie setzen an der Ursache an und nutzen die Ressourcen."),
              h("li", null, h("b", null, "Priorität: "), "Lebens- und Sicherheitsprobleme nach oben. Mit den Pfeilen änderst du die Reihenfolge."),
              h("li", null, h("b", null, "Potenzielle Probleme: "), "Risiken, die noch nicht eingetreten sind (z. B. Sturz, Dekubitus, Pneumonie)."))),
          h("section", { className: "pp-sec" }, h("h3", null, "1 · Informationssammlung und Ressourcen"),
            h(Feld, { label: "Was ist für die Planung wichtig?", tip: "Gewohnheiten, Wünsche, übergreifende Ressourcen", rows: 3, value: S.plan.info, onChange: function (v) { setPlan(function (pl) { return Object.assign({}, pl, { info: v }); }); } })),
          h("section", { className: "pp-sec" }, h("h3", null, "2 · Pflegeprobleme, Ziele und Maßnahmen"),
            S.plan.probleme.map(function (x, i) {
              return h(Problem, { key: i, i: i, x: x, last: i === S.plan.probleme.length - 1, fb: fbFor(i), onChange: function (v) { setProb(i, v); }, up: function () { move(i, -1); }, down: function () { move(i, 1); }, del: function () { del(i); } });
            }),
            S.plan.probleme.length < 10 ? h("button", { type: "button", className: "pp-add", onClick: add }, h(Ic, { k: "plus" }), "Pflegeproblem hinzufügen") : null),
          err[0] ? h("div", { className: "pp-err", role: "alert" }, err[0]) : null,
          busy[0] ? h("div", { className: "pp-sec" }, h("div", { className: "pp-busy" }, h("span", { className: "pp-dots", "aria-hidden": "true" }, h("i"), h("i"), h("i")), "Deine Planung wird gelesen und mit dem Erwartungshorizont verglichen …")) : null,
          S.fb && !busy[0] ? h(Feedback, { r: S.fb, refEl: fbRef }) : null,
          S.hist && S.hist.length > 1 ? h("div", { className: "pp-hist", "aria-label": "Bisherige Rückmeldungen" }, h("span", null, "Verlauf"), S.hist.slice().reverse().map(function (x, i) { return h("span", { key: i }, x.g); })) : null,
          h("div", { className: "pp-bar" },
            h("button", { type: "button", className: "btn", disabled: busy[0] || !ok, onClick: pruefen }, h(Ic, { k: "spark", s: 17 }), S.fb ? "Erneut prüfen lassen" : "Von der KI prüfen lassen"),
            h("button", { type: "button", className: "btn ghost", onClick: kopieren }, h(Ic, { k: copied[0] ? "chk" : "copy", s: 16 }), copied[0] ? "Kopiert" : "Als Text kopieren"),
            h("span", { className: "pp-saved" }, saved[0] ? "Auf diesem Gerät gespeichert" : "…")),
          h("p", { className: "pp-note" }, "Zur Prüfung gehen nur deine Planung und das erfundene Fallbeispiel an einen KI-Dienst (OpenAI), ohne Namen oder E-Mail. Fallpfad speichert die Planung nur auf diesem Gerät."))));
  }

  function Uebersicht(p) {
    var uk = ukey();
    return h("div", { className: "pp" },
      h("div", { className: "pp-intro" },
        h("div", null, h("h2", null, "Pflegeplanung üben"),
          h("p", null, "Wähle ein Patientenbeispiel, lies die Fallakte und schreib deine Pflegeplanung. Eine KI vergleicht sie mit dem Erwartungshorizont deiner Schule und gibt dir eine Rückmeldung: was gut ist, was fehlt und wie du es besser formulierst."),
          h("div", { className: "pp-steps", "aria-hidden": "true" }, ["Informationen", "Probleme (PESR)", "Ressourcen", "Ziele", "Maßnahmen", "Evaluation"].map(function (x) { return h("span", { key: x }, x); })))),
      h("div", { className: "pp-grid" }, faelle().map(function (f) {
        var s = lsGet("fp-pp-" + uk + "-" + f.id, null), last = s && s.hist && s.hist[0];
        var begonnen = s && s.plan && s.plan.probleme.some(function (x) { return x.problem; });
        return h("button", { key: f.id, type: "button", className: "pp-card", style: { "--cc": f.farbe }, onClick: function () { p.open(f.id); } },
          h("span", { className: "pp-chip" }, f.setting),
          h("span", { className: "pp-who" }, h("span", { className: "pp-av", dangerouslySetInnerHTML: { __html: avatar(f.person.av) } }), h("span", null, h("b", null, f.titel), h("small", null, f.person.name + ", " + f.person.alter + (f.person.alter < 18 ? " Jahre" : "")))),
          h("p", null, f.kurz),
          h("span", { className: "pp-meta" }, h("span", null, f.jahr + ". Ausbildungsjahr"), last ? h("span", null, "Zuletzt ", h("span", { className: "pp-score-mini" }, last.g)) : begonnen ? h("span", null, "Entwurf") : h("span", null, "Neu")));
      })),
      h("p", { className: "pp-note" }, "Alle Personen sind erfunden. Die Rückmeldung ist eine Übungshilfe und keine Note."));
  }

  function Pflegeplanung() {
    var sel = uS(null);
    var fall = sel[0] && faelle().filter(function (f) { return f.id === sel[0]; })[0];
    function top() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); } }
    if (fall) return h(Editor, { key: fall.id, fall: fall, back: function () { sel[1](null); top(); } });
    return h(Uebersicht, { open: function (id) { sel[1](id); top(); } });
  }
  window.FP_Pflegeplanung = Pflegeplanung;
})();
