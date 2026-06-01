const { ratings, volatility } = require('./metrics');
const { rate, project, simGame } = require('./gamemodel');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627, GEORGETOWN_2526 } = require('./rosters');

const noScuka = { name: 'Georgetown 2026-27', roster: GEORGETOWN_2627.roster.filter(p => p.name !== 'Luka Scuka') };
const PROV = BIG_EAST.find(t => t.name === 'Providence');

function bigEastFinish(guTeam, N = 20000) {
  const teams = BIG_EAST.map(t => t.name === 'Georgetown 2026-27' ? guTeam : t);
  const names = teams.map(t => t.name), tot = Object.fromEntries(names.map(n => [n, 0]));
  const rcache = new Map(); teams.forEach(t => rcache.set(t.name, ratings(t)));
  // local sim using fresh ratings for the swapped GU
  const r = t => rcache.get(t.name);
  const vcache = new Map(); teams.forEach(t => vcache.set(t.name, volatility(t)));
  function sg(a, b) {
    const ra = r(a), rb = r(b), poss = ra.tempo * rb.tempo / 67.5;
    const em = (ra.adjO * rb.adjD / 104 - rb.adjO * ra.adjD / 104) * poss / 100 + 3.5;
    const sd = Math.sqrt(vcache.get(a.name) ** 2 + vcache.get(b.name) ** 2);
    let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random();
    return em + Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sd > 0;
  }
  for (let s = 0; s < N; s++) {
    const w = Object.fromEntries(names.map(n => [n, 0]));
    for (let i = 0; i < teams.length; i++) for (let j = i + 1; j < teams.length; j++) {
      if (sg(teams[i], teams[j])) w[teams[i].name]++; else w[teams[j].name]++;
      if (sg(teams[j], teams[i])) w[teams[j].name]++; else w[teams[i].name]++;
    }
    for (const n of names) tot[n] += w[n];
  }
  const rows = names.map(n => ({ name: n, avg: tot[n] / N })).sort((a, b) => b.avg - a.avg);
  const idx = rows.findIndex(x => x.name === 'Georgetown 2026-27');
  return { rank: idx + 1, wins: rows[idx].avg };
}

function h2h(gu, opp, N = 100000) {
  const rg = ratings(gu), ro = ratings(opp), poss = rg.tempo * ro.tempo / 67.5;
  const em = (rg.adjO * ro.adjD / 104 - ro.adjO * rg.adjD / 104) * poss / 100;
  const sd = Math.sqrt(volatility(gu) ** 2 + volatility(opp) ** 2);
  // normal CDF
  const z = em / sd, t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2);
  let pr = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  pr = z > 0 ? 1 - pr : pr;
  return { winPct: pr * 100, em };
}

for (const [label, gu] of [['WITHOUT Scuka', noScuka], ['WITH Scuka    ', GEORGETOWN_2627]]) {
  const r = ratings(gu);
  const f = bigEastFinish(gu);
  const vsLast = h2h(gu, GEORGETOWN_2526);
  const vsProv = h2h(gu, PROV);
  console.log(`${label}: AdjEM +${r.adjEM.toFixed(1)} (#${r.natRank}) | AdjO ${r.adjO.toFixed(1)} / AdjD ${r.adjD.toFixed(1)} | sigma ${volatility(gu).toFixed(2)}`);
  console.log(`   Big East: #${f.rank} (${f.wins.toFixed(1)}-${(20 - f.wins).toFixed(1)}) | vs GU2025-26: ${vsLast.winPct.toFixed(1)}% | vs Providence: ${vsProv.winPct.toFixed(1)}% (${vsProv.em >= 0 ? '-' : '+'}${Math.abs(vsProv.em).toFixed(1)})\n`);
}
