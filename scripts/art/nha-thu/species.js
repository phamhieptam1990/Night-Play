/* BỐN LOÀI THÚ cho lớp 1, 2, 4, 5 (lớp 3 = cún Bi có sẵn). Mỗi loài: bảng màu + móc vẽ tai/đuôi/dấu riêng (khung chung ở pet.js).
   Dấu nhận diện: khăn + thẻ chữ cái tiếng Việt (A, Ă, Â, Ê) + nét riêng loài (tai dài hồng, vằn trán, mảng mắt đen, sừng/cánh). */
"use strict";
const { E, orb, darken, lighten } = require("../tiem/core");
const stroke = (c, w, d, o) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${o || ""}/>`;
const pinkNose = (c, c2) => D => `<path d="M118 130Q128 124 138 130Q134 141 128 142Q122 141 118 130Z" fill="${D.radial(c, { light: .35, dark: .4 })}"/>` + E(124, 130, 4, 2.2, "#fff", 'opacity=".8"');

/* ---- LỚP 1: THỎ "Bông" ---- */
const tho = {
  id: "g1", art: "tho", name: "Bông", kind: "chú thỏ", letter: "A", fur: "#F6E3EA", ear: "#F6E3EA", belly: "#FFFFFF", cheek: "#FF9FB8", iris: "#7A3A56",
  scarf: ["#6CCB7A", "#2E9A4D"], muzzle: [34, 25],
  ears(D, c, fl) {
    const a = 12 + fl * 24, drop = fl * 26;
    const one = (x, s) => `<g transform="rotate(${s * a} ${x} 96)">${orb(D, x, 54 + drop * .3, 17, 46, c.FUR, { spec: false })}${E(x, 58 + drop * .3, 8, 34, D.radial("#FFA9C0", { light: .3, dark: .3 }), 'opacity=".95"')}</g>`;
    return one(98, -1) + one(158, 1);
  },
  tail: D => orb(D, 206, 208, 17, 17, "#FFFFFF", { spec: false }),
  nose: pinkNose("#FF8FB0"),
  front: (D, c, ex) => ex === "idle" || ex === "blink" || ex === "wet" ? `<path d="M121 149h14v9a7 7 0 0 1-14 0z" fill="#fff" stroke="#E9C7D2" stroke-width="2" stroke-linejoin="round"/><path d="M128 149v13" stroke="#E9C7D2" stroke-width="2"/>` : "",
  mark: () => `<path d="M122 56q6 8 12 0q-6-10-12 0z" fill="#FF9FB8" opacity=".8"/>`
};

/* ---- LỚP 2: MÈO "Mây" ---- */
const meo = {
  id: "g2", art: "meo", name: "Mây", kind: "chú mèo", letter: "Ă", fur: "#B9BEE8", ear: "#B9BEE8", belly: "#F7F4FF", cheek: "#FF9FB8", iris: "#2E7D6B",
  scarf: ["#FF7AA8", "#D1436F"], lip: "#7A3A5A", muzzle: [36, 26],
  ears(D, c, fl) {
    const t = fl * 8, ear = (sx) => { const m = x => sx > 0 ? x : 256 - x;
      return `<path d="M${m(74)} ${86 + t}L${m(68)} ${34 + t * 2}Q${m(68)} ${26 + t * 2} ${m(76)} ${30 + t * 2}L${m(122)} ${62}Z" fill="${D.radial(c.FUR, { light: .35 })}" stroke="${darken(c.FUR, .28)}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M${m(80)} ${74 + t}L${m(77)} ${44 + t * 2}L${m(108)} ${64}Z" fill="#FFB3C9" opacity=".95" stroke="#FFB3C9" stroke-width="3" stroke-linejoin="round"/>`; };
    return ear(1) + ear(-1);
  },
  tail: (D, c) => stroke(darken(c.FUR, .22), 27, "M182 216Q246 218 236 156Q232 138 214 140") + stroke(c.FUR, 21, "M182 216Q246 218 236 156Q232 138 214 140") + stroke("#fff", 5, "M190 208Q236 206 230 162", 'opacity=".3"') +
    stroke("#7E84C4", 6, "M222 190l12-6M226 170l12-5", 'opacity=".8"'),
  nose: pinkNose("#FF8FB0"),
  mark: () => stroke("#7E84C4", 5, "M112 58q4 12 0 20M128 54v22M144 58q-4 12 0 20", 'opacity=".85"'),
  front: () => stroke("#6E72AE", 2.6, "M72 138L36 130M72 146L38 150M184 138L220 130M184 146L218 150", 'opacity=".75"')
};

/* ---- LỚP 4: GẤU TRÚC "Trúc" ---- */
const BLK = "#3B3646";
const gautruc = {
  id: "g4", art: "gautruc", name: "Trúc", kind: "chú gấu trúc", letter: "Â", fur: "#FBFAF7", ear: BLK, belly: "#FFFFFF", cheek: "#FF9FB8", darkEye: 1, iris: "#2A2433", foot: BLK,
  scarf: ["#4CC38A", "#2A8F5E"], lip: "#5A4A5A", muzzle: [34, 25], mzCol: "#F1EEE8",
  ears: D => orb(D, 76, 58, 22, 22, BLK, { spec: false }) + orb(D, 180, 58, 22, 22, BLK, { spec: false }),
  tail: D => orb(D, 204, 208, 14, 14, BLK, { spec: false }),
  arms: D => `<g transform="rotate(14 66 190)">${orb(D, 64, 190, 15, 30, BLK, { spec: false })}</g><g transform="rotate(-14 192 190)">${orb(D, 192, 190, 15, 30, BLK, { spec: false })}</g>`,
  eyeBack: D => `<g transform="rotate(24 94 106)">${E(94, 106, 17, 23, D.radial(BLK, { light: .2, dark: .3 }))}</g><g transform="rotate(-24 162 106)">${E(162, 106, 17, 23, D.radial(BLK, { light: .2, dark: .3 }))}</g>`,
  nose: D => E(128, 130, 11, 8, D.radial("#3A2A3A", { light: .35, dark: .4 })) + E(124, 127, 4, 2.2, "#fff", 'opacity=".8"'),
  mark: () => `<path d="M120 62q8-8 16 0q-8 8-16 0z" fill="#E8E4DC" opacity=".5"/>`
};

/* ---- LỚP 5: RỒNG NHỎ "Tia" ---- */
const rong = {
  id: "g5", art: "rong", name: "Tia", kind: "chú rồng nhỏ", letter: "Ê", fur: "#74D8B8", ear: "#4FB896", belly: "#FFF1C4", cheek: "#FF9FB8", iris: "#7A3A1A",
  scarf: ["#FF8A3D", "#D9591A"], lip: "#2E7A62", muzzle: [38, 28], mzCol: "#D6F5E6",
  back: (D, c, fl) => `<g transform="rotate(-34 70 130)">${orb(D, 60, 124, 17, 34, "#FF9F6B", { spec: false })}${E(62, 118, 6, 18, "#FFD2A8", 'opacity=".55"')}</g><g transform="rotate(34 186 130)">${orb(D, 196, 124, 17, 34, "#FF9F6B", { spec: false })}${E(194, 118, 6, 18, "#FFD2A8", 'opacity=".55"')}</g>`,
  tail: (D, c) => stroke(darken(c.FUR, .25), 27, "M184 216Q248 220 240 160") + stroke(c.FUR, 21, "M184 216Q248 220 240 160") + orb(D, 240, 150, 15, 17, "#FF9F6B", { spec: false }),
  ears: (D, c, fl) => `<g transform="rotate(${-26 - fl * 6} 66 100)">${orb(D, 62, 104, 18, 26, c.EAR, { spec: false })}</g><g transform="rotate(${26 + fl * 6} 190 100)">${orb(D, 194, 104, 18, 26, c.EAR, { spec: false })}</g>` +
    `<path d="M92 70Q86 30 104 24Q114 40 114 62Z" fill="#FFD25A" stroke="#E0A100" stroke-width="3" stroke-linejoin="round"/><path d="M164 70Q170 30 152 24Q142 40 142 62Z" fill="#FFD25A" stroke="#E0A100" stroke-width="3" stroke-linejoin="round"/>`,
  nose: D => E(118, 130, 4.4, 3.2, "#2E7A62") + E(138, 130, 4.4, 3.2, "#2E7A62"),
  mark: () => `<path d="M118 62q10-12 20 0q-10 6-20 0z" fill="#FF9F6B" opacity=".9"/>` + E(98, 78, 5, 3, "#FFF", 'opacity=".25"')
};
module.exports = { tho, meo, gautruc, rong };
