/* Kiểm chỗ cắm đồng bộ (thời điểm sửa từng phần + bản chụp + gộp): node scripts/learn/check-sync.js */
"use strict";
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };
class Storage {}
const store = {}; 
Storage.prototype.getItem = function (k) { return k in store ? store[k] : null; };
Storage.prototype.setItem = function (k, v) { store[k] = String(v); };
Storage.prototype.removeItem = function (k) { delete store[k]; };
Storage.prototype.key = function (i) { return Object.keys(store)[i] ?? null; };
Object.defineProperty(Storage.prototype, "length", { get() { return Object.keys(store).length; } });
global.window = global; global.Storage = Storage; global.localStorage = new Storage(); global.sessionStorage = new Storage();
global.location = { search: "?grade=3&subj=toan" };
require("../../learn/slot.js"); const Slot = global.LearnSlot, B = require("../../learn/backup.js"), A = global.localStorage;
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  ok(Slot.id === "3:toan", "ngăn " + Slot.id);
  A.setItem("gardenLv", "2"); A.setItem("learn:stars", "10"); A.setItem("learn:time:2026-11-20", "100"); A.setItem("theme", "dark");
  const t = Slot.mtime("gardenLv@3:toan");
  ok(t > 0, "gardenLv phải có giờ sửa theo khoá đầy đủ có ngăn");
  ok(Slot.mtime("learn:stars") > 0, "learn:stars có giờ sửa");
  ok(!Slot.mtime("learn:time:2026-11-20") && !Slot.mtime("theme"), "không ghi giờ cho giờ chơi/giao diện");
  await sleep(450); ok(JSON.parse(store["learn:mt"])["learn:stars"] > 0, "learn:mt phải được ghi xuống");
  ok(!("learn:mt" in B.collect().data), "learn:mt không đi vào tệp sao lưu v1");
  const s1 = B.snapshot();
  ok(s1.v === 2 && s1.parts["learn:stars"] && s1.parts["learn:stars"].u > 0 && s1.parts["gardenLv@3:toan"].d === "2", "snapshot có d và u");
  ok(B.checkSnapshot(JSON.parse(JSON.stringify(s1))), "snapshot hợp lệ sau khi qua JSON");
  ok(!JSON.stringify(s1).match(/theme|learn:time/), "snapshot không có khoá ngoài danh sách");
  /* gộp: máy kia sửa sao muộn hơn, chủ đề khác nhau */
  const lp = "learn:pf:1:lp:3:toan";
  const a = { app: "hocvui", v: 2, at: 1, parts: { [lp]: { d: JSON.stringify({ t1: { l: 1, t: 1, b: 3, u: 100 }, t2: { l: 1, t: 0, b: 0, u: 300 } }), u: 300 }, "learn:stars": { d: "50", u: 100 }, "learn:grade": { d: "3", u: 500 } } };
  const b = { app: "hocvui", v: 2, at: 2, parts: { [lp]: { d: JSON.stringify({ t1: { l: 1, t: 2, b: 5, u: 200 }, t3: { l: 1, t: 1, b: 4, u: 250 } }), u: 250 }, "learn:stars": { d: "70", u: 200 }, "learn:grade": { d: "2", u: 400 }, "learn:farm": { d: "{}", u: 0 } } };
  const m = B.merge(a, b), tp = JSON.parse(m.parts[lp].d);
  ok(tp.t1.b === 5 && tp.t2 && tp.t3, "gộp theo từng chủ đề, bản mới hơn thắng");
  ok(m.parts["learn:stars"].d === "70" && m.parts["learn:grade"].d === "3" && m.parts["learn:farm"], "phần khác: bản mới hơn thắng, phần thiếu được thêm");
  const norm = o => JSON.stringify(o, (k, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v).sort().reduce((r, x) => (r[x] = typeof v[x] === "string" && v[x][0] === "{" ? JSON.parse(v[x]) : v[x], r), {}) : v);
  ok(norm(B.merge(a, b).parts) === norm(B.merge(b, a).parts), "gộp giao hoán");
  ok(JSON.stringify(B.merge(m, a).parts) === JSON.stringify(m.parts), "gộp lặp lại không đổi (idempotent)");
  /* áp dụng */
  Slot.setLegacy(); for (const k of Object.keys(store)) delete store[k];
  const n = B.applySnapshot(m); ok(n === 4 && store["learn:stars"] === "70" && Slot.mtime("learn:stars") === 200, "applySnapshot ghi " + n);
  for (const bad1 of [null, { app: "x", v: 2, parts: {} }, { app: "hocvui", v: 2, parts: {} }, { app: "hocvui", v: 2, parts: { evil: { d: "1", u: 1 } } }, { app: "hocvui", v: 2, parts: { "learn:farm": { d: 1, u: 1 } } }, { app: "hocvui", v: 2, parts: { "learn:farm": { d: "1", u: -1 } } }, { app: "hocvui", v: 1, parts: { "learn:farm": { d: "1", u: 1 } } }]) {
    let th = false; try { B.applySnapshot(bad1); } catch (e) { th = true; } ok(th, "phải từ chối snapshot xấu " + JSON.stringify(bad1).slice(0, 50));
  }
  console.log(bad ? "✗ " + bad + " lỗi" : "✓ Chỗ cắm đồng bộ đạt"); process.exit(bad ? 1 : 0);
})();
