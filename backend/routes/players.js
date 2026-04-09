import { Router } from 'express';
import { apiFetch } from '../middleware/apiProxy.js';
import { validateLeagueId, footballSeason } from '../utils/validators.js';

const router = Router();

/**
 * GET /api/top-scorers/:leagueId
 * Returns the top goal-scorers for the given league in the current season.
 */
router.get('/top-scorers/:leagueId', (req, res) => {
  const id = validateLeagueId(parseInt(req.params.leagueId, 10));
  if (!id) {
    return res.status(400).json({ error: 'Invalid leagueId. Allowed: 39, 78, 135, 140, 683.' });
  }
  apiFetch(`/players/topscorers?league=${id}&season=${footballSeason()}`, res);
});

export default router;
