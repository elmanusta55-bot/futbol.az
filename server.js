import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import rateLimit from "express-rate-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = process.env.RAPIDAPI_HOST || "api-football-v3.p.rapidapi.com";
const API_BASE = `https://${API_HOST}/v3`;

// Allowed league IDs to prevent injection via path parameters
const ALLOWED_LEAGUE_IDS = new Set([39, 78, 135, 140, 683]);

// In-memory cache: key → { data, expiresAt }
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

app.use(cors());

// Rate limiting – 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);

// Serve static frontend files explicitly (no express.static to avoid exposing
// sensitive files like .env, server.js, package.json, etc.)
const STATIC_FILES = {
  "/":             "index.html",
  "/index.html":   "index.html",
  "/styles.css":   "styles.css",
  "/app.js":       "app.js",
  "/logo.png":     "logo.png",
  "/manifest.json":"manifest.json",
  "/sw.js":        "sw.js",
};

for (const [route, file] of Object.entries(STATIC_FILES)) {
  const filePath = path.join(__dirname, file);
  app.get(route, (req, res) => res.sendFile(filePath));
}

// Helper – return cached response or fetch from RapidAPI
async function apiFetch(apiPath, res) {
  if (!API_KEY || !API_KEY.trim()) {
    return res.status(503).json({ error: "API key not configured. Set RAPIDAPI_KEY in .env" });
  }

  const cached = cache.get(apiPath);
  if (cached && cached.expiresAt > Date.now()) {
    res.set("X-Cache", "HIT");
    return res.json(cached.data);
  }

  try {
    const response = await fetch(`${API_BASE}${apiPath}`, {
      headers: {
        "x-rapidapi-key":  API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error: ${response.statusText}` });
    }
    const data = await response.json();
    cache.set(apiPath, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    res.set("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Football seasons run Aug–May. Months 0–6 (Jan–Jul) belong to the previous season year.
function footballSeason() {
  const now = new Date();
  return now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();
}

// Validate leagueId: must be one of the known allowed numeric IDs
function validateLeagueId(req, res) {
  const id = parseInt(req.params.leagueId, 10);
  if (!Number.isInteger(id) || !ALLOWED_LEAGUE_IDS.has(id)) {
    res.status(400).json({ error: "Invalid leagueId. Allowed: 39, 78, 135, 140, 683." });
    return null;
  }
  return id;
}

// League IDs: AZE=683, PL=39, LaLiga=140, SerieA=135, Bundesliga=78
app.get("/standings/:leagueId", (req, res) => {
  const id = validateLeagueId(req, res);
  if (id === null) return;
  apiFetch(`/standings?league=${id}&season=${footballSeason()}`, res);
});

app.get("/live", (req, res) => {
  apiFetch("/fixtures?live=all", res);
});

app.get("/today", (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  apiFetch(`/fixtures?date=${date}`, res);
});

app.get("/top-scorers/:leagueId", (req, res) => {
  const id = validateLeagueId(req, res);
  if (id === null) return;
  apiFetch(`/players/topscorers?league=${id}&season=${footballSeason()}`, res);
});

app.get("/matches", (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  apiFetch(`/fixtures?date=${date}`, res);
});

app.get("/search", (req, res) => {
  const q = req.query.q;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Query must be at least 2 characters." });
  }
  // Limit query length and encode for safe inclusion in the upstream URL query string.
  const safe = encodeURIComponent(q.trim().slice(0, 100));
  apiFetch(`/teams?search=${safe}`, res);
});

app.listen(PORT, () => console.log(`Futbol.az proxy running on port ${PORT}`));
