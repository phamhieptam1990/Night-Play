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

## Tìm Đôi Thẻ / Ghép Ba Thẻ nâng khó thật (trần 6)
- Bảng LVC (tim-doi-the/board.js) và GB_LV (ghep-ba-the/logic.js); đo bot: xem CHECKLIST-LEVELUP.md. Mô phỏng: scratchpad simtd.js / simgt.js (puppeteer, hook window.TD / window.GT).

## Popup "Chọn level" (xong) + việc còn lại
- shared/levelup.js/.css: nút lưới ở thanh level mở bottom-sheet "Chọn level" (mọi level 1..trần; đã mở = bấm chơi được, hiện sao tốt nhất hoặc dấu tick; chưa mở = khoá; level hiện tại viền cam; nút đóng icon SVG; cuộn trong khung; ngang: hộp giữa màn). Chọn level thấp KHÔNG hạ `u` (level đã mở) — chỉ `go(i)`.
- Gợi ý nhẹ "Thử level thấp hơn?" khi thua >=2 lần liên tiếp ở level đó (đếm `f` trong np-level:<id>, xoá khi thắng; level 1 không hiện). Khoá lưu cũ vẫn đọc được (thêm trường f).
- Ảnh đã xem: scratchpad/shots/pick-390x844, pick-844x390 (qua-song), td-pick-390x844, td-pick-844x390 (tim-doi-the, có khoá + tick + gợi ý). Không có nút level trên HUD (HUD mỗi game khác nhau, dễ đè); chỉ ở màn kết thúc.
- sw.js: np-shell-v640.
- CHƯA LÀM (đổi hướng: NÂNG độ khó thật, không hạ): bảng tham số theo level + bot cho các game còn dễ (ne-o-ga, mat-tinh-khong, shipper-sieu-toc, bao-nhieu-giay, cat-banh-chung, noi-mot-net, song-sot-cuoi-thang, xay-cau-tre, duong-ray, truot-so-nam-cham, 7 game Pop 3 cấp...). Chưa hạ độ khó game nào. Mỗi game cần bot riêng (hook window.<X> như simtd.js); làm từng game: nới `max`/rules trong spec.level, đo 100 ván/level, ghi bảng vào CHECKLIST-LEVELUP.md.
- Mẹo chạy: server http của python bị chặn trong phiên này; dùng srv.js (node http) trong scratchpad; puppeteer-core cài ở scratchpad/pp.

## Level tự nâng không trần (2026-11-26, xong cả 30 game)
- Thắng level cuối thì có "Level N+1" (tối đa 30 bậc vượt trần): `NPLevel.attach({..., endless:true})`, game dùng `NPLevel.boost(i)`. Chi tiết + từng game: docs/CHECKLIST-ENDLESS-LEVEL.md. Game Cozy tham số (levelgen.js) tự nâng chậm dần + nới giới hạn 5%/bậc.
- Còn nên làm: chơi thử thật ở bậc cao xay-cau-tre, song-sot-cuoi-thang (chưa mô phỏng độ khả thi); thắng thật ghep-ba-the và ga-me-ban-trung để thấy nút "Level N+1"; kiểm server cho link thách đấu lv > 8 của cho-hang-kieu-viet / ga-me-ban-trung.
