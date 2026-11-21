/* Kiểm sao lưu / chuyển máy (learn/backup.js): node scripts/learn/check-backup.js */
"use strict";
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };
const mk = () => { const m = {}; return { m, get length() { return Object.keys(m).length; }, key: i => Object.keys(m)[i] ?? null, getItem: k => k in m ? m[k] : null, setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
global.window = global; global.localStorage = mk(); const A = global.localStorage;
const Farm = require("../../learn/farm.js"), B = require("../../learn/backup.js");
Farm.addSeeds(4); Farm.addCrop("wheat", 7); Farm.addStars(55);
A.setItem("learn:m:toan", JSON.stringify({ add10: { n: 9, ok: 8, p: .9, tags: {}, t: 1 } })); A.setItem("learn:grade", "3"); A.setItem("learn:subj", "tviet"); A.setItem("learn:limit", "30");
A.setItem("learn:trips", JSON.stringify({ "dao-so-01": { done: 1, best: 5 } })); A.setItem("gardenFarm", "{}"); A.setItem("gardenLv", "2");
A.setItem("learn:time:2026-11-20", "600"); A.setItem("theme", "dark"); A.setItem("learn:music", "0"); A.setItem("lang", "en"); A.setItem("evil", "x");
const f = B.collect(), keys = Object.keys(f.data);
ok(f.app === "hocvui" && f.v === 1 && keys.includes("learn:farm") && keys.includes("learn:m:toan") && keys.includes("learn:trips") && keys.includes("learn:stars"), "thiếu khoá tiến độ");
ok(!keys.some(k => /learn:time|theme|learn:music|^lang$|evil/.test(k)), "xuất nhầm khoá không thuộc danh sách");
ok(B.validate(JSON.parse(JSON.stringify(f))).ok, "tệp vừa xuất phải hợp lệ");
/* máy khác: kho trống, có sẵn dữ liệu cũ khác */
const wire = JSON.parse(JSON.stringify(f)); global.localStorage = mk(); const Z = global.localStorage; Z.setItem("learn:m:tanh", "{\"x\":1}"); Z.setItem("learn:farm", "{\"v\":1,\"seeds\":99}"); Z.setItem("theme", "light");
const n = B.apply(wire);
ok(n === keys.length, "số khoá đã ghi " + n);
ok(Z.getItem("learn:m:tanh") === null, "dữ liệu tiến độ cũ phải bị thay thế");
ok(Z.getItem("theme") === "light", "không được đụng khoá ngoài danh sách");
ok(Z.getItem("learn:grade") === "3" && Z.getItem("learn:stars") === "55" && Farm.get().seeds === 7 && Farm.cropTotal() === 7, "dữ liệu sau khi nạp: hạt " + Farm.get().seeds);
ok(!Z.getItem("learn:time:2026-11-20"), "không nạp thời gian chơi hôm nay");
/* tệp xấu: không ghi gì */
const before = JSON.stringify(Z.m);
const cases = { "app lạ": { app: "x", v: 1, data: {} }, "phiên bản": { app: "hocvui", v: 2, data: {} }, "không có data": { app: "hocvui", v: 1 }, "khoá lạ": { app: "hocvui", v: 1, data: { evil: "1" } }, "khoá nguy hiểm": JSON.parse('{"app":"hocvui","v":1,"data":{"__proto__":"1"}}'), "tệp rỗng": { app: "hocvui", v: 1, data: {} },
  "prefix lạ": { app: "hocvui", v: 1, data: { "learn:m:../../x": "{}" } }, "giá trị không phải chuỗi": { app: "hocvui", v: 1, data: { "learn:err": { a: 1 } } }, "json hỏng": { app: "hocvui", v: 1, data: { "learn:farm": "{oops" } },
  "lớp ngoài 1-5": { app: "hocvui", v: 1, data: { "learn:grade": "9" } }, "môn lạ": { app: "hocvui", v: 1, data: { "learn:subj": "ly" } }, "quá lớn": { app: "hocvui", v: 1, data: { "learn:farm": JSON.stringify({ a: "x".repeat(600000) }) } }, "null": null, "mảng": [], "data là mảng": { app: "hocvui", v: 1, data: [] } };
for (const k in cases) { let threw = false; try { B.apply(cases[k]); } catch (e) { threw = true; } ok(threw, "phải từ chối: " + k); }
ok(JSON.stringify(Z.m) === before, "tệp xấu đã làm đổi dữ liệu");
ok(/^hocvui-\d{8}\.json$/.test(B.filename()), "tên tệp");
console.log(bad ? "✗ " + bad + " lỗi" : "✓ Sao lưu đạt"); process.exit(bad ? 1 : 0);
