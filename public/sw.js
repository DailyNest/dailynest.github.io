/* Minimal service worker for DailyNest
   - Provides a safe no-op fetch handler and basic install/activate flows
   - Listens for push and notificationclick events
   - Expand this with caching or push handling as needed
*/

self.addEventListener('install', (event) => {
  // Activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic fetch handler (no-op passthrough)
self.addEventListener('fetch', (event) => {
  // Let the browser handle requests by default
});

// Push handler: show notification if payload provided
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'DailyNest', body: event.data ? event.data.text() : 'New content available' };
  }

  const title = data.title || 'DailyNest';
  const options = {
    body: data.body || 'Tap to read the latest article',
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
