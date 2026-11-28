/* Kiểm định ngân hàng câu Khám Phá Vũ Trụ: đủ trường, 3 đáp án khác nhau, không trùng câu, đếm theo chủ đề/bậc. */
const fs = require("fs"), path = require("path"), vm = require("vm"), d = path.join(__dirname, "..", "popplay", "games", "kham-pha-vu-tru", "data");
const ctx = vm.createContext({ console }); vm.runInContext("var BANK=[];", ctx);
["bank.js", "bank-fmt.js", "bank-t0.js", "bank-t1.js", "bank-t2.js", "bank-t3.js", "bank-t4.js"].forEach(f => vm.runInContext(fs.readFileSync(path.join(d, f), "utf8").replace(/^"use strict";/, "").replace(/^const BANK = /m, "BANK = ").replace(/\nfunction ST/, "\nvar ST = function ST"), ctx, { filename: f }));
const B = vm.runInContext("BANK", ctx); let bad = 0;
B.forEach((t, i) => { const tiers = [0, 0, 0, 0], seen = new Set();
  t.forEach(q => { tiers[q[0]]++; const a = [q[4][0], q[5][0], q[6][0]], e = [q[4][1], q[5][1], q[6][1]];
    if (q.length !== 9 || ![1, 2, 3].includes(q[0]) || new Set(a).size < 3 || new Set(e).size < 3 || a.concat(e).some(x => !x) || !q[2] || !q[3] || !q[7] || !q[8]) { bad++; console.log("LỖI", i, q[2]); }
    if (seen.has(q[2])) { bad++; console.log("TRÙNG", i, q[2]); } seen.add(q[2]); });
  console.log("chủ đề", i, "=", t.length, "câu · bậc 1/2/3 =", tiers.slice(1).join("/")); });
console.log("Tổng:", B.reduce((a, t) => a + t.length, 0), "· lỗi:", bad); process.exit(bad ? 1 : 0);
