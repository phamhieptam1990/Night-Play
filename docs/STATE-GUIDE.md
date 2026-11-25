# TRẠNG THÁI: Hướng dẫn chơi 4 game lớn (coach mark có bàn tay)
Cập nhật: 2026-11-25. Chưa commit.

## Vì sao
Chủ site: "chưa thấy hướng dẫn, khó chơi quá". Bản Học Vui đã bỏ nút "?", bản Pop có thẻ chữ khó hiểu với bé.

## Module dùng chung
- `shared/worldkit/world-guide.js` + `world-guide.css` (WorldGuide, không đụng dữ liệu game).
  - Nền tối có LỖ SÁNG (clip-path evenodd, chạm xuyên lỗ vào nút thật; ngoài lỗ bị chặn), vòng vàng nhấp nháy, bàn tay SVG (chạm = nhấp; kéo = từ nguồn tới đích; ở đáy màn hình bàn tay quay xuống).
  - Một dòng chữ ngắn + 1-3 icon, nút loa (speechSynthesis, nhớ lựa chọn `wg:say`), ✓ Tiếp, ✕ Bỏ qua (≥56px, chỉ icon), chấm tiến độ.
  - Tự đo vị trí bằng selector mỗi 250ms + resize/orientation; selector không có thì bỏ bước (chờ ≤2 giây khi đang đổi khu).
  - Bước tự qua khi bé làm thật: chạm đúng phần tử (act "tap") hoặc kéo >30px từ phần tử nguồn (act "drag"); act "look" chỉ bấm ✓.
  - Tự bật lần chơi đầu sau khi hết popup (quà…) và bước 1 thấy được; khoá `wg:seen:<key>`.
  - Nút "?" (56px, icon SVG): `btn.mode` "hud" (chèn vào hàng HUD WorldKit), "hudfirst", "fixed" (+css). `takeover:true` (Pop): bấm `#phBtn` của cổng/menu ⋯ cũng mở hướng dẫn mới (không mở thẻ chữ pophelp); `useOwnPh`: nút "?" riêng tự ẩn khi `#phBtn` đang hiện (tránh hai nút).
- Dữ liệu bước mỗi game: `js/guide.js` của game (≤20 dòng).

## Bước từng game
- Nhà Của Bi (Pop, key `ntv`) & Nhà thú Học Vui (key `nb:g<lớp>`): 1 chạm Bếp (#zbar) · 2 kéo đồ vào thú (#tray → #pw) · 3 thanh no/sạch/vui (#rStats) · 4 Pop: túi quà / Học Vui: nút sách nhận quà từ bài (#lessonBtn) · 5 vòng cấp (.wk-lv).
- Quán Cáo Cam (Pop, key `tiem`, câu Anh/Việt theo TNE.lang) & Quán Học Vui (key `kem:g<lớp>`, luôn tiếng Anh ngắn): 1 nghe khách (#bSpk, #bAa) · 2 kéo món vào máy (#crates → #jm) · 3 ✓ phục vụ (#serveBtn) · 4 xu và sao (#wk-coin, #wk-stars) · 5 cửa hàng (#zb-shop).

## Tệp đã sửa
- Mới: world-guide.js/.css, 4 tệp js/guide.js.
- index.html 4 game: thêm link css + 2 script (module + guide.js).
- Pop tiem `css/10-base.css`: `.hud#hudSlot{pointer-events:none}` (khung rỗng chặn chạm vào hàng HUD ở màn dọc, che nút "?"). Giữ nguyên chỉnh sửa màn ngang của phiên khác.
- sw.js: thêm 6 tệp, cache v637.
- pophelp.js/POPHELP vẫn nạp (cổng/menu ⋯ cần #phBtn) nhưng click bị WorldGuide chặn.

## Còn lại / lưu ý
- Quán Học Vui lớp khác nhau dùng cùng bước; khoá "đã xem" tách theo lớp.
- Chưa thử trên máy thật; ảnh chụp ở thư mục scratchpad của phiên (xem báo cáo).
