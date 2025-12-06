import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Claim clients as soon as SW activates
clientsClaim();

// self.__WB_MANIFEST will be injected at build time
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// API runtime caching (matches vite.config.ts)
registerRoute(
  ({ url }) => url.href.startsWith("http://localhost:3400/"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 })],
  })
);

// Asset runtime caching
registerRoute(
  ({ request, url }) =>
    request.destination === "image" ||
    /\.(png|jpg|jpeg|svg|gif|webp)$/.test(url.pathname),
  new CacheFirst({
    cacheName: "assets-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 2592000 }),
    ],
  })
);

// Optional: listen for skipWaiting message to update immediately
self.addEventListener("message", (event) => {
  if (event?.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
