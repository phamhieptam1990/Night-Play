/* NGÔI NHÀ NGOÀI VƯỜN cho từng lớp (viewBox 300x270, cùng cỡ/phong cách nhà cún): tường gỗ, mái riêng từng lớp, cửa vòm có thú ló ra.
   Lớp 1 mái hồng tam giác · lớp 2 mái tím có ống khói · lớp 4 mái tre cong xanh · lớp 5 tháp xanh có cờ. */
"use strict";
const { darken, lighten } = require("../tiem/core");
const LG = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const STY = {
  g1: { wall: ["#FBD6C2", "#EBA98A"], line: "#B86A4A", roof: ["#FF9DB8", "#E0558A"], rl: "#A63A66", hi: "#FFD0DE", style: "tri", door: "#7A4A2A", extra: "" },
  g2: { wall: ["#D9D0F5", "#B3A4E8"], line: "#6E5CB0", roof: ["#9B7BFF", "#6A4AD0"], rl: "#41289A", hi: "#D9CCFF", style: "tri", door: "#4A3A7A",
    extra: '<rect x="204" y="34" width="24" height="46" rx="4" fill="#B3A4E8" stroke="#6E5CB0" stroke-width="4"/><rect x="200" y="28" width="32" height="12" rx="4" fill="#6A4AD0" stroke="#41289A" stroke-width="3"/>' },
  g4: { wall: ["#E8E0C8", "#C8BC94"], line: "#8A7A4A", roof: ["#5FCB7E", "#2E9A5A"], rl: "#1F6E3E", hi: "#B8F0C8", style: "curve", door: "#6A4A2A", extra: "" },
  g5: { wall: ["#BFE4F8", "#8FC0E6"], line: "#4A7EAA", roof: ["#5AA8FF", "#2E6FD0"], rl: "#1C4A9A", hi: "#BFDCFF", style: "tower", door: "#34506E", extra: "" }
};
module.exports = (id, petSvg, name) => {
  const S = STY[id], p = "h" + id; let roof;
  if (S.style === "tri") roof = `<path d="M22 124L150 22l128 102z" fill="url(#${p}r)" stroke="${S.rl}" stroke-width="5" stroke-linejoin="round"/><path d="M60 108l90-72 90 72" fill="none" stroke="${S.hi}" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  else if (S.style === "curve") roof = `<path d="M14 128Q40 118 70 84Q110 36 150 28Q190 36 230 84Q260 118 286 128Q220 112 150 112Q80 112 14 128Z" fill="url(#${p}r)" stroke="${S.rl}" stroke-width="5" stroke-linejoin="round"/><path d="M60 112Q110 56 150 46" fill="none" stroke="${S.hi}" stroke-width="5" stroke-linecap="round" opacity=".7"/><circle cx="150" cy="28" r="7" fill="#FFD54A" stroke="#C8920A" stroke-width="3"/>`;
  else roof = `<path d="M42 122L150 46l108 76z" fill="url(#${p}r)" stroke="${S.rl}" stroke-width="5" stroke-linejoin="round"/><rect x="122" y="22" width="56" height="30" rx="6" fill="${S.wall[0]}" stroke="${S.line}" stroke-width="4"/><path d="M114 24L150 2l36 22z" fill="url(#${p}r)" stroke="${S.rl}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M150 2V-6" stroke="${S.rl}" stroke-width="3"/><path d="M150 -6l22 7-22 7z" fill="#FFD54A" stroke="#C8920A" stroke-width="2.5" stroke-linejoin="round"/><circle cx="150" cy="38" r="8" fill="#FFE98A" stroke="${S.line}" stroke-width="3"/>`;
  const top = S.style === "tower" ? 12 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${-top} 300 ${270 + top}" role="img" aria-label="Nhà của ${name}"><title>Nhà của ${name}</title>
<defs>${LG(p + "w", S.wall[0], S.wall[1])}${LG(p + "r", S.roof[0], S.roof[1])}<radialGradient id="${p}s"><stop offset="0" stop-color="#2a1a05" stop-opacity=".4"/><stop offset="1" stop-color="#2a1a05" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="150" cy="248" rx="128" ry="18" fill="url(#${p}s)"/>${S.extra}
<rect x="42" y="112" width="216" height="130" rx="10" fill="url(#${p}w)" stroke="${S.line}" stroke-width="4"/>
<path d="M42 140h216M42 176h216M42 210h216" stroke="${S.line}" stroke-width="3" opacity=".45"/>${roof}
<path d="M100 242V148a50 50 0 0 1 100 0v94z" fill="${S.door}" stroke="${darken(S.door, .25)}" stroke-width="5"/>
<svg x="88" y="112" width="124" height="124" viewBox="0 0 256 256">${petSvg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[^<]*<\/title>/, "")}</svg>
<circle cx="236" cy="150" r="14" fill="#FFF3C8" stroke="${S.line}" stroke-width="3"/><path d="M236 138v24M224 150h24" stroke="${S.line}" stroke-width="2.5"/>
<circle cx="64" cy="150" r="14" fill="#FFF3C8" stroke="${S.line}" stroke-width="3"/><path d="M64 138v24M52 150h24" stroke="${S.line}" stroke-width="2.5"/></svg>\n`;
};
