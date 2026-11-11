# Đặc tả trang LANDING giới thiệu và quảng bá Play Hub (Pop Play, Night Play, Night Pass)

Tài liệu này dành cho lập trình viên hoặc AI sinh code trang landing. Đọc hết trước khi viết. Mọi số liệu (số game, giá, tính năng) đã đối chiếu với code ngày 10/11/2026; nếu code đổi, code thắng tài liệu này (nguồn sự thật ở mục 14).

## 1. Mục tiêu và đối tượng
- **Mục tiêu:** (1) người mới hiểu trong 5 giây "đây là gì, có đáng thử không" và bấm **Chơi ngay**; (2) phụ huynh tin tưởng cho con chơi; (3) một phần nhỏ nâng cấp **Night Pass**; (4) lên Google khi tìm "game ngắn cho bé", "game giải trí văn phòng".
- **Đối tượng 1 (Pop Play):** phụ huynh có con 3–10 tuổi. Lo: quảng cáo, nội dung lạ, nghiện màn hình, thu thập dữ liệu của trẻ.
- **Đối tượng 2 (Night Play / Cozy):** người trưởng thành, dân văn phòng 22–40 tuổi, chơi vài phút giải toả (đi tàu, giờ nghỉ, trước khi ngủ). Giọng điệu hài hước, thân thuộc đời sống Việt (deadline, lương cuối tháng, shipper, ổ gà).
- **Chỉ số thành công:** bấm "Chơi ngay" ≥ 35% lượt xem; Lighthouse ≥ 90; không có chuyển đổi nào cần cookie.

## 2. Định vị và thông điệp
Một câu: **"Game ngắn, một màn hình, không quảng cáo. Mở lên là chơi."** / *"Short games, one screen, no ads. Open and play."*

Sáu ý bắt buộc xuất hiện (đúng với code, không hứa thêm):
1. **Game ngắn, một màn hình**: mỗi ván vài chục giây đến vài phút, không cuộn trang, như một ứng dụng.
2. **Không quảng cáo, không theo dõi cá nhân**: chỉ đếm ẩn danh (lượt mở, game nào được chơi); không cookie; không tài khoản.
3. **Chạy offline, không cần cài đặt**: mở bằng trình duyệt, thêm vào màn hình chính như ứng dụng (PWA); đã mở một lần thì chơi được khi mất mạng.
4. **Miễn phí để chơi** (có giới hạn bản Free) và **Night Pass** (mua một lần theo gói, không tự gia hạn) mở khoá chế độ, giao diện, cấp độ đặc biệt và chơi không giới hạn thời gian.
5. **Chơi cùng lúc** (2–4 game trên một màn hình), **chơi hộ** (bạn chơi tiếp ván dở của mình qua link), **thách đấu** (gửi link, bạn đấu cùng ván).
6. **An toàn cho trẻ** (Pop Play): cổng phụ huynh, giới hạn thời gian do bố mẹ đặt, khoá màn hình, không ô gõ tên, không quảng cáo.

Tránh: "an toàn tuyệt đối", "không thu thập dữ liệu nào" (có đếm ẩn danh), "miễn phí hoàn toàn" (có Night Pass), "tuân thủ COPPA/GDPR" (không tuyên bố khi chưa kiểm định).

## 3. Vị trí trang (ĐÃ CHỐT, chủ site duyệt giai đoạn 2: landing là trang chủ)
- `https://nightplay.vn/` = landing tiếng Việt (`landing/index.html`), canonical `https://nightplay.vn/`.
- `https://nightplay.vn/en/` = landing tiếng Anh (`landing/en/index.html`). Hai bản có chữ tĩnh đầy đủ trong HTML (không dựng bằng JS); công tắc VI/EN chỉ là liên kết sang bản kia.
- **Hub ứng dụng** (hai thẻ Pop Play / Night Play) nay ở `/play/` (`play/index.html`) và là `start_url` của PWA (`manifest.webmanifest`: `start_url "/play/"`, `scope "/"`, `id "/"` giữ nguyên). Nút Home/hubBtn trong trang cổng (`popplay/`, `cozyplay/`) và các trang chức năng (`help`, `shared`, `leaderboard`, `restricted`, `passcheck`) về `/play/`; `privacy.html`/`terms.html` về `/` (landing).
- Nút **Chơi ngay**, "Xem tất cả game" của landing trỏ `/play/`; nút "Pop Play/Night Play" trỏ `/popplay/`, `/cozyplay/`. PWA đã cài mở `/` (display-mode standalone/fullscreen hoặc `navigator.standalone`) bị script nhỏ trong `<head>` landing chuyển ngay sang `/play/`.
- Địa chỉ cũ `/gioi-thieu/` và `/gioi-thieu/en/` chuyển vĩnh viễn (301) về `/` và `/en/` bằng `dist/_redirects` (do `scripts/build.js` ghi; Cloudflare assets đọc file này), kèm trang tĩnh dự phòng (meta refresh + canonical) cho host không đọc `_redirects`.
- `sw.js`: SHELL có `/play/index.html`, KHÔNG có `/` hay `/index.html` (landing không cần offline); khi mất mạng điều hướng chưa lưu rơi về `/play/index.html`. `CACHE` đã nâng (np-shell-v14) nên cache hub cũ ở khoá `/index.html` bị xoá khi SW mới kích hoạt.

Việc build: `scripts/build.js` đưa `play` vào mảng `HUB`, copy mọi mục của `landing/*` lên GỐC `dist/` (`/index.html`, `/en/`, `/lp/`, `/sitemap.xml`, `/robots.txt`). Bản dev (`server/server.js`) tự tìm thêm ở `landing/` khi không có file ở gốc.

## 4. Cấu trúc thư mục đề xuất
```
landing/
  index.html            (VI, chữ tĩnh, phục vụ ở /)
  en/index.html         (EN, chữ tĩnh, phục vụ ở /en/)
  lp/landing.css        (một file CSS, dùng chung hai bản; cache dài)
  lp/landing.js         (< 4 KB: công tắc theme, đo lường, FAQ mở/đóng, ẩn/hiện CTA cuối)
  lp/img/               (ảnh nhỏ, xem mục 11)
  sitemap.xml
  robots.txt
```
`scripts/build.js` copy `landing/*` lên gốc `dist/` (thêm một dòng `cpSync` cho từng mục; không đổi cấu trúc khác). Không build step phức tạp: HTML/CSS/JS viết tay, không framework, không bundler.

## 5. Yêu cầu kỹ thuật
- **Tĩnh thuần** (HTML + CSS + JS nhỏ), chạy trên Cloudflare Workers assets, `run_worker_first` chỉ `/api/*` nên landing không tốn hạn mức Worker.
- **Design tokens: lấy từ `shared/theme.css`** (liên kết `/shared/theme.css` rồi dùng `var(--bg) --card --ink --ink2 --muted --accent --on-accent --panel --line --shadow`). Hai nhóm màu thương hiệu: Pop `#FF5A1F` (cam) và Night `#7C5CFF` (tím); sáng `--bg:#F6F4F1`, tối `--bg:#12141F`. Logo: nửa cam nửa tím với chấm trắng (SVG trong `play/index.html` hub; sao chép).
- **Sáng/tối:** theo `prefers-color-scheme`, ghi đè bằng `localStorage "theme"` (cùng khoá với phần còn lại); nút đổi theme 44px. Đặt `data-theme` trước khi vẽ (script nhỏ trong `<head>`, như `privacy.html`) để không nháy.
- **Ngôn ngữ:** hai file tĩnh; `localStorage "lang"` chỉ dùng để chuyển hướng lần đầu nếu khác ngôn ngữ trang và người dùng chưa chọn trong phiên.
- **Font:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (như `privacy.html`). KHÔNG Google Fonts (tránh lộ IP cho bên thứ ba, nhanh hơn). Tiêu đề có thể dùng `Georgia, serif` 800.
- **Responsive 320–1440:** mobile-first; một cột dưới 700px; lưới game 2 cột (≤ 480px), 4 cột (≥ 700px), 6 cột (≥ 1100px); `max-width` nội dung 1100px; không tràn ngang ở 320px.
- **Cuộn:** landing được phép cuộn dọc (khác các trang game theo `GAME_RULES.md` mục "một màn hình"), nhưng phần **hero vừa đúng một màn hình** (`min-height: 100svh` trừ thanh trên) với CTA nhìn thấy ngay không cần cuộn ở 360×640.
- **Hiệu năng (Lighthouse mobile ≥ 90 cả 4 mục):** không thư viện nặng (không React, jQuery, animation lib); tổng trọng lượng trang < 300 KB (HTML+CSS+JS+ảnh trước khi cuộn < 150 KB); ảnh WebP/AVIF/SVG có `width/height`, `loading="lazy"` trừ ảnh hero, `decoding="async"`; CSS critical nhỏ đặt inline, phần còn lại `landing.css`; không layout shift (CLS < 0.05); `fetchpriority="high"` cho ảnh hero.
- **Truy cập (WCAG AA):** tương phản chữ ≥ 4.5:1 cả sáng và tối (dùng cặp `--ink/--bg`, `--on-accent/--accent`); nút/liên kết chạm ≥ 44×44px; `:focus-visible` rõ (`outline:3px solid var(--accent)`); một `<h1>`, thứ tự h2/h3 đúng; `lang` đúng; `alt` cho ảnh; emoji trang trí `aria-hidden`; FAQ dùng `<details>` (bàn phím được); `prefers-reduced-motion` tắt mọi chuyển động; liên kết "Bỏ qua tới nội dung".
- **Không cookie, không bên thứ ba:** không nhúng video/iframe/script ngoài.

## 6. SEO
Mỗi bản có đủ trong `<head>` (thay `{vi|en}`):
- `<title>` ≤ 60 ký tự. VI: `Play Hub: game ngắn, không quảng cáo cho bé và người lớn`. EN: `Play Hub: short, ad-free games for kids and grown-ups`.
- `<meta name="description">` 140–160 ký tự (mục 9.1).
- `<link rel="canonical" href="https://nightplay.vn/">` (VI) và `https://nightplay.vn/en/` (EN).
- `hreflang`: `vi` → `/`, `en` → `/en/`, `x-default` → `/`.
- Open Graph: `og:type=website`, `og:site_name=Play Hub`, `og:title`, `og:description`, `og:url`, `og:image` (1200×630, `https://nightplay.vn/lp/img/og.png`), `og:locale` (`vi_VN` / `en_US`), `og:locale:alternate`. Twitter: `summary_large_image` + title/description/image.
- `<meta name="theme-color">` sáng/tối; favicon như hub.
- **JSON-LD** (một thẻ `<script type="application/ld+json">`, dùng `@graph`):
  - `Organization`: `name` (tên pháp nhân sau khi chủ site điền ở `shared/site.js`; cho tới lúc đó dùng "Play Hub"), `url`, `logo`, `email: support@nightplay.vn`.
  - `WebSite` (`url`, `inLanguage`).
  - `VideoGame` ×2 (Pop Play, Night Play): `name`, `description`, `url` (`https://nightplay.vn/popplay/`, `https://nightplay.vn/cozyplay/`), `genre` (Puzzle, Casual), `applicationCategory: "Game"`, `operatingSystem: "Any (web browser)"`, `playMode: "SinglePlayer"`, `offers` (`price: 0`, `priceCurrency: "VND"`). KHÔNG thêm `aggregateRating`/`review` giả.
  - `FAQPage`: đúng các câu ở mục 8, chữ giống hệt phần hiển thị.
- `robots.txt`: `User-agent: *`, `Allow: /`, `Disallow: /admin/`, `Disallow: /api/`, `Sitemap: https://nightplay.vn/sitemap.xml`.
- `sitemap.xml`: `/`, `/en/`, `/play/`, `/popplay/`, `/cozyplay/`, `/subscribe.html`, `/privacy.html`, `/terms.html`, kèm `xhtml:link` hreflang cho hai bản landing, `lastmod` = ngày build.
- Nội dung: một `<h1>` chứa từ khoá ("game ngắn", "Play Hub"); văn bản thật (không chữ trong ảnh); liên kết nội bộ tới `/popplay/`, `/cozyplay/`, `/subscribe.html`.

## 7. Đo lường tối thiểu (tuân thủ privacy)
- Chỉ dùng điểm cuối có sẵn `POST /api/t` qua `shared/track.js` (`Track.view("home")`): đã tắt khi Do Not Track/GPC, không cookie, không IP lưu vào bảng thống kê. Máy chủ chỉ nhận `site ∈ {home, popplay, cozyplay, subscribe}`, nên landing gọi `Track.view("home")` (cộng vào lượt xem trang chủ), KHÔNG tự thêm giá trị mới nếu chưa sửa `SITES` trong `server/app.js`.
- Không Google Analytics, Meta Pixel, Hotjar, bất kỳ script ngoài. Không `localStorage` ngoài `theme`, `lang`.
- Nếu cần đo bấm CTA: đề xuất riêng (thêm sự kiện vào `/api/t` + cập nhật `privacy.html` mục 3.1), không tự thêm.

## 8. Cấu trúc trang theo section (copy VI/EN dùng được ngay)

Thanh trên cố định: logo Play Hub · liên kết neo (Game, Tính năng, Night Pass, Câu hỏi) · công tắc VI/EN · nút theme · nút **Chơi ngay**.

### 8.1 Hero
- H1 VI: **Game ngắn, một màn hình, không quảng cáo.** / EN: **Short games, one screen, no ads.**
- Phụ: Mở lên là chơi. Không tài khoản, không cài đặt, chạy cả khi mất mạng. Miễn phí để chơi. / *Open and play. No account, nothing to install, works offline. Free to play.*
- CTA chính **Chơi ngay** → `/`. CTA phụ (ghost) **Cho bé: Pop Play** → `/popplay/`; **Cho người lớn: Night Play** → `/cozyplay/`. / *Play now · For kids: Pop Play · For grown-ups: Night Play.*
- Hàng huy hiệu: ✓ Không quảng cáo · ✓ Không theo dõi cá nhân · ✓ Chạy offline · ✓ Miễn phí để chơi / *✓ No ads · ✓ No personal tracking · ✓ Works offline · ✓ Free to play*
- Hình: ảnh ghép 6–8 biểu tượng game (SVG/WebP), không video.

### 8.2 Hai thế giới (chọn nhanh)
Hai thẻ lớn (gradient cam cho Pop, tím tối cho Night, y như hub):
- **Pop Play · Cho bé và cả nhà.** 12 game ngắn học chữ, số, màu, nhịp; bố mẹ đặt giờ chơi và khoá màn hình. Nút **Vào Pop Play**. / *12 short games for letters, numbers, colours and rhythm; parents set play time and lock the screen. Button: Enter Pop Play.*
- **Night Play · Cho người lớn.** 20 game giải toả đậm chất Việt: deadline, lương cuối tháng, shipper, ổ gà. Nút **Vào Night Play**. / *20 relaxing games with a Vietnamese twist: deadlines, payday, delivery rides, potholes. Button: Enter Night Play.*

### 8.3 Lưới game đại diện
Tiêu đề: **Chọn một game, chơi liền** / *Pick a game, play instantly*. Hiển thị 12 game (6 Pop, 6 Night) dạng thẻ: emoji lớn (hoặc SVG icon thật nếu có) + tên VI/EN + một dòng mô tả; chạm mở `/cozyplay/#id` hoặc `/popplay/#id`. Nút **Xem tất cả game** → trang cổng. Danh sách đầy đủ ở mục 13.

### 8.4 Tính năng nổi bật (6 thẻ, icon + 1–2 câu)
1. ⚡ **Vào là chơi** / *Instant play*: không tài khoản, không tải về; thêm vào màn hình chính như ứng dụng. / *No account, no download; add to your home screen like an app.*
2. 📴 **Chạy cả khi mất mạng** / *Works offline*: mở một lần, lần sau chơi không cần Internet. / *Open once, play without Internet next time.*
3. 👥 **Chơi cùng lúc** / *Play together*: 2–4 game trên cùng một màn hình, dùng cho cả nhà hoặc bạn bè. / *2–4 games on one screen for family or friends.*
4. 🤝 **Chơi hộ và thách đấu** / *Play-for-me and challenges*: gửi link để bạn chơi tiếp ván dở của bạn, hoặc đấu cùng một ván với điểm của bạn. / *Send a link so a friend continues your round, or beats your score on the same round.*
5. ▶️ **Tiếp tục ván dở** / *Resume*: thoát giữa chừng, quay lại vẫn còn ván (giữ 7 ngày). / *Leave mid-round and pick up later (kept 7 days).*
6. 🏆 **Bảng xếp hạng tự nguyện** / *Voluntary leaderboard*: chỉ lên bảng khi bạn bấm "Khoe điểm". / *You appear only when you tap "Share score".*

### 8.5 Cách chơi 3 bước
1. **Mở** `nightplay.vn`, chạm biểu tượng game. / *Open nightplay.vn and tap a game icon.*
2. **Chọn** chế độ hoặc độ khó, bấm nút **Chơi** lớn. / *Pick a mode or difficulty and press the big Play button.*
3. **Chơi, rồi** khoe điểm, thách bạn hoặc thoát bằng nút ← (ván dở được giữ). / *Play, then share your score, challenge a friend, or leave with ← (your round is kept).*

### 8.6 Night Pass và bảng giá
Tiêu đề: **Night Pass: mở khoá mọi thứ, trả một lần, không tự gia hạn** / *Night Pass: unlock everything, pay once, no auto-renewal*.

Bảng giá (đọc từ `server/app.js` `PLANS` và `subscribe.html`; KHÔNG bịa; đơn vị VND, đã gồm thuế nếu có):
| Gói / Plan | Thời hạn / Duration | Giá / Price | Ghi chú / Note |
|---|---|---|---|
| 1 ngày / 1 day | 1 ngày | 9.000đ | Dùng thử, không cam kết |
| 1 tuần / 1 week | 7 ngày | 18.000đ | ≈ 72.000đ/tháng |
| 1 tháng / 1 month | 30 ngày | 36.000đ | **Phổ biến nhất**, "Rẻ hơn ly cà phê" |
| 1 năm / 1 year | 365 ngày | 199.000đ | ≈ 16.600đ/tháng, tiết kiệm nhất |

Quyền lợi (từ bảng so sánh ở `subscribe.html`): tất cả game kể cả game mới · chơi không giới hạn thời gian · hẹn giờ đi ngủ tự đặt · chế độ Vô tận, Thử thách ngày, Boss, 4 độ khó · chủ đề giao diện, thống kê, huy hiệu · vẫn không quảng cáo, không theo dõi cá nhân. Bản Free: số game và thời gian chơi mỗi ngày có giới hạn (đọc con số hiện hành ở `subscribe.html`, khoá `f1a`, `f2a`, không hard-code khác).

Chữ nhỏ bắt buộc: **Hiệu lực theo số ngày của gói, không tự gia hạn, hết hạn quay về Free. Thanh toán chuyển khoản VietQR. Xem Điều khoản.** CTA **Xem gói Night Pass** → `/subscribe.html`. Bảng giá nên được sinh lúc build từ một nguồn duy nhất (hoặc kiểm tay mỗi lần đổi giá) để không lệch.

### 8.7 Cam kết riêng tư và an toàn cho trẻ
Tiêu đề: **Nói thẳng về dữ liệu của bạn và của con** / *Plain words about your data and your child's*.
- Không quảng cáo, không cookie theo dõi, không bán dữ liệu. / *No ads, no tracking cookies, no data sales.*
- Chỉ đếm ẩn danh lượt mở và game được chơi; không lưu IP vào số liệu. / *Only anonymous counts of opens and games played; no IP in the statistics.*
- Pop Play: không tài khoản, không ô gõ tên, tên bảng xếp hạng do máy tự ghép (ví dụ "Mèo Vui 42"). / *Pop Play: no accounts, no name fields; leaderboard names are auto-generated (e.g. "Happy Cat 42").*
- Cổng phụ huynh (câu hỏi dành cho người lớn), giới hạn thời gian mỗi ngày do bố mẹ đặt, khoá màn hình khi bé chơi. / *Parental gate (an adult question), daily time limit set by parents, screen lock while the child plays.*
- Ảnh/video chia sẻ tạo ngay trên máy, không tải lên. Kết quả chơi hộ mã hoá đầu-cuối, xoá sau tối đa 24 giờ. / *Share images/videos are made on-device, never uploaded. Play-for-me results are end-to-end encrypted and deleted within 24 hours.*
Liên kết: **Đọc Chính sách bảo mật** → `/privacy.html`.

### 8.8 Câu hỏi thường gặp (dùng chung cho FAQPage JSON-LD)
1. **Chơi có mất tiền không?** — Chơi miễn phí, không cần tài khoản. Night Pass là gói tuỳ chọn mở thêm chế độ, giao diện, cấp độ và thời gian chơi. / *Is it free?* — Free to play, no account. Night Pass is an optional plan unlocking extra modes, skins, levels and play time.
2. **Cần cài ứng dụng không?** — Không. Mở trình duyệt, vào nightplay.vn. Có thể thêm vào màn hình chính. / *Do I need to install anything?* — No. Open nightplay.vn in your browser; you can add it to the home screen.
3. **Mất mạng có chơi được không?** — Được, sau khi bạn đã mở trang một lần có mạng. Các tính năng cần máy chủ (kiểm tra Night Pass, bảng xếp hạng, chơi hộ) thì cần mạng. / *Does it work offline?* — Yes, after one online visit. Server features (Night Pass check, leaderboard, play-for-me) need a connection.
4. **Có an toàn cho bé không?** — Pop Play không có tài khoản, quảng cáo hay ô gõ tên; bố mẹ đặt giờ chơi và khoá màn hình. Hãy luôn ngồi cùng bé khi bé còn nhỏ. / *Is it safe for my child?* — Pop Play has no accounts, ads or name fields; parents set time limits and lock the screen. Please stay with young children.
5. **Các bạn thu thập dữ liệu gì?** — Chỉ số liệu ẩn danh khi chơi; email chỉ khi mua Night Pass. Chi tiết ở Chính sách bảo mật. / *What data do you collect?* — Anonymous counts while playing; an email only if you buy Night Pass. See the Privacy Policy.
6. **Night Pass có tự gia hạn không?** — Không. Hết hạn bạn quay về bản Free; không tự động trừ tiền. / *Does Night Pass auto-renew?* — No. When it ends you return to Free; nothing is charged automatically.
7. **Dùng Night Pass trên mấy thiết bị?** — Tối đa 3 thiết bị mỗi gói; đổi máy thì khôi phục bằng email (mã OTP). / *How many devices?* — Up to 3 per plan; to move, restore with your email (OTP).
8. **Chơi hộ và thách đấu là gì?** — Chơi hộ: bạn của bạn chơi tiếp ván dở qua link. Thách đấu: gửi link để bạn đấu cùng ván. / *What are play-for-me and challenges?* — Play-for-me: a friend continues your round via a link. Challenge: a link lets a friend play the same round.
9. **Hoàn tiền thế nào?** — Xem mục hoàn tiền trong Điều khoản hoặc gửi email support@nightplay.vn. / *How do refunds work?* — See the refund section of the Terms or email support@nightplay.vn.

### 8.9 CTA cuối
**Sẵn sàng chơi một ván?** [Chơi ngay] · *Ready for a quick round?* [Play now]

### 8.10 Chân trang
Logo · Game (Pop Play, Night Play) · Night Pass · **Chính sách bảo mật** (`/privacy.html`) · **Điều khoản sử dụng** (`/terms.html`) · Liên hệ `support@nightplay.vn` · Thông tin chủ website lấy đúng từ `shared/site.js` (`operator`, `address`, `taxId`, `license`; còn `[CẦN ĐIỀN: ...]` thì CHƯA đưa lên production) · © năm Play Hub · công tắc VI/EN.

## 9. Meta copy
### 9.1 Description (140–160 ký tự)
- VI: `Play Hub: game ngắn một màn hình, không quảng cáo. Pop Play cho bé, Night Play cho người lớn. Chơi ngay trên trình duyệt, không cần cài đặt.` 
- EN: `Play Hub: short one-screen games with no ads. Pop Play for kids, Night Play for grown-ups. Play right in your browser, nothing to install.`
### 9.2 Ảnh chia sẻ
`og.png` 1200×630: logo + câu "Game ngắn, không quảng cáo" + 6 biểu tượng game. Tạo bằng puppeteer giống `scripts/cozygame/og.js`.

## 10. Hành vi giao diện
- Hover nút nâng 2px, nhấn thu 0.98 (tắt khi `prefers-reduced-motion`).
- Thanh trên thu gọn trên mobile: logo + nút **Chơi ngay** + nút menu; không gắn thêm thư viện menu.
- Các section xen kẽ nền `--bg` / `--card`; thẻ bo 22–28px, bóng `--shadow`.
- Nút CTA nổi cuối trang trên mobile (thanh dính dưới, 52px) chỉ hiện sau khi cuộn qua hero; không che chân trang.

## 11. Ảnh và asset cần chuẩn bị
| Asset | Kích thước | Định dạng | Ghi chú |
|---|---|---|---|
| `og.png` | 1200×630 | PNG ≤ 120 KB | chia sẻ MXH |
| `hero.webp` (+ `hero@2x`) | 640×480 / 1280×960 | WebP ≤ 60 KB | ảnh ghép game, `fetchpriority=high` |
| `game-*.svg` / `.webp` ×12 | 160×160 (hiển thị 80–120) | SVG hoặc WebP ≤ 8 KB | icon thật của game nếu có; không thì emoji |
| `phone-pop.webp`, `phone-night.webp` | 360×720 | WebP ≤ 50 KB | ảnh chụp điện thoại thật (tuỳ chọn) |
| `logo.svg` | vector | SVG | nửa cam nửa tím, chấm trắng |
| `favicon` | SVG data URI | | như hub |
| Icon PWA | 180/192/512 | PNG | có sẵn `shared/app-*.png`, `shared/pop-*.png` |
Chụp màn hình thật bằng puppeteer ở 390×844 (không dựng giả). Mọi ảnh có `width/height`; tổng ảnh trước khi cuộn < 120 KB.

## 12. Tiêu chí nghiệm thu (checklist)
- [ ] `landing/index.html` và `landing/en/index.html` mở được, chữ tĩnh đủ mọi section 8.1–8.10, VI và EN khớp nghĩa.
- [ ] Không tràn ngang và không lỗi console ở 320, 360, 390, 768, 1024, 1440 (sáng + tối); hero vừa một màn hình ở 360×640.
- [ ] Lighthouse mobile: Performance, Accessibility, Best Practices, SEO đều ≥ 90 (chụp báo cáo).
- [ ] Tổng truyền tải trang đầu < 300 KB; không request tới tên miền ngoài (kiểm tab Network).
- [ ] Không cookie (`document.cookie` rỗng); chỉ `localStorage` `theme`/`lang`; chỉ gọi `/api/t`.
- [ ] Nút/liên kết ≥ 44px; tương phản AA; điều hướng bàn phím được, FAQ bằng phím; `prefers-reduced-motion` ổn.
- [ ] Giá và quyền lợi khớp `PLANS` và `subscribe.html` (đối chiếu từng số).
- [ ] 20 game Cozy + 12 game Pop khớp `shared/multi-games.js`; liên kết game mở đúng `#id`.
- [ ] `<title>`, description, canonical, hreflang, OG/Twitter, JSON-LD (Organization, WebSite, VideoGame×2, FAQPage) hợp lệ (Rich Results Test, Schema validator); `sitemap.xml`, `robots.txt` truy cập được.
- [ ] Liên kết `privacy.html`, `terms.html`, `mailto:support@nightplay.vn` đúng; không còn email cũ.
- [ ] Không tuyên bố vượt thực tế (mục 2 "Tránh").
- [ ] Hub `/` và các trang game KHÔNG đổi; chạy `node scripts/cozygame/check.js` vẫn "✓ tất cả đạt".

## 13. Danh sách game thật (từ `shared/multi-games.js`)
**Night Play / Cozy (20)**, đường dẫn `/cozyplay/#id`:
| id | VI | EN |
|---|---|---|
| cozy-wings | 🐝 Cánh Nhỏ Phiêu Lưu | Little Wings |
| dap-deadline | ⏰ Đập Deadline | Smash Deadline |
| gia-cho-viet | 🛒 Đoán Giá Chợ Việt | Guess the Market Price |
| xin-nghi | 📝 Sếp Ơi Em Xin Nghỉ | Boss, I Need a Day Off |
| doi-doi-2048 | 🪜 Đổi Đời 2048 | Life Upgrade 2048 |
| ga-me-ban-trung | 🐔 Gà Mẹ Bắn Trứng | Mama Hen's Egg Pop |
| ban-co-hieu-toi | 💞 Bạn Có Hiểu Tôi Không? | Do You Really Know Me? |
| cho-hang-kieu-viet | 🛵 Chở Hàng Kiểu Việt | Overloaded Rider |
| xe-ca-phe | ☕ Xe Cà Phê Của Tôi | My Coffee Cart |
| duong-ray | 🚆 Đường Ray | Rail Rush |
| xay-cau-tre | 🎋 Xây Cầu Tre | Bamboo Bridge |
| song-sot-cuoi-thang | 💸 Sống Sót Đến Cuối Tháng | Survive to Payday |
| shipper-sieu-toc | 📦 Shipper Siêu Tốc | Speedy Shipper |
| ne-o-ga | 🌧️ Né Ổ Gà Mùa Mưa | Dodge the Potholes |
| noi-mot-net | 🔗 Nối Một Nét | One Line Link |
| mat-tinh-khong | 👁️ Mắt Tinh Không? | Sharp Eyes? |
| cat-banh-chung | 🔪 Cắt Bánh Chưng | Slice It Even |
| ve-mot-net | ✏️ Vẽ Một Nét | One Stroke |
| bao-nhieu-giay | ⏱️ Bao Nhiêu Giây? | How Many Seconds? |
| me-cung-truyen-tay | 🌀 Mê Cung Truyền Tay | Maze Pass-Along |

**Pop Play (12)**, đường dẫn `/popplay/#id`:
| id | VI | EN |
|---|---|---|
| ten-lua-cua-be | 🚀 Tên Lửa Của Bé | Baby Rocket |
| be-noi-dung-khong | 🎤 Bé Nói Đúng Không? | Did Baby Say It Right? |
| doan-tuoi-nao | 🧠 Đoán Xem Bé Mấy Tuổi | Guess Baby's Brain Age |
| bo-me-5-giay | 🖐️ Bố Mẹ Thử Thách 5 Giây | Parents' 5-Second Challenge |
| con-vat-an-so | 🐊 Con Vật Ăn Số | Number Munchers |
| ve-chu-quai-vat | 🔤 Vẽ Chữ Thành Quái Vật | Letter Monsters |
| nhay-theo-so | 💃 Nhảy Theo Số | Dance by Numbers |
| be-dau-bo-me | ⚔️ Bé Đấu Bố Mẹ | Kid vs Parent |
| qua-song | ⛵ Qua Sông Cùng Bé | River Crossing |
| thap-vong-mau | 🌈 Tháp Vòng Màu | Rainbow Rings |
| lang-cua-be | 🏘️ Làng Của Bé | Baby's Village |
| pop-fly | 🐦 Chim Bay Học Vui | Fly & Learn |

Gợi ý 12 game cho lưới đại diện: Pop: pop-fly, con-vat-an-so, ve-chu-quai-vat, nhay-theo-so, lang-cua-be, qua-song. Night: dap-deadline, song-sot-cuoi-thang, gia-cho-viet, xin-nghi, shipper-sieu-toc, cozy-wings. (Mô tả một dòng: lấy từ khoá `why` trong `shared/multi-games.js`, rút gọn; không bịa luật chơi.)

## 14. Nguồn sự thật trong repo
- Giá, gói: `server/app.js` (`PLANS`), `subscribe.html` (bảng i18n).
- Game: `shared/multi-games.js`, `GAME_RULES.md`.
- Màu, theme: `shared/theme.css`; mẫu giao diện hub: `index.html`; mẫu trang chữ dài: `privacy.html` (theme + lang boot script).
- Liên hệ, chủ site: `shared/site.js`. Riêng tư/điều khoản: `privacy.html`, `terms.html`.
- Triển khai: `DEPLOY-CLOUDFLARE.md`, `scripts/build.js`, `wrangler.jsonc`.

## 15. PROMPT mẫu để dán cho AI sinh code
```
Bạn là lập trình viên front-end. Hãy tạo trang landing tĩnh cho Play Hub (https://nightplay.vn)
theo ĐÚNG tài liệu docs/LANDING-PAGE-BRIEF.md (đính kèm toàn văn). Yêu cầu:
1. Tạo landing/index.html (VI), landing/en/index.html (EN), landing/lp/landing.css,
   landing/lp/landing.js, landing/sitemap.xml, landing/robots.txt. Không framework, không bundler,
   không thư viện/phông/script ngoài, không cookie.
2. Dùng chính xác chữ VI/EN ở mục 8 và danh sách game ở mục 13; giá lấy từ bảng ở mục 8.6 (đối chiếu
   server/app.js PLANS và subscribe.html), không bịa số liệu hay tuyên bố ngoài mục 2.
3. Màu/biến lấy từ shared/theme.css (liên kết ../../shared/theme.css), hỗ trợ sáng/tối (localStorage "theme",
   mặc định theo prefers-color-scheme), responsive 320-1440, hero vừa một màn hình ở 360x640, nút >= 44px,
   tương phản AA, <details> cho FAQ, prefers-reduced-motion.
4. SEO: title, description, canonical, hreflang vi/en/x-default, Open Graph + Twitter card, JSON-LD
   (Organization, WebSite, VideoGame x2, FAQPage) khớp mục 6.
5. Đo lường: chỉ shared/track.js -> Track.view("home"); không thêm gì khác.
6. Không sửa index.html hub, sw.js, các trang game. Báo các việc tích hợp cần làm tay (scripts/build.js).
7. Cuối cùng tự chạy Lighthouse mobile (>= 90 cả bốn mục), chụp ảnh 390x844 và 1440x900 sáng + tối,
   tự nhìn và liệt kê từng mục checklist nghiệm thu (mục 12) đạt/chưa đạt.
```

## Cập nhật thiết kế (đợt "đậm chất Night Pass")
- Hero căn từ TRÊN (không dùng min-height:100svh ở điện thoại), cách h1 <= 64px dưới thanh trên; CTA chính + hai THẺ LỐI VÀO (Pop Play cam #FF5A1F, Night Play tím #7C5CFF; bằng nhau, một dòng, cao >= 56px) nằm trọn màn đầu ở 360x640. Máy tính >= 900px có khung điện thoại CSS thuần bên phải.
- Bảng giá Night Pass đổi thành 4 THẺ GIÁ (`ul.plans`): 1 cột <600px, 2 cột >=600px, 4 cột >=1000px; thẻ "Phổ biến nhất" (1 tháng) viền/phát sáng tím, nhãn một dòng. Không còn bảng/khối cuộn ngang nào trên landing.
- Giao diện tối kiểu đêm (nền #12141F -> tím sâu, sao CSS tĩnh, thẻ kính mờ, CTA gradient tím-cam, vương miện ở mục Night Pass). Mặc định vẫn theo prefers-color-scheme / theme đã lưu (không ép tối) -- LỆCH brief "mặc định tối" vì trình duyệt không phân biệt "không chọn" với "sáng".
- Nút "Chơi tiếp" cho người đã chơi (chỉ đọc np-resume:*, np-hi-*, np-rails-played, xx-save), đổi chữ trước khi vẽ; HTML tĩnh vẫn "Chơi ngay".
- Đổi ngôn ngữ giữ vị trí cuộn + câu FAQ đang mở (sessionStorage tạm "np-lsw", hai bản cùng thứ tự `main > section`), giữ ?landing=1. Không dùng cách fetch thay <main> (giữ 2 trang tĩnh cho SEO).
- Liên kết từ app về landing: `/?landing=1` và `/en/?landing=1` (script chuyển hướng PWA bỏ qua tham số này; canonical/sitemap không chứa tham số).

## Tài sản ảnh và mục phụ huynh (đợt mockup + khoá trẻ em)
- Ảnh chụp màn hình THẬT (390x844, DSF 1.5, WebP <= 45KB/ảnh) trong `landing/lp/img/shots/`: `hero-cafe|nghi|wings.webp` (3 máy ở hero, >= 900px; ảnh giữa `fetchpriority=high`, hai ảnh bên lazy) và `parent-settings|timeup.webp` (mục phụ huynh). Tạo lại bằng `node scripts/cozygame/shots-landing.js`. Khung máy (viền titan, dynamic island, thanh trạng thái, nút bên, phản chiếu kính) dựng bằng CSS (`.dev`); chip nổi `.fchip` trôi nhẹ, tắt khi `prefers-reduced-motion`.
- LỆCH brief: ảnh hero là màn chọn của game (skin mặc định, tối), chưa chụp skin Night Pass riêng; dưới 900px ẩn các máy để CTA + thẻ lối vào luôn nằm trong màn đầu (không có bản "1 máy" cho điện thoại).
- Mục `#phuhuynh` (ngay sau "Chọn thế giới", có trong menu neo, VI + EN): chỉ nêu tính năng có thật trong `popplay/index.html` + `shared/kidlock.js` + `shared/parentgate.js` (hẹn giờ 15-120 phút/ngày, khoá màn hình chơi, bật/tắt game, cổng giữ nút 3 giây + câu hỏi người lớn). Các tính năng này MIỄN PHÍ (không bị khoá bởi Night Pass). Có thêm huy hiệu ở hero, thẻ tính năng, câu FAQ + JSON-LD (10 câu).
