const CACHE_NAME = 'instalator-v1';
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
  'tools-src/doc/czestotliwoscidvbt.html',
  'tools-src/doc/kolorySAT.html',
  'tools-src/doc/muxy.html',
  'tools-src/doc/Parametry-DVB-t.html',
  'tools-src/doc/ParametrySAT.html',
  'tools-src/doc/UnicablePB.html'
];

// Instalacja i zapisywanie plików do pamięci cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Obsługa zapytań - najpierw sprawdź cache, potem sieć
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});