// Bank Soal Berdasarkan Kategori (CPNS HOTS & UTBK TPS) - Batch 1 s.d 4 (Total 60 Soal)
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
                question: "KeputusanPanitia Sembilan pada 22 Juni 1945 yang menghasilkan Piagam Jakarta menjadi rumusan awal Pembukaan UUD 1945. Nilai utama yang ditunjukkan para tokoh pendiri bangsa dalam perubahan frasa Sila Pertama pada 18 Agustus 1945 adalah...",
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
            }
        ]
    }
};
