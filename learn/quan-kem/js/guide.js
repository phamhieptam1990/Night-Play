/* Hướng dẫn chơi Quán (Học Vui, Tiếng Anh): dữ liệu các bước cho shared/worldkit/world-guide.js. Câu hướng dẫn luôn bằng tiếng Anh ngắn kèm hình (bé học). Khoá "đã xem" theo lớp. */
WorldGuide.init({
  key: "kem:g" + (window.QK_GRADE || 1), lang: function () { return "en"; },
  btn: { mode: "hud" },
  steps: [
    { sel: ["#bSpk", "#bAa"], act: "tap", ic: ["ear"], t: "Listen to the order" },
    { from: "#crates .crate", to: "#jm", act: "drag", ic: ["counter"], t: "Drag it to the machine" },
    { sel: "#serveBtn", act: "tap", ic: ["serve"], t: "Done? Press the tick" },
    { sel: ["#wk-coin", "#wk-stars"], act: "look", ic: ["coin", "star"], t: "Get coins and stars" },
    { sel: "#zb-shop", act: "tap", ic: ["shop"], t: "Buy new things" }
  ]
});
