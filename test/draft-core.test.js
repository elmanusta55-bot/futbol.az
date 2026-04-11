import test from "node:test";
import assert from "node:assert/strict";

import {
  canPickPlayer,
  computeChemistry,
  computeSquadSummary,
  createDraftState,
  getPlayerCost,
} from "../public/draft-core.js";

function makePlayer(id, overrides = {}) {
  return {
    id,
    name: `Player ${id}`,
    position: "MID",
    club: "Club A",
    league: "League A",
    nation: "Nation A",
    overall: 80,
    cost: 8,
    pac: 80,
    sho: 80,
    pas: 80,
    def: 80,
    phy: 80,
    ...overrides,
  };
}

test("getPlayerCost returns fallback when cost missing", () => {
  assert.equal(getPlayerCost(makePlayer("x", { cost: undefined, overall: 91 })), 9);
});

test("canPickPlayer enforces budget and club limits", () => {
  const state = createDraftState("4-3-3", 20, 2);
  state.slots[0].player = makePlayer("gk", { position: "GK", club: "Club A", cost: 10 });
  state.slots[1].player = makePlayer("def1", { position: "DEF", club: "Club A", cost: 8 });
  state.currentSlotIndex = 2;

  const blockedByClub = canPickPlayer(state, makePlayer("def2", { position: "DEF", club: "Club A", cost: 1 }), 2);
  assert.equal(blockedByClub.ok, false);

  const blockedByBudget = canPickPlayer(state, makePlayer("def3", { position: "DEF", club: "Club B", cost: 5 }), 2);
  assert.equal(blockedByBudget.ok, false);

  const allowed = canPickPlayer(state, makePlayer("def4", { position: "DEF", club: "Club B", cost: 2 }), 2);
  assert.equal(allowed.ok, true);
});

test("computeChemistry rewards shared club/league/nation", () => {
  const players = [
    makePlayer("1", { club: "A", league: "L1", nation: "N1" }),
    makePlayer("2", { club: "A", league: "L1", nation: "N1" }),
    makePlayer("3", { club: "B", league: "L1", nation: "N2" }),
  ];

  const chemistry = computeChemistry(players);
  assert.equal(chemistry, 50);
});

test("computeSquadSummary applies position mismatch penalty", () => {
  const state = createDraftState("4-4-2", 100, 3);
  state.slots[0].player = makePlayer("gk", { position: "GK", overall: 82, cost: 8, club: "A" });
  state.slots[1].player = makePlayer("def", { position: "DEF", overall: 78, cost: 8, club: "B" });
  state.slots[5].player = makePlayer("wrong", { position: "FWD", overall: 90, cost: 9, club: "C" });

  const summary = computeSquadSummary(state);

  assert.equal(summary.mismatches, 1);
  assert.equal(summary.positionPenalty, 4);
  assert.equal(summary.bestPlayer?.id, "wrong");
  assert.equal(typeof summary.squadRating, "number");
});
