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

Fitur berbayar (Bank soal Plus, pembayaran Midtrans, riwayat pesanan) memerlukan Cloud Functions + Firestore Rules; langkah deploy lengkapnya ada di [`PREMIUM_CONTENT_SETUP.md`](PREMIUM_CONTENT_SETUP.md#langkah-deploy-checklist).

### Versi aset
Semua `style.css`, `tailwind.css`, dan script lokal direferensikan dengan `?v=<hash>` yang diturunkan dari isi aset. Versi hanya berubah bila isi aset berubah.
- `node tools/bump-assets.mjs` — samakan versi di seluruh `*.html` dan `CACHE_NAME` di `sw.js`.
- `node tools/bump-assets.mjs --check` — exit 1 bila belum sinkron (cocok untuk CI).
- `node tools/install-hooks.mjs` — pasang hook pre-commit sekali per clone: hook otomatis menjalankan bump dan ikut men-stage berkas yang versinya berubah setiap kali commit menyentuh `*.html`, `sw.js`, atau aset lokal. Direktori `.git` tidak ikut ter-commit, jadi pasang ulang setelah clone baru; lewati sekali jalan dengan `git commit --no-verify`.

CI (`.github/workflows/ci.yml`) menjalankan `node tools/bump-assets.mjs --check` dan `npm test` di `functions/` pada setiap push dan pull request.

Deploy produksi dijalankan manual lewat `.github/workflows/deploy.yml` (Actions → Deploy (manual)) memakai secret `FIREBASE_SERVICE_ACCOUNT`; langkah persiapannya ada di `PREMIUM_CONTENT_SETUP.md`.

### Firestore Rules
File `firestore.rules` berisi rule minimum untuk leaderboard guest. Rule harus diterapkan melalui Firebase Console/CLI; menaruh file di hosting tidak otomatis menerapkannya.

Validasi sintaks rule tanpa menyentuh project sungguhan (butuh Java untuk emulator):

```sh
cd tools && npm ci && cd ..
npx firebase-tools emulators:exec --only firestore --project demo-ruangtryout "node tools/check-rules.mjs"
```

Skrip mengirim `firestore.rules` ke emulator, sehingga error kompilasi tampil dengan nomor baris sebelum `firebase deploy`.

Unit test pagar akses (soal Plus, order, entitlement) memakai emulator yang sama:

```sh
npx firebase-tools emulators:exec --only firestore --project demo-ruangtryout "npm --prefix tools test"
```

CI menjalankan keduanya: kompilasi rules lalu unit test akses.

> Catatan keamanan: validasi Firestore membatasi bentuk/rentang data, tetapi skor masih dihitung di browser. Untuk leaderboard yang benar-benar anti-cheat, verifikasi hasil harus dipindahkan ke backend/Cloud Function + App Check.

## Struktur penting
- `index.html` — homepage
- `exam.html` + `app.js` + `questions.js` — engine ujian
- `leaderboard.html` — papan peringkat
- `progress.html` — dashboard lokal
- `materi.html` + `materi-*.html` — library belajar
- `site.js` — PWA/homepage helpers
- `tools/` — `bump-assets.mjs` (versi aset), `git-hooks/` + `install-hooks.mjs` (hook pre-commit)
- `manifest.json`, `sw.js`, `offline.html` — PWA
- `privacy.html`, `terms.html`, `contact.html`, `about.html` — trust/legal

## Catatan skor
Skor yang tampil adalah skor latihan skala 0–100 dan bukan nilai resmi BKN/SNPMB.
