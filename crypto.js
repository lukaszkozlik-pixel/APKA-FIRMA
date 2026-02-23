const EncryptionTool = {
    ALGO: "AES-GCM",
    SALT: "stala-sol-pwa-2026",

    // Ta funkcja generuje "surowy" klucz z PINu - wykonujemy to RAZ
    async getDerivedKey(pin) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]);
        return crypto.subtle.deriveKey(
            { 
                name: "PBKDF2", 
                salt: enc.encode(this.SALT), 
                iterations: 100000, // Zmniejszenie do 100k zachowuje bezpieczeństwo, a przyspiesza start
                hash: "SHA-256" 
            },
            keyMaterial, { name: this.ALGO, length: 256 }, false, ["encrypt", "decrypt"]
        );
    },

    // Funkcje konwersji (używamy poprawionej metody z chunkingiem)
    uint8ToBase64(uint8) {
        let binary = '';
        const len = uint8.byteLength;
        for (let i = 0; i < len; i += 8192) {
            binary += String.fromCharCode.apply(null, uint8.subarray(i, Math.min(i + 8192, len)));
        }
        return btoa(binary);
    },

    base64ToUint8(base64) {
        const binary = atob(base64);
        const uint8 = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) uint8[i] = binary.charCodeAt(i);
        return uint8;
    },

    // Zmieniamy argument 'pin' na 'key' - klucz przekazujemy już gotowy
    async encrypt(data, key) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const ciphertext = await crypto.subtle.encrypt({ name: this.ALGO, iv }, key, encoded);
        
        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(ciphertext), iv.length);
        return this.uint8ToBase64(combined);
    },

    async decrypt(base64Data, key) {
        try {
            const combined = this.base64ToUint8(base64Data);
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            const decrypted = await crypto.subtle.decrypt({ name: this.ALGO, iv }, key, data);
            return JSON.parse(new TextDecoder().decode(decrypted));
        } catch (e) { return null; }
    }
};