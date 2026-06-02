// 2026-27 Big East rosters with PRODUCTION-BASED grades from an 11-team,
// player-by-player audit of each player's actual college output (best season,
// adjusted for level of competition) + recruiting profiles for freshmen.
// Grades already embed the competition discount, so the SOS layer is disabled.
// Georgetown lives in rosters.js.

const { GEORGETOWN_2627 } = require('./rosters');

const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });

const BIG_EAST = [
  // Demary/Mullins proven; rest pedigree-over-production. Machowski SoCon-discounted.
  { name: 'UConn', roster: [
    p('Silas Demary Jr.', 'PG', 77), p('Braylon Mullins', 'SG', 76),
    p('Nils Machowski', 'SG', 70), p('Najai Hines', 'C', 68),
    p('Nikolas Khamenia', 'SF', 66), p('Colben Landrew', 'SF', 66),
    p('Junior County', 'PG', 62), p('Jayden Ross', 'SF', 62),
    p('Oskar Giltay', 'C', 60),
  ]},
  // Yessoufou (82) + Freeman (78) the league's best proven scoring duo; depth unproven/intl.
  { name: "St. John's", roster: [
    p('Tounde Yessoufou', 'SG', 82), p('Donnie Freeman', 'SF', 78),
    p('Quinn Ellis', 'PG', 74), p('Ian Jackson', 'SG', 70),
    p('Babacar Sane', 'PF', 66), p('Kyle Cuffe Jr.', 'PG', 62),
    p('Theo Edema', 'C', 62), p('Ruben Prey', 'C', 60),
    p('Lazar Stojkovic', 'C', 60), p('Djordije Jovanovic', 'SF', 58),
  ]},
  // Deep, proven (Big Ten + productive mid-majors). No star, five 71+ producers.
  { name: 'Villanova', roster: [
    p('Devin Royal', 'SF', 76), p('Kwame Evans Jr.', 'PF', 75),
    p('Buddy Simmons', 'SF', 74), p('Jake Fiegen', 'SG', 72),
    p('Elijah Crawford', 'PG', 71), p('Matt Hodge', 'SG', 67),
    p('Tyler Perkins', 'SG', 64), p('Adam Oumiddoch', 'SG', 63),
    p('Nico Onyekwere', 'C', 58),
  ]},
  // Gwath elite defensively (modest scoring); Holmes/Cotton productive mid-major scorers.
  { name: 'DePaul', roster: [
    p('Magoon Gwath', 'C', 78), p('Kahmare Holmes', 'SF', 73),
    p('Koree Cotton', 'SG', 70), p('Layden Blocker', 'PG', 69),
    p('Ade Popoola', 'SF', 67), p('Wilson Jacques', 'PF', 66),
    p('Noah Meeusen', 'SG', 63), p('Kruz McClure', 'SF', 60),
    p('Fabian Flores', 'C', 58),
  ]},
  // Mack (Big East) + Byrd proven; deep, balanced, no high-end scorer.
  { name: 'Providence', roster: [
    p('Malik Mack', 'PG', 76), p('Miles Byrd', 'SG', 75),
    p('Devin Vanterpool', 'SG', 72), p('Arrinten Page', 'C', 71),
    p('Ryan Mela', 'SG', 70), p('Ryan Sabol', 'SG', 69),
    p('Dink Pate', 'SG', 67), p('Samson Aletan', 'C', 65),
    p('Leonardo Marangon', 'SF', 64), p('Gavin Hightower', 'PG', 61),
  ]},
  // --- Georgetown (production-graded, in rosters.js) ---
  GEORGETOWN_2627,
  // Del Jones (17.2 Big South) leads; deep but all mid/low-major production, no proven BE scorer.
  { name: 'Seton Hall', roster: [
    p('Del Jones', 'PG', 74), p('Devin Williams', 'C', 72),
    p('Rodney Brown Jr.', 'SF', 72), p('Roddie Anderson III', 'PG', 71),
    p('Kareem Thomas', 'SG', 70), p('Simeon Wilcher', 'SG', 68),
    p('Mayar Wol', 'PF', 67), p('Trey Parker', 'PG', 62),
    p('Abdulai Fanta Kabba', 'C', 61), p('Chris Nwuli', 'PF', 60),
  ]},
  // No proven high-major production; top end is a cluster of mid/low-major scorers.
  { name: 'Butler', roster: [
    p('Jalen Jackson', 'PG', 74), p('Jordan Ellerbee', 'SG', 71),
    p('Asim Djulovic', 'PF', 70), p('Treyson Anderson', 'PF', 69),
    p('Christian Moore', 'SF', 66), p('Herly Brutus', 'SF', 65),
    p('Drayton Jones', 'C', 64), p('Eduardo Klafke', 'SG', 63),
    p('Samis Calderon', 'PF', 58), p('Baron Walker', 'SF', 58),
  ]},
  // Nigel James (84) is the league's best player; most returning production in the BE.
  { name: 'Marquette', roster: [
    p('Nigel James', 'PG', 84), p('Sananda Fru', 'C', 72),
    p('Nolan Minessale', 'PG', 70), p('Adrien Stevens', 'SG', 69),
    p('Royce Parham', 'PF', 68), p('Alex Egbuonu', 'PF', 65),
    p('Ethan Johnston', 'SF', 61), p('Damarius Owens', 'SG', 60),
    p('Nash Walker', 'SG', 60), p('Michael Phillips', 'SF', 58),
  ]},
  // Deep, balanced, proven returners + Big East-tested Erhunmwunse. Enis the lead scorer.
  { name: 'Creighton', roster: [
    p('Wes Enis', 'PG', 74), p('Oswin Erhunmwunse', 'C', 73),
    p('Austin Swartz', 'SG', 72), p('Jasen Green', 'PF', 71),
    p('BJ Davis', 'PG', 71), p('Jackson McAndrew', 'SF', 68),
    p('Isaac Traudt', 'SF', 65), p('Trevon Carter-Givens', 'C', 63),
    p('Kayden Edwards', 'SG', 60), p('Hudson Greer', 'SG', 60),
  ]},
  // Four proven high-major starters (Westry/Nwoko/Milicevic/Washington) — deepest proven core.
  { name: 'Xavier', roster: [
    p('Chance Westry', 'PG', 75), p('Michael Nwoko', 'C', 75),
    p('Jovan Milicevic', 'PF', 73), p('Tru Washington', 'SG', 72),
    p('Ruben Dominguez', 'SG', 70), p('Rolyns Aligbe', 'PF', 66),
    p('Gabriel Pozzato', 'SF', 64), p('Kalek House', 'PG', 63),
    p('Asher Elson', 'SF', 63), p('Kason Westphal', 'C', 58),
  ]},
];

module.exports = { BIG_EAST };
