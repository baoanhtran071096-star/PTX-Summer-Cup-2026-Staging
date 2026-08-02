/**
 * UI Orchestration Adapters Layer for PTX Summer Cup 2026.
 * Bridges legacy handler call signatures with initialization logic and pure UI primitives.
 * Keeps src/ui/modals.js 100% PURE (DOM visibility primitives only).
 */

import {
    showLoginModal, hideLoginModal,
    showAiGrowthModal, hideAiGrowthModal,
    showVipTicketModal, hideVipTicketModal,
    showComparePlayersModal, hideComparePlayersModal,
    showInfographicModal, hideInfographicModal,
    showLiveStreamHubModal, hideLiveStreamHubModal,
    showAiPressReleaseModal, hideAiPressReleaseModal,
    showStadiumDJModal, hideStadiumDJModal
} from '../ui/modals.js';

// 1. Login Modal Adapter
export function openLoginAdapter() {
    showLoginModal();
}

export function closeLoginAdapter() {
    hideLoginModal();
    const err = document.getElementById('loginError');
    if (err) err.style.display = 'none';
}

// 2. AI Growth Modal Adapter
export function openAiGrowthModalAdapter() {
    showAiGrowthModal();
}

export function closeAiGrowthModalAdapter() {
    hideAiGrowthModal();
}

// 3. VIP Ticket Modal Adapter
export function openVipTicketModalAdapter(playerName) {
    const input = document.getElementById('ticketNameInput');
    if (input) {
        if (playerName && typeof playerName === 'string') {
            input.value = playerName.toUpperCase();
        } else {
            input.value = 'KYLIAN MBAPPÉ';
        }
        if (typeof window !== 'undefined' && typeof window.updateTicketName === 'function') {
            window.updateTicketName(input.value);
        }
    }
    showVipTicketModal();
}

export function closeVipTicketModalAdapter() {
    hideVipTicketModal();
}

// 4. Compare Players Modal Adapter
export function openComparePlayersModalAdapter(player1Id, player2Id) {
    const sel1 = document.getElementById('compareSelect1');
    const sel2 = document.getElementById('compareSelect2');
    
    if (sel1 && sel2) {
        sel1.innerHTML = '';
        sel2.innerHTML = '';

        const players = (typeof window !== 'undefined' && window.PLAYERS_DATA) || [];
        const teams = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};

        players.forEach((p) => {
            const team = teams[p.team];
            const opt1 = document.createElement('option');
            opt1.value = p.id;
            opt1.textContent = `[${team ? team.name : p.team}] #${p.number} ${p.name} (${p.position})`;
            sel1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = p.id;
            opt2.textContent = `[${team ? team.name : p.team}] #${p.number} ${p.name} (${p.position})`;
            sel2.appendChild(opt2);
        });

        if (player1Id) sel1.value = player1Id;
        if (player2Id) sel2.value = player2Id;

        if (typeof window !== 'undefined' && typeof window.renderCompareView === 'function') {
            window.renderCompareView();
        }
    }
    showComparePlayersModal();
}

export function closeComparePlayersModalAdapter() {
    hideComparePlayersModal();
}

// 5. Infographic Modal Adapter
export function openInfographicModalAdapter() {
    showInfographicModal();
    if (typeof window !== 'undefined' && typeof window.drawInfographicCanvas === 'function') {
        setTimeout(window.drawInfographicCanvas, 100);
    }
}

export function closeInfographicModalAdapter() {
    hideInfographicModal();
}

// 6. LiveStream Hub Modal Adapter
export function openLiveStreamHubModalAdapter() {
    showLiveStreamHubModal();
    if (typeof window !== 'undefined' && typeof window.onLiveStreamMatchChange === 'function') {
        window.onLiveStreamMatchChange();
    }
}

export function closeLiveStreamHubModalAdapter() {
    hideLiveStreamHubModal();
}

// 7. AI Press Release Modal Adapter
export function openAiPressReleaseModalAdapter() {
    showAiPressReleaseModal();
    if (typeof window !== 'undefined' && typeof window.generateAIPressRelease === 'function') {
        window.generateAIPressRelease('PRE_MATCH');
    }
}

export function closeAiPressReleaseModalAdapter() {
    hideAiPressReleaseModal();
}

// 8. Stadium DJ Modal Adapter
export function openStadiumDJModalAdapter() {
    showStadiumDJModal();
}

export function closeStadiumDJModalAdapter() {
    hideStadiumDJModal();
}
