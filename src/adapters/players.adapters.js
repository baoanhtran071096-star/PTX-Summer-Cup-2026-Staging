/**
 * Players View Orchestration Adapter for PTX Summer Cup 2026.
 * Bridges application state/config with pure Players View Renderers.
 */

import { renderTeamRostersGrid, renderPlayerCardsGrid } from '../ui/views/players.view.js';
import { initFifa3DTilt as pureInitFifa3DTilt } from '../ui/effects/fifa-tilt.js';

export function renderTeamRostersAdapter(containerId = 'teamsPageRostersView') {
    const container = document.getElementById(containerId);
    const playersData = (typeof window !== 'undefined' && window.PLAYERS_DATA) || [];
    const teamsData = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};
    const pitchStartersData = (typeof window !== 'undefined' && window.pitchStarters) || {};
    const renderLogoFn = (typeof window !== 'undefined' && window.renderTeamLogo) || (() => '');

    renderTeamRostersGrid(container, playersData, teamsData, pitchStartersData, renderLogoFn);
}

export function renderPlayerCardsAdapter() {
    renderTeamRostersAdapter('teamsPageRostersView');

    const containers = [
        { el: document.getElementById('playerGridFifaHome'), isPage: false },
        { el: document.getElementById('playerGridFifaPage'), isPage: true },
        { el: document.getElementById('playerGridFifa'), isPage: false }
    ];

    const playersData = (typeof window !== 'undefined' && window.PLAYERS_DATA) || [];
    const teamsData = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};
    const currentFilter = (typeof window !== 'undefined' && window.currentFifaTeamFilter) || 'all';
    const renderLogoFn = (typeof window !== 'undefined' && window.renderTeamLogo) || (() => '');
    const onCardClickFn = (typeof window !== 'undefined' && window.openPlayerModal) || (() => {});

    renderPlayerCardsGrid(containers, playersData, teamsData, currentFilter, renderLogoFn, onCardClickFn);

    setTimeout(pureInitFifa3DTilt, 100);
}

export function openPlayerModalByIdAdapter(id) {
    const playersData = (typeof window !== 'undefined' && window.PLAYERS_DATA) || [];
    const player = playersData.find(p => p.id === id);
    if (player && typeof window !== 'undefined' && typeof window.openPlayerModal === 'function') {
        window.openPlayerModal(player);
    }
}

export function selectPitchTeamAdapter(teamId) {
    if (typeof window !== 'undefined' && typeof window.selectPitchTeam === 'function') {
        window.selectPitchTeam(teamId);
    }
}

export function autoOptimize5v5SquadAdapter() {
    if (typeof window !== 'undefined' && typeof window.autoOptimize5v5Squad === 'function') {
        window.autoOptimize5v5Squad();
    }
}

export function openSubstitutionModalByIdAdapter(id) {
    if (typeof window !== 'undefined' && typeof window.openSubstitutionModalById === 'function') {
        window.openSubstitutionModalById(id);
    }
}
