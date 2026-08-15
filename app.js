// app.js - Logika Ujian CAT, Reading quizCategories, & Proteksi Auth Ruang Tryout

// 1. Ambil parameter kategori dari URL (?cat=cpns atau ?cat=utbk)
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('cat') || 'cpns';

let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let timerInterval = null;
let timeRemaining = 90 * 60; // 90 menit (dalam detik)

// 2. Auth Guard: Cek status Login Firebase saat halaman exam.html selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    if (typeof auth !== "undefined") {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Jika user sudah login, jalankan proses kuis
                startQuizProcess();
            } else {
                // Jika belum login, tampilkan penguncian
                showAuthLockScreen();
            }
        });
    } else {
        console.error("Firebase Auth belum terpasang di exam.html");
    }
});

// 3. Tampilan Kunci Jika User Belum Login
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

// 4. MEMBACA STRUKTUR quizCategories DAN MEMULAI UJIAN
function startQuizProcess() {
    const catKey = selectedCategory.toLowerCase();

    // FOKUS UTAMA: Membaca quizCategories[catKey].questions dari questions.js
    if (typeof quizCategories !== "undefined" && quizCategories[catKey]) {
        currentQuestions = quizCategories[catKey].questions || [];
    } else if (typeof questionsData !== "undefined" && questionsData[catKey]) {
        currentQuestions = questionsData[catKey] || [];
    } else if (typeof questions !== "undefined") {
        currentQuestions = Array.isArray(questions) ? questions : (questions[catKey] || []);
    } else {
        currentQuestions = [];
    }

    // Jika soal tidak ditemukan
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

// 5. Render Antarmuka Lembar Ujian
function renderQuizLayout() {
    const quizCard = document.getElementById("quiz-card");
    const categoryTitle = (typeof quizCategories !== "undefined" && quizCategories[selectedCategory.toLowerCase()]) 
        ? quizCategories[selectedCategory.toLowerCase()].title 
        : selectedCategory.toUpperCase();

    quizCard.innerHTML = `
        <div class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div>
                <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">${categoryTitle}</span>
                <h2 id="question-number-title" class="text-lg font-bold text-white">Soal No. 1</h2>
            </div>
            <div class="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-right">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Sisa Waktu</span>
                <span id="timer-display" class="text-lg font-black text-emerald-400 font-mono">90:00</span>
            </div>
        </div>

        <div class="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
            <div id="question-text" class="text-sm sm:text-base text-slate-200 leading-relaxed font-medium"></div>
            <div id="options-container" class="space-y-3"></div>
        </div>

        <div class="bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between items-center">
            <button id="prev-btn" onclick="navigateQuestion(-1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition">
                ← Sebelumnya
            </button>
            <button onclick="submitExam()" class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition">
                🏁 Selesaikan Ujian
            </button>
            <button id="next-btn" onclick="navigateQuestion(1)" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition">
                Berikutnya →
            </button>
        </div>
    `;
}

// 6. Tampilkan Soal Berdasarkan Indeks Aktif
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

    document.getElementById("prev-btn").disabled = currentIndex === 0;
    document.getElementById("prev-btn").style.opacity = currentIndex === 0 ? "0.5" : "1";
    
    document.getElementById("next-btn").disabled = currentIndex === currentQuestions.length - 1;
    document.getElementById("next-btn").style.opacity = currentIndex === currentQuestions.length - 1 ? "0.5" : "1";
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

// 7. Penghitung Waktu Mundur Ujian
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

// 8. Selesaikan Ujian & Simpan Skor ke Firestore Leaderboard
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
            console.error("Gagal menyimpan skor ke Firestore:", err);
            showResultScreen(score);
        });
    } else {
        showResultScreen(score);
    }
}

// 9. Tampilan Ringkasan Hasil Nilai Ujian
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
