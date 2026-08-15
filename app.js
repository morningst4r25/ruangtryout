// app.js - Engine Logika CAT BKN Full Screen Mode

let currentCategoryKey = null;
let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

let timerInterval = null;
let timeRemaining = 0;
const QUIZ_DURATION_SECONDS = 90 * 60; // 90 Menit

const quizCard = document.getElementById("quiz-card");

document.addEventListener

function initQuiz(categoryKey) {
    currentCategoryKey = categoryKey;
    currentQuizData = quizCategories[categoryKey].questions;
    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(currentQuizData.length).fill(undefined);

    renderQuizStructure();
    startTimer(QUIZ_DURATION_SECONDS);
    loadQuiz();
}

function renderQuizStructure() {
    const catTitle = quizCategories[currentCategoryKey].title;

    quizCard.innerHTML = `
        <!-- Top Bar CAT Header -->
        <div class="bg-blue-600 text-white px-6 py-3.5 flex justify-between items-center font-bold text-xs sm:text-sm border-b border-blue-500 shrink-0">
            <span id="question-header" class="text-sm sm:text-base">SOAL NO. 1</span>
            <div class="flex items-center gap-3">
                <span id="timer-display" class="bg-blue-900/90 border border-blue-400/40 px-3.5 py-1 rounded-lg font-mono text-xs sm:text-sm">⏱️ 01:30:00</span>
                <span class="hidden md:inline-block text-xs bg-blue-700/80 px-3 py-1 rounded-md font-semibold">${catTitle}</span>
            </div>
        </div>

        <!-- Full Width Layout 2 Kolom -->
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-slate-900 text-slate-100">
            
            <!-- Kolom Kiri: Teks Soal & Opsi Jawaban (Memakan 3/4 Layar) -->
            <div class="lg:col-span-3 flex flex-col justify-between space-y-6 bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
                <div>
                    <p id="question-text" class="text-base sm:text-lg font-semibold leading-relaxed text-slate-100 mb-8 white-space-pre-line text-left"></p>
                    <div id="options-container" class="space-y-3.5 text-left"></div>
                </div>

                <!-- Navigasi Bawah -->
                <div class="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-slate-800">
                    <button id="prev-btn" onclick="handlePrevQuestion()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition">
                        ← Sebelumnya
                    </button>
                    <button id="next-btn" onclick="handleNextQuestion()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition">
                        Simpan & Lanjutkan →
                    </button>
                </div>
            </div>

            <!-- Kolom Kanan: Grid Navigasi 100 Nomor Soal -->
            <div class="lg:col-span-1 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Navigasi Nomor Soal</h4>
                    <div id="question-grid" class="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2 max-h-[420px] overflow-y-auto pr-1"></div>
                </div>

                <button onclick="confirmSubmit()" class="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition border border-blue-400/30">
                    Selesaikan Ujian 🏁
                </button>
            </div>
        </div>
    `;
}

function loadQuiz() {
    if (currentQuestion >= 0 && currentQuestion < currentQuizData.length) {
        const data = currentQuizData[currentQuestion];
        
        document.getElementById("question-header").innerText = `SOAL NO. ${currentQuestion + 1} dari ${currentQuizData.length}`;
        document.getElementById("question-text").innerText = data.question;

        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        data.options.forEach((option, index) => {
            const isSelected = userAnswers[currentQuestion] === index;
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.style.cssText = `
                width: 100%; 
                text-align: left; 
                padding: 14px 18px; 
                background: ${isSelected ? 'rgba(59, 130, 246, 0.2)' : '#0f172a'}; 
                border: 1px solid ${isSelected ? '#3b82f6' : '#334155'}; 
                border-radius: 12px; 
                font-size: 0.95rem; 
                color: ${isSelected ? '#ffffff' : '#cbd5e1'}; 
                cursor: pointer; 
                transition: all 0.2s;
                font-weight: ${isSelected ? '700' : '500'};
            `;
            btn.innerText = `${String.fromCharCode(65 + index)}. ${option}`;
            btn.onclick = () => selectOption(index);
            optionsContainer.appendChild(btn);
        });

        const prevBtn = document.getElementById("prev-btn");
        if (currentQuestion === 0) {
            prevBtn.style.opacity = "0.5";
            prevBtn.style.cursor = "not-allowed";
        } else {
            prevBtn.style.opacity = "1";
            prevBtn.style.cursor = "pointer";
        }

        renderQuestionGrid();
    }
}

function renderQuestionGrid() {
    const gridContainer = document.getElementById("question-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    currentQuizData.forEach((_, i) => {
        const isAnswered = userAnswers[i] !== undefined;
        const isCurrent = i === currentQuestion;

        const btn = document.createElement("button");
        btn.onclick = () => jumpToQuestion(i);

        let bgStyle = isAnswered ? "bg-emerald-600 text-white border-emerald-500 font-bold" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800";
        let ringStyle = isCurrent ? "ring-2 ring-blue-500 border-blue-400 font-black scale-105" : "";

        btn.className = `h-9 rounded-lg text-xs border flex items-center justify-center transition-all ${bgStyle} ${ringStyle}`;
        btn.innerText = i + 1;

        gridContainer.appendChild(btn);
    });
}

function selectOption(index) {
    userAnswers[currentQuestion] = index;
    loadQuiz();
}

function jumpToQuestion(index) {
    currentQuestion = index;
    loadQuiz();
}

function handleNextQuestion() {
    if (currentQuestion < currentQuizData.length - 1) {
        currentQuestion++;
        loadQuiz();
    } else {
        confirmSubmit();
    }
}

function handlePrevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuiz();
    }
}

function confirmSubmit() {
    const answeredCount = userAnswers.filter(ans => ans !== undefined).length;
    const totalCount = currentQuizData.length;

    const isConfirmed = confirm(`Anda telah menjawab ${answeredCount} dari ${totalCount} soal.\n\nYakin ingin mengumpulkan ujian sekarang?`);
    if (isConfirmed) {
        stopTimer();
        calculateAndShowResults();
    }
}

function startTimer(seconds) {
    stopTimer();
    timeRemaining = seconds;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();
            alert("⏰ Waktu ujian telah habis! Kuis Anda otomatis dikumpulkan.");
            calculateAndShowResults(true);
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
}

// Tambahkan baris pemanggilan simpan ke Firebase di dalam fungsi calculateAndShowResults(isTimeOut = false)
function calculateAndShowResults(isTimeOut = false) {
    stopTimer();

    score = 0;
    currentQuizData.forEach((data, i) => {
        if (userAnswers[i] === data.answer) {
            score++;
        }
    });

    // Simpan Skor ke Cloud Firestore jika Peserta Login
    const currentUser = typeof auth !== 'undefined' ? auth.currentUser : null;
    const timeSpentSeconds = QUIZ_DURATION_SECONDS - timeRemaining;

    if (currentUser && typeof db !== 'undefined') {
        db.collection("leaderboard").add({
            userId: currentUser.uid,
            userName: currentUser.displayName || "Peserta Anonim",
            userPhoto: currentUser.photoURL || "",
            category: currentCategoryKey,
            score: score,
            totalQuestions: currentQuizData.length,
            percentage: Math.round((score / currentQuizData.length) * 100),
            timeSpentSeconds: timeSpentSeconds,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log("Skor berhasil terkirim ke Klasemen Global!");
        }).catch((err) => {
            console.error("Gagal mengirim skor:", err);
        });
    }

    let resultHTML = `
        <div class="p-6 sm:p-10 text-center space-y-6">
            <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Simulasi CAT Selesai! 🎉</h2>
                ${isTimeOut ? '<p class="text-xs text-red-400 font-semibold">⚠️ Waktu ujian telah habis.</p>' : ''}
                <div class="inline-block bg-slate-950 border border-slate-800 px-8 py-4 rounded-xl mt-4">
                    <span class="text-xs text-slate-400">Skor Akhir Anda:</span>
                    <p class="text-3xl sm:text-4xl font-black text-blue-400">${score} / ${currentQuizData.length} <span class="text-xs text-slate-400 font-normal">(${Math.round((score/currentQuizData.length)*100)}%)</span></p>
                </div>
            </div>

            <div class="flex justify-center">
                <a href="leaderboard.html" class="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition border border-blue-400/40 shadow-lg">
                    🏆 Lihat Posisi Anda di Papan Peringkat Global →
                </a>
            </div>

            <hr class="border-slate-800">

            <div class="text-left space-y-4">
                <h3 class="text-base font-bold text-white">Pembahasan Soal Lengkap:</h3>
                <div class="space-y-4 max-h-[480px] overflow-y-auto pr-2">
    `;

    currentQuizData.forEach((data, i) => {
        const isCorrect = userAnswers[i] === data.answer;
        resultHTML += `
            <div class="p-4 rounded-xl border ${isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'} space-y-2">
                <p class="text-sm font-semibold text-white white-space-pre-line">${i + 1}. ${data.question}</p>
                <p class="text-xs ${isCorrect ? 'text-emerald-400' : 'text-red-400'} font-medium">Jawaban Anda: <strong>${userAnswers[i] !== undefined ? data.options[userAnswers[i]] : 'Tidak dijawab / Dilewati'}</strong> ${isCorrect ? '✅' : '❌'}</p>
                <p class="text-xs text-slate-200">Kunci Jawaban: <strong>${data.options[data.answer]}</strong></p>
                <p class="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800/80"><em>💡 Pembahasan: ${data.explanation}</em></p>
            </div>
        `;
    });

    resultHTML += `
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <button onclick="window.location.reload()" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition">Ulangi Ujian Ini</button>
                <a href="index.html" class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs sm:text-sm text-center border border-slate-700 transition">Kembali ke Beranda</a>
            </div>
        </div>
    `;

    quizCard.innerHTML = resultHTML;
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration Failed!', err));
    });
}
// Tambahkan di baris paling bawah app.js
function showAuthLockScreen() {
    if (typeof timerInterval !== 'undefined' && timerInterval) {
        clearInterval(timerInterval);
    }

    const quizCard = document.getElementById("quiz-card") || document.querySelector("main");
    if (quizCard) {
        quizCard.innerHTML = `
            <div class="p-8 sm:p-12 text-center space-y-6 bg-slate-900 rounded-2xl border border-slate-800 my-8">
                <div class="w-16 h-16 bg-blue-900/40 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg">
                    🔒
                </div>
                <div class="space-y-2">
                    <h2 class="text-2xl sm:text-3xl font-black text-white">Login Diperlukan</h2>
                    <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        Untuk menjaga integritas papan peringkat dan mencatat hasil ujian secara akurat, Anda wajib masuk menggunakan Akun Google sebelum mengerjakan soal.
                    </p>
                </div>
                <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button onclick="loginWithGoogle()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                        🔑 Masuk / Login dengan Google
                    </button>
                    <a href="index.html" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-700 transition text-center">
                        🏠 Kembali ke Beranda
                    </a>
                </div>
            </div>
        `;
    }
}
