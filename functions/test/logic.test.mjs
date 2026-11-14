import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { signatureFor, verifySignature } = require('../lib/midtrans.js');
const { evaluateNotification } = require('../lib/notifications.js');
const { getPlan, nextPlusUntil, SEASON_END_ISO } = require('../lib/plans.js');

const SERVER_KEY = 'SB-Mid-server-DUMMYKEY';
const ORDER = { orderId: 'rt-abc', uid: 'uid-1', plan: 'plus_30', amount: 25000, status: 'pending' };

function notification(overrides = {}) {
  const payload = {
    order_id: ORDER.orderId,
    status_code: '200',
    gross_amount: '25000.00',
    transaction_status: 'settlement',
    fraud_status: 'accept',
    transaction_id: 'tx-1',
    ...overrides
  };
  payload.signature_key = signatureFor(
    payload.order_id,
    payload.status_code,
    payload.gross_amount,
    SERVER_KEY
  );
  return payload;
}

test('signature mengikuti SHA512(order_id+status_code+gross_amount+serverKey)', () => {
  // Nilai acuan dihitung terpisah dari implementasi.
  const expected = require('node:crypto')
    .createHash('sha512')
    .update('order-1' + '200' + '25000.00' + SERVER_KEY)
    .digest('hex');
  assert.equal(signatureFor('order-1', '200', '25000.00', SERVER_KEY), expected);
});

test('verifySignature menolak signature palsu dan payload tidak lengkap', () => {
  const valid = notification();
  assert.equal(verifySignature(valid, SERVER_KEY), true);
  assert.equal(verifySignature({ ...valid, gross_amount: '1000.00' }, SERVER_KEY), false);
  assert.equal(verifySignature({ ...valid, signature_key: 'x'.repeat(128) }, SERVER_KEY), false);
  assert.equal(verifySignature({ order_id: 'a' }, SERVER_KEY), false);
  assert.equal(verifySignature(valid, ''), false);
});

test('settlement dengan signature sah dan nominal cocok -> paid', () => {
  assert.deepEqual(evaluateNotification(notification(), ORDER, SERVER_KEY), { ok: true, outcome: 'paid' });
});

test('capture + fraud accept -> paid, capture + challenge -> pending', () => {
  const accepted = notification({ transaction_status: 'capture', fraud_status: 'accept' });
  const challenged = notification({ transaction_status: 'capture', fraud_status: 'challenge' });
  assert.equal(evaluateNotification(accepted, ORDER, SERVER_KEY).outcome, 'paid');
  assert.equal(evaluateNotification(challenged, ORDER, SERVER_KEY).outcome, 'pending');
});

test('nominal tidak cocok -> review, bukan paid', () => {
  const cheap = notification({ gross_amount: '1000.00' });
  assert.deepEqual(evaluateNotification(cheap, ORDER, SERVER_KEY), {
    ok: true,
    outcome: 'review',
    reason: 'amount-mismatch'
  });
});

test('signature tidak sah -> ok:false', () => {
  const payload = notification();
  const result = evaluateNotification({ ...payload, status_code: '201' }, ORDER, SERVER_KEY);
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid-signature');
});

test('status pending/expire/cancel/deny dipetakan benar', () => {
  assert.equal(evaluateNotification(notification({ transaction_status: 'pending' }), ORDER, SERVER_KEY).outcome, 'pending');
  for (const status of ['expire', 'cancel', 'deny', 'failure']) {
    assert.equal(evaluateNotification(notification({ transaction_status: status }), ORDER, SERVER_KEY).outcome, 'failed');
  }
  assert.equal(evaluateNotification(notification({ transaction_status: 'weird' }), ORDER, SERVER_KEY).outcome, 'ignored');
});

test('status_code selain 200 tidak mengaktifkan Plus', () => {
  const payload = notification({ status_code: '201' });
  assert.equal(evaluateNotification(payload, ORDER, SERVER_KEY).outcome, 'ignored');
});

test('pembelian bertumpuk dari sisa masa aktif', () => {
  const now = Date.UTC(2026, 10, 13);
  const day = 24 * 60 * 60 * 1000;
  const plan = getPlan('plus_30');
  assert.equal(nextPlusUntil(plan, 0, now), now + 30 * day);
  assert.equal(nextPlusUntil(plan, now + 10 * day, now), now + 40 * day);
  // Masa aktif lama yang lebih panjang ikut ditambah, bukan dipotong.
  assert.equal(nextPlusUntil(plan, now + 400 * day, now), now + 430 * day);
  // Masa aktif yang sudah lewat tidak dihitung dua kali.
  assert.equal(nextPlusUntil(plan, now - 90 * day, now), now + 30 * day);
});

test('paket musim memakai akhir musim dan tidak memotong masa aktif lebih panjang', () => {
  const seasonEnd = Date.parse(SEASON_END_ISO);
  const now = Date.UTC(2026, 10, 13);
  const plan = getPlan('plus_season');
  assert.equal(nextPlusUntil(plan, 0, now), seasonEnd);
  assert.equal(nextPlusUntil(plan, seasonEnd + 30 * 86400000, now), seasonEnd + 30 * 86400000);
});

test('harga paket server sama dengan yang tampil di harga.html', () => {
  assert.equal(getPlan('plus_30').amount, 25000);
  assert.equal(getPlan('plus_90').amount, 59000);
  assert.equal(getPlan('plus_season').amount, 149000);
  assert.equal(getPlan('plus_999'), null);
  assert.equal(getPlan('__proto__'), null);
});
