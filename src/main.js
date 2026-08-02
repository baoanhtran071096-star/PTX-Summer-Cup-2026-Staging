// ============================================================
// MAIN ES MODULE ENTRYPOINT (Vite Client Root)
// ============================================================

import './styles/main.css';
import { APP_CONFIG, STORAGE_KEYS } from './config/app.config.js';
import { TEAMS, POSITIONS } from './config/constants.js';
import { formatScore, formatJerseyName, truncateText } from './utils/formatters.js';
import { normalizeAssetUrl, handleImageError, FALLBACK_PLAYER_SVG, FALLBACK_TEAM_SVG, FALLBACK_GENERAL_SVG } from './utils/assets.js';
import { isStorageAvailable, getStorageItem, setStorageItem, removeStorageItem, getJSON, setJSON, validateAndImportPtxData, ensureOfficialPreKickoffSeed, initAdminSessionTimeout, cleanupAdminSessionListeners } from './infrastructure/storage.js';
import { initPWAHelpers, installPTXPWAApp, dismissPWABanner } from './infrastructure/pwa.js';
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
import { navigate } from './ui/navigation.js';
import { openLightboxAdapter, renderGalleryPageAdapter } from './adapters/gallery.adapters.js';
import { renderStandingsAdapter, renderStandingsPageTableAdapter } from './adapters/standings.adapters.js';
import { renderAllMatchesAdapter } from './adapters/matches.adapters.js';
import { renderTeamRostersAdapter, renderPlayerCardsAdapter, openPlayerModalByIdAdapter } from './adapters/players.adapters.js';
import { updateDashboardAdapter, renderHallOfFameAdapter } from './adapters/dashboard.adapters.js';
import {
    navigateAdapter,
    switchTeamSubTabAdapter,
    switchAdminTabAdapter,
    filterFifaByTeamAdapter,
    filterGalleryPageAdapter,
    openTacticalVisualizerModalAdapter,
    closeTacticalVisualizerModalAdapter,
    openLoginAdapter, closeLoginAdapter,
    openAiGrowthModalAdapter, closeAiGrowthModalAdapter,
    openVipTicketModalAdapter, closeVipTicketModalAdapter,
    openComparePlayersModalAdapter, closeComparePlayersModalAdapter,
    openInfographicModalAdapter, closeInfographicModalAdapter,
    openLiveStreamHubModalAdapter, closeLiveStreamHubModalAdapter,
    openAiPressReleaseModalAdapter, closeAiPressReleaseModalAdapter,
    openStadiumDJModalAdapter, closeStadiumDJModalAdapter
} from './adapters/ui.adapters.js';
import { registerOpenedModal, unregisterClosedModal, closeTopmostModal, getModalStackDepth, getKeyboardOwnerCount } from './ui/modals.js';
import { readPredictionState, syncPredictionSelectionState } from './adapters/prediction.adapters.js';
import { initEvents } from './events/index.js';

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
    window.validateAndImportPtxData = validateAndImportPtxData;
    window.initAdminSessionTimeout = initAdminSessionTimeout;
    window.cleanupAdminSessionListeners = cleanupAdminSessionListeners;
    window.registerOpenedModal = registerOpenedModal;
    window.unregisterClosedModal = unregisterClosedModal;
    window.closeTopmostModal = closeTopmostModal;
    window.getModalStackDepth = getModalStackDepth;
    window.getKeyboardOwnerCount = getKeyboardOwnerCount;
    window.readPredictionState = readPredictionState;
    window.syncPredictionSelectionState = syncPredictionSelectionState;

    // UI Modules & View Adapters
    window.showToast = showToast;
    window.openLightbox = openLightboxAdapter;
    window.renderGalleryPage = renderGalleryPageAdapter;
    window.renderStandings = renderStandingsAdapter;
    window.renderStandingsPageTable = renderStandingsPageTableAdapter;
    window.renderAllMatches = renderAllMatchesAdapter;
    window.renderTeamRosters = renderTeamRostersAdapter;
    window.renderPlayerCards = renderPlayerCardsAdapter;
    window.openPlayerModalById = openPlayerModalByIdAdapter;
    window.updateDashboard = updateDashboardAdapter;
    window.renderHallOfFame = renderHallOfFameAdapter;
    window.navigate = navigateAdapter;
    window.switchTeamSubTab = switchTeamSubTabAdapter;
    window.switchAdminTab = switchAdminTabAdapter;
    window.filterFifaByTeam = filterFifaByTeamAdapter;
    window.filterGalleryPage = filterGalleryPageAdapter;
    window.openTacticalVisualizerModal = openTacticalVisualizerModalAdapter;
    window.closeTacticalVisualizerModal = closeTacticalVisualizerModalAdapter;
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

    // Ensure Fresh Visitor Official Pre-Kickoff Data Bootstrap
    ensureOfficialPreKickoffSeed();

    // Initialize PWA Listeners, Admin Session Timeout & Native Events
    initPWAHelpers();
    initAdminSessionTimeout();
    initEvents();
}

console.log(`🚀 [PTX App] Initialized ${APP_CONFIG.name} (${APP_CONFIG.version})`);
