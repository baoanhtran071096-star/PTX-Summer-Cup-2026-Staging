// ============================================================
// PHASE 2D — LEGACY HANDLER ALLOWLIST BRIDGE (ES MODULE BOUNDARY)
// ============================================================

export function initLegacyBridge() {
    if (typeof window === 'undefined') return;

    // Explicit allowlist of unique handler names required by HTML inline events
    const legacyHandlers = [
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

    const legacyAPI = {};
    legacyHandlers.forEach(fn => {
        if (typeof window[fn] === 'function') {
            legacyAPI[fn] = window[fn];
        } else {
            // Strict assertion: throw explicit warning if a handler is referenced but missing
            legacyAPI[fn] = function(...args) {
                if (typeof window[fn] === 'function' && window[fn] !== legacyAPI[fn]) {
                    return window[fn](...args);
                }
                console.warn(`[LegacyBridge] Calling missing handler: ${fn}`);
            };
        }
    });

    Object.assign(window, legacyAPI);
}
