/**
 * Pure Lightbox UI Presentation Module for PTX Summer Cup 2026.
 * Opens image lightbox popups cleanly.
 */

export function openLightbox(src) {
    if (!src || typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = src;
    a.setAttribute('data-lightbox', 'gallery');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        if (a.remove) a.remove();
        else if (a.parentNode) a.parentNode.removeChild(a);
    }, 1000);
}
