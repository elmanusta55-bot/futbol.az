import { Router } from 'express';
import { fdFetch, FD_TTL } from '../middleware/footballDataProxy.js';

const router = Router();

/**
 * GET /api/fd/live
 * Returns all currently live matches across all competitions.
 */
router.get('/live', (req, res) => {
  fdFetch('/matches?status=LIVE', res, FD_TTL.live);
});

/**
 * GET /api/fd/today
 * Returns all matches scheduled for today (any status).
 */
router.get('/today', (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  fdFetch(`/matches?dateFrom=${date}&dateTo=${date}`, res, FD_TTL.today);
});

/**
 * GET /api/fd/matches?date=YYYY-MM-DD
 * Returns matches for a specific date.
 */
router.get('/matches', (req, res) => {
  const date = String(req.query.date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date. Use YYYY-MM-DD.' });
  }

  fdFetch(`/matches?dateFrom=${date}&dateTo=${date}`, res, FD_TTL.today);
});

/**
 * GET /api/fd/upcoming
 * Returns matches for the next 3 days.
 */
router.get('/upcoming', (req, res) => {
  const from = new Date().toISOString().slice(0, 10);
  const toDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const to = toDate.toISOString().slice(0, 10);
  fdFetch(`/matches?dateFrom=${from}&dateTo=${to}`, res, FD_TTL.upcoming);
});

/**
 * GET /api/fd/match/:id
 * Returns full details (including events) for a single match.
 * Only numeric IDs are accepted.
 */
router.get('/match/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid match id.' });
  }
  fdFetch(`/matches/${id}`, res, FD_TTL.match);
});

export default router;
