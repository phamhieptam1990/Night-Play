/* Service worker của Play Hub: mạng yếu hoặc mất mạng vẫn mở được game như bình thường.
   Chiến lược: mạng trước (luôn lấy bản mới khi có mạng), quá 3,5 giây hoặc lỗi mạng thì dùng bản đã lưu.
   KHÔNG đụng vào /api/* (dữ liệu, thanh toán, Night Pass luôn đi thẳng ra máy chủ). */
"use strict";
/* v14: hub (hai thẻ Pop/Night) chuyển từ "/" sang "/play/"; "/" và "/en/" là landing giới thiệu (không nằm trong SHELL, không cần offline).
   Bản v13 trở xuống lưu hub cũ ở khoá "/index.html": activate xoá toàn bộ cache khác tên, nên người dùng cũ tự dọn khi SW mới cài (mạng trước nên "/" luôn lấy landing mới).
   Khi mất mạng mà không có bản lưu của trang đang mở, điều hướng rơi về /play/index.html (hub), KHÔNG về "/" nữa. */
const CACHE = "np-shell-v32";
const SHELL = ["/play/index.html", "/cozyplay/index.html", "/popplay/index.html", "/cozyplay/games/dap-deadline/index.html", "/cozyplay/games/cozy-wings/index.html", "/cozyplay/games/gia-cho-viet/index.html", "/cozyplay/games/xin-nghi/index.html", "/cozyplay/games/me-cung-truyen-tay/index.html", "/cozyplay/games/cho-hang-kieu-viet/index.html", "/cozyplay/games/xe-ca-phe/index.html", "/cozyplay/games/duong-ray/index.html", "/cozyplay/games/xay-cau-tre/index.html", "/cozyplay/games/song-sot-cuoi-thang/index.html", "/cozyplay/games/shipper-sieu-toc/index.html", "/cozyplay/games/ne-o-ga/index.html", "/cozyplay/games/noi-mot-net/index.html", "/cozyplay/games/mat-tinh-khong/index.html", "/cozyplay/games/cat-banh-chung/index.html", "/cozyplay/games/ve-mot-net/index.html", "/cozyplay/games/bao-nhieu-giay/index.html", "/cozyplay/games/ban-co-hieu-toi/index.html", "/cozyplay/games/ga-me-ban-trung/index.html", "/cozyplay/games/doi-doi-2048/index.html", "/popplay/games/pop-fly/index.html", "/popplay/games/lang-cua-be/index.html", "/popplay/games/be-dau-bo-me/index.html", "/popplay/games/ten-lua-cua-be/index.html", "/popplay/games/be-noi-dung-khong/index.html", "/popplay/games/doan-tuoi-nao/index.html", "/popplay/games/bo-me-5-giay/index.html", "/popplay/games/con-vat-an-so/index.html", "/popplay/games/ve-chu-quai-vat/index.html", "/popplay/games/nhay-theo-so/index.html", "/popplay/games/qua-song/index.html", "/popplay/games/thap-vong-mau/index.html",
  "/help.html", "/shared.html", "/leaderboard.html", "/subscribe.html", "/privacy.html", "/terms.html", "/restricted.html",
  "/shared/theme.css", "/shared/align.css", "/shared/landscape.css", "/shared/endui.css", "/shared/endui.js", "/shared/landscape.js", "/shared/poplandscape.css", "/shared/popfit.js", "/shared/pophelp.js", "/shared/popmenu.js", "/shared/icons.js", "/shared/dock.js", "/shared/parentgate.js", "/shared/resume.js", "/shared/fan.js", "/shared/device.js", "/shared/passwatch.js", "/shared/layout.css", "/shared/bars.css", "/shared/bars.js", "/shared/social.js", "/shared/bridge.js", "/shared/widebg.js", "/shared/multi.css", "/shared/multi-games.js", "/shared/orbit.js", "/shared/orbit.css", "/shared/orbit-icons/dap-deadline.svg", "/shared/orbit-icons/gia-cho-viet.svg", "/shared/orbit-icons/cozy-wings.svg", "/shared/orbit-icons/xin-nghi.svg", "/shared/orbit-icons/song-sot-cuoi-thang.svg", "/shared/orbit-icons/cho-hang-kieu-viet.svg", "/shared/orbit-icons/ten-lua-cua-be.svg", "/shared/orbit-icons/con-vat-an-so.svg", "/shared/orbit-icons/ve-chu-quai-vat.svg", "/shared/orbit-icons/nhay-theo-so.svg", "/shared/orbit-icons/thap-vong-mau.svg", "/shared/orbit-icons/lang-cua-be.svg", "/cozyplay/multi.html", "/shared/guard.js", "/shared/help.js", "/shared/typeui.css",
  "/manifest.webmanifest", "/popplay/manifest.webmanifest", "/shared/app-180.png", "/shared/app-192.png", "/shared/app-512.png", "/shared/pop-180.png", "/shared/pop-192.png", "/shared/pop-512.png",
  "/shared/rails.js", "/shared/rails.css", "/shared/portalui.css", "/shared/portalnp.css", "/shared/portalui.js", "/shared/newbadge.js", "/shared/hud.js", "/shared/hud.css", "/shared/backpos.js", "/shared/backpos.css", "/shared/glass.css", "/shared/nppopup.css", "/shared/nppopup.js", "/shared/poptitle.css", "/shared/poptitle.js", "/shared/exitconfirm.js", "/shared/endguard.js", "/shared/difficulty.js", "/shared/difficulty.css", "/shared/kidlock.js", "/shared/inapp.js",
  "/shared/fonts.css", "/shared/fonts/inter-var-latin-vi.woff2",
  "/shared/pass.js", "/shared/fx.js", "/shared/season.js", "/shared/welcome.js", "/shared/nightpass-ui.css", "/shared/site.js", "/shared/legaldoc.css", "/shared/legaldoc.js", "/shared/track.js", "/shared/updated.js", "/shared/offline.js", "/shared/vendor/html2canvas.min.js",
  /* ảnh minh hoạ nhỏ của game (Cánh Nhỏ Phiêu Lưu, Chim Bay Học Vui): cần khi mất mạng */
  "/cozyplay/games/cozy-wings/thumbs/bee-default.jpg", "/cozyplay/games/cozy-wings/thumbs/bee-firefly.jpg", "/cozyplay/games/cozy-wings/thumbs/bee-lavender.jpg", "/cozyplay/games/cozy-wings/thumbs/bee-royal.jpg", "/cozyplay/games/cozy-wings/thumbs/bee-sakura.jpg", "/cozyplay/games/cozy-wings/thumbs/bug-autumn.jpg", "/cozyplay/games/cozy-wings/thumbs/bug-default.jpg", "/cozyplay/games/cozy-wings/thumbs/bug-mush.jpg", "/cozyplay/games/cozy-wings/thumbs/bug-night.jpg", "/cozyplay/games/cozy-wings/thumbs/bug-rain.jpg", "/cozyplay/games/cozy-wings/thumbs/fish-arctic.jpg", "/cozyplay/games/cozy-wings/thumbs/fish-coral.jpg", "/cozyplay/games/cozy-wings/thumbs/fish-default.jpg", "/cozyplay/games/cozy-wings/thumbs/fish-glow.jpg", "/cozyplay/games/cozy-wings/thumbs/fish-sunset.jpg", "/cozyplay/games/cozy-wings/thumbs/kite-alps.jpg", "/cozyplay/games/cozy-wings/thumbs/kite-beach.jpg", "/cozyplay/games/cozy-wings/thumbs/kite-default.jpg", "/cozyplay/games/cozy-wings/thumbs/kite-dusk.jpg", "/cozyplay/games/cozy-wings/thumbs/kite-rice.jpg", "/cozyplay/games/cozy-wings/thumbs/lantern-default.jpg", "/cozyplay/games/cozy-wings/thumbs/lantern-festival.jpg", "/cozyplay/games/cozy-wings/thumbs/lantern-hoian.jpg", "/cozyplay/games/cozy-wings/thumbs/lantern-moon.jpg", "/cozyplay/games/cozy-wings/thumbs/lantern-snow.jpg", "/popplay/games/pop-fly/thumbs/letters-default.jpg", "/popplay/games/pop-fly/thumbs/letters-fire.jpg", "/popplay/games/pop-fly/thumbs/letters-jungle.jpg", "/popplay/games/pop-fly/thumbs/letters-night.jpg", "/popplay/games/pop-fly/thumbs/letters-ocean.jpg", "/popplay/games/pop-fly/thumbs/letters-snow.jpg", "/popplay/games/pop-fly/thumbs/math-balloon.jpg", "/popplay/games/pop-fly/thumbs/math-biplane.jpg", "/popplay/games/pop-fly/thumbs/math-default.jpg", "/popplay/games/pop-fly/thumbs/math-rocket.jpg", "/popplay/games/pop-fly/thumbs/math-sub.jpg", "/popplay/games/pop-fly/thumbs/math-ufo.jpg", "/popplay/games/pop-fly/thumbs/stars-aurora.jpg", "/popplay/games/pop-fly/thumbs/stars-candy.jpg", "/popplay/games/pop-fly/thumbs/stars-default.jpg", "/popplay/games/pop-fly/thumbs/stars-dragon.jpg", "/popplay/games/pop-fly/thumbs/stars-galaxy.jpg", "/popplay/games/pop-fly/thumbs/stars-moon.jpg"
];
const CORE = ["/play/index.html", "/shared/theme.css", "/manifest.webmanifest"];
const FONTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

/* Host có thể chuyển hướng /x.html → /x/ (Cloudflare): phản hồi "redirected" KHÔNG được dùng để trả lời điều hướng (lỗi mạng khi offline),
   nên luôn lưu bản sao sạch (redirected = false) của cùng nội dung. */
const clean = r => (r && r.redirected ? new Response(r.body, { status: r.status, statusText: r.statusText, headers: r.headers }) : r);
/* chép các tệp còn trong cache bản cũ sang cache mới (không tốn mạng) để người dùng cũ không mất khả năng offline khi bump phiên bản */
const migrate = async c => { try { for (const k of await caches.keys()) { if (k === CACHE || !k.startsWith("np-shell-")) continue; const oc = await caches.open(k); for (const rq of await oc.keys()) { if (await c.match(rq)) continue; const rs = await oc.match(rq); if (rs) await c.put(rq, rs); } } } catch (e) {} };
let precaching = null;
const precache = () => precaching || (precaching = caches.open(CACHE).then(async c => {
  const todo = []; for (const u of SHELL) if (!(await c.match(new URL(u, self.location.origin).href))) todo.push(u);
  let i = 0; const worker = async () => { while (i < todo.length) { const u = todo[i++]; try { const r = await fetch(new Request(u, { cache: "no-cache", priority: "low" })); if (r && r.ok) await c.put(u, clean(r)); } catch (e) {} } };
  await Promise.all([worker(), worker(), worker()]);
}).catch(() => {}).then(() => { precaching = null; }));
self.addEventListener("message", e => { if (e.data && e.data.np === "precache") e.waitUntil(precache()); });
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => { await migrate(c); await Promise.all(CORE.map(u => c.match(u).then(h => h || fetch(new Request(u, { cache: "reload" })).then(r => (r && r.ok ? c.put(u, clean(r)) : null)).catch(() => {})))); }).then(() => self.skipWaiting()));
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
  if (sameOrigin && u.pathname === "/favicon.ico") { e.respondWith(new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="32" height="64" fill="#FF5A1F"/><rect x="32" width="32" height="64" fill="#7C5CFF"/><circle cx="32" cy="32" r="14" fill="#fff"/></svg>', { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "max-age=86400" } })); return; }
  if (sameOrigin && (u.pathname.startsWith("/api/") || u.pathname.startsWith("/.netlify/") || u.pathname === "/__reload" || u.pathname === "/sw.js")) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE), key = sameOrigin ? keyOf(req) : req.url;
    const save = r => { if (r && (r.ok || r.type === "opaque")) cache.put(key, r.redirected ? clean(r.clone()) : r.clone()).catch(() => {}); return r; };
    const net = fetch(req).then(save);
    try { return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), 3500))]); }
    catch (err) {
      const hit = await cache.match(key);
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }   // dùng bản đã lưu, mạng về thì vẫn cập nhật nền
      try { return await net; } catch (e2) { if (req.mode === "navigate") { const home = await cache.match(new URL("/play/index.html", self.location.origin).href); if (home) return home; } return Response.error(); }
    }
  })());
});
