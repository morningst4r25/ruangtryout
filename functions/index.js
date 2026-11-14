'use strict';

/**
 * Cloud Functions RuangTryout
 *
 * Alur pembelian:
 *   1. Klien (login Google) memanggil `createOrder` dengan id paket.
 *   2. Order disimpan sebagai `pending`, lalu transaksi Snap dibuat di Midtrans.
 *   3. Klien diarahkan ke `redirect_url` Midtrans untuk membayar (QRIS/e-wallet).
 *   4. Midtrans mengirim notifikasi ke `paymentNotification`.
 *   5. Signature diverifikasi, nominal dicocokkan, order ditandai `paid`,
 *      `entitlements/{uid}` ditulis, dan custom claim Plus dipasang.
 */

const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

const { getPlan } = require('./lib/plans');
const { createSnapTransaction } = require('./lib/midtrans');
const { evaluateNotification } = require('./lib/notifications');
const { activatePlus } = require('./lib/entitlements');

admin.initializeApp();
const db = admin.firestore();

const REGION = 'asia-southeast2';
const MIDTRANS_SERVER_KEY = defineSecret('MIDTRANS_SERVER_KEY');
const APP_URL = process.env.APP_URL || 'https://www.ruangtryout.my.id';

function newOrderId() {
  return `rt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Buat order + transaksi pembayaran. Mengembalikan URL pembayaran Midtrans.
 */
exports.createOrder = onCall(
  { region: REGION, secrets: [MIDTRANS_SERVER_KEY], enforceAppCheck: false },
  async request => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Masuk dengan akun Google terlebih dahulu.');
    }
    const plan = getPlan(request.data?.plan);
    if (!plan) throw new HttpsError('invalid-argument', 'Paket tidak dikenali.');

    const uid = request.auth.uid;
    const email = request.auth.token.email || '';
    const orderId = newOrderId();
    const orderRef = db.collection('orders').doc(orderId);

    await orderRef.set({
      orderId,
      uid,
      email,
      plan: plan.id,
      amount: plan.amount,
      status: 'pending',
      provider: 'midtrans',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    try {
      const snap = await createSnapTransaction({
        orderId,
        amount: plan.amount,
        label: plan.label,
        email,
        uid,
        appUrl: APP_URL,
        serverKey: MIDTRANS_SERVER_KEY.value()
      });

      await orderRef.set({
        providerToken: snap.token || null,
        redirectUrl: snap.redirect_url || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      return { orderId, redirectUrl: snap.redirect_url || null };
    } catch (error) {
      logger.error('createOrder gagal', { orderId, message: String(error?.message || error) });
      await orderRef.set({
        status: 'failed',
        failureReason: String(error?.message || error).slice(0, 300),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      throw new HttpsError(
        'failed-precondition',
        'Checkout otomatis belum tersedia. Gunakan tombol ajukan akses lewat kontak.'
      );
    }
  }
);

/**
 * Webhook Midtrans (HTTP Notification).
 * Wajib HTTPS, signature diverifikasi sebelum ada perubahan data.
 */
exports.paymentNotification = onRequest(
  { region: REGION, secrets: [MIDTRANS_SERVER_KEY] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, reason: 'method-not-allowed' });
      return;
    }

    const payload = req.body && typeof req.body === 'object' ? req.body : {};
    const orderId = String(payload.order_id || '');
    if (!orderId) {
      res.status(200).json({ ok: false, reason: 'missing-order-id' });
      return;
    }

    const orderRef = db.collection('orders').doc(orderId);
    let orderSnap;
    try {
      orderSnap = await orderRef.get();
    } catch (error) {
      logger.error('Gagal membaca order', { orderId, message: String(error) });
      res.status(500).json({ ok: false, reason: 'read-failed' });
      return;
    }

    if (!orderSnap.exists) {
      // Balas 200 agar Midtrans tidak mengulang terus untuk order asing.
      logger.warn('Notifikasi untuk order tidak dikenal', { orderId });
      res.status(200).json({ ok: false, reason: 'unknown-order' });
      return;
    }

    const order = orderSnap.data();
    const verdict = evaluateNotification(payload, order, MIDTRANS_SERVER_KEY.value());

    if (!verdict.ok) {
      logger.warn('Notifikasi ditolak', { orderId, reason: verdict.reason });
      res.status(401).json({ ok: false, reason: verdict.reason });
      return;
    }

    const providerTransactionId = payload.transaction_id ? String(payload.transaction_id) : null;

    try {
      if (verdict.outcome === 'paid') {
        const result = await activatePlus({ db, admin, orderRef, nowMs: Date.now() });
        await orderRef.set({
          providerTransactionId,
          providerStatus: payload.transaction_status,
          paymentType: payload.payment_type || null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        logger.info('Plus diaktifkan', { orderId, uid: order.uid, activated: result.activated });
      } else if (verdict.outcome === 'failed') {
        await orderRef.set({
          status: 'failed',
          providerStatus: payload.transaction_status,
          providerTransactionId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } else if (verdict.outcome === 'review') {
        await orderRef.set({
          status: 'review',
          providerStatus: payload.transaction_status,
          providerTransactionId,
          reviewReason: verdict.reason,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        logger.warn('Order perlu ditinjau manual', { orderId, reason: verdict.reason });
      } else {
        await orderRef.set({
          providerStatus: payload.transaction_status || verdict.reason,
          providerTransactionId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      logger.error('Gagal memproses notifikasi', { orderId, message: String(error) });
      // 500 agar Midtrans mengirim ulang notifikasi.
      res.status(500).json({ ok: false, reason: 'processing-failed' });
      return;
    }

    res.status(200).json({ ok: true, outcome: verdict.outcome });
  }
);
