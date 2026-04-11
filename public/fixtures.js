"use strict";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, (s) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function dateIso(delta = 0) {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function setQuickButton(activeId) {
  document.querySelectorAll(".quick-btn").forEach((b) => b.classList.toggle("active", b.id === activeId));
}

function renderFixtures(matches) {
  const wrap = document.getElementById("fixtures-list");
  if (!wrap) return;
  wrap.innerHTML = matches.map((m) => {
    const home = m.homeTeam || {};
    const away = m.awayTeam || {};
    const time = m.utcDate ? new Date(m.utcDate).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }) : "--:--";
    return `<article class="fixture">
      <div class="fixture-head">
        <span>${esc(m.competition?.name || "Liqa")}</span>
        <span>${esc(m.status || "-")}</span>
      </div>
      <div class="fixture-row">
        <div class="fixture-team">${home.crest ? `<img src="${esc(home.crest)}" alt="${esc(home.name)}" loading="lazy">` : ""}<span>${esc(home.shortName || home.name || "-")}</span></div>
        <strong>${esc(time)}</strong>
        <div class="fixture-team away"><span>${esc(away.shortName || away.name || "-")}</span>${away.crest ? `<img src="${esc(away.crest)}" alt="${esc(away.name)}" loading="lazy">` : ""}</div>
      </div>
    </article>`;
  }).join("");
}

async function loadFixtures(date) {
  const msg = document.getElementById("fixtures-msg");
  if (msg) msg.textContent = "Yüklənir...";
  try {
    const res = await fetch(`/api/fd/matches?date=${encodeURIComponent(date)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");
    const matches = data?.matches || [];
    renderFixtures(matches);
    if (msg) msg.textContent = matches.length ? "" : "Bu tarix üçün matç tapılmadı.";
  } catch (e) {
    if (msg) msg.textContent = `Məlumat yüklənmədi: ${e.message}`;
  }
}

function bindQuickButtons() {
  const dateInput = document.getElementById("fixture-date");
  const setDate = (iso, id) => {
    if (!dateInput) return;
    dateInput.value = iso;
    setQuickButton(id);
    loadFixtures(iso);
  };
  document.getElementById("btn-yesterday")?.addEventListener("click", () => setDate(dateIso(-1), "btn-yesterday"));
  document.getElementById("btn-today")?.addEventListener("click", () => setDate(dateIso(0), "btn-today"));
  document.getElementById("btn-tomorrow")?.addEventListener("click", () => setDate(dateIso(1), "btn-tomorrow"));
  dateInput?.addEventListener("change", () => {
    setQuickButton("");
    loadFixtures(dateInput.value);
  });
  setDate(dateIso(0), "btn-today");
}

document.addEventListener("DOMContentLoaded", bindQuickButtons);
