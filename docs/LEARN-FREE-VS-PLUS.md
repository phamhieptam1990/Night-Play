# Học Vui: Free vs Plus (bảng sự thật + cách bật + việc còn lại)

Nguồn sự thật cho chữ công khai về Học Vui Plus (`privacy.html` mục 5, `terms.html` mục 4A). Kế hoạch gốc: `docs/LEARN-NIGHTPASS-PLAN.md`. Hợp đồng linh vật: `docs/LEARN-MASCOT-AI-CONTRACT.md`. Thiết kế chi tiết AI + G3–G6: `docs/LEARN-PLUS-DESIGN.md`.

## 0. Các mục "chờ chốt" đã CHỐT TẠM (mặc định chờ chủ site xác nhận)

Theo phương án đề xuất trong `LEARN-NIGHTPASS-PLAN.md` mục 8. Đổi ở đâu khi chủ site quyết khác: cột bên phải.

| Câu hỏi | Chốt tạm | Đổi ở đâu |
|---|---|---|
| Tên gói | **Học Vui Plus** | chữ trong `learn/parent/plus-card.js`, `privacy.html`, `terms.html` |
| Giá | tháng **99.000đ** · quý **249.000đ** · năm **790.000đ**; không bán gói ngày/tuần (giá tham khảo, chốt lại sau khi đo chi phí AI thật) | `PLANS_LEARN` ở `server/learn.js` |
| Gói đôi (Night Pass game + Plus) | **Chưa có** | — |
| Đồng bộ đám mây | **Để sau cùng (G5)**; chưa làm, chưa thu dữ liệu | `docs/LEARN-PLUS-DESIGN.md` mục G5 |
| AI có ô gõ chữ/giọng nói cho bé | **Không** (chỉ bấm/chọn) | — |
| Thứ tự | G1 nền bán hàng → G2 AI (thử nhỏ, đo chi phí) → G3/G4 | — |
| Hoàn tiền Plus | áp dụng như Night Pass (`terms.html` mục 7) | `terms.html` 4A |
| Hạn mức AI | 40 lượt gọi AI/tài khoản/ngày (cache không tính) | biến `LEARN_COACH_DAILY` |

## 1. Free và Plus (đối chiếu code)

| | Free (như hiện tại, KHÔNG đổi) | Plus (tắt mặc định) |
|---|---|---|
| Bài học, kỹ năng, vườn, truyện, gợi ý 💡, nhiệm vụ ngày | Đủ lớp 1–5, 3 môn | Giữ nguyên |
| Giới hạn giờ, sao lưu tệp, trang phụ huynh | Có | Giữ nguyên |
| AI luyện cùng (gợi ý từng bước, giải thích khi sai) | Không (câu thoại viết sẵn) | `/api/learn/coach` + `learn/coach.js`, tính năng `coach`/`explain` |
| Đề thi thử lớp 6 | Không | `/api/learn/exam/<1-3>` (+ `/grade`), tính năng `exam6`; bản nháp 30 câu Toán × 3 đề |
| Báo cáo tuần | Bản tin tuần cơ bản (`habit.js`) | Báo cáo chi tiết: **chưa làm** (G4, xem thiết kế) |
| Nhiều bé / đồng bộ | 1 hồ sơ, sao lưu tay | **Chưa làm** (G5); chỗ cắm dữ liệu đã sẵn (mục 4) |

Trang của bé: **không có giá, không có nút mua** (bài đo `check-plus.js` quét `learn/index.html`, `learn/lop/index.html`). Mọi thứ có giá nằm trong `learn/parent/` sau cổng phụ huynh.

## 2. Cờ bật/tắt (mặc định TẮT ở mọi nơi)

| Nơi | Cờ | Tắt thì |
|---|---|---|
| Máy chủ (Worker/Netlify) | biến môi trường `LEARN_PLUS=on` | `/api/learn/*`, đơn `product:"learn"`, `/api/pass?product=learn` trả 404 `learn_off`; Night Pass game không đổi |
| Trình duyệt | `localStorage["learn:plus:on"]="1"` hoặc `window.LEARN_PLUS=true` | `LearnPlus.has()` luôn false, không có yêu cầu mạng, thẻ Plus trong trang phụ huynh ẩn |
| AI thật | biến `LEARN_AI_KEY` (Secret của Worker) | không có khoá (hoặc `LEARN_AI_MOCK=on`) → bộ **mô phỏng** cục bộ, không gọi mạng |
| Thử bằng giá 1.000đ | `LEARN_TEST_PRICE=on` | gói `learn_test` không bán |
| Token thử cục bộ (chỉ để duyệt giao diện) | `localStorage["learn:plus:test"]="1"` rồi `LearnPlus.useTestToken(LearnPlus.makeTestToken(["coach"],7))` | token "test.…" không được nhận; máy chủ không bao giờ nhận token thử |

Biến khác: `LEARN_AI_MODEL` (mặc định ghi `claude-haiku-5-5`: **kiểm lại mã mô hình khi có khoá**), `LEARN_AI_TIMEOUT_MS` (6000), `LEARN_COACH_DAILY` (40).

## 3. Nền bán hàng (G1): đã làm cục bộ

- Migration `server/db/migrations/009_learn_plus.sql`: cột `orders.product`, mở rộng ràng buộc `orders.plan` (gói `learn_*`), bảng `learn_passes` (quyền Plus), `learn_trials` (dùng thử 1 lần/email), `learn_coach_cache`, `learn_coach_usage`.
  **Quyết định khác kế hoạch**: Plus nằm ở bảng riêng `learn_passes` thay vì thêm cột `product` vào `passes`, để không đổi khoá chính của `passes` (Night Pass game, trang admin) → không có rủi ro làm hỏng Night Pass.
- Token: cùng định dạng, thêm `a:"learn"`; `readToken(tok, app)` bắt buộc khớp: token game không mở Plus, token Plus không mở game (bài đo kiểm cả hai chiều).
- `GET /api/pass?product=learn` (trạng thái + tính năng), `GET /api/learn/plans` (công khai: giá), `POST /api/learn/trial` (7 ngày), đơn `POST /api/orders {product:"learn", plan:"learn_month|learn_quarter|learn_year"}` đi qua VietQR/SePay như Night Pass; webhook cấp `learn_passes`.
- Khoá thiết bị dùng chung bảng `pass_devices` với game (tối đa 3 thiết bị cho cả hai gói gộp lại: ghi chú, có thể tách sau).
- `learn/plus.js`: `LearnPlus.has(tên)`, `state()`, `refresh()`, `startTrial()`, `createOrder()`, `pollOrder()`, `aiOn()`. Máy khách không kiểm chữ ký (khoá ở máy chủ); nhớ kết quả máy chủ tối đa 7 ngày khi mất mạng.
- Thẻ Plus trong trang phụ huynh: `learn/parent/plus-card.js` (+ một `<section id="s-plus" hidden>` và 4 thẻ script trong `learn/parent/index.html`).

### Việc CẦN NGƯỜI hoặc CẦN BÊN NGOÀI (chưa làm được cục bộ)
1. Chạy migration 009 trên Neon rồi mới đặt `LEARN_PLUS=on` (xem `DEPLOY-CLOUDFLARE.md` mục "Học Vui Plus").
2. Kiểm thanh toán thật: tạo đơn `learn_test` 1.000đ (cần `LEARN_TEST_PRICE=on`), chuyển khoản qua SePay thật. Chưa chạy (cấm đụng thanh toán thật trong gói này).
3. **Khôi phục Plus bằng email (OTP)** khi đổi máy/mất token: `/api/restore` hiện chỉ khôi phục Night Pass game. Cần thêm nhánh `product=learn` (cần gửi email thật để thử).
4. Dùng thử chưa xác thực email (chỉ chống lặp theo email). Trước khi bán rộng nên bắt xác nhận email (OTP) để tránh dùng thử bằng email của người khác.
5. Chốt giá, tên, cập nhật `legalDate` trong `shared/site.js` khi mở bán (ngày hiệu lực chính sách/điều khoản là việc của chủ site); soát lại `privacy.html`/`terms.html` với tư vấn pháp lý (bản nháp, không phải tư vấn pháp lý).
6. Trang admin chưa có màn quản lý Plus (cấp thủ công, thu hồi): làm khi mở bán.

## 4. Chỗ cắm dữ liệu cho đồng bộ (chuẩn bị G5, đã làm trong bản free, không đổi hành vi)

- `learn/slot.js`: mỗi lần ghi/xoá khoá tiến độ/vườn, nhớ **giờ sửa** vào `learn:mt` = `{ <khoá đầy đủ, có hậu tố ngăn>: ms }` (gộp ghi 400ms; không ghi giờ chơi, nhạc, giao diện). API: `LearnSlot.mtime(key)`, `mtimes()`, `touch(key, at)`.
- `learn/backup.js`: `Backup.snapshot()` → `{app:"hocvui", v:2, at, parts:{<khoá>:{d:<chuỗi JSON>, u:<giờ sửa>}}}`; `Backup.merge(a, b)` (mỗi phần: bản mới hơn thắng; tiến độ chủ đề `learn:pf:*:lp:*` gộp theo TỪNG CHỦ ĐỀ bằng trường `u` của `path.js`; giao hoán và lặp lại không đổi); `Backup.applySnapshot(s)`; `Backup.checkSnapshot(s)`. Tệp sao lưu v1 (`collect/apply`) **không đổi**.
- Chỉ số và mã, không có tên/ảnh/email/nội dung câu hỏi. Bài đo: `node scripts/learn/check-sync.js`.
- Định dạng bài học có trường `plus` tuỳ chọn: `{ retell, advanced, variants }` (`scripts/learn/build-lessons.js` dòng kiểm); bản free bỏ qua. `retell` = nội dung để AI giảng lại, `advanced` = bài nâng cao, `variants` = biến thể không giới hạn. Chưa có bài nào dùng.

## 5. Bài đo (đều chạy cục bộ, không mạng ngoài, không khoá thật)

| Lệnh | Kiểm |
|---|---|
| `node scripts/learn/check-sync.js` | giờ sửa từng phần, snapshot/gộp/áp dụng |
| `node scripts/learn/check-plus.js` | cờ tắt, đơn learn, webhook, token a:learn hai chiều, dùng thử, hết hạn, token thử, mất mạng, trang bé không có giá |
| `node scripts/learn/check-coach.js` | lọc từ nhạy cảm (+ dương tính giả trên toàn bộ câu có sẵn), **không lộ đáp án** 114 bài mẫu × 12 ca và 502 ca AI giả lộ đáp án (bắt 100%), cache, hạn mức, đường lui, `coach.js` |
| `node scripts/learn/check-exam.js` | 3 đề cố định, đáp án tính lại độc lập, chấm điểm, cần Plus, không lộ đáp án |
| `NODE_PATH=… node scripts/learn/check-plus-ui.js` | thẻ Plus trong trang phụ huynh bằng Chrome (cờ tắt: ẩn + không gọi API; cờ bật: 390×844, 360×640) |
