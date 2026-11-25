/* Ít chữ: chỉ vài nhãn tên khu (aria-label) VI/EN; câu khách nói luôn là Tiếng Anh (data/menu.js). */
(function () {
  "use strict";
  const S = {
    vi: { counter: "Quầy làm món", dine: "Bàn khách", shop: "Cửa hàng", book: "Sổ món", sound: "Âm thanh", back: "Về vườn", serve: "Phục vụ", undo: "Bỏ cây kem cuối", listen: "Nghe lại", showTxt: "Hiện chữ", full: "Khay đầy!", empty: "Chưa có kem!" },
    en: { counter: "Counter", dine: "Tables", shop: "Shop", book: "Menu book", sound: "Sound", back: "Back", serve: "Serve", undo: "Remove last", listen: "Listen again", showTxt: "Show text", full: "Tray is full!", empty: "No ice cream yet!" }
  };
  QK.T = k => (S[QK.lang()] || S.vi)[k] || S.vi[k] || k;
  try { const l = new URLSearchParams(location.search).get("lang") || localStorage.getItem("lang"); if (l === "en" || l === "vi") document.documentElement.lang = l; } catch (e) {}
})();
