// Projected 2026-27 Big East rosters, calibrated to verified late-May-2026
// commitments (returners + portal IN, accounting for portal OUT / draft /
// graduation). Grades are PROJECTIONS. Georgetown uses the verified REAL
// roster from rosters.js (no Vyctorius Miller — he never committed).

const { GEORGETOWN_2627 } = require('./rosters');

const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });

const BIG_EAST = [
  // Elite — AP #4 / KenPom #5 / CBS #2
  { name: 'UConn', roster: [
    p('Silas Demary Jr.', 'PG', 84), p('Braylon Mullins', 'SG', 83),
    p('Nikolas Khamenia', 'SF', 76), p('Jayden Ross', 'SF', 73),
    p('Najai Hines', 'C', 72), p('Oskar Gitay', 'C', 72),
    p('Nils Machowski', 'SG', 70), p('Colben Landrew', 'PF', 69),
    p('Junior County', 'PG', 66), p('Depth', 'C', 63),
  ]},
  // NCAA lock — CBS Top 25 (international/pro-blend rebuild, some variance)
  { name: "St. John's", roster: [
    p('Ian Jackson', 'SG', 80), p('Donnie Freeman', 'SF', 74),
    p('Quinn Ellis', 'PG', 74), p('Theo Edema', 'C', 73),
    p('Kyle Cuffe Jr.', 'PG', 72), p('Lazar Stojkovic', 'C', 71),
    p('Babacar Sane', 'PF', 70), p('Djordije Jovanovic', 'SF', 68),
    p('Depth', 'SG', 64),
  ]},
  // Loaded portal haul but unproven together (Willard Yr 2)
  { name: 'Villanova', roster: [
    p('Tyler Perkins', 'SG', 74), p('Jake Fiegen', 'SG', 73),
    p('Buddy Simmons', 'SF', 73), p('Kwame Evans Jr.', 'PF', 73),
    p('Elijah Crawford', 'PG', 72), p('Devin Royal', 'SF', 72),
    p('Matt Hodge', 'SG', 68), p('Malachi Palmer', 'SF', 67),
    p('Nico Onyekwere', 'C', 64),
  ]},
  // Sleeper — top-25 portal class, Gwath (MW DPOY)
  { name: 'DePaul', roster: [
    p('Magoon Gwath', 'C', 76), p('Layden Blocker', 'PG', 71),
    p('Noah Meeusen', 'SG', 71), p('Ade Popoola', 'SF', 71),
    p('Kahmare Holmes', 'SF', 71), p('Wilson Jacques', 'PF', 69),
    p('Koree Cotton', 'SG', 68), p('Kruz McClure', 'SF', 67),
    p('Fabian Flores', 'C', 63),
  ]},
  // Bubble — strong haul, zero continuity, new HC Hodgson
  { name: 'Providence', roster: [
    p('Miles Byrd', 'SG', 76), p('Malik Mack', 'PG', 73),
    p('Arrinten Page', 'C', 72), p('Devin Vanterpool', 'SF', 70),
    p('Ryan Mela', 'SG', 68), p('Ryan Sabol', 'PG', 67),
    p('Samson Aletan', 'C', 65), p('Jacob Bannarbie', 'PF', 64),
    p('Leonardo Marangon', 'SF', 62),
  ]},
  // --- Georgetown (verified real roster) ---
  GEORGETOWN_2627,
  // Lower-tier/bubble — massive exodus (lost All-BE Budd Clark)
  { name: 'Seton Hall', roster: [
    p('Simeon Wilcher', 'SG', 72), p('Roddie Anderson III', 'PG', 70),
    p('Del Jones', 'PG', 70), p('Kareem Thomas', 'SG', 69),
    p('Trey Parker', 'PG', 67), p('Mayar Wol', 'PF', 65),
    p('Chris Nwuli', 'PF', 64), p('Rodney Brown', 'SF', 63),
    p('Darien Moore', 'SG', 60),
  ]},
  // Lower-tier — new HC Nored, youthful low-major-heavy adds
  { name: 'Butler', roster: [
    p('Jalen Jackson', 'PG', 72), p('Jordan Ellerbee', 'SG', 71),
    p('Eduardo Klafke', 'SG', 69), p('Drayton Jones', 'C', 68),
    p('Asim Djulovic', 'PF', 67), p('Christian Moore', 'SG', 65),
    p('Baron Walker', 'SF', 64), p('Herly Brutus', 'SF', 64),
    p('Samis Calderon', 'PG', 60),
  ]},

  // NCAA lock — top-30, returns most minutes in league, Nigel James (BE FOY) + Fru (Louisville)
  { name: 'Marquette', roster: [
    p('Nigel James', 'PG', 81), p('Sananda Fru', 'C', 75),
    p('Royce Parham', 'PF', 72), p('Adrien Stevens', 'SG', 71),
    p('Nash Walker', 'SG', 69), p('Ethan Johnston', 'SF', 68),
    p('Alex Egbuonu', 'PF', 67), p('Ian Miletic', 'SF', 66),
    p('Nolan Minessale', 'PG', 63),
  ]},
  // NCAA lock — Torvik ~36 / 5th in BE, new HC Huss
  { name: 'Creighton', roster: [
    p('Wes Enis', 'PG', 74), p('Jackson McAndrew', 'SF', 72),
    p('Jasen Green', 'PF', 72), p('Oswin Erhunmwunse', 'C', 71),
    p('Isaac Traudt', 'SF', 70), p('Austin Swartz', 'SG', 70),
    p('BJ Davis', 'PG', 69), p('Hudson Greer', 'SG', 67),
    p('Wesly Rosa', 'C', 63),
  ]},
  // NCAA lock/bubble — "won the portal," heavy rebuild (Pitino)
  { name: 'Xavier', roster: [
    p('Michael Nwoko', 'C', 74), p('Jovan Milicevic', 'PF', 74),
    p('Tru Washington', 'SG', 72), p('Ruben Dominguez', 'SG', 72),
    p('Chance Westry', 'PG', 71), p('Gabriel Pozzato', 'SF', 68),
    p('Kalek House', 'PG', 67), p('Kason Westphal', 'C', 64),
    p('Asher Elson', 'SF', 62),
  ]},
];

module.exports = { BIG_EAST };
