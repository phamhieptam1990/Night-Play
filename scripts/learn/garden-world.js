/* Vẽ phần ĐẤT MỞ RỘNG quanh khu vườn Học Vui: núi (phía trên), suối (bên phải), đường làng + vài nhà (bên trái, phía dưới).
   Tách riêng khỏi gen-scene-art.js. Khu vườn cũ giữ NGUYÊN toạ độ 0..1280 × 0..880; phần mới nằm ở toạ độ âm / lớn hơn
   (viewBox của "thế giới" = [-MXL, -MT, WW, HH]). Dùng rng riêng nên không làm đổi cảnh cũ.
   Dùng: const world = require("./garden-world")(deps); trong scene(): world.sky(time), world.mountains(time), world.groundRect(),
   world.under(time), world.items(time), world.over(time). */
"use strict";
module.exports = function makeWorld(d) {
  const { f, rng, G, ell, shadow, tuft, flower, rock, bush, pine, bigTree, house, pathNet, hedge, flowerPatch, hay, barrel, crate, W, H } = d;
  const MXL = 200, MXR = 215, MT = 130, MB = 30, WW = W + MXL + MXR, HH = H + MT + MB;
  const VIEW = [-MXL, -MT, WW, HH];
  const r0 = () => rng(2024);

  /* đường cong mượt đi qua các điểm (Catmull-Rom → Bézier) */
  const smooth = pts => { let s = `M${f(pts[0][0])} ${f(pts[0][1])}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; s += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`; } return s; };

  /* ---------- trời ---------- */
  function sky(time) {
    const h = MT + 160, x = -MXL, y = -MT;
    if (time === "day") return `<rect x="${x}" y="${y}" width="${WW}" height="${h}" fill="url(#gSkyDay)"/>`;
    if (time === "dusk") return `<rect x="${x}" y="${y}" width="${WW}" height="${h}" fill="#F9A66B"/><rect x="${x}" y="-120" width="${WW}" height="280" fill="#FFD08A" opacity=".6"/>`;
    return `<rect x="${x}" y="${y}" width="${WW}" height="${h}" fill="#14183F"/>`;
  }
  function cloud(x, y, s) { return G(x, y, [[-30, 0, 34, 20], [4, -12, 40, 26], [40, 0, 32, 18], [8, 6, 52, 16]].map(([a, b, rx, ry]) => ell(a, b, rx * s, ry * s, "#fff", null)).join("").replace(/<ellipse/g, '<ellipse opacity=".92"')); }

  /* ---------- núi: 3 lớp, đỉnh tròn mềm, mũ tuyết ---------- */
  function mountain(x, by, w, h, c, snow) {
    const L = `M${x - w / 2} ${by}C${x - w * .22} ${by - h * .55} ${x - w * .1} ${by - h} ${x} ${by - h}C${x + w * .1} ${by - h} ${x + w * .22} ${by - h * .55} ${x + w / 2} ${by}Z`;
    const shade = `M${x} ${by - h}C${x + w * .1} ${by - h} ${x + w * .22} ${by - h * .55} ${x + w / 2} ${by}L${x + w * .06} ${by}Q${x + w * .16} ${by - h * .5} ${x} ${by - h}Z`;
    let o = `<path d="${L}" fill="${c[0]}" stroke="${c[2]}" stroke-width="4" stroke-linejoin="round"/><path d="${shade}" fill="${c[1]}" opacity=".75"/>`;
    if (snow) { const a = by - h * .8, t = by - h; o += `<path d="M${x - w * .1} ${a}C${x - w * .06} ${by - h * .94} ${x - w * .03} ${t} ${x} ${t}C${x + w * .03} ${t} ${x + w * .06} ${by - h * .94} ${x + w * .1} ${a}Q${x + w * .06} ${a + h * .08} ${x + w * .03} ${a}Q${x} ${a + h * .1} ${x - w * .03} ${a}Q${x - w * .06} ${a + h * .08} ${x - w * .1} ${a}Z" fill="#fff" stroke="#DCE9F2" stroke-width="2.4" stroke-linejoin="round"/>`; }
    return o;
  }
  function mountains(time) {
    const r = r0(); let o = "";
    for (let x = -MXL - 120; x < WW; x += 400) o += mountain(x + r() * 60, 40, 560 + r() * 120, 300 + r() * 110, ["#BFE0E6", "#9CC6D2", "#7FB0BE"], true);
    for (let x = -MXL - 40; x < WW; x += 330) o += mountain(x + r() * 60, 44, 470 + r() * 90, 200 + r() * 90, ["#8CD0A8", "#5DB187", "#3E8F68"], r() < .5);
    for (let x = -MXL; x < WW; x += 260) o += mountain(x + r() * 50, 50, 380 + r() * 80, 110 + r() * 60, ["#7BC95C", "#4FA83B", "#2F7A2F"], false);
    if (time !== "night") for (let i = 0; i < 7; i++) o += cloud(-MXL + 120 + i * 360 + r() * 80, -MT + 60 + r() * 120, .8 + r() * .5);
    return o;
  }

  /* ---------- mặt đất ---------- */
  const groundRect = () => `<rect x="${-MXL}" y="-30" width="${WW}" height="${H + MB + 30}" fill="url(#gGrass)"/>`;
  function fringe() { const r = rng(5); let o = ""; for (let x = -MXL - 60; x < WW; x += 90) o += ell(x, -26 + r() * 10, 70 + r() * 30, 34 + r() * 12, r() < .5 ? "#79C044" : "#6FB43F", null); return o; }

  /* đường chính (toạ độ thế giới) */
  const LAMPS = [[70, 860], [1215, 860]];
  const ROAD = [[-190, 885], [100, 900], [640, 905], [1100, 892], [1480, 880]];   /* đường làng chạy ngang phía dưới khu giữa, ngăn khu hoa màu */

  function under(time) {
    const r = rng(31); let o = "";
    /* cỏ, hoa rải ở phần mới (không đụng khu vườn cũ) */
    const out = (x, y) => (x < -10 || x > W + 10 || y > H + 10) && y > 30;
    for (let i = 0; i < 520; i++) { const x = -MXL + r() * WW, y = 40 + r() * (H + MB - 40); if (out(x, y)) o += tuft(x, y, .7 + r() * .6); }
    const cols = ["#FFFFFF", "#FFD24D", "#FF8FB0", "#B79CF0"];
    for (let i = 0; i < 160; i++) { const x = -MXL + r() * WW, y = 60 + r() * (H + MB - 60); if (out(x, y)) o += flower(x, y, cols[Math.floor(r() * 4)]); }
    o += fringe();
    return o;
  }

  /* ---------- vật đứng: làng, cây, đá (xếp theo độ sâu y cùng các vật của vườn) ---------- */
  function lamp(x, y, night) {
    return G(x, y, shadow(14, 5, .22) + `<rect x="-3" y="-70" width="6" height="70" rx="2" fill="#6E4A2A" stroke="#3E2A16" stroke-width="2"/><circle cx="0" cy="-76" r="10" fill="${night ? "#FFE08A" : "#FFF3E0"}" stroke="#3E2A16" stroke-width="3"/>`);
  }
  function sign(x, y) { return G(x, y, shadow(16, 5, .22) + `<rect x="-3" y="-64" width="6" height="64" fill="#8A5A2B" stroke="#4E3016" stroke-width="2"/><path d="M-6 -62H38L48 -50L38 -38H-6Z" fill="#E7C27E" stroke="#4E3016" stroke-width="3" stroke-linejoin="round"/><path d="M-60 -34H-14V-18H-60L-70 -26Z" fill="#E7C27E" stroke="#4E3016" stroke-width="3" stroke-linejoin="round"/>`); }
  function items(time) {
    const out = [], add = (y, svg) => out.push({ d: y, svg: String(svg) }), night = time === "night";
    LAMPS.forEach(([x, y]) => add(y, lamp(x, y, night)));
    /* vài cây thông ở góc dưới cho khung gọn gàng */
    [[-130, 850], [1395, 845]].forEach(([x, y]) => add(y, pine(x, y, .8)));
    return out;
  }

  /* ---------- lớp phủ theo giờ (chỉ phần mới): sao, trăng, ánh đèn ---------- */
  function over(time) {
    let o = "";
    if (time === "night") {
      const r = rng(17);
      for (let i = 0; i < 90; i++) o += `<circle cx="${f(-MXL + r() * WW)}" cy="${f(-MT + r() * (MT - 20))}" r="${f(1 + r() * 1.8)}" fill="#fff" opacity="${f(.5 + r() * .5)}"/>`;
      o += `<circle cx="1000" cy="-70" r="46" fill="#FFF3C4"/>`;
      LAMPS.forEach(([x, y]) => o += `<circle cx="${x}" cy="${y - 60}" r="70" fill="url(#gGlow)"/>`);
    } else if (time === "dusk") o += `<circle cx="1060" cy="-60" r="56" fill="#FFB562" opacity=".9"/>`;
    return o;
  }
  const tintRect = (c, a) => `<rect x="${-MXL}" y="${-MT}" width="${WW}" height="${HH}" fill="${c}" opacity="${a}"/>`;

  return { MXL, MXR, MT, MB, WW, HH, VIEW, sky, mountains, groundRect, under, items, over, tintRect };
};
