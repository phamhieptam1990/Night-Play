/* THÚ mẫu Pop 3D: cún lớp 3 (viewBox 256). Khung thân dùng chung được cho thú khác (đổi màu/tai/đuôi). */
"use strict";
const { Doc, E, ground, orb, spec, lighten, darken } = require("./core");

function dog() {
  const D = Doc("dg"), FUR = "#F2B66A", EAR = "#B8742E", BELLY = "#FFE6BE"; let b = ground(D, 128, 232, 84);
  /* đuôi (sau thân) */
  b += `<g transform="rotate(24 196 190)">${E(206, 186, 12, 30, D.radial(FUR, { light: .4 }))}</g>`;
  /* thân + bụng + chân */
  b += orb(D, 128, 188, 58, 50, FUR, { spec: false }) + E(128, 200, 32, 30, D.radial(BELLY, { light: .3, dark: .2 }));
  b += orb(D, 92, 226, 22, 13, FUR, { spec: false }) + orb(D, 164, 226, 22, 13, FUR, { spec: false });
  b += [[86, 228], [98, 230], [158, 230], [170, 228]].map(([x, y]) => E(x, y, 1.4, 3, darken(FUR, .45), 'opacity=".45"')).join("");
  /* vòng cổ + thẻ tên (có độ dày) */
  b += `<path d="M82 150C100 172 156 172 174 150L170 162C152 182 104 182 86 162Z" fill="${D.linear("#FF6B7A", "#C42A4A", [0, 0, 0, 1])}"/><path d="M84 152C104 172 152 172 172 152" stroke="#FFC3CB" stroke-width="2" fill="none" opacity=".6"/>`;
  b += E(131, 183, 11, 11, darken("#E0A100", .35)) + E(128, 180, 11, 11, D.radial("#FFD54A", { light: .5 })) + `<path d="M123 181L127 185L134 176" stroke="#B87900" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + spec(124, 175, 4, 2.2, -30, .85);
  /* tai cụp (sau đầu) */
  b += `<g transform="rotate(16 64 98)">${orb(D, 56, 104, 24, 42, EAR, { spec: false })}${E(52, 96, 6, 14, "#fff", 'opacity=".22"')}</g><g transform="rotate(-16 192 98)">${orb(D, 200, 104, 24, 42, EAR, { spec: false })}</g>`;
  /* đầu + mõm */
  b += orb(D, 128, 106, 66, 58, FUR, { specOp: .55 });
  b += `<g>${E(136, 116, 31, 26, "#C47A2A", 'opacity=".0"')}</g>` + E(88, 92, 18, 17, "#C98438", 'opacity=".78"');   /* mảng đốm quanh mắt trái */
  b += orb(D, 128, 130, 36, 27, BELLY, { spec: false });
  /* mắt: tròng gradient + 2 chấm sáng */
  [[96, 104], [160, 104]].forEach(([x, y], i) => { b += E(x, y + 2, 12.5, 14.5, "#fff", 'opacity=".12"') + E(x, y, 11.5, 14, D.radial("#5A3A66", { light: .25, dark: .5 })) + E(x + 3, y - 5, 4.2, 5.2, "#fff") + E(x - 3.4, y + 5, 2, 2, "#fff", 'opacity=".85"'); });
  b += E(76, 130, 11, 6.5, "#FF8FA8", 'opacity=".6"') + E(180, 130, 11, 6.5, "#FF8FA8", 'opacity=".6"');
  b += `<path d="M90 82Q98 76 106 80M150 80Q158 76 166 82" stroke="${darken(EAR, .3)}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  /* mũi bóng + miệng cười + lưỡi */
  b += `<path d="M128 148C128 158 112 160 106 150M128 148C128 158 144 160 150 150" stroke="#7A3A3A" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  b += `<path d="M114 156C116 176 140 176 142 156Z" fill="#8A2A3A"/><path d="M119 164C121 176 135 176 137 164Z" fill="${D.linear("#FF8FA8", "#E0486A", [0, 0, 0, 1])}"/>`;
  b += E(128, 130, 14, 10, D.radial("#4A2A3A", { light: .35, dark: .45 })) + E(123, 126, 5.5, 3, "#fff", 'opacity=".85"') + E(133, 133, 2, 1.2, "#fff", 'opacity=".4"');
  return ["cun", "Cún con", D.out(b, null, "Cún con")];
}
module.exports = [dog];
