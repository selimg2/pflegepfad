// Fallpfad Offline-Cache: App-Dateien und Bibliotheken (Ordner vendor) bleiben ohne Netz verfügbar.
// Supabase-Anfragen (Login, Speichern, Übersetzen) gehen immer direkt ins Netz.
const C = "fallpfad-v32";
const CORE = ["./", "index.html", "favicon.svg", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "vendor/react.production.min.js", "vendor/react-dom.production.min.js", "vendor/supabase.js",
  "datenschutz.html", "nutzungsbedingungen.html", "impressum.html"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(C).then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.includes("/vendor/")) {
    // Versionierte Bibliotheken: Cache zuerst
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); return res; })));
    return;
  }
  // Netz zuerst, damit Updates sofort ankommen; ohne Netz aus dem Cache
  e.respondWith(fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then((m) => m || caches.match("index.html"))));
});
