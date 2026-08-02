/**
 * Wave 2E.5 Pure Command Adapters Implementation
 */

export function resetSystemDataToOfficialDefaultsAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.resetSystemDataToOfficialDefaults === 'function') {
        return window.resetSystemDataToOfficialDefaults();
    }
}

export function exportPtxMigrationDataAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.exportPtxMigrationData === 'function') {
        return window.exportPtxMigrationData();
    }
}

export function saveContentAdminAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.saveContentAdmin === 'function') {
        return window.saveContentAdmin();
    }
}

export function saveHallOfFameAdminAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.saveHallOfFameAdmin === 'function') {
        return window.saveHallOfFameAdmin();
    }
}

export function handleLoginAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.handleLogin === 'function') {
        return window.handleLogin();
    }
}

export function handleLogoutAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.handleLogout === 'function') {
        return window.handleLogout();
    }
}

export function changeAdminPasswordAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.changeAdminPassword === 'function') {
        return window.changeAdminPassword();
    }
}

export function checkAdminNavClickAdapter(event, tabId) {
    if (typeof window.checkAdminNavClick === 'function') {
        return window.checkAdminNavClick(event, tabId);
    }
}

export function loadAdminPlayerDetailAdapter(playerId) {
    if (typeof window.loadAdminPlayerDetail === 'function') {
        return window.loadAdminPlayerDetail(playerId);
    }
}

export function savePlayerAdminDetailAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.savePlayerAdminDetail === 'function') {
        return window.savePlayerAdminDetail();
    }
}

export function togglePTXAudioAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.togglePTXAudio === 'function') {
        return window.togglePTXAudio();
    }
}

export function applyLanguageAdapter(lang) {
    if (typeof window.applyLanguage === 'function') {
        return window.applyLanguage(lang);
    }
}

export function runAITacticalAnalysisAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.runAITacticalAnalysis === 'function') {
        return window.runAITacticalAnalysis();
    }
}

export function playWhistleSoundAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.playWhistleSound === 'function') {
        return window.playWhistleSound();
    }
}

export function playFinalSirenSoundAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.playFinalSirenSound === 'function') {
        return window.playFinalSirenSound();
    }
}

export function playCrowdCheerSoundAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.playCrowdCheerSound === 'function') {
        return window.playCrowdCheerSound();
    }
}

export function playStadiumDrumsSoundAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.playStadiumDrumsSound === 'function') {
        return window.playStadiumDrumsSound();
    }
}

export function playVuvuzelaSoundAdapter(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof window.playVuvuzelaSound === 'function') {
        return window.playVuvuzelaSound();
    }
}

export function showToastAdapter(msg, type) {
    if (typeof window.showToast === 'function') {
        return window.showToast(msg, type);
    }
}
