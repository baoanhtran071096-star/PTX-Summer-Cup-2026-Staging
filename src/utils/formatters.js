// ============================================================
// PURE UTILITY FORMATTERS
// ============================================================

export function formatScore(homeScore, awayScore) {
    if (homeScore === undefined || awayScore === undefined || homeScore === null || awayScore === null) return '- : -';
    return `${homeScore} - ${awayScore}`;
}

export function formatJerseyName(name) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].toUpperCase();
    const last = parts[parts.length - 1].toUpperCase();
    const firstInitial = parts[0].charAt(0).toUpperCase();
    return `${firstInitial}. ${last}`;
}

export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
}
