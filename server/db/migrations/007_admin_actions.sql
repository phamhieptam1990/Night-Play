-- Nhật ký thao tác thủ công của admin trên Night Pass (cấp thêm ngày, thu hồi, xoá thiết bị, đổi email).
-- Mỗi dòng được ghi TRONG CÙNG transaction với thay đổi, nên có thay đổi thì chắc chắn có log.
-- Lưu ý rollout: chạy migration này TRƯỚC khi deploy mã mới. Mã mới tự lùi về chế độ chỉ xem nếu bảng chưa có
-- (các thao tác ghi trả lỗi "migration_required", không làm hỏng trang).
-- Không có khoá ngoại tới users: log phải còn nguyên kể cả khi user bị xoá. before/after chỉ chứa thông tin cần đối soát
-- (hạn pass, gói, email, rút gọn mã thiết bị); không chứa khoá, token hay mã OTP. ip_hash là băm theo ngày (không đảo ngược được).

CREATE TABLE IF NOT EXISTS admin_actions (
  id       bigserial   PRIMARY KEY,
  at       timestamptz NOT NULL DEFAULT now(),
  user_id  uuid        NOT NULL,
  action   text        NOT NULL CHECK (action IN ('grant','revoke','devices_delete','email_change')),
  reason   text        NOT NULL CHECK (char_length(reason) >= 3),
  before   jsonb,
  after    jsonb,
  ip_hash  text
);
CREATE INDEX IF NOT EXISTS admin_actions_user_idx ON admin_actions (user_id, at DESC);
CREATE INDEX IF NOT EXISTS admin_actions_at_idx   ON admin_actions (at DESC);
