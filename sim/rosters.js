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

// ---------------- GEORGETOWN 2026-27 (verified May 27, 2026) ----------------
// Primary roster INCLUDES Vyctorius Miller per user report of a same-day commit
// (not yet independently confirmable in indexed sources; Kansas had been favored).
// Confirmed adds: Lowe, Jackson, Machot, Parker (+ freshmen Caldwell/Olivier),
// returners Williams/Landeira/Mulready/Diouf. Halaifonua left for Oklahoma State.
const GEORGETOWN_2627 = {
  name: 'Georgetown 2026-27',
  roster: [
    p('Jaland Lowe', 'PG', 76),       // high-major lead guard, elite ceiling, injury/eff risk
    p('Vyctorius Miller', 'SG', 75),  // 10.8/2.7/1.8 on 42/37/86 at Okie St — efficient wing
    p('Josiah Parker', 'SF', 72),     // AAC Freshman of Year (9.6/6.0) — real frontcourt piece
    p('Chol Machot', 'C', 72),        // CAA DPOY, only true rim protector (step-up risk)
    p('Elmarko Jackson', 'SG', 71),   // ex-McDonald's AA (Kansas), offensively unproven
    p('Caleb Williams', 'SF', 68),    // 33 starts, 8.8 ppg returner
    p('Gabriel Landeira', 'PG', 66),  // GLOBL JAM MVP, unproven in NCAA
    p('Justin Caldwell', 'PF', 62),   // 6-9 freshman (top-150)
    p('Kayvaun Mulready', 'SG', 62),  // physical depth guard (defense)
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
