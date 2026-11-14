# Fondasi Konten Premium

Bank soal sekarang dibaca dari Firestore, dengan dua tingkat akses:

| Tier | Siapa yang boleh baca | Disimpan di |
|------|----------------------|-------------|
| `free` | semua pengunjung (termasuk tanpa login) | Firestore `questions/{cat}_{nnn}` |
| `plus` | pengguna dengan custom claim `plus` / `plusUntil` | Firestore `questions/{cat}_{nnn}` |

`questions.js` **tidak dihapus** dan tetap dipakai sebagai fallback offline
(atau kalau Firestore tidak menjawab). Karena file itu publik, **jangan pernah**
menaruh soal berbayar di sana.

## Arsitektur

```
exam.html
 ├─ questions.js            fallback lokal (publik, hanya boleh berisi tier free)
 ├─ question-source.js      loader: baca questionMeta → getAll dokumen soal
 ├─ firebase-config.js      auth + firestore compat
 └─ app.js                  engine; memakai bank apa pun yang berhasil dimuat
```

- `questionMeta/{cpns|utbk}` menyimpan daftar id soal (`freeIds`, `plusIds`),
  `datasetVersion`, dan hitungan. Dokumen ini publik tetapi tidak memuat kunci
  jawaban.
- `question-source.js` hanya meminta `freeIds` untuk pengunjung biasa, dan
  `freeIds + plusIds` bila token punya claim Plus.
- `app.js` memakai `datasetVersion` dari Firestore, jadi resume ujian lama
  otomatis tidak dipakai kalau bank soal berubah.

## Langkah rilis

1. **Deploy rules** (wajib — tanpa ini semua soal tertolak `permission-denied`
   dan situs tetap memakai `questions.js`):

   ```
   firebase deploy --only firestore:rules
   ```

2. **Migrasi bank soal** (butuh service account, jangan commit filenya):

   ```
   npm install firebase-admin
   export GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json

   # 1. cek hasil dulu tanpa menulis apa pun
   node tools/migrate-questions.mjs

   # 2. tulis ke Firestore — default semua soal tetap gratis
   node tools/migrate-questions.mjs --apply
   ```

   Setelah langkah ini situs berperilaku sama seperti sebelumnya, hanya
   sumber soalnya Firestore. Pratinjau hasil ada di `tools/out/questions.json`.

3. **Aktifkan paywall saat siap**: tandai sebagian soal sebagai Plus.

   ```
   node tools/migrate-questions.mjs --free-per-section 8 --apply
   ```

   Artinya: 8 soal pertama tiap subtes (TWK/TIU/TKP, Penalaran/Literasi) tetap
   gratis, sisanya hanya untuk pelanggan. Nomor soal dan subtes tetap benar
   karena setiap soal menyimpan `index` dan `section` aslinya.

4. **Beri akses Plus** lewat backend tepercaya (Cloud Function / Admin SDK).
   Client tidak boleh dan tidak bisa menulis claim ini:

   ```js
   await admin.auth().setCustomUserClaims(uid, {
     plus: true,                                  // akses permanen / manual
     plusUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // atau 30 hari
   });
   // klien harus refresh token: firebase.auth().currentUser.getIdToken(true)
   ```

   `plusUntil` dihitung dalam **detik epoch**, dan rules membandingkannya dengan
   `request.time.toMillis()`, jadi masa aktif berakhir tanpa perlu cron job.

## Checkout otomatis (Midtrans) + login Google

Folder `functions/` berisi dua Cloud Function (`asia-southeast2`):

| Function | Jenis | Fungsi |
|----------|-------|--------|
| `createOrder` | callable | Membuat order `pending` + transaksi Snap, mengembalikan `redirectUrl` |
| `paymentNotification` | HTTPS | Webhook Midtrans: verifikasi signature, cocokkan nominal, aktifkan Plus |

Alur: klien login Google → pilih paket → `createOrder` → bayar di halaman Midtrans (QRIS/e-wallet) → webhook → order `paid`, `entitlements/{uid}` ditulis, custom claim `plus` + `plusUntil` dipasang → rules bank soal langsung membuka tier Plus.

### Prasyarat

1. Blaze plan (Cloud Functions + Secrets).
2. Akun Midtrans dengan Snap aktif. Midtrans production memerlukan data badan usaha; untuk uji coba gunakan Sandbox.
3. `npm install` di dalam `functions/` (dependensi Functions tidak ikut ter-commit).

### Konfigurasi

```bash
# 1. Server key dari dashboard Midtrans (jangan commit)
firebase functions:secrets:set MIDTRANS_SERVER_KEY

# 2. Mode sandbox (default) atau production
#    buat functions/.env (sudah di-.gitignore)
echo "MIDTRANS_IS_PRODUCTION=false" > functions/.env

# 3. Deploy
firebase deploy --only functions,firestore:rules
```

Setelah deploy, daftarkan URL webhook di Midtrans Dashboard → Settings → Payment Notification URL:

```
https://asia-southeast2-<project-id>.cloudfunctions.net/paymentNotification
```

Opsional: set `APP_URL` (default `https://www.ruangtryout.my.id`) untuk halaman `finish` di `functions/.env`.

### Riwayat pesanan

Halaman `pesanan.html` menampilkan semua pesanan milik pengguna yang login (maks. 50 terakhir) beserta status dan sisa masa aktif:

- Query klien: `orders.where('uid','==',uid).limit(50)`.
- Rules mengizinkan `list` hanya bila filter uid cocok **dan** `request.query.limit <= 50`, jadi tidak ada query yang bisa membaca order pengguna lain.
- Pesanan `pending` menampilkan tombol “Lanjutkan pembayaran” ke `redirectUrl` Midtrans yang tersimpan di order.
- Halaman ini `noindex` dan tidak memerlukan indeks komposit karena pengurutan dilakukan di klien.

### Status order

| Status | Arti |
|--------|------|
| `pending` | Order dibuat, menunggu pembayaran |
| `paid` | Signature sah + nominal cocok + settlement/capture; Plus aktif |
| `failed` | `expire`/`cancel`/`deny`/`failure`, atau gagal membuat transaksi |
| `review` | Pembayaran sah tetapi **nominal tidak cocok** — periksa manual di dashboard Midtrans |

Pengaturan paket, harga, dan akhir musim ada di `functions/lib/plans.js`. Harga di `harga.html` hanyalah tampilan; **server menagih dari `plans.js`**, jadi ubah keduanya bersamaan.

### Uji lokal

```bash
cd functions
npm test        # signature, pemetaan status, nominal, dan perhitungan masa aktif
```

Belum ada emulator Functions di sandbox ini (butuh Java), jadi alur ujung-ke-ujung (popup Google + Snap + webhook) harus diuji di project Firebase Anda dengan Midtrans Sandbox.

Tanpa `MIDTRANS_SERVER_KEY`, `createOrder` mengembalikan `failed-precondition` dan halaman harga menampilkan fallback ke alur kontak manual — situs tetap berfungsi.

## Catatan keamanan

- Kunci jawaban hanya ada di dokumen Firestore yang dijaga rules; tidak ada
  salinan premium di file statis.
- Rules menolak semua operasi tulis dari client (`create`, `update`, `delete`),
  jadi bank soal hanya bisa diubah lewat Admin SDK.
- Tidak ada server key, client key, atau token pembayaran di file statis; webhook memverifikasi `SHA512(order_id+status_code+gross_amount+serverKey)` dengan perbandingan waktu-konstan sebelum menyentuh data.
- Order dan entitlement hanya bisa ditulis oleh Admin SDK; klien hanya dapat membaca miliknya sendiri.
- Belum ada `App Check`. Untuk mencegah penyalahgunaan, aktifkan App Check dan
  verifikasi skor di backend sebelum fitur berbayar diluncurkan.
- Menonaktifkan JavaScript tidak membuka soal Plus: dokumennya memang tidak
  pernah dikirim ke browser pengguna non-Plus.
