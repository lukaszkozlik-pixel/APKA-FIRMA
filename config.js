const APP_CONFIG = {
    DB_NAME: "InstalatorDB",
    DB_VERSION: 6, // Zwiększaj przy każdej zmianie struktury bazy
   

    SECURE_DB_NAME: "InstalatorSecureDB",
    SECURE_DB_VERSION: 1, // Baza do przechowywania zaszyfrowanych danych

    APP_VERSION: "2.4.1", // Zwiększ przy każdej aktualizacji aplikacji
        
};

// Eksportujemy do użycia w modułach
if (typeof module !== 'undefined') {
    module.exports = APP_CONFIG;
}

