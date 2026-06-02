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

// ---------------- GEORGETOWN 2026-27 (PRODUCTION-graded) ----------------
// Grades = actual college/pro output, competition-adjusted (per per-player audit).
// Miller 70 (10.8 ppg modest volume), Lowe 69 (16.8 ppg but 37.6 FG/26.6 3PT at
// Pitt — brutal efficiency), Parker 70 (rising AAC frosh), Scuka 69 (proven BBL
// stretch big), Machot 68 (CAA DPOY, 79 blocks, thin offense), E.Jackson 60
// (never produced at Kansas, post-ACL). No proven high-major star on the roster.
const GEORGETOWN_2627 = {
  name: 'Georgetown 2026-27',
  roster: [
    p('Vyctorius Miller', 'SG', 70),  // OK St 10.8/2.7 on 41.8/37.5/85.7 — modest volume
    p('Josiah Parker', 'SF', 70),     // FAU 9.8/6.0, 12.7/8.4 in AAC play — ascending
    p('Jaland Lowe', 'PG', 69),       // Pitt 16.8 ppg but 37.6 FG / 26.6 3PT — inefficient
    p('Luka Scuka', 'PF', 69),        // German BBL 9.0/5.7, proven pro stretch big
    p('Chol Machot', 'C', 68),        // Charleston CAA DPOY, 79 blocks (top-10 NCAA)
    p('Gabriel Landeira', 'PG', 65),  // Brazil NBB 13.5/5.5a, GLOBL JAM MVP — unproven NCAA
    p('Justin Caldwell', 'PF', 63),   // top-130 freshman, 7-1 wingspan rim protector
    p('Caleb Williams', 'SF', 62),    // GU 4.3/3.8 returner — glue/role
    p('Elmarko Jackson', 'SG', 60),   // never produced at Kansas (4.6 career), post-ACL
    p('Kayvaun Mulready', 'SG', 58),  // deep-bench toughness guard
    p('Athan Olivier', 'SG', 58),     // undersized project freshman
    p('Seal Diouf', 'C', 58),         // depth center, minimal production
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
