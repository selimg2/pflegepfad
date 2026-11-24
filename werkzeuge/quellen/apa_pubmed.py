"""Ergänzt das Quellenregister um APA-7-Angaben aus PubMed-Metadaten (DOI, vollständige Autorenliste, Heft, Seiten)."""
import json,re,sys
REG,PM,PMID,CIT=sys.argv[1:5]
reg=json.load(open(REG,encoding='utf-8'));pm=json.load(open(PM,encoding='utf-8'))
pmid=json.load(open(PMID));cit={c['key']:c for c in json.load(open(CIT,encoding='utf-8'))}
HYPH={("Mann","NK"):"N.-K.",("Dan","GA"):"G.-A."}
def ini(last,i,fore=""):
    if (last,i) in HYPH: return HYPH[(last,i)]
    if fore and "-" in fore:
        return " ".join("-".join(t[0]+"." for t in w.split("-") if t) for w in fore.split())
    return " ".join(c+"." for c in i)
GRUPPE=("Group","Committee","Collaboration","Consortium","Task Force","Investigators")
def autoren(a):
    pers=[x for x in a if x[1]]
    a=[x for x in a if x[1] or not pers or any(g in x[0] for g in GRUPPE)]
    n=[(x[0]+", "+ini(x[0],x[1],x[2] if len(x)>2 else "")) if x[1] else x[0] for x in a]
    if len(n)>20: n=n[:19]+["…",n[-1]]; return ", ".join(n[:19])+", … "+n[-1]
    if len(n)==1: return n[0]
    return ", ".join(n[:-1])+", & "+n[-1]
def seiten(p):
    if not p: return ""
    m=re.match(r"^([A-Za-z]?)(\d+)-([A-Za-z]?)(\d+)$",p)
    if not m: return p.replace("-","–")
    a,b,c,d=m.groups()
    if len(d)<len(b): d=b[:len(b)-len(d)]+d
    return f"{a}{b}–{c or a}{d}"
EIGEN={"German","Germany","Europe","European","Alzheimer","Alzheimer's","Braden","Glasgow","Bristol","Gugging","Apgar","English","Dutch","Swiss","Austrian","American","British","Edinburgh","Sepsis-3","Kellgren","Lawrence","Norton","Waterlow","Parkinson","Parkinson's","Cochrane","Delphi","SOFA","ESC","ESPEN"}
def satz(t):
    w=t.split(" ");caps=sum(1 for x in w if x[:1].isupper())
    auto=caps>max(2,len(w)*0.5)
    out=[];nach=True
    for x in w:
        core=re.sub(r"^[\(\[\"'„]+|[\)\]\.,:;\"'“?!]+$","",x)
        if nach: x=x[:1].upper()+x[1:]
        elif auto and core and core[:1].isupper() and not re.search(r"[A-Z].*[A-Z]|\d",core) and core not in EIGEN:
            x=x.replace(core,core[:1].lower()+core[1:],1)
        out.append(x);nach=x.endswith(":") or x.endswith("?") or x.endswith(".")and len(core)>3
    s=" ".join(out).strip()
    if not s.endswith((".","?","!")): s+="."
    return s,auto
def alt_titel(apa,journal):
    m=re.search(r"\(\d{4}[a-z]?\)\.\s*(.+?)\s*"+re.escape(journal),apa)
    return m.group(1).strip() if m else None
n=0;log=[]
for k,pid in pmid.items():
    q=reg['quellen'].get(k);a=pm.get(pid)
    if not q or not a: continue
    c=cit[k]
    # Plausibilitaet: Band und erste Seite muessen passen
    fp=(a['pages'] or "").split("-")[0]
    artikelnr=not a['pages']
    if (fp and fp.lstrip("e")!=str(c['first_page']).lstrip("e")) or (str(a['volume'])!=str(c['volume']) and k not in ("Q615a5906",)):
        log.append(f"{k}: PubMed {a['volume']}/{a['pages']} ≠ Register {c['volume']}/{c['first_page']} – nicht übernommen");continue
    korp=c['author'] in ("KRINKO","Kommission")
    hinweise=[]
    if a['title'].startswith("[") or korp:
        t=alt_titel(q['apa'],c['journal']) or a['title']; 
        if not t.endswith((".","?","!")): t+="."
        auto=False
        if a['title'].startswith("[") and a['title']!="[Not Available].": hinweise.append("Originaltitel deutschsprachig; englischer PubMed-Titel: "+a['title'])
    else:
        t,auto=satz(a['title'])
        if auto: hinweise.append("Titel aus PubMed automatisch in Satzschreibung gebracht – Eigennamen und Akronyme bitte gegenlesen")
    if korp:
        au="Kommission für Krankenhaushygiene und Infektionsprävention (KRINKO) beim Robert Koch-Institut."
    else:
        au=autoren(a['authors'])
        if not au.endswith("."): au+="."
    zs=c['journal']
    if zs.startswith("Bundesgesundheitsblatt"): zs="Bundesgesundheitsblatt – Gesundheitsforschung – Gesundheitsschutz"
    if zs=="AINS": zs="Anästhesiologie, Intensivmedizin, Notfallmedizin, Schmerztherapie"
    teile={"autoren":au,"jahr":c['year'],"titel":t,"zeitschrift":zs,"band":str(c['volume'] if k=="Q615a5906" else (a['volume'] or c['volume'])),
           "heft":a['issue'] or "","seiten":("Article "+str(c['first_page'])) if artikelnr else seiten(a['pages']),"doi":a['doi'] or ""}
    heft=f"({teile['heft']})" if teile['heft'] else ""
    apa7=f"{au} ({teile['jahr']}). {t} {teile['zeitschrift']}, {teile['band']}{heft}, {teile['seiten']}."
    if teile['doi']: apa7+=" https://doi.org/"+teile['doi']
    q.update({"apa7":apa7,"apa7_teile":teile,"doi":teile['doi'] or None,"pmid":pid,
              "status":"apa7_geprueft","pruefung":"Formal mit PubMed-Datensatz abgeglichen (PMID "+pid+", Abruf 24.11.2026). Inhaltliche Belegstelle nicht geprüft.",
              "maengel":hinweise+([] if teile['doi'] else ["Kein DOI vergeben bzw. in PubMed nicht verzeichnet – Verlags-URL ergänzen, falls vorhanden"])})
    n+=1
reg['apa7_stand']="24.11.2026: "+str(n)+" Zeitschriftenartikel per PubMed formal geprüft"
json.dump(reg,open(REG,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(n,"aktualisiert");print("\n".join(log))
