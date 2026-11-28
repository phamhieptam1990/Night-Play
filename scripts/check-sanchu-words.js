/* Kiểm định bộ từ Săn Chữ Ẩn: chỉ A-Z, có nghĩa, không trùng trong một chủ đề; đếm từ mỗi chủ đề và tổng. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const free = vm.runInNewContext(fs.readFileSync(path.join(root, "scripts/cozygame/parts/san-chu/words.js"), "utf8") + ";WORDS");
const PF = { skins: {}, types: [] }, src = require(path.join(root, "server/pro/san-chu-an.js")).source({});
vm.runInNewContext(src, { PF });
const sets = { free, ...Object.fromEntries(Object.entries(PF.skins).map(([k, v]) => [k, v.words])) };
let total = 0, bad = 0;
for (const [k, ws] of Object.entries(sets)) {
  const seen = new Set(); ws.forEach(([w, vi]) => { if (!/^[A-Z]{2,14}$/.test(w) || !vi || seen.has(w)) { bad++; console.log("LỖI", k, w); } seen.add(w); });
  const short = ws.filter(w => w[0].length <= 8).length; total += ws.length;
  console.log(k.padEnd(6), ws.length, "từ ·", short, "từ ≤8 chữ");
}
console.log("Tổng:", total, "· lỗi:", bad); process.exit(bad ? 1 : 0);
