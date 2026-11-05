-- Thống kê truy cập / lượt chơi: ẩn danh, chỉ lưu số liệu tổng hợp theo ngày.
-- Không lưu IP, user agent, cookie hay bất kỳ mã định danh lâu dài nào (trang có trẻ em).

CREATE TABLE stats_daily (
  day          date   NOT NULL,                 -- ngày theo giờ Việt Nam
  site         text   NOT NULL,                 -- home | popplay | cozyplay | subscribe
  game         text   NOT NULL DEFAULT '',      -- '' = lượt mở trang; còn lại = id game
  name         text,                            -- tên game hiển thị (cập nhật theo lần gửi mới nhất)
  views        integer NOT NULL DEFAULT 0,      -- lượt mở trang
  plays        integer NOT NULL DEFAULT 0,      -- lượt bắt đầu chơi
  play_seconds bigint  NOT NULL DEFAULT 0,      -- tổng giây chơi (cộng theo nhịp 60s)
  PRIMARY KEY (day, site, game)
);

-- Ai đang chơi lúc này. sid chỉ tồn tại trong 1 phiên chơi (tạo ngẫu nhiên ở trình duyệt, không lưu lại), xoá khi dừng hoặc hết hạn.
CREATE TABLE presence (
  sid       text PRIMARY KEY,
  site      text NOT NULL,
  game      text NOT NULL,
  name      text,
  last_seen timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX presence_seen_idx ON presence (last_seen);
