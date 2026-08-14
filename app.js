// Bank Soal Berdasarkan Kategori
const quizCategories = {
    cpns: {
        title: "CPNS & PPPK",
        description: "Latihan Soal Tes Wawasan Kebangsaan (TWK) & Integritas ASN",
        questions: [
            {
                question: "Kedudukan Pancasila sebagai dasar negara Indonesia secara yuridis formal tercantum dalam...",
                options: [
                    "Batang Tubuh UUD 1945",
                    "Ketetapan MPR No. II/MPR/1978",
                    "Pembukaan UUD 1945 alinea IV",
                    "Proklamasi Kemerdekaan 17 Agustus 1945"
                ],
                answer: 2,
                explanation: "Secara yuridis formal, Pancasila ditetapkan sebagai dasar negara Republik Indonesia dalam Pembukaan UUD 1945 alinea IV pada tanggal 18 Agustus 1945 oleh PPKI."
            },
            {
                question: "Sikap integritas seorang ASN dalam menjalankan tugas publik paling utama ditunjukkan dengan...",
                options: [
                    "Bekerja sesuai perintah atasan tanpa bertanya",
                    "Menolak segala bentuk gratifikasi dan bertindak transparan",
                    "Menyelesaikan pekerjaan secepat mungkin",
                    "Mengikuti semua kegiatan organisasi"
                ],
                answer: 1,
                explanation: "Integritas tinggi seorang ASN ditunjukkan dengan kejujuran, transparansi, serta konsistensi menolak gratifikasi dan korupsi."
            }
        ]
    },
    utbk: {
        title: "UTBK / SNBT",
        description: "Latihan Soal Tes Potensi Skolastik (TPS) & Literasi",
        questions: [
            {
                question: "Pengikisan pantai oleh gelombang laut yang merusak daratan disebut...",
                options: [
                    "Erosi",
                    "Abrasi",
                    "Deflasi",
                    "Korasi"
                ],
                answer: 1,
                explanation: "Abrasi adalah proses pengikisan pantai oleh tenaga gelombang laut dan arus laut yang bersifat merusak."
            },
            {
                question: "Jika 2x + 5 = 15, maka nilai dari 3x - 2 adalah...",
                options: [
                    "11",
                    "13",
                    "15",
                    "17"
                ],
                answer: 1,
                explanation: "2x + 5 = 15 => 2x = 10 => x = 5. Nilai 3x - 2 = 3(5) - 2 = 15 - 2 = 13."
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
        <div id="question-text" style="font-size: 1.1rem; font-weight: 500; margin-bottom: 20px; line-height: 1.5; color: #202124;"></div>
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
                <p style="margin-bottom: 6px;"><strong>${i + 1}. ${data.question}</strong></p>
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
