// Bank Soal Berdasarkan Kategori (CPNS HOTS & UTBK TPS) - Batch 5 (Total 120 Soal: 60 CPNS & 60 UTBK)
const quizCategories = {
    cpns: {
        title: "CPNS & PPPK (Soal HOTS)",
        description: "Latihan Soal SKD: TWK (Nasionalisme/Integritas/Bela Negara), TIU (Penalaran/Numerik), & TKP",
        questions: [
            // --- TWK (Tes Wawasan Kebangsaan - 20 Soal) ---
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
                    "Proaktif mendorong perdamaian dunia melalui diplomasi multilateral dan penegakan hukum internasional tanpa terikat pakta militer",
                    "Bersikap netral pasif dengan tidak memberikan dorongan atau pendapat dalam forum PBB",
                    "Memutus hubungan diplomatik dengan negara-negara yang berkonflik"
                ],
                answer: 1,
                explanation: "Politik Bebas Aktif berarti 'Bebas' dari ikatan pakta militer/blok mana pun, dan 'Aktif' menyumbangkan pikiran serta tindakan untuk perdamaian dunia."
            },
            {
                question: "Sikap diskriminatif dalam pelayanan publik akibat perbedaan suku, agama, atau antargolongan merupakan pelanggaran berat terhadap nilai-nilai Pancasila, khususnya Sila ke-...",
                options: [
                    "Sila ke-1",
                    "Sila ke-2",
                    "Sila ke-3",
                    "Sila ke-5"
                ],
                answer: 1,
                explanation: "Sila ke-2 (Kemanusiaan yang Adil dan Beradab) menjamin kesetaraan derajat, hak, dan kewajiban setiap manusia tanpa membeda-bedakan SARA."
            },
            {
                question: "Pokok pikiran pertama Pembukaan UUD 1945 menyatakan bahwa 'Negara melindungi segenap bangsa Indonesia dan seluruh tumpah darah Indonesia dengan berdasarkan atas persatuan'. Pokok pikiran ini merupakan penjabaran dari Sila ke-...",
                options: [
                    "Sila ke-1",
                    "Sila ke-2",
                    "Sila ke-3",
                    "Sila ke-4"
                ],
                answer: 2,
                explanation: "Pokok pikiran pertama Pembukaan UUD 1945 adalah Pokok Pikiran Persatuan yang merupakan penjelas dari Sila ke-3 Pancasila."
            },
            {
                question: "Guna mencegah praktek Korupsi, Kolusi, dan Nepotisme (KKN) di lingkungan instansi pemerintah, prinsip tata kelola pemerintahan yang baik (Good Governance) yang paling krusial untuk diterapkan adalah...",
                options: [
                    "Sentralisasi seluruh kewenangan pengambilan keputusan",
                    "Transparansi, akuntabilitas, dan partisipasi publik",
                    "Peningkatan anggaran operasional pimpinan secara independen",
                    "Membatasi pengawasan dari lembaga eksternal"
                ],
                answer: 1,
                explanation: "Good Governance berdiri di atas pilar keterbukaan informasi (transparansi), pertanggungjawaban (akuntabilitas), serta pengawasan bersama."
            },
            {
                question: "Keputusan Panitia Sembilan pada 22 Juni 1945 yang menghasilkan Piagam Jakarta menjadi rumusan awal Pembukaan UUD 1945. Nilai utama yang ditunjukkan para tokoh pendiri bangsa dalam perubahan frasa Sila Pertama pada 18 Agustus 1945 adalah...",
                options: [
                    "Sikap mempertahankan pendapat pribadi sampai akhir",
                    "Jiwa besar dan mengutamakan persatuan dan kesatuan nasional di atas kepentingan kelompok",
                    "Keinginan mempercepat masa persidangan",
                    "Penyerahan seluruh keputusan kepada pihak asing"
                ],
                answer: 1,
                explanation: "Perubahan frasa sila pertama demi menjaga keutuhan Indonesia yang majemuk mencerminkan sikap toleransi dan jiwa besar pendiri bangsa."
            },
            {
                question: "Kedudukan UUD 1945 dalam hierarki peraturan perundang-undangan di Indonesia menurut UU No. 12 Tahun 2011 adalah sebagai...",
                options: [
                    "Hukum dasar tertulis yang menduduki posisi tertinggi",
                    "Peraturan pelaksana teknis operasional",
                    "Aturan tambahan yang sejajar dengan Undang-Undang",
                    "Konvensi ketatanegaraan tidak tertulis"
                ],
                answer: 0,
                explanation: "UUD 1945 merupakan hukum dasar tertulis dan norma hukum tertinggi dalam hierarki peraturan perundang-undangan di Indonesia."
            },
            {
                question: "Peringatan Hari Lahir Pancasila setiap tanggal 1 Juni merujuk pada peristiwa bersejarah saat Soekarno menyampaikan pidatonya dalam sidang BPUPKI. Maksud utama perumusan Pancasila oleh para pendiri bangsa saat itu adalah sebagai...",
                options: [
                    "Dasar negara dan dasar filsafat (Philosofische Grondslag) Indonesia merdeka",
                    "Program kerja jangka pendek kementerian pemerintahan",
                    "Pedoman pelaksanaan pemilu pertama",
                    "Perjanjian kerja sama internasional dengan negara tetangga"
                ],
                answer: 0,
                explanation: "Pancasila dirumuskan oleh pendiri bangsa sebagai dasar negara serta landasan filsafat hidup berbangsa dan bernegara."
            },
            {
                question: "Wujud pengamalan Sila ke-4 Pancasila dalam pembuatan kebijakan publik di tingkat desa/kelurahan adalah...",
                options: [
                    "Pengambilan keputusan melalui musyawarah mufakat dengan melibatkan warga",
                    "Penetapan aturan secara sepihak oleh kepala desa",
                    "Menyerahkan seluruh keputusan kepada kelompok terkaya di desa",
                    "Mengabaikan pendapat warga yang berbeda pandangan"
                ],
                answer: 0,
                explanation: "Sila ke-4 menekankan kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan."
            },
            {
                question: "Semboyan Bhinneka Tunggal Ika yang terdapat pada lambang negara Garuda Pancasila diambil dari kitab kakawin Jawa Kuno karya Empu Tantular, yaitu...",
                options: [
                    "Kitab Negara Kertagama",
                    "Kitab Sutasoma",
                    "Kitab Arjunawiwaha",
                    "Kitab Pararaton"
                ],
                answer: 1,
                explanation: "Frasa Bhinneka Tunggal Ika dipetik dari Kitab Sutasoma karangan Empu Tantular pada zaman Kerajaan Majapahit."
            },
            {
                question: "Hak Asasi Manusia (HAM) di Indonesia diatur secara tegas dalam UUD 1945, khususnya pada pasal...",
                options: [
                    "Pasal 27 sampai Pasal 34",
                    "Pasal 28A sampai Pasal 28J",
                    "Pasal 29 sampai Pasal 31",
                    "Pasal 33 sampai Pasal 37"
                ],
                answer: 1,
                explanation: "Jaminan Hak Asasi Manusia secara komprehensif tertuang dalam Pasal 28A hingga 28J UUD 1945 hasil amandemen."
            },
            {
                question: "Sistem pemerintahan Indonesia menurut UUD 1945 menegaskan bahwa presiden memegang kekuasaan pemerintahan (eksekutif). Dalam hal ini presiden dibantu oleh...",
                options: [
                    "Menteri-menteri negara yang diangkat dan diberhentikan oleh presiden",
                    "Ketiga pimpinan DPR RI",
                    "Ketua Mahkamah Agung",
                    "Gubernur di tiap-tiap provinsi"
                ],
                answer: 0,
                explanation: "Berdasarkan Pasal 17 UUD 1945, Presiden dibantu oleh menteri-menteri negara yang diangkat dan diberhentikan oleh Presiden."
            },
            {
                question: "Pengawasan terhadap pelaksanaan Undang-Undang dan APBN oleh pemerintah dilakukan oleh lembaga legislatif, yaitu...",
                options: [
                    "Dewan Perwakilan Rakyat (DPR)",
                    "Mahkamah Konstitusi (MK)",
                    "Badan Pemeriksa Keuangan (BPK)",
                    "Dewan Pertimbangan Presiden"
                ],
                answer: 0,
                explanation: "DPR memiliki tiga fungsi utama: Fungsi Legislasi, Anggaran (Budgeting), dan Pengawasan (Interpelasi/Angket)."
            },
            {
                question: "Lembaga negara yang berwenang menguji undang-undang terhadap UUD 1945 (Judicial Review) adalah...",
                options: [
                    "Mahkamah Agung (MA)",
                    "Mahkamah Konstitusi (MK)",
                    "Komisi Yudisial (KY)",
                    "Dewan Perwakilan Daerah (DPD)"
                ],
                answer: 1,
                explanation: "MK berwenang menguji undang-undang terhadap UUD 1945, sedangkan MA menguji peraturan di bawah UU terhadap UU."
            },
            {
                question: "Penyusunan APBN harus disetujui bersama antara Presiden dan...",
                options: [
                    "DPR",
                    "BPK",
                    "MPR",
                    "DPD"
                ],
                answer: 0,
                explanation: "Rancangan APBN diajukan oleh Presiden dan dibahas bersama DPR untuk mendapatkan persetujuan (Pasal 23 UUD 1945)."
            },
            {
                question: "Bentuk negara Indonesia adalah Negara Kesatuan yang berbentuk Republik, sebagaimana tercantum dalam UUD 1945 pasal...",
                options: [
                    "Pasal 1 Ayat (1)",
                    "Pasal 1 Ayat (2)",
                    "Pasal 2 Ayat (1)",
                    "Pasal 3 Ayat (1)"
                ],
                answer: 0,
                explanation: "Pasal 1 Ayat (1) UUD 1945 berbunyi: 'Negara Indonesia ialah Negara Kesatuan, yang berbentuk Republik'."
            },
            {
                question: "Bela Negara tidak hanya dilakukan dalam bentuk pengangkatan senjata, melainkan dapat diwujudkan oleh ASN melalui...",
                options: [
                    "Pengabdian yang tulus dan profesional sesuai profesi untuk kemajuan bangsa",
                    "Mengkritik pemerintah di media sosial tanpa memberikan solusi",
                    "Menuntut kenaikan gaji tanpa meningkatkan kinerja",
                    "Mementingkan kelompok pribadi di atas tugas instansi"
                ],
                answer: 0,
                explanation: "Bela negara non-fisik di era modern diwujudkan melalui pengabdian profesi secara jujur, kompeten, dan penuh integritas."
            },
            {
                question: "Tujuan nasional bangsa Indonesia yang tercantum dalam Pembukaan UUD 1945 alinea IV mencakup hal-hal berikut, KECUALI...",
                options: [
                    "Melindungi segenap bangsa Indonesia dan seluruh tumpah darah Indonesia",
                    "Memajukan kesejahteraan umum dan mencerdaskan kehidupan bangsa",
                    "Ikut melaksanakan ketertiban dunia yang berdasarkan kemerdekaan",
                    "Menguasai wilayah perekonomian negara-negara berkembang"
                ],
                answer: 3,
                explanation: "Tujuan nasional berfokus pada perlindungan, kesejahteraan, kecerdasan bangsa, dan ketertiban dunia, bukan ekspansi ekonomi imperialis."
            },

            // --- TIU (Tes Inteligensia Umum - 20 Soal) ---
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
                explanation: "Analogi Padanan Kata: Pembatalan suatu 'Kontrak' disebut 'Abrogasi'. Pembatalan suatu 'Janji' disebut 'Pembatalan'."
            },
            {
                question: "Sejumlah uang dibagi kepada A, B, dan C dengan perbandingan 2 : 3 : 5. Jika selisih bagian C dan A adalah Rp 600.000, berapakah jumlah uang B?",
                options: [
                    "Rp 400.000",
                    "Rp 600.000",
                    "Rp 800.000",
                    "Rp 1.000.000"
                ],
                answer: 1,
                explanation: "Selisih perbandingan C - A = 5 - 2 = 3 nilai bagian = Rp 600.000, artinya 1 bagian = Rp 200.000. Bagian B = 3 bagian x Rp 200.000 = Rp 600.000."
            },
            {
                question: "Jika X = 0,85 + 1/4 dan Y = 1,10 - 0,05, maka hubungan antara X dan Y adalah...",
                options: [
                    "X > Y",
                    "X < Y",
                    "X = Y",
                    "X dan Y tidak dapat ditentukan"
                ],
                answer: 0,
                explanation: "Nilai X = 0,85 + 0,25 = 1,10. Nilai Y = 1,10 - 0,05 = 1,05. Sehingga X (1,10) > Y (1,05)."
            },
            {
                question: "Semua calon peserta ujian yang terlambat tidak diperbolehkan masuk ruangan. Sebagian peserta ujian membawa dokumen tidak lengkap. Kesimpulan yang tepat adalah...",
                options: [
                    "Semua peserta yang membawa dokumen tidak lengkap pasti terlambat",
                    "Sebagian peserta ujian yang membawa dokumen tidak lengkap mungkin tetap diperbolehkan masuk ruangan jika tidak terlambat",
                    "Peserta yang tidak terlambat tidak perlu membawa dokumen lengkap",
                    "Semua calon peserta ujian diperbolehkan masuk ruangan"
                ],
                answer: 1,
                explanation: "Kriteria dilarang masuk spesifik hanya untuk yang 'terlambat'. Kelengkapan dokumen adalah variabel terpisah, sehingga peserta yang membawa dokumen tidak lengkap tetap boleh masuk selama tidak terlambat."
            },
            {
                question: "Sebuah bus berangkat dari kota A pukul 07.15 dengan kecepatan rata-rata 60 km/jam menuju kota B yang berjarak 180 km. Di perjalanan bus istirahat selama 30 menit. Pukul berapa bus tiba di kota B?",
                options: [
                    "10.15",
                    "10.45",
                    "11.15",
                    "11.45"
                ],
                answer: 1,
                explanation: "Waktu tempuh murni = 180 / 60 = 3 jam. Total waktu perjalanan = 3 jam + 30 menit = 3 jam 30 menit. Tiba di kota B = 07.15 + 03.30 = 10.45."
            },
            {
                question: "Jika 5 x a = 45 dan b = a - 3, maka nilai dari a^2 + b^2 adalah...",
                options: [
                    "81",
                    "117",
                    "125",
                    "144"
                ],
                answer: 1,
                explanation: "5a = 45 => a = 9. Maka b = 9 - 3 = 6. Nilai a^2 + b^2 = 9^2 + 6^2 = 81 + 36 = 117."
            },
            {
                question: "Siswa A lebih tinggi dari B. B lebih tinggi dari C. D lebih tinggi dari B tetapi lebih pendek dari A. Siapakah siswa yang paling pendek?",
                options: [
                    "A",
                    "B",
                    "C",
                    "D"
                ],
                answer: 2,
                explanation: "Urutan tinggi siswa dari yang tertinggi: A > D > B > C. Maka yang paling pendek adalah C."
            },
            {
                question: "Deret angka: 2, 4, 8, 16, 32, ... Angka berikutnya adalah...",
                options: [
                    "48",
                    "50",
                    "64",
                    "128"
                ],
                answer: 2,
                explanation: "Pola deret geometri dikali 2 berurutan: 32 x 2 = 64."
            },
            {
                question: "Deret angka: 100, 95, 85, 70, 50, ... Angka berikutnya adalah...",
                options: [
                    "20",
                    "25",
                    "30",
                    "35"
                ],
                answer: 1,
                explanation: "Pola pengurangan bertahap: -5, -10, -15, -20, maka berikutnya -25 (50 - 25 = 25)."
            },
            {
                question: "APOTEKER : OBAT = KOKI : ...",
                options: [
                    "DAPUR",
                    "RESEP",
                    "MASAKAN",
                    "RESTORAN"
                ],
                answer: 2,
                explanation: "Apoteker menghasilkan/mengelola Obat. Koki menghasilkan Masakan."
            },
            {
                question: "Jika 15% dari x adalah 45, berapakah nilai x?",
                options: [
                    "200",
                    "250",
                    "300",
                    "350"
                ],
                answer: 2,
                explanation: "0,15x = 45 => x = 45 / 0,15 = 300."
            },
            {
                question: "Harga 3 kg apel dan 2 kg jeruk adalah Rp 90.000. Jika harga 1 kg apel Rp 20.000, berapakah harga 1 kg jeruk?",
                options: [
                    "Rp 10.000",
                    "Rp 12.500",
                    "Rp 15.000",
                    "Rp 20.000"
                ],
                answer: 2,
                explanation: "Total apel = 3 x Rp 20.000 = Rp 60.000. Sisa untuk 2 kg jeruk = Rp 90.000 - Rp 60.000 = Rp 30.000. Harga 1 kg jeruk = Rp 15.000."
            },
            {
                question: "Semua bunga di taman berwarna cerah. Sebagian bunga di taman berbau harum. Kesimpulan yang sah adalah...",
                options: [
                    "Semua bunga berwarna cerah berbau harum",
                    "Sebagian bunga yang berbau harum berwarna cerah",
                    "Tidak ada bunga berwarna cerah yang tidak berbau harum",
                    "Semua bunga tidak berbau harum"
                ],
                answer: 1,
                explanation: "Karena sebagian bunga berbau harum ada di taman, dan semua bunga taman berwarna cerah, maka sebagian bunga harum pasti berwarna cerah."
            },
            {
                question: "Jika nilai x = 4 dan y = 3, maka nilai dari (2x + y)^2 adalah...",
                options: [
                    "121",
                    "144",
                    "169",
                    "225"
                ],
                answer: 0,
                explanation: "(2(4) + 3)^2 = (8 + 3)^2 = 11^2 = 121."
            },
            {
                question: "Hutang A adalah Rp 1.500.000. Ia membayar Rp 600.000. Berapa persen sisa hutang A dari hutang awal?",
                options: [
                    "40%",
                    "50%",
                    "60%",
                    "70%"
                ],
                answer: 2,
                explanation: "Sisa hutang = Rp 900.000. Persentase sisa = (900.000 / 1.500.000) x 100% = 60%."
            },
            {
                question: "Si A bergerak 10 meter ke timur, lalu 24 meter ke utara. Jarak terdekat posisi A sekarang dari titik awal adalah...",
                options: [
                    "26 meter",
                    "28 meter",
                    "30 meter",
                    "34 meter"
                ],
                answer: 0,
                explanation: "Gunakan Pyhtagoras: c = √(10^2 + 24^2) = √(100 + 576) = √676 = 26 meter."
            },
            {
                question: "LARI : SEHAT = BELAJAR : ...",
                options: [
                    "PINTAR",
                    "UJI",
                    "BUKU",
                    "SEKOLAH"
                ],
                answer: 0,
                explanation: "Lari menyebabkan kondisi Sehat. Belajar menyebabkan kondisi Pintar."
            },

            // --- TKP (Tes Karakteristik Pribadi - 20 Soal) ---
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
            },
            {
                question: "Instansi Anda memberlakukan kebijakan sistem kerja fleksibel (Work From Anywhere) berbasis target output. Rekan kerja satu tim Anda sering memanfaatkan waktu kerja untuk urusan pribadi sehingga targetnya terbengkalai. Sikap Anda adalah...",
                options: [
                    "Melaporkannya langsung ke pimpinan tanpa mengonfirmasinya terlebih dahulu",
                    "Mengingatkannya secara personal terkait komitmen target tim dan menawarkan bantuan jika ada hambatan teknis",
                    "Apatis dan membiarkannya menerima sanksi sendiri dari pimpinan",
                    "Mengerjakan sisa tugas rekan tersebut agar nilai evaluasi tim tetap aman"
                ],
                answer: 1,
                explanation: "Indikator Jejaring Kerja & Profesionalisme: Melakukan pendekatan persuasi rekan sejawat terlebih dahulu untuk menjaga integritas dan performa tim secara sehat."
            },
            {
                question: "Pimpinan meminta Anda menyelesaikan laporan analisis data pelayanan publik yang mendadak dalam waktu dua jam, padahal Anda sedang mengerjakan tugas rutin bulanan. Sikap Anda adalah...",
                options: [
                    "Menolak tugas mendadak tersebut karena sedang mengerjakan tugas rutin",
                    "Menerima tugas tersebut, melakukan skala prioritas, dan berkoordinasi untuk pendelegasian sementara tugas rutin jika diperlukan",
                    "Mengerjakan tugas mendadak tersebut asal-asalan agar cepat selesai",
                    "Meminta pimpinan memberikan tugas tersebut ke pegawai lain"
                ],
                answer: 1,
                explanation: "Indikator Kelangsungan Tugas & Adaptabilitas: Mampu mengelola stres kerja, menyusun skala prioritas cepat, serta bekerja efektif di bawah tekanan."
            },
            {
                question: "Teknologi AI terbaru diimplementasikan di unit kerja Anda untuk mempercepat analisis data berkas masyarakat. Kebanyakan senior merasa enggan belajar. Sikap Anda adalah...",
                options: [
                    "Mengikuti jejak senior untuk menggunakan cara manual saja",
                    "Proaktif mempelajari teknologi baru tersebut dan membuat panduan praktis sederhana untuk membantu rekan senior",
                    "Memanfaatkan teknologi baru tersebut hanya untuk penyelesaian tugas pribadi saja",
                    "Mengusulkan agar pengoperasian sistem AI tersebut dibatalkan saja"
                ],
                answer: 1,
                explanation: "Indikator Teknologi Informasi & Orientasi pada Perubahan: Menunjukkan antusiasme pembelajaran teknologi serta menjadi agen perubahan positif bagi lingkungan kerja."
            },
            {
                question: "Saat bertugas di daerah terpencil dengan fasilitas internet minim, Anda menemui kesulitan mengakses portal pelaporan kerja instansi. Tindakan Anda adalah...",
                options: [
                    "Menunggu hingga penugasan selesai baru membuat laporan",
                    "Mencari alternatif lokasi atau waktu akses terbaik serta mencatat data secara offline terlebih dahulu untuk diunggah begitu ada sinyal",
                    "Mengeluh kepada pimpinan agar fasilitas internet segera diperbaiki",
                    "Mengabaikan kewajiban pelaporan karena kondisi sarana tidak mendukung"
                ],
                answer: 1,
                explanation: "Indikator Semangat Berprestasi & Inisiatif: Mampu memecahkan masalah (problem solving) mandiri dalam keterbatasan sarana prasana kerja."
            },
            {
                question: "Anda menemukan bahwa rekan satu tim membuat laporan anggaran operasional yang tidak sesuai dengan data riil di lapangan. Sikap Anda adalah...",
                options: [
                    "Membiarkannya karena tidak ingin merusak hubungan pertemanan",
                    "Mengingatkan rekan tersebut secara baik-baik untuk memperbaiki laporan sesuai data riil dan melaporkannya ke pimpinan jika tidak diindahkan",
                    "Ikut mengambil keuntungan dari ketidaksesuaian anggaran tersebut",
                    "Menyebarkan informasi ketidaksesuaian tersebut kepada rekan kantor lainnya"
                ],
                answer: 1,
                explanation: "Integritas tinggi membutuhkan kejujuran, ketegasan menolak penyelewengan, serta pendekatan profesional."
            },
            {
                question: "Saat presentasi proyek pelayanan publik di depan pemangku kepentingan, pimpinan Anda keliru menyampaikan data statistik utama. Tindakan Anda adalah...",
                options: [
                    "Langsung memotong pembicaraan pimpinan dan mengoreksinya di depan umum",
                    "Menunggu pimpinan selesai berbicara, lalu melengkapi data secara sopan dan diplomatis saat sesi tanggapan",
                    "Diam saja dan membiarkan kesalahan data tersebut",
                    "Tertawa melihat kekeliruan pimpinan"
                ],
                answer: 1,
                explanation: "Orientasi Komunikasi & Etika Kerja: Menjaga kehormatan tim/pimpinan sekaligus memastikan akurasi data tersampaikan dengan cara diplomatis."
            },
            {
                question: "Sistem pelayanan dinas tempat Anda bekerja mengalami fluktuasi beban antrean ekstrem pada jam-jam tertentu. Inisiatif terbaik Anda adalah...",
                options: [
                    "Mengusulkan sistem nomor antrean online dan pembagian jam kedatangan warga kepada tim",
                    "Menambah jam kerja karyawan tanpa kompensasi",
                    "Membatasi jumlah warga yang boleh datang setiap hari",
                    "Meminta warga datang kembali di hari berikutnya"
                ],
                answer: 0,
                explanation: "Inovasi Pelayanan Publik: Mencari solusi efisien berbasis sistem untuk mengurai kemacetan antrean tanpa merugikan hak warga."
            },
            {
                question: "Anda diminta memimpin tim kerja berskala besar yang terdiri dari anggota dari berbagai latar belakang budaya dan disiplin ilmu. Langkah awal Anda adalah...",
                options: [
                    "Menerapkan aturan kerja pribadi tanpa kompromi",
                    "Membangun komunikasi terbuka, memetakan potensi tiap anggota, serta menyepakati tujuan dan aturan main bersama",
                    "Membagi tugas hanya kepada anggota yang satu daerah saja",
                    "Mewajibkan anggota menyesuaikan diri dengan gaya kerja Anda sepenuhnya"
                ],
                answer: 1,
                explanation: "Kepemimpinan & Perekat Bangsa: Mampu merangkul keberagaman, membangun sinergi, dan mengoptimalkan potensi tim multikultural."
            },
            {
                question: "Anda ditugaskan mendadak ke unit pelayanan yang memiliki standar kerja sangat cepat dan disiplin tinggi, berbeda dengan unit lama Anda. Sikap Anda adalah...",
                options: [
                    "Cepat mengamati pola kerja rekan di unit baru dan segera mengadaptasi kecepatan kerja sesuai standar mereka",
                    "Mengeluh kepada atasan karena dipindahkan ke unit kerja yang berat",
                    "Membawa cara kerja santai dari unit lama ke unit baru",
                    "Meminta rekan kerja unit baru memaklumi kelambatan Anda"
                ],
                answer: 0,
                explanation: "Indikator Adaptabilitas Tinggi: Cepat menyesuaikan diri dengan dinamika lingkungan kerja baru."
            },
            {
                question: "Keluarga Anda mengadakan acara penting di rumah bersamaan dengan tenggat waktu proyek pelayanan instansi yang mendesak. Sikap Anda adalah...",
                options: [
                    "Meninggalkan tugas kantor sepenuhnya demi acara keluarga",
                    "Menyelesaikan tugas kantor terlebih dahulu/mengatur pembagian waktu secara profesional agar keduanya terlaksana",
                    "Meminta rekan kantor menggantikan seluruh tugas Anda",
                    "Mematikan HP agar tidak dihubungi kantor"
                ],
                answer: 1,
                explanation: "Indikator Tanggung Jawab & Integritas Kerja: Mampu mengelola prioritas profesional tanpa mengabaikan aspek personal."
            },
            {
                question: "Pimpinan meminta masukan dari seluruh pegawai untuk perbaikan sistem kerja tahun depan. Sikap Anda adalah...",
                options: [
                    "Aktif memberikan gagasan konstruktif berbasis data efisiensi pelayanan yang selama ini ditemui di lapangan",
                    "Pasif dan memilih diam karena merasa suara tidak akan didengar",
                    "Mengusulkan hal-hal yang hanya menguntungkan diri sendiri",
                    "Mengkritik pimpinan tanpa memberikan solusi konkret"
                ],
                answer: 0,
                explanation: "Inisiatif & Kontribusi Aktif: ASN diharapkan proaktif dalam menyumbang ide perbaikan organisasi."
            },
            {
                question: "Dalam sebuah tim kerja, ada dua anggota yang berkonflik pribadi sehingga komunikasi tim terganggu. Sikap Anda sebagai rekan kerja adalah...",
                options: [
                    "Memicu permusuhan dengan membela salah satu pihak",
                    "Menjadi mediator netral yang mengajak keduanya berfokus pada profesionalisme target tim",
                    "Apatis dan membiarkan konflik merusak kerja tim",
                    "Melaporkan ke media sosial kantor"
                ],
                answer: 1,
                explanation: "Indikator Kerjasama & Perekat Tim: Mampu meredam potensi konflik demi kelancaran tugas bersama."
            },
            {
                question: "Seorang warga yang kurang memahami prosedur administrasi terus-menerus bertanya hal yang sama kepada Anda. Sikap Anda adalah...",
                options: [
                    "Menjelaskannya kembali dengan tenang, bahasa yang mudah dipahami, serta memberikan analogi/petunjuk visual sederhana",
                    "Menyuruh warga membaca sendiri papan petunjuk di dinding",
                    "Acuh tak acuh dan melayani warga berikutnya",
                    "Meminta petugas lain untuk mengambil alih dengan nada kesal"
                ],
                answer: 0,
                explanation: "Indikator Pelayanan Publik & Kesabaran Empatis: Melayani seluruh lapisan masyarakat dengan ramah dan tuntas."
            },
            {
                question: "Instansi Anda menerapkan evaluasi kinerja berbasis digital. Nilai evaluasi bulan ini menunjukkan penurunan dari bulan lalu. Sikap Anda adalah...",
                options: [
                    "Melakukan introspeksi diri, mengevaluasi titik kelemahan kerja, serta membuat target perbaikan bulanan",
                    "Menuduh sistem evaluasi digital mengalami error",
                    "Menyalahkan pimpinan yang memberikan penilaian subyektif",
                    "Mundur dari pekerjaan"
                ],
                answer: 0,
                explanation: "Indikator Orientasi pada Evaluasi & Pembelajaran Diri: Terbuka terhadap kritik dan berkomitmen meningkatkan performa."
            },
            {
                question: "Anda ditunjuk menjadi pimpinan tim kecil untuk proyek riset masyarakat. Salah satu anggota tim bekerja sangat lambat. Sikap Anda adalah...",
                options: [
                    "Mencari tahu kendala utamanya, memberikan bimbingan teknis, serta membagi target tugas menjadi skala harian yang terukur",
                    "Mengejeknya di depan anggota tim lain",
                    "Mengeluarkan anggota tersebut dari tim",
                    "Mengerjakan semua tugas anggota tersebut sendirian"
                ],
                answer: 0,
                explanation: "Indikator Kemampuan Memimpin & Mengembangkan Orang Lain: Mampu memotivasi dan memberdayakan anggota tim."
            },
            {
                question: "Masyarakat di daerah tempat Anda bertugas menolak program penyuluhan kesehatan karena mitos lokal. Sikap Anda adalah...",
                options: [
                    "Berpendekatan halus dengan merangkul tokoh masyarakat lokal terlebih dahulu untuk menjelaskan manfaat program secara persuasif",
                    "Memaksa warga mengikuti program dengan ancaman hukuman",
                    "Membatalkan program dan pergi dari daerah tersebut",
                    "Menghina kepercayaan masyarakat lokal"
                ],
                answer: 0,
                explanation: "Indikator Sosiokultural & Komunikasi Publik: Menghargai kearifan lokal serta menggunakan strategi pendampingan persuasif."
            },
            {
                question: "Unit kerja Anda mendapatkan penghargaan sebagai unit pelayanan terbaik nasional. Sikap Anda adalah...",
                options: [
                    "Tetap rendah hati dan menjadikan prestasi ini sebagai standar minimal pelayanan yang wajib dipertahankan bahkan ditingkatkan",
                    "Pamer berlebihan dan menjadi malas bekerja",
                    "Menuntut bonus tunjangan dinaikkan sepuluh kali lipat",
                    "Merasakan bahwa kerja keras sudah selesai"
                ],
                answer: 0,
                explanation: "Indikator Semangat Berprestasi Berkelanjutan: Tidak cepat puas diri dan konsisten menjaga standar tinggi."
            },
            {
                question: "Ketika listrik kantor padam di pertengahan pelayanan publik, tindakan cepat Anda adalah...",
                options: [
                    "Mengarahkan warga untuk berteduh nyaman, beralih sementara ke formulir manual jika memungkinkan, dan menginformasikan perkiraan waktu penanganan secara jujur",
                    "Langsung pulang ke rumah karena AC mati",
                    "Menyuruh warga pulang semua dan datang besok",
                    "Duduk santai di luar sambil mengobrol"
                ],
                answer: 0,
                explanation: "Indikator Tanggap Darurat & Solutif: Menjaga kenyamanan dan kepastian informasi pelayanan masyarakat dalam kondisi darurat."
            }
        ]
    },
    utbk: {
        title: "UTBK / SNBT (TPS & Literasi)",
        description: "Latihan Soal Tes Potensi Skolastik (TPS), Penalaran Kuantitatif, & Literasi Bahasa",
        questions: [
            // --- Penalaran Kuantitatif & Matematika Dasar (20 Soal) ---
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
            {
                question: "Suatu persegi panjang memiliki panjang (2x + 3) cm dan lebar (x + 1) cm. Jika keliling persegi panjang tersebut adalah 32 cm, berapakah luas persegi panjang tersebut?",
                options: [
                    "55 cm²",
                    "60 cm²",
                    "66 cm²",
                    "72 cm²"
                ],
                answer: 0,
                explanation: "Keliling = 2(p + l) => 32 = 2((2x+3) + (x+1)) => 16 = 3x + 4 => 3x = 12 => x = 4. Maka p = 2(4)+3 = 11 cm dan l = 4+1 = 5 cm. Luas = 11 x 5 = 55 cm²."
            },
            {
                question: "Sebuah kantong berisi 4 bola merah dan 6 bola biru. Jika diambil 2 bola sekaligus secara acak, peluang terambilnya kedua bola berwarna biru adalah...",
                options: [
                    "1/3",
                    "2/5",
                    "1/2",
                    "3/5"
                ],
                answer: 0,
                explanation: "Kombinasi 2 biru dari 6: C(6,2) = 15. Kombinasi total 2 bola dari 10: C(10,2) = 45. Peluang = 15 / 45 = 1/3."
            },
            {
                question: "Jika 3^(x+1) = 81, berapakah nilai dari 2^(2x - 1)?",
                options: [
                    "8",
                    "16",
                    "32",
                    "64"
                ],
                answer: 2,
                explanation: "3^(x+1) = 3^4 => x + 1 = 4 => x = 3. Nilai 2^(2(3) - 1) = 2^5 = 32."
            },
            {
                question: "Persamaan garis yang melalui titik (2, 5) dan tegak lurus terhadap garis y = 2x - 3 adalah...",
                options: [
                    "y = -1/2 x + 6",
                    "y = -2x + 9",
                    "y = 1/2 x + 4",
                    "y = -1/2 x + 4"
                ],
                answer: 0,
                explanation: "Gradien garis asal m1 = 2. Karena tegak lurus, m2 = -1/m1 = -1/2. Persamaan garis: y - 5 = -1/2(x - 2) => y = -1/2 x + 1 + 5 => y = -1/2 x + 6."
            },
            {
                question: "Nilai median dari data berurutan: 4, 5, 7, 8, x, 12, 14 adalah 8. Nilai x yang mungkin agar jangkauan data tersebut adalah 10 adalah...",
                options: [
                    "8",
                    "9",
                    "10",
                    "11"
                ],
                answer: 0,
                explanation: "Urutan 7 data: median ada di suku ke-4 yaitu 8. Jangkauan = Nilai Maksimum - Nilai Minimum = 14 - 4 = 10. Maka x bisa bernilai 8 (posisi ke-5) sehingga nilai median tetap 8 dan jangkauan 10."
            },
            {
                question: "Dalam suatu kelompok terdiri dari 30 siswa, 18 siswa menyukai matematika, 15 siswa menyukai bahasa Inggris, dan 5 siswa tidak menyukai keduanya. Banyak siswa yang menyukai KEDUANYA adalah...",
                options: [
                    "5 orang",
                    "8 orang",
                    "10 orang",
                    "12 orang"
                ],
                answer: 1,
                explanation: "Total siswa menyukai minimal satu pelajaran = 30 - 5 = 25. Jumlah (M + B) = 18 + 15 = 33. Suka keduanya = 33 - 25 = 8 orang."
            },
            {
                question: "Jika 2^(a) = 8 dan 3^(b) = 81, berapakah nilai dari a x b?",
                options: [
                    "7",
                    "12",
                    "16",
                    "24"
                ],
                answer: 1,
                explanation: "2^a = 2^3 => a = 3. 3^b = 3^4 => b = 4. Maka a x b = 3 x 4 = 12."
            },
            {
                question: "Hasil dari √50 + √18 - √32 adalah...",
                options: [
                    "2√2",
                    "3√2",
                    "4√2",
                    "5√2"
                ],
                answer: 2,
                explanation: "√50 = 5√2, √18 = 3√2, √32 = 4√2. (5√2 + 3√2 - 4√2) = 4√2."
            },
            {
                question: "Garis 2x + 3y = 12 memotong sumbu X di titik (a, 0) dan memotong sumbu Y di titik (0, b). Nilai a + b adalah...",
                options: [
                    "8",
                    "10",
                    "12",
                    "14"
                ],
                answer: 1,
                explanation: "Potong sumbu X (y=0): 2a = 12 => a = 6. Potong sumbu Y (x=0): 3b = 12 => b = 4. Nilai a + b = 6 + 4 = 10."
            },
            {
                question: "Sebuah wadah berbentuk tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm. Volume wadah tersebut adalah... (π = 22/7)",
                options: [
                    "1.540 cm³",
                    "1.600 cm³",
                    "1.720 cm³",
                    "1.840 cm³"
                ],
                answer: 0,
                explanation: "Volume = π x r^2 x t = (22/7) x 7 x 7 x 10 = 22 x 7 x 10 = 1.540 cm³."
            },
            {
                question: "Suku ke-5 suatu barisan aritmetika adalah 18 dan suku ke-9 adalah 34. Beda (b) barisan tersebut adalah...",
                options: [
                    "3",
                    "4",
                    "5",
                    "6"
                ],
                answer: 1,
                explanation: "U9 - U5 = 4b => 34 - 18 = 16 => 4b = 16 => b = 4."
            },
            {
                question: "Nilai dari lim (x->3) (x^2 - 9)/(x - 3) adalah...",
                options: [
                    "0",
                    "3",
                    "6",
                    "9"
                ],
                answer: 2,
                explanation: "Faktorkan pembilang: (x-3)(x+3)/(x-3) = x + 3. Masukkan x = 3 => 3 + 3 = 6."
            },
            {
                question: "Dua buah dadu dilempar bersamaan satu kali. Peluang muncul jumlah kedua mata dadu sama dengan 7 adalah...",
                options: [
                    "1/6",
                    "1/9",
                    "5/36",
                    "1/12"
                ],
                answer: 0,
                explanation: "Pasangan jumlah 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) -> ada 6 pasangan. Total sampel = 36. Peluang = 6/36 = 1/6."
            },
            {
                question: "Jika f(x) = 3x - 5 dan g(x) = 2x + 1, maka rumus fungsi komposisi (f o g)(x) adalah...",
                options: [
                    "6x - 2",
                    "6x - 5",
                    "6x + 3",
                    "6x - 8"
                ],
                answer: 0,
                explanation: "(f o g)(x) = f(g(x)) = 3(2x + 1) - 5 = 6x + 3 - 5 = 6x - 2."
            },
            {
                question: "Manakah nilai pecahan terkecil di antara pilihan berikut?",
                options: [
                    "3/8",
                    "2/5",
                    "1/3",
                    "4/9"
                ],
                answer: 2,
                explanation: "Desimal: 3/8 = 0,375; 2/5 = 0,40; 1/3 = 0,333; 4/9 = 0,444. Terkecil adalah 1/3 (0,333)."
            },
            {
                question: "Sebuah mobil membutuhkan 12 liter bensin untuk menempuh jarak 108 km. Berapa liter bensin yang dibutuhkan untuk menempuh jarak 180 km?",
                options: [
                    "18 liter",
                    "20 liter",
                    "22 liter",
                    "24 liter"
                ],
                answer: 1,
                explanation: "Konsumsi = 108 km / 12 liter = 9 km/liter. Kebutuhan untuk 180 km = 180 / 9 = 20 liter."
            },

            // --- Penalaran Logis & Analitis (10 Soal) ---
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
            {
                question: "Semua ilmuwan menyukai membaca buku. Sebagian orang yang menyukai membaca buku memiliki wawasan luas. Berdasarkan dua premis tersebut, pernyataan yang PASTI BENAR adalah...",
                options: [
                    "Semua ilmuwan memiliki wawasan luas",
                    "Sebagian orang yang menyukai membaca buku adalah ilmuwan",
                    "Tidak ada ilmuwan yang tidak memiliki wawasan luas",
                    "Semua orang yang memiliki wawasan luas adalah ilmuwan"
                ],
                answer: 1,
                explanation: "Karena 'semua ilmuwan menyukai membaca buku', maka secara logis 'sebagian orang yang menyukai membaca buku adalah ilmuwan' (pembalikan himpunan universal)."
            },
            {
                question: "Dalam suatu kompetisi catur: Anton menang atas Budi. Candra kalah dari Dedi. Budi menang atas Candra. Pernyataan berikut yang paling tepat menggambarkan posisi peringkat dari teratas adalah...",
                options: [
                    "Anton pasti berada di peringkat paling atas di atas Dedi",
                    "Candra adalah pemain dengan posisi terbawah di antara Anton, Budi, dan Candra",
                    "Dedi adalah pemain terbaik di antara semuanya",
                    "Budi mengalahkan Dedi"
                ],
                answer: 1,
                explanation: "Urutan lokal: Anton > Budi > Candra. Dedi > Candra. Terlihat jelas bahwa Candra dikalahkan oleh Budi maupun Dedi, sehingga posisi Candra terbawah di antara grup tersebut."
            },
            {
                question: "Jika hari ini hujan deras, maka jalanan macet. Jika jalanan macet, maka Budi datang terlambat ke sekolah. Kesimpulan yang sah berdasarkan logika matematika adalah...",
                options: [
                    "Jika hari ini tidak hujan, maka jalanan tidak macet",
                    "Jika hari ini hujan deras, maka Budi datang terlambat ke sekolah",
                    "Jika Budi tidak terlambat, maka hari ini hujan deras",
                    "Budi tidak pernah terlambat ke sekolah"
                ],
                answer: 1,
                explanation: "Hukum Silogisme: p -> q dan q -> r, maka kesimpulannya adalah p -> r (Jika hari ini hujan deras, maka Budi datang terlambat ke sekolah)."
            },
            {
                question: "Semua komputer canggih memerlukan daya listrik stabil. Sebagian perangkat kantor adalah komputer canggih. Kesimpulan yang tepat adalah...",
                options: [
                    "Semua perangkat kantor memerlukan daya listrik stabil",
                    "Sebagian perangkat kantor memerlukan daya listrik stabil",
                    "Tidak ada perangkat kantor yang memerlukan daya listrik stabil",
                    "Semua perangkat kantor bukan komputer canggih"
                ],
                answer: 1,
                explanation: "Karena hanya sebagian perangkat kantor yang merupakan komputer canggih, maka hanya sebagian perangkat kantor tersebut yang memerlukan daya listrik stabil."
            },
            {
                question: "Premis 1: Jika Ani rajin belajar, maka nilai Ujiannya tinggi.\nPremis 2: Nilai Ujian Ani tidak tinggi.\nKesimpulan yang sah adalah...",
                options: [
                    "Ani rajin belajar",
                    "Ani tidak rajin belajar",
                    "Ani sakit saat ujian",
                    "Ujian Ani terlalu sulit"
                ],
                answer: 1,
                explanation: "Hukum Modus Tollens: p -> q, ~q, maka kesimpulannya ~p (Ani tidak rajin belajar)."
            },
            {
                question: "Semua unggas bereproduksi dengan bertelur. Bebek adalah jenis unggas. Kesimpulan yang pasti adalah...",
                options: [
                    "Bebek bereproduksi dengan bertelur",
                    "Sebagian bebek bertelur sebagian melahirkan",
                    "Bebek tidak bereproduksi",
                    "Tidak semua unggas bertelur"
                ],
                answer: 0,
                explanation: "Hukum Modus Ponens: Semua A adalah B. C adalah A. Maka C adalah B (Bebek bertelur)."
            },
            {
                question: "Dalam tes lari: X lebih cepat dari Y. Y lebih lambat dari Z. Z lebih cepat dari X. Urutan pelari dari yang paling CEPAT adalah...",
                options: [
                    "Z, X, Y",
                    "X, Z, Y",
                    "Y, X, Z",
                    "Z, Y, X"
                ],
                answer: 0,
                explanation: "Pertidaksamaan: Z > X > Y. Maka pelari tercepat adalah Z, lalu X, dan Y."
            },
            {
                question: "Semua kendaraan umum memerlukan bahan bakar. Sebagian kendaraan umum bertenaga listrik. Kesimpulan yang sah adalah...",
                options: [
                    "Sebagian kendaraan bertenaga listrik memerlukan bahan bakar",
                    "Semua kendaraan bertenaga listrik tidak butuh bahan bakar",
                    "Semua kendaraan umum bertenaga listrik",
                    "Tidak ada kendaraan umum yang ramah lingkungan"
                ],
                answer: 0,
                explanation: "Karena seluruh kendaraan umum butuh bahan bakar dan sebagiannya bertenaga listrik, maka sebagian kendaraan bertenaga listrik tersebut memerlukan bahan bakar."
            },
            {
                question: "Jika x > y dan y > z, maka hubungan antara x dan z adalah...",
                options: [
                    "x < z",
                    "x = z",
                    "x > z",
                    "x dan z tidak bisa dibandingkan"
                ],
                answer: 2,
                explanation: "Hukum Transitif: x > y > z, maka pasti x > z."
            },

            // --- Literasi Bahasa Indonesia & Bahasa Inggris (30 Soal) ---
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
            },
            {
                question: "Bacalah paragraf berikut:\n'(1) Pemanasan global berdampak serius bagi ekosistem pesisir. (2) Kenaikan permukaan air laut mengancam pemukiman warga di wilayah pesisir. (3) Banyak warga pesisir bekerja sebagai nelayan tradisional. (4) Selain itu, abrasi pantai semakin mengikis lahan produktif.'\n\nKalimat yang TIDAK padu (sumbang) dalam paragraf di atas adalah kalimat nomor...",
                options: [
                    "(1)",
                    "(2)",
                    "(3)",
                    "(4)"
                ],
                answer: 2,
                explanation: "Kalimat (1), (2), dan (4) berfokus pada dampak kerusakan fisik akibat pemanasan global/abrasi pantai. Kalimat (3) melenceng membicarakan mata pencaharian warga."
            },
            {
                question: "Kata 'efisiensi' dalam kalimat 'Pemerintah terus mendorong efisiensi anggaran di setiap kementerian' memiliki padanan kata (sinonim) yang paling tepat dengan...",
                options: [
                    "Penghematan",
                    "Pemangkasan",
                    "Ketepatan guna",
                    "Penundaan"
                ],
                answer: 2,
                explanation: "Efisiensi secara harfiah adalah ketepatgunaan atau kemampuan menjalankan tugas tanpa membuang waktu dan biaya."
            },
            {
                question: "Renewable energy sources such as solar and wind power are essential for mitigating climate change because they emit minimal greenhouse gases during operation. According to the sentence, why is renewable energy crucial?",
                options: [
                    "Because it is cheaper than conventional fossil fuels.",
                    "Because it produces minimal greenhouse gas emissions during operation.",
                    "Because solar panels can be installed anywhere without restriction.",
                    "Because it completely eliminates the need for electricity grids."
                ],
                answer: 1,
                explanation: "Jawaban tersurat langsung di klausa pendukung: '...because they emit minimal greenhouse gases during operation'."
            },
            {
                question: "Manakah kalimat berikut yang termasuk kalimat EFEKTIF?",
                options: [
                    "Bagi para siswa-siswa sekolah yang ingin mendaftar wajib membawa kartu identitas.",
                    "Siswa sekolah yang ingin mendaftar wajib membawa kartu identitas.",
                    "Demi untuk menjaga kebersihan bersama, buanglah sampah pada tempatnya.",
                    "Rapat itu membahas tentang rencana anggaran tahun depan."
                ],
                answer: 1,
                explanation: "Opsi B efektif tanpa pemborosan kata (para siswa-siswa / demi untuk / membahas tentang)."
            },
            {
                question: "Makna kata bentukan 'memperluas' dalam klausa 'pemerintah memperluas akses pendidikan' adalah...",
                options: [
                    "Menjadikan lebih luas",
                    "Membuat menjadi sangat luas sekali",
                    "Menganggap luas",
                    "Menambah Luas"
                ],
                answer: 0,
                explanation: "Imbuhan me-kan / mem-per- pada kata dasar luas memiliki makna kausatif: 'menjadikan lebih luas'."
            },
            {
                question: "Inequality in educational access often perpetuates socioeconomic disparities across generations. The word 'perpetuates' in the sentence is closest in meaning to...",
                options: [
                    "Continues or prolongs",
                    "Eliminates or stops",
                    "Transforms or changes",
                    "Reduces or shrinks"
                ],
                answer: 0,
                explanation: "Perpetuate berarti melestarikan / meneruskan / memperpanjang suatu kondisi."
            },
            {
                question: "Penulisan kata serapan yang TEPAT sesuai Pedoman Umum Ejaan Bahasa Indonesia (PUEBI) adalah...",
                options: [
                    "Analisa data tersebut sudah selesai.",
                    "Kualitas pelayanan publik harus terus ditingkatkan.",
                    "Sistem perijinan online sangat membantu.",
                    "Praktikum dikerjakan di laboratorium tehnik."
                ],
                answer: 1,
                explanation: "Bentuk baku: kualitas (bukan kwalitas), analisis (bukan analisa), perizinan (bukan perijinan), teknik (bukan tehnik)."
            },
            {
                question: "Gagasan utama paragraf ditentukan oleh letak kalimat utamanya. Paragraf yang kalimat utamanya terletak di awal paragraf disebut paragraf...",
                options: [
                    "Induktif",
                    "Deduktif",
                    "Campuran",
                    "Naratif"
                ],
                answer: 1,
                explanation: "Paragraf Deduktif adalah paragraf yang gagasan utamanya terletak di awal paragraf."
            },
            {
                question: "The author's primary purpose in writing a scientific research paper is to...",
                options: [
                    "Entertain readers with fictional stories",
                    "Persuade readers to buy a specific commercial product",
                    "Present empirical evidence and objective findings to inform the scientific community",
                    "Express personal emotional experiences"
                ],
                answer: 2,
                explanation: "Tujuan utama artikel ilmiah adalah menyajikan bukti empiris dan temuan obyektif kepada komunitas ilmiah."
            },
            {
                question: "Antonim (lawan kata) yang paling tepat untuk kata 'SKEPTIS' adalah...",
                options: [
                    "Apatis",
                    "Optimis / Yakin",
                    "Ragu-ragu",
                    "Kritis"
                ],
                answer: 1,
                explanation: "Skeptis berarti kurang percaya atau ragu-ragu. Lawan katanya adalah yakin / percaya / optimis."
            },
            {
                question: "Di antara kata-kata berikut, manakah penulisan kata berimbuhan yang BAKU?",
                options: [
                    "Mempratikkannya",
                    "Mempraktikkannya",
                    "Memperatikkannya",
                    "Memraktekannya"
                ],
                answer: 1,
                explanation: "Kata dasar 'praktik' (baku). Imbuhan me-kan pada kata berawalan p meluluh menjadi m: mempraktikkannya."
            },
            {
                question: "Although the negotiation was lengthy and full of debates, both parties finally reached a consensus. The word 'consensus' means...",
                options: [
                    "A total disagreement",
                    "A general agreement",
                    "A financial loss",
                    "A sudden cancellation"
                ],
                answer: 1,
                explanation: "Consensus artinya kesepakatan bersama (general agreement)."
            },
            {
                question: "Penulisan judul karangan ilmiah berikut yang TEPAT sesuai PUEBI adalah...",
                options: [
                    "Pengaruh Era Digital Terhadap Pola Komunikasi Remaja Di Medan",
                    "Pengaruh Era Digital terhadap Pola Komunikasi Remaja di Medan",
                    "Pengaruh era digital terhadap pola komunikasi remaja di Medan",
                    "PENGARUH ERA DIGITAL Terhadap Pola Komunikasi Remaja Di Medan"
                ],
                answer: 1,
                explanation: "Huruf pertama setiap kata dalam judul diawali huruf kapital, KECUALI kata hubung/depresi seperti 'terhadap' dan 'di' jika tidak terletak di awal kalimat."
            },
            {
                question: "Kalimat yang menggunakan kata bercetak miring bermakna DENOTATIF adalah...",
                options: [
                    "Ia menyeduh kopi hitam di pagi hari.",
                    "Kasus tersebut dibawa ke meja hijau.",
                    "Politikus itu dikenal sebagai kambing hitam.",
                    "Anak itu adalah anak emas di keluarganya."
                ],
                answer: 0,
                explanation: "Denotatif berarti makna sebenarnya (kopi berwarna hitam), sedangkan pilihan lain bermakna kiasan/konotatif."
            },
            {
                question: "The main reason scientists study climate change models is to predict future environmental risks. The word 'predict' is synonymous with...",
                options: [
                    "Forecast",
                    "Ignore",
                    "Create",
                    "Prevent"
                ],
                answer: 0,
                explanation: "Predict artinya meramalkan / memprediksi (forecast)."
            },
            {
                question: "Ungkapan 'Gulung tikar' dalam konteks dunia usaha memiliki arti...",
                options: [
                    "Mengalami kebangkrutan",
                    "Pindah lokasi kantor",
                    "Mendapatkan keuntungan besar",
                    "Melakukan renovasi gedung"
                ],
                answer: 0,
                explanation: "Gulung tikar adalah kiasan untuk perusahaan yang bangkrut/tutup usaha."
            },
            {
                question: "Kalimat pasif yang TEPAT di bawah ini adalah...",
                options: [
                    "Laporan analisis data telah diselesaikan oleh tim proyek.",
                    "Tim proyek menyelesaikan laporan analisis data.",
                    "Laporan analisis data menyelesaikan tim proyek.",
                    "Tim proyek dianalisis oleh laporan."
                ],
                answer: 0,
                explanation: "Kalimat pasif ditandai oleh subjek yang dikenai tindakan dan kata kerja berimbuhan di- / ter- diikuti oleh 'oleh'."
            },
            {
                question: "Bentuk baku dari kata yang sering salah ditulis 'hirarki' adalah...",
                options: [
                    "Hierarki",
                    "Hirarki",
                    "Herarki",
                    "Hirarkis"
                ],
                answer: 0,
                explanation: "Berdasarkan KBBI, bentuk baku kata tersebut adalah 'Hierarki'."
            },
            {
                question: "Despite the heavy rain, the students continued their outdoor physical test. The word 'Despite' indicates...",
                options: [
                    "Concession / Contrast",
                    "Cause and Effect",
                    "Addition",
                    "Time order"
                ],
                answer: 0,
                explanation: "Despite digunakan untuk menyatakan pertentangan / pengandaian walau ada hambatan (contrast/concession)."
            },
            {
                question: "Kata dasar dari kata berimbuhan 'mempertanyakan' adalah...",
                options: [
                    "Tanya",
                    "Pertanya",
                    "Tanyakan",
                    "Pertanyakan"
                ],
                answer: 0,
                explanation: "Kata dasarnya adalah 'tanya', mendapat imbuhan mem-per-kan."
            },
            {
                question: "Simpulan paragraf yang baik harus memenuhi kriteria berikut, KECUALI...",
                options: [
                    "Mewakili seluruh isi bacaan secara objektif",
                    "Menggunakan kata-kata yang memprovokasi pembaca",
                    "Tidak bertentangan dengan fakta dalam teks",
                    "Disusun secara singkat, padat, dan jelas"
                ],
                answer: 1,
                explanation: "Simpulan ilmiah harus objektif dan bebas dari bahasa provokatif."
            },
            {
                question: "Pilihan kata yang tepat untuk menggambarkan suasana yang sangat tenang dan sunyi adalah...",
                options: [
                    "Hening",
                    "Gaduh",
                    "Ramai",
                    "Bising"
                ],
                answer: 0,
                explanation: "Hening bermakna sunyi, tenang, dan tidak ada suara."
            },
            {
                question: "Digital literacy is essential for modern citizens to critically evaluate online information. The opposite of 'essential' is...",
                options: [
                    "Unnecessary",
                    "Important",
                    "Crucial",
                    "Vital"
                ],
                answer: 0,
                explanation: "Essential berarti sangat penting. Lawan katanya adalah Unnecessary (tidak diperlukan)."
            },
            {
                question: "Istilah 'rekayasa lalu lintas' dalam wacana perkotaan mengandung arti...",
                options: [
                    "Pengaturan kembali alur lalu lintas untuk mengurai kemacetan",
                    "Pembuatan jalan tol baru secara ilegal",
                    "Kecelakaan lalu lintas yang disengaja",
                    "Pemberhentian total seluruh angkutan umum"
                ],
                answer: 0,
                explanation: "Rekayasa lalu lintas adalah upaya manajemen lalu lintas untuk mengoptimalkan kapasitas jalan."
            },
            {
                question: "Rangkaian peristiwa dalam cerita yang memiliki hubungan sebab-akibat disebut...",
                options: [
                    "Alur / Plot",
                    "Latar / Setting",
                    "Amanat",
                    "Penokohan"
                ],
                answer: 0,
                explanation: "Alur (plot) adalah jalinan peristiwa yang disusun berdasarkan kausalitas (sebab-akibat)."
            },
            {
                question: "The term 'carbon footprint' refers to...",
                options: [
                    "The total amount of greenhouse gases generated by human activities",
                    "The mark left by shoes on dirty surfaces",
                    "A new type of renewable energy source",
                    "The price of coal in global trade"
                ],
                answer: 0,
                explanation: "Jejak karbon (carbon footprint) adalah total emisi gas rumah kaca yang dihasilkan oleh aktivitas manusia."
            },
            {
                question: "Kalimat di bawah ini yang menggunakan majas METAFORA adalah...",
                options: [
                    "Perpustakaan adalah gudang ilmu bagi para siswa.",
                    "Nyiur melambai-lambai di tepi pantai.",
                    "Suaranya menggelegar membelah angkasa.",
                    "Ia membeli lima ekor kambing."
                ],
                answer: 0,
                explanation: "Metafora membandingkan dua hal secara langsung tanpa kata pembanding ('Perpustakaan adalah gudang ilmu')."
            }
        ]
    }
};
