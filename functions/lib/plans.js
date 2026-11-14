'use strict';

/**
 * Katalog paket Plus.
 *
 * File ini adalah SATU-SATUNYA sumber kebenaran harga di server. Nominal di
 * harga.html hanya tampilan; yang ditagih selalu diambil dari sini. Ubah
 * keduanya bersamaan agar halaman dan tagihan tidak berbeda.
 */

// Akhir musim ujian untuk paket "musim": 31 Mei 2027 23:59:59 WIB.
// Ganti tanggal ini setiap musim baru.
const SEASON_END_ISO = '2027-05-31T16:59:59.000Z';

const PLANS = {
  plus_30: { id: 'plus_30', label: 'RuangTryout Plus 30 hari', amount: 25000, days: 30 },
  plus_90: { id: 'plus_90', label: 'RuangTryout Plus 90 hari', amount: 59000, days: 90 },
  plus_season: {
    id: 'plus_season',
    label: 'RuangTryout Plus musim ujian',
    amount: 149000,
    until: Date.parse(SEASON_END_ISO)
  }
};

function getPlan(id) {
  if (typeof id !== 'string') return null;
  return Object.prototype.hasOwnProperty.call(PLANS, id) ? PLANS[id] : null;
}

/**
 * Hitung batas akhir Plus dalam milidetik.
 * Pembelian berulang menumpuk dari sisa masa aktif (bukan dari hari ini),
 * dan paket musim tidak pernah memotong masa aktif yang sudah lebih panjang.
 */
function nextPlusUntil(plan, currentUntilMs, nowMs) {
  const current = Number.isFinite(Number(currentUntilMs)) ? Number(currentUntilMs) : 0;
  const base = Math.max(current, nowMs);
  if (plan.until) return Math.max(plan.until, base);
  return base + plan.days * 24 * 60 * 60 * 1000;
}

module.exports = { PLANS, SEASON_END_ISO, getPlan, nextPlusUntil };
