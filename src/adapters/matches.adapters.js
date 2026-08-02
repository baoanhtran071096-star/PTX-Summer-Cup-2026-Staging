/**
 * Matches View Orchestration Adapter for PTX Summer Cup 2026.
 * Bridges application state/config with pure Matches View Renderers.
 */

import { renderMatchesGrid } from '../ui/views/matches.view.js';

export function renderAllMatchesAdapter() {
    const container = document.getElementById('matchGrid');
    const container2 = document.getElementById('matchGrid2');
    const filterEl = document.getElementById('matchFilter');
    const filter = filterEl ? filterEl.value : 'all';

    if (typeof window !== 'undefined') window.currentFilter = filter;
    const currentRoundFilter = (typeof window !== 'undefined' && window.currentRoundFilter) || 'all';

    const matchesConfig = (typeof window !== 'undefined' && window.MATCHES_CONFIG) || [];
    const teamsData = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};
    const parseGoalFn = (typeof window !== 'undefined' && window.parseGoalDataWithTeam) || (() => []);
    const renderLogoFn = (typeof window !== 'undefined' && window.renderTeamLogo) || (() => '');
    const baseDate = (typeof window !== 'undefined' && window.baseDate) || new Date();
    const nowDate = new Date();

    const resultsData = {};
    matchesConfig.forEach(m => {
        const res = (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_' + m.id) : null;
        if (res) resultsData[m.id] = res;
    });

    const filtered = matchesConfig.filter(m => {
        const matchesTeam = (filter === 'all') || (m.home === filter || m.away === filter);
        const matchesRound = (currentRoundFilter === 'all') || (m.id == currentRoundFilter);
        return matchesTeam && matchesRound;
    });

    renderMatchesGrid(container, filtered, teamsData, resultsData, parseGoalFn, renderLogoFn, baseDate, nowDate);
    renderMatchesGrid(container2, matchesConfig, teamsData, resultsData, parseGoalFn, renderLogoFn, baseDate, nowDate);

    if (typeof window !== 'undefined' && typeof window.updateStickyBar === 'function') {
        window.updateStickyBar();
    }
    if (typeof window !== 'undefined' && typeof window.applyLanguage === 'function' && typeof window.currentLang !== 'undefined') {
        window.applyLanguage(window.currentLang, true);
    }
}
