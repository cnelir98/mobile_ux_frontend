// Service Worker
self.addEventListener('push', e => {
    console.log('Push received');
});

self.addEventListener('install', function (event) {

	// Activate right away
	self.skipWaiting();
});

// Service Worker continued
self.addEventListener('fetch', function (event) {
	event.respondWith(
		fetch(event.request).catch(function () {
		return caches.match(event.request);
		}),
	);
	});

