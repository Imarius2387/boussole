var CACHE = 'boussole-v1';
var ASSETS = ['/boussole/', '/boussole/index.html', '/boussole/app.js', '/boussole/style.css'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS).catch(function(){}); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }).then(function() { return clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).then(function(r) {
      var clone = r.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      return r;
    }).catch(function() { return caches.match(e.request); })
  );
});

self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : { title: 'Boussole', body: '' };
  e.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: '/boussole/icon-192.png', tag: 'boussole' }));
});
