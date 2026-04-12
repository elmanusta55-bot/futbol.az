"use strict";

const STANDINGS_LEAGUES = [
  { code: "PL", name: "🏴 Premier League" },
  { code: "PD", name: "🇪🇸 La Liga" },
  { code: "SA", name: "🇮🇹 Serie A" },
  { code: "BL1", name: "🇩🇪 Bundesliga" },
  { code: "FL1", name: "🇫🇷 Ligue 1" },
  { code: "CL", name: "🏆 Champions League" },
];

const AZE_LEAGUE = { code: "AZE", name: "🇦🇿 Azərbaycan PL", unavailable: true };

let currentCode = "PL";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function renderTabs() {
  const wrap = document.getElementById("league-tabs");
  if (!wrap) return;
  const allLeagues = [AZE_LEAGUE, ...STANDINGS_LEAGUES];
  wrap.innerHTML = allLeagues.map(l => {
    if (l.unavailable) {
      return `<button class="league-tab league-tab-disabled" title="Tezliklə əlavə olunacaq" disabled>${esc(l.name)} 🔜</button>`;
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
    const teamName = esc(team.name || "-");
    const teamLink = team.id
      ? `<a href="/team.html?id=${encodeURIComponent(team.id)}" class="team-link">${teamName}</a>`
      : teamName;

    return `<tr>
      <td>${r.position ?? "-"}</td>
      <td>
        <div class="team-cell">
          ${team.crest ? `<img src="${esc(team.crest)}" alt="${teamName}" loading="lazy">` : ""}
          <span>${teamLink}</span>
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

function renderClExtras(matches = []) {
  const badge = document.getElementById("cl-badge");
  const section = document.getElementById("cl-playoff");
  const body = document.getElementById("cl-playoff-body");

  const isCL = currentCode === "CL";
  if (badge) badge.hidden = !isCL;
  if (section) section.hidden = !isCL;
  if (!body) return;

  if (!isCL) {
    body.innerHTML = "";
    return;
  }

  if (!matches.length) {
    body.innerHTML = `<p class="page-msg">Playoff matçları tapılmadı.</p>`;
    return;
  }

  body.innerHTML = matches.map(m => {
    const home = esc(m.homeTeam?.shortName || m.homeTeam?.name || "-");
    const away = esc(m.awayTeam?.shortName || m.awayTeam?.name || "-");
    const score = `${m.score?.fullTime?.home ?? "-"} - ${m.score?.fullTime?.away ?? "-"}`;
    const when = m.utcDate ? new Date(m.utcDate).toLocaleString("az-AZ", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
    return `<article class="playoff-item">
      <div><strong>${home}</strong> vs <strong>${away}</strong></div>
      <div class="playoff-meta">${esc(m.stage || "KNOCKOUT")}${when ? ` · ${esc(when)}` : ""}</div>
      <div class="playoff-score">${score}</div>
    </article>`;
  }).join("");
}

async function loadClPlayoffMatches() {
  if (currentCode !== "CL") {
    renderClExtras([]);
    return;
  }

  try {
    const res = await fetch("/api/fd/competition/CL/matches?stage=KNOCKOUT");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta baş verdi");
    renderClExtras(data?.matches || []);
  } catch {
    renderClExtras([]);
  }
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
    await loadClPlayoffMatches();
    if (msg) msg.textContent = rows.length ? "" : "Cədvəl məlumatı tapılmadı.";
  } catch (e) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${e.message}`;
    renderClExtras([]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  loadStandings();
});
