/* Hạn chế công cụ nhà phát triển (nhúng ở đầu <head> của MỌI trang).
   - Chặn phím tắt mở DevTools / xem nguồn và menu chuột phải.
   - Phát hiện DevTools đang mở (kích thước khung + "debugger" bị dừng) → chuyển sang trang restricted.html.
   LƯU Ý: đây chỉ là rào cản với người dùng thường, KHÔNG phải bảo mật thật (mã phía trình duyệt luôn xem được bằng cách khác;
   "view-source:" gõ trực tiếp trên thanh địa chỉ không thể chặn). Bảo mật thật nằm ở server (kiểm tra thanh toán, ADMIN_KEY...).
   Tắt hẳn trên localhost để lập trình; muốn thử ở localhost thì thêm ?guard=1 vào địa chỉ. */
(function () {
  "use strict";
  var loc = location, host = loc.hostname;
  var local = host === "localhost" || host === "127.0.0.1" || host === "[::1]" || loc.protocol === "file:";
  if (local && !/[?&]guard=1\b/.test(loc.search)) return;
  if (/\/restricted(\.html)?\/?$/.test(loc.pathname)) return;   // Cloudflare rút gọn /restricted.html → /restricted: trang này phải được miễn, nếu không sẽ chuyển tiếp vô hạn

  var IN_FRAME = window.top !== window;

  /* 1) phím tắt */
  addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (e.key === "F12" ||
        (mod && e.shiftKey && "ijckme".indexOf(k) > -1 && k.length === 1) ||   // Ctrl/Cmd+Shift+I/J/C/K/M/E
        (e.metaKey && e.altKey && "ijcu".indexOf(k) > -1 && k.length === 1) ||  // Cmd+Opt+I/J/C/U (Mac)
        (e.ctrlKey && (k === "u" || k === "s"))) {                              // Ctrl+U xem nguồn, Ctrl+S lưu trang
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

  /* 2) menu chuột phải (vẫn cho dùng trong ô nhập liệu) */
  document.addEventListener("contextmenu", function (e) {
    var t = e.target;
    if (!(t && t.closest && t.closest("input,textarea"))) e.preventDefault();
  });

  /* 3) phát hiện DevTools đang mở */
  var coarse = window.matchMedia && matchMedia("(pointer:coarse)").matches;   // điện thoại/máy tính bảng: bỏ qua phép đo kích thước
  var hits = 0;
  function openBySize() {
    if (coarse) return false;
    var dw = outerWidth - innerWidth, dh = outerHeight - innerHeight;
    return dw > 220 || dh > 260;                                              // DevTools gắn cạnh/đáy cửa sổ
  }
  function openByDebugger() {
    var t0 = performance.now();
    try { (new Function("debugger"))(); } catch (e) {}
    return performance.now() - t0 > 120;                                      // đang bị dừng ở "debugger" = DevTools mở
  }
  function restrict() {
    var from = (loc.pathname + loc.search).replace(/[?&]guard=1\b/, "");
    var base = loc.pathname.replace(/[^/]*$/, "");
    var depth = base.split("/").filter(Boolean).length;
    var up = ""; for (var i = 0; i < depth; i++) up += "../";
    try { (IN_FRAME ? window.top : window).location.replace(up + "restricted.html?from=" + encodeURIComponent(from)); } catch (e) { document.documentElement.innerHTML = ""; }
  }
  function check() {
    if (openBySize() || openByDebugger()) { if (++hits >= 2) restrict(); } else hits = 0;   // 2 lần liên tiếp mới tính, tránh nhầm khi đổi cỡ cửa sổ
  }
  setInterval(check, 1200);
  addEventListener("resize", function () { setTimeout(check, 300); });
})();
