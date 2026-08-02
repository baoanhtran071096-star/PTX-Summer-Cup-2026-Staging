/**
 * Pure Matches & Fixtures View Renderer for PTX Summer Cup 2026.
 * Obeys View Purity Contract: Pure DOM rendering inside supplied container.
 * ZERO data mutation, ZERO storage writes, ZERO network calls.
 */

const LIVE_STATS_DATA = {
    possession: [54, 46],
    shots: [9, 7],
    corners: [5, 3],
    fouls: [4, 6]
};

export function renderMatchCard(match, teamsData = {}, resultsData = {}, parseGoalDataFn = () => [], renderTeamLogoFn = () => '', baseDate = new Date(), nowDate = new Date()) {
    const id = match.id;
    const homeTeam = teamsData[match.home] || { name: match.home, color: '#1A5BB5' };
    const awayTeam = teamsData[match.away] || { name: match.away, color: '#D32F2F' };

    const target = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const start = new Date(target);
    start.setHours(match.startH, match.startM, 0, 0);
    const end = new Date(target);
    end.setHours(match.endH, match.endM, 0, 0);

    const resultStr = resultsData[id];
    const result = resultStr ? parseResultStr(resultStr) : null;
    const goals = resultStr ? parseGoalDataFn(resultStr, match) : [];

    const isLive = nowDate >= start && nowDate <= end;
    const isFinished = nowDate > end;

    const card = document.createElement('div');
    card.className = 'match-card-v3';
    if (isLive) card.classList.add('live');
    if (isFinished && result) card.classList.add('finished');

    let statusHtml = '';
    if (isLive) statusHtml = `<span class="match-status live" data-i18n="live_status">🔥 LIVE</span>`;
    else if (isFinished) statusHtml = `<span class="match-status finished" data-i18n="finished_status">Đã kết thúc</span>`;
    else statusHtml = `<span class="match-status" data-i18n="upcoming_status">Sắp diễn ra</span>`;

    let datetimeHtml = '';
    if (!isFinished) {
        datetimeHtml = `
            <div class="match-datetime">
                <span class="date">${String(target.getDate()).padStart(2,'0')}/${String(target.getMonth()+1).padStart(2,'0')}</span>
                <span>${String(match.startH).padStart(2,'0')}:${String(match.startM).padStart(2,'0')}</span>
            </div>
        `;
    }

    let scoreHtml = '', minuteHtml = '', goalTimelineHtml = '', liveStatsHtml = '', countdownHtml = '';

    if (isLive && result) {
        scoreHtml = `<div class="match-score"><span>${result.homeScore}</span><span class="colon">:</span><span>${result.awayScore}</span></div>`;
        const elapsed = Math.floor((nowDate - start) / 60000);
        minuteHtml = `<div class="match-minute">${Math.min(elapsed, 35)}'</div>`;
        if (goals.length > 0) {
            let goalsHtml = '';
            goals.forEach(g => {
                const isHome = g.team === match.home;
                const teamClass = isHome ? 'goal-home' : 'goal-away';
                goalsHtml += `
                    <div class="goal-item ${teamClass}">
                        <span class="goal-icon">⚽</span>
                        <span class="goal-scorer">${g.scorer}</span>
                        <span class="goal-time">${g.minute}'</span>
                    </div>
                `;
            });
            goalTimelineHtml = `<div class="goal-timeline">${goalsHtml}</div>`;
        }
        const homePoss = LIVE_STATS_DATA.possession[0];
        const awayPoss = LIVE_STATS_DATA.possession[1];
        const homeShots = LIVE_STATS_DATA.shots[0];
        const awayShots = LIVE_STATS_DATA.shots[1];
        const homeCorners = LIVE_STATS_DATA.corners[0];
        const awayCorners = LIVE_STATS_DATA.corners[1];
        const homeFouls = LIVE_STATS_DATA.fouls[0];
        const awayFouls = LIVE_STATS_DATA.fouls[1];
        const homeColor = homeTeam.color || '#1A5BB5';
        const awayColor = awayTeam.color || '#D32F2F';

        liveStatsHtml = `
            <div class="live-stats">
                <div class="stat-row">
                    <span class="stat-label" data-i18n="possession">⚡ Possession</span>
                    <div class="stat-values">
                        <span class="val" style="color:${homeColor}">${homePoss}%</span>
                        <div class="bar-wrap">
                            <div class="bar-home" style="width:${homePoss}%;background:${homeColor};"></div>
                            <div class="bar-away" style="width:${awayPoss}%;background:${awayColor};"></div>
                        </div>
                        <span class="val" style="color:${awayColor}">${awayPoss}%</span>
                    </div>
                </div>
                <div class="stat-row">
                    <span class="stat-label" data-i18n="shots">🎯 Shots</span>
                    <div class="stat-values"><span class="val">${homeShots}</span><span style="color:var(--text-muted)">vs</span><span class="val">${awayShots}</span></div>
                </div>
                <div class="stat-row">
                    <span class="stat-label" data-i18n="corners">🔄 Corners</span>
                    <div class="stat-values"><span class="val">${homeCorners}</span><span style="color:var(--text-muted)">vs</span><span class="val">${awayCorners}</span></div>
                </div>
                <div class="stat-row">
                    <span class="stat-label" data-i18n="fouls">🟨 Fouls</span>
                    <div class="stat-values"><span class="val">${homeFouls}</span><span style="color:var(--text-muted)">vs</span><span class="val">${awayFouls}</span></div>
                </div>
            </div>
        `;
    } else if (isFinished && result) {
        scoreHtml = `<div class="match-score"><span>${result.homeScore}</span><span class="colon">:</span><span>${result.awayScore}</span></div>`;
        if (goals.length > 0) {
            let goalsHtml = '';
            goals.forEach(g => {
                const isHome = g.team === match.home;
                const teamClass = isHome ? 'goal-home' : 'goal-away';
                goalsHtml += `
                    <div class="goal-item ${teamClass}">
                        <span class="goal-icon">⚽</span>
                        <span class="goal-scorer">${g.scorer}</span>
                        <span class="goal-time">${g.minute}'</span>
                    </div>
                `;
            });
            goalTimelineHtml = `<div class="goal-timeline">${goalsHtml}</div>`;
        }
    } else {
        const diff = Math.max(0, Math.floor((start - nowDate) / 1000));
        const d = Math.floor(diff / 86400),
            h = Math.floor((diff % 86400) / 3600),
            m = Math.floor((diff % 3600) / 60),
            s = diff % 60;
        countdownHtml = `
            <div class="match-countdown">
                <div class="cd-item"><span class="num">${String(d).padStart(2,'0')}</span><span class="label" data-i18n="days">Ngày</span></div>
                <div class="cd-item"><span class="num">${String(h).padStart(2,'0')}</span><span class="label" data-i18n="hours">Giờ</span></div>
                <div class="cd-item"><span class="num">${String(m).padStart(2,'0')}</span><span class="label" data-i18n="minutes">Phút</span></div>
                <div class="cd-item"><span class="num">${String(s).padStart(2,'0')}</span><span class="label" data-i18n="seconds">Giây</span></div>
            </div>
        `;
    }

    const teamsHtml = `
        <div class="match-teams">
            <span class="team" style="color:${homeTeam.color}">${renderTeamLogoFn(homeTeam)} ${homeTeam.name}</span>
            <span class="vs">VS</span>
            <span class="team" style="color:${awayTeam.color}">${renderTeamLogoFn(awayTeam)} ${awayTeam.name}</span>
        </div>
    `;

    const aiProbHome = match.id === 1 ? 45 : (match.id === 2 ? 40 : 38);
    const aiProbDraw = match.id === 1 ? 25 : (match.id === 2 ? 30 : 24);
    const aiProbAway = 100 - aiProbHome - aiProbDraw;

    const aiProbHtml = `
        <div style="margin-top:14px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:6px;">
                <span>🤖 DỰ ĐOÁN TỈ LỆ AI:</span>
                <span style="color:#60a5fa;">${homeTeam.name} ${aiProbHome}% - ${aiProbDraw}% HÒA - ${aiProbAway}% ${awayTeam.name}</span>
            </div>
            <div style="height:6px;width:100%;background:rgba(255,255,255,0.1);border-radius:6px;overflow:hidden;display:flex;">
                <div style="width:${aiProbHome}%;background:${homeTeam.color};height:100%;"></div>
                <div style="width:${aiProbDraw}%;background:#94a3b8;height:100%;"></div>
                <div style="width:${aiProbAway}%;background:${awayTeam.color};height:100%;"></div>
            </div>
        </div>
    `;

    const actionsHtml = `
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;justify-content:center;">
            <button data-action="openAiGrowthModal" style="flex:1;min-width:110px;background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.4);padding:6px 10px;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
                🎯 Dự đoán tỷ số
            </button>
            <button data-action="openLiveStreamHubModal" style="flex:1;min-width:110px;background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);padding:6px 10px;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
                📺 Livestream 4K
            </button>
        </div>
    `;

    card.innerHTML = `
        ${statusHtml}
        ${datetimeHtml}
        ${teamsHtml}
        ${scoreHtml}
        ${minuteHtml}
        ${goalTimelineHtml}
        ${liveStatsHtml}
        ${countdownHtml}
        ${aiProbHtml}
        ${actionsHtml}
    `;

    return card;
}

export function renderMatchesGrid(container, matches = [], teamsData = {}, resultsData = {}, parseGoalDataFn = () => [], renderTeamLogoFn = () => '', baseDate = new Date(), nowDate = new Date()) {
    if (!container) return;
    container.innerHTML = '';
    matches.forEach(m => {
        container.appendChild(renderMatchCard(m, teamsData, resultsData, parseGoalDataFn, renderTeamLogoFn, baseDate, nowDate));
    });
    if (matches.length === 0) {
        container.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Không có trận đấu nào phù hợp với bộ lọc.</div>`;
    }
}

function parseResultStr(str) {
    if (!str || !str.includes('-')) return null;
    const parts = str.split('-');
    return {
        homeScore: parseInt(parts[0], 10) || 0,
        awayScore: parseInt(parts[1], 10) || 0
    };
}
