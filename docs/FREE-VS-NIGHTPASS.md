# Free vs Night Pass: bảng sự thật (đối chiếu code thật)

Nguồn sự thật cho mọi chữ công khai nói về "bản miễn phí" và "Night Pass" (subscribe.html, landing, terms, privacy, FAQ/JSON-LD, docs/LANDING-PAGE-BRIEF.md, launches.json, PDF pháp lý). Lập ngày 2026-11-11 bằng cách đọc code và chạy Chrome thật (puppeteer-core) ở hai trạng thái: KHÔNG có Night Pass và CÓ Night Pass (giả token + trả `server/pro/<id>.js` qua request interception).

Khi đổi sản phẩm (thêm khoá/mở khoá), cập nhật file này TRƯỚC, rồi sửa chữ công khai cho khớp.

## 1. Kết luận ngắn

- KHÔNG có giới hạn "3 game" hay "30 phút/ngày" ở bản Free. Cả 32 game (Pop Play 12 + Night Play 20) đều chơi được ngay, không giới hạn thời gian. Con số "3 game / 30 phút" chỉ có trong kế hoạch kinh doanh ban đầu `flow.md` (ghi "giá giả thuyết", ví dụ game Dò mìn/Rắn/2048 không tồn tại) và đã bị chép nhầm vào subscribe.html, landing, terms.
- Giới hạn thời gian chỉ do PHỤ HUYNH tự đặt (15/30/45/60/90/120 phút/ngày, 0 = không giới hạn): `popplay/index.html:597`, `cozyplay/index.html:605` (`TIME_OPTS`, `prefs.limit`). Miễn phí, không gắn với Night Pass.
- Night Pass thực chất mở: (a) các CHẾ ĐỘ/loại chơi phụ, (b) GIAO DIỆN (skin) đặc biệt, (c) vài tính năng riêng của một số game (Đập Deadline, Bạn Có Hiểu Tôi Không?, Xe Cà Phê...), (d) huy hiệu 👑 trên bảng xếp hạng. Mỗi game có sẵn 1 chế độ + 1 giao diện cơ bản miễn phí.
- Mã phần trả phí KHÔNG nằm trong file công khai: chỉ giao qua `GET /api/pro/<id>.js` khi có token còn hạn (hoặc vé chơi hộ 24 giờ, hoặc dùng thử 1 lượt/ngày). `server/app.js:850-1062`.

## 2. Cơ chế khoá

| Thành phần | Free | Night Pass | Dẫn chứng |
|---|---|---|---|
| Mã chế độ/skin | Không tải | Tải `/api/pro/<id>.js`, chạy `main(PF)` | `server/app.js:1018-1066`, `scripts/cozygame/tpl.html:213-221` |
| Loại chơi (types) | chỉ loại số 0 (`PF.types = TYPES.map((_,i)=>i===0)`) | tất cả | `tpl.html:142-144` (game Cozy sinh tự động) |
| Giao diện | `basic` | thêm 4 skin (hoặc 4 skin mỗi loại) | `server/pro/*.js` (đã chạy kiểm: bảng mục 3) |
| Dùng thử | 1 lượt/ngày/game/IP (`trial_used` HTTP 429) | không cần | `server/app.js:873,885,897,909,921,1036,1060` |
| Vé chơi hộ | người có Pass cấp vé 24 giờ cho bạn chơi tiếp đúng chế độ trả phí | | `server/app.js:861-868` |
| Thử thách ngày Đập Deadline | khoá | mở (API `/api/pro/daily`) | `server/app.js:1081-1087` |

## 3. Bảng thật theo từng game

Cách đọc: "Free" = chơi được ngay không có Pass (đã xác nhận bằng Chrome: các nút khác có 🔒 và bấm vào hiện hộp mời Night Pass/dùng thử). "Pass" = phần mở thêm. "Thử thách hôm nay/đề hôm nay" (daily), "Chơi ngẫu nhiên", khoe điểm, thách đấu, chơi hộ: MIỄN PHÍ ở mọi game, trừ Đập Deadline (mục 3.1).

### 3.1 Night Play (Cozy), 20 game

| Game | Free | Night Pass mở thêm |
|---|---|---|
| Đập Deadline | Chế độ Cổ điển, mức Thường, bàn 3×3, gói Deadline, giao diện mặc định (`cozyplay/games/dap-deadline/index.html:845-850`). Thử thách ngày bị khoá (🔒 trên thẻ "Thử thách hôm nay") | Vô tận, Thử thách ngày, Boss; mức Dễ/Khó/Sếp nổi giận; bàn 4×4, 5×5, 6×6; gói Thú vật + Người yêu; 4 giao diện (Cà phê, Retro, Neon, Sakura); thống kê (lịch sử, biểu đồ, combo); dùng thử 1 lượt Vô tận/ngày |
| Cánh Nhỏ Phiêu Lưu | cả 5 chuyến bay, 3 độ khó, giao diện cơ bản mỗi chuyến, thử thách ngày | 20 giao diện (4 mỗi chuyến) |
| Đoán Giá Chợ Việt | trọn game, 1 giao diện | 4 giao diện |
| Sếp Ơi Em Xin Nghỉ | trọn game với sếp Hùng | 4 sếp khác (mỗi sếp một tính cách + giao diện + câu trả lời) |
| Bạn Có Hiểu Tôi Không? | gói "Bạn bè", 5 người trên bảng kết quả (`FREE_BOARD=5`), 3 lần đổi câu (`FREE_REROLL=3`), 4 ảnh đại diện (`AV_FREE=4`) | 3 gói câu hỏi (Cặp đôi, Nhóm công ty, Gia đình), tự viết tối đa 3 câu, bảng kết quả không giới hạn + thống kê "câu khó nhất", ảnh đại diện mở rộng, 4 giao diện |
| Xe Cà Phê Của Tôi | chế độ "Bán 7 ngày", thử thách ngày | chế độ Giờ cao điểm + Quán đêm, quầy lên Quán/Chuỗi, nhân viên, 6 công thức, nâng cấp cao nhất, 4 giao diện |
| Đổi Đời 2048 | loại "Đổi Đời" (1 giao diện) | 3 loại (Ẩm Thực, Vũ Trụ, Tiền Tài), 16 giao diện (4 mỗi loại) |
| Gà Mẹ Bắn Trứng | loại Cổ điển, 3 độ khó | 4 loại (Cứu gà con, Luật quái, Đua 60 giây, Trứng sập), 8 loài hiếm, 4 giao diện |
| Mê Cung Truyền Tay | loại Cổ điển | 5 loại (tối, dịch chuyển, khổng lồ, mực loang, pha màu), 4 giao diện |
| Chở Hàng Kiểu Việt | loại Đường làng, 3 độ khó | 3 loại (Chợ Tết, Mưa bão, Đua 60 giây), 4 giao diện |
| Bao Nhiêu Giây? | Cổ điển 10 giây | 3 loại (Đếm nhịp, Mốc ngẫu nhiên, Marathon 30 giây), 4 giao diện |
| Cắt Bánh Chưng | Cắt đôi | 3 loại (xoay, cắt ba, sương mù), 4 giao diện |
| Đường Ray | Đường ray cổ điển | 3 loại (Bẻ ghi, Đêm bão, Siêu tốc), 4 giao diện |
| Mắt Tinh Không? | Khác màu | 3 loại (Xoay sắc, Nhấp nháy, Đảo ô 30 giây), 4 giao diện |
| Né Ổ Gà Mùa Mưa | Mưa phùn | 3 loại (Bão, Xe ngược chiều, Đêm pin yếu), 4 giao diện |
| Nối Một Nét | Cổ điển 90 giây | 3 loại (Một chiều, Nhớ đường, Đi hai lần), 4 giao diện |
| Shipper Siêu Tốc | Cổ điển 5 đơn | 3 loại (Đơn dồn dập, Đồ nguội, Xe tải), 4 giao diện |
| Sống Sót Đến Cuối Tháng | Lương 8 triệu | 3 loại (Tết, Sale, Học bổng), 4 giao diện |
| Vẽ Một Nét | Hình tròn | 3 loại (Vẽ mù, Theo mẫu mờ, Vẽ 3 giây), 4 giao diện |
| Xây Cầu Tre | Cầu tre | 3 loại (sông rộng có trụ, mưa gió, hàng nặng), 4 giao diện |

### 3.2 Pop Play (cho bé), 12 game

Quy tắc chung (đã xác nhận bằng Chrome không Pass: không có nút nào khoá ngoài nút giao diện): MỌI loại chơi và MỌI cấp (🌱🌿🌳, Bé Đấu Bố Mẹ có thêm cấp 4) đều miễn phí, thử thách hôm nay miễn phí. Night Pass chỉ mở GIAO DIỆN (nhấn 🎨, hộp mời dành cho phụ huynh).

| Game | Free | Night Pass mở thêm |
|---|---|---|
| Chim Bay Học Vui | cả 3 trò (Chữ cái, Đếm sao, Tàu bay phép tính), mỗi trò 1 giao diện, thống kê học | 15 giao diện (5 mỗi trò) |
| Bé Đấu Bố Mẹ | 5 loại câu hỏi, 4 cấp | 20 giao diện (4 mỗi loại) |
| Làng Của Bé | 3 khu, thử thách hôm nay | 12 giao diện (4 mỗi khu) |
| Tên Lửa Của Bé, Bé Nói Đúng Không?, Bố Mẹ Thử Thách 5 Giây, Con Vật Ăn Số, Đoán Xem Bé Mấy Tuổi, Nhảy Theo Số, Qua Sông Cùng Bé, Tháp Vòng Màu, Vẽ Chữ Thành Quái Vật | mọi loại (4 mỗi game), 3 cấp, thử thách hôm nay | 16 giao diện (4 mỗi loại; đã đếm bằng Chrome có Pass) |

Không nêu một con số tổng giao diện (như "20 skin") trên trang công khai; chỉ nêu số theo từng game khi cần.

### 3.3 Tính năng chung (cổng + hạ tầng)

| Tính năng | Free | Night Pass | Dẫn chứng |
|---|---|---|---|
| Số game chơi được | 32/32 | 32/32 | `play/`, `popplay/`, `cozyplay/` (không có khoá nào theo game) |
| Hẹn giờ chơi, bật/tắt game, khoá màn hình trẻ em, cổng phụ huynh | Có | Có | `TIME_OPTS`, `shared/kidlock.js` (không gọi API Pass) |
| "Hẹn giờ đi ngủ" | chính là giới hạn phút/ngày ở trên (#sleep "hết giờ"), không có tính năng riêng của Pass | | `cozyplay/index.html:652`, `popplay/index.html:644` |
| Chơi cùng lúc | Có: điện thoại 2 khung, máy tính bảng 3-4, máy tính 4-6 | giống Free | `cozyplay/multi.html:250-252` |
| Chơi hộ, thách đấu, thử thách hôm nay (trừ Đập Deadline), tiếp tục ván dở, khoe điểm | Có | Có | `shared/resume.js`; vé chơi hộ chỉ để mở phần trả phí |
| Bảng xếp hạng | Có | Có + huy hiệu 👑 cạnh tên | `server/app.js:804` (cờ `pro`), `leaderboard.html:76` |
| Quảng cáo / theo dõi cá nhân | Không | Không | cả hai |
| Số thiết bị mỗi gói | (không áp dụng) | CHỦ ĐÍCH 3 (`MAX_DEVICES`) nhưng HIỆN ĐANG TẮT: `wrangler.jsonc:14` `DEVICE_LOCK=off` → không thu hồi thiết bị thứ 4 (`server/app.js:91,96`) | xem mục 5 |

## 4. Rà soát các tuyên bố công khai khác

| Tuyên bố | Kết quả | Hành động |
|---|---|---|
| "Free: 3 game, 30 phút/ngày, chế độ Cổ điển" (subscribe, landing VI/EN, terms mục 3) | SAI | Đã sửa (bảng mục 3 làm chuẩn) |
| "Night Pass: Tất cả game, chơi không giới hạn thời gian" (subscribe inc1/inc2/sub, landing perks, terms 4, nhãn nút `upgrade` ở 3 cổng "Night Pass: mở tất cả game") | SAI (Free đã có tất cả game, không giới hạn thời gian) | Đã sửa |
| "Chế độ Vô tận, Thử thách ngày, Boss, 4 độ khó" như quyền lợi chung | CHỈ ĐÚNG ở Đập Deadline | Đã chuyển thành ví dụ "Ở Đập Deadline..." |
| "Chủ đề, thống kê, huy hiệu: Free = Không" | SAI một phần: Free có 1 giao diện cơ bản/game, thống kê học của Chim Bay Free; chủ đề đặc biệt + thống kê Đập Deadline + huy hiệu 👑 là của Pass | Đã sửa |
| "Hẹn giờ đi ngủ tự đặt" liệt kê như perk Night Pass | SAI: là giới hạn phút/ngày miễn phí của phụ huynh | Đã bỏ khỏi perk; đổi tên hàng bảng thành "Hẹn giờ chơi do phụ huynh đặt" (cả hai cột ✓) |
| "Chơi cùng lúc 2–4 game" | LỆCH: điện thoại 2, máy tính bảng 3-4, máy tính 4-6 (`multi.html:250-252`) | Đã sửa thành "2 game trên điện thoại, tới 4–6 trên máy tính bảng/máy tính" |
| Hộp mời trong game Pop ("và 19 giao diện đẹp khác") | SAI ở 4 game (Tên Lửa, Con Vật Ăn Số, Đoán Tuổi, Nhảy Theo Số có 16 giao diện Pass, tức "15 khác") | Đã sửa chuỗi VI+EN |
| "Pop Play 12 game, Night Play 20 game" | ĐÚNG (12 + 20 thư mục game) | giữ |
| "Chọn 15, 30, 45, 60, 90 hoặc 120 phút" | ĐÚNG (`TIME_OPTS`) | giữ |
| Giá 9.000 / 18.000 / 36.000 / 199.000đ, 1/7/30/365 ngày | ĐÚNG khớp `PLANS` (`server/app.js:45`); `check-subscribe.js` đã đối chiếu | giữ |
| "Không tự gia hạn" | ĐÚNG: không có cơ chế định kỳ trong code (đơn một lần VietQR) | giữ |
| "Kết quả chơi hộ xoá sau tối đa 24 giờ" | ĐÚNG (`server/app.js:823` interval '24 hours', dọn `:143`) | giữ |
| Bản ghi "đang chơi" dọn sau tối đa 1 ngày (privacy) | ĐÚNG (`server/app.js:142`) | giữ |
| "Ván dở giữ 7 ngày" | ĐÚNG (`shared/resume.js:29`) | giữ |
| Hoàn tiền 3 ngày đầu / khiếu nại 7 ngày / lưu 10 năm | Là cam kết chính sách (không kiểm bằng code); đã chủ site duyệt ở commit 808f97a | giữ, chủ site tự xác nhận |
| "Nhắc trước 1 ngày khi hết hạn" | KHÔNG tìm thấy tuyên bố này ở trang công khai nào và cũng không có code gửi nhắc | không cần sửa |
| "20 skin" | KHÔNG còn xuất hiện ở trang công khai; con số thật theo game ở mục 3 | không nêu số tổng |
| "Tối đa 3 thiết bị mỗi gói; thiết bị thứ 4 vào thì thiết bị cũ nhất bị thu hồi" (terms mục 1 tóm tắt + mục 8, landing FAQ + JSON-LD, brief FAQ 7, subscribe "Thiết bị: n/3") | CHƯA CHẮC / ĐANG KHÔNG ĐÚNG TRÊN PRODUCTION vì `DEVICE_LOCK=off` | KHÔNG tự sửa, hỏi chủ site (mục 5) |

## 5. Việc cần chủ site quyết định

1. Thiết bị: hoặc bật lại `DEVICE_LOCK` (xoá dòng `vars` trong `wrangler.jsonc` rồi deploy, sau khi mọi người đã khôi phục token gắn thiết bị), hoặc sửa chữ ở terms mục 1/8, landing FAQ + JSON-LD, brief, subscribe để không hứa "tối đa 3 thiết bị bị thu hồi". Cho tới lúc đó trang công khai hứa điều code chưa thực thi.
2. Giá trị của Night Pass đang MỎNG đối với người chơi bình thường: Free đã chơi được hết 32 game, không quảng cáo, không giới hạn thời gian. Night Pass là "thêm phần": chế độ phụ + giao diện + vài tính năng riêng. Gợi ý làm rõ (không đổi sản phẩm ở lượt này):
   - Nói thẳng trên trang giá: "Game nào cũng chơi miễn phí; Night Pass là bản đẹp và đầy đủ hơn" (đã làm).
   - Dùng "ví dụ" cụ thể mỗi game ngay ở trang giá (ảnh 2-3 skin/chế độ nổi bật) thay vì liệt kê chung chung.
   - Bảng giá trị theo nhóm: Night Play (chế độ phụ + skin + tính năng riêng như Xe Cà Phê/Bạn Có Hiểu Tôi) khác với Pop Play (chỉ skin, dành cho phụ huynh).
   - Cân nhắc gom thêm 1-2 lợi ích rõ ràng, dễ hiểu cho Pass (ví dụ thống kê tiến bộ dùng chung cho mọi game, "thử thách ngày" mở cho Đập Deadline tương tự các game khác) nếu muốn người dùng thấy giá trị tức thì.
3. Trang `subscribe.html` hiển thị "Thiết bị: n/max" lấy từ API; khi khoá đang tắt có thể hiện n lớn hơn 3.

## 6. Cách đã kiểm chứng

- Chrome thật, 390×844, mọi game ở trạng thái KHÔNG có Pass: liệt kê các nút có lớp `lock`, mở popup 🎨 đếm skin (`cozyplay/*`, `popplay/*`): mọi game có đúng 1 skin mở + 4 khoá (Chim Bay: 5); nút loại chơi khoá khớp bảng 3.1.
- Chrome thật với token giả + `server/pro/<id>.js` trả qua interception: mọi khoá mất (`locks=0`), số skin Pass đếm được: 4 (game một danh mục), 16 (Đổi Đời 2048, 8 game Pop 4 loại), 20 (Bé Đấu Bố Mẹ), 12 (Làng Của Bé).
- Đọc code: `server/app.js` (PLANS, `/api/pro`, trial, device), `scripts/cozygame/tpl.html`, `server/pro/*.js` (đầu file), game viết tay.
