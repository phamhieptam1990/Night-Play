# Night Pass cho 2 game lớn Pop (Nhà Của Bi, Quán Cáo Cam) — trạng thái 2026-11-25

- LÀM XONG: `shared/worldkit/world-pass.js|css` (nút "Giao diện" ở màn chọn, bảng chọn, thẻ trả phí, cổng phụ huynh, dùng thử 1 lần/ngày, tải mã từ /api/pro/<id>.js, lock về free, chơi hộ ẩn);
  `server/pro/nuoi-thu-tieng-viet.js` (wizard "Phòng Phù Thủy Chữ", knight "Thư Viện Hiệp Sĩ"), `server/pro/tiem-nuoc-ep-tieng-anh.js` (neon "Quán Đêm Phố Nhạc", hero "Quán Siêu Anh Hùng");
  đăng ký route trong `server/app.js` (sau route lang-cua-be); index.html 2 game nhúng css + script (cấu hình trong data-wp); sw.js thêm 2 tệp worldkit + nâng CACHE.
- Linh vật: KHÔNG vẽ thân mới (chủ site huỷ bản vẽ Night mới). Mỗi giao diện ép skin Pop có sẵn qua `NPArtSkinForce` (night / star) trên đúng thân 3D mềm Bi/Cáo.
- Bài đo riêng: `node scripts/cozygame/check-worldpass.js [--shots=dir]` → ✓ (2 game × 390x844/844x390). check-mascot --only đạt. check-skins không nhận PF.themes (0 ca). check-popnp: 6 lỗi giả (nền #home trong suốt ở chế độ sáng, vốn có với game lớn).
- CHƯA thử: Night Pass thật cần máy chủ + token (đã giả lập bằng chặn request + gọi source()); thanh toán/ticket chơi hộ chưa thử.
