# Kế hoạch: app học tập AI cho bé tiểu học và luyện thi lớp 6

Nguồn: [doc.md](doc.md). Tái dùng nền hiện có (hub game tĩnh, `scripts/cozygame`, linh vật SVG, `worker/`, `server/`, Night Pass, bộ kiểm tra puppeteer). Mọi màn hình tuân theo [GAME_RULES.md](GAME_RULES.md); vẽ linh vật theo [docs/MASCOT-ART-RULES.md](docs/MASCOT-ART-RULES.md).

## Quyết định đã chốt (đề xuất, sửa nếu khác)

- [x] Làm trong repo này, code ở `learn/`, lối vào là thẻ thứ ba "Học" trên Play Hub ([play/index.html](play/index.html), cạnh thẻ Pop Play và Night Play, dòng ~174-175). Đã xác nhận hub dựng bằng các thẻ `a.world` nên thêm thẻ mới là dễ; cần cập nhật cả chuỗi đa ngôn ngữ (id `aPop`/`aNight` ở dòng ~223) và cache `sw.js`.
- [ ] Giai đoạn 1 lưu dữ liệu local, chưa cần đăng nhập. Tài khoản phụ huynh từ giai đoạn 3.
- [ ] Không thu thập thông tin cá nhân của bé; có cổng phụ huynh. Cập nhật `privacy.html`/`terms.html` từ giai đoạn 3.
- [ ] Ảnh bài tập chỉ gửi AI khi qua cổng phụ huynh, không lưu ảnh.

## Khung chương trình tham chiếu (từ chủ site)

| Khung | Dùng để làm gì | Khi nào |
|---|---|---|
| **GDPT 2018** (Toán, Tiếng Việt, Tiếng Anh lớp 1–5) | Khung chính để chia chủ đề và soạn câu hỏi. Công khai; **tự soạn câu hỏi bám theo, không chép nội dung sách giáo khoa** (bản quyền). | Từ Giai đoạn 0 |
| **Đánh giá năng lực vào lớp 6** (trường chất lượng cao) | Đề thi thử và luyện thi. Nhóm phụ huynh lo nhất và chịu chi nhất → MVP nhắm vào đây. | Kéo mục 4.1 lên sớm (xem dưới) |
| **Cambridge Starters/Movers/Flyers** | Khung phần Tiếng Anh. | Sau 6 tháng đầu |
| **Violympic, Trạng Nguyên** | Tham khảo dạng bài cho thi đấu và luyện thi (không chép đề). | Giai đoạn 4 |

Quy ước nội dung: mỗi câu hỏi có trường `standard` (mã/mô tả yêu cầu cần đạt của GDPT 2018) cùng `topic`, `grade`, `skill`. Chủ đề Toán Giai đoạn 1 (cần đối chiếu lại với văn bản chương trình chính thức trước khi soạn hàng loạt, tôi chưa kiểm chứng từng yêu cầu cần đạt):

| Lớp | Chủ đề → mini-game gợi ý |
|---|---|
| 1 | Cộng trừ trong phạm vi 10, rồi 20 → bắn bong bóng ghép số |
| 2 | Số đến 1000, bảng nhân/chia lớp 2, tiền Việt → đi chợ thối tiền |
| 3 | Bốn phép tính, nhân chia nhiều chữ số, làm quen phân số → phòng thủ cửu chương, nấu ăn (phân số) |
| 4–5 | Phân số, số thập phân, hình học, tỉ lệ → nấu ăn (phân số), thám tử giải toán có lời văn |
| 5→6 | Dạng bài đánh giá năng lực (logic, toán có lời văn nâng cao) → đề thi thử |

Điều chỉnh kế hoạch theo khung này:
- [x] F.0 Đã lưu bộ dữ liệu chủ site gửi: [learn/content/curriculum-source.json](learn/content/curriculum-source.json) (28 chủ đề `topic_id` lớp 1–5, 3 mạch chính, lược đồ câu hỏi và tiến trình). Đây là bản diễn giải, không phải nguyên văn pháp quy; tự nó ghi cần người rà soát sư phạm trước khi dùng để chấm đạt/chưa đạt.
- [x] F.1 (một phần: đã có `learn/content/curriculum.js` sinh bằng `node scripts/learn/build-curriculum.js`; chưa có kiểm tra câu mồ côi) Từ file nguồn, sinh dữ liệu gọn cho app (id, lớp, mạch, tên, kỹ năng). Dùng `topic_id` làm khóa; mọi câu hỏi phải có `topic_id` hợp lệ + `difficulty` (foundation/standard/challenge) + `misconception_tags`; kiểm tra tự động bắt câu mồ côi. Dùng lược đồ `question_generation_schema` và `student_progress_schema` của file nguồn làm mẫu cho 0.2/0.3.
- [ ] F.2 Đưa "đề thi thử lớp 6" (4.1) lên làm mục tiêu thu tiền của MVP: làm bản đơn giản ngay sau Giai đoạn 1 (đề cố định, chấm điểm, báo điểm yếu theo chủ đề), bản đầy đủ ở Giai đoạn 4.
- [ ] F.3 Quy trình soạn câu hỏi: người duyệt đối chiếu nguồn "tự soạn, không chép SGK"; ghi chú nguồn tham khảo trong mỗi lô.
- [ ] F.4 Tiếng Anh (Cambridge) chỉ bắt đầu sau 6 tháng; không làm trong Giai đoạn 0–3.

## Giai đoạn 0: Nền tảng (~1 tuần)

- [x] 0.0 Thêm thẻ "Học" vào `play/index.html` trỏ tới `learn/index.html`.
- [x] 0.1 (phần 1) Khung `learn/`: chọn lớp 1–5 → danh sách chủ đề theo GDPT 2018, vi/en, ← về hub, ⭐ lưu local. Còn lại: bản đồ phiêu lưu, hồ sơ bé. Một màn hình không cuộn, nút ←, chạy được màn ngang.
- [x] 0.2 Mô hình nội dung: ngân hàng dựng sẵn [learn/content/bank.js](learn/content/bank.js) (42 câu: id, môn, kỹ năng, lớp, độ khó, kiểu, lời văn vi/en, đáp án, đáp án sai gắn mã lỗi tư duy, lời giải từng bước) + 22 kỹ năng trong [learn/engine.js](learn/engine.js), mỗi kỹ năng gắn chủ đề GDPT 2018. `E.toSchema()` xuất đúng `question_generation_schema` cho gia sư AI.
- [x] 0.3 Công cụ kỹ năng trong `learn/engine.js`: tiến độ từng kỹ năng lưu máy (`learn:m:<môn>`: n, ok, p gần đây, lỗi theo mã) + 5 mức thành thạo; `planRound()` chọn kỹ năng cho vòng 5 câu (khởi động dễ, ưu tiên kỹ năng yếu / hay sai, ôn lớp dưới, không lặp); `summary()` cho báo cáo phụ huynh. Trang học dùng bộ máy này, không dùng AI.
- [x] 0.4 Kiểm tra tự động: `node scripts/learn/check-bank.js` (lược đồ ngân hàng, chủ đề có trong chương trình, 25.800 câu sinh ra đều đúng 4 lựa chọn khác nhau / 1 đúng / mọi đáp án sai có mã lỗi / PHÉP TÍNH ĐÚNG, mức thành thạo, hành vi thích ứng, xuất lược đồ). Chưa nối vào `check.js`.
- [x] 0.5 42 câu mẫu (>20) + test bộ chọn câu (kỹ năng bé hay sai tăng 23% → 38% số lần xuất hiện, kỹ năng đã thạo giảm còn 13%).

**Xong khi:** bộ chọn câu thích ứng chạy được, test đạt.

## Giai đoạn 1: MVP học và chơi (3–4 tuần)

- [ ] 1.1 (một phần: đã có KIỂU CÂU HỎI "bắn bong bóng" dùng lại câu chọn 1/4, chưa phải game riêng có điểm và màn chơi) Game bắn bong bóng ghép số (cộng trừ trong 10, lớp 1) — làm TRƯỚC, để kiểm chứng vòng lặp chơi → ghi lỗi → luyện thêm.
- [ ] 1.2 Game đi chợ thối tiền (lớp 2–3).
- [ ] 1.3 Game phòng thủ cửu chương (lớp 2–3).
- [ ] 1.4 (một phần: bộ sinh số học theo lớp + 42 câu viết tay + 18 kiểu câu hỏi, chưa có Batch API và người duyệt) Ngân hàng câu hỏi: sinh bằng Batch API (Haiku 5.5), người duyệt, lưu JSON tĩnh. Runtime không gọi AI.
- [ ] 1.5 (một phần: đã có sao, cổ vũ bằng pháo giấy + âm thanh, thanh tiến độ có linh vật chạy; chưa có thú cưng/làng. Hướng mới: VƯỜN, xem plan-learn-garden.md) Vòng thưởng: sao, thú cưng, xây làng (dùng lại hệ linh vật).
- [ ] 1.6 Bản đồ phiêu lưu: mỗi chủ đề một vùng, hoàn thành mở khóa vùng sau.
- [ ] 1.7 Ghép nhân vật từ bộ phận SVG vẽ sẵn (thân, tai, sừng, cánh, đuôi, hoa văn, bảng màu đã phối); bộ phận mới mở khóa bằng sao.
- [ ] 1.8 Giới hạn thời gian chơi (cổng phụ huynh, lưu local).
- [ ] 1.9 (một phần: đã chụp 390×844 và 360×640 cho trang học; chưa đủ 380×760, 844×390, 1200×640; check.js chưa xanh) Chụp ảnh kiểm tra 360×640, 380×760, 844×390, 1200×640; chạy `check.js`.

**Xong khi:** một bé chơi liền 15 phút, có tiến trình và nhân vật riêng.

## Giai đoạn 2: Gia sư AI và cá nhân hóa (~3 tuần)

- [ ] 2.1 Endpoint `/tutor` trong `worker/`: Haiku 5.5 mặc định, Sonnet 5.5 cho bài khó, bật prompt caching.
- [ ] 2.2 Gia sư dẫn từng bước: chỉ gợi ý, không đưa đáp án; bé trả lời từng bước.
- [ ] 2.3 Chụp ảnh bài tập (vision), qua cổng phụ huynh, giới hạn lượt/ngày.
- [ ] 2.4 An toàn: không chat tự do, lọc đầu ra, giới hạn độ dài, chặn ngoài chủ đề, rate limit theo thiết bị.
- [ ] 2.5 Cá nhân hóa đề bài bằng template (tên bé, thú cưng, môn thể thao); chỉ gọi AI khi thật cần.
- [ ] 2.6 Cache câu trả lời phổ biến.
- [ ] 2.7 Bộ test tự động: 50 bài mẫu, AI không để lộ đáp án trực tiếp.

## Giai đoạn 3: Phụ huynh và thu tiền (~3 tuần)

- [ ] 3.1 Tài khoản phụ huynh, liên kết hồ sơ bé.
- [ ] 3.2 Báo cáo tối qua Zalo (thời gian học, phần yếu từ `errors[]`, gợi ý kèm con). Kiểm tra Zalo OA/ZNS và chi phí trước.
- [ ] 3.3 Thuê bao tháng/năm; xem có tận dụng cơ chế Night Pass được không.
- [ ] 3.4 Gói miễn phí giới hạn bài/ngày.
- [ ] 3.5 Cập nhật điều khoản, chính sách riêng tư cho trẻ em.

**Xong khi:** một phụ huynh đăng ký, trả tiền, nhận báo cáo thật.

## Giai đoạn 4: Luyện thi và mở rộng

- [ ] 4.1 Đề thi thử lớp 6, chấm điểm, phân tích điểm yếu.
- [ ] 4.2 Đấu trường an toàn (1 đấu 1, chỉ emoji dựng sẵn).
- [ ] 4.3 Vẽ tự do có hỗ trợ (perfect-freehand, gương đối xứng), gắn bài hình học.
- [ ] 4.4 Sau khi có khách trả tiền: AI vẽ lại theo phong cách Mít (luôn hiện cả hai bản); "biến tranh thành phim" (Animated Drawings) nếu có ngân sách GPU.

## Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Nội dung toán sai | Người duyệt theo đợt + kiểm tra tự động đáp án |
| Chi phí AI vượt dự kiến | Nội dung tạo sẵn, caching, giới hạn gọi |
| Gia sư lộ đáp án | Bộ test riêng, không phát hành khi chưa đạt |
| Nhân vật ghép xấu | Chỉ cho tổ hợp đã phối sẵn; tự nhìn ảnh trước khi báo xong |

## Quy tắc làm việc

- Commit nhỏ, tiếng Việt; không push khi chưa được yêu cầu; không commit `code.md`.
- Trước mỗi commit: `NODE_PATH=<puppeteer-core> node scripts/cozygame/check.js` phải "✓ tất cả đạt".
- Không báo xong khi chưa mở trình duyệt thật, chụp ảnh và tự nhìn.

- [x] 0.1b `learn/index.html`: vào là học liền (vòng 5 câu ngay khi mở), chọn môn/lớp bằng hình, nút 🔊, ghi lỗi tư duy `learn:err`, sao `learn:stars`. Tiếng Việt/Anh là ngân hàng nhỏ viết tay, cần người duyệt.

## Đã làm thêm ngoài kế hoạch gốc (cập nhật theo tiến độ thực tế)

- [x] L.1 **8 trang landing Học Vui** sinh tự động bằng `scripts/learn/gen-landing.js`: hub `/hoc/`, `/en/hoc/`, và 3 môn × vi/en; menu di động, thanh trên tự ẩn khi cuộn, chân trang gom vào menu, trích dẫn nguồn.
- [x] L.2 **Thương hiệu 3 môn + linh vật** Mochi (Toán), Mầm (Tiếng Việt), Bibi (Tiếng Anh): kèm 5 skin theo lớp, cảm xúc, bong bóng thoại, bản "đầu" để làm huy hiệu; `learn/mascot-kit.js`, hợp đồng AI [docs/LEARN-MASCOT-AI-CONTRACT.md](docs/LEARN-MASCOT-AI-CONTRACT.md), trang duyệt `learn/mascot-review.html`.
- [x] L.3 **Tích hợp hub và About:** thẻ Học Vui ở hub game, Trái Đất → `/hoc/`, 3 thẻ trên About sáng khi rê, menu "Học Vui/Fun Learning".
- [x] L.4 **Trang học làm lại:** bố cục một màn không cuộn, thanh trên tự thu sau 3 giây, thanh tiến độ có linh vật chạy, câu hỏi canh trái có nhãn nổi, hiệu ứng xuất hiện ngẫu nhiên 10 bộ, đáp án có khung "đang tải".
- [x] L.5 **18 kiểu câu hỏi** ([learn/content/qtypes.js](learn/content/qtypes.js), [learn/qui.js](learn/qui.js)): chọn 1/4, đúng/sai, chọn hình, ghép cặp, sắp xếp, ghép chữ, gõ số, khác loại, chọn nhiều, so sánh, đếm bằng chạm, bắn bong bóng, lật thẻ, trục số, đồng hồ, tìm trong tranh, kéo vào chỗ trống, phân loại; có kéo thả thật. Kiểm thử: `node scripts/learn/check-types.js`.
- [x] L.6 **Âm thanh và cổ vũ:** tiếng chạm, chuông, vỗ tay, pháo giấy, nhạc nền êm có nút tắt; đọc đề khi chạm linh vật (kèm báo khi máy không có giọng đọc).

**Chưa làm / còn nợ (nhớ trước khi báo xong):** `check.js` chưa xanh toàn bộ (lỗi cũ `check-onezone`, CLS), nhiều thay đổi **chưa commit**, nội dung từ vựng và câu cần người duyệt, `check-bank.js` và `check-types.js` chưa nối vào `check.js`, nội dung quảng bá trên landing nhắc tính năng chưa có (gia sư AI, báo cáo Zalo), chưa kiểm tra màn ngang cho các kiểu câu hỏi mới.
