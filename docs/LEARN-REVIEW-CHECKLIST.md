# Checklist tự duyệt Học Vui (theo tiêu chí chủ site)

Cách dùng: trước mỗi lần báo "xong" một hạng mục Học Vui, đối chiếu từng dòng; **đã đo/nhìn ảnh mới được tick**, dòng nào chưa kiểm tra thì để trống và ghi lý do.
Chạy bài đo tự động: `NODE_PATH=<puppeteer-core> node scripts/cozygame/check.js --learn` (thêm `--full` để đo đủ 3 môn × mọi kiểu × màn ngang). Chỉ game: `--games`. Cả hai: không cờ.
Cập nhật lần cuối: 2026-11-19 (tự duyệt sau commit `b603c33`).

## A. Tiêu chí của chủ site nêu trong quá trình làm

### Trải nghiệm của bé
- [x] **Vào là bé học liền** (mở trang là vòng 5 câu bắt đầu, không màn chờ).
- [x] **Nhìn vào biết môn nào, lớp nào**, không cần đọc chữ (linh vật theo môn, số lớp, màu).
- [x] **Câu hỏi dễ đọc**: canh trái từ trên xuống, nhãn môn nổi đè mép bảng; câu ngắn chữ lớn canh giữa; màu chữ rõ.
- [x] **Có tương tác**: 18 kiểu câu hỏi, kéo thả thật, cổ vũ bằng pháo giấy + âm thanh. Đã chơi đúng và sai từng kiểu bằng Chrome thật.
- [x] **Không có gì "sợ"**: nhạc nền đổi sang kiểu nhạc hộp trên hợp âm trưởng, nhỏ, có nút tắt. *Chưa nghe bằng loa thật* nên cần chủ site nghe và duyệt.
- [x] **Âm thanh nhẹ nhàng**: giảm một phần ba âm tách/chuông/vỗ tay. *Cần chủ site nghe.*
- [ ] **Bé thích quay lại mỗi ngày**: cần Vườn có sự sống (kế hoạch mục 2b). Dữ liệu đã có, màn Vườn chưa làm.
- [ ] **Bé khám phá, lộ điểm mạnh, ba mẹ "wow"**: đã ghi tín hiệu ở `learn/garden.js` nhưng chưa nối vào trang học, chưa có Hồ sơ khám phá.
- [ ] **AI tương tác với bé**: chưa có (xem kế hoạch giai đoạn D). Hiện linh vật nói câu soạn sẵn.
- [ ] **Bé học có câu chuyện**: bộ khung truyện đã viết (`docs/LEARN-STORY-BIBLE.md`), chờ chủ site duyệt, chưa soạn chuyến nào.

### Bố cục, canh lề (chủ site nhắc nhiều lần)
- [x] **Một màn hình, không cuộn** ở 390×844, 360×640, 844×390: 90 tổ hợp, không cuộn/tràn.
- [x] **Canh đều hai bên và trên dưới** cho khối đáp án 7 kiểu tương tác (lề trái = lề phải = 0, trên = dưới), padding bảng câu hỏi đều bốn phía (22px, màn thấp 16px).
- [x] **3 linh vật cân đều** trong vòng tròn (đo bằng bbox từng bạn) ở thẻ About, logo, hub. *Hero /hoc/ và hub game mới xem lại một phần.*
- [x] **Cụm nút trên canh phải** ở trang /hoc/ di động; **chân trang gom vào menu**.
- [x] **Không gạch chân menu**.
- [x] **Nút chạm ≥ 44px** (màn dọc): 60 tổ hợp đạt. Màn ngang nút thanh trên 38px, nằm trong khoảng 38–46px mà GAME_RULES cho phép ở màn ngang.
- [ ] **Màn ngang 844×390 xem bằng mắt cho từng kiểu**: mới đo số (không tràn, nút ≥38px), chưa xem ảnh từng kiểu.
- [ ] **iPad, màn rộng**: chưa kiểm tra trang học ở 820/1024/1280.

### Phong cách và nhân vật
- [x] **Linh vật không mờ, không chìm nền** (nền tối có vòng sáng).
- [x] **Phong cách Pop** cho cây, ong, bướm (không viền đen, gradient hai điểm dừng, không filter, hoạt ảnh `npa-*`, tắt khi giảm chuyển động).
- [x] **Đọc được ở 40px** (xem trang duyệt `shared/art/garden/preview-garden.html`).
- [ ] **Chủ site duyệt tranh Vườn** (cây, ong, bướm). Chưa duyệt.
- [ ] **Tranh Vườn ở màn thật** (sau khi có màn Vườn).

### Quy trình
- [x] **Trả lời bằng tiếng Việt.**
- [x] **Kiểm tra bằng trình duyệt thật và tự nhìn ảnh** trước khi báo xong (trừ các dòng đã ghi "chưa").
- [x] **Không push** khi chưa được yêu cầu; **không commit `code.md`**. Đã commit 5 nhóm, chưa push.
- [x] **Ghi kế hoạch và checklist ra tệp** ([plan-learn.md](../plan-learn.md), [plan-learn-garden.md](../plan-learn-garden.md), tệp này).

## B. Quy tắc GAME_RULES áp dụng cho trang học

- [x] Có `<meta name="viewport" ... viewport-fit=cover>`.
- [x] Chữ nằm trong thẻ có nền; không chữ trơn trên nền.
- [x] Nhân vật/biểu tượng không mờ.
- [x] Nút ← ở góc trên-trái, về được trang trước hoặc hub Học Vui.
- [x] Không lỗi console ở 90 tổ hợp.
- [x] Offline: trang học chạy không cần máy chủ; `sw.js` có tệp mới trong danh sách tải sẵn.
- [x] Không gọi máy chủ/AI lúc chơi.
- [ ] **Nút "?" cách chơi**: trang học chưa có nút "?". Các kiểu mới (kéo thả, trục số, lật thẻ) cần hướng dẫn ngắn. *Hiện mỗi câu có một dòng đề bài.*
- [ ] **Quyền riêng tư**: `learn:garden`, `learn:music`, `learn:limit`... là khoá `localStorage` MỚI. GAME_RULES mục 6: thêm khoá lưu máy thì phải cập nhật `privacy.html` (vi + en) và ngày trong `shared/site.js`. **Chưa làm.**
- [ ] **Chơi hộ / thách đấu / Night Pass**: không áp dụng cho Học Vui (chưa quyết có hay không).

## C. Còn nợ kỹ thuật

- [ ] `check.js` phần **game** vẫn đỏ ở các bài cũ không liên quan Học Vui (`check-onezone`... ). Mình không sửa trong phạm vi này. Phần học tập (`--learn`) xanh.
- [ ] `check-landing.js` không chạy được (lỗi cũ).
- [ ] Nội dung từ vựng, câu, nhóm phân loại do mình soạn nhanh: cần người duyệt đối chiếu chương trình.
- [ ] Nội dung quảng bá trên landing nhắc tính năng chưa có (gia sư AI, báo cáo Zalo): rà lại cho khớp thực tế.
- [ ] Hai tệp chưa theo dõi trong git không thuộc Học Vui: `doc.md`, `npicon-preview.html`.
- [ ] Chưa nghe âm thanh bằng loa thật; chưa thử kéo thả bằng ngón tay trên điện thoại thật (chỉ giả lập bằng chuột).

## D. Việc tiếp theo (theo kế hoạch Vườn, Giai đoạn B)

- [ ] Màn **Vườn** (`learn/garden.html`): một màn không cuộn, cây theo kỹ năng, chạm để tưới, ngày/đêm theo giờ máy, ong/bướm/đom đóm ghé thăm.
- [ ] Nối `learn/garden.js` vào trang học: phát thưởng cuối lượt (`endRound`), ghi tín hiệu mỗi câu (`signal`), nút "Xem vườn" ở màn kết quả.
- [ ] Hiển thị phần thưởng cuối lượt: 💧 🌱 🧪 và huy hiệu mới.
- [ ] Cập nhật `privacy.html` cho các khoá lưu máy mới (mục B).
- [ ] Màn "Thử điều mới" và thẻ "Điểm sáng" (Giai đoạn B2).
- [ ] Mỗi mục xong: chạy `check.js --learn`, chụp ảnh 390×844 + 360×640 + 844×390 và tự nhìn.
