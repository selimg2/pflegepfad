import json,sys,re
sys.path.insert(0,'os.path.dirname(os.path.abspath(__file__))');import apa_lib as L
REG=sys.argv[1];reg=json.load(open(REG,encoding='utf-8'))
pm=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../.pflegepfad-review/pubmed-cache/pubmed3.json'),encoding='utf-8'))
w=json.load(open(sys.argv[2],encoding='utf-8'))
Q=reg['quellen'];ABRUF="24.11.2026"
def art(pmid,zs,artikel=False,titel=None,autor_fix=None):
    a=pm[pmid];au=a['authors']
    if autor_fix: au=autor_fix
    t=titel or L.satz(a['title'])[0]
    T={"autoren":L.autoren(au).rstrip(".")+".","jahr":a['year'],"titel":t,"zeitschrift":zs,"band":str(a['volume']),"heft":a['issue'] or "",
       "seiten":("Article "+a['pages']) if artikel else L.seiten(a['pages']),"doi":a['doi'] or ""}
    heft=f"({T['heft']})" if T['heft'] else ""
    return {"apa":"","apa7":f"{T['autoren']} ({T['jahr']}). {T['titel']} {T['zeitschrift']}, {T['band']}{heft}, {T['seiten']}."+(" https://doi.org/"+T['doi'] if T['doi'] else ""),
            "apa7_teile":T,"doi":T['doi'] or None,"url":None,"pmid":pmid,"status":"apa7_geprueft",
            "pruefung":f"Formal mit PubMed-Datensatz abgeglichen (PMID {pmid}, Abruf {ABRUF}). Inhaltliche Belegstelle nicht geprüft.","maengel":[]}
def frei(apa7,hinweis,url=None,doi=None,status="apa7_formal"):
    return {"apa":apa7,"apa7":apa7,"doi":doi,"url":url,"status":status,"maengel":[hinweis] if hinweis else []}
B="Buch: bibliografische Angaben (Untertitel, Auflage, Verlag) am Impressum prüfen"
NEU={
 "W-balban2023":art("36630953","Cell Reports Medicine",True),
 "W-zaccaro2018":art("30245619","Frontiers in Human Neuroscience",True),
 "W-liebert1967":art("6042522","Psychological Reports"),
 "W-eysenck2007":art("17516812","Emotion"),
 "W-ramirez2011":art("21233387","Science"),
 "W-jamieson2010":art("20161454","Journal of Experimental Social Psychology"),
 "W-brooks2014":art("24364682","Journal of Experimental Psychology: General"),
 "W-kross2014":art("24467424","Journal of Personality and Social Psychology"),
 "W-manzoni2008":art("18518981","BMC Psychiatry",True),
 "W-sonnentag2007":art("17638488","Journal of Occupational Health Psychology"),
 "W-embse2018":art("29156362","Journal of Affective Disorders"),
 "W-roediger2006":art("16507066","Psychological Science"),
 "W-smith2016":art("27885031","Science"),
 "W-cepeda2006":art("16719566","Psychological Bulletin"),
 "W-ranehill2015":art("25810452","Psychological Science"),
 "W-singh2023":art("36796860","British Journal of Sports Medicine"),
 "W-beck2021":frei("Beck, J. S. (2021). Cognitive behavior therapy: Basics and beyond (3rd ed.). Guilford Press.",B),
 "W-pennebaker2016":frei("Pennebaker, J. W., & Smyth, J. M. (2016). Opening up by writing it down: How expressive writing improves health and eases emotional pain (3rd ed.). Guilford Press.",B),
 "W-jacobson1938":frei("Jacobson, E. (1938). Progressive relaxation. University of Chicago Press.",B+"; die Ausgabe von 1938 ist die 2. Auflage"),
 "W-oettingen2014":frei("Oettingen, G. (2014). Rethinking positive thinking: Inside the new science of motivation. Current.",B),
 "W-gollwitzer2006":frei("Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69–119.","Nicht in PubMed – DOI beim Verlag (Elsevier) ergänzen"),
 "W-neff2003":frei("Neff, K. D. (2003). Self-compassion: An alternative conceptualization of a healthy attitude toward oneself. Self and Identity, 2(2), 85–101.","Nicht in PubMed – DOI beim Verlag (Taylor & Francis) ergänzen"),
 "W-bbk2012":frei("Bundesamt für Bevölkerungsschutz und Katastrophenhilfe. (2012). Psychosoziale Notfallversorgung: Qualitätsstandards und Leitlinien (Teil I und II).","Reihe/Band und Bezugs-URL beim BBK ergänzen"),
}
# Prüfprotokoll -> Registerquellen
P={p['source_id']:p for p in reg['pruefprotokoll']}
def proto(pid,apa7,doi=None,url=None,pmid=None,teile=None,hinweis=None):
    p=P[pid];e={"apa":apa7,"apa7":apa7,"doi":doi,"url":url or (None if doi else p.get('url')),"status":"inhalt_verifiziert","pruefprotokoll":pid,
      "belegstelle":p.get('belegstelle'),"pruefung":"Aussagen an der Belegstelle gelesen (Prüfprotokoll "+pid+", Abruf "+str(p.get('abruf','2026-11-24'))+"). Fachliche Freigabe: "+str(p.get('freigabe')),"maengel":[hinweis] if hinweis else []}
    if pmid: e["pmid"]=pmid
    if teile: e["apa7_teile"]=teile
    return e
ERC_AU=[["Smyth","MA",""],["van Goor","S",""],["Hansen","CM",""],["Fijačko","N",""],["Nakagawa","NK",""],["Raffay","V",""],["Ristagno","G",""],["Rogers","J",""],["Scquizzato","T",""],["Smith","CM",""],["Spartinou","A",""],["Keck","W",""],["Perkins","GD",""],["ERC Adult Basic Life Support Collaborators","",""]]
erc_t={"autoren":L.autoren(ERC_AU)+".","jahr":"2025","titel":"European Resuscitation Council Guidelines 2025: Adult basic life support.","zeitschrift":"Resuscitation","band":"215","heft":"Suppl. 1","seiten":"Article 110771","doi":"10.1016/j.resuscitation.2025.110771"}
NEU.update({
 "P-ERC2025-BLS":proto("ERC2025-BLS",f"{erc_t['autoren']} (2025). {erc_t['titel']} Resuscitation, 215(Suppl. 1), Article 110771. https://doi.org/10.1016/j.resuscitation.2025.110771",doi=erc_t['doi'],pmid="41117574",teile=erc_t,hinweis="PubMed führt den Koautor als „Wolfgang, K.“; korrekt ist Keck, W."),
 "P-GRC2025-KOMPAKT":proto("GRC2025-KOMPAKT","Deutscher Rat für Wiederbelebung – German Resuscitation Council. (2025). Reanimation 2025 – Leitlinien kompakt: Deutsche Kurzfassung der ERC-Leitlinien 2025 (1. Aufl.). https://www.grc-org.de/files/Contentpages/document/LeitlinienKompakt2025_22.10.2025.pdf",hinweis="ISBN 978-3-00-084579-6"),
 "P-AWMF-020-021":proto("AWMF-020-021","Deutsche Gesellschaft für Pneumologie und Beatmungsmedizin. (2021). S3-Leitlinie Sauerstoff in der Akuttherapie beim Erwachsenen (AWMF-Registernummer 020-021, Version 1.0). https://register.awmf.org/de/leitlinien/detail/020-021",hinweis="Im AWMF-Register seit 30.06.2024 als abgelaufen gekennzeichnet; Zeitschriftenfassung: Gottlieb et al. (2022), Pneumologie, 76(3), 159–216"),
 "P-AWMF-027-074":proto("AWMF-027-074","Deutsche Gesellschaft für Kinder- und Jugendmedizin. (2025). S3-Leitlinie Fiebermanagement bei Kindern und Jugendlichen (AWMF-Registernummer 027-074, Version 1.0). https://register.awmf.org/de/leitlinien/detail/027-074",hinweis="Federführende Fachgesellschaft und Mitherausgebende am Titelblatt der Leitlinie gegenprüfen"),
 "P-AWMF-022-005":proto("AWMF-022-005","Gesellschaft für Neuropädiatrie. (2021). S1-Leitlinie Fieberkrämpfe im Kindesalter (AWMF-Registernummer 022-005). https://register.awmf.org/de/leitlinien/detail/022-005",hinweis="Im AWMF-Register als abgelaufen bzw. in Überarbeitung gekennzeichnet"),
 "P-COCHRANE-CROUP-GC":proto("COCHRANE-CROUP-GC","Aregbesola, A., Tam, C. M., Kothari, A., Le, M.-L., Ragheb, M., & Klassen, T. P. (2023). Glucocorticoids for croup in children. Cochrane Database of Systematic Reviews, 2023(1), Article CD001955. https://doi.org/10.1002/14651858.CD001955.pub5",doi="10.1002/14651858.CD001955.pub5",pmid="36626194"),
 "P-COCHRANE-CROUP-AIR":proto("COCHRANE-CROUP-AIR","Moore, M., & Little, P. (2006). Humidified air inhalation for treating croup. Cochrane Database of Systematic Reviews, 2006(3), Article CD002870. https://doi.org/10.1002/14651858.CD002870.pub2",doi="10.1002/14651858.CD002870.pub2",pmid="16855994"),
 "P-NICE-NG9":proto("NICE-NG9","National Institute for Health and Care Excellence. (2021). Bronchiolitis in children: Diagnosis and management (NICE Guideline NG9). https://www.nice.org.uk/guidance/ng9",hinweis="Erstveröffentlichung 2015, letzte Aktualisierung 2021"),
 "P-RKI-EPIBULL-2017-VIRUZID":proto("RKI-EPIBULL-2017-VIRUZID","Schwebke, I., Eggers, M., & Gebel, J. (2017). Händedesinfektionsmittel: Welche Bedeutung und Konsequenzen hat der neue Wirkbereich „begrenzt viruzid PLUS“? Epidemiologisches Bulletin, (18/19), 171. https://edoc.rki.de/bitstream/176904/2634/1/25qGm86kdc9s.pdf",hinweis="Seitenumfang am PDF ergänzen"),
 "P-STIKO-ROTA-2013":proto("STIKO-ROTA-2013","Ständige Impfkommission. (2013). Empfehlung und wissenschaftliche Begründung der Empfehlung zur Rotavirus-Standardimpfung von Säuglingen. Epidemiologisches Bulletin, (35). https://edoc.rki.de/bitstream/176904/340/1/24ypvjsau8UbU.pdf",hinweis="Seitenangaben am PDF ergänzen"),
})
# vorhandene Registerquellen, die im Prüfprotokoll inhaltlich geprüft wurden
for pid,qids in {"SSC2021":["Qafe3fe4e","Q044cb721"],"SEPSIS3":["Qfdfac841","Q2fea47f1"],"FITTER-2016":["Qe9f66c31","Qbddabd08"],"ILAE2015":["Qf8e03ec0"],"AWMF-020-021":["Q147ab1a2"]}.items():
    for q in qids:
        if q in Q:
            Q[q]["status"]="inhalt_verifiziert";Q[q]["pruefprotokoll"]=pid;Q[q]["belegstelle"]=P[pid].get("belegstelle")
            Q[q]["pruefung"]=(Q[q].get("pruefung","")+" Inhaltlich: Belegstelle gelesen (Prüfprotokoll "+pid+").").strip()
for k,v in NEU.items(): Q[k]=v
def finde(text):
    m=re.match(r"\s*([^,(]+)",text);nm=m.group(1).strip();yr=re.search(r"\((\d{4})\)",text)
    for k,q in Q.items():
        a=q.get('apa','') or ''
        if yr and a.startswith(nm) and "("+yr.group(1)+")" in a: return k
    return None
MAP={"Balban":"W-balban2023","Zaccaro":"W-zaccaro2018","Liebert":"W-liebert1967","Eysenck":"W-eysenck2007","Beck, J":"W-beck2021","Ramirez":"W-ramirez2011","Pennebaker":"W-pennebaker2016",
     "Jamieson":"W-jamieson2010","Brooks":"W-brooks2014","Kross":"W-kross2014","Jacobson":"W-jacobson1938","Manzoni":"W-manzoni2008","Gollwitzer":"W-gollwitzer2006","Oettingen":"W-oettingen2014",
     "Sonnentag":"W-sonnentag2007","Neff":"W-neff2003","Bundesamt für Bevölkerungsschutz":"W-bbk2012","Roediger":"W-roediger2006","Smith, A":"W-smith2016","Cepeda":"W-cepeda2006","Ranehill":"W-ranehill2015","Singh":"W-singh2023"}
out=[]
for x in w:
    ids=["P-"+h if "P-"+h in Q else None for h in (x.get('quellen_ids_hint') or [])]
    ids=[i for i in ids if i]
    for h in (x.get('quellen_ids_hint') or []):
        for pid,qids in {"SSC2021":["Qafe3fe4e"],"SEPSIS3":["Qfdfac841"]}.items():
            if h==pid: ids+=qids
    for t in x.get('quellen_text') or []:
        for part in re.split(r";\s(?=[A-Z][a-z]+(?: [a-z]+ [A-Z][a-z]+)?, [A-Z]\.)",t):
            hit=next((v for k,v in MAP.items() if part.startswith(k)),None)
            if not hit and "von der Embse" in part: hit="W-embse2018"
            if not hit: hit=finde(part)
            if hit and hit not in ids: ids.append(hit)
            elif not hit: print("OHNE ZUORDNUNG:",x['ort'],part[:80])
    out.append({"ort":x['ort'],"quellen":ids})
reg['weitere']=out
json.dump(reg,open(REG,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(NEU),"neue Einträge;",sum(len(o['quellen']) for o in out),"Zuordnungen in",len(out),"Stellen")
for o in out: print(" ",o['ort'][:45],o['quellen'])
