Prompt tạo Landing Page Game: Nhẹ, Đa ngôn ngữ, Theme theo máy
Nov 4, 2026 · @Tam Phạm Hiệp
Cách dùng
Doc này là một prompt mẫu: điền thông tin game, copy phần prompt vào Claude, và nhận về một file index.html duy nhất sẵn sàng upload lên Cloudflare Pages hoặc Netlify.
1. Điền bảng Thông tin game bên dưới.
2. Copy toàn bộ khối Prompt (kèm thông tin đã điền) và gửi cho Claude.
3. Nhận file, kiểm tra theo Checklist cuối doc.
4. Kéo-thả thư mục chứa index.html lên hosting.
Thông tin trang và danh sách game
Thay cột Giá trị bằng thông tin thật; ô nào để trống thì Claude sẽ dùng nội dung mẫu.
Mục
Giá trị
Tên trang
[Tên trang / thương hiệu]
Danh mục game
[Không cần: trẻ nhỏ không dùng bộ lọc]
Slogan ngắn
[1 câu, dưới 10 từ]
Mô tả ngắn
[2–3 câu]
Cách mở game
[Trong trang (khung toàn màn hình) hoặc tab mới]
Logo
[URL ảnh hoặc để trống]
Số game hiện lúc đầu
[Tất cả, cuộn xuống để xem thêm]
Ngôn ngữ hỗ trợ
Tiếng Việt, English (mặc định: English)
Màu chủ đạo
[VD: #FF5A1F]
Email liên hệ
[email]
Link Privacy Policy
[URL]
Danh sách game: mỗi game một dòng. Trang chỉ hiện ảnh thumbnail, nên ảnh phải tự nói lên game là gì: hình vuông 512×512 px, màu tươi, nhân vật to, không có chữ trên ảnh, định dạng WebP dưới 40 KB. Tên game chỉ dùng cho phụ huynh và trình đọc màn hình.
Tên game
Ảnh thumbnail (vuông)
Link mở game
[Game 1]
[thumbs/game1.webp]
[games/game1/index.html]
[Game 2]
[thumbs/game2.webp]
[https://...]
[Game 3]
[thumbs/game3.webp]
[https://...]
Prompt
Copy nguyên khối dưới đây, dán bảng thông tin đã điền vào chỗ [DÁN THÔNG TIN GAME VÀO ĐÂY].
Bạn là một frontend developer chuyên làm giao diện cho trẻ em.
Hãy tạo MỘT file index.html duy nhất: trang hiển thị các game dưới dạng
LƯỚI ẢNH THUMBNAIL, trẻ 3 tuổi chưa biết đọc cũng tự bấm chơi được.
Bấm vào ảnh nào thì mới tải và mở game đó.

[DÁN THÔNG TIN GAME VÀO ĐÂY]

CẤU TRÚC TRANG:
1. Trên cùng: chỉ có logo nhỏ. Không tiêu đề dài, không slogan, không menu.
2. Lưới thumbnail vuông, bo góc lớn, chiếm gần hết màn hình.
   Điện thoại 2 cột, tablet 3–4 cột, desktop tối đa 6 cột.
   Hiện tất cả game, cuộn xuống để xem tiếp. Không có nút "Xem thêm".
3. Dưới cùng: 1 nút nhỏ hình ổ khoá "Phụ huynh" (xem Khu vực phụ huynh).

DỮ LIỆU GAME:
- Danh sách game nằm trong 1 mảng JS ở đầu script, ví dụ:
  const games = [
    { id: "game-1", name: { vi: "...", en: "..." },
      thumb: "thumbs/game1.webp", url: "games/game1/index.html" }
  ];
- Lưới được render từ mảng này. Thêm game mới chỉ cần thêm 1 object.
- Tên game KHÔNG hiện trên lưới, chỉ dùng cho aria-label và document.title.

TIÊU CHÍ DÀNH CHO TRẺ 3 TUỔI (quan trọng nhất):
- Không cần biết đọc: lưới không có chữ, mọi nút là icon SVG to, dễ hiểu.
- Vùng bấm to: mỗi thumbnail tối thiểu 140×140 px trên điện thoại,
  khoảng cách giữa các ô tối thiểu 16 px để tránh bấm nhầm.
- Chỉ cần chạm 1 lần là mở game. Không double tap, không giữ lâu, không vuốt.
- Phản hồi ngay khi chạm: ảnh nảy lên (scale) trong khoảng 150 ms,
  kèm 1 tiếng "pop" ngắn tạo bằng Web Audio API (không dùng file âm thanh).
  Tắt animation nếu máy bật prefers-reduced-motion.
- Chống thao tác nhầm: touch-action: manipulation (không zoom khi chạm 2 lần),
  user-select: none, -webkit-touch-callout: none, ảnh draggable="false",
  chặn menu chuột phải/giữ lâu trên ảnh, overscroll-behavior: none.
- Chạy tốt cả màn hình dọc và ngang.

CÁCH MỞ GAME:
- Lúc tải trang KHÔNG tải game nào. Chỉ khi chạm mới tạo <iframe> với src
  là url game, hiển thị trong lớp phủ phủ kín màn hình, tự bật Fullscreen
  nếu trình duyệt hỗ trợ.
- Có nút "Về nhà" hình ngôi nhà, to (tối thiểu 64×64 px), ở góc trên trái,
  để quay về lưới game.
- Khi đóng: xoá hẳn iframe khỏi DOM để giải phóng bộ nhớ và dừng âm thanh.
- Cập nhật location.hash thành #<id-game> khi mở; mở trang với hash đó thì tự mở game.
  Bấm nút Back của điện thoại thì quay về lưới game.
- Hiện animation loading vui nhộn (không có chữ) trong lúc game đang tải.

KHU VỰC PHỤ HUYNH (chặn trẻ bấm nhầm):
- Nút ổ khoá chỉ mở khi GIỮ liên tục 3 giây (có vòng tròn đếm ngược).
- Bên trong mới có: chọn ngôn ngữ, email liên hệ, link Privacy Policy.
- Ngoài khu vực này, trang KHÔNG có bất kỳ link nào dẫn ra ngoài.
- Không quảng cáo, không thư viện tracking, không thu thập dữ liệu của trẻ.

BẮT BUỘC 3 TIÊU CHÍ KỸ THUẬT:

### Tiêu chí 1 — Nhẹ, load nhanh
- Chỉ 1 file HTML, CSS và JS viết inline. Không framework, thư viện hay CDN.
- Không dùng web font ngoài; dùng system font stack:
  system-ui, -apple-system, "Segoe UI", Roboto, sans-serif.
- Tổng dung lượng file HTML dưới 50 KB (chưa tính ảnh và game).
- Thumbnail: <img> có width, height, loading="lazy", decoding="async";
  riêng các ô nằm trong màn hình đầu tiên KHÔNG lazy.
  Có màu nền placeholder tươi sáng khi ảnh chưa tải.
- JS đặt cuối body, ngắn gọn, không chặn render.

### Tiêu chí 2 — Đa ngôn ngữ theo ngôn ngữ của máy
- Chữ (aria-label, title, khu vực phụ huynh) lấy từ 1 object từ điển:
  const i18n = { vi: {...}, en: {...} };
- Khi mở trang: đọc navigator.languages, lấy phần trước dấu "-" (vi-VN -> vi),
  chọn ngôn ngữ đầu tiên có trong từ điển; không có thì dùng ngôn ngữ mặc định.
- Cập nhật <html lang>, document.title và meta description theo ngôn ngữ.
- Lựa chọn tay trong khu vực phụ huynh được lưu vào localStorage
  (bọc trong try/catch) và ưu tiên hơn ngôn ngữ máy.
- Truyền ngôn ngữ đang chọn vào game qua query string: url?lang=vi.

### Tiêu chí 3 — Theme theo máy (sáng/tối)
- Khai báo mọi màu bằng CSS variables trên :root; ghi đè trong
  @media (prefers-color-scheme: dark).
- Thêm <meta name="color-scheme" content="light dark"> và 2 thẻ
  <meta name="theme-color"> với media light/dark.
- Chỉ dùng CSS cho theme, không dùng JS, để không nháy màu khi tải trang.
- Chế độ tối dùng nền xanh đêm dịu mắt, không dùng đen tuyền;
  thumbnail vẫn giữ màu tươi.

KHÁC:
- Mỗi thumbnail là <button> có aria-label = tên game (bấm được bằng bàn phím).
- Có thẻ Open Graph và favicon dạng SVG inline (data URI).
- Code có comment chỉ rõ chỗ thêm game, đổi màu, đổi thời gian giữ nút phụ huynh.

Trả về: file index.html hoàn chỉnh với 8 game mẫu (thumbnail mẫu vẽ bằng
SVG data URI nhiều màu), sau đó 1 đoạn ngắn hướng dẫn thêm game và thêm ngôn ngữ.
Vì sao 3 tiêu chí được viết như vậy
Mỗi yêu cầu trong prompt đều nhắm vào một rủi ro cụ thể; bảng dưới giúp bạn biết chỗ nào không nên bỏ khi sửa prompt.
Tiêu chí
Yêu cầu then chốt
Nếu bỏ qua thì sao
Cho bé 3 tuổi
Lưới không có chữ, thumbnail vuông to
Bé chưa biết đọc sẽ không biết bấm vào đâu
Cho bé 3 tuổi
Ô tối thiểu 140 px, cách nhau 16 px
Ngón tay bé chưa chính xác, dễ bấm nhầm game bên cạnh
Cho bé 3 tuổi
Hiệu ứng nảy + tiếng pop khi chạm
Không có phản hồi, bé tưởng chưa bấm và chạm liên tục
Cho bé 3 tuổi
Chặn zoom, menu giữ lâu, kéo ảnh
Bé chạm lung tung làm trang phóng to hoặc hiện menu lạ
Cho bé 3 tuổi
Khu vực phụ huynh giữ 3 giây
Bé bấm nhầm ra link ngoài, email hoặc đổi ngôn ngữ
Nhẹ
Chỉ tạo iframe khi bấm vào game
Tải sẵn nhiều game cùng lúc làm trang nặng hàng chục MB và đơ máy yếu
Nhẹ
Xoá iframe khi đóng game
Game vẫn chạy ngầm, tốn pin, còn phát âm thanh
Nhẹ
1 file, không framework, không CDN
Mỗi request ra nước ngoài làm chậm trang trên 4G, nhất là khi cáp quang biển gặp sự cố
Nhẹ
Thumbnail có width/height, lazy load
Không có kích thước thì lưới game bị giật khi ảnh tải xong
Đa ngôn ngữ
Đọc navigator.languages
Chỉ đọc 1 ngôn ngữ sẽ bỏ lỡ người dùng có ngôn ngữ phụ
Đa ngôn ngữ
Truyền ?lang= vào game
Trang tiếng Việt nhưng game mở ra tiếng Anh
Theme
prefers-color-scheme bằng CSS
Dùng JS sẽ nháy nền trắng một lúc trước khi chuyển tối
Theme
color-scheme + theme-color
Thanh cuộn và thanh trình duyệt không đổi màu theo
Checklist sau khi gen
Kiểm tra 15 mục này trước khi upload; mục nào không đạt thì nhờ Claude sửa đúng mục đó.
Lưới game cho bé
[ ] Mở DevTools → tab Network: lúc tải trang không có request nào tới file game
[ ] Chạm 1 lần vào ảnh là game mở ngay, có hiệu ứng nảy và tiếng pop
[ ] Nút ngôi nhà to, bấm về lại lưới game và âm thanh game tắt ngay
[ ] Chạm nhanh 2 lần không bị zoom; giữ lâu trên ảnh không hiện menu
[ ] Nút phụ huynh: chạm thường không mở, giữ đủ 3 giây mới mở
[ ] Đưa máy cho bé 3 tuổi: bé tự mở được game mà không cần người lớn chỉ
Nhẹ
[ ] File index.html dưới 50 KB
[ ] Không có link <script src> hoặc <link> trỏ ra ngoài
[ ] PageSpeed Insights (Mobile) đạt trên 90 điểm
Đa ngôn ngữ
[ ] Đổi ngôn ngữ điện thoại sang English, mở lại trang thấy tiếng Anh
[ ] Chọn ngôn ngữ ở footer, tải lại trang vẫn giữ lựa chọn
[ ] Tab trình duyệt đổi tiêu đề theo ngôn ngữ
Theme
[ ] Bật chế độ tối trên máy, trang tự chuyển tối mà không cần tải lại
[ ] Không nháy nền trắng khi mở trang ở chế độ tối
[ ] Chữ đọc rõ ở cả 2 chế độ, đặc biệt nút tải