/**
 * PTX Summer Cup 2026 - Prediction, Form & Realtime Event Module (Phase 2E.3)
 * Native Semantic Events (submit, input, change, bounded click) for Forms and Prediction Flows.
 * Architectural Guards (2E.3):
 * 1. Single Canonical Submit Path (no dual click+submit bindings).
 * 2. Strict Change Owner Guard on compare selects.
 * 3. Synchronous user gesture dispatch (clipboard, share, canvas download).
 * 4. ZERO document.body fallback, ZERO document.addEventListener() calls.
 */

import {
    submitFanPredictionAdapter,
    aiAutoSuggestPredictionAdapter,
    loadSamplePredictionsAdapter,
    clearAllPredictionsListAdapter,
    downloadVIPPredictionTicketAdapter,
    runAiPredictionDemoAdapter,
    predictChampionDemoAdapter,
    submitSponsorContactAdapter,
    scrollSponsorFormAdapter,
    selectSponsorPackageAdapter,
    copyBankStkAdapter,
    renderCompareViewAdapter,
    updateTicketNameAdapter,
    randomizeTicketSerialAdapter,
    downloadVipTicketImageAdapter,
    downloadInfographicImageAdapter,
    generateAIPressReleaseAdapter,
    copyPressReleaseTextAdapter,
    loadCustomLiveStreamAdapter,
    sendLiveReactionAdapter,
    sendLiveChatMessageAdapter,
    togglePTXChatbotWindowAdapter,
    sendPTXChatQuickAdapter,
    sendPTXChatMessageAdapter,
    loadVideoClipAdapter,
    shareResultAdapter,
    generateReferralDemoAdapter
} from '../adapters/prediction.adapters.js';

let predictionEventsInitialized = false;

export function initPredictionEvents() {
    if (predictionEventsInitialized) return false;
    predictionEventsInitialized = true;

    // ==========================================
    // 1. Fan Prediction Form & Controls
    // ==========================================
    const fanPredictionForm = document.getElementById('fanPredictionForm');
    if (fanPredictionForm) {
        // Single Canonical Submit Path (Guard 2)
        fanPredictionForm.addEventListener('submit', (event) => {
            submitFanPredictionAdapter(event);
        });

        // Bounded Delegation for Prediction Controls within Fan Prediction Container
        fanPredictionForm.addEventListener('click', (event) => {
            const suggestBtn = event.target.closest('[data-action="ai-auto-suggest-prediction"]');
            if (suggestBtn && fanPredictionForm.contains(suggestBtn)) {
                aiAutoSuggestPredictionAdapter();
                return;
            }

            const sampleBtn = event.target.closest('[data-action="load-sample-predictions"]');
            if (sampleBtn && fanPredictionForm.contains(sampleBtn)) {
                loadSamplePredictionsAdapter();
                return;
            }

            const clearBtn = event.target.closest('[data-action="clear-all-predictions"]');
            if (clearBtn && fanPredictionForm.contains(clearBtn)) {
                clearAllPredictionsListAdapter();
                return;
            }

            const ticketBtn = event.target.closest('[data-action="download-vip-prediction-ticket"]');
            if (ticketBtn && fanPredictionForm.contains(ticketBtn)) {
                downloadVIPPredictionTicketAdapter();
                return;
            }
        });
    }

    // AI Prediction Demo Section Bounded Controls
    const predictionDemoSection = document.getElementById('predictionDemoSection');
    if (predictionDemoSection) {
        predictionDemoSection.addEventListener('click', (event) => {
            const demoBtn = event.target.closest('[data-action="run-ai-prediction-demo"]');
            if (demoBtn && predictionDemoSection.contains(demoBtn)) {
                runAiPredictionDemoAdapter();
                return;
            }

            const champBtn = event.target.closest('[data-action="predict-champion-demo"]');
            if (champBtn && predictionDemoSection.contains(champBtn)) {
                const team = champBtn.getAttribute('data-team');
                if (team) predictChampionDemoAdapter(team);
                return;
            }
        });
    }

    // ==========================================
    // 2. Sponsor Form & Package Selection
    // ==========================================
    const sponsorContactForm = document.getElementById('sponsorContactForm');
    if (sponsorContactForm) {
        // Single Canonical Submit Path (Guard 2)
        sponsorContactForm.addEventListener('submit', (event) => {
            submitSponsorContactAdapter(event);
        });
    }

    const sponsorSection = document.getElementById('sponsorSection');
    if (sponsorSection) {
        sponsorSection.addEventListener('click', (event) => {
            const scrollBtn = event.target.closest('[data-action="scroll-sponsor-form"]');
            if (scrollBtn && sponsorSection.contains(scrollBtn)) {
                scrollSponsorFormAdapter();
                return;
            }

            const pkgBtn = event.target.closest('[data-action="select-sponsor-package"]');
            if (pkgBtn && sponsorSection.contains(pkgBtn)) {
                const pkgName = pkgBtn.getAttribute('data-package');
                if (pkgName) selectSponsorPackageAdapter(pkgName);
                return;
            }
        });
    }

    const bankInfoContainer = document.getElementById('bankInfoContainer');
    if (bankInfoContainer) {
        bankInfoContainer.addEventListener('click', (event) => {
            const copyBtn = event.target.closest('[data-action="copy-bank-stk"]');
            if (copyBtn && bankInfoContainer.contains(copyBtn)) {
                copyBankStkAdapter();
            }
        });
    }

    // ==========================================
    // 3. Interactive Modals & Realtime Inputs
    // ==========================================
    // 3a. Compare Players Modal
    const comparePlayersModal = document.getElementById('comparePlayersModal');
    if (comparePlayersModal) {
        // Guard 3: Strict Change Owner Guard
        comparePlayersModal.addEventListener('change', (event) => {
            const targetId = event.target && event.target.id;
            if (['compareP1Select', 'compareP2Select', 'compareSelect1', 'compareSelect2'].includes(targetId)) {
                renderCompareViewAdapter();
            }
        });
    }

    // Also check inline compare selects if rendered outside comparePlayersModal
    const compareSelects = [
        document.getElementById('compareP1Select'),
        document.getElementById('compareP2Select'),
        document.getElementById('compareSelect1'),
        document.getElementById('compareSelect2')
    ].filter(Boolean);

    compareSelects.forEach(selectEl => {
        selectEl.addEventListener('change', () => {
            renderCompareViewAdapter();
        });
    });

    // 3b. VIP Ticket Modal & Realtime Input Preview
    const vipTicketModal = document.getElementById('vipTicketModal');
    if (vipTicketModal) {
        const nameInput = document.getElementById('ticketNameInput') || document.getElementById('vipTicketNameInput');
        if (nameInput) {
            nameInput.addEventListener('input', (event) => {
                updateTicketNameAdapter(event.target.value);
            });
        }

        vipTicketModal.addEventListener('click', (event) => {
            const serialBtn = event.target.closest('[data-action="randomize-ticket-serial"]');
            if (serialBtn && vipTicketModal.contains(serialBtn)) {
                randomizeTicketSerialAdapter();
                return;
            }

            const downloadBtn = event.target.closest('[data-action="download-vip-ticket-image"]');
            if (downloadBtn && vipTicketModal.contains(downloadBtn)) {
                downloadVipTicketImageAdapter();
                return;
            }
        });
    }

    // 3c. Infographic Modal
    const infographicModal = document.getElementById('infographicModal');
    if (infographicModal) {
        infographicModal.addEventListener('click', (event) => {
            const downloadBtn = event.target.closest('[data-action="download-infographic-image"]');
            if (downloadBtn && infographicModal.contains(downloadBtn)) {
                downloadInfographicImageAdapter();
            }
        });
    }

    // 3d. AI Press Release Modal
    const aiPressReleaseModal = document.getElementById('aiPressReleaseModal');
    if (aiPressReleaseModal) {
        aiPressReleaseModal.addEventListener('click', (event) => {
            const generateBtn = event.target.closest('[data-action="generate-ai-press-release"]');
            if (generateBtn && aiPressReleaseModal.contains(generateBtn)) {
                const releaseType = generateBtn.getAttribute('data-release-type') || 'PRE_MATCH';
                generateAIPressReleaseAdapter(releaseType);
                return;
            }

            const copyBtn = event.target.closest('[data-action="copy-press-release-text"]');
            if (copyBtn && aiPressReleaseModal.contains(copyBtn)) {
                copyPressReleaseTextAdapter();
                return;
            }
        });
    }

    // ==========================================
    // 4. LiveStream Hub, Chatbot & Media Highlights
    // ==========================================
    // 4a. LiveStream Hub Modal
    const liveStreamHubModal = document.getElementById('liveStreamHubModal');
    const liveChatForm = document.getElementById('liveChatForm') || (liveStreamHubModal && typeof liveStreamHubModal.querySelector === 'function' ? liveStreamHubModal.querySelector('#liveChatForm') : null);
    if (liveChatForm) {
        liveChatForm.addEventListener('submit', (event) => {
            sendLiveChatMessageAdapter(event);
        });
    }

    if (liveStreamHubModal) {
        liveStreamHubModal.addEventListener('click', (event) => {
            const customStreamBtn = event.target.closest('[data-action="load-custom-livestream"]');
            if (customStreamBtn && liveStreamHubModal.contains(customStreamBtn)) {
                loadCustomLiveStreamAdapter();
                return;
            }

            const reactionBtn = event.target.closest('[data-action="send-live-reaction"]');
            if (reactionBtn && liveStreamHubModal.contains(reactionBtn)) {
                const emoji = reactionBtn.getAttribute('data-emoji') || '⚽';
                sendLiveReactionAdapter(emoji);
                return;
            }
        });
    }

    // Also attach to document level if elements exist outside liveStreamHubModal
    const standaloneCustomStreamBtn = document.querySelector('[data-action="load-custom-livestream"]');
    if (standaloneCustomStreamBtn) {
        standaloneCustomStreamBtn.addEventListener('click', () => loadCustomLiveStreamAdapter());
    }

    // 4b. Floating Chatbot Widget
    const ptxChatbotWidget = document.getElementById('ptxChatbotWidget') || document.getElementById('ptxAiChatWidget');
    const ptxChatbotForm = document.getElementById('ptxChatbotForm') || (ptxChatbotWidget && typeof ptxChatbotWidget.querySelector === 'function' ? ptxChatbotWidget.querySelector('#ptxChatbotForm') : null);
    if (ptxChatbotForm) {
        ptxChatbotForm.addEventListener('submit', (event) => {
            sendPTXChatMessageAdapter(event);
        });
    }

    if (ptxChatbotWidget) {
        ptxChatbotWidget.addEventListener('click', (event) => {
            const toggleBtn = event.target.closest('[data-action="toggle-ptx-chatbot"]');
            if (toggleBtn && ptxChatbotWidget.contains(toggleBtn)) {
                togglePTXChatbotWindowAdapter();
                return;
            }

            const quickBtn = event.target.closest('[data-action="send-ptx-chat-quick"]');
            if (quickBtn && ptxChatbotWidget.contains(quickBtn)) {
                const promptText = quickBtn.getAttribute('data-prompt');
                if (promptText) sendPTXChatQuickAdapter(promptText);
                return;
            }
        });
    }

    // 4c. Video Highlights Modal Container
    const videoHighlightsModal = document.getElementById('videoHighlightsModal');
    if (videoHighlightsModal) {
        videoHighlightsModal.addEventListener('click', (event) => {
            const videoBtn = event.target.closest('[data-action="load-video-clip"]');
            if (videoBtn && videoHighlightsModal.contains(videoBtn)) {
                const videoUrl = videoBtn.getAttribute('data-video-url');
                if (videoUrl) loadVideoClipAdapter(videoUrl);
            }
        });
    }

    // 4d. Share Modal Container
    const shareModalContainer = document.getElementById('shareModalContainer');
    if (shareModalContainer) {
        shareModalContainer.addEventListener('click', (event) => {
            const shareBtn = event.target.closest('[data-action="share-result"]');
            if (shareBtn && shareModalContainer.contains(shareBtn)) {
                const type = shareBtn.getAttribute('data-share-type') || 'match';
                shareResultAdapter(type);
            }
        });
    }

    // 4e. Referral Demo Container
    const referralDemoContainer = document.getElementById('referralDemoContainer');
    if (referralDemoContainer) {
        referralDemoContainer.addEventListener('click', (event) => {
            const refBtn = event.target.closest('[data-action="generate-referral-demo"]');
            if (refBtn && referralDemoContainer.contains(refBtn)) {
                generateReferralDemoAdapter();
            }
        });
    }

    return true;
}
