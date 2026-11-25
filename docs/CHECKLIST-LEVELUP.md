# Checklist: LÊN LEVEL cuối màn (đợt 1)

Cơ chế dùng chung: `shared/levelup.js` + `shared/levelup.css` (xem đầu tệp js để biết API `NPLevel.attach`). Level = các bậc độ khó SẴN CÓ của game (chip Dễ/Thường/Khó);
lưu level đã mở + sao tốt nhất ở localStorage `np-level:<id>`; cuối màn hiện "Level N+1 ▶" nổi bật + "↻ Level N"; không phạt (thua chỉ có "↻"); không hiện ở ván hôm nay / thách đấu / chơi hộ / chơi cùng lúc.
Bỏ qua: nuoi-thu-tieng-viet, tiem-nuoc-ep-tieng-anh (có cấp riêng), learn/*.

## Hạ tầng
- [x] shared/levelup.js, shared/levelup.css, thêm vào sw.js (chưa nâng số cache v — người giữ sw.js nâng)
- [x] Cozy: tpl.html nạp levelup.js (mọi game Cozy sinh ra có sẵn, chỉ game gọi attach mới hiện)
- [ ] GAME_RULES.md: thêm mục "Lên level cuối màn" (chưa sửa vì cây làm việc có người khác đang sửa; làm ở đợt sau)

## Bảng game (đợt 1 = làm xong, đợt 2 = chưa)
| Game | Nhóm | Cuối màn trước đó | Có chọn độ khó | Đợt | Xong |
|---|---|---|---|---|---|
| qua-song | Pop | Chơi lại/Khoe/Chọn khác | 3 cấp (LVL) | 1 | [x] |
| thap-vong-mau | Pop | như trên | 3 cấp | 1 | [x] |
| nhay-theo-so | Pop | như trên | 3 cấp | 1 | [x] |
| ten-lua-cua-be | Pop | như trên | 3 cấp | 1 | [x] |
| ve-chu-quai-vat | Pop | như trên | 3 cấp | 1 | [x] |
| bo-me-5-giay | Pop | như trên | 3 cấp | 1 | [x] |
| be-noi-dung-khong | Pop | như trên | 3 cấp | 1 | [x] |
| tim-doi-the | Cozy | Ván mới/Khoe/Đấu lại | 3 (Dễ/Thường/Khó) | 1 | [x] |
| doan-tuoi-nao | Pop | chơi lại | 3 cấp (đo tuổi, ít hợp) | 2 | [ ] |
| be-dau-bo-me | Pop | chơi lại | cấp | 2 | [ ] |
| con-vat-an-so | Pop | chơi lại | cấp (NO_RESUME) | 2 | [ ] |
| sudoku-con-vat | Pop | chơi lại | cỡ lưới (module riêng, 83 dòng html) | 2 | [ ] |
| lang-cua-be | Pop | chơi lại | không chip, có level riêng | 2 | [ ] |
| pop-fly | Pop | Bay lại | không (endless) | 2 | [ ] |
| ga-me-ban-trung | Cozy | Ván mới | 3 (#lvs) | 1b | [x] |
| cho-hang-kieu-viet | Cozy | Ván mới | 3 | 1b | [x] |
| sudoku-chu-so | Cozy | Ván mới | 3 | 1b | [x] |
| san-chu-an | Cozy | Ván mới | 3 | 1b | [x] |
| me-cung-truyen-tay | Cozy | Ván mới | cỡ mê cung 5/8/11/14 | 1b | [x] |
| dap-deadline | Cozy | Ván mới | 3 | 2 | [ ] |
| cozy-wings | Cozy | Bay lại | 3 (#diffs) | 2 | [ ] |
| mat-tinh-khong, shipper-sieu-toc, bao-nhieu-giay, cat-banh-chung, duong-ray, ghep-ba-the, ne-o-ga, noi-mot-net, song-sot-cuoi-thang, truot-so-nam-cham, ve-mot-net, xay-cau-tre, xe-ca-phe | Cozy | Ván mới | 1 chip hoặc không (cần thiết kế hàm độ khó theo level) | 2 | [ ] |
| ban-co-hieu-toi, doi-doi-2048, gia-cho-viet, xin-nghi | Cozy | Ván mới | không hợp (so sánh người / vô hạn) | bỏ | - |

## Trần level + giới hạn tham số (luật chủ site)
- Pop 7 game (qua-song, thap-vong-mau, nhay-theo-so, ten-lua-cua-be, ve-chu-quai-vat, bo-me-5-giay, be-noi-dung-khong): trần 3 = 3 cấp độ khó SẴN CÓ đã cân chỉnh (tham số do hàm độ khó có sẵn của game; không thêm level mới để tránh game bế tắc). Level cuối: hiện huy hiệu sao vàng, còn "chơi lại" + khay chọn level đã mở.
- Cozy tim-doi-the, ga-me-ban-trung, cho-hang-kieu-viet, sudoku-chu-so, san-chu-an: trần 3 (Dễ/Thường/Khó có sẵn).
- me-cung-truyen-tay: trần 5, cỡ mê cung [6,8,10,12,14] (game có kẹp cứng SZMIN=5..SZMAX=15; mê cung luôn có đường ra).
- Dữ liệu lưu `np-level:<id>`: level mở bị kẹp [0..trần-1], trần tối đa 10 (levelup.js).
- Chưa tự chạy thắng level cuối từng game (mới kiểm màn kết thúc bằng finish ép); level cuối chính là độ khó "Khó"/cỡ 14 sẵn có của game.

## Đợt 2 (xong) — Cozy 1 chip + Pop còn lại + dap-deadline/cozy-wings
Cozy sinh tự động dùng `spec.level` (scripts/cozygame/levelgen.js, kẹp min/max từng tham số, trần hữu hạn, ván hôm nay luôn level 0):
| Game | Trần | Tham số theo level (kẹp) |
|---|---|---|
| mat-tinh-khong | 4 | dur -10%/level (≥30s), per -8% (≥8s) |
| shipper-sieu-toc | 4 | plan (giây lập kế hoạch) -6%/level (≥22) |
| bao-nhieu-giay | 4 | mục tiêu giây tg +12%/level (≤40s) |
| cat-banh-chung | 3 | số phần cắt +1/level (≤4) |
| ne-o-ga | 4 | tốc độ v0/v1 +7%/level (≤340/≤620), carP +0.06 (≤0.6) |
| noi-mot-net | 4 | dur -8% (≥30s), mStep +5% (≤1.5) |
| song-sot-cuoi-thang | 4 | tiền đầu m0 -6% (≥3000), f +0.03 (≤1.7); mở level tiếp chỉ khi thắng |
| xay-cau-tre | 4 | ngân sách bud -4% (≥19), cap -3% (≥0.82) |
| ghep-ba-the | 3 | số loại hình K 8→10 (10 đã có sẵn ở Night Pass), đua giờ 90s→≥65s |
| truot-so-nam-cham | 5 | lưới 3x3,3x4,4x4,4x5,5x5 (xáo ngược từ trạng thái giải nên luôn giải được) |
| duong-ray (html tay, dán mã levelgen) | 4 | sp0/sp1 -6% (≥3.6/≥1.7), v +6% (≤60) |
Game viết tay dùng độ khó có sẵn: ga-me-ban-trung, cho-hang-kieu-viet, sudoku-chu-so, san-chu-an (trần 3), me-cung-truyen-tay (trần 5), dap-deadline (trần 4: Dễ/Thường/Khó/Cực khó; không dùng khi chế độ khoá độ khó), cozy-wings (trần 3), con-vat-an-so, doan-tuoi-nao, sudoku-con-vat (trần 3), be-dau-bo-me (trần 4; chỉ hiện khi hết chuỗi ván).
## Bỏ (kèm lý do)
- ve-mot-net: độ khó là HÌNH VẼ, không có tham số số học để kẹp.
- xe-ca-phe: chiến dịch nhiều ngày, đã có tiến triển theo ngày riêng.
- lang-cua-be: đã có hệ cấp riêng của làng (Level n bên trong game).
- pop-fly: đã có tiến trình/streak riêng, chơi vô hạn theo loại.
- ban-co-hieu-toi, doi-doi-2048, gia-cho-viet, xin-nghi: so sánh người/vô hạn/không có độ khó.
- nuoi-thu-tieng-viet, tiem-nuoc-ep-tieng-anh, learn/*: ngoài phạm vi.
## Kiểm tra đã chạy
- Ảnh màn kết thúc 390x844, 360x640, 844x390, 667x375 cho cả 28 game đã làm: không cuộn do thanh level (trừ dap-deadline: cuộn có sẵn từ trước, đo lại sau khi gỡ thanh level vẫn y hệt), nút ≥56px.
- Thắng level cuối bằng solver ở tim-doi-the (khó), ghep-ba-the (K=10), truot-so-nam-cham (5x5): reason "win".
- Lỗi 404 là /favicon.ico của http.server (không có ở site thật), có sẵn, không do level up.
- check-resume.js: lỗi "bản lưu quá 7 ngày" / "ván hôm nay của ngày cũ vẫn hiện thẻ tiếp tục" xảy ra cả ở game không sửa (xay-cau-tre) => có sẵn (nghi do ngày hệ thống 2026-11-25 so với bài đo), bỏ qua.
- check-difficulty.js sau khi đổi giao diện icon: 16/17 game đạt; dap-deadline báo "huy hiệu #npDifBadge không hiện" — có SẴN từ trước (bản git HEAD cũng lỗi, 9 dòng ✗), không do level up.

## Tìm Đôi Thẻ + Ghép Ba Thẻ: level TĂNG THẬT (trần 6 level mỗi game) — thay các dòng cũ ở trên
Hằng số: `TD_MAX = LVC.length = 6` (scripts/cozygame/parts/tim-doi-the/board.js, bảng LVC), `GB_MAX = GB_LV.length = 6` (parts/ghep-ba-the/logic.js, bảng GB_LV). Dữ liệu lưu `td-lv` / `gt-lvu` bị kẹp [0..trần-1]; ván hôm nay + thách đấu luôn level 0 (Tìm Đôi Thẻ: Dễ/Thường/Khó cũ qua seed%3). 3 chip Dễ/Thường/Khó ở màn chọn giữ nguyên; level 4-6 chỉ mở bằng "lên level".
- Tìm Đôi Thẻ, mỗi level: K = số loại hoa (6→10→6; ICONS có 12, kẹp theo skin), big = số tầng đè thêm (0→4, tối đa 92 thẻ), em = số lần chạm sai tối đa (L4: 10, L5: 4), ns = hết nước đi là THUA (không tự xáo; từ L4... L3 trở lên), tpp = giây mỗi cặp (L5: 2.1s, L4 chỉ đồng hồ 2.8s, hiện đồng hồ). Level 0-2 y như cũ (có tự xáo).
- Ghép Ba Thẻ, mỗi level: K 8→12 (kẹp theo skin), khay 7→6→5 ô (không dưới 5), big 0→7 tầng đè thêm (45→99 thẻ), mx = độ trộn loại hình giữa các tầng (.4→1), hoàn tác 1→0 (từ L4), giờ đua (Night Pass) nhân 1→.6 (≥54s).
- Bot đo (puppeteer, 100 ván/level, hạt giống cố định; "người chơi trung bình" = tham lam chọn nước ít bí nhất, 4% chạm nhầm, 1.9 giây/cặp ở Tìm Đôi Thẻ):
| Level | Tìm Đôi Thẻ (tỉ lệ thắng) | Ghép Ba Thẻ (tỉ lệ thắng) |
|---|---|---|
| 1 | 100% | 97% |
| 2 | 100% | 92% |
| 3 | 100% | 87% |
| 4 | 79% (21% hết nước đi) | 83% |
| 5 | 62% | 66% |
| 6 | 33% (thua: giờ 37, hết nước 28, sai 2) | 49% |
- Mọi ván ở MỌI level đều có lời giải (bộ giải theo thứ tự sinh ngược `sol`): 100/100 ván thắng theo bộ giải ở cả 6 level (Ghép Ba Thẻ tính cả khay 5 ô), kể cả Tìm Đôi Thẻ không tự xáo (ván sinh ngược luôn có đường thắng khi chọn đúng thứ tự).
- Ghép Ba Thẻ level 6 chưa xuống 25-40% (bot đạt 49%): ba đòn còn lại (khay <5, hết hoàn tác đã dùng, thẻ úp là của Night Pass) không dùng thêm được; nếu cần khó hơn nữa thì tăng tỉ lệ nhầm của bot hoặc thêm thẻ nhiễu ở đợt sau.
- Lưu ý: "Khoe điểm/Thách bạn" ở level cao mã hoá ván theo độ khó seed%3 nên người nhận chơi bản dễ hơn (điểm không so được với level 4-6). Ảnh màn chơi: scratchpad/shots/play-<id>-L0|L5-390x844|844x390.png.
