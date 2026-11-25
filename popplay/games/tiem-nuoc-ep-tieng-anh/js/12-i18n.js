/* Ít chữ: chỉ vài nhãn tên khu (aria-label) VI/EN; câu khách nói luôn là Tiếng Anh (data/shop.js). */
(function () {
  "use strict";
  const S = {
    vi: { counter: "Quầy làm nước ép", dine: "Bàn khách", garden: "Vườn trái cây", shop: "Cửa hàng", book: "Sổ công thức", sound: "Âm thanh", help: "Cách chơi", serve: "Phục vụ", undo: "Bỏ ly cuối", listen: "Nghe lại", showTxt: "Hiện chữ", lv: "Cấp", full: "Khay đầy!", empty: "Chưa có ly!", helpH: "Cách chơi" },
    en: { counter: "Juice counter", dine: "Tables", garden: "Fruit garden", shop: "Shop", book: "Recipe book", sound: "Sound", help: "How to play", serve: "Serve", undo: "Remove last", listen: "Listen again", showTxt: "Show text", lv: "Level", full: "Tray is full!", empty: "No cups yet!", helpH: "How to play" }
  };
  TNE.T = k => (S[TNE.lang()] || S.vi)[k] || S.vi[k] || k;
})();
