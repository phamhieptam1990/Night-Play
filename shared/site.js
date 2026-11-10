/* Thông tin chủ website dùng chung cho các trang chính sách (privacy.html, terms.html) và trang quản trị.
   Sửa các giá trị dưới đây rồi lưu: các trang tự cập nhật.
   Chỗ nào còn "[CẦN ĐIỀN: ...]" là chủ site PHẢI điền thông tin thật trước khi nộp hồ sơ đăng ký website (scripts/cozygame/check-legal.js đếm số chỗ còn thiếu).
   (Các trang game vẫn có hằng EMAIL riêng ở đầu script của từng trang.) */
window.SITE = {
  operator:  "[CẦN ĐIỀN: tên cá nhân / tổ chức chủ website]",
  represent: "[CẦN ĐIỀN: người đại diện theo pháp luật / chủ hộ kinh doanh]",
  address:   "[CẦN ĐIỀN: địa chỉ trụ sở / nơi cư trú]",
  phone:     "[CẦN ĐIỀN: số điện thoại liên hệ]",
  taxId:     "[CẦN ĐIỀN: mã số thuế / số ĐKKD / số CCCD (nếu là cá nhân)]",
  license:   "[CẦN ĐIỀN: số xác nhận thông báo website TMĐT với Bộ Công Thương (sau khi được cấp)]",
  email:     "support@nightplay.vn",
  domain:    "nightplay.vn",
  updated:   "2026-11-10",       // ngày hiển thị ở chân trang (fallback)
  legalDate: "10/11/2026"        // ngày hiệu lực / cập nhật của chính sách & điều khoản
};
