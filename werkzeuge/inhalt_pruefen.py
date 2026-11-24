#!/usr/bin/env python3
"""Strukturprüfung der Lerninhalte nach redaktionellen Änderungen (ohne Netz, ohne Browser).

Prüft für alle 75 Module gegen eine gespeicherte Strukturbasis:
- Modul-IDs, Kapitelzahl, Blocktypen, Block-IDs und deren Reihenfolge
- Antwortschlüssel (a, ok, correct, answer), Anzahl der Optionen/Items je Aufgabe, Punkte
- Quiz: Schlüssel 'a' liegt im Bereich der Optionen
- Avatare: Hash von daten/figuren.js unverändert
- Inhaltsregeln (Regressionen aus abgeschlossenen Paketen, siehe REGELN)

Aufruf:
  python3 -I werkzeuge/inhalt_pruefen.py <schueler-repo> --basis-erzeugen   # einmalig vom Ausgangsstand
  python3 -I werkzeuge/inhalt_pruefen.py <schueler-repo> [--erlaubt fm9:chapters[2].blocks[2]=items]
Basis: .pflegepfad-review/struktur_basis.json
"""
import sys, json, glob, os, re, hashlib

root = sys.argv[1]
BASIS = os.path.join(root, ".pflegepfad-review/struktur_basis.json")
KEYS = ("a", "ok", "correct", "answer", "ans", "tol", "min", "max", "step", "points", "kind", "type", "id", "prio", "cat")

def load_mods():
    mods = {}
    for f in sorted(glob.glob(os.path.join(root, "daten/module/jahr-*/fm*.js"))):
        t = open(f, encoding="utf-8").read()
        mods[os.path.basename(f)[:-3]] = json.loads(t[t.index("{"): t.rindex("}") + 1])
    return mods

TEXTLISTEN = ("sources", "outcomes")  # reine Textlisten: Länge darf sich redaktionell ändern

def skeleton(o):
    """Struktur ohne Fließtext: Schlüssel, Listenlängen, Antwort- und Steuerfelder."""
    if isinstance(o, dict):
        return {k: ("·" if k in TEXTLISTEN else v if k in KEYS and not isinstance(v, (dict, list)) else skeleton(v)) for k, v in sorted(o.items())}
    if isinstance(o, list):
        return [skeleton(v) for v in o]
    if isinstance(o, bool) or isinstance(o, (int, float)):
        return o
    return "·"

def fingerprint(mods):
    return {mid: skeleton(m) for mid, m in mods.items()}

def figuren_hash():
    return hashlib.sha256(open(os.path.join(root, "daten/figuren.js"), "rb").read()).hexdigest()

mods = load_mods()
if "--basis-erzeugen" in sys.argv:
    os.makedirs(os.path.dirname(BASIS), exist_ok=True)
    json.dump({"figuren_sha256": figuren_hash(), "module": fingerprint(mods)}, open(BASIS, "w", encoding="utf-8"), ensure_ascii=False)
    print("Basis geschrieben:", len(mods), "Module"); sys.exit(0)

basis = json.load(open(BASIS, encoding="utf-8"))
fehler = []
if figuren_hash() != basis["figuren_sha256"]:
    fehler.append("daten/figuren.js (Avatare) wurde verändert")
fp = fingerprint(mods)
if set(fp) != set(basis["module"]):
    fehler.append(f"Modulmenge geändert: {sorted(set(fp) ^ set(basis['module']))}")
for mid in sorted(set(fp) & set(basis["module"])):
    if fp[mid] != basis["module"][mid]:
        a, b = json.dumps(basis["module"][mid], sort_keys=True), json.dumps(fp[mid], sort_keys=True)
        i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
        fehler.append(f"{mid}: Struktur abweichend bei …{a[max(0, i-80):i+60]}… → …{b[max(0, i-80):i+60]}…")

# Quizschlüssel im Bereich
def walk(o, p):
    if isinstance(o, dict):
        if "q" in o and "o" in o and "a" in o and isinstance(o["o"], list):
            if not (isinstance(o["a"], int) and 0 <= o["a"] < len(o["o"])):
                fehler.append(f"{p}: Antwortschlüssel a={o['a']} außerhalb der Optionen")
        for k, v in o.items(): walk(v, f"{p}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o): walk(v, f"{p}[{i}]")
for mid, m in mods.items(): walk(m, mid)

# Inhaltsregeln (Regressionstests aus abgeschlossenen Paketen)
def text_of(paths):
    out = []
    for p in paths:
        for f in glob.glob(os.path.join(root, p)):
            out.append((f, open(f, encoding="utf-8").read()))
    return out
LERN = ["daten/module/*/fm*.js", "js/training/3[34]-*.js", "daten/fachlexikon.js", "js/funktionen/04-ruhe.js", "js/app/01-app.bundle.js"]
REGELN = [
    ("P0-01", ["js/training/34-*.js", "daten/module/*/fm*.js", "js/training/33-*.js"], r"2-Finger|Zwei-Finger", "Säuglingsreanimation: nur Zwei-Daumen-Technik (ERC 2025)"),
    ("P0-01", ["daten/module/*/fm5.js", "daten/module/*/fm9.js"], r"Olasveengen", "BLS-Quelle auf ERC 2025 aktualisiert"),
    ("P0-01", ["daten/module/*/fm*.js", "js/training/3[34]-*.js"], r"qSOFA[^\]]{0,200}unter 100 mmHg", "qSOFA: systolisch ≤ 100 mmHg"),
    ("P0-01", ["daten/module/*/fm3.js"], r"Zielbereich von 94 bis 98", "SpO2-Ziel nach deutscher S3-Leitlinie"),
    ("P0-02", ["daten/module/*/fm73.js"], r"Kühle Luft kann die Schwellung lindern|Ab 3–5 Minuten|über 3–5 Minuten", "Pseudokrupp/Fieberkrampf: keine unbelegte Kaltluft-Wirkung, Notfallmedikation ab > 5 min"),
    ("P0-02", ["daten/module/*/fm73.js"], r"Paracetamol meist etwa 15 mg", "Antipyretika-Dosierung nach S3 Fiebermanagement (10–15 bzw. 7–10 mg/kg)"),
    ("P0-02", ["daten/module/*/fm16.js"], r"Rotavirus-Impfung der Schwester, sofern noch nicht erfolgt", "Rotavirus-Impfung: Beginn spätestens 12. Woche"),
    ("P0-03", ["daten/module/*/fm64.js"], r"bei Schock \(schlechte Durchblutung\) und", "i. m. bei Schock: Ausnahme Adrenalin bei Anaphylaxie"),
    # Quellen nur im Admin-Quellenregister des Lehrerportals, nie in Lerninhalten
    ("Q-01", LERN, r'"sources":\["', "Modul-Quellenlisten bleiben leer (Register: lehrer daten/quellen-register.json)"),
    ("Q-01", LERN, r"Quellen?: [A-ZÄÖÜ][^<\"]{0,80}\(\d{4}|class=\\?\"src\\?\"", "keine Literaturangaben im Lerntext"),
    ("Q-01", LERN, r"\bet al\.|doi\.org/|https?://(?:www\.)?awmf|\bAWMF-Register", "keine Autor-Jahr-Zitate, DOIs oder Registerverweise im Lerntext"),
    ("Q-01", LERN, r"\((?!NRS\b)[A-ZÄÖÜ][A-Za-zäöüß\-]+(?: (?:&|und) [A-ZÄÖÜ][A-Za-zäöüß\-]+)?,? (?:19|20)\d{2}[a-z]?\)", "keine Klammerzitate (Autor Jahr)"),
]
for pid, paths, pat, msg in REGELN:
    for f, t in text_of(paths):
        if re.search(pat, t):
            fehler.append(f"Regel {pid} verletzt in {os.path.relpath(f, root)}: {msg}")

erlaubt = [a.split("=", 1)[0] for a in sys.argv[2:] if not a.startswith("--")]
if fehler:
    print("\n".join("FEHLER " + x for x in fehler)); sys.exit(1)
print(f"OK: {len(mods)} Module, Struktur und Antwortschlüssel unverändert, Avatare unverändert, {len(REGELN)} Inhaltsregeln erfüllt.")
