# Futbol.az ⚽

Professional football portal for Azerbaijan and world leagues, powered by [API-Football](https://rapidapi.com/api-sports/api/api-football).

## Features

- 🇦🇿 Azərbaycan Premyer Liqası
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
- 🇪🇸 La Liga
- 🇮🇹 Serie A
- 🇩🇪 Bundesliga
- 🔴 Live match scores (auto-refresh every 60 s)
- 📊 Real-time standings (2025-26 season)
- ⚽ Top scorers per league
- 🔍 Team & player search
- 🌙 Dark mode

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Backend  | Node.js 18+, Express 4, node-fetch |
| Security | express-rate-limit, CORS, dotenv   |
| Frontend | Vanilla HTML / CSS / JS            |
| API      | RapidAPI – API-Football v3         |

---

## Quick Start (Local)

### 1. Clone & install

```bash
git clone https://github.com/elmanusta55-bot/futbol.az.git
cd futbol.az
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your `RAPIDAPI_KEY`:

```
RAPIDAPI_KEY=fb5f9b54e1mshf35d20a59e752c1p15341ajsn57bc3d21de94
RAPIDAPI_HOST=api-football-v3.p.rapidapi.com
PORT=3000
NODE_ENV=production
```

> ⚠️ **Never commit `.env` to git.** It is already in `.gitignore`.

### 3. Start the server

```bash
npm start          # production
npm run dev        # development with auto-reload
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

All proxy endpoints are served by the Express server. They forward requests to
[API-Football v3](https://api-football-v3.p.rapidapi.com/v3) and cache responses
for **5 minutes** to conserve API quota.

| Method | Path                       | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | `/standings/:leagueId`     | League table for the current season |
| GET    | `/live`                    | All currently live matches          |
| GET    | `/today`                   | All fixtures scheduled for today    |
| GET    | `/top-scorers/:leagueId`   | Top scorers for the current season  |

### League IDs

| League                       | ID  |
| ---------------------------- | --- |
| Azərbaycan Premyer Liqası    | 683 |
| Premier League               | 39  |
| La Liga                      | 140 |
| Serie A                      | 135 |
| Bundesliga                   | 78  |

Only these IDs are accepted; any other value returns `400 Bad Request`.

### Rate Limiting

100 requests per IP per 15-minute window. Exceeding the limit returns `429 Too Many Requests`.

---

## Environment Variables

| Variable        | Required | Default                              | Description                   |
| --------------- | -------- | ------------------------------------ | ----------------------------- |
| `RAPIDAPI_KEY`  | ✅       | —                                    | Your RapidAPI secret key      |
| `RAPIDAPI_HOST` | ❌       | `api-football-v3.p.rapidapi.com`     | RapidAPI host header          |
| `PORT`          | ❌       | `3000`                               | TCP port the server listens on |
| `NODE_ENV`      | ❌       | `development`                        | `production` disables verbose logs |

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables under **Settings → Environment Variables**:
   - `RAPIDAPI_KEY`
   - `RAPIDAPI_HOST` = `api-football-v3.p.rapidapi.com`
   - `NODE_ENV` = `production`
4. Set **Build Command** to `npm install` and **Output Directory** to `/` (root).
5. Add a `vercel.json` (already present) or configure the `start` script.

### Heroku

```bash
heroku create futbol-az-portal
heroku config:set RAPIDAPI_KEY=<your_key>
heroku config:set RAPIDAPI_HOST=api-football-v3.p.rapidapi.com
heroku config:set NODE_ENV=production
git push heroku main
```

### Railway / Render

Set the same environment variables and point the start command to `npm start`.

---

## Security Notes

- The RapidAPI key is **never** sent to the browser. The frontend calls `/standings/39`
  (the local proxy), not the RapidAPI endpoint directly.
- `.env` is listed in `.gitignore` and excluded from every static file route.
- All `leagueId` path parameters are validated against an allowlist before
  being forwarded to the upstream API.
- CORS is enabled for all origins by default; restrict it in production by
  replacing `app.use(cors())` with `app.use(cors({ origin: "https://futbol.az" }))`.

---

## License

MIT © 2026 Futbol.az
