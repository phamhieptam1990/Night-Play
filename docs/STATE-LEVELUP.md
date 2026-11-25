# Trạng thái: tính năng LÊN LEVEL (cập nhật lần cuối: đợt 1 xong)

## Đã làm
- shared/levelup.js + levelup.css (API: `NPLevel.attach({levels, cur, go, won?, skip?, dupe?})`); bọc NP.result/NP.start; đã thêm vào sw.js.
- Nối vào 7 game Pop (qua-song, thap-vong-mau, nhay-theo-so, ten-lua-cua-be, ve-chu-quai-vat, bo-me-5-giay, be-noi-dung-khong): 1 thẻ `<script levelup.js>` sau bridge.js + 1 dòng attach sau `$("againBtn").onclick=`.
- Cozy: tpl.html nạp levelup.js; tim-doi-the attach ở scripts/cozygame/parts/tim-doi-the/logic.js (chạy `node scripts/cozygame/gen.js all`).
- Đo: ảnh 390x844 + 844x390 từng game, click "Level kế" đổi đúng level, không cuộn, nút 56px, check-difficulty OK.

## Bước tiếp (đợt 2)
- Xem docs/CHECKLIST-LEVELUP.md cột Đợt 2. Mẫu Cozy: thêm 1 lệnh attach cuối file part/logic của game (cur = G.lv, go = đặt biến độ khó + LS.set + begin(...)), rồi gen.
- Thêm mục vào GAME_RULES.md; nâng số cache sw.js; thêm check đo (scripts/cozygame/check-levelup.js) nếu cần.

## Cập nhật
- Đợt 1b xong: ga-me-ban-trung, cho-hang-kieu-viet (sửa html tay), sudoku-chu-so, san-chu-an (parts/*/logic.js + gen), me-cung-truyen-tay (html tay). Giao diện đổi sang icon SVG + khay chọn level. Chưa làm: xem CHECKLIST mục "Chưa làm".
- Ảnh: scratchpad/shots/<id>-<WxH>.png (390x844, 360x640, 844x390, 667x375).
- check-resume báo lỗi "quá 7 ngày/hôm nay cũ" ở cả game không sửa (xay-cau-tre) => lỗi có sẵn, không do level up.

## Đợt 2 xong
- 28 game có level up (xem CHECKLIST-LEVELUP.md). Cozy sinh tự động: thêm `level:{max,rules,won?}` vào spec (levelgen.js) hoặc `level:{custom:...}`; game tay: `NPLevel.attach(...)`. levelup.js có thêm `host` (khung kết thúc tuỳ biến) và nhận `.erow`.
- Bước tiếp (nếu muốn): thêm mục "Lên level" vào GAME_RULES.md; nâng số cache sw.js; viết check-levelup.js.
