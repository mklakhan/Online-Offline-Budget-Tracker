const BUDGETCACHE = "V2"

const toCache = [
    '/index.html',
    '/index.js',
    '/offline.js',
    '/style.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(BUDGETCACHE).then((cache) => {
        return cache.addAll(toCache);
      })
    );
  });

  self.addEventListener('fetch', (event) => {
    // event.respondWith(
    //   caches.match(event.request).then((resp) => {
    //     return resp || fetch(event.request).then((response) => {
    //       return caches.open(BUDGETCACHE)
    //       .then((cache) => {
    //         cache.put(event.request, response.clone());
    //         return response;
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       });
    //     });
    //   })
    // );
    if (event.request.method != 'GET') return;

    // Prevent the default, and handle the request ourselves.
    event.respondWith(async function () {
        // Try to get the response from a cache.
        const cache = await caches.open(BUDGETCACHE);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            // If we found a match in the cache, return it, but also
            // update the entry in the cache in the background.
            event.waitUntil(cache.add(event.request));
            return cachedResponse;
        }

        // If we didn't find a match in the cache, use the network.
        return fetch(event.request);
    }())
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== BUDGETCACHE) {
            return caches.delete(key);
          }
        }));
      })
    );
  });