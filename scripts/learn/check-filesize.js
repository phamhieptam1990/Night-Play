/* Bài đo "Cấu trúc tệp" của Học Vui (GAME_RULES.md): tệp TAY VIẾT trong learn/** và scripts/learn/** không vượt giới hạn dòng
   (HTML 300, JS 400, CSS 400) và không có dòng quá dài (> 220 ký tự). Chỉ CẢNH BÁO: luôn thoát mã 0, in "✓" khi sạch.
   Chạy: node scripts/learn/check-filesize.js            (in tóm tắt + danh sách)
         node scripts/learn/check-filesize.js --short     (chỉ in số lượng + 15 tệp lệch nhất)
   Bỏ qua: shared/art/** (không quét), tệp sinh tự động (3 dòng đầu có "SINH BỞI" / "SINH TỰ ĐỘNG"), node_modules, .git. */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..");

const MAX_LINES = { ".html": 300, ".js": 400, ".css": 400 };
const MAX_COL = 220;           /* dòng dài: quá ngưỡng này thì cảnh báo */
const MAX_COL_DATA = 400;      /* tệp dữ liệu (miễn trừ dòng dài ở dưới): ngưỡng riêng; tổng số dòng VẪN được báo */
const SCAN = ["learn", "scripts/learn"];
const SKIP_DIRS = new Set(["node_modules", ".git"]);

/* ---- DANH SÁCH MIỄN TRỪ (đường dẫn tương đối từ gốc repo; "*" ở cuối = cả thư mục / mẫu) ----
   Tệp dữ liệu / sinh ra nhưng không có dấu "SINH BỞI": được dòng dài tới 400 ký tự, tổng số dòng vẫn báo. */
const DATA_FILES = [
  "learn/icons.js", "learn/bg.css", "learn/content/curriculum.js", "learn/content/teasers.js", "learn/content/bank.js",
  "learn/content/lessons/*", "learn/content/trips/*"];
/* Dòng chứa URI "data:" (ảnh mặt nạ SVG nhúng trong CSS) không thể xuống dòng: không tính là dòng dài. */
const DATA_URI = /url\(\s*["']?data:/;

const isData = rel => DATA_FILES.some(p => p.endsWith("/*") ? rel.startsWith(p.slice(0, -1)) : rel === p);
const isGenerated = text => text.split("\n", 3).some(l => /SINH BỞI|SINH TỰ ĐỘNG/.test(l));

function walk(dir, out) {
  let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of es) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (MAX_LINES[path.extname(e.name)]) out.push(p);
  }
}

const files = []; for (const d of SCAN) walk(path.join(root, d), files);
const over = [], longs = []; let scanned = 0, skipped = 0;
for (const f of files.sort()) {
  const rel = path.relative(root, f).split(path.sep).join("/");
  if (rel.startsWith("shared/art/")) continue;
  const text = fs.readFileSync(f, "utf8");
  if (isGenerated(text)) { skipped++; continue; }
  scanned++;
  const lines = text.split("\n"); if (lines[lines.length - 1] === "") lines.pop();
  const lim = MAX_LINES[path.extname(f)];
  if (lines.length > lim) over.push({ rel, n: lines.length, lim, data: isData(rel) });
  const col = isData(rel) ? MAX_COL_DATA : MAX_COL, bad = [];
  lines.forEach((l, i) => { if (l.length > col && !DATA_URI.test(l)) bad.push([i + 1, l.length]); });
  if (bad.length) longs.push({ rel, bad, col });
}

const SHORT = process.argv.includes("--short");
over.sort((a, b) => b.n / b.lim - a.n / a.lim); longs.sort((a, b) => b.bad.length - a.bad.length);
if (over.length) {
  console.log("Tệp vượt giới hạn dòng (" + over.length + "):");
  for (const o of (SHORT ? over.slice(0, 15) : over)) console.log("  ⚠ " + o.rel + ": " + o.n + " dòng (giới hạn " + o.lim + ")" + (o.data ? " [dữ liệu]" : ""));
}
if (longs.length) {
  console.log("Tệp có dòng quá dài (" + longs.length + " tệp, " + longs.reduce((s, x) => s + x.bad.length, 0) + " dòng):");
  for (const o of (SHORT ? longs.slice(0, 15) : longs)) console.log("  ⚠ " + o.rel + ": " + o.bad.length + " dòng > " + o.col + " ký tự, vd dòng " + o.bad.slice(0, 3).map(b => b[0] + " (" + b[1] + ")").join(", "));
}
console.log("Đã quét " + scanned + " tệp tay viết (bỏ qua " + skipped + " tệp sinh tự động).");
if (!over.length && !longs.length) console.log("✓ cấu trúc tệp đạt (mọi tệp trong giới hạn dòng, không dòng quá dài)");
else console.log("(chỉ cảnh báo: " + over.length + " tệp vượt dòng, " + longs.length + " tệp có dòng dài)");
process.exit(0);
