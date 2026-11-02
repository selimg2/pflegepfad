# Fallpfad Schüler-App

Dieser Ordner ist die Website für die Lernenden (zum Beispiel https://pflegepfad.vercel.app).

| Datei | Wofür |
|---|---|
| `index.html` | die komplette App mit allen 34 Modulen |
| `config.BEISPIEL.js` | Vorlage für die Datenbank-Verbindung. Nur nötig, wenn du noch keine `config.js` hast |
| `favicon.svg`, `icon-*.png`, `apple-touch-icon.png` | App-Symbole für Browser und Handy-Startbildschirm |
| `manifest.webmanifest` | macht die App auf dem Handy installierbar |
| `sw.js` | hält die App offline verfügbar |
| `vercel.json` | Einstellung für Vercel |
| `netlify.toml` | Einstellung für Netlify (nur falls du Netlify nutzt) |
| `supabase/schema.sql` | Tabelle für den Lernfortschritt (einmal in Supabase ausführen) |

**Wichtig:** Deine bestehende `config.js` mit deinen Supabase-Werten behältst du. Überschreibe sie nicht.
Die Schritt-für-Schritt-Anleitung steht im Dokument „Fallpfad Lehrer-Portal: Technische Anleitung“.
