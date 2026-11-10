/* Modul-Loader: holt veröffentlichte Module aus dem Lehrer-Portal (Tabelle public.modules) und die Kurs-Einstellungen
   (welche Ausbildungsjahre und Module der Kurs sieht), passt die eingebauten Module an und startet dann die App.
   Ohne Verbindung nutzt er die zuletzt geladene Fassung. */
(function(){var C=window.FALLPFAD_CONFIG||{},u=String(C.supabaseUrl||"").trim().replace(/\/(rest|auth|storage)\/v1.*$/i,"").replace(/\/+$/,""),k=String(C.supabaseAnonKey||"").replace(/\s+/g,""),KEY="fallpfad-modules-cache",SKEY="fallpfad-course-settings",started=false;
function get(x){try{return localStorage.getItem(x)}catch(e){return null}}
function put(x,v){try{localStorage.setItem(x,JSON.stringify(v))}catch(e){}}
var kurs=get("fallpfad-course")||"";
function apply(list,set){try{var el=document.getElementById("data"),d=JSON.parse(el.textContent);
if(Array.isArray(list))list.forEach(function(r){var m=r&&r.data;if(!m||!m.id||!Array.isArray(m.chapters))return;if(r.course_ids&&r.course_ids.length&&r.course_ids.indexOf(kurs)<0)return;m.custom=!d.mods.some(function(x){return x.id===m.id});m.teacher=true;
var i=-1;for(var j=0;j<d.mods.length;j++)if(d.mods[j].id===m.id)i=j;if(i>=0)d.mods[i]=m;else d.mods.push(m)});
if(set&&typeof set==="object"&&set.course===kurs&&Array.isArray(set.locked)){window.FP_LOCKED=d.mods.filter(function(m){return set.locked.indexOf(m.id)>=0}).map(function(m){return m.title})}if(set&&typeof set==="object"&&set.course===kurs){var ys=Array.isArray(set.years)?set.years:[],hid=Array.isArray(set.hidden)?set.hidden:[],keep=d.mods.filter(function(m){if(m.custom)return true;if(hid.indexOf(m.id)>=0)return false;if(ys.length&&ys.indexOf(Number(m.year))<0)return false;return true});
if(keep.length){d.mods=keep;d.courseFilter={years:ys,hidden:hid.length}}}
el.textContent=JSON.stringify(d)}catch(e){console.warn("Fallpfad: Lehrer-Module nicht übernommen",e)}}
function start(list,set){if(started)return;started=true;apply(list,set);window.__FP_BOOT()}
var cached=null,cset=null;try{cached=JSON.parse(get(KEY)||"null");cset=JSON.parse(get(SKEY)||"null")}catch(e){}
if(!u||!k||!window.fetch){start(null,null);return}
var t=setTimeout(function(){start(cached,cset)},4000),H={apikey:k,"Content-Type":"application/json"};try{var ref=(u.match(/^https:\/\/([^.]+)\./)||[])[1],tk=ref&&JSON.parse(localStorage.getItem("sb-"+ref+"-auth-token")||"null");if(tk&&tk.access_token&&(!tk.expires_at||tk.expires_at*1000>Date.now()+60000))H.Authorization="Bearer "+tk.access_token}catch(e){}
var pm=fetch(u+"/rest/v1/modules?select=id,data,course_ids,base_id,updated_at&status=eq.published",{headers:H}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(function(l){if(!H.Authorization&&cached&&cached.length&&(!l||!l.length))return cached;put(KEY,l);return l}).catch(function(){return cached});
var ps=kurs?fetch(u+"/rest/v1/rpc/course_settings",{method:"POST",headers:H,body:JSON.stringify({p_id:kurs})}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(function(s){var v={course:kurs,years:(s&&s.years)||[],hidden:(s&&s.hidden)||[],locked:(s&&s.locked)||[]};put(SKEY,v);return v}).catch(function(){return cset}):Promise.resolve(null);
Promise.all([pm,ps]).then(function(a){clearTimeout(t);start(a[0],a[1])})})();
