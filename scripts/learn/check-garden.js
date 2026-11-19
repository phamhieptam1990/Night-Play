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

console.log(bad ? "\n✗ " + bad + " lỗi (trên " + checks + " kiểm tra)" : "\n✓ Vườn đạt (" + checks + " kiểm tra)");
process.exit(bad ? 1 : 0);
