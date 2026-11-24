/* Phần trình duyệt của AI luyện cùng (learn/coach.js): gọi từ check-coach.js */
"use strict";
const path = require("path"), root = path.join(__dirname, "../..");
module.exports = async function (ok) {
  const mkLs = () => { const m = {}; return { getItem: k => k in m ? m[k] : null, setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
  global.window = global; global.localStorage = mkLs();
  for (const f of ["learn/plus.js", "learn/coach.js"]) delete require.cache[require.resolve(path.join(root, f))];
  require(path.join(root, "learn/plus.js")); require(path.join(root, "learn/coach.js"));
  global.LearnSafe = require(path.join(root, "learn/content/safe-words.js")); delete global.LearnSafe;
  const C = global.LearnCoach, P = global.LearnPlus; let fetched = 0, mascot = [];
  global.LearnMascot = { event: e => mascot.push("event:" + e), react: o => mascot.push("react:" + o.text) };
  const req = { mode: "hint", q: "2 + 3 = ?", correct: "5", step: 0, subj: "toan", skill: "add", grade: 1 };
  global.fetch = async (u, i) => { fetched++; const b = JSON.parse(i.body); global.__last = { u, i, b }; return { ok: true, status: 200, json: async () => ({ ok: true, source: "ai", event: "hint", emotion: "think", steps: ["Đếm từng bước nhé"], text: "Mình đếm cùng nhé" }) }; };
  let r = await C.ask(req); ok(r.source === "fallback" && fetched === 0, "chưa bật cờ/chưa có Plus: không gọi mạng, rơi về gợi ý viết sẵn");
  localStorage.setItem("learn:plus:on", "1"); localStorage.setItem("learn:plus:test", "1"); P.useTestToken(P.makeTestToken(["coach"], 1));
  r = await C.ask(req); ok(P.has("coach") && fetched === 0 && r.source === "fallback", "token thử: không gửi lên máy chủ");
  P.clear(); localStorage.setItem("learn:plus", JSON.stringify({ token: "TOK", exp: Date.now() + 1e9, plan: "learn_month", features: ["coach"], at: Date.now() }));
  r = await C.ask(req); ok(r.source === "fallback", "thiếu bộ lọc ở trình duyệt: không hiện lời AI (đóng an toàn)"); fetched = 0; C.clearLog();
  global.LearnSafe = require(path.join(root, "learn/content/safe-words.js"));
  r = await C.ask(req); ok(r.source === "ai" && r.text === "Mình đếm cùng nhé" && fetched === 1, "có Plus: gọi máy chủ");
  ok(global.__last.i.headers.Authorization === "Bearer TOK" && global.__last.u === "/api/learn/coach", "gửi token Plus đến đúng đường");
  ok(!/name|email|kid|device/i.test(JSON.stringify(global.__last.b)), "yêu cầu không có thông tin cá nhân: " + Object.keys(global.__last.b).join());
  ok(mascot[0] === "event:thinking", "linh vật báo 'đang nghĩ' khi chờ");
  ok(C.say(r) && mascot.includes("react:Mình đếm cùng nhé"), "linh vật nói lời AI");
  ok(C.log().length === 1 && C.log()[0].text === "Mình đếm cùng nhé", "nhật ký trong ngày cho phụ huynh xem lại");
  P.setAi(false); r = await C.ask(req); ok(r.source === "fallback" && r.reason === "off" && fetched === 1, "phụ huynh tắt AI: không gọi mạng"); P.setAi(true);
  /* lọc lần hai ở trình duyệt */
  global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ ok: true, source: "ai", event: "hint", emotion: "think", steps: [], text: "Bé ngu quá" }) });
  r = await C.ask(req); ok(r.source === "fallback" && !r.text, "lời xấu lọt từ máy chủ vẫn bị trình duyệt chặn");
  global.fetch = async () => { throw new Error("offline"); }; mascot.length = 0;
  r = await C.ask(req); ok(r.source === "fallback" && r.reason === "network" && mascot.includes("event:offline"), "mất mạng: đường lui, linh vật báo offline");
  global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ ok: true, source: "fallback", reason: "quota", text: "" }) });
  r = await C.ask(req); ok(r.source === "fallback" && r.reason === "quota", "hết hạn mức: đường lui");
  global.fetch = async () => ({ ok: false, status: 402, json: async () => ({ reason: "plus_required" }) });
  r = await C.ask(req); ok(r.source === "fallback", "hết hạn Plus giữa chừng: đường lui, không lỗi");
  C.clearLog(); ok(C.log().length === 0, "xoá nhật ký");
};
