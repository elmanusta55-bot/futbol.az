import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = "api-football-v1.p.rapidapi.com";
const API_BASE = `https://${API_HOST}/v3`;

app.use(cors());

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

// Helper – forward RapidAPI request
async function apiFetch(apiPath, res) {
  if (!API_KEY || !API_KEY.trim()) {
    return res.status(503).json({ error: "API key not configured. Set RAPIDAPI_KEY in .env" });
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

// League IDs: AZE=683, PL=39, LaLiga=140, SerieA=135, Bundesliga=78
app.get("/standings/:leagueId", (req, res) => {
  apiFetch(`/standings?league=${req.params.leagueId}&season=${footballSeason()}`, res);
});

app.get("/live", (req, res) => {
  apiFetch("/fixtures?live=all", res);
});

app.get("/today", (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  apiFetch(`/fixtures?date=${date}`, res);
});

app.get("/top-scorers/:leagueId", (req, res) => {
  apiFetch(`/players/topscorers?league=${req.params.leagueId}&season=${footballSeason()}`, res);
});

app.listen(PORT, () => console.log(`Futbol.az proxy running on port ${PORT}`));
