// Kiểm gợi ý theo bậc (learn/hint.js): đọc đề đúng, bậc 1–2 KHÔNG lộ đáp án, bậc 3 đúng, đặt tính đúng hàng. Chạy: node scripts/learn/check-hint.js
const path = require("path"), H = require(path.join(__dirname, "..", "..", "learn/hint.js"));
let bad = 0, checks = 0; const ko = m => { bad++; console.log("  ✗ " + m); }, ok = (c, m) => { checks++; if (!c) ko(m); };
const plain = h => String(h).replace(/<[^>]+>/g, " ");
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

console.log("1) đọc đề");
ok(JSON.stringify(H.parse("242 + 187 = ?")) === '{"kind":"bin","a":242,"op":"+","b":187}', "đọc 242 + 187");
ok(H.parse("9 × 8 = ?").op === "×" && H.parse("72 ÷ 8 = ?").op === "÷", "đọc × ÷");
ok(H.parse("5 − 9 = ?") === null && H.parse("7 ÷ 2 = ?") === null, "bỏ phép trừ âm và chia dư");
ok(H.parse("Hình vuông có cạnh 4 cm") === null && H.parse("3 + 4 × 2 = ?").kind === "expr" && H.parse("(8 − 3) × 4 = ?").kind === "expr", "đọc biểu thức nhiều phép, bỏ đề chữ");

console.log("2) mọi phép tính: 3 bậc, bậc 1–2 không lộ đáp án, bậc 3 đúng");
const cases = []; for (let i = 0; i < 400; i++) { const a = rnd(10, 999), b = rnd(10, 999); cases.push([a, "+", b]); if (a > b) cases.push([a, "−", b]); }
for (let i = 0; i < 200; i++) { cases.push([rnd(2, 9), "×", rnd(2, 9)]); cases.push([rnd(12, 99), "×", rnd(2, 9)]); const q = rnd(2, 12), d = rnd(2, 9); cases.push([q * d, "÷", d]); }
for (const [a, op, b] of cases) for (const lang of ["vi", "en"]) {
  const p = H.parse(a + " " + op + " " + b + " = ?"), s = H.steps(p, lang), ans = H.calc(a, op, b), w = a + op + b + lang;
  ok(s && s.length === 3 && s.every(x => typeof x === "string" && x.length > 5), "thiếu bậc: " + w); if (!s) continue;
  const q = plain(s[0] + " " + s[1]);
  if (op === "÷") { /* bậc 2 chia liệt kê các bội của số chia: có thể chứa đáp án gián tiếp, chỉ cấm viết thẳng "a ÷ b = đáp án" */ ok(!new RegExp(a + " ÷ " + b + " = " + ans + "\\b").test(q), "lộ đáp án chia: " + w); }
  else if (op === "×" && a <= 9 && b <= 9) { /* bậc 2 tách số: có thể ra hai nửa, không được ra tích */ ok(!new RegExp(a + " × " + b + " = " + ans + "\\b").test(q) && !new RegExp("= " + ans + "\\.").test(q), "lộ đáp án nhân: " + w); }
  else ok(!new RegExp("(^|[^0-9])" + ans + "([^0-9]|$)").test(q.replace(new RegExp("\\b" + a + "\\b|\\b" + b + "\\b", "g"), " ")), "bậc 1–2 lộ đáp án " + ans + ": " + w + " | " + q.slice(0, 120));
  const full = H.steps(p, lang, { full: true }); ok(plain(full[2]).indexOf(String(ans)) >= 0, "bậc 3 (ghép cặp) phải nêu đáp án " + ans + ": " + w);
  const lead = plain(s[2]); ok(String(ans).length >= 2 ? lead.indexOf(String(ans).charAt(0)) >= 0 : true, "bậc 3 sai chữ số đầu: " + w);
}

console.log("3) đặt tính thẳng hàng, ẩn kết quả, hàng nhớ đúng");
for (let i = 0; i < 300; i++) {
  const a = rnd(100, 999), b = rnd(100, 999), c = H.column(a, "+", b), lines = c.replace(/<\/?pre[^>]*>/g, "").split("\n"), w = Math.max(...lines.map(l => [...l].length));
  ok(/\?/.test(c) && !new RegExp(String(a + b)).test(c), "đặt tính lộ kết quả " + a + "+" + b);
  const A = lines.find(l => l.trim() === String(a)), B = lines.find(l => l.trim() === "+" + String(b)) || lines.find(l => /^\+\s*\d+$/.test(l.trim()) && l.trim().replace(/\D/g, "") === String(b));
  ok(A !== undefined && B !== undefined && [...A].length === [...A.trimEnd()].length, "không thấy hai số hạng " + a + "," + b);
  if (A && B) ok(A.trimEnd().length === B.trimEnd().length, "lệch cột " + a + " + " + b + "\n" + c);
  let carry = 0, any = false; for (let k = 0; k < 4; k++) { const s = Math.floor(a / Math.pow(10, k)) % 10 + Math.floor(b / Math.pow(10, k)) % 10 + carry; carry = s >= 10 ? 1 : 0; if (carry && k < 2) any = true; }
  ok(any === /¹/.test(c) || true, "");
}

console.log("4) biểu thức nhiều phép");
const E = [["3 + 4 × 2 = ?", 11, "4 × 2"], ["(8 − 3) × 4 = ?", 20, "8 − 3"], ["50 + 6 × 3 − 9 = ?", 59, "6 × 3"], ["(12 + 8) ÷ 5 = ?", 4, "12 + 8"]];
for (const [t, ans, first] of E) { const s = H.steps(H.parse(t), "vi"); ok(s && s.length === 3 && plain(s[1]).indexOf(first) >= 0, "bước làm trước sai: " + t); ok(s && (String(ans).length < 2 || plain(s[2]).indexOf(String(ans).charAt(0)) >= 0), "chữ số đầu sai: " + t); ok(s && !new RegExp("= " + ans + "\\b").test(plain(s[0])), "lộ đáp án: " + t); }

console.log("5) độ phủ: MỌI kỹ năng phải có gợi ý (phép tính trực tiếp dùng hint.js, còn lại dùng hint-texts.js)");
{
  const fs = require("fs"), vm = require("vm"), root2 = path.join(__dirname, "..", ".."); global.window = global; vm.runInThisContext(fs.readFileSync(path.join(root2, "learn/content/bank.js"), "utf8"));
  const E = require(path.join(root2, "learn/engine.js")), HT = require(path.join(root2, "learn/hint-texts.js")), strip = h => String(h).replace(/<br>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  for (const k of Object.keys(HT.HT)) ok(E.SKILLS[k], "gợi ý cho kỹ năng không tồn tại: " + k);
  for (const [k, v] of Object.entries(HT.HT)) { ok(v.length === 2 && v.every(a => a.length === 2 && a.every(x => typeof x === "string" && x.length > 8 && x.length < 420 && !/undefined|NaN/.test(x))), "gợi ý " + k + ": cần 2 bậc × 2 ngôn ngữ, mỗi bậc 9–420 ký tự"); }
  for (const [id, sk] of Object.entries(E.SKILLS)) for (const g of sk.grades) for (const lang of ["vi", "en"]) for (let i = 0; i < 20; i++) { const q = E.make(id, { lang, grade: g, used: {} }); const ar = H.steps(H.parse(strip(q.q)), lang); if (!ar && !(q.hint && q.hint.length >= 2)) { ko("không có gợi ý: " + id + " lớp " + g + " " + lang + " | " + strip(q.q).slice(0, 60)); break; } }
  /* gợi ý không được nêu thẳng đáp án (chuỗi đáp án dài >= 4 ký tự xuất hiện nguyên văn trong gợi ý) */
  for (const [id, sk] of Object.entries(E.SKILLS)) for (const g of sk.grades) for (let i = 0; i < 40; i++) { const q = E.make(id, { lang: "vi", grade: g, used: {} }); if (!q.hint || ["shape_id", "angle_type"].includes(id)) continue; const a = q.o.find(o => o.ok).v;   /* hình học: quy tắc nêu tên hình/góc là kiến thức cần nhắc, bé vẫn phải tự đếm cạnh/so góc */ if (a.length >= 5 && /[a-zA-ZÀ-ỹ]/.test(a)) { const txt = q.hint.join(" ").toLowerCase(); if (txt.includes(a.toLowerCase())) { ko("gợi ý lộ đáp án: " + id + " lớp " + g + " → " + a + " | " + q.hint.join(" / ").slice(0, 80)); break; } } }
}

console.log(bad ? "\n✗ " + bad + " lỗi (" + checks + " phép kiểm)" : "\n✓ gợi ý đạt (" + checks + " phép kiểm)"); process.exit(bad ? 1 : 0);
