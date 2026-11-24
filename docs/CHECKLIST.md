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

## H4. Soạn bài học hàng loạt (66 chủ đề)

- [?] Bạn duyệt 12 bài lớp 1 (3 môn): giọng văn, độ dài, mức khó, từ tiếng Anh — Mở: /learn/lop/index.html?grade=1&subj=toan (tviet, tanh)
- [?] Duyệt 54 bài nháp lớp 2–5 (Toán, Việt, Anh): lời giảng tự lắp từ chương trình + ngân hàng câu hỏi, 15 bài soạn tay ngắn (thống kê, nói và nghe, viết, nghe tiếng Anh) — mở /learn/lop/index.html?grade=2&subj=toan … Bộ sinh: scripts/learn/gen-lessons-draft.js (+ lesson-extra.js); bộ kiểm: build-lessons.js, check-lessons-ui.js --all

## H5. 3 khu vườn: Toán giữ nguyên + 2 khu vườn MỚI (Rừng Chữ, Vịnh Từ) + đổi màu theo lớp (kế hoạch: docs/LEARN-GARDEN-LAYOUTS-PLAN.md)

- [?] Bạn duyệt bảng vật phẩm KHÁC NHAU theo lớp (cây, vật nuôi, trang trí mỗi lớp) — Bảng nháp trong LEARN-GARDEN-LAYOUTS-PLAN.md
- [ ] Vẽ vật phẩm mới cho từng lớp (khoảng 20 loại mới: cây trồng, cây lâu năm, vật nuôi, đồ trang trí) theo phong cách Pop
- [ ] Vật phẩm theo lớp: điều kiện mở theo chủ đề đã qua của đúng lớp (thay cho mở theo sao chung)
- [?] Bạn duyệt quy tắc lên lớp: mang theo + đổi (bộ sưu tập, đổi chỗ, đổi hạt giống ở quầy Bác Rễ) và vào thẳng lớp: bộ khởi đầu + bộ sưu tập khóa mờ — Mục Khi bé lên lớp trong LEARN-GARDEN-LAYOUTS-PLAN.md
- [ ] Bộ sưu tập chung (kho đồ mọi lớp, khóa mờ cho đồ chưa mở) + quầy đổi hạt giống của Bác Rễ
- [ ] Vườn khởi đầu theo lớp (bé vào thẳng lớp 3) + bé ở lại lớp 1 vẫn có việc + gợi ý lên lớp cho phụ huynh
- [ ] Kiểm bằng Chrome thật các cỡ màn, cập nhật bài đo vườn

## Chuẩn bị chỗ cắm Plus ngay trong bản free (làm cùng H1–H3, tránh làm lại)

- [ ] Dữ liệu tiến độ/vườn dạng JSON gọn, có thời điểm sửa từng phần (sẵn sàng đồng bộ)

## Plus G1. Nền bán hàng (Học Vui Plus)

- [?] Bạn chốt tên gói, giá, gói đôi, đồng bộ đám mây — LEARN-NIGHTPASS-PLAN mục 8
- [ ] Migration product ở orders/passes, PLANS_LEARN, token a:"learn"
- [ ] /api/pass?product=learn + learn/plus.js
- [ ] Thẻ Plus trong trang phụ huynh + dùng thử 7 ngày
- [ ] Viết docs/LEARN-FREE-VS-PLUS.md, cập nhật privacy/terms

## Plus G2. AI luyện cùng (bản đầu)

- [ ] Bộ lọc từ nhạy cảm theo danh sách (điều kiện bắt buộc)
- [ ] /api/learn/coach + schema đầu ra + khoá API ở Worker
- [ ] Kiểm tra không lộ đáp án: 50+ bài mẫu đạt 100%
- [ ] Cache (câu hỏi + mã lỗi), hạn mức ngày, đường lui khi AI lỗi
- [ ] Công tắc bật/tắt AI + xem lại lời linh vật trong trang phụ huynh
- [ ] Chạy thử nhóm nhỏ, đo chi phí thật, chốt giá

## Plus G3–G6

- [ ] G3: Luyện cùng 10 phút + Giờ dạy Bạn Mây + tóm tắt cho ba mẹ
- [ ] G4: Đề thi thử lớp 6 (3 đề đầu) + báo cáo tuần
- [ ] G5: Nhiều bé + đồng bộ đám mây (sau khi cập nhật pháp lý)
- [ ] G6: Truyện mùa 2, vườn Night, Cambridge, giọng đọc, chụp bài tập

## Bộ sưu tập Bạn Số & Bạn Chữ (mỗi số/chữ là một quái vật riêng, bé gặp bạn nào bạn đó vào album)

- [?] Mở rộng đủ 29 chữ cái + số khi có thêm bài học (hiện có 28 bạn: số 0–10, chữ a…h) — Cần bạn duyệt danh sách chữ/vè cho các chữ còn lại

## H6. Đóng vai bé lớp 1: chưa đạt, cần sửa (khảo sát 2026-11-23, Chrome 390×780)

- [ ] B13. Rà lại toàn bộ bằng bé thật (hoặc phụ huynh quan sát) 5 phút, trên iPad và iPhone — Ghi lại: bé chạm vào đâu đầu tiên, có tự quay lại không, chỗ nào hỏi "cái này là gì". Mình mới đóng vai bằng ảnh Chrome, chưa có người thật
- [ ] B14. iPhone SE thật: kiểm nút góc phải trên (sự kiện 📅) và góc phải dưới (＋ − ⌂) còn lệch icon không — Đã đổi cách căn giữa (flexbox thay grid) và vẽ ＋ − bằng SVG; Chrome headless đo tâm icon trùng tâm nút ở 320 và 375px nhưng không tái hiện được lỗi gốc, cần thử trên máy thật
