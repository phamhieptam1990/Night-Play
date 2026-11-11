# Ngân sách tải trang (lần đầu, cache trống)

Đo bằng `NODE_PATH=<puppeteer-core> node scripts/cozygame/check-load.js [--quick] [--profile=slow4g|fast4g|desktop] [--json] [--only=<chuỗi>]`.
Giả lập: 390x844, DPR 3, CPU x4, băng thông 1,6 Mbps / RTT 150ms **dùng chung cho cả trang và service worker** (máy chủ đo tự bóp băng thông, vì CDP chỉ bóp request của trang, không bóp request của SW).
Mỗi trang mở trong ngữ cảnh ẩn danh mới. Vượt ngân sách <=30% chỉ cảnh báo, >30% là ✗. `check.js` chạy bản `--quick`.

Ngân sách (Slow 4G, CPU x4): FCP <= 1,8s · LCP <= 3s · TBT <= 200ms · CLS < 0,05 · <= 250KB nén tới FCP (game: x3).

## Nguyên nhân chính, theo mức ảnh hưởng

1. **Service worker cài lần đầu tải hết SHELL** (161 tệp, ~3,7MB chưa nén, ~1,5MB gzip, ~150 request) ngay sau `load` của trang cổng/game/subscribe. Chiếm hết băng thông đúng lúc người dùng bấm vào game đầu tiên. Đây là nguyên nhân LAG lần đầu lớn nhất khi mở game ngay sau cổng.
2. **Không có Cache-Control** cho CSS/JS/ảnh (Cloudflare mặc định `must-revalidate`): lần mở thứ hai vẫn hỏi lại máy chủ cho từng tệp (20-60 request, mỗi cái một RTT).
3. **CSS chặn vẽ ở landing và /play/**: 4-5 `<link rel=stylesheet>` nối tiếp nhau sau HTML (thêm 1 RTT + 4 request).
4. DOM lớn ở hai cổng (350-450 phần tử, 240-300 ẩn) và 23 script; TBT cozyplay ~100ms ở CPU x4. Chưa xử lý (xem "Đề xuất").
5. Google Fonts: **không còn**. Đã tự host Inter (`shared/fonts.css`, 50KB woff2 preload, `font-display:swap` + phông dự phòng size-adjust) — phần này do việc đổi phông chung, không thuộc bài này.

## Đã sửa (mỗi bước một commit)

| Việc | Cách | Kết quả đo (Slow 4G, CPU x4) |
|---|---|---|
| SW cài nhẹ (`np-shell-v24`) | install chỉ lưu CORE (play + theme.css + manifest) và chép từ cache cũ sang; phần còn lại tải nền khi trang gửi `{np:"precache"}` (offline.js: load + 3s + rảnh; bỏ qua nếu `saveData` hoặc 2G), `priority:"low"`, 3 luồng | Bấm vào game ngay sau cổng (tap-pop): **319KB -> 82KB** tải, load game **1756ms -> 1075ms**; tap-cozy 237 -> 82KB, 1631 -> 1027ms |
| Cache headers (`dist/_headers`) | ảnh 7 ngày; shared/*.js,css và lp/*.css,js 5 phút + stale-while-revalidate; phông immutable (mẫu không chồng nhau) | lần mở thứ hai không còn request kiểm tra lại cho các tệp tĩnh (đo bằng trình duyệt thật chỉ ở mức header; xác nhận sau khi deploy) |
| CSS nội tuyến lúc build cho landing VI/EN và /play/ (`scripts/build.js`, nguồn không đổi, tắt bằng `NO_INLINE_CSS=1`) | thay `<link rel=stylesheet>` cục bộ bằng `<style>`, url() đổi tuyệt đối | landing: FCP **920-1128ms -> 600-692ms** (3 lần đo mỗi bên), 24 -> 20 request, không FOUC |
| Landing `content-visibility:auto` cho section dưới màn đầu | `landing.css` cuối tệp | giảm layout/paint ban đầu; chữ vẫn trong HTML (SEO) |
| Bài đo `check-load.js` | + DOM/ảnh/script ban đầu, kịch bản "bấm game ngay sau cổng" | nối vào `check.js` bản --quick |

Bảng cuối (sau tất cả; Slow 4G, CPU x4; DOM(ẩn) img scr req):

| Trang | DOM(ẩn) | img | req | KB tới load | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| landing | 629(102) | 51 | 20 | 118 | 516 | 980 | 11 | 0 |
| play | 189(74) | 12 | 29 | 103 | 692 | 692 | 0 | 0 |
| popplay | 350(241) | 24 | 30 | 160 | 724 | 948 | 0 | 0 |
| cozyplay | 448(303) | 41 | 30 | 160 | 760 | 1076 | 96 | 0 |
| game Pop | 186(97) | 0 | 28 | 149 | 876 | 876 | 51 | 0 |
| game Cozy | 168(82) | 0 | 22 | 138 | 796 | 800 | 0 | 0,02 |
| subscribe | 303(218) | 0 | 16 | 85 | 576 | 688 | 0 | 0 |

(Trước khi sửa: landing 70KB/22 req trước khi có phông Inter tự host; tổng byte nền sau load của play/popplay/cozyplay/subscribe: ~1,5MB ở 150-190 request, sau sửa tải nền ~1MB trong 53 request và chỉ bắt đầu sau load+3s+rảnh.)
Tất cả đã trong ngân sách. Lưu ý: máy chủ đo không có TLS/DNS thật nên số tuyệt đối trên mạng thật cao hơn; **mức giảm** (số request, byte tranh băng thông, 1 RTT CSS) là phần đáng tin.

## Chưa làm / đề xuất (để áp sau khi hai cổng cozyplay/popplay chốt)

Không sửa cấu trúc `cozyplay/index.html`, `popplay/index.html` (đang được làm lại), cũng không sửa lõi `play/index.html`.

1. **Nạp có điều kiện cho điện thoại** (ước tính tiết kiệm trên cổng: rails.js 25KB + rails.css 12KB + hud.js 8KB + hud.css 1,6KB ≈ 14KB gzip, ~5 request; widebg.js 12KB ở game). Cổng gọi `NPRails.init(...)` ngay sau thẻ script nên cần stub:
   ```html
   <script>/* thay cho <script src=rails.js> + hud.js */
   (function(){var mq=matchMedia("(min-width:1100px) and (min-height:600px)"),q=[],loaded=0;
   function load(){if(loaded)return;loaded=1;delete window.NPRails;
     var l=document.createElement("link");l.rel="stylesheet";l.href="../shared/rails.css";document.head.appendChild(l);
     ["rails","hud"].forEach(function(n){var s=document.createElement("script");s.src="../shared/"+n+".js";s.onload=function(){if(n==="rails")q.forEach(function(o){NPRails.init(o)})};document.body.appendChild(s)})}
   window.NPRails={init:function(o){q.push(o);if(mq.matches)load()}};
   mq.addEventListener("change",function(){if(mq.matches)load()})})();</script>
   ```
   Cần kiểm tra `check-rails`, `check-hud`, `check-backpos` (hud còn dùng ở ngang không cột: điều kiện của hud phải rộng hơn, đọc đầu `hud.js`). Mong đợi: ≥14KB và 5 request ít hơn ở 390x844.
2. **Cổng: dựng dần DOM** (mục tiêu -35% phần tử ban đầu): chỉ dựng trang lưới đầu, các trang còn lại bằng `requestIdleCallback` / khi chọn chip; `<img>` ô game tạo bằng IntersectionObserver (`rootMargin:"200px"`); popup/menu/hướng dẫn/cổng phụ huynh/hộp "tùy chọn" chuyển sang `<template>` rồi `content.cloneNode(true)` lúc mở lần đầu (giữ id, aria, focus). Hiện 240-300 phần tử ẩn = ~65% DOM của cổng, nên chuyển ẩn -> template là mức giảm lớn nhất. Mẫu:
   ```js
   const tpl = document.getElementById("tplParent"); // <template id="tplParent">…</template>
   function openParent(){ if(!window._pg){ document.body.appendChild(tpl.content.cloneNode(true)); window._pg=1; } /* gắn sự kiện sau khi chèn */ }
   ```
3. **Hoãn script không cần màn đầu** trên cổng: social.js (51KB, 📷📤), welcome.js, season.js (28KB), multi-games.js (chỉ khi mở "Chơi cùng lúc") nạp khi chạm lần đầu hoặc `requestIdleCallback` (timeout 4s). Cần đọc từng tệp xem có khởi tạo đồng bộ hay không; tiết kiệm ước tính ~25KB gzip trước FCP.
4. **CSS quan trọng + khung xương lưới** cho hai cổng: nội tuyến ≤8KB (nền, thanh trên, kích thước ô) và `<div class=skeleton>` cùng chiều cao ô để không CLS; phần còn lại `rel=preload as=style onload="this.rel='stylesheet'"` + `<noscript>`. Chỉ nên làm sau khi chốt giao diện cổng; lúc đó áp cùng cách inline ở `build.js` (mở rộng danh sách trang trong vòng lặp).
5. **Tự host / một phông**: đã làm (Inter 50KB, preload); có thể giảm thêm bằng subset nhỏ hơn (chỉ glyph dùng, ~25-30KB) nếu cần.
6. **Hash tên tệp cho shared/***: để dùng `immutable` cho JS/CSS (lần hai không còn 5 phút cũ) và bỏ phụ thuộc `max-age=300`; cần bước build đổi tên + sửa HTML + SHELL của sw.js.
7. **Tách bundle**: gom bars+season+welcome+track thành một tệp (đỡ ~6 request) sau khi hash tên.
8. Game: overlay kết thúc/hộp skin/hướng dẫn tạo khi cần — rủi ro cao (nhiều game gọi `$('id')` khi khởi động, check script tìm theo id), chưa làm.

## Ghi chú phát hiện trong lúc đo (không thuộc phần mình sửa)

- `landing/index.html` (VI) tạm thời có chuỗi `$1` ở dòng thay cho `<link rel=stylesheet href=/shared/theme.css>` (lỗi regex trong lúc sửa dở); kiểm tra lại trước khi commit.
- `play/index.html` có `html.pre body{visibility:hidden}` tối đa 3s: làm trang trống tới khi gỡ cờ; không nên giữ ở cổng/landing (chủ site không muốn màn chờ chặn).
