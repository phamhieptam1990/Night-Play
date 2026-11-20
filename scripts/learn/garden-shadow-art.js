/* BÓNG ĐỔ trong tranh SVG (nhà, cây, vật nuôi, đồ nhỏ...): MỘT nơi quyết định hướng, độ dài, độ đậm và màu bóng theo buổi trong ngày.
   (Bóng của cây ảnh PNG là lớp riêng ở learn/garden/garden-shadow.js.)
   Dùng: const SHADOW = require("./garden-shadow-art")({ ell });  SHADOW.setTime("day"|"dusk"|"night");  SHADOW.make(rx, ry, độ đậm).
   Muốn đổi cả vườn: sửa PRESET. dx = lệch ngang (phần của rx, âm = sang trái), sx / sy = kéo dài / dẹt, k = nhân độ đậm, col = màu. */
"use strict";
module.exports = function makeShadow(d) {
  const { ell } = d;
  const PRESET = {
    day:   { dx: .10, sx: 1.0,  sy: 1.0,  k: 1.0,  col: "#1F5A22" },   /* nắng trưa: bóng ngắn, lệch nhẹ sang phải */
    dusk:  { dx: -.45, sx: 1.5, sy: .85,  k: 1.2,  col: "#3B2748" },   /* hoàng hôn: mặt trời bên phải, bóng dài sang trái */
    night: { dx: -.20, sx: 1.15, sy: 1.0, k: .55,  col: "#0B1030" }    /* đêm: bóng mờ */
  };
  let cur = PRESET.day;
  const setTime = t => { cur = PRESET[t] || PRESET.day; };
  const make = (rx, ry, o) => ell(cur.dx * rx, 0, rx * cur.sx, ry * cur.sy, cur.col, null, 0).replace("/>", ` opacity="${Math.min(.6, (o || .22) * cur.k).toFixed(3)}"/>`);
  return { PRESET, setTime, make };
};
