// Futbol Quiz - Futbol.az
'use strict';

const questions = {
  easy: [
    { q: "2022 Dünya Kubokunu hansı komanda qazandı?", options: ["Braziliya", "Argentina", "Fransa", "Xorvatiya"], answer: 1 },
    { q: "Futbol komandasında neçə oyunçu olur?", options: ["9", "10", "11", "12"], answer: 2 },
    { q: "Lionel Messi hansı ölkədəndir?", options: ["Braziliya", "Argentina", "Uruqvay", "Kolumbiya"], answer: 1 },
    { q: "Premier League hansı ölkənin liqasıdır?", options: ["İspaniya", "Almaniya", "İngiltərə", "Fransa"], answer: 2 },
    { q: "Futbolda qırmızı kart nə deməkdir?", options: ["Xəbərdarlıq", "Meydandan kənarlaşdırma", "Penalti", "Aut"], answer: 1 },
    { q: "Cristiano Ronaldo hansı ölkədəndir?", options: ["Braziliya", "İspaniya", "Portuqaliya", "İtaliya"], answer: 2 },
    { q: "FIFA Dünya Kuboku neçə ildən bir keçirilir?", options: ["2 il", "3 il", "4 il", "5 il"], answer: 2 },
    { q: "Hansı komanda 'Barça' ləqəbi ilə tanınır?", options: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"], answer: 1 },
    { q: "Futbol matçı neçə dəqiqə davam edir?", options: ["80", "85", "90", "100"], answer: 2 },
    { q: "Ofsayd qaydası hansı xəttə aiddir?", options: ["Qapıçı xətti", "Orta xətt", "Müdafiə xətti", "Aut xətti"], answer: 2 },
    { q: "Neymar hansı ölkədəndir?", options: ["Argentina", "Braziliya", "Kolumbiya", "Uruqvay"], answer: 1 },
    { q: "La Liga hansı ölkənin liqasıdır?", options: ["İtaliya", "İspaniya", "Fransa", "Almaniya"], answer: 1 },
    { q: "Penalti nöqtəsi qapıdan neçə metr məsafədədir?", options: ["9 metr", "10 metr", "11 metr", "12 metr"], answer: 2 },
    { q: "Hansı komanda 'Qaradağ' adlanır?", options: ["Qarabağ", "Neftçi", "Zirə", "Sabah"], answer: 0 },
    { q: "Dünya futbolunda ən çox qol vuran oyunçu kimdir (2024)?", options: ["Messi", "Ronaldo", "Pelé", "Müller"], answer: 1 },
    { q: "Bundesliga hansı ölkənin liqasıdır?", options: ["Avstriya", "İsveçrə", "Almaniya", "Hollandiya"], answer: 2 },
    { q: "Futbolda korner nədir?", options: ["Künc zərbəsi", "Cərimə zərbəsi", "Penalti", "Aut"], answer: 0 },
    { q: "UEFA Çempionlar Liqası kuboku hansı formadadır?", options: ["Dairəvi", "Böyük qulaqları olan", "Kvadrat", "Üçbucaq"], answer: 1 },
    { q: "Azərbaycan millisinin formasının rəngi nədir?", options: ["Qırmızı-ağ", "Mavi-ağ", "Yaşıl-ağ", "Qara-qırmızı"], answer: 1 },
    { q: "Futbolda 'hat-trick' nə deməkdir?", options: ["2 qol", "3 qol", "4 qol", "5 qol"], answer: 1 }
  ],
  medium: [
    { q: "2018 Dünya Kuboku hansı ölkədə keçirildi?", options: ["Braziliya", "Qətər", "Rusiya", "Almaniya"], answer: 2 },
    { q: "Qarabağ FK hansı ildə UEFA Çempionlar Liqası qrup mərhələsinə çıxdı?", options: ["2015", "2017", "2019", "2021"], answer: 1 },
    { q: "Hansı oyunçu 'CR7' ləqəbi ilə tanınır?", options: ["Kaká", "Cristiano Ronaldo", "Casemiro", "Coutinho"], answer: 1 },
    { q: "Serie A hansı ölkənin liqasıdır?", options: ["İspaniya", "Fransa", "İtaliya", "Portuqaliya"], answer: 2 },
    { q: "2014 Dünya Kuboku finalında Almaniya hansı komandanı məğlub etdi?", options: ["Braziliya", "Argentina", "Hollandiya", "Fransa"], answer: 1 },
    { q: "Hansı stadion 'Futbolun Evi' adlanır?", options: ["Camp Nou", "Wembley", "Maracanã", "San Siro"], answer: 1 },
    { q: "Azərbaycan Premyer Liqası neçə komandadan ibarətdir (2025-26)?", options: ["8", "10", "12", "14"], answer: 1 },
    { q: "Luka Modriç hansı ölkədəndir?", options: ["Serbiya", "Xorvatiya", "Sloveniya", "Bosniya"], answer: 1 },
    { q: "Hansı komanda ən çox Çempionlar Liqası qazanıb?", options: ["Barcelona", "AC Milan", "Real Madrid", "Liverpool"], answer: 2 },
    { q: "VAR nədir?", options: ["Video Hakim Sistemi", "Əlavə vaxt", "Oyunçu dəyişikliyi", "Taktiki sistem"], answer: 0 },
    { q: "Erling Haaland hansı ölkədəndir?", options: ["İsveç", "Danimarka", "Norveç", "Finlandiya"], answer: 2 },
    { q: "2010 Dünya Kuboku hansı ölkədə keçirildi?", options: ["Braziliya", "Cənubi Afrika", "Almaniya", "Yaponiya"], answer: 1 },
    { q: "Hansı oyunçu 'Küləyin Oğlu' ləqəbi ilə tanınır?", options: ["Garrincha", "Ronaldinho", "Mbappé", "Henry"], answer: 0 },
    { q: "Futbolda sarı kartdan sonra ikinci sarı kart nə ilə nəticələnir?", options: ["Penalti", "Qırmızı kart", "Xəbərdarlıq", "Heç nə"], answer: 1 },
    { q: "Manchester City-nin stadionunun adı nədir?", options: ["Old Trafford", "Etihad", "Anfield", "Stamford Bridge"], answer: 1 },
    { q: "Kylian Mbappé hansı ölkədəndir?", options: ["Belçika", "Fransa", "Braziliya", "Portuqaliya"], answer: 1 },
    { q: "Azərbaycan millisinin ən çox qol vuran oyunçusu kimdir?", options: ["Qurban Qurbanov", "Vüqar Nadirov", "Rauf Əliyev", "Cavid Hüseynov"], answer: 0 },
    { q: "Hansı komanda 'Sarı Divar' ilə məşhurdur?", options: ["Barcelona", "Borussia Dortmund", "Arsenal", "Juventus"], answer: 1 },
    { q: "2006 Dünya Kuboku finalında Zidane nə etdi?", options: ["Hat-trick vurdu", "Kəlləni vurdu", "Penalti qaçırdı", "Qırmızı kart aldı"], answer: 1 },
    { q: "Futbolda 'clean sheet' nə deməkdir?", options: ["Qol vurmamaq", "Qol buraxmamaq", "Sarı kart almamaq", "Ofsayd olmamaq"], answer: 1 }
  ],
  hard: [
    { q: "1986 Dünya Kubokunda 'Tanrının Əli' qolunu kim vurdu?", options: ["Pelé", "Maradona", "Zico", "Platini"], answer: 1 },
    { q: "Hansı komanda 'İnvincibles' (Məğlubiyyətsizlər) adı ilə tanınır (2003-04)?", options: ["Chelsea", "Manchester United", "Arsenal", "Liverpool"], answer: 2 },
    { q: "Ballon d'Or mükafatını ən çox neçə dəfə qazanıb bir oyunçu?", options: ["6", "7", "8", "9"], answer: 2 },
    { q: "Hansı ölkə Dünya Kubokunu ən çox qazanıb?", options: ["Almaniya", "İtaliya", "Argentina", "Braziliya"], answer: 3 },
    { q: "1999 Çempionlar Liqası finalında Manchester United son neçə dəqiqədə 2 qol vurdu?", options: ["2 dəqiqə", "3 dəqiqə", "5 dəqiqə", "7 dəqiqə"], answer: 1 },
    { q: "Azərbaycan futbolunun ilk peşəkar klubu hansıdır?", options: ["Qarabağ", "Neftçi", "Xəzər Lənkəran", "İnter Bakı"], answer: 1 },
    { q: "Hansı oyunçu bir təqvim ilində 91 qol vurub?", options: ["Cristiano Ronaldo", "Lionel Messi", "Gerd Müller", "Robert Lewandowski"], answer: 1 },
    { q: "Total Football fəlsəfəsi hansı ölkə ilə əlaqələndirilir?", options: ["Braziliya", "Almaniya", "Hollandiya", "İspaniya"], answer: 2 },
    { q: "Tiki-taka oyun tərzi hansı komanda ilə əlaqələndirilir?", options: ["Real Madrid", "Barcelona", "Bayern Munich", "Manchester City"], answer: 1 },
    { q: "Hansı oyunçu 'Il Fenomeno' ləqəbi ilə tanınır?", options: ["Ronaldinho", "Ronaldo Nazário", "Kaká", "Rivaldo"], answer: 1 },
    { q: "2005 Çempionlar Liqası finalında Liverpool neçə qol fərqini bərabərləşdirdi?", options: ["1", "2", "3", "4"], answer: 2 },
    { q: "Catenaccio taktiki sistemi hansı ölkədə yaranıb?", options: ["İspaniya", "İtaliya", "Argentina", "Uruqvay"], answer: 1 },
    { q: "Hansı oyunçu 3 fərqli komanda ilə Çempionlar Liqası qazanıb?", options: ["Cristiano Ronaldo", "Clarence Seedorf", "Zinedine Zidane", "Xavi"], answer: 1 },
    { q: "İlk Dünya Kuboku hansı ildə və harada keçirildi?", options: ["1928, Fransa", "1930, Uruqvay", "1934, İtaliya", "1932, Braziliya"], answer: 1 },
    { q: "Gegenpressing taktikası hansı məşqçi ilə əlaqələndirilir?", options: ["Pep Guardiola", "José Mourinho", "Jürgen Klopp", "Carlo Ancelotti"], answer: 2 },
    { q: "Hansı komanda ardıcıl 5 Avropa Kuboku qazanıb (1956-60)?", options: ["AC Milan", "Real Madrid", "Benfica", "Barcelona"], answer: 1 },
    { q: "Azərbaycan Premyer Liqasını ən çox hansı komanda qazanıb?", options: ["Neftçi", "Qarabağ", "Xəzər Lənkəran", "İnter Bakı"], answer: 1 },
    { q: "Futbolda 'False 9' mövqeyi nədir?", options: ["Saxta qapıçı", "Geri çəkilən hücumçu", "Hücuma qalxan müdafiəçi", "Kənar yarımmüdafiəçi"], answer: 1 },
    { q: "2014 Dünya Kuboku yarımfinalında Almaniya Braziliyanı neçə-neçə məğlub etdi?", options: ["5-0", "6-1", "7-1", "8-2"], answer: 2 },
    { q: "Johan Cruyff hansı nömrəli forma ilə məşhurdur?", options: ["7", "9", "10", "14"], answer: 3 }
  ]
};

let currentDifficulty = 'medium';
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 30;
let startTime = 0;
let answered = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const shareBtn = document.getElementById('share-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const currentQ = document.getElementById('current-q');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const progressFill = document.getElementById('progress-fill');
const highScoreEl = document.getElementById('high-score');
const themeToggle = document.getElementById('theme-toggle');

// Theme
function initTheme() {
    const saved = localStorage.getItem('futbol-theme');
    if (saved === 'light') {
        document.body.classList.add('light');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('futbol-theme', isLight ? 'light' : 'dark');
});

// Difficulty
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = btn.dataset.diff;
    });
});

// High Score
function loadHighScore() {
    const hs = localStorage.getItem(`quiz-highscore-${currentDifficulty}`) || 0;
    highScoreEl.textContent = hs;
}

function saveHighScore(s) {
    const key = `quiz-highscore-${currentDifficulty}`;
    const current = parseInt(localStorage.getItem(key) || 0);
    if (s > current) {
        localStorage.setItem(key, s);
    }
}

// Shuffle
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Start Quiz
startBtn.addEventListener('click', () => {
    currentQuestions = shuffle(questions[currentDifficulty]).slice(0, 20);
    currentIndex = 0;
    score = 0;
    startTime = Date.now();
    scoreEl.textContent = '0';

    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');

    showQuestion();
});

// Show Question
function showQuestion() {
    answered = false;
    nextBtn.classList.add('hidden');
    const q = currentQuestions[currentIndex];
    currentQ.textContent = currentIndex + 1;
    questionText.textContent = q.q;
    progressFill.style.width = `${((currentIndex) / 20) * 100}%`;

    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
        btn.addEventListener('click', () => selectAnswer(i));
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

// Timer
function startTimer() {
    timeLeft = 30;
    timerEl.textContent = `⏱ ${timeLeft}s`;
    timerEl.classList.remove('warning');

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱ ${timeLeft}s`;

        if (timeLeft <= 5) {
            timerEl.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    if (answered) return;
    answered = true;
    const q = currentQuestions[currentIndex];
    const btns = optionsContainer.querySelectorAll('.option-btn');
    btns.forEach((btn, i) => {
        btn.classList.add('disabled');
        if (i === q.answer) btn.classList.add('correct');
    });
    nextBtn.classList.remove('hidden');
}

// Select Answer
function selectAnswer(index) {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    const q = currentQuestions[currentIndex];
    const btns = optionsContainer.querySelectorAll('.option-btn');

    btns.forEach((btn, i) => {
        btn.classList.add('disabled');
        if (i === q.answer) btn.classList.add('correct');
    });

    if (index === q.answer) {
        score++;
        scoreEl.textContent = score;
    } else {
        btns[index].classList.add('wrong');
    }

    nextBtn.classList.remove('hidden');
}

// Next Question
nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= 20) {
        showResult();
    } else {
        showQuestion();
    }
});

// Show Result
function showResult() {
    clearInterval(timer);
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const percentage = (score / 20) * 100;

    let title, message;
    if (percentage >= 90) {
        title = '🏆 Əla!';
        message = 'Siz əsl futbol ekspertisiniz!';
    } else if (percentage >= 70) {
        title = '⭐ Çox yaxşı!';
        message = 'Futbol biliyiniz güclüdür!';
    } else if (percentage >= 50) {
        title = '👍 Yaxşı!';
        message = 'Daha çox öyrənməyə davam edin!';
    } else {
        title = '📚 Təcrübə lazımdır';
        message = 'Daha çox futbol izləyin və yenidən cəhd edin!';
    }

    document.getElementById('result-title').textContent = title;
    document.getElementById('result-score').textContent = `${score}/20`;
    document.getElementById('result-message').textContent = message;
    document.getElementById('correct-count').textContent = score;
    document.getElementById('wrong-count').textContent = 20 - score;
    document.getElementById('time-stat').textContent = `${totalTime}s`;

    saveHighScore(score);
}

// Retry
retryBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    loadHighScore();
});

// Share
shareBtn.addEventListener('click', () => {
    const text = `⚽ Futbol Quiz - Futbol.az\n🏆 Nəticəm: ${score}/20 (${currentDifficulty})\nSən də yoxla! 👉 futbol.az/quiz.html`;
    if (navigator.share) {
        navigator.share({ title: 'Futbol Quiz', text });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            shareBtn.textContent = 'Kopyalandı ✓';
            setTimeout(() => { shareBtn.textContent = 'Paylaş 📤'; }, 2000);
        });
    }
});

// Init
initTheme();
loadHighScore();
