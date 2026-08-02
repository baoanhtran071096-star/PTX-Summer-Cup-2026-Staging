/**
 * PTX Summer Cup 2026 - Modal & Simple UI Native Event Listeners (Wave 2E.1)
 * Idempotent Event Delegation for Modal Visibility & Primitive Controls.
 */

import {
    showLoginModal, hideLoginModal,
    showAiGrowthModal, hideAiGrowthModal,
    showInfographicModal, hideInfographicModal,
    showStadiumDJModal, hideStadiumDJModal,
    showTacticalVisualizerModal, hideTacticalVisualizerModal,
    hideComparePlayersModal, hideLiveStreamHubModal,
    hideAiPressReleaseModal, hideVipTicketModal
} from '../ui/modals.js';

import {
    openVipTicketModalAdapter,
    openComparePlayersModalAdapter,
    openLiveStreamHubModalAdapter,
    openAiPressReleaseModalAdapter
} from '../adapters/ui.adapters.js';

let modalEventsBound = false;

export function initModalEvents() {
    if (modalEventsBound) return;
    modalEventsBound = true;

    document.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-action');

        switch (action) {
            // Login Modal
            case 'openLogin':
                showLoginModal();
                break;
            case 'closeLogin':
                hideLoginModal();
                break;

            // AI Growth Modal
            case 'openAiGrowthModal':
                showAiGrowthModal();
                break;
            case 'closeAiGrowthModal':
                hideAiGrowthModal();
                break;

            // VIP Ticket Modal
            case 'openVipTicketModal':
                openVipTicketModalAdapter();
                break;
            case 'closeVipTicketModal':
                hideVipTicketModal();
                break;

            // Compare Players Modal
            case 'openComparePlayersModal':
                openComparePlayersModalAdapter();
                break;
            case 'closeComparePlayersModal':
            case 'closePlayerCompareModal':
                hideComparePlayersModal();
                break;

            // Infographic Modal
            case 'openInfographicModal':
                showInfographicModal();
                break;
            case 'closeInfographicModal':
                hideInfographicModal();
                break;

            // LiveStream Hub Modal
            case 'openLiveStreamHubModal':
                openLiveStreamHubModalAdapter();
                break;
            case 'closeLiveStreamHubModal':
                hideLiveStreamHubModal();
                break;

            // AI Press Release Modal
            case 'openAiPressReleaseModal':
                const matchId = actionBtn.getAttribute('data-match-id') || undefined;
                openAiPressReleaseModalAdapter(matchId);
                break;
            case 'closeAiPressReleaseModal':
                hideAiPressReleaseModal();
                break;

            // Stadium DJ Modal
            case 'openStadiumDJModal':
                showStadiumDJModal();
                break;
            case 'closeStadiumDJModal':
                hideStadiumDJModal();
                break;

            // Tactical Visualizer Modal
            case 'openTacticalVisualizerModal':
                showTacticalVisualizerModal();
                break;
            case 'closeTacticalVisualizerModal':
                hideTacticalVisualizerModal();
                break;

            // Other Simple Modals
            case 'closePlayerModal':
                if (typeof window.closePlayerModal === 'function') window.closePlayerModal();
                break;
            case 'closeSubstitutionModal':
                if (typeof window.closeSubstitutionModal === 'function') window.closeSubstitutionModal();
                break;
            case 'closeRefereeToolkit':
                if (typeof window.closeRefereeToolkit === 'function') window.closeRefereeToolkit();
                break;

            // PWA & Theme
            case 'dismissPWABanner':
                if (typeof window.dismissPWABanner === 'function') window.dismissPWABanner();
                break;
            case 'installPTXPWAApp':
                if (typeof window.installPTXPWAApp === 'function') window.installPTXPWAApp();
                break;
            case 'toggleTheme':
                if (typeof window.toggleTheme === 'function') window.toggleTheme();
                break;
        }
    });
}
