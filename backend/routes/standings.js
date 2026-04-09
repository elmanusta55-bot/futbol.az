import { Router } from 'express';
import { apiFetch } from '../middleware/apiProxy.js';
import { validateLeagueId, footballSeason } from '../utils/validators.js';

const router = Router();

/**
 * GET /api/standings/:leagueId
 * Returns league standings for one of the allowed league IDs.
 */
router.get('/:leagueId', (req, res) => {
  const id = validateLeagueId(parseInt(req.params.leagueId, 10));
  if (!id) {
    return res
      .status(400)
      .json({ error: 'Invalid leagueId. Allowed: 39, 78, 135, 140, 683.' });
  }
  apiFetch(`/standings?league=${id}&season=${footballSeason()}`, res);
});

export default router;
