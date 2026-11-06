/* Cầu nối game ↔ trang cha (game chạy trong iframe CÙNG domain).
   Dùng trong trang game:
     <script src="…/shared/bridge.js"></script>
     NP.start()                 // khi bắt đầu một lượt chơi
     NP.result({score: 123})    // khi kết thúc lượt (đúng 1 lần mỗi lượt)
     if (NP.helper) { … }       // true khi game đang được mở bởi người CHƠI HỘ: không cho chơi lại, không chia sẻ tiếp
   Trang cha (shared/social.js, help.html) chỉ nhận tin từ đúng iframe của mình và cùng origin. */
window.NP = (function () {
  "use strict";
  var q = new URLSearchParams(location.search), helper = q.get("helper") === "1";
  function post(m) { try { m.np = 1; parent.postMessage(m, location.origin); } catch (e) {} }
  return {
    helper: helper,
    start: function () { post({ type: "start" }); },
    result: function (r) { r = r || {}; post({ type: "result", score: Math.max(0, Math.floor(+r.score || 0)), extra: r.extra && typeof r.extra === "object" ? r.extra : null }); }
  };
})();
