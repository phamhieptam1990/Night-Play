-- Học Vui Plus (sản phẩm riêng, tách khỏi Night Pass của game). Xem docs/LEARN-FREE-VS-PLUS.md.
-- QUYẾT ĐỊNH: gói Plus nằm ở bảng RIÊNG learn_passes (không đổi khoá chính của `passes`) để Night Pass của game không bị ảnh hưởng và không phải sửa các truy vấn admin.
-- Khác với mô tả ban đầu "cột product ở passes": kết quả giống nhau (mỗi user có tối đa một gói game + một gói Plus), rủi ro thấp hơn.
-- Rollout: chạy migration này TRƯỚC khi bật LEARN_PLUS=on. Mã game cũ không đọc bảng/cột mới nên deploy trước hay sau đều không hỏng Night Pass.

-- đơn hàng: biết đơn thuộc sản phẩm nào; gói Plus có id 'learn_*'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product text NOT NULL DEFAULT 'game';
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_plan_check;
ALTER TABLE orders ADD CONSTRAINT orders_plan_check CHECK (plan IN ('day','week','month','year','learn_month','learn_quarter','learn_year','learn_test'));
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_check;
ALTER TABLE orders ADD CONSTRAINT orders_product_check CHECK (product IN ('game','learn'));

-- quyền Plus đang có (nguồn sự thật; thu hồi bằng cách đặt exp = now())
CREATE TABLE IF NOT EXISTS learn_passes (
  user_id    uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  exp        timestamptz NOT NULL,
  plan       text NOT NULL,                 -- 'learn_month' | 'learn_quarter' | 'learn_year' | 'trial' | 'admin'
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- dùng thử 7 ngày: mỗi tài khoản (email) một lần
CREATE TABLE IF NOT EXISTS learn_trials (
  user_id    uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now()
);

-- AI luyện cùng: cache lời gợi ý/giải thích theo (băm nội dung câu hỏi + chế độ + mã lỗi + bước + ngôn ngữ). KHÔNG có thông tin của bé.
CREATE TABLE IF NOT EXISTS learn_coach_cache (
  key        text PRIMARY KEY,
  data       jsonb NOT NULL,                -- { event, emotion, steps[], text } đã qua bộ lọc
  hits       integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- hạn mức gọi AI mỗi ngày mỗi tài khoản (chỉ đếm lượt gọi thật tới nhà cung cấp, không đếm lượt trúng cache)
CREATE TABLE IF NOT EXISTS learn_coach_usage (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day     date NOT NULL,
  n       integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
