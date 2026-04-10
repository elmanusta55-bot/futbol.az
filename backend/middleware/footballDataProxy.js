import fetch from 'node-fetch';
import { getCache, setCache } from '../utils/cache.js';

const API_KEY = process.env.FOOTBALL_DATA_KEY;
const API_BASE = 'https://api.football-data.org/v4';

const TTL = {
  live: 30_000,
  today: 60_000,
  match: 30_000,
  upcoming: 5 * 60_000,
};

const DEFAULT_RETRY_AFTER_SECONDS = 60;

export async function fdFetch(apiPath, res, ttlMs = TTL.today) {
  if (!API_KEY || !API_KEY.trim()) {
    return res.status(503).json({
      error:
        'Football-Data API key not configured. Set FOOTBALL_DATA_KEY in .env / Vercel env vars',
    });
  }

  const cached = getCache(`fd:${apiPath}`);
  if (cached !== null) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let response;
    try {
      response = await fetch(`${API_BASE}${apiPath}`, {
        headers: { 'X-Auth-Token': API_KEY },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 401 || response.status === 403) {
      return res.status(response.status).json({
        error:
          'Football-Data API key is invalid or lacks permission. Check FOOTBALL_DATA_KEY in env vars',
      });
    }

    if (response.status === 429) {
      const retryAfter =
        response.headers.get('X-RequestCounter-Reset') ||
        response.headers.get('Retry-After') ||
        String(DEFAULT_RETRY_AFTER_SECONDS);

      res.set('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Football-Data API rate limit reached. Please wait before retrying.',
        retryAfterSeconds: parseInt(retryAfter, 10) || DEFAULT_RETRY_AFTER_SECONDS,
      });
    }

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
    if (err?.name === 'AbortError') {
      console.error('footballDataProxy timeout:', apiPath);
      return res.status(504).json({ error: 'Football-Data API request timed out' });
    }
    console.error('footballDataProxy error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to reach Football-Data API' });
  }
}

export const FD_TTL = TTL;
