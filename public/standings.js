"use strict";

const STANDINGS_LEAGUES = [
  { id: 683, key: "aze", name: "Azərbaycan Premyer Liqası" },
  { id: 39, key: "pl", name: "Premier League" },
  { id: 140, key: "laliga", name: "La Liga" },
  { id: 135, key: "seriea", name: "Serie A" },
  { id: 78, key: "bundesliga", name: "Bundesliga" }
];

let currentLeagueId = 683;

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, (s) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function renderTabs() {
  const wrap = document.getElementById("league-tabs");
  if (!wrap) return;
  wrap.innerHTML = STANDINGS_LEAGUES.map((l) => `
    <button class="league-tab ${l.id === currentLeagueId ? "active" : ""}" data-id="${l.id}">${esc(l.name)}</button>
  `).join("");
  wrap.querySelectorAll(".league-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLeagueId = Number(btn.dataset.id);
      renderTabs();
      loadStandings();
    });
  });
}

function extractRows(data) {
  return data?.response?.[0]?.league?.standings?.[0] || [];
}

function renderRows(rows) {
  const tbody = document.getElementById("standings-body");
  if (!tbody) return;
  tbody.innerHTML = rows.map((r) => {
    const team = r.team || {};
    const all = r.all || {};
    const gf = all.goals?.for ?? 0;
    const ga = all.goals?.against ?? 0;
    return `<tr>
      <td>${r.rank ?? "-"}</td>
      <td>
        <div class="team-cell">
          ${team.logo ? `<img src="${esc(team.logo)}" alt="${esc(team.name)}" loading="lazy">` : ""}
          <span>${esc(team.name || "-")}</span>
        </div>
      </td>
      <td>${all.played ?? 0}</td>
      <td>${all.win ?? 0}</td>
      <td>${all.lose ?? 0}</td>
      <td>${all.draw ?? 0}</td>
      <td>${gf}:${ga}</td>
      <td>${r.points ?? 0}</td>
    </tr>`;
  }).join("");
}

async function loadStandings() {
  const msg = document.getElementById("standings-msg");
  if (msg) msg.textContent = "Yüklənir...";
  try {
    const res = await fetch(`/api/standings/${currentLeagueId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");
    const rows = extractRows(data);
    renderRows(rows);
    if (msg) msg.textContent = rows.length ? "" : "Cədvəl məlumatı tapılmadı.";
  } catch (e) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${e.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  loadStandings();
});
