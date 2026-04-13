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

const FIRST_NAMES = ["Araz", "Murad", "Kamran", "Rauf", "Emil", "Tural", "Samir", "Nihat", "Fuad", "Orxan", "Arda", "Emre"];
const LAST_NAMES = ["Məmmədov", "Həsənli", "Quliyev", "Rzayev", "Aliyev", "İbrahimli", "Vəliyev", "Səfərli", "Yıldız", "Kaya", "Demir"];

const refs = {
  loading: document.getElementById("league-loading"),
  main: document.getElementById("league-main"),
  leagueSelect: document.getElementById("league-select"),
  teamSelect: document.getElementById("team-select"),
  startBtn: document.getElementById("start-btn"),
  simulateBtn: document.getElementById("simulate-btn"),
  playBtn: document.getElementById("play-btn"),
  restartBtn: document.getElementById("restart-btn"),
  weekResults: document.getElementById("week-results"),
  history: document.getElementById("weeks-history"),
  standingsBody: document.getElementById("standings-body"),
  scorers: document.getElementById("scorers-list"),
  squadList: document.getElementById("squad-list"),
  eventsList: document.getElementById("events-list"),
  statusWeek: document.getElementById("status-week"),
  statusTeam: document.getElementById("status-team"),
  statusLeague: document.getElementById("status-league"),
  statusChemistry: document.getElementById("status-chemistry"),
  championCard: document.getElementById("champion-card"),
  championText: document.getElementById("champion-text"),
  toast: document.getElementById("league-toast"),
  matchModal: document.getElementById("match-modal"),
  playMatchTitle: document.getElementById("play-match-title"),
  playMatchStage: document.getElementById("play-match-stage"),
  playMatchLog: document.getElementById("play-match-log"),
  playAttackBtn: document.getElementById("play-attack-btn"),
  playBalancedBtn: document.getElementById("play-balanced-btn"),
  playDefendBtn: document.getElementById("play-defend-btn"),
  playCloseBtn: document.getElementById("play-close-btn"),
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
  squads: {},
  events: [],
  chemistry: {},
  pendingUserMatch: null,
  playMatch: null,
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

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function buildPlayerName(teamName, idx) {
  const f = FIRST_NAMES[idx % FIRST_NAMES.length];
  const l = LAST_NAMES[(idx * 3 + teamName.length) % LAST_NAMES.length];
  return `${f} ${l}`;
}

function createPlayersForTeam(teamName, strength) {
  const playerCount = randInt(18, 22);
  const basePositions = ["GK", "GK", "DF", "DF", "DF", "DF", "DF", "DF", "MF", "MF", "MF", "MF", "MF", "MF", "FW", "FW", "FW", "FW"];
  while (basePositions.length < playerCount) {
    basePositions.push(["DF", "MF", "FW"][basePositions.length % 3]);
  }

  return basePositions.map((position, idx) => ({
    id: `${teamName}_${idx}`,
    name: buildPlayerName(teamName, idx),
    position,
    rating: clamp(strength + randInt(-8, 8), 55, 99),
    outWeeks: 0,
    goals: 0,
    assists: 0,
    originClub: `${teamName} Akademiya ${["A", "B", "C", "D"][idx % 4]}`,
  }));
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

function ensureStateShape() {
  state.squads = state.squads && typeof state.squads === "object" ? state.squads : {};
  state.events = Array.isArray(state.events) ? state.events : [];
  state.chemistry = state.chemistry && typeof state.chemistry === "object" ? state.chemistry : {};
  state.pendingUserMatch = state.pendingUserMatch || null;
  state.playMatch = state.playMatch || null;
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
    ensureStateShape();
  } catch {}
}

function addEvent(weekNo, type, text, icon, badge = "") {
  state.events.unshift({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    weekNo,
    type,
    text,
    icon,
    badge,
  });
  state.events = state.events.slice(0, 80);
}

function getSquad(teamName) {
  return state.squads[teamName] || [];
}

function getAvailableSquad(teamName) {
  const squad = getSquad(teamName);
  const healthy = squad.filter((p) => Number(p.outWeeks || 0) <= 0);
  return healthy.length ? healthy : squad;
}

function getScorerPool(teamName) {
  const players = getAvailableSquad(teamName);
  const weighted = [];
  players.forEach((player) => {
    const weight = player.position === "FW" ? 5 : player.position === "MF" ? 3 : player.position === "DF" ? 2 : 1;
    for (let i = 0; i < weight; i += 1) weighted.push(player);
  });
  return weighted.length ? weighted : players;
}

function recordGoal(teamName) {
  const pool = getScorerPool(teamName);
  if (!pool.length) return null;
  const scorer = pool[randInt(0, pool.length - 1)];
  const teamSquad = getSquad(teamName);
  const assistPool = teamSquad.filter((p) => p.id !== scorer.id && Number(p.outWeeks || 0) <= 0);
  const assist = assistPool.length && Math.random() < 0.68 ? assistPool[randInt(0, assistPool.length - 1)] : null;

  scorer.goals += 1;
  if (assist) assist.assists += 1;

  const key = `${teamName}|${scorer.name}`;
  state.scorers[key] = {
    name: scorer.name,
    team: teamName,
    goals: (state.scorers[key]?.goals || 0) + 1,
  };

  return { scorer: scorer.name, assist: assist ? assist.name : "" };
}

function updateTableAfterMatch(home, away, homeGoals, awayGoals) {
  const h = state.standings[home];
  const a = state.standings[away];
  if (!h || !a) return;

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

function calculateChemistry(teamName) {
  const standing = state.standings[teamName];
  if (!standing) return 65;

  const squad = getSquad(teamName);
  const clubCounts = {};
  squad.forEach((p) => {
    const key = p.originClub || "academy";
    clubCounts[key] = (clubCounts[key] || 0) + 1;
  });
  const maxSameClub = Object.values(clubCounts).reduce((acc, val) => Math.max(acc, val), 0);
  const clubPenalty = Math.max(0, maxSameClub - 7) * 2;

  const formScore = (standing.form || []).reduce((acc, r) => acc + (r === "W" ? 3 : r === "D" ? 1 : -2), 0);
  const injuries = squad.filter((p) => Number(p.outWeeks || 0) > 0).length;
  const injuryPenalty = injuries * 3;

  return clamp(72 + formScore - clubPenalty - injuryPenalty, 0, 100);
}

function recalculateChemistry() {
  Object.keys(state.standings).forEach((teamName) => {
    state.chemistry[teamName] = calculateChemistry(teamName);
  });
}

function getTeamPower(teamName) {
  const standing = state.standings[teamName];
  if (!standing) return 70;
  const chemistry = state.chemistry[teamName] ?? 65;
  const injuryCount = getSquad(teamName).filter((p) => Number(p.outWeeks || 0) > 0).length;
  const injuryPenalty = injuryCount * 1.2;
  const chemistryMultiplier = 0.85 + chemistry / 200;
  return Math.max(45, (standing.strength - injuryPenalty) * chemistryMultiplier);
}

function simulateStandardMatch(home, away) {
  const homePower = getTeamPower(home);
  const awayPower = getTeamPower(away);
  const homeGoals = poissonRandom(Math.max(0.2, homePower / 24 + 0.26));
  const awayGoals = poissonRandom(Math.max(0.2, awayPower / 25 + 0.2));

  updateTableAfterMatch(home, away, homeGoals, awayGoals);
  for (let i = 0; i < homeGoals; i += 1) recordGoal(home);
  for (let i = 0; i < awayGoals; i += 1) recordGoal(away);

  return { home, away, homeGoals, awayGoals };
}

function progressInjuries(weekNo) {
  const manager = state.managerTeam;
  Object.entries(state.squads).forEach(([teamName, squad]) => {
    squad.forEach((player) => {
      if (Number(player.outWeeks || 0) > 0) {
        player.outWeeks -= 1;
        if (player.outWeeks <= 0) {
          player.outWeeks = 0;
          if (teamName === manager) {
            addEvent(weekNo, "recovery", `✅ ${player.name} zədədən qayıtdı`, "💪");
          }
        }
      }
    });
  });
}

function applyManagerInjuryEvent(weekNo) {
  const squad = getSquad(state.managerTeam);
  if (!squad.length) return;
  const healthy = squad.filter((p) => Number(p.outWeeks || 0) <= 0);
  const player = (healthy.length ? healthy : squad)[randInt(0, (healthy.length ? healthy : squad).length - 1)];
  const outWeeks = randInt(1, 3);
  player.outWeeks = Math.max(Number(player.outWeeks || 0), outWeeks);
  addEvent(weekNo, "injury", `🩹 ${player.name} zədələndi və sıradan çıxdı`, "🚑", `OUT ${player.outWeeks}w`);
}

function applyOptionalManagerEvents(weekNo) {
  const manager = state.managerTeam;
  const recent = state.resultsByWeek[String(weekNo)]?.find((m) => m.home === manager || m.away === manager);
  const form = state.standings[manager]?.form || [];

  if (Math.random() < 0.35) {
    const squad = getSquad(manager);
    if (squad.length) {
      const p = squad[randInt(0, squad.length - 1)];
      addEvent(weekNo, "suspension", `🟨 ${p.name} kart limitinə görə növbəti oyuna risk altındadır`, "🧾");
    }
  }

  if (Math.random() < 0.3) {
    addEvent(weekNo, "transfer", "🔁 Transfer xəbəri: klub yeni hücumçu ilə maraqlanır", "🗞️");
  }

  if (Math.random() < 0.45) {
    const wins = form.filter((x) => x === "W").length;
    const text = wins >= 3 ? "📈 Komanda formu yüksəlir" : "📉 Komanda formu dalğalanır";
    addEvent(weekNo, "form", text, wins >= 3 ? "🔥" : "🌧️");
  }

  if (recent) {
    addEvent(weekNo, "match", `${recent.home} ${recent.homeGoals}-${recent.awayGoals} ${recent.away}`, "⚽");
  }
}

function completeWeek(weekNo, results) {
  state.resultsByWeek[String(weekNo)] = results;
  state.currentWeek = weekNo;

  applyManagerInjuryEvent(weekNo);
  applyOptionalManagerEvents(weekNo);
  recalculateChemistry();

  showToast(`✅ ${weekNo}. həftə tamamlandı`);

  if (state.currentWeek >= state.seasonWeeks) {
    const champion = getSortedTable()[0];
    state.champion = champion?.team || "";
    if (state.champion) showToast(`🏆 Çempion: ${state.champion}`);
  }

  saveState();
  render();
}

function startWeekSimulation(interactiveForManager) {
  if (!state.started || state.currentWeek >= state.seasonWeeks || state.pendingUserMatch) return;
  const weekNo = state.currentWeek + 1;
  const matches = state.fixtures[state.currentWeek] || [];
  const manager = state.managerTeam;
  const results = [];

  progressInjuries(weekNo);
  recalculateChemistry();

  let managerMatch = null;
  matches.forEach(({ home, away }) => {
    const isManagerMatch = home === manager || away === manager;
    if (interactiveForManager && isManagerMatch) {
      managerMatch = { home, away };
      return;
    }
    results.push(simulateStandardMatch(home, away));
  });

  if (!interactiveForManager || !managerMatch) {
    completeWeek(weekNo, results);
    return;
  }

  state.pendingUserMatch = { weekNo, results, ...managerMatch };
  state.playMatch = {
    weekNo,
    home: managerMatch.home,
    away: managerMatch.away,
    stage: 0,
    totalStages: 6,
    homeGoals: 0,
    awayGoals: 0,
    choices: [],
    log: ["Matç başladı. Taktikanı seç."],
    contributions: {},
  };
  saveState();
  render();
  openPlayModal();
}

function getSortedTable() {
  return Object.values(state.standings).sort((a, b) => (
    b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)
  ));
}

function tacticEffect(choice) {
  if (choice === "attack") return { attack: 0.12, defend: -0.04, label: "Attack" };
  if (choice === "defend") return { attack: -0.03, defend: 0.12, label: "Defend" };
  return { attack: 0.03, defend: 0.03, label: "Balanced" };
}

function increaseContribution(playMatch, playerName, score = 1) {
  playMatch.contributions[playerName] = (playMatch.contributions[playerName] || 0) + score;
}

function playStage(choice) {
  const playMatch = state.playMatch;
  if (!playMatch || playMatch.stage >= playMatch.totalStages) return;

  const effect = tacticEffect(choice);
  const manager = state.managerTeam;
  const isManagerHome = playMatch.home === manager;
  const opponent = isManagerHome ? playMatch.away : playMatch.home;

  const managerPower = getTeamPower(manager);
  const oppPower = getTeamPower(opponent);
  const chemistryPush = (state.chemistry[manager] ?? 65) / 220;

  const managerChance = clamp(0.05 + (managerPower - oppPower) / 260 + chemistryPush + effect.attack, 0.05, 0.66);
  const oppChance = clamp(0.05 + (oppPower - managerPower) / 290 + (0.03 - effect.defend), 0.05, 0.52);

  const minuteStart = playMatch.stage * 15 + 1;
  const minuteEnd = (playMatch.stage + 1) * 15;
  playMatch.stage += 1;
  playMatch.choices.push(choice);
  playMatch.log.push(`${minuteStart}-${minuteEnd} dəq: ${effect.label}`);

  if (Math.random() < managerChance) {
    const detail = recordGoal(manager);
    if (isManagerHome) playMatch.homeGoals += 1;
    else playMatch.awayGoals += 1;
    if (detail?.scorer) {
      increaseContribution(playMatch, detail.scorer, 2);
      playMatch.log.push(`⚽ ${detail.scorer} qol vurdu (${manager})`);
      if (detail.assist) {
        increaseContribution(playMatch, detail.assist, 1);
        playMatch.log.push(`↪ Assist: ${detail.assist}`);
      }
    }
  } else if (Math.random() < oppChance) {
    const detail = recordGoal(opponent);
    if (isManagerHome) playMatch.awayGoals += 1;
    else playMatch.homeGoals += 1;
    if (detail?.scorer) playMatch.log.push(`❗ ${detail.scorer} qol vurdu (${opponent})`);
  } else {
    playMatch.log.push("… Bu mərhələdə böyük təhlükə olmadı.");
  }

  if (playMatch.stage >= playMatch.totalStages) {
    finalizeInteractiveMatch();
    return;
  }

  saveState();
  renderPlayModal();
  renderStatus();
}

function finalizeInteractiveMatch() {
  const playMatch = state.playMatch;
  const pending = state.pendingUserMatch;
  if (!playMatch || !pending) return;

  updateTableAfterMatch(playMatch.home, playMatch.away, playMatch.homeGoals, playMatch.awayGoals);
  pending.results.push({
    home: playMatch.home,
    away: playMatch.away,
    homeGoals: playMatch.homeGoals,
    awayGoals: playMatch.awayGoals,
  });

  const best = Object.entries(playMatch.contributions)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  if (best) addEvent(playMatch.weekNo, "best", `⭐ Oyunun ən yaxşısı: ${best}`, "🌟");
  addEvent(playMatch.weekNo, "play", `🎮 Sən oynadın: ${playMatch.home} ${playMatch.homeGoals}-${playMatch.awayGoals} ${playMatch.away}`, "🕹️");

  state.pendingUserMatch = null;
  state.playMatch = null;
  refs.matchModal.hidden = true;
  completeWeek(pending.weekNo, pending.results);
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
    const waiting = state.pendingUserMatch
      ? "<p class='result-row'>Bu həftə sənin matçın üçün Play My Match gözlənilir.</p>"
      : "<p class='result-row'>Hələ həftə simulyasiya edilməyib.</p>";
    refs.weekResults.innerHTML = waiting;
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

function renderEvents() {
  if (!state.started) {
    refs.eventsList.innerHTML = "<p class='event-card'>Mövsümü başlatdıqdan sonra olaylar görünəcək.</p>";
    return;
  }

  const events = state.events.slice(0, 20);
  if (!events.length) {
    refs.eventsList.innerHTML = "<p class='event-card'>Hələ event yoxdur.</p>";
    return;
  }

  refs.eventsList.innerHTML = events.map((event) => `
    <article class="event-card">
      <div class="event-head">
        <strong>${escapeHTML(event.icon)} ${escapeHTML(event.type.toUpperCase())}</strong>
        <span class="event-week">Week ${event.weekNo}</span>
      </div>
      <div>${escapeHTML(event.text)}</div>
      ${event.badge ? `<div class="injury-badge">${escapeHTML(event.badge)}</div>` : ""}
    </article>
  `).join("");
}

function renderSquad() {
  const manager = state.managerTeam;
  const squad = getSquad(manager);
  if (!state.started || !manager) {
    refs.squadList.innerHTML = "<p class='squad-row'>Komandanı seçdikdən sonra squad görünəcək.</p>";
    return;
  }
  if (!squad.length) {
    refs.squadList.innerHTML = "<p class='squad-row'>Squad yüklənmədi.</p>";
    return;
  }

  const sorted = [...squad].sort((a, b) => {
    const ai = Number(a.outWeeks || 0) > 0 ? 0 : 1;
    const bi = Number(b.outWeeks || 0) > 0 ? 0 : 1;
    return ai - bi || b.rating - a.rating || a.name.localeCompare(b.name);
  });

  refs.squadList.innerHTML = sorted.map((p) => `
    <article class="squad-row">
      <div class="squad-top">
        <div>
          <div class="squad-name">${escapeHTML(p.name)}</div>
          <div class="squad-meta">${p.position} • RTG ${p.rating}</div>
        </div>
        ${Number(p.outWeeks || 0) > 0
          ? `<span class="injured-pill">Injured (${p.outWeeks}w)</span>`
          : "<span class='healthy-pill'>Healthy</span>"}
      </div>
      <div class="squad-stats">G/A: ${p.goals}/${p.assists}</div>
    </article>
  `).join("");
}

function renderChampion() {
  const done = state.started && state.currentWeek >= state.seasonWeeks;
  refs.championCard.hidden = !done;
  if (!done) return;
  refs.championText.textContent = `${state.champion} mövsümü lider bitirərək çempion oldu!`;
}

function renderStatus() {
  const league = LEAGUES[state.leagueKey];
  const managerChem = Math.round(state.chemistry[state.managerTeam] ?? 0);
  refs.statusWeek.textContent = `${state.currentWeek}/${state.seasonWeeks || league.seasonWeeks}`;
  refs.statusTeam.textContent = state.managerTeam || refs.teamSelect.value || "-";
  refs.statusLeague.textContent = league.name;
  refs.statusChemistry.textContent = `${managerChem}/100`;
  const canProgress = state.started && state.currentWeek < state.seasonWeeks;
  refs.simulateBtn.disabled = !canProgress || !!state.pendingUserMatch;
  refs.playBtn.disabled = !canProgress;
}

function renderPlayModal() {
  const play = state.playMatch;
  if (!play) return;
  refs.playMatchTitle.textContent = `${play.home} vs ${play.away} — ${play.homeGoals}:${play.awayGoals}`;
  refs.playMatchStage.textContent = `Mərhələ ${play.stage}/${play.totalStages}`;
  refs.playMatchLog.innerHTML = play.log.map((row) => `<div>${escapeHTML(row)}</div>`).join("");
  const finished = play.stage >= play.totalStages;
  refs.playAttackBtn.disabled = finished;
  refs.playBalancedBtn.disabled = finished;
  refs.playDefendBtn.disabled = finished;
}

function render() {
  renderStatus();
  renderWeek();
  renderStandings();
  renderScorers();
  renderEvents();
  renderSquad();
  renderChampion();
  if (state.playMatch && !refs.matchModal.hidden) renderPlayModal();
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
  state.pendingUserMatch = null;
  state.playMatch = null;
  state.events = [];
  state.squads = {};
  teams.forEach((team) => {
    state.squads[team.name] = createPlayersForTeam(team.name, team.strength);
  });
  recalculateChemistry();

  saveState();
  render();
}

function openPlayModal() {
  if (!state.playMatch) return;
  refs.matchModal.hidden = false;
  renderPlayModal();
}

function closePlayModal() {
  refs.matchModal.hidden = true;
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
    state.events = [];
    state.squads = {};
    state.chemistry = {};
    state.pendingUserMatch = null;
    state.playMatch = null;
    refs.matchModal.hidden = true;
    updateTeamOptions();
    saveState();
    render();
  });

  refs.teamSelect.addEventListener("change", () => {
    state.managerTeam = refs.teamSelect.value;
    saveState();
    renderStatus();
    renderSquad();
  });

  refs.startBtn.addEventListener("click", () => {
    resetState();
    showToast(`🎮 ${state.managerTeam} ilə mövsüm başladı`);
  });

  refs.simulateBtn.addEventListener("click", () => {
    startWeekSimulation(false);
  });

  refs.playBtn.addEventListener("click", () => {
    if (state.playMatch) {
      openPlayModal();
      return;
    }
    startWeekSimulation(true);
  });

  refs.playAttackBtn.addEventListener("click", () => playStage("attack"));
  refs.playBalancedBtn.addEventListener("click", () => playStage("balanced"));
  refs.playDefendBtn.addEventListener("click", () => playStage("defend"));
  refs.playCloseBtn.addEventListener("click", closePlayModal);

  refs.restartBtn.addEventListener("click", () => {
    resetState();
    refs.matchModal.hidden = true;
    showToast("🔄 Yeni mövsüm başlatıldı");
  });
}

async function init() {
  initTheme();
  loadState();
  ensureStateShape();
  populateLeagues();
  bindEvents();

  if (state.started && state.managerTeam && Object.keys(state.standings).length) {
    refs.teamSelect.value = state.managerTeam;
    if (!Object.keys(state.squads).length) {
      const teams = LEAGUES[state.leagueKey].teams.map(([name, strength]) => ({ name, strength }));
      teams.forEach((team) => {
        state.squads[team.name] = createPlayersForTeam(team.name, team.strength);
      });
    }
    recalculateChemistry();
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

  if (state.playMatch) openPlayModal();

  window.toggleLeagueTheme = toggleLeagueTheme;
  window.toggleLeagueMobileMenu = toggleLeagueMobileMenu;
}

document.addEventListener("DOMContentLoaded", init);
