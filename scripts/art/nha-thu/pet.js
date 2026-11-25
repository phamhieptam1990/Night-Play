/* KHUNG VẼ THÚ "Nhà của … (mỗi lớp một thú)": một khung chung (đầu/thân/chân/khăn/thẻ chữ) + móc riêng từng loài (tai, đuôi, mũi, dấu riêng).
   Cùng bộ khung với cún Bi (đầu tại 128,106) nên trang phục (nơ, mũ, kính, vương miện) khớp mọi con. Pop 3D: gradient xuyên tâm, vệt bóng, ánh viền, bóng đáy. */
"use strict";
const { Doc, E, ground, orb, spec, lighten, darken } = require("../tiem/core");
const INK = "#3A1A40";
const GRAD = (D, c1, c2) => D.linear(c1, c2, [0, 0, 0, 1]);

function eyes(D, S, ex) {
  const open = ex === "idle" || ex === "chew" || ex === "wet", ink = S.darkEye ? "#fff" : INK;
  let b = "";
  [[96, 104], [160, 104]].forEach(([x, y]) => {
    if (open) b += E(x, y + 2, 12.5, 14.5, "#fff", 'opacity=".12"') + E(x, y, 11.5, 14, D.radial(S.iris || "#5A3A66", { light: .25, dark: .5 })) + E(x + 3, y - 5, 4.2, 5.2, "#fff") + E(x - 3.4, y + 5, 2, 2, "#fff", 'opacity=".85"');
    else if (ex === "joy") b += `<path d="M${x - 13} ${y + 6}Q${x} ${y - 14} ${x + 13} ${y + 6}" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    else if (ex === "blink") b += `<path d="M${x - 12} ${y + 2}Q${x} ${y + 8} ${x + 12} ${y + 2}" stroke="${ink}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
    else b += `<path d="M${x - 12} ${y - 2}Q${x} ${y + 10} ${x + 12} ${y - 2}" stroke="${ink}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;
  });
  return b;
}
function mouth(D, S, ex) {
  const tg = GRAD(D, "#FF8FA8", "#E0486A"), lipc = S.lip || "#7A3A3A";
  const lip = `<path d="M128 140L128 148" stroke="${lipc}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  let m;
  if (ex === "yawn") m = `<ellipse cx="128" cy="164" rx="18" ry="22" fill="#7A1F34"/><ellipse cx="128" cy="176" rx="12" ry="9" fill="${tg}"/>` + lip;
  else if (ex === "chew") m = `<path d="M108 154C116 166 140 166 148 154" stroke="${lipc}" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + E(122, 162, 3, 2.4, "#FFD9A0") + E(138, 158, 2.4, 2, "#FFD9A0");
  else if (ex === "sleep") m = `<path d="M114 156C120 162 136 162 142 156" stroke="${lipc}" stroke-width="3.2" fill="none" stroke-linecap="round"/>` + lip;
  else if (ex === "joy") m = `<path d="M110 152C112 180 144 180 146 152Z" fill="#8A2A3A"/><path d="M118 166C120 180 136 180 138 166Z" fill="${tg}"/>` + lip;
  else m = `<path d="M128 148C128 158 112 160 106 150M128 148C128 158 144 160 150 150" stroke="${lipc}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M114 156C116 176 140 176 142 156Z" fill="#8A2A3A"/><path d="M119 164C121 176 135 176 137 164Z" fill="${tg}"/>`;
  return m + S.nose(D);
}
function pet(S, ex, label, pre) {
  const wet = ex === "wet", D = Doc(pre || ("p" + S.id + ex.slice(0, 2))), FUR = wet ? darken(S.fur, .1) : S.fur, c = { FUR, EAR: wet ? darken(S.ear, .1) : S.ear };
  const flop = ex === "sleep" || ex === "yawn" ? 1 : wet ? .6 : 0;
  let b = ground(D, 128, 232, 84);
  if (S.back) b += S.back(D, c, flop);
  if (S.tail) b += S.tail(D, c);
  b += orb(D, 128, 188, 58, 50, FUR, { spec: false }) + E(128, 200, 32, 30, D.radial(S.belly, { light: .3, dark: .2 }));
  if (S.arms) b += S.arms(D, c);
  const foot = S.foot || FUR;
  b += orb(D, 92, 226, 22, 13, foot, { spec: false }) + orb(D, 164, 226, 22, 13, foot, { spec: false });
  b += [[86, 228], [98, 230], [158, 230], [170, 228]].map(([x, y]) => E(x, y, 1.4, 3, darken(foot, .45), 'opacity=".45"')).join("");
  b += `<path d="M82 150C100 172 156 172 174 150L170 162C152 182 104 182 86 162Z" fill="${GRAD(D, S.scarf[0], S.scarf[1])}"/><path d="M84 152C104 172 152 172 172 152" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>`;
  b += E(131, 183, 11, 11, darken("#E0A100", .35)) + E(128, 180, 11, 11, D.radial("#FFD54A", { light: .5 })) + spec(124, 175, 4, 2.2, -30, .85) +
    `<text x="128" y="186" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="15" fill="#9A5A00">${S.letter}</text>`;
  if (S.ears) b += S.ears(D, c, flop);
  b += orb(D, 128, 106, 66, 58, FUR, { specOp: wet ? .85 : .55 });
  if (S.mark) b += S.mark(D, c);
  b += orb(D, 128, 130, S.muzzle ? S.muzzle[0] : 36, S.muzzle ? S.muzzle[1] : 27, S.mzCol || S.belly, { spec: false });
  if (ex === "chew") b += E(98, 146, 15, 11, lighten(S.belly, .3), 'opacity=".9"') + E(158, 146, 15, 11, lighten(S.belly, .3), 'opacity=".9"');
  if (S.eyeBack) b += S.eyeBack(D);
  b += eyes(D, S, ex);
  b += E(76, 130, 11, 6.5, S.cheek || "#FF8FA8", 'opacity=".6"') + E(180, 130, 11, 6.5, S.cheek || "#FF8FA8", 'opacity=".6"');
  b += mouth(D, S, ex);
  if (S.front) b += S.front(D, c, ex);
  if (wet) b += [[70, 60, 5], [190, 74, 4], [112, 44, 4.5], [150, 150, 3.5], [60, 190, 4], [200, 200, 5]].map(([x, y, r]) => E(x, y, r * .8, r, "#BFE9FF", 'opacity=".85"') + E(x - 1, y - 1.5, r * .3, r * .4, "#fff")).join("");
  return [S.art + (ex === "idle" ? "" : "-" + ex), label, D.out(b, null, S.name + ", " + S.kind)];
}
const mud = S => () => {
  const D = Doc("mu" + S.id); let b = "";
  [[80, 86, 14, 10], [176, 122, 12, 9], [112, 192, 16, 10], [152, 204, 12, 8], [60, 150, 10, 8], [192, 176, 11, 8], [132, 62, 9, 6], [100, 126, 9, 6]].forEach(([x, y, rx, ry]) => {
    b += E(x + 1.5, y + 2, rx, ry, "#6B4423", 'opacity=".5"') + E(x, y, rx, ry, D.radial("#A9743B", { light: .3, dark: .4 })) + E(x - rx * .3, y - ry * .35, rx * .35, ry * .25, "#fff", 'opacity=".35"');
  });
  return [S.art + "-ban", "Bùn trên lông", D.out(b, null, "Vết bùn")];
};
const POSES = [["idle", "vui"], ["joy", "cười"], ["chew", "nhai"], ["yawn", "ngáp"], ["sleep", "ngủ"], ["blink", "chớp mắt"], ["wet", "ướt"]];
module.exports = S => POSES.map(([ex, l]) => () => pet(S, ex, S.name + " " + l)).concat([mud(S)]);
module.exports.pet = pet;
