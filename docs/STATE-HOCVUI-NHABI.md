# TRẠNG THÁI: "Nhà của Bi" bản HỌC VUI (công trình trong vườn Tiếng Việt)
Cập nhật: 2026-11-25. Kế hoạch: docs/PLAN-GAME-VIET-ANH.md mục 13. Chưa commit.

## Đã làm
- Trang game `learn/nha-bi/` (COPY từ bản Pop rồi chỉnh, không phụ thuộc thư mục popplay): `index.html` + `css/` + `js/` + `art/` (tranh copy, thêm `art/nha-bi.svg` = ngôi nhà cún hiện trên vườn).
  Namespace `NB` (đổi từ NTV), khoá lưu `learn:nhabi:world`. Bỏ: màn #home, thách đấu/chia sẻ, NP bridge, ?-help, chơi hộ. Có: nhà 5 khu, chăm ăn/tắm/chơi/ngủ, cấp, trang phục, túi đồ (+ nút loa), nhiệm vụ ngày, điểm danh, 2 mini-game.
- Cầu nối quà `learn/gifts.js` (`LearnGifts.pending/claim/totals`): ĐỌC `learn:pf:<hs>:lp:<lớp>:tviet` (bài đã học, sao kiểm tra) + `learn:m:tviet` (câu đúng); GHI chỉ `learn:nhabi:seen` (mỗi việc học đổi quà 1 lần). Luật: bài mới = 3 thức ăn + 1 xà phòng; mỗi sao kiểm tra = 1 thức ăn + 1 sao; 3 câu đúng = 1 thức ăn, 8 = 1 xà phòng, 20 câu hoặc 4 bài = 1 đồ chơi. Lần đầu vào có trần (6 ăn, 3 xà phòng, 1 đồ chơi, 5 sao) để không phát cả lịch sử.
- `learn/nha-bi/js/lesson-gifts.js`: vào nhà / quay lại tab → popup quà toàn hình; nút sách (cam) nổi → `../lop/index.html?subj=tviet&grade=N`; ← về vườn đúng lớp/môn.
- Vườn: `learn/garden/garden-places.js` thêm 1 mục BLD (chỉ vườn `tviet`, có `href` + `img`); `garden-buildings.js` hiểu `d.href`/`d.img`; `garden-unlock.js` mở khoá cùng lúc với nhà (stage>=5); `css/12-buildings.css` thêm `.bld.bimg`.
- sw.js: thêm tệp mới, cache v632.
- Đã đo bằng Chrome thật: 390x844, 360x640, 844x390, 667x375 (không cuộn, không lỗi JS), popup quà, mini-game, vườn; `scripts/learn/check-garden.js` đạt (266).

## Chưa làm / lưu ý
- Chế độ `?edit` của vườn xuất BLD chỉ có n/ic/f/x/y/w/h: nếu dán đè sẽ MẤT dòng `href/img` — giữ nguyên dòng push của Nhà của Bi.
- Linh vật Bi dùng ảnh SVG riêng của game (`art/cun*.svg`), chưa nhúng qua `shared/art/mascot-art.js` (cần NP/Night Pass, không có ở Học Vui).
- Chưa làm bản Học Vui của Quán Cáo Cam (vườn Tiếng Anh).
- Vài dòng CSS dài >200 ký tự (css/70-ui.css) kế thừa từ bản Pop.

## MỖI LỚP MỘT NHÀ + MỘT THÚ (2026-11-25) — XONG cả 5 lớp, chưa commit
- Dữ liệu hoá: `learn/nha-bi/js/data/pet-g1..g5.js` (tên thú, tranh, đồ ăn/đồ chơi, cấp, lời thoại, màu tường phòng khách) + `data/world.js` (chọn lớp: ?grade=N, rồi learn:grade, rồi 3; phần chung: khu, trang phục, mini-game). Một bộ máy, không nhân mã. Tranh tư thế gọi "cun*" tự đổi sang tranh thú lớp (ui.js N.art).
- Thú: lớp 1 thỏ Bông, lớp 2 mèo Mây, lớp 3 cún Bi (cũ), lớp 4 gấu trúc Trúc, lớp 5 rồng nhỏ Tia. Mỗi thú 8 tư thế + nhà ngoài vườn (`art/nha-<thú>.svg`) + 4 món ăn mới (cà rốt, rau, tre, bánh quy). Bộ sinh `scripts/art/gen-nha-thu-lop.js` (+ `scripts/art/nha-thu/*`), dùng khung Pop 3D của tiem/core.js; không sửa bộ sinh cũ.
- Lưu riêng từng lớp: `learn:nhabi:world:<N>` (lớp 3 giữ `learn:nhabi:world`).
- Quà theo lớp (`learn/gifts.js`): `pending/claim/totals(g)`; chỉ đọc `learn:pf:<hs>:lp:<N>:tviet`; khoá nhận `learn:nhabi:seen:<N>` (lớp 3 = `learn:nhabi:seen` cũ). Không dùng learn:m:tviet nữa. Cân theo số chủ đề (lớp 1 hệ số 1, lớp 2-5 hệ số 7/4): học hết mỗi lớp đều ra 56 ăn / 14 xà phòng / 6 đồ chơi / 35 sao. Trần quà lần đầu giữ.
- Vườn: `garden-places.js` đẩy nhà đúng lớp (href `?grade=N`); `garden-buildings.js` thêm `d.k` (khoá luật mở khoá, vì garden-unlock.js so tên "Nhà của Bi").
- Bộ sưu tập: nút SVG (`js/collection.js`, `css/90-collection.css`) mở bảng thú các lớp <= lớp bé đang học, chạm sang `?grade=`.
- Đo: Chrome thật 390x844, 844x390, 360x640, 667x375 (lớp 2, 5), 5 lớp: không cuộn, không lỗi JS; quà giả mỗi lớp nhận 1 lần; check-garden đạt (266). sw.js cache v633.
- Còn lại: bé học lớp N+1 thì lớp N vào bằng nút bộ sưu tập (chưa có lối từ vườn lớp cũ ngoài nhà của lớp đó); mèo/thỏ/gấu dùng chung tiếng sủa sfx.bark; chưa chụp thử ở máy thật.

## NÂNG CẤP THÚ: cấp + tiến hoá (2026-11-25) — XONG, chưa commit
Giả định (đề bài mơ hồ): "nâng cấp thú" = làm cấp thú (đã có, 5 cấp theo "tình cảm") thấy rõ bằng mắt + gắn quà bài học. Trần 5 cấp = độ dài `pet.levels` trong data/pet-g1..g5.js.
- Thú LỚN THẬT: `scaleByLevel` = [0.62, 0.78, 0.94, 1.10, 1.26] (cấp cuối ~2x cấp 1; đo 390x844, 360x640, 844x390, 667x375 không tràn HUD/khung, không cuộn). Đổi cỡ mượt (transition width 1s), dáng bé con (đầu to, mập) → trưởng thành (cao hơn) bằng css/95-evolve.css.
- Lớp SVG chồng `art/evo-1..4.svg` (hào quang dưới chân đổi màu cam/bạc/vàng/cầu vồng + 2..5 ngôi sao lấp lánh) trên `#evo`; huy hiệu `art/huy-hieu-2..5.svg` cho popup. Bộ sinh `node scripts/art/gen-nang-cap.js` (+ scripts/art/nang-cap/pet.js).
- Lên cấp (`js/evolve.js` N.checkLevel): thú nhún lớn lên + popup toàn hình (huy hiệu, số cấp, khu/trang phục vừa mở, quà 2 ăn + 1 xà phòng + đồ chơi cấp lẻ). Thang cấp ở HUD WorldKit (vòng + số) có sẵn.
- Cấp kẹp [0..trần]: store.init chuẩn hoá `love` (số >= 0) và `seenLv` (cấp đã báo, kẹp trong trần). Dữ liệu cũ KHÔNG có seenLv -> lấy cấp hiện tại (không bật popup lại). Không phạt, thú không tụt cấp.
- Quà bài học -> tình cảm: lesson-gifts.js sau khi nhận quà cộng `sao + 3*đồ chơi` tình cảm (sao/đồ chơi không bị "ăn" khi chăm nên cần cộng thẳng).
### Bảng cân bằng (tình cảm = love; mốc cấp: 0 / 30 / 80 / 160 / 300)
| Nguồn (học hết MỘT lớp) | Số lượng | Tình cảm |
|---|---|---|
| 56 thức ăn cho ăn (+2 mỗi lần) | 56 | 112 |
| 14 xà phòng tắm (+6 mỗi lần) | 14 | 84 |
| 35 sao (+1) + 6 đồ chơi (+3) cộng thẳng | | 53 |
| Tổng riêng quà bài học | | ~249 -> cấp 4 (160) chắc chắn, cấp 5 (300) còn thiếu ~51 |
Phần thiếu lấy từ chăm đều: ngủ +3/ngày, chơi +2/lần, mini-game 1-5/ván (<=6 ván/ngày), điểm danh/nhiệm vụ ngày cho thêm ăn/xà phòng -> ~8-10 ngày chơi đều là tới cấp 5. Cấp cuối tới được nhưng không quá dễ. (Ước tính theo mã; chưa đo bằng người chơi thật.)
- Tệp mới: js/evolve.js, css/95-evolve.css, art/evo-*.svg, art/huy-hieu-*.svg; sửa nhỏ: store.js, room.js, rewards.js (bỏ onLevelUp cũ), lesson-gifts.js, index.html, data/pet-g*.js (scale), sw.js (cache v634).
- Ảnh đối chiếu: scratchpad nb-g{1,3,5}-{p,l}-{lo,hi}.png, nbx-*.png (popup lên cấp: nbx-390-1-28.png).
- Chưa làm: mở thêm món ăn riêng theo cấp (chỉ mở khu/trang phục/đồ chơi); chụp trên máy thật.
