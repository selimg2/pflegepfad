// Visueller Test der Fortschrittskreise über Viewports, Zoom, Werte 0..100. Nutzt das Demo-Konto (synthetische Daten).
import { createRequire } from "node:module"; const { chromium } = createRequire(import.meta.url)("playwright");
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
// Aufruf: NODE_PATH=<playwright> node werkzeuge/tests/ringe-test.mjs . nachher [screenshotOrdner]
//   PAGES='[["name","js zum Navigieren"]]'  WERTE=1 (erzwingt 0/1/37/99/100 %)
const [,, root = ".", tag = "test", shotDir] = process.argv;
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".svg":"image/svg+xml", ".png":"image/png", ".json":"application/json", ".webmanifest":"application/json" };
const srv = http.createServer((q, s) => { let f = path.join(root, decodeURIComponent(q.url.split("?")[0])); if (f.endsWith("/")) f += "index.html"; fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(0);
const port = srv.address().port, measure = fs.readFileSync(path.join(root, "werkzeuge/tests/ringe-messen.js"), "utf8");
const login = fs.readFileSync(process.env.LOGIN || path.join(root, "werkzeuge/tests/demo-login.js"), "utf8");
const VIEW = [["klein-320", 320, 640, 2], ["normal-390", 390, 844, 3], ["gross-430", 430, 932, 3], ["tablet-820", 820, 1180, 2], ["desktop-1440", 1440, 900, 1], ["zoom-200", 720, 450, 2], ["zoom-67", 2150, 1340, 1]];
const PAGES = process.env.PAGES ? JSON.parse(process.env.PAGES) : [["home", "1"]];
const browser = await chromium.launch(); let fails = 0, total = 0;
for (const [name, w, h, dpr] of VIEW) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, colorScheme: "light" });
  const pg = await ctx.newPage(); pg.on("pageerror", (e) => console.log("PAGEERROR", name, e.message));
  await pg.route(/supabase\.co/, (r) => r.abort());
  await pg.goto(`http://localhost:${port}/index.html`); await pg.waitForTimeout(1200);
  try { await pg.evaluate(login); } catch (e) {} await pg.waitForTimeout(2500); await pg.waitForLoadState("load"); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { try { localStorage.setItem("fp-tour-done", "1"); } catch (e) {} document.querySelectorAll(".tour,.fp-tour,[class*=tour-]").forEach((x) => x.remove()); });
  for (const [pn, js] of PAGES) {
    try { await pg.evaluate(js); } catch (e) { console.log("nav", pn, e.message.slice(0,80)); } await pg.waitForTimeout(1400);
    for (const pct of (process.env.WERTE ? [0, 1, 37, 99, 100] : [null])) {
      if (pct != null) await pg.evaluate((p) => document.querySelectorAll(".ring .fg,[class*=ring] circle.fg").forEach((c) => { const L = c.getTotalLength(); c.style.strokeDasharray = L; c.style.strokeDashoffset = L * (1 - p / 100); }), pct);
      const res = JSON.parse(await pg.evaluate(measure)); total += res.ringe;
      if (res.probleme.length) { fails++; console.log(`${tag} ${name} ${pn}${pct != null ? " " + pct + "%" : ""}: ${res.ringe} Ringe, PROBLEME:\n  - ` + res.probleme.join("\n  - ")); }
      else console.log(`${tag} ${name} ${pn}${pct != null ? " " + pct + "%" : ""}: ${res.ringe} Ringe ok`);
    }
    if (shotDir) await pg.screenshot({ path: `${shotDir}/${tag}-${name}-${pn}.png` });
  }
  await ctx.close();
}
await browser.close(); srv.close();
console.log(`ERGEBNIS ${tag}: ${fails} Prüfungen mit Problemen, ${total} Ringe gemessen`); process.exit(fails ? 1 : 0);
