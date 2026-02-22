const APP_CONFIG = {
    DB_NAME: "InstalatorDB",
    DB_VERSION: 6, // Zwiększaj przy każdej zmianie struktury bazy
    APP_VERSION: "2.3.5", // Zwiększ przy każdej aktualizacji aplikacji
        
};

// Eksportujemy do użycia w modułach
if (typeof module !== 'undefined') {
    module.exports = APP_CONFIG;
}

