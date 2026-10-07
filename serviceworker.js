// Service Worker para PWA - CoffeeShop GB
// Este archivo hace que la app funcione offline y muestre el icono de instalar en Chrome

const CACHE_NAME = 'coffeeshop-gb-v1';
const urlsToCache = [
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

// Instalar el Service Worker y cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  // Forzar que el nuevo SW tome control inmediatamente
  self.clients.claim();
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cacheWhitelist.indexOf(cache) === -1) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Tomar control de todas las ventanas cliente
  self.clients.claim();
});

// Estrategia de fetch: cache first para assets, network first para datos
self.addEventListener('fetch', event => {
  // Solo cachear GET requests a mismo origen
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Cachear archivos estáticos (HTML, CSS, JS, imágenes)
  if (urlsToCache.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  } else {
    // Para otras peticiones, ir a la red
    event.respondWith(
      fetch(event.request).catch(() => {
        // Si falla la red, intentar con cache
        return caches.match(event.request);
      })
    );
  }
});