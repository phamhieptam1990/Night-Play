/* DÙNG THỬ NIGHT PASS (font chữ + màu nền gradient + hiệu ứng): MỖI NGÀY (giờ VN) mỗi máy được dùng thử MỘT lần, kéo dài DUR phút; hết giờ tự về mặc định
   (xoá np-font / np-grad / np-fx). Người có gói còn hạn dùng thoải mái, không ràng buộc. Chỉ là cổng phía trình duyệt (giống ổ khoá giao diện), chạy được cả offline.
   API: NPTrial.state() -> "pass" | "on" | "avail" | "used"; NPTrial.on() (được dùng ngay?); NPTrial.left() (ms còn lại); NPTrial.start(); NPTrial.cleanup(); NPTrial.DUR.
   Nạp trước npfont.js / npgrad.js (shared/resume.js và các trang nightpass*.html). Khoá localStorage: "np-trial" = { day: "YYYY-MM-DD", until: <ms> }. */
(function () {
  "use strict";
  if (window.NPTrial) return;
  var KEY = "np-trial", DUR = 15 * 60 * 1000;
  function vnDay() { try { return new Date(Date.now() + 252e5).toISOString().slice(0, 10); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  function passOn() { try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.exp && new Date(p.exp) > new Date()); } catch (e) { return false; } }
  function rec() { try { var o = JSON.parse(localStorage.getItem(KEY)); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function left() { var r = rec(); return r && r.until > Date.now() ? r.until - Date.now() : 0; }
  function state() { if (passOn()) return "pass"; if (left() > 0) return "on"; var r = rec(); return r && r.day === vnDay() ? "used" : "avail"; }
  function on() { return passOn() || left() > 0; }
  function start() { if (state() !== "avail") return false; try { localStorage.setItem(KEY, JSON.stringify({ day: vnDay(), until: Date.now() + DUR })); } catch (e) { return false; } return true; }
  function cleanup() { if (on()) return; try { ["np-font", "np-grad", "np-fx"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {} }
  window.NPTrial = { DUR: DUR, state: state, on: on, left: left, start: start, cleanup: cleanup, passOn: passOn };
})();
