// app.js - Simulasi CAT BKN dengan Grid Navigasi Nomor Soal

let currentCategoryKey = null;
let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = []; // Menyimpan indeks jawaban pengguna per soal

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
                Pilih Program Simulasi CAT
            </h2>
            <p style="color: #94a3b8; font-size: 0.88rem;">
                Pilih kategori di bawah untuk memulai tryout interaktif 90 menit:
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

// 2. Memulai Kuis Kategori
function selectCategory(categoryKey) {
    currentCategoryKey = categoryKey;
    currentQuizData = quizCategories[categoryKey].questions;
    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(currentQuizData.length).fill(undefined);

    renderQuizStructure();
    startTimer(QUIZ_DURATION_SECONDS);
    loadQuiz();
}

// 3. Menyiapkan Layout CAT 2 Kolom (Left: Soal & Opsi | Right: Grid Navigasi)
function renderQuizStructure() {
    quizCard.innerHTML = `
        <!-- Top Header CAT -->
        <div class="bg-blue-600 text-white px-5 py-3.5 rounded-t-2xl flex justify-between items-center font-bold text-sm sm:text-base border-b border-blue-500">
            <span id="question-header">SOAL NO. 1</span>
            <div class="flex items-center gap-3">
                <span id="timer-display" class="bg-blue-800/90 border border-blue-400/40 px-3 py-1 rounded-lg font-mono text-xs sm:text-sm">⏱️ 01:30:00</span>
                <button onclick="showCategoryMenu()" class="text-xs bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded-lg transition border border-blue-500">← Keluar</button>
            </div>
        </div>

        <!-- Layout Body 2 Kolom -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 sm:p-6 bg-slate-900 text-slate-100 rounded-b-2xl border-x border-b border-slate-800">
            
            <!-- Kolom Kiri: Soal & Pilihan Jawaban -->
            <div class="md:col-span-2 flex flex-col justify-between space-y-6">
                <div>
                    <p id="question-text" class="text-sm sm:text-base font-semibold leading-relaxed text-slate-100 mb-6 white-space-pre-line text-left"></p>
                    <div id="options-container" class="space-y-3 text-left"></div>
                </div>

                <!-- Tombol Navigasi Bawah Soal -->
                <div class="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-800">
                    <button id="prev-btn" onclick="handlePrevQuestion()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition">
                        ← Sebelumnya
                    </button>
                    <button id="next-btn" onclick="handleNextQuestion()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition">
                        Simpan & Lanjutkan →
                    </button>
                </div>
            </div>

            <!-- Kolom Kanan: Grid Navigasi Nomor Soal -->
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Nomor Soal</h4>
                    <div id="question-grid" class="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1"></div>
                </div>

                <button onclick="confirmSubmit()" class="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition border border-blue-400/30">
                    Selesaikan Ujian 🏁
                </button>
            </div>
        </div>
    `;
}

// 4. Memuat Soal & Memperbarui Grid
function loadQuiz() {
    if (currentQuestion >= 0 && currentQuestion < currentQuizData.length) {
        const data = currentQuizData[currentQuestion];
        
        // Update Header Soal
        document.getElementById("question-header").innerText = `SOAL NO. ${currentQuestion + 1}`;
        document.getElementById("question-text").innerText = data.question;

        // Render Opsi Jawaban
        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        data.options.forEach((option, index) => {
            const isSelected = userAnswers[currentQuestion] === index;
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.style.cssText = `
                width: 100%; 
                text-align: left; 
                padding: 12px 16px; 
                background: ${isSelected ? 'rgba(59, 130, 246, 0.2)' : '#0f172a'}; 
                border: 1px solid ${isSelected ? '#3b82f6' : '#334155'}; 
                border-radius: 12px; 
                font-size: 0.88rem; 
                color: ${isSelected ? '#ffffff' : '#cbd5e1'}; 
                cursor: pointer; 
                transition: all 0.2s;
                font-weight: ${isSelected ? '700' : '500'};
            `;
            btn.innerText = `${String.fromCharCode(65 + index)}. ${option}`;
            btn.onclick = () => selectOption(index);
            optionsContainer.appendChild(btn);
        });

        // Update tombol navigasi sebelumnya
        const prevBtn = document.getElementById("prev-btn");
        if (currentQuestion === 0) {
            prevBtn.style.opacity = "0.5";
            prevBtn.style.cursor = "not-allowed";
        } else {
            prevBtn.style.opacity = "1";
            prevBtn.style.cursor = "pointer";
        }

        // Render ulang Grid Nomor Soal di kanan
        renderQuestionGrid();
    }
}

// 5. Render Grid Nomor Soal (Sisi Kanan)
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

// 6. Memilih Opsi Jawaban
function selectOption(index) {
    userAnswers[currentQuestion] = index;
    loadQuiz(); // Refresh UI opsi & grid kanan
}

// 7. Lompat Langsung ke Nomor Soal Tertentu
function jumpToQuestion(index) {
    currentQuestion = index;
    loadQuiz();
}

// 8. Navigasi Soal Selanjutnya & Sebelumnya
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

// 9. Konfirmasi Selesai Ujian
function confirmSubmit() {
    const answeredCount = userAnswers.filter(ans => ans !== undefined).length;
    const totalCount = currentQuizData.length;

    const isConfirmed = confirm(`Anda telah menjawab ${answeredCount} dari ${totalCount} soal.\n\nYakin ingin mengumpulkan dan menyelesaikannya sekarang?`);
    if (isConfirmed) {
        stopTimer();
        calculateAndShowResults();
    }
}

// 10. Sistem Logika Timer
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

// 11. Kalkulasi Skor & Hasil Pembahasan
function calculateAndShowResults(isTimeOut = false) {
    stopTimer();

    // Hitung Skor
    score = 0;
    currentQuizData.forEach((data, i) => {
        if (userAnswers[i] === data.answer) {
            score++;
        }
    });

    let resultHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-bottom: 6px;">Kuis ${quizCategories[currentCategoryKey].title} Selesai! 🎉</h2>
            ${isTimeOut ? '<p style="color: #f87171; font-weight: 600; font-size: 0.85rem;">⚠️ Sesi berakhir karena waktu ujian telah habis.</p>' : ''}
            <div style="display: inline-block; background: #0f172a; border: 1px solid #334155; padding: 12px 28px; border-radius: 14px; margin-top: 8px;">
                <span style="font-size: 0.85rem; color: #94a3b8;">Skor Akhir Anda:</span>
                <p style="font-size: 1.85rem; font-weight: 800; color: #60a5fa;">${score} / ${currentQuizData.length} <span style="font-size: 0.9rem; color: #cbd5e1;">(${Math.round((score/currentQuizData.length)*100)}%)</span></p>
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
                <p style="margin-bottom: 4px; font-size: 0.88rem; color: ${isCorrect ? '#34d399' : '#f87171'};">Jawaban Anda: <strong>${userAnswers[i] !== undefined ? data.options[userAnswers[i]] : 'Tidak dijawab / Dilewati'}</strong> ${isCorrect ? '✅' : '❌'}</p>
                <p style="margin-bottom: 6px; font-size: 0.88rem; color: #e2e8f0;">Kunci Jawaban: <strong>${data.options[data.answer]}</strong></p>
                <p style="font-size: 0.82rem; color: #94a3b8; background: #0f172a; padding: 8px 12px; border-radius: 8px; border: 1px solid #1e293b;"><em>💡 Pembahasan: ${data.explanation}</em></p>
            </div>
        `;
    });

    resultHTML += `
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="selectCategory('${currentCategoryKey}')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex-1 transition">Ulangi Kuis Ini</button>
            <button onclick="showCategoryMenu()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex-1 border border-slate-700 transition">Pilih Kategori Lain</button>
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
