/* 8 THEME MÀU NIGHT PASS CHO LINH VẬT (docs/MASCOT-ART-RULES.md mục 8): 1 skin × 8 theme (như 8 bộ nền gradient hiện có). Theme đổi BẢNG MÀU của chính linh vật + phụ kiện (không phải nền sau lưng).
   NPArtTheme.apply(svgEl, themeId) đặt --p1 (thân sáng) --p2 (thân đậm) --pst (viền) --pa (nhấn 1) --pb (nhấn 2) (+ --bgx/--bg2 cho viền sáng/bóng). SKIN trong SVG biến đổi bảng này (Dạ quang tối đi, Siêu sao ngả vàng...).
   themeId rỗng/không có gói = xoá biến → dùng bảng mặc định trong SVG. Dùng chung id với NPGrad (sunset, ocean, forest, candy, aurora, gold, midnight, rose). */
(function () {
  "use strict";
  if (window.NPArtTheme) return;
  /* id: [p1 thân sáng, p2 thân đậm, pst viền, pa nhấn 1, pb nhấn 2] — MÀU BÙ (đối xứng trên bánh xe màu) với màu nền của theme đó, để linh vật nổi bật:
     Hoàng hôn (tím→cam) → xanh ngọc · Đại dương (xanh lam) → cam san hô · Rừng xanh (lục) → hồng sen · Kẹo ngọt (hồng tím) → xanh bạc hà
     Cực quang (lục lam→tím) → vàng cam · Vàng ấm (hổ phách) → xanh tím · Nửa đêm (chàm) → vàng chanh · Hồng đào (đỏ hồng) → xanh lơ */
  var T = {
    sunset: ["#3FD6E0", "#1B9AB0", "#0F6B80", "#FFD84D", "#FF7AC6"],
    ocean: ["#FF8A5C", "#E0532B", "#A53515", "#FFE08A", "#FF7AC6"],
    forest: ["#FF7AC6", "#D4429A", "#962A70", "#FFE08A", "#7CF0FF"],
    candy: ["#5CE8B8", "#20B88A", "#138060", "#FFE08A", "#FF7AB6"],
    aurora: ["#FFC24D", "#E08A1A", "#9A5A0A", "#FF7AB6", "#7CF0FF"],
    gold: ["#7C86FF", "#3A3FB5", "#232780", "#FF7AB6", "#D7FF3F"],
    midnight: ["#FFD84D", "#D99A1E", "#9A6A0A", "#FF4FA3", "#7CF0FF"],
    rose: ["#4FD8D0", "#17A0A8", "#0D6E76", "#FFE08A", "#FF8FA3"]
  };
  var NAMES = { sunset: ["Hoàng hôn", "Sunset"], ocean: ["Đại dương", "Ocean"], forest: ["Rừng xanh", "Forest"], candy: ["Kẹo ngọt", "Candy"], aurora: ["Cực quang", "Aurora"], gold: ["Vàng ấm", "Golden"], midnight: ["Nửa đêm", "Midnight"], rose: ["Hồng đào", "Rose"] };
  function vars(id) { var t = T[id]; return t ? { p1: t[0], p2: t[1], pst: t[2], pa: t[3], pb: t[4], bgx: t[3], bg2: t[2] } : null; }
  function apply(el, id) { if (!el) return; var v = vars(id), n; if (!v) { ["p1", "p2", "pst", "pa", "pb", "bgx", "bg2"].forEach(function (k) { el.style.removeProperty("--" + k); }); return; } for (n in v) el.style.setProperty("--" + n, v[n]); }
  window.NPArtTheme = { ids: Object.keys(T), names: NAMES, vars: vars, apply: apply };
})();
