/* Fallpfad Training "Kommunikation": Sprachsimulationen mit KI-Gesprächspersonen.
   Ablauf: Kategorien → Gespräche → Vorbereitung → Live-Gespräch (WebRTC mit der OpenAI Realtime API) → Auswertung.
   Der API-Schlüssel bleibt auf dem Server: Die Edge Function "gespraech-sitzung" liefert einen kurzlebigen Schlüssel,
   "gespraech-auswertung" wertet die Mitschrift aus. Ton und Mitschrift werden nicht auf dem Server gespeichert.
   Zum Testen ohne Server: window.FP_KOMM_MOCK(opts) und window.FP_KOMM_MOCK_EVAL(body) können die Verbindung ersetzen. */
(function () {
  var R = window.React, D = window.FP_KOMM_DATA;
  if (!R || !D) return;
  var h = R.createElement, uS = R.useState, uE = R.useEffect, uR = R.useRef, Fr = R.Fragment, RD = window.ReactDOM;
  function portal(el) { return RD && RD.createPortal ? RD.createPortal(el, document.body) : el; }
  var CONSENT_KEY = "fp-komm-einwilligung-v1";

  /* ---------- Stil ---------- */
  var css = [
    ".km{--c:var(--accent);display:flex;flex-direction:column;gap:14px}",
    ".km-intro{font-size:15px;color:var(--muted);margin:0;line-height:1.5;max-width:62ch}",
    ".km-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}",
    ".km-cat{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:18px;background:var(--surface);border:1px solid var(--line);position:relative;overflow:hidden;transition:transform .2s cubic-bezier(.22,1,.36,1),border-color .2s,box-shadow .2s;min-height:150px}",
    ".km-cat:hover{border-color:color-mix(in srgb,var(--c) 45%,var(--line));box-shadow:0 8px 26px -14px color-mix(in srgb,var(--c) 55%,transparent)}",
    ".km-cat:focus-visible,.km-sc:focus-visible{outline:3px solid color-mix(in srgb,var(--c) 55%,transparent);outline-offset:2px}",
    ".km-cat:before{content:'';position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;background:color-mix(in srgb,var(--c) 10%,transparent)}",
    ".km-ic{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 14%,transparent);color:var(--c);flex-shrink:0;position:relative}",
    ".km-cat b{font-size:16.5px;letter-spacing:-.015em;color:var(--fg);position:relative}.km-cat p{margin:0;font-size:13.5px;color:var(--muted);line-height:1.45;position:relative}",
    ".km-catf{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12.5px;color:var(--muted);position:relative}",
    ".km-avs{display:flex}.km-avs .pxavw{width:28px;height:28px;margin-left:-8px;box-shadow:0 0 0 2px var(--surface)}.km-avs .pxavw:first-child{margin-left:0}",
    ".km-back{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:4px;color:var(--accent);font-weight:600;font-size:14.5px;padding:4px 0}",
    ".km-h{display:flex;align-items:center;gap:12px}.km-h h2{margin:0;font-size:21px;letter-spacing:-.02em}.km-h p{margin:2px 0 0;color:var(--muted);font-size:14px}",
    ".km-list{display:flex;flex-direction:column;gap:10px}",
    ".km-sc{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:14px;padding:14px;border-radius:16px;background:var(--surface);border:1px solid var(--line);transition:border-color .2s}",
    ".km-sc:hover{border-color:color-mix(in srgb,var(--c) 45%,var(--line))}",
    ".km-sc .pxavw{width:52px;height:52px}.km-sct{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.km-sct b{font-size:15.5px;color:var(--fg);letter-spacing:-.01em}.km-sct span{font-size:13px;color:var(--muted)}",
    ".km-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.km-tag{font-size:11.5px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--fill,var(--surface2));color:var(--muted)}",
    ".km-score{flex-shrink:0;min-width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px;color:var(--c);background:color-mix(in srgb,var(--c) 12%,transparent)}",
    ".km-card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:18px}",
    ".km-person{display:flex;gap:16px;align-items:center}.km-person .pxavw{width:84px;height:84px}.km-person b{font-size:19px;letter-spacing:-.02em;display:block}.km-person span{color:var(--muted);font-size:14px;display:block;margin-top:2px}",
    ".km-sec{margin-top:14px}.km-sec h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600}.km-sec p{margin:0;line-height:1.55;font-size:15px}",
    ".km-goals{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.km-goals li{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.45}",
    ".km-goals i{flex-shrink:0;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 14%,transparent);color:var(--c);font-style:normal;font-size:12px;font-weight:700;margin-top:1px}",
    ".km-tip{all:unset;cursor:pointer;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;background:var(--warn-soft,#fff7e6);color:var(--fg);font-size:14.5px;line-height:1.45}",
    ".km-seg{display:inline-flex;padding:3px;border-radius:12px;background:var(--fill,var(--surface2));gap:2px}.km-seg button{all:unset;cursor:pointer;padding:8px 14px;border-radius:9px;font-size:14px;font-weight:600;color:var(--muted);display:inline-flex;gap:6px;align-items:center}",
    ".km-seg button[aria-pressed=true]{background:var(--surface);color:var(--fg);box-shadow:0 1px 3px rgba(0,0,0,.12)}",
    ".km-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}",
    ".km-note{font-size:13px;color:var(--muted);line-height:1.5;margin:0}",
    ".km-err{padding:12px 14px;border-radius:14px;background:var(--bad-soft,#fdecea);color:var(--bad-ink,#b00020);font-size:14.5px;line-height:1.45}",
    /* Gespräch */
    ".km-stage{position:relative;border-radius:24px;overflow:hidden;background:radial-gradient(120% 90% at 50% 0%,color-mix(in srgb,var(--c) 22%,var(--surface)) 0%,var(--surface) 70%);border:1px solid var(--line);padding:18px 16px 16px;display:flex;flex-direction:column;align-items:center;gap:6px;min-height:min(78vh,640px)}",
    ".km-top{align-self:stretch;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:13px;color:var(--muted)}",
    ".km-live{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--fg)}.km-live i{width:8px;height:8px;border-radius:50%;background:var(--bad,#ff3b30);animation:kmblink 1.4s infinite}",
    ".km-live.wait i{background:var(--warn,#ff9500)}.km-live.off i{background:var(--muted);animation:none}",
    "@keyframes kmblink{50%{opacity:.35}}",
    ".km-timer{font-variant-numeric:tabular-nums;font-weight:600;padding:4px 10px;border-radius:999px;background:var(--fill,var(--surface2));color:var(--fg)}.km-timer.low{background:var(--warn-soft);color:var(--warn-ink)}",
    ".km-orb{position:relative;width:170px;height:170px;margin:14px 0 6px;display:grid;place-items:center}",
    ".km-orb .pxavw{width:150px;height:150px;position:relative;z-index:2;box-shadow:0 10px 40px -12px color-mix(in srgb,var(--c) 60%,transparent)}",
    ".km-ring{position:absolute;inset:10px;border-radius:50%;background:color-mix(in srgb,var(--c) 28%,transparent);transform:scale(calc(1 + var(--lvl,0) * .32));transition:transform .08s linear;z-index:1}",
    ".km-ring.r2{inset:0;background:color-mix(in srgb,var(--c) 12%,transparent);transform:scale(calc(1 + var(--lvl,0) * .5))}",
    ".km-name{font-size:19px;font-weight:700;letter-spacing:-.02em;text-align:center}.km-state{font-size:13.5px;color:var(--muted);min-height:20px;text-align:center}",
    ".km-dots{display:inline-flex;gap:3px;margin-left:4px;vertical-align:middle}.km-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;animation:kmdot 1s infinite}.km-dots i:nth-child(2){animation-delay:.15s}.km-dots i:nth-child(3){animation-delay:.3s}",
    "@keyframes kmdot{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}",
    ".km-cap{align-self:stretch;flex:1;min-height:150px;max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:10px 2px;margin-top:6px;scroll-behavior:smooth;mask-image:linear-gradient(to bottom,transparent 0,#000 18px)}",
    ".km-msg{max-width:86%;padding:9px 13px;border-radius:16px;font-size:15px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}",
    ".km-msg.ki{align-self:flex-start;background:var(--surface);border:1px solid var(--line);border-bottom-left-radius:6px}",
    ".km-msg.du{align-self:flex-end;background:var(--accent);color:var(--on-accent,#fff);border-bottom-right-radius:6px}",
    ".km-msg.pend{opacity:.6}",
    ".km-hint{align-self:center;text-align:center;font-size:14px;color:var(--muted);padding:8px 14px;border-radius:12px;background:var(--fill,var(--surface2));max-width:90%}",
    ".km-ctrl{align-self:stretch;display:flex;justify-content:center;align-items:center;gap:14px;margin-top:8px}",
    ".km-cb{all:unset;cursor:pointer;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:var(--fill,var(--surface2));color:var(--fg);transition:transform .12s,background .2s}",
    ".km-cb:active{transform:scale(.94)}.km-cb[aria-pressed=true]{background:var(--fg);color:var(--surface)}",
    ".km-cb.end{width:68px;height:68px;background:var(--bad,#ff3b30);color:#fff}",
    ".km-cbl{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11.5px;color:var(--muted)}",
    ".km-type{align-self:stretch;display:flex;gap:8px;margin-top:6px}.km-type input{flex:1;min-width:0;height:44px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--fg);padding:0 14px;font-size:15px}",
    ".km-banner{align-self:stretch;padding:9px 12px;border-radius:12px;font-size:13.5px;background:var(--warn-soft);color:var(--warn-ink);text-align:center}",
    /* Auswertung */
    ".km-res-head{display:flex;gap:18px;align-items:center;flex-wrap:wrap}",
    ".km-big{position:relative;width:118px;height:118px;flex-shrink:0}.km-big svg{width:118px;height:118px;transform:rotate(-90deg)}",
    ".km-big b{position:absolute;inset:0;display:grid;place-items:center;font-size:32px;font-weight:700;letter-spacing:-.03em}.km-big small{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:11.5px;color:var(--muted)}",
    ".km-res-head h2{margin:0;font-size:22px;letter-spacing:-.02em}.km-res-head p{margin:6px 0 0;line-height:1.55;font-size:15px}",
    ".km-dims{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}",
    ".km-dim h3{margin:0;font-size:15.5px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}.km-dim h3 span{font-size:20px;color:var(--c)}",
    ".km-bar{height:8px;border-radius:99px;background:var(--fill,var(--surface2));overflow:hidden;margin:10px 0}.km-bar i{display:block;height:100%;border-radius:99px;background:var(--c);transition:width .9s cubic-bezier(.22,1,.36,1)}",
    ".km-dim p{margin:0 0 8px;font-size:14px;line-height:1.5;color:var(--fg)}",
    ".km-pts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.45}.km-pts li{display:flex;gap:8px}.km-pts li i{flex-shrink:0;font-style:normal;font-weight:700;width:16px}",
    ".km-pts .ok i{color:var(--ok-ink,#1e8e3e)}.km-pts .up i{color:var(--warn-ink,#b25e00)}",
    ".km-zl{display:flex;flex-direction:column;gap:10px}.km-z{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.45}",
    ".km-st{flex-shrink:0;font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;margin-top:1px}.km-st.erreicht{background:var(--ok-soft);color:var(--ok-ink)}.km-st.teilweise{background:var(--warn-soft);color:var(--warn-ink)}.km-st.offen{background:var(--bad-soft);color:var(--bad-ink)}",
    ".km-mom{border-left:3px solid var(--ok,#34c759);padding:4px 0 4px 12px;display:flex;flex-direction:column;gap:6px}.km-mom.verbessern{border-color:var(--warn,#ff9500)}",
    ".km-mom q{font-size:15px;font-style:italic;line-height:1.45}.km-mom p{margin:0;font-size:14px;color:var(--muted);line-height:1.45}",
    ".km-better{font-size:14px;padding:8px 12px;border-radius:12px;background:var(--ok-soft);line-height:1.45}.km-better b{color:var(--ok-ink)}",
    ".km-mets{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}",
    ".km-met{padding:12px;border-radius:14px;background:var(--fill,var(--surface2))}.km-met b{display:block;font-size:20px;letter-spacing:-.02em}.km-met span{font-size:12.5px;color:var(--muted);line-height:1.35;display:block;margin-top:2px}",
    ".km-tr{display:flex;flex-direction:column;gap:6px;margin-top:10px;font-size:14px;line-height:1.5}.km-tr div b{color:var(--muted);font-weight:600}",
    ".km-load{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;text-align:center}",
    ".km-spin{width:44px;height:44px;border-radius:50%;border:4px solid color-mix(in srgb,var(--c) 20%,transparent);border-top-color:var(--c);animation:kmspin 1s linear infinite}",
    "@keyframes kmspin{to{transform:rotate(360deg)}}",
    ".km-steps{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--muted)}.km-steps li.on{color:var(--fg);font-weight:600}",
    ".km-sheet-bg{position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:2147483000;display:flex;align-items:flex-end;justify-content:center}",
    ".km-sheet{background:var(--surface);color:var(--fg);width:100%;max-width:560px;border-radius:22px 22px 0 0;padding:22px 20px calc(20px + env(safe-area-inset-bottom));max-height:88vh;overflow:auto;box-shadow:0 -10px 40px rgba(0,0,0,.25)}",
    "@media (min-width:700px){.km-sheet-bg{align-items:center}.km-sheet{border-radius:22px}}",
    ".km-sheet h3{margin:0 0 10px;font-size:19px}.km-sheet ul{margin:10px 0;padding-left:20px;line-height:1.55;font-size:14.5px}",
    ".km-full{position:fixed;inset:0;z-index:2147482000;background:var(--bg,#f2f2f7);display:flex;justify-content:center;align-items:stretch;color:var(--fg)}",
    ".km-full .km-stage{flex:1;max-width:620px;min-height:0;border-radius:0;border:0;padding:calc(14px + env(safe-area-inset-top)) 16px calc(14px + env(safe-area-inset-bottom))}",
    ".km-full .km-cap{max-height:none;min-height:80px}",
    ".km-foot{font-size:12px;color:var(--muted);text-align:center;margin:6px 0 0;line-height:1.4}",
    "@media (min-width:700px){.km-full{background:rgba(0,0,0,.45);align-items:center;padding:24px}.km-full .km-stage{height:min(780px,94vh);border-radius:26px;border:1px solid var(--line);box-shadow:0 30px 80px -20px rgba(0,0,0,.45)}}",
    "@media (max-width:520px){.km-orb{width:140px;height:140px;margin:8px 0 4px}.km-orb .pxavw{width:122px;height:122px}.km-cb{width:52px;height:52px}.km-cb.end{width:62px;height:62px}}",
    "@media (max-height:640px){.km-orb{width:110px;height:110px;margin:4px 0}.km-orb .pxavw{width:96px;height:96px}}",
    "@media (prefers-reduced-motion:reduce){.km-ring{transition:none}.km-live i,.km-dots i,.km-spin{animation:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "fx-komm-css"; st.textContent = css; (document.head || document.documentElement).appendChild(st);

  /* ---------- Kleinteile ---------- */
  var ICO = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.8 3.5 6"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    swap: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    micoff: '<path d="M4 4l16 16"/><path d="M9 9v2a3 3 0 0 0 5 2.2M15 10V6a3 3 0 0 0-5.7-1.3"/><path d="M5 11a7 7 0 0 0 11 5.7M19 11a7 7 0 0 1-.6 2.8M12 18v3"/>',
    kbd: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    phone: '<path d="M3.5 13.5c4.5-4 12.5-4 17 0l-2 3-3.5-1v-2.5c-2-.7-4-.7-6 0V15.5l-3.5 1z"/>',
    cc: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 10.5a2 2 0 1 0 0 3M16 10.5a2 2 0 1 0 0 3"/>',
    send: '<path d="M4 12l16-8-6 16-2-7z"/>',
    pin: '<path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/>',
    chk: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    light: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'
  };
  function Ic(p) { return h("svg", { viewBox: "0 0 24 24", width: p.s || 20, height: p.s || 20, fill: "none", stroke: "currentColor", strokeWidth: p.w || 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ICO[p.k] || "" } }); }
  var MOOD = { "pat-depression": "sad", "pat-chemo": "worried", "pat-jugend": "angry", "pat-entzug": "angry", "pat-gewalt": "worried", "pat-psychose": "worried", "pat-infarkt": "pain", "ber-wunde": "smile", "ber-hi": "neutral", "ber-inhalation": "worried", "ber-medplan": "worried", "ber-dialyse": "neutral", "ber-stillen": "tired", "ber-stoma": "sad", "ber-rauchen": "neutral", "ber-leber": "worried", "ang-schlaganfall": "worried", "pat-demenz": "worried", "ang-teilhabe": "angry", "ang-saeugling": "tired", "pat-mrsa": "sad", "pat-intim": "sad", "kon-leitung": "tired", "ang-pflegend": "tired", "ang-bettgitter": "angry", "pat-hoeren": "neutral", "pat-schuettelfrost": "pain", "kon-parkinson": "angry", "ang-intensiv": "worried", "pat-suizid": "sad", "ang-verfuegung": "angry", "kon-notaufnahme": "angry", "ueb-op": "smile", "ueb-arzt": "neutral", "ueb-rea": "worried", "pat-schmerz": "pain", "pat-angst": "worried", "pat-essen": "sad", "ang-delir": "worried", "ang-palliativ": "sad", "ang-mutter": "tired", "kon-sohn": "angry", "kon-gehen": "angry", "kon-team": "tired", "auf-knie": "happy", "auf-sprache": "worried", "auf-heim": "sad", "ber-insulin": "neutral", "ber-sturz": "smile", "ber-dekubitus": "worried", "pat-scham": "sad", "ang-telefon": "worried", "kon-klingel": "angry", "auf-alkohol": "pain", "ber-spritze": "worried", "ueb-hueft": "smile", "ueb-hypo": "neutral", "ueb-delir": "neutral", "ueb-sepsis": "worried", "ueb-palliativ": "neutral", "ueb-drei": "tired" };
  function Av(p) {
    var html = window.PXAV ? window.PXAV.svg(p.sp, p.mood || "neutral", p.label || "") : "";
    return h("span", { className: "pxavw", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: html } });
  }
  function kat(id) { return D.kategorien.filter(function (k) { return k.id === id; })[0] || D.kategorien[0]; }
  function sz(id) { return D.szenarien.filter(function (s) { return s.id === id; })[0]; }
  function top() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); } }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2); }
  function words(t) { return (String(t || "").match(/[A-Za-zÄÖÜäöüß0-9]+/g) || []).length; }
  function stufe(p) { return p >= 90 ? "Sehr gut" : p >= 75 ? "Gut" : p >= 60 ? "Solide" : p >= 40 ? "Ausbaufähig" : "Noch am Anfang"; }
  function demoMode() { return !!window.FP_DEMO_ACC && !window.FP_KOMM_MOCK; }

  /* ---------- Server ---------- */
  function kommDef(x) {
    if (!x) return null;
    var o = { id: x.id, kat: x.kat, start: x.start, ort: x.ort, stimme: x.stimme, tempo: x.tempo, person: { name: x.person.name, alter: x.person.alter, rolle: x.person.rolle }, situation: x.situation, deineRolle: x.deineRolle, ziele: x.ziele, kriterien: x.kriterien, rolle: x.rolle };
    if (x.akte) o.akte = x.akte;
    return o;
  }
  window.FP_KOMM_DEF = kommDef;
  function invoke(name, body) {
    if (body && body.szenario && /^gespraech-/.test(name)) body = Object.assign({}, body, { def: kommDef(sz(body.szenario)) });
    if (navigator.onLine === false) return Promise.reject(new Error("Du bist offline. Für das Gespräch brauchst du eine Internetverbindung."));
    if (!window.FP_SBC) return Promise.reject(new Error("Die Gesprächssimulation ist hier nicht verfügbar."));
    return Promise.resolve().then(function () { return window.FP_SBC(); }).then(function (sb) {
      if (!sb || !sb.functions) throw new Error("Die Gesprächssimulation braucht ein Schulkonto.");
      return sb.functions.invoke(name, { body: body }).then(function (r) {
        if (r.error) {
          var ctx = r.error.context;
          if (ctx && ctx.json) return ctx.json().then(function (j) { try { console.error("[Fallpfad] " + name + " " + ctx.status, j); } catch (x) {} var m = j && (j.error || j.message); if (m && typeof m === "object") m = m.message || JSON.stringify(m); throw new Error((m || "Das hat nicht geklappt.") + (ctx.status ? " (" + name + ", " + ctx.status + ")" : "")); }, function () { throw new Error("Der Dienst ist gerade nicht erreichbar."); });
          throw new Error("Der Dienst ist gerade nicht erreichbar.");
        }
        return r.data;
      });
    });
  }

  /* ---------- Echtzeit-Verbindung (WebRTC) ----------
     o: { szenario, verlauf, mitMikro, audioEl, onEvent(evt), onState(text), onRemoteStream(stream) } */
  function verbinden(o) {
    if (window.FP_KOMM_MOCK) return Promise.resolve(window.FP_KOMM_MOCK(o));
    var stream = null, pc = null, dc = null, closed = false, meta = null;
    function cleanup() {
      closed = true;
      try { if (dc) dc.close(); } catch (e) {}
      try { if (pc) pc.close(); } catch (e) {}
      if (stream) stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
    }
    var mic = o.mitMikro ? navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).catch(function (e) {
      var err = new Error(e && e.name === "NotAllowedError" ? "Das Mikrofon ist blockiert. Erlaube den Zugriff in den Browser-Einstellungen oder schreibe stattdessen." : "Kein Mikrofon gefunden. Du kannst stattdessen schreiben.");
      err.mic = true; throw err;
    }) : Promise.resolve(null);
    return mic.then(function (s) {
      stream = s;
      return invoke("gespraech-sitzung", { szenario: o.szenario, verlauf: o.verlauf || [], einwilligung: true });
    }).then(function (m) {
      meta = m || {};
      if (!meta.value || !meta.rtcUrl) throw new Error("Das Gespräch konnte nicht gestartet werden.");
      pc = new RTCPeerConnection();
      pc.ontrack = function (e) { var rs = e.streams && e.streams[0]; if (!rs) return; o.audioEl.srcObject = rs; var p = o.audioEl.play(); if (p && p.catch) p.catch(function () {}); if (o.onRemoteStream) o.onRemoteStream(rs); };
      if (stream) stream.getTracks().forEach(function (t) { pc.addTrack(t, stream); });
      else pc.addTransceiver("audio", { direction: "recvonly" });
      dc = pc.createDataChannel("oai-events");
      dc.onmessage = function (e) { var ev; try { ev = JSON.parse(e.data); } catch (x) { return; } o.onEvent(ev); };
      pc.onconnectionstatechange = function () { if (!closed) o.onState(pc.connectionState); };
      return pc.createOffer().then(function (offer) { return pc.setLocalDescription(offer).then(function () { return offer; }); });
    }).then(function (offer) {
      return fetch(meta.rtcUrl, { method: "POST", body: offer.sdp, headers: { Authorization: "Bearer " + meta.value, "Content-Type": "application/sdp" } });
    }).then(function (r) {
      if (!r.ok) return r.text().catch(function () { return ""; }).then(function (t) {
        var d = "", j = null;
        try { j = JSON.parse(t); } catch (x) {}
        var e = j && (j.error || j);
        if (e && typeof e === "object") d = [e.message, e.code && "code: " + e.code, e.type && "type: " + e.type, e.param && "param: " + e.param].filter(Boolean).join(" · ");
        else if (typeof e === "string") d = e;
        if (!d) d = (t || "").replace(/\s+/g, " ").trim().slice(0, 400);
        try { console.error("[Fallpfad Sprachverbindung] OpenAI " + r.status + " " + (r.statusText || ""), meta && meta.rtcUrl, t); } catch (x) {}
        throw new Error((r.status === 429 ? "Der Sprachdienst ist gerade ausgelastet (429)" : "Die Sprachverbindung wurde abgelehnt (" + r.status + ")") + (d ? ": " + d : ". OpenAI hat keinen Grund mitgeschickt.") + " · Server: " + ((meta && meta.rtcUrl) || "?").replace(/^https?:\/\//, "").split("/")[0]);
      });
      return r.text();
    }).then(function (sdp) {
      return pc.setRemoteDescription({ type: "answer", sdp: sdp });
    }).then(function () {
      return new Promise(function (ok, no) {
        if (dc.readyState === "open") return ok();
        var t = setTimeout(function () { no(new Error("Die Verbindung kam nicht zustande. Prüfe dein Netz und versuche es noch einmal.")); }, 12000);
        dc.onopen = function () { clearTimeout(t); ok(); };
      });
    }).then(function () {
      return {
        meta: meta,
        localStream: stream,
        send: function (ev) { if (dc && dc.readyState === "open") dc.send(JSON.stringify(ev)); },
        setMuted: function (m) { if (stream) stream.getAudioTracks().forEach(function (t) { t.enabled = !m; }); },
        close: cleanup
      };
    }, function (e) { cleanup(); throw e; });
  }

  /* ---------- Pegel für den Sprech-Ring ---------- */
  function pegel(ctx, stream, cb) {
    if (!ctx || !stream) return function () {};
    var an, src, raf = 0, data;
    try { src = ctx.createMediaStreamSource(stream); an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an); data = new Uint8Array(an.fftSize); } catch (e) { return function () {}; }
    function loop() {
      an.getByteTimeDomainData(data); var sum = 0;
      for (var i = 0; i < data.length; i++) { var v = (data[i] - 128) / 128; sum += v * v; }
      cb(Math.min(1, Math.sqrt(sum / data.length) * 4));
      raf = requestAnimationFrame(loop);
    }
    loop();
    return function () { cancelAnimationFrame(raf); try { src.disconnect(); } catch (e) {} };
  }

  /* ---------- Speicher ---------- */
  function save(setS, id, aus) {
    if (!setS) return;
    var d = aus.dimensionen || {};
    var row = { id: id, at: Date.now(), sb: aus.sbar ? ["situation", "background", "assessment", "recommendation"].filter(function (k) { return aus.sbar[k] && aus.sbar[k].status === "erfuellt"; }).length : undefined, pct: aus.gesamt, d: [d.gespraechsfuehrung, d.verstaendlichkeit, d.empathie, d.fachlich].map(function (x) { return x ? x.punkte : 0; }) };
    setS(function (s) {
      var k = Object.assign({ hist: [], best: {} }, s.komm || {});
      var best = Object.assign({}, k.best); best[id] = Math.max(best[id] || 0, aus.gesamt);
      return Object.assign({}, s, { komm: { hist: [row].concat(k.hist || []).slice(0, 40), best: best } });
    });
  }

  /* ---------- Einwilligung ---------- */
  /* Widerruf auch auf dem Server festhalten (Einwilligungsprotokoll). Gelingt das nicht, gilt der Widerruf auf dem Gerät trotzdem. */
  function widerrufMelden() {
    try {
      if (!window.FP_SBC || window.FP_DEMO_ACC) return;
      Promise.resolve(window.FP_SBC()).then(function (sb) { if (sb && sb.rpc) return sb.rpc("fp_einwilligung_widerrufen", { p_zweck: "sprachsimulation" }); }).catch(function () {});
    } catch (e) {}
  }
  function Consent(p) {
    var ref = uR(null);
    uE(function () { var b = ref.current && ref.current.querySelector("button.btn"); if (b) b.focus(); function k(e) { if (e.key === "Escape") p.onClose(); } document.addEventListener("keydown", k); return function () { document.removeEventListener("keydown", k); }; }, []);
    return portal(h("div", { className: "km-sheet-bg", onClick: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
      h("div", { className: "km-sheet", role: "dialog", "aria-modal": "true", "aria-labelledby": "km-cons-h", ref: ref },
        h("div", { className: "km-ic", style: { "--c": "var(--accent)", marginBottom: 10 } }, h(Ic, { k: "shield" })),
        h("h3", { id: "km-cons-h" }, "Bevor du sprichst"),
        h("p", { className: "km-note", style: { fontSize: 14.5, color: "var(--fg)" } }, "Die Gesprächsperson ist eine KI. Damit sie dich versteht und antworten kann, gilt:"),
        h("ul", null,
          h("li", null, "Deine Stimme wird während des Gesprächs live an den KI-Dienst OpenAI übertragen, dort in Text umgewandelt und beantwortet. Je nach Einrichtung deiner Schule geschieht das in der EU oder in den USA."),
          h("li", null, "Für die Auswertung wird die Mitschrift des Gesprächs (Text) an OpenAI geschickt."),
          h("li", null, "Fallpfad speichert weder Ton noch Mitschrift auf dem Server. Auf deinem Gerät bleibt nur deine letzte Auswertung, in deinem Konto nur die Punktzahl."),
          h("li", null, "OpenAI nutzt die Daten nicht zum Training und löscht sie spätestens nach 30 Tagen."),
          h("li", null, "Nenne keine echten Namen und keine echten Patientendaten. Alle Personen hier sind erfunden."),
          h("li", null, "Die Teilnahme ist freiwillig. Du kannst stattdessen schreiben oder die Einwilligung unter „Kommunikation“ jederzeit widerrufen. Wenn du jünger als 16 bist, sprich vorher mit deinen Eltern.")),
        h("div", { className: "km-row", style: { marginTop: 14 } },
          h("button", { type: "button", className: "btn", onClick: function () { lsSet(CONSENT_KEY, { at: Date.now() }); p.onOk(); } }, "Einverstanden, weiter"),
          h("button", { type: "button", className: "btn ghost", onClick: p.onClose }, "Abbrechen")),
        h("p", { className: "km-note", style: { marginTop: 10 } }, "Mehr dazu in der ", h("a", { href: (window.FALLPFAD_CONFIG || {}).datenschutzUrl || "datenschutz.html", target: "_blank", rel: "noopener" }, "Datenschutzerklärung"), "."))));
  }

  /* ---------- Übersicht ---------- */
  function Home(p) {
    var best = (p.S && p.S.komm && p.S.komm.best) || {};
    var hist = (p.S && p.S.komm && p.S.komm.hist) || [];
    var ok = !!lsGet(CONSENT_KEY, null), cs = uS(0);
    return h("div", { className: "km" },
      h("p", { className: "km-intro" }, "Übe schwierige Gespräche, bevor sie auf Station passieren. Du sprichst über dein Mikrofon mit einer KI, die die Gesprächsperson spielt: Sie fragt nach, versteht manchmal etwas nicht und reagiert darauf, wie du mit ihr sprichst. Danach bekommst du eine ausführliche Auswertung."),
      h("div", { className: "km-grid" }, D.kategorien.map(function (k) {
        var list = D.szenarien.filter(function (s) { return s.kat === k.id; });
        var done = list.filter(function (s) { return best[s.id]; }).length;
        return h("button", { key: k.id, type: "button", className: "km-cat", style: { "--c": k.c }, onClick: function () { p.go({ v: "kat", kat: k.id }); } },
          h("span", { className: "km-ic" }, h(Ic, { k: k.ic })),
          h("b", null, k.t),
          h("p", null, k.d),
          h("span", { className: "km-catf" },
            h("span", { className: "km-avs" }, list.slice(0, 3).map(function (s) { return h(Av, { key: s.id, sp: s.person.av, mood: MOOD[s.id] }); })),
            h("span", null, done ? done + " von " + list.length + " geübt" : list.length + " Gespräche")));
      })),
      hist.length ? h("p", { className: "km-note" }, "Zuletzt geübt: ", hist.slice(0, 3).map(function (x, i) { var s = sz(x.id); return s ? (i ? " · " : "") + s.titel + " (" + x.pct + ")" : ""; }).join("")) : null,
      ok ? h("p", { className: "km-note" }, "Du hast der Sprachverarbeitung zugestimmt. ", h("a", { href: "#", onClick: function (e) { e.preventDefault(); lsSet(CONSENT_KEY, null); widerrufMelden(); cs[1](cs[0] + 1); } }, "Einwilligung widerrufen")) : null);
  }

  function Kat(p) {
    var k = kat(p.kat), best = (p.S && p.S.komm && p.S.komm.best) || {};
    var list = D.szenarien.filter(function (s) { return s.kat === k.id; });
    return h("div", { className: "km", style: { "--c": k.c } },
      h("button", { type: "button", className: "km-back", onClick: function () { p.go({ v: "home" }); } }, h(Ic, { k: "left", s: 18 }), "Alle Kategorien"),
      h("div", { className: "km-h" }, h("span", { className: "km-ic" }, h(Ic, { k: k.ic })), h("div", null, h("h2", null, k.t), h("p", null, k.d))),
      h("div", { className: "km-list" }, list.map(function (s) {
        return h("button", { key: s.id, type: "button", className: "km-sc", onClick: function () { p.go({ v: "brief", id: s.id }); } },
          h(Av, { sp: s.person.av, mood: MOOD[s.id] }),
          h("span", { className: "km-sct" },
            h("b", null, s.titel),
            h("span", null, s.person.name + ", " + s.person.alter + " · " + s.person.rolle),
            h("span", { className: "km-tags" }, h("span", { className: "km-tag" }, s.stufe), h("span", { className: "km-tag" }, "ca. " + s.dauer + " Min."), h("span", { className: "km-tag" }, s.start === "ki" ? "Sie spricht dich an" : "Du beginnst"), s.akte ? h("span", { className: "km-tag" }, s.akte.length > 1 ? s.akte.length + " Patientenakten" : "mit Patientenakte") : null)),
          best[s.id] ? h("span", { className: "km-score", title: "Beste Auswertung" }, best[s.id]) : h(Ic, { k: "right", s: 18 }));
      })));
  }

  /* ---------- Vorbereitung ---------- */
  function Brief(p) {
    var s = sz(p.id), k = kat(s.kat);
    var mode = uS(p.mode || "sprache"), tip = uS(false), cons = uS(false), cap = uS(p.cap !== false);
    var last = lsGet("fp-komm-last-" + s.id, null);
    var demo = demoMode();
    var canMic = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof RTCPeerConnection !== "undefined";
    var canRtc = typeof RTCPeerConnection !== "undefined" || !!window.FP_KOMM_MOCK;
    function start() {
      if (!lsGet(CONSENT_KEY, null)) { cons[1](true); return; }
      p.go({ v: "call", id: s.id, mode: canMic ? mode[0] : "text", cap: cap[0] }, true);
    }
    return h("div", { className: "km", style: { "--c": k.c } },
      h("button", { type: "button", className: "km-back", onClick: function () { p.go({ v: "kat", kat: k.id }); } }, h(Ic, { k: "left", s: 18 }), k.t),
      h("div", { className: "km-card" },
        h("div", { className: "km-person" }, h(Av, { sp: s.person.av, mood: MOOD[s.id] }), h("div", null, h("div", { className: "eyebrow" }, k.t), h("b", null, s.person.name + ", " + s.person.alter), h("span", null, s.person.rolle))),
        h("div", { className: "km-sec" }, h("h4", null, "Ort"), h("p", { style: { display: "flex", gap: 6, alignItems: "center" } }, h(Ic, { k: "pin", s: 16 }), s.ort)),
        h("div", { className: "km-sec" }, h("h4", null, "Situation"), h("p", null, s.situation)),
        h("div", { className: "km-sec" }, h("h4", null, "Deine Rolle"), h("p", null, s.deineRolle)),
        s.kat === "uebergabe" ? h("div", { className: "km-sec" }, h("h4", null, "Übergeben mit SBAR"), h("p", null, "Die Auswertung prüft, ob du alle vier Bausteine nutzt. Der Leitfaden bleibt während des Gesprächs eingeblendet."), h(Sbar, { open: true })) : null,
        h("div", { className: "km-sec" }, h("h4", null, "Deine Ziele"), h("ul", { className: "km-goals" }, s.ziele.map(function (z, i) { return h("li", { key: i }, h("i", null, i + 1), h("span", null, z)); }))),
        h("div", { className: "km-sec" }, tip[0] ? h("div", { className: "km-tip" }, h(Ic, { k: "light", s: 18 }), h("span", null, s.tipp)) : h("button", { type: "button", className: "km-back", onClick: function () { tip[1](true); } }, h(Ic, { k: "light", s: 16 }), "Tipp anzeigen"))),
      s.akte ? h("div", { className: "km-card km-brief-akte" },
        h("div", { className: "km-sec", style: { marginTop: 0, marginBottom: 12 } }, h("h4", null, s.akte.length > 1 ? "Patientenakten" : "Patientenakte"), h("p", { style: { fontSize: 14.5 } }, "Lies dir die Akte vor der Übergabe in Ruhe durch. Im Gespräch bleibt sie rechts neben dem Chat offen, auf dem Handy wechselst du oben zwischen Gespräch und Akte.")),
        h(Akte, { akte: s.akte })) : null,
      h("div", { className: "km-card" },
        h("div", { className: "km-row", style: { justifyContent: "space-between" } },
          h("div", { className: "km-seg", role: "group", "aria-label": "Wie möchtest du antworten?" },
            h("button", { type: "button", "aria-pressed": mode[0] === "sprache", disabled: !canMic, onClick: function () { mode[1]("sprache"); } }, h(Ic, { k: "mic", s: 16 }), "Sprechen"),
            h("button", { type: "button", "aria-pressed": mode[0] === "text" || !canMic, onClick: function () { mode[1]("text"); } }, h(Ic, { k: "kbd", s: 16 }), "Schreiben")),
          h("label", { className: "km-row", style: { gap: 8, fontSize: 14, cursor: "pointer" } }, h("input", { type: "checkbox", checked: cap[0], onChange: function (e) { cap[1](e.target.checked); } }), "Untertitel")),
        h("p", { className: "km-note", style: { marginTop: 10 } }, mode[0] === "sprache" && canMic
          ? "Du sprichst ganz normal ins Mikrofon, die Person antwortet mit Stimme. Am besten mit Kopfhörern und in einem ruhigen Raum. Ein Gespräch dauert höchstens 10 Minuten."
          : "Du schreibst deine Antworten, die Person antwortet trotzdem mit Stimme. Gut, wenn du gerade nicht laut sprechen kannst."),
        !canRtc ? h("div", { className: "km-err", style: { marginTop: 10 } }, "Dein Browser unterstützt keine Sprachverbindung. Nutze bitte einen aktuellen Browser wie Chrome, Edge, Firefox oder Safari.") : null,
        demo ? h("div", { className: "km-err", style: { marginTop: 10, background: "var(--warn-soft)", color: "var(--warn-ink)" } }, "In der Demo ist das Live-Gespräch nicht verfügbar, weil es den Schulserver braucht. Schau dir eine Beispielauswertung an, um zu sehen, was du nach jedem Gespräch bekommst.") : null,
        h("div", { className: "km-row", style: { marginTop: 14 } },
          demo
            ? h("button", { type: "button", className: "btn", onClick: function () { p.go({ v: "result", id: s.id, beispiel: true }, true); } }, "Beispielauswertung ansehen")
            : h("button", { type: "button", className: "btn", disabled: !canRtc, onClick: start }, h(Ic, { k: mode[0] === "sprache" && canMic ? "mic" : "kbd", s: 18 }), "Gespräch starten"),
          last ? h("button", { type: "button", className: "btn ghost", onClick: function () { p.go({ v: "result", id: s.id, gespeichert: true }, true); } }, "Letzte Auswertung (" + last.aus.gesamt + ")") : null)),
      cons[0] ? h(Consent, { onClose: function () { cons[1](false); }, onOk: function () { cons[1](false); p.go({ v: "call", id: s.id, mode: canMic ? mode[0] : "text", cap: cap[0] }, true); } }) : null);
  }


  /* ---------- Patientenakte (Übergabe) ---------- */
  var AKTE_CSS = [
    ".km-akte{display:flex;flex-direction:column;min-height:0;background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden;color:var(--fg)}",
    ".km-ak-pts{display:flex;gap:6px;padding:10px 10px 0;overflow-x:auto;flex-shrink:0}",
    ".km-ak-pt{all:unset;cursor:pointer;flex-shrink:0;padding:7px 12px;border-radius:10px;font-size:13.5px;font-weight:600;color:var(--muted);background:var(--fill,var(--surface2))}",
    ".km-ak-pt[aria-pressed=true]{background:color-mix(in srgb,var(--c) 16%,var(--surface));color:var(--fg);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent)}",
    ".km-ak-head{padding:14px 16px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--c) 6%,var(--surface));flex-shrink:0}",
    ".km-ak-head .eyebrow{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600}",
    ".km-ak-head b{display:block;font-size:18px;letter-spacing:-.02em;margin-top:2px}",
    ".km-ak-head p{margin:4px 0 0;font-size:13.5px;line-height:1.45;color:var(--fg)}",
    ".km-ak-flags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}",
    ".km-ak-flag{font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;background:var(--fill,var(--surface2));color:var(--fg);line-height:1.35}",
    ".km-ak-flag.warn{background:var(--bad-soft,#fdecea);color:var(--bad-ink,#b00020)}",
    ".km-ak-tabs{display:flex;gap:2px;padding:8px 10px 0;overflow-x:auto;border-bottom:1px solid var(--line);flex-shrink:0;scrollbar-width:none}",
    ".km-ak-tabs::-webkit-scrollbar{display:none}",
    ".km-ak-tab{all:unset;cursor:pointer;flex-shrink:0;padding:8px 11px 9px;font-size:13.5px;font-weight:600;color:var(--muted);border-bottom:2px solid transparent}",
    ".km-ak-tab[aria-selected=true]{color:var(--fg);border-bottom-color:var(--c)}",
    ".km-ak-body{padding:14px 16px 18px;overflow:auto;flex:1;min-height:0;font-size:14px;line-height:1.5}",
    ".km-ak-kv{display:grid;grid-template-columns:minmax(110px,34%) 1fr;gap:8px 14px;margin:0}",
    ".km-ak-kv dt{color:var(--muted);font-size:13px}.km-ak-kv dd{margin:0}",
    ".km-ak-tw{overflow-x:auto;margin:0 -4px}",
    ".km-ak-t{border-collapse:collapse;width:100%;font-size:13.5px;font-variant-numeric:tabular-nums}",
    ".km-ak-t th{text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600;padding:6px 8px;border-bottom:1px solid var(--line);white-space:nowrap}",
    ".km-ak-t td{padding:7px 8px;border-bottom:1px solid color-mix(in srgb,var(--line) 70%,transparent);vertical-align:top}",
    ".km-ak-t tr:last-child td{border-bottom:0}",
    ".km-ak-t td:not(:last-child){white-space:nowrap}",
    ".km-ak-bad{color:var(--bad-ink,#b00020);font-weight:650}",
    ".km-ak-log{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}",
    ".km-ak-log li{display:grid;grid-template-columns:52px 1fr;gap:10px}.km-ak-log time{font-weight:650;font-variant-numeric:tabular-nums;color:var(--muted);font-size:13px;padding-top:1px}",
    ".km-ak-li{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px}",
    ".km-ak-note{font-size:12px;color:var(--muted);padding:8px 16px;border-top:1px solid var(--line);flex-shrink:0}",
    ".km-brief-akte .km-akte{max-height:560px}",
    /* Gespräch und Akte nebeneinander */
    ".km-full.km-split{gap:16px}",
    ".km-split .km-side{display:flex;min-height:0}",
    ".km-split .km-side .km-akte{flex:1}",
    ".km-sw{display:none}",
    "@media (min-width:900px){.km-full.km-split{padding:24px}.km-split .km-stage{flex:0 1 440px;max-width:440px}.km-split .km-side{flex:1 1 620px;max-width:720px;height:min(780px,94vh)}.km-split .km-side .km-akte{border-radius:26px;box-shadow:0 30px 80px -20px rgba(0,0,0,.45)}}",
    "@media (max-width:899px){.km-full.km-split{flex-direction:column;justify-content:flex-start;align-items:stretch;padding:0}.km-split .km-sw{display:flex;margin:calc(10px + env(safe-area-inset-top)) 12px 0;align-self:center}.km-split .km-stage{max-width:none;border-radius:0;border:0;padding-top:12px}.km-split .km-side{flex:1;padding:10px 12px calc(12px + env(safe-area-inset-bottom))}.km-split.show-akte .km-stage{display:none}.km-split:not(.show-akte) .km-side{display:none}.km-split .km-stage .km-top{padding-top:0}}"
  ].join("\n");
  (function () { var st2 = document.createElement("style"); st2.id = "fx-komm-akte-css"; st2.textContent = AKTE_CSS; (document.head || document.documentElement).appendChild(st2); })();

  function akCell(v) {
    var s = String(v == null ? "" : v);
    return s.charAt(0) === "!" ? h("span", { className: "km-ak-bad" }, s.slice(1)) : s;
  }
  function Akte(p) {
    var list = p.akte || [];
    var pi = uS(0), ti = uS(0);
    var pt = list[Math.min(pi[0], list.length - 1)] || {};
    var tabs = pt.tabs || [];
    var tab = tabs[Math.min(ti[0], tabs.length - 1)] || {};
    function body() {
      if (tab.kv) return h("dl", { className: "km-ak-kv" }, tab.kv.map(function (r, i) { return h(Fr, { key: i }, h("dt", null, r[0]), h("dd", null, akCell(r[1]))); }));
      if (tab.tab) return h("div", { className: "km-ak-tw" }, h("table", { className: "km-ak-t" },
        h("thead", null, h("tr", null, tab.tab.k.map(function (c, i) { return h("th", { key: i, scope: "col" }, c); }))),
        h("tbody", null, tab.tab.r.map(function (r, i) { return h("tr", { key: i }, r.map(function (c, j) { return h("td", { key: j }, akCell(c)); })); }))));
      if (tab.log) return h("ol", { className: "km-ak-log" }, tab.log.map(function (r, i) { return h("li", { key: i }, h("time", null, r[0]), h("span", null, akCell(r[1]))); }));
      if (tab.li) return h("ul", { className: "km-ak-li" }, tab.li.map(function (r, i) { return h("li", { key: i }, akCell(r)); }));
      return null;
    }
    var allergie = String(pt.allergien || ""), rea = String(pt.rea || "");
    return h("section", { className: "km-akte", "aria-label": "Patientenakte" },
      list.length > 1 ? h("div", { className: "km-ak-pts", role: "group", "aria-label": "Patientin oder Patient wählen" }, list.map(function (x, i) {
        return h("button", { key: i, type: "button", className: "km-ak-pt", "aria-pressed": i === pi[0], onClick: function () { pi[1](i); ti[1](0); } }, "Zi. " + String(x.zimmer || "").split(" ")[0] + " · " + x.name.split(" ").slice(-1)[0]);
      })) : null,
      h("div", { className: "km-ak-head" },
        h("div", { className: "eyebrow" }, "Patientenakte · Zimmer " + (pt.zimmer || "")),
        h("b", null, pt.name + ", " + pt.alter + " Jahre"),
        h("p", null, pt.diagnose),
        h("div", { className: "km-ak-flags" },
          pt.aufnahme ? h("span", { className: "km-ak-flag" }, "Aufnahme: " + pt.aufnahme) : null,
          allergie ? h("span", { className: "km-ak-flag" + (/^keine/i.test(allergie) ? "" : " warn") }, "Allergien: " + allergie.replace(/^!/, "")) : null,
          rea ? h("span", { className: "km-ak-flag" + (rea.charAt(0) === "!" ? " warn" : "") }, rea.replace(/^!/, "")) : null)),
      h("div", { className: "km-ak-tabs", role: "tablist", "aria-label": "Bereiche der Akte" }, tabs.map(function (t, i) {
        return h("button", { key: i, type: "button", role: "tab", className: "km-ak-tab", "aria-selected": i === ti[0], onClick: function () { ti[1](i); } }, t.t);
      })),
      h("div", { className: "km-ak-body", role: "tabpanel" }, body()),
      h("div", { className: "km-ak-note" }, "Erfundene Übungsakte. Rot markiert: auffällige Werte und wichtige Hinweise."));
  }

  /* ---------- Live-Gespräch ---------- */
  function Call(p) {
    var s = sz(p.id), k = kat(s.kat);
    var phase = uS("connect"), err = uS(null), turns = uS([]), state = uS(""), muted = uS(false), typing = uS(p.mode === "text"), txt = uS("");
    var elapsed = uS(0), aiTalk = uS(false), userTalk = uS(false), hint = uS(s.start === "du"), reconnecting = uS(false), maxS = uS(600);
    var conn = uR(null), audioEl = uR(null), ctx = uR(null), stops = uR([]), orbRef = uR(null), capRef = uR(null);
    var M = uR({ t0: 0, speakMs: 0, speakStart: 0, interrupts: 0, aiSpeaking: false, order: [], items: {}, ended: false, lvlKi: 0, lvlDu: 0 });
    var mode = p.mode, view = uS("chat");

    function upd() {
      var m = M.current;
      turns[1](m.order.map(function (id) { return m.items[id]; }).filter(function (x) { return x && (x.t || x.pend); }));
    }
    function item(id, r) { var m = M.current; if (!m.items[id]) { m.items[id] = { id: id, r: r, t: "", pend: true }; m.order.push(id); } return m.items[id]; }
    function onEvent(ev) {
      var m = M.current, t = ev.type || "";
      if (t === "session.created" || t === "session.updated") return;
      if (t === "conversation.item.added" || t === "conversation.item.created") {
        var it = ev.item || {};
        if (it.type === "message" && (it.role === "user" || it.role === "assistant")) {
          var x = item(it.id, it.role === "user" ? "du" : "ki");
          (it.content || []).forEach(function (c) { if (c.type === "input_text" && c.text) { x.t = c.text; x.pend = false; } });
          upd();
        }
        return;
      }
      if (t === "input_audio_buffer.speech_started") {
        hint[1](false); userTalk[1](true); m.speakStart = Date.now();
        if (m.aiSpeaking) m.interrupts++;
        if (ev.item_id) { item(ev.item_id, "du"); upd(); }
        return;
      }
      if (t === "input_audio_buffer.speech_stopped") { userTalk[1](false); if (m.speakStart) { m.speakMs += Date.now() - m.speakStart; m.speakStart = 0; } state[1]("denkt nach"); return; }
      if (t === "conversation.item.input_audio_transcription.delta") { var u = item(ev.item_id, "du"); u.t += ev.delta || ""; upd(); return; }
      if (t === "conversation.item.input_audio_transcription.completed") { var u2 = item(ev.item_id, "du"); u2.t = (ev.transcript || u2.t || "").trim(); u2.pend = false; if (!u2.t) u2.t = "…"; upd(); return; }
      if (t === "conversation.item.input_audio_transcription.failed") { var u3 = item(ev.item_id, "du"); u3.t = u3.t || "(nicht verstanden)"; u3.pend = false; upd(); return; }
      if (t === "response.output_audio_transcript.delta" || t === "response.audio_transcript.delta" || t === "response.output_text.delta") {
        var a = item(ev.item_id, "ki"); a.t += ev.delta || ""; m.aiSpeaking = true; aiTalk[1](true); state[1]("spricht"); upd(); return;
      }
      if (t === "response.output_audio_transcript.done" || t === "response.audio_transcript.done" || t === "response.output_text.done") {
        var a2 = item(ev.item_id, "ki"); if (ev.transcript || ev.text) a2.t = ev.transcript || ev.text; a2.pend = false; upd(); return;
      }
      if (t === "output_audio_buffer.started") { m.aiSpeaking = true; aiTalk[1](true); state[1]("spricht"); return; }
      if (t === "output_audio_buffer.stopped" || t === "output_audio_buffer.cleared") { m.aiSpeaking = false; aiTalk[1](false); state[1]("hört zu"); return; }
      if (t === "response.done") {
        var rs = ev.response || {};
        if (rs.status === "failed") { var de = rs.status_details && rs.status_details.error; state[1](de && de.message ? "Antwort fehlgeschlagen" : "hört zu"); }
        (rs.output || []).forEach(function (o) { if (o.id && M.current.items[o.id]) M.current.items[o.id].pend = false; });
        setTimeout(function () { if (!M.current.aiSpeaking) state[1]("hört zu"); }, 300);
        upd(); return;
      }
      if (t === "error") { var e = ev.error || {}; if (e.code !== "response_cancel_not_active") { console.warn("Realtime", e.code || e.type); } return; }
    }
    function onState(cs) {
      if (cs === "failed" || cs === "disconnected") {
        if (M.current.ended) return;
        reconnecting[1](true); state[1]("Verbindung unterbrochen");
      } else if (cs === "connected") { reconnecting[1](false); }
    }
    function connect(isRe) {
      phase[1]("connect"); err[1](null);
      var verlauf = isRe ? M.current.order.map(function (id) { var x = M.current.items[id]; return x && x.t && !x.pend ? { r: x.r, t: x.t } : null; }).filter(Boolean) : [];
      return verbinden({
        szenario: s.id, verlauf: verlauf, mitMikro: mode === "sprache", audioEl: audioEl.current,
        onEvent: onEvent, onState: onState,
        onRemoteStream: function (rs) { stops.current.push(pegel(ctx.current, rs, function (v) { M.current.lvlKi = v; paint(); })); }
      }).then(function (c) {
        if (M.current.ended) { c.close(); return; }
        conn.current = c; reconnecting[1](false);
        if (c.meta && c.meta.maxSekunden) maxS[1](c.meta.maxSekunden);
        if (c.localStream) stops.current.push(pegel(ctx.current, c.localStream, function (v) { M.current.lvlDu = v; paint(); }));
        if (!M.current.t0) M.current.t0 = Date.now();
        phase[1]("live"); state[1](s.start === "ki" && !isRe ? "beginnt" : "hört zu");
        if (s.start === "ki" && !isRe) c.send({ type: "response.create" });
        if (muted[0]) c.setMuted(true);
      }, function (e) {
        if (M.current.ended) return;
        err[1](e); phase[1]("error");
      });
    }
    function paint() {
      var el = orbRef.current; if (!el) return;
      var v = Math.max(M.current.lvlKi, M.current.lvlDu * 0.6);
      el.style.setProperty("--lvl", v.toFixed(3));
    }
    uE(function () {
      var a = new Audio(); a.autoplay = true; a.setAttribute("playsinline", ""); audioEl.current = a;
      try { var AC = window.AudioContext || window.webkitAudioContext; if (AC) { ctx.current = new AC(); if (ctx.current.resume) ctx.current.resume(); } } catch (e) {}
      connect(false);
      var ov = document.body.style.overflow; document.body.style.overflow = "hidden";
      var iv = setInterval(function () { if (M.current.t0) elapsed[1](Math.floor((Date.now() - M.current.t0) / 1000)); }, 500);
      return function () {
        clearInterval(iv); M.current.ended = true; document.body.style.overflow = ov;
        stops.current.forEach(function (f) { f(); });
        if (conn.current) conn.current.close();
        try { a.pause(); a.srcObject = null; } catch (e) {}
        try { if (ctx.current && ctx.current.close) ctx.current.close(); } catch (e) {}
      };
    }, []);
    uE(function () { var c = capRef.current; if (c) c.scrollTop = c.scrollHeight; }, [turns[0]]);
    uE(function () { if (phase[0] === "live" && elapsed[0] >= maxS[0]) finish(); }, [elapsed[0]]);

    function finish() {
      var m = M.current; if (m.ended) return; m.ended = true;
      if (m.speakStart) { m.speakMs += Date.now() - m.speakStart; m.speakStart = 0; }
      if (conn.current) conn.current.close();
      stops.current.forEach(function (f) { f(); });
      var verlauf = m.order.map(function (id) { var x = m.items[id]; return x && x.t && x.t !== "…" ? { r: x.r, t: x.t.trim() } : null; }).filter(Boolean);
      var du = verlauf.filter(function (x) { return x.r === "du"; }), ki = verlauf.filter(function (x) { return x.r === "ki"; });
      var wDu = du.reduce(function (n, x) { return n + words(x.t); }, 0), wKi = ki.reduce(function (n, x) { return n + words(x.t); }, 0);
      var qs = du.reduce(function (n, x) { return n + (x.t.match(/\?/g) || []).length; }, 0);
      var offen = du.reduce(function (n, x) { return n + (x.t.match(/[^.!?]+[.!?]*/g) || []).filter(function (sa) { return /\?\s*$/.test(sa) && /^(\W*)(was|wie|warum|wieso|weshalb|wo|wann|welche\w*|wer|woran|womit|wobei|wodurch|inwiefern|erzählen|beschreiben)\b/i.test(sa.trim()); }).length; }, 0);
      var met = {
        dauer: m.t0 ? Math.round((Date.now() - m.t0) / 1000) : 0,
        redeanteil: wDu + wKi ? Math.round(wDu / (wDu + wKi) * 100) : 0,
        tempo: mode === "sprache" && m.speakMs > 15000 ? Math.round(wDu / (m.speakMs / 60000)) : 0,
        fragen: qs, offen: offen, unterbrechungen: m.interrupts, beitraege: du.length, modus: mode
      };
      p.done({ verlauf: verlauf, metriken: met });
    }
    function sendText(e) {
      if (e) e.preventDefault();
      var t = txt[0].trim(); if (!t || !conn.current) return;
      hint[1](false);
      conn.current.send({ type: "conversation.item.create", item: { type: "message", role: "user", content: [{ type: "input_text", text: t }] } });
      conn.current.send({ type: "response.create" });
      txt[1](""); state[1]("denkt nach");
    }
    function toggleMute() { var m = !muted[0]; muted[1](m); if (conn.current) conn.current.setMuted(m); }

    var left = maxS[0] - elapsed[0];
    var live = phase[0] === "live";
    var stateText = !live ? (phase[0] === "connect" ? "Verbindung wird aufgebaut" : "") : reconnecting[0] ? "Verbindung unterbrochen" : userTalk[0] ? "hört dir zu" : aiTalk[0] ? "spricht" : state[0];
    return portal(h("div", { className: "km-full" + (s.akte ? " km-split" + (view[0] === "akte" ? " show-akte" : "") : ""), style: { "--c": k.c }, role: "dialog", "aria-modal": "true", "aria-label": "Gespräch mit " + s.person.name },
      s.akte ? h("div", { className: "km-seg km-sw", role: "group", "aria-label": "Ansicht" },
        h("button", { type: "button", "aria-pressed": view[0] === "chat", onClick: function () { view[1]("chat"); } }, h(Ic, { k: "mic", s: 16 }), "Gespräch"),
        h("button", { type: "button", "aria-pressed": view[0] === "akte", onClick: function () { view[1]("akte"); } }, h(Ic, { k: "clip", s: 16 }), "Patientenakte")) : null,
      h("div", { className: "km-stage" },
        h("div", { className: "km-top" },
          h("span", { className: "km-live" + (live && !reconnecting[0] ? "" : phase[0] === "error" ? " off" : " wait") }, h("i"), live && !reconnecting[0] ? "Live" : phase[0] === "error" ? "Getrennt" : "Verbinde"),
          h("span", { className: "km-timer" + (live && left <= 60 ? " low" : "") }, fmt(elapsed[0]) + " / " + fmt(maxS[0]))),
        h("div", { className: "km-orb", ref: orbRef },
          h("span", { className: "km-ring r2" }), h("span", { className: "km-ring" }),
          h(Av, { sp: s.person.av, mood: aiTalk[0] ? "talk" : MOOD[s.id], label: s.person.name })),
        h("div", { className: "km-name" }, s.person.name),
        h("div", { className: "km-state", "aria-live": "polite" }, stateText, (phase[0] === "connect" || stateText === "denkt nach" || stateText === "beginnt") ? h("span", { className: "km-dots", "aria-hidden": "true" }, h("i"), h("i"), h("i")) : null),
        live && left <= 60 && left > 0 ? h("div", { className: "km-banner" }, "Noch eine Minute. Komm langsam zum Abschluss.") : null,
        phase[0] === "error" ? h("div", { className: "km-err", style: { alignSelf: "stretch" } }, (err[0] && err[0].message) || "Das Gespräch konnte nicht gestartet werden.",
          h("div", { className: "km-row", style: { marginTop: 10 } },
            h("button", { type: "button", className: "btn sm", onClick: function () { M.current.ended = false; stops.current.forEach(function (f) { f(); }); stops.current = []; connect(M.current.order.length > 0); } }, "Noch einmal versuchen"),
            err[0] && err[0].mic ? h("button", { type: "button", className: "btn sm ghost", onClick: function () { mode = "text"; p.switchMode("text"); } }, "Stattdessen schreiben") : null,
            h("button", { type: "button", className: "btn sm ghost", onClick: p.cancel }, "Zurück"))) : null,
        reconnecting[0] && live ? h("div", { className: "km-banner" }, "Die Verbindung ist unterbrochen. ", h("button", { type: "button", className: "btn sm", style: { marginLeft: 8 }, onClick: function () { if (conn.current) conn.current.close(); stops.current.forEach(function (f) { f(); }); stops.current = []; connect(true); } }, "Neu verbinden")) : null,
        s.kat === "uebergabe" && live ? h(Sbar, { compact: true }) : null,
        p.cap ? h("div", { className: "km-cap", ref: capRef, "aria-live": "polite", "aria-label": "Untertitel" },
          hint[0] && live ? h("div", { className: "km-hint" }, mode === "sprache" ? (s.kat === "uebergabe" ? "Du beginnst. Starte die Übergabe zum Beispiel mit Name, Alter, Zimmer und Grund des Aufenthalts. Die Akte bleibt daneben offen." : "Du beginnst. Sag zum Beispiel Hallo und stell dich vor.") : "Du beginnst. Schreib unten deine erste Nachricht.") : null,
          turns[0].map(function (x) { return h("div", { key: x.id, className: "km-msg " + x.r + (x.pend ? " pend" : "") }, x.t || "…"); })) : h("div", { style: { flex: 1 } }),
        typing[0] && live ? h("form", { className: "km-type", onSubmit: sendText },
          h("input", { type: "text", value: txt[0], placeholder: "Deine Antwort …", "aria-label": "Deine Antwort", autoFocus: true, onChange: function (e) { txt[1](e.target.value); } }),
          h("button", { type: "submit", className: "btn", "aria-label": "Senden", disabled: !txt[0].trim() }, h(Ic, { k: "send", s: 18 }))) : null,
        h("div", { className: "km-ctrl" },
          mode === "sprache" ? h("span", { className: "km-cbl" }, h("button", { type: "button", className: "km-cb", "aria-pressed": muted[0], "aria-label": muted[0] ? "Mikrofon einschalten" : "Mikrofon stummschalten", onClick: toggleMute, disabled: !live }, h(Ic, { k: muted[0] ? "micoff" : "mic" })), muted[0] ? "Stumm" : "Mikro") : null,
          h("span", { className: "km-cbl" }, h("button", { type: "button", className: "km-cb end", "aria-label": "Gespräch beenden", onClick: finish }, h(Ic, { k: "phone", s: 26 })), "Beenden"),
          h("span", { className: "km-cbl" }, h("button", { type: "button", className: "km-cb", "aria-pressed": typing[0], "aria-label": "Tastatur", onClick: function () { typing[1](!typing[0]); }, disabled: !live }, h(Ic, { k: "kbd" })), "Schreiben")),
        h("p", { className: "km-foot" }, "KI-Gesprächsperson · keine echten Namen oder Patientendaten nennen")),
      s.akte ? h("div", { className: "km-side" }, h(Akte, { akte: s.akte })) : null));
  }

  /* ---------- SBAR-Leitfaden für Übergaben ---------- */
  var SBAR = [
    ["S", "Situation", "Wer und was jetzt?", "Name, Alter, Zimmer, Grund des Aufenthalts. Was ist gerade das Wichtigste?"],
    ["B", "Background", "Hintergrund", "Diagnosen, OP oder Behandlungstag, Vorgeschichte, Allergien, Therapieziel, laufende Therapie und Medikamente."],
    ["A", "Assessment", "Deine Einschätzung", "Aktueller Zustand mit Werten: Vitalzeichen, Schmerz, Bewusstsein, Ausscheidung, Wunde. Was hat sich verändert, welche Risiken siehst du?"],
    ["R", "Recommendation", "Was ist zu tun?", "Offene Aufgaben mit Uhrzeit, worauf achten, wann wen informieren. Zum Schluss: Fragen?"]
  ];
  function Sbar(p) {
    var op = uS(p.open ? -1 : null);
    return h("div", { className: "km-sbar" + (p.compact ? " cmp" : "") },
      h("div", { className: "km-sbar-h" }, h("b", null, "SBAR"), h("span", null, p.compact ? "Tippe auf einen Buchstaben" : "So baust du deine Übergabe auf")),
      h("div", { className: "km-sbar-row" }, SBAR.map(function (x, i) {
        var on = op[0] === -1 || op[0] === i;
        return h("button", { type: "button", key: x[0], className: "km-sbar-b" + (on ? " on" : ""), "aria-expanded": on, onClick: function () { op[1](op[0] === i ? (p.open ? -1 : null) : i); } },
          h("i", null, x[0]), h("span", null, h("b", null, x[1]), h("small", null, x[2])));
      })),
      op[0] !== null ? h("div", { className: "km-sbar-d" }, (op[0] === -1 ? SBAR : [SBAR[op[0]]]).map(function (x) { return h("p", { key: x[0] }, h("b", null, x[0] + " · " + x[2] + ": "), x[3]); })) : null);
  }
  var SBST = { erfuellt: ["Erfüllt", "erreicht"], teilweise: ["Teilweise", "teilweise"], fehlt: ["Fehlt", "offen"] };
  function SbarCheck(p) {
    var sb = p.sb, keys = [["situation", 0], ["background", 1], ["assessment", 2], ["recommendation", 3]];
    var n = keys.filter(function (k) { return sb[k[0]] && sb[k[0]].status === "erfuellt"; }).length;
    return h("div", { className: "km-card" },
      h("h3", { style: { margin: "0 0 4px", fontSize: 16 } }, "SBAR-Check"),
      h("p", { className: "km-note", style: { margin: "0 0 12px" } }, n + " von 4 Bausteinen vollständig" + (sb.reihenfolge ? " · Reihenfolge eingehalten" : " · Reihenfolge noch nicht klar")),
      h("div", { className: "km-sbar-res" }, keys.map(function (k) {
        var x = sb[k[0]] || { status: "fehlt", hinweis: "" }, st = SBST[x.status] || SBST.fehlt, d = SBAR[k[1]];
        return h("div", { key: k[0], className: "km-sbar-it " + x.status },
          h("i", null, d[0]), h("div", null, h("b", null, d[1] + " "), h("span", { className: "km-st " + st[1] }, st[0]), x.hinweis ? h("p", null, x.hinweis) : null));
      })),
      sb.fazit ? h("p", { style: { margin: "12px 0 0" } }, sb.fazit) : null);
  }

  /* ---------- Auswertung ---------- */
  var DIMS = [["gespraechsfuehrung", "Gesprächsführung"], ["verstaendlichkeit", "Verständlichkeit"], ["empathie", "Empathie"], ["fachlich", "Fachliche Kommunikation"]];
  function Ring(p) {
    var r = 52, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, p.v || 0)), sv = uS(0);
    uE(function () { var t = setTimeout(function () { sv[1](v); }, 60); return function () { clearTimeout(t); }; }, [v]);
    return h("div", { className: "km-big", role: "img", "aria-label": "Gesamtergebnis " + v + " von 100" },
      h("svg", { viewBox: "0 0 118 118" },
        h("circle", { cx: 59, cy: 59, r: r, fill: "none", stroke: "var(--fill,var(--surface2))", strokeWidth: 10 }),
        h("circle", { cx: 59, cy: 59, r: r, fill: "none", stroke: "var(--c)", strokeWidth: 10, strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c * (1 - sv[0] / 100), style: { transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" } })),
      h("b", null, v), h("small", null, "von 100"));
  }
  function Bar(p) { var w = uS(0); uE(function () { var t = setTimeout(function () { w[1](p.v); }, 80); return function () { clearTimeout(t); }; }, [p.v]); return h("div", { className: "km-bar" }, h("i", { style: { width: w[0] + "%" } })); }
  function Result(p) {
    var s = sz(p.id), k = kat(s.kat), aus = p.aus, met = p.metriken || {}, tr = uS(false);
    var tempoTxt = met.tempo ? (met.tempo < 100 ? "eher langsam, gut für ältere oder schwerhörige Menschen" : met.tempo <= 150 ? "angenehm" : met.tempo <= 175 ? "zügig, langsamer wirkt ruhiger" : "zu schnell für viele Patientinnen und Patienten") : "";
    var redeTxt = met.redeanteil ? (met.redeanteil > 65 ? "Du hast viel gesprochen. Mehr Raum fürs Gegenüber lassen." : met.redeanteil < 25 ? "Sehr zurückhaltend. Mehr Struktur geben." : "ausgewogen") : "";
    return h("div", { className: "km", style: { "--c": k.c } },
      h("button", { type: "button", className: "km-back", onClick: function () { p.go({ v: "kat", kat: k.id }); } }, h(Ic, { k: "left", s: 18 }), k.t),
      p.hinweis ? h("div", { className: "km-err", style: { background: "var(--warn-soft)", color: "var(--warn-ink)" } }, p.hinweis) : null,
      h("div", { className: "km-card" },
        h("div", { className: "km-res-head" },
          h(Ring, { v: aus.gesamt }),
          h("div", { style: { flex: "1 1 240px", minWidth: 0 } },
            h("div", { className: "eyebrow" }, "Auswertung · " + s.titel),
            h("h2", null, stufe(aus.gesamt)),
            h("p", null, aus.kurzfazit)))),
      h("div", { className: "km-dims" }, DIMS.map(function (d) {
        var x = (aus.dimensionen || {})[d[0]] || { punkte: 0, bewertung: "", staerken: [], verbessern: [] };
        return h("div", { key: d[0], className: "km-card km-dim" },
          h("h3", null, d[1], h("span", null, x.punkte)),
          h(Bar, { v: x.punkte }),
          x.bewertung ? h("p", null, x.bewertung) : null,
          h("ul", { className: "km-pts" },
            (x.staerken || []).map(function (t, i) { return h("li", { key: "s" + i, className: "ok" }, h("i", null, "✓"), h("span", null, t)); }),
            (x.verbessern || []).map(function (t, i) { return h("li", { key: "v" + i, className: "up" }, h("i", null, "→"), h("span", null, t)); })));
      })),
      aus.sbar ? h(SbarCheck, { sb: aus.sbar }) : null,
      (aus.ziele || []).length ? h("div", { className: "km-card" }, h("h3", { style: { margin: "0 0 12px", fontSize: 16 } }, "Deine Ziele"),
        h("div", { className: "km-zl" }, aus.ziele.map(function (z, i) {
          return h("div", { key: i, className: "km-z" }, h("span", { className: "km-st " + z.status }, z.status === "erreicht" ? "Erreicht" : z.status === "teilweise" ? "Teilweise" : "Offen"), h("div", null, h("b", null, z.ziel), h("div", { className: "km-note", style: { marginTop: 2, fontSize: 13.5 } }, z.begruendung)));
        }))) : null,
      (aus.momente || []).length ? h("div", { className: "km-card" }, h("h3", { style: { margin: "0 0 12px", fontSize: 16 } }, "Schlüsselmomente"),
        h("div", { className: "km-zl", style: { gap: 16 } }, aus.momente.map(function (m, i) {
          return h("div", { key: i, className: "km-mom " + m.art },
            h("q", null, m.zitat), h("p", null, m.kommentar),
            m.art === "verbessern" && m.besser ? h("div", { className: "km-better" }, h("b", null, "Besser: "), m.besser) : null);
        }))) : null,
      met.dauer || met.redeanteil ? h("div", { className: "km-card" }, h("h3", { style: { margin: "0 0 12px", fontSize: 16 } }, "Messwerte"),
        h("div", { className: "km-mets" },
          met.dauer ? h("div", { className: "km-met" }, h("b", null, fmt(met.dauer)), h("span", null, "Gesprächsdauer")) : null,
          met.redeanteil ? h("div", { className: "km-met" }, h("b", null, met.redeanteil + " %"), h("span", null, "Dein Redeanteil, " + redeTxt)) : null,
          met.tempo ? h("div", { className: "km-met" }, h("b", null, met.tempo), h("span", null, "Wörter pro Minute, " + tempoTxt)) : null,
          h("div", { className: "km-met" }, h("b", null, (met.offen || 0) + " / " + (met.fragen || 0)), h("span", null, "offene Fragen / Fragen gesamt")),
          met.modus === "sprache" ? h("div", { className: "km-met" }, h("b", null, met.unterbrechungen || 0), h("span", null, "Mal ins Wort gefallen")) : null)) : null,
      aus.naechsterSchritt ? h("div", { className: "km-tip" }, h(Ic, { k: "light", s: 18 }), h("span", null, h("b", null, "Für das nächste Mal: "), aus.naechsterSchritt)) : null,
      (p.verlauf || []).length ? h("div", { className: "km-card" },
        h("button", { type: "button", className: "km-back", "aria-expanded": tr[0], onClick: function () { tr[1](!tr[0]); } }, tr[0] ? "Mitschrift ausblenden" : "Mitschrift anzeigen"),
        tr[0] ? h("div", { className: "km-tr" }, p.verlauf.map(function (x, i) { return h("div", { key: i }, h("b", null, x.r === "du" ? "Du: " : s.person.name.split(" ")[0] + ": "), x.t); })) : null) : null,
      h("div", { className: "km-row" },
        h("button", { type: "button", className: "btn", onClick: function () { p.go({ v: "brief", id: s.id }); } }, h(Ic, { k: "redo", s: 18 }), "Noch einmal üben"),
        h("button", { type: "button", className: "btn ghost", onClick: function () { p.go({ v: "kat", kat: k.id }); } }, "Anderes Gespräch")),
      h("p", { className: "km-note" }, "Die Auswertung erstellt eine KI. Sie ist eine Lernhilfe und keine Prüfungsnote. Sprich sie gern mit deiner Praxisanleitung durch."));
  }
  function Eval(p) {
    var s = sz(p.id), k = kat(s.kat), stp = uS(0), err = uS(null), run = uS(0);
    uE(function () {
      var alive = true, iv = setInterval(function () { stp[1](function (x) { return Math.min(2, x + 1); }); }, 2200);
      var body = { szenario: s.id, verlauf: p.verlauf, metriken: p.metriken };
      var pr = window.FP_KOMM_MOCK_EVAL ? Promise.resolve(window.FP_KOMM_MOCK_EVAL(body)) : invoke("gespraech-auswertung", body);
      pr.then(function (r) {
        if (!alive) return;
        var aus = r && r.auswertung; if (!aus) throw new Error("Die Auswertung war leer. Bitte versuche es noch einmal.");
        lsSet("fp-komm-last-" + s.id, { at: Date.now(), aus: aus, metriken: p.metriken });
        save(p.setS, s.id, aus);
        p.ok(aus);
      }).catch(function (e) { if (alive) err[1](e.message || "Die Auswertung hat nicht geklappt."); });
      return function () { alive = false; clearInterval(iv); };
    }, [run[0]]);
    return h("div", { className: "km", style: { "--c": k.c } },
      h("div", { className: "km-card km-load", "aria-live": "polite" },
        err[0] ? null : h("div", { className: "km-spin", "aria-hidden": "true" }),
        h("b", { style: { fontSize: 17 } }, err[0] ? "Auswertung nicht möglich" : "Dein Gespräch wird ausgewertet"),
        err[0] ? h("div", { className: "km-err" }, err[0]) : h("ul", { className: "km-steps" }, ["Mitschrift ordnen", "Gesprächsführung, Verständlichkeit, Empathie und Fachlichkeit prüfen", "Schlüsselmomente und Tipps zusammenstellen"].map(function (t, i) { return h("li", { key: i, className: i <= stp[0] ? "on" : "" }, (i < stp[0] ? "✓ " : "") + t); })),
        err[0] ? h("div", { className: "km-row", style: { justifyContent: "center" } },
          h("button", { type: "button", className: "btn", onClick: function () { err[1](null); stp[1](0); run[1](run[0] + 1); } }, "Noch einmal versuchen"),
          h("button", { type: "button", className: "btn ghost", onClick: function () { p.go({ v: "brief", id: s.id }); } }, "Zurück")) : null));
  }
  function Short(p) {
    var s = sz(p.id), k = kat(s.kat);
    return h("div", { className: "km", style: { "--c": k.c } },
      h("div", { className: "km-card km-load" },
        h("b", { style: { fontSize: 17 } }, "Das Gespräch war zu kurz"),
        h("p", { className: "km-note", style: { maxWidth: "44ch" } }, "Für eine Auswertung brauchst du mindestens zwei eigene Beiträge. Wenn die Person dich nicht gehört hat, prüfe dein Mikrofon oder wechsle auf Schreiben."),
        h("div", { className: "km-row", style: { justifyContent: "center" } },
          h("button", { type: "button", className: "btn", onClick: function () { p.go({ v: "brief", id: s.id }); } }, "Noch einmal"),
          h("button", { type: "button", className: "btn ghost", onClick: function () { p.go({ v: "kat", kat: k.id }); } }, "Anderes Gespräch"))));
  }

  /* ---------- Beispiel für die Demo ---------- */
  var BEISPIEL = {
    verlauf: [
      { r: "du", t: "Guten Morgen, Herr Wallner. Ich bin Lea, Auszubildende, und betreue Sie heute. Wie geht es Ihnen?" },
      { r: "ki", t: "Morgen ... na ja, geht schon. Die haben ja genug zu tun hier." },
      { r: "du", t: "Sie sehen angespannt aus. Haben Sie Schmerzen?" },
      { r: "ki", t: "Ein bisschen. Is' halt frisch operiert, ne?" },
      { r: "du", t: "Können Sie mir auf einer Skala von null bis zehn sagen, wie stark? Null heißt gar keine Schmerzen, zehn die stärksten, die Sie sich vorstellen können." },
      { r: "ki", t: "Wie bitte? ... Ach so. Wenn ich still lieg, so sechs. Wenn ich mich beweg, acht." },
      { r: "du", t: "Das ist ziemlich viel. Warum haben Sie nicht geklingelt?" },
      { r: "ki", t: "Ich will keine Umstände machen. Und ehrlich gesagt ... ich will nicht so viel von dem Zeug nehmen. Mein Bruder, der ist da abhängig geworden." },
      { r: "du", t: "Das verstehe ich. Die Schmerzmittel hier bekommen Sie nur kurz nach der Operation. Ich sage der Pflegefachkraft Bescheid und wir sprechen mit dem Arzt, okay?" },
      { r: "ki", t: "Hm. Na gut. Aber nicht so starkes Zeug." }
    ],
    metriken: { dauer: 214, redeanteil: 52, tempo: 158, fragen: 4, offen: 2, unterbrechungen: 1, beitraege: 5, modus: "sprache" },
    aus: {
      gesamt: 71,
      kurzfazit: "Ein freundlicher, klarer Einstieg und eine saubere Schmerzerfassung mit erklärter Skala. Die Sorge vor Abhängigkeit hast du gehört, aber schnell beruhigt statt nachzufragen. Ort und Art der Schmerzen sowie die Angst vor der Mobilisation blieben offen.",
      dimensionen: {
        gespraechsfuehrung: { punkte: 72, bewertung: "Gute Struktur am Anfang, am Ende fehlen Zusammenfassung und eine klare Vereinbarung.", staerken: ["Vorstellung mit Name, Rolle und Anliegen", "Skala vor der Frage erklärt"], verbessern: ["Nach dem Ort und der Art des Schmerzes fragen", "Zum Schluss kurz zusammenfassen, was als Nächstes passiert und wann du wiederkommst"] },
        verstaendlichkeit: { punkte: 76, bewertung: "Klare Sätze ohne Fachjargon. Das Tempo war für einen schwerhörigen Patienten etwas hoch.", staerken: ["Keine Fachwörter wie NRS oder Analgetikum"], verbessern: ["Langsamer sprechen und ihn von der linken Seite ansprechen, dort trägt er sein Hörgerät"] },
        empathie: { punkte: 64, bewertung: "Du hast die Anspannung bemerkt. Bei der Sorge um Abhängigkeit hast du sie schnell entkräftet, statt sie zu würdigen.", staerken: ["Anspannung beobachtet und angesprochen"], verbessern: ["Sorge zuerst spiegeln und nachfragen, bevor du informierst"] },
        fachlich: { punkte: 70, bewertung: "Weitergabe an die Pflegefachkraft und den Arzt ist richtig. Die Aussage „nur kurz“ ist ein Versprechen, das du nicht sicher geben kannst.", staerken: ["Eigene Rolle beachtet, Rücksprache angekündigt"], verbessern: ["Ort, Qualität und Verlauf erfassen", "Mobilisation und Schmerzmittel vorher gemeinsam planen"] }
      },
      ziele: [
        { ziel: "Schmerz systematisch erfassen (Stärke, Ort, Art, seit wann)", status: "teilweise", begruendung: "Stärke in Ruhe und Bewegung erfragt, Ort, Art und Verlauf fehlen." },
        { ziel: "Seine Bedenken heraushören und ernst nehmen", status: "teilweise", begruendung: "Sorge erkannt, aber direkt beruhigt statt vertieft." },
        { ziel: "Verständlich erklären, wie es weitergeht", status: "teilweise", begruendung: "Rücksprache angekündigt, aber ohne Zeitpunkt und Mobilisation." },
        { ziel: "Langsam und deutlich sprechen, er hört rechts schlecht", status: "offen", begruendung: "Er musste nachfragen, das Tempo lag bei etwa 158 Wörtern pro Minute." }
      ],
      momente: [
        { zitat: "Null heißt gar keine Schmerzen, zehn die stärksten, die Sie sich vorstellen können.", art: "stark", kommentar: "So kann er die Zahl wirklich einordnen.", besser: "" },
        { zitat: "Warum haben Sie nicht geklingelt?", art: "verbessern", kommentar: "„Warum“ klingt schnell nach Vorwurf. Er hat trotzdem geantwortet, aber vorsichtig.", besser: "„Was hat Sie davon abgehalten, zu klingeln? Sie dürfen sich jederzeit melden.“" },
        { zitat: "Die Schmerzmittel hier bekommen Sie nur kurz nach der Operation.", art: "verbessern", kommentar: "Gut gemeint, aber du gehst über seine Sorge hinweg und versprichst etwas, das der Arzt entscheidet.", besser: "„Das mit Ihrem Bruder klingt, als hätte Sie das sehr beschäftigt. Was genau befürchten Sie? Ich nehme das mit in das Gespräch mit dem Arzt.“" }
      ],
      naechsterSchritt: "Übe den Dreischritt Spiegeln, Nachfragen, Informieren: Wiederhole die Sorge in eigenen Worten, frag einmal nach und gib erst dann die Information."
    }
  };

  var BEISPIEL_UEB = {
    verlauf: [
      { r: "ki", t: "Hallo, ich hol Herrn Brenner. Was gibt's?" },
      { r: "du", t: "Hallo Lisa. Herr Werner Brenner, 58, Knie-TEP rechts heute, OP von neun Uhr zehn bis Viertel vor elf, seit elf im Aufwachraum. Er ist stabil." },
      { r: "du", t: "Er hat Bluthochdruck und eine Penicillinallergie. Narkose war spinal mit etwas Propofol, Blutverlust etwa 300 Milliliter." },
      { r: "ki", t: "Okay. Und wie geht's ihm jetzt?" },
      { r: "du", t: "Blutdruck 132 zu 78, Puls 76, Sättigung 96 ohne Sauerstoff. Schmerzen bei drei. Beine bewegt er wieder. Die Drainage hat 120 Milliliter." },
      { r: "ki", t: "Wann hat er zuletzt was gegen Schmerzen bekommen?" },
      { r: "du", t: "Piritramid um halb eins. Ach so, und Metamizol um zehn vor elf." },
      { r: "ki", t: "Und der Fuß? Durchblutung?" },
      { r: "du", t: "Ähm, der war warm, glaube ich. Ja." },
      { r: "ki", t: "Gut. Noch was?" },
      { r: "du", t: "Nee, das war's." }
    ],
    metriken: { dauer: 168, redeanteil: 61, tempo: 149, fragen: 0, offen: 0, unterbrechungen: 0, beitraege: 6, modus: "sprache" },
    aus: {
      gesamt: 68,
      kurzfazit: "Ein sehr klarer Einstieg mit Situation und Hintergrund. Bei der Einschätzung fehlten Temperatur, Urin und die Durchblutung kam unsicher. Die Empfehlung für die nächsten Stunden hast du ausgelassen, dadurch musste Lisa viel nachfragen.",
      dimensionen: {
        gespraechsfuehrung: { punkte: 64, bewertung: "S und B kamen vorbildlich in der richtigen Reihenfolge. Danach ging die Struktur verloren und der Abschluss fehlte.", staerken: ["Übergabe mit Name, Alter, OP und Zeit begonnen"], verbessern: ["Mit R abschließen: offene Aufgaben mit Uhrzeit und Rückfragen anbieten"] },
        verstaendlichkeit: { punkte: 78, bewertung: "Knapp, mit Zahlen und Einheiten. Nur die Uhrzeiten der Schmerzmittel kamen durcheinander.", staerken: ["Werte mit Einheit genannt"], verbessern: ["Medikamente chronologisch nennen: Metamizol 10:50, Piritramid 12:30"] },
        empathie: { punkte: 80, bewertung: "Kollegialer, freundlicher Ton.", staerken: ["Ruhig und freundlich"], verbessern: [] },
        fachlich: { punkte: 58, bewertung: "Wichtige Punkte fehlten: Temperatur, Urinkatheter, Infusion und die nächste mögliche Bedarfsgabe. Die Durchblutung war unsicher.", staerken: ["Allergie früh genannt"], verbessern: ["Durchblutung, Motorik und Sensibilität am operierten Bein sicher prüfen und berichten", "Katheter, Infusion und Thromboseprophylaxe übergeben"] }
      },
      sbar: {
        situation: { status: "erfuellt", hinweis: "Name, Alter, Eingriff, Uhrzeit und 'stabil' in zwei Sätzen, genau so soll es sein." },
        background: { status: "erfuellt", hinweis: "Vorerkrankung, Allergie, Narkoseart und Blutverlust vollständig." },
        assessment: { status: "teilweise", hinweis: "Vitalwerte und Schmerz waren da. Temperatur, Urin, Verband und eine sichere Aussage zur Durchblutung am rechten Fuß fehlten." },
        recommendation: { status: "fehlt", hinweis: "Keine offenen Aufgaben genannt, etwa Kontrollen stündlich bis 17 Uhr, Metamizol um 18 Uhr, Enoxaparin um 22 Uhr, Katheter morgen früh." },
        reihenfolge: true,
        fazit: "Du hast SBAR erkennbar genutzt, und S und B waren sehr gut. Übe vor allem das R: Was soll die Kollegin in den nächsten Stunden tun, und wann soll sie wen informieren?"
      },
      ziele: [
        { ziel: "Mit SBAR strukturiert übergeben", status: "teilweise", begruendung: "S, B und Teile von A sauber, R fehlte." },
        { ziel: "OP-Verlauf, Anästhesie und aktuellen Zustand mit Werten nennen", status: "teilweise", begruendung: "Temperatur und Urin fehlten." },
        { ziel: "Drainagen, Zugänge, Schmerz und Anordnungen vollständig übergeben", status: "teilweise", begruendung: "Drainage ja, Katheter und Infusion nein." },
        { ziel: "Offene Punkte für die ersten Stunden auf Station klar benennen", status: "offen", begruendung: "Nicht angesprochen." }
      ],
      momente: [
        { zitat: "Herr Werner Brenner, 58, Knie-TEP rechts heute, OP von neun Uhr zehn bis Viertel vor elf", art: "stark", kommentar: "Ein perfektes S: Lisa weiß sofort, um wen und was es geht.", besser: "" },
        { zitat: "Ähm, der war warm, glaube ich. Ja.", art: "verbessern", kommentar: "Unsicherheit bei einem wichtigen Befund. Besser ehrlich sagen und gemeinsam nachschauen.", besser: "„Zuletzt um 13:15 Uhr: Fuß warm, rosig, Zehen beweglich. Lass uns vor dem Transport noch einmal gemeinsam schauen.“" },
        { zitat: "Nee, das war's.", art: "verbessern", kommentar: "Hier fehlt das R. Die Kollegin geht ohne Plan für die nächsten Stunden.", besser: "„Für die Station: Vitalzeichen und Drainage stündlich bis 17 Uhr, Metamizol um 18 Uhr, Enoxaparin um 22 Uhr, Katheter morgen früh raus. Hast du noch Fragen?“" }
      ],
      naechsterSchritt: "Schreib dir vor der nächsten Übergabe die vier Buchstaben auf und notiere zu R mindestens drei Aufgaben mit Uhrzeit."
    }
  };

  /* ---------- Hauptkomponente ---------- */
  function Kommunikation(p) {
    var nav = uS(function () { var o = window.FP_KOMM_OPEN; window.FP_KOMM_OPEN = null; return o && sz(o) ? { v: "brief", id: o } : { v: "home" }; }), data = uS(null), modeOverride = uS(null);
    var v = nav[0];
    function go(n) { nav[1](n); top(); }
    uE(function () { var o = window.FP_KOMM_OPEN; if (o) { window.FP_KOMM_OPEN = null; if (sz(o)) go({ v: "brief", id: o }); } });
    if (v.v === "kat") return h(Kat, { kat: v.kat, S: p.S, go: go });
    if (v.v === "brief") return h(Brief, { id: v.id, S: p.S, go: go, mode: modeOverride[0] });
    if (v.v === "call") return h(Call, {
      key: v.id + (modeOverride[0] || v.mode), id: v.id, mode: modeOverride[0] || v.mode, cap: v.cap,
      cancel: function () { go({ v: "brief", id: v.id }); },
      switchMode: function (m) { modeOverride[1](m); },
      done: function (r) { data[1](r); modeOverride[1](null); nav[1]({ v: (r.metriken.beitraege || 0) < 2 ? "short" : "eval", id: v.id }); top(); }
    });
    if (v.v === "short") return h(Short, { id: v.id, go: go });
    if (v.v === "eval") return h(Eval, { id: v.id, verlauf: data[0].verlauf, metriken: data[0].metriken, setS: p.setS, go: go, ok: function (aus) { data[1](Object.assign({}, data[0], { aus: aus })); nav[1]({ v: "result", id: v.id }); top(); } });
    if (v.v === "result") {
      if (v.beispiel && sz(v.id) && sz(v.id).kat === "uebergabe") return h(Result, { id: "ueb-op", aus: BEISPIEL_UEB.aus, verlauf: BEISPIEL_UEB.verlauf, metriken: BEISPIEL_UEB.metriken, go: go, hinweis: "Beispielauswertung zur Übergabe „Aus dem Aufwachraum: Knie-TEP“. So sieht deine Rückmeldung mit SBAR-Check nach jeder Übergabe aus." });
      if (v.beispiel) return h(Result, { id: "pat-schmerz", aus: BEISPIEL.aus, verlauf: BEISPIEL.verlauf, metriken: BEISPIEL.metriken, go: go, hinweis: "Beispielauswertung zum Gespräch „Schmerzen nach der Hüft-OP“. So sieht deine Rückmeldung nach jedem Gespräch aus." });
      if (v.gespeichert) { var l = lsGet("fp-komm-last-" + v.id, null); if (l) return h(Result, { id: v.id, aus: l.aus, metriken: l.metriken, go: go, hinweis: "Deine letzte Auswertung vom " + new Date(l.at).toLocaleDateString("de-DE") + ". Die Mitschrift wird nicht gespeichert." }); }
      if (data[0] && data[0].aus) return h(Result, { id: v.id, aus: data[0].aus, verlauf: data[0].verlauf, metriken: data[0].metriken, go: go });
    }
    return h(Home, { S: p.S, go: go });
  }
  window.FP_Kommunikation = Kommunikation;
  window.FP_KOMM_BEISPIEL = BEISPIEL;
})();
