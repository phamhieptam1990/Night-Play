# Cấp độ khu vườn Học Vui: đạt gì thì xây gì, mở hạt giống gì

Viết cho chủ sản phẩm duyệt. Phần **A** là bản ĐANG CHẠY trong code. Phần **B** là đề xuất nâng cấp điều kiện (chờ bạn duyệt rồi mới làm). Nguồn dữ liệu: `learn/farm.js` (`Farm.BUILD`, `Farm.SEEDS`), `learn/garden/garden-unlock.js`.

## 1. Nhà có mấy cái? (trả lời câu "5 cái")

Bộ tranh có **4 cấp nhà** (lều lá → nhà tranh → nhà tường → nhà ngói có hiên) cộng **mảnh đất nền** trước khi cất nhà = **5 mốc**. Cấp 4 (nhà ngói) là "nhà cấp 4" bé hướng tới ở mục tiêu đầu tiên.

## 2. Bác Rễ (linh vật làm vườn): nhìn là biết cấp của bé

Dáng đổi theo cấp, mỗi cấp THÊM một thứ, không bỏ thứ cũ. Tranh: `shared/art/garden/mascot_gardener_<chung|nam|nu>_<nho|lon>_l<1-5>.svg` (sinh bởi `scripts/learn/gen-gardener-mascot.js`).

| Cấp Bác Rễ | Tên | Thêm gì | Khi nào (n = số nhiệm vụ xong) |
|---|---|---|---|
| 1 | Chồi non | chỉ có chồi lá, tay không | n = 0 |
| 2 | Có nón | nón rơm dải màu | n = 1 (có đất nền) |
| 3 | Biết tưới | bình tưới nước | n = 2 – 3 (lều lá, nhà tranh) |
| 4 | Thợ vườn | yếm xanh có túi, xẻng gỗ | n = 4 (nhà tường) |
| 5 | Bác làm vườn | huy hiệu sao, hoa trên nón, lấp lánh | n ≥ 5 (nhà cấp 4 trở đi) |

**Bé tự chọn bạn làm vườn lần đầu vào** (xem lại bằng cách bấm hình Bác Rễ trong bảng Chăm vườn):
- Nhân vật: **Bác Rễ** (có râu rễ, dải nón đỏ) · **Bạn trai** (dải nón xanh dương, tàn nhang) · **Bạn gái** (nơ hồng trên nón, mi dài).
- Độ tuổi: **5–7 tuổi** (tròn, mắt to) · **8–10 tuổi** (cao hơn, mắt nhỏ hơn). Gợi ý sẵn theo lớp (lớp 1–2 → 5–7 tuổi, lớp 3–5 → 8–10 tuổi).
- Đây chỉ là KIỂU HÌNH, lưu trên máy (`gardenBuddy`), không hỏi tên hay thông tin khác. Xoá tiến độ không xoá lựa chọn này; tệp sao lưu có mang theo.

## A. Bản ĐANG CHẠY: mỗi nhiệm vụ xong mở thêm một phần đất

Mỗi ngày có 3 nhiệm vụ: 💧 Toán, 🧪 Tiếng Việt, 🐟 Tiếng Anh. Xong = chơi một vòng 5 câu **môn đó**, **đúng từ 3 câu**. Mỗi nhiệm vụ tính **một lần mỗi ngày** (ngày theo UTC, đổi lúc 7 giờ sáng giờ Việt Nam). Bé không cần bấm từ vườn: chơi môn nào ở trang học thì nhiệm vụ môn đó tự tính.

| n | Khu vườn | Bác Rễ nói (giới thiệu nhiệm vụ) | Bé có gì |
|---|---|---|---|
| 0 | Bãi cỏ xanh trống | "Chào bé! Mình là Bác Rễ. Làm 1 nhiệm vụ, mình cho bé đất cất nhà nhé!" | |
| 1 | **Đất nền** cất nhà (cọc, dây, cờ đỏ) | "Có đất rồi! Làm nhiệm vụ tiếp, mình dựng lều lá cho bé!" | 📍 mảnh đất của riêng bé |
| 2 | **Nhà 1: lều lá** | "Lều lá xong! Thêm nhiệm vụ nữa là lên nhà tranh!" | ⛺ |
| 3 | **Nhà 2: nhà tranh** | "Nhà tranh đẹp quá! Mình xây nhà tường tiếp nhé!" | 🏡 |
| 4 | **Nhà 3: nhà tường** | "Sắp xong rồi! Thêm 1 nhiệm vụ là có nhà ngói cấp 4!" | 🧱 |
| 5 | **Nhà 4: nhà ngói (nhà cấp 4)** ✅ mục tiêu đầu tiên | "Nhà cấp 4 xong! Làm 1 nhiệm vụ để mở ruộng gieo hạt!" | 🏠 vào được "Trong nhà" |
| 6 | Thêm **ruộng 12 ô** | "Có ruộng rồi! Thêm 1 nhiệm vụ là mở cả khu vườn!" | 🌱 gieo hạt, hái nông sản; mở 3 hạt giống đầu |
| 7+ | **Cả khu vườn** (kho, ao, cối xay) | "Cả khu vườn của bé đây! Kiếm ⭐ để có bạn và cây mới nhé!" | Kho, Ao cá; cây ăn trái và vật nuôi mọc dần theo ⭐ |

Nhịp: tối đa 3 nhiệm vụ/ngày → **nhà cấp 4 xong sau khoảng 2 ngày**, ruộng ngày thứ 3, cả vườn ngày thứ 3–4.

### Hạt giống mở dần (10 loại)

| Hạt | Cây | Cần gì để mở |
|---|---|---|
| 🥕 Cà rốt (Toán) | ngắn ngày | có ruộng (n ≥ 6) |
| 🌾 Lúa mì (Tiếng Việt) | hoa màu | có ruộng (n ≥ 6) |
| 🍓 Dâu tây (Tiếng Anh) | ngắn ngày | có ruộng (n ≥ 6) |
| 🍅 Cà chua | ngắn ngày | 20 ⭐ |
| 🌽 Bắp | hoa màu | 10 nông sản trong kho |
| 🌻 Hướng dương | hoa màu | 40 ⭐ |
| 🍊 Cam | lâu năm | 60 ⭐ |
| 🍎 Táo | lâu năm | 80 ⭐ |
| 🍐 Lê | lâu năm | 100 ⭐ |
| 🥭 Xoài | lâu năm | 120 ⭐ |

Hạt chưa mở hiện mờ, có 🔒 và dòng "Cần …"; bấm vào có thông báo. Ba hạt đầu khớp đúng cây chính của ba môn (`Farm.CROP`), nên bé có lý do học đủ ba môn.

### Từ nhiệm vụ thứ 7: ⭐ mở cây và bạn

| Mốc | Mở |
|---|---|
| 12 ⭐ rồi cứ +3 ⭐ | một bạn vật nuôi mới (xen kẽ gà, thỏ, vịt, cừu, heo, bò), tối đa 57 |
| 15 ⭐ rồi cứ +5 ⭐ | một cây ăn trái mới mọc, tối đa 64 ô |

## B. ĐỀ XUẤT (chờ duyệt): điều kiện theo việc học thật, không chỉ đếm nhiệm vụ

Theo `plan-learn-garden.md` ("điều kiện lên cấp lấy từ việc học thật"), có thể thay mốc đếm nhiệm vụ bằng thành tích. Dữ liệu đã có sẵn: số nhiệm vụ, ⭐, nông sản, chuỗi ngày, **mức thành thạo 4 bậc** (`LearnEngine.mastery4`).

| Xây | Điều kiện đề xuất |
|---|---|
| Đất nền | xong 1 nhiệm vụ |
| Lều lá | xong 3 nhiệm vụ |
| Nhà tranh | xong nhiệm vụ **cả 3 môn** |
| Nhà tường | 1 kỹ năng đạt bậc 2 "Thực hiện" + học ít nhất 5 ngày khác nhau |
| Nhà ngói (cấp 4) | 1 kỹ năng đạt bậc 3 "Vận dụng" ở ít nhất 2 môn |
| Giếng | 20 câu đúng ngay lần đầu |
| Cối xay gió | thu hoạch 10 lúa mì |
| Ao cá | thử 8 kiểu câu hỏi khác nhau |

Cần thêm bộ đếm theo môn (nhiệm vụ mỗi môn) và đọc mức thành thạo vào cổng mở. Chưa làm; bạn chỉnh số rồi mình làm.

## C. Việc đã nối

- Trang học ↔ vườn: nút 🌱 (số đỏ = nhiệm vụ còn lại hôm nay); xong vòng hiện "Xong nhiệm vụ! … Tiếp theo: …" và nút về vườn. Vườn dùng chung kho `learn:farm` (hạt, sao, nông sản, nhiệm vụ).
- Trang của bé: thẻ Bác Rễ (đúng dáng, cấp), mục tiêu, thanh tiến độ, số hạt đã mở, nút vào vườn có số đỏ.
- Trang phụ huynh: nút xoá tiến độ đưa vườn về bãi cỏ trống (cấp 1, chưa mở hạt); tệp sao lưu mang cả vườn, nhiệm vụ, lựa chọn bạn làm vườn sang máy khác.
