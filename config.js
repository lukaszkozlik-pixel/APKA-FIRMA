const APP_CONFIG = {
    DB_NAME: "InstalatorDB",
    DB_VERSION: 3, // <--- Tutaj zmieniasz wersję dla CAŁEJ apki
};

// Eksportujemy do użycia w modułach
if (typeof module !== 'undefined') {
    module.exports = APP_CONFIG;
}