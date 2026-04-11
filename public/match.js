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
  const main = referees.find(r => r.type === "REFEREE") || referees[0];
  return main?.name || "—";
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeStats(match) {
  const stats = match.statistics || match.stats || [];
  if (Array.isArray(stats) && stats.length) {
    return stats
      .map((s) => ({
        label: s.type || s.name || "",
        home: s.home ?? s.value?.home ?? s.values?.home ?? s.team1 ?? s.left ?? "—",
        away: s.away ?? s.value?.away ?? s.values?.away ?? s.team2 ?? s.right ?? "—",
      }))
      .filter((s) => s.label);
  }

  if (stats && typeof stats === "object" && stats.home && stats.away) {
    const keys = Object.keys(stats.home);
    return keys.map((key) => ({
      label: key,
      home: stats.home[key] ?? "—",
      away: stats.away?.[key] ?? "—",
    }));
  }
  return [];
}

function renderStatsRows(match) {
  const stats = normalizeStats(match);
  if (!stats.length) {
    return `<div class="match-placeholder-tab"><strong>Stats · Coming soon</strong><span>Detallı statistika (topa sahib olma, zərbələr, paslar və s.) bu API planında mövcud olduqda göstəriləcək.</span></div>`;
  }

  return `<div class="match-stats-grid">${stats.map((stat) => {
    const homeNum = toNumber(stat.home);
    const awayNum = toNumber(stat.away);
    const total = (homeNum ?? 0) + (awayNum ?? 0);
    const homePct = total > 0 ? (homeNum ?? 0) / total * 100 : 50;
    const awayPct = 100 - homePct;
    return `<div class="match-stat-row">
      <div class="match-stat-top">
        <span class="v home">${escapeHTML(String(stat.home))}</span>
        <span class="k">${escapeHTML(String(stat.label))}</span>
        <span class="v away">${escapeHTML(String(stat.away))}</span>
      </div>
      <div class="match-stat-chart" aria-hidden="true">
        <span class="home-bar" style="width:${homePct.toFixed(2)}%"></span>
        <span class="away-bar" style="width:${awayPct.toFixed(2)}%"></span>
      </div>
    </div>`;
  }).join("")}</div>`;
}

function getLineupPlayers(teamLineup) {
  if (!teamLineup) return [];
  return teamLineup.startXI || teamLineup.startingXI || teamLineup.starting || teamLineup.eleven || teamLineup.players || [];
}

function renderLineups(match, homeTeam, awayTeam) {
  const lineups = match.lineups;
  if (!lineups) {
    return `<div class="match-placeholder-tab"><strong>Lineups · Coming soon</strong><span>Start heyətlər və mövqelər API məlumatında olduqda burada görünəcək.</span></div>`;
  }

  const homeLineup = Array.isArray(lineups)
    ? lineups.find((l) => l.team?.id === homeTeam.id) || lineups[0]
    : lineups.home;
  const awayLineup = Array.isArray(lineups)
    ? lineups.find((l) => l.team?.id === awayTeam.id) || lineups[1]
    : lineups.away;
  const homePlayers = getLineupPlayers(homeLineup);
  const awayPlayers = getLineupPlayers(awayLineup);

  if (!homePlayers.length && !awayPlayers.length) {
    return `<div class="match-placeholder-tab"><strong>Lineups · Coming soon</strong><span>Bu matç üçün heyət məlumatı mövcud deyil.</span></div>`;
  }

  const renderTeamLineup = (title, lineup, players) => `<article class="lineup-team-card">
    <h4>${escapeHTML(title)}${lineup?.formation ? ` <span>${escapeHTML(lineup.formation)}</span>` : ""}</h4>
    <ul>
      ${players.map((entry) => {
        const player = entry.player || entry;
        const shirt = player.shirtNumber || player.number || "—";
        const pos = player.position || player.pos || "N/A";
        const name = player.name || "Naməlum";
        return `<li><span class="shirt">${escapeHTML(String(shirt))}</span><span class="name">${escapeHTML(name)}</span><span class="pos">${escapeHTML(String(pos))}</span></li>`;
      }).join("")}
    </ul>
  </article>`;

  return `<div class="lineup-grid">${renderTeamLineup(homeTeam.shortName || homeTeam.name || "Ev", homeLineup, homePlayers)}${renderTeamLineup(awayTeam.shortName || awayTeam.name || "Qonaq", awayLineup, awayPlayers)}</div>`;
}

function renderH2H(match, homeTeam, awayTeam) {
  const list = match.head2head?.matches || match.h2h?.matches || match.h2h || [];
  if (!Array.isArray(list) || !list.length) {
    return `<div class="match-placeholder-tab"><strong>H2H · Coming soon</strong><span>Komandaların son qarşılaşmaları bu API planında olduqda göstəriləcək.</span></div>`;
  }

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  list.forEach((m) => {
    const h = m.score?.fullTime?.home ?? m.goals?.home;
    const a = m.score?.fullTime?.away ?? m.goals?.away;
    if (h == null || a == null) return;
    if (h > a) homeWins += 1;
    else if (a > h) awayWins += 1;
    else draws += 1;
  });

  return `<div class="h2h-summary">
    <div class="h2h-score-card"><span>${escapeHTML(homeTeam.shortName || homeTeam.name || "Ev")}</span><strong>${homeWins}</strong></div>
    <div class="h2h-score-card"><span>Bərabərə</span><strong>${draws}</strong></div>
    <div class="h2h-score-card"><span>${escapeHTML(awayTeam.shortName || awayTeam.name || "Qonaq")}</span><strong>${awayWins}</strong></div>
  </div>`;
}

function renderTimeline(match) {
  const events = [];
  (match.goals || []).forEach((g) => events.push({ minute: g.minute, type: "Qol", team: g.team?.name, player: g.scorer?.name }));
  (match.bookings || []).forEach((b) => events.push({ minute: b.minute, type: b.card === "RED_CARD" || b.card === "RED" ? "Qırmızı kart" : "Sarı kart", team: b.team?.name, player: b.player?.name }));
  (match.substitutions || []).forEach((s) => events.push({ minute: s.minute, type: "Əvəzetmə", team: s.team?.name, player: `${s.playerOut?.name || "?"} → ${s.playerIn?.name || "?"}` }));

  if (!events.length) {
    return `<div class="match-placeholder-tab"><strong>Timeline · Coming soon</strong><span>Qol/kart/əvəzetmə hadisələri bu matç üçün mövcud deyil.</span></div>`;
  }

  events.sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
  return `<ul class="timeline-list">${events.map((e) => `<li><span class="m">${escapeHTML(String(e.minute ?? "•"))}${e.minute != null ? "'" : ""}</span><div><strong>${escapeHTML(e.type)}</strong><span>${escapeHTML(e.player || "Naməlum")} · ${escapeHTML(e.team || "—")}</span></div></li>`).join("")}</ul>`;
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
          ${statsHtml}
          <div class="match-detail-subsection">
            <h3>Timeline</h3>
            ${timelineHtml}
          </div>
        </div>
        <div class="match-detail-panel" data-panel="lineups" hidden>
          ${lineupsHtml}
        </div>
        <div class="match-detail-panel" data-panel="h2h" hidden>
          ${h2hHtml}
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
