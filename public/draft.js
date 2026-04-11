import {
  FORMATIONS,
  buildShareText,
  canPickPlayer,
  computeSquadSummary,
  createDraftState,
  getBudgetUsed,
  getClubCounts,
  isDraftComplete,
} from "/draft-core.js";

const DATA_URL = "/data/players.json";
const LS_KEY = "faz_draft_state_v1";
const FALLBACK_FORMATION = "4-3-3";
const CANDIDATE_COUNT = 4;

const refs = {
  formation: document.getElementById("formation-select"),
  startBtn: document.getElementById("start-draft-btn"),
  newBtn: document.getElementById("new-draft-btn"),
  undoBtn: document.getElementById("undo-btn"),
  candidates: document.getElementById("candidate-cards"),
  candidatesTitle: document.getElementById("candidate-title"),
  candidatesHint: document.getElementById("candidate-hint"),
  pitchRows: document.getElementById("pitch-rows"),
  loadingState: document.getElementById("draft-loading"),
  mainPanel: document.getElementById("draft-main"),
  toast: document.getElementById("draft-toast"),
  resultPanel: document.getElementById("result-panel"),
  resultRating: document.getElementById("result-rating"),
  resultChemistry: document.getElementById("result-chemistry"),
  resultBest: document.getElementById("result-best"),
  shareBtn: document.getElementById("share-btn"),
  statusRound: document.getElementById("status-round"),
  statusBudget: document.getElementById("status-budget"),
  statusClub: document.getElementById("status-club"),
  statusFormation: document.getElementById("status-formation"),
};

let players = [];
let state = createDraftState(FALLBACK_FORMATION);
let currentCandidates = [];

const POSITION_LABEL = {
  GK: "Qapıçı",
  DEF: "Müdafiə",
  MID: "Yarımmüdafiə",
  FWD: "Hücum",
};

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(message, isError = false) {
  refs.toast.textContent = message;
  refs.toast.classList.toggle("error", isError);
  refs.toast.hidden = false;
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    refs.toast.hidden = true;
  }, 2200);
}

function shuffle(items) {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function getCurrentSlot() {
  return state.slots[state.currentSlotIndex] || null;
}

function nextEmptySlotIndex() {
  return state.slots.findIndex((slot) => !slot.player);
}

function saveDraft() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !FORMATIONS[parsed.formation] || !Array.isArray(parsed.slots)) return null;

    const fresh = createDraftState(parsed.formation, parsed.budgetCap || 100, parsed.maxClubPlayers || 3);
    if (fresh.slots.length !== parsed.slots.length) return null;

    fresh.slots = fresh.slots.map((slot, idx) => ({
      ...slot,
      player: parsed.slots[idx]?.player || null,
    }));
    const idx = nextEmptySlotIndexFrom(fresh);
    fresh.currentSlotIndex = idx === -1 ? fresh.slots.length : idx;
    fresh.undoState = null;
    return fresh;
  } catch {
    return null;
  }
}

function nextEmptySlotIndexFrom(draftState) {
  return draftState.slots.findIndex((slot) => !slot.player);
}

function getCandidatesForSlot(slotIndex) {
  const slot = state.slots[slotIndex];
  if (!slot) return [];

  const draftedIds = new Set(state.slots.map((item) => item.player?.id).filter(Boolean));
  const available = players.filter((player) => !draftedIds.has(player.id));

  const byPosition = available.filter((player) => player.position === slot.position);
  const preferred = byPosition.filter((player) => canPickPlayer(state, player, slotIndex).ok);

  let pool = preferred;
  if (pool.length < CANDIDATE_COUNT) {
    const fallback = available.filter((player) => canPickPlayer(state, player, slotIndex).ok);
    const merged = new Map();
    [...pool, ...fallback].forEach((player) => merged.set(player.id, player));
    pool = [...merged.values()];
  }

  return shuffle(pool).slice(0, CANDIDATE_COUNT);
}

function resetDraft(formation = refs.formation.value || FALLBACK_FORMATION) {
  state = createDraftState(formation, 100, 3);
  currentCandidates = getCandidatesForSlot(0);
  saveDraft();
  render();
}

function getFormationStatText() {
  return `${state.formation} (${state.slots.length} oyunçu)`;
}

function renderStatus() {
  const summary = computeSquadSummary(state);
  const filled = state.slots.filter((slot) => slot.player).length;
  refs.statusRound.textContent = `${filled}/${state.slots.length}`;
  refs.statusBudget.textContent = `${summary.budgetUsed}/${state.budgetCap}`;

  const clubCounts = getClubCounts(state);
  const maxClubCount = Math.max(0, ...Object.values(clubCounts));
  refs.statusClub.textContent = `${maxClubCount}/${state.maxClubPlayers}`;
  refs.statusFormation.textContent = getFormationStatText();
}

function renderPitch() {
  const rowOrder = ["FWD", "MID", "DEF", "GK"];
  const currentSlot = getCurrentSlot();

  refs.pitchRows.innerHTML = rowOrder
    .map((position) => {
      const slots = state.slots.filter((slot) => slot.position === position);
      if (!slots.length) return "";

      const cards = slots
        .map((slot) => {
          const isActive = currentSlot && currentSlot.id === slot.id;
          const player = slot.player;
          return `
            <article class="pitch-slot ${player ? "filled" : ""} ${isActive ? "active" : ""}">
              <span class="slot-role">${slot.role}</span>
              ${
                player
                  ? `<strong>${escapeHTML(player.name)}</strong><span class="slot-meta">${player.overall} • ${escapeHTML(player.club)}</span>`
                  : `<em>Boş</em><span class="slot-meta">${POSITION_LABEL[slot.position]}</span>`
              }
            </article>
          `;
        })
        .join("");

      return `
        <div class="pitch-row">
          <span class="pitch-row-label">${POSITION_LABEL[position]}</span>
          <div class="pitch-row-slots">${cards}</div>
        </div>
      `;
    })
    .join("");
}

function renderCandidates() {
  const slot = getCurrentSlot();
  const complete = isDraftComplete(state);

  refs.undoBtn.disabled = !state.undoState;

  if (complete) {
    refs.candidatesTitle.textContent = "Draft tamamlandı";
    refs.candidatesHint.textContent = "Yeni draft başlada və ya nəticəni paylaş.";
    refs.candidates.innerHTML = "";
    refs.resultPanel.hidden = false;

    const summary = computeSquadSummary(state);
    refs.resultRating.textContent = String(summary.squadRating);
    refs.resultChemistry.textContent = `${summary.chemistry}`;
    refs.resultBest.textContent = summary.bestPlayer
      ? `${summary.bestPlayer.name} (${summary.bestPlayer.overall})`
      : "-";
    return;
  }

  refs.resultPanel.hidden = true;

  if (!slot) {
    refs.candidatesTitle.textContent = "Mövqe tapılmadı";
    refs.candidatesHint.textContent = "Yeni draft başladın.";
    refs.candidates.innerHTML = "";
    return;
  }

  if (!currentCandidates.length) {
    currentCandidates = getCandidatesForSlot(state.currentSlotIndex);
  }

  refs.candidatesTitle.textContent = `Seçim raundu: ${slot.role} (${POSITION_LABEL[slot.position]})`;

  if (!currentCandidates.length) {
    refs.candidatesHint.textContent = "Mövcud limitlərlə seçim mümkün deyil. Yeni draft başlada bilərsiniz.";
    refs.candidates.innerHTML = `<button class="btn-pill" id="recover-draft-btn">Yeni draft</button>`;
    const recover = document.getElementById("recover-draft-btn");
    if (recover) recover.addEventListener("click", () => resetDraft(state.formation));
    return;
  }

  refs.candidatesHint.textContent = "Kart seçdikcə oyunçu birbaşa meydançaya yerləşdirilir.";

  refs.candidates.innerHTML = currentCandidates
    .map((player) => {
      const validation = canPickPlayer(state, player, state.currentSlotIndex);
      const disabled = validation.ok ? "" : "disabled";
      const cost = Number(player.cost) || 0;
      return `
        <button class="candidate-card" data-player-id="${player.id}" ${disabled}>
          <div class="candidate-top">
            <span class="overall">${player.overall}</span>
            <span class="badge">${escapeHTML(player.position)}</span>
          </div>
          <h3>${escapeHTML(player.name)}</h3>
          <p>${escapeHTML(player.club)} • ${escapeHTML(player.league)}</p>
          <p>${escapeHTML(player.nation)} • 💰 ${cost}</p>
          <div class="attrs">
            <span>PAC ${player.pac}</span>
            <span>SHO ${player.sho}</span>
            <span>PAS ${player.pas}</span>
            <span>DEF ${player.def}</span>
            <span>PHY ${player.phy}</span>
          </div>
        </button>
      `;
    })
    .join("");

  refs.candidates.querySelectorAll(".candidate-card").forEach((el) => {
    el.addEventListener("click", () => {
      const picked = currentCandidates.find((player) => player.id === el.dataset.playerId);
      if (!picked) return;
      pickPlayer(picked);
    });
  });
}

function render() {
  renderStatus();
  renderPitch();
  renderCandidates();
}

function pickPlayer(player) {
  const slotIndex = state.currentSlotIndex;
  const canPick = canPickPlayer(state, player, slotIndex);
  if (!canPick.ok) {
    showToast(canPick.reason, true);
    return;
  }

  state.undoState = JSON.stringify({
    formation: state.formation,
    budgetCap: state.budgetCap,
    maxClubPlayers: state.maxClubPlayers,
    slots: state.slots,
    currentSlotIndex: state.currentSlotIndex,
  });

  state.slots[slotIndex].player = player;
  const nextIndex = nextEmptySlotIndex();
  state.currentSlotIndex = nextIndex === -1 ? state.slots.length : nextIndex;
  currentCandidates = nextIndex === -1 ? [] : getCandidatesForSlot(nextIndex);

  saveDraft();
  render();
}

function undoLastPick() {
  if (!state.undoState) return;
  try {
    const prev = JSON.parse(state.undoState);
    const restored = createDraftState(prev.formation, prev.budgetCap, prev.maxClubPlayers);
    restored.slots = restored.slots.map((slot, idx) => ({ ...slot, player: prev.slots[idx]?.player || null }));
    restored.currentSlotIndex = prev.currentSlotIndex;
    restored.undoState = null;
    state = restored;
    currentCandidates = getCandidatesForSlot(state.currentSlotIndex);
    saveDraft();
    render();
    showToast("Son seçim geri alındı");
  } catch {
    showToast("Geri alma mümkün olmadı", true);
  }
}

async function shareResult() {
  const summary = computeSquadSummary(state);
  const text = buildShareText(state, summary);
  try {
    await navigator.clipboard.writeText(text);
    showToast("Nəticə kopyalandı");
  } catch {
    showToast("Kopyalama mümkün olmadı", true);
  }
}

function bindEvents() {
  refs.startBtn.addEventListener("click", () => resetDraft(refs.formation.value));
  refs.newBtn.addEventListener("click", () => resetDraft(state.formation));
  refs.undoBtn.addEventListener("click", undoLastPick);
  refs.shareBtn.addEventListener("click", shareResult);
}

function toggleDraftMobileMenu() {
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

function toggleDraftTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("faz_theme", JSON.stringify(next));
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = next === "dark" ? "🌙" : "☀️";
}

function initTheme() {
  const root = document.documentElement;
  let theme = "dark";
  try {
    const saved = JSON.parse(localStorage.getItem("faz_theme") || "null");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {}
  root.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

async function init() {
  bindEvents();
  initTheme();

  window.toggleDraftMobileMenu = toggleDraftMobileMenu;
  window.toggleDraftTheme = toggleDraftTheme;

  try {
    const [response] = await Promise.all([
      fetch(DATA_URL),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);
    if (!response.ok) throw new Error("Dataset yüklənmədi");
    players = await response.json();

    const saved = loadDraft();
    state = saved || createDraftState(refs.formation.value || FALLBACK_FORMATION);
    refs.formation.value = state.formation;

    if (!isDraftComplete(state) && state.currentSlotIndex < state.slots.length) {
      currentCandidates = getCandidatesForSlot(state.currentSlotIndex);
    }

    refs.loadingState.hidden = true;
    refs.mainPanel.hidden = false;
    render();
  } catch (error) {
    refs.loadingState.innerHTML = `<p class="loading-error">Draft məlumatları yüklənmədi. Səhifəni yeniləyin.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", init);
