/* 8 THEME MÀU NIGHT PASS CHO LINH VẬT (docs/MASCOT-ART-RULES.md mục 8): 1 skin × 8 theme (như 8 bộ nền gradient hiện có). Theme đổi BẢNG MÀU của chính linh vật + phụ kiện (không phải nền sau lưng).
   NPArtTheme.apply(svgEl, themeId) đặt --p1 (thân sáng) --p2 (thân đậm) --pst (viền) --pa (nhấn 1) --pb (nhấn 2) (+ --bgx/--bg2 cho viền sáng/bóng). SKIN trong SVG biến đổi bảng này (Dạ quang tối đi, Siêu sao ngả vàng...).
   themeId rỗng/không có gói = xoá biến → dùng bảng mặc định trong SVG. Dùng chung id với NPGrad (sunset, ocean, forest, candy, aurora, gold, midnight, rose). */
(function () {
  "use strict";
  if (window.NPArtTheme) return;
  /* id: [p1, p2, pst, pa, pb] */
  var T = {
    sunset: ["#FF8A4C", "#C2410C", "#8A2A08", "#B57BFF", "#FFD84D"],
    ocean: ["#35C2D8", "#0F8B9D", "#0A5F70", "#FF8A6B", "#FFE08A"],
    forest: ["#6FCB6E", "#2F8F46", "#1E6030", "#FFD24D", "#FF8FB0"],
    candy: ["#FF7AB6", "#D9468F", "#A82B6B", "#5CF2C0", "#FFE08A"],
    aurora: ["#5CE0C8", "#7A5CD8", "#3F2C8A", "#FFD24D", "#FF8FD0"],
    gold: ["#FFC84D", "#D99A1E", "#9A6A0A", "#8B7CFF", "#FF7A59"],
    midnight: ["#7C86FF", "#3A3FB5", "#232780", "#D7FF3F", "#FF4FA3"],
    rose: ["#FF8FA3", "#D94F6B", "#A3304A", "#6BE8E8", "#FFE08A"]
  };
  var NAMES = { sunset: ["Hoàng hôn", "Sunset"], ocean: ["Đại dương", "Ocean"], forest: ["Rừng xanh", "Forest"], candy: ["Kẹo ngọt", "Candy"], aurora: ["Cực quang", "Aurora"], gold: ["Vàng ấm", "Golden"], midnight: ["Nửa đêm", "Midnight"], rose: ["Hồng đào", "Rose"] };
  function vars(id) { var t = T[id]; return t ? { p1: t[0], p2: t[1], pst: t[2], pa: t[3], pb: t[4], bgx: t[3], bg2: t[2] } : null; }
  function apply(el, id) { if (!el) return; var v = vars(id), n; if (!v) { ["p1", "p2", "pst", "pa", "pb", "bgx", "bg2"].forEach(function (k) { el.style.removeProperty("--" + k); }); return; } for (n in v) el.style.setProperty("--" + n, v[n]); }
  window.NPArtTheme = { ids: Object.keys(T), names: NAMES, vars: vars, apply: apply };
})();
