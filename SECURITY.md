# Security notes

## Leaderboard
`firestore.rules` membatasi field, panjang nama, kategori, rentang skor, dan hanya mengizinkan satu create untuk satu document ID/attempt ID. Update dan delete dari client ditolak.

Karena bank soal dan perhitungan skor berjalan di browser, **frontend tidak bisa menjadi sumber kebenaran anti-cheat**. Pengguna yang sengaja memodifikasi JavaScript masih dapat mencoba membuat payload valid dengan skor palsu.

Untuk leaderboard kompetitif berskala besar, langkah lanjutan yang disarankan:
1. Aktifkan Firebase App Check untuk web.
2. Pindahkan verifikasi attempt/skor ke Cloud Function atau backend terpercaya.
3. Simpan token attempt sekali pakai di backend dan tolak replay.
4. Tambahkan rate limiting serta moderasi nama.

Versi dalam paket ini mengimplementasikan hardening maksimum yang masuk akal tanpa backend tambahan dan tidak mengklaim skor sebagai anti-cheat penuh.
