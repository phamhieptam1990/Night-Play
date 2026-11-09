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
