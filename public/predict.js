"use strict";

const PRED_KEY = "faz_predictions";
const POINTS_KEY = "faz_prediction_points";
const AWARDED_KEY = "faz_prediction_awarded";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getWinner(match) {
  const home = match.score?.fullTime?.home;
  const away = match.score?.fullTime?.away;
  if (home == null || away == null) return null;
  if (home > away) return "H";
  if (home < away) return "A";
  return "D";
}

function updateScoreUI() {
  const score = Number(localStorage.getItem(POINTS_KEY) || 0);
  const box = document.getElementById("predict-score");
  if (box) box.textContent = `Ümumi xal: ${score}`;
}

function awardPoints(matches, predictions) {
  const awarded = readJson(AWARDED_KEY, {});
  let total = Number(localStorage.getItem(POINTS_KEY) || 0);

  matches.forEach((m) => {
    if (m.status !== "FINISHED") return;
    const id = String(m.id);
    if (awarded[id]) return;

    const predicted = predictions[id];
    const winner = getWinner(m);
    if (!predicted || !winner) return;

    if (predicted === winner) {
      total += winner === "D" ? 1 : 3;
    }

    awarded[id] = true;
  });

  localStorage.setItem(POINTS_KEY, String(total));
  writeJson(AWARDED_KEY, awarded);
}

function renderMatches(matches) {
  const list = document.getElementById("predict-list");
  const msg = document.getElementById("predict-msg");
  if (!list) return;

  const predictions = readJson(PRED_KEY, {});
  awardPoints(matches, predictions);
  updateScoreUI();

  const items = matches
    .filter((m) => ["TIMED", "SCHEDULED", "IN_PLAY", "PAUSED", "FINISHED"].includes(m.status))
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

  if (!items.length) {
    list.innerHTML = "";
    if (msg) msg.textContent = "Bu gün üçün uyğun matç tapılmadı.";
    return;
  }

  list.innerHTML = items.map((m) => {
    const id = String(m.id);
    const picked = predictions[id] || "";
    const home = esc(m.homeTeam?.shortName || m.homeTeam?.name || "Ev");
    const away = esc(m.awayTeam?.shortName || m.awayTeam?.name || "Qonaq");
    const actual = getWinner(m);

    let resultText = "";
    if (m.status === "FINISHED" && picked) {
      const ok = picked === actual;
      const pts = ok ? (actual === "D" ? 1 : 3) : 0;
      resultText = `Nəticə: ${ok ? "✅ Düzgün" : "❌ Səhv"} (+${pts} xal)`;
    }

    return `<article class="predict-card">
      <div class="predict-title">${home} vs ${away}</div>
      <div class="predict-options" data-match-id="${id}">
        <label><input type="radio" name="pred-${id}" value="H" ${picked === "H" ? "checked" : ""}> Ev sahibi qazanır</label>
        <label><input type="radio" name="pred-${id}" value="D" ${picked === "D" ? "checked" : ""}> Heç-heç</label>
        <label><input type="radio" name="pred-${id}" value="A" ${picked === "A" ? "checked" : ""}> Qonaq qazanır</label>
      </div>
      <div class="predict-result">${resultText || "Matç davam edir / başlamayıb"}</div>
    </article>`;
  }).join("");

  list.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", () => {
      const matchId = input.name.replace("pred-", "");
      const next = readJson(PRED_KEY, {});
      next[matchId] = input.value;
      writeJson(PRED_KEY, next);
      renderMatches(matches);
    });
  });

  if (msg) msg.textContent = "";
}

async function init() {
  const msg = document.getElementById("predict-msg");
  updateScoreUI();

  try {
    const res = await fetch("/api/fd/today");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");
    renderMatches(data?.matches || []);
  } catch (err) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", init);
