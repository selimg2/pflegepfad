// Fallpfad – Verbindung zur Cloud-Datenbank (Supabase)
// Leer lassen = lokaler Modus: Profil und Fortschritt nur im jeweiligen Browser.
// Ausfüllen = Anmeldung mit E-Mail und Passwort, Fortschritt geräteübergreifend in Supabase.
// Beide Werte findest du in Supabase unter Project Settings > API. Der "anon public" key darf öffentlich sein,
// die Daten schützt Row Level Security (siehe supabase/schema.sql). Den "service_role" key NIEMALS hier eintragen.
window.FALLPFAD_CONFIG = {
  supabaseUrl: "",      // z. B. "https://abcdefghijklmno.supabase.co"
  supabaseAnonKey: "",  // z. B. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
};
