const screens = {

    intro: document.getElementById("intro-screen"),
    menu: document.getElementById("menu-screen"),
    roulette: document.getElementById("roulette-screen"),
    question: document.getElementById("question-screen"),
    answer: document.getElementById("answer-screen"),
    settings: document.getElementById("settings-screen")
};

function showScreen(name) {

    Object.values(screens).forEach(screen => {
        screen.classList.add("hidden");
    });

    screens[name].classList.remove("hidden");
}

const audio = {

    winner:
        new Audio("audio/winner.mp3"),

    rounds1:
        new Audio("audio/rounds1.mp3"),

    rounds2:
        new Audio("audio/rounds2.mp3"),

    rounds3:
        new Audio("audio/rounds3.mp3"),

    rounds4:
        new Audio("audio/rounds4.mp3"),

    rounds5:
        new Audio("audio/rounds5.mp3"),

    mainmenu:
        new Audio("audio/mainmenu.mp3"),

    startscreen:
        new Audio(
            "audio/gameStartScreen.mp3"
        ),

    whirligig:
        new Audio("audio/whirligig.mp3"),

    gong:
        new Audio("audio/gong.mp3"),

    beep60:
        new Audio("audio/BEEP_60sec.mp3"),

    beep50:
        new Audio("audio/BEEP_50sec.mp3"),

    beep0:
        new Audio("audio/BEEP_0sec.mp3"),

    applause:
        new Audio("audio/applause.mp3"),

    applause2:
        new Audio("audio/applause2.mp3"),

    viewers:
        new Audio(
            "audio/VPolzuTelezriteley.mp3"
        ),

    experts:
        new Audio(
            "audio/VPolzuZnatakov.mp3"
        ),

    letters:
        new Audio(
            "audio/placeletters.mp3"
        )
};

const scoreAudio = {};

for (let z = 0; z <= 6; z++) {

    for (let t = 0; t <= 5; t++) {

        scoreAudio[`${z}-${t}`] =
            new Audio(
                `audio/score/${z}-${t}.mp3`
            );
    }
}

function stopAllAudio() {

    Object.values(audio)
        .forEach(sound => {

            sound.pause();

            sound.currentTime = 0;
        });

    Object.values(scoreAudio)
        .forEach(sound => {

            sound.pause();

            sound.currentTime = 0;
        });
}

function playSound(sound) {

    stopAllAudio();

    sound.play();
}

function playBackground(sound) {

    stopAllAudio();

    sound.loop = true;

    sound.play();
}

const introVideo =
    document.getElementById("intro-video");

window.onload = () => {

    showScreen("intro");

    introVideo.play();
};

document.body.addEventListener(
    "click",
    () => {

        audio.mainmenu.play();

    },

    { once: true }
);

introVideo.onended = () => {

    showScreen("menu");

    playBackground(audio.mainmenu);
};

document.getElementById("skip-intro")
    .onclick = () => {

        introVideo.pause();

        showScreen("menu");

        playBackground(audio.mainmenu);
};

document.getElementById("show-intro-btn")
    .onclick = () => {

        stopAllAudio();

        introVideo.currentTime = 0;

        showScreen("intro");

        introVideo.play();
};

document.getElementById("start-btn")
    .onclick = () => {

        showScreen("roulette");
};

document.getElementById("back-menu-btn")
    .onclick = () => {

        showScreen("menu");

        playBackground(audio.mainmenu);
};

document.getElementById("settings-btn")
    .onclick = () => {

        showScreen("settings");
};

document.getElementById("settings-back-btn")
    .onclick = () => {

        showScreen("menu");

        playBackground(audio.mainmenu);
};

let timerDuration = 60;

document.getElementById("save-settings-btn")
    .onclick = () => {

        timerDuration =
            Number(
                document.getElementById(
                    "timer-setting"
                ).value
            );

        alert("Настройки сохранены");
};

const questions = [

    {
        id: 1,

        type: "normal",

        question:
            "Столица Франции?",

        answer:
            "Париж"
    },

    {
        id: 2,

        type: "normal",

        question:
            "Сколько континентов?",

        answer:
            "7"
    },

    {
        id: 3,

        type: "blitz",

        questions: [

            {
                question: "2 + 2",
                answer: "4"
            },

            {
                question: "3 + 3",
                answer: "6"
            },

            {
                question: "5 + 5",
                answer: "10"
            }
        ]
    }
];

let usedQuestions = [];

const wheel =
    document.getElementById("wheel");

const ctx = wheel.getContext("2d");

const spinButton =
    document.getElementById("spin-btn");

let currentRotation = 0;

function drawWheel() {

    ctx.clearRect(0, 0, 600, 600);

    const count = questions.length;

    const angle =
        (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {

        ctx.beginPath();

        ctx.moveTo(300, 300);

        ctx.arc(
            300,
            300,
            250,
            i * angle,
            (i + 1) * angle
        );

        if (
            usedQuestions.includes(i)
        ) {

            ctx.fillStyle = "#222";
        }

        else {

            ctx.fillStyle =
                i % 2 === 0
                    ? "#444"
                    : "#777";
        }

        ctx.fill();

        ctx.save();

        ctx.translate(300, 300);

        ctx.rotate(i * angle + angle / 2);

        ctx.fillStyle = "white";

        ctx.font = "30px Arial";

        ctx.fillText(
            i + 1,
            170,
            10
        );

        ctx.restore();
    }
}

drawWheel();

let round = 1;

function playRoundMusic() {

    const tracks = {

        1: audio.rounds1,
        2: audio.rounds2,
        3: audio.rounds3,
        4: audio.rounds4,
        5: audio.rounds5
    };

    if (tracks[round]) {

        playSound(tracks[round]);
    }
}

spinButton.onclick = () => {

    let available = [];

    questions.forEach((q, i) => {

        if (
            !usedQuestions.includes(i)
        ) {

            available.push(i);
        }
    });

    if (available.length === 0) {

        alert("Вопросы закончились");

        return;
    }

    playSound(audio.whirligig);

    const randomIndex =
        available[
            Math.floor(
                Math.random()
                * available.length
            )
        ];

    usedQuestions.push(randomIndex);

    drawWheel();

    const sectorAngle =
        360 / questions.length;

    const finalDeg =
        3600 +
        randomIndex * sectorAngle;

    currentRotation += finalDeg;

    wheel.style.transition =
        "transform 5s ease-out";

    wheel.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        openQuestion(randomIndex);

    }, 5000);
};

let currentQuestion = null;

function openQuestion(index) {

    currentQuestion =
        questions[index];

    showScreen("question");

    audio.gong.play();

    playRoundMusic();

    document.getElementById(
        "question-title"
    ).innerText =
        `Раунд ${round}`;

    if (
        currentQuestion.type
        === "normal"
    ) {

        document.getElementById(
            "question-text"
        ).innerText =
            currentQuestion.question;
    }

    else {

        let text = "";

        currentQuestion.questions
            .forEach((q, i) => {

                text +=
                    `${i + 1}. ${q.question}\n`;
            });

        document.getElementById(
            "question-text"
        ).innerText = text;
    }

    resetTimer();
}

let timer = null;

let timeLeft = timerDuration;

function resetTimer() {

    clearInterval(timer);

    timeLeft = timerDuration;

    updateTimer();
}

function updateTimer() {

    const timerEl =
        document.getElementById("timer");

    timerEl.innerText = timeLeft;

    if (timeLeft <= 10) {

        timerEl.classList.add("red");
    }

    else {

        timerEl.classList.remove("red");
    }
}

document.getElementById(
    "start-timer-btn"
).onclick = () => {

    clearInterval(timer);

    audio.beep60.play();

    timer = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft === 50) {

            audio.beep50.play();
        }

        if (timeLeft <= 0) {

            clearInterval(timer);

            audio.beep0.play();
        }

    }, 1000);
};

document.getElementById(
    "show-answer-btn"
).onclick = () => {

    clearInterval(timer);

    showScreen("answer");

    if (
        currentQuestion.type
        === "normal"
    ) {

        document.getElementById(
            "answer-text"
        ).innerText =
            currentQuestion.answer;
    }

    else {

        let answers = "";

        currentQuestion.questions
            .forEach((q, i) => {

                answers +=
                    `${i + 1}. ${q.answer}\n`;
            });

        document.getElementById(
            "answer-text"
        ).innerText = answers;
    }
};

let expertsScore = 0;

let viewersScore = 0;

function updateScore() {

    const score =
        `${expertsScore}:${viewersScore}`;

    const scoreEl =
        document.getElementById("score");

    if (scoreEl) {

        scoreEl.innerText = score;
    }
}

function playScoreAudio() {

    const key =
        `${expertsScore}-${viewersScore}`;

    if (scoreAudio[key]) {

        setTimeout(() => {

            scoreAudio[key].play();

        }, 2500);
    }

    checkGameEnd();
}

function expertsWin() {

    expertsScore++;

    updateScore();

    audio.experts.play();

    playScoreAudio();
}

function viewersWin() {

    viewersScore++;

    updateScore();

    audio.viewers.play();

    playScoreAudio();
}

function checkGameEnd() {

    if (expertsScore >= 6) {

        setTimeout(() => {

            playSound(audio.winner);

            audio.applause.play();

        }, 5000);
    }

    if (viewersScore >= 6) {

        setTimeout(() => {

            playSound(audio.winner);

            audio.applause2.play();

        }, 5000);
    }
}

document.getElementById(
    "next-question-btn"
).onclick = () => {

    round++;

    showScreen("roulette");
};

document.addEventListener(
    "keydown",
    e => {

        if (
            e.code === "Space"
        ) {

            e.preventDefault();

            document.getElementById(
                "start-timer-btn"
            ).click();
        }

        if (
            e.code === "Enter"
        ) {

            e.preventDefault();

            document.getElementById(
                "show-answer-btn"
            ).click();
        }

        if (
            e.code === "KeyR"
        ) {

            e.preventDefault();

            showScreen("roulette");
        }

        if (
            e.code === "KeyF"
        ) {

            document.documentElement
                .requestFullscreen();
        }
    }
);

updateScore();