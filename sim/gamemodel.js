// Shared game model: efficiency-vs-efficiency projection with per-team volatility.
const { ratings, volatility, normalCDF, AVG_EFF, AVG_TEMPO } = require('./metrics');

const R = new Map(), V = new Map();
function rate(team) { if (!R.has(team.name)) R.set(team.name, ratings(team)); return R.get(team.name); }
function vol(team) { if (!V.has(team.name)) V.set(team.name, volatility(team)); return V.get(team.name); }

let spare = null;
function gauss() {
  if (spare != null) { const g = spare; spare = null; return g; }
  let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random();
  const m = Math.sqrt(-2 * Math.log(u)); spare = m * Math.sin(2 * Math.PI * v);
  return m * Math.cos(2 * Math.PI * v);
}

// Combined margin SD from each team's volatility.
function gameSD(a, b) { const sa = vol(a), sb = vol(b); return Math.sqrt(sa * sa + sb * sb); }

function project(a, b, neutral) {
  const ra = rate(a), rb = rate(b);
  const poss = ra.tempo * rb.tempo / AVG_TEMPO;
  const aOE = ra.adjO * rb.adjD / AVG_EFF;
  const bOE = rb.adjO * ra.adjD / AVG_EFF;
  const hca = neutral ? 0 : 3.5;
  const ptsA = aOE * poss / 100 + hca / 2;
  const ptsB = bOE * poss / 100 - hca / 2;
  const expMargin = ptsA - ptsB;
  const sd = gameSD(a, b);
  return { expMargin, ptsA, ptsB, sd, winProbA: normalCDF(expMargin / sd), poss };
}

function simGame(a, b, neutral) {
  const p = project(a, b, neutral);
  return p.expMargin + gauss() * p.sd > 0; // true => home (a) wins
}

module.exports = { rate, vol, gauss, project, simGame, gameSD };
