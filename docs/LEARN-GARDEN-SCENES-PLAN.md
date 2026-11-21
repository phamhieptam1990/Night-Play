# Kế hoạch cảnh khu vườn: mỗi môn MỘT cảnh, lên lớp thì mở thêm cảnh

Viết cho chủ site duyệt. **Chưa vẽ gì.** Quyết định của chủ site (2026-11-21): mỗi môn 1 cảnh; lớp 1 là cảnh như hiện tại, lên lớp 2 thì mở thêm cảnh; chủ đề ba cảnh là Vườn Số (Toán), Rừng Chữ (Tiếng Việt), Vịnh Từ (Tiếng Anh) theo [LEARN-STORY-BIBLE.md](LEARN-STORY-BIBLE.md). Hiện tại cả 15 vườn (5 lớp × 3 môn) đang dùng chung MỘT bộ tranh nên chưa có gì để duyệt.

## 1. Mô hình (đã chốt: GIỮ 15 vườn, mỗi vườn một cảnh theo môn)

Chủ site (2026-11-21): **không gộp 15 vườn thành 3**, vì bé không nhất thiết học từ lớp 1 (bé đang lớp 3 vào trang thì phải có ngay vườn lớp 3 đầy đủ cảnh, không phải đi qua lớp 1 và lớp 2).

- Vẫn **5 lớp × 3 môn = 15 vườn**, mỗi vườn dữ liệu riêng như đang chạy (không đổi `slot.js`, không phải chuyển dữ liệu).
- **Cảnh của vườn = cảnh của môn + phần mở rộng đến đúng lớp đó (cộng dồn):**
  - Lớp 1: cảnh gốc của môn (như vườn hiện tại).
  - Lớp 2: cảnh gốc + phần mở rộng lớp 2.
  - Lớp 3: cảnh gốc + mở rộng lớp 2 + mở rộng lớp 3. Bé vào thẳng lớp 3 thấy ngay cảnh lớp 3 đầy đủ.
  - Tương tự lớp 4, 5.
- Phần cảnh mở rộng là **đất và công trình trang trí có sẵn**; đất trồng, cây, vật nuôi, nhà xây vẫn do bé mở dần bằng việc học của lớp đó như hiện tại.
- Bé lên lớp thì sang vườn lớp mới (cảnh lớn hơn, bắt đầu mới); vườn lớp cũ vẫn ở đó để ghé lại.

## 2. Ba cảnh

| Môn | Cảnh | Công trình nổi bật (thêm dần theo lớp) | Màu chủ đạo |
|---|---|---|---|
| Toán | **Vườn Số** (đồng quê hiện tại làm gốc) | Cảnh gốc (lớp 1): nhà + ruộng như cũ · thêm dần: L2 bảng số, đồng hồ lớn · L3 cầu thang số · L4 sông chia đều + cầu · L5 đài thiên văn nhỏ (cộng dồn) | xanh lá + xanh dương |
| Tiếng Việt | **Rừng Chữ** | L1: cây ra chữ quanh nhà · L2: thư viện trong hốc cây · L3: suối kể chuyện + cầu đá · L4: lều đọc sách · L5: cổng thành chữ | cam vàng + đỏ cam |
| Tiếng Anh | **Vịnh Từ** | L1: bến nhỏ + thuyền · L2: đèn hiệu nói "Hi!" · L3: phố chợ ven vịnh · L4: cảng + cầu tàu · L5: tháp chuông + bản đồ thế giới | xanh dương + tím |

Mỗi cảnh giữ khung kỹ thuật của vườn hiện tại (isometric 1280×880, đất theo ô, 7 giai đoạn xây, các buổi trong ngày) để toàn bộ cây, vật nuôi, ô đất, nhà, kho, ao chạy được mà không phải viết lại bộ máy vườn.

## 3. Cách làm để vừa sức và nhất quán

Không vẽ lại ~60 tranh cho mỗi cảnh từ đầu. Sửa bộ sinh tranh `scripts/learn/gen-scene-art.js`:
1. Thêm tham số **chủ đề** (bảng màu đất, cỏ, nước, trời + bộ công trình nổi bật của môn) → sinh ra đủ các giai đoạn và buổi trong ngày cho từng môn.
2. Thêm **lớp mở rộng** (`extra-2…5`): phần đất và công trình thêm vào, xếp ở các góc còn trống của cảnh, bật dần theo lớp bằng lớp phủ riêng (không vẽ lại cảnh nền).
3. Phong cách POP "đồ chơi mềm", cùng bộ icon và linh vật đã duyệt (`docs/MASCOT-ART-RULES.md`).

## 4. Các bước và điểm duyệt

1. **V0. Chốt mô hình**: xong (giữ 15 vườn, cảnh theo môn + mở rộng cộng dồn theo lớp).
2. **V1. Mẫu để duyệt:** 3 cảnh gốc lớp 1 (Toán/Việt/Anh, giai đoạn "đủ đồ", ban ngày) + 1 ảnh cảnh lớp 3 (đã cộng dồn mở rộng lớp 2 và 3) cho mỗi môn. Trang duyệt riêng, có link trong thanh "Duyệt Học Vui". **Chủ site duyệt phong cách trước khi vẽ tiếp.**
3. **V2. Sinh đủ bộ** cảnh gốc theo chủ đề: các giai đoạn xây × các buổi trong ngày, cho 3 môn.
4. **V3. Lớp phủ mở rộng 2–5** cho 3 môn (12 lớp phủ); cảnh của vườn lớp g = gốc + các lớp phủ 2..g.
5. **V4. Nối cảnh vào vườn:** vườn (lớp, môn) tự chọn bộ tranh theo môn và bật các lớp phủ đến lớp đó; không đổi dữ liệu vườn.
6. **V5. Kiểm tra** bằng Chrome thật ở các cỡ màn, cập nhật bài đo vườn.

## 5. Rủi ro
- Khối lượng tranh lớn: giảm bằng bộ sinh có tham số và lớp phủ cộng dồn (không vẽ 15 cảnh riêng); duyệt mẫu sớm (V1).
- Cảnh lớp cao to hơn phải giữ "một màn hình không cuộn" ở màn nhỏ: cảnh vẫn kéo/zoom như hiện tại, phần mở rộng đặt ở rìa, không làm đổi vùng chơi chính.
- Bé vào thẳng lớp cao phải thấy cảnh đẹp ngay, không bị trống: vì thế phần mở rộng là đồ trang trí có sẵn, không phụ thuộc đã học lớp thấp.
