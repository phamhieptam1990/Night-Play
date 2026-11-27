/* SINH dữ liệu cho game Đoán Quốc Gia (popplay/games/doan-quoc-gia/data/world.js). Không sửa tay tệp sinh ra.
   Dùng: node scripts/geo/gen-countries.js <ne_110m_admin_0_countries.geojson> <thư mục country-flag-icons/3x2>
   Hình: Natural Earth 110m (công cộng). Cờ: country-flag-icons (MIT). Mỗi nước được chiếu riêng và co vừa khung 100x100. */
const fs = require("fs"), path = require("path"), TABLE = require("./country-table.js");
const [, , NE, FLAGS] = process.argv; if (!NE || !FLAGS) { console.log("thiếu tham số"); process.exit(1); }
const geo = JSON.parse(fs.readFileSync(NE, "utf8")), by = {};
for (const f of geo.features) { const p = f.properties, iso = p.ISO_A2 !== "-99" ? p.ISO_A2 : p.ISO_A2_EH; by[iso] = f; }
const CONT = { "Asia": 0, "Europe": 1, "Africa": 2, "North America": 3, "South America": 4, "Oceania": 5 };
const polys = g => g.type === "Polygon" ? [g.coordinates] : g.coordinates;
const area = r => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]); return Math.abs(a / 2); };
const ctr = r => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length];
function shape(f, iso) {
  let ps = polys(f.geometry).map(p => p[0]); const shift = iso === "RU" || iso === "FJ";
  if (shift) ps = ps.map(r => r.map(([x, y]) => [x < 0 ? x + 360 : x, y]));
  const big = ps.reduce((a, b) => area(a) >= area(b) ? a : b), bc = ctr(big), ba = area(big);
  ps = ps.filter(r => area(r) >= ba * .03 && Math.hypot(ctr(r)[0] - bc[0], ctr(r)[1] - bc[1]) < 60);
  const all = ps.flat(), lat0 = all.reduce((s, p) => s + p[1], 0) / all.length, k = Math.cos(lat0 * Math.PI / 180);
  const pr = ps.map(r => r.map(([x, y]) => [x * k, -y])), xs = pr.flat().map(p => p[0]), ys = pr.flat().map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = 88 / Math.max(x1 - x0, y1 - y0), ox = (100 - (x1 - x0) * s) / 2, oy = (100 - (y1 - y0) * s) / 2;
  return pr.map(r => { let d = "", last = ""; r.forEach(([x, y], i) => { const px = ((x - x0) * s + ox).toFixed(1), py = ((y - y0) * s + oy).toFixed(1), c = px + " " + py; if (c === last) return; last = c; d += (d ? "L" : "M") + c; }); return d + "Z"; }).join("");
}
const out = [], miss = [];
for (const [iso, vi, en, tier, al] of TABLE) {
  const f = by[iso], ff = path.join(FLAGS, iso + ".svg");
  if (!f || !fs.existsSync(ff)) { miss.push(iso); continue; }
  const svg = fs.readFileSync(ff, "utf8"), m = /viewBox="([^"]+)"/.exec(svg), inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/\s+/g, " ").replace(/> </g, "><");
  out.push({ c: iso, vi, en, t: tier, k: CONT[f.properties.CONTINENT] != null ? CONT[f.properties.CONTINENT] : 0, al, d: shape(f, iso), vb: m[1], fl: inner });
}
const body = "/* SINH BỞI scripts/geo/gen-countries.js — không sửa tay. Hình: Natural Earth (công cộng); cờ: country-flag-icons (MIT). */\nconst WORLD = [\n" + out.map(o => JSON.stringify(o)).join(",\n") + "\n];\n";
const dst = path.join(__dirname, "..", "..", "popplay", "games", "doan-quoc-gia", "data"); fs.mkdirSync(dst, { recursive: true });
fs.writeFileSync(path.join(dst, "world.js"), body);
console.log("ok", out.length, "nước,", Math.round(body.length / 1024) + " KB; thiếu:", miss.join(","));
