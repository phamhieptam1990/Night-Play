# Kế hoạch: Học Vui tách theo lớp, có BÀI HỌC trước BÀI KIỂM TRA, vườn theo lớp và môn

Viết cho chủ sản phẩm duyệt. CHƯA làm gì trong code. Liên quan: [LEARN-NIGHTPASS-PLAN.md](LEARN-NIGHTPASS-PLAN.md) (gói Plus, mục 7 dưới đây nói chỗ giao nhau), [LEARN-GARDEN-LEVELS.md](LEARN-GARDEN-LEVELS.md), [LEARN-STORY-PLAN.md](LEARN-STORY-PLAN.md).

## 1. Vấn đề hiện tại (đối chiếu code)

- `learn/index.html` là **một trang chung**: chọn môn + lớp ở một bộ chọn rồi vào thẳng câu hỏi. Đúng như bạn nói: nó là **bài kiểm tra/luyện tập, không có bài học**. Bé chưa được dạy, chỉ được hỏi (có gợi ý 💡 viết sẵn).
- Chương trình đã có sẵn khung: **Toán 28 chủ đề, Tiếng Việt 20, Tiếng Anh 18** (lớp 1–5, `learn/content/curriculum.js`), tiến độ theo kỹ năng lưu trên máy (`learn:m:<môn>`).
- Khu vườn là **một vườn chung** cho cả ba môn (`learn:farm`, `learn:garden`), mở dần theo nhiệm vụ ngày, chia 3 khu theo loại (chăn nuôi, hoa màu, cây lâu năm), không phân theo lớp hay môn.

## 2. Hành trình mới của bé

```
Trang chủ Học Vui  →  chọn LỚP (1–5)  →  Bản đồ lớp  →  chọn MÔN  →  Danh sách bài (theo chủ đề)
                                            │                                 │
                                   3 khu vườn của lớp                 Bài học → Thử cùng → Bài kiểm tra
                                   (Toán / Việt / Anh)                         (như hiện tại)   ↓
                                                                      thưởng chảy vào KHU VƯỜN của môn đó
```

Mỗi **chủ đề** (ví dụ "Cộng trừ trong phạm vi 10") có một chuỗi: **Học → Thử cùng → Kiểm tra → Thưởng**.

1. **Bài học** (mới): 3–5 màn ngắn, mỗi màn một ý: linh vật giảng bằng hình + ví dụ có hoạt ảnh/tương tác nhỏ (kéo thả, đếm, chạm để ghép), có nút nghe đọc (đã có `voice.js`). Không chấm điểm, không phạt.
2. **Thử cùng** (mới): 2–3 câu có linh vật nắm tay (gợi ý thoải mái, không tính điểm), để bé tự tin trước khi bị kiểm tra.
3. **Bài kiểm tra**: chính là vòng 5 câu hiện tại (`engine.js`, giữ nguyên), mở sau khi bé xong 1 và 2.
4. **Thưởng**: sao + hạt/vật nuôi/cây chảy vào **khu vườn của môn đó trong lớp đó**.

**Cổng học → kiểm tra:** nút "Làm bài kiểm tra" khoá cho tới khi bé xong bài học và "Thử cùng". Chỗ cân nhắc (câu hỏi 3): bé đã giỏi chủ đề thì có cần học lại không? Đề xuất: nếu mức thành thạo hiện có của chủ đề ≥ 2 thì mở sẵn bài kiểm tra, vẫn có nút "Xem lại bài học".

## 3. Cấu trúc trang (mỗi lớp, mỗi môn là một trang riêng)

| Trang | Địa chỉ đề xuất | Nội dung |
|---|---|---|
| Chọn lớp | `/hoc/` (đã có) | 5 thẻ lớp; bé chọn lớp mình (nhớ trên máy, đổi được bất cứ lúc nào) |
| Bản đồ lớp | `/hoc/lop-3/` | 3 khu vườn của lớp (Toán / Tiếng Việt / Tiếng Anh) với tên bé đặt, tiến độ từng khu, nút vào học |
| Trang môn của lớp | `/hoc/lop-3/toan/` | danh sách chủ đề theo thứ tự, mỗi chủ đề hiện trạng thái: 🔒 chưa học · 📖 đã học · ✅ đã qua kiểm tra · ⭐ thành thạo |
| Bài học | `/hoc/lop-3/toan/<chu-de>/` | các màn học → thử cùng → nút kiểm tra |
| Bài kiểm tra | giữ `learn/index.html`, nhận `?grade=3&subject=toan&topic=<id>` | như hiện tại |
| Khu vườn | `/hoc/lop-3/toan/vuon/` | vườn của riêng môn đó (mục 4) |

Nguyên tắc: trang `learn/index.html` hiện tại **không còn là cửa chính** mà chỉ là "phòng kiểm tra". Các đường dẫn `/hoc/toan/` kiểu cũ (trang giới thiệu chương trình cho SEO) giữ nguyên, chỉ thêm nút "Vào học".

## 4. Khu vườn theo lớp và theo môn

**Mô hình:** mỗi lớp có **3 khu vườn** (Toán, Tiếng Việt, Tiếng Anh). 5 lớp → **15 khu vườn**, mỗi khu có dữ liệu riêng (`learn:garden:<lớp>:<môn>`), cùng dùng chung bộ máy vườn hiện có (đất, nhà, ruộng, cây, vật nuôi, kho, ao) nên không phải viết lại từ đầu.

- **Bé tự đặt tên cho từng khu vườn** ("Vườn Sao Toán", "Rừng Mít Ngọt"…). Tối đa 20 ký tự, chọn thêm một biểu tượng; lọc từ nhạy cảm; **nhắc không dùng tên thật hay thông tin cá nhân**; có gợi ý sẵn để bé bấm chọn nếu không muốn gõ. Đổi tên được; tên chỉ lưu trên máy (và trong tệp sao lưu).
- **Mỗi môn một diện mạo** để nhìn là biết: Toán (đảo/ruộng số, cây trái hình khối), Tiếng Việt (rừng chữ, cây ra chữ), Tiếng Anh (vịnh, thuyền, đèn hiệu) theo thế giới trong `LEARN-STORY-BIBLE.md`. Đây là việc **vẽ thêm** (xem mục 9).
- **Phần thưởng đúng chỗ:** qua bài kiểm tra Toán lớp 3 thì thưởng vào Vườn Toán lớp 3, không lẫn môn khác. Lớp mới = khu vườn mới, bắt đầu nhỏ; **vườn lớp cũ vẫn ở đó** để bé ghé lại.
- **Cái dùng chung cho cả bé** (không chia theo lớp): tổng số sao, trang phục, bạn làm vườn đã chọn, bộ sưu tập. Như vậy lên lớp không mất thứ bé yêu thích.
- **Điều kiện mở vườn** đổi từ "nhiệm vụ ngày" sang **tiến độ học của môn đó** (số chủ đề đã qua kiểm tra). Khớp với bảng cấp độ trong `LEARN-GARDEN-LEVELS.md`, tôi sẽ viết lại bảng đó theo hướng mới trước khi làm.
- **Chuyển dữ liệu cũ:** bé đã có vườn hiện tại thì vườn đó thành **"Vườn cũ"** gắn với lớp bé đang chọn (không mất gì), tiến độ kỹ năng giữ nguyên.

## 5. Nội dung bài học (phần tốn công nhất)

| | Số lượng ước tính |
|---|---|
| Chủ đề cần bài học | Toán 28 + Việt 20 + Anh 18 = **66 chủ đề** |
| Mỗi chủ đề | 3–5 màn học + 2–3 câu thử cùng |
| Tổng | khoảng **250–300 màn học** + 150–200 câu thử cùng |

Cách làm: **AI soạn nháp theo khung chương trình GDPT 2018, người duyệt từng bài**, tự soạn không chép sách giáo khoa (bản quyền, `plan-learn.md` F.3). Dạng dữ liệu JSON (giống chuyến phiêu lưu trong `learn/content/trips/`): `{topic, grade, screens:[{kind, text_vi, text_en, art, interact}], tryit:[qid…]}`, kiểm tra tự động (độ dài, từ khó theo lớp, mỗi màn có nghe đọc, có đáp án thử cùng) trước khi người duyệt.

Không thể làm hết một lần. Đề xuất thứ tự: **Toán lớp 1 → Tiếng Việt lớp 1 → Tiếng Anh lớp 1** làm trọn bộ trước (kiểm chứng trải nghiệm), rồi lớp 2, 3, 4, 5.

## 6. Các giai đoạn (mỗi giai đoạn deploy riêng được)

1. **H0. Chốt thiết kế (không code):** bạn duyệt tài liệu này và 5 câu hỏi ở mục 10; tôi viết lại `LEARN-GARDEN-LEVELS.md` theo mô hình mới.
2. **H1. Khung điều hướng:** trang chọn lớp → bản đồ lớp → trang môn, tiến độ theo lớp; kiểm tra tự nhận `?grade&subject&topic`; chưa có bài học thật, bài học tạm là một màn "Ôn nhanh" lấy từ gợi ý 💡 hiện có. Chuyển dữ liệu cũ an toàn, có sao lưu trước.
3. **H2. Bộ máy bài học:** trình phát bài học (màn, ví dụ tương tác, nghe đọc, thử cùng), cổng học → kiểm tra. Làm **3 bài mẫu Toán lớp 1** để bạn xem và chỉnh trước khi soạn hàng loạt.
4. **H3. Khu vườn theo lớp/môn:** tách dữ liệu vườn, đặt tên vườn, mở vườn theo tiến độ môn, Vườn cũ.
5. **H4. Soạn bài học hàng loạt** theo thứ tự ở mục 5 (nhiều đợt nhỏ, mỗi đợt có người duyệt).
6. **H5. Hình vẽ khu vườn theo môn** (Toán/Việt/Anh) và nâng cấp bản đồ lớp.

Mỗi giai đoạn: chụp ảnh Chrome thật ở 360×640, 380×760, ngang 844×390, 1200×640 và tự nhìn; kiểm tra phạm vi đã sửa; tuân thủ `GAME_RULES.md` (một màn hình không cuộn ở trang chọn, nút ←, màn ngang, v.v.).

## 7. Liên hệ với gói Plus

- **Bài học + kiểm tra cơ bản vẫn miễn phí** (Free phải là app học thật sự tốt, đúng nguyên tắc ở `LEARN-NIGHTPASS-PLAN.md`).
- **Plus thêm AI luyện cùng ngay trong bài học**: giảng lại theo cách khác khi bé chưa hiểu, gợi ý từng bước ở "Thử cùng", giải thích đúng lỗi sau bài kiểm tra; cộng với đề thi lớp 6 và báo cáo.
- **Có thể cân nhắc Plus mở thêm vườn trang trí/đặt tên nhiều vườn**, nhưng đề xuất: Free vẫn có đủ 3 vườn mỗi lớp, vì vườn là động lực học chứ không phải thứ để bán.

## 8. Rủi ro

- **Khối lượng soạn bài** là phần lớn nhất; chưa đủ chất lượng thì chưa nên bỏ cổng "học xong mới kiểm tra" cho lớp đó (lớp chưa có bài học vẫn dùng kiểm tra như cũ, có nhãn "sắp có bài học").
- **15 khu vườn** là nhiều tranh vẽ; làm bản đổi màu/đổi họa tiết trước, vẽ riêng sau (H5), theo `docs/MASCOT-ART-RULES.md` cho linh vật.
- **Chuyển dữ liệu cũ** phải thử kỹ: sao lưu tự động trước khi đổi, có nút khôi phục.
- Bé tự đặt tên vườn: phải lọc, không hiển thị tên ra ngoài máy bé; không đưa vào dữ liệu gửi AI.

## 9. Việc phải vẽ thêm

Bản đồ lớp (5 bản, một cho mỗi lớp), nền khu vườn Toán/Việt/Anh, bảng tên vườn có biểu tượng, hình minh hoạ trong bài học (tái dùng linh vật và bộ tranh có sẵn, vẽ thêm theo từng chủ đề).

## 10. Câu hỏi cần bạn chốt (mình đề xuất sẵn)

1. **Mô hình vườn:** mỗi lớp × mỗi môn = một khu vườn riêng đầy đủ (15 vườn), dùng chung bộ máy hiện có? Hay muốn mỗi lớp chỉ một vườn lớn có 3 khu môn? (đề xuất: 15 vườn riêng như bạn mô tả, vườn cũ chuyển thành "Vườn cũ".)
2. **3 khu loại cũ** (chăn nuôi, hoa màu, cây lâu năm) giữ bên trong từng vườn môn, hay thay bằng chủ đề riêng của môn (số, chữ, vịnh)? (đề xuất: giữ bên trong, chỉ đổi diện mạo theo môn.)
3. **Cổng học → kiểm tra:** bắt buộc học trước cho mọi chủ đề, hay mở sẵn kiểm tra nếu bé đã thành thạo (mức ≥ 2)? (đề xuất: mở sẵn nếu đã thành thạo, vẫn có nút xem lại.)
4. **Bé chọn lớp tự do** (xem được lớp khác, ví dụ lớp 5 học trước) hay phụ huynh đặt lớp và khoá? (đề xuất: bé tự chọn lớp mình, lớp khác xem được nhưng nhãn "lớp khác"; phụ huynh có thể ghim lớp.)
5. **Thứ tự soạn bài học:** Toán lớp 1 → Việt lớp 1 → Anh lớp 1 rồi lên lớp trên? Hay làm xong một môn cho cả 5 lớp?
6. **Tên khu vườn mặc định** (khi bé chưa đặt): "Vườn Toán", "Vườn Tiếng Việt", "Vườn Tiếng Anh" hay đặt sẵn tên vui kèm linh vật (Vườn của Mochi/Mầm/Bibi)? (đề xuất: tên theo linh vật, bé đổi được.)
