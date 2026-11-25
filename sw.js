const CACHE='workout-timer-v5';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
const save=(req,r)=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c))}return r};
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  /* the page itself: newest version when online, cached copy when offline */
  if(req.mode==='navigate'||req.url.endsWith('.html')){
    e.respondWith(fetch(req).then(r=>save(req,r)).catch(()=>caches.match(req,{ignoreSearch:true}).then(h=>h||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>save(req,r))));
});
