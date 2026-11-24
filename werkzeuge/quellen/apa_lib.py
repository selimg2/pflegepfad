import re
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
        elif auto and core and core[:1].isupper() and not re.search(r"[A-Z]{2,}|\d",core) and core not in EIGEN:
            x=x.replace(core,"-".join(p[:1].lower()+p[1:] if p not in EIGEN else p for p in core.split("-")),1)
        out.append(x);nach=x.endswith(":") or x.endswith("?") or x.endswith(".")and len(core)>3
    s=" ".join(out).strip()
    if not s.endswith((".","?","!")): s+="."
    return s,auto
