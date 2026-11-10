// Prüft die Varianten-Engine der Stationsalltag-Simulation: 300 Startwerte je Station, Zeiten, Ereignisse, Konsistenz.
// Aufruf: node werkzeuge/tests/stationsalltag-test.js
global.window={}; global.crypto=require("crypto").webcrypto;
const base=require('path').join(__dirname,'../../js/training/');
require(base+'42-stationsalltag-szenarien.js');require(base+'44-stationsalltag-weitere-stationen.js');require(base+'45-stationsalltag-zufall.js');
const V=window.FP_STATION_VAR, D=window.FP_STATION_DATA;
const tm=s=>{const p=String(s).split(':');return +p[0]*60+ +p[1]};
let problems=0;
for(const b of D.szenarien){
  const stats={dr:{},zuf:{},n:0};
  for(let seed=1;seed<=300;seed++){
    const sc=V.build(b,seed*7919,(sc,pid)=>{const p=sc.patienten[pid];return {name:p.name||pid,kurz:p.kurz||pid,anrede:p.kurz||p.name||pid}});
    stats.n++; sc._var.dramen.forEach(d=>stats.dr[d]=(stats.dr[d]||0)+1); sc._var.zufall.forEach(d=>stats.zuf[d]=(stats.zuf[d]||0)+1);
    const ids=new Set(); for(const t of sc.aufgaben){ if(ids.has(t.id)){console.log('dup task',b.id,t.id);problems++} ids.add(t.id); if(t.pat && !sc.patienten[t.pat]){console.log('bad pat',t.id);problems++}
      if(t.ab && (tm(t.ab)<tm(sc.start)||tm(t.ab)>tm(sc.ende))){console.log('task out',b.id,t.id,t.ab);problems++}
      if(!t.inhalt||!t.inhalt.typ){console.log('no inhalt',t.id);problems++}
      if(t.inhalt.typ==='quiz'&&!t.inhalt.opts.some(o=>o.ok)){console.log('no ok',t.id);problems++}
      if(/\{(name|kurz|anrede|zimmer)\}/.test(JSON.stringify(t))){console.log('placeholder',t.id);problems++}}
    const eids=new Set(); for(const e of sc.ereignisse){ if(eids.has(e.id)){console.log('dup ev',b.id,e.id);problems++} eids.add(e.id); if(e.pat&&!sc.patienten[e.pat]){console.log('bad ev pat',e.id);problems++}
      if(e.um&&(tm(e.um)<tm(sc.start)||tm(e.um)>tm(sc.ende))){console.log('ev out',e.id,e.um);problems++}}
    // conditions referencing flags must be settable
  }
  console.log(b.id, 'dramen', JSON.stringify(stats.dr), 'zufall types', Object.keys(stats.zuf).length);
}
// determinism
const a=JSON.stringify(V.build(D.szenarien[1],42,()=>({name:'x'}))); 
console.log('problems', problems); if (problems) process.exitCode = 1;
for(const b of D.szenarien){ for(let seed=1;seed<60;seed++){
 const sc=V.build(b,seed*104729+3,(sc,pid)=>({name:pid,kurz:pid}));
 const setters=new Set(), tasks=new Set(sc.aufgaben.map(t=>t.id)), evs=new Set(sc.ereignisse.map(e=>e.id));
 const walk=o=>{ if(!o||typeof o!=='object')return; if(Array.isArray(o)){o.forEach(walk);return} if(o.setzt) [].concat(o.setzt).forEach(f=>setters.add(f)); Object.values(o).forEach(walk)}; walk(sc);
 const refs=[]; const walk2=o=>{ if(!o||typeof o!=='object')return; if(Array.isArray(o)){o.forEach(walk2);return}
   for(const k of ['flag','nichtFlag']) if(o[k]&&typeof o[k]!=='object'||Array.isArray(o[k])) [].concat(o[k]).forEach(f=>{ if(typeof f==='string'&&!setters.has(f)) refs.push(k+':'+f)});
   for(const k of ['erledigt','nichtErledigt']) if(typeof o[k]==='string'&&!tasks.has(o[k])) refs.push(k+':'+o[k]);
   if(typeof o.gefeuert==='string'&&!evs.has(o.gefeuert)) refs.push('gefeuert:'+o.gefeuert);
   Object.values(o).forEach(walk2)}; walk2(sc.aufgaben); walk2(sc.ereignisse); walk2(Object.values(sc.patienten));
 if(refs.length) console.log(b.id, seed, [...new Set(refs)].join(' '));
}}
