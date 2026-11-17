# Luật vẽ linh vật & skin 2D (SVG) — BẮT BUỘC đọc trước khi vẽ

Mục tiêu: mọi linh vật/skin do code (SVG vẽ tay), **cùng một hệ thống**, hai phong cách tách bạch cho hai nhóm người dùng. Không vẽ "tự do", không dùng ảnh bitmap, không gọi AI/máy chủ lúc chơi (xem GAME_RULES.md: offline, không lag).

Trạng thái: **đã có 2 con MẪU (bản 2, vẽ lại theo luật khuôn mặt chữ ký + đạo cụ nhận diện + skin riêng + màu ăn theo nền) CHỜ DUYỆT** — Pop: Chim Bay (`shared/art/mascot-pop-pop-fly.svg`), Night: Xin Nghỉ (`shared/art/mascot-night-xin-nghi.svg`), mỗi con đủ 5 skin (1 miễn phí = Mặc định, 4 trả phí). CHƯA nhúng vào game nào. Xem: mở `shared/art/preview.html` qua máy chủ tĩnh. Chủ site duyệt xong mới sửa số mục 3 (nếu cần) rồi mới nhân ra các game còn lại. Bài đo: `node scripts/cozygame/check-art.js`.

## 0. TÓM TẮT CÁC QUYẾT ĐỊNH CỦA CHỦ SITE (đọc trước, mọi mục dưới đều theo đây)
1. **Mỗi game 1 linh vật**; **5 skin mỗi linh vật, 1 miễn phí** (Mặc định), 4 trả phí (Huy hiệu, Chủ đề riêng, Dạ quang, Siêu sao). Danh mục 32 game: [MASCOT-CATALOG.md](MASCOT-CATALOG.md).
2. **Hai phong cách tách bạch**: Pop (đồ chơi mềm, cho bé) và Night (Gen Z sticker / streetwear, trẻ trung, có cá tính) — mục 1.
3. **Skin là chủ đề RIÊNG của từng game** và phải khác nhau thật (phụ kiện đầu, đạo cụ cầm tay, hiệu ứng, biểu cảm nhẹ, dáng thân với Dạ quang/Siêu sao) — mục 4b.
4. **Khuôn mặt là chữ ký nhận diện**, giữ nguyên ở cả 5 skin; phụ kiện không che mặt — mục 4b.
5. **Nhìn vào biết ngay là game đó**: mỗi linh vật có đạo cụ nhận diện game luôn có ở mọi skin — mục 4b.
6. **Mỗi skin có 8 theme màu** (8 bộ theme Night Pass hiện có) = đổi bảng màu của CHÍNH linh vật + phụ kiện, KHÔNG phải nền sau lưng — mục 8.
7. **Màu linh vật đối xứng (màu bù) với màu nền của theme** để nổi bật — mục 8.
8. **Linh vật đi cùng trong game** (mini 40–56px, nhảy, nói): Pop ĐỌC câu hỏi + KHEN khi đúng; Night hài hước + làm theo hiệu ứng combo; ai cũng có, Night Pass chỉ thêm skin đẹp hơn — mục 6b.
9. Vẽ bằng SVG/CSS, offline, không AI/bitmap/filter lúc chơi.

## 1. Hai phong cách (chọn theo nhóm game, KHÔNG trộn)

| | **POP** (Pop Play: bé nhỏ + phụ huynh) | **NIGHT** (Night Play: thanh niên, người đi làm) |
|---|---|---|
| Tên phong cách | "Đồ chơi mềm" | **"Gen Z sticker / streetwear"** (chủ site chọn: trẻ trung, có cá tính; chút neon chỉ cho skin Dạ quang) |
| Hình khối | Tròn, phình như bong bóng, KHÔNG góc nhọn | Thân bo tròn + **POSE có thái độ** (nghiêng ~5°, nhìn đời, nhếch mép), hoodie, tai nghe, sneaker; chi tiết vừa đủ, đọc được ở 40px |
| Tỉ lệ đầu : thân | Đầu ≈ 60% chiều cao | Đầu ≈ 45–50% chiều cao |
| Mắt | To, 2 chấm sáng (highlight) trong mỗi mắt, má hồng | Nhỏ hơn, biểu cảm (mệt, lười, ngầu), không má hồng mặc định |
| Viền | KHÔNG viền đen; viền = màu thân đậm hơn 25%, dày 3 đơn vị | Viền sticker 1 màu đậm (tím đêm `#1B1442`), dày 5 đơn vị, bo tròn |
| Tô màu | Gradient mịn 2 điểm dừng + 1 vệt bóng trắng (opacity .55) trên đầu | Phẳng; **bóng đổ cứng bằng MÀU CHÓI lệch (+8,+8)** (in lệch màu: hồng neon `--c3`), không gradient mềm |
| Bảng màu | Sáng, ấm, bão hoà vừa (kẹo, bơ, hồng đào, xanh bạc hà) | Màu chói tương phản: tím điện `#8B5CFF`, hồng neon `#FF4FA3`, vàng chanh `#D7FF3F`, viền `#12102B`; mỗi skin đổi bộ màu chói |
| Chuyển động | Nhanh, nảy, vui (nhún, chớp mắt, thè lưỡi) | Thở chậm, lim dim, rồi bật dậy/đổi biểu cảm khi chạm hoặc combo |
| Hài hước | Ngây thơ, dễ thương | Kiểu meme của người trẻ: ánh mắt lim dim "ổn mà", nhếch mép, một chân mày nhướn; phụ kiện đời thường (hoodie, tai nghe, mũ lưỡi trai, kính râm, dây chuyền) |
| Skin ví dụ | Mũ phi hành gia, tai gấu, ba lô đi học, áo mưa | Huy hiệu, đồng phục nhóm, dạ quang, vương miện |

Game thuộc nhóm nào do `portal` trong `shared/multi-games.js` quyết định (`popplay` = POP, `cozyplay` = NIGHT). Không đổi phong cách của một game giữa chừng.

## 2. Khung kỹ thuật (giống nhau cho cả hai nhóm)

1. **Một tệp SVG / linh vật**, `viewBox="0 0 256 256"`, nội dung gốc nằm trong 16..240 (chừa 16 lề cho bóng/viền). Không `width`/`height` cố định (co theo khung).
2. **Chỉ dùng**: `path`, `circle`, `ellipse`, `rect` (bo góc), `g`, `linearGradient`/`radialGradient`, `clipPath`. **CẤM**: `<image>`, `<foreignObject>`, `filter` (blur/drop-shadow — gây sập WebKit, xem bộ nhớ dự án), `mask` phức tạp, font nhúng, `<script>`, `style` ngoài.
3. **Ngân sách**: phần thân ≤ 90 phần tử (gồm các biến thể dáng thân, không tính phụ kiện/fx), ≤ 6 gradient; MỘT tệp chứa cả 4 skin trả phí (bật/tắt bằng lớp `sk-*` trên thẻ gốc) ≤ 16 KB. **id duy nhất**: gradient/clipPath dùng `id` trùng nhau khi nhúng nhiều bản trong một trang (màn chính + mini) sẽ lấy biến màu của bản đầu → khi nhúng PHẢI đổi hậu tố id theo từng bản (xem `inline()` trong `shared/art/preview.html`).
4. **Màu** chỉ qua biến CSS (`--c1` thân chính, `--c2` thân phụ/bóng, `--c3` điểm nhấn, `--ink` viền/mắt, `--bl` má/blush, `--hl` vệt sáng), KHÔNG ghi màu cứng trong phần thân. Đổi skin = đổi biến + bật/tắt nhóm phụ kiện, không vẽ lại thân.
5. **Neo (slot) cố định** để mọi skin/phụ kiện khớp mọi linh vật cùng nhóm (toạ độ trong viewBox 256): đầu-đỉnh `(128,40)`, mắt trái `(100,112)`, mắt phải `(156,112)`, miệng `(128,146)`, cổ `(128,178)`, ngực/huy hiệu `(128,200)`, tay trái/phải `(60,190)/(196,190)`, chân `(128,232)`. Phụ kiện đặt trong `<g id="acc-head|acc-eyes|acc-chest|acc-hand">` theo các neo này.
6. **Cấu trúc nhóm** (id bắt buộc, theo thứ tự vẽ từ dưới lên): `shadow` → `body` → `belly/detail` → `face` (`eyes`, `mouth`, `blush`) → `acc-*` (phụ kiện, mặc định `display:none`) → `fx` (lấp lánh, dạ quang).
7. **Hoạt ảnh**: chỉ CSS `transform`/`opacity` + `@keyframes`, đặt tên `npa-<tên>` (`npa-blink`, `npa-bob`, `npa-breathe`, `npa-wiggle`). `transform-box: fill-box; transform-origin: center`. KHÔNG rAF, KHÔNG JS lặp, KHÔNG animate `filter`/`d`/thuộc tính layout. Tối đa 3 animation chạy cùng lúc; tắt hết khi `prefers-reduced-motion` và khi `html.np-playing` (đang chơi).
8. **Hiệu ứng tương tác** (rê/chạm/giữ/pop) vẫn do `shared/mascot.js` (xem GAME_RULES mục 30): linh vật chỉ cần là phần tử thật có id trong `EL_SEL`. Không tự gắn sự kiện.
9. **Trợ năng**: `role="img"` + `aria-label` (tên linh vật, theo ngôn ngữ), `<title>` ngắn. Trang trí thuần thì `aria-hidden="true"`.

## 3. Bảng quy đổi nhanh (số "mặc định", chủ site duyệt mẫu rồi mới chốt)

- Bo góc/cạnh: POP `r ≥ 24`, NIGHT `r 6–14`.
- Độ dày viền: POP 3, NIGHT 5 (đơn vị viewBox).
- Mắt: POP bán kính 14 + highlight 5 (đặt lệch trên-phải) + highlight nhỏ 2.5 (dưới-trái); NIGHT bán kính 9–11 + 1 highlight 3.
- Bóng đổ nền (`shadow`): ellipse `(128,236)` rx 70 ry 9, màu `--ink` opacity .18.
- Độ tương phản: viền/mắt so với thân ≥ 4.5:1 (chữ không cần, nhưng mắt phải đọc được ở 40px).
- Đọc được ở **40×40px** (huy hiệu, thẻ nhỏ) và **200px** (màn chọn): vẽ bản 40px trước, thêm chi tiết sau.

## 4. Hệ skin (5 loại, dùng chung cho cả hai nhóm; xem `shared/npmascot.js`)

| Skin | Cách làm (KHÔNG vẽ lại thân) |
|---|---|
| Mặc định (`default`) | Bảng màu gốc, không phụ kiện |
| Huy hiệu (`badge`) | Bật `acc-chest` = huy hiệu vàng của game |
| Nhóm (`group`) | Bảng màu nhóm + 1 phụ kiện đầu theo nhóm (🪖 Thợ xây, 🎓 Thông thái, 🎀 Trẻ) vẽ lại thành SVG |
| Dạ quang (`night`) | Đổi `--c1/--c2` sang tông lam-tím + bật `fx` (đốm sáng nhấp nháy, chỉ opacity) |
| Siêu sao (`star`) | Vương miện `acc-head` + `fx` lấp lánh cầu vồng (CSS `hue-rotate` KHÔNG dùng — dùng 3 lớp màu opacity) |

Skin Pop dùng phụ kiện "đời thường của bé" (mũ phi hành gia, tai gấu, ba lô, áo mưa); skin Night dùng phụ kiện theo nội dung game. Mọi phụ kiện thuộc nhóm nào thì chỉ dùng cho nhóm đó.

## 4b. Skin là CHỦ ĐỀ RIÊNG của từng game (chủ site chốt)

Mỗi game 1 linh vật, 4 skin trả phí mang **chủ đề riêng của game đó** (danh mục từng game: [MASCOT-CATALOG.md](MASCOT-CATALOG.md)). Skin phải khác nhau thật — mỗi skin đổi ĐỒNG THỜI: (a) phụ kiện đầu, (b) đạo cụ cầm tay, (c) hiệu ứng nền (tối đa 3 hoạt ảnh), (d) biểu cảm NHẸ trong phạm vi khuôn mặt (xem dưới), và skin 4 (Dạ quang) / 5 (Siêu sao) đổi cả DÁNG THÂN. Không được chỉ đổi màu + 1 món đồ.

### KHUÔN MẶT LÀ DẤU HIỆU NHẬN DIỆN (chủ site chốt — BẮT BUỘC)
Dù skin đổi hình dáng thế nào, **khuôn mặt PHẢI giữ nét đặc trưng của linh vật** để người chơi nhận ra ngay đó vẫn là nó:
1. Mỗi linh vật có **chữ ký khuôn mặt**: hình dạng + tỉ lệ + vị trí mắt, kiểu chân mày/mí mắt, hình miệng/mỏ, và **một dấu hiệu riêng** (vd: chấm tàn nhang, nốt ruồi, vết sẹo, chiếc răng khểnh, chân mày nhướn một bên, chỏm tóc). Ghi chữ ký này ở đầu tệp SVG (`<desc>`) và ở MASCOT-CATALOG.
2. Nhóm `face` (`eyes`, `mouth`, `blush`, dấu hiệu riêng) **dùng chung cho cả 5 skin, KHÔNG vẽ lại theo skin**. Skin chỉ được đổi BIỂU CẢM bằng biến thể nhỏ của chính khuôn mặt đó: mí mắt (mở/lim dim/nhắm), độ cong miệng, độ nhướn chân mày — cùng hình mắt, cùng dấu hiệu riêng.
3. Phụ kiện KHÔNG được che mắt/miệng/dấu hiệu riêng: kính/visor phải trong suốt (thấy rõ mắt) hoặc đẩy lên trán; mũ/vương miện/tai nghe chỉ chạm viền đầu. Dáng thân Dạ quang/Siêu sao đổi, nhưng đầu + mặt giữ nguyên tỉ lệ so với skin Mặc định.
4. Bài đo `check-art.js`: nhóm `face` của mọi skin phải render giống nhau ≥ 90% điểm ảnh trong vùng mặt khi tắt phụ kiện (so với skin Mặc định) — chưa viết.
5. **Sai ở hai mẫu hiện tại cần sửa:** Xin Nghỉ skin Nhóm đang dùng kính râm ĐEN che mắt (phải đổi sang kính trong/đẩy lên trán); Chim Bay skin Dạ quang đổi màu mặt/cú dẹt thì vẫn phải giữ mắt + mỏ + má đúng khuôn mặt gốc.

### NHÌN VÀO BIẾT LÀ GAME ĐÓ NGAY (chủ site chốt — BẮT BUỘC)
Mỗi linh vật phải gợi ra đúng game chỉ trong ~1 giây, kể cả ở 40px và khi không có chữ:
1. Mỗi game có **MỘT đạo cụ/biểu tượng nhận diện game** (ví dụ Xin Nghỉ: đơn xin nghỉ + ô dù bãi biển; Đập Deadline: búa + đồng hồ; Chim Bay: cánh + chữ cái). Đạo cụ này nằm ở **neo cố định** (tay hoặc đầu), **luôn có mặt ở cả 5 skin** (đổi kiểu theo chủ đề skin nhưng vẫn nhận ra là nó).
2. **Chữ ký game = chữ ký khuôn mặt + đạo cụ nhận diện + bóng dáng (silhouette).** Skin đổi phụ kiện, dáng thân, màu; ba thứ trên giữ nguyên để không thể nhầm sang game khác.
3. **Bài kiểm tra bắt buộc**: cho 5 người (hoặc tự xem) nhìn ảnh 40px KHÔNG có chữ — phải chỉ đúng game. Linh vật nào của hai game khác nhau mà giống nhau (cùng dáng + cùng màu) thì phải vẽ lại.
4. Bảng đạo cụ nhận diện của 32 game: [MASCOT-CATALOG.md](MASCOT-CATALOG.md) mục "Đạo cụ nhận diện".

## 5. Quy trình bắt buộc khi vẽ một linh vật mới

1. Đọc mục 1 → chọn phong cách theo `portal`.
2. Vẽ **bản 40px trước** (hình khối + mắt), rồi mới thêm chi tiết.
3. Dùng đúng neo/id/biến ở mục 2. Copy khung từ `shared/art/_template-pop.svg` hoặc `_template-night.svg` (đã tạo).
4. Dựng đủ 5 skin bằng biến + phụ kiện, không đổi thân.
5. Chụp ảnh ở 40/96/200px × sáng/tối (puppeteer) và TỰ NHÌN; gửi chủ site duyệt mẫu đầu tiên của mỗi nhóm.
6. Chạy bài đo (mục 6). Chỉ khi đạt mới nhúng vào game.

## 8. MỖI SKIN CÓ 8 THEME MÀU (chủ site chốt: "1 skin có 8 theme như hiện tại")

Night Pass hiện có **8 theme** (Hoàng hôn, Đại dương, Rừng xanh, Kẹo ngọt, Cực quang, Vàng ấm, Nửa đêm, Hồng đào — `NPGrad.LIST`, `shared/art/mascot-theme.js`). Theme đổi **BẢNG MÀU CỦA CHÍNH LINH VẬT + PHỤ KIỆN** (KHÔNG phải màu nền sau lưng): 5 skin × (mặc định + 8 theme) = 45 biến thể mỗi game, từ MỘT tệp SVG.

- Theme đặt 5 biến gốc `--p1` (thân sáng) `--p2` (thân đậm) `--pst` (viền) `--pa`, `--pb` (nhấn 1, nhấn 2) bằng `NPArtTheme.apply(svg, themeId)`. SKIN biến đổi bảng đó bằng `color-mix` (Dạ quang tối đi/tím hoá, Siêu sao sáng + lấp lánh vàng; Mặc định/Huy hiệu/Chủ đề riêng giữ nguyên bảng) → skin khác nhau bằng DÁNG + PHỤ KIỆN, theme khác nhau bằng MÀU.
- **Màu linh vật PHẢI ĐỐI XỨNG (màu bù) với màu nền của theme** (nền game đổi theo theme): Hoàng hôn (tím→cam) → xanh ngọc, Đại dương → cam san hô, Rừng xanh → hồng sen, Kẹo ngọt → xanh bạc hà, Cực quang → vàng cam, Vàng ấm → xanh tím, Nửa đêm → vàng chanh, Hồng đào → xanh lơ. Bảng này nằm ở `shared/art/mascot-theme.js`; khi thêm theme mới phải chọn màu bù rồi chụp ảnh kiểm tra độ nổi trên nền đó.
- Không có gói / chưa chọn theme: không đặt biến, dùng bảng mặc định ghi trong SVG (miễn phí). Theme màu là phần của Night Pass (cổng `NPGrad.active()`).
- **Màu KHUÔN MẶT và ĐẠO CỤ NHẬN DIỆN không đổi theo theme** khi chúng là dấu hiệu nhận diện (mỏ/chữ ký mặt cố định; mặt kem, mắt, chân mày; đạo cụ vẫn nhận ra dù đổi màu).
- Bài chụp bắt buộc: `shared/art/preview-themes.html?m=<tệp>.svg` (cột = 5 skin, hàng = mặc định + 8 theme, nền tối; thêm `&t=light` cho nền sáng) và TỰ NHÌN trước khi nhúng.

## 6. Bài đo tự động cần có (`scripts/cozygame/check-art.js`, đã viết, chưa nối vào `check.js`)

Mỗi SVG trong `shared/art/` phải đạt: viewBox đúng; không có thẻ/thuộc tính cấm (`image`, `filter`, `foreignObject`, `script`, màu cứng ở `body`); đủ id nhóm bắt buộc; kích thước ≤ ngân sách; số phần tử ≤ 60; mọi `animation-name` bắt đầu `npa-`; có `aria-label`; render ở 40px không rỗng (diện tích phủ ≥ 25%); không có phần tử tràn ngoài 16..240. Nối vào `check.js`.

## 6b. Linh vật đi cùng trong game ("bạn đồng hành") — quyết định của chủ site, CHƯA code

**Mỗi game đúng 1 linh vật** (riêng từng game). Dùng ở hai nơi:
1. **Màn chính của game**: bản lớn (luật mục 1–4), vẫn phản ứng rê/chạm/giữ (GAME_RULES mục 30).
2. **Khung nhỏ khi chơi và trong khung Chơi cùng lúc**: bản MINI (40–56px), đặt cố định ở một góc không che vùng chơi.

**Hành vi theo nhóm**
| | POP (Pop Play, bé) | NIGHT (Night Play) |
|---|---|---|
| Giọng | Dịu, khích lệ | **Hài hước** (kiểu dân văn phòng khi hợp nội dung game) |
| Khi có câu hỏi/đề | **ĐỌC to câu hỏi** (giọng đọc sẵn có của game, theo nút loa; bóng chữ kèm theo) | Bóng chữ ngắn, không đọc |
| Khi làm đúng | **KHEN** (nhảy + câu khen ngắn, đọc to) | Nhảy + câu đùa ngắn |
| Khi sai/thua | Động viên nhẹ, không chê | Đùa nhẹ, không mỉa mai |
| Combo | Nhảy mạnh dần theo combo | **Làm THEO hiệu ứng combo** của game: mỗi mốc combo là một hiệu ứng của linh vật (rung, phát sáng, đổi biểu cảm, lấp lánh), đồng bộ với hiệu ứng combo của game |

Câu của linh vật lấy từ bảng văn bản theo `game × sự kiện × ngôn ngữ (vi/en)` (không sinh bằng AI lúc chơi; xem GAME_RULES "offline, không AI"), mỗi sự kiện có 3–5 biến thể để không lặp.

Ràng buộc bắt buộc (từ các lỗi đã báo):
- Khung KHÔNG có chỗ cho chữ (rộng ≤ 300px hoặc cao ≤ 340px): không hiện bóng chữ, chỉ nhảy/đổi biểu cảm; Pop vẫn ĐỌC to (nếu loa bật).
- Chỉ `position:absolute` + `transform`/`opacity`: không che vùng chơi, không đẩy bố cục, không rAF.
- Tối đa 1 hoạt ảnh nhảy + 1 bóng chữ cùng lúc; bóng chữ ≤ 40 ký tự, tự tắt sau ~2,5 giây.
- Đọc to phải xếp hàng, không chồng lên giọng đọc của game (một nguồn tiếng nói tại một thời điểm); đọc câu hỏi KHÔNG làm game khựng (xem lỗi Chim Bay đã sửa).
- Im lặng khi menu ⋯ mở, đang đếm 3-2-1, tạm dừng; tắt khi `prefers-reduced-motion`.
- Bản mini đọc được ở 40px (mục 3).
- **Miễn phí vs Night Pass (chủ site chốt):** MỌI người chơi đều có linh vật hài hước/khen/đọc to và hiệu ứng combo cơ bản. Night Pass chỉ thêm **SKIN** (mục 4); mỗi skin mang theo bản hiệu ứng ĐẸP HƠN cho cùng các sự kiện đó (phụ kiện cử động theo, lấp lánh/dạ quang/cầu vồng khi combo...). Không khoá tính năng linh vật, chỉ khoá phần thẩm mỹ của skin → hiệu ứng nâng cao nằm trong skin, bật qua cổng skin sẵn có (`NPMascot.isOpen`), KHÔNG tạo cổng mới. Cập nhật docs/FREE-VS-NIGHTPASS.md khi làm.

## 7. Điều CẤM

- Trộn phong cách Pop và Night trong cùng một linh vật hoặc cùng một game.
- Dùng emoji làm linh vật mới (emoji chỉ còn là phương án dự phòng khi SVG chưa có).
- Bitmap, ảnh sinh bằng AI, SVG tải từ nguồn ngoài (bản quyền).
- `filter`, `mask` nặng, `backdrop-filter`, animation > 3 cái cùng lúc, bất kỳ vòng lặp JS nào để chạy hoạt ảnh.
- Tự ý đổi số ở mục 3 khi chưa được chủ site duyệt.

## 9. KHUNG TÍCH HỢP CHUNG — nối linh vật vào game (đồng nhất mọi game; đã chạy ở Chim Bay + Xin Nghỉ)

Tệp: `shared/art/mascot-art.js` (lõi), `shared/art/mascot-games.js` (dữ liệu từng game), `shared/art/mascot-theme.js` (8 theme màu), `shared/art/mascot-<pop|night>-<id>.svg`. `shared/mascot.js` bắt rê/chạm/giữ/pop trên linh vật SVG (`.npa-hero`, `#paHero`, `#hHero`) và gọi `NPArt.touch`. Game KHÔNG viết mã linh vật riêng.

**Thêm một game (checklist bắt buộc):**
1. Vẽ `shared/art/mascot-<pop|night>-<id>.svg` theo mục 1–8 (đủ `#mark`, `#sign`, `<desc>`, 5 skin, biến `--p*`), chạy `node scripts/cozygame/check-art.js`, chụp `preview-themes.html`.
2. Thêm MỘT khối vào `shared/art/mascot-games.js`: `file`, `emoji` (dự phòng + hạt pop), `name`, `pos` (`bl`|`br` — góc linh vật mini, chọn góc KHÔNG che nút/vùng chơi), `fx` (hạt hiệu ứng 5 skin), `L` (câu thoại: start, ok/correct, half, wrong/no, combo×3 bậc, ask, tap, end; Pop dịu/khen, Night hài hước).
3. Thêm `shared/art/mascot-art.js` + 4 tệp art vào `SHELL` của `sw.js`; trong HTML game: `<script src="../../../shared/art/mascot-art.js" defer></script>`.
4. Có một ô hero `#hHero` (Cozy) hoặc `#paHero`/`[data-npa-hero]` (để emoji dự phòng bên trong; ĐỪNG ghi đè `textContent` của ô sau khi đã có `<svg>` — kiểm tra `querySelector("svg")`). Pop: ẩn `::before` emoji của màn chọn và đặt ô thật cùng chỗ. Landscape/fitHero đã bỏ qua ô có SVG.
5. Game gọi `NP.start()` / `NP.result()` như mọi game (linh vật tự nghe `np:start`/`np:result`) và bắn sự kiện chơi bằng `NPArt.event(name, data)` (hoặc `window.dispatchEvent(new CustomEvent("npa",{detail:{name,…}}))`), `name`: `correct`, `wrong`, `ok`/`half`/`no` (game theo lượt), `combo` (`{n}` hoặc `{tier:1..3}`), `ask` (`{text}`: câu hỏi hiện bóng chữ + miệng cử động theo giọng đọc của game). Luôn bọc `window.NPArt&&…`.
6. Ẩn linh vật mini ở màn chọn nếu nó che nút: `#play:has(<màn chọn>:not([hidden])) .npa-mini{display:none}`.
7. Chạy: `node scripts/cozygame/check-mascot.js --quick --only=<id>`, chụp màn chính ở 390×844, 375×667, 844×390, 834×1000 + khung Chơi cùng lúc (353×491), và TỰ NHÌN.

**Hành vi chung đã cài:** mỗi skin có cách cử động riêng (Mặc định nảy · Huy hiệu nghiêng chào · Chủ đề riêng gật đầu · Dạ quang bay lơ lửng · Siêu sao xoay lật) và hạt hiệu ứng riêng; combo bậc 2–3 của Dạ quang/Siêu sao thêm vòng sáng; khen/đùa cách nhau ≥ 1,4 giây; khung rộng < 300px hoặc cao < 340px không hiện bóng chữ; tắt khi `prefers-reduced-motion`. **KHÔNG tự đọc giọng nói trong lúc đang chơi** (iOS khựng, xem lỗi Chim Bay đã sửa): Pop chỉ hiện bóng chữ + động miệng khi giọng của game đang đọc; muốn linh vật tự đọc lời khen thì chỉ ở màn chọn/kết thúc.
**Chưa làm:** chưa có hiệu ứng nhảy riêng cho từng game ngoài bộ chung; chưa nối `mini` vào các game khác; `check-art.js` chưa kiểm khuôn mặt giống nhau giữa skin.

**Hiệu ứng xuất hiện (màn chính):** linh vật di chuyển TỪ TỪ vào vị trí (~1,9–2,4 giây, mỗi skin một kiểu: `ENTER` trong mascot-art.js); **người dùng thao tác (chạm/phím/cuộn) thì vào ĐÚNG VỊ TRÍ NGAY** (`Inst.skipEnter`, câu chào hiện luôn). Chưa có hiệu ứng rời đi.

**Hiệu ứng rời đi (bắt đầu ván) — chủ site chốt, KHÔNG nổ tung:** (1) mọi thẻ/nút/chữ còn lại của màn chính bay ra khỏi khung; (2) linh vật ra GIỮA màn hình; (3) vừa THU NHỎ vừa DI CHUYỂN về đúng vị trí linh vật mini trong khung game (bl/br theo `pos`); (4) màn chơi sáng lên, game bắt đầu. **Người dùng vừa thao tác → ĐI NHANH (~1,5 giây, lắc lư nhẹ); game tự bắt đầu không thao tác → đi CHẬM, tự nhiên, LẮC LƯ (~2,9 giây, đường bay mượt easeInOut + xoay ±9° + dập dềnh, tắt dần khi đáp).** Dùng bản sao màn chính + ghost linh vật (`data-npa-ghost`; ghost PHẢI đổi id gradient riêng); game đóng băng (`NP.menuPause`) suốt hiệu ứng. Cài ở `leave()` (mascot-art.js, kích hoạt bởi `np:start`).

**Thông báo của game → bong bóng linh vật (chủ site chốt):** mọi `toast(...)` của game có linh vật PHẢI chạy qua bong bóng: đầu hàm toast thêm `if(window.NPArt&&NPArt.say&&NPArt.say(m,ms))return;` (trả false khi không có linh vật / khung quá nhỏ → hiện toast như cũ). Ưu tiên linh vật mini khi đang chơi, hero ở màn chính; thông báo thắng câu thoại có sẵn; câu "ask" 1 chữ cái không thành bong bóng (chỉ động miệng).

**Màu bong bóng theo tâm trạng (chủ site chốt):** `data-mood` = ok (xanh lá, khen) · bad (đỏ, sai/miss) · half (cam) · combo (hồng-cam-vàng rực, chữ tím đậm) · ask (xanh dương, câu hỏi) · cool (tím, chào/chạm/mặc định). Màu đậm + viền sáng + quầng sáng cùng màu, đuôi cùng màu thân bong bóng. Toast truyền `kind` (ok/bad/miss…) qua `NPArt.say(m,ms,kind)`; sự kiện của khung tự gắn mood.
