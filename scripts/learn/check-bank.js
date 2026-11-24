// Bài đo bộ máy học (plan-learn.md 0.4–0.5). Chạy: node scripts/learn/check-bank.js
//  1) ngân hàng dựng sẵn đúng lược đồ  2) mọi bộ sinh câu: 4 lựa chọn khác nhau, 1 đúng, đáp án sai có mã lỗi, phép tính ĐÚNG
//  3) mức thành thạo  4) chọn câu thích ứng (ưu tiên kỹ năng hay sai)  5) xuất theo lược đồ cho AI
const fs = require("fs"), path = require("path"), vm = require("vm"), root = path.join(__dirname, "..", "..");
global.window = global;
for (const f of ["learn/content/curriculum.js", "learn/content/bank.js"]) vm.runInThisContext(fs.readFileSync(path.join(root, f), "utf8"));
const E = require(path.join(root, "learn/engine.js")), CUR = window.LEARN_CURRICULUM, BANK = window.LEARN_BANK;
let bad = 0, checks = 0; const ko = m => { bad++; console.log("  ✗ " + m); }, ok = (c, m) => { checks++; if (!c) ko(m); };
const mem = {}; const fresh = () => { for (const k in mem) delete mem[k]; E.use({ get: k => (k in mem ? mem[k] : null), set: (k, v) => { mem[k] = v; } }); };
const seeded = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const topicIds = new Set(); for (const s of Object.values(CUR.subjects)) for (const g of s.grades) for (const t of g.topics) topicIds.add(t.id);
const strip = h => String(h).replace(/<[^>]+>/g, "");

/* 1) ngân hàng */
console.log("1) ngân hàng dựng sẵn: " + BANK.length + " câu");
ok(BANK.length >= 20, "cần >= 20 câu mẫu, có " + BANK.length);
const ids = new Set(), emoji = BANK.filter(b => b.type === "emoji_word").length; ok(emoji >= 4, "cần >= 4 câu emoji_word để lấy đáp án nhiễu");
for (const b of BANK) {
  const w = b.id + ": ";
  ok(!ids.has(b.id), w + "trùng id"); ids.add(b.id);
  const sk = E.SKILLS[b.skill]; ok(!!sk, w + "kỹ năng lạ " + b.skill); if (!sk) continue;
  ok(sk.subj === b.subj, w + "môn không khớp kỹ năng");
  ok(Array.isArray(b.grades) && b.grades.length && b.grades.every(g => sk.grades.includes(g)), w + "lớp ngoài phạm vi kỹ năng");
  ok([1, 2, 3, 4, 5].includes(b.diff), w + "diff 1–3"); ok(["fill_blank", "choose", "word_problem", "emoji_word", "dialogue"].includes(b.type), w + "type lạ");
  const stems = typeof b.stem === "string" ? [b.stem] : [b.stem.vi, b.stem.en]; ok(stems.every(x => x && x.length >= 1 && x.length <= 160), w + "stem rỗng/quá dài");
  if (b.type === "fill_blank") ok(stems.every(x => /_{2,}/.test(x)) || /\?$/.test(stems[0]), w + "fill_blank cần chỗ trống __");
  ok(b.answer && String(b.answer).length <= 24, w + "đáp án rỗng/quá dài (>24 ký tự, tràn nút)");
  if (b.type === "emoji_word") ok(b.wrong === null, w + "emoji_word có wrong:null");
  else { ok(Array.isArray(b.wrong) && b.wrong.length >= 3, w + "cần >= 3 đáp án sai"); const vals = (b.wrong || []).map(x => String(x[0])); ok(new Set(vals).size === vals.length, w + "đáp án sai trùng nhau"); ok(!vals.includes(String(b.answer)), w + "đáp án sai trùng đáp án đúng"); ok((b.wrong || []).every(x => E.TAGS.includes(x[1])), w + "mã lỗi không hợp lệ: " + (b.wrong || []).map(x => x[1])); ok(vals.every(v => v.length <= 24), w + "đáp án sai quá dài"); }
  for (const g of b.grades) { const t = E.topicOf(b.skill, g); ok(topicIds.has(t), w + "chủ đề không có trong chương trình: " + t + " (lớp " + g + ")"); }
}

/* 2) bộ sinh câu */
console.log("2) sinh câu theo kỹ năng (300 lần × lớp × ngôn ngữ)");
function evalStem(h, lang) {
  if (/\d\/\d/.test(strip(h))) return null;   /* phân số: kiểm bằng ngân hàng, không tính số thập phân */
  let s = strip(h).replace(/=\s*\?/, "").replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/").trim();
  s = s.replace(/(\d+)%/g, "($1/100)").replace(/(\d),(\d)/g, "$1.$2");
  if (!/^[\d.\s+\-*/()]+$/.test(s)) return null; return Function('"use strict";return (' + s + ")")();
}
const num = v => parseFloat(String(v).replace(",", "."));
let made = 0;
for (const [id, sk] of Object.entries(E.SKILLS)) for (const g of sk.grades) for (const lang of ["vi", "en"]) {
  E.setRng(seeded(id.length * 977 + g * 31 + (lang === "vi" ? 1 : 2)));
  const used = {}; const w = `${id} lớp ${g} ${lang}: `;
  for (let i = 0; i < 300; i++) {
    let q; try { q = E.make(id, { lang, grade: g, used: {} }); } catch (e) { ko(w + "lỗi " + e.message); break; } made++;
    const vals = q.o.map(o => o.v);
    if (q.o.length !== 4) { ko(w + "không đủ 4 lựa chọn: " + vals); break; }
    if (new Set(vals).size !== 4) { ko(w + "lựa chọn trùng: " + vals + " | " + strip(q.q)); break; }
    if (q.o.filter(o => o.ok).length !== 1) { ko(w + "phải có đúng 1 đáp án đúng"); break; }
    if (q.o.some(o => !o.ok && !E.TAGS.includes(o.tag))) { ko(w + "đáp án sai thiếu/ sai mã lỗi: " + JSON.stringify(q.o)); break; }
    if (vals.some(v => /NaN|undefined|null|Infinity/.test(v) || (/^-/.test(v)))) { ko(w + "lựa chọn lỗi/âm: " + vals); break; }
    if (vals.some(v => v.length > 24)) { ko(w + "lựa chọn quá dài: " + vals); break; }
    if (!topicIds.has(q.topic)) { ko(w + "chủ đề lạ " + q.topic); break; }
    const right = q.o.find(o => o.ok).v, calc = evalStem(q.q, lang);
    if (calc !== null) { if (Math.abs(calc - num(right)) > 1e-9) { ko(w + "ĐÁP ÁN SAI: " + strip(q.q) + " → " + right + " (đúng là " + calc + ")"); break; }
      if (!q.o.some(o => !o.ok && o.tag !== "other")) { ko(w + "không có mã lỗi nào ngoài 'other': " + strip(q.q)); break; }
      if (q.o.some(o => !o.ok && Math.abs(num(o.v) - calc) < 1e-9)) { ko(w + "đáp án sai bằng đáp án đúng"); break; } }
    else if (q.id) { const b = BANK.find(x => x.id === q.id); if (!b || String(b.answer) !== right) { ko(w + "đáp án không khớp ngân hàng " + q.id); break; } }
    if (lang === "vi" && id === "dec_add" && /\d\.\d/.test(strip(q.q))) { ko(w + "tiếng Việt phải dùng dấu phẩy: " + strip(q.q)); break; }
    if (lang === "en" && id === "dec_add" && /\d,\d/.test(strip(q.q))) { ko(w + "tiếng Anh phải dùng dấu chấm: " + strip(q.q)); break; }
  }
}
console.log("   đã sinh và kiểm " + made + " câu");

/* 3) mức thành thạo */
console.log("3) mức thành thạo"); fresh();
ok(E.level(null) === "not_started", "chưa học = not_started");
const L = []; for (let i = 0; i < 3; i++) L.push(E.record("toan", "add10", true)); ok(L[2] === "emerging", "n<4 vẫn emerging, có " + L[2]);
for (let i = 0; i < 5; i++) E.record("toan", "add10", true); ok(E.level(E.load("toan").add10) === "advanced", "8 câu đúng liền phải advanced, có " + E.level(E.load("toan").add10));
for (let i = 0; i < 4; i++) E.record("toan", "add10", false, "off_by_one"); ok(["emerging", "developing"].includes(E.level(E.load("toan").add10)), "sai liên tiếp phải tụt xuống, có " + E.level(E.load("toan").add10));
ok(E.load("toan").add10.tags.off_by_one === 4, "đếm lỗi theo mã"); ok(E.record("toan", "khong_co", true) === null, "kỹ năng lạ bị bỏ qua");
ok(JSON.parse(mem["learn:err"] || "{}").off_by_one === 4, "tổng lỗi toàn cục learn:err");

/* 4) chọn câu thích ứng */
console.log("4) chọn câu thích ứng");
const share = (subj, g, skill, rounds, seed) => { E.setRng(seeded(seed)); let n = 0, t = 0; for (let i = 0; i < rounds; i++) for (const p of E.planRound(subj, g, 5).slice(1)) { t++; if (p.skill === skill) n++; } return n / t; };   /* chỉ đếm 4 câu chọn thích ứng; câu 1 là khởi động (50% lấy kỹ năng đã vững) nên không đo ưu tiên */
fresh(); E.setRng(seeded(1)); const p0 = E.planRound("toan", 1, 5);
ok(p0.length === 5, "vòng phải đủ 5 câu"); ok(new Set(p0.map(p => p.skill)).size >= 2, "vòng phải có >= 2 kỹ năng"); ok(E.SKILLS[p0[0].skill].diff === 1, "câu đầu là khởi động dễ");
for (const sj of ["toan", "tviet", "tanh"]) for (let g = 1; g <= 5; g++) { fresh(); E.setRng(seeded(g)); const r = E.round(sj, g, { lang: "vi" }); ok(r.length === 5 && new Set(r.map(q => q.q + "|" + (q.speak || ""))).size === 5, `${sj} lớp ${g}: 5 câu không lặp`); ok(E.skillsFor(sj, g).length >= 2, `${sj} lớp ${g}: cần >= 2 kỹ năng`); ok(r.every(q => q.grade === g), `${sj} lớp ${g}: câu mang đúng lớp`); }
fresh(); const base = share("toan", 2, "add_carry", 200, 7);
fresh(); E.setRng(seeded(3)); for (let i = 0; i < 12; i++) { E.record("toan", "add_carry", false, "forget_carry"); for (const s of ["times25", "word_addsub"]) E.record("toan", s, true); }
const after = share("toan", 2, "add_carry", 200, 7);
console.log(`   lớp 2: tỉ lệ 'cộng có nhớ' lúc đầu ${(base * 100).toFixed(0)}% → sau khi bé hay quên số nhớ ${(after * 100).toFixed(0)}%`);
ok(after > base + .1, "kỹ năng hay sai phải được ưu tiên hơn (có " + base.toFixed(2) + " → " + after.toFixed(2) + ")");
ok(E.summary("toan").weakest[0] === "add_carry", "summary: kỹ năng yếu nhất là add_carry, có " + E.summary("toan").weakest);
ok(E.summary("toan").tags.forget_carry >= 12, "summary: đếm lỗi forget_carry");
fresh(); for (let i = 0; i < 14; i++) E.record("toan", "add_carry", true); const mastered = share("toan", 2, "add_carry", 200, 7);
console.log(`   khi bé đã thạo: ${(mastered * 100).toFixed(0)}% (ít hơn lúc đầu ${(base * 100).toFixed(0)}%)`);
ok(mastered < base, "kỹ năng đã thạo phải xuất hiện ít hơn");
fresh(); E.setRng(seeded(11)); const rev = new Set(); for (let i = 0; i < 80; i++) for (const p of E.planRound("toan", 3, 5)) if (p.review) rev.add(p.skill);
ok(rev.size >= 1, "lớp 3 phải có ôn kỹ năng lớp 2"); ok([...rev].every(s => E.SKILLS[s].grades.includes(2)), "ôn chỉ lấy từ lớp dưới");
fresh(); E.setRng(seeded(5)); const a = E.planRound("tviet", 1, 5).map(p => p.skill), b2 = E.planRound("tviet", 1, 5).map(p => p.skill); ok(Array.isArray(a) && Array.isArray(b2), "gọi liên tiếp không lỗi");

/* 5) xuất theo lược đồ cho AI */
console.log("5) xuất theo question_generation_schema");
fresh(); E.setRng(seeded(9)); const REQ = ["question_id", "grade", "strand", "topic_id", "difficulty", "question_type", "prompt", "expected_answer", "solution_steps", "misconception_tags", "curriculum_alignment"];
for (const [sj, g] of [["toan", 2], ["toan", 3], ["tviet", 4], ["tanh", 3], ["tanh", 1]]) for (const q of E.round(sj, g, { lang: "vi" })) { const o = E.toSchema(q, CUR); ok(REQ.every(k => k in o), `${q.skill}: thiếu trường lược đồ`); ok(["foundation", "standard", "challenge"].includes(o.difficulty), `${q.skill}: difficulty`); ok(o.topic_id && o.prompt && o.expected_answer, `${q.skill}: trống`); ok(o.misconception_tags.length === 3 && o.misconception_tags.every(t => E.TAGS.includes(t)), `${q.skill}: mã lỗi`); ok(o.strand !== "", `${q.skill}: không tra được mạch (strand) cho ${o.topic_id}`); }
console.log("6) vòng dài (Luyện nhiều hơn 10/20 câu, đề tổng hợp 30 câu) và chế độ ôn chỗ yếu: E.round(subj, grade, { n, focus: \"weak\" })");
for (const n of [10, 20, 30]) for (const g of [4, 5]) { fresh(); E.setRng(seeded(n + g)); const r = E.round("toan", g, { lang: "vi", n }); const keys = r.map(q => q.q + "|" + (q.speak || ""));
  ok(r.length === n, `E.round n=${n} lớp ${g}: phải đủ ${n} câu, có ${r.length}`); ok(new Set(keys).size >= n - 1, `n=${n} lớp ${g}: quá nhiều câu trùng (${new Set(keys).size}/${n})`); ok(r.every(q => q.grade === g && q.o && q.o.some(x => x.ok)), `n=${n} lớp ${g}: câu hỏng`);
  const per = {}; r.forEach(q => per[q.skill] = (per[q.skill] || 0) + 1); ok(Math.max(...Object.values(per)) <= Math.ceil(n / E.skillsFor("toan", g).length) + 2, `n=${n} lớp ${g}: một kỹ năng chiếm quá nhiều (${JSON.stringify(per)})`); }
fresh(); E.setRng(seeded(77)); for (let i = 0; i < 12; i++) { E.record("toan", "pct_of", false, "percent_misread"); E.record("toan", "dec_add", true); }
ok(E.weakSkills("toan", 5).join() === "pct_of", "weakSkills phải trả pct_of: " + E.weakSkills("toan", 5));
{ let wk = 0, tot = 0, wk0 = 0, tot0 = 0; for (let i = 0; i < 40; i++) { for (const q of E.round("toan", 5, { lang: "vi", n: 20, focus: "weak" })) { tot++; if (q.skill === "pct_of") wk++; } for (const q of E.round("toan", 5, { lang: "vi", n: 20 })) { tot0++; if (q.skill === "pct_of") wk0++; } }
  ok(wk / tot > 1.5 * (wk0 / tot0) && wk / tot > .09, `focus weak phải dồn câu vào kỹ năng yếu: ${(100 * wk / tot).toFixed(1)}% so với ${(100 * wk0 / tot0).toFixed(1)}%`); }
fresh(); ok(E.round("toan", 5, { lang: "vi" }).length === 5, "vòng thường vẫn 5 câu");

/* 7) chống lặp trong một vòng (L3-21): ≥ 300 vòng cho mỗi môn × lớp, có cả vòng đã trộn kiểu câu như index.html */
console.log("7) chống lặp trong vòng: không trùng đề, không trùng từ, mỗi kỹ năng ≤ 1 câu khi còn kỹ năng khác");
require(path.join(root, "learn/content/qtypes.js")); const LT = window.LearnTypes;
const plainQ = q => String(q.q || "").replace(/<[^>]+>/g, " ").replace(/[.,!?;:"“”()]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
const wordQ = q => { const r = q.o && q.o.find(x => x.ok); let w = typeof q.reveal === "string" ? q.reveal : typeof q.ans === "string" ? q.ans : r ? String(r.v) : ""; w = w.toLowerCase().trim(); return /^[^\d\s<>]{3,16}$/.test(w) && !/^(đúng|sai|true|false)$/.test(w) ? w : ""; };
const rep = { exact: 0, word: 0, skill: 0, rounds: 0 }; let sample = "";
for (const sj of ["toan", "tviet", "tanh"]) for (let g = 1; g <= 5; g++) for (const lang of ["vi", "en"]) {
  fresh(); E.setRng(seeded(g * 31 + sj.length * 7 + (lang === "vi" ? 1 : 2)));
  for (let i = 0; i < 80; i++) for (const mixed of [false, true]) {
    let r = E.round(sj, g, { lang }); if (mixed) r = LT.mix(r, sj, g, lang, 3); rep.rounds++;
    const keys = new Set(), words = new Map(), sk = {};
    r.forEach((q, k) => {
      const key = plainQ(q) + "|" + (q.speak || ""), w = wordQ(q);
      if (keys.has(key)) { rep.exact++; sample = `${sj} lớp ${g} ${lang}: trùng đề "${plainQ(q).slice(0, 40)}"`; } keys.add(key);
      if (w && words.has(w)) { rep.word++; sample = `${sj} lớp ${g} ${lang}: cùng từ "${w}" ở câu ${words.get(w)} và ${k}`; } if (w) words.set(w, k);
      if (!mixed && q.skill) sk[q.skill] = (sk[q.skill] || 0) + 1;
    });
    if (!mixed && E.skillsFor(sj, g).length >= 5 && Object.values(sk).some(c => c > 1)) { rep.skill++; sample = `${sj} lớp ${g}: lặp kỹ năng ${JSON.stringify(sk)}`; }
  }
}
console.log(`   ${rep.rounds} vòng: trùng đề ${rep.exact}, trùng từ ${rep.word}, lặp kỹ năng ${rep.skill}`);
ok(rep.rounds >= 300 * 15, "cần ≥ 300 vòng mỗi lớp × môn"); ok(rep.exact === 0, "có vòng lặp đề (" + sample + ")"); ok(rep.word === 0, "có vòng lặp từ (" + sample + ")"); ok(rep.skill === 0, "có vòng lặp kỹ năng (" + sample + ")");

/* 8) E.round không ném lỗi với mọi tham số và dữ liệu tiến độ rỗng/lạ/hỏng ("Cannot read properties of undefined (reading 'id')") */
console.log("8) E.round chịu mọi tham số (môn, lớp, n 1–40, focus, chủ đề) và tiến độ hỏng");
const junk = [null, "", "null", "[]", "5", '"x"', "{", '{"_last":5}', '{"_last":"abc"}', '{"add10":null}', '{"add10":"x"}', '{"add10":{"n":"a","p":null,"tags":"zz"}}', '{"add10":{"n":5,"p":0.5,"tags":{"a":"b"}}}', '{"add10":[1]}', '{"_last":null}'];
const errs = new Set(); let calls = 0;
const topics = [...topicIds].slice(0, 6).concat([undefined, "zzz"]);
for (const sj of ["toan", "tviet", "tanh", "khac", undefined, null]) for (const g of [0, 1, 2, 3, 4, 5, 6, "3", undefined, null, NaN]) for (const j of junk) {
  fresh(); mem["learn:m:" + sj] = j; E.setRng(seeded(calls + 1));
  for (const n of [1, 2, 3, 4, 5, 6, 7, 9, 10, 15, 20, 30, 40, 41, 0, NaN, undefined]) for (const focus of [undefined, "weak"]) {
    if ((n | 0) % 3 === 1 && g !== 3 && g !== 5 && j !== null && j !== "{") continue;   /* thưa bớt tổ hợp để chạy nhanh */
    const topic = topics[(calls++) % topics.length];
    try { const r = E.round(sj, g, { n, focus, topic, lang: calls % 2 ? "vi" : "en" }); if (!Array.isArray(r)) errs.add("không trả về mảng"); else if (["toan", "tviet", "tanh"].includes(sj) && r.length !== Math.max(1, Math.min(40, (n | 0) || 5))) errs.add(`độ dài ${r.length} với n=${n}`); } catch (e) { errs.add(`${sj}/${g}/n=${n}/${focus}/${topic}/${j}: ${e.message}`); }
  }
}
for (let n = 1; n <= 40; n++) for (const sj of ["toan", "tviet", "tanh"]) for (const g of [1, 2, 3, 4, 5]) { fresh(); try { if (E.round(sj, g, { n, lang: "vi" }).length !== n) errs.add(`n=${n} ${sj} lớp ${g}: sai độ dài`); } catch (e) { errs.add(`${sj}/${g}/n=${n}: ${e.message}`); } }
console.log("   " + calls + " lần gọi E.round, lỗi: " + errs.size); ok(errs.size === 0, "E.round ném lỗi: " + [...errs].slice(0, 3).join(" ; "));

console.log(bad ? `\n✗ ${bad} lỗi (${checks} phép kiểm)` : `\n✓ bộ máy học đạt (${checks} phép kiểm, ${BANK.length} câu dựng sẵn, ${Object.keys(E.SKILLS).length} kỹ năng)`);
process.exit(bad ? 1 : 0);
