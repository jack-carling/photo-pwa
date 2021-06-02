let cache;
let missingImageUrl = 'img/missing-image.gif';

self.addEventListener('install', (e) => onInstall());

self.addEventListener('activate', (e) => onActivate());

self.addEventListener('fetch', (e) => e.respondWith(cacher(e.request)));

async function onInstall() {
  self.skipWaiting();
  cache = cache || (await caches.open('cache'));
  return cache.addAll(['/', missingImageUrl]);
}

async function onActivate() {
  self.clients.claim();
}

async function cacher(request) {
  cache = cache || (await caches.open('cache'));
  let response;
  if (navigator.onLine) {
    response = await fetch(request).catch((e) => (response = null));
  }
  if (!response) {
    response = await cache.match(request);
    response = response || (await fallbackResponses(request));
  } else if (request.method === 'GET') {
    if (!request.url.includes('/api/')) {
      if (request.url.indexOf('http') === 0) {
        // Don't cache non-http requests like 'chrome-extensions'
        cache.put(request, response.clone());
      }
    }
  }
  return response;
}

async function fallbackResponses(request) {
  let response,
    key,
    cacheKeys = await cache.keys();
  let base = location.protocol + '//' + location.host + '/';
  let route = request.url.split(base)[1] || '';
  let extension = request.url.slice(-4);
  if (route && !route.includes('/') && !route.includes('.')) {
    key = cacheKeys.find(({ url }) => url == base);
  }
  if (['.jpg', '.png', '.gif'].includes(extension)) {
    let img = base + missingImageUrl;
    key = cacheKeys.find(({ url }) => url === img);
  }
  response = key && (await cache.match(key));
  return response;
}
