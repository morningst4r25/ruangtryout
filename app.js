// Bank Soal Berdasarkan Kategori (CPNS HOTS & UTBK TPS)
const quizCategories = {
    cpns: {
        title: "CPNS & PPPK (Soal HOTS)",
        description: "Latihan Soal SKD: TWK (Nasionalisme/Integritas), TIU (Penalaran/Numerik), & TKP",
        questions: [
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
                question: "Jika semua ASN profesional berpakaian rapi. Sebagian orang yang berpakaian rapi memiliki integritas tinggi. Berdasarkan dua pernyataan tersebut, kesimpulan yang paling tepat adalah...",
                options: [
                    "Semua ASN profesional pasti memiliki integritas tinggi",
                    "Sebagian ASN profesional mungkin memiliki integritas tinggi",
                    "Tidak ada ASN profesional yang tidak berpakaian rapi",
                    "Semua orang yang berpakaian rapi adalah ASN profesional"
                ],
                answer: 1,
                explanation: "Term 'ASN profesional' masuk dalam himpunan 'berpakaian rapi'. Karena hanya 'sebagian' orang berpakaian rapi yang berintegritas tinggi, maka hubungan antara ASN profesional dan integritas tinggi bersifat 'sebagian/mungkin'."
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
                explanation: "Sisa beban kerja = $(30 - 10) \\times 20 = 400$ hari-kerja. Sisa waktu efektif = $20 - 4 = 16$ hari. Pekerja yang dibutuhkan = $400 / 16 = 25$ orang. Pekerja tambahan = $25 - 20 = 5$ orang."
            },
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
            }
        ]
    },
    utbk: {
        title: "UTBK / SNBT (TPS & Literasi)",
        description: "Latihan Soal Tes Potensi Skolastik (TPS), Penalaran Kuantitatif, & Literasi",
        questions: [
            {
                question: "Rata-rata nilai kuis dari 5 orang siswa adalah 80. Jika nilai satu siswa dengan nilai terkecil dikeluarkan, rata-rata nilai 4 siswa sisanya menjadi 84. Berapakah nilai siswa yang dikeluarkan tersebut?",
                options: [
                    "60",
                    "64",
                    "68",
                    "72"
                ],
                answer: 1,
                explanation: "Total nilai awal 5 siswa = $5 \\times 80 = 400$. Total nilai 4 siswa sisa = $4 \\times 84 = 336$. Nilai siswa yang dikeluarkan = $400 - 336 = 64$."
            },
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
                question: "Jika p x q = p + q + 2, maka nilai dari 3 x 4 adalah...",
                options: [
                    "7",
                    "9",
                    "11",
                    "14"
                ],
                answer: 1,
                explanation: "Operasi khusus: $3 \\times 4 = 3 + 4 + 2 = 9$."
            }
        ]
    }
};

let currentCategoryKey = null;
let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

const quizCard = document.getElementById("quiz-card");

// 1. Tampilan Menu Pemilihan Kategori
function showCategoryMenu() {
    let menuHTML = `
        <h2 style="margin-bottom: 8px; text-align: center; color: #1a73e8;">Pilih Kategori Kuis</h2>
        <p style="margin-bottom: 24px; text-align: center; color: #666; font-size: 0.95rem;">Pilih program latihan yang ingin Anda ikuti hari ini:</p>
        <div style="display: flex; flex-direction: column; gap: 16px;">
    `;

    for (const key in quizCategories) {
        const cat = quizCategories[key];
        menuHTML += `
            <div onclick="selectCategory('${key}')" style="
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                padding: 18px;
                cursor: pointer;
                transition: all 0.2s ease;
                background: #ffffff;
                text-align: left;
            " onmouseover="this.style.borderColor='#1a73e8'; this.style.backgroundColor='#f8fafd';" 
               onmouseout="this.style.borderColor='#e0e0e0'; this.style.backgroundColor='#ffffff';">
                <h3 style="color: #202124; margin-bottom: 6px;">🎯 ${cat.title}</h3>
                <p style="color: #5f6368; font-size: 0.9rem; line-height: 1.4;">${cat.description}</p>
            </div>
        `;
    }

    menuHTML += `</div>`;
    quizCard.innerHTML = menuHTML;
}

// 2. Memulai Kuis Berdasarkan Kategori yang Dipilih
function selectCategory(categoryKey) {
    currentCategoryKey = categoryKey;
    currentQuizData = quizCategories[categoryKey].questions;
    currentQuestion = 0;
    score = 0;
    userAnswers = [];

    renderQuizStructure();
    loadQuiz();
}

// 3. Menyiapkan Elemen HTML Kuis
function renderQuizStructure() {
    quizCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span id="question-number" style="font-size: 0.85rem; font-weight: 600; color: #1a73e8;"></span>
            <button onclick="showCategoryMenu()" style="background: none; border: none; color: #666; cursor: pointer; font-size: 0.85rem;">← Ganti Kategori</button>
        </div>
        <div id="question-text" style="font-size: 1.05rem; font-weight: 500; margin-bottom: 20px; line-height: 1.6; color: #202124; white-space: pre-line;"></div>
        <div id="options-container" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>
        <button id="next-btn" class="btn primary-btn" style="display: none;">Selanjutnya</button>
    `;

    document.getElementById("next-btn").addEventListener("click", handleNextQuestion);
}

// 4. Memuat Soal
function loadQuiz() {
    if (currentQuestion < currentQuizData.length) {
        const data = currentQuizData[currentQuestion];
        document.getElementById("question-number").innerText = `${quizCategories[currentCategoryKey].title} • Soal ${currentQuestion + 1} dari ${currentQuizData.length}`;
        document.getElementById("question-text").innerText = data.question;

        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        data.options.forEach((option, index) => {
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.innerText = `${String.fromCharCode(65 + index)}. ${option}`;
            btn.onclick = () => selectOption(index);
            optionsContainer.appendChild(btn);
        });

        document.getElementById("next-btn").style.display = "none";
    } else {
        showResults();
    }
}

// 5. Menandai Pilihan Jawaban
function selectOption(index) {
    userAnswers[currentQuestion] = index;
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
        btn.style.backgroundColor = idx === index ? "#e8f0fe" : "#fff";
        btn.style.borderColor = idx === index ? "#1a73e8" : "#dadce0";
    });
    document.getElementById("next-btn").style.display = "block";
}

// 6. Navigasi Soal Berikutnya
function handleNextQuestion() {
    if (userAnswers[currentQuestion] === currentQuizData[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    loadQuiz();
}

// 7. Menampilkan Skor & Pembahasan
function showResults() {
    let resultHTML = `
        <h2 style="color: #202124;">Kuis ${quizCategories[currentCategoryKey].title} Selesai! 🎉</h2>
        <p style="font-size: 1.2rem; margin: 15px 0;">Skor Anda: <strong>${score} / ${currentQuizData.length}</strong> (${Math.round((score/currentQuizData.length)*100)}%)</p>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        <h3 style="margin-bottom: 15px; text-align: left;">Pembahasan Soal:</h3>
        <div style="text-align: left;">
    `;

    currentQuizData.forEach((data, i) => {
        const isCorrect = userAnswers[i] === data.answer;
        resultHTML += `
            <div style="margin-bottom: 20px; padding: 14px; background: ${isCorrect ? '#e6f4ea' : '#fce8e6'}; border-radius: 8px;">
                <p style="margin-bottom: 6px; white-space: pre-line;"><strong>${i + 1}. ${data.question}</strong></p>
                <p style="margin-bottom: 4px;">Jawaban Anda: ${userAnswers[i] !== undefined ? data.options[userAnswers[i]] : 'Tidak dijawab'} ${isCorrect ? '✅' : '❌'}</p>
                <p style="margin-bottom: 6px;">Kunci Jawaban: <strong>${data.options[data.answer]}</strong></p>
                <p style="font-size: 0.9rem; color: #555;"><em>💡 Pembahasan: ${data.explanation}</em></p>
            </div>
        `;
    });

    resultHTML += `
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="selectCategory('${currentCategoryKey}')" class="btn primary-btn">Ulangi Kuis Ini</button>
            <button onclick="showCategoryMenu()" class="btn" style="background: #f1f3f4; color: #3c4043;">Pilih Kategori Lain</button>
        </div>
    `;

    quizCard.innerHTML = resultHTML;
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration Failed!', err));
    });
}

// Jalankan Menu Kategori saat pertama kali dibuka
showCategoryMenu();
