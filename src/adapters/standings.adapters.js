/**
 * Standings View Orchestration Adapter for PTX Summer Cup 2026.
 * Bridges application state/config with pure Standings View Renderers.
 */

import { renderStandingsWidget, renderStandingsTable } from '../ui/views/standings.view.js';

export function renderStandingsAdapter() {
    const container = document.getElementById('standingsPremium');
    if (!container) return;

    const matchResults = {
        '1': (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_1') : null,
        '2': (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_2') : null,
        '3': (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_3') : null
    };
    const teamConfigs = [
        { id: 'p', label: 'TEAM P', icon: '⚡', color: '#1A5BB5' },
        { id: 't', label: 'TEAM T', icon: '🔥', color: '#D32F2F' },
        { id: 'x', label: 'TEAM X', icon: '💎', color: '#F5A623' }
    ];

    const calcFn = (typeof window !== 'undefined' && window.calculateStandings) || null;
    const teams = calcFn ? calcFn(matchResults, teamConfigs) : [];
    const teamsData = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};

    renderStandingsWidget(container, teams, teamsData);
}

export function renderStandingsPageTableAdapter() {
    const container = document.getElementById('standingsPageTable');
    if (!container) return;

    const matchResults = {
        '1': (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_1') : null,
        '2': (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_2') : null,
        '3': (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_3') : null
    };
    const teamConfigs = [
        { id: 'p', label: 'TEAM P', icon: '⚡', color: '#1A5BB5' },
        { id: 't', label: 'TEAM T', icon: '🔥', color: '#D32F2F' },
        { id: 'x', label: 'TEAM X', icon: '💎', color: '#F5A623' }
    ];

    const calcFn = (typeof window !== 'undefined' && window.calculateStandings) || null;
    const teams = calcFn ? calcFn(matchResults, teamConfigs) : [];
    const teamsData = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};
    const renderLogoFn = (typeof window !== 'undefined' && window.renderTeamLogo) || (() => '');

    renderStandingsTable(container, teams, teamsData, renderLogoFn);
}
