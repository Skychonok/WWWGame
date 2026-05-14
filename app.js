const screens = {

    intro:
        document.getElementById(
            "intro-screen"
        ),

    menu:
        document.getElementById(
            "menu-screen"
        ),

    roulette:
        document.getElementById(
            "roulette-screen"
        ),

    question:
        document.getElementById(
            "question-screen"
        ),

    answer:
        document.getElementById(
            "answer-screen"
        ),

    settings:
        document.getElementById(
            "settings-screen"
        )
};

function showScreen(name) {

    Object.values(screens)
        .forEach(screen => {

            screen.classList
                .add("hidden");
        });

    screens[name]
        .classList
        .remove("hidden");
}

const cityNames = [

    "Москва",
    "Тула",
    "Казань",
    "Омск",
    "Тверь",
    "Сочи",
    "Томск",
    "Курск",
    "Пермь",
    "Самара",
    "Уфа",
    "Калуга",
    "Иркутск"
];

const audio = {

    whirligig:
        new Audio(
            "audio/whirligig.mp3"
        ),

    gong:
        new Audio(
            "audio/gong.mp3"
        ),

    beep60:
        new Audio(
            "audio/BEEP_60sec.mp3"
        ),

    beep50:
        new Audio(
            "audio/BEEP_50sec.mp3"
        ),

    beep0:
        new Audio(
            "audio/BEEP_0sec.mp3"
        ),

    experts:
        new Audio(
            "audio/VPolzuZnatakov.mp3"
        ),

    viewers:
        new Audio(
            "audio/VPolzuTelezriteley.mp3"
        )
};

const introVideo =
    document.getElementById(
        "intro-video"
    );

window.onload = async () => {

    await loadQuestions();

    showScreen("intro");

    introVideo.play();
};

introVideo.onended = () => {

    showScreen("menu");
};

document.getElementById(
    "skip-intro"
).onclick = () => {

    introVideo.pause();

    showScreen("menu");
};

document.getElementById(
    "show-intro-btn"
).onclick = () => {

    introVideo.currentTime = 0;

    showScreen("intro");

    introVideo.play();
};

document.getElementById(
    "start-btn"
).onclick = () => {

    showScreen("roulette");
};

document.getElementById(
    "back-menu-btn"
).onclick = () => {

    showScreen("menu");
};

document.getElementById(
    "settings-btn"
).onclick = () => {

    showScreen("settings");
};

document.getElementById(
    "settings-back-btn"
).onclick = () => {

    showScreen("menu");
};

let timerDuration = 60;

document.getElementById(
    "save-settings-btn"
).onclick = () => {

    timerDuration =
        Number(
            document.getElementById(
                "timer-setting"
            ).value
        );

    alert(
        "Настройки сохранены"
    );
};

let questions = [];

async function loadQuestions() {

    const response =
        await fetch(
            "data/questions.json"
        );

    const data =
        await response.json();

    questions = data.questions;

    drawWheel();
}

let usedQuestions = [];

const wheel =
    document.getElementById(
        "wheel"
    );

const ctx =
    wheel.getContext("2d");

const spinButton =
    document.getElementById(
        "spin-btn"
    );

let currentRotation = 0;

function drawWheel() {

    ctx.clearRect(
        0,
        0,
        700,
        700
    );

    const count =
        questions.length;

    const angle =
        (Math.PI * 2)
        / count;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        if (
            usedQuestions.includes(i)
        ) {

            continue;
        }

        ctx.beginPath();

        ctx.moveTo(
            350,
            350
        );

        ctx.arc(
            350,
            350,
            300,
            i * angle,
            (i + 1) * angle
        );

        ctx.fillStyle =
            i % 2 === 0
                ? "#444"
                : "#777";

        ctx.fill();

        ctx.save();

        ctx.translate(
            350,
            350
        );

        ctx.rotate(
            i * angle
            + angle / 2
        );

        ctx.fillStyle =
            "white";

        ctx.font =
            "22px Arial";

        ctx.fillText(
            cityNames[i],
            170,
            10
        );

        ctx.restore();
    }
}

spinButton.onclick = () => {

    let available = [];

    questions.forEach(
        (q, i) => {

            if (
                !usedQuestions
                    .includes(i)
            ) {

                available
                    .push(i);
            }
        }
    );

    if (
        available.length === 0
    ) {

        alert(
            "Вопросы закончились"
        );

        return;
    }

    audio.whirligig.play();

    const randomIndex =
        available[
            Math.floor(
                Math.random()
                * available.length
            )
        ];

    usedQuestions.push(
        randomIndex
    );

    drawWheel();

    const sectorAngle =
        360
        / questions.length;

    const finalDeg =
        3600
        + randomIndex
        * sectorAngle;

    currentRotation +=
        finalDeg;

    wheel.style.transition =
        "transform 5s ease-out";

    wheel.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        openQuestion(
            randomIndex
        );

    }, 5000);
};

let currentQuestion =
    null;

function openQuestion(index) {

    currentQuestion =
        questions[index];

    showScreen("question");

    audio.gong.play();

    document.getElementById(
        "question-title"
    ).innerText =
        "Вопрос";

    document.getElementById(
        "question-text"
    ).innerText =
        currentQuestion.question;

    resetTimer();

    startTimer();
}

let timer = null;

let timeLeft =
    timerDuration;

function resetTimer() {

    clearInterval(timer);

    timeLeft =
        timerDuration;

    updateTimer();
}

function updateTimer() {

    const timerEl =
        document.getElementById(
            "timer"
        );

    timerEl.innerText =
        timeLeft;

    if (timeLeft <= 10) {

        timerEl.classList
            .add("red");
    }

    else {

        timerEl.classList
            .remove("red");
    }
}

function startTimer() {

    clearInterval(timer);

    audio.beep60.play();

    timer =
        setInterval(() => {

            timeLeft--;

            updateTimer();

            if (
                timeLeft === 50
            ) {

                audio.beep50
                    .play();
            }

            if (
                timeLeft <= 0
            ) {

                clearInterval(
                    timer
                );

                audio.beep0
                    .play();
            }

        }, 1000);
}

document.getElementById(
    "show-answer-btn"
).onclick = () => {

    clearInterval(timer);

    showScreen("answer");

    document.getElementById(
        "answer-text"
    ).innerText =
        currentQuestion.answer;
};

let expertsScore = 0;

let viewersScore = 0;

function updateScore() {

    const score =
        `${expertsScore}:${viewersScore}`;

    document.getElementById(
        "score"
    ).innerText = score;

    document.getElementById(
        "score-question"
    ).innerText = score;

    document.getElementById(
        "score-answer"
    ).innerText = score;
}

document.getElementById(
    "experts-win-btn"
).onclick = () => {

    expertsScore++;

    updateScore();

    

    drawWheel();

    audio.experts.play();

    setTimeout(() => {

        showScreen("roulette");

    }, 1500);
};

document.getElementById(
    "viewers-win-btn"
).onclick = () => {

    viewersScore++;

    updateScore();

    

    drawWheel();

    audio.viewers.play();

    setTimeout(() => {

        showScreen("roulette");

    }, 1500);
};

updateScore();