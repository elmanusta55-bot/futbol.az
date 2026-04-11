"use strict";

(function () {
  const THEME_KEY = "faz_theme";

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = saved === "dark" ? "🌙" : "☀️";
  }

  window.toggleTheme = function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = next === "dark" ? "🌙" : "☀️";
  };

  window.toggleMobileMenu = function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const btn = document.getElementById("hamburger");
    if (!menu || !btn) return;
    const hidden = !menu.hidden;
    menu.hidden = hidden;
    btn.setAttribute("aria-expanded", String(!hidden));
  };

  window.closeMobileMenu = function closeMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const btn = document.getElementById("hamburger");
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  };

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    document.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });
  });
})();
