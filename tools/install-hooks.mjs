#!/usr/bin/env node
/* =========================================================
   PEMASANG HOOK PRE-COMMIT
   ---------------------------------------------------------
   Menyalin tools/git-hooks/pre-commit ke direktori hook yang
   benar-benar dibaca git (core.hooksPath bila diset, kalau
   tidak: <git-common-dir>/hooks).

   Pemakaian:
     node tools/install-hooks.mjs              # pasang
     node tools/install-hooks.mjs --uninstall  # lepas
========================================================= */

import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, rm, chmod, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SOURCE = 'tools/git-hooks/pre-commit';
const uninstall = process.argv.includes('--uninstall');

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

async function main() {
  const root = git('rev-parse', '--show-toplevel');
  const commonDir = path.resolve(root, git('rev-parse', '--git-common-dir'));
  const worktreeDir = path.resolve(root, git('rev-parse', '--git-dir'));

  let hooksDir;
  try {
    hooksDir = path.resolve(root, git('config', '--get', 'core.hooksPath'));
  } catch {
    hooksDir = path.join(commonDir, 'hooks');
  }

  const target = path.join(hooksDir, 'pre-commit');

  if (uninstall) {
    await rm(target, { force: true });
    console.log(`Hook dilepas: ${target}`);
    return;
  }

  const source = await readFile(path.join(root, SOURCE), 'utf8');
  await mkdir(hooksDir, { recursive: true });
  await writeFile(target, source, 'utf8');

  // chmod bisa ditolak bila berkas milik user lain (mis. hook bersama pada git worktree).
  // Itu bukan masalah selama berkasnya sudah executable.
  try {
    await chmod(target, 0o755);
  } catch (error) {
    const mode = (await stat(target)).mode;
    if (!(mode & 0o100)) {
      throw new Error(`tidak bisa menjadikan ${target} executable (${error.code || error.message})`);
    }
  }

  console.log(`Hook terpasang: ${target}`);
  if (worktreeDir !== commonDir) {
    console.log('Catatan: ini git worktree, jadi hook di atas dipakai bersama worktree lain dari repo yang sama.');
  }
  console.log('Uji: git commit (hook memperbarui + men-stage versi aset) · lewati: git commit --no-verify');
}

main().catch(error => {
  console.error('Gagal memasang hook:', error?.message || error);
  process.exit(1);
});
