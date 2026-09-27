// sw.js — minimal offline app-shell cache for ComputePH (PWA bonus feature).
const CACHE_NAME = 'computeph-cache-v1';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './js/utils.js',
  './js/storage.js',
  './js/theme.js',
  './js/currency.js',
  './js/share.js',
  './js/pwa.js',
  './js/qrcode.js',
  './js/calculators/salary.js',
  './js/calculators/loan.js',
  './js/calculators/freelance.js',
  './js/calculators/savings.js',
  './js/vendor/qrcode.js',
  './assets/icons/favicon.svg',
  './assets/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle same-origin GET requests; let cross-origin (CDN) requests pass straight through.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => cached);
    })
  );
});
