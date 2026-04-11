# Futbol.az ⚽

Professional football portal for Azerbaijan and world leagues – **2026 Season Redesign**.

## Features

- 🇦🇿 Azərbaycan Premyer Liqası
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
- 🇪🇸 La Liga
- 🇮🇹 Serie A
- 🇩🇪 Bundesliga
- 🔴 **Live match scores** with real-time goal notifications
- 🔔 **Goal alerts** – in-app toast, optional browser notification & sound effect
- ⭐ **Favourite team** highlight with settings persisted in localStorage
- 📊 Real-time standings (2025-26 season)
- ⚽ Top scorers per league
- 🔍 Team & player search
- 🌙 Dark / Light mode
- 🎮 Interactive games (trivia, prediction, penalty shootout)
- 📱 Mobile-first responsive layout
- 🔒 Secure API proxy (keys never exposed to browser)

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Backend  | Node.js 18+, Express 4, node-fetch             |
| Security | express-rate-limit, CORS, dotenv, input validation |
| Frontend | Vanilla HTML / CSS / JS (no framework)         |
| APIs     | API-Football v3 (api-sports.io) · **Football-Data.org v4** |
| Deployment | Vercel                                       |

## File Structure

```
futbol.az/
├── backend/
│   ├── server.js                  ← Express entry point
│   ├── routes/
│   │   ├── standings.js           ← GET /api/standings/:leagueId
│   │   ├── matches.js             ← GET /api/matches, /api/live
│   │   ├── players.js             ← GET /api/top-scorers/:leagueId
│   │   ├── teams.js               ← GET /api/search?q=
│   │   └── footballDataRoutes.js  ← GET /api/fd/live|today|upcoming|match/:id
│   ├── middleware/
│   │   ├── apiProxy.js            ← api-sports.io proxy + cache
│   │   ├── footballDataProxy.js   ← Football-Data.org proxy + cache
│   │   └── errorHandler.js        ← Global error handler
│   └── utils/
│       ├── cache.js               ← In-memory TTL cache
│       └── validators.js          ← Input validation helpers
├── public/
│   ├── index.html                 ← Games platform SPA
│   ├── live.html                  ← Live matches & goal notifications page
│   ├── app.js                     ← Games-platform frontend logic
│   ├── live.js                    ← Live matches + goal notification logic
│   ├── styles.css                 ← Dark/light theme
│   ├── live-matches.css           ← Live matches page styles
│   ├── games.js                   ← Interactive games
│   └── games.css                  ← Game styles
├── test/
│   └── goal-diff.test.js          ← Unit tests (node --test)
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
FOOTBALL_DATA_KEY=your_football_data_key_here
PORT=3000
NODE_ENV=production
```

> ⚠️ **Never commit `.env` to git.** It is already in `.gitignore`.

#### Getting your Football-Data.org API key

1. Visit <https://www.football-data.org/> and create a free account.
2. Your API key will be emailed to you and shown in the dashboard.
3. The free tier provides access to the top 12 competitions
   (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, etc.).
4. Copy the key and paste it as `FOOTBALL_DATA_KEY` in your `.env` file.

> **Note:** Without `FOOTBALL_DATA_KEY` the live matches page will display an
> error message. The games platform and standings (powered by `APISPORTS_KEY`)
> continue to work independently.

### 3. Start the server

```bash
npm start          # production
npm run dev        # development with auto-reload
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Games platform:** `http://localhost:3000/`
- **Live matches:** `http://localhost:3000/live.html`

---

## Running Tests

```bash
npm test
```

Uses the Node.js built-in test runner (`node --test`). No extra packages needed.

---

## API Endpoints

### api-sports.io Proxy (`APISPORTS_KEY`)

All endpoints cache responses for **5 minutes** to conserve API quota.

| Method | Path                          | Description                         |
| ------ | ----------------------------- | ----------------------------------- |
| GET    | `/api/standings/:leagueId`    | League table for the current season |
| GET    | `/api/live`                   | All currently live matches          |
| GET    | `/api/matches`                | Fixtures scheduled for today        |
| GET    | `/api/top-scorers/:leagueId`  | Top scorers for the current season  |
| GET    | `/api/search?q=<term>`        | Search teams by name                |

### Football-Data.org Proxy (`FOOTBALL_DATA_KEY`)

Used by the live matches page (`/live.html`).

| Method | Path                | TTL    | Description                              |
| ------ | ------------------- | ------ | ---------------------------------------- |
| GET    | `/api/fd/live`      | 30 s   | All currently in-play matches            |
| GET    | `/api/fd/today`     | 60 s   | All matches scheduled for today          |
| GET    | `/api/fd/matches`   | 60 s   | Matches by date (`?date=YYYY-MM-DD`)     |
| GET    | `/api/fd/upcoming`  | 5 min  | Matches in the next 3 days               |
| GET    | `/api/fd/match/:id` | 30 s   | Full match details (events, bookings…)   |

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

| Variable             | Required | Default       | Description                          |
| -------------------- | -------- | ------------- | ------------------------------------ |
| `APISPORTS_KEY`      | ✅       | —             | Your api-sports.io API key           |
| `FOOTBALL_DATA_KEY`  | ✅       | —             | Your Football-Data.org API key       |
| `PORT`               | ❌       | `3000`        | TCP port the server listens on       |
| `NODE_ENV`           | ❌       | `development` | `production` for production mode     |

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables under **Settings → Environment Variables**:
   - `APISPORTS_KEY` = your api-sports.io key
   - `FOOTBALL_DATA_KEY` = your Football-Data.org key
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
