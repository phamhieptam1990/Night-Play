# Khảo sát Học Vui đóng vai bé lớp 2 (7–8 tuổi)

Ngày: 2026-11-24. Chỉ khảo sát, không sửa code.
Thiết bị đã thử (Chrome thật + puppeteer, cảm ứng, hồ sơ trống): iPhone 390x844 (chính), 360x640, iPad 820x1180, ngang 844x390. Ảnh nằm trong `/private/tmp/claude-501/-Users-lap60775-a4b-game/6b26cc08-badb-44ea-8b66-75ba5f239ebe/scratchpad/k2/s/` (viết tắt: ảnh = tên tệp trong thư mục đó).
Đã đi qua: học (một vòng 5 câu ở cả Toán/Tiếng Việt/Tiếng Anh, đúng + cố tình sai), màn chúc mừng, menu ⋯, bộ chọn môn/lớp, Chương trình học, bài học (3 bài, từ đầu đến "Thử cùng" và chúc mừng), vườn (màn chọn bạn), Của bé, Bộ sưu tập.
Lỗi console/HTTP: không có lỗi nào ở index, lop, bai, me, album ở mọi cỡ màn. Duy nhất vườn: `GET /favicon.ico 404` (do máy chủ tĩnh thử, bỏ qua được).
Chưa kiểm được (headless): giọng đọc thật, bàn phím hệ thống khi gõ chữ, kéo thả bằng ngón thật (bot chạm theo từng thẻ), vườn sau khi chọn bạn, trò lật thẻ đến cuối, chế độ Night.

## 1. Lỗi/hỏng
- [x] L2-01. Nút "Đúng/Sai" gần như không đọc được — màn Tiếng Việt kiểu "ĐÚNG HAY SAI?": hai nút nền hồng nhạt/xanh nhạt, chữ "Đúng", "Sai" và dấu ✓ ✗ màu trắng trên nền gần trắng, kể cả sau khi tải xong. Bé không biết nút nào là gì. Sửa: nền đậm (xanh lá/đỏ) hoặc chữ tối. Tệp: `learn/qui.js`/CSS kiểu `tf` trong `learn/index.html`. Mức: cao. Ảnh: r_tvietm_0b.png
  - Bằng chứng: Đã sửa (e0915e3): Đúng/Sai là nút nền gradient hồng/xanh, chữ trắng viền, ✓ ✗ rõ; chụp Chrome 390x844 và 844x390 đọc được.
- [x] L2-02. Từ bị ngắt giữa vần trên điện thoại ngang — 844x390, câu "Điền chữ" Tiếng Việt: đáp án hiện "chườ/ng", "trườn/g", "xườn/g" (chữ g rớt xuống dòng). Bé đọc sai từ, đáp án mất nghĩa. Sửa: `white-space:nowrap` + co cỡ chữ (fitAns) cho nút từ; ở ngang nên dàn 4 nút một hàng. Mức: cao. Ảnh: v_idx_l.png
  - Bằng chứng: Đã sửa (08dc924 + ui2.css `word-break:keep-all`): đo 15 câu Toán/Việt/Anh ở 844x390, 360x640, 390x844, không đáp án nào bị ngắt dòng giữa từ.
- [x] L2-03. Thanh trên cùng (←, menu ⋯) tự cuộn mất sau khi trả lời — iPhone 390: câu đầu thấy đủ ←, lớp, vườn, loa, ⋯; từ câu 2 trở đi sau khi chạm đáp án trang cuộn lên ~100px, các nút này biến mất (chỉ còn thanh chấm tiến độ). Bé muốn thoát/đổi môn phải tự vuốt xuống. Sửa: không cuộn tự động hoặc cho thanh trên dính (sticky). Mức: vừa. Ảnh: r_toanm_0b.png so với r_toanm_0a.png
  - Bằng chứng: Đã sửa (223958a): thanh trên thu gọn vẫn giữ nút ← và nút "Menu" chữ; chụp sau khi trả lời thấy đủ, trang không cuộn.
- [x] L2-04. Dòng "Cập nhật lần cuối: 24/11/2026" đè lên nội dung — nằm chồng lên nút "Tiếp" ở bài học ngang (v_bai_l.png), lên biểu tượng khóa chủ đề 2 ở Chương trình học (p_lop_toanm.png), lên bong bóng thoại của vườn (p_garden_toanm.png). Là chữ người lớn, bé không cần. Sửa: ẩn ở trang bé hoặc đặt trong luồng, không fixed. Mức: vừa.
  - Bằng chứng: Đã sửa: dòng "Cập nhật lần cuối" ở lop/me/album/chu-de nằm cuối trang trong luồng (CSS `body>.site-upd.fixed{position:static}`), ở index/bài/vườn là dòng nhỏ giữa đáy không đè nút; chụp me/album đã cuộn hết.
- [x] L2-05. Chữ "l" giống chữ "I" hoa — bài Tiếng Việt "li thêm dấu huyền": đáp án "lĩ / lị / lì" hiện như "Iĩ / Iị / Iì" ở phông đậm. Bé đang học đọc dễ nhầm. Sửa: phông có chữ l có đuôi (hoặc phông sách giáo khoa) cho đáp án chữ. Mức: vừa. Ảnh: l_tvietm_4x0.png
  - Bằng chứng: Đã sửa (b20c8b7): chữ l thường có đuôi (Inter cv05) nối vào mọi trang học.
- [x] L2-06. Khoảng trắng bị mất ở câu đọc hiểu — bài học: "Bố chọn một con cá chép to.Bố chọn mua con gì?" (thiếu cách sau dấu chấm). Sửa: nối câu bằng khoảng trắng/xuống dòng khi ghép đoạn + câu hỏi. Tệp: `learn/lop/bai.html` hoặc `learn/content/lessons/VI-G2-01.js`. Mức: thấp. Ảnh: l_tvietm_3.png
  - Bằng chứng: Đã sửa (e781e93): lời giảng viết lại, đề đọc hiểu ngắn có dấu cách ("Mẹ đi chợ mua cá. Mẹ mua gì?"); chạy bài VI-G2-01 thấy đúng.
- [x] L2-07. Lời gợi ý khi sai không khớp lỗi — (a) Toán "32 cm + 73 cm", bé chọn sai thì linh vật nói "Đếm lại thật kỹ nhé!" (đây là cộng, không phải đếm), ảnh r_toanm_1b.png; (b) bài học "Chữ số hàng chục của số 732" chọn sai thì bong bóng nói "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…" (nhắc cả hàng nghìn không có, và không chỉ ra chữ số 3), ảnh l_toanm_3x.png; (c) bài "lì/lĩ" sai thì nói "Đọc liền hai âm với nhau: phụ âm rồi vần" trong khi bài về dấu thanh. Sửa: gợi ý theo kỹ năng, không dùng câu chung. Mức: vừa.
  - Bằng chứng: Đã sửa: gợi ý theo kỹ năng (cộng nhớ "Xem lại hàng chục nào!", hàng chục "Nhìn kỹ chữ số đứng ở hàng nào nhé!", bài học "Chữ số đứng đầu... thuộc hàng nào?"); không còn câu "Đếm lại thật kỹ"/"Đọc liền hai âm" trong mã.
- [x] L2-08. Vườn mới: nút nhỏ hơn 44px — "Quay lại bài học" 42, nút lớp 42, zoom +/−/nhà 38, nút đổi con vật 37x34, chip "2" 75x40. Sửa: tối thiểu 44x44. Tệp: `learn/garden/css/*`. Mức: thấp–vừa. (Gói vườn đang sửa, báo điều phối.) Ngang 844x390 thanh trên chỉ cao 38px ở index/lớp/bài (ngón khó bấm), mức: thấp.
  - Bằng chứng: Đã sửa: vườn mọi nút (←, ba lô, lịch, ＋ − ⌂, đổi bạn, chip mục tiêu) >= 44px ở 390/360/844x390/820 (đo bằng Chrome, learn/garden/index.html); ngang thanh trên giữ như check-ui quy định.
- [x] L2-09. Ở màn bài học ngang, và ở các màn khác, huy hiệu đỏ trên nút vườn góc phải bị cắt — vườn: biểu tượng lịch có huy hiệu quyển sách đè mép màn hình iPhone 390. Mức: thấp. Ảnh: p_garden_toanm.png
  - Bằng chứng: Đã kiểm: huy hiệu nút lịch/ba lô nằm trong màn (right < innerWidth) ở 360 và 390; chụp g_360/g_390.

## 2. Bé không hiểu / khó dùng
- [x] L2-10. Menu ⋯ toàn biểu tượng không có chữ — 9 nút: ba lô, hai mũi tên, "EN", nốt nhạc, nửa vòng tròn, bản đồ, cầu vồng, chữ i, ổ khóa. Bé 7 tuổi không đoán được (đổi môn? đổi ngôn ngữ? người lớn?), bấm thử nhầm "EN" sẽ đổi sang tiếng Anh. Sửa: thêm nhãn chữ ngắn dưới mỗi biểu tượng, đưa "EN" và ổ khóa/i sang khu "Dành cho người lớn". Mức: cao. Ảnh: f_menu.png
  - Bằng chứng: Đã sửa (223958a): 9 nút có chữ (Đổi môn, Chơi lại, Nhạc, Sáng/Tối, Bản đồ, Của bé, Thông tin, Phụ huynh) và "EN English" tách riêng hàng cuối; chụp menu.
- [ ] L2-11. Bài học: khung giữa trống, câu hỏi chỉ nằm trong bong bóng — 3 slide mở đầu chỉ có một biểu tượng "123" nhỏ giữa khung đen rất lớn, chữ chỉ trong bong bóng; câu hỏi "Chữ số hàng chục của số 732 là?" không hiện số 732 to ở khung giữa, ba đáp án (2/7/3) là nút chữ đơn sắc, không hình. Bé lớp 2 cần hình khối trăm-chục-đơn vị, số to. Sửa: hiện số/hình minh họa ở khung giữa, đáp án có màu/hình. Tệp: `learn/lop/bai.html`. Mức: cao. Ảnh: l_toanm_0.png, l_toanm_3.png, l_tanhm_3.png, l_tvietm_3.png
  - Làm một phần: khung giữa nay hiện số to (732, 485) và chữ lớn, gợi ý sai theo kỹ năng; CÒN THIẾU hình khối trăm-chục-đơn vị và đáp án có màu/hình trong bài học — cần người: hoạ sĩ/duyệt hình minh họa (nội dung chưa được duyệt).
- [ ] L2-12. Chữ người lớn/chương trình học đọc cho bé — bài học 2 slide đầu: "Đọc, viết, cấu tạo số có ba chữ số"; TV: "Đọc văn bản ngắn trôi chảy hơn; xác định nội dung chính và chi tiết hiển nhiên." và "Bé nhớ nhé!" lặp lại đúng câu đó; Chương trình học: "Giới thiệu", "Kiểm tra", "Xem thêm", "5 chủ đề · 5 bài học · 0 đã qua". Sửa: viết lại bằng câu bé hiểu ("Hôm nay mình đếm đến 1000 nhé!"). Tệp: `learn/content/curriculum*.js`, `learn/content/lessons/*.js`. Mức: cao. Ảnh: l_tvietm_1.png, p_lop_toanm.png
  - Làm một phần: lời giảng 54 bài đã viết lại câu bé hiểu ("Số 732 có 7 trăm, 3 chục và 2 đơn vị", "Bé nhớ nhé!" có ý riêng); CÒN thẻ chủ đề lấy nguyên văn chương trình ("Đọc, viết, cấu tạo số có ba chữ số") và nhãn "Giới thiệu/Kiểm tra/Xem thêm" — cần người: chủ site/giáo viên duyệt lời viết lại, vì là nội dung chưa duyệt (checklist H4 chờ duyệt 54 bài).
- [x] L2-13. Phản hồi sai chưa đủ rõ — chọn sai ở kiểu 4 nút, nút đó chỉ mờ/xám, không hiện dấu ✗; bé không biết đáp án đúng (chỉ báo sau lượt hai) hoặc vẫn đoán mò 104/105/106. Ở bài học nút sai chỉ viền cam, nút "Tiếp" xám, bé chưa biết đúng/sai. Sửa: rung + ✗ đỏ nhỏ, linh vật nói "Chưa đúng, thử lại nhé" và với bài học hiện đáp án + vì sao. Mức: vừa. Ảnh: r_toanm_1b.png, l_toanm_3x.png
  - Bằng chứng: Đã sửa: câu 4 nút sai hiện dấu ✕ đỏ + viền đỏ + rung (learn/css/question.css); bài học nút sai đỏ + ✕ (bai-tiles.css); lần sai 2 hiện đáp án đúng xanh; chụp 390 và 844x390.
- [x] L2-14. Linh vật ngủ "Zzz… bé còn đó không?" sau ~5 giây không chạm — bé lớp 2 đọc đề dài 3 dòng mất hơn thế; thấy như bị hối. Sửa: nới lên ~20 giây hoặc chỉ đổi mặt không nói. Mức: thấp. Ảnh: r_toanm_2a.png
  - Bằng chứng: Đã sửa: linh vật chỉ "ngủ" sau 20 giây không chạm (learn/js/events.js idleMs 20000, trước 15000/5000).
- [x] L2-15. Bộ chọn môn/lớp: nút bắt đầu chỉ có mũi tên ">", môn chỉ là mặt linh vật (không chữ). Bé chọn được nhưng không biết tên môn; thêm chữ Toán/Tiếng Việt/Tiếng Anh. Mức: thấp. Ảnh: f_pick.png
  - Bằng chứng: Đã sửa: bảng chọn môn/lớp có chữ Toán/Tiếng Việt/Tiếng Anh dưới mỗi linh vật (learn/js/sheet-info.js + result.css); chụp 390 và 844x390.
- [x] L2-16. Vườn lần đầu hỏi "Bé mấy tuổi? 5–7 tuổi / 8–10 tuổi" và "Chỉ lưu trên máy này" — bé 7 tuổi vừa thuộc hai nhóm, tự chọn nhầm; câu chữ người lớn. Nên chọn sẵn theo lớp đã chọn (lớp 2 -> không hỏi) hoặc chuyển cho phụ huynh. Mức: vừa. Ảnh: p_garden_toanm.png
  - Bằng chứng: Đã sửa: lần đầu vào vườn không còn hỏi "Bé mấy tuổi?" và "Chỉ lưu trên máy này" (tuổi chọn sẵn theo lớp, garden-buddy.js); chỉ hỏi khi bé bấm đổi bạn.
- [x] L2-17. "Bạn của bé" dùng biểu tượng quyển sách (không giống bạn) và "Bộ sưu tập" toàn ô "?" xám mờ, không có câu "Làm bài để mở bạn mới" — bé không biết cách có thêm bạn. Sửa: biểu tượng linh vật + một dòng chỉ cách mở. Tệp: `learn/me/index.html`, `learn/album/index.html`. Mức: vừa. Ảnh: p_me_toanm.png, p_album_toanm.png
  - Bằng chứng: Đã sửa: nút "Bạn của bé" ở Của bé dùng đầu linh vật theo môn thay quyển sách; Bộ sưu tập có dòng "Chạm vào ô mở để biết cách gặp bạn đó" và mỗi ô ghi "Học bài Số 0–5"; chụp.
- [x] L2-18. Màn rất rộng (iPad 820) dùng chưa tốt: "Chọn tất cả con vật" các thẻ hình chỉ ~45px (emoji nhỏ xíu) trong thẻ rộng ~350px, khoảng trống lớn giữa đề và đáp án; kiểu "Phân loại" trên iPhone cũng chỉ thẻ ~52px ở 6 thẻ nhỏ. Sửa: phóng hình theo ô (≥ 56px), thu khoảng trống. Mức: vừa. Ảnh: v_idx_t.png, r_tvietm_4a.png
  - Bằng chứng: Đã sửa: iPad 820 thẻ hình 72px (chọn nhiều/phân loại) và 150–170px (tìm trong tranh); iPhone thẻ hình 49–53px (ui2.css, trước 39px); không tràn/cắt.
- [ ] L2-19. Gõ chữ (nghe-viết tiếng Anh, viết câu): dùng ô nhập thật; trên điện thoại thật bàn phím hệ thống sẽ che nửa màn và nút ✓ (chưa kiểm được ở headless). Nên làm bàn phím chữ trong app như bàn phím số. Mức: vừa (cần thử máy thật). Ảnh: r_tanhm_1a.png
  - Cần người: kiểm bàn phím hệ điều hành trên iPhone/iPad thật (headless không thấy được); nếu thật sự che nút ✓ mới làm bàn phím chữ trong app.

## 3. Nội dung/mức khó
- [ ] L2-20. "Làm tròn số 78 đến hàng chục", "làm tròn 81" nằm trong bài lớp 2 (Số trong phạm vi 1000); theo chương trình hiện hành làm tròn thường thuộc lớp 3, và nhóm "Chọn tất cả số chẵn" cũng nên rà lại. Cần đối chiếu sách giáo khoa; nếu đúng là lớp 3 thì đổi sang so sánh/sắp xếp. Mức: vừa. Ảnh/Log: o_les_toan.txt bước 4, r_toanm_4a.png
  - Cần người: chủ site/giáo viên đối chiếu GDPT 2018 và sách giáo khoa chính thức. Hiện: ngân hàng câu lớp 2 đã bỏ làm tròn (4c9b2bd) nhưng bài học g2_numbers_1000 vẫn dạy làm tròn đến hàng chục; "số chẵn" chưa rà.
- [ ] L2-21. Bài TV "Đọc thành tiếng và đọc hiểu" thực tế chỉ hỏi thêm dấu thanh (nó/nò/nọ) và 1–2 câu hiểu; tên bài và nội dung lệch nhau. Dấu hỏi/ngã ("Bé bị __ đau chân": ngá/ngạ/ngã/ngả) là mức khó thật của lớp 2 nhưng không có hình hỗ trợ; nên kèm hình. Mức: thấp–vừa. Ảnh: r_tvietm_0a.png
  - Cần người: giáo viên Tiếng Việt quyết tên bài/nội dung (dấu hỏi/ngã) và hình hỗ trợ — nội dung chưa được duyệt, không tự đổi.
- [x] L2-22. Đề Toán dài: "Mai đưa 10000 đồng mua một quyển truyện giá 3000 đồng. Mai được trả lại bao nhiêu?" (ba dòng, số 4–5 chữ số, gõ đáp án 4 chữ số). Hơi nặng cho lớp 2 đầu năm; đáp án nhiễu 104/105/106 sát nhau cũng khó. Giảm số (ví dụ 1000/200) và đáp án nhiễu khác biệt hơn. Mức: thấp. Ảnh: r_toanm_2b.png, r_toanm_1a.png
  - Bằng chứng: Đã sửa (4c9b2bd): tiền lớp 2 trong 1000 đồng, đề ngắn ("Bút giá 300 đồng, tẩy giá 200 đồng...").
- [x] L2-23. Đồng hồ kim: kim phút màu xanh che số "12" (đọc thành "1_2"), đồng hồ nhỏ (~145px) so với màn, đáp án "2:50 / 7:40 / 4:30" lẫn giờ lẻ chưa dạy. Phóng to đồng hồ, vẽ kim phút sau số. Mức: thấp. Ảnh: r_toanm_4a.png
  - Bằng chứng: Đã sửa: đồng hồ 180px (trước ~145), số vẽ SAU kim phút và có viền nên kim không che số 12/9 (learn/qui/more.js, qui-more.css); chụp 390/360/844x390.
- [ ] L2-24. Tiếng Anh: nhãn "WHAT IS THIS?" tiếng Anh hoàn toàn trên giao diện tiếng Việt, lời linh vật nói nước ngoài; chấp nhận được cho môn Anh nhưng cần giọng đọc rõ; tên bài lạ "Nghe hiểu chỉ dẫn" kèm dịch nghĩa dài ("Stand up! nghĩa là gì?"). Hình cá/chú chim to rõ nên OK. Mức: thấp. Ảnh: r_tanhm_0a.png
  - Cần người: kiểm giọng đọc tiếng Anh thật trên thiết bị (headless không có giọng) và duyệt cách đặt tên bài "Nghe hiểu chỉ dẫn"; hình cá/chim đã to rõ nên không sửa mã.

## 4. Động lực & niềm vui
- [x] L2-25. Mục tiêu "0/10", "Chặng 1/5 · Cầu gỗ", "Chương 1" và thanh chấm 5 câu cùng lúc: 3 loại tiến độ khác nhau trên một màn, bé không hiểu "0/10" là gì (10 sao? 10 câu?). Nên chỉ một mục tiêu bằng hình (hạt giống mọc thành cây) kèm câu "Còn 4 câu nữa là có sao". Câu này đã có ở bong bóng ("Còn 4 câu nữa là bé nhận sao…") — nên đưa lên thay "0/10". Mức: thấp.
  - Bằng chứng: Đã sửa: thanh mục tiêu hiện "Còn N ⭐ là có quà" thay "0/10" (learn/js/story-farm.js).
- [x] L2-26. Chỉ có một lượt 5 câu rồi "Tiếp tục": cuối vòng không hiển thị rõ phần thưởng bé nhận (cây, 4 sao, 5 con thú nhỏ) và không nói ngày mai có gì; bé có lý do tiếp tục nhưng chưa có lý do quay lại ngày mai. Thêm "Ngày mai cây sẽ cao thêm" hoặc quà mốc. Mức: thấp. Ảnh: r_tvietm_res.png
  - Bằng chứng: Đã có: màn chúc mừng lớp 1–2 ghi "Còn N bạn đang chờ bé gặp, mai chơi tiếp nhé!" (learn/js/result.js) + phần thưởng vườn.
- [x] L2-27. Bộ sưu tập chỉ "0/28" và toàn bóng mờ khi mới vào: hình nhân vật số 0–10 là mục tiêu tốt nhưng thiếu lời hứa "Làm bài để gặp bạn Số 0". Mức: thấp. Ảnh: p_album_toanm.png
  - Bằng chứng: Đã có: Bộ sưu tập ghi "Chạm vào ô mở để biết cách gặp bạn đó" và "Học bài Số 0–5" trên từng ô khoá; chụp album.

## 5. Điểm tốt nên giữ
- [x] L2-28. Nút đáp án to (174x62, bàn phím số 67x44, nút ✓ lớn), màu khác nhau, chữ/số rất to; không nút nào dưới 44px ở iPhone 390/360/iPad (bài đo cho index, lớp, bài, Của bé).
  - Bằng chứng: Đã kiểm: check-ui.js (PORT=9830) 102 tổ hợp đạt, không nút < 44px; đo thêm lop/bài/Của bé/Bộ sưu tập ở 390, 360, 820: 0 nút nhỏ.
- [x] L2-29. Không tràn ngang ở cả 4 cỡ màn (scrollWidth = innerWidth), không lỗi console, không kẹt: mọi kiểu câu hỏi đã gặp (gõ số, chọn 1/4, chọn hình, đúng-sai, bong bóng, sắp xếp, trục số kéo, đồng hồ, ghép chữ, phân loại, nghe-viết) đều hoàn thành được.
  - Bằng chứng: Đã kiểm: check-ui.js đạt (không tràn ngang, không lỗi console, chơi đúng + sai hai lần xong mọi kiểu câu); lop/bài/me/album không tràn ở 390/360/820.
- [x] L2-30. Phản hồi đúng vui: linh vật cười, "Giỏi quá!", pháo giấy, "Ba câu liền! Giỏi ghê!" 🔥, sau sai linh vật buồn rồi tự tươi lại, lần sai đầu làm mờ bớt đáp án sai. Màn chúc mừng (cúp "Đỉnh quá đi!", 5 sao, thú nhỏ) rất hấp dẫn. Ảnh: r_tvietm_res.png, l_tvietm_9.png
  - Bằng chứng: Đã kiểm: check-ui.js chơi đúng ra "ok" và sai hai lần ra "miss" cho mọi kiểu; chụp sai thấy ✕ đỏ.
- [x] L2-31. Hình minh họa kiểu "Tìm trong tranh" (lưới 3x3 hình to, màu) và đếm hoa trong thẻ màu rất dễ hiểu cho bé; nút nghe lại 🔊 có ở mỗi câu; "Thử cùng · không tính điểm" làm bé bớt sợ sai. Ảnh: v_idx_s.png, r_toanm_3a.png
  - Bằng chứng: Đã kiểm: chụp Tìm trong tranh (thẻ 150–170px iPad), đếm, nút nghe lại và "Thử cùng · không tính điểm" ở bài học vẫn còn.
- [x] L2-32. Chương trình học: thẻ chủ đề lớn, nút "Học" nổi bật, ba môn có linh vật riêng, màu phân biệt; Của bé có 3 nút to đơn giản (Khu vườn, Bạn của bé, Chơi). Ảnh: p_lop_toanm.png, p_me_toanm.png
  - Bằng chứng: Đã kiểm: chụp lop (thẻ chủ đề lớn, nút Học, 3 môn linh vật) và Của bé (3 nút Khu vườn/Bạn của bé/Chơi).

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
