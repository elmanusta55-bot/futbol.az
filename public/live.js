/* ═══════════════════════════════════════════════════════════════════
   FUTBOL.AZ – Live Matches, Goal Notifications & Polling
   Uses Football-Data.org v4 via local proxy /api/fd/*
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

// ── Constants ──────────────────────────────────────────────────────────────────
const LS_SETTINGS      = "faz_live_settings";
const LS_SCORES        = "faz_live_scores";
const LS_FILTERS       = "faz_live_filters";
const PARTICLE_COUNT   = 6;
const REFRESH_LABEL    = "Axırıncı yeniləmə: ";
const POLL_INTERVAL_MS = 10_000;

// Football-Data.org v4 match statuses
const STATUS_LIVE     = new Set(["IN_PLAY", "PAUSED"]);
const STATUS_FINISHED = new Set(["FINISHED"]);
const STATUS_UPCOMING = new Set(["TIMED", "SCHEDULED"]);

// ── HTML Escape ────────────────────────────────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Settings ───────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  notifOn:          true,
  soundOn:          true,
  browserNotifOn:   false,
  favoriteTeam:     "",
  pollIntervalSecs: 10,
};

let settings = loadSettings();

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    return raw ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(raw)) : Object.assign({}, DEFAULT_SETTINGS);
  } catch (_) {
    return Object.assign({}, DEFAULT_SETTINGS);
  }
}

function saveSettings() {
  try { localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); } catch (_) {}
}

function onSettingChange(key, value) {
  settings[key] = value;
  saveSettings();
  applySettingsToUI();

  // If browser notifications just enabled, request permission
  if (key === "browserNotifOn" && value) {
    requestBrowserNotifPermission();
  }
}

function applySettingsToUI() {
  const notifBtn   = document.getElementById("notif-toggle-btn");
  const soundBtn   = document.getElementById("sound-toggle-btn");
  const notifChk   = document.getElementById("sett-notif-toggle");
  const soundChk   = document.getElementById("sett-sound-toggle");
  const browserChk = document.getElementById("sett-browser-notif");
  const favInput   = document.getElementById("sett-fav-team");
  const interval   = document.getElementById("sett-interval");

  if (notifBtn)   { notifBtn.classList.toggle("on", settings.notifOn);  notifBtn.textContent = (settings.notifOn ? "🔔" : "🔕") + " Bildiriş"; }
  if (soundBtn)   { soundBtn.classList.toggle("on", settings.soundOn);  soundBtn.textContent = (settings.soundOn ? "🔊" : "🔇") + " Səs"; }
  if (notifChk)   notifChk.checked   = settings.notifOn;
  if (soundChk)   soundChk.checked   = settings.soundOn;
  if (browserChk) browserChk.checked = settings.browserNotifOn;
  if (favInput)   favInput.value     = settings.favoriteTeam || "";
  if (interval)   interval.value     = String(settings.pollIntervalSecs);
}

// ── Score Cache ────────────────────────────────────────────────────────────────
// Persists last known scores to avoid duplicate notifications across page reloads
let scoreCache = loadScoreCache();

function loadScoreCache() {
  try {
    const raw = localStorage.getItem(LS_SCORES);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveScoreCache() {
  try { localStorage.setItem(LS_SCORES, JSON.stringify(scoreCache)); } catch (_) {}
}

// ── Goal Detection ─────────────────────────────────────────────────────────────
/**
 * Compare new match scores against the cached scores.
 * Returns an array of goal events for any matches where the score increased.
 *
 * @param {Array} matches   – Football-Data.org match objects
 * @returns {Array<{match, homeGoals: number, awayGoals: number}>}
 */
function detectGoals(matches) {
  const events = [];

  for (const match of matches) {
    if (!STATUS_LIVE.has(match.status)) continue;

    const id    = String(match.id);
    const home  = match.score?.fullTime?.home ?? 0;
    const away  = match.score?.fullTime?.away ?? 0;
    const prev  = scoreCache[id];

    if (prev === undefined) {
      // First time we see this match – just record the score, no notification
      scoreCache[id] = { home, away };
      continue;
    }

    if (home > prev.home || away > prev.away) {
      events.push({ match, homeGoals: home, awayGoals: away });
      scoreCache[id] = { home, away };
    }
  }

  saveScoreCache();
  return events;
}

// ── Sound ──────────────────────────────────────────────────────────────────────
let _audioCtx = null;

function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

function playGoalSound() {
  if (!settings.soundOn) return;
  try {
    const ctx  = getAudioCtx();
    const now  = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    gain.connect(ctx.destination);

    // Three ascending notes – classic "goal!" fanfare
    [[880, 0], [1100, 0.12], [1320, 0.24]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.35);
    });
  } catch (_) {}
}

// ── Browser Notifications ──────────────────────────────────────────────────────
async function requestBrowserNotifPermission() {
  if (!("Notification" in window)) return;
  const result = await Notification.requestPermission();
  if (result !== "granted") {
    settings.browserNotifOn = false;
    saveSettings();
    applySettingsToUI();
  }
}

function sendBrowserNotif(title, body, icon) {
  if (!settings.browserNotifOn) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: icon || "/logo.png" });
  } catch (_) {}
}

// ── Goal Toast ─────────────────────────────────────────────────────────────────
function showGoalToast(match, homeGoals, awayGoals) {
  if (!settings.notifOn) return;

  const home   = match.homeTeam?.shortName || match.homeTeam?.name || "Ev";
  const away   = match.awayTeam?.shortName || match.awayTeam?.name || "Qonaq";
  const score  = `${homeGoals} – ${awayGoals}`;
  const comp   = escapeHTML(match.competition?.name || "");
  const scoreDisplay = `${escapeHTML(home)} ${score} ${escapeHTML(away)}`;

  // Try to extract scorer from goals array (not always available in free tier)
  let scorerText = "";
  const goals = match.goals || [];
  if (goals.length) {
    const lastGoal = goals[goals.length - 1];
    if (lastGoal?.scorer?.name) {
      scorerText = escapeHTML(lastGoal.scorer.name);
    }
  }

  const container = document.getElementById("goal-toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "goal-toast";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="goal-toast-icon">⚽</div>
    <div class="goal-toast-body">
      <div class="goal-toast-title">⚡ QOL!</div>
      ${scorerText ? `<div class="goal-toast-scorer">${scorerText}</div>` : ""}
      <div class="goal-toast-match">${scoreDisplay}${comp ? ` · ${comp}` : ""}</div>
    </div>
    <div class="goal-toast-score">${score}</div>
    <button class="goal-toast-dismiss" onclick="this.closest('.goal-toast').remove()" aria-label="Bağla">✕</button>`;

  container.appendChild(toast);
  spawnCelebrationParticles();
  playGoalSound();
  sendBrowserNotif(`⚽ QOL! ${score}`, scorerText || scoreDisplay, match.homeTeam?.crest || "/logo.png");

  // Auto-remove after 8s
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "none";
      toast.style.opacity   = "0";
      toast.style.transform = "translateX(30px)";
      toast.style.transition = "opacity .3s, transform .3s";
      setTimeout(() => toast.remove(), 300);
    }
  }, 8000);
}

function spawnCelebrationParticles() {
  const emojis = ["⚽", "🎉", "🌟", "🔥", "✨"];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const el = document.createElement("div");
    el.className = "celebrate-particle";
    el.textContent = emojis[i % emojis.length];
    el.style.left = `${20 + Math.random() * 60}vw`;
    el.style.top  = `${60 + Math.random() * 20}vh`;
    el.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
}

// ── Polling ─────────────────────────────────────────────────────────────────────
let _pollTimer = null;
let _activeTab = "today";
let _lastMatches = [];
let _showAllMatches = false;
let _lastScoreSnapshot = {};
let _changedMatchIds = new Set();
let _pollAbortController = null;
let _pollRequestCounter = 0;
let _hasLoadedOnce = false;
const MATCHES_DEFAULT_LIMIT = 10;

const DEFAULT_FILTERS = {
  date: new Date().toISOString().slice(0, 10),
  competition: "all",
  liveOnly: false,
};

let filters = loadFilters();

function loadFilters() {
  let fromStorage = {};
  try {
    const raw = localStorage.getItem(LS_FILTERS);
    fromStorage = raw ? JSON.parse(raw) : {};
  } catch (_) {}

  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");
  const competitionParam = params.get("competition");
  const liveParam = params.get("live");

  const loaded = {
    ...DEFAULT_FILTERS,
    ...fromStorage,
  };

  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) loaded.date = dateParam;
  if (competitionParam) loaded.competition = competitionParam;
  if (liveParam === "1" || liveParam === "true") loaded.liveOnly = true;
  if (liveParam === "0") loaded.liveOnly = false;

  return loaded;
}

function persistFilters() {
  try { localStorage.setItem(LS_FILTERS, JSON.stringify(filters)); } catch (_) {}

  const params = new URLSearchParams(window.location.search);
  params.set("date", filters.date);
  if (filters.competition && filters.competition !== "all") params.set("competition", filters.competition);
  else params.delete("competition");
  if (filters.liveOnly) params.set("live", "1");
  else params.delete("live");

  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState({}, "", url);
}

function syncFilterControls() {
  const dateInput = document.getElementById("date-filter");
  const liveOnlyInput = document.getElementById("live-only-filter");
  if (dateInput) dateInput.value = filters.date;
  if (liveOnlyInput) liveOnlyInput.checked = !!filters.liveOnly;
}

function getEndpoint() {
  if (_activeTab === "live") return "/api/fd/live";
  if (_activeTab === "upcoming") return "/api/fd/upcoming";
  return `/api/fd/matches?date=${encodeURIComponent(filters.date)}`;
}

function startPolling() {
  stopPolling();
  pollNow();
  _pollTimer = setInterval(pollNow, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
  if (_pollAbortController) {
    _pollAbortController.abort();
    _pollAbortController = null;
  }
}

async function pollNow() {
  const endpoint = getEndpoint();
  const requestId = ++_pollRequestCounter;

  if (_pollAbortController) _pollAbortController.abort();
  _pollAbortController = new AbortController();

  if (!_hasLoadedOnce) renderLoadingSkeletons();
  updateRefreshInfo("Yenilənir…");

  try {
    const res = await fetch(endpoint, { signal: _pollAbortController.signal });

    if (requestId !== _pollRequestCounter) return;

    if (res.status === 503) {
      const data = await res.json().catch(() => ({}));
      renderError(escapeHTML(data.error || "Football-Data API açarı konfiqurasiya edilməyib. .env faylında FOOTBALL_DATA_KEY dəyişənini əlavə edin."));
      stopPolling();
      return;
    }

    if (res.status === 401 || res.status === 403) {
      renderError("API açarı etibarsızdır. <code>FOOTBALL_DATA_KEY</code> dəyişənini yoxlayın.");
      stopPolling();
      return;
    }

    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      const retryAfter = data.retryAfterSeconds ? ` (${data.retryAfterSeconds}s)` : "";
      updateRefreshInfo(`Rate limit: bir az sonra yenidən yoxlanacaq${retryAfter}`);
      return;
    }

    if (!res.ok) {
      renderError(`Server xətası: ${res.status}`);
      return;
    }

    const data = await res.json();
    if (data.error) {
      renderError(escapeHTML(data.error));
      return;
    }

    const matches = (data.matches || []).map(m => ({
      ...m,
      minute: m.minute ?? m.score?.duration ?? null,
    }));
    _lastMatches = matches;
    _changedMatchIds = detectScoreChanges(matches);

    // Detect goals only when polling live tab (or today with live matches inside)
    const goalEvents = detectGoals(matches);
    goalEvents.forEach(ev => showGoalToast(ev.match, ev.homeGoals, ev.awayGoals));

    updateCompFilterBar(matches);
    renderMatchGrid(matches);
    updateRefreshInfo(formatTimestamp());
    updateLiveIndicator(matches);
    _hasLoadedOnce = true;
  } catch (err) {
    if (err?.name === "AbortError") return;
    updateRefreshInfo("Şəbəkə xətası. Avtomatik yenidən cəhd ediləcək…");
    if (!_lastMatches.length) renderError("Şəbəkə xətası. İnternet bağlantınızı yoxlayın.");
  } finally {
    if (requestId === _pollRequestCounter) {
      _pollAbortController = null;
    }
  }
}

function updateRefreshInfo(text) {
  const el = document.getElementById("refresh-info");
  if (el) el.textContent = text;
}

function formatTimestamp() {
  return REFRESH_LABEL + new Date().toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function updateLiveIndicator(matches) {
  const liveCount = matches.filter(m => STATUS_LIVE.has(m.status)).length;
  const pulse = document.getElementById("live-pulse-dot");
  const badge = document.getElementById("match-count-badge");

  if (pulse) pulse.hidden = liveCount === 0;
  if (badge) {
    if (liveCount > 0) {
      badge.className = "live-badge red";
      badge.textContent = `${liveCount} canlı matç`;
    } else {
      badge.className = "live-badge muted";
      badge.textContent = `${matches.length} matç`;
    }
  }
}

// ── Competition filter ─────────────────────────────────────────────────────────
function updateCompFilterBar(matches) {
  const select = document.getElementById("competition-filter");
  if (!select) return;

  // Collect unique competitions
  const seen = new Map();
  for (const m of matches) {
    if (m.competition?.code && !seen.has(m.competition.code)) {
      seen.set(m.competition.code, m.competition.name || m.competition.code);
    }
  }

  if (filters.competition !== "all" && !seen.has(filters.competition)) {
    filters.competition = "all";
    persistFilters();
  }

  let html = `<option value="all">Bütün liqalar</option>`;
  for (const [code, name] of seen) {
    html += `<option value="${escapeHTML(code)}">${escapeHTML(name)}</option>`;
  }
  select.innerHTML = html;
  select.value = filters.competition;
}

function setCompFilter(code) {
  filters.competition = code || "all";
  persistFilters();
  renderMatchGrid(_lastMatches);
}

function toggleShowAllMatches() {
  _showAllMatches = !_showAllMatches;
  renderMatchGrid(_lastMatches);
}

function onDateFilterChange(nextDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDate || "")) return;
  filters.date = nextDate;
  persistFilters();
  _showAllMatches = false;
  startPolling();
}

function setDateToday() {
  const today = new Date().toISOString().slice(0, 10);
  onDateFilterChange(today);
  syncFilterControls();
}

function shiftDate(dayDiff) {
  const base = new Date(`${filters.date}T00:00:00`);
  if (Number.isNaN(base.getTime())) return;
  base.setDate(base.getDate() + dayDiff);
  const shifted = base.toISOString().slice(0, 10);
  onDateFilterChange(shifted);
  syncFilterControls();
}

function setLiveOnlyFilter(nextValue) {
  filters.liveOnly = !!nextValue;
  persistFilters();
  renderMatchGrid(_lastMatches);
}

function detectScoreChanges(matches) {
  const nextSnapshot = {};
  const changedIds = new Set();

  for (const match of matches) {
    const score = match.score?.fullTime;
    const key = `${score?.home ?? 0}:${score?.away ?? 0}`;
    const id = String(match.id);
    nextSnapshot[id] = key;
    if (_lastScoreSnapshot[id] && _lastScoreSnapshot[id] !== key) {
      changedIds.add(id);
    }
  }

  _lastScoreSnapshot = nextSnapshot;
  return changedIds;
}

function renderLoadingSkeletons() {
  const grid = document.getElementById("matches-grid");
  if (!grid) return;
  grid.innerHTML = `
    <div class="live-skeleton-grid" aria-hidden="true">
      <div class="match-skeleton"></div>
      <div class="match-skeleton"></div>
      <div class="match-skeleton"></div>
    </div>`;
}

// ── Rendering ──────────────────────────────────────────────────────────────────
function renderMatchGrid(matches) {
  const grid = document.getElementById("matches-grid");
  if (!grid) return;

  // Apply live + competition filters
  const liveFiltered = filters.liveOnly
    ? matches.filter(m => STATUS_LIVE.has(m.status))
    : matches;
  const filtered = filters.competition === "all"
    ? liveFiltered
    : liveFiltered.filter(m => m.competition?.code === filters.competition);

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="live-empty">
        <div class="live-empty-icon">${_activeTab === "live" ? "📡" : "📅"}</div>
        <div class="live-empty-text">${_activeTab === "live" ? "Hal-hazırda canlı matç yoxdur." : "Bu gün üçün matç tapılmadı."}</div>
        <div class="live-empty-sub">Sonra yenidən yoxlayın.</div>
      </div>`;
    return;
  }

  // Sort: live first, then by time
  const sorted = [...filtered].sort((a, b) => {
    const liveA = STATUS_LIVE.has(a.status) ? 0 : 1;
    const liveB = STATUS_LIVE.has(b.status) ? 0 : 1;
    if (liveA !== liveB) return liveA - liveB;
    return new Date(a.utcDate) - new Date(b.utcDate);
  });

  // Group by favorite team first
  const fav = (settings.favoriteTeam || "").toLowerCase().trim();

  const favMatches   = fav ? sorted.filter(m =>
    m.homeTeam?.name?.toLowerCase().includes(fav) ||
    m.awayTeam?.name?.toLowerCase().includes(fav)
  ) : [];
  const otherMatches = fav ? sorted.filter(m => !favMatches.includes(m)) : sorted;

  const visibleOther = _showAllMatches
    ? otherMatches
    : otherMatches.slice(0, MATCHES_DEFAULT_LIMIT);
  const hiddenCount = otherMatches.length - visibleOther.length;

  let html = "";
  if (favMatches.length) {
    html += `<div style="margin-bottom:8px;font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;">⭐ Sevimli Komanda</div>`;
    html += `<div class="live-matches-grid" style="margin-bottom:24px;">${favMatches.map(renderMatchCard).join("")}</div>`;
    if (otherMatches.length) {
      html += `<div style="margin-bottom:8px;font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;">📋 Bütün Matçlar</div>`;
    }
  }
  html += `<div class="live-matches-grid">${visibleOther.map(renderMatchCard).join("")}</div>`;

  if (otherMatches.length > MATCHES_DEFAULT_LIMIT) {
    html += _showAllMatches
      ? `<button class="show-toggle-btn" onclick="toggleShowAllMatches()">⬆️ Daha az göstər</button>`
      : `<button class="show-toggle-btn" onclick="toggleShowAllMatches()">⬇️ Hamısını göstər (${hiddenCount} daha)</button>`;
  }

  grid.innerHTML = html;
}

function renderMatchCard(match) {
  const home      = match.homeTeam || {};
  const away      = match.awayTeam || {};
  const score     = match.score?.fullTime;
  const htScore   = match.score?.halfTime;
  const isLive    = STATUS_LIVE.has(match.status);
  const isFinished= STATUS_FINISHED.has(match.status);
  const comp      = match.competition || {};
  const statusMeta = getStatusMeta(match.status, match.minute, match.utcDate);
  const changed = _changedMatchIds.has(String(match.id));

  const homeCrest = home.crest ? `<img class="match-team-crest" src="${escapeHTML(home.crest)}" alt="${escapeHTML(home.name || "")}" loading="lazy" onerror="this.style.display='none'">` : `<div class="match-team-crest-placeholder">🛡️</div>`;
  const awayCrest = away.crest ? `<img class="match-team-crest" src="${escapeHTML(away.crest)}" alt="${escapeHTML(away.name || "")}" loading="lazy" onerror="this.style.display='none'">` : `<div class="match-team-crest-placeholder">🛡️</div>`;
  const compEmbl  = comp.emblem ? `<img src="${escapeHTML(comp.emblem)}" alt="" loading="lazy" onerror="this.style.display='none'">` : "";

  const h = score?.home ?? 0;
  const a = score?.away ?? 0;
  const scoreHtml = isFinished || isLive || match.status === "PAUSED"
    ? `<div class="match-score${isLive ? " live-now" : ""}">${h} – ${a}</div>`
    : `<div class="match-score" style="font-size:1.1rem;color:var(--text-muted);">${escapeHTML(statusMeta.kickoff || "--:--")}</div>`;
  const statusHtml = `<span class="match-status-badge ${statusMeta.className}">${statusMeta.label}</span>`;

  const htHtml = (isLive || isFinished) && htScore?.home != null
    ? `<div class="match-ht">Fasilə: ${htScore.home} – ${htScore.away}</div>`
    : "";

  return `<a class="match-card${isLive ? " live-now" : ""}${changed ? " goal-flash" : ""}" href="/match.html?id=${encodeURIComponent(match.id)}" aria-label="${escapeHTML(home.name || "")} vs ${escapeHTML(away.name || "")}">
    <div class="match-comp">${compEmbl}${escapeHTML(comp.name || "")}</div>
    <div class="match-teams">
      <div class="match-team">
        ${homeCrest}
        <div class="match-team-name">${escapeHTML(home.shortName || home.name || "?")}</div>
      </div>
      <div class="match-score-area">
        ${scoreHtml}
        ${statusHtml}
        ${htHtml}
      </div>
      <div class="match-team">
        ${awayCrest}
        <div class="match-team-name">${escapeHTML(away.shortName || away.name || "?")}</div>
      </div>
    </div>
  </a>`;
}

function renderError(msg) {
  const grid = document.getElementById("matches-grid");
  if (!grid) return;
  grid.innerHTML = `<div class="live-empty"><div class="live-empty-icon">⚠️</div><div class="live-empty-text">${msg}</div></div>`;
}

// ── Match Details Modal ────────────────────────────────────────────────────────
async function showMatchDetails(matchId) {
  const modal = document.getElementById("match-details-modal");
  const body  = document.getElementById("match-details-body");
  if (!modal || !body) return;

  body.innerHTML = `<div class="live-loading"><div class="spinner"></div><span>Yüklənir…</span></div>`;
  modal.hidden   = false;

  try {
    const res = await fetch(`/api/fd/match/${encodeURIComponent(matchId)}`);

    if (!res.ok) {
      body.innerHTML = `<p style="color:var(--text-muted);">Matç məlumatları yüklənə bilmədi (${res.status}).</p>`;
      return;
    }

    const match = await res.json();
    if (match.error) {
      body.innerHTML = `<p style="color:var(--text-muted);">${escapeHTML(match.error)}</p>`;
      return;
    }

    body.innerHTML = renderMatchDetailsHTML(match);
  } catch (_) {
    body.innerHTML = `<p style="color:var(--text-muted);">Şəbəkə xətası baş verdi.</p>`;
  }
}

function closeMatchDetails() {
  const modal = document.getElementById("match-details-modal");
  if (modal) modal.hidden = true;
}

function renderMatchDetailsHTML(match) {
  const home  = match.homeTeam || {};
  const away  = match.awayTeam || {};
  const score = match.score?.fullTime;
  const ht    = match.score?.halfTime;
  const comp  = match.competition || {};

  const homeCrest = home.crest ? `<img style="width:52px;height:52px;object-fit:contain;" src="${escapeHTML(home.crest)}" alt="${escapeHTML(home.name || "")}" loading="lazy" onerror="this.style.display='none'">` : "🛡️";
  const awayCrest = away.crest ? `<img style="width:52px;height:52px;object-fit:contain;" src="${escapeHTML(away.crest)}" alt="${escapeHTML(away.name || "")}" loading="lazy" onerror="this.style.display='none'">` : "🛡️";

  const h = score?.home ?? "-";
  const a = score?.away ?? "-";
  const statusLabel = getStatusLabel(match.status, match.minute);

  let goalsHtml = "";
  if (match.goals && match.goals.length) {
    goalsHtml = `<div style="margin-top:20px;">
      <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">⚽ Qollar</div>
      ${match.goals.map(g => `
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.85rem;">
          <span style="color:#f1c40f;font-weight:800;">${g.minute != null ? escapeHTML(String(g.minute)) + "'" : ""}</span>
          <span style="font-weight:600;">${escapeHTML(g.scorer?.name || "Naməlum")}</span>
          <span style="color:var(--text-muted);font-size:.78rem;">(${escapeHTML(g.team?.name || "")})</span>
          ${g.type === "OWN_GOAL" ? `<span style="color:#e74c3c;font-size:.73rem;">ÖQol</span>` : ""}
          ${g.type === "PENALTY" ? `<span style="color:#3498db;font-size:.73rem;">Pen</span>` : ""}
        </div>`).join("")}
    </div>`;
  }

  let bookingsHtml = "";
  if (match.bookings && match.bookings.length) {
    bookingsHtml = `<div style="margin-top:20px;">
      <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">🟨 Kartlar</div>
      ${match.bookings.map(b => {
        const color = b.card === "RED_CARD" || b.card === "RED" ? "#e74c3c" : "#f1c40f";
        const emoji = b.card === "RED_CARD" || b.card === "RED" ? "🟥" : "🟨";
        return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.85rem;">
          <span>${emoji}</span>
          <span style="color:${color};font-weight:800;">${b.minute != null ? escapeHTML(String(b.minute)) + "'" : ""}</span>
          <span style="font-weight:600;">${escapeHTML(b.player?.name || "Naməlum")}</span>
          <span style="color:var(--text-muted);font-size:.78rem;">(${escapeHTML(b.team?.name || "")})</span>
        </div>`;
      }).join("")}
    </div>`;
  }

  let subsHtml = "";
  if (match.substitutions && match.substitutions.length) {
    subsHtml = `<div style="margin-top:20px;">
      <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">🔄 Əvəzetmələr</div>
      ${match.substitutions.map(s => `
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.85rem;">
          <span style="color:var(--text-muted);">🔄 ${s.minute != null ? escapeHTML(String(s.minute)) + "'" : ""}</span>
          <span style="color:#27ae60;">▲ ${escapeHTML(s.playerIn?.name || "")}</span>
          <span style="color:#e74c3c;">▼ ${escapeHTML(s.playerOut?.name || "")}</span>
        </div>`).join("")}
    </div>`;
  }

  const kickoff = match.utcDate
    ? new Date(match.utcDate).toLocaleString("az-AZ", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
    : "";

  return `
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:4px;">${escapeHTML(comp.name || "")} · ${escapeHTML(kickoff)}</div>
      <div style="font-size:.75rem;">${statusLabel}</div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;">
        ${homeCrest}
        <div style="font-size:.9rem;font-weight:700;text-align:center;">${escapeHTML(home.name || "")}</div>
      </div>
      <div style="text-align:center;flex-shrink:0;">
        <div style="font-size:2.4rem;font-weight:900;color:var(--text);">${h} – ${a}</div>
        ${ht?.home != null ? `<div style="font-size:.75rem;color:var(--text-muted);">Fasilə: ${ht.home} – ${ht.away}</div>` : ""}
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;">
        ${awayCrest}
        <div style="font-size:.9rem;font-weight:700;text-align:center;">${escapeHTML(away.name || "")}</div>
      </div>
    </div>
    ${goalsHtml}
    ${bookingsHtml}
    ${subsHtml}
    ${!goalsHtml && !bookingsHtml && !subsHtml ? `<p style="text-align:center;color:var(--text-muted);font-size:.88rem;">Ətraflı hadisə məlumatı mövcud deyil.</p>` : ""}`;
}

function getStatusLabel(status, minute) {
  const meta = getStatusMeta(status, minute);
  return `<span class="match-status-badge ${meta.className}">${meta.label}</span>`;
}

function getStatusMeta(status, minute, utcDate) {
  switch (status) {
    case "IN_PLAY":  return { label: `LIVE ${minute != null ? `${minute}'` : ""}`.trim(), className: "status-live" };
    case "PAUSED":   return { label: "HT", className: "status-ht" };
    case "FINISHED": return { label: "FT", className: "status-ft" };
    case "TIMED":
    case "SCHEDULED":return {
      label: "NS",
      className: "status-upcoming",
      kickoff: utcDate ? new Date(utcDate).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }) : "--:--",
    };
    default:         return { label: escapeHTML(status || "—"), className: "status-other" };
  }
}

// ── Tabs ───────────────────────────────────────────────────────────────────────
function switchLiveTab(tab) {
  _activeTab = tab;
  filters.competition = "all";
  _lastMatches = [];
  _showAllMatches = false;
  _changedMatchIds = new Set();
  _hasLoadedOnce = false;

  const compSelect = document.getElementById("competition-filter");
  if (compSelect) compSelect.innerHTML = `<option value="all">Bütün liqalar</option>`;

  document.querySelectorAll(".live-tab-btn").forEach(btn => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  persistFilters();
  // Reset and restart polling for new tab
  startPolling();
}

// ── Settings Panel ─────────────────────────────────────────────────────────────
function openLiveSettings() {
  const panel = document.getElementById("live-settings-panel");
  if (panel) panel.classList.add("open");
}

function closeLiveSettings() {
  const panel = document.getElementById("live-settings-panel");
  if (panel) panel.classList.remove("open");

  // Restart polling if interval changed
  stopPolling();
  startPolling();
}

// ── Notification toggles (toolbar buttons) ─────────────────────────────────────
function toggleLiveNotifications() {
  settings.notifOn = !settings.notifOn;
  saveSettings();
  applySettingsToUI();
}

function toggleLiveSound() {
  settings.soundOn = !settings.soundOn;
  saveSettings();
  applySettingsToUI();
}

// ── Theme ──────────────────────────────────────────────────────────────────────
function toggleLiveTheme() {
  const html    = document.documentElement;
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

// ── Mobile Menu ────────────────────────────────────────────────────────────────
function toggleLiveMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger");
  if (!menu) return;
  const isHidden = menu.hidden;
  menu.hidden = !isHidden;
  if (btn) btn.setAttribute("aria-expanded", String(isHidden));
}

// ── Navbar scroll shadow ───────────────────────────────────────────────────────
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

// ── Modal keyboard close ───────────────────────────────────────────────────────
function initModalKeyClose() {
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeMatchDetails();
      closeLiveSettings();
    }
  });

  const detailModal = document.getElementById("match-details-modal");
  if (detailModal) {
    detailModal.addEventListener("click", e => {
      if (e.target === detailModal) closeMatchDetails();
    });
  }
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbarScroll();
  initModalKeyClose();
  applySettingsToUI();
  syncFilterControls();
  persistFilters();

  // If browser notifications were previously enabled, verify permission state
  if (settings.browserNotifOn && typeof Notification !== "undefined" && Notification.permission !== "granted") {
    settings.browserNotifOn = false;
    saveSettings();
    applySettingsToUI();
  }

  startPolling();
});
