'use strict';

const { getPlan, nextPlusUntil } = require('./plans');

/**
 * Aktifkan Plus untuk order yang sudah dibayar.
 *
 * Idempoten: notifikasi Midtrans dapat dikirim berkali-kali, jadi status order
 * diperiksa di dalam transaksi. Custom claim baru dipasang setelah transaksi
 * commit. Rules bank soal memakai claim `plus`/`plusUntil`, sehingga masa aktif
 * berakhir sendiri tanpa cron job.
 *
 * @param {object} deps
 * @param {FirebaseFirestore.Firestore} deps.db
 * @param {typeof import('firebase-admin')} deps.admin
 * @param {FirebaseFirestore.DocumentReference} deps.orderRef
 * @param {number} deps.nowMs
 */
async function activatePlus({ db, admin, orderRef, nowMs }) {
  const FieldValue = admin.firestore.FieldValue;
  let granted = null;

  await db.runTransaction(async transaction => {
    const orderSnap = await transaction.get(orderRef);
    if (!orderSnap.exists) throw new Error('order-missing');
    const order = orderSnap.data();

    if (order.status === 'paid') {
      granted = null;
      return;
    }

    const plan = getPlan(order.plan);
    if (!plan) throw new Error(`plan-unknown:${order.plan}`);

    const entitlementRef = db.collection('entitlements').doc(order.uid);
    const entitlementSnap = await transaction.get(entitlementRef);
    const current = entitlementSnap.exists ? entitlementSnap.data() : null;
    const currentUntilMs = current?.plusUntil?.toMillis ? current.plusUntil.toMillis() : 0;

    const untilMs = nextPlusUntil(plan, currentUntilMs, nowMs);
    const until = admin.firestore.Timestamp.fromMillis(untilMs);

    transaction.set(orderRef, {
      status: 'paid',
      paidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    transaction.set(entitlementRef, {
      uid: order.uid,
      plan: plan.id,
      plusUntil: until,
      active: true,
      lastOrderId: order.orderId,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    granted = {
      uid: order.uid,
      orderId: order.orderId,
      plusUntilSeconds: Math.floor(untilMs / 1000)
    };
  });

  if (!granted) return { activated: false, reason: 'already-paid' };

  // Klaim ini yang dibaca firestore.rules (plus & plusUntil).
  await admin.auth().setCustomUserClaims(granted.uid, {
    plus: true,
    plusUntil: granted.plusUntilSeconds
  });

  return { activated: true, ...granted };
}

module.exports = { activatePlus };
