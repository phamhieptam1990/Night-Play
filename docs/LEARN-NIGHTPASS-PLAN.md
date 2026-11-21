# Kế hoạch Night Pass cho Học Vui (tách riêng với Night Pass của game)

Viết cho chủ sản phẩm duyệt. CHƯA làm gì trong code; duyệt xong mới làm theo từng giai đoạn. Tên gọi tạm: **Học Vui Plus** (xem câu hỏi 1).

## 1. Hiện trạng (đối chiếu code)

- Học Vui đang **miễn phí 100%**: Toán lớp 1–5 (36 kỹ năng) + 30 kỹ năng Tiếng Việt/Tiếng Anh, gợi ý 💡, vườn, phiêu lưu, nhiệm vụ ngày, trang phụ huynh (đặt giới hạn giờ), giọng đọc.
- Mọi dữ liệu của bé nằm **trên máy** (localStorage + tệp sao lưu `backup.js`). Chưa có tài khoản, chưa có đồng bộ.
- Hạ tầng Night Pass của game đã có sẵn và dùng lại được: đơn hàng + VietQR/SePay, token ký bằng `TOKEN_SECRET`, khoá thiết bị (tối đa 3 máy), khôi phục bằng email OTP, giao mã trả phí qua `/api/pro/<id>.js` (mã không nằm trong file công khai). Bảng giá ở `server/app.js` (`PLANS`: ngày 9k, tuần 18k, tháng 36k, năm 199k).

## 2. Nguyên tắc chia Free / Plus

1. **Free phải là một app học thật sự tốt**, không phải bản cắt cụt. Bé học đủ kiến thức lớp 1–5 ở cả 3 môn, không hết giờ, không bị chặn giữa vòng. Lý do: phụ huynh chỉ trả tiền cho thứ họ đã thấy hiệu quả; và không chặn việc học là điều đúng với trẻ em.
2. **Plus bán cho PHỤ HUYNH, không bán cho bé.** Người mua và người thấy giá trị là phụ huynh; mọi màn mua nằm sau cổng phụ huynh 🔒, bé không bao giờ thấy giá, nút mua hay khoá gây thất vọng trong lúc chơi.
3. **Free = "luyện". Plus = "hiểu, tiến bộ và chuẩn bị thi".** Plus thêm giá trị ở chỗ phụ huynh lo nhất (điểm yếu, lớp 6, nhiều bé/nhiều máy), không rút bớt thứ bé đang có.
4. **Không dùng ép buộc**: không đếm ngược, không "nhanh kẻo mất", không mất chuỗi ngày, không so sánh với bé khác (khớp `docs/LEARN-STORY-PLAN.md` mục 2).
5. **Tách hẳn khỏi Night Pass của game**: gói riêng, token riêng. Có Night Pass game không tự có Plus và ngược lại (muốn tặng gói đôi thì là chương trình giảm giá, xem câu hỏi 2).
6. Theo `GAME_RULES.md` mục 5: bản Plus phải **thấy khác hẳn** bản free (không chỉ đổi màu).

## 3. Free và Plus khác nhau ở đâu

| Nhóm | Free (như hiện tại) | Học Vui Plus |
|---|---|---|
| **AI luyện cùng bé** | Linh vật phản ứng bằng câu có sẵn, gợi ý 💡 viết sẵn | **Linh vật AI luyện cùng** (mục 3A): dẫn từng bước, giải thích đúng chỗ bé sai, chọn câu tiếp theo vừa sức, bé dạy lại Bạn Mây |
| **Nội dung học** | Toàn bộ kỹ năng Toán/Việt/Anh lớp 1–5, mức thành thạo 4 bậc, gợi ý 💡 | Giữ nguyên + **Giải thích từng bước sau khi sai** (free chỉ báo đúng/sai + gợi ý), **bài nâng cao** mức "vận dụng/thử thách" |
| **Luyện thi lớp 6** | Không có | **Đề thi thử lớp 6** (đề cố định, chấm điểm, bảng điểm yếu theo chủ đề) + ngân hàng đề nâng cao; mục tiêu chính của gói |
| **Lộ trình** | Bé tự chọn kỹ năng | **"Bài hôm nay dành cho bé"**: tự chọn kỹ năng yếu và ôn lại đúng lúc (lặp ngắt quãng), mục tiêu tuần |
| **Báo cáo phụ huynh** | Số phút chơi, giới hạn giờ, mức thành thạo hiện tại | **Báo cáo tuần/tháng**: tiến bộ theo kỹ năng, kỹ năng hay sai, gợi ý phụ huynh cùng bé luyện gì, **gửi email hằng tuần** |
| **Nhiều bé / nhiều máy** | 1 hồ sơ bé trên 1 máy; sao lưu tay bằng tệp | Tới **4 hồ sơ bé**, **đồng bộ đám mây** giữa các máy (đổi máy không mất vườn), tối đa 3 thiết bị |
| **Truyện & vườn** | Vườn đủ 3 khu, truyện Mùa 1 (khi viết xong) | **Mùa truyện tiếp theo** sớm hơn, cây/vật nuôi/trang phục **chỉ để trang trí** (không ảnh hưởng học), giao diện vườn Night |
| **Tiếng Anh** | Từ vựng + mẫu câu cơ bản | Lộ trình Cambridge Starters/Movers/Flyers (làm sau 6 tháng, theo `plan-learn.md` F.4) |
| **Giọng đọc** | Giọng của trình duyệt | Giọng đọc chất lượng cao (cân nhắc chi phí, làm sau) |

Thứ tự bán hàng (giá trị cao nhất trước): **AI luyện cùng + đề thi lớp 6 → báo cáo + lộ trình → đồng bộ nhiều bé/nhiều máy → nội dung nâng cao → truyện/vườn trang trí**.

## 3A. AI luyện cùng bé (tính năng chủ đạo của Plus)

Ý tưởng: bé không "chat với AI", mà **linh vật quen thuộc (Mochi/Mầm/Bibi, Bạn Mây) ngồi học cùng bé** và biết bé đang yếu chỗ nào. AI chạy ở máy chủ, linh vật chỉ là gương mặt; bé chỉ bấm/chọn/nhập đáp án, **không gõ chữ tự do** (an toàn, và đúng với bé 6–10 tuổi).

| Chế độ | Bé thấy gì | AI làm gì |
|---|---|---|
| **Gợi ý từng bước** | Bấm 💡 → linh vật hỏi lại một câu nhỏ ("5 + 3 thì bắt đầu từ số nào nhỉ?"), bé trả lời bước đó rồi mới sang bước sau | Sinh bước gợi ý theo đúng câu và đúng chỗ bé đang kẹt; **không bao giờ nói đáp án** |
| **Giải thích khi sai** | Sau khi sai, linh vật nói ngắn vì sao sai và chỉ cách nghĩ đúng, rồi cho bé thử lại câu tương tự | Đọc lỗi bé chọn (mỗi đáp án sai đã có mã lỗi trong `bank.js`) và giải thích trúng lỗi đó |
| **Luyện cùng (bài hôm nay)** | Một buổi 10 phút: linh vật rủ "mình luyện phép trừ có nhớ nhé", khó dần, dễ lại khi bé mệt | Chọn kỹ năng + độ khó tiếp theo theo mức thành thạo và các lỗi gần đây; sinh biến thể câu hỏi bằng mẫu có sẵn, chỉ gọi AI viết lời khi cần |
| **Giờ dạy Bạn Mây** | Bạn Mây làm sai, bé tìm lỗi và dạy lại (đã có trong `docs/LEARN-STORY-PLAN.md`) | Đóng vai bạn nhỏ chưa biết, sai đúng kiểu lỗi phổ biến của kỹ năng đó |
| **Tóm tắt cho ba mẹ** | Trong trang phụ huynh: vài câu tiếng Việt tự nhiên "tuần này bé tiến bộ ở…, hay nhầm…, tối nay luyện cùng bé…" | Viết từ số liệu báo cáo, không đụng dữ liệu cá nhân |
| *(sau)* **Chụp bài tập / đọc to bằng giọng bé** | Qua cổng phụ huynh; Tiếng Anh: bé đọc, AI nghe phát âm | Làm ở giai đoạn cuối, cần duyệt riêng về riêng tư |

### Cách giữ an toàn (bắt buộc, theo `docs/LEARN-MASCOT-AI-CONTRACT.md`)
1. **AI không điều khiển tự do**: đầu ra là JSON cố định `{event, emotion, steps[], text}`; linh vật chỉ dùng cảm xúc/sự kiện có sẵn; mọi câu qua bộ lọc `clean`. Hợp đồng ghi rõ **phải thêm lọc từ nhạy cảm theo danh sách trước khi cho AI gửi câu tự do tới trẻ**: việc này là điều kiện để mở tính năng, không bỏ qua.
2. **Không lộ đáp án**: máy chủ kiểm lại đầu ra, nếu chứa đáp án đúng thì bỏ và dùng gợi ý viết sẵn. Có bộ thử 50+ bài mẫu (`plan-learn.md` 2.7) phải đạt 100% trước khi bật.
3. **Không gửi thông tin về bé**: chỉ gửi lớp, kỹ năng, nội dung câu hỏi, đáp án bé chọn, mã lỗi. Không tên, không email, không ID thiết bị. Khoá API chỉ nằm ở Worker (Secret), không bao giờ xuống trình duyệt.
4. **Chặn ngoài chủ đề**: không có ô gõ tự do nên không "hỏi chuyện linh tinh" được; đầu vào chỉ là câu học đang làm.
5. **Luôn có đường lui**: AI chậm/lỗi/mất mạng → linh vật nói "đang nghĩ…" tối đa vài giây rồi dùng gợi ý viết sẵn (đã phủ 100% câu). Bé không bao giờ thấy màn trống hay lỗi kỹ thuật.
6. **Ba mẹ kiểm soát**: bật/tắt AI trong trang phụ huynh, xem lại các lời linh vật đã nói trong ngày.

### Chi phí (chi phí thật, phải kiểm soát)
- Mặc định mô hình nhỏ (Haiku 5.5), chỉ dùng Sonnet 5.5 cho bài khó; bật prompt caching.
- **Cache theo (câu hỏi + mã lỗi)**: lời giải thích cho cùng một lỗi trên cùng một câu chỉ tạo một lần rồi dùng cho mọi bé. Phần lớn lần "giải thích khi sai" sẽ không tốn thêm tiền khi đã đủ cache.
- Giới hạn mỗi bé mỗi ngày (đề xuất 40 lượt gọi AI; hết thì quay về gợi ý viết sẵn, không chặn học) và giới hạn theo thiết bị.
- **Chưa có con số chi phí mỗi bé**: giai đoạn thử nghiệm phải đo thật (số lượt/bé/ngày, token/lượt, tỉ lệ trúng cache) rồi mới chốt giá và hạn mức. Giá ở mục 8 là tạm.

## 4. Cách phụ huynh gặp Plus

- Trong trang bé: **không có gì thay đổi**, trừ một huy hiệu 👑 nhỏ ở khu vực của gói đã mở. Tính năng Plus chưa mở hiện thành thẻ nhìn thử, bấm vào chỉ nói "nhờ ba mẹ" và dẫn về cổng phụ huynh (không popup mua).
- Trong trang phụ huynh (`learn/parent/`): thẻ **"Học Vui Plus"** liệt kê 4 điều lợi, nút **Dùng thử 7 ngày** (không cần thẻ/tiền, gắn thiết bị, mỗi email một lần) rồi **Mở Plus** (VietQR như Night Pass game).
- Hết hạn: mọi thứ của bé **giữ nguyên** (vườn, sao, tiến độ); chỉ các tính năng Plus ngừng, dữ liệu báo cáo/đồng bộ vẫn còn để xem lại khi gia hạn. Không xoá gì của bé.

## 5. Kỹ thuật (tái dùng tối đa)

| Việc | Cách làm |
|---|---|
| Gói riêng | `PLANS_LEARN` (tháng/quý/năm, không bán gói ngày), cột `product` ('game' / 'learn') ở bảng `orders` và `passes` (migration mới), token có `a:"learn"`; token game không mở Plus |
| Giao mã/nội dung Plus | `/api/pro/learn.js` (mã) và `/api/learn/exam/<id>` (đề thi) chỉ trả khi token hợp lệ; đề thi không nằm trong file công khai |
| Cổng ở client | `learn/plus.js`: `Plus.has(feature)`, đọc trạng thái từ `/api/pass?product=learn`, lưu bản nhớ ngắn để chạy khi mất mạng |
| AI luyện cùng | `POST /api/learn/coach` (chỉ token Plus): nhận `{skill, grade, qid, wrong, step}`, gọi Claude từ Worker, trả JSON có schema; bảng `learn_coach_cache(qid, errcode, lang, text)`; đếm lượt theo ngày; `learn/coach.js` nối với `LearnMascot.react()` |
| Đồng bộ | bảng `learn_profiles(user_id, profile_id, data jsonb, updated_at)`; chỉ lưu tiến độ ẩn danh (kỹ năng, sao, vườn), **không tên thật, không ảnh, không email của bé**; xung đột: bản mới hơn thắng theo từng phần |
| Báo cáo email | job theo lịch của Worker, dùng Brevo/Resend đã cấu hình |
| Pháp lý | cập nhật `privacy.html`, `terms.html`, `docs/FREE-VS-NIGHTPASS.md` (thêm mục Học Vui) TRƯỚC khi mở bán; đồng ý của phụ huynh trước khi bật đồng bộ |
| Kiểm tra | `scripts/learn/check-plus.js`: trạng thái không có/đang dùng thử/có/hết hạn × điện thoại dọc/ngang; bé không thấy giá ở bất kỳ màn nào; token game không mở Plus |

## 6. Các giai đoạn (mỗi giai đoạn tự đứng được, deploy riêng)

1. **G0. Chốt sản phẩm (không code):** bạn duyệt tài liệu này; tôi viết `docs/LEARN-FREE-VS-PLUS.md` bảng sự thật và chữ công khai.
2. **G1. Nền bán hàng:** migration `product`, `PLANS_LEARN`, `/api/pass?product=learn`, `learn/plus.js`, thẻ Plus trong trang phụ huynh, dùng thử 7 ngày. Chưa có tính năng Plus nào nhưng mua/dùng thử/hết hạn chạy được (thử bằng giá 1.000đ).
3. **G2. AI luyện cùng, bản đầu (gợi ý từng bước + giải thích khi sai):** `/api/learn/coach`, schema đầu ra, bộ lọc từ nhạy cảm, kiểm tra không lộ đáp án (50+ bài), cache, hạn mức ngày, đường lui. **Chạy thử với nhóm nhỏ và đo chi phí thật** trước khi bán rộng.
4. **G3. Luyện cùng 10 phút ("Bài hôm nay") + Giờ dạy Bạn Mây + tóm tắt cho ba mẹ.**
5. **G4. Đề thi thử lớp 6** (3 đề đầu, chấm điểm, bảng điểm yếu theo chủ đề) + báo cáo tuần.
6. **G5. Nhiều bé + đồng bộ đám mây** (cần cập nhật pháp lý trước).
7. **G6. Truyện mùa 2, vườn Night, Cambridge, giọng đọc, chụp bài tập/đọc to** (theo nhu cầu).

Mỗi giai đoạn: ảnh chụp Chrome thật ở 360×640, 380×760, ngang 844×390, 1200×640 cho trạng thái free và Plus; `check-worker-bundle.js` trước deploy.

## 7. Rủi ro cần biết

- **Mở bán cho phụ huynh nhưng người dùng là trẻ em**: phải giữ cổng phụ huynh, không quảng cáo bên ngoài, không thu dữ liệu cá nhân của bé. Đồng bộ đám mây là phần nhạy cảm nhất, nên để G4 sau cùng.
- **AI nói sai hoặc nói điều không hợp lứa tuổi** là rủi ro lớn nhất của tính năng này: vì vậy đầu ra có schema + lọc + kiểm đáp án, không có ô gõ tự do, và có công tắc tắt AI cho ba mẹ. Nội dung toán do AI giải thích cần đối chiếu với đáp án đã biết của ngân hàng câu hỏi, không tin AI tự tính.
- **Nội dung đề thi**: tự soạn bám khung GDPT 2018 và dạng đề đánh giá năng lực, không chép đề thật hay sách giáo khoa (bản quyền; `plan-learn.md` F.3).
- **Khối lượng nội dung** là chi phí thật: mỗi đề ~30–40 câu cần soạn và duyệt. Nếu chưa đủ đề thì chưa nên mở bán.
- **Học thử quá rộng** thì không ai mua; **quá hẹp** thì không ai tin. Đó là lý do mục 2 giữ Free đủ tốt và Plus nhắm vào "hiểu, báo cáo, thi".

## 8. Câu hỏi cần bạn chốt

1. **Tên:** "Học Vui Plus" hay giữ tên "Night Pass Học"? (đề xuất: Học Vui Plus.)
2. **AI luyện cùng:** đồng ý cách làm "linh vật + không gõ chữ tự do + máy chủ giữ khoá" ở mục 3A? Có muốn thêm **ô hỏi bằng giọng nói/gõ chữ** cho bé không? (đề xuất: chưa, rủi ro an toàn cao hơn nhiều; để sau khi bản đầu ổn.)
3. **Giá:** vì AI có chi phí theo lượt dùng, giá tham khảo tạm: tháng 99.000đ · quý 249.000đ · năm 790.000đ, chốt lại sau khi đo chi phí thật ở G2. Không bán gói ngày/tuần.
4. **Có đồng ý lưu tiến độ ẩn danh của bé lên máy chủ** (đồng bộ đám mây, G5) không? (đề xuất: đồng ý nhưng để sau cùng.)
5. **Thứ tự:** G1 nền bán hàng → G2 AI luyện cùng (thử nhỏ, đo chi phí) → đề lớp 6? Hay làm AI trước, bán sau cùng một lúc?
6. **Có gói đôi** (Night Pass game + Plus) không? (đề xuất: chưa.)
