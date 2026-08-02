# LEGACY INLINE HANDLER INVENTORY (Auto-Generated)

> Generated on 2026-08-02T05:20:15.124Z from `config/legacy-handler-inventory.json`.

### Summary
- **Total Inline Occurrences**: 163
- **Unique Handler Functions**: 103

### Category Breakdown
- **navigation_ui**: 39 unique handlers
- **player**: 3 unique handlers
- **match_score**: 10 unique handlers
- **statistics**: 4 unique handlers
- **gallery_media**: 0 unique handlers
- **prediction**: 7 unique handlers
- **admin**: 6 unique handlers
- **miscellaneous**: 34 unique handlers

### Handler Inventory Detail

| Handler Function Name | Occurrences | Category | Target Migration | Risk |
| :--- | :--- | :--- | :--- | :--- |
| `loadVideoClip` | 5 | `match_score` | `direct-listener` | **MEDIUM** |
| `sendPTXChatQuick` | 5 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `openVipTicketModal` | 4 | `navigation_ui` | `event-delegation` | **LOW** |
| `filterMatchRound` | 4 | `match_score` | `direct-listener` | **MEDIUM** |
| `filterFifaByTeam` | 4 | `statistics` | `direct-listener` | **LOW** |
| `renderCompareView` | 4 | `navigation_ui` | `event-delegation` | **LOW** |
| `filterGalleryPage` | 4 | `statistics` | `direct-listener` | **LOW** |
| `switchAdminTab` | 4 | `navigation_ui` | `event-delegation` | **LOW** |
| `changeFoulCount` | 4 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `openLiveStreamHubModal` | 3 | `navigation_ui` | `event-delegation` | **LOW** |
| `triggerVARReview` | 3 | `navigation_ui` | `event-delegation` | **LOW** |
| `exportPtxMigrationData` | 3 | `statistics` | `direct-listener` | **LOW** |
| `shareResult` | 3 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `selectPitchTeam` | 3 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `triggerTrophyRotate` | 3 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `selectSponsorPackage` | 3 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `predictChampionDemo` | 3 | `prediction` | `form-submit-listener` | **MEDIUM** |
| `sendLiveReaction` | 3 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `openComparePlayersModal` | 2 | `navigation_ui` | `event-delegation` | **LOW** |
| `switchToPreMatchState` | 2 | `match_score` | `direct-listener` | **MEDIUM** |
| `resetSystemDataToOfficialDefaults` | 2 | `admin` | `authenticated-listener` | **HIGH** |
| `exportOfficialMatchReport` | 2 | `match_score` | `direct-listener` | **MEDIUM** |
| `applyLanguage` | 2 | `navigation_ui` | `event-delegation` | **LOW** |
| `switchTeamSubTab` | 2 | `navigation_ui` | `event-delegation` | **LOW** |
| `openAiGrowthModal` | 2 | `navigation_ui` | `event-delegation` | **LOW** |
| `openLightbox` | 2 | `navigation_ui` | `event-delegation` | **LOW** |
| `showRefereeCard` | 2 | `player` | `component-listener` | **MEDIUM** |
| `playWhistleSound` | 2 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `playFinalSirenSound` | 2 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `generateAIPressRelease` | 2 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `togglePTXChatbotWindow` | 2 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `installPTXPWAApp` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `dismissPWABanner` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `navigate` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `openRefereeToolkit` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `checkAdminNavClick` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `openAiPressReleaseModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `openStadiumDJModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `togglePTXAudio` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `openInfographicModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `toggleTheme` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `runAITacticalAnalysis` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `aiAutoSuggestPrediction` | 1 | `prediction` | `form-submit-listener` | **MEDIUM** |
| `submitFanPrediction` | 1 | `prediction` | `form-submit-listener` | **MEDIUM** |
| `changePitchFormation` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `openTacticalVisualizerModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `autoOptimize5v5Squad` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closePlayerCompareModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `copyBankStk` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `scrollSponsorForm` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `submitSponsorContact` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `openLogin` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `handleLogout` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `setZeroMatchesState` | 1 | `match_score` | `direct-listener` | **MEDIUM** |
| `setDemoScoresState` | 1 | `match_score` | `direct-listener` | **MEDIUM** |
| `updateStandingsAndResults` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `addQuickGoal` | 1 | `match_score` | `direct-listener` | **MEDIUM** |
| `updateStatsAdmin` | 1 | `statistics` | `direct-listener` | **LOW** |
| `loadAdminPlayerDetail` | 1 | `player` | `component-listener` | **MEDIUM** |
| `savePlayerAdminDetail` | 1 | `player` | `component-listener` | **MEDIUM** |
| `saveContentAdmin` | 1 | `admin` | `authenticated-listener` | **HIGH** |
| `saveHallOfFameAdmin` | 1 | `admin` | `authenticated-listener` | **HIGH** |
| `changeAdminPassword` | 1 | `admin` | `authenticated-listener` | **HIGH** |
| `closeLogin` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `handleLogin` | 1 | `admin` | `authenticated-listener` | **HIGH** |
| `closeAiGrowthModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `runAiPredictionDemo` | 1 | `prediction` | `form-submit-listener` | **MEDIUM** |
| `generateReferralDemo` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closePlayerModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `closeSubstitutionModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `closeTacticalVisualizerModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `closeVipTicketModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `updateTicketName` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `randomizeTicketSerial` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `downloadVipTicketImage` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closeComparePlayersModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `openSubstitutionModalById` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `openPlayerModalById` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `closeInfographicModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `downloadInfographicImage` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closeRefereeToolkit` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `onRefMatchChange` | 1 | `match_score` | `direct-listener` | **MEDIUM** |
| `tossRefCoin` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `toggleRefStopwatch` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `resetRefStopwatch` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `clearRefTimelineLog` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closeStadiumDJModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `playCrowdCheerSound` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `playStadiumDrumsSound` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `playVuvuzelaSound` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closeLiveStreamHubModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `onLiveStreamMatchChange` | 1 | `match_score` | `direct-listener` | **MEDIUM** |
| `loadCustomLiveStream` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `sendLiveChatMessage` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `closeAiPressReleaseModal` | 1 | `navigation_ui` | `event-delegation` | **LOW** |
| `copyPressReleaseText` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `toggleFloatingAdmin` | 1 | `admin` | `authenticated-listener` | **HIGH** |
| `quickGoalFromFloat` | 1 | `match_score` | `direct-listener` | **MEDIUM** |
| `sendPTXChatMessage` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `downloadVIPPredictionTicket` | 1 | `prediction` | `form-submit-listener` | **MEDIUM** |
| `showToast` | 1 | `miscellaneous` | `direct-listener` | **MEDIUM** |
| `loadSamplePredictions` | 1 | `prediction` | `form-submit-listener` | **MEDIUM** |
| `clearAllPredictionsList` | 1 | `prediction` | `form-submit-listener` | **MEDIUM** |
