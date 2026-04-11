"use strict";

let debounceTimer = null;

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, (s) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function renderTeams(teams) {
  const grid = document.getElementById("teams-grid");
  if (!grid) return;
  grid.innerHTML = teams.map((item) => {
    const team = item.team || {};
    const venue = item.venue || {};
    const league = item.league?.name || "Məlumat yoxdur";
    return `<article class="team-card">
      <div class="team-head">
        ${team.logo ? `<img src="${esc(team.logo)}" alt="${esc(team.name)}" loading="lazy">` : ""}
        <strong>${esc(team.name || "-")}</strong>
      </div>
      <div class="team-meta">🌍 ${esc(team.country || venue.country || "-")}</div>
      <div class="team-meta">🏆 ${esc(league)}</div>
    </article>`;
  }).join("");
}

async function searchTeams(query) {
  const msg = document.getElementById("teams-msg");
  if (query.length < 2) {
    renderTeams([]);
    if (msg) msg.textContent = "Ən azı 2 hərf yazın.";
    return;
  }
  if (msg) msg.textContent = "Axtarılır...";
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");
    const teams = data?.response || [];
    renderTeams(teams);
    if (msg) msg.textContent = teams.length ? "" : "Nəticə tapılmadı.";
  } catch (e) {
    if (msg) msg.textContent = `Axtarış alınmadı: ${e.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("team-search");
  if (!input) return;
  input.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => searchTeams(e.target.value.trim()), 300);
  });
});
