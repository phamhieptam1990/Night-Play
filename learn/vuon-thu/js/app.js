/* KHỞI ĐỘNG vườn thú Tiếng Việt: vừa khung → dựng cảnh → HUD; quay lại trang (từ phòng thú / học bài) thì dựng lại để cập nhật quà, cấp, khoá. */
(function (V) {
  "use strict";
  V.fit(); V.build(); V.hudInit();
  LearnGradeBar.mount({ get: V.curGrade, onChange: function () { V.build(); V.hudSync(); } });
  function refresh() { if (document.hidden) return; V.build(); V.hudSync(); LearnGradeBar.sync(V.curGrade()); }
  document.addEventListener("visibilitychange", refresh);
  addEventListener("pageshow", function (e) { if (e.persisted) refresh(); });
  window.VTDebug = V;
})(window.VT);
