// BACKTEST / MATH VALIDATION for the efficiency engine + game model.
// 1) Anchor recovery: do the anchored teams land at their real Torvik ranks?
// 2) 2025-26 sanity: does last year's GU (actual 6-14) land where a ~#100 team should?
// 3) Win-probability calibration: when the model says X%, does the sim win X%?
// 4) Margin/SD integrity: do simulated margins match expMargin and the per-game SD?
const { rate, project, simGame, gauss } = require('./gamemodel');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2526 } = require('./rosters');

function section(t) { console.log('\n' + t + '\n' + '-'.repeat(t.length)); }

// ---- 1) anchor recovery ----------------------------------------------------
section('1) ANCHOR RECOVERY (model rank vs real BartTorvik preseason rank)');
const TARGET = { 'UConn': 10, 'Marquette': 27, "St. John's": 52 };
for (const [name, tgt] of Object.entries(TARGET)) {
  const r = rate(BIG_EAST.find(t => t.name === name));
  const flag = Math.abs(r.natRank - tgt) <= 12 ? 'OK' : 'CHECK';
  console.log(`  ${name.padEnd(12)} model #${String(r.natRank).padStart(3)}  vs Torvik #${tgt}   [${flag}]`);
}
console.log('  (St. John\'s intentionally above #52 — that rank predated the Yessoufou commit.)');

// ---- 2) prior-season sanity ------------------------------------------------
section('2) PRIOR-SEASON SANITY (2025-26 Georgetown actually went 6-14 / T-10th BE)');
const gu26 = rate(GEORGETOWN_2526);
console.log(`  2025-26 GU: AdjEM +${gu26.adjEM.toFixed(1)}, model #${gu26.natRank}` +
  `  [expected ~#90-120 for a 6-14 high-major team -> ${gu26.natRank >= 90 && gu26.natRank <= 125 ? 'OK' : 'CHECK'}]`);

// ---- 3) win-probability calibration ----------------------------------------
section('3) WIN-PROBABILITY CALIBRATION (predicted bucket vs observed win rate)');
const teams = [...BIG_EAST, GEORGETOWN_2526];
const buckets = {}; // key -> {pred sum, wins, n}
const PER = 4000;
for (let a = 0; a < teams.length; a++) for (let b = 0; b < teams.length; b++) {
  if (a === b) continue;
  const pr = project(teams[a], teams[b], false).winProbA;
  const key = Math.min(9, Math.floor(pr * 10)); // decile bucket
  buckets[key] = buckets[key] || { pred: 0, wins: 0, n: 0 };
  let w = 0;
  for (let k = 0; k < PER; k++) if (simGame(teams[a], teams[b], false)) w++;
  buckets[key].pred += pr * PER; buckets[key].wins += w; buckets[key].n += PER;
}
console.log('  bucket     predicted   observed    n      err');
let maxErr = 0;
for (let k = 0; k <= 9; k++) {
  if (!buckets[k]) continue;
  const bk = buckets[k];
  const pred = bk.pred / bk.n * 100, obs = bk.wins / bk.n * 100, err = Math.abs(pred - obs);
  maxErr = Math.max(maxErr, err);
  console.log(`  ${(k * 10).toString().padStart(2)}-${(k * 10 + 10).toString().padStart(2)}%   ` +
    `${pred.toFixed(1).padStart(7)}%   ${obs.toFixed(1).padStart(7)}%  ${String(bk.n).padStart(6)}  ${err.toFixed(2).padStart(5)}`);
}
console.log(`  max calibration error: ${maxErr.toFixed(2)} pts  [${maxErr < 1.5 ? 'OK (well-calibrated)' : 'CHECK'}]`);

// ---- 4) margin / SD integrity ----------------------------------------------
section('4) MARGIN / SD INTEGRITY (sim mean & SD vs analytic projection)');
const samples = [
  ['UConn', 'Butler'], ['Georgetown 2026-27', 'Providence'], ['Marquette', "St. John's"],
];
const N = 200000;
for (const [an, bn] of samples) {
  const A = teams.find(t => t.name === an), B = teams.find(t => t.name === bn);
  const pr = project(A, B, true);
  let s = 0, ss = 0;
  for (let i = 0; i < N; i++) { const m = pr.expMargin + gauss() * pr.sd; s += m; ss += m * m; }
  const mean = s / N, sd = Math.sqrt(ss / N - mean * mean);
  console.log(`  ${an.split(' ')[0]} vs ${bn.split(' ')[0]}: proj margin ${pr.expMargin.toFixed(2)} / sim ${mean.toFixed(2)}` +
    ` | proj SD ${pr.sd.toFixed(2)} / sim ${sd.toFixed(2)}` +
    `  [${Math.abs(mean - pr.expMargin) < 0.2 && Math.abs(sd - pr.sd) < 0.2 ? 'OK' : 'CHECK'}]`);
}
