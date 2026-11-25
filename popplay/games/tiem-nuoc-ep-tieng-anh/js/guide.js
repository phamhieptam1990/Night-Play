/* Hướng dẫn chơi Quán Cáo Cam (Pop): dữ liệu các bước cho shared/worldkit/world-guide.js. Câu hướng dẫn tiếng Anh ngắn (bé học), tiếng Việt khi đổi VI. */
WorldGuide.init({
  key: "tiem", takeover: true, useOwnPh: true, legacy: "pophelp-seen:tiem-nuoc-ep-tieng-anh",
  lang: function () { return TNE.lang(); },
  btn: { mode: "hud" },
  steps: [
    { sel: ["#bSpk", "#bAa"], act: "tap", ic: ["ear"], t: { vi: "Nghe khách gọi món", en: "Listen to the order" } },
    { from: "#crates .crate", to: "#jm", act: "drag", ic: ["counter"], t: { vi: "Kéo trái cây vào máy", en: "Drag fruit to the juicer" } },
    { sel: "#serveBtn", act: "tap", ic: ["serve"], t: { vi: "Xong rồi thì bấm ✓", en: "Done? Press the tick" } },
    { sel: ["#wk-coin", "#wk-stars"], act: "look", ic: ["coin", "star"], t: { vi: "Nhận xu và sao", en: "Get coins and stars" } },
    { sel: "#zb-shop", act: "tap", ic: ["shop"], t: { vi: "Mua đồ mới ở cửa hàng", en: "Buy new things in the shop" } }
  ]
});
