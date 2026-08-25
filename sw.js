const CACHE_NAME = 'cadsaude-cache-v26';
const FILES_TO_CACHE = [
  './index.html',
  './cadastros.html',
  './hipertensos.html',
  './diabeticos.html',
  './ambos.html',
  './acamados.html',
  './total-geral.html',
  './dados.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Nunca intercepta navegação entre páginas (cliques em links) —
  // deixa o navegador cuidar disso normalmente, sem risco de travar.
  if (event.request.mode === 'navigate') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
