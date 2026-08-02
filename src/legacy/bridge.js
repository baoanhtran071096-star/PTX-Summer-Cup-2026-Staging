// ============================================================
// PHASE 2D.1 — LEGACY HANDLER ALLOWLIST BRIDGE (COMPLETE 103/103 HANDLERS)
// ============================================================

export const LEGACY_HANDLERS_ALLOWLIST = [
    'installPTXPWAApp', 'dismissPWABanner', 'navigate', 'openLiveStreamHubModal',
    'openVipTicketModal', 'openComparePlayersModal', 'switchToPreMatchState',
    'resetSystemDataToOfficialDefaults', 'openRefereeToolkit', 'checkAdminNavClick',
    'openAiPressReleaseModal', 'triggerVARReview', 'openStadiumDJModal', 'togglePTXAudio',
    'openInfographicModal', 'exportOfficialMatchReport', 'exportPtxMigrationData',
    'applyLanguage', 'toggleTheme', 'runAITacticalAnalysis', 'filterMatchRound',
    'aiAutoSuggestPrediction', 'submitFanPrediction', 'loadVideoClip', 'shareResult',
    'switchTeamSubTab', 'selectPitchTeam', 'changePitchFormation', 'openTacticalVisualizerModal',
    'autoOptimize5v5Squad', 'filterFifaByTeam', 'closePlayerCompareModal', 'renderCompareView',
    'filterGalleryPage', 'triggerTrophyRotate', 'copyBankStk', 'scrollSponsorForm',
    'selectSponsorPackage', 'submitSponsorContact', 'openLogin', 'handleLogout',
    'switchAdminTab', 'setZeroMatchesState', 'setDemoScoresState', 'updateStandingsAndResults',
    'addQuickGoal', 'updateStatsAdmin', 'loadAdminPlayerDetail', 'savePlayerAdminDetail',
    'saveContentAdmin', 'saveHallOfFameAdmin', 'changeAdminPassword', 'openAiGrowthModal',
    'closeLogin', 'handleLogin', 'closeAiGrowthModal', 'runAiPredictionDemo',
    'predictChampionDemo', 'generateReferralDemo', 'closePlayerModal', 'closeSubstitutionModal',
    'closeTacticalVisualizerModal', 'closeVipTicketModal', 'updateTicketName',
    'randomizeTicketSerial', 'downloadVipTicketImage', 'closeComparePlayersModal',
    'openSubstitutionModalById', 'openPlayerModalById', 'openLightbox', 'closeInfographicModal',
    'downloadInfographicImage', 'closeRefereeToolkit', 'onRefMatchChange', 'showRefereeCard',
    'tossRefCoin', 'changeFoulCount', 'toggleRefStopwatch', 'resetRefStopwatch',
    'playWhistleSound', 'playFinalSirenSound', 'clearRefTimelineLog', 'closeStadiumDJModal',
    'playCrowdCheerSound', 'playStadiumDrumsSound', 'playVuvuzelaSound', 'closeLiveStreamHubModal',
    'onLiveStreamMatchChange', 'playSelectedAudioTrack', 'toggleGlobalBgMusic',
    'copyLiveStreamLink', 'openPlayerDetail', 'openPlayerModal', 'resetAdminPasswordToDefault',
    'exportMatchDataJson', 'clearSystemStorage', 'toggleAdminNav', 'initFanPredictionForm',
    'loadSamplePredictions', 'clearAllPredictionsList', 'toggleFloatingAdmin', 'quickGoalFromFloat',
    'loadCustomLiveStream', 'sendLiveReaction', 'sendLiveChatMessage', 'closeAiPressReleaseModal',
    'generateAIPressRelease', 'copyPressReleaseText', 'togglePTXChatbotWindow', 'sendPTXChatQuick',
    'sendPTXChatMessage', 'downloadVIPPredictionTicket', 'showToast'
];

export function initLegacyBridge() {
    if (typeof window === 'undefined') return;

    window.__ptx_legacy_registry = window.__ptx_legacy_registry || {};

    LEGACY_HANDLERS_ALLOWLIST.forEach(fn => {
        // If a real handler function was already assigned on window (e.g. by classic script), capture it into registry
        if (typeof window[fn] === 'function' && !window[fn].isBridgeProxy) {
            window.__ptx_legacy_registry[fn] = window[fn];
        }

        const bridgeProxy = function(...args) {
            // 1. Check explicit registry
            const registeredFn = window.__ptx_legacy_registry[fn];
            if (typeof registeredFn === 'function') {
                return registeredFn.apply(this, args);
            }
            // 2. Check window fallback if set under __impl_ name
            const explicitImpl = window[`__impl_${fn}`];
            if (typeof explicitImpl === 'function') {
                return explicitImpl.apply(this, args);
            }
            // FAIL LOUD: Throw explicit runtime error (NO silent fallbacks!)
            throw new Error(`[LegacyBridge CRITICAL FAIL] Required handler '${fn}' is invoked but missing implementation!`);
        };

        bridgeProxy.isBridgeProxy = true;
        window[fn] = bridgeProxy;
    });

    console.log(`[LegacyBridge] Clean registry bridge initialized for ${LEGACY_HANDLERS_ALLOWLIST.length} handlers.`);
}

export function registerLegacyHandler(name, fn) {
    if (typeof window !== 'undefined' && typeof fn === 'function') {
        window.__ptx_legacy_registry = window.__ptx_legacy_registry || {};
        window.__ptx_legacy_registry[name] = fn;
    }
}
