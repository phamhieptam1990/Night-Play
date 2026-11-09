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
- **Nút chung của trang cổng (quay lại cổng, chụp ảnh, chia sẻ) KHÔNG được đè lên nút của game** (từng làm hỏng ← và ? của game, người chơi không bấm được). Cách hiện tại: game Cozy có `.top` + `shared/landscape.js` tự gắn 📷/📤 vào thanh trên của chính game và ← luôn hiện (ở màn chọn thì thoát về cổng); trang cổng thấy cờ `__npDock` và ẩn nút nổi của nó. Màn ngang thấp (≤520px cao) hoặc game không có `.top` (Pop Play): trang cổng dùng LÀN RIÊNG ngoài khung game (dọc: dải trên 48px; ngang: cột trái 52px) có màu nền theo game, KHÔNG nền đen. Game mới phải kiểm tra bằng cách mở qua trang cổng (`cozyplay/index.html#<id>`, `popplay/index.html#<id>`) ở dọc + ngang, không chỉ mở file game riêng lẻ.
- **Kiểm tra qua trang cổng (bắt buộc cho game mới và mỗi lần đổi nút/thanh trên/popup/toast):** `NODE_PATH=<puppeteer-core> node scripts/cozygame/check-portal.js [id,...]` — mở game trong iframe của cổng ở 380x760, 844x390, 1000x536, 820x600; dùng `elementFromPoint` ở CẢ cổng lẫn game để bắt nút bị đè; kiểm tra ← thoát về cổng, 📷/📤 bấm được, màn kết thúc Pop Play không bị cắt, lưới cổng không lệch sau khi thoát game. Game mới thêm vào danh sách `COZY`/`POP` trong script (Pop Play cần chuỗi lệnh đưa tới màn kết thúc).
- **Toast/thông báo không được che màn chơi:** trong trang game, tem mùa lễ chỉ làm nút 🍜 nảy (không khung chữ); toast của cổng bị ẩn khi đang chơi (`html.playing`).
- **Màn kết thúc dạng lớp phủ (#ovEnd/#ovSum) trong khung thấp:** `shared/endui.js` tự thu nhỏ đều các khối cho vừa — không tự đặt `overflow:hidden` hay cố định chiều cao làm cắt đầu/đuôi.
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
- **Thanh trên điện thoại dọc (≤520px): ← + MỘT nút menu 48px, bấm xổ bảng 3 cột có nhãn chữ (`shared/fan.js`)**, biểu tượng SVG chính giữa nút (`shared/icons.js`: 🏆 🔊 🏠 → SVG; nút chữ như EN/VI giữ chữ). Màu bảng/nút tự theo GIAO DIỆN của game (đọc màu thật của nút và nền mỗi lần mở: sáng/tối, Night Pass) — KHÔNG đặt màu cứng. Game có `#play` chứa `.top` dùng ngay. Game có kiến trúc riêng (không có `#play`: Đập Deadline, Cánh Nhỏ Phiêu Lưu) vẫn dùng `fan.js` ở CHẾ ĐỘ LOCAL: `.top` tự ghim đầu màn hình, nút menu bám vào chính `.top`; nút phụ nhận theo VAI TRÒ (id thay thế: `soundBtn`→âm thanh, `langBtn`→ngôn ngữ, `askBtn`→hướng dẫn, `restartBtn`→chơi lại; thêm id mới vào bảng ROLES trong `fan.js`). Nút cần bấm nhanh khi chơi (⏸) để ngoài menu. Game chỉ có 1-2 nút phụ (Pop Play) không cần menu, chỉ cần nút 44px + SVG. Màn rộng/ngang: nút về hàng như cũ (≥40px). Thêm game mới: kiểm tra menu ở 390×844 và 320×568, sáng + tối + một giao diện Night Pass.
- Nhân vật/biểu tượng **không mờ, không chìm vào nền** (nền tối → thêm đĩa sáng/halo phía sau); không bao giờ mờ đến mức không thấy. Nhân vật quay mặt đúng hướng di chuyển (emoji phụ thuộc nền tảng: dùng biểu tượng trung tính hoặc lật bằng `scale(-1,1)`).
- Bản thân game cũng phải **offline, không lag, không gọi máy chủ lúc chơi, không AI**.

## 1b. Luồng vào của MỌI game: màn chọn trước, người mới thấy ngay lựa chọn (Đập Deadline từng bị bỏ sót)
- Vào game là thấy **màn chọn (`<section id="home">`)** như các game Cozy khác: tên + hình, thẻ lớn "#N Thử thách hôm nay", **lưới loại chơi/chế độ** (icon + tên, loại trả phí có 👑 và 🔒), **chọn cấp độ**, nút **Chơi** lớn, hàng phụ "Giao diện & tuỳ chọn". Chọn xong bấm Chơi là vào ván; KHÔNG giấu lựa chọn sau nút ⚙/hộp cài đặt, KHÔNG bắt người chơi mở menu để biết có chế độ.
- Thanh trên chuẩn: ← (`#bBk`: từ màn chơi/kết thúc về màn chọn; shared/resume.js cũng dựa vào `#home` và `#bBk`), 🏆 `#bBoard`, 🔊 `#bSnd`, EN/VI `#bLang` (nút trống chữ để shared/icons.js đổi sang SVG).
- Thách đấu (`#ch=`) và chơi hộ thật (`?helper=1`) vào thẳng ván, không qua màn chọn.
- Màn kết thúc: thẻ kết quả gradient theo màu nhấn + nút "Chơi lại" lớn + hàng nút phụ có nhãn (Khoe điểm, Xếp hạng, Đổi chế độ). Game không có container `cqw` (như Đập Deadline) thì viết CSS bằng px/clamp, không dùng shared/endui.css.
- Kiểm tra: xoá localStorage → mở game → phải thấy chế độ và cấp độ ngay, không cuộn, ở 320x560, 380x760 và ngang 844x390.

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

## 5c. Tiếp tục ván dở & nút Back (`shared/resume.js`, `shared/bridge.js`)
- Mọi game nhúng `shared/resume.js` (sau `bridge.js`, thẻ `<script defer>` cạnh `icons.js`; game sinh từ `tpl.html` đã có sẵn). File tự: LƯU ván đang chơi (localStorage `np-resume:<id>` từ `NP.state`, mỗi ~4 giây, khi ẩn tab/rời trang/Back), XOÁ khi `NP.result` (kết thúc) hoặc `NP.start` (ván mới), HIỆN thẻ "▶ Tiếp tục ván dở" ở màn chọn (`#home`), và xử lý nút BACK.
- **Game mới BẮT BUỘC**: (1) đăng ký `NP.state(()=>...)` trả `null` khi KHÔNG chơi và object nhỏ (<1,2 KB) khi đang chơi; (2) nhánh `if (NP.helper) {...}` khởi tạo ván từ `NP.initialState` (dùng chung cho chơi hộ VÀ tiếp tục: bridge cho `NP.helper = true` chỉ trong lúc khởi tạo, xong là false nên nút chia sẻ/chơi lại hoạt động bình thường); (3) gọi `NP.start()` khi bắt đầu ván và `NP.result()` khi kết thúc; (4) có nút/hàm về màn chọn (`#bBk`, `#homeBtn`, `#bHome`, `#sumHome`, `#bBack` hoặc hàm `goHome()`) để Back dùng; (5) màn chọn là phần tử `#home`; (6) không dùng id `#npResume`.
- Game dựng từ khung chung (có `snapP`) chỉ được lưu khi `snapP` trả khác null (có tiến trình thật). Ván tiếp tục chạy như chế độ "thách đấu" (không tính bảng điểm hôm nay); ván 'hôm nay' hết hiệu lực khi sang ngày mới, ván khác 7 ngày.
- Không lưu ở chế độ chơi hộ (`?helper=1`) và thách đấu (`#ch=`). Game chưa có `initialState` (Bạn Có Hiểu Tôi Không, Bé Đấu Bố Mẹ) chỉ dùng Back, không có tiếp tục.
- **Back**: khi đang chơi, game đẩy thêm 1 mục lịch sử (sau thao tác chạm đầu tiên) → Back/vuốt = về màn chọn của game (và lưu ván); Back lần nữa = đóng game (trang cổng); ← hoặc kết thúc thì mục đó được gỡ. Trang cổng gọi `NPResume.flush()` trước khi gỡ iframe và `NPResume.exitPlay()` khi bấm nút 🏠 của khung. Đừng gọi `history.pushState/back` tuỳ tiện trong game.
- Kiểm tra: `node scripts/cozygame/check-resume.js [--all]` (đã chạy trong `check.js` cho 9 game Cozy). Thử Back phải dùng `history.back()` ở cửa sổ ngoài (không dùng `page.goBack()`).

## 5d. Thoát ván, chống bấm nhầm, khoá màn hình trẻ nhỏ, banner trình duyệt trong app
- **Hỏi trước khi thoát ván ĐANG CHƠI** (`shared/exitconfirm.js`, tự nạp bởi `shared/resume.js` — game mới không phải nhúng gì): Back (nút/vuốt/phím Back), ← (`#bBk`, `#bBack`, `#homeBtn`), phím Esc, 🏠 của trang cổng đều hiện popup "Thoát ván này?" — nút to "Tiếp tục chơi" (mặc định) + nút phụ "Thoát" + dòng "Ván được lưu, lần sau bấm Tiếp tục". Chọn Thoát mới chạy hành vi 5c (về màn chọn; Back lần nữa đóng game). Màn chọn / kết thúc (`NP.peek()` = null) KHÔNG hỏi. Popup đọc màu thật của game (`--panel/--ink/--accent`, nên đúng cả Night Pass), nút ≥ 48px, không cuộn, game tạm dừng (`NP.pauseNow`) lúc hỏi. Đừng tự `preventDefault` Esc/Back trong game; hộp thoại của game (class `.ov.on`, `.overlay.on`, `dialog[open]`, `[role=dialog]`) được ưu tiên xử lý Esc trước.
- **Chống bấm nhầm khi đang chơi** (class `html.np-playing`, chỉ khi `NP.peek()` có ván): `overscroll-behavior:none` (không kéo-để-tải-lại), không chọn chữ / menu giữ-chạm, không phóng to bằng 2 ngón / chạm đúp. KHÔNG áp dụng ở màn chọn, kết thúc, ô nhập liệu (trợ năng giữ nguyên).
- **Khoá màn hình chơi — CHỈ Pop Play** (`shared/kidlock.js`, nhúng ở `popplay/index.html`; KHÔNG ở Night Play / Cozy, KHÔNG trong webview của app): nút ổ khoá 44px cạnh ← trong thanh điều khiển khung game → hộp xác nhận → toàn màn hình (Fullscreen API trên `<html>` để cổng phụ huynh hiện được; thử khoá hướng màn hình + `navigator.keyboard.lock(['Escape'])`, mọi thứ try/catch), ẩn ←/chia sẻ/chụp ảnh, hiện chỉ báo "Đang khoá". Đang khoá: Back/vuốt back/Esc/thoát toàn màn hình → `ParentGate.ask(ok, cancel, {fresh:true})` (luôn hỏi mới); thoát toàn màn hình mà chưa qua cổng → lớp phủ "Đã tạm dừng" (Chơi tiếp = vào lại toàn màn hình, cần chạm; Phụ huynh mở khoá). iPhone không có Fullscreen API: vẫn ẩn ← + cổng phụ huynh khi Back, hộp xác nhận kèm hướng dẫn "Thêm vào Màn hình chính" + "Truy cập có hướng dẫn". Game đóng (hết giờ) thì tự mở khoá. Đồng hồ giới hạn thời gian vẫn chạy.
- **PWA**: `manifest.webmanifest` (hub, standalone) và `popplay/manifest.webmanifest` (`display: fullscreen`, `display_override` fullscreen → standalone), icon `shared/app-*.png` / `shared/pop-*.png`, thẻ `apple-mobile-web-app-capable` ở trang cổng. File mới phải có trong `SHELL` của `sw.js` (nâng `CACHE`) và `scripts/build.js`.
- **Banner "Mở bằng trình duyệt"** (`shared/inapp.js`): nhận biết Zalo / TikTok / Facebook / Messenger / Instagram / Line qua user agent (thử trên máy tính bằng `?inapp=zalo`). Chỉ ở trang cổng (`index.html`, `cozyplay/`, `popplay/`) và trang chơi hộ / thách đấu (`?helper=1`, `#ch=`; `resume.js` nạp). Banner mỏng ở đầu trang (trang cổng: phần tử đầu `<body>` cột flex nên nội dung co lại; game: banner cố định + thân trang thu nhỏ đều) — không che header, không cuộn; bảng thả xuống chứa Sao chép link, Mở Chrome (Android, `intent://`), hướng dẫn "Bấm ⋯ rồi chọn Mở bằng trình duyệt", "Khôi phục Night Pass" (`subscribe.html#restore`) nếu webview chưa có pass; ✕ tắt nhớ 1 ngày (`np-inapp-x`). Trang cổng mới phải nhúng `shared/inapp.js`.
- Kiểm tra: popup thoát + khoá bằng puppeteer ở 390x844, 844x390 (VI + EN), kèm ảnh; banner ở cả 3 trang cổng + 1 game Cozy + 1 game Pop.

## 5e. Pop Play: nút "?" cách chơi (`shared/pophelp.js`) — game Pop mới BẮT BUỘC có
- Mỗi game Pop Play khai báo nội dung riêng bằng `<script>window.POPHELP={vi:{t:"Cách chơi",s:[["🐊","câu ngắn"],...],n:"nhắc nhỏ (tuỳ chọn)"},en:{...}}</script>` đặt NGAY TRƯỚC `<script src="../../../shared/pophelp.js" defer>` (cạnh `popfit.js`/`icons.js`). Chỉ 2–4 ý, câu ngắn, từ dễ hiểu cho bé và phụ huynh, VI + EN; **đọc code game để mô tả đúng luật thật, không bịa**.
- Module tự gắn nút "?" (SVG, 44px, id `phBtn`) vào `.top` ngay trước `#soundBtn`, mở thẻ có nền trong `#play` (không cuộn: tự co chữ cho vừa, màu theo theme game, nút lớn "Đã hiểu!/Got it!", nút loa đọc to bằng `speechSynthesis`), tạm dừng game bằng `NP.pauseNow()/resumeNow()` khi mở/đóng. Lần đầu vào game nút "?" chỉ nảy nhẹ vài nhịp (`localStorage pophelp-seen:<id>`), KHÔNG tự bật thẻ để không chặn chơi hộ / thách đấu / check.
- Game đổi luật/loại chơi thì cập nhật nội dung "?" cùng lúc. Đừng dùng id `phBtn`/`phOv`/`phCard` trong game. File `shared/pophelp.js` phải có trong `SHELL` của `sw.js`.
- Kiểm tra: mở từng game ở 390x844, 844x390, 320x568 (VI + EN): nút "?" ≥44px, không đè nút khác, tên game không bị cắt, thẻ không cuộn/tràn, "Đã hiểu" đóng được; chụp ảnh và tự nhìn.

## 6. Dữ liệu, quyền riêng tư
- Game không thu thập thêm dữ liệu cá nhân. Nếu thêm bất cứ thứ gì lưu trên máy chủ hoặc localStorage mới → cập nhật `privacy.html` (VI + EN) và ngày trong `shared/site.js`.
- Bảng xếp hạng tự nguyện; game trẻ em không có ô gõ tên.

## 6b. Offline & hiệu năng (không lag) — chạy `check-perf.js`
Nguyên tắc dự án: game chạy **offline, không lag, không gọi máy chủ lúc chơi**. Kiểm tra bằng `NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/check-perf.js [--offline] [--perf] [--quick] [--only=<chuỗi>]` (mặc định chạy cả hai, ~10 phút; `--quick` ~6 phút).
- **Offline:** script cài service worker khi còn mạng rồi TẮT HẲN máy chủ (setOfflineMode không áp dụng cho service worker) và mở từng trang/game, chơi tới màn kết thúc, đổi ngôn ngữ. Đạt = không request lỗi (trừ `/api/*`), không lỗi JS. Game/trang/tệp `shared/*` mới **phải được thêm vào `SHELL` trong `sw.js`** (script báo thiếu), ảnh nhỏ cần khi chơi (thumbs) cũng vậy; nâng `CACHE` (np-shell-vN) khi đổi danh sách. Ảnh og (xem trước mạng xã hội) không cần offline.
- **Phông Google:** thẻ `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` phải để dạng KHÔNG chặn hiển thị: `media="print" onload="this.media='all'"` + `<noscript>` (đã áp dụng cho mọi trang; trang mới phải làm giống). CSS luôn có phông dự phòng (`system-ui`, `Arial Black`).
- **Lag:** giả lập điện thoại 380×760, CPU chậm 4 lần. Đạt = FPS ≥ 40 khi chơi và ở màn kết thúc (≥ 55 ở CPU thường), không tác vụ dài > 250ms khi chơi, tải xong < 2,5 giây, DOM < 2500 phần tử, heap tăng < 6MB sau 3 ván liên tiếp. Tránh: animation vô hạn trên `box-shadow`/`filter` (dùng `opacity`/`transform` của phần tử phụ), `backdrop-filter` rộng, `setInterval` nhanh thừa, vòng lặp ResizeObserver, canvas quá lớn (giới hạn dpr ≤ 2).
- **Mất mạng:** `shared/track.js` không gửi khi `navigator.onLine === false`; Night Pass/bảng điểm/chia sẻ khi mất mạng chỉ báo nhẹ, không treo, không văng lỗi.
- Báo cáo "xong" phải kèm kết quả `check-perf.js` (hoặc nói rõ chưa chạy).

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

## Bảo vệ chia sẻ Night Pass (token gắn thiết bị)
- `shared/device.js` (nhúng ở `<head>` NGAY SAU `shared/guard.js` trên MỌI trang) bọc `window.fetch`: tự ký các request cùng nguồn tới `/api/pass*`, `/api/pro/*`, `GET /api/orders/<id>`, `POST /api/restore/verify`. **Game mới không cần làm gì thêm** — nhớ nhúng `device.js` (template `tpl.html` đã có).
- KHÔNG gọi các API đó bằng `XMLHttpRequest`, `navigator.sendBeacon` hoặc iframe/form: sẽ không có chữ ký → máy chủ từ chối (game giữ khoá). Dùng `fetch`.
- Không ghi đè `localStorage.pass` bằng bản cũ (đọc lại trước khi ghi, xem `shared/pass.js`): `device.js` có thể vừa nâng cấp token.
- Nhánh offline của `loadPro` không cần sửa: wrapper trả 401 giả cho máy chưa được xác nhận.
- Sửa luồng cấp token / `server/app.js` phần thiết bị → chạy `scripts/devtest/devtest.js` (35 kịch bản, DB giả) và kiểm tra bằng DB dev thật nếu được.
