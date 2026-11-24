# Khảo sát Học Vui đóng vai bé lớp 2 (7–8 tuổi)

Ngày: 2026-11-24. Chỉ khảo sát, không sửa code.
Thiết bị đã thử (Chrome thật + puppeteer, cảm ứng, hồ sơ trống): iPhone 390x844 (chính), 360x640, iPad 820x1180, ngang 844x390. Ảnh nằm trong `/private/tmp/claude-501/-Users-lap60775-a4b-game/6b26cc08-badb-44ea-8b66-75ba5f239ebe/scratchpad/k2/s/` (viết tắt: ảnh = tên tệp trong thư mục đó).
Đã đi qua: học (một vòng 5 câu ở cả Toán/Tiếng Việt/Tiếng Anh, đúng + cố tình sai), màn chúc mừng, menu ⋯, bộ chọn môn/lớp, Chương trình học, bài học (3 bài, từ đầu đến "Thử cùng" và chúc mừng), vườn (màn chọn bạn), Của bé, Bộ sưu tập.
Lỗi console/HTTP: không có lỗi nào ở index, lop, bai, me, album ở mọi cỡ màn. Duy nhất vườn: `GET /favicon.ico 404` (do máy chủ tĩnh thử, bỏ qua được).
Chưa kiểm được (headless): giọng đọc thật, bàn phím hệ thống khi gõ chữ, kéo thả bằng ngón thật (bot chạm theo từng thẻ), vườn sau khi chọn bạn, trò lật thẻ đến cuối, chế độ Night.

## 1. Lỗi/hỏng
- [ ] L2-01. Nút "Đúng/Sai" gần như không đọc được — màn Tiếng Việt kiểu "ĐÚNG HAY SAI?": hai nút nền hồng nhạt/xanh nhạt, chữ "Đúng", "Sai" và dấu ✓ ✗ màu trắng trên nền gần trắng, kể cả sau khi tải xong. Bé không biết nút nào là gì. Sửa: nền đậm (xanh lá/đỏ) hoặc chữ tối. Tệp: `learn/qui.js`/CSS kiểu `tf` trong `learn/index.html`. Mức: cao. Ảnh: r_tvietm_0b.png
- [ ] L2-02. Từ bị ngắt giữa vần trên điện thoại ngang — 844x390, câu "Điền chữ" Tiếng Việt: đáp án hiện "chườ/ng", "trườn/g", "xườn/g" (chữ g rớt xuống dòng). Bé đọc sai từ, đáp án mất nghĩa. Sửa: `white-space:nowrap` + co cỡ chữ (fitAns) cho nút từ; ở ngang nên dàn 4 nút một hàng. Mức: cao. Ảnh: v_idx_l.png
- [ ] L2-03. Thanh trên cùng (←, menu ⋯) tự cuộn mất sau khi trả lời — iPhone 390: câu đầu thấy đủ ←, lớp, vườn, loa, ⋯; từ câu 2 trở đi sau khi chạm đáp án trang cuộn lên ~100px, các nút này biến mất (chỉ còn thanh chấm tiến độ). Bé muốn thoát/đổi môn phải tự vuốt xuống. Sửa: không cuộn tự động hoặc cho thanh trên dính (sticky). Mức: vừa. Ảnh: r_toanm_0b.png so với r_toanm_0a.png
- [ ] L2-04. Dòng "Cập nhật lần cuối: 24/11/2026" đè lên nội dung — nằm chồng lên nút "Tiếp" ở bài học ngang (v_bai_l.png), lên biểu tượng khóa chủ đề 2 ở Chương trình học (p_lop_toanm.png), lên bong bóng thoại của vườn (p_garden_toanm.png). Là chữ người lớn, bé không cần. Sửa: ẩn ở trang bé hoặc đặt trong luồng, không fixed. Mức: vừa.
- [ ] L2-05. Chữ "l" giống chữ "I" hoa — bài Tiếng Việt "li thêm dấu huyền": đáp án "lĩ / lị / lì" hiện như "Iĩ / Iị / Iì" ở phông đậm. Bé đang học đọc dễ nhầm. Sửa: phông có chữ l có đuôi (hoặc phông sách giáo khoa) cho đáp án chữ. Mức: vừa. Ảnh: l_tvietm_4x0.png
- [ ] L2-06. Khoảng trắng bị mất ở câu đọc hiểu — bài học: "Bố chọn một con cá chép to.Bố chọn mua con gì?" (thiếu cách sau dấu chấm). Sửa: nối câu bằng khoảng trắng/xuống dòng khi ghép đoạn + câu hỏi. Tệp: `learn/lop/bai.html` hoặc `learn/content/lessons/VI-G2-01.js`. Mức: thấp. Ảnh: l_tvietm_3.png
- [ ] L2-07. Lời gợi ý khi sai không khớp lỗi — (a) Toán "32 cm + 73 cm", bé chọn sai thì linh vật nói "Đếm lại thật kỹ nhé!" (đây là cộng, không phải đếm), ảnh r_toanm_1b.png; (b) bài học "Chữ số hàng chục của số 732" chọn sai thì bong bóng nói "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…" (nhắc cả hàng nghìn không có, và không chỉ ra chữ số 3), ảnh l_toanm_3x.png; (c) bài "lì/lĩ" sai thì nói "Đọc liền hai âm với nhau: phụ âm rồi vần" trong khi bài về dấu thanh. Sửa: gợi ý theo kỹ năng, không dùng câu chung. Mức: vừa.
- [ ] L2-08. Vườn mới: nút nhỏ hơn 44px — "Quay lại bài học" 42, nút lớp 42, zoom +/−/nhà 38, nút đổi con vật 37x34, chip "2" 75x40. Sửa: tối thiểu 44x44. Tệp: `learn/garden/css/*`. Mức: thấp–vừa. (Gói vườn đang sửa, báo điều phối.) Ngang 844x390 thanh trên chỉ cao 38px ở index/lớp/bài (ngón khó bấm), mức: thấp.
- [ ] L2-09. Ở màn bài học ngang, và ở các màn khác, huy hiệu đỏ trên nút vườn góc phải bị cắt — vườn: biểu tượng lịch có huy hiệu quyển sách đè mép màn hình iPhone 390. Mức: thấp. Ảnh: p_garden_toanm.png

## 2. Bé không hiểu / khó dùng
- [ ] L2-10. Menu ⋯ toàn biểu tượng không có chữ — 9 nút: ba lô, hai mũi tên, "EN", nốt nhạc, nửa vòng tròn, bản đồ, cầu vồng, chữ i, ổ khóa. Bé 7 tuổi không đoán được (đổi môn? đổi ngôn ngữ? người lớn?), bấm thử nhầm "EN" sẽ đổi sang tiếng Anh. Sửa: thêm nhãn chữ ngắn dưới mỗi biểu tượng, đưa "EN" và ổ khóa/i sang khu "Dành cho người lớn". Mức: cao. Ảnh: f_menu.png
- [ ] L2-11. Bài học: khung giữa trống, câu hỏi chỉ nằm trong bong bóng — 3 slide mở đầu chỉ có một biểu tượng "123" nhỏ giữa khung đen rất lớn, chữ chỉ trong bong bóng; câu hỏi "Chữ số hàng chục của số 732 là?" không hiện số 732 to ở khung giữa, ba đáp án (2/7/3) là nút chữ đơn sắc, không hình. Bé lớp 2 cần hình khối trăm-chục-đơn vị, số to. Sửa: hiện số/hình minh họa ở khung giữa, đáp án có màu/hình. Tệp: `learn/lop/bai.html`. Mức: cao. Ảnh: l_toanm_0.png, l_toanm_3.png, l_tanhm_3.png, l_tvietm_3.png
- [ ] L2-12. Chữ người lớn/chương trình học đọc cho bé — bài học 2 slide đầu: "Đọc, viết, cấu tạo số có ba chữ số"; TV: "Đọc văn bản ngắn trôi chảy hơn; xác định nội dung chính và chi tiết hiển nhiên." và "Bé nhớ nhé!" lặp lại đúng câu đó; Chương trình học: "Giới thiệu", "Kiểm tra", "Xem thêm", "5 chủ đề · 5 bài học · 0 đã qua". Sửa: viết lại bằng câu bé hiểu ("Hôm nay mình đếm đến 1000 nhé!"). Tệp: `learn/content/curriculum*.js`, `learn/content/lessons/*.js`. Mức: cao. Ảnh: l_tvietm_1.png, p_lop_toanm.png
- [ ] L2-13. Phản hồi sai chưa đủ rõ — chọn sai ở kiểu 4 nút, nút đó chỉ mờ/xám, không hiện dấu ✗; bé không biết đáp án đúng (chỉ báo sau lượt hai) hoặc vẫn đoán mò 104/105/106. Ở bài học nút sai chỉ viền cam, nút "Tiếp" xám, bé chưa biết đúng/sai. Sửa: rung + ✗ đỏ nhỏ, linh vật nói "Chưa đúng, thử lại nhé" và với bài học hiện đáp án + vì sao. Mức: vừa. Ảnh: r_toanm_1b.png, l_toanm_3x.png
- [ ] L2-14. Linh vật ngủ "Zzz… bé còn đó không?" sau ~5 giây không chạm — bé lớp 2 đọc đề dài 3 dòng mất hơn thế; thấy như bị hối. Sửa: nới lên ~20 giây hoặc chỉ đổi mặt không nói. Mức: thấp. Ảnh: r_toanm_2a.png
- [ ] L2-15. Bộ chọn môn/lớp: nút bắt đầu chỉ có mũi tên ">", môn chỉ là mặt linh vật (không chữ). Bé chọn được nhưng không biết tên môn; thêm chữ Toán/Tiếng Việt/Tiếng Anh. Mức: thấp. Ảnh: f_pick.png
- [ ] L2-16. Vườn lần đầu hỏi "Bé mấy tuổi? 5–7 tuổi / 8–10 tuổi" và "Chỉ lưu trên máy này" — bé 7 tuổi vừa thuộc hai nhóm, tự chọn nhầm; câu chữ người lớn. Nên chọn sẵn theo lớp đã chọn (lớp 2 -> không hỏi) hoặc chuyển cho phụ huynh. Mức: vừa. Ảnh: p_garden_toanm.png
- [ ] L2-17. "Bạn của bé" dùng biểu tượng quyển sách (không giống bạn) và "Bộ sưu tập" toàn ô "?" xám mờ, không có câu "Làm bài để mở bạn mới" — bé không biết cách có thêm bạn. Sửa: biểu tượng linh vật + một dòng chỉ cách mở. Tệp: `learn/me/index.html`, `learn/album/index.html`. Mức: vừa. Ảnh: p_me_toanm.png, p_album_toanm.png
- [ ] L2-18. Màn rất rộng (iPad 820) dùng chưa tốt: "Chọn tất cả con vật" các thẻ hình chỉ ~45px (emoji nhỏ xíu) trong thẻ rộng ~350px, khoảng trống lớn giữa đề và đáp án; kiểu "Phân loại" trên iPhone cũng chỉ thẻ ~52px ở 6 thẻ nhỏ. Sửa: phóng hình theo ô (≥ 56px), thu khoảng trống. Mức: vừa. Ảnh: v_idx_t.png, r_tvietm_4a.png
- [ ] L2-19. Gõ chữ (nghe-viết tiếng Anh, viết câu): dùng ô nhập thật; trên điện thoại thật bàn phím hệ thống sẽ che nửa màn và nút ✓ (chưa kiểm được ở headless). Nên làm bàn phím chữ trong app như bàn phím số. Mức: vừa (cần thử máy thật). Ảnh: r_tanhm_1a.png

## 3. Nội dung/mức khó
- [ ] L2-20. "Làm tròn số 78 đến hàng chục", "làm tròn 81" nằm trong bài lớp 2 (Số trong phạm vi 1000); theo chương trình hiện hành làm tròn thường thuộc lớp 3, và nhóm "Chọn tất cả số chẵn" cũng nên rà lại. Cần đối chiếu sách giáo khoa; nếu đúng là lớp 3 thì đổi sang so sánh/sắp xếp. Mức: vừa. Ảnh/Log: o_les_toan.txt bước 4, r_toanm_4a.png
- [ ] L2-21. Bài TV "Đọc thành tiếng và đọc hiểu" thực tế chỉ hỏi thêm dấu thanh (nó/nò/nọ) và 1–2 câu hiểu; tên bài và nội dung lệch nhau. Dấu hỏi/ngã ("Bé bị __ đau chân": ngá/ngạ/ngã/ngả) là mức khó thật của lớp 2 nhưng không có hình hỗ trợ; nên kèm hình. Mức: thấp–vừa. Ảnh: r_tvietm_0a.png
- [ ] L2-22. Đề Toán dài: "Mai đưa 10000 đồng mua một quyển truyện giá 3000 đồng. Mai được trả lại bao nhiêu?" (ba dòng, số 4–5 chữ số, gõ đáp án 4 chữ số). Hơi nặng cho lớp 2 đầu năm; đáp án nhiễu 104/105/106 sát nhau cũng khó. Giảm số (ví dụ 1000/200) và đáp án nhiễu khác biệt hơn. Mức: thấp. Ảnh: r_toanm_2b.png, r_toanm_1a.png
- [ ] L2-23. Đồng hồ kim: kim phút màu xanh che số "12" (đọc thành "1_2"), đồng hồ nhỏ (~145px) so với màn, đáp án "2:50 / 7:40 / 4:30" lẫn giờ lẻ chưa dạy. Phóng to đồng hồ, vẽ kim phút sau số. Mức: thấp. Ảnh: r_toanm_4a.png
- [ ] L2-24. Tiếng Anh: nhãn "WHAT IS THIS?" tiếng Anh hoàn toàn trên giao diện tiếng Việt, lời linh vật nói nước ngoài; chấp nhận được cho môn Anh nhưng cần giọng đọc rõ; tên bài lạ "Nghe hiểu chỉ dẫn" kèm dịch nghĩa dài ("Stand up! nghĩa là gì?"). Hình cá/chú chim to rõ nên OK. Mức: thấp. Ảnh: r_tanhm_0a.png

## 4. Động lực & niềm vui
- [ ] L2-25. Mục tiêu "0/10", "Chặng 1/5 · Cầu gỗ", "Chương 1" và thanh chấm 5 câu cùng lúc: 3 loại tiến độ khác nhau trên một màn, bé không hiểu "0/10" là gì (10 sao? 10 câu?). Nên chỉ một mục tiêu bằng hình (hạt giống mọc thành cây) kèm câu "Còn 4 câu nữa là có sao". Câu này đã có ở bong bóng ("Còn 4 câu nữa là bé nhận sao…") — nên đưa lên thay "0/10". Mức: thấp.
- [ ] L2-26. Chỉ có một lượt 5 câu rồi "Tiếp tục": cuối vòng không hiển thị rõ phần thưởng bé nhận (cây, 4 sao, 5 con thú nhỏ) và không nói ngày mai có gì; bé có lý do tiếp tục nhưng chưa có lý do quay lại ngày mai. Thêm "Ngày mai cây sẽ cao thêm" hoặc quà mốc. Mức: thấp. Ảnh: r_tvietm_res.png
- [ ] L2-27. Bộ sưu tập chỉ "0/28" và toàn bóng mờ khi mới vào: hình nhân vật số 0–10 là mục tiêu tốt nhưng thiếu lời hứa "Làm bài để gặp bạn Số 0". Mức: thấp. Ảnh: p_album_toanm.png

## 5. Điểm tốt nên giữ
- [ ] L2-28. Nút đáp án to (174x62, bàn phím số 67x44, nút ✓ lớn), màu khác nhau, chữ/số rất to; không nút nào dưới 44px ở iPhone 390/360/iPad (bài đo cho index, lớp, bài, Của bé).
- [ ] L2-29. Không tràn ngang ở cả 4 cỡ màn (scrollWidth = innerWidth), không lỗi console, không kẹt: mọi kiểu câu hỏi đã gặp (gõ số, chọn 1/4, chọn hình, đúng-sai, bong bóng, sắp xếp, trục số kéo, đồng hồ, ghép chữ, phân loại, nghe-viết) đều hoàn thành được.
- [ ] L2-30. Phản hồi đúng vui: linh vật cười, "Giỏi quá!", pháo giấy, "Ba câu liền! Giỏi ghê!" 🔥, sau sai linh vật buồn rồi tự tươi lại, lần sai đầu làm mờ bớt đáp án sai. Màn chúc mừng (cúp "Đỉnh quá đi!", 5 sao, thú nhỏ) rất hấp dẫn. Ảnh: r_tvietm_res.png, l_tvietm_9.png
- [ ] L2-31. Hình minh họa kiểu "Tìm trong tranh" (lưới 3x3 hình to, màu) và đếm hoa trong thẻ màu rất dễ hiểu cho bé; nút nghe lại 🔊 có ở mỗi câu; "Thử cùng · không tính điểm" làm bé bớt sợ sai. Ảnh: v_idx_s.png, r_toanm_3a.png
- [ ] L2-32. Chương trình học: thẻ chủ đề lớn, nút "Học" nổi bật, ba môn có linh vật riêng, màu phân biệt; Của bé có 3 nút to đơn giản (Khu vườn, Bạn của bé, Chơi). Ảnh: p_lop_toanm.png, p_me_toanm.png

## Tóm tắt 10 dòng gửi điều phối
1. Lỗi cao: nút Đúng/Sai chữ trắng trên nền gần trắng (L2-01) — đọc không được.
2. Lỗi cao: ngang 844x390 từ bị ngắt giữa vần "chườ/ng" (L2-02).
3. Menu ⋯ toàn biểu tượng không chữ, có nút "EN" dễ bấm nhầm (L2-10).
4. Bài học: khung giữa trống, số/câu hỏi chỉ nằm trong bong bóng, không hình (L2-11); chữ giáo trình đọc cho bé (L2-12).
5. Gợi ý sai không khớp lỗi (Toán "Đếm lại thật kỹ nhé" cho phép cộng; hàng chục lại nhắc "nghìn") (L2-07); sai chưa hiện rõ ✗/đáp án (L2-13).
6. Thanh ←/⋯ tự cuộn mất sau câu đầu (L2-03); dòng "Cập nhật lần cuối" đè nút/nội dung (L2-04).
7. Vườn: nút <44px, hỏi "Bé mấy tuổi" chữ người lớn, huy hiệu bị cắt (L2-08, L2-09, L2-16) — thuộc gói vườn.
8. Mức khó: "làm tròn số" ở lớp 2 cần đối chiếu sách; đề tiền 10000 hơi dài; bài TV tên và nội dung lệch (L2-20..22).
9. Chữ l giống I hoa ở phông đậm (L2-05); thiếu dấu cách "to.Bố" (L2-06); thẻ hình quá nhỏ ở iPad/phân loại (L2-18).
10. Giữ: nút to, không tràn, không lỗi console, phản hồi đúng vui, màn chúc mừng đẹp, "Thử cùng không tính điểm", tìm trong tranh.
