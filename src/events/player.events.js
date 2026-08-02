/**
 * PTX Summer Cup 2026 - Player & Dynamic Collection Event Module (Phase 2E.2)
 * Strictly Bounded Event Delegation for Player Cards, Gallery Lightbox, Pitch Controls, and Trophy Room.
 * Architectural Guard (2E.2-M): Strictly bounded listener attachments on audited containers only.
 */

import { openPlayerModalByIdAdapter, selectPitchTeamAdapter, autoOptimize5v5SquadAdapter, openSubstitutionModalByIdAdapter } from '../adapters/players.adapters.js';
import { openLightboxAdapter } from '../adapters/gallery.adapters.js';

let playerEventsInitialized = false;

export function initPlayerEvents() {
    if (playerEventsInitialized) return false;
    playerEventsInitialized = true;

    // 1. Bounded Delegation: Player Cards (#teamsPageRostersView / #teams / #players)
    const playerContainers = [
        document.getElementById('teamsPageRostersView'),
        document.getElementById('teams'),
        document.getElementById('players')
    ].filter(Boolean);

    playerContainers.forEach(container => {
        container.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-action="open-player"]');
            if (!trigger || !container.contains(trigger)) return;
            const playerIdStr = trigger.getAttribute('data-player-id');
            const playerId = parseInt(playerIdStr, 10);
            if (!isNaN(playerId)) {
                openPlayerModalByIdAdapter(playerId);
            }
        });
    });

    // 2. Bounded Delegation: Gallery Grid (#galleryGrid / #gallery / #hofGridV2Page)
    const galleryContainers = [
        document.getElementById('galleryGrid'),
        document.getElementById('gallery'),
        document.getElementById('hofGridV2Page')
    ].filter(Boolean);

    galleryContainers.forEach(container => {
        container.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-action="open-lightbox"]');
            if (!trigger || !container.contains(trigger)) return;
            const canonicalSrc = trigger.currentSrc || trigger.src || trigger.getAttribute('src');
            if (canonicalSrc) {
                openLightboxAdapter(canonicalSrc);
            }
        });
    });

    // 3. Bounded Delegation: 5v5 Pitch View Controls (#teamsPagePitchView / #pitchTeamSelector)
    const pitchContainers = [
        document.getElementById('teamsPagePitchView'),
        document.getElementById('pitchTeamSelector')
    ].filter(Boolean);

    pitchContainers.forEach(container => {
        container.addEventListener('click', (event) => {
            // 3a. Select Pitch Team
            const teamTrigger = event.target.closest('[data-action="select-pitch-team"]');
            if (teamTrigger && container.contains(teamTrigger)) {
                const teamId = teamTrigger.getAttribute('data-team');
                if (teamId) selectPitchTeamAdapter(teamId);
                return;
            }

            // 3b. Auto Optimize 5v5 Squad
            const optimizeTrigger = event.target.closest('[data-action="auto-optimize-squad"]');
            if (optimizeTrigger && container.contains(optimizeTrigger)) {
                autoOptimize5v5SquadAdapter();
                return;
            }

            // 3c. Open Substitution Modal
            const subTrigger = event.target.closest('[data-action="open-substitution"]');
            if (subTrigger && container.contains(subTrigger)) {
                const playerIdStr = subTrigger.getAttribute('data-player-id');
                const playerId = parseInt(playerIdStr, 10);
                if (!isNaN(playerId)) openSubstitutionModalByIdAdapter(playerId);
                return;
            }
        });
    });

    // 4. Bounded Change Listener: Formation Select (#pitchFormationSelect)
    const formationSelect = document.getElementById('pitchFormationSelect');
    if (formationSelect) {
        formationSelect.addEventListener('change', (event) => {
            const fmt = event.target.value;
            if (typeof window !== 'undefined' && typeof window.changePitchFormation === 'function') {
                window.changePitchFormation(fmt);
            }
        });
    }

    // 5. Bounded Delegation: Substitution Modal Content (#substitutionModal)
    const substitutionModal = document.getElementById('substitutionModal');
    if (substitutionModal) {
        substitutionModal.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-action="open-substitution"]');
            if (!trigger || !substitutionModal.contains(trigger)) return;
            const playerIdStr = trigger.getAttribute('data-player-id');
            const playerId = parseInt(playerIdStr, 10);
            if (!isNaN(playerId)) openSubstitutionModalByIdAdapter(playerId);
        });
    }

    // 6. Bounded Delegation: 3D Trophy Room (#trophyRoomContainer)
    const trophyContainer = document.getElementById('trophyRoomContainer');
    if (trophyContainer) {
        trophyContainer.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-action="trigger-trophy-rotate"]');
            if (!trigger || !trophyContainer.contains(trigger)) return;
            if (typeof window !== 'undefined' && typeof window.triggerTrophyRotate === 'function') {
                window.triggerTrophyRotate(trigger);
            }
        });
    }

    return true;
}
