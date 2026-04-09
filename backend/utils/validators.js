// Validation helpers for API inputs

/** League IDs exposed by this portal */
const ALLOWED_LEAGUE_IDS = new Set([39, 78, 135, 140, 683]);

/**
 * Validate a league ID parameter.
 * @param {number} id  – already parsed integer from the request
 * @returns {number|null}  – the validated id, or null if not allowed
 */
export function validateLeagueId(id) {
  if (!Number.isInteger(id) || !ALLOWED_LEAGUE_IDS.has(id)) return null;
  return id;
}

/**
 * Sanitise a free-text search query.
 * Returns null if the query is too short or contains obviously dangerous content.
 * @param {string|undefined} q
 * @returns {string|null}
 */
export function validateSearchQuery(q) {
  if (!q || typeof q !== 'string') return null;
  const trimmed = q.trim().slice(0, 100); // cap length
  if (trimmed.length < 2) return null;
  return trimmed;
}

/**
 * Return the current football season year.
 * Seasons run Aug–May, so months Jan–Jul (0–6) belong to the previous year.
 * @returns {number}
 */
export function footballSeason() {
  const now = new Date();
  return now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();
}
