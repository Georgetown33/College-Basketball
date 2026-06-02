const { ratings, volatility, normalCDF } = require('./metrics');
const { rate, project } = require('./gamemodel');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627 } = require('./rosters');

const GU = GEORGETOWN_2627;
const BUT = BIG_EAST.find(t => t.name === 'Butler');

const rg = rate(GU), rb = rate(BUT);
console.log('Ratings (production-based):');
console.log(`  Georgetown: AdjEM +${rg.adjEM.toFixed(1)} (#${rg.natRank}) | AdjO ${rg.adjO.toFixed(1)} / AdjD ${rg.adjD.toFixed(1)} | sigma ${volatility(GU).toFixed(2)}`);
console.log(`  Butler:     AdjEM +${rb.adjEM.toFixed(1)} (#${rb.natRank}) | AdjO ${rb.adjO.toFixed(1)} / AdjD ${rb.adjD.toFixed(1)} | sigma ${volatility(BUT).toFixed(2)}\n`);

for (const [label, neutral] of [['Neutral court', true], ['Georgetown HOME', false], ['Butler HOME', false]]) {
  const A = label === 'Butler HOME' ? BUT : GU;
  const B = label === 'Butler HOME' ? GU : BUT;
  const pr = project(A, B, neutral);
  const guPct = label === 'Butler HOME' ? (1 - pr.winProbA) * 100 : pr.winProbA * 100;
  const guPts = label === 'Butler HOME' ? pr.ptsB : pr.ptsA;
  const butPts = label === 'Butler HOME' ? pr.ptsA : pr.ptsB;
  const line = guPts - butPts;
  console.log(`${label}: Georgetown ${guPct.toFixed(1)}% / Butler ${(100 - guPct).toFixed(1)}%  | proj GU ${guPts.toFixed(0)}-${butPts.toFixed(0)} (GU ${line >= 0 ? '-' : '+'}${Math.abs(line).toFixed(1)}, SD ${pr.sd.toFixed(1)})`);
}
