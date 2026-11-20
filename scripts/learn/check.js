/* Bộ kiểm tra HỌC TẬP (Học Vui) gom một chỗ. Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/learn/check.js [--full]
   Gồm: SVG vườn (check-garden-art), ngân hàng câu (check-bank), 18 kiểu câu hỏi (check-types), trang phụ huynh + hẹn giờ (check-parent), luật Vườn (check-garden),
   linh vật SVG (cozygame/check-art), giao diện trang học bằng Chrome thật (check-ui; --full thêm 3 môn x mọi kiểu x màn ngang).
   Cũng chạy được từ check.js của game bằng cờ:  node scripts/cozygame/check.js --learn   (chỉ học tập)  |  --games  (chỉ game)  |  không cờ = cả hai. */
"use strict";
const { spawnSync } = require("child_process"), path = require("path");
const root = path.join(__dirname, "..", "..");
const STEPS = [
  ["ngân hàng câu hỏi", "scripts/learn/check-bank.js", []],
  ["18 kiểu câu hỏi", "scripts/learn/check-types.js", []],
  ["trang phụ huynh + hẹn giờ", "scripts/learn/check-parent.js", []],
  ["Vườn (dữ liệu + luật)", "scripts/learn/check-garden.js", []],
  ["linh vật SVG", "scripts/cozygame/check-art.js", []],
  ["SVG vườn (luật vẽ + trang duyệt)", "scripts/learn/check-garden-art.js", []],
  ["giao diện trang học", "scripts/learn/check-ui.js", process.argv.includes("--full") ? ["--full"] : []]
];
const failed = [];
for (const [name, file, args] of STEPS) {
  console.log("== học tập: " + name);
  const r = spawnSync(process.execPath, [path.join(root, file)].concat(args), { cwd: root, env: process.env, stdio: "inherit" });
  if (r.status !== 0) { failed.push(name); console.log("  ✗ học tập: " + name + " báo lỗi (mã " + r.status + ")"); }
}
console.log("\n" + (failed.length ? "✗ học tập: " + failed.length + " bài đo lỗi: " + failed.join("; ") : "✓ học tập đạt (" + STEPS.length + " bài đo)"));
process.exit(failed.length ? 1 : 0);
