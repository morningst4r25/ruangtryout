// app.js - Ruang Tryout
// Logika Ujian CAT + Navigasi Soal + Timer + Review Flag + Autosave + Firebase

const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = (urlParams.get('cat') || 'cpns').toLowerCase();

let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let markedQuestions = new Set();
let timerInterval = null;
let timeRemaining = 90 * 60; // 90 menit
let quizStarted = false;
let isExamFinished = false;

const EXAM_DURATION_SECONDS = 90 * 60;


// =========================================================
// BOOTSTRAP — UJIAN DAPAT DIMULAI TANPA LOGIN
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener(
        'keydown',
        handleExamKeyboard
    );

    window.addEventListener(
        'beforeunload',
        persistProgress
    );

    // Login Google TIDAK diwajibkan.
    // Semua pengunjung dapat langsung mengerjakan ujian.
    //
    // Jika pengguna kebetulan sudah login,
    // akun tersebut tetap dapat digunakan untuk
    // menyimpan skor ke Firebase / leaderboard.

    startQuizProcess();

});


// =========================================================
// SYSTEM ERROR
// =========================================================

function showSystemError(message) {

    const quizCard =
        document.getElementById('quiz-card');

    if (!quizCard) return;


    quizCard.innerHTML = `

        <div class="
            flex-1
            flex
            items-center
            justify-center
            p-8
            text-center
        ">

            <div>

                <p class="
                    font-bold
                    text-white
                ">
                    Terjadi kendala
                </p>


                <p class="
                    mt-2
                    text-sm
                    text-slate-400
                ">
                    ${escapeHtml(message)}
                </p>


                <a
                    href="index.html"

                    class="
                        inline-flex
                        mt-5
                        bg-slate-800
                        hover:bg-slate-700
                        text-slate-200
                        text-xs
                        font-bold
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        border-slate-700
                        transition
                    "
                >
                    Kembali ke Beranda
                </a>

            </div>

        </div>

    `;

}


// =========================================================
// LOAD BANK SOAL & RESUME
// =========================================================

function startQuizProcess() {

    quizStarted = true;

    const catKey = selectedCategory;


    // =====================================================
    // CARI BANK SOAL
    // =====================================================

    if (
        typeof quizCategories !== 'undefined' &&
        quizCategories[catKey]
    ) {

        currentQuestions =
            quizCategories[catKey].questions || [];

    }

    else if (
        typeof questionsData !== 'undefined' &&
        questionsData[catKey]
    ) {

        currentQuestions =
            questionsData[catKey] || [];

    }

    else if (
        typeof questions !== 'undefined'
    ) {

        currentQuestions =
            Array.isArray(questions)
                ? questions
                : (questions[catKey] || []);

    }

    else {

        currentQuestions = [];

    }


    // =====================================================
    // BANK SOAL TIDAK DITEMUKAN
    // =====================================================

    if (!currentQuestions.length) {

        showSystemError(
            `Soal untuk kategori "${selectedCategory.toUpperCase()}" tidak ditemukan.`
        );

        return;

    }


    // =====================================================
    // CEK AUTOSAVE
    // =====================================================

    const saved =
        loadSavedProgress();


    const canResume =

        saved &&

        saved.category === selectedCategory &&

        saved.questionsLength ===
            currentQuestions.length &&

        Number(saved.timeRemaining) > 0 &&

        Number(saved.timeRemaining) <=
            EXAM_DURATION_SECONDS;


    if (
        canResume &&
        hasMeaningfulProgress(saved)
    ) {

        showResumeScreen(saved);

    }

    else {

        startFreshQuiz();

    }

}


// =========================================================
// CEK APAKAH ADA PROGRES BERARTI
// =========================================================

function hasMeaningfulProgress(saved) {

    const answerCount =
        saved.userAnswers
            ? Object.keys(
                saved.userAnswers
            ).length
            : 0;


    return (

        answerCount > 0 ||

        Number(saved.currentIndex) > 0 ||

        Number(saved.timeRemaining) <
            EXAM_DURATION_SECONDS - 5 ||

        (
            Array.isArray(
                saved.markedQuestions
            ) &&

            saved.markedQuestions.length > 0
        )

    );

}


// =========================================================
// RESUME SCREEN
// =========================================================

function showResumeScreen(saved) {

    const quizCard =
        document.getElementById('quiz-card');


    const answered =
        saved.userAnswers
            ? Object.keys(
                saved.userAnswers
            ).length
            : 0;


    const mins =
        Math.floor(
            saved.timeRemaining / 60
        );


    const secs =
        saved.timeRemaining % 60;


    quizCard.innerHTML = `

        <div class="
            flex-1
            flex
            items-center
            justify-center
            p-6
            sm:p-10
        ">

            <div class="
                w-full
                max-w-xl
                bg-slate-950/40
                border
                border-slate-800
                rounded-3xl
                p-6
                sm:p-8
                text-center
            ">

                <div class="
                    w-14
                    h-14
                    rounded-2xl
                    bg-amber-500/10
                    border
                    border-amber-500/20
                    text-amber-400
                    flex
                    items-center
                    justify-center
                    mx-auto
                ">

                    <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                    >

                        <path
                            d="M3 12a9 9 0 1 0 3-6.7L3 8"
                        />

                        <path
                            d="M3 3v5h5"
                        />

                        <path
                            d="M12 7v5l3 2"
                        />

                    </svg>

                </div>


                <h2 class="
                    mt-5
                    text-2xl
                    font-black
                    text-white
                ">
                    Ujian Belum Selesai
                </h2>


                <p class="
                    mt-2
                    text-sm
                    text-slate-400
                ">
                    Kami menemukan progres simulasi sebelumnya pada perangkat ini.
                </p>


                <div class="
                    mt-6
                    grid
                    grid-cols-3
                    gap-3
                ">

                    <div class="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-4
                    ">

                        <span class="
                            text-[9px]
                            uppercase
                            font-black
                            tracking-wider
                            text-slate-500
                        ">
                            Terjawab
                        </span>

                        <strong class="
                            block
                            mt-1
                            text-xl
                            text-white
                        ">
                            ${answered}
                        </strong>

                    </div>


                    <div class="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-4
                    ">

                        <span class="
                            text-[9px]
                            uppercase
                            font-black
                            tracking-wider
                            text-slate-500
                        ">
                            Soal
                        </span>

                        <strong class="
                            block
                            mt-1
                            text-xl
                            text-white
                        ">
                            ${Number(saved.currentIndex) + 1}
                        </strong>

                    </div>


                    <div class="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-4
                    ">

                        <span class="
                            text-[9px]
                            uppercase
                            font-black
                            tracking-wider
                            text-slate-500
                        ">
                            Waktu
                        </span>

                        <strong class="
                            block
                            mt-1
                            text-xl
                            text-amber-400
                            font-mono
                        ">
                            ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}
                        </strong>

                    </div>

                </div>


                <div class="
                    mt-7
                    flex
                    flex-col
                    sm:flex-row
                    justify-center
                    gap-3
                ">

                    <button
                        onclick="resumeSavedQuiz()"

                        class="
                            bg-blue-600
                            hover:bg-blue-500
                            text-white
                            font-black
                            text-xs
                            sm:text-sm
                            px-6
                            py-3
                            rounded-xl
                            transition
                            shadow-lg
                            shadow-blue-600/20
                        "
                    >

                        Lanjutkan Ujian

                    </button>


                    <button
                        onclick="startFreshQuiz()"

                        class="
                            bg-slate-800
                            hover:bg-slate-700
                            text-slate-300
                            font-bold
                            text-xs
                            sm:text-sm
                            px-6
                            py-3
                            rounded-xl
                            border
                            border-slate-700
                            transition
                        "
                    >

                        Mulai Ulang

                    </button>

                </div>

            </div>

        </div>

    `;

}


// =========================================================
// LANJUTKAN UJIAN TERSIMPAN
// =========================================================

function resumeSavedQuiz() {

    const saved =
        loadSavedProgress();


    if (!saved) {

        startFreshQuiz();

        return;

    }


    currentIndex =
        clamp(
            Number(saved.currentIndex) || 0,
            0,
            currentQuestions.length - 1
        );


    userAnswers =
        saved.userAnswers || {};


    markedQuestions =
        new Set(
            (saved.markedQuestions || [])
                .map(Number)
        );


    timeRemaining =
        clamp(
            Number(saved.timeRemaining) ||
                EXAM_DURATION_SECONDS,
            1,
            EXAM_DURATION_SECONDS
        );


    isExamFinished = false;


    renderQuizLayout();

    loadQuestion(
        currentIndex
    );

    startTimer();

}


// =========================================================
// MULAI UJIAN BARU
// =========================================================

function startFreshQuiz() {

    clearSavedProgress();


    currentIndex = 0;

    userAnswers = {};

    markedQuestions =
        new Set();

    timeRemaining =
        EXAM_DURATION_SECONDS;

    isExamFinished = false;


    renderQuizLayout();

    loadQuestion(
        currentIndex
    );

    startTimer();

}


// =========================================================
// MAIN EXAM LAYOUT
// =========================================================

function renderQuizLayout() {

    const quizCard =
        document.getElementById(
            'quiz-card'
        );


    const categoryData =
        (
            typeof quizCategories !==
            'undefined'
        )
            ? quizCategories[
                selectedCategory
            ]
            : null;


    const categoryTitle =
        categoryData
            ? categoryData.title
            : selectedCategory.toUpperCase();


    quizCard.innerHTML = `

        <!-- =================================================
             EXAM TOPBAR
        ================================================== -->

        <div class="
            bg-slate-900
            border-b
            border-slate-800
            px-4
            sm:px-6
            py-3.5
            sm:py-4
            flex
            items-center
            justify-between
            gap-4
            shrink-0
        ">


            <div class="min-w-0">

                <div class="
                    flex
                    items-center
                    flex-wrap
                    gap-2
                    mb-1
                ">

                    <span class="
                        text-[10px]
                        sm:text-[11px]
                        font-black
                        text-blue-400
                        uppercase
                        tracking-[0.14em]
                        truncate
                        max-w-[220px]
                        sm:max-w-none
                    ">
                        ${escapeHtml(categoryTitle)}
                    </span>


                    <span
                        id="question-section-label"

                        class="
                            inline-flex
                            px-2
                            py-1
                            rounded-md
                            bg-slate-800
                            border
                            border-slate-700
                            text-[9px]
                            font-black
                            text-slate-400
                            uppercase
                            tracking-wider
                        "
                    ></span>

                </div>


                <div class="
                    flex
                    items-baseline
                    gap-2
                ">

                    <h2
                        id="question-number-title"

                        class="
                            text-base
                            sm:text-lg
                            font-black
                            text-white
                            tracking-tight
                        "
                    >

                        Soal 01

                    </h2>


                    <span
                        id="question-total-label"

                        class="
                            text-xs
                            text-slate-500
                            font-semibold
                        "
                    >

                        dari ${currentQuestions.length}

                    </span>

                </div>

            </div>


            <!-- TIMER -->

            <div
                id="timer-card"

                class="
                    min-w-[92px]
                    sm:min-w-[108px]
                    bg-slate-800/80
                    border
                    border-slate-700
                    px-3
                    sm:px-4
                    py-2
                    rounded-xl
                    text-right
                    transition-colors
                "
            >

                <span class="
                    text-[8px]
                    sm:text-[9px]
                    text-slate-500
                    block
                    uppercase
                    tracking-wider
                    font-black
                ">

                    Sisa Waktu

                </span>


                <span
                    id="timer-display"

                    class="
                        text-base
                        sm:text-lg
                        font-black
                        text-emerald-400
                        font-mono
                        tabular-nums
                    "
                >

                    90:00

                </span>

            </div>

        </div>



        <!-- =================================================
             WORKSPACE
        ================================================== -->

        <div class="
            relative
            flex-1
            min-h-0
            flex
            overflow-hidden
        ">


            <!-- =============================================
                 QUESTION AREA
            ============================================== -->

            <section
                id="question-scroll-area"

                class="
                    flex-1
                    min-w-0
                    overflow-y-auto
                "
            >

                <div class="
                    max-w-5xl
                    mx-auto
                    p-4
                    sm:p-6
                    lg:p-8
                    xl:p-10
                ">


                    <!-- QUESTION -->

                    <div class="
                        mb-6
                        sm:mb-7
                    ">

                        <p class="
                            text-[10px]
                            uppercase
                            tracking-[0.18em]
                            font-black
                            text-slate-500
                            mb-2
                        ">

                            Pertanyaan

                        </p>


                        <div
                            id="question-text"

                            class="
                                text-sm
                                sm:text-[15px]
                                lg:text-base
                                text-slate-100
                                leading-7
                                font-semibold
                            "
                        ></div>

                    </div>



                    <!-- ANSWER OPTIONS -->

                    <div
                        id="options-container"
                        class="space-y-3"
                    ></div>



                    <!-- =====================================
                         UTILITY ROW
                    ====================================== -->

                    <div class="
                        mt-6
                        pt-5
                        border-t
                        border-slate-800/80

                        flex
                        flex-col

                        sm:flex-row
                        sm:items-center

                        justify-between
                        gap-4
                    ">


                        <!-- MARK QUESTION -->

                        <button
                            id="mark-question-btn"

                            type="button"

                            onclick="toggleMarkCurrent()"

                            class="
                                inline-flex
                                items-center
                                justify-center
                                sm:justify-start
                                gap-2

                                w-full
                                sm:w-auto

                                px-4
                                py-2.5

                                rounded-xl

                                bg-slate-800/70
                                hover:bg-slate-800

                                border
                                border-slate-700

                                text-xs
                                font-bold
                                text-slate-300

                                transition-all
                            "
                        >

                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                aria-hidden="true"
                            >

                                <path
                                    d="M5 5v16"
                                />

                                <path
                                    d="M5 5h11l-2 4 2 4H5"
                                />

                            </svg>


                            <span
                                id="mark-question-label"
                            >
                                Tandai untuk ditinjau
                            </span>

                        </button>



                        <!-- KEYBOARD TIPS -->

                        <div class="
                            hidden
                            xl:flex
                            items-center
                            gap-2

                            text-[9px]
                            font-semibold
                            text-slate-600
                        ">

                            <span class="
                                px-2
                                py-1
                                rounded-md
                                border
                                border-slate-800
                                bg-slate-950/50
                            ">

                                A–D pilih jawaban

                            </span>


                            <span class="
                                px-2
                                py-1
                                rounded-md
                                border
                                border-slate-800
                                bg-slate-950/50
                            ">

                                ← → pindah soal

                            </span>


                            <span class="
                                px-2
                                py-1
                                rounded-md
                                border
                                border-slate-800
                                bg-slate-950/50
                            ">

                                M tandai

                            </span>

                        </div>

                    </div>



                    <!-- =====================================
                         MOBILE PROGRESS SUMMARY
                    ====================================== -->

                    <div class="
                        lg:hidden
                        mt-5

                        bg-slate-950/50
                        border
                        border-slate-800
                        rounded-2xl
                        p-4
                    ">

                        <div class="
                            flex
                            items-center
                            justify-between
                            gap-3
                        ">

                            <div>

                                <p class="
                                    text-[9px]
                                    uppercase
                                    tracking-wider
                                    font-black
                                    text-slate-500
                                ">

                                    Progres Ujian

                                </p>


                                <p
                                    id="mobile-progress-text"

                                    class="
                                        mt-1
                                        text-xs
                                        font-bold
                                        text-slate-300
                                    "
                                >

                                    0/${currentQuestions.length} terjawab

                                </p>

                            </div>


                            <button
                                type="button"

                                onclick="openQuestionDrawer()"

                                class="
                                    inline-flex
                                    items-center
                                    gap-2

                                    bg-blue-600
                                    hover:bg-blue-500

                                    text-white
                                    text-xs
                                    font-black

                                    px-4
                                    py-2.5

                                    rounded-xl

                                    transition
                                "
                            >

                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    aria-hidden="true"
                                >

                                    <rect
                                        x="3"
                                        y="3"
                                        width="7"
                                        height="7"
                                        rx="1"
                                    />

                                    <rect
                                        x="14"
                                        y="3"
                                        width="7"
                                        height="7"
                                        rx="1"
                                    />

                                    <rect
                                        x="3"
                                        y="14"
                                        width="7"
                                        height="7"
                                        rx="1"
                                    />

                                    <rect
                                        x="14"
                                        y="14"
                                        width="7"
                                        height="7"
                                        rx="1"
                                    />

                                </svg>

                                Daftar Soal

                            </button>

                        </div>


                        <div class="
                            mt-3
                            h-1.5
                            bg-slate-800
                            rounded-full
                            overflow-hidden
                        ">

                            <div
                                id="mobile-progress-bar"

                                class="
                                    h-full
                                    bg-blue-500
                                    rounded-full
                                    transition-all
                                    duration-300
                                "

                                style="width:0%"
                            ></div>

                        </div>

                    </div>

                </div>

            </section>



            <!-- =================================================
                 MOBILE DRAWER OVERLAY
            ================================================== -->

            <button
                id="question-drawer-overlay"

                type="button"

                aria-label="Tutup daftar soal"

                onclick="closeQuestionDrawer()"

                class="
                    hidden
                    lg:hidden
                    fixed
                    inset-0
                    z-40
                    bg-black/60
                    backdrop-blur-[2px]
                "
            ></button>



            <!-- =================================================
                 QUESTION SIDEBAR
            ================================================== -->

            <aside
                id="question-sidebar"

                class="
                    fixed
                    lg:static

                    top-0
                    right-0

                    z-50
                    lg:z-auto

                    h-full
                    lg:h-auto

                    w-[88vw]
                    max-w-sm

                    lg:w-80
                    xl:w-[340px]

                    translate-x-full
                    lg:translate-x-0

                    transition-transform
                    duration-300

                    bg-slate-950

                    border-l
                    border-slate-800

                    flex
                    flex-col

                    shrink-0
                "
            >


                <!-- MOBILE DRAWER HEADER -->

                <div class="
                    lg:hidden
                    h-16
                    px-5

                    flex
                    items-center
                    justify-between

                    border-b
                    border-slate-800

                    shrink-0
                ">

                    <div>

                        <p class="
                            text-xs
                            font-black
                            text-white
                        ">

                            Daftar Soal

                        </p>


                        <p class="
                            text-[9px]
                            text-slate-500
                            mt-0.5
                        ">

                            Pilih nomor untuk berpindah soal

                        </p>

                    </div>


                    <button
                        type="button"

                        onclick="closeQuestionDrawer()"

                        class="
                            w-9
                            h-9

                            rounded-xl

                            bg-slate-900

                            border
                            border-slate-800

                            text-slate-400
                            hover:text-white

                            flex
                            items-center
                            justify-center
                        "
                    >

                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >

                            <path
                                d="M18 6 6 18M6 6l12 12"
                            />

                        </svg>

                    </button>

                </div>



                <!-- SIDEBAR CONTENT -->

                <div class="
                    flex-1
                    min-h-0
                    overflow-y-auto
                    p-4
                    sm:p-5
                ">


                    <!-- PROGRESS HEADER -->

                    <div class="
                        flex
                        items-start
                        justify-between
                        gap-3
                    ">

                        <div>

                            <p class="
                                text-[9px]
                                uppercase
                                tracking-[0.16em]
                                font-black
                                text-slate-500
                            ">

                                Progres Ujian

                            </p>


                            <div class="
                                mt-1
                                flex
                                items-baseline
                                gap-1.5
                            ">

                                <strong
                                    id="answered-count-number"

                                    class="
                                        text-2xl
                                        font-black
                                        text-white
                                    "
                                >

                                    0

                                </strong>


                                <span class="
                                    text-xs
                                    font-semibold
                                    text-slate-500
                                ">

                                    / ${currentQuestions.length}

                                </span>

                            </div>

                        </div>


                        <span
                            id="progress-percent"

                            class="
                                text-xs
                                font-black
                                text-blue-400

                                bg-blue-500/10

                                border
                                border-blue-500/20

                                rounded-lg

                                px-2.5
                                py-1.5
                            "
                        >

                            0%

                        </span>

                    </div>



                    <!-- PROGRESS BAR -->

                    <div class="
                        mt-3
                        h-1.5
                        bg-slate-800
                        rounded-full
                        overflow-hidden
                    ">

                        <div
                            id="progress-bar"

                            class="
                                h-full

                                bg-gradient-to-r
                                from-blue-600
                                to-cyan-400

                                rounded-full

                                transition-all
                                duration-300
                            "

                            style="width:0%"
                        ></div>

                    </div>



                    <!-- PROGRESS STATISTICS -->

                    <div class="
                        grid
                        grid-cols-2
                        gap-2
                        mt-4
                    ">

                        <div class="
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-800
                            p-3
                        ">

                            <span class="
                                text-[8px]
                                uppercase
                                font-black
                                tracking-wider
                                text-slate-600
                            ">

                                Belum dijawab

                            </span>


                            <strong
                                id="unanswered-count"

                                class="
                                    block
                                    mt-1
                                    text-sm
                                    text-slate-300
                                "
                            >

                                ${currentQuestions.length}

                            </strong>

                        </div>


                        <div class="
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-800
                            p-3
                        ">

                            <span class="
                                text-[8px]
                                uppercase
                                font-black
                                tracking-wider
                                text-slate-600
                            ">

                                Ditandai

                            </span>


                            <strong
                                id="marked-count"

                                class="
                                    block
                                    mt-1
                                    text-sm
                                    text-amber-400
                                "
                            >

                                0

                            </strong>

                        </div>

                    </div>



                    <!-- LEGEND -->

                    <div class="
                        mt-5
                        pt-4
                        border-t
                        border-slate-800
                    ">

                        <p class="
                            text-[9px]
                            uppercase
                            tracking-[0.14em]
                            font-black
                            text-slate-600
                            mb-3
                        ">

                            Status Nomor

                        </p>


                        <div class="
                            grid
                            grid-cols-2
                            gap-y-2
                            gap-x-3
                            text-[9px]
                            text-slate-500
                        ">

                            <span class="
                                flex
                                items-center
                                gap-2
                            ">

                                <span class="
                                    w-2.5
                                    h-2.5
                                    rounded
                                    bg-emerald-600
                                "></span>

                                Dijawab

                            </span>


                            <span class="
                                flex
                                items-center
                                gap-2
                            ">

                                <span class="
                                    w-2.5
                                    h-2.5
                                    rounded
                                    bg-slate-800
                                    border
                                    border-slate-700
                                "></span>

                                Belum

                            </span>


                            <span class="
                                flex
                                items-center
                                gap-2
                            ">

                                <span class="
                                    w-2.5
                                    h-2.5
                                    rounded
                                    bg-blue-600
                                    ring-2
                                    ring-blue-400/70
                                "></span>

                                Aktif

                            </span>


                            <span class="
                                flex
                                items-center
                                gap-2
                            ">

                                <span class="
                                    w-2.5
                                    h-2.5
                                    rounded
                                    bg-amber-500
                                "></span>

                                Ditandai

                            </span>

                        </div>

                    </div>



                    <!-- NUMBER GRID -->

                    <div
                        id="question-grid"

                        class="
                            mt-4
                            grid
                            grid-cols-5
                            gap-2
                        "
                    ></div>

                </div>



                <!-- FINISH BUTTON -->

                <div class="
                    p-4

                    border-t
                    border-slate-800

                    bg-slate-950

                    shrink-0
                ">

                    <button
                        onclick="requestSubmitExam()"

                        class="
                            w-full

                            inline-flex
                            items-center
                            justify-center
                            gap-2

                            bg-red-500/10
                            hover:bg-red-500/15

                            text-red-400
                            hover:text-red-300

                            border
                            border-red-500/25

                            text-xs
                            font-black

                            px-4
                            py-3

                            rounded-xl

                            transition-all
                        "
                    >

                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                        >

                            <path
                                d="M5 5v14"
                            />

                            <path
                                d="M5 5h11l-2 4 2 4H5"
                            />

                        </svg>

                        Selesaikan Ujian

                    </button>

                </div>

            </aside>

        </div>



        <!-- =================================================
             BOTTOM NAVIGATION
        ================================================== -->

        <div class="
            bg-slate-900

            border-t
            border-slate-800

            px-3
            sm:px-5

            py-3

            flex
            items-center
            justify-between
            gap-2

            shrink-0
        ">


            <!-- PREVIOUS -->

            <button
                id="prev-btn"

                onclick="navigateQuestion(-1)"

                class="
                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    min-w-0

                    bg-slate-800
                    hover:bg-slate-700
                    disabled:hover:bg-slate-800

                    text-slate-300

                    text-[10px]
                    sm:text-xs
                    font-bold

                    px-3
                    sm:px-4

                    py-2.5

                    rounded-xl

                    border
                    border-slate-700

                    transition

                    disabled:opacity-40
                    disabled:cursor-not-allowed
                "
            >

                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >

                    <path
                        d="M19 12H5"
                    />

                    <path
                        d="m11 18-6-6 6-6"
                    />

                </svg>


                <span class="
                    hidden
                    sm:inline
                ">

                    Sebelumnya

                </span>

            </button>



            <!-- FINISH -->

            <button
                onclick="requestSubmitExam()"

                class="
                    hidden
                    sm:inline-flex

                    items-center
                    justify-center
                    gap-2

                    text-[10px]
                    sm:text-xs
                    font-bold

                    text-red-400
                    hover:text-red-300

                    px-3
                    py-2

                    rounded-lg

                    hover:bg-red-500/10

                    transition
                "
            >

                Selesaikan Ujian

            </button>



            <!-- NEXT -->

            <button
                id="next-btn"

                onclick="navigateQuestion(1)"

                class="
                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    min-w-0

                    bg-blue-600
                    hover:bg-blue-500
                    disabled:hover:bg-blue-600

                    text-white

                    text-[10px]
                    sm:text-xs
                    font-black

                    px-3
                    sm:px-4

                    py-2.5

                    rounded-xl

                    shadow-lg
                    shadow-blue-950/20

                    transition

                    disabled:opacity-40
                    disabled:cursor-not-allowed
                "
            >

                <span>
                    Berikutnya
                </span>


                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >

                    <path
                        d="M5 12h14"
                    />

                    <path
                        d="m13 6 6 6-6 6"
                    />

                </svg>

            </button>

        </div>



        <!-- =================================================
             CONFIRMATION MODAL
        ================================================== -->

        <div
            id="exam-confirm-modal"

            class="
                hidden
                fixed
                inset-0
                z-[100]

                bg-black/70
                backdrop-blur-sm

                p-4

                items-center
                justify-center
            "
        >

            <div class="
                w-full
                max-w-md

                bg-slate-900

                border
                border-slate-700

                rounded-3xl

                shadow-2xl

                overflow-hidden
            ">


                <div class="
                    p-6
                    sm:p-7
                ">

                    <div
                        id="confirm-modal-icon"

                        class="
                            w-12
                            h-12
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            mb-5
                        "
                    ></div>


                    <h3
                        id="confirm-modal-title"

                        class="
                            text-xl
                            font-black
                            text-white
                            tracking-tight
                        "
                    ></h3>


                    <p
                        id="confirm-modal-description"

                        class="
                            mt-2
                            text-sm
                            text-slate-400
                            leading-6
                        "
                    ></p>


                    <div
                        id="confirm-modal-summary"

                        class="
                            hidden
                            mt-5
                            rounded-2xl
                            bg-slate-950/60

                            border
                            border-slate-800

                            p-4
                        "
                    ></div>

                </div>


                <div class="
                    px-6
                    sm:px-7
                    py-4

                    border-t
                    border-slate-800

                    bg-slate-950/30

                    flex
                    flex-col-reverse
                    sm:flex-row
                    justify-end
                    gap-2.5
                ">

                    <button
                        type="button"

                        onclick="closeConfirmModal()"

                        class="
                            px-5
                            py-2.5

                            rounded-xl

                            bg-slate-800
                            hover:bg-slate-700

                            border
                            border-slate-700

                            text-xs
                            font-bold
                            text-slate-300

                            transition
                        "
                    >

                        Batal

                    </button>


                    <button
                        id="confirm-modal-action"

                        type="button"

                        class="
                            px-5
                            py-2.5

                            rounded-xl

                            text-xs
                            font-black

                            transition
                        "
                    ></button>

                </div>

            </div>

        </div>

    `;


    updateTimerDisplay();

}


// =========================================================
// QUESTION RENDERING
// =========================================================

function loadQuestion(index) {

    if (
        !currentQuestions.length
    ) return;


    currentIndex =
        clamp(
            index,
            0,
            currentQuestions.length - 1
        );


    const q =
        currentQuestions[
            currentIndex
        ];


    // =====================================================
    // QUESTION NUMBER
    // =====================================================

    const numberTitle =
        document.getElementById(
            'question-number-title'
        );


    if (numberTitle) {

        numberTitle.textContent =
            `Soal ${String(currentIndex + 1).padStart(2, '0')}`;

    }


    // =====================================================
    // SECTION LABEL
    // =====================================================

    const sectionLabel =
        document.getElementById(
            'question-section-label'
        );


    if (sectionLabel) {

        sectionLabel.textContent =
            getQuestionSection(
                currentIndex
            );

    }


    // =====================================================
    // QUESTION TEXT
    // =====================================================

    const questionText =
        document.getElementById(
            'question-text'
        );


    if (questionText) {

        questionText.textContent =
            q.question;

    }


    // =====================================================
    // ANSWER OPTIONS
    // =====================================================

    const optionsContainer =
        document.getElementById(
            'options-container'
        );


    optionsContainer.innerHTML = '';


    q.options.forEach(
        (opt, optIdx) => {

            const isSelected =
                userAnswers[
                    currentIndex
                ] === optIdx;


            const btn =
                document.createElement(
                    'button'
                );


            btn.type =
                'button';


            btn.setAttribute(
                'aria-pressed',
                isSelected
                    ? 'true'
                    : 'false'
            );


            btn.setAttribute(
                'aria-label',
                `Jawaban ${String.fromCharCode(65 + optIdx)}`
            );


            btn.className = [

                'group w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 text-xs sm:text-sm flex items-start gap-3',

                isSelected

                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-950/10 ring-1 ring-blue-500/20'

                    : 'bg-slate-800/55 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-blue-500/50 hover:text-white'

            ].join(' ');



            // =================================================
            // LETTER
            // =================================================

            const letter =
                document.createElement(
                    'span'
                );


            letter.className = [

                'w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all',

                isSelected

                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/20'

                    : 'bg-slate-700 text-slate-300 group-hover:bg-blue-500/15 group-hover:text-blue-300'

            ].join(' ');


            letter.textContent =
                String.fromCharCode(
                    65 + optIdx
                );



            // =================================================
            // OPTION TEXT
            // =================================================

            const text =
                document.createElement(
                    'span'
                );


            text.className =
                'flex-1 leading-6 pt-0.5';


            text.textContent =
                opt;



            btn.appendChild(
                letter
            );


            btn.appendChild(
                text
            );



            // =================================================
            // CHECK ICON
            // =================================================

            if (isSelected) {

                const check =
                    document.createElement(
                        'span'
                    );


                check.className =
                    'w-6 h-6 rounded-full bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0 mt-0.5';


                check.innerHTML = `

                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                    >

                        <path
                            d="M20 6 9 17l-5-5"
                        />

                    </svg>

                `;


                btn.appendChild(
                    check
                );

            }



            // =================================================
            // CLICK HANDLER
            // =================================================

            btn.onclick =
                () =>
                    selectOption(
                        optIdx
                    );


            optionsContainer.appendChild(
                btn
            );

        }
    );


    // =====================================================
    // PREVIOUS / NEXT
    // =====================================================

    const prevBtn =
        document.getElementById(
            'prev-btn'
        );


    const nextBtn =
        document.getElementById(
            'next-btn'
        );


    if (prevBtn) {

        prevBtn.disabled =
            currentIndex === 0;

    }


    if (nextBtn) {

        nextBtn.disabled =
            currentIndex ===
            currentQuestions.length - 1;

    }


    // =====================================================
    // UPDATE UI
    // =====================================================

    updateMarkButton();

    renderQuestionGrid();

    persistProgress();


    // =====================================================
    // SCROLL KE ATAS
    // =====================================================

    const scrollArea =
        document.getElementById(
            'question-scroll-area'
        );


    if (scrollArea) {

        scrollArea.scrollTop = 0;

    }

}


// =========================================================
// QUESTION SECTION
// =========================================================

function getQuestionSection(index) {

    if (
        selectedCategory === 'cpns'
    ) {

        if (index < 30)
            return 'TWK';


        if (index < 65)
            return 'TIU';


        return 'TKP';

    }


    if (
        selectedCategory === 'utbk'
    ) {

        if (index < 40)
            return 'Penalaran & Kuantitatif';


        return 'Literasi';

    }


    return 'Simulasi';

}


// =========================================================
// SELECT OPTION
// =========================================================

function selectOption(optIdx) {

    userAnswers[
        currentIndex
    ] = optIdx;


    loadQuestion(
        currentIndex
    );

}


// =========================================================
// QUESTION NAVIGATION
// =========================================================

function navigateQuestion(step) {

    const newIdx =
        currentIndex + step;


    if (
        newIdx >= 0 &&
        newIdx < currentQuestions.length
    ) {

        loadQuestion(
            newIdx
        );

    }

}


// =========================================================
// MARK / REVIEW
// =========================================================

function toggleMarkCurrent() {

    if (
        markedQuestions.has(
            currentIndex
        )
    ) {

        markedQuestions.delete(
            currentIndex
        );

    }

    else {

        markedQuestions.add(
            currentIndex
        );

    }


    updateMarkButton();

    renderQuestionGrid();

    persistProgress();

}


// =========================================================
// UPDATE MARK BUTTON
// =========================================================

function updateMarkButton() {

    const btn =
        document.getElementById(
            'mark-question-btn'
        );


    const label =
        document.getElementById(
            'mark-question-label'
        );


    if (
        !btn ||
        !label
    ) return;


    const isMarked =
        markedQuestions.has(
            currentIndex
        );


    if (isMarked) {

        btn.className =
            'inline-flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-xs font-black text-amber-300 transition-all';


        label.textContent =
            'Ditandai untuk ditinjau';

    }

    else {

        btn.className =
            'inline-flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-all';


        label.textContent =
            'Tandai untuk ditinjau';

    }

}


// =========================================================
// GRID & PROGRESS
// =========================================================

function renderQuestionGrid() {

    const gridContainer =
        document.getElementById(
            'question-grid'
        );


    if (
        !gridContainer
    ) return;


    gridContainer.innerHTML =
        '';


    let answeredCount = 0;


    currentQuestions.forEach(
        (_, i) => {

            const isAnswered =
                userAnswers[i] !== undefined;


            const isMarked =
                markedQuestions.has(i);


            const isCurrent =
                i === currentIndex;


            if (isAnswered) {

                answeredCount++;

            }


            const btn =
                document.createElement(
                    'button'
                );


            btn.type =
                'button';


            btn.dataset.questionIndex =
                String(i);


            btn.setAttribute(

                'aria-label',

                `Soal ${i + 1}${isAnswered ? ', sudah dijawab' : ', belum dijawab'}${isMarked ? ', ditandai' : ''}`

            );


            let styleClass =
                'relative h-9 w-full rounded-lg text-[11px] font-black transition-all flex items-center justify-center border ';


            // =================================================
            // CURRENT
            // =================================================

            if (isCurrent) {

                styleClass +=
                    'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/60 shadow-lg shadow-blue-950/20 ';

            }


            // =================================================
            // MARKED
            // =================================================

            else if (isMarked) {

                styleClass +=
                    'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 ';

            }


            // =================================================
            // ANSWERED
            // =================================================

            else if (isAnswered) {

                styleClass +=
                    'bg-emerald-600/90 text-white border-emerald-500 hover:bg-emerald-500 ';

            }


            // =================================================
            // UNANSWERED
            // =================================================

            else {

                styleClass +=
                    'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700 ';

            }


            btn.className =
                styleClass;


            btn.textContent =
                i + 1;


            // =================================================
            // MARK DOT
            // =================================================

            if (isMarked) {

                const dot =
                    document.createElement(
                        'span'
                    );


                dot.className =
                    'absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400';


                btn.appendChild(
                    dot
                );

            }


            // =================================================
            // NAVIGATION
            // =================================================

            btn.onclick =
                () => {

                    loadQuestion(i);

                    closeQuestionDrawer();

                };


            gridContainer.appendChild(
                btn
            );

        }
    );


    updateProgressUI(
        answeredCount
    );


    requestAnimationFrame(
        () => {

            const currentButton =
                gridContainer.querySelector(
                    `[data-question-index="${currentIndex}"]`
                );


            if (
                currentButton &&
                typeof currentButton.scrollIntoView ===
                    'function'
            ) {

                currentButton.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest'
                });

            }

        }
    );

}


// =========================================================
// UPDATE PROGRESS UI
// =========================================================

function updateProgressUI(
    answeredCount
) {

    const total =
        currentQuestions.length;


    const unanswered =
        Math.max(
            0,
            total - answeredCount
        );


    const percent =
        total
            ? Math.round(
                (
                    answeredCount /
                    total
                ) * 100
            )
            : 0;


    const marked =
        markedQuestions.size;


    setText(
        'answered-count-number',
        answeredCount
    );


    setText(
        'unanswered-count',
        unanswered
    );


    setText(
        'marked-count',
        marked
    );


    setText(
        'progress-percent',
        `${percent}%`
    );


    setText(
        'mobile-progress-text',
        `${answeredCount}/${total} terjawab`
    );


    const progressBar =
        document.getElementById(
            'progress-bar'
        );


    const mobileProgressBar =
        document.getElementById(
            'mobile-progress-bar'
        );


    if (progressBar) {

        progressBar.style.width =
            `${percent}%`;

    }


    if (mobileProgressBar) {

        mobileProgressBar.style.width =
            `${percent}%`;

    }

}


// =========================================================
// MOBILE QUESTION DRAWER
// =========================================================

function openQuestionDrawer() {

    const sidebar =
        document.getElementById(
            'question-sidebar'
        );


    const overlay =
        document.getElementById(
            'question-drawer-overlay'
        );


    if (
        !sidebar ||
        !overlay
    ) return;


    sidebar.classList.remove(
        'translate-x-full'
    );


    overlay.classList.remove(
        'hidden'
    );


    document.body.classList.add(
        'overflow-hidden'
    );

}


// =========================================================
// CLOSE QUESTION DRAWER
// =========================================================

function closeQuestionDrawer() {

    if (
        window.innerWidth >= 1024
    ) return;


    const sidebar =
        document.getElementById(
            'question-sidebar'
        );


    const overlay =
        document.getElementById(
            'question-drawer-overlay'
        );


    if (
        !sidebar ||
        !overlay
    ) return;


    sidebar.classList.add(
        'translate-x-full'
    );


    overlay.classList.add(
        'hidden'
    );


    document.body.classList.remove(
        'overflow-hidden'
    );

}


// =========================================================
// TIMER
// =========================================================

function startTimer() {

    if (
        timerInterval
    ) {

        clearInterval(
            timerInterval
        );

    }


    updateTimerDisplay();


    timerInterval =
        setInterval(
            () => {

                timeRemaining =
                    Math.max(
                        0,
                        timeRemaining - 1
                    );


                updateTimerDisplay();


                // Autosave setiap 5 detik
                if (
                    timeRemaining % 5 === 0
                ) {

                    persistProgress();

                }


                // Waktu habis
                if (
                    timeRemaining <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    timerInterval = null;


                    finalizeExam(
                        true
                    );

                }

            },

            1000
        );

}


// =========================================================
// UPDATE TIMER
// =========================================================

function updateTimerDisplay() {

    const timerDisplay =
        document.getElementById(
            'timer-display'
        );


    const timerCard =
        document.getElementById(
            'timer-card'
        );


    if (
        !timerDisplay
    ) return;


    const mins =
        Math.floor(
            timeRemaining / 60
        );


    const secs =
        timeRemaining % 60;


    timerDisplay.textContent =
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;


    // =====================================================
    // RESET TIMER STATE
    // =====================================================

    timerDisplay.classList.remove(

        'text-emerald-400',

        'text-amber-400',

        'text-red-400',

        'animate-pulse'

    );


    if (timerCard) {

        timerCard.classList.remove(

            'border-emerald-500/30',

            'border-amber-500/30',

            'border-red-500/40',

            'bg-amber-500/5',

            'bg-red-500/5'

        );

    }


    // =====================================================
    // < 10 MENIT
    // =====================================================

    if (
        timeRemaining <=
        10 * 60
    ) {

        timerDisplay.classList.add(
            'text-red-400'
        );


        if (
            timeRemaining <=
            5 * 60
        ) {

            timerDisplay.classList.add(
                'animate-pulse'
            );

        }


        if (timerCard) {

            timerCard.classList.add(
                'border-red-500/40',
                'bg-red-500/5'
            );

        }

    }


    // =====================================================
    // 10 - 30 MENIT
    // =====================================================

    else if (
        timeRemaining <=
        30 * 60
    ) {

        timerDisplay.classList.add(
            'text-amber-400'
        );


        if (timerCard) {

            timerCard.classList.add(
                'border-amber-500/30',
                'bg-amber-500/5'
            );

        }

    }


    // =====================================================
    // > 30 MENIT
    // =====================================================

    else {

        timerDisplay.classList.add(
            'text-emerald-400'
        );


        if (timerCard) {

            timerCard.classList.add(
                'border-emerald-500/30'
            );

        }

    }

}


// =========================================================
// CONFIRMATION MODAL / EXIT / SUBMIT
// =========================================================

function requestExitExam() {

    if (
        isExamFinished
    ) {

        window.location.href =
            'index.html';

        return;

    }


    openConfirmModal({

        type: 'exit',

        title:
            'Keluar dari ujian?',

        description:
            'Progres ujian akan tetap disimpan di perangkat ini sehingga Anda dapat melanjutkannya nanti.',

        actionLabel:
            'Keluar Ujian',

        actionClass:
            'bg-red-600 hover:bg-red-500 text-white',

        action: () => {

            persistProgress();

            window.location.href =
                'index.html';

        }

    });

}


// =========================================================
// REQUEST SUBMIT
// =========================================================

function requestSubmitExam() {

    if (
        isExamFinished
    ) return;


    const answered =
        Object.keys(
            userAnswers
        ).length;


    const unanswered =
        Math.max(

            0,

            currentQuestions.length -
            answered

        );


    const marked =
        markedQuestions.size;


    openConfirmModal({

        type:
            'submit',

        title:
            'Selesaikan ujian?',

        description:

            unanswered > 0

                ? `Masih ada ${unanswered} soal yang belum dijawab. Pastikan Anda sudah memeriksa kembali jawaban sebelum menyelesaikan ujian.`

                : 'Semua soal sudah dijawab. Pastikan jawaban Anda sudah final sebelum menyelesaikan ujian.',


        summary: `

            <div class="
                grid
                grid-cols-3
                gap-3
                text-center
            ">


                <div>

                    <span class="
                        block
                        text-[8px]
                        uppercase
                        font-black
                        tracking-wider
                        text-slate-600
                    ">

                        Terjawab

                    </span>


                    <strong class="
                        block
                        mt-1
                        text-lg
                        text-emerald-400
                    ">

                        ${answered}

                    </strong>

                </div>


                <div>

                    <span class="
                        block
                        text-[8px]
                        uppercase
                        font-black
                        tracking-wider
                        text-slate-600
                    ">

                        Belum

                    </span>


                    <strong class="
                        block
                        mt-1
                        text-lg
                        text-slate-300
                    ">

                        ${unanswered}

                    </strong>

                </div>


                <div>

                    <span class="
                        block
                        text-[8px]
                        uppercase
                        font-black
                        tracking-wider
                        text-slate-600
                    ">

                        Ditandai

                    </span>


                    <strong class="
                        block
                        mt-1
                        text-lg
                        text-amber-400
                    ">

                        ${marked}

                    </strong>

                </div>

            </div>

        `,


        actionLabel:
            'Ya, Selesaikan',


        actionClass:
            'bg-red-600 hover:bg-red-500 text-white',


        action: () =>
            finalizeExam(false)

    });

}


// =========================================================
// OPEN CONFIRM MODAL
// =========================================================

function openConfirmModal(
    config
) {

    const modal =
        document.getElementById(
            'exam-confirm-modal'
        );


    const title =
        document.getElementById(
            'confirm-modal-title'
        );


    const description =
        document.getElementById(
            'confirm-modal-description'
        );


    const summary =
        document.getElementById(
            'confirm-modal-summary'
        );


    const actionButton =
        document.getElementById(
            'confirm-modal-action'
        );


    const icon =
        document.getElementById(
            'confirm-modal-icon'
        );


    if (
        !modal ||
        !title ||
        !description ||
        !summary ||
        !actionButton ||
        !icon
    ) return;


    title.textContent =
        config.title;


    description.textContent =
        config.description;


    // =====================================================
    // SUMMARY
    // =====================================================

    if (
        config.summary
    ) {

        summary.innerHTML =
            config.summary;


        summary.classList.remove(
            'hidden'
        );

    }

    else {

        summary.innerHTML =
            '';


        summary.classList.add(
            'hidden'
        );

    }


    // =====================================================
    // ICON
    // =====================================================

    icon.className =
        'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-red-500/10 border border-red-500/20 text-red-400';


    icon.innerHTML =
        config.type === 'submit'

            ? `

                <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >

                    <path
                        d="M5 5v14"
                    />

                    <path
                        d="M5 5h11l-2 4 2 4H5"
                    />

                </svg>

            `

            : `

                <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >

                    <path
                        d="M10 17l5-5-5-5"
                    />

                    <path
                        d="M15 12H3"
                    />

                    <path
                        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                    />

                </svg>

            `;


    // =====================================================
    // ACTION BUTTON
    // =====================================================

    actionButton.textContent =
        config.actionLabel;


    actionButton.className =
        `px-5 py-2.5 rounded-xl text-xs font-black transition ${config.actionClass}`;


    actionButton.onclick =
        () => {

            closeConfirmModal();

            config.action();

        };


    // =====================================================
    // SHOW MODAL
    // =====================================================

    modal.classList.remove(
        'hidden'
    );


    modal.classList.add(
        'flex'
    );


    document.body.classList.add(
        'overflow-hidden'
    );

}


// =========================================================
// CLOSE CONFIRM MODAL
// =========================================================

function closeConfirmModal() {

    const modal =
        document.getElementById(
            'exam-confirm-modal'
        );


    if (
        !modal
    ) return;


    modal.classList.add(
        'hidden'
    );


    modal.classList.remove(
        'flex'
    );


    document.body.classList.remove(
        'overflow-hidden'
    );

}


// =========================================================
// COMPATIBILITY
// =========================================================

// Jika kode lama masih memanggil submitExam()
// arahkan ke confirmation modal.

function submitExam() {

    requestSubmitExam();

}


// =========================================================
// FINALIZE EXAM + FIRESTORE
// =========================================================

function finalizeExam(
    autoSubmit = false
) {

    if (
        isExamFinished
    ) return;


    isExamFinished =
        true;


    // =====================================================
    // STOP TIMER
    // =====================================================

    if (
        timerInterval
    ) {

        clearInterval(
            timerInterval
        );


        timerInterval =
            null;

    }


    // =====================================================
    // HITUNG JAWABAN BENAR
    // =====================================================

    const correctAnswers =
        currentQuestions.reduce(

            (
                total,
                q,
                idx
            ) => {

                return total + (
                    userAnswers[idx] ===
                    q.answer
                        ? 1
                        : 0
                );

            },

            0
        );


    // =====================================================
    // HITUNG NILAI 0 - 100
    // =====================================================

    const score =
        currentQuestions.length

            ? Math.round(

                (
                    correctAnswers /
                    currentQuestions.length

                ) * 100

            )

            : 0;


    const answered =
        Object.keys(
            userAnswers
        ).length;


    clearSavedProgress();


    // =====================================================
    // USER LOGIN OPSIONAL
    // =====================================================

    const currentUser =
        (
            typeof auth !==
            'undefined'
        )
            ? auth.currentUser
            : null;


    // =====================================================
    // SIMPAN LEADERBOARD JIKA USER SUDAH LOGIN
    // =====================================================

    if (

        currentUser &&

        typeof db !==
            'undefined' &&

        typeof firebase !==
            'undefined'

    ) {

        db.collection(
            'leaderboard'
        )
            .add({

                name:
                    currentUser.displayName ||
                    'Peserta Anonim',

                email:
                    currentUser.email ||
                    '',

                photoURL:
                    currentUser.photoURL ||
                    '',

                score:
                    score,

                category:
                    selectedCategory.toUpperCase(),

                timestamp:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp()

            })

            .then(
                () => {

                    showResultScreen(

                        score,

                        correctAnswers,

                        answered,

                        autoSubmit

                    );

                }
            )

            .catch(
                (err) => {

                    console.error(
                        'Gagal menyimpan skor:',
                        err
                    );


                    showResultScreen(

                        score,

                        correctAnswers,

                        answered,

                        autoSubmit,

                        true

                    );

                }
            );

    }


    // =====================================================
    // USER GUEST — NILAI TETAP DITAMPILKAN
    // =====================================================

    else {

        showResultScreen(

            score,

            correctAnswers,

            answered,

            autoSubmit

        );

    }

}


// =========================================================
// RESULT SCREEN
// =========================================================

function showResultScreen(

    score,

    correctAnswers,

    answered,

    autoSubmit = false,

    saveFailed = false

) {

    const quizCard =
        document.getElementById(
            'quiz-card'
        );


    const total =
        currentQuestions.length;


    quizCard.innerHTML = `

        <div class="
            flex-1
            flex
            items-center
            justify-center
            p-5
            sm:p-8
        ">

            <div class="
                w-full
                max-w-2xl
                text-center
            ">


                <!-- RESULT ICON -->

                <div class="
                    w-16
                    h-16

                    sm:w-20
                    sm:h-20

                    bg-emerald-500/10
                    text-emerald-400

                    border
                    border-emerald-500/20

                    rounded-3xl

                    flex
                    items-center
                    justify-center

                    mx-auto

                    shadow-xl
                    shadow-emerald-950/10
                ">

                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                    >

                        <path
                            d="M8 21h8"
                        />

                        <path
                            d="M12 17v4"
                        />

                        <path
                            d="M7 4h10"
                        />

                        <path
                            d="M5 4v5a7 7 0 0 0 14 0V4"
                        />

                        <path
                            d="M5 8H3a2 2 0 0 0 0 4h2"
                        />

                        <path
                            d="M19 8h2a2 2 0 0 1 0 4h-2"
                        />

                    </svg>

                </div>



                <!-- TITLE -->

                <h2 class="
                    mt-6

                    text-2xl
                    sm:text-3xl

                    font-black

                    text-white

                    tracking-tight
                ">

                    ${
                        autoSubmit
                            ? 'Waktu Habis'
                            : 'Ujian Selesai!'
                    }

                </h2>



                <!-- RESULT DESCRIPTION -->

                <p class="
                    mt-2

                    text-xs
                    sm:text-sm

                    text-slate-400
                ">

                    ${
                        saveFailed

                            ? 'Nilai berhasil dihitung, tetapi penyimpanan ke papan peringkat mengalami kendala.'

                            : 'Hasil simulasi Anda telah dihitung dan diproses.'
                    }

                </p>



                <!-- RESULT CARDS -->

                <div class="
                    mt-7

                    grid
                    grid-cols-3
                    gap-3

                    max-w-lg
                    mx-auto
                ">


                    <!-- SCORE -->

                    <div class="
                        bg-slate-950/50

                        border
                        border-slate-800

                        rounded-2xl

                        p-4
                    ">

                        <span class="
                            text-[8px]
                            sm:text-[9px]

                            uppercase

                            font-black

                            tracking-wider

                            text-slate-600
                        ">

                            Nilai

                        </span>


                        <strong class="
                            block
                            mt-1

                            text-3xl
                            sm:text-4xl

                            font-black

                            text-emerald-400
                        ">

                            ${score}

                        </strong>

                    </div>



                    <!-- CORRECT ANSWERS -->

                    <div class="
                        bg-slate-950/50

                        border
                        border-slate-800

                        rounded-2xl

                        p-4
                    ">

                        <span class="
                            text-[8px]
                            sm:text-[9px]

                            uppercase

                            font-black

                            tracking-wider

                            text-slate-600
                        ">

                            Benar

                        </span>


                        <strong class="
                            block
                            mt-1

                            text-2xl
                            sm:text-3xl

                            font-black

                            text-white
                        ">

                            ${correctAnswers}

                        </strong>

                    </div>



                    <!-- ANSWERED -->

                    <div class="
                        bg-slate-950/50

                        border
                        border-slate-800

                        rounded-2xl

                        p-4
                    ">

                        <span class="
                            text-[8px]
                            sm:text-[9px]

                            uppercase

                            font-black

                            tracking-wider

                            text-slate-600
                        ">

                            Terjawab

                        </span>


                        <strong class="
                            block
                            mt-1

                            text-2xl
                            sm:text-3xl

                            font-black

                            text-white
                        ">

                            ${answered}/${total}

                        </strong>

                    </div>

                </div>



                <!-- BUTTONS -->

                <div class="
                    mt-7

                    flex
                    flex-col
                    sm:flex-row

                    gap-3

                    justify-center
                ">


                    <a
                        href="leaderboard.html"

                        class="
                            bg-blue-600
                            hover:bg-blue-500

                            text-white

                            font-black

                            text-xs
                            sm:text-sm

                            px-6
                            py-3

                            rounded-xl

                            shadow-lg
                            shadow-blue-600/20

                            transition
                        "
                    >

                        Lihat Papan Peringkat

                    </a>


                    <a
                        href="index.html"

                        class="
                            bg-slate-800
                            hover:bg-slate-700

                            text-slate-300

                            font-bold

                            text-xs
                            sm:text-sm

                            px-6
                            py-3

                            rounded-xl

                            border
                            border-slate-700

                            transition
                        "
                    >

                        Kembali ke Beranda

                    </a>

                </div>

            </div>

        </div>

    `;

}


// =========================================================
// AUTOSAVE
// =========================================================

function getStorageKey() {

    const uid = (

        typeof auth !==
            'undefined' &&

        auth.currentUser &&

        auth.currentUser.uid

    )
        ? auth.currentUser.uid
        : 'guest';


    return `ruangtryout_exam_${selectedCategory}_${uid}`;

}


// =========================================================
// SAVE PROGRESS
// =========================================================

function persistProgress() {

    if (

        !quizStarted ||

        isExamFinished ||

        !currentQuestions.length

    ) return;


    try {

        localStorage.setItem(

            getStorageKey(),

            JSON.stringify({

                category:
                    selectedCategory,

                currentIndex:
                    currentIndex,

                userAnswers:
                    userAnswers,

                markedQuestions:
                    Array.from(
                        markedQuestions
                    ),

                timeRemaining:
                    timeRemaining,

                questionsLength:
                    currentQuestions.length,

                savedAt:
                    Date.now()

            })

        );

    }

    catch (err) {

        console.warn(
            'Gagal menyimpan progres lokal:',
            err
        );

    }

}


// =========================================================
// LOAD SAVED PROGRESS
// =========================================================

function loadSavedProgress() {

    try {

        const raw =
            localStorage.getItem(
                getStorageKey()
            );


        return raw
            ? JSON.parse(raw)
            : null;

    }

    catch (err) {

        console.warn(
            'Gagal membaca progres lokal:',
            err
        );


        return null;

    }

}


// =========================================================
// CLEAR SAVED PROGRESS
// =========================================================

function clearSavedProgress() {

    try {

        localStorage.removeItem(
            getStorageKey()
        );

    }

    catch (err) {

        console.warn(
            'Gagal menghapus progres lokal:',
            err
        );

    }

}


// =========================================================
// KEYBOARD SHORTCUTS
// =========================================================

function handleExamKeyboard(
    event
) {

    if (

        !quizStarted ||

        isExamFinished ||

        !document.getElementById(
            'question-text'
        )

    ) return;


    // =====================================================
    // MODAL TERBUKA
    // =====================================================

    const modal =
        document.getElementById(
            'exam-confirm-modal'
        );


    if (

        modal &&

        !modal.classList.contains(
            'hidden'
        )

    ) {

        if (
            event.key ===
            'Escape'
        ) {

            closeConfirmModal();

        }


        return;

    }


    // =====================================================
    // IGNORE CTRL / ALT / CMD
    // =====================================================

    if (

        event.ctrlKey ||

        event.metaKey ||

        event.altKey

    ) return;


    const key =
        event.key.toLowerCase();


    const q =
        currentQuestions[
            currentIndex
        ];


    // =====================================================
    // A / B / C / D
    // =====================================================

    if (

        [
            'a',
            'b',
            'c',
            'd'
        ].includes(key) &&

        q

    ) {

        const optionIndex =
            key.charCodeAt(0) - 97;


        if (
            optionIndex <
            q.options.length
        ) {

            event.preventDefault();


            selectOption(
                optionIndex
            );

        }


        return;

    }


    // =====================================================
    // LEFT ARROW
    // =====================================================

    if (
        event.key ===
        'ArrowLeft'
    ) {

        event.preventDefault();


        navigateQuestion(
            -1
        );

    }


    // =====================================================
    // RIGHT ARROW
    // =====================================================

    else if (
        event.key ===
        'ArrowRight'
    ) {

        event.preventDefault();


        navigateQuestion(
            1
        );

    }


    // =====================================================
    // M — MARK
    // =====================================================

    else if (
        key === 'm'
    ) {

        event.preventDefault();


        toggleMarkCurrent();

    }

}


// =========================================================
// HELPERS
// =========================================================

function requestExitFallback() {

    window.location.href =
        'index.html';

}


// =========================================================
// SET TEXT
// =========================================================

function setText(
    id,
    value
) {

    const el =
        document.getElementById(
            id
        );


    if (el) {

        el.textContent =
            value;

    }

}


// =========================================================
// CLAMP
// =========================================================

function clamp(
    value,
    min,
    max
) {

    return Math.min(

        Math.max(
            value,
            min
        ),

        max

    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            '&',
            '&amp;'
        )

        .replaceAll(
            '<',
            '&lt;'
        )

        .replaceAll(
            '>',
            '&gt;'
        )

        .replaceAll(
            '"',
            '&quot;'
        )

        .replaceAll(
            "'",
            '&#039;'
        );

}
