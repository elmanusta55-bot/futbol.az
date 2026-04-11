const STATIC_CACHE = 'futbol-az-static-v3';
const API_CACHE = 'futbol-az-api-v3';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/live.html',
  '/draft.html',
  '/privacy.html',
  '/terms.html',
  '/who-are-ya.html',
  '/standings.html',
  '/top-scorers.html',
  '/teams.html',
  '/fixtures.html',
  '/profile.html',
  '/styles.css',
  '/platform.css',
  '/live-matches.css',
  '/draft.css',
  '/games.css',
  '/standings.css',
  '/top-scorers.css',
  '/teams.css',
  '/fixtures.css',
  '/games.js',
  '/platform.js',
  '/consent.js',
  '/notifications.js',
  '/i18n.js',
  '/pages-common.js',
  '/standings.js',
  '/top-scorers.js',
  '/teams.js',
  '/fixtures.js',
  '/manifest.webmanifest',
  '/og-image.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== API_CACHE) return caches.delete(key);
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(STATIC_CACHE);
  cache.put(request, response.clone());
  return response;
}

async function networkFirstApi(request) {
  const cache = await caches.open(API_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL);
        return cached || caches.match('/index.html');
      })
    );
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstApi(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch {}
  const title = payload.title || 'Futbol.az';
  const options = {
    body: payload.body || 'Yeni futbol yeniləməsi var.',
    icon: payload.icon || '/logo.png',
    data: { url: payload.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification?.data?.url || '/';
  event.waitUntil(clients.openWindow(target));
});
