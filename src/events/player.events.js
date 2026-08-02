/**
 * PTX Summer Cup 2026 - Player & Dynamic Collection Event Module (Phase 2E.2)
 * Bounded Event Delegation for Player Cards, Gallery Lightbox, and Pitch Controls.
 * Strict Guard: Zero document-level giant router, zero storage/persistence mutation.
 */

import { openPlayerModalByIdAdapter, selectPitchTeamAdapter, autoOptimize5v5SquadAdapter, openSubstitutionModalByIdAdapter } from '../adapters/players.adapters.js';
import { openLightboxAdapter } from '../adapters/gallery.adapters.js';

let playerEventsInitialized = false;

export function initPlayerEvents() {
    if (playerEventsInitialized) return false;
    playerEventsInitialized = true;

    // 1. Bounded Delegation: Player Cards (Open Player Modal)
    const playerContainers = [
        document.getElementById('teamsPageRostersView'),
        document.getElementById('teams'),
        document.getElementById('players'),
        document.body
    ].filter(Boolean);

    const primaryPlayerContainer = playerContainers[0] || document.body;
    primaryPlayerContainer.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action="open-player"]');
        if (!trigger) return;
        const playerIdStr = trigger.getAttribute('data-player-id');
        const playerId = parseInt(playerIdStr, 10);
        if (!isNaN(playerId)) {
            openPlayerModalByIdAdapter(playerId);
        }
    });

    // 2. Bounded Delegation: Gallery Grid (Open Lightbox using canonical img src/currentSrc)
    const galleryContainers = [
        document.getElementById('galleryGrid'),
        document.getElementById('gallery'),
        document.body
    ].filter(Boolean);

    const primaryGalleryContainer = galleryContainers[0] || document.body;
    primaryGalleryContainer.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action="open-lightbox"]');
        if (!trigger) return;
        const canonicalSrc = trigger.currentSrc || trigger.src || trigger.getAttribute('src');
        if (canonicalSrc) {
            openLightboxAdapter(canonicalSrc);
        }
    });

    // 3. Pitch Team Selector Delegation
    const pitchTeamContainer = document.getElementById('pitchTeamSelector') || document.body;
    pitchTeamContainer.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action="select-pitch-team"]');
        if (!trigger) return;
        const teamId = trigger.getAttribute('data-team');
        if (teamId) {
            selectPitchTeamAdapter(teamId);
        }
    });

    // 4. Formation Select Change Listener
    const formationSelect = document.getElementById('pitchFormationSelect');
    if (formationSelect) {
        formationSelect.addEventListener('change', (event) => {
            const fmt = event.target.value;
            if (typeof window !== 'undefined' && typeof window.changePitchFormation === 'function') {
                window.changePitchFormation(fmt);
            }
        });
    }

    // 5. Auto Optimize 5v5 Squad Listener
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action="auto-optimize-squad"]');
        if (!trigger) return;
        autoOptimize5v5SquadAdapter();
    });

    // 6. Open Substitution Modal Listener
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action="open-substitution"]');
        if (!trigger) return;
        const playerIdStr = trigger.getAttribute('data-player-id');
        const playerId = parseInt(playerIdStr, 10);
        if (!isNaN(playerId)) {
            openSubstitutionModalByIdAdapter(playerId);
        }
    });

    // 7. Trophy 3D Rotation Animation Listener
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action="trigger-trophy-rotate"]');
        if (!trigger) return;
        if (typeof window !== 'undefined' && typeof window.triggerTrophyRotate === 'function') {
            window.triggerTrophyRotate(trigger);
        }
    });

    return true;
}
