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
        console.warn(`[Storage] Quarantine malformed JSON for key '${key}':`, e);
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

// ============================================================
// PRODUCT-002: FAIL-CLOSED IMPORT PAYLOAD VALIDATION & ATOMIC COMMIT
// ============================================================
export function validateAndImportPtxData(input) {
    let payload = input;
    if (typeof input === 'string') {
        try {
            payload = JSON.parse(input);
        } catch (e) {
            return { success: false, reason: 'MALFORMED_JSON', error: e.message };
        }
    }

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { success: false, reason: 'INVALID_ROOT_TYPE' };
    }

    // Prototype Pollution Defense: Reject __proto__, constructor, or prototype
    const hasDangerousKey = (obj) => {
        if (!obj || typeof obj !== 'object') return false;
        if (Object.prototype.hasOwnProperty.call(obj, '__proto__') ||
            Object.prototype.hasOwnProperty.call(obj, 'constructor') ||
            Object.prototype.hasOwnProperty.call(obj, 'prototype')) {
            return true;
        }
        for (const k in obj) {
            if (k === '__proto__' || k === 'constructor' || k === 'prototype') return true;
            if (typeof obj[k] === 'object' && obj[k] !== null) {
                if (hasDangerousKey(obj[k])) return true;
            }
        }
        return false;
    };

    if (hasDangerousKey(payload)) {
        return { success: false, reason: 'PROTOTYPE_POLLUTION_DETECTED' };
    }

    const lsData = payload.localStorage;
    if (!lsData || typeof lsData !== 'object' || Array.isArray(lsData)) {
        return { success: false, reason: 'MISSING_OR_INVALID_LOCALSTORAGE_SECTION' };
    }

    // Allowlist Check against persistence-inventory.json schema
    const permittedExactKeys = new Set([
        'theme', 'lang', 'currentPage', 'ptx_admin_hash_v2', 'ptx_admin_salt_v2',
        'ptx_admin_auth', 'ptx_players_data', 'ptx_seeded_flag', 'ptx_stat_goals',
        'ptx_stat_matches', 'ptx_user_predictions_list', 'pwa_dismissed', 'ptx_slogan',
        'ptx_msg', 'ptx_date', 'ptx_location', 'ptx_user_prediction', 'ptx_admin_hash',
        'ptx_admin_user', 'ptx_salt', 'adminLoggedIn', 'adminLoginTimestamp'
    ]);

    const isPermittedKey = (key) => {
        if (typeof key !== 'string') return false;
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return false;
        if (permittedExactKeys.has(key)) return true;
        if (key.startsWith('ptx_result_') || key.startsWith('gallery_') || key.startsWith('hof_') || key.startsWith('ptx_stat_')) {
            return true;
        }
        return false;
    };

    const keys = Object.keys(lsData);
    for (const key of keys) {
        if (!isPermittedKey(key)) {
            return { success: false, reason: 'UNAUTHORIZED_KEY_DETECTED', key };
        }
        const val = lsData[key];
        if (typeof val !== 'string' && typeof val !== 'number' && typeof val !== 'boolean') {
            return { success: false, reason: 'INVALID_VALUE_TYPE', key };
        }
    }

    // Pre-Validation Complete -> Take Snapshot of Affected Keys for Atomic Rollback
    const snapshot = {};
    keys.forEach(k => {
        snapshot[k] = isStorageAvailable() ? window.localStorage.getItem(k) : null;
    });

    // Atomic Commit: Write all keys inside try...catch. Rollback snapshot on ANY failure.
    try {
        keys.forEach(k => {
            setStorageItem(k, String(lsData[k]));
        });
        return { success: true, importedKeysCount: keys.length };
    } catch (err) {
        keys.forEach(k => {
            if (snapshot[k] === null) {
                removeStorageItem(k);
            } else {
                setStorageItem(k, snapshot[k]);
            }
        });
        return { success: false, reason: 'ATOMIC_COMMIT_FAILED', error: err.message };
    }
}

// ============================================================
// PRODUCT-003: ADMIN SESSION INACTIVITY TIMEOUT HARDENING
// ============================================================
const ADMIN_SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 Hours
let activeListenersBound = false;
let lastThrottledTime = 0;

function handleUserActivity() {
    const now = Date.now();
    if (now - lastThrottledTime < 10000) return; // Throttle to at most once per 10s
    lastThrottledTime = now;

    if (getStorageItem('adminLoggedIn') === 'true') {
        setStorageItem('ptx_admin_last_activity', String(now));
    }
}

export function initAdminSessionTimeout(onLogoutCallback) {
    if (typeof window === 'undefined') return;

    // Verify session expiry on init / page refresh
    if (getStorageItem('adminLoggedIn') === 'true') {
        const lastActivity = Number(getStorageItem('ptx_admin_last_activity', '0'));
        const now = Date.now();

        if (lastActivity > 0 && (now - lastActivity > ADMIN_SESSION_TIMEOUT_MS)) {
            console.warn('[AdminSession] Inactivity timeout expired. Performing auto-logout.');
            removeStorageItem('adminLoggedIn');
            removeStorageItem('ptx_admin_last_activity');
            if (typeof onLogoutCallback === 'function') onLogoutCallback();
            return false;
        } else {
            // Update timestamp on clean session restoration
            setStorageItem('ptx_admin_last_activity', String(now));
        }
    }

    // Attach throttled listeners for pointerdown, keydown, touchstart (NO mousemove)
    if (!activeListenersBound) {
        activeListenersBound = true;
        window.addEventListener('pointerdown', handleUserActivity, { passive: true });
        window.addEventListener('keydown', handleUserActivity, { passive: true });
        window.addEventListener('touchstart', handleUserActivity, { passive: true });
    }

    return true;
}

export function cleanupAdminSessionListeners() {
    if (typeof window === 'undefined' || !activeListenersBound) return;
    activeListenersBound = false;
    window.removeEventListener('pointerdown', handleUserActivity);
    window.removeEventListener('keydown', handleUserActivity);
    window.removeEventListener('touchstart', handleUserActivity);
}

