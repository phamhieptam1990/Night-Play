# Triển khai lên Cloudflare (Workers + file tĩnh) — thay cho Netlify

Kiến trúc: `dist/` (file tĩnh, băng thông không giới hạn) + Worker `worker/index.js` chỉ nhận `/api/*` và gọi lại `server/app.js` (dùng chung với Netlify / `server/server.js`). Dữ liệu vẫn ở Neon.

## Cấu hình trên Cloudflare (Workers & Pages → Create → Import a repository)
- Repo: `phamhieptam1990/Night-Play`, nhánh `main`. Tên Worker: `night-play` (trùng `wrangler.jsonc`).
- Build command: `npm run build` · Deploy command: `npx wrangler deploy`
- **Build variables** (Settings → Build → Variables): `NODE_VERSION=20` (hoặc mới hơn); nếu site này chỉ là bản công khai (admin ở site khác) thêm `SITE_TARGET=hub`.
- **Variables and Secrets** (Settings → Variables and Secrets, loại *Secret*): sao chép từ Netlify:
  `DATABASE_URL` (endpoint *pooled* của Neon), `TOKEN_SECRET` (≥32 ký tự, GIỮ NGUYÊN giá trị cũ để token Night Pass đang dùng không mất hiệu lực), `SEPAY_API_KEY`, `BANK_BIN`, `BANK_ACCOUNT`, `BANK_ACCOUNT_NAME`, `BANK_NAME`, `ORDER_TTL_MIN`, `ADMIN_KEY` (≥16 ký tự) và mọi biến khác đang đặt ở Netlify (ví dụ gửi email OTP).
  KHÔNG đặt `DEV_RELOAD`.
- Không bật "Protect with Cloudflare Access" nếu muốn mở công khai.

## Sau khi deploy thử xong (địa chỉ `night-play.<tài-khoản>.workers.dev`)
1. Mở trang, mở một game, thử bảng điểm (`/api/scores?game=bao-nhieu-giay&period=all`), tạo đơn Night Pass số tiền nhỏ, khôi phục gói bằng OTP.
2. Settings → Domains & Routes → thêm tên miền (tên miền phải dùng DNS của Cloudflare hoặc thêm CNAME theo hướng dẫn).
3. SePay: nếu đổi tên miền thì sửa URL webhook thành `https://<tên miền>/api/webhook/sepay` (header `Authorization: Apikey <SEPAY_API_KEY>`).
4. Giữ Netlify làm dự phòng 1–2 ngày rồi mới tắt.

## Ghi chú kỹ thuật
- `server/db.js` tự nhận biết Workers: câu lệnh đơn dùng driver HTTP của Neon (không giữ kết nối), transaction dùng WebSocket Pool tạo riêng cho từng lần gọi rồi đóng. Trên Node/Netlify vẫn dùng `pg` như cũ.
- `wrangler.jsonc`: `run_worker_first: ["/api/*"]` → chỉ API tốn hạn mức Worker; file tĩnh phục vụ thẳng. `dist/_headers` do `scripts/build.js` ghi (noindex cho /admin/*, `no-cache` cho /sw.js).
- Cổng mã truy cập (`netlify/edge-functions/gate.mjs`) KHÔNG chạy trên Cloudflare; dùng Cloudflare Access nếu cần chặn tạm.
- Chạy thử cục bộ: tạo `.dev.vars` (đã gitignore) từ `server/.env.development`, rồi `npx wrangler dev --local` (cần Node ≥ 20).
- Kích thước Worker ~1,1MB (gzip ~240KB), dưới giới hạn gói miễn phí.

## Trang admin và trang game
- **Cách A (mặc định, đơn giản):** một Worker `night-play`, build `SITE_TARGET=all` (không đặt biến) → trang game ở `/`, admin ở `/admin/` (cần `ADMIN_KEY`; `dist/_headers` đã `noindex`+`no-store`). Có thể thêm Cloudflare Access cho `/admin/*`.
- **Cách B (tách tên miền):** project Worker thứ hai trỏ cùng repo, Build variable `SITE_TARGET=admin`, Deploy command `npx wrangler deploy -c wrangler.admin.jsonc` (Worker `night-play-admin`); project chính đặt `SITE_TARGET=hub`. Nhập lại các biến môi trường cho project admin (dùng chung database).

## Biến môi trường biến mất sau khi deploy?
- `wrangler deploy` mặc định xoá các biến kiểu **Text** đặt trên dashboard nếu chúng không có trong `wrangler.jsonc`. Đã thêm `"keep_vars": true` để giữ lại.
- Biến nhạy cảm (`DATABASE_URL`, `TOKEN_SECRET`, `SEPAY_API_KEY`, `ADMIN_KEY`…) nên tạo loại **Secret** (không bị xoá khi deploy, giá trị luôn ẩn, chỉ thấy tên).
- Có hai nơi khác nhau: **Settings → Variables and Secrets** (biến chạy khi có request, cần cho `/api`) và **Settings → Build → Variables and secrets** (chỉ dùng lúc build, ví dụ `NODE_VERSION`, `SITE_TARGET`). Biến của `/api` phải nằm ở nơi thứ nhất.

## Lỗi "đã mua Night Pass nhưng vẫn còn ổ khoá" (đã gặp)
- Nguyên nhân: wrangler mặc định `keep_names` chèn `__name(...)` vào mọi hàm. Mã Night Pass (`server/pro/*.js`) được gửi cho trình duyệt bằng `main.toString()`, nên trình duyệt báo `__name is not defined`, game im lặng giữ khoá. Netlify không bị vì không dùng keep_names.
- Đã sửa bằng `"keep_names": false` trong `wrangler.jsonc` / `wrangler.admin.jsonc`. TRƯỚC KHI deploy chạy `node scripts/check-worker-bundle.js` (phải in ✓).
- Người chơi tự kiểm tra bằng trang `/passcheck`.

## Email OTP khôi phục gói (/api/restore)
- Trước đây `sendMail` chỉ là khung rỗng nên không có thư nào được gửi. Nay gửi qua API HTTP của **Brevo** hoặc **Resend** (chạy được trên Cloudflare Workers).
- **Brevo (không cần tên miền):** đăng ký brevo.com (gói miễn phí ~300 thư/ngày) → Senders, Domains & Dedicated IPs → Senders → thêm và **xác minh** một địa chỉ email gửi → SMTP & API → API Keys → tạo khoá.
- **Resend:** cần xác minh tên miền gửi thư mới gửi được cho người khác.
- Đặt trong Worker (Settings → Variables and Secrets, loại **Secret**): `BREVO_API_KEY` (hoặc `RESEND_API_KEY`), `MAIL_FROM` (địa chỉ đã xác minh), tuỳ chọn `MAIL_FROM_NAME`.
- Gmail cá nhân làm người gửi thường vào Spam; có tên miền riêng thì thiết lập SPF/DKIM theo nhà cung cấp để thư vào hộp thư chính.
- `/api/restore` luôn trả 200 để không lộ email nào đã mua; lỗi gửi chỉ ghi vào log Worker (Observability), không hiện cho người dùng.

## Bảo vệ chia sẻ Night Pass (token gắn thiết bị)
**Cách hoạt động**
- Trình duyệt tạo một cặp khoá ECDSA P-256 *không xuất được* (lưu trong IndexedDB, `shared/device.js`). Khoá riêng không rời khỏi máy.
- Token Night Pass có thêm trường `k` (vân tay khoá công khai). Mỗi request tới `/api/pass*` và `/api/pro/*` phải kèm `X-Device-Sig` = chữ ký trên `ts|METHOD|pathname` (lệch giờ ≤ 120 giây; máy lệch giờ tự chỉnh theo giờ máy chủ). **Chép nguyên token sang máy khác không dùng được** vì máy kia không có khoá riêng.
- Mỗi gói tối đa `MAX_DEVICES` (mặc định 3) thiết bị; thiết bị thứ 4 vào thì thiết bị dùng lâu nhất bị thu hồi. Trang `/passcheck` có nút **Đăng xuất các thiết bị khác**.
- Mỗi đơn chỉ được MỘT thiết bị nhận token (kid đầu tiên). Thiết bị khác phải **khôi phục bằng email (OTP)** — nên cần cấu hình gửi email (mục "Email OTP") trước khi bật bảo vệ.
- Khi mất mạng, chỉ máy đã được máy chủ xác nhận mới dùng được mã Night Pass lưu sẵn.

**Thứ tự triển khai (QUAN TRỌNG)**
1. Chạy migration `server/db/migrations/006_devices.sql` trên database SẢN XUẤT **trước** khi deploy (`node server/db/migrate.js production --yes`). Nếu deploy trước, mã tự lùi về chế độ cũ (không chặn gì, không lỗi) cho tới khi có bảng.
2. (Tuỳ chọn) đặt `MAX_DEVICES`, `LEGACY_TOKEN_UNTIL` (Variables and Secrets).
3. `node scripts/check-worker-bundle.js`, rồi deploy.
4. Người dùng đang có gói (token cũ) được **tự nâng cấp** lên token gắn thiết bị khi mở web (`POST /api/pass/upgrade`), trong thời gian ân hạn đến `LEGACY_TOKEN_UNTIL` (mặc định 2026-11-17). Sau mốc đó token cũ không còn dùng được: người dùng khôi phục bằng email.
5. Kiểm thử: `node scripts/devtest/fakeapi.js 8795 & node scripts/devtest/fakeapi.js 8796 2020-01-01T00:00:00Z &` rồi `node scripts/devtest/devtest.js` (DB giả trong bộ nhớ).

**Giới hạn còn lại (nói thẳng)**
- Chia sẻ qua điều khiển từ xa / chia sẻ màn hình / cho mượn máy: không chặn được.
- Người dùng dùng chung email và đọc được hộp thư vẫn khôi phục được tối đa MAX_DEVICES thiết bị cùng lúc.
- Ai kiểm soát một thiết bị đã đăng ký (kể cả mã độc trên máy đó) dùng được khoá của máy đó; khoá không xuất được nhưng vẫn ký được.
- Chữ ký chỉ chống phát lại trong 120 giây; HTTPS bảo vệ trên đường truyền.
- Xoá dữ liệu trang (IndexedDB) = mất khoá thiết bị → phải khôi phục bằng email (và chiếm thêm một chỗ thiết bị cho tới khi thiết bị cũ bị đẩy ra).

## Tên miền riêng `nightplay.vn` + email (`support@`, `noreply@`)
Thứ tự làm (bước 1–3 bạn làm trên trang web của nhà đăng ký/Cloudflare/Resend; tôi không có quyền vào các tài khoản đó):
1. **Đưa tên miền về Cloudflare:** Cloudflare → Add a domain → `nightplay.vn` (gói Free) → chép 2 nameserver Cloudflare đưa vào trang quản lý tên miền ở nhà đăng ký (thay nameserver cũ). Chờ trạng thái "Active".
2. **Nhận thư `support@`:** Cloudflare → Email → Email Routing → bật, tạo địa chỉ `support@nightplay.vn` chuyển về Gmail của bạn (xác minh Gmail đích); thêm `admin@` tương tự. Cloudflare tự thêm bản ghi MX/SPF cần thiết (chấp nhận khi được hỏi).
3. **Gửi OTP bằng Resend:** resend.com → Domains → Add `nightplay.vn` → thêm các bản ghi DNS Resend đưa (DKIM TXT, SPF, MX bounce `send.`) vào Cloudflare DNS (DNS only, không proxy) → Verify. Thêm bản ghi DMARC: TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:admin@nightplay.vn`. Tạo API key (quyền gửi thư).
4. **Biến môi trường trên Worker** (Settings → Variables and Secrets): `RESEND_API_KEY` (Secret), `MAIL_FROM=noreply@nightplay.vn`, `MAIL_FROM_NAME=Night Play`, `MAIL_REPLY_TO=support@nightplay.vn`. Muốn bỏ Apps Script thì xoá `GAS_MAIL_URL`/`GAS_MAIL_SECRET` (nếu còn, Apps Script được ưu tiên dùng trước).
5. **Gắn tên miền vào Worker:** Workers & Pages → `night-play` → Settings → Domains & Routes → Add → Custom domain `nightplay.vn` (và `www.nightplay.vn` chuyển hướng về `nightplay.vn`). Sau đó cập nhật **SePay webhook** thành `https://nightplay.vn/api/sepay-webhook` (đường dẫn như đang dùng) và kiểm tra `/passcheck`.
6. **Đổi email liên hệ công khai** từ Gmail cá nhân sang `support@nightplay.vn` (shared/site.js, index.html, subscribe.html, popplay/index.html, cozyplay/index.html, privacy.html) — CHỈ làm sau khi bước 2 chạy (gửi thử thư tới `support@` thấy về Gmail).
Kiểm tra mail không vào spam: gửi thử OTP tới Gmail + một hộp thư khác, xem "Show original" có SPF/DKIM/DMARC = PASS.

## Cấu trúc trang: `/` là landing, hub ở `/play/`
- `https://nightplay.vn/` = landing (VI), `/en/` = landing EN, `/play/` = hub hai thẻ Pop Play / Night Play (PWA `start_url`). Nguồn landing ở `landing/` (build copy lên gốc `dist/`, tài nguyên ở `/lp/`).
- `/gioi-thieu/` và `/gioi-thieu/en/` chuyển 301 về `/` và `/en/` (`dist/_redirects` do `scripts/build.js` ghi; `run_worker_first` vẫn chỉ `/api/*`, redirect của assets chạy ở lớp file tĩnh).
- Sau deploy: purge cache Cloudflare cho `/`, `/index.html`, `/sw.js`, `/manifest.webmanifest`; gửi lại sitemap trong Search Console (đổi trang chủ, hreflang, canonical); người đã cài PWA nên gỡ và cài lại để nhận `start_url` mới (bản cũ vẫn mở được: `/` tự chuyển sang `/play/` khi chạy ở chế độ ứng dụng).

## PDF pháp lý (Chính sách bảo mật, Điều khoản)
- 4 file `legal/privacy-vi.pdf`, `legal/privacy-en.pdf`, `legal/terms-vi.pdf`, `legal/terms-en.pdf` + `legal/pdf-info.js` (dung lượng/ngày hiện trên nút "Tải PDF") được **commit sẵn vào repo** vì Cloudflare build không có Chrome. `scripts/build.js` chỉ copy thư mục `legal/` ra `dist/`.
- **Khi sửa nội dung pháp lý** (`privacy.html`, `terms.html`, `shared/site.js`): chạy lại `NODE_PATH=<thư mục có puppeteer-core và pdfjs-dist> node scripts/build-legal-pdf.js` (cài tạm: `npm i --no-save pdfjs-dist@3.11.174`), rồi `node scripts/cozygame/check-legalpdf.js`, rồi commit 4 PDF + `legal/pdf-info.js`. Có số xác nhận Bộ Công Thương thì điền `license` trong `shared/site.js` trước khi dựng lại.
- Không ghi chữ số nào của số định danh/CCCD vào file công khai, kể cả dạng che (`check-legal.js` quét); số thật chỉ nhập vào hồ sơ đăng ký Bộ Công Thương.
- Sitemap/robots: không chặn `/legal/` (robots hiện không chặn); thêm các URL PDF vào `landing/sitemap.xml` nếu muốn lập chỉ mục.
