// Georgetown vs Seton Hall (#9) and DePaul (#8) — confirm the gap.
const { ratings, volatility } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627 } = require('./rosters');
const SHU=BIG_EAST.find(t=>t.name==='Seton Hall');
const DEP=BIG_EAST.find(t=>t.name==='DePaul');
const PRV=BIG_EAST.find(t=>t.name==='Providence');
const GU=GEORGETOWN_2627;

const SRC={
 'Jaland Lowe':'ACC 16.8/5.5 (37.6%)','Vyctorius Miller':'BIG12 10.8 (41.8/37.5)',
 'Josiah Parker':'AAC 9.8/6.0 (51.8%)','Chol Machot':'CAA 8.9/5.5, 2.5blk DPOY',
 'Caleb Williams':'BIG EAST 4.3/3.8','Gabriel Landeira':'Brazil NBB','Elmarko Jackson':'BIG12 4.6 career',
 'Pedro Pastre':'Brazil NBB','Justin Caldwell':'HS','Kayvaun Mulready':'BIG EAST bench',
 'Devin Williams':'AAC 7.5/5.2, 2.6blk (7th natl)','Rodney Brown Jr.':'WCC 14.0 (38.2% 3PT)',
 'Mayar Wol':'MAC 10.5 (39.1% 3PT) PER 19.4','Kareem Thomas':'IVY 15.9 (44.7% 3PT)',
 'Del Jones':'BIG SOUTH 17.2 (41.6/30.9)','Roddie Anderson III':'BIG EAST 10.9 bench',
 'Simeon Wilcher':'SEC 5.6 bench','Terry Copeland':'NJCAA 19.8/7.9','Abdulai Fanta Kabba':'SOCON 4.7/5.8',
 'Trey Parker':'BIG EAST 4.3','Nathan Mariano':'G League/Brazil','Darien Moore':'HS 4-star',
 'Magoon Gwath':'MWC 8.5/5.2, 2.6blk DPOY','Ade Popoola':'AAC 10.8 (40.9% 3PT, led AAC)',
 'Kahmare Holmes':'SOCON 19.5 (48.3%)','Koree Cotton':'SOUTHLAND 13.6 (40.5% 3PT)',
 'Layden Blocker':'BIG EAST 11.1 (36.0%)','Wilson Jacques':'MWC 8.8/8.8 frosh',
 'Noah Meeusen':'BIG12 5.9 low-usage','Kruz McClure':'BIG EAST 5.0 frosh',
 'Theo Pierre-Justin':'BIG EAST depth','Fabian Flores':'BIG EAST 2.9','Malik Mack':'BIG EAST 13.6/4.1 (38.1%)','Miles Byrd':'MWC 12.3, MW All-Def',
 'Devin Vanterpool':'AAC 15.8/6.3','Arrinten Page':'BIG TEN 10.2 (54.9%)','Ryan Mela':'BIG EAST 9.9/5.3',
 'Ryan Sabol':'MAC 14.4 (79 3PM)','Dink Pate':'G LEAGUE 10.0/5.2','Samson Aletan':'IVY 7.8/5.8',
};
const top=(t,n=8)=>[...t.roster].sort((a,b)=>b.overall-a.overall).slice(0,n);
function compare(A,B){
  const a=top(A),b=top(B);
  console.log(`\n  ${A.name.replace(' 2026-27','').toUpperCase()} vs ${B.name.toUpperCase()} — top 8\n`);
  for(let i=0;i<8;i++){
    const L=`${a[i].overall} ${a[i].name.padEnd(17)} ${(SRC[a[i].name]||'').slice(0,27).padEnd(27)}`;
    const R=`${b[i].overall} ${b[i].name.padEnd(19)} ${(SRC[b[i].name]||'').slice(0,29)}`;
    const e=a[i].overall-b[i].overall;
    console.log(`   ${(e>0?'+':'')+String(e).padStart(3)}  ${L}| ${R}`);
  }
  const av=x=>(x.reduce((s,p)=>s+p.overall,0)/x.length).toFixed(1);
  console.log(`\n        top-5 avg: ${av(a.slice(0,5))} vs ${av(b.slice(0,5))}   |   top-8 avg: ${av(a)} vs ${av(b)}`);
}
compare(GU,SHU); compare(GU,PRV); compare(GU,DEP);

function h2h(A,B){
  const ra=ratings(A),rb=ratings(B),poss=ra.tempo*rb.tempo/67.5;
  const sd=Math.sqrt(volatility(A)**2+volatility(B)**2);
  const out={};
  for(const [lab,hca] of [['neutral',0],['A home',3.5],['B home',-3.5]]){
    const m=(ra.adjO*rb.adjD/104-rb.adjO*ra.adjD/104)*poss/100+hca;
    const z=m/sd,t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2);
    let p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
    out[lab]={p:(z>0?1-p:p)*100,m};
  }
  return {out,sd,emA:ra.adjEM,emB:rb.adjEM};
}
console.log('\n\n  HEAD-TO-HEAD WIN PROBABILITY (Georgetown\'s side)\n');
console.log('  Opponent      AdjEM gap |  GU neutral   GU home   GU away | proj line (neutral)');
console.log('  '+'-'.repeat(80));
for(const [nm,T] of [['Seton Hall',SHU],['Providence',PRV],['DePaul',DEP]]){
  const r=h2h(GU,T);
  console.log(`  ${nm.padEnd(13)} ${(r.emA-r.emB).toFixed(1).padStart(6)}   | ${r.out['neutral'].p.toFixed(1).padStart(9)}% ${r.out['A home'].p.toFixed(1).padStart(9)}% ${r.out['B home'].p.toFixed(1).padStart(8)}% | GU ${r.out['neutral'].m>=0?'-':'+'}${Math.abs(r.out['neutral'].m).toFixed(1)}`);
}
// season-series expectation (home + away)
console.log('\n  Expected season series (1 home + 1 away, 2 games):');
for(const [nm,T] of [['Seton Hall',SHU],['Providence',PRV],['DePaul',DEP]]){
  const r=h2h(GU,T);
  const exp=(r.out['A home'].p+r.out['B home'].p)/100;
  console.log(`    vs ${nm.padEnd(12)} Georgetown expected ${exp.toFixed(2)} of 2 wins   (sweep odds ${(r.out['A home'].p/100*r.out['B home'].p/100*100).toFixed(1)}%, swept ${((1-r.out['A home'].p/100)*(1-r.out['B home'].p/100)*100).toFixed(1)}%)`);
}
