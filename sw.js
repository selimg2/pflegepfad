// Fallpfad Offline-Cache: App-Dateien und Bibliotheken bleiben ohne Netz verfügbar.
// Supabase-Anfragen (Login, Speichern) gehen immer direkt ins Netz.
const C = "fallpfad-v24";
const CORE = ["./", "index.html", "favicon.svg", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.hostname.endsWith("supabase.co")) return;
  if (u.origin === location.origin) {
    // Netz zuerst, damit Updates sofort ankommen; ohne Netz aus dem Cache
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then((m) => m || caches.match("index.html"))));
  } else if (/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(u.hostname)) {
    // Versionierte Bibliotheken: Cache zuerst
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); return res; })));
  }
});
