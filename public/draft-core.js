export const FORMATIONS = {
  "4-3-3": [
    { role: "GK", position: "GK" },
    { role: "LB", position: "DEF" },
    { role: "LCB", position: "DEF" },
    { role: "RCB", position: "DEF" },
    { role: "RB", position: "DEF" },
    { role: "LCM", position: "MID" },
    { role: "CM", position: "MID" },
    { role: "RCM", position: "MID" },
    { role: "LW", position: "FWD" },
    { role: "ST", position: "FWD" },
    { role: "RW", position: "FWD" },
  ],
  "4-4-2": [
    { role: "GK", position: "GK" },
    { role: "LB", position: "DEF" },
    { role: "LCB", position: "DEF" },
    { role: "RCB", position: "DEF" },
    { role: "RB", position: "DEF" },
    { role: "LM", position: "MID" },
    { role: "LCM", position: "MID" },
    { role: "RCM", position: "MID" },
    { role: "RM", position: "MID" },
    { role: "LS", position: "FWD" },
    { role: "RS", position: "FWD" },
  ],
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getFormationSlots(formation) {
  return (FORMATIONS[formation] || FORMATIONS["4-3-3"]).map((slot, index) => ({
    id: `${slot.role}-${index}`,
    role: slot.role,
    position: slot.position,
    player: null,
  }));
}

export function createDraftState(formation = "4-3-3", budgetCap = 100, maxClubPlayers = 3) {
  return {
    formation,
    budgetCap,
    maxClubPlayers,
    slots: getFormationSlots(formation),
    currentSlotIndex: 0,
    undoState: null,
  };
}

export function getPlayerCost(player) {
  if (Number.isFinite(player?.cost)) return player.cost;
  return clamp(Math.round((Number(player?.overall) || 60) / 10), 5, 12);
}

export function getDraftedPlayers(state) {
  return (state?.slots || []).map((slot) => slot.player).filter(Boolean);
}

export function getBudgetUsed(state) {
  return getDraftedPlayers(state).reduce((sum, player) => sum + getPlayerCost(player), 0);
}

export function getClubCounts(state) {
  return getDraftedPlayers(state).reduce((acc, player) => {
    acc[player.club] = (acc[player.club] || 0) + 1;
    return acc;
  }, {});
}

export function canPickPlayer(state, player, slotIndex) {
  if (!state || !player) return { ok: false, reason: "Oyunçu seçilə bilmədi." };
  const slot = state.slots?.[slotIndex];
  if (!slot) return { ok: false, reason: "Slot tapılmadı." };
  if (slot.player) return { ok: false, reason: "Bu mövqe artıq doludur." };

  const drafted = getDraftedPlayers(state);
  if (drafted.some((picked) => picked.id === player.id)) {
    return { ok: false, reason: "Bu oyunçu artıq komandandadır." };
  }

  const nextBudget = getBudgetUsed(state) + getPlayerCost(player);
  if (nextBudget > state.budgetCap) {
    return { ok: false, reason: `Büdcə limiti (${state.budgetCap}) keçilir.` };
  }

  const clubCounts = getClubCounts(state);
  if ((clubCounts[player.club] || 0) >= state.maxClubPlayers) {
    return { ok: false, reason: `Bir klubdan maksimum ${state.maxClubPlayers} oyunçu seçə bilərsiniz.` };
  }

  return { ok: true };
}

export function computeChemistry(players) {
  if (!players?.length) return 0;

  let score = 0;
  let pairCount = 0;

  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      pairCount += 1;
      if (players[i].club === players[j].club) score += 2;
      if (players[i].league === players[j].league) score += 1;
      if (players[i].nation === players[j].nation) score += 1;
    }
  }

  if (!pairCount) return 0;
  const maxScore = pairCount * 4;
  return Math.round((score / maxScore) * 100);
}

export function computeSquadSummary(state) {
  const draftedPlayers = getDraftedPlayers(state);
  if (!draftedPlayers.length) {
    return {
      squadRating: 0,
      chemistry: 0,
      averageOverall: 0,
      positionPenalty: 0,
      mismatches: 0,
      bestPlayer: null,
      budgetUsed: 0,
    };
  }

  const totalOverall = draftedPlayers.reduce((sum, player) => sum + (Number(player.overall) || 0), 0);
  const averageOverall = totalOverall / draftedPlayers.length;

  let mismatches = 0;
  for (const slot of state.slots) {
    if (slot.player && slot.player.position !== slot.position) mismatches += 1;
  }

  const chemistry = computeChemistry(draftedPlayers);
  const positionPenalty = mismatches * 4;
  const rawRating = averageOverall + chemistry / 10 - positionPenalty;
  const squadRating = clamp(Math.round(rawRating), 0, 99);

  const bestPlayer = draftedPlayers.reduce((best, player) => {
    if (!best) return player;
    return (Number(player.overall) || 0) > (Number(best.overall) || 0) ? player : best;
  }, null);

  return {
    squadRating,
    chemistry,
    averageOverall: Number(averageOverall.toFixed(1)),
    positionPenalty,
    mismatches,
    bestPlayer,
    budgetUsed: getBudgetUsed(state),
  };
}

export function isDraftComplete(state) {
  return Boolean(state?.slots?.length) && state.slots.every((slot) => Boolean(slot.player));
}

export function buildShareText(state, summary) {
  const players = state.slots.map((slot) => `${slot.role}: ${slot.player?.name || "-"}`).join("\n");
  return [
    "⚽ Futbol.az Draft nəticəm",
    `📐 Formasiya: ${state.formation}`,
    `⭐ Squad Rating: ${summary.squadRating}`,
    `🧪 Chemistry: ${summary.chemistry}`,
    `💰 Büdcə: ${summary.budgetUsed}/${state.budgetCap}`,
    `👑 Best Player: ${summary.bestPlayer ? `${summary.bestPlayer.name} (${summary.bestPlayer.overall})` : "-"}`,
    "",
    players,
    "",
    "futbol.az/draft.html",
  ].join("\n");
}
