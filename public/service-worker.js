const BUDGETCACHE = "V2"

let form_data;
let our_db;
const STORE_NAME = 'post_requests'

const toCache = [
    '/index.html',
    '/index.js',
    '/offline.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(BUDGETCACHE).then((cache) => {
        return cache.addAll(toCache);
      })
    );
  });

 // Create indexedDB Database
function openDatabase() {
  const IDB_VERSION = 1;
  const indexedDBOpenRequest = indexedDB.open('budget-tracker-form',
    IDB_VERSION)

  indexedDBOpenRequest.onerror = function (error) {
    // error creating db
    console.error('IndexedDB error:', error)
  }

  indexedDBOpenRequest.onupgradeneeded = function () {
    // This should only executes if there's a need to 
    // create/update db.
    let db = indexedDBOpenRequest.result;
    db.createObjectStore(STORE_NAME, {
      autoIncrement: true, 
      keyPath: 'id'
    })
  }

  // This will execute each time the database is opened.
  indexedDBOpenRequest.onsuccess = function () {
    our_db = indexedDBOpenRequest.result;
  }
} 

openDatabase()

  self.addEventListener('fetch', (event) => {
    if (event.request.method != 'GET') return;

   
    event.respondWith(async function () {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
            return cachedResponse;
        }

      const cache = await caches.open(BUDGETCACHE);
       const response = await fetch(event.request);
       cache.put(event.request, response.clone());
       return response;

    }())
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== BUDGETCACHE) {
            return caches.delete(key);
          }
        }));
      })
    );
  });