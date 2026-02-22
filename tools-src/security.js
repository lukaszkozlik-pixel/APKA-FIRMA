// security.js
// Wspólny mechanizm blokady dostępu dla wszystkich stron

function showLockOverlay() {
    let overlay = document.getElementById('app-lock-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'app-lock-overlay';
        overlay.style = 'display:flex; position:fixed; top:0; left:0; width:100vw; height:100vh; background:white; z-index:9999; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center;';
        overlay.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
            <h2>Zablokowano dostęp</h2>
            <p>Wróć do strony głównej i zaloguj się ponownie.</p>
            <button onclick="window.location.replace('../index.html')" style="padding:15px; background:#1a73e8; color:white; border:none; border-radius:10px; font-weight:bold;">Przejdź do logowania</button>
        `;
        document.body.appendChild(overlay);
    } else {
        overlay.style.display = 'flex';
    }
}

function checkSession() {
    const auth = sessionStorage.getItem('app_authenticated');
    const lastAuth = sessionStorage.getItem('app_last_auth');
    const now = Date.now();
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minut
    if (auth === 'true' && lastAuth && (now - parseInt(lastAuth, 10) < SESSION_TIMEOUT)) {
        sessionStorage.setItem('app_last_auth', now.toString());
        return true;
    } else {
        sessionStorage.removeItem('app_authenticated');
        sessionStorage.removeItem('app_last_auth');
        showLockOverlay();
        return false;
    }
}

// Wyloguj przy minimalizacji/ukryciu
function setupSessionListeners() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            sessionStorage.removeItem('app_authenticated');
            sessionStorage.removeItem('app_last_auth');
        }
    });
    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('app_authenticated');
        sessionStorage.removeItem('app_last_auth');
    });
}

// Wywołaj na starcie
setupSessionListeners();
if (!checkSession()) {
    // Blokada już pokazana
    throw new Error('Brak autoryzacji');
}
