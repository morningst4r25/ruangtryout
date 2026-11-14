/* =========================================================
   RUANGTRYOUT PLUS — login & checkout (harga.html)
   ---------------------------------------------------------
   - Login Google memakai helper di firebase-config.js.
   - Status Plus dibaca dari `entitlements/{uid}` (hanya pemilik).
   - Checkout memanggil Cloud Function `createOrder`, lalu mengarahkan
     ke halaman pembayaran Midtrans. Tidak ada server key / client key
     di browser.
   - Bila Functions belum dideploy atau Midtrans belum dikonfigurasi,
     tombol kembali ke alur kontak manual (href asli tetap dipertahankan).
========================================================= */
(() => {
  'use strict';

  const REGION = 'asia-southeast2';
  const POLL_ATTEMPTS = 6;
  const POLL_DELAY_MS = 4000;

  const state = { user: null, entitlement: null, busy: false };
  let functionsInstance = null;
  let pollTimer = null;

  const byId = id => document.getElementById(id);

  function feedback(message, kind = 'info') {
    const box = byId('plus-feedback');
    if (!box) return;
    box.className = `mt-3 rounded-xl border px-4 py-3 text-xs leading-5 ${
      kind === 'error'
        ? 'border-rose-200 bg-rose-50 text-rose-800'
        : kind === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-blue-200 bg-blue-50 text-blue-800'
    }`;
    box.innerHTML = message;
    box.classList.remove('hidden');
  }

  function clearFeedback() {
    byId('plus-feedback')?.classList.add('hidden');
  }

  function getFunctions() {
    if (functionsInstance) return functionsInstance;
    if (typeof firebase === 'undefined' || typeof firebase.functions !== 'function') return null;
    try {
      functionsInstance = firebase.app().functions(REGION);
      return functionsInstance;
    } catch (_) {
      return null;
    }
  }

  function formatPlusUntil(entitlement) {
    const ts = entitlement?.plusUntil;
    if (!ts || typeof ts.toDate !== 'function') return null;
    try {
      return ts.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (_) {
      return null;
    }
  }

  function isPlusActive(entitlement) {
    const until = entitlement?.plusUntil?.toDate ? entitlement.plusUntil.toDate() : null;
    return !!until && until.getTime() > Date.now();
  }

  function renderAccount() {
    const account = byId('plus-account');
    const status = byId('plus-status');
    const loginBtn = byId('plus-login');
    const logoutBtn = byId('plus-logout');
    if (!account || !status) return;

    if (!state.user) {
      account.textContent = 'Belum masuk';
      status.textContent = 'Masuk dengan Google untuk membeli paket Plus dan menyimpan status akses.';
      if (loginBtn) {
        loginBtn.classList.remove('hidden');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Masuk dengan Google';
      }
      logoutBtn?.classList.add('hidden');
      return;
    }

    account.textContent = state.user.displayName || state.user.email || 'Akun Google aktif';

    if (isPlusActive(state.entitlement)) {
      const until = formatPlusUntil(state.entitlement) || 'masa aktif berjalan';
      status.innerHTML = `<span class="text-emerald-700 font-black">Plus aktif</span> · berlaku sampai ${until}`;
    } else if (state.entitlement && !isPlusActive(state.entitlement)) {
      status.textContent = 'Masa aktif Plus sudah berakhir. Pilih paket di bawah untuk memperpanjang.';
    } else {
      status.textContent = 'Akun ini belum punya akses Plus. Pilih paket di bawah untuk mulai.';
    }

    loginBtn?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
  }

  async function loadEntitlement(user) {
    if (typeof db === 'undefined' || !db || !user) return null;
    try {
      const snap = await db.collection('entitlements').doc(user.uid).get();
      return snap.exists ? snap.data() : null;
    } catch (error) {
      console.warn('[RuangTryout] Status Plus tidak bisa dibaca:', error?.message || error);
      return null;
    }
  }

  async function refresh() {
    if (typeof auth === 'undefined' || !auth) return;
    state.user = auth.currentUser;
    state.entitlement = state.user ? await loadEntitlement(state.user) : null;
    renderAccount();
  }

  async function signIn() {
    if (typeof loginWithGoogle !== 'function') {
      feedback('Login belum tersedia. Muat ulang halaman lalu coba lagi.', 'error');
      return false;
    }
    try {
      await loginWithGoogle();
      await refresh();
      // Token baru memuat claim Plus yang mungkin baru dipasang.
      try { await auth.currentUser?.getIdToken(true); } catch (_) {}
      return true;
    } catch (_) {
      return false;
    }
  }

  async function signOut() {
    if (typeof logoutUser === 'function') await logoutUser();
    state.user = null;
    state.entitlement = null;
    renderAccount();
    clearFeedback();
  }

  function watchForActivation() {
    clearInterval(pollTimer);
    let attempts = 0;
    pollTimer = setInterval(async () => {
      attempts += 1;
      await refresh();
      if (isPlusActive(state.entitlement)) {
        clearInterval(pollTimer);
        try { await auth.currentUser?.getIdToken(true); } catch (_) {}
        feedback('Pembayaran terkonfirmasi. Akses Plus sudah aktif — muat ulang halaman ujian.', 'success');
      } else if (attempts >= POLL_ATTEMPTS) {
        clearInterval(pollTimer);
      }
    }, POLL_DELAY_MS);
  }

  async function checkout(planId, button) {
    if (state.busy) return;
    const fn = getFunctions();
    if (!fn) {
      feedback('Checkout otomatis belum tersedia. Gunakan tombol ajukan akses lewat halaman kontak.', 'error');
      return;
    }

    state.busy = true;
    const originalText = button.textContent;
    button.textContent = 'Menyiapkan pembayaran...';
    button.classList.add('pointer-events-none', 'opacity-70');
    clearFeedback();

    try {
      const result = await fn.httpsCallable('createOrder')({ plan: planId });
      const redirectUrl = result?.data?.redirectUrl;
      if (redirectUrl) {
        feedback('Mengalihkan ke halaman pembayaran aman...');
        window.location.href = redirectUrl;
        return;
      }
      feedback('Tautan pembayaran tidak tersedia. Hubungi kami lewat halaman kontak.', 'error');
    } catch (error) {
      const code = error?.code || '';
      if (code === 'unauthenticated') {
        feedback('Sesi login berakhir. Masuk lagi dengan Google lalu ulangi.', 'error');
      } else if (code === 'failed-precondition') {
        feedback('Checkout otomatis belum aktif. Gunakan tautan <a class="font-black underline" href="contact.html">kontak</a> untuk mengajukan akses Plus.', 'info');
      } else {
        console.error('[RuangTryout] Checkout gagal:', error);
        feedback('Pembayaran belum bisa dimulai. Coba lagi atau ajukan lewat <a class="font-black underline" href="contact.html">kontak</a>.', 'error');
      }
    } finally {
      state.busy = false;
      button.textContent = originalText;
      button.classList.remove('pointer-events-none', 'opacity-70');
    }
  }

  function bind() {
    byId('plus-login')?.addEventListener('click', async () => {
      const button = byId('plus-login');
      button.disabled = true;
      button.textContent = 'Membuka Google...';
      const ok = await signIn();
      button.disabled = false;
      if (!ok) {
        button.textContent = 'Masuk dengan Google';
        feedback('Login belum berhasil. Jika pop-up diblokir, izinkan pop-up untuk situs ini.', 'error');
      }
    });

    byId('plus-logout')?.addEventListener('click', signOut);

    document.querySelectorAll('[data-plan]').forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault();
        if (!state.user) {
          const ok = await signIn();
          if (!ok) return;
        }
        await checkout(button.getAttribute('data-plan'), button);
      });
    });
  }

  async function init() {
    bind();

    if (typeof auth === 'undefined' || !auth) {
      feedback('Login belum tersedia karena Firebase gagal dimuat. Gunakan tombol ajukan akses lewat kontak.', 'error');
      return;
    }

    auth.onAuthStateChanged(async user => {
      state.user = user;
      state.entitlement = user ? await loadEntitlement(user) : null;
      renderAccount();
      if (isPlusActive(state.entitlement)) {
        feedback('Akses Plus aktif. Bank soal bertanda Plus sudah terbuka di halaman ujian.', 'success');
      }
    });

    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'selesai') {
      feedback('Pembayaran diterima. Status Plus diperbarui otomatis dalam beberapa detik.', 'info');
      watchForActivation();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
