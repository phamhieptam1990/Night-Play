/* Hướng dẫn Khu chợ: dữ liệu bước cho shared/worldkit/world-guide.js (câu ngắn tiếng Anh + hình). Khoá đã xem: wg:seen:khucho. */
WorldGuide.init({
  key: "khucho", lang: function () { return "en"; }, btn: { mode: "hud" },
  steps: [
    { sel: ".shop.open", act: "tap", ic: ["shop"], t: "Tap a shop to play" },
    { sel: ".shop .coin", act: "look", ic: ["coin"], t: "Coins are waiting!" },
    { sel: ".kc-book", act: "tap", ic: ["book"], t: "Learn to open more shops" }
  ]
});
