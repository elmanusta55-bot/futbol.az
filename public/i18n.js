"use strict";

(function () {
  const KEY = "futbol_lang";
  const dict = {
    az: {
      navHome: "🏠 Ana Səhifə", navMatchCenter: "⚡ Matç Mərkəzi", navTop10: "🔥 Top 10", navCategories: "📂 Kateqoriyalar",
      heroBadge: "🏆 #1 Futbol Platforması", heroSubtitle: "Azərbaycanın ən böyük futbol oyunları platforması. Oynayın, reytinq verin, rəqiblərinizi keçin!",
      heroPlay: "🎮 İndi Oyna", heroTop: "🔥 Top Oyunlar", secGames: "🎮 Bütün Oyunlar", secTop: "🔥 Top 10 Oyun", secCats: "📂 Kateqoriyalar",
      catAll: "Hamısı", catAction: "🎯 Aksiya", catStrategy: "♟️ Strateji", catSport: "⚽ Spor", catQuiz: "🧠 Viktorina", catFav: "❤️ Favorilər",
      modalSend: "💬 Göndər", modalPlay: "▶️ Oyna"
    },
    en: {
      navHome: "🏠 Home", navMatchCenter: "⚡ Match Center", navTop10: "🔥 Top 10", navCategories: "📂 Categories",
      heroBadge: "🏆 #1 Football Platform", heroSubtitle: "Azerbaijan's largest football games platform. Play, rate and beat your rivals!",
      heroPlay: "🎮 Play Now", heroTop: "🔥 Top Games", secGames: "🎮 All Games", secTop: "🔥 Top 10 Games", secCats: "📂 Categories",
      catAll: "All", catAction: "🎯 Action", catStrategy: "♟️ Strategy", catSport: "⚽ Sports", catQuiz: "🧠 Quiz", catFav: "❤️ Favorites",
      modalSend: "💬 Send", modalPlay: "▶️ Play"
    },
    ru: {
      navHome: "🏠 Главная", navMatchCenter: "⚡ Матч-центр", navTop10: "🔥 Топ 10", navCategories: "📂 Категории",
      heroBadge: "🏆 #1 Футбольная Платформа", heroSubtitle: "Крупнейшая футбольная игровая платформа Азербайджана. Играйте и побеждайте!",
      heroPlay: "🎮 Играть", heroTop: "🔥 Топ Игры", secGames: "🎮 Все Игры", secTop: "🔥 Топ 10 Игр", secCats: "📂 Категории",
      catAll: "Все", catAction: "🎯 Экшен", catStrategy: "♟️ Стратегия", catSport: "⚽ Спорт", catQuiz: "🧠 Викторина", catFav: "❤️ Избранное",
      modalSend: "💬 Отправить", modalPlay: "▶️ Играть"
    }
  };

  function apply(lang) {
    const t = dict[lang] || dict.az;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
    localStorage.setItem(KEY, lang);
  }

  function init() {
    const select = document.getElementById("lang-select");
    if (!select) return;
    const lang = localStorage.getItem(KEY) || "az";
    select.value = lang;
    apply(lang);
    select.addEventListener("change", (e) => apply(e.target.value));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
