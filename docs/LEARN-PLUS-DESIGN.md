# Học Vui Plus: thiết kế AI luyện cùng (G2) và khung G3–G6

Đi kèm `docs/LEARN-NIGHTPASS-PLAN.md` (mục 3A) và `docs/LEARN-FREE-VS-PLUS.md`. Tài liệu này ghi **hợp đồng dữ liệu** và **việc chưa làm**.

## G2. AI luyện cùng (bản đầu): đã làm cục bộ

### Luồng
`learn/coach.js` (trình duyệt) → `POST /api/learn/coach` (Worker) → [cache] → [hạn mức ngày] → nhà cung cấp (mô phỏng | Claude qua `LEARN_AI_KEY`) → kiểm đầu ra → trả JSON. Mọi nhánh lỗi trả `200 {source:"fallback", text:""}`: trang giữ gợi ý viết sẵn.

### Yêu cầu (`POST /api/learn/coach`, cần token Plus có tính năng `coach`)
```json
{ "mode": "hint|explain", "grade": 3, "subj": "toan|tviet|tanh", "skill": "mul_carry", "q": "câu hỏi (<=400)", "correct": "đáp án đúng (<=60)",
  "wrong": "đáp án bé chọn (tuỳ chọn)", "err": "mã lỗi trong TAGS của engine.js (tuỳ chọn)", "step": 0, "lang": "vi|en" }
```
Không có tên, email, mã thiết bị, tiến độ. `correct` được gửi để máy chủ KIỂM đầu ra (và để AI không tự tính sai); lời dặn hệ thống cấm nói đáp án.

### Đầu ra (schema cố định)
```json
{ "ok": true, "source": "ai|mock|cache|fallback", "event": "hint|comfort|wrong|praiseEffort", "emotion": "idle|happy|cheer|sad|sleepy|think|wow",
  "steps": ["<= 3 câu, mỗi câu <= 90 ký tự"], "text": "<= 40 ký tự", "left": 12 }
```
`event` và `emotion` nằm trong bộ có sẵn (`learn/content/phrases.js`); sai thì về mặc định. `fallback` kèm `reason`: `quota`, `ai_error`, `leak`, `unsafe`, `schema`, `input_unsafe`, `migration`, `off`, `http…`.

### Kiểm đầu ra (bắt buộc, 3 lớp)
1. **Lược đồ** (`shape`): gỡ thẻ HTML, cắt độ dài, ép `event`/`emotion`.
2. **Từ nhạy cảm** (`learn/content/safe-words.js`, danh sách `EXACT` có dấu + `PLAIN` không dấu, chặn liên kết/email/số điện thoại/thẻ HTML): dùng chung máy chủ và trình duyệt (`coach.js` lọc lần hai). Quét toàn bộ câu thoại/ngân hàng câu hỏi hiện có: 0 dương tính giả (bài đo). Danh sách là bản đầu: người duyệt nên bổ sung theo thực tế.
3. **Không lộ đáp án** (`LearnSafe.leaks`): số (kể cả viết bằng chữ vi/en 0–999, biến thể lăm/tư/mốt/lẻ/linh), phân số/biểu thức, cụm chữ (không phân biệt hoa-thường/dấu, theo ranh giới từ), chữ cái đơn (chỉ trong ngoặc/nháy hoặc sau "chữ/đáp án/chọn…"). Lộ → bỏ, dùng gợi ý viết sẵn. Bài đo: 114 bài mẫu (54 bài trong ngân hàng + 60 câu toán sinh) × 12 ca mô phỏng = 1368 ca, 0 lộ; 502 ca "AI giả cố tình lộ" bị bắt 100%.
   Giới hạn đã biết: lọc theo chữ, không hiểu nghĩa. Lời gợi ý "dán" đáp án bằng cách diễn đạt lạ (vd mô tả gián tiếp) vẫn có thể lọt: lý do cần chạy thử nhóm nhỏ và người đọc mẫu lời AI (mục việc cần người).

### Cache, hạn mức, đường lui
- Cache `learn_coach_cache`: khoá = SHA-256 của (chế độ, lớp, môn, kỹ năng, câu hỏi, đáp án đúng, mã lỗi, bước, ngôn ngữ, mô phỏng/thật). Không có mã bé/tài khoản; chứa `correct` trong khoá nên không thể "đầu độc" cache bằng đáp án khác. Lời cache lấy ra vẫn kiểm lại.
- Hạn mức: `learn_coach_usage(user, ngày VN)`, mặc định 40 lượt gọi AI/ngày; lượt trúng cache không tính; hết hạn mức vẫn dùng được cache và gợi ý viết sẵn (không chặn học). Giới hạn theo thiết bị: chưa làm (đang theo tài khoản + 30 yêu cầu/phút).
- Đường lui: lỗi mạng/HTTP/treo quá 6 giây/đầu ra bị loại/thiếu bảng → `fallback`. Linh vật nói "đang nghĩ…" (`event("thinking")`) rồi `offline` khi mất mạng.

### Công tắc phụ huynh
Trang phụ huynh (thẻ Plus): AI BẬT/TẮT (`learn:plus:ai`), xem lại lời linh vật trong ngày (`learn:coachlog`, chỉ trên máy, tự dọn khi sang ngày, nút xoá).

### Điểm cắm chưa nối (làm khi chủ site đồng ý bật thử)
`learn/coach.js` CHƯA được nạp ở trang học nào (bản free không đổi). Nối ở trang học (ngoài phạm vi gói này): nạp `content/safe-words.js`, `plus.js`, `coach.js`; khi bé bấm 💡 gọi `LearnCoach.ask({mode:"hint", …}).then(LearnCoach.say)`; sau khi bé chọn sai gọi `mode:"explain"` với `err` = mã lỗi của đáp án bé chọn (đã có trong `bank.js`/engine). Kết quả `source:"fallback"` thì giữ gợi ý viết sẵn (`hint.js`).

### Việc CẦN NGƯỜI (không làm được cục bộ)
1. Khoá API Claude (Secret `LEARN_AI_KEY`), xác nhận mã mô hình và giá; chạy nhóm nhỏ thật.
2. Đo chi phí thật: số lượt/bé/ngày, token/lượt, tỉ lệ trúng cache → chốt giá và hạn mức. Mô phỏng không cho số này.
3. Người đọc mẫu lời AI thật (≥ vài trăm lượt, cả vi/en) để soát giọng điệu, sai kiến thức, lộ đáp án gián tiếp; bổ sung `safe-words.js`.
4. Duyệt pháp lý/riêng tư với tư vấn (dữ liệu trẻ em gửi nhà cung cấp AI nước ngoài); chính sách của nhà cung cấp về lưu/huấn luyện trên dữ liệu.
5. Thêm nhà cung cấp thật vào `scripts/check-worker-bundle.js` trước khi deploy (đã chạy đạt với mã hiện tại).

## G3. Luyện cùng 10 phút + Giờ dạy Bạn Mây + tóm tắt cho ba mẹ: CHỈ KHUNG (chưa làm)

Hợp đồng dữ liệu (mở rộng `/api/learn/coach`, cùng cơ chế lọc/cache/hạn mức):
- **Bài hôm nay** (`mode:"session"`): máy khách (không cần AI) dựng danh sách từ `LearnEngine.summary` + `learn:err` + `learn:dayk`: `{ skills:[{skill, diff, count, review}], minutes:10 }`, ~12 câu, khó dần, dễ lại khi bé sai liên tiếp. `engine.plan()` đã chọn kỹ năng theo mức thành thạo; cần thêm: ôn đúng lúc (lặp ngắt quãng: lần ôn sau 1, 3, 7 ngày, lưu ở `learn:srs:<kỹ năng>` = `{due, step}`), dừng khi bé mệt (3 sai liên tiếp → câu dễ hơn). AI chỉ viết lời rủ ("mình luyện phép trừ có nhớ nhé"), không chọn câu.
- **Giờ dạy Bạn Mây** (`mode:"teach"`): Bạn Mây đưa một lời giải SAI theo mã lỗi phổ biến của kỹ năng (lấy từ `wrong[]` của `bank.js`, có sẵn mã lỗi); bé bấm chọn chỗ sai. Không cần AI để chạy (dữ liệu đã có); AI chỉ thêm lời. Đầu ra: `{ wrongSolution:[bước…], faultStep:2, tag:"carry_error", text }`; máy chủ kiểm `faultStep` khớp với đáp án sai đã biết.
- **Tóm tắt cho ba mẹ** (`mode:"summary"`): đầu vào là SỐ LIỆU tổng hợp (không tên, không nội dung): `{ days, minutes, skills:[{id, level, delta}], topErrors:[tag…] }` → 3–4 câu tiếng Việt, qua cùng bộ lọc; hiện ở trang phụ huynh, có công tắc.
- Chặn bởi: G2 chạy thử thật; soạn nội dung "sai kiểu" cho Bạn Mây ngoài ngân hàng hiện có.

## G4. Đề thi thử lớp 6 + báo cáo tuần

**Đã làm (bản nháp)**: `server/learn-exam.js` + `/api/learn/exam/<1-3>` (+ `/grade`): 3 đề cố định × 30 câu Toán lớp 5 (10 dạng × 3: phân số, số thập phân, phần trăm, hình chữ nhật, đổi đơn vị, chuyển động, trung bình cộng, biểu thức, tỉ số, giá trị chữ số), mỗi câu 4 đáp án, đáp án sai mang mã lỗi; đáp án chỉ ở máy chủ; chấm trả `{score, max, score10, byTopic, weak[], errors{tag:n}}`. Kiểm bằng bộ giải độc lập.
**Chưa làm / cần người**:
1. Phần **Tiếng Việt** (đọc hiểu, chính tả, luyện từ và câu) cần người soạn, tự soạn theo khung GDPT 2018 (không chép đề thật/sách; `LEARN-NIGHTPASS-PLAN.md` mục 7). Cấu trúc đề đã chừa: thêm `items` loại khác (đọc hiểu = đoạn văn + câu hỏi) và `topics`.
2. Người duyệt độ khó/diễn đạt của 90 câu sinh tự động (đang đánh dấu `draft:true`), thêm các dạng khó hơn (hai bước, hình học tổng hợp, chuyển động ngược chiều).
3. **Giao diện làm bài** (chưa có): màn đồng hồ 40 phút, chọn đáp án, nộp, bảng điểm theo dạng bài. Nối `GET /api/learn/exam/<id>` + `/grade`. Nên đặt trong trang riêng (vd `learn/exam/`) mở từ trang phụ huynh, không từ trang bé.
4. **Báo cáo tuần/tháng** (chưa làm): hợp đồng dữ liệu: đầu vào `learn:dayk` (ngày × môn × kỹ năng → [số câu, đúng, xem gợi ý]), `learn:m:*` (mức thành thạo), `learn:err`, kết quả đề thi; đầu ra `{ week, skills:[{id, from, to}], repeatedErrors:[{tag, n}], suggest:[…] }` tính ở máy khách (không cần máy chủ); email hàng tuần cần job theo lịch của Worker + Brevo/Resend + email phụ huynh đã đồng ý nhận thư (chưa có cơ chế đồng ý) → làm sau G5.

## G5. Nhiều bé + đồng bộ đám mây: CHỈ GHI TÀI LIỆU (cần quyết định)

Chỗ cắm dữ liệu đã có (xem `LEARN-FREE-VS-PLUS.md` mục 4). Cần quyết định/nguồn lực trước khi làm:
- Chủ site đồng ý lưu tiến độ ẩn danh của bé trên máy chủ + **cập nhật pháp lý trước** (`privacy.html` đang ghi rõ "chưa có đồng bộ"); phụ huynh đồng ý trước khi bật.
- Bảng `learn_profiles(user_id, profile_id, data jsonb, updated_at)`; API `PUT/GET /api/learn/sync` nhận/ trả `Backup.snapshot()`; máy chủ gộp bằng cùng hàm `merge` (cần bản chạy được trên Worker: `backup.js` là UMD nên `require` được ở Node/Worker).
- Nhiều hồ sơ bé (tối đa 4): `path.js` đã có mã hồ sơ `learn:pf` nhưng giao diện chọn hồ sơ và vườn theo hồ sơ chưa có; vườn (`slot.js`) hiện gắn theo lớp × môn, chưa theo hồ sơ → cần thiết kế lại hậu tố ngăn (đụng `farm.js`/`garden/**`, đang do gói vườn sửa nên để sau).
- Rủi ro: dữ liệu trẻ em lên đám mây là phần nhạy cảm nhất; xung đột nhiều máy chỉ giải quyết bằng "bản mới hơn thắng từng phần" (đã đo), không có lịch sử/khôi phục.

## G6. Truyện mùa 2, vườn Night, Cambridge, giọng đọc, chụp bài tập: CHỈ GHI TÀI LIỆU

Mỗi mục cần nguồn lực/quyết định ngoài code, nên chưa làm:
- **Truyện mùa 2**: cần người viết kịch bản (`LEARN-STORY-PLAN.md`) và tranh.
- **Vườn Night**: cần hoạ sĩ (`MASCOT-ART-RULES.md`, phong cách Night tách bạch) + nằm trong vùng tệp của gói vườn.
- **Cambridge Starters/Movers/Flyers**: cần soạn nội dung chuẩn (không chép đề Cambridge), làm sau 6 tháng theo kế hoạch.
- **Giọng đọc chất lượng cao**: cần chọn nhà cung cấp TTS, chi phí theo ký tự, duyệt riêng tư.
- **Chụp bài tập / đọc to bằng giọng bé**: dữ liệu ảnh/giọng của trẻ nhạy cảm; cần duyệt riêng tư và đồng ý pháp lý riêng, đúng như `LEARN-NIGHTPASS-PLAN.md` ("duyệt riêng").
