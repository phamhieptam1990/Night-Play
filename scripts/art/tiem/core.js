/* LÕI "POP 3D" cho tranh Tiệm Kem / Nuôi Thú: màu, gradient, khối cầu, vệt bóng, ánh viền, bóng tiếp đất.
   Công thức (docs/PLAN-GAME-VIET-ANH.md mục 10): MỘT nguồn sáng trên-trái; thân gradient xuyên tâm; vệt bóng; ánh viền cạnh đối diện; bóng tiếp đất.
   Chỉ path/ellipse/rect/circle/gradient; KHÔNG filter. Mỗi tệp SVG có tiền tố id riêng (Doc(prefix)). */
"use strict";
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = a => "#" + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => { const x = hex(a), y = hex(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };
const lighten = (c, t) => mix(c, "#FFF8F0", t);
const darken = (c, t) => mix(c, "#4A1D5C", t);       /* bóng đổ ngả tím ấm, không xám */
const f1 = n => Math.round(n * 10) / 10;

function Doc(p) {
  let n = 0; const defs = [];
  const D = {
    next: () => p + (n++),
    def: s => defs.push(s),
    /* gradient xuyên tâm: sáng trên-trái → tối dưới-phải */
    radial(base, o) {
      o = o || {}; const id = D.next(), L = o.light == null ? .55 : o.light, K = o.dark == null ? .4 : o.dark;
      defs.push(`<radialGradient id="${id}" cx="${o.cx || .38}" cy="${o.cy || .32}" r="${o.r || .82}" fx="${o.fx || .32}" fy="${o.fy || .26}"><stop offset="0" stop-color="${lighten(base, L)}"/><stop offset=".34" stop-color="${lighten(base, .1)}"/><stop offset=".7" stop-color="${base}"/><stop offset="1" stop-color="${darken(base, K)}"/></radialGradient>`);
      return `url(#${id})`;
    },
    /* gradient thẳng theo hướng ánh sáng (trên-trái → dưới-phải) */
    linear(c1, c2, v) {
      v = v || [0, 0, 1, 1]; const id = D.next();
      defs.push(`<linearGradient id="${id}" x1="${v[0]}" y1="${v[1]}" x2="${v[2]}" y2="${v[3]}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`);
      return `url(#${id})`;
    },
    /* viền sáng phản xạ ở cạnh dưới-phải, mờ dần về trên-trái */
    rimGrad(col) {
      const id = D.next();
      defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset=".45" stop-color="${lighten(col, .7)}" stop-opacity="0"/><stop offset="1" stop-color="${lighten(col, .75)}" stop-opacity=".75"/></linearGradient>`);
      return `url(#${id})`;
    },
    shadowGrad() {
      const id = D.next();
      defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="#4A1D5C" stop-opacity=".42"/><stop offset=".6" stop-color="#4A1D5C" stop-opacity=".18"/><stop offset="1" stop-color="#4A1D5C" stop-opacity="0"/></radialGradient>`);
      return `url(#${id})`;
    },
    out(body, vb, label) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb || "0 0 256 256"}" role="img" aria-label="${label || ""}"><title>${label || ""}</title><defs>${defs.join("")}</defs>${body}</svg>\n`;
    }
  };
  return D;
}
const E = (cx, cy, rx, ry, fill, x) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}"${x ? " " + x : ""}/>`;
/* bóng tiếp đất ngay dưới vật (nhỏ + nhạt khi vật ở cao: k < 1) */
const ground = (D, cx, cy, rx, k) => E(cx, cy, rx, rx * .26, D.shadowGrad(), `opacity="${k == null ? 1 : k}"`);
/* khối cầu/elip có đủ: thân gradient + ánh viền + (tuỳ chọn) vệt bóng */
function orb(D, cx, cy, rx, ry, col, o) {
  o = o || {};
  const rot = o.rot ? ` transform="rotate(${o.rot} ${f1(cx)} ${f1(cy)})"` : "";
  let s = `<g${rot}>` + E(cx, cy, rx, ry, D.radial(col, o)) +
    E(cx, cy, rx - 1.4, ry - 1.4, "none", `stroke="${D.rimGrad(col)}" stroke-width="2.6"`);
  if (o.spec !== false) s += spec(cx - rx * .36, cy - ry * .42, rx * .3, ry * .17, -28, o.specOp);
  return s + "</g>";
}
/* vệt bóng: elip trắng nghiêng + chấm nhỏ (vật bóng op ~.85, vật nhám ~.35) */
const spec = (cx, cy, rx, ry, rot, op) => `<g transform="rotate(${rot || -30} ${f1(cx)} ${f1(cy)})">${E(cx, cy, rx, ry, "#fff", `opacity="${op == null ? .8 : op}"`)}${E(cx + rx * 1.7, cy + ry * 2.6, rx * .26, rx * .22, "#fff", `opacity="${op == null ? .7 : op * .8}"`)}</g>`;
/* mép dày của vật dẹt: lớp lệch xuống-phải, tối hơn */
const slab = (x, y, w, h, r, col, th, D) => `<rect x="${x + th * .6}" y="${y + th}" width="${w}" height="${h}" rx="${r}" fill="${darken(col, .45)}"/>` + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${D.linear(lighten(col, .3), col, [0, 0, .8, 1])}"/>` + `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none" stroke="${lighten(col, .6)}" stroke-width="1.6" opacity=".55"/>`;
module.exports = { Doc, E, ground, orb, spec, slab, mix, lighten, darken, f1 };
