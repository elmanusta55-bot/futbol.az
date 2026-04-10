/* ═══════════════════════════════════════════════════════════════════════
   FUTBOL.AZ – Games Platform JS
   Complete game platform with ratings, favorites, comments, newsletter
   ═══════════════════════════════════════════════════════════════════════ */
"use strict";

// ─────────────────────────────── Security ────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─────────────────────────────── Constants ───────────────────────────────────
const SITE_URL = window.location.origin || "https://futbol.az";

// ─────────────────────────────── GAMES DATA ──────────────────────────────────
const GAMES_DATA = [
  {
    id: 1,
    title: "Penalti Atışları",
    category: "Spor",
    emoji: "⚽",
    gameType: "penalty",
    gradient: "linear-gradient(135deg, #003DA5 0%, #CE1126 100%)",
    description: "Dünya standartlarında penalti atışları oyunu. Hədəfi seçin, güclə vurun, qol atın! Vəziyyəti idarə edin və çempion olun.",
    playCount: 15420,
    rating: 4.8,
    ratingsCount: 324,
    isNew: false,
    tags: ["penalti", "futbol", "spor"],
    addedDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Futbol Viktorinası",
    category: "Viktorina",
    emoji: "🧠",
    gameType: "quiz",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    description: "Futbol haqqında biliklərinizi sınayın. Dünya futbolunun tarixi, oyunçular, turnirler haqqında çoxsaylı suallar sizi gözləyir.",
    playCount: 12850,
    rating: 4.6,
    ratingsCount: 287,
    isNew: false,
    tags: ["viktorina", "bilik", "tarix"],
    addedDate: "2024-01-20"
  },
  {
    id: 3,
    title: "Hesab Proqnozu",
    category: "Aksiya",
    emoji: "📊",
    gameType: "predictor",
    gradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    description: "Oyunların hesabını proqnoz edin və ən yaxşı analitik olun! Statistikaya əsasən dəqiq proqnozlar verin.",
    playCount: 9340,
    rating: 4.5,
    ratingsCount: 198,
    isNew: false,
    tags: ["proqnoz", "statistika", "analiz"],
    addedDate: "2024-02-01"
  },
  {
    id: 4,
    title: "Taktika Ustası",
    category: "Strateji",
    emoji: "♟️",
    gameType: "tactics",
    gradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    description: "Komandanızı idarə edin, düzgün taktika seçin, çempionluğu qazanın! Ən yaxşı strateji oyunu.",
    playCount: 8760,
    rating: 4.7,
    ratingsCount: 215,
    isNew: false,
    tags: ["taktika", "strateji", "komanda"],
    addedDate: "2024-02-10"
  },
  {
    id: 5,
    title: "Azərbaycan Kuboku",
    category: "Aksiya",
    emoji: "🏆",
    gameType: "penalty",
    gradient: "linear-gradient(135deg, #003DA5 0%, #CE1126 100%)",
    description: "Azərbaycan futbol kuboku turnirini keçin! Ən güclü komanda olun, kuboqu qazanın, tarixə adınızı yazdırın.",
    playCount: 11200,
    rating: 4.9,
    ratingsCount: 342,
    isNew: false,
    tags: ["kubok", "turnir", "azerbaycan"],
    addedDate: "2024-02-15"
  },
  {
    id: 6,
    title: "Komanda Quruluşu",
    category: "Strateji",
    emoji: "🗂️",
    gameType: "tactics",
    gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    description: "Oyunçuları seçin, düzgün formasyonu qurun, ən güclü komandanızı yaradın! Hücum və müdafiəni balanslaşdırın.",
    playCount: 7650,
    rating: 4.4,
    ratingsCount: 168,
    isNew: true,
    tags: ["komanda", "formasyon", "mentecer"],
    addedDate: "2024-03-01"
  },
  {
    id: 7,
    title: "Qol Maşını",
    category: "Spor",
    emoji: "🔥",
    gameType: "goalrush",
    gradient: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)",
    description: "Hücumçu kimi oynayın, qol atın, ən yaxşı bombardir olun! Hər oyunda daha çox qol atmağa çalışın.",
    playCount: 13500,
    rating: 4.7,
    ratingsCount: 298,
    isNew: false,
    tags: ["qol", "hücumçu", "spor"],
    addedDate: "2024-01-25"
  },
  {
    id: 8,
    title: "Dünya Kuboku Quiz",
    category: "Viktorina",
    emoji: "🌍",
    gameType: "quiz",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    description: "Dünya Kuboku tarixi haqqında suallar. Nə qədər biliyiniz var? Legendar matçlar, qollar, çempionlar haqqında biliklərinizi sınayın.",
    playCount: 10100,
    rating: 4.6,
    ratingsCount: 245,
    isNew: false,
    tags: ["dünya kuboku", "tarix", "viktorina"],
    addedDate: "2024-02-05"
  },
  {
    id: 9,
    title: "Futbol Sprinti",
    category: "Spor",
    emoji: "⚡",
    gameType: "sprint",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    description: "Sahədə sprint edin, rəqibləri geçin, qol vurun! Sürət və çeviklik oyunu. Ən sürətli futbolçu olun.",
    playCount: 6820,
    rating: 4.3,
    ratingsCount: 142,
    isNew: true,
    tags: ["sprint", "sürət", "spor"],
    addedDate: "2024-03-10"
  },
  {
    id: 10,
    title: "Bakı Derby",
    category: "Aksiya",
    emoji: "🏟️",
    gameType: "penalty",
    gradient: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
    description: "Bakı derbisi! Qarabağ vs Neftçi. Favoritiniz üçün oynayın, qalibiyyəti qazanın! Ən böyük derby.",
    playCount: 14300,
    rating: 4.8,
    ratingsCount: 367,
    isNew: false,
    tags: ["bakı", "derby", "qarabağ", "neftçi"],
    addedDate: "2024-01-30"
  },
  {
    id: 11,
    title: "Orta Sahə Ustası",
    category: "Strateji",
    emoji: "🎯",
    gameType: "goalrush",
    gradient: "linear-gradient(135deg, #360033 0%, #0b8793 100%)",
    description: "Orta sahəni idarə edin, dəqiq paslar verin, oyunu istədiyiniz istiqamətə çevirin! Yarımmüdafiəçinin gücünü hiss edin.",
    playCount: 5940,
    rating: 4.5,
    ratingsCount: 124,
    isNew: true,
    tags: ["orta sahə", "pas", "strateji"],
    addedDate: "2024-03-15"
  },
  {
    id: 12,
    title: "Futbol Tarixi",
    category: "Viktorina",
    emoji: "📚",
    gameType: "quiz",
    gradient: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
    description: "Futbol tarixini bilirsiz? Legendar oyunçular, unudulmaz anlar, tarixi matçlar haqqında suallar sizi gözləyir!",
    playCount: 8900,
    rating: 4.4,
    ratingsCount: 189,
    isNew: false,
    tags: ["tarix", "legend", "viktorina"],
    addedDate: "2024-02-20"
  },
  {
    id: 13,
    title: "Qapıçı Oyunu",
    category: "Spor",
    emoji: "🧤",
    gameType: "goalkeeper",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    description: "Qapıçı kimi oynayın, penaltiləri dayandırın, komandanızı qoruyun! Ən çətin vəziyyətdən belə qapını qoruyun.",
    playCount: 7200,
    rating: 4.6,
    ratingsCount: 156,
    isNew: true,
    tags: ["qapıçı", "penalti", "müdafiə"],
    addedDate: "2024-03-05"
  },
  {
    id: 14,
    title: "Avropa Liqası",
    category: "Aksiya",
    emoji: "⭐",
    gameType: "predictor",
    gradient: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)",
    description: "Avropa Liqasında mübarizə! Komandanızı çempionluğa aparın, Avropa tarixinə adınızı yazdırın!",
    playCount: 9800,
    rating: 4.7,
    ratingsCount: 231,
    isNew: false,
    tags: ["avropa", "liqa", "turnir"],
    addedDate: "2024-02-25"
  }
];

// ─────────────────────────────── State ───────────────────────────────────────
let state = {
  currentCategory: "all",
  currentSearch: "",
  currentSort: "popular",
  favorites: [],
  ratings: {},
  comments: {},
  newsletter: [],
  scores: {},
};

// ─────────────────────────────── localStorage Helpers ─────────────────────────
const LS_KEYS = {
  favorites: "faz_favorites",
  ratings:   "faz_ratings",
  comments:  "faz_comments",
  newsletter:"faz_newsletter",
  theme:     "faz_theme",
  scores:    "faz_scores",
};

function lsGet(key, fallback) {
  try {
    const val = localStorage.getItem(LS_KEYS[key]);
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function lsSet(key, value) {
  try { localStorage.setItem(LS_KEYS[key], JSON.stringify(value)); } catch {}
}

function loadState() {
  state.favorites = lsGet("favorites", []);
  state.ratings   = lsGet("ratings",   {});
  state.comments  = lsGet("comments",  {});
  state.newsletter= lsGet("newsletter",  []);
  state.scores    = lsGet("scores", {});
}

// ─────────────────────────────── Theme ───────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  lsSet("theme", next);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = next === "dark" ? "🌙" : "☀️";
}

function applyTheme() {
  const saved = lsGet("theme", null);
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = saved === "dark" ? "🌙" : "☀️";
  }
}

// ─────────────────────────────── Navigation ──────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue("--navbar-h")) || 64;
  const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
  window.scrollTo({ top: y, behavior: "smooth" });
  updateActiveNav(id);
}

function updateActiveNav(activeSectionId) {
  document.querySelectorAll(".nav-link").forEach(a => {
    const href = a.getAttribute("href")?.replace("#", "");
    a.classList.toggle("active", href === activeSectionId);
  });
}

function toggleSearch() {
  const dd = document.getElementById("search-dropdown");
  if (!dd) return;
  const hidden = dd.hidden;
  dd.hidden = !hidden;
  if (hidden) {
    const inp = document.getElementById("game-search");
    if (inp) { inp.focus(); inp.value = ""; }
    document.getElementById("search-results").innerHTML = "";
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger");
  if (!menu) return;
  const isHidden = menu.hidden;
  menu.hidden = !isHidden;
  if (btn) {
    btn.classList.toggle("open", isHidden);
    btn.setAttribute("aria-expanded", String(isHidden));
  }
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger");
  if (menu) menu.hidden = true;
  if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// Close search on outside click
document.addEventListener("click", e => {
  const wrap = document.getElementById("search-wrap");
  if (wrap && !wrap.contains(e.target)) {
    const dd = document.getElementById("search-dropdown");
    if (dd) dd.hidden = true;
  }
});

// ─────────────────────────────── Game Rendering ──────────────────────────────
function getFilteredGames() {
  let games = [...GAMES_DATA];

  // Category filter
  if (state.currentCategory === "favorites") {
    games = games.filter(g => state.favorites.includes(g.id));
  } else if (state.currentCategory !== "all") {
    games = games.filter(g => g.category === state.currentCategory);
  }

  // Search filter
  if (state.currentSearch) {
    const q = state.currentSearch.toLowerCase();
    games = games.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (state.currentSort) {
    case "popular": games.sort((a, b) => b.playCount - a.playCount); break;
    case "rating":  games.sort((a, b) => b.rating - a.rating); break;
    case "newest":  games.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)); break;
    case "oldest":  games.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate)); break;
  }

  return games;
}

function renderGames(filter, category, sort) {
  if (category !== undefined) state.currentCategory = category;
  if (sort !== undefined) state.currentSort = sort;

  const games = getFilteredGames();
  const grid = document.getElementById("games-grid");
  const countEl = document.getElementById("games-count");
  const noResults = document.getElementById("no-results");
  if (!grid) return;

  if (games.length === 0) {
    grid.innerHTML = "";
    if (noResults) noResults.hidden = false;
    if (countEl) countEl.textContent = "Oyun tapılmadı";
    return;
  }

  if (noResults) noResults.hidden = true;
  if (countEl) countEl.textContent = `${games.length} oyun göstərilir`;

  grid.innerHTML = games.map(g => renderGameCard(g)).join("");
}

function renderGameCard(g) {
  const isFav = state.favorites.includes(g.id);
  const userRating = state.ratings[g.id] || 0;
  const starDisplay = renderStarDisplay(g.rating);
  const playFmt = formatPlayCount(g.playCount);

  return `
    <article class="game-card" role="listitem" data-id="${g.id}" data-cat="${escapeHTML(g.category)}"
      onclick="openGameDetail(${g.id})" aria-label="${escapeHTML(g.title)} oyununu aç">
      <div class="game-card-banner" style="background:${g.gradient}">
        <button class="game-card-fav ${isFav ? 'active' : ''}"
          onclick="event.stopPropagation(); toggleFavorite(${g.id})"
          aria-label="${isFav ? 'Favorilərdən çıxar' : 'Favorilərə əlavə et'}"
          title="${isFav ? 'Favorilərdən çıxar' : 'Favorilərə əlavə et'}">
          ${isFav ? "❤️" : "🤍"}
        </button>
        <span>${g.emoji}</span>
        ${g.isNew ? '<span class="new-ribbon">YENİ</span>' : ""}
        <button class="game-card-menu-btn"
          onclick="event.stopPropagation(); toggleDotMenu(${g.id}, this)"
          aria-label="Menyu" aria-haspopup="true" aria-expanded="false">⋮</button>
      </div>
      <div class="game-card-body">
        <div class="game-card-header">
          <h3 class="game-card-title">${escapeHTML(g.title)}</h3>
          <span class="badge">${escapeHTML(g.category)}</span>
        </div>
        <p class="game-card-desc">${escapeHTML(g.description)}</p>
        <div class="game-card-footer">
          <div class="game-card-stats">
            <span class="game-card-stat">
              <span class="star-icon">⭐</span> ${g.rating.toFixed(1)}
            </span>
            <span class="game-card-stat">▶ ${playFmt}</span>
          </div>
          <button class="play-btn" onclick="event.stopPropagation(); playGame(${g.id})"
            aria-label="${escapeHTML(g.title)} oynunu aç">
            Oyna ▶
          </button>
        </div>
      </div>
    </article>`;
}

function renderStarDisplay(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= full) s += "★";
    else if (i === full + 1 && half) s += "½";
    else s += "☆";
  }
  return s;
}

function formatPlayCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return String(n);
}

// ─────────────────────────────── Filters ─────────────────────────────────────
function filterCategory(cat) {
  state.currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(b => {
    const active = b.dataset.cat === cat;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", String(active));
  });
  renderGames();
}

function filterGames(query) {
  state.currentSearch = (query || "").toLowerCase().trim();

  // Search results dropdown
  renderSearchResults(state.currentSearch);

  // Also filter main grid if search section visible
  renderGames();
}

function renderSearchResults(q) {
  const container = document.getElementById("search-results");
  if (!container) return;
  if (!q) { container.innerHTML = ""; return; }

  const matches = GAMES_DATA.filter(g =>
    g.title.toLowerCase().includes(q) ||
    g.category.toLowerCase().includes(q) ||
    g.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 6);

  if (matches.length === 0) {
    container.innerHTML = `<div style="padding:14px 16px;color:var(--text-muted);font-size:.88rem;">Nəticə tapılmadı</div>`;
    return;
  }

  container.innerHTML = matches.map(g => `
    <div class="search-result-item" onclick="openGameDetail(${g.id}); toggleSearch();" role="button" tabindex="0">
      <span class="sri-emoji">${g.emoji}</span>
      <div class="sri-info">
        <div class="sri-title">${escapeHTML(g.title)}</div>
        <div class="sri-cat">${escapeHTML(g.category)}</div>
      </div>
    </div>`).join("");
}

function sortGames(value) {
  state.currentSort = value;
  renderGames();
}

// ─────────────────────────────── Top 10 & New Games ──────────────────────────
function renderTopGames() {
  const container = document.getElementById("top-games-list");
  if (!container) return;

  const top = [...GAMES_DATA]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 10);

  container.innerHTML = top.map((g, i) => {
    const rank = i + 1;
    const rankClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "rank-other";
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
    return `
      <div class="top-game-item" onclick="openGameDetail(${g.id})" role="button" tabindex="0"
        aria-label="${escapeHTML(g.title)} oyununu aç"
        onkeydown="if(event.key==='Enter')openGameDetail(${g.id})">
        <div class="top-rank ${rankClass}">${medal}</div>
        <div class="top-game-emoji">${g.emoji}</div>
        <div class="top-game-info">
          <div class="top-game-title">${escapeHTML(g.title)}</div>
          <div class="top-game-meta">${escapeHTML(g.category)} · ⭐ ${g.rating.toFixed(1)}</div>
        </div>
        <div class="top-game-plays">▶ ${formatPlayCount(g.playCount)}</div>
      </div>`;
  }).join("");
}

function renderNewGames() {
  const container = document.getElementById("new-games-grid");
  if (!container) return;

  const newGames = [...GAMES_DATA]
    .filter(g => g.isNew)
    .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));

  if (newGames.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center">Yeni oyun yoxdur</p>`;
    return;
  }

  container.innerHTML = newGames.map(g => renderGameCard(g)).join("");
}

function renderCategories() {
  const container = document.getElementById("categories-grid");
  if (!container) return;

  const cats = [
    { key: "Aksiya",   icon: "🎯", name: "Aksiya",   desc: "Sürətli aksiya oyunları", cls: "category-card-aksiya" },
    { key: "Strateji", icon: "♟️", name: "Strateji", desc: "Taktika və strateji",      cls: "category-card-strateji" },
    { key: "Spor",     icon: "⚽", name: "Spor",     desc: "Fiziki futbol oyunları",   cls: "category-card-spor" },
    { key: "Viktorina",icon: "🧠", name: "Viktorina",desc: "Bilik sınaması",           cls: "category-card-viktorina" },
  ];

  container.innerHTML = cats.map(c => {
    const count = GAMES_DATA.filter(g => g.category === c.key).length;
    return `
      <div class="category-card ${c.cls}" onclick="filterCategory('${escapeHTML(c.key)}'); scrollToSection('games-section');"
        role="button" tabindex="0" aria-label="${escapeHTML(c.name)} kateqoriyasını göstər"
        onkeydown="if(event.key==='Enter'){filterCategory('${escapeHTML(c.key)}');scrollToSection('games-section');}">
        <span class="category-card-icon">${c.icon}</span>
        <div class="category-card-name">${escapeHTML(c.name)}</div>
        <div class="category-card-count">${count} oyun</div>
        <p style="font-size:.82rem;color:var(--text-muted);margin-top:6px;">${escapeHTML(c.desc)}</p>
      </div>`;
  }).join("");
}

// ─────────────────────────────── Hero Stats ──────────────────────────────────
function renderHeroStats() {
  const favCount = state.favorites.length;
  const favEl = document.getElementById("stat-favs");
  if (favEl) favEl.textContent = String(favCount);
}

// ─────────────────────────────── Dot Menu ────────────────────────────────────
let _dotMenuPortal = null;
let _dotMenuActiveId = null;

function getDotMenuPortal() {
  if (!_dotMenuPortal) {
    _dotMenuPortal = document.createElement("div");
    _dotMenuPortal.id = "dot-menu-portal";
    _dotMenuPortal.style.cssText = "position:fixed;z-index:5000;display:none;";
    document.body.appendChild(_dotMenuPortal);
  }
  return _dotMenuPortal;
}

function toggleDotMenu(gameId, btn) {
  const portal = getDotMenuPortal();

  if (_dotMenuActiveId === gameId && portal.style.display !== "none") {
    closeDotMenus();
    return;
  }

  closeDotMenus();
  _dotMenuActiveId = gameId;

  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;
  const isFav = state.favorites.includes(gameId);

  portal.innerHTML = `
    <div class="dot-menu" style="position:static;display:block;">
      <button class="dot-menu-item" onclick="toggleFavorite(${gameId}); closeDotMenus()">
        ${isFav ? '💔 Favorilərdən çıxar' : '📌 Favorilərə əlavə et'}
      </button>
      <button class="dot-menu-item" onclick="openSharePopup(${gameId}); closeDotMenus()">
        🔗 Paylaş
      </button>
      <button class="dot-menu-item" onclick="closeDotMenus(); openGameDetail(${gameId})">
        📝 Şərh / Reytinq
      </button>
      <button class="dot-menu-item" onclick="closeDotMenus(); openGameDetail(${gameId})">
        🎯 Oyun haqqında
      </button>
    </div>`;

  // Position portal near the button
  if (btn) {
    const rect = btn.getBoundingClientRect();
    const menuW = 210;
    let left = rect.right - menuW;
    if (left < 8) left = rect.left;
    let top = rect.bottom + 4;
    if (top + 180 > window.innerHeight) top = rect.top - 180;
    portal.style.left = `${left}px`;
    portal.style.top = `${top}px`;
    portal.style.minWidth = `${menuW}px`;
  }
  portal.style.display = "block";
  if (btn) btn.setAttribute("aria-expanded", "true");
}

function closeDotMenus() {
  const portal = getDotMenuPortal();
  portal.style.display = "none";
  portal.innerHTML = "";
  _dotMenuActiveId = null;
  document.querySelectorAll(".game-card-menu-btn").forEach(b => b.setAttribute("aria-expanded", "false"));
}

// Close dot menus on outside click
document.addEventListener("click", e => {
  if (!e.target.closest(".dot-menu") && !e.target.closest(".game-card-menu-btn")) {
    closeDotMenus();
  }
});

// ─────────────────────────────── Share Popup ─────────────────────────────────
let sharePopupGameId = null;

function openSharePopup(gameId) {
  closeDotMenus();
  sharePopupGameId = gameId;
  const popup = document.getElementById("share-popup");
  if (popup) popup.hidden = false;
}

function closeSharePopup() {
  const popup = document.getElementById("share-popup");
  if (popup) popup.hidden = true;
  sharePopupGameId = null;
}

function shareGameFromPopup(platform) {
  const id = sharePopupGameId || currentGameId;
  if (id) shareGame(id, platform);
  closeSharePopup();
}

// Close share popup on backdrop click
document.addEventListener("click", e => {
  const popup = document.getElementById("share-popup");
  if (popup && !popup.hidden && e.target === popup) closeSharePopup();
});

// ─────────────────────────────── Favorites ───────────────────────────────────
function toggleFavorite(gameId) {
  const idx = state.favorites.indexOf(gameId);
  if (idx === -1) {
    state.favorites.push(gameId);
    showToast("❤️ Favorilərə əlavə edildi!");
  } else {
    state.favorites.splice(idx, 1);
    showToast("💔 Favorilərdən çıxarıldı");
    // If currently viewing favorites, re-render
    if (state.currentCategory === "favorites") renderGames();
  }
  lsSet("favorites", state.favorites);

  // Update all fav buttons for this game
  document.querySelectorAll(`.game-card[data-id="${gameId}"] .game-card-fav`).forEach(btn => {
    const active = state.favorites.includes(gameId);
    btn.classList.toggle("active", active);
    btn.textContent = active ? "❤️" : "🤍";
    btn.setAttribute("aria-label", active ? "Favorilərdən çıxar" : "Favorilərə əlavə et");
  });

  // Update modal fav button
  const modalFavBtn = document.getElementById("modal-fav-btn");
  const modalFavIcon = document.getElementById("modal-fav-icon");
  if (modalFavBtn && currentGameId === gameId) {
    const active = state.favorites.includes(gameId);
    modalFavBtn.classList.toggle("active", active);
    if (modalFavIcon) modalFavIcon.textContent = active ? "❤️" : "♡";
  }

  renderHeroStats();
}

// ─────────────────────────────── Rating ──────────────────────────────────────
function rateGame(gameId, stars) {
  state.ratings[gameId] = stars;
  lsSet("ratings", state.ratings);

  renderModalStars(gameId);
  const hint = document.getElementById("rating-hint");
  if (hint) {
    const labels = ["", "Zəif", "Orta", "Yaxşı", "Çox Yaxşı", "Əla!"];
    hint.textContent = `${stars} ulduz – ${labels[stars] || ""}`;
  }
  showToast(`⭐ ${stars} ulduz verdiniz!`);
}

function renderModalStars(gameId) {
  const container = document.getElementById("modal-stars");
  if (!container) return;
  const userRating = state.ratings[gameId] || 0;

  container.innerHTML = [1,2,3,4,5].map(s => `
    <button class="star-btn ${s <= userRating ? 'active' : ''}"
      onclick="rateGame(${gameId}, ${s})"
      onmouseover="hoverStars(${gameId}, ${s})"
      onmouseout="renderModalStars(${gameId})"
      aria-label="${s} ulduz"
      title="${s} ulduz">
      ${s <= userRating ? "⭐" : "☆"}
    </button>`).join("");
}

function hoverStars(gameId, hover) {
  const container = document.getElementById("modal-stars");
  if (!container) return;
  container.querySelectorAll(".star-btn").forEach((btn, i) => {
    btn.textContent = i < hover ? "⭐" : "☆";
  });
}

// ─────────────────────────────── Comments ────────────────────────────────────
function addComment(gameId, text, author) {
  if (!text.trim() || !author.trim()) {
    showToast("⚠️ Ad və şərh mətni tələb olunur");
    return false;
  }
  if (text.length > 500) {
    showToast("⚠️ Şərh çox uzundur (maks. 500 simvol)");
    return false;
  }
  if (!state.comments[gameId]) state.comments[gameId] = [];

  const comment = {
    id: Date.now(),
    author: author.trim().slice(0, 50),
    text: text.trim().slice(0, 500),
    date: new Date().toLocaleDateString("az-AZ", { year: "numeric", month: "2-digit", day: "2-digit" }) || new Date().toLocaleDateString()
  };
  state.comments[gameId].unshift(comment);
  lsSet("comments", state.comments);
  renderComments(gameId);
  showToast("💬 Şərhiniz əlavə edildi!");
  return true;
}

function renderComments(gameId) {
  const list = document.getElementById("comments-list");
  const countEl = document.getElementById("comments-count");
  const noComments = document.getElementById("no-comments");
  if (!list) return;

  const comments = state.comments[gameId] || [];
  if (countEl) countEl.textContent = `(${comments.length})`;

  if (comments.length === 0) {
    list.innerHTML = `<p class="no-comments" id="no-comments">Hələ şərh yoxdur. İlk şərhi siz yazın!</p>`;
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-header">
        <span class="comment-author">👤 ${escapeHTML(c.author)}</span>
        <span class="comment-date">${escapeHTML(c.date)}</span>
      </div>
      <p class="comment-text">${escapeHTML(c.text)}</p>
    </div>`).join("");
}

function handleCommentSubmit(event) {
  event.preventDefault();
  const author = document.getElementById("comment-author")?.value || "";
  const text   = document.getElementById("comment-text")?.value || "";
  if (addComment(currentGameId, text, author)) {
    if (document.getElementById("comment-author")) document.getElementById("comment-author").value = "";
    if (document.getElementById("comment-text"))   document.getElementById("comment-text").value = "";
  }
}

// ─────────────────────────────── Share ───────────────────────────────────────
function shareGame(gameId, platform) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;
  const url  = encodeURIComponent(SITE_URL);
  const text = encodeURIComponent(`${game.emoji} ${game.title} oynunu Futbol.az-da oynamağa çalışın!`);
  let shareUrl = "";
  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      break;
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
      break;
    case "copy":
      try {
        navigator.clipboard.writeText(SITE_URL + `?game=${gameId}`).then(() => {
          showToast("🔗 Link kopyalandı!");
        }).catch(() => showToast("🔗 Link kopyalandı!"));
      } catch {
        showToast("🔗 Link kopyalandı!");
      }
      return;
  }
  if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  showToast(`📤 ${platform.charAt(0).toUpperCase() + platform.slice(1)}-da paylaşıldı!`);
}

// ─────────────────────────────── Newsletter ──────────────────────────────────
function subscribeNewsletter(email) {
  const msgEl = document.getElementById("newsletter-msg");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    if (msgEl) { msgEl.textContent = "⚠️ Düzgün email ünvanı daxil edin"; msgEl.className = "newsletter-note error"; }
    return false;
  }
  if (state.newsletter.includes(email.toLowerCase())) {
    if (msgEl) { msgEl.textContent = "✅ Bu email artıq qeydiyyatdadır!"; msgEl.className = "newsletter-note success"; }
    return false;
  }
  state.newsletter.push(email.toLowerCase());
  lsSet("newsletter", state.newsletter);
  if (msgEl) { msgEl.textContent = "🎉 Uğurla abunə oldunuz!"; msgEl.className = "newsletter-note success"; }
  updateSubscriberCount();
  showToast("🎉 Xəbər bülleteni abunəliyi uğurludur!");
  return true;
}

function updateSubscriberCount() {
  const el = document.getElementById("subscribers-count");
  if (el && state.newsletter.length > 0)
    el.textContent = `✅ ${state.newsletter.length} abunəçi`;
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailEl = document.getElementById("newsletter-email");
  if (!emailEl) return;
  const email = emailEl.value.trim();
  if (subscribeNewsletter(email)) emailEl.value = "";
}

// ─────────────────────────────── Game Modal ──────────────────────────────────
let currentGameId = null;

function openGameDetail(gameId) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;
  currentGameId = gameId;

  // Banner
  const banner = document.getElementById("modal-banner");
  if (banner) banner.style.background = game.gradient;
  const emojiEl = document.getElementById("modal-emoji");
  if (emojiEl) emojiEl.textContent = game.emoji;

  // Title, category, description
  const titleEl = document.getElementById("modal-game-title");
  if (titleEl) titleEl.textContent = game.title;
  const catEl = document.getElementById("modal-category");
  if (catEl) catEl.textContent = game.category;
  const descEl = document.getElementById("modal-game-description");
  if (descEl) descEl.textContent = game.description;

  // New badge
  const newBadge = document.getElementById("modal-new-badge");
  if (newBadge) newBadge.hidden = !game.isNew;

  // Stats
  const playEl = document.getElementById("modal-play-count");
  if (playEl) playEl.textContent = formatPlayCount(game.playCount);
  const ratingEl = document.getElementById("modal-avg-rating");
  if (ratingEl) ratingEl.textContent = game.rating.toFixed(1);
  const rcEl = document.getElementById("modal-ratings-count");
  if (rcEl) rcEl.textContent = game.ratingsCount;

  // Tags
  const tagsEl = document.getElementById("modal-tags");
  if (tagsEl) tagsEl.innerHTML = game.tags.map(t =>
    `<span class="modal-tag">#${escapeHTML(t)}</span>`).join("");

  // Favorite button
  const favBtn = document.getElementById("modal-fav-btn");
  const favIcon = document.getElementById("modal-fav-icon");
  const isFav = state.favorites.includes(gameId);
  if (favBtn) favBtn.classList.toggle("active", isFav);
  if (favIcon) favIcon.textContent = isFav ? "❤️" : "♡";

  // Stars
  renderModalStars(gameId);
  const hint = document.getElementById("rating-hint");
  if (hint) {
    const ur = state.ratings[gameId];
    if (ur) {
      const labels = ["", "Zəif", "Orta", "Yaxşı", "Çox Yaxşı", "Əla!"];
      hint.textContent = `${ur} ulduz – ${labels[ur]}`;
    } else {
      hint.textContent = "Bir ulduz seçin";
    }
  }

  // Comments
  renderComments(gameId);

  // Show modal
  const modal = document.getElementById("game-modal");
  if (modal) {
    modal.classList.remove("is-closing");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // Scroll modal to top
    const box = document.getElementById("modal-box");
    if (box) box.scrollTop = 0;
  }
}

function closeModal() {
  const modal = document.getElementById("game-modal");
  if (!modal || modal.hidden) return;
  modal.classList.add("is-closing");
  setTimeout(() => {
    modal.classList.remove("is-closing");
    modal.hidden = true;
    document.body.style.overflow = "";
  }, 250);
}

function playGame(gameId) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;

  // Increment play count (UI only)
  game.playCount += 1;

  // Close detail modal if open
  closeModal();

  // Open game player
  openGamePlayer(game);
}

// Modal close on overlay click
document.addEventListener("click", e => {
  const modal = document.getElementById("game-modal");
  if (modal && e.target === modal) closeModal();
});

// Modal close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    closeGamePlayer();
    closeSharePopup();
  }
});

// ─────────────────────────────── Toast ───────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ─────────────────────────────── Leaderboard / Scores ───────────────────────
function getHighScore(gameId) {
  return (state.scores[gameId] || []).reduce((max, s) => {
    const val = typeof s === "object" ? s.score : s;
    return Math.max(max, val);
  }, 0);
}

function saveScore(gameId, score) {
  if (!state.scores[gameId]) state.scores[gameId] = [];
  state.scores[gameId].push({ score, date: Date.now() });
  // Keep top 10 scores only
  state.scores[gameId].sort((a, b) => b.score - a.score);
  if (state.scores[gameId].length > 10) state.scores[gameId].length = 10;
  lsSet("scores", state.scores);
}

function getTopScores(gameId, limit) {
  const scores = (state.scores[gameId] || []).slice(0, limit || 5);
  return scores.map(s => (typeof s === "object" ? s.score : s));
}

function renderLeaderboard(gameId, currentScore) {
  const scores = getTopScores(gameId, 5);
  if (scores.length === 0) return "";
  const html = scores.map((s, i) => {
    const isCurrent = s === currentScore;
    return `<div class="gor-lb-item${isCurrent ? ' current' : ''}">
      <span class="gor-lb-rank">${i + 1}.</span>
      <span>${isCurrent ? '👤 Siz' : `Oyunçu ${i + 1}`}</span>
      <span class="gor-lb-score">${s}</span>
    </div>`;
  }).join("");
  return `<div class="gor-lb-title">🏆 Ən Yüksək Skorlar</div>${html}`;
}

// ─────────────────────────────── Game Player ─────────────────────────────────
let gpCurrentGame = null;
let gpGameState = {}; // holds game engine state
let gpSoundOn = true;
let gpPaused = false;
let gpAnimFrame = null;
let gpIntervals = [];
let gpTimeouts = [];

function openGamePlayer(game) {
  gpCurrentGame = game;
  gpGameState = {};
  gpPaused = false;
  gpSoundOn = true;

  const overlay = document.getElementById("game-player");
  if (!overlay) return;

  // Set title and score
  const titleEl = document.getElementById("gp-title");
  if (titleEl) titleEl.textContent = game.title;
  setGpScore(0);

  // Sound button
  const soundBtn = document.getElementById("gp-sound-btn");
  if (soundBtn) soundBtn.textContent = "🔊";

  // Pause button
  const pauseBtn = document.getElementById("gp-pause-btn");
  if (pauseBtn) pauseBtn.textContent = "⏸";

  // Set start screen content
  const gosEmoji = document.getElementById("gos-emoji");
  if (gosEmoji) gosEmoji.textContent = game.emoji;
  const gosTitle = document.getElementById("gos-title");
  if (gosTitle) gosTitle.textContent = game.title;
  const gosDesc = document.getElementById("gos-desc");
  if (gosDesc) gosDesc.textContent = game.description;
  const gosHighscore = document.getElementById("gos-highscore");
  if (gosHighscore) gosHighscore.textContent = getHighScore(game.id);

  // Show controls hint
  const hint = document.getElementById("gos-controls-hint");
  if (hint) hint.innerHTML = getControlsHint(game.gameType);

  // Clear game area
  const gameArea = document.getElementById("game-area");
  if (gameArea) gameArea.innerHTML = "";

  // Show screens
  showScreen("start");

  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeGamePlayer() {
  stopGameEngine();
  const overlay = document.getElementById("game-player");
  if (overlay) overlay.hidden = true;
  document.body.style.overflow = "";
  gpCurrentGame = null;
}

function showScreen(name) {
  const screens = {
    start: "game-start-screen",
    over:  "game-over-screen",
    paused:"game-paused-screen",
  };
  // Hide all overlay screens
  Object.values(screens).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  if (name && screens[name]) {
    const el = document.getElementById(screens[name]);
    if (el) el.hidden = false;
  }
}

function setGpScore(val) {
  const el = document.getElementById("gp-score");
  if (el) el.textContent = val;
}

function getControlsHint(gameType) {
  const hints = {
    penalty:    "⚽ Qapıda zona seçin → Tıklayın → Qol vurun! 5 penalti atışınız var.",
    quiz:       "🧠 Sualı oxuyun, düzgün cavabı seçin. Hər düzgün cavab = 10 xal + zaman bonusu.",
    goalkeeper: "🧤 Siçan/barmaqla hərəkət edin. Qapıya gələn topları tutun!",
    goalrush:   "🎯 Ekranda görünən topları sürətlə tıklayın! 30 saniyəniz var.",
    sprint:     "⚡ Düyməyə basın/tıklayın! Nə qədər çox bassanız, o qədər sürətli qaçırsınız.",
    predictor:  "📊 Hər oyun üçün hesabı proqnoz edin. Dəqiq nəticə = 10 xal, düzgün nəticə = 5 xal.",
    tactics:    "♟️ Formasyon, hücum tərzi və müdafiə strategiyasını seçin. Ən yaxşı taktika ilə qazanın!",
  };
  return hints[gameType] || "🎮 Oyun başladıqda qaydaları öyrənərsiniz.";
}

function toggleGameSound() {
  gpSoundOn = !gpSoundOn;
  const btn = document.getElementById("gp-sound-btn");
  if (btn) btn.textContent = gpSoundOn ? "🔊" : "🔇";
  showToast(gpSoundOn ? "🔊 Səs açıldı" : "🔇 Səs söndürüldü");
}

function toggleGamePause() {
  if (!gpCurrentGame) return;
  gpPaused = !gpPaused;
  const btn = document.getElementById("gp-pause-btn");
  if (btn) btn.textContent = gpPaused ? "▶️" : "⏸";
  if (gpPaused) {
    showScreen("paused");
    pauseGameEngine();
  } else {
    showScreen(null);
    resumeGameEngine();
  }
}

function toggleGameFullscreen() {
  const el = document.getElementById("game-player");
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen && el.requestFullscreen();
  } else {
    document.exitFullscreen && document.exitFullscreen();
  }
}

function restartGame() {
  if (!gpCurrentGame) return;
  stopGameEngine();
  showScreen("start");
  setGpScore(0);
  const gameArea = document.getElementById("game-area");
  if (gameArea) gameArea.innerHTML = "";
}

function startGame() {
  if (!gpCurrentGame) return;
  showScreen(null);
  gpPaused = false;
  const pauseBtn = document.getElementById("gp-pause-btn");
  if (pauseBtn) pauseBtn.textContent = "⏸";
  launchGameEngine(gpCurrentGame);
}

function stopGameEngine() {
  // Cancel animation frames
  if (gpAnimFrame) { cancelAnimationFrame(gpAnimFrame); gpAnimFrame = null; }
  // Clear intervals
  gpIntervals.forEach(id => clearInterval(id));
  gpIntervals = [];
  // Clear timeouts
  gpTimeouts.forEach(id => clearTimeout(id));
  gpTimeouts = [];
  gpPaused = false;
  gpGameState = {};
}

function pauseGameEngine() {
  gpGameState._paused = true;
}

function resumeGameEngine() {
  gpGameState._paused = false;
  // Resume canvas loop if needed
  if (gpGameState._resumeLoop) gpGameState._resumeLoop();
}

function gpSetInterval(fn, ms) {
  const id = setInterval(() => { if (!gpGameState._paused) fn(); }, ms);
  gpIntervals.push(id);
  return id;
}

function gpSetTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  gpTimeouts.push(id);
  return id;
}

function showGameOver(score, statsHtml) {
  if (!gpCurrentGame) return;
  saveScore(gpCurrentGame.id, score);
  setGpScore(score);

  const gorScore = document.getElementById("gor-score");
  if (gorScore) gorScore.textContent = score;

  const gorTitle = document.getElementById("gor-title");
  const gorIcon = document.getElementById("gor-icon");
  if (score >= 80) {
    if (gorTitle) gorTitle.textContent = "Möhtəşəm! 🔥";
    if (gorIcon) gorIcon.textContent = "🏆";
  } else if (score >= 50) {
    if (gorTitle) gorTitle.textContent = "Yaxşı Oynadınız!";
    if (gorIcon) gorIcon.textContent = "⭐";
  } else {
    if (gorTitle) gorTitle.textContent = "Oyun Bitti!";
    if (gorIcon) gorIcon.textContent = "⚽";
  }

  const gorStats = document.getElementById("gor-stats");
  if (gorStats) gorStats.innerHTML = statsHtml || "";

  const gorLb = document.getElementById("gor-leaderboard");
  if (gorLb) gorLb.innerHTML = renderLeaderboard(gpCurrentGame.id, score);

  showScreen("over");
  stopGameEngine();
}

function launchGameEngine(game) {
  switch (game.gameType) {
    case "penalty":    startPenaltyGame(game); break;
    case "quiz":       startQuizGame(game); break;
    case "goalkeeper": startGoalkeeperGame(game); break;
    case "goalrush":   startGoalRushGame(game); break;
    case "sprint":     startSprintGame(game); break;
    case "predictor":  startPredictorGame(game); break;
    case "tactics":    startTacticsGame(game); break;
    default:           startPenaltyGame(game); break;
  }
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 1: PENALTY SHOOTOUT
// ══════════════════════════════════════════════════════════════
function startPenaltyGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  const TOTAL_KICKS = 5;
  let kicks = 0, goals = 0, waiting = false;

  gameArea.innerHTML = `
    <div style="width:100%;max-width:520px;padding:20px;color:#fff;text-align:center;">
      <div style="font-size:.9rem;color:rgba(255,255,255,.6);margin-bottom:12px;">
        <span id="pen-kicks">0</span>/${TOTAL_KICKS} atış · <span id="pen-goals">0</span> qol
      </div>
      <div style="position:relative;width:100%;max-width:420px;margin:0 auto 20px;aspect-ratio:4/3;background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.1);border-radius:8px;overflow:hidden;">
        <canvas id="penalty-canvas" style="width:100%;height:100%;display:block;"></canvas>
        <div id="pen-msg" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;pointer-events:none;opacity:0;transition:opacity .3s;"></div>
      </div>
      <p id="pen-instruction" style="font-size:.9rem;color:rgba(255,255,255,.7);margin-bottom:16px;">Tıklayarak hücum zonasını seçin</p>
      <div id="pen-zones" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:300px;margin:0 auto;"></div>
    </div>`;

  const canvas = document.getElementById("penalty-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawGoal();
  }

  function drawGoal(goalieX, ballX, ballY, scored) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Pitch
    ctx.fillStyle = "rgba(22,163,74,0.3)";
    ctx.fillRect(0, 0, W, H);

    // Goal posts
    const gw = W * 0.7, gh = H * 0.5;
    const gx = (W - gw) / 2, gy = H * 0.1;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.strokeRect(gx, gy, gw, gh);

    // Goal net
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    for (let x = gx + gw / 3; x < gx + gw; x += gw / 3) {
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(gx, gy + gh / 2); ctx.lineTo(gx + gw, gy + gh / 2); ctx.stroke();

    // Penalty spot
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath(); ctx.arc(W / 2, H * 0.8, 5, 0, Math.PI * 2); ctx.fill();

    // Goalkeeper
    const gkW = gw * 0.18, gkH = gh * 0.7;
    const gkX = goalieX !== undefined ? goalieX : W / 2 - gkW / 2;
    const gkY = gy + (gh - gkH) / 2;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(gkX, gkY, gkW, gkH);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(gkX + gkW * 0.2, gkY + gkH * 0.1, gkW * 0.6, gkH * 0.35);

    // Ball
    if (ballX !== undefined) {
      ctx.fillStyle = scored ? "#4ade80" : "#fff";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e293b";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚽", ballX, ballY);
    }
  }

  function renderZones() {
    const zonesEl = document.getElementById("pen-zones");
    if (!zonesEl) return;
    if (waiting) { zonesEl.innerHTML = ""; return; }
    const zones = [
      { label: "↖ Sol Üst",    col: 0 },
      { label: "⬆ Orta Üst",   col: 1 },
      { label: "↗ Sağ Üst",    col: 2 },
      { label: "← Sol Orta",   col: 3 },
      { label: "● Mərkəz",     col: 4 },
      { label: "→ Sağ Orta",   col: 5 },
      { label: "↙ Sol Alt",    col: 6 },
      { label: "⬇ Orta Alt",   col: 7 },
      { label: "↘ Sağ Alt",    col: 8 },
    ];
    zonesEl.innerHTML = zones.map((z, i) => `
      <button onclick="penaltyKick(${i})" style="
        padding:8px 4px; background:rgba(255,255,255,.08);
        border:1px solid rgba(255,255,255,.15); border-radius:6px;
        color:rgba(255,255,255,.8); font-size:.72rem; cursor:pointer;
        transition:all .2s; font-family:inherit;"
        onmouseover="this.style.background='rgba(0,61,165,.4)'"
        onmouseout="this.style.background='rgba(255,255,255,.08)'"
      >${z.label}</button>`).join("");
  }

  // Map zone index to canvas coordinates
  function zoneToCoords(zoneIdx) {
    const W = canvas.width, H = canvas.height;
    const gw = W * 0.7, gh = H * 0.5;
    const gx = (W - gw) / 2, gy = H * 0.1;
    const col = zoneIdx % 3;
    const row = Math.floor(zoneIdx / 3);
    const x = gx + (col + 0.5) * (gw / 3);
    const y = gy + (row + 0.5) * (gh / 3);
    return { x, y };
  }

  window.penaltyKick = function(zoneIdx) {
    if (waiting || kicks >= TOTAL_KICKS) return;
    waiting = true;
    kicks++;
    document.getElementById("pen-kicks").textContent = kicks;

    const W = canvas.width, H = canvas.height;
    const gw = W * 0.7;
    const gx = (W - gw) / 2;

    // Goalie picks a random zone (0-2 column) - goalie goes for one of the 3 col zones
    const goalieCol = Math.floor(Math.random() * 3);
    const goalieX = gx + goalieCol * (gw / 3);
    const targetCol = zoneIdx % 3;
    const targetRow = Math.floor(zoneIdx / 3);

    // Player scores if goalie col !== target col, or 30% chance even if same col
    const saved = (goalieCol === targetCol) && Math.random() < 0.7;
    const scored = !saved;

    if (scored) goals++;

    const { x: bx, y: by } = zoneToCoords(zoneIdx);
    drawGoal(goalieX, W / 2, H * 0.75, scored);

    const msgEl = document.getElementById("pen-msg");
    if (msgEl) {
      msgEl.textContent = scored ? "⚽ QOL!" : "✋ Tutuldu!";
      msgEl.style.color = scored ? "#4ade80" : "#f87171";
      msgEl.style.opacity = "1";
    }

    const inst = document.getElementById("pen-instruction");
    if (inst) inst.textContent = scored ? "🎉 Gol! Əla atış!" : "😤 Qapıçı tutdu!";

    // Animate ball
    let t = 0;
    function animBall() {
      if (t > 20) {
        drawGoal(goalieX, bx, by, scored);
        gpTimeouts.push(setTimeout(() => {
          if (msgEl) msgEl.style.opacity = "0";
          document.getElementById("pen-goals").textContent = goals;
          if (kicks >= TOTAL_KICKS) {
            const score = goals * 20;
            setGpScore(score);
            const statsHtml = `⚽ ${goals}/${TOTAL_KICKS} qol atıldı<br>🎯 Dəqiqlik: ${Math.round(goals/TOTAL_KICKS*100)}%`;
            gpTimeouts.push(setTimeout(() => showGameOver(score, statsHtml), 1000));
          } else {
            waiting = false;
            renderZones();
            if (inst) inst.textContent = "Növbəti atış üçün zona seçin";
            drawGoal();
          }
        }, 1200));
        return;
      }
      const progress = t / 20;
      const ballX = W / 2 + (bx - W / 2) * progress;
      const ballY = H * 0.75 + (by - H * 0.75) * progress;
      drawGoal(goalieX, ballX, ballY, false);
      t++;
      gpAnimFrame = requestAnimationFrame(animBall);
    }
    animBall();
    renderZones();
  };

  resizeCanvas();
  renderZones();
  const resizeObs = new ResizeObserver(resizeCanvas);
  resizeObs.observe(canvas.parentElement);
  gpGameState._cleanup = () => resizeObs.disconnect();
  setGpScore(0);
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 2: FOOTBALL QUIZ
// ══════════════════════════════════════════════════════════════
const QUIZ_QUESTIONS = [
  { q: "Dünya Çempionatını ən çox qazanan ölkə hansıdır?", opts: ["Argentina", "Braziliya", "Almaniya", "İtaliya"], a: 1 },
  { q: "Messi hansı kluba məxsusdur (karyerasının çox hissəsini keçirdiyi)?", opts: ["Real Madrid", "PSG", "Manchester City", "FC Barcelona"], a: 3 },
  { q: "UEFA Çempionlar Liqasını ən çox qazanan klub hansıdır?", opts: ["FC Barcelona", "Bayern München", "Real Madrid", "Liverpool"], a: 2 },
  { q: "İlk Dünya Çempionatı hansı ildə keçirildi?", opts: ["1930", "1924", "1938", "1950"], a: 0 },
  { q: "Ronaldonun tam adı nədir?", opts: ["Cristiano Ronaldo dos Santos Aveiro", "Ronaldo Luís Nazário de Lima", "Ronaldo da Costa", "Ronaldo Pereira"], a: 0 },
  { q: "Azərbaycan milli komandasının ləqəbi nədir?", opts: ["Miliyyətçilər", "Atəş Azərbaycanlılar", "Yaxın Şərqin Arslanları", "Şimşək Millisi"], a: 1 },
  { q: "\"Qızıl top\" (Ballon d'Or) ödülünü ən çox qazanan oyunçu kimdir?", opts: ["Ronaldo", "Messi", "Xavi", "Neuer"], a: 1 },
  { q: "Futbol qapısının eni neçə metrdir?", opts: ["6.4 m", "7.32 m", "8.0 m", "6.0 m"], a: 1 },
  { q: "Penalti nöqtəsindən qapıya məsafə neçə addımdır?", opts: ["11 metr", "12 metr", "10 metr", "9 metr"], a: 0 },
  { q: "Neftçi PFK hansı şəhərdən olan Azərbaycan komandasıdır?", opts: ["Gəncə", "Sumqayıt", "Bakı", "Lənkəran"], a: 2 },
  { q: "FIFA Dünya Çempionatında ən çox qol vuran oyunçu kimdir?", opts: ["Ronaldo (Braziliya)", "Miroslav Klose", "Gerd Müller", "Just Fontaine"], a: 1 },
  { q: "İlk Dünya Çempionatı hansı ölkədə keçirildi?", opts: ["Braziliya", "Uruguay", "Argentina", "İtaliya"], a: 1 },
  { q: "Premier Liqa il ərzində neçə komandadan ibarətdir?", opts: ["16", "18", "20", "22"], a: 2 },
  { q: "Zidane hansı ölkə üçün oynayıb?", opts: ["Əlcəzair", "Fransa", "Belçika", "Portuqaliya"], a: 1 },
  { q: "Maradona 1986-da hansı millisinin üzünə «Tanrının Əli» qolunu vurdu?", opts: ["Almaniya", "İngiltərə", "İtaliya", "Fransa"], a: 1 },
];

function startQuizGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  const questions = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
  let qIdx = 0, score = 0, answered = false, timerVal = 0, timerInterval;

  gameArea.innerHTML = `<div class="quiz-container" id="quiz-container"></div>`;

  function renderQuestion() {
    answered = false;
    const q = questions[qIdx];
    const qc = document.getElementById("quiz-container");
    if (!qc) return;
    timerVal = 20;

    qc.innerHTML = `
      <div class="quiz-progress">
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" id="q-prog" style="width:${(qIdx/questions.length)*100}%"></div></div>
        <span class="quiz-progress-text">${qIdx + 1}/${questions.length}</span>
        <span class="quiz-timer" id="q-timer">${timerVal}</span>
      </div>
      <div class="quiz-question">${escapeHTML(q.q)}</div>
      <div class="quiz-options" id="q-opts">
        ${q.opts.map((opt, i) => `
          <button class="quiz-option" onclick="quizAnswer(${i})">${escapeHTML(opt)}</button>
        `).join("")}
      </div>`;

    setGpScore(score);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (gpGameState._paused) return;
      timerVal--;
      const timerEl = document.getElementById("q-timer");
      if (timerEl) {
        timerEl.textContent = timerVal;
        timerEl.className = "quiz-timer" + (timerVal <= 5 ? " urgent" : "");
      }
      if (timerVal <= 0) {
        clearInterval(timerInterval);
        quizAnswer(-1); // timeout - wrong
      }
    }, 1000);
    gpIntervals.push(timerInterval);
  }

  window.quizAnswer = function(chosen) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const q = questions[qIdx];
    const correct = chosen === q.a;
    const timeBonus = correct ? Math.max(0, timerVal) : 0;
    const pts = correct ? 10 + timeBonus : 0;
    score += pts;
    setGpScore(score);

    const opts = document.querySelectorAll(".quiz-option");
    opts.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.a) btn.classList.add("correct");
      else if (i === chosen && !correct) btn.classList.add("wrong");
    });

    gpTimeouts.push(setTimeout(() => {
      qIdx++;
      if (qIdx < questions.length) {
        renderQuestion();
      } else {
        const statsHtml = `✅ Düzgün: ${Math.round(score / 10 - score % 10 / 10)}/${questions.length}<br>⭐ Ümumi xal: ${score}`;
        showGameOver(score, statsHtml);
      }
    }, 1200));
  };

  renderQuestion();
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 3: GOAL RUSH (Canvas click targets)
// ══════════════════════════════════════════════════════════════
function startGoalRushGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  gameArea.innerHTML = `
    <div style="width:100%;max-width:560px;padding:16px;color:#fff;text-align:center;position:relative;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="flex:1;height:8px;background:rgba(255,255,255,.1);border-radius:4px;overflow:hidden;">
          <div id="gr-timer-bar" style="height:100%;background:linear-gradient(90deg,#4ade80,#fcd34d,#f87171);width:100%;transition:width .1s linear;"></div>
        </div>
        <span id="gr-time" style="font-size:1rem;font-weight:700;color:#fcd34d;min-width:32px;">30</span>
      </div>
      <div id="gr-field" style="position:relative;width:100%;aspect-ratio:16/9;background:rgba(22,163,74,.25);border:2px solid rgba(22,163,74,.4);border-radius:8px;overflow:hidden;cursor:crosshair;">
        <canvas id="gr-canvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
      </div>
      <p style="margin-top:10px;font-size:.85rem;color:rgba(255,255,255,.5);">Topları tıklayın! 🎯</p>
    </div>`;

  const canvas = document.getElementById("gr-canvas");
  const ctx = canvas.getContext("2d");
  let targets = [], timeLeft = 30, score = 0, running = true;

  function resize() {
    const p = canvas.parentElement.getBoundingClientRect();
    canvas.width = p.width; canvas.height = p.height;
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  function spawnTarget() {
    const r = 28 + Math.random() * 16;
    const x = r + Math.random() * (canvas.width - r * 2);
    const y = r + Math.random() * (canvas.height - r * 2);
    targets.push({ x, y, r, born: Date.now(), life: 1800 + Math.random() * 800 });
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();
    targets = targets.filter(t => {
      const age = now - t.born;
      if (age > t.life) return false;
      const alpha = 1 - age / t.life;
      ctx.globalAlpha = Math.max(0.3, alpha);
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
      ctx.font = `${t.r * 1.2}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("⚽", t.x, t.y);
      ctx.globalAlpha = 1;
      return true;
    });
    gpAnimFrame = requestAnimationFrame(draw);
  }

  canvas.addEventListener("click", e => {
    if (!running || gpGameState._paused) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    let hit = false;
    targets = targets.filter(t => {
      const d = Math.hypot(mx - t.x, my - t.y);
      if (d <= t.r) { hit = true; return false; }
      return true;
    });
    if (hit) {
      score += 10;
      setGpScore(score);
      spawnTarget();
    }
  });

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mx = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const my = (touch.clientY - rect.top) * (canvas.height / rect.height);
    let hit = false;
    targets = targets.filter(t => {
      const d = Math.hypot(mx - t.x, my - t.y);
      if (d <= t.r) { hit = true; return false; }
      return true;
    });
    if (hit) {
      score += 10;
      setGpScore(score);
      spawnTarget();
    }
  }, { passive: false });

  // Spawn initial targets
  for (let i = 0; i < 4; i++) spawnTarget();

  // Timer
  const spawnId = gpSetInterval(() => { if (targets.length < 6) spawnTarget(); }, 800);

  const tickId = gpSetInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById("gr-time");
    const bar = document.getElementById("gr-timer-bar");
    if (timerEl) timerEl.textContent = timeLeft;
    if (bar) bar.style.width = `${(timeLeft / 30) * 100}%`;
    if (timeLeft <= 0) {
      running = false;
      showGameOver(score, `🎯 ${Math.round(score / 10)} top tutuldu<br>⚽ Ümumi xal: ${score}`);
    }
  }, 1000);

  draw();
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 4: GOALKEEPER
// ══════════════════════════════════════════════════════════════
function startGoalkeeperGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  gameArea.innerHTML = `
    <div style="width:100%;max-width:560px;position:relative;padding:16px;text-align:center;color:#fff;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="flex:1;height:8px;background:rgba(255,255,255,.1);border-radius:4px;overflow:hidden;">
          <div id="gk-timer-bar" style="height:100%;background:linear-gradient(90deg,#4ade80,#f87171);width:100%;transition:width .1s linear;"></div>
        </div>
        <span id="gk-time" style="font-size:1rem;font-weight:700;color:#fcd34d;min-width:32px;">45</span>
      </div>
      <div style="position:relative;width:100%;aspect-ratio:16/9;">
        <canvas id="gk-canvas" style="display:block;width:100%;height:100%;border-radius:8px;cursor:none;"></canvas>
        <div class="gk-instructions">Siçanı/barmağı hərəkət etdirin → Topları tutun</div>
      </div>
      <div style="margin-top:10px;font-size:.85rem;color:rgba(255,255,255,.5);">
        ✅ Tutuldu: <span id="gk-saved">0</span> &nbsp;|&nbsp; ❌ Buraxıldı: <span id="gk-missed">0</span>
      </div>
    </div>`;

  const canvas = document.getElementById("gk-canvas");
  const ctx = canvas.getContext("2d");
  let gkX = 0, timeLeft = 45, saved = 0, missed = 0, balls = [], running = true;

  function resize() {
    const p = canvas.parentElement;
    canvas.width = p.clientWidth;
    canvas.height = p.clientHeight;
    gkX = Math.max(0, Math.min(canvas.width - gkW(), canvas.width / 2 - gkW() / 2));
  }

  function gkW() { return canvas.width * 0.15; }
  function gkH() { return canvas.height * 0.12; }

  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    gkX = Math.max(0, Math.min(canvas.width - gkW(), mx - gkW() / 2));
  });
  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
    gkX = Math.max(0, Math.min(canvas.width - gkW(), mx - gkW() / 2));
  }, { passive: false });

  document.addEventListener("keydown", gkKeydown);
  function gkKeydown(e) {
    const step = canvas.width * 0.06;
    if (e.key === "ArrowLeft") gkX = Math.max(0, gkX - step);
    if (e.key === "ArrowRight") gkX = Math.min(canvas.width - gkW(), gkX + step);
  }
  gpGameState._cleanup = () => document.removeEventListener("keydown", gkKeydown);

  function spawnBall() {
    balls.push({
      x: 30 + Math.random() * (canvas.width - 60),
      y: -20,
      vx: (Math.random() - 0.5) * canvas.width * 0.02,
      vy: canvas.height * 0.015 + Math.random() * canvas.height * 0.01,
    });
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pitch background
    ctx.fillStyle = "rgba(22,163,74,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Goal at top
    const goalH = canvas.height * 0.1;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(canvas.width * 0.1, 0, canvas.width * 0.8, goalH);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width * 0.1, 0, canvas.width * 0.8, goalH);

    // Goalkeeper
    const gkY = canvas.height - gkH() - 10;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(gkX, gkY, gkW(), gkH());
    ctx.font = `${gkH() * 0.8}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🧤", gkX + gkW() / 2, gkY + gkH() / 2);

    // Balls
    const gkY2 = gkY;
    balls = balls.filter(b => {
      if (!gpGameState._paused) {
        b.x += b.vx; b.y += b.vy;
      }
      // Check if ball hits goalkeeper
      if (b.y + 15 >= gkY2 && b.x >= gkX - 10 && b.x <= gkX + gkW() + 10) {
        saved++;
        document.getElementById("gk-saved").textContent = saved;
        setGpScore(saved * 10);
        return false;
      }
      // Check if ball missed (went off screen)
      if (b.y > canvas.height + 20) {
        missed++;
        document.getElementById("gk-missed").textContent = missed;
        return false;
      }
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("⚽", b.x, b.y);
      return true;
    });

    gpAnimFrame = requestAnimationFrame(draw);
  }

  const spawnId = gpSetInterval(() => {
    if (balls.length < 4) spawnBall();
  }, 1200);

  const tickId = gpSetInterval(() => {
    timeLeft--;
    const te = document.getElementById("gk-time");
    const bar = document.getElementById("gk-timer-bar");
    if (te) te.textContent = timeLeft;
    if (bar) bar.style.width = `${(timeLeft / 45) * 100}%`;
    if (timeLeft <= 0) {
      running = false;
      const score = saved * 10;
      showGameOver(score, `✅ Tutuldu: ${saved}<br>❌ Buraxıldı: ${missed}<br>📊 Uğur: ${Math.round(saved/(saved+missed||1)*100)}%`);
    }
  }, 1000);

  draw();
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 5: SPRINT
// ══════════════════════════════════════════════════════════════
function startSprintGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  let clicks = 0, goals = 0, timeLeft = 15, running = true, progress = 0;
  const TARGET_CLICKS = 30;

  gameArea.innerHTML = `
    <div class="sprint-container" id="sprint-ui">
      <div style="font-size:.9rem;color:rgba(255,255,255,.6);margin-bottom:12px;">
        ⚽ Qol: <strong id="sp-goals" style="color:#fcd34d;">0</strong> &nbsp;|&nbsp;
        🖱️ Tıklama: <span id="sp-clicks">0</span>
      </div>
      <div class="sprint-field">
        <span class="sprint-player" id="sp-player" style="left:2%;">🏃</span>
        <span class="sprint-goal">🥅</span>
      </div>
      <div class="sprint-timer-bar">
        <div class="sprint-timer-fill" id="sp-tbar" style="width:100%;"></div>
      </div>
      <div class="sprint-stats">Vaxt: <span id="sp-time" style="font-weight:700;color:#fcd34d;">15</span>s qalıb</div>
      <button class="sprint-click-btn" id="sp-btn" onclick="sprintClick()" ontouchstart="event.preventDefault();sprintClick()">⚽</button>
      <p style="margin-top:12px;font-size:.8rem;color:rgba(255,255,255,.4);">SPACE düyməsi də işləyir</p>
    </div>`;

  window.sprintClick = function() {
    if (!running || gpGameState._paused) return;
    clicks++;
    document.getElementById("sp-clicks").textContent = clicks;
    progress = Math.min(100, (clicks % TARGET_CLICKS) / TARGET_CLICKS * 100);
    const player = document.getElementById("sp-player");
    if (player) player.style.left = `${2 + progress * 0.82}%`;

    if (clicks > 0 && clicks % TARGET_CLICKS === 0) {
      goals++;
      document.getElementById("sp-goals").textContent = goals;
      setGpScore(goals * 20);
      const player2 = document.getElementById("sp-player");
      if (player2) player2.textContent = "⚽";
      gpTimeouts.push(setTimeout(() => {
        if (player2) player2.textContent = "🏃";
      }, 400));
    }
  };

  function spaceHandler(e) {
    if (e.code === "Space") { e.preventDefault(); sprintClick(); }
  }
  document.addEventListener("keydown", spaceHandler);
  gpGameState._cleanup = () => document.removeEventListener("keydown", spaceHandler);

  const tickId = gpSetInterval(() => {
    timeLeft--;
    const te = document.getElementById("sp-time");
    const bar = document.getElementById("sp-tbar");
    if (te) te.textContent = timeLeft;
    if (bar) bar.style.width = `${(timeLeft / 15) * 100}%`;
    if (timeLeft <= 0) {
      running = false;
      const score = goals * 20;
      showGameOver(score, `⚽ ${goals} qol atıldı<br>🖱️ ${clicks} tıklama<br>⚡ Sürət: ${Math.round(clicks / 15)} tık/saniyə`);
    }
  }, 1000);
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 6: SCORE PREDICTOR
// ══════════════════════════════════════════════════════════════
const PREDICTOR_MATCHES = [
  { home: "Qarabağ 🇦🇿", away: "Neftçi 🇦🇿",   hr: 2, ar: 1 },
  { home: "Barcelona 🇪🇸", away: "Real Madrid 🇪🇸", hr: 2, ar: 2 },
  { home: "Bayern 🇩🇪",    away: "Dortmund 🇩🇪",  hr: 3, ar: 1 },
  { home: "Liverpool 🏴󠁧󠁢󠁥󠁮󠁧󠁿", away: "Man City 🏴󠁧󠁢󠁥󠁮󠁧󠁿",  hr: 1, ar: 1 },
  { home: "PSG 🇫🇷",       away: "Marseille 🇫🇷", hr: 3, ar: 0 },
];

function startPredictorGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  gameArea.innerHTML = `
    <div class="predictor-container" id="pred-ui">
      <h3 style="text-align:center;margin-bottom:16px;font-size:1rem;color:rgba(255,255,255,.7);">📊 5 Oyun Üçün Hesab Proqnozu</h3>
      ${PREDICTOR_MATCHES.map((m, i) => `
        <div class="predictor-match">
          <div class="predictor-match-header">${escapeHTML(m.home)} vs ${escapeHTML(m.away)}</div>
          <div class="predictor-match-body">
            <div class="predictor-team">${escapeHTML(m.home)}</div>
            <div class="predictor-score-input">
              <input type="number" id="pred-h-${i}" min="0" max="20" value="0" aria-label="${escapeHTML(m.home)} qol">
              <span class="predictor-score-sep">–</span>
              <input type="number" id="pred-a-${i}" min="0" max="20" value="0" aria-label="${escapeHTML(m.away)} qol">
            </div>
            <div class="predictor-team">${escapeHTML(m.away)}</div>
          </div>
        </div>`).join("")}
      <button class="predictor-submit-btn" onclick="submitPredictions()">📊 Proqnozu Yoxla</button>
    </div>`;

  window.submitPredictions = function() {
    let score = 0;
    let correct = 0, exact = 0;
    let html = "<div style='font-size:.82rem;line-height:2;'>";

    PREDICTOR_MATCHES.forEach((m, i) => {
      const ph = parseInt(document.getElementById(`pred-h-${i}`)?.value || 0);
      const pa = parseInt(document.getElementById(`pred-a-${i}`)?.value || 0);
      const isExact = ph === m.hr && pa === m.ar;
      const predResult = ph > pa ? "h" : ph < pa ? "a" : "d";
      const realResult = m.hr > m.ar ? "h" : m.hr < m.ar ? "a" : "d";
      const isCorrect = predResult === realResult;

      if (isExact) { score += 10; exact++; }
      else if (isCorrect) { score += 5; correct++; }

      html += `<div>${escapeHTML(m.home)} vs ${escapeHTML(m.away)}: 
        Proqnoz <strong>${ph}–${pa}</strong> → Nəticə <strong>${m.hr}–${m.ar}</strong> 
        ${isExact ? "✅ Dəqiq! +10" : isCorrect ? "☑️ Düzgün nəticə +5" : "❌ Yanlış +0"}</div>`;
    });
    html += "</div>";

    setGpScore(score);
    showGameOver(score, `🎯 Dəqiq hesab: ${exact}/5<br>☑️ Düzgün nəticə: ${correct}/5<br>${html}`);
  };
}

// ══════════════════════════════════════════════════════════════
//  GAME ENGINE 7: TACTICS
// ══════════════════════════════════════════════════════════════
function startTacticsGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  const formations = [
    { name: "4-4-2", attack: 6, defense: 7 },
    { name: "4-3-3", attack: 8, defense: 5 },
    { name: "3-5-2", attack: 7, defense: 6 },
    { name: "4-5-1", attack: 5, defense: 8 },
    { name: "5-3-2", attack: 5, defense: 9 },
  ];
  const attackStyles = [
    { name: "Kontrataka", bonus: 1 },
    { name: "Possesion", bonus: 2 },
    { name: "Birbaşa",    bonus: 0 },
  ];
  const defenseStyles = [
    { name: "Yüksək pres", bonusD: 1, risk: 2 },
    { name: "Alçaq blok",  bonusD: 3, risk: 0 },
    { name: "Qarışıq",     bonusD: 2, risk: 1 },
  ];

  let selForm = 0, selAtt = 0, selDef = 0;

  function renderTactics() {
    const ui = document.getElementById("tact-ui");
    if (!ui) return;

    ["tact-form", "tact-att", "tact-def"].forEach(id => {
      const btn = ui.querySelectorAll(`[data-group="${id}"]`);
      btn.forEach(b => b.classList.remove("active"));
    });

    ui.querySelectorAll(`[data-group="tact-form"]`)[selForm]?.classList.add("active");
    ui.querySelectorAll(`[data-group="tact-att"]`)[selAtt]?.classList.add("active");
    ui.querySelectorAll(`[data-group="tact-def"]`)[selDef]?.classList.add("active");
  }

  gameArea.innerHTML = `
    <div id="tact-ui" style="width:100%;max-width:520px;padding:16px;color:#fff;">
      <p style="text-align:center;font-size:.85rem;color:rgba(255,255,255,.6);margin-bottom:16px;">Taktikanızı seçin və matç simulyasiyasını başladın</p>

      <div style="margin-bottom:14px;">
        <div style="font-size:.8rem;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">⚙️ Formasyon</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${formations.map((f, i) => `
            <button data-group="tact-form" onclick="selectTactic('form',${i})" style="
              padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.07);color:#fff;font-family:inherit;font-size:.85rem;cursor:pointer;
              transition:all .2s;" class="${i===0?'active':''}">${escapeHTML(f.name)}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-size:.8rem;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">⚔️ Hücum Tərzi</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${attackStyles.map((a, i) => `
            <button data-group="tact-att" onclick="selectTactic('att',${i})" style="
              padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.07);color:#fff;font-family:inherit;font-size:.85rem;cursor:pointer;
              transition:all .2s;" class="${i===0?'active':''}">${escapeHTML(a.name)}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <div style="font-size:.8rem;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">🛡️ Müdafiə Strategiyası</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${defenseStyles.map((d, i) => `
            <button data-group="tact-def" onclick="selectTactic('def',${i})" style="
              padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.07);color:#fff;font-family:inherit;font-size:.85rem;cursor:pointer;
              transition:all .2s;" class="${i===0?'active':''}">${escapeHTML(d.name)}</button>`).join("")}
        </div>
      </div>

      <button onclick="simulateMatch()" style="
        width:100%;padding:14px;background:linear-gradient(135deg,#003DA5,#CE1126);
        color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:700;
        font-family:inherit;cursor:pointer;transition:transform .2s;"
        onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
        ⚽ Matçı Başlat
      </button>
    </div>`;

  // Highlight active buttons
  const styleEl = document.createElement("style");
  styleEl.textContent = `[data-group].active { background:rgba(0,61,165,.5) !important; border-color:rgba(0,122,210,.6) !important; }`;
  document.head.appendChild(styleEl);
  gpGameState._styleCleanup = () => styleEl.remove();

  window.selectTactic = function(type, idx) {
    if (type === "form") selForm = idx;
    else if (type === "att") selAtt = idx;
    else if (type === "def") selDef = idx;
    renderTactics();
  };

  window.simulateMatch = function() {
    const f = formations[selForm];
    const a = attackStyles[selAtt];
    const d = defenseStyles[selDef];

    let attackStrength = f.attack + a.bonus;
    let defenseStrength = f.defense + d.bonusD - d.risk;

    // Simulate match vs random opponent
    const oppAttack = 5 + Math.floor(Math.random() * 5);
    const oppDefense = 4 + Math.floor(Math.random() * 5);

    const myGoals = Math.max(0, Math.floor(attackStrength / 2 + Math.random() * 3 - oppDefense / 3));
    const oppGoals = Math.max(0, Math.floor(oppAttack / 2 + Math.random() * 2 - defenseStrength / 3));

    let resultText = myGoals > oppGoals ? "🏆 Qalibiyyət!" : myGoals === oppGoals ? "🤝 Bərabərlik" : "💔 Məğlubiyyət";
    let score = myGoals > oppGoals ? 100 : myGoals === oppGoals ? 50 : 20;
    score += (myGoals * 5);

    setGpScore(score);
    const statsHtml = `${resultText}<br>📊 Hesab: <strong>${myGoals} – ${oppGoals}</strong><br>
      ⚙️ ${escapeHTML(f.name)} | ⚔️ ${escapeHTML(a.name)} | 🛡️ ${escapeHTML(d.name)}<br>
      💪 Hücum gücü: ${attackStrength} | 🛡️ Müdafiə gücü: ${defenseStrength}`;
    showGameOver(score, statsHtml);
    if (gpGameState._styleCleanup) gpGameState._styleCleanup();
  };
}

// ─────────────────────────────── Intersection Observer ───────────────────────
function setupNavObserver() {
  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) updateActiveNav(entry.target.id);
    });
  }, { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" });
  sections.forEach(s => observer.observe(s));
}

// ─────────────────────────────── Init ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  loadState();
  renderGames();
  renderTopGames();
  renderNewGames();
  renderCategories();
  renderHeroStats();
  updateSubscriberCount();
  setupNavObserver();
});
