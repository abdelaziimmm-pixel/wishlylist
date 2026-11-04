// Wishlylist service worker: lets phones install the site and share links or screenshots into it.
// It doesn't cache the site; pages always load fresh.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "POST" || u.pathname !== "/share-target") return;
  e.respondWith((async () => {
    const q = new URLSearchParams();
    try {
      const fd = await e.request.formData();
      ["title", "text", "url"].forEach(k => { const v = fd.get(k); if (v) q.set(k, String(v)); });
      const f = fd.getAll("image").find(x => x && x.size);
      if (f) {
        const c = await caches.open("wl-share");
        await c.put("/shared-image", new Response(f, { headers: { "content-type": f.type || "image/jpeg" } }));
        q.set("img", "1");
      }
    } catch (err) {}
    return Response.redirect("/?" + q.toString(), 303);
  })());
});
