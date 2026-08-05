// HYPOTHETICAL: Georgetown with both Luka Scuka and Vince Iwuchukwu added.
// Grades on the opponent-adjusted scale used league-wide:
//   Iwuchukwu 75 — 11.6/6.1 + ~2.0 bpg in the BIG EAST (Tier A, no comp discount).
//     Comps: Erhunmwunse 76 (BE 6.9/8.3, 67% FG), Nwoko 80 (SEC 13.4 on 61%).
//     Docked for availability (24 games, medical procedure) and cardiac history.
//   Scuka 64 — German BBL 9-10 ppg on 44.5/33.6, low rebounding for a 4 (INTL Tier B-ish).
const { ratings, volatility } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627, GEORGETOWN_2526 } = require('./rosters');

const M = 70;
const mk = (n, p, o) => ({ name: n, pos: p, overall: o, morale: M });
const SCUKA = mk('Luka Scuka', 'PF', 64);
const VINCE = mk('Vince Iwuchukwu', 'C', 75);
const base = GEORGETOWN_2627.roster;

const SCEN = {
  'Actual roster (11)':   base,
  '+Scuka':               [...base, SCUKA],
  '+Iwuchukwu':           [...base, VINCE],
  '+BOTH':                [...base, SCUKA, VINCE],
};

function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

function run(roster, N=20000){
  const gu = { name:'Georgetown 2026-27', roster };
  const teams = BIG_EAST.map(t => t.name==='Georgetown 2026-27' ? gu : t);
  const R=new Map(), V=new Map();
  teams.forEach(t=>{R.set(t.name,ratings(t));V.set(t.name,volatility(t));});
  const names=teams.map(t=>t.name), tot=Object.fromEntries(names.map(n=>[n,0]));
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
  return {rank:i+1, wins:rows[i].avg, above:rows[i-1]?.n||'—', r:R.get('Georgetown 2026-27')};
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

console.log('GEORGETOWN FRONTCOURT SCENARIOS — vs the AUGUST-refreshed Big East\n');
console.log('  Scenario            AdjEM  NatRk  BE  Conf W-L   Ahead of        vs25-26  vsButler  vsSHU  vsProv');
console.log('  '+'-'.repeat(104));
for(const [label,roster] of Object.entries(SCEN)){
  const s=run(roster);
  console.log('  '+label.padEnd(19)+
    ((s.r.adjEM>=0?'+':'')+s.r.adjEM.toFixed(1)).padStart(5)+
    ('#'+s.r.natRank).padStart(7)+
    ('#'+s.rank).padStart(4)+'  '+
    (s.wins.toFixed(1)+'-'+(20-s.wins).toFixed(1)).padEnd(10)+
    s.above.padEnd(16)+
    h2h(roster,GEORGETOWN_2526).toFixed(1).padStart(6)+'%'+
    h2h(roster,BUT).toFixed(1).padStart(9)+'%'+
    h2h(roster,SHU).toFixed(1).padStart(7)+'%'+
    h2h(roster,PROV).toFixed(1).padStart(7)+'%');
}
console.log('\n  Rotation with BOTH (top 10 by grade):');
[...base, SCUKA, VINCE].sort((a,b)=>b.overall-a.overall).slice(0,10)
  .forEach((p,i)=>console.log(`   ${String(i+1).padStart(2)}. ${p.name.padEnd(20)} ${p.pos.padEnd(3)} ${p.overall}`));
