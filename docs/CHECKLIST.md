# Checklist Học Vui

Cập nhật: 2026-11-24 (đã dọn mục xong). Quy ước: `[x]` xong · `[ ]` chưa làm · `[~]` đang làm · `[?]` chờ chủ site duyệt. Xong mục nào thì đổi ký hiệu mục đó (sửa đúng một dòng).

## Học Vui Plus (G1–G6): còn lại chờ người/bên ngoài (phần cục bộ đã xong, tắt mặc định)

- [ ] Chạy migration 009 trên Neon rồi mới đặt `LEARN_PLUS=on` — cần quyền database sản xuất (chưa chạy: gói này không deploy)
- [ ] Thử thanh toán thật bằng đơn `learn_test` 1.000đ (`LEARN_TEST_PRICE=on`) qua SePay — cần tài khoản SePay/ngân hàng; chưa đụng thanh toán thật
- [ ] Khôi phục Plus bằng email (OTP) khi đổi máy, và xác nhận email trước khi cấp dùng thử — `/api/restore` mới chỉ khôi phục Night Pass; cần gửi email thật để thử
- [ ] Trang admin: cấp/thu hồi Plus thủ công, xem đơn Plus — làm khi mở bán
- [x] Nối AI luyện cùng vào trang học (learn/js/coach-link.js): bé sai lần đầu → giải thích, bấm 💡 → gợi ý AI cạnh gợi ý viết sẵn; đã kiểm bằng Chrome thật (AI giả lập). Plus tắt thì không đổi gì; mới hỗ trợ câu chọn đáp án và gõ số
- [ ] AI thật: đặt `LEARN_AI_KEY`, xác nhận mã mô hình, chạy thử nhóm nhỏ, đọc mẫu lời AI, đo chi phí thật, chốt giá và hạn mức — cần khoá API Anthropic + người; mô phỏng không cho số chi phí


## Bộ sưu tập Bạn Số & Bạn Chữ (mỗi số/chữ là một quái vật riêng, bé gặp bạn nào bạn đó vào album)

- [?] Mở rộng đủ 29 chữ cái + số khi có thêm bài học (hiện có 28 bạn: số 0–10, chữ a…h) — Cần bạn duyệt danh sách chữ/vè cho các chữ còn lại


## 5 game hỏi-đáp mới (2026-11-27) — Pop: bộ khung `shared/popq/` · Cozy: `scripts/cozygame/parts/quiz/`
- [x] Pop Mê Cung Toán Nhanh `me-cung-toan` (chạy qua cổng, chọn sai = đường cụt, 3 cấp: cộng trừ / nhân chia / phân số) + linh vật Chuột Tính Nhanh
- [x] Pop Đoán Quốc Gia `doan-quoc-gia` (137 nước, hình viền + cờ cắt dần; dữ liệu SINH bởi `scripts/geo/gen-countries.js`) + linh vật Cánh Cụt Du Hành
- [x] Pop Khám Phá Vũ Trụ `kham-pha-vu-tru` (4 chủ đề × 10 câu, mỗi trạm có "điều thú vị") + linh vật Koala Phi Hành Gia
- [x] Cozy Bắt Kẻ Nói Dối `bat-ke-noi-doi` (24 đoạn, 10 loại lỗi lập luận) + Night Pass (3 loại + 3 giao diện) + linh vật Chồn Thám Tử
- [x] Cozy Hỏi Xoáy Đáp Xoay `hoi-xoay-dap-xoay` (16 câu đố mẹo) + Night Pass + linh vật Tắc Kè Xoáy
- [x] Pop: Night Pass cho 3 game (lớp chung `shared/popq/pro.js|css`, mã `server/pro/<id>.js`, mỗi game 3 giao diện khác hẳn; dùng thử 1 ván/ngày + cổng phụ huynh)
- [x] Pop: ảnh og/ (scripts/cozygame/og.js --pop) + trang chia sẻ `/api/share/<id>` (NEW_GAMES, maxSc); Cozy: og/ sinh xong, wire.js đã nối (skip hết)
- [ ] Chạy đủ `check.js`, `check-pop.js`, `check-landscape.js`, `check-skins.js`, `check-widebg.js`, `check-difficulty.js` (môi trường làm việc không mở được server cục bộ cho các bài đo này; mới chạy check-art, check-mascot, check-portal cho Pop)
- [ ] Cozy: `spec.level` (lên level), `wire.js` (landing/og), game vào `check-skins`; `privacy.html` thêm khoá localStorage mới (`pq-*`, `kl-*`, `hx-*`)
- [x] Chơi hộ `?helper=1` đã mở thật cả 5 game: khôi phục đúng ván dở
- [x] privacy.html: đã có dòng chung "các khoá riêng của từng game" + "*-pro-src, *-trial", không cần thêm
- [ ] Cozy `spec.level`: không áp dụng (game hỏi-đáp không có trục độ khó số); nếu muốn thì thêm level.custom

## Chùa Học Bá Online `chua-hoc-ba` (Cozy, 2026-11-27)
- [x] 3 bước: thắp hương (chọn điều cầu → dâng lễ = trả lời câu ôn bài → chạm đúng lúc), xin xăm (mỗi ngày MỘT quẻ: thành ngữ + giải nghĩa + lời khuyên, lắc điện thoại/chạm), gõ mõ (xen câu hỏi, đúng thì ×2)
- [x] Night Pass: 3 loại + 3 giao diện (Chùa Tuyết/Trúc/Vàng); linh vật Mèo Học Bá; og; đã nối hệ thống (wire.js + tay)
- [x] Bộ đếm "Hôm nay đã có N người cùng cầu" thật: `server/temple.js` (/api/temple/pray|count), bảng `temple_daily` (migration 010 — CHƯA CHẠY, cần người có quyền chạy `server/db/migrate.js`)
- [x] Bảng thi đua tuần theo lớp / trường / tỉnh (/api/temple/merit|board, bảng `temple_groups`; người chơi tự khai, lưu `hb-grp`); privacy.html + PDF đã cập nhật
- [ ] Chưa chạy check.js / check-skins.js / check-landscape.js cho game này (môi trường chặn server cục bộ)


## Mở rộng ngân hàng câu hỏi (2026-11-28): mỗi game hỏi-đáp ≥300 câu, tối đa 500
Quy ước dữ liệu Hỏi Xoáy: `scripts/cozygame/parts/hoi-xoay-dap-xoay/bank<N>.js` (hàm P, mỗi câu 2 dòng vi/en, tự nạp theo tên). Chất lượng: câu có mẹo thật, đáp án đúng duy nhất, KHÔNG câu quá dễ/trùng.
- [x] Cozy Hỏi Xoáy Đáp Xoay: 322 câu (17 gốc + bank1–6 viết tay 233 + bank9 sinh bởi `scripts/cozygame/genbank-hx.js` 88). Kiểm: `node scripts/cozygame/bankcheck.js`. Còn có thể thêm tới 500 (nhưng chất lượng trước số lượng)
- [x] Cozy Bắt Kẻ Nói Dối: 325 đoạn (25 gốc + 300 sinh bởi `scripts/cozygame/genbank-bk.js` → `parts/bat-ke-noi-doi/bank-gen.js`, 10 loại lỗi × ~32)
- [x] Pop Khám Phá Vũ Trụ: 302 câu (80/74/75/73 theo 4 chủ đề; `data/bank-t0..t4.js`, kiểm bằng `node scripts/check-quizbank-kpvt.js`); sw.js đã thêm tệp, CACHE v723
- [x] Cozy Săn Chữ Ẩn: 370 từ (free 112 ở `parts/san-chu/words.js`; Night Pass 4 chủ đề 62–68 từ, thêm ở `server/pro/san-chu-words.js`; kiểm `node scripts/check-sanchu-words.js`)
- [ ] Chưa động: Pop tiem-nuoc-ep-tieng-anh / doan-tuoi-nao / me-cung-toan (sinh bằng code) / doan-quoc-gia (137 nước cố định)
