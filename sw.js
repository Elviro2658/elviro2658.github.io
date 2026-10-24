const CACHE_NAME = "elviro-service-negar-v48";
const CORE_ASSETS = ["/", "/index.html", "/styles.css?v=47", "/main.js?v=29", "/settings.js?v=1", "/enhancements.js?v=32", "/manifest.webmanifest", "/icons/service-negar-car.svg", "/favicon.svg", "/icons/service-negar-192.png", "/icons/service-negar-512.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(CORE_ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
    const existing = clients.find(function (client) { return new URL(client.url).origin === self.location.origin; });
    if (existing) return existing.focus();
    return self.clients.openWindow("/");
  }));
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(function (cached) {
    if (cached) return cached;
    return fetch(event.request).then(function (response) {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      }
      return response;
    }).catch(function () {
      return caches.match("/index.html");
    });
  }));
});
