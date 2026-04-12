import { Router } from 'express';
import { sendTelegramMessage } from '../services/telegramBot.js';

const router = Router();
const GOAL_RATE_LIMIT_MS = 30_000;
const matchNotifyTimestamps = new Map();

function normalizeText(value, maxLength = 120) {
  return String(value || '').trim().slice(0, maxLength);
}

function shouldRateLimitMatch(map, matchKey, now = Date.now()) {
  const lastSentAt = map.get(matchKey) || 0;
  return now - lastSentAt < GOAL_RATE_LIMIT_MS;
}

function buildGoalMessage(homeTeam, awayTeam, score, scorer) {
  return `⚽ Qol! ${homeTeam} ${score} ${awayTeam}\n👟 ${scorer}`;
}

router.post('/goal', async (req, res) => {
  const homeTeam = normalizeText(req.body?.homeTeam);
  const awayTeam = normalizeText(req.body?.awayTeam);
  const score = normalizeText(req.body?.score, 30);
  const scorer = normalizeText(req.body?.scorer, 100) || 'Naməlum oyunçu';

  if (!homeTeam || !awayTeam || !score) {
    return res.status(400).json({ error: 'homeTeam, awayTeam və score tələb olunur.' });
  }

  const matchKey = `${homeTeam.toLowerCase()}__${awayTeam.toLowerCase()}`;
  const now = Date.now();
  if (shouldRateLimitMatch(matchNotifyTimestamps, matchKey, now)) {
    return res.json({ ok: true, rateLimited: true });
  }

  matchNotifyTimestamps.set(matchKey, now);

  const message = buildGoalMessage(homeTeam, awayTeam, score, scorer);
  const sent = await sendTelegramMessage(message);

  return res.json({ ok: true, sent });
});

export default router;
export const __telegramTestables = {
  buildGoalMessage,
  shouldRateLimitMatch,
  GOAL_RATE_LIMIT_MS,
};
