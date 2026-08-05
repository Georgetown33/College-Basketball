// All 8 combinations of three frontcourt adds for Georgetown.
//
// FEASIBILITY (very different for each):
//  * Duke Brennan  — LIVE TARGET. 12.4 ppg / 10.3 rpg, started all 32, 14 double-
//    doubles (tied Villanova program record). Graduated; 5th-year waiver pending.
//    Georgetown is among the schools that have contacted him (also UNC, USC,
//    Oregon, Ole Miss, Oklahoma, UConn). NOT on Villanova's 26-27 roster, so
//    adding him costs Villanova nothing in this model.
//  * Vince Iwuchukwu — waiver DENIED TWICE; needs a court injunction.
//  * Luka Scuka — not a commit and not eligible (under contract in Germany).
//
// GRADES (opponent-adjusted, Tier A = Big East, no competition discount):
//  Brennan 77   — 12.4/10.3 double-double machine. Comps: Milicevic 78 (12.4/3.9
//                 but a shooter), Erhunmwunse 76 (6.9/8.3, elite TS), Nwoko 80.
//  Iwuchukwu 75 — 11.6/6.1 + ~2.0 bpg, docked for 24-game availability.
//  Scuka 64     — German BBL, 44.5/33.6, low rebounding for a 4.
const { ratings, volatility } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627, GEORGETOWN_2526 } = require('./rosters');

const M=70, mk=(n,p,o)=>({name:n,pos:p,overall:o,morale:M});
const ADD = {
  Brennan:   mk('Duke Brennan','PF',77),
  Iwuchukwu: mk('Vince Iwuchukwu','C',75),
  Scuka:     mk('Luka Scuka','PF',64),
};
const base = GEORGETOWN_2627.roster;
const KEYS = ['Brennan','Iwuchukwu','Scuka'];

function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

function evaluate(roster,N=20000){
  const gu={name:'Georgetown 2026-27',roster};
  const teams=BIG_EAST.map(t=>t.name==='Georgetown 2026-27'?gu:t);
  const R=new Map(),V=new Map();
  teams.forEach(t=>{R.set(t.name,ratings(t));V.set(t.name,volatility(t));});
  const names=teams.map(t=>t.name),tot=Object.fromEntries(names.map(n=>[n,0]));
  const sg=(a,b)=>{const ra=R.get(a.name),rb=R.get(b.name);
    const poss=ra.tempo*rb.tempo/67.5;
    const em=(ra.adjO*rb.adjD/104-rb.adjO*ra.adjD/104)*poss/100+3.5;
    return em+gauss()*Math.sqrt(V.get(a.name)**2+V.get(b.name)**2)>0;};
  for(let s=0;s<N;s++){const w=Object.fromEntries(names.map(n=>[n,0]));
    for(let i=0;i<teams.length;i++)for(let j=i+1;j<teams.length;j++){
      if(sg(teams[i],teams[j]))w[teams[i].name]++;else w[teams[j].name]++;
      if(sg(teams[j],teams[i]))w[teams[j].name]++;else w[teams[i].name]++;}
    for(const n of names)tot[n]+=w[n];}
  const rows=names.map(n=>({n,avg:tot[n]/N})).sort((a,b)=>b.avg-a.avg);
  const i=rows.findIndex(r=>r.n==='Georgetown 2026-27');
  return {rank:i+1,wins:rows[i].avg,r:R.get('Georgetown 2026-27'),
          passes:rows.slice(i+1).map(r=>r.n.replace(' 2026-27','')).slice(0,3)};
}
function h2h(roster,opp){
  const gu={name:'Georgetown 2026-27',roster};
  const rg=ratings(gu),ro=ratings(opp),poss=rg.tempo*ro.tempo/67.5;
  const em=(rg.adjO*ro.adjD/104-ro.adjO*rg.adjD/104)*poss/100;
  const sd=Math.sqrt(volatility(gu)**2+volatility(opp)**2);
  const z=em/sd,t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2);
  let pr=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
  return (z>0?1-pr:pr)*100;
}
const PROV=BIG_EAST.find(t=>t.name==='Providence');
const BUT=BIG_EAST.find(t=>t.name==='Butler');
const SHU=BIG_EAST.find(t=>t.name==='Seton Hall');

console.log('GEORGETOWN — ALL 8 COMBINATIONS OF THREE FRONTCOURT ADDS\n');
console.log('  Combination                 AdjEM   NatRk  BE   Conf W-L    vs25-26  vsBUT  vsSHU  vsPROV');
console.log('  '+'-'.repeat(94));
const results=[];
for(let m=0;m<8;m++){
  const picked=KEYS.filter((_,i)=>m&(1<<i));
  const roster=[...base,...picked.map(k=>ADD[k])];
  const e=evaluate(roster);
  const label=picked.length?picked.join(' + '):'(none — actual roster)';
  results.push({label,picked,e,roster});
  console.log('  '+label.padEnd(27)+
    ((e.r.adjEM>=0?'+':'')+e.r.adjEM.toFixed(1)).padStart(6)+
    ('#'+e.r.natRank).padStart(7)+('#'+e.rank).padStart(5)+'  '+
    (e.wins.toFixed(1)+'-'+(20-e.wins).toFixed(1)).padEnd(11)+
    h2h(roster,GEORGETOWN_2526).toFixed(1).padStart(6)+'%'+
    h2h(roster,BUT).toFixed(1).padStart(7)+'%'+
    h2h(roster,SHU).toFixed(1).padStart(6)+'%'+
    h2h(roster,PROV).toFixed(1).padStart(7)+'%');
}
console.log('\n  MARGINAL VALUE of each player (AdjEM added, averaged over all contexts):');
for(const k of KEYS){
  const withK=results.filter(r=>r.picked.includes(k));
  const deltas=withK.map(r=>{
    const without=results.find(x=>x.picked.length===r.picked.length-1 &&
      r.picked.filter(p=>p!==k).every(p=>x.picked.includes(p)) &&
      x.picked.every(p=>r.picked.includes(p)));
    return without? r.e.r.adjEM-without.e.r.adjEM : null;
  }).filter(x=>x!==null);
  const avg=deltas.reduce((a,b)=>a+b,0)/deltas.length;
  console.log(`    ${k.padEnd(11)} +${avg.toFixed(2)} AdjEM  (+${(deltas.reduce((a,b)=>a+b,0)/deltas.length*0.55).toFixed(1)} conf wins approx)`);
}
const best=results[7];
console.log('\n  Rotation with ALL THREE (top 10):');
[...base,...KEYS.map(k=>ADD[k])].sort((a,b)=>b.overall-a.overall).slice(0,10)
  .forEach((p,i)=>console.log(`   ${String(i+1).padStart(2)}. ${p.name.padEnd(20)} ${p.pos.padEnd(3)} ${p.overall}`));
