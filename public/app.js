/* ═══════════════════════════════════════════════════════════════════
   FUTBOL.AZ – Frontend Application
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

// ── Security: HTML escaping ────────────────────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── League Mapping ────────────────────────────────────────────────────────────
const LEAGUE_MAP = {
  aze:        { id: 683, name: "Azərbaycan Premyer Liqası", flag: "🇦🇿" },
  pl:         { id: 39,  name: "Premier League",            flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  laliga:     { id: 140, name: "La Liga",                   flag: "🇪🇸" },
  seriea:     { id: 135, name: "Serie A",                   flag: "🇮🇹" },
  bundesliga: { id: 78,  name: "Bundesliga",                flag: "🇩🇪" },
};

// Zone definitions: positions 1-based, zone = 'cl', 'el', or 'rel'
const LEAGUE_ZONES = {
  aze:        { cl: [1,2], el: [3], rel: [10,11,12] },
  pl:         { cl: [1,2,3,4], el: [5,6], rel: [18,19,20] },
  laliga:     { cl: [1,2,3,4], el: [5,6], rel: [18,19,20] },
  seriea:     { cl: [1,2,3,4], el: [5,6], rel: [18,19,20] },
  bundesliga: { cl: [1,2,3,4], el: [5,6], rel: [16,17,18] },
};

// ── Static Fallback Data ───────────────────────────────────────────────────────
const LEAGUES_FALLBACK = {
  aze: {
    standings: [
      { pos:1,  team:"Qarabağ FK",  p:30, w:24, d:4, l:2,  gf:71, ga:20, gd:51, pts:76 },
      { pos:2,  team:"Neftçi PFK",  p:30, w:19, d:5, l:6,  gf:55, ga:28, gd:27, pts:62 },
      { pos:3,  team:"Sumqayıt FK", p:30, w:16, d:6, l:8,  gf:48, ga:35, gd:13, pts:54 },
      { pos:4,  team:"Sabah FK",    p:30, w:14, d:7, l:9,  gf:42, ga:38, gd: 4, pts:49 },
      { pos:5,  team:"Kəpəz FK",    p:30, w:12, d:8, l:10, gf:40, ga:42, gd:-2, pts:44 },
      { pos:6,  team:"Zirə FK",     p:30, w:12, d:6, l:12, gf:38, ga:42, gd:-4, pts:42 },
      { pos:7,  team:"Inter Baku",  p:30, w:11, d:5, l:14, gf:35, ga:46, gd:-11,pts:38 },
      { pos:8,  team:"Şamaxı FK",   p:30, w:10, d:5, l:15, gf:33, ga:48, gd:-15,pts:35 },
      { pos:9,  team:"Sabail FK",   p:30, w: 7, d:7, l:16, gf:28, ga:50, gd:-22,pts:28 },
      { pos:10, team:"Keşlə FK",    p:30, w: 7, d:6, l:17, gf:26, ga:54, gd:-28,pts:27 },
      { pos:11, team:"Turan Tovuz", p:30, w: 5, d:7, l:18, gf:22, ga:58, gd:-36,pts:22 },
      { pos:12, team:"AZAL FK",     p:30, w: 3, d:4, l:23, gf:16, ga:73, gd:-57,pts:13 },
    ],
    topScorers: [
      { name:"Ramil Şeydayev",  team:"Qarabağ FK",  goals:19 },
      { name:"Mahir Emreli",    team:"Qarabağ FK",  goals:17 },
      { name:"Klaudio Djordic", team:"Neftçi PFK",  goals:14 },
      { name:"Murad Hüseynov",  team:"Sabah FK",    goals:12 },
      { name:"Tural Bayramov",  team:"Sumqayıt FK", goals:10 },
    ],
  },
  pl: {
    standings: [
      { pos:1,  team:"Liverpool",      p:34, w:25, d:6, l:3,  gf:78, ga:32, gd:46, pts:81 },
      { pos:2,  team:"Arsenal",        p:34, w:21, d:8, l:5,  gf:65, ga:36, gd:29, pts:71 },
      { pos:3,  team:"Chelsea",        p:34, w:18, d:7, l:9,  gf:62, ga:45, gd:17, pts:61 },
      { pos:4,  team:"Nottm Forest",   p:34, w:17, d:7, l:10, gf:55, ga:43, gd:12, pts:58 },
      { pos:5,  team:"Newcastle",      p:34, w:16, d:9, l:9,  gf:58, ga:44, gd:14, pts:57 },
      { pos:6,  team:"Man City",       p:34, w:16, d:7, l:11, gf:60, ga:50, gd:10, pts:55 },
      { pos:7,  team:"Tottenham",      p:34, w:15, d:6, l:13, gf:56, ga:56, gd: 0, pts:51 },
      { pos:8,  team:"Aston Villa",    p:34, w:15, d:5, l:14, gf:52, ga:56, gd:-4, pts:50 },
      { pos:9,  team:"Brighton",       p:34, w:14, d:7, l:13, gf:53, ga:54, gd:-1, pts:49 },
      { pos:10, team:"Fulham",         p:34, w:12, d:9, l:13, gf:50, ga:54, gd:-4, pts:45 },
      { pos:11, team:"Brentford",      p:34, w:12, d:8, l:14, gf:55, ga:62, gd:-7, pts:44 },
      { pos:12, team:"Man United",     p:34, w:11, d:8, l:15, gf:43, ga:55, gd:-12,pts:41 },
      { pos:13, team:"West Ham",       p:34, w:10, d:8, l:16, gf:38, ga:58, gd:-20,pts:38 },
      { pos:14, team:"Everton",        p:34, w:10, d:6, l:18, gf:35, ga:60, gd:-25,pts:36 },
      { pos:15, team:"Wolves",         p:34, w: 8, d:9, l:17, gf:38, ga:64, gd:-26,pts:33 },
      { pos:16, team:"Crystal Palace", p:34, w: 8, d:8, l:18, gf:36, ga:60, gd:-24,pts:32 },
      { pos:17, team:"Ipswich",        p:34, w: 6, d:8, l:20, gf:30, ga:68, gd:-38,pts:26 },
      { pos:18, team:"Leicester",      p:34, w: 5, d:7, l:22, gf:28, ga:70, gd:-42,pts:22 },
      { pos:19, team:"Southampton",    p:34, w: 4, d:5, l:25, gf:22, ga:78, gd:-56,pts:17 },
      { pos:20, team:"Sunderland",     p:34, w: 3, d:6, l:25, gf:20, ga:80, gd:-60,pts:15 },
    ],
    topScorers: [
      { name:"Mohamed Salah",  team:"Liverpool",  goals:27 },
      { name:"Cole Palmer",    team:"Chelsea",    goals:20 },
      { name:"Alexander Isak", team:"Newcastle",  goals:19 },
      { name:"Bryan Mbeumo",   team:"Brentford",  goals:18 },
      { name:"Bukayo Saka",    team:"Arsenal",    goals:16 },
    ],
  },
  laliga: {
    standings: [
      { pos:1, team:"Barcelona",    p:33, w:24, d:6, l:3,  gf:80, ga:38, gd:42, pts:78 },
      { pos:2, team:"Real Madrid",  p:33, w:23, d:5, l:5,  gf:74, ga:34, gd:40, pts:74 },
      { pos:3, team:"Atletico",     p:33, w:21, d:7, l:5,  gf:62, ga:28, gd:34, pts:70 },
      { pos:4, team:"Athletic",     p:33, w:17, d:9, l:7,  gf:50, ga:30, gd:20, pts:60 },
      { pos:5, team:"Villarreal",   p:33, w:15, d:8, l:10, gf:52, ga:42, gd:10, pts:53 },
      { pos:6, team:"Real Betis",   p:33, w:14, d:9, l:10, gf:48, ga:44, gd: 4, pts:51 },
      { pos:7, team:"Sevilla",      p:33, w:12, d:9, l:12, gf:42, ga:48, gd:-6, pts:45 },
      { pos:8, team:"Real Sociedad",p:33, w:11, d:10,l:12, gf:44, ga:46, gd:-2, pts:43 },
      { pos:9, team:"Osasuna",      p:33, w:11, d:8, l:14, gf:38, ga:48, gd:-10,pts:41 },
      { pos:10,team:"Girona",       p:33, w:11, d:8, l:14, gf:44, ga:50, gd:-6, pts:41 },
      { pos:11,team:"Rayo Vallecano",p:33,w:10,d:10,l:13, gf:38, ga:46, gd:-8, pts:40 },
      { pos:12,team:"Las Palmas",   p:33, w:10, d:9, l:14, gf:35, ga:48, gd:-13,pts:39 },
      { pos:13,team:"Getafe",       p:33, w: 9, d:11,l:13, gf:32, ga:44, gd:-12,pts:38 },
      { pos:14,team:"Celta Vigo",   p:33, w: 9, d:8, l:16, gf:40, ga:56, gd:-16,pts:35 },
      { pos:15,team:"Mallorca",     p:33, w: 8, d:10,l:15, gf:30, ga:44, gd:-14,pts:34 },
      { pos:16,team:"Espanyol",     p:33, w: 8, d:8, l:17, gf:32, ga:56, gd:-24,pts:32 },
      { pos:17,team:"Leganés",      p:33, w: 7, d:9, l:17, gf:28, ga:52, gd:-24,pts:30 },
      { pos:18,team:"Valencia",     p:33, w: 6, d:9, l:18, gf:28, ga:54, gd:-26,pts:27 },
      { pos:19,team:"Valladolid",   p:33, w: 5, d:6, l:22, gf:22, ga:66, gd:-44,pts:21 },
      { pos:20,team:"Alavés",       p:33, w: 4, d:7, l:22, gf:20, ga:68, gd:-48,pts:19 },
    ],
    topScorers: [
      { name:"Kylian Mbappé",   team:"Real Madrid",  goals:25 },
      { name:"Robert Lewandowski",team:"Barcelona",  goals:24 },
      { name:"Antoine Griezmann",team:"Atletico",    goals:16 },
      { name:"Ayoze Pérez",     team:"Villarreal",   goals:14 },
      { name:"Nico Williams",   team:"Athletic",     goals:13 },
    ],
  },
  seriea: {
    standings: [
      { pos:1, team:"Napoli",     p:33, w:22, d:7, l:4,  gf:62, ga:28, gd:34, pts:73 },
      { pos:2, team:"Inter",      p:33, w:22, d:6, l:5,  gf:70, ga:30, gd:40, pts:72 },
      { pos:3, team:"Atalanta",   p:33, w:20, d:8, l:5,  gf:70, ga:36, gd:34, pts:68 },
      { pos:4, team:"Juventus",   p:33, w:18, d:9, l:6,  gf:52, ga:30, gd:22, pts:63 },
      { pos:5, team:"Lazio",      p:33, w:17, d:8, l:8,  gf:56, ga:38, gd:18, pts:59 },
      { pos:6, team:"AC Milan",   p:33, w:15, d:10,l:8,  gf:52, ga:40, gd:12, pts:55 },
      { pos:7, team:"Fiorentina", p:33, w:14, d:9, l:10, gf:48, ga:38, gd:10, pts:51 },
      { pos:8, team:"Bologna",    p:33, w:13, d:10,l:10, gf:46, ga:38, gd: 8, pts:49 },
      { pos:9, team:"Roma",       p:33, w:13, d:8, l:12, gf:48, ga:46, gd: 2, pts:47 },
      { pos:10,team:"Torino",     p:33, w:11, d:10,l:12, gf:40, ga:42, gd:-2, pts:43 },
      { pos:11,team:"Udinese",    p:33, w:10, d:11,l:12, gf:38, ga:46, gd:-8, pts:41 },
      { pos:12,team:"Como",       p:33, w:10, d:8, l:15, gf:44, ga:56, gd:-12,pts:38 },
      { pos:13,team:"Cagliari",   p:33, w: 9, d:9, l:15, gf:34, ga:48, gd:-14,pts:36 },
      { pos:14,team:"Genoa",      p:33, w: 8, d:10,l:15, gf:32, ga:52, gd:-20,pts:34 },
      { pos:15,team:"Parma",      p:33, w: 8, d:9, l:16, gf:38, ga:58, gd:-20,pts:33 },
      { pos:16,team:"Lecce",      p:33, w: 8, d:8, l:17, gf:30, ga:54, gd:-24,pts:32 },
      { pos:17,team:"Empoli",     p:33, w: 7, d:10,l:16, gf:28, ga:50, gd:-22,pts:31 },
      { pos:18,team:"Hellas Verona",p:33,w:6, d:9, l:18, gf:30, ga:60, gd:-30,pts:27 },
      { pos:19,team:"Venezia",    p:33, w: 5, d:8, l:20, gf:26, ga:62, gd:-36,pts:23 },
      { pos:20,team:"Monza",      p:33, w: 4, d:7, l:22, gf:20, ga:68, gd:-48,pts:19 },
    ],
    topScorers: [
      { name:"Mateo Retegui",  team:"Atalanta",  goals:24 },
      { name:"Lautaro Martínez",team:"Inter",    goals:22 },
      { name:"Marcus Thuram",  team:"Inter",     goals:14 },
      { name:"Romelu Lukaku",  team:"Napoli",    goals:13 },
      { name:"Ademola Lookman",team:"Atalanta",  goals:13 },
    ],
  },
  bundesliga: {
    standings: [
      { pos:1, team:"Bayern München",  p:31, w:23, d:5, l:3,  gf:92, ga:30, gd:62, pts:74 },
      { pos:2, team:"Leverkusen",      p:31, w:19, d:9, l:3,  gf:66, ga:28, gd:38, pts:66 },
      { pos:3, team:"Frankfurt",       p:31, w:17, d:7, l:7,  gf:60, ga:38, gd:22, pts:58 },
      { pos:4, team:"RB Leipzig",      p:31, w:15, d:8, l:8,  gf:60, ga:40, gd:20, pts:53 },
      { pos:5, team:"Dortmund",        p:31, w:14, d:7, l:10, gf:54, ga:44, gd:10, pts:49 },
      { pos:6, team:"Freiburg",        p:31, w:13, d:8, l:10, gf:46, ga:42, gd: 4, pts:47 },
      { pos:7, team:"Mainz",           p:31, w:12, d:8, l:11, gf:44, ga:46, gd:-2, pts:44 },
      { pos:8, team:"Gladbach",        p:31, w:11, d:7, l:13, gf:42, ga:52, gd:-10,pts:40 },
      { pos:9, team:"Stuttgart",       p:31, w:10, d:9, l:12, gf:48, ga:52, gd:-4, pts:39 },
      { pos:10,team:"Hoffenheim",      p:31, w:10, d:8, l:13, gf:38, ga:50, gd:-12,pts:38 },
      { pos:11,team:"Werder Bremen",   p:31, w: 9, d:9, l:13, gf:42, ga:54, gd:-12,pts:36 },
      { pos:12,team:"Augsburg",        p:31, w: 9, d:8, l:14, gf:36, ga:52, gd:-16,pts:35 },
      { pos:13,team:"Union Berlin",    p:31, w: 8, d:10,l:13, gf:34, ga:48, gd:-14,pts:34 },
      { pos:14,team:"Wolfsburg",       p:31, w: 8, d:8, l:15, gf:34, ga:54, gd:-20,pts:32 },
      { pos:15,team:"Heidenheim",      p:31, w: 8, d:8, l:15, gf:36, ga:58, gd:-22,pts:32 },
      { pos:16,team:"St. Pauli",       p:31, w: 6, d:9, l:16, gf:30, ga:60, gd:-30,pts:27 },
      { pos:17,team:"Bochum",          p:31, w: 4, d:8, l:19, gf:26, ga:68, gd:-42,pts:20 },
      { pos:18,team:"Holstein Kiel",   p:31, w: 3, d:7, l:21, gf:22, ga:74, gd:-52,pts:16 },
    ],
    topScorers: [
      { name:"Harry Kane",      team:"Bayern",     goals:30 },
      { name:"Florian Wirtz",   team:"Leverkusen", goals:18 },
      { name:"Omar Marmoush",   team:"Frankfurt",  goals:17 },
      { name:"Patrik Schick",   team:"Leverkusen", goals:14 },
      { name:"Serhou Guirassy", team:"Dortmund",   goals:13 },
    ],
  },
};

// ── Application State ─────────────────────────────────────────────────────────
let currentSection  = "leagues";
let currentLeague   = "aze";
let liveRefreshTimer = null;

// ── Section Switching ─────────────────────────────────────────────────────────
function switchSection(sectionKey) {
  currentSection = sectionKey;

  // Update nav tabs
  document.querySelectorAll(".nav-tab").forEach(btn => {
    const active = btn.dataset.section === sectionKey;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  // Show/hide sections
  document.querySelectorAll(".content-section").forEach(sec => {
    const isTarget = sec.id === `section-${sectionKey}`;
    sec.hidden = !isTarget;
    sec.classList.toggle("active", isTarget);
  });

  // Lazy-load section data
  if (sectionKey === "live") {
    fetchLiveScores();
    // Auto-refresh every 60s while on live tab
    clearInterval(liveRefreshTimer);
    liveRefreshTimer = setInterval(() => {
      if (currentSection === "live") fetchLiveScores();
    }, 60000);
  } else {
    clearInterval(liveRefreshTimer);
  }

  if (sectionKey === "matches") fetchTodayMatches();
}

// ── League Switching ──────────────────────────────────────────────────────────
function switchLeague(key) {
  if (!LEAGUE_MAP[key]) return;
  currentLeague = key;

  document.querySelectorAll(".league-tab").forEach(btn => {
    const active = btn.dataset.league === key;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  const league = LEAGUE_MAP[key];
  const heading = document.getElementById("standings-heading");
  if (heading) heading.textContent = `${league.flag} ${league.name} – Cədvəl`;

  fetchStandings(key);
  fetchTopScorers(key);
}

// ── Standings ─────────────────────────────────────────────────────────────────
async function fetchStandings(leagueKey) {
  const league = LEAGUE_MAP[leagueKey];
  if (!league) return;

  const tbody = document.getElementById("standings-body");
  const loader = document.getElementById("standings-loader");
  if (!tbody) return;

  // Show loader
  if (loader) loader.style.display = "flex";
  tbody.innerHTML = "";

  try {
    const res = await fetch(`/api/standings/${league.id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const rows = data?.response?.[0]?.league?.standings?.[0];
    if (rows && rows.length > 0) {
      renderStandings(rows.map(t => ({
        pos:  t.rank,
        team: t.team.name,
        logo: t.team.logo,
        p:    t.all.played,
        w:    t.all.win,
        d:    t.all.draw,
        l:    t.all.lose,
        gf:   t.all.goals.for,
        ga:   t.all.goals.against,
        gd:   t.goalsDiff,
        pts:  t.points,
      })), leagueKey);
      if (loader) loader.style.display = "none";
      return;
    }
  } catch (_) {
    // Fall through to fallback
  }

  // Use static fallback
  const fallback = LEAGUES_FALLBACK[leagueKey];
  if (fallback) {
    renderStandings(fallback.standings, leagueKey);
  }
  if (loader) loader.style.display = "none";
}

function renderStandings(rows, leagueKey) {
  const tbody = document.getElementById("standings-body");
  if (!tbody) return;

  const zones = LEAGUE_ZONES[leagueKey] || {};

  function zoneClass(pos) {
    if (zones.cl  && zones.cl.includes(pos))  return "zone-cl";
    if (zones.el  && zones.el.includes(pos))  return "zone-el";
    if (zones.rel && zones.rel.includes(pos)) return "zone-rel";
    return "";
  }

  tbody.innerHTML = rows.map(r => {
    const zc = zoneClass(r.pos);
    const logoHtml = r.logo
      ? `<img src="${escapeHTML(r.logo)}" alt="${escapeHTML(r.team)} loqo" class="team-logo" loading="lazy" onerror="this.style.display='none'">`
      : "";
    const gdStr = r.gd > 0 ? `+${r.gd}` : String(r.gd);
    return `<tr class="${zc}">
      <td class="col-pos"><span class="rank-num">${r.pos}</span></td>
      <td class="col-team">${logoHtml}${escapeHTML(r.team)}</td>
      <td>${r.p}</td>
      <td>${r.w}</td>
      <td>${r.d}</td>
      <td>${r.l}</td>
      <td class="hide-xs">${r.gf}</td>
      <td class="hide-xs">${r.ga}</td>
      <td>${gdStr}</td>
      <td><span class="pts-strong">${r.pts}</span></td>
    </tr>`;
  }).join("");
}

// ── Top Scorers ───────────────────────────────────────────────────────────────
async function fetchTopScorers(leagueKey) {
  const league = LEAGUE_MAP[leagueKey];
  if (!league) return;

  const list = document.getElementById("scorers-list");
  if (!list) return;

  list.innerHTML = `<li class="loading-row"><div class="loading-spinner small"></div></li>`;

  try {
    const res = await fetch(`/api/top-scorers/${league.id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const players = data?.response;
    if (players && players.length > 0) {
      renderTopScorers(players.slice(0, 8).map(p => ({
        name:  p.player.name,
        photo: p.player.photo,
        team:  p.statistics[0]?.team?.name || "",
        goals: p.statistics[0]?.goals?.total || 0,
      })));
      return;
    }
  } catch (_) {
    // Fall through to fallback
  }

  const fallback = LEAGUES_FALLBACK[leagueKey];
  if (fallback) renderTopScorers(fallback.topScorers);
}

function renderTopScorers(players) {
  const list = document.getElementById("scorers-list");
  if (!list) return;

  list.innerHTML = players.map((p, i) => {
    const photoHtml = p.photo
      ? `<img src="${escapeHTML(p.photo)}" alt="${escapeHTML(p.name)}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" loading="lazy" onerror="this.style.display='none'">`
      : `<span style="font-size:1.4rem;">⚽</span>`;
    return `<li>
      <span class="scorer-rank">${i + 1}</span>
      ${photoHtml}
      <div class="scorer-info">
        <div class="scorer-name">${escapeHTML(p.name)}</div>
        <div class="scorer-team">${escapeHTML(p.team)}</div>
      </div>
      <span class="scorer-goals">${p.goals} qol</span>
    </li>`;
  }).join("");
}

// ── Live Scores ───────────────────────────────────────────────────────────────
async function fetchLiveScores() {
  const container = document.getElementById("live-scores-container");
  if (!container) return;

  container.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><p>Canlı matçlar yüklənir…</p></div>`;

  try {
    const res = await fetch("/api/live");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderMatches(container, data?.response || [], true);
  } catch (_) {
    container.innerHTML = `<div class="no-data"><div class="no-data-icon">📡</div><p>Hal-hazırda canlı matç yoxdur.</p></div>`;
  }
}

// ── Today's Matches ───────────────────────────────────────────────────────────
async function fetchTodayMatches() {
  const container = document.getElementById("today-matches-container");
  if (!container) return;

  container.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><p>Matçlar yüklənir…</p></div>`;

  try {
    const res = await fetch("/api/matches");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderMatches(container, data?.response || [], false);
  } catch (_) {
    container.innerHTML = `<div class="no-data"><div class="no-data-icon">📅</div><p>Bugün matç tapılmadı.</p></div>`;
  }
}

function renderMatches(container, fixtures, isLive) {
  if (!fixtures.length) {
    container.innerHTML = `<div class="no-data">
      <div class="no-data-icon">${isLive ? "📡" : "📅"}</div>
      <p>${isLive ? "Hal-hazırda canlı matç yoxdur." : "Bugün matç tapılmadı."}</p>
    </div>`;
    return;
  }

  const cards = fixtures.map(f => {
    const home = f.teams?.home;
    const away = f.teams?.away;
    const goals = f.goals;
    const status = f.fixture?.status;
    const leagueName = escapeHTML(f.league?.name || "");
    const homeName   = escapeHTML(home?.name || "?");
    const awayName   = escapeHTML(away?.name || "?");
    const homeLogo   = home?.logo ? `<img src="${escapeHTML(home.logo)}" alt="${homeName}" loading="lazy" onerror="this.style.display='none'">` : "";
    const awayLogo   = away?.logo ? `<img src="${escapeHTML(away.logo)}" alt="${awayName}" loading="lazy" onerror="this.style.display='none'">` : "";

    let scoreHtml, statusHtml;
    if (status?.short === "NS") {
      const time = f.fixture?.date ? new Date(f.fixture.date).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }) : "--:--";
      scoreHtml = `<span class="match-vs">${escapeHTML(time)}</span>`;
      statusHtml = `<span class="status-ns">Başlamamış</span>`;
    } else if (["1H","HT","2H","ET","BT","P","LIVE"].includes(status?.short)) {
      const min = status.elapsed ? `${status.elapsed}'` : "Canlı";
      scoreHtml = `<span class="match-score">${goals?.home ?? 0} – ${goals?.away ?? 0}</span>`;
      statusHtml = `<span class="status-live">🔴 ${escapeHTML(min)}</span>`;
    } else {
      scoreHtml = `<span class="match-score">${goals?.home ?? 0} – ${goals?.away ?? 0}</span>`;
      statusHtml = `<span class="status-ft">Bitdi</span>`;
    }

    return `<div class="match-card">
      <div class="match-league">${leagueName}</div>
      <div class="match-teams">
        <div class="match-team">${homeLogo}<span class="match-team-name">${homeName}</span></div>
        ${scoreHtml}
        <div class="match-team">${awayLogo}<span class="match-team-name">${awayName}</span></div>
      </div>
      <div class="match-status">${statusHtml}</div>
    </div>`;
  }).join("");

  container.innerHTML = `<div class="matches-grid">${cards}</div>`;
}

// ── Search ────────────────────────────────────────────────────────────────────
let searchTimer = null;

function triggerSearch() {
  const input = document.getElementById("search-input");
  if (input) performSearch(input.value);
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => performSearch(input.value), 350);
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { clearTimeout(searchTimer); performSearch(input.value); }
  });
}

async function performSearch(query) {
  const q = query.trim();
  const resultsEl = document.getElementById("search-results");
  if (!resultsEl) return;

  if (q.length < 2) { resultsEl.innerHTML = ""; return; }

  resultsEl.innerHTML = `<div style="display:flex;justify-content:center;padding:16px;"><div class="loading-spinner small"></div></div>`;

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const teams = data?.response || [];

    if (!teams.length) {
      resultsEl.innerHTML = `<p class="search-empty">Heç bir komanda tapılmadı.</p>`;
      return;
    }

    resultsEl.innerHTML = teams.slice(0, 10).map(t => {
      const logo = t.team?.logo ? `<img src="${escapeHTML(t.team.logo)}" alt="${escapeHTML(t.team.name)}" loading="lazy" onerror="this.style.display='none'">` : "⚽";
      const country = escapeHTML(t.team?.country || "");
      return `<div class="search-result-item">
        ${logo}
        <div>
          <div style="font-weight:600;">${escapeHTML(t.team?.name || "")}</div>
          ${country ? `<div style="font-size:.75rem;color:var(--text-muted)">${country}</div>` : ""}
        </div>
      </div>`;
    }).join("");
  } catch (_) {
    resultsEl.innerHTML = `<p class="search-empty">Axtarış zamanı xəta baş verdi.</p>`;
  }
}

// ── Dark Mode ─────────────────────────────────────────────────────────────────
function toggleDark() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") !== "light";
  const newTheme = isDark ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("futbol-theme", newTheme);
  const icon = document.getElementById("dark-icon");
  if (icon) icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

function initTheme() {
  const saved = localStorage.getItem("futbol-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  const icon = document.getElementById("dark-icon");
  if (icon) icon.textContent = saved === "dark" ? "🌙" : "☀️";
}

// ── Mobile Nav ────────────────────────────────────────────────────────────────
function toggleMobileNav() {
  const nav = document.getElementById("mobile-nav");
  const btn = document.getElementById("hamburger-btn");
  if (!nav) return;
  const isOpen = !nav.hidden;
  nav.hidden = isOpen;
  if (btn) {
    btn.classList.toggle("open", !isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
  }
}

// Close mobile nav on outside click
document.addEventListener("click", e => {
  const nav = document.getElementById("mobile-nav");
  const btn = document.getElementById("hamburger-btn");
  if (nav && !nav.hidden && btn && !btn.contains(e.target) && !nav.contains(e.target)) {
    nav.hidden = true;
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
});

// ── Profile Modal ─────────────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = false;

  if (id === "profile-modal") renderProfileModal();

  // Trap focus
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal(id);
  });
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") { closeModal(id); document.removeEventListener("keydown", escHandler); }
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.hidden = true;
}

function renderProfileModal() {
  const body = document.getElementById("profile-modal-body");
  if (!body) return;

  const user = getUser();
  if (user) {
    body.innerHTML = `
      <div class="profile-info">
        <div class="info-label">Ad</div>
        <div class="info-value">${escapeHTML(user.name)}</div>
      </div>
      <div class="profile-info">
        <div class="info-label">Sevimli Komanda</div>
        <div class="info-value">${escapeHTML(user.team || "—")}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
        <button class="btn-primary" onclick="editProfile()">✏️ Redaktə et</button>
        <button class="btn-secondary" onclick="logoutProfile()">Çıxış</button>
      </div>`;
  } else {
    body.innerHTML = `
      <form class="profile-form" onsubmit="saveProfile(event)">
        <div class="profile-field">
          <label for="pf-name">Ad</label>
          <input class="profile-input" id="pf-name" type="text" placeholder="Adınızı daxil edin" maxlength="50" required>
        </div>
        <div class="profile-field">
          <label for="pf-team">Sevimli Komanda</label>
          <input class="profile-input" id="pf-team" type="text" placeholder="Komanda adı" maxlength="60">
        </div>
        <button class="btn-primary" type="submit">Yadda saxla</button>
      </form>`;
  }
}

function saveProfile(e) {
  e.preventDefault();
  const name = document.getElementById("pf-name")?.value?.trim();
  const team = document.getElementById("pf-team")?.value?.trim();
  if (!name) return;
  localStorage.setItem("futbol-user", JSON.stringify({ name, team }));
  updateProfileButton();
  renderProfileModal();
}

function editProfile() {
  localStorage.removeItem("futbol-user");
  renderProfileModal();
}

function logoutProfile() {
  localStorage.removeItem("futbol-user");
  updateProfileButton();
  closeModal("profile-modal");
}

function getUser() {
  try {
    const raw = localStorage.getItem("futbol-user");
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function updateProfileButton() {
  const user = getUser();
  const label = document.getElementById("profile-label");
  const avatar = document.getElementById("profile-avatar");
  if (label) label.textContent = user ? user.name : "Giriş";
  if (avatar) avatar.textContent = user ? "🧑" : "👤";
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateProfileButton();
  setupSearch();

  // Load initial data
  fetchStandings("aze");
  fetchTopScorers("aze");
});
