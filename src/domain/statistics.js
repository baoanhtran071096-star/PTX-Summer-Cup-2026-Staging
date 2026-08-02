/**
 * Pure domain calculation module for PTX Summer Cup 2026 Statistics.
 * ZERO side-effects, ZERO DOM access, ZERO storage/network calls.
 */

/**
 * Computes dashboard overview statistics.
 * 
 * @param {Array} matches Match config array [{ id, score, played }]
 * @param {Array} players Player data array [{ id, name, goals, assists, yellowCards, redCards, team, mvp }]
 * @param {Object} teams Teams dictionary object
 * @param {Object} storedResults Stored match results map e.g. { '1': '3-1 | ...' }
 * @param {Object} fallbackStats Optional fallback stats object
 * @returns {Object} Dashboard stats object { goals, matches, players, teams, yellow, red, totalMatchesPlayed, totalGoals, totalCards, topMVP, topScorer }
 */
export function computeDashboardStats(matches = [], players = [], teams = {}, storedResults = {}, fallbackStats = {}) {
    let totalGoals = 0;
    let totalMatchesPlayed = 0;
    const totalMatches = matches.length;
    const totalPlayers = players.length;
    const totalTeams = typeof teams === 'object' ? Object.keys(teams).length : 0;
    let totalYellow = 0;
    let totalRed = 0;

    matches.forEach(m => {
        const data = m.score || storedResults[m.id] || storedResults[`ptx_result_${m.id}`];
        if (data) {
            totalMatchesPlayed++;
            const parts = data.split('|');
            const score = parts[0].trim();
            const scoreParts = score.split('-');
            if (scoreParts.length === 2) {
                const gA = parseInt(scoreParts[0], 10) || 0;
                const gB = parseInt(scoreParts[1], 10) || 0;
                totalGoals += (gA + gB);
            }
            if (parts.length > 1) {
                const goalPart = parts[1].trim();
                const goalItems = goalPart.split(',').map(s => s.trim());
                goalItems.forEach(item => {
                    if (item.toLowerCase().includes('🟨')) totalYellow++;
                    if (item.toLowerCase().includes('🟥')) totalRed++;
                });
            }
        }
    });

    const finalGoals = totalGoals > 0 ? totalGoals : (fallbackStats.goals || 0);
    const finalMatches = totalMatches > 0 ? totalMatches : (fallbackStats.matches || matches.length);
    const finalYellow = totalYellow > 0 ? totalYellow : (fallbackStats.yellow || 0);
    const finalRed = totalRed > 0 ? totalRed : (fallbackStats.red || 0);

    let topMVP = null;
    let topScorer = null;
    let totalCards = 0;

    players.forEach(p => {
        totalCards += (p.yellowCards || 0) + (p.redCards || 0);

        if (!topMVP || (p.mvp || 0) > (topMVP.mvp || 0)) {
            topMVP = p;
        }

        if ((p.goals || 0) > 0) {
            if (!topScorer || (p.goals || 0) > (topScorer.goals || 0)) {
                topScorer = p;
            }
        }
    });

    return {
        goals: finalGoals,
        matches: finalMatches,
        players: totalPlayers,
        teams: totalTeams,
        yellow: finalYellow,
        red: finalRed,
        totalMatchesPlayed,
        totalGoals: finalGoals,
        totalCards: totalCards > 0 ? totalCards : (finalYellow + finalRed),
        topMVP,
        topScorer
    };
}

/**
 * Resolves player team metadata from team dictionary.
 * 
 * @param {string} playerName Player name string
 * @param {Object} teamsData Team dictionary object
 * @returns {string} Team label string
 */
export function getPlayerTeam(playerName, teamsData = {}) {
    if (!playerName) return 'N/A';
    for (const teamId in teamsData) {
        const t = teamsData[teamId];
        if (t.players && Array.isArray(t.players)) {
            if (t.players.some(p => typeof p === 'string' ? p === playerName : p.name === playerName)) {
                return t.name || teamId;
            }
        }
    }
    return 'PTX Cup';
}
