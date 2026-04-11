"use strict";

(function () {
  const KEY_ENABLED = "notificationsEnabled";
  const KEY_FAV = "favoriteTeam";
  const KEY_SCORES = "faz_index_live_scores";
  const STATUS_LIVE = new Set(["IN_PLAY", "PAUSED"]);
  let scoreCache = {};
  let timer = null;

  function loadCache() {
    try { scoreCache = JSON.parse(localStorage.getItem(KEY_SCORES) || "{}"); } catch { scoreCache = {}; }
  }

  function saveCache() {
    try { localStorage.setItem(KEY_SCORES, JSON.stringify(scoreCache)); } catch {}
  }

  function enabled() {
    return localStorage.getItem(KEY_ENABLED) === "true";
  }

  function setEnabled(v) {
    localStorage.setItem(KEY_ENABLED, String(v));
    updateButton();
  }

  function updateButton() {
    const btn = document.getElementById("notif-btn");
    if (!btn) return;
    btn.textContent = enabled() ? "🔔" : "🔕";
    btn.title = enabled() ? "Bildirişlər aktiv" : "Bildirişləri aktiv et";
  }

  async function askPermission() {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const result = await Notification.requestPermission();
    return result === "granted";
  }

  function toast(text) {
    if (typeof window.showToast === "function") window.showToast(text);
  }

  function notify(match, homeGoals, awayGoals) {
    const home = match.homeTeam?.shortName || match.homeTeam?.name || "Ev";
    const away = match.awayTeam?.shortName || match.awayTeam?.name || "Qonaq";
    const score = `${homeGoals} - ${awayGoals}`;
    toast(`⚽ ${home} ${score} ${away}`);
    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification(`⚽ Qol: ${score}`, {
        body: `${home} - ${away}`,
        icon: "/logo.png",
        tag: `goal-${match.id}`
      });
      setTimeout(() => n.close(), 6000);
    }
  }

  function detectGoals(matches) {
    const events = [];
    for (const match of matches) {
      if (!STATUS_LIVE.has(match.status)) continue;
      const id = String(match.id);
      const home = match.score?.fullTime?.home ?? 0;
      const away = match.score?.fullTime?.away ?? 0;
      const prev = scoreCache[id];
      if (!prev) {
        scoreCache[id] = { home, away };
        continue;
      }
      if (home > prev.home || away > prev.away) {
        events.push({ match, home, away });
      }
      scoreCache[id] = { home, away };
    }
    saveCache();
    return events;
  }

  function isFavMatch(match) {
    const fav = (localStorage.getItem(KEY_FAV) || "").trim().toLowerCase();
    if (!fav) return true;
    const home = (match.homeTeam?.name || match.homeTeam?.shortName || "").toLowerCase();
    const away = (match.awayTeam?.name || match.awayTeam?.shortName || "").toLowerCase();
    return home.includes(fav) || away.includes(fav);
  }

  async function poll() {
    if (!enabled()) return;
    try {
      const res = await fetch("/api/fd/live");
      const data = await res.json();
      if (!res.ok) return;
      const matches = data?.matches || [];
      detectGoals(matches).filter((e) => isFavMatch(e.match)).forEach((e) => notify(e.match, e.home, e.away));
    } catch {}
  }

  async function toggleNotifications() {
    if (enabled()) {
      setEnabled(false);
      return;
    }
    const granted = await askPermission();
    if (!granted) {
      toast("Brauzer bildiriş icazəsi verilmədi");
      return;
    }
    setEnabled(true);
    if (!localStorage.getItem(KEY_FAV)) {
      const team = window.prompt("Sevimli komandanızı yazın (opsional):", "") || "";
      localStorage.setItem(KEY_FAV, team.trim());
    }
    toast("🔔 Bildirişlər aktiv edildi");
  }

  function init() {
    loadCache();
    updateButton();
    document.getElementById("notif-btn")?.addEventListener("click", toggleNotifications);
    poll();
    timer = setInterval(poll, 30000);
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("beforeunload", () => { if (timer) clearInterval(timer); });
})();
