self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("active", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
