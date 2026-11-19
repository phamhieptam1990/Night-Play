# Học Vui — hướng "vừa học vừa chơi có AI trợ giảng": Vườn Học Vui + Chuyến Phiêu Lưu

Trạng thái: **đã chốt 4 quyết định (mục 8), chưa làm gì trong code.** Nối tiếp [plan-learn.md](plan-learn.md) (0.0–0.5 đã xong: bộ máy học thích ứng, 18 kiểu câu hỏi, linh vật Mochi/Mầm/Bibi).

## 0. Mục tiêu sản phẩm: bé thích học, thích khám phá, lộ điểm mạnh, ba mẹ thấy "wow"

Vườn và Phiêu lưu (các mục dưới) là **phương tiện**. Đích là bốn việc nối nhau:

| Trụ | Ý nghĩa | Làm bằng gì |
|---|---|---|
| **1. Gieo tò mò** | Bé muốn mở app vì thích, không vì bị nhắc | "Thử một điều mới hôm nay", chế độ khám phá **không có đúng/sai**, bé tự chọn hướng đi trong vườn |
| **2. Nhận ra điểm sáng** | Thấy bé hay bị hút vào đâu, giỏi lên nhanh ở đâu | Ghi **tín hiệu** ngay từ bản đầu (mục 7, giai đoạn B): bé tự chọn gì, kiên trì bao lâu sau khi sai, tiến bộ nhanh ở đâu, tạo ra thứ gì |
| **3. Nuôi dưỡng** | Cho bé đi sâu hơn chỗ bé thích, vượt chương trình | Bậc thử thách riêng cho từng lĩnh vực (Violympic, đố vui logic...), "Xưởng sáng tạo" (vẽ, kể chuyện, giai điệu, tự ra đề), linh vật làm người đồng hành |
| **4. Cho ba mẹ thấy** | Ba mẹ nhìn vào là hiểu bé đang tỏa sáng ở đâu | **Hồ sơ khám phá** (sản phẩm bé làm, đường tiến bộ, khoảnh khắc nổi bật) và bản tin "Điểm sáng của bé" mỗi tuần kèm gợi ý hoạt động cùng bé ngoài đời |

### Những điều phải nói thẳng để không tự lừa mình
- **App không thể "phát hiện thiên tài".** Vài chục phút tương tác trên màn hình chỉ cho **dấu hiệu quan tâm và điểm mạnh nổi bật theo thời gian**, không phải chẩn đoán năng khiếu. Mọi chữ trong bản tin phải nói đúng như vậy ("bé hay chọn...", "bé tiến bộ nhanh ở..."), có dẫn **bằng chứng** (bé đã làm gì, bao nhiêu lần).
- **Không dán nhãn cố định** ("bé giỏi Toán", "bé có năng khiếu âm nhạc"). Nghiên cứu về tư duy phát triển cho thấy khen "tài năng" làm trẻ ngại thử việc khó; khen **nỗ lực và chiến lược** thì bền hơn. Lời linh vật cũng theo hướng đó ("Mochi thấy bé thử ba cách mới!").
- **Thuyết "đa trí thông minh" không có bằng chứng khoa học mạnh**, nên không dùng làm khung xếp loại bé. Chỉ dùng các **lĩnh vực khám phá** thực tế (số và logic, chữ và kể chuyện, ngoại ngữ, nghệ thuật, âm nhạc, khoa học tự nhiên).
- **"Wow" của ba mẹ phải đến từ thật:** sản phẩm bé tự làm, bé tiến bộ rõ qua hai tuần, một khoảnh khắc bé giải bài khó. AI chỉ giúp **kể lại và sắp xếp** bằng chứng đó, không bịa lời khen.
- **Bé không bị so với bé khác.** Chỉ so bé với chính bé của tuần trước.

### Nền đã có để xây lên (đã xong, xem [plan-learn.md](plan-learn.md) mục "Đã làm thêm")
- [x] Bộ máy học thích ứng: 22 kỹ năng, mức thạo, mã lỗi tư duy (`learn/engine.js`) → nền cho "mỗi cây là một kỹ năng".
- [x] 18 kiểu câu hỏi tương tác (kéo thả, đếm, lật thẻ, trục số...) → nền cho Xưởng sáng tạo và Chuyến Phiêu Lưu.
- [x] Linh vật 3 môn có skin theo lớp, cảm xúc, bong bóng thoại và cổng lọc nội dung → nền cho người làm vườn dẫn đường.
- [x] Sao, cổ vũ, âm thanh, nhạc nền, thanh tiến độ có linh vật chạy.
- [x] 8 trang landing và tích hợp hub (lối vào đã sẵn).
- [ ] **Chưa có:** Vườn, cây, tài nguyên (nước/hạt/phân), huy hiệu, cửa hàng, ghi tín hiệu khám phá, Hồ sơ khám phá, sao lưu, gia sư AI, truyện.

## 1. Chọn hướng: Vườn làm lõi, Phiêu lưu làm lớp truyện mỏng

Bạn hỏi giữa hai hướng: **một chuyến phiêu lưu có cốt truyện** hay **chăm sóc mảnh vườn** (hạt giống, nước, phân bón, trang thiết bị). Đề xuất: **làm Vườn trước, Phiêu lưu là "chuyến đi theo mùa" gắn lên Vườn**, không làm hai hệ riêng.

| Tiêu chí | Chăm vườn (lõi) | Phiêu lưu (cốt truyện) |
|---|---|---|
| Khớp thương hiệu | Rất khớp: linh vật tên **Mầm**, khẩu hiệu có 🌱, "Học có niềm vui" | Khớp vừa, phải dựng thế giới mới |
| Chi phí nội dung | Thấp: một bộ mô hình cây/vật phẩm dùng mãi | Cao: phải viết và vẽ từng chương, hết chương là hết truyện |
| Lý do quay lại mỗi ngày | Tự nhiên: cây cần nước, hạt đang lớn | Yếu hơn: hết chương thì hết lý do |
| Nối với bộ máy học đang có | **Trực tiếp**: mỗi cây = một kỹ năng, lớn lên theo độ thạo | Gián tiếp: truyện chỉ là bọc ngoài |
| Rủi ro với trẻ nhỏ | Dễ lạm dụng "cây héo, sợ mất chuỗi" (xem mục 6) | Ít |
| Vai trò AI trợ giảng | Người làm vườn dẫn đường: "cây nào cần nước hôm nay" | Người dẫn truyện |

**Kết luận:** Vườn là vòng lặp hằng ngày, Phiêu lưu là phần thưởng định kỳ ("mỗi tuần một chuyến") dùng chính vật phẩm của Vườn. Một nền kinh tế, hai trải nghiệm.

## 2. Ý tưởng cốt lõi: mỗi cây là một kỹ năng

Bộ máy hiện có đã theo dõi 22 kỹ năng, mỗi kỹ năng có mức thạo (chưa học, mới nhập, đang học, khá, giỏi). Biến chúng thành **mảnh vườn**:

- **Mỗi kỹ năng = một cây** trong vườn của môn đó. Mức thạo = **giai đoạn lớn** của cây (hạt → mầm → cây con → cây to → ra hoa/quả).
- **Cây nhỏ là chỗ bé còn yếu**: bé nhìn vườn là biết nên chăm cây nào, không cần chữ. Đây là cách trực quan hóa "vừa chơi vừa học đúng chỗ yếu".
- **Ôn tập = tưới nước.** Kỹ năng lâu chưa ôn thì cây "buồn ngủ" (xem mục 6, không bao giờ héo hay chết), bé làm vài câu là cây tỉnh lại. Đó chính là ôn tập giãn cách, nhưng bé thấy là "chăm cây".
- **Sai kiểu nào** thì cây có "sâu" ứng với mã lỗi tư duy đó, bé làm đúng vài câu thì "bắt sâu". Phần này nối vào bảng mã lỗi (`TAGS`) đã có.

## 2b. Vườn phải "sống" và mỗi bé một khác (lý do để bé muốn quay lại)

Điều kéo bé quay lại mỗi ngày phải là **tò mò "hôm nay có gì mới?"**, không phải **sợ mất** (cây héo, mất chuỗi). Vì vậy vườn có bốn lớp sự sống:

| Lớp | Là gì | Ví dụ |
|---|---|---|
| **1. Nhịp sống** | Vườn đổi theo giờ thật và mùa thật | Sáng sương mù và chim hót, trưa nắng có bướm, chiều hoàng hôn, tối đom đóm và trăng; mưa, gió nhẹ, hoa nở theo buổi |
| **2. Sinh vật ghé thăm** | Con vật đến tùy bé đã trồng gì và học gì | Học Toán nhiều thì **ong đếm số** tới, đọc nhiều thì **cú** đậu cành, Tiếng Anh thì **vẹt Bibi** bắt chuyện; có "sổ sưu tầm" các loài đã gặp |
| **3. Mỗi cây mỗi khác** | Cây sinh ra có biến thể riêng, theo hạt giống của riêng bé | Màu hoa, hình lá, độ cao, họa tiết khác nhau (sinh theo số ngẫu nhiên gắn với bé nên **không ai có vườn giống ai**); hoa hiếm nở khi bé thử điều mới |
| **4. Bất ngờ có thật** | Mỗi lần vào thấy một điều nhỏ mới, không bao giờ mất nếu bé vắng mặt | "Sáng nay cây số 7 nở hoa", "Có tổ chim mới", thư linh vật gửi, món quà đặt sẵn chờ bé, **tích dồn lại chứ không biến mất** |

**Gắn sự sống vào việc học (để đẹp mà vẫn có nghĩa):**
- Sinh vật và hoa hiếm **chỉ đến bằng hành động học thật**: làm đúng câu từng sai, thử lĩnh vực mới, giữ kiên trì. Không đến vì bấm nút mua hay đợi đủ giờ.
- Vườn **phản chiếu bé**: nơi nào nhiều hoa là nơi bé giỏi và hay ghé; nơi còn trống là chỗ chưa khám phá, tự nhiên mời bé thử (đây cũng là một tín hiệu cho "Điểm sáng").
- **Linh vật có đời sống**: Mochi ngủ trưa, Mầm đọc sách dưới gốc cây, Bibi trò chuyện với vẹt; bắt chuyện theo trạng thái vườn.

**Phải tránh (đây là ranh giới giữa "sống động" và "gây nghiện"):**
- Không phần thưởng ngẫu nhiên kiểu hộp quà để nhử bé chơi mãi; sinh vật đến theo **quy tắc rõ ràng bé có thể đoán và làm được** (học gì thì gặp con gì).
- Không đếm ngược, không "sắp biến mất", không thông báo đẩy dọa dẫm.
- Ngày bé vắng, vườn **vẫn đẹp**, và khi quay lại thấy quà tích lại. Không phạt bé vì nghỉ.
- Có nhắc nghỉ mắt; cuối lượt vườn "chúc ngủ ngon", không mời chơi tiếp mãi.

## 2c. Thu hoạch kiểu Hay Day: cây trồng thật, mỗi cây một sự sống riêng

Chủ site yêu cầu: **không chỉ hoa, mà là khu vườn để THU HOẠCH như Hay Day**, mỗi cây có hiệu ứng riêng. Bản vẽ v1: [shared/art/garden/preview-crops.html](shared/art/garden/preview-crops.html) (sinh bằng `scripts/learn/gen-crops-art.js`).

**Vòng thu hoạch (vẫn "mỗi cây = một kỹ năng", nhưng chín theo số câu đúng):**
1. Bé gieo một **hạt giống** vào ô, chọn kỹ năng cần luyện.
2. Mỗi **câu đúng ngay lần đầu** của kỹ năng đó cho cây **1 điểm lớn**; đủ điểm (đề xuất 5) thì cây **CHÍN** (giai đoạn 4, có lấp lánh, ô sáng, hiện 👆).
3. Bé **chạm để thu hoạch**: cây phồng nhún, **nông sản bay về kho** (kho nảy, "+1"), cây **mọc lại** từ mầm. **Chín rồi không biến mất, không héo** (không ép bé).
4. Số nông sản mỗi lần phụ thuộc **mức thạo** kỹ năng (giỏi hơn thì thu được nhiều hoặc nông sản vàng), nên học giỏi lên có phần thưởng thấy được.
5. **Không đồng hồ đếm ngược, không tăng tốc bằng tiền**: cây lớn nhờ học.

**6 cây trồng, mỗi môn 2, mỗi cây một sự sống riêng:**

| Cây | Môn | Dáng | Hoạt ảnh riêng | Nông sản |
|---|---|---|---|---|
| Cà rốt | Toán | bụi lá xòe, củ nhô khỏi đất | lá đung đưa lệch nhịp, củ rung rinh khi chín | củ cà rốt |
| Bắp | Toán | thân cao, lá dài, trái bọc vỏ | lá và râu phe phẩy, trái nhún nhẹ | trái bắp |
| Lúa mì | Tiếng Việt | nhiều bông thẳng đứng | cả bụi gợn sóng như có gió, bông vàng cúi khi chín | bó lúa |
| Hướng dương | Tiếng Việt | thân cao, bông to | bông chậm rãi xoay theo nắng | bông hướng dương |
| Dâu tây | Tiếng Anh | bụi thấp, hoa trắng | quả đỏ nhún nhảy, lấp lánh | quả dâu |
| Cà chua | Tiếng Anh | cây leo có cuống | quả đung đưa nhẹ | quả cà chua |

Sinh vật ghé thăm (ong, bướm, đom đóm, mục 2b) đến theo **môn bé vừa học**; mỗi cây chín thu hút một loài hợp (ví dụ ong quanh hoa hướng dương và bắp).

**Nông sản dùng để làm gì (làm theo bậc):**
- **Bậc 1:** chỉ **sưu tầm** trong kho, hiện số lượng, nhận huy hiệu theo mốc (ví dụ thu hoạch 10 cà rốt).
- **Bậc 2:** **đơn hàng của linh vật** ("Mochi cần 3 cà rốt để nấu canh"), nấu món đơn giản từ nông sản, vật nuôi ăn nông sản. Đơn hàng thưởng sao và hạt giống.
- **Bậc 3:** đổi nông sản lấy vật phẩm trang trí, mở rộng đất, nguyên liệu cho chuyến phiêu lưu.
- **Không làm:** bán/mua với người chơi khác, đồng hồ chờ, tăng tốc bằng tiền thật.

**Việc cần làm cho phần này (xem mục 7, giai đoạn B):**
- [x] Bản vẽ v1: 6 cây × 5 giai đoạn, 3 tông lá, nông sản, kho, thu hoạch thử có hiệu ứng (chờ chủ site duyệt).
- [ ] Đổi dữ liệu Vườn: mỗi ô có **điểm lớn** theo kỹ năng, **kho nông sản**, hành động **thu hoạch** (trong `learn/garden.js`), kèm kiểm thử.
- [ ] Màn Vườn: chạm cây chín để thu hoạch, kho hiện số lượng, ô sáng khi chín.
- [ ] Đủ hoạt ảnh thu hoạch (phồng nhún, nông sản bay, kho nảy) và âm thanh nhẹ khi thu hoạch (dùng cơ chế âm thanh sẵn có).
- [ ] Bản v2 tranh: thêm cây thứ 3 mỗi môn, cây vàng (hiếm) khi kỹ năng đạt mức giỏi.

## 2d. Khu vườn DỰNG SẴN: khung cố định, bé đạt gì thì dựng cái đó (chủ site chốt)

Chủ site chốt hướng: **làm trọn một khung cảnh vườn có sẵn các VỊ TRÍ; bé đạt thành tích nào thì vật tương ứng được dựng lên đúng chỗ của nó.** Thao tác của bé **chỉ giống thu hoạch** (chạm cây chín, chạm vật vừa dựng để xem). **Không** kéo thả trang trí, không đặt vật phẩm tự do.

**Vì sao cách này hợp:**
- **Cảnh dựng tay một lần, có thể rất đẹp** (bố cục như ảnh Hay Day: ruộng, tường đá, cây, nhà), vì vị trí cố định nên mình trau chuốt từng chỗ thay vì lo mọi tổ hợp.
- **Số tranh cố định và đếm được** (khoảng 20–25 vị trí), không phình theo kho vật phẩm.
- **Nhẹ và dễ kiểm thử:** mỗi vị trí chỉ có 2 trạng thái (chưa mở / đã dựng), điều kiện mở là dữ liệu, kiểm thử được bằng máy.
- **Vòng học → thấy thành quả rõ ràng**: học xong một mục tiêu là cảnh vườn đổi thật.

**Mỗi vị trí gồm:**
1. **Trạng thái chưa mở:** bóng mờ hoặc khung dựng dở, kèm **mục tiêu tích cực** ("Làm đúng 5 câu liền để dựng cây táo") và thanh tiến độ. Chạm vào để xem mục tiêu.
2. **Điều kiện mở**, lấy từ việc học thật (số lượt, chuỗi đúng, mức thạo kỹ năng, số nông sản đã thu, số kiểu câu hỏi đã thử, đủ ba môn).
3. **Khoảnh khắc dựng:** hiệu ứng "tạch" bụi sao, vật nảy lên, linh vật reo, tiếng chuông. Đây là điểm "wow" của bé và ba mẹ.
4. **Trạng thái đã dựng** (có hoạt ảnh nhẹ nếu cần), có thể chạm để nghe linh vật nói một câu.

**Bảng vị trí đề xuất cho cảnh v1** (điều kiện là gợi ý, chủ site chỉnh):

| Nhóm | Vị trí | Điều kiện mở |
|---|---|---|
| Ô trồng | Ô 1 | có sẵn |
| | Ô 2, Ô 3 | xong 1 lượt; xong 3 lượt |
| | Ô 4, Ô 5 | một kỹ năng đạt "khá"; học 2 môn |
| | Ô 6 | học đủ 3 môn |
| Công trình | Kho | có sẵn |
| | Giếng | tổng 20 câu đúng ngay lần đầu |
| | Cối xay gió | thu hoạch 10 lúa mì |
| | Ngôi nhà | học đủ 3 môn |
| Trang trí | Hàng rào | xong 1 lượt |
| | Lối đá lát | xong 3 lượt |
| | Cây táo | chuỗi 5 câu đúng |
| | Bụi hoa oải hương | một lượt 5/5 |
| | Ao nhỏ | thử 8 kiểu câu hỏi khác nhau |
| | Đống rơm, thùng gỗ | thu hoạch 5 nông sản bất kỳ |
| Sinh vật | Ong, bướm, đom đóm | đã có (theo môn học trong ngày) |
| | Gà, thỏ (v2) | một kỹ năng đạt "giỏi" |

**Nhẹ nhàng, không gây áp lực:** mọi vị trí chỉ mở thêm, **không bao giờ mất đi**; không có đồng hồ đếm ngược; mục tiêu luôn đo bằng việc học tốt chứ không bằng thời gian chơi lâu.

**Biến thể cá nhân hóa nhẹ (không cần kéo thả):** mỗi bé một hạt giống ngẫu nhiên chọn kiểu cây to, màu cánh hoa, mẫu hàng rào, nên hai khu vườn cùng đã mở đủ vẫn hơi khác nhau.

**Việc cần làm cho phần này (giai đoạn B, thay cho "kéo thả trang trí" ở giai đoạn C):**
- [ ] Soạn **danh sách vị trí + điều kiện mở** thành dữ liệu `learn/scene.js` (kèm kiểm thử: không mở sớm, không mất khi đã mở, tiến độ đúng).
- [ ] Vẽ **bộ khung cảnh v1** (cỏ nền, vị trí đã định) và **tranh từng vật** ở cả hai trạng thái (bóng chưa mở + bản đã dựng).
- [ ] Màn **Vườn** hiển thị cảnh, chạm vị trí chưa mở thấy mục tiêu + tiến độ; chạm cây chín thu hoạch.
- [ ] **Hiệu ứng và âm thanh dựng** vật mới, nối vào phát thưởng cuối lượt (khi vừa đạt điều kiện thì cảnh vườn báo "có vật mới!").
- [ ] Mỗi vật mới gắn với một **huy hiệu** trong danh sách huy hiệu hiện có.

## 3. Nền kinh tế phần thưởng (đơn giản, hào phóng, không có tiền thật)

| Tài nguyên | Kiếm từ đâu | Dùng để làm gì |
|---|---|---|
| 💧 **Nước** | Mỗi câu đúng | Tưới cây: cây lớn lên |
| 🌱 **Hạt giống** | Xong một lượt 5 câu; mở khóa kỹ năng mới | Gieo cây mới (mỗi môn một loại cây) |
| 🧪 **Phân bón** | Chuỗi đúng liên tiếp, câu khó, làm đúng câu từng sai | Làm cây lớn nhanh, **không** làm cây tốt hơn |
| ⭐ **Sao** (đã có) | Đúng câu không sai lần nào | Đổi vật phẩm trang trí, huy hiệu |
| 🏅 **Huy hiệu** | Mốc học tập (xem dưới) | Chỉ để sưu tầm, trưng bày |
| 🧰 **Dụng cụ / trang thiết bị** | Đổi bằng sao | Trang trí và tiện ích nhỏ (bình tưới đẹp hơn, hàng rào, nhà kính) |

Nguyên tắc: **vật phẩm chỉ để trang trí và tiện lợi, không bán lợi thế học**. Phân bón và dụng cụ không được làm bé "qua bài nhanh hơn".

**Huy hiệu theo mốc học thật** (không theo thời gian chơi): đạt "giỏi" ở 1 kỹ năng, chuỗi 5 đúng, thử đủ 10 kiểu câu hỏi, làm đúng câu từng sai ba lần, ôn lại kỹ năng cũ, hoàn thành chủ đề của lớp.

## 4. Chuyến Phiêu Lưu (lớp truyện mỏng, làm sau Vườn)

- **Mỗi tuần một "chuyến đi"** (ví dụ "Đảo Trăng Tròn"): bé gom đủ vật phẩm (la bàn, bản đồ, đèn pin) từ việc học trong tuần rồi cả nhà linh vật lên đường.
- **Truyện ngắn 5–7 cảnh**, mỗi cảnh một thử thách ghép với một kiểu câu hỏi tương tác (ghép cặp, kéo thả, trục số...). Cảnh cuối thưởng một vật phẩm hiếm cho vườn.
- **Mochi, Mầm, Bibi mỗi bạn một vai** (Mochi: tìm lối bằng số; Mầm: đọc dấu hiệu; Bibi: nói chuyện với người bản địa).
- Chỉ làm **2–3 chuyến mẫu** trước, xem bé có thích không rồi mới viết thêm. Không viết cả mùa trước khi có số liệu.

## 5. AI trợ giảng nằm ở đâu

Phần AI **chưa có** trong code hiện nay (xem mục 7). Khi có, vai trò là:

1. **Người làm vườn dẫn đường** (linh vật): mở màn "hôm nay cây nào cần nước", gợi ý bài đúng chỗ yếu.
2. **Gợi ý theo bước** khi bé sai: nút "Gợi ý / Giải thích / Cho ví dụ" (không đưa đáp án).
3. **Nhận xét sau lượt học**: một câu khích lệ đúng việc bé vừa làm.
4. **Thư cho phụ huynh** mỗi tối: cây nào lớn, kỹ năng nào cần ôn, mã lỗi hay gặp.

Mọi câu AI sinh ra đi qua **cổng lọc nội dung đã làm** (`LearnMascot.clean`, tối đa 40 ký tự, chặn liên kết/thông tin cá nhân). Hợp đồng ở [docs/LEARN-MASCOT-AI-CONTRACT.md](docs/LEARN-MASCOT-AI-CONTRACT.md).

## 6. Những điều KHÔNG làm (bảo vệ trẻ nhỏ)

- **Không cây héo, không chết, không mất chuỗi gây tiếc.** Cây chỉ "buồn ngủ" và tỉnh lại ngay khi được tưới. Không đếm "bạn đã bỏ lỡ N ngày".
- **Trong app, bé không bao giờ phải trả tiền hay thấy nút mua:** vật phẩm chỉ đổi bằng sao kiếm được. Gói Học AI (mục 11) do **phụ huynh** mua ở cổng phụ huynh. Không quảng cáo, không hộp quà ngẫu nhiên (gacha), không đếm ngược gây áp lực.
- **Không so sánh bé với bé khác**, không bảng xếp hạng công khai.
- **Không dán nhãn năng khiếu cố định** và không hứa "phát hiện thiên tài" trong giao diện hay quảng cáo; chỉ nói "điểm sáng", "điều bé đang thích".
- **Không giới hạn "năng lượng"** chặn bé học thêm; có nhắc nghỉ mắt sau một khoảng.
- **Dữ liệu trẻ em:** mặc định lưu trên máy (`localStorage`), không gửi ra ngoài. Chỉ gửi khi phụ huynh bật rõ ràng (xem mục 8).

## 7. Việc phải làm, theo giai đoạn
(Các việc đánh dấu ★ phục vụ mục tiêu mục 0.)

### Giai đoạn A — Chốt thiết kế (1–2 ngày, cần bạn quyết)
- [ ] Chốt hướng Vườn lõi + Phiêu lưu mỏng (mục 1), hoặc đổi.
- [ ] Chốt danh sách tài nguyên và tên gọi (mục 3).
- [ ] Viết **bộ khung truyện** cho AI (mục 12) và chốt phạm vi Gói Học AI (mục 11).
- [ ] Chọn **một loại cây cho mỗi môn** (gợi ý: Toán: cây "số"; Tiếng Việt: cây "chữ"; Tiếng Anh: cây "từ").
- [ ] Viết thiết kế nghệ thuật theo [docs/MASCOT-ART-RULES.md](docs/MASCOT-ART-RULES.md) (phong cách Pop), vẽ thử 1 cây 5 giai đoạn để duyệt.

### Giai đoạn B — Vườn bản đầu (MVP), chạy hoàn toàn trên máy
- [ ] Dữ liệu `learn:garden` trong `localStorage`: tài nguyên, ô đất, cây (gắn id kỹ năng của `engine.js`), vật phẩm, huy hiệu.
- [ ] Phát thưởng cuối mỗi lượt: nước (theo số câu đúng), hạt (xong lượt), sao (đã có), phân bón (theo chuỗi).
- [ ] Màn **Vườn** (một màn không cuộn, theo [GAME_RULES.md](GAME_RULES.md)): hiện cây theo môn, chạm cây để tưới, cây đổi giai đoạn có hiệu ứng.
- [ ] Nối màn kết quả của lượt học sang Vườn ("Cây của bé vừa lớn lên!").
- [ ] Mô hình cây: SVG Pop, 3 loại × 5 giai đoạn; kiểm tra bằng `check-art.js`.
- [ ] Huy hiệu đợt 1 (6–8 huy hiệu theo mốc học).
- [ ] Kiểm thử: mô phỏng thạo kỹ năng → cây lên đúng giai đoạn; không có trạng thái "héo".
- [ ] ★ **Ghi tín hiệu khám phá ngay từ bản đầu** (dữ liệu chỉ trên máy): lĩnh vực/kiểu câu hỏi bé tự chọn, thời gian ở lại, số lần thử lại sau khi sai (kiên trì), độ thạo tăng sau mỗi lượt (tiến bộ), tần suất tự mở app. Không có dữ liệu thì sau này không thể "nhận ra điểm sáng", nên phải ghi từ sớm.
- [ ] ★ **Vườn có sự sống bản đầu** (mục 2b): chu kỳ ngày/đêm theo giờ máy, ít nhất 4 sinh vật ghé thăm gắn với hành động học, hoa nở bất ngờ khi cây lên giai đoạn, "sổ sưu tầm" các loài đã gặp.
- [ ] ★ **Biến thể mỗi bé một khác:** sinh cây từ hạt giống ngẫu nhiên lưu cùng hồ sơ (màu, hình lá, họa tiết), thử nghiệm để các cây của một bé nhìn khác nhau rõ.
- [ ] ★ Màn **"Thử điều mới"**: mỗi ngày một lĩnh vực hoặc kiểu câu hỏi bé chưa thử, chơi không chấm điểm.

### Giai đoạn B2 ★ — Điểm sáng và Hồ sơ khám phá (làm ngay sau B)
- [ ] Thẻ **"Điểm sáng"** cho bé: hình ảnh vui, một câu khen **nỗ lực/chiến lược**, dựa trên tín hiệu thật (ví dụ "Bé làm lại ba lần rồi đúng!").
- [ ] **Hồ sơ khám phá** cho ba mẹ (sau cổng phụ huynh): các lĩnh vực bé hay chọn, đường tiến bộ 2–4 tuần, 3 khoảnh khắc nổi bật, sản phẩm bé làm.
- [ ] Bản tin tuần **"Điểm sáng của bé"**: viết có dẫn bằng chứng, ghi rõ độ chắc chắn, kèm **2 hoạt động làm cùng bé ngoài đời** (không màn hình) để nuôi điều bé thích.
- [ ] Kiểm thử: dữ liệu ít thì bản tin nói "chưa đủ dữ liệu", không đoán.

### Giai đoạn B3 — Sao lưu (xem mục 11): xuất/nhập tệp trước, máy chủ + email sau khi chốt pháp lý

### Giai đoạn C — Cửa hàng và trang trí
- [x] (Đổi hướng, chủ site chốt) **Không làm** cửa hàng trang trí và kéo thả vật phẩm. Thay bằng **khung dựng sẵn mở theo thành tích** (mục 2d).
- [ ] Linh vật Mochi/Mầm/Bibi "sống" trong vườn, nói câu khích lệ.

### Giai đoạn C2 ★ — Xưởng sáng tạo và bậc thử thách (nuôi điểm mạnh)
- [ ] **Xưởng sáng tạo** (bắt đầu 3 dụng cụ nhỏ, cùng một màn không cuộn): *vẽ cây của em* (tô và dán hình), *kể chuyện cùng Mầm* (chọn từ ghép thành câu, rồi thành truyện ngắn), *xếp giai điệu* (chạm các nốt theo thang ngũ cung đã dùng cho nhạc nền).
- [ ] **Bậc thử thách theo lĩnh vực**: sau khi giỏi ở một kỹ năng, mở bậc khó hơn vượt chương trình (đố logic, Violympic cho Toán, ghép câu dài cho Tiếng Việt...).
- [ ] **Bé tự ra đề** cho linh vật ("Mochi đoán nhé!"): sản phẩm tự tạo rất giá trị trong hồ sơ.
- [ ] Mọi sản phẩm của bé **lưu trên máy**; chỉ chia sẻ cho ba mẹ khi bật rõ.

### Giai đoạn D — AI trợ giảng thật
- [ ] **Quyết định máy chủ:** một dịch vụ trung gian (ví dụ Cloudflare Worker) gọi mô hình AI, trả lời qua cổng lọc.
- [ ] Nút Gợi ý / Giải thích / Ví dụ; chế độ không cần AI (luật dựng sẵn) làm dự phòng khi mất mạng.
- [ ] Thư tối cho phụ huynh.
- [ ] ★ AI **soạn lại** bản tin Điểm sáng từ bằng chứng có sẵn (không bịa), và gợi ý hoạt động ngoài đời.
- [ ] Hộp xin phép phụ huynh trước khi gửi bất kỳ dữ liệu nào ra ngoài.

### Giai đoạn E — Chuyến Phiêu Lưu
- [ ] Khung chuyến đi (5–7 cảnh) và 2 chuyến mẫu.
- [ ] Mỗi cảnh dùng một kiểu câu hỏi tương tác có sẵn.
- [ ] Phần thưởng chuyến đi vào Vườn.

## 8. Quyết định

### Đã chốt
1. **Hướng:** Vườn làm lõi, Phiêu lưu làm lớp truyện mỏng gắn lên Vườn.
2. **Lưu tiến độ:** mặc định **trên máy**. Có **chỗ để phụ huynh sao lưu qua email**, thuộc **Gói Học AI** (sản phẩm riêng, **khác gói Night Pass** chơi game). Chi tiết ở mục 11.
3. **Truyện Phiêu lưu do AI viết**, theo quy trình có kiểm duyệt ở mục 12.
4. **Học Vui tách riêng khỏi Night Pass:** hai gói, hai quyền sử dụng, không dùng chung tài khoản hay điểm thưởng.

### Còn mở (có đề xuất mặc định, bạn sửa nếu khác)
5. **Lĩnh vực khám phá thêm trước:** mặc định **logic và âm nhạc**.
6. **Hồ sơ khám phá cho ba mẹ:** mặc định xem trên máy của bé sau cổng phụ huynh, và gửi bản tóm tắt qua **email đã đăng ký cho sao lưu** (không qua Zalo ở bản đầu).
7. **Giá và phạm vi Gói Học AI:** chưa bàn. Đề xuất phạm vi ở mục 11, giá để bạn quyết sau.

## 9. Đo xem có hiệu quả không

- Tỉ lệ bé quay lại sau 1 và 7 ngày; số lượt học mỗi lần vào.
- Mức thạo kỹ năng tăng sau 2 tuần (so với trước khi có Vườn).
- Tỉ lệ bé chủ động ôn kỹ năng "buồn ngủ".
- Phản hồi phụ huynh: bé có thấy áp lực không.
- ★ **Quay lại vì thích:** tỉ lệ bé mở vườn mà không bị nhắc, tỉ lệ vào vườn rồi chuyển sang học, số loài sưu tầm; **kèm** chỉ số lành mạnh: không có chuỗi ngày bắt buộc, thời lượng mỗi ngày không tăng quá mức.
- ★ **Tò mò:** tỉ lệ bé tự mở "Thử điều mới", số lĩnh vực bé thử mỗi tuần, tỉ lệ bé làm lại sau khi sai thay vì bỏ.
- ★ **Ba mẹ "wow":** ba mẹ có mở Hồ sơ khám phá, có làm hoạt động gợi ý, và có nói "mình không biết bé thích điều này" trước đó (hỏi bằng khảo sát ngắn, không đo bằng số lần xem).

## 10. Rủi ro

- **Tốn công vẽ:** mỗi loại cây và vật phẩm là một bộ hình. Giảm bằng cách bắt đầu 3 cây × 5 giai đoạn và dùng lại.
- **Phần thưởng lấn át việc học:** bé chỉ muốn làm câu dễ cho nhanh có nước. Giảm bằng cách thưởng theo độ khó, thưởng thêm khi làm đúng câu từng sai.
- **Sống động mà thành gây nghiện:** vòng lặp "quay lại mỗi ngày" rất dễ trượt sang thao túng (phần thưởng ngẫu nhiên, sợ mất). Giữ ranh giới ở mục 2b, và đo bằng khảo sát phụ huynh (bé có vui hay lo?), không chỉ đo số lần mở app.
- **Phụ thuộc AI:** nếu chưa có AI thì Vườn vẫn chạy bằng luật dựng sẵn, nên AI là phần thêm, không phải điều kiện sống còn.
- **Nói quá về năng khiếu:** là rủi ro niềm tin lớn nhất. Giảm bằng cách luôn dẫn bằng chứng, ghi độ chắc chắn, và có người (bạn hoặc chuyên gia giáo dục) duyệt mẫu bản tin trước khi chạy.
- **Dữ liệu trẻ em:** nếu lưu tài khoản thì phải có chính sách riêng và xin phép phụ huynh; tránh trong bản đầu.

## 11. Gói Học AI, sao lưu qua email, và ranh giới với Night Pass

**Chia gói:**

| | Miễn phí | Gói Học AI | Night Pass (đã có) |
|---|---|---|---|
| Vườn, 18 kiểu câu hỏi, huy hiệu, nhạc, lưu trên máy | ✓ | ✓ | không liên quan |
| Gia sư AI (gợi ý, giải thích, ví dụ) | một ít lượt thử | ✓ | không liên quan |
| Bản tin tuần "Điểm sáng", Hồ sơ khám phá đầy đủ | bản rút gọn | ✓ | không liên quan |
| **Sao lưu và khôi phục qua email** | | ✓ | không liên quan |
| Truyện Phiêu lưu hằng tuần | 1–2 chuyến mẫu | ✓ | không liên quan |
| Game giải trí | | | ✓ |

Nguyên tắc: **việc học căn bản luôn miễn phí và dùng được khi không có mạng**; Gói Học AI chỉ thêm AI, báo cáo sâu và sao lưu. Không khóa việc học để ép mua.

**Sao lưu qua email, cách làm an toàn nhất:**
1. Phụ huynh bấm "Sao lưu" ở cổng phụ huynh, nhập email, **tích đồng ý rõ ràng** (nói bằng lời dễ hiểu dữ liệu nào được lưu và để làm gì).
2. Chỉ gửi **tiến độ ẩn danh**: id kỹ năng, mức thạo, vườn, vật phẩm, huy hiệu, sản phẩm sáng tạo. **Không gửi tên thật, ngày sinh, ảnh, giọng nói.** Bé dùng biệt danh do phụ huynh đặt.
3. Máy chủ giữ bản sao **mã hóa**, gắn với email. Khôi phục bằng **liên kết một lần gửi qua email** (không mật khẩu).
4. Có nút **"Xóa toàn bộ dữ liệu của bé"** xóa cả bản sao lưu, làm được ngay trong app, và trả xác nhận qua email.
5. Máy chủ dùng dịch vụ trung gian đã nêu ở giai đoạn D (ví dụ Cloudflare Worker + lưu trữ có mã hóa) và một dịch vụ gửi email giao dịch.

**Việc pháp lý bạn cần tự xác nhận, mình không thay được:** dữ liệu của trẻ em ở Việt Nam chịu quy định bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP), trong đó dữ liệu trẻ em cần **sự đồng ý của cha mẹ/người giám hộ** và có thể cần đánh giá tác động. Hãy cho luật sư hoặc người phụ trách pháp lý xem **trước khi** bật tính năng sao lưu. Chính sách quyền riêng tư của Học Vui cần viết riêng (hiện trang `privacy.html` chung của Play Hub).

**Kỹ thuật cần làm (giai đoạn B3, sau B):**
- [ ] Định dạng gói sao lưu có phiên bản (`learn:garden` + `learn:m:*` + hồ sơ), có kiểm tra toàn vẹn và nâng cấp phiên bản cũ.
- [ ] **Xuất/nhập tệp** trước (làm được mà không cần máy chủ): phụ huynh tải một tệp về, sau này tự gửi mình. Đây là bản dự phòng và cũng là cách kiểm thử định dạng.
- [ ] Máy chủ sao lưu + email liên kết khôi phục (sau khi chốt pháp lý).
- [ ] Kiểm thử khôi phục: sao lưu rồi xóa dữ liệu máy rồi khôi phục, vườn và tiến độ giống hệt.
- [ ] Cổng phụ huynh (phép tính hoặc mã) để trẻ không tự bật sao lưu hay thanh toán.

## 12. Truyện Phiêu lưu do AI viết: quy trình có kiểm duyệt

Không cho AI viết trực tiếp cho bé lúc đang chơi. **AI soạn trước, kiểm tra tự động, người duyệt, rồi xuất bản thành nội dung tĩnh.** Cách này rẻ, an toàn, chạy cả khi không có mạng.

1. **Bộ khung truyện** (viết một lần, bạn duyệt): thế giới (đảo, rừng...), tính cách Mochi/Mầm/Bibi, giọng văn, quy tắc an toàn (không bạo lực, không dọa, không nói thật tên bé, không dụ ra ngoài app), mức từ vựng theo lớp 1–5.
2. **AI soạn từng chuyến** (5–7 cảnh), mỗi cảnh gắn một **kiểu câu hỏi tương tác** có sẵn và kỹ năng cần ôn. Đầu ra là dữ liệu có cấu trúc (lời kể, lời thoại, câu hỏi, đáp án) chứ không phải văn bản tự do.
3. **Kiểm tra tự động:** độ dài từng cảnh, bộ lọc nội dung `LearnMascot.clean`, đáp án đúng khớp bộ máy học (`check-types.js`), từ vựng không vượt lớp.
4. **Người duyệt** từng chuyến trước khi xuất bản (bạn hoặc người am hiểu tiếng Việt cho trẻ em). AI viết tiếng Việt văn học có thể gượng, nên bước này **không bỏ**.
5. **Cá nhân hóa nhẹ lúc chạy:** chỉ điền biệt danh bé và tên cây của bé vào chỗ trống đã duyệt, không sinh thêm câu mới.
6. Sau này (nếu muốn) mới thử AI kể trực tiếp, vẫn qua cổng lọc, trong Gói Học AI và có giám sát.

- [ ] Viết bộ khung truyện (giai đoạn A).
- [ ] Công cụ soạn: tập lệnh gọi mô hình AI theo bộ khung, sinh dữ liệu chuyến đi dạng JSON.
- [ ] Công cụ kiểm tra tự động (mục 3).
- [ ] Màn duyệt nội bộ (giống `learn/mascot-review.html`): đọc chuyến, đánh dấu đạt/chưa đạt.
- [ ] 2 chuyến mẫu qua đủ quy trình rồi mới soạn thêm.
