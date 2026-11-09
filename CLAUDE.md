# Play Hub (Pop Play / Cozy & Night Play / Night Pass)

Khi tạo hoặc sửa BẤT KỲ game nào, đọc và làm theo [GAME_RULES.md](GAME_RULES.md) trước. Đó là danh sách các lỗi người dùng đã báo lặp lại (một màn hình không cuộn, chữ trong thẻ, nhân vật không mờ, nút ←, gợi ý "?", màn hình ngang, chơi hộ tiếp tục, thách đấu, Night Pass khác hẳn free).

- Trả lời người dùng bằng tiếng Việt.
- Game Cozy sinh tự động: sửa `scripts/cozygame/specs/<id>.js` + `tpl.html`, rồi `node scripts/cozygame/gen.js all`; không sửa tay file `cozyplay/games/<id>/index.html` được sinh ra.
- Trước mỗi commit chạy `NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/check.js` (phải "✓ tất cả đạt").
- Luôn kiểm tra giao diện bằng trình duyệt thật (puppeteer-core + Chrome) và tự nhìn ảnh trước khi báo xong.
- Không push khi chưa được yêu cầu; không commit `code.md`.
