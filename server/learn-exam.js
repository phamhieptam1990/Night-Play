"use strict";
/* ĐỀ THI THỬ LỚP 6 (Học Vui Plus G4, KHUNG + BỘ SINH TOÁN). Đề cố định theo số đề (1..3): cùng số đề luôn ra cùng đề (sinh từ hạt giống), đáp án luôn tính lại bằng phép toán nên không thể lệch.
   Đề KHÔNG nằm trong file công khai: chỉ giao qua /api/learn/exam/<id> khi có Plus (tính năng "exam6"); đáp án ở lại máy chủ, chấm bằng /api/learn/exam/<id>/grade.
   Phạm vi hiện có: 30 câu TOÁN lớp 5 (10 dạng × 3 câu) bám khung GDPT 2018, TỰ SOẠN bằng mẫu câu (không chép đề/sách giáo khoa). Phần Tiếng Việt cần người soạn và duyệt (xem docs/LEARN-PLUS-DESIGN.md).
   Mỗi đáp án sai mang MÃ LỖI tư duy (cùng bộ mã với learn/engine.js) để báo cáo "bé hay nhầm gì". Bản nháp: cần người duyệt độ khó và cách diễn đạt trước khi bán. */
const TOPICS = { frac: "Phân số", dec: "Số thập phân", pct: "Phần trăm", geo: "Hình học", unit: "Đo lường", motion: "Chuyển động", stat: "Trung bình cộng", ops: "Biểu thức", ratio: "Tỉ số", place: "Giá trị chữ số", time: "Thời gian" };
const EXAM_IDS = [1, 2, 3], EXAM_MIN = 40;
const rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fr = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; };
const dec = x => String(Math.round(x * 1e6) / 1e6).replace(".", ",");
/* mỗi mẫu: (r, ri) → { q, ans, wrong: [[giá trị, mã lỗi], ...] } ; r = hàm ngẫu nhiên có hạt giống, ri(a,b) số nguyên [a,b] */
const GEN = {
  frac: (r, ri) => { const b = [2, 3, 4, 5, 6][ri(0, 4)], d = [3, 4, 5, 6, 8][ri(0, 4)], a = ri(1, b - 1) || 1, c = ri(1, d - 1) || 1; const n = a * d + c * b, m = b * d;
    return { q: `Tính: ${a}/${b} + ${c}/${d} = ?`, ans: fr(n, m), wrong: [[fr(a + c, b + d), "add_denominator"], [fr(a * c, b * d), "wrong_op"], [fr(n + 1, m), "off_by_one"]] }; },
  dec: (r, ri) => { const x = ri(12, 98) / 10, z = ri(3, 9); const v = Math.round(x * z * 10) / 10;
    return { q: `Tính: ${dec(x)} × ${z} = ?`, ans: dec(v), wrong: [[dec(v / 10), "decimal_point"], [dec(v * 10), "decimal_point"], [dec(Math.round((x + z) * 10) / 10), "wrong_op"]] }; },
  pct: (r, ri) => { const p = [10, 20, 25, 30, 40, 50, 60, 75][ri(0, 7)], n = ri(2, 20) * 20, v = n * p / 100;
    return { q: `${p}% của ${n} là bao nhiêu?`, ans: String(v), wrong: [[dec(Math.round(n / p * 10) / 10), "percent_misread"], [String(n - v), "concept_confuse"], [String(v + p), "wrong_op"]] }; },
  geo: (r, ri) => { const a = ri(6, 24), b = ri(3, a - 1), area = a * b, per = 2 * (a + b); const askArea = ri(0, 1) === 0;
    return askArea ? { q: `Hình chữ nhật dài ${a} cm, rộng ${b} cm. Diện tích hình chữ nhật là bao nhiêu cm²?`, ans: String(area), wrong: [[String(per), "formula_confuse"], [String(a + b), "formula_confuse"], [String(area + a), "off_by_one"]] }
      : { q: `Hình chữ nhật dài ${a} cm, rộng ${b} cm. Chu vi hình chữ nhật là bao nhiêu cm?`, ans: String(per), wrong: [[String(area), "formula_confuse"], [String(a + b), "formula_confuse"], [String(2 * a + b), "carry_error"]] }; },
  unit: null,
  motion: (r, ri) => { const v = ri(3, 12) * 5, t = ri(2, 6), s = v * t; return { q: `Một xe đi với vận tốc ${v} km/giờ trong ${t} giờ. Quãng đường xe đi được là bao nhiêu km?`, ans: String(s), wrong: [[String(v + t), "wrong_op"], [dec(Math.round(v / t * 10) / 10), "wrong_op"], [String(s + v), "off_by_one"]] }; },
  stat: (r, ri) => { const base = ri(10, 40), a = [base, base + ri(1, 9), base + ri(2, 12), base + ri(3, 15)]; const sum = a.reduce((x, y) => x + y, 0); a[3] += (4 - sum % 4) % 4; const s2 = a.reduce((x, y) => x + y, 0), m = s2 / 4;
    return { q: `Trung bình cộng của các số ${a.join("; ")} là bao nhiêu?`, ans: String(m), wrong: [[String(s2), "wrong_op"], [dec(Math.round(s2 / 3 * 10) / 10), "wrong_op"], [String(m + 1), "off_by_one"]] }; },
  ops: (r, ri) => { const a = ri(5, 30), b = ri(2, 9), c = ri(2, 9), d = ri(1, 9), v = a + b * c - d;
    return { q: `Tính giá trị biểu thức: ${a} + ${b} × ${c} − ${d}`, ans: String(v), wrong: [[String((a + b) * c - d), "order_ops"], [String(a + b * (c - d)), "order_ops"], [String(v + 1), "off_by_one"]] }; },
  ratio: (r, ri) => { const x = ri(2, 5), y = ri(2, 5) + (ri(0, 1) ? 0 : 1), k = ri(3, 9), total = (x + y) * k;
    return { q: `Hai bạn chia ${total} viên bi theo tỉ lệ ${x} : ${y}. Phần của bạn có tỉ lệ ${x} là bao nhiêu viên?`, ans: String(x * k), wrong: [[String(y * k), "concept_confuse"], [dec(Math.round(total / x * 10) / 10), "wrong_op"], [String(x * k + k), "off_by_one"]] }; },
  place: (r, ri) => { const d = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => r() - 0.5), [w, t, h, z] = d;
    return { q: `Trong số ${w},${t}${h}${z}, chữ số ${h} thuộc hàng nào?`, ans: "hàng phần trăm", wrong: [["hàng phần mười", "place_value"], ["hàng phần nghìn", "place_value"], ["hàng đơn vị", "place_value"]] }; },
  time: (r, ri) => { const h1 = ri(6, 9), m1 = ri(1, 5) * 10 + 5, h2 = h1 + ri(1, 3), m2 = ri(0, 5) * 10 + 5; const tot = (h2 * 60 + m2) - (h1 * 60 + m1); const fmt = x => `${Math.floor(x / 60)} giờ ${x % 60} phút`; if (tot <= 0) return GEN.time(r, ri);
    return { q: `Một buổi học bắt đầu lúc ${h1} giờ ${m1} phút và kết thúc lúc ${h2} giờ ${m2} phút. Buổi học kéo dài bao lâu?`, ans: fmt(tot), wrong: [[fmt(tot + 10), "off_by_one"], [fmt(tot - 10 > 0 ? tot - 10 : tot + 20), "off_by_one"], [fmt(Math.abs((h2 - h1) * 60 + (m2 - m1)) + 40), "carry_error"]] }; }
};
/* dạng đổi đơn vị (cm, g, m) */
GEN.unit = (r, ri) => { const k = ri(0, 2);
  if (k === 0) { const m = ri(12, 95) / 10; return { q: `${dec(m)} m = ... cm`, ans: String(Math.round(m * 100)), wrong: [[String(Math.round(m * 10)), "unit_convert"], [String(Math.round(m * 1000)), "unit_convert"], [dec(m / 100), "unit_convert"]] }; }
  if (k === 1) { const kg = ri(2, 9) + ri(1, 9) / 10; return { q: `${dec(kg)} kg = ... g`, ans: String(Math.round(kg * 1000)), wrong: [[String(Math.round(kg * 100)), "unit_convert"], [String(Math.round(kg * 10000)), "unit_convert"], [dec(kg / 1000), "unit_convert"]] }; }
  const km = ri(2, 12), m = ri(1, 9) * 100; return { q: `${km} km ${m} m = ... m`, ans: String(km * 1000 + m), wrong: [[String(km * 100 + m), "unit_convert"], [String(km * 10 + m), "unit_convert"], [String(km * 1000 + m / 100), "place_value"]] }; };
const ORDER = ["frac", "dec", "pct", "geo", "unit", "motion", "stat", "ops", "ratio", "place", "time"], PER = 3;   // 11 dạng... lấy 10 dạng đầu có đáp án chắc (bỏ "time" khỏi đề 30 câu nếu thừa)
function makeExam(id) {
  id = Math.floor(+id); if (!EXAM_IDS.includes(id)) return null;
  const r = rng(0x6A09E667 ^ (id * 2654435761)), ri = (a, b) => a + Math.floor(r() * (b - a + 1)), items = [], seen = new Set(), topics = ORDER.slice(0, 10);
  for (const tp of topics) for (let k = 0, tries = 0; k < PER && tries < 60; tries++) {
    const g = GEN[tp](r, ri); if (!g || g.ans == null || seen.has(g.q)) continue;
    const opts = [[g.ans, null], ...g.wrong].filter((o, i, a) => a.findIndex(x => x[0] === o[0]) === i);   // bỏ đáp án trùng
    if (opts.length < 4 || opts.some(o => o[0] === "NaN" || o[0] === "Infinity")) continue;
    const four = opts.slice(0, 4); for (let i = four.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [four[i], four[j]] = [four[j], four[i]]; }
    seen.add(g.q); items.push({ id: "e" + id + "-" + String(items.length + 1).padStart(2, "0"), topic: tp, q: g.q, options: four.map(o => o[0]), correct: four.findIndex(o => o[1] === null), tags: four.map(o => o[1]) }); k++;
  }
  return { id, title: "Đề thi thử lớp 6, đề " + id + " (Toán)", minutes: EXAM_MIN, topics: Object.fromEntries(topics.map(t => [t, TOPICS[t]])), items, draft: true };
}
function publicExam(e) { return e && { id: e.id, title: e.title, minutes: e.minutes, draft: true, topics: e.topics, items: e.items.map(i => ({ id: i.id, topic: i.topic, q: i.q, options: i.options })) }; }
/* answers: { "<id câu>": <chỉ số đáp án 0-3> } → điểm, điểm theo dạng bài, các mã lỗi bé hay mắc */
function gradeExam(e, answers) {
  const by = {}, errs = {}; let ok = 0, done = 0; answers = answers && typeof answers === "object" ? answers : {};
  for (const it of e.items) {
    const b = by[it.topic] || (by[it.topic] = { ok: 0, n: 0 }); b.n++;
    const a = answers[it.id]; if (a === undefined || a === null) continue; done++;
    if (Number.isInteger(a) && a === it.correct) { ok++; b.ok++; } else if (Number.isInteger(a) && a >= 0 && a < it.options.length) { const t = it.tags[a] || "other"; errs[t] = (errs[t] || 0) + 1; }
  }
  const n = e.items.length, weak = Object.keys(by).filter(t => by[t].ok / by[t].n < 0.67).sort((x, y) => by[x].ok / by[x].n - by[y].ok / by[y].n);
  return { score: ok, max: n, score10: Math.round(ok / n * 100) / 10, answered: done, byTopic: by, weak, errors: errs };
}
module.exports = { makeExam, publicExam, gradeExam, EXAM_IDS, TOPICS };
