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
import {
    calculateStandingsAdapter,
    sortStandingsAdapter,
    computeDashboardStatsAdapter,
    calculatePlayerStatsAdapter,
    getPlayerTeamAdapter,
    filterMatchesByRoundAdapter,
    parseGoalDataWithTeamAdapter,
    getMatchResultAdapter
} from './adapters/domain.adapters.js';

import { showToast } from './ui/toast.js';
import {
    openLoginAdapter, closeLoginAdapter,
    openAiGrowthModalAdapter, closeAiGrowthModalAdapter,
    openVipTicketModalAdapter, closeVipTicketModalAdapter,
    openComparePlayersModalAdapter, closeComparePlayersModalAdapter,
    openInfographicModalAdapter, closeInfographicModalAdapter,
    openLiveStreamHubModalAdapter, closeLiveStreamHubModalAdapter,
    openAiPressReleaseModalAdapter, closeAiPressReleaseModalAdapter,
    openStadiumDJModalAdapter, closeStadiumDJModalAdapter
} from './adapters/ui.adapters.js';

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

    // UI Modules & Adapters
    window.showToast = showToast;
    window.openLogin = openLoginAdapter;
    window.closeLogin = closeLoginAdapter;
    window.openAiGrowthModal = openAiGrowthModalAdapter;
    window.closeAiGrowthModal = closeAiGrowthModalAdapter;
    window.openVipTicketModal = openVipTicketModalAdapter;
    window.closeVipTicketModal = closeVipTicketModalAdapter;
    window.openComparePlayersModal = openComparePlayersModalAdapter;
    window.closeComparePlayersModal = closeComparePlayersModalAdapter;
    window.openInfographicModal = openInfographicModalAdapter;
    window.closeInfographicModal = closeInfographicModalAdapter;
    window.openLiveStreamHubModal = openLiveStreamHubModalAdapter;
    window.closeLiveStreamHubModal = closeLiveStreamHubModalAdapter;
    window.openAiPressReleaseModal = openAiPressReleaseModalAdapter;
    window.closeAiPressReleaseModal = closeAiPressReleaseModalAdapter;
    window.openStadiumDJModal = openStadiumDJModalAdapter;
    window.closeStadiumDJModal = closeStadiumDJModalAdapter;

    // Domain Compatibility Adapters (8/8 Domain Functions Preserving Legacy Signatures)
    window.calculateStandings = calculateStandingsAdapter;
    window.sortStandings = sortStandingsAdapter;
    window.computeDashboardStats = computeDashboardStatsAdapter;
    window.calculatePlayerStats = calculatePlayerStatsAdapter;
    window.getPlayerTeam = getPlayerTeamAdapter;
    window.filterMatchesByRound = filterMatchesByRoundAdapter;
    window.parseGoalDataWithTeam = parseGoalDataWithTeamAdapter;
    window.getMatchResult = getMatchResultAdapter;

    // Register PWA & UI Handlers into Legacy Bridge Registry
    registerLegacyHandler('installPTXPWAApp', installPTXPWAApp);
    registerLegacyHandler('dismissPWABanner', dismissPWABanner);
    registerLegacyHandler('showToast', showToast);
    registerLegacyHandler('openLogin', openLoginAdapter);
    registerLegacyHandler('closeLogin', closeLoginAdapter);
    registerLegacyHandler('openAiGrowthModal', openAiGrowthModalAdapter);
    registerLegacyHandler('closeAiGrowthModal', closeAiGrowthModalAdapter);
    registerLegacyHandler('openVipTicketModal', openVipTicketModalAdapter);
    registerLegacyHandler('closeVipTicketModal', closeVipTicketModalAdapter);
    registerLegacyHandler('openComparePlayersModal', openComparePlayersModalAdapter);
    registerLegacyHandler('closeComparePlayersModal', closeComparePlayersModalAdapter);
    registerLegacyHandler('openInfographicModal', openInfographicModalAdapter);
    registerLegacyHandler('closeInfographicModal', closeInfographicModalAdapter);
    registerLegacyHandler('openLiveStreamHubModal', openLiveStreamHubModalAdapter);
    registerLegacyHandler('closeLiveStreamHubModal', closeLiveStreamHubModalAdapter);
    registerLegacyHandler('openAiPressReleaseModal', openAiPressReleaseModalAdapter);
    registerLegacyHandler('closeAiPressReleaseModal', closeAiPressReleaseModalAdapter);
    registerLegacyHandler('openStadiumDJModal', openStadiumDJModalAdapter);
    registerLegacyHandler('closeStadiumDJModal', closeStadiumDJModalAdapter);

    // Initialize PWA Listeners & Legacy Bridge
    initPWAHelpers();
    initLegacyBridge();
}

console.log(`🚀 [PTX App] Initialized ${APP_CONFIG.name} (${APP_CONFIG.version})`);
