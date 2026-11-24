# Play Hub (Pop Play / Cozy & Night Play / Night Pass)

Khi tạo hoặc sửa BẤT KỲ game nào, đọc và làm theo [GAME_RULES.md](GAME_RULES.md) trước. Đó là danh sách các lỗi người dùng đã báo lặp lại (một màn hình không cuộn, chữ trong thẻ, nhân vật không mờ, nút ←, gợi ý "?", màn hình ngang, chơi hộ tiếp tục, thách đấu, Night Pass khác hẳn free).

- Trả lời người dùng bằng tiếng Việt.
- Khi vẽ/đổi linh vật hoặc skin 2D (SVG): đọc và làm theo [docs/MASCOT-ART-RULES.md](docs/MASCOT-ART-RULES.md) trước (hai phong cách Pop / Night tách bạch, không vẽ tự do).
- Game Cozy sinh tự động: sửa `scripts/cozygame/specs/<id>.js` + `tpl.html`, rồi `node scripts/cozygame/gen.js all`; không sửa tay file `cozyplay/games/<id>/index.html` được sinh ra.
- Trước mỗi commit chạy `NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/check.js` (phải "✓ tất cả đạt").
- Luôn kiểm tra giao diện bằng trình duyệt thật (puppeteer-core + Chrome) và tự nhìn ảnh trước khi báo xong.
- Không push khi chưa được yêu cầu; không commit `code.md`.
- **Cấu trúc tệp (quy tắc bắt buộc)**: mỗi tệp một nhiệm vụ rõ ràng, tách tệp theo chức năng; KHÔNG để một tệp dài quá. Tệp tay viết: HTML ≤ 300 dòng, JS và CSS ≤ 400 dòng (hết sức cần mới tới 600); mỗi dòng ≤ ~200 ký tự. Vượt thì tách module (css/…, js/…) thay vì dồn thêm. Không nhồi CSS/JS dài vào `<style>`/`<script>` trong HTML — để thành tệp riêng và nạp bằng link/script. Tệp SINH TỰ ĐỘNG (icons.js, curriculum.js, svg, lessons/index.js…) không tính nhưng phải có bộ sinh ở scripts/. Khi sửa một tệp đã quá dài thì tách bớt phần đang sửa ra tệp mới. Chi tiết: GAME_RULES.md mục "Cấu trúc tệp".
