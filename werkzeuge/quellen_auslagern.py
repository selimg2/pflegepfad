#!/usr/bin/env python3
"""Lagert Quellen und Literaturzitate aus den Lerninhalten der Schüler-App in das Quellenregister
des Admin-Bereichs (Lehrer-Portal) aus.

Regel: Lernende sehen keine Quellenangaben, keine Literaturverzeichnisse und keine Autor-Jahr-Zitate.
Erklärende Klammern im Fließtext („… (Reservoir)“) bleiben. Belege stehen vollständig im Register
und werden im Lehrer-Portal nur für die Rolle admin angezeigt (Admin-Zentrale → Quellen).

Aufruf:
  python3 -I werkzeuge/quellen_auslagern.py <schueler-repo> <lehrer-repo> [--schreiben]
Ohne --schreiben: nur Bericht (Trockenlauf). Mit --schreiben: Module bereinigen und
<lehrer-repo>/daten/quellen-register.json erzeugen bzw. ergänzen (bestehende Prüfvermerke bleiben).
"""
import sys, json, glob, os, re, hashlib, datetime

student, teacher = sys.argv[1], sys.argv[2]
WRITE = "--schreiben" in sys.argv
REG = os.path.join(teacher, "daten/quellen-register.json")
REVIEW = os.path.join(student, ".pflegepfad-review/quellen.json")

S = lambda s: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()

# ---------- Erkennen von Literaturangaben ----------
YEAR = r"(?:1[89]\d\d|20\d\d)[a-z]?"
NAME = r"[A-ZÄÖÜ][\w'’\-]+"
# Parenthetische Zitate: (Brignole et al., 2018) (Teasdale & Jennett, 1974) (DNQP, 2020; Treede et al., 2019) (vgl. Miller & Rollnick, 2013)
PAREN = re.compile(r"\s?\((?:vgl\. )?(?:[^()]*?(?:et al\.|&| und |[A-ZÄÖÜ]{2,})[^()]*?,\s?" + YEAR + r"(?:;[^()]*?" + YEAR + r")*|" + NAME + r",\s?" + YEAR + r"|(?:STIKO|Bundesgerichtshof|BGH|DAS-Leitlinie|KRINKO|DNQP|WHO|RKI) " + YEAR + r"|AWMF[^()]*?" + YEAR + r"|\d\. Aktualisierung " + YEAR + r")\)")
# Erzählende Zitate: Apfel et al. (1999) / Melzack & Wall (1965) / Die WHO (2007)
BARE = re.compile(r"(?<!NRS)\s\(" + YEAR + r"\)")
NARR_ETAL = re.compile(r"\b(" + NAME + r") et al\. \(" + YEAR + r"\)")
NARR_PAIR = re.compile(r"\b(" + NAME + r") (?:&|und) (" + NAME + r") \(" + YEAR + r"\)")
NARR_ONE = re.compile(r"\b((?:WHO|DNQP|RKI|STIKO|KRINKO|NICE|BZgA|Aktionsbündnis Patientensicherheit|Aldrete|Saunders|Maslow|Orem|Peplau|Erikson|Roper|Juchli|Krohwinkel|Benner|Bandura|Rogers|Antonovsky|Engel|Kitwood|Feil|Böhm|Bowlby|Kübler-Ross|Wittneben|Zegelin|Leininger|Mead|Watzlawick|Schulz von Thun|Corbin|Selye|Lazarus)) \(" + YEAR + r"\)")

def ist_literatur(s):
    return bool(re.search(r"\(" + YEAR + r"\)|\(o\. ?J\.\)|\b" + YEAR + r"\b|§|Gesetz|Verordnung|Richtlinie|Leitlinie|Expertenstandard|AWMF|https?://", s))

def split_refs(text):
    """Trennt eine Literaturkette an '; ', wenn danach eine neue Angabe beginnt."""
    text = text.strip().rstrip(".")
    parts = re.split(r";\s+(?=[A-ZÄÖÜ][^;]{1,140}?(?:\(" + YEAR + r"|\(o\. ?J\.|\(Hrsg\.|Gesetz|Verordnung|Richtlinie|Leitlinie|§|\d{4}))", text)
    out = []
    for p in parts:
        p = p.strip().strip(";").strip()
        if p:
            out.append(p if p.endswith(".") else p + ".")
    return out

def norm(s):
    return re.sub(r"[^a-z0-9äöüß]", "", s.lower())[:120]

def key_of(s):
    s = re.sub(r"^[\s(]*(?:vgl\.\s*)?", "", s)
    m = re.match(r"([A-Za-zÄÖÜäöüß'’\-]+)", s)
    y = re.search(r"(1[89]\d\d|20\d\d)", s)
    return ((m.group(1).lower() if m else "") + "|" + (y.group(1) if y else ""))

# ---------- APA-7-Formalprüfung (keine inhaltliche Verifikation) ----------
def apa_maengel(ref):
    m = []
    if "et al." in ref:
        m.append("Autorenliste gekürzt – APA 7 verlangt im Literaturverzeichnis alle Autorinnen und Autoren (bis 20)")
    if re.search(r"\(o\. ?J\.\)", ref):
        m.append("Jahr fehlt (o. J.) – Erscheinungs- oder Abrufdatum ergänzen")
    zeitschrift = re.search(r"\.\s[A-ZÄÖÜ][^.]+,\s?\d+(\(\d+[^)]*\))?,\s?[e\dS]", ref)
    if zeitschrift and not re.search(r"doi\.org/|doi:", ref, re.I):
        m.append("Zeitschriftenartikel ohne DOI")
    if not zeitschrift and not re.search(r"https?://|doi", ref, re.I) and not re.search(r"Gesetz|§|Art\.|Verordnung|StGB|BGB|SGB|GG\b", ref):
        m.append("weder DOI noch URL angegeben")
    if re.search(r"\bAWMF\b", ref) and not re.search(r"\d{3}-\d{3}", ref):
        m.append("AWMF-Registernummer fehlt")
    if re.match(r"^[A-ZÄÖÜ][\wäöüß\-]+ \(", ref) and "Hrsg." not in ref and not re.search(r"^(DNQP|WHO|RKI|STIKO|KRINKO|NICE|DGP|DGKJ|BZgA|BfArM)", ref):
        m.append("Autorenangabe ohne Initialen")
    return m

def doi_of(ref):
    d = re.search(r"(?:https?://doi\.org/|doi:\s?)(10\.\d{4,9}/[^\s;]+?)(?=[.;]?\s|[.;]?$)", ref, re.I)
    return d.group(1) if d else ""

def url_of(ref):
    u = re.search(r"https?://[^\s;]+", ref)
    return u.group(0).rstrip(".") if u else ""

# ---------- Bereinigung ----------
def clean_html(h, stelle_refs):
    # 1) <p class="src">Quellen: …</p>
    def p_src(mm):
        inner = S(mm.group(1))
        inner = re.sub(r"^Quellen?:\s*", "", inner)
        refs, rest = [], []
        for part in re.split(r"(?<=\.)\s+(?=[A-ZÄÖÜ][a-zäöüß]+ (?:ist|sind|gilt|gelten|werden|wird|prüfe|Prüfe|Verbindlich|Halte|Beachte)\b|Verbindlich|Die ERC-Leitlinien werden|Prüfe |Beachte )", inner):
            if ist_literatur(part) and not re.match(r"^(Verbindlich|Die ERC-Leitlinien werden|Prüfe|Beachte|Halte)", part):
                refs += split_refs(part)
            else:
                rest.append(part)
        stelle_refs.extend(refs)
        return ("<p>" + " ".join(rest) + "</p>") if rest else ""
    h = re.sub(r"\s*<p class=\"src\">(.*?)</p>", p_src, h, flags=re.S)
    # 2) Nachgestellte „Quellen: …“ innerhalb eines Absatzes bzw. am Textende
    def tail(mm):
        if not ist_literatur(mm.group(1)):
            return mm.group(0)
        refs = split_refs(S(mm.group(1)))
        stelle_refs.extend(refs)
        return mm.group(2) or ""
    h = re.sub(r"\s*Quellen?:\s*((?:(?!</p>).)+?)\s*(</p>|$)", tail, h, flags=re.S)
    return h

def clean_inline(s, zitate):
    def rec(mm):
        zitate.append(mm.group(0).strip()); return ""
    s2 = PAREN.sub(rec, s)
    s2 = NARR_ETAL.sub(lambda mm: (zitate.append(mm.group(0)), mm.group(1))[1], s2)
    s2 = NARR_PAIR.sub(lambda mm: (zitate.append(mm.group(0)), mm.group(1) + " und " + mm.group(2))[1], s2)
    s2 = NARR_ONE.sub(lambda mm: (zitate.append(mm.group(0)), mm.group(1))[1], s2)
    s2 = BARE.sub(rec, s2)
    s2 = re.sub(r"\s+([.,;:])", r"\1", s2).replace("  ", " ")
    return s2

# ---------- Lauf ----------
alt = json.load(open(REG, encoding="utf-8")) if os.path.exists(REG) else {}
quellen = alt.get("quellen", {})
idx = {norm(v["apa"]): k for k, v in quellen.items()}
def reg_ref(ref):
    n = norm(ref)
    if n in idx: return idx[n]
    qid = "Q" + hashlib.sha1(n.encode()).hexdigest()[:8]
    quellen[qid] = {"apa": ref, "doi": doi_of(ref), "url": url_of(ref), "maengel": apa_maengel(ref), "status": "formal_ungeprueft"}
    idx[n] = qid
    return qid

module_out = []
bericht = {"module": 0, "stellen": 0, "zitate_entfernt": 0, "quellenlisten": 0}
for f in sorted(glob.glob(os.path.join(student, "daten/module/jahr-*/fm*.js")), key=lambda x: int(re.search(r"fm(\d+)", x).group(1))):
    t = open(f, encoding="utf-8").read()
    a, b = t.index("{"), t.rindex("}") + 1
    m = json.loads(t[a:b])
    vorher = json.dumps(m, ensure_ascii=False)
    gesamt = [reg_ref(r) for r in m.get("sources", [])]
    by_key = {}
    for q in gesamt:
        by_key.setdefault(key_of(quellen[q]["apa"]), q)
    stellen = []

    def ort(path):
        mm = re.match(r"chapters\[(\d+)\](?:\.blocks\[(\d+)\])?", path)
        if not mm: return "Modulrahmen"
        c = m["chapters"][int(mm.group(1))]
        o = "Station " + str(int(mm.group(1)) + 1) + " · " + S(c.get("title", ""))
        if mm.group(2) is not None:
            bl = c["blocks"][int(mm.group(2))]
            o += " → " + (S(bl.get("title") or "") or bl.get("type", "")) + (" (" + bl["id"] + ")" if bl.get("id") else "")
        return o

    def walk(o, p):
        if isinstance(o, dict):
            for k in list(o):
                if p == "" and k == "sources": continue
                o[k] = walk(o[k], (p + "." if p else "") + k)
            return o
        if isinstance(o, list):
            return [walk(v, f"{p}[{i}]") for i, v in enumerate(o)]
        if isinstance(o, str) and not o.startswith("<svg"):
            refs, zit = [], []
            s = clean_html(o, refs) if ("Quelle" in o) else o
            s = clean_inline(s, zit)
            if refs or zit:
                ids = []
                for r in refs:
                    k = key_of(r)
                    ids.append(by_key.get(k) or reg_ref(r))
                for z in zit:
                    for teil in z.strip("()").split(";"):
                        q = by_key.get(key_of(teil))
                        if q and q not in ids: ids.append(q)
                stellen.append({"pfad": p, "ort": ort(p), "quellen": ids, "zitate_im_text_entfernt": zit, "text_auszug": S(s)[:160]})
                bericht["zitate_entfernt"] += len(zit)
            return s
        return o
    walk(m, "")
    if m.get("sources"):
        bericht["quellenlisten"] += 1
    m["sources"] = []
    bericht["module"] += 1; bericht["stellen"] += len(stellen)
    module_out.append({"id": m["id"], "titel": m.get("title"), "jahr": m.get("year"), "quellenverzeichnis": gesamt, "stellen": stellen})
    if WRITE and json.dumps(m, ensure_ascii=False) != vorher:
        open(f, "w", encoding="utf-8").write(t[:a] + json.dumps(m, ensure_ascii=False, separators=(",", ":")) + t[b:])

# Prüfvermerke aus dem Redaktions-Quellenregister übernehmen
pruef = []
if os.path.exists(REVIEW):
    for q in json.load(open(REVIEW, encoding="utf-8")).get("quellen", []):
        pruef.append(q)

alt_module = {x["id"]: x for x in alt.get("module", [])}
for mo in module_out:   # bereits ausgelagerte Stellen aus früheren Läufen behalten
    if mo["id"] in alt_module and not mo["stellen"] and not mo["quellenverzeichnis"]:
        mo.update({k: alt_module[mo["id"]][k] for k in ("quellenverzeichnis", "stellen")})

register = {
    "hinweis": "Quellenregister Fallpfad. Nur für die Rolle admin im Lehrer-Portal (Admin-Zentrale → Quellen). Lernende sehen keine Quellenangaben. status: formal_ungeprueft = automatisch übernommen, APA-7-Mängel siehe 'maengel'; apa7_geprueft = Angabe vollständig nach APA 7 und DOI/URL geöffnet; inhalt_verifiziert = zusätzlich Belegstelle im Redaktionsprotokoll.",
    "stand": datetime.date.today().isoformat(),
    "quellen": quellen,
    "module": module_out,
    "weitere": alt.get("weitere", []),
    "pruefprotokoll": pruef,
}
print(json.dumps(bericht, ensure_ascii=False), "· Quellen im Register:", len(quellen),
      "· davon mit APA-Mängeln:", sum(1 for q in quellen.values() if q["maengel"]))
if WRITE:
    os.makedirs(os.path.dirname(REG), exist_ok=True)
    if alt.get("apa7_stand") and "--neu" not in sys.argv:
        # Register ist bereits angereichert (PubMed/APA 7, Zuordnungen, Prüfstatus): nie überschreiben.
        # Neue Modulquellen gehören direkt ins Register (Modul-Quellenlisten bleiben leer, Regel Q-01).
        print("Register bereits angereichert – nicht überschrieben. Nur mit --neu neu aufbauen (verliert Prüfvermerke).")
        sys.exit(0)
    json.dump(register, open(REG, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Register geschrieben:", REG)
else:
    json.dump(register, open("/tmp/quellen-register-trocken.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
