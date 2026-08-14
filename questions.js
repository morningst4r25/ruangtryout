// Bank Soal Berdasarkan Kategori (CPNS HOTS & UTBK TPS) - Batch 1 & 2
const quizCategories = {
    cpns: {
        title: "CPNS & PPPK (Soal HOTS)",
        description: "Latihan Soal SKD: TWK (Nasionalisme/Integritas/Bela Negara), TIU (Penalaran/Numerik), & TKP",
        questions: [
            // --- TWK (Tes Wawasan Kebangsaan) ---
            {
                question: "Indonesia menghadapi era digitalisasi di mana budaya asing sangat cepat masuk. Sebagai seorang ASN, langkah konkret yang paling mencerminkan pengamalan Pancasila Sila ke-3 dalam menjaga integrasi bangsa di era digital adalah...",
                options: [
                    "Menolak seluruh produk dan budaya luar yang masuk ke Indonesia",
                    "Menyaring informasi serta memanfaatkan media sosial untuk mengamplifikasi narasi kebangsaan dan toleransi",
                    "Membatasi akses internet masyarakat agar tidak terpengaruh budaya luar",
                    "Melaporkan setiap akun media sosial yang mengkritik kebijakan pemerintah"
                ],
                answer: 1,
                explanation: "Pengamalan Sila ke-3 di era digital tidak bersifat reaktif/menutup diri, melainkan adaptif dengan memanfaatkan teknologi secara positif untuk merekatkan persatuan dan mengamplifikasi nilai-nilai kebangsaan."
            },
            {
                question: "Seorang staf di kementerian menemukan adanya celah keamanan (bug) pada aplikasi pelayanan publik yang berpotensi membocorkan data warga. Tindakan yang paling mencerminkan nilai Bela Negara 'Sadar Berbangsa dan Bernegara' adalah...",
                options: [
                    "Memperbaiki bug tersebut secara diam-diam tanpa memberitahu atasan",
                    "Melaporkan temuan tersebut segera kepada tim keamanan siber internal dan atasan untuk mitigasi risiko",
                    "Mengunggah temuan bug tersebut ke media sosial agar cepat ditangani",
                    "Mengabaikannya karena bukan bagian dari deskripsi pekerjaan utamanya"
                ],
                answer: 1,
                explanation: "Sadar Berbangsa dan Bernegara diwujudkan melalui disiplin, integritas, dan tanggung jawab profesional dengan melaporkan potensi ancaman data negara melalui prosedur resmi."
            },
            {
                question: "Konsep Sumpah Pemuda 1928 yang mencetuskan 'Satu Nusa, Satu Bangsa, dan Bahasa Persatuan Indonesia' secara substansial menjadi fondasi bagi terbentuknya...",
                options: [
                    "Sistem pemerintahan parlementer di Indonesia",
                    "Identitas nasional dan kesadaran multikulturalisme dalam bingkai NKRI",
                    "Dominasi kebudayaan satu suku di atas suku lainnya",
                    "Penghapusan bahasa daerah di seluruh pelosok nusantara"
                ],
                answer: 1,
                explanation: "Sumpah Pemuda menegaskan kesadaran kolektif untuk menyatukan beragam latar belakang suku dan daerah menjadi satu identitas nasional Indonesia."
            },
            {
                question: "Pelaksanaan politik luar negeri Indonesia yang 'Bebas Aktif' dalam menghadapi konflik geopolitik global terkini ditunjukkan dengan sikap...",
                options: [
                    "Mendukung salah satu blok kekuatan dunia demi keuntungan ekonomi nasional",
                    "Proaktif mendorong perdamaian dunia melalui diplomasi mulitilateral dan penegakan hukum internasional tanpa terikat pakta militer",
                    "Bersikap netral pasif dengan tidak memberikan dorongan atau pendapat dalam forum PBB",
                    "Memutus hubungan diplomatik dengan negara-negara yang berkonflik"
                ],
                answer: 1,
                explanation: "Politik Bebas Aktif berarti 'Bebas' dari ikatan paktamiliter/blok mana pun, dan 'Aktif' menyumbangkan pikiran serta tindakan untuk perdamaian dunia."
            },
            // --- TIU (Tes Inteligensia Umum) ---
            {
                question: "Jika semua ASN profesional berpakaian rapi. Sebagian orang yang berpakaian rapi memiliki integritas tinggi. Berdasarkan dua pernyataan tersebut, kesimpulan yang paling tepat adalah...",
                options: [
                    "Semua ASN profesional pasti memiliki integritas tinggi",
                    "Sebagian ASN profesional mungkin memiliki integritas tinggi",
                    "Tidak ada ASN profesional yang tidak berpakaian rapi",
                    "Semua orang yang berpakaian rapi adalah ASN profesional"
                ],
                answer: 1,
                explanation: "Term 'ASN profesional' masuk dalam himpunan 'berpakaian rapi'. Karena hanya 'sebagian' orang berpakaian rapi yang berintegritas tinggi, maka hubungan antara ASN profesional dan integritas tinggi bersifat sebagian/mungkin."
            },
            {
                question: "Sebuah proyek pelayanan publik ditargetkan selesai dalam 30 hari oleh 20 pekerja. Setelah dikerjakan selama 10 hari, pekerjaan terhenti selama 4 hari karena kendala teknis. Agar proyek selesai tepat waktu, berapa tambahan pekerja yang dibutuhkan?",
                options: [
                    "3 orang",
                    "4 orang",
                    "5 orang",
                    "6 orang"
                ],
                answer: 2,
                explanation: "Sisa beban kerja = (30 - 10) x 20 = 400 hari-kerja. Sisa waktu efektif = 20 - 4 = 16 hari. Pekerja yang dibutuhkan = 400 / 16 = 25 orang. Pekerja tambahan = 25 - 20 = 5 orang."
            },
            {
                question: "Deret angka berikut: 3, 6, 12, 21, 33, ... Angka berikutnya yang tepat untuk mengisi deret tersebut adalah...",
                options: [
                    "42",
                    "45",
                    "48",
                    "51"
                ],
                answer: 2,
                explanation: "Pola selisih antar angka berlanjut dengan kelipatan 3: +3, +6, +9, +12, maka berikutnya adalah +15. Sehingga 33 + 15 = 48."
            },
            {
                question: "KONTRAK : ABROGASI = JANJI : ...",
                options: [
                    "PEMBATALAN",
                    "PELANGGARAN",
                    "SANKSI",
                    "PIUTANG"
                ],
                answer: 0,
                explanation: "Analogi Padanan Kata: Pembatalan suatu 'Kontrak' disebut 'Abrogasi'. Pembatalan suatu 'Janji' disebut 'Pembatalan' (atau wanprestasi/ingkar)."
            },
            // --- TKP (Tes Karakteristik Pribadi) ---
            {
                question: "Anda adalah ketua tim proyek digitalisasi instansi. Salah satu anggota senior kesulitan mengoperasikan sistem baru sehingga progres tim terhambat. Sikap terbaik Anda sebagai ASN adalah...",
                options: [
                    "Mengambil alih seluruh tugas anggota senior tersebut",
                    "Mengusulkan kepada pimpinan agar anggota senior tersebut diganti",
                    "Mengatur sesi pendampingan (mentoring) khusus dan membagi tugas secara bertahap sesuai kapasitasnya",
                    "Membiarkannya bekerja sesuai kemampuannya agar tidak merasa tersinggung"
                ],
                answer: 2,
                explanation: "Prinsip Pelayanan Publik dan Kepemimpinan (TKP) menekankan pada kerja sama tim, kepedulian terhadap rekan kerja (mentoring), tanpa mengorbankan pencapaian target organisasi."
            },
            {
                question: "Saat sedang melayani antrean warga yang cukup panjang di kantor dinas, tiba-tiba seorang warga menerobos antrean dan marah-marah karena dokumennya belum selesai. Sikap Anda adalah...",
                options: [
                    "Membalas membentak warga tersebut agar menyadari kesalahannya",
                    "Meminta warga tersebut tenang, mendengarkan keluhannya secara empati, dan mengarahkannya ke loket pengaduan khusus",
                    "Meninggalkan loket pelayanan untuk menghindari konflik",
                    "Meminta petugas keamanan mengusir warga tersebut keluar gedung"
                ],
                answer: 1,
                explanation: "Dalam Pelayanan Publik (TKP), pengendalian diri, komunikasi berempati, dan solusi terstruktur tanpa mengabaikan pengguna layanan lain adalah poin penilaian tertinggi."
            }
        ]
    },
    utbk: {
        title: "UTBK / SNBT (TPS & Literasi)",
        description: "Latihan Soal Tes Potensi Skolastik (TPS), Penalaran Kuantitatif, & Literasi Bahasa",
        questions: [
            // --- Penalaran Kuantitatif & Matematika Dasar ---
            {
                question: "Rata-rata nilai kuis dari 5 orang siswa adalah 80. Jika nilai satu siswa dengan nilai terkecil dikeluarkan, rata-rata nilai 4 siswa sisanya menjadi 84. Berapakah nilai siswa yang dikeluarkan tersebut?",
                options: [
                    "60",
                    "64",
                    "68",
                    "72"
                ],
                answer: 1,
                explanation: "Total nilai awal 5 siswa = 5 x 80 = 400. Total nilai 4 siswa sisa = 4 x 84 = 336. Nilai siswa yang dikeluarkan = 400 - 336 = 64."
            },
            {
                question: "Jika p x q = p + q + 2, maka nilai dari 3 x 4 adalah...",
                options: [
                    "7",
                    "9",
                    "11",
                    "14"
                ],
                answer: 1,
                explanation: "Operasi khusus: 3 x 4 = 3 + 4 + 2 = 9."
            },
            {
                question: "Sebuah toko pakaian memberikan diskon beruntun berturut-turut sebesar 20% dan kemudian diskon tambahan 10% dari harga setelah diskon pertama. Total diskon efektif yang didapatkan pembeli adalah...",
                options: [
                    "28%",
                    "30%",
                    "32%",
                    "35%"
                ],
                answer: 0,
                explanation: "Misalkan harga awal = 100. Diskon I (20%) -> Sisa harga = 80. Diskon II (10% dari 80) = 8. Total harga bayar = 80 - 8 = 72. Total diskon efektif = 100 - 72 = 28%."
            },
            {
                question: "Jika x^2 - y^2 = 36 dan x - y = 4, maka nilai rata-rata dari x dan y adalah...",
                options: [
                    "4.5",
                    "5.0",
                    "6.0",
                    "9.0"
                ],
                answer: 0,
                explanation: "Ingat rumus selisih kuadrat: x^2 - y^2 = (x - y)(x + y). Maka 36 = 4(x + y) => x + y = 9. Rata-rata dari x dan y adalah (x + y)/2 = 9/2 = 4.5."
            },
            // --- Penalaran Logis & Analitis ---
            {
                question: "Lima orang mahasiswa (D, C, E, A, B) antre di kasir. B berada tepat di belakang A. C berada di antara D dan E. D berada di posisi paling depan. Jika E berada di depan A, siapa yang berada di urutan ke-3 antrean?",
                options: [
                    "B",
                    "C",
                    "D",
                    "E"
                ],
                answer: 3,
                explanation: "Urutan antrean dari depan ke belakang berdasarkan petunjuk: Posisi 1 = D, Posisi 2 = C (di antara D dan E), Posisi 3 = E, Posisi 4 = A, Posisi 5 = B. Jadi urutan ke-3 adalah E."
            },
            // --- Literasi Bahasa Indonesia & Bahasa Inggris ---
            {
                question: "Bacalah kalimat berikut:\n'Upaya pemerintah dalam menekan angka inflasi perlu diapresiasi, [...] dampaknya belum sepenuhnya dirasakan oleh masyarakat di lapisan bawah.'\n\nKata hubung (konjungsi) yang paling tepat untuk mengisi bagian rumpang tersebut adalah...",
                options: [
                    "Namun,",
                    "Sehingga",
                    "Karena",
                    "Bahkan"
                ],
                answer: 0,
                explanation: "Kalimat tersebut menunjukkan hubungan pertentangan antarkalimat/klausa (apresiasi vs dampak belum terasa), sehingga konjungsi pertentangan 'Namun,' adalah yang paling tepat."
            },
            {
                question: "The rapid advance of Artificial Intelligence (AI) has led to significant productivity gains; however, ethical concerns regarding data privacy remain a critical issue. What is the main idea of the statement?",
                options: [
                    "AI is completely unsafe for public use.",
                    "AI increases productivity but raises important ethical data privacy concerns.",
                    "Data privacy is no longer an issue due to AI advances.",
                    "Productivity is the only factor that matters in AI development."
                ],
                answer: 1,
                explanation: "Kalimat tersebut memiliki struktur perbandingan/pertentangan (however): memuji peningkatan produktivitas AI sekaligus menggarisbawahi kekhawatiran etis terkait privasi data."
            },
            {
                question: "Penggunaan tanda baca koma (,) yang paling TEPAT menurut ejaan bahasa Indonesia terdapat pada kalimat...",
                options: [
                    "Ibu membeli buah pisang, apel, dan jeruk di pasar.",
                    "Karena hari hujan deras, maka kami tidak pergi ke museum.",
                    "Dia anak yang rajin, tetapi, kurang teliti.",
                    "Di Medan kami mengunjungi Danau Toba dan Istana Maimun."
                ],
                answer: 0,
                explanation: "Aturan rincian tiga unsur atau lebih wajib menggunakan tanda baca koma sebelum kata hubung 'dan' (misal: pisang, apel, dan jeruk)."
            }
        ]
    }
};
