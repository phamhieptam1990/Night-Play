-- Chặn chia sẻ Night Pass: token gắn với KHOÁ THIẾT BỊ (ECDSA P-256, khoá riêng nằm trong trình duyệt, không xuất được).
-- Mỗi gói có tối đa MAX_DEVICES thiết bị (mặc định 3); thiết bị mới vào thì thiết bị last_seen cũ nhất bị thu hồi.
-- Lưu ý rollout: chạy migration này TRƯỚC khi deploy mã mới (mã mới tự lùi về chế độ cũ nếu bảng chưa có, nhưng chưa chặn được gì).

CREATE TABLE IF NOT EXISTS pass_devices (
  user_id    uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kid        text        NOT NULL,                 -- thumbprint SHA-256 của public JWK
  jwk        jsonb       NOT NULL,                 -- public key (không có thông tin bí mật)
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kid)
);
CREATE INDEX IF NOT EXISTS pass_devices_seen_idx ON pass_devices (user_id, last_seen DESC);

-- Đơn chỉ được "nhận token" bởi MỘT thiết bị (kid đầu tiên); thiết bị khác phải khôi phục bằng email (OTP).
-- Nhờ vậy đường dẫn/ID đơn hàng bị chia sẻ cũng không đổi được thành gói trên máy khác.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS claim_kid text;
