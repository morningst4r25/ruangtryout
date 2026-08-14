// app.js - Logika Kuis + Premium Landing UI & Real-Time Timer

let currentCategoryKey = null;
let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

let timerInterval = null;
let timeRemaining = 0;
const QUIZ_DURATION_SECONDS = 90 * 60; // 90 Menit

const quizCard = document.getElementById("quiz-card");

// 1. Tampilan Menu Pemilihan Kategori (Elegan & Modern UI)
function showCategoryMenu() {
    stopTimer();

    if (typeof quizCategories === 'undefined') {
        quizCard.innerHTML = "<p style='text-align:center;'>Gagal memuat bank soal. Pastikan questions.js terhubung.</p>";
        return;
    }

    let menuHTML = `
        <!-- Hero Header -->
        <div style="text-align: center; margin-bottom: 28px;">
            <span style="display: inline-block; background: #eff6ff; color: #2563eb; font-size: 0.8rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; margin-bottom: 12px; border: 1px solid #dbeafe;">
                ✨ Simulasi Ujian Standar CAT BKN & SNPMB
            </span>
            <h2 style="font-size: 1.65rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 10px;">
                Siapkan Karir & Pendidikan Masa Depanmu
            </h2>
            <p style="color: #64748b; font-size: 0.95rem; max-width: 580px; margin: 0 auto; line-height: 1.6;">
                Pilih program tryout interaktif berwaktu, uji kemampuanmu dengan soal-soal HOTS terbaru, dan dapatkan pembahasan instan secara gratis.
            </p>
        </div>

        <!-- Highlight Features Bar -->
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 32px; padding: 12px; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
            <span style="font-size: 0.85rem; font-weight: 600; color: #334155;">🎯 200 Soal HOTS</span>
            <span style="font-size: 0.85rem; font-weight: 600; color: #334155;">⏱️ Real-time Timer</span>
            <span style="font-size: 0.85rem; font-weight: 600; color: #334155;">💡 Kunci & Pembahasan</span>
        </div>

        <!-- Category Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
    `;

    for (const key in quizCategories) {
        const cat = quizCategories[key];
        const isCPNS = key === 'cpns';
        
        menuHTML += `
            <div onclick="selectCategory('${key}')" style="
                border: 2px solid #e2e8f0;
                border-radius: 14px;
                padding: 24px;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                background: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
            " onmouseover="this.style.borderColor='#2563eb'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px -6px rgba(37, 99, 235, 0.12)';" 
               onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                        <span style="font-size: 1.8rem; background: ${isCPNS ? '#eff6ff' : '#f0fdf4'}; padding: 10px; border-radius: 12px; display: inline-flex;">
                            ${isCPNS ? '🏛️' : '🎓'}
                        </span>
                        <span style="background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px;">
                            ${cat.questions.length} Soal
                        </span>
                    </div>

                    <h3 style="color: #0f172a; font-size: 1.15rem; font-weight: 700; margin-bottom: 8px;">${cat.title}</h3>
                    <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">${cat.description}</p>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px dashed #e2e8f0;">
                    <span style="color: #2563eb; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                        ⏱️ 90 Menit
                    </span>
                    <span style="color: #2563eb; font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                        Mulai Tryout →
                    </span>
                </div>
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
    startTimer(QUIZ_DURATION_SECONDS);
    loadQuiz();
}

// 3. Menyiapkan Elemen HTML Kuis
function renderQuizStructure() {
    quizCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
            <span id="question-number" style="font-size: 0.88rem; font-weight: 700; color: #2563eb;"></span>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span id="timer-display" style="font-size: 0.85rem; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 6px 14px; border-radius: 20px; border: 1px solid #dbeafe;">⏱️ 01:30:00</span>
                <button onclick="showCategoryMenu()" style="background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 600;">← Ganti Kategori</button>
            </div>
        </div>
        <div id="question-text" style="font-size: 1.08rem; font-weight: 600; margin-bottom: 24px; line-height: 1.6; color: #0f172a; white-space: pre-line; text-align: left;"></div>
        <div id="options-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;"></div>
        <button id="next-btn" class="btn primary-btn" style="display: none; width: 100%; padding: 14px;">Selanjutnya →</button>
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
            showResults(true);
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

    let timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerElement.innerText = `⏱️ ${timeString}`;

    if (timeRemaining < 300) {
        timerElement.style.backgroundColor = "#fef2f2";
        timerElement.style.borderColor = "#fecaca";
        timerElement.style.color = "#dc2626";
    } else {
        timerElement.style.backgroundColor = "#eff6ff";
        timerElement.style.borderColor = "#dbeafe";
        timerElement.style.color = "#2563eb";
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
        btn.style.backgroundColor = idx === index ? "#eff6ff" : "#ffffff";
        btn.style.borderColor = idx === index ? "#2563eb" : "#e2e8f0";
        btn.style.color = idx === index ? "#1e40af" : "#334155";
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
        <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Kuis ${quizCategories[currentCategoryKey].title} Selesai! 🎉</h2>
            ${isTimeOut ? '<p style="color: #dc2626; font-weight: 600; font-size: 0.9rem;">⚠️ Sesi berakhir karena waktu ujian telah habis.</p>' : ''}
            <div style="display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 12px; margin-top: 10px;">
                <span style="font-size: 0.9rem; color: #64748b;">Skor Anda:</span>
                <p style="font-size: 1.8rem; font-weight: 800; color: #2563eb;">${score} / ${currentQuizData.length} <span style="font-size: 1rem; color: #475569;">(${Math.round((score/currentQuizData.length)*100)}%)</span></p>
            </div>
        </div>
        <hr style="margin: 24px 0; border: 0; border-top: 1px solid #f1f5f9;">
        <h3 style="margin-bottom: 16px; text-align: left; color: #0f172a; font-size: 1.1rem;">Pembahasan Soal:</h3>
        <div style="text-align: left;">
    `;

    currentQuizData.forEach((data, i) => {
        const isCorrect = userAnswers[i] === data.answer;
        resultHTML += `
            <div style="margin-bottom: 18px; padding: 16px; background: ${isCorrect ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}; border-radius: 12px;">
                <p style="margin-bottom: 8px; color: #0f172a; white-space: pre-line;"><strong>${i + 1}. ${data.question}</strong></p>
                <p style="margin-bottom: 4px; font-size: 0.92rem; color: ${isCorrect ? '#166534' : '#991b1b'};">Jawaban Anda: <strong>${userAnswers[i] !== undefined ? data.options[userAnswers[i]] : 'Tidak dijawab'}</strong> ${isCorrect ? '✅' : '❌'}</p>
                <p style="margin-bottom: 8px; font-size: 0.92rem; color: #1e293b;">Kunci Jawaban: <strong>${data.options[data.answer]}</strong></p>
                <p style="font-size: 0.88rem; color: #475569; background: rgba(255,255,255,0.7); padding: 8px 12px; border-radius: 8px;"><em>💡 Pembahasan: ${data.explanation}</em></p>
            </div>
        `;
    });

    resultHTML += `
        </div>
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button onclick="selectCategory('${currentCategoryKey}')" class="btn primary-btn" style="flex: 1;">Ulangi Kuis Ini</button>
            <button onclick="showCategoryMenu()" class="btn" style="flex: 1; background: #f1f5f9; color: #334155;">Pilih Kategori Lain</button>
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
