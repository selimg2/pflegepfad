#!/usr/bin/env python3
"""Zerlegt eine monolithische Fallpfad-index.html in Module (CSS, JS, Daten).

Aufruf:  python3 -I werkzeuge/aufteilen.py <quelle/index.html> <zielordner> <schueler|lehrer>

Die Reihenfolge aller Skripte und Stylesheets bleibt exakt erhalten, damit sich die App
identisch verhaelt. Inline-Code gibt es danach nicht mehr; das erlaubt eine strenge
Content-Security-Policy ohne 'unsafe-inline' fuer Skripte.
"""
import json, os, re, subprocess, sys, tempfile, unicodedata

src, out, kind = sys.argv[1], sys.argv[2], sys.argv[3]
html = open(src, encoding="utf-8").read()

TAG = re.compile(r"<(script|style)\b([^>]*)>(.*?)</\1>", re.S)
used = set()


def slug(t, n=46):
    t = t.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("Ä", "Ae").replace("Ö", "Oe").replace("Ü", "Ue").replace("ß", "ss")
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    t = re.sub(r"^(fallpfad|schueler-app|lehrer-portal)-", "", t)
    return (t[:n].rstrip("-")) or "teil"


def write(rel, text):
    base, ext = os.path.splitext(rel)
    k, i = rel, 2
    while k in used:
        k = f"{base}-{i}{ext}"; i += 1
    used.add(k)
    p = os.path.join(out, k)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text if text.endswith("\n") else text + "\n")
    return k


def js_ok(code):
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(code); p = f.name
    r = subprocess.run(["node", "--check", p], capture_output=True)
    os.unlink(p)
    return r.returncode == 0


def split_js(code):
    """Teilt an Kommentar-Koepfen in Spalte 0, aber nur dort, wo beide Seiten fuer sich gueltiges JS sind."""
    lines = code.split("\n")
    cuts = [i for i, l in enumerate(lines) if l.startswith("/* ") and i > 0]
    if not cuts or max(len(l) for l in lines) > 200000 and len(lines) < 400:
        return [code]
    parts, start = [], 0
    for c in cuts + [len(lines)]:
        parts.append("\n".join(lines[start:c])); start = c
    merged = []
    for p in parts:
        if not p.strip():
            continue
        if merged and not js_ok(merged[-1]):
            merged[-1] += "\n" + p
        else:
            merged.append(p)
    while len(merged) > 1 and not js_ok(merged[-1]):
        last = merged.pop(); merged[-1] += "\n" + last
    # zu kleine Schnipsel an den Vorgaenger haengen
    res = []
    for p in merged:
        if res and len(p) < 1500:
            res[-1] += "\n" + p
        else:
            res.append(p)
    assert all(js_ok(p) for p in res), "Teilstueck ist kein gueltiges JS"
    return res


def title_of(code, fallback):
    m = re.search(r"/\*+\s*=*\s*(.+?)(?:\*/|\n|$)", code[:400])
    t = m.group(1) if m else fallback
    t = re.split(r"\. | =====|\*/", t)[0]
    teile = [x for x in (slug(c, 34) for c in re.split(r"[:(,]", t)) if x and x not in ("teil", "fallpfad", "schueler-app", "lehrer-portal")]
    if not teile:
        return fallback
    name = teile[0]
    if len(teile) > 1 and (re.fullmatch(r"fall-\d+", name) or name in ("live", "meine-sprache", "training-kommunikation", "training", "stationsalltag", "training-stationsalltag")):
        name += "-" + teile[1]
    return name[:44].rstrip("-")


def folder_for(attrs, code, idx, im_kopf=False):
    """Ordner je Block; idx = laufende Nummer des Inline-Skripts."""
    if kind == "schueler":
        if 'id="fp-' in attrs: return "js/funktionen"
        if "__FP_BOOT=function" in code[:60]: return "js/app"
        if "Training-Hub" in code[:80]: return "js/training"
        return "js/kern"
    if code.lstrip().startswith("(() => {"): return "js/app"
    if im_kopf: return "js/kern"
    return "js/erweiterungen"


out_tags, pos, n_script, n_style, counter = [], 0, 0, 0, {}
res = []
for m in TAG.finditer(html):
    res.append(html[pos:m.start()]); pos = m.end()
    tag, attrs, body = m.group(1), m.group(2), m.group(3)
    idm = re.search(r'id="([^"]+)"', attrs)
    if tag == "script" and "src=" in attrs:
        res.append(m.group(0)); continue
    if tag == "script" and "application/json" in attrs:
        d = json.loads(body)
        tags = []
        base = {k: v for k, v in d.items() if k not in ("mods", "figs", "chars")}
        base["mods"] = []
        tags.append(write("daten/basis.js", "/* Fallpfad Inhalte: Grundgeruest. Die Module haengen sich in daten/module/*.js selbst an. */\nwindow.FP_DATA = " + json.dumps(base, ensure_ascii=False, separators=(",", ":")) + ";"))
        for k, name in (("figs", "abbildungen"), ("chars", "figuren")):
            if k in d:
                tags.append(write(f"daten/{name}.js", f"/* Fallpfad Inhalte: {name} */\nwindow.FP_DATA.{k} = " + json.dumps(d[k], ensure_ascii=False, separators=(",", ":")) + ";"))
        for mod in d["mods"]:
            head = f"/* Fallpfad Lernmodul {mod['id']}: {mod.get('title','')} (Ausbildungsjahr {mod.get('year','?')}) */\n"
            tags.append(write(f"daten/module/jahr-{mod.get('year','x')}/{mod['id']}.js", head + "window.FP_DATA.mods.push(" + json.dumps(mod, ensure_ascii=False, separators=(",", ":")) + ");"))
        tags.append(write("daten/bereit.js", '/* Stellt die Inhalte so bereit, wie die App sie erwartet (Element #data mit JSON). */\n(function () {\n  var el = document.createElement("script");\n  el.type = "application/json";\n  el.id = "data";\n  el.textContent = JSON.stringify(window.FP_DATA);\n  document.body.appendChild(el);\n})();'))
        res.append("\n".join(f'<script src="{t}"></script>' for t in tags)); continue
    if tag == "style":
        n_style += 1
        name = idm.group(1) if idm else ("basis" if n_style == 1 else f"stil-{n_style}")
        name = {"fx-apple-css": "apple", "fp-pro-css": "pro", "fp-training-css": "training", "fx-css": "erweiterungen", "fp-v5": "v5"}.get(name, name)
        rel = write(f"css/{n_style:02d}-{name}.css", body.strip("\n"))
        res.append(f'<link rel="stylesheet" href="{rel}"' + (f' id="{idm.group(1)}"' if idm else "") + ">"); continue
    # Inline-Skript
    n_script += 1
    folder = folder_for(attrs, body, n_script, m.start() < html.index("<body"))
    parts = split_js(body.strip("\n"))
    tags = []
    for p in parts:
        counter[folder] = counter.get(folder, 0) + 1
        if idm and len(parts) == 1: nm = idm.group(1).replace("fp-", "")
        elif folder == "js/app": nm = "app.bundle" if kind == "schueler" else "portal.bundle"
        elif "FALLPFAD_CONFIG_ERROR=String" in p[:200]: nm = "config-fehler"
        elif "serviceWorker" in p[:60]: nm = "service-worker-anmeldung"
        elif "Modul-Loader" in p[:60]: nm = "modul-loader"
        elif p.lstrip().startswith("window.FP_APP_KIND") and len(p) < 400: nm = "app-art"
        else: nm = title_of(p, "teil")
        rel = write(f"{folder}/{counter[folder]:02d}-{nm}.js", p)
        tags.append(f'<script src="{rel}"' + (f' id="{idm.group(1)}"' if idm and len(parts) == 1 else "") + "></script>")
    res.append("\n".join(tags))
res.append(html[pos:])
index = "".join(res)
index = re.sub(r"\n{3,}", "\n\n", index)
with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
    f.write(index)
print(f"{kind}: {len(used)} Dateien, index.html {len(index)} Zeichen")
