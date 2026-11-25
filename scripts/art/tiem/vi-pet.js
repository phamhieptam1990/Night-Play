/* CÚN CON "Bi" (Nhà Của Bi) — Pop 3D, viewBox 256. Dựa trên khung của pet.js nhưng có BIỂU CẢM:
   idle (cười lè lưỡi) · joy (mắt cười) · chew (nhai, má phồng) · yawn (ngáp) · sleep (ngủ) · blink (chớp) · wet (ướt, có giọt nước).
   Mắt/mũi/dấu hiệu nhận diện (đốm nâu quanh mắt trái + thẻ tên vàng hình dấu ✓) giữ NGUYÊN ở mọi biểu cảm. */
"use strict";
const { Doc, E, ground, orb, spec, lighten, darken } = require("./core");
const FUR0 = "#F2B66A", EAR0 = "#B8742E", BELLY = "#FFE6BE", INK = "#3A1A40";

function eyes(D, ex) {
  const open = ex === "idle" || ex === "chew" || ex === "wet";
  let b = "";
  [[96, 104], [160, 104]].forEach(([x, y]) => {
    if (open) b += E(x, y + 2, 12.5, 14.5, "#fff", 'opacity=".12"') + E(x, y, 11.5, 14, D.radial("#5A3A66", { light: .25, dark: .5 })) + E(x + 3, y - 5, 4.2, 5.2, "#fff") + E(x - 3.4, y + 5, 2, 2, "#fff", 'opacity=".85"');
    else if (ex === "joy") b += `<path d="M${x - 13} ${y + 6}Q${x} ${y - 14} ${x + 13} ${y + 6}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    else if (ex === "blink") b += `<path d="M${x - 12} ${y + 2}Q${x} ${y + 8} ${x + 12} ${y + 2}" stroke="${INK}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
    else b += `<path d="M${x - 12} ${y - 2}Q${x} ${y + 10} ${x + 12} ${y - 2}" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;   /* yawn, sleep: mắt nhắm */
  });
  return b;
}
function mouth(D, ex) {
  const nose = E(128, 130, 14, 10, D.radial("#4A2A3A", { light: .35, dark: .45 })) + E(123, 126, 5.5, 3, "#fff", 'opacity=".85"') + E(133, 133, 2, 1.2, "#fff", 'opacity=".4"');
  const lip = `<path d="M128 140L128 148" stroke="#7A3A3A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  let m;
  if (ex === "yawn") m = `<ellipse cx="128" cy="164" rx="18" ry="22" fill="#7A1F34"/><ellipse cx="128" cy="176" rx="12" ry="9" fill="${D.linear("#FF8FA8", "#E0486A", [0, 0, 0, 1])}"/>` + lip;
  else if (ex === "chew") m = `<path d="M108 154C116 166 140 166 148 154" stroke="#7A3A3A" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + E(122, 162, 3, 2.4, "#FFD9A0") + E(138, 158, 2.4, 2, "#FFD9A0");
  else if (ex === "sleep") m = `<path d="M114 156C120 162 136 162 142 156" stroke="#7A3A3A" stroke-width="3.2" fill="none" stroke-linecap="round"/>` + lip;
  else if (ex === "joy") m = `<path d="M110 152C112 180 144 180 146 152Z" fill="#8A2A3A"/><path d="M118 166C120 180 136 180 138 166Z" fill="${D.linear("#FF8FA8", "#E0486A", [0, 0, 0, 1])}"/>` + lip;
  else m = `<path d="M128 148C128 158 112 160 106 150M128 148C128 158 144 160 150 150" stroke="#7A3A3A" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M114 156C116 176 140 176 142 156Z" fill="#8A2A3A"/><path d="M119 164C121 176 135 176 137 164Z" fill="${D.linear("#FF8FA8", "#E0486A", [0, 0, 0, 1])}"/>`;
  return m + nose;
}
function dog(ex, label) {
  const wet = ex === "wet", D = Doc("p" + ex.slice(0, 2)), FUR = wet ? darken(FUR0, .12) : FUR0, EAR = wet ? darken(EAR0, .1) : EAR0;
  let b = ground(D, 128, 232, 84);
  b += `<g transform="rotate(24 196 190)">${E(206, 186, 12, 30, D.radial(FUR, { light: .4 }))}</g>`;
  b += orb(D, 128, 188, 58, 50, FUR, { spec: false }) + E(128, 200, 32, 30, D.radial(BELLY, { light: .3, dark: .2 }));
  b += orb(D, 92, 226, 22, 13, FUR, { spec: false }) + orb(D, 164, 226, 22, 13, FUR, { spec: false });
  b += [[86, 228], [98, 230], [158, 230], [170, 228]].map(([x, y]) => E(x, y, 1.4, 3, darken(FUR, .45), 'opacity=".45"')).join("");
  b += `<path d="M82 150C100 172 156 172 174 150L170 162C152 182 104 182 86 162Z" fill="${D.linear("#FF6B7A", "#C42A4A", [0, 0, 0, 1])}"/><path d="M84 152C104 172 152 172 172 152" stroke="#FFC3CB" stroke-width="2" fill="none" opacity=".6"/>`;
  b += E(131, 183, 11, 11, darken("#E0A100", .35)) + E(128, 180, 11, 11, D.radial("#FFD54A", { light: .5 })) + `<path d="M123 181L127 185L134 176" stroke="#B87900" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + spec(124, 175, 4, 2.2, -30, .85);
  const flop = ex === "sleep" || ex === "yawn" ? 6 : 0;
  b += `<g transform="rotate(${16 + flop} 64 98)">${orb(D, 56, 104, 24, 42, EAR, { spec: false })}${E(52, 96, 6, 14, "#fff", 'opacity=".22"')}</g><g transform="rotate(${-16 - flop} 192 98)">${orb(D, 200, 104, 24, 42, EAR, { spec: false })}</g>`;
  b += orb(D, 128, 106, 66, 58, FUR, { specOp: wet ? .85 : .55 }) + E(88, 92, 18, 17, "#C98438", 'opacity=".78"');
  b += orb(D, 128, 130, 36, 27, BELLY, { spec: false });
  if (ex === "chew") b += E(98, 146, 15, 11, lighten(BELLY, .3), 'opacity=".9"') + E(158, 146, 15, 11, lighten(BELLY, .3), 'opacity=".9"');
  b += eyes(D, ex);
  b += E(76, 130, 11, 6.5, "#FF8FA8", 'opacity=".6"') + E(180, 130, 11, 6.5, "#FF8FA8", 'opacity=".6"');
  b += `<path d="M90 82Q98 76 106 80M150 80Q158 76 166 82" stroke="${darken(EAR, .3)}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  b += mouth(D, ex);
  if (wet) b += [[70, 60, 5], [190, 74, 4], [112, 44, 4.5], [150, 150, 3.5], [60, 190, 4], [200, 200, 5]].map(([x, y, r]) => E(x, y, r * .8, r, "#BFE9FF", 'opacity=".85"') + E(x - 1, y - 1.5, r * .3, r * .4, "#fff")).join("");
  return [ex === "idle" ? "cun" : "cun-" + ex, label, D.out(b, null, "Bi, chú cún con")];
}
const mud = () => {
  const D = Doc("mu"); let b = "";
  [[80, 86, 14, 10], [176, 122, 12, 9], [112, 192, 16, 10], [152, 204, 12, 8], [60, 150, 10, 8], [192, 176, 11, 8], [132, 62, 9, 6], [100, 126, 9, 6]].forEach(([x, y, rx, ry]) => {
    b += E(x + 1.5, y + 2, rx, ry, "#6B4423", 'opacity=".5"') + E(x, y, rx, ry, D.radial("#A9743B", { light: .3, dark: .4 })) + E(x - rx * .3, y - ry * .35, rx * .35, ry * .25, "#fff", 'opacity=".35"');
  });
  return ["cun-ban", "Bùn trên lông", D.out(b, null, "Vết bùn")];
};
module.exports = [() => dog("idle", "Cún vui"), () => dog("joy", "Cún cười"), () => dog("chew", "Cún nhai"), () => dog("yawn", "Cún ngáp"),
  () => dog("sleep", "Cún ngủ"), () => dog("blink", "Cún chớp mắt"), () => dog("wet", "Cún ướt"), mud];
