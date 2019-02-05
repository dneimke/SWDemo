"use strict";

// SW Playground - https://serviceworke.rs/
// ASPNet Core solution - https://madskristensen.net/blog/progressive-web-apps-made-easy-with-aspnet-core/

var version = 'v5:swdemo';
self.addEventListener("install", function (event) {

    console.log('WORKER: install event in progress.');

    event.waitUntil(
        caches.open(version).then(function (cache) {
            return cache.addAll([
                '/Home/Planner',
                '/html/fallback.html',
                '/css/site.css',
                '/lib/bootstrap/dist/css/bootstrap.css',
                '/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
                '/lib/bootstrap/dist/js/bootstrap.js',
                '/lib/jquery/dist/jquery.js',
                '/js/tool.js'
            ]);
        })
        .then(function () {
            console.log('WORKER: install completed');
        }));
});


self.addEventListener('activate', function (event) {
    var cacheKeeplist = [version];

    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.info('Removing ' + key + ' from the cache')
                    return caches.delete(key);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function (event) {

    const url = new URL(event.request.url);

    //return new Response('<p>Returned from service worker.</p>', {
    //    headers: { 'Content-Type': 'text/html' }
    //});

    event.respondWith(
        caches.match(event.request).then(function (response) {

            if (response) {
                console.info('Returning ' + url.pathname + ' from cache:');
                return response;
            } else {
                return fetch(event.request);
            }
            
        }).catch(function () {
            console.info('Returning ' + url.pathname + ' from cache (because of error)');
            return caches.match('/html/fallback.html');
        })
    );
});