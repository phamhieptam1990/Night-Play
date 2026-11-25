/* Khởi động Khu chợ: dựng cảnh + HUD; xoá khoá from=market (bé đã về chợ); làm mới khi quay lại tab (đã học/nhận xu ở nơi khác). */
(function () {
  "use strict";
  try { sessionStorage.removeItem("learn:from"); } catch (e) {}
  KC.build(); KC.hud();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) KC.build(); });
  addEventListener("pageshow", e => { if (e.persisted) KC.build(); });
})();
