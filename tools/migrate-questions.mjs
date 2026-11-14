#!/usr/bin/env node
/* =========================================================
   RUANGTRYOUT QUESTION BANK MIGRATION
   ---------------------------------------------------------
   Memindahkan bank soal dari `questions.js` (file statis publik) ke
   Firestore `questions` + `questionMeta/{category}`.

   Kenapa: exam.html memuat bank soal dari `questionSource` (Firestore) dan
   memakai `questions.js` hanya sebagai fallback offline. Hanya soal tier
   `free` yang boleh dibaca publik; soal tier `plus` dijaga Firestore Rules.

   Pemakaian:
     node tools/migrate-questions.mjs                     # dry-run, tulis JSON ke tools/out/
     node tools/migrate-questions.mjs --free-per-section 8 # dry-run dengan pemisahan tier
     node tools/migrate-questions.mjs --apply             # tulis ke Firestore
     node tools/migrate-questions.mjs --apply --prune     # + hapus dokumen soal yang tak terpakai

   Prasyarat untuk --apply:
     npm install firebase-admin
     export GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json
     (atau jalankan di lingkungan Google Cloud dengan Application Default Credentials)

   Catatan keamanan: JANGAN taruh service account di dalam repo.
========================================================= */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT_DIR = path.join(SCRIPT_DIR, 'out');
const BATCH_LIMIT = 400;

const SECTION_RULES = {
  cpns: [{ name: 'TWK', until: 45 }, { name: 'TIU', until: 90 }, { name: 'TKP', until: Infinity }],
  utbk: [{ name: 'Penalaran & Kuantitatif', until: 45 }, { name: 'Literasi', until: Infinity }]
};

function parseArgs(argv) {
  const args = { apply: false, prune: false, freePerSection: 0, project: null, out: path.join(OUT_DIR, 'questions.json') };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--dry-run') args.apply = false;
    else if (arg === '--prune') args.prune = true;
    else if (arg === '--free-per-section') args.freePerSection = Number(argv[++i]);
    else if (arg === '--project') args.project = argv[++i];
    else if (arg === '--out') args.out = path.resolve(argv[++i]);
    else if (arg === '--help' || arg === '-h') {
      console.log('Lihat komentar di kepala file ini untuk daftar opsi.');
      process.exit(0);
    } else {
      console.error(`Argumen tidak dikenal: ${arg}`);
      process.exit(1);
    }
  }
  if (!Number.isInteger(args.freePerSection) || args.freePerSection < 0) {
    console.error('--free-per-section harus bilangan bulat >= 0 (0 berarti semua soal tetap gratis).');
    process.exit(1);
  }
  return args;
}

function sectionFor(category, index) {
  const rules = SECTION_RULES[category] || [];
  for (const rule of rules) if (index < rule.until) return rule.name;
  return rules.length ? rules[rules.length - 1].name : 'Umum';
}

/** Muat quizCategories langsung dari questions.js tanpa mengeksekusi file sebagai modul. */
async function readLocalBank() {
  const source = await readFile(path.join(ROOT, 'questions.js'), 'utf8');
  const factory = new Function(`${source}\nreturn quizCategories;`);
  const bank = factory();
  if (!bank || typeof bank !== 'object') throw new Error('questions.js tidak mengembalikan quizCategories.');
  return bank;
}

function docId(category, index) {
  return `${category}_${String(index + 1).padStart(3, '0')}`;
}

function buildBank(localBank, freePerSection) {
  const result = {};

  for (const category of ['cpns', 'utbk']) {
    const source = localBank[category]?.questions;
    if (!Array.isArray(source) || !source.length) throw new Error(`Kategori ${category} tidak punya soal di questions.js.`);

    const sectionsSeen = {};
    const docs = source.map((raw, index) => {
      const section = sectionFor(category, index);
      const seen = sectionsSeen[section] = (sectionsSeen[section] || 0) + 1;
      const tier = freePerSection > 0 && seen > freePerSection ? 'plus' : 'free';
      if (!Array.isArray(raw.options) || raw.options.length < 2) {
        throw new Error(`Soal ${category}#${index + 1} tidak punya minimal 2 opsi.`);
      }
      if (!Number.isInteger(Number(raw.answer)) || Number(raw.answer) < 0 || Number(raw.answer) >= raw.options.length) {
        throw new Error(`Soal ${category}#${index + 1} punya kunci jawaban di luar rentang opsi.`);
      }
      return {
        id: docId(category, index),
        data: {
          category,
          index,
          section,
          tier,
          published: true,
          question: String(raw.question),
          options: raw.options.map(String),
          answer: Number(raw.answer),
          explanation: raw.explanation ? String(raw.explanation) : 'Pembahasan belum tersedia.'
        }
      };
    });

    const hash = createHash('sha256')
      .update(JSON.stringify(docs.map(d => [d.id, d.data.tier, d.data.question, d.data.answer, d.data.options])))
      .digest('hex')
      .slice(0, 12);

    const freeIds = docs.filter(d => d.data.tier === 'free').map(d => d.id);
    const plusIds = docs.filter(d => d.data.tier === 'plus').map(d => d.id);
    // Indeks dipakai UI ujian untuk menandai nomor soal yang terkunci tanpa
    // membocorkan isi soal Plus.
    const freeIndices = docs.filter(d => d.data.tier === 'free').map(d => d.data.index);
    const plusIndices = docs.filter(d => d.data.tier === 'plus').map(d => d.data.index);

    result[category] = {
      docs,
      meta: {
        category,
        datasetVersion: `fs-${hash}`,
        total: docs.length,
        freeCount: freeIds.length,
        plusCount: plusIds.length,
        freeIds,
        plusIds,
        freeIndices,
        plusIndices
      }
    };
  }

  return result;
}

function report(bank, args) {
  console.log(`Mode: ${args.apply ? 'APPLY ke Firestore' : 'DRY-RUN (tidak menulis ke Firestore)'}`);
  console.log(`Pemisahan tier: ${args.freePerSection > 0 ? `${args.freePerSection} soal gratis per subtes, sisanya Plus` : 'semua soal tetap gratis (perilaku situs tidak berubah)'}`);
  for (const [category, entry] of Object.entries(bank)) {
    const { meta } = entry;
    console.log(`\n[${category}] ${meta.total} soal -> ${meta.freeCount} free / ${meta.plusCount} plus (datasetVersion ${meta.datasetVersion})`);
    const perSection = entry.docs.reduce((acc, doc) => {
      const key = `${doc.data.section} (${doc.data.tier})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    for (const [key, count] of Object.entries(perSection)) console.log(`  - ${key}: ${count}`);
  }
}

async function writePreview(bank, outPath) {
  await mkdir(path.dirname(outPath), { recursive: true });
  const preview = Object.fromEntries(
    Object.entries(bank).map(([category, entry]) => [category, {
      meta: entry.meta,
      questions: entry.docs.map(d => ({ id: d.id, ...d.data }))
    }])
  );
  await writeFile(outPath, `${JSON.stringify(preview, null, 2)}\n`, 'utf8');
  console.log(`\nPreview ditulis ke ${path.relative(ROOT, outPath)}`);
}

async function detectProjectId(explicit) {
  if (explicit) return explicit;
  if (process.env.GOOGLE_CLOUD_PROJECT) return process.env.GOOGLE_CLOUD_PROJECT;
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT;
  try {
    const config = await readFile(path.join(ROOT, 'firebase-config.js'), 'utf8');
    const match = config.match(/projectId:\s*["']([^"']+)["']/);
    if (match) return match[1];
  } catch (_) { /* diabaikan */ }
  return undefined;
}

async function applyToFirestore(bank, args) {
  let admin;
  try {
    admin = await import('firebase-admin/app');
  } catch (_) {
    console.error('\nPaket firebase-admin belum terpasang. Jalankan: npm install firebase-admin');
    process.exit(1);
  }

  const projectId = await detectProjectId(args.project);
  const fsAdmin = await import('firebase-admin/firestore');

  try {
    const app = admin.getApps().length
      ? admin.getApp()
      : admin.initializeApp(projectId ? { projectId } : undefined);
    const db = fsAdmin.getFirestore(app);

    for (const [category, entry] of Object.entries(bank)) {
      const collection = db.collection('questions');
      for (let i = 0; i < entry.docs.length; i += BATCH_LIMIT) {
        const batch = db.batch();
        entry.docs.slice(i, i + BATCH_LIMIT).forEach(doc => {
          batch.set(collection.doc(doc.id), { ...doc.data, updatedAt: fsAdmin.FieldValue.serverTimestamp() });
        });
        await batch.commit();
      }
      await db.collection('questionMeta').doc(category).set({
        ...entry.meta,
        updatedAt: fsAdmin.FieldValue.serverTimestamp()
      });
      console.log(`[${category}] ${entry.docs.length} soal + questionMeta/${category} tersimpan.`);

      if (args.prune) {
        const keep = new Set(entry.docs.map(d => d.id));
        const existing = await db.collection('questions').where('category', '==', category).listDocuments();
        const stale = existing.filter(ref => !keep.has(ref.id));
        for (let i = 0; i < stale.length; i += BATCH_LIMIT) {
          const batch = db.batch();
          stale.slice(i, i + BATCH_LIMIT).forEach(ref => batch.delete(ref));
          await batch.commit();
        }
        if (stale.length) console.log(`[${category}] ${stale.length} dokumen lama dihapus.`);
      }
    }
    console.log('\nSelesai. Langkah berikutnya: pastikan firestore.rules sudah dideploy.');
  } catch (error) {
    console.error('\nGagal menulis ke Firestore:', error?.message || error);
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error('Set GOOGLE_APPLICATION_CREDENTIALS ke file service account (jangan commit file itu).');
    }
    process.exit(1);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const localBank = await readLocalBank();
  const bank = buildBank(localBank, args.freePerSection);
  report(bank, args);
  await writePreview(bank, args.out);
  if (args.apply) await applyToFirestore(bank, args);
  else console.log('\nTidak ada perubahan pada Firestore. Tambahkan --apply untuk menulis.');
}

main().catch(error => {
  console.error('Migrasi gagal:', error?.message || error);
  process.exit(1);
});
