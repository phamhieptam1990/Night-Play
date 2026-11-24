// Kiểm các kỹ năng Toán lớp 1–5 mới (hình học, đo lường, biểu thức, dữ liệu, quy luật…): TỰ TÍNH LẠI đáp án từ chính đề bài,
// không dùng lại công thức của bộ sinh. Chạy: node scripts/learn/check-mathskills.js
const path = require("path"), root = path.join(__dirname, "..", "..");
const E = require(path.join(root, "learn/engine.js"));
let bad = 0, checks = 0; const ko = m => { bad++; console.log("  ✗ " + m); }, ok = (c, m) => { checks++; if (!c) ko(m); };
const seeded = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const txt = h => String(h).replace(/<br>/g, " ; ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const nums = s => (s.match(/\d+(?:[.,]\d+)?/g) || []).map(x => parseFloat(x.replace(",", ".")));
const right = q => q.o.find(o => o.ok).v, rn = q => nums(right(q))[0], close = (a, b) => Math.abs(a - b) < 1e-6;
const gen = (id, g, lang, n, f) => { E.setRng(seeded(id.length * 131 + g * 7 + (lang === "vi" ? 1 : 2))); for (let i = 0; i < n; i++) { const q = E.make(id, { lang, grade: g, used: {} }); try { f(q, txt(q.q), nums(txt(q.q))); } catch (e) { ko(id + " lớp " + g + " " + lang + ": " + e.message + " | " + txt(q.q)); return; } } };
const N = 400;

console.log("1) tìm số chưa biết: thay đáp án vào đề phải đúng");
for (const lang of ["vi", "en"]) for (const g of [1, 2, 3, 4, 5]) gen("unknown_num", g, lang, N, (q, t) => {
  const x = rn(q), e = t.replace(/\?/, String(x)).replace(/,/g, ".").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").split("=");
  ok(e.length === 2 && close(Function("return " + e[0])(), Function("return " + e[1])()), "sai: " + t + " → " + x);
});

console.log("2) giá trị chữ số, làm tròn");
for (const lang of ["vi", "en"]) for (const g of [2, 3]) gen("place_value", g, lang, N, (q, t, n) => {
  const num = n[n.length - 1], s = String(num), name = ["đơn vị|ones", "chục|tens", "trăm|hundreds", "nghìn|thousands", "chục nghìn|ten-thousands"].findIndex(z => z.split("|")[lang === "vi" ? 0 : 1] === (t.match(/hàng (.+?) của|(\S+(?:-\S+)?) place/) || []).slice(1).filter(Boolean)[0]);
  ok(name >= 0 && Number(s[s.length - 1 - name]) === rn(q), "sai: " + t + " → " + right(q));
});
gen("place_value", 4, "vi", N, (q, t, n) => { const d = n[1], num = n[0], pos = String(num).length - 1 - String(num).indexOf(String(d)); ok(rn(q) === d * Math.pow(10, pos), "sai: " + t + " → " + right(q)); });
gen("place_value", 1, "vi", N, (q, t, n) => { const m = right(q).match(/(\d+) chục (\d+) đơn vị/); ok(m && +m[1] * 10 + +m[2] === n[0], "sai: " + t); });
for (const g of [3, 4]) gen("round_num", g, "vi", N, (q, t, n) => { const u = /chục nghìn/.test(t) ? 10000 : { "chục": 10, "trăm": 100, "nghìn": 1000 }[t.match(/hàng (\S+)/)[1]], x = n[0], exp = Math.floor(x / u + .5) * u; ok(rn(q) === exp, "sai: " + t + " → " + right(q) + " (đúng " + exp + ")"); });
gen("round_num", 5, "vi", N, (q, t, n) => { const tenth = /phần mười/.test(t), x = n[0], f = tenth ? 10 : 1; ok(close(rn(q), Math.floor(x * f + .5 + 1e-9) / f), "sai: " + t + " → " + right(q)); });

console.log("3) đổi đơn vị, đo, tiền, thời gian, chuyển động");
const F = { "m|cm": 100, "dm|cm": 10, "m|dm": 10, "km|m": 1000, "kg|g": 1000, "l|ml": 1000, "cm|mm": 10, "giờ|phút": 60, "tấn|kg": 1000, "m²|dm²": 100, "dm²|cm²": 100, "phút|giây": 60 };
for (const g of [2, 3, 4, 5]) gen("unit_convert", g, "vi", N, (q, t, n) => {
  const m = t.match(/^([\d,]+) (\S+) = \? (\S+)/), v = parseFloat(m[1].replace(",", ".")), a = m[2], b = m[3], big = F[a + "|" + b], small = F[b + "|" + a];
  ok(close(rn(q), big ? v * big : v / small), "sai: " + t + " → " + right(q));
});
gen("measure_compare", 1, "vi", N, (q, t, n) => { ok(rn(q) === (/dài hơn/.test(t) ? Math.abs(n[1] - n[0]) : n[0] + n[1]), "sai: " + t + " → " + right(q)); });
gen("measure_compare", 2, "vi", N, (q, t, n) => { ok(rn(q) === (/dài hơn/.test(t) ? Math.abs(n[1] - n[0]) : n[0] + n[1]), "sai: " + t + " → " + right(q)); });
gen("money_calc", 2, "vi", N, (q, t, n) => { ok(Math.max(...n) <= 1000 && n.every(x => x % 100 === 0), "lớp 2 tiền phải trong phạm vi 1000, bội 100: " + t); ok(rn(q) === (/trả lại/.test(t) ? n[0] - n[1] : n[0] + n[1]), "sai: " + t + " → " + right(q)); });
ok(!E.SKILLS.round_num.grades.includes(2), "làm tròn số không thuộc lớp 2 (GDPT 2018: từ lớp 3)");
gen("money_calc", 1, "vi", N, (q, t, n) => ok(rn(q) === n[0] + n[1], "sai: " + t));
gen("money_calc", 3, "vi", N, (q, t, n) => ok(rn(q) === n[0] * n[1], "sai: " + t));
gen("money_calc", 4, "vi", N, (q, t, n) => ok(rn(q) === n[3] - (n[0] * n[1] + n[2]) || n.length < 4, "sai: " + t + " → " + right(q)));
gen("motion", 5, "vi", N, (q, t, n) => { const exp = /Vận tốc của/.test(t) ? n[0] / n[1] : /Quãng đường/.test(t) ? n[0] * n[1] : n[0] / n[1]; ok(close(rn(q), exp), "sai: " + t + " → " + right(q)); });
const HM = z => { const m = z.match(/(\d+) giờ(?: (\d+) phút)?/); return +m[1] * 60 + (+m[2] || 0); }, DUR = z => { const h = z.match(/(\d+) giờ/), m = z.match(/(\d+) phút/); return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0); };
gen("time_calc", 3, "vi", N, (q, t) => { const m = t.match(/Từ (.+?) đến (.+?) là/); ok(DUR(right(q)) === HM(m[2]) - HM(m[1]) && /phút/.test(right(q)), "sai: " + t + " → " + right(q)); });
gen("time_calc", 5, "vi", N, (q, t) => { const m = t.match(/Từ (.+?) đến (.+?) là/); ok(DUR(right(q)) === HM(m[2]) - HM(m[1]), "sai: " + t + " → " + right(q)); });
gen("time_calc", 4, "vi", N, (q, t) => { const m = t.match(/Bắt đầu lúc (.+?), làm trong (.+?)\. Kết/); ok(HM(right(q)) === HM(m[1]) + DUR(m[2]), "sai: " + t + " → " + right(q)); });

console.log("4) hình học: chu vi, diện tích, thể tích");
gen("perimeter", 3, "vi", N, (q, t, n) => { const exp = /Hình vuông có cạnh/.test(t) ? 4 * n[0] : (n[0] + n[1]) * 2; ok(rn(q) === exp, "sai: " + t + " → " + right(q)); });
for (const g of [4, 5]) gen("perimeter", g, "vi", N, (q, t, n) => {
  let exp; if (/Hình vuông có cạnh/.test(t)) exp = 4 * n[0]; else if (/Hình vuông có chu vi/.test(t)) exp = n[0] / 4; else if (/Hình chữ nhật có chu vi/.test(t)) exp = n[0] / 2 - n[1]; else if (/Hình tròn/.test(t)) exp = n[0] * 3.14; else exp = (n[0] + n[1]) * 2; ok(close(rn(q), exp), "sai: " + t + " → " + right(q));
});
gen("area_shape", 3, "vi", N, (q, t, n) => ok(rn(q) === (/Hình vuông/.test(t) ? n[0] * n[0] : n[0] * n[1]), "sai: " + t + " → " + right(q)));
for (const g of [4, 5]) gen("area_shape", g, "vi", N, (q, t, n) => {
  let exp; if (/Hình bình hành/.test(t)) exp = n[0] * n[1]; else if (/Hình thoi/.test(t)) exp = n[0] * n[1] / 2; else if (/tam giác/.test(t)) exp = n[0] * n[1] / 2; else if (/Hình thang/.test(t)) exp = (n[0] + n[1]) * n[2] / 2; else if (/Hình tròn/.test(t)) exp = n[0] * n[0] * 3.14; else exp = n[0] * n[1]; ok(close(rn(q), exp), "sai: " + t + " → " + right(q));
});
gen("volume_box", 5, "vi", N, (q, t, n) => ok(rn(q) === (/lập phương/.test(t) ? Math.pow(n[0], 3) : n[0] * n[1] * n[2]), "sai: " + t + " → " + right(q)));

console.log("5) phân số, dữ liệu, quy luật, toán đố");
for (const g of [3, 4, 5]) gen("fraction_of", g, "vi", N, (q, t, n) => {
  if (/của/.test(t)) ok(close(rn(q), n[0] * n[2] / n[1]), "sai: " + t + " → " + right(q));
  else { const m = right(q).match(/(\d+)\/(\d+)/), tt = t.match(/(\d+)\/(\d+) \+ (\d+)\/(\d+)/), nu = +tt[1] * (+m[2] / +tt[2]) + +tt[3] * (+m[2] / +tt[4]); ok(+m[2] % +tt[2] === 0 && +m[2] % +tt[4] === 0 && +m[1] === nu, "sai: " + t + " → " + right(q)); }
});
gen("data_read", 4, "vi", N, (q, t, n) => { const v = [...t.matchAll(/Thứ \S+ (\d+)/g)].map(m => +m[1]); if (/Trung bình/.test(t)) ok(close(rn(q), v.reduce((a, b) => a + b, 0) / 4), "sai: " + t); else if (/Cả bốn ngày/.test(t)) ok(rn(q) === v.reduce((a, b) => a + b, 0), "sai: " + t); });
gen("data_read", 3, "vi", N, (q, t) => { const v = [...t.matchAll(/Thứ \S+ (\d+)/g)].map(m => +m[1]); if (/nhiều nhất/.test(t)) { const mx = Math.max(...v); ok(v.filter(x => x === mx).length === 1, "nhiều nhất bị hòa (hai đáp án đúng): " + t); ok(v.length === 4 && right(q) === ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"][v.indexOf(mx)], "sai: " + t + " → " + right(q)); } });
gen("data_read", 4, "vi", N, (q, t) => { const v = [...t.matchAll(/Thứ \S+ (\d+)/g)].map(m => +m[1]); if (/nhiều nhất/.test(t)) { const mx = Math.max(...v); ok(v.filter(x => x === mx).length === 1, "nhiều nhất bị hòa: " + t); } });
for (const g of [1, 2]) gen("data_read", g, "vi", N, (q, t) => { if (/nhiều nhất/.test(t) && !/hơn/.test(t)) { const rows = [...t.matchAll(/(\S+) : (\S+)/gu)].map(m => [m[1], Array.from(m[2]).length]), mx = Math.max(...rows.map(r => r[1])); ok(rows.filter(r => r[1] === mx).length === 1, "nhiều nhất bị hòa: " + t); } });
gen("data_read", 5, "vi", N, (q, t, n) => { const v = [...t.matchAll(/Thứ \S+ (\d+)/g)].map(m => +m[1]), day = t.match(/\? (Thứ \S+) chiếm|(Thứ \S+) chiếm/), d = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"].find(x => t.indexOf(x + " chiếm") >= 0); ok(d && close(rn(q), v["Thứ Hai,Thứ Ba,Thứ Tư,Thứ Năm".split(",").indexOf(d)] * 100 / v.reduce((a, b) => a + b, 0)), "sai: " + t + " → " + right(q)); });
for (const g of [1, 2]) gen("data_read", g, "vi", N, (q, t) => { const rows = [...t.matchAll(/(\S+) : (\S+)/gu)].map(m => [m[1], Array.from(m[2]).length]); if (/Có mấy/.test(t)) { const e = t.match(/Có mấy (\S+)\?/u)[1], r = rows.find(x => x[0] === e); ok(r && +rn(q) === r[1], "sai: " + t + " → " + right(q)); } });
const isSeq = (s, a) => { const L = s.concat([a]), d = L.slice(1).map((x, i) => +(x - L[i]).toFixed(6)), r = L.slice(1).map((x, i) => x / L[i]);
  const lin = d.every(x => close(x, d[0])), geo = r.every(x => close(x, r[0])), sq = L.every((x, i) => x === (i + 1) * (i + 1)), tri = d.slice(1).every((x, i) => close(x - d[i], 1)), fib = L.slice(2).every((x, i) => close(x, L[i] + L[i + 1]));
  return lin || geo || sq || tri || fib; };
for (const g of [2, 3, 4, 5]) gen("pattern_seq", g, "vi", N, (q, t) => { const seq = nums(t.replace(/^.*?\? ; /, "").replace(/, \?$/, "")); ok(seq.length >= 4 && isSeq(seq, rn(q)), "sai: " + t + " → " + right(q)); });
gen("pattern_seq", 1, "vi", N, (q, t) => { if (/\d/.test(t)) { const seq = nums(t.replace(/^.*?\? ; /, "")); ok(isSeq(seq, rn(q)), "sai: " + t + " → " + right(q)); } else { const s = Array.from(t.replace(/^.*?\? ; /, "").replace(" ?", "").replace(/ /g, "")), L = s.length === 6 && s[0] === s[2] && s[1] === s[3] && s[0] === s[4] && s[1] === s[5] && s[0] !== s[1] ? 2 : 3; ok(s.every((x, i) => x === s[i % L]) && right(q) === s[6 % L], "sai: " + t + " → " + right(q)); } });
gen("word_multi", 3, "vi", N, (q, t, n) => { if (/Cô trả lại/.test(t)) ok(rn(q) === n[2] - n[0] * n[1], "sai: " + t); else if (/chia đều/.test(t)) ok(rn(q) === n[0] / n[1] + n[2], "sai: " + t); else ok(rn(q) === 2 * n[0] + n[1], "sai: " + t); });
for (const g of [4, 5]) gen("word_multi", g, "vi", N, (q, t, n) => {
  if (/Tổng của hai số/.test(t)) ok(rn(q) === (n[0] + n[1]) / 2, "sai: " + t); else if (/gấp đôi/.test(t)) ok(rn(q) === 3 * n[0], "sai: " + t); else if (/học sinh nam/.test(t)) ok(close(rn(q), n[0] - n[0] * n[1] / 100), "sai: " + t + " → " + right(q));
  else if (/giảm giá/.test(t)) ok(close(rn(q), n[0] - n[0] * n[1] / 100), "sai: " + t); else if (/Cô trả lại/.test(t)) ok(rn(q) === n[2] - n[0] * n[1], "sai: " + t); else if (/chia đều/.test(t)) ok(rn(q) === n[0] / n[1] + n[2], "sai: " + t); else ok(rn(q) === 2 * n[0] + n[1], "sai: " + t);
});

console.log("6) phân số bằng nhau, số La Mã, số đo góc, tìm lỗi sai");
const gcdI = (a, b) => b ? gcdI(b, a % b) : a, eq = (a, b, c, d) => a * d === b * c;
for (const g of [4, 5]) gen("fraction_equiv", g, "vi", N, (q, t) => {
  let m;
  if ((m = t.match(/^(\d+)\/(\d+) = \? ?\/(\d+)/))) { const [a, b, D] = [+m[1], +m[2], +m[3]]; ok(D % b === 0 && rn(q) === a * D / b, "sai: " + t + " → " + right(q)); }
  else if ((m = t.match(/Phân số nào bằng (\d+)\/(\d+)/))) { const [a, b] = [+m[1], +m[2]], f = right(q).split("/").map(Number); ok(eq(f[0], f[1], a, b), "đáp án không bằng: " + t + " → " + right(q)); for (const o of q.o.filter(x => !x.ok)) { const w = o.v.split("/").map(Number); ok(!eq(w[0], w[1], a, b), "đáp án nhiễu cũng bằng: " + t + " | " + o.v); } }
  else if (/lớn nhất/.test(t)) { const fs = q.o.map(o => o.v.split("/").map(Number)), r = right(q).split("/").map(Number); ok(fs.every(f => f[0] * r[1] <= r[0] * f[1]), "không phải lớn nhất: " + q.o.map(o => o.v)); ok(fs.filter(f => eq(f[0], f[1], r[0], r[1])).length === 1, "hai phân số bằng nhau trong lựa chọn: " + q.o.map(o => o.v)); }
  else if ((m = t.match(/Rút gọn (\d+)\/(\d+)/))) { const [a, b] = [+m[1], +m[2]], f = right(q).split("/").map(Number); ok(eq(f[0], f[1], a, b) && gcdI(f[0], f[1]) === 1, "rút gọn sai: " + t + " → " + right(q)); }
  else throw new Error("không nhận ra kiểu câu: " + t);
});
const romanOf = n => { const t = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let r = ""; for (const [v, s2] of t) while (n >= v) { r += s2; n -= v; } return r; };
const romanVal = r => { const v = { I: 1, V: 5, X: 10 }; let n = 0; for (let i = 0; i < r.length; i++) n += v[r[i]] < (v[r[i + 1]] || 0) ? -v[r[i]] : v[r[i]]; return n; };
gen("roman", 3, "vi", N, (q, t) => { const m = t.match(/La Mã ([IVX]+) là số nào/); if (m) ok(rn(q) === romanVal(m[1]), "La Mã → số sai: " + t + " → " + right(q)); else { const n = +t.match(/Số (\d+) viết/)[1]; ok(right(q) === romanOf(n) && romanVal(right(q)) === n, "số → La Mã sai: " + t + " → " + right(q)); for (const o of q.o.filter(x => !x.ok)) ok(romanVal(o.v.replace(/[^IVX]/g, "")) !== n || /IIII|VIIII/.test(o.v), "đáp án nhiễu cũng đúng: " + o.v); } });
for (const g of [4, 5]) gen("angle_measure", g, "vi", N, (q, t, n) => {
  if (/Góc vuông bằng|Góc bẹt bằng/.test(t)) ok(rn(q) === (/vuông/.test(t) ? 90 : 180), "sai: " + t); else if (/kề bù/.test(t)) ok(rn(q) === 180 - n[1], "sai: " + t + " → " + right(q)); else if (/là góc gì/.test(t)) ok(right(q) === (n[0] < 90 ? "góc nhọn" : "góc tù"), "sai: " + t + " → " + right(q)); else ok(rn(q) === 180 - n[0] - n[1], "sai: " + t + " → " + right(q));
});
/* tìm lỗi sai: đọc từng bước trong lời giải, tự tính bước đầu tiên sai (hoặc không sai) */
for (const g of [2, 3, 4, 5]) gen("find_error", g, "vi", N, (q, t) => {
  const lines = t.replace(/\s*\|\s*/g, "\n").split(/\n| (?=Bước)/); const body = q.q.split("<br>").slice(1, -1).map(x => x.replace(/<[^>]+>/g, "")); let carry = 0, first = -1;
  body.forEach((ln, i) => { const m = ln.match(/(\d+) \+ (\d+)(?: \+ (\d+))? = (\d+) → viết (\d+)(, nhớ 1)?/); if (!m) throw new Error("không đọc được bước: " + ln); const shownCarry = m[3] ? +m[3] : 0, sum = +m[1] + +m[2] + shownCarry, okStep = shownCarry === carry && +m[4] === sum && +m[5] === sum % 10 && (m[6] ? 1 : 0) === (sum >= 10 ? 1 : 0); if (!okStep && first < 0) first = i; carry = m[6] ? 1 : 0; });
  const ans = first < 0 ? "Không sai" : "Bước " + (first + 1); ok(right(q) === ans, "bước sai tự tính = " + ans + " nhưng đáp án = " + right(q) + " | " + body.join(" ; "));
});

gen("data_read", 5, "vi", 60, (q, t) => { ok(/<div style=/.test(q.q) && q.q.indexOf("<i style=") < q.q.search(/chiếm|bao nhiêu|nhiều nhất|Trung bình/) && /\?\s*$/.test(t), "câu hỏi phải đứng SAU bảng/biểu đồ cột: " + t); });
gen("data_read", 3, "vi", 60, (q, t) => ok(q.q.indexOf("<i style=") < q.q.search(/bao nhiêu|nhiều nhất/), "lớp 3: câu hỏi phải đứng sau dữ liệu: " + t));
for (const g of [2, 3, 4]) gen("unit_convert", g, "vi", N, (q, t) => ok(q.o.every(o => /^\d+ \S+$/.test(o.v)), "lớp " + g + " chưa học số thập phân, đáp án nhiễu phải là số tự nhiên: " + t + " | " + q.o.map(o => o.v).join(" / ")));

console.log("7) Toán lớp 5 nâng cao: phần trăm, gặp nhau / đuổi kịp, tỉ số, nhân chia thập phân và phân số (tự tính lại từ đề)");
const frVal = z => { const m = z.match(/^(\d+)\/(\d+)$/); return m ? +m[1] / +m[2] : parseFloat(z.replace(",", ".")); };
const distinctRight = q => { const vs = q.o.map(o => o.v), ok1 = q.o.filter(o => o.ok).length === 1; return ok1 && new Set(vs).size === vs.length; };
for (const lang of ["vi", "en"]) {
  gen("pct_ratio", 5, lang, N, (q, t, n) => {
    ok(distinctRight(q), "đáp án trùng/không duy nhất: " + t);
    let exp;
    if (/(student|học sinh).*(top|giỏi)/.test(t) && /percent|phần trăm/.test(t) && !/of a number|của một số/.test(t)) exp = n[1] * 100 / n[0];
    else if (/discount|giảm giá/.test(t)) exp = (n[0] - n[1]) * 100 / n[0];
    else if (/profit|lãi/.test(t)) exp = (n[1] - n[0]) * 100 / n[0];
    else { exp = n[1] * 100 / n[0]; }   /* p% của một số là a → số đó = a × 100 ÷ p */
    ok(close(rn(q), exp), "sai: " + t + " → " + right(q) + " (đúng " + exp + ")");
    ok(q.o.filter(o => !o.ok).every(o => !close(parseFloat(o.v.replace(",", ".")), exp)), "nhiễu trùng đáp án: " + t);
    if (/profit|lãi/.test(t) || /discount|giảm giá/.test(t)) ok(Number.isInteger(exp), "tỉ số không nguyên: " + t);
  });
  gen("motion_meet", 5, lang, N, (q, t, n) => {
    ok(distinctRight(q), "đáp án trùng: " + t); let exp;
    if (/Vận tốc người thứ hai|second person/.test(t)) exp = n[1] / n[0] - n[2];                   /* đề: t giờ, S km, v1 → v2 = S ÷ t − v1 */
    else if (/đuổi kịp|catch up/.test(t)) exp = n[0] / Math.abs(n[2] - n[1]);                      /* khoảng cách ÷ hiệu hai vận tốc */
    else exp = n[0] / (n[1] + n[2]);                                                               /* ngược chiều: S ÷ (v1 + v2) */
    ok(close(rn(q), exp), "sai: " + t + " → " + right(q) + " (đúng " + exp + ")");
    ok(q.o.filter(o => !o.ok).every(o => !close(nums(o.v)[0], exp)), "nhiễu trùng đáp án: " + t);
  });
  gen("ratio_prop", 5, lang, N, (q, t, n) => {
    ok(distinctRight(q), "đáp án trùng: " + t); let exp;
    if (/ratio of the smaller|tỉ số của số bé/.test(t)) { const T = n[0], [a, b] = t.match(/(\d+)\/(\d+)/).slice(1).map(Number); exp = (/larger number is|Số lớn là/.test(t) ? b : a) * T / (a + b); }
    else if (/scale|tỉ lệ/.test(t)) exp = n[1] * n[0 + 1 - 1 + 0] * 0 + (n[2] * n[1]) / 100 * 1;   /* tỉ lệ 1 : S, k cm → k × S ÷ 100 m */
    else exp = (n[1] / n[0]) * n[2];
    if (/scale|tỉ lệ/.test(t)) { const sc = +t.match(/1 : (\d+)/)[1], cm = +t.match(/(\d+) cm/)[1]; exp = cm * sc / 100; }
    else if (!/ratio of the smaller|tỉ số của số bé/.test(t)) { const kg1 = +t.match(/(\d+) kg/)[1], money = +t.match(/(\d+) (?:đồng|dong)/)[1], kg2 = +t.match(/(\d+) kg[^0-9]*(?:như|of the same)?[^0-9]*$/)[1]; exp = money / kg1 * (n[n.length - 1] === money ? kg2 : n[n.length - 1]); }
    ok(close(rn(q), exp), "sai: " + t + " → " + right(q) + " (đúng " + exp + ")");
  });
  gen("dec_muldiv", 5, lang, N, (q, t, n) => {
    ok(distinctRight(q), "đáp án trùng: " + t); const m = t.match(/^([\d.,]+) ([×÷]) ([\d.,]+)/), a = parseFloat(m[1].replace(",", ".")), b = parseFloat(m[3].replace(",", ".")), exp = m[2] === "×" ? a * b : a / b;
    ok(close(rn(q), +exp.toFixed(6)) && !/[.,]$/.test(m[1]), "sai: " + t + " → " + right(q) + " (đúng " + exp + ")");
    ok(q.o.filter(o => !o.ok).every(o => !close(parseFloat(o.v.replace(",", ".")), exp)), "nhiễu trùng đáp án: " + t);
  });
  gen("frac_muldiv", 5, lang, N, (q, t) => {
    ok(distinctRight(q), "đáp án trùng: " + t);
    const m = t.match(/^(\d+)\/(\d+) ([×÷]) (?:(\d+)\/(\d+)|(\d+)) =/), a = +m[1], b = +m[2], c2 = m[4] ? +m[4] : +m[6], d2 = m[5] ? +m[5] : 1;
    const exp = m[3] === "×" ? (a * c2) / (b * d2) : (a * d2) / (b * c2), r = right(q), rv = frVal(r), g = gcdI(+((r.split("/")[0])), +(r.split("/")[1] || 1));
    ok(close(rv, exp), "sai: " + t + " → " + r + " (đúng " + exp + ")"); ok(/\//.test(r) ? g === 1 : true, "chưa rút gọn: " + t + " → " + r);
    for (const o of q.o.filter(x => !x.ok)) ok(!close(frVal(o.v), exp), "nhiễu bằng giá trị đúng: " + t + " | " + o.v);
  });
}
for (const id of ["pct_ratio", "motion_meet", "ratio_prop", "dec_muldiv", "frac_muldiv"]) gen(id, 5, "vi", 120, (q, t) => { ok(Array.isArray(q.hint) && q.hint.length === 2, "thiếu gợi ý: " + id); const h = q.hint.join(" ").replace(/<[^>]+>/g, ""), r = right(q).replace(/ .*$/, ""); ok(r.length < 3 || !new RegExp("(^|[^0-9,./])" + r.replace(/[.,/]/g, c => "\\" + c) + "([^0-9,/]|$)").test(h.replace(/\d+(?:[,.]\d+)?\s*[×÷+−]\s*\d+(?:[,.]\d+)?/g, " ")) || /^\d{1,2}$|^(100|1000)$/.test(r), "gợi ý nêu đáp án " + r + " | " + h.slice(0, 120)); });

console.log("8) Toán lớp 5: biểu đồ quạt SVG và hỗn số (tự tính lại từ SVG và đề, không dùng công thức của bộ sinh)");
const gcdN = (a, b) => b ? gcdN(b, a % b) : a, FR = /^(?:(\d+) )?(\d+)\/(\d+)$/;
const fv = s => { const m = FR.exec(s); return m ? [(+(m[1] || 0)) * +m[3] + +m[2], +m[3]] : null; };           /* "w r/d" → [tử, mẫu] */
const norm = ([n, d]) => { const g = gcdN(n, d); return [n / g, d / g]; };
const canon = ([n, d]) => { [n, d] = norm([n, d]); const w = Math.floor(n / d), r = n % d; return r === 0 ? String(w) : (w ? w + " " : "") + r + "/" + d; };
for (const lang of ["vi", "en"]) {
  gen("pie_chart", 5, lang, N, (q) => {
    const svg = q.q.match(/<svg[\s\S]*?<\/svg>/)[0], plain = txt(q.q.replace(svg, " "));
    ok(/viewBox="0 0 120 120"/.test(svg) && /width="(\d+)" height="\1"/.test(svg), "SVG phải vuông viewBox 0 0 120 120: " + plain);
    const labels = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]), letters = labels.filter((x, i) => i % 2 === 0), shown = labels.filter((x, i) => i % 2 === 1);
    const k = letters.length; ok(k >= 3 && k <= 4 && (svg.match(/<path /g) || []).length === k, "số phần không khớp số nhãn: " + labels);
    ok(letters.join("") === "ABCD".slice(0, k), "nhãn chữ phải là A, B, C…: " + letters);
    const data = svg.match(/data-pie="([\d,]+)"/)[1].split(",").map(Number), unk = +svg.match(/data-unk="(-?\d+)"/)[1];
    ok(data.length === k && data.reduce((a, b) => a + b, 0) === 100 && data.every(x => x >= 15 && x <= 60 && x % 5 === 0), "các phần phải tổng 100%, mỗi phần 15–60% và bội 5: " + data);
    shown.forEach((t, i) => ok(i === unk ? t === "?" : t === data[i] + "%", "nhãn % không khớp dữ liệu: " + t + " vs " + data[i]));
    ok(shown.filter(t => t === "?").length === (unk >= 0 ? 1 : 0), "đúng một phần ghi ? khi hỏi phần còn lại");
    /* dùng ĐÚNG những gì bé thấy: phần trăm đọc từ nhãn trong SVG, tên phần đọc từ chú giải */
    const pct = shown.map(t => (t === "?" ? null : +t.replace("%", ""))), names = {};
    (plain.replace(/^.*?: (?=A )/, "").split(/ (?=Lớp có|The class|Phần|Số bạn|Bao nhiêu|How|What)/)[0].match(/[A-D] .+?(?= · [A-D] |$)/g) || []).forEach(z => { const m = z.match(/^([A-D]) (.+)$/); if (m) names[m[2].trim()] = "ABCD".indexOf(m[1]); });
    ok(Object.keys(names).length === k, "chú giải phải có đủ " + k + " phần: " + plain);
    const idx = nm => { const key = Object.keys(names).filter(x => nm.indexOf(x) >= 0).sort((a, b) => b.length - a.length)[0]; return key === undefined ? -1 : names[key]; };
    const Nm = plain.match(/(?:Lớp có|The class has) (\d+)/), Ncls = Nm ? +Nm[1] : 0, R = rn(q); let exp, m;
    if ((m = plain.match(/Phần ([A-D]) chiếm bao nhiêu|What percent is slice ([A-D])/))) { const u = "ABCD".indexOf(m[1] || m[2]); ok(u === unk, "phần ? không khớp"); exp = 100 - pct.filter((x, i) => i !== u).reduce((a, b) => a + b, 0); }
    else if ((m = plain.match(/Số bạn thích (.+?) hơn (.+?) bao nhiêu phần trăm|How many percent more like (.+?) than (.+?)\?$/))) { const a = idx(m[1] || m[3]), b = idx(m[2] || m[4]); ok(a >= 0 && b >= 0 && a !== b, "không nhận ra hai phần: " + plain); exp = pct[a] - pct[b]; }
    else if ((m = plain.match(/Số bạn thích (.+?) hơn (.+?) bao nhiêu bạn|How many more like (.+?) than (.+?)\?$/)) && Ncls) { const a = idx(m[1] || m[3]), b = idx(m[2] || m[4]); ok(a >= 0 && b >= 0 && a !== b, "không nhận ra hai phần: " + plain); exp = Ncls * (pct[a] - pct[b]) / 100; }
    else if ((m = plain.match(/Bao nhiêu bạn thích (.+?)\?$|How many like (.+?)\?$/)) && Ncls) { const a = idx(m[1] || m[2]); ok(a >= 0, "không nhận ra phần: " + plain); exp = Ncls * pct[a] / 100; }
    else throw new Error("không nhận ra kiểu câu: " + plain);
    ok(Number.isInteger(exp) && exp > 0 && close(R, exp), "sai: " + plain + " → " + right(q) + " (đúng " + exp + ")");
    ok(q.o.filter(o => !o.ok).every(o => !close(nums(o.v)[0], exp)), "nhiễu trùng đáp án: " + plain);
    ok(Array.isArray(q.hint) && q.hint.length === 2 && Array.isArray(q.steps) && q.steps.length >= 2, "thiếu gợi ý/lời giải");
    ok(!new RegExp("(^|[^0-9,.])" + String(exp).replace(".", "[.,]") + "(?![0-9])").test(q.hint.join(" ")), "gợi ý lộ đáp án: " + q.hint.join(" "));
    ok(q.steps.join(" ").indexOf(String(exp)) >= 0, "lời giải phải nêu đáp án: " + q.steps.join(" "));
  });
  gen("mixed_num", 5, lang, N, (q, t0) => {
    const t = t0.replace(/\(.*?\)/g, ""), opts = q.o.map(o => o.v), r = right(q);
    ok(opts.every(o => FR.test(o)) && new Set(opts).size === 4, "lựa chọn phải là phân số/hỗn số hợp lệ, khác nhau: " + opts);
    const rv = fv(r); let exp, m;
    if ((m = t.match(/(\d+)\/(\d+)\s*$|(\d+)\/(\d+) (?:dưới dạng|as a)/)) && /^(Viết|Write)/.test(t)) { exp = [+(m[1] || m[3]), +(m[2] || m[4])]; ok(canon(exp) === r && /^\d+ \d+\/\d+$/.test(r), "phân số → hỗn số sai: " + t + " → " + r + " (đúng " + canon(exp) + ")"); }
    else if (/^(Đổi|Change)/.test(t)) { m = t.match(/(\d+) (\d+)\/(\d+)/); exp = [+m[1] * +m[3] + +m[2], +m[3]]; ok(r === exp[0] + "/" + exp[1], "hỗn số → phân số sai: " + t + " → " + r); }
    else { m = t.match(/(\d+) (\d+)\/(\d+) ([+−]) (\d+) (\d+)\/(\d+)/); const a = [+m[1] * +m[3] + +m[2], +m[3]], b = [+m[5] * +m[7] + +m[6], +m[7]], L = a[1] * b[1];
      exp = m[4] === "+" ? [a[0] * b[1] + b[0] * a[1], L] : [a[0] * b[1] - b[0] * a[1], L]; ok(exp[0] > 0 && canon(exp).includes("/"), "kết quả phải dương và không nguyên: " + t); ok(canon(exp) === r, "cộng/trừ hỗn số sai: " + t + " → " + r + " (đúng " + canon(exp) + ")"); }
    for (const o of q.o.filter(x => !x.ok)) { const w = fv(o.v); ok(w && Math.abs(w[0] / w[1] - exp[0] / exp[1]) > 1e-9, "nhiễu bằng giá trị đúng: " + t + " | " + o.v); ok(+(FR.exec(o.v)[2]) < +(FR.exec(o.v)[3]) || !/ /.test(o.v), "nhiễu có phần phân số ≥ 1: " + o.v); }
    ok(Array.isArray(q.hint) && q.hint.length === 2 && Array.isArray(q.steps) && q.steps.length >= 2, "thiếu gợi ý/lời giải");
    ok(!q.hint.join(" ").includes(r), "gợi ý lộ đáp án: " + r);
    ok(/tối giản|simplified|thành phân số|into a fraction/.test(txt(q.q)), "đề phải nói rõ dạng đáp án: " + txt(q.q));
  });
}
{ const wa = new Set(); for (let i = 0; i < 60; i++) { const q = E.make("mixed_num", { lang: "vi", grade: 5, used: {} }); wa.add(/^Viết/.test(txt(q.q)) ? "tohonso" : /^Đổi/.test(txt(q.q)) ? "tophanso" : /\+/.test(txt(q.q)) ? "cong" : "tru"); } ok(wa.size === 4, "mixed_num phải đủ 4 dạng (đổi 2 chiều, cộng, trừ): " + [...wa]); }
{ const wa = new Set(); for (let i = 0; i < 80; i++) { const q = E.make("pie_chart", { lang: "vi", grade: 5, used: {} }); wa.add(txt(q.q.replace(/<svg[\s\S]*?<\/svg>/, " ")).replace(/^.*?· ?\S+(?: \S+)*? ?(?=Cả lớp|Phần|Số bạn|Có)/, "").slice(0, 8)); } ok(wa.size >= 3, "pie_chart phải đủ dạng: " + [...wa]); }
/* lời giải sau khi sai (L5-20): mọi câu Toán lớp 5 có q.steps ≥ 2 dòng, dòng cuối nêu đáp án; không nằm trong gợi ý (gợi ý không lộ đáp án) */
for (const id of Object.keys(E.SKILLS).filter(k => E.SKILLS[k].subj === "toan" && E.SKILLS[k].grades.includes(5))) gen(id, 5, "vi", 20, (q) => ok(Array.isArray(q.steps) && q.steps.length >= 2 && q.steps.every(x => typeof x === "string" && x.length > 3), "thiếu lời giải: " + id));

console.log(bad ? "\n✗ " + bad + " lỗi (" + checks + " phép kiểm)" : "\n✓ kỹ năng Toán mới đạt (" + checks + " phép kiểm tự tính lại)"); process.exit(bad ? 1 : 0);
