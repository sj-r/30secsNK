const CACHE_NAME = "thirtysecs-cache-v2";

// Build asset URLs relative to the SW scope (important for GitHub Pages subfolders)
const base = self.registration.scope; // e.g. https://user.github.io/thirtysecs/
const ASSETS = [
  base,
  base + "index.html",
  base + "app.js",
  base + "style.css",
  base + "manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
});

// Cache-first, with special handling for navigations (app shell)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.mode === "navigate") {
    event.respondWith(
      caches.match(base + "index.html").then((cached) => cached || fetch(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
