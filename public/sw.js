const CACHE_NAME = 'futbol-az-shell-v2';
const SHELL_URLS = [
  '/',
  '/index.html',
  '/live.html',
  '/draft.html',
  '/privacy.html',
  '/terms.html',
  '/who-are-ya.html',
  '/styles.css',
  '/live-matches.css',
  '/draft.css',
  '/platform.css',
  '/app.js',
  '/live.js',
  '/draft.js',
  '/draft-core.js',
  '/consent.js',
  '/manifest.webmanifest',
  '/og-image.svg',
  '/data/players.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
