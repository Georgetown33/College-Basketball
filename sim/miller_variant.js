const { teamRating, simulateGame } = require('./engine');
const { GEORGETOWN_2627, GEORGETOWN_2627_WITH_MILLER, GEORGETOWN_2526 } = require('./rosters');
const { BIG_EAST } = require('./bigeast');

console.log('Georgetown 2026-27 ratings:');
console.log(`  REAL (no Miller):     ${teamRating(GEORGETOWN_2627.roster)}`);
console.log(`  +Miller (hypothetical): ${teamRating(GEORGETOWN_2627_WITH_MILLER.roster)}\n`);

// Head-to-head: +Miller version vs 2025-26
const N = 50000; let w = 0;
for (let i=0;i<N;i++){ const r = simulateGame(GEORGETOWN_2627_WITH_MILLER, GEORGETOWN_2526, true); if (r.homeWin) w++; }
console.log(`+Miller GU2627 vs GU2526 (neutral): ${(w/N*100).toFixed(1)}% win\n`);

// Big East finish with +Miller swapped in
const teams = BIG_EAST.map(t => t.name === 'Georgetown 2026-27' ? GEORGETOWN_2627_WITH_MILLER : t);
const names = teams.map(t=>t.name), tot = Object.fromEntries(names.map(n=>[n,0]));
const S = 20000;
for (let s=0;s<S;s++){ const wins=Object.fromEntries(names.map(n=>[n,0]));
  for (let i=0;i<teams.length;i++) for (let j=i+1;j<teams.length;j++){
    let r=simulateGame(teams[i],teams[j],false); if(r.homeWin)wins[teams[i].name]++;else wins[teams[j].name]++;
    r=simulateGame(teams[j],teams[i],false); if(r.homeWin)wins[teams[j].name]++;else wins[teams[i].name]++; }
  for(const n of names) tot[n]+=wins[n]; }
const rows=names.map(n=>({name:n,avg:tot[n]/S})).sort((a,b)=>b.avg-a.avg);
const rank=rows.findIndex(r=>r.name.startsWith('Georgetown'))+1;
const gu=rows.find(r=>r.name.startsWith('Georgetown'));
console.log(`With +Miller, Georgetown finishes #${rank} in Big East at ${gu.avg.toFixed(1)}-${(20-gu.avg).toFixed(1)}`);
