/**
 * Wave 2E.4 Native Event Module — Match / Score Controls & Write Flows
 * 
 * Execution Guards Enforced:
 * 1. Native Event -> Command Adapter -> Existing Canonical Mutation -> Storage -> UI Render
 * 2. Bounded Delegation Only: Bound exclusively to stable container nodes
 *    (#adminPage, #refereeToolkitModal, #floatAdminPanel, #floatAdminBtn, #matchScheduleView, #liveStreamHubModal)
 * 3. ZERO document.body fallback, ZERO document.addEventListener() calls.
 */

import {
    switchToPreMatchStateAdapter,
    exportOfficialMatchReportAdapter,
    setZeroMatchesStateAdapter,
    setDemoScoresStateAdapter,
    updateStandingsAndResultsAdapter,
    addQuickGoalAdapter,
    onRefMatchChangeAdapter,
    onLiveStreamMatchChangeAdapter,
    toggleFloatingAdminAdapter,
    quickGoalFromFloatAdapter,
    updateStatsAdminAdapter,
    tossRefCoinAdapter,
    changeFoulCountAdapter,
    toggleRefStopwatchAdapter,
    resetRefStopwatchAdapter,
    clearRefTimelineLogAdapter,
    showRefereeCardAdapter,
    triggerVARReviewAdapter,
    openRefereeToolkitAdapter
} from '../adapters/match.adapters.js';

export function initMatchEvents() {
    let initialized = false;

    // 1. Admin Page Controls
    const adminPage = document.getElementById('adminPage');
    if (adminPage) {
        adminPage.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action]');
            if (!btn || !adminPage.contains(btn)) return;

            const action = btn.getAttribute('data-action');
            switch (action) {
                case 'set-zero-matches-state':
                    setZeroMatchesStateAdapter(event);
                    break;
                case 'set-demo-scores-state':
                    setDemoScoresStateAdapter(event);
                    break;
                case 'update-standings-and-results':
                    updateStandingsAndResultsAdapter(event);
                    break;
                case 'add-quick-goal':
                    addQuickGoalAdapter(event);
                    break;
                case 'update-stats-admin':
                    updateStatsAdminAdapter(event);
                    break;
                case 'export-official-match-report':
                    exportOfficialMatchReportAdapter(event);
                    break;
            }
        });
    }

    // 2. Referee Toolkit Modal
    const refereeToolkitModal = document.getElementById('refereeToolkitModal') || document.getElementById('refereeModal');
    const refMatchSel = document.getElementById('refMatchSel');
    if (refMatchSel) {
        refMatchSel.addEventListener('change', (event) => {
            onRefMatchChangeAdapter(event.target.value);
        });
    }

    if (refereeToolkitModal) {
        refereeToolkitModal.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action]');
            if (!btn || !refereeToolkitModal.contains(btn)) return;

            const action = btn.getAttribute('data-action');
            switch (action) {
                case 'export-official-match-report':
                    exportOfficialMatchReportAdapter(event);
                    break;
                case 'toss-ref-coin':
                    tossRefCoinAdapter(event);
                    break;
                case 'change-foul-count': {
                    const team = btn.getAttribute('data-team') || 'p';
                    const delta = parseInt(btn.getAttribute('data-delta') || '1', 10);
                    changeFoulCountAdapter(team, delta);
                    break;
                }
                case 'toggle-ref-stopwatch':
                    toggleRefStopwatchAdapter(event);
                    break;
                case 'reset-ref-stopwatch':
                    resetRefStopwatchAdapter(event);
                    break;
                case 'clear-ref-timeline-log':
                    clearRefTimelineLogAdapter(event);
                    break;
                case 'show-referee-card': {
                    const team = btn.getAttribute('data-team') || 'p';
                    const cardType = btn.getAttribute('data-card') || 'yellow';
                    showRefereeCardAdapter(team, cardType);
                    break;
                }
                case 'trigger-var-review': {
                    const matchId = btn.getAttribute('data-match') || '1';
                    const decision = btn.getAttribute('data-decision') || 'GOAL';
                    triggerVARReviewAdapter(matchId, decision);
                    break;
                }
            }
        });
    }

    // 3. LiveStream Match Selector
    const liveStreamMatchSel = document.getElementById('liveStreamMatchSel') || document.getElementById('livestreamMatchSelect');
    if (liveStreamMatchSel) {
        liveStreamMatchSel.addEventListener('change', (event) => {
            onLiveStreamMatchChangeAdapter(event.target.value);
        });
    }

    // 4. Floating Admin Button & Panel
    const floatAdminBtn = document.getElementById('floatAdminBtn');
    if (floatAdminBtn) {
        floatAdminBtn.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action="toggle-floating-admin"]');
            if (btn && floatAdminBtn.contains(btn)) {
                toggleFloatingAdminAdapter(event);
            }
        });
    }

    const floatAdminPanel = document.getElementById('floatAdminPanel');
    if (floatAdminPanel) {
        floatAdminPanel.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action="quick-goal-from-float"]');
            if (btn && floatAdminPanel.contains(btn)) {
                quickGoalFromFloatAdapter(event);
            }
        });
    }

    // 5. Match Schedule View / Mode Switcher Toolbar
    const matchScheduleView = document.getElementById('matchScheduleView') || document.getElementById('schedule');
    if (matchScheduleView) {
        matchScheduleView.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action="switch-to-pre-match-state"]');
            if (btn && matchScheduleView.contains(btn)) {
                switchToPreMatchStateAdapter(event);
            }
        });
    }

    // 6. Header / Referee Toolkit Trigger Button
    const refToolkitTrigger = document.querySelector('[data-action="open-referee-toolkit"]');
    if (refToolkitTrigger) {
        refToolkitTrigger.addEventListener('click', (event) => {
            openRefereeToolkitAdapter(event);
        });
    }

    initialized = true;
    return initialized;
}
