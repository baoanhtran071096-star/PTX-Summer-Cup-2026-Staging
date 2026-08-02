// ============================================================
// PHASE 2D.1 — LEGACY HANDLER ALLOWLIST BRIDGE (FAIL-LOUD LAZY RESOLVER)
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
    'loadSamplePredictions', 'clearAllPredictionsList', 'toggleFloatingAdmin', 'quickGoalFromFloat'
];

export function initLegacyBridge() {
    if (typeof window === 'undefined') return;

    const legacyAPI = {};

    LEGACY_HANDLERS_ALLOWLIST.forEach(fn => {
        // Dynamic Proxy Resolver: Lazy evaluation at invocation time (handles body script execution timing)
        // FAIL LOUD: Throws explicit Error if handler implementation is missing at runtime (NO silent no-op fallbacks!)
        Object.defineProperty(legacyAPI, fn, {
            configurable: true,
            enumerable: true,
            get() {
                // If a real implementation exists on window (outside bridge), return it
                if (window.__realHandlers && typeof window.__realHandlers[fn] === 'function') {
                    return window.__realHandlers[fn];
                }
                
                return function(...args) {
                    // Check if function was declared later by body script
                    const realFn = window[`__fn_impl_${fn}`] || window[fn];
                    if (typeof realFn === 'function' && realFn !== legacyAPI[fn]) {
                        return realFn.apply(this, args);
                    }
                    // FAIL LOUD: Throw explicit runtime error instead of manufacturing a fake handler
                    throw new Error(`[LegacyBridge CRITICAL FAIL] Required handler '${fn}' is invoked but missing implementation!`);
                };
            }
        });
    });

    Object.assign(window, legacyAPI);
    console.log(`[LegacyBridge] Initialized lazy fail-loud bridge for ${LEGACY_HANDLERS_ALLOWLIST.length} handlers.`);
}
