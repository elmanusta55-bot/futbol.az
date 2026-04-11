/**
 * Futbol.az – Cookie Consent Banner
 * Stores choice in localStorage under key 'futbolaz_consent'
 * Values: 'accepted' | 'declined'
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'futbolaz_consent';

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function removeBanner(banner) {
    banner.classList.add('consent-banner--hide');
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  function createBanner() {
    var banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Kuki razılığı');
    banner.innerHTML =
      '<div class="consent-banner__inner">' +
        '<div class="consent-banner__text">' +
          '<span class="consent-banner__icon">🍪</span>' +
          '<p>Saytımız xidməti təkmilləşdirmək və Google AdSense reklamlarını göstərmək üçün kukilərdən istifadə edir. ' +
          'Ətraflı məlumat üçün <a href="/privacy.html">Məxfilik Siyasəti</a>nə baxın.</p>' +
        '</div>' +
        '<div class="consent-banner__actions">' +
          '<button class="consent-btn consent-btn--accept" id="consent-accept">✓ Qəbul et</button>' +
          '<button class="consent-btn consent-btn--decline" id="consent-decline">✕ Rədd et</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('consent-accept').addEventListener('click', function () {
      setConsent('accepted');
      removeBanner(banner);
    });

    document.getElementById('consent-decline').addEventListener('click', function () {
      setConsent('declined');
      removeBanner(banner);
    });
  }

  function init() {
    if (getConsent()) return; // already chose
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  init();
  registerServiceWorker();
})();
