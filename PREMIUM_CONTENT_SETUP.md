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

## Langkah deploy (checklist)

Jalankan berurutan dari root repo, di mesin yang bisa membuka browser untuk
`firebase login` (bukan dari sandbox cloud tanpa browser). Ganti
`<project-id>` dengan id project Firebase Anda.

> **Situs statis (Vercel):** frontend ter-deploy otomatis lewat `.github/workflows/vercel-deploy.yml` setiap push ke `main`, memakai secret `VERCEL_TOKEN` + variable `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`. Tanpa ketiganya workflow hanya memberi peringatan dan tidak mengubah produksi. Deploy backend tetap langkah manual di bawah.

### 1. Prasyarat

- Node.js 20 (sama dengan `firebase.json` → `runtime: nodejs20`).
- Firebase CLI: `npm install -g firebase-tools` (atau pakai `npx firebase-tools`).
- Project Firebase pada paket **Blaze** (Cloud Functions + Secret Manager).
- Akun Midtrans dengan Snap aktif. Untuk uji coba pakai **Sandbox**
  (`MIDTRANS_IS_PRODUCTION=false`); production memerlukan data badan usaha.

```bash
firebase login
firebase use <project-id>          # atau tambahkan --project <project-id> di setiap perintah
```

### 2. Cek dulu di lokal (tanpa menyentuh project)

```bash
cd functions && npm ci && npm test && cd ..
npx firebase-tools emulators:exec --only firestore --project demo-ruangtryout \
  "node tools/check-rules.mjs && npm --prefix tools test"
```

Harapan: 11 test Functions lulus, rules lolos kompilasi, 21 test akses rules
lulus. CI (`.github/workflows/ci.yml`) menjalankan pemeriksaan yang sama.

### 3. Simpan server key Midtrans sebagai secret

Ambil **Server Key** dari dashboard Midtrans (Sandbox: `SB-Mid-server-…`).

```bash
firebase functions:secrets:set MIDTRANS_SERVER_KEY
# tempel nilai saat diminta; jangan pernah menaruhnya di .env, kode, atau repo
```

Verifikasi bahwa secret sudah ada (nilainya tidak akan ditampilkan penuh):

```bash
firebase functions:secrets:access MIDTRANS_SERVER_KEY | head -c 12; echo
```

### 4. Siapkan `functions/.env`

File ini dibaca saat deploy dan sudah di-`.gitignore`.

```bash
printf 'MIDTRANS_IS_PRODUCTION=false\n' > functions/.env
# opsional: halaman finish Snap
# echo 'APP_URL=https://domain-anda.example' >> functions/.env
```

`MIDTRANS_IS_PRODUCTION` harus cocok dengan jenis server key. Key sandbox +
mode production (atau sebaliknya) membuat Snap menolak transaksi dan signature
webhook tidak akan pernah cocok.

### 5. Deploy Functions + Firestore Rules

```bash
firebase deploy --only functions,firestore:rules
```

Yang diharapkan muncul: dua function di region `asia-southeast2`
(`createOrder`, `paymentNotification`) dan satu release rules. Rules wajib
ikut deploy — tanpa itu semua pembacaan soal ditolak `permission-denied` dan
situs tetap memakai `questions.js`.

#### Deploy lewat GitHub Actions (opsional)

Alternatif langkah 5 tanpa terminal lokal — `.github/workflows/deploy.yml`, dijalankan manual dari tab **Actions → Deploy (manual) → Run workflow**.

Persiapan sekali:

1. Google Cloud Console → IAM → Service Accounts → buat service account, beri role **Firebase Admin** (tambahkan role lain bila deploy Functions ditolak karena izin kurang), lalu buat key **JSON**.
2. GitHub repo → **Settings → Secrets and variables → Actions**:
   - Secret `FIREBASE_SERVICE_ACCOUNT` = isi file JSON tersebut (tempel seluruh isinya).
   - Variable `FIREBASE_PROJECT_ID` = id project (opsional bila selalu mengisi input `project_id`).

Input workflow saat menjalankan:

| Input | Arti |
|---|---|
| `targets` | `functions,firestore:rules` (default), `functions`, atau `firestore:rules` |
| `project_id` | Override project; kosong = pakai variable |
| `midtrans_production` | `true` menulis `MIDTRANS_IS_PRODUCTION=true` ke `functions/.env` sebelum deploy |
| `run_tests` | Jalankan `npm test` di `functions/` sebelum deploy (default aktif) |

Kredensial ditulis ke `$RUNNER_TEMP` (di luar repo), tidak pernah masuk commit atau artefak. Workflow memakai environment `production`, jadi bisa ditambahkan aturan approval di Settings → Environments. Secret Midtrans tetap disimpan di Secret Manager Firebase (langkah 3), bukan di GitHub.

### 6. Verifikasi endpoint webhook hidup

```bash
# ganti <project-id>
curl -i -X POST \
  https://asia-southeast2-<project-id>.cloudfunctions.net/paymentNotification \
  -H 'Content-Type: application/json' -d '{}'
```

- `POST` tanpa `order_id` → **200** `{"ok":false,"reason":"missing-order-id"}`
  (artinya function hidup dan secret terbaca).
- `GET` → **405** `{"ok":false,"reason":"method-not-allowed"}`.

### 7. Daftarkan URL webhook di Midtrans

Dashboard Midtrans → **Settings → Configuration → Payment Notification URL**
(apabila memakai Sandbox, lakukan di dashboard Sandbox):

```
https://asia-southeast2-<project-id>.cloudfunctions.net/paymentNotification
```

Tanpa langkah ini, pembayaran berhasil tetapi order tetap `pending`.

### 8. Migrasi bank soal

Butuh service account (jangan commit filenya; sudah di-`.gitignore`).

```bash
npm install firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json

# 1. pratinjau, tidak menulis apa pun
node tools/migrate-questions.mjs

# 2. tulis ke Firestore — default semua soal tetap gratis
node tools/migrate-questions.mjs --apply
```

Setelah langkah ini situs berperilaku sama seperti sebelumnya, hanya sumber
soalnya Firestore. Pratinjau hasil ada di `tools/out/questions.json`.

### 9. Uji alur pembayaran di Sandbox

1. Buka `harga.html` di domain yang sudah terdaftar di Firebase
   **Authentication → Settings → Authorized domains**, lalu masuk dengan Google.
2. Pilih paket (mis. 30 hari), lanjut ke halaman Snap, dan selesaikan
   pembayaran memakai metode/kartu uji yang tersedia di dashboard Sandbox.
3. Periksa Firestore: order berubah `pending` → `paid`, dan
   `entitlements/{uid}` berisi `plusUntil`.
4. Muat ulang `harga.html` dan `pesanan.html`: status Plus tampil, soal bertanda
   🔒 terbuka setelah token di-refresh (`getIdToken(true)` dilakukan klien saat
   perlu).
5. Cek log function:

   ```bash
   firebase functions:log --only paymentNotification
   ```

   Harapan: `Plus diaktifkan` dengan `orderId` yang sama.

### 10. Aktifkan paywall saat siap

```bash
node tools/migrate-questions.mjs --free-per-section 8 --apply
```

Artinya: 8 soal pertama tiap subtes (TWK/TIU/TKP, Penalaran/Literasi) tetap
gratis, sisanya hanya untuk pelanggan. Nomor soal dan subtes tetap benar karena
setiap soal menyimpan `index` dan `section` aslinya.

Membalikkannya (semua soal gratis lagi) cukup dengan
`node tools/migrate-questions.mjs --apply` tanpa flag.

### 11. Beri akses Plus manual

Lewat backend tepercaya (Admin SDK / Cloud Function). Client tidak bisa dan
tidak boleh menulis claim ini:

```js
await admin.auth().setCustomUserClaims(uid, {
  plus: true,                                                   // permanen / manual
  plusUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30  // atau 30 hari
});
// klien harus refresh token: firebase.auth().currentUser.getIdToken(true)
```

`plusUntil` dihitung dalam **detik epoch**, dan rules membandingkannya dengan
`request.time.toMillis()`, jadi masa aktif berakhir tanpa perlu cron job.

### 12. Naik ke production Midtrans

1. Ganti secret ke server key production:
   `firebase functions:secrets:set MIDTRANS_SERVER_KEY`.
2. Set `MIDTRANS_IS_PRODUCTION=true` di `functions/.env`.
3. Deploy ulang: `firebase deploy --only functions`.
4. Daftarkan URL webhook yang sama di dashboard Midtrans **production**.
5. Ulangi uji langkah 9 dengan nominal kecil; pastikan order production benar
   berstatus `paid`.

### 13. Rollback

| Keadaan | Tindakan |
|---|---|
| Perlu mematikan checkout otomatis | `firebase functions:delete createOrder --region asia-southeast2`; halaman harga kembali menampilkan alur kontak manual |
| Paywall dianggap terlalu ketat | `node tools/migrate-questions.mjs --apply` (semua soal gratis) |
| Rules baru bermasalah | Kembalikan rules sebelumnya lewat Firebase Console → Firestore → Rules → riwayat versi |
| Pembayaran ganda / nominal aneh | Cek order berstatus `review` di Firestore, cocokkan dengan dashboard Midtrans |

### 14. Troubleshooting

| Gejala | Penyebab umum |
|---|---|
| `failed-precondition` saat klik beli | `MIDTRANS_SERVER_KEY` belum di-set atau function belum di-deploy |
| Webhook membalas `401` | Server key salah, atau key sandbox dipakai dengan mode production |
| Order tetap `pending` setelah bayar | URL webhook belum didaftarkan / salah region |
| Order `review` | Nominal `gross_amount` tidak sama dengan `plans.js`; periksa manual |
| Soal tertutup padahal sudah bayar | Rules belum ter-deploy, atau token belum di-refresh sehingga claim Plus belum terbaca |
| `permission-denied` membaca order | Bukan pemilik order, atau query tanpa `limit ≤ 50` |

## Checkout otomatis (Midtrans) + login Google

Folder `functions/` berisi dua Cloud Function (`asia-southeast2`):

| Function | Jenis | Fungsi |
|----------|-------|--------|
| `createOrder` | callable | Membuat order `pending` + transaksi Snap, mengembalikan `redirectUrl` |
| `paymentNotification` | HTTPS | Webhook Midtrans: verifikasi signature, cocokkan nominal, aktifkan Plus |

Alur: klien login Google → pilih paket → `createOrder` → bayar di halaman Midtrans (QRIS/e-wallet) → webhook → order `paid`, `entitlements/{uid}` ditulis, custom claim `plus` + `plusUntil` dipasang → rules bank soal langsung membuka tier Plus.

Konfigurasi (secret, `functions/.env`, URL webhook) ada di langkah 3–7 di atas.

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
