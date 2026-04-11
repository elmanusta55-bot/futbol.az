"use strict";

const SCORER_LEAGUES = [
  { id: 683, name: "Azərbaycan Premyer Liqası" },
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" }
];

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, (s) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function initLeagueSelect() {
  const select = document.getElementById("league-select");
  if (!select) return;
  select.innerHTML = SCORER_LEAGUES.map((l) => `<option value="${l.id}">${esc(l.name)}</option>`).join("");
  select.addEventListener("change", () => loadScorers(Number(select.value)));
  loadScorers(Number(select.value || 683));
}

function renderRows(players) {
  const tbody = document.getElementById("scorers-body");
  if (!tbody) return;
  tbody.innerHTML = players.map((p, idx) => {
    const stats = p.statistics?.[0] || {};
    return `<tr>
      <td>${idx + 1}</td>
      <td>${esc(p.player?.name || "-")}</td>
      <td>${esc(stats.team?.name || "-")}</td>
      <td>${stats.games?.appearences ?? 0}</td>
      <td>${stats.goals?.total ?? 0}</td>
      <td>${stats.goals?.assists ?? 0}</td>
    </tr>`;
  }).join("");
}

async function loadScorers(leagueId) {
  const msg = document.getElementById("scorers-msg");
  if (msg) msg.textContent = "Yüklənir...";
  try {
    const res = await fetch(`/api/top-scorers/${leagueId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");
    const players = data?.response || [];
    renderRows(players);
    if (msg) msg.textContent = players.length ? "" : "Qolçu məlumatı tapılmadı.";
  } catch (e) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${e.message}`;
  }
}

document.addEventListener("DOMContentLoaded", initLeagueSelect);
