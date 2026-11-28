/* Kiểm định ngân hàng câu Hỏi Xoáy: đủ 6 trường vi/en, không trùng câu, in tổng số. */
const fs = require("fs"), path = require("path"), d = path.join(__dirname, "parts", "hoi-xoay-dap-xoay");
let n = 0, bad = 0; const seen = new Set();
global.RID = [];
global.P = a => { for (let i = 0; i < a.length; i += 2) { const v = a[i].split("|"), e = a[i + 1].split("|"); n++;
  if (v.length !== 6 || e.length !== 6 || v[2] === v[3] || v[2] === v[4] || v[3] === v[4]) { bad++; console.log("LỖI", v[1]); }
  if (seen.has(v[1])) { bad++; console.log("TRÙNG", v[1]); } seen.add(v[1]); } };
fs.readdirSync(d).filter(f => /^bank\d+\.js$/.test(f)).sort().forEach(f => { const b = n; (0, eval)(fs.readFileSync(path.join(d, f), "utf8")); console.log(f, n - b); });
console.log("Tổng (chưa tính 17 câu gốc):", n, "· lỗi:", bad); process.exit(bad ? 1 : 0);
