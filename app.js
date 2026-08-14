// app.js - Logika Kuis + Fitur Timer Real-Time

let currentCategoryKey = null;
let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

// Variabel Timer
let timerInterval = null;
let timeRemaining = 0; // dalam detik (default 90 menit = 5400 detik)
const QUIZ_DURATION_SECONDS = 90 * 60; // 90 Menit

const quizCard = document.getElementById("quiz-card");

// 1. Tampilan Menu Pemilihan Kategori
function showCategoryMenu() {
    stopTimer(); // Hentikan timer jika kembali ke menu utama

    if (typeof quizCategories === 'undefined') {
        quizCard.innerHTML = "<p style='text-align:center;'>Gagal memuat bank soal. Pastikan questions.js terhubung.</p>";
        return;
    }

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
                <p style="color: #5f6368; font-size: 0.9rem; line-height: 1.4; margin-bottom: 8px;">${cat.description}</p>
                <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; font-size: 0.78rem; font-weight: 600; padding: 4px 8px; border-radius: 4px;">⏱️ Waktu: 90 Menit</span>
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
    startTimer(QUIZ_DURATION_SECONDS); // Jalankan timer 90 menit
    loadQuiz();
}

// 3. Menyiapkan Elemen HTML Kuis (Termasuk Tampilan Timer)
function renderQuizStructure() {
    quizCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <span id="question-number" style="font-size: 0.85rem; font-weight: 600; color: #1a73e8;"></span>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span id="timer-display" style="font-size: 0.85rem; font-weight: 700; color: #d93025; background: #fce8e6; padding: 4px 10px; border-radius: 20px;">⏱️ 90:00</span>
                <button onclick="showCategoryMenu()" style="background: none; border: none; color: #666; cursor: pointer; font-size: 0.85rem;">← Ganti Kategori</button>
            </div>
        </div>
        <div id="question-text" style="font-size: 1.05rem; font-weight: 500; margin-bottom: 20px; line-height: 1.6; color: #202124; white-space: pre-line; text-align: left;"></div>
        <div id="options-container" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>
        <button id="next-btn" class="btn primary-btn" style="display: none;">Selanjutnya</button>
    `;

    document.getElementById("next-btn").addEventListener("click", handleNextQuestion);
}

// 4. Sistem Logika Timer
function startTimer(seconds) {
    stopTimer();
    timeRemaining = seconds;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();
            alert("⏰ Waktu ujian telah habis! Kuis Anda akan otomatis dikumpulkan.");
            showResults(true); // Auto-submit
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("timer-display");
    if (!timerElement) return;

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    let timeString = "";
    if (hours > 0) {
        timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    timerElement.innerText = `⏱️ ${timeString}`;

    // Ubah warna latar timer jika waktu tersisa < 5 menit
    if (timeRemaining < 300) {
        timerElement.style.backgroundColor = "#fce8e6";
        timerElement.style.color = "#d93025";
    } else {
        timerElement.style.backgroundColor = "#e8f0fe";
        timerElement.style.color = "#1a73e8";
    }
}

// 5. Memuat Soal
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
        stopTimer();
        showResults();
    }
}

// 6. Menandai Pilihan Jawaban
function selectOption(index) {
    userAnswers[currentQuestion] = index;
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
        btn.style.backgroundColor = idx === index ? "#e8f0fe" : "#fff";
        btn.style.borderColor = idx === index ? "#1a73e8" : "#dadce0";
    });
    document.getElementById("next-btn").style.display = "block";
}

// 7. Navigasi Soal Berikutnya
function handleNextQuestion() {
    if (userAnswers[currentQuestion] === currentQuizData[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    loadQuiz();
}

// 8. Menampilkan Skor & Pembahasan
function showResults(isTimeOut = false) {
    stopTimer();

    let resultHTML = `
        <h2 style="color: #202124;">Kuis ${quizCategories[currentCategoryKey].title} Selesai! 🎉</h2>
        ${isTimeOut ? '<p style="color: #d93025; font-weight: bold;">⚠️ Sesi berakhir karena waktu ujian telah habis.</p>' : ''}
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
