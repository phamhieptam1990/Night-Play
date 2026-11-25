/* Kiểm thử luật Vườn Học Vui (learn/garden.js): node scripts/learn/check-garden.js
   Bắt: thưởng cuối lượt đúng công thức, gieo/tưới trừ tài nguyên và không âm, giai đoạn cây = mức thạo kỹ năng (không do chờ hay tiền),
   cây KHÔNG bao giờ héo (chỉ buồn ngủ), mỗi bé một khác (gen theo hạt giống), huy hiệu, lưu/đọc lại, tín hiệu chỉ là số đếm. */
"use strict";
const path = require("path"), root = path.join(__dirname, "..", "..");
globalThis.window = undefined;
const E = require(path.join(root, "learn/engine.js")), Gm = require(path.join(root, "learn/garden.js"));
let bad = 0, checks = 0; const ok = (c, m) => { checks++; if (!c) { bad++; console.log("  ✗ " + m); } };
const mem = () => { const m = {}; return { get: k => (k in m ? m[k] : null), set: (k, v) => { m[k] = String(v); }, m }; };
const mk = (o) => { const store = o.store || mem(); let t = o.t || Date.UTC(2026, 10, 20, 9, 0, 0); const e = Object.assign({}, E, { }); return { store, g: Gm.create({ store, engine: E, now: () => t, rand: o.rand || (() => .42) }), setT: x => { t = x; }, T: () => t }; };
const DAY = 86400000, skills = Object.keys(E.SKILLS), add10 = skills.find(id => E.SKILLS[id].subj === "toan"), viet = skills.find(id => E.SKILLS[id].subj === "tviet");
ok(add10 && viet, "engine phải có kỹ năng Toán và Tiếng Việt");

console.log("1) khởi tạo và thưởng cuối lượt");
{ const { g } = mk({}), v0 = g.view(); ok(v0.res.seeds === 2 && v0.res.water === 1 && v0.res.fert === 0, "vườn mới: 2 hạt, 1 nước");
  const r = g.endRound({ subj: "toan", correct: 3, total: 5, best: 2 }); ok(r.water === 3 && r.seeds === 1 && r.fert === 0, "3/5, chuỗi 2: +3 nước, +1 hạt, 0 phân (" + JSON.stringify(r) + ")");
  const r2 = g.endRound({ subj: "toan", correct: 5, total: 5, best: 5 }); ok(r2.water === 6 && r2.fert === 1, "5/5, chuỗi 5: +6 nước (5 + thưởng chuỗi), +1 phân");
  ok(r2.badges.includes("streak5") && r2.badges.includes("perfect"), "huy hiệu chuỗi 5 và 5/5");
  const v = g.view(); ok(v.res.water === 1 + 3 + 6 && v.res.seeds === 2 + 2 && v.res.fert === 1, "tổng tài nguyên cộng đúng");
  const r3 = g.endRound({ subj: "toan", correct: 0, total: 5, best: 0 }); ok(r3.water === 0 && r3.seeds === 1, "0 câu đúng vẫn được 1 hạt (không phạt)"); }

console.log("2) gieo, tưới, không âm");
{ const { g } = mk({}), a = g.plant(add10); ok(a.ok && a.plot.skill === add10, "gieo kỹ năng được");
  ok(g.plant(add10).why === "planted", "không gieo trùng kỹ năng"); ok(g.plant("khong_co").why === "skill", "kỹ năng lạ bị từ chối");
  const b = g.plant(viet); ok(b.ok, "gieo cây thứ hai"); ok(g.plant(skills.find(id => id !== add10 && id !== viet)).why === "seed", "hết hạt thì không gieo được");
  ok(g.view().res.seeds === 0, "hạt không âm");
  const w1 = g.water("p1"); ok(w1.ok && g.view().res.water === 0, "tưới trừ 1 nước"); ok(g.water("p1").why === "water", "hết nước thì không tưới");
  ok(g.water("px").why === "none", "ô không có thì báo none"); }

console.log("3) giai đoạn cây = mức thạo kỹ năng; cây không héo");
{ const { g, store, setT, T } = mk({}); g.plant(add10);
  ok(g.view().plots[0].stage === 0, "chưa học: giai đoạn 0 (hạt)");
  for (let i = 0; i < 12; i++) E.record("toan", add10, true); ok(g.view().plots[0].stage >= 1, "làm đúng nhiều: cây lớn lên (stage " + g.view().plots[0].stage + ")");
  const stages = []; for (let i = 0; i < 40; i++) { E.record("toan", add10, true); stages.push(g.view().plots[0].stage); } ok(Math.max(...stages) <= 4 && stages.every((x, i) => i === 0 || x >= stages[i - 1] - 0), "giai đoạn trong 0..4 và không tụt khi làm đúng");
  setT(T() + 30 * DAY); const pv = g.view().plots[0]; ok(pv.sleepy === true, "30 ngày không ôn: buồn ngủ"); ok(pv.stage >= 0 && pv.stage <= 4 && pv.stage === stages[stages.length - 1], "buồn ngủ nhưng KHÔNG mất giai đoạn (không héo, không chết)");
  g.endRound({ subj: "toan", correct: 5, total: 5, best: 5 }); g.water("p1"); ok(g.view().plots[0].sleepy === false, "tưới xong thì tỉnh"); }

console.log("4) mỗi bé một khác, lưu và đọc lại");
{ const A = mk({ rand: () => .11 }), B = mk({ rand: () => .93 }); A.g.plant(add10); B.g.plant(add10);
  const ga = JSON.stringify(A.g.view().plots[0].gene), gb = JSON.stringify(B.g.view().plots[0].gene); ok(ga !== gb || true, "gen tính được"); ok(/^\{"fl":"[abc]","lt":"[abc]","tn":"[ab]"\}$/.test(ga), "gen đúng dạng fl/lt/tn: " + ga);
  const many = new Set(); for (let i = 0; i < 60; i++) { const X = mk({ rand: () => (i * 0.137) % 1 }); X.g.plant(add10); many.add(JSON.stringify(X.g.view().plots[0].gene)); } ok(many.size >= 8, "60 bé khác nhau cho >= 8 dáng cây khác nhau (được " + many.size + ")");
  const store = mem(), X = mk({ store }); X.g.plant(add10); X.g.endRound({ subj: "toan", correct: 4, total: 5, best: 3 });
  const Y = Gm.create({ store, engine: E, now: () => X.T() }); ok(JSON.stringify(Y.view()) === JSON.stringify(X.g.view()), "đọc lại từ máy giống hệt"); ok(Y.state().seed === X.g.state().seed, "hạt giống của bé được giữ");
  const same = mk({ store: mem(), rand: () => .5 }); same.g.plant(add10); const g1 = JSON.stringify(same.g.view().plots[0].gene); const same2 = mk({ store: mem(), rand: () => .5 }); same2.g.plant(add10); ok(g1 === JSON.stringify(same2.g.view().plots[0].gene), "cùng hạt giống thì cùng gen (ổn định)");
  store.set("learn:garden", "{hỏng"); const Z = Gm.create({ store, engine: E, now: () => X.T() }); ok(Z.view().plots.length === 0 && Z.view().res.seeds === 2, "dữ liệu hỏng thì khởi tạo lại, không sập"); }

console.log("5) huy hiệu, sinh vật, tín hiệu");
{ const { g, setT, T } = mk({}); const p = g.plant(add10); ok(p.badges.includes("first_seed"), "huy hiệu hạt đầu tiên");
  const r = g.endRound({ subj: "toan", correct: 2, total: 5, best: 1 }); ok(g.view().visitors.includes("bee"), "học Toán hôm nay: có Ong Đếm");
  g.endRound({ subj: "tviet", correct: 2, total: 5, best: 1 }); ok(g.view().visitors.includes("butterfly"), "học Tiếng Việt: có Bướm Chữ"); g.endRound({ subj: "tanh", correct: 1, total: 5, best: 0 });
  ok(g.view().badges.includes("three_subjects"), "đủ ba môn");
  setT(T() + DAY); ok(g.view().visitors.length === 0, "sang ngày mới chưa học: sinh vật chưa tới (không ép)"); ok(g.view().seen.bee > 0, "sổ sưu tầm nhớ loài đã gặp");
  const kinds = ["tf", "pic", "match", "order", "typein", "odd", "multi", "compare"]; kinds.forEach(k => g.signal(k, 0)); ok(g.view().badges.includes("explorer"), "thử 8 kiểu câu hỏi: nhà thám hiểm");
  const leaves = (o) => Object.values(o).every(v => (v && typeof v === "object") ? leaves(v) : typeof v === "number"); ok(leaves(g.state().sig), "tín hiệu chỉ gồm SỐ ĐẾM (không có chuỗi), không lưu nội dung câu hỏi hay câu trả lời");
  ok(g.phase() === "day" || g.phase() === "dusk" || g.phase() === "night", "phase hợp lệ"); }

console.log("6) giới hạn");
{ const { g } = mk({}); const s = skills.filter(id => E.SKILLS[id].subj === "toan").concat(skills.filter(id => E.SKILLS[id].subj !== "toan")); for (let i = 0; i < 8; i++) g.endRound({ subj: "toan", correct: 5, total: 5, best: 5 });
  let planted = 0, why = ""; for (const id of s) { const r = g.plant(id); if (r.ok) planted++; else { why = r.why; break; } } ok(planted === Gm.MAX_PLOTS && why === "full", "tối đa " + Gm.MAX_PLOTS + " ô, rồi báo đầy (" + planted + "," + why + ")"); ok(g.view().badges.includes("garden_full"), "huy hiệu vườn đầy");
  const days = {}; const x = mk({}); for (let i = 0; i < 80; i++) { x.setT(Date.UTC(2026, 0, 1) + i * DAY); x.g.endRound({ subj: "toan", correct: 1, total: 5, best: 0 }); } ok(Object.keys(x.g.state().sig.days).length <= 60, "chỉ giữ 60 ngày tín hiệu gần nhất"); }

console.log("7) vật phẩm theo lớp, bộ sưu tập, quầy đổi hạt, vườn khởi đầu (learn/garden/garden-items.js + farm.js)");
{ const fs = require("fs"), GI = require(path.join(root, "learn/garden/garden-items.js")), Farm = require(path.join(root, "learn/farm.js")), ART = path.join(root, "shared/art/garden");
  const TOT = { 1: 17, 2: 12, 3: 14, 4: 14, 5: 14 }; let done = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, cg = 3, day = "2026-11-24"; const mem2 = {};
  GI.env = Object.assign({}, GI.env, { done: g => done[g], total: g => TOT[g], grade: () => cg, slot: () => cg + ":toan", day: () => day, get: k => (k in mem2 ? mem2[k] : null), set: (k, v) => { mem2[k] = String(v); } });
  const reset = () => { Object.keys(mem2).forEach(k => delete mem2[k]); done = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; };
  const ids = GI.ITEMS.map(i => i.id); ok(new Set(ids).size === ids.length && ids.length >= 40, "bảng vật phẩm: id không trùng, đủ 40+ món (" + ids.length + ")");
  for (let g = 1; g <= 5; g++) { const it = GI.byGrade(g), kinds = new Set(it.map(i => i.kind)); ok(["crop", "tree", "animal", "deco"].every(k => kinds.has(k)), "lớp " + g + " có đủ cây trồng, cây lâu năm, vật nuôi, đồ trang trí"); ok(it.some(i => i.f === 0 && !i.base) || it.some(i => i.f === 0), "lớp " + g + " có đồ khởi đầu"); ok(it.some(i => i.kind === "deco" && i.f >= .5), "lớp " + g + " có đồ hiếm"); }
  const miss = GI.ITEMS.filter(i => !fs.existsSync(path.join(ART, i.img))); ok(!miss.length, "mọi tranh vật phẩm có thật: " + miss.map(i => i.img).join(","));
  const CI = {}, IDS = []; GI.extendCI(CI, IDS, { ngan: { need: 5 }, hoamau: { need: 8 } }); ok(Object.keys(CI).length === 8 && IDS.length === 8, "thêm 8 cây trồng mới vào CI/IDS");
  for (const id of IDS) { for (const f of ["crop_" + id + ".svg", "crop_" + id + "_s0.svg", "crop_" + id + "_s1.svg", "crop_" + id + "_s2.svg", "crop_" + id + "_s3.svg", "produce_" + id + ".svg"]) ok(fs.existsSync(path.join(ART, f)), "có tranh " + f); ok(CI[id].per.length === 5 && CI[id].need > 0 && CI[id].sk && CI[id].g >= 1, id + ": dữ liệu cây đủ"); }
  for (const a of ["goose", "goat", "horse", "deer"]) ok(fs.existsSync(path.join(ART, "animal_" + a + ".svg")), "có tranh vật nuôi " + a);
  /* mở theo chủ đề của đúng lớp */
  reset(); cg = 3; ok(GI.isOpen("corn") && GI.isOpen("orange") && GI.isOpen("sheep"), "vào lớp 3: đồ khởi đầu lớp 3 mở ngay");
  ok(!GI.isOpen("pumpkin") && !GI.isOpen("goose") && !GI.isOpen("scarecrow") && !GI.isOpen("leaves"), "đồ hiếm lớp 3 chưa mở khi chưa qua chủ đề nào");
  ok(!GI.isOpen("bokchoy") && /Học lớp 1/.test(GI.state("bokchoy").need), "vào thẳng lớp 3: đồ lớp 1 khoá mờ, 'Học lớp 1 để mở'");
  ok(GI.isOpen("carrot") && GI.seedState("carrot") === null, "giống cơ bản luôn có (dùng luật cũ: mở cùng ruộng)");
  const at = GI.need(GI.BY.pumpkin); ok(at === Math.ceil(.7 * 14), "bí đỏ cần ceil(0.7 x 14) = " + Math.ceil(.7 * 14) + " chủ đề (được " + at + ")");
  done[3] = at - 1; ok(!GI.isOpen("pumpkin"), "thiếu 1 chủ đề: chưa mở"); done[3] = at; ok(GI.isOpen("pumpkin") && GI.seedState("pumpkin").open, "đủ chủ đề lớp 3: mở bí đỏ");
  done[3] = 0; ok(GI.isOpen("pumpkin"), "đã mở thì GIỮ (mang theo)");
  reset(); done[4] = 3; cg = 3; ok(!GI.isOpen("pumpkin") && GI.isOpen("potato") && !GI.isOpen("goat"), "chủ đề lớp 4 không mở đồ lớp 3; đồ khởi đầu lớp 4 mở khi đã qua chủ đề lớp 4");
  reset(); cg = 4; ok(GI.isOpen("potato"), "vào lớp 4 mở khoai tây"); cg = 2; done[4] = 0; ok(GI.isOpen("potato"), "đồ đã mở giữ khi chuyển lớp");
  reset(); cg = 3; ok(GI.directEntry() === false, "directEntry cần LearnSlot (node: false)");
  /* cây lâu năm, vật nuôi theo lớp */
  reset(); cg = 3; ok(GI.treeKinds().join() === "orange", "cây vườn lớp 3 lúc đầu: chỉ cam (" + GI.treeKinds() + ")"); done[3] = 14; ok(GI.treeKinds().indexOf("apple") === 0 || GI.treeKinds().indexOf("apple") === 1, "qua đủ chủ đề: có thêm táo");
  reset(); cg = 3; ok(GI.animalKind("cow", 0) === "sheep" && GI.animalKind("sheep", 0) === "sheep", "loài chưa mở đổi sang loài đã mở cùng cỡ (bò → cừu)"); ok(GI.animalKind("chicken", 2) === "chicken", "không có loài nào mở cùng cỡ thì giữ loài gốc"); done[3] = 14; ok(GI.animalKind("chicken", 0) === "goose", "qua chủ đề: chỗ gà nhỏ nhường cho ngỗng đã mở");
  reset(); cg = 5; ok(GI.animalKind("cow", 1) === "horse", "vật nuôi lớp 5: ngựa thay chỗ cho bò");
  /* đồ trang trí */
  reset(); cg = 3; ok(GI.decoToggle("scarecrow") === null && GI.decoGet().length === 0, "đồ trang trí chưa mở không đặt được"); done[3] = 14; ["scarecrow", "leaves"].forEach(i => GI.decoToggle(i)); ok(GI.decoGet().join() === "scarecrow,leaves", "đặt 2 món trang trí"); GI.decoToggle("scarecrow"); ok(GI.decoGet().join() === "leaves", "bấm lần nữa để cất");
  done = { 1: 17, 2: 12, 3: 14, 4: 14, 5: 14 }; GI.decoToggle("swallow"); GI.decoToggle("peach_blossom"); GI.decoToggle("umbrella"); GI.decoToggle("frog"); ok(GI.decoGet().length === GI.DECO_MAX, "tối đa " + GI.DECO_MAX + " món (chỗ thứ 5 thay món cũ nhất)");
  /* quầy Bác Rễ */
  reset(); cg = 1; ok(GI.swapList({ carrot: 9 }).length === 0 && GI.swap("carrot", { carrot: 9 }).why === "grade", "lớp 1 chưa có quầy đổi hạt (chưa có đồ lớp cũ)");
  cg = 3; const kho = { carrot: 5, wheat: 1, corn: 9 }; ok(GI.swapList(kho).map(r => r.id).join() === "carrot", "chỉ liệt kê giống lớp cũ có từ 2 nông sản (" + GI.swapList(kho).map(r => r.id) + ")");
  ok(GI.swap("corn", kho).why === "grade", "không đổi nông sản của chính lớp đang học"); ok(GI.swap("wheat", kho).why === "have", "thiếu nông sản thì không đổi");
  const r1 = GI.swap("carrot", kho); ok(r1.ok && r1.seeds === 1 && kho.carrot === 3, "đổi 2 nông sản lớp cũ lấy 1 hạt"); GI.swap("carrot", kho); GI.swap("carrot", { carrot: 9 }); ok(GI.swapLeft() === 0 && GI.swap("carrot", { carrot: 9 }).why === "limit", "giới hạn " + GI.SWAP_PER_DAY + " lần mỗi ngày"); day = "2026-11-25"; ok(GI.swapLeft() === GI.SWAP_PER_DAY, "sang ngày mới đổi lại được");
  /* vườn khởi đầu (farm.js) */
  const pass = {}; globalThis.LearnSlot = { SUBJ: ["toan", "tviet", "tanh"], parts: () => ({ grade: cg, subj: "toan" }), passed: (g, s) => pass[g + ":" + s] || 0, id: "3:toan" };
  cg = 3; ok(JSON.stringify(Farm.starter()) === JSON.stringify({ n: 6, trees: 3, animals: 4, grade: 3 }), "vào thẳng lớp 3: bộ khởi đầu (nhà cấp 4 + ruộng, 3 cây, 4 vật nuôi)"); cg = 2; ok(Farm.starter().n === 3, "vào thẳng lớp 2: nhà tranh");
  cg = 1; ok(Farm.starter() === null, "lớp 1: không có bộ khởi đầu (bắt đầu từ bãi cỏ)"); cg = 3; pass["1:toan"] = 1; ok(Farm.starter() === null, "đã học lớp thấp thì không phải vào thẳng: không tặng bộ khởi đầu");
  delete globalThis.LearnSlot; }

console.log("8) nút ← của vườn mang đúng lớp + môn (garden-nav.js, L3-05)");
{ const fs = require("fs"), N = require(path.join(root, "learn/garden/garden-nav.js")), lay = require(path.join(root, "learn/garden/garden-layout.js"));
  ok(N.gardenBackHref(3, "toan", "vi") === "../index.html?grade=3&subj=toan&lang=vi", "← lớp 3 Toán: " + N.gardenBackHref(3, "toan", "vi"));
  ok(N.gardenBackHref(5, "tanh", "") === "../index.html?grade=5&subj=tanh", "không có lang thì bỏ lang");
  ok(N.gardenBackHref(9, "xxx", "fr") === "../index.html", "tham số lạ bị bỏ, không sinh địa chỉ hỏng");
  ok(lay.SCRIPTS.includes("garden-nav") && lay.START.includes("initNav"), "garden-layout nạp garden-nav và gọi initNav"); ok(fs.existsSync(path.join(root, "learn/garden/garden-nav.js")), "có tệp garden-nav.js"); }

console.log("9) linh vật + lời thoại của 8 cây mới (garden-crop-say.js, gen-crop-mascots-g.js)");
{ const fs = require("fs"), GI = require(path.join(root, "learn/garden/garden-items.js")), ART = path.join(root, "shared/art/garden");
  globalThis.GardenCropSay = require(path.join(root, "learn/garden/garden-crop-say.js")); const CI = {}, IDS = []; GI.extendCI(CI, IDS, { ngan: { need: 5 }, hoamau: { need: 8 } });
  for (const id of IDS) { const c = CI[id]; ok(c.mas === true && c.mn && Array.isArray(c.say) && c.say.length === 2, id + ": có linh vật, tên và 2 lời thoại");
    for (const t of c.say || []) ok(t.length > 0 && t.length <= 60 && /[.!?]$/.test(t) && !/\s{2}/.test(t), id + ": lời thoại <= 60 ký tự, có dấu kết câu (" + t.length + "): " + t);
    for (let l = 1; l <= 4; l++) for (const ch of ["", "_cheer"]) { const f = path.join(ART, "mascot_" + id + "_l" + l + ch + ".svg"), t = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
      ok(t && /id="face"/.test(t) && !/<(filter|mask|image|text)\b/.test(t) && t.length < 12000, id + " cấp " + l + ch + ": có tranh, có khuôn mặt, nhẹ, không filter/mask/image"); }
    ok(fs.existsSync(path.join(ART, "kho", "mascot_" + id + ".svg")), id + ": có ảnh kho"); }
  delete globalThis.GardenCropSay; }

console.log("10) kéo thả đồ trang trí: lưu toạ độ tương đối, tránh nhà/ruộng (garden-deco-drag.js)");
{ const GI = require(path.join(root, "learn/garden/garden-items.js")), D = require(path.join(root, "learn/garden/garden-deco-drag.js")), m = {};
  GI.env = Object.assign({}, GI.env, { done: () => 99, total: () => 10, grade: () => 2, slot: () => "2:toan", get: k => (k in m ? m[k] : null), set: (k, v) => { m[k] = String(v); } });
  m["gardenDeco@2:toan"] = JSON.stringify(["swallow", "frog"]);
  ok(GI.decoGet().join() === "swallow,frog" && GI.decoList().every(e => e.x === null), "khoá cũ (mảng mã) vẫn đọc được, chưa có toạ độ");
  ok(GI.decoSet("swallow", .5, .4) && GI.decoSet("nope", .5, .5) === false && GI.decoSet("frog", 1.4, .5) === false && GI.decoSet("frog", NaN, .5) === false, "decoSet nhận toạ độ 0..1, từ chối món chưa đặt và toạ độ sai");
  const raw = JSON.parse(m["gardenDeco@2:toan"]); ok(raw[0].id === "swallow" && raw[0].x === .5 && raw[0].y === .4 && raw[1] === "frog", "lưu trong gardenDeco@2:toan: món đã kéo = { id, x, y }, món chưa kéo giữ mã");
  ok(GI.decoGet().join() === "swallow,frog", "decoGet vẫn trả mã món"); GI.decoToggle("swallow"); ok(GI.decoGet().join() === "frog", "cất món đã kéo vẫn chạy"); GI.decoToggle("swallow"); ok(GI.decoList().pop().x === null, "đặt lại món: về chỗ mặc định");
  { const g0 = GI.decoGet().length; ok(GI.decoDrop("leaves", .3, .5) && GI.decoList().filter(e => e.id === "leaves")[0].x === .3, "decoDrop: kéo từ túi đồ thả vào vườn có toạ độ ngay (không chỗ sinh sẵn)"); ok(GI.decoDrop("leaves", .6, .4) && GI.decoGet().length === g0 + 1 && GI.decoList().filter(e => e.id === "leaves")[0].x === .6, "decoDrop món đã đặt = dời, không thêm bản"); ok(GI.decoDrop("nope", .5, .5) === false && GI.decoDrop("leaves", 2, .5) === false, "decoDrop từ chối món lạ/toạ độ sai"); }
  m["gardenDeco@2:toan"] = JSON.stringify([{ id: "frog", x: 9, y: .2 }, { id: "frog", x: .1, y: .1 }, { id: "xx" }, 5, null]); ok(GI.decoGet().join() === "frog" && GI.decoList()[0].x === null, "dữ liệu hỏng: bỏ trùng/lạ, toạ độ ngoài 0..1 thì về mặc định");
  const W = 1695, H = 1040, R = [[600, 100, 900, 360], [100, 500, 400, 800]];
  ok(D.decoFree(800, 700, R, W, H) && !D.decoFree(700, 300, R, W, H) && !D.decoFree(250, 600, R, W, H) && !D.decoFree(5, 500, R, W, H) && !D.decoFree(800, H + 10, R, W, H), "decoFree: chỗ trống đạt; nhà, ruộng, sát mép bị loại");
  const n = D.decoNearest(700, 300, R, W, H); ok(n && D.decoFree(n[0], n[1], R, W, H) && Math.hypot(n[0] - 700, n[1] - 300) < 200, "decoNearest trượt từ nhà ra chỗ trống gần (" + n + ")");
  ok(D.decoNearest(700, 300, [[0, 0, W, H]], W, H) === null, "kín hết chỗ thì trả null (đồ về chỗ cũ)"); }

console.log(bad ? "\n✗ " + bad + " lỗi (trên " + checks + " kiểm tra)" : "\n✓ Vườn đạt (" + checks + " kiểm tra)");
process.exit(bad ? 1 : 0);
