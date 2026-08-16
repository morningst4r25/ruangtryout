# RuangTryout — Upgrade 16 Agustus 2026

Paket ini merupakan hasil review dan pengembangan menyeluruh dari source RuangTryout.

## Fitur utama yang ditambahkan / ditingkatkan

- Review jawaban lengkap beserta pembahasan setelah ujian.
- Filter review: semua, salah, benar, kosong, dan ditandai.
- Ulangi soal yang salah.
- Mode tryout lengkap, latihan per subtes, mini tryout, dan Daily Challenge.
- Autosave dan resume ujian per mode.
- Dashboard `progress.html` untuk riwayat lokal, skor terbaik, rata-rata, tren, streak, dan achievement.
- Leaderboard real-time dengan Top 3, skor terbaik per peserta, pencarian, percobaan terbaru, dan status peserta.
- Popup nama peserta setelah ujian selesai; leaderboard bersifat opsional.
- Pencegahan duplikasi attempt melalui `attemptId` dan aturan Firestore create-only.
- Materi belajar / artikel terstruktur untuk TWK, TIU, TKP, dan UTBK.
- CTA resume ujian, statistik, Daily Challenge, preview leaderboard, progress, materi, dan install PWA pada homepage.
- PWA lengkap: manifest, service worker, offline page, favicon, Apple touch icon, dan maskable icons.
- Halaman 404 dan offline.
- Halaman Terms, Privacy, About, Contact diperbarui dan diseragamkan secara visual.
- Fitur laporan soal melalui halaman Contact dengan pesan yang diprefill.
- SEO teknis: canonical, robots.txt, sitemap.xml, metadata Open Graph, dan structured data pada homepage.
- Tailwind runtime CDN dihilangkan; CSS telah dikompilasi menjadi `tailwind.css` untuk performa dan offline support.
- Logo dan maskot versi WebP ditambahkan untuk mengurangi ukuran transfer.
- Klaim yang terlalu kuat seperti "berstandar BKN" dan "100% HOTS" diperhalus agar tidak menyesatkan.

## Catatan keamanan penting

File `firestore.rules` sudah disertakan. Rules tersebut harus benar-benar di-deploy ke project Firebase agar berlaku.

Contoh melalui Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

Karena engine ujian dan bank soal berjalan di browser, frontend saja tidak dapat memberikan anti-cheat penuh. Untuk skala produksi, lihat `SECURITY.md`: gunakan Firebase App Check dan backend/Cloud Function untuk validasi skor, rate limiting, dan attempt token.

## Data lokal

Riwayat progress dan achievement menggunakan `localStorage`. Data ini bersifat per browser/per perangkat dan tidak memerlukan login.

## Entry point

- Homepage: `index.html`
- Ujian: `exam.html`
- Leaderboard: `leaderboard.html`
- Progress: `progress.html`
- Materi: `materi.html`

