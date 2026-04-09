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
};

// ─────────────────────────────── localStorage Helpers ─────────────────────────
const LS_KEYS = {
  favorites: "faz_favorites",
  ratings:   "faz_ratings",
  comments:  "faz_comments",
  newsletter:"faz_newsletter",
  theme:     "faz_theme",
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
          <button class="play-btn" onclick="event.stopPropagation(); openGameDetail(${g.id})"
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
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // Scroll modal to top
    const box = document.getElementById("modal-box");
    if (box) box.scrollTop = 0;
  }
}

function closeModal() {
  const modal = document.getElementById("game-modal");
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
}

function playGame(gameId) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;
  showToast(`🎮 ${game.title} başlanır…`);
  setTimeout(() => {
    showToast(`▶️ ${game.title} oynanır!`);
  }, 1000);
}

// Modal close on overlay click
document.addEventListener("click", e => {
  const modal = document.getElementById("game-modal");
  if (modal && e.target === modal) closeModal();
});

// Modal close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
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
