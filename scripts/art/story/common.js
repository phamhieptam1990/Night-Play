/* Hàm dùng chung cho gen-story: gradient, đường uốn lượn (Catmull-Rom), chọn chỗ đặt vật không đè đường, mây. */
let seed = 1;
exports.setSeed = n => { seed = n % 2147483646 + 1; };
const rnd = exports.rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
exports.pick = a => a[Math.floor(rnd() * a.length)];
exports.lg = (id, a, b, h) => `<linearGradient id="${id}" x1="0" y1="0" x2="${h ? 1 : 0}" y2="${h ? 0 : 1}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
exports.shadow = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${(rx * .28).toFixed(1)}" fill="#000" opacity=".15"/>`;
const f = n => +n.toFixed(1);
exports.cloud = (x, y, s, o) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})" opacity="${o || .9}"><ellipse cx="0" cy="0" rx="46" ry="14" fill="#fff"/><circle cx="-14" cy="-10" r="16" fill="#fff"/><circle cx="12" cy="-14" r="20" fill="#fff"/><circle cx="30" cy="-4" r="12" fill="#fff"/></g>`;
exports.sparkle = (x, y, r, c) => `<path d="M${f(x)} ${f(y - r)}Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)}Q${f(x)} ${f(y)} ${f(x)} ${f(y + r)}Q${f(x)} ${f(y)} ${f(x - r)} ${f(y)}Q${f(x)} ${f(y)} ${f(x)} ${f(y - r)}z" fill="${c || "#fff"}" opacity=".85"/>`;
/* đường qua các điểm → {d, pts (mẫu để tránh đè)} */
exports.curve = P => {
  let d = `M${f(P[0][0])} ${f(P[0][1])}`; const pts = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    for (let t = 0; t < 1; t += .1) { const u = 1 - t;
      pts.push([u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0], u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]]); }
  }
  return { d, pts };
};
/* chọn n chỗ trong vùng [x0,x1]x[y0,y1], cách đường ≥ clear và cách nhau ≥ gap; trả về mảng [x,y] sắp theo y (xa trước) */
exports.spots = (n, box, pts, clear, gap, taken, up) => {
  const out = []; taken = taken || [];
  for (let k = 0; k < n * 40 && out.length < n; k++) {
    const x = box[0] + rnd() * (box[1] - box[0]), y = box[2] + rnd() * (box[3] - box[2]);
    if (pts.some(p => Math.hypot(p[0] - x, (p[1] - y) * 1.3) < clear)) continue;
    if (up && pts.some(p => Math.abs(p[0] - x) < up * .45 && y - p[1] > 0 && y - p[1] < up)) continue;
    if (out.concat(taken).some(p => Math.hypot(p[0] - x, (p[1] - y) * 1.5) < gap)) continue;
    out.push([x, y]);
  }
  return out.sort((a, b) => a[1] - b[1]);
};
/* dải đường: bóng, viền, nền, vệt sáng, chấm */
exports.road = (d, w, c) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="${w + 8}" stroke-linecap="round" transform="translate(0 6)"/>
<path d="${d}" fill="none" stroke="${c[0]}" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${c[1]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${w * .45}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${c[0]}" stroke-opacity=".5" stroke-width="2.5" stroke-dasharray="2 12" stroke-linecap="round"/>`;
