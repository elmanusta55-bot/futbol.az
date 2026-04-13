"use strict";

const LEAGUE_LS_KEY = "faz_efootball_league_v1";

const LEAGUES = {
  aze: {
    name: "Azərbaycan Premyer Liqası",
    seasonWeeks: 30,
    teams: [
      ["Qarabağ FK", 92], ["Neftçi PFK", 86], ["Sabah FK", 84], ["Zirə FK", 82], ["Sumqayıt FK", 80],
      ["Qəbələ FK", 79], ["Kəpəz FK", 76], ["Səbail FK", 74], ["Şamaxı FK", 73], ["Turan Tovuz", 78],
      ["Araz-Naxçıvan", 77], ["Inter Baku", 75], ["Keşlə FK", 72], ["MOİK", 71], ["Karvan FK", 70],
      ["Xəzər Lənkəran", 81], ["Rəvan FK", 68], ["AZAL FK", 67], ["Mingəçevir FK", 66], ["Qusar FK", 65],
    ],
  },
  pl: {
    name: "Premier League",
    seasonWeeks: 38,
    teams: [
      ["Man City", 95], ["Arsenal", 92], ["Liverpool", 94], ["Chelsea", 88], ["Man United", 86],
      ["Newcastle", 87], ["Tottenham", 85], ["Aston Villa", 84], ["Brighton", 82], ["West Ham", 80],
      ["Brentford", 79], ["Fulham", 78], ["Wolves", 77], ["Crystal Palace", 76], ["Everton", 75],
      ["Bournemouth", 74], ["Nottingham", 73], ["Leicester", 72], ["Southampton", 71], ["Ipswich", 70],
    ],
  },
  laliga: {
    name: "La Liga",
    seasonWeeks: 38,
    teams: [
      ["Real Madrid", 95], ["Barcelona", 94], ["Atletico Madrid", 90], ["Athletic Club", 85], ["Real Sociedad", 84],
      ["Villarreal", 83], ["Real Betis", 82], ["Sevilla", 81], ["Valencia", 79], ["Girona", 80],
      ["Celta Vigo", 77], ["Getafe", 76], ["Osasuna", 78], ["Rayo Vallecano", 75], ["Mallorca", 74],
      ["Las Palmas", 73], ["Espanyol", 72], ["Leganes", 71], ["Alaves", 70], ["Valladolid", 69],
    ],
  },
  seriea: {
    name: "Serie A",
    seasonWeeks: 38,
    teams: [
      ["Inter", 94], ["Juventus", 90], ["AC Milan", 89], ["Napoli", 88], ["Atalanta", 87],
      ["Roma", 85], ["Lazio", 84], ["Fiorentina", 82], ["Bologna", 81], ["Torino", 79],
      ["Udinese", 77], ["Genoa", 76], ["Sassuolo", 75], ["Parma", 74], ["Cagliari", 73],
      ["Empoli", 72], ["Lecce", 71], ["Verona", 70], ["Monza", 69], ["Como", 68],
    ],
  },
  bundesliga: {
    name: "Bundesliga",
    seasonWeeks: 38,
    teams: [
      ["Bayern", 95], ["Leverkusen", 92], ["Dortmund", 89], ["RB Leipzig", 87], ["Frankfurt", 85],
      ["Stuttgart", 84], ["Freiburg", 82], ["Hoffenheim", 80], ["Wolfsburg", 79], ["Mainz", 78],
      ["Augsburg", 76], ["Werder Bremen", 77], ["Union Berlin", 75], ["Gladbach", 74], ["Bochum", 72],
      ["Heidenheim", 73], ["St. Pauli", 71], ["Kiel", 69], ["Koln", 70], ["Hamburg", 68],
    ],
  },
};

const refs = {
  loading: document.getElementById("league-loading"),
  main: document.getElementById("league-main"),
  leagueSelect: document.getElementById("league-select"),
  teamSelect: document.getElementById("team-select"),
  startBtn: document.getElementById("start-btn"),
  simulateBtn: document.getElementById("simulate-btn"),
  restartBtn: document.getElementById("restart-btn"),
  weekResults: document.getElementById("week-results"),
  history: document.getElementById("weeks-history"),
  standingsBody: document.getElementById("standings-body"),
  scorers: document.getElementById("scorers-list"),
  statusWeek: document.getElementById("status-week"),
  statusTeam: document.getElementById("status-team"),
  statusLeague: document.getElementById("status-league"),
  championCard: document.getElementById("champion-card"),
  championText: document.getElementById("champion-text"),
  toast: document.getElementById("league-toast"),
};

let state = {
  leagueKey: "aze",
  managerTeam: "",
  started: false,
  currentWeek: 0,
  seasonWeeks: 0,
  fixtures: [],
  standings: {},
  scorers: {},
  resultsByWeek: {},
  champion: "",
};

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(message) {
  refs.toast.textContent = message;
  refs.toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    refs.toast.hidden = true;
  }, 2400);
}

function poissonRandom(lambda) {
  const l = Math.exp(-lambda);
  let p = 1;
  let k = 0;
  do {
    k += 1;
    p *= Math.random();
  } while (p > l && k < 12);
  return k - 1;
}

function createPlayersForTeam(teamName) {
  return [
    `${teamName} Hücumçu`,
    `${teamName} Forvard`,
    `${teamName} Winger`,
  ];
}

function createInitialStandings(teams) {
  const map = {};
  teams.forEach((team) => {
    map[team.name] = {
      team: team.name,
      strength: team.strength,
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      form: [],
      scorers: createPlayersForTeam(team.name),
    };
  });
  return map;
}

function createRoundRobin(teamNames) {
  const teams = [...teamNames];
  if (teams.length % 2 !== 0) teams.push("BYE");

  const rounds = [];
  const half = teams.length / 2;
  const rotate = [...teams];

  for (let round = 0; round < teams.length - 1; round += 1) {
    const matches = [];
    for (let i = 0; i < half; i += 1) {
      const home = rotate[i];
      const away = rotate[rotate.length - 1 - i];
      if (home !== "BYE" && away !== "BYE") {
        matches.push(round % 2 === 0 ? { home, away } : { home: away, away: home });
      }
    }
    rounds.push(matches);
    rotate.splice(1, 0, rotate.pop());
  }

  const secondHalf = rounds.map((week) => week.map((m) => ({ home: m.away, away: m.home })));
  return rounds.concat(secondHalf);
}

function saveState() {
  try {
    localStorage.setItem(LEAGUE_LS_KEY, JSON.stringify(state));
  } catch {}
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEAGUE_LS_KEY) || "null");
    if (!parsed || !LEAGUES[parsed.leagueKey]) return;
    state = {
      ...state,
      ...parsed,
      leagueKey: parsed.leagueKey,
    };
  } catch {}
}

function resetState() {
  const league = LEAGUES[state.leagueKey];
  const teams = league.teams.map(([name, strength]) => ({ name, strength }));
  const teamNames = teams.map((t) => t.name);

  state.managerTeam = refs.teamSelect.value || teamNames[0];
  state.started = true;
  state.currentWeek = 0;
  state.seasonWeeks = league.seasonWeeks;
  state.fixtures = createRoundRobin(teamNames).slice(0, league.seasonWeeks);
  state.standings = createInitialStandings(teams);
  state.scorers = {};
  state.resultsByWeek = {};
  state.champion = "";

  saveState();
  render();
}

function updateTeamOptions() {
  const league = LEAGUES[refs.leagueSelect.value];
  refs.teamSelect.innerHTML = league.teams
    .map(([name]) => `<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`)
    .join("");

  const preferred = state.managerTeam && league.teams.some(([n]) => n === state.managerTeam)
    ? state.managerTeam
    : league.teams[0][0];
  refs.teamSelect.value = preferred;
}

function updateTableAfterMatch(home, away, homeGoals, awayGoals) {
  const h = state.standings[home];
  const a = state.standings[away];

  h.p += 1; a.p += 1;
  h.gf += homeGoals; h.ga += awayGoals;
  a.gf += awayGoals; a.ga += homeGoals;
  h.gd = h.gf - h.ga;
  a.gd = a.gf - a.ga;

  if (homeGoals > awayGoals) {
    h.w += 1; h.pts += 3; a.l += 1;
    h.form.push("W"); a.form.push("L");
  } else if (homeGoals < awayGoals) {
    a.w += 1; a.pts += 3; h.l += 1;
    h.form.push("L"); a.form.push("W");
  } else {
    h.d += 1; a.d += 1; h.pts += 1; a.pts += 1;
    h.form.push("D"); a.form.push("D");
  }

  h.form = h.form.slice(-5);
  a.form = a.form.slice(-5);
}

function assignScorers(teamName, goalCount) {
  const team = state.standings[teamName];
  if (!team || goalCount <= 0) return;
  for (let i = 0; i < goalCount; i += 1) {
    const pool = team.scorers;
    const scorerName = pool[Math.floor(Math.random() * pool.length)];
    state.scorers[scorerName] = {
      name: scorerName,
      team: teamName,
      goals: (state.scorers[scorerName]?.goals || 0) + 1,
    };
  }
}

function simulateCurrentWeek() {
  if (!state.started || state.currentWeek >= state.seasonWeeks) return;

  const weekNo = state.currentWeek + 1;
  const matches = state.fixtures[state.currentWeek] || [];
  const results = [];

  matches.forEach(({ home, away }) => {
    const hStrength = state.standings[home].strength;
    const aStrength = state.standings[away].strength;
    const homeGoals = poissonRandom(hStrength / 20 + 0.3);
    const awayGoals = poissonRandom(aStrength / 22);

    updateTableAfterMatch(home, away, homeGoals, awayGoals);
    assignScorers(home, homeGoals);
    assignScorers(away, awayGoals);

    results.push({ home, away, homeGoals, awayGoals });
  });

  state.resultsByWeek[String(weekNo)] = results;
  state.currentWeek = weekNo;

  showToast(`✅ ${weekNo}. həftə simulyasiya edildi`);

  if (state.currentWeek >= state.seasonWeeks) {
    const champion = getSortedTable()[0];
    state.champion = champion?.team || "";
    if (state.champion) showToast(`🏆 Çempion: ${state.champion}`);
  }

  saveState();
  render();
}

function getSortedTable() {
  return Object.values(state.standings).sort((a, b) => (
    b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)
  ));
}

function renderForm(form) {
  if (!form.length) return "-";
  return `<span class="form-pill">${form.map((r) => {
    const cls = r === "W" ? "w" : r === "D" ? "d" : "l";
    return `<span class="${cls}">${r}</span>`;
  }).join("")}</span>`;
}

function renderWeek() {
  const week = state.currentWeek;
  const rows = state.resultsByWeek[String(week)] || [];

  if (!state.started) {
    refs.weekResults.innerHTML = "<p class='result-row'>Mövsümü başlatmaq üçün liqa və komanda seç.</p>";
    refs.history.innerHTML = "";
    return;
  }

  if (!rows.length) {
    refs.weekResults.innerHTML = "<p class='result-row'>Hələ həftə simulyasiya edilməyib.</p>";
  } else {
    refs.weekResults.innerHTML = rows
      .map((m) => `<div class="result-row"><strong>${escapeHTML(m.home)}</strong> ${m.homeGoals} - ${m.awayGoals} <strong>${escapeHTML(m.away)}</strong></div>`)
      .join("");
  }

  refs.history.innerHTML = Object.keys(state.resultsByWeek)
    .sort((a, b) => Number(b) - Number(a))
    .map((weekNo) => {
      const weekRows = state.resultsByWeek[weekNo] || [];
      return `<details class="history-row"><summary>${weekNo}. həftə</summary><ul>${weekRows
        .map((m) => `<li>${escapeHTML(m.home)} ${m.homeGoals}-${m.awayGoals} ${escapeHTML(m.away)}</li>`)
        .join("")}</ul></details>`;
    })
    .join("");
}

function renderStandings() {
  const table = getSortedTable();
  refs.standingsBody.innerHTML = table.map((t, idx) => {
    const cls = [
      t.team === state.managerTeam ? "manager-row" : "",
      state.champion && idx === 0 ? "champion-row" : "",
    ].join(" ").trim();

    return `<tr class="${cls}">
      <td>${idx + 1}</td>
      <td>${escapeHTML(t.team)}</td>
      <td>${t.p}</td>
      <td>${t.w}</td>
      <td>${t.d}</td>
      <td>${t.l}</td>
      <td>${t.gf}:${t.ga}</td>
      <td>${t.gd}</td>
      <td><strong>${t.pts}</strong></td>
      <td>${renderForm(t.form)}</td>
    </tr>`;
  }).join("");
}

function renderScorers() {
  const top = Object.values(state.scorers)
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, 10);

  if (!top.length) {
    refs.scorers.innerHTML = "<li>Qolçular simulyasiya ilə formalaşacaq.</li>";
    return;
  }

  refs.scorers.innerHTML = top
    .map((s) => `<li><strong>${escapeHTML(s.name)}</strong> — ${escapeHTML(s.team)} (${s.goals})</li>`)
    .join("");
}

function renderChampion() {
  const done = state.started && state.currentWeek >= state.seasonWeeks;
  refs.championCard.hidden = !done;
  if (!done) return;
  refs.championText.textContent = `${state.champion} mövsümü lider bitirərək çempion oldu!`;
}

function renderStatus() {
  const league = LEAGUES[state.leagueKey];
  refs.statusWeek.textContent = `${state.currentWeek}/${state.seasonWeeks || league.seasonWeeks}`;
  refs.statusTeam.textContent = state.managerTeam || refs.teamSelect.value || "-";
  refs.statusLeague.textContent = league.name;
  refs.simulateBtn.disabled = !state.started || state.currentWeek >= state.seasonWeeks;
}

function render() {
  renderStatus();
  renderWeek();
  renderStandings();
  renderScorers();
  renderChampion();
}

function toggleLeagueMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const hamburger = document.getElementById("hamburger");
  if (!menu || !hamburger) return;
  const willShow = menu.hasAttribute("hidden");
  if (willShow) {
    menu.removeAttribute("hidden");
    hamburger.setAttribute("aria-expanded", "true");
  } else {
    menu.setAttribute("hidden", "");
    hamburger.setAttribute("aria-expanded", "false");
  }
}

function toggleLeagueTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("faz_theme", JSON.stringify(next));
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = next === "dark" ? "🌙" : "☀️";
}

function initTheme() {
  let theme = "dark";
  try {
    const saved = JSON.parse(localStorage.getItem("faz_theme") || "null");
    if (saved === "dark" || saved === "light") theme = saved;
  } catch {}
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

function populateLeagues() {
  refs.leagueSelect.innerHTML = Object.entries(LEAGUES)
    .map(([key, league]) => `<option value="${key}">${escapeHTML(league.name)}</option>`)
    .join("");
  refs.leagueSelect.value = state.leagueKey;
  updateTeamOptions();
}

function bindEvents() {
  refs.leagueSelect.addEventListener("change", () => {
    state.leagueKey = refs.leagueSelect.value;
    state.managerTeam = "";
    state.started = false;
    state.currentWeek = 0;
    state.seasonWeeks = LEAGUES[state.leagueKey].seasonWeeks;
    state.fixtures = [];
    state.standings = {};
    state.scorers = {};
    state.resultsByWeek = {};
    state.champion = "";
    updateTeamOptions();
    saveState();
    render();
  });

  refs.teamSelect.addEventListener("change", () => {
    state.managerTeam = refs.teamSelect.value;
    saveState();
    renderStatus();
  });

  refs.startBtn.addEventListener("click", () => {
    resetState();
    showToast(`🎮 ${state.managerTeam} ilə mövsüm başladı`);
  });

  refs.simulateBtn.addEventListener("click", simulateCurrentWeek);

  refs.restartBtn.addEventListener("click", () => {
    resetState();
    showToast("🔄 Yeni mövsüm başlatıldı");
  });
}

async function init() {
  initTheme();
  loadState();
  populateLeagues();
  bindEvents();

  if (state.started && state.managerTeam && Object.keys(state.standings).length) {
    refs.teamSelect.value = state.managerTeam;
  }

  await Promise.all([
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]);

  refs.loading.hidden = true;
  refs.main.hidden = false;

  if (!state.started) {
    state.seasonWeeks = LEAGUES[state.leagueKey].seasonWeeks;
  }

  render();

  window.toggleLeagueTheme = toggleLeagueTheme;
  window.toggleLeagueMobileMenu = toggleLeagueMobileMenu;
}

document.addEventListener("DOMContentLoaded", init);
