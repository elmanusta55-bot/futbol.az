import { Router } from 'express';
import { apiFetch } from '../middleware/apiProxy.js';

const router = Router();

/**
 * GET /api/matches  – today's fixtures
 */
router.get('/matches', (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  apiFetch(`/fixtures?date=${date}`, res);
});

/**
 * GET /api/live  – currently live fixtures
 */
router.get('/live', (req, res) => {
  apiFetch('/fixtures?live=all', res);
});

export default router;
