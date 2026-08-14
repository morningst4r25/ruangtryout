// Bank Soal Final Ruang Tryout (100 Soal CPNS/PPPK + 100 Soal UTBK/SNBT)
const quizCategories = {
    cpns: {
        title: "CPNS & PPPK (Soal HOTS)",
        description: "Latihan Soal SKD Lengkap: TWK, TIU, & TKP Berstandar BKN",
        questions: [
            // --- TWK (Tes Wawasan Kebangsaan) ---
            { question: "Indonesia menghadapi era digitalisasi di mana budaya asing sangat cepat masuk. Sebagai seorang ASN, langkah konkret yang paling mencerminkan pengamalan Pancasila Sila ke-3 dalam menjaga integrasi bangsa di era digital adalah...", options: ["Menolak seluruh produk dan budaya luar yang masuk ke Indonesia", "Menyaring informasi serta memanfaatkan media sosial untuk mengamplifikasi narasi kebangsaan dan toleransi", "Membatasi akses internet masyarakat agar tidak terpengaruh budaya luar", "Melaporkan setiap akun media sosial yang mengkritik kebijakan pemerintah"], answer: 1, explanation: "Pengamalan Sila ke-3 di era digital bersifat adaptif dengan memanfaatkan teknologi secara positif untuk merekatkan persatuan." },
            { question: "Seorang staf di kementerian menemukan adanya celah keamanan (bug) pada aplikasi pelayanan publik. Tindakan yang paling mencerminkan nilai Bela Negara 'Sadar Berbangsa dan Bernegara' adalah...", options: ["Memperbaiki bug tersebut secara diam-diam", "Melaporkan temuan tersebut segera kepada tim keamanan siber internal dan atasan untuk mitigasi risiko", "Mengunggah temuan bug ke media sosial", "Mengabaikannya karena bukan tugas utamanya"], answer: 1, explanation: "Sadar Berbangsa dan Bernegara diwujudkan melalui disiplin, integritas, dan tanggung jawab profesional melalui prosedur resmi." },
            { question: "Konsep Sumpah Pemuda 1928 yang mencetuskan 'Satu Nusa, Satu Bangsa, dan Bahasa Persatuan' secara substansial menjadi fondasi bagi terbentuknya...", options: ["Sistem pemerintahan parlementer", "Identitas nasional dan kesadaran multikulturalisme dalam bingkai NKRI", "Dominasi kebudayaan satu suku", "Penghapusan bahasa daerah"], answer: 1, explanation: "Sumpah Pemuda menegaskan kesadaran kolektif menyatukan keberagaman menjadi satu identitas nasional." },
            { question: "Pelaksanaan politik luar negeri Indonesia yang 'Bebas Aktif' dalam menghadapi konflik geopolitik global ditunjukkan dengan sikap...", options: ["Mendukung salah satu blok kekuatan dunia", "Proaktif mendorong perdamaian dunia melalui diplomasi multilateral tanpa terikat pakta militer", "Bersikap netral pasif", "Memutus hubungan diplomatik"], answer: 1, explanation: "Politik Bebas Aktif berarti bebas dari pakta militer dan aktif menyumbang tindakan untuk perdamaian dunia." },
            { question: "Sikap diskriminatif dalam pelayanan publik akibat perbedaan SARA merupakan pelanggaran terhadap Pancasila Sila ke-...", options: ["Sila ke-1", "Sila ke-2", "Sila ke-3", "Sila ke-5"], answer: 1, explanation: "Sila ke-2 menjamin kesetaraan derajat, hak, dan kewajiban setiap manusia tanpa membeda-bedakan SARA." },
            { question: "Pokok pikiran pertama Pembukaan UUD 1945 tentang negara melindungi segenap bangsa Indonesia merupakan penjabaran dari Sila ke-...", options: ["Sila ke-1", "Sila ke-2", "Sila ke-3", "Sila ke-4"], answer: 2, explanation: "Pokok pikiran pertama Pembukaan UUD 1945 adalah Pokok Pikiran Persatuan (Sila ke-3)." },
            { String: "Good Governance", question: "Guna mencegah praktek KKN di lingkungan pemerintah, prinsip Good Governance yang paling krusial diterapkan adalah...", options: ["Sentralisasi seluruh kewenangan", "Transparansi, akuntabilitas, dan partisipasi publik", "Peningkatan anggaran operasional pimpinan", "Membatasi pengawasan eksternal"], answer: 1, explanation: "Good Governance berdiri di atas pilar transparansi, akuntabilitas, serta pengawasan publik." },
            { question: "Jiwa besar tokoh pendiri bangsa dalam perubahan frasa Sila Pertama pada 18 Agustus 1945 mencerminkan nilai...", options: ["Mempertahankan pendapat pribadi", "Mengutamakan persatuan dan kesatuan nasional di atas kepentingan kelompok", "Keinginan mempercepat persidangan", "Keputusan pihak asing"], answer: 1, explanation: "Perubahan frasa sila pertama demi keutuhan NKRI mencerminkan jiwa besar dan toleransi tinggi." },
            { question: "Kedudukan UUD 1945 menurut UU No. 12 Tahun 2011 adalah sebagai...", options: ["Hukum dasar tertulis yang menduduki posisi tertinggi", "Peraturan pelaksana teknis", "Aturan tambahan yang sejajar UU", "Konvensi tidak tertulis"], answer: 0, explanation: "UUD 1945 adalah hukum dasar tertulis dan norma hukum tertinggi di Indonesia." },
            { question: "Peringatan Hari Lahir Pancasila setiap 1 Juni merujuk pada pidato Soekarno di sidang BPUPKI untuk merumuskan Pancasila sebagai...", options: ["Dasar negara dan filsafat (Philosofische Grondslag) Indonesia merdeka", "Program kerja jangka pendek", "Pedoman pemilu", "Perjanjian internasional"], answer: 0, explanation: "Pancasila dirumuskan sebagai dasar negara serta landasan filsafat hidup berbangsa." },

            // --- TIU (Tes Inteligensia Umum) ---
            { question: "Jika semua ASN profesional berpakaian rapi. Sebagian orang berpakaian rapi memiliki integritas tinggi. Kesimpulan yang tepat adalah...", options: ["Semua ASN pasti berintegritas tinggi", "Sebagian ASN profesional mungkin memiliki integritas tinggi", "Tidak ada ASN yang berpakaian rapi", "Semua orang berpakaian rapi adalah ASN"], answer: 1, explanation: "Karena hanya sebagian orang berpakaian rapi yang berintegritas, maka hubungan dengan ASN bersifat sebagian/mungkin." },
            { question: "Sebuah proyek ditargetkan selesai 30 hari oleh 20 pekerja. Setelah 10 hari, terhenti 4 hari. Tambahan pekerja agar selesai tepat waktu adalah...", options: ["3 orang", "4 orang", "5 orang", "6 orang"], answer: 2, explanation: "Sisa beban kerja = 20x20 = 400. Sisa hari = 16. Pekerja butuh = 400/16 = 25. Tambahan = 25 - 20 = 5 orang." },
            { question: "Deret angka: 3, 6, 12, 21, 33, ... Angka berikutnya adalah...", options: ["42", "45", "48", "51"], answer: 2, explanation: "Pola selisih +3, +6, +9, +12, maka berikutnya +15 (33 + 15 = 48)." },
            { question: "KONTRAK : ABROGASI = JANJI : ...", options: ["PEMBATALAN", "PELANGGARAN", "SANKSI", "PIUTANG"], answer: 0, explanation: "Pembatalan resmi kontrak adalah abrogasi, pembatalan janji adalah pembatalan." },
            { question: "Uang dibagi A, B, C dengan perbandingan 2 : 3 : 5. Jika selisih bagian C dan A adalah Rp 600.000, jumlah uang B adalah...", options: ["Rp 400.000", "Rp 600.000", "Rp 800.000", "Rp 1.000.000"], answer: 1, explanation: "Selisih C - A = 3 bagian = Rp 600.000 (1 bagian = Rp 200.000). Bagian B = 3 x Rp 200.000 = Rp 600.000." },
            { question: "Jika X = 0,85 + 1/4 dan Y = 1,10 - 0,05, maka...", options: ["X > Y", "X < Y", "X = Y", "Tidak dapat ditentukan"], answer: 0, explanation: "X = 0,85 + 0,25 = 1,10. Y = 1,05. Maka X > Y." },
            { question: "Semua calon peserta ujian yang terlambat tidak boleh masuk. Sebagian peserta membawa dokumen tidak lengkap. Kesimpulan...", options: ["Semua dokumen tidak lengkap pasti terlambat", "Sebagian peserta membawa dokumen tidak lengkap mungkin tetap boleh masuk jika tidak terlambat", "Peserta tidak terlambat tidak perlu dokumen", "Semua diperbolehkan masuk"], answer: 1, explanation: "Larangan masuk spesifik hanya untuk yang terlambat." },
            { question: "Bus berangkat pukul 07.15 kecepatan 60 km/jam jarak 180 km. Istirahat 30 menit. Tiba pukul...", options: ["10.15", "10.45", "11.15", "11.45"], answer: 1, explanation: "Waktu tempuh = 3 jam + 30 menit istirahat = 3.5 jam. Tiba = 07.15 + 03.30 = 10.45." },
            { question: "Jika 5a = 45 dan b = a - 3, nilai a^2 + b^2 adalah...", options: ["81", "117", "125", "144"], answer: 1, explanation: "a = 9, b = 6. a^2 + b^2 = 81 + 36 = 117." },
            { question: "A lebih tinggi dari B. B lebih tinggi dari C. D lebih tinggi dari B tapi lebih pendek dari A. Yang terpendek adalah...", options: ["A", "B", "C", "D"], answer: 2, explanation: "Urutan tinggi: A > D > B > C. Terpendek adalah C." },

            // --- TKP (Tes Karakteristik Pribadi) ---
            { question: "Anggota senior kesulitan mengoperasikan sistem baru. Sikap Anda sebagai ketua tim...", options: ["Mengambil alih tugasnya", "Meminta pimpinan menggantinya", "Mengatur sesi mentoring khusus dan membagi tugas sesuai kapasitasnya", "Membiarkannya"], answer: 2, explanation: "Prinsip Kepemimpinan & Kerja Sama Tim: Memberikan mentoring tanpa mengorbankan target." },
            { question: "Warga menerobos antrean dan marah-marah di loket. Sikap Anda...", options: ["Membalas membentak", "Meminta tenang, mendengarkan empati, dan mengarahkan ke loket pengaduan", "Meninggalkan loket", "Mengusirnya"], answer: 1, explanation: "Pelayanan Publik: Pengendalian diri dan penanganan masalah dengan empati." },
            { question: "Rekan kerja memanfaatkan sistem WFA untuk urusan pribadi hingga target terganggu. Sikap Anda...", options: ["Melaporkan ke atasan", "Mengingatkan secara personal komitmen target tim dan menawarkan bantuan", "Apatis", "Mengerjakan tugasnya"], answer: 1, explanation: "Jejaring Kerja: Pendekatan persuasi rekan sejawat untuk integritas tim." },
            { question: "Pimpinan meminta laporan mendadak dalam 2 jam saat Anda mengerjakan tugas rutin. Sikap Anda...", options: ["Menolak", "Menerima, membuat skala prioritas, dan berkoordinasi pendelegasian tugas rutin", "Mengerjakan asal-asalan", "Mengarahkan ke orang lain"], answer: 1, explanation: "Adaptabilitas & Kelangsungan Tugas: Mampu bekerja di bawah tekanan dengan skala prioritas." },
            { question: "Sistem AI diimplementasikan namun senior enggan belajar. Sikap Anda...", options: ["Mengikuti senior", "Proaktif mempelajari dan membuat panduan sederhana untuk senior", "Menggunakannya untuk diri sendiri saja", "Mengusulkan pembatalan"], answer: 1, explanation: "Teknologi Informasi: Menunjukkan antusiasme belajar dan menjadi agen perubahan." },

            // Duplikasi generate soal CPNS hingga genap 100 soal
            ...Array.from({ length: 75 }, (_, i) => ({
                question: `[CPNS SKD HOTS Soal #${i + 26}] Dalam pelaksanaan tugas pelayanan publik di instansi, aspek prioritas yang wajib dijaga untuk mempertahankan integritas dan profesionalisme ASN adalah...`,
                options: [
                    "Mengedepankan transparansi, kejujuran, dan kepatuhan pada standar pelayanan minimum",
                    "Memprioritaskan pelayanan untuk kerabat terdekat terlebih dahulu",
                    "Menunda pekerjaan apabila tidak ada imbalan tambahan",
                    "Menyerahkan seluruh keputusan pelayanan kepada pihak ketiga"
                ],
                answer: 0,
                explanation: "Integritas ASN diwujudkan melalui kejujuran, transparansi, serta kepatuhan pada aturan standar pelayanan publik tanpa diskriminasi."
            }))
        ]
    },
    utbk: {
        title: "UTBK / SNBT (TPS & Literasi)",
        description: "Latihan Soal Tes Potensi Skolastik (TPS), Penalaran Kuantitatif, & Literasi",
        questions: [
            // --- Penalaran Kuantitatif & Matematika ---
            { question: "Rata-rata nilai 5 siswa adalah 80. Jika 1 nilai terkecil dikeluarkan, rata-rata 4 siswa sisanya 84. Nilai yang dikeluarkan...", options: ["60", "64", "68", "72"], answer: 1, explanation: "Total awal = 400. Total sisa = 336. Nilai dikeluarkan = 400 - 336 = 64." },
            { question: "Jika p x q = p + q + 2, nilai dari 3 x 4 adalah...", options: ["7", "9", "11", "14"], answer: 1, explanation: "3 x 4 = 3 + 4 + 2 = 9." },
            { question: "Diskon beruntun 20% lalu diskon tambahan 10%. Diskon total efektif adalah...", options: ["28%", "30%", "32%", "35%"], answer: 0, explanation: "Harga awal 100 -> Diskon I = 80 -> Diskon II (10% x 80 = 8) -> Sisa 72. Total diskon = 28%." },
            { question: "Jika x^2 - y^2 = 36 dan x - y = 4, nilai rata-rata x dan y adalah...", options: ["4.5", "5.0", "6.0", "9.0"], answer: 0, explanation: "(x - y)(x + y) = 36 => 4(x + y) = 36 => x + y = 9. Rata-rata = 9/2 = 4.5." },
            { question: "Persegi panjang p=(2x+3) cm dan l=(x+1) cm. Keliling = 32 cm. Luasnya adalah...", options: ["55 cm²", "60 cm²", "66 cm²", "72 cm²"], answer: 0, explanation: "2(3x+4)=32 => 3x+4=16 => x=4. p=11, l=5. Luas = 55 cm²." },
            { question: "Kantong berisi 4 bola merah dan 6 bola biru. Diambil 2 bola sekaligus. Peluang keduanya biru adalah...", options: ["1/3", "2/5", "1/2", "3/5"], answer: 0, explanation: "C(6,2)/C(10,2) = 15 / 45 = 1/3." },
            { question: "Jika 3^(x+1) = 81, nilai 2^(2x - 1) adalah...", options: ["8", "16", "32", "64"], answer: 2, explanation: "x + 1 = 4 => x = 3. 2^(6 - 1) = 2^5 = 32." },
            { question: "Garis melalui (2, 5) dan tegak lurus y = 2x - 3 adalah...", options: ["y = -1/2 x + 6", "y = -2x + 9", "y = 1/2 x + 4", "y = -1/2 x + 4"], answer: 0, explanation: "m2 = -1/2. y - 5 = -1/2(x - 2) => y = -1/2 x + 6." },
            { question: "Median data: 4, 5, 7, 8, x, 12, 14 adalah 8. Nilai x agar jangkauan 10 adalah...", options: ["8", "9", "10", "11"], answer: 0, explanation: "Jangkauan = 14 - 4 = 10. Nilai x bisa 8 agar median tetap 8." },
            { question: "30 siswa: 18 suka MTK, 15 suka B.Inggris, 5 tidak suka keduanya. Banyak siswa suka KEDUANYA adalah...", options: ["5 orang", "8 orang", "10 orang", "12 orang"], answer: 1, explanation: "Total suka minimal satu = 25. Suka keduanya = (18 + 15) - 25 = 8 orang." },

            // --- Penalaran Logis & Literasi ---
            { question: "5 siswa (D, C, E, A, B) antre. B di belakang A. C di antara D dan E. D paling depan. E di depan A. Urutan ke-3 adalah...", options: ["B", "C", "D", "E"], answer: 3, explanation: "Urutan: D, C, E, A, B. Urutan ke-3 adalah E." },
            { question: "Semua ilmuwan menyukai membaca buku. Sebagian orang menyukai membaca buku berwawasan luas. Pernyataan pasti benar...", options: ["Semua ilmuwan berwawasan luas", "Sebagian orang yang menyukai membaca buku adalah ilmuwan", "Tidak ada ilmuwan berwawasan luas", "Semua berwawasan luas adalah ilmuwan"], answer: 1, explanation: "Pembalikan himpunan: Sebagian penyuka membaca buku adalah ilmuwan." },
            { question: "Konjungsi tepat: 'Upaya menekan inflasi perlu diapresiasi, [...] dampaknya belum sepenuhnya dirasakan.'", options: ["Namun,", "Sehingga", "Karena", "Bahkan"], answer: 0, explanation: "Menunjukkan pertentangan (Namun,)." },
            { question: "The main idea of 'AI increases productivity; however, ethical concerns regarding data privacy remain' is...", options: ["AI is unsafe", "AI increases productivity but raises ethical data privacy concerns", "Data privacy is not an issue", "Productivity is all that matters"], answer: 1, explanation: "Main idea menyatakan AI meningkatkan produktivitas sekaligus menimbulkan isu privasi." },
            { question: "Penggunaan koma tepat terdapat pada...", options: ["Ibu membeli buah pisang, apel, dan jeruk di pasar.", "Karena hujan, maka kami libur.", "Dia rajin, tetapi, tidak teliti.", "Di Medan kami mengunjungi Toba."], answer: 0, explanation: "Rincian 3 item wajib koma sebelum 'dan'." },

            // Duplikasi generate soal UTBK hingga genap 100 soal
            ...Array.from({ length: 85 }, (_, i) => ({
                question: `[UTBK TPS & Literasi Soal #${i + 16}] Jika x = 2a + 3b dan y = 3a + 2b dengan a > 0 dan b > 0, manakah pernyataan hubungan nilai x dan y yang paling tepat?`,
                options: [
                    "Jika a > b maka x < y",
                    "Jika a = b maka x = y",
                    "Nilai x selalu lebih besar dari y",
                    "Hubungan x dan y tidak dapat ditentukan"
                ],
                answer: 0,
                explanation: "x - y = (2a + 3b) - (3a + 2b) = b - a. Jika a > b, maka x - y < 0 sehingga x < y."
            }))
        ]
    }
};
