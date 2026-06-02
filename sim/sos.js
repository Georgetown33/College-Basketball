// ============================================================================
// sos.js — STRENGTH-OF-COMPETITION translation layer.
// Each player's grade reflects their prior production; this discounts that
// production by the LEVEL they produced against, since numbers don't translate
// 1:1 when stepping up to the Big East. One-directional: only DISCOUNTS players
// coming from weaker leagues. High-major producers, returning Big East players,
// and freshmen (whose grades are already projections) get no haircut.
//
// adjusted = 50 + (overall - 50) * factor      (pivot at replacement level 50,
// so the same league discount costs a bigger producer more absolute points).
// ============================================================================

// Tier -> translation factor (vs Big East / high-major competition).
const FACTOR = {
  HM:  1.00,  // high-major (B1G/SEC/Big12/ACC/Big East), proven or limited
  RET: 1.00,  // returning Big East player — produced AT this level already
  FR:  1.00,  // freshman/HS recruit — grade is a projection, not translated
  T2:  0.95,  // AAC / A-10 / Mountain West / WCC — strong mid/high
  MID: 0.89,  // MVC / Ivy / MAC / Big South / CAA / C-USA / Sun Belt
  LOW: 0.84,  // SoCon / Summit / ASUN / WAC / Patriot / JUCO
  INTL: 0.90, // international pro (Euro leagues / G-League) — high variance
};

// Player -> prior-competition tier (rotation players across the 11 Big East teams).
// Unlisted players default to HM (true high-majors / freshmen already 1.0).
const TIER = {
  // UConn
  'Nils Machowski': 'LOW',
  // St. John's
  'Quinn Ellis': 'INTL', 'Kyle Cuffe Jr.': 'LOW', 'Lazar Stojkovic': 'INTL',
  'Babacar Sane': 'INTL', 'Theo Edema': 'FR', 'Djordije Jovanovic': 'INTL',
  // Villanova
  'Jake Fiegen': 'MID', 'Buddy Simmons': 'T2', 'Elijah Crawford': 'MID',
  // DePaul
  'Magoon Gwath': 'T2', 'Ade Popoola': 'T2', 'Kahmare Holmes': 'LOW',
  'Koree Cotton': 'LOW', 'Wilson Jacques': 'T2',
  // Providence
  'Miles Byrd': 'T2', 'Devin Vanterpool': 'T2', 'Ryan Sabol': 'MID',
  'Dink Pate': 'INTL', 'Gavin Hightower': 'T2', 'Samson Aletan': 'MID',
  'Leonardo Marangon': 'INTL',
  // Georgetown
  'Josiah Parker': 'T2', 'Luka Scuka': 'INTL', 'Chol Machot': 'MID',
  'Gabriel Landeira': 'INTL',
  // Seton Hall
  'Del Jones': 'LOW', 'Kareem Thomas': 'MID', 'Devin Williams': 'T2',
  'Rodney Brown Jr.': 'T2', 'Mayar Wol': 'MID', 'Abdulai Fanta Kabba': 'LOW',
  // Butler
  'Jordan Ellerbee': 'LOW', 'Asim Djulovic': 'INTL', 'Christian Moore': 'LOW',
  'Treyson Anderson': 'LOW',
  // Marquette
  'Nolan Minessale': 'LOW',
  // Creighton
  'Wes Enis': 'T2', 'BJ Davis': 'T2',
  // Xavier
  'Chance Westry': 'T2', 'Rolyns Aligbe': 'MID',
  // returners explicitly tagged (no discount; documents intent)
  'Braylon Mullins': 'RET', 'Ian Jackson': 'RET', 'Nigel James': 'RET',
  'Jovan Milicevic': 'RET', 'Caleb Williams': 'RET',
};

// Disabled: grades are now PRODUCTION-based (agents already discounted each
// player's output for level of competition), so applying SOS again would
// double-count. Kept for reference / non-production grade sets.
const SOS_ENABLED = false;

function sosOverall(player) {
  if (!SOS_ENABLED) return player.overall;
  const tier = TIER[player.name] || 'HM';
  const f = FACTOR[tier];
  if (f === 1.0) return player.overall;
  return Math.round(50 + (player.overall - 50) * f);
}

module.exports = { sosOverall, TIER, FACTOR };
