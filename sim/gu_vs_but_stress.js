// Is Butler > Georgetown defensible? Stress-test the assumption that drives it.
const { ratings, volatility } = require('./metrics');
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627 } = require('./rosters');
const BUT = BIG_EAST.find(t=>t.name==='Butler');

// Where each player's production actually came from.
const SRC = {
  // Butler — every top piece is low-major or non-NCAA
  'Asim Djulovic':'Serbia KLS / ABA (non-NCAA pro)','Jalen Jackson':'Purdue Ft Wayne (HORIZON) 19.2ppg',
  'Drayton Jones':'South Carolina St (MEAC) 13.0/5.5','Jordan Ellerbee':'FGCU (ASUN) 13.1 frosh',
  'Treyson Anderson':'North Dakota St (SUMMIT) 10.4/5.3','Herly Brutus':'HS 4-star (no college)',
  'Eduardo Klafke':'Ole Miss (SEC) 4.6ppg bench','Samu Adler':'intl/unproven','Kevin Ndzie':'intl/unproven',
  'Marko Maric':'intl/unproven','Baron Walker':'HS unranked','Samis Calderon':'Kansas 0.4ppg (66 min)',
  'Christian Moore':'The Citadel (SOCON) 11.2',
  // Georgetown — three genuine high-major résumés
  'Vyctorius Miller':'Oklahoma St (BIG 12) 10.8','Josiah Parker':'FAU (AAC) 9.8/6.0 frosh',
  'Jaland Lowe':'Pitt (ACC) 16.8/5.5 — 50.5% TS','Chol Machot':'Charleston (CAA) DPOY 2.5blk',
  'Caleb Williams':'Georgetown (BIG EAST) 4.3/3.8','Gabriel Landeira':'Brazil NBB','Elmarko Jackson':'Kansas (BIG12) 4.6 career',
  'Pedro Pastre':'Brazil NBB','Justin Caldwell':'HS','Kayvaun Mulready':'Georgetown (BIG EAST) bench',
  'Seal Diouf':'Georgetown (BIG EAST) redshirt','Athan Olivier':'HS',
};
const top=(t,n=8)=>[...t.roster].sort((a,b)=>b.overall-a.overall).slice(0,n);
console.log('WHERE THE PRODUCTION CAME FROM (top 8 each)\n');
console.log('  GEORGETOWN                                    | BUTLER');
console.log('  '+'-'.repeat(100));
const g=top(GEORGETOWN_2627), b=top(BUT);
for(let i=0;i<8;i++){
  const L=`${g[i].overall} ${g[i].name.padEnd(17)} ${(SRC[g[i].name]||'').slice(0,24).padEnd(24)}`;
  const R=`${b[i].overall} ${b[i].name.padEnd(17)} ${(SRC[b[i].name]||'').slice(0,30)}`;
  console.log('  '+L+' | '+R);
}
const avg=a=>a.reduce((s,p)=>s+p.overall,0)/a.length;
console.log(`\n  Top-5 avg grade:  GU ${avg(g.slice(0,5)).toFixed(1)}  |  BUT ${avg(b.slice(0,5)).toFixed(1)}   (gap ${(avg(b.slice(0,5))-avg(g.slice(0,5))).toFixed(1)} to Butler)`);
console.log(`  Top-8 avg grade:  GU ${avg(g).toFixed(1)}  |  BUT ${avg(b).toFixed(1)}   (gap ${(avg(b)-avg(g)).toFixed(1)} to Butler)`);

// ---- SENSITIVITY: how hard does low-major production really translate? -------
// Apply an extra discount to non-high-major production and see when GU passes Butler.
const LOWMAJOR = new Set(['Asim Djulovic','Jalen Jackson','Drayton Jones','Jordan Ellerbee',
  'Treyson Anderson','Christian Moore','Samu Adler','Kevin Ndzie','Marko Maric']);
const GU_MIDMAJOR = new Set(['Josiah Parker','Chol Machot','Gabriel Landeira','Pedro Pastre']);

function shift(team, set, pts){
  return {name:team.name, roster:team.roster.map(p=> set.has(p.name)?{...p,overall:p.overall+pts}:p)};
}
console.log('\n\nSENSITIVITY — extra discount applied to LOW-MAJOR/non-NCAA production');
console.log('(Butler\'s entire top 6 is Horizon/MEAC/ASUN/Summit/Serbian. Georgetown\'s is Big12/ACC/AAC/CAA.)\n');
console.log('  extra low-major discount |  Butler AdjEM   Georgetown AdjEM   gap');
console.log('  '+'-'.repeat(66));
for(const d of [0,-1,-2,-3,-4,-5]){
  const B=ratings(shift(BUT,LOWMAJOR,d)).adjEM;
  const G=ratings(GEORGETOWN_2627).adjEM;
  const flag = G>B ? '  <-- Georgetown passes Butler' : '';
  console.log(`  ${String(d).padStart(11)} pts        | ${B.toFixed(1).padStart(9)} ${G.toFixed(1).padStart(15)} ${(G-B).toFixed(1).padStart(9)}${flag}`);
}
// ---- SENSITIVITY 2: is Lowe under-graded? -----------------------------------
console.log('\n\nSENSITIVITY — is Jaland Lowe (64) too harshly graded?');
console.log('He put up 16.8 ppg / 5.5 apg in the ACC. Butler has NOBODY with high-major production.\n');
console.log('  Lowe grade |  Georgetown AdjEM   vs Butler');
console.log('  '+'-'.repeat(48));
const B0=ratings(BUT).adjEM;
for(const lg of [64,67,70,73,76]){
  const gu={name:'Georgetown 2026-27',roster:GEORGETOWN_2627.roster.map(p=>p.name==='Jaland Lowe'?{...p,overall:lg}:p)};
  const G=ratings(gu).adjEM;
  console.log(`  ${String(lg).padStart(10)} | ${G.toFixed(1).padStart(15)} ${(G-B0>0?'+':'')+(G-B0).toFixed(1).padStart(10)}${G>B0?'  <-- passes Butler':''}`);
}
