/* Sinh tranh nền "Lớp học truyện" (Học Vui): learn/story/art/bg-<môn>-<lớp>-<p|l>.svg (30 ảnh) + icon điểm dừng.
   Môn: toan = Đảo Số, tviet = Rừng Chữ, tanh = Vịnh Từ. Dọc 390x680, ngang 800x360. Có dải đường uốn lượn ở giữa; nửa trên trống cho tiêu đề; KHÔNG chữ.
   Chạy: node scripts/art/gen-story.js. Cảnh trong story/<môn>.js, hàm chung story/common.js, icon story/icons.js. */
const fs = require("fs"), path = require("path");
const R = require("../../learn/story/js/route.js");   /* vị trí điểm dừng trên bản đồ truyện (LAY, chain): vật trang trí tránh các chỗ này */
const C = require("./story/common"), { icons } = require("./story/icons");
const OUT = path.join(__dirname, "../../learn/story/art");
fs.mkdirSync(OUT, { recursive: true });
const SUB = { toan: require("./story/toan"), tviet: require("./story/tviet"), tanh: require("./story/tanh") };
const NAMES = { toan: "Đảo Số", tviet: "Rừng Chữ", tanh: "Vịnh Từ" };
const svg = (vb, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;
const w = (n, s) => fs.writeFileSync(path.join(OUT, n), s);

function waypoints(L, W, H, hz, g) {
  const flip = g % 2 ? 1 : -1, P = [];
  if (!L) { const n = 6 + (g > 2); for (let i = 0; i <= n; i++) { const t = i / n, y = H + 30 - t * (H + 30 - (hz + 62 + g * 6)), a = 70 + g * 6 - t * 20; P.push([W / 2 + flip * (i % 2 ? 1 : -1) * a * (i === 0 ? .3 : 1), y]); } }
  else { const n = 7 + (g > 2), m = hz + (H - hz) * .55; for (let i = 0; i <= n; i++) { const t = i / n; P.push([-30 + t * (W + 60), m + flip * (i % 2 ? 1 : -1) * (36 + g * 4) * (i === 0 || i === n ? .4 : 1)]); } }
  return P;
}
function scene(subj, g, L) {
  const S = SUB[subj], W = L ? 800 : 390, H = L ? 360 : 680, pal = S.pal[g], hz = L ? 112 + g * 3 : 196 + g * 8;
  C.setSeed(1000 + g * 77 + (L ? 5 : 0) + subj.charCodeAt(1) * 13);
  const c = { W, H, hz, g, L, pal }, { d, pts } = C.curve(waypoints(L, W, H, hz, g)), rw = L ? 42 : 58;
  let s = `<defs>${C.lg("sk", pal.s1, pal.s2)}${C.lg("gr", pal.g1, pal.g2)}<radialGradient id="vg" cx=".5" cy=".55" r=".8">`
    + `<stop offset=".65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></radialGradient></defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#sk)"/>`;
  for (let i = 0; i < 3 + (L ? 2 : 0); i++) s += C.cloud(W * (.12 + i * (L ? .2 : .3) + C.rnd() * .1), 24 + C.rnd() * (hz * .45), .7 + C.rnd() * .5, .85);
  if (g >= 2) for (let i = 0; i < 6; i++) s += C.sparkle(C.rnd() * W, 10 + C.rnd() * hz * .6, 3 + C.rnd() * 3);
  s += (S.sky ? S.sky(c) : "") + S.far(c);
  s += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#gr)"/><path d="M0 ${hz}h${W}" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
  for (let i = 0; i < (L ? 30 : 40); i++) { const x = Math.round(C.rnd() * W), y = Math.round(hz + 14 + C.rnd() * (H - hz - 14));
    s += `<path d="M${x} ${y}q-2-9-5-10M${x} ${y}q0-10 1-13M${x} ${y}q2-9 6-9" stroke="#fff" stroke-opacity=".28" stroke-width="2.200" stroke-linecap="round" fill="none"/>`;
  }
  s += (S.mid ? S.mid(c) : "") + C.road(d, rw, pal.road);
  const items = [], props = typeof S.props === "function" ? S.props(c) : S.props, clear = rw / 2 + (L ? 30 : 46), box = [14, W - 14, hz + 12, H - 6];
  const dep = y => .55 + .7 * (y - hz) / (H - hz), o = L ? "l" : "p", zones = Object.values(R.LAY[o]);
  for (let k = 2; k <= 8; k++) zones.push(...R.chain(k, o));   /* mọi chỗ điểm dừng/đảo có thể nằm (đơn vị %) */
  /* vật có khung hw (nửa rộng) x ht (cao) nhân tỉ lệ: không được chạm dải đường (kèm lề) và không chồng vùng điểm dừng (icon + nhãn) */
  const free = (hw, ht, sc) => (x, y) => {
    const k = sc(y), x0 = x - hw * k, x1 = x + hw * k, y0 = y - ht * k, y1 = y + 4, m = rw / 2 + 6;
    if (pts.some(p => p[0] > x0 - m && p[0] < x1 + m && p[1] > y0 - m && p[1] < y1 + m)) return false;
    return !zones.some(z => { const cx = z[0] * W / 100, cy = z[1] * H / 100; return x0 < cx + 62 && x1 > cx - 62 && y0 < cy + 56 && y1 > cy - 36; });
  };
  const bigN = 1 + g, bigK = y => dep(y) * (L ? .95 : 1);
  const bigs = C.spots(bigN, [30, W - 30, hz + 18, hz + (H - hz) * .5], pts, clear + 30, L ? 150 : 120, [], 110, free(60, 120, bigK));
  bigs.forEach((p, i) => items.push([p[1], S.big[(i + g) % S.big.length](p[0].toFixed(0), p[1].toFixed(0), bigK(p[1]).toFixed(2))]));
  const n = Math.round((L ? 14 : 16) + g * (L ? 3 : 4));
  C.spots(n, box, pts, clear, L ? 40 : 44, bigs, 60, free(40, 62, y => dep(y) * 1.15)).forEach((p, i) =>
    items.push([p[1], props[i % props.length](p[0].toFixed(0), p[1].toFixed(0), (dep(p[1]) * (.85 + C.rnd() * .3)).toFixed(2))]));
  s += items.sort((a, b) => a[0] - b[0]).map(i => i[1]).join("");
  return s + `<rect width="${W}" height="${H}" fill="url(#vg)"/>`;
}
for (const subj of Object.keys(SUB)) for (let g = 0; g < 5; g++) {
  w(`bg-${subj}-${g + 1}-p.svg`, svg("0 0 390 680", scene(subj, g, false), `${NAMES[subj]} lớp ${g + 1}`));
  w(`bg-${subj}-${g + 1}-l.svg`, svg("0 0 800 360", scene(subj, g, true), `${NAMES[subj]} lớp ${g + 1}`));
}
for (const k in icons) w(`${k}.svg`, svg("0 0 96 96", icons[k], k));
console.log("ok", fs.readdirSync(OUT).length, "tệp");
