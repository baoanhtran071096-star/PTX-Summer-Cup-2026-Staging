/**
 * Pure Dashboard & Statistics View Renderer for PTX Summer Cup 2026.
 * Obeys View Purity Contract: Pure DOM rendering inside supplied container.
 * ZERO data mutation, ZERO storage writes, ZERO network calls.
 */

export function renderDashboardStatsWidget(stats = {}, setElTextAndTargetFn = () => {}) {
    setElTextAndTargetFn('stat-goals', stats.goals || 0);
    setElTextAndTargetFn('stat-matches', stats.matches || 0);
    setElTextAndTargetFn('stat-players', stats.players || 0);
    setElTextAndTargetFn('stat-yellow', stats.yellow || 0);
    setElTextAndTargetFn('stat-red', stats.red || 0);

    if (typeof document !== 'undefined') {
        const elTeams = document.getElementById('heroTeamsCount');
        if (elTeams) elTeams.innerText = stats.teams || 3;
        const elPlayers = document.getElementById('heroPlayersCount');
        if (elPlayers) elPlayers.innerText = stats.players || 24;
    }

    setElTextAndTargetFn('stat-goals-page', stats.goals || 0);
    setElTextAndTargetFn('stat-matches-page', stats.matches || 0);
    setElTextAndTargetFn('stat-players-page', stats.players || 0);
    setElTextAndTargetFn('stat-yellow-page', stats.yellow || 0);
    setElTextAndTargetFn('stat-red-page', stats.red || 0);
}

export function renderLeaderSpotlights(topScorer, topMVP, teamsData = {}) {
    if (typeof document === 'undefined') return;
    const gbNameEl = document.getElementById('statsGoldenBootName');
    const gbSubEl = document.getElementById('statsGoldenBootSub');
    if (gbNameEl && topScorer) {
        const teamName = teamsData[topScorer.team] ? teamsData[topScorer.team].name : topScorer.team;
        gbNameEl.innerHTML = `#${topScorer.number} ${topScorer.name} <span style="color:#fbbf24;font-size:13px;">(${teamName})</span>`;
        if (gbSubEl) gbSubEl.innerText = `⚽ ${topScorer.goals} Bàn thắng • ${topScorer.assists} Kiến tạo`;
    }

    const mvpNameEl = document.getElementById('statsMvpName');
    const mvpSubEl = document.getElementById('statsMvpSub');
    if (mvpNameEl && topMVP) {
        const teamName = teamsData[topMVP.team] ? teamsData[topMVP.team].name : topMVP.team;
        mvpNameEl.innerHTML = `#${topMVP.number} ${topMVP.name} <span style="color:#60a5fa;font-size:13px;">(${teamName})</span>`;
        if (mvpSubEl) mvpSubEl.innerText = `⭐ ${topMVP.mvp} Điểm MVP • ${topMVP.position}`;
    }
}

export function renderHallOfFameGrid(containers = [], hofData = {}) {
    if (!containers || containers.length === 0) return;

    containers.forEach(container => {
        if (!container) return;
        container.innerHTML = '';
        const years = [2025, 2026, 2027, 2028, 2029, 2030];

        const defaults = {
            2025: { status: 'ĐÃ TRAO CÚP', statusBg: 'rgba(251,191,36,0.2)', statusColor: '#fbbf24', border: '#fbbf24', bg: 'linear-gradient(135deg,#1e1b4b,#0f172a)', c: 'TEAM P (PHOENIX) 🦅', r: 'Chưa đủ dữ liệu (Cập nhật sau)', t: 'Chưa đủ dữ liệu (Cập nhật sau)', g: 'Chưa đủ dữ liệu (Cập nhật sau)', m: 'Chưa đủ dữ liệu (Cập nhật sau)' },
            2026: { status: 'ĐANG DIỄN RA', statusBg: 'rgba(59,130,246,0.2)', statusColor: '#60a5fa', border: '#3b82f6', bg: 'linear-gradient(135deg,#0b2136,#0f172a)', c: 'Đang tranh tài 🏆 (Bổ sung sau)', r: 'Đang cập nhật (Bổ sung sau)', t: 'Đang cập nhật (Bổ sung sau)', g: 'Đang cập nhật (Bổ sung sau)', m: 'Đang cập nhật (Bổ sung sau)' }
        };

        years.forEach(y => {
            const dataStr = hofData[y];
            let parts = dataStr ? dataStr.split('|') : [];
            const def = defaults[y] || {
                status: 'KẾ HOẠCH', statusBg: 'rgba(148,163,184,0.1)', statusColor: '#94a3b8', border: '#334155', bg: '#0f172a',
                c: `Kế hoạch ${y} 🎯`, r: 'Chưa khởi tranh', t: 'Chưa khởi tranh', g: '—', m: '—'
            };

            const champion = (parts[0] && parts[0].trim()) ? parts[0].trim() : def.c;
            const runnerUp = (parts[1] && parts[1].trim()) ? parts[1].trim() : def.r;
            const thirdPlace = (parts[2] && parts[2].trim()) ? parts[2].trim() : def.t;
            const goldenBoot = (parts[3] && parts[3].trim()) ? parts[3].trim() : def.g;
            const mvp = (parts[4] && parts[4].trim()) ? parts[4].trim() : def.m;

            const card = document.createElement('div');
            card.className = 'card reveal';
            card.style.cssText = `padding:24px;background:${def.bg};border:1px solid ${def.border};border-radius:16px;box-shadow:var(--shadow-card);`;
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:10px;margin-bottom:14px;">
                    <span style="color:${def.statusColor};font-size:20px;font-weight:800;font-family:var(--font-title);">MÙA GIẢI ${y}</span>
                    <span style="background:${def.statusBg};color:${def.statusColor};font-size:10px;font-weight:700;padding:3px 10px;border-radius:12px;border:1px solid ${def.statusColor}44;">${def.status}</span>
                </div>
                <div style="font-size:13px;line-height:2.0;color:#e2e8f0;font-family:var(--font-ui);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px dashed rgba(255,255,255,0.05);padding-bottom:4px;">
                        <span style="color:#fbbf24;font-weight:800;">🥇 VÔ ĐỊCH:</span>
                        <strong style="color:#fff;">${champion}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px dashed rgba(255,255,255,0.05);padding-bottom:4px;">
                        <span style="color:#94a3b8;font-weight:800;">🥈 Á QUÂN:</span>
                        <span>${runnerUp}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px dashed rgba(255,255,255,0.05);padding-bottom:4px;">
                        <span style="color:#cd7c4a;font-weight:800;">🥉 HẠNG BA:</span>
                        <span>${thirdPlace}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px dashed rgba(255,255,255,0.05);padding-bottom:4px;">
                        <span style="color:#f97316;font-weight:800;">⚽ VUA PHÁ LƯỚI:</span>
                        <span>${goldenBoot}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#60a5fa;font-weight:800;">⭐ CẦU THỦ XUẤT SẮC:</span>
                        <span>${mvp}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    });
}
