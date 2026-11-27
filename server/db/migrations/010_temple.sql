-- Chùa Học Bá Online: bộ đếm lượt cầu mỗi ngày + bảng thi đua tuần theo lớp / trường / tỉnh.
-- Nguyên tắc: KHÔNG lưu IP, thiết bị hay định danh cá nhân; chỉ cộng dồn theo tên nhóm do người chơi tự khai (tên lớp, tên trường, tỉnh).

CREATE TABLE temple_daily (
  day  date     NOT NULL,                 -- ngày theo giờ Việt Nam
  wish smallint NOT NULL CHECK (wish BETWEEN 0 AND 3),
  n    integer  NOT NULL DEFAULT 0,
  PRIMARY KEY (day, wish)
);

CREATE TABLE temple_groups (
  week  date    NOT NULL,                 -- thứ Hai đầu tuần (giờ Việt Nam)
  kind  text    NOT NULL CHECK (kind IN ('class','school','province')),
  key   text    NOT NULL,                 -- tên đã chuẩn hoá (bỏ dấu, chữ thường) để gộp các cách gõ khác nhau
  name  text    NOT NULL,                 -- tên hiển thị (lần gõ gần nhất)
  merit bigint  NOT NULL DEFAULT 0,       -- tổng điểm công đức
  plays integer NOT NULL DEFAULT 0,       -- số ván đã nộp
  PRIMARY KEY (week, kind, key)
);
CREATE INDEX temple_groups_rank_idx ON temple_groups (week, kind, merit DESC);
