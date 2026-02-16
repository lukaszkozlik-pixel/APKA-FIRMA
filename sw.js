const CACHE_NAME = 'instalator-v1.6.0';
const ASSETS = [
  'index.html',
  'style.css',
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

// 1. INSTALACJA - Pobieranie plików do cache
self.addEventListener('install', (event) => {
  // Wymuś na nowym Service Workerze, by stał się aktywny od razu (bez czekania na zamknięcie apki)
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Buforowanie zasobów aplikacji');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. AKTYWACJA - Czyszczenie starych wersji plików
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Jeśli znaleziono stary cache (inna wersja niż CACHE_NAME), usuń go
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Usuwanie starego cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Przejmij kontrolę nad wszystkimi otwartymi kartami aplikacji natychmiast
      return self.clients.claim();
    })
  );
});

// 3. OBSŁUGA ŻĄDAŃ (Fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Zwróć plik z cache lub pobierz z sieci
      return response || fetch(event.request);
    })
  );
});