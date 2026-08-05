// Scenario test: Georgetown frontcourt adds — Luka Scuka and/or Vince Iwuchukwu.
// Grades on the same opponent-adjusted scale as the rest of the league.
//   Iwuchukwu 75: 11.6/6.1 + ~2.0 bpg in the BIG EAST (Tier A), 7-1, career-high
//   25 vs Providence, 17/14 vs DePaul. Comps: Erhunmwunse 76 (BE, 6.9/8.3, 67% FG),
//   Fru 74 (ACC, 9.0/6.1). Docked slightly for availability (24 games, medical).
//   Scuka 64: German BBL 44.5/33.6, low rebounding for a 4.
const { ratings, volatility } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627, GEORGETOWN_2526 } = require('./rosters');

const M = 70;
const mk = (name, pos, overall) => ({ name, pos, overall, morale: M });
const VINCE = mk('Vince Iwuchukwu', 'C', 75);

const base = GEORGETOWN_2627.roster.filter(p => p.name !== 'Luka Scuka');
const SCEN = {
  'Neither':            base,
  '+Scuka only':        [...base, mk('Luka Scuka', 'PF', 64)],
  '+Iwuchukwu only':    [...base, VINCE],
  '+Both':              [...base, mk('Luka Scuka', 'PF', 64), VINCE],
};

function gauss() { let u=0,v=0; while(!u)u=Math.random(); while(!v)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }

function seasonRank(guRoster, N = 20000) {
  const gu = { name: 'Georgetown 2026-27', roster: guRoster };
  const teams = BIG_EAST.map(t => t.name === 'Georgetown 2026-27' ? gu : t);
  const R = new Map(), V = new Map();
  teams.forEach(t => { R.set(t.name, ratings(t)); V.set(t.name, volatility(t)); });
  const names = teams.map(t => t.name), tot = Object.fromEntries(names.map(n => [n, 0]));
  const sg = (a, b) => {
    const ra = R.get(a.name), rb = R.get(b.name);
    const poss = ra.tempo * rb.tempo / 67.5;
    const em = (ra.adjO*rb.adjD/104 - rb.adjO*ra.adjD/104) * poss/100 + 3.5;
    return em + gauss() * Math.sqrt(V.get(a.name)**2 + V.get(b.name)**2) > 0;
  };
  for (let s = 0; s < N; s++) {
    const w = Object.fromEntries(names.map(n => [n, 0]));
    for (let i = 0; i < teams.length; i++) for (let j = i+1; j < teams.length; j++) {
      if (sg(teams[i], teams[j])) w[teams[i].name]++; else w[teams[j].name]++;
      if (sg(teams[j], teams[i])) w[teams[j].name]++; else w[teams[i].name]++;
    }
    for (const n of names) tot[n] += w[n];
  }
  const rows = names.map(n => ({ n, avg: tot[n]/N })).sort((a,b) => b.avg - a.avg);
  const idx = rows.findIndex(r => r.n === 'Georgetown 2026-27');
  return { rank: idx+1, wins: rows[idx].avg, above: rows[idx-1]?.n, below: rows[idx+1]?.n };
}

function h2h(guRoster, opp) {
  const gu = { name: 'Georgetown 2026-27', roster: guRoster };
  const rg = ratings(gu), ro = ratings(opp);
  const poss = rg.tempo * ro.tempo / 67.5;
  const em = (rg.adjO*ro.adjD/104 - ro.adjO*rg.adjD/104) * poss/100;
  const sd = Math.sqrt(volatility(gu)**2 + volatility(opp)**2);
  const z = em/sd, t = 1/(1+0.2316419*Math.abs(z)), d = 0.3989423*Math.exp(-z*z/2);
  let pr = d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
  return ((z>0 ? 1-pr : pr)*100);
}
const PROV = BIG_EAST.find(t => t.name === 'Providence');
const BUT  = BIG_EAST.find(t => t.name === 'Butler');
const SHU  = BIG_EAST.find(t => t.name === 'Seton Hall');

console.log('GEORGETOWN FRONTCOURT SCENARIOS (opponent-adjusted production model)\n');
console.log('  Scenario          AdjEM   NatRk  BE Rk  Conf W-L    vs GU25-26  vs Butler  vs SetonHall  vs Prov');
console.log('  ' + '-'.repeat(100));
for (const [label, roster] of Object.entries(SCEN)) {
  const gu = { name: 'Georgetown 2026-27', roster };
  const r = ratings(gu);
  const s = seasonRank(roster);
  console.log(`  ${label.padEnd(17)} ${(r.adjEM>=0?'+':'')+r.adjEM.toFixed(1).padStart(5)}  ${('#'+r.natRank).padStart(5)}  ${('#'+s.rank).padStart(5)}  ` +
    `${(s.wins.toFixed(1)+'-'+(20-s.wins).toFixed(1)).padEnd(10)}  ` +
    `${h2h(roster, GEORGETOWN_2526).toFixed(1).padStart(5)}%     ` +
    `${h2h(roster, BUT).toFixed(1).padStart(5)}%     ` +
    `${h2h(roster, SHU).toFixed(1).padStart(5)}%       ` +
    `${h2h(roster, PROV).toFixed(1).padStart(5)}%`);
}
console.log('\n  (Iwuchukwu graded 75 — would instantly be Georgetown\'s best player; next best is Miller at 68.)');
