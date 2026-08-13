if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker Registered'));
}

const quizData = [
  {
    question: "Kedudukan Pancasila sebagai dasar negara Indonesia secara yuridis formal tercantum dalam...",
    options: [
      "A. Batang Tubuh UUD 1945",
      "B. Ketetapan MPR No. II/MPR/1978",
      "C. Pembukaan UUD 1945 alinea IV",
      "D. Proklamasi Kemerdekaan 17 Agustus 1945"
    ],
    answer: 2
  },
  {
    question: "Jika a = 2b dan b = 3c, berapakah nilai dari (a + b) / c ?",
    options: ["A. 6", "B. 8", "C. 9", "D. 12"],
    answer: 2
  }
];

let currentIdx = 0;
let score = 0;
let selectedOption = null;

function loadQuestion() {
  const current = quizData[currentIdx];
  document.getElementById("question-number").innerText = `Soal ${currentIdx + 1} dari ${quizData.length}`;
  document.getElementById("question-text").innerText = current.question;
  
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  selectedOption = null;

  current.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => {
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedOption = idx;
    };
    optionsContainer.appendChild(btn);
  });
}

function nextQuestion() {
  if (selectedOption === null) {
    alert("Pilih salah satu jawaban terlebih dahulu!");
    return;
  }

  if (selectedOption === quizData[currentIdx].answer) {
    score += 50;
  }

  currentIdx++;

  if (currentIdx < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-text").innerText = `Skor Akhir Anda: ${score}`;
}

function restartQuiz() {
  currentIdx = 0;
  score = 0;
  document.getElementById("result-box").classList.add("hidden");
  document.getElementById("quiz-box").classList.remove("hidden");
  loadQuestion();
}

loadQuestion();
