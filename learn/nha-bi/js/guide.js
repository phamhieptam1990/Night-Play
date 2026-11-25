/* Hướng dẫn chơi Nhà của thú (Học Vui): dữ liệu các bước cho shared/worldkit/world-guide.js. Khoá "đã xem" theo từng lớp (wg:seen:nb:g<N>). */
(function () {
  var D = window.NB_DATA || {}, g = D.grade || 3;
  WorldGuide.init({
    key: "nb:g" + g, lang: function () { return "vi"; },
    vars: function () { return { pet: (D.pet && D.pet.name) || "bé" }; },
    btn: { mode: "fixed", css: "#wgBtn{right:var(--wk-edge);top:calc(var(--hudH,66px) + 190px)}@media (orientation:landscape) and (min-aspect-ratio:11/10){#wgBtn{right:auto;left:calc(var(--wk-edge) + 128px);top:auto;bottom:10px}}" },
    steps: [
      { sel: "#zbar .zb:nth-child(2)", act: "tap", ic: ["food"], t: "Chạm bếp để lấy đồ ăn" },
      { from: "#tray .tr:not(.mgt)", to: "#pw", act: "drag", ic: ["food", "soap", "toy"], t: "Kéo đồ cho {pet}" },
      { sel: "#rStats", act: "look", ic: ["food", "soap", "toy"], t: "Thanh đầy là {pet} vui" },
      { sel: "#lessonBtn", act: "tap", ic: ["book", "gift"], t: "Học bài để nhận quà" },
      { sel: ".wk-lv", act: "look", ic: ["star"], t: "Chăm {pet}, {pet} lớn lên" }
    ]
  });
})();
