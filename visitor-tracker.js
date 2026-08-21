/* =========================================================
   RUANGTRYOUT VISITOR TRACKER
   ---------------------------------------------------------
   Counts anonymous UNIQUE BROWSER/DEVICE visitors.

   - Total visitor: counted once per browser/localStorage ID.
   - Today visitor: same browser can count once again on a new day.
   - No name, email, IP, or fingerprint is stored by this script.
   - Uses an atomic Firestore transaction so visitor + aggregate
     counters are committed together.

   NOTE:
   This is a client-side counter. Firestore Rules constrain writes,
   but a determined attacker can still create many synthetic visitor
   IDs. For tamper-proof analytics, use a trusted backend/Cloud Function.
========================================================= */

(() => {
  'use strict';

  const VISITOR_ID_KEY = 'ruangtryout_visitor_id_v1';
  const GLOBAL_STATS_PATH = ['siteStats', 'global'];

  const totalElement = document.getElementById('stat-total-visitors');
  const todayElement = document.getElementById('stat-today-visitors');
  const noteElement = document.getElementById('visitor-counter-note');

  if (!totalElement && !todayElement) return;

  const formatNumber = value =>
    new Intl.NumberFormat('id-ID').format(Math.max(0, Number(value) || 0));

  function getJakartaDay() {
    // en-CA produces YYYY-MM-DD in modern browsers.
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date());
    } catch (_) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function randomVisitorId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID().replace(/-/g, '');
    }

    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }

    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 18)}`;
  }

  function getVisitorId() {
    try {
      let visitorId = localStorage.getItem(VISITOR_ID_KEY);

      if (!visitorId || !/^[A-Za-z0-9_-]{16,64}$/.test(visitorId)) {
        visitorId = randomVisitorId().slice(0, 64);
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
      }

      return visitorId;
    } catch (_) {
      // Privacy mode/storage blocked: use an ephemeral ID.
      return randomVisitorId().slice(0, 64);
    }
  }

  function render(total, today) {
    if (totalElement) totalElement.textContent = formatNumber(total);
    if (todayElement) todayElement.textContent = formatNumber(today);
  }

  function renderUnavailable() {
    if (totalElement && totalElement.textContent === '—') totalElement.textContent = '0';
    if (todayElement && todayElement.textContent === '—') todayElement.textContent = '0';
    if (noteElement) {
      noteElement.textContent = 'Statistik pengunjung sementara tidak tersedia.';
    }
  }

  async function registerVisitor() {
    if (typeof db === 'undefined' || !db || typeof firebase === 'undefined') {
      renderUnavailable();
      return;
    }

    const visitorId = getVisitorId();
    const day = getJakartaDay();
    const dayVisitId = `${day}_${visitorId}`;

    const visitorRef = db.collection('siteVisitors').doc(visitorId);
    const dayVisitRef = db.collection('siteVisitorDays').doc(dayVisitId);
    const globalRef = db.collection(GLOBAL_STATS_PATH[0]).doc(GLOBAL_STATS_PATH[1]);
    const dailyRef = db.collection('siteStats').doc(`daily_${day}`);

    try {
      await db.runTransaction(async transaction => {
        // Firestore transactions require reads before writes.
        const [visitorSnap, dayVisitSnap, globalSnap, dailySnap] = await Promise.all([
          transaction.get(visitorRef),
          transaction.get(dayVisitRef),
          transaction.get(globalRef),
          transaction.get(dailyRef)
        ]);

        const serverTime = firebase.firestore.FieldValue.serverTimestamp();

        if (!visitorSnap.exists) {
          transaction.set(visitorRef, {
            createdAt: serverTime,
            firstDay: day
          });

          if (globalSnap.exists) {
            transaction.update(globalRef, {
              totalVisitors: firebase.firestore.FieldValue.increment(1),
              lastVisitorId: visitorId,
              updatedAt: serverTime
            });
          } else {
            transaction.set(globalRef, {
              totalVisitors: 1,
              lastVisitorId: visitorId,
              updatedAt: serverTime
            });
          }
        }

        if (!dayVisitSnap.exists) {
          transaction.set(dayVisitRef, {
            visitorId,
            day,
            createdAt: serverTime
          });

          if (dailySnap.exists) {
            transaction.update(dailyRef, {
              visitors: firebase.firestore.FieldValue.increment(1),
              day,
              lastDayVisitId: dayVisitId,
              updatedAt: serverTime
            });
          } else {
            transaction.set(dailyRef, {
              visitors: 1,
              day,
              lastDayVisitId: dayVisitId,
              updatedAt: serverTime
            });
          }
        }
      });

      // Public counters stay live while the page is open.
      globalRef.onSnapshot(snapshot => {
        const data = snapshot.exists ? snapshot.data() : {};
        if (totalElement) totalElement.textContent = formatNumber(data.totalVisitors || 0);
      }, error => console.warn('Visitor global counter:', error));

      dailyRef.onSnapshot(snapshot => {
        const data = snapshot.exists ? snapshot.data() : {};
        if (todayElement) todayElement.textContent = formatNumber(data.visitors || 0);
      }, error => console.warn('Visitor daily counter:', error));

      if (noteElement) {
        noteElement.textContent = 'Statistik pengunjung unik • diperbarui otomatis • waktu Indonesia Barat (WIB).';
      }
    } catch (error) {
      console.warn('Visitor tracker:', error);

      // Even if registration is blocked, try to show existing public counters.
      try {
        const [globalSnap, dailySnap] = await Promise.all([
          globalRef.get(),
          dailyRef.get()
        ]);

        render(
          globalSnap.exists ? globalSnap.data().totalVisitors : 0,
          dailySnap.exists ? dailySnap.data().visitors : 0
        );
      } catch (_) {
        renderUnavailable();
      }
    }
  }

  registerVisitor();
})();
