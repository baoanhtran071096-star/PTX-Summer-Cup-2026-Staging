/**
 * Pure domain calculation module for PTX Summer Cup 2026 Matches.
 * ZERO side-effects, ZERO DOM access, ZERO storage/network calls.
 */

/**
 * Filters matches by round number.
 * 
 * @param {Array} matches Match objects array
 * @param {number|string} round Round filter value
 * @returns {Array} Filtered matches array
 */
export function filterMatchesByRound(matches = [], round) {
    if (!round || round === 'all') return matches;
    const rNum = parseInt(round, 10);
    return matches.filter(m => m.round === rNum);
}

/**
 * Parses match result string into structured goal data.
 * 
 * @param {string} resultStr Result string e.g. "3-1 | Goal: Nguyen Su (2) | Goal: Quoc Khanh"
 * @param {Object} match Match metadata object
 * @returns {Object} Parsed score & goal details
 */
export function parseGoalDataWithTeam(resultStr = '', match = {}) {
    if (!resultStr) {
        return { scoreA: 0, scoreB: 0, teamAGoals: [], teamBGoals: [] };
    }

    const parts = resultStr.split('|');
    const mainScore = parts[0].trim();
    const scoreParts = mainScore.split('-');

    const scoreA = scoreParts.length === 2 ? parseInt(scoreParts[0].trim(), 10) || 0 : 0;
    const scoreB = scoreParts.length === 2 ? parseInt(scoreParts[1].trim(), 10) || 0 : 0;

    const teamAGoals = [];
    const teamBGoals = [];

    if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
            const segment = parts[i].trim();
            if (segment.startsWith('Goal:')) {
                const goalText = segment.substring(5).trim();
                const scorers = goalText.split(',').map(s => s.trim()).filter(Boolean);
                if (i === 1) {
                    teamAGoals.push(...scorers);
                } else if (i === 2) {
                    teamBGoals.push(...scorers);
                }
            }
        }
    }

    return {
        scoreA,
        scoreB,
        teamAGoals,
        teamBGoals
    };
}

/**
 * Resolves match result string by match ID from results map.
 * 
 * @param {string|number} matchId Match ID
 * @param {Object} storedResults Results dictionary object
 * @returns {string|null} Result string if present
 */
export function getMatchResult(matchId, storedResults = {}) {
    if (!matchId || !storedResults) return null;
    return storedResults[matchId] || storedResults[`ptx_result_${matchId}`] || null;
}
