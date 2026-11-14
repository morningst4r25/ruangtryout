/* =========================================================
   UNIT TEST FIRESTORE RULES (emulator)
   ---------------------------------------------------------
   Memastikan pagar akses premium bekerja di sisi server:
   - soal tier `plus` hanya terbaca oleh pemegang claim Plus,
   - soal `published: false` tidak terbaca siapa pun,
   - order & entitlement hanya terbaca pemiliknya, dengan
     query riwayat yang wajib terfilter dan dibatasi,
   - semua penulisan dari klien ditolak.

   Jalankan (butuh Java untuk emulator):
     npx firebase-tools emulators:exec --only firestore \
       --project demo-ruangtryout "node --test tools/rules.test.mjs"
========================================================= */

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where
} from 'firebase/firestore';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EMULATOR = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const [host, port] = EMULATOR.split(':');

const OWNER = 'uid-owner';
const OTHER = 'uid-other';
const NOW_SECONDS = Math.floor(Date.now() / 1000);

const env = await initializeTestEnvironment({
  projectId: process.env.GCLOUD_PROJECT || 'demo-ruangtryout',
  firestore: {
    rules: readFileSync(path.join(ROOT, 'firestore.rules'), 'utf8'),
    host,
    port: Number(port)
  }
});

await env.withSecurityRulesDisabled(async context => {
  const db = context.firestore();

  await setDoc(doc(db, 'questions/cpns-free'), {
    category: 'cpns',
    section: 'TWK',
    tier: 'free',
    published: true,
    question: 'Soal gratis',
    answer: 'A'
  });
  await setDoc(doc(db, 'questions/cpns-plus'), {
    category: 'cpns',
    section: 'TWK',
    tier: 'plus',
    published: true,
    question: 'Soal Plus',
    answer: 'B'
  });
  await setDoc(doc(db, 'questions/cpns-draft'), {
    category: 'cpns',
    section: 'TWK',
    tier: 'free',
    published: false,
    question: 'Draf',
    answer: 'C'
  });

  await setDoc(doc(db, 'questionMeta/cpns'), {
    datasetVersion: 'fs-test',
    freeIds: ['cpns-free', 'cpns-draft'],
    plusIds: ['cpns-plus']
  });

  await setDoc(doc(db, 'orders/order-owner'), {
    orderId: 'order-owner',
    uid: OWNER,
    plan: 'plus_30',
    amount: 25000,
    status: 'settlement'
  });
  await setDoc(doc(db, 'orders/order-other'), {
    orderId: 'order-other',
    uid: OTHER,
    plan: 'plus_30',
    amount: 25000,
    status: 'pending'
  });

  await setDoc(doc(db, 'entitlements/' + OWNER), { plan: 'plus_30', plusUntil: NOW_SECONDS + 86400 });
});

after(() => env.cleanup());

const plusUser = env.authenticatedContext(OWNER, { plus: true }).firestore();
const freshUser = env.authenticatedContext(OWNER).firestore();
const otherUser = env.authenticatedContext(OTHER).firestore();
const guest = env.unauthenticatedContext().firestore();
const expiringPlus = env.authenticatedContext('uid-expiring', {
  plusUntil: NOW_SECONDS + 3600
}).firestore();
const expiredPlus = env.authenticatedContext('uid-expired', {
  plusUntil: NOW_SECONDS - 3600
}).firestore();

// ---------------------------------------------------------
// BANK SOAL
// ---------------------------------------------------------

test('tamu bisa membaca soal gratis yang terbit', async () => {
  await assertSucceeds(getDoc(doc(guest, 'questions/cpns-free')));
});

test('tamu ditolak saat membaca soal Plus', async () => {
  await assertFails(getDoc(doc(guest, 'questions/cpns-plus')));
});

test('pengguna login tanpa claim Plus ditolak saat membaca soal Plus', async () => {
  await assertFails(getDoc(doc(freshUser, 'questions/cpns-plus')));
});

test('pengguna dengan claim plus: true bisa membaca soal Plus', async () => {
  await assertSucceeds(getDoc(doc(plusUser, 'questions/cpns-plus')));
});

test('claim plusUntil di masa depan membuka soal Plus', async () => {
  await assertSucceeds(getDoc(doc(expiringPlus, 'questions/cpns-plus')));
});

test('claim plusUntil yang kedaluwarsa tidak membuka soal Plus', async () => {
  await assertFails(getDoc(doc(expiredPlus, 'questions/cpns-plus')));
});

test('soal yang belum terbit tidak terbaca bahkan oleh Plus dan tamu', async () => {
  await assertFails(getDoc(doc(plusUser, 'questions/cpns-draft')));
  await assertFails(getDoc(doc(guest, 'questions/cpns-draft')));
});

test('daftar soal gratis dapat diambil tamu dengan filter tier + published', async () => {
  const snapshot = await assertSucceeds(
    getDocs(
      query(
        collection(guest, 'questions'),
        where('tier', '==', 'free'),
        where('published', '==', true)
      )
    )
  );
  assert.ok(snapshot.size >= 1, 'harus ada soal gratis yang terbaca');
  assert.ok(
    snapshot.docs.every(item => item.data().published === true),
    'draf tidak boleh ikut terkirim'
  );
});

test('tamu tidak bisa menarik seluruh koleksi soal tanpa filter', async () => {
  await assertFails(getDocs(collection(guest, 'questions')));
});

test('Plus bisa mengambil daftar soal tier plus dengan filter', async () => {
  const snapshot = await assertSucceeds(
    getDocs(
      query(
        collection(plusUser, 'questions'),
        where('tier', '==', 'plus'),
        where('published', '==', true)
      )
    )
  );
  assert.equal(snapshot.size, 1);
});

test('questionMeta tetap publik', async () => {
  const snapshot = await assertSucceeds(getDoc(doc(guest, 'questionMeta/cpns')));
  assert.equal(snapshot.data().datasetVersion, 'fs-test');
});

test('klien tidak bisa menulis ke koleksi soal', async () => {
  await assertFails(setDoc(doc(guest, 'questions/cpns-new'), { tier: 'free', published: true }));
  await assertFails(setDoc(doc(plusUser, 'questions/cpns-free'), { tier: 'free', published: false }));
});

// ---------------------------------------------------------
// ORDER & ENTITLEMENT
// ---------------------------------------------------------

test('pemilik bisa membaca order miliknya', async () => {
  await assertSucceeds(getDoc(doc(freshUser, 'orders/order-owner')));
});

test('pengguna lain tidak bisa membaca order orang lain', async () => {
  await assertFails(getDoc(doc(otherUser, 'orders/order-owner')));
  await assertFails(getDoc(doc(freshUser, 'orders/order-other')));
});

test('tamu tidak bisa membaca order apa pun', async () => {
  await assertFails(getDoc(doc(guest, 'orders/order-owner')));
});

test('riwayat pesanan terfilter uid sendiri dan berlimit berhasil', async () => {
  const snapshot = await assertSucceeds(
    getDocs(query(collection(freshUser, 'orders'), where('uid', '==', OWNER), limit(10)))
  );
  assert.equal(snapshot.size, 1);
  assert.equal(snapshot.docs[0].data().uid, OWNER);
});

test('riwayat pesanan tanpa limit ditolak', async () => {
  await assertFails(
    getDocs(query(collection(freshUser, 'orders'), where('uid', '==', OWNER)))
  );
});

test('riwayat pesanan dengan limit melebihi 50 ditolak', async () => {
  await assertFails(
    getDocs(query(collection(freshUser, 'orders'), where('uid', '==', OWNER), limit(51)))
  );
});

test('tidak bisa memakai query riwayat untuk membaca order pengguna lain', async () => {
  await assertFails(
    getDocs(query(collection(freshUser, 'orders'), where('uid', '==', OTHER), limit(10)))
  );
});

test('klien tidak bisa membuat atau mengubah order', async () => {
  await assertFails(
    setDoc(doc(freshUser, 'orders/order-fake'), {
      orderId: 'order-fake',
      uid: OWNER,
      plan: 'plus_season',
      amount: 0,
      status: 'settlement'
    })
  );
  await assertFails(setDoc(doc(freshUser, 'orders/order-owner'), { status: 'settlement' }));
});

test('entitlement hanya terbaca pemiliknya dan tidak bisa ditulis klien', async () => {
  await assertSucceeds(getDoc(doc(freshUser, 'entitlements/' + OWNER)));
  await assertFails(getDoc(doc(otherUser, 'entitlements/' + OWNER)));
  await assertFails(getDoc(doc(guest, 'entitlements/' + OWNER)));
  await assertFails(getDocs(collection(freshUser, 'entitlements')));
  await assertFails(setDoc(doc(freshUser, 'entitlements/' + OWNER), { plus: true }));
});
