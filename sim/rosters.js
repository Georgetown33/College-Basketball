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

// ---------------- GEORGETOWN 2026-27 (projected) ----------------
const GEORGETOWN_2627 = {
  name: 'Georgetown 2026-27',
  roster: [
    p('Jaland Lowe', 'PG', 78),       // 3rd-team All-ACC lead guard (Pitt), high usage / low eff
    p('Vyctorius Miller', 'SG', 76),  // 42/37/86, 26 starts at Okie St — efficient wing scorer
    p('Elmarko Jackson', 'SG', 75),   // ex-McDonald's AA (Kansas), 37.2% 3PT
    p('Chol Machot', 'C', 74),        // CAA DPOY rim protector (step-up risk)
    p('Gabriel Landeira', 'PG', 70),  // GLOBL JAM MVP, intriguing intl, unproven in NCAA
    p('Caleb Williams', 'SF', 68),    // sole returning rotation forward
    p('Josiah Parker', 'SF', 66),     // FAU transfer, frontcourt depth
    p('Justin Caldwell', 'PF', 63),   // 6-9 freshman, picked GU over MD/NCSU
    p('Kayvaun Mulready', 'SG', 63),  // physical depth guard
    p('Athan Olivier', 'SG', 58),     // freshman G
    p('Seal Diouf', 'C', 57),         // unproven (3.2 mpg last yr)
  ],
};

// ---------------- GEORGETOWN 2025-26 (last year, actual) ----------------
const GEORGETOWN_2526 = {
  name: 'Georgetown 2025-26',
  roster: [
    p('Malik Mack', 'PG', 76),            // high-usage lead guard ~16 ppg
    p('KJ Lewis', 'SG', 73),              // Arizona transfer, two-way combo guard
    p('Langston Love', 'SG', 72),         // Baylor transfer, shooter
    p('Vince Iwuchukwu', 'C', 72),        // 7'1" ex-5-star, rim presence (injury hx)
    p('DeShawn Harris-Smith', 'SG', 71),  // Maryland transfer, big playmaking guard
    p('Julius Halaifonua', 'C', 66),      // 7'0" developing big
    p('Isaiah Abraham', 'SF', 64),        // 6'7" developing wing
    p('Jeremiah Williams', 'SG', 64),     // experienced guard
    p('Caleb Williams', 'SF', 62),        // (younger)
    p('Austin Montgomery', 'SF', 60),     // depth forward
    p('Jayden Fort', 'PF', 60),           // 6'9" depth
    p('Hashem Asadallah', 'SG', 56),
    p('Mason Moses', 'SG', 55),
    p('Kayvaun Mulready', 'SG', 58),
    p('Michael Van Raaphorst', 'SG', 54),
  ],
};

module.exports = { GEORGETOWN_2627, GEORGETOWN_2526 };
