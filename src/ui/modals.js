/**
 * Pure UI Modal Presentation Primitives for PTX Summer Cup 2026.
 * Manages strictly DOM visibility toggles (style.display / classList.add/remove).
 * ZERO data orchestration, ZERO state reading, ZERO callback execution.
 */

// 1. Login Modal Primitives
export function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

export function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
}

// 2. AI Growth Modal Primitives
export function showAiGrowthModal() {
    const modal = document.getElementById('aiGrowthModal');
    if (modal) modal.style.display = 'flex';
}

export function hideAiGrowthModal() {
    const modal = document.getElementById('aiGrowthModal');
    if (modal) modal.style.display = 'none';
}

// 3. VIP Ticket Modal Primitives
export function showVipTicketModal() {
    const modal = document.getElementById('vipTicketModal');
    if (modal) modal.style.display = 'flex';
}

export function hideVipTicketModal() {
    const modal = document.getElementById('vipTicketModal');
    if (modal) modal.style.display = 'none';
}

// 4. Compare Players Modal Primitives
export function showComparePlayersModal() {
    const modal = document.getElementById('comparePlayersModal');
    if (modal) modal.style.display = 'flex';
}

export function hideComparePlayersModal() {
    const modal = document.getElementById('comparePlayersModal');
    if (modal) modal.style.display = 'none';
}

// 5. Infographic Modal Primitives
export function showInfographicModal() {
    const modal = document.getElementById('infographicModal');
    if (modal) modal.style.display = 'flex';
}

export function hideInfographicModal() {
    const modal = document.getElementById('infographicModal');
    if (modal) modal.style.display = 'none';
}

// 6. LiveStream Hub Modal Primitives
export function showLiveStreamHubModal() {
    const modal = document.getElementById('liveStreamHubModal');
    if (modal) modal.style.display = 'flex';
}

export function hideLiveStreamHubModal() {
    const modal = document.getElementById('liveStreamHubModal');
    if (modal) modal.style.display = 'none';
}

// 7. AI Press Release Modal Primitives
export function showAiPressReleaseModal() {
    const modal = document.getElementById('aiPressReleaseModal');
    if (modal) modal.style.display = 'flex';
}

export function hideAiPressReleaseModal() {
    const modal = document.getElementById('aiPressReleaseModal');
    if (modal) modal.style.display = 'none';
}

// 8. Stadium DJ Modal Primitives
export function showStadiumDJModal() {
    const modal = document.getElementById('stadiumDjModal');
    if (modal) modal.style.display = 'flex';
}

export function hideStadiumDJModal() {
    const modal = document.getElementById('stadiumDjModal');
    if (modal) modal.style.display = 'none';
}

// 9. Tactical Visualizer Modal Primitives
export function showTacticalVisualizerModal() {
    const modal = document.getElementById('tacticalVisualizerModal');
    if (modal) modal.style.display = 'flex';
}

export function hideTacticalVisualizerModal() {
    const modal = document.getElementById('tacticalVisualizerModal');
    if (modal) modal.style.display = 'none';
}
