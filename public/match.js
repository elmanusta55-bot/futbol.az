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

function renderMatch(match) {
  const home = match.homeTeam || {};
  const away = match.awayTeam || {};
  const score = match.score?.fullTime || {};
  const comp = match.competition || {};
  const status = getStatusMeta(match.status, match.minute);
  const h = score.home ?? "-";
  const a = score.away ?? "-";

  const homeCrest = home.crest ? `<img class="match-team-crest" src="${escapeHTML(home.crest)}" alt="${escapeHTML(home.name || "")}" loading="lazy">` : `<div class="match-team-crest-placeholder">🛡️</div>`;
  const awayCrest = away.crest ? `<img class="match-team-crest" src="${escapeHTML(away.crest)}" alt="${escapeHTML(away.name || "")}" loading="lazy">` : `<div class="match-team-crest-placeholder">🛡️</div>`;

  return `
    <article class="match-detail-card">
      <header class="match-detail-head">
        <div class="match-comp">${comp.emblem ? `<img src="${escapeHTML(comp.emblem)}" alt="" loading="lazy">` : ""}${escapeHTML(comp.name || "")}</div>
        <span class="match-status-badge ${status.className}">${status.label}</span>
      </header>

      <div class="match-teams">
        <div class="match-team">
          ${homeCrest}
          <div class="match-team-name">${escapeHTML(home.name || "Ev")}</div>
        </div>
        <div class="match-score-area">
          <div class="match-score">${h} – ${a}</div>
        </div>
        <div class="match-team">
          ${awayCrest}
          <div class="match-team-name">${escapeHTML(away.name || "Qonaq")}</div>
        </div>
      </div>

      <div class="match-detail-meta">
        <div class="match-detail-meta-item"><span class="k">Kickoff</span>${escapeHTML(formatKickoff(match.utcDate))}</div>
        <div class="match-detail-meta-item"><span class="k">Stadion</span>${escapeHTML(match.venue || "—")}</div>
        <div class="match-detail-meta-item"><span class="k">Hakim</span>${escapeHTML(findMainReferee(match.referees))}</div>
        <div class="match-detail-meta-item"><span class="k">Matç ID</span>${escapeHTML(String(match.id || "—"))}</div>
      </div>

      <div class="match-placeholder-tabs">
        <div class="match-placeholder-tab">Stats (tezliklə)</div>
        <div class="match-placeholder-tab">Lineups (tezliklə)</div>
        <div class="match-placeholder-tab">H2H (tezliklə)</div>
        <div class="match-placeholder-tab">Predictions (tezliklə)</div>
      </div>
    </article>`;
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
