// service-worker.js
// TARUH FILE INI DI FOLDER public/ project React kamu
// (jadi path akhirnya: public/service-worker.js)
//
// Vite otomatis nyalin isi folder public/ apa adanya ke hasil build,
// jadi file ini bisa diakses browser di /service-worker.js

self.addEventListener('push', (event) => {
    let data = { title: 'Notifikasi', body: '', url: '/' };
    try {
        data = event.data.json();
    } catch {
        data.body = event.data ? event.data.text() : '';
    }

    const options = {
        body: data.body,
        icon: '/icon-192.png',       // ganti sesuai icon app kamu, atau hapus baris ini
        badge: '/icon-192.png',      // opsional
        data: { url: data.url || '/' },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Kalau notifikasi diklik, buka/fokuskan tab web app-nya
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});