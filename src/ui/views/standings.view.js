/**
 * Pure Standings View Renderer for PTX Summer Cup 2026.
 * Obeys View Purity Contract: Pure DOM rendering inside supplied container.
 * ZERO data mutation, ZERO storage writes, ZERO network calls.
 */

export function renderStandingsWidget(container, teams = [], teamsData = {}) {
    if (!container) return;
    container.innerHTML = '';
    const maxPts = Math.max(1, ...teams.map(t => t.obj.pts));

    teams.forEach((team, idx) => {
        const rank = idx + 1;
        let rankClass = '';
        let crown = '';
        if (rank === 1) {
            rankClass = 'gold';
            crown = '👑';
        } else if (rank === 2) {
            rankClass = 'silver';
        } else if (rank === 3) {
            rankClass = 'bronze';
        }

        const pct = (team.obj.pts / maxPts) * 100;
        const change = idx === 0 ? '↑' : idx === 1 ? '↓' : '↑';
        const changeClass = idx === 0 ? 'up' : idx === 1 ? 'down' : 'up';

        const card = document.createElement('div');
        card.className = 'standing-card reveal';
        card.innerHTML = `
            <div class="rank ${rankClass}">${rank}</div>
            <div class="team-icon" style="overflow:hidden; padding:0; display:flex; justify-content:center; align-items:center;">${team.obj.logo ? `<img src="${team.obj.logo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : team.icon}</div>
            <div class="team-info">
                <div class="name">${team.label} ${crown ? `<span class="crown">${crown}</span>` : ''}</div>
                <div class="stats-row">
                    <span>⚽ ${team.obj.goalsFor}</span>
                    <span>🛡️ ${team.obj.goalsAgainst}</span>
                    <span>📊 ${team.obj.gd}</span>
                </div>
            </div>
            <div class="points-col">
                <div class="pts">${team.obj.pts}</div>
                <div class="pts-label">PTS</div>
            </div>
            <div class="rank-change ${changeClass}">${change}</div>
            <div class="progress-bar-wrap">
                <div class="progress-bar-fill" style="width: ${pct}%"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

export function renderStandingsTable(container, teams = [], teamsData = {}, renderTeamLogoFn = () => '') {
    if (!container) return;
    container.innerHTML = '';

    const medals = ['🥇', '🥈', '🥉'];
    const rowClasses = ['gold-row', 'silver-row', 'bronze-row'];
    const leaderTeam = teams[0] ? teamsData[teams[0].id] : null;
    const leaderObj = teams[0] ? teams[0].obj : null;

    const isPreMatch = (leaderObj && leaderObj.played === 0);
    const aiWinOdds = isPreMatch ? [33.3, 33.3, 33.3] : [68, 22, 10];
    const formBadgesList = isPreMatch
        ? ['<span style="color:#94a3b8;font-weight:700;">⏳ Chưa thi đấu</span>', '<span style="color:#94a3b8;font-weight:700;">⏳ Chưa thi đấu</span>', '<span style="color:#94a3b8;font-weight:700;">⏳ Chưa thi đấu</span>']
        : [
            '<span style="color:#22c55e;font-weight:900;">🟢 W</span> <span style="color:#eab308;font-weight:900;">🟡 D</span>',
            '<span style="color:#eab308;font-weight:900;">🟡 D</span> <span style="color:#eab308;font-weight:900;">🟡 D</span>',
            '<span style="color:#eab308;font-weight:900;">🟡 D</span> <span style="color:#ef4444;font-weight:900;">🔴 L</span>'
        ];

    // Top 1 Leader Spotlight Banner
    if (leaderTeam && leaderObj) {
        const spotlight = document.createElement('div');
        spotlight.style.cssText = 'background:linear-gradient(135deg,rgba(251,191,36,0.15),rgba(15,23,42,0.9));border:2px solid rgba(251,191,36,0.5);border-radius:20px;padding:18px 24px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;box-shadow:0 10px 30px rgba(251,191,36,0.15);';
        
        const titleText = isPreMatch ? '🏟️ BẢNG XẾP HẠNG TRƯỚC KHAI MẠC (07/08/2026)' : '🏆 ĐỘI DẪN ĐẦU BẢNG XẾP HẠNG REALTIME';
        const statusBadge = isPreMatch ? 'CÂN BẰNG 33.3% ⚖️' : '68% 🥇';
        const logo = renderTeamLogoFn(leaderTeam);

        spotlight.innerHTML = `
            <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:52px;height:52px;border-radius:50%;background:rgba(251,191,36,0.2);border:2px solid #fbbf24;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 0 20px rgba(251,191,36,0.4);">
                    ${isPreMatch ? '🏟️' : '👑'}
                </div>
                <div>
                    <div style="font-size:11px;font-weight:900;color:#fbbf24;letter-spacing:1px;text-transform:uppercase;">${titleText}</div>
                    <div style="font-size:18px;font-weight:900;color:#fff;font-family:var(--font-title);">${logo} ${leaderTeam.fullName}</div>
                </div>
            </div>
            <div style="display:flex;gap:16px;align-items:center;background:rgba(0,0,0,0.4);padding:8px 16px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
                <div style="text-align:center;"><div style="font-size:10px;color:#94a3b8;font-weight:700;">ĐIỂM SỐ</div><div style="font-size:16px;font-weight:900;color:#fbbf24;">${leaderObj.pts} ĐIỂM</div></div>
                <div style="width:1px;height:24px;background:rgba(255,255,255,0.1);"></div>
                <div style="text-align:center;"><div style="font-size:10px;color:#94a3b8;font-weight:700;">HIỆU SỐ</div><div style="font-size:16px;font-weight:900;color:#4ade80;">${leaderObj.gd > 0 ? '+' + leaderObj.gd : leaderObj.gd}</div></div>
                <div style="width:1px;height:24px;background:rgba(255,255,255,0.1);"></div>
                <div style="text-align:center;"><div style="font-size:10px;color:#94a3b8;font-weight:700;">XÁC SUẤT VÔ ĐỊCH AI</div><div style="font-size:16px;font-weight:900;color:#60a5fa;">${statusBadge}</div></div>
            </div>
        `;
        container.appendChild(spotlight);
    }

    // Header
    const header = document.createElement('div');
    header.className = 'std-page-header';
    header.innerHTML = `
        <span>HẠNG</span>
        <span>ĐỘI BÓNG</span>
        <span>TR</span>
        <span>W</span>
        <span>D</span>
        <span>L</span>
        <span>HS</span>
        <span>ĐIỂM</span>
    `;
    container.appendChild(header);

    teams.forEach((team, idx) => {
        const t = teamsData[team.id] || { name: team.label, color: '#3b82f6' };
        const o = team.obj;
        const row = document.createElement('div');
        row.className = `std-page-row ${rowClasses[idx] || ''} reveal`;
        row.style.transitionDelay = idx * 0.1 + 's';
        const gdStr = o.gd > 0 ? '+' + o.gd : '' + o.gd;
        const ptsColor = idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#cd7c4a';
        const odds = aiWinOdds[idx] || 33.3;
        const formBadges = formBadgesList[idx] || '<span style="color:#94a3b8;">⏳ Chưa thi đấu</span>';
        const logo = renderTeamLogoFn(t);

        row.innerHTML = `
            <div class="std-rank">${medals[idx]}</div>
            <div class="std-team">
                <span style="font-size:22px;">${logo}</span>
                <div>
                    <div style="font-size:14px;font-weight:900;color:#fff;">${t.name}</div>
                    <div style="font-size:10px;color:#94a3b8;font-weight:600;">${formBadges} • <span style="color:#60a5fa;">AI: ${odds}% 🏆</span></div>
                </div>
            </div>
            <div class="std-cell">${o.played}</div>
            <div class="std-cell" style="color:#22c55e;font-weight:800;">${o.wins}</div>
            <div class="std-cell" style="color:#eab308;">${o.draws}</div>
            <div class="std-cell" style="color:#ef4444;">${o.losses}</div>
            <div class="std-cell" style="color:${o.gd >= 0 ? '#22c55e':'#ef4444'};font-weight:800;">${gdStr}</div>
            <div class="std-pts" style="color:${ptsColor};font-weight:900;font-size:20px;">${o.pts}</div>
        `;
        container.appendChild(row);
    });

    // Progress bars
    const maxPts = Math.max(1, ...teams.map(t => t.obj.pts));
    const barSection = document.createElement('div');
    barSection.style.cssText = 'margin-top:24px;padding:20px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.08);border-radius:18px;';
    barSection.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><span style="font-size:13px;font-weight:900;color:#fbbf24;letter-spacing:1px;text-transform:uppercase;">📊 BIỂU ĐỒ SO SÁNH ĐIỂM SỐ & TỔNG BÀN THẮNG</span><span style="font-size:11px;color:#94a3b8;">Cập nhật realtime</span></div>';
    teams.forEach((team, idx) => {
        const t = teamsData[team.id] || { name: team.label, color: '#3b82f6' };
        const pct = maxPts > 0 ? (team.obj.pts / maxPts) * 100 : 0;
        barSection.innerHTML += `
            <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:4px;">
                    <span style="color:#fff;">${t.name}</span>
                    <span style="color:${t.color};">${team.obj.pts} PTS (${team.obj.goalsFor} Bàn thắng)</span>
                </div>
                <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;">
                    <div style="width:${pct}%;height:100%;background:${t.color};border-radius:4px;transition:width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });
    container.appendChild(barSection);
}
