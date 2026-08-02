/**
 * Gallery View Orchestration Adapter for PTX Summer Cup 2026.
 * Bridges application state/config with pure Gallery View Renderer.
 */

import { renderGalleryGrid } from '../ui/views/gallery.view.js';
import { openLightbox as pureOpenLightbox } from '../ui/lightbox.js';

export function renderGalleryPageAdapter() {
    const container = document.getElementById('galleryPageGrid');
    const items = (typeof window !== 'undefined' && window.GALLERY_PAGE_ITEMS) || [];
    const filter = (typeof window !== 'undefined' && window.galleryCurrentFilter) || 'all';

    renderGalleryGrid(container, items, filter);

    if (typeof window !== 'undefined' && typeof window.initReveal === 'function') {
        setTimeout(window.initReveal, 100);
    }
}

export function openLightboxAdapter(src) {
    pureOpenLightbox(src);
}
