#!/usr/bin/env python3
"""Überträgt die Lernmodule der Schüler-App in die content.json des Lehrer-Portals.

Kanonische Quelle sind die Dateien daten/module/jahr-*/fmN.js der Schüler-App.
content.json:mods ist eine 1:1-Kopie (Stand 24.11.2026: 75/75 identisch). Inhalte werden
deshalb nur in der Schüler-App redigiert und danach mit diesem Skript übertragen.
figs, chars (Avatare), brenner und logo bleiben unangetastet.

Aufruf:
  python3 -I werkzeuge/inhalt_sync.py <schueler-repo> <lehrer-repo>           # schreibt
  python3 -I werkzeuge/inhalt_sync.py <schueler-repo> <lehrer-repo> --pruefen # nur vergleichen, Exit 1 bei Abweichung
"""
import sys, json, glob, os, hashlib

student, teacher = sys.argv[1], sys.argv[2]
check = "--pruefen" in sys.argv
cpath = os.path.join(teacher, "content.json")
raw = open(cpath, encoding="utf-8").read()
content = json.loads(raw)
chars_before = hashlib.sha256(json.dumps(content.get("chars"), sort_keys=True, ensure_ascii=False).encode()).hexdigest()

mods = {}
for f in glob.glob(os.path.join(student, "daten/module/jahr-*/fm*.js")):
    t = open(f, encoding="utf-8").read()
    m = json.loads(t[t.index("{"): t.rindex("}") + 1])
    mods[m["id"]] = m

ids = [m["id"] for m in content["mods"]]
missing = sorted(set(mods) ^ set(ids))
if missing:
    print("Module nur auf einer Seite vorhanden:", missing); sys.exit(2)

changed = [i for i, m in enumerate(content["mods"]) if json.dumps(m, sort_keys=True) != json.dumps(mods[m["id"]], sort_keys=True)]
print(f"{len(changed)} von {len(ids)} Modulen weichen ab:", [ids[i] for i in changed])

# Fachlexikon: daten/fachlexikon.js (Schüler) ist kanonisch, js/kern/06-fachlexikon.js (Lehrer) eine byte-identische Kopie.
lex_src = os.path.join(student, "daten/fachlexikon.js")
lex_dst = os.path.join(teacher, "js/kern/06-fachlexikon.js")
lex_diff = open(lex_src, "rb").read() != open(lex_dst, "rb").read()
print("Fachlexikon weicht ab:", lex_diff)
if check:
    sys.exit(1 if (changed or lex_diff) else 0)
if lex_diff:
    open(lex_dst, "wb").write(open(lex_src, "rb").read())
for i in changed:
    content["mods"][i] = mods[ids[i]]
chars_after = hashlib.sha256(json.dumps(content.get("chars"), sort_keys=True, ensure_ascii=False).encode()).hexdigest()
assert chars_before == chars_after, "Avatare (chars) dürfen sich nicht ändern"
open(cpath, "w", encoding="utf-8").write(json.dumps(content, ensure_ascii=False, separators=(",", ":")))
print("content.json aktualisiert; chars unverändert.")
