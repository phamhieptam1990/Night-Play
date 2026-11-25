# Kế hoạch 2 game: Tiếng Việt (nuôi thú) + Tiếng Anh (tiệm kem)

Trạng thái: **đề xuất v2, chờ chủ site duyệt** (chưa làm code). Cập nhật 2026-11-25.
Chủ site chốt: game nuôi thú CHỈ cho Tiếng Việt; Tiếng Anh là game khác (mục 7). 3D giả bằng CSS/SVG (không three.js); KHÔNG làm kiểu thú ăn trên băng chuyền; làm kiểu **nuôi MỘT con vật thật dễ thương: tắm rửa, cho ăn, đồ chơi; học xong một bài thì có đồ để chăm**.

## 1. Vòng lặp chính (game nuôi thú Tiếng Việt)
1. Bé học một bài (vòng 5 câu của Học Vui, nội dung theo lớp).
2. Xong bài: nhận **quà chăm sóc** theo số câu đúng: 🍎 thức ăn, 🧼 xà phòng, 🧸 đồ chơi, thỉnh thoảng có món mới hiếm.
3. Về **nhà của thú**: bé tự chọn chăm gì bằng cách chạm/kéo thả.
4. Thú vui lên, lớn dần, mở thêm phòng và đồ. Bé muốn có quà nên học tiếp.

## 2. Chăm thú (3D giả bằng CSS/SVG)
- Thú vẽ SVG nhiều lớp (thân, đầu, tai, đuôi, mắt, miệng), nhìn hơi xiên, có bóng dưới chân, thở nhẹ, chớp mắt, nghiêng đầu theo ngón tay. Phòng là hộp CSS `perspective` (sàn, hai tường, cửa sổ).
- **Tắm:** kéo vòi sen/bọt xà phòng lên người thú, thú rung rinh, bọt nổi, xả nước, lau khô, lông bóng. (Hết bẩn thật sự thấy được: chấm bùn mờ dần.)
- **Ăn:** kéo món vào miệng, thú nhai, má phồng, ợ nhỏ rồi cười.
- **Chơi:** thả đồ chơi (bóng, xe, đàn, diều…), thú đuổi, nhảy, ôm. Mỗi đồ có hoạt ảnh riêng.
- **Ngủ:** tắt đèn, thú ngáp, "Zzz"; sáng hôm sau chào bé.
- Ba chỉ số đói / sạch / vui chỉ là vòng tròn đầy dần. **Không có chết, không phạt, không dọa**: lâu không chơi thú chỉ "nhớ bé" và ôm bé khi bé quay lại.

## 3. Gắn với việc học (nhẹ, không biến thành đố bé)
- **Tiếng Việt:** khi chăm, thú "nói" bằng chữ: tên món ăn, đồ chơi hiện thành chữ/vần to để bé đọc theo, thú khen bằng câu có dấu câu đúng. Bài tập chính vẫn là vòng 5 câu, nguồn `learn/content/bank.js` + `learn/lang/`.
- Nhiều quà hơn khi bé làm đúng và làm đều mỗi ngày (kho `learn:farm`, nhiệm vụ ngày có sẵn).

## 4. Bạn thú Tiếng Việt
Một bạn thú (thỏ hoặc mèo, chờ chủ site chọn), phòng ấm như thư viện nhỏ. Nở từ trứng, lớn theo lớp (lớp 1 bé con → lớp 5 trưởng thành), mặc được đồ trong `Farm.OUTFITS` (nơ, mũ, kính…).

## 5. Phần dùng chung (làm một lần)
- Khung phòng 3D giả + bộ thú SVG nhiều lớp + hoạt ảnh tắm/ăn/chơi/ngủ, tách module (`css/`, `js/`), mỗi tệp ≤ 400 dòng.
- Lưu trạng thái thú và đồ trên máy (khoá riêng trong `learn:farm`), không gửi ra ngoài; có thể có nhiều hồ sơ bé sau này.
- Linh vật chính của game = chính bạn thú (GAME_RULES mục 0 bước 5).

## 6. Checklist (tick khi xong)
- [x] Chủ site duyệt Tiếng Anh = "Tiệm Kem Vui" (2026-11-25)
- [ ] Chủ site chọn thú Tiếng Việt (thỏ hay mèo; mặc định thỏ nếu không nói) và duyệt cách nhận quà
- [ ] Đọc GAME_RULES.md (1 màn hình không cuộn, nút ←, gợi ý ?, màn ngang, chơi hộ tiếp tục, thách đấu, Night Pass khác free)
- [ ] Đọc docs/MASCOT-ART-RULES.md, vẽ thú SVG nhiều lớp (phong cách Pop)
- [ ] Khung phòng 3D giả + hoạt ảnh tắm / ăn / chơi / ngủ (dùng chung)
- [ ] Kho quà + chỉ số + lưu trên máy
- [ ] Game Tiếng Việt: nối bài học 5 lớp
- [ ] Game Tiếng Anh (mục 7): nối bài học lớp 3-5, lớp 1-2 làm quen
- [ ] Đăng ký vào Pop Play, cache `sw.js`
- [ ] Đo bằng Chrome thật (dọc 390×844, 360×640, ngang 844×390) và tự nhìn ảnh

## 7. Tiếng Anh: "Tiệm Kem Vui" (đề xuất, chờ duyệt)
Bé là chủ tiệm kem. Khách là các bạn thú nói tiếng Anh; bé nghe rồi làm đúng, khách vui thì tiệm lên cấp.
- **Cảnh (3D giả):** quầy kem nhìn xiên, tủ kem nhiều vị, khách đứng trước quầy, chuông cửa leng keng.
- **Cách chơi theo lớp:**
  | Lớp | Khách nói / bé làm |
  |---|---|
  | 1-2 (làm quen) | "Red, please!" → chọn vị đúng màu; nghe số 1-5 → xếp đúng số viên |
  | 3 | "One strawberry ice cream, please." → nghe, lấy đúng vị + số viên (Listening) |
  | 4 | hỏi đáp: "What flavour do you like?" bé chọn câu đáp đúng; đọc thực đơn có chữ (Speaking + Reading) |
  | 5 | khách đưa mẩu giấy gọi món, bé đọc và làm; xếp chữ viết tên vị mới lên bảng (Reading + Writing) |
- **Thưởng:** mỗi khách vui = 1 ⭐ + xu; xu mua vị kem mới, topping, bàn ghế, biển hiệu. Khách sai thì khách nói lại, không có phạt.
- **Vì sao chọn:** khác hẳn nuôi thú và thú ăn, nghe–nói–đọc–viết đều dùng được, từ vựng (màu, số, đồ ăn) khớp chương trình Tiếng Anh, tương tác kéo thả thật. Dữ liệu từ `learn/lang/data-en.js`, `gen-en.js`, `gen-listen.js`.
- **Phương án thay (nếu không thích):** "Phi Công Bay Vòng Quanh Thế Giới" (nghe chỉ dẫn, mỗi bài một thành phố) hoặc "Thám Tử Tìm Đồ" (I spy: tìm vật trong phòng theo lời mô tả).

## 8. Thứ tự làm (đề xuất)
1. **Tiệm Kem Vui** trước (đã duyệt): game Pop Play riêng `popplay/games/tiem-kem-vui/`, tách `css/` + `js/` (không nhồi vào một HTML). Cột mốc 1 = lớp 3 chạy được từ đầu đến cuối (khách gọi → bé làm → thưởng), có "?", ←, chơi hộ, thách đấu, linh vật; cột mốc 2 = lớp 1-2, 4, 5; cột mốc 3 = giao diện Night Pass.
2. Khung phòng 3D giả dùng chung rút ra từ tiệm kem (quầy) rồi tái dùng cho phòng thú.
3. Game nuôi thú Tiếng Việt.

## 9. Mỗi lớp một con thú / một tiệm (chủ site đề xuất 2026-11-25; GHI ĐÈ mục 4 và mục 7 về "một con / một tiệm")
Khớp với vườn Học Vui, vốn đã tách ngăn theo **lớp × môn** (`learn/slot.js`): mỗi lớp là một thế giới riêng, lên lớp mở thế giới mới, thế giới cũ vẫn còn.

| Lớp | Thú (Tiếng Việt) | Tiệm (Tiếng Anh) | Khách nói / bé làm |
|---|---|---|---|
| 1 | thỏ | Tiệm Kem | chọn vị theo màu, xếp số viên 1-5 |
| 2 | mèo | Tiệm Bánh | nghe số + tên bánh, lấy đúng |
| 3 | cún | Quán Nước Ép | "One orange juice, please." nghe, lấy đúng vị + số ly |
| 4 | gấu trúc | Nhà Hàng Pizza | hỏi đáp "What would you like?", đọc thực đơn |
| 5 | cáo (hoặc rồng nhỏ) | Quán Cà Phê Sách | đọc mẩu giấy gọi món, xếp chữ viết thực đơn mới |

Tên thú và tiệm là gợi ý, chủ site đổi được. Mỗi lớp có độ khó và dạng bài riêng nên tiệm càng lên lớp càng "người lớn" (từ tiệm kem đến quán cà phê).
- **Bé nhìn thấy gì:** lớp đang học là thế giới chính; các lớp đã qua nằm trong "Bộ sưu tập" (thú đã nuôi, tiệm đã mở) để bé quay lại chơi.
- **Làm theo dữ liệu, không nhân đôi mã:** MỘT bộ máy phòng/quầy + MỘT bộ khung thú (thân, đầu, tai, đuôi, mắt, miệng); mỗi lớp chỉ là một tệp dữ liệu (hình dạng thú, bảng màu, đồ chơi, thực đơn, mẫu câu). Thêm lớp = thêm dữ liệu + tranh, không viết lại logic.
- **Khối lượng tranh tăng:** 5 thú + 5 tiệm (phong cách Pop, theo MASCOT-ART-RULES). Vì vậy cột mốc 1 chỉ làm **lớp 3 đầy đủ** (cún + Quán Nước Ép), 4 lớp còn lại thêm dần.
- Lưu: mỗi lớp một ngăn trên máy, dùng cơ chế `learn/slot.js`.

## 10. CHUẨN TRANH 3D GIẢ cho vật phẩm / đồ vật / thú (chủ site yêu cầu 2026-11-25: "giả 3D thật đẹp")
Áp dụng cho MỌI thứ bé nhìn và chạm: thú, kem, bánh, ly nước ép, pizza, cà phê, xà phòng, bóng, đồ chơi, nội thất, quầy, phòng.

**Va chạm luật cũ cần chủ site duyệt:** MASCOT-ART-RULES mục 1 quy Pop = "đồ chơi mềm" (gradient 2 điểm dừng, không viền đen), còn "3D mềm" (mục 11) đang dành cho Night. Hai game này nằm ở Pop Play nhưng cần độ đẹp "3D mềm". Đề xuất: **"Pop 3D"** = hình khối và bảng màu Pop (tròn, ấm, KHÔNG viền đen) + kỹ thuật đổ khối của mục 11. Chờ chủ site gật mới vẽ hàng loạt.

**Công thức một vật (mọi vật làm theo, để cả bộ nhìn thống nhất):**
1. **Một nguồn sáng duy nhất**, trên-trái, cho cả phòng (sai hướng là nhìn rẻ ngay).
2. **Thân:** gradient xuyên tâm sáng ở trên-trái, tối dần về dưới-phải; thêm một lớp bóng tối nhẹ ở đáy (cùng màu thân, đậm hơn, KHÔNG xám).
3. **Vệt bóng bóng (specular):** một vệt trắng cong + một chấm nhỏ; vật bóng (ly, bóng, kem) vệt rõ, vật nhám (lông thú, bánh mì) vệt mờ.
4. **Ánh sáng viền (rim light)** mỏng ở cạnh đối diện nguồn sáng, cho vật tách khỏi nền.
5. **Độ dày thật:** vật dẹt (biển, thực đơn, đĩa) có mép dày (một lớp lệch 3-6 đơn vị, tối hơn), không vẽ phẳng.
6. **Bóng tiếp đất:** hình elip mờ ngay dưới vật; vật nhảy thì bóng nhỏ và nhạt lại. Bóng đổ lên bàn/quầy cũng theo nguồn sáng.
7. **Chiều sâu phòng:** vật gần to + nét rõ, vật xa nhỏ + nhạt chút; sàn/quầy nhìn xiên cùng một góc.
8. **Chuyển động có khối:** khi chạm, vật nhún (scale + dịch bóng), không chỉ đổi màu.
9. Kỹ thuật: SVG, đọc được ở 40px, KHÔNG filter nặng (dùng gradient + opacity), chỉ animate transform/opacity; chạy ổn trên iPhone đời thấp (docs/PERF-BUDGET.md).

**Cách làm ra hàng trăm vật mà vẫn đẹp, đồng đều:** KHÔNG vẽ tay từng tệp. Viết bộ sinh `scripts/art/gen-tiem-thu.js` (kiểu `gen-night3d.js`): mỗi vật = một hàm nhận bảng màu và trả SVG theo công thức trên; chạy ra `shared/art/...`. Đổi công thức một chỗ thì cả bộ đổi theo; cùng một vật ra được nhiều vị/màu.

**Duyệt trước khi làm nhiều:** làm một **trang xem mẫu** (như `night3d-sheet.html`) gồm 1 thú + 1 quầy + 8 vật, ở 40px / 120px / 300px, sáng và tối. Chủ site duyệt trang này, rồi mới sinh cả bộ.

### Checklist tranh
- [ ] Chủ site duyệt "Pop 3D" (ngoại lệ có kiểm soát của luật Pop)
- [ ] Bộ sinh `gen-tiem-thu.js` + trang xem mẫu (1 thú, 1 quầy, 8 vật)
- [ ] Chủ site duyệt trang mẫu, rồi mới sinh đủ vật theo lớp
- [ ] Tự nhìn ảnh Chrome thật ở 40px / 120px / 300px, đúng một nguồn sáng, có bóng tiếp đất

## 11. Hướng "game lớn" (chủ site chốt 2026-11-25, GHI ĐÈ cách bố cục ở mục 2, 7)
Phản hồi: hai game vòng 1 "còn rất Pop Play, không phải game lớn như nông trại". Chốt: hai game vẫn ở **Pop Play** (đăng ký vào cổng, không bỏ) nhưng làm thành **thế giới rộng**, KHÔNG dùng engine khu vườn (engine vườn viết cho ô trồng/vật nuôi, không hợp nuôi thú và quán).
- **Nuôi Thú Tiếng Việt:** Nhà của Bi nhiều khu (phòng khách, bếp, nhà tắm, phòng ngủ, sân sau), cấp độ mở phòng/đồ, bộ sưu tập, nhiệm vụ ngày.
- **Quán Nước Ép (Tiếng Anh):** cả con phố: quầy, bàn khách, kho trái cây, cửa hàng đồ, sổ công thức; quán lớn dần theo cấp.
- **Ít chữ nhiều hình**, nút SVG. Màn đầu chính là thế giới.
- **Bộ khung chung** `learn/world/kit/` (HUD kính tối, popup toàn hình, nhận quà, cấp độ): chỉ người điều phối sửa.
- **Quà từ Học Vui:** `learn/gifts.js` (kho `learn:gifts`); Tiếng Việt nhận food/soap/toy, Tiếng Anh nhận coin; học xong bài + câu kiểm tra đúng + vòng ≥3 đúng đều có quà (mỗi ngày có trần cho câu lẻ).
- [x] Bộ khung `learn/world/kit/`, `learn/gifts.js` + nối vào trang học/kiểm tra (đã đo logic)
- [ ] Vòng 2 hai game (đang giao agent)
- [ ] Đăng ký vào cổng Pop Play (popplay/index.html, multi-games, social, sw.js, thumb) + chụp qua cổng
- [ ] Linh vật 5 skin theo MASCOT-ART-RULES, Night Pass, các lớp 1-2, 4-5

## 12. ĐỔI HƯỚNG (chủ site chốt 2026-11-25): hai game Pop Play là TRÒ CHƠI THUẦN, tách hẳn Học Vui
GHI ĐÈ mục 3 (gắn với việc học), mục 11 (quà từ Học Vui) và mọi chỗ nói "học xong bài → quà".
- Không bài học, không câu hỏi/kiểm tra kiểu học, không nối quà từ Học Vui, không đọc/ghi `learn:*`, không link sang /learn/.
- Bộ khung dùng chung chuyển sang `shared/worldkit/` (bản sạch). `learn/gifts.js` và các chỗ nối trong trang học đã gỡ.
- Quà/xu chỉ từ chơi: nhiệm vụ ngày, điểm danh nhẹ nhàng (không phạt), lên cấp, mini-game vui.
- Quán Nước Ép: khách nói tiếng Anh là lời thoại/cơ chế chơi, không dạy từ. Nuôi Thú: không dạy chữ.
- Khái niệm "lớp" bỏ khỏi dữ liệu game; cấp độ của Bi / cấp quán thay lớp.
- Tên hai game ("Tiếng Việt" / "Tiếng Anh") cần hỏi lại chủ site có đổi không.

## 13. HAI BẢN cho mỗi game (chủ site chốt 2026-11-25: "làm cả 2")
| | Bản Pop Play (thuần chơi) | Bản Học Vui (gắn bài học) |
|---|---|---|
| Nuôi thú | **Nhà Của Bi**, không bài học | Công trình "Nhà của Bi" trong khu vườn môn Tiếng Việt; học xong bài / làm đúng bài kiểm tra → nhận thức ăn, xà phòng, đồ chơi |
| Quán | **Quán Cáo Cam**, không bài học | Công trình "Phố quán" trong khu vườn môn Tiếng Anh; học xong → nhận xu |
| Nơi đặt | popplay/games/<id>/ | learn/ (trang con của vườn, giống `preview-house.html`) |
| Dữ liệu | khoá riêng (ntv:*, tne:*) | khoá riêng của Học Vui, KHÔNG dùng chung với bản Pop |
Thứ tự: (1) bản Pop xong + Night Pass + commit/push; (2) bản Học Vui: tái dùng tranh/module của bản Pop (copy rồi chỉnh, không phụ thuộc chéo), viết lại cầu nối quà chỉ cho Học Vui (`learn/gifts.js` mới), thêm công trình vào vườn Tiếng Việt / Tiếng Anh, popup ít chữ nhiều hình.
- [ ] Bản Pop xong (vòng 3 + đổi id + Night Pass) rồi commit/push
- [ ] Bản Học Vui: công trình trong vườn + trang bên trong + quà từ bài học
