// =========================================================
// RUANG TRYOUT
// APP.JS
//
// Single-screen CAT simulation
// No mandatory login
//
// Features:
// - Timer
// - Answer navigation
// - Large 10-column question grid
// - Review / marked questions
// - Progress indicator
// - Autosave
// - Resume unfinished exam
// - Keyboard shortcuts
// - Confirmation dialogs
// - Participant name popup
// - Guest leaderboard submission
// - Firebase Firestore leaderboard
// =========================================================



// =========================================================
// URL PARAMETERS
// =========================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const selectedCategory =
    (
        urlParams.get('cat') ||
        'cpns'
    ).toLowerCase();



// =========================================================
// APPLICATION STATE
// =========================================================

let currentQuestions = [];

let currentIndex = 0;

let userAnswers = {};

let markedQuestions =
    new Set();

let timerInterval = null;

let timeRemaining =
    90 * 60;

let quizStarted = false;

let isExamFinished = false;


// Hasil ujian disimpan sementara
// sampai peserta memasukkan nama.

let pendingExamResult = null;


const EXAM_DURATION_SECONDS =
    90 * 60;



// =========================================================
// BOOT
// =========================================================

document.addEventListener(
    'DOMContentLoaded',

    () => {


        // Keyboard navigation

        document.addEventListener(
            'keydown',
            handleExamKeyboard
        );



        // Autosave ketika reload / keluar

        window.addEventListener(
            'beforeunload',
            persistProgress
        );



        // Adaptasi viewport

        window.addEventListener(
            'resize',

            () => {

                if (
                    quizStarted &&
                    !isExamFinished
                ) {

                    fitQuestionToViewport();

                }

            }
        );



        // Langsung mulai.
        // Login tidak diperlukan.

        startQuizProcess();

    }
);



// =========================================================
// SYSTEM ERROR
// =========================================================

function showSystemError(
    message
) {

    const quizCard =
        document.getElementById(
            'quiz-card'
        );


    if (!quizCard) {

        return;

    }


    quizCard.innerHTML = `

        <div
            class="
                flex-1
                flex
                items-center
                justify-center
                p-8
                text-center
            "
        >

            <div>

                <div
                    class="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        text-red-400
                        flex
                        items-center
                        justify-center
                    "
                >

                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >

                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        />

                        <path
                            d="M12 8v5"
                        />

                        <path
                            d="M12 16h.01"
                        />

                    </svg>

                </div>


                <p
                    class="
                        mt-5
                        text-lg
                        font-black
                        text-white
                    "
                >

                    Terjadi kendala

                </p>


                <p
                    class="
                        mt-2
                        max-w-md
                        text-sm
                        text-slate-400
                    "
                >

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
// LOAD QUESTIONS
// =========================================================

function startQuizProcess() {

    quizStarted = true;


    const catKey =
        selectedCategory;



    // =====================================================
    // FORMAT: quizCategories
    // =====================================================

    if (
        typeof quizCategories !==
            'undefined' &&

        quizCategories[catKey]
    ) {

        currentQuestions =
            quizCategories[
                catKey
            ].questions || [];

    }



    // =====================================================
    // FORMAT: questionsData
    // =====================================================

    else if (
        typeof questionsData !==
            'undefined' &&

        questionsData[catKey]
    ) {

        currentQuestions =
            questionsData[
                catKey
            ] || [];

    }



    // =====================================================
    // FORMAT: questions
    // =====================================================

    else if (
        typeof questions !==
        'undefined'
    ) {

        currentQuestions =
            Array.isArray(
                questions
            )

                ? questions

                : (
                    questions[
                        catKey
                    ] || []
                );

    }



    else {

        currentQuestions = [];

    }



    // =====================================================
    // VALIDATE QUESTIONS
    // =====================================================

    if (
        !currentQuestions.length
    ) {

        showSystemError(

            `Soal untuk kategori "${selectedCategory.toUpperCase()}" tidak ditemukan.`

        );

        return;

    }



    // =====================================================
    // CHECK SAVED EXAM
    // =====================================================

    const saved =
        loadSavedProgress();


    const canResume =

        saved &&

        saved.category ===
            selectedCategory &&

        Number(
            saved.questionsLength
        ) ===
            currentQuestions.length &&

        Number(
            saved.timeRemaining
        ) > 0 &&

        Number(
            saved.timeRemaining
        ) <=
            EXAM_DURATION_SECONDS;



    if (
        canResume &&
        hasMeaningfulProgress(
            saved
        )
    ) {

        showResumeScreen(
            saved
        );

    }

    else {

        startFreshQuiz();

    }

}



// =========================================================
// CHECK MEANINGFUL PROGRESS
// =========================================================

function hasMeaningfulProgress(
    saved
) {

    const answerCount =
        saved.userAnswers

            ? Object.keys(
                saved.userAnswers
            ).length

            : 0;


    return (

        answerCount > 0 ||

        Number(
            saved.currentIndex
        ) > 0 ||

        Number(
            saved.timeRemaining
        ) <
            EXAM_DURATION_SECONDS - 5 ||

        (
            Array.isArray(
                saved.markedQuestions
            ) &&

            saved.markedQuestions.length >
                0
        )

    );

}



// =========================================================
// RESUME SCREEN
// =========================================================

function showResumeScreen(
    saved
) {

    const quizCard =
        document.getElementById(
            'quiz-card'
        );


    if (!quizCard) {

        return;

    }


    const answered =
        saved.userAnswers

            ? Object.keys(
                saved.userAnswers
            ).length

            : 0;


    const mins =
        Math.floor(
            Number(
                saved.timeRemaining
            ) / 60
        );


    const secs =
        Number(
            saved.timeRemaining
        ) % 60;



    quizCard.innerHTML = `

        <div
            class="
                flex-1
                flex
                items-center
                justify-center
                p-6
            "
        >

            <div
                class="
                    w-full
                    max-w-xl
                    bg-slate-950/40
                    border
                    border-slate-800
                    rounded-3xl
                    p-6
                    sm:p-8
                    text-center
                "
            >

                <div
                    class="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-amber-500/10
                        border
                        border-amber-500/20
                        text-amber-400
                        flex
                        items-center
                        justify-center
                    "
                >

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



                <h2
                    class="
                        mt-5
                        text-2xl
                        font-black
                        text-white
                    "
                >

                    Ujian Belum Selesai

                </h2>



                <p
                    class="
                        mt-2
                        text-sm
                        text-slate-400
                    "
                >

                    Kami menemukan progres ujian sebelumnya pada perangkat ini.

                </p>



                <div
                    class="
                        mt-6
                        grid
                        grid-cols-3
                        gap-3
                    "
                >

                    <div
                        class="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-4
                        "
                    >

                        <span
                            class="
                                text-[9px]
                                uppercase
                                font-black
                                tracking-wider
                                text-slate-500
                            "
                        >

                            Terjawab

                        </span>


                        <strong
                            class="
                                block
                                mt-1
                                text-xl
                                text-white
                            "
                        >

                            ${answered}

                        </strong>

                    </div>



                    <div
                        class="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-4
                        "
                    >

                        <span
                            class="
                                text-[9px]
                                uppercase
                                font-black
                                tracking-wider
                                text-slate-500
                            "
                        >

                            Soal

                        </span>


                        <strong
                            class="
                                block
                                mt-1
                                text-xl
                                text-white
                            "
                        >

                            ${
                                Number(
                                    saved.currentIndex
                                ) + 1
                            }

                        </strong>

                    </div>



                    <div
                        class="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-4
                        "
                    >

                        <span
                            class="
                                text-[9px]
                                uppercase
                                font-black
                                tracking-wider
                                text-slate-500
                            "
                        >

                            Waktu

                        </span>


                        <strong
                            class="
                                block
                                mt-1
                                text-xl
                                text-amber-400
                                font-mono
                            "
                        >

                            ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}

                        </strong>

                    </div>

                </div>



                <div
                    class="
                        mt-7
                        flex
                        flex-col
                        sm:flex-row
                        justify-center
                        gap-3
                    "
                >

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
                            shadow-lg
                            shadow-blue-600/20
                            transition
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
// RESUME QUIZ
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

            Number(
                saved.currentIndex
            ) || 0,

            0,

            currentQuestions.length -
                1

        );


    userAnswers =
        saved.userAnswers ||
        {};


    markedQuestions =
        new Set(

            (
                saved.markedQuestions ||
                []
            ).map(Number)

        );


    timeRemaining =
        clamp(

            Number(
                saved.timeRemaining
            ) ||
            EXAM_DURATION_SECONDS,

            1,

            EXAM_DURATION_SECONDS

        );


    isExamFinished =
        false;


    pendingExamResult =
        null;


    renderQuizLayout();


    loadQuestion(
        currentIndex
    );


    startTimer();

}



// =========================================================
// FRESH QUIZ
// =========================================================

function startFreshQuiz() {

    clearSavedProgress();


    currentIndex = 0;


    userAnswers = {};


    markedQuestions =
        new Set();


    timeRemaining =
        EXAM_DURATION_SECONDS;


    isExamFinished =
        false;


    pendingExamResult =
        null;


    renderQuizLayout();


    loadQuestion(0);


    startTimer();

}



// =========================================================
// RENDER FULL EXAM
// =========================================================

function renderQuizLayout() {

    const quizCard =
        document.getElementById(
            'quiz-card'
        );


    if (!quizCard) {

        return;

    }



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
        categoryData &&
        categoryData.title

            ? categoryData.title

            : (
                selectedCategory ===
                'cpns'

                    ? 'CPNS & PPPK'

                    : selectedCategory ===
                        'utbk'

                        ? 'UTBK / SNBT'

                        : selectedCategory
                            .toUpperCase()
            );



    quizCard.innerHTML = `


        <!-- =================================================
             EXAM TOP BAR
        ================================================== -->

        <div
            class="
                bg-slate-900
                border-b
                border-slate-800
                px-4
                sm:px-5
                py-2.5
                flex
                items-center
                justify-between
                gap-4
                shrink-0
            "
        >


            <div class="min-w-0">

                <div
                    class="
                        flex
                        items-center
                        flex-wrap
                        gap-2
                        mb-0.5
                    "
                >

                    <span
                        class="
                            text-[9px]
                            sm:text-[10px]
                            font-black
                            text-blue-400
                            uppercase
                            tracking-[0.14em]
                            truncate
                            max-w-[240px]
                            sm:max-w-none
                        "
                    >

                        ${escapeHtml(categoryTitle)}

                    </span>



                    <span
                        id="question-section-label"

                        class="
                            inline-flex
                            px-2
                            py-0.5
                            rounded-md
                            bg-slate-800
                            border
                            border-slate-700
                            text-[8px]
                            font-black
                            text-slate-400
                            uppercase
                            tracking-wider
                        "
                    ></span>

                </div>



                <div
                    class="
                        flex
                        items-baseline
                        gap-2
                    "
                >

                    <h2
                        id="question-number-title"

                        class="
                            text-sm
                            sm:text-base
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
                            text-[10px]
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
                    sm:min-w-[105px]
                    bg-slate-800/80
                    border
                    border-slate-700
                    px-3
                    py-1.5
                    rounded-xl
                    text-right
                    transition-colors
                    shrink-0
                "
            >

                <span
                    class="
                        text-[7px]
                        sm:text-[8px]
                        text-slate-500
                        block
                        uppercase
                        tracking-wider
                        font-black
                    "
                >

                    Sisa Waktu

                </span>


                <span
                    id="timer-display"

                    class="
                        text-sm
                        sm:text-base
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

        <div
            class="
                relative
                flex-1
                min-h-0
                flex
                overflow-hidden
            "
        >


            <!-- =================================================
                 QUESTION PANEL
            ================================================== -->

            <section
                id="question-panel"

                class="
                    flex-1
                    min-w-0
                    overflow-hidden
                "
            >

                <div
                    id="question-content"

                    class="
                        exam-question-content
                        h-full
                        w-full
                        max-w-none
                        mx-0
                        px-5
                        sm:px-6
                        lg:px-6
                        xl:px-7
                        py-3
                        flex
                        flex-col
                    "
                >


                    <!-- QUESTION -->

                    <div
                        class="
                            exam-question-block
                            mb-3
                            shrink-0
                        "
                    >

                        <p
                            class="
                                text-[8px]
                                uppercase
                                tracking-[0.18em]
                                font-black
                                text-slate-500
                                mb-1.5
                            "
                        >

                            Pertanyaan

                        </p>


                        <div
                            id="question-text"

                            class="
                                exam-question-text
                                text-[13px]
                                sm:text-sm
                                xl:text-[15px]
                                text-slate-100
                                leading-6
                                font-semibold
                            "
                        ></div>

                    </div>



                    <!-- OPTIONS -->

                    <div
                        id="options-container"

                        class="
                            exam-options
                            space-y-2.5
                            shrink-0
                        "
                    ></div>



                    <!-- =================================================
                         ACTIONS
                    ================================================== -->

                    <div
                        class="
                            exam-actions
                            mt-4
                            pt-3
                            border-t
                            border-slate-800/80
                            shrink-0
                        "
                    >


                        <div
                            class="
                                grid
                                grid-cols-3
                                gap-2.5
                                items-center
                            "
                        >


                            <!-- PREVIOUS -->

                            <button
                                id="prev-btn"

                                type="button"

                                onclick="navigateQuestion(-1)"

                                class="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    bg-slate-800
                                    hover:bg-slate-700
                                    disabled:hover:bg-slate-800
                                    text-slate-300
                                    text-[10px]
                                    sm:text-xs
                                    font-bold
                                    px-2
                                    sm:px-4
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-700
                                    transition
                                    disabled:opacity-30
                                    disabled:cursor-not-allowed
                                "
                            >

                                <svg
                                    width="13"
                                    height="13"
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


                                <span>

                                    Sebelumnya

                                </span>

                            </button>



                            <!-- FINISH -->

                            <button
                                type="button"

                                onclick="requestSubmitExam()"

                                class="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    bg-red-500/10
                                    hover:bg-red-500/15
                                    text-red-400
                                    hover:text-red-300
                                    border
                                    border-red-500/30
                                    text-[10px]
                                    sm:text-xs
                                    font-black
                                    px-2
                                    sm:px-4
                                    py-2.5
                                    rounded-xl
                                    transition-all
                                "
                            >

                                <svg
                                    class="hidden sm:block"
                                    width="13"
                                    height="13"
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


                                <span>

                                    Selesaikan Ujian

                                </span>

                            </button>



                            <!-- NEXT -->

                            <button
                                id="next-btn"

                                type="button"

                                onclick="navigateQuestion(1)"

                                class="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    bg-blue-600
                                    hover:bg-blue-500
                                    disabled:hover:bg-blue-600
                                    text-white
                                    text-[10px]
                                    sm:text-xs
                                    font-black
                                    px-2
                                    sm:px-4
                                    py-2.5
                                    rounded-xl
                                    shadow-lg
                                    shadow-blue-950/20
                                    transition
                                    disabled:opacity-30
                                    disabled:cursor-not-allowed
                                "
                            >

                                <span>

                                    Selanjutnya

                                </span>


                                <svg
                                    width="13"
                                    height="13"
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



                        <!-- MARK + KEYBOARD INFO -->

                        <div
                            class="
                                mt-2.5
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >

                            <button
                                id="mark-question-btn"

                                type="button"

                                onclick="toggleMarkCurrent()"

                                class="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-slate-800/70
                                    hover:bg-slate-800
                                    border
                                    border-slate-700
                                    text-[10px]
                                    font-bold
                                    text-slate-300
                                    transition-all
                                "
                            >

                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
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



                            <div
                                class="
                                    hidden
                                    xl:flex
                                    items-center
                                    gap-1.5
                                    text-[8px]
                                    font-semibold
                                    text-slate-600
                                "
                            >

                                <span
                                    class="
                                        px-1.5
                                        py-1
                                        rounded-md
                                        border
                                        border-slate-800
                                        bg-slate-950/50
                                    "
                                >

                                    A–D jawab

                                </span>


                                <span
                                    class="
                                        px-1.5
                                        py-1
                                        rounded-md
                                        border
                                        border-slate-800
                                        bg-slate-950/50
                                    "
                                >

                                    ← → pindah

                                </span>


                                <span
                                    class="
                                        px-1.5
                                        py-1
                                        rounded-md
                                        border
                                        border-slate-800
                                        bg-slate-950/50
                                    "
                                >

                                    M tandai

                                </span>

                            </div>

                        </div>

                    </div>



                    <!-- =================================================
                         MOBILE PROGRESS
                    ================================================== -->

                    <div
                        class="
                            lg:hidden
                            mt-auto
                            pt-2
                            shrink-0
                        "
                    >

                        <div
                            class="
                                bg-slate-950/50
                                border
                                border-slate-800
                                rounded-xl
                                px-3
                                py-2
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                class="
                                    flex-1
                                    min-w-0
                                "
                            >

                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-between
                                        gap-2
                                    "
                                >

                                    <p
                                        id="mobile-progress-text"

                                        class="
                                            text-[9px]
                                            font-bold
                                            text-slate-300
                                            truncate
                                        "
                                    >

                                        0/${currentQuestions.length} terjawab

                                    </p>


                                    <span
                                        class="
                                            text-[8px]
                                            text-slate-600
                                        "
                                    >

                                        Progres

                                    </span>

                                </div>



                                <div
                                    class="
                                        mt-1.5
                                        h-1
                                        bg-slate-800
                                        rounded-full
                                        overflow-hidden
                                    "
                                >

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



                            <button
                                type="button"

                                onclick="openQuestionDrawer()"

                                class="
                                    shrink-0
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    bg-blue-600
                                    hover:bg-blue-500
                                    text-white
                                    text-[9px]
                                    font-black
                                    px-3
                                    py-2
                                    rounded-lg
                                    transition
                                "
                            >

                                Nomor Soal

                            </button>

                        </div>

                    </div>

                </div>

            </section>



            <!-- =================================================
                 MOBILE OVERLAY
            ================================================== -->

            <button
                id="question-drawer-overlay"

                type="button"

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
                 SIDEBAR
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

                    w-[94vw]

                    max-w-lg

                    lg:w-[430px]

                    xl:w-[500px]

                    2xl:w-[540px]

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

                    overflow-hidden
                "
            >


                <!-- MOBILE SIDEBAR HEADER -->

                <div
                    class="
                        lg:hidden
                        h-12
                        px-4
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-800
                        shrink-0
                    "
                >

                    <div>

                        <p
                            class="
                                text-[11px]
                                font-black
                                text-white
                            "
                        >

                            Daftar Soal

                        </p>


                        <p
                            class="
                                mt-0.5
                                text-[8px]
                                text-slate-500
                            "
                        >

                            Pilih nomor soal

                        </p>

                    </div>


                    <button
                        type="button"

                        onclick="closeQuestionDrawer()"

                        class="
                            w-8
                            h-8
                            rounded-lg
                            bg-slate-900
                            border
                            border-slate-800
                            text-slate-400
                            flex
                            items-center
                            justify-center
                        "
                    >

                        ✕

                    </button>

                </div>



                <!-- =================================================
                     SIDEBAR BODY
                ================================================== -->

                <div
                    class="
                        flex-1
                        min-h-0
                        px-4
                        xl:px-5
                        py-3
                        flex
                        flex-col
                        overflow-hidden
                    "
                >

                    <!-- PROGRESS -->

                    <div class="shrink-0">

                        <div
                            class="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >

                            <div
                                class="
                                    flex
                                    items-baseline
                                    gap-2
                                "
                            >

                                <span
                                    class="
                                        text-[9px]
                                        xl:text-[10px]
                                        uppercase
                                        tracking-[0.15em]
                                        font-black
                                        text-slate-500
                                    "
                                >

                                    Progres

                                </span>



                                <strong
                                    id="answered-count-number"

                                    class="
                                        text-xl
                                        xl:text-2xl
                                        font-black
                                        text-white
                                    "
                                >

                                    0

                                </strong>



                                <span
                                    class="
                                        text-[10px]
                                        xl:text-xs
                                        font-semibold
                                        text-slate-500
                                    "
                                >

                                    / ${currentQuestions.length}

                                </span>

                            </div>



                            <span
                                id="progress-percent"

                                class="
                                    text-[10px]
                                    xl:text-xs
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



                        <!-- BAR -->

                        <div
                            class="
                                mt-2.5
                                h-1.5
                                bg-slate-800
                                rounded-full
                                overflow-hidden
                            "
                        >

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



                        <!-- COUNTERS -->

                        <div
                            class="
                                mt-3
                                grid
                                grid-cols-2
                                gap-2
                            "
                        >

                            <div
                                class="
                                    rounded-xl
                                    bg-slate-900
                                    border
                                    border-slate-800
                                    px-3
                                    py-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                "
                            >

                                <span
                                    class="
                                        text-[9px]
                                        xl:text-[10px]
                                        text-slate-500
                                        font-bold
                                    "
                                >

                                    Belum dijawab

                                </span>


                                <strong
                                    id="unanswered-count"

                                    class="
                                        text-sm
                                        text-slate-200
                                        font-black
                                    "
                                >

                                    ${currentQuestions.length}

                                </strong>

                            </div>



                            <div
                                class="
                                    rounded-xl
                                    bg-slate-900
                                    border
                                    border-slate-800
                                    px-3
                                    py-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                "
                            >

                                <span
                                    class="
                                        text-[9px]
                                        xl:text-[10px]
                                        text-slate-500
                                        font-bold
                                    "
                                >

                                    Ditandai

                                </span>


                                <strong
                                    id="marked-count"

                                    class="
                                        text-sm
                                        text-amber-400
                                        font-black
                                    "
                                >

                                    0

                                </strong>

                            </div>

                        </div>



                        <!-- LEGEND -->

                        <div
                            class="
                                mt-3
                                pt-2.5
                                border-t
                                border-slate-800
                                flex
                                items-center
                                flex-wrap
                                gap-x-4
                                gap-y-1.5
                                text-[9px]
                                xl:text-[10px]
                                text-slate-500
                            "
                        >

                            <span
                                class="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    class="
                                        w-2
                                        h-2
                                        rounded-sm
                                        bg-emerald-600
                                    "
                                ></span>

                                Dijawab

                            </span>



                            <span
                                class="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    class="
                                        w-2
                                        h-2
                                        rounded-sm
                                        bg-slate-800
                                        border
                                        border-slate-700
                                    "
                                ></span>

                                Belum

                            </span>



                            <span
                                class="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    class="
                                        w-2
                                        h-2
                                        rounded-sm
                                        bg-blue-600
                                        ring-1
                                        ring-blue-400/70
                                    "
                                ></span>

                                Aktif

                            </span>



                            <span
                                class="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    class="
                                        w-2
                                        h-2
                                        rounded-sm
                                        bg-amber-500
                                    "
                                ></span>

                                Ditandai

                            </span>

                        </div>

                    </div>



                    <!-- LARGE QUESTION GRID -->

                    <div
                        id="question-grid"

                        class="
                            mt-3
                            grid
                            grid-cols-10
                            gap-1.5
                            content-start
                            shrink-0
                        "
                    ></div>



                    <!-- SIDE FINISH -->

                    <button
                        type="button"

                        onclick="requestSubmitExam()"

                        class="
                            mt-3
                            w-full
                            shrink-0
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-red-500/10
                            hover:bg-red-500/15
                            text-red-400
                            hover:text-red-300
                            border
                            border-red-500/30
                            text-[10px]
                            xl:text-xs
                            font-black
                            px-3
                            py-2.5
                            rounded-xl
                            transition-all
                        "
                    >

                        ⚑ &nbsp; Selesaikan Ujian

                    </button>

                </div>

            </aside>

        </div>



        <!-- =================================================
             CONFIRM MODAL
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

            <div
                class="
                    w-full
                    max-w-md
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                "
            >

                <div
                    class="
                        p-6
                        sm:p-7
                    "
                >

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



                <div
                    class="
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
                    "
                >

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
// LOAD CURRENT QUESTION
// =========================================================

function loadQuestion(
    index
) {

    if (
        !currentQuestions.length
    ) {

        return;

    }



    currentIndex =
        clamp(

            index,

            0,

            currentQuestions.length -
                1

        );



    const q =
        currentQuestions[
            currentIndex
        ];



    setText(

        'question-number-title',

        `Soal ${String(currentIndex + 1).padStart(2, '0')}`

    );



    setText(

        'question-section-label',

        getQuestionSection(
            currentIndex
        )

    );



    const questionText =
        document.getElementById(
            'question-text'
        );


    if (questionText) {

        questionText.textContent =
            q.question || '';

    }



    const optionsContainer =
        document.getElementById(
            'options-container'
        );


    if (!optionsContainer) {

        return;

    }


    optionsContainer.innerHTML =
        '';



    const options =
        Array.isArray(
            q.options
        )

            ? q.options

            : [];



    options.forEach(
        (
            option,
            optionIndex
        ) => {


            const isSelected =
                Number(
                    userAnswers[
                        currentIndex
                    ]
                ) ===
                    optionIndex;



            const button =
                document.createElement(
                    'button'
                );


            button.type =
                'button';


            button.className = [

                'exam-option group w-full text-left px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl border transition-all duration-200 text-[11px] sm:text-xs lg:text-[13px] flex items-start gap-2.5',

                isSelected

                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-950/10 ring-1 ring-blue-500/20'

                    : 'bg-slate-800/55 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-blue-500/50 hover:text-white'

            ].join(' ');



            const letter =
                document.createElement(
                    'span'
                );


            letter.className = [

                'w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all',

                isSelected

                    ? 'bg-blue-600 text-white'

                    : 'bg-slate-700 text-slate-300 group-hover:bg-blue-500/15 group-hover:text-blue-300'

            ].join(' ');


            letter.textContent =
                String.fromCharCode(
                    65 +
                    optionIndex
                );



            const text =
                document.createElement(
                    'span'
                );


            text.className =
                'flex-1 leading-5 sm:leading-6 pt-0.5';


            text.textContent =
                option;



            button.appendChild(
                letter
            );


            button.appendChild(
                text
            );



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


                button.appendChild(
                    check
                );

            }



            button.onclick =
                () => {

                    selectOption(
                        optionIndex
                    );

                };


            optionsContainer.appendChild(
                button
            );

        }
    );



    const prev =
        document.getElementById(
            'prev-btn'
        );


    if (prev) {

        prev.disabled =
            currentIndex === 0;

    }



    const next =
        document.getElementById(
            'next-btn'
        );


    if (next) {

        next.disabled =
            currentIndex ===
            currentQuestions.length - 1;

    }



    updateMarkButton();


    renderQuestionGrid();


    persistProgress();


    fitQuestionToViewport();

}



// =========================================================
// QUESTION CATEGORY
// =========================================================

function getQuestionSection(
    index
) {

    if (
        selectedCategory ===
        'cpns'
    ) {

        if (index < 30) {

            return 'TWK';

        }


        if (index < 65) {

            return 'TIU';

        }


        return 'TKP';

    }



    if (
        selectedCategory ===
        'utbk'
    ) {

        if (index < 40) {

            return 'Penalaran & Kuantitatif';

        }


        return 'Literasi';

    }


    return 'Simulasi';

}



// =========================================================
// SELECT ANSWER
// =========================================================

function selectOption(
    optionIndex
) {

    userAnswers[
        currentIndex
    ] =
        optionIndex;


    loadQuestion(
        currentIndex
    );

}



// =========================================================
// NAVIGATE
// =========================================================

function navigateQuestion(
    delta
) {

    const destination =
        currentIndex +
        delta;


    if (
        destination < 0 ||
        destination >=
            currentQuestions.length
    ) {

        return;

    }


    loadQuestion(
        destination
    );

}



// =========================================================
// MARK CURRENT QUESTION
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

    const button =
        document.getElementById(
            'mark-question-btn'
        );


    const label =
        document.getElementById(
            'mark-question-label'
        );


    if (
        !button ||
        !label
    ) {

        return;

    }



    const marked =
        markedQuestions.has(
            currentIndex
        );



    if (marked) {

        button.className =
            'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-[10px] font-black text-amber-300 transition-all';


        label.textContent =
            'Ditandai untuk ditinjau';

    }

    else {

        button.className =
            'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 transition-all';


        label.textContent =
            'Tandai untuk ditinjau';

    }

}



// =========================================================
// QUESTION NUMBER GRID
// =========================================================

function renderQuestionGrid() {

    const grid =
        document.getElementById(
            'question-grid'
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        '';


    let answeredCount = 0;



    currentQuestions.forEach(
        (
            _,
            index
        ) => {


            const answered =
                userAnswers[index] !==
                undefined;


            const marked =
                markedQuestions.has(
                    index
                );


            const current =
                index ===
                currentIndex;



            if (answered) {

                answeredCount++;

            }



            const button =
                document.createElement(
                    'button'
                );


            button.type =
                'button';



            let className =

                'relative h-9 min-w-0 w-full rounded-lg text-[10px] sm:text-[11px] xl:text-xs font-black transition-all flex items-center justify-center border';



            if (current) {

                className +=

                    ' bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/60 shadow-lg shadow-blue-950/20';

            }


            else if (marked) {

                className +=

                    ' bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25';

            }


            else if (answered) {

                className +=

                    ' bg-emerald-600/90 text-white border-emerald-500 hover:bg-emerald-500';

            }


            else {

                className +=

                    ' bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-700';

            }



            button.className =
                className;


            button.textContent =
                index + 1;



            if (marked) {

                const dot =
                    document.createElement(
                        'span'
                    );


                dot.className =
                    'absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400';


                button.appendChild(
                    dot
                );

            }



            button.onclick =
                () => {

                    loadQuestion(
                        index
                    );


                    closeQuestionDrawer();

                };


            grid.appendChild(
                button
            );

        }
    );



    updateProgressUI(
        answeredCount
    );

}



// =========================================================
// PROGRESS
// =========================================================

function updateProgressUI(
    answeredCount
) {

    const total =
        currentQuestions.length;


    const unanswered =
        Math.max(

            0,

            total -
                answeredCount

        );


    const percentage =
        total > 0

            ? Math.round(

                (
                    answeredCount /
                    total
                ) *
                100

            )

            : 0;



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

        markedQuestions.size

    );


    setText(

        'progress-percent',

        `${percentage}%`

    );


    setText(

        'mobile-progress-text',

        `${answeredCount}/${total} terjawab`

    );



    const desktopBar =
        document.getElementById(
            'progress-bar'
        );


    if (desktopBar) {

        desktopBar.style.width =
            `${percentage}%`;

    }



    const mobileBar =
        document.getElementById(
            'mobile-progress-bar'
        );


    if (mobileBar) {

        mobileBar.style.width =
            `${percentage}%`;

    }

}



// =========================================================
// AUTO FIT QUESTION
// =========================================================

function fitQuestionToViewport() {

    const panel =
        document.getElementById(
            'question-panel'
        );


    const content =
        document.getElementById(
            'question-content'
        );


    if (
        !panel ||
        !content
    ) {

        return;

    }



    panel.classList.remove(

        'exam-compact',

        'exam-ultra-compact'

    );



    requestAnimationFrame(
        () => {


            if (
                content.scrollHeight >
                    panel.clientHeight
            ) {

                panel.classList.add(
                    'exam-compact'
                );

            }



            requestAnimationFrame(
                () => {


                    if (
                        content.scrollHeight >
                            panel.clientHeight
                    ) {

                        panel.classList.add(
                            'exam-ultra-compact'
                        );

                    }

                }
            );

        }
    );

}



// =========================================================
// MOBILE GRID DRAWER
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
    ) {

        return;

    }


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



function closeQuestionDrawer() {

    if (
        window.innerWidth >=
        1024
    ) {

        return;

    }


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
    ) {

        return;

    }


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

    if (timerInterval) {

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

                        timeRemaining -
                            1

                    );



                updateTimerDisplay();



                // Autosave setiap 5 detik

                if (
                    timeRemaining %
                        5 ===
                    0
                ) {

                    persistProgress();

                }



                // Waktu habis

                if (
                    timeRemaining <=
                    0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    timerInterval =
                        null;


                    finalizeExam(
                        true
                    );

                }

            },

            1000
        );

}



// =========================================================
// TIMER DISPLAY
// =========================================================

function updateTimerDisplay() {

    const display =
        document.getElementById(
            'timer-display'
        );


    const card =
        document.getElementById(
            'timer-card'
        );


    if (!display) {

        return;

    }



    const minutes =
        Math.floor(
            timeRemaining /
            60
        );


    const seconds =
        timeRemaining %
        60;



    display.textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;



    display.classList.remove(

        'text-emerald-400',

        'text-amber-400',

        'text-red-400',

        'animate-pulse'

    );



    if (card) {

        card.classList.remove(

            'border-emerald-500/30',

            'border-amber-500/30',

            'border-red-500/40',

            'bg-amber-500/5',

            'bg-red-500/5'

        );

    }



    // < 10 MENIT

    if (
        timeRemaining <=
        10 * 60
    ) {

        display.classList.add(
            'text-red-400'
        );


        if (
            timeRemaining <=
            5 * 60
        ) {

            display.classList.add(
                'animate-pulse'
            );

        }


        if (card) {

            card.classList.add(

                'border-red-500/40',

                'bg-red-500/5'

            );

        }

    }



    // 10 - 30 MENIT

    else if (
        timeRemaining <=
        30 * 60
    ) {

        display.classList.add(
            'text-amber-400'
        );


        if (card) {

            card.classList.add(

                'border-amber-500/30',

                'bg-amber-500/5'

            );

        }

    }



    // NORMAL

    else {

        display.classList.add(
            'text-emerald-400'
        );


        if (card) {

            card.classList.add(
                'border-emerald-500/30'
            );

        }

    }

}



// =========================================================
// EXIT
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

        type:
            'exit',


        title:
            'Keluar dari ujian?',


        description:
            'Progres ujian akan tetap disimpan di perangkat ini sehingga dapat dilanjutkan kembali.',


        actionLabel:
            'Keluar Ujian',


        actionClass:
            'bg-red-600 hover:bg-red-500 text-white',


        action:
            () => {

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
    ) {

        return;

    }



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

                ? `Masih ada ${unanswered} soal yang belum dijawab. Pastikan jawaban Anda sudah final.`

                : 'Semua soal sudah dijawab. Pastikan jawaban Anda sudah final sebelum menyelesaikan ujian.',



        summary: `

            <div
                class="
                    grid
                    grid-cols-3
                    gap-3
                    text-center
                "
            >

                <div>

                    <span
                        class="
                            block
                            text-[8px]
                            uppercase
                            font-black
                            tracking-wider
                            text-slate-600
                        "
                    >

                        Terjawab

                    </span>


                    <strong
                        class="
                            block
                            mt-1
                            text-lg
                            text-emerald-400
                        "
                    >

                        ${answered}

                    </strong>

                </div>



                <div>

                    <span
                        class="
                            block
                            text-[8px]
                            uppercase
                            font-black
                            tracking-wider
                            text-slate-600
                        "
                    >

                        Belum

                    </span>


                    <strong
                        class="
                            block
                            mt-1
                            text-lg
                            text-slate-300
                        "
                    >

                        ${unanswered}

                    </strong>

                </div>



                <div>

                    <span
                        class="
                            block
                            text-[8px]
                            uppercase
                            font-black
                            tracking-wider
                            text-slate-600
                        "
                    >

                        Ditandai

                    </span>


                    <strong
                        class="
                            block
                            mt-1
                            text-lg
                            text-amber-400
                        "
                    >

                        ${marked}

                    </strong>

                </div>

            </div>
        `,


        actionLabel:
            'Ya, Selesaikan',


        actionClass:
            'bg-red-600 hover:bg-red-500 text-white',


        action:
            () => {

                finalizeExam(
                    false
                );

            }

    });

}



// =========================================================
// CONFIRM MODAL
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


    const action =
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
        !action ||
        !icon
    ) {

        return;

    }



    title.textContent =
        config.title;


    description.textContent =
        config.description;



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



    icon.className =
        'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-red-500/10 border border-red-500/20 text-red-400';



    icon.innerHTML = `

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
    `;



    action.textContent =
        config.actionLabel;


    action.className =
        `px-5 py-2.5 rounded-xl text-xs font-black transition ${config.actionClass}`;



    action.onclick =
        () => {

            closeConfirmModal();


            config.action();

        };



    modal.classList.remove(
        'hidden'
    );


    modal.classList.add(
        'flex'
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


    if (!modal) {

        return;

    }


    modal.classList.add(
        'hidden'
    );


    modal.classList.remove(
        'flex'
    );

}



// =========================================================
// COMPATIBILITY
// =========================================================

function submitExam() {

    requestSubmitExam();

}



// =========================================================
// FINALIZE EXAM
// =========================================================

function finalizeExam(
    autoSubmit = false
) {

    if (
        isExamFinished
    ) {

        return;

    }


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
    // COUNT CORRECT ANSWERS
    // =====================================================

    const correctAnswers =
        currentQuestions.reduce(

            (
                total,
                question,
                index
            ) => {

                const correct =

                    Number(
                        userAnswers[index]
                    ) ===

                    Number(
                        question.answer
                    );


                return (
                    total +
                    (
                        correct
                            ? 1
                            : 0
                    )
                );

            },

            0

        );



    // =====================================================
    // SCORE 0 - 100
    // =====================================================

    const score =

        currentQuestions.length > 0

            ? Math.round(

                (
                    correctAnswers /
                    currentQuestions.length

                ) *
                100

            )

            : 0;



    const answered =
        Object.keys(
            userAnswers
        ).length;



    // Ujian selesai.
    // Autosave tidak diperlukan lagi.

    clearSavedProgress();



    // =====================================================
    // SAVE RESULT TEMPORARILY
    // =====================================================

    pendingExamResult = {

        score:
            score,

        correctAnswers:
            correctAnswers,

        answered:
            answered,

        total:
            currentQuestions.length,

        autoSubmit:
            autoSubmit

    };



    // =====================================================
    // ASK PARTICIPANT NAME
    // =====================================================

    showParticipantNameModal();

}



// =========================================================
// PARTICIPANT NAME POPUP
// =========================================================

function showParticipantNameModal() {

    if (
        !pendingExamResult
    ) {

        return;

    }



    // Hapus popup sebelumnya jika ada.

    removeParticipantNameModal();



    // Jika user sebelumnya login Google,
    // gunakan displayName sebagai nilai awal.
    // Login tetap tidak diwajibkan.

    let defaultName = '';


    if (
        typeof auth !==
            'undefined' &&

        auth.currentUser &&

        auth.currentUser.displayName
    ) {

        defaultName =
            auth.currentUser.displayName;

    }



    const modal =
        document.createElement(
            'div'
        );


    modal.id =
        'participant-name-modal';


    modal.className = `

        fixed
        inset-0

        z-[200]

        bg-black/80

        backdrop-blur-md

        flex

        items-center
        justify-center

        p-4
    `;



    modal.innerHTML = `

        <div
            class="
                w-full

                max-w-md

                bg-slate-900

                border
                border-slate-700

                rounded-3xl

                shadow-2xl
                shadow-black/40

                overflow-hidden
            "
        >


            <!-- =============================================
                 MAIN CONTENT
            ============================================== -->

            <div
                class="
                    p-6
                    sm:p-7
                "
            >


                <!-- TROPHY ICON -->

                <div
                    class="
                        w-14
                        h-14

                        rounded-2xl

                        bg-blue-500/10

                        border
                        border-blue-500/20

                        text-blue-400

                        flex
                        items-center
                        justify-center

                        mb-5
                    "
                >

                    <svg
                        width="27"
                        height="27"

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

                <h2
                    class="
                        text-xl
                        sm:text-2xl

                        font-black

                        tracking-tight

                        text-white
                    "
                >

                    Masukkan Nama Peserta

                </h2>



                <!-- DESCRIPTION -->

                <p
                    class="
                        mt-2

                        text-sm

                        leading-6

                        text-slate-400
                    "
                >

                    Masukkan nama yang ingin ditampilkan bersama skor Anda
                    pada papan peringkat RuangTryout.

                </p>



                <!-- =============================================
                     EXAM RESULT PREVIEW
                ============================================== -->

                <div
                    class="
                        mt-5

                        bg-slate-950/60

                        border
                        border-slate-800

                        rounded-2xl

                        px-4
                        py-3.5

                        flex

                        items-center
                        justify-between

                        gap-4
                    "
                >


                    <div>

                        <span
                            class="
                                text-[9px]

                                uppercase

                                tracking-[0.15em]

                                font-black

                                text-slate-600
                            "
                        >

                            Hasil Ujian

                        </span>


                        <p
                            class="
                                mt-1

                                text-xs

                                font-bold

                                text-slate-400
                            "
                        >

                            ${escapeHtml(
                                getCategoryDisplayName()
                            )}

                            &bull;

                            ${pendingExamResult.correctAnswers}/${pendingExamResult.total}
                            benar

                        </p>

                    </div>



                    <div
                        class="
                            text-right

                            shrink-0
                        "
                    >

                        <span
                            class="
                                text-[8px]

                                uppercase

                                tracking-wider

                                font-black

                                text-slate-600
                            "
                        >

                            Nilai

                        </span>


                        <strong
                            class="
                                block

                                text-3xl

                                leading-none

                                font-black

                                text-emerald-400
                            "
                        >

                            ${pendingExamResult.score}

                        </strong>

                    </div>

                </div>



                <!-- =============================================
                     NAME FIELD
                ============================================== -->

                <div
                    class="
                        mt-6
                    "
                >


                    <label
                        for="participant-name-input"

                        class="
                            block

                            mb-2

                            text-[10px]

                            uppercase

                            tracking-[0.12em]

                            font-black

                            text-slate-400
                        "
                    >

                        Nama Peserta

                    </label>


                    <input
                        id="participant-name-input"

                        type="text"

                        maxlength="40"

                        autocomplete="name"

                        placeholder="Masukkan nama Anda"

                        class="
                            w-full

                            bg-slate-950

                            border
                            border-slate-700

                            focus:border-blue-500

                            focus:ring-2
                            focus:ring-blue-500/20

                            text-white

                            placeholder:text-slate-600

                            text-sm

                            font-semibold

                            px-4
                            py-3.5

                            rounded-xl

                            outline-none

                            transition-all
                        "
                    >



                    <p
                        id="participant-name-error"

                        class="
                            hidden

                            mt-2

                            text-[10px]

                            font-semibold

                            text-red-400
                        "
                    ></p>



                    <div
                        class="
                            mt-3

                            flex

                            items-start

                            gap-2
                        "
                    >

                        <svg
                            class="
                                shrink-0

                                mt-0.5

                                text-slate-600
                            "

                            width="12"
                            height="12"

                            viewBox="0 0 24 24"

                            fill="none"

                            stroke="currentColor"

                            stroke-width="2"
                        >

                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path
                                d="M12 11v5"
                            />

                            <path
                                d="M12 8h.01"
                            />

                        </svg>


                        <p
                            class="
                                text-[9px]

                                leading-4

                                text-slate-600
                            "
                        >

                            Nama akan terlihat oleh pengguna lain di papan peringkat.
                            Gunakan nama yang pantas, maksimal 40 karakter.

                        </p>

                    </div>

                </div>

            </div>



            <!-- =============================================
                 ACTIONS
            ============================================== -->

            <div
                class="
                    px-6
                    sm:px-7

                    py-4

                    bg-slate-950/40

                    border-t
                    border-slate-800

                    flex

                    flex-col-reverse
                    sm:flex-row

                    sm:items-center
                    sm:justify-between

                    gap-2.5
                "
            >


                <!-- SKIP -->

                <button
                    id="skip-leaderboard-button"

                    type="button"

                    onclick="continueWithoutLeaderboard()"

                    class="
                        text-[10px]
                        sm:text-xs

                        font-bold

                        text-slate-500

                        hover:text-slate-300

                        px-3
                        py-2.5

                        transition
                    "
                >

                    Lewati Papan Peringkat

                </button>



                <!-- SAVE -->

                <button
                    id="save-leaderboard-button"

                    type="button"

                    onclick="submitParticipantName()"

                    class="
                        inline-flex

                        items-center
                        justify-center

                        gap-2

                        bg-blue-600

                        hover:bg-blue-500

                        disabled:bg-slate-700

                        disabled:text-slate-500

                        text-white

                        text-xs
                        sm:text-sm

                        font-black

                        px-5
                        py-3

                        rounded-xl

                        shadow-lg
                        shadow-blue-600/20

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

                    </svg>


                    <span
                        id="save-leaderboard-button-text"
                    >

                        Simpan ke Leaderboard

                    </span>

                </button>

            </div>

        </div>
    `;



    document.body.appendChild(
        modal
    );



    // =====================================================
    // INPUT INITIALIZATION
    // =====================================================

    const input =
        document.getElementById(
            'participant-name-input'
        );


    if (input) {

        input.value =
            defaultName;


        setTimeout(
            () => {

                input.focus();


                if (
                    defaultName
                ) {

                    input.select();

                }

            },

            100
        );



        // ENTER = SAVE

        input.addEventListener(
            'keydown',

            (
                event
            ) => {

                if (
                    event.key ===
                    'Enter'
                ) {

                    event.preventDefault();


                    submitParticipantName();

                }

            }
        );

    }

}



// =========================================================
// SUBMIT PARTICIPANT NAME TO FIRESTORE
// =========================================================

async function submitParticipantName() {

    if (
        !pendingExamResult
    ) {

        return;

    }



    const input =
        document.getElementById(
            'participant-name-input'
        );


    const errorElement =
        document.getElementById(
            'participant-name-error'
        );


    const saveButton =
        document.getElementById(
            'save-leaderboard-button'
        );


    const saveButtonText =
        document.getElementById(
            'save-leaderboard-button-text'
        );


    if (!input) {

        return;

    }



    // =====================================================
    // NORMALIZE NAME
    // =====================================================

    let participantName =
        input.value
            .trim()
            .replace(
                /\s+/g,
                ' '
            );



    // Izinkan huruf, angka, spasi,
    // apostrof, titik, dan hyphen.

    try {

        participantName =
            participantName.replace(
                /[^\p{L}\p{M}\p{N}\s.'-]/gu,
                ''
            );

    }

    catch (
        error
    ) {

        // Fallback browser lama.

        participantName =
            participantName.replace(
                /[^a-zA-Z0-9\s.'-]/g,
                ''
            );

    }



    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        participantName.length <
        2
    ) {

        showParticipantNameError(
            'Masukkan nama minimal 2 karakter.'
        );


        input.focus();


        return;

    }



    if (
        participantName.length >
        40
    ) {

        showParticipantNameError(
            'Nama maksimal 40 karakter.'
        );


        input.focus();


        return;

    }



    // =====================================================
    // FIREBASE AVAILABILITY
    // =====================================================

    if (
        typeof db ===
        'undefined' ||

        typeof firebase ===
        'undefined'
    ) {

        showParticipantNameError(
            'Koneksi leaderboard belum tersedia. Silakan coba kembali.'
        );


        return;

    }



    // =====================================================
    // LOADING
    // =====================================================

    if (
        errorElement
    ) {

        errorElement.classList.add(
            'hidden'
        );

    }


    if (
        saveButton
    ) {

        saveButton.disabled =
            true;

    }


    if (
        saveButtonText
    ) {

        saveButtonText.textContent =
            'Menyimpan...';

    }



    try {


        // =================================================
        // SAVE TO FIRESTORE
        // =================================================

        await db
            .collection(
                'leaderboard'
            )
            .add({

                name:
                    participantName,

                score:
                    pendingExamResult.score,

                // Disimpan juga untuk kompatibilitas
                // apabila leaderboard memakai persentase.

                percentage:
                    pendingExamResult.score,

                category:
                    selectedCategory.toUpperCase(),

                correctAnswers:
                    pendingExamResult.correctAnswers,

                answered:
                    pendingExamResult.answered,

                totalQuestions:
                    pendingExamResult.total,

                photoURL:
                    '',

                timestamp:
                    firebase
                        .firestore
                        .FieldValue
                        .serverTimestamp()

            });



        // =================================================
        // SUCCESS
        // =================================================

        const result =
            {
                ...pendingExamResult
            };


        pendingExamResult =
            null;


        removeParticipantNameModal();



        showResultScreen(

            result.score,

            result.correctAnswers,

            result.answered,

            result.autoSubmit,

            false,

            true,

            participantName

        );

    }

    catch (
        error
    ) {

        console.error(
            'Gagal menyimpan leaderboard:',
            error
        );


        if (
            saveButton
        ) {

            saveButton.disabled =
                false;

        }


        if (
            saveButtonText
        ) {

            saveButtonText.textContent =
                'Coba Simpan Lagi';

        }


        let errorMessage =
            'Nama dan skor belum berhasil disimpan. Silakan coba lagi.';



        // Error umum Firestore ketika guest
        // tidak memiliki izin write.

        if (
            error &&
            (
                error.code ===
                    'permission-denied' ||

                String(
                    error.message || ''
                )
                    .toLowerCase()
                    .includes(
                        'permission'
                    )
            )
        ) {

            errorMessage =
                'Leaderboard belum mengizinkan penyimpanan peserta tanpa login. Periksa Firestore Security Rules.';

        }


        showParticipantNameError(
            errorMessage
        );

    }

}



// =========================================================
// PARTICIPANT NAME ERROR
// =========================================================

function showParticipantNameError(
    message
) {

    const element =
        document.getElementById(
            'participant-name-error'
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.classList.remove(
        'hidden'
    );

}



// =========================================================
// REMOVE PARTICIPANT MODAL
// =========================================================

function removeParticipantNameModal() {

    const modal =
        document.getElementById(
            'participant-name-modal'
        );


    if (modal) {

        modal.remove();

    }

}



// =========================================================
// SKIP LEADERBOARD
// =========================================================

function continueWithoutLeaderboard() {

    if (
        !pendingExamResult
    ) {

        return;

    }


    const result =
        {
            ...pendingExamResult
        };


    pendingExamResult =
        null;


    removeParticipantNameModal();



    showResultScreen(

        result.score,

        result.correctAnswers,

        result.answered,

        result.autoSubmit,

        false,

        false,

        ''

    );

}



// =========================================================
// RESULT SCREEN
// =========================================================

function showResultScreen(

    score,

    correctAnswers,

    answered,

    autoSubmit = false,

    saveFailed = false,

    savedToLeaderboard = false,

    participantName = ''

) {

    const quizCard =
        document.getElementById(
            'quiz-card'
        );


    if (!quizCard) {

        return;

    }


    const total =
        currentQuestions.length;



    quizCard.innerHTML = `

        <div
            class="
                flex-1
                flex
                items-center
                justify-center
                p-5
            "
        >

            <div
                class="
                    w-full
                    max-w-2xl
                    text-center
                "
            >


                <div
                    class="
                        w-16
                        h-16
                        sm:w-20
                        sm:h-20
                        mx-auto
                        bg-emerald-500/10
                        text-emerald-400
                        border
                        border-emerald-500/20
                        rounded-3xl
                        flex
                        items-center
                        justify-center
                    "
                >

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

                    </svg>

                </div>



                <h2
                    class="
                        mt-6
                        text-2xl
                        sm:text-3xl
                        font-black
                        text-white
                    "
                >

                    ${
                        autoSubmit

                            ? 'Waktu Habis'

                            : 'Ujian Selesai!'
                    }

                </h2>



                <p
                    class="
                        mt-2
                        text-xs
                        sm:text-sm
                        text-slate-400
                    "
                >

                    ${
                        savedToLeaderboard

                            ? `Skor ${escapeHtml(participantName)} berhasil disimpan ke papan peringkat.`

                            : saveFailed

                                ? 'Nilai berhasil dihitung, tetapi leaderboard mengalami kendala.'

                                : 'Hasil simulasi Anda telah dihitung.'
                    }

                </p>



                <!-- RESULT CARDS -->

                <div
                    class="
                        mt-7
                        max-w-lg
                        mx-auto
                        grid
                        grid-cols-3
                        gap-3
                    "
                >


                    <!-- SCORE -->

                    <div
                        class="
                            bg-slate-950/50
                            border
                            border-slate-800
                            rounded-2xl
                            p-4
                        "
                    >

                        <span
                            class="
                                text-[9px]
                                uppercase
                                font-black
                                text-slate-600
                            "
                        >

                            Nilai

                        </span>


                        <strong
                            class="
                                block
                                mt-1
                                text-3xl
                                sm:text-4xl
                                font-black
                                text-emerald-400
                            "
                        >

                            ${score}

                        </strong>

                    </div>



                    <!-- CORRECT -->

                    <div
                        class="
                            bg-slate-950/50
                            border
                            border-slate-800
                            rounded-2xl
                            p-4
                        "
                    >

                        <span
                            class="
                                text-[9px]
                                uppercase
                                font-black
                                text-slate-600
                            "
                        >

                            Benar

                        </span>


                        <strong
                            class="
                                block
                                mt-1
                                text-2xl
                                sm:text-3xl
                                font-black
                                text-white
                            "
                        >

                            ${correctAnswers}

                        </strong>

                    </div>



                    <!-- ANSWERED -->

                    <div
                        class="
                            bg-slate-950/50
                            border
                            border-slate-800
                            rounded-2xl
                            p-4
                        "
                    >

                        <span
                            class="
                                text-[9px]
                                uppercase
                                font-black
                                text-slate-600
                            "
                        >

                            Terjawab

                        </span>


                        <strong
                            class="
                                block
                                mt-1
                                text-2xl
                                sm:text-3xl
                                font-black
                                text-white
                            "
                        >

                            ${answered}/${total}

                        </strong>

                    </div>

                </div>



                <div
                    class="
                        mt-7
                        flex
                        flex-col
                        sm:flex-row
                        justify-center
                        gap-3
                    "
                >

                    <a
                        href="leaderboard.html"

                        class="
                            bg-blue-600
                            hover:bg-blue-500
                            text-white
                            text-xs
                            sm:text-sm
                            font-black
                            px-6
                            py-3
                            rounded-xl
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
                            text-xs
                            sm:text-sm
                            font-bold
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
// CATEGORY DISPLAY NAME
// =========================================================

function getCategoryDisplayName() {

    if (
        selectedCategory ===
        'cpns'
    ) {

        return 'CPNS & PPPK';

    }


    if (
        selectedCategory ===
        'utbk'
    ) {

        return 'UTBK / SNBT';

    }


    return selectedCategory
        .toUpperCase();

}



// =========================================================
// LOCAL STORAGE KEY
// =========================================================

function getStorageKey() {

    return (
        `ruangtryout_exam_${selectedCategory}_guest`
    );

}



// =========================================================
// AUTOSAVE
// =========================================================

function persistProgress() {

    if (
        !quizStarted ||
        isExamFinished ||
        !currentQuestions.length
    ) {

        return;

    }


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

    catch (
        error
    ) {

        console.warn(
            'Autosave gagal:',
            error
        );

    }

}



// =========================================================
// LOAD PROGRESS
// =========================================================

function loadSavedProgress() {

    try {

        const data =
            localStorage.getItem(
                getStorageKey()
            );


        return data

            ? JSON.parse(data)

            : null;

    }

    catch (
        error
    ) {

        return null;

    }

}



// =========================================================
// CLEAR PROGRESS
// =========================================================

function clearSavedProgress() {

    try {

        localStorage.removeItem(
            getStorageKey()
        );

    }

    catch (
        error
    ) {

        console.warn(
            error
        );

    }

}



// =========================================================
// KEYBOARD SHORTCUTS
// =========================================================

function handleExamKeyboard(
    event
) {

    // =====================================================
    // PARTICIPANT POPUP
    // =====================================================

    const participantModal =
        document.getElementById(
            'participant-name-modal'
        );


    if (
        participantModal
    ) {

        return;

    }



    if (
        !quizStarted ||
        isExamFinished
    ) {

        return;

    }



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



    if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
    ) {

        return;

    }



    const key =
        event.key
            .toLowerCase();



    // =====================================================
    // A - D
    // =====================================================

    if (
        [
            'a',
            'b',
            'c',
            'd'
        ].includes(
            key
        )
    ) {

        const question =
            currentQuestions[
                currentIndex
            ];


        if (!question) {

            return;

        }


        const optionIndex =
            key.charCodeAt(0) -
            97;


        if (
            optionIndex <
            question.options.length
        ) {

            event.preventDefault();


            selectOption(
                optionIndex
            );

        }


        return;

    }



    // =====================================================
    // LEFT
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
    // RIGHT
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
    // MARK
    // =====================================================

    else if (
        key ===
        'm'
    ) {

        event.preventDefault();


        toggleMarkCurrent();

    }

}



// =========================================================
// HELPERS
// =========================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}



function clamp(
    number,
    minimum,
    maximum
) {

    return Math.min(

        Math.max(
            number,
            minimum
        ),

        maximum

    );

}



function escapeHtml(
    value
) {

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
