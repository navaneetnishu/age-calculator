// Service Worker for caching static assets
const CACHE_NAME = 'age-calculator-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/disclaimer',
  '/_next/static/css/app.css',
  '/_next/static/js/app.js',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Return cached response if available
            return response;
          }
          
          // Fetch from network and cache
          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return offline fallback if network fails
            return new Response(
              JSON.stringify({ error: 'Offline - please check your connection' }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        });
      })
    );
    return;
  }

  // Handle static files
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request).then((networkResponse) => {
        // Don't cache non-successful responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache the response
        const responseToCache = networkResponse.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
