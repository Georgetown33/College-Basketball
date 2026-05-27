// Extracted from index.html (College Basketball Dynasty Simulator).
// teamRating + simulateGame are copied faithfully from SimEngine so that
// win probabilities reflect the actual game's math. Players are real rosters
// with hand-assigned `overall` scouting grades (30-99 scale) and a few key
// box-score attributes. teamRating depends only on overall + depth + morale.

const Utils = {
  rand: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  randFloat: (min, max) => Math.random() * (max - min) + min,
  clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
};

// --- faithful copy of SimEngine.teamRating ---
function teamRating(roster) {
  const active = roster.filter(p => !p.injured);
  if (active.length === 0) return 30;
  const sorted = [...active].sort((a, b) => b.overall - a.overall);
  const top8 = sorted.slice(0, Math.min(8, sorted.length));
  const avg = top8.reduce((s, p) => s + p.overall, 0) / top8.length;
  const depth = Math.min(active.length / 10, 1) * 5;
  const morale = top8.reduce((s, p) => s + (p.morale ?? 70), 0) / top8.length / 20;
  return Math.round(avg + depth + morale);
}

// --- faithful copy of SimEngine.simulateGame (coach/facility bonuses = 0; roster-only) ---
function simulateGame(home, away, neutral = false) {
  const homeRating = teamRating(home.roster);
  const awayRating = teamRating(away.roster);
  const homeAdv = neutral ? 0 : 3;
  const homePower = homeRating + homeAdv + Utils.randFloat(-8, 8);
  const awayPower = awayRating + Utils.randFloat(-8, 8);
  const homeWin = homePower > awayPower;
  const diff = Math.abs(homePower - awayPower);
  const basePts = Utils.rand(60, 85);
  let finalHome = Utils.clamp(homeWin ? basePts + Utils.rand(0, Math.round(diff * 1.5)) : basePts - Utils.rand(0, Math.round(diff)), 45, 110);
  let finalAway = Utils.clamp(homeWin ? basePts - Utils.rand(0, Math.round(diff)) : basePts + Utils.rand(0, Math.round(diff * 1.5)), 45, 110);
  if (homeWin && finalHome <= finalAway) finalHome = finalAway + Utils.rand(1, 6);
  if (!homeWin && finalAway <= finalHome) finalAway = finalHome + Utils.rand(1, 6);
  if (finalHome === finalAway) { if (homeWin) finalHome++; else finalAway++; }
  return { homeWin, finalHome, finalAway, diff };
}

module.exports = { Utils, teamRating, simulateGame };
