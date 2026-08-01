// ============================================================
// PTX Summer Cup 2026 — Service Worker v1.0
// Provides offline capability and faster loads
// ============================================================

const CACHE_NAME = 'ptx-cup-2026-v2.4.6';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './thư viện/logo biểu tượng 3 đội/Biểu tượng đội P (Phoenix).jpg',
    './thư viện/logo biểu tượng 3 đội/Biểu tượng đội T (Tiger).jpg',
    './thư viện/logo biểu tượng 3 đội/Biểu tượng đội X (Xiphias Gladius).jpg',
    './thư viện/ảnh logo - baner/Logo PTX.png',
    './thư viện/ảnh logo - baner/Logo Công Đoàn.jpg',
    './thư viện/ảnh logo - baner/banner PTX Summer Cup.jpg',
];

// Install — cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Silently fail if some assets are unavailable
            });
        })
    );
    // // // self.skipWaiting(); (Atomic SW Upgrade) (Atomic SW Upgrade) (Atomic SW Upgrade)
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    // // // self.clients.claim(); (Atomic SW Upgrade) (Atomic SW Upgrade) (Atomic SW Upgrade)
});

// Fetch — Network-first for HTML, Cache-first for images/media
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET and cross-origin requests
    if (event.request.method !== 'GET' || url.origin !== location.origin) return;

    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
    const isMedia = /\.(mp4|mp3|webm)$/i.test(url.pathname);
    const isFont = url.hostname.includes('fonts.g');

    if (isImage) {
        // Cache-first for images (faster)
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => cached || new Response('', { status: 404 }));
            })
        );
    } else if (isMedia || isFont) {
        // Stale-while-revalidate for media & fonts
        event.respondWith(
            caches.match(event.request).then((cached) => {
                const fetched = fetch(event.request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
                    }
                    return response;
                });
                return cached || fetched;
            })
        );
    } else {
        // Network-first for HTML & JS (always fresh)
        event.respondWith(
            fetch(event.request).then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
                }
                return response;
            }).catch(() => caches.match(event.request))
        );
    }
});
