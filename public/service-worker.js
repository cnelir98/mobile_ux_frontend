
// Service Worker
self.addEventListener('push', e => {
    console.log('Push received');
});

self.addEventListener('fetch', e => {
    setTimeout(() => {
    console.log('Fetch event: '
    + e.request.url);
    }, 3000);
});