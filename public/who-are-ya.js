/* ═══════════════════════════════════════════════════════════════════
   FUTBOL.AZ – Who Are Ya? Standalone Game
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_ATTEMPTS  = 8;
const HINTS_ORDER   = ["position", "club", "nationality", "age", "initials", "number"];
const BASE_POINTS   = 200;
const ATTEMPT_PENALTY = 15;
const HINT_PENALTY    = 10;
const MIN_POINTS      = 10;
const MIN_GUESS_LENGTH = 3;

// ── State ──────────────────────────────────────────────────────────────────────
let _players     = [];
let _player      = null;
let _attempts    = 0;
let _hintsShown  = 0;
let _gameOver    = false;
let _score       = 0;
let _guesses     = [];

// ── HTML Escape ────────────────────────────────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Load players ───────────────────────────────────────────────────────────────
async function loadPlayers() {
  try {
    const res = await fetch("/data/who-are-ya.json");
    if (!res.ok) throw new Error("Failed to load players");
    _players = await res.json();
  } catch (err) {
    console.error("Could not load player data:", err);
    _players = [];
  }
}

// ── Pick random player ─────────────────────────────────────────────────────────
function pickPlayer() {
  if (!_players.length) return null;
  return _players[Math.floor(Math.random() * _players.length)];
}

// ── Hint helpers ───────────────────────────────────────────────────────────────
function getHintValue(player, hintKey) {
  switch (hintKey) {
    case "position":    return player.position;
    case "club":        return player.club;
    case "nationality": return player.nationality;
    case "age":         return `${player.age} yaş`;
    case "initials": {
      const parts = player.name.split(" ");
      return parts.map(p => p[0]).join(". ") + ".";
    }
    case "number":      return `#${player.number}`;
    default:            return "?";
  }
}

function getHintLabel(hintKey) {
  const map = {
    position:    "Mövqe",
    club:        "Klub",
    nationality: "Milliyyət",
    age:         "Yaş",
    initials:    "Baş hərflər",
    number:      "Nömrə",
  };
  return map[hintKey] || hintKey;
}

// ── Draw player silhouette on canvas ──────────────────────────────────────────
function drawPlayerCanvas(player, revealed) {
  const canvas = document.getElementById("way-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // Jersey gradient background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, player.col1 || "#003DA5");
  grad.addColorStop(1, player.col2 || "#CE1126");
  ctx.fillStyle = grad;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(0, 0, W, H, 12);
  } else {
    ctx.rect(0, 0, W, H);
  }
  ctx.fill();

  if (revealed) {
    // Show emoji large
    ctx.font = `${W * 0.45}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.emoji || "⚽", W / 2, H * 0.45);

    // Name below
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `bold ${W * 0.1}px Inter, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(player.name, W / 2, H * 0.82);
  } else {
    // Silhouette body
    ctx.fillStyle = "rgba(0,0,0,0.40)";
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.62, W * 0.27, H * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Silhouette head
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.24, W * 0.17, 0, Math.PI * 2);
    ctx.fill();

    // Jersey number hint
    ctx.fillStyle = "rgba(255,255,255,0.80)";
    ctx.font = `bold ${W * 0.3}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(player.number), W / 2, H * 0.62);
  }
}

// ── Render hints row ───────────────────────────────────────────────────────────
function renderHints() {
  const container = document.getElementById("way-hints");
  if (!container) return;

  let html = "";
  HINTS_ORDER.forEach((key, i) => {
    const revealed = i < _hintsShown;
    const label    = getHintLabel(key);
    const value    = revealed ? escapeHTML(getHintValue(_player, key)) : "?";
    html += `<div class="way-hint${revealed ? " way-hint-revealed" : ""}">
      <span class="way-hint-label">${escapeHTML(label)}</span>
      <span class="way-hint-value">${value}</span>
    </div>`;
  });

  container.innerHTML = html;
}

// ── Update attempts bar ────────────────────────────────────────────────────────
function updateAttemptsBar() {
  const el = document.getElementById("way-attempts");
  if (!el) return;
  const hearts = "❤️".repeat(MAX_ATTEMPTS - _attempts) + "🖤".repeat(_attempts);
  el.textContent = `${hearts}  (${MAX_ATTEMPTS - _attempts} cəhd qalıb)`;
}

// ── Show message ───────────────────────────────────────────────────────────────
function showMsg(text, type) {
  const el = document.getElementById("way-msg");
  if (!el) return;
  el.textContent = text;
  el.className = `way-msg ${type || ""}`;
}

// ── Calculate round score ──────────────────────────────────────────────────────
function calcScore() {
  return Math.max(MIN_POINTS, BASE_POINTS - _attempts * ATTEMPT_PENALTY - _hintsShown * HINT_PENALTY);
}

// ── Check guess ───────────────────────────────────────────────────────────────
function checkGuess() {
  if (_gameOver) return;
  const input = document.getElementById("way-input");
  if (!input) return;
  const raw   = input.value.trim();
  if (!raw) return;

  const guess = raw.toLowerCase();

  if (guess.length < MIN_GUESS_LENGTH) {
    showMsg(`⚠️ Ən azı ${MIN_GUESS_LENGTH} hərf daxil edin.`, "warn");
    return;
  }

  // Prevent duplicate guesses
  if (_guesses.includes(guess)) {
    showMsg("Bu cavabı artıq vermisiniz!", "warn");
    return;
  }
  _guesses.push(guess);

  // Render guess in list
  appendGuessItem(raw, false);

  // Check correctness: exact alias match, or guess is contained in full name, or last name match
  const playerName  = _player.name.toLowerCase();
  const lastName    = playerName.split(" ").slice(-1)[0];
  const correct     = _player.aliases.some(a => guess === a)
    || playerName === guess
    || (guess.length >= MIN_GUESS_LENGTH && lastName === guess);

  input.value = "";

  if (correct) {
    endGame(true);
  } else {
    _attempts++;
    // Reveal next hint every 2 wrong attempts (up to all hints)
    if (_hintsShown < HINTS_ORDER.length && _attempts % 2 === 0) {
      _hintsShown++;
      renderHints();
    }
    updateAttemptsBar();
    showMsg("❌ Yanlış! Yenidən cəhd edin.", "wrong");

    if (_attempts >= MAX_ATTEMPTS) {
      endGame(false);
    }
  }
}

// ── Reveal a hint manually ────────────────────────────────────────────────────
function revealHint() {
  if (_gameOver || _hintsShown >= HINTS_ORDER.length) return;
  _hintsShown++;
  renderHints();
  showMsg(`💡 İpucu açıldı: ${getHintLabel(HINTS_ORDER[_hintsShown - 1])}`, "info");
}

// ── Append guess to list ──────────────────────────────────────────────────────
function appendGuessItem(text, isCorrect) {
  const list = document.getElementById("way-guess-list");
  if (!list) return;
  const li = document.createElement("li");
  li.className = `way-guess-item${isCorrect ? " correct" : " wrong"}`;
  li.textContent = text;
  list.prepend(li);
}

// ── End game ──────────────────────────────────────────────────────────────────
function endGame(won) {
  _gameOver = true;

  if (won) {
    const pts = calcScore();
    _score += pts;
    showMsg(`🎉 Düzgün! Bu ${_player.name} idi! +${pts} xal`, "correct");
    appendGuessItem(_player.name, true);
  } else {
    showMsg(`😔 Bu ${_player.name} idi!`, "wrong");
  }

  // Reveal player on canvas
  const blurWrap = document.getElementById("way-blur-wrap");
  if (blurWrap) blurWrap.style.filter = "blur(0px)";
  drawPlayerCanvas(_player, true);

  // Update score
  const scoreEl = document.getElementById("way-score");
  if (scoreEl) scoreEl.textContent = _score;

  // Show result overlay
  const overlay = document.getElementById("way-result");
  if (overlay) {
    const pts = calcScore();
    overlay.hidden = false;
    document.getElementById("way-result-emoji").textContent = won ? "🎉" : "😔";
    document.getElementById("way-result-title").textContent = won ? "Düzgün tapdınız!" : "Yanıldınız!";
    document.getElementById("way-result-player").textContent = _player.name;
    document.getElementById("way-result-score").textContent = won ? `+${pts} xal` : "";
  }

  // Disable input and submit
  const inputEl = document.getElementById("way-input");
  if (inputEl) inputEl.disabled = true;
  const submitBtn = document.getElementById("way-submit-btn");
  if (submitBtn) submitBtn.disabled = true;
  const hintBtn = document.getElementById("way-hint-btn");
  if (hintBtn) hintBtn.disabled = true;
}

// ── Start / New game ──────────────────────────────────────────────────────────
function newGame() {
  _player     = pickPlayer();
  _attempts   = 0;
  _hintsShown = 1; // always show position hint at start
  _gameOver   = false;
  _guesses    = [];

  if (!_player) {
    document.getElementById("way-loading").hidden  = false;
    document.getElementById("way-game").hidden     = true;
    return;
  }

  // Reset UI
  document.getElementById("way-loading").hidden  = true;
  document.getElementById("way-game").hidden     = false;
  const overlay = document.getElementById("way-result");
  if (overlay) overlay.hidden = true;

  const inputEl = document.getElementById("way-input");
  if (inputEl) { inputEl.disabled = false; inputEl.value = ""; inputEl.focus(); }
  const submitBtn = document.getElementById("way-submit-btn");
  if (submitBtn) submitBtn.disabled = false;
  const hintBtn = document.getElementById("way-hint-btn");
  if (hintBtn) hintBtn.disabled = false;

  const guessList = document.getElementById("way-guess-list");
  if (guessList) guessList.innerHTML = "";

  // Draw blurred canvas
  const blurWrap = document.getElementById("way-blur-wrap");
  if (blurWrap) blurWrap.style.filter = "blur(22px)";
  drawPlayerCanvas(_player, false);

  renderHints();
  updateAttemptsBar();
  showMsg("", "");
}

// ── Theme ──────────────────────────────────────────────────────────────────────
function toggleWayTheme() {
  const html     = document.documentElement;
  const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("futbol-theme", newTheme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

function initWayTheme() {
  const saved = localStorage.getItem("futbol-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = saved === "dark" ? "🌙" : "☀️";
}

// ── Mobile menu ────────────────────────────────────────────────────────────────
function toggleWayMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger");
  if (!menu) return;
  const isHidden = menu.hidden;
  menu.hidden = !isHidden;
  if (btn) btn.setAttribute("aria-expanded", String(isHidden));
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  initWayTheme();

  // Keyboard shortcut: Enter to submit
  const input = document.getElementById("way-input");
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") checkGuess();
    });
  }

  // Load players and start first game
  await loadPlayers();
  newGame();
});
