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

const questions = [

    {
        question:
            "Внутри реактора есть «чечевицы», «таблетки» и «луковицы». О чём речь, если все эти «кулинарные» термины описывают одну и ту же деталь в разных поколениях реакторов?",

        answer:
            "О топливных таблетках из диоксида урана. В ранних проектах их форма была двояковыпуклой (чечевица), затем цилиндрической (таблетка), а в жидкосолевых реакторах их аналог — «луковица»."
    },

    {
        question:
            "На Ленинградской АЭС есть традиция: перед плановым ремонтом на пульте оператора оставляют записку «Проверь, выключил ли ты утюг». При этом никакого утюга в зоне реактора нет. Зачем это делают?",

        answer:
            "Это психологический якорь на бытовую привычку — заставляет мозг переключиться в режим последней проверки всего."
    },

    {
        question:
            "На пульте управления быстрым реактором БН-800 есть индикатор, который мигает не красным, а фиолетовым. Какое физиологическое свойство зрения здесь использовано?",

        answer:
            "Фиолетовый цвет хуже всего локализуется периферическим зрением — оператор вынужден посмотреть прямо на индикатор."
    },

    {
        question:
            "В Димитровграде сотрудники закрепляют поверх халатов резиновых уточек. Зачем?",

        answer:
            "Это психологический индикатор грязной зоны."
    },

    {
        question:
            "В 1990-е годы деньги перевозили в контейнерах из-под чего?",

        answer:
            "Из-под отработавших тепловыделяющих сборок."
    },

    {
        question:
            "Этот прибор, изобретенный в 1908 году, издает щелчки при попадании ионизирующих частиц.",

        answer:
            "Счетчик Гейгера."
    },

    {
        question:
            "Метод углерода-14 работает только с объектами, которые когда-то были какими?",

        answer:
            "Живыми."
    },

    {
        question:
            "Устройство, которое сотрудник АЭС носит на груди и которое фиксирует накопленное.",

        answer:
            "Дозиметр."
    },

    {
        question:
            "«Пусть будет атом рабочим, а не…»",

        answer:
            "Солдатом."
    },

    {
        question:
            "Какой контур предложили сделать для защиты от утечки натрия?",

        answer:
            "Двойной — труба в трубе."
    },

    {
        question:
            "Фамилия руководителя взрыва первой советской атомной бомбы.",

        answer:
            "Павлов."
    },

    {
        question:
            "Какое вещество использовали для тушения графита на ЧАЭС?",

        answer:
            "Свинец."
    },

    {
        question:
            "Для чего ликвидаторам ЧАЭС выдавали красное вино?",

        answer:
            "Для выведения цезия-137 и как успокоительное."
    }
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

window.onload = () => {

    drawWheel();

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

    const availableIndexes =
        questions
            .map((q, i) => i)
            .filter(
                i =>
                    !usedQuestions
                        .includes(i)
            );

    const count =
        availableIndexes.length;

    if (count === 0) {
        return;
    }

    const angle =
        (Math.PI * 2)
        / count;

    availableIndexes
        .forEach(
            (questionIndex, drawIndex) => {

                ctx.beginPath();

                ctx.moveTo(
                    350,
                    350
                );

                ctx.arc(
                    350,
                    350,
                    300,
                    drawIndex * angle,
                    (drawIndex + 1)
                    * angle
                );

                ctx.fillStyle =
                    drawIndex % 2 === 0
                        ? "#444"
                        : "#777";

                ctx.fill();

                ctx.save();

                ctx.translate(
                    350,
                    350
                );

                ctx.rotate(
                    drawIndex * angle
                    + angle / 2
                );

                ctx.fillStyle =
                    "white";

                ctx.font =
                    "22px Arial";

                ctx.fillText(
                    cityNames[
                        questionIndex
                    ],
                    170,
                    10
                );

                ctx.restore();
            }
        );
}

spinButton.onclick = () => {

    const available =
        questions
            .map((q, i) => i)
            .filter(
                i =>
                    !usedQuestions
                        .includes(i)
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

    currentRotation +=
        3600;

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

    audio.viewers.play();

    setTimeout(() => {

        showScreen("roulette");

    }, 1500);
};

updateScore();