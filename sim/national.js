// NATIONAL RERANK — places ACC/SEC/Big 12 top teams on the SAME AdjEM axis as
// the Big East model. My Big East ratings are already calibrated to the
// BartTorvik scale (via the UConn/Marquette/SJU anchors), so:
//   * Big East teams  -> use my MODELED AdjEM directly (from metrics.js/ratings).
//   * Other-conf teams -> convert their REAL published consensus preseason rank
//     into an AdjEM via the inverse of the same rank<->EM curve used internally.
// This keeps everything comparable and grounded in real data for the new teams.
const { rate } = require('./gamemodel');
const { BIG_EAST } = require('./bigeast');

// Inverse of: rank = 193.4 * exp(-0.1288 * EM)   ->   EM = (ln(193.4) - ln(rank)) / 0.1288
const RANK_A = 193.4, RANK_K = 0.1288;
const emFromRank = r => (Math.log(RANK_A) - Math.log(r)) / RANK_K;

// Consensus preseason national rank for non-Big-East top teams.
// rank = median of available published lists (ESPN / CBS / SI / Torvik).
// Populated from the research agents. (Filled in after agents return.)
const OTHER_CONF = [
  // { team, conf, rank }
];

function buildNational() {
  const rows = [];
  // Big East: modeled AdjEM (already on-scale)
  for (const t of BIG_EAST) {
    const r = rate(t);
    rows.push({ team: t.name, conf: 'Big East', em: r.adjEM, src: 'modeled' });
  }
  // Other conferences: from published consensus rank
  for (const o of OTHER_CONF) {
    rows.push({ team: o.team, conf: o.conf, em: emFromRank(o.rank), src: `rank #${o.rank}` });
  }
  rows.sort((a, b) => b.em - a.em);
  return rows;
}

function print(rows, limit = 40) {
  console.log('NATIONAL RERANK (2026-27 preseason, common AdjEM axis)\n');
  console.log('  Rk  Team                       Conf       AdjEM   source');
  console.log('  ' + '-'.repeat(62));
  rows.slice(0, limit).forEach((r, i) => console.log(
    `  ${String(i + 1).padStart(2)}  ${r.team.padEnd(26)} ${r.conf.padEnd(9)} ${('+' + r.em.toFixed(1)).padStart(6)}   ${r.src}`));
  const gu = rows.findIndex(r => r.team.startsWith('Georgetown 2026'));
  if (gu >= 0) console.log(`\n  Georgetown national rank: #${gu + 1}`);
}

module.exports = { buildNational, emFromRank, OTHER_CONF };
if (require.main === module) print(buildNational());
