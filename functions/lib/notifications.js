'use strict';

const { verifySignature } = require('./midtrans');

const FAILED_STATUSES = new Set(['expire', 'cancel', 'deny', 'failure']);

/**
 * Terjemahkan notifikasi Midtrans menjadi keputusan bisnis.
 *
 * Aturan resmi Midtrans: transaksi dianggap berhasil hanya bila
 * status_code "200", transaction_status `settlement` (atau `capture` untuk
 * kartu), dan — bila ada — fraud_status `accept`. Nominal juga harus sama
 * dengan yang tercatat di order, supaya notifikasi sah tidak bisa dipakai
 * untuk membayar paket mahal dengan nominal kecil.
 *
 * @returns {{ok: boolean, outcome?: 'paid'|'pending'|'failed'|'review'|'ignored', reason?: string}}
 */
function evaluateNotification(payload, order, serverKey) {
  if (!verifySignature(payload, serverKey)) {
    return { ok: false, reason: 'invalid-signature' };
  }
  if (!order) return { ok: false, reason: 'unknown-order' };

  const statusCode = String(payload.status_code);
  const status = String(payload.transaction_status || '').toLowerCase();
  const fraud = payload.fraud_status ? String(payload.fraud_status).toLowerCase() : null;

  if (status === 'settlement' || status === 'capture') {
    if (statusCode !== '200') return { ok: true, outcome: 'ignored', reason: `status-code-${statusCode}` };
    if (fraud && fraud !== 'accept') return { ok: true, outcome: 'pending', reason: `fraud-${fraud}` };
    if (!Number.isFinite(Number(payload.gross_amount)) || Number(payload.gross_amount) !== Number(order.amount)) {
      return { ok: true, outcome: 'review', reason: 'amount-mismatch' };
    }
    return { ok: true, outcome: 'paid' };
  }

  if (status === 'pending') return { ok: true, outcome: 'pending', reason: 'pending' };
  if (FAILED_STATUSES.has(status)) return { ok: true, outcome: 'failed', reason: status };

  return { ok: true, outcome: 'ignored', reason: `unknown-${status || 'empty'}` };
}

module.exports = { evaluateNotification };
