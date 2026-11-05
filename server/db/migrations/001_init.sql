-- Night Play – schema ban đầu
-- Người dùng tách khỏi email: một user có nhiều identity (email, google, facebook, zalo).

CREATE TABLE users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE identities (
  id             bigserial PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider       text NOT NULL CHECK (provider IN ('email','google','facebook','zalo')),
  provider_uid   text NOT NULL,              -- email: địa chỉ đã chuẩn hóa; còn lại: sub/id của nhà cung cấp
  email          text,                       -- có thể NULL (Zalo không trả email, Facebook có thể không)
  email_verified boolean NOT NULL DEFAULT false,
  name           text,
  avatar         text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_uid)
);
CREATE INDEX identities_user_idx ON identities (user_id);
-- Chỉ dùng để tra cứu/liên kết khi email đã xác thực
CREATE INDEX identities_verified_email_idx ON identities (lower(email)) WHERE email_verified;

CREATE TABLE orders (
  id         text PRIMARY KEY CHECK (id ~ '^[a-f0-9]{32}$'),
  code       text NOT NULL UNIQUE,           -- mã nội dung chuyển khoản (NP........)
  user_id    uuid NOT NULL REFERENCES users(id),
  email      text NOT NULL,                  -- ảnh chụp email lúc đặt đơn
  plan       text NOT NULL CHECK (plan IN ('day','week','month','year')),
  amount     integer NOT NULL CHECK (amount > 0),
  method     text NOT NULL DEFAULT 'bank',
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  paid_at    timestamptz,
  exp        timestamptz,                    -- hạn pass sau khi đơn này được cấp
  tx_id      text
);
CREATE INDEX orders_user_idx ON orders (user_id);
CREATE INDEX orders_pending_idx ON orders (expires_at) WHERE status = 'pending';

-- Giao dịch webhook: PK theo id của SePay => chống xử lý trùng ngay ở DB
CREATE TABLE txs (
  id         text PRIMARY KEY,
  at         timestamptz NOT NULL DEFAULT now(),
  amount     bigint NOT NULL,
  content    text,
  account    text,                           -- tài khoản nhận (để đối chiếu)
  order_id   text REFERENCES orders(id),
  result     text NOT NULL CHECK (result IN ('granted','underpaid','unmatched','wrong_account')),
  raw        jsonb
);
CREATE INDEX txs_order_idx ON txs (order_id);
CREATE INDEX txs_review_idx ON txs (at DESC) WHERE result <> 'granted';   -- giao dịch cần xử lý tay

ALTER TABLE orders ADD CONSTRAINT orders_tx_fk FOREIGN KEY (tx_id) REFERENCES txs(id);

-- Quyền đang có: nguồn sự thật (cho phép thu hồi/hoàn tiền)
CREATE TABLE passes (
  user_id    uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  exp        timestamptz NOT NULL,
  plan       text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- OTP khôi phục theo email
CREATE TABLE otps (
  email      text PRIMARY KEY,
  hash       text NOT NULL,
  exp        timestamptz NOT NULL,
  tries      integer NOT NULL DEFAULT 0
);

-- Rate limit theo cửa sổ cố định (thay cho Map trong RAM, dùng được khi serverless)
CREATE TABLE rate_limits (
  key    text NOT NULL,
  bucket bigint NOT NULL,                    -- floor(epoch_ms / window_ms)
  count  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (key, bucket)
);
