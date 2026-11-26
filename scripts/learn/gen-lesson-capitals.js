#!/usr/bin/env node
/* Sinh bài LÀM QUEN CHỮ HOA lớp 1 môn Tiếng Việt (VI-G1-00d): learn/content/lessons/VI-G1-00d.js
   Cùng khuôn với các bài làm quen chữ (VI-G1-00, 00b, 00c): gặp bạn, tô theo, nghe tên chạm đúng bạn, bắn bóng bay, so chữ hoa với chữ thường.
   Chạy: node scripts/learn/gen-lesson-capitals.js   rồi   node scripts/learn/build-lessons.js
   Các bạn chữ hoa (A, Ă, Â, B, C, D) khai ở learn/content/buddies.js. */
"use strict";
const fs = require("fs"), path = require("path");
const L = [["A", "a hoa", "⛺", "cái lều"], ["Ă", "ă hoa", "👒", "chiếc nón"], ["Â", "ớ hoa", "🎩", "cái mũ nhọn"],
  ["B", "bờ hoa", "🐝", "chú ong"], ["C", "cờ hoa", "🌙", "mặt trăng"], ["D", "dờ hoa", "🥁", "cái trống"]];
const low = { A: "a", Ă: "ă", Â: "â", B: "b", C: "c", D: "d" };
const T = "Nghe tên rồi chạm vào đúng bạn nhé!", DONE = "Giỏi quá! Bé nhận ra các bạn rồi!";
const round = (x, i, pool) => ({ say: "Bạn " + x[1] + " đâu nào?", opts: [x[0]].concat(pool.filter(p => p !== x[0]).slice(i % 2, (i % 2) + 2)), ok: 0 });
const letters = L.map(x => x[0]);
const screens = [{ k: "say", t: "Xin chào! Hôm nay mình gặp các bạn chữ hoa nhé! Chạm vào chữ để nghe.", chips: L.map(x => [x[0], x[1]]) }];
L.forEach(x => { screens.push({ k: "meet", sym: x[0], t: "Gặp bạn " + x[1] + " nè! Chạm vào bạn để chào nhé!" },
  { k: "trace", sym: x[0], t: "Tô theo bạn " + x[1] + " nhé! Dùng ngón tay vẽ." }); });
screens.push({ k: "game", t: T, done: DONE, rounds: L.slice(0, 3).map((x, i) => round(x, i, letters.slice(0, 3).concat(["B"]))) });
screens.push({ k: "game", t: T, done: DONE, rounds: L.slice(3).map((x, i) => round(x, i, letters.slice(3).concat(["A"]))) });
screens.push({ k: "game", t: "Bạn nào cầm đồ vật này? Chạm vào nhé!", done: "Giỏi quá! Bé nhớ mặt các bạn rồi!",
  rounds: [L[0], L[2], L[3], L[4]].map((x, i) => ({ say: "Bạn nào cầm " + x[3] + "?", art: x[2], opts: [x[0]].concat(letters.filter(p => p !== x[0]).slice(i, i + 2)), ok: 0 })) });
screens.push({ k: "pop", target: "A", pool: ["A", "Ă", "Â", "B", "C", "D", "a", "b"], need: 3, t: "Bắn bóng bay! Chạm vào các bóng có A hoa nhé!" });
screens.push({ k: "game", t: "Chữ hoa to hơn chữ thường. Chạm vào chữ hoa nhé!", done: "Giỏi quá! Bé biết chữ hoa rồi!",
  rounds: ["A", "B", "C", "D"].map(u => ({ say: "Chữ nào là chữ hoa?", opts: [u, low[u]], ok: 0 })) });
screens.push({ k: "sum", t: "Bé nhớ nhé!", pts: ["Chữ hoa to hơn chữ thường", "Tên người và đầu câu viết bằng chữ hoa",
  "Tô chữ hoa bằng ngón tay giúp mình nhớ lâu"] });
const tryit = [
  { q: "Bạn nào là cái lều?", art: "⛺", opts: ["A", "C", "D"], ok: 0, hint: "Chữ A hoa như cái lều có thanh ngang.", yes: "Đúng rồi!" },
  { q: "Bạn nào là mặt trăng?", art: "🌙", opts: ["C", "B", "A"], ok: 0, hint: "Chữ C hoa cong như trăng khuyết.", yes: "Đúng rồi!" },
  { q: "Chữ nào là chữ hoa?", opts: ["b", "B"], ok: 1, hint: "Chữ hoa to hơn chữ thường.", yes: "Đúng rồi!" }
];
const title = "Làm quen chữ hoa: A, Ă, Â, B, C, D";
const out = "/* Bài LÀM QUEN lớp 1 · " + title + ": gặp bạn, tô theo, nghe tên chạm đúng bạn, bắn bóng bay, so chữ hoa với chữ thường.\n"
  + "   Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */\n"
  + "window.LearnLessons.reg(" + JSON.stringify({ id: "VI-G1-00d", grade: 1, subj: "tviet", title, screens, tryit }, null, 1) + ");\n";
fs.writeFileSync(path.join(__dirname, "../../learn/content/lessons/VI-G1-00d.js"), out);
console.log("✓ VI-G1-00d.js (" + screens.length + " màn)");
