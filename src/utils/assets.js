// ============================================================
// ASSET RESOLUTION & RUNTIME FALLBACKS
// ============================================================

export const FALLBACK_PLAYER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2'/%3E%3C/svg%3E";
export const FALLBACK_TEAM_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='1.5'%3E%3Cpath d='M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z'/%3E%3C/svg%3E";
export const FALLBACK_GENERAL_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

export function normalizeAssetUrl(url) {
    if (!url) return FALLBACK_GENERAL_SVG;
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    
    let clean = url.split('?')[0].split('#')[0];
    try { clean = decodeURIComponent(clean); } catch(e) {}

    if (clean.includes('logo biểu tượng 3 đội') || clean.includes('teams/')) {
        if (clean.includes('Phoenix') || clean.includes('P.')) return 'public/images/teams/bieu_tuong_doi_p__phoenix_.jpg';
        if (clean.includes('Tiger') || clean.includes('T.')) return 'public/images/teams/bieu_tuong_doi_t__tiger_.jpg';
        if (clean.includes('Xiphias') || clean.includes('X.')) return 'public/images/teams/bieu_tuong_doi_x__xiphias_gladius_.jpg';
    }
    if (clean.includes('ảnh logo - baner') || clean.includes('branding/')) {
        if (clean.includes('Công Đoàn')) return 'public/images/branding/logo_cong_doan.jpg';
        if (clean.includes('Logo PTX')) return 'public/images/branding/logo_ptx.png';
        if (clean.includes('banner')) return 'public/images/branding/banner_ptx_summer_cup.jpg';
    }
    return url;
}

export function handleImageError(img, fallbackType = 'general') {
    if (img && !img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        if (fallbackType === 'player') img.src = FALLBACK_PLAYER_SVG;
        else if (fallbackType === 'team') img.src = FALLBACK_TEAM_SVG;
        else img.src = FALLBACK_GENERAL_SVG;
    }
}
