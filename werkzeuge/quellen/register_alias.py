import json,re,sys,unicodedata
F=sys.argv[1];r=json.load(open(F,encoding='utf-8'));Q=r['quellen']
STOP=set("der die das und in von mit für zur zum im the of and for in on a an to bei des den dem pflege et al hrsg aktualisierung expertenstandard leitlinie s3 s2k s1".split())
ORG={"dnqp":"deutsches netzwerk für qualitätsentwicklung in der pflege","krinko":"kommission für krankenhaushygiene","who":"world health organization","rki":"robert koch-institut","nice":"national institute for health and care excellence","dgsm":"deutsche gesellschaft für schlafforschung","awmf":"arbeitsgemeinschaft der wissenschaftlichen"}
def norm(s): return unicodedata.normalize("NFC",(s or "").lower())
def kopf(a):
    a=norm(a);m=re.match(r"\s*([^,(.:]+)",a);h=m.group(1).strip() if m else ""
    for k,v in ORG.items():
        if h.startswith(k) or v in a[:120]: return k
    return h.split()[0] if h else ""
def jahr(a):
    m=re.search(r"\((\d{4})",a) or re.search(r"\b(19|20)\d{2}\b",a); return m.group(0).strip("(") if m else None
def worte(a):
    a=re.sub(r"^[^)]*\)\.?,?","",norm(a))
    return {w for w in re.findall(r"[a-zäöüß0-9\-]{4,}",a) if w not in STOP}
gut={"apa7_geprueft":3,"inhalt_verifiziert":4,"rechtsquelle":2,"apa7_formal":1,"formal_ungeprueft":0}
n=0
for k,q in Q.items():
    if q.get('status')!="formal_ungeprueft": continue
    a=q['apa'];kk,jj,ww=kopf(a),jahr(a),worte(a)
    if not ww: continue
    best=None
    for k2,q2 in Q.items():
        if k2==k or q2.get('status')=="formal_ungeprueft" or q2.get('alias_von'): continue
        a2=q2.get('apa') or q2.get('apa7') or ""
        if kopf(a2)!=kk or jahr(a2)!=jj: continue
        ov=len(ww&worte(a2))/len(ww)
        if ov>=0.6:
            sc=(gut.get(q2.get('status'),0),ov,len(a2))
            if not best or sc>best[0]: best=(sc,k2)
    if best:
        q['alias_von']=best[1];q['status']="alias";q['maengel']=["Kurzform im Modul – maßgeblich ist die vollständige Angabe "+best[1]];n+=1
json.dump(r,open(F,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(n,"Kurzformen auf vollständige Angaben zurückgeführt")
