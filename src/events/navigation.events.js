/**
 * PTX Summer Cup 2026 - Navigation & Filter Native Event Listeners (Wave 2E.1)
 * Uses Event Delegation on Container Elements with idempotent setup.
 */

import {
    navigateAdapter,
    switchTeamSubTabAdapter,
    switchAdminTabAdapter,
    filterFifaByTeamAdapter,
    filterGalleryPageAdapter
} from '../adapters/ui.adapters.js';

let navigationEventsBound = false;

export function initNavigationEvents() {
    if (navigationEventsBound) return;
    navigationEventsBound = true;

    document.addEventListener('click', (e) => {
        // 1. Navigation Route Tabs
        const navBtn = e.target.closest('[data-action="navigate"]');
        if (navBtn) {
            e.preventDefault();
            const route = navBtn.getAttribute('data-route') || navBtn.getAttribute('data-target');
            if (route) {
                navigateAdapter(route);
            }
            return;
        }

        // 2. Team Sub-tabs (Pitch / Rosters)
        const teamTabBtn = e.target.closest('[data-action="switch-team-tab"]');
        if (teamTabBtn) {
            e.preventDefault();
            const tabName = teamTabBtn.getAttribute('data-tab');
            if (tabName) {
                switchTeamSubTabAdapter(tabName);
            }
            return;
        }

        // 3. Admin Tabs
        const adminTabBtn = e.target.closest('[data-action="switch-admin-tab"]');
        if (adminTabBtn) {
            e.preventDefault();
            const tabIdx = parseInt(adminTabBtn.getAttribute('data-tab-index') || '1', 10);
            switchAdminTabAdapter(tabIdx);
            return;
        }

        // 4. FIFA Team Filter
        const fifaFilterBtn = e.target.closest('[data-action="filterFifaByTeam"], [data-action="filter-fifa-team"]');
        if (fifaFilterBtn) {
            e.preventDefault();
            const team = fifaFilterBtn.getAttribute('data-team');
            if (team !== null) {
                filterFifaByTeamAdapter(team);
            }
            return;
        }

        // 5. Gallery Category Filter
        const galleryFilterBtn = e.target.closest('[data-action="filterGalleryPage"], [data-action="filter-gallery-page"]');
        if (galleryFilterBtn) {
            e.preventDefault();
            const cat = galleryFilterBtn.getAttribute('data-category');
            if (cat !== null) {
                filterGalleryPageAdapter(cat);
            }
            return;
        }

        // 6. Match Round Filter
        const roundFilterBtn = e.target.closest('[data-action="filterMatchRound"], [data-action="filter-match-round"]');
        if (roundFilterBtn) {
            e.preventDefault();
            const roundStr = roundFilterBtn.getAttribute('data-round');
            if (roundStr !== null && typeof window.filterMatchRound === 'function') {
                const roundVal = roundStr === 'all' ? 'all' : parseInt(roundStr, 10);
                window.filterMatchRound(roundVal, roundFilterBtn);
            }
            return;
        }
    });
}
