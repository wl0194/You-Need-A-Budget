const FILES_TO_CACHE = [
    "/",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/db.js",
    "/style.css",
    "/index.html",
    "/index.js",
]

var CATCHE_NAME = "Budget-v1-Cache"

var DATA_CACHE = "data-v1"

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CATCHE_NAME).then(function (cache) {
        return cache.addAll(FILES_TO_CACHE)

    }))
});

self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('/api/')) {
        event.respondWith(cache.open(DATA_CACHE).then(function (cache) {
            return fetch(event.request).then(function (response) {
                if (response.status === 200) {
                    cache.put(event.request.url, response.clone())
                }
                return response
            })
        }
        ))

    }
    event.respondWith(fetch(event.request).catch(function () {
        return caches.match(event.request).then(function (response) {
            if (response) {
                return response
            }
            if (event.request.get('accept').includes('text/html')) {
                return caches.match('/')
            }
        })
    })
    )
})