/**
 * Compatibility Adapters Layer for PTX Summer Cup 2026.
 * Bridges legacy zero/low-arg callers in index.html with pure dependency-injected domain modules in src/domain/*.
 * ZERO domain contamination: reads storage/globals ONLY in this adapter layer.
 */

import { calculateStandings as pureCalculateStandings, sortStandings as pureSortStandings } from '../domain/standings.js';
import { computeDashboardStats as pureComputeDashboardStats, calculatePlayerStats as pureCalculatePlayerStats, getPlayerTeam as pureGetPlayerTeam } from '../domain/statistics.js';
import { filterMatchesByRound as pureFilterMatchesByRound, parseGoalDataWithTeam as pureParseGoalDataWithTeam, getMatchResult as pureGetMatchResult } from '../domain/matches.js';
import { getStorageItem } from '../infrastructure/storage.js';

/**
 * Adapter for calculateStandings()
 * Gathers current ptx_result_1, 2, 3 and team configs if omitted by legacy caller.
 */
export function calculateStandingsAdapter(matchResults, teamConfigs) {
    if (!matchResults) {
        matchResults = {
            '1': getStorageItem('ptx_result_1'),
            '2': getStorageItem('ptx_result_2'),
            '3': getStorageItem('ptx_result_3')
        };
    }
    if (!teamConfigs && typeof window !== 'undefined' && window.TEAMS_DATA) {
        teamConfigs = [
            { id: 'p', label: 'TEAM P', icon: '⚡', color: '#1A5BB5' },
            { id: 't', label: 'TEAM T', icon: '🔥', color: '#D32F2F' },
            { id: 'x', label: 'TEAM X', icon: '💎', color: '#F5A623' }
        ];
    }
    return pureCalculateStandings(matchResults, teamConfigs);
}

/**
 * Adapter for sortStandings()
 */
export function sortStandingsAdapter(standings) {
    return pureSortStandings(standings);
}

/**
 * Adapter for computeDashboardStats()
 * Gathers MATCHES_CONFIG, PLAYERS_DATA, TEAMS_DATA, storedResults & fallbackStats if omitted by legacy caller.
 */
export function computeDashboardStatsAdapter(matches, players, teams, storedResults, fallbackStats) {
    if (!matches && typeof window !== 'undefined') matches = window.MATCHES_CONFIG || [];
    if (!players && typeof window !== 'undefined') players = window.PLAYERS_DATA || [];
    if (!teams && typeof window !== 'undefined') teams = window.TEAMS_DATA || {};
    if (!storedResults) {
        storedResults = {};
        if (Array.isArray(matches)) {
            matches.forEach(m => {
                const res = getStorageItem('ptx_result_' + m.id);
                if (res) storedResults[m.id] = res;
            });
        }
    }
    if (!fallbackStats) {
        fallbackStats = {
            goals: parseInt(getStorageItem('ptx_stat_goals') || '0', 10),
            matches: parseInt(getStorageItem('ptx_stat_matches') || '0', 10),
            yellow: parseInt(getStorageItem('ptx_stat_yellow') || '0', 10),
            red: parseInt(getStorageItem('ptx_stat_red') || '0', 10)
        };
    }
    return pureComputeDashboardStats(matches, players, teams, storedResults, fallbackStats);
}

/**
 * Adapter for calculatePlayerStats()
 */
export function calculatePlayerStatsAdapter(matches, players) {
    if (!matches && typeof window !== 'undefined') matches = window.MATCHES_CONFIG || [];
    if (!players && typeof window !== 'undefined') players = window.PLAYERS_DATA || [];
    return pureCalculatePlayerStats(matches, players);
}

/**
 * Adapter for getPlayerTeam()
 * Supports both string name and player object, resolves TEAMS_DATA if omitted.
 */
export function getPlayerTeamAdapter(player, teamsData) {
    if (!teamsData && typeof window !== 'undefined') teamsData = window.TEAMS_DATA || {};
    const playerName = typeof player === 'string' ? player : (player ? (player.name || player.scorer || '') : '');
    
    // Fallback search in PLAYERS_DATA if teamsData is empty
    if (typeof window !== 'undefined' && window.PLAYERS_DATA && Array.isArray(window.PLAYERS_DATA)) {
        const found = window.PLAYERS_DATA.find(p => p.name.toLowerCase() === playerName.toLowerCase() || p.name.toLowerCase().includes(playerName.toLowerCase()));
        if (found) return found.team;
    }
    return pureGetPlayerTeam(playerName, teamsData);
}

/**
 * Adapter for filterMatchesByRound()
 */
export function filterMatchesByRoundAdapter(matches, round) {
    if (!matches && typeof window !== 'undefined') matches = window.MATCHES_CONFIG || [];
    return pureFilterMatchesByRound(matches, round);
}

/**
 * Adapter for parseGoalDataWithTeam()
 */
export function parseGoalDataWithTeamAdapter(resultStr, match) {
    return pureParseGoalDataWithTeam(resultStr, match);
}

/**
 * Adapter for getMatchResult()
 * Gathers ptx_result_<matchId> from storage if storedResults is omitted.
 */
export function getMatchResultAdapter(matchId, storedResults) {
    if (!matchId) return null;
    if (!storedResults) {
        const raw = getStorageItem('ptx_result_' + matchId);
        if (!raw) return null;
        const parts = raw.split('|');
        const score = parts[0].trim();
        const scoreParts = score.split('-');
        if (scoreParts.length !== 2) return null;
        return {
            homeScore: parseInt(scoreParts[0], 10) || 0,
            awayScore: parseInt(scoreParts[1], 10) || 0,
            raw
        };
    }
    return pureGetMatchResult(matchId, storedResults);
}
