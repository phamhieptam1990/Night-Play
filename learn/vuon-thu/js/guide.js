/* Hướng dẫn lần đầu vườn thú (world-guide.js): chạm chuồng · quà chờ · chuồng khoá · nút sách. Bước không thấy phần tử thì tự bỏ. Khoá đã xem: wg:seen:vuonthu. */
(function () {
  WorldGuide.init({
    key: "vuonthu", lang: function () { return "vi"; }, btn: { mode: "hud" },
    steps: [
      { sel: ".pen:not(.lock)", act: "tap", ic: ["play"], t: "Chạm chuồng để chơi với thú" },
      { sel: ".pen .gift", act: "look", ic: ["gift"], t: "Có quà đang chờ" },
      { sel: ".pen.lock", act: "look", ic: ["book"], t: "Học bài để mở chuồng" },
      { sel: "#bookBtn", act: "tap", ic: ["book", "star"], t: "Chạm sách để học bài" }
    ]
  });
})();
