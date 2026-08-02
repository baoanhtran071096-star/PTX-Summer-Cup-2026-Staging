/**
 * Pure domain calculation module for PTX Summer Cup 2026 Standings.
 * ZERO side-effects, ZERO DOM access, ZERO storage/network calls.
 */

/**
 * Calculates standings table for given match results and team configs.
 * 
 * @param {Object} matchResults Object map of matchId -> score string (e.g. { '1': '3-1 | ...' })
 * @param {Array} teamConfigs Array of team objects [{ id, label, icon, color }]
 * @returns {Array} Sorted standings array
 */
export function calculateStandings(matchResults = {}, teamConfigs = []) {
    const stats = {};

    teamConfigs.forEach(team => {
        stats[team.id] = {
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            gd: 0,
            pts: 0
        };
    });

    function processMatch(teamAId, teamBId, scoreStr) {
        if (!scoreStr || !stats[teamAId] || !stats[teamBId]) return;
        const mainScore = scoreStr.split('|')[0].trim();
        const parts = mainScore.split('-');
        if (parts.length !== 2) return;
        const gA = parseInt(parts[0], 10);
        const gB = parseInt(parts[1], 10);
        if (isNaN(gA) || isNaN(gB)) return;

        const teamA = stats[teamAId];
        const teamB = stats[teamBId];

        teamA.played++;
        teamB.played++;
        teamA.goalsFor += gA;
        teamA.goalsAgainst += gB;
        teamB.goalsFor += gB;
        teamB.goalsAgainst += gA;

        if (gA > gB) {
            teamA.wins++;
            teamA.pts += 3;
            teamB.losses++;
        } else if (gA < gB) {
            teamB.wins++;
            teamB.pts += 3;
            teamA.losses++;
        } else {
            teamA.draws++;
            teamA.pts++;
            teamB.draws++;
            teamB.pts++;
        }
    }

    const matchPairs = [
        { id: '1', a: 'p', b: 't' },
        { id: '2', a: 'p', b: 'x' },
        { id: '3', a: 'x', b: 't' }
    ];

    matchPairs.forEach(pair => {
        const result = matchResults[pair.id];
        if (result) {
            processMatch(pair.a, pair.b, result);
        }
    });

    teamConfigs.forEach(team => {
        const s = stats[team.id];
        if (s) {
            s.gd = s.goalsFor - s.goalsAgainst;
        }
    });

    const resultTable = teamConfigs.map(team => ({
        id: team.id,
        label: team.label,
        icon: team.icon,
        color: team.color,
        obj: { ...stats[team.id] }
    }));

    return sortStandings(resultTable);
}

/**
 * Pure function sorting standings array by points, goal difference, goals for.
 * 
 * @param {Array} standings Array of team standings objects
 * @returns {Array} Sorted standings copy
 */
export function sortStandings(standings = []) {
    return [...standings].sort((a, b) => {
        if (b.obj.pts !== a.obj.pts) return b.obj.pts - a.obj.pts;
        if (b.obj.gd !== a.obj.gd) return b.obj.gd - a.obj.gd;
        return b.obj.goalsFor - a.obj.goalsFor;
    });
}
