'use strict';

const crypto = require('node:crypto');

const SNAP_SANDBOX = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const SNAP_PRODUCTION = 'https://app.midtrans.com/snap/v1/transactions';

/**
 * signature_key Midtrans = SHA512(order_id + status_code + gross_amount + ServerKey).
 * Lihat: https://docs.midtrans.com/reference/handle-notifications
 */
function signatureFor(orderId, statusCode, grossAmount, serverKey) {
  return crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
}

function safeEqualHex(a, b) {
  const left = Buffer.from(String(a), 'utf8');
  const right = Buffer.from(String(b), 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/** Verifikasi payload notifikasi tanpa melempar error. */
function verifySignature(payload, serverKey) {
  if (!payload || !serverKey) return false;
  const { order_id, status_code, gross_amount, signature_key } = payload;
  if (order_id === undefined || status_code === undefined || gross_amount === undefined) return false;
  if (typeof signature_key !== 'string' || !signature_key) return false;
  const expected = signatureFor(String(order_id), String(status_code), String(gross_amount), serverKey);
  return safeEqualHex(expected, signature_key);
}

function isProduction() {
  return String(process.env.MIDTRANS_IS_PRODUCTION || '').toLowerCase() === 'true';
}

function snapEndpoint() {
  return isProduction() ? SNAP_PRODUCTION : SNAP_SANDBOX;
}

/**
 * Buat transaksi Snap dan kembalikan { token, redirect_url }.
 * Klien diarahkan ke redirect_url sehingga tidak perlu Midtrans client key
 * di browser.
 */
async function createSnapTransaction({ orderId, amount, label, email, uid, appUrl, serverKey }) {
  if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY belum diset');

  const payload = {
    transaction_details: { order_id: orderId, gross_amount: amount },
    item_details: [{ id: orderId, price: amount, quantity: 1, name: label.slice(0, 50) }],
    customer_details: { email: email || undefined },
    callbacks: { finish: `${appUrl}/harga.html?status=selesai` },
    custom_field1: uid
  };

  const response = await fetch(snapEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Midtrans ${response.status}: ${body.status_message || JSON.stringify(body).slice(0, 200)}`);
  }
  return body;
}

module.exports = {
  signatureFor,
  verifySignature,
  createSnapTransaction,
  isProduction,
  snapEndpoint
};
