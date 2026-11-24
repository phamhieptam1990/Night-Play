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
gen("data_read", 4, "vi", N, (q, t, n) => { const v = [...t.matchAll(/: (\d+) quyển/g)].map(m => +m[1]); if (/Trung bình/.test(t)) ok(close(rn(q), v.reduce((a, b) => a + b, 0) / 4), "sai: " + t); else if (/Cả bốn ngày/.test(t)) ok(rn(q) === v.reduce((a, b) => a + b, 0), "sai: " + t); });
gen("data_read", 3, "vi", N, (q, t) => { const v = [...t.matchAll(/: (\d+) quyển/g)].map(m => +m[1]); if (/nhiều nhất/.test(t)) { const mx = Math.max(...v); ok(v.filter(x => x === mx).length === 1, "nhiều nhất bị hòa (hai đáp án đúng): " + t); ok(t.match(/(Thứ \S+): / ) && right(q) === ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"][v.indexOf(mx)], "sai: " + t + " → " + right(q)); } });
gen("data_read", 4, "vi", N, (q, t) => { const v = [...t.matchAll(/: (\d+) quyển/g)].map(m => +m[1]); if (/nhiều nhất/.test(t)) { const mx = Math.max(...v); ok(v.filter(x => x === mx).length === 1, "nhiều nhất bị hòa: " + t); } });
for (const g of [1, 2]) gen("data_read", g, "vi", N, (q, t) => { if (/nhiều nhất/.test(t) && !/hơn/.test(t)) { const rows = [...t.matchAll(/(\S+) : (\S+)/gu)].map(m => [m[1], Array.from(m[2]).length]), mx = Math.max(...rows.map(r => r[1])); ok(rows.filter(r => r[1] === mx).length === 1, "nhiều nhất bị hòa: " + t); } });
gen("data_read", 5, "vi", N, (q, t, n) => { const v = [...t.matchAll(/: (\d+) quyển/g)].map(m => +m[1]), day = t.match(/\? (Thứ \S+) chiếm|(Thứ \S+) chiếm/), d = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"].find(x => t.indexOf(x + " chiếm") >= 0); ok(d && close(rn(q), v["Thứ Hai,Thứ Ba,Thứ Tư,Thứ Năm".split(",").indexOf(d)] * 100 / v.reduce((a, b) => a + b, 0)), "sai: " + t + " → " + right(q)); });
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

console.log(bad ? "\n✗ " + bad + " lỗi (" + checks + " phép kiểm)" : "\n✓ kỹ năng Toán mới đạt (" + checks + " phép kiểm tự tính lại)"); process.exit(bad ? 1 : 0);
