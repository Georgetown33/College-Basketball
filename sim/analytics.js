// Advanced analytics layer on top of the efficiency engine:
//   1) volatility / upset profile      2) preseason uncertainty bands
//   3) Four Factors profiles           4) NCAA Tournament projection
const { rate, vol, gauss, project, simGame } = require('./gamemodel');
const { ratings, fourFactors, rankFromEM, normalCDF, clamp, META, AVG_TEMPO } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627 } = require('./rosters');

const byEM = (a, b) => rate(b).adjEM - rate(a).adjEM;
const TEAMS = [...BIG_EAST].sort(byEM);

// ---------------------------------------------------------------- 1) volatility
function volatilityTable() {
  console.log('VOLATILITY / UPSET PROFILE  (game-margin SD contributed by each team)\n');
  console.log('  Team                        sigma   profile');
  console.log('  ' + '-'.repeat(58));
  for (const t of TEAMS) {
    const s = vol(t);
    const tag = s >= 8.4 ? 'high variance (boom/bust, upset-prone)'
      : s <= 7.3 ? 'low variance (steady, hard to upset)'
        : 'average variance';
    console.log(`  ${t.name.padEnd(26)} ${s.toFixed(2).padStart(5)}   ${tag}`);
  }
}

// ---------------------------------------------------------------- 2) bands
function bands(iters = 3000) {
  console.log('\nPRESEASON UNCERTAINTY BANDS  (Monte Carlo over roster projection risk)\n');
  console.log('  new/unproven rosters -> wider bands (bust risk vs breakout upside)\n');
  console.log('  Team                      Cons   Floor..Ceil(EM)   RankBand     bust%  boom%');
  console.log('  ' + '-'.repeat(76));
  for (const t of TEAMS) {
    const meta = META[t.name] || { ret: 0.30 };
    const ps = 1.6 + 4.2 * (1 - meta.ret);          // per-player projection SD by newness
    const base = rate(t).adjEM;
    const ems = [];
    for (let i = 0; i < iters; i++) {
      const roster = t.roster.map(p => ({ ...p, overall: clamp(p.overall + gauss() * ps, 30, 99) }));
      ems.push(ratings({ name: t.name, roster }).adjEM);
    }
    ems.sort((a, b) => a - b);
    const p10 = ems[Math.floor(iters * 0.10)], p90 = ems[Math.floor(iters * 0.90)];
    const bust = ems.filter(e => e < base - 4).length / iters * 100;
    const boom = ems.filter(e => e > base + 4).length / iters * 100;
    console.log(`  ${t.name.padEnd(24)} ${('+' + base.toFixed(1)).padStart(5)}   ` +
      `${('+' + p10.toFixed(1)).padStart(5)}..${('+' + p90.toFixed(1)).padStart(5)}   ` +
      `${('#' + rankFromEM(p90)).padStart(4)}..${('#' + rankFromEM(p10)).padEnd(5)} ` +
      `${bust.toFixed(0).padStart(5)}% ${boom.toFixed(0).padStart(5)}%`);
  }
}

// ---------------------------------------------------------------- 3) four factors
function fourFactorTable() {
  console.log('\nFOUR FACTORS  (model-derived).  Offense | Defense (opponent)');
  console.log('  Team                     oEFG  oTOV  oORB  oFTR | dEFG  dTOV  dORB  dFTR');
  console.log('  ' + '-'.repeat(72));
  for (const t of TEAMS) {
    const f = fourFactors(t);
    const r = x => x.toFixed(1).padStart(4);
    console.log(`  ${t.name.padEnd(24)} ${r(f.oEFG)} ${r(f.oTOV)} ${r(f.oORB)} ${r(f.oFTR)} | ${r(f.dEFG)} ${r(f.dTOV)} ${r(f.dORB)} ${r(f.dFTR)}`);
  }
}

// ---------------------------------------------------------------- 4) tournament
// Synthetic non-conference SOS (same 11-game slate for every team, fairness):
// a couple quality games, several mid, a few buy games. EM of opponents:
const NONCONF = [16, 10, 5, 1, -3, -7, -11, -15, -20, -26, -33];
const NONCONF_HOME = [true, false, true, true, true, false, true, true, true, true, false]; // ~8 home

function nonConfWins(team) {
  const r = rate(team), poss = r.tempo * AVG_TEMPO / AVG_TEMPO; // ~team tempo
  const sd = Math.sqrt(vol(team) ** 2 + 7.8 ** 2);
  let w = 0;
  for (let i = 0; i < NONCONF.length; i++) {
    const margin = (r.adjEM - NONCONF[i]) * poss / 100 + (NONCONF_HOME[i] ? 3.5 : 0);
    if (margin + gauss() * sd > 0) w++;
  }
  return w;
}

function confTourneyChamp(confWins) {
  // 11 teams seeded by conf record, single elim, top-5 byes (pad to 16).
  let field = [...BIG_EAST].sort((a, b) => confWins[b.name] - confWins[a.name]);
  let bracket = [];
  // seeds 1-5 get a bye (auto-advance round 1); seeds 6-11 play (pair 6v11,7v10,8v9 ... )
  const byes = field.slice(0, 5);
  let rest = field.slice(5); // 6 teams
  // round 1 among the 6
  let advanced = [];
  for (let i = 0; i < rest.length / 2; i++) {
    const a = rest[i], b = rest[rest.length - 1 - i];
    advanced.push(simGame(a, b, true) ? a : b);
  }
  let alive = [...byes, ...advanced]; // 8 teams
  while (alive.length > 1) {
    const next = [];
    for (let i = 0; i < alive.length; i += 2) {
      next.push(simGame(alive[i], alive[i + 1], true) ? alive[i] : alive[i + 1]);
    }
    alive = next;
  }
  return alive[0].name;
}

function tournamentProjection(N = 8000) {
  const names = BIG_EAST.map(t => t.name);
  const bids = Object.fromEntries(names.map(n => [n, 0]));
  const seedSum = Object.fromEntries(names.map(n => [n, 0]));
  const totalWinsSum = Object.fromEntries(names.map(n => [n, 0]));
  const BID_CUT = 10.7; // calibrated so the league averages ~5-6 bids

  for (let s = 0; s < N; s++) {
    const cw = Object.fromEntries(names.map(n => [n, 0]));
    for (let i = 0; i < BIG_EAST.length; i++) for (let j = i + 1; j < BIG_EAST.length; j++) {
      if (simGame(BIG_EAST[i], BIG_EAST[j], false)) cw[BIG_EAST[i].name]++; else cw[BIG_EAST[j].name]++;
      if (simGame(BIG_EAST[j], BIG_EAST[i], false)) cw[BIG_EAST[j].name]++; else cw[BIG_EAST[i].name]++;
    }
    const champ = confTourneyChamp(cw);
    for (const t of BIG_EAST) {
      const ncw = nonConfWins(t);
      const total = cw[t.name] + ncw;
      totalWinsSum[t.name] += total;
      const em = rate(t).adjEM;
      const bidScore = em + (total - 18) * 0.55 + gauss() * 2.4;
      const inField = (t.name === champ) || bidScore >= BID_CUT;
      if (inField) {
        bids[t.name]++;
        // seed from a resume-rank proxy (better EM/record -> better seed)
        const seed = clamp(Math.round(rankFromEM(em + (total - 18) * 0.4) / 4 + 0.5), 1, 16);
        seedSum[t.name] += seed;
      }
    }
  }
  const rows = names.map(n => ({
    name: n, em: rate(BIG_EAST.find(t => t.name === n)).adjEM,
    bid: bids[n] / N * 100, seed: bids[n] ? seedSum[n] / bids[n] : null,
    wins: totalWinsSum[n] / N,
  })).sort((a, b) => b.bid - a.bid || b.em - a.em);
  const avgBids = Object.values(bids).reduce((a, b) => a + b, 0) / N;
  console.log(`\nNCAA TOURNAMENT PROJECTION  (${N.toLocaleString()} full-season sims: 20 conf + 11 non-conf)`);
  console.log(`  Big East projected bids: ${avgBids.toFixed(1)} per year\n`);
  console.log('  Team                      Proj Record   Bid%   ProjSeed');
  console.log('  ' + '-'.repeat(56));
  rows.forEach(r => console.log(
    `  ${r.name.padEnd(24)} ${(r.wins.toFixed(1) + '-' + (31 - r.wins).toFixed(1)).padEnd(11)}  ${r.bid.toFixed(0).padStart(3)}%   ` +
    `${r.seed ? r.seed.toFixed(1) + ' seed' : '—'}`));
}

volatilityTable();
bands();
fourFactorTable();
tournamentProjection();

// Spotlight Georgetown
const gu = rate(GEORGETOWN_2627);
console.log(`\nGEORGETOWN spotlight: AdjEM +${gu.adjEM.toFixed(1)} (#${gu.natRank}), AdjO ${gu.adjO.toFixed(1)} / AdjD ${gu.adjD.toFixed(1)}, sigma ${vol(GEORGETOWN_2627).toFixed(2)}`);
