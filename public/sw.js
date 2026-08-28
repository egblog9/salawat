// Salawat PWA Service Worker
const CACHE_NAME = "salawat-v3";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/audio/salawat-reminder.mp3",
  "/audio/salawat-formula-2.mp3"
];

// Install: Cache critical static assets immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Pre-caching skipped non-critical errors:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Delete old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Handle network requests with cache fallback
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API routes and analytics
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback for navigation requests (HTML pages)
        if (event.request.mode === "navigate") {
          const cachedHome = await caches.match("/index.html");
          if (cachedHome) return cachedHome;
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});

// Notification Click Handler: Focus or open the app when clicking system notifications or Fajr alarm actions
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // 1. If an existing window is open, focus it immediately
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.postMessage({ type: "ALARM_NOTIFICATION_CLICKED" });
          return client.focus();
        }
      }
      // 2. If no window is open, open a new window to show the alarm screen
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

