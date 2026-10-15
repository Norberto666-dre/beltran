// Service Worker para PWA - CoffeeShop GB
// Network First en navegaciones + Cache First en assets.
// Usa rutas RELATIVAS para funcionar en la raíz y en subrutas (GitHub Pages: /beltran/).

const CACHE_NAME = 'coffeeshop-gb-v3';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './detalle.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './imagenes/icons/icon-192x192.png',
  './imagenes/icons/icon-512x512.png',
  './imagenes/imgcard/taza1.png',
  './imagenes/imgcard/taza2.png',
  './imagenes/imgcard/taza3.png',
  './imagenes/imgcard/taza4.png',
  './imagenes/imgcard/taza5.png',
  './imagenes/imgcard/taza6.png',
  './imagenes/imgcard/taza7.png',
  './imagenes/imgcard/taza8.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(error => console.error('Error al precachear:', error))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(nombre => nombre !== CACHE_NAME)
          .map(nombre => caches.delete(nombre))
      ))
      .then(() => self.clients.claim())
  );
});

async function responderNavegacion(request) {
  try {
    const respuesta = await fetch(request);
    if (respuesta && respuesta.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, respuesta.clone());
    }
    return respuesta;
  } catch (error) {
    // Sin red: busca en caché ignorando la query (?id=N) y luego el index
    const cacheada = await caches.match(request, { ignoreSearch: true });
    if (cacheada) return cacheada;

    const index = await caches.match('./index.html');
    if (index) return index;

    return new Response('Estás sin conexión y este recurso no está en caché.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function responderAsset(request) {
  const cacheada = await caches.match(request);
  if (cacheada) return cacheada;

  try {
    const respuesta = await fetch(request);
    if (respuesta && respuesta.ok && new URL(request.url).origin === self.location.origin) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, respuesta.clone());
    }
    return respuesta;
  } catch (error) {
    const fallback = await caches.match('./index.html');
    return fallback || Response.error();
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const esNavegacion = event.request.mode === 'navigate'
    || url.pathname.endsWith('.html')
    || url.pathname.endsWith('/');

  if (esNavegacion) {
    event.respondWith(responderNavegacion(event.request));
  } else {
    event.respondWith(responderAsset(event.request));
  }
});
