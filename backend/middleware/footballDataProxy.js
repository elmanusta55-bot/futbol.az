import fetch from 'node-fetch';
import { getCache, setCache } from '../utils/cache.js';

const API_KEY  = process.env.FOOTBALL_DATA_KEY;
const API_BASE = 'https://api.football-data.org/v4';

/**
 * TTL values for different endpoint types.
 * Live-match data refreshes much faster than static fixtures.
 */
const TTL = {
  live:     30_000,  // 30 seconds
  today:    60_000,  // 1 minute
  match:    30_000,  // 30 seconds (during live play)
  upcoming: 5 * 60_000, // 5 minutes
};

/**
 * Fetch data from football-data.org, with in-memory caching.
 * Writes the JSON response (or an error JSON) directly to `res`.
 *
 * @param {string} apiPath   – e.g. '/matches?status=LIVE'
 * @param {import('express').Response} res
 * @param {number} [ttlMs]   – custom TTL in ms; defaults to 60 s
 */
export async function fdFetch(apiPath, res, ttlMs = TTL.today) {
  if (!API_KEY || !API_KEY.trim()) {
    return res.status(503).json({
      error: 'Football-Data API key not configured. Set FOOTBALL_DATA_KEY in .env',
    });
  }

  const cached = getCache(`fd:${apiPath}`);
  if (cached !== null) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  try {
    const response = await fetch(`${API_BASE}${apiPath}`, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.statusText}` });
    }

    const data = await response.json();
    setCache(`fd:${apiPath}`, data, ttlMs);
    res.set('X-Cache', 'MISS');
    return res.json(data);
  } catch (err) {
    console.error('footballDataProxy error:', err.message);
    return res.status(500).json({ error: 'Failed to reach Football-Data API' });
  }
}

export { TTL as FD_TTL };
