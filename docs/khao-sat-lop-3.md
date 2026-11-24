# Khảo sát Học Vui: góc nhìn bé lớp 3 (8–9 tuổi)

- Ngày: 24/11/2026. Người khảo sát: đóng vai bé lớp 3, hồ sơ mới tinh, chỉ khảo sát, không sửa mã.
- Thiết bị: iPhone 390×844 (chính), 360×640, iPad 820×1180, ngang 844×390. Chrome thật + puppeteer-core, cảm ứng giả lập (touchscreen) và bàn phím.
- Phạm vi: `learn/index.html` (3 môn, `?grade=3&subj=toan|tviet|tanh&lang=vi`, các kiểu câu qua `?qk=`), màn kết thúc vòng, `learn/lop/index.html`, `learn/lop/bai.html` (đầu tới cuối + thử cùng), `learn/garden`, `learn/me`, `learn/album`, menu ⋯, ⓘ, nút 💡 3 bậc, bảng đổi môn/lớp. Đã chơi đúng và cố tình chơi sai. Đã lấy mẫu khoảng 900 câu từ `LearnEngine.round` để soát nội dung.
- Lỗi console/HTTP: không có lỗi JS trên học, bài học, lớp, vườn, Của bé, Album. Chỉ có `404 /favicon.ico` (vườn) và `404 /hoc/` (nút ← về `/hoc/` chỉ chạy khi có trang gốc, máy chủ tĩnh thử không có).
- Ghi chú: mỗi mục có bằng chứng đã thấy (ảnh/đầu ra). Chưa kiểm được giọng đọc thật (không có âm thanh) và nút "Đọc to" (cần micro).

## 1. Lỗi/hỏng

- [ ] L3-01. Câu "Viết câu": dòng nhắc bị dán đè lên đề — màn học, kiểu `write` (Tiếng Việt và Tiếng Anh, 390×844). Đề thật "Viết một câu về mẹ" / "Write a sentence about my family" bị che gần hết và mờ; chỉ thấy viên thuốc "CHỮ ĐẦU VIẾT HOA, CUỐI CÂ…" bị cắt chữ nằm giữa khung. Nguyên nhân: thẻ `<small>` trong đề (qtypes.js, kiểu write) dính luật `.q small` (learn/index.html dòng ~159: position:absolute, nhãn trên khung). Bé không biết phải viết về gì. Sửa: đổi luật thành `.q > small` hoặc dùng thẻ/lớp khác cho dòng nhắc trong đề. Mức: cao.
- [ ] L3-02. Nút Đúng/Sai bị bẻ chữ từng chữ cái khi xoay ngang — màn học 844×390, kiểu `tf`: nút hiện "Đ / ú / n / g" và "Sa / i" xếp dọc, dấu ✓/✗ quá to chiếm hết nút. Bé xoay máy sẽ thấy lỗi. Sửa: cỡ icon theo chiều cao khung ở ngang, `white-space:nowrap`, hoặc ẩn icon khi hẹp. Mức: vừa.
- [ ] L3-03. Phím gõ bàn phím vật lý lúc đáp án đang "tải" (~0,6 giây) vẫn nhận chữ nhưng Enter bị bỏ qua — màn học, kiểu `typein`. Gõ 52 rồi Enter ngay: ô hiện 52, không chấm; gõ lại thành 5252 và bị tính sai ("Đọc kỹ lại nào!"). Bé gõ nhanh sẽ bị oan. Sửa: chặn nhập khi `busy` trong cả sự kiện `input`, hoặc cho Enter xếp hàng sau khi hết `ld` (qui.js dòng ~68–90). Mức: thấp.
- [ ] L3-04. Màn ngang 844×390: trang học vẫn cuộn được ở mọi kiểu câu (scrollHeight lớn hơn khung, 41/41 màn kiểm). Trái GAME_RULES (một màn hình không cuộn). Các ô kéo thả "dragfill" có 4 nút cao dưới 40px ở ngang. 360×640 và iPad 820×1180: không tràn, không cuộn ở cả 40 kiểu câu. Mức: thấp.
- [ ] L3-05. Nút ← trong vườn mất lớp/môn — `learn/garden/index.html` dòng 37: `href="../index.html"` không mang `grade/subj/lang`. Vào vườn bằng `?grade=3&subj=toan` rồi bấm ← sang `learn/index.html` thì bị đưa tới bài lớp 1 "Cùng gặp các bạn Số nhé!" (hồ sơ mới). Với hồ sơ đã lưu lớp 3 có thể không xảy ra; cần kiểm lại trên hồ sơ thật. Sửa: nối `location.search` hoặc đọc lớp đã lưu. Mức: thấp, chưa chắc.

## 2. Bé không hiểu / khó dùng

- [ ] L3-06. Bài học (`lop/bai.html`) gần như không dạy: ba màn đầu chỉ là chữ "chương trình" trong bong bóng ("Đọc, viết số có nhiều chữ số trong phạm vi chương trình", "Cấu tạo thập phân của số", "Nhận biết ý nghĩa tử số và mẫu số ở mức độ ban đầu"), phần giữa là khung đen trống với một biểu tượng "123" nhỏ. Không có hình minh hoạ, không ví dụ làm mẫu. Bé 8 tuổi không hiểu "cấu tạo thập phân", bấm Tiếp cho xong. Nguồn: các tệp `learn/content/lessons/g3_*.js` tự sinh ("BẢN NHÁP TỰ SINH … chờ chủ site/giáo viên viết lại"). Sửa: viết lại lời giảng bằng câu của bé, thêm hình/ví dụ có số. Mức: cao.
- [ ] L3-07. Câu hỏi trong bài đặt TRƯỚC lời giải thích: "Số La Mã XI là số nào?" (12/16/11) hiện trước, luật "I = 1, V = 5, X = 10. Số bé đứng TRƯỚC số lớn thì trừ (IV = 4, IX = 9)" chỉ hiện khi bé chọn sai — và luật đó (phép trừ) không giúp ra XI (phải cộng, số bé đứng sau). Phản hồi sai không khớp câu hỏi. Mức: vừa.
- [ ] L3-08. Phản hồi sai trong bài không khớp: "Điền dấu câu: Trong vườn có hoa hồng __ hoa cúc và hoa lan." (đáp án ","), lời giải sai hiện "Câu hỏi dùng dấu hỏi (?). Câu cảm, ngạc nhiên dùng dấu chấm than (!). Câu kể dùng…" — bị cắt dấu "…" và không nói về dấu phẩy (liệt kê). Mức: vừa (VI-G3-02).
- [ ] L3-09. Trong bài, gợi ý/giải thích toán dùng ký hiệu a/b: "“a/b của một số”: chia số đó cho b rồi nhân với a." cho câu "1/3 của 15" — bé lớp 3 chưa học chữ thay số. Sửa: đưa ví dụ số ("15 chia 3 = 5"). Mức: vừa (g3_fraction_intro).
- [ ] L3-10. Menu ⋯ chỉ có biểu tượng, không nhãn: 🎒 (Đổi môn/lớp), 🔁 (Chơi lại vòng), EN, ♪, ◐, 🗺, 🌈, ⓘ, 🔒. Nút kích thước 68×68 tốt, nhưng bé phải đoán; menu mở đè lên đề đang làm. Sửa: thêm nhãn chữ ngắn dưới biểu tượng. Mức: vừa.
- [ ] L3-11. Bé thoát ra ngoài app từ menu bé: ⓘ trong ⋯ mở bảng "Thông tin cho phụ huynh" có email liên hệ, "Quyền riêng tư", "Điều khoản", ba liên kết ngoài (Thông tư 32/2018…). Bé chạm nhầm sẽ rời trang. Nên đặt sau cổng phụ huynh 🔒. Mức: thấp.
- [ ] L3-12. Màn kết thúc vòng nhiều chip nhỏ, không nhãn: "+5", "5" (lửa), "+5 cà rốt", "+1" (🌱), "5/10" (🎁), "Xong nhiệm vụ! Khu vườn mở thêm một phần đất Tiếp theo: Mảnh đất cất nhà (còn 1)" thiếu dấu chấm trước "Tiếp theo", kèm "Cà Rốt đã về đích! Chương mới đang chờ." Bé không biết con số nào để làm gì. Sửa: một dòng điểm chính + nhãn chữ. Mức: thấp.
- [ ] L3-13. Phản hồi sai quá chung chung ở phần học chính: "Đọc kỹ lại nào!" / "Nhìn kỹ hình nhé!" (không nói sai chỗ nào); sau lần sai thứ hai tự đưa đáp án ("Đáp án là 8:05.") và chuyển câu, bé không được giải thích vì sao. Gợi ý 💡 có 3 bậc, không lộ đáp án (tốt) nhưng chung chung và không dùng số trong câu: "Chữ số hàng nghìn của số 81926" → "Đọc số từ PHẢI sang TRÁI…". Bậc 3 chỉ làm mờ 2 đáp án sai. Câu đồng hồ không có nút 💡. Mức: vừa.
- [ ] L3-14. Mô tả chủ đề ở Chương trình học là lời văn bản chương trình, không phải chữ cho bé: "Đọc văn bản văn học và thông tin phù hợp; nêu ý chính, nhân vật, sự việc và một số thông tin hỗ trợ.", "Nhận biết chủ đề, từ/cụm từ và thông tin đơn giản trong lời nói ngắn, rõ, quen thuộc." Thẻ chủ đề tiếng Anh lẫn "Nghe (Listening)". Chữ "Có bài học", "Xong là có 3 nhiệm vụ" ổn. Mức: thấp.

## 3. Nội dung / mức khó

- [ ] L3-15. Tiếng Việt lớp 3 quá dễ, đúng mức lớp 1: kiểu `pic`/`find` "Hình nào là quả chuối?" (🍇🍌🍎🍉), "Tìm con voi"; `sort` "đồ dùng học tập / con vật" (🐰📖🐟✏️🎒🐷); `match` "con mèo, cái cây, con chó, quả dâu"; `order` "Mẹ / nấu / cơm"; nghe–viết một từ "voi", "kẹo", "gà", "hồng"; `speak` "Em chào cô ạ.", "Em yêu mẹ của em."; ghép chữ "c-â-y", "t-h-ỏ". Mẫu `SAY` (qtypes.js dòng ~202) có cả câu mức 1. Bé lớp 3 sẽ thấy "trẻ con". Sửa: giữ từ/câu dài hơn, đoạn ngắn, chính tả cặp l/n, ch/tr, s/x, r/d/gi. Mức: cao.
- [ ] L3-16. Tiếng Anh lớp 3 mức rất dễ: "“How are you?” → I'm fine, thanks.", "Đây là gì? 🔑 key / 🖐 hand / 🐒 monkey", "Chọn cách viết đúng: ☁️ cloudy", "Hình nào là “bicycle”?". Phần "a hay an" có đáp án nhiễu vô lý: "Điền a hay an: This is __ ear." — two / a / many / an; "This is __ door." — an / many / a / two (hai số nhiều "two, many" loại ngay, chỉ còn 2 lựa chọn). Mức: vừa (kiểu en_a_an).
- [ ] L3-17. Câu mơ hồ, nhiều đáp án chấp nhận được: Tiếng Việt kiểu `dragfill` "Em yêu __" với thẻ "sách / ghế / rất / mẹ" — "Em yêu sách" và "Em yêu mẹ" đều hợp lý. Nguyên nhân: qtypes.js G.dragfill bốc ngẫu nhiên một từ trong câu mẫu và lấy từ nhiễu từ câu khác, không kiểm tra từ nhiễu có điền được không. Sửa: đặt từ nhiễu cùng loại sai về ngữ pháp hoặc dùng câu có đáp án duy nhất. Mức: vừa.
- [ ] L3-18. Câu "Điền dấu cuối câu" có thể chọn hai đáp án: "Hãy giúp mẹ rửa chén __" và "Con hãy đánh răng trước khi ngủ __" có đáp án "." nhưng "!" cũng là dấu câu khiến đúng (cả hai đều có lựa chọn "!"). Sửa: câu khiến thì bỏ "!" khỏi nhiễu hoặc dùng câu kể rõ ràng. Mức: vừa (skill `punct`).
- [ ] L3-19. "Sắp xếp thành đoạn văn" có thể đảo "Tiếp theo" và "Sau đó": "A. Tiếp theo, bạn tô màu… B. Trước hết, bạn chuẩn bị giấy… C. Sau đó, bạn vẽ ngôi nhà." đáp án B – C – A; nhưng "Tiếp theo" và "Sau đó" cùng nghĩa, bé khó biết vì sao tô màu đứng cuối (phải suy ra vẽ trước tô). Mức: thấp (skill `para_order`).
- [ ] L3-20. Số thập phân xuất hiện làm đáp án nhiễu ở lớp 3: "4 km = ? m" có "0,004 m"; "7 l = ? ml" có "0,007 ml"; "300 phút = ? giờ" có "0,5 giờ" và "18000 giờ". Lớp 3 chưa học số thập phân; làm bé thấy lạ, lo. Sửa: nhiễu là số tự nhiên (đổi nhầm hệ số). Mức: thấp.
- [ ] L3-21. Đa dạng thấp, lặp lại trong một vòng: Toán lớp 3 mẫu 120 vòng: `data_read` (đọc bảng thứ Hai–Năm bán sách) 80 câu và `place_value` (chữ số hàng …) 78 câu trên 488 mẫu khác nhau; vòng đầu của hồ sơ mới luôn mở bằng đọc bảng hoặc "Chữ số hàng …". Tiếng Việt: `antonym_pair` 29, `para_order` 27, nhiều "Từ nào trái nghĩa với …". Cùng từ "chim" ra hai lần trong một vòng ghép chữ (c-h-i-m). Bé thấy "lại nữa". Mức: vừa.
- [ ] L3-22. Câu "Viết câu" chỉ chấm hình thức, không chấm đúng đề: "Viết một câu về ngôi nhà" nhận "Em yêu mẹ rất nhiều vì mẹ luôn chăm sóc em mỗi ngày." (Bé đọc giỏi ghê!); "Viết một câu về buổi sáng" nhận "Mẹ em là cô giáo." (Hay quá!). Phản hồi sai: "Viết thêm cho đủ ý: câu cần ít nhất 4…" bị cắt chữ; "Em đi học." (3 từ) bị từ chối ở lớp 3 mà không nói rõ. Sửa: kiểm từ khoá chủ đề hoặc đổi lời khen thành "Câu đúng hình thức!"; hiển thị đủ lời nhắc. Mức: vừa.
- [ ] L3-23. Toán lớp 3: nội dung đúng với chương trình, kiểm ngẫu nhiên các kỹ năng không thấy đáp án sai: chữ số hàng nghìn của 81926 = 1; 63 ÷ 9 = 7; 1/3 của 21 = 7; diện tích 49 cm²; 63 kẹo chia 7 rồi thêm 5 = 14; "Bạn An cộng … An sai ở bước" khớp. Phạm vi số tới 100 000 đúng lớp 3. Không có lỗi đáp án trong mẫu đã soát (không tuyên bố đã soát hết 488 câu từng chữ). Mức: ghi nhận.

## 4. Động lực & niềm vui

- [ ] L3-24. Không có "điểm cao"/so sánh cho bé 8–9 tuổi: kết thúc vòng chỉ "+5" và chuỗi lửa; Của bé (vòng ngang) chỉ ⭐ tổng và 3 nút to ("Khu vườn", "Bạn của bé", "Chơi"); không có kỷ lục bản thân, mốc "vượt chính mình", bảng bạn bè, huy hiệu theo tuần. Bé lớp 3 thích thử thách có thể chán. Sửa: dòng "Kỷ lục: 5/5 — bé đang giỏi hơn tuần trước", huy hiệu thử thách (vòng khó). Mức: vừa.
- [ ] L3-25. Vườn: lời hứa và thực tế lệch nhau — hộp thoại "Bác Rễ tặng bộ khởi đầu lớp 3: 3 hạt giống, nhà, ruộng và vài bạn vật nuôi!" nhưng khu vườn trống: một ngôi nhà, vài mảnh đất, một hộp quà; hướng dẫn nói "Vườn của bé còn trống trơn… Làm 5 nhiệm vụ là xong nhà". "Chọn bạn làm vườn" hỏi "Bé mấy tuổi? 5–7 / 8–10" (ổn). Mới vào bé phải làm 1 nhiệm vụ mới có đất; ô "Trồng gì nào?" chỉ hiện Cà rốt (Toán) và Dâu tây (Tiếng Anh), không thấy cây của Tiếng Việt. Mức: vừa; cần kiểm lại cây lúa mì khoá hay lỗi.
- [ ] L3-26. Bộ sưu tập (`learn/album`): 0/28 toàn ô "?" bóng mờ (Bạn Số 0/11, Bạn Chữ 0/17), chạm vào ô khoá không hiện gì (không nói cách mở), không có Bạn Anh. Bé không biết làm gì để có bạn mới. Sửa: chạm ô khoá hiện "Hoàn thành chủ đề … để mở". Mức: vừa.
- [ ] L3-27. Trang "Của bé" (`learn/me`) hiển thị khác nhau giữa các lần tải: lần đầu có "Bé học thế nào?" (sao, ngày liền, nông sản, hạt giống), lịch T2–CN, "Bạn Mây đến vườn", "Đảo Trăng Tròn"; lần sau chỉ ⭐ 0 và 3 nút to, tab "Lớn lên" bị cắt mép phải ở 390px. Có thể do các gói khác đang sửa song song; cần xác nhận. Mức: thấp.
- [ ] L3-28. Lời linh vật có động viên theo chuỗi ("Ba câu liền! Giỏi ghê!", "Bé đang bốc lửa rồi!") và bóng chữ "3 liên tiếp!" đè lên bong bóng đáp án trong kiểu `pop` (đẹp nhưng che chữ vài giây). Mức: thấp.

## 5. Điểm tốt nên giữ

- [ ] L3-29. Cảm ứng kéo thả hoạt động tốt: touchStart/Move/End giả lập thành công cho `sort` (kéo vào rổ), `dragfill`, `order`, `match`; chạm-để-chọn cũng thay được. Phản hồi mờ nút sai, tô xanh đúng rõ.
- [ ] L3-30. Gõ số: bàn phím số trên màn hình + bàn phím vật lý đều dùng được (Enter chấm), ô nhập không bật bàn phím hệ thống.
- [ ] L3-31. Bố cục tự co chữ: không tràn/cắt ở 360×640 và iPad cho cả 40 kiểu câu; nút đáp án to (hầu hết cao >56px), chữ đề to rõ.
- [ ] L3-32. Gợi ý 💡 3 bậc không lộ đáp án; bậc 3 làm mờ 2 đáp án sai; sau 2 lần sai mới hiện đáp án — cân bằng tốt.
- [ ] L3-33. Chấm Viết câu cho lời nhắc cụ thể, thân thiện ("Chữ đầu câu phải viết hoa nhé.").
- [ ] L3-34. Màn kết thúc có linh vật, 5 sao, nhiệm vụ vườn, nút "Chơi lại / Khu vườn / Trang học" to rõ; chuỗi ngày, quà mốc hiện tức thì. Cổng bật loa lớn, một nút, có nút tắt tiếng nhỏ.
- [ ] L3-35. Toán lớp 3 bám chương trình (số đến 100 000, 4 phép tính, phân số 1/3 của số, diện tích, chu vi, đo lường, thống kê, số La Mã), đa dạng kiểu chơi (đồng hồ, trục số, phân loại, tìm lỗi sai của bạn An).

## Tóm tắt 10 dòng gửi điều phối

1. Lỗi cao nhất: kiểu "Viết câu" (VI/EN) bị `.q small` đè lên đề, thấy chỉ viên thuốc nhắc bị cắt (L3-01).
2. Bài học `lop/bai.html` gần như không dạy: bong bóng chữ chương trình, khung trống, lời giải sai chỗ (L3-06..09); các tệp `g3_*.js` là bản nháp tự sinh.
3. Tiếng Việt và Tiếng Anh lớp 3 dễ như lớp 1 (chọn quả chuối, "Em chào cô ạ", nghe–viết một từ) (L3-15, 16).
4. Câu mơ hồ: dragfill "Em yêu __" (sách/mẹ), dấu cuối câu ("." hay "!"), "a/an" nhiễu vô lý, thứ tự "Tiếp theo/Sau đó" (L3-17..19).
5. Nhiều đáp án nhiễu thập phân (0,004 m) ở lớp 3; vòng chơi lặp (đọc bảng, chữ số hàng) (L3-20, 21).
6. Xoay ngang: nút Đúng/Sai bẻ chữ từng chữ, trang vẫn cuộn (L3-02, 04); 360×640 và iPad sạch.
7. Kéo thả cảm ứng, gõ số bằng bàn phím, gợi ý 3 bậc, bố cục tự co chữ đều tốt (mục 5).
8. Viết câu chấm hình thức, nhận câu lạc đề; lời nhắc bị cắt "…" (L3-22).
9. Động lực yếu cho tuổi này: không kỷ lục/so sánh, vườn trống lệch lời hứa, album toàn "?" không chỉ cách mở (L3-24..26).
10. Console sạch (chỉ favicon.ico 404 và /hoc/ 404 trên máy chủ tĩnh); chưa kiểm được giọng đọc thật và nút "Đọc to" (micro).
