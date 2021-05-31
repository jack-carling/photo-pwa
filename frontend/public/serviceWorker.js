const DYNAMIC_CACHE = 'dynamic-cache-v1';

self.addEventListener('install', (evt) => {
  console.log('[Service Worker] installing');

  // trigger activation programmatically
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[Service Worker] activating');

  // immediately use the 'fetch'-event when activated
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // don't cache images from PokeAPI
  if (evt.request.url.includes('/PokeAPI/sprites/master/sprites/pokemon/')) {
    return;
  }

  // respondWith will halt the service worker
  // from going to sleep before onFetch is finished
  evt.respondWith(onFetch(evt));
});

async function onFetch(evt) {
  // if online
  if (navigator.onLine) {
    // res == response
    let res = await fetch(evt.request);
    let cache = await caches.open(DYNAMIC_CACHE);

    // save response to cache
    // when saving the response we must clone it
    // otherwise the response gets consumed, and
    // cannot be returns to the client
    cache.put(evt.request, res.clone());

    return res;
  }

  // if offline, return cached response
  return caches.match(evt.request);
}
