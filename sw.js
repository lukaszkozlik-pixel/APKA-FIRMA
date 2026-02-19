const CACHE_NAME = 'instalator-v2.1.1';

const ASSETS = [
  'index.html',
  'style.css',
  'manifest.json',
  'tools-src/bibliotekaDVBT.html',
  'tools-src/bibliotekaSAT.html',
  'tools-src/cennik.html',
  'tools-src/instrukcje.html',
  'tools-src/internet.html',
  'tools-src/Jednostki.html',
  'tools-src/nadajniki.html',
  'tools-src/notatki.html',
  'tools-src/raporty.html',
  'tools-src/satelity.html',
  'tools-src/docs/czestotliwosciDVBT.html',
  'tools-src/docs/kolorySat.html',
  'tools-src/docs/KonstelacjaDVbt2.html',
  'tools-src/docs/KonstelacjaSat.html',
  'tools-src/docs/muxy.html',
  'tools-src/docs/Parametry-DVB-t.html',
  'tools-src/docs/ParametrySAT.html',
  'tools-src/docs/UnicablePB.html'
];

// Instalacja - po prostu zapełniamy cache na start
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Aktywacja - czyszczenie starych wersji
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// KLUCZ: Strategia Network-First
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Mamy internet! Pobieramy nową wersję i aktualizujemy cache "w locie"
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Brak internetu - ratujemy się tym, co mamy w pamięci
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response("Brak sieci i brak danych w pamięci", { status: 503 });
        });
      })
  );
});