# Futbol.az ⚽

Professional football portal for Azerbaijan and world leagues – **2026 Season Redesign**.

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
- 🌙 Dark / Light mode
- 🎮 Interactive games (trivia, prediction, penalty shootout)
- 📱 Mobile-first responsive layout
- 🔒 Secure API proxy (key never exposed to browser)

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Backend  | Node.js 18+, Express 4, node-fetch             |
| Security | express-rate-limit, CORS, dotenv, input validation |
| Frontend | Vanilla HTML / CSS / JS (no framework)         |
| API      | API-Football v3 (api-sports.io)                |
| Deployment | Vercel                                       |

## File Structure

```
futbol.az/
├── backend/
│   ├── server.js           ← Express entry point
│   ├── routes/
│   │   ├── standings.js    ← GET /api/standings/:leagueId
│   │   ├── matches.js      ← GET /api/matches, /api/live
│   │   ├── players.js      ← GET /api/top-scorers/:leagueId
│   │   └── teams.js        ← GET /api/search?q=
│   ├── middleware/
│   │   ├── apiProxy.js     ← Proxy + cache helper
│   │   └── errorHandler.js ← Global error handler
│   └── utils/
│       ├── cache.js        ← In-memory TTL cache
│       └── validators.js   ← Input validation helpers
├── public/
│   ├── index.html          ← Single-page application
│   ├── app.js              ← Frontend logic
│   ├── styles.css          ← Dark/light theme
│   ├── games.js            ← Interactive games
│   └── games.css           ← Game styles
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

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

Edit `.env`:

```
APISPORTS_KEY=your_api_football_key_here
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

All proxy endpoints forward requests to `v3.football.api-sports.io` and cache
responses for **5 minutes** to conserve API quota.

| Method | Path                          | Description                         |
| ------ | ----------------------------- | ----------------------------------- |
| GET    | `/api/standings/:leagueId`    | League table for the current season |
| GET    | `/api/live`                   | All currently live matches          |
| GET    | `/api/matches`                | Fixtures scheduled for today        |
| GET    | `/api/top-scorers/:leagueId`  | Top scorers for the current season  |
| GET    | `/api/search?q=<term>`        | Search teams by name                |

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

| Variable        | Required | Default       | Description                          |
| --------------- | -------- | ------------- | ------------------------------------ |
| `APISPORTS_KEY` | ✅       | —             | Your api-sports.io API key           |
| `PORT`          | ❌       | `3000`        | TCP port the server listens on       |
| `NODE_ENV`      | ❌       | `development` | `production` for production mode     |

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables under **Settings → Environment Variables**:
   - `APISPORTS_KEY` = your key
   - `NODE_ENV` = `production`
4. Vercel will use `vercel.json` automatically.

### Railway / Render

Set the same environment variables and point the start command to `npm start`.

---

## Security Notes

- The API key is **never** sent to the browser. The frontend calls `/api/standings/39`
  (the local proxy), not the api-sports.io endpoint directly.
- `.env` is listed in `.gitignore`.
- All `leagueId` path parameters are validated against an allowlist.
- CORS is enabled; restrict it in production with:  
  `app.use(cors({ origin: "https://futbol.az" }))`.

---

## License

MIT © 2026 Futbol.az

