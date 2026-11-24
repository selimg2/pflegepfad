import json,sys,re
sys.path.insert(0,'os.path.dirname(os.path.abspath(__file__))');import apa_lib as L
REG,PM,MAP=sys.argv[1:4]
r=json.load(open(REG,encoding='utf-8'));pm=json.load(open(PM,encoding='utf-8'));mp=json.load(open(MAP,encoding='utf-8'))
TOVR=json.load(open(sys.argv[4],encoding='utf-8')) if len(sys.argv)>4 else {}
KR="Kommission für Krankenhaushygiene und Infektionsprävention (KRINKO) beim Robert Koch-Institut."
n=0
for k,(pid,zs,jahr) in mp.items():
    q=r['quellen'].get(k);a=pm.get(pid)
    if not q or not a: print("fehlt",k);continue
    korp=not a['authors'] or a['authors'][0][1]=="" and "Kommission" in a['authors'][0][0]
    if not korp:
        first=a['authors'][0][0].split()[-1].lower();reg_first=re.match(r"\s*([^,]+)",q['apa']).group(1).lower()
        if first not in reg_first and reg_first.split()[-1] not in a['authors'][0][0].lower():
            print("Autor passt nicht:",k,a['authors'][0][0],"≠",reg_first);continue
    if korp or a['title'].startswith("["):
        m=re.search(r"\(\d{4}\)\.?\s*(.+?)\.\s+Bundesgesundheitsblatt",q['apa']);t=(m.group(1)+".") if m else a['title']
    else: t=TOVR.get(pid) or L.satz(a['title'])[0]
    au=KR if korp else L.autoren(a['authors']).rstrip(".")+"."
    pages=a['pages'];artikel=bool(pages and "-" not in pages and not pages.startswith(("S","e"))) or not pages
    seiten=("Article "+(pages or "")) if artikel else L.seiten(pages)
    heft=a['issue'] or "";heft=re.sub(r"\s*Suppl\s*(\d)",r", Suppl. \1",heft).replace(" Suppl, ",", Suppl. ")
    T={"autoren":au,"jahr":jahr or a['year'],"titel":t,"zeitschrift":zs,"band":str(a['volume']),"heft":heft,"seiten":seiten,"doi":a['doi'] or ""}
    hf=f"({T['heft']})" if T['heft'] else ""
    q.update({"apa7":f"{T['autoren']} ({T['jahr']}). {T['titel']} {T['zeitschrift']}, {T['band']}{hf}, {T['seiten']}."+(" https://doi.org/"+T['doi'] if T['doi'] else ""),
      "apa7_teile":T,"doi":T['doi'] or None,"pmid":pid,"status":"apa7_geprueft",
      "pruefung":f"Formal mit PubMed-Datensatz abgeglichen (PMID {pid}, Abruf 24.11.2026). Inhaltliche Belegstelle nicht geprüft.",
      "maengel":[x for x in [("Jahr im Modul abweichend angegeben ("+re.search(r'\((\d{4})',q['apa']).group(1)+"); maßgeblich ist das Erscheinungsjahr des Hefts") if re.search(r'\((\d{4})',q['apa']) and re.search(r'\((\d{4})',q['apa']).group(1)!=str(T['jahr']) else None] if x]})
    n+=1;print(k,"|",q['apa7'][:60],"…",T['titel'][:140])
json.dump(r,open(REG,'w',encoding='utf-8'),ensure_ascii=False,indent=1);print(n,"aktualisiert")
