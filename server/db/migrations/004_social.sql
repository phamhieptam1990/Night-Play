-- Bảng xếp hạng (TỰ NGUYỆN) và chuyển tiếp kết quả "chơi hộ" (tạm thời, mã hoá đầu-cuối).
-- Nguyên tắc: không lưu IP, thiết bị, email hay bất kỳ định danh nào của người chơi.

-- Chỉ có dòng khi người chơi chủ động bấm "Khoe điểm". Biệt danh do họ tự gõ, có thể là tên bất kỳ.
CREATE TABLE scores (
  id         bigserial PRIMARY KEY,
  game       text        NOT NULL,
  nick       text        NOT NULL,
  score      integer     NOT NULL CHECK (score > 0),
  day        date        NOT NULL,               -- ngày theo giờ Việt Nam
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX scores_game_score_idx ON scores (game, score DESC);
CREATE INDEX scores_game_day_idx   ON scores (game, day, score DESC);

-- Một "lời nhờ chơi hộ". Kết quả (blob) được mã hoá ở trình duyệt người chơi hộ bằng khoá nằm trong phần #fragment của đường link
-- (không bao giờ gửi lên máy chủ), nên máy chủ chỉ giữ dữ liệu không đọc được và XOÁ ngay khi chủ nhân nhận xong hoặc sau khi hết hạn.
CREATE TABLE relays (
  id         text PRIMARY KEY,                   -- 22 ký tự ngẫu nhiên (128 bit), nằm trong link
  owner_hash text        NOT NULL,               -- sha256(mã chủ nhân): chỉ chủ nhân mới được nhận kết quả / xoá
  claim_hash text,                               -- sha256(mã người chơi hộ): có giá trị = link đã được dùng (chỉ 1 lần)
  blob       text,                               -- kết quả đã mã hoá (AES-GCM)
  state      text        NOT NULL DEFAULT 'open' CHECK (state IN ('open','claimed','done')),
  expires_at timestamptz NOT NULL
);
CREATE INDEX relays_exp_idx ON relays (expires_at);
