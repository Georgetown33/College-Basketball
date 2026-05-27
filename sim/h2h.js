const { teamRating, simulateGame } = require('./engine');
const { GEORGETOWN_2627, GEORGETOWN_2526 } = require('./rosters');

const N = 50000;
const A = GEORGETOWN_2627, B = GEORGETOWN_2526;

console.log('Team ratings (engine teamRating):');
console.log(`  ${A.name}: ${teamRating(A.roster)}`);
console.log(`  ${B.name}: ${teamRating(B.roster)}`);
console.log('');

// Neutral-court head-to-head
let aWins = 0, bWins = 0, aPts = 0, bPts = 0, margins = [];
for (let i = 0; i < N; i++) {
  const r = simulateGame(A, B, true); // A is "home" slot but neutral=true => no home edge
  if (r.homeWin) { aWins++; aPts += r.finalHome; bPts += r.finalAway; margins.push(r.finalHome - r.finalAway); }
  else { bWins++; aPts += r.finalHome; bPts += r.finalAway; margins.push(r.finalHome - r.finalAway); }
}
const avgMargin = margins.reduce((s, m) => s + m, 0) / N;
console.log(`Neutral-court head-to-head (${N.toLocaleString()} sims):`);
console.log(`  ${A.name}: ${(aWins / N * 100).toFixed(1)}%  (avg ${(aPts / N).toFixed(1)} pts)`);
console.log(`  ${B.name}: ${(bWins / N * 100).toFixed(1)}%  (avg ${(bPts / N).toFixed(1)} pts)`);
console.log(`  Avg margin (A - B): ${avgMargin >= 0 ? '+' : ''}${avgMargin.toFixed(1)}`);
