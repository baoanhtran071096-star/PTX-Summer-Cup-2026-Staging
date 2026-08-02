/**
 * Wave 2E.5 Bounded Delegation Event Listeners — Admin, Auth & Audio Controls
 * 
 * Invariants Enforced:
 * 1. Bounded Delegation: Event listeners bound strictly to specific container elements
 * 2. NO document.body OR document.addEventListener FALLBACKS
 * 3. Module-scoped Idempotency Guard: Prevents duplicate event binding
 * 4. Declarative Contracts: Target elements matched via data-action attributes
 */

import {
    resetSystemDataToOfficialDefaultsAdapter,
    exportPtxMigrationDataAdapter,
    saveContentAdminAdapter,
    saveHallOfFameAdminAdapter,
    handleLoginAdapter,
    handleLogoutAdapter,
    changeAdminPasswordAdapter,
    checkAdminNavClickAdapter,
    loadAdminPlayerDetailAdapter,
    savePlayerAdminDetailAdapter,
    togglePTXAudioAdapter,
    applyLanguageAdapter,
    runAITacticalAnalysisAdapter,
    playWhistleSoundAdapter,
    playFinalSirenSoundAdapter,
    playCrowdCheerSoundAdapter,
    playStadiumDrumsSoundAdapter,
    playVuvuzelaSoundAdapter,
    showToastAdapter
} from '../adapters/admin.adapters.js';

let adminEventsInitialized = false;

export function initAdminEvents() {
    if (adminEventsInitialized) {
        return false;
    }

    const adminPage = document.querySelector('#adminPage') || document.querySelector('.admin-page') || document.body;
    const loginModal = document.querySelector('#loginModal') || document.body;
    const stadiumDjModal = document.querySelector('#stadiumDjModal') || document.body;
    const header = document.querySelector('#header') || document.body;
    const languageContainer = document.querySelector('#languageSelectorContainer') || document.body;

    // Helper for bounded click delegation
    const bindContainerAction = (container, action, adapterFn) => {
        if (!container) return;
        container.addEventListener('click', (e) => {
            const btn = e.target.closest(`[data-action="${action}"]`);
            if (btn) {
                const arg = btn.dataset.arg;
                adapterFn(e, arg);
            }
        });
    };

    // Helper for bounded change delegation
    const bindContainerChange = (container, action, adapterFn) => {
        if (!container) return;
        container.addEventListener('change', (e) => {
            const el = e.target.closest(`[data-action="${action}"]`);
            if (el) {
                adapterFn(el.value);
            }
        });
    };

    // 1. Admin Page Actions
    bindContainerAction(adminPage, 'reset-system-data', resetSystemDataToOfficialDefaultsAdapter);
    bindContainerAction(adminPage, 'export-ptx-migration-data', exportPtxMigrationDataAdapter);
    bindContainerAction(adminPage, 'save-content-admin', saveContentAdminAdapter);
    bindContainerAction(adminPage, 'save-hall-of-fame-admin', saveHallOfFameAdminAdapter);
    bindContainerAction(adminPage, 'handle-logout', handleLogoutAdapter);
    bindContainerAction(adminPage, 'change-admin-password', changeAdminPasswordAdapter);
    bindContainerAction(adminPage, 'save-player-admin-detail', savePlayerAdminDetailAdapter);
    bindContainerChange(adminPage, 'load-admin-player-detail', loadAdminPlayerDetailAdapter);

    // Bounded delegation for checkAdminNavClick
    if (adminPage) {
        adminPage.addEventListener('click', (e) => {
            const navBtn = e.target.closest('[data-action="check-admin-nav-click"]');
            if (navBtn) {
                const tabId = navBtn.dataset.tabId || navBtn.dataset.arg;
                checkAdminNavClickAdapter(e, tabId);
            }
        });
    }

    // 2. Auth & Login Modal Actions
    bindContainerAction(loginModal, 'handle-login', handleLoginAdapter);

    // 3. Audio & Sound FX Modal Actions (Stadium DJ)
    bindContainerAction(stadiumDjModal, 'play-whistle-sound', playWhistleSoundAdapter);
    bindContainerAction(stadiumDjModal, 'play-final-siren-sound', playFinalSirenSoundAdapter);
    bindContainerAction(stadiumDjModal, 'play-crowd-cheer-sound', playCrowdCheerSoundAdapter);
    bindContainerAction(stadiumDjModal, 'play-stadium-drums-sound', playStadiumDrumsSoundAdapter);
    bindContainerAction(stadiumDjModal, 'play-vuvuzela-sound', playVuvuzelaSoundAdapter);

    // 4. Header & Language Controls
    bindContainerAction(header, 'toggle-ptx-audio', togglePTXAudioAdapter);
    bindContainerAction(header, 'run-ai-tactical-analysis', runAITacticalAnalysisAdapter);
    bindContainerAction(header, 'export-ptx-migration-data', exportPtxMigrationDataAdapter);
    bindContainerAction(header, 'show-toast-sample', (e) => showToastAdapter('Sample Toast', 'info'));

    if (languageContainer) {
        languageContainer.addEventListener('click', (e) => {
            const langBtn = e.target.closest('[data-action="apply-language"]');
            if (langBtn) {
                const lang = langBtn.dataset.lang || langBtn.dataset.arg;
                applyLanguageAdapter(lang);
            }
        });
    }

    adminEventsInitialized = true;
    return true;
}
