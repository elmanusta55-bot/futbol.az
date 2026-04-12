import test from "node:test";
import assert from "node:assert/strict";

import { __telegramTestables } from "../backend/routes/telegram.js";

const { buildGoalMessage, shouldRateLimitMatch, GOAL_RATE_LIMIT_MS } = __telegramTestables;

test("buildGoalMessage formats telegram text correctly", () => {
  const msg = buildGoalMessage("Arsenal", "Chelsea", "2-1", "Saka");
  assert.equal(msg, "⚽ Qol! Arsenal 2-1 Chelsea\n👟 Saka");
});

test("shouldRateLimitMatch enforces 30-second window", () => {
  const map = new Map();
  const key = "arsenal__chelsea";
  const now = 100_000;

  map.set(key, now - (GOAL_RATE_LIMIT_MS - 1));
  assert.equal(shouldRateLimitMatch(map, key, now), true);

  map.set(key, now - GOAL_RATE_LIMIT_MS);
  assert.equal(shouldRateLimitMatch(map, key, now), false);
});
