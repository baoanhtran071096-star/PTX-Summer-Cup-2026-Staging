/**
 * Pure Gallery View Renderer for PTX Summer Cup 2026.
 * Obeys View Purity Contract: Pure DOM rendering inside supplied container.
 * ZERO data mutation, ZERO storage writes, ZERO network calls.
 */

export function renderGalleryGrid(container, galleryItems = [], currentFilter = 'all') {
    if (!container) return;
    container.innerHTML = '';

    const items = currentFilter === 'all'
        ? galleryItems
        : galleryItems.filter(i => i.cat === currentFilter);

    items.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'gallery-page-item reveal';
        div.style.transitionDelay = (idx % 4) * 0.07 + 's';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.label}" loading="lazy" onclick="openLightbox(this.src)">
            <div class="gallery-tag">${item.tag}</div>
            <div class="gallery-caption">${item.label}</div>
        `;
        container.appendChild(div);
    });
}
