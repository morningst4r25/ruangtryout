/* =========================================================
   RUANGTRYOUT — RIWAYAT PESANAN PLUS (pesanan.html)
   ---------------------------------------------------------
   Membaca `orders` milik pengguna yang login (query wajib
   where uid == uid + limit <= 50 sesuai firestore.rules) dan
   `entitlements/{uid}` untuk masa aktif.
========================================================= */
(() => {
  'use strict';

  const ORDER_LIMIT = 50;
  const PLAN_LABELS = {
    plus_30: 'Plus 30 hari',
    plus_90: 'Plus 90 hari',
    plus_season: 'Plus musim ujian'
  };
  const STATUS_META = {
    paid: { label: 'Lunas', cls: 'status-paid' },
    pending: { label: 'Menunggu pembayaran', cls: 'status-pending' },
    failed: { label: 'Gagal / kedaluwarsa', cls: 'status-failed' },
    review: { label: 'Perlu ditinjau', cls: 'status-review' }
  };

  const byId = id => document.getElementById(id);
  const state = { user: null, orders: [], entitlement: null, loading: false };

  const rupiah = value => 'Rp' + Number(value || 0).toLocaleString('id-ID');
  const planLabel = id => PLAN_LABELS[id] || 'Paket Plus';

  function formatDate(value) {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function entitlementUntil(entitlement) {
    const date = entitlement?.plusUntil?.toDate ? entitlement.plusUntil.toDate() : null;
    return date && date.getTime() > Date.now() ? date : null;
  }

  function daysLeft(date) {
    if (!date) return 0;
    return Math.max(1, Math.ceil((date.getTime() - Date.now()) / 86400000));
  }

  function setText(id, value) {
    const el = byId(id);
    if (el) el.textContent = value;
  }

  function renderAccount() {
    const loginBtn = byId('order-login');
    const logoutBtn = byId('order-logout');
    if (!state.user) {
      setText('order-account', 'Belum masuk');
      setText('order-account-note', 'Masuk dengan Google untuk melihat pesanan dan masa aktif Plus.');
      loginBtn?.classList.remove('hidden');
      logoutBtn?.classList.add('hidden');
      return;
    }
    setText('order-account', state.user.displayName || state.user.email || 'Akun Google aktif');
    setText('order-account-note', state.user.email || '');
    loginBtn?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
  }

  function renderEntitlement() {
    const card = byId('entitlement-card');
    if (!card) return;
    const until = entitlementUntil(state.entitlement);

    if (!state.user) {
      card.innerHTML = '<div class="text-[10px] uppercase tracking-[.14em] font-black text-slate-400">Status Plus</div><p class="mt-2 text-sm font-black text-slate-950">Belum masuk</p><p class="mt-1 text-xs leading-5 text-slate-500">Status masa aktif muncul setelah kamu masuk dengan Google.</p>';
      return;
    }

    if (until) {
      card.innerHTML = `
        <div class="text-[10px] uppercase tracking-[.14em] font-black text-emerald-600">Plus aktif</div>
        <p class="mt-2 text-2xl font-black text-slate-950">${daysLeft(until)} hari lagi</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">Berlaku sampai ${formatDate(until)} · paket ${planLabel(state.entitlement?.plan)}</p>
        <a href="exam.html?cat=cpns&mode=mini" class="mt-4 inline-flex bg-slate-950 hover:bg-slate-800 text-white text-xs font-black px-4 py-2.5 rounded-xl">Mulai latihan →</a>`;
      return;
    }

    if (state.entitlement) {
      card.innerHTML = `
        <div class="text-[10px] uppercase tracking-[.14em] font-black text-slate-400">Status Plus</div>
        <p class="mt-2 text-sm font-black text-slate-950">Masa aktif berakhir</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">Terakhir berlaku sampai ${formatDate(state.entitlement?.plusUntil)}. Pilih paket untuk memperpanjang.</p>
        <a href="harga.html" class="mt-4 inline-flex bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2.5 rounded-xl">Perpanjang Plus →</a>`;
      return;
    }

    card.innerHTML = `
      <div class="text-[10px] uppercase tracking-[.14em] font-black text-slate-400">Status Plus</div>
      <p class="mt-2 text-sm font-black text-slate-950">Belum berlangganan</p>
      <p class="mt-1 text-xs leading-5 text-slate-500">Bank soal gratis tetap bisa dipakai. Plus membuka seluruh bank soal.</p>
      <a href="harga.html" class="mt-4 inline-flex bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2.5 rounded-xl">Lihat paket →</a>`;
  }

  function orderCard(order) {
    const meta = STATUS_META[order.status] || { label: order.status || 'Tidak diketahui', cls: 'status-unknown' };
    const canResume = order.status === 'pending' && typeof order.redirectUrl === 'string' && order.redirectUrl.startsWith('https://');
    return `
      <article class="bg-white border border-slate-200 rounded-2xl p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-[10px] uppercase tracking-[.14em] font-black text-slate-400">${formatDate(order.createdAt)}</div>
            <h3 class="mt-1 text-sm font-black text-slate-950">${planLabel(order.plan)}</h3>
            <p class="mt-1 text-[11px] font-semibold text-slate-500">${rupiah(order.amount)} · ID <span class="font-mono">${String(order.orderId || '').slice(-10)}</span>${order.paymentType ? ` · ${String(order.paymentType).toUpperCase()}` : ''}</p>
          </div>
          <span class="status-badge shrink-0 ${meta.cls}">${meta.label}</span>
        </div>
        ${order.status === 'paid' ? `<p class="order-note order-note-paid">Pembayaran diterima${order.paidAt ? ` pada ${formatDate(order.paidAt)}` : ''}. Akses Plus aktif otomatis.</p>` : ''}
        ${order.status === 'review' ? '<p class="order-note order-note-review">Pembayaran terdeteksi tetapi nominal tidak cocok. Tim akan memeriksa; hubungi kontak bila lebih dari 1×24 jam.</p>' : ''}
        ${order.status === 'failed' ? `<p class="order-note order-note-failed">${order.failureReason ? 'Pembayaran tidak selesai. ' : 'Pembayaran kedaluwarsa atau dibatalkan. '}Silakan buat pesanan baru dari halaman harga.</p>` : ''}
        ${canResume ? `<a href="${order.redirectUrl}" rel="noopener" class="mt-3 inline-flex bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black px-4 py-2.5 rounded-lg">Lanjutkan pembayaran →</a>` : ''}
      </article>`;
  }

  function renderOrders(message) {
    const host = byId('orders-list');
    if (!host) return;

    if (!state.user) {
      host.innerHTML = '<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center"><p class="text-sm font-bold text-slate-700">Masuk dulu untuk melihat riwayat pesanan.</p><p class="mt-1 text-xs text-slate-500">Riwayat disimpan pada akun Google yang kamu gunakan saat membeli.</p></div>';
      return;
    }
    if (state.loading) {
      host.innerHTML = '<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">Memuat pesanan...</div>';
      return;
    }
    if (message) {
      host.innerHTML = `<div class="bg-white border border-amber-200 rounded-2xl p-6 text-center text-xs leading-6 text-amber-800">${message}</div>`;
      return;
    }
    if (!state.orders.length) {
      host.innerHTML = '<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center"><p class="text-sm font-bold text-slate-700">Belum ada pesanan.</p><p class="mt-1 text-xs text-slate-500">Pesanan paket Plus akan tampil di sini beserta status pembayarannya.</p><a href="harga.html" class="mt-4 inline-flex bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2.5 rounded-xl">Lihat paket Plus →</a></div>';
      return;
    }
    host.innerHTML = state.orders.map(orderCard).join('');
  }

  async function loadOrders() {
    if (typeof db === 'undefined' || !db || !state.user) return;
    state.loading = true;
    renderOrders();
    try {
      const snap = await db.collection('orders')
        .where('uid', '==', state.user.uid)
        .limit(ORDER_LIMIT)
        .get();
      state.orders = snap.docs
        .map(doc => doc.data())
        .sort((a, b) => {
          const at = a.createdAt?.toMillis?.() || 0;
          const bt = b.createdAt?.toMillis?.() || 0;
          return bt - at;
        });
      state.loading = false;
      renderOrders();
    } catch (error) {
      state.loading = false;
      const denied = error?.code === 'permission-denied';
      renderOrders(denied
        ? 'Riwayat pesanan belum bisa dibaca. Firestore Rules terbaru (izin <code>list</code> untuk order milik sendiri) perlu dideploy.'
        : 'Riwayat pesanan gagal dimuat. Periksa koneksi lalu muat ulang halaman.');
    }
  }

  async function loadEntitlement() {
    if (typeof db === 'undefined' || !db || !state.user) {
      state.entitlement = null;
      return;
    }
    try {
      const snap = await db.collection('entitlements').doc(state.user.uid).get();
      state.entitlement = snap.exists ? snap.data() : null;
    } catch (_) {
      state.entitlement = null;
    }
  }

  async function refresh() {
    if (typeof auth === 'undefined' || !auth) return;
    state.user = auth.currentUser;
    renderAccount();
    await Promise.all([loadEntitlement(), loadOrders()]);
    renderEntitlement();
  }

  async function signIn() {
    if (typeof loginWithGoogle !== 'function') {
      renderOrders('Login belum tersedia. Muat ulang halaman lalu coba lagi.');
      return;
    }
    try {
      await loginWithGoogle();
      await refresh();
    } catch (_) {
      renderOrders('Login belum berhasil. Jika pop-up diblokir, izinkan pop-up untuk situs ini lalu coba lagi.');
    }
  }

  function bind() {
    byId('order-login')?.addEventListener('click', async () => {
      const button = byId('order-login');
      button.disabled = true;
      button.textContent = 'Membuka Google...';
      await signIn();
      button.disabled = false;
      button.textContent = 'Masuk dengan Google';
    });
    byId('order-logout')?.addEventListener('click', async () => {
      if (typeof logoutUser === 'function') await logoutUser();
      state.user = null;
      state.orders = [];
      state.entitlement = null;
      renderAccount();
      renderEntitlement();
      renderOrders();
    });
    byId('order-refresh')?.addEventListener('click', () => refresh());
  }

  function init() {
    bind();
    if (typeof auth === 'undefined' || !auth) {
      renderOrders('Firebase gagal dimuat, riwayat pesanan tidak tersedia saat ini.');
      renderEntitlement();
      return;
    }
    auth.onAuthStateChanged(() => { refresh(); });
  }

  // Dipakai halaman ini; diekspos untuk memudahkan pemeriksaan manual.
  window.RuangTryoutOrders = { refresh, renderOrders, renderEntitlement, state };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
