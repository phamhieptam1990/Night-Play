/* 8 VẬT mẫu Pop 3D (viewBox 256): cam, dâu, ly nước ép, bóng, xương, bát ăn, vịt cao su, bảng thực đơn. Mỗi hàm trả [tên, nhãn, svg]. */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("./core");

function orange() {
  const D = Doc("or"), C = "#FF9A1F"; let b = ground(D, 128, 218, 70);
  b += orb(D, 128, 134, 78, 74, C, { specOp: .7 });
  for (let i = 0; i < 16; i++) { const a = i * 2.4, r = 20 + (i * 17) % 46; b += E(128 + Math.cos(a) * r * 1.0, 138 + Math.sin(a) * r * .9, 1.7, 1.2, darken(C, .35), 'opacity=".35"'); }
  b += E(128, 62, 9, 5, darken("#7B4A12", .1)) + E(128, 61, 6, 3, lighten("#9A6A28", .3));
  b += `<path d="M130 62C146 40 172 42 178 52C166 66 144 70 130 62Z" fill="${D.linear("#8BE05A", "#2E9B3E")}"/><path d="M134 60C150 52 164 52 174 52" stroke="#E8FFD0" stroke-width="2" fill="none" opacity=".6"/>`;
  return ["cam", "Quả cam", D.out(b, null, "Quả cam")];
}
function strawberry() {
  const D = Doc("sb"), C = "#FF4B5C"; let b = ground(D, 128, 222, 62);
  const path = "M128 214C84 198 56 150 62 108C66 78 92 66 128 76C164 66 190 78 194 108C200 150 172 198 128 214Z";
  b += `<path d="${path}" fill="${D.radial(C, { cx: .4, cy: .3, r: .9, fx: .33, fy: .26 })}"/><path d="${path}" fill="none" stroke="${D.rimGrad(C)}" stroke-width="3"/>`;
  [[100, 110], [128, 100], [156, 110], [88, 140], [116, 130], [142, 132], [168, 142], [104, 164], [130, 158], [156, 164], [118, 186], [142, 184]].forEach(([x, y]) => { b += E(x + 1.4, y + 2.2, 3.6, 5.2, darken(C, .5), 'opacity=".45"') + E(x, y, 3.4, 5, "#FFE9A8") + E(x - 1, y - 1.6, 1.1, 1.8, "#fff", 'opacity=".9"'); });
  b += spec(98, 98, 14, 8, -35, .75);
  const leaf = (rot) => `<path d="M128 78C120 56 104 56 92 62C102 78 116 84 128 78Z" transform="rotate(${rot} 128 76)" fill="${D.linear("#7BDB58", "#2A8C3C", [0, 0, 1, 1])}"/>`;
  b += [-70, -35, 0, 35, 70].map(leaf).join("") + `<path d="M128 78C126 60 130 48 138 40" stroke="#3E8A32" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  return ["dau", "Quả dâu", D.out(b, null, "Quả dâu")];
}
function juice() {
  const D = Doc("jc"), O = "#FF9A1F"; let b = ground(D, 128, 232, 66);
  const glass = "M70 70L186 70L170 224C169 232 164 236 156 236L100 236C92 236 87 232 86 224Z", liq = "M76 104L180 104L168 222C167 228 163 230 157 230L99 230C93 230 89 228 88 222Z";
  b += `<path d="${glass}" fill="#E6F6FF" opacity=".35"/><path d="${liq}" fill="${D.linear("#FFC24A", "#F07A0A", [0, 0, 0, 1])}"/>`;
  b += E(128, 104, 52, 9, lighten(O, .5)) + E(128, 105, 46, 6.5, D.linear("#FFD070", "#FFA52A", [0, 0, 1, 1]));
  b += `<path d="M96 140C110 150 122 130 138 142C150 150 162 136 172 138L168 222C167 228 163 230 157 230L99 230C93 230 89 228 88 222Z" fill="#FFD27A" opacity=".18"/>`;
  b += [[112, 180, 5], [140, 196, 4], [126, 152, 3.5], [152, 168, 4.5]].map(([x, y, r]) => E(x, y, r, r, "#fff", 'opacity=".28"') + E(x - r * .3, y - r * .3, r * .35, r * .35, "#fff", 'opacity=".8"')).join("");
  b += `<path d="${glass}" fill="none" stroke="${lighten("#BFE6FF", .4)}" stroke-width="3.2" opacity=".9"/><path d="M174 80L162 222" stroke="${darken("#9AD0F5", .3)}" stroke-width="2.4" opacity=".5"/>`;
  b += `<path d="M84 80L98 220" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".65"/><path d="M92 88L96 118" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`;
  b += E(128, 70, 58, 10, "none", `stroke="${lighten("#BFE6FF", .5)}" stroke-width="3.4" opacity=".95"`);
  b += `<path d="M152 66L178 22" stroke="#FF5A8C" stroke-width="9" stroke-linecap="round"/><path d="M152 66L178 22" stroke="#fff" stroke-width="3" stroke-dasharray="7 9" stroke-linecap="round" opacity=".85"/><path d="M175 28L190 24" stroke="#FF5A8C" stroke-width="9" stroke-linecap="round"/>`;
  b += `<g transform="translate(58 66) rotate(-14)">${E(0, 0, 26, 24, D.radial("#FF9A1F", { light: .35 }))}${E(0, 0, 19, 17, "#FFE29A")}${[0, 60, 120, 180, 240, 300].map(a => `<path d="M0 0L${(Math.cos(a * Math.PI / 180) * 17).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 15).toFixed(1)}" stroke="#FFB84A" stroke-width="1.6"/>`).join("")}${spec(-9, -10, 7, 4, -30, .7)}</g>`;
  return ["ly-nuoc-ep", "Ly nước ép", D.out(b, null, "Ly nước ép cam")];
}
function ball() {
  const D = Doc("bl"), C = "#FF5A7A"; let b = ground(D, 128, 226, 72);
  b += orb(D, 128, 140, 82, 82, C, { spec: false });
  b += `<path d="M46 140C70 112 186 112 210 140" stroke="#FFF1F5" stroke-width="16" fill="none" opacity=".95"/><path d="M46 140C70 112 186 112 210 140" stroke="${darken(C, .3)}" stroke-width="2" fill="none" opacity=".25" transform="translate(0 9)"/>`;
  b += `<path d="M60 88C84 116 84 168 66 200" stroke="#FFD93D" stroke-width="14" fill="none" stroke-linecap="round" opacity=".92"/>`;
  b += E(128, 140, 80.6, 80.6, "none", `stroke="${D.rimGrad(C)}" stroke-width="3"`) + spec(92, 96, 26, 13, -35, .85);
  return ["bong", "Quả bóng", D.out(b, null, "Quả bóng")];
}
function bone() {
  const D = Doc("bn"), C = "#FFE3B0"; let b = ground(D, 128, 188, 84);
  const g = D.radial(C, { cx: .4, cy: .28, r: .9, light: .5, dark: .32 });
  b += `<g transform="rotate(-28 128 140)"><rect x="58" y="122" width="140" height="36" rx="16" fill="${g}"/>` + [[56, 120], [56, 160], [200, 120], [200, 160]].map(([x, y]) => E(x, y, 26, 26, g)).join("") +
    `<rect x="60" y="124" width="136" height="32" rx="14" fill="none" stroke="${D.rimGrad(C)}" stroke-width="2.4"/>` + E(100, 130, 34, 5, "#fff", 'opacity=".75"') + E(46, 108, 9, 5, "#fff", 'opacity=".75"') + E(210, 108, 9, 5, "#fff", 'opacity=".6"') + "</g>";
  return ["xuong", "Khúc xương", D.out(b, null, "Khúc xương đồ chơi")];
}
function bowl() {
  const D = Doc("bw"), C = "#5BC8FF"; let b = ground(D, 128, 218, 92);
  b += `<path d="M44 124C44 190 78 214 128 214C178 214 212 190 212 124Z" fill="${D.radial(C, { cx: .35, cy: .3, r: 1, light: .4 })}"/>`;
  b += `<path d="M52 170C80 188 176 188 204 170" stroke="${lighten(C, .6)}" stroke-width="10" fill="none" opacity=".8"/>`;
  b += E(128, 124, 84, 24, D.linear(lighten(C, .45), C, [0, 0, 1, 1])) + E(128, 128, 72, 17, D.linear(darken(C, .5), darken(C, .15), [0, 0, 0, 1]));
  [[96, 126], [118, 122], [140, 126], [160, 122], [108, 132], [130, 132], [152, 132]].forEach(([x, y]) => { b += E(x + 1, y + 2, 9, 7, darken("#C98A3E", .4), 'opacity=".5"') + E(x, y, 9, 7, D.radial("#E6A24E", { light: .5 })); });
  b += `<g fill="${lighten(C, .85)}" opacity=".9">${E(128, 184, 12, 9, "#fff")}${[[110, 168], [123, 163], [135, 163], [148, 168]].map(([x, y]) => E(x, y, 4.2, 5.2, "#fff")).join("")}</g>`;
  b += spec(70, 150, 14, 7, 30, .7) + E(128, 124, 84, 24, "none", `stroke="${lighten(C, .7)}" stroke-width="3"`);
  return ["bat-an", "Bát ăn", D.out(b, null, "Bát ăn có hình dấu chân")];
}
function duck() {
  const D = Doc("dk"), Y = "#FFD93D"; let b = ground(D, 128, 218, 84);
  b += E(128, 170, 78, 56, D.radial(Y, { light: .6 })) + `<path d="M178 150C214 138 224 112 214 100C200 120 188 124 178 128Z" fill="${D.linear(Y, darken(Y, .25), [0, 0, 1, 1])}"/>`;
  b += E(128, 170, 77, 55, "none", `stroke="${D.rimGrad(Y)}" stroke-width="3"`) + `<path d="M92 170C106 200 150 200 162 166C150 176 120 180 92 170Z" fill="${darken(Y, .2)}" opacity=".5"/>`;
  b += orb(D, 108, 98, 46, 44, Y, { spec: false }) + `<path d="M62 100C42 98 38 112 48 116C60 120 70 112 70 104Z" fill="${D.linear("#FFB060", "#F0701A")}"/>` + `<path d="M50 110C58 112 66 110 70 106" stroke="#B84A10" stroke-width="2" fill="none" opacity=".6"/>`;
  b += E(104, 90, 7, 8.5, "#3A1A40") + E(106, 87, 2.4, 3, "#fff") + E(103, 94, 1.2, 1.2, "#fff", 'opacity=".8"') + E(128, 106, 9, 5.5, "#FF8FA8", 'opacity=".55"') + spec(90, 76, 14, 7, -32, .85);
  b += `<g opacity=".95">${E(64, 154, 7, 7, "#fff")}${E(52, 176, 10, 10, "#fff")}${E(70, 184, 6, 6, "#EAF8FF")}${E(58, 170, 3, 3, "#BFE9FF")}</g>`;
  return ["vit-cao-su", "Vịt cao su", D.out(b, null, "Vịt cao su")];
}
function menu() {
  const D = Doc("mn"), W = "#C98A4E"; let b = ground(D, 128, 232, 78, .8);
  b += `<rect x="116" y="30" width="6" height="26" rx="3" fill="${darken(W, .3)}"/><rect x="170" y="30" width="6" height="26" rx="3" fill="${darken(W, .3)}"/><path d="M119 34L146 12L173 34" stroke="#8A5A2A" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  b += slab(54, 50, 176, 176, 18, W, 9, D);
  b += `<rect x="68" y="64" width="148" height="148" rx="10" fill="${D.linear("#3D4A63", "#27304A", [0, 0, 1, 1])}"/><rect x="68" y="64" width="148" height="148" rx="10" fill="none" stroke="${darken("#27304A", .3)}" stroke-width="3"/>`;
  b += `<path d="M82 68L206 68L82 120Z" fill="#fff" opacity=".07"/>`;
  [[94, "#FFD93D", 70], [126, "#FF8FA8", 86], [158, "#8FE0FF", 62]].forEach(([y, c, w]) => { b += E(92, y, 11, 11, D.radial(c, { light: .4 })) + `<rect x="112" y="${y - 7}" width="${w}" height="6" rx="3" fill="#F4F0E4" opacity=".9"/><rect x="112" y="${y + 4}" width="${w - 24}" height="4" rx="2" fill="#F4F0E4" opacity=".5"/>`; });
  b += `<path d="M84 196C110 186 150 204 196 192" stroke="#F4F0E4" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>`;
  return ["thuc-don", "Bảng thực đơn", D.out(b, null, "Bảng thực đơn")];
}
module.exports = [orange, strawberry, juice, ball, bone, bowl, duck, menu];
