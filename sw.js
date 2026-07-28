// ================================================================
//  📦 SERVICE WORKER - TrackSphere PWA
//  مع نظام تحديث تلقائي
// ================================================================

// ====== إعدادات ======
const APP_VERSION = '1.0.0';
const CACHE_NAME = 'tracksphere-v' + APP_VERSION;
const urlsToCache = [
    '/',
    '/index.html',
    '/version.json',
    '/css/style.css',
    '/css/dark-mode.css',
    '/js/app.js',
    '/js/language.js',
    '/js/storage.js',
    '/js/gamification.js',
    '/js/charts.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap'
];

// ================================================================
//  🔧 INSTALL - تثبيت الـ Service Worker
// ================================================================

self.addEventListener('install', function(event) {
    console.log('📦 Service Worker installing...', APP_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Caching files...');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                // ✅ يحدث نفسه فوراً (لا ينتظر)
                return self.skipWaiting();
            })
    );
});

// ================================================================
//  🚀 ACTIVATE - تفعيل الـ Service Worker
// ================================================================

self.addEventListener('activate', function(event) {
    console.log('🚀 Service Worker activating...', APP_VERSION);
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            // ✅ حذف الكاش القديم
            var deletePromises = cacheNames.map(function(cacheName) {
                if (cacheName !== CACHE_NAME) {
                    console.log('🗑️ Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                }
            });
            return Promise.all(deletePromises);
        })
        .then(function() {
            // ✅ يسيطر على الصفحات فوراً
            console.log('✅ Service Worker activated!');
            return self.clients.claim();
        })
    );
});

// ================================================================
//  🔄 FETCH - جلب الملفات
// ================================================================

self.addEventListener('fetch', function(event) {
    // ✅ استثناء ملف version.json (يتم جلبه من السيرفر دايماً)
    if (event.request.url.includes('version.json')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' })
                .catch(function() {
                    return new Response(JSON.stringify({
                        version: APP_VERSION,
                        updated: new Date().toISOString()
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }

    // ✅ باقي الملفات: من الكاش أولاً، ثم السيرفر
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    // ✅ جلب نسخة جديدة من السيرفر في الخلفية (تحديث تلقائي)
                    fetch(event.request).then(function(freshResponse) {
                        if (freshResponse && freshResponse.status === 200) {
                            caches.open(CACHE_NAME).then(function(cache) {
                                cache.put(event.request, freshResponse);
                            });
                        }
                    }).catch(function() {
                        // لو السيرفر مش شغال، استخدم الكاش
                    });
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// ================================================================
//  📥 MESSAGE - استقبال رسائل من الصفحة
// ================================================================

self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// ================================================================
//  🔍 CHECK UPDATE - فحص التحديثات
// ================================================================

self.addEventListener('periodicSync', function(event) {
    if (event.tag === 'check-update') {
        event.waitUntil(
            fetch('/version.json', { cache: 'no-store' })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.version && data.version !== APP_VERSION) {
                        console.log('📱 New version available:', data.version);
                        // ✅ إخطار المستخدم بالتحديث
                        self.skipWaiting();
                    }
                })
                .catch(function(error) {
                    console.warn('⚠️ Update check failed:', error);
                })
        );
    }
});

// ================================================================
//  📢 PUSH NOTIFICATION - إشعارات
// ================================================================

self.addEventListener('push', function(event) {
    var data = event.data ? event.data.json() : {};
    var title = data.title || '🔔 TrackSphere';
    var options = {
        body: data.body || 'حان وقت تسجيل عاداتك اليومية!',
        icon: '/assets/icon-192.png',
        badge: '/assets/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ================================================================
//  🔗 NOTIFICATION CLICK - الضغط على الإشعار
// ================================================================

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    var url = event.notification.data.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// ================================================================
//  🚀 LOG - تأكيد التحميل
// ================================================================

console.log('📦 Service Worker loaded successfully!');
console.log('📦 Version:', APP_VERSION);
console.log('📦 Cache name:', CACHE_NAME);