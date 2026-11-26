# Level tự nâng KHÔNG TRẦN (cập nhật 2026-11-26) — tích mục nào xong mục đó

## Yêu cầu chủ site
Hiện level có trần (8–10). Khi bé thắng level CUỐI thì game tự nâng độ khó tiếp (level N+1, N+2…), không dừng ở trần. Áp dụng mọi game có NPLevel (30 game).

## Cơ chế dùng chung (ĐÃ làm, đừng sửa lại — shared/levelup.js)
- `NPLevel.attach({levels:N, endless:true, cur, go, ...})`: thêm `endless:true` thì thắng level cuối vẫn có nút "Level N+1" (tối đa 30 bậc vượt trần). `go(i)` có thể nhận `i >= N`; `cur()` có thể trả `i >= N` (level ván vừa chơi).
- `NPLevel.boost(i)` → số bậc vượt trần: 0 nếu i < N, 1..30 với level N+1…. Khoá lưu `np-level:<gid>` đã cho phép u tới N+29.
- Game PHẢI tự xử lý i ≥ N trong hàm đặt tham số (không được đọc bảng ngoài chỉ số → undefined/crash). Công thức gợi ý: dùng tham số của level cuối (N-1) rồi thêm `B = NPLevel.boost(i)`: mỗi bậc khó thêm ~4–6% ở 1–2 tham số CHỦ CHỐT (tốc độ, số vật, thời gian ngắn lại, số bước…), có trần chơi được (không tràn màn, không thời gian <~0.6× gốc, không vô lý); nhãn level hiển thị "Level N+1" (giờ chỉ số tăng tiếp). Level lưu trong khoá riêng của game (vd LS "xx-lvu") phải cho phép i ≥ N (đừng kẹp về N-1).
- 8 game Cozy dùng `spec.level.rules` (duong-ray, bao-nhieu-giay, mat-tinh-khong, noi-mot-net, ne-o-ga, shipper-sieu-toc, song-sot-cuoi-thang, xay-cau-tre): ĐÃ tự động bằng scripts/cozygame/levelgen.js (bước chậm lại + giới hạn nới 5%/bậc). Chỉ cần chạy `node scripts/cozygame/gen.js <id>` rồi KIỂM (giá trị ở bậc 1, 10, 30 không phá game: không âm, không tràn màn, không bất khả).

## Quy tắc làm việc
- Cozy sinh tự động: sửa `scripts/cozygame/specs/<id>.js` (+ `parts/<id>/`) rồi `node scripts/cozygame/gen.js <id>` (KHÔNG chạy `all` khi nhiều agent làm song song). Không sửa tay `cozyplay/games/<id>/index.html`, không sửa tpl.html/gen.js/levelgen.js/shared/levelup.js (báo lại nếu cần).
- Pop (popplay/games/<id>/index.html hoặc js/): sửa tay.
- Cấu trúc tệp theo CLAUDE.md (dòng ≤ ~200 ký tự cho tệp mới tay viết; tệp cũ có sẵn dòng dài thì giữ).
- Kiểm bằng trình duyệt thật: puppeteer-core + Chrome, đặt localStorage khoá level của game (và `np-level:<gid>` với `{"u":N+5,...}` nếu cần) để vào thẳng level N, N+1, N+8; chơi/khởi động ván ở các level đó 2 cỡ màn (390x844, 844x390), không lỗi console, không tràn/cuộn, xem ảnh. Kiểm màn kết thúc khi thắng level cuối có nút "Level N+1" bấm được.
- KHÔNG commit, KHÔNG push (chủ phiên làm). Báo cáo: mỗi game đã làm gì (công thức), tệp sửa, bất thường.

## Danh sách game (tích khi xong + đã kiểm)
### Nhóm A — Pop 1
- [x] qua-song  - [x] nhay-theo-so  - [x] con-vat-an-so  - [x] doan-tuoi-nao  - [x] ve-chu-quai-vat  - [x] thap-vong-mau
### Nhóm B — Pop 2
- [x] be-noi-dung-khong  - [x] be-dau-bo-me  - [x] bo-me-5-giay  - [x] ten-lua-cua-be  - [x] sudoku-con-vat
### Nhóm C — Cozy 1
- [x] bao-nhieu-giay (rules)  - [x] duong-ray (rules)  - [x] noi-mot-net (rules)  - [x] cat-banh-chung (custom)  - [x] cho-hang-kieu-viet (tay)  - [x] dap-deadline  - [x] cozy-wings  - [x] ghep-ba-the  - [x] ga-me-ban-trung
### Nhóm D — Cozy 2
- [x] mat-tinh-khong (rules)  - [x] ne-o-ga (rules)  - [x] shipper-sieu-toc (rules)  - [x] song-sot-cuoi-thang (rules)  - [x] xay-cau-tre (rules)  - [x] sudoku-chu-so  - [x] me-cung-truyen-tay  - [x] san-chu-an  - [x] truot-so-nam-cham  - [x] tim-doi-the
