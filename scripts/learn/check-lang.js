// Kiểm kỹ năng Tiếng Việt + Tiếng Anh (learn/lang-skills.js): dữ liệu chuẩn, KHÔNG nhập nhằng, đáp án đúng theo luật độc lập.
// Chạy: node scripts/learn/check-lang.js
const path = require("path"), root = path.join(__dirname, "..", "..");
const E = require(path.join(root, "learn/engine.js")), LS = require(path.join(root, "learn/lang-skills.js")), D = LS.DATA;
let bad = 0, checks = 0; const ko = m => { bad++; console.log("  ✗ " + m); }, ok = (c, m) => { checks++; if (!c) ko(m); };
const seeded = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const strip = h => String(h).replace(/<br>/g, " | ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const base = s => s.normalize("NFD").replace(/[̣̀́̃̉]/g, "").normalize("NFC");   /* bỏ dấu thanh (giữ ă â ê ô ơ ư đ) */
const dup = a => a.filter((x, i) => a.indexOf(x) !== i);

console.log("1) dữ liệu Tiếng Việt");
ok(!dup(D.letterStart.map(x => x[0])).length, "chữ cái đầu: trùng hình " + dup(D.letterStart.map(x => x[0])));
for (const [e, w, l] of D.letterStart) { const f = w.normalize("NFC").charAt(0); ok(f === l, `chữ cái đầu sai: ${w} → ${l}`); ok(base(f) === f, `chữ đầu ${w} có dấu thanh, dễ gây nhầm`); }
for (const [k, vs] of Object.entries(D.vowelsOf)) for (const v of vs.split(" ")) { if (k === "c") ok(!/[eêi]/.test(v), "c không đi với e ê i: " + k + v); if (k === "k") ok(/[eêi]/.test(v), "k chỉ đi với e ê i: " + k + v); }
{ const seenS = new Set(), seenW = new Set(); for (const [kind, rest, sent] of D.nghItems) { const nx = base(rest.charAt(0)).charAt(0), front = ["e", "ê", "i"].includes(nx), w = kind + rest;
  ok(["ngh", "gh", "k"].includes(kind) === front, `quy tắc ngh/gh/k sai: ${w} (${kind})`); ok(sent.includes("__" + rest) && (sent.match(/__/g) || []).length === 1, `câu ngữ cảnh phải có đúng một chỗ "__${rest}": ${sent}`);
  ok(!seenS.has(sent) && !seenW.has(w), "trùng câu hoặc trùng từ: " + sent); seenS.add(sent); seenW.add(w); ok(sent.length <= 60, "câu ngữ cảnh quá dài: " + sent);
  /* câu ngữ cảnh KHÔNG được chứa sẵn từ đáp án (sẽ lộ đáp án) */ ok(!sent.replace("__" + rest, "").includes(w), "câu ngữ cảnh lộ từ đáp án: " + sent); } }
const inits = D.initWords; for (const [g, grp] of Object.entries(inits)) { const ks = Object.keys(grp).filter(x => x !== "extra"); const allw = [];
  for (const k of ks) for (const [e, w] of grp[k]) { ok(w.normalize("NFC").startsWith(k), `${g}: ${w} không bắt đầu bằng ${k}`); allw.push([e, w]); }
  ok(!dup(allw.map(x => x[0])).length, g + ": hai từ dùng chung một hình " + dup(allw.map(x => x[0]))); ok(!dup(allw.map(x => x[1])).length, g + ": trùng từ");
  for (const x of grp.extra) ok(!ks.includes(x), g + ": đáp án nhiễu trùng đáp án thật " + x); }
const cls = { things: D.things, actions: D.actions, traits: D.traits }; const all = [].concat(D.things, D.actions, D.traits); ok(!dup(all).length, "từ loại: một từ nằm ở hai nhóm: " + dup(all));
const cue = { h: /(?<!\p{L})(gì|đâu|sao|ai|không|nào|bao giờ|bao nhiêu)(?!\p{L})/iu, c: /(^ôi|^chao|hoan hô|^chà|quá|thật)/i, y: /(^hãy|^đừng|nào$|hãy )/i };
for (const [s, t] of D.sentences) { if (t === "h") ok(cue.h.test(s), "câu hỏi không có từ nghi vấn: " + s); else ok(!cue.h.test(s), "câu không phải hỏi mà có từ nghi vấn: " + s + " (" + t + ")");
  if (t === "c") ok(cue.c.test(s), "câu cảm thiếu dấu hiệu: " + s); if (t === "k") ok(!cue.c.test(s) && !cue.y.test(s), "câu kể lẫn dấu hiệu cảm/khiến: " + s); if (t === "y") ok(cue.y.test(s), "câu khiến thiếu dấu hiệu: " + s); }
for (const it of D.synonyms) { ok(it.d.length >= 3, "đồng nghĩa thiếu nhiễu: " + it.w); for (const d of it.d) ok(!it.s.includes(d) && d !== it.w, `đồng nghĩa: đáp án nhiễu "${d}" cũng đúng/trùng cho "${it.w}"`); }
const sset = new Map(); for (const it of D.synonyms) sset.set(it.w, it.s);
for (const it of D.synonyms) for (const d of it.d) { const sy = sset.get(d); ok(!sy || !sy.includes(it.w), `đồng nghĩa: nhiễu "${d}" đồng nghĩa ngược với "${it.w}"`); }
const aw = D.antonyms.flatMap(x => [x[0], x[1]]); ok(!dup(aw).length, "trái nghĩa: một từ ở hai cặp: " + dup(aw)); for (const [a, b, c] of D.antonyms) ok(a !== b && c, "cặp trái nghĩa lỗi: " + a);
for (const [t, a] of D.idioms) { ok(t.length + a.length < 90, "thành ngữ quá dài: " + t); ok(!a.includes(" ") || a === "nước sơn", "đáp án thành ngữ nên là một từ: " + a); }
const ia = D.idioms.map(x => x[1]); ok(!dup(ia).length, "thành ngữ: trùng đáp án " + dup(ia));
for (const [q, a, d] of D.manners) { ok(d.length >= 3 && !d.includes(a), "giao tiếp: nhiễu trùng đáp án: " + q); for (const x of d.concat([a])) ok(x.length <= 24, "giao tiếp: dài quá 24 ký tự: " + x); }
for (const it of D.readVi.concat(D.readEn)) { const t = it.t.toLowerCase(); ok(t.includes(it.a.toLowerCase()), `đọc hiểu: đáp án "${it.a}" không có trong đoạn: ${it.t.slice(0, 30)}`); ok(it.d.length === 3 && !it.d.includes(it.a), "đọc hiểu: nhiễu trùng đáp án " + it.a);
  for (const d of it.d) { ok(d.length <= 24, "đọc hiểu: đáp án dài > 24: " + d); } for (const x of [it.a].concat(it.d)) ok(x.length <= 24, "đọc hiểu: dài > 24: " + x); }

console.log("2) dữ liệu Tiếng Anh + luật độc lập");
/* cài đặt độc lập (không dùng hàm trong lang-skills) */
const plural = w => ({ child: "children", man: "men", woman: "women", foot: "feet", tooth: "teeth", mouse: "mice" })[w] || (/(s|x|ch|sh)$/.test(w) ? w + "es" : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + "ies" : w + "s");
const units = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const words = n => n < 20 ? units[n] : n === 100 ? "one hundred" : tens[Math.floor(n / 10)] + (n % 10 ? "-" + units[n % 10] : "");
for (let n = 0; n <= 100; n++) ok(D.rules.numToWord(n) === (n === 20 ? "twenty" : words(n)) , `số → chữ sai: ${n} → ${D.rules.numToWord(n)} (đúng ${words(n)})`);
for (const w of D.plurals) ok(D.rules.enPlural(w) === plural(w), `số nhiều sai: ${w}`);
for (const w of D.anWords) ok(/^[aeiou]/.test(w), "an + từ không bắt đầu bằng nguyên âm: " + w); for (const w of D.aWords) ok(!/^[aeiou]/.test(w), "a + từ bắt đầu bằng nguyên âm: " + w);
for (const [v, f] of Object.entries(D.verbs)) { const third = /(s|x|ch|sh|o)$/.test(v) ? v + "es" : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + "ies" : v === "have" ? "has" : v + "s"; ok(f[0] === third, `ngôi thứ ba sai: ${v} → ${f[0]} (đúng ${third})`); ok(new Set([v].concat(f)).size === 4, "động từ: 4 dạng phải khác nhau: " + v); }
const wdays = [0, 1, 2, 3, 4, 5, 6].map(i => new Date(2024, 0, 1 + i).toLocaleDateString("en-US", { weekday: "long" })); ok(wdays.join() === D.days.join(), "thứ trong tuần sai thứ tự: " + wdays);
const mon = Array.from({ length: 12 }, (_, i) => new Date(2024, i, 1).toLocaleDateString("en-US", { month: "long" })); ok(mon.join() === D.months.join(), "tháng sai thứ tự");
const emoji = []; for (const [t, arr] of Object.entries(D.themes)) for (const [e, w] of arr) emoji.push([e, w]); ok(!dup(emoji.map(x => x[0])).length, "tiếng Anh: hai từ dùng chung một hình: " + dup(emoji.map(x => x[0]))); ok(!dup(emoji.map(x => x[1])).length, "tiếng Anh: trùng từ " + dup(emoji.map(x => x[1])));
ok(!dup(D.colors.map(x => x[0])).length && !dup(D.colors.map(x => x[1])).length, "màu sắc trùng");
for (const [q, cuev, a, d] of D.wh) { ok(!d.includes(a) && d.length === 3, "wh: nhiễu trùng: " + q); ok(q.includes("___"), "wh: thiếu chỗ trống: " + q); }
for (const [m, a] of D.meanings) ok(D.meanings.filter(x => x[1] === a).length === 1, "nghĩa trùng: " + a);
for (const [q, a, d] of D.greetings) ok(!d.includes(a) && d.length === 3, "chào hỏi: nhiễu trùng: " + q);
for (const w of ["cat", "apple", "bus", "ice cream"]) for (const m of D.rules.misspell(w)) ok(m !== w, "misspell trả về đúng từ gốc: " + w);

console.log("3) sinh câu: mỗi câu đúng MỘT đáp án, đáp án theo luật độc lập");
const LANG = Object.keys(E.SKILLS).filter(i => ["tviet", "tanh"].includes(E.SKILLS[i].subj) && ["letter_start", "syllable_blend", "spell_ngh", "spell_init", "word_class", "punct", "sent_type", "synonym", "antonym_pair", "idiom", "greeting_vi", "reading_story", "en_colors", "en_numbers", "en_topic_vocab", "en_meaning", "en_a_an", "en_plural", "en_present_s", "en_wh", "en_days", "en_spelling", "en_greeting", "en_reading"].includes(i));
ok(LANG.length === 24, "phải có 24 kỹ năng mới, có " + LANG.length);
const N = 400; let made = 0;
const gen = (id, g, lang, f) => { E.setRng(seeded(id.length * 53 + g * 7 + (lang === "vi" ? 1 : 2))); for (let i = 0; i < N; i++) { const q = E.make(id, { lang, grade: g, used: {} }); made++; const t = strip(q.q), right = q.o.find(o => o.ok).v, wr = q.o.filter(o => !o.ok).map(o => o.v);
  try { if (q.o.length !== 4 || new Set(q.o.map(o => o.v)).size !== 4) throw new Error("không đủ 4 lựa chọn khác nhau"); if (q.o.filter(o => o.ok).length !== 1) throw new Error("không có đúng 1 đáp án"); if (q.o.some(o => !o.ok && !E.TAGS.includes(o.tag))) throw new Error("mã lỗi lạ"); if (q.o.some(o => o.v.length > 24)) throw new Error("đáp án dài > 24");
    f(q, t, right, wr); } catch (e) { ko(`${id} lớp ${g} ${lang}: ${e.message} | ${t.slice(0, 90)} → ${right} / ${wr.join(", ")}`); return; } } };
for (const lang of ["vi", "en"]) {
  gen("letter_start", 1, lang, (q, t, r) => { const w = t.match(/\S+ ([^ ]+(?: [^ ]+)?) (bắt|starts)/); const it = D.letterStart.find(x => t.includes(x[0]) && t.includes(x[1])); if (!it || it[2] !== r) throw new Error("chữ cái đầu sai"); });
  for (const g of [1, 2]) gen("syllable_blend", g, lang, (q, t, r, wr) => { const m = t.match(/^(\S+) \+ (\S+)( = \?)?/) || t.match(/^(\S+) thêm (dấu \S+)/); if (!m) throw new Error("không đọc được đề"); const tone = D.tones.find(x => t.includes(x[0]));
    if (tone) { const syl = m[1]; const nd = r.normalize("NFD"); if (!nd.includes(tone[1]) || base(r) !== base(syl)) throw new Error("tiếng có dấu sai"); } else { if (r.normalize("NFC") !== (m[1] + m[2]).normalize("NFC")) throw new Error("ghép vần sai"); const k = m[1], v = m[2]; if (!D.vowelsOf[k].split(" ").includes(v)) throw new Error("tiếng không hợp lệ"); } });
  for (const g of [1, 2]) gen("spell_ngh", g, lang, (q, t, r, wr) => { const it = D.nghItems.find(x => t.includes(x[2])); if (!it || it[0] !== r) throw new Error("điền sai theo dữ liệu: " + r); const nx = base(it[1].charAt(0)).charAt(0), front = ["e", "ê", "i"].includes(nx); if (["ngh", "gh", "k"].includes(r) !== front) throw new Error("trái quy tắc ngh/gh/k: " + r + it[1]); });
  for (const g of [2, 3, 4, 5]) gen("spell_init", g, lang, (q, t, r) => { const m = t.match(/(\S+) __(.*)$/); const it = Object.values(D.initWords).flatMap(grp => Object.entries(grp).filter(([k]) => k !== "extra").flatMap(([k, arr]) => arr.map(a => [k, a[0], a[1]]))).find(x => t.includes(x[1]) && x[2] === r + t.split("__")[1].trim()); if (!it || it[0] !== r) throw new Error("chính tả phụ âm đầu sai"); });
  for (const g of [2, 3, 4, 5]) gen("word_class", g, lang, (q, t, r, wr) => { const want = /sự vật|noun|danh từ/.test(t) ? "things" : /hoạt động|verb|động từ/.test(t) ? "actions" : "traits"; if (!D[want].includes(r)) throw new Error("từ loại sai"); for (const w of wr) if (D[want].includes(w)) throw new Error("đáp án nhiễu cũng thuộc loại: " + w); });
  for (const g of [2, 3, 4, 5]) gen("punct", g, lang, (q, t, r) => { const s = t.split(": ")[1].replace(/ __.*$/, ""); const it = D.sentences.find(x => s.startsWith(x[0])); if (it) { const exp = it[1] === "h" ? "?" : it[1] === "c" ? "!" : it[1] === "y" ? (/^Đừng|nào$/.test(it[0]) ? "!" : ".") : "."; if (r !== exp) throw new Error("dấu cuối câu sai"); } else if (r !== ",") throw new Error("dấu phẩy sai: " + t); });
  for (const g of [3, 4, 5]) gen("sent_type", g, lang, (q, t, r) => { const s = t.match(/“(.*)[.?!]”/)[1], it = D.sentences.find(x => x[0] === s), names = lang === "vi" ? { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" } : { k: "statement", h: "question", c: "exclamation", y: "command" }; if (!it || names[it[1]] !== r) throw new Error("kiểu câu sai"); });
  for (const g of [3, 4, 5]) gen("synonym", g, lang, (q, t, r, wr) => { const w = t.match(/với (\S+(?: \S+)?)\?/)[1], it = D.synonyms.find(x => x.w === w); if (!it.s.includes(r)) throw new Error("đồng nghĩa sai"); for (const x of wr) if (it.s.includes(x)) throw new Error("nhiễu cũng đúng"); });
  for (const g of [2, 3, 4, 5]) gen("antonym_pair", g, lang, (q, t, r, wr) => { const w = t.match(/với (\S+)\?/)[1], p = D.antonyms.find(x => x[0] === w || x[1] === w), exp = p[0] === w ? p[1] : p[0]; if (r !== exp) throw new Error("trái nghĩa sai"); for (const x of wr) { const q2 = D.antonyms.find(y => y[0] === x || y[1] === x); if (q2 && q2[2] === p[2]) throw new Error("nhiễu cùng cụm nghĩa: " + x); } });
  for (const g of [4, 5]) gen("idiom", g, lang, (q, t, r) => { const it = D.idioms.find(x => t.includes(x[0])); if (!it || it[1] !== r) throw new Error("thành ngữ sai"); });
  for (const g of [1, 2]) gen("greeting_vi", g, lang, (q, t, r) => { const it = D.manners.find(x => t.startsWith(x[0].slice(0, 20))); if (!it || it[1] !== r) throw new Error("giao tiếp sai"); });
  for (const g of [1, 2, 3, 4, 5]) gen("reading_story", g, lang, (q, t, r) => { const it = D.readVi.find(x => t.startsWith(x.t.slice(0, 25)) && t.includes(x.q)); if (!it || it.a !== r || !it.g.includes(g) || !it.t.toLowerCase().includes(r.toLowerCase())) throw new Error("đọc hiểu sai"); });
  for (const g of [1, 2]) gen("en_colors", g, lang, (q, t, r) => { const it = D.colors.find(x => t.includes(x[0])); if (it[1] !== r) throw new Error("màu sai"); });
  for (const g of [1, 2, 3]) gen("en_numbers", g, lang, (q, t, r) => { const num = t.match(/(\d+)/), em = t.match(/(🍎+|⭐+|🐟+|🎈+|🌸+)/u); const n = num && !em ? +num[1] : em ? Array.from(em[1]).length : NaN; if (!(n >= 1) || r !== words(n)) throw new Error("số → chữ sai: " + n + " → " + r + " (đúng " + words(n) + ")"); });
  for (const g of [2, 3, 4, 5]) gen("en_topic_vocab", g, lang, (q, t, r) => { const it = emoji.find(x => t.includes(x[0])); if (!it || it[1] !== r) throw new Error("từ vựng sai"); });
  for (const g of [3, 4, 5]) gen("en_meaning", g, lang, (q, t, r) => { const it = D.meanings.find(x => t.includes(x[0] + " ") || t.includes(" " + x[0] + " ") || t.includes(x[0])); const cands = D.meanings.filter(x => new RegExp("\\b" + x[0] + "\\b").test(t)); if (!cands.length || cands[0][1] !== r) throw new Error("nghĩa sai"); });
  for (const g of [3, 4]) gen("en_a_an", g, lang, (q, t, r) => { const w = t.match(/This is __ (.+)\./)[1]; if (r !== (/^[aeiou]/.test(w) ? "an" : "a")) throw new Error("a/an sai: " + w); });
  for (const g of [3, 4, 5]) gen("en_plural", g, lang, (q, t, r, wr) => { const w = t.match(/one (\S+) →/)[1]; if (r !== plural(w)) throw new Error("số nhiều sai: " + w + " → " + r); for (const x of wr) if (x === plural(w)) throw new Error("nhiễu cũng đúng"); });
  for (const g of [4, 5]) gen("en_present_s", g, lang, (q, t, r) => { const m = t.match(/^(.+) __ \((\w+)\)/), subj = m[1], v = m[2]; const third = D.subj3.includes(subj); const f = D.verbs[v]; const exp = third ? f[0] : v; if (r !== exp) throw new Error("hiện tại đơn sai: " + subj + " " + v + " → " + r); });
  for (const g of [4, 5]) gen("en_wh", g, lang, (q, t, r) => { const it = D.wh.find(x => t.includes(x[0])); if (!it || it[2] !== r) throw new Error("từ để hỏi sai"); });
  for (const g of [2, 3, 4]) gen("en_days", g, lang, (q, t, r) => { const arr = /\bJan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test(t) ? D.months : D.days; const m = t.match(/after (\S+)\?|Sau (\S+) là/); if (m) { const cur = m[1] || m[2]; if (arr[(arr.indexOf(cur) + 1) % arr.length] !== r) throw new Error("thứ/tháng sau sai"); } else { const s = t.split(", "); if (arr[(arr.indexOf(s[1]) + 1) % arr.length] !== r || arr[(arr.indexOf(s[0]) + 1) % arr.length] !== s[1]) throw new Error("dãy thứ/tháng sai"); } });
  for (const g of [2, 3, 4, 5]) gen("en_spelling", g, lang, (q, t, r, wr) => { const it = emoji.find(x => t.includes(x[0])); if (!it || it[1] !== r) throw new Error("chính tả tiếng Anh sai"); for (const x of wr) if (emoji.some(y => y[1] === x)) throw new Error("nhiễu là từ khác có thật: " + x); });
  for (const g of [1, 2, 3]) gen("en_greeting", g, lang, (q, t, r) => { const it = D.greetings.find(x => t.includes(x[0])); if (!it || it[1] !== r) throw new Error("chào hỏi sai"); });
  for (const g of [3, 4, 5]) gen("en_reading", g, lang, (q, t, r) => { const it = D.readEn.find(x => t.startsWith(x.t.slice(0, 25)) && t.includes(x.q)); if (!it || it.a !== r || !it.g.includes(g) || !it.t.toLowerCase().includes(r.toLowerCase())) throw new Error("đọc hiểu tiếng Anh sai"); });
}
console.log("   đã sinh và kiểm " + made + " câu");
console.log("4) nghe–viết, viết câu, đọc to");
{ global.window = global; const T = require(path.join(root, "learn/content/qtypes.js")), norm = x => x.normalize("NFC").toLowerCase();
  for (const [sj, g, ok2] of [["tviet", 1, true], ["tviet", 3, true], ["tviet", 4, false], ["tanh", 1, false], ["tanh", 2, true], ["tanh", 5, true]]) { const kinds = T.kindsFor(sj, g); ok(kinds.includes("dictate") === ok2, `nghe–viết ${sj} lớp ${g}: ${ok2 ? "phải có" : "không được có"} trong danh sách kiểu câu`); }
  const wrote = [["tviet", 1, false], ["tviet", 2, true], ["tanh", 2, false], ["tanh", 3, true]]; for (const [sj, g, w] of wrote) ok(T.kindsFor(sj, g).includes("write") === w, `viết câu ${sj} lớp ${g}`);
  for (let i = 0; i < 300; i++) { for (const [sj, g] of [["tviet", 1], ["tviet", 3], ["tanh", 2], ["tanh", 5]]) { const q = T.make("dictate", sj, g, "vi"); ok(q && q.kind === "dictate" && q.ans === norm(q.speak) && q.ans === norm(q.reveal) && !/\s/.test(q.ans) && q.ans.length <= 8 + 2 && q.listen === 1 && q.speak.length > 0, "nghe–viết sai: " + JSON.stringify(q && { a: q.ans, s: q.speak }));
    const all = sj === "tviet" ? D.letterStart.map(x => norm(x[1])) : Object.values(D.themes).flat().map(x => norm(x[1])); ok(all.includes(q.ans), "từ nghe–viết không có trong dữ liệu: " + q.ans); } }
  const rules = [["Em yêu mẹ.", 3, true], ["em yêu mẹ.", 3, false], ["Em yêu mẹ", 3, false], ["Em yêu.", 3, false], ["Em có 2 con mèo.", 3, false], ["Mẹ nấu cơm rất ngon cho cả nhà.", 6, true], ["Con mèo ngủ.", 5, false], ["Đây là nhà em!", 4, true], ["", 3, false], ["   ", 3, false], ["Ôi, đẹp quá…", 3, true]];
  for (const [t, min, exp] of rules) ok(T.checkWrite(t, { min }, "vi").ok === exp, `chấm viết câu sai: "${t}" (min ${min}) mong ${exp}`);
  for (const [t, min, exp] of [["I like my school.", 3, true], ["i like my school.", 3, false], ["I like my school", 3, false], ["I like.", 3, false]]) ok(T.checkWrite(t, { min }, "en").ok === exp, `chấm viết câu tiếng Anh sai: "${t}"`);
  ok(/viết hoa/.test(T.checkWrite("em yêu mẹ.", { min: 3 }, "vi").tip) && /capital/.test(T.checkWrite("i like my school.", { min: 3 }, "en").tip), "lời nhắc phải nói rõ lỗi (viết hoa / capital)");
  for (const [sj, g] of [["tviet", 2], ["tviet", 5], ["tanh", 3], ["tanh", 5]]) for (let i = 0; i < 60; i++) { const q = T.make("write", sj, g, "vi"); ok(q && q.min >= 3 && q.min <= 6 && q.topic, "viết câu: thiếu số từ tối thiểu/chủ đề"); }
  for (const [sj, g] of [["tviet", 1], ["tviet", 5], ["tanh", 1], ["tanh", 5]]) for (let i = 0; i < 60; i++) { const q = T.make("speak", sj, g, "vi"); ok(q && q.speak && q.kind === "speak" && q.listen === 1, "đọc to: thiếu câu mẫu"); }
  for (const id of ["dictate_vi", "write_vi", "speak_vi", "dictate_en", "write_en", "speak_en"]) { ok(E.TRACKED[id], "thiếu kỹ năng theo dõi " + id); ok(T.make(id.startsWith("dictate") ? "dictate" : id.startsWith("write") ? "write" : "speak", id.endsWith("vi") ? "tviet" : "tanh", id.startsWith("speak") ? 3 : 3, "vi").skill === id, "kiểu câu không gắn đúng kỹ năng " + id); }
}
console.log(bad ? "\n✗ " + bad + " lỗi (" + checks + " phép kiểm)" : "\n✓ Tiếng Việt + Tiếng Anh đạt (" + checks + " phép kiểm, " + made + " câu sinh ra)"); process.exit(bad ? 1 : 0);
