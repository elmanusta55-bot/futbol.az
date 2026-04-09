import fetch from 'node-fetch';
import { getCache, setCache } from '../utils/cache.js';

const API_KEY = process.env.APISPORTS_KEY;
const API_BASE = 'https://v3.football.api-sports.io';

/**
 * Fetch data from api-sports.io, with in-memory caching.
 * Writes the JSON response (or an error JSON) directly to `res`.
 *
 * @param {string} apiPath  – e.g. '/standings?league=39&season=2024'
 * @param {import('express').Response} res
 */
export async function apiFetch(apiPath, res) {
  if (!API_KEY || !API_KEY.trim()) {
    return res.status(503).json({
      error: 'API key not configured. Set APISPORTS_KEY in .env',
    });
  }

  const cached = getCache(apiPath);
  if (cached !== null) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  try {
    const response = await fetch(`${API_BASE}${apiPath}`, {
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.statusText}` });
    }

    const data = await response.json();
    setCache(apiPath, data);
    res.set('X-Cache', 'MISS');
    return res.json(data);
  } catch (err) {
    console.error('apiFetch error:', err.message);
    return res.status(500).json({ error: 'Failed to reach upstream API' });
  }
}
