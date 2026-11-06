-- Bản trả phí của Đập Deadline: huy hiệu Night Pass trên bảng xếp hạng + đếm lượt xem/bấm các chế độ bị khóa (ẩn danh, chỉ số tổng hợp).

-- Điểm khoe từ người đang có Night Pass (máy chủ tự kiểm tra token; không lưu token hay định danh).
ALTER TABLE scores ADD COLUMN pro boolean NOT NULL DEFAULT false;

-- Đếm theo ngày: key = "<tính năng>:<view|click|trial>" (ví dụ endless:view). Không có IP, thiết bị hay định danh.
CREATE TABLE paywall_daily (
  day date    NOT NULL,
  key text    NOT NULL,
  n   integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, key)
);
