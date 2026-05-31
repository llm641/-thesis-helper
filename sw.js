/* ===== Service Worker for Thesis Helper ===== */
const CACHE_NAME = 'thesis-helper-v2';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/reference.js',
    './js/checklist.js',
    './js/timeline.js',
    './js/acknowledge.js',
    './js/defense.js',
    './manifest.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache files individually so one failure doesn't break everything
            return Promise.allSettled(
                ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('SW: Failed to cache', url, err);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetched = fetch(event.request).then((response) => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => cached);
            return cached || fetched;
        })
    );
});
