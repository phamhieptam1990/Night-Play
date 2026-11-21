# Kế hoạch: truyện dẫn bé học, để bé TỰ NGUYỆN muốn học tiếp

Viết cho chủ sản phẩm Học Vui. Bám vào: [LEARN-STORY-BIBLE.md](LEARN-STORY-BIBLE.md) (thế giới, nhân vật, định dạng chuyến, quy tắc an toàn), [../plan-learn-garden.md](../plan-learn-garden.md) (Vườn làm lõi, phiêu lưu làm lớp truyện), `learn/adventure.js`, `learn/farm.js`.

## 1. Hiện trạng và khoảng trống

| Đã có | Chưa có |
|---|---|
| Thế giới Vườn Cầu Vồng, 3 vùng, 4 nhân vật, quy tắc an toàn, định dạng chuyến JSON (đều là bản nháp chờ duyệt) | **Không có chuyến nào được viết** (`learn/content/trips/` chưa tồn tại) |
| `adventure.js`: 3 chương/môn, mỗi chương 5 "chặng" là chữ nhãn | Truyện thật: không có lời kể, mạch, bất ngờ, kết |
| Phần thưởng: sao, hạt giống, trang phục, nhiệm vụ ngày | Lý do để bé **muốn biết chuyện gì xảy ra tiếp**; việc học chưa là phần của truyện |
| Hệ gợi ý 💡, mức thành thạo 4 bậc, trang phụ huynh, giọng đọc `voice.js` | Bé chưa có **lựa chọn** và chưa có **người bạn cần mình** |

Nói thẳng: sao và trang phục là động lực **bên ngoài**; chúng giữ bé được một thời gian rồi nhạt dần. Truyện chỉ có tác dụng nếu việc học **là cách để đi tiếp câu chuyện**, không phải thứ chen vào giữa.

## 2. Nguyên tắc để bé tự nguyện (và những điều không làm)

Dựa trên ba nhu cầu bên trong của trẻ (tự chủ, thấy mình giỏi lên, gắn bó với ai đó) cộng tò mò:

1. **Tự chủ:** bé chọn nhánh đi, chọn người bạn đồng hành hôm nay, chọn dừng bất cứ lúc nào (điểm nghỉ ở mỗi cảnh).
2. **Thấy mình giỏi lên:** thế giới đổi theo việc bé học (cầu vồng sáng thêm một màu), không chỉ số sao tăng.
3. **Gắn bó:** có một nhân vật **cần bé giúp và học từ bé** (Bạn Mây, xem mục 3). Dạy lại người khác là cách học sâu và là động lực mạnh với trẻ tiểu học.
4. **Tò mò:** mỗi tập khép gọn nhưng gợi một câu hỏi nhỏ cho tập sau.
5. **Học là chìa khoá của truyện:** mỗi câu hỏi là một "lời nhờ" của nhân vật (đếm đủ đom đóm để thắp đèn, ghép chữ để đọc thư), không phải câu hỏi rời.

**Không làm** (khớp mục 4 của bộ khung và `plan-learn-garden.md` mục 6): không mất chuỗi ngày khi nghỉ, không đồng hồ đếm ngược, không "nhanh kẻo mất", không so sánh với bé khác, không kẻ xấu đáng sợ, không khoá tập theo giờ. Tập kế **luôn mở ngay** nếu bé muốn nghe tiếp.

## 3. Mạch truyện Mùa 1: "Bạn Mây đến vườn"

**Mở đầu.** Một sáng, cầu vồng của Vườn Cầu Vồng nhạt hết màu. Bác Rễ nói: bảy hạt màu bị một cơn **Gió Tinh Nghịch** (hay nghịch, không xấu) thổi đi khắp ba vùng. Cùng lúc, một bạn nhỏ làm bằng mây, **Bạn Mây**, rơi xuống vườn: bạn chưa biết đếm, chưa biết đọc, chưa biết nói "Hi!". Bạn Mây hỏi bé đủ thứ và học từ bé.

**Cấu trúc 21 tập = 7 sắc màu × 3 chìa.** Mỗi màu cần ba chìa: **Chìa Số** (Toán, Mochi), **Chìa Chữ** (Tiếng Việt, Mầm), **Chìa Từ** (Tiếng Anh, Bibi). Trong một màu, bé **tự chọn thứ tự** ba tập (tự chủ), tìm đủ ba chìa thì màu đó trở về cầu vồng. Cách này tự nhiên đưa bé qua cả ba môn mà không ép.

**Hậu cảnh bí ẩn nhỏ.** Mỗi tập để lại một manh mối nhẹ về Bạn Mây ("Bạn Mây nhớ có tiếng chuông, ở đâu nhỉ?"). Tập cuối: Bạn Mây là **tiếng cười của vườn** từng bị lạc; bé đã dạy bạn ấy mọi thứ nên bạn ấy ở lại. Nội dung kết hợp nhật ký trong trang phụ huynh (mục 6).

**Một câu chuyện cho mọi lớp.** Lời kể ở mức lớp 1–2 và có nút nghe đọc (`voice.js`). **Độ khó lấy từ lớp của bé qua bộ sinh câu** (đã có), không viết lại truyện theo lớp. Bé lớn có thêm dòng "nhật ký" tùy chọn.

## 4. Một tập chơi như thế nào (≈ 5 phút = đúng một vòng 5 câu hiện có)

| Cảnh | Nội dung | Gắn với hệ thống có sẵn |
|---|---|---|
| 1 Mở | Thư của Bạn Mây hoặc lời Bác Rễ, nêu vấn đề nhỏ | Giọng đọc, linh vật |
| 2–4 | Ba thử thách, mỗi cái là "lời nhờ" (≥ 4 kiểu khác nhau cả tập, không kiểu nào quá 2 lần) | `LearnTypes` kiểu `count`, `order`, `numline`, `pic`, `dragfill`, `dictate`…; câu do bộ sinh tạo theo lớp |
| Điểm chọn | Bé chọn lối (cầu gỗ hay suối) = chọn kỹ năng luyện, cùng đích | Tự chủ |
| 5 Kết | Hạt màu hiện ra, Bạn Mây reo, manh mối cho tập sau | Phần thưởng, bổ sung vườn |

Sai thì nhân vật **thử cách khác** (gợi ý 💡 theo bậc), không đưa đáp án, không chê. Có **điểm nghỉ** ở mỗi cảnh (lưu và tiếp tục lần sau).

**Cảnh "Giờ dạy Bạn Mây"** (mới): khi một kỹ năng của bé đạt mức Vận dụng (mức 3), mở một cảnh Bạn Mây làm sai và bé giúp sửa (dùng kiểu `find_error` hoặc chọn đáp án). Đây vừa là bằng chứng thành thạo vừa là động lực gắn bó.

## 5. Quy trình sản xuất nội dung (36 → 21 tập ban đầu)

Theo mục 8 của bộ khung, nhưng **thu gọn cho kịp thực tế**:

1. **Soạn khung 21 tập** (tên, màu, vùng, kỹ năng, ba kiểu thử thách, manh mối): 1 tệp, người duyệt xem một lần.
2. **AI soạn từng tập** thành `learn/content/trips/<id>.json` theo đúng định dạng, kèm **một tập mẫu viết tay** để bắt chước giọng.
3. **Tập lệnh kiểm** `scripts/learn/check-trips.js` (làm mới): đủ vi/en, độ dài câu (lời linh vật ≤ 40 ký tự, lời kể ≤ 90), ≥ 4 kiểu thử thách, kỹ năng có thật, không từ cấm (mục 4 của bộ khung), `onWrong` không chứa đáp án, kết thúc vui.
4. **Người duyệt** (phụ huynh hoặc giáo viên) đọc to từng tập theo checklist mục 7 của bộ khung. **Duyệt trước 3 tập thử**, sửa giọng, rồi mới soạn 18 tập còn lại.
5. Xuất bản thành tệp tĩnh. AI **không** viết trực tiếp cho bé lúc đang chơi.

## 6. Việc kỹ thuật theo giai đoạn

| GĐ | Việc | Kết quả kiểm được | Quy mô |
|---|---|---|---|
| 0 | Chốt quyết định mục 8, duyệt bộ khung và mạch Mùa 1 | Văn bản duyệt | 1–2 ngày (cần bạn) |
| 1 | **Máy chơi truyện** `learn/story.js`: nạp JSON, chạy cảnh (đọc to, lời linh vật, thử thách qua `LearnTypes`, onRight/onWrong, điểm nghỉ, thưởng); thay `adventure.js` bằng chỉ mục tập; **1 tập mẫu viết tay** | Chơi hết 1 tập trên điện thoại; `check-trips.js` + kiểm giao diện đạt | ~1 tuần |
| 2 | Soạn và duyệt **3 tập thử**, rồi 18 tập còn lại | 21 tập qua kiểm và qua người duyệt | 1–2 tuần (phụ thuộc người duyệt) |
| 3 | **Bạn Mây + cầu vồng 7 màu**: tranh theo [MASCOT-ART-RULES.md](MASCOT-ART-RULES.md) (phong cách Pop), cầu vồng sáng dần theo tập, cảnh "Giờ dạy Bạn Mây" | Cầu vồng đổi theo tiến độ; bé dạy được Bạn Mây | 1–2 tuần (phụ thuộc tranh) |
| 4 | **Trang phụ huynh**: tóm tắt tập hôm nay + một câu gợi ý nói chuyện với bé ("Hôm nay Mochi đếm đom đóm. Hỏi bé: …"); nút nghe lại truyện | Phụ huynh đọc được "bé học gì, nói gì với bé" | ~3 ngày |
| 5 | **Chạy thử với 5–10 bé** (có đồng ý của phụ huynh), đo mục 7, sửa | Báo cáo thử nghiệm | 2–3 tuần theo lịch bé |

## 7. Đo "tự nguyện" mà không dùng mẹo níu kéo

Đo **hành vi tự chọn**, không đo thời lượng:

- Tỉ lệ bé **bấm "nghe tiếp"** khi có thể dừng sau mỗi tập.
- Tỉ lệ bé **quay lại hôm sau** khi không có thông báo nào.
- Số tập hoàn thành/tuần; tỉ lệ bỏ **giữa** tập (cao = tập dài hoặc khó).
- Nhánh bé hay chọn; có ba môn đều được chơi không hay chỉ một môn.
- Sau tập, một câu hỏi bé trả lời bằng mặt cười (tùy chọn): "Bé thấy thế nào?".
- Phụ huynh: "Bé có tự đòi chơi không?" (một câu hỏi, cuối tuần).

Mục tiêu số **chưa đặt trước khi thử**; sau lượt thử đầu mới đặt ngưỡng thực. So với nền hiện tại (số vòng/ngày chưa có truyện) để biết truyện có làm khác không.

## 8. Cần bạn quyết (có đề xuất mặc định)

1. **Mạch "Bạn Mây đến vườn" + 7 màu × 3 chìa** có được không, hay muốn mạch khác? *(đề xuất: dùng)*
2. **Một truyện chung cho mọi lớp**, độ khó theo lớp qua bộ sinh câu, hay viết truyện riêng từng lớp? *(đề xuất: chung, đỡ gấp 5 lần nội dung)*
3. **Ai duyệt nội dung** từng tập (bạn, phụ huynh khác, giáo viên)? Cần ít nhất một người đọc to từng tập.
4. **Tranh Bạn Mây và cầu vồng**: bạn có họa sĩ, hay dùng quy trình vẽ theo MASCOT-ART-RULES? Giai đoạn 3 phụ thuộc điểm này.
5. **Bé thử nghiệm:** có 5–10 bé (con, cháu, lớp quen) để chạy thử ở giai đoạn 5 không?
6. Có **thu âm giọng thật** cho nhân vật (đã có chỗ thả tệp mp3 trong `voice.js`) hay dùng giọng máy trước?

## 9. Rủi ro

- **Truyện AI soạn dễ chung chung**: giảm bằng tập mẫu viết tay, duyệt 3 tập thử trước, đọc to khi duyệt.
- **Truyện thành rào cản**: tập quá dài, bé chỉ muốn làm bài → giữ ≤ 5 phút, cho "bỏ qua lời kể", đo tỉ lệ bỏ giữa tập.
- **Chi phí tranh** lớn hơn dự tính → giai đoạn 1–2 chạy được với tranh linh vật có sẵn, tranh Bạn Mây làm sau.
- **Không đạt kỳ vọng "bé tự nguyện"**: truyện giúp nhưng không bảo đảm; vì vậy có bước thử nghiệm thật ở giai đoạn 5 trước khi mở rộng.
