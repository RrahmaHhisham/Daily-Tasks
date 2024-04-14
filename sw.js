const cacheName = "DEV-HUB-V1";

const assets = [
    "/",
    "/index.html",
    "/main-js/main.js",
    "/style-css/all.min.css",
    "/style-css/style.css",
    "/webfonts/fa-brands-400.ttf",
    "/webfonts/fa-brands-400.woff2",
    "/webfonts/fa-regular-400.ttf",
    "/webfonts/fa-regular-400.woff2",
    "/webfonts/fa-solid-900.ttf",
    "/webfonts/fa-solid-900.woff2",
    "/webfonts/fa-v4compatibility.ttf",
    "/webfonts/fa-v4compatibility.woff2",
    "/list-check.svg",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
    "https://fonts.googleapis.com",
    "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Architects+Daughter&family=Cairo:wght@700&family=Dancing+Script:wght@400..700&family=Jomhuria&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Open+Sans:ital,wght@1,300&family=Pacifico&family=Rubik&family=Sacramento&display=swap",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
];

// store files in catch-storeage
self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(assets);
      })
      .catch((err) => {
        console.error("Error caching files:", err);
      })
  );
});

// update files
self.addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});
// take file from catch-storeage and show it ofline
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
