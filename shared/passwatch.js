/* Tự nhận Night Pass vừa kích hoạt: khi thanh toán xong ở tab khác (hoặc lúc quay lại tab), trang đang mở tự tải lại để mở khoá, không cần tắt mở.
   - Chỉ tải lại ở nơi an toàn: trang cổng khi không đang chơi game, game khi đang ở màn chọn. Đang chơi thì chờ đến khi về màn chọn / đóng game.
   - Game không có màn chọn (một màn duy nhất) KHÔNG tự tải lại để khỏi mất ván; người chơi mở lại game là có gói. */
(function () {
  "use strict";
  var KEY = "pass";
  function active() { try { var p = JSON.parse(localStorage.getItem(KEY)); return !!(p && p.token && (!p.exp || new Date(p.exp) > new Date())); } catch (e) { return false; } }
  var had = active(), pend = false;
  var stage = document.getElementById("stage");
  var homeEl = document.getElementById("home"), home = homeEl && homeEl.tagName === "SECTION" ? homeEl : null;
  function safeNow() {
    if (stage) return !stage.classList.contains("on");          // trang cổng: đang chơi game trong khung thì chờ
    if (home) return !home.hidden;                              // game: chỉ khi đang ở màn chọn
    return false;                                               // game một màn: không tự tải lại
  }
  function reloadNow() { try { location.reload(); } catch (e) {} }
  function check() {
    var now = active();
    if (now && !had) { had = true; if (safeNow()) reloadNow(); else pend = true; }
    else if (!now) had = false;
  }
  addEventListener("storage", function (e) { if (e.key === KEY || e.key === null) check(); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) check(); });
  addEventListener("focus", check);
  addEventListener("pageshow", check);
  try { if (home) new MutationObserver(function () { if (pend && !home.hidden) { pend = false; reloadNow(); } }).observe(home, { attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
  try { if (stage) new MutationObserver(function () { if (pend && !stage.classList.contains("on")) { pend = false; reloadNow(); } }).observe(stage, { attributes: true, attributeFilter: ["class"] }); } catch (e) {}
})();
