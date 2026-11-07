/* Service worker của Play Hub: mạng yếu hoặc mất mạng vẫn mở được game như bình thường.
   Chiến lược: mạng trước (luôn lấy bản mới khi có mạng), quá 3,5 giây hoặc lỗi mạng thì dùng bản đã lưu.
   KHÔNG đụng vào /api/* (dữ liệu, thanh toán, Night Pass luôn đi thẳng ra máy chủ). */
"use strict";
const CACHE = "np-shell-v1";
const SHELL = ["/", "/index.html", "/cozyplay/index.html", "/popplay/index.html", "/cozyplay/games/dap-deadline/index.html", "/cozyplay/games/cozy-wings/index.html", "/popplay/games/pop-fly/index.html", "/popplay/games/lang-cua-be/index.html", "/popplay/games/be-dau-bo-me/index.html",
  "/help.html", "/shared.html", "/leaderboard.html", "/subscribe.html", "/privacy.html",
  "/shared/theme.css", "/shared/layout.css", "/shared/bars.css", "/shared/bars.js", "/shared/social.js", "/shared/bridge.js", "/shared/guard.js",
  "/shared/pass.js", "/shared/site.js", "/shared/track.js", "/shared/updated.js", "/shared/offline.js", "/shared/vendor/html2canvas.min.js"];
const FONTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const keyOf = req => { const u = new URL(req.url); u.search = ""; u.hash = ""; if (u.pathname.endsWith("/")) u.pathname += "index.html"; return u.href; };
const fetchTimeout = (req, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("timeout")), ms); fetch(req).then(r => { clearTimeout(t); res(r); }, e => { clearTimeout(t); rej(e); }); });

self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET") return;
  const sameOrigin = u.origin === self.location.origin;
  if (!sameOrigin && !FONTS.includes(u.hostname)) return;
  if (sameOrigin && (u.pathname.startsWith("/api/") || u.pathname.startsWith("/.netlify/") || u.pathname === "/__reload" || u.pathname === "/sw.js")) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE), key = sameOrigin ? keyOf(req) : req.url;
    const save = r => { if (r && (r.ok || r.type === "opaque") && !r.redirected) cache.put(key, r.clone()).catch(() => {}); return r; };
    const net = fetch(req).then(save);
    try { return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), 3500))]); }
    catch (err) {
      const hit = await cache.match(key);
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }   // dùng bản đã lưu, mạng về thì vẫn cập nhật nền
      try { return await net; } catch (e2) { if (req.mode === "navigate") { const home = await cache.match(new URL("/index.html", self.location.origin).href); if (home) return home; } return Response.error(); }
    }
  })());
});
