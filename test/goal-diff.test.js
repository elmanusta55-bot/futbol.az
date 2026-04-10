/**
 * Unit tests for goal-diff detection logic (Node.js built-in test runner).
 *
 * Run:  node --test test/goal-diff.test.js
 *
 * The detectGoals() function is the core of the goal notification system.
 * We isolate and test it without a DOM or a browser.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

// ── Minimal in-memory implementation of detectGoals() ────────────────────────
// Mirrors the logic in public/live.js so we can unit-test it in Node.

const STATUS_LIVE = new Set(["IN_PLAY", "PAUSED"]);

/**
 * @param {Array}  matches     – array of Football-Data.org match objects
 * @param {object} scoreCache  – mutable map of { [matchId]: { home, away } }
 * @returns {Array<{match, homeGoals, awayGoals}>}
 */
function detectGoals(matches, scoreCache) {
  const events = [];

  for (const match of matches) {
    if (!STATUS_LIVE.has(match.status)) continue;

    const id   = String(match.id);
    const home = match.score?.fullTime?.home ?? 0;
    const away = match.score?.fullTime?.away ?? 0;
    const prev = scoreCache[id];

    if (prev === undefined) {
      scoreCache[id] = { home, away };
      continue;
    }

    if (home > prev.home || away > prev.away) {
      events.push({ match, homeGoals: home, awayGoals: away });
      scoreCache[id] = { home, away };
    }
  }

  return events;
}

// ── Helper to build a minimal match object ───────────────────────────────────
function makeMatch(id, status, home, away) {
  return {
    id,
    status,
    score: { fullTime: { home, away } },
    homeTeam: { id: 1, name: "Home FC" },
    awayTeam: { id: 2, name: "Away FC" },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("detectGoals()", () => {

  it("returns no events when cache is empty (first poll)", () => {
    const cache = {};
    const matches = [makeMatch(100, "IN_PLAY", 1, 0)];
    const events = detectGoals(matches, cache);

    assert.equal(events.length, 0, "no goal events on first sight");
    assert.deepEqual(cache["100"], { home: 1, away: 0 }, "score recorded in cache");
  });

  it("returns no events when score has not changed", () => {
    const cache = { "100": { home: 1, away: 0 } };
    const matches = [makeMatch(100, "IN_PLAY", 1, 0)];
    const events = detectGoals(matches, cache);

    assert.equal(events.length, 0, "no goal if score unchanged");
  });

  it("detects a home goal", () => {
    const cache = { "100": { home: 0, away: 0 } };
    const matches = [makeMatch(100, "IN_PLAY", 1, 0)];
    const events = detectGoals(matches, cache);

    assert.equal(events.length, 1, "one goal event");
    assert.equal(events[0].homeGoals, 1);
    assert.equal(events[0].awayGoals, 0);
    assert.deepEqual(cache["100"], { home: 1, away: 0 }, "cache updated");
  });

  it("detects an away goal", () => {
    const cache = { "100": { home: 1, away: 0 } };
    const matches = [makeMatch(100, "IN_PLAY", 1, 1)];
    const events = detectGoals(matches, cache);

    assert.equal(events.length, 1);
    assert.equal(events[0].awayGoals, 1);
  });

  it("does not fire for FINISHED or SCHEDULED matches", () => {
    const cache = {};
    const matches = [
      makeMatch(200, "FINISHED",  2, 1),
      makeMatch(201, "SCHEDULED", 0, 0),
      makeMatch(202, "TIMED",     0, 0),
    ];
    const events = detectGoals(matches, cache);
    assert.equal(events.length, 0, "non-live matches must not fire goal events");
    assert.equal(Object.keys(cache).length, 0, "non-live matches must not be cached");
  });

  it("handles PAUSED (half-time) status as live", () => {
    const cache = { "300": { home: 0, away: 0 } };
    const matches = [makeMatch(300, "PAUSED", 1, 0)];
    const events = detectGoals(matches, cache);
    assert.equal(events.length, 1, "PAUSED still counts as live");
  });

  it("does not report duplicate goals on subsequent polls", () => {
    const cache = { "100": { home: 1, away: 0 } };
    const matches = [makeMatch(100, "IN_PLAY", 1, 0)];

    // First poll at same score
    let events = detectGoals(matches, cache);
    assert.equal(events.length, 0);

    // Second poll – still same score
    events = detectGoals(matches, cache);
    assert.equal(events.length, 0, "no duplicate events");
  });

  it("detects multiple goals across different matches in one poll", () => {
    const cache = {
      "10": { home: 0, away: 0 },
      "20": { home: 1, away: 1 },
    };
    const matches = [
      makeMatch(10, "IN_PLAY", 1, 0),
      makeMatch(20, "IN_PLAY", 2, 1),
    ];
    const events = detectGoals(matches, cache);
    assert.equal(events.length, 2, "two separate goal events");
  });

  it("detects rapid two-goal burst within single poll interval", () => {
    const cache = { "50": { home: 0, away: 0 } };
    const matches = [makeMatch(50, "IN_PLAY", 2, 0)];  // jumped by 2
    const events = detectGoals(matches, cache);
    assert.equal(events.length, 1, "one event per poll (score increased)");
    assert.equal(events[0].homeGoals, 2);
  });
});
