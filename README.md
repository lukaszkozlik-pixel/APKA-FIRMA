## Instalator Pro — narzędzia dla instalatora

Krótki opis
- Statyczna aplikacja webowa (HTML/CSS/JS) z narzędziami dla instalatorów DVB‑T / SAT.
- PWA-friendly: manifest + service worker do cache'owania zasobów.
- Motyw jasny: spójny wygląd na wszystkich podstronach.
- **Bezpieczeństwo (od v2.1.5):** Wbudowany system blokady dostępu (PIN + Biometria) chroniący dane użytkownika.

Struktura projektu (ważniejsze pliki)
- `index.html` — strona główna aplikacji z ekranem blokady
- `style.css` — główny styl
- `js/config.js` — **CENTRALNA KONFIGURACJA** (wersja bazy IndexedDB, wersja aplikacji)
- `sw.js` — Service Worker
- `manifest.json` — manifest PWA (wersja źródłowa aplikacji)
- `tools-src/` — narzędzia (m.in. `magazyn.html`, `raporty.html`, `settings.html`)

## Nowości w wersji 2.1.5

### 1. Centralna Konfiguracja (`js/config.js`)
- Cała aplikacja korzysta z jednego pliku konfiguracyjnego `APP_CONFIG`.
- Automatyczna synchronizacja wersji bazy danych `IndexedDB` we wszystkich modułach (Raporty, Magazyn, Ustawienia).
- Wersja wyświetlana w stopce i ustawieniach jest pobierana dynamicznie.

### 2. Bezpieczeństwo i Sesja
- **Blokada PIN:** Możliwość ustawienia 4-cyfrowego kodu dostępu.
- **Biometria (WebAuthn):** Prawdziwe wsparcie dla odcisku palca i rozpoznawania twarzy (wymaga HTTPS).
- **Kod Ratunkowy:** Unikalny klucz generowany przy pierwszej konfiguracji, pozwalający na odzyskanie dostępu.
- **Zarządzanie Sesją:** Dzięki `sessionStorage` użytkownik loguje się raz przy otwarciu aplikacji. Przechodzenie między narzędziami (np. powrót z Cennika do Menu) nie wymaga ponownego wpisywania PIN-u.

### 3. Magazyn Zużycia (Pasywny)
- Uproszczona wersja magazynu, która działa jako licznik zużytego materiału.
- Integracja z Cennikiem: Każdy wygenerowany raport automatycznie dopisuje towary do listy zużycia w danym miesiącu.
- Funkcja "Zamknij miesiąc" pozwala wyczyścić statystyki przed nowym okresem.

## Automatyczna aktualizacja bazy (IndexedDB)

Aplikacja automatycznie zarządza strukturą bazy danych:
- **Wersja 1:** Raporty.
- **Wersja 2:** Magazyn (licznik zużycia).
- **Wersja 3:** Ustawienia bezpieczeństwa (PIN/Biometria).
- Zmiana `DB_VERSION` w `js/config.js` automatycznie uruchamia migrację u wszystkich użytkowników bez utraty starych raportów.

## Ustawienia i Reset

- **Moduł Ustawień:** Pozwala na włączenie/wyłączenie blokady, konfigurację biometrii oraz podgląd kodu ratunkowego.
- **Twardy Reset:** Opcja w Ustawieniach pozwalająca na całkowite usunięcie bazy danych IndexedDB i przywrócenie aplikacji do stanu fabrycznego.
- **Reset deweloperski:** 5-krotne kliknięcie stopki (nadal dostępne jako szybki skrót serwisowy).

---

### Przepływ pracy dla dewelopera
1. **Aktualizacja wersji:** zmień `DB_VERSION` (jeśli dodajesz nowe tabele) w `js/config.js`.
2. **Synchronizacja PWA:** Zaktualizuj pole `"version"` w `manifest.json`.


**Uwaga dot. Biometrii:** Aby przetestować biometrię (WebAuthn) lokalnie, używaj adresu `http://localhost:8000`. Na serwerze produkcyjnym aplikacja **musi** posiadać certyfikat SSL (HTTPS).