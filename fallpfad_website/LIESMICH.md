# Fallpfad als Website veröffentlichen

Dieser Ordner ist eine fertige, statische Website. Es gibt keinen Build-Schritt.

| Datei | Zweck |
|---|---|
| `index.html` | die komplette App mit allen 22 Modulen |
| `config.js` | Verbindung zur Cloud-Datenbank, anfangs leer |
| `favicon.svg` | App-Symbol im Browser-Tab |
| `supabase/schema.sql` | Tabelle und Zugriffsregeln für Supabase |
| `netlify.toml` | Einstellungen für Netlify (optional) |

## 1. Lokal ansehen
`index.html` per Doppelklick öffnen. Ohne Eintrag in `config.js` läuft die App im lokalen Modus.

## 2. Auf Netlify veröffentlichen
1. Auf netlify.com ein kostenloses Konto anlegen.
2. Im Dashboard „Add new site“ und dann „Deploy manually“ wählen.
3. Den ganzen Ordner `website` in das Feld ziehen.
4. Netlify zeigt eine Adresse wie `https://irgendein-name.netlify.app`. Unter „Site configuration“, dann „Change site name“, lässt sich der Name ändern.

## Alternativ: Vercel
1. Auf vercel.com ein Konto anlegen und die Vercel-CLI installieren: `npm i -g vercel`.
2. Im Terminal in den Ordner `website` wechseln und `vercel` eingeben.
3. Alle Fragen mit Enter bestätigen, zum Schluss `vercel --prod` ausführen.

## 3. Supabase verbinden
1. Auf supabase.com ein Konto anlegen und mit „New project“ ein Projekt erstellen. Als Region **Frankfurt (eu-central-1)** wählen.
2. Unter „SQL Editor“ den Inhalt von `supabase/schema.sql` einfügen und „Run“ klicken.
3. Unter „Authentication“, dann „URL Configuration“, die Website-Adresse als **Site URL** eintragen, z. B. `https://fallpfad.netlify.app`. Sonst führen die Bestätigungslinks ins Leere.
4. Unter „Authentication“, dann „Providers“, ist „Email“ standardmäßig aktiv. „Confirm email“ eingeschaltet lassen.
5. Unter „Project Settings“, dann „API“, die **Project URL** und den **anon public key** kopieren.
6. Beide Werte in `config.js` eintragen.
7. Den Ordner erneut auf Netlify hochladen („Deploys“, neuen Ordner hineinziehen) bzw. `vercel --prod` erneut ausführen.

Jetzt erscheint beim Start die Anmeldung mit E-Mail und Passwort. Der Fortschritt wird nach jeder Änderung gebündelt gespeichert. Auf einem anderen Gerät erscheint er nach der Anmeldung wieder.

## Sicherheit und Datenschutz
- Der anon key darf öffentlich sein. Den **service_role key** nie in `config.js` eintragen.
- Die Row Level Security in `schema.sql` sorgt dafür, dass jede Person nur ihren eigenen Datensatz lesen und ändern kann.
- Gespeichert werden E-Mail-Adresse, Vorname und Lernfortschritt. Vor dem Einsatz mit Schülerinnen und Schülern mit der Schulleitung und der oder dem Datenschutzbeauftragten klären:
  - Rechtsgrundlage und Information der Lernenden,
  - Vertrag zur Auftragsverarbeitung mit Supabase,
  - Löschfristen.
