(() => {
  const HISTORY_KEY = 'ruangtryout_history_v1';
  let deferredInstallPrompt = null;

  function qs(id) { return document.getElementById(id); }
  function readJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  }
  function formatMode(mode) {
    const map = {full:'Simulasi Lengkap',mini:'Mini Tryout',daily:'Daily Challenge',twk:'Latihan TWK',tiu:'Latihan TIU',tkp:'Latihan TKP',penalaran:'Penalaran & Kuantitatif',literasi:'Literasi'};
    return map[mode] || mode;
  }
  function showToast(message) {
    let el = qs('rt-toast');
    if (!el) { el = document.createElement('div'); el.id='rt-toast'; el.className='rt-toast'; document.body.appendChild(el); }
    el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Mobile navigation.
  const menuButton = qs('mobile-menu-button');
  const mobileMenu = qs('mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      qs('menu-open-icon')?.classList.toggle('hidden');
      qs('menu-close-icon')?.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', String(!open));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      qs('menu-open-icon')?.classList.remove('hidden');
      qs('menu-close-icon')?.classList.add('hidden');
      menuButton.setAttribute('aria-expanded','false');
    }));
  }

  // PWA.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW:', err)));
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); deferredInstallPrompt = event;
    document.querySelectorAll('[data-install-app]').forEach(el => el.classList.remove('hidden'));
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    document.querySelectorAll('[data-install-app]').forEach(el => el.classList.add('hidden'));
    showToast('RuangTryout berhasil dipasang.');
  });
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-install-app]');
    if (!button || !deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    button.classList.add('hidden');
  });

  function findSavedExam() {
    const candidates = [];
    for (let i=0;i<localStorage.length;i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('ruangtryout_exam_')) continue;
      const data = readJSON(key, null);
      if (!data || !data.timeRemaining || data.timeRemaining <= 0 || !data.datasetVersion) continue;
      candidates.push({...data, storageKey:key});
    }
    return candidates.sort((a,b)=>(b.savedAt||0)-(a.savedAt||0))[0] || null;
  }

  function renderResume() {
    const wrap = qs('resume-exam-card');
    if (!wrap) return;
    const saved = findSavedExam();
    if (!saved) { wrap.classList.add('hidden'); return; }
    const cat = (saved.category || 'cpns').toLowerCase();
    const mode = saved.mode || 'full';
    const answered = Object.keys(saved.userAnswers || {}).length;
    const total = saved.questionsLength || 0;
    const m = Math.floor(saved.timeRemaining / 60); const s = saved.timeRemaining % 60;
    wrap.innerHTML = `
      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div class="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">↻</div>
            <div><div class="text-[10px] uppercase tracking-[.14em] font-black text-amber-700">Ujian belum selesai</div>
            <div class="mt-1 font-black text-slate-900">${cat === 'cpns' ? 'CPNS & PPPK' : 'UTBK / SNBT'} • ${escapeHtml(formatMode(mode))}</div>
            <div class="mt-1 text-xs text-slate-500">${answered}/${total} terjawab • sisa ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</div></div>
          </div>
          <a href="exam.html?cat=${encodeURIComponent(cat)}&mode=${encodeURIComponent(mode)}" class="inline-flex justify-center items-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-3 transition">Lanjutkan Ujian →</a>
        </div>
      </div>`;
    wrap.classList.remove('hidden');
  }

  function renderLocalProgress() {
    const history = readJSON(HISTORY_KEY, []);
    const total = history.length;
    const best = total ? Math.max(...history.map(x => Number(x.score)||0)) : 0;
    const avg = total ? Math.round(history.reduce((a,x)=>a+(Number(x.score)||0),0)/total) : 0;
    const map = {'local-attempts':total,'local-best-score':best,'local-average-score':avg};
    Object.entries(map).forEach(([id,val]) => { if (qs(id)) qs(id).textContent = val; });
  }

  async function renderRemoteStats() {
    if (!qs('stat-attempts') && !qs('leaderboard-preview')) return;
    if (typeof db === 'undefined' || !db) { renderLocalProgress(); return; }
    try {
      const snap = await db.collection('leaderboard').limit(500).get();
      const rows = snap.docs.map(doc => ({id:doc.id,...doc.data()}));
      const names = new Set(rows.map(r => String(r.name||'').trim().toLocaleLowerCase('id-ID')).filter(Boolean));
      const best = rows.reduce((m,r)=>Math.max(m,Number(r.score)||0),0);
      if (qs('stat-attempts')) qs('stat-attempts').textContent = rows.length.toLocaleString('id-ID');
      if (qs('stat-participants')) qs('stat-participants').textContent = names.size.toLocaleString('id-ID');
      if (qs('stat-best')) qs('stat-best').textContent = best;

      const preview = qs('leaderboard-preview');
      if (preview) {
        const bestMap = new Map();
        rows.filter(r => String(r.category||'').toUpperCase()==='CPNS').forEach(r => {
          const key=String(r.name||'Peserta').trim().toLocaleLowerCase('id-ID'); const old=bestMap.get(key);
          if (!old || Number(r.score)>Number(old.score)) bestMap.set(key,r);
        });
        const top=[...bestMap.values()].sort((a,b)=>(Number(b.score)||0)-(Number(a.score)||0)).slice(0,3);
        preview.innerHTML = top.length ? top.map((r,i)=>`<div class="flex items-center justify-between gap-3 py-3 ${i<top.length-1?'border-b border-slate-100':''}"><div class="flex items-center gap-3 min-w-0"><span class="w-8 h-8 rounded-xl ${i===0?'bg-amber-100 text-amber-700':i===1?'bg-slate-100 text-slate-600':'bg-orange-50 text-orange-700'} flex items-center justify-center text-xs font-black">${i+1}</span><span class="text-xs sm:text-sm font-bold text-slate-700 truncate">${escapeHtml(r.name||'Peserta')}</span></div><strong class="text-blue-600">${Math.round(Number(r.score)||0)}</strong></div>`).join('') : '<p class="text-xs text-slate-400 py-4">Belum ada peserta CPNS di leaderboard.</p>';
      }
    } catch (err) { console.warn('Stats:',err); renderLocalProgress(); }
  }

  function renderDaily() {
    const el = qs('daily-date-label');
    if (el) el.textContent = new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  }

  renderResume(); renderLocalProgress(); renderDaily(); renderRemoteStats();
  window.RuangTryoutSite = { showToast, readJSON };
})();
