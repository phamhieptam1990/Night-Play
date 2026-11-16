-- Mã sự kiện 6 số: admin tích giao diện của từng game + chọn ngày bắt đầu/kết thúc; người chơi nhập mã để dùng các giao diện đó
-- trong khoảng thời gian của sự kiện (không cần Night Pass, không mở chế độ trả phí khác).
-- Lưu ý rollout: chạy migration này TRƯỚC khi deploy mã mới. Nếu chưa chạy, các API mã sự kiện trả "migration_required"
-- (không ảnh hưởng phần còn lại của web).

CREATE TABLE IF NOT EXISTS event_codes (
  id         bigserial   PRIMARY KEY,
  code       text        NOT NULL UNIQUE CHECK (code ~ '^[0-9]{6}$'),
  name       text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  skins      jsonb       NOT NULL,                       -- {"<game>": ["<skin>", ...]}
  starts_at  timestamptz NOT NULL,
  ends_at    timestamptz NOT NULL,
  max_uses   integer     NOT NULL DEFAULT 100 CHECK (max_uses BETWEEN 1 AND 1000000),
  uses       integer     NOT NULL DEFAULT 0,
  revoked    boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

-- Mỗi thiết bị (mã ngẫu nhiên do trình duyệt tạo, đã băm) chỉ tính một lượt cho mỗi mã.
CREATE TABLE IF NOT EXISTS event_redemptions (
  code_id bigint      NOT NULL REFERENCES event_codes(id) ON DELETE CASCADE,
  did     text        NOT NULL,
  at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (code_id, did)
);
