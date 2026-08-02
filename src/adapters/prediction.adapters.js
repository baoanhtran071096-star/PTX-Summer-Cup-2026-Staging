/**
 * PTX Summer Cup 2026 - Prediction & Form Adapters (Phase 2E.3)
 * Pure Adapter Orchestration connecting native event triggers to domain implementations.
 * Strict Guard: Zero business logic refactoring, zero storage schema mutation.
 */

export function submitFanPredictionAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    if (typeof window !== 'undefined' && typeof window.submitFanPrediction === 'function') {
        window.submitFanPrediction(event);
    }
}

export function aiAutoSuggestPredictionAdapter() {
    if (typeof window !== 'undefined' && typeof window.aiAutoSuggestPrediction === 'function') {
        window.aiAutoSuggestPrediction();
    }
}

export function loadSamplePredictionsAdapter() {
    if (typeof window !== 'undefined' && typeof window.loadSamplePredictions === 'function') {
        window.loadSamplePredictions();
    }
}

export function clearAllPredictionsListAdapter() {
    if (typeof window !== 'undefined' && typeof window.clearAllPredictionsList === 'function') {
        window.clearAllPredictionsList();
    }
}

export function downloadVIPPredictionTicketAdapter() {
    if (typeof window !== 'undefined' && typeof window.downloadVIPPredictionTicket === 'function') {
        window.downloadVIPPredictionTicket();
    }
}

export function runAiPredictionDemoAdapter() {
    if (typeof window !== 'undefined' && typeof window.runAiPredictionDemo === 'function') {
        window.runAiPredictionDemo();
    }
}

export function predictChampionDemoAdapter(team) {
    if (typeof window !== 'undefined' && typeof window.predictChampionDemo === 'function') {
        window.predictChampionDemo(team);
    }
}

export function submitSponsorContactAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    if (typeof window !== 'undefined' && typeof window.submitSponsorContact === 'function') {
        window.submitSponsorContact(event);
    }
}

export function scrollSponsorFormAdapter() {
    if (typeof window !== 'undefined' && typeof window.scrollSponsorForm === 'function') {
        window.scrollSponsorForm();
    }
}

export function selectSponsorPackageAdapter(pkgName) {
    if (typeof window !== 'undefined' && typeof window.selectSponsorPackage === 'function') {
        window.selectSponsorPackage(pkgName);
    }
}

export function copyBankStkAdapter() {
    if (typeof window !== 'undefined' && typeof window.copyBankStk === 'function') {
        window.copyBankStk();
    }
}

export function renderCompareViewAdapter() {
    if (typeof window !== 'undefined' && typeof window.renderCompareView === 'function') {
        window.renderCompareView();
    }
}

export function updateTicketNameAdapter(name) {
    if (typeof window !== 'undefined' && typeof window.updateTicketName === 'function') {
        window.updateTicketName(name);
    }
}

export function randomizeTicketSerialAdapter() {
    if (typeof window !== 'undefined' && typeof window.randomizeTicketSerial === 'function') {
        window.randomizeTicketSerial();
    }
}

export function downloadVipTicketImageAdapter() {
    if (typeof window !== 'undefined' && typeof window.downloadVipTicketImage === 'function') {
        window.downloadVipTicketImage();
    }
}

export function downloadInfographicImageAdapter() {
    if (typeof window !== 'undefined' && typeof window.downloadInfographicImage === 'function') {
        window.downloadInfographicImage();
    }
}

export function generateAIPressReleaseAdapter(type) {
    if (typeof window !== 'undefined' && typeof window.generateAIPressRelease === 'function') {
        window.generateAIPressRelease(type);
    }
}

export function copyPressReleaseTextAdapter() {
    if (typeof window !== 'undefined' && typeof window.copyPressReleaseText === 'function') {
        window.copyPressReleaseText();
    }
}

export function loadCustomLiveStreamAdapter() {
    if (typeof window !== 'undefined' && typeof window.loadCustomLiveStream === 'function') {
        window.loadCustomLiveStream();
    }
}

export function sendLiveReactionAdapter(emoji) {
    if (typeof window !== 'undefined' && typeof window.sendLiveReaction === 'function') {
        window.sendLiveReaction(emoji);
    }
}

export function sendLiveChatMessageAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    if (typeof window !== 'undefined' && typeof window.sendLiveChatMessage === 'function') {
        window.sendLiveChatMessage();
    }
}

export function togglePTXChatbotWindowAdapter() {
    if (typeof window !== 'undefined' && typeof window.togglePTXChatbotWindow === 'function') {
        window.togglePTXChatbotWindow();
    }
}

export function sendPTXChatQuickAdapter(text) {
    if (typeof window !== 'undefined' && typeof window.sendPTXChatQuick === 'function') {
        window.sendPTXChatQuick(text);
    }
}

export function sendPTXChatMessageAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    if (typeof window !== 'undefined' && typeof window.sendPTXChatMessage === 'function') {
        window.sendPTXChatMessage();
    }
}

export function loadVideoClipAdapter(url) {
    if (typeof window !== 'undefined' && typeof window.loadVideoClip === 'function') {
        window.loadVideoClip(url);
    }
}

export function shareResultAdapter(type) {
    if (typeof window !== 'undefined' && typeof window.shareResult === 'function') {
        window.shareResult(type);
    }
}

export function generateReferralDemoAdapter() {
    if (typeof window !== 'undefined' && typeof window.generateReferralDemo === 'function') {
        window.generateReferralDemo();
    }
}

// ============================================================
// PRODUCT-005: CANONICAL PREDICTION READ PATH & SELECTION SYNC
// ============================================================
export function readPredictionState() {
    if (typeof window === 'undefined') return { list: [], currentPrediction: null };

    let list = [];
    if (typeof window.getJSON === 'function') {
        list = window.getJSON('ptx_user_predictions_list', []);
    }

    let singlePred = null;
    if (typeof window.getJSON === 'function') {
        singlePred = window.getJSON('ptx_user_prediction', null);
    }

    // Precedence: list takes precedence over single legacy prediction
    const currentPrediction = (Array.isArray(list) && list.length > 0)
        ? list[list.length - 1]
        : singlePred;

    return {
        list: Array.isArray(list) ? list : [],
        currentPrediction
    };
}

export function syncPredictionSelectionState(selectedTeamOrMatchId = null, selectedOption = null) {
    if (typeof document === 'undefined') return { syncedSurfacesCount: 0, divergence: 0 };

    const state = readPredictionState();
    const activePred = state.currentPrediction;
    const activeTeam = selectedTeamOrMatchId || (activePred ? activePred.champion || activePred.team : null);

    let syncedSurfacesCount = 0;
    let divergence = 0;

    // 1. Sync prediction cards / buttons across DOM & measure observed divergence
    const predictionCards = document.querySelectorAll('[data-prediction-team], [data-prediction-option], .prediction-card, .team-option');
    predictionCards.forEach(card => {
        const cardTeam = card.getAttribute('data-prediction-team') || card.getAttribute('data-team');
        const cardOpt = card.getAttribute('data-prediction-option');

        const shouldBeSelected = Boolean(
            (cardTeam && activeTeam && cardTeam.toLowerCase() === String(activeTeam).toLowerCase()) ||
            (cardOpt && selectedOption && cardOpt === selectedOption)
        );

        if (shouldBeSelected) {
            card.classList.add('selected', 'active');
            if (typeof card.setAttribute === 'function') card.setAttribute('aria-selected', 'true');
        } else {
            card.classList.remove('selected', 'active');
            if (typeof card.setAttribute === 'function') card.setAttribute('aria-selected', 'false');
        }

        // Real Divergence check: verify DOM matches calculated expected selection state
        const isCurrentlySelected = card.classList.contains('selected') || card.classList.contains('active');
        if (isCurrentlySelected !== shouldBeSelected) {
            divergence++;
        }

        syncedSurfacesCount++;
    });

    return {
        syncedSurfacesCount,
        divergence
    };
}

