/**
 * Dashboard & Statistics View Orchestration Adapter for PTX Summer Cup 2026.
 * Bridges application state/config with pure Dashboard View Renderers.
 */

import { renderDashboardStatsWidget, renderLeaderSpotlights, renderHallOfFameGrid } from '../ui/views/dashboard.view.js';

export function updateDashboardAdapter() {
    const matchesConfig = (typeof window !== 'undefined' && window.MATCHES_CONFIG) || [];
    const playersData = (typeof window !== 'undefined' && window.PLAYERS_DATA) || [];
    const teamsData = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};

    const storedResults = {};
    matchesConfig.forEach(m => {
        const res = (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_result_' + m.id) : null;
        if (res) storedResults[m.id] = res;
    });

    const fallbackStats = {
        goals: parseInt((typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_stat_goals') || 0 : 0, 10),
        matches: parseInt((typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_stat_matches') || 0 : 0, 10),
        yellow: parseInt((typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_stat_yellow') || 0 : 0, 10),
        red: parseInt((typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('ptx_stat_red') || 0 : 0, 10)
    };

    const computeFn = (typeof window !== 'undefined' && window.computeDashboardStats) || null;
    const stats = computeFn ? computeFn(matchesConfig, playersData, teamsData, storedResults, fallbackStats) : fallbackStats;

    const setElFn = (typeof window !== 'undefined' && window.setElTextAndTarget) || (() => {});
    renderDashboardStatsWidget(stats, setElFn);

    const sortedByGoals = [...playersData].sort((a, b) => b.goals - a.goals);
    const topScorer = sortedByGoals[0];
    const sortedByMVP = [...playersData].sort((a, b) => b.mvp - a.mvp);
    const topMVP = sortedByMVP[0];

    renderLeaderSpotlights(topScorer, topMVP, teamsData);
}

export function renderHallOfFameAdapter() {
    const containers = [
        document.getElementById('hofGridV2'),
        document.getElementById('hofGridV2Page')
    ].filter(Boolean);

    if (containers.length === 0) return;

    const years = [2025, 2026, 2027, 2028, 2029, 2030];
    const hofData = {};
    years.forEach(y => {
        const dataStr = (typeof window !== 'undefined' && window.getStorageItem) ? window.getStorageItem('hof_' + y) : null;
        if (dataStr) hofData[y] = dataStr;
    });

    renderHallOfFameGrid(containers, hofData);
}
