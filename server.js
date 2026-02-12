import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = "SENIN_API_KEY";

app.get("/today", async (req, res) => {
  const r = await fetch(`https://api.sportmonks.com/v3/football/fixtures/date/${new Date().toISOString().slice(0,10)}?api_token=${API_KEY}&include=participants`);
  res.json(await r.json());
});

app.get("/live", async (req, res) => {
  const r = await fetch(`https://api.sportmonks.com/v3/football/livescores?api_token=${API_KEY}&include=participants`);
  res.json(await r.json());
});

app.get("/standings", async (req, res) => {
  const r = await fetch(`https://api.sportmonks.com/v3/football/standings/seasons/21648?api_token=${API_KEY}`);
  res.json(await r.json());
});

app.get("/transfers", async (req, res) => {
  const r = await fetch(`https://api.sportmonks.com/v3/football/transfers?api_token=${API_KEY}&per_page=10`);
  res.json(await r.json());
});

app.listen(3000, () => console.log("Proxy API Running on port 3000"));
