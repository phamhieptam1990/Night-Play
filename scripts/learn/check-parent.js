// Bài đo trang phụ huynh Học Vui (plan: trang phụ huynh + hẹn giờ). Chạy: node scripts/learn/check-parent.js
//  1) nội dung vi/en đủ cho mọi kỹ năng, mã lỗi, mức thành thạo  2) nhật ký theo ngày + xoá tiến độ  3) hẹn giờ chơi  4) trang sinh ra có liên kết hai chiều vi/en
const fs = require("fs"), path = require("path"), vm = require("vm"), root = path.join(__dirname, "..", "..");
let bad = 0, checks = 0; const ok = (c, m) => { checks++; if (!c) { bad++; console.log("  ✗ " + m); } };
const C = require(path.join(root, "learn/content/parent-copy.js")), E = require(path.join(root, "learn/engine.js"));

console.log("1) nội dung phụ huynh");
for (const id of Object.keys(E.SKILLS)) ok(C.SKILL[id] && C.SKILL[id].length === 2 && C.SKILL[id].every(x => x && x.length < 40), "kỹ năng thiếu tên vi/en: " + id);
for (const t of E.TAGS) { const c = C.TAG[t]; ok(c && c.length === 6 && c.every(x => typeof x === "string" && x.length > 3), "mã lỗi thiếu nội dung: " + t); if (c) { ok(c[4].length <= 260 && c[5].length <= 260, "gợi ý quá dài: " + t); ok(!/chẩn đoán|bệnh|rối loạn|disorder|diagnos/i.test(c.join(" ")), "không được chẩn đoán: " + t); } }
for (const k of ["not_started", "emerging", "developing", "proficient", "advanced"]) ok(C.LEVEL[k] && C.LEVEL[k].length === 2, "thiếu mức " + k);
const kv = Object.keys(C.UI.vi), ke = Object.keys(C.UI.en); ok(kv.join() === ke.join(), "UI vi/en lệch khoá: " + kv.filter(k => !ke.includes(k)).concat(ke.filter(k => !kv.includes(k))));
for (const l of ["vi", "en"]) for (const k of ["title", "gateH", "gateBad", "limit", "unlock", "reset", "resetAsk", "exit", "privacy"]) ok(C.UI[l][k], l + " thiếu UI." + k);
ok(Object.keys(C.UI.vi.lock).join() === Object.keys(C.UI.en.lock).join(), "lock vi/en lệch");

console.log("2) nhật ký ngày + xoá tiến độ");
const mem = {}; E.use({ get: k => (k in mem ? mem[k] : null), set: (k, v) => { mem[k] = v; } });
E.record("toan", "add10", true); E.record("toan", "add10", false, "off_by_one"); E.record("tviet", "tone", true);
let d = E.daily(7); ok(d.length === 7, "daily phải đủ 7 ngày"); ok(d[6].n === 3 && d[6].ok === 2, "hôm nay: n=3 ok=2, có " + d[6].n + "/" + d[6].ok); ok(d[0].n === 0, "ngày cũ nhất không có dữ liệu"); ok(d[6].s.toan === 2 && d[6].s.tviet === 1, "đếm theo môn");
ok(!/add10|off_by_one|\?/.test(mem["learn:day"]) || !/add10/.test(mem["learn:day"]), "nhật ký ngày không được chứa nội dung câu hỏi/kỹ năng");
const old = JSON.parse(mem["learn:day"]); for (let i = 1; i <= 40; i++) old["2020-01-" + String(i).padStart(2, "0")] = { n: 1, ok: 1, s: {} }; mem["learn:day"] = JSON.stringify(old); E.record("toan", "add10", true);
ok(Object.keys(JSON.parse(mem["learn:day"])).length <= 30, "chỉ giữ 30 ngày");
ok(E.summary("toan").skills.some(k => k.n > 0), "summary thấy tiến độ"); E.resetAll();
ok(!E.summary("toan").skills.some(k => k.n > 0) && !E.summary("tviet").skills.some(k => k.n > 0), "resetAll xoá kỹ năng"); ok(E.daily(7).every(x => x.n === 0), "resetAll xoá nhật ký"); ok(Object.keys(E.summary("toan").tags).length === 0, "resetAll xoá lỗi");

/* mọi kỹ năng có thể xuất hiện trong bản tóm tắt (kể cả kỹ năng chỉ theo dõi) phải có tên vi/en và có lớp để trang vẽ không sập */
for (const id of Object.keys(E.TRACKED)) { ok(C.SKILL[id] && C.SKILL[id].length === 2, "kỹ năng theo dõi thiếu tên: " + id); ok(Array.isArray((E.SKILLS[id] || E.TRACKED[id]).grades), "kỹ năng theo dõi thiếu lớp: " + id); }
E.record("toan", "count_obj", true); ok(E.summary("toan").skills.every(k => C.SKILL[k.id] && (E.SKILLS[k.id] || E.TRACKED[k.id])), "summary có kỹ năng không tra được tên/lớp");
{ const dd = E.dayDetail(7); ok(dd.length === 7 && dd[6].items.some(x => x.id === "count_obj" && x.n === 1), "nhật ký chi tiết ghi tên kỹ năng + số câu"); E.noteHint("toan", "count_obj"); ok(E.dayDetail(1)[0].items.find(x => x.id === "count_obj").h === 1, "ghi lần xem gợi ý");
  ok(!/\?|=|\+/.test(mem["learn:dayk"].replace(/[\[\]{}",:\d\-_a-z]/gi, "")), "nhật ký chi tiết chỉ chứa tên kỹ năng và số, không có nội dung câu");
  E.setDetail(false); E.record("toan", "count_obj", true); ok(E.dayDetail(1)[0].items.length === 0, "tắt ghi chi tiết thì không ghi và đã xoá"); E.setDetail(true); E.record("toan", "count_obj", true); ok(E.dayDetail(1)[0].items.length === 1, "bật lại thì ghi tiếp"); E.clearDetail(); ok(E.dayDetail(1)[0].items.length === 0, "clearDetail xoá"); }
{ const vm = require("vm"); global.window = global; vm.runInThisContext(fs.readFileSync(path.join(root, "learn/content/curriculum.js"), "utf8")); for (let g = 1; g <= 5; g++) { const G = E.goals("toan", g, window.LEARN_CURRICULUM); ok(G.topics.length >= 5 && G.total > 0 && G.topics.every(t => t.total > 0), "Toán lớp " + g + ": mọi chủ đề phải có bài luyện (có " + G.topics.filter(t => !t.total).map(t => t.id) + ")"); } }
/* mỗi môn, mỗi lớp phải có đủ kỹ năng để bé không thấy trống (đo độ phủ, không đo chất lượng) */
for (const [sj, min] of [["toan", 10], ["tviet", 5], ["tanh", 5]]) for (let g = 1; g <= 5; g++) { const n = Object.keys(E.SKILLS).filter(i => E.SKILLS[i].subj === sj && E.SKILLS[i].grades.includes(g)).length; ok(n >= min, sj + " lớp " + g + " chỉ có " + n + " kỹ năng (cần >= " + min + ")"); }
/* CSS không được thừa/thiếu ngoặc nhọn: một dấu } thừa làm trình duyệt BỎ quy tắc đứng ngay sau nó (từng làm mất lề của mọi thẻ trang phụ huynh) */
for (const f of ["learn/parent/index.html", "learn/index.html"]) { const h = fs.readFileSync(path.join(root, f), "utf8"); for (const m of h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) { const css = m[1].replace(/\/\*[\s\S]*?\*\//g, ""); let d = 0, neg = -1; for (let i = 0; i < css.length; i++) { if (css[i] === "{") d++; else if (css[i] === "}") { d--; if (d < 0 && neg < 0) neg = i; } } ok(neg < 0 && d === 0, f + ": CSS lệch ngoặc nhọn (độ sâu cuối " + d + (neg >= 0 ? ", dấu } thừa gần: …" + css.slice(Math.max(0, neg - 40), neg + 20).replace(/\s+/g, " ") + "…" : "") + ")"); } }
/* mức thành thạo 4 bậc (Hiểu · Thực hiện · Vận dụng · Thành thạo) và bằng chứng thu thập trong record() */
{ const m = E.mastery4;
  ok(m(null) === 0 && m({ n: 0 }) === 0 && m({ n: 3, ok: 0, p: 0 }) === 0, "chưa đúng câu nào thì mức 0");
  ok(m({ n: 1, ok: 1, p: 1 }) === 1 && m({ n: 5, ok: 2, p: .4 }) === 1, "mới đúng vài câu: Hiểu (1)");
  ok(m({ n: 5, ok: 4, p: .8 }) === 2, ">= 5 câu, >= 70%: Thực hiện (2)");
  ok(m({ n: 8, ok: 7, p: .85, fm: ["mc"] }) === 2, "chỉ MỘT dạng câu thì chưa Vận dụng");
  ok(m({ n: 8, ok: 7, p: .85, fm: ["mc", "typein"] }) === 3, ">= 8 câu, >= 80%, 2 dạng câu: Vận dụng (3)");
  ok(m({ n: 12, ok: 12, p: .95, fm: ["mc", "pop"], days: ["a", "b"], nh: 6 }) === 4, "đủ điều kiện: Thành thạo (4)");
  ok(m({ n: 12, ok: 12, p: .95, fm: ["mc", "pop"], days: ["a"], nh: 6 }) === 3, "chỉ học một ngày thì chưa Thành thạo");
  ok(m({ n: 12, ok: 12, p: .95, fm: ["mc", "pop"], days: ["a", "b"], nh: 5 }) === 3, "đúng nhờ gợi ý nhiều thì chưa Thành thạo");
  ok(m({ n: 20, ok: 19, p: .6, fm: ["mc", "pop"], days: ["a", "b"], nh: 15 }) <= 1, "độ chính xác gần đây thấp thì không lên bậc cao");
  E.resetAll(); for (let i = 0; i < 10; i++) E.record("toan", "add10", true, undefined, { kind: i % 2 ? "typein" : "mc" }); let st = E.load("toan").add10;
  ok(st.fm.length === 2 && st.days.length === 1 && st.nh === 10, "record ghi dạng câu, ngày học, số câu đúng không gợi ý: " + JSON.stringify([st.fm, st.days.length, st.nh]));
  E.record("toan", "add10", true, undefined, { kind: "mc", hint: true }); ok(E.load("toan").add10.nh === 10, "câu đúng có xem gợi ý KHÔNG tính là đúng độc lập");
  ok(E.summary("toan").skills.find(x => x.id === "add10").m4 === 3, "summary có m4 (10 câu đúng, 2 dạng, 1 ngày = Vận dụng)");
  E.resetAll(); }
console.log("3) hẹn giờ chơi");
const store = {}; global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const LL = require(path.join(root, "learn/limit.js"));
ok(LL.getLimit() === 0 && !LL.over() && LL.leftSec() === Infinity, "mặc định không giới hạn");
LL.setLimit(15); ok(LL.getLimit() === 15 && LL.allowedSec() === 900, "đặt 15 phút");
LL.addSec(899); ok(!LL.over() && LL.leftSec() === 1, "chưa hết giờ ở 899s"); LL.addSec(1); ok(LL.over(), "hết giờ ở 900s");
LL.addBonus(10); ok(!LL.over() && LL.allowedSec() === 1500, "cộng 10 phút mở lại"); LL.setLimit(0); ok(!LL.over(), "tắt giới hạn thì không khoá");
LL.setLimit(9999); ok(LL.getLimit() === 600, "giới hạn trên 600 phút"); LL.setLimit(-5); ok(LL.getLimit() === 0, "số âm = tắt");
store["learn:time:" + LL.day()] = "abc"; ok(LL.usedSec() === 0, "dữ liệu hỏng không làm sập");

console.log("4) trang sinh ra");
for (const [f, other, self] of [["landing/hoc/phu-huynh/index.html", "/en/hoc/parents/", "/hoc/phu-huynh/"], ["landing/en/hoc/parents/index.html", "/hoc/phu-huynh/", "/en/hoc/parents/"]]) {
  const h = fs.readFileSync(path.join(root, f), "utf8"); ok(h.includes('hreflang="' + (self.startsWith("/en") ? "vi" : "en") + '" href="https://nightplay.vn' + other), f + " thiếu hreflang chéo"); ok(h.includes('rel="canonical" href="https://nightplay.vn' + self + '"'), f + " canonical"); ok(h.includes("/learn/parent/index.html"), f + " thiếu liên kết vào trang phụ huynh");
  ok(!/an toàn tuyệt đối|100% safe|absolutely safe/i.test(h), f + " hứa quá"); ok((h.match(/<h1/g) || []).length === 1, f + " cần đúng 1 h1");
}
const sm = fs.readFileSync(path.join(root, "landing/sitemap.xml"), "utf8"); ok(sm.includes("/hoc/phu-huynh/") && sm.includes("/en/hoc/parents/"), "sitemap thiếu trang phụ huynh");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8"); for (const u of ["/learn/parent/index.html", "/learn/limit.js", "/learn/content/parent-copy.js"]) ok(sw.includes('"' + u + '"'), "sw.js thiếu " + u);
const rdJs = d => fs.readdirSync(path.join(root, d)).filter(f => /\.js$/.test(f)).map(f => fs.readFileSync(path.join(root, d, f), "utf8")).join("\n");   /* mã trang học nay nằm trong learn/js/*.js */
const li = fs.readFileSync(path.join(root, "learn/index.html"), "utf8") + rdJs("learn/js"); ok(/src="limit\.js"/.test(li) && /id="mParent"/.test(li) && /LearnLimit\.guard/.test(li), "trang học chưa nối hẹn giờ/nút phụ huynh");
const pp = fs.readFileSync(path.join(root, "learn/parent/index.html"), "utf8"); ok(/noindex/.test(pp), "trang phụ huynh trong app phải noindex"); ok(/id="back"/.test(pp), "thiếu nút ←");

console.log(bad ? "✗ " + bad + "/" + checks + " lỗi" : "✓ tất cả đạt (" + checks + " kiểm tra)"); process.exit(bad ? 1 : 0);
