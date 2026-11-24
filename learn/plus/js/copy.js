/* Chữ (vi/en) và bảng giá dự phòng của trang Học Vui Plus. Giá thật do máy chủ trả ở /api/learn/plans (server/learn.js PLANS_LEARN);
   FALLBACK chỉ để hiện giá khi chưa mở bán — PHẢI khớp server/learn.js. Giá chốt: 99.000đ / 249.000đ / 790.000đ. */
(function (root) {
  "use strict";
  root.PlusCopy = {
    FALLBACK: [{ id: "learn_month", amount: 99000, days: 30 }, { id: "learn_quarter", amount: 249000, days: 90 }, { id: "learn_year", amount: 790000, days: 365 }],
    UNIT: { learn_month: ["/tháng", "/month"], learn_quarter: ["/3 tháng", "/3 months"], learn_year: ["/năm", "/year"], learn_test: ["", ""] },
    vi: {
      brand: "Học Vui", back: "Phụ huynh", lang: "EN", h1: "Học Vui Plus", sub: "Bé vẫn học ĐỦ bài và có đủ vườn miễn phí. Plus là phần thêm cho ba mẹ.",
      soon: "Học Vui Plus sắp mở bán. Bạn xem trước các gói; nút thanh toán sẽ mở khi chính thức bán.", s1: "Chọn gói", s2: "Thanh toán",
      plan: { learn_month: "1 tháng", learn_quarter: "3 tháng", learn_year: "1 năm", learn_test: "Thử 1.000đ" },
      desc: { learn_month: "Thử một tháng để xem bé có hợp, thôi lúc nào cũng được.", learn_quarter: "Một học kỳ ôn đều, tiện cho ba mẹ theo dõi.", learn_year: "Cả năm học với giá tốt nhất, rẻ hơn trả từng tháng.", learn_test: "Gói thử." },
      inc: ["AI luyện cùng: gợi ý từng bước, không nói đáp án", "Giải thích đúng chỗ bé sai", "Đề thi thử vào lớp 6 (đang hoàn thiện)", "Báo cáo tuần cho ba mẹ"],
      valid: "Dùng trong {d} ngày · không tự gia hạn", best: "Tiết kiệm nhất", save: "Tiết kiệm", per: "≈", month: "/tháng",
      go: "Tiếp tục", goOn: "Thanh toán", soonBtn: "Sắp mở bán", trial: "Dùng thử 7 ngày (không cần thẻ)",
      s2T: "Thanh toán bằng chuyển khoản", mailL: "Email của ba mẹ (để nhận gói và biên nhận)", payB: "Tạo mã chuyển khoản", trialB: "Bắt đầu dùng thử 7 ngày", again: "← Đổi gói",
      sumPlan: "Gói", sumTrial: "Dùng thử", sumTotal: "Tổng", days7: "7 ngày · 0đ",
      active: "Plus đang mở đến", transfer: "Chuyển khoản", memo: "Nội dung", bank: "Ngân hàng", acc: "Số tài khoản", holder: "Chủ tài khoản",
      waiting: "Đang chờ thanh toán…", paid: "Đã nhận thanh toán. Plus đã mở!", expired: "Đơn hết hạn, hãy tạo đơn mới.", trialOk: "Đã mở Plus 7 ngày!",
      errMail: "Email chưa đúng.", errUsed: "Email này đã dùng thử rồi.", errOff: "Plus chưa mở bán.", errNet: "Chưa kết nối được, thử lại sau nhé.", errAny: "Chưa làm được, thử lại sau nhé.",
      trust: ["Bé vẫn học đủ bài và vườn miễn phí", "Dùng thử 7 ngày, không cần thẻ", "Không tự động gia hạn", "Thanh toán chuyển khoản / quét QR", "AI chỉ nhận nội dung câu đang làm, không có thông tin cá nhân của bé"],
      fpar: "Trang phụ huynh", fp: "Chính sách bảo mật", ft: "Điều khoản"
    },
    en: {
      brand: "Hoc Vui", back: "Parents", lang: "VI", h1: "Hoc Vui Plus", sub: "Your child keeps ALL lessons and the garden for free. Plus is the extra for parents.",
      soon: "Hoc Vui Plus is coming soon. Preview the plans; checkout opens at launch.", s1: "Choose plan", s2: "Payment",
      plan: { learn_month: "1 month", learn_quarter: "3 months", learn_year: "1 year", learn_test: "Test 1,000" },
      desc: { learn_month: "Try a month to see if it suits your child; stop anytime.", learn_quarter: "A school term of steady practice, easy for parents to follow.", learn_year: "The whole school year at the best price, cheaper than paying monthly.", learn_test: "Test plan." },
      inc: ["AI practice buddy: step-by-step hints, never the answer", "Explains the exact mistake", "Grade-6 mock exams (in progress)", "Weekly report for parents"],
      valid: "Valid for {d} days · no auto-renewal", best: "Best value", save: "Save", per: "≈", month: "/month",
      go: "Continue", goOn: "Checkout", soonBtn: "Coming soon", trial: "Try 7 days (no card needed)",
      s2T: "Pay by bank transfer", mailL: "Parent's email (for your plan and receipt)", payB: "Create transfer code", trialB: "Start 7-day trial", again: "← Change plan",
      sumPlan: "Plan", sumTrial: "Trial", sumTotal: "Total", days7: "7 days · 0đ",
      active: "Plus is on until", transfer: "Transfer", memo: "Memo", bank: "Bank", acc: "Account", holder: "Account holder",
      waiting: "Waiting for payment…", paid: "Payment received. Plus is on!", expired: "Order expired, please create a new one.", trialOk: "Plus is on for 7 days!",
      errMail: "That email does not look right.", errUsed: "This email already used the trial.", errOff: "Plus is not on sale yet.", errNet: "Could not connect, try again later.", errAny: "That did not work, try again later.",
      trust: ["Your child keeps all lessons and the garden free", "7-day trial, no card", "No auto-renewal", "Pay by bank transfer / QR", "The AI only gets the current question, never personal details"],
      fpar: "Parents", fp: "Privacy", ft: "Terms"
    }
  };
})(window);
