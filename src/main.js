// ============================================================
// MAIN ES MODULE ENTRYPOINT (Vite Client Root)
// ============================================================

import './styles/main.css';
import { APP_CONFIG, STORAGE_KEYS } from './config/app.config.js';
import { TEAMS, POSITIONS } from './config/constants.js';
import { formatScore, formatJerseyName, truncateText } from './utils/formatters.js';
import { normalizeAssetUrl, handleImageError, FALLBACK_PLAYER_SVG, FALLBACK_TEAM_SVG, FALLBACK_GENERAL_SVG } from './utils/assets.js';
import { isStorageAvailable, getStorageItem, setStorageItem, removeStorageItem, getJSON, setJSON } from './infrastructure/storage.js';
import { initPWAHelpers, installPTXPWAApp, dismissPWABanner } from './infrastructure/pwa.js';
import { initLegacyBridge, registerLegacyHandler } from './legacy/bridge.js';

// Export utilities & infrastructure helpers to window scope for runtime compatibility
if (typeof window !== 'undefined') {
    window.APP_CONFIG = APP_CONFIG;
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.TEAMS = TEAMS;
    window.POSITIONS = POSITIONS;
    window.formatScore = formatScore;
    window.formatJerseyName = formatJerseyName;
    window.truncateText = truncateText;
    window.normalizeAssetUrl = normalizeAssetUrl;
    window.handleImageError = handleImageError;
    window.FALLBACK_PLAYER_SVG = FALLBACK_PLAYER_SVG;
    window.FALLBACK_TEAM_SVG = FALLBACK_TEAM_SVG;
    window.FALLBACK_GENERAL_SVG = FALLBACK_GENERAL_SVG;

    // Infrastructure Storage & PWA Helpers
    window.isStorageAvailable = isStorageAvailable;
    window.getStorageItem = getStorageItem;
    window.setStorageItem = setStorageItem;
    window.removeStorageItem = removeStorageItem;
    window.getJSON = getJSON;
    window.setJSON = setJSON;

    // Register PWA Handlers into Legacy Bridge Registry
    registerLegacyHandler('installPTXPWAApp', installPTXPWAApp);
    registerLegacyHandler('dismissPWABanner', dismissPWABanner);

    // Initialize PWA Listeners & Legacy Bridge
    initPWAHelpers();
    initLegacyBridge();
}

console.log(`🚀 [PTX App] Initialized ${APP_CONFIG.name} (${APP_CONFIG.version})`);
