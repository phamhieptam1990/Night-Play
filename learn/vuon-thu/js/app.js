/* KHỞI ĐỘNG vườn thú Tiếng Việt: vừa khung → dựng cảnh → HUD; quay lại trang (từ phòng thú / học bài) thì dựng lại để cập nhật quà, cấp, khoá. */
(function (V) {
  "use strict";
  V.fit(); V.hudInit();
  LearnGradeBar.mount({ subject: "tviet", get: V.curGrade, icon: function () { return V.NB + V.pet(V.petOf(0)).pet.art + ".svg"; }, onChange: function () { V.build(); V.hudSync(); } });
  V.build();   /* dựng cảnh SAU khi HUD + thanh lớp đã có để chừa đúng vùng an toàn */
  function refresh() { if (document.hidden) return; V.build(); V.hudSync(); LearnGradeBar.sync(V.curGrade()); }
  document.addEventListener("visibilitychange", refresh);
  addEventListener("pageshow", function (e) { if (e.persisted) refresh(); });
  window.VTDebug = V;
})(window.VT);
