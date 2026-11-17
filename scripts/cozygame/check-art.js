/* Bài đo linh vật SVG (docs/MASCOT-ART-RULES.md mục 6): mọi shared/art/mascot-*.svg. Chạy: node scripts/cozygame/check-art.js (không cần trình duyệt). */
const fs = require("fs"), path = require("path"), dir = path.join(__dirname, "../../shared/art");
const files = fs.readdirSync(dir).filter(f => /^(mascot-.*|_template-.*)\.svg$/.test(f));
let bad = 0; const ko = (f, m) => { bad++; console.log("  ✗ " + f + ": " + m); };
const BAN = /<(image|foreignObject|script|filter|mask|feGaussianBlur|feDropShadow)\b|backdrop-filter|filter\s*:|\bhref=|xlink:href/i;
for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), "utf8"), tpl = f.startsWith("_template"), kb = Buffer.byteLength(s) / 1024;
  if (!/viewBox="0 0 256 256"/.test(s)) ko(f, "viewBox phải là 0 0 256 256");
  if (BAN.test(s)) ko(f, "có thẻ/thuộc tính cấm (image/filter/mask/foreignObject/script/href)");
  if (!/data-style="(pop|night)"/.test(s)) ko(f, "thiếu data-style pop|night");
  if (!/role="img"/.test(s) || !/aria-label="[^"]+"/.test(s)) ko(f, "thiếu role=img + aria-label");
  for (const id of ["shadow", "all", "body", "face", "eyes", "acc-badge", "acc-group", "acc-night", "acc-star", "fx-night", "fx-star"]) if (!new RegExp('id="' + id + '"').test(s)) ko(f, "thiếu nhóm id=\"" + id + "\"");
  for (const m of s.matchAll(/animation:\s*([a-zA-Z0-9_-]+)/g)) if (m[1] !== "none" && !/^npa-/.test(m[1])) ko(f, "animation không bắt đầu npa-: " + m[1]);
  if (!/prefers-reduced-motion/.test(s) || !/np-playing/.test(s)) ko(f, "thiếu tắt hoạt ảnh (prefers-reduced-motion + html.np-playing)");
  if (tpl) continue;
  const body = s.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<defs>[\s\S]*?<\/defs>/g, "").replace(/<g id="(acc|fx)-[a-z]+"[\s\S]*?<\/g>/g, "");
  const n = (body.match(/<(path|circle|ellipse|rect|line|polygon)\b/g) || []).length;
  if (n > 60) ko(f, "phần thân " + n + " phần tử (> 60)");
  if (kb > 13) ko(f, "tệp " + kb.toFixed(1) + "KB (> 13KB gồm cả 4 skin)");
  const rootFill = s.match(/<(path|circle|ellipse|rect)\b[^>]*\bfill="#[0-9a-fA-F]{3,6}"[^>]*>/g) || [];
  if (/id="body"/.test(s)) { const bodyG = s.slice(s.indexOf('id="body"'), s.indexOf('id="face"')); if (/fill="#(?!fff"|ffffff")[0-9a-fA-F]{3,6}"/i.test(bodyG)) ko(f, "thân dùng màu cứng (phải dùng biến var(--c1...))"); }
  console.log("  " + f + ": " + n + " phần tử thân, " + kb.toFixed(1) + "KB");
}
console.log(bad ? "\n✗ " + bad + " lỗi linh vật" : "\n✓ linh vật SVG đạt");
process.exit(bad ? 1 : 0);
