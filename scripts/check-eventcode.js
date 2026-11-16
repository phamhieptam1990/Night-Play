#!/usr/bin/env node
"use strict";
/* Bài đo bảo mật mã sự kiện (server/events.js): với MỌI game trong event-catalog, chạy mã Night Pass đã LỌC trên một PF mẫu và kiểm tra
   (1) PF.skins chỉ còn "basic" + đúng các giao diện được phép; (2) mọi thuộc tính khác của PF (chế độ/loại chơi, PF.pro, cờ…) y hệt trước khi chạy;
   (3) không có thuộc tính mới; (4) không đụng window/localStorage ngoài PF. Phải "✓ tất cả đạt" trước khi thêm game vào SUPPORTED.
   Chạy: node scripts/check-eventcode.js */
const path = require("path");
const ev = require(path.join(__dirname, "../server/events.js"))({ route() {}, out() {}, limited() {}, hmac: s => s, safeEq() {}, ipHash() {}, adminGuard() {}, noTable() {}, b64u: s => s, db: {} });
const CATALOG = require(path.join(__dirname, "../server/event-catalog.js"));
let fails = 0; const bad = m => { fails++; console.log("  ✗ " + m); };
const snap = PF => JSON.stringify(Object.fromEntries(Object.entries(PF).filter(([k]) => k !== "skins").map(([k, v]) => [k, typeof v === "function" ? "fn" : v])));
for (const g of CATALOG) {
  const all = g.skins.map(s => s.id), subsets = [[all[0]], all, [all[all.length - 1], all[0]]];
  for (const keep of subsets) {
    const mk = () => ({ pro: null, ticket: null, types: [true, false, false, false, false, false], skins: { basic: {} }, skinSel: "basic", D: {}, T: {} });
    const PF = mk(), before = snap(PF), keys0 = Object.keys(PF), touched = [];
    const win = new Proxy({}, { set(_, k) { touched.push(String(k)); return true }, get() { return undefined } });
    const el = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, append() {}, appendChild() {}, setAttribute() {}, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] });
    const doc = { getElementById: () => null, createElement: el, head: { appendChild() {} }, body: { appendChild() {} }, querySelector: () => null, documentElement: {} };
    try { new Function("PF", "window", "document", ev.filterSource(g.id, keep))(PF, win, doc); } catch (e) { bad(g.id + " [" + keep + "]: lỗi chạy: " + e.message); continue; }
    const got = Object.keys(PF.skins).filter(k => k !== "basic").sort(), want = [...keep].sort();
    if (JSON.stringify(got) !== JSON.stringify(want)) bad(g.id + ": giao diện " + got + " ≠ " + want);
    if (snap(PF) !== before) bad(g.id + " [" + keep + "]: thuộc tính ngoài skins bị đổi: " + snap(PF).slice(0, 160));
    const extra = Object.keys(PF).filter(k => !keys0.includes(k)); if (extra.length) bad(g.id + ": thuộc tính mới " + extra);
    if (PF.pro !== null) bad(g.id + ": PF.pro không được đặt");
    if (touched.length) bad(g.id + ": đụng window." + touched);
  }
  console.log((fails ? "" : "  ") + "· " + g.id + " (" + all.length + " giao diện × 3 tổ hợp)");
}
console.log(fails ? "✗ " + fails + " lỗi" : "✓ tất cả đạt"); process.exit(fails ? 1 : 0);
