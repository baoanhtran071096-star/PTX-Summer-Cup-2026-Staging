// ============================================================
// INFRASTRUCTURE: SAFE LOCALSTORAGE & PERSISTENCE HELPERS
// ============================================================

export function isStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

export function getStorageItem(key, defaultValue = null) {
    if (!isStorageAvailable()) return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item !== null ? item : defaultValue;
    } catch (e) {
        console.warn(`[Storage] Error reading key '${key}':`, e);
        return defaultValue;
    }
}

export function setStorageItem(key, value) {
    if (!isStorageAvailable()) return false;
    try {
        window.localStorage.setItem(key, String(value));
        return true;
    } catch (e) {
        console.warn(`[Storage] Error setting key '${key}':`, e);
        return false;
    }
}

export function removeStorageItem(key) {
    if (!isStorageAvailable()) return false;
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.warn(`[Storage] Error removing key '${key}':`, e);
        return false;
    }
}

export function getJSON(key, defaultValue = null) {
    const raw = getStorageItem(key, null);
    if (!raw) return defaultValue;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.warn(`[Storage] Error parsing JSON for key '${key}':`, e);
        return defaultValue;
    }
}

export function setJSON(key, data) {
    try {
        const jsonStr = JSON.stringify(data);
        return setStorageItem(key, jsonStr);
    } catch (e) {
        console.warn(`[Storage] Error stringifying JSON for key '${key}':`, e);
        return false;
    }
}
