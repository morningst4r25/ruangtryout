#!/usr/bin/env node
/* =========================================================
   VALIDASI BANK SOAL
   ---------------------------------------------------------
   Memeriksa `questions.js` sebelum dirilis: kunci jawaban di
   luar rentang opsi, opsi ganda/kembar dalam satu soal, soal
   duplikat (termasuk antar kategori), serta teks/pembahasan
   yang kosong. Dipakai di CI supaya bank soal yang rusak tidak
   pernah sampai ke situs.

   Pemakaian:
     node tools/validate-questions.mjs        # laporan + exit 1 bila ada masalah
     node tools/validate-questions.mjs -q     # ringkas: hanya masalah
     node tools/validate-questions.mjs file.js # periksa berkas lain (mis. fixture uji)

   Ambang subtes dibaca dari tools/question-sections.mjs, sumber
   yang sama dengan skrip migrasi.
========================================================= */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { CATEGORIES, SECTION_RULES, sectionFor } from './question-sections.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bankArg = process.argv.slice(2).find(arg => !arg.startsWith('-'));
const BANK_FILE = bankArg ? path.resolve(process.cwd(), bankArg) : path.join(ROOT, 'questions.js');
const MIN_OPTIONS = 2;
const MIN_TEXT_LENGTH = 10;

const quiet = process.argv.includes('-q') || process.argv.includes('--quiet');

/** Pembanding teks soal: abaikan huruf besar/kecil, tanda baca, dan spasi berlebih. */
function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/* Pembanding opsi: hanya rapikan spasi, tanpa membuang simbol.
   Simbol pada opsi bisa menjadi inti soal (mis. "X < Y" vs "X = Y",
   atau "-6" vs "6"), jadi tidak boleh disamakan. */
function optionKey(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function looseKey(value) {
  return optionKey(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function loadBank() {
  const source = readFileSync(BANK_FILE, 'utf8');
  let bank;
  try {
    bank = new Function(`${source}\nreturn quizCategories;`)();
  } catch (error) {
    console.error('questions.js tidak bisa dibaca sebagai JavaScript:');
    console.error(`  ${error?.message || error}`);
    process.exit(1);
  }
  if (!bank || typeof bank !== 'object' || Array.isArray(bank)) {
    console.error('questions.js tidak mengembalikan objek quizCategories.');
    process.exit(1);
  }
  return bank;
}

function main() {
  const bank = loadBank();
  const problems = [];
  const warnings = [];
  const seenQuestions = new Map(); // teks soal ternormalisasi -> "kategori #nomor"
  const sections = {};

  for (const category of CATEGORIES) {
    const questions = bank[category]?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      problems.push(`${category}: tidak ada daftar soal (quizCategories.${category}.questions).`);
      continue;
    }

    sections[category] = {};
    questions.forEach((raw, index) => {
      const label = `${category} #${index + 1}`;
      const section = sectionFor(category, index);
      sections[category][section] = (sections[category][section] || 0) + 1;

      if (!raw || typeof raw !== 'object') {
        problems.push(`${label}: entri soal bukan objek.`);
        return;
      }

      const text = typeof raw.question === 'string' ? raw.question.trim() : '';
      if (text.length < MIN_TEXT_LENGTH) {
        problems.push(`${label}: teks soal kosong atau terlalu pendek.`);
      } else {
        const key = normalize(text);
        const firstSeen = seenQuestions.get(key);
        if (firstSeen) problems.push(`${label}: soal duplikat dengan ${firstSeen} — "${text.slice(0, 60)}"`);
        else seenQuestions.set(key, label);
      }

      const options = Array.isArray(raw.options) ? raw.options : null;
      if (!options) {
        problems.push(`${label}: tidak punya daftar opsi.`);
      } else {
        if (options.length < MIN_OPTIONS) {
          problems.push(`${label}: hanya ${options.length} opsi (minimal ${MIN_OPTIONS}).`);
        }
        const seenOptions = new Map();
        const seenLoose = new Map();
        const letter = i => String.fromCharCode(65 + i);
        options.forEach((option, optionIndex) => {
          const optionText = typeof option === 'string' ? option.trim() : '';
          if (!optionText) {
            problems.push(`${label}: opsi ${letter(optionIndex)} kosong.`);
            return;
          }
          const key = optionKey(optionText);
          const firstOption = seenOptions.get(key);
          if (firstOption !== undefined) {
            problems.push(
              `${label}: opsi kembar — ${letter(optionIndex)} "${optionText}" sama dengan ${letter(firstOption)}.`
            );
          } else {
            seenOptions.set(key, optionIndex);
          }

          // Beda kapitalisasi/tanda baca bisa disengaja (soal EYD), jadi hanya peringatan.
          const loose = looseKey(optionText);
          const firstLoose = seenLoose.get(loose);
          if (firstLoose !== undefined) {
            warnings.push(
              `${label}: opsi ${letter(optionIndex)} "${optionText}" hanya beda kapitalisasi/tanda baca dari ${letter(firstLoose)}.`
            );
          } else {
            seenLoose.set(loose, optionIndex);
          }
        });

        const answer = raw.answer;
        if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
          problems.push(`${label}: kunci jawaban ${JSON.stringify(answer)} di luar rentang 0..${options.length - 1}.`);
        } else if (!String(options[answer] ?? '').trim()) {
          problems.push(`${label}: kunci jawaban menunjuk opsi kosong.`);
        }
      }

      const explanation = typeof raw.explanation === 'string' ? raw.explanation.trim() : '';
      if (!explanation) problems.push(`${label}: pembahasan kosong.`);
    });
  }

  if (!quiet) {
    const totals = CATEGORIES.map(category => `${category} ${bank[category]?.questions?.length ?? 0}`);
    console.log(`Bank soal: ${totals.join(' + ')} soal.`);
    for (const [category, counts] of Object.entries(sections)) {
      const expected = (SECTION_RULES[category] || []).map(rule => rule.name);
      const detail = Object.entries(counts).map(([name, count]) => `${count} ${name}`).join(' / ');
      const unknown = Object.keys(counts).filter(name => !expected.includes(name));
      console.log(`  ${category}: ${detail}${unknown.length ? ` (subtes tak dikenal: ${unknown.join(', ')})` : ''}`);
    }
    console.log('');
  }

  if (warnings.length && !quiet) {
    console.log(`${warnings.length} hal yang perlu dicek manual (tidak menggagalkan CI):`);
    warnings.forEach(warning => console.log(`  - ${warning}`));
    console.log('');
  }

  if (problems.length) {
    console.error(`${problems.length} masalah pada bank soal:`);
    problems.forEach(problem => console.error(`  - ${problem}`));
    process.exit(1);
  }

  console.log('Bank soal valid: kunci jawaban dalam rentang, tidak ada opsi kembar atau soal duplikat.');
}

main();
