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

// Pobieranie wersji z manifest.json
async function getVersionFromManifest() {
  try {
    const response = await fetch('manifest.json', { cache: 'no-store' });
    const manifest = await response.json();
    return manifest.version || '1.0.0';
  } catch (err) {
    console.warn('SW: Nie mogę pobrać wersji z manifest.json:', err);
    return '1.0.0';
  }
}

function getCacheName(version) {
  return `instalator-v${version}`;
}

let CACHE_NAME = 'instalator-unknown';

// 1. INSTALACJA - Pobieranie plików do cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    getVersionFromManifest().then(version => {
      CACHE_NAME = getCacheName(version);
      console.log(`SW: Instalacja - używam cache ${CACHE_NAME}`);
      
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS).catch(err => {
          console.warn('SW: Nie wszystkie pliki się zabuforowały (może być OK):', err);
          return Promise.all(
            ASSETS.map(url => 
              cache.add(url).catch(e => console.warn(`SW: Nie mogę bufować ${url}`, e))
            )
          );
        });
      });
    })
  );
});

// 2. AKTYWACJA - Czyszczenie starych wersji cache'u
self.addEventListener('activate', (event) => {
  event.waitUntil(
    getVersionFromManifest().then(version => {
      CACHE_NAME = getCacheName(version);
      
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('instalator-v')) {
              console.log('SW: Usuwanie starego cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => {
        console.log(`SW: Aktywacja - cache ${CACHE_NAME} jest aktualny`);
        return self.clients.claim();
      });
    })
  );
});

// 3. OBSŁUGA ŻĄDAŃ - Network first dla HTML, Cache first dla statycznych zasobów
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignoruj zewnętrzne żądania (Google, itp.)
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // HTML - zawsze staramy się pobrać z sieci, fallback do cache'u
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          // Buforuj nową wersję w tle
          const cache_promise = caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
          return response;
        }
        return caches.match(event.request) || response;
      }).catch(() => {
        return caches.match(event.request) || new Response('Offline - plik nie znaleziony', { status: 404 });
      })
    );
    return;
  }

  // CSS, JS, obrazy - Cache first, fallback do sieci
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(response => {
        if (response.ok) {
          const cache_promise = caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      }).catch(() => {
        return new Response('Offline - zasób niedostępny', { status: 404 });
      });
    })
  );
});

// 4. KOMUNIKACJA Z KLIENTAMI - Powiadomienie o dostępności aktualizacji
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Sprawdzenie czy dostępna jest nowa wersja
    const newCacheName = generateCacheName();
    if (newCacheName !== CACHE_NAME) {
      console.log('SW: Dostępna nowa wersja, informowanie klientów');
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            newCacheName: newCacheName
          });
        });
      });
    }
  }
});