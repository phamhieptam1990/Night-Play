/* 4 MÓN ĂN MỚI (Pop 3D, 256): cà rốt, rau cải, tre, bánh quy. Các món khác (xương, cá, táo, sữa…) dùng lại tranh có sẵn. */
"use strict";
const { Doc, E, ground, orb, spec, darken } = require("../tiem/core");
const carrot = () => {
  const D = Doc("fc"); let b = ground(D, 128, 232, 70);
  b += `<g transform="rotate(-10 128 140)"><path d="M100 82Q128 66 156 82Q150 150 128 222Q106 150 100 82Z" fill="${D.radial("#FF8A2A", { light: .5 })}" stroke="${D.linear("#FFC48A", "#C85A10", [0, 0, 1, 1])}" stroke-width="1"/>` +
    `<path d="M108 112h14M134 138h14M112 160h12M126 188h8" stroke="#D86A18" stroke-width="4" stroke-linecap="round" opacity=".5"/><path d="M110 96Q112 88 120 86" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".5"/>` +
    `<path d="M128 80Q112 40 92 34Q96 62 118 82Z" fill="${D.radial("#58C25A", { light: .4 })}"/><path d="M128 80Q130 34 150 20Q154 56 134 82Z" fill="${D.radial("#6FD36A", { light: .4 })}"/><path d="M128 80Q148 52 172 52Q160 74 136 82Z" fill="${D.radial("#58C25A", { light: .4 })}"/></g>`;
  return ["ca-rot", "Cà rốt", D.out(b, null, "Cà rốt")];
};
const rau = () => {
  const D = Doc("fr"); let b = ground(D, 128, 232, 76);
  b += orb(D, 128, 150, 70, 62, "#6FCF6A", { spec: false }) + orb(D, 98, 140, 34, 44, "#8EE07E", { spec: false, rot: -20 }) + orb(D, 160, 142, 34, 44, "#7BD770", { spec: false, rot: 22 }) + orb(D, 128, 124, 36, 50, "#A6EB8E");
  b += `<path d="M128 84V190M104 100Q116 140 120 186M152 100Q140 140 136 186" stroke="#5BB755" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".55"/>`;
  return ["rau", "Rau cải", D.out(b, null, "Rau cải")];
};
const tre = () => {
  const D = Doc("ft"); let b = ground(D, 128, 232, 60);
  b += `<g transform="rotate(8 128 130)">`;
  for (let i = 0; i < 3; i++) { const yy = 40 + i * 64; b += `<rect x="102" y="${yy}" width="52" height="60" rx="22" fill="${D.linear("#9BE08A", "#4FA848", [0, 0, 1, 0])}"/><rect x="108" y="${yy + 6}" width="9" height="48" rx="4.5" fill="#fff" opacity=".35"/>`; }
  b += `<path d="M100 104q56 6 56 0M100 168q56 6 56 0" stroke="#3E8A3A" stroke-width="6" stroke-linecap="round" fill="none"/>` +
    `<path d="M154 100Q196 70 206 90Q180 110 154 108Z" fill="${D.radial("#6FD36A", { light: .4 })}"/><path d="M102 164Q60 138 52 156Q76 178 102 172Z" fill="${D.radial("#58C25A", { light: .4 })}"/></g>`;
  return ["tre", "Tre", D.out(b, null, "Cây tre")];
};
const banh = () => {
  const D = Doc("fb"); let b = ground(D, 128, 226, 74);
  b += orb(D, 128, 136, 82, 78, "#E9B36A", { spec: false }) + E(128, 136, 66, 62, "none", 'stroke="#C98A3E" stroke-width="3" stroke-dasharray="5 7" opacity=".7"') + spec(92, 96, 22, 10, -28, .4);
  [[100, 116, 9], [146, 104, 8], [158, 150, 10], [112, 166, 9], [132, 138, 8], [88, 148, 7]].forEach(([x, y, r]) => { b += E(x + 1, y + 1.5, r, r * .8, darken("#6B3A1A", .2)) + E(x, y, r, r * .8, D.radial("#7A4A24", { light: .3, dark: .3 })); });
  return ["banh-quy", "Bánh quy", D.out(b, null, "Bánh quy")];
};
module.exports = [carrot, rau, tre, banh];
