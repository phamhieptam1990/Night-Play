-- Link chơi hộ ngắn: /h/<mã 8 ký tự>#<khoá>. Máy chủ giữ thêm tên game (không nhạy cảm) và tiến trình game đã MÃ HOÁ bằng khoá nằm trong #fragment
-- (máy chủ không đọc được), thay vì nhét hết vào link. Xoá cùng dòng relays khi hết hạn / chủ nhân đã nhận.
ALTER TABLE relays ADD COLUMN IF NOT EXISTS game text;
ALTER TABLE relays ADD COLUMN IF NOT EXISTS st   text;
