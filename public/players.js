"use strict";

const LEAGUES = [
  { code: "PL", name: "🏴 PL" },
  { code: "PD", name: "🇪🇸 La Liga" },
  { code: "SA", name: "🇮🇹 Serie A" },
  { code: "BL1", name: "🇩🇪 Bundesliga" },
  { code: "FL1", name: "🇫🇷 Ligue 1" },
];

let currentLeague = "PL";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function renderTabs() {
  const wrap = document.getElementById("league-tabs");
  if (!wrap) return;

  wrap.innerHTML = LEAGUES.map((league) =>
    `<button class="league-tab ${league.code === currentLeague ? "active" : ""}" data-code="${league.code}">${esc(league.name)}</button>`
  ).join("");

  wrap.querySelectorAll(".league-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLeague = btn.dataset.code;
      renderTabs();
      loadScorers();
    });
  });
}

function renderRows(scorers) {
  const body = document.getElementById("players-body");
  if (!body) return;

  body.innerHTML = scorers.map((item, idx) => {
    const team = item.team || {};
    return `<tr>
      <td>${idx + 1}</td>
      <td>${esc(item.player?.name || "-")}</td>
      <td>
        <div class="team-mini">
          ${team.crest ? `<img src="${esc(team.crest)}" alt="${esc(team.name || "")}" loading="lazy">` : ""}
          <span>${esc(team.name || "-")}</span>
        </div>
      </td>
      <td>${item.playedMatches ?? 0}</td>
      <td><strong>${item.goals ?? 0}</strong></td>
      <td>${item.assists ?? 0}</td>
    </tr>`;
  }).join("");
}

async function loadScorers() {
  const msg = document.getElementById("players-msg");
  if (msg) msg.textContent = "Yüklənir...";

  try {
    const res = await fetch(`/api/fd/scorers/${currentLeague}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");

    const scorers = data?.scorers || [];
    renderRows(scorers);
    if (msg) msg.textContent = scorers.length ? "" : "Oyunçu məlumatı tapılmadı.";
  } catch (err) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  loadScorers();
});
