/* QUẦY mẫu Pop 3D: Quán Nước Ép (viewBox 512 320): tường, kệ, mái hiên sọc, mặt quầy nhìn xiên có độ dày, ba vật đặt trên quầy kèm bóng. */
"use strict";
const { Doc, E, ground, orb, spec, lighten, darken } = require("./core");

function counter() {
  const D = Doc("ct"); let b = "";
  /* tường + sàn */
  b += `<rect width="512" height="320" fill="${D.linear("#FFE9D2", "#FFD2B8", [0, 0, 0, 1])}"/>` + `<path d="M0 238L512 238L512 320L0 320Z" fill="${D.linear("#E8B07A", "#C98A52", [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 8; i++) b += `<path d="M${i * 64 + 16} 238L${i * 100 - 120} 320" stroke="#fff" stroke-width="2" opacity=".14"/>`;
  b += `<path d="M0 238L512 238" stroke="${darken("#C98A52", .3)}" stroke-width="3" opacity=".5"/>`;
  /* cửa sổ + kệ */
  b += `<rect x="40" y="72" width="130" height="100" rx="12" fill="${darken("#E8B07A", .3)}"/><rect x="46" y="78" width="118" height="88" rx="8" fill="${D.linear("#BFE9FF", "#8FD0FF", [0, 0, 0, 1])}"/><path d="M52 84L100 84L62 160L52 160Z" fill="#fff" opacity=".35"/><path d="M105 78L105 166M46 122L164 122" stroke="#fff" stroke-width="5" opacity=".8"/>`;
  b += `<rect x="330" y="96" width="140" height="9" rx="4" fill="${darken("#E8B07A", .25)}"/>` + `<rect x="330" y="105" width="140" height="5" rx="2.5" fill="${darken("#E8B07A", .5)}" opacity=".6"/>`;
  [[350, "#FF9A1F"], [382, "#FF4B5C"], [414, "#8BE05A"], [446, "#FFD93D"]].forEach(([x, c]) => { b += E(x + 2, 100, 13, 3, darken(c, .5), 'opacity=".3"') + orb(D, x, 80, 14, 14, c, { specOp: .7 }); });
  /* mái hiên sọc có độ dày + vòng cung */
  b += `<rect x="20" y="20" width="472" height="46" rx="6" fill="${darken("#FF5A7A", .35)}" transform="translate(4 6)"/>`;
  for (let i = 0; i < 12; i++) { const x = 20 + i * 39.34; b += `<path d="M${x} 20h39.4v40a19.7 19.7 0 0 1-39.4 0z" fill="${i % 2 ? D.linear("#FFFDF5", "#F2E4D0", [0, 0, 0, 1]) : D.linear("#FF7A94", "#E04468", [0, 0, 0, 1])}"/>`; }
  b += `<rect x="20" y="20" width="472" height="12" rx="6" fill="#fff" opacity=".28"/>`;
  /* quầy: mặt trên (xiên) + mặt trước + mép dày */
  const top = "M30 226L482 226L512 262L0 262Z";
  b += `<path d="M0 262L512 262L512 320L0 320Z" fill="${D.linear("#7FD6C2", "#3FA89A", [0, 0, 0, 1])}"/>` + `<path d="M0 278L512 278" stroke="#fff" stroke-width="3" opacity=".3"/>`;
  b += `<path d="M0 262L512 262L512 272L0 272Z" fill="${darken("#C98A4E", .35)}"/>` + `<path d="${top}" fill="${D.linear("#FFE3B8", "#EBB878", [0, 0, 0, 1])}"/>` + `<path d="M30 226L482 226" stroke="#fff" stroke-width="3" opacity=".6"/>`;
  b += `<path d="M120 238L392 238" stroke="#fff" stroke-width="10" opacity=".14" stroke-linecap="round"/>`;
  [[70, 296], [256, 296], [442, 296]].forEach(([x, y]) => { b += `<rect x="${x - 44}" y="${y - 20}" width="88" height="40" rx="10" fill="${darken("#3FA89A", .3)}" opacity=".6"/><rect x="${x - 44}" y="${y - 23}" width="88" height="40" rx="10" fill="${D.linear("#9CEAD8", "#5CC4B2", [0, 0, 0, 1])}"/>`; });
  /* 3 vật trên quầy: bóng tiếp đất + khối */
  b += ground(D, 150, 250, 40) + `<g transform="translate(110 168) scale(.55)">${require("./props")[2]().at(2).replace(/<svg[^>]*>|<\/svg>|<title>.*?<\/title>/g, "").replace(/<defs>.*?<\/defs>/s, "")}</g>`;
  return ["quay-nuoc-ep", "Quầy nước ép", D.out(b, "0 0 512 320", "Quầy nước ép")];
}
module.exports = [counter];
