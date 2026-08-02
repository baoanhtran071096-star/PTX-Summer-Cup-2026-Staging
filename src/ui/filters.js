/**
 * Pure Filter & Tab UI Presentation Module for PTX Summer Cup 2026.
 * Manages strictly DOM active class toggles and view container visibility.
 * ZERO data mutation, ZERO storage reading.
 */

// 1. Team SubTab Filter UI
export function setTeamSubTabUI(mode) {
    const rosterView = document.getElementById('teamsPageRostersView');
    const pitchView = document.getElementById('teamsPagePitchView');
    const btnRoster = document.getElementById('btnTeamTabRoster');
    const btnPitch = document.getElementById('btnTeamTabPitch');

    if (mode === 'roster') {
        if (rosterView) rosterView.style.display = 'grid';
        if (pitchView) pitchView.style.display = 'none';
        if (btnRoster) btnRoster.classList.add('active');
        if (btnPitch) btnPitch.classList.remove('active');
    } else {
        if (rosterView) rosterView.style.display = 'none';
        if (pitchView) pitchView.style.display = 'flex';
        if (btnPitch) btnPitch.classList.add('active');
        if (btnRoster) btnRoster.classList.remove('active');
    }
}

// 2. Admin Tab Filter UI
export function setAdminTabUI(index) {
    for (let i = 1; i <= 4; i++) {
        const tabContent = document.getElementById('adminTabContent' + i);
        const tabBtn = document.getElementById('tabBtnAdmin' + i);
        if (tabContent) tabContent.style.display = i === index ? 'block' : 'none';
        if (tabBtn) {
            if (i === index) {
                tabBtn.style.background = '#3b82f6';
                tabBtn.style.color = '#fff';
                tabBtn.style.borderColor = '#3b82f6';
                tabBtn.style.fontWeight = '800';
            } else {
                tabBtn.style.background = 'rgba(255,255,255,0.05)';
                tabBtn.style.color = '#cbd5e1';
                tabBtn.style.borderColor = '#334155';
                tabBtn.style.fontWeight = '700';
            }
        }
    }
}

// 3. FIFA Player Team Filter UI
export function setFifaTeamFilterUI(btn) {
    document.querySelectorAll('.fifa-team-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
}

// 4. Gallery Category Filter UI
export function setGalleryFilterUI(btn) {
    document.querySelectorAll('.gallery-filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
}
