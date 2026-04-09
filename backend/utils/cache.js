// Simple in-memory cache with TTL support
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieve a cached value if it exists and hasn't expired.
 * @param {string} key
 * @returns {any|null}
 */
export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Store a value in the cache with the default TTL.
 * @param {string} key
 * @param {any} data
 */
export function setCache(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

/**
 * Evict all cached entries (useful in tests or forced refreshes).
 */
export function clearCache() {
  cache.clear();
}
