# RuangTryout

Platform latihan CPNS/PPPK dan UTBK/SNBT berbasis web statis + Firebase Firestore.

## Fitur utama
- Simulasi penuh, mini tryout, latihan per subtes, dan Daily Challenge.
- Timer, autosave/resume, tandai soal, keyboard shortcut, dan grid navigasi.
- Hasil 0–100, pembahasan setiap soal, filter review, laporkan soal, dan ulangi soal salah.
- Dashboard `progress.html` berbasis `localStorage`: histori, tren skor, streak, dan achievement.
- Leaderboard real-time dengan nama opsional.
- Library materi belajar dan 10 artikel mandiri.
- PWA: manifest, ikon asli, service worker, install prompt, offline page.
- SEO: canonical, sitemap, robots, halaman legal, 404.

## Deploy
Semua file dapat di-host sebagai static site (mis. GitHub Pages/Netlify). Pastikan custom domain mengarah ke folder root.

### Firestore Rules
File `firestore.rules` berisi rule minimum untuk leaderboard guest. Rule harus diterapkan melalui Firebase Console/CLI; menaruh file di hosting tidak otomatis menerapkannya.

> Catatan keamanan: validasi Firestore membatasi bentuk/rentang data, tetapi skor masih dihitung di browser. Untuk leaderboard yang benar-benar anti-cheat, verifikasi hasil harus dipindahkan ke backend/Cloud Function + App Check.

## Struktur penting
- `index.html` — homepage
- `exam.html` + `app.js` + `questions.js` — engine ujian
- `leaderboard.html` — papan peringkat
- `progress.html` — dashboard lokal
- `materi.html` + `materi-*.html` — library belajar
- `site.js` — PWA/homepage helpers
- `manifest.json`, `sw.js`, `offline.html` — PWA
- `privacy.html`, `terms.html`, `contact.html`, `about.html` — trust/legal

## Catatan skor
Skor yang tampil adalah skor latihan skala 0–100 dan bukan nilai resmi BKN/SNPMB.
