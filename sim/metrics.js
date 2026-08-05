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
  // audit additions
  'Tounde Yessoufou': 0.64, 'Nolan Minessale': 0.68, 'Chance Westry': 0.50,
  'Wilson Jacques': 0.34, 'Rolyns Aligbe': 0.40, 'Trevon Carter-Givens': 0.30,
  'Abdulai Fanta Kabba': 0.30, 'Devin Williams': 0.30, 'Del Jones': 0.68,
  'Ryan Sabol': 0.74, 'Kwame Evans Jr.': 0.48, 'Devin Royal': 0.60,
};

// Per-team meta: returning-minutes share (continuity) + tempo + optional real anchor.
// anchorEM = real published preseason AdjEM to blend toward. Only 3 verifiable
// 2026-27 BartTorvik preseason ranks were retrievable (site is browser-gated):
//   UConn #10, Marquette #27, St. John's #52 -> AdjEM via the realistic rank curve
//   below. KenPom/EvanMiya don't publish preseason until fall (n/a).
const META = {
  // Anchors current to AUG 2026. UConn sits #4-5 in the newest polls (ESPN 8/3,
  // CBS v16, Rothstein) though Torvik's 7/2 top five (Duke/Florida/Houston/
  // Illinois/Arizona) is cooler on them — blended to ~#8. St. John's marked DOWN:
  // Hoops HQ's 7/20 update headlined "St. John's Tumbles" and Freeman's torn
  // Achilles (7/1) removed their #3 player.
  'UConn':              { ret: 0.40, tempo: 66.5, anchorEM: 22.0 },  // ~#8 blended (polls #4-5, Torvik cooler)
  "St. John's":         { ret: 0.25, tempo: 69.5, anchorEM: 13.5 },  // marked down: Freeman out + "SJU tumbles" 7/20
  'Marquette':          { ret: 0.68, tempo: 68.0, anchorEM: 15.0 },  // Torvik #27 (5/1 snapshot, stale)
  'Creighton':          { ret: 0.55, tempo: 67.5, anchorEM: 13.0 },  // Torvik ~#36 / 5th in BE (5/1 snapshot)
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
// --- Backtest-tuned constants (see backtest_history.js) ---
const SPREAD_MULT  = 1.7;   // widen AdjEM spread; untuned champion won 15.2 of 20 vs 18.0 actual
const LEAGUE_PIVOT = 7.0;   // approx Big East average AdjEM (pivot for the widening)
const PORTAL_PEN   = 9.0;   // AdjEM docked per unit of returning-production shortfall below 0.35

const ANCHOR_WEIGHT = 0.5; // anchored lens

// Global calibration: fit raw-model AdjEM -> real scale using the two "clean"
// Torvik anchors (UConn model +35.6 -> #10/+23; Marquette model +24.7 -> #27/+15).
// realEM = CAL_SLOPE*modelEM + CAL_INT. Corrects the model's hot top-end.
const CAL_SLOPE = 0.734, CAL_INT = -3.1;
// Realistic rank<->AdjEM curve: rank = RANK_A * exp(-RANK_K * AdjEM)
// fit to #10->+23 and #52->+10.5 (matches typical KenPom/Torvik distribution).
const RANK_A = 193.4, RANK_K = 0.1288;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function normalCDF(z) {
  // Abramowitz-Stegun
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

const { sosOverall } = require('./sos');

function allocateMinutes(roster) {
  // Apply strength-of-competition translation, then sort/allocate on adjusted grade.
  const adj = roster.map(p => ({ ...p, overall: sosOverall(p) }));
  const sorted = adj.sort((a, b) => b.overall - a.overall).slice(0, 10);
  const tmpl = MIN_TEMPLATE.slice(0, sorted.length);
  const sum = tmpl.reduce((a, b) => a + b, 0);
  const scale = 200 / sum;
  return sorted.map((p, i) => ({ ...p, min: tmpl[i] * scale }));
}

function rawTeam(roster) {
  const players = allocateMinutes(roster);
  let offEM = 0, defEM = 0, em = 0, shooterWt = 0, bigWt = 0, slasherWt = 0, totW = 0;
  const nets = [], ovrs = [];
  for (const p of players) {
    const net = (p.overall - BASELINE) * SLOPE;
    const offShare = OFF_SHARE[p.name] ?? POS_OFF_SHARE[p.position] ?? 0.55;
    const w = p.min / 40;             // weights sum to 5
    offEM += w * net * offShare;
    defEM += w * net * (1 - offShare);
    em += w * net;
    totW += w;
    if (offShare >= 0.66) shooterWt += w;                       // perimeter shooters/scorers
    if (p.position === 'C' || p.position === 'PF') bigWt += w;    // frontcourt size
    if (offShare <= 0.40 || p.position === 'C') slasherWt += w;   // rim/interior reliance
    nets.push(net); ovrs.push(p.overall);
  }
  nets.sort((a, b) => b - a); ovrs.sort((a, b) => b - a);
  const top3 = ovrs.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const depth68 = ovrs.slice(5, 8); // 6th-8th men
  const back = depth68.length ? depth68.reduce((a, b) => a + b, 0) / depth68.length : top3 - 12;
  return {
    offEM, defEM, em, bestNet: nets[0], top2net: nets[0] + (nets[1] || 0),
    shooterShare: shooterWt / totW, bigShare: bigWt / totW, slasherShare: slasherWt / totW,
    dropoff: top3 - back, rotation: players.length,
  };
}

// Per-team game-to-game volatility (points of margin SD contributed by this team).
// Combined game SD between A & B = sqrt(sigmaA^2 + sigmaB^2). Base 7.78 -> ~11 combined.
function volatility(team) {
  const meta = META[team.name] || { ret: 0.30 };
  const r = rawTeam(team.roster);
  let s = 7.78;
  s += clamp((r.shooterShare - 0.42) * 3.2, -0.7, 1.1); // 3pt reliance -> swingy
  s += clamp((r.dropoff - 7) * 0.10, -0.4, 0.8);          // thin depth -> swingy
  s -= clamp((meta.ret - 0.30) * 2.2, -0.5, 0.9);         // experience -> steady
  s -= clamp((r.bigShare - 0.40) * 1.4, -0.3, 0.5);       // size/defense -> steady
  return clamp(s, 6.7, 9.2);
}

// Four Factors (Dean Oliver), model-derived from roster composition + efficiency.
// Returned as {oEFG,oTOV,oORB,oFTR, dEFG,dTOV,dORB,dFTR} in conventional units.
function fourFactors(team) {
  const r = rawTeam(team.roster);
  const meta = META[team.name] || { ret: 0.30 };
  const rt = ratings(team);
  const oTilt = (rt.adjO - 109);  // offense above high-major baseline
  const dTilt = (99 - rt.adjD);   // defense above baseline (higher = better D)
  return {
    oEFG: 50.0 + oTilt * 0.55 + (r.shooterShare - 0.42) * 9,
    oTOV: 17.6 - (meta.ret - 0.30) * 4 - oTilt * 0.10 + (r.shooterShare - 0.42) * 2,
    oORB: 30.0 + (r.bigShare - 0.30) * 16 + oTilt * 0.05,
    oFTR: 31 + (r.slasherShare - 0.40) * 16 - (r.shooterShare - 0.42) * 6,
    dEFG: 50.0 - dTilt * 0.55,
    dTOV: 17.6 + (dTilt) * 0.20,
    dORB: 30.0 - (r.bigShare - 0.30) * 14 - dTilt * 0.15,   // lower = better (fewer opp ORB)
    dFTR: 31 - dTilt * 0.30,
  };
}

function ratings(team) {
  const meta = META[team.name] || { ret: 0.30, tempo: AVG_TEMPO };
  const r = rawTeam(team.roster);

  // Base (talent) two-sided efficiency
  const baseAdjO = AVG_EFF + O_OFFSET + r.offEM;
  const baseAdjD = AVG_EFF - D_OFFSET - r.defEM;
  const baseEM = baseAdjO - baseAdjD;

  // Methodological adjustments. expAdj coefficient raised 8 -> 13 after backtest:
  // every major public system (KenPom, ESPN BPI, EvanMiya) treats returning
  // minutes as a primary input, and 3 seasons of Big East results show continuity
  // teams hit their projection while portal rebuilds scatter.
  const expAdj = (meta.ret - 0.30) * 13;         // experience / returning minutes
  const talentAdj = (r.top2net - 9) * 0.25;        // top-end talent / transfers
  const starAdj = Math.max(0, r.bestNet - 5) * 0.5; // single-best-player impact
  const defAdj = (r.defEM - 1.0) * 0.5;            // defensive identity

  // ---- BACKTEST-DERIVED CORRECTION (see backtest_history.js) -----------------
  // Roster-sum models systematically OVERRATE portal-heavy, low-continuity teams
  // (Seton Hall '24-25: portal haul -> 2-18; Arkansas/Miami '23-24; St. John's
  // '25-26 stumbled at preseason #5). KenPom, ESPN BPI and EvanMiya all use
  // returning minutes as a primary input. History: continuity teams miss small,
  // portal teams miss huge in BOTH directions. So: penalize the mean and widen
  // the band for rosters under ~35% returning production.
  const portalPenalty = Math.max(0, 0.35 - meta.ret) * PORTAL_PEN;

  const cal = em => CAL_SLOPE * em + CAL_INT; // raw-model -> real scale
  const kenpom   = cal(baseEM + expAdj * 0.80 + talentAdj * 0.30) - portalPenalty;
  const torvik   = cal(baseEM + expAdj * 0.30 + talentAdj * 0.90) - portalPenalty;
  const evanmiya = cal(baseEM + expAdj * 0.20 + starAdj + defAdj) - portalPenalty;
  let consensus  = (kenpom + torvik + evanmiya) / 3;

  // Blend toward a real published anchor if provided
  if (meta.anchorEM != null) consensus = (1 - ANCHOR_WEIGHT) * consensus + ANCHOR_WEIGHT * meta.anchorEM;

  // Spread calibration: 3 seasons of actual Big East records show the champion
  // wins ~18 of 20 and the range top-to-bottom is ~15 wins. The untuned model
  // produced a champion at 15.2 and a range of 11.9 — too compressed. Widening
  // the AdjEM spread about a league-average pivot fixes the distribution.
  consensus = LEAGUE_PIVOT + (consensus - LEAGUE_PIVOT) * SPREAD_MULT;

  // Distribute final delta across O/D so AdjO-AdjD == consensus
  const delta = consensus - baseEM;
  const adjO = baseAdjO + delta / 2;
  const adjD = baseAdjD - delta / 2;

  const tempo = meta.tempo;
  const barthag = normalCDF((consensus * tempo / 100) / GAME_SD);
  const natRank = rankFromEM(consensus);

  return {
    name: team.name, adjO, adjD, adjEM: consensus, tempo, barthag, natRank,
    systems: { kenpom, torvik, evanmiya }, ret: meta.ret, anchored: meta.anchorEM != null,
    spread: Math.max(kenpom, torvik, evanmiya) - Math.min(kenpom, torvik, evanmiya),
  };
}

function rankFromEM(em) {
  // D1 AdjEM is approximately normal (mean 0 by construction, SD ~11) across 364
  // teams. This tracks the real distribution across the WHOLE range; the old
  // exponential fit was only valid near the top and slammed every sub-zero team
  // to #364. Ties out to anchors: +23 -> #7, +15 -> #31, 0 -> #182 (D1 avg).
  return Math.max(1, Math.min(364, Math.round(364 * (1 - normalCDF(em / 11)))));
}

module.exports = { ratings, volatility, fourFactors, rawTeam, rankFromEM, normalCDF, clamp, AVG_EFF, AVG_TEMPO, GAME_SD, META };
