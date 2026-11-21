/* Học Vui Plus: cổng tính năng trả phí (BẢN GIẢ, chưa nối gói). Plus.has(tên) luôn false cho tới giai đoạn G1 (nền bán hàng).
   Tên tính năng dự kiến: "coach" (AI luyện cùng), "explain" (giải thích từng bước), "exam6" (đề thi lớp 6), "report" (báo cáo tuần), "multi" (nhiều bé/máy), "sync" (đồng bộ).
   Mọi chỗ trong trang của bé chỉ được hỏi Plus.has(...) rồi tự ẩn/hiện; bé không bao giờ thấy giá hay nút mua (xem docs/LEARN-NIGHTPASS-PLAN.md). */
(function (root) {
  "use strict";
  root.LearnPlus = { ready: false, has: function () { return false; }, features: ["coach", "explain", "exam6", "report", "multi", "sync"] };
})(typeof window !== "undefined" ? window : globalThis);
