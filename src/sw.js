// Minimal service worker so phones can install Wishlylist and add it to the Share menu.
// It does not cache anything: the site always loads fresh from the internet.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
