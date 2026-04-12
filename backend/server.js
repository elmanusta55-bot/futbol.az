import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import standingsRouter      from './routes/standings.js';
import matchesRouter        from './routes/matches.js';
import playersRouter        from './routes/players.js';
import teamsRouter          from './routes/teams.js';
import footballDataRouter   from './routes/footballDataRoutes.js';
import telegramRouter       from './routes/telegram.js';
import newsRouter           from './routes/news.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ── Security / CORS ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rate limiting – 100 requests per 15 minutes per IP ───────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  })
);

// ── Static files ──────────────────────────────────────────────────────────────
// Serve the public/ directory (HTML, JS, CSS, images).
app.use(express.static(path.join(__dirname, '..', 'public')));

// Also serve root-level assets that live outside public/ (logo, manifest, sw).
const ROOT_ASSETS = ['logo.png', 'manifest.json', 'sw.js'];
for (const asset of ROOT_ASSETS) {
  app.get(`/${asset}`, (req, res) =>
    res.sendFile(path.join(__dirname, '..', asset))
  );
}

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/standings', standingsRouter);
app.use('/api', matchesRouter); // exposes /api/matches and /api/live
app.use('/api', playersRouter); // exposes /api/top-scorers/:leagueId
app.use('/api', teamsRouter); // exposes /api/search
app.use('/api/fd', footballDataRouter); // exposes /api/fd/live, /api/fd/today, etc.
app.use('/api/notify', telegramRouter);
app.use('/api/news', newsRouter);

// ── Catch-all: send index.html for unknown routes (SPA fallback) ──────────────
app.get('*', (req, res) => {
  // Only fall back for non-API, non-asset requests
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Futbol.az server running on http://localhost:${PORT}`)
);
