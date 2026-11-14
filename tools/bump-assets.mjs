#!/usr/bin/env node
/* =========================================================
   RUANGTRYOUT ASSET VERSION BUMPER
   ---------------------------------------------------------
   Menyamakan parameter `?v=` pada semua aset lokal di seluruh
   `*.html` dengan sidik jari (hash) isi aset, dan menyesuaikan
   `CACHE_NAME` di `sw.js`. Versi hanya berubah bila isi aset
   benar-benar berubah — tidak perlu menebak tanggal.

   Pemakaian:
     node tools/bump-assets.mjs            # tulis perubahan
     node tools/bump-assets.mjs --check    # gagal (exit 1) bila belum sinkron
     node tools/bump-assets.mjs --changed  # tulis, cetak nama file yang berubah saja
     node tools/bump-assets.mjs --print    # cetak versi saat ini

   Menambah aset baru? Tambahkan namanya ke ASSETS di bawah.
========================================================= */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Aset yang ikut di-versi. Jangan masukkan sw.js (URL-nya harus stabil)
// atau manifest.json.
const ASSETS = [
  'tailwind.css',
  'style.css',
  'site.js',
  'app.js',
  'questions.js',
  'question-source.js',
  'plus.js',
  'pesanan.js',
  'visitor-tracker.js',
  'firebase-config.js'
];

const SW_FILE = 'sw.js';
const CACHE_PREFIX = 'ruangtryout';

const args = new Set(process.argv.slice(2));
const mode = args.has('--check')
  ? 'check'
  : args.has('--print')
    ? 'print'
    : args.has('--changed')
      ? 'changed'
      : 'write';

if (args.has('--help') || args.has('-h')) {
  console.log('Pakai: node tools/bump-assets.mjs [--check|--print]');
  process.exit(0);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Hash isi aset, urut berdasarkan nama agar stabil. */
async function assetVersion() {
  const hash = createHash('sha256');
  for (const name of [...ASSETS].sort()) {
    const contents = await readFile(path.join(ROOT, name));
    hash.update(name).update('\0').update(contents).update('\n');
  }
  return hash.digest('hex').slice(0, 10);
}

function versionedHtml(html, version) {
  const names = ASSETS.map(escapeRegExp).join('|');
  const pattern = new RegExp(`((?:src|href)="(?:${names}))(?:\\?v=[^"]*)?(")`, 'g');
  return html.replace(pattern, `$1?v=${version}$2`);
}

function versionedSw(source, version) {
  return source.replace(
    /const CACHE_NAME = '[^']*';/,
    `const CACHE_NAME = '${CACHE_PREFIX}-${version}';`
  );
}

async function htmlFiles() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.html'))
    .map(entry => entry.name)
    .sort();
}

async function main() {
  const version = await assetVersion();
  const files = await htmlFiles();

  if (mode === 'print') {
    console.log(version);
    return;
  }

  const pending = [];

  for (const file of files) {
    const fullPath = path.join(ROOT, file);
    const current = await readFile(fullPath, 'utf8');
    const next = versionedHtml(current, version);
    if (next !== current) pending.push({ file, next });
  }

  const swPath = path.join(ROOT, SW_FILE);
  const swCurrent = await readFile(swPath, 'utf8');
  const swNext = versionedSw(swCurrent, version);
  const swChanged = swNext !== swCurrent;
  if (swChanged) pending.push({ file: SW_FILE, next: swNext });

  if (mode === 'check') {
    if (pending.length) {
      console.error(`Versi aset belum sinkron (harusnya ${version}). Jalankan: node tools/bump-assets.mjs`);
      pending.forEach(item => console.error(`  - ${item.file}`));
      process.exit(1);
    }
    console.log(`Versi aset sinkron: ${version} (${files.length} file HTML, ${SW_FILE}).`);
    return;
  }

  await Promise.all(pending.map(item => writeFile(path.join(ROOT, item.file), item.next, 'utf8')));

  if (mode === 'changed') {
    pending.forEach(item => console.log(item.file));
    return;
  }

  if (!pending.length) {
    console.log(`Tidak ada perubahan. Versi tetap ${version}.`);
    return;
  }

  console.log(`Versi aset: ${version}`);
  console.log(`Diperbarui ${pending.length} file: ${pending.map(item => item.file).join(', ')}`);
}

main().catch(error => {
  console.error('Gagal memperbarui versi aset:', error?.message || error);
  process.exit(1);
});
