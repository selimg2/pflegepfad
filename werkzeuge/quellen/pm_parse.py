import json,sys,glob
out={}
for f in glob.glob(sys.argv[1]+'/*'):
    t=open(f,encoding='utf-8').read()
    try:
        j=json.loads(t)
        if isinstance(j,list): j=json.loads(j[0]['text'])
    except Exception as e:
        print('FEHLER',f,e); continue
    for a in j['articles']:
        c=a.get('citation',{})
        out[a['identifiers']['pmid']]={"doi":a['identifiers'].get('doi') or a.get('doi'),"title":a['title'],
          "journal":a['journal']['title'],"iso":a['journal'].get('iso_abbreviation'),
          "authors":[[x.get('last_name') or x.get('collective_name') or x.get('name',''),x.get('initials',''),x.get('fore_name','')] for x in a.get('authors',[])],
          "year":a.get('publication_date',{}).get('year'),"volume":c.get('volume'),"issue":c.get('issue'),"pages":c.get('pages'),
          "types":a.get('article_types',[]),"lang":a.get('language')}
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=0)
print(len(out),'Artikel')
