const { ratings, normalCDF, AVG_EFF, AVG_TEMPO, GAME_SD } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627, GEORGETOWN_2627_NO_MILLER, GEORGETOWN_2526 } = require('./rosters');

// Pre-compute ratings once.
const R = new Map();
function rate(team) { if (!R.has(team.name)) R.set(team.name, ratings(team)); return R.get(team.name); }

let spareGauss = null;
function gauss() {
  if (spareGauss != null) { const g = spareGauss; spareGauss = null; return g; }
  let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random();
  const m = Math.sqrt(-2 * Math.log(u)); spareGauss = m * Math.sin(2 * Math.PI * v);
  return m * Math.cos(2 * Math.PI * v);
}

// Project A (home) vs B (away). KenPom/Torvik-style efficiency model.
function project(a, b, neutral) {
  const ra = rate(a), rb = rate(b);
  const poss = ra.tempo * rb.tempo / AVG_TEMPO;
  const aOE = ra.adjO * rb.adjD / AVG_EFF;
  const bOE = rb.adjO * ra.adjD / AVG_EFF;
  const hca = neutral ? 0 : 3.5;
  const ptsA = aOE * poss / 100 + hca / 2;
  const ptsB = bOE * poss / 100 - hca / 2;
  const expMargin = ptsA - ptsB;
  return { expMargin, ptsA, ptsB, winProbA: normalCDF(expMargin / GAME_SD), poss };
}

function simGame(a, b, neutral) {
  const { expMargin } = project(a, b, neutral);
  return expMargin + gauss() * GAME_SD > 0; // true => home (a) wins
}

// ---------------------------------------------------------------- ratings table
function ratingsTable() {
  const teams = [...BIG_EAST, GEORGETOWN_2627_NO_MILLER, GEORGETOWN_2526];
  const rows = teams.map(rate).sort((a, b) => b.adjEM - a.adjEM);
  console.log('2026-27 efficiency ratings (modeled, KenPom/Torvik/EvanMiya-style)\n');
  console.log('  Team                          KP   Torvik EvanM | Cons   AdjO   AdjD  Tempo Barthag ~NatRk');
  console.log('  ' + '-'.repeat(94));
  for (const r of rows) {
    const s = r.systems;
    console.log('  ' + (r.name + (r.anchored ? ' *' : '')).padEnd(30) +
      `${s.kenpom.toFixed(1).padStart(5)} ${s.torvik.toFixed(1).padStart(6)} ${s.evanmiya.toFixed(1).padStart(5)} |` +
      `${('+' + r.adjEM.toFixed(1)).padStart(6)} ${r.adjO.toFixed(1).padStart(6)} ${r.adjD.toFixed(1).padStart(6)} ` +
      `${r.tempo.toFixed(1).padStart(5)} ${r.barthag.toFixed(3).padStart(7)} ${String(r.natRank).padStart(5)}`);
  }
}

// ---------------------------------------------------------------- season sim
function seasonSim(N = 20000) {
  const teams = BIG_EAST, names = teams.map(t => t.name);
  const tot = Object.fromEntries(names.map(n => [n, 0]));
  const finish = Object.fromEntries(names.map(n => [n, Array(teams.length).fill(0)]));
  const title = Object.fromEntries(names.map(n => [n, 0]));
  for (let s = 0; s < N; s++) {
    const w = Object.fromEntries(names.map(n => [n, 0]));
    for (let i = 0; i < teams.length; i++) for (let j = i + 1; j < teams.length; j++) {
      if (simGame(teams[i], teams[j], false)) w[teams[i].name]++; else w[teams[j].name]++;
      if (simGame(teams[j], teams[i], false)) w[teams[j].name]++; else w[teams[i].name]++;
    }
    for (const n of names) tot[n] += w[n];
    const order = [...names].sort((a, b) => w[b] - w[a]);
    order.forEach((n, idx) => finish[n][idx]++);
    const top = w[order[0]], tied = names.filter(n => w[n] === top);
    for (const n of tied) title[n] += 1 / tied.length;
  }
  const rows = names.map(n => ({
    name: n, em: rate(teams.find(t => t.name === n)).adjEM,
    avg: tot[n] / N, title: title[n] / N * 100,
    top4: finish[n].slice(0, 4).reduce((a, b) => a + b, 0) / N * 100,
  })).sort((a, b) => b.avg - a.avg);
  const gp = (teams.length - 1) * 2;
  console.log(`\nBig East 2026-27 projected standings (${N.toLocaleString()} sims, efficiency model, ${gp}-game conf)\n`);
  console.log('  #  Team                       AdjEM  Conf W-L    Title%  Top4%');
  console.log('  ' + '-'.repeat(62));
  rows.forEach((r, i) => console.log(
    `  ${String(i + 1).padStart(2)} ${r.name.padEnd(26)} ${('+' + r.em.toFixed(1)).padStart(5)}  ` +
    `${(r.avg.toFixed(1) + '-' + (gp - r.avg).toFixed(1)).padEnd(10)} ${r.title.toFixed(1).padStart(5)}% ${r.top4.toFixed(1).padStart(5)}%`));
}

// ---------------------------------------------------------------- head-to-heads
function h2h(label, a, b) {
  const neu = project(a, b, true);
  console.log(`  ${label}: ${a.name} ${(neu.winProbA * 100).toFixed(1)}% / ${b.name} ${((1 - neu.winProbA) * 100).toFixed(1)}%` +
    `  | proj ${neu.ptsA.toFixed(0)}-${neu.ptsB.toFixed(0)} (line ${a.name.split(' ')[0]} ${neu.expMargin >= 0 ? '-' : '+'}${Math.abs(neu.expMargin).toFixed(1)})`);
}

ratingsTable();
seasonSim();
console.log('\nKey head-to-heads (neutral court, efficiency model):');
h2h('GU(+Miller) vs GU 2025-26 ', GEORGETOWN_2627, GEORGETOWN_2526);
h2h('GU(+Miller) vs Providence  ', GEORGETOWN_2627, BIG_EAST.find(t => t.name === 'Providence'));
h2h('GU(no Miller) vs Providence', GEORGETOWN_2627_NO_MILLER, BIG_EAST.find(t => t.name === 'Providence'));
