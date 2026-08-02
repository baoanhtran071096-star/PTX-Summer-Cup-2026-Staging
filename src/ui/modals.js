/**
 * Pure UI Modal Manager for PTX Summer Cup 2026.
 * Manages modal visibility toggles (style.display / classList.add/remove) for low-risk UI components.
 */

// 1. Login Modal
export function openLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

export function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
    const err = document.getElementById('loginError');
    if (err) err.style.display = 'none';
}

// 2. AI Growth Modal
export function openAiGrowthModal() {
    const modal = document.getElementById('aiGrowthModal');
    if (modal) modal.style.display = 'flex';
}

export function closeAiGrowthModal() {
    const modal = document.getElementById('aiGrowthModal');
    if (modal) modal.style.display = 'none';
}

// 3. VIP Ticket Modal
export function openVipTicketModal(playerName) {
    const modal = document.getElementById('vipTicketModal');
    if (!modal) return;
    const input = document.getElementById('ticketNameInput');
    if (input) {
        if (playerName && typeof playerName === 'string') {
            input.value = playerName.toUpperCase();
        } else {
            input.value = 'KYLIAN MBAPPÉ';
        }
        if (typeof window !== 'undefined' && typeof window.updateTicketName === 'function') {
            window.updateTicketName(input.value);
        }
    }
    modal.style.display = 'flex';
}

export function closeVipTicketModal() {
    const modal = document.getElementById('vipTicketModal');
    if (modal) modal.style.display = 'none';
}

// 4. Compare Players Modal
export function openComparePlayersModal(player1Id, player2Id) {
    const modal = document.getElementById('comparePlayersModal');
    const sel1 = document.getElementById('compareSelect1');
    const sel2 = document.getElementById('compareSelect2');
    if (!modal || !sel1 || !sel2) return;

    sel1.innerHTML = '';
    sel2.innerHTML = '';

    const players = (typeof window !== 'undefined' && window.PLAYERS_DATA) || [];
    const teams = (typeof window !== 'undefined' && window.TEAMS_DATA) || {};

    players.forEach((p) => {
        const team = teams[p.team];
        const opt1 = document.createElement('option');
        opt1.value = p.id;
        opt1.textContent = `[${team ? team.name : p.team}] #${p.number} ${p.name} (${p.position})`;
        sel1.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = p.id;
        opt2.textContent = `[${team ? team.name : p.team}] #${p.number} ${p.name} (${p.position})`;
        sel2.appendChild(opt2);
    });

    if (player1Id) sel1.value = player1Id;
    if (player2Id) sel2.value = player2Id;

    if (typeof window !== 'undefined' && typeof window.renderCompareView === 'function') {
        window.renderCompareView();
    }
    modal.style.display = 'flex';
}

export function closeComparePlayersModal() {
    const modal = document.getElementById('comparePlayersModal');
    if (modal) modal.style.display = 'none';
}

// 5. Infographic Modal
export function openInfographicModal() {
    const modal = document.getElementById('infographicModal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof window !== 'undefined' && typeof window.drawInfographicCanvas === 'function') {
            setTimeout(window.drawInfographicCanvas, 100);
        }
    }
}

export function closeInfographicModal() {
    const modal = document.getElementById('infographicModal');
    if (modal) modal.style.display = 'none';
}

// 6. LiveStream Hub Modal
export function openLiveStreamHubModal() {
    const modal = document.getElementById('liveStreamHubModal');
    if (modal) modal.style.display = 'flex';
    if (typeof window !== 'undefined' && typeof window.onLiveStreamMatchChange === 'function') {
        window.onLiveStreamMatchChange();
    }
}

export function closeLiveStreamHubModal() {
    const modal = document.getElementById('liveStreamHubModal');
    if (modal) modal.style.display = 'none';
}

// 7. AI Press Release Modal
export function openAiPressReleaseModal() {
    const modal = document.getElementById('aiPressReleaseModal');
    if (modal) modal.style.display = 'flex';
    if (typeof window !== 'undefined' && typeof window.generateAIPressRelease === 'function') {
        window.generateAIPressRelease('PRE_MATCH');
    }
}

export function closeAiPressReleaseModal() {
    const modal = document.getElementById('aiPressReleaseModal');
    if (modal) modal.style.display = 'none';
}

// 8. Stadium DJ Modal
export function openStadiumDJModal() {
    const modal = document.getElementById('stadiumDjModal');
    if (modal) modal.style.display = 'flex';
}

export function closeStadiumDJModal() {
    const modal = document.getElementById('stadiumDjModal');
    if (modal) modal.style.display = 'none';
}
