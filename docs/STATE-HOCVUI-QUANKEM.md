# TRẠNG THÁI: Quán Kem (Học Vui, môn Tiếng Anh) — đọc file này đầu tiên khi tiếp tục
Cập nhật: 2026-11-25. Không commit/push khi chưa được yêu cầu. Kế hoạch: PLAN-GAME-VIET-ANH.md mục 13.

## Mốc
- [x] Tranh: `node scripts/art/gen-quan-kem.js` (module scripts/art/quan-kem/kem.js, may.js) -> learn/quan-kem/art/*.svg + _sheet.html (đã xem ảnh, đạt)
- [x] Trang game learn/quan-kem/ (index.html, css/, js/, data/menu.js) — copy từ popplay/games/tiem-nuoc-ep-tieng-anh rồi đổi sang kem, tiền tố QK, khoá learn:quankem:save
- [x] Cầu nối quà learn/gifts-kem.js (đọc learn:pf:<hồ sơ>:lp:<lớp>:tanh; ghi learn:quankem:claim)
- [x] Đăng ký công trình vườn (garden-places.js BLD_SUBJ + garden-buildings.js), sw.js
- [x] Kiểm tra ảnh 390x844, 360x640, 844x390, 667x375

## Đã xong (2026-11-25)
- Trang game learn/quan-kem/ (4 khu: quầy, bàn khách, cửa hàng gồm vị mới + nâng cấp máy/biển/bàn + trang trí, sổ kem); khoá learn:quankem:save, learn:quankem:sound.
- Cầu nối learn/gifts-kem.js (QuanKemGift; sổ learn:quankem:claim): xu cho bài đã học / mỗi sao kiểm tra / qua bài (data/menu.js gift).
- Vườn: BLD_SUBJ trong garden-places.js (chỉ môn tanh), vòng lặp ở garden-buildings.js, mở khoá như Nhà (garden-unlock.js). sw.js: đã thêm tệp.
- Ảnh kiểm tra: scratchpad q-*.png. Chưa: bump cache sw (v631), check-garden chưa chạy, chưa có huy hiệu quà chờ ở vườn.

## MỞ RỘNG: MỖI LỚP MỘT QUÁN (2026-11-25) — PLAN-GAME-VIET-ANH.md mục 9
Trang vào: `learn/quan-kem/index.html?grade=N` (thiếu thì learn:grade, rồi 1). MỘT bộ máy, mỗi lớp một tệp dữ liệu.
- [x] Lớp 1 Quán Kem · [x] Lớp 2 Tiệm Bánh · [x] Lớp 3 Quán Nước Ép (tái dùng tranh shared/art/tiem-nuoc-ep) · [x] Lớp 4 Nhà Hàng Pizza · [x] Lớp 5 Quán Cà Phê Sách
- Dữ liệu: `data/pick.js` (chọn lớp, nạp `data/shop-g<N>.js` = window.QK_SHOP: tên quán, steps, itemIc, flavors{sg,pl,cost,lv,col}, lvl{items,nMax,form}, say.order, ask/note/spell, decor) + `data/menu.js` (phần chung, trộn).
- Tranh: `node scripts/art/gen-quan-lop.js [lớp...]` -> learn/quan-kem/art/g<N>/ (tên chung item-<id> box-<id> item-empty machine-N sign-N table-N decor-1/2 canh-* khach-* chu-quan + _sheet.html). Module scripts/art/quan-lop/{common,banh,pizza,cafe,legacy}.js. Lớp 1 = sao chép art/ cũ đổi tên (art/*.svg cũ còn, không dùng nữa); chủ quán (cún) mỗi quán một tạp dề/huy hiệu theo món (không cầm ly nước ép ở quán khác).
- Dạng bài: L1 1 vị x 1-5 cây (chấm màu trên nhãn); L2 nghe số+tên bánh (1-3, số nhiều loaves of bread); L3 2 vị "One orange juice and one apple juice, please."; L4 chủ quán hỏi "What would you like?" rồi khách đáp (2 món); L5 mẩu giấy gọi món HIỆN CHỮ NGAY (D.note, 3 món, loa vẫn bấm được) + xếp chữ viết tên món mới trước khi mua (js/54-spell.js). Sai không phạt, sau 2 lần sai hiện chữ.
- Lưu riêng: learn:quankem:save (lớp 1, tương thích cũ) / learn:quankem:save:N. Quà: learn/gifts-kem.js QuanKemGift.pending/claim(lớp): chỉ lớp N, sổ learn:quankem:claim (lớp 1) / :claim:N; xu x 4/số chủ đề (3,3,4,4,4). Đã thử dữ liệu giả: mỗi lớp nhận 1 lần (lớp1-2 80 xu, lớp3-5 60 xu), tải lại không nhận lại.
- Vườn: BLD_SUBJ có trường g (lớp) -> vườn lớp N chỉ hiện biển lớp N (art/gN/sign-2.svg, href ?grade=N); garden-buildings lọc theo d.g. check-garden: đạt (266).
- Nút sang quán lớp đã qua: hàng thẻ biển hiệu 1..lớp hiện tại ở cuối khu Sổ món (js/56-worlds.js; chỉ hiện khi learn:grade >= 2). Không đặt ở thanh nút vì màn ngang 375px hết chỗ.
- Chưa/hạn chế: từ vựng chưa bám từng bài (chương trình tiếng Anh theo kỹ năng Nghe/Nói/Đọc/Viết, không có chủ đề từ vựng) nên dùng món ăn/uống; chưa có "đọc thực đơn" có giá riêng cho lớp 4 (mới có hỏi đáp); chưa bump sw cache; ảnh kiểm tra scratchpad k-g*-{p,l}-*.png; chưa chụp vườn đầy đủ (popup chọn bạn che) nhưng đã đo DOM đúng biển/href.

## NÂNG CẤP QUÁN: cấp 1..5 (2026-11-25) — XONG, chưa commit
Giả định: "nâng cấp quán" = cấp quán (đã có) có TRẦN 5, gắn quà bài học, mặt tiền đổi rõ, khó dần. Dữ liệu chung ở data/menu.js (shopLv, levelCoins); mỗi lớp vẫn chỉ khác shop-g<N>.js + tranh.
- Điểm quán = khách đã phục vụ + floor(xu quà bài học / 5) (`QK.points`, trường lưu mới `learnCoins`). Mốc cấp 1..5: 0 / 4 / 10 / 20 / 36 điểm (trước đây 6 cấp). Thưởng xu khi lên cấp: 10 / 15 / 20 / 30 (cấp 2..5).
- Mặt tiền (lớp SVG chồng `art/g<N>/mai-2..5.svg`, màu theo quán, hiện ở quầy VÀ khu phố/bàn): cấp 2 mái hiên sọc, 3 + đèn dây, 4 + cờ nhỏ, 5 + viền vàng + sao + đèn lồng; tường sáng/rực dần (css/60-facade.css). Cấp 4: thêm 1 bàn miễn phí (tối đa 4); cấp 5: boa +1. Vị/đồ trang trí mở theo cấp như cũ (lv 1-4 trong shop-g*.js). Máy/biển/bàn vẫn nâng cấp bằng xu.
- Khách gọi khó dần: `QK.lvlNow` (js/30-order.js) nMax = kẹp[2 .. nMax của lớp]: cấp 1 = nMax-4, mỗi cấp +1 tới nMax của lớp (không vượt mức lớp quy định; số món/đơn giữ nguyên).
- Popup lên cấp ít chữ (js/58-levelup.js): huy hiệu, số cấp, món/đồ vừa mở, mái mới, xu. Cũng bật khi nhận quà bài học làm lên cấp.
- Dữ liệu cũ: learnCoins mặc định 0, lvSeen mặc định = cấp hiện tại (không popup lại, kẹp trong trần 5); khách đã phục vụ >= 36 cũ (cấp 6) thành cấp 5.
- Sửa lỗi cũ: art/g1/canh-san.svg + 1 tệp khác có thuộc tính preserveAspectRatio lặp -> SVG hỏng (sàn không hiện); đã sửa.
### Bảng cân bằng (xu quà lớp 60-80, mỗi ca 5 khách)
| Cấp | Điểm cần | Cách tới (học hết lớp: 60-80 xu = 12-16 điểm) |
|---|---|---|
| 2 | 4 | 1 bài học HOẶC 1 ca |
| 3 | 10 | học xong ~ 70% lớp |
| 4 | 20 | học hết lớp + ~1 ca |
| 5 | 36 | học hết lớp + ~4-5 ca (20-24 khách) |
Chi tiêu cửa hàng (vị 90 + nâng cấp 315 + trang trí 25) lấy từ xu quà + xu mỗi ca; không chặn lên cấp. (Ước tính theo mã.)
- Tệp mới: js/58-levelup.js, css/60-facade.css, art/g1..g5/mai-2..5.svg, art/huy-2..5.svg; bộ sinh scripts/art/gen-nang-cap.js (+ nang-cap/quan.js). Sửa nhỏ: data/menu.js, 10-core.js, 30-order.js, 46-dine.js, 52-world.js, 60-boot.js, index.html.
- Ảnh đối chiếu: scratchpad qk-g{1,3,5}-{p,l}-{lo,hi}.png, qkd-*, qk-g1-p-up.png (popup).
- Chưa làm: máy kem tự đổi theo cấp (vẫn mua bằng xu); decor mới theo cấp; chụp máy thật.
