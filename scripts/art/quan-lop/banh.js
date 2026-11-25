/* Quán BÁNH (lớp 2): cupcake, donut, cookie, cake, pie, bread; lò nướng 3 đời; biển/tường có bánh. Pop 3D (lõi tiem/core.js). */
"use strict";
const { Doc, E, orb, spec, lighten, darken } = require("../tiem/core");
const { place } = require("./common");

const col = { cupcake: "#FF9EC0", donut: "#8A5A3A", cookie: "#D9A066", cake: "#FF6A86", pie: "#E8A04A", bread: "#D9983E" };
const pal = {
  lv: [["#FFB59A", "#E07A56", "Cam"], ["#FF9EC0", "#E0558A", "Hồng"], ["#FFD66B", "#E8A317", "Vàng"]], wall: ["#FFF3E2", "#FFDDB8"], awn: ["#FF9EC0", "#E0558A"],
  floor: ["#F2D2A4", "#D9A56C"], counter: ["#FFE9CC", "#F2C08A"], shopbg: ["#FFE9F1", "#FFC9DD"], paper: ["#FFF1DC", "#FFDFB8"]
};
const sprk = (x, y, c, i) => `<rect x="${x - 7}" y="${y - 2.4}" width="14" height="5" rx="2.5" fill="${c}" transform="rotate(${i * 41} ${x} ${y})"/>`;
function body(D, id) {
  let b = "";
  if (id === "cupcake") {
    b += `<path d="M72 148L184 148L170 226Q168 236 158 236L98 236Q88 236 86 226Z" fill="${D.linear("#FFE7B8", "#E8B060", [0, 0, 1, 1])}"/>`;
    b += [96, 114, 132, 150].map(x => `<path d="M${x} 152L${x - 3} 232" stroke="#fff" stroke-width="4" opacity=".4" stroke-linecap="round"/>`).join("");
    b += orb(D, 128, 138, 62, 26, "#FF9EC0", { specOp: .7 }) + orb(D, 128, 108, 48, 24, "#FFB6D0", { specOp: .7 }) + orb(D, 128, 80, 32, 20, "#FFC9DD", { specOp: .8 });
    b += orb(D, 128, 58, 11, 11, "#E8203C", { specOp: .85 }) + [[100, 120, "#4FC3F7"], [150, 112, "#FFD43B"], [118, 94, "#7BE0A0"], [142, 86, "#fff"]].map(([x, y, c], i) => sprk(x, y, c, i)).join("");
  } else if (id === "donut") {
    b += E(128, 164, 104, 62, darken("#E8A860", .3)) + E(128, 154, 104, 62, D.radial("#F0B870", { light: .35 })) + orb(D, 128, 146, 96, 56, "#8A5A3A", { specOp: .6 });
    b += E(128, 150, 30, 17, darken("#E8A860", .35)) + E(128, 146, 30, 17, "#FFF1E0", 'opacity=".9"') + E(128, 148, 22, 11, darken("#E8A860", .15), 'opacity=".5"');
    b += [[70, 130, "#FF5A8C"], [96, 112, "#4FC3F7"], [160, 112, "#FFD43B"], [190, 134, "#7BE0A0"], [76, 164, "#fff"], [182, 166, "#FF5A8C"], [128, 176, "#FFD43B"], [112, 182, "#4FC3F7"]].map(([x, y, c], i) => sprk(x, y, c, i)).join("");
  } else if (id === "cookie") {
    b += E(128, 170, 92, 58, darken("#C88A4A", .35)) + orb(D, 128, 156, 92, 58, "#D9A066", { specOp: .5 }) + E(128, 156, 80, 47, "none", `stroke="${lighten("#D9A066", .35)}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"`);
    b += [[86, 138], [128, 126], [166, 144], [104, 168], [146, 172], [76, 170], [180, 170]].map(([x, y]) => E(x, y, 11, 8, D.radial("#6A4028", { light: .3 })) + E(x - 3, y - 3, 3.6, 2.2, "#fff", 'opacity=".5"')).join("");
  } else if (id === "cake") {
    b += `<path d="M52 126L204 126L204 226Q204 238 192 238L64 238Q52 238 52 226Z" fill="${D.linear("#FFE7B8", "#E8B878", [0, 0, 1, 1])}"/><rect x="52" y="160" width="152" height="12" fill="#FF6A86"/><rect x="52" y="196" width="152" height="12" fill="#FF6A86"/>`;
    b += orb(D, 128, 124, 82, 22, "#FFF4F8", { specOp: .7 }) + E(128, 126, 66, 14, "none", 'stroke="#FFC9DD" stroke-width="3" stroke-dasharray="3 8" stroke-linecap="round"');
    b += orb(D, 128, 96, 17, 19, "#E8203C", { specOp: .8 }) + `<path d="M118 80Q128 66 140 76Q132 86 118 80Z" fill="#3E8A32"/>`;
  } else if (id === "pie") {
    const cid = D.next();
    b += E(128, 190, 106, 50, "#8A94A8") + E(128, 182, 106, 50, D.linear("#E8ECF4", "#A8B0C4", [0, 0, 1, 1])) + orb(D, 128, 172, 96, 44, "#E8A04A", { specOp: .5 });
    b += E(128, 170, 70, 31, "#C8402F"); D.def(`<clipPath id="${cid}"><ellipse cx="128" cy="170" rx="70" ry="31"/></clipPath>`);
    b += `<g clip-path="url(#${cid})" stroke="#F2C070" stroke-width="9" stroke-linecap="round">` + [-48, -24, 0, 24, 48].map(o => `<path d="M${128 + o - 30} 130L${128 + o + 30} 214"/><path d="M${128 + o + 30} 130L${128 + o - 30} 214"/>`).join("") + "</g>";
    b += E(128, 170, 70, 31, "none", 'stroke="#F6D08A" stroke-width="5"') + spec(78, 150, 22, 6, -18, .4);
  } else {
    b += E(128, 214, 100, 20, "#4A1D5C", 'opacity=".12"') + orb(D, 128, 164, 98, 58, "#D9983E", { specOp: .5 });
    b += [74, 108, 142, 176].map(x => `<path d="M${x} 134Q${x + 8} 150 ${x + 22} 150" stroke="#F6D08A" stroke-width="10" stroke-linecap="round" fill="none"/>`).join("");
  }
  return b;
}
const draw = (D, id, cx, cy, s) => place(body(D, id), cx == null ? 128 : cx, cy == null ? 140 : cy, s == null ? 1 : s);
function machine(lv) {
  const D = Doc("m" + lv), [c1, c2] = pal.lv[lv - 1]; let b = `<rect x="34" y="40" width="188" height="196" rx="26" fill="${darken(c2, .35)}" transform="translate(5 6)"/>`;
  b += `<rect x="34" y="40" width="188" height="196" rx="26" fill="${D.linear(lighten(c1, .25), c2, [0, 0, 1, 1])}"/><rect x="48" y="50" width="160" height="10" rx="5" fill="#fff" opacity=".45"/>`;
  b += [78, 104, 150, 176].map((x, i) => orb(D, x, 76, 9, 9, ["#FF5A7A", "#FFD43B", "#4FC3F7", "#7BE0A0"][i], { specOp: .8 })).join("");
  b += `<rect x="54" y="100" width="148" height="104" rx="14" fill="${darken(c2, .5)}"/><rect x="60" y="106" width="136" height="92" rx="10" fill="${D.linear("#FFB347", "#E8651A", [0, 0, 0, 1])}"/>`;
  b += `<path d="M78 198Q128 168 178 198Z" fill="#FFE585" opacity=".55"/>` + orb(D, 128, 170, 36, 24, "#E0A860", { specOp: .6 });
  b += `<path d="M64 112L100 112L72 160Z" fill="#fff" opacity=".35"/><rect x="54" y="100" width="148" height="104" rx="14" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/>`;
  b += `<rect x="70" y="212" width="116" height="14" rx="7" fill="#B8C0D0"/><rect x="74" y="214" width="108" height="4" rx="2" fill="#fff" opacity=".7"/>`;
  b += lv > 1 ? `<path d="M128 8l4 9 10 1-7.500 6.500 2.500 10L128 29l-9 5.500 2.500-10L114 18l10-1z" fill="#FFD43B"/>` : "";
  return ["machine-" + lv, "Lò nướng cấp " + lv, D.out(`<ellipse cx="128" cy="240" rx="92" ry="12" fill="${D.shadowGrad()}"/>` + b, null, "Lò nướng bánh cấp " + lv)];
}
const shelf = () => [[170, "#FF9EC0"], [198, "#D9A066"], [226, "#FFB59A"], [254, "#E8A04A"], [278, "#FF6A86"]].map(([x, c]) => `<ellipse cx="${x}" cy="100" rx="11" ry="9" fill="${c}"/><ellipse cx="${x - 3}" cy="96" rx="4" ry="2" fill="#fff" opacity=".5"/>`).join("");
module.exports = { id: "banh", ids: Object.keys(col), col, pal, draw, shelf, emblem: (D, cx, cy, s) => draw(D, "cupcake", cx, cy, s), machine };
