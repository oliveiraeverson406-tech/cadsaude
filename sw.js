const CACHE_NAME = 'meu-site-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Apaga apenas os caches antigos
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});
