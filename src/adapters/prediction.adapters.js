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
