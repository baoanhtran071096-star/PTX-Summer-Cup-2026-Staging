/**
 * Wave 2E.4 Command Adapters — Match / Score Controls & Write Flows
 * 
 * Architecture Contract:
 * Native Event -> Command Adapter -> Existing Canonical Command/Mutation -> Persistence -> Render Update
 * 
 * Single Source of Truth Guard:
 * Adapters NEVER duplicate or re-implement storage/mutation logic.
 * They bridge native user intent events cleanly to existing canonical implementations.
 */

function getCanonicalHandler(fnName) {
    if (typeof window !== 'undefined' && typeof window[fnName] === 'function') {
        return window[fnName];
    }
    if (typeof globalThis !== 'undefined' && typeof globalThis[fnName] === 'function') {
        return globalThis[fnName];
    }
    return null;
}

export function switchToPreMatchStateAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('switchToPreMatchState');
    if (handler) {
        return handler();
    }
}

export function exportOfficialMatchReportAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('exportOfficialMatchReport');
    if (handler) {
        return handler();
    }
}

export function setZeroMatchesStateAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('setZeroMatchesState');
    if (handler) {
        return handler();
    }
}

export function setDemoScoresStateAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('setDemoScoresState');
    if (handler) {
        return handler();
    }
}

export function updateStandingsAndResultsAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('updateStandingsAndResults');
    if (handler) {
        return handler();
    }
}

export function addQuickGoalAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('addQuickGoal');
    if (handler) {
        return handler();
    }
}

export function onRefMatchChangeAdapter(matchId) {
    const handler = getCanonicalHandler('onRefMatchChange');
    if (handler) {
        return handler(matchId);
    }
}

export function onLiveStreamMatchChangeAdapter(matchId) {
    const handler = getCanonicalHandler('onLiveStreamMatchChange');
    if (handler) {
        return handler(matchId);
    }
}

export function toggleFloatingAdminAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('toggleFloatingAdmin');
    if (handler) {
        return handler();
    }
}

export function quickGoalFromFloatAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('quickGoalFromFloat');
    if (handler) {
        return handler();
    }
}

export function updateStatsAdminAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('updateStatsAdmin');
    if (handler) {
        return handler();
    }
}

export function tossRefCoinAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('tossRefCoin');
    if (handler) {
        return handler();
    }
}

export function changeFoulCountAdapter(team, delta) {
    const handler = getCanonicalHandler('changeFoulCount');
    if (handler) {
        return handler(team, delta);
    }
}

export function toggleRefStopwatchAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('toggleRefStopwatch');
    if (handler) {
        return handler();
    }
}

export function resetRefStopwatchAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('resetRefStopwatch');
    if (handler) {
        return handler();
    }
}

export function clearRefTimelineLogAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('clearRefTimelineLog');
    if (handler) {
        return handler();
    }
}

export function showRefereeCardAdapter(team, cardType) {
    const handler = getCanonicalHandler('showRefereeCard');
    if (handler) {
        return handler(team, cardType);
    }
}

export function triggerVARReviewAdapter(matchId, decision) {
    const handler = getCanonicalHandler('triggerVARReview');
    if (handler) {
        return handler(matchId, decision);
    }
}

export function openRefereeToolkitAdapter(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const handler = getCanonicalHandler('openRefereeToolkit');
    if (handler) {
        return handler();
    }
}
