const { teamRating, simulateGame } = require('./engine');
const { BIG_EAST } = require('./bigeast');

// Double round-robin (each team plays every other twice, home & away) = the
// engine's conference format. Random home/away assignment per pairing already
// balances since each plays the other once at each site.
const N = 20000;
const teams = BIG_EAST;
const names = teams.map(t => t.name);

const totalWins = Object.fromEntries(names.map(n => [n, 0]));
const finishCounts = Object.fromEntries(names.map(n => [n, Array(teams.length).fill(0)]));
const titleCounts = Object.fromEntries(names.map(n => [n, 0]));

for (let s = 0; s < N; s++) {
  const wins = Object.fromEntries(names.map(n => [n, 0]));
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      // game 1: i home, game 2: j home
      let r = simulateGame(teams[i], teams[j], false);
      if (r.homeWin) wins[teams[i].name]++; else wins[teams[j].name]++;
      r = simulateGame(teams[j], teams[i], false);
      if (r.homeWin) wins[teams[j].name]++; else wins[teams[i].name]++;
    }
  }
  for (const n of names) totalWins[n] += wins[n];
  const order = [...names].sort((a, b) => wins[b] - wins[a]);
  order.forEach((n, idx) => finishCounts[n][idx]++);
  // regular-season title (ties split)
  const top = wins[order[0]];
  const tied = names.filter(n => wins[n] === top);
  for (const n of tied) titleCounts[n] += 1 / tied.length;
}

const rows = names.map(n => ({
  name: n,
  rating: teamRating(teams.find(t => t.name === n).roster),
  avgWins: totalWins[n] / N,
  title: titleCounts[n] / N * 100,
  top4: finishCounts[n].slice(0, 4).reduce((a, b) => a + b, 0) / N * 100,
})).sort((a, b) => b.avgWins - a.avgWins);

const gp = (teams.length - 1) * 2;
console.log(`Big East 2026-27 projected standings (${N.toLocaleString()} season sims, ${gp}-game conf schedule)\n`);
console.log('  #  Team                       Rtg   Conf W-L     Title%  Top4%');
console.log('  ' + '-'.repeat(64));
rows.forEach((r, i) => {
  const wl = `${r.avgWins.toFixed(1)}-${(gp - r.avgWins).toFixed(1)}`;
  console.log(
    `  ${String(i + 1).padStart(2)} ${r.name.padEnd(26)} ${String(r.rating).padStart(3)}   ${wl.padEnd(11)} ${r.title.toFixed(1).padStart(5)}%  ${r.top4.toFixed(1).padStart(5)}%`
  );
});
