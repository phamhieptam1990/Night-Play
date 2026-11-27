/* Bộ vẽ chung cho 15 linh vật ao (Pop, "đồ chơi mềm"): viewBox 256, không viền đen (viền = màu thân đậm hơn 25%, dày 3), mắt to có 2 chấm sáng, má hồng, gradient 2 điểm dừng + vệt bóng.
   Dùng bởi gen-ao-sinh-vat.js. Chỉ path/circle/ellipse/rect/g/gradient (không filter/image). */
"use strict";
function hex(h) { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
function dark(h, k = 0.25) { return "#" + hex(h).map(v => Math.round(v * (1 - k)).toString(16).padStart(2, "0")).join(""); }
function light(h, k = 0.35) { return "#" + hex(h).map(v => Math.round(v + (255 - v) * k).toString(16).padStart(2, "0")).join(""); }
/* thân: gradient nhạt→đậm theo id; trả { fill, stroke } */
function mat(id, c, k = "a") { return { def: `<linearGradient id="${id}-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light(c, .28)}"/><stop offset="1" stop-color="${c}"/></linearGradient>`, fill: `url(#${id}-${k})`, stroke: dark(c) }; }
const INK = "#3B2A1D";
/* mắt tròn to: (x,y) tâm, r bán kính */
function eye(x, y, r = 12) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .4}" fill="#fff"/><circle cx="${x - r * .38}" cy="${y + r * .4}" r="${r * .2}" fill="#fff"/>`; }
function blush(x, y, rx = 11, ry = 7) { return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FF8FA8" opacity=".55"/>`; }
/* miệng cười nhỏ: (x,y) giữa, w rộng */
function smile(x, y, w = 18) { return `<path d="M${x - w / 2} ${y} Q${x} ${y + w * .55} ${x + w / 2} ${y}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`; }
function shine(d) { return `<path d="${d}" fill="#fff" opacity=".5"/>`; }   /* vệt bóng trắng .5 trên đầu/thân */
function shadow() { return `<ellipse cx="128" cy="238" rx="70" ry="8" fill="${INK}" opacity=".16"/>`; }
/* một hình có viền màu thân đậm */
function shape(tag, attrs, m, sw = 3) { return `<${tag} ${attrs} fill="${m.fill}" stroke="${m.stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`; }
/* đường dày (thân cong): vẽ lớp viền đậm rồi lớp thân */
function tube(d, w, c) { return `<path d="${d}" fill="none" stroke="${dark(c)}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; }
function svg(id, vi, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${vi}"><title>${vi}</title><desc>Linh vật ao: ${vi}. Pop, đồ chơi mềm; mắt to hai chấm sáng, má hồng.</desc><defs>${defs}</defs>${shadow()}${body}</svg>\n`;
}
module.exports = { dark, light, mat, eye, blush, smile, shine, shape, tube, svg, INK };
