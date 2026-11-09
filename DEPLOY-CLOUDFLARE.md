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
