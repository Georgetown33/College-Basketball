// ============================================================================
// metrics.js — tempo-free efficiency engine (KenPom / BartTorvik / EvanMiya style)
// ----------------------------------------------------------------------------
// Replaces the single-`overall` model with two-sided, player-impact-based team
// ratings:
//   * Each player -> offensive & defensive impact (points per 100 poss vs a
//     solid-high-major baseline), EvanMiya-BPR style, minutes-weighted.
//   * Team -> AdjO, AdjD, AdjEM, tempo, Barthag.
//   * Three "systems" emulate each provider's known methodological lean, then a
//     consensus. Optional real published anchors (e.g. BartTorvik preseason)
//     blend in via META[].anchorEM.
// These are MODELED estimates (transparent + reproducible), not scraped values.
// ============================================================================

const BASELINE = 68;     // overall of a solid high-major rotation player (net 0)
const SLOPE = 0.55;      // overall point -> net pts/100 impact
const AVG_EFF = 104.0;   // D1 average efficiency (pts/100), recent seasons
const O_OFFSET = 5.0;    // high-major offensive baseline above D1 avg
const D_OFFSET = 5.0;    // high-major defensive baseline below D1 avg
const AVG_TEMPO = 67.5;
const GAME_SD = 11.0;    // empirical game-to-game margin SD (pts)

// Minutes template for a 10-man rotation (sums to ~200).
const MIN_TEMPLATE = [34, 32, 30, 28, 25, 18, 13, 9, 6, 5];

// Offensive share of a player's net impact (1 = pure offense, 0 = pure defense).
// Defaults by position; signature players overridden to capture real identity.
const POS_OFF_SHARE = { PG: 0.62, SG: 0.62, SF: 0.55, PF: 0.48, C: 0.42 };
const OFF_SHARE = {
  // defense-tilted
  'Miles Byrd': 0.34, 'Chol Machot': 0.30, 'Magoon Gwath': 0.27,
  'Oswin Erhunmwunse': 0.32, 'Arrinten Page': 0.40, 'Najai Hines': 0.34,
  'Theo Edema': 0.34, 'Drayton Jones': 0.34, 'Wilson Jacques': 0.34,
  'Devin Williams': 0.32, 'Samson Aletan': 0.34, 'Kayvaun Mulready': 0.38,
  'Elmarko Jackson': 0.46, 'Caleb Williams': 0.45, 'Roddie Anderson III': 0.45,
  'Chance Westry': 0.48, 'Vince Iwuchukwu': 0.34, 'Julius Halaifonua': 0.34,
  'DeShawn Harris-Smith': 0.48, 'Jayden Ross': 0.46, 'Nico Onyekwere': 0.30,
  'Simeon Wilcher': 0.46,
  // offense-tilted
  'Vyctorius Miller': 0.70, 'Malik Mack': 0.72, 'Braylon Mullins': 0.74,
  'Nigel James': 0.66, 'Jaland Lowe': 0.66, 'Devin Vanterpool': 0.70,
  'Dink Pate': 0.70, 'Del Jones': 0.70, 'Tyler Perkins': 0.70,
  'Jake Fiegen': 0.72, 'Buddy Simmons': 0.70, 'Isaac Traudt': 0.72,
  'Ruben Dominguez': 0.72, 'Tru Washington': 0.66, 'Ian Jackson': 0.68,
  'Jordan Ellerbee': 0.70, 'Wes Enis': 0.64, 'Eduardo Klafke': 0.72,
  'Kareem Thomas': 0.70, 'Austin Swartz': 0.70, 'Ade Popoola': 0.66,
  'Kahmare Holmes': 0.66, 'Silas Demary Jr.': 0.62, 'Langston Love': 0.72,
};

// Per-team meta: returning-minutes share (continuity) + tempo + optional real anchor.
// anchorEM = real published preseason AdjEM to blend toward. Only 3 verifiable
// 2026-27 BartTorvik preseason ranks were retrievable (site is browser-gated):
//   UConn #10, Marquette #27, St. John's #52 -> AdjEM via the realistic rank curve
//   below. KenPom/EvanMiya don't publish preseason until fall (n/a).
const META = {
  'UConn':              { ret: 0.40, tempo: 66.5, anchorEM: 23.0 },  // Torvik #10
  "St. John's":         { ret: 0.25, tempo: 69.5, anchorEM: 10.5 },  // Torvik #52 (roster-incomplete caveat)
  'Marquette':          { ret: 0.68, tempo: 68.0, anchorEM: 15.0 },  // Torvik #27
  'Creighton':          { ret: 0.55, tempo: 67.5 },
  'Villanova':          { ret: 0.18, tempo: 64.5 },
  'Xavier':             { ret: 0.15, tempo: 68.0 },
  'Providence':         { ret: 0.06, tempo: 69.0 },
  'DePaul':             { ret: 0.38, tempo: 67.5 },
  'Seton Hall':         { ret: 0.08, tempo: 66.0 },
  'Butler':             { ret: 0.25, tempo: 65.5 },
  'Georgetown 2026-27': { ret: 0.30, tempo: 66.5 },
  'Georgetown 2026-27 (no Miller)': { ret: 0.30, tempo: 66.5 },
  'Georgetown 2025-26': { ret: 0.25, tempo: 66.5 },
};
const ANCHOR_WEIGHT = 0.5; // blend weight toward a real published anchor when present

// Global calibration: fit raw-model AdjEM -> real scale using the two "clean"
// Torvik anchors (UConn model +35.6 -> #10/+23; Marquette model +24.7 -> #27/+15).
// realEM = CAL_SLOPE*modelEM + CAL_INT. Corrects the model's hot top-end.
const CAL_SLOPE = 0.734, CAL_INT = -3.1;
// Realistic rank<->AdjEM curve: rank = RANK_A * exp(-RANK_K * AdjEM)
// fit to #10->+23 and #52->+10.5 (matches typical KenPom/Torvik distribution).
const RANK_A = 193.4, RANK_K = 0.1288;

function normalCDF(z) {
  // Abramowitz-Stegun
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

function allocateMinutes(roster) {
  const sorted = [...roster].sort((a, b) => b.overall - a.overall).slice(0, 10);
  const tmpl = MIN_TEMPLATE.slice(0, sorted.length);
  const sum = tmpl.reduce((a, b) => a + b, 0);
  const scale = 200 / sum;
  return sorted.map((p, i) => ({ ...p, min: tmpl[i] * scale }));
}

function rawTeam(roster) {
  const players = allocateMinutes(roster);
  let offEM = 0, defEM = 0, em = 0;
  const nets = [];
  for (const p of players) {
    const net = (p.overall - BASELINE) * SLOPE;
    const offShare = OFF_SHARE[p.name] ?? POS_OFF_SHARE[p.position] ?? 0.55;
    const w = p.min / 40;             // weights sum to 5
    offEM += w * net * offShare;
    defEM += w * net * (1 - offShare);
    em += w * net;
    nets.push(net);
  }
  nets.sort((a, b) => b - a);
  return { offEM, defEM, em, bestNet: nets[0], top2net: nets[0] + (nets[1] || 0) };
}

function ratings(team) {
  const meta = META[team.name] || { ret: 0.30, tempo: AVG_TEMPO };
  const r = rawTeam(team.roster);

  // Base (talent) two-sided efficiency
  const baseAdjO = AVG_EFF + O_OFFSET + r.offEM;
  const baseAdjD = AVG_EFF - D_OFFSET - r.defEM;
  const baseEM = baseAdjO - baseAdjD;

  // Methodological adjustments
  const expAdj = (meta.ret - 0.30) * 8;          // experience / returning minutes
  const talentAdj = (r.top2net - 9) * 0.25;        // top-end talent / transfers
  const starAdj = Math.max(0, r.bestNet - 5) * 0.5; // single-best-player impact
  const defAdj = (r.defEM - 1.0) * 0.5;            // defensive identity

  const cal = em => CAL_SLOPE * em + CAL_INT; // raw-model -> real scale
  const kenpom   = cal(baseEM + expAdj * 0.80 + talentAdj * 0.30);
  const torvik   = cal(baseEM + expAdj * 0.30 + talentAdj * 0.90);
  const evanmiya = cal(baseEM + expAdj * 0.20 + starAdj + defAdj);
  let consensus  = (kenpom + torvik + evanmiya) / 3;

  // Blend toward a real published anchor if provided
  if (meta.anchorEM != null) consensus = (1 - ANCHOR_WEIGHT) * consensus + ANCHOR_WEIGHT * meta.anchorEM;

  // Distribute final delta across O/D so AdjO-AdjD == consensus
  const delta = consensus - baseEM;
  const adjO = baseAdjO + delta / 2;
  const adjD = baseAdjD - delta / 2;

  const tempo = meta.tempo;
  const barthag = normalCDF((consensus * tempo / 100) / GAME_SD);
  const natRank = Math.max(1, Math.min(364, Math.round(RANK_A * Math.exp(-RANK_K * consensus))));

  return {
    name: team.name, adjO, adjD, adjEM: consensus, tempo, barthag, natRank,
    systems: { kenpom, torvik, evanmiya }, ret: meta.ret, anchored: meta.anchorEM != null,
    spread: Math.max(kenpom, torvik, evanmiya) - Math.min(kenpom, torvik, evanmiya),
  };
}

module.exports = { ratings, normalCDF, AVG_EFF, AVG_TEMPO, GAME_SD, META };
