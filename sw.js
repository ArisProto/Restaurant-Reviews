'use strict';

let filesToCache = [
  '.',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'js/main.js',
  'js/restaurant_info.js',
  'data/restaurants.json'
]

let constantCacheName = 'info-cache-v1';
self.addEventListener('install', function(event) {
  console.log('Attempt at installing ServiceWorker');
  event.waitUntil(
    caches.open(constantCacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating ServiceWorker!')

  const cacheUniversal = [constantCacheName];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheUniversal.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetchh', function() {
  console.log('Fetching event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request);
    })
  );
});
