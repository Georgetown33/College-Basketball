// Projected 2026-27 Big East rosters, calibrated to a full 11-team agent audit
// (one agent per team) against April/May 2026 sources. Grades use anchors:
//   84 Demary / 82 N.James / 81 Yessoufou / 80 I.Jackson / 76 Gwath — and were
// deflated where audits flagged unproven role players. Georgetown lives in
// rosters.js (uses the audited grades there).

const { GEORGETOWN_2627 } = require('./rosters');

const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });

const BIG_EAST = [
  // Elite — AP/CBS top-5 (Mullins withdrew from draft; Solo Ball out all yr).
  // Audit: trimmed Khamenia/Ross/Giltay/County (unproven), bumped Hines (elite shot-blocker).
  { name: 'UConn', roster: [
    p('Silas Demary Jr.', 'PG', 84), p('Braylon Mullins', 'SG', 83),
    p('Najai Hines', 'C', 74), p('Nikolas Khamenia', 'SF', 71),
    p('Nils Machowski', 'SG', 70), p('Jayden Ross', 'SF', 69),
    p('Colben Landrew', 'SF', 69), p('Oskar Giltay', 'C', 63),
    p('Junior County', 'PG', 61),
  ]},
  // NCAA lock — MAJOR audit add: Tounde Yessoufou (withdrew from draft, elite).
  // Trimmed unproven international bigs (Edema/Stojkovic/Sane/Brown/Jovanovic).
  { name: "St. John's", roster: [
    p('Tounde Yessoufou', 'SG', 81), p('Ian Jackson', 'SG', 80),
    p('Donnie Freeman', 'SF', 74), p('Quinn Ellis', 'PG', 74),
    p('Kyle Cuffe Jr.', 'PG', 72), p('Ruben Prey', 'C', 68),
    p('Lazar Stojkovic', 'C', 64), p('Babacar Sane', 'PF', 64),
    p('Theo Edema', 'C', 62), p('Djordije Jovanovic', 'SF', 60),
  ]},
  // Audit: bumped Big Ten transfers Evans/Royal/Simmons; center spot still a hole.
  { name: 'Villanova', roster: [
    p('Kwame Evans Jr.', 'PF', 76), p('Devin Royal', 'SF', 75),
    p('Tyler Perkins', 'SG', 74), p('Buddy Simmons', 'SF', 74),
    p('Jake Fiegen', 'SG', 73), p('Elijah Crawford', 'PG', 70),
    p('Matt Hodge', 'SG', 68), p('Adam Oumiddoch', 'SG', 65),
    p('Nico Onyekwere', 'C', 64),
  ]},
  // Audit: Meeusen down (5.9 ppg at ASU), Cotton up. Gwath remains the ceiling.
  { name: 'DePaul', roster: [
    p('Magoon Gwath', 'C', 76), p('Layden Blocker', 'PG', 71),
    p('Ade Popoola', 'SF', 71), p('Kahmare Holmes', 'SF', 70),
    p('Koree Cotton', 'SG', 70), p('Wilson Jacques', 'PF', 69),
    p('Kruz McClure', 'SF', 67), p('Noah Meeusen', 'SG', 64),
    p('Fabian Flores', 'C', 63),
  ]},
  // Audit: Byrd down (10.4 ppg, defense-first), Sabol up (18.8 ppg Buffalo), +Marangon. Zero continuity.
  { name: 'Providence', roster: [
    p('Malik Mack', 'PG', 73), p('Miles Byrd', 'SG', 73),
    p('Arrinten Page', 'C', 72), p('Devin Vanterpool', 'SG', 71),
    p('Ryan Sabol', 'SG', 70), p('Dink Pate', 'SG', 68),
    p('Samson Aletan', 'C', 67), p('Gavin Hightower', 'PG', 67),
    p('Ryan Mela', 'SG', 67), p('Leonardo Marangon', 'SF', 63),
  ]},
  // --- Georgetown (audited roster from rosters.js) ---
  GEORGETOWN_2627,
  // Audit: Del Jones up (17.2 ppg), Wilcher/Anderson down (buried at prev schools), +Kabba.
  { name: 'Seton Hall', roster: [
    p('Del Jones', 'PG', 73), p('Simeon Wilcher', 'SG', 68),
    p('Kareem Thomas', 'SG', 67), p('Roddie Anderson III', 'PG', 67),
    p('Devin Williams', 'C', 66), p('Rodney Brown Jr.', 'SF', 62),
    p('Mayar Wol', 'PF', 62), p('Chris Nwuli', 'PF', 62),
    p('Trey Parker', 'PG', 62), p('Abdulai Fanta Kabba', 'C', 58),
  ]},
  // Audit: heavy deflation — only 2 returners, low-major/bench transfers, new HC. No starter tier.
  { name: 'Butler', roster: [
    p('Jordan Ellerbee', 'SG', 70), p('Jalen Jackson', 'PG', 68),
    p('Drayton Jones', 'C', 64), p('Herly Brutus', 'SF', 64),
    p('Eduardo Klafke', 'SG', 62), p('Asim Djulovic', 'PF', 62),
    p('Christian Moore', 'SF', 61), p('Treyson Anderson', 'PF', 58),
    p('Samis Calderon', 'PF', 57), p('Baron Walker', 'SF', 57),
  ]},
  // NCAA lock — most returning minutes in league. Audit: James to elite tier, Minessale way up (All-Summit).
  { name: 'Marquette', roster: [
    p('Nigel James', 'PG', 82), p('Nolan Minessale', 'PG', 74),
    p('Sananda Fru', 'C', 74), p('Royce Parham', 'PF', 72),
    p('Adrien Stevens', 'SG', 71), p('Damarius Owens', 'SG', 70),
    p('Alex Egbuonu', 'PF', 67), p('Ethan Johnston', 'SF', 66),
    p('Nash Walker', 'SG', 66), p('Michael Phillips', 'SF', 61),
  ]},
  // NCAA lock — new HC Huss. Audit: Enis up (16 ppg), trimmed unproven Edwards/Greer/Rosa, +Carter-Givens.
  { name: 'Creighton', roster: [
    p('Wes Enis', 'PG', 76), p('Jasen Green', 'PF', 72),
    p('Isaac Traudt', 'SF', 71), p('BJ Davis', 'PG', 70),
    p('Austin Swartz', 'SG', 70), p('Jackson McAndrew', 'SF', 70),
    p('Oswin Erhunmwunse', 'C', 69), p('Trevon Carter-Givens', 'C', 64),
    p('Kayden Edwards', 'SG', 64), p('Hudson Greer', 'SG', 64),
  ]},
  // "Won the portal" — near-total overhaul. Audit: Westry materially up (15.5/5.5 lead guard), +Aligbe.
  { name: 'Xavier', roster: [
    p('Chance Westry', 'PG', 76), p('Michael Nwoko', 'C', 75),
    p('Jovan Milicevic', 'PF', 74), p('Tru Washington', 'SG', 72),
    p('Ruben Dominguez', 'SG', 72), p('Rolyns Aligbe', 'PF', 70),
    p('Gabriel Pozzato', 'SF', 68), p('Kalek House', 'PG', 64),
    p('Kason Westphal', 'C', 64), p('Asher Elson', 'SF', 62),
  ]},
];

module.exports = { BIG_EAST };
