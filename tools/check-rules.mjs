#!/usr/bin/env node
/* =========================================================
   VALIDASI firestore.rules
   ---------------------------------------------------------
   Mengirim isi firestore.rules ke emulator Firestore untuk
   dikompilasi. Emulator yang sama juga dipakai `firebase
   deploy`, jadi error sintaks/semantik muncul di sini dengan
   nomor baris — sebelum menyentuh project sungguhan.

   Butuh emulator Firestore yang sudah berjalan:
     npx firebase-tools emulators:exec --only firestore \
       --project demo-ruangtryout "node tools/check-rules.mjs"

   Host emulator dibaca dari FIRESTORE_EMULATOR_HOST
   (default 127.0.0.1:8080).
========================================================= */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RULES_FILE = path.join(ROOT, 'firestore.rules');
const EMULATOR = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const [host, port] = EMULATOR.split(':');

function explain(error) {
  const raw = String(error?.message || error).replace(/^Error:\s*/, '');

  if (/ECONNREFUSED|fetch failed|network/i.test(raw)) {
    return [
      `Tidak bisa menghubungi emulator Firestore di ${EMULATOR}.`,
      'Jalankan lewat emulator, contoh:',
      '  npx firebase-tools emulators:exec --only firestore --project demo-ruangtryout "node tools/check-rules.mjs"'
    ].join('\n');
  }

  // Pesan emulator berbentuk JSON: {"error":{"message":"Error compiling rules:\nL12:3 ..."}}
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) return parsed.error.message;
  } catch {
    /* bukan JSON, pakai apa adanya */
  }

  return raw;
}

async function main() {
  const rules = readFileSync(RULES_FILE, 'utf8');

  try {
    const env = await initializeTestEnvironment({
      projectId: process.env.GCLOUD_PROJECT || 'demo-ruangtryout',
      firestore: { rules, host, port: Number(port) }
    });
    await env.cleanup();
  } catch (error) {
    console.error('firestore.rules GAGAL dikompilasi:\n');
    console.error(explain(error));
    process.exit(1);
  }

  console.log(`firestore.rules lolos kompilasi (emulator ${EMULATOR}).`);
}

main().catch(error => {
  console.error('Gagal memeriksa firestore.rules:', error?.message || error);
  process.exit(1);
});
