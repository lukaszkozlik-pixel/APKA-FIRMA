## Instalator Pro — narzędzia dla instalatora


Krótki opis
- Statyczna aplikacja webowa (HTML/CSS/JS) z narzędziami dla instalatorów DVB‑T / SAT.
- PWA-friendly: manifest + service worker do cache'owania zasobów.
- Motyw jasny/ciemny przełączany globalnie na wszystkich podstronach (CSS variables + localStorage/system theme).

Struktura projektu (ważniejsze pliki)
- `index.html` — strona główna aplikacji
- `style.css` — główny styl
- `sw.js` — Service Worker (lista `ASSETS`, `CACHE_NAME`)
- `manifest.json` — manifest PWA (pole `version` używane do wyświetlenia wersji)
- `tools-src/` — narzędzia i dokumentacja (m.in. `bibliotekaSAT.html`, `bibliotekaDVBT.html`)
- `tools-src/docs/` — podstrony/artykuły i interaktywne konstelacje

## Motyw jasny

- Motyw aplikacji jest zawsze jasny na wszystkich stronach i narzędziach.
- Styl oparty o CSS custom properties (`--bg`, `--text`, `--tile-bg`, `--tile-border`, `--tile-shadow`).
- Każda podstrona ładuje `style.css`.

Szybkie uruchomienie lokalne
1. Otwórz katalog projektu w terminalu.
2. Uruchom prosty serwer (w środowisku, gdzie dostępny jest `python3`):
```bash
python3 -m http.server 8000
```
3. Otwórz w przeglądarce: `http://localhost:8000`

Uwagi dotyczące PWA / SW
- `sw.js` zawiera listę plików do cache; upewnij się, że wszystkie wymienione pliki istnieją w repo.
- `CACHE_NAME` w `sw.js` i pole `version` w `manifest.json` powinny być spójne z wersją wydania.
- Aby przetestować aktualizacje SW: otwórz DevTools → Application → Service Workers.

## Automatyczna aktualizacja (od 2.0.0)

- Service Worker automatycznie wykrywa zmianę wersji w `manifest.json` i pobiera nowe pliki do cache.
- Użytkownik otrzymuje powiadomienie o nowej wersji (przycisk "ODŚWIEŻ").
- Po kliknięciu "ODŚWIEŻ" aplikacja przeładowuje się z nowymi plikami.
- Nie trzeba ręcznie czyścić cache ani pamięci aplikacji.

Funkcjonalności istotne dla dewelopera
- Reset aplikacji: ukryty mechanizm — kliknij stopkę 5×, potwierdź, aby usunąć cache i `localStorage`.
- Automatyczna wersja w stopce: `index.html` odczytuje `manifest.json.version` lub parsuje `sw.js`.
- Konstelacje i instrukcje: narzędzia znajdują się w `tools-src/docs/` i są samodzielnymi stronami.

---

- Globalny motyw jasny na wszystkich stronach (CSS variables, import `style.css`)
- Uproszczona automatyczna aktualizacja PWA (Service Worker + manifest)
- Uporządkowanie stylów i kodu pod kątem spójności motywu jasnego

Generowanie grafiki schematu (opcjonalne)
- Skrypt używa Pillow (Python). Przykładowe komendy (z repo):
```bash
# (opcjonalnie) utwórz virtualenv i zainstaluj Pillow
python3 -m venv .venv
. .venv/bin/activate
pip install Pillow
python tools-src/scripts/generate_schemat_png.py
```
- Wygenerowany plik zapisywany jest w `tools-src/assets/` (jeśli użyty).

Przepływ pracy i commitowanie
- Zmiany: `git add -A && git commit -m "..." && git push`.
- Przy wydaniu: zaktualizuj `manifest.json.version` oraz (opcjonalnie) `CACHE_NAME` w `sw.js`.

Testy manualne rekomendowane
- Otwórz aplikację lokalnie i: zarejestruj SW, przejdź do kilku narzędzi, kliknij stopkę 5× i potwierdź reset.
- Sprawdź tryb offline (DevTools → Application → Offline) — zasoby z `sw.js` powinny być dostępne.

## Aktualizacja aplikacji (PWA)

Od wersji 2.0.0 aktualizacja aplikacji jest uproszczona i w pełni automatyczna:

- **Aby wymusić aktualizację u wszystkich użytkowników:**
  1. Zmień pole `"version"` w pliku `manifest.json` na nowy numer wersji (np. `"2.0.1"`).
  2. Wgraj nowe pliki na serwer (np. przez `git push` lub FTP).
  3. Użytkownicy automatycznie otrzymają powiadomienie o nowej wersji (przycisk "ODŚWIEŻ" pojawi się na dole ekranu).
  4. Po kliknięciu "ODŚWIEŻ" aplikacja przeładuje się z nowymi plikami.

**Nie trzeba już ręcznie czyścić cache ani pamięci aplikacji na telefonie!**

- Service Worker automatycznie wykrywa zmianę wersji w `manifest.json` i pobiera nowe pliki do cache.
- Stare cache są usuwane automatycznie.
- Wersja w stopce pobierana jest z `manifest.json`.

**Podsumowanie:**
- Zmieniasz tylko `manifest.json.version` → cała aplikacja aktualizuje się automatycznie u wszystkich użytkowników.

---

