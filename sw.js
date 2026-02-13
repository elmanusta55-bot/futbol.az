self.addEventListener('install', (e) => {
  console.log('[Service Worker] Quraşdırıldı');
});

self.addEventListener('fetch', (e) => {
  // PWA olaraq qəbul edilməsi üçün bu hissə vacibdir
});

