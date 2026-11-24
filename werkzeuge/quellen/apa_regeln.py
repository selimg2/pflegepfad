"""Formale APA-7-Nachbearbeitung der übrigen Quellen: Rechtsquellen verlinken, AWMF-Leitlinien verlinken,
Verlagsort entfernen, Komma vor &, Gruppenautor-Punkt. Inhalte werden nicht erfunden; was nicht prüfbar ist, bleibt als Hinweis."""
import json,re,sys
F=sys.argv[1];d=json.load(open(F,encoding='utf-8'))
G="https://www.gesetze-im-internet.de/"
LAW=[(r"Bürgerliches Gesetzbuch|\bBGB\b","Bürgerliches Gesetzbuch (BGB)","bgb"),(r"Strafgesetzbuch|\bStGB\b","Strafgesetzbuch (StGB)","stgb"),
 (r"Pflegeberufe-Ausbildungs|PflAPrV","Pflegeberufe-Ausbildungs- und -Prüfungsverordnung (PflAPrV)","pflaprv"),
 (r"Pflegeberufegesetz|Gesetz über die Pflegeberufe|\bPflBG\b","Gesetz über die Pflegeberufe (Pflegeberufegesetz – PflBG)","pflbg"),
 (r"Fünftes Buch|SGB V\b|Sozialgesetzbuch V\b","Sozialgesetzbuch Fünftes Buch (SGB V)","sgb_5"),(r"Sechstes Buch|SGB VI\b","Sozialgesetzbuch Sechstes Buch (SGB VI)","sgb_6"),
 (r"Siebtes Buch|SGB VII\b","Sozialgesetzbuch Siebtes Buch (SGB VII)","sgb_7"),(r"Neuntes Buch|SGB IX\b","Sozialgesetzbuch Neuntes Buch (SGB IX)","sgb_9_2018"),
 (r"Elftes Buch|SGB XI\b|Sozialgesetzbuch XI\b","Sozialgesetzbuch Elftes Buch (SGB XI)","sgb_11"),(r"Infektionsschutzgesetz|\bIfSG\b","Infektionsschutzgesetz (IfSG)","ifsg"),
 (r"Betäubungsmittelgesetz|\bBtMG\b","Betäubungsmittelgesetz (BtMG)","btmg_1981"),(r"Betäubungsmittel-Verschreibungsverordnung|BtMVV","Betäubungsmittel-Verschreibungsverordnung (BtMVV)","btmvv_1998"),
 (r"Hebammengesetz|\bHebG\b","Hebammengesetz (HebG)","hebg_2020"),(r"Kinderschutz \(KKG\)|\bKKG\b","Gesetz zur Kooperation und Information im Kinderschutz (KKG)","kkg"),
 (r"Transfusionsgesetz|\bTFG\b","Transfusionsgesetz (TFG)","tfg"),(r"Arbeitszeitgesetz|\bArbZG\b","Arbeitszeitgesetz (ArbZG)","arbzg"),
 (r"Lastenhandhabungsverordnung|LasthandhabV","Lastenhandhabungsverordnung (LasthandhabV)","lasthandhabv"),(r"Grundgesetz","Grundgesetz für die Bundesrepublik Deutschland (GG)","gg")]
NICHT=r"Expertenstandard|Leitlinie|Bundesärztekammer|DGUV Information|Vereinte Nationen|Rahmenvertrag|Gesetz zur Reform des Vormundschafts"
def recht(a):
    teile=re.split(r";\s*",a.rstrip("."));out=[];zuletzt=None
    for t in teile:
        hit=None
        for pat,name,slug in LAW:
            if re.search(pat,t): hit=(name,slug);break
        if not hit and zuletzt and re.match(r"^§",t.strip()): hit=zuletzt
        if re.search(r"Verordnung \(EU\) 2016/679|DSGVO|Datenschutz-Grundverordnung",t):
            art=re.findall(r"Art\.\s*(\d+)",t)
            out.append({"text":"Verordnung (EU) 2016/679 (Datenschutz-Grundverordnung – DSGVO)"+(", Art. "+", ".join(art) if art else ""),"url":"https://eur-lex.europa.eu/eli/reg/2016/679/oj"});continue
        if not hit: return None
        zuletzt=hit;name,slug=hit
        if slug=="gg":
            art=re.findall(r"Art\.\s*(\d+)",t)
            out.append({"text":name+(", Art. "+", ".join(art) if art else ""),"url":G+"gg/"+("art_"+art[0]+".html" if len(art)==1 else "index.html")});continue
        paras=re.findall(r"(\d+[a-z]?)(?=\s|,|$|\s*Abs)",re.sub(r"^.*?(§§?)","",t) if "§" in t else "")
        rng="–" in t and "§" in t
        url=G+slug+("/__"+paras[0]+".html" if len(paras)==1 and not rng else "/index.html")
        label=name+(", "+t[t.index("§"):].strip() if "§" in t else "")
        label=re.sub(r"\s+in der (jeweils )?gültigen Fassung|,? jeweils in der gültigen Fassung","",label)
        out.append({"text":label,"url":url})
    return out
ORTE="|".join(["New York","San Francisco","St\\. Louis","Edinburgh","London","Boston","Philadelphia","Buckingham","Englewood Cliffs","Oxford","Bern","Stuttgart","München","Berlin","Köln","Hannover","Reinbek","Tübingen","Ebersberg","Genf","Osnabrück","Weinheim","Göttingen","Wiesbaden","Heidelberg","Frankfurt am Main","Hamburg","Basel","Wien","Thousand Oaks","Baltimore","Chicago","Washington","Toronto","Paris","Amsterdam","Mainz","Freiburg","Düsseldorf","Bonn","Leipzig","Dresden","Hogrefe"])
def formal(a):
    b=a
    b=re.sub(r"(\b[A-ZÄÖÜ]\.)\s+&\s+",r"\1, & ",b)                 # Komma vor & (APA 7)
    b=re.sub(r"\(Hrsg\.\)\s+\((\d{4})\)",r"(Hrsg.). (\1)",b)
    b=re.sub(r"^([A-ZÄÖÜ][^.()]*?[a-zäöüß\)])\s+\((\d{4}[a-z]?)\)\.",r"\1. (\2).",b)   # Gruppenautor ohne Punkt
    b=re.sub(r"(\.\s+|\)\.\s+)(?:"+ORTE+r"):\s+([^:]+?)\.$",r"\1\2.",b)  # Verlagsort entfällt (APA 7)
    return b
n={"recht":0,"awmf":0,"formal":0}
for k,q in d['quellen'].items():
    if q.get('status')=='apa7_geprueft': continue
    a=q['apa'];m=[x for x in q.get('maengel',[])]
    if re.search(r"Gesetz|§|PflBG|SGB|IfSG|BtM|StGB|BGB|Grundgesetz|Verordnung \(EU\)|HebG|KKG|ArbZG|PflAPrV",a) and not re.search(NICHT,a):
        L=recht(a)
        if L:
            q.update({"apa7":"; ".join(x["text"] for x in L)+".","links":L,"status":"rechtsquelle",
              "maengel":["Rechtsquelle: APA 7 verweist für Gesetze auf juristische Zitierweise; im Lerntext genügt die Nennung mit §. Links nach amtlichem Schema von gesetze-im-internet.de erzeugt (Stichprobe HebG § 4 aufgerufen); jeweils gültige Fassung."]})
            n["recht"]+=1;continue
    nr=re.search(r"AWMF[^0-9]{0,40}?(\d{3}-\d{3}[A-Za-z]{0,2})",a)
    if nr:
        url="https://register.awmf.org/de/leitlinien/detail/"+nr.group(1)
        q["apa7"]=formal(a).rstrip(".")+". "+url;q["url"]=q.get("url") or url;q["status"]="apa7_formal"
        q["maengel"]=[x for x in m if "DOI noch URL" not in x]+["Leitlinie: Link zum AWMF-Register aus der Registernummer erzeugt – Version, Stand und Gültigkeit dort prüfen"]
        n["awmf"]+=1;continue
    b=formal(a)
    buch=bool(re.search(r"Aufl\.|Verlag|Thieme|Springer|Elsevier|Kohlhammer|Hogrefe|Huber|Urban|Wiley|Press|Doubleday|Norton|Rowohlt|Mosby|Davis|Livingstone|Juventa|Beltz|Guilford|Basic Books|Jossey|Lippincott|Saunders|Facultas|Mabuse|Schlütersche",a))
    if buch: m=[x for x in m if "DOI noch URL" not in x]+["Buch: DOI nur angeben, falls vorhanden; Auflage und Verlag am Impressum prüfen"]
    if b!=a or buch:
        q["apa7"]=b;q["status"]="apa7_formal";q["maengel"]=m;n["formal"]+=1
json.dump(d,open(F,'w',encoding='utf-8'),ensure_ascii=False,indent=1);print(n)
