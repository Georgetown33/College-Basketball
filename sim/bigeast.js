// 2026-27 Big East rosters — OPPONENT-ADJUSTED production grades from an 11-team
// advanced-analytics audit: each player's efficiency (TS%/eFG%/PER/WS), usage,
// and role, discounted by the LEVEL of competition faced. Grades reward efficient
// production vs strong opponents; punish empty volume and weak-league stats.
// SOS layer disabled and Torvik anchors disabled (ANCHOR_WEIGHT=0) so the ranking
// is purely bottom-up player analytics. Georgetown lives in rosters.js.

const { GEORGETOWN_2627 } = require('./rosters');

const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });

const BIG_EAST = [
  // Demary (All-BE + All-Def, led BE assists) the standout; Hines elite per-min rim protection.
  { name: 'UConn', roster: [
    p('Silas Demary Jr.', 'PG', 80), p('Braylon Mullins', 'SG', 75),
    p('Najai Hines', 'C', 73), p('Nikolas Khamenia', 'SF', 68),
    p('Nils Machowski', 'SG', 66), p('Colben Landrew', 'SF', 66),
    p('Jayden Ross', 'SF', 65), p('Oskar Giltay', 'C', 63),
    p('Junior County', 'PG', 62),
  ]},
  // Yessoufou (80) + Jackson (77) + Freeman (74) — best proven Tier-A scoring trio in the league.
  { name: "St. John's", roster: [
    p('Tounde Yessoufou', 'SG', 80), p('Ian Jackson', 'SG', 77),
    p('Donnie Freeman', 'SF', 74), p('Quinn Ellis', 'PG', 72),
    p('Babacar Sane', 'PF', 66), p('Ruben Prey', 'C', 63),
    p('Kyle Cuffe Jr.', 'PG', 62), p('Djordije Jovanovic', 'SF', 62),
    p('Lazar Stojkovic', 'C', 60), p('Theo Edema', 'C', 58),
  ]},
  // Two efficient Big Ten bigs (Evans/Royal) + proven BE scorer Perkins. Deep, balanced.
  { name: 'Villanova', roster: [
    p('Kwame Evans Jr.', 'PF', 80), p('Devin Royal', 'SF', 77),
    p('Tyler Perkins', 'SG', 75), p('Jake Fiegen', 'SG', 71),
    p('Buddy Simmons', 'SF', 70), p('Matt Hodge', 'SG', 68),
    p('Elijah Crawford', 'PG', 67), p('Adam Oumiddoch', 'SG', 62),
    p('Nico Onyekwere', 'C', 58),
  ]},
  // Gwath (80, elite defensive metrics) carries it; Popoola most efficient (AAC-leading 3P%).
  { name: 'DePaul', roster: [
    p('Magoon Gwath', 'C', 80), p('Ade Popoola', 'SF', 71),
    p('Kahmare Holmes', 'SF', 70), p('Koree Cotton', 'SG', 68),
    p('Wilson Jacques', 'PF', 66), p('Layden Blocker', 'PG', 66),
    p('Noah Meeusen', 'SG', 65), p('Kruz McClure', 'SF', 60),
    p('Fabian Flores', 'C', 58),
  ]},
  // Mack (BE) + Byrd (elite two-way D) lead a deep, balanced, no-star group.
  { name: 'Providence', roster: [
    p('Malik Mack', 'PG', 75), p('Miles Byrd', 'SG', 74),
    p('Devin Vanterpool', 'SG', 71), p('Arrinten Page', 'C', 70),
    p('Ryan Mela', 'SG', 70), p('Ryan Sabol', 'SG', 68),
    p('Dink Pate', 'SG', 66), p('Samson Aletan', 'C', 63),
    p('Gavin Hightower', 'PG', 61), p('Leonardo Marangon', 'SF', 60),
  ]},
  // --- Georgetown (opponent-adjusted grades, in rosters.js) ---
  GEORGETOWN_2627,
  // Williams (AAC rim protection) + Del Jones + Brown lead; deep but mid/low-major sourced.
  { name: 'Seton Hall', roster: [
    p('Devin Williams', 'C', 71), p('Del Jones', 'PG', 70),
    p('Rodney Brown Jr.', 'SF', 70), p('Mayar Wol', 'PF', 69),
    p('Kareem Thomas', 'SG', 68), p('Roddie Anderson III', 'PG', 64),
    p('Simeon Wilcher', 'SG', 63), p('Abdulai Fanta Kabba', 'C', 62),
    p('Trey Parker', 'PG', 60), p('Chris Nwuli', 'PF', 58),
  ]},
  // Djulovic (ABA pro) top; cluster of low-major producers, high-major guys barely played.
  { name: 'Butler', roster: [
    p('Asim Djulovic', 'PF', 70), p('Jalen Jackson', 'PG', 68),
    p('Drayton Jones', 'C', 67), p('Jordan Ellerbee', 'SG', 67),
    p('Treyson Anderson', 'PF', 65), p('Herly Brutus', 'SF', 63),
    p('Eduardo Klafke', 'SG', 62), p('Baron Walker', 'SF', 60),
    p('Samis Calderon', 'PF', 59), p('Christian Moore', 'SF', 58),
  ]},
  // Nigel James (80) the headline; Parham best EvanMiya BPR on team. Minessale volume Tier-D discounted.
  { name: 'Marquette', roster: [
    p('Nigel James', 'PG', 80), p('Sananda Fru', 'C', 74),
    p('Royce Parham', 'PF', 73), p('Adrien Stevens', 'SG', 71),
    p('Nolan Minessale', 'PG', 69), p('Damarius Owens', 'SG', 63),
    p('Alex Egbuonu', 'PF', 62), p('Ethan Johnston', 'SF', 59),
    p('Nash Walker', 'SG', 58), p('Michael Phillips', 'SF', 58),
  ]},
  // Erhunmwunse (76, elite TS rim-runner, BE-tested) + Enis + Swartz; deepest efficient core.
  { name: 'Creighton', roster: [
    p('Oswin Erhunmwunse', 'C', 76), p('Wes Enis', 'PG', 74),
    p('Austin Swartz', 'SG', 73), p('Jasen Green', 'PF', 71),
    p('BJ Davis', 'PG', 70), p('Jackson McAndrew', 'SF', 66),
    p('Isaac Traudt', 'SF', 65), p('Kayden Edwards', 'SG', 63),
    p('Hudson Greer', 'SG', 61), p('Trevon Carter-Givens', 'C', 59),
  ]},
  // Nwoko (80, 61% FG) + Milicevic (78, 43% 3PT) — most efficient Tier-A duo in the league.
  { name: 'Xavier', roster: [
    p('Michael Nwoko', 'C', 80), p('Jovan Milicevic', 'PF', 78),
    p('Chance Westry', 'PG', 73), p('Tru Washington', 'SG', 72),
    p('Ruben Dominguez', 'SG', 71), p('Rolyns Aligbe', 'PF', 64),
    p('Gabriel Pozzato', 'SF', 62), p('Kalek House', 'PG', 60),
    p('Asher Elson', 'SF', 60), p('Kason Westphal', 'C', 52),
  ]},
];

module.exports = { BIG_EAST };
