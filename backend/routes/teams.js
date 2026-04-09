import { Router } from 'express';
import { apiFetch } from '../middleware/apiProxy.js';
import { validateSearchQuery } from '../utils/validators.js';

const router = Router();

/**
 * GET /api/search?q=term
 * Search for teams by name fragment.
 */
router.get('/search', (req, res) => {
  const q = validateSearchQuery(req.query.q);
  if (!q) {
    return res.status(400).json({ error: 'Query must be at least 2 characters.' });
  }
  apiFetch(`/teams?search=${encodeURIComponent(q)}`, res);
});

export default router;
