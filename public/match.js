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
  const homePrimary = home.shortName || home.name || "Ev";
  const awayPrimary = away.shortName || away.name || "Qonaq";
  const homeSecondary = home.shortName && home.name && home.shortName !== home.name ? home.name : "";
  const awaySecondary = away.shortName && away.name && away.shortName !== away.name ? away.name : "";

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
          <div class="match-placeholder-tab"><strong>Stats</strong><span>Detallı statistika tezliklə əlavə ediləcək.</span></div>
        </div>
        <div class="match-detail-panel" data-panel="lineups" hidden>
          <div class="match-placeholder-tab"><strong>Lineups</strong><span>Start heyət və ehtiyat oyunçular tezliklə görünəcək.</span></div>
        </div>
        <div class="match-detail-panel" data-panel="h2h" hidden>
          <div class="match-placeholder-tab"><strong>H2H</strong><span>Son qarşılaşmalar və müqayisə məlumatları tezliklə.</span></div>
        </div>
        <div class="match-detail-panel" data-panel="predictions" hidden>
          <div class="match-placeholder-tab"><strong>Predictions</strong><span>Model əsaslı ehtimallar tezliklə əlavə olunacaq.</span></div>
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
