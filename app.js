// app.js - Logika Ujian CAT, Grid Navigasi Soal 1-100, & Firebase Integration

const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('cat') || 'cpns';

let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let timerInterval = null;
let timeRemaining = 90 * 60; // 90 menit

// Auth Guard: Cek Login saat DOM Siap
document.addEventListener("DOMContentLoaded", () => {
    if (typeof auth !== "undefined") {
        auth.onAuthStateChanged((user) => {
            if (user) {
                startQuizProcess();
            } else {
                showAuthLockScreen();
            }
        });
    } else {
        console.error("Firebase Auth belum terpasang di exam.html");
    }
});

// Layar Penguncian Login
function showAuthLockScreen() {
    if (timerInterval) clearInterval(timerInterval);
    const quizCard = document.getElementById("quiz-card");
    if (!quizCard) return;

    quizCard.innerHTML = `
        <div class="p-8 sm:p-12 text-center space-y-6 my-auto">
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

// Membaca Data Soal dari quizCategories
function startQuizProcess() {
    const catKey = selectedCategory.toLowerCase();

    if (typeof quizCategories !== "undefined" && quizCategories[catKey]) {
        currentQuestions = quizCategories[catKey].questions || [];
    } else if (typeof questionsData !== "undefined" && questionsData[catKey]) {
        currentQuestions = questionsData[catKey] || [];
    } else if (typeof questions !== "undefined") {
        currentQuestions = Array.isArray(questions) ? questions : (questions[catKey] || []);
    } else {
        currentQuestions = [];
    }

    if (!currentQuestions || currentQuestions.length === 0) {
        document.getElementById("quiz-card").innerHTML = `
            <div class="p-8 text-center text-slate-400 my-auto space-y-3">
                <p class="text-base font-semibold text-white">Soal untuk kategori "${selectedCategory.toUpperCase()}" tidak ditemukan.</p>
                <a href="index.html" class="inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl border border-slate-700 transition">🏠 Kembali ke Beranda</a>
            </div>
        `;
        return;
    }

    renderQuizLayout();
    startTimer();
    loadQuestion(currentIndex);
}

// Render Tata Letak Utama (Dengan Panel Grid Nomor Soal)
function renderQuizLayout() {
    const quizCard = document.getElementById("quiz-card");
    const categoryTitle = (typeof quizCategories !== "undefined" && quizCategories[selectedCategory.toLowerCase()]) 
        ? quizCategories[selectedCategory.toLowerCase()].title 
        : selectedCategory.toUpperCase();

    quizCard.innerHTML = `
        <!-- Top Info Header -->
        <div class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0">
            <div>
                <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">${categoryTitle}</span>
                <h2 id="question-number-title" class="text-lg font-bold text-white">Soal No. 1 dari ${currentQuestions.length}</h2>
            </div>
            <div class="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-right">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Sisa Waktu</span>
                <span id="timer-display" class="text-lg font-black text-emerald-400 font-mono">90:00</span>
            </div>
        </div>

        <!-- Main Workspace (Split View: Lembar Soal + Navigasi Grid) -->
        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <!-- Left Area: Pertanyaan & Pilihan Jawaban -->
            <div class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
                <div class="space-y-6">
                    <div id="question-text" class="text-sm sm:text-base text-slate-200 leading-relaxed font-medium"></div>
                    <div id="options-container" class="space-y-3"></div>
                </div>
            </div>

            <!-- Right Sidebar: Grid Nomor Soal -->
            <div class="w-full lg:w-80 bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0">
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Navigasi Nomor Soal</h3>
                        <span id="answered-count-badge" class="text-[11px] font-bold bg-blue-900/40 border border-blue-500/30 text-blue-400 px-2.5 py-0.5 rounded-full">0/100 Dijawab</span>
                    </div>

                    <!-- Petunjuk Warna -->
                    <div class="flex items-center gap-3 text-[10px] text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span> Dijawab</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 inline-block"></span> Belum</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-blue-600 ring-2 ring-blue-400 inline-block"></span> Aktif</span>
                    </div>

                    <!-- Container Tombol 1-100 -->
                    <div id="question-grid" class="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2 max-h-[320px] lg:max-h-[420px] overflow-y-auto pr-1"></div>
                </div>
            </div>
        </div>

        <!-- Bottom Actions Footer -->
        <div class="bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
            <button id="prev-btn" onclick="navigateQuestion(-1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition">
                ← Sebelumnya
            </button>
            <button onclick="submitExam()" class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
                🚩 Selesaikan Ujian
            </button>
            <button id="next-btn" onclick="navigateQuestion(1)" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition">
                Berikutnya →
            </button>
        </div>
    `;
}

// Memuat Soal & Memperbarui Grid Nomor
function loadQuestion(index) {
    currentIndex = index;
    const q = currentQuestions[currentIndex];

    document.getElementById("question-number-title").innerText = `Soal No. ${currentIndex + 1} dari ${currentQuestions.length}`;
    document.getElementById("question-text").innerText = q.question;

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    q.options.forEach((opt, optIdx) => {
        const isSelected = userAnswers[currentIndex] === optIdx;
        const btn = document.createElement("button");
        btn.className = `w-full text-left p-4 rounded-xl border transition text-xs sm:text-sm flex items-start gap-3 ${
            isSelected 
            ? "bg-blue-600/20 border-blue-500 text-white font-semibold" 
            : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
        }`;
        btn.onclick = () => selectOption(optIdx);
        btn.innerHTML = `
            <span class="w-6 h-6 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'} flex items-center justify-center text-xs font-bold shrink-0">
                ${String.fromCharCode(65 + optIdx)}
            </span>
            <span>${opt}</span>
        `;
        optionsContainer.appendChild(btn);
    });

    // Control Tombol Sebelumnya / Berikutnya
    document.getElementById("prev-btn").disabled = currentIndex === 0;
    document.getElementById("prev-btn").style.opacity = currentIndex === 0 ? "0.5" : "1";
    
    document.getElementById("next-btn").disabled = currentIndex === currentQuestions.length - 1;
    document.getElementById("next-btn").style.opacity = currentIndex === currentQuestions.length - 1 ? "0.5" : "1";

    // Update Grid Nomor Soal
    renderQuestionGrid();
}

// Render Ulang Tombol Navigasi Nomor Soal 1-100
function renderQuestionGrid() {
    const gridContainer = document.getElementById("question-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";
    let answeredCount = 0;

    currentQuestions.forEach((_, i) => {
        const isAnswered = userAnswers[i] !== undefined;
        if (isAnswered) answeredCount++;

        const isCurrent = i === currentIndex;
        const btn = document.createElement("button");
        
        let styleClass = "h-9 w-full rounded-lg text-xs font-bold transition flex items-center justify-center border ";
        
        if (isCurrent) {
            styleClass += "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400 shadow-md font-black ";
        } else if (isAnswered) {
            styleClass += "bg-emerald-600/90 text-white border-emerald-500 hover:bg-emerald-500 ";
        } else {
            styleClass += "bg-slate-800/80 text-slate-400 border-slate-700/80 hover:bg-slate-700 hover:text-slate-200 ";
        }

        btn.className = styleClass;
        btn.innerText = i + 1;
        btn.onclick = () => loadQuestion(i);
        gridContainer.appendChild(btn);
    });

    // Update Counter Jumlah Soal Terjawab
    const badge = document.getElementById("answered-count-badge");
    if (badge) {
        badge.innerText = `${answeredCount}/${currentQuestions.length} Dijawab`;
    }
}

function selectOption(optIdx) {
    userAnswers[currentIndex] = optIdx;
    loadQuestion(currentIndex);
}

function navigateQuestion(step) {
    const newIdx = currentIndex + step;
    if (newIdx >= 0 && newIdx < currentQuestions.length) {
        loadQuestion(newIdx);
    }
}

// Timer Ujian
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        const timerDisplay = document.getElementById("timer-display");
        if (timerDisplay) {
            timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

// Simpan Hasil Ujian ke Firestore
function submitExam() {
    if (!confirm("Apakah Anda yakin ingin menyelesaikan ujian ini?")) return;
    if (timerInterval) clearInterval(timerInterval);

    let score = 0;
    currentQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === q.answer) {
            score += Math.round(100 / currentQuestions.length);
        }
    });

    const currentUser = auth.currentUser;
    if (currentUser) {
        db.collection("leaderboard").add({
            name: currentUser.displayName || "Peserta Anonim",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
            score: score,
            category: selectedCategory.toUpperCase(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            showResultScreen(score);
        }).catch((err) => {
            console.error("Gagal menyimpan skor:", err);
            showResultScreen(score);
        });
    } else {
        showResultScreen(score);
    }
}

// Layar Skor Akhir Ujian
function showResultScreen(score) {
    const quizCard = document.getElementById("quiz-card");
    quizCard.innerHTML = `
        <div class="p-8 sm:p-12 text-center space-y-6 my-auto">
            <div class="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-4xl mx-auto">
                🏆
            </div>
            <div class="space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-white">Ujian Selesai!</h2>
                <p class="text-xs sm:text-sm text-slate-400">Skor Anda telah tersimpan otomatis ke papan peringkat global.</p>
            </div>
            <div class="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl max-w-xs mx-auto">
                <span class="text-xs text-slate-400 uppercase font-bold block mb-1">Total Nilai</span>
                <span class="text-5xl font-black text-emerald-400">${score}</span>
            </div>
            <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a href="leaderboard.html" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition">
                    🏆 Lihat Papan Peringkat Global
                </a>
                <a href="index.html" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-700 transition">
                    🏠 Kembali ke Beranda
                </a>
            </div>
        </div>
    `;
}
