/* =============================================
   FUTBOL.AZ – Application JavaScript
   ============================================= */

"use strict";

// ── Static League Data ────────────────────────────────────────────────────────
const LEAGUES = {
  aze: {
    id: 683,
    name: "Azərbaycan Premyer Liqası",
    flag: "🇦🇿",
    standings: [
      { pos: 1,  team: "Qarabağ FK",   p: 30, w: 24, d: 4, l: 2,  gf: 71, ga: 20, gd: 51, pts: 76 },
      { pos: 2,  team: "Neftçi PFK",   p: 30, w: 19, d: 5, l: 6,  gf: 55, ga: 28, gd: 27, pts: 62 },
      { pos: 3,  team: "Sumqayıt FK",  p: 30, w: 16, d: 6, l: 8,  gf: 48, ga: 35, gd: 13, pts: 54 },
      { pos: 4,  team: "Sabah FK",     p: 30, w: 14, d: 7, l: 9,  gf: 42, ga: 38, gd:  4, pts: 49 },
      { pos: 5,  team: "Kəpəz FK",     p: 30, w: 12, d: 8, l: 10, gf: 40, ga: 42, gd: -2, pts: 44 },
      { pos: 6,  team: "Zirə FK",      p: 30, w: 12, d: 6, l: 12, gf: 38, ga: 42, gd: -4, pts: 42 },
      { pos: 7,  team: "Inter Baku",   p: 30, w: 11, d: 5, l: 14, gf: 35, ga: 46, gd:-11, pts: 38 },
      { pos: 8,  team: "Şamaxı FK",    p: 30, w: 10, d: 5, l: 15, gf: 33, ga: 48, gd:-15, pts: 35 },
      { pos: 9,  team: "Sabail FK",    p: 30, w:  7, d: 7, l: 16, gf: 28, ga: 50, gd:-22, pts: 28 },
      { pos: 10, team: "Keşlə FK",     p: 30, w:  7, d: 6, l: 17, gf: 26, ga: 54, gd:-28, pts: 27 },
      { pos: 11, team: "Turan Tovuz",  p: 30, w:  5, d: 7, l: 18, gf: 22, ga: 58, gd:-36, pts: 22 },
      { pos: 12, team: "AZAL FK",      p: 30, w:  3, d: 4, l: 23, gf: 16, ga: 73, gd:-57, pts: 13 },
    ],
    topScorers: [
      { name: "Ramil Şeydayev",  team: "Qarabağ FK",  goals: 19 },
      { name: "Mahir Emreli",    team: "Qarabağ FK",  goals: 17 },
      { name: "Klaudio Djordic", team: "Neftçi PFK",  goals: 14 },
      { name: "Murad Hüseynov",  team: "Sabah FK",    goals: 12 },
      { name: "Tural Bayramov",  team: "Sumqayıt FK", goals: 10 },
    ],
  },

  pl: {
    id: 39,
    name: "Premier League",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    standings: [
      { pos: 1, team: "Liverpool",      p: 34, w: 25, d: 6, l: 3,  gf: 78, ga: 32, gd: 46, pts: 81 },
      { pos: 2, team: "Arsenal",        p: 34, w: 21, d: 8, l: 5,  gf: 65, ga: 36, gd: 29, pts: 71 },
      { pos: 3, team: "Chelsea",        p: 34, w: 18, d: 7, l: 9,  gf: 62, ga: 45, gd: 17, pts: 61 },
      { pos: 4, team: "Nottm Forest",   p: 34, w: 17, d: 7, l: 10, gf: 55, ga: 43, gd: 12, pts: 58 },
      { pos: 5, team: "Newcastle",      p: 34, w: 16, d: 9, l: 9,  gf: 58, ga: 44, gd: 14, pts: 57 },
      { pos: 6, team: "Man City",       p: 34, w: 16, d: 7, l: 11, gf: 60, ga: 50, gd: 10, pts: 55 },
      { pos: 7, team: "Tottenham",      p: 34, w: 15, d: 6, l: 13, gf: 56, ga: 56, gd:  0, pts: 51 },
      { pos: 8, team: "Aston Villa",    p: 34, w: 15, d: 5, l: 14, gf: 52, ga: 56, gd: -4, pts: 50 },
      { pos: 9, team: "Brighton",       p: 34, w: 14, d: 7, l: 13, gf: 53, ga: 54, gd: -1, pts: 49 },
      { pos: 10, team: "Fulham",        p: 34, w: 12, d: 9, l: 13, gf: 50, ga: 54, gd: -4, pts: 45 },
      { pos: 11, team: "Brentford",     p: 34, w: 12, d: 8, l: 14, gf: 55, ga: 62, gd: -7, pts: 44 },
      { pos: 12, team: "Man United",    p: 34, w: 11, d: 8, l: 15, gf: 43, ga: 55, gd:-12, pts: 41 },
      { pos: 13, team: "West Ham",      p: 34, w: 10, d: 8, l: 16, gf: 38, ga: 58, gd:-20, pts: 38 },
      { pos: 14, team: "Everton",       p: 34, w: 10, d: 6, l: 18, gf: 35, ga: 60, gd:-25, pts: 36 },
      { pos: 15, team: "Wolves",        p: 34, w:  8, d: 9, l: 17, gf: 38, ga: 64, gd:-26, pts: 33 },
      { pos: 16, team: "Crystal Palace",p: 34, w:  8, d: 8, l: 18, gf: 36, ga: 60, gd:-24, pts: 32 },
      { pos: 17, team: "Ipswich",       p: 34, w:  6, d: 8, l: 20, gf: 30, ga: 68, gd:-38, pts: 26 },
      { pos: 18, team: "Leicester",     p: 34, w:  5, d: 7, l: 22, gf: 28, ga: 70, gd:-42, pts: 22 },
      { pos: 19, team: "Southampton",   p: 34, w:  4, d: 5, l: 25, gf: 22, ga: 78, gd:-56, pts: 17 },
      { pos: 20, team: "Sunderland",    p: 34, w:  3, d: 6, l: 25, gf: 20, ga: 80, gd:-60, pts: 15 },
    ],
    topScorers: [
      { name: "Mohamed Salah",   team: "Liverpool",  goals: 27 },
      { name: "Cole Palmer",     team: "Chelsea",    goals: 20 },
      { name: "Alexander Isak",  team: "Newcastle",  goals: 19 },
      { name: "Bryan Mbeumo",    team: "Brentford",  goals: 18 },
      { name: "Bukayo Saka",     team: "Arsenal",    goals: 16 },
    ],
  },

  laliga: {
    id: 140,
    name: "La Liga",
    flag: "🇪🇸",
    standings: [
      { pos: 1, team: "Real Madrid",    p: 32, w: 22, d: 5, l: 5,  gf: 74, ga: 38, gd: 36, pts: 71 },
      { pos: 2, team: "Barcelona",      p: 32, w: 21, d: 4, l: 7,  gf: 68, ga: 42, gd: 26, pts: 67 },
      { pos: 3, team: "Atletico Madrid",p: 32, w: 20, d: 5, l: 7,  gf: 60, ga: 36, gd: 24, pts: 65 },
      { pos: 4, team: "Villarreal",     p: 32, w: 16, d: 7, l: 9,  gf: 54, ga: 46, gd:  8, pts: 55 },
      { pos: 5, team: "Athletic Club",  p: 32, w: 15, d: 8, l: 9,  gf: 48, ga: 38, gd: 10, pts: 53 },
      { pos: 6, team: "Real Betis",     p: 32, w: 14, d: 8, l: 10, gf: 46, ga: 44, gd:  2, pts: 50 },
      { pos: 7, team: "Real Sociedad",  p: 32, w: 13, d: 7, l: 12, gf: 44, ga: 46, gd: -2, pts: 46 },
      { pos: 8, team: "Sevilla",        p: 32, w: 11, d: 9, l: 12, gf: 42, ga: 48, gd: -6, pts: 42 },
      { pos: 9, team: "Valencia",       p: 32, w: 10, d: 8, l: 14, gf: 36, ga: 52, gd:-16, pts: 38 },
      { pos: 10, team: "Girona",        p: 32, w: 10, d: 7, l: 15, gf: 42, ga: 58, gd:-16, pts: 37 },
      { pos: 11, team: "Celta Vigo",    p: 32, w:  9, d: 8, l: 15, gf: 38, ga: 54, gd:-16, pts: 35 },
      { pos: 12, team: "Mallorca",      p: 32, w:  9, d: 7, l: 16, gf: 34, ga: 52, gd:-18, pts: 34 },
      { pos: 13, team: "Osasuna",       p: 32, w:  8, d: 9, l: 15, gf: 32, ga: 48, gd:-16, pts: 33 },
      { pos: 14, team: "Getafe",        p: 32, w:  8, d: 8, l: 16, gf: 30, ga: 50, gd:-20, pts: 32 },
      { pos: 15, team: "Rayo Vallecano",p: 32, w:  7, d: 9, l: 16, gf: 30, ga: 52, gd:-22, pts: 30 },
      { pos: 16, team: "Deportivo ALC", p: 32, w:  7, d: 8, l: 17, gf: 30, ga: 58, gd:-28, pts: 29 },
      { pos: 17, team: "Leganes",       p: 32, w:  7, d: 7, l: 18, gf: 28, ga: 58, gd:-30, pts: 28 },
      { pos: 18, team: "Valladolid",    p: 32, w:  5, d: 7, l: 20, gf: 24, ga: 68, gd:-44, pts: 22 },
      { pos: 19, team: "Las Palmas",    p: 32, w:  4, d: 8, l: 20, gf: 22, ga: 66, gd:-44, pts: 20 },
      { pos: 20, team: "Espanyol",      p: 32, w:  3, d: 6, l: 23, gf: 18, ga: 74, gd:-56, pts: 15 },
    ],
    topScorers: [
      { name: "Kylian Mbappé",     team: "Real Madrid",     goals: 26 },
      { name: "Robert Lewandowski",team: "Barcelona",        goals: 24 },
      { name: "Julián Álvarez",    team: "Atletico Madrid",  goals: 18 },
      { name: "Vinicius Jr.",      team: "Real Madrid",      goals: 17 },
      { name: "Dani Olmo",         team: "Barcelona",        goals: 14 },
    ],
  },

  seriea: {
    id: 135,
    name: "Serie A",
    flag: "🇮🇹",
    standings: [
      { pos: 1, team: "Napoli",      p: 32, w: 22, d: 5, l: 5,  gf: 66, ga: 30, gd: 36, pts: 71 },
      { pos: 2, team: "Inter Milan", p: 32, w: 21, d: 5, l: 6,  gf: 68, ga: 36, gd: 32, pts: 68 },
      { pos: 3, team: "Atalanta",    p: 32, w: 19, d: 7, l: 6,  gf: 72, ga: 38, gd: 34, pts: 64 },
      { pos: 4, team: "Juventus",    p: 32, w: 17, d: 9, l: 6,  gf: 54, ga: 32, gd: 22, pts: 60 },
      { pos: 5, team: "Lazio",       p: 32, w: 16, d: 6, l: 10, gf: 58, ga: 46, gd: 12, pts: 54 },
      { pos: 6, team: "Fiorentina",  p: 32, w: 14, d: 9, l: 9,  gf: 52, ga: 44, gd:  8, pts: 51 },
      { pos: 7, team: "AC Milan",    p: 32, w: 14, d: 7, l: 11, gf: 52, ga: 48, gd:  4, pts: 49 },
      { pos: 8, team: "Bologna",     p: 32, w: 13, d: 7, l: 12, gf: 48, ga: 48, gd:  0, pts: 46 },
      { pos: 9, team: "Roma",        p: 32, w: 12, d: 8, l: 12, gf: 46, ga: 50, gd: -4, pts: 44 },
      { pos: 10, team: "Torino",     p: 32, w: 11, d: 8, l: 13, gf: 40, ga: 48, gd: -8, pts: 41 },
    ],
    topScorers: [
      { name: "Mateo Retegui",   team: "Atalanta",    goals: 24 },
      { name: "Lautaro Martínez",team: "Inter Milan",  goals: 20 },
      { name: "Marcus Thuram",   team: "Inter Milan",  goals: 17 },
      { name: "Ademola Lookman", team: "Atalanta",     goals: 16 },
      { name: "Romelu Lukaku",   team: "Napoli",       goals: 15 },
    ],
  },

  bundesliga: {
    id: 78,
    name: "Bundesliga",
    flag: "🇩🇪",
    standings: [
      { pos: 1, team: "Bayern Munich",   p: 30, w: 22, d: 4, l: 4,  gf: 82, ga: 34, gd: 48, pts: 70 },
      { pos: 2, team: "Bayer Leverkusen",p: 30, w: 19, d: 5, l: 6,  gf: 70, ga: 38, gd: 32, pts: 62 },
      { pos: 3, team: "Eintracht Frankfurt",p:30,w:17, d: 7, l: 6,  gf: 60, ga: 36, gd: 24, pts: 58 },
      { pos: 4, team: "RB Leipzig",      p: 30, w: 16, d: 5, l: 9,  gf: 58, ga: 42, gd: 16, pts: 53 },
      { pos: 5, team: "Borussia Dortmund",p:30, w: 15, d: 6, l: 9,  gf: 56, ga: 44, gd: 12, pts: 51 },
      { pos: 6, team: "VfB Stuttgart",   p: 30, w: 14, d: 5, l: 11, gf: 52, ga: 46, gd:  6, pts: 47 },
      { pos: 7, team: "Freiburg",        p: 30, w: 12, d: 8, l: 10, gf: 46, ga: 46, gd:  0, pts: 44 },
      { pos: 8, team: "Werder Bremen",   p: 30, w: 11, d: 7, l: 12, gf: 44, ga: 50, gd: -6, pts: 40 },
      { pos: 9, team: "Borussia Mönchengladbach",p:30,w:10,d:9,l:11,gf:40,ga:46,gd:-6,pts:39},
      { pos: 10, team: "Augsburg",       p: 30, w:  9, d: 8, l: 13, gf: 36, ga: 52, gd:-16, pts: 35 },
    ],
    topScorers: [
      { name: "Harry Kane",       team: "Bayern Munich",    goals: 28 },
      { name: "Omar Marmoush",    team: "Eintracht Frankfurt", goals: 22 },
      { name: "Serhou Guirassy",  team: "Borussia Dortmund", goals: 18 },
      { name: "Victor Boniface",  team: "Bayer Leverkusen", goals: 16 },
      { name: "Patrik Schick",    team: "Bayer Leverkusen", goals: 14 },
    ],
  },
};

// ── State ─────────────────────────────────────────────────────────────────────
let currentLeague = "aze";
let currentUser = null;

// ── DOM Helpers ───────────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Standings ─────────────────────────────────────────────────────────────────
function getZoneClass(league, pos) {
  if (league === "aze") {
    if (pos <= 1) return "cl";
    if (pos <= 4) return "el";
    if (pos >= 11) return "rel";
  } else {
    if (pos <= 4) return "cl";
    if (pos <= 6) return "el";
    if (pos >= 18) return "rel";
  }
  return "normal";
}

function renderStandings(leagueKey) {
  const league = LEAGUES[leagueKey];
  const tbody = $("#standings-body");
  if (!tbody) return;

  tbody.innerHTML = league.standings
    .map((row) => {
      const zone = getZoneClass(leagueKey, row.pos);
      return `
        <tr>
          <td class="rank"><span class="rank-badge ${zone}">${row.pos}</span></td>
          <td class="team-name">${row.team}</td>
          <td class="num">${row.p}</td>
          <td class="num">${row.w}</td>
          <td class="num">${row.d}</td>
          <td class="num">${row.l}</td>
          <td class="num">${row.gf}</td>
          <td class="num">${row.ga}</td>
          <td class="num">${row.gd > 0 ? "+" + row.gd : row.gd}</td>
          <td class="pts">${row.pts}</td>
        </tr>`;
    })
    .join("");

  // Update heading
  const heading = $("#standings-heading");
  if (heading) heading.textContent = `${league.flag} ${league.name} – Cədvəl`;

  // Try to load from API (non-blocking)
  fetchStandingsFromAPI(leagueKey);
}

async function fetchStandingsFromAPI(leagueKey) {
  try {
    const res = await fetch(`/standings/${LEAGUES[leagueKey].id}`);
    if (!res.ok) return;
    const data = await res.json();
    const rows = data?.response?.[0]?.league?.standings?.[0];
    if (!rows || rows.length === 0) return;

    const tbody = $("#standings-body");
    if (!tbody) return;
    tbody.innerHTML = rows
      .map((r) => {
        const zone = getZoneClass(leagueKey, r.rank);
        const gd = r.goalsDiff;
        return `
          <tr>
            <td class="rank"><span class="rank-badge ${zone}">${r.rank}</span></td>
            <td class="team-name">${r.team.name}</td>
            <td class="num">${r.all.played}</td>
            <td class="num">${r.all.win}</td>
            <td class="num">${r.all.draw}</td>
            <td class="num">${r.all.lose}</td>
            <td class="num">${r.all.goals.for}</td>
            <td class="num">${r.all.goals.against}</td>
            <td class="num">${gd > 0 ? "+" + gd : gd}</td>
            <td class="pts">${r.points}</td>
          </tr>`;
      })
      .join("");
  } catch {
    // Silently fall back to static data
  }
}

// ── Top Scorers ───────────────────────────────────────────────────────────────
function renderTopScorers(leagueKey) {
  const league = LEAGUES[leagueKey];
  const list = $("#scorers-list");
  if (!list) return;

  list.innerHTML = league.topScorers
    .map((s, i) => `
      <li class="scorer-item">
        <div class="scorer-rank ${i < 3 ? "top" : ""}">${i + 1}</div>
        <div class="scorer-info">
          <div class="scorer-name">${s.name}</div>
          <div class="scorer-team">${s.team}</div>
        </div>
        <div class="scorer-goals">${s.goals}<span>qol</span></div>
      </li>`)
    .join("");
}

// ── Live Scores ───────────────────────────────────────────────────────────────
async function fetchLiveScores() {
  const container = $("#live-scores-container");
  if (!container) return;

  container.innerHTML = '<div class="no-matches"><div class="loading-spinner"></div></div>';

  try {
    const res = await fetch("/live");
    if (!res.ok) throw new Error("no live data");
    const data = await res.json();
    const fixtures = data?.response;

    if (!fixtures || fixtures.length === 0) {
      showNoLive(container);
      return;
    }

    container.innerHTML = `<div class="matches-grid">${fixtures
      .slice(0, 12)
      .map(renderMatchCard)
      .join("")}</div>`;
  } catch {
    showNoLive(container);
  }
}

function showNoLive(container) {
  container.innerHTML = `
    <div class="no-matches">
      <div class="icon">⚽</div>
      <p style="font-weight:700;font-size:1rem;margin-bottom:4px;">Canlı oyun yoxdur</p>
      <p class="text-muted" style="font-size:.875rem;">Hazırda heç bir oyun yayımlanmır.</p>
    </div>`;
}

function renderMatchCard(f) {
  const home = f.teams.home;
  const away = f.teams.away;
  const goals = f.goals;
  const elapsed = f.fixture.status.elapsed;
  const statusShort = f.fixture.status.short;
  const isLive = ["1H", "HT", "2H", "ET", "BT", "P"].includes(statusShort);

  return `
    <div class="match-card">
      <div class="match-card-header">
        <span class="match-league">${f.league.name}</span>
        <span class="${isLive ? "match-live" : "match-time"}">
          ${isLive ? "🔴 " + (elapsed ?? "") + "'" : f.fixture.date.slice(11, 16)}
        </span>
      </div>
      <div class="match-teams">
        <div class="match-team">
          <div class="match-team-name">${home.name}</div>
        </div>
        <div class="match-score">${goals.home ?? 0} – ${goals.away ?? 0}</div>
        <div class="match-team">
          <div class="match-team-name">${away.name}</div>
        </div>
      </div>
      <div class="match-status">${f.fixture.status.long}</div>
    </div>`;
}

// ── Search ────────────────────────────────────────────────────────────────────
function setupSearch() {
  const input = $("#search-input");
  const results = $("#search-results");
  if (!input || !results) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.innerHTML = ""; return; }

    const matches = [];
    for (const [key, league] of Object.entries(LEAGUES)) {
      for (const row of league.standings) {
        if (row.team.toLowerCase().includes(q)) {
          matches.push({ team: row.team, league: league.name, flag: league.flag, pts: row.pts, leagueKey: key });
        }
      }
      for (const s of league.topScorers) {
        if (s.name.toLowerCase().includes(q)) {
          matches.push({ player: s.name, team: s.team, goals: s.goals, league: league.name, flag: league.flag });
        }
      }
    }

    if (matches.length === 0) {
      results.innerHTML = '<p class="text-muted" style="padding:12px;">Nəticə tapılmadı.</p>';
      return;
    }

    results.innerHTML = matches
      .slice(0, 8)
      .map((m) => {
        if (m.player) {
          return `<div class="search-result-item">
            <strong>${m.player}</strong>
            <span class="text-muted"> – ${m.team} (${m.flag} ${m.league}) – ${m.goals} qol</span>
          </div>`;
        }
        return `<div class="search-result-item">
          <strong>${m.team}</strong>
          <span class="text-muted"> – ${m.flag} ${m.league} – ${m.pts} xal</span>
        </div>`;
      })
      .join("");
  });
}

// ── Profile ───────────────────────────────────────────────────────────────────
function loadUser() {
  const saved = localStorage.getItem("futbolaz_user");
  if (saved) {
    currentUser = JSON.parse(saved);
    updateProfileBtn();
  }
}

function saveUser(user) {
  currentUser = user;
  localStorage.setItem("futbolaz_user", JSON.stringify(user));
  updateProfileBtn();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("futbolaz_user");
  updateProfileBtn();
  closeModal("profile-modal");
}

function updateProfileBtn() {
  const btn = $("#btn-profile");
  if (!btn) return;
  if (currentUser) {
    btn.innerHTML = `<span>${currentUser.name.charAt(0).toUpperCase()}</span><span>${currentUser.name.split(" ")[0]}</span>`;
  } else {
    btn.innerHTML = `<span>👤</span><span>Giriş</span>`;
  }
}

function openModal(id) {
  const modal = $(`#${id}`);
  if (!modal) return;
  modal.classList.add("open");

  if (id === "profile-modal") renderProfileModal();
}

function closeModal(id) {
  const modal = $(`#${id}`);
  if (modal) modal.classList.remove("open");
}

function renderProfileModal() {
  const body = $("#profile-modal-body");
  if (!body) return;

  if (currentUser) {
    // Show profile
    const joined = new Date(currentUser.joinedAt).toLocaleDateString("az-AZ");
    body.innerHTML = `
      <div class="profile-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
      <div class="profile-info">
        <h3>${currentUser.name}</h3>
        <p>${currentUser.email}</p>
        <p class="text-muted mt-4" style="font-size:.75rem;">Qoşulub: ${joined}</p>
      </div>
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-value">${currentUser.favLeague ? LEAGUES[currentUser.favLeague]?.flag ?? "—" : "—"}</div>
          <div class="profile-stat-label">Sevimli liqa</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${currentUser.favTeam || "—"}</div>
          <div class="profile-stat-label">Komanda</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${new Date().getFullYear() - new Date(currentUser.joinedAt).getFullYear() || "<1"}</div>
          <div class="profile-stat-label">İl</div>
        </div>
      </div>
      <button class="btn-danger" onclick="logoutUser()">Çıxış</button>`;
  } else {
    // Show login/register form
    body.innerHTML = `
      <div id="login-form">
        <div class="form-group">
          <label class="form-label">Ad Soyad</label>
          <input class="form-input" id="reg-name" type="text" placeholder="Adınızı daxil edin">
        </div>
        <div class="form-group">
          <label class="form-label">E-poçt</label>
          <input class="form-input" id="reg-email" type="email" placeholder="email@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Sevimli Liqa</label>
          <select class="form-input" id="reg-league">
            ${Object.entries(LEAGUES)
              .map(([k, v]) => `<option value="${k}">${v.flag} ${v.name}</option>`)
              .join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Sevimli Komanda</label>
          <input class="form-input" id="reg-team" type="text" placeholder="Məs. Qarabağ FK">
        </div>
        <button class="btn-primary" onclick="registerUser()">Qeydiyyat / Giriş</button>
      </div>`;
  }
}

function registerUser() {
  const name  = $("#reg-name")?.value.trim();
  const email = $("#reg-email")?.value.trim();
  const favLeague = $("#reg-league")?.value;
  const favTeam   = $("#reg-team")?.value.trim();

  if (!name || !email) { alert("Ad və e-poçt tələb olunur."); return; }

  saveUser({ name, email, favLeague, favTeam, joinedAt: new Date().toISOString() });
  renderProfileModal();
}

// ── Dark Mode ─────────────────────────────────────────────────────────────────
function initDarkMode() {
  const saved = localStorage.getItem("futbolaz_dark");
  if (saved === "1") document.body.classList.add("dark");
  updateDarkBtn();
}

function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("futbolaz_dark", document.body.classList.contains("dark") ? "1" : "0");
  updateDarkBtn();
}

function updateDarkBtn() {
  const btn = $("#btn-dark");
  if (btn) btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// ── Mobile Nav ────────────────────────────────────────────────────────────────
function toggleMobileNav() {
  const nav = $("#mobile-nav");
  if (nav) nav.classList.toggle("open");
}

// ── League Switch ─────────────────────────────────────────────────────────────
function switchLeague(key) {
  currentLeague = key;
  $$(".league-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.league === key);
  });
  renderStandings(key);
  renderTopScorers(key);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  initDarkMode();
  setupSearch();

  // Default league
  switchLeague("aze");

  // Fetch live scores
  fetchLiveScores();
  setInterval(fetchLiveScores, 60000);

  // Modal close on overlay click
  $$(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });
});
