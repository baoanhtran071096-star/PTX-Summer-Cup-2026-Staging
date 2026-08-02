/**
 * UI Orchestration Adapters Layer for PTX Summer Cup 2026.
 * Bridges legacy handler call signatures with initialization logic and pure UI primitives.
 * Keeps src/ui/ 100% PURE (DOM visibility & presentation primitives only).
 */

import { navigate as pureNavigate } from '../ui/navigation.js';
import { setTeamSubTabUI, setAdminTabUI, setFifaTeamFilterUI, setGalleryFilterUI } from '../ui/filters.js';
import {
    showLoginModal, hideLoginModal,
    showAiGrowthModal, hideAiGrowthModal,
    showVipTicketModal, hideVipTicketModal,
    showComparePlayersModal, hideComparePlayersModal,
    showInfographicModal, hideInfographicModal,
    showLiveStreamHubModal, hideLiveStreamHubModal,
    showAiPressReleaseModal, hideAiPressReleaseModal,
    showStadiumDJModal, hideStadiumDJModal,
    showTacticalVisualizerModal, hideTacticalVisualizerModal
} from '../ui/modals.js';

// 1. Navigation Adapter
export function navigateAdapter(pageId) {
    pureNavigate(pageId);
    if (typeof window !== 'undefined') {
        const clean = pageId ? pageId.replace(/^#\/?/, '').trim() : 'home';
        try { if (typeof window.setStorageItem === 'function') window.setStorageItem('currentPage', clean); } catch (e) {}

        if (clean === 'home') {
            try { if (typeof window.renderAllMatches === 'function') window.renderAllMatches(); } catch (e) {}
            try { if (typeof window.renderStandings === 'function') window.renderStandings(); } catch (e) {}
            try { if (typeof window.updateDashboard === 'function') window.updateDashboard(); } catch (e) {}
        } else if (clean === 'schedule') {
            try { if (typeof window.renderAllMatches === 'function') window.renderAllMatches(); } catch (e) {}
        } else if (clean === 'standings') {
            try { if (typeof window.renderStandingsPageTable === 'function') window.renderStandingsPageTable(); } catch (e) {}
        } else if (clean === 'teams' || clean === 'players') {
            try { if (typeof window.renderTeamStats === 'function') window.renderTeamStats(); } catch (e) {}
            try { if (typeof window.renderPlayerCards === 'function') window.renderPlayerCards(); } catch (e) {}
        } else if (clean === 'gallery') {
            try { if (typeof window.renderGalleryPage === 'function') window.renderGalleryPage(); } catch (e) {}
        } else if (clean === 'hall-of-fame') {
            try { if (typeof window.renderHallOfFame === 'function') window.renderHallOfFame(); } catch (e) {}
        } else if (clean === 'admin') {
            try { if (typeof window.loadAdminData === 'function') window.loadAdminData(); } catch (e) {}
        }
        try { if (typeof window.revealActivePage === 'function') window.revealActivePage(); } catch (e) {}
    }
}

// 2. Team SubTab Adapter
export function switchTeamSubTabAdapter(mode) {
    setTeamSubTabUI(mode);
    if (mode !== 'roster' && typeof window !== 'undefined' && typeof window.render5v5Pitch === 'function') {
        window.render5v5Pitch();
    }
}

// 3. Admin Tab Adapter
export function switchAdminTabAdapter(index) {
    setAdminTabUI(index);
    if (index === 2 && typeof window !== 'undefined' && typeof window.populateAdminPlayerSelect === 'function') {
        window.populateAdminPlayerSelect();
    }
}

// 4. FIFA Team Filter Adapter
export function filterFifaByTeamAdapter(teamId, btn) {
    if (typeof window !== 'undefined') window.currentFifaTeamFilter = teamId;
    setFifaTeamFilterUI(btn);
    if (typeof window !== 'undefined' && typeof window.renderPlayerCards === 'function') {
        window.renderPlayerCards();
    }
}

// 5. Gallery Filter Adapter
export function filterGalleryPageAdapter(cat, btn) {
    if (typeof window !== 'undefined') window.galleryCurrentFilter = cat;
    setGalleryFilterUI(btn);
    if (typeof window !== 'undefined' && typeof window.renderGalleryPage === 'function') {
        window.renderGalleryPage();
    }
}

// 6. Tactical Visualizer Modal Adapter
export function openTacticalVisualizerModalAdapter() {
    const container = document.getElementById('tacticalGridContainer');
    const formations = (typeof window !== 'undefined' && window.TACTICAL_FORMATIONS_LIST) || [];
    const currentFormation = (typeof window !== 'undefined' && window.pitchFormation) || '1-2-1';

    if (container && formations.length > 0) {
        container.innerHTML = '';
        formations.forEach(item => {
            const isActive = currentFormation === item.code;
            const card = document.createElement('div');
            card.style.cssText = `background:${isActive ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)'};border:2px solid ${isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)'};border-radius:16px;padding:16px;cursor:pointer;transition:all 0.25s ease;position:relative;`;
            card.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                    <span style="font-size:22px;">${item.icon}</span>
                    <span style="font-size:11px;font-weight:900;background:${isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)'};color:#fff;padding:2px 8px;border-radius:8px;">${item.code}</span>
                </div>
                <div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:4px;">${item.name}</div>
                <div style="font-size:11px;color:#60a5fa;font-weight:700;margin-bottom:8px;">⚡ ${item.style}</div>
                <div style="font-size:11px;color:#94a3b8;">${item.desc}</div>
                ${isActive ? '<div style="margin-top:10px;text-align:center;font-size:11px;font-weight:900;color:#4ade80;">✓ ĐANG ÁP DỤNG TRÊN SÂN 3D</div>' : ''}
            `;
            card.addEventListener('click', () => {
                if (typeof window !== 'undefined' && typeof window.changePitchFormation === 'function') {
                    window.changePitchFormation(item.code);
                }
                closeTacticalVisualizerModalAdapter();
            });
            container.appendChild(card);
        });
    }
    showTacticalVisualizerModal();
}

export function closeTacticalVisualizerModalAdapter() {
    hideTacticalVisualizerModal();
}

// 7. Login Modal Adapter
export function openLoginAdapter() {
    showLoginModal();
}

export function closeLoginAdapter() {
    hideLoginModal();
    const err = document.getElementById('loginError');
    if (err) err.style.display = 'none';
}

// 8. AI Growth Modal Adapter
export function openAiGrowthModalAdapter() {
    showAiGrowthModal();
}

export function closeAiGrowthModalAdapter() {
    hideAiGrowthModal();
}

// 9. VIP Ticket Modal Adapter
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

// 10. Compare Players Modal Adapter
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

// 11. Infographic Modal Adapter
export function openInfographicModalAdapter() {
    showInfographicModal();
    if (typeof window !== 'undefined' && typeof window.drawInfographicCanvas === 'function') {
        setTimeout(window.drawInfographicCanvas, 100);
    }
}

export function closeInfographicModalAdapter() {
    hideInfographicModal();
}

// 12. LiveStream Hub Modal Adapter
export function openLiveStreamHubModalAdapter() {
    showLiveStreamHubModal();
    if (typeof window !== 'undefined' && typeof window.onLiveStreamMatchChange === 'function') {
        window.onLiveStreamMatchChange();
    }
}

export function closeLiveStreamHubModalAdapter() {
    hideLiveStreamHubModal();
}

// 13. AI Press Release Modal Adapter
export function openAiPressReleaseModalAdapter() {
    showAiPressReleaseModal();
    if (typeof window !== 'undefined' && typeof window.generateAIPressRelease === 'function') {
        window.generateAIPressRelease('PRE_MATCH');
    }
}

export function closeAiPressReleaseModalAdapter() {
    hideAiPressReleaseModal();
}

// 14. Stadium DJ Modal Adapter
export function openStadiumDJModalAdapter() {
    showStadiumDJModal();
}

export function closeStadiumDJModalAdapter() {
    hideStadiumDJModal();
}
