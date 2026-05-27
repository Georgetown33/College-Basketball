const { teamRating, simulateGame } = require('./engine');
const { GEORGETOWN_2627, GEORGETOWN_2627_NO_MILLER, GEORGETOWN_2526 } = require('./rosters');
const { BIG_EAST } = require('./bigeast');

const N = 50000, S = 20000;

function h2hVsLastYear(team) {
  let w = 0;
  for (let i = 0; i < N; i++) if (simulateGame(team, GEORGETOWN_2526, true).homeWin) w++;
  return w / N * 100;
}

function bigEastFinish(guTeam) {
  const teams = BIG_EAST.map(t => t.name === 'Georgetown 2026-27' ? guTeam : t);
  const names = teams.map(t => t.name), tot = Object.fromEntries(names.map(n => [n, 0]));
  for (let s = 0; s < S; s++) {
    const wins = Object.fromEntries(names.map(n => [n, 0]));
    for (let i = 0; i < teams.length; i++) for (let j = i + 1; j < teams.length; j++) {
      let r = simulateGame(teams[i], teams[j], false); if (r.homeWin) wins[teams[i].name]++; else wins[teams[j].name]++;
      r = simulateGame(teams[j], teams[i], false); if (r.homeWin) wins[teams[j].name]++; else wins[teams[i].name]++;
    }
    for (const n of names) tot[n] += wins[n];
  }
  const rows = names.map(n => ({ name: n, avg: tot[n] / S })).sort((a, b) => b.avg - a.avg);
  const idx = rows.findIndex(r => r.name === guTeam.name);
  return { rank: idx + 1, wins: rows[idx].avg };
}

for (const [label, team] of [['WITH Miller (primary)   ', GEORGETOWN_2627], ['NO Miller (objective alt)', GEORGETOWN_2627_NO_MILLER]]) {
  const f = bigEastFinish(team);
  console.log(`${label}: rating ${teamRating(team.roster)} | vs GU 2025-26: ${h2hVsLastYear(team).toFixed(1)}% | Big East finish #${f.rank} (${f.wins.toFixed(1)}-${(20 - f.wins).toFixed(1)})`);
}
