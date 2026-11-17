/* Màu linh vật ĂN THEO NỀN GRADIENT NIGHT PASS (docs/MASCOT-ART-RULES.md mục 8). NPArtTheme.vars(gradId, "dark"|"light") -> {bg1,bg2,bgx}; NPArtTheme.apply(svgEl, gradId, theme).
   Thân giữ màu theo skin; chỉ viền sáng mép, bóng đổ, hào quang/lấp lánh và màu nhấn phụ kiện lấy từ biến --bg1/--bg2/--bgx (màu bù, tương phản với nền). Không gói/chưa chọn nền: không đặt biến (dùng mặc định trong SVG). */
(function () {
  "use strict";
  if (window.NPArtTheme) return;
  /* id : [tối bg1, tối bg2, sáng bg1, sáng bg2, bgx tối (bù), bgx sáng (bù, đậm hơn)] */
  var T = {
    sunset: ["#2a1248", "#c2410c", "#ffe3d1", "#ffd9a0", "#4DD8FF", "#0E8FB8"],
    ocean: ["#06233f", "#0f8b9d", "#d8f1ff", "#c8f5ec", "#FF8A6B", "#E0502F"],
    forest: ["#0b2a1c", "#3f7d3a", "#e3f6d8", "#e8f3c4", "#FF7AC6", "#C21F8A"],
    candy: ["#3b1054", "#d9467c", "#ffe0f1", "#e1d1ff", "#5CF2C0", "#0FA57A"],
    aurora: ["#0b1b3d", "#5b3fa8", "#d7f7ee", "#e6d9ff", "#FFD24D", "#C98A00"],
    gold: ["#2b1d05", "#b8801f", "#fff3cf", "#ffd0a0", "#8B7CFF", "#5B3FE0"],
    midnight: ["#05060f", "#2a2f78", "#e1e6ff", "#dcd7ff", "#D7FF3F", "#7A9A00"],
    rose: ["#3a0f1f", "#c24a62", "#ffe1e6", "#ffe5d0", "#6BE8E8", "#0F8F8F"]
  };
  function vars(id, theme) { var t = T[id]; if (!t) return null; var l = theme === "light"; return { bg1: l ? t[2] : t[0], bg2: l ? t[3] : t[1], bgx: l ? t[5] : t[4] }; }
  function apply(el, id, theme) { var v = vars(id, theme), k; if (!el) return; if (!v) { ["--bg1", "--bg2", "--bgx"].forEach(function (n) { el.style.removeProperty(n); }); return; } for (k in v) el.style.setProperty("--" + k, v[k]); }
  window.NPArtTheme = { ids: Object.keys(T), vars: vars, apply: apply };
})();
