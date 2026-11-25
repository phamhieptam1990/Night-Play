# TRẠNG THÁI CÔNG VIỆC: 2 game Pop Play + 2 bản Học Vui (đọc FILE NÀY ĐẦU TIÊN khi tiếp tục)
Cập nhật lần cuối: 2026-11-25. Chủ site nói tiếng Việt; trả lời tiếng Việt. Kế hoạch đầy đủ: [PLAN-GAME-VIET-ANH.md](PLAN-GAME-VIET-ANH.md) (mục 9-13 là hiệu lực).

## Quyết định ĐÃ CHỐT của chủ site (không hỏi lại)
- Hai game riêng trong Pop Play, "game lớn" (thế giới rộng, nhiều khu, HUD kính tối, ít chữ nhiều hình, nút SVG), 3D giả "Pop 3D" bằng CSS/SVG (không three.js).
- **Nhà Của Bi** (EN "Bi's Home", ngắn "Nhà Bi"): nuôi cún Bi (tắm, ăn, chơi, ngủ; nhà 5 khu; cấp; trang phục; túi đồ; nhiệm vụ ngày; mini-game). Id hiện tại `nuoi-thu-tieng-viet` (sẽ ĐỔI cuối cùng, ví dụ `nha-cua-bi`).
- **Quán Cáo Cam** (EN "Fox's Juice Bar", ngắn "Quán Cáo"): chủ quán Cáo Cam, khách thú gọi món (lời thoại tiếng Anh là cơ chế chơi), quán 5 khu, cấp quán. Id hiện tại `tiem-nuoc-ep-tieng-anh` (sẽ ĐỔI cuối, ví dụ `quan-cao-cam`).
- Bản Pop = TRÒ CHƠI THUẦN, tách hẳn Học Vui: không bài học, không quiz, không đọc/ghi `learn:*`, không link /learn/. Quà chỉ từ chơi (nhiệm vụ ngày, điểm danh không phạt, lên cấp, mini-game).
- Sau khi bản Pop xong làm thêm BẢN HỌC VUI (công trình trong khu vườn môn Tiếng Việt / Tiếng Anh, có bài học → quà), dữ liệu riêng, viết lại cầu nối `learn/gifts.js` chỉ cho Học Vui (hiện đã XOÁ).
- Linh vật: Bi (cún) và Cáo Cam, 5 skin mỗi con, ĐÃ sinh (gen-pop.js). Night Pass CHƯA làm.
- **Chủ site đã cho phép COMMIT + PUSH hai game Pop khi xong ("2 game poplay nếu xong thì commit push trước")**. Không commit `code.md`. Mỗi commit kết thúc bằng dòng `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Việc đã xong (chưa commit)
- Bộ khung dùng chung SẠCH: `shared/worldkit/world-kit.js|css` (HUD, popup, toast, cấp, nhiệm vụ; biến `--wk-off`). `learn/world/` là bản cũ (SẼ XOÁ khi hai game đã trỏ sang shared/worldkit).
- Hai game vòng 1-2 chạy được; đã đăng ký vào cổng: `popplay/index.html` (mảng games + art.nuoiThu/quanEp, thumb TẠM là cún cũ → ĐỔI sang Bi/Cáo mới), `shared/multi-games.js`, `shared/social.js` (board:false), `sw.js` (cache v631, có worldkit).
- Linh vật: `shared/art/mascot-pop-*.svg`, `scripts/art/gen-pop.js` + `pop-3d-*.js`, khối trong `shared/art/mascot-games.js`, `docs/MASCOT-CATALOG.md`.
- Bài đo sân khấu cổng sửa: `scripts/cozygame/check-showcase.js` (đếm thẻ tự động, ngoại lệ ô 80px iPad dọc, `sc-ic`) → `✓ 123 phép đo (--quick)`. `shared/showcase.css`: nút ‹ › lưới Night nổi hai mép (không chiếm hàng).
- Học Vui (RIÊNG, chưa commit, xong và đã đo): popup vườn ít chữ + nút SVG (`learn/garden/*`, css 23/24/25), kéo thả đồ trang trí từ túi (`garden-deco-tray.js`), hiệu ứng cảm xúc linh vật (`learn/mascot-fx.js`, `css/mascot-fx.css`, hook trong mascot-kit/index/bai), thanh mục tiêu vườn co theo nội dung, `scripts/learn/export-lessons.js` + `docs/duyet-bai-hoc/`.

## ĐANG CHẠY khi ghi file này (subagent, có thể đã xong/mất nếu phiên mới — kiểm tra bằng ListAgents rồi đọc file thật)
- Agent Nhà Của Bi (id abca127bef65046f8): vòng 3 + ĐỔI HƯỚNG thuần chơi + đổi tên. Phải: bỏ quiz/chọn bài/data lop3-q*/gift theo điểm quiz/📖; thêm quà điểm danh + ≥2 mini-game; khôi phục #home tối giản + ▶, module Pop (pophelp, popmenu, popfit, resume...), nhúng linh vật Bi qua mascot-art.js; ĐẠT các bài đo: check-popmenu, check-pop, check-portal, check-popbtn, check-poptitle, check-layout-pop, check-helppopup, check-popnp, check-mascot (`--quick --only=<id>`).
- Agent Quán Cáo Cam (id a51644c6b42816506): cùng yêu cầu; bỏ 📖/learn/*, dữ liệu tự chứa, thêm cửa hàng (máy ép/bàn ghế/biển hiệu), có thể mini-game "đỡ trái cây".
- Ranh giới agent: chỉ sửa trong thư mục game + shared/art/<tranh game> + scripts/art/gen-*-game + scripts/art/tiem/{vi,en}-*.js; không sửa shared/*, server/*, learn/*, sw.js, kit; không commit/push.

## BƯỚC TIẾP THEO (theo thứ tự)
1. Chờ hai agent báo xong (hoặc kiểm tra file thật nếu agent mất). Tự mở từng game qua cổng (`popplay/index.html`, NẠP RIÊNG từng game bằng goto, đổi hash không đổi game) bằng Chrome thật, chụp ảnh 390×844, 360×640, 844×390 và TỰ NHÌN. Đo: các bài đo ở trên (NODE_PATH puppeteer-core, xem dưới).
2. Đổi thumb cổng sang Bi/Cáo mới (từ `shared/art/mascot-pop-*.svg`).
3. ĐỔI ID + thư mục sang tên mới (game dir, shared/art/nuoi-thu & tiem-nuoc-ep, gen scripts, mascot id trong gen-pop/mascot-games, popplay/index.html, multi-games, social, sw.js, widebg/music nếu có); chạy lại các bài đo.
4. NIGHT PASS cho từng game (GAME_RULES mục 5; mẫu `server/pro/lang-cua-be.js`, đăng ký trong `server/app.js` như dòng POP_GAMES / route /api/pro/<id>.js; 4 giao diện KHÁC HẲN bản free; `check-skins.js`): giao mỗi game một agent SAU khi mã game ổn định.
5. COMMIT TÁCH RIÊNG, rồi PUSH (đã được phép): (a) hai game + tranh + bộ sinh + worldkit + linh vật + đăng ký cổng + check-showcase/showcase.css; (b) Học Vui (garden popup/nút SVG/kéo thả/mascot-fx/export-lessons) — chỉ push nếu chủ site cho phép; nếu commit (a) và (b) chung một nhánh thì push sẽ đẩy cả hai: HỎI chủ site hoặc dùng nhánh riêng. `sw.js` đang lẫn mục của cả hai nhóm: khi commit (a) chỉ để mục worldkit + game, đảm bảo MỌI tệp sw.js nhắc tới đều có trong commit (nếu mascot-fx vào sw thì tệp mascot-fx phải cùng commit).
6. Bản HỌC VUI của hai game (mục 13 kế hoạch) bằng agent, sau khi bản Pop đã push.

## Cách chạy bài đo / chụp ảnh
- `export PATH="$PATH:/opt/homebrew/bin"`; `NODE_PATH=/private/tmp/claude-501/-Users-lap60775-a4b-game/8b074620-5140-4884-b48d-ecf530b6922f/scratchpad/pp/node_modules` (nếu mất thì `npm i puppeteer-core` ở thư mục tạm); Chrome `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (`--allow-file-access-from-files`).
- Quy ước repo: chỉ kiểm phạm vi đã sửa, không chạy `check.js` toàn repo; luôn nhìn ảnh thật trước khi báo xong; không push khi chưa được phép; không commit `code.md`.

## Cập nhật 2026-11-25 buổi tối (phiên mới, hai agent cũ đã dừng, không còn chạy)
- Đã kiểm thật: màn chính + màn chơi 390x844, 844x390, 667x375 của cả hai game, không lỗi JS. Thumb cổng đã là Bi/Cáo mới.
- Đã sửa màn NGANG: Bi (css/70-ui.css: .side nổi góc trái, bỏ h1), Quán (css/10-base.css: thanh nút dưới chuyển thành cột dọc bên phải; js/44-zones.js: khung dựng cỡ ảo 340x462 rồi scale khi thấp).
- check-pop.js: ô cổng tối thiểu 60px ở điện thoại ngang (khớp code cổng). check-popmenu.js: thêm protocolTimeout, vẫn timeout khi chạy lẻ (chưa rõ nguyên nhân).
- check-layout-pop / check-popnp chỉ hợp game menu-thẻ cũ, báo lỗi giả với game lớn (chưa có cách chạy đúng) .
- CHƯA làm: Night Pass, đổi id, commit/push, bản Học Vui (bước 6), nút 🏠 Bi màn ngang hơi sát nút ?.

## Cập nhật tối 2026-11-25 (sau push 622992f)
- Bản Pop (2 game) ĐÃ COMMIT + PUSH (622992f). sw.js trong cây làm việc còn mục mascot-fx (nhóm Học Vui) chưa commit.
- Đã kill 15 phiên claude khác theo yêu cầu chủ site (tránh tự chạy lại đốt quota). Không tạo cron.
- Đang chạy 2 agent nền (bản Học Vui): Nhà của Bi (learn/nha-bi/, state docs/STATE-HOCVUI-NHABI.md) và Quán kem Tiếng Anh (learn/quan-kem/, state docs/STATE-HOCVUI-QUANKEM.md). Nếu mất: đọc 2 tệp state đó rồi giao agent mới.
- CÒN LẠI: Night Pass cho 2 game Pop (chủ site: nếu quá lớn thì 2 giao diện mỗi game thay vì 4; mẫu server/pro/lang-cua-be.js), đổi id (tuỳ), commit/push Học Vui khi chủ site cho phép.

---
# CẬP NHẬT CUỐI PHIÊN 2026-11-26 (ĐỌC PHẦN NÀY TRƯỚC; phần trên là lịch sử)
Tất cả đã commit + push tới `1d7e956` trừ phần ĐANG CHẠY bên dưới. Không tạo cron. Đã kill hết phiên claude khác (theo yêu cầu chủ site, tránh đốt quota).

## ĐÃ XONG (đã push)
- Pop Play: Nhà Của Bi + Quán Cáo Cam (thuần chơi), Night Pass 2 giao diện/game (skin Pop có sẵn, KHÔNG vẽ thân mới), hướng dẫn coach mark (shared/worldkit/world-guide.js), sửa layout màn ngang/máy tính.
- Level up 28 game (shared/levelup.js); Tìm Đôi Thẻ + Ghép Ba Thẻ khó thật (trần 6 level, docs/CHECKLIST-LEVELUP.md).
- Học Vui: learn/nha-bi (mỗi lớp 1 thú: thỏ Bông, mèo Mây, cún Bi, gấu trúc Trúc, rồng Tia; 5 cấp thú to dần), learn/quan-kem (mỗi lớp 1 quán: kem, bánh, nước ép, pizza, cà phê sách; 5 cấp mặt tiền), quà theo lớp (learn/gifts.js, gifts-kem.js), trang duyệt learn/review-game-lon.html.
- Vườn: vào môn Tiếng Việt/Tiếng Anh trong learn/garden/index.html hiện CHUYỂN THẲNG sang game (nha-bi / quan-kem); Toán giữ khu vườn; `?garden=1` xem vườn cũ. Nút ← trong game về ../index.html?grade&subj.
- Trang giới thiệu landing: thêm cửa Học Vui, hàng icon game giữa phóng to + sóng (vừa khung), menu 1000-1180px không đè logo.

## TẦM NHÌN MỚI CỦA CHỦ SITE (2026-11-26): "1 khu vườn có nhiều chuồng thú và 1 khu chợ có nhiều quán"
- Tiếng Việt Học Vui = **VƯỜN THÚ**: một khu vườn trung tâm, 5 chuồng (mỗi lớp một thú), chạm chuồng vào phòng chăm thú (learn/nha-bi/index.html?grade=N&from=hub).
- Tiếng Anh Học Vui = **KHU CHỢ**: một khu chợ/phố, 5 quán (mỗi lớp một quán), chạm quán vào learn/quan-kem/index.html?grade=N&from=market.
- Mở khoá: chuồng/quán lớp N mở khi bé đã học ≥1 chủ đề lớp N (learn:pf:<hồ sơ>:lp:<N>:<tviet|tanh> có l>0) HOẶC là lớp hiện tại (learn:grade). Khoá: bóng mờ + ổ khoá + vòng tiến độ; chạm → popup ít chữ chỉ đường học bài. Huy hiệu "có quà/xu chờ" + chấm cấp.
- Mục đích: điểm đặc biệt khác hẳn 2 game Pop (Pop chỉ 1 nhà / 1 quán).

## ĐANG CHẠY khi ghi (2 agent nền; nếu mất thì đọc state rồi giao agent mới với cùng yêu cầu)
- Vườn Thú: learn/vuon-thu/ (+ scripts/art/gen-vuon-thu.js, docs/STATE-VUON-THU.md). Sửa nhỏ nút ← của learn/nha-bi theo ?from=hub.
- Khu Chợ: learn/khu-cho/ (+ scripts/art/gen-khu-cho.js, docs/STATE-KHU-CHO.md). Sửa nhỏ nút ← learn/quan-kem/js/52-world.js theo ?from=market.
- Cả hai KHÔNG được sửa learn/garden/index.html (để phiên chính đổi chuyển hướng).

## BƯỚC TIẾP THEO (theo thứ tự)
1. Khi 2 agent xong: TỰ XEM ảnh (390x844, 844x390, 1440x900; bé mới + bé đã học nhiều lớp). Phải ĐẸP, không chữ dài.
2. Sửa learn/garden/index.html: hook chuyển hướng đầu trang và hàm u() của thanh đổi môn: tviet → ../vuon-thu/index.html, tanh → ../khu-cho/index.html (đang trỏ ../nha-bi và ../quan-kem). Nút ← trong vườn thú/khu chợ về ../index.html?grade&subj. Cập nhật learn/review-game-lon.html thêm 2 trang mới.
3. Chạy lại `node scripts/learn/check-garden.js` (phải ✓), kiểm sw.js (mọi tệp có thật và đã commit; nâng CACHE, hiện v637), commit tách riêng + push (chủ site đã quen lệnh "commit push"). Không commit learn/world/ (bộ khung cũ không dùng; hỏi chủ site nếu muốn xoá).

## QUYẾT ĐỊNH ĐANG CHỜ CHỦ SITE (chưa trả lời)
- Giữ bé ở Học Vui thay vì chơi Pop: (a) chỉ đồ độc quyền ở Học Vui, (b) + công tắc phụ huynh "học trước chơi sau" trong khu vực phụ huynh Pop, (c) + lời mời sang Học Vui sau ván Pop. Quy tắc cũ: Pop thuần chơi, không link /learn/ — (b)(c) phá quy tắc này nên cần chủ site cho phép.
- Điểm đặc biệt thêm cho Học Vui (đã có tầm nhìn vườn thú/khu chợ ở trên; còn các gợi ý: bé dạy thú / quán chỉ có từ đã học, truyện theo bài học, nhiệm vụ ôn mỗi ngày) — chỉ làm nếu chủ site muốn.
- Đổi toàn bộ linh vật sang phong cách mới: chủ site ĐÃ BÁC phong cách "con bò/cáo 3D mới" (agent vẽ xấu). GIỮ phong cách Pop 3D mềm hiện có cho mọi linh vật.

## LỖI/TỒN ĐỌNG ĐÃ BIẾT
- Night Pass 2 game Pop: chưa thử máy chủ/thanh toán thật; chưa đăng ký POP_GAMES/NEW_GAMES trong server/app.js; ô xem trước bảng giao diện chỉ gradient; 2 giao diện của Bi chỉ đổi nền phòng chung.
- Quán lớp 4 chưa có "đọc thực đơn kèm giá"; từ vựng quán chưa bám từng bài; Cáo/chủ quán chưa có skin cầm đạo cụ theo quán (Học Vui dùng cún chủ quán).
- Ghép Ba Thẻ level 6 bot thắng 49% (mục tiêu 25-40%); Khoe điểm/Thách ở level 4-6 mã hoá theo độ khó cũ.
- check-popmenu hay timeout; check-layout-pop/check-popnp chỉ hợp game menu thẻ cũ (báo lỗi giả với game lớn); check-skins báo 0 skin với game lớn.
- Hướng dẫn: ở 1440x900 thẻ hướng dẫn Nhà Của Bi che một phần cột nút khu; 667x375 pill HUD Nhà Của Bi chồng nút cổng.
- Landing: ô tải sáng (giao diện sáng) chưa xem.

## Cách chạy bài đo / chụp ảnh (nhắc lại)
- `export PATH="$PATH:/opt/homebrew/bin"`; NODE_PATH puppeteer-core ở `/private/tmp/claude-501/-Users-lap60775-a4b-game/079674bc-a5ec-429d-b755-df793dc8c5af/scratchpad/pp/node_modules` (mất thì `npm i puppeteer-core` ở thư mục tạm); Chrome `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (`--allow-file-access-from-files`). Quy ước: chỉ kiểm phạm vi đã sửa, tự nhìn ảnh thật, không push khi chưa được yêu cầu, không commit code.md. Mỗi commit kết thúc `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## HOÀN THÀNH 2026-11-26 (sáng): Vườn Thú + Khu Chợ ĐÃ XONG và đã đẩy lên
- learn/vuon-thu/ (Tiếng Việt, 5 chuồng) và learn/khu-cho/ (Tiếng Anh, 5 quán) xong, xem ảnh thật đạt; learn/garden/index.html đã chuyển hướng: tviet → vuon-thu, tanh → khu-cho (?garden=1 xem vườn cũ); nút ← trong nha-bi/quan-kem về hub khi có ?from=hub|market.
- check-garden ✓ 266; sw.js cache v639, mọi tệp có thật. Trang duyệt learn/review-game-lon.html có link 2 hub.
- Còn lỏng: hướng dẫn ở hub chỉ hiện sau 2-3 giây; chưa bấm tay ← ở quán/phòng thú để thấy về hub (đã xác nhận href); Khu Chợ chưa có hoạt cảnh khách thú vào quán; vẫn chờ chủ site quyết mức "học trước chơi sau"/lời mời sang Học Vui.
