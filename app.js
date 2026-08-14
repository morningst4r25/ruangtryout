// app.js - Logika Kuis Engine (Dark Mode Premium Integrated)

let currentCategoryKey = null;
let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

let timerInterval = null;
let timeRemaining = 0;
const QUIZ_DURATION_SECONDS = 90 * 60; // 90 Menit

const quizCard = document.getElementById("quiz-card");

// 1. Tampilan Menu Pemilihan Kategori Kuis
function showCategoryMenu() {
    stopTimer();

    if (typeof quizCategories === 'undefined') {
        quizCard.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Gagal memuat bank soal. Pastikan questions.js terhubung.</p>";
        return;
    }

    let menuHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 6px;">
                Pilih Program Kuis
            </h2>
            <p style="color: #94a3b8; font-size: 0.88rem;">
                Klik salah satu kategori di bawah untuk memulai simulasi ujian 90 menit:
            </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
    `;

    for (const key in quizCategories) {
        const cat = quizCategories[key];
        const isCPNS = key === 'cpns';
        
        const borderColor = isCPNS ? '#3b82f6' : '#10b981';
        const tagBg = isCPNS ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)';
        const tagColor = isCPNS ? '#60a5fa' : '#34d399';

        menuHTML += `
            <div onclick="selectCategory('${key}')" style="
                border: 1px solid #334155;
                border-radius: 16px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                background: #0f172a;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            " onmouseover="this.style.borderColor='${borderColor}'; this.style.transform='translateY(-2px)';" 
               onmouseout="this.style.borderColor='#334155'; this.style.transform='translateY(0)';">
                
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                        <span style="font-size: 1.5rem; background: ${tagBg}; padding: 8px; border-radius: 10px; display: inline-flex;">
                            ${isCPNS ? '🏛️' : '🎓'}
                        </span>
                        <span style="background: ${tagBg}; color: ${tagColor}; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px;">
                            ${cat.questions.length} Soal HOTS
                        </span>
                    </div>

                    <h3 style="color: #ffffff; font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">${cat.title}</h3>
                    <p style="color: #94a3b8; font-size: 0.82rem; line-height: 1.5; margin-bottom: 18px;">${cat.description}</p>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #1e293b;">
                    <span style="color: #64748b; font-size: 0.8rem; font-weight: 600;">
                        ⏱️ 90 Menit
                    </span>
                    <span style="color: ${tagColor}; font-size: 0.85rem; font-weight: 700;">
                        Mulai Ujian →
                    </span>
                </div>
            </div>
        `;
    }

    menuHTML += `</div>`;
    quizCard.innerHTML = menuHTML;
}

// 2. Memulai Kuis Berdasarkan Kategori
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 14px;">
            <span id="question-number" style="font-size: 0.85rem; font-weight: 700; color: #60a5fa;"></span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span id="timer-display" style="font-size: 0.82rem; font-weight: 700; color: #60a5fa; background: rgba(59, 130, 246, 0.15); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.3);">⏱️ 01:30:00</span>
                <button onclick="showCategoryMenu()" style="background: #1e293b; border: 1px solid #334155; color: #cbd5e1; padding: 5px 10px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">← Ganti Kategori</button>
            </div>
        </div>
        <div id="question-text" style="font-size: 1.05rem; font-weight: 600; margin-bottom: 20px; line-height: 1.6; color: #f8fafc; white-space: pre-line; text-align: left;"></div>
        <div id="options-container" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>
        <button id="next-btn" class="btn primary-btn" style="display: none; width: 100%; padding: 12px; font-weight: 700;">Selanjutnya →</button>
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
        timerElement.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        timerElement.style.borderColor = "rgba(239, 68, 68, 0.4)";
        timerElement.style.color = "#f87171";
    } else {
        timerElement.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
        timerElement.style.borderColor = "rgba(59, 130, 246, 0.3)";
        timerElement.style.color = "#60a5fa";
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
            btn.style.cssText = "width: 100%; text-align: left; padding: 14px 16px; background: #0f172a; border: 1px solid #334155; border-radius: 12px; font-size: 0.92rem; color: #cbd5e1; cursor: pointer; transition: all 0.2s;";
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
    const buttons = document.querySelectorAll("#options-container button");
    buttons.forEach((btn, idx) => {
        if (idx === index) {
            btn.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
            btn.style.borderColor = "#3b82f6";
            btn.style.color = "#ffffff";
        } else {
            btn.style.backgroundColor = "#0f172a";
            btn.style.borderColor = "#334155";
            btn.style.color = "#cbd5e1";
        }
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
            <h2 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-bottom: 6px;">Kuis ${quizCategories[currentCategoryKey].title} Selesai! 🎉</h2>
            ${isTimeOut ? '<p style="color: #f87171; font-weight: 600; font-size: 0.85rem;">⚠️ Sesi berakhir karena waktu ujian telah habis.</p>' : ''}
            <div style="display: inline-block; background: #0f172a; border: 1px solid #334155; padding: 10px 24px; border-radius: 12px; margin-top: 8px;">
                <span style="font-size: 0.85rem; color: #94a3b8;">Skor Akhir Anda:</span>
                <p style="font-size: 1.75rem; font-weight: 800; color: #60a5fa;">${score} / ${currentQuizData.length} <span style="font-size: 0.9rem; color: #cbd5e1;">(${Math.round((score/currentQuizData.length)*100)}%)</span></p>
            </div>
        </div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #1e293b;">
        <h3 style="margin-bottom: 14px; text-align: left; color: #ffffff; font-size: 1rem;">Pembahasan Soal:</h3>
        <div style="text-align: left;">
    `;

    currentQuizData.forEach((data, i) => {
        const isCorrect = userAnswers[i] === data.answer;
        resultHTML += `
            <div style="margin-bottom: 16px; padding: 14px; background: ${isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border: 1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; border-radius: 12px;">
                <p style="margin-bottom: 6px; color: #f8fafc; white-space: pre-line;"><strong>${i + 1}. ${data.question}</strong></p>
                <p style="margin-bottom: 4px; font-size: 0.88rem; color: ${isCorrect ? '#34d399' : '#f87171'};">Jawaban Anda: <strong>${userAnswers[i] !== undefined ? data.options[userAnswers[i]] : 'Tidak dijawab'}</strong> ${isCorrect ? '✅' : '❌'}</p>
                <p style="margin-bottom: 6px; font-size: 0.88rem; color: #e2e8f0;">Kunci Jawaban: <strong>${data.options[data.answer]}</strong></p>
                <p style="font-size: 0.82rem; color: #94a3b8; background: #0f172a; padding: 8px 12px; border-radius: 8px; border: 1px solid #1e293b;"><em>💡 Pembahasan: ${data.explanation}</em></p>
            </div>
        `;
    });

    resultHTML += `
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="selectCategory('${currentCategoryKey}')" class="btn primary-btn" style="flex: 1; padding: 10px;">Ulangi Kuis Ini</button>
            <button onclick="showCategoryMenu()" class="btn" style="flex: 1; background: #1e293b; color: #cbd5e1; padding: 10px; border: 1px solid #334155;">Pilih Kategori Lain</button>
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
