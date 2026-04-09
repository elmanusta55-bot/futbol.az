/* ═══════════════════════════════════════════════════════════════════
   FUTBOL.AZ – Games Module
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

// ── Game Tab Switching ────────────────────────────────────────────────────────
function selectGame(gameKey) {
  document.querySelectorAll(".game-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.game === gameKey);
  });
  document.querySelectorAll(".game-panel").forEach(p => {
    const isTarget = p.id === `game-${gameKey}`;
    p.hidden = !isTarget;
    p.classList.toggle("active", isTarget);
  });
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────
function getHighScore(key) {
  const val = parseInt(localStorage.getItem(`hs_${key}`), 10);
  return isNaN(val) ? 0 : val;
}
function setHighScore(key, score) {
  const current = getHighScore(key);
  if (score > current) localStorage.setItem(`hs_${key}`, String(score));
}
function renderHighScore(elId, key, label) {
  const el = document.getElementById(elId);
  if (!el) return;
  const hs = getHighScore(key);
  el.textContent = hs > 0 ? `🏆 Rekord: ${hs} ${label}` : "";
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIVIA GAME
// ═══════════════════════════════════════════════════════════════════════════════
const TRIVIA_QUESTIONS = [
  { q: "Ən çox Dünya Çempionatı qazanan ölkə hansıdır?", opts: ["Almaniya","Braziliya","Argentina","İtaliya"], ans: 1 },
  { q: "UEFA Çempionlar Liqasında ən çox qol vuran oyunçu kimdir?", opts: ["Lionel Messi","Ronaldo Nazario","Cristiano Ronaldo","Raúl"], ans: 2 },
  { q: "2022 Dünya Çempionatı harada keçirildi?", opts: ["Rusiya","Braziliya","Qətər","BƏƏ"], ans: 2 },
  { q: "\"El Clásico\" hansı iki komanda arasındakı oyundur?", opts: ["Atletico – Villarreal","Real Madrid – Barcelona","Arsenal – Chelsea","PSG – Marsilya"], ans: 1 },
  { q: "Dünya çempionu Lionel Messi hansı klubda karyerasının çox hissəsini keçirdi?", opts: ["PSG","Inter Miami","Manchester City","Barcelona"], ans: 3 },
  { q: "\"Ballon d'Or\" ilk dəfə hansı ildə verildi?", opts: ["1956","1960","1950","1948"], ans: 0 },
  { q: "Qarabağ FK neçənci ildə UEFA qrup mərhələsinə ilk dəfə çıxdı?", opts: ["2014","2015","2016","2017"], ans: 2 },
  { q: "Hansı oyunçu 2023 Dünya Kupasında (Qadınlar) ən yaxşı oyunçu seçildi?", opts: ["Alex Morgan","Alexia Putellas","Sam Kerr","Aitana Bonmatí"], ans: 3 },
  { q: "\"Wembley\" stadionu hansı ölkədədir?", opts: ["Fransa","Almaniya","İngiltərə","İspaniya"], ans: 2 },
  { q: "Hansı klub UEFA Çempionlar Liqasını ən çox qazanıb?", opts: ["Bayern München","AC Milan","Real Madrid","Barcelona"], ans: 2 },
  { q: "Pelé neçə dəfə Dünya Çempionu olub?", opts: ["1","2","3","4"], ans: 2 },
  { q: "İlk Dünya Çempionatı hansı ildə keçirildi?", opts: ["1928","1930","1934","1938"], ans: 1 },
  { q: "Həmişəlik 10 nömrəli formanı geyinən hansı oyunçu \"Tanrının Əli\" golunu vurdu?", opts: ["Pelé","Zidane","Maradona","Ronaldinho"], ans: 2 },
  { q: "Avro 2020 (2021) finalında İtaliya hansı komandanı məğlub etdi?", opts: ["Fransa","İspaniya","İngiltərə","Hollandiya"], ans: 2 },
  { q: "\"Offside\" qaydası nəyi ifadə edir?", opts: [
    "Oyunçunun topa yaxın olması",
    "Hücum oyunçusunun müdafiəçilərdən öndə olması",
    "Qolkeeperin sahəsindən çıxması",
    "Oyunçunun sarı kart alması"
  ], ans: 1 },
];

const triviaState = {
  questions:   [],
  current:     0,
  score:       0,
  timerInterval: null,
  timeLeft:    15,
  answered:    false,
};

function startTrivia() {
  // Shuffle and pick 10
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
  triviaState.questions = shuffled.slice(0, 10);
  triviaState.current   = 0;
  triviaState.score     = 0;
  triviaState.answered  = false;

  showEl("trivia-play");
  hideEl("trivia-intro");
  hideEl("trivia-result");

  showTriviaQuestion();
}

function showTriviaQuestion() {
  const state = triviaState;
  const q = state.questions[state.current];
  if (!q) { endTrivia(); return; }

  clearInterval(state.timerInterval);
  state.timeLeft = 15;
  state.answered = false;

  setHTML("trivia-progress", `Sual ${state.current + 1}/${state.questions.length}`);
  setHTML("trivia-score-display", `${state.score} xal`);
  setHTML("trivia-question", escapeHTML(q.q));

  const bar = document.getElementById("trivia-timer-bar");
  if (bar) { bar.style.width = "100%"; bar.className = "quiz-timer-bar"; }

  const opts = document.getElementById("trivia-options");
  if (opts) {
    opts.innerHTML = q.opts.map((o, i) =>
      `<button class="quiz-option" data-idx="${i}" onclick="answerTrivia(${i})">${escapeHTML(o)}</button>`
    ).join("");
  }

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    const pct = (state.timeLeft / 15) * 100;
    if (bar) {
      bar.style.width = `${pct}%`;
      if (state.timeLeft <= 5) bar.className = "quiz-timer-bar danger";
      else if (state.timeLeft <= 8) bar.className = "quiz-timer-bar warning";
    }
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) answerTrivia(-1); // time out
    }
  }, 1000);
}

function answerTrivia(idx) {
  const state = triviaState;
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerInterval);

  const q = state.questions[state.current];
  const opts = document.querySelectorAll("#trivia-options .quiz-option");

  opts.forEach(btn => btn.disabled = true);

  const chosen = parseInt(String(idx), 10);
  const correct = q.ans;

  opts.forEach(btn => {
    const btnIdx = parseInt(btn.dataset.idx, 10);
    if (btnIdx === correct) btn.classList.add("correct");
    else if (btnIdx === chosen) btn.classList.add("wrong");
  });

  if (chosen === correct) {
    state.score += Math.max(1, state.timeLeft); // bonus for speed
  }

  setHTML("trivia-score-display", `${state.score} xal`);

  setTimeout(() => {
    state.current++;
    if (state.current < state.questions.length) {
      showTriviaQuestion();
    } else {
      endTrivia();
    }
  }, 1200);
}

function endTrivia() {
  clearInterval(triviaState.timerInterval);
  setHighScore("trivia", triviaState.score);

  showEl("trivia-result");
  hideEl("trivia-play");

  const max = triviaState.questions.length * 15;
  const pct = Math.round((triviaState.score / max) * 100);

  setHTML("trivia-result-score", `${triviaState.score} xal`);

  let icon = "🥉", msg = "Daha çox oxumaq lazımdır! Yenidən cəhd edin.";
  if (pct >= 80) { icon = "🏆"; msg = "Əla! Siz həqiqi futbol bilicisisiniz!"; }
  else if (pct >= 55) { icon = "🥈"; msg = "Yaxşı nəticə! Bir az daha çalışın."; }
  else if (pct >= 30) { icon = "🥉"; msg = "Pis deyil. Biliklərinizi artırın!"; }

  setHTML("trivia-result-icon", icon);
  setHTML("trivia-result-msg", escapeHTML(msg));
  renderHighScore("trivia-highscore", "trivia", "xal");
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORE PREDICTION GAME
// ═══════════════════════════════════════════════════════════════════════════════
const SAMPLE_MATCHES = [
  { home: "Qarabağ FK",   homeEmoji: "🦅", away: "Neftçi PFK",  awayEmoji: "⛽", homeScore: 2, awayScore: 0 },
  { home: "Liverpool",    homeEmoji: "🔴", away: "Arsenal",     awayEmoji: "🔴", homeScore: 2, awayScore: 2 },
  { home: "Barcelona",    homeEmoji: "🔵", away: "Real Madrid", awayEmoji: "⚪", homeScore: 3, awayScore: 2 },
  { home: "Bayern",       homeEmoji: "🔴", away: "Dortmund",    awayEmoji: "🟡", homeScore: 4, awayScore: 0 },
  { home: "Napoli",       homeEmoji: "🔵", away: "Juventus",    awayEmoji: "⚫", homeScore: 1, awayScore: 1 },
];

const predictState = {
  matches:    [],
  current:    0,
  score:      0,
  predictions:[],
};

function startPredict() {
  const shuffled = [...SAMPLE_MATCHES].sort(() => Math.random() - 0.5);
  predictState.matches     = shuffled.slice(0, 5);
  predictState.current     = 0;
  predictState.score       = 0;
  predictState.predictions = [];

  showEl("predict-play");
  hideEl("predict-intro");
  hideEl("predict-result");
  showPredictMatch();
}

function showPredictMatch() {
  const state = predictState;
  const match = state.matches[state.current];
  if (!match) { endPredict(); return; }

  setHTML("predict-round-label", `Tur ${state.current + 1}/${state.matches.length}`);
  setHTML("predict-score-display", `${state.score} xal`);

  const card = document.getElementById("predict-match-card");
  if (!card) return;

  card.innerHTML = `
    <div class="predict-teams-row">
      <div class="predict-team">
        <div class="predict-team-logo">${escapeHTML(match.homeEmoji)}</div>
        <div class="predict-team-name">${escapeHTML(match.home)}</div>
      </div>
      <span class="predict-vs">VS</span>
      <div class="predict-team">
        <div class="predict-team-logo">${escapeHTML(match.awayEmoji)}</div>
        <div class="predict-team-name">${escapeHTML(match.away)}</div>
      </div>
    </div>

    <div class="predict-score-row">
      <div class="predict-score-input-wrap">
        <div class="predict-score-label">${escapeHTML(match.home)}</div>
        <input class="predict-score-input" id="pred-home" type="number" min="0" max="20" value="1" aria-label="${escapeHTML(match.home)} qol sayı">
      </div>
      <span class="predict-dash">–</span>
      <div class="predict-score-input-wrap">
        <div class="predict-score-label">${escapeHTML(match.away)}</div>
        <input class="predict-score-input" id="pred-away" type="number" min="0" max="20" value="0" aria-label="${escapeHTML(match.away)} qol sayı">
      </div>
    </div>

    <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="submitPredict()">Proqnozu Göndər →</button>
  `;
}

function submitPredict() {
  const state = predictState;
  const match = state.matches[state.current];

  const predHome = parseInt(document.getElementById("pred-home")?.value || "0", 10) || 0;
  const predAway = parseInt(document.getElementById("pred-away")?.value || "0", 10) || 0;

  const actualHome = match.homeScore;
  const actualAway = match.awayScore;

  let pts = 0;
  let type = "miss";

  if (predHome === actualHome && predAway === actualAway) {
    pts = 3; type = "exact";
  } else if (
    Math.sign(predHome - predAway) === Math.sign(actualHome - actualAway)
  ) {
    pts = 1; type = "result";
  }

  state.score += pts;
  state.predictions.push({ match, predHome, predAway, pts, type });
  setHTML("predict-score-display", `${state.score} xal`);

  // Show result overlay on card
  const card = document.getElementById("predict-match-card");
  const typeLabels = { exact: "Dəqiq! +3 xal 🎯", result: "Nəticə doğru! +1 xal 👍", miss: `Tutmadı. Həqiqi: ${actualHome}–${actualAway}` };
  const badgeClass = type;
  card.innerHTML += `
    <div class="predict-result-row">
      <span>Həqiqi nəticə: <strong>${actualHome} – ${actualAway}</strong></span>
      <span class="predict-pts-badge ${badgeClass}">${escapeHTML(typeLabels[type])}</span>
    </div>`;

  const btn = card.querySelector(".btn-primary");
  if (btn) { btn.textContent = state.current < state.matches.length - 1 ? "Növbəti Matç →" : "Nəticəni Gör"; btn.onclick = nextPredict; }
}

function nextPredict() {
  predictState.current++;
  if (predictState.current < predictState.matches.length) {
    showPredictMatch();
  } else {
    endPredict();
  }
}

function endPredict() {
  setHighScore("predict", predictState.score);

  showEl("predict-result");
  hideEl("predict-play");

  setHTML("predict-result-score", `${predictState.score} / ${predictState.matches.length * 3} xal`);

  const breakdown = predictState.predictions.map(p => {
    const typeLabel = { exact: "🎯 Dəqiq (+3)", result: "👍 Nəticə (+1)", miss: "❌ Tutmadı (0)" };
    return `<div class="breakdown-item">
      <span>${escapeHTML(p.match.home)} – ${escapeHTML(p.match.away)} &nbsp;<small style="color:var(--text-muted)">(${p.predHome}–${p.predAway})</small></span>
      <span class="predict-pts-badge ${p.type}">${escapeHTML(typeLabel[p.type])}</span>
    </div>`;
  }).join("");

  setHTML("predict-result-breakdown", breakdown);
  renderHighScore("predict-highscore", "predict", "xal");
}

// ═══════════════════════════════════════════════════════════════════════════════
// PENALTY SHOOTOUT GAME
// ═══════════════════════════════════════════════════════════════════════════════
const ZONE_COORDS = {
  // canvas 480x300, goal roughly centered top half
  tl: { cx: 150, cy: 80  }, tc: { cx: 240, cy: 70  }, tr: { cx: 330, cy: 80  },
  ml: { cx: 150, cy: 130 }, mc: { cx: 240, cy: 130 }, mr: { cx: 330, cy: 130 },
  bl: { cx: 160, cy: 185 }, bc: { cx: 240, cy: 190 }, br: { cx: 320, cy: 185 },
};

const penaltyState = {
  kicks:     5,
  kicksTaken:0,
  goals:     0,
  selected:  null,
  shooting:  false,
  history:   [],
};

function startPenalty() {
  Object.assign(penaltyState, { kicksTaken: 0, goals: 0, selected: null, shooting: false, history: [] });

  showEl("penalty-play");
  hideEl("penalty-intro");
  hideEl("penalty-result");

  const btn = document.getElementById("btn-shoot");
  if (btn) btn.disabled = true;

  document.querySelectorAll(".goal-cell").forEach(c => c.classList.remove("selected"));
  setHTML("penalty-history", "");
  updatePenaltyLabels();
  drawPenaltyCanvas();
}

function aimPenalty(zone) {
  if (penaltyState.shooting) return;
  penaltyState.selected = zone;

  document.querySelectorAll(".goal-cell").forEach(c => {
    c.classList.toggle("selected", c.dataset.zone === zone);
  });

  const btn = document.getElementById("btn-shoot");
  if (btn) btn.disabled = false;

  setHTML("penalty-instruction", `Hədəf: ${zoneLabel(zone)} – Vurmaq üçün ⚽ düyməsini basın`);
}

function zoneLabel(z) {
  const map = { tl:"Sol üst", tc:"Orta üst", tr:"Sağ üst", ml:"Sol orta", mc:"Mərkəz", mr:"Sağ orta", bl:"Sol alt", bc:"Orta alt", br:"Sağ alt" };
  return map[z] || z;
}

function shootPenalty() {
  if (!penaltyState.selected || penaltyState.shooting) return;
  penaltyState.shooting = true;

  const btn = document.getElementById("btn-shoot");
  if (btn) btn.disabled = true;
  document.querySelectorAll(".goal-cell").forEach(c => c.disabled = true);

  // Keeper randomly dives: 60% chance correct zone, 40% wrong
  const zones = Object.keys(ZONE_COORDS);
  const targetZone = penaltyState.selected;
  const keeperZone = Math.random() < 0.38
    ? targetZone  // keeper saves
    : zones[Math.floor(Math.random() * zones.length)];

  const isGoal = keeperZone !== targetZone;

  // Animate
  animatePenaltyKick(targetZone, keeperZone, isGoal, () => {
    penaltyState.kicksTaken++;
    if (isGoal) penaltyState.goals++;
    penaltyState.history.push(isGoal ? "goal" : "miss");
    penaltyState.shooting = false;

    updatePenaltyLabels();
    renderPenaltyHistory();

    if (penaltyState.kicksTaken >= penaltyState.kicks) {
      setTimeout(endPenalty, 800);
    } else {
      // Reset for next kick
      penaltyState.selected = null;
      document.querySelectorAll(".goal-cell").forEach(c => { c.disabled = false; c.classList.remove("selected"); });
      setHTML("penalty-instruction", "Hədəfi seçin, sonra ⚽ düyməsini basın");
      drawPenaltyCanvas();
    }
  });
}

function animatePenaltyKick(targetZone, keeperZone, isGoal, onDone) {
  const canvas = document.getElementById("penalty-canvas");
  if (!canvas) { onDone(); return; }
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const target = ZONE_COORDS[targetZone];
  const keeperTarget = ZONE_COORDS[keeperZone];

  // Ball start position (penalty spot)
  let bx = W / 2, by = H - 20;
  const finalBx = target.cx, finalBy = target.cy;

  // Keeper start: center top
  let kx = W / 2;
  const targetKx = keeperTarget.cx < W / 2 - 30 ? W * 0.2 : keeperTarget.cx > W / 2 + 30 ? W * 0.8 : W / 2;

  let frame = 0;
  const totalFrames = 18;

  function draw(f) {
    ctx.clearRect(0, 0, W, H);
    drawField(ctx, W, H);

    const t = f / totalFrames;

    // Keeper dive
    kx = lerp(W / 2, targetKx, easeIn(t));
    drawKeeper(ctx, kx, 80);

    // Ball
    const curBx = lerp(bx, finalBx, t);
    const curBy = lerp(by, finalBy, t);
    drawBall(ctx, curBx, curBy, 10 - t * 6);

    if (f >= totalFrames) {
      // Final state
      ctx.clearRect(0, 0, W, H);
      drawField(ctx, W, H);
      drawKeeper(ctx, targetKx, 80);

      if (isGoal) {
        drawBall(ctx, finalBx, finalBy, 5);
        // Goal celebration
        showPenaltyOverlay("⚽ GOL!", canvas);
      } else {
        drawSave(ctx, targetKx, 80);
        showPenaltyOverlay("🧤 Saxlandı!", canvas);
      }
      setTimeout(onDone, 1000);
      return;
    }

    requestAnimationFrame(() => draw(f + 1));
  }
  draw(0);
}

function lerp(a, b, t) { return a + (b - a) * t; }
function easeIn(t) { return t * t; }

function drawField(ctx, W, H) {
  // Grass
  ctx.fillStyle = "#2d5a1b";
  ctx.fillRect(0, 0, W, H);

  // Penalty arc / lines
  ctx.strokeStyle = "rgba(255,255,255,.35)";
  ctx.lineWidth = 1.5;

  // Goal box
  const gw = 200, gh = 120, gx = (W - gw) / 2, gy = 20;
  ctx.strokeRect(gx, gy, gw, gh);

  // Goal net lines (horizontal)
  for (let row = 1; row <= 5; row++) {
    ctx.beginPath();
    ctx.moveTo(gx, gy + row * (gh / 6));
    ctx.lineTo(gx + gw, gy + row * (gh / 6));
    ctx.stroke();
  }
  // Goal net lines (vertical)
  for (let col = 1; col <= 9; col++) {
    ctx.beginPath();
    ctx.moveTo(gx + col * (gw / 10), gy);
    ctx.lineTo(gx + col * (gw / 10), gy + gh);
    ctx.stroke();
  }

  // Penalty spot
  ctx.fillStyle = "rgba(255,255,255,.6)";
  ctx.beginPath();
  ctx.arc(W / 2, H - 20, 4, 0, Math.PI * 2);
  ctx.fill();

  // Penalty box ground line
  ctx.strokeStyle = "rgba(255,255,255,.3)";
  ctx.beginPath();
  ctx.moveTo((W - 280) / 2, H - 5);
  ctx.lineTo((W + 280) / 2, H - 5);
  ctx.stroke();
}

function drawKeeper(ctx, x, y) {
  // Body
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(x - 14, y - 25, 28, 40);
  // Head
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(x, y - 32, 12, 0, Math.PI * 2);
  ctx.fill();
  // Gloves
  ctx.fillStyle = "#fde68a";
  ctx.fillRect(x - 22, y - 20, 10, 18);
  ctx.fillRect(x + 12, y - 20, 10, 18);
}

function drawBall(ctx, x, y, r) {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, Math.max(2, r), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSave(ctx, x, y) {
  // Show keeper with ball
  drawKeeper(ctx, x, y);
  drawBall(ctx, x + (x < 240 ? 18 : -18), y - 10, 7);
}

function showPenaltyOverlay(text, canvas) {
  const wrap = canvas.parentElement;
  const old = wrap.querySelector(".penalty-result-overlay");
  if (old) old.remove();

  const div = document.createElement("div");
  div.className = "penalty-result-overlay";
  div.textContent = text;
  wrap.appendChild(div);
  setTimeout(() => { if (div.parentElement) div.remove(); }, 900);
}

function drawPenaltyCanvas() {
  const canvas = document.getElementById("penalty-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  drawField(ctx, canvas.width, canvas.height);
  drawKeeper(ctx, canvas.width / 2, 80);
}

function updatePenaltyLabels() {
  setHTML("penalty-kicks-label", `${penaltyState.kicksTaken + 1}/${penaltyState.kicks} atış`);
  setHTML("penalty-score-label", `${penaltyState.goals} qol`);
}

function renderPenaltyHistory() {
  const el = document.getElementById("penalty-history");
  if (!el) return;
  el.innerHTML = penaltyState.history.map(r =>
    `<span class="penalty-kick-icon ${r}">${r === "goal" ? "⚽" : "❌"}</span>`
  ).join("");
}

function endPenalty() {
  setHighScore("penalty", penaltyState.goals);

  showEl("penalty-result");
  hideEl("penalty-play");

  const goals = penaltyState.goals;
  const total = penaltyState.kicks;

  setHTML("penalty-result-score", `${goals} / ${total} qol`);

  let icon = "😔", msg = "Bir az məşq etmək lazımdır!";
  if (goals === total)     { icon = "🏆"; msg = "Mükəmməl! Bütün penaltiləri vurdunuz!"; }
  else if (goals >= 4)     { icon = "🌟"; msg = "Əla atış! Demək olar ki, mükəmməl!"; }
  else if (goals >= 3)     { icon = "⚽"; msg = "Yaxşı nəticə! Məşq etməyə davam edin."; }
  else if (goals >= 2)     { icon = "💪"; msg = "Ruhdan düşməyin, yenidən cəhd edin!"; }

  setHTML("penalty-result-icon", icon);
  setHTML("penalty-result-msg", escapeHTML(msg));
  renderHighScore("penalty-highscore", "penalty", "qol");
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPEED TRIVIA GAME
// ═══════════════════════════════════════════════════════════════════════════════
const SPEED_QUESTIONS = [
  { q: "Hansı ölkə 5 Dünya Çempionluğu qazanıb?",     opts:["Almaniya","Fransa","Braziliya","Argentina"],    ans:2 },
  { q: "Premier League-in kubokunun rəngi?",            opts:["Qızılı","Gümüşü","Bənövşəyi","Göy"],           ans:0 },
  { q: "UEFA Çempionlar Liqasının himnini kim yazdı?",  opts:["Handel","Beethoven","Tony Britten","Bach"],     ans:2 },
  { q: "Maradonanın Tanrının Əli golu neçənci ildə?",  opts:["1982","1984","1986","1990"],                    ans:2 },
  { q: "Cristiano Ronaldo hansı ölkəlidir?",            opts:["İspaniya","Braziliya","Portuqaliya","Fransa"],  ans:2 },
  { q: "Offsayd qaydasında neçə oyunçu olmalıdır?",    opts:["1","2","3","4"],                                ans:1 },
  { q: "Futbol topu neçə beşbucaqlı parçadan ibarətdir?",opts:["12","20","32","40"],                          ans:2 },
  { q: "Dünya Çempionatında bir matçda ən çox qol?",   opts:["14","12","10","17"],                            ans:3 },
  { q: "\"San Siro\" stadionu hansı şəhərdədir?",      opts:["Roma","Milan","Turin","Napoli"],                ans:1 },
  { q: "FIFA ən yaxşı qolkeeperi üçün hansı mükafat verir?", opts:["Lev Yashin","Neuer","Golden Glove","Ballon d'Or"], ans:2 },
  { q: "Real Madridin ləqəbi nədir?",                   opts:["Blaugrana","Galácticos","Los Blancos","Los Rojiblancos"], ans:2 },
  { q: "Qarabağ FK hansı şəhərə məxsusdur?",           opts:["Bakı","Gəncə","Ağdam","Sumqayıt"],              ans:2 },
  { q: "\"Hattrick\" nə deməkdir?",                    opts:["3 pas","3 gol","3 uduzmaq","3 kart"],           ans:1 },
  { q: "İlk Dünya Çempionatını qazanan ölkə?",         opts:["Braziliya","Argentina","Uruqvay","İtaliya"],    ans:2 },
  { q: "Beşbucaq sahəsinin radiusu nə qədərdir?",       opts:["9.15 m","10 m","7 m","5 m"],                   ans:0 },
  { q: "Standart futbol qapısının eni nə qədərdir?",    opts:["6 m","7.32 m","8 m","9 m"],                    ans:1 },
  { q: "Futbol matçında ən uzun oyun vaxtı neçə dəqiqədir?", opts:["90","120","180","240"],                   ans:1 },
  { q: "Penalti nişanı qapıdan neçə metr uzaqdadır?",  opts:["10 m","11 m","12 m","9 m"],                    ans:1 },
  { q: "UEFA Avro 2024 hansı ölkədə keçirildi?",       opts:["Fransa","Almaniya","İspaniya","İtaliya"],       ans:1 },
  { q: "Dünya futbolunun idarəetmə orqanı hansıdır?",  opts:["UEFA","CAF","FIFA","CONMEBOL"],                 ans:2 },
];

const speedState = {
  questions:    [],
  current:      0,
  score:        0,
  timeLeft:     30,
  timerInterval: null,
  answered:     false,
};

function startSpeed() {
  const shuffled = [...SPEED_QUESTIONS].sort(() => Math.random() - 0.5);
  Object.assign(speedState, {
    questions:    shuffled,
    current:      0,
    score:        0,
    timeLeft:     30,
    answered:     false,
  });

  showEl("speed-play");
  hideEl("speed-intro");
  hideEl("speed-result");

  showSpeedQuestion();
  startSpeedTimer();
}

function startSpeedTimer() {
  clearInterval(speedState.timerInterval);
  const bar = document.getElementById("speed-timer-bar");

  speedState.timerInterval = setInterval(() => {
    speedState.timeLeft--;
    const pct = (speedState.timeLeft / 30) * 100;
    if (bar) {
      bar.style.width = `${pct}%`;
      if (speedState.timeLeft <= 10) bar.className = "quiz-timer-bar danger";
      else if (speedState.timeLeft <= 15) bar.className = "quiz-timer-bar warning";
    }
    setHTML("speed-timer-val", String(speedState.timeLeft));

    if (speedState.timeLeft <= 0) {
      clearInterval(speedState.timerInterval);
      endSpeed();
    }
  }, 1000);
}

function showSpeedQuestion() {
  const state = speedState;
  const q = state.questions[state.current % state.questions.length];
  state.answered = false;

  setHTML("speed-score-display", `${state.score} xal`);
  setHTML("speed-question", escapeHTML(q.q));

  const opts = document.getElementById("speed-options");
  if (opts) {
    opts.innerHTML = q.opts.map((o, i) =>
      `<button class="quiz-option" data-idx="${i}" onclick="answerSpeed(${i})">${escapeHTML(o)}</button>`
    ).join("");
  }
}

function answerSpeed(idx) {
  const state = speedState;
  if (state.answered || state.timeLeft <= 0) return;
  state.answered = true;

  const q = state.questions[state.current % state.questions.length];
  const opts = document.querySelectorAll("#speed-options .quiz-option");
  opts.forEach(b => b.disabled = true);

  const correct = q.ans;
  opts.forEach(b => {
    const i = parseInt(b.dataset.idx, 10);
    if (i === correct) b.classList.add("correct");
    else if (i === idx) b.classList.add("wrong");
  });

  if (idx === correct) state.score++;
  setHTML("speed-score-display", `${state.score} xal`);

  state.current++;
  setTimeout(() => {
    if (state.timeLeft > 0) showSpeedQuestion();
  }, 500);
}

function endSpeed() {
  clearInterval(speedState.timerInterval);
  setHighScore("speed", speedState.score);

  showEl("speed-result");
  hideEl("speed-play");

  const s = speedState.score;
  setHTML("speed-result-score", `${s} doğru cavab`);

  let msg = "Bir az daha sürətli olun!";
  if (s >= 15)     msg = "Fenomenal! Siz sürətin şahısınız!";
  else if (s >= 10) msg = "Əla nəticə! Çox yaxşı biliyiniz var.";
  else if (s >= 6)  msg = "Yaxşı cəhd! Daha da sürətlənə bilərsiniz.";

  setHTML("speed-result-msg", escapeHTML(msg));
  renderHighScore("speed-highscore", "speed", "cavab");
}

// ═══════════════════════════════════════════════════════════════════════════════
// Shared DOM Helpers
// ═══════════════════════════════════════════════════════════════════════════════
function showEl(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}
function hideEl(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// ── Init: show high scores on page load ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderHighScore("trivia-highscore",  "trivia",  "xal");
  renderHighScore("predict-highscore", "predict", "xal");
  renderHighScore("penalty-highscore", "penalty", "qol");
  renderHighScore("speed-highscore",   "speed",   "cavab");
});
