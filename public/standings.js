"use strict";

const STANDINGS_LEAGUES = [
  { code: "PL",  name: "🏴 Premier League" },
  { code: "PD",  name: "🇪🇸 La Liga" },
  { code: "SA",  name: "🇮🇹 Serie A" },
  { code: "BL1", name: "🇩🇪 Bundesliga" },
  { code: "FL1", name: "🇫🇷 Ligue 1" },
  { code: "CL",  name: "🏆 Champions League" },
];

const AZE_LEAGUE = { code: "AZE", name: "🇦🇿 Azərbaycan PL", unavailable: true };

let currentCode = "PL";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function renderTabs() {
  const wrap = document.getElementById("league-tabs");
  if (!wrap) return;

  const allLeagues = [AZE_LEAGUE, ...STANDINGS_LEAGUES];

  wrap.innerHTML = allLeagues.map(l => {
    if (l.unavailable) {
      return `<button class="league-tab league-tab-disabled" title="🔜 Tezliklə" disabled>${esc(l.name)} 🔜</button>`;
    }
    return `<button class="league-tab ${l.code === currentCode ? "active" : ""}" data-code="${l.code}">${esc(l.name)}</button>`;
  }).join("");

  wrap.querySelectorAll(".league-tab:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCode = btn.dataset.code;
      renderTabs();
      loadStandings();
    });
  });
}

function extractTable(data) {
  const standings = data?.standings || [];
  const total = standings.find(s => s.type === "TOTAL") || standings[0];
  return total?.table || [];
}

function renderRows(rows) {
  const tbody = document.getElementById("standings-body");
  if (!tbody) return;
  tbody.innerHTML = rows.map(r => {
    const team = r.team || {};
    return `<tr>
      <td>${r.position ?? "-"}</td>
      <td>
        <div class="team-cell">
          ${team.crest ? `<img src="${esc(team.crest)}" alt="${esc(team.name)}" loading="lazy">` : ""}
          <span>${esc(team.name || "-")}</span>
        </div>
      </td>
      <td>${r.playedGames ?? 0}</td>
      <td>${r.won ?? 0}</td>
      <td>${r.lost ?? 0}</td>
      <td>${r.draw ?? 0}</td>
      <td>${r.goalsFor ?? 0}:${r.goalsAgainst ?? 0}</td>
      <td><strong>${r.points ?? 0}</strong></td>
    </tr>`;
  }).join("");
}

async function loadStandings() {
  const msg = document.getElementById("standings-msg");
  const tbody = document.getElementById("standings-body");
  if (msg) msg.textContent = "Yüklənir...";
  if (tbody) tbody.innerHTML = "";
  try {
    const res = await fetch(`/api/fd/standings/${currentCode}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta baş verdi");
    const rows = extractTable(data);
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
