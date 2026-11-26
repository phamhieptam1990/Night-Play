# TRẠNG THÁI: LỚP HỌC TRUYỆN (Học Vui) — đọc FILE NÀY ĐẦU TIÊN khi tiếp tục
Cập nhật: 2026-11-26. Chủ site nói tiếng Việt; trả lời tiếng Việt. Không tạo cron. Chỉ kiểm phạm vi đã sửa, tự nhìn ảnh thật. Chủ site quen lệnh "commit push".

## Yêu cầu ĐÃ CHỐT của chủ site
- Thêm "Lớp học truyện" CHẠY SONG SONG với lớp học truyền thống (giữ nguyên, không đổi hành vi). Mỗi chủ đề (71 chủ đề: toan/tviet/tanh × lớp 1-5) là MỘT BẢN ĐỒ để bé biết đi đâu.
- Ngã rẽ: đường "đi từng bước" (khám phá → thử thách) hoặc đường "băng qua thử" (thi vượt bài). Thi ≥3 sao = xong bài (LearnPath.completed). Chủ đề không có kiểm tra → đường thẳng, không ngã rẽ. Tiến độ DÙNG CHUNG với lớp truyền thống (LearnPath), không khoá ghi riêng.
- Bé phải thấy mình đang KHÁM PHÁ, không thấy học/thi: tên điểm dừng đặt theo từng câu chuyện (trường `nodes`), không chữ học/bài/kiểm tra/thi/quiz/test; nút là SVG (không chữ), có nút loa trên từng điểm.
- ĐÃ LÀ TRUYỆN thì chỉ cần đạt mục tiêu bài học; mọi thao tác phải là của truyện (hình, âm thanh, hoạt cảnh), KHÔNG mở lại màn bài học/kiểm tra cũ (lỗi hiểu sai trước đó: bản đầu mở lop/bai.html và trang kiểm tra cũ → chủ site bực).
- Ảnh kiểu 3D render (đảo nổi, lâu đài) của chủ site: KHÔNG làm được (không có công cụ sinh ảnh); giữ nền SVG hiện tại. Nếu sau này chủ site đưa tranh nền thì đặt điểm dừng lên trên.

## ĐÃ XONG (đã commit + push; commit mới nhất a62df3a, sw cache v645)
- learn/story/ : index.html (chọn môn/lớp, bản đồ đảo), map.html (bản đồ một chủ đề), js/ (core, route, stage, panel, map-page, pick-page, story-default, voice-ui), css/, art/ (30 nền bg-<subj>-<lớp>-p|l.svg + 8 icon stop-*.svg; bộ sinh scripts/art/gen-story.js + scripts/art/story/*).
- learn/story/data/<subj>-g<N>.js (15 tệp, 71 chủ đề): LearnStories[id] = {title,intro,fork,learn,test,end, nodes{intro,fork,learn,test,end}} vi/en, đã rà từ cấm.
- Lối vào: nút "Lớp học/Lớp truyện" ở learn/lop/index.html (learn/lop/js/mode.js, css/map-mode.css); nút ← bai.js và trang kiểm tra (learn/js/menu.js) quay về bản đồ truyện khi có cờ sessionStorage learn:from=story.
- Bản đồ: nút loa từng điểm, bảng lời kể mới (hình gợi nhớ, nút SVG), nhãn nhánh nhanh có ★ không trùng, đã quét 71 chủ đề x 4 cỡ màn sạch.
- Kiểm: scripts/learn/check-story.js (✓ 71 chủ đề). Học Vui khác (cùng phiên): link bài kế (learn/lesson-link.js), sửa thông báo quà tviet/tanh, thêm kiểm tra 4 chủ đề Việt, cân quà (đã push a87de18).
- Module âm thanh (CHƯA commit): learn/story/sfx.js, learn/story/js/sfx-ambient.js, learn/story/sfx-test.html. API StorySfx.play(tap|pick|good|oops|win|step|pop|whoosh|star), ambient(toan|tviet|tanh|null), muted/setMuted (dùng khoá learn:music). Cần nạp 2 thẻ <script> (js/sfx-ambient.js rồi sfx.js) vào index.html/map.html/scene.

## ĐÃ XONG (2026-11-26, phiên sau): Cảnh truyện learn/story/scene/ + scene.html
- Cảnh khám phá + thử thách + màn kết đã có (scene.html?grade&subj&topic&step=learn|test); bản đồ mở cảnh này, không mở lop/bai.html nữa. sfx đã nạp. Đã chơi thử 4 chủ đề x 2 cỡ màn, không lỗi JS; sửa ô gõ số bị cắt chữ (css/input.css).
- sw.js: v646; đổi chiến lược (tệp con stale-while-revalidate, HTML mạng-trước timeout 1.5s) để có mạng không chậm hơn offline.
- Việc dở: scene.html nạp ~70 thẻ script -> gộp bằng bộ sinh trong scripts/ (agent đang làm); chủ site chưa nghe thử âm thanh.

## BƯỚC TIẾP THEO (theo thứ tự)
1. Khi agent Cảnh truyện báo xong: nạp sfx vào trang cảnh (nếu chưa), tự chơi thử vòng đầy đủ ≥6 chủ đề (2 mỗi môn), xem ảnh 390x844 và 844x390 mỗi loại cảnh, chạy `node scripts/learn/check-story.js` (cần NODE_PATH puppeteer-core ở scratchpad/pp/node_modules; export PATH=$PATH:/opt/homebrew/bin).
2. Thêm tệp mới vào sw.js (mẫu: tìm "/learn/lesson-link.js" trong SHELL, nối thêm; kiểm tệp có thật), nâng CACHE (hiện np-shell-v645), commit + push (cuối commit: Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>). Không commit learn/world/ và code.md.
3. Việc nhỏ còn lại: nút 🎶 (learn/js/events.js) chưa tắt ngay nhạc nền truyện (cần gọi StorySfx.ambient); hộp thoại bật loa trang kiểm tra ở màn ngang thấp chưa kiểm lại; bản đồ lớp/nền: cọ/cây còn có thể chạm đường ở vài nền; một số dòng dữ liệu >200 ký tự (vi+en cùng dòng).
4. Chủ site cần nghe thử âm thanh qua learn/story/sfx-test.html và đọc thử vài truyện (không có công cụ để đánh giá độ cuốn/giọng đọc).
5. Hỏi chủ site khi rảnh: từ vựng quán Tiếng Anh bám từng bài (chưa làm); kiểu thao tác nào của bài chưa có renderer truyện riêng (agent sẽ báo bảng).

## Cách chạy bài đo
- `export PATH=$PATH:/opt/homebrew/bin`; NODE_PATH=/private/tmp/claude-501/-Users-lap60775-a4b-game/25027d3a-b40d-481d-b150-b99d6eb71dab/scratchpad/pp/node_modules (mất thì npm i puppeteer-core ở thư mục tạm); Chrome /Applications/Google Chrome.app/Contents/MacOS/Google Chrome; server tĩnh scratchpad/srv7.js cổng 8917 (python http.server bị chặn). URL thử: /learn/story/index.html?grade=4&subj=toan, /learn/story/map.html?grade=3&subj=toan&topic=g3_fraction_intro.
