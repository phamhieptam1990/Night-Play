/* Tiệm Nước Ép: cảnh nền 2 lớp, viewBox 300x400 (3:4). Lớp sau = tường + mái hiên + kệ; lớp trước = mặt quầy xiên + mặt trước quầy + sàn gỗ (khách đứng giữa hai lớp).
   Một nguồn sáng trên-trái: vệt sáng ở mép trên-trái, bóng đổ xuống dưới-phải. */
"use strict";
const { Doc, E, orb, lighten, darken } = require("./core");

function back() {
  const D = Doc("sb"); let b = `<rect width="300" height="150" fill="${D.linear("#FFEBD6", "#FFD3B6", [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 10; i++) b += `<rect x="${i * 30 + 10}" y="30" width="14" height="120" fill="#fff" opacity=".22"/>`;
  /* kệ + chai/trái cây trên kệ (sau bong bóng thoại) */
  b += `<rect x="150" y="108" width="140" height="9" rx="4" fill="${darken("#E8B07A", .25)}"/><rect x="150" y="117" width="140" height="5" rx="2.5" fill="${darken("#E8B07A", .5)}" opacity=".6"/>`;
  [[168, "#FF9A1F"], [196, "#FF4B5C"], [224, "#8BE05A"], [252, "#FFE14A"], [276, "#FF4B4B"]].forEach(([x, c]) => { b += E(x + 2, 109, 11, 3, darken(c, .5), 'opacity=".3"') + orb(D, x, 96, 12, 12, c, { specOp: .7 }); });
  /* biển menu nhỏ bên trái */
  b += `<rect x="14" y="62" width="54" height="64" rx="8" fill="${darken("#C98A4E", .2)}" transform="translate(3 4)"/><rect x="14" y="62" width="54" height="64" rx="8" fill="${D.linear("#3D4A63", "#27304A", [0, 0, 1, 1])}"/>`;
  [[78, "#FFD93D"], [94, "#FF8FA8"], [110, "#8FE0FF"]].forEach(([y, c]) => { b += E(26, y, 5, 5, c) + `<rect x="36" y="${y - 3}" width="24" height="5" rx="2.5" fill="#F4F0E4" opacity=".85"/>`; });
  /* mái hiên sọc có độ dày */
  b += `<rect x="0" y="0" width="300" height="34" fill="${darken("#FF5A7A", .35)}" transform="translate(0 5)"/>`;
  for (let i = 0; i < 10; i++) { const x = i * 30; b += `<path d="M${x} 0h30v22a15 15 0 0 1-30 0z" fill="${i % 2 ? D.linear("#FFFDF5", "#F2E4D0", [0, 0, 0, 1]) : D.linear("#FF7A94", "#E04468", [0, 0, 0, 1])}"/>`; }
  b += `<rect x="0" y="0" width="300" height="8" fill="#fff" opacity=".28"/>`;
  return ["canh-sau", "Cảnh quán (lớp sau)", D.out(b, "0 0 300 150", "Tường quán nước ép")];
}
module.exports = [back];
