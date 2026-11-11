/* Thông tin chủ website dùng chung cho các trang chính sách (privacy.html, terms.html) và trang quản trị.
   Sửa các giá trị dưới đây rồi lưu: các trang tự cập nhật.
   Chỗ nào còn "[CẦN ĐIỀN: ...]" là chủ site phải điền (scripts/cozygame/check-legal.js đếm). Mục license: thay bằng số xác nhận khi Bộ Công Thương cấp.
   (Các trang game vẫn có hằng EMAIL riêng ở đầu script của từng trang.) */
window.SITE = {
  operator:  "Phạm Hiệp Tam",
  represent: "Phạm Hiệp Tam (cá nhân sở hữu website / individual owner)",
  address:   "B2.09.06 Chung cư 4S Linh Đông, Linh Đông, Thủ Đức, Hồ Chí Minh",
  phone:     "0906315080",
  taxId:     "Cung cấp cho cơ quan nhà nước có thẩm quyền khi được yêu cầu / Provided to competent state authorities upon request",   // KHÔNG ghi số định danh/CCCD vào file công khai (check-legal.js quét); số thật chỉ nhập trong hồ sơ đăng ký Bộ Công Thương
  license:   "Đang làm thủ tục thông báo với Bộ Công Thương / Notification with the Ministry of Industry and Trade in progress",   // có số xác nhận thì thay bằng số
  email:     "support@nightplay.vn",
  domain:    "nightplay.vn",
  updated:   "2026-11-10",       // ngày hiển thị ở chân trang (fallback)
  legalDate: "10/11/2026"        // ngày hiệu lực / cập nhật của chính sách & điều khoản
};
