const quizData = [
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
        explanation: "2x + 5 = 15  =>  2x = 10  =>  x = 5. Nilai 3x - 2 = 3(5) - 2 = 15 - 2 = 13."
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
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

const quizCard = document.getElementById("quiz-card");

function loadQuiz() {
    if (currentQuestion < quizData.length) {
        const data = quizData[currentQuestion];
        document.getElementById("question-number").innerText = `Soal ${currentQuestion + 1} dari ${quizData.length}`;
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

function selectOption(index) {
    userAnswers[currentQuestion] = index;
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
        btn.style.backgroundColor = idx === index ? "#e8f0fe" : "#fff";
        btn.style.borderColor = idx === index ? "#1a73e8" : "#dadce0";
    });
    document.getElementById("next-btn").style.display = "block";
}

document.getElementById("next-btn").addEventListener("click", () => {
    if (userAnswers[currentQuestion] === quizData[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    loadQuiz();
});

function showResults() {
    let resultHTML = `
        <h2>Kuis Selesai! 🎉</h2>
        <p style="font-size: 1.2rem; margin: 15px 0;">Skor Anda: <strong>${score} / ${quizData.length}</strong> (${Math.round((score/quizData.length)*100)}%)</p>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        <h3>Pembahasan Soal:</h3>
        <div style="text-align: left; margin-top: 15px;">
    `;

    quizData.forEach((data, i) => {
        const isCorrect = userAnswers[i] === data.answer;
        resultHTML += `
            <div style="margin-bottom: 20px; padding: 12px; background: ${isCorrect ? '#e6f4ea' : '#fce8e6'}; border-radius: 6px;">
                <p><strong>${i + 1}. ${data.question}</strong></p>
                <p>Jawaban Anda: ${userAnswers[i] !== undefined ? data.options[userAnswers[i]] : 'Tidak dijawab'} ${isCorrect ? '✅' : '❌'}</p>
                <p>Kunci Jawaban: <strong>${data.options[data.answer]}</strong></p>
                <p style="font-size: 0.9rem; color: #555; margin-top: 5px;"><em>💡 Pembahasan: ${data.explanation}</em></p>
            </div>
        `;
    });

    resultHTML += `
        </div>
        <button onclick="location.reload()" class="btn primary-btn" style="margin-top: 15px;">Ulangi Kuis</button>
    `;

    quizCard.innerHTML = resultHTML;
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration Failed!', err));
    });
}

loadQuiz();
