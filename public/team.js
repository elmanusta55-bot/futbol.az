"use strict";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function getTeamId() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  return Number.isFinite(id) && id > 0 ? id : null;
}

function renderProfile(team) {
  const profile = document.getElementById("team-profile");
  if (!profile) return;

  profile.hidden = false;
  profile.innerHTML = `
    ${team.crest ? `<img src="${esc(team.crest)}" alt="${esc(team.name)}" loading="lazy">` : ""}
    <div>
      <div class="team-title">${esc(team.name || "-")}</div>
      <div class="team-meta">🌍 ${esc(team.area?.name || "-")}</div>
      <div class="team-meta">📅 Quruluş: ${esc(team.founded || "-")}</div>
      <div class="team-meta">🏟️ Stadion: ${esc(team.venue || "-")}</div>
    </div>`;
}

function resultBadge(match, teamId) {
  const homeId = match.homeTeam?.id;
  const awayId = match.awayTeam?.id;
  const homeGoals = match.score?.fullTime?.home;
  const awayGoals = match.score?.fullTime?.away;

  if (homeGoals == null || awayGoals == null) return { code: "D", text: "D", cls: "badge-D" };
  if (homeGoals === awayGoals) return { code: "D", text: "D", cls: "badge-D" };

  const isTeamHome = Number(homeId) === Number(teamId);
  const won = isTeamHome ? homeGoals > awayGoals : awayGoals > homeGoals;
  return won ? { code: "W", text: "W", cls: "badge-W" } : { code: "L", text: "L", cls: "badge-L" };
}

function renderLastMatches(matches, teamId) {
  const wrap = document.getElementById("last-matches");
  if (!wrap) return;

  const recent = matches
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 5);

  if (!recent.length) {
    wrap.innerHTML = `<p class="page-msg">Son matç məlumatı tapılmadı.</p>`;
    return;
  }

  wrap.innerHTML = recent.map((m) => {
    const badge = resultBadge(m, teamId);
    const home = esc(m.homeTeam?.shortName || m.homeTeam?.name || "-");
    const away = esc(m.awayTeam?.shortName || m.awayTeam?.name || "-");
    const score = `${m.score?.fullTime?.home ?? "-"}:${m.score?.fullTime?.away ?? "-"}`;
    return `<article class="match-row">
      <div>${home} <strong>${score}</strong> ${away}</div>
      <span class="match-badge ${badge.cls}">${badge.text}</span>
    </article>`;
  }).join("");
}

async function findStandingPosition(team) {
  const holder = document.getElementById("team-standing");
  if (!holder) return;

  const competitions = Array.isArray(team?.runningCompetitions) ? team.runningCompetitions : [];
  const league = competitions.find((c) => c?.code && c.code !== "CL") || competitions.find((c) => c?.code);
  if (!league?.code) {
    holder.textContent = "Liqa məlumatı tapılmadı.";
    return;
  }

  try {
    const res = await fetch(`/api/fd/standings/${encodeURIComponent(league.code)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");

    const standings = data?.standings || [];
    const total = standings.find((s) => s.type === "TOTAL") || standings[0];
    const row = (total?.table || []).find((r) => Number(r.team?.id) === Number(team.id));

    if (!row) {
      holder.textContent = `${league.name || league.code}: mövqe tapılmadı.`;
      return;
    }

    holder.innerHTML = `<strong>${esc(league.name || league.code)}</strong>: ${row.position}. yer (${row.points ?? 0} xal)`;
  } catch (err) {
    holder.textContent = `Cədvəl məlumatı yüklənmədi: ${err.message}`;
  }
}

async function init() {
  const msg = document.getElementById("team-msg");
  const id = getTeamId();
  if (!id) {
    if (msg) msg.textContent = "Komanda ID düzgün deyil. Məsələn: /team.html?id=65";
    return;
  }

  if (msg) msg.textContent = "Yüklənir...";

  try {
    const [teamRes, matchesRes] = await Promise.all([
      fetch(`/api/fd/team/${id}`),
      fetch(`/api/fd/team/${id}/matches`),
    ]);

    const teamData = await teamRes.json();
    const matchesData = await matchesRes.json();

    if (!teamRes.ok) throw new Error(teamData?.error || "Komanda məlumatı alınmadı");
    if (!matchesRes.ok) throw new Error(matchesData?.error || "Matç məlumatı alınmadı");

    renderProfile(teamData);
    renderLastMatches(matchesData?.matches || [], id);
    await findStandingPosition(teamData);
    if (msg) msg.textContent = "";
  } catch (err) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", init);
