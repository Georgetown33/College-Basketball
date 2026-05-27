const { teamRating, simulateGame } = require('./engine');
const { GEORGETOWN_2627, GEORGETOWN_2627_NO_MILLER } = require('./rosters');
const { BIG_EAST } = require('./bigeast');

const PROV = BIG_EAST.find(t => t.name === 'Providence');
const N = 100000;

function h2h(a, b, neutral) {
  let aw = 0, bw = 0, am = 0;
  for (let i = 0; i < N; i++) {
    const r = simulateGame(a, b, neutral);
    if (r.homeWin) aw++; else bw++;
    am += r.finalHome - r.finalAway;
  }
  return { a: aw / N * 100, b: bw / N * 100, margin: am / N };
}

console.log(`Ratings:  Georgetown(+Miller) ${teamRating(GEORGETOWN_2627.roster)} | Georgetown(no Miller) ${teamRating(GEORGETOWN_2627_NO_MILLER.roster)} | Providence ${teamRating(PROV.roster)}\n`);

for (const [label, gu] of [['Georgetown (+Miller)', GEORGETOWN_2627], ['Georgetown (no Miller)', GEORGETOWN_2627_NO_MILLER]]) {
  const neu = h2h(gu, PROV, true);
  console.log(`${label} vs Providence:`);
  console.log(`  Neutral court : GU ${neu.a.toFixed(1)}%  /  PROV ${neu.b.toFixed(1)}%  (avg margin GU ${neu.margin>=0?'+':''}${neu.margin.toFixed(1)})`);
}
