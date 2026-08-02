/**
 * Wave 2E.5 Pure Command Adapters — Admin, Auth & Audio Controls
 * 
 * Invariants Enforced:
 * 1. Single Responsibility: Event/UI -> Adapter -> Canonical Implementation -> Storage -> Render
 * 2. Pure Adapter Wrappers: Zero storage/mutation duplication
 * 3. Exact Signature Forwarding: Passes events and arguments cleanly to canonical functions
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
} from './admin.adapters.impl.js';

export {
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
};
