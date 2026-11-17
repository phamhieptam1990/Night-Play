# Luật vẽ linh vật & skin 2D (SVG) — BẮT BUỘC đọc trước khi vẽ

Mục tiêu: mọi linh vật/skin do code (SVG vẽ tay), **cùng một hệ thống**, hai phong cách tách bạch cho hai nhóm người dùng. Không vẽ "tự do", không dùng ảnh bitmap, không gọi AI/máy chủ lúc chơi (xem GAME_RULES.md: offline, không lag).

Trạng thái: **đã có 2 con MẪU CHỜ DUYỆT** — Pop: Chim Bay (`shared/art/mascot-pop-pop-fly.svg`), Night: Xin Nghỉ (`shared/art/mascot-night-xin-nghi.svg`), mỗi con đủ 5 skin (1 miễn phí = Mặc định, 4 trả phí). CHƯA nhúng vào game nào. Xem: mở `shared/art/preview.html` qua máy chủ tĩnh. Chủ site duyệt xong mới sửa số mục 3 (nếu cần) rồi mới nhân ra các game còn lại. Bài đo: `node scripts/cozygame/check-art.js`.

## 1. Hai phong cách (chọn theo nhóm game, KHÔNG trộn)

| | **POP** (Pop Play: bé nhỏ + phụ huynh) | **NIGHT** (Night Play: thanh niên, người đi làm) |
|---|---|---|
| Tên phong cách | "Đồ chơi mềm" | "Cute có cá tính" |
| Hình khối | Tròn, phình như bong bóng, KHÔNG góc nhọn | Gọn, ít chi tiết, đường nét sắc, có góc bo nhỏ |
| Tỉ lệ đầu : thân | Đầu ≈ 60% chiều cao | Đầu ≈ 45–50% chiều cao |
| Mắt | To, 2 chấm sáng (highlight) trong mỗi mắt, má hồng | Nhỏ hơn, biểu cảm (mệt, lười, ngầu), không má hồng mặc định |
| Viền | KHÔNG viền đen; viền = màu thân đậm hơn 25%, dày 3 đơn vị | Viền sticker 1 màu đậm (tím đêm `#1B1442`), dày 5 đơn vị, bo tròn |
| Tô màu | Gradient mịn 2 điểm dừng + 1 vệt bóng trắng (opacity .55) trên đầu | Phẳng + 1 lớp bóng đổ cứng (một khối tối hơn 18%), không gradient mềm |
| Bảng màu | Sáng, ấm, bão hoà vừa (kẹo, bơ, hồng đào, xanh bạc hà) | Tím đêm, xanh đêm, cam đào làm điểm nhấn; tương phản cao |
| Chuyển động | Nhanh, nảy, vui (nhún, chớp mắt, thè lưỡi) | Chậm, có biểu cảm (thở dài, gật gù, uể oải rồi bật dậy khi chạm) |
| Hài hước | Ngây thơ, dễ thương | Dân văn phòng: mắt thâm, cà phê, laptop (chỉ khi hợp nội dung game) |
| Skin ví dụ | Mũ phi hành gia, tai gấu, ba lô đi học, áo mưa | Huy hiệu, đồng phục nhóm, dạ quang, vương miện |

Game thuộc nhóm nào do `portal` trong `shared/multi-games.js` quyết định (`popplay` = POP, `cozyplay` = NIGHT). Không đổi phong cách của một game giữa chừng.

## 2. Khung kỹ thuật (giống nhau cho cả hai nhóm)

1. **Một tệp SVG / linh vật**, `viewBox="0 0 256 256"`, nội dung gốc nằm trong 16..240 (chừa 16 lề cho bóng/viền). Không `width`/`height` cố định (co theo khung).
2. **Chỉ dùng**: `path`, `circle`, `ellipse`, `rect` (bo góc), `g`, `linearGradient`/`radialGradient`, `clipPath`. **CẤM**: `<image>`, `<foreignObject>`, `filter` (blur/drop-shadow — gây sập WebKit, xem bộ nhớ dự án), `mask` phức tạp, font nhúng, `<script>`, `style` ngoài.
3. **Ngân sách**: phần thân ≤ 60 phần tử (không tính phụ kiện/fx), ≤ 6 gradient; MỘT tệp chứa cả 4 skin trả phí (bật/tắt bằng lớp `sk-*` trên thẻ gốc) ≤ 13 KB. **id duy nhất**: gradient/clipPath dùng `id` trùng nhau khi nhúng nhiều bản trong một trang (màn chính + mini) sẽ lấy biến màu của bản đầu → khi nhúng PHẢI đổi hậu tố id theo từng bản (xem `inline()` trong `shared/art/preview.html`).
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

## 5. Quy trình bắt buộc khi vẽ một linh vật mới

1. Đọc mục 1 → chọn phong cách theo `portal`.
2. Vẽ **bản 40px trước** (hình khối + mắt), rồi mới thêm chi tiết.
3. Dùng đúng neo/id/biến ở mục 2. Copy khung từ `shared/art/_template-pop.svg` hoặc `_template-night.svg` (đã tạo).
4. Dựng đủ 5 skin bằng biến + phụ kiện, không đổi thân.
5. Chụp ảnh ở 40/96/200px × sáng/tối (puppeteer) và TỰ NHÌN; gửi chủ site duyệt mẫu đầu tiên của mỗi nhóm.
6. Chạy bài đo (mục 6). Chỉ khi đạt mới nhúng vào game.

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
