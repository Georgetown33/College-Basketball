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

// ---------------- GEORGETOWN 2026-27 (OPPONENT-ADJUSTED grades) ----------------
// Advanced-analytics audit (efficiency x usage x competition). Brutal on the
// "pedigree" guards: Lowe 64 (50.5% TS / 38% FG at Pitt — inefficient volume),
// Miller 68 (modest full-season output, mediocre 3P), Machot 63 (elite blocks but
// CAA-inflated, putback-level offense), E.Jackson 60 (never produced at Kansas).
// No Georgetown player grades above 68 — lowest team-best in the Big East.
const GEORGETOWN_2627 = {
  name: 'Georgetown 2026-27',
  roster: [
    p('Vyctorius Miller', 'SG', 68),  // Okla St 10.8, decent-not-elite efficiency
    p('Josiah Parker', 'SF', 67),     // FAU 51.8% FG + rebounding, Tier-B AAC
    p('Jaland Lowe', 'PG', 64),       // Pitt 16.8 but 50.5% TS — inefficient volume
    p('Luka Scuka', 'PF', 64),        // German BBL stretch 4, 44.5/33.6, low reb
    p('Chol Machot', 'C', 63),        // CAA DPOY blocks, putback offense — comp-discounted
    p('Caleb Williams', 'SF', 62),    // low-usage BE glue, eFG 50.9 / PER 10.6
    p('Gabriel Landeira', 'PG', 60),  // Brazil NBB playmaker, unproven NCAA
    p('Elmarko Jackson', 'SG', 60),   // never produced at Kansas (40.6% FG), post-ACL
    p('Justin Caldwell', 'PF', 58),   // freshman, no college data
    p('Kayvaun Mulready', 'SG', 58),  // deep-bench
    p('Seal Diouf', 'C', 58),         // redshirted, no sample
    p('Athan Olivier', 'SG', 57),     // freshman project
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
