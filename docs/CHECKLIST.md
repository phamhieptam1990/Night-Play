# Checklist Học Vui

Cập nhật: 2026-11-24. Quy ước: `[x]` xong · `[ ]` chưa làm · `[~]` đang làm · `[?]` chờ chủ site duyệt. Xong mục nào thì đổi ký hiệu mục đó (sửa đúng một dòng).

## Điều phối (24/11/2026)

Ba gói chạy song song, mỗi gói giữ một vùng tệp riêng để không đụng nhau. Các mục `[?]` chờ duyệt đã được điều phối CHỐT TẠM theo bản đề xuất trong kế hoạch tương ứng (chủ site xác nhận hoặc sửa sau).

- **Gói A — Vườn theo lớp (H5):** `learn/garden/**`, `learn/farm.js`, `shared/art/garden/**`.
- **Gói B — Lớp 1 trực quan + icon trang phụ huynh:** `learn/content/lessons/g1_*|VI-G1-*|EN-G1-*`, `learn/lop/bai.html`, `learn/parent/index.html`, `scripts/learn/gen-icons.js`.
- **Gói C — Nền Plus + AI luyện cùng (chạy cục bộ, mock, tắt mặc định):** `worker/**`, `server/**`, `learn/plus.js`, `learn/slot.js|path.js|backup.js`, docs, `privacy.html`, `terms.html`.
- Việc cần người/thiết bị thật (B13, B14, nghe loa thật, tô chữ trên cảm ứng, duyệt nội dung) vẫn giữ nguyên bên dưới.

## H1. Khung điều hướng theo lớp

- [ ] Lớp 1: làm các bài học và bài kiểm tra còn lại trực quan hơn (hình to, câu hỏi bằng hình, ít chữ) — Mới có 2 bài làm quen; các bài khác vẫn dùng chữ nhiều. Cần bạn duyệt hướng đi trước khi sửa 12 bài
- [ ] Icon SVG: trang phụ huynh chưa nạp `icons.js` (còn emoji/ký tự chữ); nút có chữ kèm icon vẫn dùng icon màu (chỉ nút CHỈ có icon dùng bản nét đơn) — cần bạn quyết định có đổi nốt không

## H2. Bộ máy bài học

- [?] Bạn duyệt 3 bài mẫu

## H6. Thói quen & niềm tin học (learn/habit.js)

- [x] Cầu vồng tuần (không mất), quà mốc 3/7/14/30 ngày, lời khen theo tiến bộ của chính bé, bản tin tuần cho ba mẹ
- [ ] Lời chào mở app theo thói quen ("cây đang chờ con tưới")

## H4. Soạn bài học hàng loạt (66 chủ đề)

- [?] Bạn duyệt 12 bài lớp 1 (3 môn): giọng văn, độ dài, mức khó, từ tiếng Anh — Mở: /learn/lop/index.html?grade=1&subj=toan (tviet, tanh)
- [?] Duyệt 54 bài nháp lớp 2–5 (Toán, Việt, Anh): lời giảng tự lắp từ chương trình + ngân hàng câu hỏi, 15 bài soạn tay ngắn (thống kê, nói và nghe, viết, nghe tiếng Anh) — mở /learn/lop/index.html?grade=2&subj=toan … Bộ sinh: scripts/learn/gen-lessons-draft.js (+ lesson-extra.js); bộ kiểm: build-lessons.js, check-lessons-ui.js --all

## H5. 3 khu vườn: Toán giữ nguyên + 2 khu vườn MỚI (Rừng Chữ, Vịnh Từ) + đổi màu theo lớp (kế hoạch: docs/LEARN-GARDEN-LAYOUTS-PLAN.md)

- [ ] Quầy đổi hạt: hạt giống trong kho là số chung (không theo loại), nên quầy đổi 2 nông sản lớp cũ lấy 1 hạt (3 lần/ngày) thay vì "hạt này lấy hạt kia" — cần bạn duyệt cách đổi này
- [ ] Đồ trang trí chỉ có 4 chỗ đặt cố định (chạm để đặt/cất); chưa kéo thả đổi chỗ tự do
- [ ] Sao lưu: khoá `gardenOwned`, `gardenDeco@*`, `gardenSwap` chưa nằm trong danh sách trắng của `learn/backup.js` (ngoài vùng gói A, giao gói C); đồ đã mở vẫn tính lại được từ tiến độ chủ đề, chỉ mất chỗ đặt trang trí khi khôi phục
- [ ] 8 cây trồng mới chưa có linh vật riêng (mascot_<cây>_l1..l4) và ảnh kho; popup cây mới chưa có bong bóng lời thoại
- [ ] Kiểm trên máy thật (iPhone/Android) các cỡ màn; đã kiểm bằng Chrome thật 360×640, 390×844, 844×390

## Học Vui Plus (G1–G6): phần làm được cục bộ đã xong (tắt mặc định); còn lại chờ người/bên ngoài

Đã xong và có bài đo: chỗ cắm đồng bộ (`check-sync.js`), nền bán hàng + token + dùng thử + thẻ Plus (`check-plus.js`, `check-plus-ui.js`), lọc từ nhạy cảm + không lộ đáp án + cache/hạn mức/đường lui + công tắc AI (`check-coach.js`), khung đề thi (`check-exam.js`), pháp lý. Chi tiết: `docs/LEARN-FREE-VS-PLUS.md`, `docs/LEARN-PLUS-DESIGN.md`.

- [?] Chủ site xác nhận các mặc định đã chốt tạm (tên Học Vui Plus; 99k/249k/790k; không gói đôi; đồng bộ để sau) — `docs/LEARN-FREE-VS-PLUS.md` mục 0
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

## H6. Đóng vai bé lớp 1: chưa đạt, cần sửa (khảo sát 2026-11-23, Chrome 390×780)

- [ ] B13. Rà lại toàn bộ bằng bé thật (hoặc phụ huynh quan sát) 5 phút, trên iPad và iPhone — Ghi lại: bé chạm vào đâu đầu tiên, có tự quay lại không, chỗ nào hỏi "cái này là gì". Mình mới đóng vai bằng ảnh Chrome, chưa có người thật
- [ ] B14. iPhone SE thật: kiểm nút góc phải trên (sự kiện 📅) và góc phải dưới (＋ − ⌂) còn lệch icon không — Đã đổi cách căn giữa (flexbox thay grid) và vẽ ＋ − bằng SVG; Chrome headless đo tâm icon trùng tâm nút ở 320 và 375px nhưng không tái hiện được lỗi gốc, cần thử trên máy thật
