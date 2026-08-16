// RuangTryout exam application
// Public/no-login simulation with resume, subtests, daily challenge, review, progress history, and optional leaderboard.

const params = new URLSearchParams(location.search);
const selectedCategory = ['cpns','utbk'].includes((params.get('cat') || '').toLowerCase()) ? (params.get('cat') || '').toLowerCase() : 'cpns';
const requestedMode = (params.get('mode') || 'full').toLowerCase();

const HISTORY_KEY = 'ruangtryout_history_v1';
const DATASET_VERSION = '2026-08-16-v2';
const MODE_META = {
  full: {label:'Simulasi Lengkap', short:'Lengkap'},
  mini: {label:'Mini Tryout', short:'Mini'},
  daily: {label:'Daily Challenge', short:'Harian'},
  twk: {label:'Latihan TWK', short:'TWK'}, tiu: {label:'Latihan TIU', short:'TIU'}, tkp: {label:'Latihan TKP', short:'TKP'},
  penalaran: {label:'Penalaran & Kuantitatif', short:'Penalaran'}, literasi: {label:'Latihan Literasi', short:'Literasi'},
  retry: {label:'Perbaikan Soal Salah', short:'Perbaikan'}
};

let activeMode = requestedMode;
let baseQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let markedQuestions = new Set();
let timerInterval = null;
let timeRemaining = 0;
let examDurationSeconds = 0;
let quizStarted = false;
let isExamFinished = false;
let attemptId = '';
let pendingExamResult = null;
let lastResult = null;
let customRetrySession = false;

const quizCard = () => document.getElementById('quiz-card');
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
const clamp = (n,min,max) => Math.min(Math.max(n,min),max);
const setText = (id,val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
const pad = n => String(n).padStart(2,'0');
const nowId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
const dateSeed = () => { const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };

function hashString(str) {
  let h=2166136261 >>> 0;
  for (let i=0;i<str.length;i++) { h ^= str.charCodeAt(i); h = Math.imul(h,16777619); }
  return h >>> 0;
}
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t=Math.imul(a ^ a>>>15,1|a); t=t+Math.imul(t ^ t>>>7,61|t)^t; return ((t ^ t>>>14)>>>0)/4294967296; }; }
function shuffledIndices(length, seed) {
  const arr=Array.from({length},(_,i)=>i), rnd=mulberry32(hashString(seed));
  for(let i=arr.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr;
}

function getCategoryDisplayName() { return selectedCategory === 'cpns' ? 'CPNS & PPPK' : 'UTBK / SNBT'; }
function getModeLabel(mode=activeMode) { return MODE_META[mode]?.label || 'Latihan'; }
function getStorageKey(mode=activeMode) { return `ruangtryout_exam_${selectedCategory}_${mode}_v2`; }
function getLegacyStorageKey() { return `ruangtryout_exam_${selectedCategory}_guest`; }

function readJSON(key,fallback=null){ try{const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback;}catch{return fallback;} }
function writeJSON(key,val){ try{localStorage.setItem(key,JSON.stringify(val)); return true;}catch{return false;} }

function loadBaseQuestions() {
  if (typeof quizCategories !== 'undefined' && quizCategories[selectedCategory]?.questions) return quizCategories[selectedCategory].questions;
  if (typeof questionsData !== 'undefined' && questionsData[selectedCategory]) return questionsData[selectedCategory];
  if (typeof questions !== 'undefined') return Array.isArray(questions) ? questions : (questions[selectedCategory] || []);
  return [];
}

function validMode(cat, mode) {
  const allowed = cat === 'cpns' ? ['full','mini','daily','twk','tiu','tkp'] : ['full','mini','daily','penalaran','literasi'];
  return allowed.includes(mode) ? mode : 'full';
}

function selectSourceIndices(mode, total, seed) {
  if (selectedCategory === 'cpns') {
    if (mode === 'twk') return Array.from({length:Math.min(30,total)},(_,i)=>i);
    if (mode === 'tiu') return Array.from({length:Math.max(0,Math.min(65,total)-30)},(_,i)=>i+30);
    if (mode === 'tkp') return Array.from({length:Math.max(0,total-65)},(_,i)=>i+65);
  } else {
    if (mode === 'penalaran') return Array.from({length:Math.min(40,total)},(_,i)=>i);
    if (mode === 'literasi') return Array.from({length:Math.max(0,total-40)},(_,i)=>i+40);
  }
  if (mode === 'mini' || mode === 'daily') return shuffledIndices(total, seed).slice(0,Math.min(10,total));
  return Array.from({length:total},(_,i)=>i);
}

function prepareQuestions(mode, seed) {
  const source = selectSourceIndices(mode, baseQuestions.length, seed);
  return source.map(sourceIndex => {
    const q = baseQuestions[sourceIndex];
    const order = shuffledIndices(q.options.length, `${seed}|option|${sourceIndex}`);
    const options = order.map(i => q.options[i]);
    const answer = order.indexOf(Number(q.answer));
    return { question:q.question, options, answer, explanation:q.explanation || 'Pembahasan belum tersedia.', sourceIndex };
  });
}

function durationFor(mode, count) {
  if (mode === 'full') return 90*60;
  if (mode === 'mini' || mode === 'daily') return 10*60;
  if (mode === 'retry') return Math.max(5*60, count*75);
  return Math.max(15*60, count*60);
}

function questionSection(q) {
  const i=q.sourceIndex;
  if (selectedCategory==='cpns') return i<30?'TWK':i<65?'TIU':'TKP';
  return i<40?'Penalaran & Kuantitatif':'Literasi';
}

function loadSavedProgress() { return readJSON(getStorageKey(), null); }
function meaningful(saved){ return saved && (Object.keys(saved.userAnswers||{}).length>0 || Number(saved.currentIndex)>0 || (saved.markedQuestions||[]).length>0 || Number(saved.timeRemaining)<Number(saved.durationSeconds||examDurationSeconds)-5); }

function showSystemError(message) {
  const el=quizCard(); if(!el) return;
  el.innerHTML=`<div class="flex-1 flex items-center justify-center p-8 text-center"><div><div class="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-2xl">!</div><h2 class="mt-5 text-lg font-black text-white">Terjadi kendala</h2><p class="mt-2 max-w-md text-sm text-slate-400">${escapeHtml(message)}</p><a href="index.html" class="inline-flex mt-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700">Kembali ke Beranda</a></div></div>`;
}

function startQuizProcess() {
  quizStarted=true;
  activeMode=validMode(selectedCategory,requestedMode);
  baseQuestions=loadBaseQuestions();
  if(!baseQuestions.length) return showSystemError(`Soal ${getCategoryDisplayName()} tidak ditemukan.`);
  const saved=loadSavedProgress();
  attemptId = saved?.attemptId || nowId();
  const seed = activeMode==='daily' ? `daily-${selectedCategory}-${dateSeed()}` : attemptId;
  currentQuestions=prepareQuestions(activeMode,seed);
  examDurationSeconds=durationFor(activeMode,currentQuestions.length);
  timeRemaining=examDurationSeconds;
  const canResume = saved && saved.category===selectedCategory && (saved.mode||'full')===activeMode && Number(saved.questionsLength)===currentQuestions.length && Number(saved.timeRemaining)>0 && Number(saved.timeRemaining)<=Number(saved.durationSeconds||examDurationSeconds) && saved.datasetVersion===DATASET_VERSION && meaningful(saved);
  if(canResume) showResumeScreen(saved); else startFreshQuiz(false);
}

function showResumeScreen(saved) {
  const answered=Object.keys(saved.userAnswers||{}).length; const m=Math.floor(saved.timeRemaining/60), s=saved.timeRemaining%60;
  quizCard().innerHTML=`<div class="flex-1 flex items-center justify-center p-6"><div class="w-full max-w-xl bg-slate-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center"><div class="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">↻</div><h2 class="mt-5 text-2xl font-black text-white">Ujian Belum Selesai</h2><p class="mt-2 text-sm text-slate-400">${escapeHtml(getCategoryDisplayName())} • ${escapeHtml(getModeLabel())}</p><div class="mt-6 grid grid-cols-3 gap-3">${resumeStat('Terjawab',answered)}${resumeStat('Soal',Number(saved.currentIndex)+1)}${resumeStat('Waktu',`${pad(m)}:${pad(s)}`,'text-amber-400 font-mono')}</div><div class="mt-7 flex flex-col sm:flex-row justify-center gap-3"><button onclick="resumeSavedQuiz()" class="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl">Lanjutkan Ujian</button><button onclick="startFreshQuiz(true)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-700">Mulai Ulang</button></div></div></div>`;
}
function resumeStat(label,value,extra='text-white'){ return `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-4"><span class="text-[9px] uppercase font-black tracking-wider text-slate-500">${label}</span><strong class="block mt-1 text-xl ${extra}">${escapeHtml(value)}</strong></div>`; }

function resumeSavedQuiz(){
  const saved=loadSavedProgress(); if(!saved) return startFreshQuiz(false);
  attemptId=saved.attemptId||attemptId; currentIndex=clamp(Number(saved.currentIndex)||0,0,currentQuestions.length-1); userAnswers=saved.userAnswers||{}; markedQuestions=new Set((saved.markedQuestions||[]).map(Number)); timeRemaining=clamp(Number(saved.timeRemaining)||examDurationSeconds,1,examDurationSeconds); isExamFinished=false; renderQuizLayout(); loadQuestion(currentIndex); startTimer();
}
function startFreshQuiz(forceNew=true){
  clearSavedProgress(); if(forceNew && activeMode!=='daily') attemptId=nowId();
  if(forceNew){const seed=activeMode==='daily'?`daily-${selectedCategory}-${dateSeed()}`:attemptId; currentQuestions=prepareQuestions(activeMode,seed);}
  currentIndex=0; userAnswers={}; markedQuestions=new Set(); examDurationSeconds=durationFor(activeMode,currentQuestions.length); timeRemaining=examDurationSeconds; isExamFinished=false; pendingExamResult=null; lastResult=null; renderQuizLayout(); loadQuestion(0); startTimer();
}

function renderQuizLayout(){
  const total=currentQuestions.length;
  quizCard().innerHTML=`
  <div class="bg-slate-900 border-b border-slate-800 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-4 shrink-0">
    <div class="min-w-0"><div class="flex items-center flex-wrap gap-2 mb-0.5"><span class="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-[.14em]">${escapeHtml(getCategoryDisplayName())}</span><span class="inline-flex px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[8px] font-black text-slate-400 uppercase">${escapeHtml(getModeLabel())}</span><span id="question-section-label" class="inline-flex px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[8px] font-black text-slate-400 uppercase"></span></div><div class="flex items-baseline gap-2"><h2 id="question-number-title" class="text-sm sm:text-base font-black text-white">Soal 01</h2><span class="text-[10px] text-slate-500 font-semibold">dari ${total}</span></div></div>
    <div id="timer-card" class="min-w-[96px] bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-right"><span class="text-[7px] text-slate-500 block uppercase tracking-wider font-black">Sisa Waktu</span><span id="timer-display" class="text-sm sm:text-base font-black text-emerald-400 font-mono tabular-nums"></span></div>
  </div>
  <div class="relative flex-1 min-h-0 flex overflow-hidden">
    <section id="question-panel" class="flex-1 min-w-0 overflow-hidden"><div id="question-content" class="exam-question-content h-full w-full px-5 sm:px-6 lg:px-6 xl:px-7 py-3 flex flex-col">
      <div class="exam-question-block mb-3 shrink-0"><p class="text-[8px] uppercase tracking-[.18em] font-black text-slate-500 mb-1.5">Pertanyaan</p><div id="question-text" class="exam-question-text text-[13px] sm:text-sm xl:text-[15px] text-slate-100 leading-6 font-semibold"></div></div>
      <div id="options-container" class="exam-options space-y-2.5 shrink-0"></div>
      <div class="exam-actions mt-4 pt-3 border-t border-slate-800/80 shrink-0">
        <div class="grid grid-cols-3 gap-2.5"><button id="prev-btn" onclick="navigateQuestion(-1)" class="exam-nav bg-slate-800 text-slate-300 border border-slate-700">← <span class="hidden sm:inline">Sebelumnya</span></button><button onclick="requestSubmitExam()" class="exam-nav bg-red-500/10 text-red-400 border border-red-500/30">Selesaikan</button><button id="next-btn" onclick="navigateQuestion(1)" class="exam-nav bg-blue-600 text-white border border-blue-500"><span class="hidden sm:inline">Selanjutnya</span> →</button></div>
        <div class="mt-2.5 flex items-center justify-between gap-3"><button id="mark-question-btn" onclick="toggleMarkCurrent()" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700 text-[10px] font-bold text-slate-300"><span>⚑</span><span id="mark-question-label">Tandai untuk ditinjau</span></button><div class="hidden xl:flex gap-1.5 text-[8px] text-slate-600"><span>A–D jawab</span><span>•</span><span>← → pindah</span><span>•</span><span>M tandai</span></div></div>
      </div>
      <div class="lg:hidden mt-auto pt-2 shrink-0"><div class="bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-3"><div class="flex-1"><div class="flex justify-between"><p id="mobile-progress-text" class="text-[9px] font-bold text-slate-300"></p><span class="text-[8px] text-slate-600">Progres</span></div><div class="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden"><div id="mobile-progress-bar" class="h-full bg-blue-500" style="width:0%"></div></div></div><button onclick="openQuestionDrawer()" class="bg-blue-600 text-white text-[9px] font-black px-3 py-2 rounded-lg">Nomor Soal</button></div></div>
    </div></section>
    <button id="question-drawer-overlay" onclick="closeQuestionDrawer()" class="hidden lg:hidden fixed inset-0 z-40 bg-black/60"></button>
    <aside id="question-sidebar" class="fixed lg:static top-0 right-0 z-50 lg:z-auto h-full lg:h-auto w-[94vw] max-w-lg lg:w-[430px] xl:w-[500px] 2xl:w-[540px] translate-x-full lg:translate-x-0 transition-transform duration-300 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
      <div class="lg:hidden h-12 px-4 flex items-center justify-between border-b border-slate-800"><div><p class="text-[11px] font-black text-white">Daftar Soal</p><p class="text-[8px] text-slate-500">Pilih nomor soal</p></div><button onclick="closeQuestionDrawer()" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">✕</button></div>
      <div class="flex-1 min-h-0 px-4 xl:px-5 py-3 flex flex-col overflow-hidden"><div class="shrink-0"><div class="flex items-center justify-between"><div class="flex items-baseline gap-2"><span class="text-[9px] uppercase tracking-[.15em] font-black text-slate-500">Progres</span><strong id="answered-count-number" class="text-xl xl:text-2xl font-black text-white">0</strong><span class="text-[10px] text-slate-500">/ ${total}</span></div><span id="progress-percent" class="text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1.5">0%</span></div><div class="mt-2.5 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div id="progress-bar" class="h-full bg-gradient-to-r from-blue-600 to-cyan-400" style="width:0%"></div></div><div class="mt-3 grid grid-cols-2 gap-2"><div class="sidebar-stat"><span>Belum dijawab</span><strong id="unanswered-count">${total}</strong></div><div class="sidebar-stat"><span>Ditandai</span><strong id="marked-count" class="text-amber-400">0</strong></div></div><div class="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-500"><span>🟩 Dijawab</span><span>⬛ Belum</span><span>🟦 Aktif</span><span>🟨 Ditandai</span></div></div><div id="question-grid" class="mt-3 grid grid-cols-10 gap-1.5 content-start shrink-0"></div><button onclick="requestSubmitExam()" class="mt-3 w-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] xl:text-xs font-black px-3 py-2.5 rounded-xl">⚑ Selesaikan Ujian</button></div>
    </aside>
  </div>
  <div id="exam-confirm-modal" class="hidden fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-4 items-center justify-center"><div class="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"><div class="p-6 sm:p-7"><div id="confirm-modal-icon" class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-red-500/10 border border-red-500/20 text-red-400">⚑</div><h3 id="confirm-modal-title" class="text-xl font-black text-white"></h3><p id="confirm-modal-description" class="mt-2 text-sm text-slate-400 leading-6"></p><div id="confirm-modal-summary" class="hidden mt-5 rounded-2xl bg-slate-950/60 border border-slate-800 p-4"></div></div><div class="px-6 sm:px-7 py-4 border-t border-slate-800 bg-slate-950/30 flex flex-col-reverse sm:flex-row justify-end gap-2.5"><button onclick="closeConfirmModal()" class="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">Batal</button><button id="confirm-modal-action" class="px-5 py-2.5 rounded-xl text-xs font-black"></button></div></div></div>`;
  injectExamStyles(); updateTimerDisplay();
}

function injectExamStyles(){ if(document.getElementById('rt-exam-runtime-style'))return; const s=document.createElement('style'); s.id='rt-exam-runtime-style'; s.textContent=`.exam-nav{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.65rem .5rem;border-radius:.75rem;font-size:.68rem;font-weight:800;transition:.2s}.exam-nav:disabled{opacity:.3;cursor:not-allowed}.sidebar-stat{border:1px solid #1e293b;background:#0f172a;border-radius:.75rem;padding:.5rem .75rem;display:flex;align-items:center;justify-content:space-between;gap:.5rem}.sidebar-stat span{font-size:.6rem;color:#64748b;font-weight:700}.sidebar-stat strong{font-size:.875rem;color:#e2e8f0}.review-scroll{scrollbar-width:thin;scrollbar-color:#334155 #020617}.summary-label{display:block;font-size:.5rem;text-transform:uppercase;letter-spacing:.1em;font-weight:900;color:#64748b}.summary-value{display:block;margin-top:.25rem;font-size:1.2rem;font-weight:900;color:#e2e8f0}`; document.head.appendChild(s); }

function loadQuestion(index){
  if(!currentQuestions.length)return; currentIndex=clamp(index,0,currentQuestions.length-1); const q=currentQuestions[currentIndex];
  setText('question-number-title',`Soal ${pad(currentIndex+1)}`); setText('question-section-label',questionSection(q)); const qt=document.getElementById('question-text'); if(qt) qt.textContent=q.question;
  const c=document.getElementById('options-container'); if(!c)return; c.innerHTML='';
  q.options.forEach((option,i)=>{const selected=Number(userAnswers[currentIndex])===i; const b=document.createElement('button'); b.type='button'; b.className=`exam-option group w-full text-left px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl border transition-all text-[11px] sm:text-xs lg:text-[13px] flex items-start gap-2.5 ${selected?'bg-blue-500/10 border-blue-500 text-white ring-1 ring-blue-500/20':'bg-slate-800/55 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-blue-500/50 hover:text-white'}`; const letter=document.createElement('span'); letter.className=`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${selected?'bg-blue-600 text-white':'bg-slate-700 text-slate-300'}`; letter.textContent=String.fromCharCode(65+i); const text=document.createElement('span'); text.className='flex-1 leading-5 sm:leading-6 pt-0.5'; text.textContent=option; b.append(letter,text); if(selected){const check=document.createElement('span'); check.className='text-blue-300 font-black'; check.textContent='✓'; b.appendChild(check);} b.onclick=()=>selectOption(i); c.appendChild(b);});
  const prev=document.getElementById('prev-btn'), next=document.getElementById('next-btn'); if(prev)prev.disabled=currentIndex===0; if(next)next.disabled=currentIndex===currentQuestions.length-1; updateMarkButton(); renderQuestionGrid(); persistProgress(); fitQuestionToViewport();
}
function selectOption(i){userAnswers[currentIndex]=i; loadQuestion(currentIndex);}
function navigateQuestion(delta){const n=currentIndex+delta;if(n>=0&&n<currentQuestions.length)loadQuestion(n);}
function toggleMarkCurrent(){markedQuestions.has(currentIndex)?markedQuestions.delete(currentIndex):markedQuestions.add(currentIndex);updateMarkButton();renderQuestionGrid();persistProgress();}
function updateMarkButton(){const b=document.getElementById('mark-question-btn'),l=document.getElementById('mark-question-label');if(!b||!l)return;const m=markedQuestions.has(currentIndex);b.className=`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold ${m?'bg-amber-500/10 border-amber-500/30 text-amber-300':'bg-slate-800/70 border-slate-700 text-slate-300'}`;l.textContent=m?'Ditandai untuk ditinjau':'Tandai untuk ditinjau';}
function renderQuestionGrid(){
  const grid=document.getElementById('question-grid'); if(!grid)return; grid.innerHTML=''; let answered=0;
  currentQuestions.forEach((_,i)=>{const a=userAnswers[i]!==undefined,m=markedQuestions.has(i),cur=i===currentIndex;if(a)answered++;const b=document.createElement('button');b.type='button';b.className=`relative h-9 w-full rounded-lg text-[10px] sm:text-[11px] xl:text-xs font-black border transition-all ${cur?'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/50':m?'bg-amber-500/15 text-amber-300 border-amber-500/40':a?'bg-emerald-600/90 text-white border-emerald-500':'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`;b.textContent=i+1;if(m){const d=document.createElement('span');d.className='absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400';b.appendChild(d);}b.onclick=()=>{loadQuestion(i);closeQuestionDrawer();};grid.appendChild(b);}); updateProgressUI(answered);
}
function updateProgressUI(answered){const total=currentQuestions.length,unanswered=total-answered,pct=total?Math.round(answered/total*100):0;setText('answered-count-number',answered);setText('unanswered-count',unanswered);setText('marked-count',markedQuestions.size);setText('progress-percent',`${pct}%`);setText('mobile-progress-text',`${answered}/${total} terjawab`);['progress-bar','mobile-progress-bar'].forEach(id=>{const e=document.getElementById(id);if(e)e.style.width=`${pct}%`;});}
function fitQuestionToViewport(){const p=document.getElementById('question-panel'),c=document.getElementById('question-content');if(!p||!c)return;p.classList.remove('exam-compact','exam-ultra-compact');requestAnimationFrame(()=>{if(c.scrollHeight>p.clientHeight)p.classList.add('exam-compact');requestAnimationFrame(()=>{if(c.scrollHeight>p.clientHeight)p.classList.add('exam-ultra-compact');});});}
function openQuestionDrawer(){document.getElementById('question-sidebar')?.classList.remove('translate-x-full');document.getElementById('question-drawer-overlay')?.classList.remove('hidden');}
function closeQuestionDrawer(){if(innerWidth>=1024)return;document.getElementById('question-sidebar')?.classList.add('translate-x-full');document.getElementById('question-drawer-overlay')?.classList.add('hidden');}

function startTimer(){clearInterval(timerInterval);updateTimerDisplay();timerInterval=setInterval(()=>{timeRemaining=Math.max(0,timeRemaining-1);updateTimerDisplay();if(timeRemaining%5===0)persistProgress();if(timeRemaining<=0){clearInterval(timerInterval);timerInterval=null;finalizeExam(true);}},1000);}
function updateTimerDisplay(){const d=document.getElementById('timer-display'),card=document.getElementById('timer-card');if(!d)return;d.textContent=`${pad(Math.floor(timeRemaining/60))}:${pad(timeRemaining%60)}`;const redThreshold=Math.min(600,Math.max(60,Math.round(examDurationSeconds*0.15)));const amberThreshold=Math.min(1800,Math.max(redThreshold+60,Math.round(examDurationSeconds*0.35)));const pulseThreshold=Math.min(300,Math.max(30,Math.round(redThreshold*0.5)));d.className='text-sm sm:text-base font-black font-mono tabular-nums '+(timeRemaining<=redThreshold?'text-red-400 '+(timeRemaining<=pulseThreshold?'animate-pulse':''):timeRemaining<=amberThreshold?'text-amber-400':'text-emerald-400');if(card)card.classList.toggle('border-red-500/40',timeRemaining<=redThreshold);}

function requestExitExam(){if(isExamFinished){location.href='index.html';return;}openConfirmModal({title:'Keluar dari ujian?',description:'Progres tersimpan di perangkat ini dan dapat dilanjutkan dari beranda.',actionLabel:'Keluar Ujian',actionClass:'bg-red-600 hover:bg-red-500 text-white',action:()=>{persistProgress();location.href='index.html';}});}
function requestSubmitExam(){if(isExamFinished)return;const answered=Object.keys(userAnswers).length,unanswered=currentQuestions.length-answered;openConfirmModal({title:'Selesaikan ujian?',description:unanswered?`Masih ada ${unanswered} soal belum dijawab. Kamu tetap dapat meninjaunya pada halaman hasil.`:'Semua soal sudah dijawab. Pastikan jawabanmu sudah final.',summary:`<div class="grid grid-cols-3 gap-3 text-center"><div><span class="summary-label">Terjawab</span><strong class="summary-value text-emerald-400">${answered}</strong></div><div><span class="summary-label">Belum</span><strong class="summary-value">${unanswered}</strong></div><div><span class="summary-label">Ditandai</span><strong class="summary-value text-amber-400">${markedQuestions.size}</strong></div></div>`,actionLabel:'Ya, Selesaikan',actionClass:'bg-red-600 hover:bg-red-500 text-white',action:()=>finalizeExam(false)});}
function openConfirmModal(config){const m=document.getElementById('exam-confirm-modal');if(!m)return;setText('confirm-modal-title',config.title);setText('confirm-modal-description',config.description);const s=document.getElementById('confirm-modal-summary');if(config.summary){s.innerHTML=config.summary;s.classList.remove('hidden');}else{s.innerHTML='';s.classList.add('hidden');}const a=document.getElementById('confirm-modal-action');a.textContent=config.actionLabel;a.className=`px-5 py-2.5 rounded-xl text-xs font-black ${config.actionClass}`;a.onclick=()=>{closeConfirmModal();config.action();};m.classList.remove('hidden');m.classList.add('flex');}
function closeConfirmModal(){const m=document.getElementById('exam-confirm-modal');if(m){m.classList.add('hidden');m.classList.remove('flex');}}
function submitExam(){requestSubmitExam();}

function calculateResult(autoSubmit=false){
  let correct=0; const wrong=[], blank=[];
  currentQuestions.forEach((q,i)=>{if(userAnswers[i]===undefined)blank.push(i);else if(Number(userAnswers[i])===Number(q.answer))correct++;else wrong.push(i);});
  const score=currentQuestions.length?Math.round(correct/currentQuestions.length*100):0;
  return {attemptId,category:selectedCategory,mode:activeMode,modeLabel:getModeLabel(),score,correct,wrong,blank,answered:Object.keys(userAnswers).length,total:currentQuestions.length,autoSubmit,marked:[...markedQuestions],questions:currentQuestions.map(q=>({...q,options:[...q.options]})),answers:{...userAnswers},finishedAt:new Date().toISOString(),durationSeconds:examDurationSeconds,timeUsed:Math.max(0,examDurationSeconds-timeRemaining)};
}
function finalizeExam(autoSubmit=false){if(isExamFinished)return;isExamFinished=true;clearInterval(timerInterval);timerInterval=null;clearSavedProgress();lastResult=calculateResult(autoSubmit);saveHistory(lastResult);if(activeMode==='full'&&!customRetrySession)showParticipantNameModal();else showResultScreen(lastResult);}

function saveHistory(result){
  const history=readJSON(HISTORY_KEY,[]); if(history.some(x=>x.attemptId===result.attemptId))return;
  history.unshift({attemptId:result.attemptId,category:result.category,mode:result.mode,modeLabel:result.modeLabel,score:result.score,correct:result.correct,wrong:result.wrong.length,unanswered:result.blank.length,answered:result.answered,total:result.total,finishedAt:result.finishedAt,timeUsed:result.timeUsed,durationSeconds:result.durationSeconds});
  writeJSON(HISTORY_KEY,history.slice(0,80));
}

function showParticipantNameModal(){
  pendingExamResult=lastResult; removeParticipantNameModal(); let defaultName=''; try{defaultName=localStorage.getItem('ruangtryout_last_participant_name')||'';}catch{} if(!defaultName&&typeof auth!=='undefined'&&auth?.currentUser?.displayName)defaultName=auth.currentUser.displayName;
  const modal=document.createElement('div');modal.id='participant-name-modal';modal.className='fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4';modal.innerHTML=`<div class="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"><div class="p-6 sm:p-7"><div class="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 text-2xl">🏆</div><h2 class="text-xl sm:text-2xl font-black text-white">Simpan ke Papan Peringkat</h2><p class="mt-2 text-sm leading-6 text-slate-400">Nama dan skor latihan akan terlihat publik. Fitur ini opsional.</p><div class="mt-5 bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3.5 flex justify-between"><div><span class="text-[9px] uppercase font-black text-slate-600">${escapeHtml(getCategoryDisplayName())}</span><p class="mt-1 text-xs font-bold text-slate-400">${pendingExamResult.correct}/${pendingExamResult.total} benar</p></div><div class="text-right"><span class="text-[8px] uppercase font-black text-slate-600">Skor Latihan</span><strong class="block text-3xl leading-none font-black text-emerald-400">${pendingExamResult.score}</strong></div></div><div class="mt-6"><label for="participant-name-input" class="block mb-2 text-[10px] uppercase tracking-[.12em] font-black text-slate-400">Nama Peserta</label><input id="participant-name-input" maxlength="40" autocomplete="name" placeholder="Masukkan nama" class="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-600 text-sm font-semibold px-4 py-3.5 rounded-xl outline-none"><p id="participant-name-error" class="hidden mt-2 text-[10px] font-semibold text-red-400"></p><p class="mt-2 text-[9px] leading-4 text-slate-600">Gunakan nama yang pantas. Jangan masukkan nomor telepon, alamat, atau data sensitif.</p></div></div><div class="px-6 sm:px-7 py-4 bg-slate-950/40 border-t border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5"><button onclick="continueWithoutLeaderboard()" class="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-300 px-3 py-2.5">Lewati</button><button id="save-leaderboard-button" onclick="submitParticipantName()" class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-xl"><span id="save-leaderboard-button-text">Simpan ke Leaderboard</span></button></div></div>`;document.body.appendChild(modal);const input=document.getElementById('participant-name-input');input.value=defaultName;setTimeout(()=>{input.focus();if(defaultName)input.select();},80);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitParticipantName();}});
}
function sanitizeName(value){let n=String(value||'').trim().replace(/\s+/g,' ');try{return n.replace(/[^\p{L}\p{M}\p{N}\s.'-]/gu,'');}catch{return n.replace(/[^a-zA-Z0-9\s.'-]/g,'');}}
function participantError(msg){const e=document.getElementById('participant-name-error');if(e){e.textContent=msg;e.classList.remove('hidden');}}
async function submitParticipantName(){
  if(!pendingExamResult)return;const input=document.getElementById('participant-name-input'),button=document.getElementById('save-leaderboard-button'),text=document.getElementById('save-leaderboard-button-text');let name=sanitizeName(input?.value);if(name.length<2)return participantError('Masukkan nama minimal 2 karakter.');if(name.length>40)return participantError('Nama maksimal 40 karakter.');if(typeof db==='undefined'||!db||typeof firebase==='undefined')return participantError('Koneksi leaderboard belum tersedia.');button.disabled=true;text.textContent='Menyimpan...';
  try{
    const record={name,score:pendingExamResult.score,percentage:pendingExamResult.score,category:selectedCategory.toUpperCase(),mode:'full',correctAnswers:pendingExamResult.correct,answered:pendingExamResult.answered,totalQuestions:pendingExamResult.total,attemptId:pendingExamResult.attemptId,timestamp:firebase.firestore.FieldValue.serverTimestamp()};
    await db.collection('leaderboard').doc(pendingExamResult.attemptId).set(record);
    try{localStorage.setItem('ruangtryout_last_participant_name',name);}catch{}
    lastResult.leaderboardSaved=true; lastResult.participantName=name; pendingExamResult=null;removeParticipantNameModal();showResultScreen(lastResult);
  }catch(error){console.error('Leaderboard:',error);button.disabled=false;text.textContent='Coba Simpan Lagi';participantError(error?.code==='permission-denied'?'Leaderboard menolak penyimpanan. Firestore Rules perlu diperbarui.':'Belum berhasil menyimpan. Silakan coba lagi.');}
}
function removeParticipantNameModal(){document.getElementById('participant-name-modal')?.remove();}
function continueWithoutLeaderboard(){pendingExamResult=null;removeParticipantNameModal();showResultScreen(lastResult,false,'');}

function showResultScreen(result,savedToLeaderboard=result?.leaderboardSaved||false,name=result?.participantName||''){
  const wrong=result.wrong.length,blank=result.blank.length; const grade=result.score>=85?['Sangat Baik','text-emerald-400']:result.score>=70?['Baik','text-blue-400']:result.score>=55?['Cukup','text-amber-400']:['Perlu Latihan','text-rose-400'];
  quizCard().innerHTML=`<div class="h-full overflow-y-auto review-scroll"><div class="min-h-full flex items-center justify-center p-5 sm:p-8"><div class="w-full max-w-3xl text-center"><div class="w-16 h-16 mx-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-3xl">✓</div><h2 class="mt-5 text-2xl sm:text-3xl font-black text-white">${result.autoSubmit?'Waktu Habis':'Ujian Selesai'}</h2><p class="mt-2 text-xs sm:text-sm text-slate-400">${savedToLeaderboard?`Skor <strong class="text-slate-200">${escapeHtml(name)}</strong> tersimpan di leaderboard.`:'Gunakan hasil ini sebagai bahan evaluasi latihan berikutnya.'}</p><div class="mt-6 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">${resultBox('Skor',result.score,'text-emerald-400')}${resultBox('Benar',result.correct,'text-white')}${resultBox('Salah',wrong,'text-rose-400')}${resultBox('Kosong',blank,'text-slate-300')}${resultBox('Status',grade[0],grade[1],'text-sm')}</div><p class="mt-4 text-[10px] text-slate-500">Skor ini adalah skor latihan 0–100, bukan nilai resmi BKN/SNPMB.</p><div class="mt-7 flex flex-wrap justify-center gap-3"><button onclick="showReviewScreen('all')" class="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-xl">Tinjau Jawaban & Pembahasan</button>${wrong?'<button onclick="startWrongRetry()" class="bg-rose-500/10 hover:bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-black px-5 py-3 rounded-xl">Ulangi Soal Salah</button>':''}<a href="progress.html" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl">Perkembangan Saya</a>${activeMode==='full'?'<a href="leaderboard.html" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl">Leaderboard</a>':''}<a href="index.html" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl">Beranda</a></div></div></div></div>`;
}
function resultBox(label,value,color,extra=''){return `<div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4"><span class="text-[8px] uppercase font-black text-slate-600">${label}</span><strong class="block mt-1 ${extra||'text-2xl sm:text-3xl'} font-black ${color}">${escapeHtml(value)}</strong></div>`;}

function showReviewScreen(filter='all'){
  if(!lastResult)return; const result=lastResult;
  const indices=result.questions.map((_,i)=>i).filter(i=>filter==='all'||(filter==='wrong'&&result.wrong.includes(i))||(filter==='correct'&&Number(result.answers[i])===Number(result.questions[i].answer))||(filter==='blank'&&result.blank.includes(i))||(filter==='marked'&&result.marked.includes(i)));
  const filterBtn=(key,label,count)=>`<button onclick="showReviewScreen('${key}')" class="px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black border ${filter===key?'bg-blue-600 border-blue-500 text-white':'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}">${label}${count!==undefined?` <span class="opacity-70">${count}</span>`:''}</button>`;
  quizCard().innerHTML=`<div class="h-full overflow-y-auto review-scroll bg-slate-950"><div class="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-4"><div class="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><button onclick="showResultScreen(lastResult)" class="text-[10px] font-bold text-blue-400 hover:text-blue-300">← Kembali ke hasil</button><h2 class="mt-1 text-xl font-black text-white">Pembahasan & Review</h2><p class="text-[10px] text-slate-500">${escapeHtml(getCategoryDisplayName())} • ${escapeHtml(lastResult.modeLabel)}</p></div><div class="flex flex-wrap gap-2">${filterBtn('all','Semua',result.total)}${filterBtn('wrong','Salah',result.wrong.length)}${filterBtn('correct','Benar',result.correct)}${filterBtn('blank','Kosong',result.blank.length)}${filterBtn('marked','Ditandai',result.marked.length)}</div></div></div><div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">${indices.length?indices.map(i=>reviewCard(i,result)).join(''):'<div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Tidak ada soal pada filter ini.</div>'}<div class="pt-4 flex flex-wrap gap-3 justify-center">${result.wrong.length?'<button onclick="startWrongRetry()" class="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-5 py-3 rounded-xl">Ulangi Soal Salah</button>':''}<a href="progress.html" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-3 rounded-xl">Lihat Perkembangan</a><a href="index.html" class="bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-5 py-3 rounded-xl">Beranda</a></div></div></div>`;
}
function reviewCard(i,result){const q=result.questions[i],selected=result.answers[i],isBlank=selected===undefined,isCorrect=!isBlank&&Number(selected)===Number(q.answer);const status=isBlank?['Belum dijawab','text-slate-300 bg-slate-800']:isCorrect?['Benar','text-emerald-300 bg-emerald-500/10']:['Salah','text-rose-300 bg-rose-500/10'];const opts=q.options.map((o,idx)=>{const correct=idx===q.answer,chosen=idx===Number(selected);let cls='border-slate-800 bg-slate-900/60 text-slate-400';if(correct)cls='border-emerald-500/50 bg-emerald-500/10 text-emerald-200';else if(chosen)cls='border-rose-500/50 bg-rose-500/10 text-rose-200';return `<div class="rounded-xl border ${cls} px-3 py-2.5 text-xs flex gap-3"><strong>${String.fromCharCode(65+idx)}.</strong><span class="flex-1">${escapeHtml(o)}</span>${correct?'<span class="font-black">✓ Benar</span>':chosen?'<span class="font-black">Pilihanmu</span>':''}</div>`;}).join('');const report=`contact.html?topic=${encodeURIComponent('Koreksi Soal')}&message=${encodeURIComponent(`Kategori: ${getCategoryDisplayName()}\nMode: ${result.modeLabel}\nNomor soal sumber: ${q.sourceIndex+1}\n\nSoal: ${q.question}\n\nMasalah yang ingin dilaporkan:`)}`;return `<article class="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"><div class="px-4 sm:px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3"><div class="text-[10px] uppercase tracking-[.13em] font-black text-blue-400">Soal ${i+1} • ${questionSection(q)}</div><span class="text-[10px] font-black px-2.5 py-1 rounded-lg ${status[1]}">${status[0]}</span></div><div class="p-4 sm:p-5"><p class="text-sm sm:text-[15px] font-bold leading-6 text-slate-100">${escapeHtml(q.question)}</p><div class="mt-4 space-y-2">${opts}</div><div class="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"><div class="text-[9px] uppercase tracking-[.15em] font-black text-blue-400">Pembahasan</div><p class="mt-2 text-xs sm:text-sm leading-6 text-slate-300">${escapeHtml(q.explanation)}</p></div><div class="mt-3 text-right"><a href="${report}" class="text-[10px] font-bold text-slate-500 hover:text-rose-400">⚑ Laporkan masalah pada soal</a></div></div></article>`;}

function startWrongRetry(){if(!lastResult?.wrong?.length)return;const wrongQs=lastResult.wrong.map(i=>lastResult.questions[i]);activeMode='retry';customRetrySession=true;attemptId=nowId();currentQuestions=wrongQs.map(q=>({...q,options:[...q.options]}));examDurationSeconds=durationFor('retry',currentQuestions.length);timeRemaining=examDurationSeconds;currentIndex=0;userAnswers={};markedQuestions=new Set();isExamFinished=false;pendingExamResult=null;lastResult=null;renderQuizLayout();loadQuestion(0);startTimer();}

function persistProgress(){if(!quizStarted||isExamFinished||!currentQuestions.length||customRetrySession)return;writeJSON(getStorageKey(),{category:selectedCategory,mode:activeMode,currentIndex,userAnswers,markedQuestions:[...markedQuestions],timeRemaining,durationSeconds:examDurationSeconds,questionsLength:currentQuestions.length,attemptId,datasetVersion:DATASET_VERSION,savedAt:Date.now()});}
function clearSavedProgress(){try{localStorage.removeItem(getStorageKey());if(activeMode==='full')localStorage.removeItem(getLegacyStorageKey());}catch{}}

function handleExamKeyboard(event){if(document.getElementById('participant-name-modal'))return;if(!quizStarted||isExamFinished)return;const modal=document.getElementById('exam-confirm-modal');if(modal&&!modal.classList.contains('hidden')){if(event.key==='Escape')closeConfirmModal();return;}if(event.ctrlKey||event.metaKey||event.altKey)return;const key=event.key.toLowerCase();if(['a','b','c','d'].includes(key)){const q=currentQuestions[currentIndex];const idx=key.charCodeAt(0)-97;if(q&&idx<q.options.length){event.preventDefault();selectOption(idx);}return;}if(event.key==='ArrowLeft'){event.preventDefault();navigateQuestion(-1);}else if(event.key==='ArrowRight'){event.preventDefault();navigateQuestion(1);}else if(key==='m'){event.preventDefault();toggleMarkCurrent();}}

document.addEventListener('DOMContentLoaded',()=>{document.addEventListener('keydown',handleExamKeyboard);window.addEventListener('beforeunload',persistProgress);window.addEventListener('resize',()=>{if(quizStarted&&!isExamFinished)fitQuestionToViewport();});startQuizProcess();});
