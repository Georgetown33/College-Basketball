// Projected 2026-27 Big East rosters. Player `overall` grades are calibrated to
// each program's late-May-2026 outlook (returning talent + portal class + early
// rankings) per research. These are PROJECTIONS — rosters are still forming.
// Georgetown uses the user-provided projected roster (rosters.js), which is more
// optimistic than public consensus (which currently ranks GU last in the league).

const { GEORGETOWN_2627 } = require('./rosters');

const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });

const BIG_EAST = [
  { name: 'UConn', roster: [
    p('Silas Demary Jr.', 'PG', 84), p('Braylon Mullins', 'SG', 82),
    p('Nikolas Khamenia', 'SF', 76), p('Colben Landrew', 'PF', 74),
    p('Eric Reibe', 'C', 73), p('Najai Hines', 'SG', 72),
    p('Jaylin Stewart', 'SF', 71), p('Jayden Ross', 'SF', 70),
    p('Depth A', 'PG', 66), p('Depth B', 'C', 64),
  ]},
  { name: "St. John's", roster: [
    p('Ian Jackson', 'SG', 80), p('Donnie Freeman', 'SF', 76),
    p('Quinn Ellis', 'PG', 76), p('Theo Edema', 'C', 74),
    p('Kyle Cuffe Jr.', 'PG', 74), p('Dylan Darling', 'SG', 73),
    p('Joson Sanon', 'SG', 73), p('Ruben Prey', 'C', 71),
    p('Dimitrije Markovic', 'SF', 66), p('Depth', 'PF', 64),
  ]},
  { name: 'Xavier', roster: [
    p('Jovan Milicevic', 'PF', 76), p('Michael Nwoko', 'C', 75),
    p('Tru Washington', 'SG', 73), p('Ruben Dominguez', 'SG', 73),
    p('Pape N\'Diaye', 'C', 70), p('Returner A', 'PG', 69),
    p('Returner B', 'SF', 68), p('Returner C', 'SG', 67),
    p('Depth', 'PF', 64),
  ]},
  { name: 'Creighton', roster: [
    p('Jasen Green', 'PF', 73), p('Austin Swartz', 'SG', 73),
    p('Jackson McAndrew', 'SF', 72), p('BJ Davis', 'PG', 72),
    p('Hudson Greer', 'SG', 71), p('Owen Freeman-type', 'C', 70),
    p('Returner A', 'PG', 69), p('Returner B', 'SF', 68),
    p('Depth', 'C', 64),
  ]},
  { name: 'Marquette', roster: [
    p('Nigel James', 'PG', 80), p('Damarius Owens', 'SF', 73),
    p('Royce Parham', 'PF', 71), p('Adrien Stevens', 'SG', 70),
    p('Returner A', 'SG', 70), p('Returner B', 'C', 69),
    p('Returner C', 'PF', 68), p('Returner D', 'SF', 67),
    p('Depth', 'PG', 63),
  ]},
  { name: 'Villanova', roster: [
    p('Tyler Perkins', 'SG', 76), p('Kwame Evans Jr.', 'PF', 76),
    p('Devin Royal', 'SF', 74), p('Matt Hodge', 'SG', 71),
    p('Elijah Crawford', 'PG', 71), p('Returner A', 'C', 69),
    p('Returner B', 'SF', 68), p('Returner C', 'PG', 67),
    p('Depth', 'PF', 63),
  ]},
  // --- Georgetown (user-provided projected roster) ---
  GEORGETOWN_2627,
  { name: 'DePaul', roster: [
    p('Magoon Gwath', 'C', 76), p('Noah Meeusen', 'SF', 71),
    p('Ade Popoola', 'PF', 70), p('Layden Blocker', 'PG', 70),
    p('Returner A', 'SG', 68), p('Returner B', 'SG', 67),
    p('Returner C', 'SF', 66), p('Returner D', 'PG', 65),
    p('Depth', 'C', 62),
  ]},
  { name: 'Providence', roster: [
    p('Miles Byrd', 'SG', 75), p('Malik Mack', 'PG', 74),
    p('Arrinten Page', 'C', 72), p('Devin Vanterpool', 'SF', 71),
    p('Ryan Mela', 'SG', 68), p('Portal A', 'PG', 67),
    p('Portal B', 'PF', 66), p('Portal C', 'SG', 65),
    p('Depth', 'SF', 62),
  ]},
  { name: 'Seton Hall', roster: [
    p('Del Jones', 'PG', 75), p('Roddie Anderson III', 'SG', 72),
    p('Kareem Thomas', 'SG', 70), p('Trey Parker', 'PG', 68),
    p('Isaiah Wilcher', 'SG', 67), p('Mayar Wol', 'C', 66),
    p('Prince Nwuli', 'PF', 65), p('Portal', 'SF', 64),
    p('Depth', 'C', 61),
  ]},
  { name: 'Butler', roster: [
    p('Jalen Jackson', 'SG', 72), p('Drayton Jones', 'PF', 70),
    p('Eduardo Klafke', 'PG', 70), p('Herly Brutus', 'SF', 69),
    p('Milos Djulovic', 'C', 68), p('Returner A', 'SG', 67),
    p('Returner B', 'PF', 66), p('Returner C', 'PG', 65),
    p('Depth', 'C', 62),
  ]},
];

module.exports = { BIG_EAST };
