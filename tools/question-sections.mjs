/* Aturan pembagian subtes bank soal.
   Satu sumber kebenaran untuk skrip migrasi (tools/migrate-questions.mjs)
   dan validator (tools/validate-questions.mjs), supaya ambang subtes tidak
   pernah berbeda antara keduanya. */

export const SECTION_RULES = {
  cpns: [{ name: 'TWK', until: 45 }, { name: 'TIU', until: 90 }, { name: 'TKP', until: Infinity }],
  utbk: [{ name: 'Penalaran & Kuantitatif', until: 45 }, { name: 'Literasi', until: Infinity }]
};

export const CATEGORIES = Object.keys(SECTION_RULES);

export function sectionFor(category, index) {
  const rules = SECTION_RULES[category] || [];
  for (const rule of rules) if (index < rule.until) return rule.name;
  return rules.length ? rules[rules.length - 1].name : 'Umum';
}
