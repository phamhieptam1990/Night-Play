/* BỘ SƯU TẬP: nút nhỏ (SVG) mở bảng các thú của những lớp đã qua + lớp hiện tại của bé; chạm một thú để sang nhà của nó (index.html?grade=N).
   Lớp bé chưa học thì không hiện. Chỉ có 1 thú để chọn thì ẩn nút. Toàn hình: mỗi ô là tranh thú + số lớp. */
(function (N) {
  "use strict";
  var ICON = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="7" cy="9" r="2.2"/><circle cx="12" cy="6.4" r="2.2"/><circle cx="17" cy="9" r="2.2"/><path d="M7.5 18c0-3.4 2.2-5.6 4.5-5.6s4.5 2.2 4.5 5.6c0 1.4-1.2 2-2.4 1.6-1.4-.5-3.2-.5-4.6 0-1.2.4-2-.2-2-1.6z"/></svg>';
  var X = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function cur() { var g = 0; try { g = +localStorage.getItem("learn:grade"); } catch (e) {} return g >= 1 && g <= 5 ? g : 3; }
  N.collectionGrades = function () {
    var D = N.store.D(), top = Math.max(cur(), D.grade), out = [], g;
    for (g = 1; g <= top; g++) if (window.NB_PETS[g]) out.push(g);
    return out;
  };
  function open() {
    var D = N.store.D(), ov = document.createElement("div"), h = "";
    ov.className = "colov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    N.collectionGrades().forEach(function (g) {
      var p = window.NB_PETS[g].pet;
      h += '<a class="colt' + (g === D.grade ? " on" : "") + '" href="index.html?grade=' + g + '" aria-label="' + p.name + '"><img alt="" src="art/' + p.art + '.svg"><b>' + g + "</b></a>";
    });
    ov.innerHTML = '<div class="colc"><div class="colg">' + h + '</div><button class="colx" type="button" aria-label="Đóng">' + X + "</button></div>";
    ov.onclick = function (e) { if (e.target === ov || e.target.closest(".colx")) { N.sfx.tap(); ov.remove(); } };
    document.body.appendChild(ov); N.sfx.tap();
  }
  N.collectionInit = function () {
    if (N.collectionGrades().length < 2) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "wk-btn"; b.id = "colBtn"; b.setAttribute("aria-label", "Bộ sưu tập thú");
    b.innerHTML = ICON; b.onclick = open; document.body.appendChild(b);
  };
})(window.NB);
