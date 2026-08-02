/**
 * Pure Navigation UI Module for PTX Summer Cup 2026.
 * Manages view page toggles, active page title/meta updates, and navigation link active states.
 */

const pageConfig = {
    home: { title: 'PTX Summer Cup 2026 2.0 - Trang chủ', desc: 'Giải bóng đá truyền thống PTX Group Vietnam' },
    about: { title: 'Giới thiệu - PTX Summer Cup 2026', desc: 'Tìm hiểu về giải đấu' },
    schedule: { title: 'Lịch thi đấu - PTX Summer Cup 2026', desc: 'Lịch và kết quả' },
    standings: { title: 'BXH - PTX Summer Cup 2026', desc: 'Bảng xếp hạng' },
    teams: { title: 'Đội bóng - PTX Summer Cup 2026', desc: 'Thông tin các đội' },
    players: { title: 'Cầu thủ - PTX Summer Cup 2026', desc: 'Danh sách cầu thủ' },
    statistics: { title: 'Thống kê - PTX Summer Cup 2026', desc: 'Số liệu giải đấu' },
    gallery: { title: 'Thư viện - PTX Summer Cup 2026', desc: 'Hình ảnh giải đấu' },
    admin: { title: 'Quản trị - PTX Summer Cup 2026', desc: 'Hệ thống quản trị giải đấu' }
};

export function normalizeRoute(pageId) {
    if (!pageId) return 'home';
    const clean = pageId.replace(/^#\/?/, '').trim();
    if (pageConfig[clean]) return clean;
    return 'home';
}

export function navigate(pageId) {
    const targetPage = normalizeRoute(pageId);
    let targetEl = document.getElementById('page-' + targetPage);

    if (!targetEl) {
        targetEl = document.getElementById('page-home');
    }

    if (!targetEl) {
        console.error('[Router Error] Critical: page-home missing from DOM');
        return;
    }

    // 1. Update UI active states transactionally
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    targetEl.classList.add('active');

    // 2. Update page metadata
    const data = pageConfig[targetPage] || pageConfig['home'];
    if (data) {
        document.title = data.title;
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute('content', data.desc);
    }

    // 3. Update navigation link active state
    document.querySelectorAll('.nav-links a, .bottom-nav .nav-item').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && (href === '#' + targetPage || href === '#/' + targetPage)) {
            link.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
