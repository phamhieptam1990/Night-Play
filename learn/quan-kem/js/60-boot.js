/* Khởi động Quán Kem: dựng HUD + thanh khu, vào thẳng quầy (một chạm là chơi), nhận quà bài học, nối nút làm kem. */
(function () {
  "use strict";
  const $ = QK.$, H = document.documentElement;
  const labels = () => {
    [["bSpk", "listen"], ["bAa", "showTxt"], ["undoBtn", "undo"], ["serveBtn", "serve"]].forEach(p => $(p[0]).setAttribute("aria-label", QK.T(p[1])));
    QK.buildBar();
  };
  const A = QK.art, D = QK.data; document.title = D.name;
  [["scBack", "canh-sau"], ["scFloor", "canh-san"], ["scStrip", "canh-quay"], ["cust", "khach-meo-cho"], ["fox", "chu-quan"], ["jm", "machine-1"]].forEach(p => { $(p[0]).src = A(p[1]); });
  $("bSpk").innerHTML = QK.ic("ear"); $("bAa").innerHTML = QK.ic("abc"); $("undoBtn").innerHTML = QK.ic("undo"); $("serveBtn").innerHTML = QK.ic("serve");
  $("serveBtn").onclick = QK.serve; $("undoBtn").onclick = QK.undo; $("bSpk").onclick = QK.replay; $("bAa").onclick = QK.revealText;
  QK.initWorld(); labels(); QK.renderCrates(); QK.renderDecor(); QK.renderMachine(); QK.renderFacade();
  QK.fit(); requestAnimationFrame(QK.fit); setTimeout(QK.fit, 300);
  /* nút góc: hàng nút đáy gom thành 1 nút (phải); nút chọn lớp bằng linh vật chủ quán (trái), chỉ hiện các lớp đã tới */
  if (window.WorldFab) WorldFab.mount({ list: $("bar"), side: "right", label: "Menu" });
  if (window.LearnGradeBar) LearnGradeBar.mount({ side: "left", persist: false, max: QK.curGrade(), get: QK.grade, icon: g => "art/g" + g + "/chu-quan.svg", onChange: g => { const q = new URLSearchParams(location.search); q.set("grade", g); location.search = q.toString(); } });
  QK.begin(0);
  QK.claimLessons();
  document.addEventListener("visibilitychange", () => { if (document.hidden) QK.pause(true); else { QK.pause(false); QK.claimLessons(); } });
  addEventListener("pagehide", () => QK.cancelSpeech());
})();
