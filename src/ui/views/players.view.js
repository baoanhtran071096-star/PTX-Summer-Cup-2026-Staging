/**
 * Pure Players & Rosters View Renderer for PTX Summer Cup 2026.
 * Obeys View Purity Contract: Pure DOM rendering inside supplied container.
 * ZERO data mutation, ZERO storage writes, ZERO network calls.
 */

export function renderTeamRostersGrid(container, playersData = [], teamsData = {}, pitchStartersData = {}, renderTeamLogoFn = () => '') {
    if (!container) return;
    container.innerHTML = '';

    const teamKeys = ['p', 't', 'x'];
    teamKeys.forEach(teamId => {
        const team = teamsData[teamId];
        if (!team) return;
        const players = playersData.filter(p => p.team === teamId);

        const teamCol = document.createElement('div');
        teamCol.className = 'card team-roster-column reveal';
        teamCol.style.padding = '20px';
        teamCol.style.background = 'linear-gradient(180deg, #0f172a 0%, #080d1a 100%)';
        teamCol.style.border = `1px solid ${team.color}66`;
        teamCol.style.borderRadius = '16px';
        teamCol.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5)`;

        let playersHtml = players.map(p => {
            const isCaptain = (p.name === team.captain || p.name === 'Anh Trương' && teamId === 'p' || p.name === 'Minh Thế' && teamId === 't' || p.name === 'Đình Huy' && teamId === 'x');
            const starters = pitchStartersData[teamId] || [];
            const isStarter = starters.includes(p.id);

            return `
                <div class="player-roster-item" onclick="openPlayerModalById(${p.id})" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:${isStarter ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)'};border:1px solid ${isStarter ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'};border-radius:10px;cursor:pointer;transition:all 0.2s ease;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <img src="${p.avatar}" alt="${p.name}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid ${team.color};box-shadow:0 2px 8px rgba(0,0,0,0.4);">
                        <div>
                            <div style="font-size:14px;font-weight:700;color:#fff;display:flex;align-items:center;gap:6px;">
                                ${isCaptain ? '<span style="color:#fbbf24;font-size:13px;" title="Đội trưởng">👑</span>' : ''}
                                <span style="${isCaptain ? 'color:#fbbf24;font-weight:800;' : ''}">${p.name}</span>
                            </div>
                            <div style="font-size:11px;color:#94a3b8;margin-top:2px;display:flex;align-items:center;gap:6px;">
                                <span>Vị trí: <strong style="color:#cbd5e1">${p.position}</strong></span>
                                ${isStarter ? '<span style="background:rgba(34,197,94,0.2);color:#4ade80;font-size:9px;font-weight:800;padding:1px 6px;border-radius:6px;">🟢 ĐỘI HÌNH CHÍNH</span>' : '<span style="background:rgba(245,158,11,0.2);color:#fbbf24;font-size:9px;font-weight:800;padding:1px 6px;border-radius:6px;">🟡 DỰ BỊ</span>'}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;font-size:11px;">
                        <span style="background:rgba(249,115,22,0.15);color:#f97316;border:1px solid rgba(249,115,22,0.3);padding:2px 7px;border-radius:6px;font-weight:700;">⚽ ${p.goals}</span>
                        <span style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);padding:2px 7px;border-radius:6px;font-weight:700;">🎯 ${p.assists}</span>
                        ${p.mvp > 0 ? `<span style="background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3);padding:2px 7px;border-radius:6px;font-weight:700;">⭐ ${p.mvp}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        teamCol.innerHTML = `
            <div style="background:linear-gradient(90deg, ${team.color}33, transparent);padding:14px 16px;border-radius:12px;border-left:4px solid ${team.color};margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:22px;font-weight:900;color:#fff;font-family:var(--font-title);letter-spacing:1px;">
                        ${renderTeamLogoFn(team)} ${team.name}
                    </div>
                    <div style="font-size:12px;color:#cbd5e1;margin-top:2px;font-weight:600;">${team.fullName} • OVR ${team.ovr}</div>
                    <div style="font-size:12px;color:#f97316;font-weight:800;margin-top:4px;">
                        👑 Đội trưởng: <span style="color:#fff;">${team.captain}</span>
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:11px;font-weight:800;background:${team.color};color:#fff;padding:4px 10px;border-radius:20px;display:inline-block;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
                        ${players.length} CẦU THỦ
                    </span>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${playersHtml}
            </div>
        `;
        container.appendChild(teamCol);
    });
}

export function renderPlayerCardsGrid(containers = [], playersData = [], teamsData = {}, currentFilter = 'all', renderTeamLogoFn = () => '', onCardClickFn = () => {}) {
    containers.forEach(({ el, isPage }) => {
        if (!el) return;
        el.innerHTML = '';

        let filteredPlayers = playersData;
        if (isPage && currentFilter !== 'all') {
            filteredPlayers = playersData.filter(p => p.team === currentFilter);
        }

        filteredPlayers.forEach((p, idx) => {
            const team = teamsData[p.team] || { name: p.team, color: '#3b82f6', fullName: p.team };
            const card = document.createElement('div');
            const isCaptain = (p.name === team.captain || (p.name === 'Anh Trương' && p.team === 'p') || (p.name === 'Minh Thế' && p.team === 't') || (p.name === 'Đình Huy' && p.team === 'x'));
            const rating = Math.min(99, Math.floor(72 + (p.goals * 4) + (p.assists * 3) + (p.mvp * 5)));

            card.className = `player-card-fifa reveal visible ${isCaptain ? 'card-captain' : rating >= 80 ? 'card-gold' : ''}`;
            card.style.transitionDelay = (idx % 4) * 0.04 + 's';

            const pac = Math.min(99, 72 + (p.position === 'FW' ? 16 : p.position === 'MF' ? 12 : 8) + (p.id % 7));
            const sho = Math.min(99, 65 + p.goals * 6 + (p.position === 'FW' ? 14 : 4));
            const pas = Math.min(99, 68 + p.assists * 7 + (p.position === 'MF' ? 12 : 5));
            const phy = Math.min(99, 74 + (p.position === 'DF' || p.position === 'GK' ? 14 : 8) + p.mvp * 4);

            card.innerHTML = `
                <div class="rating">${rating}</div>
                <div style="position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;font-size:11px;font-weight:900;padding:3px 9px;border-radius:8px;box-shadow:0 3px 10px rgba(0,0,0,0.5);font-family:var(--font-title);letter-spacing:0.5px;z-index:5;white-space:nowrap;">#${p.number} • ${p.position}</div>
                <div class="avatar-container">
                    <img src="${p.avatar}" class="avatar" alt="${p.name}">
                </div>
                <div class="p-name">${isCaptain ? '👑 ' : ''}${p.name}</div>
                <div class="p-pos">${team.fullName} • Áo số #${p.number}</div>
                
                <div class="p-stats-grid">
                    <div class="p-stat-item"><span class="lbl">TỐC</span><span class="val">${pac}</span></div>
                    <div class="p-stat-item"><span class="lbl">SÚT</span><span class="val">${sho}</span></div>
                    <div class="p-stat-item"><span class="lbl">CHUYỀN</span><span class="val">${pas}</span></div>
                    <div class="p-stat-item"><span class="lbl">LỰC</span><span class="val">${phy}</span></div>
                </div>

                <div class="p-team-badge" style="color:${team.color};border-color:${team.color};">${renderTeamLogoFn(team)} ${team.name}</div>
            `;
            card.addEventListener('click', () => onCardClickFn(p));
            el.appendChild(card);
        });
    });
}
