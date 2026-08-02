// ============================================================
// PTX Summer Cup 2026 — Service Worker v2.6.3
// Provides offline capability and faster loads
// ============================================================

const CACHE_NAME = 'ptx-cup-2026-v2.6.3';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './public/images/teams/bieu_tuong_doi_p__phoenix_.jpg',
    './public/images/teams/bieu_tuong_doi_t__tiger_.jpg',
    './public/images/teams/bieu_tuong_doi_x__xiphias_gladius_.jpg',
    './public/images/branding/logo_ptx.png',
    './public/images/branding/logo_cong_doan.jpg',
    './public/images/branding/banner_ptx_summer_cup.jpg'
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
