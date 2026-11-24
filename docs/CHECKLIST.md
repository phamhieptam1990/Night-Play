# Checklist Học Vui

Cập nhật: 2026-11-24 (đã dọn mục xong). Quy ước: `[x]` xong · `[ ]` chưa làm · `[~]` đang làm · `[?]` chờ chủ site duyệt. Xong mục nào thì đổi ký hiệu mục đó (sửa đúng một dòng).

## H2. Bộ máy bài học

- [?] Bạn duyệt 3 bài mẫu

## H8. Thói quen & niềm tin học (learn/habit.js)

- [ ] Lời chào mở app theo thói quen ("cây đang chờ con tưới")

## H4. Soạn bài học hàng loạt (66 chủ đề)

- [?] Bạn duyệt 12 bài lớp 1 (3 môn): giọng văn, độ dài, mức khó, từ tiếng Anh — Mở: /learn/lop/index.html?grade=1&subj=toan (tviet, tanh)
- [?] Duyệt 54 bài nháp lớp 2–5 (Toán, Việt, Anh): lời giảng tự lắp từ chương trình + ngân hàng câu hỏi, 15 bài soạn tay ngắn (thống kê, nói và nghe, viết, nghe tiếng Anh) — mở /learn/lop/index.html?grade=2&subj=toan … Bộ sinh: scripts/learn/gen-lessons-draft.js (+ lesson-extra.js); bộ kiểm: build-lessons.js, check-lessons-ui.js --all

## H5. 3 khu vườn: Toán giữ nguyên + 2 khu vườn MỚI (Rừng Chữ, Vịnh Từ) + đổi màu theo lớp (kế hoạch: docs/LEARN-GARDEN-LAYOUTS-PLAN.md)

- [ ] Đồ trang trí chỉ có 4 chỗ đặt cố định (chạm để đặt/cất); chưa kéo thả đổi chỗ tự do
- [ ] 8 cây trồng mới chưa có linh vật riêng (mascot_<cây>_l1..l4) và ảnh kho; popup cây mới chưa có bong bóng lời thoại
- [ ] Kiểm trên máy thật (iPhone/Android) các cỡ màn; đã kiểm bằng Chrome thật 360×640, 390×844, 844×390

## Học Vui Plus (G1–G6): còn lại chờ người/bên ngoài (phần cục bộ đã xong, tắt mặc định)

- [ ] Chạy migration 009 trên Neon rồi mới đặt `LEARN_PLUS=on` — cần quyền database sản xuất (chưa chạy: gói này không deploy)
- [ ] Thử thanh toán thật bằng đơn `learn_test` 1.000đ (`LEARN_TEST_PRICE=on`) qua SePay — cần tài khoản SePay/ngân hàng; chưa đụng thanh toán thật
- [ ] Khôi phục Plus bằng email (OTP) khi đổi máy, và xác nhận email trước khi cấp dùng thử — `/api/restore` mới chỉ khôi phục Night Pass; cần gửi email thật để thử
- [ ] Trang admin: cấp/thu hồi Plus thủ công, xem đơn Plus — làm khi mở bán
- [ ] Nối `learn/coach.js` vào trang học (💡 → gợi ý, sai → giải thích) — sửa `learn/index.html`/engine thuộc vùng gói khác; làm khi chủ site đồng ý bật thử (điểm cắm ghi ở `LEARN-PLUS-DESIGN.md`)
- [ ] AI thật: đặt `LEARN_AI_KEY`, xác nhận mã mô hình, chạy thử nhóm nhỏ, đọc mẫu lời AI, đo chi phí thật, chốt giá và hạn mức — cần khoá API Anthropic + người; mô phỏng không cho số chi phí
- [ ] Duyệt pháp lý/riêng tư (dữ liệu trẻ gửi nhà cung cấp AI), cập nhật `legalDate` ở `shared/site.js` khi mở bán — việc của chủ site/tư vấn pháp lý
- [ ] G3: Luyện cùng 10 phút (lặp ngắt quãng `learn:srs:*`) + Giờ dạy Bạn Mây + tóm tắt cho ba mẹ — mới có hợp đồng dữ liệu (`LEARN-PLUS-DESIGN.md`); cần G2 chạy thử thật và nội dung "sai kiểu" cho Bạn Mây
- [ ] G4: đề thi — thêm phần Tiếng Việt (cần người soạn), người duyệt 90 câu Toán sinh tự động, giao diện làm bài `learn/exam/`; báo cáo tuần/tháng + email hằng tuần (cần cơ chế đồng ý nhận thư + Brevo/Resend)
- [ ] G5: Nhiều bé + đồng bộ đám mây — chỗ cắm dữ liệu đã sẵn; chờ chủ site đồng ý lưu dữ liệu bé lên máy chủ + cập nhật pháp lý trước; vườn theo hồ sơ đụng `farm.js`/`garden/**` (gói vườn đang sửa)
- [ ] G6: Truyện mùa 2, vườn Night, Cambridge, giọng đọc, chụp bài tập — cần người viết/hoạ sĩ/nhà cung cấp TTS/duyệt riêng tư; chỉ có tài liệu

## Bộ sưu tập Bạn Số & Bạn Chữ (mỗi số/chữ là một quái vật riêng, bé gặp bạn nào bạn đó vào album)

- [?] Mở rộng đủ 29 chữ cái + số khi có thêm bài học (hiện có 28 bạn: số 0–10, chữ a…h) — Cần bạn duyệt danh sách chữ/vè cho các chữ còn lại

## H9. Bé lớp 1: việc cần thiết bị/bé thật (khảo sát 2026-11-23)

- [ ] B13. Rà lại toàn bộ bằng bé thật (hoặc phụ huynh quan sát) 5 phút, trên iPad và iPhone — Ghi lại: bé chạm vào đâu đầu tiên, có tự quay lại không, chỗ nào hỏi "cái này là gì". Mình mới đóng vai bằng ảnh Chrome, chưa có người thật
- [ ] B14. iPhone SE thật: kiểm nút góc phải trên (sự kiện 📅) và góc phải dưới (＋ − ⌂) còn lệch icon không — Đã đổi cách căn giữa (flexbox thay grid) và vẽ ＋ − bằng SVG; Chrome headless đo tâm icon trùng tâm nút ở 320 và 375px nhưng không tái hiện được lỗi gốc, cần thử trên máy thật

## H7. Khảo sát đóng vai bé lớp 2–5 (24/11/2026): còn lại sau đợt sửa

Báo cáo gốc: docs/khao-sat-lop-2.md … khao-sat-lop-5.md. Mã đã sửa; còn lại 18 mục `[ ]` "cần người" ghi ngay trong từng báo cáo
(duyệt lời viết lại cho thẻ chủ đề, hình trăm-chục-đơn vị, làm tròn lớp 2 đối chiếu GDPT 2018, nội dung Việt/Anh lớp 5 và giáo viên duyệt,
avatar bé lớn, quyết định thiết kế chủ site, thử trên iPhone/iPad thật).

- [ ] Bé thật (hoặc phụ huynh quan sát) chơi thử trên iPad/iPhone thật: giọng đọc, kéo thả bằng ngón tay, bàn phím hệ điều hành.
- [ ] Chạy tay `check-ui.js --full` và `check-lessons-ui.js --all` khi máy rảnh (chưa chạy trên mã đã gộp).


## Tách tệp (theo quy tắc "Cấu trúc tệp" trong CLAUDE.md và GAME_RULES.md)

- [ ] `learn/index.html` (~990 dòng): tách CSS ra `learn/css/` (nút, câu hỏi, menu, chúc mừng, màn kết thúc…) và JS ra `learn/js/` (vòng chơi, âm thanh, menu, kết quả); HTML chỉ còn khung.
- [ ] `learn/engine.js` (~800 dòng): tách theo môn/kỹ năng (Toán số học, hình học, đo lường, dữ liệu…), giữ một tệp nối.
- [ ] `learn/parent/index.html` (~550 dòng), `learn/lop/bai.html` (~390 dòng), `learn/lang-skills.js` (~460 dòng), `learn/content/qtypes.js` (~420 dòng), `learn/qui.js` (~330 dòng): tách CSS/JS riêng và theo chức năng.
- [ ] Mọi dòng quá dài (cả khối viết trên một dòng, nhất là CSS/JS trong HTML): xuống dòng theo luật.
- [ ] Thêm bài đo `scripts/learn/check-filesize.js`: báo tệp tay viết vượt giới hạn dòng (bỏ qua tệp sinh tự động), chạy cùng các bài đo của Học Vui.

## G. Game Cozy mới "Ghép Ba Thẻ" (xếp thẻ chồng lớp, khay 7 ô, đủ 3 thẻ giống thì biến mất) — 1 giao diện free + 4 trả phí

- [x] Spec `scripts/cozygame/specs/ghep-ba-the.js` + mã client `scripts/cozygame/parts/ghep-ba-the/*.js` (bố cục, luật chơi, vẽ)
- [x] Mã Night Pass `server/pro/ghep-ba-the.js`: 3 chế độ (Tầng Tầng, Thẻ Úp, Đua 90 giây) + 4 giao diện đổi HẲN cách xếp thẻ (Tiệm Kẹo, Đáy Biển, Vườn Trái Cây, Vũ Trụ)
- [x] Nối vào hệ thống: wire.js, og.js, events.js, multi-games.js, music.js, widebg.js, rails/portalui SAVE, check.js GAMES
- [~] Sinh `node scripts/cozygame/gen.js ghep-ba-the`, kiểm Chrome thật: ĐÃ xem 360×640 (free + 4 skin); CHƯA xem 380×760, ngang 844×390, 1200×640; free + 4 skin; home / chơi / kết thúc / popup
- [x] Bài đo riêng cho game (chỉ game này, không chạy cả repo) đạt
- [ ] Linh vật SVG riêng (docs/MASCOT-ART-RULES.md) + thẻ npbadges — chưa làm, cần duyệt phong cách

## G2. Game Cozy mới "Tìm Đôi Thẻ" (chạm 2 thẻ giống nhau xếp chồng, 3 độ khó) — 1 giao diện free + 4 trả phí

- [x] Spec + mã client `scripts/cozygame/parts/tim-doi-the/*.js` + `server/pro/tim-doi-the.js` (3 loại: Thẻ Úp, Xáo liên tục, Đua giờ; 4 giao diện: Chợ Tết, Rừng Rậm, Phố Ẩm Thực, Đồ Chơi Bé)
- [x] Nối hệ thống (wire.js, og.js, events, multi-games, music, widebg, rails/portalui, check.js, check-difficulty.js); ván sinh luôn giải được (đã đo 5 bố cục × 3 độ khó)
- [x] Ảnh Chrome 360×640: free + 4 giao diện + menu ⋯ (độ khó/chế độ/giao diện tự nhận)
- [ ] Chưa xem ảnh: 380×760, ngang 844×390, 1200×640, màn kết thúc, popup
- [ ] Bài đo difficulty báo "huy hiệu hiện ở màn chọn" — cùng lỗi với ga-me-ban-trung / cho-hang-kieu-viet (do màn chính mới home3), không riêng game này
