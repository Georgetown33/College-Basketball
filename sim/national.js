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
// rank = blended median of available published lists (ESPN / CBS / SI / Torvik),
// reconciling the multiple "way-too-early" versions each outlet published.
// Real data; exact slots are consensus estimates (outlets disagreed by a few spots).
const OTHER_CONF = [
  // ---- SEC ----
  { team: 'Florida', conf: 'SEC', rank: 1 },        // ESPN#1, SI#1(latest), CBS#2, Torvik#2
  { team: 'Arkansas', conf: 'SEC', rank: 9 },       // ESPN#5/11, SI#9
  { team: 'Tennessee', conf: 'SEC', rank: 10 },     // ESPN#6, SI#13/15
  { team: 'Texas', conf: 'SEC', rank: 13 },         // ESPN#9/13, CBS#12, SI#17
  { team: 'Alabama', conf: 'SEC', rank: 14 },       // SI#11, ESPN#15, CBS#19
  { team: 'Vanderbilt', conf: 'SEC', rank: 18 },    // SI#15, ESPN#18, CBS#21
  { team: 'Missouri', conf: 'SEC', rank: 22 },      // ESPN#20, Torvik#41
  { team: 'Auburn', conf: 'SEC', rank: 32 },        // n/a in polls; Pettiford-led, bubble
  { team: 'Kentucky', conf: 'SEC', rank: 38 },      // n/a in polls; bubble
  // ---- ACC ----
  { team: 'Duke', conf: 'ACC', rank: 2 },           // Torvik#1, ESPN#2, CBS#2, SI#6
  { team: 'Virginia', conf: 'ACC', rank: 11 },      // CBS#10, ESPN#14, SI#7, Torvik#16
  { team: 'Louisville', conf: 'ACC', rank: 13 },    // ESPN#11, CBS#14
  { team: 'Miami', conf: 'ACC', rank: 20 },         // ESPN#19
  { team: 'North Carolina', conf: 'ACC', rank: 24 },// ~#18-19 votes; bubble rebuild
  { team: 'Virginia Tech', conf: 'ACC', rank: 45 }, // Torvik ~top-50
  // ---- Big 12 ----
  { team: 'Arizona', conf: 'Big 12', rank: 5 },     // SI#4, ESPN#5, Torvik#3-6
  { team: 'Houston', conf: 'Big 12', rank: 8 },     // Torvik#3, ESPN#8-10, SI#10, CBS#14
  { team: 'Iowa State', conf: 'Big 12', rank: 12 }, // ESPN#12, CBS#11, SI#14
  { team: 'BYU', conf: 'Big 12', rank: 20 },        // revised down: lost Dybantsa (likely #1 pick) to NBA; SI#9 stale
  { team: 'TCU', conf: 'Big 12', rank: 19 },        // ESPN#16, CBS#19
  { team: 'Texas Tech', conf: 'Big 12', rank: 22 }, // revised down: Toppin (AA) on ACL recovery, may miss half the year
  { team: 'Kansas', conf: 'Big 12', rank: 21 },     // ESPN#18, SI#19, CBS#25
  { team: 'Baylor', conf: 'Big 12', rank: 30 },     // n/a in polls; bubble
  // ---- context: Big Ten / WCC top tier (outside requested scope, needed so the
  //      national ranks aren't inflated). Michigan is the defending champ + poll #1.
  { team: 'Michigan', conf: 'B1G*', rank: 3 },      // CBS#1, SI#1/2
  { team: 'Michigan State', conf: 'B1G*', rank: 6 },// CBS top-5, Torvik#7
  { team: 'Illinois', conf: 'B1G*', rank: 7 },      // top-5/8 across outlets
  { team: 'Gonzaga', conf: 'WCC*', rank: 14 },      // SI#12
  { team: 'Purdue', conf: 'B1G*', rank: 17 },       // mid-teens
  { team: 'UCLA', conf: 'B1G*', rank: 23 },         // SI#22, Torvik#21
];

// True national rank from AdjEM (same curve the model uses internally).
const rankFromEM = em => Math.max(1, Math.round(RANK_A * Math.exp(-RANK_K * em)));

function buildNational() {
  const rows = [];
  // Big East: modeled AdjEM (already on-scale); use model's own national rank.
  for (const t of BIG_EAST) {
    const r = rate(t);
    rows.push({ team: t.name, conf: 'Big East', em: r.adjEM, natRank: r.natRank, src: 'modeled' });
  }
  // Other conferences: from published consensus rank.
  for (const o of OTHER_CONF) {
    rows.push({ team: o.team, conf: o.conf, em: emFromRank(o.rank), natRank: o.rank, src: `poll #${o.rank}` });
  }
  rows.sort((a, b) => b.em - a.em);
  return rows;
}

function print(rows, limit = 40) {
  console.log('NATIONAL RERANK (2026-27 preseason) — top teams of ACC/SEC/Big 12/Big East');
  console.log('(+ Big Ten/WCC context*). NatRk = true national rank; list pos is among these teams only.\n');
  console.log('  Pos  NatRk  Team                       Conf      AdjEM   source');
  console.log('  ' + '-'.repeat(66));
  rows.slice(0, limit).forEach((r, i) => console.log(
    `  ${String(i + 1).padStart(3)}  ${('#' + r.natRank).padStart(5)}  ${r.team.padEnd(26)} ${r.conf.padEnd(8)} ${('+' + r.em.toFixed(1)).padStart(6)}   ${r.src}`));
  const gu = rows.find(r => r.team.startsWith('Georgetown 2026'));
  if (gu) console.log(`\n  Georgetown: true national rank #${gu.natRank} (AdjEM +${gu.em.toFixed(1)}); ` +
    `${rows.filter(r => r.conf === 'Big East' && r.em > gu.em).length} Big East teams ahead of it.`);
}

module.exports = { buildNational, emFromRank, OTHER_CONF };
if (require.main === module) print(buildNational());
