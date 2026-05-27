const { teamRating, simulateGame } = require('./engine');
const { BIG_EAST } = require('./bigeast');

// Swap in the public-consensus "thin" Georgetown (no Lowe/Miller/Jackson/Machot).
const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });
const CONSENSUS_GU = { name: 'Georgetown (consensus)', roster: [
  p('Gabriel Landeira','PG',70), p('Caleb Williams','SF',68), p('Julius Halaifonua','C',66),
  p('Kayvaun Mulready','SG',63), p('Portal G','SG',64), p('Portal F','PF',63),
  p('Freshman A','SG',60), p('Freshman B','PF',60), p('Seal Diouf','C',57),
]};
const teams = BIG_EAST.map(t => t.name.startsWith('Georgetown') ? CONSENSUS_GU : t);

const N = 20000, names = teams.map(t => t.name);
const totalWins = Object.fromEntries(names.map(n => [n, 0]));
for (let s = 0; s < N; s++) {
  const wins = Object.fromEntries(names.map(n => [n, 0]));
  for (let i = 0; i < teams.length; i++) for (let j = i + 1; j < teams.length; j++) {
    let r = simulateGame(teams[i], teams[j], false); if (r.homeWin) wins[teams[i].name]++; else wins[teams[j].name]++;
    r = simulateGame(teams[j], teams[i], false); if (r.homeWin) wins[teams[j].name]++; else wins[teams[i].name]++;
  }
  for (const n of names) totalWins[n] += wins[n];
}
const rows = names.map(n => ({ name:n, rating:teamRating(teams.find(t=>t.name===n).roster), avgWins: totalWins[n]/N }))
  .sort((a,b)=>b.avgWins-a.avgWins);
console.log('Big East with CONSENSUS (thin) Georgetown:\n');
rows.forEach((r,i)=>console.log(`  ${String(i+1).padStart(2)} ${r.name.padEnd(24)} Rtg ${r.rating}  ${r.avgWins.toFixed(1)}-${(20-r.avgWins).toFixed(1)}`));
