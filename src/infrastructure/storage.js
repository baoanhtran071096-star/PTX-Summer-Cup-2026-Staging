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

    // Explicitly exclude all authentication and session state keys from data import payloads
    const AUTH_SESSION_KEYS = new Set([
        'ptx_admin_hash_v2', 'ptx_admin_salt_v2', 'ptx_admin_auth',
        'ptx_admin_hash', 'ptx_admin_user', 'ptx_salt',
        'adminLoggedIn', 'adminLoginTimestamp', 'ptx_admin_last_activity'
    ]);

    // Authoritative Inventoried Persistence Keys from config/persistence-inventory.json
    const PERMITTED_EXACT_KEYS = new Set([
        'theme', 'lang', 'currentPage', 'ptx_players_data', 'ptx_seeded_flag', 'ptx_seed_version',
        'ptx_stat_goals', 'ptx_stat_matches', 'ptx_user_predictions_list',
        'pwa_dismissed', 'ptx_slogan', 'ptx_msg', 'ptx_date', 'ptx_location',
        'ptx_user_prediction'
    ]);

    const isPermittedKey = (key) => {
        if (typeof key !== 'string') return false;
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return false;
        if (AUTH_SESSION_KEYS.has(key)) return false;
        if (PERMITTED_EXACT_KEYS.has(key)) return true;

        // Authoritative Inventoried Dynamic Surface Patterns
        if (/^ptx_result_[0-9]+$/.test(key)) return true;
        if (/^gallery_(202[5-9]|2030)$/.test(key)) return true;
        if (/^hof_(202[5-9]|2030)$/.test(key)) return true;
        if (/^ptx_stat_[a-z_]+$/.test(key)) return true;

        return false;
    };

    const keys = Object.keys(lsData);
    for (const key of keys) {
        if (AUTH_SESSION_KEYS.has(key)) {
            return { success: false, reason: 'AUTH_SESSION_KEYS_NOT_PERMITTED_IN_IMPORT', key };
        }
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
            const written = setStorageItem(k, String(lsData[k]));
            if (!written) {
                throw new Error(`STORAGE_WRITE_FAILED_KEY_${k}`);
            }
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

// ============================================================
// FRESH VISITOR OFFICIAL PRE-KICKOFF DATA BOOTSTRAP
// ============================================================
const OFFICIAL_PRE_KICKOFF_SEED = {
    players: [
        { id: 1, name: "Anh Trương", team: "p", position: "FW", avatar: "https://i.postimg.cc/VLrMX52J/Anh-Truong.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 2, name: "Phan Hiền", team: "p", position: "MF", avatar: "https://i.postimg.cc/sDkWmsR9/Phan-Hien.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 3, name: "Thanh Long", team: "p", position: "DF", avatar: "https://i.postimg.cc/X7R5L402/Thanh-Long.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 4, name: "Thanh Trúc", team: "p", position: "GK", avatar: "https://i.postimg.cc/Dy9G6nKD/Thanh-Truc.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 5, name: "Mậu Quốc", team: "p", position: "DF", avatar: "https://i.postimg.cc/wTCN2gdm/Mau-Quoc.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 6, name: "Quang Minh", team: "p", position: "FW", avatar: "https://i.postimg.cc/5NhzgbM7/Quang-Minh.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 7, name: "Khánh Hưng", team: "p", position: "MF", avatar: "https://i.postimg.cc/BQrFp4Gj/Khanh-Hung.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 8, name: "Mạnh Tuấn", team: "p", position: "DF", avatar: "https://i.postimg.cc/Dy9G6nK4/Manh-Tuan.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 9, name: "Minh Thế", team: "t", position: "DF", avatar: "https://i.postimg.cc/VLxtgmcM/Minh-The.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 10, name: "Tường Khánh", team: "t", position: "GK", avatar: "https://i.postimg.cc/YCQWyZpX/Tuong-Khanh.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 11, name: "Hoàng Nam", team: "t", position: "MF", avatar: "https://i.postimg.cc/WbBZ8TPD/Hoang-Nam.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 12, name: "Đăng Quân", team: "t", position: "FW", avatar: "https://i.postimg.cc/zXbWT34L/Dang-Quan.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 13, name: "Thanh Tú", team: "t", position: "FW", avatar: "https://i.postimg.cc/wjDmbZ6w/Thanh-Tu.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 14, name: "Chí Đại", team: "t", position: "MF", avatar: "https://i.postimg.cc/Nf9TRLZ2/Chi-Dai.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 15, name: "Quang Toàn", team: "t", position: "DF", avatar: "https://i.postimg.cc/SNB9dkpg/Quang-Toan.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 16, name: "Phát Tài", team: "t", position: "DF", avatar: "https://i.postimg.cc/7YFz9wyV/Phat-Tai.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 17, name: "Đình Huy", team: "x", position: "GK", avatar: "https://i.postimg.cc/J4fXxMWD/Dinh-Huy.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 18, name: "Xuân Sử", team: "x", position: "DF", avatar: "https://i.postimg.cc/L6cPD2Mj/Nguyen-Su.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 19, name: "Văn Lân", team: "x", position: "FW", avatar: "https://i.postimg.cc/VkXCHpYH/Van-Lan.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 20, name: "Thiên Phú", team: "x", position: "DF", avatar: "https://i.postimg.cc/Z56dD2TV/Thien-Phu.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 21, name: "Bảo Anh", team: "x", position: "MF", avatar: "https://i.postimg.cc/L6YfjhGY/Bao-Anh.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 22, name: "Phương Toàn", team: "x", position: "MF", avatar: "https://i.postimg.cc/dtbC6wKn/Phuong-Toan.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 23, name: "Minh Hiếu", team: "x", position: "FW", avatar: "https://i.postimg.cc/7YFz9wyz/Minh-Hieu.jpg", goals: 0, assists: 0, mvp: 0 },
        { id: 24, name: "Thành Thái", team: "x", position: "MF", avatar: "https://i.postimg.cc/PrgDyTkF/Thanh-Thai.jpg", goals: 0, assists: 0, mvp: 0 }
    ],
    localStorage: {
        ptx_stat_goals: "0",
        ptx_stat_matches: "0",
        ptx_stat_players: "24",
        ptx_stat_yellow: "0",
        ptx_stat_red: "0",
        ptx_slogan: "Làm hết sức – Chơi hết mình",
        ptx_msg: "Giải bóng đá truyền thống do Công đoàn PTX Group Việt Nam tổ chức",
        ptx_date: "07/08/2026",
        ptx_location: "152 Hoàng Hoa Thám, Bảy Hiền, Hồ Chí Minh, Việt Nam",
        hof_2025: "TEAM P (PHOENIX) | Chưa đủ dữ liệu (Cập nhật sau) | Chưa đủ dữ liệu (Cập nhật sau) | Chưa đủ dữ liệu (Cập nhật sau) | Chưa đủ dữ liệu (Cập nhật sau)",
        gallery_2025: "https://i.postimg.cc/J4BFgJp7/CD.jpg"
    }
};

export function hasExistingTournamentState() {
    if (!isStorageAvailable()) return false;
    try {
        const len = window.localStorage.length;
        for (let i = 0; i < len; i++) {
            const key = window.localStorage.key(i);
            if (!key) continue;

            if (key === 'ptx_players_data' || key === 'ptx_seed_version' || key === 'ptx_seeded_flag' || key === 'ptx_user_prediction' || key === 'ptx_user_predictions_list') {
                return true;
            }
            if (/^ptx_result_[0-9]+$/.test(key)) {
                return true;
            }
            if (/^ptx_stat_[a-z_]+$/.test(key)) {
                return true;
            }
        }
    } catch (e) {
        console.warn('[Storage] Fail-safe error checking tournament state:', e);
        return true; // Fail-closed: assume state exists if reading storage fails
    }
    return false;
}

export function ensureOfficialPreKickoffSeed(customSeed = null) {
    if (!isStorageAvailable()) return false;

    // Fail-safe Dynamic Key Tournament State Detection (P0-002 Invariant):
    // IF ANY authoritative tournament state key, result key (e.g. ptx_result_4), stat key (e.g. ptx_stat_yellow),
    // or player roster exists, DO NOT BOOTSTRAP! Preserve live user/admin state byte-for-byte!
    if (hasExistingTournamentState()) {
        return false; // FORBIDDEN: Live tournament state detected. Preserve existing state!
    }

    const seed = customSeed || OFFICIAL_PRE_KICKOFF_SEED;
    if (!seed || !seed.players || !Array.isArray(seed.players)) {
        console.error('[Storage Bootstrap] Seed payload unavailable or malformed.');
        return false;
    }

    const result = validateAndImportPtxData({
        exportVersion: '3.0.2',
        localStorage: {
            ptx_players_data: JSON.stringify(seed.players),
            ptx_seed_version: '3.0.2',
            ...(seed.localStorage || {})
        }
    });

    if (result.success) {
        console.log('[Storage Bootstrap] Fresh visitor official pre-kickoff state initialized successfully.');
        return true;
    } else {
        console.error('[Storage Bootstrap] Failed to initialize official seed:', result);
        return false;
    }
}


