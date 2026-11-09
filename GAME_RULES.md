# Quy tắc làm game mới (đọc TRƯỚC khi viết code, chạy kiểm tra TRƯỚC khi commit)

Các mục dưới đây đều là lỗi người dùng đã báo ít nhất một lần. Làm game mới mà phạm lại là lỗi của người làm.
Nguyên tắc chung: **không báo "xong" khi chưa tự mở trình duyệt thật, chụp ảnh và nhìn.**

## 0. Quy trình bắt buộc
1. Game Cozy mới: viết `scripts/cozygame/specs/<id>.js` (luật chơi, vẽ, ván mẫu) + `server/pro/<id>.js` (Night Pass). KHÔNG sửa tay file sinh ra `cozyplay/games/<id>/index.html`; sửa spec/`tpl.html` rồi chạy `node scripts/cozygame/gen.js all`.
2. Thêm game vào bảng `GAMES` trong `scripts/cozygame/check.js` (khung `pre` đưa ván về trạng thái chơi dở).
3. Chạy `NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check.js` → phải in "✓ tất cả đạt". Commit XONG rồi mới chạy lại (nếu không sẽ báo "file sinh ra khác bản đã commit").
4. Chụp ảnh thật (puppeteer-core + Chrome, `python3 -m http.server`) ở: 360×640, 380×760, ngang 844×390 và 1200×640; bản free + MỌI giao diện Night Pass; màn home, màn chơi, màn kết thúc, popup. Tự nhìn ảnh.
5. Commit nhỏ, tiếng Việt. Không push khi chưa được yêu cầu. Không commit `code.md`.

## 0b. MỘT lỗi/cải tiến giao diện = sửa cho TẤT CẢ các nhóm game (lỗi hay lặp lại)
Dự án có 3 nhóm: **Cozy Play** (`cozyplay/`: 9 game sinh tự động từ `scripts/cozygame/` + game viết tay), **Pop Play** (`popplay/`: game trẻ em, 12 game) và **trang cổng** (`cozyplay/index.html`, `popplay/index.html`, `index.html`). Từng có lần chỉ sửa Cozy Play rồi người dùng phải báo lại cho Pop Play. Quy tắc:
- Khi sửa MỘT lỗi hoặc thêm MỘT tính năng giao diện (layout màn ngang/dọc, tên game bị cắt "…", nút ←, nút "?", màn kết thúc, popup chọn loại chơi/giao diện, lưới game, thanh trên, toast, Night Pass…), **tự hỏi: Pop Play và trang cổng kia có lỗi giống vậy không?** Chạy `grep` mẫu code cũ trong `popplay/` và `cozyplay/` (kể cả game viết tay) để tìm mọi chỗ.
- Ưu tiên đặt mã vào file dùng chung (`shared/*.css|js`, `scripts/cozygame/tpl.html`) và nhúng vào CẢ HAI nhóm; chỉ copy tay khi bắt buộc, và khi copy phải ghi rõ danh sách file đã copy trong commit.
- Mọi kiểm tra tự động (`check.js`, `check-landscape.js`) và mọi lần chụp ảnh phải gồm ít nhất 2 game Pop Play + 2 game Cozy Play + 2 trang cổng.
- Chạy thêm `node scripts/cozygame/check-pop.js` (12 game Pop Play + 2 trang cổng: tên game không bị cắt “…” ở 277/320/360 rộng vi+en, không tràn, có viewport). Pop Play dùng `shared/popfit.js` (co chữ tên game) + `shared/poplandscape.css` (màn ngang); game Pop mới phải nhúng cả hai và thêm vào `sw.js`.
- Tên lớp CSS trùng nhau trong một game (ví dụ `.sc` vừa là điểm vừa là lớp cảnh nền `position:absolute;inset:0` ở Vẽ Chữ Quái Vật) làm phần tử bị kéo lệch: khi thấy chữ/điểm dính mép, kiểm tra `getBoundingClientRect()` của phần tử và `grep` tên lớp trong file.
- Báo cáo "xong" phải liệt kê rõ đã áp dụng cho nhóm nào; nhóm nào chưa thì nói thẳng là chưa.
- Đối chiếu các tính năng đã làm cho Cozy mà Pop Play có thể chưa có: nút ← (`#bBk`), nút "?" (`shared/help.js`), tên game không bị cắt "…" và nằm sát nội dung (dọc), màn ngang (`shared/landscape.css` / `poplandscape.css`), màn kết thúc mới (`shared/endui.css|js`), lưới trang cổng (xoay màn hình không lệch, ô ≥72px, mỗi trang vừa khít), menu ⋯ gom nút ở màn ngang thấp, popup `shared/typeui.css`, thẻ `viewport`.

## 1. Bố cục và hiển thị
- **Một màn hình, không cuộn** ở mọi kích thước (dọc 320–520 rộng, ngang, PC). `#game` không được `scrollHeight > clientHeight`.
- **Chữ luôn nằm trong thẻ có nền** (panel + viền + bo vừa phải). Không chữ đen trơn trên nền; không thông báo (toast) nền trắng/chữ đen; toast theo màu giao diện hiện tại; không bo tròn quá mức.
- **Gợi ý/hướng dẫn dài không nằm sẵn trên màn hình**: gom vào nút icon "?" (`shared/help.js`), bấm mới mở. Trên màn chơi chỉ giữ tối đa 1 dòng ngắn.
- **Có nút ← (`#bBk`) ở thanh trên** để về màn chọn loại chơi từ mọi màn; không bắt người chơi phải đi qua màn kết thúc.
- **Thẻ `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` là BẮT BUỘC** trong `<head>` (khung `scripts/cozygame/tpl.html` đã có). Thiếu thẻ này thì điện thoại hiển thị trang ở bề rộng 980px (phóng nhỏ, tràn ngang); `check-landscape.js` giả lập thiết bị di động nên bắt được.
- **Màn hình ngang** (điện thoại xoay ngang, cửa sổ PC rộng-thấp): khung chơi nằm GIỮA, HUD (điểm, combo, lượt/thời gian, nút) chia hai bên, thông tin phụ tự ẩn; không để cột game hẹp một bên và trống phần còn lại; nút thanh trên cao cố định ~42px (không tính theo cqw).
  - **Điều kiện kích hoạt** (`shared/landscape.css`): `(orientation:landscape) and (max-height:700px) and (min-width:560px)` hoặc `(orientation:landscape) and (pointer:coarse) and (max-height:900px) and (min-width:800px)`. Game dạng `.app > .side/.play` (12 game Pop Play + Cozy Wings) dùng `shared/poplandscape.css` (nhúng `<link>` sau thẻ `<style>`), Đập Deadline có khối riêng, đều theo `(min-aspect-ratio:11/10) and (max-height:760px)`; khung chơi ở giữa, trái = tên/nút/câu hỏi, phải = điểm/tim.
  - **Cách dùng cho game mới**: nhúng `<link rel="stylesheet" href="../../../shared/landscape.css"><script src="../../../shared/landscape.js" defer></script>` (game Cozy sinh tự động đã có sẵn trong `tpl.html`). `landscape.js` ghi `#play[data-scr]` (màn đang hiện), gom `#home` thành 2 cột `.hl/.hr`, đặt `#play[data-pro]` cho giao diện Night Pass và làm mờ nút phụ khi đang chơi.
  - **Sửa CSS ngang**: chỉ sửa `scripts/cozygame/landscape.src.css` rồi chạy `python3 scripts/cozygame/mklandscape.py` (sinh ra `shared/landscape.css`, KHÔNG sửa tay). Thẻ phụ riêng của game (stats, tgt, thanh nút `#tbBar/#ssBar/#tb`, `#dpad`, `#lad`, `#end>.card`) được kéo ra hai bên bằng position:absolute; thêm id mới vào danh sách đó nếu game có thẻ phụ khác.
  - **Kiểm tra**: `NODE_PATH=<puppeteer-core> node scripts/cozygame/check-landscape.js [id,id]` (20 game × 844x390, 667x375, 1190x640 × free/Night Pass × chọn/chơi/kết thúc/popup ?: không tràn, không bị cắt, nút 38–46px, tâm khung chơi ±8%, popup trọn trong màn). Chạy khi sửa bất kỳ thứ gì liên quan bố cục; `check.js` có thêm kiểm tra ngang nhanh cho 9 game sinh tự động.
- Nút chạm ≥ 44px; cursor tay, viền focus rõ khi bấm Tab.
- Nhân vật/biểu tượng **không mờ, không chìm vào nền** (nền tối → thêm đĩa sáng/halo phía sau); không bao giờ mờ đến mức không thấy. Nhân vật quay mặt đúng hướng di chuyển (emoji phụ thuộc nền tảng: dùng biểu tượng trung tính hoặc lật bằng `scale(-1,1)`).
- Bản thân game cũng phải **offline, không lag, không gọi máy chủ lúc chơi, không AI**.

## 2. Điều khiển trên web
- Chuột (click, kéo, rê), bàn phím (mũi tên, Enter, Esc, Tab), trackpad hai ngón (wheel) và cảm ứng đều chơi được. Game vẽ/kéo thả phải có kiểu "bấm nút → bấm chỗ muốn nối" ngoài kéo.
- `touch-action` đúng để không cuộn trang khi chơi; `pointercancel` được xử lý.

## 3. Chơi hộ (helper) — tính năng hay bị quên
- Phải có `snapP(G)` (trả `null` nếu chưa có tiến trình) và `restoreP(G,p)` (khôi phục đúng trạng thái chơi dở) để người chơi hộ TIẾP TỤC từ chỗ đang dở, không bắt đầu lại.
- `NP.state()` trả `{seed, t, p, ...}`; link `?helper=1&s=<base64url JSON>`.
- Ở chế độ chơi hộ: ẩn nút chia sẻ/chơi lại/về trang chủ/bảng điểm/quay video (`bShare,bAgain,bHome,bRem,bClip,bBoard`); kết thúc thì gửi kết quả về, không thoát ra menu.
- Kết quả chơi hộ mã hóa đầu-cuối, máy chủ xoá sau tối đa 24 giờ (không đổi).

## 4. Thách đấu (challenge)
- Link `#ch=<base64url {s: seed, sc: điểm, t: loại}>` mở hộp thách (`#ovCh`) rồi vào đúng ván/điểm cần vượt; mọi loại chơi, mọi giao diện.
- Link không chứa dữ liệu nhạy cảm; hạt giống (seed) phải cho ra đúng cùng ván ở mọi máy.

## 5. Night Pass phải KHÁC HẲN bản free (lỗi lặp nhiều nhất)
- Không chỉ đổi màu: mỗi giao diện đổi **bố cục / hình dạng khối chính / nhân vật / hiệu ứng nền động / vật liệu** riêng (xem `server/pro/xay-cau-tre.js`, `ban-co-hieu-toi.js` làm mẫu). Check tự động: ≥4/5 chữ ký bố cục khác nhau giữa free và 4 giao diện.
- Mỗi loại chơi Night Pass (type 1–3) mở được, đặt `#play.dataset.ty`; combo/hiệu ứng thắng khác bản free; nhân vật theo giao diện (không dùng chung emoji với free).
- Giao diện mới không được làm tệ đi các tiêu chí ở mục 1 (chữ trong thẻ, không chìm, không tràn).
- Popup chọn loại chơi/giao diện: đậm chất Night Pass (viền sáng, 👑, 🔒 + gợi ý cho loại bị khoá). Dùng `shared/typeui.css`.
- Mã Night Pass chỉ giao qua `/api/pro/<id>.js`; `main(PF,OPTS)` chạy trong trình duyệt, không dùng biến ngoài hàm. Khoá lại (`lockPro`) phải trả giao diện về free.

## 5b. Màn kết thúc (không để "chán")
- Màn kết thúc của MỌI game dùng chung thiết kế: thẻ kết quả nền gradient theo `var(--accent)` (chữ trắng, điểm rất lớn có hiệu ứng pop, huy hiệu xếp hạng dạng viên thuốc), bỏ dòng chữ lặp thừa, chip thống kê gọn, nút "Khoe điểm" lớn có chữ, các nút phụ là ô có emoji + nhãn chữ (vi/en) — nút ẩn thì lưới tự co.
- Game Cozy sinh tự động: CSS `#end .res` / `#end>.row` + hàm `showEnd` trong `scripts/cozygame/tpl.html`.
- Game viết tay (Cozy + Pop Play): nhúng `shared/endui.css` + `shared/endui.js` (đã có trong `sw.js`); script tự gắn class cho `#end`, `#res`, `#result`, `#ovSum`, `#ovEnd` và đặt nhãn nút theo ID (bShare, bClip, bRem, bAgain, bHome, sumGo/sumShare, againBtn/shareBtn/rankBtn/homeBtn2...). GIỮ NGUYÊN id nút cũ; game mới dùng đúng các id này để được áp dụng tự động, id mới thì thêm vào bảng `L` trong `endui.js`.
- Phải kiểm tra ảnh màn kết thúc ở dọc 380x760 và ngang 844x390, bản free + 1 giao diện Night Pass; không tràn/cuộn; chơi hộ (`?helper=1`) vẫn ẩn các nút.

## 6. Dữ liệu, quyền riêng tư
- Game không thu thập thêm dữ liệu cá nhân. Nếu thêm bất cứ thứ gì lưu trên máy chủ hoặc localStorage mới → cập nhật `privacy.html` (VI + EN) và ngày trong `shared/site.js`.
- Bảng xếp hạng tự nguyện; game trẻ em không có ô gõ tên.

## 7. Trước khi báo "xong"
- [ ] `check.js` "✓ tất cả đạt"
- [ ] `check-landscape.js` "✓ màn ngang đạt" (nếu đụng bố cục/giao diện)
- [ ] Ảnh free + từng giao diện Night Pass đã tự nhìn (dọc + ngang)
- [ ] Chơi hộ: mở link `?helper=1`, tiếp tục đúng ván dở, nút bị ẩn
- [ ] Thách đấu: mở link `#ch=...` được
- [ ] Nút ← về được màn chọn loại; nút "?" mở gợi ý
- [ ] Không cuộn, không chữ trơn, không nhân vật mờ, không lỗi console
- [ ] Đã thêm game vào `check.js` và danh sách tải sẵn offline (`sw.js`) nếu cần
- [ ] Báo cáo trung thực: cái gì đã kiểm tra, cái gì chưa (ví dụ trackpad thật)
