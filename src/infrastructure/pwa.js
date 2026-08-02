// ============================================================
// INFRASTRUCTURE: PWA INSTALLATION & SERVICE WORKER HELPERS
// ============================================================

import { getStorageItem, setStorageItem } from './storage.js';

let deferredPrompt = null;

export function initPWAHelpers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const banner = document.getElementById('pwa-install-banner');
        if (banner && !getStorageItem('pwa_dismissed')) {
            banner.style.display = 'flex';
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'none';
        console.log('[PWA] Application successfully installed.');
    });
}

export function installPTXPWAApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }
            deferredPrompt = null;
            const banner = document.getElementById('pwa-install-banner');
            if (banner) banner.style.display = 'none';
        });
    } else {
        alert('Ứng dụng đã được cài đặt hoặc trình duyệt của bạn hiện chưa hỗ trợ tự động cài đặt PWA.');
    }
}

export function dismissPWABanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'none';
    setStorageItem('pwa_dismissed', Date.now().toString());
}
