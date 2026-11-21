# Checklist thực hiện sau khi hoàn thành engine

Nguồn mục tiêu: `doc/toan.md` (từ MASTER lớp 1 và bảng lớp 2–5 chủ site cung cấp), `doc/tieng-viet.md` (lớp 1–5), `doc/tieng-anh.md` (**bản nháp**, cần đối chiếu chương trình chính thức).

Quy ước: `[x]` đã xong · `[ ]` chưa làm. Chỉ chạy kiểm tra của Học Vui (`scripts/learn/*.js`), không chạy `check.js` toàn repo.

---

## A. Việc chung (mọi môn)

- [x] Nhập nội dung vào `doc/toan.md` và `doc/tieng-anh.md` (bản nháp, cần chủ site rà soát).
- [ ] Mỗi kỹ năng mới có đủ: bộ sinh/bank, chủ đề trong `TOPIC`, tên trong `parent-copy.js`, mã lỗi (nếu có) có lời giải thích vi/en.
- [ ] Mỗi mã lỗi mới có đủ 3 chỗ: `TAGS` (engine.js), `TAG` (parent-copy.js, 6 chuỗi), `tag`/`hint` vi+en (index.html).
- [ ] Chạy đủ bốn bộ kiểm: `check-bank`, `check-types`, `check-parent`, `check-garden` (+ `check-mathskills`).
- [ ] **Chưa làm:** mở trình duyệt thật chơi thử từng môn × từng lớp 1–5, tự nhìn ảnh (câu có SVG, bảng, emoji, nút không tràn chữ).
- [ ] Kiểm tra trang phụ huynh hiện tên kỹ năng mới và mã lỗi mới.
- [ ] Kiểm tra vườn: kỹ năng mới có thể gieo, tên hiển thị đúng.
- [ ] Màn hình nhỏ (điện thoại): câu có `<br>` / bảng không phải cuộn ngang.
- [ ] Giọng đọc (`voice.js`): câu có SVG/emoji đọc được phần chữ, không đọc ký hiệu lạ.
- [ ] Cập nhật `docs/LEARN-REVIEW-CHECKLIST.md` nếu có mục mới cần người duyệt.
- [ ] Commit theo từng nhóm; chưa push khi chưa được yêu cầu; không commit `code.md`.

---

## B. Toán lớp 1–5

### B1. Engine (đang làm)
- [x] Bước A: 5 kỹ năng theo dõi (`count_obj`, `number_line`, `compare_num`, `order_num`, `clock_read`).
- [x] 18 kỹ năng mới vào `SK` + `TOPIC`: `place_value`, `round_num`, `expr_order`, `unknown_num`, `shape_id`, `angle_type`, `perimeter`, `area_shape`, `volume_box`, `unit_convert`, `measure_compare`, `time_calc`, `money_calc`, `motion`, `word_multi`, `data_read`, `fraction_of`, `pattern_seq`.
- [x] 7 mã lỗi mới (đã có lời giải thích vi/en ở parent-copy.js và index.html): `place_value`, `unit_convert`, `formula_confuse`, `order_ops`, `read_chart`, `concept_confuse`, `pattern_miss`.
- [x] `scripts/learn/check-mathskills.js`: tự tính lại đáp án độc lập (không dùng lại công thức của bộ sinh).

### B2. Đối chiếu mục tiêu theo lớp
| Mảng | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| Số, giá trị chữ số | `place_value` | ✓ | ✓ | ✓ | ✓ thập phân |
| Làm tròn | | `round_num` | ✓ | ✓ | ✓ |
| Cộng/trừ/nhân/chia | có sẵn | có sẵn | có sẵn | có sẵn | có sẵn |
| Biểu thức, thứ tự phép tính | `expr_order` | ✓ | ✓ nhân trước | ✓ ngoặc | ✓ |
| Tìm số chưa biết | `unknown_num` | ✓ | ✓ | ✓ | ✓ thập phân |
| Hình phẳng/khối | `shape_id` | `shape_id` | `angle_type` | `angle_type` | |
| Chu vi | | | `perimeter` | ✓ | ✓ hình tròn |
| Diện tích | | | `area_shape` | ✓ | ✓ tam giác, thang, tròn |
| Thể tích | | | | | `volume_box` |
| Đo độ dài/khối lượng | `measure_compare` | `unit_convert` | ✓ | ✓ | ✓ thập phân |
| Thời gian | `time_calc` | ✓ | ✓ | ✓ | ✓ |
| Tiền Việt | `money_calc` | ✓ | ✓ | ✓ | |
| Chuyển động | | | | | `motion` |
| Toán đố nhiều bước | có `word_addsub` | ✓ | `word_multi` | ✓ | ✓ tỉ số, % |
| Dữ liệu | `data_read` | ✓ tranh | ✓ bảng | ✓ trung bình | ✓ % |
| Phân số | | | `fraction_of` | ✓ cộng cùng mẫu | ✓ khác mẫu |
| Quy luật | `pattern_seq` | ✓ | ✓ | ✓ | ✓ |

### B3. Phần bổ sung (đã làm / còn lại)
- [x] **Bốn mức thành thạo** Hiểu · Thực hiện · Vận dụng · Thành thạo (`mastery4` trong engine; hiện ở trang phụ huynh): bậc 3 cần đúng ở >= 2 dạng câu khác nhau; bậc 4 cần học >= 2 ngày khác nhau và >= 6 câu đúng không dùng gợi ý. Ngưỡng là cấu hình thử nghiệm (`E.M4`).
- [x] **Gợi ý 💡 theo bậc cho MỌI kỹ năng** (phép tính: `hint.js`; còn lại: `hint-texts.js`, vi/en; bậc 3 mờ bớt 2 đáp án sai hoặc cho biết số chữ số). Có bài kiểm độ phủ 100% và không lộ đáp án.
- [x] **Lập luận:** kiểu "tìm lỗi sai trong lời giải" (`find_error`, lớp 2–5): bé chỉ ra bước sai, đáp án tự tính lại độc lập.
- [x] Phân số bằng nhau, so sánh, rút gọn (`fraction_equiv`, L4–5); số La Mã (`roman`, L3); số đo góc (`angle_measure`, L4–5).
- [ ] Hình minh họa hình học nâng cao (đa giác, hình khối 3D); biểu đồ cột vẽ thật.
- [ ] Kiểu câu "giải thích cách làm" bằng lời viết (cần chấm nội dung, không có AI lúc chạy).

---

## C. Tiếng Việt lớp 1–5

Nguồn mục tiêu: `tieng-viet.md`. Kỹ năng hiện có: **16** (4 cũ + 12 mới, + 2 theo dõi: sắp xếp từ thành câu, ghép chữ). Bộ sinh và dữ liệu ở `learn/lang-skills.js`, bài kiểm tự đối chiếu luật ở `scripts/learn/check-lang.js`.

### C1. Làm bằng trắc nghiệm / kéo thả
- [x] **Đọc (L1):** `letter_start` (chữ cái đầu), `syllable_blend` (ghép vần, dấu thanh).
- [x] **Chính tả (L1–5):** `spell_ngh` (ng/ngh, g/gh, c/k theo quy tắc), `spell_init` (s/x, d/gi/r, l/n có hình), `spell_chtr`, `tone` (cũ).
- [x] **Từ vựng (L2–5):** `synonym`, `antonym_pair`, `idiom` (thành ngữ, tục ngữ L4–5), `antonym` (cũ).
- [x] **Ngữ pháp (L2–5):** `word_class` (từ chỉ sự vật / hoạt động / đặc điểm; danh từ, động từ, tính từ L4–5), `punct` (dấu câu, dấu phẩy), `sent_type` (kể, hỏi, cảm, khiến).
- [x] **Viết câu (L1–5):** `sent_order` (sắp xếp từ thành câu, theo dõi tiến độ), `word_build` (ghép chữ).
- [x] **Đọc hiểu (L1–5):** `reading_story` (13 đoạn ngắn theo lớp, câu hỏi ai / ở đâu / mấy / khi nào), `reading_short` (cũ).
- [x] **Giao tiếp (L1–2):** `greeting_vi` (chào hỏi, cảm ơn, xin lỗi, chúc mừng).
- [x] Mã lỗi riêng Tiếng Việt: `word_class`, `punct`, `sent_type` (có giải thích cho phụ huynh).
- [x] **Văn học (L1–5):** `story_lit` (12 câu hỏi từ 8 truyện ngắn: nhân vật, cảm xúc, thông điệp). [ ] Còn thiếu: thơ, nhiều truyện hơn và rà soát nội dung.
- [x] **Sắp xếp các câu thành đoạn (L3–5):** `para_order` (6 đoạn, 3–4 câu, có từ nối thứ tự). [ ] Dàn ý (L5, tự học).
- [ ] Mở rộng ngân hàng đọc hiểu (hiện 13 đoạn): thêm đoạn dài hơn, văn bản thông tin (L4–5), câu hỏi suy luận.
- [ ] Hỏi / ngã, l/n, thêm nhiều từ chính tả (hiện mỗi nhóm 5–7 từ có hình).

### C2. Nghe · Nói · Viết (đã làm phần khả thi; phần còn lại cần tính năng ngoài phạm vi)
- [x] **Nghe:** nghe giọng đọc (`voice.js`) rồi chọn hình / số / câu trả lời: `vi_listen_word`, `en_listen_word`, `en_listen_num`, `en_listen_reply`. Câu Nghe tự đọc sau cú chạm đầu tiên.
- [x] **Nghe–viết (chính tả):** nghe từ rồi gõ lại (`dictate_vi` lớp 1–3, `dictate_en` lớp 2–5).
- [x] **Viết câu:** gõ một câu theo chủ đề; chấm theo **tiêu chí hình thức** (đủ số từ, chữ đầu viết hoa, có dấu kết thúc, không chữ số), có lời nhắc đúng lỗi (`write_vi` lớp 2–5, `write_en` lớp 3–5). **Không chấm nội dung** vì không có AI lúc chạy.
- [x] **Nói (đọc to):** nghe câu mẫu, bé đọc thành tiếng rồi **tự báo** đã đọc (`speak_vi`, `speak_en`). Ghi chú rõ là tự báo; không có nhận dạng giọng nói.
- [ ] **Viết chữ (L1):** tô chữ trên canvas.
- [ ] **Viết đoạn, viết bài (L2–5) chấm nội dung / mạch lạc:** cần chấm bằng người hoặc AI.
- [ ] **Đọc thành tiếng chấm tốc độ, ngữ điệu; kể chuyện, thuyết trình:** cần nhận dạng giọng nói và cân nhắc quyền riêng tư.

---

## D. Tiếng Anh lớp 1–5

Nguồn mục tiêu: `tieng-anh.md` (**bản nháp**, cần chủ site đối chiếu chương trình chính thức). Kỹ năng hiện có: **16** (4 cũ + 12 mới).

- [x] **Từ vựng:** `en_colors`, `en_numbers` (1–100, có đếm hình), `en_topic_vocab` (cơ thể, đồ ăn, quần áo, trường, thời tiết, phương tiện), `en_meaning` (nghĩa tiếng Việt), `vocab_animals`, `vocab_things` (cũ).
- [x] **Ngữ pháp:** `en_a_an`, `en_plural` (đều và bất quy tắc), `en_present_s` (thêm -s/-es), `en_wh` (What, Where, Who, How many, What time, Why, When), `be_verb` (cũ).
- [x] **Thứ và tháng:** `en_days`.
- [x] **Chính tả:** `en_spelling` (nhiễu sinh tự động: đảo, thiếu, thừa chữ).
- [x] **Chào hỏi:** `en_greeting`.
- [x] **Đọc hiểu (L3–5):** `en_reading` (7 đoạn ngắn), `dialogue` (cũ).
- [x] Theo dõi: `sent_order_en`, `word_build_en`.
- [x] Mã lỗi `en_rule` (quy tắc tiếng Anh) có giải thích cho phụ huynh.
- [x] **Nghe** (`en_listen_*`), **Nghe–viết** (`dictate_en`), **Viết câu** (`write_en`, chấm hình thức), **Đọc to** (`speak_en`, tự báo), **Sắp xếp câu** (`sent_order_en`).
- [ ] Lớp 1–2 còn ít kỹ năng (mỗi lớp 4–5): thêm chủ đề gia đình, đồ chơi, hành động; bài hát, trò chơi.
- [ ] Rà soát toàn bộ dữ liệu bằng người bản ngữ hoặc giáo viên tiếng Anh.

---

## E. Thứ tự đề xuất

1. Hoàn thành engine Toán + kiểm + xem trình duyệt (đang làm).
2. Commit riêng cho Toán.
3. Tiếng Việt C1: chính tả, từ vựng, ngữ pháp, đọc hiểu (nhiều nhất, không cần UI mới).
4. Tiếng Việt C2: kiểu câu "nghe rồi chọn".
5. Nhập `toan.md` / `tieng-anh.md`, làm Tiếng Anh theo cùng cách.
6. Mastery 4 mức và hint ladder cho cả ba môn.
