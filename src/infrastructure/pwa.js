// ============================================================
// INFRASTRUCTURE: PWA INSTALLATION & SERVICE WORKER HELPERS
// (CANONICAL SINGLE SOURCE OF TRUTH)
// ============================================================

import { getStorageItem, setStorageItem } from './storage.js';

let deferredPrompt = null;

function getPWABannerElement() {
    return document.getElementById('pwa-install-banner') || document.getElementById('pwaInstallBanner');
}

function showToastMessage(msg, type = 'info') {
    if (typeof window.showToast === 'function') {
        window.showToast(msg, type);
    } else {
        alert(msg);
    }
}

export function initPWAHelpers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const banner = getPWABannerElement();
        if (banner && !getStorageItem('pwa_dismissed')) {
            banner.style.display = 'flex';
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        const banner = getPWABannerElement();
        if (banner) banner.style.display = 'none';
        console.log('[PWA] Application successfully installed.');
    });
}

export function installPTXPWAApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showToastMessage('🎉 Đã cài đặt App PTX Summer Cup 2026 thành công!', 'success');
            }
            deferredPrompt = null;
            dismissPWABanner();
        });
    } else {
        showToastMessage('📲 Để cài App: Nhấn biểu tượng Mở rộng trình duyệt ➔ "Thêm vào Màn hình chính"!', 'info');
    }
}

export function dismissPWABanner() {
    const banner = getPWABannerElement();
    if (banner) banner.style.display = 'none';
    setStorageItem('pwa_dismissed', '1');
}
