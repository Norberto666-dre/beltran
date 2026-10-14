// Service Worker para PWA - CoffeeShop GB
// Estrategia Network First para funcionar offline y online correctamente

const CACHE_NAME = 'coffeeshop-gb-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/detalle.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/imagenes/icons/icon-192x192.png',
  '/imagenes/icons/icon-512x512.png',
  '/imagenes/imgcard/taza1.png',
  '/imagenes/imgcard/taza2.png',
  '/imagenes/imgcard/taza3.png',
  '/imagenes/imgcard/taza4.png',
  '/imagenes/imgcard/taza5.png',
  '/imagenes/imgcard/taza6.png',
  '/imagenes/imgcard/taza7.png',
  '/imagenes/imgcard/taza8.png'
];

// Install event - cache files precargados
self.addEventListener('install', event => {
  console.log('SW instalando, precacheando', FILES_TO_CACHE.length, 'recursos');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  // Forzar que el nuevo SW tome control inmediatamente
  self.clients.claim();
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando cache antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network First estrategia
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Para navegación (HTML) - Network First: red primero, caché fallback
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        // Actualizar cache en background
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // Fallback a caché si falla la red
        return caches.match(event.request);
      })
    );
  } else {
    // Cache First para assets (imágenes, CSS, JS) - más rápido después de primera visita
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});