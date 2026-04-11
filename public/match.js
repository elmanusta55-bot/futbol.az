"use strict";

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getStatusMeta(status, minute) {
  switch (status) {
    case "IN_PLAY": return { label: `LIVE ${minute != null ? `${minute}'` : ""}`.trim(), className: "status-live" };
    case "PAUSED": return { label: "HT", className: "status-ht" };
    case "FINISHED": return { label: "FT", className: "status-ft" };
    case "TIMED":
    case "SCHEDULED": return { label: "NS", className: "status-upcoming" };
    default: return { label: escapeHTML(status || "—"), className: "status-other" };
  }
}

function getParamMatchId() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  return Number.isFinite(id) && id > 0 ? id : null;
}

function formatKickoff(utcDate) {
  if (!utcDate) return "—";
  return new Date(utcDate).toLocaleString("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function findMainReferee(referees) {
  if (!Array.isArray(referees)) return "—";
  const main = referees.find((r) => r.type === "REFEREE") || referees[0];
  return main?.name || "—";
}

function normalizeNumber(value) {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatStatValue(value, isPercent = false) {
  const n = normalizeNumber(value);
  if (n == null) return "—";
  if (isPercent) return `${Math.round(n)}%`;
  if (Math.abs(n) >= 1000) return Math.round(n).toLocaleString("az-AZ");
  return String(Math.round(n * 10) / 10);
}

function getByPaths(obj, paths) {
  for (const path of paths) {
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) break;
      cur = cur[p];
    }
    if (cur != null) return cur;
  }
  return null;
}

function getStatRows(match) {
  const statsObj = match.statistics || {};
  const statSources = [
    statsObj,
    statsObj.homeAway,
    { home: statsObj.homeTeam || match.homeTeam?.statistics, away: statsObj.awayTeam || match.awayTeam?.statistics },
  ];

  const statDefs = [
    { key: "possession", label: "Possession", percent: true, paths: ["possession", "ballPossession", "ball_possession"] },
    { key: "shots", label: "Shots", paths: ["shots", "totalShots", "shotsTotal", "shots.total"] },
    { key: "shotsOnTarget", label: "Shots on target", paths: ["shotsOnTarget", "shots_on_goal", "shots.onTarget"] },
    { key: "corners", label: "Corners", paths: ["corners", "cornerKicks", "corner_kicks"] },
    { key: "fouls", label: "Fouls", paths: ["fouls", "foulsCommitted", "fouls.committed"] },
    { key: "passes", label: "Passes", paths: ["passes", "totalPasses", "passes.total"] },
    { key: "xg", label: "xG", paths: ["xg", "expectedGoals", "expected_goals"] },
  ];

  const rows = statDefs.map((def) => {
    let homeValue = null;
    let awayValue = null;

    for (const src of statSources) {
      if (!src) continue;
      if (homeValue == null) homeValue = getByPaths(src.home || {}, def.paths);
      if (awayValue == null) awayValue = getByPaths(src.away || {}, def.paths);
    }

    if ((homeValue == null || awayValue == null) && Array.isArray(statsObj)) {
      const found = statsObj.find((s) => {
        const name = String(s?.type || s?.name || "").toLowerCase();
        return def.paths.some((p) => name.includes(p.toLowerCase().split(".")[0]));
      });
      if (found) {
        homeValue = homeValue ?? found.home ?? found.homeTeam ?? found.values?.home;
        awayValue = awayValue ?? found.away ?? found.awayTeam ?? found.values?.away;
      }
    }

    return {
      ...def,
      home: normalizeNumber(homeValue),
      away: normalizeNumber(awayValue),
    };
  });

  return rows;
}

function renderStatRow(row) {
  const hasBoth = row.home != null && row.away != null;
  const total = hasBoth ? Math.max(row.home + row.away, 1) : 1;
  const homePct = hasBoth ? Math.max(0, Math.min(100, (row.home / total) * 100)) : 50;
  const awayPct = hasBoth ? 100 - homePct : 50;

  return `
    <article class="stat-row">
      <div class="stat-row-head">
        <strong>${escapeHTML(row.label)}</strong>
        <span>${formatStatValue(row.home, row.percent)} - ${formatStatValue(row.away, row.percent)}</span>
      </div>
      <div class="stat-bar" role="img" aria-label="${escapeHTML(row.label)} müqayisəsi">
        <span class="stat-bar-home" style="width:${homePct}%"></span>
        <span class="stat-bar-away" style="width:${awayPct}%"></span>
      </div>
    </article>`;
}

function renderStatsSection(match) {
  const rows = getStatRows(match);
  const availableRows = rows.filter((row) => row.home != null || row.away != null);

  if (!availableRows.length) {
    return `<div class="match-placeholder-tab"><strong>Stats</strong><span>Mövcud data planında statistik məlumat əlçatan deyil.</span></div>`;
  }

  const possession = availableRows.find((row) => row.key === "possession");
  const donut = possession && possession.home != null && possession.away != null
    ? `<div class="possession-donut-wrap"><div class="possession-donut" style="--home:${Math.max(0, Math.min(100, (possession.home / Math.max(1, possession.home + possession.away)) * 100))}%"></div><div class="possession-donut-label">${formatStatValue(possession.home, true)} / ${formatStatValue(possession.away, true)}</div></div>`
    : "";

  return `
    <div class="stats-layout">
      <div class="stats-rows">${availableRows.map(renderStatRow).join("")}</div>
      ${donut}
    </div>`;
}

function extractPlayerName(player, fallback) {
  if (!player) return fallback;
  if (typeof player === "string") return player;
  return player.name || player.player?.name || player.fullName || fallback;
}

function getLineupBlock(match, side) {
  const sideId = side === "home" ? match.homeTeam?.id : match.awayTeam?.id;
  const lineups = match.lineups;

  if (Array.isArray(lineups)) {
    const fromTeam = lineups.find((l) => l?.team?.id === sideId) || lineups[side === "home" ? 0 : 1];
    if (fromTeam) return fromTeam;
  }

  if (lineups && typeof lineups === "object") {
    return lineups[side] || lineups[side === "home" ? "homeTeam" : "awayTeam"] || null;
  }

  return null;
}

function renderLineupList(players) {
  if (!players.length) return `<li class="lineup-empty">Məlumat yoxdur</li>`;
  return players
    .map((p, idx) => `<li>${escapeHTML(extractPlayerName(p, `Player ${idx + 1}`))}</li>`)
    .join("");
}

function renderPitch(lineup) {
  const xi = Array.isArray(lineup?.startingXI) ? lineup.startingXI : Array.isArray(lineup?.startXI) ? lineup.startXI : [];
  if (!xi.length) {
    return `<div class="match-placeholder-tab"><strong>Lineups</strong><span>Start heyət mövcud deyil.</span></div>`;
  }

  const formation = String(lineup?.formation || "4-4-2");
  const formationParts = formation.split("-").map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n) && n > 0);
  const rows = [1, ...formationParts];
  const lineupRows = [];
  let cursor = 0;

  rows.forEach((count) => {
    const rowPlayers = xi.slice(cursor, cursor + count);
    lineupRows.push(rowPlayers);
    cursor += count;
  });

  if (cursor < xi.length) lineupRows.push(xi.slice(cursor));

  return `
    <div class="pitch" aria-label="Formation ${escapeHTML(formation)}">
      ${lineupRows.map((rowPlayers) => `
        <div class="pitch-row">
          ${rowPlayers.map((p, idx) => `<span class="pitch-player" title="${escapeHTML(extractPlayerName(p, `Player ${idx + 1}`))}">${escapeHTML(extractPlayerName(p, `P${idx + 1}`).split(" ").slice(-1)[0])}</span>`).join("")}
        </div>`).join("")}
    </div>`;
}

function renderLineupsSection(match) {
  const homeLineup = getLineupBlock(match, "home");
  const awayLineup = getLineupBlock(match, "away");

  if (!homeLineup && !awayLineup) {
    return `<div class="match-placeholder-tab"><strong>Lineups</strong><span>Coming soon / unavailable with current data plan.</span></div>`;
  }

  const homeName = match.homeTeam?.shortName || match.homeTeam?.name || "Home";
  const awayName = match.awayTeam?.shortName || match.awayTeam?.name || "Away";
  const homeBench = Array.isArray(homeLineup?.bench) ? homeLineup.bench : Array.isArray(homeLineup?.substitutes) ? homeLineup.substitutes : [];
  const awayBench = Array.isArray(awayLineup?.bench) ? awayLineup.bench : Array.isArray(awayLineup?.substitutes) ? awayLineup.substitutes : [];

  return `
    <div class="lineups-grid">
      <article class="lineup-card">
        <h3>${escapeHTML(homeName)} ${homeLineup?.formation ? `<span>${escapeHTML(homeLineup.formation)}</span>` : ""}</h3>
        ${homeLineup ? renderPitch(homeLineup) : `<div class="match-placeholder-tab"><span>Məlumat yoxdur.</span></div>`}
        <h4>Starting XI</h4>
        <ul class="lineup-list">${renderLineupList(Array.isArray(homeLineup?.startingXI) ? homeLineup.startingXI : Array.isArray(homeLineup?.startXI) ? homeLineup.startXI : [])}</ul>
        <h4>Bench</h4>
        <ul class="lineup-list">${renderLineupList(homeBench)}</ul>
      </article>
      <article class="lineup-card">
        <h3>${escapeHTML(awayName)} ${awayLineup?.formation ? `<span>${escapeHTML(awayLineup.formation)}</span>` : ""}</h3>
        ${awayLineup ? renderPitch(awayLineup) : `<div class="match-placeholder-tab"><span>Məlumat yoxdur.</span></div>`}
        <h4>Starting XI</h4>
        <ul class="lineup-list">${renderLineupList(Array.isArray(awayLineup?.startingXI) ? awayLineup.startingXI : Array.isArray(awayLineup?.startXI) ? awayLineup.startXI : [])}</ul>
        <h4>Bench</h4>
        <ul class="lineup-list">${renderLineupList(awayBench)}</ul>
      </article>
    </div>`;
}

function resolveMatchResult(item) {
  const homeGoals = item.score?.fullTime?.home ?? item.score?.home;
  const awayGoals = item.score?.fullTime?.away ?? item.score?.away;
  if (normalizeNumber(homeGoals) == null || normalizeNumber(awayGoals) == null) return "draw";
  if (homeGoals > awayGoals) return "home";
  if (awayGoals > homeGoals) return "away";
  return "draw";
}

function renderH2HSection(h2hData, match) {
  const games = Array.isArray(h2hData?.matches) ? h2hData.matches.slice(0, 8) : [];
  if (!games.length) {
    return `<div class="match-placeholder-tab"><strong>H2H</strong><span>Coming soon / unavailable with current data plan.</span></div>`;
  }

  const homeId = match.homeTeam?.id;
  const awayId = match.awayTeam?.id;
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;

  const rows = games.map((item) => {
    const result = resolveMatchResult(item);
    if (result === "draw") draws += 1;
    else if ((result === "home" && item.homeTeam?.id === homeId) || (result === "away" && item.awayTeam?.id === homeId)) homeWins += 1;
    else if ((result === "home" && item.homeTeam?.id === awayId) || (result === "away" && item.awayTeam?.id === awayId)) awayWins += 1;

    return `<li>
      <span>${escapeHTML(formatKickoff(item.utcDate || item.date || "").split(",")[0])}</span>
      <strong>${escapeHTML(item.homeTeam?.shortName || item.homeTeam?.name || "Home")} ${item.score?.fullTime?.home ?? "-"} - ${item.score?.fullTime?.away ?? "-"} ${escapeHTML(item.awayTeam?.shortName || item.awayTeam?.name || "Away")}</strong>
      <small>${escapeHTML(item.competition?.name || "")}</small>
    </li>`;
  }).join("");

  return `
    <div class="h2h-summary">
      <div><strong>${homeWins}</strong><span>Home wins</span></div>
      <div><strong>${draws}</strong><span>Draws</span></div>
      <div><strong>${awayWins}</strong><span>Away wins</span></div>
    </div>
    <ul class="h2h-list">${rows}</ul>`;
}

function renderMatch(match) {
  const home = match.homeTeam || {};
  const away = match.awayTeam || {};
  const score = match.score?.fullTime || {};
  const comp = match.competition || {};
  const status = getStatusMeta(match.status, match.minute);
  const h = score.home ?? "-";
  const a = score.away ?? "-";
  const homePrimary = home.shortName || home.name || "Ev";
  const awayPrimary = away.shortName || away.name || "Qonaq";
  const homeSecondary = home.shortName && home.name && home.shortName !== home.name ? home.name : "";
  const awaySecondary = away.shortName && away.name && away.shortName !== away.name ? away.name : "";
  const statsHtml = renderStatsRows(match);
  const lineupsHtml = renderLineups(match, home, away);
  const h2hHtml = renderH2H(match, home, away);
  const timelineHtml = renderTimeline(match);

  const homeCrest = home.crest ? `<img class="match-team-crest" src="${escapeHTML(home.crest)}" alt="${escapeHTML(home.name || "")}" loading="lazy">` : `<div class="match-team-crest-placeholder">🛡️</div>`;
  const awayCrest = away.crest ? `<img class="match-team-crest" src="${escapeHTML(away.crest)}" alt="${escapeHTML(away.name || "")}" loading="lazy">` : `<div class="match-team-crest-placeholder">🛡️</div>`;

  return `
    <article class="match-detail-card">
      <header class="match-detail-head match-detail-head--pro">
        <div class="match-detail-competition">
          <div class="match-comp">${comp.emblem ? `<img src="${escapeHTML(comp.emblem)}" alt="" loading="lazy">` : ""}${escapeHTML(comp.name || "")}</div>
          <span class="match-status-badge ${status.className}">${status.label}</span>
        </div>
        <div class="match-teams match-detail-teams">
          <div class="match-team">
            ${homeCrest}
            <div class="match-team-name">${escapeHTML(homePrimary)}</div>
            ${homeSecondary ? `<div class="match-team-subname">${escapeHTML(homeSecondary)}</div>` : ""}
          </div>
          <div class="match-score-area match-detail-score-wrap">
            <div class="match-score">${h} – ${a}</div>
          </div>
          <div class="match-team">
            ${awayCrest}
            <div class="match-team-name">${escapeHTML(awayPrimary)}</div>
            ${awaySecondary ? `<div class="match-team-subname">${escapeHTML(awaySecondary)}</div>` : ""}
          </div>
        </div>
      </header>

      <div class="match-detail-meta">
        <div class="match-detail-meta-item"><span class="k">Kickoff</span>${escapeHTML(formatKickoff(match.utcDate))}</div>
        <div class="match-detail-meta-item"><span class="k">Stadion</span>${escapeHTML(match.venue || "—")}</div>
        <div class="match-detail-meta-item"><span class="k">Hakim</span>${escapeHTML(findMainReferee(match.referees))}</div>
        <div class="match-detail-meta-item"><span class="k">Matç ID</span>${escapeHTML(String(match.id || "—"))}</div>
      </div>

      <nav class="match-detail-tabs" aria-label="Matç detalları bölmələri">
        <button type="button" class="match-detail-tab is-active" data-tab="stats" onclick="switchDetailTab('stats')">Stats</button>
        <button type="button" class="match-detail-tab" data-tab="lineups" onclick="switchDetailTab('lineups')">Lineups</button>
        <button type="button" class="match-detail-tab" data-tab="h2h" onclick="switchDetailTab('h2h')">H2H</button>
        <button type="button" class="match-detail-tab" data-tab="predictions" onclick="switchDetailTab('predictions')">Predictions</button>
      </nav>

      <section class="match-detail-placeholder-wrap">
        <div class="match-detail-panel is-active" data-panel="stats">
          <div class="section-skeleton"><div></div><div></div><div></div></div>
        </div>
        <div class="match-detail-panel" data-panel="lineups" hidden>
          <div class="section-skeleton"><div></div><div></div><div></div></div>
        </div>
        <div class="match-detail-panel" data-panel="h2h" hidden>
          <div class="section-skeleton"><div></div><div></div><div></div></div>
        </div>
        <div class="match-detail-panel" data-panel="predictions" hidden>
          <div class="match-placeholder-tab"><strong>Predictions · Coming soon</strong><span>Model əsaslı ehtimallar və qrafiklər backend modeli əlavə ediləndən sonra görünəcək.</span></div>
        </div>
      </section>
    </article>`;
}

function switchDetailTab(tab) {
  const tabs = document.querySelectorAll(".match-detail-tab");
  const panels = document.querySelectorAll(".match-detail-panel");
  tabs.forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === tab;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function setPanelContent(panelName, html) {
  const panel = document.querySelector(`.match-detail-panel[data-panel="${panelName}"]`);
  if (!panel) return;
  panel.innerHTML = html;
}

async function hydrateH2H(matchId, match) {
  try {
    const res = await fetch(`/api/fd/match/${encodeURIComponent(matchId)}/h2h?limit=6`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setPanelContent("h2h", renderH2HSection(data, match));
  } catch (_) {
    setPanelContent("h2h", `<div class="match-placeholder-tab"><strong>H2H</strong><span>Coming soon / unavailable with current data plan.</span></div>`);
  }
}

async function loadMatchDetail() {
  const container = document.getElementById("match-detail");
  if (!container) return;

  const matchId = getParamMatchId();
  if (!matchId) {
    container.innerHTML = `<div class="live-empty"><div class="live-empty-icon">⚠️</div><div class="live-empty-text">Yanlış matç ID</div></div>`;
    return;
  }

  try {
    const res = await fetch(`/api/fd/match/${encodeURIComponent(matchId)}`);
    if (res.status === 429) {
      container.innerHTML = `<div class="live-empty"><div class="live-empty-icon">⏳</div><div class="live-empty-text">Rate limit səbəbilə detallar müvəqqəti əlçatan deyil.</div></div>`;
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    container.innerHTML = renderMatch(data);
    setPanelContent("stats", renderStatsSection(data));
    setPanelContent("lineups", renderLineupsSection(data));
    hydrateH2H(matchId, data);

    document.title = `${data.homeTeam?.shortName || data.homeTeam?.name || "Ev"} vs ${data.awayTeam?.shortName || data.awayTeam?.name || "Qonaq"} | Futbol.az`;
  } catch (_) {
    container.innerHTML = `<div class="live-empty"><div class="live-empty-icon">⚠️</div><div class="live-empty-text">Matç detalları yüklənmədi.</div></div>`;
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("futbol-theme", newTheme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

function initTheme() {
  const saved = localStorage.getItem("futbol-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = saved === "dark" ? "🌙" : "☀️";
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn = document.getElementById("hamburger");
  if (!menu) return;
  const isHidden = menu.hidden;
  menu.hidden = !isHidden;
  if (btn) btn.setAttribute("aria-expanded", String(isHidden));
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadMatchDetail();
});
