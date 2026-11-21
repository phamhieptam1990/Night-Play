# Cấu trúc trang Vườn Học Vui (đã tách xong)

Trang vườn là trang VIẾT TAY ở `learn/garden/index.html` (URL `/learn/garden/`). Tệp cũ `shared/art/garden/preview-garden-play.html` chỉ còn là trang chuyển hướng để liên kết cũ vẫn chạy.

## Tệp và việc của từng tệp
- `learn/garden/garden-layout.js`: **danh sách duy nhất** gồm `LAYERS` (tầng z), `STYLES` (CSS), `SCRIPTS` (JS), `START` (hàm khởi động), `ART` (đường dẫn thư mục ảnh `shared/art/garden/`). Trang gọi `GardenLayout.writeStyles()` ở `<head>` và `GardenLayout.writeScripts()` cuối `<body>`.
- `learn/garden/css/NN-ten.css`: CSS theo chức năng. **Thứ tự số = thứ tự nạp**, tệp sau ghi đè tệp trước. Ba lớp popup (04, 05, 07, 10, 14) còn tách nhau vì xen kẽ với CSS khác; gộp lại cần kiểm bằng Chrome.
- `learn/garden/garden-*.js`: mỗi chức năng một tệp (định nghĩa + hàm `init...`); `garden-engine.js` chỉ gọi `GardenLayout.start()`.
- `shared/art/garden/garden-data.js`: SINH bởi `scripts/learn/gen-scene-art.js` (CATS, CI, PLOTS, SLOTS...). Bộ sinh không còn sinh HTML/CSS/JS của trang vườn.
- Đường dẫn ảnh trong JS luôn viết `GardenLayout.ART + "tên"`, không viết đường dẫn tương đối trần.

## Chỉnh vị trí các vùng (không cần đoán số)
- Vị trí chỉnh tay nằm một chỗ: `learn/garden/garden-places.js` (`BLD` nhà/kho/ao, `GIFT` hộp quà). Ô trồng, vật nuôi, cửa chuồng là dữ liệu SINH (`garden-data.js`).
- Mở `learn/garden/?edit`: kéo vùng để dời, kéo ◢ để đổi cỡ, kéo 🎁; bấm "Sao chép" rồi dán đè khối trong `garden-places.js`. Mã: `garden-edit.js`, `css/17-edit.css`.

## Quy hoạch 3 khu — vườn GỌN, chỉ rộng bằng khu giữa (toàn cảnh ~1555 × 1040, khai ở `LANDS` trong scripts/learn/garden-land.js)
- **Khu chăn nuôi** = giữa vườn: nhà, ao, 3 chuồng, kho, cối xay, chuồng thú (cửa chuồng `STABLE` trong gen-scene-art.js, cũng là `DOOR` của trang), vật nuôi.
- **Khu hoa màu** = MỘT ruộng 4×3 đất trống (12 ô) ở góc trái phía trên, gần nhà, bé tự trồng.
- **Vườn cây lâu năm** = ba dải: hàng ngoài cùng bên trái (5 mảnh, 20 ô), hàng trong bên trái ao (4 mảnh, 16 ô), và mép phải (7 mảnh, 28 ô).
- **Chuồng** (`PENS` trong gen-scene-art.js): chuồng bò gần kho; chuồng gà vịt và heo cừu xa nhà, ở phía dưới.
- Khung cảnh: `MXL/MXR/MT/MB` trong garden-world.js (chỉ còn núi phía trên, vài đèn/thông ở góc; không có đường làng, suối, ruộng phía nam).
- Màn hình mở ra vừa khít (`viewHomeScale`); cỡ vùng bấm `.hs` và tỉ lệ khung tính bằng JS từ `W,H` (garden-plots.js).
- Mảnh `legacy:true` chỉ vẽ ở cảnh cấp 1-3 (cảnh nhỏ cũ).

## Cây lâu năm: thứ tự trước/sau
Mọi cây trong vườn cây là ảnh rời (`garden-trees.js`, lớp `sprites`), xếp theo độ sâu y nên cây ở hàng gần người nhìn luôn đè lên cây hàng sau. Mango dùng PNG vẽ tay (`tree/tree_mango.png`); các giống khác do `gen-scene-art.js` xuất `tree/tree_<giống>.svg` từ `bigTree` (không bóng, bóng do `garden-shadow.js` vẽ). Thêm giống mới có PNG: bỏ tên giống vào `TREE_PNG` và `TSPR`.

## Đất trống cho bé tự trồng
- `scripts/learn/garden-land.js`: mảnh đất khai `{ empty: true }` (vd `land("lua", [380, 1420], 4, 3, { empty: true })`) = mọi ô là đất cày trống, bé bấm từng ô để trồng. Số ô = cols × rows (12–24 ô). Hiện 5 mảnh hàng cuối (62 ô). Muốn thêm/bớt mảnh: sửa `LANDS`, rồi `node scripts/learn/gen-scene-art.js`.
- `garden-crops.js` + `css/18-crops.css`: vẽ cây lớn dần (`crop_<giống>_s0..s3.svg`, chín = `crop_<giống>.svg`, sinh bởi `gen-crops-art.js`) và NHỚ trên máy (`gardenFarm` trong localStorage). Chỉ áp cho ô không vẽ sẵn cây trong ảnh cảnh.

## Thêm một tính năng
1. Tạo `garden-<ten>.js` (và `css/NN-<ten>.css` nếu cần).
2. Thêm tên vào `SCRIPTS`/`STYLES` (và hàm `init<Ten>` vào `START`) trong `garden-layout.js`.
3. Cần HTML mới thì sửa tay `learn/garden/index.html`.
4. Nếu cần dữ liệu mới thì thêm vào `gen-scene-art.js` rồi chạy `node scripts/learn/gen-scene-art.js`.

## Kiểm thử
Mở `learn/garden/index.html` bằng Chrome: không lỗi trang; 266 ô, 61 vật nuôi, 4 vùng nhà/kho/ao; bấm ô mở popup, ☰ mở menu, bấm vật nuôi mở thẻ; sau đó `node scripts/learn/check-garden-art.js`.

## Ba trang con (Trong nhà, Kho, Ao cá) — `scripts/learn/gen-subpages-art.js`
- Giao diện như trang vườn: trải kín bề ngang, nút ← góc trên-trái về `learn/garden/`, tên + chọn cấp ở thanh trên (không còn thanh "Duyệt", không chữ giải thích). Sinh ra `shared/art/garden/preview-house|barn|pond.html`.
- **Linh vật trò chuyện** dùng chung (`MC` trong `SHARE_JS`): ảnh thử lần lượt các đường dẫn rồi mới dùng biểu tượng.
  - Kho: bấm thùng nông sản → linh vật của nông sản đó nói chuyện. Tranh vẽ đặt ở `shared/art/garden/kho/mascot_<id>.svg` (id: carrot tomato strawberry wheat corn sunflower mango orange apple pear); chưa có thì dùng `mascot_<id>_l<cấp>.svg` (6 cây hoa màu), chưa có nữa thì biểu tượng. Lời thoại ở `MS` trong bộ sinh.
  - Ao: nút linh vật góc dưới-trái → "Cùng làm bài" (Toán / Tiếng Việt / Tiếng Anh, 3 bài, có gợi ý, làm xong mở thức ăn cho cá). Tranh đặt ở `shared/art/garden/ao/mascot.svg` (tạm 🐸). Ngân hàng câu hỏi ở `QB`.

### Bộ linh vật Kho + Ao (phong cách Pop, CHỜ CHỦ SITE DUYỆT)
- Sinh bởi `scripts/learn/gen-kho-mascots.js`: 10 con trái cây/rau củ (`kho/mascot_<id>.svg`: Cà Rốt, Cà Chua, Dâu Dâu, Bông Lúa, Bắp Bắp, Hướng Dương, Xoài Ngọt, Cam Cam, Táo Đỏ, Lê Lê) + Sen Sen cho ao (`ao/mascot.svg`). Theo `docs/MASCOT-ART-RULES.md` (Pop): viewBox 256, không viền đen, mắt to 2 điểm sáng, má hồng, màu qua biến CSS, nhún + chớp mắt (`npa-*`); chữ ký khuôn mặt ghi trong `<desc>`; đạo cụ nhận diện môn: khối + = Toán, sách = Tiếng Việt, cờ = Tiếng Anh, vở + bút chì = Sen Sen.
- Trang duyệt: `shared/art/garden/preview-kho-mascots.html` (cỡ 200 / 96 / 40px). Mới có skin Mặc định; 4 skin trả phí + 8 theme làm sau khi duyệt dáng.

## Giữ chân bé: phiêu lưu + mục tiêu + linh vật nhớ bé (kho chung `learn/farm.js`)
- `learn/farm.js` (`window.Farm`, lưu `learn:farm` trên máy): hạt giống, nông sản trong kho theo giống, mục tiêu hôm nay, tiến độ phiêu lưu theo môn, trí nhớ về bé (lỗi hay sai, số ngày liền, lần chơi gần nhất), trang phục. Sao vẫn là `learn:stars`.
- `learn/adventure.js` (`window.Adventure`): 3 chương × 3 môn (Cà Rốt / Bông Lúa / Dâu Dâu); mỗi lượt 5 câu = 5 chặng; 5/5 đúng thì qua chương. Thêm chương = thêm mục vào `S` trong tệp.
- Game học (`learn/index.html`): dải chương + chặng, thanh mục tiêu 🎁 hôm nay, cây của môn lớn lên theo câu đúng (`crop_<giống>_s0..s4`), linh vật chào theo trí nhớ, màn kết thúc có đoạn chuyện + thưởng (nông sản vào kho, hạt giống, quà mục tiêu, trang phục mới).
- Vườn: HUD đọc `Farm`; trồng tốn 1 hạt (hết thì báo học bài), thu hoạch cộng vào kho (`garden-farm.js`, hook trong `garden-core/fx/plant-card`).
- Trang Kho đọc số thật; linh vật nhắc số trong kho + chuỗi ngày. Trang Trong nhà có tủ đồ (đổi trang phục theo số sao); trang phục hiện trên linh vật trong game học.

## Giọng đọc (`learn/voice.js`)
- Cửa chung `Voice.say(text, nhân_vật, ngôn_ngữ)`: phát tệp thu sẵn `shared/audio/voice/<nhân_vật>/<mã>.mp3` nếu có (offline, giọng thật/AI chất lượng cao), không có thì dùng giọng máy tốt nhất + cao độ/tốc độ riêng từng nhân vật (`PROFILE`).
- Nhân vật: `toan` (Mochi), `tviet` (Mầm), `tanh` (Bibi), `sen` (Sen Sen), `narr`, `def`. Game học, kho và ao đã gọi qua đây.
- `node scripts/learn/voice-list.js` → `shared/audio/voice/danh-sach-cau.csv` (72 câu, kèm tên tệp). Thả mp3 đúng tên là xong, không sửa code; làm dần từng nhân vật được.
- Nghe thử: `learn/voice-test.html` (chọn giọng máy, chỉnh cao độ, phát thử tệp thu sẵn).

## Thanh liên kết duyệt (`learn/review-nav.js`)
Mọi trang duyệt chỉ cần `<nav class="rvnav"></nav>` + `<script src=".../learn/review-nav.js">`; danh sách liên kết nằm MỘT chỗ (`LINKS` trong tệp), trang đang mở được tô trắng. Thêm trang duyệt mới = thêm một dòng vào `LINKS` (các bộ sinh `gen-*.js` đã gắn sẵn script). Ba trang con Trong nhà / Kho / Ao là giao diện game nên không có thanh này.
