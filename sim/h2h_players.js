// Player-by-player head-to-head: Georgetown vs Butler, matched by rotation rank
// (the order the model assigns minutes). Grades = production-based; stat lines
// are each player's best college/pro season (from the per-player audit).
const { BIG_EAST } = require('./bigeast');
const { GEORGETOWN_2627 } = require('./rosters');

const LINE = {
  // Georgetown
  'Vyctorius Miller': '10.8/2.7/1.8, 41.8/37.5/85.7 (Okla St)',
  'Josiah Parker': '9.8/6.0, 51.8 FG% (FAU, AAC frosh)',
  'Jaland Lowe': '16.8/4.2/5.5, 37.6/26.6/88.6 (Pitt)',
  'Luka Scuka': '9.0/5.7, ~23 mpg (German BBL)',
  'Chol Machot': '8.9/5.5/2.5 bpg, CAA DPOY (Charleston)',
  'Gabriel Landeira': '13.5/—/5.5a, GLOBL JAM MVP (Brazil NBB)',
  'Justin Caldwell': 'freshman — #123-148, 7-1 wing (HS)',
  'Caleb Williams': '4.3/3.8, 14 starts (Georgetown)',
  'Elmarko Jackson': '4.6 ppg career, post-ACL (Kansas)',
  'Kayvaun Mulready': '~7.8 mpg, deep bench (Georgetown)',
  'Athan Olivier': 'freshman — undersized PG (HS)',
  'Seal Diouf': 'depth C, minimal stats (Georgetown)',
  // Butler
  'Jalen Jackson': '19.2/3/3, 48.4/26.4 (PFW, Horizon scoring champ)',
  'Jordan Ellerbee': '13.1/3.4/2.1, ASUN All-Frosh (FGCU)',
  'Asim Djulovic': '18.2/6.5/2.0 (Serbia KLS); 13.8/4.7 (ABA)',
  'Treyson Anderson': '10.4/5.3, 35.8 3P% (NDSU, Summit)',
  'Christian Moore': '11.2/3.1, 36 3P% (The Citadel, SoCon)',
  'Herly Brutus': 'freshman — #98, 6-7 wing (HS)',
  'Drayton Jones': '6.6/4.6, 57.5 FG% (Butler)',
  'Eduardo Klafke': '4.6/2.5, ~45% 3P (Ole Miss, bench)',
  'Samis Calderon': '0.4 ppg, 66 total min (Kansas)',
  'Baron Walker': 'freshman — unranked CG (HS)',
};

const gu = [...GEORGETOWN_2627.roster].sort((a, b) => b.overall - a.overall).slice(0, 10);
const but = [...BIG_EAST.find(t => t.name === 'Butler').roster].sort((a, b) => b.overall - a.overall).slice(0, 10);

const role = ['Star/1st option', '2nd option', '3rd starter', '4th starter', '5th starter',
  '6th man', '7th', '8th', '9th', '10th'];

console.log('GEORGETOWN  vs  BUTLER  — player head-to-head (production grades)\n');
let guWins = 0, butWins = 0, guSum = 0, butSum = 0;
for (let i = 0; i < 10; i++) {
  const g = gu[i], b = but[i];
  const edge = g.overall - b.overall;
  const win = edge > 0 ? 'GU ' : edge < 0 ? 'BUT' : '== ';
  if (edge > 0) guWins++; else if (edge < 0) butWins++;
  guSum += g.overall; butSum += b.overall;
  console.log(`${role[i].padEnd(15)} ${win} ${edge >= 0 ? '+' : ''}${edge}`);
  console.log(`  GU  ${(g.name + ' (' + g.pos + ', ' + g.overall + ')').padEnd(34)} ${LINE[g.name] || ''}`);
  console.log(`  BUT ${(b.name + ' (' + b.pos + ', ' + b.overall + ')').padEnd(34)} ${LINE[b.name] || ''}`);
  console.log('');
}
console.log(`Slot wins:  Georgetown ${guWins}  |  Butler ${butWins}`);
console.log(`Top-10 grade total:  Georgetown ${guSum}  |  Butler ${butSum}  (diff ${guSum - butSum >= 0 ? '+' : ''}${guSum - butSum})`);
