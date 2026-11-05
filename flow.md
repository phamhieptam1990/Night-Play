# Night Play: Flow mua thời gian chơi / số lượng game

> Các con số giá dưới đây là **giả thuyết để test**, không phải dữ liệu thị trường đã kiểm chứng. Cần A/B test với user thật trước khi chốt.

## 1. Kết luận nhanh

| Câu hỏi | Trả lời |
|---|---|
| Bán **thời gian chơi** có hợp lý không? | **Không nên làm mô hình chính.** Người lớn thấy "trả tiền để được chơi tiếp" là bị chặn cửa, dễ bực và bỏ đi. Chỉ dùng như mua lẻ phụ (top-up). |
| Bán **số lượng game** có hợp lý không? | **Hợp lý hơn**, nhưng bán theo **gói / mở khoá vĩnh viễn** hoặc nằm trong gói đăng ký. |
| Mô hình nên chọn | **Freemium + Night Pass** (đăng ký tuần/tháng), kèm mua lẻ 1 game. |
| Mức giá để user quay lại | Điểm vào **9.000đ**, gói tháng **36.000đ**. Chi tiết ở mục 4. |

## 2. Vì sao không nên bán thời gian

1. **Giới hạn thời gian hiện là tính năng tự kiểm soát**, không phải rào thu phí. Ở popplay, phụ huynh đặt giới hạn cho con. Ở Night Play, người lớn tự đặt để khỏi chơi quá khuya. Bán thêm thời gian đi ngược mục đích đó và gây cảm giác bị "vắt tiền".
2. **Đây là cơ chế chờ-hoặc-trả tiền** (energy/timer), thường bị chê trong game casual. User bực đúng lúc đang vào cuộc, tỷ lệ xoá app/bỏ trang cao.
3. **Giá trị khó thấy.** "30 phút" không cụ thể bằng "mở được Cờ vua".
4. **Không tạo thói quen quay lại.** Mua xong dùng hết là hết, không có lý do mua tiếp.
5. **Kỹ thuật yếu.** Thời gian đang lưu bằng localStorage ([nightplay.html](nightplay.html)). User xoá dữ liệu trình duyệt hoặc đổi trình duyệt là reset, nên không thể bán thứ dễ bị lách như vậy mà không có tài khoản và server.

**Cách dùng thời gian hợp lý:** cho **free miễn phí N phút/ngày**, reset mỗi ngày. Đây là lý do quay lại hàng ngày. Gói trả phí **bỏ giới hạn**, nhưng vẫn cho user tự đặt hẹn giờ ngủ.

## 3. Mô hình đề xuất

### Gói

| | **Free** | **Night Pass** | **Mở khoá lẻ** |
|---|---|---|---|
| Game | 3 game (VD Dò mìn, Rắn, 2048) | Tất cả game, game mới ra thêm | 1 game vĩnh viễn |
| Thời gian | 30 phút/ngày | Không giới hạn | Không giới hạn riêng game đó |
| Quảng cáo / tracking | Không | Không | Không |
| Giá (giả thuyết) | 0đ | 18.000đ/tuần hoặc 36.000đ/tháng | 9.000đ |

Giữ lời hứa "không quảng cáo, không theo dõi" ở mọi gói. Đó là điểm khác biệt, đừng phá nó.

### Flow người dùng

```
Vào trang
  └─ Chọn game (3 game free sáng, các game khoá có biểu tượng ổ khoá nhỏ)
       ├─ Game free ──► Chơi ──► Còn 5 phút: banner nhẹ "Còn 5 phút hôm nay"
       │                          └─ Hết 30 phút ──► Màn "Đến giờ đi ngủ" + nút "Night Pass"
       │                                              (không chặn cứng ngay giữa ván: cho xong ván hiện tại)
       └─ Game khoá ──► Màn xem trước (ảnh/video 5 giây + "Chơi thử 1 ván")
                          ├─ Chơi thử xong ──► Mời mở khoá
                          │                    ├─ Mua lẻ 1 game  ──► Thanh toán ──► Chơi ngay
                          │                    └─ Night Pass       ──► Thanh toán ──► Chơi ngay
                          └─ Quay lại
```

Nguyên tắc: **cho thử trước khi mua**, **không chặn giữa ván**, **trả xong chơi ngay không quay về trang chủ**.

### Thanh toán

- Thị trường VN: **MoMo, ZaloPay, VNPay QR, chuyển khoản VietQR**. Thêm Apple/Google Pay hoặc Stripe nếu có khách quốc tế (đang có sẵn tiếng Anh).
- Web (không qua App Store/Google Play) tránh được phí 15–30%. Cổng thanh toán thường lấy khoảng vài % (kiểm tra biểu phí hiện hành).
- Cần **tài khoản nhẹ** (email hoặc số điện thoại + OTP) để lưu quyền mua và đồng bộ giữa thiết bị. Không có thì khôi phục mua hàng sẽ rất khó.
- Gói tuần/tháng nên **không tự gia hạn ngầm** ở giai đoạn đầu: hiện rõ ngày hết hạn, nhắc trước 1 ngày. Hợp quy định và giữ được lòng tin.

## 4. Mức giá để user quay lại

Nguyên tắc chọn giá: người lớn VN trả cho giải trí số khá nhạy giá. Mục tiêu giai đoạn đầu là **tạo thói quen trả tiền**, chưa phải tối đa doanh thu. Giá cần thấp hơn một ly cà phê.

| Giá (giả thuyết) | Vai trò | Ghi chú |
|---|---|---|
| **9.000đ** | Mua lẻ 1 game hoặc gói 1 ngày: "điểm vào" | Hạ rào tâm lý lần mua đầu. Cần chuyển đổi được lên gói cao hơn. |
| **18.000đ/tuần** | Night Pass tuần | Quy ra tháng ~72.000đ (4 tuần), đắt gấp đôi gói tháng. Đây là chủ ý: đẩy user sang gói tháng. |
| **36.000đ/tháng** | Night Pass tháng, **gói chính** | Thấp hơn ~1 ly cà phê. Mức nên test đầu tiên. |
| **199.000đ/năm** | Gói năm | ~16.600đ/tháng, rẻ hơn trả tháng khoảng 54%. Đưa ra sau khi có retention tốt. |

Lưu ý về cấu trúc giá:

- **Mua lẻ 9.000đ nên là bậc thang, không phải đích.** Nếu một user mua 4 game lẻ (36.000đ) thì đã bằng 1 tháng Night Pass. Hãy hiện gợi ý "Mở tất cả chỉ 36.000đ" ngay sau lần mua lẻ thứ 2.
- **Gói 1 ngày 9.000đ bằng 1/4 gói tháng**, dễ khiến user mua lẻ lặp lại thay vì đăng ký. Cân nhắc giới hạn số lần mua gói ngày mỗi tháng, hoặc trừ tiền đã mua vào gói tháng.
- **Gói năm giảm sâu (~54%)** tốt cho dòng tiền sớm nhưng chỉ có lợi nếu có game mới đều đặn, nếu không user năm dùng ít sẽ không gia hạn.

Điều quan trọng hơn con số giá: **user phải có lý do quay lại mỗi tuần**.

- Ra **game mới / chế độ mới đều đặn** (VD 1–2 game/tháng).
- **Thử thách hằng ngày** (1 ván cố định cho mọi người, có chuỗi ngày liên tiếp).
- **Bảng xếp hạng bạn bè** hoặc điểm cá nhân cao nhất.
- Free 30 phút/ngày reset mỗi ngày để duy trì thói quen mở app.

## 5. Chỉ số cần theo dõi và cách test

| Chỉ số | Mục tiêu tham khảo để so sánh (không phải chuẩn ngành) |
|---|---|
| D1 / D7 retention của user free | Càng cao càng tốt, theo dõi xu hướng khi đổi mức free |
| Tỷ lệ bấm vào game khoá → xem màn mua | Đo sức hút của game khoá |
| Tỷ lệ mua / người xem màn mua | Chỉ số chính của giá |
| Tỷ lệ gia hạn tuần 2, tháng 2 | Chỉ số quyết định có "quay lại" hay không |
| Doanh thu / user hoạt động (ARPU) | Để quyết định có đáng đầu tư game mới |

**Thứ tự test đề xuất:**

1. Test **mức free**: 20 / 30 / 45 phút/ngày. Chọn mức nào giữ retention cao mà vẫn thúc đẩy mua.
2. Test **giá gói tháng**: 36k (mặc định) so với 29k và 49k, cùng nội dung.
3. Test **điểm vào**: có gói 1 ngày 9k hay không, xem có kéo thêm người mua lần đầu không.
4. Test **tuần vs tháng** làm gói nổi bật mặc định.

Mỗi test cần đủ lượng user. Nếu chưa có traffic, bắt đầu bằng khảo sát nhanh 5–10 người dùng thân thuộc và đặt thử nút mua với giá giả (fake door) để đo ý định trước khi code thanh toán.

## 6. Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Game chưa đủ hay nên không ai trả tiền | Làm 3 game free thật tốt trước, đừng dùng paywall che game yếu |
| Chặn quá sớm làm user bỏ đi | Cho chơi xong ván hiện tại, thông báo trước 5 phút |
| Lách giới hạn bằng xoá localStorage | Gắn quyền mua và thời gian với tài khoản, kiểm tra ở server |
| Tranh chấp hoàn tiền / quên gia hạn | Hiện rõ ngày hết hạn, không gia hạn ngầm, có nút khôi phục mua |
| Nội dung "người lớn" bị hiểu sai | Nếu có game cờ bạc kiểu Poker, **không dùng tiền thật**, ghi rõ chỉ giải trí. Cần xem lại quy định về trò chơi có thưởng ở VN trước khi ra mắt |
| Thương hiệu Night Play trùng tên trên thị trường | Kiểm tra trước khi đầu tư nhận diện |

## 7. Việc cần làm tiếp (theo thứ tự)

1. Chốt 3 game free và các game khoá thật sự (nội dung quyết định tất cả).
2. Thêm tài khoản nhẹ + lưu quyền mua ở server.
3. Thêm màn "chơi thử 1 ván" và màn mua trong [nightplay.html](nightplay.html).
4. Tích hợp 1 cổng thanh toán (ưu tiên MoMo hoặc VietQR).
5. Đo các chỉ số ở mục 5 trong 4–6 tuần, rồi chỉnh giá.
