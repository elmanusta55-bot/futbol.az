"use strict";

const NEWS_FILTERS = [
  { key: "all", label: "Hamısı" },
  { key: "pl", label: "Premier League" },
  { key: "pd", label: "La Liga" },
  { key: "aze", label: "Azərbaycan" },
];

let allArticles = [];
let activeFilter = "all";

function esc(v) {
  return String(v ?? "").replace(/[&<>'"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function toLowerText(article) {
  return `${article.title || ""} ${article.description || ""}`.toLowerCase();
}

function filterArticles(articles, filterKey) {
  if (filterKey === "all") return articles;
  return articles.filter((article) => {
    const text = toLowerText(article);
    if (filterKey === "pl") return text.includes("premier") || text.includes("epl");
    if (filterKey === "pd") return text.includes("la liga") || text.includes("spaniya") || text.includes("ispanya");
    if (filterKey === "aze") return text.includes("azərbaycan") || text.includes("azerbaijan") || text.includes("qarabağ");
    return true;
  });
}

function renderFilters() {
  const wrap = document.getElementById("news-filters");
  if (!wrap) return;

  wrap.innerHTML = NEWS_FILTERS.map((f) =>
    `<button class="filter-btn ${f.key === activeFilter ? "active" : ""}" data-key="${f.key}">${esc(f.label)}</button>`
  ).join("");

  wrap.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.key;
      renderFilters();
      renderNews();
    });
  });
}

function renderNews() {
  const grid = document.getElementById("news-grid");
  const msg = document.getElementById("news-msg");
  if (!grid) return;

  const filtered = filterArticles(allArticles, activeFilter);

  if (!filtered.length) {
    grid.innerHTML = "";
    if (msg) msg.textContent = "Bu filtr üzrə xəbər tapılmadı.";
    return;
  }

  grid.innerHTML = filtered.map((item) => {
    const img = item.urlToImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=60";
    const date = item.publishedAt ? new Date(item.publishedAt).toLocaleString("az-AZ") : "";
    return `<article class="news-card">
      <img src="${esc(img)}" alt="${esc(item.title)}" loading="lazy" onerror="this.style.display='none'">
      <div class="news-body">
        <div class="news-title">${esc(item.title)}</div>
        <div class="news-meta">${esc(item.source || "Naməlum")}${date ? ` · ${esc(date)}` : ""}</div>
        <a class="news-link" href="${esc(item.url || "#")}" target="_blank" rel="noopener noreferrer">Oxu →</a>
      </div>
    </article>`;
  }).join("");

  if (msg) msg.textContent = "";
}

async function init() {
  const msg = document.getElementById("news-msg");
  renderFilters();

  try {
    const res = await fetch("/api/news");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Xəta");

    allArticles = Array.isArray(data?.articles) ? data.articles : [];
    renderNews();
    if (msg && data?.source === "mock") msg.textContent = "NewsAPI açarı yoxdur, mock xəbərlər göstərilir.";
  } catch (err) {
    if (msg) msg.textContent = `Xəbərlər yüklənmədi: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", init);
