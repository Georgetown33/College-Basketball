// Real rosters with hand-assigned scouting grades (overall, 30-99) used by the
// extracted sim engine. Grades reflect track record / pedigree, NOT objective
// truth. 2026-27 grades are projections (no games played yet).
//
// overall scale anchor:
//   85-90 = All-Big East / elite     75-81 = quality high-major starter
//   68-74 = solid starter            60-67 = rotation role player
//   50-59 = end of bench / unproven

const M = 70; // default morale

const p = (name, pos, overall, tags = {}) => ({ name, pos, overall, morale: M, ...tags });

// ---------------- GEORGETOWN 2026-27 (audited May 27, 2026) ----------------
// Miller CONFIRMED (committed 5/27, Zagsblog/On3). Audit grades applied:
//   Lowe 76->71 (chronically inefficient, sub-40% FG), E.Jackson 71->60
//   (4.8 ppg at Kansas after ACL year), Machot 72->67 (CAA DPOY but undersized
//   for Big East), Miller 75->73. Scuka UNVERIFIED (no source links him to GU);
//   kept per user direction but flagged. Frontcourt is genuinely thin.
const GEORGETOWN_2627 = {
  name: 'Georgetown 2026-27',
  roster: [
    p('Vyctorius Miller', 'SG', 73),  // 10.8/2.7 on 37.5% 3PT — solid-starter wing
    p('Josiah Parker', 'SF', 72),     // AAC Freshman of Year (9.6/6.0)
    p('Jaland Lowe', 'PG', 71),       // high-usage but inefficient lead guard
    p('Luka Scuka', 'PF', 69),        // UNVERIFIED commit; 6-10 German BBL — kept per user
    p('Caleb Williams', 'SF', 68),    // 33 starts, 8.8 ppg returner
    p('Chol Machot', 'C', 67),        // CAA DPOY shot-blocker, undersized for Big East
    p('Gabriel Landeira', 'PG', 66),  // GLOBL JAM MVP, unproven in NCAA
    p('Justin Caldwell', 'PF', 62),   // 6-9 freshman (top-150)
    p('Kayvaun Mulready', 'SG', 62),  // physical depth guard (defense)
    p('Elmarko Jackson', 'SG', 60),   // 4.8 ppg at Kansas, unproven post-ACL
    p('Athan Olivier', 'SG', 57),     // freshman G
    p('Seal Diouf', 'C', 56),         // unproven (3.2 mpg last yr)
  ],
};

// Objective alternative: roster WITHOUT Miller (matches what indexed sources confirm).
const GEORGETOWN_2627_NO_MILLER = {
  name: 'Georgetown 2026-27 (no Miller)',
  roster: GEORGETOWN_2627.roster.filter(pl => pl.name !== 'Vyctorius Miller'),
};

// ---------------- GEORGETOWN 2025-26 (actual: 16-18, 6-14 BE, T-10th) ----------------
// Grades anchored so this team's strength reflects its real T-10th finish.
const GEORGETOWN_2526 = {
  name: 'Georgetown 2025-26',
  roster: [
    p('Malik Mack', 'PG', 73),            // high-usage lead guard ~16 ppg
    p('KJ Lewis', 'SG', 71),              // Arizona transfer, two-way combo guard
    p('Vince Iwuchukwu', 'C', 70),        // 7'1" ex-5-star, rim presence (injury hx)
    p('Langston Love', 'SG', 69),         // Baylor transfer, shooter
    p('DeShawn Harris-Smith', 'SG', 69),  // Maryland transfer, big playmaking guard
    p('Julius Halaifonua', 'C', 64),      // 7'0" developing big
    p('Isaiah Abraham', 'SF', 62),        // 6'7" developing wing
    p('Jeremiah Williams', 'SG', 62),     // experienced guard
    p('Caleb Williams', 'SF', 61),        // (younger)
    p('Austin Montgomery', 'SF', 59),     // depth forward
    p('Jayden Fort', 'PF', 59),           // 6'9" depth
    p('Hashem Asadallah', 'SG', 55),
    p('Mason Moses', 'SG', 55),
    p('Kayvaun Mulready', 'SG', 57),
    p('Michael Van Raaphorst', 'SG', 54),
  ],
};

module.exports = { GEORGETOWN_2627, GEORGETOWN_2627_NO_MILLER, GEORGETOWN_2526 };
