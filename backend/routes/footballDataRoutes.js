import { Router } from 'express';
import { fdFetch, FD_TTL } from '../middleware/footballDataProxy.js';

const router = Router();
const ALLOWED_FD_LEAGUES = new Set(['PL', 'PD', 'BL1', 'SA', 'FL1', 'CL']);

function parsePositiveInt(value) {
  const n = parseInt(String(value || ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

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
  const parsed = new Date(`${date}T00:00:00Z`);
  const isValidDate = !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  if (!isValidDate) {
    return res.status(400).json({ error: 'Invalid date value.' });
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
 * GET /api/fd/standings/:leagueCode
 * Returns standings from football-data.org
 * Allowed codes: PL, PD, BL1, SA, FL1, CL
 */
router.get('/standings/:leagueCode', (req, res) => {
  const code = String(req.params.leagueCode || '').toUpperCase().trim();
  if (!ALLOWED_FD_LEAGUES.has(code)) {
    return res.status(400).json({ error: `Invalid league code. Allowed: ${[...ALLOWED_FD_LEAGUES].join(', ')}` });
  }
  fdFetch(`/competitions/${code}/standings`, res, FD_TTL.upcoming);
});

/**
 * GET /api/fd/scorers/:leagueCode
 */
router.get('/scorers/:leagueCode', (req, res) => {
  const code = String(req.params.leagueCode || '').toUpperCase().trim();
  if (!ALLOWED_FD_LEAGUES.has(code)) {
    return res.status(400).json({ error: `Invalid league code. Allowed: ${[...ALLOWED_FD_LEAGUES].join(', ')}` });
  }
  fdFetch(`/competitions/${code}/scorers`, res, FD_TTL.upcoming);
});

/**
 * GET /api/fd/team/:id
 */
router.get('/team/:id', (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid team id.' });
  }
  fdFetch(`/teams/${id}`, res, FD_TTL.upcoming);
});

/**
 * GET /api/fd/team/:id/matches
 */
router.get('/team/:id/matches', (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid team id.' });
  }
  fdFetch(`/teams/${id}/matches?limit=10`, res, FD_TTL.today);
});

/**
 * GET /api/fd/competition/:code/matches?stage=STAGE
 */
router.get('/competition/:code/matches', (req, res) => {
  const code = String(req.params.code || '').toUpperCase().trim();
  if (!/^[A-Z0-9]{2,10}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid competition code.' });
  }

  const stage = String(req.query.stage || '').toUpperCase().trim();
  const stageQuery = stage ? `?stage=${encodeURIComponent(stage)}` : '';
  fdFetch(`/competitions/${code}/matches${stageQuery}`, res, FD_TTL.today);
});

/**
 * GET /api/fd/match/:id
 * Returns full details (including events) for a single match.
 * Only numeric IDs are accepted.
 */
router.get('/match/:id', (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid match id.' });
  }
  fdFetch(`/matches/${id}`, res, FD_TTL.match);
});

/**
 * GET /api/fd/match/:id/h2h?limit=6
 * Returns head-to-head history for a match (best effort by data plan).
 */
router.get('/match/:id/h2h', (req, res) => {
  const id = parsePositiveInt(req.params.id);
  const limit = parseInt(String(req.query.limit || '6'), 10);
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 20)) : 6;

  if (!id) {
    return res.status(400).json({ error: 'Invalid match id.' });
  }

  fdFetch(`/matches/${id}/head2head?limit=${safeLimit}`, res, FD_TTL.match);
});

export default router;
