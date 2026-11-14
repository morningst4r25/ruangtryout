/* =========================================================
   RUANGTRYOUT QUESTION SOURCE
   ---------------------------------------------------------
   Sumber bank soal untuk exam.html.

   - Sumber utama: Firestore `questions` (dokumen per soal) dengan
     metadata id di `questionMeta/{category}`.
   - Firestore Rules menentukan dokumen mana yang boleh dibaca:
     tier `free` untuk semua orang, tier `plus` hanya untuk token
     dengan custom claim `plus` (atau `plusUntil` yang belum lewat).
   - Modul ini hanya MEMINTA id yang diizinkan, tetapi keamanan
     sebenarnya tetap di Firestore Rules — bukan di file ini.
   - Bila Firestore tidak tersedia/no internet, dipakai dataset lokal
     `questions.js` supaya ujian tetap bisa dikerjakan.

   Catatan: konten berbayar JANGAN pernah ditaruh di questions.js,
   karena file itu publik dan dapat dibaca siapa pun.
========================================================= */
(() => {
  'use strict';

  const QUESTION_COLLECTION = 'questions';
  const META_COLLECTION = 'questionMeta';
  const BATCH_SIZE = 300;
  let lastError = null;

  function sectionFor(category, index) {
    if (category === 'cpns') return index < 30 ? 'TWK' : index < 65 ? 'TIU' : 'TKP';
    return index < 40 ? 'Penalaran & Kuantitatif' : 'Literasi';
  }

  function normalize(raw, category, fallbackIndex, fallbackTier) {
    const sourceIndex = Number.isInteger(Number(raw.index)) && raw.index !== undefined
      ? Number(raw.index)
      : fallbackIndex;
    const options = Array.isArray(raw.options) ? raw.options.map(String) : [];
    return {
      question: String(raw.question || ''),
      options,
      answer: Number(raw.answer) || 0,
      explanation: raw.explanation || 'Pembahasan belum tersedia.',
      section: raw.section || sectionFor(category, sourceIndex),
      sourceIndex,
      tier: raw.tier || fallbackTier || 'free'
    };
  }

  function localBank(category) {
    if (typeof quizCategories === 'undefined' || !quizCategories?.[category]?.questions) return [];
    return quizCategories[category].questions.map((q, i) => normalize(q, category, i, 'free'));
  }

  async function resolvePlan() {
    if (typeof auth === 'undefined' || !auth) return { signedIn: false, isPlus: false };
    try {
      if (typeof auth.authStateReady === 'function') await auth.authStateReady();
    } catch (_) {
      /* auth state tidak tersedia: anggap pengunjung biasa */
    }
    const user = auth.currentUser;
    if (!user) return { signedIn: false, isPlus: false };

    let claims = {};
    try {
      claims = (await user.getIdTokenResult()).claims || {};
    } catch (_) {
      /* token gagal dibaca: tetap anggap non-Plus */
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    const isPlus = claims.plus === true ||
      (typeof claims.plusUntil === 'number' && claims.plusUntil > nowSeconds);
    return { signedIn: true, isPlus, uid: user.uid };
  }

  async function fetchBank(category, plan) {
    const metaSnap = await db.collection(META_COLLECTION).doc(category).get();
    if (!metaSnap.exists) throw new Error('questionMeta/' + category + ' belum ada. Jalankan skrip migrasi.');
    const meta = metaSnap.data() || {};
    const freeIds = Array.isArray(meta.freeIds) ? meta.freeIds.slice() : [];
    const plusIds = Array.isArray(meta.plusIds) ? meta.plusIds.slice() : [];
    const ids = plan.isPlus ? freeIds.concat(plusIds) : freeIds;
    if (!ids.length) throw new Error('Bank soal Firestore masih kosong.');
    const plusIndices = Array.isArray(meta.plusIndices)
      ? meta.plusIndices.map(Number).filter(Number.isInteger)
      : plusIds.map(id => Number(String(id).split('_').pop())).filter(Number.isInteger);

    const docs = [];
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const refs = ids.slice(i, i + BATCH_SIZE).map(id => db.collection(QUESTION_COLLECTION).doc(id));
      const snaps = await db.getAll(...refs);
      snaps.forEach(snap => {
        if (snap.exists) docs.push(snap.data());
      });
    }

    const questions = docs
      .filter(doc => doc && doc.published !== false)
      .sort((a, b) => Number(a.index) - Number(b.index))
      .map((doc, i) => normalize(doc, category, i, doc.tier));

    if (!questions.length) throw new Error('Bank soal Firestore tidak mengembalikan soal yang bisa dibaca.');
    return {
      questions,
      source: 'firestore',
      datasetVersion: meta.datasetVersion || null,
      freeCount: freeIds.length,
      plusCount: plusIds.length,
      totalQuestions: freeIds.length + plusIds.length,
      premiumLocked: plan.isPlus ? 0 : plusIds.length,
      // Hanya nomor soal, tanpa isi/kunci: dipakai UI untuk menandai soal Plus.
      lockedQuestions: plan.isPlus
        ? []
        : plusIndices.map(index => ({
            index,
            number: index + 1,
            section: sectionFor(category, index)
          }))
    };
  }

  /**
   * Muat bank soal untuk satu kategori.
   * Selalu resolve (tidak pernah reject) agar exam.html tidak macet.
   * @param {'cpns'|'utbk'} category
   * @returns {Promise<{questions:Array,source:'firestore'|'local',datasetVersion:string|null,implicit?:boolean,premiumLocked:number,isPlus:boolean,error?:string}>}
   */
  async function load(category) {
    const local = localBank(category);
    let plan = { signedIn: false, isPlus: false };
    try {
      plan = await resolvePlan();
    } catch (_) {
      /* abaikan: fallback ke non-Plus */
    }

    if (typeof db === 'undefined' || !db) {
      return {
        questions: local,
        source: 'local',
        datasetVersion: null,
        isPlus: false,
        totalQuestions: local.length,
        premiumLocked: 0,
        lockedQuestions: [],
        error: 'Firestore tidak tersedia.'
      };
    }

    try {
      const bank = await fetchBank(category, plan);
      lastError = null;
      return { ...bank, isPlus: !!plan.isPlus };
    } catch (error) {
      lastError = error?.message || String(error);
      console.warn('[RuangTryout] Bank soal Firestore tidak tersedia, memakai dataset lokal:', lastError);
      return {
        questions: local,
        source: 'local',
        datasetVersion: null,
        isPlus: !!plan.isPlus,
        totalQuestions: local.length,
        premiumLocked: 0,
        lockedQuestions: [],
        error: lastError
      };
    }
  }

  window.RuangTryoutQuestionSource = { load, sectionFor, getLastError: () => lastError };
})();
