/* Khởi động Khu chợ: dựng cảnh + HUD; xoá khoá from=market (bé đã về chợ); làm mới khi quay lại tab (đã học/nhận xu ở nơi khác). */
(function () {
  "use strict";
  try { sessionStorage.removeItem("learn:from"); } catch (e) {}
  KC.build(); KC.hud();
  LearnGradeBar.mount({ get: KC.curGrade, onChange: () => { KC.build(); KC.hudSync(); } });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { KC.build(); KC.hudSync(); LearnGradeBar.sync(KC.curGrade()); } });
  addEventListener("pageshow", e => { if (e.persisted) KC.build(); });
})();
