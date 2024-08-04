const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching

// It ensures that these assets are served from the cache (stale) while
// fetching updated versions in the background (revalidate), providing a
// good balance between performance and freshness for these assets.

// registering a route in a service worker using Workbox

// The function checks if the request's destination is one of 'style',
// 'script', or 'worker'
// The StaleWhileRevalidate strategy is used to serve the cached response
// (stale) while simultaneously fetching a new response (revalidate) in the
// background.
// CacheableResponsePlugin: A plugin used to configure which response
// statuses should be cached. In this case, responses with status codes 0
// (for opaque responses) and 200 (successful responses) will be cached.

registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
