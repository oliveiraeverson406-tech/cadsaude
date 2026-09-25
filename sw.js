const CACHE_NAME = 'meu-site-v8';

const URLS_PARA_CACHEAR = [
  './',
  './index.html',
  './cadastros.html',
  './acamados.html',
  './ambos.html',
  './diabeticos.html',
  './hipertensos.html',
  './total-geral.html',
  './dados.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        URLS_PARA_CACHEAR.map((url) =>
          cache.add(url).catch(() => {}) // se algum recurso falhar, não trava o resto
        )
      );
    })
  );
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((respostaCache) => {
      if (respostaCache) return respostaCache;
      return fetch(event.request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          return resposta;
        })
        .catch(() => respostaCache);
    })
  );
});
