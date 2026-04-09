import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = "api-football-v1.p.rapidapi.com";
const API_BASE = `https://${API_HOST}/v3`;

app.use(cors());
app.use(express.static("."));

// Helper – forward RapidAPI request
async function apiFetch(path, res) {
  if (!API_KEY || API_KEY === "your_rapidapi_key_here") {
    return res.status(503).json({ error: "API key not configured. Set RAPIDAPI_KEY in .env" });
  }
  try {
    const response = await fetch(`${API_BASE}${path}`, {
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

// League IDs: AZE=683, PL=39, LaLiga=140, SerieA=135, Bundesliga=78
const SEASON = new Date().getFullYear();

app.get("/standings/:leagueId", (req, res) => {
  apiFetch(`/standings?league=${req.params.leagueId}&season=${SEASON}`, res);
});

app.get("/live", (req, res) => {
  apiFetch("/fixtures?live=all", res);
});

app.get("/today", (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  apiFetch(`/fixtures?date=${date}`, res);
});

app.get("/top-scorers/:leagueId", (req, res) => {
  apiFetch(`/players/topscorers?league=${req.params.leagueId}&season=${SEASON}`, res);
});

app.listen(PORT, () => console.log(`Futbol.az proxy running on port ${PORT}`));
