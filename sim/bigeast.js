// 2026-27 Big East rosters — opponent-adjusted production grades, refreshed
// against an 11-team change-check current to AUGUST 2026 (the session clock was
// stale at June 2; the real date is ~Aug 5, so ~2 months of moves were missing).
//
// Major changes applied in this refresh:
//   * St. John's LOSES Donnie Freeman (74) — torn Achilles, out for 2026-27 (7/1)
//   * Villanova ADDS Luigi Suigo (7-3 C, NBA combine invitee) — center hole solved
//   * Xavier ADDS Filip Borovicanin (10.8/7.4) — 5th year via court injunction
//   * Creighton: McAndrew + Greer cleared (injury discounts removed)
//   * DePaul: Gwath health downgrade (no clean bill; ~19 mpg, knee + hip flexor)
//   * Seton Hall ADDS Terry Copeland (NJCAA National POY)
//   * UConn ADDS Dzafic (7-0 C, Arkansas) + Amosov (Real Madrid U22 POY)
//   * Providence ADDS Bannarbie + Walters
//   * Georgetown: NO changes — Scuka was never a commit, Iwuchukwu portaled out
// Georgetown lives in rosters.js.

const { GEORGETOWN_2627 } = require('./rosters');

const M = 70;
const p = (name, pos, overall) => ({ name, pos, overall, morale: M });

const BIG_EAST = [
  // Polls have them #4-5 nationally. Added a 7-0 body + Real Madrid U22 POY.
  { name: 'UConn', roster: [
    p('Silas Demary Jr.', 'PG', 80), p('Braylon Mullins', 'SG', 75),
    p('Najai Hines', 'C', 73), p('Nikolas Khamenia', 'SF', 68),
    p('Nils Machowski', 'SG', 66), p('Colben Landrew', 'SF', 66),
    p('Jayden Ross', 'SF', 65), p('Egor Amosov', 'SF', 64),
    p('Elmir Dzafic', 'C', 64), p('Oskar Giltay', 'C', 63),
    p('Junior County', 'PG', 62),
  ]},
  // MAJOR HIT: Freeman (74) out for the year, torn Achilles. Replacements are 62s.
  { name: "St. John's", roster: [
    p('Tounde Yessoufou', 'SG', 80), p('Ian Jackson', 'SG', 77),
    p('Quinn Ellis', 'PG', 72), p('Babacar Sane', 'PF', 66),
    p('Ruben Prey', 'C', 63), p('Kyle Cuffe Jr.', 'PG', 62),
    p('Avery Brown', 'PG', 62), p('Djordije Jovanovic', 'SF', 62),
    p('Gildas Gimenez', 'SF', 62), p('Lazar Stojkovic', 'C', 60),
    p('Theo Edema', 'C', 58),
  ]},
  // Suigo (7-3, withdrew from draft) fixes the one hole. Deepest proven core in the league.
  { name: 'Villanova', roster: [
    p('Kwame Evans Jr.', 'PF', 80), p('Devin Royal', 'SF', 77),
    p('Tyler Perkins', 'SG', 75), p('Luigi Suigo', 'C', 71),
    p('Jake Fiegen', 'SG', 71), p('Buddy Simmons', 'SF', 70),
    p('Matt Hodge', 'SG', 68), p('Elijah Crawford', 'PG', 67),
    p('Adam Oumiddoch', 'SG', 62), p('Abdou Samb', 'PF', 60),
    p('Nico Onyekwere', 'C', 58), p('Carter Fisk', 'PG', 58),
  ]},
  // Borovicanin's 5th year (won on injunction) is a real add — 10.8/7.4 of Big East production.
  { name: 'Xavier', roster: [
    p('Michael Nwoko', 'C', 80), p('Jovan Milicevic', 'PF', 78),
    p('Chance Westry', 'PG', 73), p('Tru Washington', 'SG', 72),
    p('Filip Borovicanin', 'PF', 72), p('Ruben Dominguez', 'SG', 71),
    p('Rolyns Aligbe', 'PF', 64), p('Gabriel Pozzato', 'SF', 64),
    p('Kalek House', 'PG', 60), p('Asher Elson', 'SF', 60),
    p('Harrison Aligbe', 'SF', 58), p('Gedeon Basson', 'PG', 58),
  ]},
  // McAndrew (~13.3 proj) and Greer both cleared — injury discounts removed.
  { name: 'Creighton', roster: [
    p('Oswin Erhunmwunse', 'C', 76), p('Wes Enis', 'PG', 74),
    p('Austin Swartz', 'SG', 73), p('Jasen Green', 'PF', 71),
    p('BJ Davis', 'PG', 70), p('Jackson McAndrew', 'SF', 70),
    p('Isaac Traudt', 'SF', 65), p('Hudson Greer', 'SG', 64),
    p('Kayden Edwards', 'SG', 63), p('Katrelle Harmon', 'PG', 62),
    p('Trevon Carter-Givens', 'C', 59), p('Wesly Rosa', 'C', 58),
  ]},
  // No changes; James locked in (withdrew from draft before the 5/27 deadline).
  { name: 'Marquette', roster: [
    p('Nigel James', 'PG', 80), p('Sananda Fru', 'C', 74),
    p('Royce Parham', 'PF', 73), p('Adrien Stevens', 'SG', 71),
    p('Nolan Minessale', 'PG', 69), p('Caedin Hamilton', 'PF', 63),
    p('Damarius Owens', 'SG', 63), p('Alex Egbuonu', 'PF', 62),
    p('Colton Crowdis', 'PG', 60), p('Ethan Johnston', 'SF', 59),
    p('Nash Walker', 'SG', 58), p('Michael Phillips', 'SF', 58),
  ]},
  // Byrd + Pate both confirmed staying (Pate turned down NBA two-ways for eligibility).
  { name: 'Providence', roster: [
    p('Malik Mack', 'PG', 75), p('Miles Byrd', 'SG', 74),
    p('Devin Vanterpool', 'SG', 71), p('Arrinten Page', 'C', 70),
    p('Ryan Mela', 'SG', 70), p('Ryan Sabol', 'SG', 68),
    p('Dink Pate', 'SG', 66), p('Samson Aletan', 'C', 63),
    p('Jacob Bannarbie', 'PF', 63), p('Gavin Hightower', 'PG', 61),
    p('Leonardo Marangon', 'SF', 60), p('Clyde Walters', 'SF', 58),
  ]},
  // Gwath downgraded 80->76: knee surgery + hip flexor, ~19 mpg, no clean bill of health.
  { name: 'DePaul', roster: [
    p('Magoon Gwath', 'C', 76), p('Ade Popoola', 'SF', 71),
    p('Kahmare Holmes', 'SF', 70), p('Koree Cotton', 'SG', 68),
    p('Layden Blocker', 'PG', 66), p('Wilson Jacques', 'PF', 66),
    p('Noah Meeusen', 'SG', 65), p('Kruz McClure', 'SF', 60),
    p('Theo Pierre-Justin', 'PF', 58), p('Fabian Flores', 'C', 58),
  ]},
  // --- Georgetown (no changes; Scuka never a commit, Iwuchukwu portaled out) ---
  GEORGETOWN_2627,
  // +Copeland (NJCAA National POY, 19.8/7.9 on 67% FG) is a genuine frontcourt add.
  { name: 'Seton Hall', roster: [
    p('Devin Williams', 'C', 71), p('Del Jones', 'PG', 70),
    p('Rodney Brown Jr.', 'SF', 70), p('Mayar Wol', 'PF', 69),
    p('Terry Copeland', 'PF', 68), p('Kareem Thomas', 'SG', 68),
    p('Roddie Anderson III', 'PG', 64), p('Simeon Wilcher', 'SG', 63),
    p('Abdulai Fanta Kabba', 'C', 62), p('Trey Parker', 'PG', 60),
    p('Nathan Mariano', 'PF', 60), p('Darien Moore', 'SG', 58),
  ]},
  // Roster closed 5/14 at 15. Jalen Jackson granted the medical redshirt, active.
  { name: 'Butler', roster: [
    p('Asim Djulovic', 'PF', 68), p('Jalen Jackson', 'PG', 66),
    p('Drayton Jones', 'C', 65), p('Jordan Ellerbee', 'SG', 65),
    p('Treyson Anderson', 'PF', 63), p('Herly Brutus', 'SF', 63),
    p('Eduardo Klafke', 'SG', 62), p('Samu Adler', 'SG', 59),
    p('Kevin Ndzie', 'C', 58), p('Marko Maric', 'SF', 58),
    p('Baron Walker', 'SF', 60), p('Samis Calderon', 'PF', 59),
    p('Christian Moore', 'SF', 56),
  ]},
];

module.exports = { BIG_EAST };
