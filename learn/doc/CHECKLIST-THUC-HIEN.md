# Checklist thực hiện (chỉ còn mục chưa xong)

Nguồn mục tiêu: `doc/toan.md` (từ MASTER lớp 1 và bảng lớp 2–5 chủ site cung cấp), `doc/tieng-viet.md` (lớp 1–5), `doc/tieng-anh.md` (**bản nháp**, cần đối chiếu chương trình chính thức).

Quy ước: `[ ]` chưa làm · mục đã xong thì xoá khỏi file (lịch sử nằm trong git). Chỉ chạy kiểm tra của Học Vui (`scripts/learn/*.js`), không chạy `check.js` toàn repo.

---

## A. Việc chung (mọi môn)

- [ ] Thiếu file giọng thu sẵn trong `shared/audio/voice/` (chỉ có `index.json`): nghe–viết, đọc to báo `ERR_FAILED` khi tải clip; `check-ui-math.js --shots` chỉ chụp màn bật loa nên chưa dùng để duyệt câu.

---

## B. Toán lớp 1–5

- [ ] Hình minh họa hình học nâng cao (đa giác, hình khối 3D) và biểu đồ quạt SVG thật (câu đọc bảng đã có biểu đồ thanh ngang). Biểu đồ SVG ngang bị `fitQ` co về hình vuông tối thiểu 44px trong khung câu cố định nên cần thiết kế lại khung câu.
- [ ] Kiểu câu "giải thích cách làm" bằng lời viết (cần chấm nội dung, không có AI lúc chạy).

---

## C. Tiếng Việt lớp 1–5

- [ ] Văn học (`story_lit`): giáo viên rà soát nội dung truyện, thơ (xem `docs/LEARN-REVIEW-CHECKLIST.md` mục F).
- [ ] Dàn ý (L5, tự học).
- [ ] Tô chữ lớp 1 (`trace`): chưa thử bằng ngón tay trên điện thoại thật; mới có chữ cái thường, chưa tô số hay chữ hoa.
- [ ] Viết đoạn, viết bài (L2–5) chấm nội dung / mạch lạc: cần chấm bằng người hoặc AI.
- [ ] Đọc thành tiếng chấm tốc độ, ngữ điệu; kể chuyện, thuyết trình: cần nhận dạng giọng nói và cân nhắc quyền riêng tư.

---

## D. Tiếng Anh lớp 1–5

- [ ] Bài hát, trò chơi cho lớp 1–2.
- [ ] Rà soát toàn bộ dữ liệu bằng người bản ngữ hoặc giáo viên tiếng Anh.

---

TTS - Voice đề xuất
VieNeu-TTS v3 Turbo

link https://huggingface.co/spaces/hynt/F5-TTS-Vietnamese-100h
